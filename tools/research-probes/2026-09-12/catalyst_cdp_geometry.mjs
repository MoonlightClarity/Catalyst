const pages=await fetch('http://127.0.0.1:9229/json').then(r=>r.json());
const page=pages.find(p=>p.url.includes('fixture=tradecraft')); const ws=new WebSocket(page.webSocketDebuggerUrl); let id=1; const p=new Map();
ws.onmessage=e=>{const m=JSON.parse(e.data);if(m.id&&p.has(m.id)){p.get(m.id)(m);p.delete(m.id);}}; await new Promise((r,j)=>{ws.onopen=r;ws.onerror=j;});
const cmd=(method,params={})=>new Promise(r=>{const n=id++;p.set(n,r);ws.send(JSON.stringify({id:n,method,params}));});
const ev=async expression=>(await cmd('Runtime.evaluate',{expression,returnByValue:true})).result.result.value;
const result=await ev(`(()=>{const R=e=>{const r=e?.getBoundingClientRect();return r?{x:r.x,y:r.y,w:r.width,h:r.height,right:r.right,bottom:r.bottom}:null};return {screen:{w:innerWidth,h:innerHeight},pdf:R(document.querySelector('.pdf-pane')),context:R(document.querySelector('.context-pane')),viewport:R(document.querySelector('.working-picture-viewport')),stage:R(document.querySelector('.working-picture-stage')),nodes:[...document.querySelectorAll('.picture-occurrence')].map((e,i)=>({i,title:e.querySelector('.picture-object')?.title,rect:R(e),classes:e.className,style:e.getAttribute('style')}))};})()`);
console.log(JSON.stringify(result,null,2)); ws.close();
