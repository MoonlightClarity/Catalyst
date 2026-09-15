from pathlib import Path
p=Path(r'C:\Users\iris\AppData\Roaming\Opera Software\Opera Stable\Default\Extensions\fnjbijbhcehgoglobkicibfpcmddlggg\5.1.0_0\assets\index.ts-BSpinIdX.js')
s=p.read_text(encoding='utf-8')
old_timeout='resetInactivityTimer(){this.keepAlive||(this.clearInactivityTimer(),this.inactivityTimeout=setTimeout(()=>{console.log("Inactivity timeout reached, closing connector"),this.onInactivityTimeoutCallback?.(),this.close()},On))}'
new_timeout='resetInactivityTimer(){this.clearInactivityTimer()}'
old_evict='a&&(console.log(`Evicting existing client "${s}" (${a.clientId}) to replace with (${e})`),this.onClientEvictedCallback?.(a.clientId,a.name),this.removeClient(a.clientId))'
new_evict='a&&(console.log(`Existing client "${s}" (${a.clientId}) retained; opening a fresh browser window for new client (${e})`),(()=>{try{const m=chrome.windows?.create?.({focused:!0});m?.catch?.(k=>console.warn("Failed to open browser window for additional client:",k))}catch(m){console.warn("Failed to open browser window for additional client:",m)}})())'
assert s.count(old_timeout)==1, ('timeout',s.count(old_timeout))
assert s.count(old_evict)==1, ('evict',s.count(old_evict))
s=s.replace(old_timeout,new_timeout).replace(old_evict,new_evict)
p.write_text(s,encoding='utf-8')
print('live connector patched')
