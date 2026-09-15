from pathlib import Path
p=Path(r'C:\Users\iris\Downloads\Catalyst\tools\opera-browser-connector-reference\patched-5.1.0\assets\index.ts-BSpinIdX.js')
s=p.read_text(encoding='utf-8', errors='ignore')
for needle in ['mcpClients=[];', 'async forwardToExtension(e,s){', 'registerClient(e,s){', 'removeClient(e){']:
    j=s.find(needle)
    print('\n===', needle, '@', j, '===')
    print(s[max(0,j-700):j+2200] if j>=0 else 'NOT FOUND')
