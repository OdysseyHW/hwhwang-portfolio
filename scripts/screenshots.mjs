// 검토용 화면 캡처 → docs/screenshots/*.jpg  (`npm run build && npm run screenshots`)
// 모션 줄이기를 끈 상태에서 히어로 영상이 재생된 뒤의 화면을 찍는다.
import { createServer } from 'node:http';
import { readFile, stat, mkdir } from 'node:fs/promises';
import { extname, join } from 'node:path';
import { chromium } from 'playwright';

const DIST = new URL('../dist/', import.meta.url).pathname.replace(/^\/([A-Za-z]:)/, '$1');
const OUT = new URL('../docs/screenshots/', import.meta.url).pathname.replace(/^\/([A-Za-z]:)/, '$1');
const PORT = 4398;
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
await mkdir(OUT, { recursive: true });

const shots = [
  { name: 'home-desktop-1440', path: '/', w: 1440, h: 900 },
  { name: 'home-works-desktop-1440', path: '/', w: 1440, h: 900, scrollTo: '#works' },
  { name: 'home-mobile-390', path: '/', w: 390, h: 844, mobile: true },
  { name: 'home-mobile-menu-390', path: '/', w: 390, h: 844, mobile: true, menu: true },
  { name: 'home-mobile-landscape-844', path: '/', w: 844, h: 390, mobile: true },
  { name: 'home-works-mobile-390', path: '/', w: 390, h: 844, mobile: true, scrollTo: '#works' },
  { name: 'detail-desktop-1440', path: '/projects/rpg-hud-character-ui/', w: 1440, h: 900 },
  { name: 'detail-mobile-390', path: '/projects/rpg-hud-character-ui/', w: 390, h: 844, mobile: true },
];

const browser = await chromium.launch();
for (const s of shots) {
  const page = await browser.newPage({ viewport: { width: s.w, height: s.h }, hasTouch: s.mobile, isMobile: s.mobile });
  await page.goto(`http://localhost:${PORT}${s.path}`);
  await page.evaluate(() => document.fonts.ready);
  await page.waitForTimeout(1800);
  if (s.scrollTo) {
    await page.evaluate((sel) => document.querySelector(sel).scrollIntoView({ behavior: 'instant' }), s.scrollTo);
    await page.waitForTimeout(400);
  }
  if (s.menu) await page.click('[data-menu-toggle]');
  await page.screenshot({ path: join(OUT, `${s.name}.jpg`), type: 'jpeg', quality: 72 });
  await page.close();
  console.log('saved', s.name);
}
await browser.close();
server.close();
