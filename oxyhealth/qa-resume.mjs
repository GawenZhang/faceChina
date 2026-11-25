import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { createRequire } from 'node:module';

// Behavioral regression checks. Remote media is stubbed so these tests require
// no internet access; visual fidelity is checked separately by rebuild_check.
const require = createRequire(import.meta.url);
const { chromium } = require('C:/Users/Administration/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright');
const dist = fileURLToPath(new URL('./dist/', import.meta.url));
const origin = 'https://aeris.local';
const browser = await chromium.launch({ channel: 'chrome', headless: true });
const page = await browser.newPage({ acceptDownloads: true });
page.setDefaultTimeout(7000);
await page.emulateMedia({ reducedMotion: 'reduce' });
const errors = [];
const localFailures = [];
page.on('pageerror', error => errors.push(String(error)));
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
  const filename = path.join(dist, pathname);
  const mime = { '.js': 'text/javascript', '.css': 'text/css', '.svg': 'image/svg+xml', '.woff2': 'font/woff2', '.txt': 'text/plain' };
  try {
    await route.fulfill({ body: await fs.readFile(filename), contentType: mime[path.extname(filename)] || 'text/html' });
  } catch (error) {
    localFailures.push(`${url.pathname}: ${error.message}`);
    await route.fulfill({ status: 404, body: 'Not found' });
  }
});

const results = [];
async function check(name, run) {
  try { await run(); results.push({ name, passed: true }); }
  catch (error) { results.push({ name, passed: false, error: error.message }); }
}
async function visit(route) {
  await page.goto(origin + route, { waitUntil: 'networkidle' });
  await page.locator('main').waitFor();
}

async function checkModal(trigger, dialog) {
  const oldOverflow = await page.evaluate(() => document.body.style.overflow);
  await trigger.focus();
  await trigger.press('Enter');
  await dialog.waitFor({ state: 'visible' });
  assert(await dialog.evaluate(el => el.contains(document.activeElement)), 'Opening a dialog must move keyboard focus inside');
  assert.equal(await page.evaluate(() => document.body.style.overflow), 'hidden', 'Background scrolling must be locked');

  const focusable = dialog.locator('button:not([disabled]),a[href],input:not([disabled]),select:not([disabled]),textarea:not([disabled]),[tabindex="0"]');
  const first = focusable.first();
  const last = focusable.last();
  await last.focus();
  await page.keyboard.press('Tab');
  assert(await first.evaluate(el => el === document.activeElement), 'Tab from the last control must wrap to the first');
  await first.focus();
  await page.keyboard.press('Shift+Tab');
  assert(await last.evaluate(el => el === document.activeElement), 'Shift+Tab from the first control must wrap to the last');
  await page.keyboard.press('Escape');
  await dialog.waitFor({ state: 'hidden' });
  assert(await trigger.evaluate(el => el === document.activeElement), 'Closing a dialog must restore focus to the opener');
  assert.equal(await page.evaluate(() => document.body.style.overflow), oldOverflow, 'Closing a dialog must restore scrolling');
}

async function checkNavigation(link, target) {
  assert.equal(await link.getAttribute('href'), target);
  await page.evaluate(() => { window.__previousDocument = true; });
  await link.click();
  await page.waitForURL(origin + target);
  await page.locator('main h1').waitFor();
  assert.equal(await page.evaluate(() => Boolean(window.__previousDocument)), false, 'Detail must be a new document');
  assert.equal(await page.locator('[role="dialog"]').count(), 0);
  await page.reload({waitUntil:'networkidle'});
  await page.locator('main h1').waitFor();
  await page.goBack({waitUntil:'networkidle'});
}

async function checkDownload(control) {
  const before = page.url();
  const [download] = await Promise.all([page.waitForEvent('download'), control.click()]);
  assert.match(download.suggestedFilename(), /checklist.*\.txt$/i);
  const downloaded = await download.path();
  assert(downloaded, 'Download must produce a file');
  const content = await fs.readFile(downloaded, 'utf8');
  assert.match(content, /1\./, 'Checklist must contain the first item');
  assert.match(content, /15\./, 'Checklist must contain all fifteen items');
  assert.equal(page.url(), before, 'Downloading must keep the current page open');
}

try {
  for (const width of [1440, 390]) {
    await page.setViewportSize({ width, height: 900 });
    await check(`${width}: product full-page navigation lifecycle`, async () => {
      await visit('/');
      await checkNavigation(page.locator('.product-card').first(), '/products/fortius-420');
    });
    await check(`${width}: Finance navigation reaches independent page`, async () => {
      await visit('/');
      await checkNavigation(page.locator('.sh-footer').getByRole('link', { name: 'Finance', exact: true }), '/finance');
    });
    await check(`${width}: Contact navigation reaches independent page`, async () => {
      await visit('/');
      await checkNavigation(page.locator('.sh-footer').getByRole('link', { name: 'Contact', exact: true }), '/contact');
    });
    await check(`${width}: homepage checklist downloads`, async () => {
      await visit('/');
      await checkDownload(page.getByRole('button', { name: 'Download Free Checklist' }));
    });
    await check(`${width}: resource checklist downloads`, async () => {
      await visit('/resources');
      await checkDownload(page.getByRole('link', { name: 'Download Free Checklist' }));
    });
    await check(`${width}: resource video dialog keyboard lifecycle`, async () => {
      await visit('/resources');
      await checkModal(page.locator('.sr-video-thumb').first(), page.locator('.sr-video-modal'));
    });
    await check(`${width}: article full-page navigation lifecycle`, async () => {
      await visit('/blog');
      await checkNavigation(page.locator('.sr-blog-card .sr-read').first(), '/blog/fda-hyperbaric-chambers-wellness-devices-not-exempt');
    });
    await check(`${width}: event inquiry keyboard lifecycle`, async () => {
      await visit('/events/a4m-longevity-fest');
      await checkModal(page.locator('.sr-private-demo').getByRole('button', { name: 'Submit an Inquiry' }), page.getByRole('dialog', { name: 'Arrange a demonstration' }));
    });
  }
  await page.setViewportSize({ width: 1440, height: 900 });
  await check('desktop: pointer click keeps Products links available', async () => {
    await visit('/');
    const trigger = page.getByRole('button', { name: 'Products', exact: true });
    await trigger.hover();
    await page.locator('.sh-product-menu').waitFor({ state: 'visible' });
    await trigger.click();
    assert.equal(await trigger.getAttribute('aria-expanded'), 'true', 'Click must not undo the menu opened by pointer arrival');
    await checkNavigation(page.locator('.sh-product-menu a').first(), '/products/fortius-420');
  });
  await check('desktop: Products Escape restores trigger focus', async () => {
    await visit('/');
    await page.mouse.move(0, 0);
    const trigger = page.getByRole('button', { name: 'Products', exact: true });
    await trigger.focus();
    await trigger.press('Enter');
    await page.locator('.sh-product-menu').waitFor({ state: 'visible' });
    await trigger.press('Space');
    await page.locator('.sh-product-menu').waitFor({ state: 'hidden' });
    await trigger.press('Space');
    await page.locator('.sh-product-menu').waitFor({ state: 'visible' });
    await page.locator('.sh-product-menu a').first().focus();
    await page.keyboard.press('Escape');
    await page.locator('.sh-product-menu').waitFor({ state: 'hidden' });
    assert(await trigger.evaluate(el => el === document.activeElement), 'Desktop menu must restore focus to Products');
  });
  console.log(JSON.stringify({ passed: results.every(result => result.passed) && !errors.length && !localFailures.length, results, errors, localFailures }, null, 2));
  if (results.some(result => !result.passed) || errors.length || localFailures.length) process.exitCode = 1;
} finally {
  await browser.close();
}
