/** `mascot` namespace dictionaries. */

/** Dictionary namespace owned by this plugin. */
export const NS = 'mascot'

declare module '@deepseek-ai/dsh-client-ui-slots' {
  interface LocaleNamespaceMap {
    /** Mascot bubble and settings copy. */
    'mascot': MascotKey
  }
}

/** Simplified Chinese dictionary (the key-set source of truth). */
export const zh = {
  // Steady status lines (always visible while the agent is busy).
  'mood.idle': '我在呢，随时找我～',
  // Built-in idle rotation pool (AI-generated lines mix in at ~1/5).
  'idle.line.0': '我在呢，随时找我～',
  'idle.line.1': '专注干活吧，我陪着你～',
  'idle.line.2': '要不要喝口水歇一下？',
  'idle.line.3': '我在旁边守着，有事喊我～',
  'idle.line.4': '慢慢来，我等你～',
  'idle.line.5': '（伸了个懒腰）继续加油！',
  'mood.queued': '收到！排队开工',
  'mood.confirming.approval': '等你批准一下～',
  'mood.confirming.question': '有件事想问你～',
  'mood.thinking': '让我想想…',
  'mood.working': '正在调用「{tool}」',
  'mood.working.many': '正在调用「{tool}」等 {count} 个工具',
  'mood.streaming': '在写答案…',
  'mood.done': '搞定啦！🎉',
  'mood.error': '哎呀，出错了…',
  'mood.greeting': '你好呀！',
  'mood.elsewhere': '别处还有 {count} 个任务在忙',
  // Hover lines: warm, reassuring copy that replaces the status line while
  // the pointer rests on the companion.
  'hover.idle.0': '我在呢，随时找我～',
  'hover.idle.1': '偷偷看你干活中…',
  'hover.idle.2': '要不要歇会儿？',
  'hover.idle.3': '（伸了个懒腰）',
  'hover.idle.4': '今天的你也很棒！',
  'hover.queued': '马上就到你了～',
  'hover.confirming': '慢慢看，不着急～',
  'hover.thinking': '别着急，我在努力想～',
  'hover.working': '马上就好！',
  'hover.streaming': '快写完啦，再等一下下～',
  'hover.error': '抱抱，别难过，我们再试一次',
  // Poke lines (click).
  'poke.0': '别戳我啦～',
  'poke.1': '痒痒的！喵？',
  'poke.2': '（打了个滚）',
  'poke.3': '再戳我可要生气啦！',
  'collapse.hint': '双击我回来～',
  'collapse.aria': '收起悬浮伙伴',
  'expand.aria': '唤出悬浮伙伴',
  'widget.aria': '悬浮伙伴',
  // Settings rows.
  'skin.title': '悬浮伙伴形象',
  'skin.description': '选择悬浮在界面上的小伙伴',
  'skin.cat': '猫咪',
  'skin.dog': '狗狗',
  'skin.custom': '自定义形象',
  'bubble.title': '显示状态气泡',
  'bubble.description': '始终显示气泡与状态文字（关闭后仅在悬停时显示）',
  'ai.title': 'AI 小剧场',
  'ai.description': '偶尔让模型生成一句俏皮话，关闭后仅用内置文案',
  'cadence.title': '闲置弹出频率',
  'cadence.description': '闲置时气泡自动弹出的频率',
  'cadence.quiet': '安静',
  'cadence.standard': '标准',
  'cadence.lively': '热闹',
  'peer.status.running': '运行中',
  'peer.status.stopping': '停止中',
  'badge.label': '{count} 个任务在跑',
} as const

/** English dictionary, key-identical to the Chinese source of truth. */
export const en: Record<MascotKey, string> = {
  'mood.idle': 'Here whenever you need me～',
  'idle.line.0': 'Here whenever you need me～',
  'idle.line.1': 'Focus on work, I will keep you company～',
  'idle.line.2': 'Care for a sip of water and a break?',
  'idle.line.3': 'I am right here, call me anytime～',
  'idle.line.4': 'Take your time, I will wait～',
  'idle.line.5': '（stretches）Keep going!',
  'mood.queued': 'Got it! Joining the queue',
  'mood.confirming.approval': 'Waiting for your approval～',
  'mood.confirming.question': 'Something to ask you～',
  'mood.thinking': 'Let me think…',
  'mood.working': 'Running 「{tool}」',
  'mood.working.many': 'Running 「{tool}」 and {count} more tools',
  'mood.streaming': 'Writing the answer…',
  'mood.done': 'Done! 🎉',
  'mood.error': 'Oops, something went wrong…',
  'mood.greeting': 'Hi there!',
  'mood.elsewhere': 'Other tasks are busy elsewhere ({count})',
  'hover.idle.0': 'Here whenever you need me～',
  'hover.idle.1': 'Quietly watching you work…',
  'hover.idle.2': 'Care for a break?',
  'hover.idle.3': '（stretches）',
  'hover.idle.4': "You're doing great today!",
  'hover.queued': "You're next, almost there～",
  'hover.confirming': 'Take your time～',
  'hover.thinking': 'Hold on, I am thinking hard～',
  'hover.working': 'Almost done!',
  'hover.streaming': 'Almost finished writing, one more moment～',
  'hover.error': 'Hugs, do not worry — let us try again',
  'poke.0': 'Stop poking me～',
  'poke.1': 'That tickles! Meow?',
  'poke.2': '（rolled over）',
  'poke.3': 'Poke me again and I will get mad!',
  'collapse.hint': 'Double-click to bring me back～',
  'collapse.aria': 'Collapse the companion',
  'expand.aria': 'Bring back the companion',
  'widget.aria': 'Floating companion',
  'skin.title': 'Companion look',
  'skin.description': 'Choose the companion floating over the UI',
  'skin.cat': 'Cat',
  'skin.dog': 'Dog',
  'skin.custom': 'Custom art',
  'bubble.title': 'Show status bubble',
  'bubble.description': 'Keep the bubble with status text always visible (off: only on hover)',
  'ai.title': 'AI vignettes',
  'ai.description': 'Occasionally let the model write a playful line (off: built-in lines only)',
  'cadence.title': 'Idle pop-up cadence',
  'cadence.description': 'How often the bubble pops up while idle',
  'cadence.quiet': 'Quiet',
  'cadence.standard': 'Standard',
  'cadence.lively': 'Lively',
  'peer.status.running': 'running',
  'peer.status.stopping': 'stopping',
  'badge.label': '{count} tasks running',
}

/** Key domain of the `mascot` namespace (zh is the source of truth). */
export type MascotKey = keyof typeof zh
