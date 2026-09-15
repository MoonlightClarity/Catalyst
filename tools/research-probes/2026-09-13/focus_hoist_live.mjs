import fs from 'node:fs';
const pages=await fetch('http://127.0.0.1:9229/json').then(r=>r.json());
const page=pages.find(x=>x.type==='page'&&x.url.startsWith('http://127.0.0.1:5173'));
if(!page) throw new Error('No Catalyst Opera/CDP page');
const ws=new WebSocket(page.webSocketDebuggerUrl); let id=1; const pending=new Map();
ws.onmessage=e=>{const m=JSON.parse(e.data);if(m.id&&pending.has(m.id)){pending.get(m.id)(m);pending.delete(m.id)}};
await new Promise((r,j)=>{ws.onopen=r;ws.onerror=j});
const c=(method,params={})=>new Promise(r=>{const n=id++;pending.set(n,r);ws.send(JSON.stringify({id:n,method,params}))});
const v=async expression=>(await c('Runtime.evaluate',{expression,returnByValue:true,awaitPromise:true})).result.result.value;
const sleep=ms=>new Promise(r=>setTimeout(r,ms));
const key='catalyst.browser.workspace.v1';
const stateNow=()=>v(`JSON.parse(localStorage.getItem('${key}'))`);
const waitNodes=async()=>{for(let i=0;i<40;i++){await sleep(150);if(await v(`document.querySelectorAll('.picture-occurrence').length===4`))return;}throw new Error('nodes not ready')};
const dbl=async title=>{await v(`(()=>{const el=[...document.querySelectorAll('.picture-occurrence')].find(x=>x.textContent?.includes(${JSON.stringify(title)}));el?.querySelector('.picture-object')?.dispatchEvent(new MouseEvent('dblclick',{bubbles:true}));return !!el})()`);await sleep(500)};
const click=async label=>{await v(`document.querySelector('[aria-label="${label}"]')?.click();true`);await sleep(500)};
await c('Emulation.setDeviceMetricsOverride',{width:1440,height:900,deviceScaleFactor:1,mobile:false});
await c('Page.navigate',{url:'http://127.0.0.1:5173/?research=unified-workflow&shell=spatial&run=focus-hoist-live'});await sleep(1000);
const raw=await v(`localStorage.getItem('${key}')||''`); const state=raw?JSON.parse(raw):{};
const note=(id,title,day)=>({id,title,body:'',createdAt:'2026-02-'+String(day).padStart(2,'0')+'T00:00:00.000Z',updatedAt:'2026-02-'+String(day).padStart(2,'0')+'T00:00:00.000Z',deletedAt:null});
state.documents={};state.annotations={};state.viewerMarkups={};state.links=[];state.noteLinks=[];state.customTechniqueDefinitions={};state.techniqueRuns={};state.pendingSelection=null;state.activeDocumentId=null;
state.notes={root:note('root','Focus root',1),branch:note('branch','Focus branch',2),detail:note('detail','Focus detail',3),outside:note('outside','Outside context',4)};state.activeNoteId=null;
state.noteSemantics={root:{roles:['note'],confidence:null},branch:{roles:['claim'],confidence:'medium'},detail:{roles:['question'],confidence:null},outside:{roles:['assumption'],confidence:null}};
state.relationships={rel:{id:'rel',fromId:'detail',toId:'outside',type:'depends-on',directed:true,label:null,createdAt:'2026-02-05T00:00:00.000Z',updatedAt:'2026-02-05T00:00:00.000Z'}};state.evidenceTags={};state.annotationTags=[];state.annotationRoles={};state.graphView={positions:{},camera:{x:0,y:0,zoom:1}};state.capabilities={profile:'analytical',overrides:{}};state.mapView={activeMapId:'analysis-overview',maps:{'analysis-overview':{id:'analysis-overview',name:'Focus probe',focusNoteId:'root',focusTrail:[],occurrences:{root:{noteId:'root',parentNoteId:null,siblingOrder:0,position:null,collapsed:false,manual:false},branch:{noteId:'branch',parentNoteId:'root',siblingOrder:0,position:null,collapsed:false,manual:false},detail:{noteId:'detail',parentNoteId:'branch',siblingOrder:0,position:null,collapsed:false,manual:false},outside:{noteId:'outside',parentNoteId:'root',siblingOrder:1,position:null,collapsed:false,manual:false}},camera:{x:110,y:70,zoom:0.92}}}};
await v(`localStorage.setItem('${key}',${JSON.stringify(JSON.stringify(state))});true`);await c('Page.reload');await waitNodes();await sleep(350);
let s=await stateNow(); const initialMap=s.mapView.maps[s.mapView.activeMapId];
const baseline={camera:initialMap.camera,focus:initialMap.focusNoteId,active:s.activeNoteId,parents:Object.fromEntries(Object.entries(initialMap.occurrences).map(([k,o])=>[k,o.parentNoteId])),relationships:s.relationships};
await dbl('Focus branch');
s=await stateNow(); const afterBranch=s.mapView.maps[s.mapView.activeMapId];
const branchContext={camera:afterBranch.camera,focus:afterBranch.focusNoteId,active:s.activeNoteId,trail:afterBranch.focusTrail};
await dbl('Focus detail');
await sleep(700); s=await stateNow(); const nested=s.mapView.maps[s.mapView.activeMapId];
const nestedBeforeReload={camera:nested.camera,focus:nested.focusNoteId,active:s.activeNoteId,trail:nested.focusTrail};
await c('Page.reload'); await waitNodes(); await sleep(500);
s=await stateNow(); const afterReload=s.mapView.maps[s.mapView.activeMapId];
const remount={focus:afterReload.focusNoteId,active:s.activeNoteId,trail:afterReload.focusTrail,backEnabled:await v(`!document.querySelector('[aria-label="Back"]')?.disabled`)};
await click('Back'); s=await stateNow(); const afterBack=s.mapView.maps[s.mapView.activeMapId];
const back={focus:afterBack.focusNoteId,camera:afterBack.camera,active:s.activeNoteId,trail:afterBack.focusTrail};
await click('Issue overview'); s=await stateNow(); const afterHome=s.mapView.maps[s.mapView.activeMapId];
const home={focus:afterHome.focusNoteId,camera:afterHome.camera,active:s.activeNoteId,trail:afterHome.focusTrail,parents:Object.fromEntries(Object.entries(afterHome.occurrences).map(([k,o])=>[k,o.parentNoteId])),relationships:s.relationships};
const shot=await c('Page.captureScreenshot',{format:'png',captureBeyondViewport:false});
const screenshotPath='C:/Users/iris/Downloads/Catalyst/tools/research-probes/2026-09-13/focus-hoist-restored.png';
fs.writeFileSync(screenshotPath,Buffer.from(shot.result.data,'base64'));const eq=(a,b)=>JSON.stringify(a)===JSON.stringify(b);
const pass=
  baseline.focus==='root'&&
  branchContext.focus==='branch'&&branchContext.trail?.length===1&&
  nestedBeforeReload.focus==='detail'&&nestedBeforeReload.trail?.length===2&&
  remount.focus==='detail'&&remount.trail?.length===2&&remount.backEnabled===true&&
  back.focus==='branch'&&eq(back.camera,branchContext.camera)&&back.active==='branch'&&back.trail?.length===1&&
  home.focus==='root'&&eq(home.camera,baseline.camera)&&home.trail?.length===0&&
  eq(home.parents,baseline.parents)&&eq(home.relationships,baseline.relationships);
console.log(JSON.stringify({baseline,branchContext,nestedBeforeReload,remount,back,home,screenshotPath,pass},null,2));
ws.close();