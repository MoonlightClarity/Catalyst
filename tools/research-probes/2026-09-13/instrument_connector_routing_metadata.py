from pathlib import Path
p=Path(r'C:\Users\iris\Downloads\Catalyst\tools\opera-browser-connector-reference\patched-5.1.0\assets\index.ts-BSpinIdX.js')
s=p.read_text(encoding='utf-8')
needle='async focusClientWindow(e){const s=await this.assignClientWindow(e,!1);if(s!=null)try{await chrome.windows.update(s,{focused:!0})}catch(a){console.warn("Failed to focus browser window for client:",a)}return s}async forwardToExtension(e,s){'
helper='async focusClientWindow(e){const s=await this.assignClientWindow(e,!1);if(s!=null)try{await chrome.windows.update(s,{focused:!0})}catch(a){console.warn("Failed to focus browser window for client:",a)}return s}async logCatalystRoutingDebug(e,s){try{const a=e&&typeof e=="object"?e:{},r=a.params&&typeof a.params=="object"?a.params:{},m=r._meta&&typeof r._meta=="object"?r._meta:{},k={};for(const[c,N]of Object.entries(m))/id|session|conversation|thread|request|trace|chat/i.test(c)&&(typeof N=="string"||typeof N=="number")&&(k[c]=String(N).slice(0,240));const y={at:Date.now(),clientId:String(s),rpcId:"id"in a?String(a.id):null,method:typeof a.method=="string"?a.method:null,tool:typeof r.name=="string"?r.name:null,paramKeys:Object.keys(r).sort(),metaKeys:Object.keys(m).sort(),metaIds:k},{catalystRoutingDebug:w=[]}=await chrome.storage.local.get("catalystRoutingDebug");await chrome.storage.local.set({catalystRoutingDebug:[...w,y].slice(-80)})}catch(a){console.warn("Catalyst routing debug log failed:",a)}}async forwardToExtension(e,s){await this.logCatalystRoutingDebug(e,s);'
assert s.count(needle)==1, s.count(needle)
s=s.replace(needle,helper,1)
p.write_text(s,encoding='utf-8')
print('routing metadata instrumentation applied')
