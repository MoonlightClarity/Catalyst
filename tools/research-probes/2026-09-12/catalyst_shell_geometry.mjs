import fs from 'fs';
const pages=await fetch('http://127.0.0.1:9229/json').then(r=>r.json());
const page=pages.find(p=>p.type==='page'); if(!page) throw new Error('No CDP page');
const ws=new WebSocket(page.webSocketDebuggerUrl); let id=1; const pending=new Map();
ws.onmessage=e=>{const m=JSON.parse(e.data); if(m.id&&pending.has(m.id)){pending.get(m.id)(m);pending.delete(m.id);}};
await new Promise((r,j)=>{ws.onopen=r;ws.onerror=j});
const cmd=(method,params={})=>new Promise(r=>{const n=id++;pending.set(n,r);ws.send(JSON.stringify({id:n,method,params}));});
const val=async expr=>(await cmd('Runtime.evaluate',{expression:expr,returnByValue:true,awaitPromise:true})).result.result.value;
const sleep=ms=>new Promise(r=>setTimeout(r,ms));
await cmd('Emulation.setDeviceMetricsOverride',{width:1440,height:900,deviceScaleFactor:1,mobile:false});
const out={};
for(const shell of ['spatial','reader','split']){
  const url=`http://127.0.0.1:5173/?research=unified-workflow&fixture=tradecraft&shell=${shell}&run=shell-experiment`;
  await cmd('Page.navigate',{url}); await sleep(4500);
  out[shell]=await val(`(()=>{const q=s=>document.querySelector(s);const rect=s=>{const e=q(s);if(!e)return null;const r=e.getBoundingClientRect();return {x:r.x,y:r.y,w:r.width,h:r.height,z:getComputedStyle(e).zIndex,display:getComputedStyle(e).display}};return {url:location.href,cls:q('.workspace')?.className,doc:q('.reader-document-name')?.textContent?.trim(),viewport:{w:innerWidth,h:innerHeight},pdf:rect('.pdf-pane'),context:rect('.context-pane'),divider:rect('.workspace-divider'),selection:rect('.selection-card'),toggle:q('.unified-layer-toggle')?.textContent?.trim(),tabs:[...document.querySelectorAll('[role=tab]')].map(x=>x.textContent.trim())}})()`);
  const shot=await cmd('Page.captureScreenshot',{format:'png',captureBeyondViewport:false});
  fs.writeFileSync(`C:/Users/iris/Downloads/Catalyst/tools/research-probes/2026-09-12/artifacts/shell-${shell}.png`,Buffer.from(shot.result.data,'base64'));
}
console.log(JSON.stringify(out,null,2)); ws.close();