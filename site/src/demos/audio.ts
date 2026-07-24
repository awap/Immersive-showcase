/** SPECIMEN 09 — Audio Reactive: 오실레이터로 합성한 신스 루프 + AnalyserNode 스펙트럼 */
import { fit2d, makeLoop, runWhileVisible } from '../lib/stage'

const SCALE = [0, 3, 5, 7, 10, 12, 15] // 마이너 펜타토닉 확장
const BASE = 110 // A2
const BPM = 96

export function initAudio(canvas: HTMLCanvasElement) {
  const btn = document.getElementById('audio-toggle') as HTMLButtonElement | null
  const c2d = canvas.getContext('2d')
  if (!btn || !c2d) return

  let ctx: AudioContext | null = null
  let analyser: AnalyserNode | null = null
  let master: GainNode | null = null
  let schedulerId = 0
  let playing = false
  let bins = new Uint8Array(new ArrayBuffer(0))

  const noteAt = (time: number, step: number) => {
    if (!ctx || !master) return
    const semitone = SCALE[Math.floor(Math.random() * SCALE.length)] + (step % 8 === 0 ? 12 : 0)
    const freq = BASE * Math.pow(2, semitone / 12)

    const osc = ctx.createOscillator()
    osc.type = 'sawtooth'
    osc.frequency.value = freq
    const filt = ctx.createBiquadFilter()
    filt.type = 'lowpass'
    filt.frequency.setValueAtTime(1600, time)
    filt.frequency.exponentialRampToValueAtTime(320, time + 0.32)
    const env = ctx.createGain()
    env.gain.setValueAtTime(0, time)
    env.gain.linearRampToValueAtTime(0.55, time + 0.015)
    env.gain.exponentialRampToValueAtTime(0.001, time + 0.4)
    osc.connect(filt).connect(env).connect(master)
    osc.start(time)
    osc.stop(time + 0.45)

    if (step % 4 === 0) {
      // 킥 — 주파수가 급강하하는 사인파
      const k = ctx.createOscillator()
      k.frequency.setValueAtTime(130, time)
      k.frequency.exponentialRampToValueAtTime(38, time + 0.14)
      const kg = ctx.createGain()
      kg.gain.setValueAtTime(0.9, time)
      kg.gain.exponentialRampToValueAtTime(0.001, time + 0.22)
      k.connect(kg).connect(master)
      k.start(time)
      k.stop(time + 0.25)
    }
  }

  const startAudio = () => {
    ctx = new AudioContext()
    master = ctx.createGain()
    master.gain.value = 0.14

    const delay = ctx.createDelay()
    delay.delayTime.value = (60 / BPM) * 0.75
    const fb = ctx.createGain()
    fb.gain.value = 0.34
    delay.connect(fb).connect(delay)

    analyser = ctx.createAnalyser()
    analyser.fftSize = 128
    analyser.smoothingTimeConstant = 0.82
    bins = new Uint8Array(new ArrayBuffer(analyser.frequencyBinCount))

    master.connect(delay)
    master.connect(analyser)
    delay.connect(analyser)
    analyser.connect(ctx.destination)

    // 룩어헤드 스케줄러 — setTimeout이 아니라 오디오 클럭으로 박자를 잡는다
    const eighth = 60 / BPM / 2
    let nextTime = ctx.currentTime + 0.1
    let step = 0
    const tickSchedule = () => {
      if (!ctx) return
      while (nextTime < ctx.currentTime + 0.25) {
        noteAt(nextTime, step)
        nextTime += eighth
        step++
      }
      schedulerId = window.setTimeout(tickSchedule, 90)
    }
    tickSchedule()
  }

  const stopAudio = () => {
    clearTimeout(schedulerId)
    ctx?.close()
    ctx = null
    analyser = null
    master = null
  }

  btn.addEventListener('click', () => {
    playing = !playing
    if (playing) startAudio()
    else stopAudio()
    btn.setAttribute('aria-pressed', String(playing))
    btn.textContent = playing ? '■ Sound Off' : '▶ Sound On — 신스 루프 시작'
  })

  // 비주얼 — 방사형 스펙트럼 링
  let phase = 0
  const draw = (dt: number) => {
    const { w, h, dpr } = fit2d(canvas)
    c2d.setTransform(dpr, 0, 0, dpr, 0, 0)
    c2d.fillStyle = '#0f1320'
    c2d.fillRect(0, 0, w, h)

    const cx = w / 2
    const cy = h / 2
    const base = Math.min(w, h) * 0.22
    phase += dt * 0.4

    if (analyser) analyser.getByteFrequencyData(bins)
    const n = bins.length || 48
    let bass = 0
    for (let i = 0; i < 6 && i < n; i++) bass += bins[i] ?? 0
    bass /= 6 * 255

    // 중심 원 — 저역에 반응
    c2d.beginPath()
    c2d.arc(cx, cy, base * (0.5 + bass * 0.5), 0, Math.PI * 2)
    c2d.strokeStyle = 'rgba(228,185,91,0.9)'
    c2d.lineWidth = 1.6
    c2d.stroke()

    for (let i = 0; i < n; i++) {
      const v = playing && bins.length ? (bins[i] ?? 0) / 255 : 0.05 + Math.sin(i * 0.6 + phase) * 0.03
      const a = (i / n) * Math.PI * 2 - Math.PI / 2 + phase * 0.15
      const r0 = base
      const r1 = base + v * base * 1.4 + 2
      c2d.beginPath()
      c2d.moveTo(cx + Math.cos(a) * r0, cy + Math.sin(a) * r0)
      c2d.lineTo(cx + Math.cos(a) * r1, cy + Math.sin(a) * r1)
      c2d.strokeStyle = v > 0.55 ? 'rgba(228,185,91,0.85)' : 'rgba(142,139,239,0.6)'
      c2d.lineWidth = 2.2
      c2d.stroke()
    }
  }

  const loop = makeLoop(draw)
  runWhileVisible(canvas, loop)

  // 탭을 떠나면 정지 — 배경 탭에서 소리내지 않는 매너
  document.addEventListener('visibilitychange', () => {
    if (document.hidden && playing) btn.click()
  })
}
