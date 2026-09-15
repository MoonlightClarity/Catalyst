from pathlib import Path
import json, html
ROOT=Path(r"C:\Users\iris\Downloads\Catalyst")
OUT=ROOT/"public"/"generated"/"catalyst-svg-research"
STROKE='fill="none" stroke="currentColor" stroke-width="1.55" stroke-linecap="square" stroke-linejoin="miter"'
added=[]
def doc(title,body): return f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" {STROKE} role="img"><title>{html.escape(title)}</title><desc>Optional Catalyst research glyph; experimental.</desc>{body}</svg>'
def put(cat,name,body):
 d=OUT/cat; d.mkdir(parents=True,exist_ok=True); p=d/f"{name}.svg"; p.write_text(doc(name.replace("-"," ").title(),body),encoding="utf-8"); added.append({"category":cat,"name":name,"path":str(p.relative_to(ROOT)).replace('\\','/'),"body":body})
DOT='<circle cx="12" cy="12" r="1.8" fill="currentColor" stroke="none"/>'
world={
"person": '<circle cx="12" cy="7" r="3"/><path d="M5 21c1-6 3-9 7-9s6 3 7 9"/>',
"organization": '<path d="M4 20h16M6 20V9h12v11M4 9h16L12 3zM9 12v5M12 12v5M15 12v5"/>',
"place": '<path d="M12 21s7-6 7-12a7 7 0 0 0-14 0c0 6 7 12 7 12z"/><circle cx="12" cy="9" r="2"/>',
"facility": '<path d="M4 20V8h7v12M11 12h9v8M7 11h1M7 14h1M7 17h1M14 15h3"/>',
"vehicle": '<path d="M5 15h14l-2-6H7zM4 15v4h16v-4"/><circle cx="8" cy="19" r="1.5"/><circle cx="16" cy="19" r="1.5"/>',
"artifact": '<path d="M6 3h9l4 4v14H6zM15 3v5h5M9 12h7M9 16h5"/>',
"device": '<rect x="6" y="3" width="12" height="18" rx="1"/><path d="M9 6h6M10 18h4"/>',
"software": '<path d="M4 5h16v14H4zM7 9l3 3-3 3M12 15h5"/>',
"network": '<circle cx="5" cy="6" r="2"/><circle cx="19" cy="6" r="2"/><circle cx="12" cy="18" r="2"/><path d="M7 7l4 9M17 7l-4 9M7 6h10"/>',
"communication": '<path d="M4 5h16v11H9l-5 5v-5zM8 9h8M8 13h6"/>',
"account": '<circle cx="9" cy="9" r="3"/><path d="M4 19c1-4 2-6 5-6s4 2 5 6M16 8h5M16 12h5M16 16h5"/>',
"group": '<circle cx="8" cy="8" r="2.5"/><circle cx="16" cy="8" r="2.5"/><path d="M3 20c1-5 2-8 5-8s4 3 5 8M11 20c1-5 2-8 5-8s4 3 5 8"/>',
"system": '<rect x="4" y="4" width="16" height="16"/><rect x="8" y="8" width="8" height="8"/><path d="M12 4v4M12 16v4M4 12h4M16 12h4"/>',
"process": '<path d="M4 8h6l2 4-2 4H4zM14 8h6v8h-6"/><path d="M10 12h4"/>',
"decision": '<path d="M12 3l8 9-8 9-8-9zM8 12h8M12 8v8"/>',
"action": '<path d="M4 12h12M12 7l5 5-5 5M18 5v14"/>',
"resource": '<path d="M4 6h16v12H4zM7 9h10M7 12h10M7 15h6"/>',
"capability": '<path d="M4 18h16M6 18V9M12 18V5M18 18v-7"/><path d="M4 5l4 4 4-4 4 4 4-4"/>',
"constraint": '<path d="M5 4v16M19 4v16M8 8h8M8 16h8"/><path d="M10 6l-2 2 2 2M14 14l2 2-2 2"/>',
"infrastructure": '<path d="M3 19h18M5 19l3-10 4 10 4-14 3 14M6 13h12"/>',
"financial": '<circle cx="12" cy="12" r="8"/><path d="M15 8h-5a2 2 0 0 0 0 4h4a2 2 0 0 1 0 4H9M12 6v12"/>',
"jurisdiction": '<path d="M4 5l8-2 8 2v7c0 5-3 8-8 10-5-2-8-5-8-10zM8 10h8M12 7v7"/>',
"incident": '<path d="M12 3l3 6 6 3-6 3-3 6-3-6-6-3 6-3z"/><circle cx="12" cy="12" r="2"/>',
"object": '<path d="M5 7l7-4 7 4v10l-7 4-7-4zM5 7l7 4 7-4M12 11v10"/>'
}
for n,b in world.items(): put("world-optional",n,b)
prov={
"artifact": '<path d="M5 3h10l4 4v14H5zM15 3v5h5M8 12h8M8 16h5"/>',
"artifact-version": '<path d="M5 3h10l4 4v14H5zM15 3v5h5"/><path d="M8 13h7M8 17h4M3 7h4"/><circle cx="4" cy="7" r="1.5"/>',
"origin": '<circle cx="5" cy="12" r="2" fill="currentColor" stroke="none"/><path d="M7 12h13M16 8l4 4-4 4"/>',
"agent": '<circle cx="9" cy="7" r="3"/><path d="M3 19c1-5 3-8 6-8s5 3 6 8M17 7h4M17 11h4M17 15h4"/>',
"transformation": '<path d="M4 7h8l4 5-4 5H4zM16 7h4v10h-4"/><path d="M12 12h4"/>',
"fixity": '<path d="M4 4h16v16H4zM7 8h10M7 12h10M7 16h6"/><path d="M15 18l2 2 4-5"/>',
"hash": '<path d="M8 4L6 20M16 4l-2 16M4 9h16M3 15h16"/>',
"anchor": '<path d="M12 3v13M7 8h10M6 16c1 4 3 5 6 5s5-1 6-5M6 16h4M18 16h-4"/><circle cx="12" cy="5" r="2"/>',
"excerpt": '<path d="M4 5h16v14H4zM7 9h10M7 13h8M7 17h6"/><path d="M3 11v6"/>',
"crop": '<path d="M7 3v14h14M3 7h14v14"/><path d="M10 10h7v7h-7z" stroke-dasharray="2 1"/>',
"page-region": '<path d="M5 3h10l4 4v14H5zM15 3v5h5"/><rect x="8" y="11" width="8" height="5"/>',
"text-range": '<path d="M4 7h16M4 12h16M4 17h16"/><path d="M8 10v4M16 10v4"/>',
"image-region": '<rect x="4" y="5" width="16" height="14"/><path d="M7 16l4-4 3 3 3-5 2 6"/><rect x="8" y="8" width="6" height="6" stroke-dasharray="2 1"/>',
"table-cell": '<path d="M4 4h16v16H4zM4 10h16M10 4v16"/><rect x="11.5" y="11.5" width="7" height="7"/>',
"derived": '<path d="M4 5h7v7H4zM13 12h7v7h-7zM10 9l4 4"/><path d="M11 13l3-1-1-3"/>',
"translated": '<path d="M4 4h7v16H4zM13 4h7v16h-7zM7 8h2M15 8h3M7 12h2M15 12h3"/><path d="M10 16h4"/>',
"summarized": '<path d="M4 4h7v16H4zM13 7h7v10h-7zM6 8h3M6 12h3M6 16h3M15 11h3M15 14h2"/>',
"quoted": '<path d="M4 5h16v14H4zM7 9h3v5H7zM13 9h3v5h-3z"/>',
"ocr": '<path d="M3 8V3h5M16 3h5v5M21 16v5h-5M8 21H3v-5"/><path d="M7 12h10M9 9v6M15 9v6"/>',
"imported": '<path d="M5 3h10l4 4v14H5zM15 3v5h5M12 9v8M9 14l3 3 3-3"/>',
"local-file": '<path d="M4 5h6l2 2h8v12H4zM7 11h10M7 15h7"/>',
"url": '<path d="M8 8l-2 2a4 4 0 0 0 6 6l2-2M16 16l2-2a4 4 0 0 0-6-6l-2 2"/><path d="M9 15l6-6"/>',
"pdf": '<path d="M5 3h10l4 4v14H5zM15 3v5h5M8 12h8M8 16h8"/><path d="M8 19h2M12 19h2M16 19h1"/>',
"image": '<rect x="4" y="5" width="16" height="14"/><circle cx="9" cy="10" r="2"/><path d="M6 17l4-4 3 3 3-5 3 6"/>',
"csv": '<path d="M5 3h10l4 4v14H5zM15 3v5h5M8 11h8M8 15h8M11 9v8M15 9v8"/>',
"json": '<path d="M8 4H5v6l-2 2 2 2v6h3M16 4h3v6l2 2-2 2v6h-3"/><circle cx="12" cy="9" r="1" fill="currentColor" stroke="none"/><circle cx="12" cy="15" r="1" fill="currentColor" stroke="none"/>',
"email": '<path d="M3 6h18v12H3zM3 7l9 7 9-7"/>',
"message": '<path d="M4 5h16v11H9l-5 5v-5zM8 9h8M8 13h5"/>',
"archive": '<path d="M4 7h16v13H4zM3 4h18v4H3zM9 11h6"/>',
"snapshot": '<path d="M4 7h4l2-3h4l2 3h4v13H4z"/><circle cx="12" cy="13" r="4"/>'
}
for n,b in prov.items(): put("source-provenance",n,b)
epistemic={
"question": '<path d="M7 8c1-4 3-6 6-6 5 0 8 3 8 7 0 5-6 5-6 9M15 22h.1"/><path d="M7 8H3v8h4"/>',
"gap": '<path d="M3 12h6M15 12h6M9 8v8M15 8v8"/><path d="M10.5 12h3" stroke-dasharray="1 2"/>',
"indicator": '<path d="M4 19V5h11l5 5-5 5H4M8 10h8"/>',
"signpost": '<path d="M6 21V4M6 7h12l-3 4H6M6 13h10l-3 4H6"/>',
"trigger": '<path d="M4 4v16M4 12h8l4-5v10l-4-5M18 7v10"/>'+DOT,
"expected-observation": '<path d="M3 12c3-4 6-6 9-6s6 2 9 6c-3 4-6 6-9 6s-6-2-9-6z"/><path d="M9 12l2 2 4-5"/>',
"missing-observation": '<path d="M3 12c3-4 6-6 9-6s6 2 9 6c-3 4-6 6-9 6s-6-2-9-6z" stroke-dasharray="2 2"/><path d="M8 8l8 8"/>',
"contrary-evidence": '<path d="M5 5h14v14H5zM8 9h8M8 13h8"/><path d="M7 17l10-10"/>',
"critical-assumption": '<path d="M5 4H3v16h2M19 4h2v16h-2"/><path d="M12 6l6 6-6 6-6-6zM12 9v4M12 16h.1"/>',
"weak-assumption": '<path d="M5 4H3v16h2M19 4h2v16h-2"/><path d="M12 7l5 5-5 5-5-5z" stroke-dasharray="2 2"/>',
"unknown-origin": '<circle cx="5" cy="12" r="2"/><path d="M7 12h13" stroke-dasharray="2 2"/><path d="M16 8l4 4-4 4M3 5h4M5 3v4"/>',
"stale-source": '<path d="M5 3h10l4 4v14H5zM15 3v5h5"/><circle cx="12" cy="14" r="4"/><path d="M12 11v3l2 1"/>',
"superseded-source": '<path d="M4 4h8v14H4zM12 7h8v14h-8zM8 11h8"/><path d="M13 8l3 3-3 3"/>',
"retracted-source": '<path d="M5 3h10l4 4v14H5zM15 3v5h5M7 8l10 10M17 8L7 18"/>',
"authenticity-question": '<path d="M5 3h10l4 4v14H5zM15 3v5h5"/><path d="M9 11c1-2 2-3 4-3 3 0 4 2 4 4 0 2-3 2-3 5M14 19h.1"/>',
"integrity-verified": '<path d="M5 3h10l4 4v14H5zM15 3v5h5M8 15l3 3 5-7"/>',
"independence-known": '<circle cx="7" cy="12" r="3"/><circle cx="17" cy="12" r="3"/><path d="M10 12h4"/>',
"independence-unknown": '<circle cx="7" cy="12" r="3"/><circle cx="17" cy="12" r="3"/><path d="M10 12h4" stroke-dasharray="1 2"/>',
"deception-risk": '<path d="M3 12c3-5 6-7 9-7s6 2 9 7c-3 5-6 7-9 7s-6-2-9-7zM8 8l8 8M16 8l-8 8"/>',
"dissent": '<path d="M3 7h7l4 5M3 17h7l4-5M14 12h7"/><path d="M6 9l-3 3 3 3M18 9l3 3-3 3"/>',
"review-needed": '<path d="M12 3l9 17H3zM12 8v6M12 17h.1"/>',
"warning": '<path d="M4 20h16M12 3l7 14H5zM12 8v5M12 15h.1"/>',
"weak-signal": '<path d="M4 18h3l2-3 2 2 3-7 2 5 2-2h2M4 21h16"/><circle cx="14" cy="10" r="1.5"/>',
"baseline-deviation": '<path d="M3 17h18M4 12h5l2-2 2 5 3-9 2 6h2"/><path d="M4 8h16" stroke-dasharray="2 2"/>'
}
for n,b in epistemic.items(): put("epistemic",n,b)
editing={
"add-child": '<path d="M4 4v16M4 10h7l4 4h5"/><rect x="18" y="12.5" width="3" height="3"/><path d="M14 5h7M18 2v7"/>',
"add-sibling": '<path d="M4 4v16M4 8h8M4 16h8"/><rect x="11" y="6.5" width="3" height="3"/><path d="M17 12h5M19.5 9.5v5"/>',
"move-before": '<path d="M4 6h10M4 12h10M4 18h10M19 19V5M16 8l3-3 3 3"/>',
"move-after": '<path d="M4 6h10M4 12h10M4 18h10M19 5v14M16 16l3 3 3-3"/>',
"promote": '<path d="M4 4v16M4 8h7l4 4h6M15 18H8M8 18l3-3M8 18l3 3"/>',
"demote": '<path d="M4 4v16M4 8h7l4 4h6M8 18h7M15 18l-3-3M15 18l-3 3"/>',
"side-left": '<path d="M14 4v16M14 8H8l-4 4 4 4h6M19 12h3M19 9l-3 3 3 3"/>',
"side-right": '<path d="M10 4v16M10 8h6l4 4-4 4h-6M5 12H2M5 9l3 3-3 3"/>',
"free-occurrence": '<path d="M3 8V3h5M16 3h5v5M21 16v5h-5M8 21H3v-5"/><rect x="8" y="8" width="3" height="3" transform="rotate(45 9.5 9.5)"/><rect x="14" y="14" width="3" height="3" transform="rotate(45 15.5 15.5)"/>',
"snap": '<path d="M4 4v16M20 4v16M8 12h8" stroke-dasharray="2 2"/><path d="M10 9l-3 3 3 3M14 9l3 3-3 3"/>',
"align-left": '<path d="M5 3v18M8 6h10v4H8zM8 14h7v4H8z"/>',
"align-center": '<path d="M12 3v18M6 6h12v4H6zM8 14h8v4H8z"/>',
"align-right": '<path d="M19 3v18M7 6h12v4H7zM10 14h9v4h-9z"/>',
"distribute-vertical": '<rect x="6" y="3" width="12" height="4"/><rect x="6" y="10" width="12" height="4"/><rect x="6" y="17" width="12" height="4"/><path d="M3 5h2M3 12h2M3 19h2"/>',
"distribute-horizontal": '<rect x="3" y="6" width="4" height="12"/><rect x="10" y="6" width="4" height="12"/><rect x="17" y="6" width="4" height="12"/><path d="M5 3v2M12 3v2M19 3v2"/>',
"group": '<path d="M4 8V4h4M16 4h4v4M20 16v4h-4M8 20H4v-4"/><rect x="7" y="8" width="4" height="4"/><rect x="13" y="12" width="4" height="4"/>',
"ungroup": '<path d="M4 8V4h4M16 4h4v4M20 16v4h-4M8 20H4v-4" stroke-dasharray="2 2"/><path d="M7 8h4v4H7zM13 12h4v4h-4zM4 12h3M17 12h3"/>',
"collapse": '<path d="M4 4v16M4 8h6l4-4h5M4 16h6l4 4h5M9 12h11M16 9l-3 3 3 3"/>',
"expand": '<path d="M4 4v16M4 8h6l4-4h5M4 16h6l4 4h5M9 12h11M14 9l3 3-3 3"/>',
"focus-subtree": '<path d="M3 8V3h5M16 3h5v5M21 16v5h-5M8 21H3v-5"/><path d="M5 12h5l4-4h5M10 12l4 4h5"/>',
"hoist": '<path d="M4 19h16M12 19V6M8 10l4-4 4 4M6 22h12"/>',
"fit": '<path d="M4 9V4h5M15 4h5v5M20 15v5h-5M9 20H4v-5M8 12h8M12 8v8"/>',
"auto-layout": '<path d="M4 12h5l4-5h7M9 12l4 5h7M18 4h3v3M21 4l-4 4M6 20H3v-3M3 20l4-4"/>',
"manual-layout": '<path d="M4 5h5v5H4zM15 5h5v5h-5zM9 15h5v5H9z"/><path d="M9 8h6M12 10v5" stroke-dasharray="2 2"/>',
"connect": '<path d="M4 6v5h5M20 18v-5h-5M8.5 10.5l7 3M13 13.5l2.5.1-.9-2.3"/>',
"disconnect": '<path d="M4 6v5h5M20 18v-5h-5M8.5 10.5l7 3M7 19L18 5"/>',
"convert-relation": '<path d="M4 7h16M4 17h16M8 4l-4 3 4 3M16 14l4 3-4 3"/><path d="M12 9v6"/>',
"duplicate-occurrence": '<rect x="7" y="5" width="11" height="11"/><path d="M4 8H3v13h13v-2M11 10h4M13 8v4"/>',
"remove-occurrence": '<rect x="5" y="5" width="14" height="14"/><path d="M8 12h8"/>',
"detach-structure": '<path d="M4 5v14M4 12h8l4-4h4M16 16h4"/><path d="M10 8l6 8M16 8l-6 8"/>'
}
for n,b in editing.items(): put("map-editing",n,b)
