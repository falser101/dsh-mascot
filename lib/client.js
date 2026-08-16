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
			"bubble.title": "忙碌时显示气泡",
			"bubble.description": "AI 思考、调用工具或写答案时，自动显示状态气泡",
			"peer.status.running": "运行中",
			"peer.status.stopping": "停止中",
			"badge.label": "{count} 个任务在跑"
		};
		/** English dictionary, key-identical to the Chinese source of truth. */
		const en = {
			"mood.idle": "Here whenever you need me～",
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
			"bubble.title": "Bubble while busy",
			"bubble.description": "Show the status bubble while the AI thinks, runs tools, or writes",
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
				bubbleAlways: true
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
		//#region \0dsh-css:/home/falser/Projects/dsh-mascot/src/client/character/CatSkin.module.css.mjs
		const css$4 = ".IdhSOW_root{width:100%;height:100%;overflow:visible}.IdhSOW_body{transform-box:fill-box;transform-origin:50%}.IdhSOW_head{transform-box:fill-box;transform-origin:50% 62%}.IdhSOW_earL,.IdhSOW_earR{transform-box:fill-box;transform-origin:50% 12%}.IdhSOW_eyeL,.IdhSOW_eyeR{transform-box:fill-box;transform-origin:50%}.IdhSOW_tail{transform-box:fill-box;transform-origin:0 60%}.IdhSOW_sweat,.IdhSOW_tear,.IdhSOW_sparkle{opacity:0;transform-box:fill-box;transform-origin:50%}.IdhSOW_root[data-mood=idle] .IdhSOW_body{animation:2.8s ease-in-out infinite IdhSOW_mascot-breathe}.IdhSOW_root .IdhSOW_eyeL,.IdhSOW_root .IdhSOW_eyeR{animation:4.2s infinite IdhSOW_mascot-blink}@keyframes IdhSOW_mascot-breathe{0%,to{transform:scale(1)}50%{transform:scale(1.035,.97)}}@keyframes IdhSOW_mascot-blink{0%,90%,to{transform:scaleY(1)}94%{transform:scaleY(.12)}}.IdhSOW_root[data-mood=queued]{animation:.6s ease-in-out infinite IdhSOW_mascot-hop}@keyframes IdhSOW_mascot-hop{0%,to{transform:translateY(0)}30%{transform:translateY(-7px)}60%{transform:translateY(0)}75%{transform:translateY(-3px)}}.IdhSOW_root[data-mood=confirming] .IdhSOW_head{animation:1.8s ease-in-out infinite IdhSOW_mascot-tilt}.IdhSOW_root[data-mood=confirming] .IdhSOW_eyeL{animation:1.8s ease-in-out infinite IdhSOW_mascot-look}@keyframes IdhSOW_mascot-tilt{0%,to{transform:rotate(0)}50%{transform:rotate(7deg)}}@keyframes IdhSOW_mascot-look{0%,to{transform:translate(1.5px,-1px)}50%{transform:translate(0)}}.IdhSOW_root[data-mood=thinking] .IdhSOW_head{animation:2s ease-in-out infinite IdhSOW_mascot-think}.IdhSOW_root[data-mood=thinking] .IdhSOW_eyeL,.IdhSOW_root[data-mood=thinking] .IdhSOW_eyeR{animation:2s ease-in-out infinite IdhSOW_mascot-squint}@keyframes IdhSOW_mascot-think{0%,to{transform:rotate(-3deg)}50%{transform:rotate(5deg)}}@keyframes IdhSOW_mascot-squint{0%,to{transform:scaleY(.72)}50%{transform:scaleY(1)}}.IdhSOW_root[data-mood=working] .IdhSOW_head{animation:.5s ease-in-out infinite IdhSOW_mascot-busy}.IdhSOW_root[data-mood=working] .IdhSOW_sweat{opacity:1;animation:1.4s linear infinite IdhSOW_mascot-sweat}@keyframes IdhSOW_mascot-busy{0%,to{transform:rotate(0)}25%{transform:rotate(2.2deg)}75%{transform:rotate(-2.2deg)}}@keyframes IdhSOW_mascot-sweat{0%{opacity:0;transform:translateY(0)}22%{opacity:1}to{opacity:0;transform:translateY(11px)}}.IdhSOW_root[data-mood=streaming] .IdhSOW_eyeL,.IdhSOW_root[data-mood=streaming] .IdhSOW_eyeR{animation:.9s ease-in-out infinite alternate IdhSOW_mascot-glance}@keyframes IdhSOW_mascot-glance{0%{transform:translate(1.6px)}to{transform:translate(-1.6px)}}.IdhSOW_root[data-mood=done]{animation:.9s ease-in-out 2 IdhSOW_mascot-celebrate}.IdhSOW_root[data-mood=done] .IdhSOW_sparkle{opacity:1;animation:.9s ease-in-out 2 IdhSOW_mascot-sparkle}.IdhSOW_root[data-mood=done] .IdhSOW_eyeL,.IdhSOW_root[data-mood=done] .IdhSOW_eyeR{animation:.9s ease-in-out 2 IdhSOW_mascot-happy-eye}@keyframes IdhSOW_mascot-celebrate{0%,to{transform:translateY(0)rotate(0)}35%{transform:translateY(-10px)rotate(-4deg)}65%{transform:translateY(-5px)rotate(4deg)}}@keyframes IdhSOW_mascot-sparkle{0%,to{opacity:0;transform:scale(.4)rotate(0)}50%{opacity:1;transform:scale(1)rotate(20deg)}}@keyframes IdhSOW_mascot-happy-eye{0%,to{transform:scaleY(.72)}50%{transform:scaleY(.72)translateY(-1px)}}.IdhSOW_root[data-mood=error]{animation:.35s linear infinite IdhSOW_mascot-shake}.IdhSOW_root[data-mood=error] .IdhSOW_tear{opacity:1;animation:1.6s linear infinite IdhSOW_mascot-tear}@keyframes IdhSOW_mascot-shake{0%,to{transform:translate(0)}25%{transform:translate(-2.6px)}75%{transform:translate(2.6px)}}@keyframes IdhSOW_mascot-tear{0%{opacity:0;transform:translateY(-2px)}25%{opacity:1}to{opacity:0;transform:translateY(9px)}}.IdhSOW_root[data-mood=greeting] .IdhSOW_tail{animation:.5s ease-in-out infinite alternate IdhSOW_mascot-wag}@keyframes IdhSOW_mascot-wag{0%{transform:rotate(-14deg)}to{transform:rotate(14deg)}}.IdhSOW_root[data-dragging=true] *,.IdhSOW_root[data-dragging=true]{animation:none!important}@media (prefers-reduced-motion:reduce){.IdhSOW_root,.IdhSOW_root *{animation:none!important}}";
		const tagId$4 = "@falser101/mascot/CatSkin.module.css";
		if (typeof document !== "undefined" && document.querySelector("style[data-plugin-css=" + JSON.stringify(tagId$4) + "]") === null) {
			const tag = document.createElement("style");
			tag.dataset.plugin = "@falser101/mascot";
			tag.dataset.pluginCss = tagId$4;
			tag.textContent = css$4;
			document.head.appendChild(tag);
		}
		var CatSkin_module_css_default = {
			"earL": "IdhSOW_earL",
			"mascot-glance": "IdhSOW_mascot-glance",
			"tail": "IdhSOW_tail",
			"mascot-hop": "IdhSOW_mascot-hop",
			"mascot-celebrate": "IdhSOW_mascot-celebrate",
			"earR": "IdhSOW_earR",
			"root": "IdhSOW_root",
			"mascot-sparkle": "IdhSOW_mascot-sparkle",
			"sweat": "IdhSOW_sweat",
			"mascot-busy": "IdhSOW_mascot-busy",
			"mascot-happy-eye": "IdhSOW_mascot-happy-eye",
			"mascot-tear": "IdhSOW_mascot-tear",
			"eyeL": "IdhSOW_eyeL",
			"tear": "IdhSOW_tear",
			"mascot-shake": "IdhSOW_mascot-shake",
			"mascot-tilt": "IdhSOW_mascot-tilt",
			"mascot-look": "IdhSOW_mascot-look",
			"mascot-blink": "IdhSOW_mascot-blink",
			"head": "IdhSOW_head",
			"mascot-wag": "IdhSOW_mascot-wag",
			"mascot-squint": "IdhSOW_mascot-squint",
			"sparkle": "IdhSOW_sparkle",
			"eyeR": "IdhSOW_eyeR",
			"body": "IdhSOW_body",
			"mascot-breathe": "IdhSOW_mascot-breathe",
			"mascot-think": "IdhSOW_mascot-think",
			"mascot-sweat": "IdhSOW_mascot-sweat"
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
		const css$3 = ".L_giHG_root{width:100%;height:100%;overflow:visible}.L_giHG_body{transform-box:fill-box;transform-origin:50%}.L_giHG_head{transform-box:fill-box;transform-origin:50% 60%}.L_giHG_earL,.L_giHG_earR{transform-box:fill-box;transform-origin:50% 12%}.L_giHG_eyeL,.L_giHG_eyeR{transform-box:fill-box;transform-origin:50%}.L_giHG_tail{transform-box:fill-box;transform-origin:0 70%}.L_giHG_tongue{transform-box:fill-box;transform-origin:top}.L_giHG_sweat,.L_giHG_tear,.L_giHG_sparkle{opacity:0;transform-box:fill-box;transform-origin:50%}.L_giHG_root[data-mood=idle] .L_giHG_body{animation:2.8s ease-in-out infinite L_giHG_mascot-breathe}.L_giHG_root .L_giHG_eyeL,.L_giHG_root .L_giHG_eyeR{animation:4.2s infinite L_giHG_mascot-blink}@keyframes L_giHG_mascot-breathe{0%,to{transform:scale(1)}50%{transform:scale(1.035,.97)}}@keyframes L_giHG_mascot-blink{0%,90%,to{transform:scaleY(1)}94%{transform:scaleY(.12)}}.L_giHG_root[data-mood=queued]{animation:.6s ease-in-out infinite L_giHG_mascot-hop}@keyframes L_giHG_mascot-hop{0%,to{transform:translateY(0)}30%{transform:translateY(-7px)}60%{transform:translateY(0)}75%{transform:translateY(-3px)}}.L_giHG_root[data-mood=confirming] .L_giHG_head{animation:1.8s ease-in-out infinite L_giHG_mascot-tilt}@keyframes L_giHG_mascot-tilt{0%,to{transform:rotate(0)}50%{transform:rotate(7deg)}}.L_giHG_root[data-mood=thinking] .L_giHG_head{animation:2s ease-in-out infinite L_giHG_mascot-think}.L_giHG_root[data-mood=thinking] .L_giHG_eyeL,.L_giHG_root[data-mood=thinking] .L_giHG_eyeR{animation:2s ease-in-out infinite L_giHG_mascot-squint}@keyframes L_giHG_mascot-think{0%,to{transform:rotate(-3deg)}50%{transform:rotate(5deg)}}@keyframes L_giHG_mascot-squint{0%,to{transform:scaleY(.72)}50%{transform:scaleY(1)}}.L_giHG_root[data-mood=working] .L_giHG_head{animation:.5s ease-in-out infinite L_giHG_mascot-busy}.L_giHG_root[data-mood=working] .L_giHG_sweat{opacity:1;animation:1.4s linear infinite L_giHG_mascot-sweat}@keyframes L_giHG_mascot-busy{0%,to{transform:rotate(0)}25%{transform:rotate(2.2deg)}75%{transform:rotate(-2.2deg)}}@keyframes L_giHG_mascot-sweat{0%{opacity:0;transform:translateY(0)}22%{opacity:1}to{opacity:0;transform:translateY(11px)}}.L_giHG_root[data-mood=streaming] .L_giHG_eyeL,.L_giHG_root[data-mood=streaming] .L_giHG_eyeR{animation:.9s ease-in-out infinite alternate L_giHG_mascot-glance}.L_giHG_root[data-mood=streaming] .L_giHG_tongue{animation:.8s ease-in-out infinite L_giHG_mascot-pant}@keyframes L_giHG_mascot-glance{0%{transform:translate(1.6px)}to{transform:translate(-1.6px)}}@keyframes L_giHG_mascot-pant{0%,to{transform:scaleY(.82)}50%{transform:scaleY(1.12)}}.L_giHG_root[data-mood=done]{animation:.9s ease-in-out 2 L_giHG_mascot-celebrate}.L_giHG_root[data-mood=done] .L_giHG_sparkle{opacity:1;animation:.9s ease-in-out 2 L_giHG_mascot-sparkle}.L_giHG_root[data-mood=done] .L_giHG_eyeL,.L_giHG_root[data-mood=done] .L_giHG_eyeR{animation:.9s ease-in-out 2 L_giHG_mascot-happy-eye}@keyframes L_giHG_mascot-celebrate{0%,to{transform:translateY(0)rotate(0)}35%{transform:translateY(-10px)rotate(-4deg)}65%{transform:translateY(-5px)rotate(4deg)}}@keyframes L_giHG_mascot-sparkle{0%,to{opacity:0;transform:scale(.4)rotate(0)}50%{opacity:1;transform:scale(1)rotate(20deg)}}@keyframes L_giHG_mascot-happy-eye{0%,to{transform:scaleY(.72)}50%{transform:scaleY(.72)translateY(-1px)}}.L_giHG_root[data-mood=error]{animation:.35s linear infinite L_giHG_mascot-shake}.L_giHG_root[data-mood=error] .L_giHG_tear{opacity:1;animation:1.6s linear infinite L_giHG_mascot-tear}@keyframes L_giHG_mascot-shake{0%,to{transform:translate(0)}25%{transform:translate(-2.6px)}75%{transform:translate(2.6px)}}@keyframes L_giHG_mascot-tear{0%{opacity:0;transform:translateY(-2px)}25%{opacity:1}to{opacity:0;transform:translateY(9px)}}.L_giHG_root[data-mood=greeting] .L_giHG_tail{animation:.5s ease-in-out infinite alternate L_giHG_mascot-wag}.L_giHG_root[data-mood=greeting] .L_giHG_earL{animation:.8s ease-in-out infinite alternate L_giHG_mascot-ear-sway}.L_giHG_root[data-mood=greeting] .L_giHG_earR{animation:.8s ease-in-out infinite alternate-reverse L_giHG_mascot-ear-sway}@keyframes L_giHG_mascot-wag{0%{transform:rotate(-14deg)}to{transform:rotate(14deg)}}@keyframes L_giHG_mascot-ear-sway{0%{transform:rotate(-20deg)}to{transform:rotate(-12deg)}}.L_giHG_root[data-dragging=true] *,.L_giHG_root[data-dragging=true]{animation:none!important}@media (prefers-reduced-motion:reduce){.L_giHG_root,.L_giHG_root *{animation:none!important}}";
		const tagId$3 = "@falser101/mascot/DogSkin.module.css";
		if (typeof document !== "undefined" && document.querySelector("style[data-plugin-css=" + JSON.stringify(tagId$3) + "]") === null) {
			const tag = document.createElement("style");
			tag.dataset.plugin = "@falser101/mascot";
			tag.dataset.pluginCss = tagId$3;
			tag.textContent = css$3;
			document.head.appendChild(tag);
		}
		var DogSkin_module_css_default = {
			"earL": "L_giHG_earL",
			"sweat": "L_giHG_sweat",
			"mascot-hop": "L_giHG_mascot-hop",
			"mascot-pant": "L_giHG_mascot-pant",
			"tail": "L_giHG_tail",
			"root": "L_giHG_root",
			"mascot-ear-sway": "L_giHG_mascot-ear-sway",
			"mascot-blink": "L_giHG_mascot-blink",
			"mascot-happy-eye": "L_giHG_mascot-happy-eye",
			"mascot-sparkle": "L_giHG_mascot-sparkle",
			"sparkle": "L_giHG_sparkle",
			"mascot-think": "L_giHG_mascot-think",
			"mascot-sweat": "L_giHG_mascot-sweat",
			"mascot-glance": "L_giHG_mascot-glance",
			"mascot-breathe": "L_giHG_mascot-breathe",
			"head": "L_giHG_head",
			"mascot-wag": "L_giHG_mascot-wag",
			"mascot-busy": "L_giHG_mascot-busy",
			"body": "L_giHG_body",
			"tear": "L_giHG_tear",
			"mascot-squint": "L_giHG_mascot-squint",
			"mascot-celebrate": "L_giHG_mascot-celebrate",
			"tongue": "L_giHG_tongue",
			"eyeR": "L_giHG_eyeR",
			"earR": "L_giHG_earR",
			"mascot-shake": "L_giHG_mascot-shake",
			"eyeL": "L_giHG_eyeL",
			"mascot-tear": "L_giHG_mascot-tear",
			"mascot-tilt": "L_giHG_mascot-tilt"
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
		//#region src/client/character/skins.ts
		/** The installed skins, in settings-row display order. */
		const SKINS = [{
			id: "cat",
			labelKey: "skin.cat",
			Component: CatSkin
		}, {
			id: "dog",
			labelKey: "skin.dog",
			Component: DogSkin
		}];
		/** Resolve one skin definition by id (fallback: the first installed skin). */
		function skinOf(id) {
			return SKINS.find((skin) => skin.id === id) ?? SKINS[0];
		}
		//#endregion
		//#region \0dsh-css:/home/falser/Projects/dsh-mascot/src/client/MascotView.module.css.mjs
		const css$2 = ".TvUanW_root{z-index:200;cursor:grab;touch-action:none;-webkit-user-select:none;user-select:none;outline:none;width:96px;height:96px;transition:transform .18s;position:fixed}.TvUanW_root:hover,.TvUanW_root:focus-visible{transform:scale(1.08)}.TvUanW_root.TvUanW_dragging{cursor:grabbing;transition:none;transform:scale(1.04)}.TvUanW_character{width:100%;height:100%}.TvUanW_bubble{transform-origin:bottom;opacity:0;pointer-events:none;color:#3b2f2a;white-space:nowrap;text-overflow:ellipsis;z-index:1;background:#fff;border-radius:14px;max-width:240px;padding:8px 12px;font-size:13px;line-height:1.4;transition:opacity .18s,transform .18s;position:absolute;bottom:calc(100% + 12px);left:50%;overflow:hidden;transform:translate(-50%)translateY(4px)scale(.92);box-shadow:0 4px 16px #0000002e}.TvUanW_bubble:after{content:\"\";border:6px solid #0000;border-top-color:#fff;position:absolute;top:100%;left:50%;transform:translate(-50%)}.TvUanW_bubbleVisible{opacity:1;transform:translate(-50%)translateY(0)scale(1)}.TvUanW_bubbleText{vertical-align:middle;animation:.22s ease-out TvUanW_mascot-bubble-pop;display:inline-block}@keyframes TvUanW_mascot-bubble-pop{0%{transform:scale(.9)}60%{transform:scale(1.04)}to{transform:scale(1)}}.TvUanW_busy{vertical-align:middle;gap:3px;margin-left:7px;display:inline-flex}.TvUanW_busy i{opacity:.35;background:currentColor;border-radius:50%;width:4px;height:4px;animation:1.1s ease-in-out infinite TvUanW_mascot-busy-dot}.TvUanW_busy i:nth-child(2){animation-delay:.18s}.TvUanW_busy i:nth-child(3){animation-delay:.36s}@keyframes TvUanW_mascot-busy-dot{0%,to{opacity:.25;transform:translateY(0)}40%{opacity:1;transform:translateY(-2.5px)}}.TvUanW_badge{color:#fff;text-align:center;z-index:2;background:#e5484d;border-radius:10px;min-width:20px;height:20px;padding:0 5px;font-size:12px;font-weight:700;line-height:20px;position:absolute;top:-6px;right:-6px;box-shadow:0 2px 6px #00000040}.TvUanW_bubbleList{white-space:normal;max-width:300px;padding:6px}.TvUanW_peerList{flex-direction:column;gap:2px;margin:0;padding:0;list-style:none;display:flex}.TvUanW_peerRow{border-radius:8px;align-items:center;gap:8px;padding:4px 6px;font-size:13px;line-height:1.35;display:flex}.TvUanW_peerRowJump{cursor:pointer}.TvUanW_peerRowJump:hover{background:#0000000f}.TvUanW_peerIcon{flex:none;font-size:14px}.TvUanW_peerLabel{text-overflow:ellipsis;white-space:nowrap;min-width:0;overflow:hidden}.TvUanW_peerStatus{opacity:.65;flex:none;margin-left:auto;font-size:12px}.TvUanW_root.TvUanW_collapsed{width:44px;height:44px}.TvUanW_root.TvUanW_collapsed:hover{transform:scale(1.12)}.TvUanW_dot{background:radial-gradient(circle at 35% 30%,#f9c784,#e89a5b);border-radius:50%;width:100%;height:100%;box-shadow:0 3px 10px #0003}@media (prefers-reduced-motion:reduce){.TvUanW_root,.TvUanW_bubble,.TvUanW_bubbleText,.TvUanW_busy i{transition:none;animation:none}}";
		const tagId$2 = "@falser101/mascot/MascotView.module.css";
		if (typeof document !== "undefined" && document.querySelector("style[data-plugin-css=" + JSON.stringify(tagId$2) + "]") === null) {
			const tag = document.createElement("style");
			tag.dataset.plugin = "@falser101/mascot";
			tag.dataset.pluginCss = tagId$2;
			tag.textContent = css$2;
			document.head.appendChild(tag);
		}
		var MascotView_module_css_default = {
			"dot": "TvUanW_dot",
			"busy": "TvUanW_busy",
			"peerList": "TvUanW_peerList",
			"peerStatus": "TvUanW_peerStatus",
			"bubble": "TvUanW_bubble",
			"badge": "TvUanW_badge",
			"peerRow": "TvUanW_peerRow",
			"bubbleVisible": "TvUanW_bubbleVisible",
			"bubbleText": "TvUanW_bubbleText",
			"character": "TvUanW_character",
			"root": "TvUanW_root",
			"dragging": "TvUanW_dragging",
			"mascot-busy-dot": "TvUanW_mascot-busy-dot",
			"bubbleList": "TvUanW_bubbleList",
			"peerIcon": "TvUanW_peerIcon",
			"mascot-bubble-pop": "TvUanW_mascot-bubble-pop",
			"peerLabel": "TvUanW_peerLabel",
			"collapsed": "TvUanW_collapsed",
			"peerRowJump": "TvUanW_peerRowJump"
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
			const { useStore, actions, useMascot, t, openPeer } = props;
			const state = useStore((value) => value);
			const mascot = useMascot((value) => value);
			const [dragging, setDragging] = (0, react.useState)(false);
			const [poke, setPoke] = (0, react.useState)(null);
			const [hovering, setHovering] = (0, react.useState)(false);
			const [idleHoverIndex, setIdleHoverIndex] = (0, react.useState)(0);
			const dragRef = (0, react.useRef)(null);
			const pokeCounter = (0, react.useRef)(0);
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
			const busy = BUSY_MOODS.includes(mascot.mood);
			const busyMarked = MARKED_MOODS.includes(mascot.mood);
			const showPeerList = hovering && mascot.peers.length > 1;
			const bubbleText = state.collapsed ? t("collapse.hint") : poke?.text ?? t(hovering && !showPeerList ? hoverKeyOf(mascot.mood, idleHoverIndex) : mascot.textKey, mascot.params);
			const bubbleVisible = poke !== null || mascot.until !== void 0 || hovering || state.bubbleAlways && busy;
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
		const css$1 = ".gOSCaq_row{justify-content:space-between;align-items:center;gap:16px;display:flex}.gOSCaq_rowText{min-width:0}.gOSCaq_title{font-size:14px;font-weight:600}.gOSCaq_desc{opacity:.65;margin-top:2px;font-size:12px}.gOSCaq_selector{color:inherit;cursor:pointer;background:0 0;border:1px solid #7f7f7f59;border-radius:8px;align-items:center;gap:6px;padding:6px 10px;font-size:13px;display:inline-flex}.gOSCaq_selector:hover{border-color:#7f7f7f99}.gOSCaq_chevron{opacity:.6}";
		const tagId$1 = "@falser101/mascot/SkinSettingRow.module.css";
		if (typeof document !== "undefined" && document.querySelector("style[data-plugin-css=" + JSON.stringify(tagId$1) + "]") === null) {
			const tag = document.createElement("style");
			tag.dataset.plugin = "@falser101/mascot";
			tag.dataset.pluginCss = tagId$1;
			tag.textContent = css$1;
			document.head.appendChild(tag);
		}
		var SkinSettingRow_module_css_default = {
			"desc": "gOSCaq_desc",
			"row": "gOSCaq_row",
			"selector": "gOSCaq_selector",
			"title": "gOSCaq_title",
			"rowText": "gOSCaq_rowText",
			"chevron": "gOSCaq_chevron"
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
		const css = ".H9Jnhq_row{justify-content:space-between;align-items:center;gap:16px;display:flex}.H9Jnhq_rowText{min-width:0}.H9Jnhq_title{font-size:14px;font-weight:600}.H9Jnhq_desc{opacity:.65;margin-top:2px;font-size:12px}.H9Jnhq_switch{cursor:pointer;background:#7f7f7f2e;border:1px solid #7f7f7f66;border-radius:11px;width:40px;height:22px;padding:0;transition:background .18s,border-color .18s;position:relative}.H9Jnhq_knob{background:#fff;border-radius:50%;width:16px;height:16px;transition:transform .18s;position:absolute;top:2px;left:2px;box-shadow:0 1px 3px #0000004d}.H9Jnhq_switchOn{background:#4c8bf5;border-color:#4c8bf5}.H9Jnhq_switchOn .H9Jnhq_knob{transform:translate(18px)}";
		const tagId = "@falser101/mascot/BubbleSettingRow.module.css";
		if (typeof document !== "undefined" && document.querySelector("style[data-plugin-css=" + JSON.stringify(tagId) + "]") === null) {
			const tag = document.createElement("style");
			tag.dataset.plugin = "@falser101/mascot";
			tag.dataset.pluginCss = tagId;
			tag.textContent = css;
			document.head.appendChild(tag);
		}
		var BubbleSettingRow_module_css_default = {
			"desc": "H9Jnhq_desc",
			"switch": "H9Jnhq_switch",
			"knob": "H9Jnhq_knob",
			"rowText": "H9Jnhq_rowText",
			"title": "H9Jnhq_title",
			"row": "H9Jnhq_row",
			"switchOn": "H9Jnhq_switchOn"
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
			ctx.slots.inject("shell.overlay", () => ctx.slots.register({
				name: "shell.overlay",
				id: "ui-mascot",
				order: 0,
				locale: NS,
				store,
				inject: () => ({
					hooks: { mascot: source },
					openPeer: (sessionId) => {
						ctx.sessions.open(sessionId);
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
		}
		//#endregion
		exports.apply = apply;
		exports.inject = inject;
		return module.exports;
	}
});

//# sourceMappingURL=client.js.map