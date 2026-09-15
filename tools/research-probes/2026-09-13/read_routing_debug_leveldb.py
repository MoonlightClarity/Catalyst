from pathlib import Path
root=Path(r'C:\Users\iris\AppData\Roaming\Opera Software\Opera Stable\Default\Local Extension Settings\fnjbijbhcehgoglobkicibfpcmddlggg')
key=b'catalystRoutingDebug'
for p in sorted(root.glob('*')):
    if p.suffix.lower() not in {'.log','.ldb'}: continue
    b=p.read_bytes(); start=0
    while True:
        i=b.find(key,start)
        if i<0: break
        chunk=b[max(0,i-100):min(len(b),i+5000)]
        text=chunk.decode('utf-8','backslashreplace').replace('\x00','')
        print(f'--- {p.name} @{i} ---')
        print(text.encode('ascii','backslashreplace').decode('ascii'))
        start=i+1
