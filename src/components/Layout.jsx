import { useEffect, useState } from 'react'
import { Cursor } from './Cursor'
import { MAILING_LIST_URL, NAV, SITE } from '../data/site'
import { cn } from './ui'

/* Recording-position readout: a vertical track pinned to the right edge, the
   way a scrollbar reads, rather than a bar under the nav — at the top it
   competed with the nav's own underline and looked like a loading state.
   Client-only; the prerendered markup carries an empty track. */
function ScrollProgress() {
  const [p, setP] = useState(0)
  useEffect(() => {
    let raf = null
    const update = () => {
      const max = document.documentElement.scrollHeight - window.innerHeight
      setP(max > 0 ? Math.min(1, window.scrollY / max) : 0)
    }
    const onScroll = () => {
      if (raf) return
      raf = requestAnimationFrame(() => {
        raf = null
        update()
      })
    }
    update()
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll)
    return () => {
      if (raf) cancelAnimationFrame(raf)
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
    }
  }, [])
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none fixed top-0 right-0 z-90 hidden h-full w-px bg-ink/8 md:block"
    >
      <div className="w-full bg-cool" style={{ height: `${p * 100}%` }} />
      {p > 0.005 && (
        <span
          className="tnum absolute right-3 font-mono text-[0.58rem] tracking-[0.1em] whitespace-nowrap text-cool"
          style={{ top: `calc(${p * 100}% - 0.55rem)` }}
        >
          {Math.round(p * 100)}%
        </span>
      )}
    </div>
  )
}

function Nav({ current }) {
  return (
    <nav data-boot className="vt-nav sticky top-0 z-100 border-b border-ink/6 bg-ground/85 backdrop-blur-[14px]">
      <div className="mx-auto flex max-w-[74rem] flex-col items-start justify-between gap-3 px-[clamp(1.25rem,5vw,4rem)] py-3.5 sm:flex-row sm:items-center sm:gap-6">
        <a href="/" className="flex items-center gap-2.5 text-ink no-underline">
          <img src="/praxis-mark.png" alt="" className="vt-mark h-[26px] w-auto" />
          <span className="font-mono text-[0.82rem] uppercase tracking-[0.22em]">Praxis</span>
        </a>
        <div className="flex flex-wrap gap-[clamp(0.9rem,3vw,2rem)] font-mono text-[0.78rem] tracking-[0.05em]">
          {NAV.map((item) => {
            const active = item.href === current
            return (
              <a
                key={item.href}
                href={item.href}
                aria-current={active ? 'page' : undefined}
                className={cn(
                  'whitespace-nowrap border-b pb-0.5 no-underline transition-colors',
                  active ? 'border-cool text-ink' : 'border-transparent text-muted hover:text-ink'
                )}
              >
                {item.label}
              </a>
            )
          })}
          {/* Subscribe is external (Google Form). Same weight as the internal
             links so it reads as a nav item, not a CTA — the arrow signals the
             cross-origin hop. */}
          <a
            href={MAILING_LIST_URL}
            target="_blank"
            rel="noopener"
            className="whitespace-nowrap border-b border-transparent pb-0.5 text-muted no-underline transition-colors hover:text-cool"
          >
            Subscribe <span aria-hidden="true">↗</span>
          </a>
        </div>
      </div>
    </nav>
  )
}

/* Credit line, the non-affiliation disclaimer, and the mark set large and very
   low-contrast behind them. No signal strip, no clock, no sys readout — those
   were chrome. */
function Footer() {
  return (
    <footer className="relative overflow-hidden border-t border-ink/6">
      <img
        src="/praxis-mark.png"
        alt=""
        aria-hidden="true"
        className="pointer-events-none absolute right-[clamp(1.25rem,5vw,4rem)] bottom-7 h-[9.5rem] w-auto select-none opacity-[0.05]"
      />
      <div className="relative mx-auto max-w-[74rem] px-[clamp(1.25rem,5vw,4rem)] pt-10 pb-12">
        <p className="mb-4 font-mono text-[0.75rem] text-muted">
          © 2026 PRAXIS. Founded by Peter Zhou.
        </p>
        <p className="m-0 max-w-[52ch] font-mono text-[0.75rem] leading-[1.75] text-muted">
          {SITE.disclaimer}
        </p>
      </div>
    </footer>
  )
}

export function Layout({ current, children }) {
  /* Load fade-in: the page itself arrives — no overlay, no loader. html.boot
     was set before paint by an inline script (with a 1.4s hard cap of its
     own); we just stagger [data-boot] elements in after hydration. */
  useEffect(() => {
    document.querySelectorAll('[data-boot]').forEach((el, i) => {
      setTimeout(() => el.classList.add('boot-in'), 60 + i * 70)
    })
  }, [])

  return (
    <>
      <a
        href="#main"
        className="absolute -left-[9999px] top-0 z-999 bg-cool px-4 py-2.5 font-mono text-[0.8rem] text-ground focus:left-0"
      >
        Skip to content
      </a>
      {/* Outside <Nav>: its backdrop-filter would become the containing block
         for a fixed child and pin the track to the nav instead of the viewport. */}
      <ScrollProgress />
      <Nav current={current} />
      <main id="main">{children}</main>
      <Footer />
      <Cursor />
    </>
  )
}
