from pathlib import Path
import json, html, re
ROOT=Path(r"C:\Users\iris\Downloads\Catalyst")
OUT=ROOT/"public"/"generated"/"catalyst-svg-research"
STROKE='fill="none" stroke="currentColor" stroke-width="1.55" stroke-linecap="square" stroke-linejoin="miter"'
added=[]
def doc(title,body): return f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" {STROKE} role="img"><title>{html.escape(title)}</title><desc>Catalyst SVG research extension; experimental.</desc>{body}</svg>'
def put(cat,name,body):
    d=OUT/cat; d.mkdir(parents=True,exist_ok=True)
    p=d/f"{name}.svg"; p.write_text(doc(name.replace("-"," ").title(),body),encoding="utf-8")
    added.append({"category":cat,"name":name,"path":str(p.relative_to(ROOT)).replace('\\','/'),"body":body})
DOT='<circle cx="12" cy="12" r="1.8" fill="currentColor" stroke="none"/>'
techniques={
"key-assumptions-check": '<path d="M4 4h16v16H4zM8 8l4 4 4-4M8 16h8"/><circle cx="12" cy="12" r="2"/>',
"quality-of-information-check": '<path d="M5 3h10l4 4v14H5zM15 3v5h5M8 12h8M8 16h5"/><path d="M3 18l3 3 4-5"/>',
"indicators-signposts": '<path d="M4 20V4h11l5 5-5 5H4M8 9h8"/><circle cx="8" cy="9" r="1.5" fill="currentColor" stroke="none"/>',
"ach": '<path d="M3 6h5l4 6M3 12h9M3 18h5l4-6M12 12h9"/><path d="M15 6h6M15 18h6M16 9l4 6M20 9l-4 6"/>'+DOT,
"devils-advocacy": '<path d="M4 5h16v14H4zM7 9h10M7 15h10"/><path d="M9 7l6 10M15 7L9 17"/>',
"team-a-team-b": '<path d="M3 5h7v14H3zM14 5h7v14h-7zM10 12h4"/><path d="M6 9v6M18 9v6"/>',
"high-impact-low-probability": '<path d="M4 18h16M6 15l4-2 3-8 3 10 2-2"/><path d="M13 4v3"/>',
"what-if": '<path d="M4 12h8l4-4h4M12 12l4 4h4"/><path d="M3 7v10M20 6v4M20 14v4"/>'+DOT,
"brainstorming": '<path d="M12 3a7 7 0 0 1 5 12l-2 2v3H9v-3l-2-2A7 7 0 0 1 12 3zM9 22h6"/><path d="M4 4l2 2M20 4l-2 2M2 11h3M19 11h3"/>',
"outside-in-thinking": '<path d="M3 12c3-6 6-9 9-9s6 3 9 9c-3 6-6 9-9 9s-6-3-9-9z"/><circle cx="12" cy="12" r="4"/><path d="M12 3v5M12 16v5M3 12h5M16 12h5"/>',
"red-team-analysis": '<path d="M4 5h16v14H4zM7 12h10"/><path d="M8 8l4 4-4 4M16 8l-4 4 4 4"/>',
"alternative-futures": '<path d="M3 12h7l4-5h7M10 12l4 5h7"/><path d="M18 5h3v3M18 16h3v3"/>'+DOT,
"chronology": '<path d="M3 12h18M6 8v8M12 5v14M18 9v6"/><circle cx="12" cy="12" r="2"/>',
"link-analysis": '<circle cx="5" cy="6" r="2"/><circle cx="19" cy="6" r="2"/><circle cx="12" cy="18" r="2"/><path d="M7 7l4 9M17 7l-4 9M7 6h10"/>',
"scenario-matrix": '<path d="M4 4h16v16H4zM12 4v16M4 12h16"/><path d="M6 6l4 4M14 14l4 4M14 10l4-4M6 18l4-4"/>',
"premortem": '<path d="M4 5h16v14H4zM8 9h8M8 13h5"/><path d="M12 19v3M9 22h6"/><path d="M16 7l3 3"/>',
"weighted-ranking": '<path d="M5 5h14M5 10h11M5 15h8M5 20h5"/><path d="M20 4v17"/>',
"collection-plan": '<path d="M4 4h16v16H4zM7 8h10M7 12h10M7 16h6"/><path d="M3 8h2M3 12h2M3 16h2"/>'
}
for n,b in techniques.items(): put("techniques",n,b)
branches={
"root-right-2": '<path d="M3 12h6M9 12l5-5h7M9 12l5 5h7"/><rect x="2" y="10.5" width="3" height="3"/>',
"root-right-3": '<path d="M3 12h6M9 12l5-7h7M9 12h12M9 12l5 7h7"/><rect x="2" y="10.5" width="3" height="3"/>',
"root-left-2": '<path d="M21 12h-6M15 12l-5-5H3M15 12l-5 5H3"/><rect x="19" y="10.5" width="3" height="3"/>',
"root-left-3": '<path d="M21 12h-6M15 12l-5-7H3M15 12H3M15 12l-5 7H3"/><rect x="19" y="10.5" width="3" height="3"/>',
"fork-right-tight": '<path d="M3 12h7M10 12l4-3h7M10 12l4 3h7"/>',
"fork-right-wide": '<path d="M3 12h7M10 12l4-7h7M10 12l4 7h7"/>',
"fork-left-tight": '<path d="M21 12h-7M14 12l-4-3H3M14 12l-4 3H3"/>',
"fork-left-wide": '<path d="M21 12h-7M14 12l-4-7H3M14 12l-4 7H3"/>',
"elbow-down-right": '<path d="M4 5v7h8l5 5h4"/>',
"elbow-up-right": '<path d="M4 19v-7h8l5-5h4"/>',
"elbow-down-left": '<path d="M20 5v7h-8l-5 5H3"/>',
"elbow-up-left": '<path d="M20 19v-7h-8L7 7H3"/>',
"sibling-stack-right": '<path d="M4 4v16M4 7h7l4-3h5M4 12h11M4 17h7l4 3h5"/>',
"sibling-stack-left": '<path d="M20 4v16M20 7h-7L8 4H3M20 12H9M20 17h-7l-5 3H3"/>',
"continuation-right": '<path d="M3 12h14"/><path d="M17 12h4" stroke-dasharray="1 2"/><path d="M19 9l3 3-3 3"/>',
"continuation-left": '<path d="M21 12H7"/><path d="M7 12H3" stroke-dasharray="1 2"/><path d="M5 9l-3 3 3 3"/>',
"collapsed-children-right": '<path d="M3 12h10M13 12l4-5M13 12l4 5"/><path d="M19 5v4M19 15v4"/><circle cx="13" cy="12" r="1.7"/>',
"collapsed-children-left": '<path d="M21 12H11M11 12L7 7M11 12l-4 5"/><path d="M5 5v4M5 15v4"/><circle cx="11" cy="12" r="1.7"/>',
"crosslink-over-branch": '<path d="M3 12h7l4-5h7M10 12l4 5h7"/><path d="M7 5l10 14" stroke-dasharray="3 2"/>',
"free-occurrence": '<path d="M3 8V3h5M16 3h5v5M21 16v5h-5M8 21H3v-5"/><path d="M7 12h4M13 12h4" stroke-dasharray="2 2"/><rect x="10.5" y="10.5" width="3" height="3" transform="rotate(45 12 12)"/>'
}
for n,b in branches.items(): put("branch-grammar",n,b)

annotations={
"text": '<path d="M5 5h14M12 5v14M8 19h8"/>',
"freehand": '<path d="M3 16c4-8 5 2 8-4s4 6 10-4"/>',
"squiggly": '<path d="M4 16c2-3 4 3 6 0s4 3 6 0 4 3 4 0"/><path d="M4 9h16"/>',
"caret": '<path d="M6 16l6-8 6 8"/><path d="M12 8v12"/>',
"stamp": '<path d="M7 4h10v6l3 4v3H4v-3l3-4zM5 20h14"/>',
"shape-rectangle": '<rect x="4" y="5" width="16" height="14"/>',
"shape-ellipse": '<ellipse cx="12" cy="12" rx="9" ry="6"/>',
"shape-line": '<path d="M4 18L20 6M17 6h3v3"/>',
"area": '<path d="M4 5h16v14H4z" stroke-dasharray="2 2"/><path d="M7 8h10v8H7z"/>',
"redaction": '<path d="M4 7h16M4 12h16M4 17h16"/><path d="M3 9h18v6H3z" fill="currentColor" stroke="none"/>',
"image": '<rect x="4" y="5" width="16" height="14"/><circle cx="9" cy="10" r="2"/><path d="M6 17l4-4 3 3 3-5 3 6"/>',
"signature": '<path d="M4 16c2-8 4 7 7-3 2-7 1 7 5 1 2-3 3 1 4 2M4 20h16"/>',
"callout": '<path d="M4 5h16v11H9l-5 5v-5z"/><path d="M8 9h8M8 13h5"/>',
"ink-dot": '<circle cx="12" cy="12" r="3" fill="currentColor" stroke="none"/><path d="M12 3v4M12 17v4M3 12h4M17 12h4"/>',
"measurement": '<path d="M4 16L18 6M4 16l1-4M4 16l4-1M18 6l-1 4M18 6l-4 1"/><path d="M7 17h11"/>'
}
for n,b in annotations.items(): put("reader-annotations",n,b)
# A/B/C candidates for each core analytical glyph: compact, registered, indexed.
for src in sorted((OUT/"analytical").glob("*.svg")):
    text=src.read_text(encoding="utf-8")
    m=re.search(r'</desc>(.*)</svg>$',text)
    if not m: continue
    body=m.group(1); base=src.stem
    put("analytical-variants",f"{base}-compact",f'<g transform="translate(2.4 2.4) scale(.8)">{body}</g>')
    put("analytical-variants",f"{base}-registered",body+'<path d="M2 6V2h4M18 2h4v4M22 18v4h-4M6 22H2v-4"/>')
    put("analytical-variants",f"{base}-indexed",body+'<path d="M2 7V2h5M2 4h3M17 22h5v-5"/>')

instrument={
"new": '<path d="M4 12h7M11 12l4-4M11 12l4 4M18 5v6M15 8h6M18 14v5h-5"/>',
"child": '<path d="M5 4v16M5 10h7l4 4h4"/><rect x="18" y="12.5" width="3" height="3"/><path d="M12 5h7M17 3v4"/>',
"sibling": '<path d="M5 4v16M5 8h8M5 16h8"/><rect x="12" y="6.5" width="3" height="3"/><rect x="12" y="14.5" width="3" height="3"/><path d="M19 9v6M16 12h6"/>',
"delete": '<path d="M6 7h12l-1 13H7zM4 7h16M9 4h6M10 10v7M14 10v7"/>',
"settings": '<path d="M4 6h16M4 12h16M4 18h16"/><rect x="7" y="4.5" width="3" height="3"/><rect x="14" y="10.5" width="3" height="3"/><rect x="9" y="16.5" width="3" height="3"/>',
"back": '<path d="M20 6H9V3L3 9l6 6v-3h8M17 12v5"/>',
"forward": '<path d="M4 6h11V3l6 6-6 6v-3H7M7 12v5"/>',
"close": '<path d="M5 5l14 14M19 5L5 19"/>',
"commands": '<path d="M4 5h12M4 11h9M4 17h7M18 14v7M14.5 17.5h7"/><rect x="3" y="4" width="2" height="2"/><rect x="3" y="10" width="2" height="2"/><rect x="3" y="16" width="2" height="2"/>',
"home": '<path d="M4 13l8-8 8 8M6.5 11.5V20h11v-8.5"/><rect x="10.5" y="14" width="3" height="6"/>',
"open": '<path d="M4 5h7l3 3h6v11H4zM10 15h7M14 11l4 4-4 4"/>',
"inspect": '<path d="M4 5h11v11H4zM12 12l8 8M16 17l1-1M8 8h3M8 11h5"/>',
"copy": '<path d="M8 5h11v12H8zM5 8H3v13h12v-2M11 10h5M11 13h4"/>',
"tag": '<path d="M4 4h8l8 8-8 8-8-8z"/><circle cx="8" cy="8" r="1.5"/>',
"sort": '<path d="M5 6h10M5 12h7M5 18h4M18 5v14M15 16l3 3 3-3"/>',
"filter": '<path d="M4 5h16l-6 7v6l-4 2v-8z"/>',
"import": '<path d="M5 4h10l4 4v12H5zM15 4v5h5M12 10v7M9 14l3 3 3-3"/>',
"export": '<path d="M5 4h10l4 4v12H5zM15 4v5h5M12 17v-7M9 13l3-3 3 3"/>',
"menu": '<path d="M4 6h16M4 12h16M4 18h16"/>',
"more": '<circle cx="5" cy="12" r="1.5" fill="currentColor" stroke="none"/><circle cx="12" cy="12" r="1.5" fill="currentColor" stroke="none"/><circle cx="19" cy="12" r="1.5" fill="currentColor" stroke="none"/>',
"sidebar-left": '<rect x="3" y="4" width="18" height="16"/><path d="M8 4v16M5 8h1M5 12h1M5 16h1"/>',
"sidebar-right": '<rect x="3" y="4" width="18" height="16"/><path d="M16 4v16M18 8h1M18 12h1M18 16h1"/>',
"split-horizontal": '<rect x="3" y="4" width="18" height="16"/><path d="M3 12h18"/>',
"split-vertical": '<rect x="3" y="4" width="18" height="16"/><path d="M12 4v16"/>',
"maximize": '<path d="M4 9V4h5M15 4h5v5M20 15v5h-5M9 20H4v-5"/>',
"minimize": '<path d="M5 12h14"/>',
"refresh": '<path d="M6 7a8 8 0 0 1 13 3M19 5v5h-5M18 17a8 8 0 0 1-13-3M5 19v-5h5"/>',
"undo": '<path d="M9 6H4v5M4 11l5-5M5 12c2-4 6-6 10-4 3 1 5 4 5 8"/>',
"redo": '<path d="M15 6h5v5M20 11l-5-5M19 12c-2-4-6-6-10-4-3 1-5 4-5 8"/>',
"save": '<path d="M4 4h14l2 2v14H4zM7 4v6h9V4M8 14h8v6H8z"/>'
}
for n,b in instrument.items(): put("instrument",n,b)
from collections import defaultdict
by=defaultdict(list)
for a in added: by[a["category"]].append(a)
for cat,group in by.items():
    cols,cw,ch=4,190,58; rows=(len(group)+cols-1)//cols
    p=[f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {cols*cw} {rows*ch+42}" color="#18202a"><rect width="100%" height="100%" fill="#f7f8fa"/><text x="16" y="26" font-family="system-ui,sans-serif" font-size="16" font-weight="700" fill="#18202a">Catalyst SVG research — {html.escape(cat)}</text>']
    for i,a in enumerate(group):
        x=(i%cols)*cw; y=(i//cols)*ch+42
        p += [f'<rect x="{x+4}" y="{y+4}" width="{cw-8}" height="{ch-8}" rx="2" fill="#fff" stroke="#d9dee5"/>', f'<g transform="translate({x+16} {y+12}) scale(1.35)" {STROKE}>{a["body"]}</g>', f'<text x="{x+58}" y="{y+31}" font-family="ui-monospace,monospace" font-size="11" fill="#27313d">{html.escape(a["name"])}</text>']
    p.append('</svg>'); (OUT/f"contact-sheet-{cat}.svg").write_text(''.join(p),encoding="utf-8")

(OUT/"manifest-extension.json").write_text(json.dumps({"status":"research-only","count":len(added),"assets":[{k:v for k,v in a.items() if k!='body'} for a in added]},indent=2),encoding="utf-8")
all_files=[]
for d in sorted(p for p in OUT.iterdir() if p.is_dir()):
    for f in sorted(d.glob("*.svg")): all_files.append((d.name,f.stem,f))
all_manifest=[{"category":c,"name":n,"path":str(f.relative_to(ROOT)).replace('\\','/')} for c,n,f in all_files]
(OUT/"manifest-all.json").write_text(json.dumps({"status":"research-only","count":len(all_manifest),"assets":all_manifest},indent=2),encoding="utf-8")
cards=''.join(f'<article><img src="{c}/{n}.svg" alt=""><code>{c}/{n}</code></article>' for c,n,_ in all_files)
gallery=f'''<!doctype html><meta charset="utf-8"><title>Catalyst SVG Research</title><style>body{{margin:24px;background:#eef1f4;color:#18202a;font:14px system-ui}}h1{{font-size:22px}}.grid{{display:grid;grid-template-columns:repeat(auto-fill,minmax(210px,1fr));gap:8px}}article{{display:flex;align-items:center;gap:14px;background:white;border:1px solid #d7dde4;padding:12px;min-height:48px}}img{{width:32px;height:32px}}code{{font-size:11px;overflow-wrap:anywhere}}</style><h1>Catalyst SVG research — {len(all_files)} assets</h1><p>Experimental, unwired candidates for visual-language research.</p><div class="grid">{cards}</div>'''
(OUT/"gallery-all.html").write_text(gallery,encoding="utf-8")
print(f"Added {len(added)} extension SVGs; total individual assets now {len(all_files)}")
