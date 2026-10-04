import type { ImageMetadata } from 'astro';
// 포스터: 배경 영상(4Ground9) 11.0초(프레임 330, 게임 내 장면)에서 추출. 첫 2초 타이틀 화면은 히어로 제목과 글자가 겹쳐
// 영상이 재생되지 않는 환경(모션 줄이기·자동 재생 차단·로드 실패)에서 계속 겹쳐 보이므로 글자가 적은 장면을 골랐다. 제작 방법: docs/HERO-VIDEO.md
import heroPoster from '../assets/hero/4ground9-poster.jpg';

/**
 * 메인 히어로 설정. 최종 영상·문구가 정해지면 이 파일만 바꾸면 된다.
 * 영상 경로는 public/ 기준 (예: 'videos/showreel.mp4'). 배포 하위 경로(BASE_PATH)는 자동 반영된다.
 */
/**
 * 제목 한 줄. 문자열이면 titleLang을 따른다.
 * 객체로 쓰면 줄별 언어(lang)와 블루 강조(accent: true)를 지정할 수 있다 — 특정 문구에 묶지 않고 데이터로 고른다.
 */
export type TitleLine = string | { text: string; lang?: string; accent?: boolean };

export interface HeroInfo {
  /**
   * 대형 제목 — 배열 1칸이 1행. 영문은 한 행 8~9자 이내를 권장.
   * soft hyphen(\u00AD)은 영문 긴 단어의 선택적 줄바꿈 힌트다. 문구를 바꾸면 새 단어에 맞게 다시 넣고,
   * 지금 위치를 기계적으로 옮기지 않는다. 한글은 띄어쓰기 단위로 줄이 바뀐다.
   */
  titleLines: TitleLine[];
  /**
   * 제목 기본 언어 (BCP 47). 영문 'en', 한글 'ko'. 줄바꿈·하이픈·화면 낭독기 발음에 쓰인다.
   * 한글은 제목 글꼴(Zalando Sans Expanded)에 없어 시스템 한글 글꼴로 표시된다.
   */
  titleLang: string;
  description: string;
  /** 데스크톱 배경 영상. 여러 형식은 목록으로 (앞에서부터 재생 시도: mp4 → webm 권장). 비우면 포스터만 표시 */
  videoDesktop?: string | string[];
  /** 모바일(약 640px 미만) 배경 영상. 없으면 데스크톱 영상 사용. 두 파일을 동시에 받지 않는다 */
  videoMobile?: string | string[];
  posterDesktop: ImageMetadata;
  posterMobile?: ImageMetadata;
  /** 영상·포스터 자르기 중심 (CSS object-position) */
  focalPoint: string;
  focalPointMobile?: string;
  ctaLabel: string;
  /** 같은 페이지 앵커(#works) 또는 경로 */
  ctaTarget: string;
  /** 히어로에서만 흑백 처리 (블랙·화이트 컨셉) */
  monochrome: boolean;
  /** 임시 영상 표시 문구. 실제 영상으로 바꾸면 undefined로 */
  sampleLabel?: string;
}

export const hero: HeroInfo = {
  titleLines: ['GAME UI', 'DE\u00ADSIG\u00ADNED', { text: 'FOR PLAY', accent: true }], // 임시 헤드라인. accent: true = 블루 강조 행 (REQ-007) (최종 문구 미정). \u00AD = 필요할 때만 'DE-/SIG-/NED'로 끊음
  titleLang: 'en',
  // 예) 한글: titleLines: ['플레이를', '설계하는', '디자이너'], titleLang: 'ko'
  // 예) 혼합: titleLines: ['GAME UI', { text: '디자이너', lang: 'ko' }], titleLang: 'en'
  description: '플레이의 흐름을 만드는 게임 UI 디자이너.',
  // 사용자 제공 4Ground9 영상 2편(CharacterIntroduce → PV_Openning)을 이어 붙인 무음 웹용 파일 (REQ-005)
  videoDesktop: 'videos/4ground9-hero-1080.mp4',
  videoMobile: 'videos/4ground9-hero-720.mp4',
  posterDesktop: heroPoster,
  focalPoint: '50% 50%',
  focalPointMobile: '50% 50%',
  ctaLabel: '작업물 보기',
  ctaTarget: '#works',
  monochrome: true,
  sampleLabel: undefined, // 사용자 제공 영상이므로 SAMPLE VIDEO 표시 없음
};
