import fs from "node:fs";
const pages = await fetch("http://127.0.0.1:9229/json").then((r) => r.json());
const page = pages.find((item) => item.type === "page");
if (!page) throw new Error("No CDP page");
const ws = new WebSocket(page.webSocketDebuggerUrl);
let id = 1;
const pending = new Map();
ws.onmessage = (event) => {
  const message = JSON.parse(event.data);
  if (message.id && pending.has(message.id)) {
    pending.get(message.id)(message);
    pending.delete(message.id);
  }
};
await new Promise((resolve, reject) => { ws.onopen = resolve; ws.onerror = reject; });
const call = (method, params = {}) => new Promise((resolve) => {
  const callId = id++;
  pending.set(callId, resolve);
  ws.send(JSON.stringify({ id: callId, method, params }));
});
const evaluate = async (expression) => (await call("Runtime.evaluate", {
  expression, returnByValue: true, awaitPromise: true,
})).result.result.value;
const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
await call("Emulation.setDeviceMetricsOverride", {
  width: 1440, height: 900, deviceScaleFactor: 1, mobile: false,
});
await evaluate(`localStorage.removeItem('catalyst.browser.workspace.v1');
  localStorage.removeItem('catalyst.recovery.v1'); true`);
await call("Page.navigate", {
  url: "http://127.0.0.1:5173/?research=unified-workflow&fixture=tradecraft&shell=reader&run=exact-return-live",
});
await sleep(4500);
const pageRect = await evaluate(`(()=>{
  const root=document.querySelector('embedpdf-container')?.shadowRoot;
  const rect=[...(root?.querySelectorAll('img')||[])]
    .map((el)=>el.getBoundingClientRect())
    .find((r)=>r.width>500&&r.height>700&&r.y<900);
  return rect&&({x:rect.x,y:rect.y,w:rect.width,h:rect.height});
})()`);
if (!pageRect) throw new Error("Rendered PDF page not found");
const start = {
  x: pageRect.x + (150 / 612) * pageRect.w,
  y: pageRect.y + ((792 - 515) / 792) * pageRect.h,
};
const end = {
  x: pageRect.x + (410 / 612) * pageRect.w,
  y: pageRect.y + ((792 - 465) / 792) * pageRect.h,
};
await call("Input.dispatchMouseEvent", { type: "mouseMoved", ...start });
await call("Input.dispatchMouseEvent", {
  type: "mousePressed", ...start, button: "left", clickCount: 1,
});
for (let step = 1; step <= 18; step += 1) {
  await call("Input.dispatchMouseEvent", {
    type: "mouseMoved",
    x: start.x + ((end.x - start.x) * step) / 18,
    y: start.y + ((end.y - start.y) * step) / 18,
    button: "left", buttons: 1,
  });
  await sleep(25);
}
await call("Input.dispatchMouseEvent", {
  type: "mouseReleased", ...end, button: "left", clickCount: 1,
});
await sleep(900);
await evaluate(`document.querySelector('[aria-label="Save evidence"]')?.click(); true`);
await sleep(1200);
const saved = await evaluate(`JSON.parse(localStorage.getItem('catalyst.browser.workspace.v1')||'{}')`);
const annotation = Object.values(saved.annotations || {})[0];
if (!annotation?.sourceRange) throw new Error("Saved evidence has no sourceRange");
const clearResult = await evaluate(`(async()=>{
  const el=document.querySelector('embedpdf-container');
  const registry=await el._registryPromise;
  const scope=registry.getPlugin('selection')?.provides()?.forDocument?.(${JSON.stringify(annotation.documentId)});
  scope?.clear?.();
  await new Promise(r=>setTimeout(r,250));
  return scope?.getState?.()?.selection ?? null;
})()`);
await evaluate(`([...document.querySelectorAll('[role=tab]')]
  .find((el)=>el.textContent.trim().startsWith('Evidence')))?.click(); true`);
await sleep(500);
await evaluate(`document.querySelector('.evidence-card')?.click(); true`);
await sleep(1200);
const restored = await evaluate(`(async()=>{
  const el=document.querySelector('embedpdf-container');
  const registry=await el._registryPromise;
  const scope=registry.getPlugin('selection')?.provides()?.forDocument?.(${JSON.stringify(annotation.documentId)});
  return scope?.getState?.()?.selection ?? null;
})()`);
const status = await evaluate(`document.querySelector('.status')?.textContent || document.body.innerText.includes('Source region')`);
const shot = await call("Page.captureScreenshot", { format: "png", captureBeyondViewport: false });
const screenshotPath = "C:/Users/iris/Downloads/Catalyst/tools/research-probes/2026-09-13/exact-source-return-live.png";
fs.writeFileSync(screenshotPath, Buffer.from(shot.result.data, "base64"));
const result = {
  annotationId: annotation.id,
  sourceRange: annotation.sourceRange,
  selectionAfterClear: clearResult,
  restoredSelection: restored,
  exactMatch: JSON.stringify(restored) === JSON.stringify(annotation.sourceRange),
  status,
  screenshotPath,
};
fs.writeFileSync("C:/Users/iris/Downloads/Catalyst/tools/research-probes/2026-09-13/exact-return-result.json", JSON.stringify(result, null, 2));
console.log(JSON.stringify(result, null, 2));
ws.close();