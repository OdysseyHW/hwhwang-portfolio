import { getCollection, type CollectionEntry } from 'astro:content';

export type Project = CollectionEntry<'projects'>;

/** order 오름차순 → 제목 순으로 정렬한 전체 프로젝트 */
export async function getSortedProjects(): Promise<Project[]> {
  const items = await getCollection('projects');
  return items.sort((a, b) => a.data.order - b.data.order || a.data.title.localeCompare(b.data.title, 'ko'));
}

/** 메인 목록에 노출할 프로젝트 (featured: true) */
export async function getFeaturedProjects(): Promise<Project[]> {
  return (await getSortedProjects()).filter((p) => p.data.featured);
}

export type TextBlock = { type: 'p'; text: string } | { type: 'ul'; items: string[] };

/** 빈 줄로 문단을 나누고, "- "로 시작하는 줄 묶음은 목록으로 변환한다. */
export function parseBody(body = ''): TextBlock[] {
  return body
    .trim()
    .split(/\n\s*\n/)
    .map((chunk) => chunk.trim())
    .filter(Boolean)
    .map((chunk): TextBlock => {
      const lines = chunk.split('\n').map((l) => l.trim());
      if (lines.every((l) => l.startsWith('- '))) return { type: 'ul', items: lines.map((l) => l.slice(2)) };
      return { type: 'p', text: lines.join(' ') };
    });
}

/** 같은 layout(full/detail)이 연속된 이미지끼리 묶어, 작성 순서를 유지하며 배치한다. */
export function groupFigures<T extends { layout: 'full' | 'detail' }>(images: T[]): { layout: T['layout']; items: T[] }[] {
  const groups: { layout: T['layout']; items: T[] }[] = [];
  for (const img of images) {
    const last = groups.at(-1);
    if (last && last.layout === img.layout) last.items.push(img);
    else groups.push({ layout: img.layout, items: [img] });
  }
  return groups;
}
