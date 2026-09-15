const pages = await fetch('http://127.0.0.1:9229/json').then(r => r.json());
const page = pages.find(x => x.type === 'page' && x.url.includes('127.0.0.1:5173'));
const ws = new WebSocket(page.webSocketDebuggerUrl); let id = 1; const pending = new Map();
ws.onmessage = e => { const m = JSON.parse(e.data); if (m.id && pending.has(m.id)) { pending.get(m.id)(m); pending.delete(m.id); } };
await new Promise((resolve, reject) => { ws.onopen = resolve; ws.onerror = reject; });
const call = (method, params = {}) => new Promise(resolve => { const n = id++; pending.set(n, resolve); ws.send(JSON.stringify({ id: n, method, params })); });
const val = async expression => (await call('Runtime.evaluate', { expression, returnByValue: true, awaitPromise: true })).result.result.value;
const result = await val(`(()=>{const n=[...document.querySelectorAll('.picture-occurrence')].find(x=>x.querySelector('.picture-object-label')?.textContent==='Key assumption');const r=n.getBoundingClientRect();const x=r.left+r.width/2,y=r.top+r.height/2;const hit=document.elementFromPoint(x,y);return{inner:[innerWidth,innerHeight],client:[document.documentElement.clientWidth,document.documentElement.clientHeight],vv:visualViewport?[visualViewport.width,visualViewport.height,visualViewport.scale]:null,scroll:[scrollX,scrollY],rect:{x:r.x,y:r.y,w:r.width,h:r.height},center:{x,y},hit:hit?{tag:hit.tagName,cls:String(hit.className),label:hit.closest('.picture-occurrence')?.querySelector('.picture-object-label')?.textContent}:null};})()`);
console.log(JSON.stringify(result, null, 2)); ws.close();