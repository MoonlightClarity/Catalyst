from pathlib import Path
p=Path(r'C:\Users\iris\Downloads\Catalyst\tools\research-probes\2026-09-13\patch_sibling_order_v2.py')
s=p.read_text()
count=s.count("''')rep(")
s=s.replace("''')rep(", "''')\n\nrep(")
p.write_text(s)
print('repaired', count)