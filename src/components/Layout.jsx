import { useEffect, useState } from 'react'
import { Cursor } from './Cursor'
import { NAV, SITE } from '../data/site'
import { cn } from './ui'

/* Recording-position readout: a 1px cool fill under the nav tracking scroll.
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
    <div aria-hidden="true" className="absolute inset-x-0 bottom-0 h-px">
      <div className="h-full bg-cool" style={{ width: `${p * 100}%` }} />
      {p > 0.005 && (
        <span className="tnum absolute right-[clamp(1.25rem,5vw,4rem)] -bottom-[1.1rem] font-mono text-[0.58rem] tracking-[0.1em] text-cool">
          {Math.round(p * 100)}%
        </span>
      )}
    </div>
  )
}

function Nav({ current }) {
  return (
    <nav data-boot className="vt-nav sticky top-0 z-100 border-b border-ink/6 bg-ground/85 backdrop-blur-[14px]">
      <ScrollProgress />
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
        </div>
      </div>
    </nav>
  )
}

/* No footer. The signal strip, the clock, the sys readout and the duplicated
   copyright were chrome — they told a visitor nothing. What is left is the one
   sentence that keeps every other page on this site accurate: PRAXIS is not a
   registered student organization. That cannot be dropped along with the
   furniture, so it stays as a single colophon line. */
function Colophon() {
  return (
    <footer className="mx-auto w-full max-w-[74rem] px-[clamp(1.25rem,5vw,4rem)]">
      <p className="m-0 max-w-[62ch] border-t border-ink/6 py-7 font-mono text-[0.72rem] leading-[1.7] text-muted">
        © 2026 PRAXIS · {SITE.disclaimer}
      </p>
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
      <Nav current={current} />
      <main id="main">{children}</main>
      <Colophon />
      <Cursor />
    </>
  )
}
