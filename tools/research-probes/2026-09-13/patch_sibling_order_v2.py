from pathlib import Path
root = Path(r'C:\Users\iris\Downloads\Catalyst')

def rep(rel, old, new):
    p = root / rel
    s = p.read_text()
    if old not in s:
        raise SystemExit(f'missing in {rel}: {old[:100]!r}')
    p.write_text(s.replace(old, new, 1))

# Normalize legacy/partial sibling order after parent repair so persisted maps
# never let a newly ordered child jump ahead of older unordered siblings.
rep('src/domain/mapView.ts',
'''function breakParentCycles(occurrences: Record<string, MapOccurrence>): void {''',
'''function normalizeSiblingOrders(occurrences: Record<string, MapOccurrence>, notes: Record<string, Note>): void {
  const groups = new Map<string, MapOccurrence[]>();
  for (const occurrence of Object.values(occurrences)) {
    const key = occurrence.parentNoteId ?? "";
    const group = groups.get(key) ?? [];
    group.push(occurrence);
    groups.set(key, group);
  }
  for (const group of groups.values()) {
    group.sort((a, b) => {
      if (a.siblingOrder != null && b.siblingOrder != null && a.siblingOrder !== b.siblingOrder) return a.siblingOrder - b.siblingOrder;
      if (a.siblingOrder != null) return -1;
      if (b.siblingOrder != null) return 1;
      const left = notes[a.noteId];
      const right = notes[b.noteId];
      return left.createdAt.localeCompare(right.createdAt) || left.id.localeCompare(right.id);
    });
    group.forEach((occurrence, index) => { occurrence.siblingOrder = index; });
  }
}

function breakParentCycles(occurrences: Record<string, MapOccurrence>): void {''')

rep('src/domain/mapView.ts',
'''  removeInvalidParents(occurrences);
  breakParentCycles(occurrences);

  const focusNoteId =''',
'''  removeInvalidParents(occurrences);
  breakParentCycles(occurrences);
  normalizeSiblingOrders(occurrences, notes);

  const focusNoteId =''')

rep('src/domain/mapView.ts',
'''        noteId: note.id,
        parentNoteId: null,
        siblingOrder: null,
        position: null,''',
'''        noteId: note.id,
        parentNoteId: null,
        siblingOrder: Math.max(-1, ...Object.values(active.occurrences)
          .filter((item) => item.parentNoteId === null)
          .map((item) => item.siblingOrder ?? -1)) + 1,
        position: null,''')

rep('src/domain/workspace.ts',
'''            noteId,
            parentNoteId: null,
            siblingOrder: null,
            position: null,''',
'''            noteId,
            parentNoteId: null,
            siblingOrder: Math.max(-1, ...Object.values(map.occurrences)
              .filter((item) => item.parentNoteId === null)
              .map((item) => item.siblingOrder ?? -1)) + 1,
            position: null,''')

rep('src/domain/workspace.ts',
'''              siblingOrder: action.parentNoteId
                ? Math.max(-1, ...Object.values(map.occurrences)
                    .filter((item) => item.parentNoteId === action.parentNoteId && item.noteId !== action.noteId)
                    .map((item) => item.siblingOrder ?? -1)) + 1
                : null,
              position: null,''',
'''              siblingOrder: Math.max(-1, ...Object.values(map.occurrences)
                .filter((item) => item.parentNoteId === action.parentNoteId && item.noteId !== action.noteId)
                .map((item) => item.siblingOrder ?? -1)) + 1,
              position: null,''')

# Preserve explicit order across the map -> Working Picture branch projection.
rep('src/map/layout.ts',
'''  const visibleIds = new Set(nodes.map((node) => node.note.id));
  const structuralBranches: StructuralBranch[] = nodes
    .filter((node) => node.parentNoteId && visibleIds.has(node.parentNoteId))
    .map((node) => ({
      id: `branch:${node.parentNoteId}:${node.note.id}`,
      fromNoteId: node.parentNoteId!,
      toNoteId: node.note.id,
      side: node.side,
      depth: node.depth,
    }));''',
'''  const visibleIds = new Set(nodes.map((node) => node.note.id));
  const nodeById = new Map(nodes.map((node) => [node.note.id, node]));
  const structuralBranches: StructuralBranch[] = [];
  for (const [parentId, childIds] of children) {
    if (!visibleIds.has(parentId)) continue;
    for (const childId of childIds) {
      const child = nodeById.get(childId);
      if (!child) continue;
      structuralBranches.push({
        id: `branch:${parentId}:${childId}`,
        fromNoteId: parentId,
        toNoteId: childId,
        side: child.side,
        depth: child.depth,
      });
    }
  }''')# Regression: legacy null orders normalize deterministically, while authored order
# reaches the Working Picture instead of being re-sorted by note timestamps.
p = root / 'scripts/test-map.mjs'
s = p.read_text()
needle = '''  assert.equal(seededMap.occurrences.a.position, null);\n'''
addition = '''  assert.equal(seededMap.occurrences.a.position, null);\n\n  const legacySiblingMap = mapView.sanitizeMapView({\n    activeMapId: "legacy-order",\n    maps: {\n      "legacy-order": { id: "legacy-order", name: "Legacy", focusNoteId: "a", camera: { x: 0, y: 0, zoom: 1 }, occurrences: {\n        a: { noteId: "a", parentNoteId: null, position: null, collapsed: false, manual: false },\n        b: { noteId: "b", parentNoteId: "a", position: null, collapsed: false, manual: false },\n        d: { noteId: "d", parentNoteId: "a", position: null, collapsed: false, manual: false },\n      } },\n    },\n  }, notes);\n  assert.equal(legacySiblingMap.maps["legacy-order"].occurrences.b.siblingOrder, 0, "legacy sibling order must hydrate from stable note order");\n  assert.equal(legacySiblingMap.maps["legacy-order"].occurrences.d.siblingOrder, 1, "legacy sibling order migration must remain deterministic");\n'''
if needle not in s:
    raise SystemExit('legacy test insertion point missing')
s = s.replace(needle, addition, 1)
needle2 = '''  assert.equal(orderedProjection.nodes.find((item) => item.note.id === "b").side, -1, "second authored sibling must follow the explicit order into the opposite branch side");\n'''
addition2 = needle2 + '''  const orderedPicture = pictureLayout.workingPictureLayout(state);\n  assert.ok(orderedPicture.nodes.find((item) => item.note.id === "e").position.x < orderedPicture.nodes.find((item) => item.note.id === "b").position.x, "Working Picture territory layout must consume authored sibling order");\n'''
if needle2 not in s:
    raise SystemExit('picture order test insertion point missing')
p.write_text(s.replace(needle2, addition2, 1))
print('v2 patched')