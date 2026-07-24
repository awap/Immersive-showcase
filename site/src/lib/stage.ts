/** 데모 캔버스 공통 유틸 — 보이는 동안만 rAF를 돌린다 */

export const clampedDPR = () => Math.min(window.devicePixelRatio || 1, 1.5)

export interface DemoHandle {
  start(): void
  stop(): void
}

/** 요소가 뷰포트에 들어올 때 start, 나가면 stop */
export function runWhileVisible(el: Element, handle: DemoHandle) {
  const io = new IntersectionObserver(
    ([entry]) => (entry.isIntersecting ? handle.start() : handle.stop()),
    { rootMargin: '120px' },
  )
  io.observe(el)
}

/** rAF 루프 래퍼 — start/stop 중복 호출 안전 */
export function makeLoop(fn: (dt: number) => void): DemoHandle {
  let raf = 0
  let running = false
  let last = 0
  const tick = (t: number) => {
    if (!running) return
    const dt = Math.min((t - last) / 1000, 0.05)
    last = t
    fn(dt)
    raf = requestAnimationFrame(tick)
  }
  return {
    start() {
      if (running) return
      running = true
      last = performance.now()
      raf = requestAnimationFrame(tick)
    },
    stop() {
      running = false
      cancelAnimationFrame(raf)
    },
  }
}

/** 요소 크기 변화 감시 — 0 크기(숨김 상태 로드)에서도 나중에 자가 복구된다 */
export function onResize(el: Element, cb: (w: number, h: number) => void) {
  const fire = () => {
    const r = el.getBoundingClientRect()
    if (r.width > 0 && r.height > 0) cb(r.width, r.height)
  }
  const ro = new ResizeObserver(fire)
  ro.observe(el)
  window.addEventListener('resize', fire)
  fire()
}

/** 2D 캔버스 리사이즈 (DPR 상한 적용). CSS 픽셀 크기를 반환 */
export function fit2d(canvas: HTMLCanvasElement) {
  const rect = canvas.getBoundingClientRect()
  const dpr = clampedDPR()
  const w = Math.round(rect.width * dpr)
  const h = Math.round(rect.height * dpr)
  if (canvas.width !== w || canvas.height !== h) {
    canvas.width = w
    canvas.height = h
  }
  return { w: rect.width, h: rect.height, dpr }
}
