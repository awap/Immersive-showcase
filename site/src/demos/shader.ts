/** SPECIMEN 02 — Custom Shader: 포인터 속도 왜곡 + 노이즈 dissolve 전환 */
import * as THREE from 'three'
import gsap from 'gsap'
import { clampedDPR, makeLoop, onResize, runWhileVisible } from '../lib/stage'
import type { Quality } from '../lib/quality'

const FRAG = /* glsl */ `
precision highp float;
varying vec2 vUv;
uniform sampler2D tA;
uniform sampler2D tB;
uniform float uProg;
uniform float uTime;
uniform vec2 uPointer;
uniform vec2 uVel;

float hash(vec2 p){ return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453123); }
float noise(vec2 p){
  vec2 i = floor(p), f = fract(p);
  vec2 u = f * f * (3.0 - 2.0 * f);
  return mix(mix(hash(i), hash(i + vec2(1.0, 0.0)), u.x),
             mix(hash(i + vec2(0.0, 1.0)), hash(i + vec2(1.0, 1.0)), u.x), u.y);
}
float fbm(vec2 p){
  float v = 0.0, a = 0.5;
  for(int i = 0; i < 4; i++){ v += a * noise(p); p *= 2.1; a *= 0.5; }
  return v;
}

void main(){
  vec2 uv = vUv;

  // 포인터 속도가 국소적으로 UV를 밀어낸다 — 유체 왜곡의 원리
  vec2 d = uv - uPointer;
  float pr = exp(-dot(d, d) * 26.0);
  uv -= uVel * pr * 0.45;
  uv.x += sin(uv.y * 24.0 + uTime * 1.5) * pr * 0.012;

  // 노이즈 임계값 dissolve
  float n = fbm(uv * 4.5 + 3.7);
  float edge = smoothstep(uProg - 0.09, uProg + 0.09, n + (1.0 - uProg * 2.0) * 0.0);

  vec3 a = texture2D(tA, uv).rgb;
  vec3 b = texture2D(tB, uv).rgb;
  vec3 col = mix(b, a, edge);

  // 경계선 발광
  float band = smoothstep(0.09, 0.0, abs(n - uProg));
  col += vec3(0.894, 0.725, 0.357) * band * 0.8 * step(0.01, uProg) * step(uProg, 0.99);

  gl_FragColor = vec4(col, 1.0);
}`

const VERT = /* glsl */ `
varying vec2 vUv;
void main(){ vUv = uv; gl_Position = vec4(position, 1.0); }`

/** 외부 이미지 없이 캔버스로 굽는 절차적 텍스처 */
function bakeTexture(kind: 'rings' | 'stripes'): THREE.CanvasTexture {
  const c = document.createElement('canvas')
  c.width = 1024
  c.height = 640
  const ctx = c.getContext('2d')!

  if (kind === 'rings') {
    ctx.fillStyle = '#0f1320'
    ctx.fillRect(0, 0, 1024, 640)
    for (let i = 26; i > 0; i--) {
      ctx.beginPath()
      ctx.arc(400, 340, i * 26, 0, Math.PI * 2)
      ctx.strokeStyle = i % 5 === 0 ? 'rgba(228,185,91,0.8)' : 'rgba(142,139,239,0.55)'
      ctx.lineWidth = i % 5 === 0 ? 3 : 1.4
      ctx.stroke()
    }
    const g = ctx.createRadialGradient(720, 160, 20, 720, 160, 320)
    g.addColorStop(0, 'rgba(142,139,239,0.5)')
    g.addColorStop(1, 'rgba(142,139,239,0)')
    ctx.fillStyle = g
    ctx.fillRect(0, 0, 1024, 640)
    ctx.font = '500 34px "IBM Plex Mono", monospace'
    ctx.fillStyle = '#e9e4d6'
    ctx.fillText('TEXTURE A — CONTOUR', 60, 90)
  } else {
    ctx.fillStyle = '#141018'
    ctx.fillRect(0, 0, 1024, 640)
    for (let x = -640; x < 1024; x += 46) {
      ctx.beginPath()
      ctx.moveTo(x, 640)
      ctx.lineTo(x + 640, 0)
      ctx.strokeStyle = 'rgba(228,185,91,0.55)'
      ctx.lineWidth = 10
      ctx.stroke()
    }
    const g = ctx.createRadialGradient(300, 420, 30, 300, 420, 380)
    g.addColorStop(0, 'rgba(228,185,91,0.75)')
    g.addColorStop(1, 'rgba(228,185,91,0)')
    ctx.fillStyle = g
    ctx.beginPath()
    ctx.arc(300, 420, 200, 0, Math.PI * 2)
    ctx.fill()
    ctx.font = '500 34px "IBM Plex Mono", monospace'
    ctx.fillStyle = '#0c0f16'
    ctx.fillText('TEXTURE B — HATCH', 560, 570)
  }
  const tex = new THREE.CanvasTexture(c)
  tex.colorSpace = THREE.SRGBColorSpace
  return tex
}

export function initShader(canvas: HTMLCanvasElement, q: Quality) {
  let renderer: THREE.WebGLRenderer
  try {
    renderer = new THREE.WebGLRenderer({ canvas, antialias: false })
  } catch {
    canvas.style.background = 'linear-gradient(135deg, #23244a, #0c0f16)'
    return
  }
  renderer.setPixelRatio(clampedDPR())

  const scene = new THREE.Scene()
  const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1)
  const uniforms = {
    tA: { value: bakeTexture('rings') },
    tB: { value: bakeTexture('stripes') },
    uProg: { value: 0 },
    uTime: { value: 0 },
    uPointer: { value: new THREE.Vector2(0.5, 0.5) },
    uVel: { value: new THREE.Vector2(0, 0) },
  }
  scene.add(
    new THREE.Mesh(
      new THREE.PlaneGeometry(2, 2),
      new THREE.ShaderMaterial({ vertexShader: VERT, fragmentShader: FRAG, uniforms }),
    ),
  )

  const target = new THREE.Vector2(0.5, 0.5)
  const rawVel = new THREE.Vector2()
  let prev: { x: number; y: number } | null = null

  canvas.addEventListener('pointermove', (e) => {
    const r = canvas.getBoundingClientRect()
    const x = (e.clientX - r.left) / r.width
    const y = 1 - (e.clientY - r.top) / r.height
    if (prev) rawVel.set((x - prev.x) * 14, (y - prev.y) * 14)
    prev = { x, y }
    target.set(x, y)
  })
  canvas.addEventListener('pointerleave', () => (prev = null))

  let dissolved = false
  canvas.addEventListener('click', () => {
    dissolved = !dissolved
    gsap.to(uniforms.uProg, { value: dissolved ? 1 : 0, duration: 1.4, ease: 'power2.inOut' })
  })

  onResize(canvas, (w, h) => {
    renderer.setSize(w, h, false)
    if (q.reducedMotion) renderer.render(scene, camera)
  })

  if (q.reducedMotion) {
    canvas.addEventListener('click', () => renderer.render(scene, camera))
    return
  }

  const loop = makeLoop((dt) => {
    uniforms.uTime.value += dt
    uniforms.uPointer.value.lerp(target, 0.12)
    uniforms.uVel.value.lerp(rawVel, 0.08)
    rawVel.multiplyScalar(0.9)
    renderer.render(scene, camera)
  })
  runWhileVisible(canvas, loop)
}
