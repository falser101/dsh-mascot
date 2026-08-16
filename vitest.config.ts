import { readFileSync } from 'node:fs'
import { resolve } from 'node:path'
import { defineConfig } from 'vitest/config'

/** Harness checkout root (development-time resolution facade). */
const REPO_ROOT = '/home/falser/Projects/deepseek-harness'

/**
 * Build source-level aliases from the harness's own tsconfig.base.json paths
 * (the same facade the harness vitest suites use): tests exercise the real
 * src modules of every @deepseek-ai package, never their built browser
 * bundles. Exact subpath keys sort first so prefix matching cannot shadow
 * them; glob entries are skipped (none reach the runtime import graph here).
 */
function harnessAliases(): Array<{ find: string; replacement: string }> {
  const raw = readFileSync(resolve(REPO_ROOT, 'tsconfig.base.json'), 'utf8')
    .replace(/\/\/[^\n]*/g, '')
  const paths = (JSON.parse(raw) as { compilerOptions: { paths: Record<string, string[]> } })
    .compilerOptions.paths
  return Object.entries(paths)
    .filter(([key]) => key.startsWith('@deepseek-ai/') && !key.includes('*'))
    .sort(([a], [b]) => b.length - a.length)
    .map(([key, targets]) => ({ find: key, replacement: resolve(REPO_ROOT, targets[0] ?? key) }))
}

export default defineConfig({
  resolve: {
    alias: harnessAliases(),
  },
  test: {
    include: ['tests/**/*.spec.ts?(x)'],
    environment: 'node',
    // Node's experimental process-wide WebStorage shadows jsdom's
    // localStorage (populateGlobal skips keys already on globalThis); the
    // same --no-webstorage the harness workers use keeps jsdom storage real.
    execArgv: process.allowedNodeEnvironmentFlags.has('--webstorage') ? ['--no-webstorage'] : [],
    // jsdom storage (localStorage/sessionStorage) is disabled on opaque
    // origins; pin a real URL so persisted stores work in component specs.
    environmentOptions: {
      jsdom: { url: 'http://localhost/' },
    },
  },
})
