/* DotGrid (vanilla) – subtle background for Contacts card */
;(function () {
  'use strict'

  const prefersReducedMotion =
    typeof window !== 'undefined' &&
    window.matchMedia &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches

  if (prefersReducedMotion) return

  function clamp(v, a, b) {
    return Math.max(a, Math.min(b, v))
  }

  function lerp(a, b, t) {
    return a + (b - a) * t
  }

  function hexToRgb(hex) {
    const m = String(hex || '')
      .trim()
      .match(/^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i)
    if (!m) return { r: 0, g: 0, b: 0 }
    return {
      r: parseInt(m[1], 16),
      g: parseInt(m[2], 16),
      b: parseInt(m[3], 16),
    }
  }

  function initDotGrid(root) {
    const canvas = root.querySelector('canvas')
    if (!canvas) return () => {}
    const ctx = canvas.getContext('2d')
    if (!ctx) return () => {}

    // Tuned for this site: soft, readable
    const dotSize = 3.2
    const gap = 22
    const proximity = 120
    const maxOffset = 7
    const returnEase = 0.06
    const influenceEase = 0.08

    const base = hexToRgb('#8b5cf6') // violet
    const active = hexToRgb('#38bdf8') // sky

    let dpr = Math.max(1, Math.min(2, window.devicePixelRatio || 1))
    let width = 0
    let height = 0
    let dots = []

    const pointer = {
      x: -9999,
      y: -9999,
      vx: 0,
      vy: 0,
      lastX: 0,
      lastY: 0,
      lastT: 0,
    }

    function build() {
      const rect = root.getBoundingClientRect()
      width = Math.max(0, Math.floor(rect.width))
      height = Math.max(0, Math.floor(rect.height))
      if (!width || !height) return

      dpr = Math.max(1, Math.min(2, window.devicePixelRatio || 1))
      canvas.width = Math.floor(width * dpr)
      canvas.height = Math.floor(height * dpr)
      canvas.style.width = width + 'px'
      canvas.style.height = height + 'px'
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)

      const cell = dotSize + gap
      const cols = Math.floor((width + gap) / cell)
      const rows = Math.floor((height + gap) / cell)
      const gridW = cell * cols - gap
      const gridH = cell * rows - gap
      const startX = (width - gridW) / 2 + dotSize / 2
      const startY = (height - gridH) / 2 + dotSize / 2

      dots = []
      for (let y = 0; y < rows; y++) {
        for (let x = 0; x < cols; x++) {
          const cx = startX + x * cell
          const cy = startY + y * cell
          dots.push({ cx, cy, ox: 0, oy: 0, tx: 0, ty: 0 })
        }
      }
    }

    function onMove(e) {
      const rect = root.getBoundingClientRect()
      const now = performance.now()
      const x = e.clientX - rect.left
      const y = e.clientY - rect.top

      const dt = pointer.lastT ? Math.max(8, now - pointer.lastT) : 16
      const dx = x - pointer.lastX
      const dy = y - pointer.lastY
      pointer.vx = (dx / dt) * 1000
      pointer.vy = (dy / dt) * 1000

      pointer.x = x
      pointer.y = y
      pointer.lastX = x
      pointer.lastY = y
      pointer.lastT = now
    }

    function onLeave() {
      pointer.x = -9999
      pointer.y = -9999
      pointer.vx = 0
      pointer.vy = 0
    }

    let raf = 0
    function draw() {
      ctx.clearRect(0, 0, width, height)

      const px = pointer.x
      const py = pointer.y
      const proxSq = proximity * proximity

      for (const dot of dots) {
        const dx = dot.cx - px
        const dy = dot.cy - py
        const dsq = dx * dx + dy * dy

        let t = 0
        if (dsq < proxSq) {
          const dist = Math.sqrt(dsq)
          t = 1 - dist / proximity
        }

        // Subtle offset away from pointer (very small)
        const push = t * maxOffset
        const ang = Math.atan2(dy, dx)
        dot.tx = Math.cos(ang) * push
        dot.ty = Math.sin(ang) * push

        // Smoothly follow targets and return
        dot.ox = lerp(dot.ox, dot.tx, influenceEase)
        dot.oy = lerp(dot.oy, dot.ty, influenceEase)
        dot.ox = lerp(dot.ox, 0, returnEase * (1 - t))
        dot.oy = lerp(dot.oy, 0, returnEase * (1 - t))

        // Color interpolation (very low alpha to keep readability)
        const r = Math.round(lerp(base.r, active.r, t))
        const g = Math.round(lerp(base.g, active.g, t))
        const b = Math.round(lerp(base.b, active.b, t))
        const a = lerp(0.08, 0.22, t) // dots opacity range

        ctx.beginPath()
        ctx.fillStyle = `rgba(${r},${g},${b},${a})`
        ctx.arc(dot.cx + dot.ox, dot.cy + dot.oy, dotSize / 2, 0, Math.PI * 2)
        ctx.fill()
      }

      raf = requestAnimationFrame(draw)
    }

    // Build & observe
    build()
    draw()

    const onPointerMove = (e) => onMove(e)
    const onPointerLeave = () => onLeave()
    root.addEventListener('pointermove', onPointerMove, { passive: true })
    root.addEventListener('pointerleave', onPointerLeave, { passive: true })

    let ro = null
    if ('ResizeObserver' in window) {
      ro = new ResizeObserver(build)
      ro.observe(root)
    } else {
      window.addEventListener('resize', build)
    }

    return function destroy() {
      cancelAnimationFrame(raf)
      root.removeEventListener('pointermove', onPointerMove)
      root.removeEventListener('pointerleave', onPointerLeave)
      if (ro) ro.disconnect()
      else window.removeEventListener('resize', build)
    }
  }

  function boot() {
    const el = document.querySelector('.contact-dotgrid')
    if (!el) return
    initDotGrid(el)
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot)
  else boot()
})()

