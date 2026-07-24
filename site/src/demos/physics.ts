/** SPECIMEN 08 — Fake Physics: spring + damping + noise, 물리 엔진 없이 */
import type { Quality } from '../lib/quality'
import { makeLoop, onResize, runWhileVisible } from '../lib/stage'

interface Orb {
  el: HTMLElement
  x: number; y: number
  vx: number; vy: number
  homeX: number; homeY: number
  seed: number
  dragging: boolean
}

const K = 0.06        // 스프링 강성
const DAMPING = 0.86  // 60fps 기준 감쇠
const RESTITUTION = 0.72

export function initPhysics(q: Quality) {
  const stage = document.getElementById('physics-stage')
  if (!stage) return
  const els = Array.from(stage.querySelectorAll<HTMLElement>('[data-orb]'))

  const orbs: Orb[] = els.map((el, i) => ({
    el, x: 0, y: 0, vx: 0, vy: 0, homeX: 0, homeY: 0, seed: i * 2.4, dragging: false,
  }))

  const layout = () => {
    const r = stage.getBoundingClientRect()
    orbs.forEach((o, i) => {
      o.homeX = r.width * (0.25 + i * 0.25) - 46
      o.homeY = r.height * 0.5 - 46 + (i % 2 ? 40 : -40)
      if (!o.dragging && q.reducedMotion) {
        o.x = o.homeX
        o.y = o.homeY
        o.el.style.transform = `translate(${o.x}px, ${o.y}px)`
      }
    })
  }
  onResize(stage, layout)
  orbs.forEach((o) => {
    o.x = o.homeX
    o.y = o.homeY
    o.el.style.transform = `translate(${o.x}px, ${o.y}px)`
  })

  // 드래그
  orbs.forEach((o) => {
    let px = 0
    let py = 0
    o.el.addEventListener('pointerdown', (e) => {
      o.dragging = true
      o.el.setPointerCapture(e.pointerId)
      px = e.clientX
      py = e.clientY
    })
    o.el.addEventListener('pointermove', (e) => {
      if (!o.dragging) return
      o.x += e.clientX - px
      o.y += e.clientY - py
      o.vx = (e.clientX - px) * 1.4 // 던지기 속도
      o.vy = (e.clientY - py) * 1.4
      px = e.clientX
      py = e.clientY
    })
    const release = () => (o.dragging = false)
    o.el.addEventListener('pointerup', release)
    o.el.addEventListener('pointercancel', release)
  })

  if (q.reducedMotion) return // 정적 배치로 종료

  let t = 0
  const loop = makeLoop((dt) => {
    t += dt
    const r = stage.getBoundingClientRect()
    const damp = Math.pow(DAMPING, dt * 60) // 프레임레이트 보정

    for (const o of orbs) {
      if (!o.dragging) {
        // 노이즈가 섞인 목표점 — "살아있는" 느낌의 재료
        const tx = o.homeX + Math.sin(t * 0.7 + o.seed) * 14
        const ty = o.homeY + Math.cos(t * 0.55 + o.seed * 1.7) * 12
        o.vx += (tx - o.x) * K * dt * 60
        o.vy += (ty - o.y) * K * dt * 60
        o.vx *= damp
        o.vy *= damp
        o.x += o.vx * dt * 60 * 0.16
        o.y += o.vy * dt * 60 * 0.16

        // 벽 반사
        if (o.x < 0) { o.x = 0; o.vx *= -RESTITUTION }
        if (o.y < 0) { o.y = 0; o.vy *= -RESTITUTION }
        if (o.x > r.width - 92) { o.x = r.width - 92; o.vx *= -RESTITUTION }
        if (o.y > r.height - 92) { o.y = r.height - 92; o.vy *= -RESTITUTION }
      }
      o.el.style.transform = `translate(${o.x}px, ${o.y}px)`
    }
  })
  runWhileVisible(stage, loop)
}
