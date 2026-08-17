# @falser101/mascot

[中文](README.md) | [English](README.en.md)

DeepSeek Harness（`dsh web`）的悬浮伙伴：一只可拖动的卡通猫或狗，停在界面上陪你干活。它跟着当前会话的状态换表情、说短句，也支持拖拽、点击、双击收起。设置页有独立的「悬浮伙伴」分区，用缩略图切换形象。

![悬浮伙伴交互演示](demo/mascot-interactions.gif)

## 形象

设置 → **悬浮伙伴**，点选即可切换。选择会记在本地。

### 猫咪

| 橘猫 | 布偶 | 缅因 | 金渐层 | 银渐层 |
|:---:|:---:|:---:|:---:|:---:|
| <img src="docs/cat/正常脸.jpg" width="150" alt="橘猫"> | <img src="docs/cat-ragdoll/正常脸.jpg" width="150" alt="布偶"> | <img src="docs/cat-maine/正常脸.jpg" width="150" alt="缅因"> | <img src="docs/cat-golden/正常脸.jpg" width="150" alt="金渐层"> | <img src="docs/cat-silver/正常脸.jpg" width="150" alt="银渐层"> |

### 狗狗

| 奶黄 | 泰迪 | 边牧 | 柯基 | 柴犬 |
|:---:|:---:|:---:|:---:|:---:|
| <img src="docs/dog/正常脸.jpg" width="150" alt="奶黄"> | <img src="docs/dog-poodle/正常脸.jpg" width="150" alt="泰迪"> | <img src="docs/dog-collie/正常脸.jpg" width="150" alt="边牧"> | <img src="docs/dog-corgi/正常脸.jpg" width="150" alt="柯基"> | <img src="docs/dog-shiba/正常脸.jpg" width="150" alt="柴犬"> |

### 表情

同一只、同一姿势，只换脸上的表情。以橘猫为例：

| 正常 | 开心 | 思考 | 难过 | 闭眼 |
|:---:|:---:|:---:|:---:|:---:|
| <img src="docs/cat/正常脸.jpg" width="130" alt="正常"> | <img src="docs/cat/开心脸.jpg" width="130" alt="开心"> | <img src="docs/cat/思考脸.jpg" width="130" alt="思考"> | <img src="docs/cat/难过脸.jpg" width="130" alt="难过"> | <img src="docs/cat/闭眼帧.jpg" width="130" alt="闭眼"> |

闲置时会眨眼；思考、干活、写答案、完成、出错时整只一起动。

## 功能

- **跟着会话走**：排队、等你确认、思考、调工具、写答案、完成、出错，各有表情和文案。纯前端投影，不发会话事件。
- **拖来拖去**：松手后位置会记住，窗口缩放也会夹回屏幕里。
- **状态气泡**：忙碌时一直显示；闲置时可按安静 / 标准 / 热闹自动冒泡，也可以关掉、只在悬停时出现。
- **AI 小剧场**：闲置文案里偶尔插一句由框架已配置模型生成的俏皮话。没 key 或失败时自动退回内置句子。
- **悬停安慰**：鼠标放上去会换成更软的话，比如「别着急，我在努力想～」。
- **并行感知**：好几个会话或子代理同时跑时，右上角出数字；悬停能看到谁在忙，点一下跳过去。
- **点击 / 双击**：点一下说句俏皮话；双击收成小圆点，再双击唤回来。
- 文案跟界面语言走（中 / 英）；系统开了减弱动态时，动画会停。

## 状态

| 状态 | 什么时候 | 它会怎样 |
| --- | --- | --- |
| 空闲 | 没在跑 | 呼吸 + 眨眼，「我在呢，随时找我～」 |
| 排队 | 消息已发出、还没开工 | 雀跃，「收到！排队开工」 |
| 等待确认 | 审批或提问待你回应 | 歪头，「等你批准一下～」 |
| 思考 | 跑着、还没往外写 | 沉思，「让我想想…」 |
| 干活 | 正在调工具 | 忙碌摇晃，「正在调用「{工具}」」 |
| 写答案 | 流式输出中 | 「在写答案…」 |
| 完成 | 这一回合刚结束（约 4 秒） | 欢呼，「搞定啦！🎉」 |
| 出错 | 这一回合失败 | 发抖，「哎呀，出错了…」 |
| 打招呼 | 刚切到这个会话（约 4 秒） | 「你好呀！」 |

## 安装

需要已能运行 `dsh --profile web` 的 DeepSeek Harness（`@deepseek-ai/dsh-client-*` ≥ `0.1.0-rc.5`）。

用官方命令装进 web profile（推荐）：

```sh
dsh plugin --profile web add github:falser101/dsh-mascot
```

发布到 npm 之后也可以：

```sh
dsh plugin --profile web add @falser101/mascot
```

重启 `dsh --profile web`，打开页面就能在右下角看到它。设置里会出现独立的「悬浮伙伴」页。

本机开发、对着源码试，把仓库链进 profile 即可：

```sh
dsh plugin --profile web add /path/to/dsh-mascot
```

卸掉：

```sh
dsh plugin --profile web remove @falser101/mascot
```

## 开发

```sh
pnpm build        # 产出 lib/（宿主半区 + 浏览器 bundle）
pnpm watch        # 改客户端时热重载
pnpm test
```

`lib/` 随仓库提交，git / npm 安装都不需要再构建。

换立绘：覆盖 `docs/<品种>/` 里的同名 jpg → `node scripts/build-art-assets.mjs` → 重新构建。提示词包见 [`docs/character-art-prompts.md`](docs/character-art-prompts.md)。

## License

MIT
