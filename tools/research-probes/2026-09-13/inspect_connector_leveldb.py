from pathlib import Path
root = Path(r"C:\Users\iris\AppData\Roaming\Opera Software\Opera Stable\Default\Local Extension Settings\fnjbijbhcehgoglobkicibfpcmddlggg")
keys = [b"connectorEnabled", b"keepAlive", b"connectorError", b"serverError", b"reconnectInfo"]
for p in sorted(root.iterdir()):
    if p.suffix not in {".log", ".ldb"}: continue
    data = p.read_bytes()
    for key in keys:
        start = 0
        while True:
            i = data.find(key, start)
            if i < 0: break
            chunk = data[i:i+120]
            printable = ''.join(chr(b) if 32 <= b < 127 else '.' for b in chunk)
            print(f"{p.name} {key.decode()} @ {i}: {printable}")
            start = i + len(key)
