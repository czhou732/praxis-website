import { Cursor } from '../components/Cursor'
import { Reveal } from '../components/ui'

export default function NotFound() {
  return (
    <div className="relative min-h-[100dvh] w-full overflow-hidden bg-[#06080D] flex flex-col items-center justify-center p-6 selection:bg-cool/30 selection:text-cool">
      {/* Film Grain */}
      <div 
        className="pointer-events-none fixed inset-0 z-[9999] opacity-[0.025] mix-blend-screen"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
        }}
      />

      <Reveal>
        <div className="flex flex-col items-center text-center">
          {/* TDE Equation */}
          <div className="mb-16 cursor-default font-serif text-[clamp(2rem,6vw,4.5rem)] italic tracking-wide text-cool/90 drop-shadow-[0_0_30px_rgba(110,155,255,0.4)]">
            &delta;<sub className="text-[0.5em] not-italic ml-0.5">t</sub> = r<sub className="text-[0.5em] not-italic ml-0.5">t</sub> + &gamma;V(s<sub className="text-[0.5em] not-italic ml-0.5">t+1</sub>) - V(s<sub className="text-[0.5em] not-italic ml-0.5">t</sub>)
          </div>

          {/* Terminal message */}
          <div className="font-mono text-[0.85rem] text-muted tracking-widest uppercase">
            [ State Value Not Found. <a href="/" className="text-cool hover:text-cool/80 transition-colors border-b border-cool/40 pb-0.5 outline-none">Return to origin</a> ]
          </div>
        </div>
      </Reveal>
      
      <Cursor />
    </div>
  )
}
