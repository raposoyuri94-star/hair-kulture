import { chromium } from '@playwright/test';
import { spawn } from 'node:child_process';
import assert from 'node:assert/strict';
import { mkdir } from 'node:fs/promises';
const server = spawn(process.execPath, ['node_modules/vite/bin/vite.js', '--host', '127.0.0.1', '--port', '5188', '--strictPort'], {stdio:'pipe'});
let browser;
try {
  await new Promise((resolve,reject)=>{const timer=setTimeout(()=>reject(new Error('Preview startup timed out')),15000);server.stdout.on('data',chunk=>{if(chunk.toString().includes('5188')){clearTimeout(timer);resolve();}});server.on('error',reject);});
  browser=await chromium.launch({channel:'msedge',headless:true});
  const page=await browser.newPage({reducedMotion:'reduce'});
  const errors=[]; page.on('pageerror',e=>errors.push(e.message));
  await mkdir('artifacts',{recursive:true});
  for(const width of [320,360,390,540,768,820,1024,1280,1440,1920]) {
    await page.setViewportSize({width,height:900});
    await page.goto('http://127.0.0.1:5188/',{waitUntil:'networkidle'});
    await page.evaluate(()=>localStorage.clear());
    const assertFits=async(label)=>assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),`${label} overflows at ${width}px`);
    await assertFits('Page');
    if(width<1024){
      await page.getByRole('button',{name:'Abrir ou fechar menu'}).click();
      const nav=page.getByRole('navigation',{name:'Navegação móvel'});
      await nav.waitFor({state:'visible'});
      assert.ok(await nav.evaluate(el=>el.getBoundingClientRect().right<=innerWidth));
      await nav.getByRole('button',{name:'Saias',exact:true}).click();
    }else{
      await page.getByRole('navigation',{name:'Navegação principal'}).getByRole('link',{name:'Saias',exact:true}).click();
    }
    await page.getByRole('button',{name:'Escolher Saias',exact:true}).click();
    let dialog=page.getByRole('dialog');
    assert.ok(await dialog.evaluate(el=>el.scrollWidth<=el.clientWidth+1),`Product dialog overflows at ${width}`);
    await dialog.getByRole('button',{name:'Adicionar ao carrinho',exact:true}).click();
    await page.locator('.bag-button').click();
    dialog=page.getByRole('dialog');
    assert.ok(await dialog.evaluate(el=>el.scrollWidth<=el.clientWidth+1),`Cart overflows at ${width}`);
    await dialog.getByRole('button',{name:/Aumentar quantidade de Saias/}).click();
    await page.keyboard.press('Escape');
    await page.getByRole('button',{name:'Todos',exact:true}).click();
    await assertFits('Collection');
    if([390,768,1440].includes(width)){
      await page.evaluate(()=>window.scrollTo(0,0));
      await page.screenshot({path:`artifacts/responsive-${width}.png`,fullPage:true});
    }
    console.log(`PASS ${width}px: page, navigation, product dialog, cart`);
  }
  assert.deepEqual(errors,[]);
} finally { await browser?.close(); server.kill(); }

