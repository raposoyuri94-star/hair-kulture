import { chromium } from '@playwright/test';
import assert from 'node:assert/strict';

const browser = await chromium.launch({ channel: 'msedge', headless: true });
try {
  const page = await browser.newPage({ viewport: { width: 1440, height: 1000 } });
  await page.goto('http://127.0.0.1:5176/');
  await page.getByRole('button', { name: 'Escolher Half Wigs', exact: true }).click();
  const selector = page.getByRole('dialog');
  const length = selector.getByLabel('Comprimento', { exact: true });
  const amount = async () => (await selector.locator('.price-result strong').innerText()).replace(/\s/g, '');
  assert.equal(await amount(), '5000MT');
  await length.selectOption('30');
  await selector.getByLabel('Densidade', { exact: true }).selectOption({ label: '300%' });
  assert.equal(await amount(), '21300MT');
  await page.keyboard.press('Escape');
  await page.getByRole('button', { name: 'Escolher Saias', exact: true }).click();
  await length.selectOption('32');
  await selector.getByLabel('Textura', { exact: true }).selectOption('1');
  assert.equal(await amount(), '14250MT');
  await length.selectOption('12');
  await selector.getByLabel('Textura', { exact: true }).selectOption('0');
  assert.equal(await amount(), '5350MT');
  await length.selectOption('32');
  await page.keyboard.press('Escape');
  await page.getByRole('button', { name: 'Escolher Closure / Frontal Laces', exact: true }).click();
  assert.equal(await length.inputValue(), '10');
  const lace = selector.getByLabel('Tipo de lace', { exact: true });
  await lace.selectOption({ label: '7x7' });
  assert.equal(await amount(), 'Preçoindisponível');
  assert.ok(await selector.getByRole('button', { name: 'Adicionar ao carrinho', exact: true }).isDisabled());
  await length.selectOption('12');
  assert.equal(await amount(), '5400MT');
  await length.selectOption('24');
  await lace.selectOption({ label: '2x6' });
  assert.equal(await amount(), 'Preçoindisponível');
  assert.ok(await selector.getByRole('button', { name: 'Adicionar ao carrinho', exact: true }).isDisabled());
  await lace.selectOption({ label: '13x6 HD' });
  assert.equal(await amount(), '9500MT');
  assert.equal(await lace.locator('option').count(), 18);
  await page.setViewportSize({ width: 390, height: 844 });
  await selector.scrollIntoViewIfNeeded();
  assert.ok(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth));
  await page.setViewportSize({ width: 320, height: 700 });
  assert.ok(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth));
  console.log('PASS: category cards and option prices, unavailable combinations, fresh length selection, 18 lace types, mobile layout.');
} finally {
  await browser.close();
}
