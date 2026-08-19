/**
 * Compose storefront cover images from the character art so README / awesome-list
 * cards are not the first breed thumbnail. Dev tool only.
 */
import { execSync } from 'node:child_process'
import { mkdirSync, writeFileSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

const root = join(dirname(fileURLToPath(import.meta.url)), '..')
const out = join(root, 'assets')
mkdirSync(out, { recursive: true })

const breeds = [
  ['cat', '橘猫'],
  ['cat-ragdoll', '布偶'],
  ['cat-maine', '缅因'],
  ['cat-golden', '金渐层'],
  ['cat-silver', '银渐层'],
  ['dog', '奶黄'],
  ['dog-poodle', '泰迪'],
  ['dog-collie', '边牧'],
  ['dog-corgi', '柯基'],
  ['dog-shiba', '柴犬'],
]

function src(character, file) {
  return join(root, 'docs', character, file)
}

function transparentPng(character, file, dest) {
  execSync(
    `magick '${src(character, file)}' -alpha set -channel RGBA -fuzz 8% -fill none ` +
    `-floodfill +0+0 white -resize 640x640 ${dest}`,
  )
  return dest
}

const coverHtml = `<!DOCTYPE html>
<html><head><meta charset="utf-8">
<style>
  html, body { margin: 0; width: 1600px; height: 900px; background: #16161a; }
  body { font-family: "Segoe UI", "PingFang SC", "Noto Sans CJK SC", sans-serif; color: #f4f0ea; }
  .stage { position: relative; width: 1600px; height: 900px; overflow: hidden;
    background: radial-gradient(1200px 700px at 30% 20%, #2a2430 0%, #16161a 62%); }
  .sidebar { position: absolute; left: 0; top: 0; bottom: 0; width: 248px;
    background: #1c1c22; border-right: 1px solid #2e2e36; }
  .brand { padding: 28px 22px 12px; font-size: 13px; letter-spacing: 0.08em;
    color: #9a948c; text-transform: uppercase; }
  .sess { margin: 8px 14px; padding: 10px 12px; border-radius: 10px; background: #2a2a32; font-size: 14px; }
  .copy { position: absolute; left: 300px; top: 88px; width: 640px; }
  .kicker { font-size: 15px; color: #c4b8a8; letter-spacing: 0.04em; }
  h1 { margin: 10px 0 16px; font-size: 52px; font-weight: 650; letter-spacing: -0.03em; }
  .lead { font-size: 22px; line-height: 1.45; color: #d9d2c8; max-width: 520px; }
  .pill { display: inline-flex; margin-top: 28px; padding: 8px 14px; border-radius: 999px;
    background: #2a2a32; color: #ece6dc; font-size: 14px; }
  .pet { position: absolute; right: 56px; bottom: 88px; width: 380px; height: 380px; }
  .pet img { width: 380px; height: 380px; object-fit: contain; }
  .bubble { position: absolute; right: 110px; bottom: 478px; background: #fff; color: #3b2f2a;
    border-radius: 16px; padding: 12px 18px; font-size: 18px; box-shadow: 0 10px 28px rgb(0 0 0 / 0.35); }
  .bubble::after { content: ""; position: absolute; top: 100%; left: 70%;
    border: 8px solid transparent; border-top-color: #fff; }
  .tray { position: absolute; right: 168px; bottom: 52px; display: flex; gap: 2px; padding: 4px;
    border-radius: 999px; background: rgb(255 255 255 / 0.9); }
  .tray i { width: 28px; height: 28px; border-radius: 999px; background: rgb(0 0 0 / 0.08); }
</style></head>
<body>
  <div class="stage">
    <div class="sidebar">
      <div class="brand">DeepSeek Harness</div>
      <div class="sess">新会话</div>
    </div>
    <div class="copy">
      <div class="kicker">@falser101/mascot</div>
      <h1>悬浮伙伴</h1>
      <p class="lead">一只可拖动的猫或狗，跟着会话换表情。点一下会说话，悬停有按钮。</p>
      <div class="pill">dsh plugin --profile web add @falser101/mascot</div>
    </div>
    <div class="bubble">拖我，悬停有按钮</div>
    <div class="pet"><img src="${transparentPng('cat', '正常脸.jpg', '/tmp/mascot-cover-pet.png')}" alt=""></div>
    <div class="tray"><i></i><i></i><i></i><i></i></div>
  </div>
</body></html>`

const faces = [
  ['正常', '正常脸.jpg'],
  ['干活', '干活脸.jpg'],
  ['写答案', '写答案脸.jpg'],
  ['开心', '开心脸.jpg'],
  ['思考', '思考脸.jpg'],
]
const facesHtml = `<!DOCTYPE html>
<html><head><meta charset="utf-8">
<style>
  html, body { margin: 0; width: 1600px; height: 900px; background: #16161a; color: #f4f0ea;
    font-family: "Segoe UI", "PingFang SC", "Noto Sans CJK SC", sans-serif; }
  .wrap { padding: 56px 72px; }
  h1 { margin: 0 0 8px; font-size: 36px; font-weight: 650; }
  .sub { margin: 0 0 36px; color: #c4b8a8; font-size: 18px; }
  .row { display: flex; gap: 28px; }
  .card { text-align: center; }
  .card img { width: 240px; height: 240px; object-fit: contain; background: #1c1c22;
    border-radius: 24px; }
  .card span { display: block; margin-top: 12px; font-size: 16px; color: #d9d2c8; }
</style></head>
<body>
  <div class="wrap">
    <h1>干活和写答案是两张脸</h1>
    <p class="sub">同一只、同一姿势，只换表情。96px 下也能看出来在忙还是在写。</p>
    <div class="row">
      ${faces.map(([label, file]) =>
        `<div class="card"><img src="${src('cat', file)}"><span>${label}</span></div>`).join('')}
    </div>
  </div>
</body></html>`

const skinsHtml = `<!DOCTYPE html>
<html><head><meta charset="utf-8">
<style>
  html, body { margin: 0; width: 1600px; height: 900px; background: #16161a; color: #f4f0ea;
    font-family: "Segoe UI", "PingFang SC", "Noto Sans CJK SC", sans-serif; }
  .wrap { padding: 48px 64px; }
  h1 { margin: 0 0 8px; font-size: 36px; font-weight: 650; }
  .sub { margin: 0 0 28px; color: #c4b8a8; font-size: 18px; }
  .grid { display: grid; grid-template-columns: repeat(5, 1fr); gap: 22px; }
  .card { text-align: center; }
  .card img { width: 100%; aspect-ratio: 1; object-fit: contain; background: #1c1c22;
    border-radius: 20px; }
  .card span { display: block; margin-top: 8px; font-size: 15px; color: #d9d2c8; }
</style></head>
<body>
  <div class="wrap">
    <h1>十只猫狗</h1>
    <p class="sub">设置 → 悬浮伙伴，点选即可切换。选择记在本地。</p>
    <div class="grid">
      ${breeds.map(([id, label]) =>
        `<div class="card"><img src="${src(id, '正常脸.jpg')}"><span>${label}</span></div>`).join('')}
    </div>
  </div>
</body></html>`

function shot(html, name) {
  const page = join('/tmp', `mascot-${name}.html`)
  writeFileSync(page, html)
  const png = join('/tmp', `mascot-${name}.png`)
  execSync(
    `google-chrome-stable --headless=new --disable-gpu --hide-scrollbars ` +
    `--window-size=1600,900 --screenshot=${png} file://${page}`,
    { stdio: 'inherit' },
  )
  const jpg = join(out, `${name}.jpg`)
  execSync(`magick ${png} -quality 86 ${jpg}`)
  console.log('wrote', jpg)
}

shot(coverHtml, 'cover')
shot(facesHtml, 'faces')
shot(skinsHtml, 'skins')
