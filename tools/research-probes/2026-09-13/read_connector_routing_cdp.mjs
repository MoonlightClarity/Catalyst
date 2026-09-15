const targets = await (await fetch('http://127.0.0.1:9230/json/list')).json();
const t = targets.find(x => x.url === 'chrome-extension://fnjbijbhcehgoglobkicibfpcmddlggg/service-worker-loader.js');
if (!t) throw new Error('Browser Connector service worker target not found');
const ws = new WebSocket(t.webSocketDebuggerUrl);
const done = new Promise((resolve, reject) => {
  ws.addEventListener('open', () => ws.send(JSON.stringify({id:1,method:'Runtime.evaluate',params:{expression:"chrome.storage.local.get('catalystRoutingDebug')",awaitPromise:true,returnByValue:true}})));
  ws.addEventListener('message', ev => { const msg=JSON.parse(ev.data); if (msg.id===1) { console.log(JSON.stringify(msg,null,2)); resolve(); } });
  ws.addEventListener('error', reject);
});
await done;
ws.close();
