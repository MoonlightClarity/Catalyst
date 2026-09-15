from pathlib import Path

workspace = Path(r"C:\Users\iris\Downloads\Catalyst\src\features\analysis\WorkingPictureWorkspace.tsx")
text = workspace.read_text(encoding="utf-8")
old = '''  const activeRevealId = hoveredNoteId ?? state.activeNoteId ?? layout.focusNoteId;
  const visibleSemanticEdges = useMemo(() => {
    if (!activeRevealId) return [];
    return layout.semanticEdges.filter((edge) => edge.fromNoteId === activeRevealId || edge.toNoteId === activeRevealId);
  }, [activeRevealId, layout.semanticEdges]);
'''
new = '''  const activeRevealId = hoveredNoteId ?? state.activeNoteId ?? layout.focusNoteId;
  const visibleSemanticEdges = useMemo(() => {
    if (!activeRevealId) return [];
    return layout.semanticEdges.filter((edge) => edge.fromNoteId === activeRevealId || edge.toNoteId === activeRevealId);
  }, [activeRevealId, layout.semanticEdges]);

  const attentionRevealId = hoveredNoteId ?? (state.activeNoteId && state.activeNoteId !== layout.focusNoteId ? state.activeNoteId : null);
  const attentionNoteIds = useMemo(() => {
    if (!attentionRevealId || !nodeById.has(attentionRevealId)) return null;
    const ids = new Set<string>([attentionRevealId]);
    const parentId = mapParentForNote(state, attentionRevealId);
    if (parentId && nodeById.has(parentId)) ids.add(parentId);
    for (const childId of mapChildrenForNote(state, attentionRevealId)) if (nodeById.has(childId)) ids.add(childId);
    for (const edge of layout.semanticEdges) {
      if (edge.fromNoteId === attentionRevealId) ids.add(edge.toNoteId);
      if (edge.toNoteId === attentionRevealId) ids.add(edge.fromNoteId);
    }
    return ids;
  }, [attentionRevealId, layout.semanticEdges, nodeById, state]);
'''
if old not in text: raise SystemExit("attention anchor not found")
text = text.replace(old, new, 1)
workspace.write_text(text, encoding="utf-8")

text = workspace.read_text(encoding="utf-8")
old_branch = '''                return <path key={branch.id} d={branchPath(from, to, child.territory)} className={`picture-branch territory-${child.territory} depth-${Math.min(branch.depth, 4)}`} />;
'''
new_branch = '''                const attentionDimmed = Boolean(attentionNoteIds && !(attentionNoteIds.has(branch.fromNoteId) && attentionNoteIds.has(branch.toNoteId)));
                return <path key={branch.id} d={branchPath(from, to, child.territory)} className={`picture-branch territory-${child.territory} depth-${Math.min(branch.depth, 4)}${attentionDimmed ? " is-dimmed" : ""}`} />;
'''
if old_branch not in text: raise SystemExit("branch anchor not found")
text = text.replace(old_branch, new_branch, 1)
old_node = '''              const dimmed = query.trim().length > 0 && !matchingNoteIds.has(node.note.id);
'''
new_node = '''              const searchDimmed = query.trim().length > 0 && !matchingNoteIds.has(node.note.id);
              const attentionDimmed = Boolean(attentionNoteIds && !attentionNoteIds.has(node.note.id));
              const dimmed = searchDimmed || attentionDimmed;
'''
if old_node not in text: raise SystemExit("node dim anchor not found")
text = text.replace(old_node, new_node, 1)
workspace.write_text(text, encoding="utf-8")

styles = Path(r"C:\Users\iris\Downloads\Catalyst\src\styles.css")
css = styles.read_text(encoding="utf-8")
old_css = '''.picture-branch.territory-periphery { stroke: #a0a39c; stroke-dasharray: 3 5; opacity: 0.42; }
'''
new_css = old_css + '''.picture-branch { transition: opacity 160ms ease; }
.picture-branch.is-dimmed { opacity: 0.1; }
'''
if old_css not in css: raise SystemExit("base branch css anchor not found")
css = css.replace(old_css, new_css, 1)
old_dark = '''.context-pane[data-context-mode="graph"] .picture-branch.territory-periphery { stroke: #65716f; }
'''
new_dark = old_dark + '''.context-pane[data-context-mode="graph"] .picture-branch.is-dimmed { opacity: 0.11; }
'''
if old_dark not in css: raise SystemExit("dark branch css anchor not found")
css = css.replace(old_dark, new_dark, 1)
styles.write_text(css, encoding="utf-8")
print("attention filter patched")
