from pathlib import Path
root = Path(r"C:\Users\iris\AppData\Roaming\Opera Software\Opera Stable\Default\Extensions\fnjbijbhcehgoglobkicibfpcmddlggg\5.1.0_0")
needle = "connectorEnabled"
for p in root.rglob("*.js"):
    try:
        s = p.read_text(encoding="utf-8", errors="ignore")
    except Exception:
        continue
    start = 0
    while True:
        i = s.find(needle, start)
        if i < 0:
            break
        a = max(0, i - 700)
        b = min(len(s), i + 1200)
        print(f"\n--- {p.relative_to(root)} @ {i} ---\n{s[a:b]}\n")
        start = i + len(needle)
