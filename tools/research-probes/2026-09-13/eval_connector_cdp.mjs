const expr = process.argv.slice(2).join(' ');
const targets = await (await fetch('http://127.0.0.1:9230/json/list')).json();
const t = targets.find(x => x.url === 'chrome-extension://fnjbijbhcehgoglobkicibfpcmddlggg/service-worker-loader.js');
if (!t) throw new Error('Browser Connector service worker target not found');
const ws = new WebSocket(t.webSocketDebuggerUrl);
await new Promise((resolve,reject)=>{
  ws.addEventListener('open',()=>ws.send(JSON.stringify({id:1,method:'Runtime.evaluate',params:{expression:expr,awaitPromise:true,returnByValue:true}})));
  ws.addEventListener('message',ev=>{const m=JSON.parse(ev.data);if(m.id===1){console.log(JSON.stringify(m,null,2));resolve();}});
  ws.addEventListener('error',reject);
});
ws.close();
