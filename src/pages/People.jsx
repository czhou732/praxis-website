import { Layout } from '../components/Layout'
import { PersonSpotlight } from '../components/PersonSpotlight'
import { Band, Eyebrow, Reveal, SectionHead } from '../components/ui'
import { useScrollReveal } from '../hooks/useScrollReveal'
import { ADVISORS, ASSOCIATES, OFFICERS } from '../data/site'

/* Everyone in one place: officers, research associates, advisors. Home keeps
   only the officers and links here. No team or project names on this page. */
export default function People() {
  useScrollReveal()

  return (
    <Layout current="/people/">
      <header className="mx-auto w-full max-w-[74rem] px-[clamp(1.25rem,5vw,4rem)] pt-[clamp(3rem,9vw,5.5rem)] pb-[clamp(1rem,3vw,2rem)]">
        <Eyebrow>People</Eyebrow>
        <h1 className="mt-5 max-w-[18ch] font-serif text-[clamp(2.3rem,5.5vw,3.8rem)] leading-[1.02] tracking-[-0.025em]">
          Who does the work
        </h1>
        <p className="measure mt-6 text-[1.15rem] leading-[1.6] text-ink-2">
          PRAXIS is run by students. Officers keep the society going, every member does original
          research, and two advisors back the work.
        </p>
      </header>

      <Band>
        <Reveal>
          <SectionHead num="01" title="Officers" id="officers" />
          <div className="grid gap-x-14 gap-y-14 lg:grid-cols-2">
            {OFFICERS.map((m, i) => (
              <PersonSpotlight key={m.name} member={m} index={i} />
            ))}
          </div>
        </Reveal>
      </Band>

      <Band>
        <Reveal>
          <SectionHead num="02" title="Research associates" id="associates" />
          <div className="grid gap-x-14 gap-y-14 lg:grid-cols-2">
            {ASSOCIATES.map((m, i) => (
              <PersonSpotlight key={m.name} member={m} index={i} />
            ))}
          </div>
        </Reveal>
      </Band>

      <Band>
        <Reveal>
          <SectionHead num="03" title="Advisors" id="advisors" />
          <div className="max-w-[46rem]">
            {ADVISORS.map((a, i) => {
              const Tag = a.href ? 'a' : 'div'
              return (
                <Tag
                  key={a.name}
                  {...(a.href ? { href: a.href, target: '_blank', rel: 'noopener' } : {})}
                  className="scroll-reveal group flex items-baseline justify-between gap-6 py-5 text-inherit no-underline"
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
