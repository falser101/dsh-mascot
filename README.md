# @falser101/mascot

[中文](README.md) | [English](README.en.md)

![悬浮伙伴](assets/cover.jpg)

DeepSeek Harness（`dsh web`）的悬浮伙伴：一只可拖动的卡通猫或狗，停在界面上陪你干活。它跟着当前会话的状态换表情、说短句，也支持拖拽、点击、双击收起。设置页有独立的「悬浮伙伴」分区，用缩略图切换形象。

https://github.com/user-attachments/assets/3e2c4737-ffda-43fd-96af-e79537123468

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

| 正常 | 干活 | 写答案 | 开心 | 思考 | 难过 |
|:---:|:---:|:---:|:---:|:---:|:---:|
| <img src="docs/cat/正常脸.jpg" width="110" alt="正常"> | <img src="docs/cat/干活脸.jpg" width="110" alt="干活"> | <img src="docs/cat/写答案脸.jpg" width="110" alt="写答案"> | <img src="docs/cat/开心脸.jpg" width="110" alt="开心"> | <img src="docs/cat/思考脸.jpg" width="110" alt="思考"> | <img src="docs/cat/难过脸.jpg" width="110" alt="难过"> |

闲置时会眨眼；思考、干活、写答案、完成、出错时整只一起动。

## 功能

- **跟着会话走**：排队、等你确认、思考、调工具、写答案、完成、出错，各有表情和文案。纯前端投影，不发会话事件。
- **拖来拖去**：松手停在你放的位置；窗口缩小才会夹回屏幕里。
- **状态气泡**：忙碌时说陪伴的话（「还在忙，别急～」），工具名默认关掉，悬停或设置里可打开。闲置时可按安静 / 标准 / 热闹自动冒泡。
- **AI 小剧场**（默认关）：打开后会打**当前默认模型**偶尔写一句俏皮话，没 key 或失败时退回内置句子。高推理模型开着会比较亏，所以默认不用。
- **悬停安慰**：鼠标放上去会换成更软的话，比如「别着急，我在努力想～」。
- **并行感知**：好几个会话或子代理同时跑时，右上角出数字；悬停能看到谁在忙，点一下跳过去。
- **显示 / 隐藏**：设置 → 通用，或设置 → 悬浮伙伴，有「显示悬浮宠物」总开关。关掉后整只从界面消失；右键「隐藏」同样生效。
- **宠物上的入口**：点一下说句俏皮话；双击收成小头像；悬停脚下一排小按钮：换一只、去当前任务、隐藏、打开设置（右键会钉住这排按钮）。
- **等得越久动作越大**：等模型时先打哈欠，再伸懒腰；空闲时仍会偶尔动一下。频率跟「安静 / 标准 / 热闹」走。
- 文案跟界面语言走（中 / 英）；系统开了减弱动态时，动画会停。

## 状态

| 状态 | 什么时候 | 它会怎样 |
| --- | --- | --- |
| 空闲 | 没在跑 | 呼吸 + 眨眼，「我在呢，随时找我～」 |
| 排队 | 消息已发出、还没开工 | 雀跃，「收到！排队开工」 |
| 等待确认 | 审批或提问待你回应 | 歪头，「等你批准一下～」 |
| 思考 | 跑着、还没往外写 | 沉思，「让我想想…」 |
| 干活 | 正在调工具 | 忙碌摇晃，「还在忙，别急～」 |
| 写答案 | 流式输出中 | 「在写答案…」 |
| 完成 | 这一回合刚结束（约 4 秒） | 欢呼，「搞定啦！🎉」 |
| 出错 | 这一回合失败 | 发抖，「哎呀，出错了…」 |
| 打招呼 | 刚切到这个会话（约 4 秒） | 「你好呀！」 |

## 安装

需要已能运行 `dsh --profile web` 的 DeepSeek Harness（`@deepseek-ai/dsh-client-*` ≥ `0.1.0-rc.5`）。

用官方命令装进 web profile：

```sh
dsh plugin --profile web add @falser101/mascot
```

重启 `dsh --profile web`，打开页面就能在右下角看到它。设置里会出现独立的「悬浮伙伴」页。没有 npm 时也可以 `dsh plugin --profile web add github:falser101/dsh-mascot`。

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
