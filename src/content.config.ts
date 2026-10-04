import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

/**
 * 프로젝트 콘텐츠 스키마.
 * src/content/projects/<slug>/index.yaml 파일 하나 = 프로젝트 하나.
 * 이미지 경로는 yaml 파일 기준 상대 경로(./images/...)로 적는다.
 */
const projects = defineCollection({
  loader: glob({ pattern: '*/index.{yaml,yml}', base: './src/content/projects', generateId: ({ entry }) => entry.split('/')[0] }),
  schema: ({ image }) => {
    const figure = z.object({
      src: image(),
      alt: z.string().min(1, '이미지마다 대체 설명(alt)을 입력하세요.'),
      title: z.string().optional(),
      caption: z.string().optional(),
      /** full: 전체 UI 화면(넓게) / detail: 세부 확대 이미지(격자 배치) */
      layout: z.enum(['full', 'detail']).default('full'),
    });

    const video = z
      .object({
        /**
         * public/ 폴더 기준 경로(예: videos/demo.mp4) 또는 외부 영상 파일 URL.
         * 여러 형식을 함께 제공하려면 목록으로 적는다 (앞에 적은 형식부터 재생 시도: mp4 → webm 권장)
         */
        src: z.union([z.string(), z.array(z.string()).min(1)]).optional(),
        /** YouTube 영상 ID — 클릭 전까지 플레이어를 불러오지 않는다 */
        youtubeId: z.string().optional(),
        poster: image(),
        posterAlt: z.string().min(1),
        title: z.string(),
        caption: z.string().optional(),
      })
      .refine((v) => Boolean(v.src) !== Boolean(v.youtubeId), { message: 'video에는 src 또는 youtubeId 중 하나만 입력하세요.' });

    return z.object({
      title: z.string(),
      summary: z.string(),
      /** 샘플(임시) 프로젝트 표시. 실제 작업물로 교체하면 false 또는 삭제 */
      sample: z.boolean().default(false),
      projectType: z.string(), // 개인 콘셉트 / 실무 / 팀 프로젝트 등
      genre: z.string().optional(),
      platform: z.string(),
      period: z.string().optional(),
      teamType: z.string().optional(), // 개인 작업 / 팀 작업(디자이너 n명) 등
      roles: z.array(z.string()).min(1),
      contribution: z.string().optional(),
      coverImage: image(),
      coverAlt: z.string().min(1),
      /** 썸네일 자르기 중심 (CSS object-position 값). 예: "50% 30%", "left top" */
      coverPosition: z.string().default('50% 50%'),
      tags: z.array(z.string()).default([]),
      featured: z.boolean().default(true),
      order: z.number().default(100),
      sections: z
        .array(
          z.object({
            title: z.string(),
            /** 빈 줄로 문단을 구분. "- "로 시작하는 줄은 목록으로 표시 */
            body: z.string().optional(),
            images: z.array(figure).default([]),
            video: video.optional(),
          }),
        )
        .default([]),
    });
  },
});

export const collections = { projects };
