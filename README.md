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
npm run verify                                   # 3개 브라우저 × 14개 화면 너비 점검 (Chromium·Firefox 367개, WebKit 365개 항목)
BROWSERS=chromium SHOTS=1 npm run verify          # 크롬 계열만 + verify-report/에 스크린샷 저장
npm run screenshots                              # 검토용 화면 캡처 → docs/screenshots/
npm run record                                   # 입장·메뉴 모션 화면 녹화(약 9초) → docs/recordings/
VERBOSE=1 npm run verify                         # 항목마다 바로 출력 (멈춘 위치 확인용)
```

점검 항목은 다음과 같습니다: 입장 연출(첫 방문·생략 조건·건너뛰기·실패 대비), 블루 키컬러 적용 위치·hover·focus, SCROLL DOWN 연속 반복과 정지 조건, 배경 모션 버튼, 전체 화면 메뉴(열림·닫힘·연속 클릭·Esc·Tab 순환·초점·스크롤 복원·앵커 이동·영상 임시 정지), SCROLL DOWN, 가로 넘침·잘림, 그리드 열 수, 글자만 200% 확대, 히어로 영상(재생·정지 유지·화면 밖 정지·모션 줄이기·자동 재생 차단·파일 없음)과 배치, 모바일 메뉴(열기·Esc·초점), 카드 → 상세 이동, 직접 접속, 404 응답, 확대 뷰어(확대·이동·맞춤·Esc·초점·스크롤 복원), 깨진 링크·이미지, 콘솔 오류, 제목 순서, 메타데이터, 200% 확대(640px).

---

## 2. 폴더 구조

```
src/
├─ data/site.ts                 ← 이름·소개·연락처 (사이트 공통 정보)
├─ data/hero.ts                 ← 메인 히어로 제목·소개·배경 영상·포스터
├─ content/projects/<slug>/     ← 프로젝트 1개 = 폴더 1개
│   ├─ index.yaml               ← 프로젝트 내용
│   └─ images/                  ← 프로젝트 이미지
├─ content.config.ts            ← 프로젝트 데이터 형식(스키마)
├─ styles/tokens.css            ← 색상·글꼴·여백 등 디자인 토큰
├─ styles/global.css            ← 공통 스타일
├─ styles/fonts.css             ← 자체 호스팅 글꼴(@font-face)
├─ assets/fonts/                ← 글꼴 파일 (출처·라이선스: public/fonts/FONTS.md)
├─ components/                  ← 헤더·카드·확대 뷰어 등
├─ layouts/BaseLayout.astro     ← 공통 <head>(메타데이터)·헤더·푸터
└─ pages/                       ← index(메인), projects/[slug](상세), 404
public/                         ← 그대로 복사되는 파일 (파비콘, 공유 이미지, 영상, 글꼴 라이선스)
scripts/verify.mjs              ← 자동 점검 스크립트
scripts/screenshots.mjs         ← 검토용 화면 캡처 → docs/screenshots/
```

---

## 3. 이름 · 소개 · 연락처 바꾸기

`src/data/site.ts` 한 파일만 수정하면 됩니다.

| 항목 | 설명 |
| --- | --- |
| `name` | 헤더 로고와 메인 제목에 쓰이는 이름 |
| `jobTitle` | 직무 (기본값 `Game UI Designer`) |
| `about` | About 영역 문단 (배열 1칸 = 문단 1개) |
| `skills` / `tools` | 전문 분야 / 사용 도구 |
| `experience` | 경력. 빈 배열 `[]`이면 경력 블록이 숨겨집니다 |
| `email` | 비우거나 지우면 이메일 버튼이 숨겨집니다 |
| `socialLinks` | 외부 포트폴리오 링크 `{ label, href }`. 빈 배열이면 숨김 |
| `resumeUrl` | 이력서 링크(선택). 외부 URL 또는 `public/`에 넣은 파일 이름 (예: `public/resume.pdf` → `'resume.pdf'`) |
| `contactIsSample` | 이메일·외부 링크가 아직 임시값이면 `true`. 전체 화면 메뉴의 보조 칼럼은 `false`일 때만 연락처를 보여 줍니다. **실제 연락처로 바꾼 뒤 `false`로** |
| `description` | 검색·공유 시 표시될 사이트 설명 |
| `credits` | 푸터의 출처·고지 문구(선택) |

이메일·링크·이력서가 모두 비어 있으면 Contact 영역과 "연락하기" 버튼도 함께 숨겨집니다. 이때는 헤더의 Contact 메뉴도 `src/components/Header.astro`의 `links`에서 지워 주세요.

공유 이미지 `public/og-default.png`(1200×630)에도 이름이 들어 있으니 함께 교체하세요.

### 메인 히어로 (첫 화면) 바꾸기

`src/data/hero.ts`를 수정합니다.

| 항목 | 설명 |
| --- | --- |
| `titleLines` | 대형 제목. 배열 1칸 = 1행 (현재 임시안 `GAME UI / DESIGNED / FOR PLAY`). 영문은 한 행 8~9자 이내 권장(기본 글자 크기에서 320px까지 한 줄 유지). 화면보다 길거나 사용자가 글자를 키우면 글자를 줄이지 않고 줄바꿈합니다. 줄마다 언어가 다르면 `{ text: '디자이너', lang: 'ko' }`처럼 씁니다. 블루 강조 행은 `{ text: 'FOR PLAY', accent: true }`처럼 지정합니다(여러 행 가능, 문구에 묶이지 않음) |
| `titleLang` | 제목 기본 언어. 영문 `'en'`(기본값), 한글 `'ko'`. 줄바꿈 규칙·하이픈·화면 낭독기 발음에 쓰입니다. **문구 언어를 바꾸면 반드시 함께 바꿉니다** |
| `description` | 제목 아래 한 줄 소개 |
| `videoDesktop` / `videoMobile` | 배경 영상 경로 (`public/` 기준). 여러 형식은 `['videos/reel.mp4', 'videos/reel.webm']`처럼 목록으로. 약 640px 미만에서는 `videoMobile`만, 그 이상에서는 `videoDesktop`만 받습니다. 둘 다 비우면 포스터만 표시하고 배경 모션 버튼도 숨깁니다(이때 SCROLL DOWN은 정지 수단이 없으므로 3회 후 멈춤) |
| `posterDesktop` / `posterMobile` | 영상 대신 먼저 보이는 이미지. `import`로 연결합니다 (파일 예시는 `hero.ts` 상단 참고) |
| `focalPoint` / `focalPointMobile` | 화면 비율에 따라 잘릴 때의 중심 (예: `'50% 40%'`) |
| `ctaLabel` / `ctaTarget` | 버튼 문구와 이동 위치 (기본 `#works`) |
| `monochrome` | `true`면 히어로에서만 흑백 필터. 프로젝트 상세의 원본 색에는 영향 없음 |
| `sampleLabel` | 임시 영상일 때만 표시(예: `SAMPLE VIDEO`). 현재는 사용자 제공 4Ground9 영상이라 `undefined`(표시 없음) |

**입장 연출 (첫 진입)** — `src/components/Intro.astro`
- 같은 탭에서 메인에 처음 들어올 때만 약 1.1초 동안 검정 화면 가운데에 `site.name`이 보였다가 위로 걷히고, 제목 각 행 → 소개·헤더·버튼 순으로 나타납니다.
- 앵커 주소(`/#works`)로 들어오거나, 뒤로가기, 상세에서 메인으로 돌아올 때, 모션 줄이기 설정에서는 생략합니다. 클릭·키보드·스크롤하면 바로 건너뜁니다.
- 실행 여부는 `src/pages/index.astro` `<head>`의 짧은 스크립트가 정합니다. 연출을 끄려면 이 스크립트와 `<Intro />`를 지웁니다. 시간값은 `Intro.astro`의 CSS에서 바꿉니다.

**전체 화면 메뉴** — `src/components/Header.astro`
- 모든 화면에서 오른쪽 위 3선 버튼으로 엽니다. 큰 Works/About/Contact와 오른쪽(모바일은 아래) 보조 칼럼(직무·한 줄 소개·실제 연락처)이 나옵니다.
- 메뉴 항목을 바꾸려면 `Header.astro`의 `links`를 수정합니다. 보조 칼럼의 소개 문구는 `site.jobTitle`과 `hero.description`을 사용합니다.
- 메뉴가 열린 동안 배경 영상과 SCROLL DOWN 선은 잠시 멈췄다가, 닫으면 원래 상태(사용자가 멈춘 경우는 정지 유지)로 돌아갑니다.

**헤드라인 문구 교체 방법**
- 영문: `titleLines: ['GAME UI', 'DESIGNED', 'FOR PLAY'], titleLang: 'en'` — 제목 글꼴 Zalando Sans Expanded로 표시됩니다.
- 한글: `titleLines: ['플레이를', '설계하는', '디자이너'], titleLang: 'ko'` — Zalando Sans Expanded와 Google Sans에 한글이 없어 **시스템 한글 글꼴**(Apple SD Gothic Neo, Malgun Gothic 등)로 표시됩니다. 한글 줄은 줄 간격을 조금 넓히고 띄어쓰기 단위로 줄을 바꿉니다.
- 혼합: `titleLines: ['GAME UI', { text: '인터페이스 디자이너', lang: 'ko' }], titleLang: 'en'`
- **선택적 줄바꿈(soft hyphen):** 영문 긴 단어에 `\u00AD`를 넣으면, 글자를 키웠을 때만 그 위치에서 하이픈과 함께 끊깁니다 (현재 `'DE\u00ADSIG\u00ADNED'` → 필요할 때만 `DE-` / `SIG-` / `NED`). 화면에 들어가면 보이지 않습니다. 새 문구로 바꿀 때는 지금 위치를 그대로 옮기지 말고 새 단어의 음절에 맞게 다시 넣습니다. 넣지 않아도 넘치지는 않지만, 마지막 글자 하나만 다음 줄로 갈 수 있습니다. 한글에는 필요 없습니다.
- 바꾼 뒤 `npm run verify`로 넘침·겹침을 확인합니다 (영문 짧음·긴 단어·한글·혼합 문구를 임시로 넣어 보는 검사가 포함되어 있습니다).

**현재 배경 영상:** 사용자 제공 4Ground9 영상 2편(CharacterIntroduce → PV_Openning)을 이어 붙인 무음 MP4 — 데스크톱 1080p 10.6MB, 모바일 720p 5.3MB, 37.6초 반복. 출처·인코딩 설정·다시 만드는 명령은 [docs/HERO-VIDEO.md](docs/HERO-VIDEO.md).

**영상 교체 순서**
1. 영상 파일을 `public/videos/`에 넣습니다 (예: `showreel.mp4`, 모바일용 `showreel-mobile.mp4`).
2. `hero.ts`의 `videoDesktop`·`videoMobile` 경로를 바꾸고, `sampleLabel`을 지웁니다.
3. 영상 첫 장면과 비슷한 포스터 이미지를 `src/assets/` 등에 넣고 `posterDesktop`(필요하면 `posterMobile`)의 `import` 경로를 바꿉니다.

**배경 영상 권장 규격**
- 8~15초 길이의 자연스럽게 반복되는 루프, **소리 없음**, 빠른 섬광·과도한 움직임 없음
- MP4(H.264)를 먼저, 필요하면 WebM 추가. 용량 목표: 데스크톱 약 6MB, 모바일 약 3MB 이내
- 데스크톱 1920×1080(16:9), 모바일 1080×1920(9:16) 또는 데스크톱 파일 하나만 사용
- 핵심 UI 디테일은 화면 비율에 따라 잘릴 수 있으므로 배경에 의존하지 말고 프로젝트 상세에 넣습니다
- 포스터: 영상과 같은 비율의 이미지(데스크톱 1920×1080, 모바일 1080×1920), 흑백 필터와 검정 오버레이가 덧씌워집니다

**동작 방식:** 무음·반복·인라인으로 자동 재생을 시도하고, 막히면 포스터를 유지합니다. 모션 줄이기·데이터 절약 설정에서는 영상을 받지 않습니다. 히어로 맨 위(헤더 바로 아래) 오른쪽의 **배경 모션 버튼**은 배경 영상과 SCROLL DOWN 선을 함께 재생·일시정지합니다(버튼 이름 "배경 모션 일시정지 (배경 영상·스크롤 안내)"). 글자를 키워도 첫 화면에 남도록 모든 화면에서 같은 위치이고, 일시정지 상태는 다시 방문해도 유지됩니다(브라우저 저장소). 히어로가 화면 밖에 있거나 탭이 숨겨지거나 메뉴가 열리면 임시로 멈춥니다(저장 안 함). 영상을 불러오지 못해도 버튼은 남아 SCROLL DOWN을 멈출 수 있습니다.

**SCROLL DOWN:** 왼쪽 아래 세로 트랙에서 블루 선이 약 1.8초마다 위→아래로 지나가는 연속 반복입니다. 모션 줄이기 설정이면 움직이지 않고 정지 표시만 남습니다. 속도는 `Hero.astro`의 `hero-scroll-dot` 애니메이션에서 바꿉니다.

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
| 메인 히어로 배경 영상·포스터 | `public/videos/`, `src/data/hero.ts` | 위 "메인 히어로 바꾸기"의 권장 규격 참고 |
| 공유 이미지 | `public/og-default.png` | 1200×630 PNG/JPG |
| 파비콘 | `public/favicon.svg`, `public/apple-touch-icon.png` | SVG + 180×180 PNG |

- **형식:** PNG(UI 캡처, 선명한 글자) 또는 JPG/WebP(배경 위주 화면). SVG도 가능합니다.
- **자동 최적화:** PNG·JPG는 빌드할 때 화면 크기별 WebP(srcset)로 자동 변환됩니다. 확대 뷰어와 "원본 열기"는 원본 파일을 그대로 보여 줍니다. 원본은 너무 크지 않게(긴 변 4000px 이하) 넣어 주세요.
- **로딩:** 첫 화면 이미지(메인 히어로 포스터, 상세 대표 이미지)는 바로 불러오고, 그 아래 이미지는 지연 로딩합니다. 너비·높이는 자동으로 지정되어 로딩 중에 화면이 밀리지 않습니다.

---

## 6. 색상 · 폰트 변경

`src/styles/tokens.css`의 변수만 바꾸면 사이트 전체에 적용됩니다.

현재 테마는 **블랙·화이트 바탕 + 블루 키컬러**입니다. 블루는 The Odyssey 포스터 인상에서 가져온 낮은 채도의 스틸/오션 블루 근사값(영화 공식 색 아님)이며, 핵심 동작과 강조에만 씁니다.

```css
--color-bg: #0a0a0a;             /* 배경 */
--color-surface: #141414;        /* 카드·패널 */
--color-surface-raised: #1c1c1c; /* 올라온 표면 */
--color-text: #f5f5f5;           /* 본문 */
--color-text-muted: #b3b3b3;     /* 보조 글자 */
--color-border: #333333;         /* 테두리 */
--color-border-strong: #666666;  /* 강한 테두리 */
--color-header-bg: #0a0a0a;      /* 헤더 (스크롤 후 불투명) */
--color-inverse-bg: #f5f5f5;     /* 흰 바탕 보조 요소 (본문 바로가기, 상세 영상 재생·확대 버튼) */
--color-inverse-text: #0a0a0a;   /* 위 요소의 글자 */

/* 블루 키컬러 */
--color-accent: #3a6f8c;          /* 주요 버튼 바탕 (흰 글자) */
--color-accent-hover: #2d5973;    /* 주요 버튼 hover 바탕 */
--color-accent-readable: #78a9c6; /* 검정 위 링크·섹션 라벨·포커스·SCROLL DOWN 선·hover */
--color-accent-surface: #102532;  /* 어두운 블루 면 (예비) */
--color-accent-hero: #a7cbe1;     /* 히어로 제목 강조 행 */
--color-focus: var(--color-accent-readable);
```

**블루가 쓰이는 곳:** 주요 버튼(작업물 보기·상세의 주요 버튼), 섹션 라벨(Works/About/Contact), 본문 링크, 텍스트 선택, 히어로 제목 강조 행, SCROLL DOWN 선, 입장 화면 이름, 포커스 외곽선, hover 상태(메뉴 버튼·메뉴 항목과 번호·카드 테두리와 제목·상세의 목록 링크·이전/다음). 열린 메뉴의 기본 항목은 흰색이고 hover·focus 항목만 블루입니다.

- 명도 대비: 본문 18.2:1, 보조 글자 8.1:1 이상, 주요 버튼 흰 글자/블루 5.03:1, 블루 링크·라벨 7.81:1(배경)·7.27:1(카드), 주요 버튼과 검정 배경의 경계 3.61:1, 히어로 강조 행은 영상이 가장 밝은 순간에도 3.36:1(큰 글자 기준 3:1 이상). 색을 바꾼 뒤에도 일반 텍스트 **4.5:1 이상**을 유지하세요.
- hover는 색만이 아니라 밑줄·테두리로도, 포커스는 블루 외곽선과 그 안쪽의 어두운 간격으로 표시합니다 (블루 버튼·영상 위에서도 보이도록).
- 처음 제안된 #2D5973은 검정 배경과의 경계가 2.63:1로 낮아, 같은 계열에서 #3A6F8C로 밝혀 주요 버튼에 쓰고 #2D5973은 hover에 씁니다.
- 배경색을 바꾸면 `src/layouts/BaseLayout.astro`의 `theme-color`도 맞춰 주세요.
- 프로젝트 이미지·영상의 색은 테마와 상관없이 원본 그대로 보입니다. 흑백 필터는 메인 히어로 배경에만 적용됩니다.

**글꼴** (출처·라이선스: [public/fonts/FONTS.md](public/fonts/FONTS.md))

| 역할 | 글꼴 | 굵기 | 토큰 |
| --- | --- | --- | --- |
| 메뉴·본문·일반 제목 | Google Sans (자체 호스팅, 라틴 문자 subset) | 본문 400, 메뉴·버튼 500, 제목 700 | `--font-sans`, `--weight-*` |
| 메인 히어로 대형 제목 | Zalando Sans Expanded (공식 파일 그대로) | 800 | `--font-display`, `--weight-display` |
| 한글 | 두 글꼴 모두 한글이 없어 시스템 글꼴로 표시 (Apple SD Gothic Neo, Malgun Gothic, Noto Sans KR) | — | `--font-sans` 뒤쪽 목록 |

- 글꼴을 바꾸려면 파일을 `src/assets/fonts/`에 넣고 `src/styles/fonts.css`의 `@font-face`와 `tokens.css`의 `--font-sans`·`--font-display`를 수정합니다. 배포 경로는 자동으로 반영됩니다.
- 글꼴을 불러오지 못해도 `font-display: swap`으로 시스템 글꼴이 먼저 보이므로 내용은 계속 읽을 수 있습니다.
- Google Sans는 라틴 문자만 남긴 파일입니다. 다른 문자(예: 베트남어 성조)를 쓰려면 원본 배포본에서 범위를 넓혀 다시 만들어야 합니다 (FONTS.md 참고).
- 여백(`--space-*`), 글자 크기(`--text-*`), 최대 폭(`--content-max`, 약 1280px), 읽기 폭(`--reading-max`, 65ch), 카드 비율(`--card-ratio`)도 같은 파일에 있습니다.
- **화면 폭 레이아웃:** 헤더·메인 히어로·전체 화면 메뉴는 최대 폭 없이 화면 폭을 쓰며 좌우 여백은 `--gutter-wide`(`clamp(1rem, 4vw, 10rem)`, 1920px에서 약 77px)입니다. 클래스는 `.container-wide`. 프로젝트 목록·상세 본문은 읽기 폭을 위해 `.container`(최대 약 1280px)를 그대로 씁니다.

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
- [ ] `src/data/hero.ts` — 임시 헤드라인(`GAME UI / DESIGNED / FOR PLAY`)·소개 문구 (배경 영상은 사용자 제공 4Ground9 영상으로 교체됨)
- [ ] `public/videos/rpg-hud-interaction.webm` — RPG 샘플 상세의 샘플 영상. 샘플 프로젝트를 지우면 함께 삭제 (메인 히어로에서는 더 이상 쓰지 않음)
- [ ] `public/og-default.png` — 공유 이미지에 "Your Name"과 임시 헤드라인이 들어 있습니다
- [ ] `public/favicon.svg`, `public/apple-touch-icon.png` — 원하면 교체
- [ ] 모든 프로젝트의 `sample: true` → 실제 작업물은 `false`로 바꾸거나 줄 삭제
- [ ] 실제 연락처로 바꾼 뒤 `src/data/site.ts`의 `contactIsSample: false` (전체 화면 메뉴에 연락처 표시)
- [ ] `[샘플 문구]`가 남아 있지 않은지 검색: `grep -r "샘플 문구\|입력\]" src`

> 경력, 회사명, 성과 수치는 실제로 확인된 내용만 적어 주세요. 샘플에는 일부러 넣지 않았습니다.

---

## 9. 기능 요약

- 메인: 영상 배경 히어로(투명 헤더, 대형 제목, 소개, 작업물 보기, 재생·일시정지) → 대표 프로젝트 카드 → About → Contact → 푸터
- 프로젝트 목록: 320~599px 1열, 600~1199px 2열(카드 폭이 부족하면 1열), 1200px 이상 3열
- 상세 페이지: 공통 템플릿. 선택 항목이 비어 있으면 자동으로 숨김
- 확대 뷰어: 화면 맞춤, 원본 크기, 확대·축소 버튼, 휠, 드래그 이동, 터치 핀치·이동, 더블클릭·더블탭, 키보드(`+` `-` `0` `1` 방향키 `Esc`), 원본 열기. 열려 있는 동안 배경 스크롤을 잠그고, 닫으면 스크롤 위치와 초점을 되돌립니다
- 메뉴: 모든 화면에서 3선 버튼 → 전체 화면 메뉴(배경 감광·블러, 항목 순차 등장). 모달(배경 inert), Esc·닫기 버튼, 메뉴 안 Tab 순환, 닫으면 버튼·스크롤 위치 복원, 항목 선택 시 목적지 제목에 초점
- 입장 연출: 같은 탭 첫 메인 진입 1회, 약 1.1초, 클릭·키보드로 건너뛰기, 모션 줄이기·앵커·뒤로가기에서 생략
- SCROLL DOWN: 왼쪽 아래 세로 트랙의 블루 선이 1.8초 간격으로 계속 반복, 배경 모션 버튼·화면 밖·탭 숨김·메뉴 열림이면 정지
- 접근성: 본문 바로가기, 시맨틱 마크업, 포커스 표시, `prefers-reduced-motion` 반영. 자동 재생은 메인 히어로의 무음 장식 영상만 (정지 버튼 제공), 프로젝트 영상은 직접 눌러야 재생
- JavaScript는 메뉴·헤더 상태, 입장 연출 판단·건너뛰기, 히어로 영상 제어, 확대 뷰어, YouTube 지연 로딩에만 사용합니다. 모션은 CSS transform/opacity 중심이며 애니메이션 라이브러리는 쓰지 않습니다 (외부 라이브러리 없음)
