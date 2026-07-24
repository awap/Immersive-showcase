# Session Report — Immersive Atlas 제작 기록

> 2026-07-23 · 단일 프롬프트 → 완료까지의 하네스 구조, 에이전트 구성, 워크플로우, 실측 스탯.
> 산출물: [site/](site/) — "Immersive Atlas — 몰입형 웹 기술 표본실 2026"

---

## 1. 개요

| 항목 | 내용 |
|---|---|
| 입력 | 사용자 프롬프트 1회 (`Immersive Website 기술 스택 총정리, 2026.md` 기반 학습 쇼케이스 제작 요청) |
| 출력 | 검증 완료된 원페이지 쇼케이스 사이트 (챕터 15 · 라이브 데모 9종 · 레퍼런스 16곳) |
| 소요 | **38분 49초** (17:28:32 → 18:07:21 KST, 중간 개입 없음) |
| 모델 | Claude Fable 5 (Claude Code 하네스) |

---

## 2. 하네스 스트럭처

메인 에이전트 1개가 오케스트레이터 역할을 하고, 리서치는 백그라운드 서브에이전트로 분리한 구조.

```
Claude Code (메인 루프 · Fable 5)
├─ Skill: frontend-design            ← 디자인 방법론 주입 (계획→자기비평→구현)
├─ Agent: general-purpose ×1         ← 디자인 리서치 서브에이전트 (백그라운드 병렬)
│   └─ WebSearch / WebFetch          ← 14개 카테고리 레퍼런스 조사
├─ File tools: Write / Edit / Read   ← 코드 생성 (Write 21 · Edit 22 · Read 3)
├─ Bash                              ← 스캐폴딩 · tsc · vite build (9회)
├─ Browser pane (MCP)                ← 검증 루프 (51회)
│   ├─ preview_start                 ← .claude/launch.json 기반 dev 서버 "atlas"
│   ├─ screenshot / navigate         ← 시각 검증
│   ├─ javascript_tool               ← DOM 계측 · WebGL readPixels 픽셀 판독
│   ├─ read_console_messages         ← 에러 스윕
│   └─ resize_window                 ← 모바일(375px) 반응형 검증
└─ Memory (파일 기반)                ← 프로젝트·사용자 컨텍스트 영속화
```

**에이전트 수: 총 2** — 메인 1 + 리서치 서브에이전트 1.
서브에이전트는 본작업과 **병렬** 실행되어 벽시계 시간에 추가 부담 없음 (3분 36초 만에 완료, 결과는 표본 14 "References" 섹션에 흡수).

---

## 3. 워크플로우 / 파이프라인

```
[0:00] 문서 분석 ─ 원전 md 2,722줄 정독 → 스택 결정 (문서의 "조합 C")
   │
[0:02] 분기 ──┬─ (병렬) 리서치 서브에이전트 발사: 14개 카테고리 레퍼런스 조사
   │          └─ (메인) frontend-design 스킬 로드 → 디자인 시스템 확정
   │               · 콘셉트 "계측 저널" · Instrument Serif + Pretendard + IBM Plex Mono
   │               · 옵시디언 블루 + 아이리스/앰버 · 시그니처 = Device Tier HUD
   │
[0:05] 스캐폴딩 ─ Vite vanilla-ts + three/gsap/lenis 설치
   │
[0:07] 리서치 합류 ← 서브에이전트 결과 도착 (Igloo Inc, Lusion, Codrops, Lenis 쇼케이스…)
   │
[0:08] 구현 ─ index.html (시맨틱 DOM 전체, 레퍼런스 섹션에 리서치 반영)
   │        → style.css (디자인 시스템) → lib 2종 → 데모 모듈 9종 → main.ts 배선
   │
[0:20] 게이트 1 ─ tsc 타입 에러 1건 수정 → 프로덕션 빌드 통과 (gzip 188KB)
   │
[0:22] 검증 루프 ─ dev 서버 기동 → 섹션별 스크린샷 순회
   │     ├─ 발견: HUD가 히어로 문구·스크롤 자막 가림 → CSS 수정
   │     ├─ 발견: 파티클 캔버스 무렌더 → 가설 분리 실험
   │     │    · 콘솔 에러 없음 → 디버그 훅 주입 → readPixels 픽셀 판독
   │     │    · 셰이더 무죄 입증 (4096/4096 점등) → 진범 = 숨김 탭 로드 시 0-폭 초기화
   │     └─ 수정: window resize 의존 → ResizeObserver 자가복구 (onResize 헬퍼, 전 데모 적용)
   │
[0:34] 게이트 2 ─ 재빌드 통과 · DOM 계측 일괄 검증 (타이포 분할 68자, SVG dash,
   │              Canvas2D 페인팅, 레일 15, 레퍼런스 16) · 모바일 오버플로 0 확인
   │
[0:37] 마무리 ─ README 작성 · 메모리 저장 (프로젝트/사용자) · 완료 보고
[0:39] 완료
```

핵심 패턴 세 가지.

1. **병렬 분업** — 리서치(외부 조사)와 구현(내부 제작)을 동시 진행, 합류 시점에 결과 병합.
2. **게이트 검증** — 타입체크·빌드를 통과해야 다음 단계로. "된 것 같다"가 아니라 측정으로 전진.
3. **가설 분리 디버깅** — 화면이 안 보이는 환경에서 스크린샷 대신 readPixels로 GPU 출력을 직접 판독, 셰이더/지오메트리/사이즈 가설을 하나씩 배제.

---

## 4. 실측 스탯

### 시간

| 지표 | 값 |
|---|---|
| 프롬프트 입력 | 2026-07-23 17:28:32 KST |
| 완료 보고 | 2026-07-23 18:07:21 KST |
| 총 소요 | **38분 49초** |
| 서브에이전트 소요 | 3분 36초 (병렬 — 벽시계 미가산) |

### 토큰 (세션 로그 실측 · API 호출 95회 중복 제거)

| 항목 | 값 | 의미 |
|---|---|---|
| Output | **137,290** | 생성된 코드·사고·응답 |
| Cache write | 238,898 | 신규 컨텍스트 적재 (문서·코드·스크린샷) |
| Cache read | 19,509,339 | 호출마다 재참조된 누적 컨텍스트 (캐시 단가 적용 구간) |
| 서브에이전트 | +59,950 | 리서치 (도구 호출 20회 별도) |
| **실질 과금 몸통** | output 13.7만 + cache write 23.9만 | cache read는 통상 1/10 단가 |

### 작업량

| 지표 | 값 |
|---|---|
| 도구 호출 (메인) | **110회** — Write 21 · Edit 22 · 브라우저 검증 51 · Bash 9 · Read 3 · 기타 4 |
| 도구 호출 (서브) | 20회 |
| 산출 파일 | 14개 (HTML 1 · CSS 1 · TS 12) + README + launch.json |
| 산출 코드 | **2,971줄** |
| 번들 | JS gzip 188KB (원전 문서 예산 500KB의 38%) · CSS 4.1KB · HTML 15.8KB |

### 성과 (정성)

| 지표 | 값 |
|---|---|
| 콘텐츠 | 챕터 15 · 라이브 데모 9종 · 심층 카드 4챕터 · 레퍼런스 16곳 |
| 검증 | tsc·빌드 통과, 시각 검증 3종, GPU 픽셀 판독 1종, DOM 계측 일괄, 모바일 오버플로 0 |
| 발견·수정 버그 | 1건 (숨김 탭 0-사이즈 캔버스 초기화 → ResizeObserver 자가복구) |
| 접근성 실증 | 캔버스 전부 `aria-hidden` · 분할 텍스트 `aria-label` 보존 · reduced-motion 폴백 · Sound Off 기본 |

---

## 5. 재현을 위한 메모

- dev 서버: `npm --prefix site run dev` (launch.json 이름 `atlas`, 포트 5183)
- 데모 리사이즈는 반드시 `src/lib/stage.ts`의 `onResize`(ResizeObserver) 경유 — window resize 단독 의존 금지
- 소유권 원칙: **GSAP=시간 · Three.js=공간 · Lenis=스크롤 입력** — 같은 값을 두 도구가 만지지 않는다
