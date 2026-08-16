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
  'mood.idle': '我在呢，随时找我～',
  'mood.queued': '收到！排队开工',
  'mood.confirming.approval': '等你批准一下～',
  'mood.confirming.question': '有件事想问你～',
  'mood.thinking': '让我想想…',
  'mood.working': '正在调用「{tool}」',
  'mood.streaming': '在写答案…',
  'mood.done': '搞定啦！🎉',
  'mood.error': '哎呀，出错了…',
  'mood.greeting': '你好呀！',
  'poke.0': '别戳我啦～',
  'poke.1': '痒痒的！喵？',
  'poke.2': '（打了个滚）',
  'poke.3': '再戳我可要生气啦！',
  'collapse.hint': '双击我回来～',
  'collapse.aria': '收起悬浮伙伴',
  'expand.aria': '唤出悬浮伙伴',
  'widget.aria': '悬浮伙伴',
  'skin.title': '悬浮伙伴形象',
  'skin.description': '选择悬浮在界面上的小伙伴',
  'skin.cat': '猫咪',
  'skin.dog': '狗狗',
} as const

/** English dictionary, key-identical to the Chinese source of truth. */
export const en: Record<MascotKey, string> = {
  'mood.idle': 'Here whenever you need me～',
  'mood.queued': 'Got it! Joining the queue',
  'mood.confirming.approval': 'Waiting for your approval～',
  'mood.confirming.question': 'Something to ask you～',
  'mood.thinking': 'Let me think…',
  'mood.working': 'Running 「{tool}」',
  'mood.streaming': 'Writing the answer…',
  'mood.done': 'Done! 🎉',
  'mood.error': 'Oops, something went wrong…',
  'mood.greeting': 'Hi there!',
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
}

/** Key domain of the `mascot` namespace (zh is the source of truth). */
export type MascotKey = keyof typeof zh
