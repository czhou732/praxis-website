import { useState } from 'react'
import { Layout } from '../components/Layout'
import { Band, Button, Eyebrow, Reveal, SectionHead } from '../components/ui'
import { BIB, MODULES } from '../data/site'

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
          <SectionHead num="02" title="Bibliography" id="bibliography" />
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
