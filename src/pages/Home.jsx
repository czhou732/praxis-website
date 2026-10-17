import { useCallback, useEffect, useRef } from 'react'
import { Layout } from '../components/Layout'
import { PsiField } from '../components/PsiField'
import { Band, Button, Card, CardGrid, Eyebrow, Reveal, SectionHead } from '../components/ui'
import { ADVISORS, ASSOCIATES, FOLLOW_URL, JOIN, NEWS, NORTH_STAR, PILLARS, OFFICERS, REPOS, SITE } from '../data/site'
import { PersonCard } from '../components/PersonCard'
import { useScrollReveal } from '../hooks/useScrollReveal'

const WORDS = ['Zero', 'One', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven', 'Eight', 'Nine', 'Ten', 'Eleven', 'Twelve']
const numberWord = (n) => WORDS[n] ?? String(n)

export default function Home() {
  const bgRef = useRef(null)
  const fgRef = useRef(null)

  useScrollReveal()

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
      <section id="hero" className="relative flex min-h-[min(86dvh,780px)] items-center overflow-hidden bg-[#080B11]">
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
          {/* Tertiary link — points at the Luma calendar so followers get new
             sessions emailed automatically. Swap to the application form during
             an active recruitment window (see git for the Fall '26 pattern). */}
          <p data-boot className="mt-4 font-mono text-[0.72rem] uppercase tracking-[0.05em] text-muted">
            <a
              href={FOLLOW_URL}
              target="_blank"
              rel="noopener"
              className="border-b border-cool/40 pb-0.5 text-cool no-underline transition-colors hover:border-cool"
            >
              Get updates when new sessions post <span aria-hidden="true">↗</span>
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
          <p className="measure mb-10 text-[1.15rem] leading-[1.6] text-ink-2 scroll-reveal" style={{ '--sr-delay': '0s' }}>
            Four things we intend to be true within three years. Everything the group does is
            measured against them.
          </p>
          <ul className="list-none p-0">
            {NORTH_STAR.map((item, i) => (
              <li
                key={item}
                className="scroll-reveal grid grid-cols-[2.6rem_1fr] items-start gap-4 py-5"
                style={{ '--sr-delay': `${i * 0.1}s` }}
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
          <div className="scroll-reveal flex flex-wrap items-baseline gap-x-4 gap-y-2 pb-9 font-mono text-[0.75rem] uppercase tracking-[0.1em] text-muted" style={{ '--sr-delay': '0s' }}>
            <a href="/research/#conferences" className="border-b border-transparent pb-0.5 text-muted no-underline transition-colors hover:text-cool">Recent presentations <span aria-hidden="true">→</span></a>
            <span className="text-ink-2">CPC · USC Symposium · NeuroTech @ UC Berkeley</span>
          </div>
          <CardGrid cols={3}>
            {PILLARS.map((p, i) => (
              <div key={p.title} className="scroll-reveal" style={{ '--sr-delay': `${i * 0.12}s` }}>
                <Card kicker={p.kicker} title={p.title} body={p.body} />
              </div>
            ))}
          </CardGrid>
        </Reveal>
      </Band>

      <Band>
        <Reveal>
          <SectionHead num="03" title="Open source" id="code" />
          <CardGrid cols={2}>
            {REPOS.map((r, i) => (
              <div key={r.href} className="scroll-reveal" style={{ '--sr-delay': `${i * 0.15}s` }}>
                <Card kicker={r.kicker} title={r.title} body={r.body} href={r.href} />
              </div>
            ))}
          </CardGrid>
        </Reveal>
      </Band>

      <Band>
        <Reveal>
          <SectionHead num="04" title="Who runs it" id="team" />
          <p className="measure -mt-4 mb-10 text-ink-2">
            {numberWord(OFFICERS.length)} officers, {numberWord(OFFICERS.length + ASSOCIATES.length).toLowerCase()} researchers,
            and {numberWord(ADVISORS.length).toLowerCase()} advisors.
          </p>
          <div className="grid max-w-[60rem] gap-8 [grid-template-columns:repeat(auto-fill,minmax(13rem,1fr))]">
            {OFFICERS.map((m, i) => (
              <PersonCard key={m.name} member={m} index={i} />
            ))}
          </div>
          <a
            href="/people/"
            className="mt-10 inline-flex items-baseline gap-2 border-b border-cool/40 pb-0.5 font-mono text-[0.78rem] tracking-[0.05em] text-cool no-underline transition-colors hover:border-cool"
          >
            Meet everyone <span aria-hidden="true">→</span>
          </a>
        </Reveal>
      </Band>

      <Band>
        <Reveal>
          <SectionHead num="05" title="Join" id="join" />
          <ul className="list-none p-0 max-w-[46rem]">
            {JOIN.map((row, i) => (
              <li
                key={row.k}
                className="scroll-reveal grid grid-cols-[3.4rem_1fr] items-baseline gap-5 py-5"
                style={{ '--sr-delay': `${i * 0.08}s` }}
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
          <p className="scroll-reveal mt-8 font-mono text-[0.7rem] uppercase tracking-[0.1em] text-muted" style={{ '--sr-delay': '0.4s' }}>
            <span className="text-cool">Fall '26 applications closed</span> · next cycle opens January 2027 for Spring '27
          </p>
          <div className="scroll-reveal mt-3 flex flex-wrap gap-3" style={{ '--sr-delay': '0.5s' }}>
            <Button href={FOLLOW_URL} target="_blank" rel="noopener">Follow the series</Button>
            <Button href={`mailto:${SITE.contact}?subject=Joining%20PRAXIS`} variant="ghost">Get in touch</Button>
          </div>
        </Reveal>
      </Band>

    </Layout>
  )
}
