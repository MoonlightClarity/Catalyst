from pathlib import Path

workspace = Path(r"C:\Users\iris\Downloads\Catalyst\src\features\analysis\WorkingPictureWorkspace.tsx")
text = workspace.read_text(encoding="utf-8")
text = text.replace(
'''              const connectSource = connectingFromId === node.note.id;\n              const documentName = node.primaryAnnotation''',
'''              const connectSource = connectingFromId === node.note.id;\n              const confidence = state.noteSemantics[node.note.id]?.confidence ?? null;\n              const confidenceKey = confidence ?? "unspecified";\n              const documentName = node.primaryAnnotation''',
1,
)
text = text.replace(
'''                    `territory-${node.territory}`,\n                    node.isFocus ? "is-focus" : "",''',
'''                    `territory-${node.territory}`,\n                    enabledCapabilities.confidence ? `confidence-${confidenceKey}` : "",\n                    node.isFocus ? "is-focus" : "",''',
1,
)
text = text.replace(
'''                    aria-pressed={active}\n                    title={title}\n                  >''',
'''                    aria-pressed={active}\n                    aria-label={enabledCapabilities.confidence ? `${title}; confidence ${confidence ?? "not specified"}` : title}\n                    title={title}\n                  >''',
1,
)
text = text.replace(
'''                    {node.sourceCount > 0 && !(node.primaryAnnotation && node.territory === "observed") && (\n                      <span className="picture-inline-trace"><EvidenceTraceMark count={node.sourceCount} /></span>\n                    )}''',
'''                    {enabledCapabilities.confidence && (\n                      <span className="picture-confidence" aria-hidden="true" title={`Confidence: ${confidence ?? "not specified"}`}>\n                        <i /><i /><i />\n                      </span>\n                    )}\n                    {node.sourceCount > 0 && !(node.primaryAnnotation && node.territory === "observed") && (\n                      <span className="picture-inline-trace"><EvidenceTraceMark count={node.sourceCount} /></span>\n                    )}''',
1,
)
text = text.replace(
'''<text className="picture-relation-label" x={(from.x + to.x) / 2} y={(from.y + to.y) / 2 - 34} textAnchor="middle">{label}</text>''',
'''<text className={`picture-relation-label relationship-${edge.relationshipType}`} x={(from.x + to.x) / 2} y={(from.y + to.y) / 2 - 34} textAnchor="middle">{label}</text>''',
1,
)
workspace.write_text(text, encoding="utf-8")

styles = Path(r"C:\Users\iris\Downloads\Catalyst\src\styles.css")
css = styles.read_text(encoding="utf-8")
insert_after = '''.picture-inline-trace { position: absolute; right: -1px; top: 10px; color: #436e67; }'''
confidence_css = '''\n.picture-confidence { position: absolute; right: 3px; top: 4px; width: 12px; height: 11px; display: flex; align-items: flex-end; gap: 2px; color: #858b86; opacity: 0.94; }\n.picture-confidence i { width: 2px; background: currentColor; opacity: 0.18; }\n.picture-confidence i:nth-child(1) { height: 4px; }\n.picture-confidence i:nth-child(2) { height: 7px; }\n.picture-confidence i:nth-child(3) { height: 10px; }\n.confidence-low .picture-confidence { color: #91675d; }\n.confidence-low .picture-confidence i:first-child { opacity: 1; }\n.confidence-medium .picture-confidence { color: #9a7d48; }\n.confidence-medium .picture-confidence i:nth-child(-n+2) { opacity: 1; }\n.confidence-high .picture-confidence { color: #3f756a; }\n.confidence-high .picture-confidence i { opacity: 1; }\n.confidence-unspecified .picture-confidence { width: 7px; height: 7px; top: 5px; right: 5px; border: 1.5px solid currentColor; border-radius: 50%; }\n.confidence-unspecified .picture-confidence i { display: none; }'''
css = css.replace(insert_after, insert_after + confidence_css, 1)
css = css.replace(
'''.picture-semantic-relation.relationship-supports { stroke: #476c63; stroke-dasharray: 9 3; }\n.picture-semantic-relation.relationship-contradicts { stroke: #875b51; stroke-dasharray: 5 3 1 3; }\n.picture-semantic-relation.relationship-depends-on { stroke-dasharray: 2 4; }\n.picture-semantic-relation.relationship-derived-from { stroke: #5b7670; stroke-dasharray: 10 4; }\n.picture-semantic-relation.relationship-about { stroke: #7b817d; stroke-dasharray: 1 5; }\n.picture-semantic-relation.relationship-precedes { stroke: #5c7180; stroke-dasharray: 12 4; }''',
'''.picture-semantic-relation.relationship-supports { stroke: #367568; stroke-width: 1.55; stroke-dasharray: none; }\n.picture-semantic-relation.relationship-contradicts { stroke: #985447; stroke-width: 1.6; stroke-dasharray: 5 2 1 2; }\n.picture-semantic-relation.relationship-depends-on { stroke: #756b91; stroke-width: 1.3; stroke-dasharray: 2 4; }\n.picture-semantic-relation.relationship-derived-from { stroke: #4c7181; stroke-width: 1.35; stroke-dasharray: 10 3 2 3; }\n.picture-semantic-relation.relationship-about { stroke: #777f79; stroke-width: 1.15; stroke-dasharray: 1 5; }\n.picture-semantic-relation.relationship-precedes { stroke: #456d91; stroke-width: 1.45; stroke-dasharray: 12 3; }''',
1,
)
css = css.replace(
'''.picture-relation-label {\n  fill: #5f6863;''',
'''.picture-relation-label {\n  fill: #5f6863;''',
1,
)
label_anchor = '''  text-transform: uppercase;\n}\n\n.picture-occurrence {'''
label_css = '''  text-transform: uppercase;\n}\n.picture-relation-label.relationship-supports { fill: #316b60; }\n.picture-relation-label.relationship-contradicts { fill: #8f4d41; }\n.picture-relation-label.relationship-depends-on { fill: #6d6288; }\n.picture-relation-label.relationship-derived-from { fill: #446b7a; }\n.picture-relation-label.relationship-about { fill: #6f7771; }\n.picture-relation-label.relationship-precedes { fill: #3f6688; }\n\n.picture-occurrence {'''
css = css.replace(label_anchor, label_css, 1)
dark_old = '''.context-pane[data-context-mode="graph"] .picture-semantic-relation { stroke: #91a09c; }\n.context-pane[data-context-mode="graph"] .picture-relation-label {\n  fill: #aab8b4;\n  stroke: #101718;\n}'''
dark_new = '''.context-pane[data-context-mode="graph"] .picture-semantic-relation { stroke: #91a09c; }\n.context-pane[data-context-mode="graph"] .picture-semantic-relation.relationship-supports { stroke: #74b6a9; }\n.context-pane[data-context-mode="graph"] .picture-semantic-relation.relationship-contradicts { stroke: #d17b69; }\n.context-pane[data-context-mode="graph"] .picture-semantic-relation.relationship-depends-on { stroke: #aaa1d0; }\n.context-pane[data-context-mode="graph"] .picture-semantic-relation.relationship-derived-from { stroke: #79a8b9; }\n.context-pane[data-context-mode="graph"] .picture-semantic-relation.relationship-about { stroke: #a6afaa; }\n.context-pane[data-context-mode="graph"] .picture-semantic-relation.relationship-precedes { stroke: #76a3cf; }\n.context-pane[data-context-mode="graph"] .picture-relation-label { fill: #aab8b4; stroke: #101718; }\n.context-pane[data-context-mode="graph"] .picture-relation-label.relationship-supports { fill: #8bc8bd; }\n.context-pane[data-context-mode="graph"] .picture-relation-label.relationship-contradicts { fill: #df8d7c; }\n.context-pane[data-context-mode="graph"] .picture-relation-label.relationship-depends-on { fill: #bab2dc; }\n.context-pane[data-context-mode="graph"] .picture-relation-label.relationship-derived-from { fill: #91b9c7; }\n.context-pane[data-context-mode="graph"] .picture-relation-label.relationship-about { fill: #b6c0bb; }\n.context-pane[data-context-mode="graph"] .picture-relation-label.relationship-precedes { fill: #8eb4d8; }\n.context-pane[data-context-mode="graph"] .confidence-low .picture-confidence { color: #d18777; }\n.context-pane[data-context-mode="graph"] .confidence-medium .picture-confidence { color: #d0ad69; }\n.context-pane[data-context-mode="graph"] .confidence-high .picture-confidence { color: #7ab8ad; }\n.context-pane[data-context-mode="graph"] .confidence-unspecified .picture-confidence { color: #879693; }'''
if dark_old not in css:
    raise SystemExit("dark semantic block not found")
css = css.replace(dark_old, dark_new, 1)
styles.write_text(css, encoding="utf-8")
print("patched confidence and semantic visuals")
