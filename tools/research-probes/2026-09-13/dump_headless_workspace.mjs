const pages=await fetch('http://127.0.0.1:9229/json').then(r=>r.json());
const page=pages.find(x=>x.type==='page'); if(!page) throw new Error('No CDP page');
const ws=new WebSocket(page.webSocketDebuggerUrl); let id=1; const pending=new Map();
ws.onmessage=e=>{const m=JSON.parse(e.data);if(m.id&&pending.has(m.id)){pending.get(m.id)(m);pending.delete(m.id)}};
await new Promise((r,j)=>{ws.onopen=r;ws.onerror=j});
const c=(method,params={})=>new Promise(r=>{const n=id++;pending.set(n,r);ws.send(JSON.stringify({id:n,method,params}))});
const v=async expression=>(await c('Runtime.evaluate',{expression,returnByValue:true,awaitPromise:true})).result.result.value;
console.log(await v(`localStorage.getItem('catalyst.browser.workspace.v1')||''`));
ws.close();
