# hwhwang-portfolio

게임 UI 디자이너 포트폴리오 웹사이트입니다. Astro + TypeScript로 만들었고, 빌드 결과물(`dist/`)은 서버 없이 GitHub Pages 같은 정적 호스팅에 올릴 수 있습니다.

> 기획·요청·진행 기록은 [docs/PLAN.md](docs/PLAN.md), [docs/REQUESTS.md](docs/REQUESTS.md), [docs/STATUS.md](docs/STATUS.md)에 있습니다.
>
> **현재 들어 있는 이름·소개·프로젝트 3개는 모두 임시(샘플) 콘텐츠입니다.** 공개 전에 [공개 전 교체 목록](#공개-전-교체해야-할-임시-콘텐츠)을 확인하세요.

---

## 1. 설치 · 실행 · 빌드

Node.js **22.12 이상**이 필요합니다.

```bash
npm install          # 의존성 설치 (최초 1회)
npm run dev          # 개발 서버 → http://localhost:4321
npm run build        # 정적 빌드 → dist/
npm run preview      # 빌드 결과 미리보기
npm run check        # 타입·콘텐츠 스키마 검사
```

> npm 11에서 `esbuild` 설치 스크립트 승인을 묻는 경고가 나오면 `npm approve-scripts esbuild`를 실행하세요. 이미 `package.json`의 `allowScripts`에 등록되어 있습니다.

### 자동 점검 (선택)

```bash
npx playwright install chromium firefox webkit   # 최초 1회 (브라우저 약 1.2GB)
npm run build
npm run verify                                   # 3개 브라우저 × 14개 화면 너비 점검 (브라우저당 214개 항목)
BROWSERS=chromium SHOTS=1 npm run verify          # 크롬 계열만 + verify-report/에 스크린샷 저장
```

점검 항목은 다음과 같습니다: 가로 넘침·잘림, 그리드 열 수, 글자만 200% 확대, 모바일 메뉴(열기·Esc·초점), 카드 → 상세 이동, 직접 접속, 404 응답, 확대 뷰어(확대·이동·맞춤·Esc·초점·스크롤 복원), 깨진 링크·이미지, 콘솔 오류, 제목 순서, 메타데이터, 200% 확대(640px).

---

## 2. 폴더 구조

```
src/
├─ data/site.ts                 ← 이름·소개·연락처 (사이트 공통 정보)
├─ content/projects/<slug>/     ← 프로젝트 1개 = 폴더 1개
│   ├─ index.yaml               ← 프로젝트 내용
│   └─ images/                  ← 프로젝트 이미지
├─ content.config.ts            ← 프로젝트 데이터 형식(스키마)
├─ styles/tokens.css            ← 색상·글꼴·여백 등 디자인 토큰
├─ styles/global.css            ← 공통 스타일
├─ components/                  ← 헤더·카드·확대 뷰어 등
├─ layouts/BaseLayout.astro     ← 공통 <head>(메타데이터)·헤더·푸터
└─ pages/                       ← index(메인), projects/[slug](상세), 404
public/                         ← 그대로 복사되는 파일 (파비콘, 공유 이미지, 영상)
scripts/verify.mjs              ← 자동 점검 스크립트
```

---

## 3. 이름 · 소개 · 연락처 바꾸기

`src/data/site.ts` 한 파일만 수정하면 됩니다.

| 항목 | 설명 |
| --- | --- |
| `name` | 헤더 로고와 메인 제목에 쓰이는 이름 |
| `jobTitle` | 직무 (기본값 `Game UI Designer`) |
| `intro` | 메인 상단의 짧은 소개 (1~2문장) |
| `about` | About 영역 문단 (배열 1칸 = 문단 1개) |
| `skills` / `tools` | 전문 분야 / 사용 도구 |
| `experience` | 경력. 빈 배열 `[]`이면 경력 블록이 숨겨집니다 |
| `email` | 비우거나 지우면 이메일 버튼이 숨겨집니다 |
| `socialLinks` | 외부 포트폴리오 링크 `{ label, href }`. 빈 배열이면 숨김 |
| `resumeUrl` | 이력서 링크(선택). 외부 URL 또는 `public/`에 넣은 파일 이름 (예: `public/resume.pdf` → `'resume.pdf'`) |
| `description` | 검색·공유 시 표시될 사이트 설명 |
| `credits` | 푸터의 출처·고지 문구(선택) |

이메일·링크·이력서가 모두 비어 있으면 Contact 영역과 "연락하기" 버튼도 함께 숨겨집니다. 이때는 헤더의 Contact 메뉴도 `src/components/Header.astro`의 `links`에서 지워 주세요.

공유 이미지 `public/og-default.png`(1200×630)에도 이름이 들어 있으니 함께 교체하세요.

---

## 4. 프로젝트 추가 · 삭제 · 정렬

### 추가

1. `src/content/projects/` 아래에 새 폴더를 만듭니다. **폴더 이름이 주소가 됩니다.** (`my-project` → `/projects/my-project/`) 영문 소문자·숫자·하이픈만 쓰세요.
2. 기존 샘플 폴더의 `index.yaml`을 복사해 내용을 고칩니다.
3. 이미지를 `images/` 폴더에 넣고 `./images/파일명`으로 연결합니다.

이것만으로 메인 목록 카드와 상세 페이지, 이전·다음 이동이 자동으로 만들어집니다.

### `index.yaml` 항목

```yaml
title: 프로젝트명                     # 필수
summary: 한 줄 설명                   # 필수
sample: false                         # true면 "샘플 프로젝트" 표시
projectType: 실무                     # 필수 — 개인 콘셉트 / 실무 / 팀 프로젝트 등
genre: 액션 RPG                       # 선택
platform: PC / Console                # 필수
period: "2025.03 – 2025.06"           # 선택 (콜론 ':'이 들어가면 따옴표로 감싸기)
teamType: 팀 작업 (UI 디자이너 2명)   # 선택
roles: [UX 설계, HUD 디자인]          # 필수, 1개 이상
contribution: |                       # 선택 — 직접 제작한 범위
  문단은 빈 줄로 구분합니다.

  - "- "로 시작하는 줄은 목록이 됩니다
coverImage: ./images/cover.png        # 필수 — 카드 썸네일 + 상세 대표 이미지
coverAlt: 대표 이미지 설명            # 필수 — 대체 텍스트
coverPosition: 50% 30%                # 선택 — 썸네일 자르기 중심 (가로% 세로%)
tags: [HUD, Mobile]                   # 선택
featured: true                        # false면 메인 목록에서 숨김 (상세 페이지는 유지)
order: 1                              # 작을수록 앞에 표시
sections:                             # 상세 본문 (위에서부터 순서대로 표시)
  - title: 디자인 목표와 문제 정의
    body: |
      본문
    images:
      - src: ./images/final.png
        alt: 대체 텍스트              # 필수
        title: 이미지 제목            # 선택
        caption: 이미지 설명          # 선택
        layout: full                  # full = 전체 화면(넓게), detail = 세부 확대(2열 격자)
    video:                            # 선택
      src: [videos/demo.mp4, videos/demo.webm]   # public/ 기준 경로, 앞의 형식부터 재생 시도
      # youtubeId: dQw4w9WgXcQ                   # 또는 YouTube (재생 버튼을 누를 때만 불러옴)
      poster: ./images/final.png
      posterAlt: 영상 미리보기 설명
      title: 영상 제목
      caption: 영상 설명              # 선택
```

**상세 페이지 공통 구성:** 제목·한 줄 설명·대표 이미지 → 프로젝트 개요 → 담당 역할 → `sections` → 이전·다음 프로젝트. 권장하는 `sections` 순서는 다음과 같습니다.

1. 디자인 목표와 문제 정의
2. UX 흐름 · 정보 구조 · 와이어프레임
3. 최종 UI 화면과 주요 컴포넌트 (`full` 전체 화면 + `detail` 세부 이미지)
4. 인터랙션 영상 (선택)
5. 결과와 회고

값이 없는 개요 항목, 본문·이미지·영상이 모두 빈 섹션은 제목까지 자동으로 숨겨집니다.

### 삭제 · 정렬 · 숨기기

- **삭제:** 프로젝트 폴더를 통째로 지웁니다.
- **정렬:** `order` 숫자를 바꿉니다 (같으면 제목 순).
- **메인에서만 숨기기:** `featured: false`.

입력 형식이 틀리면(필수 항목 누락, alt 비어 있음, 이미지 경로 오류 등) `npm run dev`/`npm run build`가 어느 파일의 어느 항목이 문제인지 알려 줍니다.

---

## 5. 이미지 교체 위치와 권장 규격

| 용도 | 위치 | 권장 규격 |
| --- | --- | --- |
| 카드 썸네일 겸 대표 이미지 | `projects/<slug>/images/` → `coverImage` | 가로 1600px 이상, 16:10 또는 16:9. 카드에서는 16:10으로 잘리므로 중요한 부분은 `coverPosition`으로 중심을 맞춤 |
| 전체 UI 화면 (`layout: full`) | `projects/<slug>/images/` | 게임 실제 해상도 그대로 (예: 1920×1080, 2560×1440). 자르지 않고 원본 비율로 표시 |
| 세부 확대 이미지 (`layout: detail`) | `projects/<slug>/images/` | 가로 1000~1600px. 작은 글자·아이콘이 보이도록 확대 캡처 |
| 영상 | `public/videos/` | MP4(H.264) 권장 + 필요 시 WebM 추가, 10MB 이하·소리 없는 짧은 클립 권장. 큰 영상은 YouTube 사용 |
| 영상 포스터 | `projects/<slug>/images/` | 영상과 같은 비율 |
| 공유 이미지 | `public/og-default.png` | 1200×630 PNG/JPG |
| 파비콘 | `public/favicon.svg`, `public/apple-touch-icon.png` | SVG + 180×180 PNG |

- **형식:** PNG(UI 캡처, 선명한 글자) 또는 JPG/WebP(배경 위주 화면). SVG도 가능합니다.
- **자동 최적화:** PNG·JPG는 빌드할 때 화면 크기별 WebP(srcset)로 자동 변환됩니다. 확대 뷰어와 "원본 열기"는 원본 파일을 그대로 보여 줍니다. 원본은 너무 크지 않게(긴 변 4000px 이하) 넣어 주세요.
- **로딩:** 첫 화면 이미지(메인 카드, 상세 대표 이미지)는 바로 불러오고, 그 아래 이미지는 지연 로딩합니다. 너비·높이는 자동으로 지정되어 로딩 중에 화면이 밀리지 않습니다.

---

## 6. 색상 · 폰트 변경

`src/styles/tokens.css`의 변수만 바꾸면 사이트 전체에 적용됩니다.

```css
--color-bg: #0f1012;          /* 배경 */
--color-surface: #17181b;     /* 카드·패널 */
--color-text: #eceef1;        /* 본문 */
--color-text-muted: #a9adb5;  /* 보조 글자 */
--color-accent: #f2b84b;      /* 강조색 (한 가지만 사용) */
--color-accent-ink: #15130f;  /* 강조색 배경 위 글자 */
```

- 현재 조합의 명도 대비: 본문 16.4:1, 보조 글자 7.2:1 이상, 강조색 9.9:1 이상. 색을 바꾼 뒤에도 일반 텍스트 **4.5:1 이상**을 유지하세요.
- `src/layouts/BaseLayout.astro`의 `theme-color`, `src/components/Header.astro`의 헤더 배경(`rgb(15 16 18 / 0.94)`)도 배경색에 맞춰 바꿔 주세요.
- **폰트:** `--font-sans`를 수정합니다. 기본값은 외부 다운로드가 없는 시스템 폰트(맑은 고딕, Apple SD Gothic Neo 등)입니다. 웹폰트를 쓰려면 폰트 파일을 `public/fonts/`에 넣고 `global.css`에 `@font-face`를 추가하는 방식을 권장합니다.
- 여백(`--space-*`), 글자 크기(`--text-*`), 최대 폭(`--content-max`, 약 1280px), 읽기 폭(`--reading-max`, 65ch), 카드 비율(`--card-ratio`)도 같은 파일에 있습니다.

---

## 7. 정적 호스팅 배포

배포 주소는 **환경 변수**로 넣습니다. 코드에 도메인을 적지 않습니다.

| 변수 | 예시 | 설명 |
| --- | --- | --- |
| `SITE_URL` | `https://username.github.io` | 실제 배포 주소. 설정하면 canonical, `og:url`, `og:image`, `sitemap.xml`, `robots.txt`가 만들어집니다 |
| `BASE_PATH` | `hwhwang-portfolio` | 하위 경로에 배포할 때만 설정합니다. 루트 배포면 비워 둡니다 |

```bash
# 루트 배포 (예: username.github.io, 사용자 지정 도메인)
SITE_URL=https://username.github.io npm run build

# 하위 경로 배포 (예: username.github.io/hwhwang-portfolio/)
SITE_URL=https://username.github.io BASE_PATH=hwhwang-portfolio npm run build
```

> Windows Git Bash에서 `BASE_PATH=/hwhwang-portfolio`처럼 `/`로 시작하면 `C:/Program Files/Git/hwhwang-portfolio`로 바뀌어 버립니다. 앞의 `/` 없이 적으세요. PowerShell에서는 `$env:BASE_PATH='hwhwang-portfolio'; npm run build`처럼 실행합니다.

### GitHub Pages (권장)

> 외부 공개 배포는 별도 요청 후 진행합니다 (docs/PLAN.md). 아래 워크플로는 준비만 되어 있으며 아직 실행하지 않았습니다. 자동 배포를 막기 위해 수동 실행(workflow_dispatch)만 허용합니다.

1. 작업 브랜치를 검토 후 `main`에 병합합니다.
2. 저장소 **Settings → Pages → Build and deployment → Source**를 **GitHub Actions**로 바꿉니다.
3. 공개할 때 저장소 **Actions → Deploy to GitHub Pages → Run workflow**를 눌러 수동으로 실행합니다. 주소와 하위 경로는 GitHub가 알려 주는 값을 자동으로 사용합니다.

없는 주소로 접속하면 GitHub Pages가 `404.html`을 보여 줍니다. 상세 페이지는 `projects/<slug>/index.html`로 미리 만들어지므로 직접 접속하거나 새로고침해도 정상으로 열립니다.

### 그 외 정적 호스팅

Netlify, Cloudflare Pages, Vercel 등에서는 빌드 명령 `npm run build`, 출력 폴더 `dist`로 설정하고 `SITE_URL` 환경 변수를 추가합니다.

> `robots.txt`는 도메인 루트에 있어야 검색 엔진이 읽습니다. 하위 경로에 배포하면 sitemap 주소를 Google Search Console에 직접 등록하세요.

---

## 8. 공개 전 교체해야 할 임시 콘텐츠

- [ ] `src/data/site.ts` — `name`(Your Name), `about` 문단 2개(`[소개 입력]`), `skills`·`tools`, `experience`(`[경력 입력]` 예시 항목), `email`(hello@example.com), `socialLinks`(ArtStation·Behance 메인 페이지로 연결된 임시 링크), `description`, `credits`
- [ ] `src/content/projects/` 샘플 프로젝트 3개 — 실제 프로젝트로 교체하거나 폴더 삭제
  - `rpg-hud-character-ui` (모든 항목 사용 예시, 샘플 영상 포함)
  - `mobile-lobby-menu-ux`
  - `inventory-shop-ui` (선택 항목을 비운 예시, 긴 제목 확인용)
- [ ] 샘플 이미지(`images/*.svg`) — 이 사이트용으로 직접 만든 도형 이미지이며 모서리에 `SAMPLE` 표시가 있습니다
- [ ] `public/videos/rpg-hud-interaction.webm` — 샘플 영상 (샘플 프로젝트를 지우면 함께 삭제)
- [ ] `public/og-default.png` — 공유 이미지에 "Your Name"이 들어 있습니다
- [ ] `public/favicon.svg`, `public/apple-touch-icon.png` — 원하면 교체
- [ ] 모든 프로젝트의 `sample: true` → 실제 작업물은 `false`로 바꾸거나 줄 삭제
- [ ] `[샘플 문구]`가 남아 있지 않은지 검색: `grep -r "샘플 문구\|입력\]" src`

> 경력, 회사명, 성과 수치는 실제로 확인된 내용만 적어 주세요. 샘플에는 일부러 넣지 않았습니다.

---

## 9. 기능 요약

- 메인: 헤더(Works·About·Contact) → 짧은 소개 → 대표 프로젝트 카드 → About → Contact → 푸터
- 프로젝트 목록: 320~599px 1열, 600~1199px 2열(카드 폭이 부족하면 1열), 1200px 이상 3열
- 상세 페이지: 공통 템플릿. 선택 항목이 비어 있으면 자동으로 숨김
- 확대 뷰어: 화면 맞춤, 원본 크기, 확대·축소 버튼, 휠, 드래그 이동, 터치 핀치·이동, 더블클릭·더블탭, 키보드(`+` `-` `0` `1` 방향키 `Esc`), 원본 열기. 열려 있는 동안 배경 스크롤을 잠그고, 닫으면 스크롤 위치와 초점을 되돌립니다
- 모바일 메뉴: 약 640px 미만에서 메뉴 버튼으로 전환. `aria-expanded`, Esc 닫기, 바깥 클릭 닫기, 초점 처리
- 접근성: 본문 바로가기, 시맨틱 마크업, 포커스 표시, `prefers-reduced-motion` 반영, 영상 자동 재생 없음
- JavaScript는 모바일 메뉴, 확대 뷰어, YouTube 지연 로딩에만 사용합니다 (외부 라이브러리 없음)
