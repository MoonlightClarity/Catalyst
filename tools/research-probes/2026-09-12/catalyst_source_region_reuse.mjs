import fs from 'fs';
const pages=await fetch('http://127.0.0.1:9229/json').then(r=>r.json());
const page=pages.find(p=>p.type==='page'); if(!page) throw new Error('No CDP page');
const ws=new WebSocket(page.webSocketDebuggerUrl);let id=1;const pending=new Map();
ws.onmessage=e=>{const m=JSON.parse(e.data);if(m.id&&pending.has(m.id)){pending.get(m.id)(m);pending.delete(m.id)}};
await new Promise((r,j)=>{ws.onopen=r;ws.onerror=j});
const c=(method,params={})=>new Promise(r=>{const n=id++;pending.set(n,r);ws.send(JSON.stringify({id:n,method,params}))});
const v=async expr=>(await c('Runtime.evaluate',{expression:expr,returnByValue:true,awaitPromise:true})).result.result.value;
const sleep=ms=>new Promise(r=>setTimeout(r,ms));
await c('Emulation.setDeviceMetricsOverride',{width:1440,height:900,deviceScaleFactor:1,mobile:false});
await v(`localStorage.removeItem('catalyst.browser.workspace.v1');localStorage.removeItem('catalyst.recovery.v1');true`);
await c('Page.navigate',{url:'http://127.0.0.1:5173/?research=unified-workflow&fixture=tradecraft&shell=reader&run=source-region-reuse'});await sleep(4500);
async function selectTitle(){
  const r=await v(`(()=>{const root=document.querySelector('embedpdf-container')?.shadowRoot;const x=[...(root?.querySelectorAll('img')||[])].map(e=>e.getBoundingClientRect()).find(r=>r.width>500&&r.height>700&&r.y<900);return x&&({x:x.x,y:x.y,w:x.width,h:x.height})})()`);if(!r)throw new Error('page not found');
  const sx=r.x+(150/612)*r.w,sy=r.y+((792-515)/792)*r.h,ex=r.x+(410/612)*r.w,ey=r.y+((792-465)/792)*r.h;
  await c('Input.dispatchMouseEvent',{type:'mouseMoved',x:sx,y:sy});await c('Input.dispatchMouseEvent',{type:'mousePressed',x:sx,y:sy,button:'left',clickCount:1});
  for(let i=1;i<=18;i++){await c('Input.dispatchMouseEvent',{type:'mouseMoved',x:sx+(ex-sx)*i/18,y:sy+(ey-sy)*i/18,button:'left',buttons:1});await sleep(25)}
  await c('Input.dispatchMouseEvent',{type:'mouseReleased',x:ex,y:ey,button:'left',clickCount:1});await sleep(1000);
}
await selectTitle();
await v(`document.querySelector('[aria-label="Save evidence"]')?.click();true`);await sleep(900);
const afterSave=await v(`(()=>({tabs:[...document.querySelectorAll('[role=tab]')].map(e=>e.textContent.trim()),raw:localStorage.getItem('catalyst.browser.workspace.v1')}))()`);
await v(`document.querySelector('.pdf-pane')?.dispatchEvent(new PointerEvent('pointerdown',{bubbles:true,pointerId:1}));true`);await sleep(300);
await selectTitle();
await v(`document.querySelector('[aria-label="Create linked thought"]')?.click();true`);await sleep(1200);
const afterCreate=await v(`(()=>({tabs:[...document.querySelectorAll('[role=tab]')].map(e=>e.textContent.trim()),raw:localStorage.getItem('catalyst.browser.workspace.v1'),mode:document.querySelector('.context-pane')?.dataset.contextMode}))()`);
const parse=s=>{try{return JSON.parse(s)}catch{return null}};
const a=parse(afterSave.raw),b=parse(afterCreate.raw);
const summarize=s=>s&&({annotationIds:Object.keys(s.annotations||{}),noteIds:Object.keys(s.notes||{}),links:s.links||[]});
console.log(JSON.stringify({afterSave:{tabs:afterSave.tabs,state:summarize(a)},afterCreate:{tabs:afterCreate.tabs,mode:afterCreate.mode,state:summarize(b)},pass:!!b&&Object.keys(b.annotations||{}).length===1&&Object.keys(b.notes||{}).length===1&&(b.links||[]).length===1},null,2));
ws.close();