import { cn } from './ui'

/* ---------- one person, one row ----------
   People page layout: the photo beside the name, role and bio, so each person
   gets their own spotlight. The photo keeps its own shape (never cropped) at a
   fixed width (never shrunk). Side by side from small-tablet width up, rows
   alternating sides; stacked, photo first, on phones. */
export function PersonSpotlight({ member, index = 0 }) {
  const flip = index % 2 === 1

  return (
    <article
      className={cn(
        'scroll-reveal grid items-center gap-x-[clamp(1.75rem,5vw,4.5rem)] gap-y-6 border-t border-ink/6 py-[clamp(2.25rem,5vw,3.5rem)] first:border-t-0 first:pt-0',
        flip
          ? 'min-[34rem]:grid-cols-[minmax(0,1fr)_15rem]'
          : 'min-[34rem]:grid-cols-[15rem_minmax(0,1fr)]'
      )}
      style={{ '--sr-delay': `${Math.min(index, 3) * 0.08}s` }}
    >
      <div className={cn('w-[15rem] max-w-full', flip && 'min-[34rem]:order-2')}>
        {member.photo ? (
          <img
            src={member.photo}
            alt={member.name}
            loading="lazy"
            className="block h-auto w-full rounded-sm"
          />
        ) : (
          <div
            aria-hidden="true"
            className="flex aspect-[3/4] w-full items-center justify-center rounded-sm bg-gradient-to-b from-ink/10 to-transparent font-serif text-[3rem] text-muted/60"
          >
            {member.initials}
          </div>
        )}
      </div>

      <div className={cn('min-w-0', flip && 'min-[34rem]:order-1')}>
        <h3 className="m-0 font-serif text-[clamp(1.6rem,3vw,2.3rem)] leading-[1.1] tracking-[-0.018em]">
          {member.name}
        </h3>
        <p className="mt-3 mb-0 font-mono text-[0.72rem] uppercase tracking-[0.12em] text-muted">
          {member.role}
        </p>
        {member.bio && (
          <p className="mt-5 mb-0 max-w-[38rem] text-[1.02rem] leading-[1.65] text-ink-2">{member.bio}</p>
        )}
        {member.href && (
          <a
            href={member.href}
            target="_blank"
            rel="noopener"
            className="mt-5 inline-block border-b border-cool/40 pb-0.5 font-mono text-[0.72rem] uppercase tracking-[0.1em] text-cool no-underline transition-colors hover:border-cool"
          >
            LinkedIn <span aria-hidden="true">↗</span>
          </a>
        )}
      </div>
    </article>
  )
}
