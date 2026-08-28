import { Layout } from '../components/Layout'
import { Band, Card, CardGrid, Eyebrow, Reveal, SectionHead } from '../components/ui'
import { CONFERENCES, PROJECTS, REPOS } from '../data/site'

/* Projects drawn as a pipeline track — idea → analysis → preprint → review →
   published — with the current stage marked. Honest about where things stand,
   and it shows movement between visits. Stage comes from site.js. */
const STAGES = ['Idea', 'Analysis', 'Preprint', 'Review', 'Published']

function Track({ stage, status }) {
  return (
    <div className="flex flex-wrap items-center gap-y-2">
      {STAGES.map((label, s) => (
        <span key={label} className="flex items-center">
          {s > 0 && <span aria-hidden="true" className="mx-2.5 h-px w-6 bg-ink/13" />}
          <span
            className={
              s === stage
                ? 'flex items-center gap-2 font-mono text-[0.66rem] uppercase tracking-[0.1em] text-cool'
                : s < stage
                  ? 'flex items-center gap-2 font-mono text-[0.66rem] uppercase tracking-[0.1em] text-ink-2'
                  : 'flex items-center gap-2 font-mono text-[0.66rem] uppercase tracking-[0.1em] text-muted/60'
            }
          >
            <span
              aria-hidden="true"
              className={
                s === stage
                  ? 'h-[7px] w-[7px] rounded-full bg-cool shadow-[0_0_0_4px_rgba(110,155,255,0.18)]'
                  : s < stage
                    ? 'h-[7px] w-[7px] rounded-full bg-cool/70'
                    : 'h-[7px] w-[7px] rounded-full border-[1.5px] border-ink/25'
              }
            />
            {label}
          </span>
        </span>
      ))}
      <span className="ml-4 font-mono text-[0.62rem] uppercase tracking-[0.1em] text-muted">
        {status}
      </span>
    </div>
  )
}

export default function Research () {
  return (
    <Layout current="/research/">
      <header className="mx-auto w-full max-w-[74rem] border-b border-ink/6 px-[clamp(1.25rem,5vw,4rem)] pt-[clamp(3rem,9vw,5.5rem)] pb-[clamp(2rem,5vw,3rem)]">
        <Eyebrow>Portfolio</Eyebrow>
        <h1 className="mt-5 max-w-[18ch] font-serif text-[clamp(2.3rem,5.5vw,3.8rem)] leading-[1.02] tracking-[-0.025em]">
          Research
        </h1>
        <p className="measure mt-6 text-[1.15rem] leading-[1.6] text-ink-2">
          PRAXIS is a research group first and an events organization second. These projects define
          the intellectual agenda. Members join an existing project or propose their own at the
          monthly pitch session.
        </p>
      </header>

      <Band first>
        {PROJECTS.map((p, i) => (
          <Reveal key={p.title} delay={i * 0.05}>
            <article className="mt-10 border-t border-ink/13 pt-7 first:mt-0">
              <div className="mb-3.5 flex flex-wrap items-baseline justify-between gap-4">
                <h2 className="m-0 font-serif text-[1.4rem] leading-[1.25] tracking-[-0.012em]">
                  {p.title}
                </h2>
                <Track stage={p.stage} status={p.status} />
              </div>
              <p className="measure text-ink-2">{p.body}</p>
              <div className="mt-5 flex flex-wrap gap-2">
                {p.tags.map((t) => (
                  <span
                    key={t}
                    className="rounded-sm border border-ink/13 px-2.5 py-1.5 font-mono text-[0.7rem] tracking-[0.06em] text-ink-2"
                  >
                    {t}
                  </span>
                ))}
              </div>
              {p.citation && (
                <p className="mt-5 max-w-[70ch] border-l-2 border-cool/50 pl-4 font-mono text-[0.75rem] leading-[1.7] text-muted">
                  {p.citation}
                </p>
              )}
              {p.links && (
                <div className="mt-4 flex flex-wrap gap-x-6 gap-y-2">
                  {p.links.map((l) => (
                    <a
                      key={l.href}
                      href={l.href}
                      target="_blank"
                      rel="noopener"
                      className="border-b border-cool/40 pb-0.5 font-mono text-[0.72rem] uppercase tracking-[0.1em] text-cool no-underline transition-colors hover:border-cool"
                    >
                      {l.label} ↗
                    </a>
                  ))}
                </div>
              )}
            </article>
          </Reveal>
        ))}
      </Band>

      <Band>
        <Reveal>
          <SectionHead num="02" title="Code" />
          <CardGrid cols={2}>
            {REPOS.map((r) => (
              <Card key={r.href} kicker={r.kicker} title={r.title} body={r.body} href={r.href} />
            ))}
          </CardGrid>
        </Reveal>
      </Band>

      <Band>
        <Reveal>
          <SectionHead num="03" title="Presentations" id="conferences" />
          <div className="flex flex-col lg:mx-[-5rem]">
            {CONFERENCES.map((e, i) => (
              <article
                key={e.title}
                className="border-t border-ink/13 py-12 first:border-t-0 first:pt-0"
              >
                <div className="flex flex-col gap-7 lg:flex-row lg:items-start lg:gap-12">
                  <div className="lg:w-[30rem] lg:shrink-0">
                    <div className="relative rounded-sm border border-ink/13 bg-surface w-full max-w-[20rem] aspect-[4/3] overflow-hidden flex items-center justify-center">
                      <img
                        src={e.photo}
                        alt={`${e.venue} — ${e.title}`}
                        className="max-h-full max-w-full object-contain rounded-sm"
                      />
                    </div>
                  </div>
                  <div className="lg:min-w-0">
                    <p className="m-0 font-mono text-[0.7rem] uppercase tracking-[0.14em]">
                      <span className="text-cool">{e.kind}</span>
                      <span className="text-muted"> · {e.date} · {e.venue}</span>
                    </p>
                    <h3 className="mt-2.5 mb-0 font-serif text-[1.35rem] leading-[1.2] tracking-[-0.012em]">
                      {e.title}
                    </h3>
                    <p className="mt-2 mb-0 text-[0.95rem] text-ink-2 max-w-[62ch]">{e.body}</p>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </Reveal>
      </Band>
    </Layout>
  )
}
