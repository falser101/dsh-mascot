/** `mascot` namespace dictionaries. */
/** Dictionary namespace owned by this plugin. */
export declare const NS = "mascot";
declare module '@deepseek-ai/dsh-client-ui-slots' {
    interface LocaleNamespaceMap {
        /** Mascot bubble and settings copy. */
        'mascot': MascotKey;
    }
}
/** Simplified Chinese dictionary (the key-set source of truth). */
export declare const zh: {
    readonly 'mood.idle': "我在呢，随时找我～";
    readonly 'mood.queued': "收到！排队开工";
    readonly 'mood.confirming.approval': "等你批准一下～";
    readonly 'mood.confirming.question': "有件事想问你～";
    readonly 'mood.thinking': "让我想想…";
    readonly 'mood.working': "正在调用「{tool}」";
    readonly 'mood.streaming': "在写答案…";
    readonly 'mood.done': "搞定啦！🎉";
    readonly 'mood.error': "哎呀，出错了…";
    readonly 'mood.greeting': "你好呀！";
    readonly 'poke.0': "别戳我啦～";
    readonly 'poke.1': "痒痒的！喵？";
    readonly 'poke.2': "（打了个滚）";
    readonly 'poke.3': "再戳我可要生气啦！";
    readonly 'collapse.hint': "双击我回来～";
    readonly 'collapse.aria': "收起悬浮伙伴";
    readonly 'expand.aria': "唤出悬浮伙伴";
    readonly 'widget.aria': "悬浮伙伴";
    readonly 'skin.title': "悬浮伙伴形象";
    readonly 'skin.description': "选择悬浮在界面上的小伙伴";
    readonly 'skin.cat': "猫咪";
    readonly 'skin.dog': "狗狗";
};
/** English dictionary, key-identical to the Chinese source of truth. */
export declare const en: Record<MascotKey, string>;
/** Key domain of the `mascot` namespace (zh is the source of truth). */
export type MascotKey = keyof typeof zh;
