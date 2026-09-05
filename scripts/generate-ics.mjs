/**
 * Generate the whole-series ICS feed from src/data/speakers.js so the file
 * never drifts from the data source. Any session edited in speakers.js is
 * re-baked at build time; a stable URL (uscpraxis.org/praxis-fall-2026-series.ics)
 * means calendar apps treat it as a live subscription, not a one-off import.
 * Run as part of npm run build.
 */
import { writeFileSync } from 'node:fs'
import { SPEAKERS } from '../src/data/speakers.js'

const DAY_MS = 24 * 60 * 60 * 1000

const events = SPEAKERS.map((s) => {
  const start = s.iso.replaceAll('-', '')
  const next = new Date(new Date(s.iso + 'T00:00:00').getTime() + DAY_MS)
  const p = (n) => String(n).padStart(2, '0')
  const end = `${next.getFullYear()}${p(next.getMonth() + 1)}${p(next.getDate())}`

  const confirmed = s.status === 'confirmed'
  const summary = confirmed
    ? `PRAXIS — ${s.topic} (${s.name})`
    : `PRAXIS speaker session — speaker to be announced`
  const parts = [
    'BEGIN:VEVENT',
    `UID:praxis-${s.iso}@uscpraxis.org`,
    'DTSTAMP:20260901T000000Z',
    `DTSTART;VALUE=DATE:${start}`,
    `DTEND;VALUE=DATE:${end}`,
    `SUMMARY:${summary}`,
    `DESCRIPTION:${confirmed ? `${s.mode}. RSVP: ${s.rsvp}` : `${s.mode}. Details: https://uscpraxis.org/speakers/`}`
  ]
  if (confirmed && s.rsvp) parts.push(`URL:${s.rsvp}`)
  parts.push('END:VEVENT')
  return parts.join('\r\n')
})

const ics = [
  'BEGIN:VCALENDAR',
  'VERSION:2.0',
  'PRODID:-//PRAXIS//Speaker Series Fall 2026//EN',
  'X-WR-CALNAME:PRAXIS Speaker Series — Fall 2026',
  'CALSCALE:GREGORIAN',
  events.join('\r\n'),
  'END:VCALENDAR'
].join('\r\n')

writeFileSync(new URL('../public/praxis-fall-2026-series.ics', import.meta.url), ics + '\r\n')
console.log(`generate-ics: wrote ${SPEAKERS.length} events to public/praxis-fall-2026-series.ics`)