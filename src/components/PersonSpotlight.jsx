/* ---------- one person: photo beside name, role and bio ----------
   People page lays these out two per row on wide screens, one per row below.
   The photo keeps its own shape (never cropped) at a fixed width (never
   shrunk). Text always sits to the right; only phones stack. */
export function PersonSpotlight({ member, index = 0 }) {
  return (
    <article
      className="scroll-reveal grid items-start gap-x-6 gap-y-4 min-[34rem]:grid-cols-[10rem_minmax(0,1fr)]"
      style={{ '--sr-delay': `${Math.min(index, 3) * 0.08}s` }}
    >
      <div className="w-[12rem] max-w-full min-[34rem]:w-[10rem]">
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
            className="flex aspect-[3/4] w-full items-center justify-center rounded-sm bg-gradient-to-b from-ink/10 to-transparent font-serif text-[2.2rem] text-muted/60"
          >
            {member.initials}
          </div>
        )}
      </div>

      <div className="min-w-0">
        <h3 className="m-0 font-serif text-[1.5rem] leading-[1.15] tracking-[-0.015em]">{member.name}</h3>
        <p className="mt-2 mb-0 font-mono text-[0.7rem] uppercase tracking-[0.12em] text-muted">{member.role}</p>
        {member.bio && (
          <p className="mt-3.5 mb-0 max-w-[34rem] text-[0.95rem] leading-[1.6] text-ink-2">{member.bio}</p>
        )}
        {member.funFact && (
          <p className="mt-3 mb-0 max-w-[34rem] text-[0.88rem] leading-[1.6] text-muted">
            <span className="mr-2 font-mono text-[0.65rem] uppercase tracking-[0.12em] text-cool/80">Fun fact</span>
            {member.funFact}
          </p>
        )}
        {member.href && (
          <a
            href={member.href}
            target="_blank"
            rel="noopener"
            className="mt-3.5 inline-block border-b border-cool/40 pb-0.5 font-mono text-[0.7rem] uppercase tracking-[0.1em] text-cool no-underline transition-colors hover:border-cool"
          >
            LinkedIn <span aria-hidden="true">↗</span>
          </a>
        )}
      </div>
    </article>
  )
}
