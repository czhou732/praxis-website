import { useEffect, useRef } from 'react'

/**
 * Hero field: eight channels of EEG-like trace that fold, left to right like
 * a playhead, into the psi mark. The same points that draw the waves become
 * the glyph — nothing is discarded. Raw signal into clinical tool, drawn
 * literally.
 *
 * s (structure) resolves as the hero enters and dissolves as it scrolls away.
 * Reduced motion freezes the wave clock — the traces hold still — but s still
 * animates, so the fold still happens. Reduced, never removed.
 *
 * Always paints one frame synchronously when built in a hidden tab. Without
 * that the hero is blank for anyone whose rAF never runs.
 */
const CHANNELS = 8
/* Points per channel. The mark is only as solid as the number of points that
   land on it: the glyph's 4px sample lattice holds ~3300 positions at desktop
   size, so 1200 points filled barely a third of it and the strokes read as
   stringy. Sized to fill the lattice on wide screens, and kept low on narrow
   ones where the canvas — and the lattice — are much smaller. */
const perChannelFor = (w) => (w > 900 ? 410 : 170)
const BUCKETS = 8

/* Two slow sines carry the rhythm; the fifth-power term fires rarely and
   sharply, which is what gives a real trace its spikes. */
function waveAt(x, phase, clock) {
  return (
    Math.sin(x * 0.021 + clock * 1.6 + phase) * 0.55 +
    Math.sin(x * 0.052 - clock * 2.3 + phase * 1.7) * 0.26 +
    Math.pow(Math.sin(x * 0.011 + clock * 0.9 + phase * 0.5), 5) * 0.5
  )
}

function hexToRgb(hex, fallback) {
  const m = /^#?([0-9a-f]{6})$/i.exec(hex.trim())
  if (!m) return fallback
  const v = parseInt(m[1], 16)
  return [(v >> 16) & 255, (v >> 8) & 255, v & 255]
}

export function PsiField() {
  const ref = useRef(null)

  useEffect(() => {
    const canvas = ref.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    const reducedQuery = window.matchMedia('(prefers-reduced-motion: reduce)')

    let pts = []
    let rows = []
    let raf = null
    let clock = 0
    let last = performance.now()
    let started = performance.now()
    let w = 0
    let h = 0
    let resizeTimer = null
    let mx = -9999
    let my = -9999
    let glyphCx = 0
    let glyphCy = 0

    const readToken = (name, fallback) =>
      getComputedStyle(document.documentElement).getPropertyValue(name).trim() || fallback

    /* Rasterise the glyph at a given size and return its sample lattice.
       No horizontal compression — squeezing the letterform to 0.8 made the
       strokes too narrow to carry more than a couple of dots across. */
    function sampleAt(size, cx, cy) {
      const off = document.createElement('canvas')
      off.width = Math.round(w)
      off.height = Math.round(h)
      const o = off.getContext('2d')
      o.fillStyle = '#fff'
      o.font = `400 ${size}px ${readToken('--font-serif', 'serif')}`
      o.textAlign = 'center'
      o.textBaseline = 'middle'
      o.fillText('Ψ', cx, cy)

      const data = o.getImageData(0, 0, off.width, off.height).data
      const targets = []
      for (let y = 0; y < off.height; y += 4) {
        for (let x = 0; x < off.width; x += 4) {
          if (data[(y * off.width + x) * 4 + 3] > 130) targets.push({ x, y })
        }
      }
      return targets
    }

    function inkBox(targets) {
      let minX = Infinity, maxX = -Infinity, minY = Infinity, maxY = -Infinity
      for (const q of targets) {
        if (q.x < minX) minX = q.x
        if (q.x > maxX) maxX = q.x
        if (q.y < minY) minY = q.y
        if (q.y > maxY) maxY = q.y
      }
      return { minX, maxX, minY, maxY, w: maxX - minX, h: maxY - minY }
    }

    const HEADLINE_GAP = 44 /* clear space between the headline and the mark */

    function sampleGlyph() {
      if (w < 2 || h < 2) return [] /* zero-size canvas guard */

      // Wide screens put the mark right of the headline; narrow ones centre it.
      const wide = w > 900
      let size = wide ? Math.min(w * 0.38, h * 0.86) : Math.min(w * 0.62, h * 0.5)
      let cx = wide ? w * 0.79 : w * 0.5
      const cy = wide ? h * 0.5 : h * 0.66

      let targets = sampleAt(size, cx, cy)
      if (!targets.length) {
        glyphCx = cx
        glyphCy = cy
        return []
      }

      /* The hero is a single column, so nothing in the layout keeps the mark
         off the headline — measure it. The mark is scaled down only if it
         cannot fit the space to the right of the type, then pushed as far
         right as the margin allows. This is why it clears "tools" at every
         width instead of only the one it was eyeballed at. */
      if (wide) {
        const h1 = canvas.parentElement?.querySelector('h1')
        if (h1) {
          const rect = canvas.getBoundingClientRect()
          const leftBound = h1.getBoundingClientRect().right - rect.left + HEADLINE_GAP
          const rightBound = w - w * 0.032
          const band = rightBound - leftBound

          if (band > 60) {
            let ink = inkBox(targets)
            if (ink.w > band) {
              size *= band / ink.w
              targets = sampleAt(size, cx, cy)
              ink = inkBox(targets)
            }
            cx = rightBound - ink.w / 2
          }
        }
      }

      // Sorted top-to-bottom so the top trace folds into the top of the mark.
      targets.sort((a, b) => a.y - b.y || a.x - b.x)

      // Centre on the glyph's real ink box. textBaseline "middle" centres the
      // em box, not the letterform, which leaves Ψ visibly high in the frame.
      const ink = inkBox(targets)
      const ox = cx - (ink.minX + ink.maxX) / 2
      const oy = cy - (ink.minY + ink.maxY) / 2
      for (const q of targets) {
        q.x += ox
        q.y += oy
      }

      glyphCx = cx
      glyphCy = cy
      return targets
    }

    function render(s) {
      ctx.clearRect(0, 0, w, h)
      if (!pts.length || w < 2 || h < 2) return

      const reduced = reducedQuery.matches
      const mutedRgb = hexToRgb(readToken('--color-muted', '#6F7C90'), [111, 124, 144])
      const coolRgb = hexToRgb(readToken('--color-cool', '#6E9BFF'), [110, 155, 255])
      const calm = 1 - s

      for (const p of pts) {
        // Left-to-right, so the fold sweeps like a playhead. A uniform morph
        // just squeezes the traces inward and the mark never appears to emerge.
        let lp = (s - p.delay * 0.5) / 0.5
        lp = lp < 0 ? 0 : lp > 1 ? 1 : lp
        lp = lp * lp * (3 - 2 * lp) /* smoothstep */

        const wy = p.base + waveAt(p.x0, p.ph, clock) * p.amp * (1 - lp)
        let x = p.x0 + (p.tx - p.x0) * lp
        let y = wy + (p.ty - wy) * lp

        // Pointer reactivity ties the custom cursor and the hero into one system.
        if (!reduced && mx > -900) {
          const dx = x - mx
          const dy = y - my
          const d2 = dx * dx + dy * dy
          if (d2 < 7000 && d2 > 0.01) {
            const f = ((1 - d2 / 7000) * 16) / Math.sqrt(d2)
            x += dx * f
            y += dy * f
          }
        }
        p.x = x
        p.y = y
        p.lp = lp
        p.wy = wy
      }

      // Blue backlight: a broad wash that fades across the whole field, with a
      // tighter core right behind the mark — the mark is lit, not just drawn.
      if (s > 0.15) {
        const R = Math.min(w, h)
        const wash = ctx.createRadialGradient(glyphCx, glyphCy, 0, glyphCx, glyphCy, R * 0.72)
        wash.addColorStop(0, `rgba(${coolRgb[0]},${coolRgb[1]},${coolRgb[2]},${(0.16 * s).toFixed(3)})`)
        wash.addColorStop(0.55, `rgba(${coolRgb[0]},${coolRgb[1]},${coolRgb[2]},${(0.07 * s).toFixed(3)})`)
        wash.addColorStop(1, 'rgba(0,0,0,0)')
        ctx.fillStyle = wash
        ctx.fillRect(0, 0, w, h)

        const core = ctx.createRadialGradient(glyphCx, glyphCy, 0, glyphCx, glyphCy, R * 0.34)
        core.addColorStop(0, `rgba(${coolRgb[0]},${coolRgb[1]},${coolRgb[2]},${(0.2 * s).toFixed(3)})`)
        core.addColorStop(1, 'rgba(0,0,0,0)')
        ctx.fillStyle = core
        ctx.fillRect(0, 0, w, h)
      }

      // Traces are drawn through the UNDISPLACED wave position (x0, wy), and
      // only where the fold has not arrived — otherwise the line is dragged
      // into the glyph as diagonal streaks.
      if (calm > 0.01) {
        ctx.strokeStyle = `rgb(${mutedRgb[0]},${mutedRgb[1]},${mutedRgb[2]})`
        ctx.lineWidth = 1
        ctx.globalAlpha = Math.pow(calm, 1.5) * 0.55
        for (const row of rows) {
          let open = false
          ctx.beginPath()
          for (let j = 0; j < row.length; j++) {
            if (row[j].lp < 0.5) {
              if (open) ctx.lineTo(row[j].x0, row[j].wy)
              else {
                ctx.moveTo(row[j].x0, row[j].wy)
                open = true
              }
            } else open = false
          }
          ctx.stroke()
        }
      }

      // Samples coloured by their OWN progress, quantised into 8 buckets so
      // fillStyle is set 8 times a frame instead of 1200 times.
      for (let b = 0; b < BUCKETS; b++) {
        const f = b / (BUCKETS - 1)
        ctx.fillStyle = `rgb(${Math.round(mutedRgb[0] + (coolRgb[0] - mutedRgb[0]) * f)},${Math.round(
          mutedRgb[1] + (coolRgb[1] - mutedRgb[1]) * f
        )},${Math.round(mutedRgb[2] + (coolRgb[2] - mutedRgb[2]) * f)})`
        ctx.globalAlpha = 0.45 + f * 0.45
        /* Kept under half the 4px sample spacing so the resolved mark stays a
           legible lattice of separate dots. At 2.0 the dots met and the glyph
           filled in solid, which loses the point-cloud entirely. */
        const rr = 1.0 + f * 0.35
        ctx.beginPath()
        for (const q of pts) {
          if (Math.min(BUCKETS - 1, Math.floor(q.lp * BUCKETS)) !== b) continue
          ctx.moveTo(q.x + rr, q.y)
          ctx.arc(q.x, q.y, rr, 0, Math.PI * 2)
        }
        ctx.fill()
      }
      ctx.globalAlpha = 1
    }

    function loop(now) {
      const dt = Math.min(0.05, (now - last) / 1000)
      last = now
      const reduced = reducedQuery.matches
      if (!reduced) clock += dt

      const e = Math.min(1, (performance.now() - started) / (reduced ? 1400 : 2400))
      const eased = e * e * (3 - 2 * e)
      const scrolled = Math.min(1, window.scrollY / Math.max(1, window.innerHeight * 0.9))
      render(Math.max(0, eased - scrolled))

      raf = requestAnimationFrame(loop)
    }

    function build() {
      if (raf) {
        cancelAnimationFrame(raf)
        raf = null
      }

      const rect = canvas.getBoundingClientRect()
      const dpr = Math.min(window.devicePixelRatio || 1, 2)
      w = rect.width
      h = rect.height
      canvas.width = Math.max(1, Math.round(w * dpr))
      canvas.height = Math.max(1, Math.round(h * dpr))
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
      if (w < 2 || h < 2) return

      const targets = sampleGlyph()
      const gap = h / (CHANNELS + 1)
      const perChannel = perChannelFor(w)
      const total = CHANNELS * perChannel
      pts = []
      rows = []
      let k = 0
      for (let c = 0; c < CHANNELS; c++) {
        const row = []
        for (let i = 0; i < perChannel; i++) {
          const tgt = targets.length
            ? targets[Math.min(targets.length - 1, Math.floor((k * targets.length) / total))]
            : { x: w / 2, y: h / 2 }
          const p = {
            x0: (i / (perChannel - 1)) * w,
            base: gap * (c + 1),
            amp: gap * 0.38,
            ph: c * 1.7 + i * 0.045,
            tx: tgt.x,
            ty: tgt.y,
            delay: (i / (perChannel - 1)) * 0.82 + Math.random() * 0.18,
            x: 0,
            y: 0,
            lp: 0,
            wy: 0
          }
          row.push(p)
          pts.push(p)
          k++
        }
        rows.push(row)
      }

      started = performance.now()
      last = performance.now()
      // A hidden tab never runs rAF, so paint the resolved mark straight away
      // rather than leaving the hero empty.
      if (document.hidden) render(1)
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
    // The canvas sits behind text and is pointer-events: none, so listen at
    // the window and convert to canvas-local coordinates.
    const onPointer = (e) => {
      const rect = canvas.getBoundingClientRect()
      mx = e.clientX - rect.left
      my = e.clientY - rect.top
    }
    const onLeave = () => {
      mx = my = -9999
    }

    window.addEventListener('resize', onResize)
    document.addEventListener('visibilitychange', onVisible)
    window.addEventListener('pointermove', onPointer)
    window.addEventListener('pointerleave', onLeave)
    reducedQuery.addEventListener('change', build)

    return () => {
      clearTimeout(resizeTimer)
      if (raf) cancelAnimationFrame(raf)
      window.removeEventListener('resize', onResize)
      document.removeEventListener('visibilitychange', onVisible)
      window.removeEventListener('pointermove', onPointer)
      window.removeEventListener('pointerleave', onLeave)
      reducedQuery.removeEventListener('change', build)
    }
  }, [])

  /* Below lg there is no reserved column, so the mark sits behind the mission
     paragraph. It drops to a watermark there — at full strength it made the
     body copy genuinely hard to read. Text wins; the mark is decoration. */
  return (
    <canvas
      ref={ref}
      aria-hidden="true"
      className="absolute inset-0 z-0 h-full w-full opacity-25 lg:opacity-100"
    />
  )
}
