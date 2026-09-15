from pathlib import Path
root=Path(r'C:\Users\iris\AppData\Roaming\Opera Software\Opera Stable\Default\Local Extension Settings\fnjbijbhcehgoglobkicibfpcmddlggg')
for p in root.glob('*'):
    if p.suffix.lower() not in {'.log','.ldb'}:
        continue
    b=p.read_bytes()
    for key in (b'mcpClients', b'ChatGPT'):
        start=0
        while True:
            j=b.find(key,start)
            if j < 0:
                break
            lo=max(0,j-300); hi=min(len(b),j+1800)
            text=b[lo:hi].decode('utf-8','ignore').replace('\x00','')
            print(f'--- {p.name} @{j} key={key.decode()} ---')
            print(text[:1800])
            start=j+len(key)
