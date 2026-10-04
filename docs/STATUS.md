# 구현 진행 기록
## 현재 상태
- 요청: REQ-001~REQ-007
  - REQ-005: 구현 완료 · 검토 대기 (PR #5) → [REQ-005 기록](#req-005-기록)
  - REQ-007: 구현 완료 · 검토 대기 (PR #6, PR #5 위에 쌓음) → [REQ-007 기록](#req-007-기록)
- 상태
  - REQ-001: **main 병합 완료** (PR #1, merge commit `0b7bb37`)
  - REQ-002·REQ-003: **main 병합 완료** (PR #2, merge commit `434251e`) → [REQ-002·003 기록](#req-002--req-003-기록)
  - PR #2 검토(docs/REVIEW-PR-002.md) R1·R2: 재검토에서 종료 → [검토 대응](#pr-2-검토-대응-docsreview-pr-002md)
  - REQ-004: **main 병합 완료** (PR #3, `cfebf4d`) → [REQ-004 기록](#req-004-기록)
  - REQ-006: **main 병합 완료** (PR #4, `70ffce0`, R1·R2 포함) → [REQ-006 기록](#req-006-기록)
  - PR #3·#4 검토(docs/REVIEW-PR-003-004.md) R1·R2: 재검토에서 종료 → [검토 대응](#pr-4-검토-대응-docsreview-pr-003-004md-r1r2)
- 기획: docs/PLAN.md, docs/REQUESTS.md
- 구현/빌드/브라우저 검증: 완료 (로컬, 브라우저 에뮬레이션)
- 실제 작업물, 소개, 연락처, 최종 헤드라인: 미확정 (샘플로 표시). 히어로 배경 영상은 사용자 제공 4Ground9 영상(REQ-005)

## Claude Code 기록 양식 (REQ-001)
작업 후 실제 결과로 갱신한다. 비밀키나 비공개 개인정보를 기록하지 않는다.
- 작업 날짜: 2026-10-04
- 요청 ID: REQ-001
- 브랜치 / 커밋 / PR: 아래 [브랜치 · 커밋 · PR](#브랜치--커밋--pr)
- 구현 기능: 아래 [구현 기능](#구현-기능)
- 주요 변경 파일: 아래 [주요 변경 파일](#주요-변경-파일)
- 실행 및 빌드 명령: 아래 [실행 · 빌드](#실행--빌드)
- 검증 항목과 결과: 아래 [검증 결과](#검증-결과)
- 화면 너비 / 브라우저 / 실제 기기 여부: 14개 너비 · Chromium/Firefox/WebKit · **실제 기기 미확인 (에뮬레이션만)**
- 미검증 항목 및 사유: 아래 [미검증 항목](#미검증-항목)
- 가정한 사항: 아래 [가정한 사항](#가정한-사항)
- 남은 문제 / 기획 질문: 아래 [남은 문제 · 기획 질문](#남은-문제--기획-질문)
- 다음 작업: 아래 [다음 작업](#다음-작업)

---

## 브랜치 · 커밋 · PR
- 브랜치: `feature/req-001-portfolio-base` (기준: `main` 01ffbd9)
- 커밋
  - `64d445f` docs: 전달 문서(PLAN, REQUESTS, STATUS) 원본 그대로 추가
  - `ef9d890` feat: REQ-001 반응형 포트폴리오 기본 틀 구현
  - 이 STATUS.md 기록 커밋 (PR #1에 포함)
- PR: https://github.com/OdysseyHW/hwhwang-portfolio/pull/1 (main 병합 전, 검토 대기)
- main 직접 병합·강제 푸시·외부 배포: 하지 않음

## 구현 기능
- **기술:** 기존 구현이 없어 PLAN 기본값대로 Astro 7.3 + TypeScript, CSS 변수, 정적 빌드(`dist/`). UI 라이브러리·외부 폰트 없음.
- **페이지:** `/` 메인, `/projects/[slug]/` 상세(공통 템플릿), 404.
- **메인:** 헤더(텍스트 로고 + Works/About/Contact) → 직무·짧은 소개·작업물 보기 → 대표 프로젝트 3개 → About(소개·전문 분야·사용 도구·경력) → Contact → 푸터. 상세 페이지의 메뉴도 메인 해당 영역으로 이동.
- **카드:** 썸네일, 제목, 유형, 플랫폼, 담당 분야를 호버 없이 표시. 제목 링크를 카드 전체로 확장해 중첩 링크 없이 카드 전체를 클릭할 수 있음. 썸네일 비율 16:10 고정, 이미지별 `coverPosition`으로 자르기 중심 지정.
- **상세 템플릿:** PLAN의 1~9 순서. 값이 없는 개요 항목과 빈 섹션은 제목까지 숨김. 이미지는 `layout: full`(전체 화면) / `detail`(세부, 2열)로 나눠 배치하고 제목·캡션 지원. 이전·다음·전체 목록 이동.
- **확대 뷰어:** `<dialog>` 기반. 화면 맞춤, 원본 크기(100%), 확대·축소 버튼, 마우스 휠, 드래그 이동, 터치 핀치·이동, 더블클릭·더블탭, 키보드(+ − 0 1 방향키 Esc), 원본 열기 링크. 내부 Tab 순환, 배경 스크롤 잠금, 닫은 뒤 초점·스크롤 위치 복원. 일반 페이지의 브라우저 확대는 막지 않음.
- **반응형:** 모바일 우선. 프로젝트 목록은 320~599px 1열, 600~1199px 2열(카드 최소 폭 16rem이 안 되면 1열 유지), 1200px 이상 3열, 최대 폭 1280px 중앙 정렬. 약 640px 미만에서 메뉴 버튼으로 전환(`aria-expanded`, 닫기, Esc, 바깥 클릭, 초점 이동·복원). 제목·여백은 `clamp()`, 읽기 폭 65ch, 긴 한글·영문·URL 줄바꿈 처리, 고정 헤더 앵커 보정(`scroll-padding-top`), 주요 터치 영역 44×44px.
- **데이터:** `src/content.config.ts` 스키마로 PLAN의 프로젝트 필드 전부와 `sample` 표시 필드를 검사(필수 항목·대체 설명 누락 시 빌드 오류). 공통 정보는 `src/data/site.ts`. 비어 있는 이메일·링크·이력서 버튼은 숨김.
- **샘플:** RPG HUD·캐릭터 정보 / 모바일 로비·메뉴 UX / 인벤토리·상점 UI. 카드·상세에 "샘플 프로젝트" 배지, 이미지 모서리에 SAMPLE 표시, 본문은 `[샘플 문구]`. 이미지는 직접 만든 SVG 도형, RPG HUD에는 직접 만든 약 6초 무음 영상(WebM, 253KB). 인벤토리 샘플은 긴 제목·선택 항목 없음 확인용.
- **접근성:** 시맨틱 마크업, 페이지당 H1 1개와 단계를 건너뛰지 않는 제목 순서, 본문 바로가기, 포커스 표시, 아이콘 버튼 이름, `prefers-reduced-motion` 반영, 영상 자동 재생 없음(`preload="none"`, 포스터 먼저 표시).
- **성능:** 이미지 width/height 지정, 첫 화면 이미지 즉시 로딩, 하단 이미지 지연 로딩, PNG·JPG는 빌드 때 WebP srcset 자동 생성. JS는 인라인으로 메인 0.8KB, 상세 5.2KB.
- **검색·공유:** 페이지별 title/description, Open Graph, 파비콘·터치 아이콘. canonical·og:url·og:image·sitemap.xml·robots.txt는 `SITE_URL`을 지정해 빌드할 때만 생성(가짜 주소 하드코딩 없음).
- **배포 준비:** `BASE_PATH`로 하위 경로 배포 대응. GitHub Pages 워크플로는 자동 배포를 막기 위해 **수동 실행(workflow_dispatch) 전용**이며 실행하지 않음.

## 주요 변경 파일
| 파일 | 내용 |
| --- | --- |
| `astro.config.mjs` | `SITE_URL`·`BASE_PATH` 처리, 주소가 있을 때만 sitemap·robots 생성 |
| `src/content.config.ts` | 프로젝트 데이터 스키마 |
| `src/data/site.ts` | 이름·소개·연락처 등 공통 정보 (샘플) |
| `src/content/projects/*/index.yaml`, `images/` | 샘플 프로젝트 3개와 이미지 |
| `src/pages/index.astro`, `projects/[slug].astro`, `404.astro` | 페이지 |
| `src/layouts/BaseLayout.astro` | 공통 head(메타데이터)·헤더·푸터 |
| `src/components/` | Header(모바일 메뉴), Footer, ProjectCard, ZoomFigure, Lightbox(확대 뷰어), VideoBlock, RichText |
| `src/styles/tokens.css`, `global.css` | 디자인 토큰, 공통 스타일 |
| `src/lib/` | 경로(BASE_PATH) 처리, 정렬·본문 파싱 |
| `public/` | 파비콘, 공유 이미지, 샘플 영상 |
| `scripts/verify.mjs` | Playwright 자동 점검 |
| `.github/workflows/deploy.yml` | GitHub Pages 배포 (수동 전용) |
| `README.md` | 설치·실행, 콘텐츠 교체, 이미지 규격, 테마, 배포, 공개 전 교체 목록 |
| `.gitignore` | `.astro/`, `verify-report/`, `test-results/` 추가 |

## 실행 · 빌드
```bash
npm install            # 의존성 설치 (Node.js 22.12 이상)
npm run dev            # 미리보기 → http://localhost:4321
npm run build          # 정적 빌드 → dist/
npm run preview        # 빌드 결과 미리보기 → http://localhost:4321
npm run check          # 타입·콘텐츠 스키마 검사

# 자동 점검 (최초 1회 브라우저 설치, 약 1.2GB)
npx playwright install chromium firefox webkit
npm run build && npm run verify

# 하위 경로 빌드 예시 (Git Bash에서는 앞의 / 없이)
SITE_URL=https://<계정>.github.io BASE_PATH=hwhwang-portfolio npm run build
```

## 검증 결과
환경: Windows 10, Node 24.19, Playwright 1.63(Chromium·Firefox·WebKit 내장 빌드). 모든 결과는 실제 실행한 값이다.

| 항목 | 결과 |
| --- | --- |
| `npm run build` | 성공 (5페이지) |
| `npm run check` (astro check) | 오류 0, 경고 0 |
| `npm run verify` Chromium | 214/214 통과 |
| `npm run verify` Firefox | 214/214 통과 |
| `npm run verify` WebKit | 214/214 통과 (아래 WebKit 참고 사항) |
| 하위 경로 빌드 `BASE_PATH=hwhwang-portfolio` + Chromium 점검 | 214/214 통과, canonical·sitemap 경로 정상 |
| 루트 빌드 (`SITE_URL` 없음) | canonical·sitemap 미생성 확인 |
| 글자 대비 (계산) | 본문 16.4:1, 보조 글자 7.2:1 이상, 강조색 9.9:1 이상 |

- **확인한 화면 너비:** 320 / 375 / 390 / 480 / 600 / 700 / 768 / 900 / 1024 / 1100 / 1199 / 1200 / 1440 / 1920px (PLAN의 11개 + 중간 너비 3개). 페이지 4개(메인, 상세 3개) + 404.
- **점검 항목:** 본문 가로 넘침·화면 밖 요소·고정 높이 글자 잘림 / 너비별 그리드 열 수 / 상세 직접 접속(200)·없는 주소(404) / 내부 링크 전체 200 / 깨진 이미지 / 콘솔 오류·실패 요청 / 제목 순서·메타데이터 / 본문 바로가기 / 데스크톱 메뉴·앵커 이동 시 헤더 가림 없음 / 카드 이미지 영역 클릭 → 상세 / 상세 → Contact 이동 / 모바일 메뉴(375·320px: 44px, 열림 상태, 첫 링크 초점, Esc 닫기와 초점 복원, 링크 이동 후 닫힘, 바깥 클릭 닫힘) / 확대 뷰어(데스크톱 1280×800, 모바일 세로 390×844, 모바일 가로 844×390: 열기, 스크롤 잠금, 초점, 버튼이 화면 안에 있고 44px 이상, 확대·드래그·키보드 축소·맞춤, 맞춤 시 비율 유지, 원본 링크, Tab 순환, Esc, 초점·스크롤 복원, 닫기 버튼) / 영상 preload·자동 재생 / 선택 항목 없는 프로젝트의 빈 항목 숨김 / 200% 확대(CSS 640×400) / 글자만 200% 확대(320·375·768·1280px, 메뉴 접근 포함).
- **이번 작업에서 고친 문제:** 글자 200% + 320px에서 About 영역이 20px 넘치던 문제 → 격자 열 `minmax(0, 1fr)` 지정과 태그·경력 줄바꿈 처리로 해결.
- **WebKit 참고 사항:** Playwright의 Windows용 WebKit은 미디어 재생 기능이 없어 `<video>`가 있는 페이지의 load 이벤트가 끝나지 않는다. 그래서 WebKit은 DOM 준비 시점까지만 대기하고 이미지 로딩은 따로 확인했다. 이 환경의 헤드리스 WebKit은 Tab 키 초점 이동도 동작하지 않아, 본문 바로가기는 프로그램으로 초점을 준 뒤 표시 여부만 확인했다. WebKit의 Tab 관련 결과는 실제 키보드 동작을 검증한 것이 아니다.

## 미검증 항목
| 항목 | 사유 |
| --- | --- |
| 실제 모바일 기기(iOS Safari, Android Chrome) | 기기 없음. 화면 크기·터치 에뮬레이션만 수행 |
| 실제 터치 핀치 제스처 | 자동화로 두 손가락 입력을 재현하지 않음. 버튼·드래그·휠 확대는 확인 |
| 실제 브라우저 200% 확대 기능 | 같은 효과인 CSS 640px 화면으로 대체 확인 |
| macOS Safari에서 Tab 키 이동, 영상 재생 | Windows용 WebKit 제약 (위 참고) |
| Lighthouse 등 성능 점수 | 측정하지 않음 |
| 실제 GitHub Pages 배포 | 외부 공개 배포 금지 지시에 따라 미실행 |
| 화면 낭독기(NVDA, VoiceOver) 사용 | 미실행. 마크업·이름 속성만 확인 |

## 가정한 사항
- 기술: 기존 구현이 없어 PLAN 기본값(Astro + TypeScript, 정적 빌드)을 따름. Astro는 설치 시점 최신 7.3.5.
- 디자인: 짙은 무채색 배경(#0f1012), 강조색 앰버(#f2b84b) 한 가지, 시스템 한글 폰트. 모두 `tokens.css`에서 변경 가능.
- 샘플 정보: 이름 "Your Name", 이메일 `hello@example.com`, 외부 링크는 ArtStation·Behance 메인 페이지, 경력은 `[경력 입력]` 예시 1개. 실제 경력·회사·성과·수치는 넣지 않음.
- 모바일 메뉴 전환점: 약 640px(40em). 메뉴 3개가 640px 이상에서는 충분히 들어감.
- 카드 썸네일 비율 16:10, 상세 이미지는 원본 비율.
- 샘플 영상은 이 PC에 MP4 인코더가 없어 WebM만 제공. 스키마는 여러 형식(`[mp4, webm]`)을 지원.
- Git 사용자 정보: 이 저장소에만 `OdysseyHW` / GitHub noreply 이메일을 로컬 설정(다른 저장소 bus8002와 같은 방식).
- PR 생성: `gh` CLI가 설치되어 있지 않아 Git Credential Manager에 저장된 자격 증명으로 GitHub API를 호출해 생성.

## 남은 문제 · 기획 질문
- **저장소 공개 범위:** 저장소가 public이라 소스와 샘플이 공개되어 있다(웹사이트 배포는 아님). 실제 연락처·이력서를 넣기 전에 공개 범위를 확인해야 한다.
- **npm audit:** `http-cache-semantics`(Astro 의존성) 고위험 경고 2건. 제안된 수정은 Astro 2.x로 낮추는 것이라 적용하지 않음. 서버 캐시 관련 문제라 정적 빌드 결과에는 영향이 없다고 판단. Astro 업데이트 시 다시 확인 필요.
- **영상 형식:** 실제 영상은 Safari/iOS 호환을 위해 MP4(H.264)를 먼저 넣는 것을 권장.
- **질문 1:** 최종 강조색·테마 방향(현재 다크 갤러리 + 앰버)을 유지할지.
- **질문 2:** 이름 표기(한글/영문)와 로고 사용 여부.
- **질문 3:** 배포 주소 — GitHub Pages 하위 경로(`/hwhwang-portfolio/`) / 사용자 페이지 / 사용자 지정 도메인 중 무엇으로 할지. 정해지면 `SITE_URL`·`BASE_PATH`만 지정하면 된다.
- **질문 4:** About의 경력 블록을 둘지(경력이 없으면 숨김 처리 가능).
- 기획 변경 제안: 없음. 확대 뷰어의 이미지 간 이전·다음 이동은 초기 범위에 넣지 않았다. 필요하면 다음 요청으로 추가할 수 있다.

## 다음 작업
1. PR #1 검토 후 main 병합 (사용자 또는 검토 담당).
2. 실제 자료로 교체: `src/data/site.ts`, `src/content/projects/`, `public/og-default.png` (README의 "공개 전 교체 목록" 참고).
3. 실제 모바일 기기(iOS Safari, Android Chrome)에서 메뉴·확대 뷰어·핀치 확인.
4. 배포 주소 확정 후 별도 요청으로 GitHub Pages 배포(수동 워크플로 실행), 배포 후 Lighthouse 측정.

---

# REQ-002 · REQ-003 기록

## 요약 (REQ-002·003)
- 작업 날짜: 2026-10-04
- 요청 ID: REQ-002(블랙·화이트 + Google Sans), REQ-003(영상 배경 대형 타이포 히어로), REQ-003 확정 보완(기존 샘플 영상 우선 적용, 히어로 제목 Zalando Sans Expanded)
- 기준: docs/REQUESTS.md의 REQ-002, REQ-003, 확정 보완 (확정 보완이 우선)
- 브랜치 / 커밋 / PR: 아래 [브랜치 · 커밋 · PR (REQ-002·003)](#브랜치--커밋--pr-req-002003)
- 실제 영상 여부: **최종 영상 없음.** 새 영상은 제작·구매·생성하지 않았고, 저장소에 있던 자체 제작 샘플 `public/videos/rpg-hud-interaction.webm`(253KiB, 6초, 무음)을 히어로 배경에 실제 연결했다. 화면에 `SAMPLE VIDEO`로 표시.

## 브랜치 · 커밋 · PR (REQ-002·003)
- 브랜치: `feature/req-002-003-bw-hero` (REQ-001 브랜치 `feature/req-001-portfolio-base` 8d1d372 위에서 시작)
- 커밋
  - `40266d5` docs: REQ-002·REQ-003 요청과 확정 보완 추가 (PLAN, REQUESTS 원본 그대로)
  - `10ac101` feat: 블랙·화이트 테마, Google Sans, 영상 배경 히어로
  - `ff71fd9` docs: REQ-002·003 결과 기록
  - 이 STATUS.md 커밋·PR 정보 갱신 커밋
- PR: https://github.com/OdysseyHW/hwhwang-portfolio/pull/2 (base: `feature/req-001-portfolio-base` — PR #1 위에 쌓은 PR. PR #1 병합 후 base를 `main`으로 변경)
- main 직접 병합·강제 푸시·외부 배포: 하지 않음

## 구현 기능 (REQ-002·003)
### REQ-002 블랙·화이트 + Google Sans
- **색상 토큰:** 요청 권장값 그대로 — 배경 #0A0A0A, 표면 #141414, 올라온 표면 #1C1C1C, 본문 #F5F5F5, 보조 #B3B3B3, 테두리 #333333, 강한 테두리 #666666. 앰버 강조색과 관련 토큰을 모두 제거.
- **버튼·상태:** 주요 버튼은 흰 바탕 + 검정 글자, 보조 버튼은 무채색 테두리. 호버는 밑줄(메뉴·카드 제목·링크)과 테두리 밝기, 포커스는 흰 외곽선 + 안쪽 어두운 간격(`box-shadow`)이라 흰 버튼·영상 위에서도 구별된다.
- **사이트 그래픽 정리:** 헤더(스크롤 후 불투명 #0A0A0A), 카드, 태그, 샘플 배지(무채색 점선), 링크, 확대 뷰어, 푸터, `theme-color`, 파비콘·터치 아이콘, 공유 이미지(og-default.png)를 블랙·화이트로 다시 만듦.
- **작업물 색 보존:** 프로젝트 이미지·영상에는 필터를 적용하지 않음 (자동 점검으로 확인).
- **Google Sans:** 공식 저장소 Release v14.000의 static `GoogleSans-Regular/Medium/Bold.ttf`를 라틴 문자 범위로 subset 후 WOFF2로 자체 호스팅(각 약 28~30KB). `font-display: swap`. 본문 400, 메뉴·버튼 500, 제목 700 (Google Sans 실제 제공 굵기: 400·500·700, 600 없음). Google Sans Code·Product Sans로 대체하지 않음.
- **한글:** fontTools로 확인한 결과 Google Sans v14.000에는 한글 글리프가 **0개**. 한글은 Apple SD Gothic Neo → Malgun Gothic → Noto Sans KR → system-ui 순으로 대체되고 영문·숫자만 Google Sans로 표시된다.
- **출처·라이선스 보존:** `public/fonts/FONTS.md`(출처, 버전, 수정 내용, 문자 범위), `public/fonts/google-sans/OFL.txt`·`TRADEMARKS.txt`(공식 원문). 글꼴 내부 저작권·라이선스 정보(name 테이블)는 subset 후에도 유지.

### REQ-003 영상 배경 히어로 (+ 확정 보완)
- **구성:** 기존 짧은 소개 영역을 첫 화면 히어로로 교체 — 투명 헤더(왼쪽 이름, 오른쪽 Works/About/Contact) → 왼쪽 정렬 3행 대형 제목 → 소개 → 작업물 보기 → 하단 Scroll 안내·`SAMPLE VIDEO`·재생/일시정지. 프로젝트 목록은 히어로 바로 다음.
- **데이터 분리:** `src/data/hero.ts` — `titleLines`, `description`, `videoDesktop`, `videoMobile`, `posterDesktop`, `posterMobile`, `focalPoint`(+모바일), `ctaLabel`/`ctaTarget`, `monochrome`, `sampleLabel`. 임시 헤드라인 `GAME UI / DESIGNED / FOR PLAY`, 소개 `플레이의 흐름을 만드는 게임 UI 디자이너.`
- **샘플 영상 연결(확정 보완):** desktop·mobile 모두 `public/videos/rpg-hud-interaction.webm`, BASE_PATH 반영 URL. 영상 파일은 수정하지 않음. 포스터는 기존 RPG 프로젝트 이미지 `hud-final.svg` 재사용.
- **흑백 처리:** 히어로의 영상·포스터에만 `filter: grayscale(1)` + 검정 오버레이. 오버레이는 완전히 흰 프레임을 가정해도 글자 영역이 검정 60% 이상이 되도록 설정(흰 글자 대비 약 5.7:1 이상, 아래 [가정](#가정한-사항-req-002003) 참고).
- **제목 글꼴(확정 보완):** 히어로 대형 제목에만 Zalando Sans Expanded 800. 메뉴·본문·일반 제목은 Google Sans. 가장 긴 행(DESIGNED)이 약 6.5em인 것을 실측해 `min(clamp(…), 14.5cqi)`로 상한 → 320px·글자 200%에서도 화면을 넘지 않음. 데스크톱 `clamp(4rem, 8.5vw, 10rem)`, 모바일 `clamp(2.5rem, 11vw, 4.5rem)`, 낮은 가로 화면은 `15svh`로 추가 제한.
- **Zalando Sans Expanded 라이선스:** OFL이지만 **Reserved Font Name "Zalando"**가 있어 subset 등 수정본은 같은 이름을 쓸 수 없다. 그래서 Google Fonts 공식 파일(`ZalandoSansExpanded[wght].ttf`, 버전 1.800, google/fonts 커밋 8b882cc9ed)을 **수정 없이** 사용(146KB, 메인에서만 로드·preload). 파일 이름만 URL 문제로 변경. `public/fonts/zalando-sans-expanded/OFL.txt` 보존.
- **영상 동작:** `muted`·`loop`·`playsinline`. 포스터와 텍스트를 먼저 표시하고, JS가 화면 너비(약 640px 기준)에 맞는 **파일 하나만** 불러와 자동 재생을 시도한다. 재생이 시작되면 영상이 포스터 위로 나타남.
  - 자동 재생 차단·재생 불가·파일 없음 → 포스터 유지, 페이지 동작은 그대로. 파일을 못 불러오면 버튼을 비활성화하고 상태를 화면 낭독기에 알림.
  - 재생/일시정지 버튼(44×44px, 접근 가능한 이름 전환)을 항상 제공. 사용자가 멈춘 상태는 localStorage에 저장되어 새로고침·재방문·화면 재진입에도 유지되며, 이때는 영상 파일을 요청하지 않음.
  - `prefers-reduced-motion: reduce` 또는 데이터 절약(`navigator.connection.saveData`)이면 영상을 요청하지 않고 포스터 표시. 사용자가 재생 버튼을 누르면 재생.
  - 히어로가 화면 밖(IntersectionObserver)이거나 탭이 숨겨지면 멈추고, 돌아오면 사용자가 멈추지 않은 경우에만 다시 재생.
  - 영상은 `aria-hidden`의 장식 요소, 제목·소개는 실제 HTML 텍스트(h1).
- **헤더:** 메인에서는 투명한 검정 그라디언트 + 흰 메뉴로 시작하고, 16px 이상 스크롤하거나 모바일 메뉴를 열면 불투명 검정. 상세 페이지는 항상 불투명. (그라디언트가 테두리 영역에서 반복되어 생기던 1px 선도 수정)
- **반응형:** 히어로는 `min-height: 100svh`(콘텐츠가 길면 늘어남, 고정 높이·overflow 자르기 없음). 좁은/낮은 화면은 여백 축소, 하단 버튼 줄은 줄바꿈 허용.

## 주요 변경 파일 (REQ-002·003)
| 파일 | 내용 |
| --- | --- |
| `src/styles/tokens.css` | 블랙·화이트 색상, 글꼴 스택, 굵기 토큰 |
| `src/styles/fonts.css` (신규) | Google Sans 400/500/700, Zalando Sans Expanded `@font-face` |
| `src/assets/fonts/` (신규) | 글꼴 파일 4개 (Vite가 BASE_PATH 반영한 경로로 출력) |
| `public/fonts/FONTS.md`, `google-sans/OFL.txt`, `google-sans/TRADEMARKS.txt`, `zalando-sans-expanded/OFL.txt` (신규) | 출처·라이선스·수정 내용 |
| `src/styles/global.css` | 링크·포커스·버튼·배지·eyebrow 무채색화, 굵기 토큰 적용 |
| `src/components/Hero.astro` (신규) | 영상 배경 히어로와 영상 제어 스크립트 |
| `src/data/hero.ts` (신규) | 히어로 문구·영상·포스터 설정 |
| `src/components/Header.astro` | 투명/불투명 오버레이 헤더, 메뉴 굵기·밑줄 |
| `src/layouts/BaseLayout.astro` | `overlayHeader` 옵션, head 슬롯(글꼴 preload), theme-color |
| `src/pages/index.astro` | 기존 소개 영역 → Hero, 카드 지연 로딩, 글꼴 preload |
| `src/data/site.ts` | 쓰지 않게 된 `intro` 제거 (히어로 소개로 대체) |
| `src/components/ProjectCard.astro`, `ZoomFigure.astro`, `VideoBlock.astro`, `Lightbox.astro`, `src/pages/projects/[slug].astro` | 강조색 제거, 굵기 토큰 |
| `public/favicon.svg`, `apple-touch-icon.png`, `og-default.png` | 블랙·화이트로 다시 제작 |
| `scripts/verify.mjs` | 히어로·글꼴 점검 항목 추가 |
| `scripts/screenshots.mjs` (신규), `docs/screenshots/*.jpg` | 검토용 캡처 스크립트와 결과 |
| `README.md` | 히어로·영상 교체 방법, 영상·포스터 규격, 색상·글꼴 안내, 공개 전 교체 목록 갱신 |

## 실행 · 빌드 (REQ-002·003)
```bash
npm install
npm run dev               # http://localhost:4321
npm run build && npm run preview
npm run check             # 타입·스키마 검사
npm run verify            # 3개 브라우저 자동 점검 (최초 1회: npx playwright install chromium firefox webkit)
npm run screenshots       # docs/screenshots/ 캡처 갱신
```

## 스크린샷 (REQ-002·003)
`docs/screenshots/` — 모두 Chromium에서 히어로 영상 재생 후 캡처 (실제 기기 아님).

| 파일 | 화면 |
| --- | --- |
| `home-desktop-1440.jpg` | 데스크톱 히어로 |
| `home-works-desktop-1440.jpg` | 데스크톱 프로젝트 목록 (스크롤 후 불투명 헤더) |
| `home-mobile-390.jpg` | 모바일 히어로 |
| `home-mobile-menu-390.jpg` | 모바일 메뉴 열림 (영상 위) |
| `home-mobile-landscape-844.jpg` | 모바일 가로 화면 히어로 |
| `home-works-mobile-390.jpg` | 모바일 프로젝트 목록 |
| `detail-desktop-1440.jpg`, `detail-mobile-390.jpg` | 상세 페이지 (작업물 원본 색 유지) |

## 검증 결과 (REQ-002·003)
환경: Windows 10, Node 24.19, Playwright 1.63(Chromium·Firefox·WebKit 내장 빌드). 모두 실제로 실행한 결과이며, 실제 모바일 기기가 아닌 화면 크기·터치 에뮬레이션이다.

| 항목 | 결과 |
| --- | --- |
| `npm run check` | 오류 0, 경고 0 |
| `npm run build` | 성공 (5페이지) |
| `npm run verify` Chromium | **260/260 통과** |
| `npm run verify` Firefox | **260/260 통과** |
| `npm run verify` WebKit | **253/253 통과** (영상 재생 확인 7개 항목은 아래 사유로 건너뛰고, 대신 "재생 불가 → 포스터 유지"를 확인) |
| 하위 경로 빌드 `BASE_PATH=hwhwang-portfolio` + Chromium | **260/260 통과**. 글꼴 preload·@font-face·히어로 영상 URL이 모두 `/hwhwang-portfolio/`로 시작 |
| 대비 (계산) | 본문 18.2:1, 보조 글자 8.1:1 이상, 주요 버튼(검정/흰) 18.2:1, 강한 테두리 3.45:1. 히어로는 흰 프레임을 가정해도 글자 영역 약 5.7:1 이상 |

**새로 추가한 점검 항목 (REQ-002·003)**
- 히어로 배경 영상 실제 재생: 1초 동안 재생 위치가 늘어나는지, `muted`·`loop`·`playsinline`, 데스크톱 1440·모바일 390에서 영상 파일 **1개만** 요청 — Chromium·Firefox 통과
- 재생/일시정지 버튼 44px, `SAMPLE VIDEO` 표시, 제목이 HTML 텍스트, 히어로에만 흑백 필터
- 정지 → 새로고침 후에도 정지 유지(영상 요청 0건) → 재생 버튼으로 다시 재생
- 화면 밖으로 스크롤하면 정지, 돌아오면 다시 재생. 사용자가 멈춘 경우 돌아와도 정지 유지
- 모션 줄이기(`reducedMotion: reduce`): 영상 요청 0건 + 포스터 표시, 버튼을 누르면 재생
- 자동 재생 차단(첫 `play()` 거부): 포스터 유지, 버튼 "재생", 페이지 오류 없음
- 영상 파일 없음(존재하지 않는 경로): 포스터 유지, 버튼 비활성·안내, 작업물 보기 이동 정상
- 제목·소개·버튼·하단 줄 겹침 없음: 320×568, 390×844, 768×1024, 1024×768, 1440×900, 1920×1080, 모바일 가로 844×390·667×375, 글자 200%(320·1280)
- 모바일: 처음엔 투명 헤더, 메뉴를 열면 불투명 헤더와 메뉴 배경(#141414), 메뉴 → Works 이동 시 제목이 헤더 아래, 스크롤 후 불투명 헤더
- 글꼴: 제목 Zalando Sans Expanded 적용, 본문 Google Sans 로드. **글꼴 파일을 모두 막아도**(로드 실패) 390·1440px에서 넘침·겹침 없음
- 상세 페이지 작업물 이미지·영상에 필터가 없음(원본 색 유지)
- 기존 REQ-001 항목(14개 너비 레이아웃, 메뉴, 카드·상세, 확대 뷰어, 키보드·초점, 200% 확대, 링크·이미지·콘솔 오류 등)은 그대로 유지·통과

**WebKit 참고 사항 (Playwright의 Windows용 WebKit 빌드 제약)**
- 영상 요소 때문에 페이지 load 이벤트가 끝나지 않는다. 이 때문에 `document.fonts.ready`도 끝나지 않아 처음에는 점검이 멈췄고(3시간 대기 후 원인 확인), 점검 스크립트에서 이 대기를 최대 1.5초로 제한했다. 사이트 코드는 이 값을 기다리지 않는다.
- 이 빌드에서는 영상 `playing` 이벤트가 발생하지 않아 사이트는 포스터를 유지한다. 그래서 WebKit에서는 "재생 불가 환경 → 포스터 유지"를 확인했고, 실제 재생·정지 유지·화면 밖 정지·모션 줄이기에서 직접 재생 항목은 건너뛰었다. **macOS·iOS Safari에서의 실제 영상 재생은 미검증.**
- WebKit은 영상 요청이 Playwright 요청 가로채기를 거치지 않는다. 그래서 "영상 파일 없음" 점검은 HTML의 영상 경로를 없는 파일로 바꾸는 방식으로 세 브라우저 모두 같은 조건에서 확인했다.
- 처음 실행에서 WebKit의 글꼴 판정이 실패한 것은 WebKit이 계산된 글꼴 이름을 따옴표 없이 돌려주기 때문이었다(실제 글꼴은 정상 로드·적용, 제목 폭 796px로 Chromium과 동일). 판정을 따옴표와 무관하게 고쳤다.

## 미검증 항목 (REQ-002·003)
| 항목 | 사유 |
| --- | --- |
| macOS·iOS Safari에서 히어로 영상 실제 재생·자동 재생 정책 | Windows용 WebKit 빌드 제약. 실제 기기 없음 |
| 실제 모바일 기기(저전력 모드, 데이터 절약 모드 포함) | 기기 없음. 데이터 절약은 `navigator.connection.saveData`를 지원하는 브라우저(Chromium 계열)에서만 동작하며 자동화로 켜 보지는 않음 |
| 탭 숨김(`visibilitychange`) 시 정지 | 코드에는 구현했으나 자동화로 탭 전환을 재현하지 않음 |
| 실제 브라우저 200% 확대 | CSS 640px 화면과 글자 200%로 대체 확인 |
| 화면 낭독기(NVDA, VoiceOver) | 미실행. 이름·상태 속성만 확인 |
| Lighthouse 등 성능 점수 | 측정하지 않음. 참고: 메인 첫 화면에 글꼴 약 230KB(Google Sans 3개 약 87KB + Zalando 146KB), 샘플 영상 253KB |

## 가정한 사항 (REQ-002·003)
- 제목 굵기: Google Sans에 600이 없어 일반 제목은 700을 사용. 히어로 제목은 Zalando Sans Expanded 800.
- Google Sans는 "Google Sans"(광학 크기 18) static 파일을 사용. "Google Sans Text"(작은 글자용 광학 크기)는 쓰지 않음.
- 히어로 오버레이는 최종 영상의 밝기를 모르므로 완전히 흰 프레임을 가정해 정함. 실제 영상이 어둡다면 오버레이를 약하게 조정할 수 있음(`Hero.astro`의 `.hero__shade`).
- 모바일/데스크톱 영상 전환 기준은 메뉴 전환점과 같은 약 640px. 첫 로드 이후 화면 크기가 바뀌어도 영상을 다시 받지 않음(두 파일 중복 다운로드 방지).
- 사용자가 멈춘 상태는 localStorage(`hero-video-paused`)에 저장. 저장소를 못 쓰는 환경에서는 현재 페이지에서만 유지.
- 메인 카드 이미지는 이제 첫 화면(히어로) 아래에 있으므로 지연 로딩으로 변경.
- 헤더 배경은 요청대로 스크롤 후 **불투명** 검정(#0A0A0A). 반투명일 때 히어로 하단 글자가 비쳐 보여 불투명으로 확정.
- 공유 이미지(og-default.png)에도 임시 헤드라인을 넣음 → 공개 전 교체 목록에 추가.

## 남은 문제 · 기획 질문 (REQ-002·003)
- **최종 히어로 영상:** 사용자 보유 UI 모션 쇼릴을 받으면 `src/data/hero.ts`의 경로만 바꾸면 됨. Safari·iOS 호환을 위해 MP4(H.264)를 먼저 넣는 것을 권장.
- **샘플 영상 공유:** `rpg-hud-interaction.webm`을 히어로와 RPG 샘플 상세가 함께 쓴다. 한쪽만 교체할 때 지우지 않도록 README에 적어 둠.
- **질문 1:** 최종 헤드라인을 영문 3행으로 유지할지, 한글 헤드라인을 쓸지. 한글은 Zalando Sans Expanded에 글리프가 없어 시스템 글꼴로 표시된다.
- **질문 2:** 히어로 하단 `Scroll` 안내와 `SAMPLE VIDEO` 표시 위치가 의도와 맞는지 (스크린샷 `home-desktop-1440.jpg`).
- **질문 3:** 최종 영상이 밝은 편이라면 흑백 필터를 유지할지, 원본 색을 살릴지(`hero.ts`의 `monochrome`).
- 기획 변경 제안: 없음.

## 다음 작업 (REQ-002·003)
1. PR #1(REQ-001) 검토·병합 후, 이 PR의 base를 `main`으로 바꿔 검토·병합.
2. 최종 히어로 영상·포스터·헤드라인 교체.
3. 실제 iPhone(Safari)·Android(Chrome)에서 히어로 자동 재생, 정지 버튼, 메뉴 확인.
4. 배포 주소 확정 후 별도 요청으로 배포 및 Lighthouse 측정.

---

# PR #2 검토 대응 (docs/REVIEW-PR-002.md)

## 요약 (검토 대응)
- 작업 날짜: 2026-10-04
- 대상: `docs/REVIEW-PR-002.md`의 R1(글자 확대가 대형 제목에 반영되지 않음), R2(낮은 가로 화면에서 영상 제어가 첫 화면 아래로 밀림)
- 검토 문서의 디자인 권고(질문 3개)는 사용자 확정 전이므로 새 사용자 결정으로 기록하지 않았고, 구현에도 반영하지 않았다.
- 위 "REQ-002 · REQ-003 기록"의 제목 크기 설명(`14.5cqi` 상한, 낮은 화면 `15svh` 제한)은 이 대응으로 **대체**되었다.

## R1 대응: 글자 확대가 대형 제목에 반영되게
- **원인:** 제목 크기를 `vw`·`cqi`·`svh`로 상한을 두어, 사용자가 글자 크기를 키워도(rem 증가) 상한에 막혔다.
- **수정 (`src/components/Hero.astro`):** 제목 크기를 rem 중심 + 작은 vw 보정으로 변경하고 `cqi`·`svh` 상한과 container query를 제거했다.

  | 화면 | 규칙 | 기본 크기 |
  | --- | --- | --- |
  | ~639px | `calc(2.375rem + 1vw)` | 320px 41px · 390px 42px |
  | 640~1199px | `min(calc(4rem + 3.5vw), 10rem)` | 768px 91px · 1024px 100px |
  | 1200px~ | `min(calc(5.5rem + 2.25vw), 10rem)` | 1440px 120px · 1920px 131px |
  | 낮은 가로 화면(높이 480px 이하, 폭 640px 이상) | `calc(2.75rem + 1.6vw)` | 667px 55px · 844px 58px (이전과 같은 수준, 더 줄이지 않음) |

- **넘칠 때:** 글자를 줄이지 않고 줄바꿈하며 히어로 높이가 늘어난다(`overflow-wrap: anywhere`, `hyphens: auto`, 제목 `lang="en"`). 대문자 단어는 브라우저 자동 하이픈이 적용되지 않아, 데이터에 soft hyphen(`DE\u00ADSIGNED`)을 넣어 필요할 때만 `DE-` / `SIGNED`로 끊기게 했다. 기본 글자 크기에서는 320~1920px 모두 3행을 유지한다.
- **함께 고친 문제:** 글자 200%에서 본문 바로가기 링크가 `top: -100px`보다 커져 화면 왼쪽 위에 끝이 보이던 문제 → 링크 높이와 무관하게 `transform`으로 숨기도록 변경(`src/styles/global.css`).

## R2 대응: 낮은 가로 화면에서 영상 제어를 첫 화면에
- **수정 (`src/components/Hero.astro`):** 높이 480px(30em) 이하 화면에서만 `SAMPLE VIDEO`·재생/정지 줄을 히어로 맨 위(헤더 바로 아래)로 옮겼다(`order: -1`). 문서 흐름 안이라 다른 요소를 가리지 않고, 사이트 전체에 고정하지 않았다. 같은 기능(작업물로 이동)의 `Scroll` 안내는 이 화면에서만 숨기고 `작업물 보기` 버튼이 대신한다. 제목은 줄이지 않았다.
- **결과:** 844×390·667×375 첫 화면에서 정지 버튼 top 68px·bottom 112px (화면 높이 390/375), 44×44px, 다른 요소와 겹침 없음.

## 검증 추가·변경 (검토 대응)
- **R1 검사(새로 추가):** 320×568, 390×844, 768×1024, 1440×900, 1920×1080, 844×390, 667×375에서 html `font-size: 200%` 전후 제목의 계산된 크기를 비교한다. 기준은 **1.5배 이상 증가**, 기본 상태 3행, 제목·소개·CTA·정지 버튼의 가로 넘침 없음, 히어로 요소 간 겹침 없음. html 크기 변경은 브라우저 글자 크기 설정의 재현이며, 실제 브라우저 확대 기능의 완전한 대체는 아니다.
- **R2 검사(새로 추가):** 844×390, 667×375 기본 화면에서 스크롤 없이 정지 버튼 전체가 헤더 아래·화면 안에 보이는지, 44px 이상인지, 다른 요소와 겹치지 않는지.
- **히어로 겹침 검사 변경:** "하단 줄은 CTA 아래" 같은 순서 가정 대신, 보이는 요소(헤더·제목·소개·CTA·Scroll·SAMPLE·정지 버튼)끼리 서로 겹치는지와 가로 넘침·히어로 밖 이탈을 검사하도록 바꿨다.
- 제목 텍스트 검사는 soft hyphen을 제외하고 비교한다.

## 검증 결과 (검토 대응)
환경: Windows 10, Node 24.19, Playwright 1.63. 실제 모바일 기기가 아닌 화면 크기·터치 에뮬레이션.

| 항목 | 결과 |
| --- | --- |
| `npm run check` | 오류 0, 경고 0 |
| `npm run build` | 성공 (5페이지) |
| `npm run verify` Chromium | **269/269 통과** (R1 7개 + R2 2개 추가) |
| `npm run verify` Firefox | **269/269 통과** |
| `npm run verify` WebKit | **262/262 통과** (영상 재생 확인 7개는 Windows 테스트 빌드 제약으로 포스터 대체 확인) |

**R1 — 글자 200% 전후 제목 크기 (세 브라우저 동일, Chromium 값)**

| 화면 | 기본 | 글자 200% | 배율 | 기본 행 수 |
| --- | --- | --- | --- | --- |
| 320×568 | 41.2px | 79.2px | ×1.92 | 3 |
| 390×844 | 41.9px | 79.9px | ×1.91 | 3 |
| 768×1024 | 90.9px | 154.9px | ×1.70 | 3 |
| 1440×900 | 120.4px | 208.4px | ×1.73 | 3 |
| 1920×1080 | 131.2px | 219.2px | ×1.67 | 3 |
| 844×390 | 57.5px | 101.5px | ×1.77 | 3 |
| 667×375 | 54.7px | 98.7px | ×1.80 | 3 |

검토 시 측정값(390px ×1.05, 1440px ×1.05, 844×390 변화 없음) 대비 모든 화면에서 1.67배 이상 커지며, 넘침·겹침 없이 소개·CTA·정지 버튼에 접근할 수 있다. 2배에 못 미치는 것은 넓은 화면일수록 vw 보정 비중이 커지기 때문이다(rem 부분은 정확히 2배).

**R2 — 낮은 가로 화면 정지 버튼 (세 브라우저 동일)**

| 화면 | 정지 버튼 위치 | 크기 | 겹침 |
| --- | --- | --- | --- |
| 844×390 | top 68px · bottom 112px (화면 390) | 44×44 | 없음 |
| 667×375 | top 68px · bottom 112px (화면 375) | 44×44 | 없음 |

검토 시 844×390에서 top 373.86 · bottom 417.86(화면 밖)이었던 것이 첫 화면 위쪽으로 옮겨졌다.

**하위 경로 빌드:** 이번 변경은 히어로 CSS·데이터와 본문 바로가기 CSS뿐이고 경로 처리에는 변경이 없어 다시 실행하지 않았다(직전 PR #2 기록: Chromium 260/260).

## 스크린샷 갱신 (검토 대응)
`docs/screenshots/` 전체를 현재 빌드로 다시 캡처했고, 다음 3장을 추가했다.

| 파일 | 화면 |
| --- | --- |
| `home-mobile-landscape-667.jpg` | R2: 667×375 가로 화면 — 정지 버튼이 헤더 아래 첫 화면에 표시 |
| `home-mobile-landscape-844.jpg` (갱신) | R2: 844×390 가로 화면 |
| `home-mobile-text200-390.jpg` | R1: 390px 글자 200% (전체 페이지) — 제목이 커지고 줄바꿈 |
| `home-desktop-text200-1440.jpg` | R1: 1440px 글자 200% — `DE-` / `SIGNED` 줄바꿈 |

글자 200% 캡처는 html `font-size` 변경으로 재현한 것이다.

## 미검증 · 남은 사항 (검토 대응)
- 실제 브라우저의 "글자 크기" 설정(크롬 설정의 글꼴 크기, iOS 동적 글자 크기)과 실제 확대 기능은 직접 조작해 보지 않았다(html 크기 변경으로 재현).
- 대문자 단어 자동 하이픈은 브라우저가 적용하지 않아, 최종 헤드라인에 긴 단어가 있으면 `\u00AD`로 끊을 위치를 직접 넣어야 한다(README 안내). 넣지 않아도 넘치지는 않지만 마지막 글자 하나만 다음 줄로 갈 수 있다.
- 낮은 가로 화면에서는 `Scroll` 안내를 숨긴다(같은 기능의 `작업물 보기` 버튼 유지).
- 검토 문서의 미검증 항목(실제 모바일, Safari, 탭 숨김, 데이터 절약)은 그대로 남아 있다.
- 기획 변경 제안: 없음.

---

# REQ-004 기록

## 요약 (REQ-004)
- 작업 날짜: 2026-10-04
- 요청: docs/REQUESTS.md의 "REQ-004 제안: 확대 상태 영상 제어와 헤드라인 교체 구조" (사용자 시작 지시 2026-10-04)
- 범위: ① 글자 확대 상태의 영상 제어 접근성 ② 헤드라인 교체 데이터 구조. **제외:** 정확한 2배 확대, 실기기 검증, 최종 헤드라인·영상·컬러 결정, 새 영상 제작, 배포
- 기반: PR #1·#2 병합 후 최신 main(`434251e`)
- 실제 공개 콘텐츠(헤드라인 문구)는 바꾸지 않았다. 임시 헤드라인의 soft hyphen 위치만 조정(아래 참고).

## 병합 진행 (사용자 지시 1~3단계)
| 단계 | 결과 |
| --- | --- |
| 1. 로컬 REQUESTS.md(병합 절차·REQ-004 제안)를 PR #2 브랜치에 커밋·푸시 | `8a28905` (원본 그대로) |
| 2. PR #1 병합 (merge commit) | 병합 전 확인: 충돌 없음(`mergeable_state=clean`), 저장소 CI 검사 없음(check-run 0), main 보호 규칙 없음. head `8d1d372` 고정 조건으로 병합 → merge commit `0b7bb37` |
| 3. PR #2 base를 main으로 변경 후 병합 | base 변경 후 `clean`. 커밋 9개 모두 REQ-002·003·검토 대응·문서(REQ-001 중복 없음), 파일 44개. 로컬 `git merge-tree`로 충돌 없음 및 **병합 결과 트리 = PR #2 head 트리** 확인 → 마지막 브라우저 점검(`e49c8dc`) 이후 변경은 문서 2개뿐. `npm run check`(오류 0)·`npm run build` 성공 후 head `8a28905` 고정 조건으로 병합 → merge commit `434251e` |
| 강제 푸시 | 하지 않음 |

- 병합 도중 GPT/사용자가 로컬 REQUESTS.md에 **REQ-005**(사용자 제공 4Ground9 영상 두 개를 메인 배경으로 연결)를 추가했다. 이번 지시 범위가 아니므로 **구현하지 않았고**, 문서만 REQ-004 브랜치에 원본 그대로 별도 커밋(`d8ed722`)했다.

## 브랜치 · 커밋 · PR (REQ-004)
- 브랜치: `feature/req-004-zoom-controls-headline` (main `434251e`에서 시작)
- 커밋
  - `d8ed722` docs: REQ-005 요청 추가 (REQUESTS 원본 그대로, 구현 안 함)
  - `6fb566d` feat: REQ-004 확대 상태 영상 제어 접근성, 헤드라인 언어 구조
  - 이 STATUS·README 기록 커밋
- PR: #3 (base `main`) — 생성 후 아래 응답에 링크
- 자동 병합·외부 배포: 하지 않음

## 구현 (REQ-004)
### ① 글자 확대 상태의 영상 제어 접근성
- `SAMPLE VIDEO`·재생/정지 버튼을 **모든 화면에서 히어로 맨 위(헤더 바로 아래) 오른쪽**에 둔다. 이전(REQ-003)에는 하단, 낮은 가로 화면에서만 상단이었다.
- CSS `order`가 아니라 **HTML 순서 자체를 옮겨** 보이는 순서와 키보드 이동 순서가 같다: 헤더 메뉴 → 영상 제어 → 제목 → 소개 → 작업물 보기 → Scroll. (R2 대응 때 쓰던 `order: -1`과 낮은 화면의 Scroll 숨김 규칙은 제거)
- 문서 흐름 안에 있어 다른 요소를 가리지 않고, 사이트 전체를 따라다니는 고정 버튼이 아니다. 제목은 줄이지 않았고, 브라우저 확대율 감지도 쓰지 않는다.
- 44×44px, 정지 상태 기억, 모션 줄이기, 화면 밖·탭 숨김 정지, 포스터 대체 동작은 그대로다.

### ② 헤드라인 교체 데이터 구조
- `src/data/hero.ts`: `titleLang`(제목 기본 언어, 기본 `'en'`) 추가. `titleLines`의 각 줄은 문자열 또는 `{ text, lang }`(줄별 언어).
- `Hero.astro`: `<h1 lang={titleLang}>`, 기본 언어와 다른 줄만 `<span lang>`. 한글 줄(`:lang(ko)`)은 시스템 한글 글꼴로 표시되므로 줄 간격 1.15·자간 -0.01em·띄어쓰기 단위 줄바꿈.
- soft hyphen은 영문 긴 단어의 **선택적 줄바꿈 힌트**로만 다룬다. 임시 헤드라인은 `'DE\u00ADSIG\u00ADNED'`로 조정했다 — 390px 글자 200%에서 `SIGNE` / `D`로 끊기던 것이 `DE-` / `SIG-` / `NED`가 됨. 기본 글자 크기에서는 한 줄이라 보이지 않는다.
- README에 영문/한글/혼합 교체 예, 한글 글꼴 대체, soft hyphen 지정 방법을 추가했다.

## 주요 변경 파일 (REQ-004)
| 파일 | 내용 |
| --- | --- |
| `src/components/Hero.astro` | 영상 제어를 HTML상 히어로 맨 위로 이동, 제목 언어 렌더링, 한글 줄 스타일, 낮은 화면 전용 이동 규칙 제거 |
| `src/data/hero.ts` | `TitleLine` 타입, `titleLang`, 교체 예시 주석, soft hyphen 위치 |
| `scripts/verify.mjs` | REQ-004 검사(제어 첫 화면 14개, 순서 2개, 헤드라인 24개) 추가 |
| `scripts/screenshots.mjs`, `docs/screenshots/*` | 글자 200%·가로 200%·한글 임시 헤드라인 캡처 추가, 전체 갱신 |
| `README.md` | 헤드라인 교체(언어·한글 글꼴·soft hyphen), 영상 제어 위치 안내 |

## 검증 결과 (REQ-004)
환경: Windows 10, Node 24.19, Playwright 1.63. 실제 모바일 기기가 아닌 화면 크기·터치 에뮬레이션. 글자 200%는 html `font-size` 변경으로 재현(실제 브라우저 확대 기능의 완전한 대체 아님).

| 항목 | 결과 |
| --- | --- |
| `npm run check` | 오류 0, 경고 0 |
| `npm run build` | 성공 (5페이지) |
| `npm run verify` Chromium | **309/309 통과** (REQ-004 40개 추가) |
| `npm run verify` Firefox | **309/309 통과** |
| `npm run verify` WebKit | **302/302 통과** (영상 재생 확인 7개는 Windows 테스트 빌드 제약으로 포스터 대체 확인. Tab 순서는 이 빌드에서 Tab 이동이 안 되어 HTML 순서로 대체 확인) |

**① 첫 화면 정지 버튼 (Chromium 값, 세 브라우저 통과)**

| 화면 | 기본 top·bottom | 글자 200% top·bottom |
| --- | --- | --- |
| 320×568 | 72·116 | 254·298 (헤더·SAMPLE 표시가 줄바꿈되어 내려감, 화면 안) |
| 390×844 | 72·116 | 147·191 |
| 768×1024 | 72·116 | 147·191 |
| 1440×900 | 72·116 | 147·191 |
| 1920×1080 | 72·116 | 147·191 |
| 667×375 | 68·112 | 139·183 |
| 844×390 | 68·112 | 139·183 |

14개 상태 모두 스크롤 없이 화면 안·헤더 아래, 44×44px, 헤더·제목·소개·CTA·Scroll·SAMPLE과 겹침 없음.

**① 순서:** 1440px·390px에서 HTML 순서(헤더 → 영상 제어 → 제목·CTA)와 시각 순서 일치, Chromium·Firefox에서 Tab 이동 헤더 마지막 요소(데스크톱 Contact, 모바일 메뉴 버튼) → 영상 제어 → CTA 확인.

**② 헤드라인 임시 데이터 (24개 = 4종 × 320·390·1440px × 기본/글자 200%)**
- 영문 짧음 `UI / FOR PLAY`, 영문 긴 단어 `INTERACTIVE / EXPERIENCE / ARCHI-TECTURE`, 한글 `플레이를 / 설계하는 / 게임 UI 디자이너`(`lang="ko"`), 혼합 `GAME UI` + `인터페이스 디자이너`(줄만 `lang="ko"`)
- 모두 제목 크기가 기본 규칙과 같음(자동 축소 없음), 가로 넘침 없음, 줄별 `lang` 정확, 한글 줄 줄 간격 1.15, 정지 버튼 첫 화면·겹침 없음.
- 실제 `hero.ts` 데이터는 바꾸지 않고, 화면에서만 컴포넌트와 같은 마크업으로 바꿔 넣어 검사했다.

**스크린샷 (`docs/screenshots/`, 전체 갱신 + 추가)**

| 파일 | 내용 |
| --- | --- |
| `home-mobile-text200-390.jpg` | 390px 글자 200% 첫 화면 — 정지 버튼이 헤더 아래, 제목 `DE-/SIG-/NED` 줄바꿈 |
| `home-mobile-text200-390-full.jpg` | 같은 상태 전체 페이지 |
| `home-mobile-landscape-844-text200.jpg` | 844×390 글자 200% 첫 화면 |
| `home-desktop-text200-1440.jpg` | 1440px 글자 200% |
| `fixture-headline-ko-390.jpg`, `fixture-headline-ko-1440.jpg` | **검증용 임시 한글 헤드라인**(실제 콘텐츠 아님) |
| 그 외 `home-*`, `detail-*` | 영상 제어가 상단으로 옮겨진 현재 화면 |

## 미검증 · 남은 사항 (REQ-004)
- 실제 브라우저 확대 기능, 크롬·iOS 글자 크기 설정, 실제 모바일 기기, Safari 영상 재생, 화면 낭독기 — 미검증 (요청대로 실기기 검증 제외).
- 정확한 2배 확대는 요청대로 제외 (현재 1.67~1.92배).
- 한글 헤드라인은 시스템 글꼴(맑은 고딕 등)로 표시되어 영문 제목(Zalando Sans Expanded)과 인상이 다르다. 최종 문구 언어는 사용자 결정 사항.
- REQ-005(사용자 제공 4Ground9 영상)는 요청 문서만 보존했고 구현하지 않았다. 히어로 영상은 여전히 RPG 샘플이다.
- 기획 변경 제안: 없음.

---

# REQ-006 기록

## 요약 (REQ-006)
- 작업 날짜: 2026-10-04
- 요청: docs/REQUESTS.md의 "REQ-006: PERCEPT 참고 입장·스크롤 안내·전체 화면 메뉴 모션" (사용자 지시: REQ-004·005 진행 변경 보존 후 이어서 적용, 입장·메뉴 모션은 짧은 화면 녹화)
- 참고 사이트의 로고·3D 모델·문구·카드·영상·주황색은 가져오지 않았다. 구조와 움직임의 인상만 반영했다.
- 시간값은 REQUESTS의 제안값을 사용했다(원본 사이트 측정값 아님).

## 진행 순서와 보존 (REQ-006)
- **REQ-004 보존:** 미커밋이던 REQ-004 구현을 REQ-004 브랜치에 커밋(`6fb566d`, `d90900d`)하고, 중단됐던 WebKit 점검을 다시 실행(302/302)한 뒤 **PR #3**(base `main`)으로 올렸다.
- **REQ-005:** 요청 문서만 원본 그대로 보존(`d8ed722`)되어 있고 **구현된 적이 없다.** REQ-006 요청은 "REQ-005의 4Ground9 영상 유지"를 전제하지만, 현재 히어로 영상은 여전히 RPG 샘플이다. 이번에도 REQ-005는 구현하지 않았다.
- **REQ-006 브랜치:** `feature/req-006-intro-menu-motion` — REQ-004 브랜치 위에서 시작(PR #3 위에 쌓은 PR). REQ-006 요청 문서는 원본 그대로 별도 커밋(`5f8fb34`).
- 커밋: `5f8fb34` REQ-006 요청 문서 → 구현 커밋 → 이 기록 커밋 (PR 설명 참고)
- PR: #4 (base `feature/req-004-zoom-controls-headline` — PR #3 병합 후 base를 `main`으로 변경). 자동 병합·외부 배포 안 함

## 구현 (REQ-006)
### 1. 첫 진입 오픈 애니메이션 — `src/components/Intro.astro`, `src/pages/index.astro`
- 검정 커버 가운데 `site.name` → 위로 걷힘 → 히어로 제목 각 행이 아래에서 순차 등장 → 헤더·소개·CTA·영상 제어·SCROLL DOWN 등장.
- 타임라인: 0~200ms 텍스트, 200~650ms 커버, 450~990ms 제목 행(70ms 간격), 650~1100ms 나머지. **CSS 애니메이션 전체 1.1초**.
- 실행 여부는 `<head>` 인라인 스크립트가 **첫 화면을 그리기 전에** 결정 — 같은 탭 세션 첫 메인 진입만(`sessionStorage`), 앵커(`#works`) 진입·뒤로가기(`back_forward`)·사이트 안에서 이동해 온 경우(같은 출처 referrer)·모션 줄이기·저장소 사용 불가면 생략.
- 갇힘 방지: 커버는 CSS만으로 스스로 걷힌다. JS 모듈이 1.3초, head 스크립트가 1.6초에 클래스를 정리하는 이중 안전장치. JS가 꺼지면 클래스가 붙지 않아 본문이 그대로 보인다. 영상 로드를 기다리지 않는다.
- 클릭·키보드·휠·터치 입력 시 즉시 종료 상태. 제목은 기존 줄(span) 단위로만 움직여 글자가 쪼개져 읽히지 않고 언어·줄바꿈 데이터(REQ-004)도 그대로.
- 새 3D 모델은 만들지 않았다.

### 2. 왼쪽 아래 SCROLL DOWN — `src/components/Hero.astro`
- 1px 세로 트랙(흰색 25%) + `SCROLL`/`DOWN` 2행. 트랙 안에서 흰 선이 위→아래로 지나가는 1.8초 루프 **3회 후 정지**(1.1초 지연, 입장 연출 이후). 글자는 움직이지 않는다.
- 히어로가 화면 밖이면 `animation-play-state: paused`. 모션 줄이기면 모션 없이 정지 표시.
- `#works` 링크, 접근 가능한 이름 "Scroll Down — 작업물 목록으로 이동", 44px 이상, 스크롤 가로채기 없음. 낮은 가로 화면에서도 표시(REQ-004 정지 버튼은 상단이라 충돌 없음).

### 3. 상단 내비게이션·3선 버튼 — `src/components/Header.astro`
- 모든 화면: 왼쪽 이름, 오른쪽 길이가 다른 가는 3선 버튼(26·18·10px, 1.5px, 오른쪽 정렬). 기존 데스크톱 펼침 메뉴와 640px 미만 메뉴 버튼을 이 구성으로 대체.
- hover/focus 180ms에 세 선이 같은 길이로 정돈, 열림 상태는 X. 44×44px, `aria-expanded`, `aria-controls="site-menu"`, 이름 "메뉴 열기"/메뉴 안 "메뉴 닫기".
- 중앙 캡슐 메뉴는 추가하지 않았다.

### 4. 전체 화면 메뉴 — `src/components/Header.astro`
- 모달 `<dialog>`(`showModal`) — 배경 inert, 메뉴 안 Tab 순환, Escape(cancel 이벤트를 같은 닫기 동작으로)와 닫기 버튼. 메뉴 상단 바에 이름과 X 버튼을 헤더와 같은 위치·폭으로 두어 열어도 위치가 바뀌지 않는다.
- 배경: 검정 72% + `blur(10px) grayscale(1)`(260ms). 블러 미지원 시 검정 94%.
- 내용: Works / About / Contact 3개(번호 01~03은 장식). PC는 왼쪽 큰 메뉴 + 오른쪽 보조 칼럼(직무, 한 줄 소개), 모바일은 단일 열. 보조 칼럼의 연락처는 `site.contactIsSample`이 `false`일 때만 — 현재 임시 연락처라 **표시하지 않음**.
- 메뉴가 화면보다 길면 패널 안에서만 스크롤, 상단 바(닫기)는 sticky로 항상 접근. 세이프 영역(`env(safe-area-inset-*)`) 반영.
- 모션: 열림 — 배경 260ms, 항목 24px 아래에서 올라오며 opacity 0→1, 320ms, 지연 120/190/260ms(70ms 간격), 보조 칼럼 300ms → 전체 약 580ms. 닫힘 — 200ms, 간격 없음, 220ms 후 정리.
- 상태 관리(닫힘/여는 중/열림/닫는 중)로 빠른 연속 클릭·열림 도중 Escape에도 최종 상태·스크롤 잠금·초점이 맞는다.
- 닫으면 연 시점의 스크롤 위치와 메뉴 버튼 초점 복원. 메뉴 항목 선택 시 메뉴를 닫고 목적지로 이동한 뒤 **목적지 제목에 초점**(버튼으로 되돌리지 않음). 상세에서는 메인의 해당 앵커로 이동.
- 메뉴가 열린 동안 배경 영상 임시 정지, 닫으면 사용자 재생 의사·모션 줄이기·화면 가시성에 따라 복원. 자동 정지는 저장하지 않는다.
- 모션 줄이기: 항목 이동 없이 120ms 페이드, 닫기는 즉시. 메뉴 기능은 그대로.

### 기타
- `src/data/site.ts`: `contactIsSample`(임시 연락처 여부) 추가.
- 애니메이션 라이브러리·3D 라이브러리는 추가하지 않았다(CSS transform/opacity, 기존 dialog).

## 주요 변경 파일 (REQ-006)
| 파일 | 내용 |
| --- | --- |
| `src/components/Header.astro` | 3선 버튼, 전체 화면 메뉴(dialog), 열림/닫힘 상태 관리, 앵커 이동·초점, 영상 임시 정지 이벤트 |
| `src/components/Intro.astro` (신규) | 입장 커버·애니메이션 CSS·입력 시 건너뛰기 |
| `src/pages/index.astro` | 입장 실행 여부 head 스크립트, `<Intro />` |
| `src/components/Hero.astro` | SCROLL DOWN, 제목 행 순서(`--i`), 화면 밖 표시, 메뉴 열림 시 영상 임시 정지 |
| `src/data/site.ts` | `contactIsSample` |
| `scripts/verify.mjs` | 메뉴 관련 기존 검사를 새 메뉴로 갱신, REQ-006 검사 추가, 기본 검사는 입장 생략 |
| `scripts/screenshots.mjs` | 입장 생략 후 캡처, 메뉴 최종 상태 캡처 추가 |
| `scripts/record-motion.mjs` (신규), `docs/recordings/*.webm` | 입장·메뉴 모션 화면 녹화 |
| `README.md` | 입장·메뉴 수정 방법, `contactIsSample`, 공개 전 목록, 기능 요약 |

## 검증 결과 (REQ-006)
환경: Windows 10, Node 24.19, Playwright 1.63. 실제 모바일 기기가 아닌 화면 크기·터치 에뮬레이션. 글자 200%는 html `font-size` 변경으로 재현.

| 항목 | 결과 |
| --- | --- |
| `npm run check` | 오류 0, 경고 0 (22 files) |
| `npm run build` | 성공 (5페이지) |
| `npm run verify` Chromium | **347/347 통과** |
| `npm run verify` Firefox | **347/347 통과** |
| `npm run verify` WebKit | **338/338 통과** (영상 재생 확인·영상 임시 정지·Tab 순환은 Windows 테스트 빌드 제약으로 제외/대체) |

**입장 연출**
- 첫 방문: 커버 표시 → CSS 연출 타임라인 **1100ms**(세 브라우저 동일, 기준 1300ms 이하). 페이지 요청을 포함한 관측 완료 1220~1247ms, 클래스 정리 1355~1406ms.
- 생략 확인: 같은 탭 새로고침, 상세 → 로고로 메인 복귀, `#works` 직접 진입, 뒤로가기.
- 클릭하면 즉시 종료. JS 꺼짐 → 커버 없이 본문. 저장소 차단 → 갇히지 않고 본문. 모션 줄이기 → 생략. 영상 로드 실패 → 정상 종료.
- 입장 후 글자 200% 390×844·844×390에서 넘침·겹침 없음.

**SCROLL DOWN:** 왼쪽 아래·이름 "Scroll Down…"·44px 이상·`#works`·1.8초 × 3회, 히어로가 화면 밖이면 `paused`, 클릭하면 Works 이동, 모션 줄이기면 애니메이션 없음.

**전체 화면 메뉴**
- 320×568·390×844·768×1024·1440×900·1920×1080·667×375·844×390 × 기본/글자 200%(14개 상태): 메뉴 버튼·닫기 버튼 44px·화면 안, 패널을 스크롤해도 닫기 버튼 유지, 항목 3개 모두 접근, Esc 후 닫힘·스크롤 잠금 해제·버튼 초점 복원.
- 열림 모션: 항목 지연 0.12s·0.19s·0.26s(70ms 간격), 열리는 중간에는 불투명도 1 미만, 최종 1, `:modal`(배경 inert).
- Tab 순환(Chromium·Firefox), 임시 연락처 미노출, 빠른 연속 클릭·열림 도중 Esc 후 상태 일관, 닫으면 스크롤 위치(700px) 복원, Contact 선택 → 닫힘·`#contact`·`contact-title`에 초점, 상세에서 메인 `#works` 이동.
- 영상: 열면 임시 정지 → 닫으면 재생 복원(정지 상태 저장 안 함), 사용자가 멈춘 경우 닫아도 정지 유지 (Chromium·Firefox).
- 모션 줄이기: 항목 이동 없이 열림, Esc 즉시 닫힘·초점 복원.
- 기존 메뉴 관련 검사(모바일 메뉴, 데스크톱 메뉴, 히어로 위 메뉴, 글자 200% 메뉴, REQ-004 순서)는 새 메뉴 기준으로 갱신해 통과.

**점검 중 바로잡은 것 (테스트 쪽)**
- Playwright의 `click()`은 sticky 헤더 버튼을 화면에 맞추려고 페이지를 스크롤해서(700px → 292px) 스크롤 복원 검사가 실패했다. 사이트 코드는 정확히 700px로 복원함을 확인했고, 이 검사만 스크롤 없는 클릭으로 바꿨다.

**녹화 · 스크린샷**
| 파일 | 내용 |
| --- | --- |
| `docs/recordings/motion-desktop-1440.webm` (9.4초, 1.1MB) | 첫 방문 입장 → 메뉴 버튼 hover → 메뉴 열림·유지 → 닫기 → 다시 열어 Works 이동 |
| `docs/recordings/motion-mobile-390.webm` (0.6MB) | 같은 순서(모바일, hover 제외) |
| `docs/screenshots/menu-open-desktop-1440.jpg` | PC 메뉴 최종 상태 |
| `docs/screenshots/home-mobile-menu-390.jpg` | 모바일 메뉴 최종 상태 |
| `docs/screenshots/menu-open-landscape-844.jpg` | 모바일 가로 메뉴 |
| `docs/screenshots/menu-open-detail-768.jpg` | 상세 페이지에서 연 메뉴 |
| 그 외 `docs/screenshots/*` | 3선 버튼·SCROLL DOWN이 반영된 현재 화면(입장 연출 이후 상태) |

녹화는 Chromium(Playwright) 화면 녹화이며 25fps라 실제 화면보다 덜 부드럽게 보일 수 있다.

## 미검증 · 가정 · 남은 사항 (REQ-006)
- **미검증:** 실제 모바일 기기(세이프 영역·주소창 높이 변화 포함), Safari의 `backdrop-filter`·영상, 화면 낭독기에서 메뉴 모달 읽기, 실제 브라우저 확대 기능.
- **가정:** 입장 텍스트는 `site.name`("Your Name", 미확정 이름 그대로). 메뉴 보조 칼럼 소개는 `site.jobTitle` + `hero.description`. 연락처는 `contactIsSample: true`라 숨김.
- **가정:** "사이트 안에서 이동해 온 경우"를 같은 출처 referrer로 판단 — 다른 사이트에서 들어온 첫 방문, 주소 직접 입력은 연출 실행.
- 메뉴 항목 번호(01~03)는 장식이며 화면 낭독기에는 읽히지 않는다.
- REQ-005(사용자 제공 4Ground9 영상)는 여전히 미구현 — 착수하려면 별도 지시가 필요하다.
- 기획 변경 제안: 없음.

---

# PR #4 검토 대응 (docs/REVIEW-PR-003-004.md R1·R2)

## 요약 (R1·R2)
- 작업 날짜: 2026-10-04
- 검토: `docs/REVIEW-PR-003-004.md` (Codex) — REQ-004는 추가 수정 없음, REQ-006은 R1 수정 후 종료 권고, R2는 사용자 추가 디자인 요청.
- 커밋: `4eaf821` 검토 문서(원본 그대로) · `7eb2153` REQ-007 요청 문서(원본 그대로, **구현 안 함**) · `ac2b389` R1 · `e8eac00` R2 · 이 기록 커밋. 모두 PR #4 브랜치.
- 진행 중 GPT/사용자가 REQUESTS.md에 **REQ-007**(Odyssey 블루 키컬러, SCROLL DOWN 지속 루프)을 추가했다. 이번 지시(R1·R2) 범위가 아니므로 문서만 보존했다. 현재 SCROLL DOWN은 REQ-006대로 3회 후 정지, 색은 블랙·화이트 그대로다.

## R1 — 상세 → 메인 앵커 이동 후 목적지 제목 초점
- **원인:** 초점 처리가 같은 페이지 분기에만 있었다. 또 실제로 확인해 보니, 새 문서에서 바로 초점을 줘도 브라우저가 DOM 준비 직후 주소의 앵커(`#works`)로 이동하면서 초점을 초기화했다(focusin 45ms → focusout 50ms, Chromium 추적).
- **수정 (`src/components/Header.astro`):**
  - 상세 페이지 메뉴에서 메인 앵커를 고르면 이동 직전에 `sessionStorage`에 목적지(`경로+해시`)를 남긴다.
  - 메인에서 표시가 현재 주소와 같고 뒤로가기가 아니면, 앵커 처리가 끝난 뒤(`load` 다음 프레임, 대비책 600ms) 목적지 제목(h2)에 초점. 그 사이 사용자가 다른 곳에 초점을 옮겼으면 빼앗지 않는다.
  - 표시는 한 번 읽으면 지운다 → 앵커 직접 진입·뒤로가기·새로고침에는 초점을 옮기지 않는다. 저장소를 쓸 수 없으면 이동만 한다.
- **경로별 동작 정리**

| 경로 | 동작 |
| --- | --- |
| 메인 안에서 메뉴 → Works/About/Contact | (기존) 메뉴 닫힘 → 부드럽게 스크롤 → 목적지 제목 초점 |
| 상세에서 메뉴 → 메인 Works/About/Contact | (R1) 메인 문서 로드 → 앵커 위치 → 목적지 제목 초점 |
| 메인 앵커 주소 직접 입력(`/#works`) | 초점 이동 없음, 입장 연출 생략(기존) |
| 뒤로가기로 메인 앵커 복귀 | 초점 이동 없음 |

- BASE_PATH: 목적지를 `location.pathname + hash`로 비교하므로 하위 경로에서도 같다.

## R2 — 대형 화면 배치 폭 (사용자 추가 요청)
- **원인:** 헤더·히어로·메뉴가 공통 `.container`(최대 80rem ≈ 1280px, 가운데 정렬)를 써서 넓은 화면에서 가운데로 몰렸다.
- **수정:**
  - `src/styles/tokens.css`: `--gutter-wide: clamp(1rem, 4vw, 10rem)`
  - `src/styles/global.css`: `.container-wide` — 최대 폭 없음, 좌우 `max(--gutter-wide, 세이프 영역)`
  - 헤더 안쪽·메뉴 상단 바·메뉴 본문, 히어로 제어 줄·본문·하단 줄에만 적용. 메뉴 패널의 좌우 세이프 영역은 `.container-wide`로 옮겨 중복 여백을 없앴다.
  - 3선 버튼 `margin-right: -9px` — 26px 선이 44px 버튼 가운데에 있으므로 선의 오른쪽 끝이 오른쪽 여백 선과 일치.
  - 제목 크기 규칙(최대 10rem)·3행·왼쪽 정렬, 프로젝트 목록·상세 본문의 `.container`(1280px)는 그대로.
- **측정값 (Chromium, deviceScaleFactor 1, CSS px)**

| CSS viewport | 여백(--gutter-wide) | 왼쪽 선 (로고·제목·소개·CTA·SCROLL·메뉴 로고·메뉴 링크) | 오른쪽 선 (3선·영상 제어) | 카드 목록 폭 |
| --- | --- | --- | --- | --- |
| 320×568 | 16 | 모두 16 | 일치 | 273 |
| 390×844 | 16 | 모두 16 | 일치 | 342 |
| 1440×900 | 57.6 | 모두 57.6 | 1367.4 (= 1425 − 57.6) | 1280 |
| 1920×1080 | 76.8 | 모두 76.8 | 일치 | 1280 |
| 2560×1440 | 102.4 | 모두 102.4 | 일치 | 1280 |
| 3840×2160 | 153.6 | 모두 153.6 | 일치 | 1280 |

  - 오른쪽 선은 `scrollbar-gutter: stable`로 예약된 스크롤바 공간(헤드리스 Chromium 15px)을 뺀 레이아웃 폭 기준이다.
  - 메뉴를 열어도 닫기 버튼·로고 위치가 메뉴 버튼·헤더 로고와 같다(모든 폭).
  - X(닫기) 선은 45° 회전이라 사각형 끝이 3.3px 안쪽으로 측정되지만 버튼 위치는 같다.
- 사용자가 첨부한 화면 이미지의 픽셀 크기를 CSS 폭으로 단정하지 않았다. 캡처는 모두 CSS viewport = 캡처 픽셀(DSF 1).

## 검증 (R1·R2)
환경: Windows 10, Node 24.19, Playwright 1.63. 실제 기기가 아닌 화면 크기 에뮬레이션.

| 항목 | 결과 |
| --- | --- |
| `npm run check` | 오류 0 (23 files) |
| `npm run build` | 성공 (5페이지) |
| `npm run verify` Chromium | **356/356 통과** (R1 4개·R2 6개 반영) |
| `npm run verify` Firefox | **356/356 통과** |
| `npm run verify` WebKit | **347/347 통과** (영상 재생·영상 임시 정지·Tab 순환은 Windows 테스트 빌드 제약으로 제외/대체) |

**새로·바뀐 검사**
- R1: 상세 → 메인 Works·About·Contact 각각 실제 `document.activeElement`가 `works-title`·`about-title`·`contact-title`인지 (주소만 보지 않음). 뒤로가기·앵커 직접 진입에는 제목 초점이 생기지 않는지.
- R2: 320/390/1440/1920/2560/3840px에서 왼쪽 선 7개 요소가 여백 값과 0.6px 이내로 일치, 오른쪽 선 일치, 메뉴 열어도 위치 유지, 카드 목록 ≤ 1280px.
- 기존 회귀(REQ-001~006, 글자 200%, 667×375·844×390 영상 제어 첫 화면, 메뉴 14개 상태 등)는 그대로 통과해야 한다.
- 테스트 정리: 세션 중단으로 R2 검사 블록이 두 번 들어가 있던 것을 하나로 정리. R1 Works 검사가 초점 전달 전에 값을 읽던 순서 오류 수정.

**스크린샷 (`docs/screenshots/`, 전체 갱신)**

| 파일 | 내용 |
| --- | --- |
| `wide-home-1920.jpg`, `wide-home-2560.jpg`, `wide-home-3840.jpg` | 넓은 화면 히어로 — 왼쪽·오른쪽 선 |
| `wide-menu-1920.jpg`, `wide-menu-2560.jpg`, `wide-menu-3840.jpg` | 넓은 화면 열린 메뉴 (캡처용으로 JS 클릭을 써서 첫 항목에 키보드 초점 외곽선이 보임) |
| `home-desktop-1440.jpg`, `menu-open-desktop-1440.jpg` | 1440px |
| `home-mobile-390.jpg`, `home-mobile-landscape-667/844.jpg`, `home-mobile-text200-390.jpg` 등 | 모바일·가로·글자 200% 회귀 |

## 미검증 · 남은 사항 (R1·R2)
- 실제 모니터(4K 등)·실기기·화면 낭독기에서의 확인은 하지 않았다. 3840px는 CSS viewport 3840 에뮬레이션이다.
- 화면 낭독기가 메인 로드 직후 제목 초점을 어떻게 읽는지는 미검증.
- REQ-005(4Ground9 영상)·REQ-007(블루 키컬러·지속 루프)은 미구현.
- 기획 변경 제안: 없음.

---

# REQ-005 기록

## 요약 (REQ-005)
- 작업 날짜: 2026-10-04
- 요청: docs/REQUESTS.md "REQ-005: 사용자 제공 4Ground9 영상 두 개를 메인 배경으로 연결" (사용자 지시 "다 진행해줘")
- 선행 처리(같은 지시): PR #4 재검토 문서 커밋(`60c3e9d`)·캡처 스크립트 타입 힌트 정리(`1761bfb`) → **PR #3 병합**(merge commit `cfebf4d`) → PR #4 base를 main으로 변경, 커밋 10개·파일 41개·충돌 없음·병합 결과 트리 = PR #4 head 확인, 마지막 3개 브라우저 점검 이후 변경은 문서·캡처 스크립트뿐 → **PR #4 병합**(`70ffce0`). 강제 푸시 없음.
- 브랜치: `feature/req-005-4ground9-hero-video` (main `70ffce0`에서 시작)
- 커밋: 영상·포스터·데이터 연결(feat) → 메뉴 pageshow 버그 수정(fix) → 이 기록(docs). PR #5 (base `main`), 자동 병합·배포 안 함

## 구현 (REQ-005)
- **영상 확인:** 편집 전에 두 원본의 프레임을 2초·1.5초 간격으로 뽑아 내용을 확인했다 — 각각 "HWANG HYUNWOO PORTPOLIO / CHARATER INTRODUCE SQ", "PV OPENNING SQ" 타이틀 화면으로 시작하는 캐릭터·코믹 스타일 모션그래픽.
- **제작:** 원본 순서대로 전체를 단순 컷 연결, 오디오 제거, 30fps, MP4 H.264(yuv420p, faststart). 발췌·재구성·타이틀/로고 제거 없음. 원본은 수정·이동하지 않았고 저장소에 넣지 않았다.

| 파일 | 해상도 | 길이 | 크기 | 설정 |
| --- | --- | --- | --- | --- |
| `public/videos/4ground9-hero-1080.mp4` (데스크톱) | 1920×1080 | 37.57초 | 10.6MB | 2-pass 2400kbps |
| `public/videos/4ground9-hero-720.mp4` (모바일) | 1280×720 | 37.57초 | 5.3MB | 2-pass 1200kbps |
| `src/assets/hero/4ground9-poster.jpg` (포스터) | 1920×1080 | — | 111KB | 프레임 330(11.0초) |

- **크기 결정:** CRF 26 16.9MB, CRF 28 13.2MB로 목표(PC 약 12MB)를 넘어 2-pass를 택했고, 작은 글자가 있는 같은 장면 확대 비교에서 CRF 28과 차이가 거의 없음을 확인. 모바일 CRF 27은 7.7MB로 목표(약 6MB) 초과 → 2-pass 1200kbps.
- **사이트 연결 (`src/data/hero.ts`):** `videoDesktop`·`videoMobile`을 새 파일로, 포스터 교체, `sampleLabel` 제거(SAMPLE VIDEO 표시 없음), 모바일 초점 `50% 50%`. 기존 RPG 샘플 영상은 RPG 상세에서 쓰므로 삭제하지 않았다.
- **포스터 선택:** 처음엔 영상 시작(0.5초, 타이틀 화면)으로 만들었으나, 그 화면의 "CHARATER INTRODUCE SQ" 글자가 히어로 제목과 겹쳐 영상이 재생되지 않는 환경(모션 줄이기·자동 재생 차단·로드 실패)에서 계속 겹쳐 보였다. 그래서 글자가 적은 게임 내 장면(11.0초)으로 바꿨다. 데스크톱은 인물이 제목 오른쪽, 모바일은 제목 아래로 보인다.
- **유지:** 히어로에만 CSS 흑백 + 검정 오버레이(영상 파일은 원래 색), 무음·반복·playsinline, 정지 기억, 모션 줄이기, 화면 밖·탭 숨김·메뉴 열림 정지, 재생 실패 시 포스터, 화면 크기별 파일 1개만 요청, BASE_PATH, REQ-004 제어 접근성, R2 화면 폭 정렬.
- **제작 기록:** `docs/HERO-VIDEO.md` (출처, 설정, 확인 결과, 다시 만드는 ffmpeg 명령). 인코딩에는 `imageio-ffmpeg`에 포함된 무료 ffmpeg 7.1을 로컬 도구로만 사용했다.

## 영상 자체 확인 (ffmpeg)
- 순서·연결점: 24.23초에 1번 → 2번. 연결로 생긴 검정 프레임 없음.
- 검정 구간: 23.63~24.23초, 26.27~26.40초, 36.43~37.53초 — 원본에서도 같은 위치(1번 끝 페이드, 2번 내부 전환, 2번 끝 페이드)로 확인해 그대로 둠. 반복 시 끝 1.1초 검정 → 첫 타이틀 화면.
- 오디오 트랙 없음.
- **알아 둘 점:** 영상 첫 약 2초(그리고 반복될 때마다)는 원본 타이틀 화면이라 히어로 제목 뒤에 영상 속 글자가 겹쳐 보인다. 흑백·오버레이로 흐려져 제목은 읽히지만, 요청상 타이틀을 지우지 않았다. 필요하면 다음 요청에서 시작 시점을 조정할 수 있다.

## 검증 결과 (REQ-005)
환경: Windows 10, Node 24.19, Playwright 1.63. 화면 크기 에뮬레이션(실제 기기 아님).

| 항목 | 결과 |
| --- | --- |
| `npm run check` | 오류 0, 경고 0, 힌트 0 |
| `npm run build` | 성공 (5페이지) |
| `npm run verify` Chromium | **359/359 통과** |
| `npm run verify` Firefox | **359/359 통과** |
| `npm run verify` WebKit | **357/357 통과** (Tab 순환 2개는 이 빌드에서 Tab 이동이 안 되어 제외) |

**새로·바뀐 검사**
- REQ-005: 1440px는 `4ground9-hero-1080.mp4`, 390px는 `4ground9-hero-720.mp4`만 요청, 길이 37.57초, 무음, 끝 직전으로 이동하면 처음으로 돌아와 계속 재생(반복).
- 히어로: "SAMPLE VIDEO 표시"를 "사용자 제공 영상 — SAMPLE VIDEO 표시 없음"으로 변경. 영상 요청 감시를 mp4·webm 모두로. "영상 파일 없음" 검사는 특정 파일 이름 대신 히어로의 영상 경로를 모두 없는 파일로 바꿔 재현.
- **WebKit:** Windows용 WebKit 테스트 빌드는 WebM(VP8)은 재생하지 못했지만 새 **MP4(H.264)는 실제로 재생**한다. 그래서 그동안 WebKit에서 생략·대체하던 히어로 영상 재생·정지 유지·화면 밖 정지·모션 줄이기 직접 재생·메뉴 임시 정지 검사를 WebKit에서도 실행한다. 단 WebKit은 미디어 요청이 Playwright 요청 감시에 잡히지 않아 사용 파일을 `currentSrc`로 확인하고, 테스트 빌드가 반복 직후 일시정지되는 경우가 있어 반복은 "처음으로 돌아왔는지"로 확인했다.
- **함께 고친 버그 (Header.astro):** 메뉴의 `pageshow` 처리가 일반 첫 로드에도 실행되어, 페이지 로드가 끝나기 전에 연 메뉴가 로드 완료 순간 저절로 닫혔다(영상이 무거워지면서 WebKit 점검에서 발견). 캐시 복원(`persisted`)일 때만 닫도록 수정하고 회귀 검사를 추가했다.
- 점검 도우미: 메뉴 열기를 페이지 안 `click()`으로 바꿔, 바쁜 환경에서 늦게 처리된 클릭이 같은 자리의 닫기 버튼을 누르는 일을 없앴다(실제 포인터 클릭은 다른 검사가 확인).

**스크린샷 (`docs/screenshots/`, 전체 갱신)**
- 히어로가 들어간 모든 캡처(`home-*`, `wide-home-*`, `menu-open-*` 등)가 새 영상 기준. 캡처는 로드 후 약 1.8초 시점이라 영상 첫 타이틀 화면이 함께 찍혔다.
- 포스터 상태(모션 줄이기) 1440·390px는 점검 중 확인했다: 데스크톱은 인물이 제목 오른쪽, 모바일은 제목 아래로 보이고 글자 겹침이 없다.

## 미검증 · 남은 사항 (REQ-005)
- 실제 iPhone Safari·Android Chrome의 자동 재생·데이터 사용량, 실제 회선에서의 로드 시간 — 미검증.
- 영상 첫 약 2초(반복 때마다)는 원본 타이틀 화면이 히어로 제목 뒤에 겹쳐 보인다. 요청대로 타이틀을 지우지 않았다.
- 반복 시 원본 끝의 1.1초 검정 구간을 지나 처음으로 돌아간다.
- 영상에 사용자 이름("HWANG HYUNWOO")이 들어 있고 저장소는 public이다(영상 파일 공개 상태).
- 저장소 크기: 영상 2개 약 16MB 추가.
- 기획 변경 제안: 없음.

# REQ-007 기록

## 요약 (REQ-007)
- The Odyssey 포스터 인상의 낮은 채도 스틸/오션 블루를 사이트 공통 키컬러로 적용했다(블랙·화이트 바탕 유지, 핵심 동작·강조에만).
- SCROLL DOWN을 3회 정지에서 약 1.8초 **연속 루프**로 바꾸고, 히어로 영상 버튼을 **배경 모션 버튼**(영상 + 스크롤 선 함께 제어)으로 확장했다.
- 브랜치 `feature/req-007-blue-scroll-loop` — REQ-005 브랜치(PR #5) 위에 쌓았다. PR #6의 base는 `feature/req-005-4ground9-hero-video`이며, PR #5가 main에 병합되면 base를 main으로 바꾸면 된다. 자동 병합·공개 배포 안 함.

## 최종 토큰 (`src/styles/tokens.css`)
포스터를 보고 정한 근사값이며 픽셀 추출값·영화 공식 색이 아니다.

| 토큰 | 값 | 용도 | 대비 |
| --- | --- | --- | --- |
| `--color-accent` | `#3A6F8C` | 주요 버튼 바탕 | 흰 글자 5.03:1, 검정 배경과 경계 3.61:1 |
| `--color-accent-hover` | `#2D5973` | 주요 버튼 hover 바탕 | 흰 글자 6.91:1 |
| `--color-accent-readable` | `#78A9C6` | 검정 위 링크·라벨·포커스·SCROLL 선·hover | 배경 7.81:1, 카드 표면 7.27:1 |
| `--color-accent-surface` | `#102532` | 어두운 블루 면 (현재 예비) | 흰 글자 14.45:1 |
| `--color-accent-hero` | `#A7CBE1` | 히어로 제목 강조 행 | 영상이 완전히 흰 프레임이어도 오버레이 위 3.36:1 (큰 글자 3:1 이상) |
| `--color-focus` | = accent-readable | 포커스 외곽선 (안쪽 어두운 간격 유지) | — |

**조정 이유:** 제안값 accent `#2D5973`은 흰 글자 대비는 충분하지만 검정 배경과 버튼 경계가 2.63:1로 낮아(비텍스트 3:1 미달) 같은 계열에서 `#3A6F8C`로 밝혔고, `#2D5973`은 hover 바탕으로 쓴다. 히어로 강조 행은 accent-readable(`#78A9C6`)로는 밝은 영상 프레임에서 3:1을 보장하지 못해 한 단계 밝은 `#A7CBE1`을 따로 두었다. readable·surface는 제안값 그대로.

## 적용 위치
- **공통(global.css):** 본문 링크, 텍스트 선택, 섹션 라벨(Works/About/Contact), 주요 버튼(블루 바탕+흰 글자, hover는 진한 블루+밑줄+밝은 테두리), 보조 버튼 hover 테두리, 포커스 외곽선.
- **히어로:** 제목 강조 행(데이터 `{ text: 'FOR PLAY', accent: true }` — 문구에 하드코딩하지 않음, lang·soft hyphen·글자 확대 유지), SCROLL DOWN 선. 히어로 영상 흑백·오버레이는 유지.
- **헤더·메뉴:** 메뉴 버튼 hover/focus, 열린 메뉴의 hover/focus 항목과 번호(기본 항목은 흰색, 어두운 블러 배경 유지).
- **입장 화면:** 가운데 이름.
- **카드:** hover 테두리, hover/focus-within 제목(블루+밑줄).
- **상세:** 목록으로 링크 hover(블루+밑줄), 이전/다음 hover 테두리·제목, 버튼 포커스. 작업물 이미지·영상에는 필터를 씌우지 않음.
- 빨간 날짜 색은 도입하지 않았다. 흰 바탕 보조 요소(본문 바로가기, 상세 영상 재생·확대 버튼)는 기존 inverse 토큰 유지.

## 동작
- **SCROLL DOWN:** 텍스트 고정, 블루 선만 위→아래 이동·페이드, 1.8초 주기 무한 반복. JS가 있을 때만 움직인다(JS가 없으면 정지 수단이 없으므로 정적 표시).
- **정지 조건:** 사용자 정지(저장) / 히어로 화면 밖·탭 숨김·메뉴 열림(임시, 저장 안 함) / 모션 줄이기(반복 없음, 정적 표시).
- **배경 모션 버튼:** 하나의 버튼이 영상과 스크롤 선을 함께 멈추고 재생한다. 이름은 "배경 모션 일시정지 (배경 영상·스크롤 안내)" / "배경 모션 재생 (배경 영상·스크롤 안내)". 기존 `hero-video-paused` 저장 키를 그대로 써서 이전에 영상을 멈춘 방문자는 정지 상태 유지.
- **영상 실패·자동 재생 차단:** 버튼을 비활성화하지 않고 남겨 스크롤 선을 멈출 수 있다(이전에는 실패 시 비활성). 안내 문구도 그에 맞게 수정.
- **영상이 없는 설정(`videoDesktop`·`videoMobile` 모두 비움):** 버튼 자체가 없으므로 정지 수단 없는 무한 반복을 피하려고 SCROLL DOWN은 3회 후 멈춘다(`hero--no-video`). 별도 빌드로 확인: 버튼 없음, 반복 3회, 7.6초 후 종료.
- Works 앵커, 44px 터치 영역, 키보드 초점, R1(앵커 이동 후 제목 초점)·R2(넓은 화면 정렬) 유지.

## 커밋 · PR (REQ-007)
- `61071f6` feat: 블루 키컬러·SCROLL DOWN 연속 루프·배경 모션 제어 (코드·검사·스크린샷·녹화)
- 이 기록 커밋: docs (STATUS·README·REQUESTS 상태)
- PR #6 `feature/req-007-blue-scroll-loop` → base `feature/req-005-4ground9-hero-video` (PR #5 위에 쌓음). 자동 병합·배포 안 함.

## 주요 변경 파일 (REQ-007)
- `src/styles/tokens.css`, `src/styles/global.css` — 토큰과 공통 적용
- `src/data/hero.ts` — `TitleLine`에 `accent`, FOR PLAY 행 강조
- `src/components/Hero.astro` — 강조 행, 연속 루프, 배경 모션 제어 스크립트, 영상 없음 대비
- `src/components/Header.astro`, `Intro.astro`, `ProjectCard.astro`, `src/pages/projects/[slug].astro` — hover/focus·이름 색
- `scripts/verify.mjs` — REQ-007 검사 추가·기존 기대값 변경, 메뉴 열림 최종 상태 대기 보강
- `scripts/screenshots.mjs` — hover/focus 상태 캡처(`act` 훅), `scripts/record-motion.mjs` — 스크롤 루프 녹화

## 검증 결과 (REQ-007)
환경: Windows 10, Node 24.19, Playwright 1.63. 화면 크기 에뮬레이션(실제 기기 아님).

| 항목 | 결과 |
| --- | --- |
| `npm run check` | 오류 0, 경고 0, 힌트 0 |
| `npm run build` | 성공 (5페이지) |
| `npm run verify` Chromium | **367/367 통과** |
| `npm run verify` Firefox | **367/367 통과** |
| `npm run verify` WebKit | **365/365 통과** (Tab 순환 2개 제외, 기존과 같음) |

**새 검사 (3개 브라우저)**
- 색: CTA 블루 바탕+흰 글자, 섹션 라벨·SCROLL 선 readable, 강조 행은 FOR PLAY만 hero 블루·나머지 흰색, 히어로 흑백 유지.
- hover·focus: CTA hover(진한 블루+밑줄+밝은 테두리)·focus(블루 외곽선+어두운 간격), 메뉴 버튼 hover, 카드 테두리·제목, 열린 메뉴 기본 흰색 → hover 항목·번호 블루.
- 연속 루프: 7.6초 후에도 `infinite`·4회째 이상·running.
- 배경 모션 버튼: 영상+선 함께 정지(이름 확인) → 새로고침 후 유지 → 다시 재생.
- 임시 정지: 메뉴 열림·탭 숨김·화면 밖이면 정지, 돌아오면 재개, 저장 안 함.
- 영상 로드 실패: 선은 계속 → 버튼으로 정지 가능.
- 상세: 목록 링크 hover, 버튼 focus 외곽선, 작업물 필터 없음.
- 모션 줄이기: 선 애니메이션 없음(기존 검사 유지).
- **기대값 변경:** SCROLL DOWN 반복 `3` → `infinite`, 버튼 이름, 자동 재생 차단·영상 실패 시 버튼 활성(이전 비활성).
- **검사 보강:** Firefox에서 메뉴 열림 최종 상태가 부하 때문에 0.9994에 걸려 1회 실패 → 고정 700ms 대기를 "모두 1이 될 때까지(최대 1.5초)"로 바꿈. 제품 코드 문제 아님.
- 화면 폭(320/390, 667×375/844×390, 1440/1920/2560/3840, 글자 200%)의 넘침·겹침·제어 접근은 기존 레이아웃 검사가 모두 통과.

**스크린샷 (`docs/screenshots/`, 전체 갱신 + 새 상태 캡처)**
- 기본: `home-*`, `wide-home-*`, `menu-open-*`, `wide-menu-*`, 상세 캡처가 블루 적용 기준으로 갱신.
- 상태: `state-cta-hover-1440`, `state-cta-focus-1440`, `state-card-hover-1440`, `state-menu-hover-1440`, `state-menu-focus-390`, `state-detail-hover-1440`.

**녹화 (`docs/recordings/`)**
- `scroll-loop-desktop-1440.webm`, `scroll-loop-mobile-390.webm` — 입장 연출 없이 9.5초 관찰(정지 직전 5번째 반복 중) → 배경 모션 버튼 → 2.5초 정지 유지. 녹화 중 측정: 정지 직전 iteration 4(0부터), 클릭 후 `paused`.
- `motion-*-1440/390.webm` — 입장·메뉴 녹화도 새 색으로 다시 찍음.
- 사용자 정지 외 조건(화면 밖·탭 숨김·메뉴·모션 줄이기)은 녹화 대신 자동 검사 결과로 남겼다.

## 미검증 · 남은 사항 (REQ-007)
- 실제 기기·실제 화면에서의 색 인상(디스플레이마다 다름), 실제 화면 낭독기의 버튼 이름 낭독 — 미검증.
- 대비는 토큰 값 계산 기준이다. 히어로 강조 행은 영상의 가장 밝은 프레임(흰색)을 가정한 최악값.
- `--color-accent-surface`는 정의만 하고 아직 쓰는 곳이 없다(어두운 블루 면이 필요할 때 사용).
- REQ-005의 남은 사항(영상 첫 2초 타이틀 화면 겹침, 영상 속 사용자 이름, public 저장소)은 그대로.
- 기획 변경 제안: 없음.
