/**
 * Build-time contract for dist/.
 *
 * This exists because the site once shipped with only index.html: Vite's default
 * single-entry build silently dropped the other three pages, and every nav link
 * except Home 404'd in production for weeks. The build now fails loudly instead.
 *
 * Checks:
 *   1. every declared page is present in dist
 *   2. CNAME and 404.html survived the build, and CNAME still names the domain
 *   3. every internal link in every built page resolves to a real file
 *   4. every page carries prerendered markup, not an empty #root
 *   5. referenced local assets exist
 */
import { readFile, readdir } from 'node:fs/promises'
import { existsSync, statSync } from 'node:fs'
import { resolve, dirname, posix } from 'node:path'
import { fileURLToPath } from 'node:url'
import { PAGES } from '../vite.config.js'

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..')
const dist = resolve(root, 'dist')
const EXPECTED_DOMAIN = 'uscpraxis.org'
const MIN_PRERENDER = 1500

const errors = []
const fail = (msg) => errors.push(msg)

if (!existsSync(dist)) {
  console.error('verify: dist/ does not exist — did the build run?')
  process.exit(1)
}

/* 1. declared pages present */
const routes = Object.values(PAGES).map((p) => p.replace(/^\.\//, ''))
for (const route of routes) {
  if (!existsSync(resolve(dist, route))) fail(`missing page: dist/${route}`)
}

/* 2. Pages plumbing */
for (const required of ['CNAME', '404.html']) {
  if (!existsSync(resolve(dist, required))) fail(`missing required file: dist/${required}`)
}
if (existsSync(resolve(dist, 'CNAME'))) {
  const cname = (await readFile(resolve(dist, 'CNAME'), 'utf8')).trim()
  if (cname !== EXPECTED_DOMAIN) fail(`CNAME is "${cname}", expected "${EXPECTED_DOMAIN}"`)
}

/* collect every built html file */
async function htmlFiles (dir, acc = []) {
  for (const entry of await readdir(dir, { withFileTypes: true })) {
    const full = resolve(dir, entry.name)
    if (entry.isDirectory()) await htmlFiles(full, acc)
    else if (entry.name.endsWith('.html')) acc.push(full)
  }
  return acc
}

/** Resolve a site-absolute URL to the file GitHub Pages would serve. */
function resolveHref (href) {
  const clean = href.split(/[?#]/)[0]
  const candidates = clean.endsWith('/')
    ? [posix.join(clean, 'index.html')]
    : [clean, `${clean}.html`, posix.join(clean, 'index.html')]
  return candidates.some((c) => {
    const target = resolve(dist, `.${c}`)
    return existsSync(target) && statSync(target).isFile()
  })
}

for (const file of await htmlFiles(dist)) {
  const rel = file.slice(dist.length + 1)
  const html = await readFile(file, 'utf8')

  /* 3. internal links resolve */
  for (const match of html.matchAll(/(?:href|src)="([^"]+)"/g)) {
    const url = match[1]
    if (!url.startsWith('/') || url.startsWith('//')) continue
    if (!resolveHref(url)) fail(`${rel}: link "${url}" does not resolve to a built file`)
  }

  /* 4 + 5. only the declared app pages are prerendered; 404.html is standalone */
  if (routes.includes(rel)) {
    const OPEN = '<div id="root">'
    const start = html.indexOf(OPEN)
    const bodyEnd = html.lastIndexOf('</body>')
    const close = start === -1 ? -1 : html.lastIndexOf('</div>', bodyEnd)

    if (start === -1 || close <= start) {
      fail(`${rel}: could not find #root container`)
    } else {
      const inner = html.slice(start + OPEN.length, close)
      if (inner.length < MIN_PRERENDER) {
        fail(`${rel}: #root has only ${inner.length} chars of prerendered markup ` +
             `(expected >= ${MIN_PRERENDER}) — prerender likely failed`)
      }
    }
    if (!/<nav\b/.test(html)) fail(`${rel}: prerendered markup has no <nav>`)
    if (!/<footer\b/.test(html)) fail(`${rel}: prerendered markup has no <footer>`)
  }
}

if (errors.length) {
  console.error('\nverify: BUILD CONTRACT VIOLATED\n')
  errors.forEach((e) => console.error(`  ✗ ${e}`))
  console.error(`\n${errors.length} problem(s). Refusing to publish this build.\n`)
  process.exit(1)
}

console.log(`verify: ok — ${routes.length} pages, links resolved, prerender present, CNAME intact`)
