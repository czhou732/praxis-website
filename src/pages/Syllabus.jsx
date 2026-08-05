import { Layout } from '../components/Layout'
import { Band, Button, Eyebrow, Reveal } from '../components/ui'
import { MODULES } from '../data/site'

export default function Syllabus () {
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
        {MODULES.map((m, i) => (
          <Reveal key={m.n} delay={i * 0.05}>
            <div className="border-t border-ink/13 py-7">
              <span className="mb-3.5 block font-mono text-[0.7rem] uppercase tracking-[0.13em] text-cool">
                Module {m.n}
              </span>
              <h2 className="mb-2 font-serif text-[1.4rem] leading-[1.25] tracking-[-0.012em]">
                {m.title}
              </h2>
              <p className="measure m-0 text-[0.95rem] text-ink-2">{m.body}</p>
              <ul className="mt-4 list-disc pl-5">
                {m.readings.map((r) => (
                  <li key={r} className="measure mb-2 text-[0.95rem] text-ink-2">
                    {r}
                  </li>
                ))}
              </ul>
            </div>
          </Reveal>
        ))}

        <div className="mt-10">
          <Button href="https://github.com/czhou732/comp-psych-syllabus" target="_blank" rel="noopener">
            Full syllabus on GitHub
          </Button>
        </div>
      </Band>
    </Layout>
  )
}
