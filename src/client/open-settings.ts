/**
 * Best-effort open of the host settings panel on the companion section.
 * The shell keeps open-state private; this clicks the shipped trigger and
 * the nav cell whose label matches ours. Missing chrome is a silent no-op.
 */
export function tryOpenSettingsSection(
  label: string,
  doc: Document = document,
): boolean {
  const trigger = doc.querySelector<HTMLButtonElement>('button[aria-haspopup="dialog"]')
  if (trigger === null) return false
  if (trigger.getAttribute('aria-expanded') !== 'true') trigger.click()
  const pick = (): boolean => {
    const match = [...doc.querySelectorAll<HTMLButtonElement>('nav button')]
      .find(btn => (btn.textContent ?? '').includes(label))
    if (match === undefined) return false
    match.click()
    return true
  }
  if (pick()) return true
  if (typeof requestAnimationFrame === 'function') {
    requestAnimationFrame(() => { requestAnimationFrame(pick) })
  }
  return false
}
