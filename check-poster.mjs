import {createRequire} from 'node:module';
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import {characters} from './dist/poster.js';
const require=createRequire(import.meta.url),{chromium}=require('playwright');
assert.equal(characters('你好👨‍👩‍👧‍👦').length,3);
const browser=await chromium.launch({channel:'chrome',headless:true});
try {
 const page=await browser.newPage({viewport:{width:1440,height:1100},acceptDownloads:true}),errors=[],external=[];
 page.on('pageerror',e=>errors.push(e.message));page.on('request',r=>{if(!r.url().startsWith((process.env.TEST_URL||'http://127.0.0.1:8769'))&&!r.url().startsWith('blob:'))external.push(r.url())});
 await page.goto((process.env.TEST_URL||'http://127.0.0.1:8769'));await page.click('#dismiss');await page.uncheck('#evaporate');
 await page.evaluate(()=>window.breathGlass.state.breathing=true);await page.waitForTimeout(1500);await page.evaluate(()=>window.breathGlass.state.breathing=false);
 const box=await page.locator('#glass').boundingBox();
 await page.mouse.move(box.x+box.width*.41,box.y+box.height*.56);await page.mouse.down();
 for(let i=0;i<80;i++){const t=i/79*Math.PI*2;await page.mouse.move(box.x+box.width*(.5+.085*Math.cos(t)),box.y+box.height*(.56+.1*Math.sin(t)));}
 await page.mouse.up();
 const beads=await page.evaluate(()=>window.breathGlass.state.beads.length);assert(beads>4,'Wet traces should gather small beads');
 const timings=await page.evaluate(()=>new Promise(resolve=>{const times=[];let last=performance.now();function sample(time){times.push(time-last);last=time;if(times.length===90)resolve(times.slice(1).sort((a,b)=>a-b));else requestAnimationFrame(sample)}requestAnimationFrame(sample)}));
 await page.screenshot({path:'preview-water.png',fullPage:true});
 await page.click('#make-poster');await page.waitForFunction(()=>document.getElementById('poster-dialog').open);assert(await page.evaluate(()=>window.breathGlass.state.paused));
 const shot=await page.locator('#poster-canvas').evaluate(c=>c.toDataURL());await page.waitForTimeout(250);assert.equal(await page.locator('#poster-canvas').evaluate(c=>c.toDataURL()),shot,'Poster snapshot must stay frozen');
 await page.fill('#poster-message','今晚不必急着抵达。\n在玻璃上写下心事，让它们慢慢变成水滴。\nMay the evening be gentle with you.');
 await page.screenshot({path:'preview-poster.png',fullPage:true});
 await page.fill('#poster-message','雾'.repeat(201));assert.equal(await page.inputValue('#poster-message'),'雾'.repeat(200));assert.equal(await page.locator('#message-count').textContent(),'200 / 200');
 await page.fill('#poster-message','A little room to breathe.\n让心事慢慢变成水滴。');await page.click('#archive-poster');await page.waitForFunction(()=>document.getElementById('poster-status').textContent.includes('Kept in'));
 for(const type of ['png','jpeg']){await page.selectOption('#poster-format',type);const waiting=page.waitForEvent('download');await page.click('#export-poster');const dl=await waiting;await dl.saveAs('test-poster.'+(type==='png'?'png':'jpg'));}
 const png=await readFile('test-poster.png');assert.equal(png.readUInt32BE(16),1200);assert.equal(png.readUInt32BE(20),1800);const jpg=await readFile('test-poster.jpg');assert.equal(jpg.subarray(0,3).toString('hex'),'ffd8ff');
 await page.reload();await page.click('#open-collection');await page.waitForSelector('.film-frame');assert.equal(await page.locator('.film-frame').count(),1,'Re-saving same draft must not duplicate it');await page.screenshot({path:'preview-collection.png',fullPage:true});
 await page.click('.film-frame');await page.waitForFunction(()=>document.getElementById('poster-dialog').open);assert.equal(await page.inputValue('#poster-message'),'A little room to breathe.\n让心事慢慢变成水滴。');
 await page.setViewportSize({width:390,height:844});await page.waitForTimeout(350);assert(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth));assert(await page.locator('#poster-dialog').evaluate(d=>d.scrollWidth<=d.clientWidth));await page.screenshot({path:'preview-poster-mobile.png',fullPage:true});
 await page.evaluate(()=>{indexedDB.open=()=>{throw Error('Simulated unavailable storage')}});const fallback=page.waitForEvent('download');await page.click('#export-poster');await fallback;assert((await page.textContent('#poster-status')).includes('storage is unavailable'));
 await page.click('#close-poster');await page.click('#pause');assert.equal(await page.evaluate(()=>window.breathGlass.state.paused),false);
 assert.deepEqual(errors,[]);assert.deepEqual(external,[]);console.log(JSON.stringify({passed:true,beads,medianFrameMs:timings[Math.floor(timings.length/2)],p95FrameMs:timings[Math.floor(timings.length*.95)],errors,external,checks:['wet edge beads','frozen snapshot','200 graphemes','PNG/JPG poster export','collection survives reload','same draft not duplicated','reopen message','mobile poster layout','resume drawing','export still works if storage fails']},null,2));
} finally {await browser.close()}
