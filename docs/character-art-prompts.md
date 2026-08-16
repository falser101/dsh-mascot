# 宠物形象 AI 生成提示词包

用于在外部 AI 绘图工具（Stable Diffusion / Midjourney / 即梦 / 豆包等）生成插件可用的卡通宠物素材。目标是：**一张全身立绘用于拆件 + 一组表情帧用于状态切换**。

## 〇、总原则

- 所有图片共用同一个**角色身份证**（第一段），保证是同一只。
- 所有图片要求**简单轮廓、无阴影、无文字**，方便拆件和贴片。
- 表情帧只画**头部正面特写**（我按坐标贴到身体上），不需要全身。

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
- [ ] 四肢自然下垂、不遮挡身体（切件时需要）
- [ ] 尾巴 / 耳朵 / 头 / 身体轮廓清晰可分
- [ ] 无阴影、无文字、无多余道具
- [ ] 全身完整

**工具备注：**
| 工具 | 透明背景做法 |
|---|---|
| Stable Diffusion / ComfyUI | 装透明背景插件直接输出 PNG 透明；或白底生成后我抠图 |
| 即梦 / 豆包 | 看是否支持"透明背景"输出选项；不支持就白底，我抠 |
| Midjourney | 不支持透明，必须白底生成后抠图（`--no shadow, text` 加上） |

---

## 三、表情帧集（同一角色，每张只改表情词）

每张 = **角色身份证 + 表情词 + 取景词**。用**第一张主图当参考图**（即梦/豆包的"参考图"功能，或 SD 固定 seed）保证是同一只。

**通用取景词（中文版附在表情词后）：**

```
头部正面特写，居中，表情清晰，纯白背景，无阴影，无文字
```

**英文版取景词：**

```
head close-up, front view, centered, clear expression, plain white background, no shadow, no text
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

---

## 四、参数建议（各工具通用）

- 分辨率：**1024×1024**（主图） / **1024×1024**（表情帧，只要头部会放大裁切，生成时取景近一点）
- 步数：SD 30-40 步；国产工具默认即可
- 负面提示词（Negative）：`shadow, text, watermark, logo, extra limbs, multiple characters, cropped, low quality, blurry, dark background`
- Midjourney 额外加：`--no shadow, text, watermark`；表情帧用 `--cref <主图URL> --cw 100` 锁角色

---

## 五、最终交付给我（命名规范）

```
character/
  body.png          ← 主形象全身（透明或白底）
  face-neutral.png  ← 正常脸
  face-happy.png    ← 开心脸
  face-sad.png      ← 难过脸
  face-thinking.png ← 思考脸
  face-closed.png   ← 闭眼帧（可选）
```

- PNG 格式，512×512 以上
- 透明背景最佳；白底也可以（告诉我，我抠图）
- 表情帧是**头**就行（不需要脖子以下），我会按坐标贴到身体上，自动接入：眨眼、表情切换、尾巴/耳朵摆动、整体弹跳/晃动/呼吸等全部现有动画

## 六、我做好的部分（等你素材回来直接拼）

- `ImageSkin` 皮肤组件框架：读取 `character/` 目录素材 → 按 120×120 排版模板摆位 → 接入 `data-mood` 动画契约
- 部位排版模板：标注头、身体、尾巴、耳朵各自的坐标框，你以后想换图直接替换同名文件即可
