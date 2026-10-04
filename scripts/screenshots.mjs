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
  { name: 'menu-open-desktop-1440', path: '/', w: 1440, h: 900, menu: true },
  // R2 화면 폭 레이아웃 — CSS viewport 기준, deviceScaleFactor 1 (캡처 픽셀 = CSS 픽셀)
  { name: 'wide-home-1920', path: '/', w: 1920, h: 1080 },
  { name: 'wide-menu-1920', path: '/', w: 1920, h: 1080, menu: true },
  { name: 'wide-home-2560', path: '/', w: 2560, h: 1440 },
  { name: 'wide-menu-2560', path: '/', w: 2560, h: 1440, menu: true },
  { name: 'wide-home-3840', path: '/', w: 3840, h: 2160 },
  { name: 'wide-menu-3840', path: '/', w: 3840, h: 2160, menu: true },
  { name: 'menu-open-landscape-844', path: '/', w: 844, h: 390, mobile: true, menu: true },
  { name: 'menu-open-detail-768', path: '/projects/rpg-hud-character-ui/', w: 768, h: 1024, menu: true },
  { name: 'home-mobile-landscape-844', path: '/', w: 844, h: 390, mobile: true },
  { name: 'home-mobile-landscape-667', path: '/', w: 667, h: 375, mobile: true },
  // 글자 크기 200% 설정 재현 (html font-size) — 실제 브라우저 확대 기능의 완전한 대체는 아님
  { name: 'home-mobile-text200-390', path: '/', w: 390, h: 844, mobile: true, textZoom: true },
  { name: 'home-mobile-text200-390-full', path: '/', w: 390, h: 844, mobile: true, textZoom: true, fullPage: true },
  { name: 'home-mobile-landscape-844-text200', path: '/', w: 844, h: 390, mobile: true, textZoom: true },
  // 헤드라인 교체 검증용 임시 데이터(한글) — 화면에서만 바꿔 넣음, 실제 콘텐츠 아님
  { name: 'fixture-headline-ko-390', path: '/', w: 390, h: 844, mobile: true, fixture: { lang: 'ko', lines: ['플레이를', '설계하는', '게임 UI 디자이너'] } },
  { name: 'fixture-headline-ko-1440', path: '/', w: 1440, h: 900, fixture: { lang: 'ko', lines: ['플레이를', '설계하는', '게임 UI 디자이너'] } },
  { name: 'home-desktop-text200-1440', path: '/', w: 1440, h: 900, textZoom: true },
  { name: 'home-works-mobile-390', path: '/', w: 390, h: 844, mobile: true, scrollTo: '#works' },
  { name: 'detail-desktop-1440', path: '/projects/rpg-hud-character-ui/', w: 1440, h: 900 },
  { name: 'detail-mobile-390', path: '/projects/rpg-hud-character-ui/', w: 390, h: 844, mobile: true },
];

const browser = await chromium.launch();
for (const s of shots) {
  const ctx = await browser.newContext({ viewport: { width: s.w, height: s.h }, deviceScaleFactor: 1, hasTouch: s.mobile, isMobile: s.mobile });
  // 입장 연출(REQ-006)이 끝난 상태를 찍는다 (같은 탭 재방문처럼)
  await ctx.addInitScript(() => { try { sessionStorage.setItem('hw-intro-played', '1'); } catch {} });
  const page = await ctx.newPage();
  await page.goto(`http://localhost:${PORT}${s.path}`);
  await page.evaluate(() => document.fonts.ready);
  await page.waitForTimeout(1800);
  if (s.scrollTo) {
    await page.evaluate((sel) => document.querySelector(sel).scrollIntoView({ behavior: 'instant' }), s.scrollTo);
    await page.waitForTimeout(400);
  }
  if (s.textZoom) {
    await page.addStyleTag({ content: 'html { font-size: 200% !important; }' });
    await page.waitForTimeout(300);
  }
  if (s.fixture) {
    await page.evaluate(({ lines, lang }) => {
      const h1 = document.querySelector('#hero-title');
      const tpl = h1.querySelector('.hero__line').cloneNode(false);
      h1.lang = lang;
      h1.replaceChildren(...lines.flatMap((t, i) => { const sp = tpl.cloneNode(false); sp.textContent = t; return i ? [' ', sp] : [sp]; }));
    }, s.fixture);
    await page.waitForTimeout(200);
  }
  if (s.menu) {
    await page.$eval('[data-menu-toggle]', (b) => /** @type {HTMLButtonElement} */ (b).click()); // 스크롤 없는 실제 클릭
    await page.waitForTimeout(900); // 전체 화면 메뉴 열림 전환 완료 후 캡처
  }
  await page.screenshot({ path: join(OUT, `${s.name}.jpg`), type: 'jpeg', quality: 72, fullPage: Boolean(s.fullPage) });
  await ctx.close();
  console.log('saved', s.name);
}
await browser.close();
server.close();
