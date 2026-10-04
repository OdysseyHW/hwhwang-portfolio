# 구현 진행 기록
## 현재 상태
- 요청: REQ-001, REQ-002, REQ-003(+확정 보완)
- 상태
  - REQ-001: 구현 완료 · 검토 대기 (PR #1)
  - REQ-002·REQ-003: 구현 완료 · 검토 대기 (PR #2, REQ-001 브랜치 위에 쌓은 PR) → [REQ-002·003 기록](#req-002--req-003-기록)
- 기획: docs/PLAN.md, docs/REQUESTS.md
- 구현/빌드/브라우저 검증: 완료 (로컬, 브라우저 에뮬레이션)
- 실제 작업물, 소개, 연락처, 최종 히어로 영상·헤드라인: 미확정 (모두 샘플로 표시)

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
