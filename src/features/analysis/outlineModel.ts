import type { WorkspaceState } from "../../domain/types";
import {
  outlineItemsForParent,
  outlineReferenceItemsForItem,
} from "../../domain/outline";

export type OutlineRow = {
  placementId: string;
  noteId: string;
  depth: number;
  childCount: number;
  collapsed: boolean;
  searchExpanded: boolean;
};

function referenceChildren(state: WorkspaceState, parentItemId: string) {
  return outlineItemsForParent(state.outline, parentItemId)
    .filter((item) => item.kind === "reference");
}

function searchPathPlacementIds(
  state: WorkspaceState,
  revealNoteIds: ReadonlySet<string>,
): Set<string> {
  const pathIds = new Set<string>();
  for (const noteId of revealNoteIds) {
    for (const placement of outlineReferenceItemsForItem(state.outline, noteId)) {
      let current = placement.parentItemId;
      const seen = new Set<string>();
      while (current !== state.outline.rootItemId && !seen.has(current)) {
        pathIds.add(current);
        seen.add(current);
        current = state.outline.items[current]?.parentItemId ?? state.outline.rootItemId;
      }
    }
  }
  return pathIds;
}

export function outlineRows(
  state: WorkspaceState,
  revealNoteIds: ReadonlySet<string> = new Set<string>(),
): OutlineRow[] {
  const collapsedIds = new Set(state.outlineSession.collapsedItemIds);
  const searchPaths = revealNoteIds.size > 0 ? searchPathPlacementIds(state, revealNoteIds) : null;
  const rows: OutlineRow[] = [];

  const visit = (placementId: string, depth: number) => {
    const placement = state.outline.items[placementId];
    if (!placement || placement.kind !== "reference") return;
    const note = state.notes[placement.itemId];
    const children = referenceChildren(state, placement.id);

    if (!note) {
      for (const child of children) visit(child.id, depth);
      return;
    }

    const searchExpanded = Boolean(collapsedIds.has(placement.id) && searchPaths?.has(placement.id));
    const collapsed = collapsedIds.has(placement.id) && !searchExpanded;
    rows.push({
      placementId: placement.id,
      noteId: placement.itemId,
      depth,
      childCount: children.length,
      collapsed,
      searchExpanded,
    });
    if (collapsed) return;
    for (const child of children) visit(child.id, depth + 1);
  };

  for (const root of referenceChildren(state, state.outline.rootItemId)) visit(root.id, 0);
  return rows;
}

export function outlineFallbackAfterRemoval(
  rows: readonly OutlineRow[],
  placementId: string,
): string | null {
  const index = rows.findIndex((row) => row.placementId === placementId);
  if (index < 0) return null;
  const removedDepth = rows[index].depth;
  for (let candidateIndex = index + 1; candidateIndex < rows.length; candidateIndex += 1) {
    const candidate = rows[candidateIndex];
    if (candidate.depth <= removedDepth) return candidate.placementId;
  }
  return index > 0 ? rows[index - 1].placementId : null;
}

export function nearestVisibleOutlinePlacement(
  state: WorkspaceState,
  visiblePlacementIds: ReadonlySet<string>,
  placementId: string | null,
): string | null {
  let current = placementId;
  const seen = new Set<string>();
  while (current && !seen.has(current)) {
    if (visiblePlacementIds.has(current)) return current;
    seen.add(current);
    const item = state.outline.items[current];
    current = item && item.parentItemId !== state.outline.rootItemId
      ? item.parentItemId
      : null;
  }
  return null;
}

export function nearestVisiblePlacementForNote(
  state: WorkspaceState,
  visiblePlacementIds: ReadonlySet<string>,
  noteId: string | null,
): string | null {
  if (!noteId) return null;
  const placements = outlineReferenceItemsForItem(state.outline, noteId);
  const direct = placements.find((placement) => visiblePlacementIds.has(placement.id));
  if (direct) return direct.id;
  for (const placement of placements) {
    const visible = nearestVisibleOutlinePlacement(state, visiblePlacementIds, placement.id);
    if (visible) return visible;
  }
  return null;
}

export function outlineBranchPlacementIds(
  state: WorkspaceState,
  placementId: string,
): string[] {
  if (!state.outline.items[placementId]) return [];
  const branch: string[] = [];
  const seen = new Set<string>();
  const visit = (currentId: string) => {
    if (seen.has(currentId) || !state.outline.items[currentId]) return;
    seen.add(currentId);
    branch.push(currentId);
    for (const child of referenceChildren(state, currentId)) visit(child.id);
  };
  visit(placementId);
  return branch;
}

export function outlineMatchTarget(
  rows: readonly OutlineRow[],
  matchingNoteIds: ReadonlySet<string>,
  currentPlacementId: string | null,
  direction: "next" | "previous",
): string | null {
  const matches = rows.filter((row) => matchingNoteIds.has(row.noteId));
  if (matches.length === 0) return null;
  const currentMatchIndex = matches.findIndex((row) => row.placementId === currentPlacementId);
  if (currentMatchIndex < 0) {
    return direction === "next" ? matches[0].placementId : matches[matches.length - 1].placementId;
  }
  const delta = direction === "next" ? 1 : -1;
  const targetIndex = (currentMatchIndex + delta + matches.length) % matches.length;
  return matches[targetIndex].placementId;
}

export function outlineShouldHandleRowShortcut(target: {
  editable: boolean;
  interactiveControl: boolean;
  shortcutSurface: boolean;
}): boolean {
  if (target.editable) return false;
  if (!target.interactiveControl) return true;
  return target.shortcutSurface;
}
