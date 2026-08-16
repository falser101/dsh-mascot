window.__ModuleLoader__.load({
	id: "@falser101/mascot",
	factory: (require) => {
		var module = { exports: {} };
		var exports = module.exports;
		Object.defineProperty(exports, Symbol.toStringTag, { value: "Module" });
		let _deepseek_ai_dsh_client_runtime_client = require("@deepseek-ai/dsh-client-runtime/client");
		let react = require("react");
		let react_jsx_runtime = require("react/jsx-runtime");
		let _deepseek_ai_dsh_client_ui_primitives = require("@deepseek-ai/dsh-client-ui-primitives");
		//#region src/client/locales.ts
		/** `mascot` namespace dictionaries. */
		/** Dictionary namespace owned by this plugin. */
		const NS = "mascot";
		/** Simplified Chinese dictionary (the key-set source of truth). */
		const zh = {
			"mood.idle": "我在呢，随时找我～",
			"idle.line.0": "我在呢，随时找我～",
			"idle.line.1": "专注干活吧，我陪着你～",
			"idle.line.2": "要不要喝口水歇一下？",
			"idle.line.3": "我在旁边守着，有事喊我～",
			"idle.line.4": "慢慢来，我等你～",
			"idle.line.5": "（伸了个懒腰）继续加油！",
			"mood.queued": "收到！排队开工",
			"mood.confirming.approval": "等你批准一下～",
			"mood.confirming.question": "有件事想问你～",
			"mood.thinking": "让我想想…",
			"mood.working": "正在调用「{tool}」",
			"mood.working.many": "正在调用「{tool}」等 {count} 个工具",
			"mood.streaming": "在写答案…",
			"mood.done": "搞定啦！🎉",
			"mood.error": "哎呀，出错了…",
			"mood.greeting": "你好呀！",
			"mood.elsewhere": "别处还有 {count} 个任务在忙",
			"hover.idle.0": "我在呢，随时找我～",
			"hover.idle.1": "偷偷看你干活中…",
			"hover.idle.2": "要不要歇会儿？",
			"hover.idle.3": "（伸了个懒腰）",
			"hover.idle.4": "今天的你也很棒！",
			"hover.queued": "马上就到你了～",
			"hover.confirming": "慢慢看，不着急～",
			"hover.thinking": "别着急，我在努力想～",
			"hover.working": "马上就好！",
			"hover.streaming": "快写完啦，再等一下下～",
			"hover.error": "抱抱，别难过，我们再试一次",
			"poke.0": "别戳我啦～",
			"poke.1": "痒痒的！喵？",
			"poke.2": "（打了个滚）",
			"poke.3": "再戳我可要生气啦！",
			"collapse.hint": "双击我回来～",
			"collapse.aria": "收起悬浮伙伴",
			"expand.aria": "唤出悬浮伙伴",
			"widget.aria": "悬浮伙伴",
			"skin.title": "悬浮伙伴形象",
			"skin.description": "选择悬浮在界面上的小伙伴",
			"skin.cat": "猫咪",
			"skin.dog": "狗狗",
			"skin.custom": "自定义形象",
			"bubble.title": "显示状态气泡",
			"bubble.description": "始终显示气泡与状态文字（关闭后仅在悬停时显示）",
			"ai.title": "AI 小剧场",
			"ai.description": "偶尔让模型生成一句俏皮话，关闭后仅用内置文案",
			"cadence.title": "闲置弹出频率",
			"cadence.description": "闲置时气泡自动弹出的频率",
			"cadence.quiet": "安静",
			"cadence.standard": "标准",
			"cadence.lively": "热闹",
			"peer.status.running": "运行中",
			"peer.status.stopping": "停止中",
			"badge.label": "{count} 个任务在跑"
		};
		/** English dictionary, key-identical to the Chinese source of truth. */
		const en = {
			"mood.idle": "Here whenever you need me～",
			"idle.line.0": "Here whenever you need me～",
			"idle.line.1": "Focus on work, I will keep you company～",
			"idle.line.2": "Care for a sip of water and a break?",
			"idle.line.3": "I am right here, call me anytime～",
			"idle.line.4": "Take your time, I will wait～",
			"idle.line.5": "（stretches）Keep going!",
			"mood.queued": "Got it! Joining the queue",
			"mood.confirming.approval": "Waiting for your approval～",
			"mood.confirming.question": "Something to ask you～",
			"mood.thinking": "Let me think…",
			"mood.working": "Running 「{tool}」",
			"mood.working.many": "Running 「{tool}」 and {count} more tools",
			"mood.streaming": "Writing the answer…",
			"mood.done": "Done! 🎉",
			"mood.error": "Oops, something went wrong…",
			"mood.greeting": "Hi there!",
			"mood.elsewhere": "Other tasks are busy elsewhere ({count})",
			"hover.idle.0": "Here whenever you need me～",
			"hover.idle.1": "Quietly watching you work…",
			"hover.idle.2": "Care for a break?",
			"hover.idle.3": "（stretches）",
			"hover.idle.4": "You're doing great today!",
			"hover.queued": "You're next, almost there～",
			"hover.confirming": "Take your time～",
			"hover.thinking": "Hold on, I am thinking hard～",
			"hover.working": "Almost done!",
			"hover.streaming": "Almost finished writing, one more moment～",
			"hover.error": "Hugs, do not worry — let us try again",
			"poke.0": "Stop poking me～",
			"poke.1": "That tickles! Meow?",
			"poke.2": "（rolled over）",
			"poke.3": "Poke me again and I will get mad!",
			"collapse.hint": "Double-click to bring me back～",
			"collapse.aria": "Collapse the companion",
			"expand.aria": "Bring back the companion",
			"widget.aria": "Floating companion",
			"skin.title": "Companion look",
			"skin.description": "Choose the companion floating over the UI",
			"skin.cat": "Cat",
			"skin.dog": "Dog",
			"skin.custom": "Custom art",
			"bubble.title": "Show status bubble",
			"bubble.description": "Keep the bubble with status text always visible (off: only on hover)",
			"ai.title": "AI vignettes",
			"ai.description": "Occasionally let the model write a playful line (off: built-in lines only)",
			"cadence.title": "Idle pop-up cadence",
			"cadence.description": "How often the bubble pops up while idle",
			"cadence.quiet": "Quiet",
			"cadence.standard": "Standard",
			"cadence.lively": "Lively",
			"peer.status.running": "running",
			"peer.status.stopping": "stopping",
			"badge.label": "{count} tasks running"
		};
		/** Corner margin in px applied to the default position. */
		const MASCOT_MARGIN = 24;
		/** Default drop position: bottom-right of the viewport at first boot. */
		function defaultPosition() {
			if (typeof window === "undefined") return {
				x: MASCOT_MARGIN,
				y: MASCOT_MARGIN
			};
			return {
				x: Math.max(MASCOT_MARGIN, window.innerWidth - 96 - MASCOT_MARGIN),
				y: Math.max(MASCOT_MARGIN, window.innerHeight - 96 - MASCOT_MARGIN)
			};
		}
		/** Store declaration: one persisted root-scope instance shared by all entries. */
		const createMascotStore = () => (0, _deepseek_ai_dsh_client_runtime_client.defineStore)({
			init: () => ({
				...defaultPosition(),
				collapsed: false,
				skin: "cat",
				bubbleAlways: true,
				aiLines: true,
				popCadence: "standard"
			}),
			persist: "dsh-client-ui-mascot",
			actions: {
				move: (draft, x, y) => {
					draft.x = x;
					draft.y = y;
				},
				setCollapsed: (draft, collapsed) => {
					draft.collapsed = collapsed;
				},
				setSkin: (draft, skin) => {
					draft.skin = skin;
				},
				setBubbleAlways: (draft, bubbleAlways) => {
					draft.bubbleAlways = bubbleAlways;
				},
				setAiLines: (draft, aiLines) => {
					draft.aiLines = aiLines;
				},
				setPopCadence: (draft, cadence) => {
					draft.popCadence = cadence;
				}
			}
		});
		//#endregion
		//#region src/client/mascot-source.ts
		/** How long a transient mood (greeting/done) stays before folding back. */
		const MASCOT_TRANSIENT_MS = 4e3;
		const EMPTY_TURN_ENDS = /* @__PURE__ */ new Map();
		function steady(mood, textKey, params) {
			return {
				mood,
				textKey,
				...params === void 0 ? {} : { params }
			};
		}
		function transient(mood) {
			return {
				mood,
				textKey: `mood.${mood}`,
				until: Date.now() + MASCOT_TRANSIENT_MS
			};
		}
		/** Fallback copy for a merged future pending kind (see the documented default). */
		const FALLBACK_CONFIRMING_KEY = "mood.confirming.approval";
		function confirmingKey(kind) {
			switch (kind) {
				case "approval": return "mood.confirming.approval";
				case "question": return "mood.confirming.question";
				default: return FALLBACK_CONFIRMING_KEY;
			}
		}
		function streamingText(partial) {
			if (partial === null) return false;
			return partial.blocks.some((block) => (block.kind === "text" || block.kind === "reasoning") && block.text.length > 0);
		}
		/**
		* Fold one conversation snapshot into the steady mood, honoring transitions
		* (session switch greeting, turn-end celebration) against the fold's own
		* previous evidence. Priority: error, greeting, confirming, queued, working,
		* streaming, thinking, done, idle.
		* @param snapshot - the session's current conversation snapshot.
		* @param lastSeenSessionId - the session id the previous fold derived from.
		* @param lastTurnEnds - the previous fold's turn-end map.
		* @returns the next published mood frame (without the busy context).
		*/
		function deriveMascotState(snapshot, lastSeenSessionId, lastTurnEnds) {
			if (snapshot.lastAgentError !== null) return steady("error", "mood.error");
			if (snapshot.sessionId !== lastSeenSessionId) {
				if (!snapshot.running) return transient("greeting");
			} else if (!snapshot.running && turnEndsAdvanced(snapshot.turnEnds, lastTurnEnds)) return transient("done");
			if (snapshot.pending.length > 0) return steady("confirming", confirmingKey(snapshot.pending[0].kind));
			if (snapshot.queue.length > 0 && !snapshot.running) return steady("queued", "mood.queued");
			if (snapshot.runningCalls.length > 0) {
				const tool = snapshot.runningCalls[0].name;
				if (snapshot.runningCalls.length > 1) return steady("working", "mood.working.many", {
					tool,
					count: snapshot.runningCalls.length
				});
				return steady("working", "mood.working", { tool });
			}
			if (snapshot.running && streamingText(snapshot.partial)) return steady("streaming", "mood.streaming");
			if (snapshot.running) return steady("thinking", "mood.thinking");
			return steady("idle", "mood.idle");
		}
		function turnEndsAdvanced(next, previous) {
			for (const [turn, seq] of next) {
				const before = previous.get(turn);
				if (before === void 0 || seq > before) return true;
			}
			return false;
		}
		/**
		* Derive the parallel-execution context from the session list: the current
		* session when active, every other running session (subagent rows included),
		* running children of loaded subagent catalogs, and live background jobs
		* across sessions (deduplicated by job id).
		* @param list - the sessions list snapshot.
		* @param current - the current session's conversation snapshot.
		* @returns the busy count and ordered peer list.
		*/
		function deriveBusyContext(list, current) {
			const peers = [];
			if (current.running || current.pending.length > 0 || current.queue.length > 0) {
				const currentMood = deriveMascotState(current, current.sessionId, EMPTY_TURN_ENDS);
				peers.push({
					id: current.sessionId,
					label: list.byId[current.sessionId]?.displayTitle ?? current.sessionId,
					kind: "session",
					statusKey: currentMood.textKey,
					statusParams: currentMood.params,
					current: true
				});
			}
			for (const id of list.ids) {
				if (id === current.sessionId) continue;
				const summary = list.byId[id];
				if (summary === void 0 || !summary.running) continue;
				peers.push({
					id,
					label: summary.displayTitle,
					kind: summary.origin === "subagent" ? "subagent" : "session",
					statusKey: "peer.status.running"
				});
			}
			for (const catalog of Object.values(list.subagentsByParent)) {
				if (catalog.state !== "ready") continue;
				for (const entry of catalog.entries) {
					if (entry.kind !== "child" || entry.activity !== "running") continue;
					const id = String(entry.id);
					if (peers.some((peer) => peer.id === id)) continue;
					peers.push({
						id,
						label: entry.label ?? id,
						kind: "subagent",
						statusKey: "peer.status.running"
					});
				}
			}
			const seenJobs = /* @__PURE__ */ new Set();
			for (const jobs of Object.values(list.jobsBySession)) for (const job of jobs) {
				if (job.status !== "running" && job.status !== "stopping") continue;
				if (seenJobs.has(job.id)) continue;
				seenJobs.add(job.id);
				peers.push({
					id: `job:${job.id}`,
					label: job.label,
					kind: "job",
					statusKey: job.status === "running" ? "peer.status.running" : "peer.status.stopping"
				});
			}
			return {
				busyCount: peers.length,
				peers
			};
		}
		function sameFrame(a, b) {
			if (a.mood !== b.mood || a.textKey !== b.textKey) return false;
			if (a.params?.tool !== b.params?.tool || a.params?.count !== b.params?.count) return false;
			if (a.busyCount !== b.busyCount) return false;
			if (a.peers.length !== b.peers.length) return false;
			return a.peers.every((peer, index) => {
				const other = b.peers[index];
				return other !== void 0 && peer.id === other.id && peer.label === other.label && peer.kind === other.kind && peer.statusKey === other.statusKey && peer.statusParams?.tool === other.statusParams?.tool;
			});
		}
		/**
		* Live fold source: subscribes to the sessions list (current selection plus
		* parallel activity) and the selected session's snapshot, and republishes
		* the derived frame. Disposal detaches both subscriptions and any pending
		* transient timer.
		*/
		var MascotSource = class {
			sessions;
			state = {
				...steady("idle", "mood.idle"),
				busyCount: 0,
				peers: []
			};
			listeners = /* @__PURE__ */ new Set();
			detach = [];
			transientTimer;
			currentSession;
			lastSnapshot;
			lastSeenSessionId;
			lastTurnEnds = EMPTY_TURN_ENDS;
			/**
			* @param sessions - the client sessions service (list + bindings).
			*/
			constructor(sessions) {
				this.sessions = sessions;
				this.detach.push(sessions.list.subscribe(() => this.onListChange()));
				this.onListChange();
			}
			getSnapshot() {
				return this.state;
			}
			subscribe(listener) {
				this.listeners.add(listener);
				return () => {
					this.listeners.delete(listener);
				};
			}
			/** Detach the list and session subscriptions and cancel the transient timer. */
			dispose() {
				for (const detach of this.detach.splice(0)) detach();
				if (this.transientTimer !== void 0) {
					clearTimeout(this.transientTimer);
					this.transientTimer = void 0;
				}
				this.currentSession = void 0;
				this.lastSnapshot = void 0;
			}
			onListChange() {
				const before = this.currentSession;
				this.syncSession();
				if (before === this.currentSession && this.lastSnapshot !== void 0) this.fold(this.lastSnapshot);
			}
			syncSession() {
				const current = this.sessions.list.getSnapshot().current;
				if (current === this.currentSession) return;
				for (const detach of this.detach.splice(1)) detach();
				this.currentSession = current;
				this.lastSeenSessionId = void 0;
				this.lastTurnEnds = EMPTY_TURN_ENDS;
				if (current === void 0) {
					this.emit({
						...steady("idle", "mood.idle"),
						busyCount: 0,
						peers: []
					});
					return;
				}
				const session = this.sessions.binding(current)?.session;
				if (session === void 0) return;
				this.detach.push(session.subscribe(() => this.fold(session.getSnapshot())));
				this.fold(session.getSnapshot());
			}
			fold(snapshot) {
				this.lastSnapshot = snapshot;
				let next = deriveMascotState(snapshot, this.lastSeenSessionId, this.lastTurnEnds);
				this.lastSeenSessionId = snapshot.sessionId;
				this.lastTurnEnds = snapshot.turnEnds;
				const busy = deriveBusyContext(this.sessions.list.getSnapshot(), snapshot);
				if (next.mood === "idle" && busy.busyCount > 0) next = steady("elsewhere", "mood.elsewhere", { count: busy.busyCount });
				this.emit({
					...next,
					...busy
				});
			}
			emit(next) {
				if (sameFrame(this.state, next)) return;
				this.state = next;
				if (this.transientTimer !== void 0) {
					clearTimeout(this.transientTimer);
					this.transientTimer = void 0;
				}
				if (next.until !== void 0) this.transientTimer = setTimeout(() => {
					this.transientTimer = void 0;
					if (this.lastSnapshot !== void 0) this.fold(this.lastSnapshot);
				}, MASCOT_TRANSIENT_MS);
				for (const listener of [...this.listeners]) listener();
			}
		};
		//#endregion
		//#region src/client/mascot-lines.ts
		/** Built-in idle pool keys, cycled in order. */
		const IDLE_LINE_KEYS = [
			"idle.line.0",
			"idle.line.1",
			"idle.line.2",
			"idle.line.3",
			"idle.line.4",
			"idle.line.5"
		];
		/** localStorage key for the persisted AI line pool. */
		const MASCOT_LINES_STORAGE_KEY = "dsh-mascot-lines";
		function loadPersisted() {
			if (typeof localStorage === "undefined") return void 0;
			try {
				const raw = localStorage.getItem(MASCOT_LINES_STORAGE_KEY);
				if (raw === null) return void 0;
				const parsed = JSON.parse(raw);
				if (!Array.isArray(parsed.lines) || typeof parsed.refreshedAt !== "number") return void 0;
				return {
					lines: parsed.lines.filter((line) => typeof line === "string"),
					refreshedAt: parsed.refreshedAt
				};
			} catch {
				return;
			}
		}
		function savePersisted(pool) {
			if (typeof localStorage === "undefined") return;
			try {
				localStorage.setItem(MASCOT_LINES_STORAGE_KEY, JSON.stringify(pool));
			} catch {}
		}
		/**
		* The idle-line observable source. Start publishes the first built-in line
		* synchronously, then rotates on every tick; AI pool refills are requested
		* asynchronously and never block rotation.
		*/
		var MascotLineSource = class {
			options;
			current = IDLE_LINE_KEYS[0];
			listeners = /* @__PURE__ */ new Set();
			intervalMs;
			aiQueue;
			aiEnabled = true;
			builtinIndex = 0;
			ticksSinceAi = 0;
			fetchInFlight = false;
			timer;
			/**
			* @param options - rotation dependencies.
			*/
			constructor(options) {
				this.options = options;
				this.intervalMs = options.intervalMs ?? 3e4;
				const persisted = (options.load ?? loadPersisted)();
				this.aiQueue = [...persisted?.lines ?? []];
			}
			/** Publish the first line and start the rotation timer. */
			start() {
				this.timer = setInterval(() => {
					this.advance();
				}, this.intervalMs);
				this.refillIfNeeded();
			}
			getSnapshot() {
				return this.current;
			}
			subscribe(listener) {
				this.listeners.add(listener);
				return () => {
					this.listeners.delete(listener);
				};
			}
			/** Apply the user's AI-lines preference to the rotator. */
			setAiEnabled(enabled) {
				this.aiEnabled = enabled;
				if (enabled) this.refillIfNeeded();
			}
			/** Stop the rotation timer and any in-flight refill. */
			dispose() {
				if (this.timer !== void 0) {
					clearInterval(this.timer);
					this.timer = void 0;
				}
			}
			advance() {
				this.ticksSinceAi += 1;
				if (this.aiEnabled && this.ticksSinceAi >= 5 && this.aiQueue.length > 0) {
					this.ticksSinceAi = 0;
					this.current = "ai:" + this.aiQueue.shift();
				} else {
					this.builtinIndex = (this.builtinIndex + 1) % IDLE_LINE_KEYS.length;
					this.current = IDLE_LINE_KEYS[this.builtinIndex];
				}
				for (const listener of [...this.listeners]) listener();
				if (this.aiQueue.length === 0) this.refillIfNeeded();
			}
			refillIfNeeded() {
				if (!this.aiEnabled || this.fetchInFlight) return;
				this.fetchInFlight = true;
				this.options.fetchLines(this.options.locale()).then((lines) => {
					if (lines.length === 0) return;
					const pool = {
						lines,
						refreshedAt: Date.now()
					};
					this.aiQueue.push(...lines);
					(this.options.save ?? savePersisted)(pool);
				}, () => {}).finally(() => {
					this.fetchInFlight = false;
				});
			}
		};
		//#endregion
		//#region \0dsh-css:/home/falser/Projects/dsh-mascot/src/client/character/CatSkin.module.css.mjs
		const css$6 = ".IdhSOW_root{width:100%;height:100%;overflow:visible}.IdhSOW_body{transform-box:fill-box;transform-origin:50%}.IdhSOW_head{transform-box:fill-box;transform-origin:50% 62%}.IdhSOW_earL,.IdhSOW_earR{transform-box:fill-box;transform-origin:50% 12%}.IdhSOW_eyeL,.IdhSOW_eyeR{transform-box:fill-box;transform-origin:50%}.IdhSOW_tail{transform-box:fill-box;transform-origin:0 60%}.IdhSOW_sweat,.IdhSOW_tear,.IdhSOW_sparkle{opacity:0;transform-box:fill-box;transform-origin:50%}.IdhSOW_root[data-mood=idle] .IdhSOW_body{animation:2.8s ease-in-out infinite IdhSOW_mascot-breathe}.IdhSOW_root .IdhSOW_eyeL,.IdhSOW_root .IdhSOW_eyeR{animation:4.2s infinite IdhSOW_mascot-blink}@keyframes IdhSOW_mascot-breathe{0%,to{transform:scale(1)}50%{transform:scale(1.035,.97)}}@keyframes IdhSOW_mascot-blink{0%,90%,to{transform:scaleY(1)}94%{transform:scaleY(.12)}}.IdhSOW_root[data-mood=queued]{animation:.6s ease-in-out infinite IdhSOW_mascot-hop}@keyframes IdhSOW_mascot-hop{0%,to{transform:translateY(0)}30%{transform:translateY(-7px)}60%{transform:translateY(0)}75%{transform:translateY(-3px)}}.IdhSOW_root[data-mood=confirming] .IdhSOW_head{animation:1.8s ease-in-out infinite IdhSOW_mascot-tilt}.IdhSOW_root[data-mood=confirming] .IdhSOW_eyeL{animation:1.8s ease-in-out infinite IdhSOW_mascot-look}@keyframes IdhSOW_mascot-tilt{0%,to{transform:rotate(0)}50%{transform:rotate(7deg)}}@keyframes IdhSOW_mascot-look{0%,to{transform:translate(1.5px,-1px)}50%{transform:translate(0)}}.IdhSOW_root[data-mood=thinking] .IdhSOW_head{animation:2s ease-in-out infinite IdhSOW_mascot-think}.IdhSOW_root[data-mood=thinking] .IdhSOW_eyeL,.IdhSOW_root[data-mood=thinking] .IdhSOW_eyeR{animation:2s ease-in-out infinite IdhSOW_mascot-squint}@keyframes IdhSOW_mascot-think{0%,to{transform:rotate(-3deg)}50%{transform:rotate(5deg)}}@keyframes IdhSOW_mascot-squint{0%,to{transform:scaleY(.72)}50%{transform:scaleY(1)}}.IdhSOW_root[data-mood=working] .IdhSOW_head{animation:.5s ease-in-out infinite IdhSOW_mascot-busy}.IdhSOW_root[data-mood=working] .IdhSOW_sweat{opacity:1;animation:1.4s linear infinite IdhSOW_mascot-sweat}@keyframes IdhSOW_mascot-busy{0%,to{transform:rotate(0)}25%{transform:rotate(2.2deg)}75%{transform:rotate(-2.2deg)}}@keyframes IdhSOW_mascot-sweat{0%{opacity:0;transform:translateY(0)}22%{opacity:1}to{opacity:0;transform:translateY(11px)}}.IdhSOW_root[data-mood=streaming] .IdhSOW_eyeL,.IdhSOW_root[data-mood=streaming] .IdhSOW_eyeR{animation:.9s ease-in-out infinite alternate IdhSOW_mascot-glance}@keyframes IdhSOW_mascot-glance{0%{transform:translate(1.6px)}to{transform:translate(-1.6px)}}.IdhSOW_root[data-mood=done]{animation:.9s ease-in-out 2 IdhSOW_mascot-celebrate}.IdhSOW_root[data-mood=done] .IdhSOW_sparkle{opacity:1;animation:.9s ease-in-out 2 IdhSOW_mascot-sparkle}.IdhSOW_root[data-mood=done] .IdhSOW_eyeL,.IdhSOW_root[data-mood=done] .IdhSOW_eyeR{animation:.9s ease-in-out 2 IdhSOW_mascot-happy-eye}@keyframes IdhSOW_mascot-celebrate{0%,to{transform:translateY(0)rotate(0)}35%{transform:translateY(-10px)rotate(-4deg)}65%{transform:translateY(-5px)rotate(4deg)}}@keyframes IdhSOW_mascot-sparkle{0%,to{opacity:0;transform:scale(.4)rotate(0)}50%{opacity:1;transform:scale(1)rotate(20deg)}}@keyframes IdhSOW_mascot-happy-eye{0%,to{transform:scaleY(.72)}50%{transform:scaleY(.72)translateY(-1px)}}.IdhSOW_root[data-mood=error]{animation:.35s linear infinite IdhSOW_mascot-shake}.IdhSOW_root[data-mood=error] .IdhSOW_tear{opacity:1;animation:1.6s linear infinite IdhSOW_mascot-tear}@keyframes IdhSOW_mascot-shake{0%,to{transform:translate(0)}25%{transform:translate(-2.6px)}75%{transform:translate(2.6px)}}@keyframes IdhSOW_mascot-tear{0%{opacity:0;transform:translateY(-2px)}25%{opacity:1}to{opacity:0;transform:translateY(9px)}}.IdhSOW_root[data-mood=greeting] .IdhSOW_tail{animation:.5s ease-in-out infinite alternate IdhSOW_mascot-wag}@keyframes IdhSOW_mascot-wag{0%{transform:rotate(-14deg)}to{transform:rotate(14deg)}}.IdhSOW_root[data-dragging=true] *,.IdhSOW_root[data-dragging=true]{animation:none!important}@media (prefers-reduced-motion:reduce){.IdhSOW_root,.IdhSOW_root *{animation:none!important}}";
		const tagId$6 = "@falser101/mascot/CatSkin.module.css";
		if (typeof document !== "undefined" && document.querySelector("style[data-plugin-css=" + JSON.stringify(tagId$6) + "]") === null) {
			const tag = document.createElement("style");
			tag.dataset.plugin = "@falser101/mascot";
			tag.dataset.pluginCss = tagId$6;
			tag.textContent = css$6;
			document.head.appendChild(tag);
		}
		var CatSkin_module_css_default = {
			"mascot-think": "IdhSOW_mascot-think",
			"eyeR": "IdhSOW_eyeR",
			"mascot-sweat": "IdhSOW_mascot-sweat",
			"mascot-sparkle": "IdhSOW_mascot-sparkle",
			"mascot-squint": "IdhSOW_mascot-squint",
			"mascot-tear": "IdhSOW_mascot-tear",
			"sweat": "IdhSOW_sweat",
			"earL": "IdhSOW_earL",
			"eyeL": "IdhSOW_eyeL",
			"mascot-glance": "IdhSOW_mascot-glance",
			"mascot-wag": "IdhSOW_mascot-wag",
			"mascot-hop": "IdhSOW_mascot-hop",
			"tail": "IdhSOW_tail",
			"tear": "IdhSOW_tear",
			"mascot-breathe": "IdhSOW_mascot-breathe",
			"mascot-look": "IdhSOW_mascot-look",
			"mascot-shake": "IdhSOW_mascot-shake",
			"root": "IdhSOW_root",
			"mascot-tilt": "IdhSOW_mascot-tilt",
			"earR": "IdhSOW_earR",
			"mascot-busy": "IdhSOW_mascot-busy",
			"mascot-blink": "IdhSOW_mascot-blink",
			"sparkle": "IdhSOW_sparkle",
			"mascot-celebrate": "IdhSOW_mascot-celebrate",
			"mascot-happy-eye": "IdhSOW_mascot-happy-eye",
			"head": "IdhSOW_head"
		};
		//#endregion
		//#region src/client/character/CatSkin.tsx
		/**
		* The cat's SVG body. The root carries `data-mood`/`data-dragging` for the
		* CSS selector ladder; all geometry lives in the 120×120 viewBox.
		* @param props - skin props from the widget.
		*/
		const CatSkin = ({ mood, dragging }) => /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("svg", {
			className: CatSkin_module_css_default.root,
			"data-mood": mood,
			"data-dragging": dragging,
			viewBox: "0 0 120 120",
			role: "img",
			"aria-hidden": "true",
			children: [
				/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("defs", { children: [/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("linearGradient", {
					id: "mascot-cat-fur",
					x1: "0",
					y1: "0",
					x2: "0",
					y2: "1",
					children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)("stop", {
						offset: "0",
						stopColor: "#f9c784"
					}), /* @__PURE__ */ (0, react_jsx_runtime.jsx)("stop", {
						offset: "1",
						stopColor: "#e89a5b"
					})]
				}), /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("linearGradient", {
					id: "mascot-cat-ear",
					x1: "0",
					y1: "0",
					x2: "0",
					y2: "1",
					children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)("stop", {
						offset: "0",
						stopColor: "#f2a86e"
					}), /* @__PURE__ */ (0, react_jsx_runtime.jsx)("stop", {
						offset: "1",
						stopColor: "#e0834a"
					})]
				})] }),
				/* @__PURE__ */ (0, react_jsx_runtime.jsx)("path", {
					className: CatSkin_module_css_default.tail,
					d: "M 90 92 Q 111 94 106 70 Q 103 56 92 60",
					fill: "none",
					stroke: "url(#mascot-cat-fur)",
					strokeWidth: "9",
					strokeLinecap: "round"
				}),
				/* @__PURE__ */ (0, react_jsx_runtime.jsx)("ellipse", {
					className: CatSkin_module_css_default.body,
					cx: "60",
					cy: "94",
					rx: "33",
					ry: "22",
					fill: "url(#mascot-cat-fur)"
				}),
				/* @__PURE__ */ (0, react_jsx_runtime.jsx)("path", {
					className: CatSkin_module_css_default.earL,
					d: "M 35 43 L 26 14 Q 32 9 41 16 L 50 33 Q 45 42 35 43 Z",
					fill: "url(#mascot-cat-ear)"
				}),
				/* @__PURE__ */ (0, react_jsx_runtime.jsx)("path", {
					className: CatSkin_module_css_default.earR,
					d: "M 85 43 L 94 14 Q 88 9 79 16 L 70 33 Q 75 42 85 43 Z",
					fill: "url(#mascot-cat-ear)"
				}),
				/* @__PURE__ */ (0, react_jsx_runtime.jsx)("path", {
					className: CatSkin_module_css_default.earInL,
					d: "M 36 38 L 30 19 Q 34 16 39 21 L 44 32 Q 41 38 36 38 Z",
					fill: "#f7c8a0"
				}),
				/* @__PURE__ */ (0, react_jsx_runtime.jsx)("path", {
					className: CatSkin_module_css_default.earInR,
					d: "M 84 38 L 90 19 Q 86 16 81 21 L 76 32 Q 79 38 84 38 Z",
					fill: "#f7c8a0"
				}),
				/* @__PURE__ */ (0, react_jsx_runtime.jsx)("circle", {
					className: CatSkin_module_css_default.head,
					cx: "60",
					cy: "56",
					r: "31",
					fill: "url(#mascot-cat-fur)"
				}),
				/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("g", {
					className: CatSkin_module_css_default.whiskers,
					stroke: "#c98f63",
					strokeWidth: "1.4",
					strokeLinecap: "round",
					children: [
						/* @__PURE__ */ (0, react_jsx_runtime.jsx)("path", { d: "M 27 57 L 13 54" }),
						/* @__PURE__ */ (0, react_jsx_runtime.jsx)("path", { d: "M 27 63 L 13 63" }),
						/* @__PURE__ */ (0, react_jsx_runtime.jsx)("path", { d: "M 27 69 L 15 72" }),
						/* @__PURE__ */ (0, react_jsx_runtime.jsx)("path", { d: "M 93 57 L 107 54" }),
						/* @__PURE__ */ (0, react_jsx_runtime.jsx)("path", { d: "M 93 63 L 107 63" }),
						/* @__PURE__ */ (0, react_jsx_runtime.jsx)("path", { d: "M 93 69 L 105 72" })
					]
				}),
				/* @__PURE__ */ (0, react_jsx_runtime.jsx)("ellipse", {
					className: CatSkin_module_css_default.blush,
					cx: "41",
					cy: "63",
					rx: "5.5",
					ry: "3.4",
					fill: "#ffb3a7",
					opacity: "0.55"
				}),
				/* @__PURE__ */ (0, react_jsx_runtime.jsx)("ellipse", {
					className: CatSkin_module_css_default.blush,
					cx: "79",
					cy: "63",
					rx: "5.5",
					ry: "3.4",
					fill: "#ffb3a7",
					opacity: "0.55"
				}),
				/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("g", {
					className: CatSkin_module_css_default.eyeL,
					children: [
						/* @__PURE__ */ (0, react_jsx_runtime.jsx)("ellipse", {
							cx: "48",
							cy: "54",
							rx: "5.6",
							ry: "6.6",
							fill: "#ffffff"
						}),
						/* @__PURE__ */ (0, react_jsx_runtime.jsx)("circle", {
							cx: "48.6",
							cy: "55.6",
							r: "2.9",
							fill: "#3b2f2a"
						}),
						/* @__PURE__ */ (0, react_jsx_runtime.jsx)("circle", {
							cx: "47.6",
							cy: "54.2",
							r: "1",
							fill: "#ffffff"
						})
					]
				}),
				/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("g", {
					className: CatSkin_module_css_default.eyeR,
					children: [
						/* @__PURE__ */ (0, react_jsx_runtime.jsx)("ellipse", {
							cx: "72",
							cy: "54",
							rx: "5.6",
							ry: "6.6",
							fill: "#ffffff"
						}),
						/* @__PURE__ */ (0, react_jsx_runtime.jsx)("circle", {
							cx: "71.4",
							cy: "55.6",
							r: "2.9",
							fill: "#3b2f2a"
						}),
						/* @__PURE__ */ (0, react_jsx_runtime.jsx)("circle", {
							cx: "70.4",
							cy: "54.2",
							r: "1",
							fill: "#ffffff"
						})
					]
				}),
				/* @__PURE__ */ (0, react_jsx_runtime.jsx)("path", {
					className: CatSkin_module_css_default.nose,
					d: "M 57 65 L 63 65 L 60 69 Z",
					fill: "#e8836f"
				}),
				/* @__PURE__ */ (0, react_jsx_runtime.jsx)("path", {
					className: CatSkin_module_css_default.mouth,
					d: "M 52 71 Q 55.5 76 60 71.5 Q 64.5 76 68 71",
					fill: "none",
					stroke: "#6b4a3a",
					strokeWidth: "1.8",
					strokeLinecap: "round"
				}),
				/* @__PURE__ */ (0, react_jsx_runtime.jsx)("path", {
					className: CatSkin_module_css_default.sweat,
					d: "M 88 32 q 3.2 -6 6.4 0 q -3.2 4.6 -6.4 0 Z",
					fill: "#7cc4f7"
				}),
				/* @__PURE__ */ (0, react_jsx_runtime.jsx)("path", {
					className: CatSkin_module_css_default.tear,
					d: "M 40 68 q 4.5 7.5 0 9.5 q -4.5 -2 0 -9.5 Z",
					fill: "#9ad0f5"
				}),
				/* @__PURE__ */ (0, react_jsx_runtime.jsx)("path", {
					className: CatSkin_module_css_default.sparkle,
					d: "M 97 16 l 3.2 6.4 6.4 3.2 -6.4 3.2 -3.2 6.4 -3.2 -6.4 -6.4 -3.2 6.4 -3.2 Z",
					fill: "#ffd166"
				})
			]
		});
		//#endregion
		//#region \0dsh-css:/home/falser/Projects/dsh-mascot/src/client/character/DogSkin.module.css.mjs
		const css$5 = ".L_giHG_root{width:100%;height:100%;overflow:visible}.L_giHG_body{transform-box:fill-box;transform-origin:50%}.L_giHG_head{transform-box:fill-box;transform-origin:50% 60%}.L_giHG_earL,.L_giHG_earR{transform-box:fill-box;transform-origin:50% 12%}.L_giHG_eyeL,.L_giHG_eyeR{transform-box:fill-box;transform-origin:50%}.L_giHG_tail{transform-box:fill-box;transform-origin:0 70%}.L_giHG_tongue{transform-box:fill-box;transform-origin:top}.L_giHG_sweat,.L_giHG_tear,.L_giHG_sparkle{opacity:0;transform-box:fill-box;transform-origin:50%}.L_giHG_root[data-mood=idle] .L_giHG_body{animation:2.8s ease-in-out infinite L_giHG_mascot-breathe}.L_giHG_root .L_giHG_eyeL,.L_giHG_root .L_giHG_eyeR{animation:4.2s infinite L_giHG_mascot-blink}@keyframes L_giHG_mascot-breathe{0%,to{transform:scale(1)}50%{transform:scale(1.035,.97)}}@keyframes L_giHG_mascot-blink{0%,90%,to{transform:scaleY(1)}94%{transform:scaleY(.12)}}.L_giHG_root[data-mood=queued]{animation:.6s ease-in-out infinite L_giHG_mascot-hop}@keyframes L_giHG_mascot-hop{0%,to{transform:translateY(0)}30%{transform:translateY(-7px)}60%{transform:translateY(0)}75%{transform:translateY(-3px)}}.L_giHG_root[data-mood=confirming] .L_giHG_head{animation:1.8s ease-in-out infinite L_giHG_mascot-tilt}@keyframes L_giHG_mascot-tilt{0%,to{transform:rotate(0)}50%{transform:rotate(7deg)}}.L_giHG_root[data-mood=thinking] .L_giHG_head{animation:2s ease-in-out infinite L_giHG_mascot-think}.L_giHG_root[data-mood=thinking] .L_giHG_eyeL,.L_giHG_root[data-mood=thinking] .L_giHG_eyeR{animation:2s ease-in-out infinite L_giHG_mascot-squint}@keyframes L_giHG_mascot-think{0%,to{transform:rotate(-3deg)}50%{transform:rotate(5deg)}}@keyframes L_giHG_mascot-squint{0%,to{transform:scaleY(.72)}50%{transform:scaleY(1)}}.L_giHG_root[data-mood=working] .L_giHG_head{animation:.5s ease-in-out infinite L_giHG_mascot-busy}.L_giHG_root[data-mood=working] .L_giHG_sweat{opacity:1;animation:1.4s linear infinite L_giHG_mascot-sweat}@keyframes L_giHG_mascot-busy{0%,to{transform:rotate(0)}25%{transform:rotate(2.2deg)}75%{transform:rotate(-2.2deg)}}@keyframes L_giHG_mascot-sweat{0%{opacity:0;transform:translateY(0)}22%{opacity:1}to{opacity:0;transform:translateY(11px)}}.L_giHG_root[data-mood=streaming] .L_giHG_eyeL,.L_giHG_root[data-mood=streaming] .L_giHG_eyeR{animation:.9s ease-in-out infinite alternate L_giHG_mascot-glance}.L_giHG_root[data-mood=streaming] .L_giHG_tongue{animation:.8s ease-in-out infinite L_giHG_mascot-pant}@keyframes L_giHG_mascot-glance{0%{transform:translate(1.6px)}to{transform:translate(-1.6px)}}@keyframes L_giHG_mascot-pant{0%,to{transform:scaleY(.82)}50%{transform:scaleY(1.12)}}.L_giHG_root[data-mood=done]{animation:.9s ease-in-out 2 L_giHG_mascot-celebrate}.L_giHG_root[data-mood=done] .L_giHG_sparkle{opacity:1;animation:.9s ease-in-out 2 L_giHG_mascot-sparkle}.L_giHG_root[data-mood=done] .L_giHG_eyeL,.L_giHG_root[data-mood=done] .L_giHG_eyeR{animation:.9s ease-in-out 2 L_giHG_mascot-happy-eye}@keyframes L_giHG_mascot-celebrate{0%,to{transform:translateY(0)rotate(0)}35%{transform:translateY(-10px)rotate(-4deg)}65%{transform:translateY(-5px)rotate(4deg)}}@keyframes L_giHG_mascot-sparkle{0%,to{opacity:0;transform:scale(.4)rotate(0)}50%{opacity:1;transform:scale(1)rotate(20deg)}}@keyframes L_giHG_mascot-happy-eye{0%,to{transform:scaleY(.72)}50%{transform:scaleY(.72)translateY(-1px)}}.L_giHG_root[data-mood=error]{animation:.35s linear infinite L_giHG_mascot-shake}.L_giHG_root[data-mood=error] .L_giHG_tear{opacity:1;animation:1.6s linear infinite L_giHG_mascot-tear}@keyframes L_giHG_mascot-shake{0%,to{transform:translate(0)}25%{transform:translate(-2.6px)}75%{transform:translate(2.6px)}}@keyframes L_giHG_mascot-tear{0%{opacity:0;transform:translateY(-2px)}25%{opacity:1}to{opacity:0;transform:translateY(9px)}}.L_giHG_root[data-mood=greeting] .L_giHG_tail{animation:.5s ease-in-out infinite alternate L_giHG_mascot-wag}.L_giHG_root[data-mood=greeting] .L_giHG_earL{animation:.8s ease-in-out infinite alternate L_giHG_mascot-ear-sway}.L_giHG_root[data-mood=greeting] .L_giHG_earR{animation:.8s ease-in-out infinite alternate-reverse L_giHG_mascot-ear-sway}@keyframes L_giHG_mascot-wag{0%{transform:rotate(-14deg)}to{transform:rotate(14deg)}}@keyframes L_giHG_mascot-ear-sway{0%{transform:rotate(-20deg)}to{transform:rotate(-12deg)}}.L_giHG_root[data-dragging=true] *,.L_giHG_root[data-dragging=true]{animation:none!important}@media (prefers-reduced-motion:reduce){.L_giHG_root,.L_giHG_root *{animation:none!important}}";
		const tagId$5 = "@falser101/mascot/DogSkin.module.css";
		if (typeof document !== "undefined" && document.querySelector("style[data-plugin-css=" + JSON.stringify(tagId$5) + "]") === null) {
			const tag = document.createElement("style");
			tag.dataset.plugin = "@falser101/mascot";
			tag.dataset.pluginCss = tagId$5;
			tag.textContent = css$5;
			document.head.appendChild(tag);
		}
		var DogSkin_module_css_default = {
			"mascot-breathe": "L_giHG_mascot-breathe",
			"sweat": "L_giHG_sweat",
			"root": "L_giHG_root",
			"mascot-celebrate": "L_giHG_mascot-celebrate",
			"eyeR": "L_giHG_eyeR",
			"eyeL": "L_giHG_eyeL",
			"mascot-wag": "L_giHG_mascot-wag",
			"mascot-tear": "L_giHG_mascot-tear",
			"head": "L_giHG_head",
			"mascot-blink": "L_giHG_mascot-blink",
			"mascot-ear-sway": "L_giHG_mascot-ear-sway",
			"earL": "L_giHG_earL",
			"tongue": "L_giHG_tongue",
			"mascot-happy-eye": "L_giHG_mascot-happy-eye",
			"mascot-squint": "L_giHG_mascot-squint",
			"mascot-shake": "L_giHG_mascot-shake",
			"body": "L_giHG_body",
			"earR": "L_giHG_earR",
			"sparkle": "L_giHG_sparkle",
			"mascot-sparkle": "L_giHG_mascot-sparkle",
			"tear": "L_giHG_tear",
			"mascot-think": "L_giHG_mascot-think",
			"tail": "L_giHG_tail",
			"mascot-tilt": "L_giHG_mascot-tilt",
			"mascot-sweat": "L_giHG_mascot-sweat",
			"mascot-hop": "L_giHG_mascot-hop",
			"mascot-pant": "L_giHG_mascot-pant",
			"mascot-busy": "L_giHG_mascot-busy",
			"mascot-glance": "L_giHG_mascot-glance"
		};
		//#endregion
		//#region src/client/character/DogSkin.tsx
		/**
		* The dog's SVG body. The root carries `data-mood`/`data-dragging` for the
		* CSS selector ladder; all geometry lives in the 120×120 viewBox.
		* @param props - skin props from the widget.
		*/
		const DogSkin = ({ mood, dragging }) => /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("svg", {
			className: DogSkin_module_css_default.root,
			"data-mood": mood,
			"data-dragging": dragging,
			viewBox: "0 0 120 120",
			role: "img",
			"aria-hidden": "true",
			children: [
				/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("defs", { children: [/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("linearGradient", {
					id: "mascot-dog-fur",
					x1: "0",
					y1: "0",
					x2: "0",
					y2: "1",
					children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)("stop", {
						offset: "0",
						stopColor: "#f6e3c4"
					}), /* @__PURE__ */ (0, react_jsx_runtime.jsx)("stop", {
						offset: "1",
						stopColor: "#e4c193"
					})]
				}), /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("linearGradient", {
					id: "mascot-dog-ear",
					x1: "0",
					y1: "0",
					x2: "0",
					y2: "1",
					children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)("stop", {
						offset: "0",
						stopColor: "#e0b98c"
					}), /* @__PURE__ */ (0, react_jsx_runtime.jsx)("stop", {
						offset: "1",
						stopColor: "#c69a68"
					})]
				})] }),
				/* @__PURE__ */ (0, react_jsx_runtime.jsx)("path", {
					className: DogSkin_module_css_default.tail,
					d: "M 90 90 Q 106 88 102 72",
					fill: "none",
					stroke: "url(#mascot-dog-fur)",
					strokeWidth: "9",
					strokeLinecap: "round"
				}),
				/* @__PURE__ */ (0, react_jsx_runtime.jsx)("ellipse", {
					className: DogSkin_module_css_default.body,
					cx: "60",
					cy: "94",
					rx: "32",
					ry: "22",
					fill: "url(#mascot-dog-fur)"
				}),
				/* @__PURE__ */ (0, react_jsx_runtime.jsx)("ellipse", {
					className: DogSkin_module_css_default.earL,
					cx: "33",
					cy: "54",
					rx: "8.5",
					ry: "19",
					transform: "rotate(-16 33 54)",
					fill: "url(#mascot-dog-ear)"
				}),
				/* @__PURE__ */ (0, react_jsx_runtime.jsx)("ellipse", {
					className: DogSkin_module_css_default.earR,
					cx: "87",
					cy: "54",
					rx: "8.5",
					ry: "19",
					transform: "rotate(16 87 54)",
					fill: "url(#mascot-dog-ear)"
				}),
				/* @__PURE__ */ (0, react_jsx_runtime.jsx)("ellipse", {
					className: DogSkin_module_css_default.head,
					cx: "60",
					cy: "58",
					rx: "27",
					ry: "25",
					fill: "url(#mascot-dog-fur)"
				}),
				/* @__PURE__ */ (0, react_jsx_runtime.jsx)("ellipse", {
					className: DogSkin_module_css_default.muzzle,
					cx: "60",
					cy: "72",
					rx: "13.5",
					ry: "10",
					fill: "#f8ecd4"
				}),
				/* @__PURE__ */ (0, react_jsx_runtime.jsx)("ellipse", {
					className: DogSkin_module_css_default.nose,
					cx: "60",
					cy: "68",
					rx: "5.6",
					ry: "4.4",
					fill: "#4a3729"
				}),
				/* @__PURE__ */ (0, react_jsx_runtime.jsx)("path", {
					className: DogSkin_module_css_default.mouth,
					d: "M 52 77 Q 56 81.5 60 78 Q 64 81.5 68 77",
					fill: "none",
					stroke: "#6b4a3a",
					strokeWidth: "1.7",
					strokeLinecap: "round"
				}),
				/* @__PURE__ */ (0, react_jsx_runtime.jsx)("ellipse", {
					className: DogSkin_module_css_default.tongue,
					cx: "60",
					cy: "82",
					rx: "4.2",
					ry: "5.8",
					fill: "#ff9e9e"
				}),
				/* @__PURE__ */ (0, react_jsx_runtime.jsx)("ellipse", {
					className: DogSkin_module_css_default.blush,
					cx: "41",
					cy: "62",
					rx: "5.5",
					ry: "3.4",
					fill: "#ffb3a7",
					opacity: "0.5"
				}),
				/* @__PURE__ */ (0, react_jsx_runtime.jsx)("ellipse", {
					className: DogSkin_module_css_default.blush,
					cx: "79",
					cy: "62",
					rx: "5.5",
					ry: "3.4",
					fill: "#ffb3a7",
					opacity: "0.5"
				}),
				/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("g", {
					className: DogSkin_module_css_default.eyeL,
					children: [
						/* @__PURE__ */ (0, react_jsx_runtime.jsx)("ellipse", {
							cx: "48",
							cy: "52",
							rx: "5.6",
							ry: "6.6",
							fill: "#ffffff"
						}),
						/* @__PURE__ */ (0, react_jsx_runtime.jsx)("circle", {
							cx: "48.6",
							cy: "53.6",
							r: "2.9",
							fill: "#3b2f2a"
						}),
						/* @__PURE__ */ (0, react_jsx_runtime.jsx)("circle", {
							cx: "47.6",
							cy: "52.2",
							r: "1",
							fill: "#ffffff"
						})
					]
				}),
				/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("g", {
					className: DogSkin_module_css_default.eyeR,
					children: [
						/* @__PURE__ */ (0, react_jsx_runtime.jsx)("ellipse", {
							cx: "72",
							cy: "52",
							rx: "5.6",
							ry: "6.6",
							fill: "#ffffff"
						}),
						/* @__PURE__ */ (0, react_jsx_runtime.jsx)("circle", {
							cx: "71.4",
							cy: "53.6",
							r: "2.9",
							fill: "#3b2f2a"
						}),
						/* @__PURE__ */ (0, react_jsx_runtime.jsx)("circle", {
							cx: "70.4",
							cy: "52.2",
							r: "1",
							fill: "#ffffff"
						})
					]
				}),
				/* @__PURE__ */ (0, react_jsx_runtime.jsx)("circle", {
					className: DogSkin_module_css_default.browL,
					cx: "48",
					cy: "41",
					r: "1.8",
					fill: "#8a5a3a"
				}),
				/* @__PURE__ */ (0, react_jsx_runtime.jsx)("circle", {
					className: DogSkin_module_css_default.browR,
					cx: "72",
					cy: "41",
					r: "1.8",
					fill: "#8a5a3a"
				}),
				/* @__PURE__ */ (0, react_jsx_runtime.jsx)("path", {
					className: DogSkin_module_css_default.sweat,
					d: "M 88 30 q 3.2 -6 6.4 0 q -3.2 4.6 -6.4 0 Z",
					fill: "#7cc4f7"
				}),
				/* @__PURE__ */ (0, react_jsx_runtime.jsx)("path", {
					className: DogSkin_module_css_default.tear,
					d: "M 40 66 q 4.5 7.5 0 9.5 q -4.5 -2 0 -9.5 Z",
					fill: "#9ad0f5"
				}),
				/* @__PURE__ */ (0, react_jsx_runtime.jsx)("path", {
					className: DogSkin_module_css_default.sparkle,
					d: "M 97 14 l 3.2 6.4 6.4 3.2 -6.4 3.2 -3.2 6.4 -3.2 -6.4 -6.4 -3.2 6.4 -3.2 Z",
					fill: "#ffd166"
				})
			]
		});
		//#endregion
		//#region src/client/character/generated.ts
		/**
		* GENERATED by scripts/build-art-assets.mjs — do not edit by hand.
		* AI-generated character art (docs/*.jpg) chroma-keyed to transparent,
		* resized to 512px, encoded as WebP, and inlined as base64 so the bundle
		* ships self-contained. Regenerate with: node scripts/build-art-assets.mjs
		*/
		const CHARACTER_ASSETS = {
		  "face-neutral": "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",
		  "face-happy": "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",
		  "face-sad": "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",
		  "face-thinking": "UklGRtI2AABXRUJQVlA4WAoAAAAQAAAA/wEA/wEAQUxQSMAQAAABwMf/+9o2kp7Cbiur7ZGjuI4GbE9Hx8zM55mRdZTs1MfMWMfHY/9yfImOmdndV7wka645HjrG5VV7sRcU11E9sG1lDff5o6liS+rveXyUiJgAOPD/gf8P/H/g/wP/H/j/AO0FXdf1wrxu0Vjd8HZ8f8ezazkGUvWbC9KkGqsb3i7eOvojhXsWG72h7/s73saqsShBlUYvwH1GdebRuhhz17NrmtQolr2NUxyUeaeN+ww9u6bJimK6E5yuYJ1qsB9EDD3bUiREM90Ip+1pjKO6ON2Ja+Ykoyy8EKcfmoxjBFNCjJxGRSLKoo+zdVW+ETjLvihLQln0cdbDItssXpwJYl+UJaAs+jj70GIbY3dGiH1Rvs1poo+JFGzTwAT2Rfk2pphbmFBHZRq1lwTEvtBuV1U3wqQOdabRh8lA3DKV21G5HWByRwbTFP2kYOSauduNUh9goptMY4WJQYw6pdtJ/lDVnWCyBdOsYaL7opwFxw8lQfmy//zVXUx6i2nayULsi3JCjpzWdV3dn1q01lqvXs3NrtSJMIWOyjPrSUPsi3IiTv/b0B86wtLiqEajNwwR8UdhlifeB0ATfUzlUGeZgpc8xL4oJ0Bx8ObQsy1lD8V0A9zz2QdnUGlsffeH1i9gSn2e0XfSgNgX5Zmour50T28PRJy4VQCouhHe+je/R9zcNBb3o4k+4t/+1QuYmiLP+OlA7IuFY3d82z3TOFwTztD3RzduhRi0Kw+OMe4E9969+CNKrNImpjy0WA3xwnf9HPaFtr8jv4XTvHwdpzz5+VVj8RYrA0z9GssspQivXUXErWosVTea7V+fTGOmu97GqrEISv0Kpl+wjDFK0d5Bu7yXZglnOMJ07no//YYJMl0TM3BQXzis1WwvxNs+z4gswPAdv/qOEGWQ7+TxwH//R1Nz7meMKLHGMks+IUKLZXRK+MW5n84zw3mf6hBiyDPQIoSj8owgRAt4do0Qa0xjhWQILaYp+mTwi0yjD8mwozON6pDBKzANtMiwDlzbJMMa2xgjIoQW2+hDIvhFtlEdIngFtgFBhA3gWyukwSrjFIckGN3LOKpDg8orj7INCBLcePjXlvjGCimAeFnnG82jgc84YNNgyDZHisfvu04CR+Wahccf/vodEghgWxuffZECocU3AmnoaXzTJIINfGvskiCsMc6iRwJPYxywSSCAc2shAS7exTqaR4B/szTOAUEADD1xzxG+KQ8IgIh/v8A3UA8pMH7VIcZZeAcBxsvAur8qf8EycG65fVn+HgK+PVyzt1H+n30V4xz/fSThhTzfwEKXBNjJ8Q3kuySITMYBTfQJgK7KOAB39QgQGKzzAS4BcJV1BEr/i7v4C5xTDeQv+u5z35LjG8VFAjqvAMa1JhSITM5pIwldlW9OPIzBiwQIDL4pPt6+LyAACr45sgAPIQU9jW0ANI8EYY1xaiEJ0GYcG2m4XWGbgkcEbLBN0adCT+UaK6RCYHDNGpKxwTXrdOipPKN5dAgMnrFCOmCDZwQSsqdyjOpQYljkGCOgxPWzHNNAUg5K/KL2aIGbJXYpDomBgxVuqYXUwCt1hVdspOfENRVGKW8TBDFyzaLKJW0karjTO3eKRZYDqiBi9wSHLI+Rrt0FYNDlMZI16iwAgy6PkayDugL8qdSvIFGveu0y8GfOdCdI1BudDz8DzHm0aDScCMkaffcrT3DH8d8eI2m37wb2vP8p2uCmxh6wPKYNtvkDqm5EmqDKH6CY7oQw6Cr8AaBY4vXXyDKpcwgAfOSfkgUHZR5ZfpIuKFhEu4CE9TQOEUjZsMYg5T5p0GYQgbTdLrGH5hEHO8e5oxZSJ/yxyhHesJG+/7DAGppHn637D7GGFZJnMw+8uYbU3fyUHHOsU6ebzx3ljYJHnG4euFPfoU03D+y55FMmaGvAn2dGdLn6hiowaGkT6frGZcgd5Y5DZwdI2aB130nuOP57SNx3mtwB2vmANk/xB6hGu0+YrSqwaOXc664SZTMPTHr87Btp8kQJuPSbI6Tp9c5JLim8hihX2qe4BBY6EUWePQuMqpwd0yP4YZVTAKpuRIzxMnCrYroRJcbLwLA507lGhsEKsOzxj/h1IkSdEvDska8ZkeDGoK4A01avIAkfuRu49vRfIQ2HD1UOM83HOAENEN90mmlyH31voxdQIPqTE0xz9ASAeua7/lb6BnUFOLcsfVGnBKz7qW9GyR/UFeDdk18+kLqgXQb+LYu+tEVuFXi4LLxQxiLXVICNNdONZGvimgqwsmK6gUS99+22pQA7586I86EsPfHhwNGH7/6j4YuyhC2WWvgHlOh+maMOPWBvyxMKjgKASsOZyNH16E0LPAWQs2wvlJzQW18zrdohrgIAzWr9jbSEQ0dYGvD3sZ6k/MeGuaQCi5/802EoJVf/6P2Ay08sPfAbEwlB7Oa5DOD9OjekBLt5LtO6KKvdPJO1UV67eRZ74IrEYDfPYd+PUrtZYrDFR6QG++17Tx9hri+9LDeIVx5fYC1NBCi7Tz14iLNKmyi7kVsFxlbqA5Tcq46pAF+f+p7eBGX3iTJw9ul3ogS3WQtWLoXy0y+xFmimG8kOdnKsBaCYj8tOZDIXwPKzkoOuyly5P7khO4HBXGaE0it4S3FRfi8uspYZSdCuwVmKizLc4CxrIkU9lbFslOKhzleLnhz5jGXszvuaONdRdb0AUCha328s6YWUCCl6+onhHfywaDRFyxnueOvrnh/iyN/x7JqWhpYUXfuGr38fbiiIi7s4xdCzLSVpxztShL1jwI1NnPrENXPJgp97/m+cZ+QnMJjh8MI3Pzs1xKhTSta3fKWycl1+UDDDZ14cvjgDxEFdSVLuEGygBHsaLxT+HGccdUoJAqhsy1BY4wU4NyvEwUqSGijFNjMYwcxwvJwctSdH2xVeUJ3Z4fhLPuP7K8kwAjnCVV6AVgLw8r/hoK4kYRUleYMZRBJujjoLCdiQJU9jGcSOMjPNk6XQYpqoPjMrlCUUvNBODl5ZmZVAaXZUVlhPEA7Ks1EdeQoMTlj0koTt2RiBPGGDE4zdRAXVmTRQop0cIzQw2a4yg5wjUxOLD9RewiJzBtZEptDmAyNIGLrK9GyU6u0yG7Qx6RNrauVtuULBBdUgcWhPTaBkX8yzgFroYfI9bUqlvmyFaycZoPTqJ66mIKxNR9tE6fr30/RbGWA67amoP4myfXWtcph8y2NMqVeYxtdfHL4kWdcfBPJXx5jWnaVpnDLWrkoWbpAvv4WpHRnTAPjGZ2Vru0w85TymuDmdDZRuQbyzUZrEVMrb8uVppKuOMWsEyndoUk7bwqzRPAlDVyGcwMyphTI2sehW7mePjVJu001gyttTqGzLmadRrdxP288d318D5Ty0qCYw7eEfn9iP2pM0FESr9FOHl/X9GIGsOSrNGph+f18NlPXAIJnayx61J23YIJkRZE9xKG89lWINzB4rlLfAIJjay4Kd/QiU+AbBjCALvEI81ZG5nkquT/gxzMJ1iK8PZS4wqHXfpTdmgtiHMZI5bBBLcTEbm/tYRal3crQyo2wIjH1syF1kkkpxMRt7ajzNkzt0FUpZk4xoQPx6KHmTOqVszMbAiFceoOwPynRa9DLCVeO1Uf7bdDJ2syEyIfZyQICna2RaxWx0lVgrY5T/HfuzyLSRDUEV4p4eIAEfWQAqL3rZ0IbYp9b+/mX5wwaZjN1M+K+748FHfNcuAS5oVGpiJv5GUT8VR/2Uf75BABRUEtnw3vcEq3GOfmOIFOyXiLSeDYjjB+KU+kjDTo5EBS8rBMTMdZCIkUkifScjtrQ4ZkQFdBUS+dkwrkJMxUUyTupsEp2FuGZEB7ykcUlHiaO4SMjQZJJBCWIqXzKhBLoqi0zqEPfMbyIpA4NFXCVWaZsWKDgkMiG2QGJ6Gn120tfJxdI8aoQ18hS81PVLELsWUgNt8sB66toQ30ZyehpxTh1rpS0w4mkePUKLOO0/Wk+bq8azQnrgGm0Kl8L/SNn1+yG+QIIK2hR9TPt1M57qEGTyvbT5wjB1+KPx9CFBbIU2X/5c+prxij5B3kCcb3kpdSMjnhUSZGLRxhilzl+K9+NIUZs2S3769Hj3b79EEE8jjZ418PXPEiS0WKWFFF2jzTBjVGfuojoZow8pElqkAZG+YjxjRJH3FGhjhWkLrXhNpGho0abopw1FPEESXKNNwUudo8Zq0aRFG7BTFxhxVIcmjkqbWpg2PHf4cxvqXvqQJkOdNpqXOve7Nl+s38KniU8csFN349oEB6V5jjVJ254dZY6juJkQ1ec4YIZZgFdW5jgf8LZMwEEJoDifOWT+WzbgZunQR1+eyyy8EbOy/7XncS4DG5mB1947p1nLDrLSx5pwx5A8issdPZU6YEas8dL4e4C8issao487QR+ojjnDWwQKn40YYx1IrJxnjDaNIH+BLwSRYPkptmgS6VjlV7hiZNDo5G/+zN9wxVCn0eltZEtHpREIvmgBkbUttmhSCcyIKQKDTLkOU/RUMkFpwBMNIPTKFY7YNSgF9YghLi6SSukwhABaL3TZYbtMLMh3ucEGcuc3eWFi0Qs+9cINTnAVgh3/4lHIB8+aQHH9sx4cc8F//JpKMgCobjHB9x8FsufPTzigXwHCHzv7RgYQQPlPd95Lvy2NdKsvIPkjE0if+3H6uQrtQOtSb1wF6ue7tAuWgf6aCCjXBhZcHpPt+UeKPADVLaKNvrelMAHkz0cka4MCbKjUBwTrasCK5XZArW4euLHqRqTaygM/KqYb0WlcBZZUTDcg0lYVuFI1Gr2AQN08cKZqNJx3PUObbh6488wv/gdlLrc1YM9vipCyvwIMeqI+SMnk9a+7KkG7ywwCUGk4k+SFl+rHSk9IEI5XOAQgZ9lemKxBXQNooxQPSiwCAJq1tu7t+KNk9EUZAKpBFo0eyR7s5Jjk5oK+ZDTFng89NoXL775+U9BrVAAAVBczeOsLtM3siSxGiV+9FMYKh71zH/MZZ/9zQzQNFfY0guwJhAagie2XMwZtpjmkWcIZ+r7vD53WmlVU4bAKCxC3gZn7D8uw50ddzprtCs/crOp7qjBVtZc963ftVfSzBlf5Zrb6MHvasLeePTZPFf3sEdnlqCxlhRL1jgJL/ShK1FBnqaZMeQWWMkYStQEsrQ8lapWnVDe7ljInMHgKzCizPmiUNa7KVIqbWZ/z3owJqsDV1XFWLfkZ0wa+Xh5nlJ4xXY2xYGWQLWu32smSqLMArF0W/QwJrVsUvOwIXDMH3F1Z3fB2/DAT/OItYD0LJk5LiKahAosX9KLpBrcYDZ0fcYb+jrf+I48kzSvcai1pjzwkWs7IabWcob/njmdbOWB21WiKm5uGroKq63oBoJU0G25thQlrAYB6hwqg6rcswHywmbCwFkPzEtaEeWWlnyxPiwEiWYExtwCRLAFxta1Euer8ojxI0pYWC6pBgiIT5pgr4+SMq7DPdoI6uXkGLI+TMl6G/WqdKCndBZhvrgySsVWF/Sv1QSKizgLMO0udaHZRJw9TLXWi2Q3qCsw/c6YbzGbimjmYcs50g5nsXhRlmI+qRlO017f3E/p+iOGuZ1sKzFA1Gr2hv/P2v57sY/Jn623RNBZhvlpp9Ib+aI/RjmfXikWraX3gIsxc1XW9cLJmezt+eNNox7NrWhnmsqq+ZDSFEE1jqQDJL+hFa02IprFUgAP/H/j/wP8H/j/w/4H/D/z/f88CVlA4IOwlAACw5wCdASoAAgACPm0ylkkkIqKmJBCJyMANiWdu4XPw8GM9iCQsWLtYTyCfg9r0J7G/jn+mPmt/ufyu/cz+ieBhpOy+4Bz5O0I79eZp9P5wfav2A/MrvyvvvqB/zX/KeknoQ1D+k9+9Xs6/tiPjMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMIB4+FBzgJjRW3BzA9VPJsicO29nN+1LK84cMOdhgi7u7u7u7u7uuPOC8MVIaV/8U9Phn/rdzEAnZgwVT2dVYjOP7JzgSgXmSPidbMZHmC+kBmXfizhtjyMkG1KeFeQ0hnkAYSVxumDcqqqqqqqqqqcSBWRbX1g3bknUE2EP1aWLl/C8l0yg8FwHOb6hLltds/qIQ95uEQwzaDvbonv0o6elXkxmZmZmZmZmYo/HVRgm/APWhpLJI4p1evocUFp9XFeeKs0RzOkRKt2fZMEvBP4yWWokjvNUerclaqqqqqqqoPvyh3oq2jaJ8OawEhwK266TyRf4wVPrQ5qmKuMxzQ9YD0b6sMpm0RUD5nuJAVVVVVVVVVVUGe1GcrUxysqm2F1nBs6replbC3EnwbNrwfB9G8noAVhxSvNCULS/toVlYptDFzMJ0BFzasXd3d3d3d3dWtDoN2VXJVAP+ccKd3aGKZbi2E6Bh/wXQ3XTSIlLSGwJMcWmudIawiJUZ+G0aaACmbcOcAdqF+/ss86UqcIqqqqqqqqqqQMs6NzjatT7P2lPkztVW2/6Is215cxptVFROxBgQFR+C+ldfVC6wT9io18d88MMXCI4JwxGhvQVtvzO50smsYOT3ByZGweWxzRrQVVVVVVVVVReeBl+ONnafAPo8rihIHFlETD1WliPNeazLiiLewvypIehDtXr0oMnXZ2jSYfY3GHET0s1W0HkVfXGTXgZM4eVLMaMzMu5FH+CY8k4rO5epJ29ISFbrBHos6tRGJ17sRnNfm2Mv8d3Ie7/c7ROWj/k1CwusqouVY9mAupe33xefI0t/LGlxtibu7tBau81JKOZhVTh+JbPqnOa/86pAwj0ft1MGsm9oKJ24pUosOJbnO5V5f9RRscVVVVUmy4HfZXNbuBrcztN86aiAqx1iTK4ILfbrCoHggf52mNaHSnNf1l3PoZw8qP9Bbr+01vkrUZ/PZed05fE7msJnq1dm5aQ1uGq+xuIrGDF+UDfyDwQ+hTZRfheZ9aIXl6pHc3uJj3vuV+sXd3d3d3d1voiCZXanSIOqvP9mYiOx2sfPcjJaV+YUgNdvgWAwGN33+oea+TTDUOQ61kqZNfVkNNGMAVqzMzMzMzMzAWqnosvjXqKCaXsmfdLK6iw6YCQKrVMq3eBnCiko3B3wEDSdbsQRMCX1z0QlkIcER3VNEhO//JWqqqqqqC9ff47ZRfNi4cWuIqwpmvyjttQz+/71HydvcwTDiUWUuDKaeILHWEYNARbN5MDUuFImXeqNbZ7QMRmZmZmZmTO0j3348Bz0rskvOqG83PnonnYoxzPAh5uY88unqnqsMim/qVOtEHhUEyqYLNid6HODl4gQ3FmqmjRF1PjzVIChzFP+FquCYHqqqqqpu8T/kqQAMrH07zuGWu4aYeCTJw7MpD/eUzvL6m4BZz7w5+0acvd4sDVVIngS093gdoNdFtuikFAe7+ecwB42Cq0bV3oO9nMhLsTAxu7u7u7r8VlGdQkSt7h3kCedFHfv576OAD+ZkFOp+4Y0YT6HqUFpbxgvdeGpbvqv5zFDkV4LAfrlOuCK6EZX++S17PaCgGIbgxVTmZmZmZl/OyCXECkBoHvw2WmU8o74ycZ1uWif30/qaYl6atf+wtbfdMQWZatG15XZgX9GdndzxmR4T1Jgeqqqqp5IcnlijnMczDwiXvQjz0yzpKZ7puEK+4yb11YBJwz/omJV1yp43SJWIUsgS31AY7Fd+9JeUcGStaa3yVqqkG7vSWCGYFnk+EpqvbYLSkyn7bt/BCFNyPJLfh95rdalqU/hL3Azs6LQtYHezmyOAXtqrA0oKalXk7QjMzMzMzMmxQZuUasfSBxXFFCcTDVByNFst8rThAr18qnlYcKwbhCB/GiKAzcndJnuX6XG3JGgmqYV5GIk7E3d3d3d3aC0CLCTWXZj7NxKo8mSgir8DWCdGzb9OJhYSqV/CCQo4l7s351taHK/nIWaXtS4eHOtLZtTjisUKfwllpPivIPQT796OXcxN3d3d3d3d3djl+XnD+XqLbhNxgkvEg4rGiv7I/VRDRsvQ4PpqFkYfZ7WiFo5TSlNw5cQ+OcBU21XlM76Hx3UVyCk7eM/pqC2WazDLKuJ8d3d3d3doNBxFHyv9c8zf6E8n5f3+K134q2iv/u9F/+un+xwoFheo5LF3LxL9TIzDpLE3d3d3d3d3d3d3d3d3d3d3d3d3d3d3d3d3d3d3d3d3d3d3d3d3d3d3d3d3d3d3deAAD+/6EOAAAAAAAAAAAAVnDbYuRafFxOOsqxEklByfDe2sXU0NmlH8r1FfjnyaeKiaNf5m+LkFlC2dlywOB9ngxgHEC8GqNCGwJXMZ8vnl/WiIk3NygJZLlABpEUxEf4AFmC/g0lilUJB23BxxK9V8d7v/yFRQ6zoogQudNtz3lp1+VfO6mswolqjd7QGaH1qKg8cf3pt88rnxz5DPvH3srpQvDMn3jnmmgekxQTlrbTo+HsE00/Gtz59le+43YAAyvrVy3iVBKsqrNUV5HysGc0cVHPugD+HG7KxbyM2vo9LFdB1EOGHPmoFi0jpt6DWJXhCpR1xKDarGB8ti34+xUDPHFGoHfIqWyT9tK3/+63PQNwzFr0oTMEKES1lbzCD+jdvsy23DFLxxGnhQ1km8Mx68r3IWYod/GkTcc7UrjCLg6UPdbdPxkHJ4mn51r9KQGa0rR06HEkvPMKAu1M7UgzO2OqyXsOI/w69Nyv+rtwiUhQsz6ZsVmWalif4CahejCdkBMrI72iMHki/w8L6Rqpmsbw/yMKADstsv6ZVJNFriPHjmRR4ldLd9MoO4xh5j4vzi4cwXR75HpJu92TOZw/xX/CYCYi4Js4y9MvmySqSlddetR1jbQDuDf1TAbGgXDfIsljs9V8cKga5mW9YdbsPQ/yULKtApeCZWa/QuKMTItUO4SWDWIm/Tb5PepbX7r0rFXiu1NYBUcXMmulGtSSMR0Ui3xKyzwIqIRjZdLmncZOzQwKdIbOjdQofLA9q/z4r7TFUHVbKtSNUoiUDJOlPp/G1+ukN0ldYwGmY0R5RjN/QF/f+QvYB9SZvC9wB+9uZjCYGVuT5XLFBkejeGh0wdzhNSw2xio+uYIWdxSpy6YRRtd836J7mzC8+0GPSPhojQdGf9psBdsF3/X/U6JVMME1TlmJHyh0aeqQ2oFSAut4JHvXgLpZf/5Y+hmYxueHpBrnPDc5tNgJ9kYgj1EKju8dBA38K7e+D4LCKnFV6jSHfX1LU09dYObDmt4u8HNRIviOyCpPavf39zj5YaJQXOMXJczIkQFLD6tthp8pkU4uLx6azeQHbi3RzOG66mJIVc5tWGRKoJxgKyyhrUx61zhQazQBOacuAOaVvX+3/3QOOXckXj2ORvfmYpP2rEQNtGGezPMTwNs/PjwJepBKbWAFO6AEm3H4vqkagU7GxOKmrNR25szfMKsDP+XZeY5kQG3wwhBQOEfl8evYVrtFGbkojm3p/3OXuljiD8H51AaL/QLZ4OFb/0F2PFFuaBqSyjLqAABHY0Ybtvsfz4bfe6+/SS3KZB8I2SefDWSvJ29GYNpLWCadwt6VUsPLLxGo7ADscCfXqUlQCFPXiMZMSJdeA9SgDkxgp7F+diwR9AZ7jWDmQIafa2Gn4UUvfPYn0MjTJpEAGJzbLNSWC5kthUAaSlIqdlKjr2Jzj3YSGCG+CteXxl+Jvu+hF7BYGfLA5GDOJw9dfBX1s8k982EjYS7Uprihx9xW3wguwIS2rWL0CcmCg113vNKGEM+yX6F7U8Ux4tMdhr3qtQvc0LEZICPCYK9jYky90J+YniKcMpUhCbXxeEMvgROhQW2PclbT5cV7LHZ66HJ2X8ysSQutmNS6ttKoyTuno8G+UAhd7I1HebgMgAMh3SNyq7NSFH140MzrCHvKnQrBP4W/tvWUQbfDIZwZIHs42bZjR0Ks70SZYpphpEeFP81fJFBS/nlI9t1acO/C5pBGwF3LsXAIAxFWQOPnbBi1F7EAMQgW7CIfn+dmH5z+b6mJTyjFYhvCW9fs9bd3GSc64aAR4DnRAtYIjky130OzeQ49YHVcGeP4pNYzWp9LdsLCQAk4c2yFjzyWIo2QFHnP+50AfDZHjWNa4OnyRIFPtnVgYWSuZqhh7icwEaluGEBaCX2VF6udkqDQ0fX1/ZV6ZBUiJi4PsSTPM7VVLJythVdioqe1ngiwJLZT0s807eTzmcFe1Kjml6+7hHUvXoiI7buIZOY8iOgAYHPrMbNOAKXd/wttPRvS3rWBfuP03VgvVxWlmFd6IyftbafE+ghDOF1IVu8/uB72fl11ARt3Tqc6lhQnHuRusAeAYY6T3Z/apf837wmcYTuRai/mU6kkA4OiSJuNKGQnPhliYqg7Qzi8RMchX9JdSn5kVM01x9vGQWScaWg6gRn0cDujp61A/13zNPATAZQzkihxV4R6C1f2+X9scvv4v9fA2aGebn6Ni7yEB+b09Ar53iyJaNfeqERlevPizt0PBaREmFglkw06yQitAz7kceLsRlz3RHjcixccjoeXWdSQlzi1peYv0b/nYZ+6/HiKW/d9ZCX8cfq4XEpuf1Tmoguj+OpDq+1ENP14mdfhgai6gXvw/4GgGFEiEoATvwxdFRI98Q76CqKPvybl+qp5FP7yfj92UATI8qz23t3SsLK8T49c1aMFj8AWXpOZ3qkj3H+ZeQ+6gE+5EfH+HHa7vJMhTeoGo7HaKo7rwA7a5yqDVlv4WwpqjIrEruTdO3ivQ4ujHYTZsfD1UeH/SULeYLDS+qyuqG+bhfM3yYe1xYyUx60Paq9qn6ha4GaDAAk+tC1NPDHyU6jeUIR8Dr5DnOkh+yBcbxwglrH4pzyDdfEoAk2NcSEFe+RPpf1IcGyzAkkWuHLMk1pZ7BT+nc84FpCsJ+FfocnnSpR6tKNVlk8XDwCB65uk7kknXT+W1auWp/SNexW/AWJsWwSK0/XHzwBhsEzC6gFn5nEAFpSGgxUnX5jQtGxswQGWup8Bc/LT/z64coiK/6NVvn75q5eID2p3Ssx2skt34UZzDwk1KM9j0E/pByISfO9qJP2+Zk/FgLYl3I9GNxScP1vyrjlgNreGfDnNUnvwBLS5CAwFd16afaTbMBGSgL2IjzPbjZ5imKaQIXQRc7pATnRLccucq2uFUHPPnK5Nq/ahWUfY/UlUIzEkdJoOU41dUdlXArSXd2wtG4BvrHlxYwoxIqd+5womrtlUoqsfdO+HZp9HM3Lx7C0VePP1c7Kmbx3YczNDb/qncKybYd37ieGb7kh5Npu6uwlaFflU5idKrWwsHEl1GfLxUZl+kFjVfaI2CN8+diSABre9L7SAbIjGJg3fARRwz8hv68jABIfJ5Mjsb5dnDnNt81TslSCVdNyaYTsI/4z+Y9rrcBW7iMQhJ0tuPLX1ct+dre1fyfgeh5O+K0Tt84czZmqQwNs+T7qAj+thBMR/zFMIehJ01M4zGDqMXTVrmmeFkXfEeMhP89vojLUYpXn3iLER9acsb3ty3ISoD+l8/nhaOsNVQNit/hMamMalwquvtoVVAlWhGqUHVwi08oUVYwHDjkrL5tjGcw6Q/5WAKHq03A/dWTdz1c/Y+Oo/Xso1SaYGzsvZYZ8hR5ERHDpEy+JhnrF21oBoOJVjfXiniTksULDetF6BzLHKk2xJzL2xpPe3fsPsWjP0UCES9Wdw/cNtaEGxyEMHIMc3X5KafUvOGVTalcAeIoRM8o0R1PLh448b+1TiFfgshdNktn9yv07IMRCl/plsRGByRe0kzbXwBNLbNW1V3eGssWFNxDhv1Z0OZO9pgZbKOQknI89U5kbRZzT6ORIhmvBggG+SKF4dsOeGw9NHcEF6LkgL5UdkUziDY1jkPbig0QO4Uy3ZPmiT9bRmbZh9eYTxdzR/UGHd2yRM7Y2E+ihlF2nDrBfUkwsMBha4foftgopTFBiWJANfkTIXItWpYWiILK3+41sffws/KAoTWgEvzsSfu1nnNNrAGmXEJXzK7BvhsoUIEzBz6wMDcNIPnOq9LMzW53fn2Ypvj2jVGohWFzD1bsJGom2lgQnQ9oYz6t+ILi0pZPgwJbB3flCH1qAswEdr5wucA5R9qgeXpRjXkfYd5smcEFgL0605UNECan9LGZWUsgOBS61I3oSoL9wh7tOCko1hxCCn2gMZk909CvFFNeHs2Fiv2KV1GZtzJkiraj/ZiOts62KRCejaWLTLXTWn2So5H3nk1jhSeReq9QArPSfBJXvB0STP70WaKlj4MFnFLd1MkI4bqfX6x9bVXE3fsYwK23FygfxxJlDbGvKUmYYegXLQrJsB0sLoQDjtMHJIgJxNzcbr9atqsk8A2VuZ3r0J7crNFpeiIUKNQ8i0VfB1ZOf0k3K//uz3/+KTP/+7P/CR0ARkjvFvjQzXt7NDlWN5/gZNZ4Zy7zW2J7MjppriOAn8p5h8YNH88rCNd1mIwcGCgFlmoLyvk95b3Uu2nHDnZnOwxtJXQFnLh07IgfT4MWF+SYOdjNFKuNHS0k+XSuQlV1c5R5UfOTu7CzqFIAtL2feE7/+b+nFoDhP6cBaO7xrKVzLgoq1jQ9+iMHBaxTTNwnvi7QHbQmyaeksr4VRDwCN9rTJYAIwLdTNt1ND53f9kzTDDiPjKj+dvdDWONHB2O+AyuK7I1A53HkC0T1mbDkWikiiv6cAWtH58gGNdIxdeX80XEs0ZYfZjLWihrOLWdXEP5dMZ1FSdznknCaSxytsM++zLHQPo+ENP+tmwifpZJx2xwSVN+H0cDwJYe8Z1+PMFW1Kxt2Gu/JtCHAJZHy4r2TVLkbqGZ7T9Qm5HVKbYnIFo26ZkiUjgnNxcZhzCxXto7XIK72LEJrxCxfoS0TDh7v2exbjX74cVzCOoP/ljR//+1wgIK78Li+9E1kp1rS6MM1551JS/hXawc+KLevtMIChgcNP9rp7B9nffHyid3sEqqtBl/W0zqx8Nmr09yA/yfP5uFUKXXNfzppEEVthjJokYm6gq/XZb3p2UlswhFM3aZed3U4VOzwBu+XlQ6aKO+kEray2L/HRJTmDzfAU3IPGkknj15SFQ86xoZgzKYuizp/wmKmHuZNMI1B/76UQQD9C40micRUdWa1It5mqF5SjXduv/9q+9zUIBcrgvj39zi/cBAzNU0VgAAZ3KbYuOtC+h27oix/eawj9+Pt13Oha9YrQkssH+7MwLqAox9gDgUh0CLkYZ+yHabaoZEfiYg4nSIjItIy48q8h1QFw/dpncxHJwKFZAFeIbGfCpznFppk0z41za2I9oEIun+2l0CKJiUEf+iklnq/3BsPUwyxJSRtjquAqV071qnYOP0vnWS2mpjIatM0Ek/YwWLi9LFh9kR1+oA6lMOQfrEPj3qEZPOXovjxlr9Yi2LfX74DYRidJFz4E/KkB3dYWfKLjXW9E+2WIECp4OwAET/gBWUfq4LDS+f6n99epgvcQbUIixC92nZ4sQrwFgFV4DhYFmjKH/oML3BbX3FRY1ytm3n+qJ+ONFzzdEkDpBwDOKHMuG3qe/Qo9hAOxYLwvPZ0fUiM1m+WErvSB1l2LpsGG3E4iIOWnImhDm8zK5suvwOxHLxNb29TOxA5HVX88cHOxsfHhCwy5WWec6rxyIf+Af+nAC+grXEBx9dIjEKx+MEjSdPlLrAolfrCjuTnsOFJJDean9Vgzqt2WbQMDV3gF1QKLQGrGqPTcC5/Up+HZDgk8SIAubGoOjg9Vt/qEq5I+WNZhWCBBHjzDZkAO59NFitP3d/LZ9hcc3mJEkGX32taP1j8rzGccz33Wb2GCYzUKYdfrUqvCplJFihqjbwyOSGYzJRKGo7OqFNYcyfnqzl3PXRD8SPK+xlUeHts/X9enJZ7Nko3Hiq6UszA0iKGT+hSnokGjaD6fi7DNm2tXgrKILJaFZ5+re1QNES6O1vjOaQNF7euDQZ3mldJ0sk2PfGEO8j24rWWSs7tTrwNcJ4RWZ1l5KC2plIXlGJUleJnFEZbQgy4rn+/ic5eC64LL+S3bNc+5A3ngXkaHSr78R2isM58sk7nDBaxHN+H1HvA2H7Q80T6WA8rgTZMkSn2DkXtOXBFgRMqkfm25T0hYkvEAC/2RIKOXaN7ac+NEqVDQZj5L7zFODx093g4WON2BSa4OM6SHCngGk7w7EfmlBLuzoyaVi/ebliMoybuMHDwTjFZ+9lspm3BtP6KzaXx1fRzi+V5RdtmB73JrvE04xyT2JVuTNLNI9Xx968ilpwYM8EnXJd2glGkJsHowV0BgngX7NGADH1DM9hEGoyEU7ROEmMGPUUgfeOj29n0wihMiZGlOxa4pvNpiJZKO+dIwTwFTTjS7AVX2NfN9p8hRYPNZN6xUhFgMzbgO5n/uLbWumxUTGuYriLoit525M9+Nbgx9bnZPFeEeYF6VQqBtcK4/aCDxq4mh8K5aN/rFRdAGKMpVpS2oMg2ftz7YEteK6f+KouhmTI4c5I/FeAE73L3UEhTEiVj3mzZ+bsMvm44fZ0ZCg9AMae61ysybc/62bExa5nkheCK5R7lpt++PNkBvvp+xMFPl7GixnRTV7WlbEGYX60S+LGRplBqDRHE4WCshx7H6XN8JFA4iekugkp3yeeC6rDGvJzeXNXnUK/CTc/Wa57CeA/WqzjUg/lIKSnapJHay7OrMdY2HqnOtjBb8A7QTKc/cpdzXKNncH5j8TgejJF3lqB4DNJePtP7gByMhbTWdLETh7gdUb5Qn5ya0PrbEnMGIFoJaHdOext0rZILagRbB7WF1Sakug9cegUEyPUtlfulhiemSHTatiPr0ww2EBup/LC5Z6KUmjTqRxs6cmiQy3RlNvqJm98yphFCBmVF2j5UQvtLgcIlOO1QWX6Cyru3irfAVcRqgx47pHYNsQfODhk9FyJLcbwhRNKm9obS/NyftXCfO/XkD03vaWWl+OeHVIZhP5hpYZb/i1CusDDYKMzb2sBxKNfzJUcpZXXtlJ8UUCb6VM5XvSRURWKui26c/vGdkDuprMA3MMqV668KGkscZU9Z44lJ3qhan0Bh3Ma/F14G+JIqadWKeCHoWlRH1BidJoZf6Cx2QYjZ7DBp/6w6kW6sWI1XagufERmJQd3q1zj+QwRR3p5PWoi1KHD6UKgp0knId7jM+USMc8qO5TtwTUC9XEnJ/XFHMaDioPcA0vWiOpbuodpSRfh6eu5fDdqyUKkxArJdph1XEBXIzlyAjp92/IAPsNsrHxq5ob4sKiD3xVAWdserhLMMG1dLTFRStXO8v7X+6N6YwUWeIVK/fhphozCzmANRJlgCdRbfernY4xwyKdJEt1sw8aBJ/R2flGneGKLcut8A6smcL3bzQPYleYCqoPKKAD2k5tdjYu9QXfvVSuZ0+n+UOr/OEbstabZ58CkFUI5+62lDC/FzIPHCyeNf76CQ0ouGo1FbI8BgT2B6lF3DiZikYcFhrP937ueYvPCP3XR56S+j6E6ejTzC1Dx0aQJKaAbhCu3w1XqBhPI6Va3OWkPcGQ9k8sTSVUwKO5HROWP5Q3acN9Dj4ckuEB+qkTxqTxBLdx+xL4hQPc9VeaAVWv/vu9+h3aLPVh+m2TZDmYdLNGffrvVErIHNnqlk7pH0ynhhFN1FMR8jw3NEHndcLT9pjzpfERcN39UeOx2EpomI0sHzePiPXx67Ab+dBNxmlqoN1XEt3gAfFoyEHzqkHfUvFQ/lpB6hX/m883Et3K2DjT0DLDoFvkTKlD7yfh3f12RjDK5+ylEqDQzocGYgZ/wvdQauXVU04z76mX9p73pGohXJHUeKQ/e4HMyctOr/MiOhTrAbW+ZdrZktPnBzvyEMInaq0YmW5IpFO1QkM/44vWqEQBjgTD1OUUw3m7jzUcmuC0U9LPpO20txuCHVAFNJ+Eyhd1PvAOS4h/7Js1Wr0D4nzmsvqFEhTKuY/WwlbgkCOGlycm7SLS1o8wQ8+r1ieFibfh4zpN4oJM7iypTZI3A+347MeZLYpL/HAVDihdpjOcVdkna/M2JtgOUmHdK1cOE6ZSskZ06i8tFca3vkWZMMpbqP4RZDbJW+SPACxgnd/gVpzFAuHO41YFB0VXAw8QP9ap31QEX3EuoOxy91KZKF/ZlBmILrm9/K/NzNKBVVS2ABFtb2YMJ2F18GWPqfG/rHbX2xhFL/oB/2NYWl2qKVrIFL6/lfkPwkMkFPd6oqEiiMiaM2K8LVLyut6v8FlK198/GqqzyT7YLBZ9N3v9IZY/p6T7IyU5kFZQ260noM55h+jNhhYeNvY4uO+kto4/DrltqdHTltZZSpHSMo14r+Tiqp0PA3hpLLIgjR7vadCk+oWa7LY5dRpTc3FiJu3c9gxMCrw1SgKko7Oj7Jj8S0P7WWAdsm31H5xoGnTNBow8KLbK9dGh5q4MWSj1VhvtGOG45lEN865OW+S5Z3XTFb8JW0wlo7WiLaGrgHsH738bymZpNU+cSyjhuLEZRwMsoMcFJTsSQR6Srla22Hk20pMMWHNVUYQN5Pm4WpdkFehl/ykMtf6jjuNuiKgkBjuzfWWex+5KEHrIYibCKO+aNhlJ8y+hAAM04EiW7uRxQ71nJzuxO9U2bxn2hktZMj/d4zw/Zhgx9vCPKQKr6YmfcYcVKIgkQ4BCEP2Nlj158Hn+5ZHs5mvYbqKmYO6+YTcYPQUFvkz3vN8+qSqmscrS2XGGCkFJw65ll/bdI3lHFIqTKl3FnygO3/E9QgBxPy5BWYKqcAU2E40YnpeA4dj/WPqZ++M1nFXyLixEuHVMC4w5qxWRKW0rk4XMkOMSmY8AoA4U/cl6umtWmBWtc/tDqjiqsKUiw3elMvYWREWV1/coaCBaNy3ef9Ed/K83iKVe2ix/oxQkJ+tn7flNnTg6FOg472SqmCtjA2c0pTk1HmbmheoWoYz6wLu3yIcH7ZASU9aDz6CfoKWTyX9+Qh6v/g+3T5tSf7RMfb+8PgjI/7kzt/F0kpmSMpTVnmc68gAJs+WIsBXq0+V/WVO4J+DwlZw27zKyiktCrJEWP58dSRouCfZY8dei0lHMwpMqdYCakiKKzF1+mH83PcSLLZj/k8Zb5GRInBsLFyXvHfNf3BbVTJdkvGu1UK8O71Is9DxxCs2660H3iruNN8c+OyLd2dtIytDhx+eJEaIoXONWgcrwLg/se5M7HJxqcWvm+O0qa57MfSzC/qlg9ntpgqdSnxKHemu4zpXHkLzM4VnlNPay1nfCvmmSbBn+QwJvVansiL7x2C9YP5AYPeiXzSbJO1MhP+nnKMdFxuIhEqMJp5L7VxynELNfaybxayWhnV+DH1iJm8KEh62pEbyv++BIXhM9LDujplfPxrDx5Ctp+vc8j4OeZzro1idk8GB+1kyRl4SiJwRNIhWi2VL5gcB9OlDkM4RyLYB2IsEngPAef9icAASIbS31R8r6ty29R12LwGZtiHZczVdtX/5LiGZAlKx+c7l3cyRdu3qkR8p5N3t1W/IHB5lyp1ENa+U1uEogOTmc3DoQ3mMKV84XHCr1zQh8e/snAtfWrOYiKWbhgdcP0UX7ZFzyc6ivEI6vVqaL9ZSyQOFgI+3oWyaX2wXGYvOXo1zuYGES9HkHvGbVI6IBqnubdKYiKPxwKTiwHYzMIgxr0KLifMKmWxx8Wu/F+TdxlMdWUfFXaEvAGynW80g1qLbhKuPBoZlcuYJ/7TJJQ9iJxZxBCJf+GIkCeRW7M1ZJYAYnTCQUj6tLptAIDJKI2ysogZTzfA26S1sdIUPDfZ9+/84ppMaA/LeePR98CFpj/BnZFe6u4y/WSZLXKFhE3II6SP2BlQ5x26aDaC+ldQ7uutzmIHQyAc4B8DQuD2U2fPHHAHVENVsdf7deEguyE53ku22xFJdHPRhnjhqnZH9OHTnTSeMLfZCAACI/+cAykHBHZD7Mo7XTiWppuujU0jUu2FoOhig6fzhSvU/Q11FOAIo7/nQZm/TpeiUMwPGe7ABX+xqrjPUGX6jkFnnS6Q28O6jrZ30a1aSQb7SlpHkUSHlcpG64YRNWcdFUwrWCymsE4sLEQU70EcnEKVqEdzvoQDtnPHBC2z+AyFtS7REOS8UJJ53fq3WPSNKfuSazrRLAtPbe/hAgGyZkfDzdL8E9qRjb9qc9WcKsLPIBfpSwuK4zkTHP4XA0E08Dw0m3fYJx4Sf6aqz3BlzFoY8YxlTx3fnVXGE1tm6bPXBxoGm1dv3AfLAwi3DCVEllqRhl0ZpMnHmQbg74j5lNCq2KQWa3AO251g6ZWCu4fVpp6NKNjJnfe9lJ/363EYXzYFFFH2CJ12B9/JtdA/SF5EklhKyE26ARqiuzVwxHl3HaXxLUHEA+7CA1t0XUhisu8ugkQjtrNXo8N0JZWsQ28jc9nZYrCH3c+d7NCJQ8fFDVSIvMVW3YWhlf0yt/3Z9InB5tlUyjwhcWmVMG8mLa80LR7AAUX+xHc7pFboIjLqRu7+XHCABQhNDAGJwukaXx7VplptKLQrqYi3OAWZSl5ZCzHFTXvhWEkZ0Soxd7BER4qnB+6x3mHUMGzTZNQAwlp8PPxGp2h0x/l0aAuLE6ZQBmpf/X6Gni3xk71/B5eZStrFHo8q0BEHC07EKVuQuVwhSYlHIWtoYRRcawAmFahabqKElV5bkSZgqDXzDdy60+9Xg1yzg+cUAAAAAAAAAAAAAAAAA=",
		  "face-closed": "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"
		};
		//#endregion
		//#region \0dsh-css:/home/falser/Projects/dsh-mascot/src/client/character/ImageSkin.module.css.mjs
		const css$4 = "._RRE5q_root{width:100%;height:100%;overflow:visible}._RRE5q_body{transform-box:fill-box;transform-origin:50%}._RRE5q_face{transform-box:fill-box;transform-origin:50%;animation:.22s ease-out _RRE5q_mascot-face-pop}@keyframes _RRE5q_mascot-face-pop{0%{opacity:.4;transform:scale(.96)}to{opacity:1;transform:scale(1)}}._RRE5q_root[data-mood=idle] ._RRE5q_body{animation:2.8s ease-in-out infinite _RRE5q_mascot-breathe}@keyframes _RRE5q_mascot-breathe{0%,to{transform:scale(1)}50%{transform:scale(1.035,.97)}}._RRE5q_root[data-mood=queued]{animation:.6s ease-in-out infinite _RRE5q_mascot-hop}@keyframes _RRE5q_mascot-hop{0%,to{transform:translateY(0)}30%{transform:translateY(-7px)}60%{transform:translateY(0)}75%{transform:translateY(-3px)}}._RRE5q_root[data-mood=confirming] ._RRE5q_body{animation:1.8s ease-in-out infinite _RRE5q_mascot-tilt}@keyframes _RRE5q_mascot-tilt{0%,to{transform:rotate(0)}50%{transform:rotate(6deg)}}._RRE5q_root[data-mood=thinking] ._RRE5q_body{animation:2s ease-in-out infinite _RRE5q_mascot-think}@keyframes _RRE5q_mascot-think{0%,to{transform:rotate(-3deg)}50%{transform:rotate(4deg)}}._RRE5q_root[data-mood=working] ._RRE5q_body{animation:.5s ease-in-out infinite _RRE5q_mascot-busy}@keyframes _RRE5q_mascot-busy{0%,to{transform:rotate(0)}25%{transform:rotate(2deg)}75%{transform:rotate(-2deg)}}._RRE5q_root[data-mood=streaming] ._RRE5q_body{animation:.9s ease-in-out infinite _RRE5q_mascot-nod}@keyframes _RRE5q_mascot-nod{0%,to{transform:rotate(0)}50%{transform:rotate(2.5deg)}}._RRE5q_root[data-mood=done]{animation:.9s ease-in-out 2 _RRE5q_mascot-celebrate}@keyframes _RRE5q_mascot-celebrate{0%,to{transform:translateY(0)rotate(0)}35%{transform:translateY(-10px)rotate(-4deg)}65%{transform:translateY(-5px)rotate(4deg)}}._RRE5q_root[data-mood=error]{animation:.35s linear infinite _RRE5q_mascot-shake}@keyframes _RRE5q_mascot-shake{0%,to{transform:translate(0)}25%{transform:translate(-2.6px)}75%{transform:translate(2.6px)}}._RRE5q_root[data-mood=greeting]{animation:.6s ease-in-out infinite alternate _RRE5q_mascot-wave}@keyframes _RRE5q_mascot-wave{0%{transform:rotate(-4deg)}to{transform:rotate(4deg)}}._RRE5q_root[data-dragging=true] *,._RRE5q_root[data-dragging=true]{animation:none!important}@media (prefers-reduced-motion:reduce){._RRE5q_root,._RRE5q_root *{animation:none!important}}";
		const tagId$4 = "@falser101/mascot/ImageSkin.module.css";
		if (typeof document !== "undefined" && document.querySelector("style[data-plugin-css=" + JSON.stringify(tagId$4) + "]") === null) {
			const tag = document.createElement("style");
			tag.dataset.plugin = "@falser101/mascot";
			tag.dataset.pluginCss = tagId$4;
			tag.textContent = css$4;
			document.head.appendChild(tag);
		}
		var ImageSkin_module_css_default = {
			"body": "_RRE5q_body",
			"face": "_RRE5q_face",
			"mascot-shake": "_RRE5q_mascot-shake",
			"root": "_RRE5q_root",
			"mascot-tilt": "_RRE5q_mascot-tilt",
			"mascot-celebrate": "_RRE5q_mascot-celebrate",
			"mascot-nod": "_RRE5q_mascot-nod",
			"mascot-busy": "_RRE5q_mascot-busy",
			"mascot-think": "_RRE5q_mascot-think",
			"mascot-wave": "_RRE5q_mascot-wave",
			"mascot-breathe": "_RRE5q_mascot-breathe",
			"mascot-hop": "_RRE5q_mascot-hop",
			"mascot-face-pop": "_RRE5q_mascot-face-pop"
		};
		//#endregion
		//#region src/client/character/ImageSkin.tsx
		const FRAME = {
			x: 4,
			y: 2,
			w: 112,
			h: 112
		};
		const FACES = ["neutral", "happy", "sad", "thinking", "closed"];
		const BLINK_MS = 4e3;
		const BLINK_CLOSED_MS = 200;
		const FACE_BY_MOOD = {
			idle: "neutral",
			queued: "neutral",
			confirming: "thinking",
			thinking: "thinking",
			working: "neutral",
			streaming: "neutral",
			done: "happy",
			error: "sad",
			greeting: "happy",
			elsewhere: "neutral"
		};
		function faceUri(face) {
			return `data:image/webp;base64,${CHARACTER_ASSETS[`face-${face}`]}`;
		}
		function ImageSkin({ mood, dragging }) {
			const [blinking, setBlinking] = (0, react.useState)(false);
			(0, react.useEffect)(() => {
				const interval = setInterval(() => {
					setBlinking(true);
					setTimeout(() => {
						setBlinking(false);
					}, BLINK_CLOSED_MS);
				}, BLINK_MS);
				return () => {
					clearInterval(interval);
				};
			}, []);
			const face = blinking && FACE_BY_MOOD[mood] === "neutral" ? "closed" : FACE_BY_MOOD[mood];
			return /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("svg", {
				className: ImageSkin_module_css_default.root,
				"data-mood": mood,
				"data-dragging": dragging,
				viewBox: "0 0 120 120",
				role: "img",
				"aria-hidden": "true",
				children: [/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("g", {
					className: ImageSkin_module_css_default.body,
					children: [FACES.map((pre) => /* @__PURE__ */ (0, react_jsx_runtime.jsx)("image", {
						href: faceUri(pre),
						x: "0",
						y: "0",
						width: "0",
						height: "0"
					}, `pre-${pre}`)), /* @__PURE__ */ (0, react_jsx_runtime.jsx)("image", {
						className: ImageSkin_module_css_default.face,
						href: faceUri(face),
						x: FRAME.x,
						y: FRAME.y,
						width: FRAME.w,
						height: FRAME.h
					})]
				})]
			});
		}
		//#endregion
		//#region src/client/character/skins.ts
		/** The installed skins, in settings-row display order. */
		const SKINS = [
			{
				id: "cat",
				labelKey: "skin.cat",
				Component: CatSkin
			},
			{
				id: "dog",
				labelKey: "skin.dog",
				Component: DogSkin
			},
			{
				id: "custom",
				labelKey: "skin.custom",
				Component: ImageSkin
			}
		];
		/** Resolve one skin definition by id (fallback: the first installed skin). */
		function skinOf(id) {
			return SKINS.find((skin) => skin.id === id) ?? SKINS[0];
		}
		//#endregion
		//#region \0dsh-css:/home/falser/Projects/dsh-mascot/src/client/MascotView.module.css.mjs
		const css$3 = ".TvUanW_root{z-index:200;cursor:grab;touch-action:none;-webkit-user-select:none;user-select:none;outline:none;width:96px;height:96px;transition:transform .18s;position:fixed}.TvUanW_root:hover,.TvUanW_root:focus-visible{transform:scale(1.08)}.TvUanW_root.TvUanW_dragging{cursor:grabbing;transition:none;transform:scale(1.04)}.TvUanW_character{width:100%;height:100%}.TvUanW_bubble{transform-origin:bottom;opacity:0;pointer-events:none;color:#3b2f2a;white-space:nowrap;text-overflow:ellipsis;z-index:1;background:#fff;border-radius:14px;max-width:240px;padding:8px 12px;font-size:13px;line-height:1.4;transition:opacity .18s,transform .18s;position:absolute;bottom:calc(100% + 12px);left:50%;overflow:hidden;transform:translate(-50%)translateY(4px)scale(.92);box-shadow:0 4px 16px #0000002e}.TvUanW_bubble:after{content:\"\";border:6px solid #0000;border-top-color:#fff;position:absolute;top:100%;left:50%;transform:translate(-50%)}.TvUanW_bubbleVisible{opacity:1;transform:translate(-50%)translateY(0)scale(1)}.TvUanW_bubbleText{vertical-align:middle;animation:.22s ease-out TvUanW_mascot-bubble-pop;display:inline-block}@keyframes TvUanW_mascot-bubble-pop{0%{transform:scale(.9)}60%{transform:scale(1.04)}to{transform:scale(1)}}.TvUanW_busy{vertical-align:middle;gap:3px;margin-left:7px;display:inline-flex}.TvUanW_busy i{opacity:.35;background:currentColor;border-radius:50%;width:4px;height:4px;animation:1.1s ease-in-out infinite TvUanW_mascot-busy-dot}.TvUanW_busy i:nth-child(2){animation-delay:.18s}.TvUanW_busy i:nth-child(3){animation-delay:.36s}@keyframes TvUanW_mascot-busy-dot{0%,to{opacity:.25;transform:translateY(0)}40%{opacity:1;transform:translateY(-2.5px)}}.TvUanW_badge{color:#fff;text-align:center;z-index:2;background:#e5484d;border-radius:10px;min-width:20px;height:20px;padding:0 5px;font-size:12px;font-weight:700;line-height:20px;position:absolute;top:-6px;right:-6px;box-shadow:0 2px 6px #00000040}.TvUanW_bubbleList{white-space:normal;max-width:300px;padding:6px}.TvUanW_peerList{flex-direction:column;gap:2px;margin:0;padding:0;list-style:none;display:flex}.TvUanW_peerRow{border-radius:8px;align-items:center;gap:8px;padding:4px 6px;font-size:13px;line-height:1.35;display:flex}.TvUanW_peerRowJump{cursor:pointer}.TvUanW_peerRowJump:hover{background:#0000000f}.TvUanW_peerIcon{flex:none;font-size:14px}.TvUanW_peerLabel{text-overflow:ellipsis;white-space:nowrap;min-width:0;overflow:hidden}.TvUanW_peerStatus{opacity:.65;flex:none;margin-left:auto;font-size:12px}.TvUanW_root.TvUanW_collapsed{width:44px;height:44px}.TvUanW_root.TvUanW_collapsed:hover{transform:scale(1.12)}.TvUanW_dot{background:radial-gradient(circle at 35% 30%,#f9c784,#e89a5b);border-radius:50%;width:100%;height:100%;box-shadow:0 3px 10px #0003}@media (prefers-reduced-motion:reduce){.TvUanW_root,.TvUanW_bubble,.TvUanW_bubbleText,.TvUanW_busy i{transition:none;animation:none}}";
		const tagId$3 = "@falser101/mascot/MascotView.module.css";
		if (typeof document !== "undefined" && document.querySelector("style[data-plugin-css=" + JSON.stringify(tagId$3) + "]") === null) {
			const tag = document.createElement("style");
			tag.dataset.plugin = "@falser101/mascot";
			tag.dataset.pluginCss = tagId$3;
			tag.textContent = css$3;
			document.head.appendChild(tag);
		}
		var MascotView_module_css_default = {
			"root": "TvUanW_root",
			"peerLabel": "TvUanW_peerLabel",
			"peerStatus": "TvUanW_peerStatus",
			"peerRowJump": "TvUanW_peerRowJump",
			"peerRow": "TvUanW_peerRow",
			"dragging": "TvUanW_dragging",
			"mascot-busy-dot": "TvUanW_mascot-busy-dot",
			"bubbleList": "TvUanW_bubbleList",
			"badge": "TvUanW_badge",
			"collapsed": "TvUanW_collapsed",
			"dot": "TvUanW_dot",
			"bubbleVisible": "TvUanW_bubbleVisible",
			"peerList": "TvUanW_peerList",
			"bubbleText": "TvUanW_bubbleText",
			"mascot-bubble-pop": "TvUanW_mascot-bubble-pop",
			"busy": "TvUanW_busy",
			"bubble": "TvUanW_bubble",
			"peerIcon": "TvUanW_peerIcon",
			"character": "TvUanW_character"
		};
		//#endregion
		//#region src/client/MascotView.tsx
		/**
		* The floating companion view, mounted into the frame-wide `shell.overlay`
		* slot. Reads the shared mascot store (position, collapsed, skin, busy
		* bubble preference) and the inject-bound mood source; owns only
		* component-local interaction state (drag session, poke line, hover line).
		* All presentation derives from the mood frame; nothing here reaches the
		* session or the model. The busy badge and hover peer list surface parallel
		* executions from the fold's `busyCount`/`peers`.
		*/
		/** How long a poke line stays visible, ms. */
		const POKE_MS = 2e3;
		/** Poke lines, cycled in order on each click. */
		const POKE_KEYS = [
			"poke.0",
			"poke.1",
			"poke.2",
			"poke.3"
		];
		/** Idle hover lines, picked at random on each hover. */
		const IDLE_HOVER_KEYS = [
			"hover.idle.0",
			"hover.idle.1",
			"hover.idle.2",
			"hover.idle.3",
			"hover.idle.4"
		];
		/** Moods that keep the bubble visible without a hover (the agent is busy). */
		const BUSY_MOODS = [
			"queued",
			"confirming",
			"thinking",
			"working",
			"streaming",
			"error",
			"elsewhere"
		];
		/** Moods that show the animated busy marker in the bubble corner. */
		const MARKED_MOODS = [
			"thinking",
			"working",
			"streaming"
		];
		/** Idle pop-up timing per cadence level (visible duration, interval). */
		const IDLE_POP_CADENCES = {
			quiet: {
				durationMs: 6e3,
				intervalMs: 6e4
			},
			standard: {
				durationMs: 8e3,
				intervalMs: 4e4
			},
			lively: {
				durationMs: 6e3,
				intervalMs: 2e4
			}
		};
		/** Badge threshold: show the parallel-count badge from two executions on. */
		const BADGE_MIN = 2;
		/** The reassuring hover line for one steady mood. */
		function hoverKeyOf(mood, idleIndex) {
			switch (mood) {
				case "idle": return IDLE_HOVER_KEYS[idleIndex] ?? IDLE_HOVER_KEYS[0];
				case "queued": return "hover.queued";
				case "confirming": return "hover.confirming";
				case "thinking": return "hover.thinking";
				case "working": return "hover.working";
				case "streaming": return "hover.streaming";
				case "error": return "hover.error";
				case "elsewhere": return "mood.elsewhere";
				case "done": return "mood.done";
				case "greeting": return "mood.greeting";
			}
		}
		/** Small icon for one peer kind. */
		function peerIcon(kind) {
			switch (kind) {
				case "session": return "💬";
				case "subagent": return "🧩";
				case "job": return "⏳";
			}
		}
		function clamp(value, max) {
			return Math.max(0, Math.min(max, value));
		}
		function clampToViewport(x, y) {
			return {
				x: clamp(x, window.innerWidth - 96),
				y: clamp(y, window.innerHeight - 96)
			};
		}
		/**
		* Render the draggable companion with its speech bubble. The bubble is
		* always visible while the agent is busy (unless the settings toggle turns
		* that off), swaps to a reassuring line while hovered, and becomes a peer
		* list while hovered during parallel executions. A badge counts parallel
		* executions from two on.
		* @param props - composed overlay-entry props.
		*/
		function MascotView(props) {
			const { useStore, actions, useMascot, useLines, t, openPeer, setAiLines } = props;
			const state = useStore((value) => value);
			const mascot = useMascot((value) => value);
			const line = useLines((value) => value);
			const [dragging, setDragging] = (0, react.useState)(false);
			const [poke, setPoke] = (0, react.useState)(null);
			const [hovering, setHovering] = (0, react.useState)(false);
			const [idleHoverIndex, setIdleHoverIndex] = (0, react.useState)(0);
			const [popVisible, setPopVisible] = (0, react.useState)(false);
			const dragRef = (0, react.useRef)(null);
			const pokeCounter = (0, react.useRef)(0);
			(0, react.useEffect)(() => {
				setAiLines(state.aiLines);
			}, [state.aiLines, setAiLines]);
			const isIdle = mascot.mood === "idle";
			const cadence = IDLE_POP_CADENCES[state.popCadence] ?? IDLE_POP_CADENCES.standard;
			(0, react.useEffect)(() => {
				if (!isIdle || !state.bubbleAlways) {
					setPopVisible(false);
					return;
				}
				let hideTimer;
				let shown = false;
				const show = () => {
					if (shown) return;
					shown = true;
					setPopVisible(true);
					hideTimer = setTimeout(() => {
						shown = false;
						setPopVisible(false);
					}, cadence.durationMs);
				};
				show();
				const interval = setInterval(show, cadence.intervalMs);
				return () => {
					clearInterval(interval);
					if (hideTimer !== void 0) clearTimeout(hideTimer);
					setPopVisible(false);
				};
			}, [
				isIdle,
				state.bubbleAlways,
				cadence.durationMs,
				cadence.intervalMs
			]);
			(0, react.useEffect)(() => {
				const onResize = () => {
					const clamped = clampToViewport(state.x, state.y);
					if (clamped.x !== state.x || clamped.y !== state.y) actions.move(clamped.x, clamped.y);
				};
				window.addEventListener("resize", onResize);
				return () => window.removeEventListener("resize", onResize);
			}, [
				actions,
				state.x,
				state.y
			]);
			const pokeNow = () => {
				pokeCounter.current += 1;
				const index = (pokeCounter.current - 1) % POKE_KEYS.length;
				const nonce = pokeCounter.current;
				setPoke({
					text: t(POKE_KEYS[index]),
					nonce
				});
				window.setTimeout(() => {
					setPoke((current) => current?.nonce === nonce ? null : current);
				}, POKE_MS);
			};
			const onPointerDown = (event) => {
				if (event.button !== 0) return;
				event.currentTarget.setPointerCapture(event.pointerId);
				dragRef.current = {
					pointerId: event.pointerId,
					offsetX: event.clientX - state.x,
					offsetY: event.clientY - state.y,
					moved: false
				};
				setDragging(true);
			};
			const onPointerMove = (event) => {
				const drag = dragRef.current;
				if (drag === null || drag.pointerId !== event.pointerId) return;
				const clamped = clampToViewport(event.clientX - drag.offsetX, event.clientY - drag.offsetY);
				if (clamped.x !== state.x || clamped.y !== state.y) {
					drag.moved = true;
					actions.move(clamped.x, clamped.y);
				}
			};
			const onPointerUp = () => {
				const drag = dragRef.current;
				dragRef.current = null;
				setDragging(false);
				if (drag !== null && !drag.moved) pokeNow();
			};
			const onDoubleClick = () => {
				actions.setCollapsed(!state.collapsed);
			};
			const onHoverEnter = () => {
				setIdleHoverIndex(Math.floor(Math.random() * IDLE_HOVER_KEYS.length));
				setHovering(true);
			};
			const Skin = skinOf(state.skin).Component;
			const busyMarked = MARKED_MOODS.includes(mascot.mood);
			const showPeerList = hovering && mascot.peers.length > 1;
			const idleLine = line.startsWith("ai:") ? line.slice(3) : t(line);
			const bubbleText = state.collapsed ? t("collapse.hint") : poke?.text ?? (hovering && !showPeerList ? t(hoverKeyOf(mascot.mood, idleHoverIndex)) : mascot.mood === "idle" ? idleLine : t(mascot.textKey, mascot.params));
			const busy = BUSY_MOODS.includes(mascot.mood);
			const bubbleVisible = poke !== null || mascot.until !== void 0 || hovering || state.bubbleAlways && (busy || popVisible);
			const showBadge = mascot.busyCount >= BADGE_MIN;
			return /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
				className: [
					MascotView_module_css_default.root,
					dragging ? MascotView_module_css_default.dragging : void 0,
					state.collapsed ? MascotView_module_css_default.collapsed : void 0
				].filter(Boolean).join(" "),
				style: {
					left: state.x,
					top: state.y
				},
				role: "button",
				tabIndex: 0,
				"aria-label": t("widget.aria"),
				onPointerDown,
				onPointerMove,
				onPointerUp,
				onDoubleClick,
				onMouseEnter: onHoverEnter,
				onMouseLeave: () => {
					setHovering(false);
				},
				onKeyDown: (event) => {
					if (event.key === "Enter" || event.key === " ") {
						event.preventDefault();
						pokeNow();
					}
				},
				children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)("div", {
					className: `${MascotView_module_css_default.bubble}${bubbleVisible ? ` ${MascotView_module_css_default.bubbleVisible}` : ""}${showPeerList ? ` ${MascotView_module_css_default.bubbleList}` : ""}`,
					"data-visible": bubbleVisible,
					role: "status",
					"aria-live": "polite",
					children: showPeerList ? /* @__PURE__ */ (0, react_jsx_runtime.jsx)("ul", {
						className: MascotView_module_css_default.peerList,
						children: mascot.peers.map((peer) => /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("li", {
							className: `${MascotView_module_css_default.peerRow}${peer.kind !== "job" ? ` ${MascotView_module_css_default.peerRowJump}` : ""}`,
							onClick: peer.kind === "job" ? void 0 : () => {
								openPeer(peer.id);
							},
							role: peer.kind === "job" ? void 0 : "button",
							children: [
								/* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", {
									className: MascotView_module_css_default.peerIcon,
									"aria-hidden": "true",
									children: peerIcon(peer.kind)
								}),
								/* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", {
									className: MascotView_module_css_default.peerLabel,
									children: peer.label
								}),
								/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("span", {
									className: MascotView_module_css_default.peerStatus,
									children: [peer.current ? "· " : "", t(peer.statusKey, peer.statusParams)]
								})
							]
						}, peer.id))
					}) : /* @__PURE__ */ (0, react_jsx_runtime.jsxs)(react_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", {
						className: MascotView_module_css_default.bubbleText,
						children: bubbleText
					}, bubbleText), busyMarked && /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("span", {
						className: MascotView_module_css_default.busy,
						"aria-hidden": "true",
						children: [
							/* @__PURE__ */ (0, react_jsx_runtime.jsx)("i", {}),
							/* @__PURE__ */ (0, react_jsx_runtime.jsx)("i", {}),
							/* @__PURE__ */ (0, react_jsx_runtime.jsx)("i", {})
						]
					})] })
				}), state.collapsed ? /* @__PURE__ */ (0, react_jsx_runtime.jsx)("div", {
					className: MascotView_module_css_default.dot,
					"aria-hidden": "true"
				}) : /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
					className: MascotView_module_css_default.character,
					children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)(Skin, {
						mood: mascot.mood,
						dragging
					}), showBadge && /* @__PURE__ */ (0, react_jsx_runtime.jsx)("div", {
						className: MascotView_module_css_default.badge,
						role: "status",
						"aria-label": t("badge.label", { count: mascot.busyCount }),
						children: mascot.busyCount
					})]
				})]
			});
		}
		//#endregion
		//#region \0dsh-css:/home/falser/Projects/dsh-mascot/src/client/SkinSettingRow.module.css.mjs
		const css$2 = ".gOSCaq_row{justify-content:space-between;align-items:center;gap:16px;display:flex}.gOSCaq_rowText{min-width:0}.gOSCaq_title{font-size:14px;font-weight:600}.gOSCaq_desc{opacity:.65;margin-top:2px;font-size:12px}.gOSCaq_selector{color:inherit;cursor:pointer;background:0 0;border:1px solid #7f7f7f59;border-radius:8px;align-items:center;gap:6px;padding:6px 10px;font-size:13px;display:inline-flex}.gOSCaq_selector:hover{border-color:#7f7f7f99}.gOSCaq_chevron{opacity:.6}";
		const tagId$2 = "@falser101/mascot/SkinSettingRow.module.css";
		if (typeof document !== "undefined" && document.querySelector("style[data-plugin-css=" + JSON.stringify(tagId$2) + "]") === null) {
			const tag = document.createElement("style");
			tag.dataset.plugin = "@falser101/mascot";
			tag.dataset.pluginCss = tagId$2;
			tag.textContent = css$2;
			document.head.appendChild(tag);
		}
		var SkinSettingRow_module_css_default = {
			"rowText": "gOSCaq_rowText",
			"desc": "gOSCaq_desc",
			"selector": "gOSCaq_selector",
			"row": "gOSCaq_row",
			"chevron": "gOSCaq_chevron",
			"title": "gOSCaq_title"
		};
		//#endregion
		//#region src/client/SkinSettingRow.tsx
		/**
		* General-settings preference row: the companion's active skin selector.
		* Reads and writes the shared mascot store, so the choice applies to the
		* overlay entry instantly and persists through the store's localStorage key.
		*/
		/**
		* Render the skin preference row with a menu selector.
		* @param props - composed settings-row props.
		*/
		function SkinSettingRow(props) {
			const { useStore, actions, t } = props;
			const state = useStore((value) => value);
			const [open, setOpen] = (0, react.useState)(false);
			const selectedLabel = t(skinOf(state.skin).labelKey);
			return /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
				className: SkinSettingRow_module_css_default.row,
				children: [/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
					className: SkinSettingRow_module_css_default.rowText,
					children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)("div", {
						className: SkinSettingRow_module_css_default.title,
						children: t("skin.title")
					}), /* @__PURE__ */ (0, react_jsx_runtime.jsx)("div", {
						className: SkinSettingRow_module_css_default.desc,
						children: t("skin.description")
					})]
				}), /* @__PURE__ */ (0, react_jsx_runtime.jsx)(_deepseek_ai_dsh_client_ui_primitives.Menu, {
					open,
					onClose: () => {
						setOpen(false);
					},
					items: SKINS.map((skin) => ({
						id: skin.id,
						label: t(skin.labelKey)
					})),
					selectedId: state.skin,
					onSelect: (id) => {
						setOpen(false);
						actions.setSkin(id);
					},
					align: "end",
					portal: true,
					anchor: /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("button", {
						type: "button",
						className: SkinSettingRow_module_css_default.selector,
						"aria-haspopup": "menu",
						"aria-expanded": open,
						onClick: () => {
							setOpen((value) => !value);
						},
						children: [selectedLabel, /* @__PURE__ */ (0, react_jsx_runtime.jsx)(_deepseek_ai_dsh_client_ui_primitives.IconChevronDownOutline14, { className: SkinSettingRow_module_css_default.chevron })]
					})
				})]
			});
		}
		//#endregion
		//#region \0dsh-css:/home/falser/Projects/dsh-mascot/src/client/BubbleSettingRow.module.css.mjs
		const css$1 = ".H9Jnhq_row{justify-content:space-between;align-items:center;gap:16px;display:flex}.H9Jnhq_rowText{min-width:0}.H9Jnhq_title{font-size:14px;font-weight:600}.H9Jnhq_desc{opacity:.65;margin-top:2px;font-size:12px}.H9Jnhq_switch{cursor:pointer;background:#7f7f7f2e;border:1px solid #7f7f7f66;border-radius:11px;width:40px;height:22px;padding:0;transition:background .18s,border-color .18s;position:relative}.H9Jnhq_knob{background:#fff;border-radius:50%;width:16px;height:16px;transition:transform .18s;position:absolute;top:2px;left:2px;box-shadow:0 1px 3px #0000004d}.H9Jnhq_switchOn{background:#4c8bf5;border-color:#4c8bf5}.H9Jnhq_switchOn .H9Jnhq_knob{transform:translate(18px)}";
		const tagId$1 = "@falser101/mascot/BubbleSettingRow.module.css";
		if (typeof document !== "undefined" && document.querySelector("style[data-plugin-css=" + JSON.stringify(tagId$1) + "]") === null) {
			const tag = document.createElement("style");
			tag.dataset.plugin = "@falser101/mascot";
			tag.dataset.pluginCss = tagId$1;
			tag.textContent = css$1;
			document.head.appendChild(tag);
		}
		var BubbleSettingRow_module_css_default = {
			"row": "H9Jnhq_row",
			"desc": "H9Jnhq_desc",
			"knob": "H9Jnhq_knob",
			"switch": "H9Jnhq_switch",
			"switchOn": "H9Jnhq_switchOn",
			"title": "H9Jnhq_title",
			"rowText": "H9Jnhq_rowText"
		};
		//#endregion
		//#region src/client/BubbleSettingRow.tsx
		/**
		* Render the busy-bubble preference row with a switch.
		* @param props - composed settings-row props.
		*/
		function BubbleSettingRow(props) {
			const { useStore, actions, t } = props;
			const state = useStore((value) => value);
			return /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
				className: BubbleSettingRow_module_css_default.row,
				children: [/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
					className: BubbleSettingRow_module_css_default.rowText,
					children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)("div", {
						className: BubbleSettingRow_module_css_default.title,
						children: t("bubble.title")
					}), /* @__PURE__ */ (0, react_jsx_runtime.jsx)("div", {
						className: BubbleSettingRow_module_css_default.desc,
						children: t("bubble.description")
					})]
				}), /* @__PURE__ */ (0, react_jsx_runtime.jsx)("button", {
					type: "button",
					role: "switch",
					"aria-checked": state.bubbleAlways,
					className: `${BubbleSettingRow_module_css_default.switch}${state.bubbleAlways ? ` ${BubbleSettingRow_module_css_default.switchOn}` : ""}`,
					onClick: () => {
						actions.setBubbleAlways(!state.bubbleAlways);
					},
					children: /* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", {
						className: BubbleSettingRow_module_css_default.knob,
						"aria-hidden": "true"
					})
				})]
			});
		}
		//#endregion
		//#region src/client/AISettingRow.tsx
		/**
		* Render the busy-bubble preference row with a switch.
		* @param props - composed settings-row props.
		*/
		function AISettingRow(props) {
			const { useStore, actions, t } = props;
			const state = useStore((value) => value);
			return /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
				className: BubbleSettingRow_module_css_default.row,
				children: [/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
					className: BubbleSettingRow_module_css_default.rowText,
					children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)("div", {
						className: BubbleSettingRow_module_css_default.title,
						children: t("ai.title")
					}), /* @__PURE__ */ (0, react_jsx_runtime.jsx)("div", {
						className: BubbleSettingRow_module_css_default.desc,
						children: t("ai.description")
					})]
				}), /* @__PURE__ */ (0, react_jsx_runtime.jsx)("button", {
					type: "button",
					role: "switch",
					"aria-checked": state.aiLines,
					className: `${BubbleSettingRow_module_css_default.switch}${state.aiLines ? ` ${BubbleSettingRow_module_css_default.switchOn}` : ""}`,
					onClick: () => {
						actions.setAiLines(!state.aiLines);
					},
					children: /* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", {
						className: BubbleSettingRow_module_css_default.knob,
						"aria-hidden": "true"
					})
				})]
			});
		}
		//#endregion
		//#region \0dsh-css:/home/falser/Projects/dsh-mascot/src/client/CadenceSettingRow.module.css.mjs
		const css = "._1i9vNa_row{justify-content:space-between;align-items:center;gap:16px;display:flex}._1i9vNa_rowText{min-width:0}._1i9vNa_title{font-size:14px;font-weight:600}._1i9vNa_desc{opacity:.65;margin-top:2px;font-size:12px}._1i9vNa_selector{color:inherit;cursor:pointer;background:0 0;border:1px solid #7f7f7f59;border-radius:8px;align-items:center;gap:6px;padding:6px 10px;font-size:13px;display:inline-flex}._1i9vNa_selector:hover{border-color:#7f7f7f99}._1i9vNa_chevron{opacity:.6}";
		const tagId = "@falser101/mascot/CadenceSettingRow.module.css";
		if (typeof document !== "undefined" && document.querySelector("style[data-plugin-css=" + JSON.stringify(tagId) + "]") === null) {
			const tag = document.createElement("style");
			tag.dataset.plugin = "@falser101/mascot";
			tag.dataset.pluginCss = tagId;
			tag.textContent = css;
			document.head.appendChild(tag);
		}
		var CadenceSettingRow_module_css_default = {
			"chevron": "_1i9vNa_chevron",
			"selector": "_1i9vNa_selector",
			"rowText": "_1i9vNa_rowText",
			"title": "_1i9vNa_title",
			"desc": "_1i9vNa_desc",
			"row": "_1i9vNa_row"
		};
		//#endregion
		//#region src/client/CadenceSettingRow.tsx
		/**
		* General-settings preference row: the idle pop-up cadence selector
		* (quiet / standard / lively). Reads and writes the shared mascot store,
		* so the choice applies to the overlay entry instantly and persists.
		*/
		/** The three cadence levels, in settings display order. */
		const CADENCE_OPTIONS = [
			{
				id: "quiet",
				label: "cadence.quiet"
			},
			{
				id: "standard",
				label: "cadence.standard"
			},
			{
				id: "lively",
				label: "cadence.lively"
			}
		];
		/**
		* Render the skin preference row with a menu selector.
		* @param props - composed settings-row props.
		*/
		function CadenceSettingRow(props) {
			const { useStore, actions, t } = props;
			const state = useStore((value) => value);
			const [open, setOpen] = (0, react.useState)(false);
			const selectedId = CADENCE_OPTIONS.some((option) => option.id === state.popCadence) ? state.popCadence : "standard";
			const selectedLabel = t(CADENCE_OPTIONS.find((option) => option.id === selectedId)?.label ?? "cadence.standard");
			return /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
				className: CadenceSettingRow_module_css_default.row,
				children: [/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
					className: CadenceSettingRow_module_css_default.rowText,
					children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)("div", {
						className: CadenceSettingRow_module_css_default.title,
						children: t("cadence.title")
					}), /* @__PURE__ */ (0, react_jsx_runtime.jsx)("div", {
						className: CadenceSettingRow_module_css_default.desc,
						children: t("cadence.description")
					})]
				}), /* @__PURE__ */ (0, react_jsx_runtime.jsx)(_deepseek_ai_dsh_client_ui_primitives.Menu, {
					open,
					onClose: () => {
						setOpen(false);
					},
					items: CADENCE_OPTIONS.map((option) => ({
						id: option.id,
						label: t(option.label)
					})),
					selectedId,
					onSelect: (id) => {
						setOpen(false);
						actions.setPopCadence(id);
					},
					align: "end",
					portal: true,
					anchor: /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("button", {
						type: "button",
						className: CadenceSettingRow_module_css_default.selector,
						"aria-haspopup": "menu",
						"aria-expanded": open,
						onClick: () => {
							setOpen((value) => !value);
						},
						children: [selectedLabel, /* @__PURE__ */ (0, react_jsx_runtime.jsx)(_deepseek_ai_dsh_client_ui_primitives.IconChevronDownOutline14, { className: CadenceSettingRow_module_css_default.chevron })]
					})
				})]
			});
		}
		//#endregion
		//#region src/client/index.ts
		/** Required services: the sessions list/bindings, the slot registry, and locale registration. */
		const inject = [
			"sessions",
			"slots",
			"locale"
		];
		/**
		* Client plugin body: register dictionaries, the mood source lifecycle, the
		* overlay entry, and the two settings rows. Every registration and
		* subscription rides the fiber's effect scope, so unload (and HMR) removes
		* all of them.
		* @param ctx - client root context.
		*/
		function apply(ctx) {
			ctx.effect(() => ctx.locale.register(NS, {
				zh,
				en
			}), "mascot: dictionaries");
			const store = createMascotStore();
			const source = new MascotSource(ctx.sessions);
			ctx.effect(() => () => source.dispose(), "mascot: mood source");
			const lines = new MascotLineSource({
				locale: () => ctx.locale.getLocale().active === "en" ? "en" : "zh",
				fetchLines: async (locale) => {
					const response = await fetch(`/mascot/lines?locale=${encodeURIComponent(locale)}`);
					if (!response.ok) return [];
					const body = await response.json();
					return Array.isArray(body.lines) ? body.lines.filter((entry) => typeof entry === "string") : [];
				}
			});
			lines.start();
			ctx.effect(() => () => lines.dispose(), "mascot: line rotator");
			ctx.slots.inject("shell.overlay", () => ctx.slots.register({
				name: "shell.overlay",
				id: "ui-mascot",
				order: 0,
				locale: NS,
				store,
				inject: () => ({
					hooks: {
						mascot: source,
						lines
					},
					openPeer: (sessionId) => {
						ctx.sessions.open(sessionId);
					},
					setAiLines: (enabled) => {
						lines.setAiEnabled(enabled);
					}
				})
			}, MascotView));
			ctx.slots.inject("settings.general.item", () => ctx.slots.register({
				name: "settings.general.item",
				id: "ui-mascot-skin",
				order: 60,
				locale: NS,
				store
			}, SkinSettingRow));
			ctx.slots.inject("settings.general.item", () => ctx.slots.register({
				name: "settings.general.item",
				id: "ui-mascot-bubble",
				order: 70,
				locale: NS,
				store
			}, BubbleSettingRow));
			ctx.slots.inject("settings.general.item", () => ctx.slots.register({
				name: "settings.general.item",
				id: "ui-mascot-ai",
				order: 80,
				locale: NS,
				store
			}, AISettingRow));
			ctx.slots.inject("settings.general.item", () => ctx.slots.register({
				name: "settings.general.item",
				id: "ui-mascot-cadence",
				order: 90,
				locale: NS,
				store
			}, CadenceSettingRow));
		}
		//#endregion
		exports.apply = apply;
		exports.inject = inject;
		return module.exports;
	}
});

//# sourceMappingURL=client.js.map