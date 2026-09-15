from pathlib import Path
root = Path(r"C:\Users\iris\AppData\Roaming\Opera Software\Opera Stable\Default\Local Extension Settings\fnjbijbhcehgoglobkicibfpcmddlggg")
for p in sorted(root.iterdir()):
    if p.suffix not in {".log", ".ldb"}: continue
    data = p.read_bytes()
    for key in (b"connectorError", b"serverError"):
        i = data.rfind(key)
        if i < 0: continue
        chunk = data[i:i+700]
        text = ''.join(chr(b) if 32 <= b < 127 else ' ' for b in chunk)
        print(f"--- {p.name} {key.decode()} ---")
        print(' '.join(text.split()))
