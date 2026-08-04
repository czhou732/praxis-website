import './style.css'

/* ============================================================
   PRAXIS — interaction layer
   1. reveal on scroll
   2. hero particle field: noise resolves into the psi mark
   3. custom cursor: core dot, spring ring, decaying signal trace
   ============================================================ */

const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
const finePointer = window.matchMedia('(pointer: fine)').matches

const token = (name, fallback) =>
  getComputedStyle(document.documentElement).getPropertyValue(name).trim() || fallback

function sizeCanvas (canvas) {
  const rect = canvas.getBoundingClientRect()
  const dpr = Math.min(window.devicePixelRatio || 1, 2)
  canvas.width = Math.max(1, Math.round(rect.width * dpr))
  canvas.height = Math.max(1, Math.round(rect.height * dpr))
  const ctx = canvas.getContext('2d')
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
  return { ctx, w: rect.width, h: rect.height }
}

/* ---------------- 1. reveal ---------------- */

function initReveal () {
  const items = document.querySelectorAll('.reveal')
  if (!items.length) return

  if (reduceMotion) {
    items.forEach((el) => el.classList.add('in'))
    return
  }

  const io = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return
        entry.target.classList.add('in')
        io.unobserve(entry.target)
      })
    },
    { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
  )

  items.forEach((el) => io.observe(el))
}

/* ---------------- 2. hero field ---------------- */

function initField () {
  const canvas = document.getElementById('field')
  if (!canvas) return

  let view = sizeCanvas(canvas)
  let points = []
  let raf = null
  let frame = 0
  let started = performance.now()

  function glyphTargets (w, h) {
    const off = document.createElement('canvas')
    off.width = Math.round(w)
    off.height = Math.round(h)
    const o = off.getContext('2d')

    // On wide screens the mark sits right of the headline; on narrow it centres.
    const wide = w > 900
    const size = wide ? Math.min(w * 0.31, h * 0.78) : Math.min(w * 0.62, h * 0.5)
    const cx = wide ? w * 0.79 : w * 0.5
    const cy = wide ? h * 0.5 : h * 0.66

    o.fillStyle = '#fff'
    o.font = `400 ${size}px ${token('--serif', 'serif')}`
    o.textAlign = 'center'
    o.textBaseline = 'middle'
    o.fillText('Ψ', cx, cy)

    const data = o.getImageData(0, 0, off.width, off.height).data
    const found = []
    const step = 4
    for (let y = 0; y < off.height; y += step) {
      for (let x = 0; x < off.width; x += step) {
        if (data[(y * off.width + x) * 4 + 3] > 130) found.push({ x, y })
      }
    }
    return found
  }

  function build () {
    if (raf) cancelAnimationFrame(raf)
    view = sizeCanvas(canvas)
    const targets = glyphTargets(view.w, view.h)
    const count = Math.min(targets.length, window.innerWidth < 700 ? 700 : 1500)
    points = []
    for (let i = 0; i < count; i++) {
      const t = targets[Math.floor((i * targets.length) / count)]
      if (!t) continue
      points.push({
        nx: Math.random() * view.w,
        ny: Math.random() * view.h,
        tx: t.x,
        ty: t.y,
        phase: Math.random() * Math.PI * 2
      })
    }
    started = performance.now()

    // Paint one frame synchronously. Without this the hero is blank for anyone
    // whose rAF never runs — reduced-motion users, and background tabs.
    render(reduceMotion ? 1 : 0)
    if (!reduceMotion) raf = requestAnimationFrame(draw)
  }

  function draw () {
    frame++

    // resolve over ~2.4s after load, then dissolve as the hero scrolls away
    const e = Math.min(1, (performance.now() - started) / 2400)
    const resolve = e * e * (3 - 2 * e)
    const scrolled = Math.min(1, window.scrollY / Math.max(1, window.innerHeight * 0.9))

    render(Math.max(0, resolve - scrolled))
    raf = requestAnimationFrame(draw)
  }

  function render (progress) {
    const { ctx, w, h } = view
    ctx.clearRect(0, 0, w, h)

    const cool = token('--cool', '#6E9BFF')
    const muted = token('--muted', '#6F7C90')

    // Soft bloom behind the resolved mark so it reads against the ground.
    if (progress > 0.15 && points.length) {
      const cx = points[Math.floor(points.length / 2)].tx
      const cy = points[Math.floor(points.length / 2)].ty
      const glow = ctx.createRadialGradient(cx, cy, 0, cx, cy, Math.min(w, h) * 0.42)
      glow.addColorStop(0, 'rgba(110, 155, 255, ' + (0.13 * progress).toFixed(3) + ')')
      glow.addColorStop(1, 'rgba(110, 155, 255, 0)')
      ctx.fillStyle = glow
      ctx.fillRect(0, 0, w, h)
    }

    ctx.fillStyle = progress > 0.55 ? cool : muted
    for (let i = 0; i < points.length; i++) {
      const p = points[i]
      const drift = reduceMotion ? 0 : Math.sin(frame * 0.011 + p.phase) * (1 - progress) * 8
      const x = p.nx + (p.tx - p.nx) * progress + drift
      const y = p.ny + (p.ty - p.ny) * progress + drift * 0.55

      ctx.beginPath()
      ctx.arc(x, y, 1.35 + progress * 0.85, 0, Math.PI * 2)
      ctx.globalAlpha = 0.24 + progress * 0.56
      ctx.fill()
    }
    ctx.globalAlpha = 1

    raf = requestAnimationFrame(draw)
  }

  // Wait for the serif to load, otherwise the glyph is sampled from a fallback.
  if (document.fonts && document.fonts.ready) {
    document.fonts.ready.then(build).catch(build)
  } else {
    build()
  }

  let resizeTimer
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimer)
    resizeTimer = setTimeout(build, 180)
  })
}

/* ---------------- 3. cursor ---------------- */

function initCursor () {
  // Never on touch, never when motion is reduced — the native cursor is the
  // accessible default and a decorative one must not replace it.
  if (!finePointer || reduceMotion) return

  const canvas = document.createElement('canvas')
  canvas.id = 'cursor'
  canvas.setAttribute('aria-hidden', 'true')
  document.body.appendChild(canvas)
  document.body.classList.add('cursor-on')

  let view = sizeCanvas(canvas)
  let px = window.innerWidth / 2
  let py = window.innerHeight / 2
  let rx = px
  let ry = py
  let velocity = 0
  let locked = false
  let visible = false
  const trail = []

  const INTERACTIVE = 'a, button, [role="button"], input, textarea, select, summary'

  window.addEventListener('pointermove', (e) => {
    velocity = Math.min(Math.hypot(e.clientX - px, e.clientY - py), 60)
    px = e.clientX
    py = e.clientY
    visible = true
    locked = !!(e.target instanceof Element && e.target.closest(INTERACTIVE))
    trail.push({ x: px, y: py, a: 1, v: velocity })
    if (trail.length > 80) trail.shift()
  }, { passive: true })

  document.addEventListener('pointerleave', () => { visible = false })
  window.addEventListener('blur', () => { visible = false })
  window.addEventListener('resize', () => { view = sizeCanvas(canvas) })

  function draw () {
    const { ctx, w, h } = view
    ctx.clearRect(0, 0, w, h)

    if (visible) {
      rx += (px - rx) * 0.16
      ry += (py - ry) * 0.16

      const cool = token('--cool', '#6E9BFF')
      const warm = token('--warm', '#FF7F6B')

      // signal trace — amplitude tracks pointer velocity
      if (trail.length > 1) {
        ctx.lineWidth = 1.2
        ctx.strokeStyle = cool
        for (let i = 1; i < trail.length; i++) {
          const a = trail[i]
          const b = trail[i - 1]
          const amp = (a.v / 60) * 8
          ctx.beginPath()
          ctx.globalAlpha = a.a * 0.42
          ctx.moveTo(b.x, b.y + Math.sin((i - 1) * 0.85) * amp)
          ctx.lineTo(a.x, a.y + Math.sin(i * 0.85) * amp)
          ctx.stroke()
          a.a *= 0.95
        }
        ctx.globalAlpha = 1
        while (trail.length && trail[0].a < 0.03) trail.shift()
      }

      // ring
      ctx.beginPath()
      ctx.arc(rx, ry, locked ? 24 : 14, 0, Math.PI * 2)
      ctx.strokeStyle = locked ? warm : cool
      ctx.lineWidth = locked ? 1.8 : 1.2
      ctx.globalAlpha = locked ? 1 : 0.7
      ctx.stroke()
      ctx.globalAlpha = 1

      // core
      ctx.beginPath()
      ctx.arc(px, py, locked ? 1.4 : 2.6, 0, Math.PI * 2)
      ctx.fillStyle = warm
      ctx.fill()

      velocity *= 0.9
    }

    requestAnimationFrame(draw)
  }

  requestAnimationFrame(draw)
}

/* ---------------- boot ---------------- */

document.addEventListener('DOMContentLoaded', () => {
  initReveal()
  initField()
  initCursor()
})
