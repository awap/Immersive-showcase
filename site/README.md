# Immersive Atlas — 몰입형 웹 기술 표본실 2026

`Immersive Website 기술 스택 총정리, 2026` 문서를 살아있는 학습 쇼케이스로 옮긴 사이트.
각 기술을 **라이브 데모(표본) + 네이티브 해설 + 리스크 + 응용 케이스 + 레퍼런스**로 전시한다.
사이트 자체가 문서의 원칙을 실증한다 — Semantic DOM 위의 GPU 레이어, DPR 상한 1.5,
reduced-motion 폴백, Sound Off 기본, 기기 티어별 파티클 수 조절.

## 실행

```bash
npm install
npm run dev      # http://localhost:5173
npm run build    # dist/
```

## 스택 (문서의 "조합 C — Creative Coding형")

Vite + TypeScript + Three.js(GLSL) + GSAP ScrollTrigger + Lenis. 프레임워크 없음.

## 구조

```
index.html            # 모든 콘텐츠 — 시맨틱 DOM, 표본 00~14
src/main.ts           # 부트스트랩: Lenis(gsap ticker 단일 rAF), HUD, 레일, 데모 배선
src/style.css         # 디자인 시스템 (Instrument Serif / Pretendard / IBM Plex Mono)
src/lib/quality.ts    # 기기 티어 감지(WebGPU·DPR·메모리·터치·reduced-motion) + HUD
src/lib/stage.ts      # 데모 공통: 보일 때만 rAF, DPR 상한, ResizeObserver 자가복구
src/demos/hero.ts     # fbm 노이즈 gradient field + 포인터 스월 (fragment shader)
src/demos/scrolly.ts  # ScrollTrigger scrub → 3D 카메라 돌리 + DOM 자막 동기화
src/demos/shader.ts   # 포인터 속도 왜곡 + 노이즈 dissolve 전환 (절차적 텍스처)
src/demos/particles.ts# 16k 파티클, 위치 계산은 vertex shader, 커서 반발력
src/demos/typography.ts # DOM 글자 분할 + transform 스태거 (aria-label 보존)
src/demos/vector.ts   # SVG stroke-dashoffset 드로잉 + path 좌표 morph
src/demos/canvas2d.ts # 노이즈 흐름장 flow field, 커서가 장을 휜다
src/demos/physics.ts  # spring + damping + noise — 물리 엔진 없는 가짜 물리
src/demos/audio.ts    # 오실레이터 신스 루프 + AnalyserNode 방사형 스펙트럼
```

## 설계 원칙 (표본이 지키는 것)

- **소유권 분리**: GSAP=시간, Three.js=공간, Lenis=스크롤 입력. 같은 값을 두 도구가 만지지 않는다.
- **캔버스는 장식**: 모든 canvas는 `aria-hidden`, 텍스트는 전부 실제 HTML.
- **보일 때만 돈다**: 데모마다 IntersectionObserver로 rAF를 켜고 끈다.
- **티어 서빙**: 파티클 수 high 16k / mid 8k / low 3k, DPR은 `min(dpr, 1.5)`.
- **폴백**: reduced-motion이면 정적 프레임, WebGL 실패면 CSS 그라디언트, 소리는 기본 꺼짐.
