import fs from 'node:fs';
const ps=await fetch('http://127.0.0.1:9229/json').then(r=>r.json());
const p=ps.find(x=>x.type==='page'); const ws=new WebSocket(p.webSocketDebuggerUrl); let i=1; const m=new Map();
ws.onmessage=e=>{const x=JSON.parse(e.data); if(x.id&&m.has(x.id)){m.get(x.id)(x);m.delete(x.id)}};
await new Promise((r,j)=>{ws.onopen=r;ws.onerror=j}); const c=(method,params={})=>new Promise(r=>{const n=i++;m.set(n,r);ws.send(JSON.stringify({id:n,method,params}))});
for(let k=0;k<2;k++){for(const type of ['mousePressed','mouseReleased']) await c('Input.dispatchMouseEvent',{type,x:185,y:874,button:'left',clickCount:1}); await new Promise(r=>setTimeout(r,120));}
await new Promise(r=>setTimeout(r,500)); const z=await c('Runtime.evaluate',{expression:"document.querySelector('.picture-controls')?.textContent",returnByValue:true});
const s=await c('Page.captureScreenshot',{format:'png',captureBeyondViewport:false}); fs.writeFileSync('tools/research-probes/2026-09-13/dark-shell-working-zoom-100.png',Buffer.from(s.result.data,'base64'));
console.log(z.result.result.value); ws.close();

