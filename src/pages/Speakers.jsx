import { Layout } from '../components/Layout'
import { Band, BorderBeam, Button, Eyebrow, Pill, Reveal, SectionHead } from '../components/ui'
import { SPEAKERS } from '../data/speakers'
import { SITE } from '../data/site'

function Slot ({ slot }) {
  const confirmed = slot.status === 'confirmed'
  return (
    <div className="grid grid-cols-1 items-start gap-2 border-t border-ink/6 py-6 first:border-ink/13 md:grid-cols-[7rem_1fr_auto] md:gap-6">
      <div className="tnum font-mono text-[0.8rem] leading-[1.5] text-ink-2">
        {slot.date}
        <small className="block text-[0.72rem] text-muted">{slot.time}</small>
      </div>

      <div className="min-w-0">
        <p
          className={
            confirmed
              ? 'm-0 mb-1 font-serif text-[1.3rem] leading-[1.25] tracking-[-0.012em]'
              : 'm-0 mb-1 font-serif text-[1.3rem] leading-[1.25] tracking-[-0.012em] text-muted italic'
          }
        >
          {confirmed ? slot.name : 'Speaker to be announced'}
        </p>
        {confirmed && slot.topic && <p className="m-0 text-[0.95rem] text-ink-2">{slot.topic}</p>}
        <p className="mt-1.5 mb-0 font-mono text-[0.7rem] uppercase tracking-[0.08em] text-muted">
          {slot.mode}
        </p>
      </div>

      <div className="justify-self-start md:justify-self-end">
        <Pill tone={confirmed ? 'ok' : 'wait'}>{confirmed ? 'Confirmed' : 'Invited'}</Pill>
      </div>
    </div>
  )
}

export default function Speakers () {
  return (
    <Layout current="/speakers/">
      <header className="mx-auto w-full max-w-[74rem] border-b border-ink/6 px-[clamp(1.25rem,5vw,4rem)] pt-[clamp(3rem,9vw,5.5rem)] pb-[clamp(2rem,5vw,3rem)]">
        <Eyebrow>Fall 2026</Eyebrow>
        <h1 className="mt-5 max-w-[18ch] font-serif text-[clamp(2.3rem,5.5vw,3.8rem)] leading-[1.02] tracking-[-0.025em]">
          Speaker Series
        </h1>
        <p className="measure mt-6 text-[1.15rem] leading-[1.6] text-ink-2">
          Seven biweekly talks, September through December. Sessions run on Thursdays — in-person
          talks at 4:00&nbsp;PM PT, remote talks at 1:00&nbsp;PM PT so speakers on the east coast
          can join at 4:00&nbsp;PM ET.
        </p>
      </header>

      <Band first>
        <Reveal>
          <SectionHead num="01" title="Schedule" />
          <div className="flex flex-col">
            {SPEAKERS.map((slot) => (
              <Slot key={slot.date} slot={slot} />
            ))}
          </div>
          <p className="measure mt-8 text-[0.9rem] text-muted">
            Confirmed talks are listed with speaker and topic. Slots marked{' '}
            <Pill tone="wait">Invited</Pill> have a held date and a pending invitation; names and
            topics are published once the speaker confirms.
          </p>
        </Reveal>
      </Band>

      <Band>
        <Reveal>
          <SectionHead num="02" title="Interested in speaking?" />
          <div className="relative rounded-sm border border-ink/13 border-l-2 border-l-cool bg-surface p-8">
            <BorderBeam duration={9} />
            <p className="measure">
              If you apply computational methods to psychiatric questions — modeling, imaging,
              digital phenotyping, or clinical machine learning — we would like to host you. Talks
              run 45 minutes plus discussion, in person or over Zoom.
            </p>
            <div className="mt-6">
              <Button href={`mailto:${SITE.contact}?subject=PRAXIS%20Speaker%20Series`}>
                Get in touch
              </Button>
            </div>
          </div>
        </Reveal>
      </Band>
    </Layout>
  )
}
