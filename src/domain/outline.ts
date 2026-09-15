import type {
  AnalysisRoot,
  Note,
  Outline,
  OutlineItem,
  OutlineReferenceItem,
  OutlineSessionState,
} from "./types";

export const DEFAULT_ANALYSIS_ROOT_ID = "analysis-root";
export const DEFAULT_OUTLINE_ID = "analysis-outline";
export const DEFAULT_OUTLINE_ROOT_ITEM_ID = "analysis-outline-root";
export const DEFAULT_ANALYSIS_TITLE = "Title";

const nowIso = () => new Date().toISOString();

export function emptyAnalysisRoot(): AnalysisRoot {
  const now = nowIso();
  return {
    id: DEFAULT_ANALYSIS_ROOT_ID,
    title: DEFAULT_ANALYSIS_TITLE,
    createdAt: now,
    updatedAt: now,
  };
}

export function emptyOutline(): Outline {
  return {
    id: DEFAULT_OUTLINE_ID,
    analysisRootId: DEFAULT_ANALYSIS_ROOT_ID,
    rootItemId: DEFAULT_OUTLINE_ROOT_ITEM_ID,
    items: {},
  };
}

export function emptyOutlineSession(): OutlineSessionState {
  return { collapsedItemIds: [] };
}

function newPlacementId(): string {
  const uuid = globalThis.crypto?.randomUUID?.();
  return uuid ? `outline-${uuid}` : `outline-${Date.now()}-${Math.random().toString(36).slice(2)}`;
}

export function newOutlineReference(
  outline: Outline,
  itemId: string,
  parentItemId = outline.rootItemId,
  id = newPlacementId(),
): OutlineReferenceItem {
  return {
    id,
    kind: "reference",
    itemId,
    parentItemId,
    siblingOrder: nextSiblingOrder(outline, parentItemId),
  };
}

export function outlineItemsForParent(
  outline: Outline,
  parentItemId: string,
): OutlineItem[] {
  return Object.values(outline.items)
    .filter((item) => item.parentItemId === parentItemId)
    .sort((left, right) => left.siblingOrder - right.siblingOrder || left.id.localeCompare(right.id));
}

export function nextSiblingOrder(outline: Outline, parentItemId: string): number {
  const siblings = outlineItemsForParent(outline, parentItemId);
  return siblings.length === 0 ? 0 : Math.max(...siblings.map((item) => item.siblingOrder)) + 1;
}

export function outlineReferenceItemsForItem(
  outline: Outline,
  itemId: string,
): OutlineReferenceItem[] {
  return Object.values(outline.items)
    .filter((item): item is OutlineReferenceItem => item.kind === "reference" && item.itemId === itemId)
    .sort((left, right) => left.siblingOrder - right.siblingOrder || left.id.localeCompare(right.id));
}

export function primaryOutlineReferenceForItem(
  outline: Outline,
  itemId: string,
): OutlineReferenceItem | null {
  return outlineReferenceItemsForItem(outline, itemId)[0] ?? null;
}

export function outlineParentItem(
  outline: Outline,
  placementId: string,
): OutlineItem | null {
  const placement = outline.items[placementId];
  if (!placement || placement.parentItemId === outline.rootItemId) return null;
  return outline.items[placement.parentItemId] ?? null;
}

export function outlineWouldCreateCycle(
  outline: Outline,
  placementId: string,
  parentItemId: string,
): boolean {
  if (placementId === parentItemId) return true;
  const placement = outline.items[placementId];
  if (!placement) return false;
  const placementItemId = placement.kind === "reference" ? placement.itemId : null;
  const seen = new Set<string>([placementId]);
  let current = parentItemId;
  while (current !== outline.rootItemId) {
    if (seen.has(current)) return true;
    seen.add(current);
    const parent = outline.items[current];
    if (!parent) return true;
    if (
      placementItemId &&
      parent.kind === "reference" &&
      parent.itemId === placementItemId
    ) return true;
    current = parent.parentItemId;
  }
  return false;
}

export function normalizeOutlineSiblingOrders(outline: Outline): Outline {
  const items = { ...outline.items };
  const parentIds = new Set<string>(Object.values(items).map((item) => item.parentItemId));
  for (const parentId of parentIds) {
    outlineItemsForParent({ ...outline, items }, parentId).forEach((item, index) => {
      items[item.id] = { ...items[item.id], siblingOrder: index } as OutlineItem;
    });
  }
  return { ...outline, items };
}

export function removeOutlinePlacement(
  outline: Outline,
  placementId: string,
): Outline {
  const placement = outline.items[placementId];
  if (!placement) return outline;
  const items = { ...outline.items };
  const children = outlineItemsForParent(outline, placementId);
  delete items[placementId];

  for (const child of children) {
    items[child.id] = {
      ...child,
      parentItemId: placement.parentItemId,
      siblingOrder: placement.siblingOrder + child.siblingOrder / Math.max(1, children.length + 1),
    } as OutlineItem;
  }
  return normalizeOutlineSiblingOrders({ ...outline, items });
}

export function removeItemPlacements(
  outline: Outline,
  itemIds: ReadonlySet<string>,
): Outline {
  let next = outline;
  const placementIds = Object.values(outline.items)
    .filter((item) => item.kind === "reference" && itemIds.has(item.itemId))
    .map((item) => item.id);
  for (const placementId of placementIds) next = removeOutlinePlacement(next, placementId);
  return next;
}

export function sanitizeOutline(
  value: unknown,
  notes: Record<string, Note>,
): Outline {
  const candidate = value && typeof value === "object" ? value as Partial<Outline> : {};
  const rootItemId = typeof candidate.rootItemId === "string" && candidate.rootItemId
    ? candidate.rootItemId
    : DEFAULT_OUTLINE_ROOT_ITEM_ID;
  const items: Record<string, OutlineItem> = {};
  if (candidate.items && typeof candidate.items === "object") {
    for (const [id, raw] of Object.entries(candidate.items)) {
      if (!raw || typeof raw !== "object") continue;
      const item = raw as Partial<OutlineItem>;
      if (item.kind !== "reference" || typeof (item as Partial<OutlineReferenceItem>).itemId !== "string") continue;
      const reference = item as Partial<OutlineReferenceItem>;
      if (!notes[reference.itemId!]) continue;
      items[id] = {
        id,
        kind: "reference",
        itemId: reference.itemId!,
        parentItemId: typeof reference.parentItemId === "string" ? reference.parentItemId : rootItemId,
        siblingOrder: Number.isFinite(reference.siblingOrder) ? Number(reference.siblingOrder) : Number.MAX_SAFE_INTEGER,
      };
    }
  }

  const outline: Outline = {
    id: typeof candidate.id === "string" && candidate.id ? candidate.id : DEFAULT_OUTLINE_ID,
    analysisRootId: typeof candidate.analysisRootId === "string" && candidate.analysisRootId
      ? candidate.analysisRootId
      : DEFAULT_ANALYSIS_ROOT_ID,
    rootItemId,
    items,
  };

  for (const item of Object.values(outline.items)) {
    if (item.parentItemId !== outline.rootItemId && !outline.items[item.parentItemId]) {
      item.parentItemId = outline.rootItemId;
    }
  }

  // Alpha-development fallback only: if an old workspace has Notes but no
  // first-class Outline, expose them as top-level placements rather than
  // silently hiding development data. This is not a long-term compatibility API.
  if (Object.keys(outline.items).length === 0) {
    for (const note of Object.values(notes)
      .sort((a, b) => a.createdAt.localeCompare(b.createdAt) || a.id.localeCompare(b.id))) {
      const placement = newOutlineReference(outline, note.id);
      outline.items[placement.id] = placement;
    }
  }

  return normalizeOutlineSiblingOrders(outline);
}

export function sanitizeAnalysisRoot(value: unknown): AnalysisRoot {
  const fallback = emptyAnalysisRoot();
  if (!value || typeof value !== "object") return fallback;
  const candidate = value as Partial<AnalysisRoot>;
  return {
    id: typeof candidate.id === "string" && candidate.id ? candidate.id : fallback.id,
    title: typeof candidate.title === "string" && candidate.title.trim()
      ? candidate.title.trim().slice(0, 120)
      : fallback.title,
    createdAt: typeof candidate.createdAt === "string" ? candidate.createdAt : fallback.createdAt,
    updatedAt: typeof candidate.updatedAt === "string" ? candidate.updatedAt : fallback.updatedAt,
  };
}

export function sanitizeOutlineSession(
  value: unknown,
  outline: Outline,
): OutlineSessionState {
  const candidate = value && typeof value === "object"
    ? value as Partial<OutlineSessionState>
    : {};
  const collapsedItemIds = Array.isArray(candidate.collapsedItemIds)
    ? candidate.collapsedItemIds.filter(
        (id): id is string => typeof id === "string" && Boolean(outline.items[id]),
      )
    : [];
  return { collapsedItemIds: [...new Set(collapsedItemIds)] };
}
