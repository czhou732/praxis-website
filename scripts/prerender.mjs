/**
 * Inject statically rendered markup into each built HTML shell.
 *
 * Runs after `vite build` and `vite build --ssr`. Without this the deployed
 * pages are an empty <div id="root"></div>, which means a JS failure, a blocked
 * CDN, or a crawler that does not execute scripts sees a blank page.
 */
import { readFile, writeFile, rm } from 'node:fs/promises'
import { existsSync } from 'node:fs'
import { resolve, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'
import { createElement } from 'react'
import { renderToStaticMarkup } from 'react-dom/server'

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..')
const ssrEntry = resolve(root, 'dist-ssr/prerender-entry.js')

if (!existsSync(ssrEntry)) {
  console.error(`prerender: missing SSR bundle at ${ssrEntry}`)
  process.exit(1)
}

const { ROUTES } = await import(ssrEntry)

let injected = 0
for (const [route, Component] of Object.entries(ROUTES)) {
  const file = resolve(root, 'dist', route)
  if (!existsSync(file)) {
    console.error(`prerender: built shell missing for ${route}`)
    process.exit(1)
  }

  const html = await readFile(file, 'utf8')
  const markup = renderToStaticMarkup(createElement(Component))

  if (!html.includes('<div id="root"></div>')) {
    console.error(`prerender: no empty #root found in ${route}`)
    process.exit(1)
  }

  await writeFile(file, html.replace('<div id="root"></div>', `<div id="root">${markup}</div>`))
  console.log(`prerender: ${route} (+${markup.length.toLocaleString()} chars)`)
  injected++
}

await rm(resolve(root, 'dist-ssr'), { recursive: true, force: true })
console.log(`prerender: injected ${injected} page(s)`)
