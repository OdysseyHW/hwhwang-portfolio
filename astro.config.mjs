// @ts-check
import { defineConfig } from 'astro/config';
import { writeFile } from 'node:fs/promises';

/**
 * 배포 주소 설정 (환경 변수로 주입 — 코드에 임시 도메인을 하드코딩하지 않는다)
 *  - SITE_URL : 실제 배포 주소. 예) https://username.github.io  (설정 시 canonical·og:url·sitemap 생성)
 *  - BASE_PATH: 하위 경로 배포 시 경로. 예) portfolio 또는 /portfolio  (루트 배포면 비워 둔다)
 *    Windows Git Bash에서는 '/portfolio'가 경로로 변환되므로 앞의 / 없이 'portfolio'로 적는다.
 */
const site = process.env.SITE_URL || undefined;
const baseName = (process.env.BASE_PATH ?? '').trim().replace(/^\/+|\/+$/g, '');
const base = baseName ? `/${baseName}` : '/';

/**
 * SITE_URL이 있을 때만 sitemap.xml·robots.txt를 만든다.
 * @returns {import('astro').AstroIntegration}
 */
function sitemapWhenSiteKnown() {
  return {
    name: 'local-sitemap',
    hooks: {
      'astro:build:done': async ({ dir, pages }) => {
        if (!site) return;
        const root = new URL(base.endsWith('/') ? base : `${base}/`, site);
        const urls = pages
          .map((p) => p.pathname)
          .filter((p) => !p.startsWith('404'))
          .map((p) => new URL(p, root).href);
        const xml =
          '<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n' +
          urls.map((u) => `  <url><loc>${u}</loc></url>`).join('\n') +
          '\n</urlset>\n';
        await writeFile(new URL('sitemap.xml', dir), xml);
        await writeFile(new URL('robots.txt', dir), `User-agent: *\nAllow: /\n\nSitemap: ${new URL('sitemap.xml', root).href}\n`);
      },
    },
  };
}

export default defineConfig({
  site,
  base,
  trailingSlash: 'ignore',
  build: { format: 'directory' },
  integrations: [sitemapWhenSiteKnown()],
});
