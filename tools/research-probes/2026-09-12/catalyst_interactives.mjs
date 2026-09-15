const pages=await fetch('http://127.0.0.1:9231/json').then(r=>r.json());
const page=pages.find(p=>p.type==='page'&&p.url.includes('run=file-e2e'));const ws=new WebSocket(page.webSocketDebuggerUrl);let id=1;const wait=new Map();
ws.onmessage=e=>{const m=JSON.parse(e.data);if(m.id&&wait.has(m.id)){wait.get(m.id)(m);wait.delete(m.id)}};await new Promise((r,j)=>{ws.onopen=r;ws.onerror=j});
const c=(method,params={})=>new Promise(r=>{const n=id++;wait.set(n,r);ws.send(JSON.stringify({id:n,method,params}))});
const value=async expression=>(await c('Runtime.evaluate',{expression,returnByValue:true})).result.result.value;
const result=await value(`(()=>[...document.querySelectorAll('button,a,input,[role=button]')].map((e,i)=>{const r=e.getBoundingClientRect();return{i,tag:e.tagName,cls:e.className,aria:e.getAttribute('aria-label')||'',title:e.getAttribute('title')||'',text:(e.textContent||'').trim().replace(/\\s+/g,' ').slice(0,180),x:r.x,y:r.y,w:r.width,h:r.height,visible:r.width>0&&r.height>0}}).filter(x=>x.visible))()`);
console.log(JSON.stringify(result,null,2));ws.close();