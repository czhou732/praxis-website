import { useEffect, useRef, useState } from 'react'
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

function MarkovReveal({ text }) {
  const [display, setDisplay] = useState('')
  const [revealed, setRevealed] = useState(false)
  const ref = useRef(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return

    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting && !revealed) {
        setRevealed(true)
        observer.disconnect()
        
        const chars = '01ACTGλψ+-'
        let iterations = 0
        const maxIterations = 20
        
        const interval = setInterval(() => {
          setDisplay(() => {
            return text
              .split('')
              .map((letter, index) => {
                if (letter === ' ') return ' '
                // Probabilistic lock-in: characters lock from left to right as iterations increase
                if (index < (iterations / maxIterations) * text.length) {
                  return letter
                }
                return chars[Math.floor(Math.random() * chars.length)]
              })
              .join('')
          })
          
          if (iterations >= maxIterations) clearInterval(interval)
          iterations += 1
        }, 40) // 40ms per frame
      }
    }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' })

    observer.observe(el)
    return () => {
      observer.disconnect()
    }
  }, [text, revealed])

  // Prerender safe: show text if not hydrated, or keep opacity 0 before reveal to avoid flash
  return (
    <span ref={ref} className="inline-block transition-opacity duration-300">
      {display || text}
    </span>
  )
}

export function SectionHead({ num, title, id }) {
  return (
    <div id={id} className="group relative mb-12 flex scroll-mt-24 items-baseline pb-4">
      {num && (
        <span className="section-num tnum shrink-0 font-mono text-[0.65rem] tracking-[0.12em] text-cool/70 w-8 md:absolute md:-left-[2.8rem] md:top-[0.8rem] md:w-auto">
          {num}
        </span>
      )}
      <h2 className="section-title font-serif text-[clamp(1.85rem,4vw,2.7rem)] leading-[1.12] tracking-[-0.02em]">
        <MarkovReveal text={title} />
      </h2>
      {id && (
        <a
          href={`#${id}`}
          aria-label={`Link to ${title}`}
          className="ml-[1.1rem] font-mono text-[0.9rem] text-muted no-underline opacity-0 transition-all hover:text-cool focus-visible:opacity-100 group-hover:opacity-100"
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
        first ? 'py-[clamp(2.25rem,4.5vw,3.25rem)]' : 'py-[clamp(4rem,10vw,7rem)]',
        className
      )}
    >
      {children}
    </section>
  )
}

/* ---------- card grid ---------- */

export function CardGrid({ children, cols = 3 }) {
  const handlePointerMove = (e) => {
    const rect = e.currentTarget.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top
    e.currentTarget.style.setProperty('--mouse-x', `${x}px`)
    e.currentTarget.style.setProperty('--mouse-y', `${y}px`)
  }
  const handlePointerLeave = (e) => {
    e.currentTarget.style.setProperty('--mouse-x', `-999px`)
    e.currentTarget.style.setProperty('--mouse-y', `-999px`)
  }

  return (
    <div
      onPointerMove={handlePointerMove}
      onPointerLeave={handlePointerLeave}
      className={cn(
        'group/grid relative grid gap-px border border-ink/6 bg-ink/6 overflow-hidden',
        cols === 3
          ? '[grid-template-columns:repeat(auto-fit,minmax(16rem,1fr))]'
          : '[grid-template-columns:repeat(auto-fit,minmax(20rem,1fr))]'
      )}
    >
      <div
        className="pointer-events-none absolute inset-0 z-0 opacity-0 mix-blend-screen transition-opacity duration-500 group-hover/grid:opacity-100"
        style={{
          background: 'radial-gradient(400px circle at var(--mouse-x, -999px) var(--mouse-y, -999px), rgba(110, 155, 255, 0.4), transparent 40%)'
        }}
      />
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
        'group relative z-10 flex h-full flex-col bg-ground p-7 no-underline',
        href && 'transition-colors duration-200 hover:bg-surface'
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

/* ---------- sub-links under a page header ----------
   Keeps the top bar to four items: sections of this page (#anchors) plus the
   pages that used to sit in the nav (Curriculum, Podcast). `current` marks the
   page you are on. */
export function SubNav({ items, label }) {
  return (
    <nav
      aria-label={label}
      className="mt-7 flex flex-wrap gap-x-7 gap-y-2 border-t border-ink/6 pt-4 font-mono text-[0.75rem] tracking-[0.05em]"
    >
      {items.map((item) => (
        <a
          key={item.href}
          href={item.href}
          aria-current={item.current ? 'page' : undefined}
          className={cn(
            'no-underline transition-colors',
            item.current ? 'text-ink' : 'text-muted hover:text-ink'
          )}
        >
          {item.label}
        </a>
      ))}
    </nav>
  )
}

/* ---------- Spotify glyph (Simple Icons, CC0), inherits text color ---------- */
export function SpotifyIcon({ className }) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" fill="currentColor" className={className}>
      <path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.419 1.56-.299.421-1.02.599-1.559.3z" />
    </svg>
  )
}
