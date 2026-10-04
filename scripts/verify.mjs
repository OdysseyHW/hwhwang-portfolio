// 빌드 결과(dist) 자동 점검 스크립트 — `npm run build && npm run verify`
// 정적 호스팅(GitHub Pages)과 같은 방식으로 dist를 띄운 뒤 Chromium·Firefox·WebKit으로 확인한다.
//   BASE_PATH=/portfolio  하위 경로 배포 빌드를 점검할 때 (빌드 때와 같은 값)
//   BROWSERS=chromium     특정 브라우저만 점검
//   SHOTS=1               verify-report/에 스크린샷 저장
import { createServer } from 'node:http';
import { readFile, stat, mkdir } from 'node:fs/promises';
import { extname, join, normalize } from 'node:path';
import { chromium, firefox, webkit } from 'playwright';

const DIST = new URL('../dist/', import.meta.url).pathname.replace(/^\/([A-Za-z]:)/, '$1');
const BASE = ('/' + (process.env.BASE_PATH ?? '').replace(/^\/|\/$/g, '') + '/').replace('//', '/');
const PORT = 4399;
const ORIGIN = `http://localhost:${PORT}`;
const WIDTHS = [320, 375, 390, 480, 600, 700, 768, 900, 1024, 1100, 1199, 1200, 1440, 1920];
const SHOTS = process.env.SHOTS === '1';
const engines = { chromium, firefox, webkit };
const selected = (process.env.BROWSERS ?? 'chromium,firefox,webkit').split(',');

// ---------- 정적 서버 (없는 주소 → 404.html, 상태 404) ----------
const types = { '.html': 'text/html; charset=utf-8', '.css': 'text/css', '.js': 'text/javascript', '.svg': 'image/svg+xml', '.png': 'image/png', '.webm': 'video/webm', '.xml': 'application/xml', '.txt': 'text/plain', '.webp': 'image/webp', '.jpg': 'image/jpeg' };
const server = createServer(async (req, res) => {
  const url = new URL(req.url, ORIGIN);
  let path = decodeURIComponent(url.pathname);
  const send404 = async () => {
    res.writeHead(404, { 'content-type': types['.html'] });
    res.end(await readFile(join(DIST, '404.html')));
  };
  if (!path.startsWith(BASE)) return send404();
  path = normalize(path.slice(BASE.length));
  let file = join(DIST, path);
  try {
    const s = await stat(file);
    if (s.isDirectory()) {
      if (!url.pathname.endsWith('/')) {
        res.writeHead(301, { location: url.pathname + '/' });
        return res.end();
      }
      file = join(file, 'index.html');
    }
    const body = await readFile(file);
    const type = types[extname(file)] ?? 'application/octet-stream';
    // 영상 등은 Range 요청을 지원해야 한다 (실제 정적 호스팅과 동일하게)
    const range = /bytes=(\d*)-(\d*)/.exec(req.headers.range ?? '');
    if (range) {
      const start = range[1] ? Number(range[1]) : body.length - Number(range[2]);
      const end = range[1] && range[2] ? Math.min(Number(range[2]), body.length - 1) : body.length - 1;
      res.writeHead(206, { 'content-type': type, 'accept-ranges': 'bytes', 'content-range': `bytes ${start}-${end}/${body.length}`, 'content-length': end - start + 1 });
      return res.end(body.subarray(start, end + 1));
    }
    res.writeHead(200, { 'content-type': type, 'accept-ranges': 'bytes', 'content-length': body.length });
    res.end(body);
  } catch {
    await send404();
  }
});
await new Promise((r) => server.listen(PORT, r));

// ---------- 결과 기록 ----------
const results = [];
// Playwright의 Windows용 WebKit은 미디어 재생 기능이 없어 <video>가 load 이벤트를 막는다 → DOM 준비 시점까지만 대기
const gotoOpts = (name) => (name === 'webkit' ? { waitUntil: 'domcontentloaded' } : {});
const fail = (browser, name, detail) => results.push({ browser, name, ok: false, detail });
const pass = (browser, name, detail = '') => results.push({ browser, name, ok: true, detail });
const check = (browser, name, cond, detail = '') => (cond ? pass(browser, name, detail) : fail(browser, name, detail));

if (SHOTS) await mkdir(new URL('../verify-report/', import.meta.url), { recursive: true });

const u = (p = '') => ORIGIN + BASE + p;

/** 페이지의 가로 넘침·잘림 요소 검사 */
async function layoutIssues(page) {
  return page.evaluate(() => {
    const vw = document.documentElement.clientWidth;
    const issues = [];
    if (document.documentElement.scrollWidth > vw + 1) issues.push(`page scrollWidth ${document.documentElement.scrollWidth} > ${vw}`);
    for (const el of document.querySelectorAll('body *')) {
      if (el.closest('dialog, .visually-hidden, .skip-link, svg')) continue;
      const r = el.getBoundingClientRect();
      if (r.width === 0 || r.height === 0) continue;
      if (r.right > vw + 1 || r.left < -1) issues.push(`${el.tagName.toLowerCase()}.${el.className} x:${Math.round(r.left)}–${Math.round(r.right)}`);
      // 텍스트가 고정 높이에 잘리는지
      const cs = getComputedStyle(el);
      if ((cs.overflow === 'hidden' || cs.overflowY === 'hidden') && el.scrollHeight > el.clientHeight + 2 && el.children.length === 0 && el.textContent.trim()) issues.push(`clipped text: ${el.tagName} "${el.textContent.trim().slice(0, 30)}"`);
    }
    return issues.slice(0, 8);
  });
}

async function scrollThrough(page) {
  await page.evaluate(async () => {
    for (let y = 0; y < document.body.scrollHeight; y += 400) {
      window.scrollTo(0, y);
      await new Promise((r) => setTimeout(r, 30));
    }
    window.scrollTo(0, 0);
  });
  await page.waitForTimeout(300);
}

async function brokenImages(page) {
  return page.evaluate(async () => {
    const imgs = [...document.images].filter((i) => !i.closest('dialog'));
    imgs.forEach((i) => (i.loading = 'eager'));
    await Promise.all(imgs.map((i) => (i.complete ? null : new Promise((r) => { i.onload = i.onerror = r; setTimeout(r, 5000); }))));
    return imgs.filter((i) => !i.complete || i.naturalWidth === 0).map((i) => i.currentSrc || i.src);
  });
}

async function headingOrder(page) {
  return page.evaluate(() => {
    const hs = [...document.querySelectorAll('h1,h2,h3,h4,h5,h6')].filter((h) => !h.closest('dialog'));
    const errs = [];
    let prev = 0;
    hs.forEach((h) => {
      const lv = Number(h.tagName[1]);
      if (prev && lv > prev + 1) errs.push(`${h.tagName} after H${prev}: ${h.textContent.trim().slice(0, 20)}`);
      prev = lv;
    });
    if (hs.filter((h) => h.tagName === 'H1').length !== 1) errs.push('H1 count != 1');
    return errs;
  });
}

for (const name of selected) {
  const browser = await engines[name].launch();
  const consoleErrors = [];
  const badResponses = [];

  const newPage = async (opts = {}) => {
    const ctx = await browser.newContext(opts);
    const page = await ctx.newPage();
    page.on('console', (m) => m.type() === 'error' && !(m.location()?.url ?? '').includes('does-not-exist') && consoleErrors.push(`${page.url()} :: ${m.text()}`));
    page.on('pageerror', (e) => consoleErrors.push(`${page.url()} :: ${e.message}`));
    page.on('response', (r) => r.status() >= 400 && !r.url().includes('does-not-exist') && badResponses.push(`${r.status()} ${r.url()}`));
    return { ctx, page };
  };

  // 링크 수집 (메인 → 상세)
  const { ctx: c0, page: p0 } = await newPage({ viewport: { width: 1280, height: 900 } });
  await p0.goto(u(), gotoOpts(name));
  const projectLinks = await p0.$$eval('.card__link', (as) => as.map((a) => a.getAttribute('href')));
  check(name, '메인: 프로젝트 카드 3개', projectLinks.length === 3, projectLinks.join(', '));
  const pages = [u(), ...projectLinks.map((h) => ORIGIN + h), u('does-not-exist/')];

  // 모든 내부 링크 상태
  const allLinks = new Set();
  for (const p of pages.slice(0, -1)) {
    await p0.goto(p, gotoOpts(name));
    (await p0.$$eval('a[href]', (as) => as.map((a) => a.href))).forEach((h) => allLinks.add(h.split('#')[0]));
  }
  for (const h of allLinks) {
    if (!h.startsWith(ORIGIN)) continue;
    const r = await p0.request.get(h);
    check(name, `링크 ${h.replace(ORIGIN, '')}`, r.status() === 200, String(r.status()));
  }
  await c0.close();

  // ---------- 너비별 레이아웃 ----------
  for (const w of WIDTHS) {
    const { ctx, page } = await newPage({ viewport: { width: w, height: 800 } });
    for (const p of pages) {
      const resp = await page.goto(p, gotoOpts(name));
      const expected = p.includes('does-not-exist') ? 404 : 200;
      if (w === 1200) check(name, `직접 접속 ${p.replace(ORIGIN, '')}`, resp.status() === expected, String(resp.status()));
      await scrollThrough(page);
      const issues = await layoutIssues(page);
      check(name, `레이아웃 ${w}px ${p.replace(ORIGIN, '')}`, issues.length === 0, issues.join(' | '));
      const broken = await brokenImages(page);
      if (broken.length) fail(name, `이미지 ${w}px ${p.replace(ORIGIN, '')}`, broken.join(', '));
      if (SHOTS && name === 'chromium' && [320, 390, 768, 1024, 1440].includes(w)) {
        const slug = p.replace(u(), '').replace(/\//g, '_') || 'home';
        await page.screenshot({ path: `verify-report/${slug}-${w}.png`, fullPage: true });
      }
    }
    // 그리드 열 수
    await page.goto(u(), gotoOpts(name));
    const cols = await page.$eval('.project-grid', (g) => getComputedStyle(g).gridTemplateColumns.split(' ').length);
    const want = w >= 1200 ? 3 : w >= 600 ? 2 : 1;
    check(name, `프로젝트 목록 ${w}px 열 수`, cols === want || (w < 640 && cols === 1), `${cols}열 (기대 ${want})`);
    await ctx.close();
  }

  // ---------- 제목 순서·기본 메타 ----------
  {
    const { ctx, page } = await newPage({ viewport: { width: 1280, height: 900 } });
    for (const p of pages) {
      await page.goto(p, gotoOpts(name));
      const errs = await headingOrder(page);
      check(name, `제목 순서 ${p.replace(ORIGIN, '')}`, errs.length === 0, errs.join(' | '));
      const meta = await page.evaluate(() => ({
        title: document.title,
        desc: document.querySelector('meta[name=description]')?.content,
        og: document.querySelector('meta[property="og:title"]')?.content,
        icon: document.querySelector('link[rel=icon]')?.href,
        lang: document.documentElement.lang,
      }));
      check(name, `메타 ${p.replace(ORIGIN, '')}`, Boolean(meta.title && meta.desc && meta.og && meta.icon && meta.lang === 'ko'), meta.title);
    }
    // 첫 Tab = 본문 바로가기
    await page.goto(u(), gotoOpts(name));
    // 헤드리스 WebKit(Windows)은 Tab 키 초점 이동이 동작하지 않아 프로그램으로 초점을 준 뒤 표시 여부만 확인
    if (name === 'webkit') await page.focus('.skip-link');
    else await page.keyboard.press('Tab');
    const first = await page.evaluate(() => document.activeElement?.className);
    const skipTop = await page.$eval('.skip-link', (el) => el.getBoundingClientRect().top);
    check(name, name === 'webkit' ? '본문 바로가기 링크: 초점 시 화면에 표시 (프로그램 초점)' : '첫 Tab: 본문 바로가기 링크 (초점 시 화면에 표시)', first === 'skip-link' && skipTop >= 0, String(skipTop));
    await page.keyboard.press('Enter');
    check(name, '본문 바로가기 이동', await page.evaluate(() => location.hash === '#main'));
    // 데스크톱 메뉴
    check(name, '데스크톱: 메뉴 버튼 숨김', !(await page.isVisible('[data-menu-toggle]')));
    check(name, '데스크톱: 메뉴 3개 표시', (await page.locator('#site-nav a:visible').count()) === 3);
    // 앵커 이동 시 제목이 헤더에 가리지 않음
    await page.click('#site-nav a[href$="#about"]');
    await page.waitForTimeout(900);
    const covered = await page.evaluate(() => {
      const h = document.querySelector('#about .section-title').getBoundingClientRect();
      const hd = document.querySelector('.site-header').getBoundingClientRect();
      return { title: Math.round(h.top), header: Math.round(hd.bottom) };
    });
    check(name, '앵커 이동: 제목이 고정 헤더 아래 보임', covered.title >= covered.header, JSON.stringify(covered));
    // 카드 클릭 → 상세
    await page.goto(u(), gotoOpts(name));
    await page.click('.card >> nth=0', { position: { x: 30, y: 30 } });
    await page.waitForLoadState(name === 'webkit' ? 'domcontentloaded' : 'load');
    check(name, '카드 이미지 영역 클릭 → 상세 이동', page.url().includes('/projects/'), page.url());
    // 상세 → 메뉴로 메인 영역 이동
    await page.click('#site-nav a[href$="#contact"]');
    await page.waitForLoadState(name === 'webkit' ? 'domcontentloaded' : 'load');
    check(name, '상세 → Contact 메뉴 이동', page.url().endsWith(`${BASE}#contact`) && (await page.isVisible('#contact')), page.url());
    await ctx.close();
  }

  // ---------- 모바일 메뉴 ----------
  for (const vp of [{ width: 375, height: 667 }, { width: 320, height: 568 }]) {
    const { ctx, page } = await newPage({ viewport: vp, hasTouch: name !== 'firefox' });
    await page.goto(u('projects/inventory-shop-ui/'), gotoOpts(name));
    const t = page.locator('[data-menu-toggle]');
    check(name, `${vp.width}px: 메뉴 버튼 표시`, await t.isVisible());
    const box = await t.boundingBox();
    check(name, `${vp.width}px: 메뉴 버튼 44×44 이상`, box.width >= 44 && box.height >= 44, `${box.width}×${box.height}`);
    check(name, `${vp.width}px: 메뉴 닫힘 상태`, !(await page.isVisible('#site-nav a')));
    await t.click();
    check(name, `${vp.width}px: 열림 aria-expanded=true`, (await t.getAttribute('aria-expanded')) === 'true');
    check(name, `${vp.width}px: 열면 첫 링크로 초점`, await page.evaluate(() => document.activeElement?.textContent === 'Works'));
    await page.keyboard.press('Escape');
    check(name, `${vp.width}px: Esc로 닫힘 + 버튼으로 초점 복원`, (await t.getAttribute('aria-expanded')) === 'false' && (await page.evaluate(() => document.activeElement?.hasAttribute('data-menu-toggle'))));
    await t.click();
    await page.click('#site-nav a[href$="#about"]');
    await page.waitForLoadState(name === 'webkit' ? 'domcontentloaded' : 'load');
    check(name, `${vp.width}px: 메뉴 링크로 About 이동`, page.url().endsWith(`${BASE}#about`), page.url());
    check(name, `${vp.width}px: 이동 후 메뉴 닫힘`, (await t.getAttribute('aria-expanded')) === 'false');
    // 바깥 클릭으로 닫기
    await t.click();
    await page.mouse.click(vp.width / 2, vp.height - 40);
    check(name, `${vp.width}px: 바깥 클릭으로 닫힘`, (await t.getAttribute('aria-expanded')) === 'false');
    await ctx.close();
  }

  // ---------- 확대 뷰어 ----------
  for (const vp of [{ width: 1280, height: 800, label: '데스크톱' }, { width: 390, height: 844, label: '모바일 세로' }, { width: 844, height: 390, label: '모바일 가로' }]) {
    const { ctx, page } = await newPage({ viewport: { width: vp.width, height: vp.height }, hasTouch: vp.label !== '데스크톱' && name !== 'firefox' });
    await page.goto(u('projects/rpg-hud-character-ui/'), gotoOpts(name));
    const btn = page.locator('[data-zoom]').nth(2);
    await btn.scrollIntoViewIfNeeded();
    const before = await page.evaluate(() => window.scrollY);
    await btn.click();
    const dlg = page.locator('[data-lightbox]');
    check(name, `${vp.label}: 뷰어 열림`, await dlg.isVisible());
    check(name, `${vp.label}: 배경 스크롤 잠금`, await page.evaluate(() => getComputedStyle(document.documentElement).overflow === 'hidden'));
    check(name, `${vp.label}: 열리면 닫기 버튼에 초점`, await page.evaluate(() => document.activeElement?.getAttribute('data-lb') === 'close'));
    // 모든 조작 버튼이 화면 안 + 44px
    const ctrls = await page.$$eval('[data-lightbox] .lb-btn', (bs) => bs.map((b) => { const r = b.getBoundingClientRect(); return { t: b.textContent.trim() || b.getAttribute('aria-label'), r: [r.left, r.top, r.right, r.bottom, r.width, r.height] }; }));
    const bad = ctrls.filter((c) => c.r[0] < 0 || c.r[1] < 0 || c.r[2] > vp.width || c.r[3] > vp.height || c.r[4] < 44 || c.r[5] < 44);
    check(name, `${vp.label}: 뷰어 버튼 화면 안·44px 이상`, bad.length === 0, bad.map((b) => b.t).join(','));
    const vpBox = await page.locator('[data-lb-viewport]').boundingBox();
    check(name, `${vp.label}: 이미지 영역 확보`, vpBox.height >= vp.height * 0.45, `${Math.round(vpBox.height)}px`);
    const scale0 = await page.textContent('[data-lb-scale]');
    await page.click('[data-lb="in"]');
    await page.click('[data-lb="in"]');
    const scale1 = await page.textContent('[data-lb-scale]');
    check(name, `${vp.label}: 확대 버튼`, parseInt(scale1) > parseInt(scale0), `${scale0} → ${scale1}`);
    // 드래그 이동
    const tf0 = await page.$eval('[data-lb-img]', (i) => i.style.transform);
    const cx = vpBox.x + vpBox.width / 2, cy = vpBox.y + vpBox.height / 2;
    await page.mouse.move(cx, cy);
    await page.mouse.down();
    await page.mouse.move(cx + 60, cy + 40, { steps: 5 });
    await page.mouse.up();
    const tf1 = await page.$eval('[data-lb-img]', (i) => i.style.transform);
    check(name, `${vp.label}: 확대 이미지 드래그 이동`, tf0 !== tf1, `${tf0} → ${tf1}`);
    await page.keyboard.press('-');
    check(name, `${vp.label}: 키보드 축소`, parseInt(await page.textContent('[data-lb-scale]')) < parseInt(scale1));
    await page.click('[data-lb="fit"]');
    check(name, `${vp.label}: 화면 맞춤`, (await page.textContent('[data-lb-scale]')) === scale0);
    // 이미지가 뷰포트 안에 들어가는지 (맞춤 상태)
    const fitOk = await page.evaluate(() => { const v = document.querySelector('[data-lb-viewport]').getBoundingClientRect(); const i = document.querySelector('[data-lb-img]').getBoundingClientRect(); return i.width <= v.width + 1 && i.height <= v.height + 1 && i.left >= v.left - 1 && i.top >= v.top - 1; });
    check(name, `${vp.label}: 맞춤 시 이미지 전체 표시(비율 유지)`, fitOk);
    const orig = await page.getAttribute('[data-lb-original]', 'href');
    check(name, `${vp.label}: 원본 링크`, (await page.request.get(new URL(orig, page.url()).href)).status() === 200, orig);
    // Tab 순환
    for (let i = 0; i < 12; i++) await page.keyboard.press('Tab');
    check(name, `${vp.label}: Tab 초점이 뷰어 안에 머묾`, await page.evaluate(() => Boolean(document.activeElement?.closest('[data-lightbox]'))));
    await page.keyboard.press('Escape');
    await page.waitForTimeout(100);
    check(name, `${vp.label}: Esc로 닫힘`, !(await dlg.isVisible()));
    check(name, `${vp.label}: 초점 복원`, await page.evaluate(() => document.activeElement === document.querySelectorAll('[data-zoom]')[2]));
    const after = await page.evaluate(() => window.scrollY);
    check(name, `${vp.label}: 스크롤 위치 복원`, Math.abs(after - before) < 2, `${before} → ${after}`);
    check(name, `${vp.label}: 스크롤 잠금 해제`, await page.evaluate(() => getComputedStyle(document.documentElement).overflow !== 'hidden'));
    // 닫기 버튼
    await btn.click();
    await page.click('[data-lb="close"]');
    check(name, `${vp.label}: 닫기 버튼`, !(await dlg.isVisible()));
    await ctx.close();
  }

  // ---------- 영상 / 선택 항목 숨김 ----------
  {
    const { ctx, page } = await newPage({ viewport: { width: 1280, height: 900 } });
    await page.goto(u('projects/rpg-hud-character-ui/'), gotoOpts(name));
    const v = await page.$eval('video', (el) => ({ preload: el.getAttribute('preload'), autoplay: el.autoplay, poster: Boolean(el.poster), controls: el.controls }));
    check(name, '영상: 포스터·preload=none·자동재생 없음', v.preload === 'none' && !v.autoplay && v.poster && v.controls, JSON.stringify(v));
    await page.goto(u('projects/inventory-shop-ui/'), gotoOpts(name));
    const info = await page.evaluate(() => ({
      overview: [...document.querySelectorAll('.overview dt')].map((d) => d.textContent),
      video: document.querySelectorAll('video').length,
      emptySections: [...document.querySelectorAll('.project-section')].filter((s) => s.children.length < 2).length,
    }));
    check(name, '선택 항목 없는 프로젝트: 빈 항목 숨김', !info.overview.includes('기간') && !info.overview.includes('장르') && info.video === 0 && info.emptySections === 0, JSON.stringify(info));
    await ctx.close();
  }

  // ---------- 200% 확대 (1280px 창 = CSS 640px) ----------
  {
    const { ctx, page } = await newPage({ viewport: { width: 640, height: 400 }, deviceScaleFactor: 2 });
    for (const p of pages) {
      await page.goto(p, gotoOpts(name));
      const issues = await layoutIssues(page);
      check(name, `200% 확대(640×400) ${p.replace(ORIGIN, '')}`, issues.length === 0, issues.join(' | '));
    }
    await ctx.close();
  }

  // ---------- 글자만 200% 확대 (브라우저 '텍스트만 확대'·글자 크기 설정과 같은 효과) ----------
  for (const w of [320, 375, 768, 1280]) {
    const { ctx, page } = await newPage({ viewport: { width: w, height: 800 } });
    for (const p of pages) {
      await page.goto(p, gotoOpts(name));
      await page.addStyleTag({ content: 'html { font-size: 200% !important; }' });
      await page.waitForTimeout(100);
      const issues = await layoutIssues(page);
      check(name, `글자 200%(${w}px) ${p.replace(ORIGIN, '')}`, issues.length === 0, issues.join(' | '));
    }
    // 글자 확대 상태에서도 메뉴 동작
    await page.goto(u(), gotoOpts(name));
    await page.addStyleTag({ content: 'html { font-size: 200% !important; }' });
    const toggleVisible = await page.isVisible('[data-menu-toggle]');
    if (toggleVisible) await page.click('[data-menu-toggle]');
    const navOk = (await page.locator('#site-nav a:visible').count()) === 3;
    check(name, `글자 200%(${w}px) 메뉴 3개 접근 가능`, navOk, toggleVisible ? '메뉴 버튼 사용' : '전체 메뉴');
    await ctx.close();
  }

  check(name, '콘솔 오류 없음', consoleErrors.length === 0, consoleErrors.slice(0, 5).join(' | '));
  check(name, '실패한 요청 없음 (의도한 404 제외)', badResponses.length === 0, badResponses.slice(0, 5).join(' | '));
  await browser.close();
}

server.close();

// ---------- 출력 ----------
const failed = results.filter((r) => !r.ok);
for (const b of selected) {
  const rs = results.filter((r) => r.browser === b);
  console.log(`\n[${b}] ${rs.filter((r) => r.ok).length}/${rs.length} 통과`);
}
if (failed.length) {
  console.log('\n실패 항목:');
  for (const f of failed) console.log(`  ✗ [${f.browser}] ${f.name} — ${f.detail}`);
  process.exitCode = 1;
} else console.log('\n모든 항목 통과');
