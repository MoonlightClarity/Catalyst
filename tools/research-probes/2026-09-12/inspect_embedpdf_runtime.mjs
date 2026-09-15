const pages=await fetch('http://127.0.0.1:9229/json').then(r=>r.json());
const page=pages.find(p=>p.type==='page'); if(!page) throw new Error('No CDP page');
const ws=new WebSocket(page.webSocketDebuggerUrl);let id=1;const pending=new Map();
ws.onmessage=e=>{const m=JSON.parse(e.data);if(m.id&&pending.has(m.id)){pending.get(m.id)(m);pending.delete(m.id)}};
await new Promise((r,j)=>{ws.onopen=r;ws.onerror=j});
const c=(method,params={})=>new Promise(r=>{const n=id++;pending.set(n,r);ws.send(JSON.stringify({id:n,method,params}))});
const v=async expr=>(await c('Runtime.evaluate',{expression:expr,returnByValue:true,awaitPromise:true})).result.result.value;
console.log(await v(`({windowKeys:Object.keys(window).filter(k=>/embed|pdf|registry/i.test(k)),elKeys:Object.keys(document.querySelector('embedpdf-container')||{}),tagProps:Object.getOwnPropertyNames(Object.getPrototypeOf(document.querySelector('embedpdf-container')||{}))})`));
ws.close();