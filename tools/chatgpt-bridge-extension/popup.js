const EXPIRY = "2026-09-12T10:30:00.000Z";
const statusNode = document.getElementById("status");

async function activeTab() {
  const [tab] = await chrome.tabs.query({ active:true, currentWindow:true });
  return tab;
}
function ago(ms) {
  if (!ms) return "never";
  return `${Math.max(0, Math.round((Date.now() - ms) / 60000))}m ago`;
}
function fmt(state) {
  if (!state?.enabled) return `OFF${state?.disabledReason ? `\nReason: ${state.disabledReason}` : ""}`;
  const lines = [`ON until ${new Date(state.hardExpiryUtc).toLocaleString()}`, `Generation: ${state.generation || 0}`];
  for (const m of state.members || []) {
    lines.push(`${m.role}: activity ${ago(m.lastActivityAt)}, continues ${m.sendCount || 0}`);
  }
  return lines.join("\n");
}
async function refresh() {
  const r = await chrome.runtime.sendMessage({ type:"watchdog-status" });
  statusNode.textContent = fmt(r.watchdog);
}

document.getElementById("arm").addEventListener("click", async () => {
  const tab = await activeTab();
  const r = await chrome.runtime.sendMessage({ type:"watchdog-arm", targetUrl:tab?.url || "", hardExpiryUtc:EXPIRY });
  statusNode.textContent = r.ok ? fmt(r.watchdog) : `Not armed: ${r.error}`;
});document.getElementById("disable").addEventListener("click", async () => {
  const r = await chrome.runtime.sendMessage({ type:"watchdog-disable" });
  statusNode.textContent = fmt(r.watchdog);
});

refresh().catch(error => {
  statusNode.textContent = `Status error: ${error.message}`;
});
