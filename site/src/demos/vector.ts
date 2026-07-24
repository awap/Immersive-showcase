/** SPECIMEN 05 — SVG: stroke-dashoffset 드로잉 + path 좌표 보간 morph */
import gsap from 'gsap'
import type { Quality } from '../lib/quality'

export function initVector(q: Quality) {
  const stage = document.getElementById('vector-stage')
  if (!stage) return

  // --- 선 드로잉 (스크롤 스크럽) ---
  const paths = Array.from(stage.querySelectorAll<SVGPathElement>('.draw-path'))
  const nodes = Array.from(stage.querySelectorAll<SVGCircleElement>('.draw-node'))
  const labels = Array.from(stage.querySelectorAll<SVGTextElement>('.draw-label'))

  paths.forEach((p) => {
    const len = p.getTotalLength()
    p.style.strokeDasharray = String(len)
    p.style.strokeDashoffset = q.reducedMotion ? '0' : String(len)
  })

  if (!q.reducedMotion) {
    gsap.set([...nodes, ...labels], { opacity: 0, scale: 0.4, transformOrigin: 'center', svgOrigin: undefined })
    const tl = gsap.timeline({
      scrollTrigger: { trigger: stage, start: 'top 82%', end: 'center 45%', scrub: 0.5 },
    })
    tl.to(paths, { strokeDashoffset: 0, duration: 3, stagger: 0.5, ease: 'none' })
    tl.to(nodes, { opacity: 1, scale: 1, duration: 0.8, stagger: 0.12 }, '-=1')
    tl.to(labels, { opacity: 1, scale: 1, duration: 0.8 }, '-=0.5')
  }

  // --- Morph: 같은 정점 수의 원 ↔ 별을 좌표 보간 ---
  const morphPath = document.getElementById('morph-path') as unknown as SVGPathElement | null
  const btn = document.getElementById('morph-btn')
  if (!morphPath || !btn) return

  const N = 10
  const point = (i: number, t: number) => {
    // t=0 원(모든 반지름 78), t=1 별(홀수 정점만 34로 함몰)
    const angle = (i / N) * Math.PI * 2 - Math.PI / 2
    const r = 78 - (i % 2) * 44 * t
    return [100 + Math.cos(angle) * r, 100 + Math.sin(angle) * r]
  }
  const build = (t: number) => {
    let d = ''
    for (let i = 0; i < N; i++) {
      const [x, y] = point(i, t)
      d += `${i === 0 ? 'M' : 'L'}${x.toFixed(1)} ${y.toFixed(1)}`
    }
    return d + 'Z'
  }

  const state = { t: 0 }
  morphPath.setAttribute('d', build(0))
  let star = false
  btn.addEventListener('click', () => {
    star = !star
    if (q.reducedMotion) {
      morphPath.setAttribute('d', build(star ? 1 : 0))
      return
    }
    gsap.to(state, {
      t: star ? 1 : 0,
      duration: 0.9,
      ease: 'elastic.out(1, 0.55)',
      onUpdate: () => morphPath.setAttribute('d', build(state.t)),
    })
  })
}
