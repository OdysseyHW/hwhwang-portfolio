/** 배포 하위 경로(BASE_PATH)를 반영한 내부 링크를 만든다. withBase('projects/foo/') → /base/projects/foo/ */
export function withBase(path = ''): string {
  const base = import.meta.env.BASE_URL.replace(/\/?$/, '/');
  return base + path.replace(/^\//, '');
}

export function projectUrl(slug: string): string {
  return withBase(`projects/${slug}/`);
}

/** 래스터 이미지에만 반응형 srcset을 만든다 (SVG는 벡터라 크기별 복사본이 필요 없음). */
export function responsive(src: { format: string }, widths: number[], sizes: string) {
  return src.format === 'svg' ? {} : { widths, sizes };
}
