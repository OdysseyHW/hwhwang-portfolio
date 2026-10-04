# 구현 진행 기록
## 현재 상태
- 요청: REQ-001
- 상태: 구현 완료 · 검토 대기 (PR #1)
- 기획: docs/PLAN.md
- 구현/빌드/브라우저 검증: 완료 (로컬, 브라우저 에뮬레이션)
- 실제 작업물, 소개, 연락처, 최종 테마: 미확정 (모두 샘플로 표시)

## Claude Code 기록 양식
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
