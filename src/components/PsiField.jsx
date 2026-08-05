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

    function render (progress) {
      ctx.clearRect(0, 0, w, h)
      if (!points.length) return

      const cool = readToken('--color-cool', '#6E9BFF')
      const muted = readToken('--color-muted', '#6F7C90')
      const reduced = reducedQuery.matches

      // soft bloom so the mark reads against the ground
      if (progress > 0.15) {
        const mid = points[Math.floor(points.length / 2)]
        const glow = ctx.createRadialGradient(mid.tx, mid.ty, 0, mid.tx, mid.ty, Math.min(w, h) * 0.42)
        glow.addColorStop(0, `rgba(110, 155, 255, ${(0.13 * progress).toFixed(3)})`)
        glow.addColorStop(1, 'rgba(110, 155, 255, 0)')
        ctx.fillStyle = glow
        ctx.fillRect(0, 0, w, h)
      }

      ctx.fillStyle = progress > 0.55 ? cool : muted
      for (let i = 0; i < points.length; i++) {
        const p = points[i]
        const drift = reduced ? 0 : Math.sin(frame * 0.011 + p.phase) * (1 - progress) * 8
        ctx.beginPath()
        ctx.arc(
          p.nx + (p.tx - p.nx) * progress + drift,
          p.ny + (p.ty - p.ny) * progress + drift * 0.55,
          1.35 + progress * 0.85,
          0,
          Math.PI * 2
        )
        ctx.globalAlpha = 0.24 + progress * 0.56
        ctx.fill()
      }
      ctx.globalAlpha = 1
    }

    function loop () {
      frame++
      const e = Math.min(1, (performance.now() - started) / 2400)
      const resolve = e * e * (3 - 2 * e)
      const scrolled = Math.min(1, window.scrollY / Math.max(1, window.innerHeight * 0.9))
      render(Math.max(0, resolve - scrolled))
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
      points = []
      for (let i = 0; i < count; i++) {
        const t = targets[Math.floor((i * targets.length) / count)]
        if (!t) continue
        points.push({
          nx: Math.random() * w,
          ny: Math.random() * h,
          tx: t.x,
          ty: t.y,
          phase: Math.random() * Math.PI * 2
        })
      }

      started = performance.now()
      const reduced = reducedQuery.matches
      render(reduced ? 1 : 0)
      if (!reduced) raf = requestAnimationFrame(loop)
    }

    // Sample the glyph only once the serif has loaded, or it traces a fallback.
    if (document.fonts?.ready) document.fonts.ready.then(build).catch(build)
    else build()

    const onResize = () => {
      clearTimeout(resizeTimer)
      resizeTimer = setTimeout(build, 180)
    }
    window.addEventListener('resize', onResize)
    reducedQuery.addEventListener('change', build)

    return () => {
      clearTimeout(resizeTimer)
      if (raf) cancelAnimationFrame(raf)
      window.removeEventListener('resize', onResize)
      reducedQuery.removeEventListener('change', build)
    }
  }, [])

  return <canvas ref={ref} aria-hidden="true" className="absolute inset-0 z-0 h-full w-full" />
}
