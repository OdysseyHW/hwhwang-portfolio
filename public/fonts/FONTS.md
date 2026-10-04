# 사이트에 포함된 글꼴

두 글꼴 모두 SIL Open Font License 1.1(OFL)로 배포되며, 각 폴더에 라이선스 원문을 함께 둡니다.
두 글꼴 모두 한글 글리프가 없으므로 한글은 시스템 글꼴(Apple SD Gothic Neo, Malgun Gothic, Noto Sans KR 등)로 표시됩니다.

## Google Sans — 메뉴·본문·일반 제목

| 항목 | 내용 |
| --- | --- |
| 출처 | https://github.com/googlefonts/googlesans — Release `v14.000` (2026-06-10), `GoogleSans-v14.000.zip` |
| 원본 파일 | `build/GoogleSans/static/GoogleSans-Regular.ttf`, `GoogleSans-Medium.ttf`, `GoogleSans-Bold.ttf` |
| 사용 굵기 | 400(본문) · 500(메뉴·버튼) · 700(제목) |
| 라이선스 | OFL 1.1, Reserved Font Name 없음 → `google-sans/OFL.txt` (저장소 원문 그대로) |
| 상표 | “Google”, “Google Sans”는 Google LLC의 상표 → `google-sans/TRADEMARKS.txt`. 이 사이트는 Google과 무관하며, 상표를 사이트·제품 이름으로 사용하지 않습니다. |
| 수정 사항 | 웹 용량을 줄이기 위해 라틴 문자 범위만 남기고(subset) WOFF2로 변환했습니다. 글꼴 내부의 저작권·라이선스 정보(name 테이블)는 그대로 보존했습니다. 도구: fontTools `pyftsubset` |
| 남긴 문자 범위 | U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6, U+02DA, U+02DC, U+0304, U+0308, U+0329, U+2000-206F, U+20AC, U+2122, U+2190-2193, U+2212, U+2215, U+FEFF, U+FFFD |

참고: 저장소의 `OFL.txt` 첫 줄 저작권 표기는 “The Google Sans Flex Project Authors”로 되어 있고, 글꼴 파일 내부 표기는 “Copyright 2025 The Google Sans Project Authors (github.com/googlefonts/googlesans)”입니다. 라이선스 파일은 공식 저장소 원문을 수정하지 않고 그대로 두었습니다.

## Zalando Sans Expanded — 메인 히어로 대형 제목 전용

| 항목 | 내용 |
| --- | --- |
| 출처 | https://fonts.google.com/specimen/Zalando+Sans+Expanded · https://github.com/google/fonts/tree/main/ofl/zalandosansexpanded (커밋 `8b882cc9ed`, 2026-04-27) |
| 원본 파일 | `ZalandoSansExpanded[wght].ttf` (가변 글꼴, wght 200–900), 버전 1.800 |
| 사용 굵기 | 800 |
| 라이선스 | OFL 1.1, **Reserved Font Name “Zalando”** → `zalando-sans-expanded/OFL.txt` |
| 수정 사항 | **없음.** 예약 글꼴 이름이 있어 subset 등 수정본은 같은 이름을 쓸 수 없으므로, 공식 배포 파일을 바이트 단위로 그대로 사용합니다(SHA-1 `38a112526e4ed169b378e30d4ed45dd66c9af519`). URL 인코딩 문제를 피하려고 파일 이름만 `ZalandoSansExpanded-wght.ttf`로 바꿨습니다. |
