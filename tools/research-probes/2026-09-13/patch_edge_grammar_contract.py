from pathlib import Path
p=Path(r'C:\Users\iris\Downloads\Catalyst\scripts\test-visual-language.mjs')
s=p.read_text(encoding='utf-8')
anchor='assert.match(styles, /\\.picture-semantic-relation[\\s\\S]{0,300}stroke-dasharray/i, "semantic links must remain distinguishable without color");'
addition='''\nassert.doesNotMatch(styles, /\\.picture-branch\\.territory-(?:open|periphery)\\s*\\{[^}]*stroke-dasharray/is, "structural branch territory must not borrow semantic-link dash patterns");\nassert.match(styles, /\\.picture-semantic-relation\\.relationship-precedes\\s*\\{[^}]*stroke-dasharray:\\s*(?!none)/i, "even precedes relations must keep a non-solid semantic edge pattern");'''
if anchor not in s:
    raise SystemExit('visual language anchor missing')
p.write_text(s.replace(anchor,anchor+addition,1),encoding='utf-8')
print('edge grammar contract patched')