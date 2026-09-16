import { useCallback, useState } from "react";
import type { WorkspaceState } from "../../domain/types";
import { AnalysisOutlineView } from "./AnalysisOutlineView";
export function OutlineWorkspace({
  state,
  onSelectNote,
  onCreateOutlineItem,
  onRenameNote,
  onUpdateNoteBody,
  onCommitNote,
  onRenameAnalysis,
  onDeleteNote,
  onSetCollapsed,
  onReorderOutlineItem,
  onOutdentOutlineItem,
  onIndentOutlineItem,
}: {
  state: WorkspaceState;
  onSelectNote: (noteId: string) => void;
  onCreateOutlineItem: (parentPlacementId: string | null) => { noteId: string; placementId: string };
  onRenameNote: (noteId: string, title: string) => void;
  onUpdateNoteBody: (noteId: string, body: string) => void;
  onCommitNote: () => void;
  onRenameAnalysis: (name: string) => void;
  onDeleteNote: (noteId: string) => void;
  onSetCollapsed: (placementId: string, collapsed: boolean) => void;
  onReorderOutlineItem: (placementId: string, targetPlacementId: string, placement: "before" | "after") => void;
  onOutdentOutlineItem: (placementId: string) => void;
  onIndentOutlineItem: (placementId: string) => void;
}) {
  const [editingNoteId, setEditingNoteId] = useState<string | null>(null);
  const [editTitle, setEditTitle] = useState("");

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
        onUpdateNoteBody={onUpdateNoteBody}
        onCommitNote={onCommitNote}
        onDeleteNote={onDeleteNote}
        onRenameAnalysis={onRenameAnalysis}
        onCreateOutlineItem={(parentPlacementId) => createOutlineItem(parentPlacementId)}
        onSetCollapsed={onSetCollapsed}
        onReorderOutlineItem={onReorderOutlineItem}
        onOutdentOutlineItem={onOutdentOutlineItem}
        onIndentOutlineItem={onIndentOutlineItem}
      />
    </div>
  );
}
