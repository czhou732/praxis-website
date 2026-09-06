import { useEffect } from 'react'
import { Layout } from '../components/Layout'

/* /speakers/ moved to /events/ — the series and the record are one page now.
   This shell stays so old links, QR codes, and bookmarks land somewhere honest:
   a message with the new address, then an automatic hop. Kept as a full
   prerendered route (nav + footer) so the build contract still holds. */

export default function Speakers() {
  useEffect(() => {
    const t = setTimeout(() => window.location.replace('/events/#series'), 1600)
    return () => clearTimeout(t)
  }, [])

  return (
    <Layout current="/events/">
      <header className="mx-auto w-full max-w-[74rem] px-[clamp(1.25rem,5vw,4rem)] pt-[clamp(4rem,12vw,7rem)] pb-[clamp(4rem,12vw,7rem)]">
        <p className="font-mono text-[0.7rem] uppercase tracking-[0.13em] text-cool">Moved</p>
        <h1 className="mt-5 max-w-[20ch] font-serif text-[clamp(2rem,5vw,3.2rem)] leading-[1.05] tracking-[-0.025em]">
          The speaker series now lives with the events record.
        </h1>
        <p className="measure mt-6 text-[1.1rem] leading-[1.6] text-ink-2">
          Upcoming sessions, RSVPs, and the past-events record are one page now. Taking you
          there in a moment — or{' '}
          <a
            href="/events/"
            className="text-ink underline decoration-cool/40 underline-offset-4 hover:decoration-cool"
          >
            go directly
          </a>
          .
        </p>
        <p className="mt-6 font-mono text-[0.72rem] uppercase tracking-[0.12em] text-muted">
          /speakers/ → /events/
        </p>
      </header>
    </Layout>
  )
}