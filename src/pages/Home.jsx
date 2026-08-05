import { Layout } from '../components/Layout'
import { PsiField } from '../components/PsiField'
import { Band, Button, Card, CardGrid, Eyebrow, GridPattern, Reveal, SectionHead } from '../components/ui'
import { NORTH_STAR, PILLARS, REPOS, SITE, TEAM } from '../data/site'

export default function Home () {
  return (
    <Layout current="/">
      <section className="relative flex min-h-[min(86vh,780px)] items-center overflow-hidden border-b border-ink/6">
        <GridPattern />
        <PsiField />
        <div className="relative z-1 mx-auto w-full max-w-[74rem] px-[clamp(1.25rem,5vw,4rem)] py-[clamp(4rem,12vh,8rem)]">
          <Eyebrow>{SITE.expansion}</Eyebrow>
          <h1 className="mt-6 max-w-[17ch] font-serif text-[clamp(2.6rem,7vw,5.1rem)] leading-[1.02] tracking-[-0.025em]">
            From theory into tools that reach patients.
          </h1>
          <p className="measure mt-7 text-[1.15rem] leading-[1.6] text-ink-2">{SITE.mission}</p>
          <div className="mt-10 flex flex-wrap gap-3">
            <Button href="/speakers/">Fall 2026 Speaker Series</Button>
            <Button href="/research/" variant="ghost">Current Research</Button>
          </div>
        </div>
      </section>

      <Band>
        <Reveal>
          <SectionHead num="01" title="The north star" />
          <p className="measure mb-10 text-[1.15rem] leading-[1.6] text-ink-2">
            Four things we intend to be true within three years. Everything the group does is
            measured against them.
          </p>
          <ul className="list-none p-0">
            {NORTH_STAR.map((item, i) => (
              <li
                key={item}
                className="grid grid-cols-[2.6rem_1fr] items-start gap-4 border-t border-ink/6 py-5 first:border-ink/13"
              >
                <span className="pt-1.5 font-mono text-[0.72rem] text-cool">
                  {String(i + 1).padStart(2, '0')}
                </span>
                <p className="m-0 text-ink-2">{item}</p>
              </li>
            ))}
          </ul>
        </Reveal>
      </Band>

      <Band>
        <Reveal>
          <SectionHead num="02" title="A research group first" />
          <CardGrid cols={3}>
            {PILLARS.map((p) => (
              <Card key={p.title} kicker={p.kicker} title={p.title} body={p.body} />
            ))}
          </CardGrid>
        </Reveal>
      </Band>

      <Band>
        <Reveal>
          <SectionHead num="03" title="Open source" />
          <CardGrid cols={2}>
            {REPOS.map((r) => (
              <Card key={r.href} kicker={r.kicker} title={r.title} body={r.body} href={r.href} />
            ))}
          </CardGrid>
        </Reveal>
      </Band>

      <Band>
        <Reveal>
          <SectionHead num="04" title="Who runs it" />
          <div className="grid gap-8 [grid-template-columns:repeat(auto-fit,minmax(13rem,1fr))]">
            {TEAM.map((m) => (
              <a key={m.name} href={m.href} target="_blank" rel="noopener" className="group block text-inherit no-underline">
                {m.photo ? (
                  <img
                    src={m.photo}
                    alt={m.name}
                    width="462"
                    height="462"
                    className="aspect-square w-full max-w-[13rem] rounded-sm border border-ink/13 object-cover grayscale transition-[filter] duration-300 group-hover:grayscale-0"
                  />
                ) : (
                  <div
                    aria-hidden="true"
                    className="flex aspect-square w-full max-w-[13rem] items-center justify-center rounded-sm border border-ink/13 bg-surface font-serif text-[2.4rem] text-muted"
                  >
                    {m.initials}
                  </div>
                )}
                <p className="mt-4 mb-0.5 font-serif text-[1.25rem] tracking-[-0.012em]">{m.name}</p>
                <p className="m-0 font-mono text-[0.72rem] uppercase tracking-[0.1em] text-muted">
                  {m.role}
                </p>
              </a>
            ))}
          </div>
        </Reveal>
      </Band>
    </Layout>
  )
}
