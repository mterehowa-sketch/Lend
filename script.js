/*
  Maria Digital Lab — static landing

  Что тут есть:
  - плавное появление блоков при скролле (reveal-анимации)
  - простая анимация "pipeline" в hero-панели
  - текущий год в футере
*/

// Текущий год в футере
document.getElementById('year').textContent = String(new Date().getFullYear())

// Мягкий "живой" glow в фоне — следует за курсором/тапом.
// На touch-устройствах будет работать по последнему касанию.
const bg = document.querySelector('.bg')
if (bg) {
  const setGlow = (x, y) => {
    const mx = Math.max(0, Math.min(100, (x / window.innerWidth) * 100))
    const my = Math.max(0, Math.min(100, (y / window.innerHeight) * 100))
    bg.style.setProperty('--mx', `${mx}%`)
    bg.style.setProperty('--my', `${my}%`)
  }

  window.addEventListener(
    'pointermove',
    (e) => {
      setGlow(e.clientX, e.clientY)
    },
    { passive: true },
  )

  window.addEventListener(
    'touchstart',
    (e) => {
      const t = e.touches && e.touches[0]
      if (!t) return
      setGlow(t.clientX, t.clientY)
    },
    { passive: true },
  )
}

// Reveal on scroll (аккуратно, без тяжёлых библиотек)
const revealNodes = Array.from(document.querySelectorAll('.reveal'))

if ('IntersectionObserver' in window) {
  // Чуть более "дорогой" эффект: минимальный stagger по порядку элементов на странице.
  revealNodes.forEach((n, i) => {
    n.style.transitionDelay = `${Math.min(i * 60, 360)}ms`
  })

  const io = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-in')
          io.unobserve(entry.target)
        }
      }
    },
    { threshold: 0.12 },
  )

  revealNodes.forEach((n) => io.observe(n))
} else {
  // Fallback: если IO нет, просто показываем всё
  revealNodes.forEach((n) => n.classList.add('is-in'))
}

// Hero panel: pipeline switcher
const steps = ['Idea', 'Logic', 'Prototype', 'Launch']
const pipelineStep = document.getElementById('pipelineStep')
const pipelineIdx = document.getElementById('pipelineIdx')
const pipelineGrid = document.getElementById('pipelineGrid')

const meterPrototype = document.getElementById('meterPrototype')
const meterPrototypeFill = document.getElementById('meterPrototypeFill')
const meterLaunch = document.getElementById('meterLaunch')
const meterLaunchFill = document.getElementById('meterLaunchFill')

let idx = 0
setInterval(() => {
  idx = (idx + 1) % steps.length

  // Текстовый шаг
  if (pipelineStep) pipelineStep.textContent = steps[idx]
  if (pipelineIdx) pipelineIdx.textContent = String(idx + 1)

  // Подсветка плиток
  if (pipelineGrid) {
    const cells = Array.from(pipelineGrid.querySelectorAll('.pipeline__cell'))
    cells.forEach((c, i) => c.classList.toggle('is-on', i <= idx))
  }

  // Немного "живых" процентов
  const proto = idx >= 2 ? 72 : 45
  const launch = idx === 3 ? 66 : 38

  if (meterPrototype) meterPrototype.textContent = `${proto}%`
  if (meterPrototypeFill) meterPrototypeFill.style.width = `${proto}%`
  if (meterLaunch) meterLaunch.textContent = `${launch}%`
  if (meterLaunchFill) meterLaunchFill.style.width = `${launch}%`
}, 1400)

