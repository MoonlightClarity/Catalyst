const pages=await fetch('http://127.0.0.1:9229/json').then(r=>r.json());
const page=pages.find(p=>p.type==='page');if(!page)throw new Error('No page');
const ws=new WebSocket(page.webSocketDebuggerUrl);let id=1;const p=new Map();
ws.onmessage=e=>{const m=JSON.parse(e.data);if(m.id&&p.has(m.id)){p.get(m.id)(m);p.delete(m.id)}};
await new Promise((r,j)=>{ws.onopen=r;ws.onerror=j});
const c=(method,params={})=>new Promise(r=>{const n=id++;p.set(n,r);ws.send(JSON.stringify({id:n,method,params}))});
const m=await c('Runtime.evaluate',{expression:`JSON.parse(localStorage.getItem('catalyst.browser.workspace.v1')||'{}')`,returnByValue:true});
const s=m.result.result.value;const a=Object.values(s.annotations||{});
for(const x of a)console.log(JSON.stringify({id:x.id,quote:x.quote,pageIndex:x.pageIndex,anchors:x.anchors,kind:x.kind,roles:s.annotationRoles?.[x.id]},null,2));
if(a.length===2){console.log('anchorsEqual',JSON.stringify(a[0].anchors)===JSON.stringify(a[1].anchors));console.log('quoteEqual',a[0].quote===a[1].quote)}
ws.close();
