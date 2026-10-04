# 메인 히어로 배경 영상 — 제작 기록 (REQ-005)

## 출처
- 사용자 제공 원본 2편 (원본은 저장소에 넣지 않았고, 변경·이동하지 않았다)
  1. `4Ground9 CharacterIntroduce.mp4` — 1920×1080, 59.94fps, H.264 + AAC, 24.24초, 46,988,593 bytes
  2. `4Ground9 PV_Openning.mp4` — 1920×1080, 59.94fps, H.264 + AAC, 13.35초, 25,491,079 bytes
- 원본 위치(로컬): `Z:\Nerdystar Co\_취업자료\`
- 순서는 사용자가 나열한 순서 그대로(1 → 2). 전체를 단순 컷으로 이어 붙였고 발췌·재구성·타이틀/로고 제거는 하지 않았다.
- 이 영상만으로 사이트에서 담당 역할이나 제작 기여를 주장하지 않는다.

## 결과 파일
| 파일 | 용도 | 해상도 | fps | 코덱 | 길이 | 크기 |
| --- | --- | --- | --- | --- | --- | --- |
| `public/videos/4ground9-hero-1080.mp4` | 데스크톱(약 640px 이상) | 1920×1080 | 30 | H.264 High, yuv420p, faststart, **오디오 없음** | 37.57초 | 10.6MB (11,142,796 bytes) |
| `public/videos/4ground9-hero-720.mp4` | 모바일(약 640px 미만) | 1280×720 | 30 | 같음 | 37.57초 | 5.3MB (5,556,171 bytes) |
| `src/assets/hero/4ground9-poster.jpg` | 포스터(영상 전·재생 불가 시) | 1920×1080 | — | JPEG | — | 111KB |

- 색은 원본 그대로 인코딩했다. 흑백은 사이트 CSS(`hero.monochrome`)로만 적용하므로 나중에 컬러로 바꿀 수 있다.
- 포스터는 11.0초(프레임 330, 게임 내 장면)에서 추출했다. 영상 첫 2초의 타이틀 화면("CHARATER INTRODUCE SQ")은 히어로 제목과 글자가 겹쳐, 영상이 재생되지 않는 환경(모션 줄이기·자동 재생 차단·로드 실패)에서 계속 겹쳐 보이므로 글자가 적은 장면을 골랐다. 영상은 포스터 위로 서서히 나타난다.

## 인코딩 설정과 선택 이유
- 30fps로 낮추고 두 영상을 같은 해상도·SAR·픽셀 형식으로 맞춘 뒤 `concat` 필터로 연결(타임베이스 통일).
- 품질 기준 인코딩부터 비교했다: 1080p CRF 26 = 16.9MB, CRF 28 = 13.2MB → 목표(약 12MB)를 넘어 **2-pass 2400kbps**(10.6MB)를 선택. 같은 장면(작은 글자 "MOON LIGHT EXPRESS")을 확대 비교해 CRF 28과 차이가 거의 없음을 확인했다.
- 모바일 720p CRF 27 = 7.7MB → 목표(약 6MB)를 넘어 **2-pass 1200kbps**(5.3MB).
- 길이는 37.57초로 보존(원본 합 37.59초, 30fps 프레임 경계 차이).

## 확인한 것
- 순서·연결점: 24.23초에서 1번 → 2번으로 바로 이어진다. 연결로 인한 추가 검정 프레임 없음.
- 검정 구간(blackdetect, 임계 0.08): 23.63~24.23초(1번 끝 페이드), 26.27~26.40초(2번 내부 전환), 36.43~37.53초(2번 끝 페이드) — **모두 원본에 있는 구간**이며 그대로 두었다. 반복 시 끝 1.1초 검정 → 첫 타이틀 화면으로 넘어간다.
- 소리: 오디오 트랙 없음(사이트에서도 `muted`).

## 다시 만들 때 (ffmpeg, 무료)
```bash
A="4Ground9 CharacterIntroduce.mp4"; B="4Ground9 PV_Openning.mp4"
# 데스크톱 1080p — 2-pass 2400kbps (pass 1은 출력 버림: Windows는 NUL, macOS/Linux는 /dev/null)
FC="[0:v]fps=30,scale=1920:1080:flags=lanczos,setsar=1,format=yuv420p[a];[1:v]fps=30,scale=1920:1080:flags=lanczos,setsar=1,format=yuv420p[b];[a][b]concat=n=2:v=1:a=0[v]"
ffmpeg -y -i "$A" -i "$B" -filter_complex "$FC" -map "[v]" -an -c:v libx264 -preset slow -b:v 2400k -maxrate 4000k -bufsize 6000k -pass 1 -passlogfile p1080 -pix_fmt yuv420p -f mp4 NUL
ffmpeg -y -i "$A" -i "$B" -filter_complex "$FC" -map "[v]" -an -c:v libx264 -preset slow -b:v 2400k -maxrate 4000k -bufsize 6000k -pass 2 -passlogfile p1080 -pix_fmt yuv420p -movflags +faststart 4ground9-hero-1080.mp4
# 모바일 720p — scale=1280:720, -b:v 1200k -maxrate 2000k -bufsize 3000k, -passlogfile p720 로 같은 방식
# 포스터 — 프레임 330(11.0초)
ffmpeg -y -i 4ground9-hero-1080.mp4 -vf "select='eq(n\,330)'" -vsync vfr -frames:v 1 -q:v 3 4ground9-poster.jpg
```
- 사용한 ffmpeg: Python 패키지 `imageio-ffmpeg`에 포함된 ffmpeg 7.1 (libx264). 로컬 작업 도구로만 사용했고 저장소에는 넣지 않았다.
