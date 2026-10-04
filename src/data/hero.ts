import type { ImageMetadata } from 'astro';
// 임시 포스터: 기존 RPG 샘플 프로젝트의 이미지를 재사용 (원본 파일은 그대로, 히어로에서만 흑백 필터)
import samplePoster from '../content/projects/rpg-hud-character-ui/images/hud-final.svg';

/**
 * 메인 히어로 설정. 최종 영상·문구가 정해지면 이 파일만 바꾸면 된다.
 * 영상 경로는 public/ 기준 (예: 'videos/showreel.mp4'). 배포 하위 경로(BASE_PATH)는 자동 반영된다.
 */
/** 제목 한 줄. 문자열이면 titleLang을 따르고, 줄마다 언어가 다르면 { text, lang }으로 쓴다. */
export type TitleLine = string | { text: string; lang?: string };

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
  titleLines: ['GAME UI', 'DE\u00ADSIG\u00ADNED', 'FOR PLAY'], // 임시 헤드라인 (최종 문구 미정). \u00AD = 필요할 때만 'DE-/SIG-/NED'로 끊음
  titleLang: 'en',
  // 예) 한글: titleLines: ['플레이를', '설계하는', '디자이너'], titleLang: 'ko'
  // 예) 혼합: titleLines: ['GAME UI', { text: '디자이너', lang: 'ko' }], titleLang: 'en'
  description: '플레이의 흐름을 만드는 게임 UI 디자이너.',
  // 임시: 기존 RPG HUD 샘플 영상 (최종 흑백 UI 모션 쇼릴로 교체 예정)
  videoDesktop: 'videos/rpg-hud-interaction.webm',
  videoMobile: 'videos/rpg-hud-interaction.webm',
  posterDesktop: samplePoster,
  focalPoint: '50% 50%',
  focalPointMobile: '30% 50%',
  ctaLabel: '작업물 보기',
  ctaTarget: '#works',
  monochrome: true,
  sampleLabel: 'SAMPLE VIDEO',
};
