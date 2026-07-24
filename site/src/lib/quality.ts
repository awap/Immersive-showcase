export interface Quality {
  tier: 'high' | 'mid' | 'low'
  webgpu: boolean
  dpr: number
  dprCap: number
  reducedMotion: boolean
  touch: boolean
}

export function detectQuality(): Quality {
  const webgpu = 'gpu' in navigator
  const dpr = window.devicePixelRatio || 1
  const mem = (navigator as { deviceMemory?: number }).deviceMemory
  const touch = matchMedia('(pointer: coarse)').matches
  const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)').matches
  const small = Math.min(screen.width, screen.height) < 480

  let tier: Quality['tier'] = 'mid'
  if (webgpu && (mem === undefined || mem >= 8) && !touch) tier = 'high'
  if ((mem !== undefined && mem <= 4) || (touch && small)) tier = 'low'

  return { tier, webgpu, dpr, dprCap: Math.min(dpr, 1.5), reducedMotion, touch }
}

/** HUD 갱신 + 적응형 품질 섹션의 티어 표에 판정 반영 */
export function bindHud(q: Quality) {
  const set = (id: string, text: string, cls?: 'good' | 'warn') => {
    const el = document.getElementById(id)
    if (!el) return
    el.textContent = text
    if (cls) el.classList.add(cls)
  }
  set('hud-tier', q.tier.toUpperCase(), q.tier === 'high' ? 'good' : q.tier === 'low' ? 'warn' : undefined)
  set('hud-webgpu', q.webgpu ? 'YES' : 'NO', q.webgpu ? 'good' : undefined)
  set('hud-dpr', `${q.dpr.toFixed(1)} → ${q.dprCap.toFixed(1)}`)
  set('hud-motion', q.reducedMotion ? 'REDUCED' : 'FULL', q.reducedMotion ? 'warn' : undefined)

  const row = document.querySelector(`.tier-row[data-tier="${q.tier}"]`)
  row?.classList.add('current')
  const verdict = document.getElementById('tier-verdict')
  if (verdict) {
    verdict.textContent =
      `YOUR VERDICT — ${q.tier.toUpperCase()} · WebGPU ${q.webgpu ? 'available' : 'unavailable'} · ` +
      `DPR ${q.dpr.toFixed(1)} capped to ${q.dprCap.toFixed(1)} · motion ${q.reducedMotion ? 'reduced' : 'full'}`
  }
}

/** FPS 미터 — gsap ticker에 물려 1초마다 HUD 갱신 */
export function makeFpsMeter() {
  const el = document.getElementById('hud-fps')
  let frames = 0
  let last = performance.now()
  return () => {
    frames++
    const now = performance.now()
    if (now - last >= 1000) {
      if (el) el.textContent = String(frames)
      frames = 0
      last = now
    }
  }
}
