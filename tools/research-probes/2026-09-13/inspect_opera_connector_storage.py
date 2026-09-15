import re
from pathlib import Path
p = Path(r"C:\Users\iris\AppData\Roaming\Opera Software\Opera Stable\Default\Extensions\fnjbijbhcehgoglobkicibfpcmddlggg\5.1.0_0\assets\storage-keys-wGR7lDcO.js")
s = p.read_text(encoding="utf-8", errors="ignore")
strings = set(re.findall(r'["\']([^"\']{1,160})["\']', s))
needles = ("connect", "allow", "ai", "enabled", "permission", "storage")
for value in sorted(strings):
    if any(k in value.lower() for k in needles):
        print(value)
