import { useEffect, useState } from 'react'
import { FOLLOW_URL, NAV, SITE } from '../data/site'
import { cn } from './ui'

/* Plain nav link: no mouse-tracking spring, just the hover underline bar.
   The underline is functional (shows which link the pointer is on); the
   magnetic motion that used to live here was ornament. */
function NavLink({ href, active, external, children }) {
  return (
    <a
      href={href}
      aria-current={active ? 'page' : undefined}
      target={external ? '_blank' : undefined}
      rel={external ? 'noopener' : undefined}
      className={cn(
        'group relative whitespace-nowrap pb-0.5 no-underline transition-colors',
        active ? 'text-ink' : 'text-muted hover:text-ink',
        external && 'hover:text-cool'
      )}
    >
      <span className="inline-block">{children}</span>
      <span
        aria-hidden="true"
        className={cn(
          'absolute bottom-0 h-px transition-all duration-400 ease-[cubic-bezier(0.22,1,0.36,1)]',
          active
            ? 'left-0 w-full bg-cool'
            : 'left-1/2 w-0 group-hover:left-0 group-hover:w-full',
          !active && !external && 'bg-ink group-hover:bg-ink',
          external && 'bg-cool'
        )}
      />
    </a>
  )
}

function Nav({ current }) {
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 60)
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    onScroll()
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <nav 
      data-boot 
      className={cn(
        "vt-nav sticky top-0 z-100 transition-all duration-500",
        scrolled 
          ? "border-b border-ink/10 bg-ground/75 backdrop-blur-[16px] saturate-[180%]" 
          : "border-b border-transparent bg-transparent backdrop-blur-none saturate-100"
      )}
    >
      <div className="mx-auto flex max-w-[74rem] flex-col items-start justify-between gap-3 px-[clamp(1.25rem,5vw,4rem)] py-3.5 sm:flex-row sm:items-center sm:gap-6">
        <a href="/" className="flex items-center gap-2.5 text-ink no-underline">
          <img src="/praxis-mark.png" alt="" className="vt-mark h-[26px] w-auto" />
          <span className="font-mono text-[0.82rem] uppercase tracking-[0.22em]">Praxis</span>
        </a>
        <div className="flex flex-wrap gap-[clamp(0.9rem,3vw,2rem)] font-mono text-[0.78rem] tracking-[0.05em]">
          {NAV.map((item) => (
            <NavLink key={item.href} href={item.href} active={item.href === current}>
              {item.label}
            </NavLink>
          ))}
          {/* Follow is external (Luma). */}
          <NavLink href={FOLLOW_URL} external>
            Follow <span aria-hidden="true">↗</span>
          </NavLink>
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
        className="pointer-events-none absolute right-[clamp(1.25rem,5vw,4rem)] top-10 h-[9.5rem] w-auto select-none opacity-[0.05]"
      />
      <div className="relative mx-auto max-w-[74rem] px-[clamp(1.25rem,5vw,4rem)] pt-10 pb-12">
        <p className="mb-4 font-mono text-[0.75rem] text-muted">
          © 2026 PRAXIS. Founded by Peter Zhou.
        </p>
        <p className="m-0 max-w-[52ch] font-mono text-[0.75rem] leading-[1.75] text-muted">
          {SITE.disclaimer}
        </p>
        
        {/* The Colophon */}
        <div className="mt-12 pt-6 border-t border-ink/6 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <p className="m-0 font-mono text-[0.65rem] uppercase tracking-widest text-muted/50">
            Typeset in IBM Plex Mono &amp; Newsreader. Engineered in React.
          </p>
          <p className="m-0 font-mono text-[0.65rem] uppercase tracking-widest text-muted/50">
            <a href="https://github.com/czhou732" target="_blank" rel="noopener" className="hover:text-cool transition-colors">Open Source</a>
          </p>
        </div>
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
      <Nav current={current} />
      <main id="main">{children}</main>
      <Footer />
    </>
  )
}
