# Immersive Website 기술 스택 총정리 — 2026

먼저 **Immersive Website**는 단순히 “3D가 들어간 웹사이트”가 아니다.

보통 다음 요소 중 여러 개가 결합된 경험을 뜻한다.

- 스크롤과 장면 전환이 연결되는 **Scrollytelling**
    
- 실시간 3D·파티클·쉐이더 기반 **Generative Visual**
    
- 포인터·터치·기기 움직임에 반응하는 **Spatial Interaction**
    
- 영상·타이포그래피·DOM·WebGL이 하나의 타임라인처럼 움직이는 **Cinematic Direction**
    
- 제품이나 브랜드 세계를 탐험하는 **Interactive Space**
    
- 경우에 따라 WebXR, Gaussian Splatting, 실시간 물리, 오디오 반응까지 포함
    

따라서 기술 스택도 하나의 라이브러리가 아니라 아래처럼 **여러 레이어의 조합**으로 봐야 한다.

---

# 1. 전체 기술 구조

```text
Application Framework
├─ Next.js / Astro / Vite / Nuxt / SvelteKit
│
Interaction & Motion
├─ GSAP / Motion / Lenis / Theatre.js
│
Visual Rendering
├─ CSS / SVG / Canvas 2D
├─ Three.js / React Three Fiber
├─ Babylon.js / PlayCanvas
└─ WebGPU / WebGL / WebXR
│
Visual Production
├─ Blender / Cinema 4D / Houdini
├─ Spline / Rive / After Effects
└─ Substance 3D
│
Asset Pipeline
├─ glTF / GLB
├─ Draco / Meshopt
├─ KTX2 / Basis Universal
└─ WebP / AVIF / MP4 / WebM
│
Content & Infrastructure
├─ Headless CMS
├─ CDN / Edge
├─ Analytics
└─ Performance Monitoring
```

핵심은 **모든 것을 WebGL로 만들지 않는 것**이다.

Immersive Website의 완성도는 3D 기술 자체보다 다음 세 가지에서 갈린다.

1. DOM과 GPU 장면의 동기화
    
2. 자산 최적화
    
3. 저사양·모바일 폴백 설계
    

---

# 2. 애플리케이션 프레임워크

## 2-1. Next.js

### 특징

React 기반의 풀스택 프레임워크다.

- SSR·SSG·동적 라우팅
    
- React Server Components
    
- 이미지 최적화
    
- API와 CMS 연결
    
- 대규모 서비스 구조
    
- Vercel 배포 생태계
    
- React Three Fiber와 자연스럽게 결합
    

### 장점

브랜드 사이트가 단순 캠페인 페이지가 아니라 다음 기능을 포함한다면 강하다.

- 계정
    
- 제품 데이터
    
- 글로벌 언어
    
- CMS
    
- 개인화
    
- 제품 컨피규레이터
    
- 여러 페이지
    
- 지속적인 운영
    

React Three Fiber가 React의 선언형 컴포넌트 구조 안에서 Three.js 장면을 구성하게 해주기 때문에, Next.js와의 조합이 가장 보편적인 3D 웹 애플리케이션 구조다. R3F 9는 React 19와 맞춰 사용하도록 문서화되어 있다. ([Poimandres Documentation](https://r3f.docs.pmnd.rs/?utm_source=chatgpt.com "React Three Fiber: Introduction"))

### 단점

- 작은 프로모션 사이트에는 구조가 과할 수 있음
    
- hydration 비용
    
- 서버 컴포넌트와 클라이언트 3D 컴포넌트의 경계 관리 필요
    
- GSAP·Canvas·WebGL 라이프사이클이 React 렌더링과 충돌할 수 있음
    
- 버전 변화가 빠름
    
- Vercel 방식에 지나치게 맞춰 설계하면 플랫폼 종속성이 생길 수 있음
    

### 추천 상황

- 중대형 브랜드 사이트
    
- 제품 컨피규레이터
    
- 로그인이나 CMS가 있는 몰입형 서비스
    
- 여러 인터랙티브 페이지를 장기 운영할 경우
    

---

## 2-2. Astro

### 특징

HTML을 기본으로 전송하고 필요한 부분에만 JavaScript를 활성화하는 **Islands Architecture**가 핵심이다.

페이지 대부분을 정적 HTML로 유지하고, 3D 캔버스나 메뉴 등 필요한 부분만 React·Vue·Svelte 컴포넌트로 넣을 수 있다. ([Astro Docs](https://docs.astro.build/en/concepts/islands/?utm_source=chatgpt.com "Islands architecture - Astro Docs"))

### 장점

- 초기 JavaScript 용량이 작음
    
- 콘텐츠 사이트와 Immersive Section의 균형이 좋음
    
- SEO와 초기 표시 성능에 유리
    
- 3D 캔버스를 하나의 독립적인 섬으로 격리 가능
    
- 프레임워크를 페이지별·컴포넌트별로 섞을 수 있음
    

### 단점

- 사이트 전체가 앱처럼 지속적으로 상태를 공유하면 복잡해짐
    
- 페이지 전환 전체를 하나의 3D 월드로 유지하기는 Next.js SPA 구조보다 불편
    
- R3F 생태계 예제는 React·Next.js 중심
    
- 개발자가 Astro와 React 양쪽 렌더링 모델을 이해해야 함
    

### 추천 상황

- 브랜드·에디토리얼 중심 사이트
    
- 대부분은 텍스트·이미지이고 히어로나 특정 챕터만 몰입형인 사이트
    
- SEO와 빠른 초기 표시가 중요한 경우
    
- 여러 개의 독립적인 인터랙티브 비주얼이 있는 경우
    

### 2026년 관점

**Immersive Website라고 무조건 Next.js를 쓰는 흐름에서 벗어나**, 콘텐츠 부분은 정적으로 두고 WebGL 영역만 활성화하는 구조가 점점 합리적인 선택으로 자리 잡고 있다.

---

## 2-3. Vite + Vanilla TypeScript

### 특징

프레임워크 없이 Three.js와 GSAP을 직접 제어하는 구조다.

```text
Vite
+ TypeScript
+ Three.js
+ GSAP
+ Lenis
```

### 장점

- 렌더 루프를 완전히 직접 관리
    
- React 렌더링과 충돌하지 않음
    
- 번들 구조가 단순
    
- 짧은 캠페인 사이트에 적합
    
- WebGL 개발자가 성능을 세밀하게 통제 가능
    

### 단점

- UI 상태가 복잡해질수록 직접 구현량 증가
    
- 컴포넌트 재사용·상태 관리가 약함
    
- 콘텐츠 운영이나 다국어 확장 시 구조가 쉽게 난잡해짐
    
- 개발자 개인 역량 의존도가 큼
    

### 추천 상황

- 단일 페이지 브랜드 캠페인
    
- 3D 장면이 사이트의 대부분을 차지
    
- 수명이 짧고 비주얼 임팩트가 최우선
    
- 숙련된 Creative Developer가 직접 개발
    

---

## 2-4. SvelteKit

### 특징

React보다 문법과 런타임 부담이 가볍고, 애니메이션과 반응형 상태를 간결하게 작성할 수 있다.

### 장점

- 상태와 DOM 애니메이션 코드가 단순
    
- 비교적 적은 보일러플레이트
    
- 인터랙티브 에디토리얼에 잘 맞음
    
- Three.js 직접 사용 시 깔끔함
    

### 단점

- React Three Fiber만큼 큰 3D 생태계가 없음
    
- 예제·전문 인력·에셋이 React보다 적음
    
- 협업사나 외부 인력 확보가 상대적으로 어려움
    

### 추천 상황

- 소규모 고숙련 팀
    
- 복잡한 React 생태계가 필요하지 않은 인터랙티브 사이트
    
- 개발자가 Svelte에 익숙한 경우
    

---

## 프레임워크 추천 요약

|상황|추천|
|---|---|
|대규모 운영형 브랜드 사이트|Next.js|
|콘텐츠 중심 + 일부 몰입형 비주얼|Astro|
|단기 캠페인·포트폴리오|Vite + Vanilla|
|소규모 고숙련 크리에이티브 팀|SvelteKit|
|쇼핑·로그인·CMS·다국어 포함|Next.js|
|랜딩 페이지 한 장|Astro 또는 Vite|

---

# 3. 3D 렌더링 스택

## 3-1. Three.js

웹 기반 3D에서 사실상 가장 넓은 생태계를 가진 저수준 3D 라이브러리다.

### 지원 영역

- Mesh
    
- Camera
    
- Lighting
    
- Shadow
    
- Post-processing
    
- Shader
    
- Particle
    
- glTF
    
- WebXR
    
- WebGL
    
- WebGPU
    

현재 Three.js는 `WebGPURenderer`를 제공하며, 브라우저가 WebGPU를 지원하면 WebGPU를 사용하고 그렇지 않으면 WebGL 2 백엔드로 폴백할 수 있다. ([Three.js](https://threejs.org/docs/pages/WebGPURenderer.html?utm_source=chatgpt.com "WebGPURenderer – three.js docs"))

### 장점

- 자유도가 가장 높음
    
- 레퍼런스가 많음
    
- 셰이더·포스트프로세싱 확장 용이
    
- 브랜드 사이트부터 데이터 시각화까지 범용적
    
- 특정 프레임워크에 종속되지 않음
    

### 단점

- 장면 관리·라이프사이클·리소스 해제를 직접 설계
    
- 상태가 복잡해지면 코드가 절차적으로 뒤엉킬 수 있음
    
- 디자이너가 직접 수정하기 어려움
    
- 최적화 지식이 없으면 금방 무거워짐
    

### 가장 적합한 용도

- 추상적 브랜드 키비주얼
    
- 커스텀 쉐이더
    
- 파티클 시스템
    
- 스크롤 기반 카메라 시퀀스
    
- 독특한 인터랙션
    

---

## 3-2. React Three Fiber

React Three Fiber는 별도의 3D 엔진이 아니라 **Three.js를 React 방식으로 작성하게 해주는 renderer**다. ([Poimandres Documentation](https://r3f.docs.pmnd.rs/?utm_source=chatgpt.com "React Three Fiber: Introduction"))

```jsx
<Canvas>
  <ambientLight />
  <mesh>
    <sphereGeometry />
    <meshStandardMaterial />
  </mesh>
</Canvas>
```

### 주요 생태계

- `@react-three/drei`: 카메라·환경·로더·컨트롤 헬퍼
    
- `@react-three/postprocessing`: Bloom, DOF, SSAO 등
    
- `react-spring/three`: 물리 기반 애니메이션
    
- `@react-three/rapier`: 물리 엔진
    
- Zustand: 장면 상태
    
- Leva: 실시간 파라미터 패널
    

R3F 공식 예제에도 반사, 소프트 섀도, 카우스틱, 포스트프로세싱, 물리, 캐릭터 컨트롤러 등 다양한 패턴이 제공된다. ([Poimandres Documentation](https://r3f.docs.pmnd.rs/getting-started/examples?utm_source=chatgpt.com "Examples - React Three Fiber"))

### 장점

- 3D 객체를 컴포넌트화
    
- UI와 장면 상태 연결이 쉬움
    
- 재사용성이 좋음
    
- AI 코딩 에이전트가 다루기 상대적으로 쉬움
    
- Next.js와 결합하기 좋음
    

### 단점

- React 렌더와 3D 렌더 루프의 개념이 혼재
    
- 무분별한 state 변경은 매 프레임 React 리렌더를 유발
    
- 추상화가 많아 원인을 찾기 어려울 수 있음
    
- 결국 Three.js와 GPU 기본 지식이 필요
    
- Drei 기능을 무심코 추가하면 비용이 커짐
    

### 오해

> R3F가 Three.js보다 느리다?

구조 자체가 반드시 느린 것은 아니다. 문제는 개발자가 매 프레임 React state를 업데이트하거나, 객체를 반복 생성하거나, 큰 컨텍스트를 갱신하는 식으로 잘못 사용할 때 발생한다.

---

## 3-3. Babylon.js

Three.js보다 **완성된 엔진**에 가깝다.

Babylon.js 9.0은 WebGPU·그래픽 기능·툴링과 최적화를 강화한 버전으로 소개되고 있으며, WebGPU와 WebGL 양쪽을 지원한다. ([Babylon.js Docs](https://doc.babylonjs.com/setup/support/webGPU/webGPUStatus?utm_source=chatgpt.com "WebGPU Status | Babylon.js Documentation"))

### 강점

- 물리
    
- 애니메이션
    
- GUI
    
- 에디터
    
- Node Material Editor
    
- Inspector
    
- XR
    
- 게임식 Scene 관리
    
- WebGPU 지원
    

### 장점

- 복잡한 3D 앱을 빠르게 구축
    
- 디버깅 툴이 좋음
    
- 엔진 차원의 기능이 풍부
    
- 제품 시뮬레이터·디지털 트윈에 적합
    

### 단점

- 순수 브랜드 사이트에는 구조가 다소 무거움
    
- Three.js보다 Creative Coding 레퍼런스가 적음
    
- 기존 프론트엔드 UI와 결합할 때 엔진 중심 사고가 필요
    

### 추천 상황

- 제품 컨피규레이터
    
- 가상 쇼룸
    
- 게임에 가까운 인터랙션
    
- 물리·충돌·XR이 중요한 프로젝트
    

---

## 3-4. PlayCanvas

브라우저에서 실행되는 3D 엔진이면서 시각적 에디터를 제공한다.

WebGL과 WebGPU를 지원하며, 게임·3D 시각화·AR/VR·플레이어블 광고·제품 컨피규레이터 용도를 공식적으로 내세운다. ([PlayCanvas](https://playcanvas.com/?utm_source=chatgpt.com "PlayCanvas | Open Source WebGL & WebGPU Game Engine"))

### 장점

- 디자이너와 개발자가 같은 웹 에디터에서 협업
    
- 장면 구성과 배포가 빠름
    
- 게임 엔진식 워크플로
    
- 모바일 대응이 비교적 좋음
    
- WebXR에 적합
    

### 단점

- 에디터 워크플로 의존
    
- 커스텀 브랜드 사이트 UI와 통합할 때 분리감이 생길 수 있음
    
- Three.js 생태계만큼 자료가 많지 않음
    
- 플랫폼에 대한 운영 의존성이 생길 수 있음
    

### 추천 상황

- WebXR
    
- 게임형 캠페인
    
- 3D 에디터 기반 협업
    
- 제품 체험
    
- 개발자보다 3D 아티스트 비중이 높은 팀
    

---

## 3D 엔진 선택 기준

|조건|추천|
|---|---|
|추상적인 브랜드 비주얼|Three.js|
|React 기반 사이트|React Three Fiber|
|게임·물리·XR|Babylon.js|
|에디터 기반 협업|PlayCanvas|
|제품 컨피규레이터|R3F 또는 Babylon.js|
|독창적인 쉐이더|Three.js / R3F|
|빠른 노코드 3D 임베드|Spline|

---

# 4. WebGL과 WebGPU

## WebGL

현재까지 가장 안정적인 웹 3D 기반이다.

### 장점

- 넓은 호환성
    
- 풍부한 자료
    
- 안정적인 라이브러리 생태계
    
- 대부분의 브랜드 웹에는 충분한 성능
    

### 단점

- 현대 GPU 기능을 충분히 활용하기 어려움
    
- CPU와 GPU 간 명령 비용
    
- Compute Shader 부재
    
- 복잡한 대규모 파티클·시뮬레이션에 제약
    

---

## WebGPU

WebGPU는 WebGL의 후속 GPU API로, 현대 GPU 구조에 더 가까운 렌더링과 범용 GPU 연산을 제공한다. MDN은 WebGPU가 최신 GPU 기능, 범용 연산, 더 효율적인 그래픽 처리를 제공한다고 설명한다. ([MDN Web Docs](https://developer.mozilla.org/en-US/docs/Web/API/WebGPU_API?utm_source=chatgpt.com "WebGPU API - MDN Web Docs - Mozilla"))

### WebGPU가 유리한 작업

- 수십만~수백만 파티클
    
- Compute Shader
    
- Fluid Simulation
    
- GPU 기반 물리
    
- 복잡한 Generative Visual
    
- Gaussian Splatting
    
- 브라우저 내 AI 추론
    
- 대규모 인스턴싱
    

### 리스크

- 기기·드라이버·브라우저별 동작 차이
    
- WebGL용 셰이더와 WGSL/TSL 간 전환 비용
    
- WebGL 기반 포스트프로세싱 플러그인의 호환 문제
    
- 개발 도구와 디버깅 노하우 부족
    
- 구형 모바일·인앱 브라우저 대응
    
- WebGPU 사용 가능 여부와 실제 안정성은 다름
    

### 2026년 추천 전략

```text
WebGPU-only
```

보다는

```text
WebGPU preferred
→ WebGL2 fallback
→ Static or Video fallback
```

구조를 추천한다.

Three.js의 WebGPURenderer도 이러한 다중 백엔드 방향을 지원한다. ([Three.js](https://threejs.org/docs/pages/WebGPURenderer.html?utm_source=chatgpt.com "WebGPURenderer – three.js docs"))

### 중요한 판단

일반 브랜드 사이트에서 WebGPU는 아직 **목표 자체가 아니라 최적화 수단**이다.

구형 스마트폰에서도 돌아갈 정도의 장면을 WebGPU로 옮긴다고 자동으로 더 좋은 경험이 되는 것은 아니다. WebGPU는 다음 조건에서 도입할 가치가 높다.

- GPU Compute가 실제로 필요
    
- 파티클 규모가 매우 큼
    
- WebGL 병목이 측정됨
    
- 장기적으로 엔진을 유지할 개발자가 있음
    

---

# 5. 애니메이션과 스크롤 스택

## 5-1. GSAP

Immersive Website에서 여전히 가장 중요한 타임라인 애니메이션 도구다.

### 핵심 기능

- Timeline
    
- ScrollTrigger
    
- Scrub
    
- Pin
    
- SVG 애니메이션
    
- DOM·Canvas·WebGL 값 동기화
    
- SplitText 계열 텍스트 연출
    
- 플러그인 기반 확장
    

GSAP 공식 문서는 Core 외에도 드래그와 여러 고급 애니메이션 기능을 제공하는 프로덕션용 애니메이션 도구로 설명한다. ([GSAP](https://gsap.com/docs/v3/?utm_source=chatgpt.com "docsHome | GSAP | Docs & Learning"))

### 강점

한 타임라인에 다음을 동시에 묶을 수 있다.

```text
Camera Position
Object Rotation
Shader Uniform
DOM Opacity
Typography Reveal
Sound Volume
Scroll Progress
```

### 단점

- 타임라인이 커지면 수정이 어려움
    
- React lifecycle과 중복 실행 위험
    
- ScrollTrigger를 섹션마다 무분별하게 생성하면 성능 저하
    
- ScrollTrigger 정리와 refresh 관리 필요
    
- 스크롤과 애니메이션 로직이 강하게 결합될 수 있음
    

### 추천

Cinematic Scrollytelling에는 가장 안정적인 선택이다.

---

## 5-2. Motion

이전의 Framer Motion이며 현재는 Motion이라는 이름을 사용한다.

React·JavaScript·Vue를 지원하며 레이아웃, 제스처, 스크롤, UI 전환에 적합한 애니메이션 라이브러리다. ([Motion](https://motion.dev/?utm_source=chatgpt.com "Motion: JavaScript & React animation library"))

### 강점

- UI 전환
    
- 페이지 트랜지션
    
- 레이아웃 애니메이션
    
- 버튼·카드·메뉴
    
- 드래그·제스처
    
- React 컴포넌트 단위 애니메이션
    

### 한계

복잡한 30초짜리 카메라 시퀀스나 여러 장면을 연결하는 타임라인은 GSAP이 더 편하다.

### 역할 구분

```text
GSAP
= 연출 감독, 전체 타임라인

Motion
= UI 컴포넌트의 움직임
```

둘을 함께 쓸 수 있지만, **같은 속성을 두 라이브러리가 동시에 제어해서는 안 된다.**

---

## 5-3. Lenis

Lenis는 Native Scroll을 기반으로 스크롤 감각을 부드럽게 만드는 도구다.

### 역할

- 관성형 스크롤
    
- 스크롤 값 정규화
    
- ScrollTrigger와 연결
    
- 데스크톱에서 세련된 스크롤 감각 제공
    

### 장점

- 스크롤 연출의 감각을 빠르게 개선
    
- GSAP과 많이 조합됨
    
- 커스텀 스크롤 엔진보다 접근성과 호환성이 나음
    

### 리스크

- 중첩 스크롤 영역과 충돌
    
- 모바일에서는 과도한 보간이 답답하게 느껴짐
    
- iOS 브라우저 주소창·오버스크롤 문제
    
- 스크롤 복원과 앵커 링크 문제
    
- `position: sticky`와 특정 구조에서 예상하지 못한 동작
    
- GSAP과 requestAnimationFrame을 중복 실행할 가능성
    

### 추천

Lenis의 강도를 낮게 사용해야 한다.

```text
Smoothness 100%
```

가 아니라

```text
Native Scroll 80%
+ Subtle Interpolation 20%
```

정도가 좋다.

---

## 5-4. Theatre.js

애니메이션 값을 코드가 아니라 타임라인 에디터에서 조절하도록 돕는다.

### 장점

- 카메라 시퀀스
    
- 제품 애니메이션
    
- 키프레임 조정
    
- 디자이너와 개발자 간 협업
    
- 숫자값을 코드에서 반복 수정하는 작업 감소
    

### 단점

- 런타임과 프로젝트 데이터 관리
    
- GSAP과 역할 중복
    
- 워크플로를 팀이 익혀야 함
    
- 단순 사이트에는 과도함
    

### 추천 상황

- 카메라 연출이 많음
    
- 디자이너가 타이밍을 직접 조정
    
- 15~60초 분량의 키프레임 기반 인터랙션
    

---

# 6. Spline

Spline은 3D 장면 제작과 웹 배포를 결합한 디자인 도구다.

Viewer 임베드, Vanilla JS Export, Runtime, Web Code API를 제공하며 코드에서 객체 속성을 변경하거나 액션을 트리거할 수 있다. ([Spline Documentation](https://docs.spline.design/exporting-your-scene/web/exporting-as-code?utm_source=chatgpt.com "Exporting as Code"))

## 장점

- 디자이너가 직접 3D 제작
    
- 빠른 프로토타입
    
- 이벤트·호버·드래그를 GUI에서 설정
    
- 임베드가 쉬움
    
- React·JavaScript 사이트와 연결 가능
    
- 간단한 브랜드 키비주얼 제작에 효율적
    

## 단점

- 런타임 내부 최적화 통제가 제한적
    
- 복잡한 커스텀 셰이더에 한계
    
- 에셋이 무거워지기 쉬움
    
- 세밀한 모바일 최적화가 어려움
    
- 장면 전체를 개발자가 완전히 재구성하기 어려움
    
- 플랫폼과 런타임 버전 의존성
    
- 접근성·SEO는 별도의 DOM 레이어로 해결해야 함
    

## 추천 활용법

Spline을 사이트 전체 엔진으로 쓰기보다 다음처럼 사용한다.

```text
DOM Website
├─ Navigation
├─ Typography
├─ Content
└─ Spline Hero Scene
```

즉, **히어로 키비주얼 또는 하나의 독립적인 인터랙션 모듈**로 사용하는 것이 안전하다.

## 비추천

- 10개 이상의 장면이 이어지는 스토리
    
- 복잡한 데이터 연결
    
- 대규모 제품 컨피규레이터
    
- 정교한 셰이더와 GPU 연산
    
- 낮은 사양 모바일까지 반드시 지원해야 하는 서비스
    

---

# 7. Blender·Cinema 4D·Houdini·Substance

Immersive Website는 웹 코드만으로 완성되지 않는다.

## Blender

### 역할

- 모델링
    
- UV
    
- 애니메이션
    
- 리깅
    
- Geometry Nodes
    
- glTF Export
    
- 베이크
    

### 장점

- 무료
    
- Geometry Nodes
    
- 웹용 glTF 파이프라인
    
- 대규모 커뮤니티
    
- AI와 자동화하기 쉬움
    

### 추천

웹 3D 프로젝트의 기본 제작 도구로 가장 현실적이다.

---

## Cinema 4D

### 강점

- 모션그래픽
    
- MoGraph
    
- 직관적인 애니메이션
    
- After Effects 연계
    
- 브랜드 영상 제작자에게 익숙함
    

### 리스크

Cinema 4D에서 멋진 장면을 만들었다고 웹에서 그대로 실행되는 것은 아니다.

- 지원되지 않는 Material
    
- 과도한 Polygon
    
- 복잡한 Deformer
    
- Renderer 전용 효과
    
- 베이크되지 않은 시뮬레이션
    

웹으로 옮길 때 상당 부분을 재구성해야 한다.

---

## Houdini

### 강점

- 절차적 모델링
    
- 파티클
    
- 시뮬레이션
    
- 복잡한 구조 생성
    
- 데이터 기반 Geometry
    

### 리스크

웹 런타임용 도구가 아니라 **에셋 생성 도구**다.

Houdini의 시뮬레이션을 그대로 웹에서 돌리는 것이 아니라 다음 중 하나로 변환한다.

- Geometry Cache
    
- Texture
    
- Point Data
    
- Instancing Data
    
- Bake된 Animation
    
- Custom Shader Logic
    

---

## Substance 3D Painter / Designer

### 역할

- PBR Texture 제작
    
- Normal·Roughness·Metalness
    
- 텍스처 베이크
    
- 재질 제작
    

### 주의

4K 텍스처 여러 장은 웹에서 치명적이다.

웹용에서는 보통 다음을 고려한다.

- 512~2048 텍스처
    
- ORM 채널 패킹
    
- KTX2 압축
    
- 반복 텍스처
    
- Detail Normal
    
- 필요 없는 채널 제거
    

---

# 8. 에셋 포맷과 최적화

## glTF / GLB

웹 3D의 기본 전송 포맷이다.

- Geometry
    
- Material
    
- Texture
    
- Animation
    
- Scene Hierarchy
    

를 담을 수 있다.

KTX2는 텍스처를 압축하고 GPU가 지원하는 형식으로 전달하며, Draco는 메시의 정점 데이터를 압축한다. ([Wikipedia](https://en.wikipedia.org/wiki/GlTF?utm_source=chatgpt.com "GlTF"))

---

## Draco

### 장점

- 메시 다운로드 크기 감소
    
- 고밀도 모델에 유리
    

### 리스크

- 클라이언트에서 디코딩 필요
    
- 저사양 기기에서 초기 디코딩 지연
    
- 이미 단순한 모델에는 이득이 작음
    

---

## Meshopt

### 특징

메시 압축과 GPU 친화적인 정점 최적화를 결합한다.

### 추천

실제 웹 프로젝트에서는 Draco와 Meshopt를 모두 테스트하고, 단순히 파일 크기만 아니라 다음을 측정해야 한다.

- 다운로드 시간
    
- 디코딩 시간
    
- 메인 스레드 점유
    
- 첫 프레임 표시 시간
    

---

## KTX2 / Basis Universal

웹 3D에서 텍스처 최적화의 핵심이다.

### 효과

- GPU 압축 상태로 사용
    
- VRAM 절약
    
- 전송량 감소
    
- 렌더링 성능 개선
    

### 중요도

모델 파일보다 **텍스처가 더 큰 병목**인 경우가 매우 많다.

---

## 영상 포맷

|포맷|용도|
|---|---|
|MP4/H.264|가장 넓은 호환성|
|WebM/VP9|투명·고효율 영상|
|AV1|고압축, 디코딩 비용 고려|
|Image Sequence|프레임 정밀 제어, 전송량 큼|
|Lottie|단순 벡터 모션|
|Rive|인터랙티브 벡터·상태 기반 모션|

---

# 9. Rive와 Lottie

## Lottie

After Effects 애니메이션을 JSON으로 내보내 웹에서 재생한다.

### 장점

- 아이콘
    
- 로더
    
- 간단한 벡터 애니메이션
    
- 디자이너 워크플로
    

### 단점

- 복잡한 마스크와 효과 호환 문제
    
- JSON이 의외로 커질 수 있음
    
- 인터랙션 상태 관리가 제한적
    
- 다수 인스턴스에서 CPU 비용 증가
    

---

## Rive

상태 머신 기반 인터랙티브 벡터 애니메이션에 강하다.

### 장점

- 입력에 반응
    
- 버튼·캐릭터·UI 상태
    
- 런타임 효율
    
- 하나의 파일에 상태와 모션 포함
    

### 적합한 용도

- 인터랙티브 로고
    
- 메뉴
    
- 마스코트
    
- 마이크로 인터랙션
    
- 2D 게임형 UI
    

### 비적합

- 사실적 3D
    
- 복잡한 카메라 공간
    
- 거대한 브랜드 월드
    

---

# 10. Canvas 2D·SVG·CSS

모든 몰입형 효과를 Three.js로 만들 필요는 없다.

## CSS

적합한 것:

- Typography
    
- Blur
    
- Clip-path
    
- Mask
    
- Blend mode
    
- View transition
    
- 기본 Parallax
    
- Hover Motion
    

장점:

- 접근성
    
- SEO
    
- 성능
    
- 반응형
    
- 유지보수
    

---

## SVG

적합한 것:

- 로고 애니메이션
    
- 라인 드로잉
    
- Morph
    
- Diagram
    
- Interactive Map
    
- Path 기반 모션
    

### 장점

DOM처럼 제어 가능하고 벡터 품질이 유지된다.

### 단점

수천 개 이상의 SVG 노드를 움직이면 CPU 병목이 생긴다.

---

## Canvas 2D

적합한 것:

- 2D 파티클
    
- 드로잉
    
- 이미지 왜곡
    
- 노이즈
    
- 간단한 시뮬레이션
    

### 장점

Three.js보다 구조가 단순하다.

### 단점

접근성과 DOM 상호작용을 따로 설계해야 한다.

---

# 11. 셰이더

Immersive Website의 “그 사이트만의 느낌”은 대부분 커스텀 셰이더에서 나온다.

## 주요 용도

- Fluid Distortion
    
- Noise Deformation
    
- Dissolve
    
- Gradient Field
    
- Image Transition
    
- Refraction
    
- Fresnel
    
- Holographic Surface
    
- Particle Movement
    
- Vertex Displacement
    

## 기술

### GLSL

WebGL의 기본 셰이더 언어다.

### WGSL

WebGPU의 셰이더 언어다.

### TSL

Three Shader Language. Three.js가 WebGL과 WebGPU 백엔드에 맞게 셰이더를 변환할 수 있도록 하는 노드·JavaScript 스타일 셰이더 추상화다. Three.js의 WebGPU 흐름에서 장기적으로 중요한 위치를 차지하고 있다. ([Three.js](https://threejs.org/docs/pages/WebGPURenderer.html?utm_source=chatgpt.com "WebGPURenderer – three.js docs"))

## 리스크

- 셰이더 오류는 브라우저·GPU별로 다르게 나타남
    
- 정밀도 차이
    
- 텍스처 샘플 수
    
- Overdraw
    
- 모바일의 낮은 fragment 처리량
    
- WebGL GLSL 코드를 WebGPU에 그대로 이전할 수 없음
    

## 추천

2026년 신규 Three.js 프로젝트에서 장기간 유지할 셰이더라면 다음을 검토할 가치가 있다.

```text
TSL
→ WebGPU backend
→ WebGL2 fallback
```

다만 기존 GLSL 레퍼런스와 전문 인력은 여전히 훨씬 많다.

---

# 12. 물리 엔진

## Rapier

Rust 기반 물리 엔진이며 WebAssembly로 웹에서 사용할 수 있다.

### 적합

- 충돌
    
- 중력
    
- 캐릭터
    
- 강체
    
- 인터랙티브 오브젝트
    

### 장점

R3F 생태계와 연결이 좋다.

### 리스크

- 물리 루프와 렌더 루프 동기화
    
- 모바일 CPU 비용
    
- 오브젝트 수 증가
    
- 실제 물리보다 연출용 키프레임이 더 적합한 경우가 많음
    

## Cannon-es

간단하고 접근성이 좋지만 대규모·복잡한 물리에서는 Rapier가 선호되는 편이다.

## 추천 원칙

브랜드 사이트에서는 실제 물리보다 **가짜 물리**가 나을 때가 많다.

```text
실제 충돌 계산
```

보다

```text
Spring + Damping + Noise
```

로 유사한 감각을 만드는 것이 더 가볍고 연출 통제가 쉽다.

---

# 13. 오디오

몰입형 사이트에서 오디오는 강력하지만 가장 민감한 영역이다.

## Web Audio API

### 가능 기능

- 공간 오디오
    
- 스크롤 반응 음향
    
- 주파수 분석
    
- 비트 반응 비주얼
    
- 오디오 필터
    
- 사운드 레이어 믹싱
    

## Howler.js

재생·볼륨·포맷 호환성을 단순화한다.

## 리스크

- 브라우저 자동재생 제한
    
- 사용자의 명시적 입력 필요
    
- 접근성
    
- 업무 환경에서 소리 재생에 대한 거부감
    
- 모바일 배터리
    
- 배경 탭 처리
    
- 영상과 오디오 동기화
    

## 추천 UX

```text
Sound Off by Default
→ 명확한 Sound On 버튼
→ 설정 기억
→ 영상 자막 또는 시각적 대체
```

---

# 14. CMS

Immersive Website에 CMS를 연결하면 구조가 복잡해진다.

## 후보

- Sanity
    
- Contentful
    
- Storyblok
    
- Strapi
    
- Payload
    
- Directus
    

## CMS로 관리하기 좋은 것

- 제목
    
- 본문
    
- 이미지
    
- 영상 URL
    
- 섹션 순서
    
- 프로젝트 메타데이터
    
- 다국어 콘텐츠
    

## CMS로 관리하면 위험한 것

- 카메라 좌표
    
- 셰이더 파라미터
    
- 복잡한 타임라인
    
- 3D 장면 계층
    
- 물리 설정
    
- 프레임 단위 연출
    

### 권장 구조

```text
CMS
= 콘텐츠와 시나리오 데이터

Code / 3D Tool
= 시각 연출과 렌더링
```

CMS 편집자가 3D 좌표를 직접 수정하게 만들면 시스템이 금방 깨진다.

---

# 15. 배포와 인프라

## Vercel

### 장점

- Next.js 연결
    
- Preview Deployment
    
- Edge
    
- 이미지 최적화
    
- 팀 협업
    

### 단점

- 대용량 3D·영상 전송 비용
    
- 플랫폼 기능 의존
    
- 복잡한 캐시 정책
    

---

## Cloudflare

### 장점

- CDN
    
- R2 Object Storage
    
- Workers
    
- 대용량 에셋 전달
    
- 글로벌 캐싱
    

### 추천

3D와 영상 에셋은 앱 서버와 분리해 Object Storage + CDN으로 제공하는 것이 좋다.

---

## Netlify

Astro·정적 브랜드 사이트에 적합하다.

---

## 추천 인프라 구조

```text
Application
→ Vercel / Cloudflare Pages

3D Models, Textures, Video
→ R2 / S3
→ CDN

CMS
→ Sanity / Contentful / Payload

Monitoring
→ Sentry

Analytics
→ Plausible / PostHog / GA4
```

---

# 16. 성능 관리

Immersive Website는 Lighthouse 점수만으로 평가할 수 없다.

## 필수 측정 항목

### 웹 지표

- LCP
    
- INP
    
- CLS
    
- TTFB
    
- JS Bundle Size
    

### GPU 지표

- FPS
    
- Frame Time
    
- Draw Calls
    
- Triangles
    
- Texture Memory
    
- Shader Compile Time
    
- GPU Tier
    
- Context Loss
    

### UX 지표

- 첫 인터랙션까지 시간
    
- 3D 장면 표시까지 시간
    
- 스크롤 끊김
    
- 모바일 발열
    
- 배터리 소모
    
- 이탈률
    

---

## 일반적인 목표값

절대 기준은 아니지만 브랜드 웹에서 현실적인 출발점은 다음과 같다.

```text
Initial HTML/CSS/JS
가능하면 500KB 이하 압축

Initial 3D Asset
1~3MB 수준 권장

전체 3D·Texture
5~10MB 이내 권장

초기 영상
모바일 3~6MB 내외 권장

Draw Calls
모바일 50~100 이하 목표

프레임
Desktop 60fps
Mobile 최소 30fps 안정 유지
```

고급 PC에서 60fps가 나오는 것은 의미가 적다. 중급 안드로이드와 iPhone Safari에서 실제 테스트해야 한다.

---

# 17. Adaptive Quality가 최신 핵심 트렌드다

최근의 좋은 Immersive Website는 모든 사용자에게 같은 장면을 강제하지 않는다.

## 장치별 분기

```text
High Tier
- WebGPU
- Full particles
- Post-processing
- High-resolution texture
- Real-time shadow

Mid Tier
- WebGL2
- Reduced particles
- Limited post-processing
- Baked lighting

Low Tier
- Simplified geometry
- No shadow
- No fluid simulation
- Video or static fallback
```

## 감지 요소

- 화면 크기
    
- devicePixelRatio
    
- 메모리
    
- GPU tier
    
- `prefers-reduced-motion`
    
- 네트워크 속도
    
- 배터리 상태
    
- 터치 기기
    
- WebGPU 지원 여부
    

## 가장 흔한 실수

```js
renderer.setPixelRatio(window.devicePixelRatio)
```

를 무조건 사용하는 것이다.

고해상도 스마트폰에서 DPR 3을 그대로 사용하면 픽셀 수가 DPR 1 대비 약 9배가 된다. 보통 다음처럼 상한을 둔다.

```js
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5))
```

---

# 18. 접근성과 SEO

몰입형 사이트라도 핵심 콘텐츠를 Canvas 안에 넣어서는 안 된다.

## 기본 원칙

- 제목과 본문은 실제 HTML
    
- Canvas는 시각적 레이어
    
- 키보드 탐색
    
- `prefers-reduced-motion`
    
- 스크린리더 대체 설명
    
- 영상 자막
    
- Sound Off 기본
    
- Skip Animation
    
- Skip Intro
    
- 포커스 표시
    
- 충분한 대비
    

## 권장 구조

```html
<main>
  <h1>실제 브랜드 메시지</h1>
  <p>실제 설명</p>

  <canvas aria-hidden="true"></canvas>
</main>
```

3D 키비주얼이 로딩되지 않아도 사용자가 브랜드 메시지를 읽고 이동할 수 있어야 한다.

---

# 19. 2026년 주요 트렌드

## 트렌드 1. WebGPU-first, 그러나 WebGL fallback

WebGPU가 본격적인 프로덕션 선택지로 올라왔지만, 실무에서는 여전히 폴백을 포함한 점진적 도입이 합리적이다. Three.js·Babylon.js·PlayCanvas 모두 WebGPU 경로를 강화하고 있다. ([Three.js](https://threejs.org/docs/pages/WebGPURenderer.html?utm_source=chatgpt.com "WebGPURenderer – three.js docs"))

---

## 트렌드 2. DOM과 WebGL의 혼합

예전:

```text
전체 화면 Canvas
```

현재:

```text
Semantic DOM
+ CSS Typography
+ WebGL Visual Layer
+ SVG Interface
```

텍스트까지 Canvas에 그리지 않고, 각 기술이 잘하는 부분을 나눈다.

---

## 트렌드 3. 장면보다 시스템

단일한 3D 오브젝트보다 다음과 같은 규칙 기반 비주얼이 증가하고 있다.

- Noise Field
    
- Particle Network
    
- Generative Geometry
    
- Cursor Force
    
- Audio Reactive System
    
- Procedural Layout
    
- Data-driven Motion
    

즉, 완성된 영상을 재생하는 것이 아니라 **브랜드 규칙을 실시간으로 실행**한다.

---

## 트렌드 4. Shader를 이용한 2.5D

무거운 3D 모델보다 다음 조합이 많다.

```text
Flat Geometry
+ Texture
+ Displacement
+ Refraction
+ Post-processing
```

이 방식은 적은 Geometry로도 공간감이 크다.

---

## 트렌드 5. Scroll에서 Direct Manipulation으로

스크롤만 따라가는 사이트를 넘어 다음이 중요해지고 있다.

- Drag
    
- Cursor Force
    
- Object Rotation
    
- Spatial Navigation
    
- Hover Depth
    
- Touch Gesture
    
- Device Orientation
    

사용자가 단순 관람자가 아니라 장면에 개입한다.

---

## 트렌드 6. Gaussian Splatting

사진이나 현실 공간을 포인트 기반으로 재구성해 웹에서 탐색하는 방식이다.

WebGPU 기반 Gaussian Splatting과 실시간 신경 렌더링 연구·플랫폼이 계속 발전하고 있다. 다만 파일 크기, 정렬 연산, 모바일 메모리, 편집성 때문에 일반 브랜드 사이트의 기본 기술이라기보다는 특정 경험에 적합하다. ([arXiv](https://arxiv.org/abs/2512.08478?utm_source=chatgpt.com "Visionary: The World Model Carrier Built on WebGPU-Powered Gaussian Splatting Platform"))

### 적합

- 실제 장소
    
- 전시
    
- 건축
    
- 패션 촬영 공간
    
- 디지털 아카이브
    

### 부적합

- 정밀한 제품 형상
    
- 작은 초기 다운로드가 필수
    
- 저사양 모바일 타깃
    
- 객체별 편집이 필요한 장면
    

---

## 트렌드 7. AI 제작 + 수동 엔지니어링

AI는 다음 영역에서 유용하다.

- 셰이더 초안
    
- Three.js 프로토타입
    
- glTF 최적화 스크립트
    
- 카메라 경로
    
- 파티클 시스템
    
- 테스트 케이스
    
- 반응형 폴백
    
- Blender Python
    

그러나 AI가 만든 코드는 흔히 다음 문제가 있다.

- 매 프레임 객체 생성
    
- dispose 누락
    
- 이벤트 리스너 누수
    
- 비효율적인 state 업데이트
    
- 모바일 고려 없음
    
- 같은 렌더 루프 중복 실행
    
- 의미 없는 포스트프로세싱 남발
    

따라서 AI는 제작 속도를 크게 올리지만, **GPU 프로파일링과 실제 기기 검증을 대체하지 못한다.**

---

# 20. 대표 조합별 평가

## 조합 A. 현재 가장 범용적인 프리미엄 스택

```text
Next.js
+ TypeScript
+ React Three Fiber
+ Drei
+ GSAP ScrollTrigger
+ Lenis
+ Zustand
+ Blender
+ glTF / Meshopt / KTX2
+ Vercel
```

### 적합

- 브랜드 사이트
    
- 제품 쇼케이스
    
- 스크롤 카메라 연출
    
- CMS·다국어·운영 필요
    

### 장점

- 개발 생태계가 큼
    
- AI 코딩 도구와 궁합이 좋음
    
- 재사용과 확장이 쉬움
    
- UI와 3D 상태 연결이 편리
    
- 인력 확보가 상대적으로 쉬움
    

### 리스크

- React + R3F + GSAP + Lenis의 라이프사이클 충돌
    
- 번들 증가
    
- 불필요한 hydration
    
- 작은 사이트에 과설계
    
- 라이브러리별 렌더 루프 중복
    

### 추천 근거

현시점에서 **개발 지속성·자료·채용·확장성·표현력의 균형**이 가장 좋다.

---

## 조합 B. 성능 중심 브랜드·에디토리얼

```text
Astro
+ React Island
+ React Three Fiber 또는 Three.js
+ GSAP
+ Native Scroll 또는 약한 Lenis
+ Headless CMS
+ Cloudflare
```

### 적합

- 콘텐츠가 많은 브랜드 사이트
    
- 특정 섹션만 3D
    
- SEO·초기 로드가 중요
    

### 장점

- 정적 HTML 비중이 큼
    
- JS를 선택적으로 로딩
    
- 3D 영역을 격리
    
- 성능 예산 관리가 쉬움
    

### 리스크

- 앱 전체의 연속적인 상태 유지가 까다로움
    
- 페이지 전환을 하나의 월드처럼 만들기 어려움
    
- React와 Astro 두 구조를 함께 이해해야 함
    

### 추천 근거

대부분의 브랜드 웹은 전체 화면 3D 앱이 아니다. 이 경우 Astro의 Islands 구조가 과도한 클라이언트 JavaScript를 줄이는 데 유리하다. ([Astro Docs](https://docs.astro.build/en/concepts/islands/?utm_source=chatgpt.com "Islands architecture - Astro Docs"))

---

## 조합 C. Creative Developer 중심 단기 캠페인

```text
Vite
+ TypeScript
+ Three.js
+ GLSL 또는 TSL
+ GSAP
+ Lenis
+ Blender
+ Cloudflare Pages
```

### 적합

- 한 장짜리 캠페인
    
- 아트 디렉션 최우선
    
- 추상 셰이더
    
- 짧은 운영 기간
    

### 장점

- 제어권 최대
    
- 구조가 단순
    
- React 오버헤드 없음
    
- 독창적인 결과 가능
    

### 리스크

- 개발자 개인 의존
    
- 유지보수 어려움
    
- UI가 복잡해지면 코드가 난잡
    
- 에디터와 CMS 연결이 약함
    

### 추천 근거

“사이트”보다 “인터랙티브 작품”에 가까운 프로젝트라면 가장 직접적이다.

---

## 조합 D. 디자이너 중심 빠른 제작

```text
Framer 또는 Webflow
+ Spline
+ GSAP 일부
+ Rive
```

### 적합

- 빠른 런칭
    
- 이벤트 페이지
    
- 개념 검증
    
- 제한된 예산
    
- 개발자 부족
    

### 장점

- 시각 제작 속도
    
- 디자이너 직접 수정
    
- 프로토타입과 결과물 간 거리가 짧음
    
- 간단한 3D 히어로에 충분
    

### 리스크

- 런타임이 여러 겹
    
- 세밀한 최적화 어려움
    
- 플랫폼 종속
    
- 복잡한 스크롤 동기화
    
- Spline 장면과 사이트 상태 연결 한계
    
- 예상보다 무거운 결과
    

### 추천 근거

하이엔드 결과물의 최종 스택보다는 **빠른 POC·중간 규모 브랜드 랜딩**에 강하다.

---

## 조합 E. 게임·가상 공간형

```text
Babylon.js 또는 PlayCanvas
+ WebGPU / WebGL
+ Rapier 또는 엔진 물리
+ WebXR
+ Blender
+ Asset CDN
```

### 적합

- 가상 쇼룸
    
- 게임형 브랜드 체험
    
- 캐릭터 이동
    
- XR
    
- 다수의 상호작용 객체
    

### 장점

- 엔진 기능이 풍부
    
- 장면·물리·애니메이션 관리
    
- XR 확장
    
- 대규모 인터랙션에 적합
    

### 리스크

- 일반 웹사이트 구조와 괴리
    
- SEO와 접근성 별도 구현
    
- 초기 로딩
    
- 개발 난도
    
- 엔진 종속
    

### 추천 근거

사용자가 “페이지를 보는 것”이 아니라 “공간을 플레이하는 것”이라면 Three.js 기반 사이트보다 엔진형 접근이 낫다.

---

## 조합 F. 미래지향 Generative WebGPU

```text
Next.js 또는 Vite
+ Three.js WebGPURenderer
+ TSL
+ Compute Shader
+ GSAP
+ WebGL2 fallback
```

### 적합

- 대규모 파티클
    
- 실시간 Fluid
    
- 생성형 구조
    
- GPU 기반 데이터 시각화
    
- 기술적 실험성이 높은 브랜드
    

### 장점

- 현대 GPU 기능
    
- 대규모 연산
    
- WebGL로 어려운 표현
    
- 향후 확장성
    

### 리스크

- 디버깅과 전문 인력
    
- 브라우저·GPU 차이
    
- WebGL 플러그인 호환
    
- 프로젝트 비용 증가
    
- 디자인 수정도 엔지니어링 작업이 됨
    

### 추천 근거

표현 자체가 GPU Compute를 요구할 때만 추천한다. “WebGPU를 썼다”는 사실은 사용자 가치가 아니다.

---

# 21. 조합에서 가장 많이 발생하는 충돌

## GSAP + Motion

같은 DOM 속성을 둘이 제어하면 값이 덮어써진다.

### 해결

```text
GSAP
→ Scroll·Camera·Long Timeline

Motion
→ Component Enter·Exit·Hover
```

역할을 명확히 분리한다.

---

## Lenis + ScrollTrigger

두 시스템의 업데이트 타이밍이 다르면 스크롤 위치가 흔들린다.

### 해결

- 하나의 requestAnimationFrame 루프 사용
    
- Lenis 업데이트 후 ScrollTrigger 업데이트
    
- resize 시 refresh
    
- 모바일에서는 Lenis 비활성 또는 완화
    

---

## React State + useFrame

`useFrame()` 안에서 매 프레임 `setState()`를 호출하면 React 렌더를 계속 유발한다.

### 해결

- ref 직접 변경
    
- Zustand transient state
    
- shader uniform 직접 업데이트
    
- React state는 이벤트 단위로만 변경
    

---

## SSR + WebGL

서버에는 `window`, `document`, WebGL context가 없다.

### 해결

- Canvas 컴포넌트 클라이언트 전용
    
- dynamic import
    
- hydration 후 초기화
    
- 서버 콘텐츠와 GPU 장면 분리
    

---

## WebGPU + 기존 Post-processing

일부 WebGL 전용 효과가 WebGPU Renderer에서 그대로 동작하지 않을 수 있다.

### 해결

- 도입 전 기능별 호환성 검증
    
- 핵심 효과만 자체 구현
    
- WebGL 경로 유지
    
- 백엔드에 따라 효과 축소
    

---

## Spline + GSAP

Spline 내부 애니메이션과 외부 GSAP이 같은 객체를 제어하면 타이밍 충돌이 생긴다.

### 해결

- Spline은 장면과 기본 인터랙션
    
- GSAP은 외부 DOM
    
- 3D 객체 제어가 중요하면 Spline Code API를 중심으로 단일 제어권 설정
    

---

# 22. 추천 아키텍처

Jake가 관심을 보였던 **형이상학적 브랜드 비주얼·기하학·스크롤 내러티브**를 기준으로 보면 다음 조합이 가장 적절하다.

## 추천 1안 — 균형형

```text
Next.js
├─ Semantic DOM / Typography
├─ React Three Fiber
│  ├─ Drei
│  ├─ Custom Shader
│  ├─ Post-processing 최소 사용
│  └─ Zustand
├─ GSAP
│  ├─ Main Timeline
│  └─ ScrollTrigger
├─ Lenis
│  └─ Desktop 중심, Mobile 완화
├─ Blender
│  ├─ Geometry Nodes
│  └─ GLB Export
├─ glTF Transform
│  ├─ Meshopt
│  └─ KTX2
└─ Vercel + R2
```

### 추천 이유

- 기하학·추상 구조를 Blender Geometry Nodes로 생성
    
- R3F에서 셰이더와 인터랙션 추가
    
- GSAP으로 카메라와 DOM을 하나의 스토리로 연결
    
- DOM을 유지해 타이포그래피 품질과 SEO 확보
    
- 향후 다른 페이지와 CMS로 확장 가능
    
- AI 코딩 에이전트가 비교적 안정적으로 다룰 수 있음
    

### 핵심 리스크

기술이 많아지면서 “누가 시간을 지배하는가”가 모호해진다.

따라서 다음 원칙이 필요하다.

```text
GSAP = 시간
R3F = 공간
React = 상태와 UI
Lenis = 스크롤 입력
Blender = 형상
```

---

## 추천 2안 — 가볍고 날카로운 스택

```text
Astro
+ Three.js
+ GSAP
+ Native Scroll
+ Blender
+ KTX2 / Meshopt
```

### 추천 상황

- 1~3페이지
    
- 로그인 없음
    
- CMS가 단순함
    
- 특정 히어로와 2~3개 챕터가 핵심
    
- 최적화와 아트 디렉션을 우선
    

### 장점

React와 R3F를 제거하여 구조와 런타임을 줄일 수 있다.

### 단점

코드 재사용과 장면 상태 관리가 개발자 역량에 더 크게 의존한다.

---

## 추천 3안 — 디자인 POC

```text
Framer
+ Spline
+ Rive
```

### 추천 상황

- 아이디어를 먼저 눈으로 검증
    
- 개발 전에 연출 테스트
    
- 클라이언트 프레젠테이션
    
- 일주일 내 POC
    

### 운영 방식

1. Spline으로 3D 장면을 만든다.
    
2. Framer에서 타이포와 페이지 구조를 만든다.
    
3. 반응을 확인한다.
    
4. 핵심 장면이 검증되면 Three.js/R3F로 재구축한다.
    

이 방식이 Spline을 최종 엔진으로 무리하게 확장하는 것보다 안전하다.

---

# 23. 하지 말아야 할 조합

## 1. Next.js + R3F + GSAP + Motion + Lenis + Theatre.js + Spline

각각 좋은 도구지만 한 프로젝트에 모두 넣으면 제어권이 겹친다.

```text
누가 카메라를 움직이는가?
누가 스크롤을 정의하는가?
누가 전환 시간을 관리하는가?
누가 3D 객체 상태를 소유하는가?
```

답이 여러 개가 된다.

---

## 2. 전체 페이지를 Canvas로 제작

- SEO 악화
    
- 접근성 악화
    
- 텍스트 품질 저하
    
- 반응형 어려움
    
- 입력·복사·링크 기능 재구현
    
- 유지보수 어려움
    

---

## 3. 4K 텍스처와 실시간 그림자 남발

시각적 차이는 작지만 VRAM과 대역폭은 크게 증가한다.

---

## 4. 모바일을 데스크톱의 축소판으로 처리

모바일에서는 다른 장면이 필요할 수도 있다.

```text
Desktop: Interactive 3D
Mobile: Reduced 3D
Low-end: Video
Reduced Motion: Static Image
```

---

## 5. 모든 애니메이션을 스크롤에 묶기

사용자는 스크롤을 콘텐츠 탐색에 사용한다. 모든 물체가 매 순간 반응하면 오히려 피로하고 정보 위계가 사라진다.

---

# 24. 최종 추천 등급

## S Tier — 실무 균형형

```text
Next.js
+ React Three Fiber
+ GSAP
+ Blender
+ glTF Optimization
```

가장 확장 가능하고, 복잡한 브랜드 경험을 구축하기 좋다.

---

## S Tier — 콘텐츠·성능형

```text
Astro
+ Three.js 또는 R3F Island
+ GSAP
```

3D가 사이트의 일부라면 오히려 이 조합이 더 합리적이다.

---

## A Tier — Creative Coding형

```text
Vite
+ Three.js
+ GLSL/TSL
+ GSAP
```

결과의 독창성은 가장 높을 수 있지만 전문 개발자 의존도가 크다.

---

## A Tier — 게임·공간형

```text
Babylon.js 또는 PlayCanvas
+ WebGPU/WebGL
```

사이트보다 3D 애플리케이션에 가까운 경우 적합하다.

---

## B Tier — 빠른 디자인 제작형

```text
Framer/Webflow
+ Spline
```

POC와 중간 규모 랜딩에는 강하지만 복잡한 장기 운영 프로젝트에서는 한계가 나타난다.

---

# 결론

2026년 Immersive Website의 가장 강한 흐름은 단순히 **“WebGPU와 3D를 많이 쓰는 것”**이 아니다.

핵심 조합은 다음과 같다.

```text
Semantic HTML
+ GPU Visual Layer
+ Scroll/Timeline Orchestration
+ Compressed 3D Assets
+ Adaptive Quality
+ Device-specific Fallback
```

Jake의 형이상학적 브랜딩 비주얼 기준으로 가장 추천하는 스택은:

```text
Next.js
+ React Three Fiber
+ GSAP
+ 약한 Lenis
+ Blender Geometry Nodes
+ Custom Shader
+ Meshopt / KTX2
+ WebGPU Preferred
+ WebGL2 / Video Fallback
```

다만 사이트가 단발성 브랜드 캠페인이고 로그인·CMS·복잡한 UI가 없다면 더 날카로운 선택은:

```text
Astro 또는 Vite
+ Three.js
+ GSAP
+ Blender
```

이다.

즉 **Next.js + R3F가 무조건 최신이라서 정답인 것이 아니라**, 운영형 사이트에는 Next.js/R3F, 한 편의 인터랙티브 작품에는 Astro·Vite/Three.js가 더 정확한 선택이다.





참고 서비스
https://www.originkit.dev
https://www.unicorn.studio
https://www.getlayers.ai/?tab=favourites#projects
