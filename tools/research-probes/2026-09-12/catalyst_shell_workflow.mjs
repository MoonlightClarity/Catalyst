import fs from 'fs';
const shell=process.argv[2]; if(!['spatial','reader','split'].includes(shell)) throw new Error('shell required');
const pages=await fetch('http://127.0.0.1:9229/json').then(r=>r.json());
const page=pages.find(p=>p.type==='page'); if(!page) throw new Error('No CDP page');
const ws=new WebSocket(page.webSocketDebuggerUrl); let id=1; const pending=new Map();
ws.onmessage=e=>{const m=JSON.parse(e.data);if(m.id&&pending.has(m.id)){pending.get(m.id)(m);pending.delete(m.id)}};
await new Promise((r,j)=>{ws.onopen=r;ws.onerror=j});
const c=(method,params={})=>new Promise(r=>{const n=id++;pending.set(n,r);ws.send(JSON.stringify({id:n,method,params}))});
const v=async expr=>(await c('Runtime.evaluate',{expression:expr,returnByValue:true,awaitPromise:true})).result.result.value;
const sleep=ms=>new Promise(r=>setTimeout(r,ms)); const out={shell};
await c('Emulation.setDeviceMetricsOverride',{width:1440,height:900,deviceScaleFactor:1,mobile:false});
await v(`localStorage.removeItem('catalyst.browser.workspace.v1');localStorage.removeItem('catalyst.recovery.v1');true`);
await c('Page.navigate',{url:`http://127.0.0.1:5173/?research=unified-workflow&fixture=tradecraft&shell=${shell}&run=shell-experiment`});
await sleep(5000);
const geomExpr=`(()=>{const q=s=>document.querySelector(s);const rr=e=>{if(!e)return null;const r=e.getBoundingClientRect();return{x:r.x,y:r.y,w:r.width,h:r.height}};const root=q('embedpdf-container')?.shadowRoot;const page=[...(root?.querySelectorAll('img')||[])].map(e=>({e,r:e.getBoundingClientRect()})).find(x=>x.r.width>400&&x.r.height>600&&x.r.y<900);return{workspace:q('.workspace')?.className,pdf:rr(q('.pdf-pane')),context:rr(q('.context-pane')),page:page?rr(page.e):null,tabs:[...document.querySelectorAll('[role=tab]')].map(x=>x.textContent.trim()),zoom:[...(root?.querySelectorAll('button')||[])].map(x=>x.textContent.trim()).find(t=>/%/.test(t))||''}})()`;
out.initial=await v(geomExpr); if(!out.initial.page) throw new Error('PDF page not found');
const r=out.initial.page; const sx=r.x+(150/612)*r.w, sy=r.y+((792-515)/792)*r.h, ex=r.x+(410/612)*r.w, ey=r.y+((792-465)/792)*r.h;
await c('Input.dispatchMouseEvent',{type:'mouseMoved',x:sx,y:sy});await c('Input.dispatchMouseEvent',{type:'mousePressed',x:sx,y:sy,button:'left',clickCount:1});
for(let i=1;i<=18;i++){await c('Input.dispatchMouseEvent',{type:'mouseMoved',x:sx+(ex-sx)*i/18,y:sy+(ey-sy)*i/18,button:'left',buttons:1});await sleep(25)}
await c('Input.dispatchMouseEvent',{type:'mouseReleased',x:ex,y:ey,button:'left',clickCount:1}); await sleep(1400);
out.selection=await v(`(()=>{const q=s=>document.querySelector(s);const e=q('.selection-card');const r=e?.getBoundingClientRect();return{quote:q('.selection-capture-paper span')?.textContent?.trim()||'',card:r?{x:r.x,y:r.y,w:r.width,h:r.height}:null,active:q('.workspace')?.className}})()`);
if(!out.selection.card) throw new Error('Selection card missing');
out.selection.distanceFromDragEnd=Math.hypot(Math.max(out.selection.card.x-ex,0,ex-(out.selection.card.x+out.selection.card.w)),Math.max(out.selection.card.y-ey,0,ey-(out.selection.card.y+out.selection.card.h)));
let shot=await c('Page.captureScreenshot',{format:'png',captureBeyondViewport:false});fs.writeFileSync(`C:/Users/iris/Downloads/Catalyst/tools/research-probes/2026-09-12/artifacts/${shell}-selection.png`,Buffer.from(shot.result.data,'base64'));
await v(`document.querySelector('[aria-label="Create linked thought"]')?.click();true`); await sleep(1700);
out.created=await v(`(()=>{const q=s=>document.querySelector(s),rr=e=>{if(!e)return null;const r=e.getBoundingClientRect();return{x:r.x,y:r.y,w:r.width,h:r.height,right:r.right,bottom:r.bottom}};const occ=[...document.querySelectorAll('.picture-occurrence')].map(rr);const ctx=rr(q('.context-pane'));return{tabs:[...document.querySelectorAll('[role=tab]')].map(x=>x.textContent.trim()),workspace:q('.workspace')?.className,occurrences:occ,visibleOccurrences:occ.filter(r=>r&&r.right>0&&r.x<innerWidth&&r.bottom>0&&r.y<innerHeight),sourceJump:rr(q('.source-jump')),inspector:!!q('.note-inspector'),title:q('.note-title-input')?.value||''}})()`);
shot=await c('Page.captureScreenshot',{format:'png',captureBeyondViewport:false});fs.writeFileSync(`C:/Users/iris/Downloads/Catalyst/tools/research-probes/2026-09-12/artifacts/${shell}-post-create.png`,Buffer.from(shot.result.data,'base64'));
out.placeAttempt=out.created.visibleOccurrences.length?'visible':'not-visible';
if(out.created.visibleOccurrences.length){const o=out.created.visibleOccurrences[0];const ax=o.x+o.w/2,ay=o.y+o.h/2,bx=Math.min(ax+55,1440-40),by=Math.min(ay+45,900-40);await c('Input.dispatchMouseEvent',{type:'mouseMoved',x:ax,y:ay});await c('Input.dispatchMouseEvent',{type:'mousePressed',x:ax,y:ay,button:'left',clickCount:1});for(let i=1;i<=10;i++){await c('Input.dispatchMouseEvent',{type:'mouseMoved',x:ax+(bx-ax)*i/10,y:ay+(by-ay)*i/10,button:'left',buttons:1});await sleep(20)}await c('Input.dispatchMouseEvent',{type:'mouseReleased',x:bx,y:by,button:'left',clickCount:1});await sleep(600);}
const beforeReturn=await v(`(()=>{const e=document.querySelector('.source-jump');return e?e.textContent.trim():''})()`);out.sourceLabel=beforeReturn;
await v(`document.querySelector('.source-jump')?.click();true`); await sleep(1600);
out.returned=await v(`(()=>({workspace:document.querySelector('.workspace')?.className,readerActive:document.querySelector('.pdf-pane')?.dataset.paneActive,tabs:[...document.querySelectorAll('[role=tab]')].map(x=>x.textContent.trim())}))()`);
await v(`document.querySelector('.context-tab')?.click();true`); await sleep(500);
out.resumed=await v(`document.querySelector('.workspace')?.className||''`);
console.log(JSON.stringify(out,null,2));ws.close();

