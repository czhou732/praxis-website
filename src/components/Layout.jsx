import { Cursor } from './Cursor'
import { NAV, SITE } from '../data/site'
import { cn } from './ui'

function Nav ({ current }) {
  return (
    <nav className="sticky top-0 z-100 border-b border-ink/6 bg-ground/85 backdrop-blur-[14px]">
      <div className="mx-auto flex max-w-[74rem] flex-col items-start justify-between gap-3 px-[clamp(1.25rem,5vw,4rem)] py-3.5 sm:flex-row sm:items-center sm:gap-6">
        <a href="/" className="flex items-center gap-2.5 text-ink no-underline">
          <img src="/praxis-mark.png" alt="" className="h-[26px] w-auto" />
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

function Footer () {
  return (
    <footer className="relative overflow-hidden border-t border-ink/6 pt-14 pb-10">
      <img
        src="/praxis-mark.png"
        alt=""
        aria-hidden="true"
        className="pointer-events-none absolute right-[clamp(1.25rem,5vw,4rem)] -bottom-10 w-[clamp(9rem,22vw,16rem)] opacity-5 select-none"
      />
      <div className="relative z-1 mx-auto max-w-[74rem] px-[clamp(1.25rem,5vw,4rem)]">
        <p className="mb-2 font-mono text-[0.75rem] text-muted">
          © 2026 PRAXIS. Founded by Peter Zhou.
        </p>
        <p className="m-0 max-w-[62ch] font-mono text-[0.75rem] text-muted">{SITE.disclaimer}</p>
      </div>
    </footer>
  )
}

export function Layout ({ current, children }) {
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
      <Cursor />
    </>
  )
}
