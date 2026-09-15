import { useEffect, useRef } from 'react'
import { Layout } from '../components/Layout'
import { PsiField } from '../components/PsiField'
import { Band, Button, Card, CardGrid, Eyebrow, Reveal, SectionHead } from '../components/ui'
import { ADVISORS, APPLY_DEADLINE, APPLY_URL, FOLLOW_URL, JOIN, NEWS, NORTH_STAR, PILLARS, REPOS, SITE, TEAM } from '../data/site'

export default function Home() {
  const bgRef = useRef(null)
  const fgRef = useRef(null)

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

    let raf = null
    const onScroll = () => {
      const y = window.scrollY
      if (y > window.innerHeight) return
      
      const scrolled = y / window.innerHeight
      
      if (bgRef.current) {
        bgRef.current.style.transform = `translateY(${scrolled * 180}px)`
      }
      if (fgRef.current) {
        fgRef.current.style.transform = `translateY(${scrolled * 60}px)`
        // Start fading opacity quickly after scrolling
        fgRef.current.style.opacity = Math.max(0, 1 - (scrolled * 1.2))
      }
    }

    const handler = () => {
      if (raf) cancelAnimationFrame(raf)
      raf = requestAnimationFrame(onScroll)
    }

    window.addEventListener('scroll', handler, { passive: true })
    handler()

    return () => {
      window.removeEventListener('scroll', handler)
      if (raf) cancelAnimationFrame(raf)
    }
  }, [])

  return (
    <Layout current="/">
      <section id="hero" className="relative flex min-h-[min(86vh,780px)] items-center overflow-hidden border-b border-ink/6 bg-[#080B11]">
        <div ref={bgRef} aria-hidden="true" className="grid-pattern pointer-events-none absolute inset-0 z-0" />
        <PsiField />
        <div ref={fgRef} className="relative z-1 mx-auto w-full max-w-[74rem] px-[clamp(1.25rem,5vw,4rem)] py-[clamp(4rem,12vh,8rem)]">
          <div data-boot>
            <Eyebrow>{SITE.expansion}</Eyebrow>
          </div>
          <h1 data-boot className="mt-6 max-w-[17ch] font-serif text-[clamp(2.6rem,7vw,5.1rem)] leading-[1.02] tracking-[-0.025em]">
            From theory into tools that reach patients.
          </h1>
          <p data-boot className="measure mt-7 text-[1.15rem] leading-[1.6] text-ink-2">{SITE.mission}</p>
          
          <div data-boot className="mt-12 flex flex-wrap gap-3">
            <Button href="/events/">Fall 2026 Speaker Series</Button>
            <Button href="/research/" variant="ghost">Current Research</Button>
          </div>
          {/* Tertiary link — during the Fall '26 recruitment window this points at
             the application form so the deadline sits on the first screen; revert
             to FOLLOW_URL after Sep 21. */}
          <p data-boot className="mt-4 font-mono text-[0.72rem] uppercase tracking-[0.05em] text-muted">
            Fall '26 core recruitment is open ·{' '}
            <a
              href={APPLY_URL}
              target="_blank"
              rel="noopener"
              className="border-b border-cool/40 pb-0.5 text-cool no-underline transition-colors hover:border-cool"
            >
              apply by Sept 21 <span aria-hidden="true">↗</span>
            </a>
          </p>
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
        {/* Podcast dateline — parallel to the preprint line above. Ep. 1 shipped
           Sep 14 via the Fall '26 speaker series recording pipeline. */}
        <div className="flex flex-wrap items-baseline gap-x-5 gap-y-1.5 pt-2 font-mono text-[0.68rem] uppercase tracking-[0.12em] text-muted">
          <span className="text-ink-2">Podcast</span>
          <span>Sep 2026 · Ep. 1</span>
          <span className="text-ink-2">Attention &amp; Computational Vision</span>
          <a
            href="/podcast/"
            className="border-b border-cool/40 pb-0.5 text-cool no-underline transition-colors hover:border-cool"
          >
            Listen →
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
          <div className="flex flex-wrap items-baseline gap-x-4 gap-y-2 pb-9 font-mono text-[0.75rem] uppercase tracking-[0.1em] text-muted">
            <a href="/research/#conferences" className="border-b border-transparent pb-0.5 text-muted no-underline transition-colors hover:text-cool">Recent presentations <span aria-hidden="true">→</span></a>
            <span className="text-ink-2">CPC · USC Symposium · NeuroTech @ UC Berkeley</span>
          </div>
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
          <div className="grid gap-8 [grid-template-columns:repeat(auto-fit,minmax(13rem,1fr))] group/roster">
            {TEAM.map((m, i) => (
              <a 
                key={m.name} 
                href={m.href} 
                target="_blank" 
                rel="noopener" 
                style={{ '--card-i': i }}
                className="group block text-inherit no-underline transition-all duration-400 ease-[cubic-bezier(0.22,1,0.36,1)] hover:-translate-y-1.5 hover:scale-[1.03] hover:z-10 focus-visible:-translate-y-1.5 focus-visible:scale-[1.03]"
              >
                {m.photo ? (
                  <img
                    src={m.photo}
                    alt={m.name}
                    width="384"
                    height="512"
                    className="aspect-[3/4] w-full max-w-[13rem] rounded-sm border border-ink/13 object-cover grayscale opacity-85 shadow-none transition-all duration-400 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:grayscale-0 group-hover:opacity-100 group-hover:shadow-[0_15px_30px_-10px_rgba(110,155,255,0.15)] group-focus-visible:grayscale-0 group-focus-visible:opacity-100 group-focus-visible:shadow-[0_15px_30px_-10px_rgba(110,155,255,0.15)]"
                  />
                ) : (
                  <div
                    aria-hidden="true"
                    className="flex aspect-[3/4] w-full max-w-[13rem] items-center justify-center rounded-sm border border-ink/13 bg-surface font-serif text-[2.4rem] text-muted transition-all duration-400 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:shadow-[0_15px_30px_-10px_rgba(110,155,255,0.15)]"
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
                <p className="m-0 text-ink-2">
                  {row.linkAnchor && row.v.includes(row.linkAnchor) ? (
                    <>
                      {row.v.split(row.linkAnchor)[0]}
                      <a
                        href={row.linkHref}
                        className="text-cool underline decoration-cool/40 underline-offset-4 hover:decoration-cool"
                      >
                        {row.linkAnchor}
                      </a>
                      {row.v.split(row.linkAnchor)[1]}
                    </>
                  ) : (
                    row.v
                  )}
                </p>
              </li>
            ))}
          </ul>
          {/* Scarcity + deadline note — visible before someone clicks any button. */}
          <p className="mt-8 font-mono text-[0.7rem] uppercase tracking-[0.1em] text-muted">
            <span className="text-cool">Fall '26 core recruitment</span> · 3-4 slots · closes {APPLY_DEADLINE}
          </p>
          <div className="mt-3 flex flex-wrap gap-3">
            <Button href={APPLY_URL} target="_blank" rel="noopener">Apply to join</Button>
            <Button href={`mailto:${SITE.contact}?subject=Joining%20PRAXIS`} variant="ghost">Get in touch</Button>
            <Button href={FOLLOW_URL} variant="ghost" target="_blank" rel="noopener">
              Follow the series
            </Button>
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
