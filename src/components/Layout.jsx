import { useEffect, useState, useRef } from 'react'
import { motion, useMotionValue, useSpring } from 'motion/react'
import { Cursor } from './Cursor'
import { FOLLOW_URL, NAV, SITE } from '../data/site'
import { cn } from './ui'

function MagneticLink({ href, active, external, children }) {
  const ref = useRef(null)
  
  const x = useMotionValue(0)
  const y = useMotionValue(0)
  
  // Apple-like spring physics
  const springConfig = { damping: 15, stiffness: 150, mass: 0.1 }
  const springX = useSpring(x, springConfig)
  const springY = useSpring(y, springConfig)
  
  const handleMove = (e) => {
    const el = ref.current
    if (!el || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    const rect = el.getBoundingClientRect()
    const cx = rect.left + rect.width / 2
    const cy = rect.top + rect.height / 2
    x.set((e.clientX - cx) * 0.35)
    y.set((e.clientY - cy) * 0.5)
  }
  
  const handleLeave = () => {
    x.set(0)
    y.set(0)
  }
  
  return (
    <a
      ref={ref}
      href={href}
      aria-current={active ? 'page' : undefined}
      target={external ? '_blank' : undefined}
      rel={external ? 'noopener' : undefined}
      onMouseMove={handleMove}
      onMouseLeave={handleLeave}
      className={cn(
        'group relative whitespace-nowrap pb-0.5 no-underline transition-colors before:absolute before:-inset-y-3 before:-inset-x-2 before:content-[""]',
        active ? 'text-ink' : 'text-muted hover:text-ink',
        external && 'hover:text-cool'
      )}
    >
      <motion.span
        className="inline-block"
        style={{ x: springX, y: springY }}
      >
        {children}
      </motion.span>
      <span 
        aria-hidden="true" 
        className={cn(
          "absolute bottom-0 h-px bg-cool transition-all duration-400 ease-[cubic-bezier(0.22,1,0.36,1)]",
          active 
            ? "left-0 w-full" 
            : "left-1/2 w-0 group-hover:left-0 group-hover:w-full",
          !active && !external && "bg-ink group-hover:bg-ink",
          external && "bg-cool"
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
            <MagneticLink key={item.href} href={item.href} active={item.href === current}>
              {item.label}
            </MagneticLink>
          ))}
          {/* Follow is external (Luma). */}
          <MagneticLink href={FOLLOW_URL} external>
            Follow <span aria-hidden="true">↗</span>
          </MagneticLink>
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
      {/* Impeccable Shape/Colorize: Film Grain / Digital Noise */}
      <div 
        className="pointer-events-none fixed inset-0 z-[9999] opacity-[0.025] mix-blend-screen"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
        }}
      />
      <a
        href="#main"
        className="absolute -left-[9999px] top-0 z-999 bg-cool px-4 py-2.5 font-mono text-[0.8rem] text-ground focus:left-0"
      >
        Skip to content
      </a>
      {/* Outside <Nav>: its backdrop-filter would become the containing block
         for a fixed child and pin the track to the nav instead of the viewport. */}
      <Nav current={current} />
      <main id="main">{children}</main>
      <Footer />
      <Cursor />
    </>
  )
}
