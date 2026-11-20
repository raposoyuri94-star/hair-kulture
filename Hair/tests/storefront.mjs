import { chromium } from '@playwright/test';
import assert from 'node:assert/strict';
const browser = await chromium.launch({ channel: 'msedge', headless: true });
try {
  const page = await browser.newPage({ viewport: { width: 1440, height: 1000 } });
  const errors = [];
  page.on('pageerror', error => errors.push(error.message));
  await page.goto('http://127.0.0.1:5176/');
  assert.equal(await page.locator('.product-card').count(), 3);
  assert.equal(await page.locator('#shop .price-config').count(), 0);
  const dialog = page.getByRole('dialog');
  const add = async (name, length, option) => {
    await page.getByRole('button', { name: 'Escolher ' + name, exact: true }).click();
    await dialog.getByLabel('Comprimento', { exact: true }).selectOption(length);
    await dialog.locator('select').nth(1).selectOption(option);
    await dialog.getByRole('button', { name: 'Adicionar ao carrinho', exact: true }).click();
  };
  await add('Half Wigs', '20', '6'); // 10,100 MT.
  await add('Half Wigs', '20', '6'); // Same variant merges.
  await add('Half Wigs', '22', '0'); // Distinct length remains separate: 8,100 MT.
  await add('Saias', '12', '1'); // 5,850 MT per 2-saias set.
  await page.getByRole('button', { name: 'Abrir carrinho, 4 artigos', exact: true }).click();
  const amount = async () => (await page.locator('.subtotal strong').innerText()).replace(/\s/g, '');
  assert.equal(await page.locator('.bag-item').count(), 3);
  assert.equal(await page.locator('.bag-item').first().locator('.quantity span').innerText(), '2');
  assert.match(await page.locator('.bag-item').first().innerText(), /20 polegadas · 300%/);
  assert.equal(await amount(), '34150MT');
  await dialog.getByRole('button', { name: 'Diminuir quantidade de Half Wigs 20 300%', exact: true }).click();
  assert.equal(await amount(), '24050MT');
  await dialog.getByRole('button', { name: 'Simular encomenda', exact: true }).click();
  assert.match(await page.locator('.checkout-notice').innerText(), /nenhuma encomenda foi efectuada/);
  await page.keyboard.press('Escape');
  await page.reload();
  await page.getByRole('button', { name: 'Abrir carrinho, 3 artigos', exact: true }).click();
  assert.equal(await amount(), '24050MT');
  await dialog.getByRole('button', { name: 'Diminuir quantidade de Half Wigs 20 300%', exact: true }).click();
  assert.equal(await page.locator('.bag-item').count(), 2);
  assert.equal(await amount(), '13950MT');
  await page.keyboard.press('Escape');
  await page.getByRole('button', { name: 'Guardar nos favoritos: Saias', exact: true }).click();
  await page.getByRole('button', { name: 'Favoritos (1)', exact: true }).click();
  assert.equal(await page.locator('.product-card').count(), 1);
  await page.getByRole('button', { name: 'Todos', exact: true }).click();
  await page.getByRole('button', { name: 'Pesquisar produtos', exact: true }).click();
  await page.getByPlaceholder('Pesquisar por tipo de cabelo...').fill('not-a-product');
  await page.getByRole('heading', { name: 'Nenhum produto encontrado.' }).waitFor();
  await page.getByRole('button', { name: 'Fechar pesquisa' }).click();
  await page.getByRole('button', { name: 'Descubra o seu cabelo ideal' }).click();
  await dialog.getByRole('button', { name: /Saias/ }).click();
  assert.equal(await page.locator('.product-card').count(), 1);
  await page.getByRole('button', { name: 'Todos', exact: true }).click();
  await page.setViewportSize({ width: 390, height: 844 });
  await page.getByRole('button', { name: 'Abrir ou fechar menu' }).click();
  await page.getByRole('navigation', { name: 'Navegação móvel' }).getByRole('button', { name: 'Half Wigs', exact: true }).click();
  assert.equal(await page.locator('.product-card').count(), 1);
  assert.ok(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth));
  await page.getByRole('button', { name: 'Escolher Half Wigs', exact: true }).click();
  assert.ok(await dialog.getByRole('button', { name: 'Adicionar ao carrinho', exact: true }).isVisible());
  assert.ok(await dialog.evaluate(element => element.scrollWidth <= element.clientWidth));
  assert.deepEqual(errors, []);
  console.log('PASS: three cards, configuration modal, variant cart, merging, totals, quantity removal, persistence, favorites, search, guide, mobile navigation and layout.');
} finally {
  await browser.close();
}
