from pathlib import Path
p=Path(r'C:\Users\iris\Downloads\Catalyst\scripts\test-visual-language.mjs')
s=p.read_text(encoding='utf-8')
needle='''assert.match(inspector, /EvidenceTraceMark/, "inspector source items should reuse provenance notation");\n'''
addition='''assert.match(inspector, /EvidenceTraceMark/, "inspector source items should reuse provenance notation");\nassert.match(inspector, /<AnalyticalGlyph kind=\{identityGlyph\}/, "inspector identity should reuse the same analytical glyph vocabulary as the Working Picture");\nassert.match(picture, /name="reorder-before"/, "structural reorder-before needs a dedicated landmark rather than a navigation arrow");\nassert.match(picture, /name="reorder-after"/, "structural reorder-after needs a dedicated landmark rather than a navigation arrow");\n'''
if needle not in s: raise SystemExit('visual-language insertion point missing')
s=s.replace(needle,addition,1)
needle2='''assert.match(symbols, /\\| "home"[\\s\\S]*\\| "open"[\\s\\S]*\\| "inspect"/, "instrument family should cover Working Picture navigation primitives");\n'''
addition2='''assert.match(symbols, /\\| "home"[\\s\\S]*\\| "open"[\\s\\S]*\\| "inspect"/, "instrument family should cover Working Picture navigation primitives");\nassert.match(symbols, /\\| "reorder-before"[\\s\\S]*\\| "reorder-after"/, "instrument family should distinguish structural reorder from navigation");\n'''
if needle2 not in s: raise SystemExit('symbol insertion point missing')
s=s.replace(needle2,addition2,1)
p.write_text(s,encoding='utf-8')
print('visual-language contract patched')