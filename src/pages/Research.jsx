import { Layout } from '../components/Layout'
import { Band, Card, CardGrid, Eyebrow, Pill, Reveal, SectionHead } from '../components/ui'
import { PROJECTS, REPOS } from '../data/site'

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
                <Pill tone="info">{p.status}</Pill>
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
    </Layout>
  )
}
