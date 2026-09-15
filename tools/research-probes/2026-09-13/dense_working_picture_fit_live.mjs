import fs from "node:fs";
const pages = await fetch("http://127.0.0.1:9229/json").then(r => r.json());
const page = pages.find(item => item.type === "page");
if (!page) throw new Error("No CDP page");
const ws = new WebSocket(page.webSocketDebuggerUrl);
let id = 1; const pending = new Map();
ws.onmessage = e => { const m = JSON.parse(e.data); if (m.id && pending.has(m.id)) { pending.get(m.id)(m); pending.delete(m.id); } };
await new Promise((resolve, reject) => { ws.onopen = resolve; ws.onerror = reject; });
const call = (method, params = {}) => new Promise(resolve => { const n = id++; pending.set(n, resolve); ws.send(JSON.stringify({id:n, method, params})); });
const val = async expression => (await call("Runtime.evaluate", {expression, returnByValue:true, awaitPromise:true})).result.result.value;
const sleep = ms => new Promise(resolve => setTimeout(resolve, ms));
await call("Emulation.setDeviceMetricsOverride", {width:1440,height:900,deviceScaleFactor:1,mobile:false});
const note = (id, i, title) => ({id,title,body:"",createdAt:`2026-01-${String(i).padStart(2,"0")}T00:00:00.000Z`,updatedAt:`2026-01-${String(i).padStart(2,"0")}T00:00:00.000Z`,deletedAt:null});
const notes = {root: note("root",1,"Regional stability assessment")};
const occurrences = {root:{noteId:"root",parentNoteId:null,position:null,collapsed:false,manual:false}};
const semantics = {root:{roles:["note"],confidence:null}};for (let i=0;i<12;i++) {
  for (const [prefix,label,role] of [["context","Context","note"],["open","Question","question"],["assess","Assessment","claim"]]) {
    const nid = `${prefix}-${i}`;
    notes[nid] = note(nid,i+2+({context:0,open:12,assess:24}[prefix]),`${label} ${i+1}`);
    occurrences[nid] = {noteId:nid,parentNoteId:"root",position:null,collapsed:false,manual:false};
    semantics[nid] = {roles:[role],confidence:null};
  }
}
const workspace = {
  documents:{},annotations:{},viewerMarkups:{},notes,links:[],noteLinks:[],customTechniqueDefinitions:{},techniqueRuns:{},pendingSelection:null,
  activeDocumentId:null,activeNoteId:"root",graphView:{positions:{},camera:{x:0,y:0,zoom:1}},
  mapView:{activeMapId:"analysis-overview",maps:{"analysis-overview":{id:"analysis-overview",name:"Dense working picture",focusNoteId:"root",occurrences,camera:{x:0,y:0,zoom:1}}}},
  capabilities:{profile:"analytical",overrides:{}},noteSemantics:semantics,relationships:{},evidenceTags:{},annotationTags:[],annotationRoles:{}
};
await val(`localStorage.setItem('catalyst.browser.workspace.v1', ${JSON.stringify(JSON.stringify(workspace))}); localStorage.removeItem('catalyst.recovery.v1'); true`);
await call("Page.navigate",{url:"http://127.0.0.1:5173/?research=unified-workflow&shell=spatial&run=dense-live"});
await sleep(3500);
await val(`document.querySelector('[aria-label="Fit picture"]')?.click(); true`);
await sleep(800);
const measure = await val(`(()=>{const nodes=[...document.querySelectorAll('.picture-occurrence')]; const rects=nodes.map((e,i)=>{const r=e.getBoundingClientRect();return {i,text:e.textContent.trim(),x:r.x,y:r.y,w:r.width,h:r.height};}); const collisions=[]; for(let i=0;i<rects.length;i++)for(let j=i+1;j<rects.length;j++){const a=rects[i],b=rects[j];if(a.x<b.x+b.w&&a.x+a.w>b.x&&a.y<b.y+b.h&&a.y+a.h>b.y)collisions.push([a.text,b.text]);} return {count:rects.length,collisions,viewport:document.querySelector('.working-picture-viewport')?.getBoundingClientRect().toJSON?.(),zoom:document.querySelector('.picture-controls span')?.textContent,rects};})()`);
const shot = await call("Page.captureScreenshot",{format:"png",captureBeyondViewport:false});
const screenshotPath="C:/Users/iris/Downloads/Catalyst/tools/research-probes/2026-09-13/dense-working-picture-fit-live.png";
fs.writeFileSync(screenshotPath,Buffer.from(shot.result.data,"base64"));
const result={...measure,screenshotPath};
fs.writeFileSync("C:/Users/iris/Downloads/Catalyst/tools/research-probes/2026-09-13/dense-working-picture-fit-live.json",JSON.stringify(result,null,2));
console.log(JSON.stringify({count:result.count,collisionCount:result.collisions.length,collisions:result.collisions.slice(0,12),zoom:result.zoom,screenshotPath},null,2));
ws.close();