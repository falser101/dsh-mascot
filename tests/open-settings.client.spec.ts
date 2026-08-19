// @vitest-environment jsdom
import { describe, expect, it } from 'vitest'
import { tryOpenSettingsSection } from '../src/client/open-settings'

describe('tryOpenSettingsSection', () => {
  it('clicks the settings trigger then the matching nav cell', () => {
    document.body.innerHTML = `
      <button aria-haspopup="dialog" aria-expanded="false">设置</button>
      <nav><button type="button">通用</button><button type="button">悬浮伙伴</button></nav>
    `
    const trigger = document.querySelector('button[aria-haspopup="dialog"]') as HTMLButtonElement
    const section = [...document.querySelectorAll('nav button')][1] as HTMLButtonElement
    const clicks: string[] = []
    trigger.addEventListener('click', () => { clicks.push('trigger') })
    section.addEventListener('click', () => { clicks.push('section') })
    expect(tryOpenSettingsSection('悬浮伙伴')).toBe(true)
    expect(clicks).toEqual(['trigger', 'section'])
  })

  it('returns false when the host chrome is missing', () => {
    document.body.innerHTML = ''
    expect(tryOpenSettingsSection('悬浮伙伴')).toBe(false)
  })
})
