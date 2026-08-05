import { useEffect, useRef } from 'react'

/**
 * Hero field: a particle cloud that resolves out of noise into the psi mark,
 * then dissolves again as the hero scrolls away.
 *
 * Psi is both the psyche and the wave function, so resolving noise into that
 * glyph is the mission — theory into tools — drawn literally.
 *
 * Always paints one frame synchronously. Without that the hero is blank for
 * anyone whose rAF never runs: reduced-motion users and background tabs.
 */
export function PsiField () {
  const ref = useRef(null)

  useEffect(() => {
    const canvas = ref.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    const reducedQuery = window.matchMedia('(prefers-reduced-motion: reduce)')

    let points = []
    let raf = null
    let frame = 0
    let started = performance.now()
    let w = 0
    let h = 0
    let resizeTimer = null

    const readToken = (name, fallback) =>
      getComputedStyle(document.documentElement).getPropertyValue(name).trim() || fallback

    function glyphTargets () {
      const off = document.createElement('canvas')
      off.width = Math.max(1, Math.round(w))
      off.height = Math.max(1, Math.round(h))
      const o = off.getContext('2d')

      // Wide screens put the mark right of the headline; narrow ones centre it.
      const wide = w > 900
      const size = wide ? Math.min(w * 0.31, h * 0.78) : Math.min(w * 0.62, h * 0.5)
      const cx = wide ? w * 0.79 : w * 0.5
      const cy = wide ? h * 0.5 : h * 0.66

      o.fillStyle = '#fff'
      o.font = `400 ${size}px ${readToken('--font-serif', 'serif')}`
      o.textAlign = 'center'
      o.textBaseline = 'middle'
      o.fillText('Ψ', cx, cy)

      const data = o.getImageData(0, 0, off.width, off.height).data
      const found = []
      for (let y = 0; y < off.height; y += 4) {
        for (let x = 0; x < off.width; x += 4) {
          if (data[(y * off.width + x) * 4 + 3] > 130) found.push({ x, y })
        }
      }
      return found
    }

    /**
     * `pos` moves particles from noise to the glyph; `alpha` fades them in.
     * Splitting the two is what lets reduced motion still have an entrance:
     * the mark assembles in opacity while every particle stays put, so nothing
     * travels across the screen.
     */
    function render (pos, alpha) {
      ctx.clearRect(0, 0, w, h)
      if (!points.length || alpha <= 0) return

      const cool = readToken('--color-cool', '#6E9BFF')
      const muted = readToken('--color-muted', '#6F7C90')
      const reduced = reducedQuery.matches

      // soft bloom so the mark reads against the ground
      if (pos > 0.15) {
        const mid = points[Math.floor(points.length / 2)]
        const glow = ctx.createRadialGradient(mid.tx, mid.ty, 0, mid.tx, mid.ty, Math.min(w, h) * 0.42)
        glow.addColorStop(0, `rgba(110, 155, 255, ${(0.13 * pos * alpha).toFixed(3)})`)
        glow.addColorStop(1, 'rgba(110, 155, 255, 0)')
        ctx.fillStyle = glow
        ctx.fillRect(0, 0, w, h)
      }

      ctx.fillStyle = pos > 0.55 ? cool : muted
      for (let i = 0; i < points.length; i++) {
        const p = points[i]
        const drift = reduced ? 0 : Math.sin(frame * 0.011 + p.phase) * (1 - pos) * 8
        // Once resolved, each particle keeps breathing on its own phase, so the
        // mark stays alive rather than freezing into a static logo.
        const pulse = reduced ? 1 : 1 + Math.sin(frame * 0.02 + p.phase) * 0.32 * pos
        // Staggering the fade by height makes the mark develop top-to-bottom
        // like a scan rather than flashing on all at once. It is the entrance
        // reduced-motion users get in place of the travelling particles.
        const local = alpha >= 1 ? 1 : Math.max(0, Math.min(1, alpha * 1.6 - p.stagger * 0.6))
        ctx.beginPath()
        ctx.arc(
          p.nx + (p.tx - p.nx) * pos + drift,
          p.ny + (p.ty - p.ny) * pos + drift * 0.55,
          1.35 + pos * 0.85,
          0,
          Math.PI * 2
        )
        ctx.globalAlpha = (0.24 + pos * 0.56) * local * pulse
        ctx.fill()
      }
      ctx.globalAlpha = 1
    }

    function loop () {
      frame++
      const reduced = reducedQuery.matches
      const e = Math.min(1, (performance.now() - started) / (reduced ? 1400 : 2400))
      const eased = e * e * (3 - 2 * e)
      const scrolled = Math.min(1, window.scrollY / Math.max(1, window.innerHeight * 0.9))

      // Reduced motion: particles are already home, the entrance is pure fade,
      // and scrolling dissolves the mark by opacity instead of by displacement.
      if (reduced) render(1, Math.max(0, eased - scrolled))
      else render(Math.max(0, eased - scrolled), 1)

      raf = requestAnimationFrame(loop)
    }

    function build () {
      if (raf) { cancelAnimationFrame(raf); raf = null }

      const rect = canvas.getBoundingClientRect()
      const dpr = Math.min(window.devicePixelRatio || 1, 2)
      w = rect.width
      h = rect.height
      canvas.width = Math.max(1, Math.round(w * dpr))
      canvas.height = Math.max(1, Math.round(h * dpr))
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)

      const targets = glyphTargets()
      const cap = window.innerWidth < 700 ? 700 : 1500
      const count = Math.min(targets.length, cap)
      const top = Math.min(...targets.map((t) => t.y))
      const span = Math.max(1, Math.max(...targets.map((t) => t.y)) - top)
      points = []
      for (let i = 0; i < count; i++) {
        const t = targets[Math.floor((i * targets.length) / count)]
        if (!t) continue
        points.push({
          nx: Math.random() * w,
          ny: Math.random() * h,
          tx: t.x,
          ty: t.y,
          phase: Math.random() * Math.PI * 2,
          // mostly a top-to-bottom sweep, softened so the edge is not a hard line
          stagger: Math.min(1, ((t.y - top) / span) * 0.85 + Math.random() * 0.15)
        })
      }

      started = performance.now()
      // A hidden tab never runs rAF, so paint the resolved mark straight away
      // rather than leaving the hero empty. A visible tab starts from noise and
      // is allowed to animate — that entrance is the whole point of the hero.
      if (document.hidden) render(1, 1)
      raf = requestAnimationFrame(loop)
    }

    // Sample the glyph only once the serif has loaded, or it traces a fallback.
    if (document.fonts?.ready) document.fonts.ready.then(build).catch(build)
    else build()

    const onResize = () => {
      clearTimeout(resizeTimer)
      resizeTimer = setTimeout(build, 180)
    }
    // If the page loaded in a background tab the resolve would have run against
    // a throttled clock and be over before anyone looked. Restart it on the
    // first time the tab is actually shown.
    let seen = !document.hidden
    const onVisible = () => {
      if (document.hidden || seen) return
      seen = true
      started = performance.now()
    }

    window.addEventListener('resize', onResize)
    document.addEventListener('visibilitychange', onVisible)
    reducedQuery.addEventListener('change', build)

    return () => {
      clearTimeout(resizeTimer)
      if (raf) cancelAnimationFrame(raf)
      window.removeEventListener('resize', onResize)
      document.removeEventListener('visibilitychange', onVisible)
      reducedQuery.removeEventListener('change', build)
    }
  }, [])

  return <canvas ref={ref} aria-hidden="true" className="absolute inset-0 z-0 h-full w-full" />
}
