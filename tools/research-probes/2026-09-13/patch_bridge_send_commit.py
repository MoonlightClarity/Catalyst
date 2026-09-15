from pathlib import Path
p = Path(r'C:\Users\iris\Downloads\Catalyst\tools\chatgpt-bridge-extension\content.js')
s = p.read_text(encoding='utf-8')
old = '''  sendButton.click();
  history.replaceState(null, "", location.pathname + location.search);
  bridgeCommandInFlight = null;
  showBridgeStatus("message sent");
'''
new = '''  const initialPath = location.pathname;
  sendButton.click();
  const committed = await waitFor(() => {
    const currentPath = location.pathname;
    const newConversationReady = !/^\\/c\\//.test(initialPath) && /^\\/c\\/[A-Za-z0-9-]+$/.test(currentPath);
    const existingConversationCommitted = /^\\/c\\//.test(initialPath) && (
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
'''
if old not in s:
    raise SystemExit('send block not found')
p.write_text(s.replace(old, new, 1), encoding='utf-8')
print('bridge send-commit patched')
