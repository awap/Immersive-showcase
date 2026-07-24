/** SPECIMEN — HERO: fbm 노이즈 gradient field + 포인터 스월 (fragment shader) */
import * as THREE from 'three'
import { clampedDPR, makeLoop, onResize, runWhileVisible } from '../lib/stage'
import type { Quality } from '../lib/quality'

const FRAG = /* glsl */ `
precision highp float;
varying vec2 vUv;
uniform float uTime;
uniform vec2 uRes;
uniform vec2 uPointer;

float hash(vec2 p){ return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453123); }
float noise(vec2 p){
  vec2 i = floor(p), f = fract(p);
  vec2 u = f * f * (3.0 - 2.0 * f);
  return mix(mix(hash(i), hash(i + vec2(1.0, 0.0)), u.x),
             mix(hash(i + vec2(0.0, 1.0)), hash(i + vec2(1.0, 1.0)), u.x), u.y);
}
float fbm(vec2 p){
  float v = 0.0, a = 0.5;
  for(int i = 0; i < 5; i++){ v += a * noise(p); p *= 2.03; a *= 0.5; }
  return v;
}

void main(){
  vec2 uv = vUv;
  vec2 asp = vec2(uRes.x / uRes.y, 1.0);
  vec2 p = uv * asp * 1.7;
  float t = uTime * 0.045;

  vec2 d = (uv - uPointer) * asp;
  float pr = exp(-dot(d, d) * 7.0);
  p += normalize(d + 1e-4) * pr * 0.45;

  float warp = fbm(p * 1.4 - t);
  float n = fbm(p + vec2(t, -t * 0.6) + warp * 0.9);

  vec3 bg    = vec3(0.047, 0.059, 0.086);
  vec3 iris  = vec3(0.557, 0.545, 0.937);
  vec3 amber = vec3(0.894, 0.725, 0.357);

  vec3 col = bg;
  col = mix(col, iris * 0.42, smoothstep(0.34, 0.78, n));
  col = mix(col, amber * 0.46, smoothstep(0.74, 0.96, n) * 0.85);
  col += iris * pr * 0.10;

  float vig = smoothstep(1.35, 0.35, length((uv - 0.5) * asp));
  col *= mix(0.75, 1.0, vig);
  col += (hash(uv * uRes + uTime) - 0.5) * 0.028; // grain

  gl_FragColor = vec4(col, 1.0);
}`

const VERT = /* glsl */ `
varying vec2 vUv;
void main(){ vUv = uv; gl_Position = vec4(position, 1.0); }`

export function initHero(canvas: HTMLCanvasElement, q: Quality) {
  let renderer: THREE.WebGLRenderer
  try {
    renderer = new THREE.WebGLRenderer({ canvas, antialias: false })
  } catch {
    canvas.style.background = 'radial-gradient(circle at 30% 70%, #23244a 0%, #0c0f16 60%)'
    return
  }
  renderer.setPixelRatio(clampedDPR())

  const scene = new THREE.Scene()
  const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1)
  const uniforms = {
    uTime: { value: 0 },
    uRes: { value: new THREE.Vector2(1, 1) },
    uPointer: { value: new THREE.Vector2(0.5, 0.35) },
  }
  scene.add(
    new THREE.Mesh(
      new THREE.PlaneGeometry(2, 2),
      new THREE.ShaderMaterial({ vertexShader: VERT, fragmentShader: FRAG, uniforms }),
    ),
  )

  const target = new THREE.Vector2(0.5, 0.35)
  window.addEventListener('pointermove', (e) => {
    const r = canvas.getBoundingClientRect()
    if (e.clientY < r.top || e.clientY > r.bottom) return
    target.set((e.clientX - r.left) / r.width, 1 - (e.clientY - r.top) / r.height)
  })

  onResize(canvas, (w, h) => {
    renderer.setSize(w, h, false)
    uniforms.uRes.value.set(w, h)
    if (q.reducedMotion) {
      uniforms.uTime.value = 40
      renderer.render(scene, camera)
    }
  })

  if (q.reducedMotion) return

  const loop = makeLoop((dt) => {
    uniforms.uTime.value += dt
    uniforms.uPointer.value.lerp(target, 0.06)
    renderer.render(scene, camera)
  })
  runWhileVisible(canvas, loop)
}
