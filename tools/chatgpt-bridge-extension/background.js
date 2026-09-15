const BRIDGE_KEY = "cb_fe30e99f006b4f9c92ad5c9d83390cf9";
const CONTINUE_PAYLOAD = "Y29udGludWU";
const DEFAULT_EXPIRY = "2026-09-12T10:30:00.000Z";
const IDLE_MS = 4 * 60 * 1000;
const COOLDOWN_MS = 3 * 60 * 1000;
const FORCE_DISABLED = true; // temporary manual shutdown before 2026-09-12 synthesis
const ROOT_COORDINATOR = "https://chatgpt.com/c/6aa425f5-9dd0-83ea-aa40-ad00de78c940";
const SEEDED_TARGETS = [
  ["ARCHITECTURE", "https://chatgpt.com/c/6aa4ac75-1f44-83e9-b1bf-3f6b74c822ee"],
  ["FORWARD_RESEARCH", "https://chatgpt.com/c/6aa4a834-91f8-83e9-b120-332284efb95a"],
  ["CONTINUITY", "https://chatgpt.com/c/6aa4a876-e448-83ea-8e2a-2ba9baf4ac65"],
  ["COGNITIVE_ERGONOMICS", "https://chatgpt.com/c/6aa47cb2-3850-83e9-a20c-36e849439f59"],
  ["PROVENANCE_PLACEMENT", "https://chatgpt.com/c/6aa48fbe-b2c8-83ea-ab30-4f4dce0bed01"],
  ["ADVERSARIAL_ARCHITECTURE", "https://chatgpt.com/c/6aa30e43-c9f0-83ea-a378-c26ede7dd0be"],
  ["IMPLEMENTATION_PRIMITIVES", "https://chatgpt.com/c/6aa4408a-febc-83e9-88bd-02e3ae3867b8"],
  ["INTERACTION_PATTERNS", "https://chatgpt.com/c/6aa3e501-fb50-83ea-a079-99d324509473"],
  ["DECISION_AUDIT", "https://chatgpt.com/c/6aa2a187-7580-83ea-ab42-9475587306a5"]
];

async function getState() {
  const { watchdog = {} } = await chrome.storage.local.get("watchdog");
  return watchdog;
}
async function putState(patch) {
  const current = await getState();
  const watchdog = { ...current, ...patch };
  await chrome.storage.local.set({ watchdog });
  return watchdog;
}
function validTarget(url) {
  return /^https:\/\/chatgpt\.com\/c\/[A-Za-z0-9-]+$/.test(url || "");
}
function bridgeUrl(targetUrl) {
  return `${targetUrl.split("#")[0]}#catalyst-bridge=${BRIDGE_KEY}.send.${CONTINUE_PAYLOAD}`;
}function seedMembers(currentUrl, previous = {}) {
  const now = Date.now();
  const byUrl = new Map((previous.members || []).map(m => [m.url, m]));
  const entries = [["COORDINATOR", currentUrl], ...SEEDED_TARGETS];
  return entries.filter(([, url]) => validTarget(url)).map(([role, url]) => ({
    role, url,
    lastActivityAt: Number(byUrl.get(url)?.lastActivityAt || now),
    lastSendAt: Number(byUrl.get(url)?.lastSendAt || 0),
    sendCount: Number(byUrl.get(url)?.sendCount || 0)
  }));
}

function ensureAlarm() {
  chrome.alarms.create("catalyst-watchdog", { periodInMinutes: 1 });
}
chrome.runtime.onInstalled.addListener(async () => {
  ensureAlarm();
  const previous = await getState();
  if (previous.disabledReason === "manual") return;
  if (!previous.enabled) {
    await putState({
      enabled: true,
      hardExpiryUtc: DEFAULT_EXPIRY,
      generation: Number(previous.generation || 0) + 1,
      disabledReason: null,
      members: seedMembers(ROOT_COORDINATOR, previous)
    });
  } else {
    await putState({ members: seedMembers(ROOT_COORDINATOR, previous) });
  }
});
chrome.runtime.onStartup.addListener(ensureAlarm);

async function bootstrapWatchdog() {
  if (FORCE_DISABLED) {
    await putState({ enabled:false, disabledReason:"manual", disabledAt:Date.now() });
    return;
  }
  ensureAlarm();
  const previous = await getState();
  const expiry = Date.parse(DEFAULT_EXPIRY);
  if (!Number.isFinite(expiry) || Date.now() >= expiry) {
    if (previous.enabled) await putState({ enabled:false, disabledReason:"expired", disabledAt:Date.now() });
    return;
  }
  if (previous.disabledReason === "manual") return;
  await putState({
    enabled:true,
    hardExpiryUtc:DEFAULT_EXPIRY,
    generation:Number(previous.generation || 0) + (previous.enabled ? 0 : 1),
    disabledReason:null,
    members:seedMembers(ROOT_COORDINATOR, previous)
  });
}
bootstrapWatchdog().catch(() => {});

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  (async () => {
    if (message?.type === "watchdog-arm") {
      const currentUrl = String(message.targetUrl || "").split("#")[0];
      if (!validTarget(currentUrl)) return sendResponse({ ok:false, error:"Arm from a specific ChatGPT conversation." });
      const previous = await getState();
      const watchdog = await putState({
        enabled:true,
        hardExpiryUtc: message.hardExpiryUtc || DEFAULT_EXPIRY,
        generation:Number(previous.generation || 0) + 1,
        disabledReason:null,
        members:seedMembers(currentUrl, previous)
      });
      ensureAlarm();
      return sendResponse({ ok:true, watchdog });
    }
    if (message?.type === "watchdog-disable") {
      const watchdog = await putState({ enabled:false, disabledReason:"manual", disabledAt:Date.now() });
      return sendResponse({ ok:true, watchdog });
    }
    if (message?.type === "watchdog-status") return sendResponse({ ok:true, watchdog:await getState() });    if (message?.type === "watchdog-activity") {
      const state = await getState();
      const page = String(sender.tab?.url || "").split("#")[0];
      if (!state.enabled || !validTarget(page)) return sendResponse({ ok:true });
      const members = (state.members || []).map(m => m.url === page ? { ...m, lastActivityAt:Date.now() } : m);
      await putState({ members });
      return sendResponse({ ok:true });
    }
  })().catch(error => sendResponse({ ok:false, error:String(error) }));
  return true;
});

chrome.alarms.onAlarm.addListener(async alarm => {
  if (alarm.name !== "catalyst-watchdog") return;
  const state = await getState();
  if (!state.enabled) return;
  const now = Date.now();
  const expiry = Date.parse(state.hardExpiryUtc || "");
  if (!Number.isFinite(expiry) || now >= expiry) {
    await putState({ enabled:false, disabledReason:"expired", disabledAt:now });
    return;
  }
  const members = [...(state.members || [])];
  for (let i = 0; i < members.length; i++) {
    const m = members[i];
    if (!validTarget(m.url)) continue;
    if (now - Number(m.lastActivityAt || 0) < IDLE_MS) continue;
    if (now - Number(m.lastSendAt || 0) < COOLDOWN_MS) continue;    const tabs = await chrome.tabs.query({ url:"https://chatgpt.com/*" });
    const target = tabs.find(tab => String(tab.url || "").split("#")[0] === m.url);
    if (target?.id) await chrome.tabs.update(target.id, { url:bridgeUrl(m.url) });
    else await chrome.tabs.create({ url:bridgeUrl(m.url), active:false });
    members[i] = { ...m, lastSendAt:now, sendCount:Number(m.sendCount || 0) + 1 };
  }
  await putState({ members });
});
