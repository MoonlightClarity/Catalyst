import type {
  Annotation,
  PendingSelection,
  SelectionAnchor,
  SourceSelectionRange,
} from "./types";

type SourceRegionLike = Pick<
  PendingSelection,
  "documentId" | "quote" | "pageIndex" | "anchors" | "sourceRange"
>;

export function sanitizeSourceSelectionRange(value: unknown): SourceSelectionRange | undefined {
  const item = value as any;
  const startPage = Number(item?.start?.page);
  const startIndex = Number(item?.start?.index);
  const endPage = Number(item?.end?.page);
  const endIndex = Number(item?.end?.index);
  if (![startPage, startIndex, endPage, endIndex].every(Number.isInteger)) return undefined;
  if (startPage < 0 || startIndex < 0 || endPage < 0 || endIndex < 0) return undefined;
  return {
    start: { page: startPage, index: startIndex },
    end: { page: endPage, index: endIndex },
  };
}

function normalizedQuote(value: string): string {
  return value.replace(/\s+/g, " ").trim().toLowerCase();
}
function normalizedRange(range: SourceSelectionRange): SourceSelectionRange {
  const before =
    range.start.page < range.end.page ||
    (range.start.page === range.end.page && range.start.index <= range.end.index);
  return before ? range : { start: range.end, end: range.start };
}

export function sourceRangesEqual(
  left: SourceSelectionRange,
  right: SourceSelectionRange,
): boolean {
  const a = normalizedRange(left);
  const b = normalizedRange(right);
  return a.start.page === b.start.page &&
    a.start.index === b.start.index &&
    a.end.page === b.end.page &&
    a.end.index === b.end.index;
}

type AnchorRect = {
  pageIndex: number;
  x: number;
  y: number;
  width: number;
  height: number;
};

function anchorRect(anchor: SelectionAnchor): AnchorRect | null {
  const rect = anchor.rect as any;
  const values = [rect?.origin?.x, rect?.origin?.y, rect?.size?.width, rect?.size?.height].map(Number);
  if (!values.every(Number.isFinite) || values[2] <= 0 || values[3] <= 0) return null;
  return { pageIndex: anchor.pageIndex, x: values[0], y: values[1], width: values[2], height: values[3] };
}
function rectIou(left: AnchorRect, right: AnchorRect): number {
  if (left.pageIndex !== right.pageIndex) return 0;
  const x1 = Math.max(left.x, right.x);
  const y1 = Math.max(left.y, right.y);
  const x2 = Math.min(left.x + left.width, right.x + right.width);
  const y2 = Math.min(left.y + left.height, right.y + right.height);
  const intersection = Math.max(0, x2 - x1) * Math.max(0, y2 - y1);
  const union = left.width * left.height + right.width * right.height - intersection;
  return union > 0 ? intersection / union : 0;
}

function overlayMutationEquivalent(left: SourceRegionLike, right: SourceRegionLike): boolean {
  if (!left.sourceRange || !right.sourceRange) return false;
  const a = normalizedRange(left.sourceRange);
  const b = normalizedRange(right.sourceRange);
  if (a.start.page !== a.end.page || b.start.page !== b.end.page) return false;
  if (a.start.page !== b.start.page || a.start.index !== b.start.index) return false;
  const aSpan = a.end.index - a.start.index + 1;
  const bSpan = b.end.index - b.start.index + 1;
  if (Math.min(aSpan, bSpan) / Math.max(aSpan, bSpan) < 0.8) return false;
  const qa = normalizedQuote(left.quote);
  const qb = normalizedQuote(right.quote);
  const short = qa.length <= qb.length ? qa : qb;
  const long = qa.length > qb.length ? qa : qb;
  if (!long.startsWith(short) || short.length / long.length < 0.8) return false;
  const ra = left.anchors[0] ? anchorRect(left.anchors[0]) : null;
  const rb = right.anchors[0] ? anchorRect(right.anchors[0]) : null;
  return Boolean(ra && rb && Math.abs(ra.x - rb.x) <= 1.5 && Math.abs(ra.y - rb.y) <= 1.5 && rectIou(ra, rb) >= 0.85);
}
function legacyIdentity(region: SourceRegionLike): string {
  return JSON.stringify({
    documentId: region.documentId,
    quote: region.quote,
    pageIndex: region.pageIndex,
    anchors: region.anchors,
  });
}

export function sourceRegionIdentity(region: SourceRegionLike): string {
  return JSON.stringify({
    documentId: region.documentId,
    pageIndex: region.pageIndex,
    sourceRange: region.sourceRange ? normalizedRange(region.sourceRange) : null,
    quote: normalizedQuote(region.quote),
    anchors: region.anchors,
  });
}

export function sourceRegionsEquivalent(left: SourceRegionLike, right: SourceRegionLike): boolean {
  if (left.documentId !== right.documentId || left.pageIndex !== right.pageIndex) return false;
  if (left.sourceRange && right.sourceRange && sourceRangesEqual(left.sourceRange, right.sourceRange)) return true;
  if (overlayMutationEquivalent(left, right)) return true;
  return legacyIdentity(left) === legacyIdentity(right);
}

export function reusableSourceRegion(
  annotations: Record<string, Annotation>,
  selection: PendingSelection,
): Annotation | null {
  return Object.values(annotations).find((annotation) => sourceRegionsEquivalent(annotation, selection)) ?? null;
}
