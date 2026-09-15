import { useState } from 'react'
import { Layout } from '../components/Layout'
import { Band, Button, Eyebrow, Reveal, SectionHead } from '../components/ui'
import { BIB, MODULES } from '../data/site'
import { JOURNAL_CLUB } from '../data/events'
import { Pill } from '../components/ui'

/* BibTeX export for the readings whose publisher records are verified —
   BIB in site.js only ever carries those. */
function CopyButton({ text, idle, done = 'Copied' }) {
  const [copied, setCopied] = useState(false)
  const copy = async () => {
    try {
      await navigator.clipboard.writeText(text)
      setCopied(true)
      setTimeout(() => setCopied(false), 1600)
    } catch {
      /* clipboard unavailable — leave the text selectable */
    }
  }
  return (
    <button
      type="button"
      onClick={copy}
      className="cursor-pointer rounded-sm border border-ink/13 bg-transparent px-3 py-1 font-mono text-[0.62rem] uppercase tracking-[0.12em] text-ink-2 transition-colors hover:border-cool hover:text-cool"
    >
      {copied ? done : idle}
    </button>
  )
}

function BibRow({ label, doi, bib }) {
  return (
    <div className="border-t border-ink/6 py-4 first:border-ink/13">
      <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-2">
        <span className="font-mono text-[0.72rem] uppercase tracking-[0.1em] text-ink-2">
          {label}
        </span>
        <div className="flex items-center gap-3">
          <a
            href={`https://doi.org/${doi}`}
            target="_blank"
            rel="noopener"
            className="font-mono text-[0.62rem] tracking-[0.06em] text-muted hover:text-cool"
          >
            {doi}
          </a>
          <CopyButton text={bib} idle="Copy .bib" />
        </div>
      </div>
      <pre className="mt-3 overflow-x-auto font-mono text-[0.7rem] leading-[1.7] text-muted">
        {bib}
      </pre>
    </div>
  )
}

/* ---------- curriculum dependency graph ----------
   Modules form a vertical prerequisite spine; each module's readings hang off
   it. Rendered entirely from MODULES so adding an entry to site.js adds a
   node with no other edit. Static SVG — fully present without JavaScript. */

const SPINE_X = 116
const READING_PITCH = 18
const READING_TOP = 34
/* Pitch has to clear the tallest module's reading stack or the rows collide
   with the next node. Four readings occupy 34 + 3 × 18 = 88px. */
const PITCH = 122
const TOP = 56
const BOTTOM = 44
const WIDTH = 800

function ModuleGraph() {
  const height = TOP + (MODULES.length - 1) * PITCH + BOTTOM
  const label =
    'Curriculum dependency graph. Modules in prerequisite order: ' +
    MODULES.map(
      (m) => `${m.n}, ${m.title}, readings: ${m.readings.map((r) => r.cite).join(', ')}`,
    ).join('; ') +
    '.'

  return (
    <div className="overflow-x-auto">
      <svg
        viewBox={`0 0 ${WIDTH} ${height}`}
        role="img"
        aria-label={label}
        className="w-full min-w-[34rem]"
      >
        {/* spine */}
        <line
          x1={SPINE_X}
          y1={TOP}
          x2={SPINE_X}
          y2={TOP + (MODULES.length - 1) * PITCH}
          stroke="rgba(233,237,244,0.13)"
          strokeWidth="1"
        />

        {MODULES.map((m, i) => {
          const y = TOP + i * PITCH
          const readingY = m.readings.map((_, j) => y + READING_TOP + j * READING_PITCH)
          const lastReadingY = readingY[readingY.length - 1]
          return (
            <g key={m.n}>
              {/* elbow connectors from the node down to each reading row */}
              <path
                d={
                  `M ${SPINE_X} ${y} V ${lastReadingY} ` +
                  readingY.map((ry) => `M ${SPINE_X} ${ry} H 130`).join(' ')
                }
                fill="none"
                stroke="rgba(233,237,244,0.13)"
                strokeWidth="1"
              />

              {/* node */}
              <circle
                cx={SPINE_X}
                cy={y}
                r="5"
                fill="var(--color-ground)"
                stroke="var(--color-cool)"
                strokeWidth="1.5"
              />

              {/* module number, mono, left of the spine */}
              <text
                x={SPINE_X - 18}
                y={y + 4}
                textAnchor="end"
                fill="var(--color-cool)"
                fontFamily="var(--font-mono)"
                fontSize="11"
                letterSpacing="1"
              >
                {m.n}
              </text>

              {/* title, serif, right of the spine */}
              <text
                x="140"
                y={y + 5}
                fill="var(--color-ink)"
                fontFamily="var(--font-serif)"
                fontSize="19"
                letterSpacing="-0.2"
              >
                {m.title}
              </text>

              {/* readings, small mono */}
              {m.readings.map((r, j) => (
                <text
                  key={r.doi}
                  x="140"
                  y={readingY[j] + 4}
                  fill="var(--color-muted)"
                  fontFamily="var(--font-mono)"
                  fontSize="10"
                >
                  {r.cite} — {r.topic}
                </text>
              ))}
            </g>
          )
        })}
      </svg>
    </div>
  )
}

export default function Syllabus() {
  return (
    <Layout current="/syllabus/">
      <header className="mx-auto w-full max-w-[74rem] border-b border-ink/6 px-[clamp(1.25rem,5vw,4rem)] pt-[clamp(3rem,9vw,5.5rem)] pb-[clamp(2rem,5vw,3rem)]">
        <Eyebrow>Journal club</Eyebrow>
        <h1 className="mt-5 max-w-[18ch] font-serif text-[clamp(2.3rem,5.5vw,3.8rem)] leading-[1.02] tracking-[-0.025em]">
          Curriculum
        </h1>
        <p className="measure mt-6 text-[1.15rem] leading-[1.6] text-ink-2">
          A twenty-paper sequence designed to take undergraduates from basic neuroscience and
          programming to reading — and eventually writing — primary computational psychiatry
          literature. Nine sessions run across the fall semester.
        </p>
        
        <div className="mt-8 inline-flex items-center gap-2 rounded-sm border border-cool/30 bg-cool/5 px-3 py-1.5 font-mono text-[0.65rem] uppercase tracking-[0.15em] text-cool shadow-[0_0_10px_rgba(110,155,255,0.1)]">
          <span className="relative flex h-1.5 w-1.5">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-cool opacity-75"></span>
            <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-cool"></span>
          </span>
          In active development
        </div>
      </header>

      <Band first>
        <Reveal>
          <ModuleGraph />
        </Reveal>

        <div className="mt-10">
          <Button href="https://github.com/comp-psych/comp-psych-syllabus" target="_blank" rel="noopener">
            Full syllabus on GitHub
          </Button>
        </div>
      </Band>

      <Band>
        <Reveal>
          <SectionHead num="02" title="The Protocol" id="protocol" />
          <div className="relative rounded-sm border border-ink/13 border-l-2 border-l-cool bg-surface p-8">
            <h3 className="mb-4 font-serif text-[1.2rem] leading-[1.2] tracking-[-0.012em]">
              Rules of Engagement
            </h3>
            <ol className="space-y-4 font-mono text-[0.8rem] text-muted list-decimal list-inside">
              <li>
                <strong className="text-cool">No Summaries:</strong> Assume everyone has read the paper. Do not read the abstract. Start with the friction point.
              </li>
              <li>
                <strong className="text-cool">The Pivot Rule:</strong> If you critique a methodology, you must propose an actionable alternative implementation for our lab.
              </li>
              <li>
                <strong className="text-cool">Show the Math:</strong> For computational models (e.g., TDE, Free Energy), the presenter must derive the core equations. Concepts are not enough.
              </li>
            </ol>
          </div>
        </Reveal>
      </Band>

<Band>
        <Reveal>
          <SectionHead num="03" title="Journal club" id="journal-club" />
          <p className="measure mb-8 text-[0.95rem] text-ink-2">
            Biweekly member sessions. Each meeting takes on a specific research question the
            ClinicalWhisper project is working through, backed by one paper the group reads in
            advance. The Sep 17 kickoff is open to everyone; subsequent sessions are member-only.
          </p>
          <div className="flex flex-col">
            {JOURNAL_CLUB.map((jc) => (
              <article key={jc.iso} className="border-t border-ink/13 py-8 first:border-t-0 first:pt-0">
                <div className="flex flex-wrap items-baseline gap-x-4 gap-y-1">
                  <span className="font-mono text-[0.7rem] uppercase tracking-[0.14em] text-cool">{jc.date}</span>
                  <span className="font-mono text-[0.7rem] uppercase tracking-[0.1em] text-muted">{jc.time} · {jc.mode}</span>
                  {jc.open
                    ? <Pill tone="ok">Open to all</Pill>
                    : <Pill tone="wait">Members · RSVP in Slack (👍)</Pill>}
                </div>
                {jc.status === 'confirmed' ? (
                  <>
                    <h3 className="mt-3 mb-1 font-serif text-[1.35rem] leading-[1.2] tracking-[-0.012em]">
                      {jc.title}
                    </h3>
                    <p className="mt-1 mb-0 max-w-[62ch] text-[0.95rem] text-ink-2">
                      <span className="font-mono text-[0.72rem] uppercase tracking-[0.1em] text-muted">Question · </span>
                      {jc.question}
                    </p>
                    <p className="mt-2 mb-0 max-w-[62ch] font-mono text-[0.72rem] uppercase tracking-[0.1em] text-muted">
                      Presenter · <span className="text-ink-2">{jc.presenter}</span>
                    </p>
                    {jc.open && jc.rsvp && (
                      <div className="mt-5">
                        <a
                          href={jc.rsvp}
                          target="_blank"
                          rel="noopener"
                          className="inline-block border border-cool/40 px-4 py-2 font-mono text-[0.72rem] uppercase tracking-[0.1em] text-cool no-underline transition-colors hover:border-cool"
                        >
                          Reserve a seat ↗
                        </a>
                      </div>
                    )}
                  </>
                ) : (
                  <p className="mt-3 mb-0 font-serif text-[1.2rem] leading-[1.2] tracking-[-0.012em] italic text-muted">
                    Research question · TBD
                  </p>
                )}
              </article>
            ))}
          </div>
          <p className="mt-8 font-mono text-[0.72rem] uppercase tracking-[0.1em] text-muted">
            Additional Fall '26 sessions are announced ahead of each meeting.
          </p>
        </Reveal>
      </Band>

      <Band>
        <Reveal>
          <SectionHead num="04" title="Bibliography" id="bibliography" />
          <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
            <p className="measure text-[0.9rem] text-muted">
              All {BIB.length} readings, with BibTeX pulled from the publisher record over DOI
              content negotiation rather than typed by hand.
            </p>
            <CopyButton
              text={BIB.map((b) => b.bib).join('\n\n')}
              idle={`Copy all ${BIB.length}`}
              done="Copied all"
            />
          </div>
          <div>
            {BIB.map((b) => (
              <BibRow key={b.doi} label={b.label} doi={b.doi} bib={b.bib} />
            ))}
          </div>
        </Reveal>
      </Band>
    </Layout>
  )
}
