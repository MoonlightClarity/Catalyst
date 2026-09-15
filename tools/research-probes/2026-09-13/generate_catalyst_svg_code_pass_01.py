from pathlib import Path
from html import escape
import json, re, xml.etree.ElementTree as ET

ROOT = Path(r"C:\Users\iris\Downloads\Catalyst")
OUT = ROOT / "public" / "generated" / "catalyst-svg-code-pass-01"
OUT.mkdir(parents=True, exist_ok=True)

STROKE = "#D7E0DF"
DETAIL = "#91A3A1"
ACCENT = "#5FA7A0"
MUTED = "#697A79"

def svg24(body, view="0 0 24 24", title=None):
    title_el = f"<title>{escape(title)}</title>" if title else ""
    return (
        f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="{view}" fill="none" '
        f'stroke="{STROKE}" stroke-width="1.55" stroke-linecap="square" stroke-linejoin="miter">'
        f'{title_el}{body}</svg>'
    )

def p(d, cls=""):
    extra = f' class="{cls}"' if cls else ""
    return f'<path{extra} d="{d}"/>'

def rect(x,y,w,h, extra=""):
    return f'<rect x="{x}" y="{y}" width="{w}" height="{h}"{extra}/>'

def circle(cx,cy,r, extra=""):
    return f'<circle cx="{cx}" cy="{cy}" r="{r}"{extra}/>'

def diamond(cx=12,cy=12,r=3, fill=False):
    fillattr = f' fill="{ACCENT}" stroke="none"' if fill else ""
    return f'<path d="M{cx} {cy-r}l{r} {r}-{r} {r}-{r}-{r}z"{fillattr}/>'

def dot(cx=12,cy=12,r=1.6):
    return circle(cx,cy,r,f' fill="{ACCENT}" stroke="none"')

def open_corner(x,y,flipx=1,flipy=1):
    a=2.8
    x2=x+a*flipx; y2=y+a*flipy
    return p(f"M{x2} {y}H{x}V{y2}")

def file_shape():
    return p("M5 3h9l5 5v13H5zM14 3v6h6")

def card_shape():
    return p("M5 5h14v14H5z")

def arrow_right(x1=5,y=12,x2=19):
    return p(f"M{x1} {y}H{x2}M{x2-3} {y-3}l3 3-3 3")

def arrow_left(x1=19,y=12,x2=5):
    return p(f"M{x1} {y}H{x2}M{x2+3} {y-3}l-3 3 3 3")

def line_terminals(d="M4 12H20", left="bar", right="arrow"):
    parts=[p(d)]
    if left=="bar": parts.append(p("M4 9v6"))
    elif left=="open": parts.append(open_corner(4,9,1,1))
    elif left=="dot": parts.append(dot(4,12,1.5))
    elif left=="diamond": parts.append(diamond(4,12,2,False))
    if right=="bar": parts.append(p("M20 9v6"))
    elif right=="open": parts.append(p("M17.2 9H20v3"))
    elif right=="dot": parts.append(dot(20,12,1.5))
    elif right=="diamond": parts.append(diamond(20,12,2,False))
    elif right=="arrow": parts.append(p("M17 9l3 3-3 3"))
    return "".join(parts)

GLYPHS = {}

def add(category,name,body,title=None):
    GLYPHS[f"{category}/{name}.svg"] = svg24(body, title=title or name.replace("-"," "))

# --- Analytical notation ---
add("notation","note", p("M5 5h11l3 3v11H5zM16 5v4h4")+p("M8 12h8M8 16h6"))
add("notation","thought", p("M5 6h10l4 6-4 6H5")+p("M5 9H2v6h3M9 12h5l3-3M14 12l3 3h4")+dot(14,12))
add("notation","claim", diamond(12,12,8)+p("M7 12h10M12 7v10")+dot())
add("notation","assumption", p("M5 4H3v16h2M19 4h2v16h-2")+diamond(12,12,6)+p("M8 21h8")+dot())
add("notation","hypothesis", p("M3 12h6M9 12l3-3 3 3-3 3zM15 12h2l4-6M17 12l4 6M21 4v4M21 16v4")+dot())
add("notation","question", p("M5 8c1-4 4-6 7-6 5 0 8 3 8 7 0 5-6 5-6 9")+p("M14 21h.1")+dot(14,21,1.3))
add("notation","gap", p("M3 12h6M15 12h6")+p("M9 8v8M15 8v8")+p("M11 5h2M11 19h2"))
add("notation","requirement", card_shape()+p("M8 9h8M8 13h5M8 17h7")+p("M3 12h2M19 12h2")+diamond(4,12,1.5))
add("notation","indicator", p("M4 18h16M6 18V9M12 18V5M18 18v-6")+p("M4 5h4M16 5h4")+dot(12,5))
add("notation","trigger", p("M4 4v16M4 12h7l4-5h5M11 12l4 5h5")+p("M18 5h3v3M18 16h3v3")+dot(11,12))
add("notation","observation", card_shape()+p("M8 9h8M8 12h6M8 15h9")+p("M3 8v8")+dot(3,12))
add("notation","interpretation", diamond(12,12,7)+p("M5 12H2M19 12h3M12 5V2M12 19v3")+p("M8 12h8")+dot())
add("notation","inference", p("M3 6h5l4 6M3 12h9M3 18h5l4-6M12 12h5")+diamond(12,12,2.3)+arrow_right(17,12,21))
add("notation","assessment", diamond(12,12,8)+p("M7 12h10M12 7v10")+circle(12,12,4))
add("notation","perspective", p("M4 7h6l2 5-2 5H4M20 7h-6l-2 5 2 5h6")+circle(12,12,2.2))
add("notation","scenario", p("M4 18h4l4-6 4 6h4M12 12V5")+p("M9 8l3-3 3 3")+dot(12,12))
add("notation","alternative", p("M4 12h6l3-5h7M10 12l3 5h7")+p("M18 5h3v3M18 15h3v3"))
add("notation","dissent", p("M4 6h7l2 4M4 18h7l2-4M13 10l3-4h4M13 14l3 4h4")+p("M11 9l2 2M11 15l2-2"))
add("notation","reconciliation", p("M4 6h6l4 6M4 18h6l4-6M14 12h6")+diamond(14,12,2)+p("M17 9l3 3-3 3"))
add("notation","revision", file_shape()+p("M8 13h7M8 16h5")+p("M17 12a5 5 0 1 1-2-4")+p("M15 5v4h4"))
add("notation","superseded", file_shape()+p("M8 12h8M8 15h6")+p("M3 18h18")+p("M18 15l3 3-3 3"))
add("notation","retracted", file_shape()+p("M8 12h8M8 15h6")+p("M3 3l18 18"))
add("notation","stale", file_shape()+circle(16,16,5)+p("M16 13v3l2 1"))
add("notation","disputed", diamond(12,12,8)+p("M7 9l10 6M17 9L7 15")+circle(12,12,2))
add("notation","warning", p("M12 3l9 17H3z")+p("M12 8v6M12 18h.1"))
add("notation","weak-signal", p("M3 17h3l3-4 3 2 3-7 3 5h3")+p("M3 20h18")+circle(18,13,1.5))
add("notation","anomaly", p("M3 16h4l3-3 3 1 3-8 3 10h2")+p("M3 20h18")+diamond(16,6,1.8))
add("notation","baseline", p("M3 16h18M3 10h18")+p("M6 8v4M12 8v4M18 8v4"))
add("notation","trend-up", p("M4 18l5-5 4 2 7-8")+p("M16 7h4v4"))
add("notation","trend-down", p("M4 6l5 5 4-2 7 8")+p("M16 17h4v-4"))
add("notation","watch", circle(12,12,8)+p("M12 4v3M20 12h-3M12 20v-3M4 12h3")+diamond())
add("notation","scan", p("M4 9V4h5M15 4h5v5M20 15v5h-5M9 20H4v-5")+p("M6 12h3l2-3 3 6 2-3h2"))
add("notation","probe", p("M3 12h8l4-4M11 12l4 4")+arrow_right(15,8,21)+arrow_right(15,16,21))
add("notation","divergence", p("M3 12h8M11 12l5-6h5M11 12l5 6h5")+diamond(11,12,2))
add("notation","junction", p("M3 6h5l4 6M3 12h9M3 18h5l4-6M12 12h9")+diamond(12,12,2.2))
add("notation","open-frontier", p("M3 12h8l4-5h5M11 12l4 5h5")+p("M19 5h2v3M19 16h2v3"))
add("notation","map-portal", p("M4 6h6l2 3 2-3h6v12h-6l-2-3-2 3H4z")+diamond(12,12,2)+p("M9 12h6"))

# --- World/source/evidence species ---
add("species","entity", rect(5,5,14,14)+p("M5 9H2M5 15H2M19 9h3M19 15h3M12 5V2M12 19v3")+rect(9.5,9.5,5,5,f' fill="{ACCENT}" stroke="none"'))
add("species","event", p("M3 12h18M12 3v18")+p("M6 8v8M18 8v8M8 6h8M8 18h8")+diamond())
add("species","source", file_shape()+p("M2 8h3M2 12h3M2 16h3")+dot(3.5,12))
add("species","evidence", card_shape()+p("M8 9h7M8 12h8M8 15h6M19 6v12M19 10h3")+dot(22,10))
add("species","aggregate", p("M6 4h12v12H6zM4 8v12h12")+p("M9 8h6M9 12h4")+circle(18,18,3)+p("M18 16v4M16 18h4"))
add("species","submap", p("M4 5h16v14H4z")+p("M7 12h4l3-4h4M11 12l3 4h4")+diamond(11,12,1.7))
add("species","source-crop", p("M4 5h16v14H4z")+p("M7 9h10M7 12h7M7 15h9")+p("M2 9v6")+dot(2,12))
add("species","evidence-crop", p("M4 5h16v14H4z")+p("M7 9h10M7 12h7M7 15h9")+rect(6,10,12,4,f' stroke="{ACCENT}"'))
add("species","picture", p("M3 5h18v14H3z")+p("M6 15l4-5 3 3 2-2 4 4")+circle(8,8,1.4))
add("species","issue", p("M4 4h16v16H4z")+p("M7 8h10M7 12h7M7 16h5")+diamond(18,18,1.8))

# --- Provenance ---
add("provenance","anchor", p("M12 3v18M6 8h6M6 16h6")+diamond(12,12,2.2)+p("M15 12h6"))
add("provenance","trace", p("M4 4v16M4 12h6l4-4h6M14 16h6")+diamond(10,12,2)+p("M18 6l2 2-2 2M18 14l2 2-2 2"))
add("provenance","trace-index", p("M5 5v14M5 12h8")+diamond(13,12,2)+p("M16 12h5")+p("M17 7h4M17 17h4"))
add("provenance","origin", circle(6,12,3)+p("M9 12h6l4-4M15 12l4 4")+p("M18 6h3v3M18 15h3v3"))
add("provenance","agent", circle(12,8,3)+p("M6 20c1-5 3-7 6-7s5 2 6 7")+p("M3 12h3M18 12h3"))
add("provenance","artifact-version", file_shape()+p("M8 12h8M8 15h6")+circle(18,18,4)+p("M16 18h4M18 16v4"))
add("provenance","transform", file_shape()+p("M2 12h6M6 9l3 3-3 3")+p("M15 12h6M18 9l3 3-3 3"))
add("provenance","integrity", file_shape()+p("M9 13l2 2 5-6")+p("M3 18h4"))
add("provenance","fixity", file_shape()+p("M8 13h2M11 13h2M14 13h2M8 16h2M11 16h2M14 16h2"))
add("provenance","quote", file_shape()+p("M8 12h3v4H8zM13 12h3v4h-3z"))
add("provenance","translate", file_shape()+p("M8 12h8M10 9v6M14 9v6")+p("M3 19h18"))
add("provenance","summarize", file_shape()+p("M8 11h8M8 14h8M8 17h5")+p("M3 8h3"))
add("provenance","derived-from", line_terminals(left="diamond",right="arrow")+p("M9 8l6 8M9 16l6-8"))
add("provenance","shared-origin", circle(5,12,2.5)+p("M7.5 12h4M11.5 12l4-5h5M11.5 12l4 5h5")+p("M19 5h3v3M19 16h3v3"))
add("provenance","unknown-origin", p("M4 12h6M14 12h6")+circle(12,12,2)+p("M12 8v-2c0-2 4-2 4-5")+p("M16 1h.1"))
add("provenance","family", p("M4 5h5l3 4 3-4h5M12 9v10M7 19h10")+circle(7,19,1.5)+circle(12,19,1.5)+circle(17,19,1.5))
add("provenance","return-to-source", file_shape()+p("M3 12h8M7 8l-4 4 4 4"))
add("provenance","detach-anchor", file_shape()+p("M2 12h5M17 12h5")+p("M9 9l6 6M15 9l-6 6"))
add("provenance","relink-anchor", file_shape()+p("M2 12h6M16 12h6")+p("M8 9l3 3-3 3M16 9l-3 3 3 3"))
add("provenance","impact-cone", p("M4 12h4l4-4 4 4 4-4M12 8v8M16 12l4 4")+diamond(8,12,1.5)+p("M19 6h3v3M19 15h3v3"))
add("provenance","reanchor", file_shape()+p("M2 12h5")+diamond(8,12,1.8)+p("M10 12h5l3-3M15 12l3 3"))
add("provenance","source-state", file_shape()+circle(18,18,4)+p("M16 18h4")+dot(18,18,1))
add("provenance","exact-location", file_shape()+p("M8 12h8")+p("M12 9v6")+circle(12,12,4))
add("provenance","representation", p("M4 4h11l5 5v11H4zM15 4v6h6")+p("M7 13h9M7 16h6")+p("M2 8h2M2 12h2M2 16h2"))
add("provenance","lineage", p("M4 4h6l2 4 2-4h6M12 8v4M12 12l-5 5M12 12l5 5")+diamond(12,12,1.7)+circle(7,17,1.6)+circle(17,17,1.6))

# --- Relationship grammar ---
rel_kinds = [
    ("related-to","bar","bar",""),
    ("supports","bar","arrow",p("M9 9l6 6")),
    ("contradicts","bar","arrow",p("M9 9l6 6M15 9l-6 6")),
    ("depends-on","diamond","arrow",p("M9 12h6")),
    ("derived-from","diamond","arrow",p("M9 8l6 8M9 16l6-8")),
    ("about","dot","arrow",circle(12,12,2)),
    ("precedes","bar","arrow",p("M8 8v8M12 8v8M16 8v8")),
    ("assumes","diamond","arrow",p("M10 9h4v6h-4z")),
    ("bears-on","open","arrow",diamond(12,12,1.7)),
    ("owns","bar","arrow",rect(10,10,4,4)),
    ("works-for","dot","arrow",p("M10 9h4v6h-4z")),
    ("causes","bar","arrow",p("M9 12l2-3 2 6 2-3")),
    ("enables","bar","arrow",p("M10 8v8M14 8v8")),
    ("inhibits","bar","bar",p("M12 7v10")),
    ("quotes","dot","arrow",p("M10 9h2v4h-2zM13 9h2v4h-2z")),
    ("translates","dot","arrow",p("M9 8h6M10 16h4")),
    ("summarizes","dot","arrow",p("M9 9h6M9 12h6M10 15h4")),
    ("revised-from","diamond","arrow",p("M12 8a4 4 0 1 1-3 1")+p("M9 6v4h4")),
    ("extracted-from","dot","arrow",p("M10 8h4M12 8v8")),
]
for name,left,right,mid in rel_kinds:
    add("relations",name,line_terminals(left=left,right=right)+mid)

# relation states / topology
add("relations","undirected", line_terminals(left="bar",right="bar")+circle(12,12,1.7))
add("relations","directed", line_terminals(left="bar",right="arrow"))
add("relations","bidirectional", p("M5 12h14M8 9l-3 3 3 3M16 9l3 3-3 3"))
add("relations","latent", p("M4 12h3M9 12h3M14 12h3M19 12h1")+p("M17 9l3 3-3 3"))
add("relations","overlay", p("M4 12h16")+p("M4 8h16",)+circle(12,12,2))
add("relations","structural-branch", p("M4 4v16M4 9h7l4-4h5M4 15h8l4 4h4")+p("M18 3h3v3M18 17h3v3"))
add("relations","collapsed-crossing", p("M4 4v16M4 12h7")+p("M11 8v8")+p("M13 12h7")+p("M17 9l3 3-3 3"))
add("relations","junction-input", p("M3 6h6l3 6M3 12h9M3 18h6l3-6")+diamond(12,12,2))
add("relations","junction-output", diamond(7,12,2)+arrow_right(9,12,21))
add("relations","cross-link", p("M4 6h5l6 12h5M4 18h5l6-12h5")+circle(12,12,1.5))
add("relations","relationship-add", line_terminals(left="bar",right="arrow")+p("M12 5v5M9.5 7.5h5"))
add("relations","relationship-remove", line_terminals(left="bar",right="arrow")+p("M9 7l6 6M15 7l-6 6"))
add("relations","semantic-overlay-on", p("M4 6h16M4 12h16M4 18h16")+circle(8,6,1.3)+diamond(12,12,1.5)+rect(16.5,16.5,3,3))
add("relations","semantic-overlay-off", p("M4 6h16M4 12h16M4 18h16")+p("M4 4l16 16"))

# --- Structure / map operations ---
structure_icons = {
"child": p("M5 4v16M5 10h7l4 4h4")+rect(18,12.5,3,3)+p("M12 4h7M17 2v4"),
"sibling": p("M5 4v16M5 8h8M5 16h8")+rect(12,6.5,3,3)+rect(12,14.5,3,3)+p("M19 9v6M16 12h6"),
"promote": p("M5 4v16M5 9h7l4 4h4")+rect(18,11.5,3,3)+p("M15 18H9M9 18l3-3M9 18l3 3"),
"demote": p("M5 4v16M5 9h7l4 4h4")+rect(18,11.5,3,3)+p("M9 18h6M15 18l-3-3M15 18l-3 3"),
"reorder-before": p("M4 7h9M4 12h9M4 17h9M18 19V6M14.5 9.5L18 6l3.5 3.5")+rect(3,5.8,2.4,2.4),
"reorder-after": p("M4 7h9M4 12h9M4 17h9M18 5v13M14.5 14.5L18 18l3.5-3.5")+rect(3,15.8,2.4,2.4),
"side-left": p("M13 4v16M13 8H7l-3 4 3 4h6")+rect(3,10.5,3,3)+p("M18 12h3M18 9l-3 3 3 3"),
"side-right": p("M11 4v16M11 8h6l3 4-3 4h-6")+rect(18,10.5,3,3)+p("M6 12H3M6 9l3 3-3 3"),
"collapse": p("M5 5v14M5 9h7l4-4h3M5 15h7l4 4h3M10 12h10M16 9l-3 3 3 3"),
"expand": p("M5 5v14M5 9h7l4-4h3M5 15h7l4 4h3M10 12h10M14 9l3 3-3 3"),
"free-placement": p("M4 8V4h4M16 4h4v4M20 16v4h-4M8 20H4v-4")+diamond(9,9,1.7)+diamond(15,14,1.7),
"arrange": p("M4 12h5M9 12l4-5h7M9 12l4 5h7")+rect(3,10.5,3,3)+p("M19 5.5h2v3M19 15.5h2v3"),
"auto-layout": p("M4 12h5l4-5h7M9 12l4 5h7")+p("M18 4h3v3M21 4l-4 4M6 20H3v-3M3 20l4-4"),
"fit": p("M4 9V4h5M15 4h5v5M20 15v5h-5M9 20H4v-5")+p("M8 12h8M12 8v8"),
"focus": p("M4 9V4h5M15 4h5v5M20 15v5h-5M9 20H4v-5")+diamond(12,12,2),
"home": p("M4 13l8-8 8 8M6.5 11.5V20h11v-8.5")+rect(10.5,14,3,6),
"back": p("M20 6H9V3L3 9l6 6v-3h8M17 12v5"),
"forward": p("M4 6h11V3l6 6-6 6v-3H7M7 12v5"),
"hoist": p("M4 18h16M12 18V6M8 10l4-4 4 4")+diamond(12,18,1.8),
"unhoist": p("M4 6h16M12 6v12M8 14l4 4 4-4")+diamond(12,6,1.8),
"portal": p("M4 5h16v14H4z")+p("M8 12h8M13 8l4 4-4 4"),
"peek": p("M3 12s3-5 9-5 9 5 9 5-3 5-9 5-9-5-9-5z")+circle(12,12,2),
"overview": p("M3 4h18v16H3z")+p("M6 8h5v4H6zM13 7h5v6h-5zM7 14h4v3H7zM14 15h4v2h-4z"),
"minimap": p("M4 4h16v16H4z")+rect(7,7,6,5)+p("M15 8h3M15 11h3M7 15h11"),
"working-set": p("M4 5h16v14H4z")+rect(7,8,4,4)+rect(13,12,4,4)+p("M11 10l2 4"),
"territory-observed": p("M4 4h7v16H4z")+p("M7 8h2M7 12h2M7 16h2"),
"territory-assessed": diamond(12,12,8)+p("M8 12h8")+dot(),
"territory-open": p("M4 12h6l4-5h6M10 12l4 5h6")+p("M19 5h2v3M19 16h2v3"),
"territory-watch": circle(12,12,8)+diamond()+p("M12 4v3M20 12h-3M12 20v-3M4 12h3"),
}
for name,body in structure_icons.items():
    add("structure",name,body)

# --- Reader / annotation controls ---
reader_icons = {
"open-source": file_shape()+arrow_right(9,15,21),
"document": file_shape()+p("M8 12h8M8 15h6"),
"pages": p("M7 4h11v15H7zM4 7v14h11M10 9h5M10 13h5"),
"thumbnail-panel": p("M4 4h16v16H4zM8 4v16M10 7h7M10 11h7M10 15h7"),
"outline-panel": p("M4 4h16v16H4zM9 4v16M11 8h6M11 12h5M11 16h4"),
"annotations-panel": p("M4 4h16v16H4zM9 4v16M11 8h6M11 12h4M11 16h5")+diamond(7,8,1.2),
"bookmark-panel": p("M4 4h16v16H4zM9 4v16")+p("M12 7h5v8l-2.5-2-2.5 2z"),
"search-document": file_shape()+circle(10,13,3)+p("M12.5 15.5L17 20"),
"highlight": p("M5 7h14M5 12h14M5 17h14")+rect(4,14,16,6,f' stroke="{ACCENT}"'),
"underline": p("M6 5v7a6 6 0 0 0 12 0V5M5 20h14"),
"strike": p("M7 7c1-2 3-3 5-3 3 0 5 1 6 3M6 17c1 2 3 3 6 3s5-1 6-3M4 12h16"),
"comment": p("M4 5h16v12H9l-4 4v-4H4z")+p("M8 9h8M8 13h6"),
"annotation": file_shape()+p("M8 12h8M8 16h6M7 18h9"),
"copy-quote": p("M8 5h11v12H8zM5 8H3v13h12v-2")+p("M11 10h2v4h-2zM14 10h2v4h-2z"),
"capture": p("M4 5h16v14H4z")+p("M7 9h10M7 12h7M7 15h9")+p("M2 12h5M17 12h5")+diamond(3,12,1.3),
"attach-evidence": p("M4 12h8M12 12l4-4M12 12l4 4M19 5v14M16 8h6M16 16h6")+diamond(12,12,1.3),
"source-link": file_shape()+p("M2 12h5M17 15h5M9 15l3-3 3 3"),
"first-page": p("M17 5l-7 7 7 7M6 5v14"),
"previous-page": p("M15 5l-7 7 7 7"),
"next-page": p("M9 5l7 7-7 7"),
"last-page": p("M7 5l7 7-7 7M18 5v14"),
"zoom-in": circle(10,10,6)+p("M14.5 14.5L20 20M7 10h6M10 7v6"),
"zoom-out": circle(10,10,6)+p("M14.5 14.5L20 20M7 10h6"),
"fit-page": p("M5 3h14v18H5z")+p("M8 7h8v10H8z"),
"fit-width": p("M3 5h18v14H3z")+p("M6 12h12M6 12l3-3M6 12l3 3M18 12l-3-3M18 12l-3 3"),
"rotate-left": p("M18 8a7 7 0 1 0 1 8")+p("M18 3v5h-5"),
"rotate-right": p("M6 8a7 7 0 1 1-1 8")+p("M6 3v5h5"),
"select-text": p("M5 5h14M12 5v14M8 19h8")+p("M4 9v6M20 9v6"),
"hand-pan": p("M8 12V7a2 2 0 0 1 4 0v4-1V6a2 2 0 0 1 4 0v5-1V8a2 2 0 0 1 4 0v7c0 4-3 6-7 6h-2c-3 0-5-2-7-5l-2-3a2 2 0 0 1 3-3z"),
"reader-settings": file_shape()+p("M8 12h8M8 16h8")+rect(10,10.5,2,3)+rect(13,14.5,2,3),
"reader-analysis-split": p("M3 4h18v16H3zM12 4v16")+p("M6 8h3M6 12h4M15 8h3M14 12h4")+diamond(12,12,1.3),
}
for name,body in reader_icons.items():
    add("reader",name,body)

# --- Instrument / shell ---
instrument = {
"search": p("M5 5h8v8H5zM12.5 12.5L20 20M17 20h3v-3"),
"new": p("M4 12h7M11 12l4-4M11 12l4 4M18 5v6M15 8h6M18 14v5h-5"),
"delete": p("M6 7h12l-1 13H7zM4 7h16M9 4h6M10 10v7M14 10v7"),
"settings": p("M4 6h16M4 12h16M4 18h16")+rect(7,4.5,3,3)+rect(14,10.5,3,3)+rect(9,16.5,3,3),
"commands": p("M4 5h12M4 11h9M4 17h7M18 14v7M14.5 17.5h7")+rect(3,4,2,2)+rect(3,10,2,2)+rect(3,16,2,2),
"layers": p("M4 8l8-4 8 4-8 4zM4 12l8 4 8-4M4 16l8 4 8-4"),
"timeline": p("M4 12h16M7 8v8M12 5v14M17 9v6")+rect(10.7,3.7,2.6,2.6),
"matrix": p("M5 5h14v14H5zM5 10h14M5 15h14M10 5v14M15 5v14")+rect(10.5,10.5,4,4),
"method": file_shape()+p("M8 12h8M8 16h5")+rect(7,6,3,3),
"inspect": p("M4 5h11v11H4zM12 12l8 8M16 17l1-1M8 8h3M8 11h5"),
"close": p("M5 5l14 14M19 5L5 19"),
"copy": p("M8 5h11v12H8zM5 8H3v13h12v-2")+p("M11 10h5M11 13h4"),
"attach": p("M4 12h8M12 12l4-4M12 12l4 4M19 5v14M16 8h6M16 16h6"),
"tag": p("M4 4h8l8 8-8 8-8-8z")+circle(8,8,1.5),
"sort": p("M5 6h10M5 12h7M5 18h4M18 5v14M15 16l3 3 3-3"),
"filter": p("M4 5h16l-6 7v6l-4 2v-8z"),
"import": file_shape()+p("M12 10v7M9 14l3 3 3-3"),
"export": file_shape()+p("M12 17v-7M9 13l3-3 3 3"),
"bookmark": p("M7 4h10v16l-5-4-5 4z"),
"info": circle(12,12,9)+p("M12 10v7M12 7h.1"),
"help": circle(12,12,9)+p("M9 9c0-3 6-3 6 0 0 3-3 3-3 5M12 19h.1"),
"history": circle(12,12,8)+p("M12 7v5l4 2M4 6v5h5"),
"undo": p("M9 7H4v-5M4 7c2-3 5-4 8-4 5 0 9 4 9 9s-4 9-9 9"),
"redo": p("M15 7h5v-5M20 7c-2-3-5-4-8-4-5 0-9 4-9 9s4 9 9 9"),
"more": circle(6,12,1.3)+circle(12,12,1.3)+circle(18,12,1.3),
"key": p("M4 12h10M14 12l4-4M14 12l4 4")+circle(6,12,2),
"legend": p("M4 5h16v14H4z")+diamond(8,9,1.3)+p("M11 9h6")+circle(8,15,1.3)+p("M11 15h6"),
"attention-filter": p("M4 5h16l-6 7v6l-4 2v-8z")+diamond(12,8,1.5),
"overlay": p("M4 8l8-4 8 4-8 4zM4 13l8 4 8-4")+p("M18 16v5M15.5 18.5h5"),
"pane-split": p("M3 4h18v16H3zM12 4v16"),
"inspector-pane": p("M3 4h18v16H3zM16 4v16")+p("M18 8h2M18 12h2M18 16h2"),
"source-pane": p("M3 4h18v16H3zM9 4v16")+p("M5 8h2M5 12h2M5 16h2"),
}
for name,body in instrument.items():
    add("instrument",name,body)

# --- Interaction / status marks ---
status = {
"hover-trace": p("M4 12h16")+p("M8 9l4 3-4 3")+p("M16 9l-4 3 4 3"),
"inspect-selected": p("M4 9V4h5M15 4h5v5M20 15v5h-5M9 20H4v-5")+rect(8,8,8,8),
"focus-frame": p("M3 8V3h5M16 3h5v5M21 16v5h-5M8 21H3v-5")+diamond(12,12,2),
"keyboard-focus": rect(5,5,14,14)+p("M8 3h8M8 21h8M3 8v8M21 8v8"),
"collapsed": p("M4 6h8l4 6-4 6H4")+p("M18 9v6"),
"filtered": p("M4 5h16l-6 7v6l-4 2v-8z")+p("M3 3l18 18"),
"generalized": p("M4 5h6v6H4zM14 5h6v6h-6zM9 14h6v6H9z")+p("M10 8h4M12 10v4"),
"hidden-descendants": p("M5 4v16M5 12h7")+p("M12 9v6")+circle(16,12,1)+circle(19,12,1)+circle(22,12,1),
"review-needed": p("M4 5h16v14H4z")+p("M12 8v5M12 16h.1"),
"new-state": rect(5,5,14,14)+p("M12 8v8M8 12h8"),
"dirty-state": rect(5,5,14,14)+p("M8 16l8-8")+circle(16,8,1.4),
"linked": p("M4 8v8h6M20 8v8h-6M9 12h6")+diamond(12,12,1.3),
"detached": p("M4 8v8h6M20 8v8h-6")+p("M9 9l6 6M15 9l-6 6"),
"unknown": rect(5,5,14,14)+p("M9 9c0-3 6-3 6 0 0 3-3 3-3 5M12 17h.1"),
"disputed": rect(5,5,14,14)+p("M8 8l8 8M16 8l-8 8"),
"superseded": rect(5,5,14,14)+p("M4 19h16M17 16l3 3-3 3"),
"retracted": rect(5,5,14,14)+p("M4 4l16 16"),
}
for name,body in status.items():
    add("status",name,body)

# --- Brand/mark research variants ---
marks = {
"mark-trace-junction": p("M3 6h5l4 6M3 12h9M3 18h5l4-6M12 12h4M16 12l5-5M16 12l5 5")+diamond(12,12,2),
"mark-open-divergence": p("M3 6h5l4 6M3 12h9M3 18h5l4-6M12 12h4M16 12l5-5M16 12l5 5")+diamond(12,12,2)+p("M20 6h2v3M20 15h2v3"),
"mark-compact": p("M4 7h4l4 5M4 12h8M4 17h4l4-5M12 12h3M15 12l5-5M15 12l5 5")+diamond(12,12,1.8),
"mark-axis": p("M3 6h6l3 6M3 12h9M3 18h6l3-6M12 12h9")+diamond(12,12,2),
"mark-probe": p("M3 12h8l4-4M11 12l4 4")+diamond(11,12,2)+p("M15 8h6M18 5l3 3-3 3M15 16h6M18 13l3 3-3 3"),
"mark-branch": p("M4 4v16M4 9h6l4-4h6M4 15h7l4 4h5")+diamond(11,15,1.7),
"mark-spine": p("M5 4v16M5 8h7l4-4h4M5 16h7l4 4h4")+diamond(12,12,1.8)+p("M12 8v8"),
"mark-cartographic": p("M4 4h16v16H4z")+p("M7 12h5l3-4h3M12 12l3 4h3")+diamond(12,12,1.5),
"mark-source-analysis": p("M3 4h8v16H3zM13 4h8v16h-8z")+p("M7 8h2M7 12h2M15 12h4")+diamond(12,12,1.8),
"mark-junction-only": p("M4 6h5l3 6M4 12h8M4 18h5l3-6M12 12h8")+diamond(12,12,2.4),
"mark-diverge-only": p("M4 12h7M11 12l5-6h4M11 12l5 6h4")+diamond(11,12,2),
"mark-trace-only": p("M5 4v16M5 12h6l4-4h4M15 16h4")+diamond(11,12,2),
}
for name,body in marks.items():
    add("marks",name,body)

# --- Systematic micro-variants for research (stroke/terminal/geometry comparisons) ---
# These intentionally duplicate semantics with small geometry variations.
for idx,(name,left,right,mid) in enumerate(rel_kinds):
    base = line_terminals(left=left,right=right)+mid
    add("variants",f"{name}-a",base)
    add("variants",f"{name}-b",base+p("M6 10v4M18 10v4"))
    add("variants",f"{name}-c",base+circle(12,12,1.2))
for name,body in list(structure_icons.items())[:14]:
    add("variants",f"{name}-a",body)
    add("variants",f"{name}-b",body+p("M3 22h18"))
for name,body in list(reader_icons.items())[:12]:
    add("variants",f"{name}-a",body)
    add("variants",f"{name}-b",body+diamond(20,4,1.2))

# write files
for rel_path,content in GLYPHS.items():
    path = OUT / rel_path
    path.parent.mkdir(parents=True, exist_ok=True)
    path.write_text(content, encoding="utf-8")

# catalog metadata
catalog = []
for rel_path,content in sorted(GLYPHS.items()):
    cat = rel_path.split("/",1)[0]
    name = Path(rel_path).stem
    catalog.append({"category":cat,"name":name,"path":rel_path})
(OUT/"catalog.json").write_text(json.dumps(catalog, indent=2), encoding="utf-8")

# HTML browser catalog
cats = {}
for item in catalog:
    cats.setdefault(item["category"],[]).append(item)
html = ['<!doctype html><meta charset="utf-8"><title>Catalyst SVG code pass 01</title>',
'<style>body{font:14px system-ui;background:#101716;color:#d7e0df;margin:24px}h1,h2{font-weight:600}.grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(120px,1fr));gap:10px}.card{border:1px solid #2c3a39;padding:10px;min-height:100px;background:#151e1d}.card img{width:42px;height:42px;display:block;margin:2px 0 10px}.name{font:11px ui-monospace,monospace;color:#91a3a1;word-break:break-word}.count{color:#5fa7a0}</style>',
f'<h1>Catalyst SVG code pass 01 <span class="count">{len(catalog)} glyphs</span></h1>',
'<p>Research library. Monochrome-first coded SVGs. Variants intentionally overlap.</p>']
for cat,items in cats.items():
    html.append(f'<h2>{escape(cat)} <span class="count">{len(items)}</span></h2><div class="grid">')
    for item in items:
        html.append(f'<div class="card"><img src="{escape(item["path"])}" alt=""><div class="name">{escape(item["name"])}</div></div>')
    html.append('</div>')
(OUT/"catalog.html").write_text("\n".join(html), encoding="utf-8")

# contact sheets as standalone SVGs by category; each embeds icon source bodies.
for cat,items in cats.items():
    cols=8
    cellw,cellh=120,86
    rows=(len(items)+cols-1)//cols
    out=[f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {cols*cellw} {rows*cellh}" width="{cols*cellw}" height="{rows*cellh}">',
         '<rect width="100%" height="100%" fill="#101716"/>',
         '<style>text{font-family:ui-monospace,monospace;font-size:9px;fill:#91A3A1}.cell{fill:#151E1D;stroke:#2C3A39}.icon{color:#D7E0DF}</style>']
    for i,item in enumerate(items):
        x=(i%cols)*cellw; y=(i//cols)*cellh
        raw=GLYPHS[item["path"]]
        inner=re.sub(r'^<svg[^>]*>|</svg>$','',raw)
        inner=re.sub(r'<title>.*?</title>','',inner)
        out.append(f'<rect class="cell" x="{x+3}" y="{y+3}" width="{cellw-6}" height="{cellh-6}"/>')
        out.append(f'<g transform="translate({x+45} {y+10}) scale(1.25)">{inner}</g>')
        out.append(f'<text x="{x+7}" y="{y+73}">{escape(item["name"])}</text>')
    out.append('</svg>')
    (OUT/f"contact-{cat}.svg").write_text("".join(out), encoding="utf-8")

# README / manifest
readme = f"""# Catalyst SVG Code Pass 01

Generated: 2026-09-13
Count: {len(catalog)} standalone SVG glyphs.

Purpose: broad research library for Catalyst's visual language. This pass intentionally includes overlap and near-duplicates so the product/UI pass can compare geometry before freezing the symbol grammar.

Principles used:
- 24x24, square caps, miter joins, mostly 1.55 stroke.
- geometry must survive monochrome and reduction.
- structural branches are visually distinct from semantic relationships.
- source/evidence/provenance receive dedicated trace/anchor grammar.
- interaction state is separate from analytical state.
- unresolved/open continuation uses open terminals rather than generic warning color.
- Catalyst mark variants derive from trace + junction + divergence/probe geometry.
- variants/ contains intentional alternatives and duplicates.

Browse `catalog.html` or category `contact-*.svg` sheets. `catalog.json` is machine-readable.
"""
(OUT/"README.md").write_text(readme, encoding="utf-8")

# validate XML
errors=[]
for rel_path in GLYPHS:
    try:
        ET.parse(OUT/rel_path)
    except Exception as e:
        errors.append((rel_path,str(e)))
if errors:
    raise SystemExit("XML validation failed: "+repr(errors[:10]))

# summary
print(f"generated={len(catalog)}")
for cat,items in cats.items():
    print(f"{cat}={len(items)}")
print(f"out={OUT}")
