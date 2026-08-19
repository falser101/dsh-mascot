//#region src/host-lines.ts
/** One batch of AI-generated lines is cached this long before regenerating. */
const MASCOT_LINES_TTL_MS = 10 * 6e4;
/** Lines generated per batch (the client rotates them at ~1/5 of its cadence). */
const MASCOT_LINES_BATCH = 6;
/** Hard cap on one line's length; longer output is dropped as malformed. */
const MASCOT_LINE_MAX_CHARS = 40;
/** Token budget for one batch request. */
const MASCOT_LINES_MAX_TOKENS = 400;
/** The generation directive handed to the model as its system prompt. */
function mascotLinesPrompt(locale) {
	const tone = locale === "zh" ? "你是一只悬浮在 AI 编程工具界面上的小宠物（卡通猫/狗），陪用户工作。根据用户当前等待的状态，生成温暖、俏皮、不油腻的短文案。\n要求：\n1. 只输出 JSON 数组，如 [\"a\",\"b\",\"c\",\"d\",\"e\",\"f\"]，共 6 条，不要任何其他文字\n2. 每条不超过 20 个汉字\n3. 语气多样：温柔陪伴 / 俏皮卖萌 / 元气鼓励 各占一些\n4. 不要出现\"AI\"、\"模型\"、\"助手\"等词汇；不要解释；句式不要重复\n5. 语境：用户在等待 AI 干活或思考，文案要让人会心一笑或感到被陪伴" : "You are a small floating pet (cartoon cat/dog) on the user's AI coding tool UI, keeping the user company. Write short, warm, playful lines for someone waiting on the assistant.\nRequirements:\n1. Output ONLY a JSON array like [\"a\",\"b\",\"c\",\"d\",\"e\",\"f\"] with 6 lines and nothing else\n2. Each line at most 40 characters\n3. Vary the tone: gentle company / playful / energetic encouragement\n4. Never mention \"AI\", \"model\", or \"assistant\"; no explanations; no repeated sentence patterns\n5. Context: the user is waiting for the assistant to work or think — the line should raise a smile or feel like company";
	return tone;
}
/**
* Assemble the one-shot generation request for the configured default model.
* @param selection - the host's default model selection.
* @param locale - the line locale.
* @returns the streamable request.
*/
function buildMascotLinesOptions(selection, locale) {
	return {
		provider: selection.provider,
		model: selection.model,
		system: mascotLinesPrompt(locale),
		messages: [{
			id: crypto.randomUUID(),
			role: "user",
			content: [{
				type: "text",
				text: locale === "zh" ? "生成 6 条。" : "Generate 6 lines."
			}],
			source: {
				kind: "plugin",
				plugin: "@falser101/mascot"
			}
		}],
		temperature: 1.2,
		maxTokens: MASCOT_LINES_MAX_TOKENS
	};
}
/**
* Parse and validate the model's raw output into a line batch. Accepts a
* fenced JSON block; drops non-string, blank, and overlong entries and
* deduplicates; returns undefined for anything that is not a usable array.
* @param raw - the model's raw text output.
* @returns the validated batch, or undefined when malformed.
*/
function parseMascotLines(raw) {
	const cleaned = raw.trim().replace(/^```(?:json)?\s*/i, "").replace(/\s*```$/, "");
	if (cleaned === "") return void 0;
	let parsed;
	try {
		parsed = JSON.parse(cleaned);
	} catch {
		return void 0;
	}
	if (!Array.isArray(parsed)) return void 0;
	const lines = [];
	for (const entry of parsed) {
		if (typeof entry !== "string") continue;
		const line = entry.trim();
		if (line === "" || line.length > MASCOT_LINE_MAX_CHARS) continue;
		if (!lines.includes(line)) lines.push(line);
	}
	return lines.length === 0 ? void 0 : lines.slice(0, MASCOT_LINES_BATCH);
}
/**
* TTL-cached, concurrency-safe line batch service. A generation failure
* (throw, empty batch) keeps the previous batch; with no cache at all it
* serves an empty batch so the client falls back to built-in lines.
*/
var MascotLinesService = class {
	/**
	* @param generate - one batch generator (the LLM call).
	*/
	constructor(generate) {
		this.generate = generate;
	}
	/**
	* Resolve the current batch for one locale: the fresh cache, a freshly
	* generated batch (shared across concurrent callers), or the stale cache
	* when generation fails — finally an empty batch.
	* @param locale - the line locale.
	* @returns the batch to serve.
	*/
	async lines(locale) {
		const now = Date.now();
		const cached = this.cache;
		if (cached !== void 0 && now - cached.refreshedAt < MASCOT_LINES_TTL_MS) return cached;
		try {
			const lines = await this.generateFor(locale);
			if (lines.length > 0) {
				this.cache = {
					lines,
					refreshedAt: now
				};
				return this.cache;
			}
		} catch {}
		if (cached !== void 0) return cached;
		return {
			lines: [],
			refreshedAt: now
		};
	}
	generateFor(locale) {
		this.inFlight ??= this.generate(locale).finally(() => {
			this.inFlight = void 0;
		});
		return this.inFlight;
	}
};

//#endregion
//#region src/index.ts
/** Concatenate text-delta chunks; fall back to a closed text block. */
async function collectStreamText(stream) {
	let text = "";
	for await (const chunk of stream) if (chunk.type === "text-delta" && typeof chunk.text === "string") text += chunk.text;
	else if (chunk.type === "block-end" && chunk.block?.type === "text" && typeof chunk.block.text === "string" && text === "") text = chunk.block.text;
	return text;
}
/** Required services: the LLM runtime, the webserver, and the default model. */
const inject = [
	"llm",
	"webServer",
	"agentDefaultModel"
];
/** Route path the browser half fetches. */
const MASCOT_LINES_PATH = "/mascot/lines";
/**
* Host plugin body: register the lines route for the fiber's lifetime.
* @param ctx - host Cordis context.
*/
function apply(ctx) {
	ctx.effect(() => {
		let disposed = false;
		const service = new MascotLinesService(async (locale) => {
			if (disposed) return [];
			const selection = ctx.agentDefaultModel.currentSelection();
			const text = await collectStreamText(ctx.llm.stream(buildMascotLinesOptions(selection, locale)));
			if (disposed) return [];
			return parseMascotLines(text) ?? [];
		});
		const disposeRoute = ctx.webServer.register({
			kind: "exact",
			path: MASCOT_LINES_PATH,
			handler: async (req, res) => {
				if (disposed) {
					res.writeHead(503, { "content-type": "application/json; charset=utf-8" });
					res.end(JSON.stringify({ error: "mascot lines unavailable" }));
					return;
				}
				const locale = new URL(req.url ?? "/", "http://localhost").searchParams.get("locale") === "en" ? "en" : "zh";
				try {
					const result = await service.lines(locale);
					res.writeHead(200, { "content-type": "application/json; charset=utf-8" });
					res.end(JSON.stringify(result));
				} catch (error) {
					res.writeHead(503, { "content-type": "application/json; charset=utf-8" });
					res.end(JSON.stringify({ error: "mascot lines unavailable" }));
				}
			}
		});
		return () => {
			disposed = true;
			disposeRoute();
		};
	}, "mascot-lines: route");
}

//#endregion
export { MASCOT_LINES_PATH, apply, inject };