import {createServer} from 'node:http';
import {readFile,writeFile,mkdir,unlink} from 'node:fs/promises';
import {existsSync} from 'node:fs';
import {fileURLToPath} from 'node:url';
import path from 'node:path';
import {spawn,spawnSync} from 'node:child_process';
import {once} from 'node:events';
import {chromium} from '../../Hair/node_modules/playwright/index.mjs';

const root=path.resolve(fileURLToPath(new URL('../../',import.meta.url)));
const dir=path.join(root,'campaign');
const priceVersion=process.argv.includes('--prices');
const lightReveal=process.argv.includes('--light-reveal');
const hairOnly=priceVersion||lightReveal||process.argv.includes('--hair-only');
const variant=priceVersion?'prices':lightReveal?'light-reveal':hairOnly?'hair-only':'original';
const stem=priceVersion?'kulture-campaign-prices':lightReveal?'kulture-campaign-light-reveal':hairOnly?'kulture-campaign-hair-only':'kulture-campaign';
const duration=priceVersion?24:18;
const totalFrames=duration*30;
const output=path.join(dir,'video',stem+'-1080x1920.mp4');
const storyboard=path.join(dir,'video',variant==='original'?'storyboard.jpg':`storyboard-${variant}.jpg`);
const pythonFFmpeg=spawnSync('python',['-c','import imageio_ffmpeg; print(imageio_ffmpeg.get_ffmpeg_exe())'],{encoding:'utf8',windowsHide:true});
const ffmpeg=process.env.KULTURE_FFMPEG || pythonFFmpeg.stdout?.trim() || 'ffmpeg';
const mime={'.html':'text/html; charset=utf-8','.json':'application/json; charset=utf-8','.png':'image/png','.jpeg':'image/jpeg','.jpg':'image/jpeg','.woff2':'font/woff2'};
const server=createServer(async(req,res)=>{
  try{
    const pathname=decodeURIComponent(new URL(req.url,'http://localhost').pathname);
    const target=path.resolve(root,'.'+pathname);
    if(!target.startsWith(root+path.sep)){res.writeHead(403).end();return;}
    const body=await readFile(target);
    res.writeHead(200,{'Content-Type':mime[path.extname(target)]||'application/octet-stream'});res.end(body);
  }catch{res.writeHead(404).end();}
});
let browser;
const run=async(args)=>{
  const proc=spawn(ffmpeg,['-hide_banner','-loglevel','warning','-y',...args],{stdio:['ignore','inherit','inherit'],windowsHide:true});
  const [code]=await once(proc,'exit');if(code!==0)throw Error(`FFmpeg exited ${code}`);
};
try{
  await mkdir(path.join(dir,'instagram'),{recursive:true});await mkdir(path.join(dir,'video'),{recursive:true});
  await new Promise(resolve=>server.listen(0,'127.0.0.1',resolve));
  browser=await chromium.launch({channel:'msedge',headless:true});
  const page=await browser.newPage({viewport:{width:1080,height:1920},deviceScaleFactor:1});
  const errors=[];page.on('pageerror',e=>errors.push(e.message));
  page.on('console',m=>{if(m.type()==='error')errors.push(m.text());});
  await page.goto(`http://127.0.0.1:${server.address().port}/campaign/source/creative.html?variant=${variant}`);
  await page.evaluate(()=>window.ready);
  const save=async(file,method,arg)=>{
    const data=await page.evaluate(([method,arg])=>{window.art[method](arg);return window.art.export();},[method,arg]);
    await writeFile(path.join(dir,file),Buffer.from(data.split(',')[1],'base64'));
    console.log('Saved '+file);
  };
  if(priceVersion){
    await save('video/kulture-price-end-card.png','frame',20);
    await save('video/kulture-prices-preview.png','openerPreview');
  }else if(lightReveal){
    await save('video/kulture-light-reveal-opener.png','openerPreview');
  }else if(hairOnly){
    await save('video/kulture-hair-detail.png','frame',12.8);
  }else{
    const names=['01-volume','02-assinatura','03-presenca'];
    for(let i=0;i<3;i++)await save(`instagram/${names[i]}.png`,'post',i+1);
    await save('instagram/04-capa-reel.png','frame',16.6);
    await save('instagram/preview.png','contactSheet');
  }
  console.log('Canvas: '+JSON.stringify(await page.evaluate(()=>window.art.metrics())));
  if(!process.argv.includes('--stills-only')){
    const raw=path.join(dir,'video',stem+'-picture.mp4');
    const encoder=spawn(ffmpeg,['-hide_banner','-loglevel','warning','-y','-f','image2pipe','-vcodec','mjpeg','-framerate','30','-i','pipe:0','-an','-vf','scale=in_range=pc:out_range=tv,format=yuv420p,sidedata=mode=delete:type=ICC_PROFILE,setparams=range=limited:color_primaries=bt709:color_trc=bt709:colorspace=bt709','-c:v','libx264','-preset','medium','-crf','18','-pix_fmt','yuv420p','-color_range','tv','-color_primaries','bt709','-color_trc','bt709','-colorspace','bt709','-movflags','+faststart',raw],{stdio:['pipe','inherit','inherit'],windowsHide:true});
    let encoderFailure;
    encoder.on('error',e=>{encoderFailure=e;});
    const done=once(encoder,'exit');
    encoder.stdin.on('error',e=>{encoderFailure=e;});
    for(let i=0;i<totalFrames;i++){
      if(encoderFailure)throw encoderFailure;
      const data=await page.evaluate(t=>{window.art.frame(t);return window.art.export('image/jpeg',.95);},i/30);
      if(!encoder.stdin.write(Buffer.from(data.split(',')[1],'base64')))await once(encoder.stdin,'drain');
      if(i%60===0)console.log(`Film: ${i}/${totalFrames} frames`);
    }
    encoder.stdin.end();const [code]=await done;if(code!==0)throw Error(`Video encoder exited ${code}`);
    const audio=path.join(dir,'assets',priceVersion?'kulture-prices-score.wav':lightReveal?'kulture-light-reveal-score.wav':'kulture-original-score.wav');
    if(!existsSync(audio))throw Error(`Run python campaign/source/score.py${priceVersion?' --prices':lightReveal?' --light-reveal':''} before rendering the film.`);
    await run(['-i',raw,'-i',audio,'-map','0:v:0','-map','1:a:0','-c:v','copy','-af','loudnorm=I=-16:TP=-1.5:LRA=9','-c:a','aac','-b:a','192k','-ar','48000','-t',String(duration),'-movflags','+faststart','-metadata','title=Kulture — A tua essência. Em cada fio.','-metadata','comment=Original motion design and original score; supplied Kulture identity; AI-generated campaign photography.',output]);
    // A compact review strip sampled from the actual encoded deliverable.
    await run(['-i',output,'-vf',priceVersion?'fps=1/3,scale=216:384,tile=8x1':'fps=1/3,scale=270:480,tile=6x1','-frames:v','1','-update','1',storyboard]);
    await unlink(raw);
    console.log(`Saved video/${stem}-1080x1920.mp4 (${duration} s, 1080×1920, 30 fps, original score)`);
  }
  if(errors.length)throw Error(errors.join('\n'));
  console.log('PASS: all images and fonts loaded; no browser errors.');
}finally{await browser?.close();server.close();}
