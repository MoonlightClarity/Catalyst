const pages=await fetch('http://127.0.0.1:9229/json').then(r=>r.json());
const page=pages.find(p=>p.type==='page'); if(!page) throw new Error('No CDP page');
const ws=new WebSocket(page.webSocketDebuggerUrl);let id=1;const p=new Map();ws.onmessage=e=>{const m=JSON.parse(e.data);if(m.id&&p.has(m.id)){p.get(m.id)(m);p.delete(m.id)}};await new Promise((r,j)=>{ws.onopen=r;ws.onerror=j});
const c=(method,params={})=>new Promise(r=>{const n=id++;p.set(n,r);ws.send(JSON.stringify({id:n,method,params}))});const v=async e=>(await c('Runtime.evaluate',{expression:e,returnByValue:true,awaitPromise:true})).result.result.value;const sleep=ms=>new Promise(r=>setTimeout(r,ms));
await c('Emulation.setDeviceMetricsOverride',{width:1440,height:900,deviceScaleFactor:1,mobile:false});
await v(`localStorage.removeItem('catalyst.browser.workspace.v1');localStorage.removeItem('catalyst.recovery.v1');true`);
await c('Page.navigate',{url:'http://127.0.0.1:5173/?research=unified-workflow&fixture=tradecraft&shell=split&run=shell-experiment'});await sleep(5000);
const rect=await v(`(()=>{const r=[...document.querySelector('embedpdf-container').shadowRoot.querySelectorAll('img')].map(e=>e.getBoundingClientRect()).find(r=>r.width>500&&r.height>700&&r.y<900);return r&&({x:r.x,y:r.y,w:r.width,h:r.height})})()`);if(!rect)throw new Error('page rect not found');
const sx=rect.x+(150/612)*rect.w, sy=rect.y+((792-515)/792)*rect.h, ex=rect.x+(410/612)*rect.w, ey=rect.y+((792-465)/792)*rect.h;
await c('Input.dispatchMouseEvent',{type:'mouseMoved',x:sx,y:sy});await c('Input.dispatchMouseEvent',{type:'mousePressed',x:sx,y:sy,button:'left',clickCount:1});
for(let i=1;i<=18;i++){await c('Input.dispatchMouseEvent',{type:'mouseMoved',x:sx+(ex-sx)*i/18,y:sy+(ey-sy)*i/18,button:'left',buttons:1});await sleep(25)}
await c('Input.dispatchMouseEvent',{type:'mouseReleased',x:ex,y:ey,button:'left',clickCount:1});await sleep(1400);
const result=await v(`(()=>({card:!!document.querySelector('.selection-card'),quote:document.querySelector('.selection-capture-paper span')?.textContent?.trim()||'',tabs:[...document.querySelectorAll('[role=tab]')].map(x=>x.textContent.trim())}))()`);
console.log(JSON.stringify({rect,drag:{sx,sy,ex,ey},result},null,2));ws.close();