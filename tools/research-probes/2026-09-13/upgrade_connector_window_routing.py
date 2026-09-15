from pathlib import Path
import re

p=Path(r'C:\Users\iris\Downloads\Catalyst\tools\opera-browser-connector-reference\patched-5.1.0\assets\index.ts-BSpinIdX.js')
s=p.read_text(encoding='utf-8')

def once(old,new,label):
    global s
    n=s.count(old)
    if n!=1: raise RuntimeError(f'{label}: expected 1 match, got {n}')
    s=s.replace(old,new,1)

once('mcpClients=[];reconnectAttempt=0;', 'mcpClients=[];clientWindows=new Map;reconnectAttempt=0;', 'clientWindows field')

marker='async forwardToExtension(e,s){this.touchClientActivity(s);'
methods='async assignClientWindow(e,s=!1){let a=this.clientWindows.get(e);if(!s&&a!=null)try{await chrome.windows.get(a);return a}catch{this.clientWindows.delete(e)}try{const r=s?await chrome.windows.create({focused:!0}):await chrome.windows.getLastFocused({windowTypes:["normal"]});if(r?.id!=null)return this.clientWindows.set(e,r.id),r.id}catch(r){console.warn("Failed to assign browser window to client:",r)}return null}async focusClientWindow(e){const s=await this.assignClientWindow(e,!1);if(s!=null)try{await chrome.windows.update(s,{focused:!0})}catch(a){console.warn("Failed to focus browser window for client:",a)}return s}'
once(marker, methods+marker, 'window methods')

needle='typeof e.params=="object"&&"name"in e.params;if(a){'
once(needle, 'typeof e.params=="object"&&"name"in e.params;a&&await this.focusClientWindow(s);if(a){', 'focus before tools call')

pat=r'registerClient\(e,s\)\{.*?\}touchClientActivity\(e\)\{'
m=re.search(pat,s)
if not m: raise RuntimeError('registerClient block not found')
reg='registerClient(e,s){const a=this.mcpClients.find(m=>m.clientId!==e&&m.name===s);this.mcpClients.find(m=>m.clientId===e)?console.log(`Client already registered: "${s}" (${e})`):(this.assignClientWindow(e,!!a).then(m=>console.log(`Assigned client "${s}" (${e}) to window ${m??"unknown"}`)).catch(m=>console.warn("Failed to assign client window:",m)),console.log(`Client connected: "${s}" (${e}), total clients: ${this.mcpClients.length+1}`),ee({action:oe.Connected,element:te.Connection,context:ve.Onboarding,customValue:{client:s}}),this.mcpClients.push({name:s,clientId:e,connectedAt:Date.now()}),this.onMcpClientsChangeCallback?.(this.mcpClients))}touchClientActivity(e){'
s=s[:m.start()]+reg+s[m.end():]
once('this.mcpClients=this.mcpClients.filter(a=>a.clientId!==e)}removeAllClients(){','this.mcpClients=this.mcpClients.filter(a=>a.clientId!==e),this.clientWindows.delete(e)}removeAllClients(){','remove client window')
once('this.mcpClients=[]}setClientToolCalling','this.mcpClients=[],this.clientWindows.clear()}setClientToolCalling','clear client windows')
p.write_text(s,encoding='utf-8')
print('reference window-routing patch applied')