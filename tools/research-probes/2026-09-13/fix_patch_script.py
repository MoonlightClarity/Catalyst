from pathlib import Path
p=Path(r"C:\Users\iris\Downloads\Catalyst\tools\research-probes\2026-09-13\patch_iconography.py")
s=p.read_text(encoding="utf-8")
s=s.replace("''tail += r'''", "'''\ntail += r'''")
p.write_text(s, encoding="utf-8")
print("fixed")