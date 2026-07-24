/** SPECIMEN 07 — Canvas 2D: 노이즈 흐름장(flow field), 커서가 장을 휜다 */
import { fit2d, makeLoop, onResize, runWhileVisible } from '../lib/stage'
import type { Quality } from '../lib/quality'

export function initCanvas2d(canvas: HTMLCanvasElement, q: Quality) {
  const ctx = canvas.getContext('2d')
  if (!ctx) return

  const COUNT = q.tier === 'low' ? 220 : 520
  interface P { x: number; y: number }
  let parts: P[] = []
  let W = 0
  let H = 0
  let dpr = 1

  const reset = () => {
    const s = fit2d(canvas)
    W = s.w
    H = s.h
    dpr = s.dpr
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
    ctx.fillStyle = '#0f1320'
    ctx.fillRect(0, 0, W, H)
    parts = Array.from({ length: COUNT }, () => ({ x: Math.random() * W, y: Math.random() * H }))
  }
  onResize(canvas, reset)

  const cursor = { x: -9999, y: -9999 }
  canvas.addEventListener('pointermove', (e) => {
    const r = canvas.getBoundingClientRect()
    cursor.x = e.clientX - r.left
    cursor.y = e.clientY - r.top
  })
  canvas.addEventListener('pointerleave', () => {
    cursor.x = -9999
    cursor.y = -9999
  })

  let t = 0
  const field = (x: number, y: number) =>
    Math.sin(x * 0.006 + t * 0.5) + Math.cos(y * 0.0055 - t * 0.35) + Math.sin((x + y) * 0.0028 + t * 0.2)

  const step = () => {
    // 잔상 트릭 — 반투명 사각형으로 서서히 지운다
    ctx.fillStyle = 'rgba(15, 19, 32, 0.055)'
    ctx.fillRect(0, 0, W, H)
    ctx.lineWidth = 1.1

    for (const p of parts) {
      let a = field(p.x, p.y) * 1.35

      // 커서가 장을 휜다 — 커서 주변에서 접선 방향으로 굴절
      const dx = p.x - cursor.x
      const dy = p.y - cursor.y
      const d2 = dx * dx + dy * dy
      if (d2 < 22000) a += Math.atan2(dy, dx) + Math.PI / 2 - a * 0.5

      const nx = p.x + Math.cos(a) * 1.7
      const ny = p.y + Math.sin(a) * 1.7

      const mix = (Math.sin(a) + 1) / 2
      ctx.strokeStyle = mix > 0.72 ? 'rgba(228,185,91,0.5)' : 'rgba(142,139,239,0.42)'
      ctx.beginPath()
      ctx.moveTo(p.x, p.y)
      ctx.lineTo(nx, ny)
      ctx.stroke()

      p.x = nx
      p.y = ny
      if (p.x < 0 || p.x > W || p.y < 0 || p.y > H || Math.random() < 0.004) {
        p.x = Math.random() * W
        p.y = Math.random() * H
      }
    }
  }

  if (q.reducedMotion) {
    for (let i = 0; i < 160; i++) step() // 정지 프레임 하나를 미리 그린다
    return
  }

  const loop = makeLoop((dt) => {
    t += dt
    step()
  })
  runWhileVisible(canvas, loop)
}
