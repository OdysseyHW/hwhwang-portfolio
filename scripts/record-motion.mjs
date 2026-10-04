// 입장·메뉴 모션 화면 녹화 → docs/recordings/*.webm  (`npm run build && npm run record`)
// 정지 이미지로 판단하기 어려운 모션(입장 연출, 메뉴 열림/닫힘, SCROLL DOWN)을 5~10초 영상으로 남긴다.
import { createServer } from 'node:http';
import { readFile, stat, mkdir, rename, rm, readdir } from 'node:fs/promises';
import { extname, join } from 'node:path';
import { chromium } from 'playwright';

const DIST = new URL('../dist/', import.meta.url).pathname.replace(/^\/([A-Za-z]:)/, '$1');
const OUT = new URL('../docs/recordings/', import.meta.url).pathname.replace(/^\/([A-Za-z]:)/, '$1');
const TMP = join(OUT, '.tmp');
const PORT = 4397;
const types = { '.html': 'text/html; charset=utf-8', '.css': 'text/css', '.js': 'text/javascript', '.svg': 'image/svg+xml', '.png': 'image/png', '.webm': 'video/webm', '.woff2': 'font/woff2', '.ttf': 'font/ttf' };

const server = createServer(async (req, res) => {
  let p = decodeURIComponent(new URL(req.url, 'http://x').pathname);
  try {
    if ((await stat(join(DIST, p))).isDirectory()) p = join(p, 'index.html');
    res.writeHead(200, { 'content-type': types[extname(p)] ?? 'application/octet-stream' });
    res.end(await readFile(join(DIST, p)));
  } catch {
    res.writeHead(404);
    res.end();
  }
});
await new Promise((r) => server.listen(PORT, r));
await mkdir(TMP, { recursive: true });

const scenes = [
  { name: 'motion-desktop-1440', w: 1440, h: 900, mobile: false },
  { name: 'motion-mobile-390', w: 390, h: 844, mobile: true },
];

const browser = await chromium.launch();
for (const s of scenes) {
  const ctx = await browser.newContext({
    viewport: { width: s.w, height: s.h },
    isMobile: s.mobile,
    hasTouch: s.mobile,
    recordVideo: { dir: TMP, size: { width: s.w, height: s.h } },
  });
  const page = await ctx.newPage();
  // 1) 첫 방문 입장 연출 (새 세션이라 실제로 재생됨) — 약 2초
  await page.goto(`http://localhost:${PORT}/`);
  await page.waitForTimeout(2200);
  // 2) 메뉴 버튼 hover(데스크톱) → 열기 → 최종 상태 유지 → 닫기
  if (!s.mobile) {
    await page.hover('[data-menu-toggle]');
    await page.waitForTimeout(500);
  }
  await page.click('[data-menu-toggle]');
  await page.waitForTimeout(1800);
  await page.click('[data-menu-close]');
  await page.waitForTimeout(900);
  // 3) 다시 열어 메뉴 항목(Works)으로 이동 → 메뉴가 닫히고 목적지로 스크롤
  await page.click('[data-menu-toggle]');
  await page.waitForTimeout(1000);
  await page.click('[data-menu] a[href$="#works"]');
  await page.waitForTimeout(1600);
  const video = page.video();
  await ctx.close();
  const path = await video.path();
  await rename(path, join(OUT, `${s.name}.webm`));
  console.log('saved', s.name);
}
await browser.close();
server.close();
for (const f of await readdir(TMP)) await rm(join(TMP, f));
await rm(TMP, { recursive: true, force: true });
