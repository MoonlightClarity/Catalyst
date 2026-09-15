from pathlib import Path
root = Path(r"C:\Users\iris\Downloads\Catalyst")
layout_path = root / "src/picture/layout.ts"
workspace_path = root / "src/features/analysis/WorkingPictureWorkspace.tsx"
layout = layout_path.read_text(encoding="utf-8")
workspace = workspace_path.read_text(encoding="utf-8")
layout = layout.replace("  Annotation,\n", "")
layout = layout.replace('export type WorkingPictureSpecies =\n  | "thought"\n  | "claim"\n  | "assumption"\n  | "hypothesis"\n  | "question"\n  | "entity"\n  | "event";\n\n', "")
layout = layout.replace('export type WorkingPictureNode = {\n  note: Note;\n  position: GraphPoint;\n  parentNoteId: string | null;\n  depth: number;\n  territory: WorkingPictureTerritory;\n  species: WorkingPictureSpecies;\n  isFocus: boolean;\n  isLooseRoot: boolean;\n  collapsed: boolean;\n  childCount: number;\n  hiddenDescendantCount: number;\n  hiddenCrossLinkCount: number;\n  sourceCount: number;\n  primaryAnnotation: Annotation | null;\n  manual: boolean;\n};', 'export type WorkingPictureNode = {\n  note: Note;\n  position: GraphPoint;\n  territory: WorkingPictureTerritory;\n  collapsed: boolean;\n  childCount: number;\n  hiddenDescendantCount: number;\n  hiddenCrossLinkCount: number;\n  manual: boolean;\n};')
layout = layout.replace('function roleFor(state: WorkspaceState, noteId: string): WorkingPictureSpecies {\n  const role = state.noteSemantics[noteId]?.roles[0] ?? "note";\n  switch (role) {\n    case "claim": return "claim";\n    case "assumption": return "assumption";\n    case "hypothesis": return "hypothesis";\n    case "question": return "question";\n    case "entity": return "entity";\n    case "event": return "event";\n    default: return "thought";\n  }\n}', 'function roleFor(state: WorkspaceState, noteId: string) {\n  return state.noteSemantics[noteId]?.roles[0] ?? "note";\n}')
layout = layout.replace('    const sources = annotationsForNote(state, node.note.id);\n    return {\n      note: node.note,\n      position,\n      parentNoteId: node.parentNoteId,\n      depth: auto?.depth ?? node.depth,\n      territory: auto?.territory ?? fallbackTerritory,\n      species: roleFor(state, node.note.id),\n      isFocus: node.note.id === focusId,\n      isLooseRoot: node.isLooseRoot,\n      collapsed: node.collapsed,\n      childCount: node.childCount,\n      hiddenDescendantCount: node.hiddenDescendantCount,\n      hiddenCrossLinkCount: node.hiddenCrossLinkCount,\n      sourceCount: sources.length,\n      primaryAnnotation: sources[0] ?? null,\n      manual: Boolean(occurrence?.manual),\n    };', '    return {\n      note: node.note,\n      position,\n      territory: auto?.territory ?? fallbackTerritory,\n      collapsed: node.collapsed,\n      childCount: node.childCount,\n      hiddenDescendantCount: node.hiddenDescendantCount,\n      hiddenCrossLinkCount: node.hiddenCrossLinkCount,\n      manual: Boolean(occurrence?.manual),\n    };')
workspace = workspace.replace('import { noteDisplayTitle, trimQuote } from "../../shared/display";', 'import { noteDisplayTitle } from "../../shared/display";')
workspace = workspace.replace('  AnalyticalGlyph,\n', '  AnalyticalGlyph,\n  type AnalyticalGlyphKind,\n')
workspace = workspace.replace('} from "../../ui/CatalystSymbols";\n', '} from "../../ui/CatalystSymbols";\nimport { annotationsForNote } from "../../domain/selectors";\n')
start = workspace.index("function EvidenceFragment")
end = workspace.index("export function WorkingPictureWorkspace", start)
helper = '''function glyphForNote(state: WorkspaceState, noteId: string): AnalyticalGlyphKind {
  switch (state.noteSemantics[noteId]?.roles[0]) {
    case "claim": return "claim";
    case "assumption": return "assumption";
    case "hypothesis": return "hypothesis";
    case "question": return "question";
    case "entity": return "entity";
    case "event": return "event";
    default: return "thought";
  }
}'''
workspace = workspace[:start] + helper + "\n\n" + workspace[end:]
workspace = workspace.replace('              const connectSource = connectingFromId === node.note.id;\n              const documentName = node.primaryAnnotation\n                ? state.documents[node.primaryAnnotation.documentId]?.name ?? "Source"\n                : "Source";\n              const title = titleFor(node);', '              const connectSource = connectingFromId === node.note.id;\n              const sourceAnnotations = annotationsForNote(state, node.note.id);\n              const primaryAnnotation = sourceAnnotations[0] ?? null;\n              const sourceCount = sourceAnnotations.length;\n              const glyphKind = glyphForNote(state, node.note.id);\n              const isFocus = layout.focusNoteId === node.note.id;\n              const title = titleFor(node);')
workspace = workspace.replace('                    `species-${node.species}`,\n                    `territory-${node.territory}`,\n                    node.isFocus ? "is-focus" : "",', '                    `species-${glyphKind}`,\n                    `territory-${node.territory}`,\n                    isFocus ? "is-focus" : "",')
