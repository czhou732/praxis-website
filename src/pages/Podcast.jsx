import { Layout } from '../components/Layout'
import { Band, Button, Eyebrow, Pill, Reveal, SectionHead } from '../components/ui'
import { SITE } from '../data/site'
import { EPISODES, SHOW, UPCOMING_EPISODES } from '../data/podcast'

/* ---------- episode card ---------- */

/** The same black-and-white card treatment from Events, reused here as the
 *  primary episode display. PΨ badge, serif title, ink play button. */
function EpisodeCard({ ep, large }) {
  const handlePointerMove = (e) => {
    const rect = e.currentTarget.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top
    e.currentTarget.style.setProperty('--mouse-x', `${x}px`)
    e.currentTarget.style.setProperty('--mouse-y', `${y}px`)
  }
  const handlePointerLeave = (e) => {
    e.currentTarget.style.setProperty('--mouse-x', `-999px`)
    e.currentTarget.style.setProperty('--mouse-y', `-999px`)
  }

  return (
    <a
      href={ep.spotify}
      target="_blank"
      rel="noopener"
      onPointerMove={handlePointerMove}
      onPointerLeave={handlePointerLeave}
      className={`group relative flex items-center gap-4 rounded-xl border border-ink/13 bg-surface p-4 text-inherit no-underline transition-colors hover:border-cool/60 overflow-hidden ${large ? 'max-w-[46rem]' : 'max-w-[36rem]'}`}
    >
      {/* Impeccable Spotlight Glow */}
      <div
        className="pointer-events-none absolute inset-0 z-0 opacity-0 mix-blend-screen transition-opacity duration-500 group-hover:opacity-100"
        style={{
          background: 'radial-gradient(400px circle at var(--mouse-x, -999px) var(--mouse-y, -999px), rgba(110, 155, 255, 0.15), transparent 40%)'
        }}
      />
      <div
        aria-hidden="true"
        className={`relative z-10 flex flex-none items-center justify-center rounded-lg border border-ink/13 bg-ground font-serif text-ink transition-colors overflow-hidden group-hover:border-cool/40 group-hover:text-cool ${large ? 'h-16 w-16 text-[1.6rem]' : 'h-14 w-14 text-[1.4rem]'}`}
      >
        {/* PΨ Text */}
        <span className="absolute inset-0 flex items-center justify-center transition-all duration-400 group-hover:scale-75 group-hover:opacity-0">
          PΨ
        </span>
        {/* Equalizer (Hidden until hover) */}
        <div className="absolute inset-0 flex items-center justify-center gap-[3px] opacity-0 scale-125 transition-all duration-400 group-hover:scale-100 group-hover:opacity-100">
          <div className="w-[3px] rounded-full bg-cool animate-eq-1" />
          <div className="w-[3px] rounded-full bg-cool animate-eq-2" />
          <div className="w-[3px] rounded-full bg-cool animate-eq-3" />
          <div className="w-[3px] rounded-full bg-cool animate-eq-4" />
        </div>
      </div>
      <span className="relative z-10 min-w-0 flex-1">
        <span className="block font-mono text-[0.62rem] uppercase tracking-[0.13em] text-muted">
          Ep. {ep.ep} · PRAXIS
        </span>
        <span className={`mt-1 block truncate font-serif leading-tight text-ink transition-colors group-hover:text-cool ${large ? 'text-[1.15rem]' : 'text-[1.02rem]'}`}>
          {ep.title}
        </span>
      </span>
      <span
        aria-hidden="true"
        className={`relative z-10 flex flex-none items-center justify-center rounded-full bg-ink text-ground transition-all duration-300 group-hover:scale-110 group-hover:bg-cool group-hover:shadow-[0_0_15px_rgba(110,155,255,0.4)] ${large ? 'h-12 w-12' : 'h-11 w-11'}`}
      >
        <svg width="14" height="14" viewBox="0 0 14 14" fill="currentColor">
          <path d="M2 1 L12 7 L2 13 Z" />
        </svg>
      </span>
      <span className="sr-only">Listen on Spotify</span>
    </a>
  )
}

/* ---------- page ---------- */

export default function Podcast() {
  const latest = EPISODES[0]

  return (
    <Layout current="/podcast/">
      {/* hero */}
      <header className="mx-auto w-full max-w-[74rem] border-b border-ink/6 px-[clamp(1.25rem,5vw,4rem)] pt-[clamp(3rem,9vw,5.5rem)] pb-[clamp(2rem,5vw,3rem)]">
        <Eyebrow>Listen</Eyebrow>
        <h1 className="mt-5 max-w-[18ch] font-serif text-[clamp(2.3rem,5.5vw,3.8rem)] leading-[1.02] tracking-[-0.025em]">
          {SHOW.name}
        </h1>
        <p className="measure mt-6 text-[1.15rem] leading-[1.6] text-ink-2">
          {SHOW.tagline}
        </p>
        <div className="mt-5 flex flex-wrap items-baseline gap-x-6 gap-y-2">
          <a
            href={SHOW.showUrl}
            target="_blank"
            rel="noopener"
            className="border-b border-cool/40 pb-0.5 font-mono text-[0.72rem] uppercase tracking-[0.1em] text-cool no-underline transition-colors hover:border-cool"
          >
            Listen on Spotify ↗
          </a>
          <span className="font-mono text-[0.62rem] uppercase tracking-[0.12em] text-muted">
            Apple Podcasts · RSS · coming soon
          </span>
        </div>
      </header>

      {/* latest episode */}
      <Band first>
        <Reveal>
          <SectionHead num="01" title="Latest episode" id="latest" />
          <EpisodeCard ep={latest} large />
          <p className="mt-4 max-w-[62ch] text-[0.95rem] text-ink-2">
            {latest.description}
          </p>
          <div className="mt-3 flex flex-wrap items-baseline gap-x-5 gap-y-2 font-mono text-[0.68rem] uppercase tracking-[0.12em] text-muted">
            <span>{latest.date}</span>
            <span>Episode {latest.ep}</span>
          </div>
        </Reveal>
      </Band>

      {/* all episodes */}
      {EPISODES.length > 1 && (
        <Band>
          <Reveal>
            <SectionHead num="02" title="All episodes" id="episodes" />
            <div className="flex flex-col gap-4">
              {EPISODES.map((ep) => (
                <EpisodeCard key={ep.ep} ep={ep} />
              ))}
            </div>
          </Reveal>
        </Band>
      )}

      {/* coming soon — the pipeline */}
      <Band>
        <Reveal>
          <SectionHead
            num={EPISODES.length > 1 ? '03' : '02'}
            title="Coming soon"
            id="upcoming"
          />
          <p className="measure mb-8 text-[0.95rem] text-ink-2">
            Every talk in the Fall 2026 speaker series is recorded and published as an episode.
            Here is what is landing next.
          </p>
          <div className="flex flex-col">
            {UPCOMING_EPISODES.map((u) => (
              <article
                key={u.date}
                className="grid grid-cols-[4rem_1fr] items-baseline gap-5 border-t border-ink/6 py-5 first:border-t-0 first:pt-0"
              >
                <span className="font-mono text-[0.72rem] uppercase tracking-[0.12em] text-cool">
                  {u.date}
                </span>
                <div>
                  <p className="m-0 font-serif text-[1.15rem] leading-[1.2] tracking-[-0.012em]">
                    {u.name}
                  </p>
                  <p className="m-0 mt-1 text-[0.85rem] text-muted">{u.topic}</p>
                </div>
              </article>
            ))}
          </div>
          <p className="mt-6 font-mono text-[0.62rem] uppercase tracking-[0.12em] text-muted">
            Dates are speaker series sessions. Episodes publish within one week of each talk.
          </p>
        </Reveal>
      </Band>

      {/* host */}
      <Band>
        <Reveal>
          <SectionHead
            num={EPISODES.length > 1 ? '04' : '03'}
            title="Host"
            id="host"
          />
          <a
            href={SHOW.host.href}
            target="_blank"
            rel="noopener"
            className="group flex items-baseline justify-between gap-6 text-inherit no-underline"
          >
            <span className="font-serif text-[1.35rem] tracking-[-0.012em] transition-colors group-hover:text-cool">
              {SHOW.host.name}
            </span>
            <span className="font-mono text-[0.72rem] uppercase tracking-[0.12em] text-muted">
              {SHOW.host.role} <span aria-hidden="true">↗</span>
            </span>
          </a>
          <p className="mt-4 max-w-[56ch] text-[0.95rem] leading-[1.6] text-ink-2">
            {SHOW.host.bio}
          </p>
        </Reveal>
      </Band>

      {/* subscribe CTA */}
      <Band>
        <Reveal>
          <SectionHead
            num={EPISODES.length > 1 ? '05' : '04'}
            title="Subscribe"
            id="subscribe"
          />
          <div className="relative rounded-sm border border-ink/13 border-l-2 border-l-cool bg-surface p-8">
            <p className="measure">
              New episodes drop after every speaker series session. Follow on Spotify to get
              notified, or check back here.
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <Button href={SHOW.showUrl} target="_blank" rel="noopener">
                Follow on Spotify
              </Button>
              <Button href="/events/" variant="ghost">
                See the speaker series
              </Button>
            </div>
          </div>
        </Reveal>
      </Band>
    </Layout>
  )
}
