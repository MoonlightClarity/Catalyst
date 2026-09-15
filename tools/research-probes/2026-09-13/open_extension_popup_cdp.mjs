const v=await (await fetch('http://127.0.0.1:9230/json/version')).json();
const ws=new WebSocket(v.webSocketDebuggerUrl);
await new Promise((resolve,reject)=>{
  ws.addEventListener('open',()=>ws.send(JSON.stringify({id:1,method:'Target.createTarget',params:{url:'chrome-extension://fnjbijbhcehgoglobkicibfpcmddlggg/src/popup/index.html'}})));
  ws.addEventListener('message',ev=>{const m=JSON.parse(ev.data);if(m.id===1){console.log(JSON.stringify(m));resolve();}});
  ws.addEventListener('error',reject);
});
ws.close();
