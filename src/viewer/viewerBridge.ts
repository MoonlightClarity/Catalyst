import type {
  Annotation,
  PendingSelection,
  SelectionAnchor,
  ViewerMarkup,
} from "../domain/types";
import type { PdfSource } from "../platform/pdfFiles";
import { subscribeToInitialAnnotationLoad } from "./annotationLoad";
import {
  isCatalystEvidenceViewerAnnotation,
  viewerMarkupFromTransferItem,
  viewerMarkupToTransferItem,
} from "./viewerMarkups";

export type RegistryLike = {
  getPlugin: (name: string) => { provides: () => any } | undefined;
};

type RectLike = {
  origin: { x: number; y: number };
  size: { width: number; height: number };
};

type TrackedViewerHighlight = {
  pageIndex: number;
};

// Catalyst owns highlight persistence. the viewer adapter is only the rendering surface.
// Track only annotations imported by Catalyst so reconciliation never touches
// annotations that already exist in the source PDF itself.
const trackedViewerHighlights = new Map<
  string,
  Map<string, TrackedViewerHighlight>
>();

function normalizeFormattedSelection(value: unknown): SelectionAnchor[] {
  if (!Array.isArray(value)) return [];

  return value.map((item: any) => ({
    pageIndex: Number(item?.pageIndex ?? 0),
    rect: item?.rect ?? null,
    textLines: item?.textLines ?? null,
  }));
}

function normalizeRect(value: unknown): RectLike | null {
  const item = value as any;
  const x = Number(item?.origin?.x);
  const y = Number(item?.origin?.y);
  const width = Number(item?.size?.width);
  const height = Number(item?.size?.height);

  if (![x, y, width, height].every(Number.isFinite)) return null;
  if (width <= 0 || height <= 0) return null;

  return {
    origin: { x, y },
    size: { width, height },
  };
}

function segmentRectsForAnchor(anchor: SelectionAnchor): RectLike[] {
  const boundingRect = normalizeRect(anchor.rect);
  const rawLines = Array.isArray(anchor.textLines) ? anchor.textLines : [];

  const lineRects = rawLines
    .map((line: any) => normalizeRect(line?.rect ?? line))
    .filter((rect): rect is RectLike => Boolean(rect));

  if (lineRects.length > 0) return lineRects;
  return boundingRect ? [boundingRect] : [];
}

function fnv1a32(input: string, seed: number): number {
  let hash = seed >>> 0;
  for (let index = 0; index < input.length; index += 1) {
    hash ^= input.charCodeAt(index);
    hash = Math.imul(hash, 0x01000193) >>> 0;
  }
  return hash >>> 0;
}

/**
 * the viewer adapter keeps an annotation ID inside the in-memory PDF. It accepts UUID v4
 * IDs, so derive a stable UUID-shaped ID from Catalyst's logical annotation ID
 * and the page-anchor index. Stable IDs let Catalyst remove/reconcile its own
 * rendering without storing viewer-specific identifiers in the domain model.
 */
export function viewerHighlightId(
  catalystAnnotationId: string,
  anchorIndex: number,
): string {
  const input = `${catalystAnnotationId}:${anchorIndex}`;
  const words = [
    fnv1a32(input, 0x811c9dc5),
    fnv1a32(input, 0x9e3779b9),
    fnv1a32(input, 0x85ebca6b),
    fnv1a32(input, 0xc2b2ae35),
  ];

  const hex = words
    .map((word) => word.toString(16).padStart(8, "0"))
    .join("")
    .split("");

  // UUID v4 version + RFC 4122 variant bits.
  hex[12] = "4";
  const variantNibble = (Number.parseInt(hex[16] ?? "0", 16) & 0x3) | 0x8;
  hex[16] = variantNibble.toString(16);

  const value = hex.join("");
  return `${value.slice(0, 8)}-${value.slice(8, 12)}-${value.slice(12, 16)}-${value.slice(16, 20)}-${value.slice(20, 32)}`;
}

function annotationScope(
  registry: RegistryLike,
  documentId: string,
): any | null {
  const capability = registry.getPlugin("annotation")?.provides();
  if (!capability) return null;
  return capability.forDocument?.(documentId) ?? capability;
}

async function taskValue<T>(value: any): Promise<T> {
  if (value && typeof value.toPromise === "function") {
    return value.toPromise() as Promise<T>;
  }

  if (value && typeof value.wait === "function") {
    return new Promise<T>((resolve, reject) => value.wait(resolve, reject));
  }

  return Promise.resolve(value as T);
}

function viewerAnnotationId(annotation: unknown): string {
  return String((annotation as any)?.id ?? "").trim();
}

function sameMarkupContent(a: ViewerMarkup, b: ViewerMarkup): boolean {
  return (
    a.documentId === b.documentId &&
    a.pageIndex === b.pageIndex &&
    a.formatVersion === b.formatVersion &&
    a.annotationJson === b.annotationJson &&
    a.contextDataBase64 === b.contextDataBase64 &&
    a.contextMimeType === b.contextMimeType
  );
}

async function exportViewerMarkupById(
  scope: any,
  documentId: string,
  pageIndex: number,
  annotationId: string,
  previous: ViewerMarkup | undefined,
): Promise<ViewerMarkup | null> {
  if (!scope?.exportAnnotations) return null;

  const exported = await taskValue<any[]>(
    scope.exportAnnotations({ pageIndex }),
  );
  const transferItem = Array.isArray(exported)
    ? exported.find(
        (item) => viewerAnnotationId(item?.annotation) === annotationId,
      )
    : undefined;

  if (!transferItem) return null;
  return viewerMarkupFromTransferItem(
    documentId,
    pageIndex,
    transferItem,
    previous,
  );
}

/**
 * Import Catalyst-owned toolbar annotations into an open document. Source-PDF
 * annotations are left alone. Existing IDs are skipped, which also makes the
 * operation safe to call both immediately and again after the viewer adapter's `loaded`
 * event.
 */
export async function rehydrateDocumentViewerMarkups(
  registry: RegistryLike,
  documentId: string,
  markups: ViewerMarkup[],
): Promise<number> {
  const scope = annotationScope(registry, documentId);
  if (!scope?.importAnnotations || markups.length === 0) return 0;

  let existingIds = new Set<string>();
  if (scope.exportAnnotations) {
    try {
      const current = await taskValue<any[]>(scope.exportAnnotations());
      existingIds = new Set(
        (Array.isArray(current) ? current : [])
          .map((item) => viewerAnnotationId(item?.annotation))
          .filter(Boolean),
      );
    } catch (error) {
      console.warn("Could not inspect viewer annotations before restore", error);
    }
  }

  const imports = markups
    .filter((markup) => !existingIds.has(markup.id))
    .map(viewerMarkupToTransferItem);

  if (imports.length === 0) return 0;
  await taskValue<unknown>(scope.importAnnotations(imports));
  return imports.length;
}

export type ViewerMarkupPersistenceHandlers = {
  getMarkup: (id: string) => ViewerMarkup | undefined;
  getDocumentMarkups: () => ViewerMarkup[];
  onUpsert: (markup: ViewerMarkup) => void;
  onDelete: (id: string) => void;
  onLoaded?: () => void;
  onError?: (error: unknown) => void;
};

/**
 * Persist annotations created with the viewer adapter's annotation toolbar without
 * mixing them with Catalyst's evidence/highlight records. Only toolbar
 * annotations created inside Catalyst are tracked. Native annotations already
 * embedded in the source PDF are intentionally not copied into the workspace.
 */
export function subscribeToDocumentViewerMarkupPersistence(
  registry: RegistryLike,
  documentId: string,
  handlers: ViewerMarkupPersistenceHandlers,
): () => void {
  const scope = annotationScope(registry, documentId);
  if (!scope?.onAnnotationEvent) return () => {};

  const managedIds = new Set(
    handlers.getDocumentMarkups().map((markup) => markup.id),
  );
  const revisions = new Map<string, number>();

  const bumpRevision = (id: string) => {
    const next = (revisions.get(id) ?? 0) + 1;
    revisions.set(id, next);
    return next;
  };

  const restore = async () => {
    for (const markup of handlers.getDocumentMarkups()) managedIds.add(markup.id);
    try {
      await rehydrateDocumentViewerMarkups(
        registry,
        documentId,
        handlers.getDocumentMarkups(),
      );
    } catch (error) {
      handlers.onError?.(error);
    }
  };

  const unsubscribe = scope.onAnnotationEvent((event: any) => {
    if (event?.type === "loaded") {
      handlers.onLoaded?.();
      void restore();
      return;
    }

    const annotation = event?.annotation;
    const annotationId = viewerAnnotationId(annotation);
    if (!annotationId || isCatalystEvidenceViewerAnnotation(annotation)) return;

    if (event.type === "create") {
      // Remember the ID even if the viewer adapter first reports an uncommitted create;
      // a later committed update must still be recognized as workspace-owned.
      managedIds.add(annotationId);
    }

    if (event.type === "delete") {
      if (!managedIds.has(annotationId) || !event.committed) return;
      managedIds.delete(annotationId);
      bumpRevision(annotationId);
      handlers.onDelete(annotationId);
      return;
    }

    if (event.type !== "create" && event.type !== "update") return;
    if (!managedIds.has(annotationId) || !event.committed) return;

    const pageIndex = Number(event.pageIndex ?? annotation?.pageIndex ?? 0);
    if (!Number.isFinite(pageIndex) || pageIndex < 0) return;
    const revision = bumpRevision(annotationId);

    void exportViewerMarkupById(
      scope,
      documentId,
      Math.trunc(pageIndex),
      annotationId,
      handlers.getMarkup(annotationId),
    )
      .then((markup) => {
        if (!markup) return;
        if (!managedIds.has(annotationId)) return;
        if (revisions.get(annotationId) !== revision) return;

        const previous = handlers.getMarkup(annotationId);
        if (previous && sameMarkupContent(previous, markup)) return;
        handlers.onUpsert(markup);
      })
      .catch((error) => handlers.onError?.(error));
  });

  // A document may already have emitted `loaded` before Catalyst gets the
  // listener. Immediate restore covers that case; the loaded-event restore
  // covers the opposite race where the PDF's initial annotation load wins later.
  void restore();

  return typeof unsubscribe === "function" ? unsubscribe : () => {};
}

/**
 * Subscribe to the viewer adapter's definitive initial-annotation-load event for one
 * document. The plugin can load the PDF's native annotations after the
 * document-manager reports the document as open; imports performed before
 * this event may be overwritten by that initial load.
 *
 * Catalyst therefore keeps its durable annotation data outside the PDF and
 * replays it after `loaded`. The immediate reconciliation in App still covers
 * documents whose annotation load completed before this listener was attached.
 */
export function subscribeToDocumentAnnotationLoad(
  registry: RegistryLike,
  documentId: string,
  onLoaded: () => void,
): () => void {
  const scope = annotationScope(registry, documentId);
  return subscribeToInitialAnnotationLoad(scope, onLoaded);
}

function viewerTransferItems(annotation: Annotation) {
  return annotation.anchors.flatMap((anchor, anchorIndex) => {
    const rect = normalizeRect(anchor.rect);
    const segmentRects = segmentRectsForAnchor(anchor);
    if (!rect || segmentRects.length === 0) return [];

    return [
      {
        viewerId: viewerHighlightId(annotation.id, anchorIndex),
        pageIndex: anchor.pageIndex,
        transferItem: {
          annotation: {
            id: viewerHighlightId(annotation.id, anchorIndex),
            type: 9,
            pageIndex: anchor.pageIndex,
            rect,
            segmentRects,
            color: "#F2D76B",
            opacity: 0.38,
            flags: ["readOnly"],
            contents: annotation.quote,
            custom: {
              catalystManaged: true,
              catalystAnnotationId: annotation.id,
              catalystAnchorIndex: anchorIndex,
              catalystAnalyticPurpose: annotation.analyticPurpose ?? null,
              catalystVisual: annotation.visual ?? null,
            },
          },
        },
      },
    ];
  });
}

/**
 * Reconcile Catalyst highlight records into an open the viewer adapter document.
 *
 * Only logical annotations with kind="highlight" are rendered. Excerpts stay
 * evidence-only. The source PDF is never written: imported viewer annotations
 * live in the in-memory document and are reconstructed from Catalyst state the
 * next time the PDF opens.
 */
export function reconcileDocumentOverlays(
  registry: RegistryLike,
  documentId: string,
  annotations: Annotation[],
): { imported: number; removed: number } {
  const scope = annotationScope(registry, documentId);
  if (!scope?.importAnnotations || !scope?.deleteAnnotation) {
    return { imported: 0, removed: 0 };
  }

  let tracked = trackedViewerHighlights.get(documentId);
  if (!tracked) {
    tracked = new Map<string, TrackedViewerHighlight>();
    trackedViewerHighlights.set(documentId, tracked);
  }

  const desired = new Map<
    string,
    { pageIndex: number; transferItem: any }
  >();

  for (const annotation of annotations) {
    if (annotation.documentId !== documentId) continue;
    for (const item of viewerTransferItems(annotation)) {
      desired.set(item.viewerId, {
        pageIndex: item.pageIndex,
        transferItem: item.transferItem,
      });
    }
  }

  let removed = 0;
  for (const [viewerId, existing] of [...tracked.entries()]) {
    if (desired.has(viewerId)) continue;
    try {
      scope.deleteAnnotation(existing.pageIndex, viewerId);
      removed += 1;
    } catch (error) {
      console.warn("Could not remove Catalyst highlight from viewer", error);
    } finally {
      tracked.delete(viewerId);
    }
  }

  const imports: any[] = [];
  const importedItems: Array<[string, TrackedViewerHighlight]> = [];

  for (const [viewerId, item] of desired) {
    if (tracked.has(viewerId)) continue;
    imports.push(item.transferItem);
    importedItems.push([viewerId, { pageIndex: item.pageIndex }]);
  }

  if (imports.length > 0) {
    scope.importAnnotations(imports);
    for (const [viewerId, metadata] of importedItems) {
      tracked.set(viewerId, metadata);
    }
  }

  return { imported: imports.length, removed };
}

/** Clear only Catalyst's local bookkeeping when the viewer adapter closes a document. */
export function forgetDocumentHighlightTracking(documentId: string): void {
  trackedViewerHighlights.delete(documentId);
}

export async function readSelection(
  documentId: string,
  documentName: string,
  scope: any,
): Promise<PendingSelection | null> {
  const lines = await scope.getSelectedText().toPromise();
  const quote = Array.isArray(lines)
    ? lines.join(" ").replace(/\s+/g, " ").trim()
    : "";

  if (!quote) return null;

  const anchors = normalizeFormattedSelection(scope.getFormattedSelection());
  const pageIndex = anchors[0]?.pageIndex ?? 0;
  const range = scope.getState?.()?.selection;
  const sourceRange =
    Number.isInteger(range?.start?.page) &&
    Number.isInteger(range?.start?.index) &&
    Number.isInteger(range?.end?.page) &&
    Number.isInteger(range?.end?.index)
      ? {
          start: { page: range.start.page, index: range.start.index },
          end: { page: range.end.page, index: range.end.index },
        }
      : undefined;

  return {
    documentId,
    documentName,
    quote,
    pageIndex,
    anchors,
    sourceRange,
    capturedAt: new Date().toISOString(),
  };
}

export async function openPdfSource(
  registry: RegistryLike,
  source: PdfSource,
): Promise<string> {
  const documentManager = registry.getPlugin("document-manager")?.provides();
  if (!documentManager) throw new Error("Document manager unavailable");

  // Give the viewer adapter its own buffer. This prevents the viewer from taking ownership
  // of memory that Catalyst may still need for identity or later operations.
  const owned = new Uint8Array(source.bytes);
  const result = documentManager.openDocumentBuffer({
    buffer: owned.buffer,
    name: source.name,
    documentId: source.documentId,
    autoActivate: true,
  });

  if (typeof result?.toPromise === "function") {
    await result.toPromise();
  } else {
    await result;
  }

  return source.documentId;
}

function scrollScope(registry: RegistryLike, documentId: string): {
  capability: any;
  scope: any;
} {
  const capability = registry.getPlugin("scroll")?.provides();
  if (!capability) throw new Error("PDF scroll capability unavailable");

  const scope = capability.forDocument?.(documentId) ?? capability;
  if (!scope?.scrollToPage) throw new Error("PDF document scroll scope unavailable");

  return { capability, scope };
}

export function jumpToPage(
  registry: RegistryLike,
  documentId: string,
  pageIndex: number,
  behavior: "smooth" | "instant" = "smooth",
): void {
  const { scope } = scrollScope(registry, documentId);
  scope.scrollToPage({
    pageNumber: pageIndex + 1,
    behavior,
  });
}

/**
 * Navigate to a page even when the document has only just been opened or
 * reactivated.
 *
 * the viewer adapter calculates document layout asynchronously. A direct scroll works for
 * documents whose layout already exists, while onLayoutReady is the reliable
 * signal for newly opened/switching documents. We do both: attempt immediately,
 * keep a short-lived layout listener, and perform one bounded fallback attempt.
 */
export async function jumpToPageWhenReady(
  registry: RegistryLike,
  documentId: string,
  pageIndex: number,
  options: {
    behavior?: "smooth" | "instant";
    timeoutMs?: number;
  } = {},
): Promise<void> {
  const { capability, scope } = scrollScope(registry, documentId);
  const behavior = options.behavior ?? "smooth";
  const timeoutMs = options.timeoutMs ?? 1500;

  let unsubscribe: (() => void) | undefined;
  let timeoutId: number | undefined;
  let finished = false;

  const performJump = () => {
    scope.scrollToPage({
      pageNumber: pageIndex + 1,
      behavior,
    });
  };

  const finish = (resolve: () => void) => {
    if (finished) return;
    finished = true;
    if (timeoutId !== undefined) window.clearTimeout(timeoutId);
    unsubscribe?.();
    resolve();
  };

  await new Promise<void>((resolve) => {
    if (typeof capability.onLayoutReady === "function") {
      const maybeUnsubscribe = capability.onLayoutReady((event: any) => {
        if (event?.documentId !== documentId) return;
        try {
          performJump();
        } finally {
          finish(resolve);
        }
      });
      if (typeof maybeUnsubscribe === "function") unsubscribe = maybeUnsubscribe;
    }

    // Already-laid-out documents should move immediately. If the layout is not
    // ready yet, the viewer adapter may simply ignore this and the listener above handles
    // the eventual navigation.
    try {
      performJump();
    } catch {
      // Layout-ready or timeout retry below owns recovery.
    }

    timeoutId = window.setTimeout(() => {
      try {
        performJump();
      } finally {
        finish(resolve);
      }
    }, timeoutMs);
  });
}


export type ViewerPageChange = {
  documentId: string;
  pageIndex: number;
  totalPages: number;
};

/**
 * Keep Catalyst's research-navigation snapshot in sync with ordinary PDF
 * scrolling without turning every page change into a history entry.
 */
export function subscribeToPageChanges(
  registry: RegistryLike,
  onPageChange: (event: ViewerPageChange) => void,
): () => void {
  const scroll = registry.getPlugin("scroll")?.provides();
  if (!scroll || typeof scroll.onPageChange !== "function") return () => {};

  const unsubscribe = scroll.onPageChange((event: any) => {
    const documentId = String(event?.documentId ?? "").trim();
    const pageNumber = Number(event?.pageNumber);
    const totalPages = Number(event?.totalPages ?? 0);
    if (!documentId || !Number.isFinite(pageNumber) || pageNumber < 1) return;

    onPageChange({
      documentId,
      pageIndex: Math.trunc(pageNumber) - 1,
      totalPages: Number.isFinite(totalPages) ? Math.max(0, Math.trunc(totalPages)) : 0,
    });
  });

  return typeof unsubscribe === "function" ? unsubscribe : () => {};
}

export async function restoreViewerSelection(
  registry: RegistryLike,
  documentId: string,
  range: PendingSelection["sourceRange"],
): Promise<boolean> {
  if (!range) return false;
  const selection = registry.getPlugin("selection")?.provides();
  const scope = selection?.forDocument?.(documentId) ?? selection;
  if (!scope?.setSelection) return false;

  const task = scope.setSelection(range);
  if (task && typeof task.toPromise === "function") {
    await task.toPromise();
  } else if (task && typeof task.wait === "function") {
    await new Promise<void>((resolve, reject) => task.wait(resolve, reject));
  } else {
    await task;
  }
  return true;
}

export function clearViewerSelection(
  registry: RegistryLike,
  documentId: string,
): void {
  const selection = registry.getPlugin("selection")?.provides();
  selection?.forDocument?.(documentId)?.clear?.();
}

export function activateDocument(
  registry: RegistryLike,
  documentId: string,
): boolean {
  const documentManager = registry.getPlugin("document-manager")?.provides();
  if (!documentManager?.isDocumentOpen?.(documentId)) return false;
  documentManager.setActiveDocument(documentId);
  return true;
}
