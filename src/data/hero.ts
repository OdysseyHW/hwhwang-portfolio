import type { ImageMetadata } from 'astro';
// 임시 포스터: 기존 RPG 샘플 프로젝트의 이미지를 재사용 (원본 파일은 그대로, 히어로에서만 흑백 필터)
import samplePoster from '../content/projects/rpg-hud-character-ui/images/hud-final.svg';

/**
 * 메인 히어로 설정. 최종 영상·문구가 정해지면 이 파일만 바꾸면 된다.
 * 영상 경로는 public/ 기준 (예: 'videos/showreel.mp4'). 배포 하위 경로(BASE_PATH)는 자동 반영된다.
 */
export interface HeroInfo {
  /** 대형 제목 — 배열 1칸이 1행. 한 행은 영문 기준 8~9자 이내를 권장 */
  titleLines: string[];
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
  titleLines: ['GAME UI', 'DESIGNED', 'FOR PLAY'], // 임시 헤드라인 (최종 문구 미정)
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
