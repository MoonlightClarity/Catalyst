import type {
  Annotation,
  Note,
  Relationship,
  TechniqueDefinition,
  ViewerMarkup,
  WorkspaceState,
} from "./types";
import { BUILT_IN_TECHNIQUES } from "./techniques";
import { annotationHasRole } from "./annotationRoles";

export function notesNewestFirst(state: WorkspaceState): Note[] {
  return Object.values(state.notes)
    .sort((a, b) => b.updatedAt.localeCompare(a.updatedAt));
}


export function readerOverlaysForDocument(
  state: WorkspaceState,
  documentId: string,
): Annotation[] {
  return Object.values(state.annotations).filter(
    (annotation) =>
      annotation.documentId === documentId &&
      (
        annotationHasRole(state, annotation.id, "highlight") ||
        Boolean(annotation.analyticPurpose) ||
        Boolean(annotation.visual)
      ),
  );
}




export function viewerMarkupsForDocument(
  state: WorkspaceState,
  documentId: string,
): ViewerMarkup[] {
  return Object.values(state.viewerMarkups)
    .filter((markup) => markup.documentId === documentId)
    .sort((a, b) => a.pageIndex - b.pageIndex || a.createdAt.localeCompare(b.createdAt));
}

export function annotationsForNote(
  state: WorkspaceState,
  noteId: string,
): Annotation[] {
  const ids = new Set(
    state.links
      .filter((link) => link.noteId === noteId)
      .map((link) => link.annotationId),
  );

  return Object.values(state.annotations).filter((annotation) => ids.has(annotation.id));
}

export type NoteConnectionDirection = "outgoing" | "incoming" | "bidirectional";

export type NoteConnection = {
  note: Note;
  relationship: Relationship;
  direction: NoteConnectionDirection;
  createdAt: string;
};

export function relationshipForPair(
  state: WorkspaceState,
  leftId: string,
  rightId: string,
): Relationship | undefined {
  return Object.values(state.relationships).find(
    (relationship) =>
      (relationship.fromId === leftId && relationship.toId === rightId) ||
      (relationship.fromId === rightId && relationship.toId === leftId),
  );
}

export function relationshipsForNote(
  state: WorkspaceState,
  noteId: string,
): Relationship[] {
  return Object.values(state.relationships)
    .filter(
      (relationship) =>
        relationship.fromId === noteId || relationship.toId === noteId,
    )
    .filter((relationship) => {
      const otherId =
        relationship.fromId === noteId ? relationship.toId : relationship.fromId;
      const note = state.notes[otherId];
      return Boolean(note);
    })
    .sort(
      (left, right) =>
        left.createdAt.localeCompare(right.createdAt) ||
        left.id.localeCompare(right.id),
    );
}

export function connectionsForNote(
  state: WorkspaceState,
  noteId: string,
): NoteConnection[] {
  return relationshipsForNote(state, noteId)
    .map((relationship): NoteConnection | null => {
      const outgoing = relationship.fromId === noteId;
      const otherId = outgoing ? relationship.toId : relationship.fromId;
      const note = state.notes[otherId];
      if (!note) return null;
      return {
        note,
        relationship,
        direction: outgoing ? "outgoing" : "incoming",
        createdAt: relationship.createdAt,
      };
    })
    .filter((connection): connection is NoteConnection => Boolean(connection))
    .sort(
      (a, b) =>
        a.createdAt.localeCompare(b.createdAt) ||
        a.note.createdAt.localeCompare(b.note.createdAt) ||
        a.note.id.localeCompare(b.note.id),
    );
}

export function linkedNotesFromNote(
  state: WorkspaceState,
  noteId: string,
): Note[] {
  const ids = state.noteLinks
    .filter((link) => link.fromNoteId === noteId)
    .sort((a, b) => a.createdAt.localeCompare(b.createdAt))
    .map((link) => link.toNoteId);

  return ids
    .map((id) => state.notes[id])
    .filter((note): note is Note => Boolean(note));
}

export function backlinksForNote(
  state: WorkspaceState,
  noteId: string,
): Note[] {
  const ids = state.noteLinks
    .filter((link) => link.toNoteId === noteId)
    .sort((a, b) => b.createdAt.localeCompare(a.createdAt))
    .map((link) => link.fromNoteId);

  return ids
    .map((id) => state.notes[id])
    .filter((note): note is Note => Boolean(note));
}

/**
 * Compatibility-only note links that have not been promoted/hydrated into the
 * canonical Relationship record. Outline/map portrayal uses these helpers so
 * the legacy mirror row cannot make one analytical relationship look like two.
 */
export function unmirroredLinkedNotesFromNote(
  state: WorkspaceState,
  noteId: string,
): Note[] {
  const relationshipTargets = new Set(
    relationshipsForNote(state, noteId).map((relationship) =>
      relationship.fromId === noteId ? relationship.toId : relationship.fromId,
    ),
  );
  return linkedNotesFromNote(state, noteId).filter((note) => !relationshipTargets.has(note.id));
}

export function unmirroredBacklinksForNote(
  state: WorkspaceState,
  noteId: string,
): Note[] {
  const relationshipTargets = new Set(
    relationshipsForNote(state, noteId).map((relationship) =>
      relationship.fromId === noteId ? relationship.toId : relationship.fromId,
    ),
  );
  return backlinksForNote(state, noteId).filter((note) => !relationshipTargets.has(note.id));
}

export function linkableNotesForNote(
  state: WorkspaceState,
  noteId: string,
): Note[] {
  const connectedIds = new Set<string>();
  for (const relationship of Object.values(state.relationships)) {
    if (relationship.fromId === noteId) connectedIds.add(relationship.toId);
    if (relationship.toId === noteId) connectedIds.add(relationship.fromId);
  }

  return notesNewestFirst(state).filter(
    (note) => note.id !== noteId && !connectedIds.has(note.id),
  );
}

export function connectionCountForNote(
  state: WorkspaceState,
  noteId: string,
): number {
  const ids = new Set<string>();
  for (const relationship of Object.values(state.relationships)) {
    if (relationship.fromId === noteId) ids.add(relationship.toId);
    if (relationship.toId === noteId) ids.add(relationship.fromId);
  }
  return [...ids].filter(
    (id) => Boolean(state.notes[id]),
  ).length;
}

export function availableTechniqueDefinitions(_state: WorkspaceState): TechniqueDefinition[] {
  return BUILT_IN_TECHNIQUES;
}

export function noteCountForAnnotation(
  state: WorkspaceState,
  annotationId: string,
): number {
  return state.links.filter((link) => {
    if (link.annotationId !== annotationId) return false;
    const note = state.notes[link.noteId];
    return Boolean(note);
  }).length;
}

export function filterNotes(
  state: WorkspaceState,
  query: string,
): Note[] {
  const normalized = query.trim().toLowerCase();
  const notes = notesNewestFirst(state);
  if (!normalized) return notes;

  return notes.filter((note) => {
    const sources = annotationsForNote(state, note.id)
      .map((annotation) => annotation.quote)
      .join("\n");
    const semantics = state.noteSemantics[note.id];
    const roles = semantics?.roles.join("\n") ?? "";
    const relationships = relationshipsForNote(state, note.id)
      .map((relationship) => `${relationship.type}\n${relationship.label ?? ""}`)
      .join("\n");
    return `${note.title}\n${note.body}\n${sources}\n${roles}\n${relationships}`
      .toLowerCase()
      .includes(normalized);
  });
}


export function documentsRecentlyOpened(state: WorkspaceState) {
  return Object.values(state.documents)
    .sort((a, b) => b.lastOpenedAt.localeCompare(a.lastOpenedAt));
}
