import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { createRequire } from 'node:module';

const require = createRequire(import.meta.url);
const { chromium } = require('C:/Users/Administration/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright');
const dist = fileURLToPath(new URL('./dist/', import.meta.url));
const origin = 'https://aeris.local';
const browser = await chromium.launch({ channel: 'chrome', headless: true });
const page = await browser.newPage();
const errors = [];
page.on('pageerror', error => errors.push(String(error)));
await page.emulateMedia({ reducedMotion: 'reduce' });

// This is an offline behavior/layout check. rebuild_check verifies real imagery.
const mime = {
  '.html': 'text/html', '.js': 'text/javascript', '.css': 'text/css',
  '.svg': 'image/svg+xml', '.png': 'image/png', '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg', '.webp': 'image/webp', '.avif': 'image/avif',
  '.gif': 'image/gif', '.ico': 'image/x-icon', '.woff2': 'font/woff2',
  '.woff': 'font/woff', '.ttf': 'font/ttf', '.otf': 'font/otf',
  '.txt': 'text/plain', '.json': 'application/json', '.pdf': 'application/pdf',
};
await page.route('**/*', async route => {
  const url = new URL(route.request().url());
  if (url.origin !== origin) {
    const image = route.request().resourceType() === 'image';
    return route.fulfill({
      status: 200,
      contentType: image ? 'image/svg+xml' : 'text/css',
      body: image ? '<svg xmlns="http://www.w3.org/2000/svg" width="640" height="400"><rect width="640" height="400" fill="#999"/></svg>' : '',
    });
  }
  let pathname = decodeURIComponent(url.pathname);
  if (!path.extname(pathname)) pathname += '/index.html';
  try {
    await route.fulfill({
      body: await fs.readFile(path.join(dist, pathname)),
      contentType: mime[path.extname(pathname).toLowerCase()] || 'application/octet-stream',
    });
  } catch (error) {
    errors.push(`Local asset failed: ${pathname}: ${error.message}`);
    await route.fulfill({ status: 404, body: 'Not found' });
  }
});

const results = [];
try {
  for (const width of [1440, 768, 390]) {
    await page.setViewportSize({ width, height: 900 });
    for (const route of ['/', '/events/a4m-longevity-fest', '/hyperbarics', '/resources', '/blog']) {
      await page.goto(origin + route, { waitUntil: 'networkidle' });
      const layout = await page.evaluate(() => ({
        horizontalOverflow: document.documentElement.scrollWidth > innerWidth,
        pageWidth: document.documentElement.scrollWidth,
        viewportWidth: innerWidth,
        heading: document.querySelector('h1')?.textContent,
        mainHeight: document.querySelector('main')?.offsetHeight,
      }));
      results.push({ width, route, ...layout });
      if (layout.horizontalOverflow) {
        throw new Error(`Horizontal overflow at ${width}px on ${route}: page is ${layout.pageWidth}px wide`);
      }
    }
    await page.goto(origin + '/', { waitUntil: 'networkidle' });
    if (width === 1440) {
      await page.getByRole('button', { name: 'Products', exact: true }).hover();
      if (!await page.locator('.sh-product-menu').isVisible()) throw new Error('Products menu did not open');
      await page.keyboard.press('Escape');
    } else {
      await page.getByRole('button', { name: 'Toggle mobile menu' }).click();
      if (!await page.getByRole('dialog', { name: 'Navigation menu' }).isVisible()) throw new Error('Mobile menu did not open');
      await page.keyboard.press('Escape');
    }
    await page.locator('.product-card').first().click();
    await page.waitForURL(origin + '/products/fortius-420');
    if (await page.locator('[role=dialog]').count()) throw new Error('Product must open a full page');
    await page.goBack({ waitUntil: 'networkidle' });
    await page.locator('.sh-floating button').click();
    if (!await page.locator('.sh-quote-modal').isVisible()) throw new Error('Quote modal did not open');
    await page.keyboard.press('Escape');
    await page.locator('.pressure-section').evaluate(el => window.scrollTo(0, el.offsetTop + el.offsetHeight - innerHeight));
    await page.waitForFunction(() => document.querySelector('.gauge-value strong')?.textContent === '4.0');
    results.push({ width, flows: 'menu, product details, quote, gauge passed' });
  }
  if (errors.length) process.exitCode = 1;
} catch (error) {
  errors.push(error.message);
  process.exitCode = 1;
} finally {
  console.log(JSON.stringify({ passed: !errors.length, results, errors }, null, 2));
  await browser.close();
}
