import { Layout } from '../components/Layout'
import { Band, Eyebrow, Reveal, SectionHead } from '../components/ui'
import { EVENTS } from '../data/events'

/* The record of what PRAXIS has already done — talks and demos held, with a
   recording link where one exists. Distinct from Speakers, which is the
   forward-looking series; this page only fills in once an event has happened. */

export default function Events() {
  return (
    <Layout current="/events/">
      <header className="mx-auto w-full max-w-[74rem] border-b border-ink/6 px-[clamp(1.25rem,5vw,4rem)] pt-[clamp(3rem,9vw,5.5rem)] pb-[clamp(2rem,5vw,3rem)]">
        <Eyebrow>Record</Eyebrow>
        <h1 className="mt-5 max-w-[18ch] font-serif text-[clamp(2.3rem,5.5vw,3.8rem)] leading-[1.02] tracking-[-0.025em]">
          Past Events
        </h1>
        <p className="measure mt-6 text-[1.15rem] leading-[1.6] text-ink-2">
          Talks and demos already held. Where a session was recorded, the recording is
          linked. New sessions appear here after they happen; the forward-looking series
          lives under <a className="text-ink underline decoration-cool/40 underline-offset-4 hover:decoration-cool" href="/speakers/">Speakers</a>.
        </p>
      </header>

      <Band first>
        <Reveal>
          <SectionHead num="01" title="Sessions" />
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
              </article>
            ))}
          </div>
        </Reveal>
      </Band>
    </Layout>
  )
}