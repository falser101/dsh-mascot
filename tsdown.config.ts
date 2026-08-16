/**
 * Standalone build config for the mascot client plugin, mirroring the dsh
 * harness's client-bundle contract:
 *
 * - Node half: `lib/index.js` + `lib/invariant.js` (ESM, zero runtime
 *   imports) — the Loader imports the plugin body from here.
 * - Browser half: `lib/client.js` — a CJS closure handed to
 *   `window.__ModuleLoader__.load({ id, factory })`; every shared platform
 *   module stays external (the host shell's module table answers those
 *   requires), and CSS Modules are inlined by lightningcss into a
 *   plugin-owned <style> tag.
 *
 * The host version of every external is what actually runs, so no harness
 * package is ever bundled into this artifact.
 */
import { readFile } from 'node:fs/promises'
import { existsSync } from 'node:fs'
import { dirname, resolve, sep } from 'node:path'
import { transform } from 'lightningcss'
import type { UserConfig } from 'tsdown'

/** Shared browser platform modules seeded by the host shell's module table. */
export const PLATFORM_MODULES = [
  'react', 'react/jsx-runtime', 'react-dom', 'react-dom/client', '@deepseek-ai/cordis',
  '@deepseek-ai/dsh-client-ui-slots',
  '@deepseek-ai/dsh-client-web-react',
  '@deepseek-ai/dsh-client-ui-primitives',
  '@deepseek-ai/dsh-client-ui-attachment',
  '@deepseek-ai/dsh-client-schema-form',
] as const

/** Documented harness exemption: the snapshot-store engine rides the runtime/client module. */
const RUNTIME_STORE_EXEMPTION = '@deepseek-ai/dsh-client-runtime/client'

/** Externals resolved from the host loader module table. */
export const CLIENT_EXTERNALS: readonly string[] = [...PLATFORM_MODULES, RUNTIME_STORE_EXEMPTION]

const CSS_VIRTUAL_PREFIX = '\0dsh-css:'
const CSS_VIRTUAL_SUFFIX = '.mjs'

/** Resolve a CSS asset referenced from an emitted JS file back to its source-tree file. */
function sourceAssetPath(source: string, importer: string): string {
  const emitted = resolve(dirname(importer), source)
  if (existsSync(emitted)) return emitted
  const marker = `${sep}lib${sep}types${sep}`
  const boundary = emitted.indexOf(marker)
  if (boundary < 0) return emitted
  return resolve(emitted.slice(0, boundary), 'src', emitted.slice(boundary + marker.length))
}

const lib: UserConfig = {
  name: '@falser101/mascot',
  entry: ['lib/types/index.js', 'lib/types/invariant.js'],
  outDir: 'lib',
  format: ['esm'],
  platform: 'node',
  target: 'es2024',
  fixedExtension: false,
  dts: false,
  clean: false,
}

const client: UserConfig = {
  name: '@falser101/mascot/client',
  entry: { client: 'lib/types/client/index.js' },
  outDir: 'lib',
  format: 'cjs',
  platform: 'browser',
  dts: false,
  sourcemap: true,
  clean: false,
  external: [...CLIENT_EXTERNALS],
  define: {
    'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV ?? 'production'),
    'import.meta.env.MODE': JSON.stringify(process.env.NODE_ENV ?? 'production'),
    'import.meta.env': JSON.stringify({ MODE: process.env.NODE_ENV ?? 'production' }),
  },
  noExternal: (id: string) => (CLIENT_EXTERNALS.includes(id) ? undefined : true),
  plugins: [{
    name: 'dsh-css-modules-inline',
    resolveId(source: string, importer: string | undefined) {
      if (!source.endsWith('.module.css')) return null
      const abs = importer !== undefined ? sourceAssetPath(source, importer) : source
      return CSS_VIRTUAL_PREFIX + abs + CSS_VIRTUAL_SUFFIX
    },
    async load(virtualId: string) {
      if (!virtualId.startsWith(CSS_VIRTUAL_PREFIX)) return null
      const fileId = virtualId.slice(CSS_VIRTUAL_PREFIX.length, -CSS_VIRTUAL_SUFFIX.length)
      this.addWatchFile(fileId)
      const source = await readFile(fileId)
      const { code, exports: cssExports } = transform({
        filename: fileId,
        code: source,
        cssModules: { pattern: '[hash]_[local]' },
        minify: true,
      })
      const classMap: Record<string, string> = {}
      for (const [local, exp] of Object.entries(cssExports ?? {})) classMap[local] = exp.name
      const tagId = `@falser101/mascot/${fileId.split(sep).pop()}`
      return [
        `const css = ${JSON.stringify(code.toString())};`,
        `const tagId = ${JSON.stringify(tagId)};`,
        'if (typeof document !== \'undefined\' && document.querySelector(\'style[data-plugin-css=\' + JSON.stringify(tagId) + \']\') === null) {',
        '  const tag = document.createElement(\'style\');',
        '  tag.dataset.plugin = \'@falser101/mascot\';',
        '  tag.dataset.pluginCss = tagId;',
        '  tag.textContent = css;',
        '  document.head.appendChild(tag);',
        '}',
        `export default ${JSON.stringify(classMap)};`,
      ].join('\n')
    },
  }],
  outputOptions: {
    entryFileNames: 'client.js',
    banner: 'window.__ModuleLoader__.load({ id: \'@falser101/mascot\', factory: (require) => {',
    footer: 'return module.exports; } });',
    intro: 'var module = { exports: {} }; var exports = module.exports;',
  },
}

export default [lib, client]
