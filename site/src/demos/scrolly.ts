/** SPECIMEN 01 — Scrollytelling: ScrollTrigger scrub이 3D 카메라 돌리를 소유한다 */
import * as THREE from 'three'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { clampedDPR, makeLoop, onResize, runWhileVisible } from '../lib/stage'
import type { Quality } from '../lib/quality'

const IRIS = 0x8e8bef
const AMBER = 0xe4b95b

export function initScrolly(q: Quality) {
  const stage = document.getElementById('scrolly-stage')
  const canvas = stage?.querySelector<HTMLCanvasElement>('canvas[data-demo="scrolly"]')
  const pct = document.getElementById('scrolly-pct')
  if (!stage || !canvas) return

  let renderer: THREE.WebGLRenderer
  try {
    renderer = new THREE.WebGLRenderer({ canvas, antialias: true })
  } catch {
    return
  }
  renderer.setPixelRatio(clampedDPR())

  const scene = new THREE.Scene()
  scene.fog = new THREE.Fog(0x0f1320, 6, 46)
  const camera = new THREE.PerspectiveCamera(58, 1, 0.1, 120)

  // 링 회랑 — 카메라가 통과할 공간
  const rings = new THREE.Group()
  for (let i = 0; i < 22; i++) {
    const geo = new THREE.TorusGeometry(2.3 + Math.sin(i * 0.7) * 0.5, 0.012, 8, 72)
    const mat = new THREE.MeshBasicMaterial({
      color: i % 4 === 0 ? AMBER : IRIS,
      transparent: true,
      opacity: i % 4 === 0 ? 0.75 : 0.4,
    })
    const ring = new THREE.Mesh(geo, mat)
    ring.position.z = -i * 3.2
    ring.rotation.z = i * 0.25
    rings.add(ring)
  }
  scene.add(rings)

  // 종착점의 모노리스
  const mono = new THREE.Mesh(
    new THREE.IcosahedronGeometry(1.5, 1),
    new THREE.MeshBasicMaterial({ color: AMBER, wireframe: true, transparent: true, opacity: 0.9 }),
  )
  mono.position.z = -78
  scene.add(mono)

  // 별먼지
  const starGeo = new THREE.BufferGeometry()
  const starCount = q.tier === 'low' ? 300 : 900
  const pos = new Float32Array(starCount * 3)
  for (let i = 0; i < starCount; i++) {
    pos[i * 3] = (Math.random() - 0.5) * 30
    pos[i * 3 + 1] = (Math.random() - 0.5) * 18
    pos[i * 3 + 2] = -Math.random() * 90
  }
  starGeo.setAttribute('position', new THREE.BufferAttribute(pos, 3))
  scene.add(new THREE.Points(starGeo, new THREE.PointsMaterial({ color: 0xe9e4d6, size: 0.05, transparent: true, opacity: 0.5 })))

  const CENTER = new THREE.Vector3(0, 0, -78)
  const state = { p: 0 }

  const applyCamera = () => {
    const p = state.p
    if (p < 0.62) {
      const t = p / 0.62
      camera.position.set(Math.sin(t * 4.2) * 1.1, Math.cos(t * 3.1) * 0.5, 6 - t * 76) // 6 → -70
      camera.lookAt(0, 0, camera.position.z - 10)
    } else {
      const t = (p - 0.62) / 0.38
      const theta = t * Math.PI * 1.25
      const r = 8 - t * 2.5
      camera.position.set(Math.sin(theta) * r, Math.sin(t * 2.2) * 1.2, CENTER.z + Math.cos(theta) * r)
      camera.lookAt(CENTER)
    }
  }

  onResize(canvas, (w, h) => {
    renderer.setSize(w, h, false)
    camera.aspect = w / h
    camera.updateProjectionMatrix()
    if (q.reducedMotion) {
      applyCamera()
      renderer.render(scene, camera)
    }
  })

  const captions = Array.from(stage.querySelectorAll<HTMLElement>('.scrolly-caption'))

  if (q.reducedMotion) {
    // 정적 폴백 — 스크럽 없이 한 프레임과 첫 자막만
    stage.style.height = '110vh'
    state.p = 0.2
    applyCamera()
    renderer.render(scene, camera)
    if (captions[0]) gsap.set(captions[0], { opacity: 1, y: 0 })
    return
  }

  // 스크럽 타임라인 — 시간의 소유자는 GSAP 하나뿐
  const tl = gsap.timeline({
    scrollTrigger: { trigger: stage, start: 'top top', end: 'bottom bottom', scrub: 0.6 },
    defaults: { ease: 'none' },
  })
  tl.to(state, { p: 1, duration: 10 }, 0)
  const slots = [
    [0.4, 3.2],
    [3.8, 6.4],
    [7.0, 9.6],
  ]
  captions.forEach((cap, i) => {
    const [inT, outT] = slots[i]
    tl.to(cap, { opacity: 1, y: 0, duration: 0.7, ease: 'power2.out' }, inT)
    tl.to(cap, { opacity: 0, y: -18, duration: 0.6, ease: 'power2.in' }, outT)
  })

  const loop = makeLoop((dt) => {
    mono.rotation.x += dt * 0.3
    mono.rotation.y += dt * 0.45
    rings.children.forEach((ring, i) => (ring.rotation.z += dt * 0.05 * (i % 2 ? 1 : -1)))
    applyCamera()
    if (pct) pct.textContent = `${Math.round(state.p * 100)}%`
    renderer.render(scene, camera)
  })
  runWhileVisible(stage, loop)

  return () => ScrollTrigger.refresh()
}
