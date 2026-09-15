const pages = await fetch('http://127.0.0.1:9229/json').then(r => r.json());
const page = pages.find(p => p.type === 'page' && p.url.includes('127.0.0.1:5173'));
if (!page) throw new Error('No Catalyst CDP page');
const ws = new WebSocket(page.webSocketDebuggerUrl);
let id = 1;
const pending = new Map();
ws.onmessage = event => {
  const message = JSON.parse(event.data);
  if (message.id && pending.has(message.id)) {
    pending.get(message.id)(message);
    pending.delete(message.id);
  }
};
await new Promise((resolve, reject) => { ws.onopen = resolve; ws.onerror = reject; });
const call = (method, params = {}) => new Promise(resolve => {
  const callId = id++;
  pending.set(callId, resolve);
  ws.send(JSON.stringify({ id: callId, method, params }));
});
const val = async expression => {
  const message = await call('Runtime.evaluate', { expression, returnByValue: true, awaitPromise: true });
  if (message.result?.exceptionDetails) throw new Error(message.result.exceptionDetails.exception?.description || message.result.exceptionDetails.text);
  return message.result?.result?.value;
};
const sleep = ms => new Promise(resolve => setTimeout(resolve, ms));const setField = async (selector, value) => val(`(()=>{const e=[...document.querySelectorAll(${JSON.stringify(selector)})].find(x=>x.offsetParent!==null);if(!e)return false;const p=e.tagName==='TEXTAREA'?HTMLTextAreaElement.prototype:HTMLInputElement.prototype;Object.getOwnPropertyDescriptor(p,'value').set.call(e,${JSON.stringify(value)});e.dispatchEvent(new Event('input',{bubbles:true}));e.dispatchEvent(new Event('change',{bubbles:true}));return true})()`);
const clickButton = label => val(`(()=>{const b=[...document.querySelectorAll('button')].find(x=>x.offsetParent!==null&&(x.getAttribute('aria-label')===${JSON.stringify(label)}||x.textContent?.trim()===${JSON.stringify(label)}));if(!b)return false;b.click();return true})()`);
await val(`localStorage.removeItem('catalyst.xml.workspace.v1');localStorage.removeItem('catalyst.browser.workspace.v1');localStorage.removeItem('catalyst.recovery.v1');true`);
await call('Page.navigate', { url: 'http://127.0.0.1:5173/' });
await sleep(1800);
const initial = await val(`(()=>({outline:document.querySelector('[aria-label="Outline view"]')?.getAttribute('aria-pressed'),map:document.querySelector('[aria-label="Map view"]')?.getAttribute('aria-pressed'),rows:document.querySelectorAll('[data-outline-note-id]').length}))()`);
await clickButton('New thought');
await sleep(350);
await setField('[aria-label="Thought title"]', 'Outline root');
await val(`document.querySelector('[aria-label="Thought title"]')?.blur();true`);
await sleep(350);
await val(`(()=>{const rows=[...document.querySelectorAll('[data-outline-note-id]')];const row=rows.at(-1);const b=row?.querySelector('[aria-label="Add child"]');b?.click();return !!b})()`);
await sleep(350);
await setField('[aria-label="Thought title"]', 'Outline child');
await val(`document.querySelector('[aria-label="Thought title"]')?.blur();true`);
await sleep(450);
await val(`(()=>{const b=[...document.querySelectorAll('.picture-outline-title')].find(x=>x.textContent?.trim()==='Outline root');b?.click();return !!b})()`);
await sleep(250);const linked = await val(`(()=>{const s=document.querySelector('[aria-label="Link this thought to another thought"]');if(!s)return false;const option=[...s.options].find(o=>o.value);if(!option)return false;const setter=Object.getOwnPropertyDescriptor(HTMLSelectElement.prototype,'value').set;setter.call(s,option.value);s.dispatchEvent(new Event('change',{bubbles:true}));return true})()`);
await sleep(450);
await clickButton('Map view');
await sleep(450);
const mapState = await val(`(()=>{const first=document.querySelector('.picture-occurrence .picture-object');const occurrence=first?.closest('.picture-occurrence');const before=occurrence?.getAttribute('style')||'';if(first){first.dispatchEvent(new PointerEvent('pointerdown',{bubbles:true,button:0,pointerId:77,clientX:100,clientY:100}));first.dispatchEvent(new PointerEvent('pointermove',{bubbles:true,pointerId:77,clientX:260,clientY:220}));first.dispatchEvent(new PointerEvent('pointerup',{bubbles:true,pointerId:77,clientX:260,clientY:220}));}const after=occurrence?.getAttribute('style')||'';return {occurrences:document.querySelectorAll('.picture-occurrence').length,semanticEdges:document.querySelectorAll('.picture-semantic-relation').length,resizeHandles:document.querySelectorAll('.picture-resize-handle').length,branchButtons:[...document.querySelectorAll('.picture-object-actions button')].filter(b=>b.textContent?.trim()==='Branch').length,connectButtons:[...document.querySelectorAll('.picture-object-actions button')].filter(b=>b.textContent?.trim()==='Connect').length,zoomControls:document.querySelector('.working-picture-viewport')?.querySelectorAll('[aria-label="Zoom in"],[aria-label="Zoom out"]').length??0,stageHasScale:(document.querySelector('.working-picture-stage')?.getAttribute('style')||'').includes('scale('),dragUnchanged:before===after,hint:document.querySelector('.picture-canvas-hint')?.textContent?.trim()||''};})()`);
const beforeReload = await val(`(()=>({xml:!!localStorage.getItem('catalyst.xml.workspace.v1'),relationships:document.querySelectorAll('.relationship-row').length}))()`);
await call('Page.reload', {});
await sleep(1800);
const afterReload = await val(`(()=>({outline:document.querySelector('[aria-label="Outline view"]')?.getAttribute('aria-pressed'),rows:document.querySelectorAll('[data-outline-note-id]').length,xml:!!localStorage.getItem('catalyst.xml.workspace.v1'),alerts:[...document.querySelectorAll('[role="alert"]')].map(x=>x.textContent).filter(Boolean)}))()`);
const pass = initial.outline === 'true' && initial.rows === 0 && linked && mapState.occurrences === 2 && mapState.semanticEdges >= 1 && mapState.resizeHandles === 0 && mapState.branchButtons === 0 && mapState.connectButtons === 0 && mapState.zoomControls === 0 && !mapState.stageHasScale && !mapState.hint.toLowerCase().includes('zoom') && mapState.dragUnchanged && beforeReload.xml && afterReload.outline === 'true' && afterReload.rows === 2 && afterReload.xml && afterReload.alerts.length === 0;
console.log(JSON.stringify({ initial, linked, mapState, beforeReload, afterReload, pass }, null, 2));
ws.close();
if (!pass) process.exitCode = 1;