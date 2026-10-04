/**
 * 사이트 공통 정보. 이름·소개·연락처는 이 파일만 수정하면 된다.
 * 값을 비우거나(빈 문자열/빈 배열) 지우면 해당 버튼·영역은 자동으로 숨겨진다.
 */
export interface SocialLink {
  label: string;
  href: string;
}

export interface ExperienceItem {
  period: string;
  title: string;
  description?: string;
}

export interface SiteInfo {
  name: string;
  jobTitle: string;
  /** 메인 소개 영역의 짧은 소개 (1~2문장) */
  intro: string;
  /** About 영역 소개 문단 */
  about: string[];
  /** 전문 분야 */
  skills: string[];
  /** 사용 도구 */
  tools: string[];
  /** 경력. 비우면 경력 블록이 숨겨진다 */
  experience: ExperienceItem[];
  email?: string;
  socialLinks: SocialLink[];
  resumeUrl?: string;
  /** 검색·공유용 기본 설명 */
  description: string;
  /** 푸터에 표시할 출처/고지 문구 (선택) */
  credits?: string;
}

export const site: SiteInfo = {
  name: 'Your Name',
  jobTitle: 'Game UI Designer',
  intro: '플레이어가 망설이지 않고 읽고, 고르고, 행동할 수 있는 게임 인터페이스를 설계합니다.',
  about: [
    '[소개 입력] 이 문단은 임시 문구입니다. 어떤 장르와 플랫폼의 UI를 주로 다뤄 왔는지, 디자인할 때 중요하게 여기는 기준이 무엇인지 2~4문장으로 적어 주세요.',
    '[소개 입력] 협업 방식(기획·클라이언트 개발과의 협업, 리소스 제작 범위, 엔진 적용 경험 등)을 적으면 채용 담당자가 역할을 빠르게 파악할 수 있습니다.',
  ],
  skills: ['HUD·전투 UI 설계', '메뉴·로비 UX 흐름 설계', '아이콘·UI 리소스 제작', 'UI 컴포넌트 시스템 정리', '프로토타이핑'],
  tools: ['Figma', 'Photoshop', 'Illustrator', 'After Effects', 'Unity UI'],
  experience: [
    {
      period: 'YYYY.MM – YYYY.MM',
      title: '[경력 입력] 회사명 · 직무',
      description: '임시 항목입니다. 실제 경력으로 교체하거나, 경력이 없다면 src/data/site.ts에서 experience를 빈 배열로 두세요.',
    },
  ],
  email: 'hello@example.com',
  socialLinks: [
    { label: 'ArtStation', href: 'https://www.artstation.com/' },
    { label: 'Behance', href: 'https://www.behance.net/' },
  ],
  resumeUrl: undefined,
  description: '게임 UI 디자이너 포트폴리오 — HUD, 로비·메뉴 UX, 인벤토리·상점 UI 작업과 디자인 과정을 소개합니다.',
  credits: '샘플 이미지는 이 사이트용으로 직접 만든 임시 도형 이미지입니다.',
};
