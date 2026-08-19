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
    readonly 'idle.line.0': "我在呢，随时找我～";
    readonly 'idle.line.1': "专注干活吧，我陪着你～";
    readonly 'idle.line.2': "要不要喝口水歇一下？";
    readonly 'idle.line.3': "我在旁边守着，有事喊我～";
    readonly 'idle.line.4': "慢慢来，我等你～";
    readonly 'idle.line.5': "（伸了个懒腰）继续加油！";
    readonly 'mood.queued': "收到！排队开工";
    readonly 'mood.confirming.approval': "等你批准一下～";
    readonly 'mood.confirming.question': "有件事想问你～";
    readonly 'mood.thinking': "让我想想…";
    readonly 'mood.working': "还在忙，别急～";
    readonly 'mood.working.many': "好几件事一起做";
    readonly 'mood.working.tool': "正在调用「{tool}」";
    readonly 'mood.working.many.tool': "正在调用「{tool}」等 {count} 个工具";
    readonly 'mood.streaming': "在写答案…";
    readonly 'mood.done': "搞定啦！🎉";
    readonly 'mood.error': "哎呀，出错了…";
    readonly 'mood.greeting': "你好呀！";
    readonly 'mood.elsewhere': "别处还有 {count} 个任务在忙";
    readonly 'hover.idle.0': "我在呢，随时找我～";
    readonly 'hover.idle.1': "偷偷看你干活中…";
    readonly 'hover.idle.2': "要不要歇会儿？";
    readonly 'hover.idle.3': "（伸了个懒腰）";
    readonly 'hover.idle.4': "今天的你也很棒！";
    readonly 'hover.queued': "马上就到你了～";
    readonly 'hover.confirming': "慢慢看，不着急～";
    readonly 'hover.thinking': "别着急，我在努力想～";
    readonly 'hover.working': "马上就好！";
    readonly 'hover.streaming': "快写完啦，再等一下下～";
    readonly 'hover.error': "抱抱，别难过，我们再试一次";
    readonly 'poke.0': "别戳我啦～";
    readonly 'poke.1': "痒痒的！喵？";
    readonly 'poke.2': "（打了个滚）";
    readonly 'poke.3': "再戳我可要生气啦！";
    readonly 'collapse.hint': "双击我回来～";
    readonly 'collapse.aria': "收起悬浮伙伴";
    readonly 'expand.aria': "唤出悬浮伙伴";
    readonly 'widget.aria': "悬浮伙伴";
    readonly 'menu.collapse': "收起";
    readonly 'menu.expand': "展开";
    readonly 'menu.hide': "隐藏";
    readonly 'menu.nextSkin': "换一只";
    readonly 'menu.jump': "去当前任务";
    readonly 'menu.settings': "设置";
    readonly 'menu.more': "更多";
    readonly 'restore.aria': "显示悬浮伙伴";
    readonly nav: "悬浮伙伴";
    readonly 'section.lead': "调整悬浮伙伴的形象、气泡和闲置互动。";
    readonly 'visible.title': "显示悬浮伙伴";
    readonly 'visible.description': "关掉后角落只留一个小头像，点一下就回来";
    readonly 'toolName.title': "气泡显示工具名";
    readonly 'toolName.description': "忙碌时说出正在调用的工具；关闭后只说陪伴的话，悬停仍可看工具名";
    readonly 'skin.title': "悬浮伙伴形象";
    readonly 'skin.description': "点选一只猫咪或狗狗，立即换上";
    readonly 'skin.group.cat': "猫咪";
    readonly 'skin.group.dog': "狗狗";
    readonly 'skin.cat': "橘猫";
    readonly 'skin.cat-ragdoll': "布偶";
    readonly 'skin.cat-maine': "缅因";
    readonly 'skin.cat-golden': "金渐层";
    readonly 'skin.cat-silver': "银渐层";
    readonly 'skin.dog': "奶黄";
    readonly 'skin.dog-poodle': "泰迪";
    readonly 'skin.dog-collie': "边牧";
    readonly 'skin.dog-corgi': "柯基";
    readonly 'skin.dog-shiba': "柴犬";
    readonly 'bubble.title': "显示状态气泡";
    readonly 'bubble.description': "始终显示气泡与状态文字（关闭后仅在悬停时显示）";
    readonly 'ai.title': "AI 小剧场";
    readonly 'ai.description': "偶尔让模型生成一句俏皮话，关闭后仅用内置文案";
    readonly 'cadence.title': "闲置弹出频率";
    readonly 'cadence.description': "等模型越久，伸懒腰和打哈欠来得越早；也影响闲置冒泡";
    readonly 'cadence.quiet': "安静";
    readonly 'cadence.standard': "标准";
    readonly 'cadence.lively': "热闹";
    readonly 'action.stretch': "伸个懒腰～";
    readonly 'action.yawn': "哈欠……";
    readonly 'peer.status.running': "运行中";
    readonly 'peer.status.stopping': "停止中";
    readonly 'badge.label': "{count} 个任务在跑";
};
/** English dictionary, key-identical to the Chinese source of truth. */
export declare const en: Record<MascotKey, string>;
/** Key domain of the `mascot` namespace (zh is the source of truth). */
export type MascotKey = keyof typeof zh;
