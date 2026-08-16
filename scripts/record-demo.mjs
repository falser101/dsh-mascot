/**
 * Demo recording: capture the mascot's static-interaction storyboard against
 * the clean demo instance (http://127.0.0.1:3091, scratch DSH_HOME, no API
 * key — model-backed moods are verified by the user separately). Frames land
 * in /tmp/gif-frames-demo and are encoded by the record-browser-gif encoder.
 * Dev tool only — not part of the shipped plugin.
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

// Dismiss the first-run onboarding chain (notice → API-key guidance) so no
// modal mask blocks the widget. The no-key demo takes the '稍后配置' path.
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
console.log('modal masks remaining:', await page.locator('._mask_15u5s_14').count())

const mascot = page.locator('[role="button"][aria-label="悬浮伙伴"]')
await mascot.waitFor({ state: 'visible', timeout: 30000 })
await page.waitForTimeout(1200)
await shot('00-initial')

// Hover: the bubble appears above the character. The idle breathing
// animation makes the widget perpetually "unstable" for Playwright's
// actionability check, so drive the pointer by coordinates.
let box = await mascot.boundingBox()
if (box) {
  await page.mouse.move(box.x + box.width / 2, box.y + box.height / 2)
  await page.waitForTimeout(700)
  await shot('01-hover')
  await page.mouse.move(640, 400)
  await page.waitForTimeout(400)
}
await page.mouse.move(640, 400) // leave

// Click: a playful poke line shows for ~2s (retry a few times — a prior
// pointer sequence can swallow the first click).
for (let attempt = 0; attempt < 4; attempt += 1) {
  box = await mascot.boundingBox()
  if (box) {
    await page.mouse.click(box.x + box.width / 2, box.y + box.height / 2)
  }
  await page.waitForTimeout(250)
  const bubble = await page.evaluate(() => {
    const b = document.querySelector('[role="status"]')
    return b ? { v: b.getAttribute('data-visible'), t: b.textContent } : null
  })
  console.log('poke attempt', attempt, JSON.stringify(bubble))
  if (bubble?.v === 'true') break
}
await page.waitForTimeout(200)
await shot('02-poke')
await page.waitForTimeout(2200) // let the poke bubble expire

// Drag: move the widget to the top-left via pointer events.
box = await mascot.boundingBox()
if (box) {
  await page.mouse.move(box.x + box.width / 2, box.y + box.height / 2)
  await page.mouse.down()
  await page.mouse.move(40, 40, { steps: 12 })
  await page.mouse.up()
}
await page.waitForTimeout(500)
await shot('03-dragged')

// Double-click: collapse to the dot.
box = await mascot.boundingBox()
if (box) {
  await page.mouse.dblclick(box.x + box.width / 2, box.y + box.height / 2)
}
await page.locator('[aria-hidden="true"]').first().waitFor({ timeout: 3000 })
await page.waitForTimeout(400)
await shot('04-collapsed')

// Double-click again: restore, then open settings.
box = await mascot.boundingBox()
if (box) {
  await page.mouse.dblclick(box.x + box.width / 2, box.y + box.height / 2)
}
await page.getByText('设置', { exact: true }).click()
await page.getByText('悬浮伙伴形象').waitFor({ timeout: 5000 })
await shot('05-settings')

// Open the skin menu and pick the dog.
await page.locator('button[aria-haspopup="menu"]').filter({ hasText: '猫咪' }).click()
await page.getByText('狗狗', { exact: true }).last().click()
await page.waitForTimeout(400)

// Close settings and confirm the dog skin rendered.
await page.keyboard.press('Escape')
await page.waitForTimeout(600)
const isDog = await page.locator('svg[data-mood]').evaluate(node => node.innerHTML.includes('mascot-dog-fur'))
console.log('dog skin rendered:', isDog)
await shot('06-dog')

await browser.close()
console.log('frames in', FRAMES)
