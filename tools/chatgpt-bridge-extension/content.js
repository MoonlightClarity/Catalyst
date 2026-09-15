const BRIDGE_PREFIX = "#catalyst-bridge=";
const BRIDGE_KEY = "cb_fe30e99f006b4f9c92ad5c9d83390cf9";
const MAX_MESSAGE_LENGTH = 12000;
const ORIGINAL_TITLE = document.title;
let bridgeCommandInFlight = null;

function decodeBase64Url(value) {
  const normalized = value.replace(/-/g, "+").replace(/_/g, "/");
  const padded = normalized + "=".repeat((4 - normalized.length % 4) % 4);
  const bytes = Uint8Array.from(atob(padded), (char) => char.charCodeAt(0));
  return new TextDecoder().decode(bytes);
}

function isVisible(node) {
  if (!(node instanceof HTMLElement)) return false;
  const rect = node.getBoundingClientRect();
  const style = getComputedStyle(node);
  return rect.width > 0 && rect.height > 0 && style.visibility !== "hidden" && style.display !== "none";
}
function showBridgeStatus(message, ok = true) {
  document.getElementById("catalyst-chat-bridge-status")?.remove();
  const node = document.createElement("div");
  node.id = "catalyst-chat-bridge-status";
  node.textContent = `Catalyst Chat Bridge: ${message}`;
  node.style.cssText = [
    "position:fixed", "right:16px", "bottom:96px", "z-index:2147483647",
    "padding:10px 12px", "border-radius:8px", "font:12px system-ui",
    `background:${ok ? "#153b2f" : "#5a2323"}`, "color:white",
    "box-shadow:0 4px 18px rgba(0,0,0,.3)"
  ].join(";");
  document.body.appendChild(node);
  document.title = `[Bridge: ${message}] ${ORIGINAL_TITLE}`;
  setTimeout(() => {
    node.remove();
    if (document.title.startsWith("[Bridge:")) document.title = ORIGINAL_TITLE;
  }, 20000);
}

function findComposer() {
  const selectors = [
    "#prompt-textarea[contenteditable='true']",
    "div.ProseMirror[contenteditable='true']",
    "[contenteditable='true'][role='textbox']",
    "[contenteditable='true'][data-lexical-editor='true']",
    "textarea[placeholder*='Ask']",
    "textarea"
  ];
  for (const selector of selectors) {
    const node = [...document.querySelectorAll(selector)].find(isVisible);
    if (node) return node;
  }
  return null;
}
function composerText(node) {
  if (node instanceof HTMLTextAreaElement || node instanceof HTMLInputElement) return node.value;
  return node.innerText ?? node.textContent ?? "";
}

function setComposerValue(node, text) {
  node.focus();
  if (node instanceof HTMLTextAreaElement || node instanceof HTMLInputElement) {
    const proto = node instanceof HTMLTextAreaElement ? HTMLTextAreaElement.prototype : HTMLInputElement.prototype;
    const setter = Object.getOwnPropertyDescriptor(proto, "value")?.set;
    if (setter) setter.call(node, text); else node.value = text;
    node.dispatchEvent(new Event("input", { bubbles: true }));
    node.dispatchEvent(new Event("change", { bubbles: true }));
    return;
  }

  const selection = window.getSelection();
  const range = document.createRange();
  range.selectNodeContents(node);
  selection?.removeAllRanges();
  selection?.addRange(range);

  let inserted = false;
  try { inserted = document.execCommand("insertText", false, text); } catch {}
  if (!inserted || composerText(node).trim() !== text.trim()) {
    node.replaceChildren();
    const paragraph = document.createElement("p");
    paragraph.textContent = text;
    node.appendChild(paragraph);
    node.dispatchEvent(new InputEvent("beforeinput", { bubbles: true, inputType: "insertText", data: text }));
    node.dispatchEvent(new InputEvent("input", { bubbles: true, inputType: "insertText", data: text }));
    node.dispatchEvent(new Event("change", { bubbles: true }));
  }
}
function findSendButton() {
  const selectors = [
    "button[data-testid='send-button']",
    "button[data-testid='composer-submit-button']",
    "button[aria-label='Send prompt']",
    "button[aria-label='Send message']"
  ];
  for (const selector of selectors) {
    const button = [...document.querySelectorAll(selector)].find((node) => isVisible(node) && !node.disabled);
    if (button) return button;
  }
  return [...document.querySelectorAll("button")].find((button) => {
    const label = button.getAttribute("aria-label") || button.textContent || "";
    return isVisible(button) && /^send\b/i.test(label.trim()) && !button.disabled;
  }) ?? null;
}

async function waitFor(getValue, timeoutMs = 45000) {
  const started = Date.now();
  while (Date.now() - started < timeoutMs) {
    const value = getValue();
    if (value) return value;
    await new Promise((resolve) => setTimeout(resolve, 125));
  }
  return null;
}

async function handleBridgeCommand() {
  if (!location.hash.startsWith(BRIDGE_PREFIX)) return;

  const raw = location.hash.slice(BRIDGE_PREFIX.length);
  if (bridgeCommandInFlight === raw) return;
  bridgeCommandInFlight = raw;
  const firstDot = raw.indexOf(".");
  const secondDot = raw.indexOf(".", firstDot + 1);
  if (firstDot < 0 || secondDot < 0) return;

  const key = raw.slice(0, firstDot);
  const action = raw.slice(firstDot + 1, secondDot);
  const payload = raw.slice(secondDot + 1);
  if (key !== BRIDGE_KEY || !["draft", "send"].includes(action)) return;

  let message;
  try { message = decodeBase64Url(payload); }
  catch { bridgeCommandInFlight = null; showBridgeStatus("invalid command payload", false); return; }
  if (!message || message.length > MAX_MESSAGE_LENGTH) {
    bridgeCommandInFlight = null;
    showBridgeStatus("message is empty or too long", false);
    return;
  }
  const composer = await waitFor(findComposer);
  if (!composer) {
    bridgeCommandInFlight = null;
    showBridgeStatus("composer not found; command preserved for retry", false);
    return;
  }

  setComposerValue(composer, message);
  await new Promise((resolve) => setTimeout(resolve, 150));
  if (composerText(composer).trim() !== message.trim()) {
    bridgeCommandInFlight = null;
    showBridgeStatus("composer rejected draft; command preserved for retry", false);
    return;
  }

  if (action === "draft") {
    history.replaceState(null, "", location.pathname + location.search);
    bridgeCommandInFlight = null;
    showBridgeStatus("draft inserted");
    return;
  }

  const sendButton = await waitFor(findSendButton);
  if (!sendButton) {
    bridgeCommandInFlight = null;
    showBridgeStatus("draft inserted but Send was not found; command preserved for retry", false);
    return;
  }

  const initialPath = location.pathname;
  sendButton.click();
  const committed = await waitFor(() => {
    const currentPath = location.pathname;
    const newConversationReady = !/^\/c\//.test(initialPath) && /^\/c\/[A-Za-z0-9-]+$/.test(currentPath);
    const existingConversationCommitted = /^\/c\//.test(initialPath) && (
      !document.contains(composer) || composerText(composer).trim() === ""
    );
    return newConversationReady || existingConversationCommitted;
  }, 60000);
  if (!committed) {
    bridgeCommandInFlight = null;
    showBridgeStatus("Send clicked but conversation commit not confirmed; command preserved", false);
    return;
  }
  history.replaceState(null, "", location.pathname + location.search);
  bridgeCommandInFlight = null;
  showBridgeStatus("message sent; conversation ready");
}

window.addEventListener("hashchange", handleBridgeCommand);
handleBridgeCommand();

function watchdogBusy() {
  const selectors = [
    "button[data-testid='stop-button']",
    "button[aria-label='Stop generating']",
    "button[aria-label='Stop answering']"
  ];
  if (selectors.some((s) => [...document.querySelectorAll(s)].some(isVisible))) return true;
  return [...document.querySelectorAll("button")].some((button) => {
    const label = button.getAttribute("aria-label") || button.textContent || "";
    return isVisible(button) && /^stop\b/i.test(label.trim());
  });
}

async function watchdogHeartbeat() {
  if (!watchdogBusy()) return;
  try { await chrome.runtime.sendMessage({ type: "watchdog-activity" }); } catch {}
}

setInterval(watchdogHeartbeat, 15000);
watchdogHeartbeat();
