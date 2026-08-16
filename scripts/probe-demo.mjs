/**
 * Demo-recording helper: probe the page structure (role/aria labels) so the
 * frame script can target the mascot and the settings entry precisely.
 * Dev tool only — not part of the shipped plugin.
 */
import { chromium } from 'playwright'

const browser = await chromium.launch({ headless: true })
const page = await browser.newPage({ viewport: { width: 1280, height: 800 } })
await page.goto('http://127.0.0.1:3091/', { waitUntil: 'domcontentloaded' })
await page.waitForTimeout(4000)

const mascot = page.locator('[role="button"][aria-label="悬浮伙伴"]')
console.log('mascot count:', await mascot.count())

const buttons = await page.locator('button').evaluateAll(nodes =>
  nodes
    .map(n => ({ label: n.getAttribute('aria-label'), title: n.getAttribute('title'), text: (n.textContent ?? '').trim().slice(0, 20) }))
    .filter(b => b.label || b.title || b.text),
)
console.log('buttons:', JSON.stringify(buttons.slice(0, 30), null, 1))

await browser.close()
