import { useState, useEffect } from 'react'
import { Layout } from '../components/Layout'
import { Band, Card, CardGrid, Eyebrow, Reveal, SectionHead, cn } from '../components/ui'
import { CONFERENCES, PROJECTS, REPOS } from '../data/site'

const PROJECT_COORDS = {
  'Vocal Biomarkers — crossbenching anhedonia': { x: 0.75, y: 0.85, id: '01' },
  'ClinicalWhisper': { x: 0.9, y: 0.45, id: '02' },
  'fMRI benchmark analysis': { x: 0.25, y: 0.65, id: '03' }
}

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

function LatentSpace() {
  const [active, setActive] = useState(0)
  
  const mappedProjects = PROJECTS.map(p => ({
    ...p,
    ...PROJECT_COORDS[p.title]
  }))

  const activeProject = mappedProjects[active]

  return (
    <div className="mt-10 flex flex-col gap-12 lg:flex-row lg:items-start">
      {/* 2D Coordinate System (Latent Space) */}
      <div className="relative w-full lg:w-1/2 aspect-square max-h-[500px] border-b border-l border-ink/20 bg-[#06080D]">
        {/* Grid lines */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:10%_10%]" />
        
        {/* Axis Labels */}
        <div className="absolute -bottom-7 left-0 right-0 text-center font-mono text-[0.65rem] uppercase tracking-widest text-muted">
          Clinical Translation →
        </div>
        <div className="absolute -left-8 top-0 bottom-0 flex items-center justify-center [writing-mode:vertical-rl] rotate-180 font-mono text-[0.65rem] uppercase tracking-widest text-muted">
          Computational Complexity →
        </div>

        {/* Nodes & Plumb Lines */}
        {mappedProjects.map((p, i) => {
          const isActive = active === i
          // If no coordinates are defined, fallback to center.
          const x = p.x ?? 0.5
          const y = p.y ?? 0.5
          const xPct = x * 100
          const yPct = (1 - y) * 100
          
          return (
            <div key={p.title} className="absolute inset-0 pointer-events-none">
              {/* Active Node Plumb Lines (Data Anchors) */}
              <div 
                className={cn(
                  "absolute border-t border-dashed border-cool/40 transition-all duration-500",
                  isActive ? "opacity-100" : "opacity-0"
                )}
                style={{ left: 0, top: `${yPct}%`, right: `${100 - xPct}%` }}
              />
              <div 
                className={cn(
                  "absolute border-l border-dashed border-cool/40 transition-all duration-500",
                  isActive ? "opacity-100" : "opacity-0"
                )}
                style={{ left: `${xPct}%`, top: `${yPct}%`, bottom: 0 }}
              />

              <button
                onMouseEnter={() => setActive(i)}
                onClick={() => setActive(i)}
                className="absolute flex -translate-x-1/2 -translate-y-1/2 items-center justify-center transition-all duration-300 group outline-none pointer-events-auto"
                style={{ left: `${xPct}%`, top: `${yPct}%` }}
                aria-label={`View project: ${p.title}`}
              >
                {/* Impeccable Usability: Invisible expanded touch target (44px+) for mobile */}
                <span className="absolute -inset-4" aria-hidden="true" />
                
                <div 
                  className={cn(
                    "flex h-8 w-8 items-center justify-center rounded-full font-mono text-[0.6rem] transition-all relative z-10",
                    isActive 
                      ? "bg-cool text-ground shadow-[0_0_20px_rgba(110,155,255,0.4)] scale-110" 
                      : "bg-ink/10 text-ink border border-ink/20 group-hover:bg-ink/20 group-hover:border-ink/40"
                  )}
                >
                  {p.id || `0${i+1}`}
                </div>
                
                {/* Persistent Star-map Label */}
                <div 
                  className={cn(
                    "absolute left-10 w-max max-w-[160px] text-left transition-all duration-300 pointer-events-none",
                    isActive ? "opacity-100 translate-x-1" : "opacity-40 grayscale group-hover:opacity-60"
                  )}
                >
                  <span className={cn(
                    "font-mono text-[0.6rem] leading-[1.3] block",
                    isActive ? "text-cool" : "text-ink"
                  )}>
                    {p.title}
                  </span>
                </div>
              </button>
            </div>
          )
        })}
      </div>

      {/* Active Project Detail View */}
      <div className="flex-1 lg:pl-4">
        <Reveal key={activeProject.title}>
          <article className="min-h-[400px]">
            <div className="mb-3 flex items-center gap-3">
              <span className="flex h-5 w-5 items-center justify-center rounded-full bg-cool font-mono text-[0.55rem] text-ground">
                {activeProject.id || `0${active+1}`}
              </span>
              <span className="font-mono text-[0.65rem] uppercase tracking-widest text-cool">Selected Node</span>
            </div>
            
            <h2 className="mt-4 mb-5 font-serif text-[clamp(1.6rem,3vw,2.2rem)] leading-[1.1] tracking-tight">
              {activeProject.title}
            </h2>
            
            <div className="mb-6">
              <Track stage={activeProject.stage} status={activeProject.status} />
            </div>
            
            <p className="measure text-[1.05rem] leading-[1.65] text-ink-2">
              {activeProject.body}
            </p>
            
            <div className="mt-6 flex flex-wrap gap-2">
              {activeProject.tags.map((t) => (
                <span
                  key={t}
                  className="rounded-sm border border-ink/13 bg-ink/5 px-2.5 py-1.5 font-mono text-[0.7rem] tracking-[0.06em] text-ink"
                >
                  {t}
                </span>
              ))}
            </div>
            
            {activeProject.citation && (
              <p className="mt-8 max-w-[70ch] border-l-2 border-cool/50 pl-4 font-mono text-[0.75rem] leading-[1.7] text-muted">
                {activeProject.citation}
              </p>
            )}
            
            {activeProject.links && (
              <div className="mt-8 flex flex-wrap gap-x-6 gap-y-2">
                {activeProject.links.map((l) => (
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
      </div>
    </div>
  )
}

function useScrollReveal() {
  useEffect(() => {
    if (typeof window === 'undefined') return
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            entry.target.classList.add('sr-visible')
          }
        }
      },
      { threshold: 0.1, rootMargin: '0px 0px -50px 0px' }
    )
    const els = document.querySelectorAll('.scroll-reveal')
    els.forEach((el) => observer.observe(el))
    return () => observer.disconnect()
  }, [])
}

export default function Research () {
  useScrollReveal()

  return (
    <Layout current="/research/">
      <header className="mx-auto w-full max-w-[74rem] border-b border-ink/6 px-[clamp(1.25rem,5vw,4rem)] pt-[clamp(3rem,9vw,5.5rem)] pb-[clamp(2rem,5vw,3rem)]">
        <Eyebrow>Portfolio</Eyebrow>
        <h1 className="mt-5 max-w-[18ch] font-serif text-[clamp(2.3rem,5.5vw,3.8rem)] leading-[1.02] tracking-[-0.025em]">
          Research
        </h1>
        <p className="measure mt-6 text-[1.15rem] leading-[1.6] text-ink-2">
          PRAXIS is a research group first and an events organization second. These projects define
          the intellectual agenda. Rather than a static list, projects are mapped below across our two core dimensions: Clinical Translation and Computational Complexity.
        </p>
      </header>

      <Band first>
        <LatentSpace />
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
          <div className="flex flex-col">
            {CONFERENCES.map((e, i) => (
              <article
                key={e.title}
                className="border-t border-ink/13 py-12 first:border-t-0 first:pt-0"
              >
                <div className="flex flex-col gap-7 lg:flex-row lg:items-start lg:gap-12">
                  <div className="lg:w-[30rem] lg:shrink-0">
                    <img
                      src={e.photo}
                      alt={`${e.venue} — ${e.title}`}
                      className="block max-h-[22rem] w-auto max-w-full rounded-sm"
                    />
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
