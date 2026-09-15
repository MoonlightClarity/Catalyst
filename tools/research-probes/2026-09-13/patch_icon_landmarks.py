from pathlib import Path
root = Path(r'C:\Users\iris\Downloads\Catalyst')

def replace(rel, old, new):
    p = root / rel
    s = p.read_text(encoding='utf-8')
    if old not in s:
        raise SystemExit(f'missing snippet in {rel}: {old[:90]}')
    p.write_text(s.replace(old, new, 1), encoding='utf-8')

replace('src/ui/CatalystSymbols.tsx',
'''  | "forward"\n  | "close"''',
'''  | "forward"\n  | "reorder-before"\n  | "reorder-after"\n  | "close"''')

replace('src/ui/CatalystSymbols.tsx',
'''    case "forward":\n      return <svg {...baseSvgProps} className={cls}><path d="M4 6h11V3l6 6-6 6v-3H7" /><path d="M7 12v5" /></svg>;\n    case "close":''',
'''    case "forward":\n      return <svg {...baseSvgProps} className={cls}><path d="M4 6h11V3l6 6-6 6v-3H7" /><path d="M7 12v5" /></svg>;\n    case "reorder-before":\n      return <svg {...baseSvgProps} className={cls}><path d="M4 7h9M4 12h9M4 17h9" /><path d="M18 19V6M14.5 9.5L18 6l3.5 3.5" /><rect x="3" y="5.8" width="2.4" height="2.4" /></svg>;\n    case "reorder-after":\n      return <svg {...baseSvgProps} className={cls}><path d="M4 7h9M4 12h9M4 17h9" /><path d="M18 5v13M14.5 14.5L18 18l3.5-3.5" /><rect x="3" y="15.8" width="2.4" height="2.4" /></svg>;\n    case "close":''')
replace('src/features/notes/NoteInspector.tsx',
'''import { AnalyticalRoleMark, EvidenceTraceMark, InstrumentGlyph } from "../../ui/CatalystSymbols";''',
'''import { AnalyticalGlyph, EvidenceTraceMark, InstrumentGlyph, type AnalyticalGlyphKind } from "../../ui/CatalystSymbols";''')

replace('src/features/notes/NoteInspector.tsx',
'''  const words = wordCount(note.body);\n\n  return (''',
'''  const words = wordCount(note.body);\n  const identityRole = showAnalyticalRoles ? semantics.roles[0] ?? "note" : "note";\n  const identityGlyph: AnalyticalGlyphKind = identityRole === "note" ? "thought" : identityRole;\n\n  return (''')

replace('src/features/notes/NoteInspector.tsx',
'''        <div className="inspector-identity">\n          <AnalyticalRoleMark role={showAnalyticalRoles ? semantics.roles[0] ?? "note" : "note"} />\n          <span>{showAnalyticalRoles ? ANALYTICAL_ROLE_LABELS[semantics.roles[0] ?? "note"] : "Node"}</span>\n        </div>''',
'''        <div className="inspector-identity">\n          <AnalyticalGlyph kind={identityGlyph} className="inspector-analytical-glyph" />\n          <span>{showAnalyticalRoles ? ANALYTICAL_ROLE_LABELS[semantics.roles[0] ?? "note"] : "Node"}</span>\n        </div>''')

replace('src/features/analysis/WorkingPictureWorkspace.tsx',
'''<InstrumentGlyph name="back" /></button>}\n                      {nextSiblingId && <button onClick={(event) => { event.stopPropagation(); onReorderOccurrence(node.note.id, nextSiblingId, "after"); }} title="Move later" aria-label="Move branch later"><InstrumentGlyph name="forward" /></button>}''',
'''<InstrumentGlyph name="reorder-before" /></button>}\n                      {nextSiblingId && <button onClick={(event) => { event.stopPropagation(); onReorderOccurrence(node.note.id, nextSiblingId, "after"); }} title="Move later" aria-label="Move branch later"><InstrumentGlyph name="reorder-after" /></button>}''')
