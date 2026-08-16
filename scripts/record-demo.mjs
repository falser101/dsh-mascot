/**
 * Demo recording v2: capture the updated interaction storyboard against the
 * clean demo instance (http://127.0.0.1:3091, scratch DSH_HOME, no API key).
 * Story: idle → hover reassurance → poke → drag → settings rows → dog skin,
 * plus a best-effort no-key error frame (the only busy mood reachable without
 * a model). Frames land in /tmp/gif-frames-demo, encoded by the
 * record-browser-gif encoder. Dev tool only.
 */
import { mkdirSync } from 'node:fs'
import { chromium } from 'playwright'

const URL = 'http://127.0.0.1:3091/'
const FRAMES = '/tmp/gif-frames-demo'
mkdirSync(FRAMES, { recursive: true })

const browser = await chromium.launch({ headless: true })
const page = await browser.newPage({ viewport: { width: 1280, height: 800 } })
const shot = (name) => page.screenshot({ path: `${FRAMES}/${name}.png` })

await page.goto(URL, { waitUntil: 'domcontentloaded' })

// Dismiss the first-run onboarding chain (notice → API-key guidance).
const notice = page.locator('[role="presentation"]').filter({ hasText: '内测声明' })
if (await notice.count() > 0) {
  await notice.locator('button').first().click()
  await page.waitForTimeout(1800)
}
const keyStep = page.locator('[role="presentation"]').filter({ hasText: 'API Key' })
if (await keyStep.count() > 0) {
  await keyStep.locator('button', { hasText: '稍后配置' }).click()
  await page.waitForTimeout(1800)
}

const mascot = page.locator('[role="button"][aria-label="悬浮伙伴"]')
await mascot.waitFor({ state: 'visible', timeout: 30000 })
await page.waitForTimeout(1200)
await shot('00-initial')

// Hover: an idle theater line appears (the breathing animation makes the
// widget perpetually "unstable", so drive the pointer by coordinates).
let box = await mascot.boundingBox()
if (box) {
  await page.mouse.move(box.x + box.width / 2, box.y + box.height / 2)
  await page.waitForTimeout(700)
  await shot('01-hover')
  await page.mouse.move(640, 400)
  await page.waitForTimeout(500)
}

// Click: a playful poke line.
for (let attempt = 0; attempt < 4; attempt += 1) {
  box = await mascot.boundingBox()
  if (box) await page.mouse.click(box.x + box.width / 2, box.y + box.height / 2)
  await page.waitForTimeout(250)
  const bubble = await page.evaluate(() => {
    const b = document.querySelector('[role="status"]')
    return b ? { v: b.getAttribute('data-visible'), t: b.textContent } : null
  })
  if (bubble?.v === 'true') break
}
await page.waitForTimeout(150)
await shot('02-poke')
await page.waitForTimeout(2200)

// Drag: move the widget to the top-left.
box = await mascot.boundingBox()
if (box) {
  await page.mouse.move(box.x + box.width / 2, box.y + box.height / 2)
  await page.mouse.down()
  await page.mouse.move(40, 40, { steps: 12 })
  await page.mouse.up()
}
await page.waitForTimeout(500)
await shot('03-dragged')

// Settings: both preference rows visible (skin + busy-bubble switch).
const settingsBtn = page.getByText('设置', { exact: true })
console.log('settings btn count:', await settingsBtn.count())
await settingsBtn.first().click({ force: true })
await page.getByText('悬浮伙伴形象').waitFor({ timeout: 5000 })
await page.getByText('忙碌时显示气泡').waitFor({ timeout: 3000 })
await shot('04-settings')

// Switch to the dog skin, close settings, confirm the dog rendered.
await page.locator('button[aria-haspopup="menu"]').filter({ hasText: '猫咪' }).click()
await page.getByText('狗狗', { exact: true }).last().click()
await page.waitForTimeout(400)
await page.keyboard.press('Escape')
await page.waitForTimeout(600)
const isDog = await page.locator('svg[data-mood]').evaluate(node => node.innerHTML.includes('mascot-dog-fur'))
console.log('dog skin rendered:', isDog)
await shot('05-dog')

// Best effort: a no-key prompt is rejected, which surfaces the error mood —
// the one busy state reachable without a model. Non-fatal if absent.
try {
  await page.getByRole('button', { name: '新建会话' }).first().click()
  await page.waitForTimeout(1200)
  const editor = page.locator('[contenteditable="true"], textarea').first()
  await editor.click()
  await editor.fill('你好')
  await page.keyboard.press('Enter')
  await page.waitForTimeout(9000)
  const bubble = await page.evaluate(() => {
    const b = document.querySelector('[role="status"]')
    return b ? { v: b.getAttribute('data-visible'), t: b.textContent } : null
  })
  console.log('bubble after no-key prompt:', JSON.stringify(bubble))
  if (bubble?.v === 'true') await shot('06-error')
} catch (error) {
  console.log('no-key error frame skipped:', error.message)
}

await browser.close()
console.log('frames in', FRAMES)
