import { sanitizeGraphCamera, sanitizeGraphPoint } from "./graphView";
import {
  emptyAnalysisRoot,
  emptyOutline,
  emptyOutlineSession,
  newOutlineReference,
  normalizeOutlineSiblingOrders,
  outlineItemsForParent,
  outlineWouldCreateCycle,
  removeItemPlacements,
  removeOutlinePlacement,
} from "./outline";
import { DEFAULT_CAPABILITY_STATE, sanitizeCapabilityState } from "./capabilities";
import { reusableSourceRegion } from "./sourceRegions";
export { sourceRegionIdentity } from "./sourceRegions";
import {
  defaultRelationshipDirected,
  newRelationship as createRelationship,
  relationshipPairKey,
  sanitizeNoteSemantics,
} from "./analysis";
import type {
  Annotation,
  AnnotationRole,
  DocumentRecord,
  GraphCamera,
  GraphPoint,
  CapabilityId,
  CapabilityProfileId,
  Note,
  NoteAnnotationLink,
  NoteLink,
  NoteSemantics,
  OutlineReferenceItem,
  Relationship,
  RelationshipType,
  PendingSelection,
  TechniqueDefinition,
  TechniqueRun,
  ViewerMarkup,
  WorkspaceState,
} from "./types";

export const initialWorkspaceState: WorkspaceState = {
  analysisRoot: emptyAnalysisRoot(),
  outline: emptyOutline(),
  outlineSession: emptyOutlineSession(),
  documents: {},
  annotations: {},
  viewerMarkups: {},
  notes: {},
  links: [],
  noteLinks: [],
  techniqueRuns: {},
  pendingSelection: null,
  activeDocumentId: null,
  activeNoteId: null,
  graphView: {
    positions: {},
    camera: { x: 0, y: 0, zoom: 1 },
  },
  capabilities: { ...DEFAULT_CAPABILITY_STATE, overrides: {} },
  noteSemantics: {},
  relationships: {},
  annotationRoles: {},
};

const CONTENT_ADDRESSED_DOCUMENT_ID = /^sha256-[0-9a-f]{64}$/i;

/**
 * A document already identified by its SHA-256 digest may only reconnect to
 * the same bytes. Older Catalyst records used non-content-addressed IDs; those
 * records are allowed to migrate to the selected source's hash once.
 */
export function canReconnectDocumentSource(
  existingDocumentId: string,
  sourceDocumentId: string,
): boolean {
  if (!CONTENT_ADDRESSED_DOCUMENT_ID.test(existingDocumentId)) return true;
  return existingDocumentId.toLowerCase() === sourceDocumentId.toLowerCase();
}

export type WorkspaceAction =
  | { type: "document/opened"; document: DocumentRecord }
  | { type: "document/closed"; id: string }
  | { type: "document/reconnected"; previousId: string; document: DocumentRecord }
  | { type: "selection/captured"; selection: PendingSelection }
  | { type: "selection/cleared" }
  | { type: "annotation/saved"; annotation: Annotation }
  | { type: "annotation-role/ensured"; annotationId: string; role: AnnotationRole }
  | { type: "annotation/deleted"; id: string }
  | { type: "viewer-markup/saved"; markup: ViewerMarkup }
  | { type: "viewer-markup/deleted"; id: string }
  | { type: "note/created"; note: Note }
  | { type: "note/updated"; id: string; patch: Partial<Pick<Note, "title" | "body">> }
  | { type: "note/permanently-deleted"; id: string }
  | { type: "note/activated"; id: string | null }
  | { type: "analysis/title-updated"; title: string }
  | { type: "outline/reference-created"; placement: OutlineReferenceItem }
  | { type: "outline/placement-removed"; placementId: string }
  | { type: "outline/item-parented"; placementId: string; parentItemId: string }
  | { type: "outline/item-reordered"; placementId: string; targetPlacementId: string; placement: "before" | "after" }
  | { type: "outline/item-outdented"; placementId: string }
  | { type: "outline/item-indented"; placementId: string }
  | { type: "outline/collapse-set"; placementId: string; collapsed: boolean }
  | { type: "capability/profile-set"; profile: CapabilityProfileId }
  | { type: "capability/override-set"; capability: CapabilityId; enabled: boolean | null }
  | {
      type: "note-semantics/updated";
      id: string;
      patch: Partial<Pick<NoteSemantics, "roles" | "confidence">>;
    }
  | { type: "relationship/created"; relationship: Relationship }
  | {
      type: "relationship/updated";
      id: string;
      patch: Partial<Pick<Relationship, "type" | "directed" | "label">>;
    }
  | { type: "relationship/deleted"; id: string }
  | { type: "relationship/disconnected"; noteId: string; targetNoteId: string }
  | { type: "graph/node-positioned"; noteId: string; position: GraphPoint }
  | { type: "graph/positions-seeded"; positions: Record<string, GraphPoint> }
  | { type: "graph/camera-updated"; camera: Partial<GraphCamera> }
  | { type: "graph/layout-reset" }
  | { type: "link/created"; link: NoteAnnotationLink }
  | { type: "link/deleted"; noteId: string; annotationId: string }
  | { type: "note-link/created"; link: NoteLink }
  | { type: "note-link/deleted"; fromNoteId: string; toNoteId: string }
  | { type: "note-link/disconnected"; noteId: string; targetNoteId: string }
  | { type: "technique-run/created"; run: TechniqueRun; afterRunId?: string | null }
  | {
      type: "technique-run/definition-updated";
      id: string;
      patch: Partial<Pick<TechniqueDefinition, "name" | "summary" | "category" | "family" | "steps">>;
    }
  | { type: "technique-run/response-updated"; id: string; stepId: string; value: string }
  | { type: "technique-run/reordered"; id: string; direction: "up" | "down" }
  | { type: "technique-run/indented"; id: string }
  | { type: "technique-run/outdented"; id: string }
  | { type: "technique-run/deleted"; id: string };

function techniqueParentId(run: TechniqueRun): string | null {
  return run.parentRunId ?? null;
}

function compareTechniqueRuns(left: TechniqueRun, right: TechniqueRun): number {
  return (
    (left.sequenceIndex ?? Number.MAX_SAFE_INTEGER) -
      (right.sequenceIndex ?? Number.MAX_SAFE_INTEGER) ||
    left.createdAt.localeCompare(right.createdAt) ||
    left.id.localeCompare(right.id)
  );
}

function techniqueRunsForParent(
  runs: Record<string, TechniqueRun>,
  parentRunId: string | null,
): TechniqueRun[] {
  return Object.values(runs)
    .filter((run) => techniqueParentId(run) === parentRunId)
    .sort(compareTechniqueRuns);
}

function reindexTechniqueSiblings(
  runs: Record<string, TechniqueRun>,
  parentRunId: string | null,
  ordered: TechniqueRun[],
): Record<string, TechniqueRun> {
  const next = { ...runs };
  ordered.forEach((run, sequenceIndex) => {
    next[run.id] = { ...next[run.id], parentRunId, sequenceIndex };
  });
  return next;
}

function orderedOutlinePlacementIds(state: WorkspaceState, parentItemId: string): string[] {
  return outlineItemsForParent(state.outline, parentItemId).map((item) => item.id);
}

function withOutlineItem(
  state: WorkspaceState,
  placementId: string,
  patch: Partial<Pick<OutlineReferenceItem, "parentItemId" | "siblingOrder">>,
): WorkspaceState {
  const item = state.outline.items[placementId];
  if (!item || item.kind !== "reference") return state;
  return {
    ...state,
    outline: normalizeOutlineSiblingOrders({
      ...state.outline,
      items: { ...state.outline.items, [placementId]: { ...item, ...patch } },
    }),
  };
}

export function workspaceReducer(
  state: WorkspaceState,
  action: WorkspaceAction,
): WorkspaceState {
  switch (action.type) {
    case "document/opened": {
      const previous = state.documents[action.document.id];
      const document = previous
        ? {
            ...previous,
            ...action.document,
            openedAt: previous.openedAt,
            path: action.document.path ?? previous.path,
          }
        : action.document;

      return {
        ...state,
        documents: {
          ...state.documents,
          [action.document.id]: document,
        },
        activeDocumentId: action.document.id,
      };
    }

    case "document/closed": {
      if (!state.documents[action.id]) return state;
      const documents = { ...state.documents };
      delete documents[action.id];
      return { ...state, documents, activeDocumentId: state.activeDocumentId === action.id ? null : state.activeDocumentId };
    }

    case "document/reconnected": {
      if (
        !canReconnectDocumentSource(
          action.previousId,
          action.document.id,
        )
      ) {
        return state;
      }

      if (action.previousId === action.document.id) {
        return workspaceReducer(state, {
          type: "document/opened",
          document: action.document,
        });
      }

      const previous = state.documents[action.previousId];
      const target = state.documents[action.document.id];
      const documents = { ...state.documents };
      delete documents[action.previousId];

      documents[action.document.id] = {
        ...(target ?? previous ?? action.document),
        ...action.document,
        openedAt: previous?.openedAt ?? target?.openedAt ?? action.document.openedAt,
        path: action.document.path ?? target?.path ?? previous?.path ?? null,
      };

      const annotations = Object.fromEntries(
        Object.entries(state.annotations).map(([id, annotation]) => [
          id,
          annotation.documentId === action.previousId
            ? { ...annotation, documentId: action.document.id }
            : annotation,
        ]),
      );

      const viewerMarkups = Object.fromEntries(
        Object.entries(state.viewerMarkups).map(([id, markup]) => [
          id,
          markup.documentId === action.previousId
            ? { ...markup, documentId: action.document.id }
            : markup,
        ]),
      );

      const pendingSelection =
        state.pendingSelection?.documentId === action.previousId
          ? { ...state.pendingSelection, documentId: action.document.id }
          : state.pendingSelection;

      return {
        ...state,
        documents,
        annotations,
        viewerMarkups,
        pendingSelection,
        activeDocumentId: action.document.id,
      };
    }

    case "selection/captured":
      return {
        ...state,
        pendingSelection: action.selection,
      };

    case "selection/cleared":
      return {
        ...state,
        pendingSelection: null,
      };

    case "annotation/saved": {
      if (!state.documents[action.annotation.documentId]) return state;
      const roles = state.annotationRoles[action.annotation.id] ?? [];
      return {
        ...state,
        annotations: {
          ...state.annotations,
          [action.annotation.id]: action.annotation,
        },
        annotationRoles: {
          ...state.annotationRoles,
          [action.annotation.id]: roles.includes(action.annotation.kind)
            ? roles
            : [...roles, action.annotation.kind],
        },
      };
    }

    case "annotation-role/ensured": {
      if (!state.annotations[action.annotationId]) return state;
      const roles = state.annotationRoles[action.annotationId] ?? [];
      if (roles.includes(action.role)) return state;
      return {
        ...state,
        annotationRoles: {
          ...state.annotationRoles,
          [action.annotationId]: [...roles, action.role],
        },
      };
    }

    case "annotation/deleted": {
      if (!state.annotations[action.id]) return state;
      const annotations = { ...state.annotations };
      const annotationRoles = { ...state.annotationRoles };
      delete annotations[action.id];
      delete annotationRoles[action.id];

      return {
        ...state,
        annotations,
        annotationRoles,
        links: state.links.filter((link) => link.annotationId !== action.id),
      };
    }

    case "viewer-markup/saved":
      if (!state.documents[action.markup.documentId]) return state;
      return {
        ...state,
        viewerMarkups: {
          ...state.viewerMarkups,
          [action.markup.id]: action.markup,
        },
      };

    case "viewer-markup/deleted": {
      if (!state.viewerMarkups[action.id]) return state;
      const viewerMarkups = { ...state.viewerMarkups };
      delete viewerMarkups[action.id];
      return { ...state, viewerMarkups };
    }

    case "note/created":
      return {
        ...state,
        notes: {
          ...state.notes,
          [action.note.id]: action.note,
        },
        activeNoteId: action.note.id,
      };

    case "note/updated": {
      const note = state.notes[action.id];
      if (!note) return state;

      return {
        ...state,
        notes: {
          ...state.notes,
          [action.id]: {
            ...note,
            ...action.patch,
            updatedAt: new Date().toISOString(),
          },
        },
      };
    }

    case "note/permanently-deleted": {
      const notes = { ...state.notes };
      if (!notes[action.id]) return state;
      delete notes[action.id];

      const positions = { ...state.graphView.positions };
      delete positions[action.id];
      const noteSemantics = { ...state.noteSemantics };
      delete noteSemantics[action.id];
      const relationships = Object.fromEntries(
        Object.entries(state.relationships).filter(
          ([, relationship]) =>
            relationship.fromId !== action.id && relationship.toId !== action.id,
        ),
      );

      return {
        ...state,
        notes,
        links: state.links.filter((link) => link.noteId !== action.id),
        noteLinks: state.noteLinks.filter(
          (link) => link.fromNoteId !== action.id && link.toNoteId !== action.id,
        ),
        noteSemantics,
        relationships,
        activeNoteId: state.activeNoteId === action.id ? null : state.activeNoteId,
        graphView: { ...state.graphView, positions },
        outline: removeItemPlacements(state.outline, new Set([action.id])),
      };
    }

    case "note/activated": {
      if (action.id === null) {
        if (state.activeNoteId === null) return state;
        return { ...state, activeNoteId: null };
      }
      const note = state.notes[action.id];
      if (!note || state.activeNoteId === action.id) return state;
      return {
        ...state,
        activeNoteId: action.id,
      };
    }

    case "analysis/title-updated": {
      const title = action.title.trim().slice(0, 120) || "Overview";
      if (title === state.analysisRoot.title) return state;
      return {
        ...state,
        analysisRoot: { ...state.analysisRoot, title, updatedAt: new Date().toISOString() },
      };
    }

    case "outline/reference-created": {
      const placement = action.placement;
      const note = state.notes[placement.itemId];
      if (!note || state.outline.items[placement.id]) return state;
      const parentValid = placement.parentItemId === state.outline.rootItemId || Boolean(state.outline.items[placement.parentItemId]);
      if (!parentValid || outlineWouldCreateCycle(state.outline, placement.id, placement.parentItemId)) return state;
      const normalized = {
        ...placement,
        siblingOrder: outlineItemsForParent(state.outline, placement.parentItemId).length,
      };
      return {
        ...state,
        outline: normalizeOutlineSiblingOrders({
          ...state.outline,
          items: { ...state.outline.items, [normalized.id]: normalized },
        }),
      };
    }

    case "outline/placement-removed": {
      if (!state.outline.items[action.placementId]) return state;
      return {
        ...state,
        outline: removeOutlinePlacement(state.outline, action.placementId),
        outlineSession: {
          collapsedItemIds: state.outlineSession.collapsedItemIds.filter((id) => id !== action.placementId),
        },
      };
    }

    case "outline/item-parented": {
      const item = state.outline.items[action.placementId];
      if (!item || item.kind !== "reference") return state;
      const parentValid = action.parentItemId === state.outline.rootItemId || Boolean(state.outline.items[action.parentItemId]);
      if (!parentValid || item.parentItemId === action.parentItemId) return state;
      if (outlineWouldCreateCycle(state.outline, item.id, action.parentItemId)) return state;
      return withOutlineItem(state, item.id, {
        parentItemId: action.parentItemId,
        siblingOrder: outlineItemsForParent(state.outline, action.parentItemId).length,
      });
    }

    case "outline/item-reordered": {
      const item = state.outline.items[action.placementId];
      const target = state.outline.items[action.targetPlacementId];
      if (!item || !target || item.id === target.id || item.parentItemId !== target.parentItemId) return state;
      const ids = orderedOutlinePlacementIds(state, item.parentItemId).filter((id) => id !== item.id);
      const targetIndex = ids.indexOf(target.id);
      if (targetIndex < 0) return state;
      ids.splice(action.placement === "before" ? targetIndex : targetIndex + 1, 0, item.id);
      const items = { ...state.outline.items };
      ids.forEach((id, index) => { items[id] = { ...items[id], siblingOrder: index }; });
      return { ...state, outline: { ...state.outline, items } };
    }

    case "outline/item-outdented": {
      const item = state.outline.items[action.placementId];
      if (!item || item.parentItemId === state.outline.rootItemId) return state;
      const parent = state.outline.items[item.parentItemId];
      if (!parent) return state;
      const destinationParentId = parent.parentItemId;
      const ids = orderedOutlinePlacementIds(state, destinationParentId).filter((id) => id !== item.id);
      const parentIndex = ids.indexOf(parent.id);
      ids.splice(Math.max(0, parentIndex + 1), 0, item.id);
      const items = { ...state.outline.items, [item.id]: { ...item, parentItemId: destinationParentId } };
      ids.forEach((id, index) => { items[id] = { ...items[id], siblingOrder: index }; });
      return { ...state, outline: normalizeOutlineSiblingOrders({ ...state.outline, items }) };
    }

    case "outline/item-indented": {
      const item = state.outline.items[action.placementId];
      if (!item) return state;
      const siblings = orderedOutlinePlacementIds(state, item.parentItemId);
      const index = siblings.indexOf(item.id);
      const newParentId = index > 0 ? siblings[index - 1] : null;
      if (!newParentId || outlineWouldCreateCycle(state.outline, item.id, newParentId)) return state;
      return withOutlineItem(state, item.id, {
        parentItemId: newParentId,
        siblingOrder: outlineItemsForParent(state.outline, newParentId).length,
      });
    }

    case "outline/collapse-set": {
      if (!state.outline.items[action.placementId]) return state;
      const collapsed = new Set(state.outlineSession.collapsedItemIds);
      action.collapsed ? collapsed.add(action.placementId) : collapsed.delete(action.placementId);
      return { ...state, outlineSession: { collapsedItemIds: [...collapsed] } };
    }

    case "capability/profile-set": {
      const next = sanitizeCapabilityState({
        profile: action.profile,
        overrides: {},
      });
      if (
        next.profile === state.capabilities.profile &&
        Object.keys(state.capabilities.overrides).length === 0
      ) return state;
      return { ...state, capabilities: next };
    }

    case "capability/override-set": {
      const overrides = { ...state.capabilities.overrides };
      if (action.enabled === null) delete overrides[action.capability];
      else overrides[action.capability] = action.enabled;
      const next = sanitizeCapabilityState({
        profile: state.capabilities.profile,
        overrides,
      });
      if (JSON.stringify(next) === JSON.stringify(state.capabilities)) return state;
      return { ...state, capabilities: next };
    }

    case "note-semantics/updated": {
      const note = state.notes[action.id];
      if (!note) return state;
      const current = state.noteSemantics[action.id] ?? { roles: ["note"], confidence: null };
      const next = sanitizeNoteSemantics({ ...current, ...action.patch });
      if (JSON.stringify(current) === JSON.stringify(next)) return state;
      return {
        ...state,
        noteSemantics: {
          ...state.noteSemantics,
          [action.id]: next,
        },
        notes: {
          ...state.notes,
          [note.id]: { ...note, updatedAt: new Date().toISOString() },
        },
      };
    }

    case "relationship/created": {
      const relationship = action.relationship;
      if (relationship.fromId === relationship.toId) return state;
      const fromNote = state.notes[relationship.fromId];
      const toNote = state.notes[relationship.toId];
      if (!fromNote || !toNote) return state;

      const pair = relationshipPairKey(relationship.fromId, relationship.toId);
      if (
        Object.values(state.relationships).some(
          (item) => relationshipPairKey(item.fromId, item.toId) === pair,
        )
      ) return state;

      const now = new Date().toISOString();
      const normalized: Relationship = {
        ...relationship,
        type: relationship.type,
        directed: relationship.directed ?? defaultRelationshipDirected(relationship.type),
        label: relationship.label?.trim() || null,
        updatedAt: relationship.updatedAt || now,
      };
      const mirror: NoteLink = {
        fromNoteId: normalized.fromId,
        toNoteId: normalized.toId,
        createdAt: normalized.createdAt,
      };

      return {
        ...state,
        relationships: {
          ...state.relationships,
          [normalized.id]: normalized,
        },
        noteLinks: [
          ...state.noteLinks.filter(
            (link) =>
              relationshipPairKey(link.fromNoteId, link.toNoteId) !== pair,
          ),
          mirror,
        ],
        notes: {
          ...state.notes,
          [fromNote.id]: { ...fromNote, updatedAt: now },
        },
      };
    }

    case "relationship/updated": {
      const existing = state.relationships[action.id];
      if (!existing) return state;
      const type = action.patch.type ?? existing.type;
      const directed = action.patch.directed ??
        (action.patch.type && action.patch.type !== existing.type
          ? defaultRelationshipDirected(type)
          : existing.directed);
      const label = action.patch.label === undefined
        ? existing.label
        : action.patch.label?.trim() || null;
      const next: Relationship = {
        ...existing,
        ...action.patch,
        type,
        directed,
        label,
        updatedAt: new Date().toISOString(),
      };
      if (
        next.type === existing.type &&
        next.directed === existing.directed &&
        next.label === existing.label
      ) return state;
      return {
        ...state,
        relationships: {
          ...state.relationships,
          [existing.id]: next,
        },
      };
    }

    case "relationship/deleted": {
      const existing = state.relationships[action.id];
      if (!existing) return state;
      const relationships = { ...state.relationships };
      delete relationships[action.id];
      const pair = relationshipPairKey(existing.fromId, existing.toId);
      return {
        ...state,
        relationships,
        noteLinks: state.noteLinks.filter(
          (link) => relationshipPairKey(link.fromNoteId, link.toNoteId) !== pair,
        ),
      };
    }

    case "relationship/disconnected": {
      if (action.noteId === action.targetNoteId) return state;
      const pair = relationshipPairKey(action.noteId, action.targetNoteId);
      const relationships = Object.fromEntries(
        Object.entries(state.relationships).filter(
          ([, relationship]) =>
            relationshipPairKey(relationship.fromId, relationship.toId) !== pair,
        ),
      );
      if (Object.keys(relationships).length === Object.keys(state.relationships).length) {
        return state;
      }
      const note = state.notes[action.noteId];
      return {
        ...state,
        relationships,
        noteLinks: state.noteLinks.filter(
          (link) => relationshipPairKey(link.fromNoteId, link.toNoteId) !== pair,
        ),
        notes:
          note
            ? {
                ...state.notes,
                [note.id]: { ...note, updatedAt: new Date().toISOString() },
              }
            : state.notes,
      };
    }

    case "graph/node-positioned": {
      const note = state.notes[action.noteId];
      if (!note) return state;
      const position = sanitizeGraphPoint(action.position);
      if (!position) return state;
      const previous = state.graphView.positions[action.noteId];
      if (previous?.x === position.x && previous?.y === position.y) return state;
      return {
        ...state,
        graphView: {
          ...state.graphView,
          positions: {
            ...state.graphView.positions,
            [action.noteId]: position,
          },
        },
      };
    }

    case "graph/positions-seeded": {
      let changed = false;
      const positions = { ...state.graphView.positions };
      for (const [noteId, position] of Object.entries(action.positions)) {
        const note = state.notes[noteId];
        if (!note || positions[noteId]) continue;
        const sanitized = sanitizeGraphPoint(position);
        if (!sanitized) continue;
        positions[noteId] = sanitized;
        changed = true;
      }
      return changed
        ? { ...state, graphView: { ...state.graphView, positions } }
        : state;
    }

    case "graph/camera-updated": {
      const camera = sanitizeGraphCamera({
        ...state.graphView.camera,
        ...action.camera,
      });
      if (
        camera.x === state.graphView.camera.x &&
        camera.y === state.graphView.camera.y &&
        camera.zoom === state.graphView.camera.zoom
      ) return state;
      return { ...state, graphView: { ...state.graphView, camera } };
    }

    case "graph/layout-reset":
      if (Object.keys(state.graphView.positions).length === 0) return state;
      return {
        ...state,
        graphView: { ...state.graphView, positions: {} },
      };

    case "link/created": {
      const note = state.notes[action.link.noteId];
      const annotation = state.annotations[action.link.annotationId];
      if (!note || !annotation) return state;

      const duplicate = state.links.some(
        (link) =>
          link.noteId === action.link.noteId &&
          link.annotationId === action.link.annotationId,
      );

      return duplicate
        ? state
        : {
            ...state,
            links: [...state.links, action.link],
          };
    }

    case "link/deleted":
      return {
        ...state,
        links: state.links.filter(
          (link) =>
            !(
              link.noteId === action.noteId &&
              link.annotationId === action.annotationId
            ),
        ),
      };

    case "note-link/created": {
      const legacyRelationship = createRelationship(
        action.link.fromNoteId,
        action.link.toNoteId,
        "related-to",
      );
      legacyRelationship.createdAt = action.link.createdAt;
      legacyRelationship.updatedAt = action.link.createdAt;
      return workspaceReducer(state, {
        type: "relationship/created",
        relationship: legacyRelationship,
      });
    }

    case "note-link/deleted": {
      const pair = relationshipPairKey(action.fromNoteId, action.toNoteId);
      const relationship = Object.values(state.relationships).find(
        (item) => relationshipPairKey(item.fromId, item.toId) === pair,
      );
      if (relationship) {
        return workspaceReducer(state, {
          type: "relationship/deleted",
          id: relationship.id,
        });
      }
      const exists = state.noteLinks.some(
        (link) =>
          link.fromNoteId === action.fromNoteId &&
          link.toNoteId === action.toNoteId,
      );
      if (!exists) return state;
      return {
        ...state,
        noteLinks: state.noteLinks.filter(
          (link) =>
            !(
              link.fromNoteId === action.fromNoteId &&
              link.toNoteId === action.toNoteId
            ),
        ),
      };
    }

    case "note-link/disconnected":
      return workspaceReducer(state, {
        type: "relationship/disconnected",
        noteId: action.noteId,
        targetNoteId: action.targetNoteId,
      });

    case "technique-run/created": {
      const requestedParentId = action.run.parentRunId ?? null;
      const parentRunId = requestedParentId && state.techniqueRuns[requestedParentId]
        ? requestedParentId
        : null;
      const siblings = techniqueRunsForParent(state.techniqueRuns, parentRunId);
      const afterIndex = action.afterRunId
        ? siblings.findIndex((run) => run.id === action.afterRunId)
        : -1;
      const insertIndex = afterIndex >= 0 ? afterIndex + 1 : siblings.length;
      const run = { ...action.run, parentRunId };
      const ordered = [...siblings];
      ordered.splice(insertIndex, 0, run);
      const techniqueRuns = reindexTechniqueSiblings(
        { ...state.techniqueRuns, [run.id]: run },
        parentRunId,
        ordered,
      );
      return { ...state, techniqueRuns };
    }

    case "technique-run/definition-updated": {
      const run = state.techniqueRuns[action.id];
      if (!run) return state;
      const now = new Date().toISOString();
      const definitionSnapshot = {
        ...run.definitionSnapshot,
        ...action.patch,
      };
      const stepIds = new Set(definitionSnapshot.steps.map((step) => step.id));
      const responses = Object.fromEntries(
        Object.entries(run.responses).filter(([stepId]) => stepIds.has(stepId)),
      );
      return {
        ...state,
        techniqueRuns: {
          ...state.techniqueRuns,
          [run.id]: {
            ...run,
            definitionSnapshot,
            responses,
            updatedAt: now,
          },
        },
      };
    }

    case "technique-run/response-updated": {
      const run = state.techniqueRuns[action.id];
      if (!run) return state;
      const now = new Date().toISOString();
      return {
        ...state,
        techniqueRuns: {
          ...state.techniqueRuns,
          [run.id]: {
            ...run,
            responses: {
              ...run.responses,
              [action.stepId]: action.value,
            },
            updatedAt: now,
          },
        },
      };
    }

    case "technique-run/reordered": {
      const run = state.techniqueRuns[action.id];
      if (!run) return state;
      const parentRunId = techniqueParentId(run);
      const ordered = techniqueRunsForParent(state.techniqueRuns, parentRunId);
      const index = ordered.findIndex((candidate) => candidate.id === action.id);
      if (index < 0) return state;
      const targetIndex = action.direction === "up" ? index - 1 : index + 1;
      if (targetIndex < 0 || targetIndex >= ordered.length) return state;
      [ordered[index], ordered[targetIndex]] = [ordered[targetIndex], ordered[index]];
      return {
        ...state,
        techniqueRuns: reindexTechniqueSiblings(state.techniqueRuns, parentRunId, ordered),
      };
    }

    case "technique-run/indented": {
      const run = state.techniqueRuns[action.id];
      if (!run) return state;
      const oldParentId = techniqueParentId(run);
      const oldSiblings = techniqueRunsForParent(state.techniqueRuns, oldParentId);
      const index = oldSiblings.findIndex((candidate) => candidate.id === run.id);
      if (index <= 0) return state;
      const newParent = oldSiblings[index - 1];
      let techniqueRuns = reindexTechniqueSiblings(
        state.techniqueRuns,
        oldParentId,
        oldSiblings.filter((candidate) => candidate.id !== run.id),
      );
      const moved = { ...techniqueRuns[run.id], parentRunId: newParent.id };
      techniqueRuns = { ...techniqueRuns, [run.id]: moved };
      const newSiblings = techniqueRunsForParent(techniqueRuns, newParent.id);
      techniqueRuns = reindexTechniqueSiblings(
        techniqueRuns,
        newParent.id,
        [...newSiblings.filter((candidate) => candidate.id !== run.id), moved],
      );
      return { ...state, techniqueRuns };
    }

    case "technique-run/outdented": {
      const run = state.techniqueRuns[action.id];
      if (!run) return state;
      const oldParentId = techniqueParentId(run);
      if (!oldParentId) return state;
      const parent = state.techniqueRuns[oldParentId];
      if (!parent) return state;
      const newParentId = techniqueParentId(parent);
      const oldSiblings = techniqueRunsForParent(state.techniqueRuns, oldParentId);
      let techniqueRuns = reindexTechniqueSiblings(
        state.techniqueRuns,
        oldParentId,
        oldSiblings.filter((candidate) => candidate.id !== run.id),
      );
      const moved = { ...techniqueRuns[run.id], parentRunId: newParentId };
      techniqueRuns = { ...techniqueRuns, [run.id]: moved };
      const newSiblings = techniqueRunsForParent(techniqueRuns, newParentId)
        .filter((candidate) => candidate.id !== run.id);
      const parentIndex = newSiblings.findIndex((candidate) => candidate.id === parent.id);
      const insertIndex = parentIndex >= 0 ? parentIndex + 1 : newSiblings.length;
      newSiblings.splice(insertIndex, 0, moved);
      techniqueRuns = reindexTechniqueSiblings(techniqueRuns, newParentId, newSiblings);
      return { ...state, techniqueRuns };
    }

    case "technique-run/deleted": {
      const run = state.techniqueRuns[action.id];
      if (!run) return state;
      const parentRunId = techniqueParentId(run);
      const siblings = techniqueRunsForParent(state.techniqueRuns, parentRunId);
      const index = siblings.findIndex((candidate) => candidate.id === run.id);
      const children = techniqueRunsForParent(state.techniqueRuns, run.id);
      const techniqueRuns = { ...state.techniqueRuns };
      delete techniqueRuns[run.id];
      const promoted = children.map((child) => ({ ...child, parentRunId }));
      const ordered = [
        ...siblings.slice(0, Math.max(0, index)),
        ...promoted,
        ...siblings.slice(index + 1),
      ].filter((candidate) => candidate.id !== run.id);
      promoted.forEach((child) => {
        techniqueRuns[child.id] = child;
      });
      return {
        ...state,
        techniqueRuns: reindexTechniqueSiblings(techniqueRuns, parentRunId, ordered),
      };
    }

    default:
      return state;
  }
}

export function reusableAnnotationForSelection(
  state: WorkspaceState,
  selection: PendingSelection,
): Annotation | null {
  return reusableSourceRegion(state.annotations, selection);
}

export function annotationFromSelection(
  selection: PendingSelection,
  kind: Annotation["kind"] = "excerpt",
): Annotation {
  return {
    id: crypto.randomUUID(),
    documentId: selection.documentId,
    quote: selection.quote,
    pageIndex: selection.pageIndex,
    anchors: selection.anchors,
    sourceRange: selection.sourceRange,
    kind,
    createdAt: new Date().toISOString(),
  };
}

export function newNote(
  initial?: Partial<Pick<Note, "title" | "body">>,
): Note {
  const now = new Date().toISOString();
  return {
    id: crypto.randomUUID(),
    title: initial?.title ?? "",
    body: initial?.body ?? "",
    createdAt: now,
    updatedAt: now,
  };
}

export function newLink(noteId: string, annotationId: string): NoteAnnotationLink {
  return {
    noteId,
    annotationId,
    createdAt: new Date().toISOString(),
  };
}

export function newNoteLink(fromNoteId: string, toNoteId: string): NoteLink {
  return {
    fromNoteId,
    toNoteId,
    createdAt: new Date().toISOString(),
  };
}

export function newRelationship(
  fromId: string,
  toId: string,
  type: RelationshipType = "related-to",
): Relationship {
  return createRelationship(fromId, toId, type);
}
