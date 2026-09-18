import { useCallback, useState } from "react";
import type { RelationshipScope, RelationshipType, WorkspaceState } from "../../domain/types";
import { AnalysisOutlineView } from "./AnalysisOutlineView";
import { RelationalView } from "./RelationalView";
export function OutlineWorkspace({
  state,
  onSelectNote,
  onCreateOutlineItem,
  onRenameNote,
  onRenameAnalysis,
  onDeleteNote,
  onSetCollapsed,
  onReorderOutlineItem,
  onOutdentOutlineItem,
  onIndentOutlineItem,
  onCreateRelationship,
  onUpdateRelationship,
  onRetargetRelationship,
  onDeleteRelationship,
  onOpenMethod,
}: {
  state: WorkspaceState;
  onSelectNote: (noteId: string) => void;
  onCreateOutlineItem: (parentPlacementId: string | null) => { noteId: string; placementId: string };
  onRenameNote: (noteId: string, title: string) => void;
  onRenameAnalysis: (name: string) => void;
  onDeleteNote: (noteId: string) => void;
  onSetCollapsed: (placementId: string, collapsed: boolean) => void;
  onReorderOutlineItem: (placementId: string, targetPlacementId: string, placement: "before" | "after") => void;
  onOutdentOutlineItem: (placementId: string) => void;
  onIndentOutlineItem: (placementId: string) => void;
  onCreateRelationship: (scope: RelationshipScope, fromId: string, toId: string, type: RelationshipType) => void;
  onUpdateRelationship: (scope: RelationshipScope, id: string, type: RelationshipType) => void;
  onRetargetRelationship: (scope: RelationshipScope, id: string, fromId: string, toId: string) => void;
  onDeleteRelationship: (scope: RelationshipScope, id: string) => void;
  onOpenMethod: (address: string) => void;
}) {
  const [editingNoteId, setEditingNoteId] = useState<string | null>(null);
  const [editTitle, setEditTitle] = useState("");
  const [relationalViewOpen, setRelationalViewOpen] = useState(false);

  const beginEdit = useCallback((noteId: string) => {
    const note = state.notes[noteId];
    if (!note) return;
    setEditingNoteId(noteId);
    setEditTitle(note.title);
  }, [state.notes]);

  const commitEdit = useCallback((noteId: string) => {
    const note = state.notes[noteId];
    if (note && editTitle !== note.title) onRenameNote(noteId, editTitle);
    setEditingNoteId(null);
  }, [editTitle, onRenameNote, state.notes]);

  const cancelEdit = useCallback((noteId: string) => {
    const note = state.notes[noteId];
    if (note) setEditTitle(note.title);
    setEditingNoteId(null);
  }, [state.notes]);

  const createOutlineItem = useCallback((parentPlacementId: string | null) => {
    const created = onCreateOutlineItem(parentPlacementId);
    setEditingNoteId(created.noteId);
    setEditTitle("");
    return created.placementId;
  }, [onCreateOutlineItem]);

  return (
    <div id="catalyst-surface-outline" className="outline-workspace" data-catalyst-surface="outline" role="region" aria-labelledby="catalyst-tab-outline">
      <AnalysisOutlineView
        state={state}
        editingNoteId={editingNoteId}
        editTitle={editTitle}
        onEditTitleChange={setEditTitle}
        onBeginEdit={beginEdit}
        onCommitEdit={commitEdit}
        onCancelEdit={cancelEdit}
        onSelectNote={onSelectNote}
        onDeleteNote={onDeleteNote}
        onRenameAnalysis={onRenameAnalysis}
        onCreateOutlineItem={(parentPlacementId) => createOutlineItem(parentPlacementId)}
        onSetCollapsed={onSetCollapsed}
        onReorderOutlineItem={onReorderOutlineItem}
        onOutdentOutlineItem={onOutdentOutlineItem}
        onIndentOutlineItem={onIndentOutlineItem}
        onCreateRelationship={onCreateRelationship}
        onUpdateRelationship={onUpdateRelationship}
        onRetargetRelationship={onRetargetRelationship}
        onDeleteRelationship={onDeleteRelationship}
        onOpenRelationalView={() => setRelationalViewOpen(true)}
      />
      {relationalViewOpen && (
        <RelationalView
          state={state}
          onSelectNote={onSelectNote}
          onClose={() => setRelationalViewOpen(false)}
          onOpenOutline={(noteId) => {
            onSelectNote(noteId);
            setRelationalViewOpen(false);
          }}
          onOpenMethod={(address) => {
            setRelationalViewOpen(false);
            onOpenMethod(address);
          }}
        />
      )}
    </div>
  );
}
