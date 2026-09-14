import { useEffect, useState } from 'react'
import { Layout } from '../components/Layout'
import { Band, Button, Eyebrow, Pill, Reveal, SectionHead } from '../components/ui'
import { SPEAKERS } from '../data/speakers'
import { EVENTS, JOURNAL_CLUB } from '../data/events'
import { FOLLOW_URL, SITE } from '../data/site'

/* One page, one timeline: the forward-looking speaker series first (countdown,
   deck, Luma RSVPs), then the record of what has already happened. The old
   /speakers/ page redirects here — nothing else links there anymore. */

/* ---------- next-talk readout ---------- */

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

/* ---------- speaker deck ---------- */

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

export default function Events() {
  return (
    <Layout current="/events/">
      <header className="mx-auto w-full max-w-[74rem] border-b border-ink/6 px-[clamp(1.25rem,5vw,4rem)] pt-[clamp(3rem,9vw,5.5rem)] pb-[clamp(2rem,5vw,3rem)]">
        <Eyebrow>Program</Eyebrow>
        <h1 className="mt-5 max-w-[18ch] font-serif text-[clamp(2.3rem,5.5vw,3.8rem)] leading-[1.02] tracking-[-0.025em]">
          Events
        </h1>
        <p className="measure mt-6 text-[1.15rem] leading-[1.6] text-ink-2">
          The Fall 2026 speaker series runs September through December — seven talks, times and
          format by session. Seats and RSVPs are managed on{' '}
          <a
            href={FOLLOW_URL}
            target="_blank"
            rel="noopener"
            className="text-ink underline decoration-cool/40 underline-offset-4 hover:decoration-cool"
          >
            Luma
          </a>
          ; sessions already held move to the record below.
        </p>
        <div className="mt-4 flex flex-wrap items-baseline gap-x-6 gap-y-2">
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
          <SectionHead num="01" title="Speaker series" id="series" />
          <Deck />
          <p className="measure mt-8 text-[0.9rem] text-muted">
            Confirmed talks are listed with speaker and topic. Slots marked{' '}
            <Pill tone="wait">Invited</Pill> have a held date and a pending invitation; names and
            topics are published once the speaker confirms. Sessions already held move to the{' '}
            <a href="#record" className="text-ink-2 underline decoration-cool/40 underline-offset-4 hover:decoration-cool">record below</a>.
          </p>
        </Reveal>
      </Band>

      <Band>
        <Reveal>
          <SectionHead num="02" title="Journal club" id="journal-club" />
          <p className="measure mb-8 text-[0.95rem] text-ink-2">
            Biweekly member sessions. Each meeting takes on a specific research question the
            ClinicalWhisper project is working through, backed by one paper the group reads in
            advance. The Sep 17 kickoff is open to everyone; subsequent sessions are member-only.
          </p>
          <div className="flex flex-col">
            {JOURNAL_CLUB.map((jc) => (
              <article key={jc.iso} className="border-t border-ink/13 py-8 first:border-t-0 first:pt-0">
                <div className="flex flex-wrap items-baseline gap-x-4 gap-y-1">
                  <span className="font-mono text-[0.7rem] uppercase tracking-[0.14em] text-cool">{jc.date}</span>
                  <span className="font-mono text-[0.7rem] uppercase tracking-[0.1em] text-muted">{jc.time} · {jc.mode}</span>
                  {jc.open
                    ? <Pill tone="ok">Open to all</Pill>
                    : <Pill tone="wait">Members · RSVP in Slack (👍)</Pill>}
                </div>
                {jc.status === 'confirmed' ? (
                  <>
                    <h3 className="mt-3 mb-1 font-serif text-[1.35rem] leading-[1.2] tracking-[-0.012em]">
                      {jc.title}
                    </h3>
                    <p className="mt-1 mb-0 max-w-[62ch] text-[0.95rem] text-ink-2">
                      <span className="font-mono text-[0.72rem] uppercase tracking-[0.1em] text-muted">Question · </span>
                      {jc.question}
                    </p>
                    <p className="mt-2 mb-0 max-w-[62ch] font-mono text-[0.72rem] uppercase tracking-[0.1em] text-muted">
                      Presenter · <span className="text-ink-2">{jc.presenter}</span>
                    </p>
                    {jc.open && jc.rsvp && (
                      <div className="mt-5">
                        <a
                          href={jc.rsvp}
                          target="_blank"
                          rel="noopener"
                          className="inline-block border border-cool/40 px-4 py-2 font-mono text-[0.72rem] uppercase tracking-[0.1em] text-cool no-underline transition-colors hover:border-cool"
                        >
                          Reserve a seat ↗
                        </a>
                      </div>
                    )}
                  </>
                ) : (
                  <p className="mt-3 mb-0 font-serif text-[1.2rem] leading-[1.2] tracking-[-0.012em] italic text-muted">
                    Research question · TBD
                  </p>
                )}
              </article>
            ))}
          </div>
          <p className="mt-8 font-mono text-[0.72rem] uppercase tracking-[0.1em] text-muted">
            Additional Fall '26 sessions are announced ahead of each meeting.
          </p>
        </Reveal>
      </Band>

      <Band>
        <Reveal>
          <SectionHead num="03" title="Reserve a seat" />
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
          <SectionHead num="04" title="Record" id="record" />
          <div className="flex flex-col">
            {EVENTS.map((e) => (
              <article key={e.title + e.date} className="border-t border-ink/13 py-9 first:border-t-0 first:pt-0">
                <p className="m-0 font-mono text-[0.7rem] uppercase tracking-[0.14em]">
                  <span className="text-cool">Held</span>
                  <span className="text-muted"> · {e.date} · {e.venue}</span>
                </p>
                <h3 className="mt-2.5 mb-0 font-serif text-[1.35rem] leading-[1.2] tracking-[-0.012em]">
                  {e.title}
                </h3>
                <p className="mt-2 mb-0 max-w-[62ch] text-[0.95rem] text-ink-2">{e.body}</p>
                {e.recording && (
                  <video
                    controls
                    preload="none"
                    src={e.recording}
                    className="mt-6 w-full max-w-[46rem] rounded-sm border border-ink/13 bg-black"
                  >
                    Your browser does not support embedded video —{' '}
                    <a href={e.recording} className="text-cool underline">download the recording</a>.
                  </video>
                )}
                {e.spotify && (
                  /* On-site card, not a Spotify iframe. The iframe brought its
                     own chrome that fought the site's aesthetic; a linked card
                     in the site's own grammar reads cleaner and clicks through
                     to Spotify for actual playback. */
                  <a
                    href={e.spotify}
                    target="_blank"
                    rel="noopener"
                    className="group mt-6 flex max-w-[36rem] items-center gap-4 border border-ink/13 bg-surface p-4 text-inherit no-underline transition-colors hover:border-cool/60"
                  >
                    <span
                      aria-hidden="true"
                      className="flex h-14 w-14 flex-none items-center justify-center border border-ink/13 bg-ground font-serif text-[1.4rem] text-ink"
                    >
                      PΨ
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="block font-mono text-[0.62rem] uppercase tracking-[0.13em] text-muted">
                        Podcast · PRAXIS
                      </span>
                      <span className="mt-1 block truncate font-serif text-[1.02rem] leading-tight text-ink">
                        {e.title}
                      </span>
                    </span>
                    <span className="flex-none font-mono text-[0.68rem] uppercase tracking-[0.1em] text-cool transition-colors group-hover:text-ink">
                      Listen ↗
                    </span>
                  </a>
                )}
              </article>
            ))}
          </div>
        </Reveal>
      </Band>

      <Band>
        <Reveal>
          <SectionHead num="05" title="Interested in speaking?" />
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
