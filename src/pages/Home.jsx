import { useCallback, useEffect, useRef } from 'react'
import { motion, useMotionValue, useSpring, useTransform, useMotionTemplate } from 'motion/react'
import { Layout } from '../components/Layout'
import { PsiField } from '../components/PsiField'
import { Band, Button, Card, CardGrid, Eyebrow, Reveal, SectionHead } from '../components/ui'
import { ADVISORS, APPLY_DEADLINE, APPLY_URL, FOLLOW_URL, JOIN, NEWS, NORTH_STAR, PILLARS, REPOS, SITE, TEAM } from '../data/site'

/* ---------- 3D tilt team card ---------- */
function TiltCard({ member, index }) {
  const cardRef = useRef(null)

  const mouseX = useMotionValue(0.5)
  const mouseY = useMotionValue(0.5)

  // Fluid physics configuration
  const springConfig = { damping: 20, stiffness: 150, mass: 0.5 }
  const smoothX = useSpring(mouseX, springConfig)
  const smoothY = useSpring(mouseY, springConfig)

  // Rotate based on smooth mouse position
  const rotateX = useTransform(smoothY, [0, 1], [10, -10])
  const rotateY = useTransform(smoothX, [0, 1], [-10, 10])

  // Scale and light opacity with separate springs for feel
  const scale = useSpring(useMotionValue(1), { damping: 20, stiffness: 200 })
  const lightOpacity = useSpring(useMotionValue(0), { damping: 20, stiffness: 100 })

  // Transform coordinates for radial gradient string
  const lightX = useTransform(smoothX, (x) => x * 100)
  const lightY = useTransform(smoothY, (y) => y * 100)
  const lightBg = useMotionTemplate`radial-gradient(circle at ${lightX}% ${lightY}%, rgba(110,155,255,0.18), transparent 60%)`

  const onMove = (e) => {
    const el = cardRef.current
    if (!el || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    const rect = el.getBoundingClientRect()
    mouseX.set((e.clientX - rect.left) / rect.width)
    mouseY.set((e.clientY - rect.top) / rect.height)
    scale.set(1.03)
    lightOpacity.set(1)
  }

  const onLeave = () => {
    mouseX.set(0.5)
    mouseY.set(0.5)
    scale.set(1)
    lightOpacity.set(0)
  }

  return (
    <div
      ref={cardRef}
      onMouseMove={onMove}
      onMouseLeave={onLeave}
      className="scroll-reveal"
      style={{ '--sr-delay': `${index * 0.12}s` }}
    >
      <motion.div style={{ rotateX, rotateY, scale, transformStyle: 'preserve-3d', perspective: 800 }}>
        <a
          href={member.href}
          target="_blank"
          rel="noopener"
          className="group block text-inherit no-underline"
        >
          <div className="relative overflow-hidden rounded-sm">
            {member.photo ? (
              <img
                src={member.photo}
                alt={member.name}
                width="384"
                height="512"
                className="aspect-[3/4] w-full max-w-[13rem] object-cover opacity-90 transition-opacity duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:opacity-100"
              />
            ) : (
              <div
                aria-hidden="true"
                className="flex aspect-[3/4] w-full max-w-[13rem] items-center justify-center bg-gradient-to-b from-ink/10 to-transparent font-serif text-[2.4rem] text-muted/60 opacity-90 transition-opacity duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:opacity-100"
              >
                {member.initials}
              </div>
            )}
            <motion.div
              style={{ opacity: lightOpacity, background: lightBg }}
              className="pointer-events-none absolute inset-0"
            />
          </div>
          <p className="mt-4 mb-0.5 font-serif text-[1.25rem] tracking-[-0.012em]">{member.name}</p>
          <p className="m-0 font-mono text-[0.72rem] uppercase tracking-[0.1em] text-muted">
            {member.role}
          </p>
        </a>
      </motion.div>
    </div>
  )
}

/* ---------- Scroll-reveal hook: Apple-style staggered reveal ---------- */
function useScrollReveal() {
  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      document.querySelectorAll('.scroll-reveal').forEach(el => el.classList.add('sr-visible'))
      return
    }

    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('sr-visible')
            io.unobserve(entry.target)
          }
        })
      },
      { threshold: 0.08, rootMargin: '0px 0px -60px 0px' }
    )

    document.querySelectorAll('.scroll-reveal').forEach(el => io.observe(el))
    return () => io.disconnect()
  }, [])
}

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
          <p className="measure mb-10 text-[1.15rem] leading-[1.6] text-ink-2 scroll-reveal" style={{ '--sr-delay': '0s' }}>
            Four things we intend to be true within three years. Everything the group does is
            measured against them.
          </p>
          <ul className="list-none p-0">
            {NORTH_STAR.map((item, i) => (
              <li
                key={item}
                className="scroll-reveal grid grid-cols-[2.6rem_1fr] items-start gap-4 border-t border-ink/6 py-5 first:border-t-0 first:pt-0"
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
          <div className="grid gap-8 [grid-template-columns:repeat(auto-fit,minmax(13rem,1fr))]">
            {TEAM.map((m, i) => (
              <TiltCard key={m.name} member={m} index={i} />
            ))}
          </div>
        </Reveal>
      </Band>

      <Band>
        <Reveal>
          <SectionHead num="05" title="Join" id="join" />
          <ul className="list-none p-0 max-w-[46rem]">
            {JOIN.map((row, i) => (
              <li
                key={row.k}
                className="scroll-reveal grid grid-cols-[3.4rem_1fr] items-baseline gap-5 border-t border-ink/6 py-5 first:border-t-0 first:pt-0"
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
            <span className="text-cool">Fall '26 core recruitment</span> · 3-4 slots · closes {APPLY_DEADLINE}
          </p>
          <div className="scroll-reveal mt-3 flex flex-wrap gap-3" style={{ '--sr-delay': '0.5s' }}>
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
            {ADVISORS.map((a, i) => {
              const Tag = a.href ? 'a' : 'div'
              return (
                <Tag
                  key={a.name}
                  {...(a.href ? { href: a.href, target: '_blank', rel: 'noopener' } : {})}
                  className="scroll-reveal group flex items-baseline justify-between gap-6 border-t border-ink/6 py-5 text-inherit no-underline first:border-t-0 first:pt-0"
                  style={{ '--sr-delay': `${i * 0.1}s` }}
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
