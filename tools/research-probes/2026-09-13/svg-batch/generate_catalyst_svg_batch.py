from pathlib import Path
import json, html

ROOT = Path(r"C:\Users\iris\Downloads\Catalyst")
OUT = ROOT / "public" / "generated" / "catalyst-svg-research"
OUT.mkdir(parents=True, exist_ok=True)
STROKE = 'fill="none" stroke="currentColor" stroke-width="1.55" stroke-linecap="square" stroke-linejoin="miter"'
assets = []

def svg_doc(title, body, view="0 0 24 24"):
    safe = html.escape(title)
    return f'''<svg xmlns="http://www.w3.org/2000/svg" viewBox="{view}" {STROKE} role="img" aria-labelledby="title"><title id="title">{safe}</title><desc>Catalyst research glyph; experimental and not normative.</desc>{body}</svg>'''

def put(category, name, body):
    folder = OUT / category
    folder.mkdir(exist_ok=True)
    path = folder / f"{name}.svg"
    path.write_text(svg_doc(name.replace('-', ' ').title(), body), encoding="utf-8")
    assets.append({"category": category, "name": name, "path": str(path.relative_to(ROOT)).replace('\\','/'), "body": body})

DOT = '<circle cx="12" cy="12" r="1.8" fill="currentColor" stroke="none"/>'
DIAMOND = '<path d="M12 7l5 5-5 5-5-5z"/>'
SQUARE = '<rect x="8" y="8" width="8" height="8"/>'
OPEN = '<path d="M8 8h8v8h-8"/>'
analytical = {
"thought": '<path d="M5 7h10l4 5-4 5H5"/><path d="M5 9H3v6h2M9 12h5l3-3M14 12l3 3h3"/>'+DOT,
"claim": '<path d="M12 3l8 9-8 9-8-9z"/><path d="M7 12h10M12 7v10"/>'+DOT,
"assumption": '<path d="M5 4H3v16h2M19 4h2v16h-2"/>'+DIAMOND+DOT,
"hypothesis": '<path d="M3 12h5l4-4 4 4-4 4zM16 12h2l3-5M18 12l3 5"/>'+DOT,
"question": '<path d="M6 8c1-4 4-6 7-6 5 0 8 3 8 7 0 5-6 5-6 9M15 22h.1"/><path d="M6 8H3v8h3"/>',
"gap": '<path d="M3 12h6M15 12h6"/><path d="M9 8v8M15 8v8"/><path d="M10.5 12h3" stroke-dasharray="1.5 2"/>',
"entity": '<rect x="5" y="5" width="14" height="14"/><path d="M5 9H2M5 15H2M19 9h3M19 15h3M12 5V2M12 19v3"/><rect x="9" y="9" width="6" height="6" fill="currentColor" stroke="none"/>',
"event": '<path d="M3 12h18M12 3v18M6 9v6M18 9v6M9 6h6M9 18h6"/>'+DIAMOND+DOT,
"source": '<path d="M6 3h9l4 4v14H6zM15 3v5h5M9 11h7M9 15h6"/><path d="M3 8v9"/>'+DOT,
"evidence": '<path d="M5 5h12v14H5zM8 9h6M8 13h8M19 5v14M19 10h3"/><circle cx="21" cy="10" r="1.5" fill="currentColor" stroke="none"/>',
"observation": '<path d="M4 12h5l3-4 3 8 2-4h3"/><path d="M4 6v12M20 6v12"/>'+DOT,
"interpretation": '<path d="M4 7h6l3 5-3 5H4zM14 7h6v10h-6"/><path d="M10 12h4"/>'+DOT,
"judgment": '<path d="M4 5h16v14H4zM7 12h4l2-3 4 6"/>'+DOT,
"indicator": '<path d="M4 18V6h11l5 6-5 6z"/><path d="M8 12h7"/><circle cx="8" cy="12" r="1.6" fill="currentColor" stroke="none"/>',
"trigger": '<path d="M4 4v16M4 12h8l4-5v10l-4-5M18 7v10"/>'+DOT,
"baseline": '<path d="M3 16h18M5 11h3M10 11h4M16 11h3"/><path d="M5 7h14" stroke-dasharray="2 2"/>',
"anomaly": '<path d="M3 16h18M4 12h4l2-2 2 4 3-9 2 7h3"/><path d="M15 3v3"/>',
"weak-signal": '<path d="M4 17h3l2-3 2 2 3-7 2 5 2-2h2"/><path d="M4 20h16"/><circle cx="14" cy="9" r="1.5"/>',
"warning": '<path d="M12 3l9 17H3zM12 8v6M12 17h.1"/><path d="M5 20h14"/>',
"revision": '<path d="M5 6h9l4 4-4 4H8M8 14l-3 3 3 3"/><path d="M18 10V5"/>'+DOT,
"inference": '<path d="M3 6h6l3 6M3 12h9M3 18h6l3-6M12 12h9"/>'+DOT,
"alternative": '<path d="M3 12h7l3-4 3 4-3 4zM16 12h5M16 12l5-6M16 12l5 6"/>'+DOT,
"unknown": '<path d="M5 5h14v14H5z" stroke-dasharray="2 2"/><path d="M9 9c1-2 2-3 4-3 3 0 5 2 5 4 0 3-4 3-4 6M14 19h.1"/>',
"aggregate": '<path d="M5 7h10v10H5zM8 4h10v10M8 20h10V10"/><path d="M2 12h3M18 12h4"/>'
}
for n,b in analytical.items(): put("analytical", n, b)
def terminal(kind, x, direction=1):
    if kind == "arrow": return f'<path d="M{x-3*direction} 8l{3*direction} 4-3 {4*direction}"/>' if direction==1 else f'<path d="M{x+3} 8l-3 4 3 4"/>'
    if kind == "bar": return f'<path d="M{x} 8v8"/>'
    if kind == "circle": return f'<circle cx="{x}" cy="12" r="2"/>'
    if kind == "dot": return f'<circle cx="{x}" cy="12" r="2" fill="currentColor" stroke="none"/>'
    if kind == "diamond": return f'<path d="M{x} 9l3 3-3 3-3-3z"/>'
    if kind == "square": return f'<rect x="{x-2}" y="10" width="4" height="4"/>'
    if kind == "open": return f'<path d="M{x-2} 10h4v4"/>'
    return ""

def edge_body(start="none", end="arrow", mid="", dash="", double=False):
    line = '<path d="M4 12h16"' + (f' stroke-dasharray="{dash}"' if dash else '') + '/>'
    if double: line += '<path d="M4 9h16"/>'
    return line + terminal(start,4,-1) + terminal(end,20,1) + mid

relations = {
"supports": edge_body("dot","arrow",'<path d="M10 9l2 3 2-3"/>'),
"contradicts": edge_body("dot","bar",'<path d="M10 9l4 6M14 9l-4 6"/>'),
"depends-on": edge_body("open","diamond",'<path d="M10 9h4v6h-4"/>'),
"assumes": edge_body("square","arrow",'<path d="M10 8v8M14 8v8"/>'),
"bears-on": edge_body("circle","open",'<path d="M10 10l4 4M14 10l-4 4"/>'),
"derived-from": edge_body("diamond","arrow",'<path d="M9 9l6 6"/>',"3 2"),
"extracted-from": edge_body("square","arrow",'<path d="M9 8v8M12 8v8M15 8v8"/>'),
"quotes": edge_body("open","arrow",'<path d="M9 9h2v4H9zM13 9h2v4h-2z"/>'),
"summarizes": edge_body("square","arrow",'<path d="M9 9h6M10 12h4M11 15h2"/>'),
"translates": edge_body("square","arrow",'<path d="M9 9h6M12 7v10"/>',"2 1"),
"precedes": edge_body("circle","arrow",'<path d="M10 8v8M14 8v8"/>'),
"causes": edge_body("dot","arrow",'<path d="M10 8l4 4-4 4"/>'),
"enables": edge_body("open","arrow",'<path d="M10 9v6M14 9v6M10 12h4"/>'),
"inhibits": edge_body("dot","bar",'<path d="M10 8v8M14 8v8"/>'),
"owns": edge_body("diamond","square",'<path d="M10 12h4"/>'),
"works-for": edge_body("circle","square",'<path d="M10 9h4v6h-4z"/>'),
"located-at": edge_body("circle","diamond",'<path d="M10 12a2 2 0 1 0 4 0a2 2 0 1 0-4 0"/>'),
"associated-with": edge_body("circle","circle",'<path d="M10 9l4 6M14 9l-4 6"/>'),
"same-as": edge_body("arrow","arrow",'<path d="M10 10h4M10 14h4"/>'),
"supersedes": edge_body("square","arrow",'<path d="M9 9h6v6H9z"/>',"4 1"),
"revises": edge_body("open","arrow",'<path d="M10 8h4l2 4-2 4h-4"/>'),
"corroborates": edge_body("dot","dot",'<path d="M10 9l2 3 2-3M10 15l2-3 2 3"/>'),
"disputes": edge_body("dot","bar",'<path d="M9 9l6 6M15 9l-6 6"/>',"2 1"),
"unknown-relation": edge_body("open","open",'<path d="M11 9c0-2 3-2 3 0 0 2-2 2-2 4M12 15h.1"/>',"1 2"),
"bidirectional": edge_body("arrow","arrow",'<circle cx="12" cy="12" r="1.5"/>'),
"provenance": edge_body("square","arrow",'<path d="M10 8h4v8h-4"/>',"4 2"),
"structural": edge_body("none","none",'<path d="M8 12l4-4 4 4"/>'),
"hidden-crosslink": edge_body("open","arrow",'<path d="M10 12h4" stroke-dasharray="1 1"/>',"1 3")
}
for n,b in relations.items(): put("relationships", n, b)
operations = {
"trace": '<path d="M3 4v16M3 12h7l4-4h7M14 16h7"/><rect x="9" y="10.8" width="2.4" height="2.4" transform="rotate(45 10.2 12)"/><path d="M18 6l3 2-3 2M18 14l3 2-3 2"/>',
"probe": '<path d="M4 12h8l4-4h4M12 12l4 4h4"/><path d="M18 6h3v3M18 15h3v3"/>'+DOT,
"watch": '<path d="M3 12c3-5 6-7 9-7s6 2 9 7c-3 5-6 7-9 7s-6-2-9-7z"/><path d="M12 8v4l3 2"/><circle cx="12" cy="12" r="2"/>',
"scan": '<path d="M4 18a14 14 0 0 1 14-14M7 18A11 11 0 0 1 18 7M10 18a8 8 0 0 1 8-8"/><path d="M18 18h.1"/><circle cx="18" cy="18" r="2" fill="currentColor" stroke="none"/>',
"junction": '<path d="M3 5h5l4 7M3 12h9M3 19h5l4-7M12 12h9"/>'+DOT,
"divergence": '<path d="M3 12h7l4-5h7M10 12l4 5h7"/><path d="M19 5h2v4M19 15h2v4"/>'+DOT,
"reconciliation": '<path d="M3 7h6l5 5M3 17h6l5-5M14 12h7"/><path d="M18 9l3 3-3 3"/>'+DOT,
"transform": '<path d="M4 6h10l4 4-4 4H8M8 14l-4 4 4 4"/><path d="M18 10V5"/>'+DOT,
"compare": '<rect x="3" y="5" width="7" height="14"/><rect x="14" y="5" width="7" height="14"/><path d="M10 9h4M10 15h4"/>',
"focus": '<path d="M3 8V3h5M16 3h5v5M21 16v5h-5M8 21H3v-5"/>'+DIAMOND,
"collapse": '<path d="M4 4v16M4 8h6l4-4h5M4 16h6l4 4h5M9 12h11"/><path d="M16 9l-3 3 3 3"/>',
"expand": '<path d="M4 4v16M4 8h6l4-4h5M4 16h6l4 4h5M9 12h11"/><path d="M14 9l3 3-3 3"/>',
"branch-left": '<path d="M14 3v18M14 8H8l-4 4 4 4h6"/><rect x="3" y="10.5" width="3" height="3"/>',
"branch-right": '<path d="M10 3v18M10 8h6l4 4-4 4h-6"/><rect x="18" y="10.5" width="3" height="3"/>',
"promote": '<path d="M4 4v16M4 8h6l4 4h6"/><rect x="18" y="10.5" width="3" height="3"/><path d="M14 18H8M8 18l3-3M8 18l3 3"/>',
"demote": '<path d="M4 4v16M4 8h6l4 4h6"/><rect x="18" y="10.5" width="3" height="3"/><path d="M8 18h6M14 18l-3-3M14 18l-3 3"/>',
"link": '<path d="M4 7v5h5M20 17v-5h-5M8.5 11.5l7 1"/><path d="M13 10.5l2.5 2.1-2.9 1.1"/>',
"unlink": '<path d="M4 7v5h5M20 17v-5h-5M8.5 11.5l7 1"/><path d="M7 18L18 6"/>',
"reorder-before": '<path d="M3 6h9M3 12h9M3 18h9M18 19V5M14.5 8.5L18 5l3.5 3.5"/><rect x="2" y="4.8" width="2.4" height="2.4"/>',
"reorder-after": '<path d="M3 6h9M3 12h9M3 18h9M18 5v14M14.5 15.5L18 19l3.5-3.5"/><rect x="2" y="16.8" width="2.4" height="2.4"/>',
"free-place": '<path d="M3 8V3h5M16 3h5v5M21 16v5h-5M8 21H3v-5"/><rect x="7" y="7" width="3" height="3" transform="rotate(45 8.5 8.5)"/><rect x="14" y="13" width="3" height="3" transform="rotate(45 15.5 14.5)"/>',
"attach": '<path d="M3 12h8M11 12l4-4M11 12l4 4M19 4v16M16 8h6M16 16h6"/>',
"detach": '<path d="M3 12h8M11 12l4-4M11 12l4 4M19 4v16"/><path d="M15 6l8 12M23 6l-8 12"/>',
"hoist": '<path d="M4 18h16M12 18V6M8 10l4-4 4 4"/><path d="M6 21h12"/>',
"return": '<path d="M20 7H8V4l-5 5 5 5v-3h8M16 11v6"/>',
"pin": '<path d="M7 4h10l-2 6 3 3h-5v8M11 21v-8H6l3-3z"/>',
"lock": '<rect x="5" y="10" width="14" height="10"/><path d="M8 10V7a4 4 0 0 1 8 0v3M12 14v3"/>'
}
for n,b in operations.items(): put("operations", n, b)
reader = {
"document": '<path d="M5 3h10l4 4v14H5zM15 3v5h5M8 11h8M8 15h8M8 19h5"/>',
"highlight": '<path d="M4 6h16M4 11h16M4 16h16"/><path d="M3 13h18v6H3z"/>',
"underline": '<path d="M6 4v7a6 6 0 0 0 12 0V4M5 20h14"/>',
"strikeout": '<path d="M7 6c1-2 3-3 5-3 3 0 5 1 6 3M6 18c1 2 3 3 6 3 3 0 5-1 6-3M3 12h18"/>',
"note": '<path d="M4 4h16v13H9l-5 4v-4zM8 8h8M8 12h6"/>',
"bookmark": '<path d="M7 3h10v18l-5-4-5 4z"/>',
"page": '<path d="M5 3h10l4 4v14H5zM15 3v5h5"/><path d="M8 12h8M8 16h5"/>',
"crop": '<path d="M7 3v14h14M3 7h14v14"/><path d="M10 10h7v7h-7z" stroke-dasharray="2 1"/>',
"anchor": '<path d="M12 3v13M7 8h10M6 16c1 4 3 5 6 5s5-1 6-5M6 16h4M18 16h-4"/><circle cx="12" cy="5" r="2"/>',
"citation": '<path d="M5 4h11l3 3v13H5zM16 4v4h4M8 11h8M8 15h6"/><path d="M3 8h4M3 12h4M3 16h4"/>',
"attachment": '<path d="M8 12l6-6a4 4 0 0 1 6 6l-8 8a6 6 0 0 1-8-8l8-8"/><path d="M8 12l6-6"/>',
"search": '<circle cx="10" cy="10" r="6"/><path d="M14.5 14.5L21 21M7 10h6"/>',
"zoom-in": '<circle cx="10" cy="10" r="6"/><path d="M14.5 14.5L21 21M7 10h6M10 7v6"/>',
"zoom-out": '<circle cx="10" cy="10" r="6"/><path d="M14.5 14.5L21 21M7 10h6"/>',
"rotate-left": '<path d="M7 6H3V2M3 6a9 9 0 1 1-1 8"/><path d="M8 10h8v8H8z"/>',
"rotate-right": '<path d="M17 6h4V2M21 6a9 9 0 1 0 1 8"/><path d="M8 10h8v8H8z"/>',
"fit-width": '<path d="M3 5v14M21 5v14M6 12h12M9 9l-3 3 3 3M15 9l3 3-3 3"/>',
"fit-page": '<path d="M4 4h16v16H4zM8 8h8v8H8z"/><path d="M2 8V2h6M16 2h6v6M22 16v6h-6M8 22H2v-6"/>',
"previous-page": '<path d="M15 5l-7 7 7 7M5 5v14"/>',
"next-page": '<path d="M9 5l7 7-7 7M19 5v14"/>',
"first-page": '<path d="M17 5l-7 7 7 7M6 5v14"/><path d="M3 5v14"/>',
"last-page": '<path d="M7 5l7 7-7 7M18 5v14"/><path d="M21 5v14"/>',
"open-source": '<path d="M4 4h10l4 4v12H4zM14 4v5h5M11 15h10M17 11l4 4-4 4"/>',
"source-link": '<path d="M5 3h9l4 4v14H5zM14 3v5h5M2 12h5M17 15h5M9 15l3-3 3 3"/>',
"annotation-list": '<path d="M7 3h11l3 3v13H7zM18 3v4h4M4 6v15h13M10 11h7M10 15h5"/>',
"selection": '<path d="M4 8V4h4M16 4h4v4M20 16v4h-4M8 20H4v-4"/><path d="M7 12h10" stroke-dasharray="2 1"/>',
"copy-excerpt": '<path d="M8 4h11v13H8zM5 7H3v14h12v-2M11 9h5M11 13h4"/>',
"extract-evidence": '<path d="M4 4h11v16H4zM8 8h5M8 12h5M8 16h4"/><path d="M15 12h6M18 9l3 3-3 3"/>'+DOT
}
for n,b in reader.items(): put("reader", n, b)
views = {
"map": '<path d="M3 6h5l4 6M3 18h5l4-6M12 12h4M16 12l5-5M16 12l5 5"/>'+DIAMOND,
"timeline": '<path d="M3 12h18M6 8v8M12 5v14M18 9v6"/><rect x="10.7" y="3.7" width="2.6" height="2.6"/>',
"matrix": '<path d="M4 4h16v16H4zM4 9h16M4 15h16M9 4v16M15 4v16"/><rect x="10" y="10" width="4" height="4"/>',
"provenance": '<path d="M4 5h6l2 4h8M4 12h8l2 4h6M4 19h6l2-3"/><circle cx="4" cy="5" r="1.5"/><circle cx="4" cy="12" r="1.5"/><circle cx="4" cy="19" r="1.5"/><path d="M18 7h3v3M18 14h3v3"/>',
"source-analysis-split": '<path d="M3 4h7v16H3zM14 4h7v16h-7zM12 3v18"/><path d="M6 8h2M6 12h2M6 16h2M16 12h3M16 12l2-2M16 12l2 2"/>',
"layers": '<path d="M4 7l8-4 8 4-8 4zM4 11l8 4 8-4M4 15l8 4 8-4"/>',
"legend": '<path d="M4 4h16v16H4z"/><circle cx="8" cy="8" r="1.5"/><path d="M11 8h6M6 13h4M12 13h5M6 17h11"/>',
"working-set": '<path d="M4 4h16v16H4zM8 8h8v8H8z"/><path d="M2 8V2h6M16 2h6v6M22 16v6h-6M8 22H2v-6"/>',
"perspective": '<path d="M3 12c3-5 6-7 9-7s6 2 9 7c-3 5-6 7-9 7s-6-2-9-7z"/><circle cx="12" cy="12" r="3"/><path d="M12 9v6M9 12h6"/>',
"history": '<path d="M12 4a8 8 0 1 1-7 4M5 4v5h5"/><path d="M12 7v5l4 2"/>',
"methods": '<path d="M5 3h10l4 4v14H5zM15 3v5h5M8 12h8M8 16h5"/><rect x="7" y="6" width="3" height="3"/>',
"overview": '<path d="M3 8V3h5M16 3h5v5M21 16v5h-5M8 21H3v-5"/><path d="M7 8h4v4H7zM14 7h3v3h-3zM12 15h5v3h-5z"/>',
"relations-overlay": '<path d="M4 6h5l3 6 3-6h5M4 18h5l3-6 3 6h5"/><circle cx="4" cy="6" r="1.5"/><circle cx="20" cy="6" r="1.5"/><circle cx="4" cy="18" r="1.5"/><circle cx="20" cy="18" r="1.5"/>',
"structure-overlay": '<path d="M4 4v16M4 8h6l4-4h6M4 16h6l4 4h6M10 12h10"/><circle cx="4" cy="12" r="1.5"/>',
"semantic-zoom": '<path d="M3 6h18M6 12h12M9 18h6"/><circle cx="5" cy="6" r="2"/><circle cx="9" cy="12" r="2"/><circle cx="12" cy="18" r="2"/>',
"context-key": '<path d="M5 4h14v16H5zM8 8h8M8 12h6M8 16h4"/><path d="M3 8h2M3 12h2M3 16h2"/>',
"inspector": '<path d="M3 4h11v16H3zM17 4h4v16h-4zM6 8h5M6 12h5M6 16h3"/><path d="M18 8h2M18 12h2M18 16h2"/>'
}
for n,b in views.items(): put("views", n, b)

status = {
"selected": '<path d="M4 8V4h4M16 4h4v4M20 16v4h-4M8 20H4v-4"/>'+DIAMOND,
"focused": '<path d="M3 9V3h6M15 3h6v6M21 15v6h-6M9 21H3v-6"/>'+DOT,
"collapsed": '<path d="M4 12h12M13 9l3 3-3 3"/><path d="M18 5v14"/>',
"expanded": '<path d="M4 12h12M7 9l-3 3 3 3"/><path d="M18 5v14"/>',
"hidden": '<path d="M3 12c3-4 6-6 9-6s6 2 9 6c-3 4-6 6-9 6s-6-2-9-6zM4 4l16 16"/>',
"filtered": '<path d="M4 4h16l-6 7v6l-4 3v-9z"/><path d="M3 20h18" stroke-dasharray="2 2"/>',
"generalized": '<path d="M4 6h5v5H4zM15 6h5v5h-5zM9.5 14h5v5h-5z"/><path d="M9 9h6M12 11v3"/>',
"review": '<path d="M12 3l9 17H3zM12 8v6M12 17h.1"/>',
"stale": '<circle cx="12" cy="12" r="9"/><path d="M12 7v6l4 2M3 3l18 18"/>',
"superseded": '<path d="M4 7h10l4 4-4 4H8"/><path d="M7 4l10 16"/>',
"retracted": '<path d="M4 4h16v16H4zM6 6l12 12M18 6L6 18"/>',
"disputed": '<path d="M4 5h7v14H4zM13 5h7v14h-7zM8 9l8 6M16 9l-8 6"/>',
"unknown": '<path d="M4 4h16v16H4z" stroke-dasharray="2 2"/><path d="M9 9c1-2 2-3 4-3 3 0 5 2 5 4 0 3-4 3-4 6M14 19h.1"/>',
"pinned": '<path d="M7 4h10l-2 6 3 3h-5v8M11 21v-8H6l3-3z"/><path d="M3 3h4"/>',
"locked": '<rect x="5" y="10" width="14" height="10"/><path d="M8 10V7a4 4 0 0 1 8 0v3M12 14v3"/>',
"dirty": '<path d="M4 4h16v16H4z"/><circle cx="18" cy="6" r="3" fill="currentColor" stroke="none"/>',
"synced": '<path d="M5 8a8 8 0 0 1 13-2l2 2M20 4v4h-4M19 16a8 8 0 0 1-13 2l-2-2M4 20v-4h4"/><path d="M9 12l2 2 4-5"/>',
"conflict": '<path d="M4 5h6l2 3 2-3h6v14h-6l-2-3-2 3H4z"/><path d="M12 8v8"/>'
}
for n,b in status.items(): put("status", n, b)
assessment = {
"confidence-high": '<path d="M4 19h4V5H4zM10 19h4V9h-4zM16 19h4V13h-4z"/><path d="M3 21h18"/>',
"confidence-medium": '<path d="M4 19h4V9H4zM10 19h4V9h-4zM16 19h4v-6h-4z"/><path d="M3 21h18"/>',
"confidence-low": '<path d="M4 19h4v-6H4zM10 19h4v-4h-4zM16 19h4v-2h-4z"/><path d="M3 21h18"/>',
"confidence-unspecified": '<path d="M4 19h4V9H4zM10 19h4V9h-4zM16 19h4V9h-4z" stroke-dasharray="2 2"/><path d="M3 21h18"/>',
"likelihood": '<path d="M4 18h16M5 15l3-4 3 2 3-6 5 5"/><path d="M5 20v-4M19 20v-4"/>',
"reliability": '<path d="M4 6h16v12H4zM7 9h10M7 13h7"/><path d="M18 8v8"/><circle cx="18" cy="12" r="2"/>',
"credibility": '<path d="M4 12h5l3-5 3 10 2-5h3"/><path d="M4 5v14M20 5v14"/>',
"independence-known": '<circle cx="7" cy="12" r="3"/><circle cx="17" cy="12" r="3"/><path d="M10 12h4"/>',
"independence-unknown": '<circle cx="7" cy="12" r="3"/><circle cx="17" cy="12" r="3"/><path d="M10 12h4" stroke-dasharray="1 2"/><path d="M12 8v8" stroke-dasharray="1 2"/>',
"diagnosticity": '<path d="M3 12h7l4-5h7M10 12l4 5h7"/><path d="M17 4v6M17 14v6"/><circle cx="10" cy="12" r="2"/>',
"corroboration-family": '<path d="M3 6h5l4 6M3 12h9M3 18h5l4-6M12 12h9"/><path d="M5 4v16" stroke-dasharray="2 2"/>'+DOT,
"dissent": '<path d="M4 6h7l3 6M4 18h7l3-6M14 12h6"/><path d="M17 8l4 4-4 4"/><path d="M8 9l-3 3 3 3"/>',
"basis-gap": '<path d="M3 12h6M15 12h6M9 8v8M15 8v8"/><path d="M10.5 12h3" stroke-dasharray="1 2"/><circle cx="12" cy="5" r="1.5"/>',
"deception-risk": '<path d="M3 12c3-5 6-7 9-7s6 2 9 7c-3 5-6 7-9 7s-6-2-9-7z"/><path d="M8 8l8 8M16 8l-8 8"/>',
"source-quality": '<path d="M5 3h10l4 4v14H5zM15 3v5h5"/><path d="M8 12h8M8 16h5"/><path d="M3 18l3 3 4-5"/>',
"review-needed": '<path d="M12 3l9 17H3zM12 8v5M12 16h.1"/><path d="M5 21h14"/>',
"assessor": '<circle cx="12" cy="8" r="4"/><path d="M5 21c1-5 3-8 7-8s6 3 7 8M3 12h3M18 12h3"/>',
"perspective-base": '<path d="M3 12c3-5 6-7 9-7s6 2 9 7c-3 5-6 7-9 7s-6-2-9-7z"/><circle cx="12" cy="12" r="3"/>',
"perspective-alt": '<path d="M3 9c3-4 6-6 9-6s6 2 9 6c-3 4-6 6-9 6s-6-2-9-6zM3 17h18"/><circle cx="12" cy="9" r="2"/>',
"impact-cone": '<path d="M4 12h4l4-7M8 12l4 7M12 5l8-2M12 5l8 6M12 19l8-6M12 19l8 8"/>'+DOT
}
for n,b in assessment.items(): put("assessment-lens", n, b)
marks = {
"catalyst-converge-diverge": '<path d="M3 5h5l4 7M3 12h9M3 19h5l4-7M12 12h4M16 12l5-6M16 12l5 6"/>'+DOT,
"catalyst-trace-junction": '<path d="M3 6h6l3 6M3 12h9M3 18h6l3-6M12 12h9"/><path d="M19 10h2v4"/>'+DOT,
"catalyst-open-probe": '<path d="M3 6h6l3 6M3 18h6l3-6M12 12h4M16 12l5-5M16 12l5 5"/><path d="M19 5h2v4M19 15h2v4"/>'+DOT,
"catalyst-split-axis": '<path d="M3 4v16M3 8h6l4 4h3M3 16h6l4-4M16 12h5"/>'+DOT,
"catalyst-registered-junction": '<path d="M3 5h5l4 7M3 12h9M3 19h5l4-7M12 12h9"/><path d="M18 9h3v3M18 15h3v-3"/>'+DOT,
"trace-index": '<path d="M4 4v16M4 12h7l4-4h5M15 16h5"/><rect x="9.5" y="10.5" width="3" height="3" transform="rotate(45 11 12)"/>',
"open-terminal": '<path d="M4 12h12M16 12l5-5M16 12l5 5M19 5h2v4M19 15h2v4"/>',
"closed-terminal": '<path d="M4 12h12M16 12l5-5M16 12l5 5"/><rect x="19" y="5" width="3" height="3"/><rect x="19" y="16" width="3" height="3"/>',
"registration-corners": '<path d="M3 8V3h5M16 3h5v5M21 16v5h-5M8 21H3v-5"/>',
"provenance-spine": '<path d="M12 2v20M4 6h8M4 12h8M4 18h8M12 9h8M12 15h8"/><circle cx="12" cy="12" r="2" fill="currentColor" stroke="none"/>'
}
for n,b in marks.items(): put("marks", n, b)

manifest = [{k:v for k,v in a.items() if k != "body"} for a in assets]
(OUT / "manifest.json").write_text(json.dumps({"status":"research-only","count":len(manifest),"assets":manifest}, indent=2), encoding="utf-8")

symbols = []
for i,a in enumerate(assets):
    symbols.append(f'<symbol id="{a["category"]}-{a["name"]}" viewBox="0 0 24 24">{a["body"]}</symbol>')
(OUT / "catalyst-research-sprite.svg").write_text(f'<svg xmlns="http://www.w3.org/2000/svg" {STROKE} style="display:none">{"".join(symbols)}</svg>', encoding="utf-8")
from collections import defaultdict
by_cat = defaultdict(list)
for a in assets: by_cat[a["category"]].append(a)
for category, group in by_cat.items():
    cols, cell_w, cell_h = 4, 190, 58
    rows = (len(group)+cols-1)//cols
    parts = [f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {cols*cell_w} {rows*cell_h+42}" color="#18202a">', '<rect width="100%" height="100%" fill="#f7f8fa"/>', f'<text x="16" y="26" font-family="system-ui,sans-serif" font-size="16" font-weight="700" fill="#18202a">Catalyst SVG research — {html.escape(category)}</text>']
    for i,a in enumerate(group):
        x=(i%cols)*cell_w; y=(i//cols)*cell_h+42
        parts.append(f'<rect x="{x+4}" y="{y+4}" width="{cell_w-8}" height="{cell_h-8}" rx="2" fill="#fff" stroke="#d9dee5"/>')
        parts.append(f'<g transform="translate({x+16} {y+12}) scale(1.35)" {STROKE}>{a["body"]}</g>')
        parts.append(f'<text x="{x+58}" y="{y+31}" font-family="ui-monospace,monospace" font-size="11" fill="#27313d">{html.escape(a["name"])}</text>')
    parts.append('</svg>')
    (OUT / f"contact-sheet-{category}.svg").write_text(''.join(parts), encoding="utf-8")

cards=''.join(f'<article><img src="{a["category"]}/{a["name"]}.svg" alt=""><code>{a["category"]}/{a["name"]}</code></article>' for a in assets)
html_page=f'''<!doctype html><meta charset="utf-8"><title>Catalyst SVG Research</title><style>body{{margin:24px;background:#eef1f4;color:#18202a;font:14px system-ui}}h1{{font-size:22px}}.grid{{display:grid;grid-template-columns:repeat(auto-fill,minmax(210px,1fr));gap:8px}}article{{display:flex;align-items:center;gap:14px;background:white;border:1px solid #d7dde4;padding:12px;min-height:48px}}img{{width:32px;height:32px}}code{{font-size:11px;overflow-wrap:anywhere}}</style><h1>Catalyst SVG research — {len(assets)} assets</h1><p>Experimental, unwired, monochrome-first candidates. Geometry is intentionally compositional.</p><div class="grid">{cards}</div>'''
(OUT / "gallery.html").write_text(html_page, encoding="utf-8")

readme=f'''# Catalyst SVG research batch\n\nGenerated research assets: **{len(assets)}**. These are intentionally unwired and non-normative.\n\nDesign constraints: 24×24 grid, currentColor, square linecaps, miter joins, monochrome survival, no stock icon dependency. Relationship candidates use endpoint and mid-line geometry so semantics need not depend on hue.\n\nCategories: {', '.join(f'{k} ({len(v)})' for k,v in sorted(by_cat.items()))}.\n\nRegenerate with `python tools/research-probes/2026-09-13/svg-batch/generate_catalyst_svg_batch.py`.\n'''
(OUT / "README.md").write_text(readme, encoding="utf-8")
print(f"Generated {len(assets)} SVG assets in {OUT}")
