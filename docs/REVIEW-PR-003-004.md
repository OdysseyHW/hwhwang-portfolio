# REVIEW-PR-003-004
검토일: 2026-10-04
검토자: Codex
기준: docs/REQUESTS.md의 REQ-004 및 REQ-006. 사용자 후속 블루 키컬러 요청은 이번 PR의 합격 기준에 소급 적용하지 않는다.

## 대상과 결론
- PR #3: https://github.com/OdysseyHW/hwhwang-portfolio/pull/3
  head d90900daf90b028f13fb09508b598ec22b77ae4e, base main.
- PR #4: https://github.com/OdysseyHW/hwhwang-portfolio/pull/4
  head 94014527151475d4fffa2194c91d0fe4253fc488, base feature/req-004-zoom-controls-headline.
- 로컬 검사: PR #4 head의 누적 결과. PR #3 변경은 코드와 STATUS의 개별 기록도 대조했다.
- REQ-004: 요청 범위 충족. 추가 필수 수정 없음.
- REQ-006: 주요 디자인·모션·제어 충족. 아래 R1을 고친 뒤 종료 권고.
- REQ-005: 미구현 확인. REQ-006 완성이 REQ-005 완성을 의미하지 않는다.

## R1 — 상세→메인 앵커 이동 후 목적지 제목 초점 누락 (P2, 수정 요청)
위치: src/components/Header.astro:528-545, scripts/verify.mjs:1002-1006.

재현:
1. /projects/mobile-lobby-menu-ux/에 진입한다.
2. 전체 화면 메뉴를 열고 Works를 선택한다.
3. 메인 /#works로 이동은 하지만 document.activeElement는 BODY, id는 빈 문자열이다.
4. 메인 안에서 Contact를 선택하는 경로는 제목 초점을 구현하고 있어 두 경로의 동작이 다르다.

근거:
REQUESTS의 메뉴 앵커 선택은 목적지 제목에 초점을 주도록 요구한다. 현재 heading.focus는 samePage 분기에만 존재한다. 상세에서 메인으로 문서가 바뀐 뒤에는 해당 처리가 없다. 기존 상세 경로 테스트도 URL만 검사해 이 누락을 잡지 못한다.

요청:
- 상세 메뉴에서 선택한 Works/About/Contact 목적지 제목으로 새 문서 로드 후 초점을 전달한다.
- 기존 메인 내부 이동, 앵커 직접 진입의 입장 연출 생략, BASE_PATH, 뒤로가기 동작을 보존한다.
- 다른 문서로 이동한 경우에도 실제 activeElement가 목적지 제목인지 검사한다. 주소가 바뀌는지만 검사하지 않는다.
- 메인 안에서 이동하는 경우와 상세→메인 이동을 구분해 STATUS에 기록한다.
- 구현 방식은 Claude Code가 선택한다. 이 검토에서는 사이트 코드를 수정하지 않았다.

## 기준별 확인
| 항목 | 판정과 근거 |
| --- | --- |
| REQ-004 영상 제어 | 제목 앞 DOM 순서와 상단 배치 확인. 기본/글자200% 스크린샷 및 검사에서 첫 화면 접근을 보존한다. |
| REQ-004 헤드라인 | titleLang, 줄별 text/lang, 한국어 fallback, soft hyphen 안내와 임시 문구 검사 구조 확인. |
| 입장 | 녹화에서 이름 커버→제목/설명/제어 순차 등장 확인. 세션·hash·reduced-motion 생략, 입력 중단 및 실패 시 본문 노출 코드를 확인. |
| SCROLL DOWN | 왼쪽 아래 트랙·2행 텍스트, 1.8초 3회, 화면 밖 정지, reduced-motion 생략, Works 링크 확인. |
| 3선 버튼 | 모든 화면 공통 구성, 44px 영역, 메뉴 이름/상태 속성. Chromium 계산값에서 전환 0.18초가 실제 적용됨을 확인. |
| 전체 화면 메뉴 | PC 2열, 모바일 1열, 어두운 블러, 3개 링크, 내부 스크롤·sticky 닫기. 임시 연락처 미노출. |
| 모달 동작 | native dialog, Tab 순환, Escape, 닫기·스크롤 복원, 영상 임시 정지 구현. 상세→메인 제목 초점만 R1. |
| REQ-005 | src/data/hero.ts의 desktop/mobile 모두 videos/rpg-hud-interaction.webm, sampleLabel은 SAMPLE VIDEO. 실제 4Ground9 연결 없음. |

## 시각 자료 확인
- docs/screenshots/menu-open-desktop-1440.jpg
- docs/screenshots/home-mobile-menu-390.jpg
- docs/screenshots/menu-open-landscape-844.jpg
- docs/screenshots/menu-open-detail-768.jpg
- 확대 상태 home-mobile-text200-390.jpg 및 관련 자료
- docs/recordings/motion-desktop-1440.webm 및 motion-mobile-390.webm의 시간 순서 프레임을 추출해 입장·메뉴 열림·닫힘·Works 도착을 확인했다.
- 연출 흐름과 최종 구성은 요청에 부합한다. 25fps 녹화의 시간 순서 캡처이므로 실기기 애니메이션의 부드러움·프레임 성능까지 판정한 것은 아니다.

## 검증 및 한계
직접 실행:
- npm run check: 23 files, 오류/경고/힌트 0.
- npm run build: 5페이지 성공.
- Chromium 추가 재현: 메뉴 선 transition-duration 0.18s; 상세→/#works 후 activeElement BODY (R1).
- Chromium 기존 회귀 검사 결과는 아래 추가 기록.

Claude STATUS 보고 (이번 검토에서 Firefox/WebKit 전체 검사를 재실행하지 않음):
- REQ-004 Chromium/Firefox 309/309, WebKit 302/302.
- REQ-006 Chromium/Firefox 347/347, WebKit 338/338.
- WebKit 영상 및 Tab 검사는 대체/제외 조건이 있음.

한계:
- 글자200%는 루트 font-size 변경 검사이며 실제 브라우저 확대 또는 실기기 검증이 아니다.
- 정확한 2배 제목 확대, 실제 iPhone/Android, 화면 낭독기, Safari 실기기 및 세이프 영역은 미검증/별도 검증 범위를 유지한다.
- 임시 Your Name, 영문 헤드라인, 소개 문구, 임시 연락처 숨김은 기존 데이터 보존으로 수용한다.
- REQ-006의 “REQ-005 영상 유지” 전제는 아직 충족되지 않은 선행 작업으로 명시한다. 임의로 완료 처리하지 않는다.

## 후속 순서
1. PR #4에서 R1 보완 및 재검토.
2. 사용자 병합 지시가 있으면 PR #3 먼저, PR #4 base를 main으로 변경 후 차이/충돌 확인.
3. REQ-005는 별도 구현·검토로 진행.
4. Odyssey 포스터 기반 블루 키컬러는 별도 요청으로 정리할 사항이며 이번 PR의 결함이 아니다.

이 문서는 로컬 검토 결과다. GitHub 댓글/리뷰 제출, 커밋·푸시, 병합, 공개 배포는 하지 않았다.

## 직접 실행한 회귀 검사 최종 결과
BROWSERS=chromium npm run verify: 347/347 통과. 기존 테스트 통과와 별개로, URL만 확인하는 상세 이동 검사 밖에서 R1을 재현했다.

## R2 — 사용자 추가 요청: 대형 화면에서 중앙에 몰린 첫 화면 배치 개선
추가일: 2026-10-04. 기존 기준의 결함 판정과 구분되는 사용자 디자인 변경 요청이다.

원인 확인:
공통 .container가 --content-max: 80rem(약 1280px)과 margin-inline: auto를 사용한다. 헤더, hero__top/content/bottom, 메뉴 패널이 이 제한을 공유해 넓은 화면에서 로고·제목·스크롤 안내·메뉴 버튼이 중앙 영역에 모인다.

Claude Code 구현 요청:
- 헤더, 메인 히어로(제어/제목/하단 안내), 전체 화면 메뉴에는 화면 폭을 활용하는 별도 레이아웃을 적용한다.
- 권장 좌우 여백은 clamp(1rem, 4vw, 10rem)를 출발점으로 한다. 1920px에서는 약 77px, 2560px에서는 약 102px이다. 픽셀값은 제안이며 실제 화면 검증으로 조정한다.
- 왼쪽 로고·히어로 제목·소개·CTA·SCROLL DOWN의 시작선을 통일한다. 메뉴 버튼·닫기 버튼·영상 제어의 오른쪽 끝도 같은 여백 선에 맞춘다. 정지 버튼은 헤더 아래 별도 행으로 유지한다.
- 메뉴 열림 전후 로고/버튼 위치가 튀지 않게 헤더와 모달의 폭·여백 기준을 맞춘다. 메뉴 큰 링크도 새 왼쪽 시작선을 따른다.
- 제목의 왼쪽 정렬과 현재 3행 구성을 유지한다. 이번 요청의 핵심은 배치 폭과 좌우 여백이다. 넓어진 폭을 채우려고 제목을 무조건 키우거나 전체 내용을 가로로 늘리지 않는다.
- 프로젝트 카드 목록/상세 본문의 읽기 폭은 기존 기준을 유지한다. 공통 .container의 최대 폭을 전역으로 삭제하지 않는다.
- 모바일은 안전 여백과 세이프 영역을 보장한다. 200% 글자 확대, 낮은 가로 화면, 44px 버튼, 제목 줄바꿈, 영상 제어 첫 화면 접근을 보존한다.
- 1440/1920/2560px 및 가능하면 사용자 제공 화면에 가까운 3840px에서 헤더·히어로·열린 메뉴 스크린샷을 남긴다. 브라우저 CSS viewport와 deviceScaleFactor를 기록해 첨부 이미지의 픽셀 크기를 CSS 폭으로 단정하지 않는다.
- 320/390px, 667×375/844×390 및 글자200% 회귀도 확인한다.
- REQUESTS와 STATUS에 이번 사용자 보완 요청을 기록하고 R1과 구분되는 커밋으로 남긴다. PR #4가 열려 있으면 그 PR에 보완 가능하며 이미 병합되었다면 최신 main 기반 별도 PR로 진행한다.

R1(상세→메인 제목 초점)과 R2(배치 폭)를 함께 반영해 재검토 요청한다. 실제 사이트 구현 담당은 Claude Code다.


# PR #4 R1·R2 재검토 (2026-10-04)
검토 대상: GitHub PR #4 head 6aae6a6c16459ded6827c8ce4d1b769acb38a8cf.
수정 커밋: R1 ac2b389, R2 e8eac00. 로컬 작업 트리는 검토 시작 시 깨끗했고 GitHub head와 일치했다.

## 코드·시각 자료 확인
- R1: 상세 메뉴 선택 시 경로+해시를 세션에 기록하고 새 문서의 앵커 처리 후 목적지 제목으로 초점을 전달한다. 메인 내부 이동은 기존 방식을 유지하며 뒤로가기·직접 진입에서는 추가 전달하지 않는다. 다른 요소에 이미 초점이 있으면 빼앗지 않는다.
- 저장소 접근 불가 시 초점 전달을 생략하고 링크 이동은 유지하는 제한은 STATUS에 명시되어 있다. 이번 정상 저장소 경로의 R1 수정 범위에서 수용한다.
- 테스트가 URL뿐 아니라 Works/About/Contact 각각의 activeElement를 확인하도록 보완되었다.
- R2: wide-home/wide-menu의 1920·2560·3840 이미지 6장을 직접 확인했다. 로고·제목·SCROLL DOWN의 왼쪽 시작선이 화면 여백에 맞춰졌고 메뉴·영상 제어가 오른쪽으로 이동했다. 열린 메뉴도 같은 폭 기준을 사용한다.
- 별도 container-wide와 clamp(1rem, 4vw, 10rem)으로 처리하며, 목록·상세 본문의 기존 읽기 폭은 유지한다. 큰 화면에서 제목이 상대적으로 작아 보이는 것은 기존 제목 상한을 보존한 결과이고 이번 R2의 미충족 항목은 아니다.
- 3840px는 DSF 1의 CSS viewport 에뮬레이션이다. 실제 4K 모니터/모바일/Safari/화면 낭독기 검증으로 간주하지 않는다.

## REQ-007·REQ-005 상태
- REQ-007은 REQUESTS에 문서로 보존되어 있으며 구현되지 않았다. 색상 토큰은 무채색, SCROLL DOWN은 1.8초·3회 반복 그대로다.
- REQ-005도 미구현. hero 데이터는 RPG 샘플 파일과 SAMPLE VIDEO를 유지한다.
- UI 포트폴리오와 모션그래픽을 별도 영역으로 분리하겠다는 후속 방향은 이번 PR의 검토 기준에 소급하지 않는다.

## 직접 검증
- npm run check: 오류 0, 경고 0, 힌트 1.
- 힌트: scripts/screenshots.mjs:84에서 query 결과가 SVGElement | HTMLElement여서 click 타입을 좁히라는 안내. 실제 대상은 button이며 캡처 도구의 비차단 정리 항목이다.
- npm run build: 5페이지 성공.
- Chromium 회귀 검사 최종 결과와 종료 판정은 아래에 기록한다.
- Firefox 356/356·WebKit 347/347은 Claude STATUS 보고값이며 이번 검토에서 재실행하지 않았다.

문서만 로컬 갱신한다. 코드 수정·커밋·푸시·GitHub 리뷰 전송·병합·배포는 하지 않는다.

## 재검토 최종 판정
- 직접 실행한 Chromium 회귀 검사: 356/356 통과.
- R1: 종료. 상세→메인 Works/About/Contact의 목적지 제목 초점과 직접 진입/뒤로가기 보존 검사 통과.
- R2: 종료. 넓은 화면 정렬, 메뉴 열림 전후 위치, 본문 읽기 폭과 기존 모바일·확대 검사 통과.
- 이번 검토 범위의 추가 필수 수정 없음. 캡처 스크립트 타입 힌트는 비차단 정리 항목.
- REQ-004/006은 이번 기준 충족. REQ-005/007은 별도 미구현 요청으로 남긴다.
- 병합은 실행하지 않음. 진행 시 PR #3 → PR #4 base main 변경 → 비교 범위·충돌 확인 순서를 유지한다.
