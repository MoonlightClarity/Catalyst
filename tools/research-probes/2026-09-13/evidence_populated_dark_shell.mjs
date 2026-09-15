import fs from 'node:fs';
const pages=await fetch('http://127.0.0.1:9229/json').then(r=>r.json()); const page=pages.find(x=>x.type==='page'); if(!page) throw new Error('No CDP page');
const ws=new WebSocket(page.webSocketDebuggerUrl); let id=1; const p=new Map(); ws.onmessage=e=>{const m=JSON.parse(e.data); if(m.id&&p.has(m.id)){p.get(m.id)(m);p.delete(m.id)}}; await new Promise((r,j)=>{ws.onopen=r;ws.onerror=j});
const c=(method,params={})=>new Promise(r=>{const n=id++;p.set(n,r);ws.send(JSON.stringify({id:n,method,params}))}); const v=async e=>(await c('Runtime.evaluate',{expression:e,returnByValue:true,awaitPromise:true})).result.result.value; const sleep=ms=>new Promise(r=>setTimeout(r,ms));
await c('Emulation.setDeviceMetricsOverride',{width:1440,height:900,deviceScaleFactor:1,mobile:false});
await v(`([...document.querySelectorAll('[role=tab]')].find(el=>el.textContent.trim().startsWith('Evidence')))?.click(); true`); await sleep(700);
const measure=await v(`(()=>({mode:document.querySelector('.context-pane')?.dataset.contextMode, cards:document.querySelectorAll('.evidence-card').length, rows:document.querySelectorAll('.evidence-row').length, text:(document.querySelector('.context-pane')?.innerText||'').slice(0,800)}))()`);
const shot=await c('Page.captureScreenshot',{format:'png',captureBeyondViewport:false}); const path='C:/Users/iris/Downloads/Catalyst/tools/research-probes/2026-09-13/evidence-populated-dark-shell.png'; fs.writeFileSync(path,Buffer.from(shot.result.data,'base64'));
console.log(JSON.stringify({...measure,path},null,2)); ws.close();