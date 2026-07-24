/** SPECIMEN 04 — Kinetic Type: DOM 텍스트를 글자로 쪼개 transform만 움직인다 */
import gsap from 'gsap'
import type { Quality } from '../lib/quality'

function split(el: HTMLElement): HTMLElement[] {
  const text = el.textContent ?? ''
  el.setAttribute('aria-label', text) // 스크린리더에는 원문을
  el.innerHTML = ''
  const chars: HTMLElement[] = []
  for (const ch of text) {
    const span = document.createElement('span')
    span.className = 'char'
    span.setAttribute('aria-hidden', 'true')
    span.textContent = ch === ' ' ? ' ' : ch
    el.appendChild(span)
    chars.push(span)
  }
  return chars
}

export function initTypography(q: Quality) {
  const stage = document.getElementById('type-stage')
  if (!stage) return
  const lines = Array.from(stage.querySelectorAll<HTMLElement>('[data-split]'))
  if (q.reducedMotion) return // 폴백: 그대로 즉시 표시

  lines.forEach((line, i) => {
    const chars = split(line)
    gsap.fromTo(
      chars,
      { yPercent: 115, opacity: 0, rotate: () => gsap.utils.random(-8, 8) },
      {
        yPercent: 0,
        opacity: 1,
        rotate: 0,
        ease: 'power3.out',
        stagger: { each: 0.018, from: i % 2 ? 'end' : 'start' },
        scrollTrigger: {
          trigger: line,
          start: 'top 88%',
          end: 'top 42%',
          scrub: 0.5,
        },
      },
    )
  })
}
