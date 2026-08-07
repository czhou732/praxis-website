import { Layout } from '../components/Layout'
import { PsiField } from '../components/PsiField'
import { Band, Button, Card, CardGrid, Eyebrow, Reveal, SectionHead } from '../components/ui'
import { ADVISORS, JOIN, NEWS, NORTH_STAR, PILLARS, REPOS, SITE, TEAM } from '../data/site'

export default function Home() {
  return (
    <Layout current="/">
      <section id="hero" className="relative flex min-h-[min(86vh,780px)] items-center overflow-hidden border-b border-ink/6">
        <div aria-hidden="true" className="grid-pattern pointer-events-none absolute inset-0 z-0" />
        <PsiField />
        <div className="relative z-1 mx-auto w-full max-w-[74rem] px-[clamp(1.25rem,5vw,4rem)] py-[clamp(4rem,12vh,8rem)]">
          <div data-boot>
            <Eyebrow>{SITE.expansion}</Eyebrow>
          </div>
          <h1 data-boot className="mt-6 max-w-[17ch] font-serif text-[clamp(2.6rem,7vw,5.1rem)] leading-[1.02] tracking-[-0.025em]">
            From theory into tools that reach patients.
          </h1>
          <p data-boot className="measure mt-7 text-[1.15rem] leading-[1.6] text-ink-2">{SITE.mission}</p>
          <div data-boot className="mt-10 flex flex-wrap gap-3">
            <Button href="/speakers/">Fall 2026 Speaker Series</Button>
            <Button href="/research/" variant="ghost">Current Research</Button>
          </div>
        </div>
      </section>

      {/* the preprint: one hairline row in the page flow, dated so it never
          decays the way a NEW badge does */}
      <div className="mx-auto w-full max-w-[74rem] px-[clamp(1.25rem,5vw,4rem)]">
        <div className="flex flex-wrap items-baseline gap-x-5 gap-y-1.5 pt-7 font-mono text-[0.68rem] uppercase tracking-[0.12em] text-muted">
          <span className="text-ink-2">Preprint</span>
          <span>bioRxiv · Jun 2026</span>
          <span className="text-ink-2">ClinicalWhisper</span>
          <a
            href={NEWS.href}
            target="_blank"
            rel="noopener"
            className="border-b border-cool/40 pb-0.5 text-cool no-underline transition-colors hover:border-cool"
          >
            {NEWS.linkLabel} ↗
          </a>
        </div>
      </div>

      <Band>
        <Reveal>
          <SectionHead num="01" title="The north star" id="north-star" />
          <p className="measure mb-10 text-[1.15rem] leading-[1.6] text-ink-2">
            Four things we intend to be true within three years. Everything the group does is
            measured against them.
          </p>
          <ul className="list-none p-0">
            {NORTH_STAR.map((item, i) => (
              <li
                key={item}
                className="grid grid-cols-[2.6rem_1fr] items-start gap-4 border-t border-ink/6 py-5 first:border-t-0 first:pt-0"
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
          <SectionHead num="02" title="A research group first" id="pillars" />
          <CardGrid cols={3}>
            {PILLARS.map((p) => (
              <Card key={p.title} kicker={p.kicker} title={p.title} body={p.body} />
            ))}
          </CardGrid>
        </Reveal>
      </Band>

      <Band>
        <Reveal>
          <SectionHead num="03" title="Open source" id="code" />
          <CardGrid cols={2}>
            {REPOS.map((r) => (
              <Card key={r.href} kicker={r.kicker} title={r.title} body={r.body} href={r.href} />
            ))}
          </CardGrid>
        </Reveal>
      </Band>

      <Band>
        <Reveal>
          <SectionHead num="04" title="Who runs it" id="team" />
          <div className="grid gap-8 [grid-template-columns:repeat(auto-fit,minmax(13rem,1fr))]">
            {TEAM.map((m) => (
              <a key={m.name} href={m.href} target="_blank" rel="noopener" className="group block text-inherit no-underline">
                {m.photo ? (
                  <img
                    src={m.photo}
                    alt={m.name}
                    width="384"
                    height="512"
                    className="aspect-[3/4] w-full max-w-[13rem] rounded-sm border border-ink/13 object-cover grayscale transition-[filter] duration-300 group-hover:grayscale-0"
                  />
                ) : (
                  <div
                    aria-hidden="true"
                    className="flex aspect-[3/4] w-full max-w-[13rem] items-center justify-center rounded-sm border border-ink/13 bg-surface font-serif text-[2.4rem] text-muted"
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

      <Band>
        <Reveal>
          <SectionHead num="05" title="Join" id="join" />
          <ul className="list-none p-0 max-w-[46rem]">
            {JOIN.map((row) => (
              <li
                key={row.k}
                className="grid grid-cols-[3.4rem_1fr] items-baseline gap-5 border-t border-ink/6 py-5 first:border-t-0 first:pt-0"
              >
                <span className="font-mono text-[0.72rem] uppercase tracking-[0.12em] text-cool">
                  {row.k}
                </span>
                <p className="m-0 text-ink-2">{row.v}</p>
              </li>
            ))}
          </ul>
          <div className="mt-8">
            <Button href={`mailto:${SITE.contact}?subject=Joining%20PRAXIS`}>Get in touch</Button>
          </div>
        </Reveal>
      </Band>

      <Band>
        <Reveal>
          <SectionHead num="06" title="Advisors" id="advisors" />
          <div className="max-w-[46rem]">
            {ADVISORS.map((a) => {
              const Tag = a.href ? 'a' : 'div'
              return (
                <Tag
                  key={a.name}
                  {...(a.href ? { href: a.href, target: '_blank', rel: 'noopener' } : {})}
                  className="group flex items-baseline justify-between gap-6 border-t border-ink/6 py-5 text-inherit no-underline first:border-t-0 first:pt-0"
                >
                  <span
                    className={
                      a.href
                        ? 'font-serif text-[1.35rem] tracking-[-0.012em] transition-colors group-hover:text-cool'
                        : 'font-serif text-[1.35rem] tracking-[-0.012em]'
                    }
                  >
                    {a.name}
                  </span>
                  <span className="font-mono text-[0.72rem] uppercase tracking-[0.12em] text-muted">
                    {a.role}
                    {a.href && <span aria-hidden="true"> ↗</span>}
                  </span>
                </Tag>
              )
            })}
          </div>
        </Reveal>
      </Band>
    </Layout>
  )
}
