from pathlib import Path
p=Path(r'C:\Users\iris\AppData\Roaming\Opera Software\Opera Stable\Default\Extensions\jialblogdhkabmefghicaknhginkjbgd\5.1.0_0\sw.js')
s=p.read_text(encoding='utf-8', errors='ignore')
for needle in ['client_id','clientId','currentWindow','windows.create','tabs.create','session']:
    print(f'\n=== {needle} ===')
    start=0
    for i in range(8):
        j=s.find(needle,start)
        if j<0: break
        print(s[max(0,j-900):j+1800])
        print('\n---\n')
        start=j+len(needle)
