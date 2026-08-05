import { useEffect, useRef } from 'react'

const INTERACTIVE = 'a, button, [role="button"], input, textarea, select, summary'
const MAX_V = 60
const TRAIL_MAX = 80

/**
 * Custom cursor, drawn as three layers on one canvas:
 *
 *   core dot     tracks the pointer exactly, no easing, so clicking stays honest
 *   ring         follows on a spring; expands into a reticle over anything interactive
 *   signal trace a decaying polyline whose amplitude comes from pointer velocity —
 *                move fast and it spikes like an EEG artifact, hold still and it flatlines
 *
 * Reduced motion does NOT remove the cursor: it drops the trail and the spring
 * so the ring tracks instantly. Touch devices keep the native cursor entirely.
 */
export function Cursor () {
  const ref = useRef(null)

  useEffect(() => {
    const canvas = ref.current
    if (!canvas) return

    const finePointer = window.matchMedia('(pointer: fine)')
    const reducedQuery = window.matchMedia('(prefers-reduced-motion: reduce)')

    let raf = null
    let teardown = null

    const readToken = (name, fallback) =>
      getComputedStyle(document.documentElement).getPropertyValue(name).trim() || fallback

    function start () {
      if (!finePointer.matches) return

      const ctx = canvas.getContext('2d')
      let w = 0
      let h = 0

      let px = window.innerWidth / 2
      let py = window.innerHeight / 2
      let rx = px
      let ry = py
      let velocity = 0
      let locked = false
      let visible = false
      const trail = []

      const resize = () => {
        const dpr = Math.min(window.devicePixelRatio || 1, 2)
        w = window.innerWidth
        h = window.innerHeight
        canvas.width = Math.round(w * dpr)
        canvas.height = Math.round(h * dpr)
        ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
      }
      resize()

      const onMove = (e) => {
        velocity = Math.min(Math.hypot(e.clientX - px, e.clientY - py), MAX_V)
        px = e.clientX
        py = e.clientY
        if (!visible) { rx = px; ry = py }
        visible = true
        locked = !!(e.target instanceof Element && e.target.closest(INTERACTIVE))
        if (!reducedQuery.matches) {
          trail.push({ x: px, y: py, a: 1, v: velocity })
          if (trail.length > TRAIL_MAX) trail.shift()
        }
      }

      const hide = () => { visible = false; trail.length = 0 }

      window.addEventListener('pointermove', onMove, { passive: true })
      window.addEventListener('pointerdown', onMove, { passive: true })
      document.addEventListener('pointerleave', hide)
      window.addEventListener('blur', hide)
      window.addEventListener('resize', resize)

      // The native cursor is hidden only once we have actually drawn a frame.
      // If rAF never runs — throttled tab, canvas failure — the real cursor
      // stays, rather than leaving the page with no pointer at all.
      let painted = false

      const draw = () => {
        const reduced = reducedQuery.matches
        ctx.clearRect(0, 0, w, h)

        if (visible) {
          // Monochrome by design. A two-colour cursor competes with the page for
          // attention; a white instrument reads as part of the interface.
          const ink = readToken('--color-ink', '#E9EDF4')

          if (reduced) {
            rx = px
            ry = py
          } else {
            rx += (px - rx) * 0.16
            ry += (py - ry) * 0.16

            // signal trace
            if (trail.length > 1) {
              ctx.lineWidth = 1
              ctx.strokeStyle = ink
              for (let i = 1; i < trail.length; i++) {
                const a = trail[i]
                const b = trail[i - 1]
                const amp = (a.v / MAX_V) * 8
                ctx.beginPath()
                ctx.globalAlpha = a.a * 0.22
                ctx.moveTo(b.x, b.y + Math.sin((i - 1) * 0.85) * amp)
                ctx.lineTo(a.x, a.y + Math.sin(i * 0.85) * amp)
                ctx.stroke()
                a.a *= 0.95
              }
              ctx.globalAlpha = 1
              while (trail.length && trail[0].a < 0.03) trail.shift()
            }
          }

          const radius = locked ? 24 : 14

          // ring — the lock state reads as weight and size, never as hue
          ctx.beginPath()
          ctx.arc(rx, ry, radius, 0, Math.PI * 2)
          ctx.strokeStyle = ink
          ctx.lineWidth = locked ? 1.5 : 1
          ctx.globalAlpha = locked ? 0.85 : 0.4
          ctx.stroke()

          // reticle ticks, so hovering reads as an instrument acquiring a target
          if (locked) {
            ctx.lineWidth = 1.2
            ctx.globalAlpha = 0.85
            for (let i = 0; i < 4; i++) {
              const angle = (Math.PI / 2) * i
              const dx = Math.cos(angle)
              const dy = Math.sin(angle)
              ctx.beginPath()
              ctx.moveTo(rx + dx * (radius + 3), ry + dy * (radius + 3))
              ctx.lineTo(rx + dx * (radius + 7), ry + dy * (radius + 7))
              ctx.stroke()
            }
          }
          ctx.globalAlpha = 1

          // core — the one element that tracks the pointer exactly
          ctx.beginPath()
          ctx.arc(px, py, locked ? 1.2 : 2.2, 0, Math.PI * 2)
          ctx.fillStyle = ink
          ctx.globalAlpha = 0.95
          ctx.fill()
          ctx.globalAlpha = 1

          velocity *= 0.9

          if (!painted) {
            painted = true
            document.body.dataset.cursor = 'on'
          }
        }

        raf = requestAnimationFrame(draw)
      }
      raf = requestAnimationFrame(draw)

      teardown = () => {
        if (raf) cancelAnimationFrame(raf)
        raf = null
        window.removeEventListener('pointermove', onMove)
        window.removeEventListener('pointerdown', onMove)
        document.removeEventListener('pointerleave', hide)
        window.removeEventListener('blur', hide)
        window.removeEventListener('resize', resize)
        delete document.body.dataset.cursor
        ctx.clearRect(0, 0, w, h)
      }
    }

    start()

    // A pointer can be added or removed mid-session (tablet docked to a keyboard).
    const onPointerChange = () => {
      if (teardown) { teardown(); teardown = null }
      start()
    }
    finePointer.addEventListener('change', onPointerChange)

    return () => {
      finePointer.removeEventListener('change', onPointerChange)
      if (teardown) teardown()
    }
  }, [])

  return (
    <canvas
      ref={ref}
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 z-[9999] h-full w-full"
    />
  )
}
