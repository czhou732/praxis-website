import { useEffect, useState } from 'react'
import { Layout } from '../components/Layout'
import { Band, Button, Eyebrow, Pill, Reveal, SectionHead } from '../components/ui'
import { SPEAKERS } from '../data/speakers'
import { FOLLOW_URL, SITE } from '../data/site'

/* ---------- next-talk readout ----------
   The countdown is computed only after hydration — the prerendered markup
   carries a neutral placeholder so a static build never shows a stale number. */

const DAY_MS = 24 * 60 * 60 * 1000

function nextTalkState(now) {
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate())
  const upcoming = SPEAKERS.find((s) => new Date(s.iso + 'T00:00:00') >= today)
  if (!upcoming) return { kind: 'concluded' }
  const target = new Date(upcoming.iso + 'T00:00:00')
  const days = Math.round((target - today) / DAY_MS)
  return { kind: 'upcoming', slot: upcoming, days }
}

function NextTalk() {
  /* null until mounted: SSR and first client render both show the placeholder */
  const [state, setState] = useState(null)
  useEffect(() => {
    setState(nextTalkState(new Date()))
  }, [])

  return (
    <div className="mt-8 flex flex-wrap items-baseline gap-x-4 gap-y-2 border border-ink/13 border-l-2 border-l-cool bg-surface px-5 py-4">
      <span className="font-mono text-[0.7rem] uppercase tracking-[0.13em] text-cool">Next session</span>
      {!state ? (
        <span className="font-mono text-[0.85rem] text-muted">Fall 2026 · Sep 10 – Dec 3</span>
      ) : state.kind === 'concluded' ? (
        <span className="font-mono text-[0.85rem] text-ink-2">
          The Fall 2026 series has concluded. A new series is announced by email.
        </span>
      ) : (
        <>
          <span className="tnum font-serif text-[1.35rem] leading-none tracking-[-0.01em]">
            {state.days === 0 ? 'Today' : state.days === 1 ? 'Tomorrow' : `In ${state.days} days`}
          </span>
          <span className="font-mono text-[0.85rem] text-ink-2">
            {state.slot.date} · {state.slot.time} ·{' '}
            {state.slot.status === 'confirmed' ? state.slot.name : 'Speaker to be announced'}
          </span>
          {state.slot.rsvp && (
            <a
              href={state.slot.rsvp}
              target="_blank"
              rel="noopener"
              className="border-b border-cool/40 pb-0.5 font-mono text-[0.72rem] uppercase tracking-[0.1em] text-cool no-underline transition-colors hover:border-cool"
            >
              Reserve a seat ↗
            </a>
          )}
        </>
      )}
    </div>
  )
}

/* ---------- speaker deck ----------
   Seven slots, one card at a time, prev/next and arrow keys. A confirmed
   speaker gets a "signal signature": a waveform derived deterministically
   from their name — the identicon idea, drawn in this site's language. It is
   ornament, never labelled as data. Held dates stay nameless. */

function hashName(s) {
  let h = 2166136261
  for (let i = 0; i < s.length; i++) {
    h ^= s.charCodeAt(i)
    h = Math.imul(h, 16777619)
  }
  return h >>> 0
}

function signaturePoints(name, n = 48) {
  let seed = hashName(name)
  const pts = []
  for (let i = 0; i < n; i++) {
    seed = (Math.imul(seed, 1103515245) + 12345) >>> 0
    const x = (i / (n - 1)) * 600
    const y = 32 + Math.sin(i * 0.5 + (seed % 7)) * 10 + ((seed % 100) / 100 - 0.5) * 18
    pts.push(`${i ? 'L' : 'M'}${x.toFixed(1)} ${y.toFixed(1)}`)
  }
  return pts.join(' ')
}

/* An .ics for a confirmed talk. All-day VALUE=DATE: the held display strings
   ('Evening, time TBC') can't be parsed into an honest start time. */
function icsHref(slot) {
  const day = slot.iso.replaceAll('-', '')
  const next = new Date(new Date(slot.iso + 'T00:00:00').getTime() + DAY_MS)
  const p = (n) => String(n).padStart(2, '0')
  const end = `${next.getFullYear()}${p(next.getMonth() + 1)}${p(next.getDate())}`
  const ics = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//PRAXIS//Speaker Series//EN',
    'BEGIN:VEVENT',
    `UID:praxis-${day}@uscpraxis.org`,
    `DTSTAMP:${day}T000000Z`,
    `DTSTART;VALUE=DATE:${day}`,
    `DTEND;VALUE=DATE:${end}`,
    `SUMMARY:PRAXIS Speaker Series — ${slot.name}: ${slot.topic}`,
    `DESCRIPTION:${slot.date} · ${slot.time} · ${slot.mode}`,
    `LOCATION:${slot.mode}`,
    'END:VEVENT',
    'END:VCALENDAR'
  ].join('\r\n')
  return `data:text/calendar;charset=utf-8,${encodeURIComponent(ics)}`
}

function Deck() {
  /* SSR renders slot 0; after hydration the deck snaps to the next upcoming
     session, so a static build never claims a stale "next". */
  const [i, setI] = useState(0)
  useEffect(() => {
    const state = nextTalkState(new Date())
    if (state.kind === 'upcoming') {
      const idx = SPEAKERS.indexOf(state.slot)
      if (idx > 0) setI(idx)
    }
  }, [])
  useEffect(() => {
    const onKey = (e) => {
      if (e.key === 'ArrowLeft') setI((v) => (v + SPEAKERS.length - 1) % SPEAKERS.length)
      if (e.key === 'ArrowRight') setI((v) => (v + 1) % SPEAKERS.length)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [])

  const slot = SPEAKERS[i]
  const confirmed = slot.status === 'confirmed'

  return (
    <div>
      <div className="border border-ink/13 bg-surface">
        <div className="flex items-baseline justify-between border-b border-ink/6 px-6 py-3 font-mono text-[0.64rem] uppercase tracking-[0.14em] text-muted">
          <span>Fall 2026 · {slot.date}</span>
          <span className="tnum">
            {i + 1} / {SPEAKERS.length}
          </span>
        </div>
        <div className="px-6 py-7">
          {confirmed ? (
            <svg
              className="mb-6 block h-16 w-full"
              viewBox="0 0 600 64"
              preserveAspectRatio="none"
              aria-hidden="true"
            >
              <path
                d={signaturePoints(slot.name)}
                fill="none"
                stroke="var(--color-cool)"
                strokeWidth="1.4"
                opacity="0.8"
              />
            </svg>
          ) : (
            <svg className="mb-6 block h-16 w-full" viewBox="0 0 600 64" aria-hidden="true">
              <path
                d="M0 32 H600"
                stroke="currentColor"
                className="text-ink/13"
                strokeWidth="1"
                strokeDasharray="3 5"
              />
            </svg>
          )}
          <Pill tone={confirmed ? 'ok' : 'wait'}>{confirmed ? 'Confirmed' : 'Invited · held date'}</Pill>
          <p
            className={
              confirmed
                ? 'mt-4 mb-1 font-serif text-[1.6rem] leading-[1.2] tracking-[-0.012em]'
                : 'mt-4 mb-1 font-serif text-[1.6rem] leading-[1.2] tracking-[-0.012em] text-muted italic'
            }
          >
            {confirmed ? slot.name : 'Speaker to be announced'}
          </p>
          <p className="m-0 text-[0.95rem] text-ink-2">
            {confirmed ? slot.topic : 'Name and topic publish on confirmation.'}
          </p>
          {confirmed && slot.bio && (
            <p className="m-0 mt-3 max-w-[56ch] text-[0.85rem] leading-[1.6] text-muted">
              {slot.bio}
            </p>
          )}
          <div className="mt-6 flex flex-wrap items-baseline gap-x-5 gap-y-2 border-t border-ink/6 pt-4 font-mono text-[0.68rem] uppercase tracking-[0.1em] text-muted">
            <span>{slot.date}</span>
            <span>{slot.time}</span>
            <span>{slot.mode}</span>
            {confirmed && slot.rsvp && (
              <a
                href={slot.rsvp}
                target="_blank"
                rel="noopener"
                className="border-b border-cool/40 pb-0.5 text-cool no-underline transition-colors hover:border-cool"
              >
                Reserve a seat ↗
              </a>
            )}
            {confirmed && (
              <a
                href={icsHref(slot)}
                download={`praxis-${slot.iso}.ics`}
                className="border-b border-cool/40 pb-0.5 text-cool no-underline transition-colors hover:border-cool"
              >
                Add to calendar ↓
              </a>
            )}
          </div>
        </div>
        <div className="flex items-center justify-between border-t border-ink/6 px-6 py-3.5">
          <button
            type="button"
            onClick={() => setI((v) => (v + SPEAKERS.length - 1) % SPEAKERS.length)}
            className="cursor-pointer rounded-sm border border-ink/13 bg-transparent px-4 py-1.5 font-mono text-[0.66rem] uppercase tracking-[0.12em] text-ink-2 transition-colors hover:border-cool hover:text-cool"
          >
            ‹ Prev
          </button>
          <div className="flex gap-1.5" aria-hidden="true">
            {SPEAKERS.map((_, d) => (
              <span key={d} className={d === i ? 'h-[2px] w-3.5 bg-cool' : 'h-[2px] w-3.5 bg-ink/13'} />
            ))}
          </div>
          <button
            type="button"
            onClick={() => setI((v) => (v + 1) % SPEAKERS.length)}
            className="cursor-pointer rounded-sm border border-ink/13 bg-transparent px-4 py-1.5 font-mono text-[0.66rem] uppercase tracking-[0.12em] text-ink-2 transition-colors hover:border-cool hover:text-cool"
          >
            Next ›
          </button>
        </div>
      </div>
      <p className="mt-4 font-mono text-[0.62rem] uppercase tracking-[0.12em] text-muted">
        Arrow keys work too. The waveform above a confirmed name is a signature derived from the
        name — ornament, not data.
      </p>
    </div>
  )
}

export default function Speakers() {
  return (
    <Layout current="/speakers/">
      <header className="mx-auto w-full max-w-[74rem] border-b border-ink/6 px-[clamp(1.25rem,5vw,4rem)] pt-[clamp(3rem,9vw,5.5rem)] pb-[clamp(2rem,5vw,3rem)]">
        <Eyebrow>Fall 2026</Eyebrow>
        <h1 className="mt-5 max-w-[18ch] font-serif text-[clamp(2.3rem,5.5vw,3.8rem)] leading-[1.02] tracking-[-0.025em]">
          Speaker Series
        </h1>
        <p className="measure mt-6 text-[1.15rem] leading-[1.6] text-ink-2">
          Seven talks across the fall, September through December. Times and format vary
          by speaker; each session below carries its own date, time, and mode. Seats and
          RSVPs are managed on{' '}
          <a
            href={FOLLOW_URL}
            target="_blank"
            rel="noopener"
            className="text-ink underline decoration-cool/40 underline-offset-4 hover:decoration-cool"
          >
            Luma
          </a>
          .
        </p>
        <div className="mt-4 flex flex-wrap gap-x-6 gap-y-2">
          <a
            href="/praxis-fall-2026-series.ics"
            className="border-b border-cool/40 pb-0.5 font-mono text-[0.72rem] uppercase tracking-[0.1em] text-cool no-underline transition-colors hover:border-cool"
          >
            Subscribe to the series ↓
          </a>
          <span className="font-mono text-[0.62rem] uppercase tracking-[0.12em] text-muted">
            Live feed — sessions update on every site rebuild.
          </span>
        </div>
        <NextTalk />
      </header>

      <Band first>
        <Reveal>
          <SectionHead num="01" title="Schedule" id="schedule" />
          <Deck />
          <p className="measure mt-8 text-[0.9rem] text-muted">
            Confirmed talks are listed with speaker and topic. Slots marked{' '}
            <Pill tone="wait">Invited</Pill> have a held date and a pending invitation; names and
            topics are published once the speaker confirms. Sessions already held move to the{' '}
            <a href="/events/" className="text-ink-2 underline decoration-cool/40 underline-offset-4 hover:decoration-cool">past-events record</a>.
          </p>
        </Reveal>
      </Band>

      <Band>
        <Reveal>
          <SectionHead num="02" title="Reserve a seat" />
          <p className="measure mb-8 text-[0.95rem] text-ink-2">
            Seats and RSVPs are managed on Luma. Register for any session below — or follow the
            calendar to be notified when new sessions are posted.
          </p>
          <div className="overflow-hidden rounded-sm border border-ink/13">
            <iframe
              src="https://lu.ma/embed/calendar/cal-3Ng1i4OSXczOw4O/events"
              title="PRAXIS events on Luma"
              className="block h-[32rem] w-full border-0 bg-surface"
              loading="lazy"
              allow="fullscreen; payment"
            />
          </div>
          <p className="mt-4 font-mono text-[0.62rem] uppercase tracking-[0.12em] text-muted">
            Registration handled by Luma ·{' '}
            <a
              href={FOLLOW_URL}
              target="_blank"
              rel="noopener"
              className="text-ink-2 underline decoration-cool/40 underline-offset-4 hover:decoration-cool"
            >
              luma.com/praxiscompsych ↗
            </a>
          </p>
        </Reveal>
      </Band>

      <Band>
        <Reveal>
          <SectionHead num="03" title="Interested in speaking?" />
          <div className="relative rounded-sm border border-ink/13 border-l-2 border-l-cool bg-surface p-8">
            <p className="measure">
              If you apply computational methods to psychiatric questions — modeling, imaging,
              digital phenotyping, or clinical machine learning — we would like to host you. Talks
              run 45 minutes plus discussion, in person or over Zoom.
            </p>
            <div className="mt-6">
              <Button href={`mailto:${SITE.contact}?subject=PRAXIS%20Speaker%20Series`}>
                Get in touch
              </Button>
            </div>
          </div>
        </Reveal>
      </Band>
    </Layout>
  )
}
