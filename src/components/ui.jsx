import { useEffect, useRef } from 'react'
import { clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

export const cn = (...args) => twMerge(clsx(args))

/* ---------- scroll reveal ----------
   Deliberately CSS-driven rather than JS-animated. The hidden state is applied
   only under `html.js`, which an inline script sets before paint, so a prerendered
   page with broken or blocked JavaScript still shows all of its content. */

export function Reveal({ children, delay = 0, className }) {
  const ref = useRef(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      el.dataset.shown = 'true'
      return
    }
    /* CSS animation-timeline: view() drives the reveal where supported;
       the observer is only the fallback. */
    if (window.CSS?.supports?.('animation-timeline: view()')) return
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return
          entry.target.dataset.shown = 'true'
          io.unobserve(entry.target)
        })
      },
      { threshold: 0.15, rootMargin: '0px 0px -40px 0px' }
    )
    io.observe(el)
    return () => io.disconnect()
  }, [])

  return (
    <div ref={ref} className={cn('reveal', className)} style={{ '--reveal-delay': `${delay}s` }}>
      {children}
    </div>
  )
}

/* ---------- primitives ---------- */

const PILL_TONE = {
  ok: 'bg-good/15 text-good',
  wait: 'bg-hold/15 text-hold',
  info: 'bg-cool/15 text-cool'
}

export function Pill({ tone = 'info', children }) {
  return (
    <span
      className={cn(
        'inline-block rounded-full px-2.5 py-1 font-mono text-[0.66rem] whitespace-nowrap uppercase tracking-[0.1em]',
        PILL_TONE[tone]
      )}
    >
      {children}
    </span>
  )
}

export function Button({ href, variant = 'primary', children, ...rest }) {
  return (
    <a
      href={href}
      className={cn(
        'inline-block rounded-sm border px-6 py-3 font-mono text-[0.78rem] uppercase tracking-[0.1em] no-underline transition-colors duration-200',
        variant === 'primary'
          ? 'border-transparent bg-ink text-ground hover:bg-cool'
          : 'border-ink/15 text-ink hover:border-cool hover:text-cool'
      )}
      {...rest}
    >
      {children}
    </a>
  )
}

export function Eyebrow({ children, className }) {
  return (
    <p className={cn('font-mono text-[0.72rem] uppercase tracking-[0.16em] text-muted', className)}>
      {children}
    </p>
  )
}

export function SectionHead({ num, title, id }) {
  return (
    <div id={id} className="group mb-10 flex scroll-mt-24 items-baseline gap-[1.1rem] border-b border-ink/6 pb-4">
      {num && (
        <span className="tnum shrink-0 font-mono text-[0.72rem] tracking-[0.1em] text-cool">
          {num}
        </span>
      )}
      <h2 className="font-serif text-[clamp(1.85rem,4vw,2.7rem)] leading-[1.12] tracking-[-0.02em]">
        {title}
      </h2>
      {id && (
        <a
          href={`#${id}`}
          aria-label={`Link to ${title}`}
          className="font-mono text-[0.9rem] text-muted no-underline opacity-0 transition-all hover:text-cool focus-visible:opacity-100 group-hover:opacity-100"
        >
          ¶
        </a>
      )}
    </div>
  )
}

export function Band({ children, className, first = false }) {
  return (
    <section
      className={cn(
        'mx-auto w-full max-w-[74rem] px-[clamp(1.25rem,5vw,4rem)]',
        first ? 'py-[clamp(2.25rem,4.5vw,3.25rem)]' : 'border-t border-ink/6 py-[clamp(3.5rem,9vw,6.5rem)]',
        className
      )}
    >
      {children}
    </section>
  )
}

/* ---------- hairline card grid ---------- */

export function CardGrid({ children, cols = 3 }) {
  return (
    <div
      className={cn(
        'grid gap-px border border-ink/6 bg-ink/6',
        cols === 3
          ? '[grid-template-columns:repeat(auto-fit,minmax(16rem,1fr))]'
          : '[grid-template-columns:repeat(auto-fit,minmax(20rem,1fr))]'
      )}
    >
      {children}
    </div>
  )
}

export function Card({ kicker, title, body, href }) {
  const Tag = href ? 'a' : 'div'
  return (
    <Tag
      href={href}
      {...(href ? { target: '_blank', rel: 'noopener' } : {})}
      className={cn(
        'group relative bg-ground p-7 no-underline',
        href && 'block transition-colors duration-200 hover:bg-surface'
      )}
    >
      <span className="mb-3.5 block font-mono text-[0.7rem] uppercase tracking-[0.13em] text-cool">
        {kicker}
      </span>
      <h3
        className={cn(
          'mb-2 font-serif text-[1.4rem] leading-[1.25] tracking-[-0.012em]',
          href && 'transition-colors group-hover:text-cool'
        )}
      >
        {title}
      </h3>
      <p className="m-0 text-[0.95rem] text-ink-2">{body}</p>
    </Tag>
  )
}
