/* SplashCursor (lightweight, non-React) – soft violet/blue trail */
;(function () {
  'use strict'

  const prefersReducedMotion =
    typeof window !== 'undefined' &&
    window.matchMedia &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches
  if (prefersReducedMotion) return

  const canvas = document.createElement('canvas')
  canvas.id = 'splash-cursor'
  canvas.setAttribute('aria-hidden', 'true')
  document.addEventListener('DOMContentLoaded', () => document.body.appendChild(canvas), { once: true })

  const ctx = canvas.getContext('2d')
  if (!ctx) return

  let w = 0
  let h = 0
  let dpr = 1

  function resize() {
    dpr = Math.max(1, Math.min(2, window.devicePixelRatio || 1))
    w = Math.floor(window.innerWidth)
    h = Math.floor(window.innerHeight)
    canvas.width = Math.floor(w * dpr)
    canvas.height = Math.floor(h * dpr)
    canvas.style.width = w + 'px'
    canvas.style.height = h + 'px'
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
  }

  const points = []
  const maxPoints = 70

  const colors = [
    { r: 139, g: 92, b: 246 }, // violet
    { r: 56, g: 189, b: 248 }, // sky
    { r: 59, g: 130, b: 246 }, // blue
  ]

  const state = {
    x: -9999,
    y: -9999,
    lastT: 0,
    lastX: 0,
    lastY: 0,
    speed: 0,
  }

  function onMove(e) {
    const now = performance.now()
    const dt = state.lastT ? Math.max(8, now - state.lastT) : 16
    const dx = e.clientX - state.lastX
    const dy = e.clientY - state.lastY
    state.speed = Math.min(2200, (Math.hypot(dx, dy) / dt) * 1000)
    state.x = e.clientX
    state.y = e.clientY
    state.lastX = e.clientX
    state.lastY = e.clientY
    state.lastT = now

    const c = colors[(Math.random() * colors.length) | 0]
    points.push({
      x: state.x,
      y: state.y,
      vx: dx / dt,
      vy: dy / dt,
      life: 1,
      r: c.r,
      g: c.g,
      b: c.b,
    })
    while (points.length > maxPoints) points.shift()
  }

  function onLeave() {
    state.x = -9999
    state.y = -9999
  }

  function step() {
    ctx.clearRect(0, 0, w, h)

    // soft fade (keeps trail without harshness)
    for (let i = 0; i < points.length; i++) {
      const p = points[i]
      p.life *= 0.94
      p.x += p.vx * 8
      p.y += p.vy * 8

      const t = p.life
      const radius = 18 * (0.6 + 0.8 * t) + (state.speed / 2200) * 10
      const alpha = 0.18 * t

      const g = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, radius)
      g.addColorStop(0, `rgba(${p.r},${p.g},${p.b},${alpha})`)
      g.addColorStop(1, 'rgba(0,0,0,0)')
      ctx.fillStyle = g
      ctx.beginPath()
      ctx.arc(p.x, p.y, radius, 0, Math.PI * 2)
      ctx.fill()
    }

    // prune dead
    for (let i = points.length - 1; i >= 0; i--) {
      if (points[i].life < 0.05) points.splice(i, 1)
    }

    requestAnimationFrame(step)
  }

  resize()
  window.addEventListener('resize', resize, { passive: true })
  window.addEventListener('pointermove', onMove, { passive: true })
  window.addEventListener('pointerleave', onLeave, { passive: true })

  requestAnimationFrame(step)
})()

