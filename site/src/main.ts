import './style.css'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import Lenis from 'lenis'

import { detectQuality, bindHud, makeFpsMeter } from './lib/quality'
import { initHero } from './demos/hero'
import { initScrolly } from './demos/scrolly'
import { initShader } from './demos/shader'
import { initParticles } from './demos/particles'
import { initTypography } from './demos/typography'
import { initVector } from './demos/vector'
import { initCanvas2d } from './demos/canvas2d'
import { initPhysics } from './demos/physics'
import { initAudio } from './demos/audio'

gsap.registerPlugin(ScrollTrigger)

const q = detectQuality()
bindHud(q)

/* ---------- Lenis — 데스크톱 · full-motion에서만. 하나의 rAF(gsap ticker)로 구동 ---------- */
let lenis: Lenis | null = null
const lenisRaf = (time: number) => lenis?.raf(time * 1000)

function enableLenis() {
  if (lenis) return
  lenis = new Lenis({ lerp: 0.11, wheelMultiplier: 1 }) // 약한 보간 — Native 80 + Interp 20
  lenis.on('scroll', ScrollTrigger.update)
  gsap.ticker.add(lenisRaf)
}
function disableLenis() {
  if (!lenis) return
  gsap.ticker.remove(lenisRaf)
  lenis.destroy()
  lenis = null
}

const lenisAllowed = !q.touch && !q.reducedMotion
if (lenisAllowed) enableLenis()
gsap.ticker.lagSmoothing(0)

const lenisBtn = document.getElementById('lenis-toggle') as HTMLButtonElement | null
if (lenisBtn) {
  if (!lenisAllowed) {
    lenisBtn.disabled = true
    lenisBtn.textContent = q.touch ? 'Lenis 자동 비활성 — 터치 기기' : 'Lenis 자동 비활성 — reduced motion'
  } else {
    lenisBtn.addEventListener('click', () => {
      if (lenis) {
        disableLenis()
        lenisBtn.textContent = 'Lenis 켜기 — 보간 스크롤로'
      } else {
        enableLenis()
        lenisBtn.textContent = 'Lenis 끄기 — 네이티브 스크롤로'
      }
    })
  }
}

/* ---------- FPS 미터 ---------- */
const fps = makeFpsMeter()
gsap.ticker.add(fps)

/* ---------- 데모 초기화 ---------- */
const canvasOf = (name: string) =>
  document.querySelector<HTMLCanvasElement>(`canvas[data-demo="${name}"]`)

const heroCanvas = canvasOf('hero')
if (heroCanvas) initHero(heroCanvas, q)

initScrolly(q)

const shaderCanvas = canvasOf('shader')
if (shaderCanvas) initShader(shaderCanvas, q)

const particlesCanvas = canvasOf('particles')
if (particlesCanvas) initParticles(particlesCanvas, q)

initTypography(q)
initVector(q)

const c2dCanvas = canvasOf('canvas2d')
if (c2dCanvas) initCanvas2d(c2dCanvas, q)

initPhysics(q)

const audioCanvas = canvasOf('audio')
if (audioCanvas) initAudio(audioCanvas)

/* ---------- 레일 활성 상태 ---------- */
const railLinks = new Map<string, HTMLAnchorElement>()
document.querySelectorAll<HTMLAnchorElement>('.rail a').forEach((a) => {
  railLinks.set(a.getAttribute('href')!.slice(1), a)
})
const sections = Array.from(document.querySelectorAll<HTMLElement>('.specimen'))
const railIO = new IntersectionObserver(
  (entries) => {
    for (const e of entries) {
      if (!e.isIntersecting) continue
      railLinks.forEach((a) => a.classList.remove('active'))
      railLinks.get(e.target.id)?.classList.add('active')
    }
  },
  { rootMargin: '-30% 0px -55% 0px' },
)
sections.forEach((s) => railIO.observe(s))

/* ---------- 레일 앵커 — Lenis와 부드럽게 ---------- */
railLinks.forEach((a, id) => {
  a.addEventListener('click', (e) => {
    const target = document.getElementById(id)
    if (!target) return
    e.preventDefault()
    if (lenis) lenis.scrollTo(target, { offset: -20, duration: 1.2 })
    else target.scrollIntoView({ behavior: q.reducedMotion ? 'auto' : 'smooth' })
  })
})

/* ---------- 폰트 로드 후 ScrollTrigger 재계산 ---------- */
document.fonts?.ready.then(() => ScrollTrigger.refresh())
