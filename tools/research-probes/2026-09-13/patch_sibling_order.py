from pathlib import Path
root=Path(r'C:\Users\iris\Downloads\Catalyst')

def rep(path, old, new):
    p=root/path; s=p.read_text()
    if old not in s: raise SystemExit(f'missing in {path}: {old[:80]}')
    p.write_text(s.replace(old,new,1))

rep(Path('src/domain/types.ts'), '  parentNoteId: string | null;\n  position: GraphPoint | null;', '  parentNoteId: string | null;\n  siblingOrder: number | null;\n  position: GraphPoint | null;')
rep(Path('src/domain/mapView.ts'), '    position,\n    collapsed:', '    siblingOrder: Number.isFinite(candidate.siblingOrder) ? Number(candidate.siblingOrder) : null,\n    position,\n    collapsed:')
rep(Path('src/domain/mapView.ts'), '        parentNoteId: null,\n        position: null,', '        parentNoteId: null,\n        siblingOrder: null,\n        position: null,')
rep(Path('src/domain/workspace.ts'), '  | { type: "map/occurrence-parented"; noteId: string; parentNoteId: string | null }', '  | { type: "map/occurrence-parented"; noteId: string; parentNoteId: string | null }\n  | { type: "map/occurrence-reordered"; noteId: string; targetNoteId: string; placement: "before" | "after" }')
rep(Path('src/domain/workspace.ts'), '            parentNoteId: null,\n            position: null,', '            parentNoteId: null,\n            siblingOrder: null,\n            position: null,')
rep(Path('src/map/layout.ts'), '    ids.sort((a, b) => noteOrder(notes[a], notes[b]));', '    ids.sort((a, b) => {\n      const ao = map.occurrences[a]?.siblingOrder;\n      const bo = map.occurrences[b]?.siblingOrder;\n      if (ao !== null && ao !== undefined && bo !== null && bo !== undefined && ao !== bo) return ao - bo;\n      if (ao !== null && ao !== undefined) return -1;\n      if (bo !== null && bo !== undefined) return 1;\n      return noteOrder(notes[a], notes[b]);\n    });')
rep(Path('src/domain/workspace.ts'), '              parentNoteId: action.parentNoteId,\n              position: null,', '              parentNoteId: action.parentNoteId,\n              siblingOrder: action.parentNoteId\n                ? Math.max(-1, ...Object.values(map.occurrences)\n                    .filter((item) => item.parentNoteId === action.parentNoteId && item.noteId !== action.noteId)\n                    .map((item) => item.siblingOrder ?? -1)) + 1\n                : null,\n              position: null,')
insert='''\n    case "map/occurrence-reordered":\n      return updateActiveMap(state, (map) => {\n        const occurrence = map.occurrences[action.noteId];\n        const target = map.occurrences[action.targetNoteId];\n        if (!occurrence || !target || occurrence.noteId === target.noteId || occurrence.parentNoteId !== target.parentNoteId) return map;\n        const siblings = Object.values(map.occurrences)\n          .filter((item) => item.parentNoteId === occurrence.parentNoteId)\n          .sort((a, b) => (a.siblingOrder ?? Number.MAX_SAFE_INTEGER) - (b.siblingOrder ?? Number.MAX_SAFE_INTEGER) || a.noteId.localeCompare(b.noteId));\n        const ids = siblings.map((item) => item.noteId).filter((id) => id !== occurrence.noteId);\n        const targetIndex = ids.indexOf(target.noteId);\n        ids.splice(action.placement === "before" ? targetIndex : targetIndex + 1, 0, occurrence.noteId);\n        const occurrences = { ...map.occurrences };\n        ids.forEach((id, index) => { occurrences[id] = { ...occurrences[id], siblingOrder: index }; });\n        return { ...map, occurrences };\n      });\n'''
rep(Path('src/domain/workspace.ts'), '    case "map/occurrence-positioned": {', insert+'\n    case "map/occurrence-positioned": {')
print('patched')
# Preserve explicit order in the exported helper too.
p=root/'src/map/layout.ts'; s=p.read_text()
old='''  return Object.values(map.occurrences)\n    .filter((occurrence) => occurrence.parentNoteId === noteId)\n    .map((occurrence) => occurrence.noteId)\n    .filter((id) => state.notes[id] && !state.notes[id].deletedAt)\n    .sort((a, b) => noteOrder(state.notes[a], state.notes[b]));'''
new='''  return Object.values(map.occurrences)\n    .filter((occurrence) => occurrence.parentNoteId === noteId)\n    .filter((occurrence) => state.notes[occurrence.noteId] && !state.notes[occurrence.noteId].deletedAt)\n    .sort((a, b) => {\n      if (a.siblingOrder !== null && b.siblingOrder !== null && a.siblingOrder !== b.siblingOrder) return a.siblingOrder - b.siblingOrder;\n      if (a.siblingOrder !== null) return -1;\n      if (b.siblingOrder !== null) return 1;\n      return noteOrder(state.notes[a.noteId], state.notes[b.noteId]);\n    })\n    .map((occurrence) => occurrence.noteId);'''
if old not in s: raise SystemExit('helper snippet missing')
p.write_text(s.replace(old,new,1))
print('helper patched')
# Add focused regression for authored sibling order.
p=root/'scripts/test-map.mjs'; s=p.read_text()
needle='''  assert.equal(mapLayout.mapParentForNote(state, "c"), "b");\n'''
addition='''  assert.equal(mapLayout.mapParentForNote(state, "c"), "b");\n\n  state = workspace.workspaceReducer(state, { type: "note/created", note: note("e", 5, "Later sibling") });\n  state = workspace.workspaceReducer(state, { type: "map/occurrence-parented", noteId: "e", parentNoteId: "a" });\n  assert.deepEqual(mapLayout.mapChildrenForNote(state, "a"), ["b", "e"], "new siblings append to authored structural order");\n  state = workspace.workspaceReducer(state, { type: "map/occurrence-reordered", noteId: "e", targetNoteId: "b", placement: "before" });\n  assert.deepEqual(mapLayout.mapChildrenForNote(state, "a"), ["e", "b"], "explicit sibling reorder must persist independently of note creation time");\n  const orderedProjection = mapLayout.analysisMapLayout(state);\n  assert.ok(orderedProjection.nodes.find((item) => item.note.id === "e").position.y < orderedProjection.nodes.find((item) => item.note.id === "b").position.y, "automatic portrayal must consume authored sibling order");\n'''
if needle not in s: raise SystemExit('test insertion point missing')
p.write_text(s.replace(needle,addition,1))
print('tests patched')
# Backfill explicit null siblingOrder in hand-authored test fixtures only when needed by TS structural typing.
print('done')
# Make the new field backward-compatible for existing object literals while persistence hydrates null.
p=root/'src/domain/types.ts'; s=p.read_text(); s=s.replace('  siblingOrder: number | null;','  siblingOrder?: number | null;',1); p.write_text(s)
# Normalize helper checks for optional values.
p=root/'src/map/layout.ts'; s=p.read_text(); s=s.replace('if (a.siblingOrder !== null && b.siblingOrder !== null && a.siblingOrder !== b.siblingOrder) return a.siblingOrder - b.siblingOrder;\n      if (a.siblingOrder !== null) return -1;\n      if (b.siblingOrder !== null) return 1;', 'if (a.siblingOrder != null && b.siblingOrder != null && a.siblingOrder !== b.siblingOrder) return a.siblingOrder - b.siblingOrder;\n      if (a.siblingOrder != null) return -1;\n      if (b.siblingOrder != null) return 1;',1); p.write_text(s)
