/**
 * Live smoke test for the deployed site.
 *
 * Covers the two ways this site has actually broken:
 *   - a build that shipped without all of its pages (routes 404)
 *   - a nameserver change that stopped the domain resolving at all
 *
 * Run after every deploy and on a schedule. Exits non-zero on any failure so
 * GitHub Actions surfaces it instead of the breakage sitting unnoticed.
 *
 *   node scripts/smoke.mjs [origin]
 */
import { lookup, resolveNs } from 'node:dns/promises'

const origin = (process.argv[2] || 'https://uscpraxis.org').replace(/\/$/, '')
const host = new URL(origin).hostname

const ROUTES = ['/', '/research/', '/speakers/', '/syllabus/']
const MUST_CONTAIN = 'PRAXIS'
const GITHUB_PAGES_IPS = ['185.199.108.153', '185.199.109.153', '185.199.110.153', '185.199.111.153']

const results = []
const record = (ok, label, detail = '') => {
  results.push({ ok, label, detail })
  console.log(`${ok ? '  ok  ' : ' FAIL '} ${label}${detail ? ` — ${detail}` : ''}`)
}

const isLocal = ['localhost', '127.0.0.1', '::1'].includes(host)

console.log(`\nsmoke: ${origin}${isLocal ? '  (local — DNS and TLS checks skipped)' : ''}\n`)

/* ---- DNS ---- */
if (!isLocal) {
  try {
    const ips = (await lookup(host, { all: true })).map((a) => a.address)
    const pointsAtPages = ips.some((ip) => GITHUB_PAGES_IPS.includes(ip))
    record(pointsAtPages, 'DNS resolves to GitHub Pages', ips.join(', ') || 'no addresses')
  } catch (err) {
    record(false, 'DNS resolves', err.code || String(err))
  }

  try {
    const ns = await resolveNs(host)
    record(ns.length > 0, 'nameservers present', ns.join(', '))
  } catch (err) {
    record(false, 'nameservers present', err.code || String(err))
  }
}

/* ---- routes ---- */
for (const route of ROUTES) {
  try {
    const res = await fetch(`${origin}${route}`, { redirect: 'follow' })
    const body = await res.text()
    const hasContent = body.includes(MUST_CONTAIN)
    // Prerendered markup means real content ships even without JavaScript.
    const prerendered = /<div id="root">\s*<(?!\/)/.test(body)
    record(
      res.status === 200 && hasContent && prerendered,
      `GET ${route}`,
      `${res.status}${hasContent ? '' : ', missing content'}${prerendered ? '' : ', not prerendered'}`
    )
  } catch (err) {
    record(false, `GET ${route}`, err.cause?.code || err.message)
  }
}

/* ---- 404 behaviour ---- */
try {
  const res = await fetch(`${origin}/__does_not_exist__/`)
  record(res.status === 404, 'unknown path returns 404', String(res.status))
} catch (err) {
  record(false, 'unknown path returns 404', err.cause?.code || err.message)
}

/* ---- https ---- */
if (!isLocal) {
  try {
    const res = await fetch(`http://${host}/`, { redirect: 'manual' })
    const location = res.headers.get('location') || ''
    record(res.status >= 300 && res.status < 400 && location.startsWith('https://'),
      'http redirects to https', `${res.status} → ${location || 'no location'}`)
  } catch (err) {
    record(false, 'http redirects to https', err.cause?.code || err.message)
  }
}

const failed = results.filter((r) => !r.ok)
console.log(`\nsmoke: ${results.length - failed.length}/${results.length} passed`)
if (failed.length) {
  console.error(`\nsmoke: FAILED — ${failed.map((f) => f.label).join('; ')}\n`)
  process.exit(1)
}
console.log('smoke: site healthy\n')
