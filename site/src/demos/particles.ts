/** SPECIMEN 03 — Particles: 위치 계산은 vertex shader가, 커서는 반발력 필드가 */
import * as THREE from 'three'
import { clampedDPR, makeLoop, onResize, runWhileVisible } from '../lib/stage'
import type { Quality } from '../lib/quality'

const VERT = /* glsl */ `
attribute float aSeed;
uniform float uTime;
uniform vec3 uPointer;
uniform float uForce;
varying float vGlow;

void main(){
  vec3 p = position;

  // 노이즈 흐름 — sin/cos 조합의 curl 근사. CPU는 관여하지 않는다
  float s = aSeed * 6.2831;
  p.x += sin(uTime * 0.35 + s + p.y * 0.6) * 0.55;
  p.y += cos(uTime * 0.28 + s * 1.7 + p.x * 0.5) * 0.45;
  p.z += sin(uTime * 0.22 + s * 2.3) * 0.5;

  // 커서 반발력 필드
  vec3 d = p - uPointer;
  float dist = length(d);
  float f = uForce * exp(-dist * 1.1);
  p += (d / max(dist, 0.001)) * f * 2.2;
  vGlow = f;

  vec4 mv = modelViewMatrix * vec4(p, 1.0);
  gl_PointSize = (1.2 + aSeed * 1.6 + f * 5.0) * (16.0 / -mv.z) * DPR;
  gl_Position = projectionMatrix * mv;
}`

const FRAG = /* glsl */ `
precision highp float;
varying float vGlow;
void main(){
  vec2 c = gl_PointCoord - 0.5;
  float a = smoothstep(0.5, 0.15, length(c));
  vec3 iris = vec3(0.557, 0.545, 0.937);
  vec3 amber = vec3(0.894, 0.725, 0.357);
  vec3 col = mix(iris, amber, clamp(vGlow * 2.4, 0.0, 1.0));
  gl_FragColor = vec4(col, a * 0.55);
}`

export function initParticles(canvas: HTMLCanvasElement, q: Quality) {
  let renderer: THREE.WebGLRenderer
  try {
    renderer = new THREE.WebGLRenderer({ canvas, antialias: false })
  } catch {
    return
  }
  renderer.setPixelRatio(clampedDPR())

  const COUNT = q.tier === 'high' ? 16000 : q.tier === 'mid' ? 8000 : 3000
  const label = document.getElementById('particle-count')
  if (label) label.textContent = COUNT.toLocaleString()

  const scene = new THREE.Scene()
  const camera = new THREE.PerspectiveCamera(55, 1, 0.1, 60)
  camera.position.z = 9

  const geo = new THREE.BufferGeometry()
  const pos = new Float32Array(COUNT * 3)
  const seed = new Float32Array(COUNT)
  for (let i = 0; i < COUNT; i++) {
    pos[i * 3] = (Math.random() - 0.5) * 16
    pos[i * 3 + 1] = (Math.random() - 0.5) * 9
    pos[i * 3 + 2] = (Math.random() - 0.5) * 6
    seed[i] = Math.random()
  }
  geo.setAttribute('position', new THREE.BufferAttribute(pos, 3))
  geo.setAttribute('aSeed', new THREE.BufferAttribute(seed, 1))

  const uniforms = {
    uTime: { value: 0 },
    uPointer: { value: new THREE.Vector3(999, 999, 0) },
    uForce: { value: 0 },
  }
  const mat = new THREE.ShaderMaterial({
    vertexShader: VERT,
    fragmentShader: FRAG,
    uniforms,
    transparent: true,
    depthWrite: false,
    blending: THREE.AdditiveBlending,
    defines: { DPR: clampedDPR().toFixed(2) },
  })
  scene.add(new THREE.Points(geo, mat))

  // 포인터 → z=0 평면의 월드 좌표
  const ray = new THREE.Raycaster()
  const planeZ = new THREE.Plane(new THREE.Vector3(0, 0, 1), 0)
  const ndc = new THREE.Vector2()
  const hit = new THREE.Vector3()
  const targetPtr = new THREE.Vector3(999, 999, 0)
  let forceTarget = 0

  canvas.addEventListener('pointermove', (e) => {
    const r = canvas.getBoundingClientRect()
    ndc.set(((e.clientX - r.left) / r.width) * 2 - 1, -((e.clientY - r.top) / r.height) * 2 + 1)
    ray.setFromCamera(ndc, camera)
    if (ray.ray.intersectPlane(planeZ, hit)) targetPtr.copy(hit)
    forceTarget = 1
  })
  canvas.addEventListener('pointerleave', () => (forceTarget = 0))

  onResize(canvas, (w, h) => {
    renderer.setSize(w, h, false)
    camera.aspect = w / h
    camera.updateProjectionMatrix()
    if (q.reducedMotion) {
      uniforms.uTime.value = 20
      renderer.render(scene, camera)
    }
  })

  if (q.reducedMotion) return

  const loop = makeLoop((dt) => {
    uniforms.uTime.value += dt
    uniforms.uPointer.value.lerp(targetPtr, 0.14)
    uniforms.uForce.value += (forceTarget - uniforms.uForce.value) * 0.08
    renderer.render(scene, camera)
  })
  runWhileVisible(canvas, loop)
}
