import { chromium } from '@playwright/test';
import assert from 'node:assert/strict';
const browser = await chromium.launch({ channel: 'msedge', headless: true });
try {
  const page = await browser.newPage({ viewport: { width: 1440, height: 1000 } });
  await page.goto('http://127.0.0.1:5176/');
  await page.getByRole('navigation').getByRole('link', { name: 'Galeria', exact: true }).click();
  await page.waitForURL('**/gallery');
  await page.getByRole('heading', { name: 'Galeria', level: 1 }).waitFor();
  assert.equal(await page.locator('.gallery-videos video').count(), 3);
  for (const clip of await page.locator('.gallery-videos video').all()) {
    await clip.scrollIntoViewIfNeeded();
    await clip.evaluate(video => video.play());
    assert.ok(await clip.evaluate(video => video.readyState >= 2 && video.videoWidth > 0 && video.muted && video.loop && !video.controls && video.videoWidth === 720 && video.videoHeight === 1280));
  }
  assert.equal(await page.locator('.gallery-photo').count(), 3);
  for (const img of await page.locator('.gallery-photo img').all()) {
    await img.scrollIntoViewIfNeeded();
    await img.evaluate(image => image.decode());
    assert.ok(await img.evaluate(image => image.naturalWidth > 0));
  }
  const photo = page.getByRole('button', { name: 'Ampliar: Texturas com personalidade', exact: true });
  await photo.click();
  assert.ok(await page.getByRole('dialog').isVisible());
  await page.keyboard.press('Escape');
  assert.equal(await page.getByRole('dialog').count(), 0);
  assert.ok(await photo.evaluate(element => element === document.activeElement));
  await page.reload();
  await page.getByRole('heading', { name: 'Galeria', level: 1 }).waitFor();
  await page.setViewportSize({ width: 390, height: 844 });
  assert.ok(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth));
  await page.getByRole('button', { name: 'Abrir ou fechar menu' }).click();
  await page.getByRole('navigation', { name: 'Navegação móvel' }).getByRole('button', { name: 'Saias', exact: true }).click();
  await page.waitForURL('**/?category=Saias#shop');
  assert.equal(await page.locator('.product-card').count(), 1);
  console.log('PASS: gallery navigation, image loading, enlargement, Escape and focus, direct reload, mobile layout and shop links.');
} finally { await browser.close(); }
