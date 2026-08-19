# 宠物形象 AI 生成提示词包

用于在外部 AI 绘图工具（Stable Diffusion / Midjourney / 即梦 / 豆包等）生成插件可用的卡通宠物素材。目标是：**一组同一构图的全身立绘，每张只改表情**。不要单独出「放大的头」——插件按整只猫切换，特写头叠在已有脸上会出现两个头。

## 〇、总原则

- 所有图片共用同一个**角色身份证**（第一段），保证是同一只。
- 所有图片要求**简单轮廓、无阴影、无文字**，方便拆件和贴片。
- 表情帧必须与主形象图**同一只、同一姿势、同一取景、同一比例**，只改五官。不要裁成头部特写。

---

## 一、角色身份证（所有图的第一段，必须原样复制）

**中文版（即梦 / 豆包 / 通义万相等国产工具用）：**

```
一只卡通{橘猫}，圆润的{大脸}，{水汪汪的大眼睛}，{粉嫩的小鼻子}，淡淡的腮红，{橙色渐变}毛发，线条干净简洁，可爱治愈的二次元卡通风格
```

**英文版（Stable Diffusion / Midjourney 用）：**

```
one cartoon orange cat character, round chubby face, large glossy eyes, pink tiny nose, rosy cheeks, orange gradient fur, clean simple outlines, cute kawaii style
```

把 `{花括号}` 里的词换成你自己的设定即可（比如 `{布偶猫}`、`{奶黄色垂耳狗}`、`{奶白+浅棕}毛发`）。改完之后**整包所有提示词都用同一段，一个字都不要变**。

---

## 二、主形象图（拆件用，最重要的一张）

**中文：**

```
【角色身份证】

正面全身站立，四肢自然下垂不外扩，尾巴和耳朵轮廓清晰独立，与身体分开，纯白色背景，无阴影，无文字水印，构图居中，全身完整不裁切，高清细节
```

**英文：**

```
【CHARACTER IDENTITY】

full body, front view, standing upright, arms and legs relaxed at the sides, tail and ears clearly separated from the body, plain white background, no shadow, no text or watermark, centered composition, full body visible in frame, high detail
```

**生成后检查清单（不满足就重新抽）：**
- [ ] 四肢自然下垂、不遮挡身体
- [ ] 尾巴 / 耳朵 / 头 / 身体轮廓清晰
- [ ] 无阴影、无文字、无多余道具
- [ ] 全身完整
- [ ] 所有表情帧与主形象图的主体位置、大小一致（不要放大头部）

**工具备注：**
| 工具 | 透明背景做法 |
|---|---|
| Stable Diffusion / ComfyUI | 装透明背景插件直接输出 PNG 透明；或白底生成后我抠图 |
| 即梦 / 豆包 | 看是否支持"透明背景"输出选项；不支持就白底，我抠 |
| Midjourney | 不支持透明，必须白底生成后抠图（`--no shadow, text` 加上） |

---

## 三、表情帧集（同一角色，每张只改表情词）

每张 = **角色身份证 + 表情词 + 取景词**。用**第一张主图当参考图**（即梦/豆包的"参考图"功能，或 SD 固定 seed）保证是同一只。

**通用取景词（中文版附在表情词后，必须与主形象图同一构图）：**

```
与主形象图完全相同的正面全身站姿/坐姿，四肢位置、尾巴位置、身体比例、构图居中、画幅留白全部不变，只改脸上的表情，纯白背景，无阴影，无文字
```

**英文版取景词：**

```
same full-body framing as the main sprite, same pose, same scale, same centered composition, change only the facial expression, plain white background, no shadow, no text
```

### 1. 正常脸（默认状态）
- 中文表情词：`表情自然，眼睛正常睁开，嘴角微微上扬的温柔微笑`
- 英文表情词：`neutral expression, eyes open, gentle soft smile`

### 2. 开心脸（完成 / 打招呼 / 被戳时用）
- 中文表情词：`非常开心，眼睛眯成弯弯的月牙（^ ^），嘴巴张开大笑，脸颊泛红`
- 英文表情词：`very happy, eyes closed in joyful arcs (^ ^ shape), open mouth laughing smile, blushing cheeks`

### 3. 难过脸（出错时用）
- 中文表情词：`难过委屈，耷拉着耳朵，眼睛含泪，嘴巴嘟起，快要哭的样子`
- 英文表情词：`sad, drooping ears, teary glossy eyes, pouting mouth, about to cry`

### 4. 思考脸（思考 / 等待确认时用）
- 中文表情词：`思考的表情，眼睛看向斜上方，微微歪头，若有所思`
- 英文表情词：`thinking expression, eyes looking up to the side, head tilted slightly, thoughtful`

### 5. 闭眼帧（眨眼用，可选但强烈建议）
- 中文表情词：`眼睛轻轻闭合，睫毛清晰，安静平和的微笑`
- 英文表情词：`eyes closed peacefully, clear eyelashes, calm gentle smile`

### 6. 干活脸（调用工具 / working，必须和正常脸区分开）
- 中文表情词：`认真干活的表情，眉头微皱，眼睛眯成专注的细缝，嘴角抿紧，舌尖微微伸出`
- 英文表情词：`determined working expression, knitted brows, eyes narrowed in a focused squint, tiny tongue tip sticking out of a small concentrated mouth`

### 7. 写答案脸（流式输出 / streaming，必须和干活脸、思考脸都不同）
- 中文表情词：`正在写答案的表情，眼睛微微向下看像在看稿，嘴巴张开一个小小的说话口型，认真又有一点期待`
- 英文表情词：`writing-the-answer expression, eyes looking slightly down as if reading, mouth open in a small speaking oval, attentive and a little eager`

---

## 四、参数建议（各工具通用）

- 分辨率：**1024×1024**（主图与表情帧相同，禁止把表情裁成头部特写）
- 步数：SD 30-40 步；国产工具默认即可
- 负面提示词（Negative）：`shadow, text, watermark, logo, extra limbs, multiple characters, cropped, low quality, blurry, dark background`
- Midjourney 额外加：`--no shadow, text, watermark`；表情帧用 `--cref <主图URL> --cw 100` 锁角色

---

## 五、最终交付给我（命名规范）

```
docs/<character>/          ← cat 或 dog，一种形象一个文件夹
  主形象图.jpg
  正常脸.jpg
  开心脸.jpg
  难过脸.jpg
  思考脸.jpg
  闭眼帧.jpg
  干活脸.jpg
  写答案脸.jpg
```

- PNG 格式，512×512 以上
- 透明背景最佳；白底也可以（告诉我，我抠图）
- 表情帧必须是**同一构图的全身**（不是头的特写）。主体在画幅里的位置、大小要和主形象图对得上，否则叠图会错位或出现两个头
- 接入后自动有：眨眼、表情切换、整体弹跳/晃动/呼吸

## 七、闲置动作帧（伸懒腰 / 捂嘴打哈欠）

坐姿 chibi，不要趴下前伸。每种动作一组关键姿势，构图仍与主形象图同一只、同一比例、白底。

```
docs/<character>/actions/stretch/01.jpg … 04.jpg
docs/<character>/actions/yawn/01.jpg … 05.jpg
```

### 伸懒腰（4 帧，坐着举爪）

1. 预备：仍坐着，肩微沉，眼半闭，两前爪着地
2. 起势：两前爪抬到胸前，身体略后仰
3. 顶点：两爪举过头顶，胸腹略拉长，眼弯
4. 回落：爪回到胸前，身体回坐

### 捂嘴打哈欠（5 帧，单爪）

1. 预备：眼开始眯，嘴微张，两爪着地
2. 张嘴：嘴张开，一只前爪刚离地
3. 顶点：爪垫挡住张开的嘴，眼几乎闭上，另一爪着地
4. 余韵：爪往下放，嘴合上一半
5. 坐回：爪落地，嘴几乎合上

缺帧的品种闲置只呼吸，不会报错。生成后跑 `node scripts/build-art-assets.mjs`。

## 六、我做好的部分（等你素材回来直接拼）

- `ImageSkin` 皮肤组件：读取 `docs/<character>/` 同构图全身帧 → 按 mood 整帧切换 → 接入 `data-mood` 动画契约
- 换图：覆盖对应文件夹里的同名 jpg → `node scripts/build-art-assets.mjs` → 重新构建
