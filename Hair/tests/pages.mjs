import { chromium } from '@playwright/test';
import assert from 'node:assert/strict';

const base = process.env.PAGES_TEST_URL || 'http://127.0.0.1:5176/hair-kulture/';
const browser = await chromium.launch({ channel: 'msedge', headless: true });
try {
  const page = await browser.newPage({ viewport: { width: 1440, height: 1000 } });
  const missing = [];
  page.on('response', response => { if (response.status() === 404) missing.push(response.url()); });
  await page.goto(base);
  assert.equal(await page.locator('.product-card').count(), 3);
  await page.getByRole('button', { name: 'Escolher Saias', exact: true }).click();
  await page.getByRole('dialog').getByLabel('Comprimento', { exact: true }).selectOption('20');
  await page.getByRole('dialog').getByRole('button', { name: 'Adicionar ao carrinho', exact: true }).click();
  await page.getByRole('navigation').getByRole('link', { name: 'Galeria', exact: true }).click();
  await page.waitForURL(url => url.pathname.replace(/\/$/, '') === new URL(base + 'gallery').pathname);
  await page.getByRole('heading', { name: 'Galeria', level: 1 }).waitFor();
  for (const image of await page.locator('.gallery-photo img').all()) {
    await image.scrollIntoViewIfNeeded();
    await image.evaluate(img => img.decode());
  }
  for (const video of await page.locator('.gallery-videos video').all()) {
    await video.scrollIntoViewIfNeeded();
    await video.evaluate(clip => clip.play());
    assert.ok(await video.evaluate(clip => clip.videoWidth > 0));
  }
  await page.getByRole('navigation').getByRole('link', { name: 'Sobre', exact: true }).click();
  await page.waitForURL(url => url.pathname.replace(/\/$/, '') === new URL(base + 'about').pathname);
  await page.goto(base + 'about/');
  await page.reload();
  await page.getByRole('heading', { level: 1, name: /Mais do que cabelo/ }).waitFor();
  await page.getByRole('button', { name: 'Abrir carrinho, 1 artigos', exact: true }).click();
  assert.match(await page.locator('.bag-item').innerText(), /20 polegadas/);
  assert.deepEqual(missing, []);
  console.log('PASS: Pages subpath, gallery media, dedicated pages, reload and cart persistence; no missing assets.');
} finally { await browser.close(); }
