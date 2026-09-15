import {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
  type CSSProperties,
} from "react";
import {
  AnnotationEditorType,
  getDocument,
  GlobalWorkerOptions,
  type PDFDocumentProxy,
} from "pdfjs-dist";
import {
  EventBus,
  FindState,
  PDFFindController,
  PDFLinkService,
  PDFViewer,
} from "pdfjs-dist/web/pdf_viewer.mjs";
import workerSrc from "pdfjs-dist/build/pdf.worker.mjs?url";
import "pdfjs-dist/web/pdf_viewer.css";
import {
  ANALYTIC_MARK_GLYPH_PATHS,
  InstrumentGlyph,
} from "../ui/CatalystSymbols";
import type { RegistryLike } from "./viewerBridge";

GlobalWorkerOptions.workerSrc = workerSrc;

type FindUiState = "idle" | "pending" | "found" | "not-found" | "wrapped";

const READER_POSITION_STORAGE_KEY = "catalyst:pdf-reader:last-page-by-document";

type ThoriumPdfReaderProps = {
  onReady?: (registry: RegistryLike) => void;
  style?: CSSProperties;
};

type OpenDocument = {
  id: string;
  name: string;
  pdf: PDFDocumentProxy;
};


type SelectionSnapshot = {
  quote: string;
  formatted: Array<{
    pageIndex: number;
    rect: PdfRect;
    textLines: Array<{ rect: PdfRect }>;
  }>;
};

type PdfRect = {
  origin: { x: number; y: number };
  size: { width: number; height: number };
};

type Listener<T> = (event: T) => void;
function subscribe<T>(listeners: Set<Listener<T>>, listener: Listener<T>) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

function task<T>(value: T) {
  return { toPromise: async () => value };
}

function area(rect: DOMRect) {
  return Math.max(0, rect.width) * Math.max(0, rect.height);
}

function appendAnalyticMarkerGlyph(
  marker: HTMLElement,
  purpose: keyof typeof ANALYTIC_MARK_GLYPH_PATHS,
) {
  const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
  svg.setAttribute("viewBox", "0 0 24 24");
  svg.setAttribute("fill", "none");
  svg.setAttribute("stroke", "currentColor");
  svg.setAttribute("stroke-width", "1.55");
  svg.setAttribute("stroke-linecap", "square");
  svg.setAttribute("stroke-linejoin", "miter");
  svg.setAttribute("aria-hidden", "true");
  svg.classList.add("instrument-glyph");
  for (const d of ANALYTIC_MARK_GLYPH_PATHS[purpose]) {
    const path = document.createElementNS("http://www.w3.org/2000/svg", "path");
    path.setAttribute("d", d);
    svg.appendChild(path);
  }
  marker.appendChild(svg);
}

function intersectionArea(a: DOMRect, b: DOMRect) {
  const width = Math.max(0, Math.min(a.right, b.right) - Math.max(a.left, b.left));
  const height = Math.max(0, Math.min(a.bottom, b.bottom) - Math.max(a.top, b.top));
  return width * height;
}

function bestPageForRect(container: HTMLElement, rect: DOMRect) {
  let best: HTMLElement | null = null;
  let bestArea = 0;
  for (const page of container.querySelectorAll<HTMLElement>(".page[data-page-number]")) {
    const overlap = intersectionArea(rect, page.getBoundingClientRect());
    if (overlap > bestArea) {
      bestArea = overlap;
      best = page;
    }
  }
  return bestArea > 0 ? best : null;
}
function unionRects(rects: PdfRect[]): PdfRect | null {
  if (rects.length === 0) return null;
  const left = Math.min(...rects.map((rect) => rect.origin.x));
  const top = Math.min(...rects.map((rect) => rect.origin.y));
  const right = Math.max(...rects.map((rect) => rect.origin.x + rect.size.width));
  const bottom = Math.max(...rects.map((rect) => rect.origin.y + rect.size.height));
  return {
    origin: { x: left, y: top },
    size: { width: right - left, height: bottom - top },
  };
}

function clientRectToPdfRect(
  pdfViewer: any,
  page: HTMLElement,
  rect: DOMRect,
): { pageIndex: number; rect: PdfRect } | null {
  const pageIndex = Number(page.dataset.pageNumber ?? "1") - 1;
  const viewport = pdfViewer.getPageView?.(pageIndex)?.viewport;
  if (!viewport?.convertToPdfPoint) return null;
  const pageRect = page.getBoundingClientRect();
  const [x1, y1] = viewport.convertToPdfPoint(rect.left - pageRect.left, rect.top - pageRect.top);
  const [x2, y2] = viewport.convertToPdfPoint(rect.right - pageRect.left, rect.bottom - pageRect.top);
  return {
    pageIndex,
    rect: {
      origin: { x: Math.min(x1, x2), y: Math.min(y1, y2) },
      size: { width: Math.abs(x2 - x1), height: Math.abs(y2 - y1) },
    },
  };
}
export const ThoriumPdfReader = forwardRef<any, ThoriumPdfReaderProps>(
  function ThoriumPdfReader({ onReady, style }, ref) {
    const shellRef = useRef<HTMLDivElement>(null);
    const containerRef = useRef<HTMLDivElement>(null);
    const viewerElementRef = useRef<HTMLDivElement>(null);
    const searchInputRef = useRef<HTMLInputElement>(null);
    const registryRef = useRef<RegistryLike | null>(null);
    const pdfViewerRef = useRef<any>(null);
    const eventBusRef = useRef<any>(null);
    const activeDocumentIdRef = useRef<string | null>(null);
    const selectionSnapshotRef = useRef<SelectionSnapshot | null>(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(0);
    const [fullscreenActive, setFullscreenActive] = useState(false);
    const [searchOpen, setSearchOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");
    const [searchCaseSensitive, setSearchCaseSensitive] = useState(false);
    const [searchEntireWord, setSearchEntireWord] = useState(false);
    const [searchMatchDiacritics, setSearchMatchDiacritics] = useState(false);
    const [searchMatches, setSearchMatches] = useState({ current: 0, total: 0 });
    const [searchStatus, setSearchStatus] = useState<FindUiState>("idle");
    const [darkMode, setDarkMode] = useState(() => {
      try {
        return window.localStorage.getItem("catalyst:pdf-reader:dark-mode") === "true";
      } catch {
        return false;
      }
    });


    useImperativeHandle(ref, () => ({
      get registry() {
        return registryRef.current;
      },
    }), []);

    useEffect(() => {
      const container = containerRef.current;
      const viewerElement = viewerElementRef.current;
      if (!container || !viewerElement) return;
      const eventBus = new EventBus();
      const linkService = new PDFLinkService({ eventBus });
      const findController = new PDFFindController({ eventBus, linkService });
      const pdfViewer = new PDFViewer({
        container,
        viewer: viewerElement,
        eventBus,
        linkService,
        findController,
        annotationEditorMode: AnnotationEditorType.DISABLE,
        removePageBorders: false,
      });
      linkService.setViewer(pdfViewer);
      pdfViewerRef.current = pdfViewer;
      eventBusRef.current = eventBus;

      const documents = new Map<string, OpenDocument>();
      const openedListeners = new Set<Listener<any>>();
      const activeListeners = new Set<Listener<any>>();
      const closedListeners = new Set<Listener<any>>();
      const pageListeners = new Set<Listener<any>>();
      const layoutListeners = new Set<Listener<any>>();
      const selectionListeners = new Set<Listener<void>>();
      const navigationListeners = new Set<Listener<any>>();
      const pageByDocument = new Map<string, number>();
      const persistedPageByDocument = new Map<string, number>();
      try {
        const raw = window.localStorage.getItem(READER_POSITION_STORAGE_KEY);
        const parsed = raw ? JSON.parse(raw) : null;
        if (parsed && typeof parsed === "object") {
          for (const [documentId, pageNumber] of Object.entries(parsed)) {
            const value = Number(pageNumber);
            if (documentId && Number.isInteger(value) && value >= 1) {
              persistedPageByDocument.set(documentId, value);
            }
          }
        }
      } catch {
        // Reader resume state is opportunistic and must never block document loading.
      }
      let persistReaderPositionTimer: number | null = null;
      const persistReaderPositions = () => {
        persistReaderPositionTimer = null;
        try {
          window.localStorage.setItem(
            READER_POSITION_STORAGE_KEY,
            JSON.stringify(Object.fromEntries(persistedPageByDocument)),
          );
        } catch {
          // Ignore storage failures; in-memory position restoration still works.
        }
      };
      const scheduleReaderPositionPersist = () => {
        if (persistReaderPositionTimer !== null) window.clearTimeout(persistReaderPositionTimer);
        persistReaderPositionTimer = window.setTimeout(persistReaderPositions, 450);
      };
      let pendingRestore: { documentId: string; pageNumber: number } | null = null;
      let pendingIntentionalJump: {
        documentId: string;
        fromPageNumber: number;
        reason: "link" | "search";
      } | null = null;
      const markIntentionalJump = (reason: "link" | "search") => {
        const documentId = activeDocumentIdRef.current;
        if (!documentId) return;
        const fromPageNumber = Math.max(1, Number(pdfViewer.currentPageNumber) || 1);
        pendingIntentionalJump = { documentId, fromPageNumber, reason };
      };
      const emitPendingIntentionalJump = (documentId: string, pageNumber: number) => {
        const pending = pendingIntentionalJump;
        if (!pending || pending.documentId !== documentId) return;
        pendingIntentionalJump = null;
        if (pending.fromPageNumber === pageNumber) return;
        const event = {
          reason: pending.reason,
          from: { documentId, pageIndex: pending.fromPageNumber - 1 },
          to: { documentId, pageIndex: pageNumber - 1 },
        };
        for (const listener of navigationListeners) listener(event);
      };
      const originalGoToDestination = linkService.goToDestination.bind(linkService);
      linkService.goToDestination = ((destination: any) => {
        markIntentionalJump("link");
        const result = originalGoToDestination(destination);
        Promise.resolve(result).finally(() => {
          const documentId = activeDocumentIdRef.current;
          if (!documentId) return;
          const pageNumber = Math.max(1, Number(pdfViewer.currentPageNumber) || 1);
          emitPendingIntentionalJump(documentId, pageNumber);
        });
        return result;
      }) as typeof linkService.goToDestination;
      const annotationListeners = new Map<string, Set<Listener<any>>>();
      const annotationItems = new Map<string, Map<string, any>>();
      const emitAnnotation = (documentId: string, event: any) => {
        for (const listener of annotationListeners.get(documentId) ?? []) {
          listener(event);
        }
      };


      const renderHighlights = () => {
        const documentId = activeDocumentIdRef.current;
        if (!documentId) return;
        const stored = annotationItems.get(documentId);

        for (const page of container.querySelectorAll<HTMLElement>(".page[data-page-number]")) {
          let layer = page.querySelector<HTMLElement>(".catalyst-pdf-highlight-layer");
          if (!layer) {
            layer = document.createElement("div");
            layer.className = "catalyst-pdf-highlight-layer";
            page.appendChild(layer);
          }
          layer.replaceChildren();
        }

        for (const item of stored?.values() ?? []) {
          const annotation = item?.annotation;
          if (!annotation?.custom?.catalystManaged) continue;
          const pageIndex = Number(annotation?.pageIndex);
          if (!Number.isFinite(pageIndex)) continue;
          const page = container.querySelector<HTMLElement>(
            `.page[data-page-number="${pageIndex + 1}"]`,
          );
          const viewport = pdfViewer.getPageView?.(pageIndex)?.viewport;
          const layer = page?.querySelector<HTMLElement>(".catalyst-pdf-highlight-layer");
          if (!page || !viewport?.convertToViewportRectangle || !layer) continue;

          const visual = annotation?.custom?.catalystVisual;
          const rects = visual === "frame"
            ? [annotation?.rect]
            : Array.isArray(annotation?.segmentRects) && annotation.segmentRects.length > 0
              ? annotation.segmentRects
              : [annotation?.rect];
          const purpose = annotation?.custom?.catalystAnalyticPurpose;
          const screenRects: Array<{ left: number; top: number; right: number; bottom: number }> = [];
          for (const rect of rects) {
            const x = Number(rect?.origin?.x);
            const y = Number(rect?.origin?.y);
            const width = Number(rect?.size?.width);
            const height = Number(rect?.size?.height);
            if (![x, y, width, height].every(Number.isFinite)) continue;
            const [vx1, vy1, vx2, vy2] = viewport.convertToViewportRectangle([
              x,
              y,
              x + width,
              y + height,
            ]);
            screenRects.push({
              left: Math.min(vx1, vx2),
              top: Math.min(vy1, vy2),
              right: Math.max(vx1, vx2),
              bottom: Math.max(vy1, vy2),
            });
          }
          if (screenRects.length === 0) continue;

          const bounds = {
            left: Math.min(...screenRects.map((rect) => rect.left)),
            top: Math.min(...screenRects.map((rect) => rect.top)),
            right: Math.max(...screenRects.map((rect) => rect.right)),
            bottom: Math.max(...screenRects.map((rect) => rect.bottom)),
          };
          const contents = String(annotation?.contents ?? "");

          if (visual === "frame") {
            const frame = document.createElement("div");
            frame.className = "catalyst-analytic-frame";
            frame.style.left = `${bounds.left}px`;
            frame.style.top = `${bounds.top}px`;
            frame.style.width = `${bounds.right - bounds.left}px`;
            frame.style.height = `${bounds.bottom - bounds.top}px`;
            frame.title = `Analytic frame: ${contents}`;
            layer.appendChild(frame);
            continue;
          }

          if (purpose === "key-evidence") {
            const rail = document.createElement("div");
            rail.className = "catalyst-analytic-mark catalyst-key-evidence-rail";
            rail.style.left = `${Math.max(1, bounds.left - 10)}px`;
            rail.style.top = `${bounds.top}px`;
            rail.style.height = `${Math.max(12, bounds.bottom - bounds.top)}px`;
            rail.setAttribute("aria-label", "Key evidence mark");
            rail.title = `Key evidence: ${contents}`;
            layer.appendChild(rail);
            continue;
          }

          if (purpose === "contradiction") {
            const marker = document.createElement("div");
            marker.className = "catalyst-analytic-mark catalyst-conflict-mark";
            appendAnalyticMarkerGlyph(marker, "contradiction");
            marker.style.left = `${Math.max(0, Math.min(page.clientWidth - 24, bounds.right + 4))}px`;
            marker.style.top = `${Math.max(0, bounds.top - 2)}px`;
            marker.setAttribute("aria-label", "Contradiction mark");
            marker.title = `Contradiction: ${contents}`;
            layer.appendChild(marker);
            continue;
          }

          if (purpose === "uncertain") {
            const frame = document.createElement("div");
            frame.className = "catalyst-analytic-mark catalyst-confidence-frame";
            frame.style.left = `${Math.max(0, bounds.left - 2)}px`;
            frame.style.top = `${Math.max(0, bounds.top - 2)}px`;
            frame.style.width = `${bounds.right - bounds.left + 4}px`;
            frame.style.height = `${bounds.bottom - bounds.top + 4}px`;
            const badge = document.createElement("div");
            badge.className = "catalyst-confidence-badge";
            appendAnalyticMarkerGlyph(badge, "uncertain");
            frame.appendChild(badge);
            frame.setAttribute("aria-label", "Confidence concern mark");
            frame.title = `Confidence concern: ${contents}`;
            layer.appendChild(frame);
            continue;
          }

          if (purpose === "follow-up") {
            const flag = document.createElement("div");
            flag.className = "catalyst-analytic-mark catalyst-information-gap-flag";
            flag.style.left = `${Math.max(0, Math.min(page.clientWidth - 24, bounds.right + 4))}px`;
            flag.style.top = `${Math.max(0, bounds.top - 2)}px`;
            flag.style.height = `${Math.max(24, bounds.bottom - bounds.top + 4)}px`;
            appendAnalyticMarkerGlyph(flag, "follow-up");
            flag.setAttribute("aria-label", "Information gap mark");
            flag.title = `Information gap: ${contents}`;
            layer.appendChild(flag);
            continue;
          }

          for (const rect of screenRects) {
            const mark = document.createElement("div");
            mark.className = "catalyst-pdf-highlight";
            mark.style.left = `${rect.left}px`;
            mark.style.top = `${rect.top}px`;
            mark.style.width = `${rect.right - rect.left}px`;
            mark.style.height = `${rect.bottom - rect.top}px`;
            layer.appendChild(mark);
          }
        }
      };


      const activate = async (documentId: string) => {
        const entry = documents.get(documentId);
        if (!entry) return false;
        const rememberedPage = pageByDocument.get(documentId)
          ?? persistedPageByDocument.get(documentId)
          ?? 1;
        const restorePage = Math.max(1, Math.min(rememberedPage, entry.pdf.numPages));
        pendingIntentionalJump = null;
        pendingRestore = { documentId, pageNumber: restorePage };
        activeDocumentIdRef.current = documentId;
        selectionSnapshotRef.current = null;
        pdfViewer.setDocument(entry.pdf);
        linkService.setDocument(entry.pdf);
        findController.setDocument(entry.pdf);
        try {
          pdfViewer.annotationEditorMode = { mode: AnnotationEditorType.DISABLE };
        } catch {
          // Some PDF.js builds do not accept editor mode changes until pages initialize.
        }
        setCurrentPage(restorePage);
        setTotalPages(entry.pdf.numPages);
        for (const listener of activeListeners) {
          listener({ current: { id: entry.id, name: entry.name } });
        }
        return true;
      };

      const openDocumentBuffer = async ({ buffer, name, documentId, autoActivate = true }: any) => {
        const pdf = await getDocument({ data: new Uint8Array(buffer) }).promise;
        const entry = { id: documentId, name, pdf } satisfies OpenDocument;
        documents.set(documentId, entry);
        for (const listener of openedListeners) {
          listener({ id: documentId, name });
        }
        if (autoActivate) await activate(documentId);
        return { id: documentId, name };
      };

      const scrollToPage = (documentId: string, pageNumber: number) => {
        const move = () => {
          const max = pdfViewer.pagesCount || pageNumber;
          const clamped = Math.max(1, Math.min(pageNumber, max));
          pdfViewer.currentPageNumber = clamped;
          pdfViewer.scrollPageIntoView?.({ pageNumber: clamped });
        };
        if (activeDocumentIdRef.current !== documentId) {
          void activate(documentId).then((activated) => {
            if (activated) window.requestAnimationFrame(move);
          });
        } else {
          move();
        }
      };

      const annotationScope = (documentId: string) => ({
        onAnnotationEvent(listener: Listener<any>) {
          let listeners = annotationListeners.get(documentId);
          if (!listeners) annotationListeners.set(documentId, (listeners = new Set()));
          return subscribe(listeners, listener);
        },
        exportAnnotations(options?: { pageIndex?: number }) {
          const items = [...(annotationItems.get(documentId)?.values() ?? [])];
          const pageIndex = options?.pageIndex;
          return task(
            pageIndex === undefined
              ? items
              : items.filter((item) => Number(item?.annotation?.pageIndex) === pageIndex),
          );
        },
        importAnnotations(items: any[]) {
          let stored = annotationItems.get(documentId);
          if (!stored) annotationItems.set(documentId, (stored = new Map()));
          for (const item of Array.isArray(items) ? items : []) {
            const id = String(item?.annotation?.id ?? "").trim();
            if (!id) continue;
            stored.set(id, item);
            emitAnnotation(documentId, {
              type: "create",
              committed: true,
              pageIndex: item.annotation?.pageIndex,
              annotation: item.annotation,
            });
          }
          window.requestAnimationFrame(renderHighlights);
          return task(undefined);
        },
        deleteAnnotation(_pageIndex: number, annotationId: string) {
          const stored = annotationItems.get(documentId);
          const item = stored?.get(annotationId);
          if (!stored || !item) return false;
          stored.delete(annotationId);
          emitAnnotation(documentId, {
            type: "delete",
            committed: true,
            pageIndex: item.annotation?.pageIndex,
            annotation: item.annotation,
          });
          window.requestAnimationFrame(renderHighlights);
          return true;
        },
      });

      const readDomSelection = (): SelectionSnapshot | null => {
        const selection = window.getSelection();
        const quote = selection?.toString().replace(/\s+/g, " ").trim() ?? "";
        if (!selection || selection.rangeCount === 0 || !quote) return null;
        const range = selection.getRangeAt(0);
        if (!container.contains(range.commonAncestorContainer)) return null;
        const byPage = new Map<number, PdfRect[]>();

        for (const clientRect of Array.from(range.getClientRects())) {
          if (area(clientRect) <= 0.5) continue;
          const page = bestPageForRect(container, clientRect);
          if (!page) continue;
          const converted = clientRectToPdfRect(pdfViewer, page, clientRect);
          if (!converted) continue;
          const rects = byPage.get(converted.pageIndex) ?? [];
          rects.push(converted.rect);
          byPage.set(converted.pageIndex, rects);
        }

        const formatted = [...byPage.entries()].flatMap(([pageIndex, rects]) => {
          const rect = unionRects(rects);
          if (!rect) return [];
          return [{
            pageIndex,
            rect,
            textLines: rects.map((lineRect) => ({ rect: lineRect })),
          }];
        });
        return formatted.length > 0 ? { quote, formatted } : null;
      };

      const selectionScope = (documentId: string) => ({
        getSelectedText() {
          const snapshot = activeDocumentIdRef.current === documentId
            ? selectionSnapshotRef.current ?? readDomSelection()
            : null;
          return task(snapshot?.quote ? [snapshot.quote] : []);
        },
        getFormattedSelection() {
          if (activeDocumentIdRef.current !== documentId) return [];
          return (selectionSnapshotRef.current ?? readDomSelection())?.formatted ?? [];
        },
        getState() {
          return { selection: null };
        },
        clear() {
          if (activeDocumentIdRef.current !== documentId) return;
          window.getSelection()?.removeAllRanges();
          selectionSnapshotRef.current = null;
        },
        onEndSelection(listener: Listener<void>) {
          return subscribe(selectionListeners, listener);
        },
      });

      const documentManager = {
        openDocumentBuffer,
        isDocumentOpen: (documentId: string) => documents.has(documentId),
        setActiveDocument: (documentId: string) => void activate(documentId),
        getActiveDocument: () => {
          const id = activeDocumentIdRef.current;
          const entry = id ? documents.get(id) : undefined;
          return entry ? { id: entry.id, name: entry.name } : null;
        },
        onDocumentOpened: (listener: Listener<any>) => subscribe(openedListeners, listener),
        onActiveDocumentChanged: (listener: Listener<any>) => subscribe(activeListeners, listener),
        onDocumentClosed: (listener: Listener<any>) => subscribe(closedListeners, listener),
        closeDocument(documentId: string) {
          const entry = documents.get(documentId);
          if (!entry) return false;
          documents.delete(documentId);
          annotationItems.delete(documentId);
          annotationListeners.delete(documentId);
          void entry.pdf.loadingTask.destroy();
          for (const listener of closedListeners) listener(documentId);
          if (activeDocumentIdRef.current === documentId) {
            activeDocumentIdRef.current = null;
            (pdfViewer as any).setDocument(null);
            setCurrentPage(1);
            setTotalPages(0);
            setSearchOpen(false);
            if (document.fullscreenElement === shellRef.current) void document.exitFullscreen();
            for (const listener of activeListeners) listener({ current: null });
          }
          return true;
        },
      };

      const scrollCapability = {
        forDocument: (documentId: string) => ({
          scrollToPage: ({ pageNumber }: { pageNumber: number }) => {
            scrollToPage(documentId, pageNumber);
          },
        }),
        onPageChange: (listener: Listener<any>) => subscribe(pageListeners, listener),
        onLayoutReady: (listener: Listener<any>) => subscribe(layoutListeners, listener),
      };
      const providers: Record<string, any> = {
        "document-manager": documentManager,
        "reader-navigation": {
          onIntentionalJump: (listener: Listener<any>) => subscribe(navigationListeners, listener),
        },
        scroll: scrollCapability,
        selection: { forDocument: (documentId: string) => selectionScope(documentId) },
        annotation: {
          forDocument: (documentId: string) => annotationScope(documentId),
        },
      };
      const registry: RegistryLike = {
        getPlugin(name: string) {
          const provider = providers[name];
          return provider ? { provides: () => provider } : undefined;
        },
      };

      const onPagesInit = () => {
        try {
          pdfViewer.currentScaleValue = "auto";
        } catch {
          // PDF.js can report pagesinit before the first page scale is available.
        }
        const documentId = activeDocumentIdRef.current;
        if (!documentId) return;
        const total = documents.get(documentId)?.pdf.numPages ?? 0;
        const requestedPage = pendingRestore?.documentId === documentId
          ? pendingRestore.pageNumber
          : pageByDocument.get(documentId) ?? persistedPageByDocument.get(documentId) ?? 1;
        const restorePage = Math.max(1, Math.min(requestedPage, Math.max(1, total)));
        pendingRestore = null;
        window.requestAnimationFrame(() => {
          if (activeDocumentIdRef.current !== documentId) return;
          pdfViewer.currentPageNumber = restorePage;
          pdfViewer.scrollPageIntoView?.({ pageNumber: restorePage });
        });
        for (const listener of layoutListeners) listener({ documentId, totalPages: total });
        emitAnnotation(documentId, { type: "loaded", total });
        window.requestAnimationFrame(renderHighlights);
      };
      const onPageChanging = ({ pageNumber }: any) => {
        const documentId = activeDocumentIdRef.current;
        if (!documentId) return;
        const total = documents.get(documentId)?.pdf.numPages ?? 0;
        const page = Math.max(1, Number(pageNumber) || 1);
        pageByDocument.set(documentId, page);
        persistedPageByDocument.set(documentId, page);
        scheduleReaderPositionPersist();
        setCurrentPage(page);
        setTotalPages(total);
        emitPendingIntentionalJump(documentId, page);
        for (const listener of pageListeners) {
          listener({ documentId, pageNumber: page, totalPages: total });
        }
      };
      const onScaleChanging = () => {
        window.requestAnimationFrame(renderHighlights);
      };
      const onPageRendered = () => window.requestAnimationFrame(renderHighlights);
      const onPointerEnded = () => {
        window.setTimeout(() => {
          const snapshot = readDomSelection();
          if (!snapshot) return;
          selectionSnapshotRef.current = snapshot;
          for (const listener of selectionListeners) listener();
        }, 0);
      };
      const onFind = ({ query }: any) => {
        if (String(query ?? "").trim()) markIntentionalJump("search");
      };
      const updateFindMatches = (matchesCount: any) => {
        const current = Math.max(0, Number(matchesCount?.current) || 0);
        const total = Math.max(0, Number(matchesCount?.total) || 0);
        setSearchMatches({ current, total });
      };
      const onUpdateFindMatchesCount = ({ matchesCount }: any) => {
        updateFindMatches(matchesCount);
      };
      const onUpdateFindControlState = ({ state, matchesCount }: any) => {
        updateFindMatches(matchesCount);
        if (state === FindState.PENDING) setSearchStatus("pending");
        else if (state === FindState.NOT_FOUND) {
          setSearchStatus("not-found");
          pendingIntentionalJump = null;
        } else if (state === FindState.WRAPPED || state === FindState.FOUND) {
          setSearchStatus(state === FindState.WRAPPED ? "wrapped" : "found");
          const documentId = activeDocumentIdRef.current;
          if (documentId) {
            emitPendingIntentionalJump(
              documentId,
              Math.max(1, Number(pdfViewer.currentPageNumber) || 1),
            );
          }
        }
      };
      eventBus.on("pagesinit", onPagesInit);
      eventBus.on("pagechanging", onPageChanging);
      eventBus.on("scalechanging", onScaleChanging);
      eventBus.on("pagerendered", onPageRendered);
      eventBus.on("find", onFind);
      eventBus.on("updatefindmatchescount", onUpdateFindMatchesCount);
      eventBus.on("updatefindcontrolstate", onUpdateFindControlState);
      container.addEventListener("pointerup", onPointerEnded);
      registryRef.current = registry;
      onReady?.(registry);

      return () => {
        container.removeEventListener("pointerup", onPointerEnded);
        eventBus.off("pagesinit", onPagesInit);
        eventBus.off("pagechanging", onPageChanging);
        eventBus.off("scalechanging", onScaleChanging);
        eventBus.off("pagerendered", onPageRendered);
        eventBus.off("find", onFind);
        eventBus.off("updatefindmatchescount", onUpdateFindMatchesCount);
        eventBus.off("updatefindcontrolstate", onUpdateFindControlState);
        linkService.goToDestination = originalGoToDestination;
        if (persistReaderPositionTimer !== null) {
          window.clearTimeout(persistReaderPositionTimer);
          persistReaderPositions();
        }
        for (const entry of documents.values()) void entry.pdf.loadingTask.destroy();
        documents.clear();
        registryRef.current = null;
        pdfViewerRef.current = null;
        eventBusRef.current = null;
        activeDocumentIdRef.current = null;
        selectionSnapshotRef.current = null;
      };
    }, [onReady]);

    useEffect(() => {
      try {
        window.localStorage.setItem("catalyst:pdf-reader:dark-mode", String(darkMode));
        window.localStorage.removeItem("catalyst:pdf-reader:contrast");
      } catch {
        // Reader preferences are non-critical when storage is unavailable.
      }
    }, [darkMode]);

    const goToPage = (pageNumber: number) => {
      const viewer = pdfViewerRef.current;
      if (!viewer?.pagesCount) return;
      const clamped = Math.max(1, Math.min(pageNumber, viewer.pagesCount));
      viewer.currentPageNumber = clamped;
      viewer.scrollPageIntoView?.({ pageNumber: clamped });
    };

    const changeZoom = (delta: number) => {
      const viewer = pdfViewerRef.current;
      if (!viewer) return;
      const current = Number(viewer.currentScale) || 1;
      viewer.currentScale = Math.max(0.25, Math.min(4, current + delta));
    };

    const resetZoom = () => {
      const viewer = pdfViewerRef.current;
      if (!viewer) return;
      viewer.currentScaleValue = "auto";
    };

    const openSearch = () => {
      if (!activeDocumentIdRef.current) return;
      const container = containerRef.current;
      const selection = window.getSelection();
      const selectedText = selection?.rangeCount && container?.contains(selection.anchorNode)
        ? selection.toString().replace(/\s+/g, " ").trim()
        : selectionSnapshotRef.current?.quote ?? "";
      if (selectedText) setSearchQuery(selectedText);
      setSearchOpen(true);
      window.requestAnimationFrame(() => searchInputRef.current?.focus());
    };

    const runSearch = (findPrevious = false) => {
      if (!activeDocumentIdRef.current) return;
      const query = searchQuery.trim();
      if (!query || !eventBusRef.current) return;
      setSearchStatus("pending");
      eventBusRef.current.dispatch("find", {
        source: shellRef.current,
        type: "again",
        query,
        phraseSearch: true,
        caseSensitive: searchCaseSensitive,
        entireWord: searchEntireWord,
        highlightAll: true,
        findPrevious,
        matchDiacritics: searchMatchDiacritics,
      });
    };

    const toggleFullscreen = async () => {
      const shell = shellRef.current;
      if (!shell || !activeDocumentIdRef.current) return;
      try {
        if (document.fullscreenElement === shell) await document.exitFullscreen();
        else await shell.requestFullscreen();
      } catch (error) {
        console.warn("Could not toggle PDF fullscreen mode", error);
      }
    };

    useEffect(() => {
      const onFullscreenChange = () => {
        setFullscreenActive(document.fullscreenElement === shellRef.current);
      };
      document.addEventListener("fullscreenchange", onFullscreenChange);
      return () => document.removeEventListener("fullscreenchange", onFullscreenChange);
    }, []);

    useEffect(() => {
      const onKeyDown = (event: KeyboardEvent) => {
        const shell = shellRef.current;
        const pane = shell?.closest<HTMLElement>(".pdf-pane");
        if (!shell || pane?.dataset.paneActive === "false") return;
        const target = event.target as HTMLElement | null;
        const editable = target?.matches("input, textarea, select, [contenteditable='true']") ?? false;
        const command = event.ctrlKey || event.metaKey;

        if (command && event.key.toLowerCase() === "f" && activeDocumentIdRef.current) {
          event.preventDefault();
          openSearch();
          return;
        }
        if (event.key === "Escape") {
          if (searchOpen) {
            event.preventDefault();
            setSearchOpen(false);
          }
          return;
        }
        if (!command || editable) return;
        if (event.key === "Home") {
          event.preventDefault();
          goToPage(1);
        } else if (event.key === "End") {
          event.preventDefault();
          goToPage(totalPages || 1);
        } else if (event.key === "+" || event.key === "=") {
          event.preventDefault();
          changeZoom(0.1);
        } else if (event.key === "-") {
          event.preventDefault();
          changeZoom(-0.1);
        } else if (event.key === "0") {
          event.preventDefault();
          resetZoom();
        }
      };
      window.addEventListener("keydown", onKeyDown);
      return () => window.removeEventListener("keydown", onKeyDown);
    }, [searchOpen, totalPages, searchQuery, searchCaseSensitive, searchEntireWord, searchMatchDiacritics]);

    return (
      <div
        ref={shellRef}
        className={`thorium-pdf-reader${darkMode ? " is-dark-mode" : ""}`}
        style={{
          ...style,
          width: "100%",
          height: "100%",
        } as CSSProperties}
      >
        <div className="thorium-pdf-toolbar" role="toolbar" aria-label="Reader navigation toolbar">
          <div className="thorium-toolbar-cluster thorium-view-controls">
            <button type="button" onClick={() => changeZoom(-0.1)} aria-label="Zoom out" title="Zoom out (Ctrl/Cmd+-)"><InstrumentGlyph name="zoom-out" /></button>
            <button type="button" className="thorium-zoom-reset" onClick={resetZoom} aria-label="Reset zoom" title="Reset zoom to automatic fit"><InstrumentGlyph name="zoom-reset" /></button>
            <button type="button" onClick={() => changeZoom(0.1)} aria-label="Zoom in" title="Zoom in (Ctrl/Cmd++)"><InstrumentGlyph name="zoom-in" /></button>
          </div>

          <div className="thorium-toolbar-cluster thorium-page-controls">
            <input className="thorium-page-input" aria-label="Current page" type="number" min={1} max={Math.max(1, totalPages)} value={currentPage} onChange={(event) => goToPage(Number(event.currentTarget.value))} />
            <span className="thorium-page-separator">of</span>
            <span className="thorium-page-total">{totalPages || 0}</span>
          </div>

          <div className="thorium-toolbar-cluster thorium-reading-controls">
            <button type="button" className="thorium-theme-toggle" onClick={() => setDarkMode((enabled) => !enabled)} aria-pressed={darkMode} aria-label={darkMode ? "Switch PDF to day mode" : "Switch PDF to night mode"} title={darkMode ? "Day mode" : "Night mode"}>
              <InstrumentGlyph name={darkMode ? "day" : "night"} />
            </button>
            <button type="button" onClick={() => void toggleFullscreen()} disabled={totalPages <= 0} aria-pressed={fullscreenActive} aria-label={fullscreenActive ? "Exit fullscreen" : "Enter fullscreen"} title={fullscreenActive ? "Exit fullscreen" : "Enter fullscreen"}><InstrumentGlyph name="fullscreen" /></button>
          </div>
        </div>

        {searchOpen && (
          <form className="thorium-pdf-search" onSubmit={(event) => { event.preventDefault(); runSearch(false); }}>
            <input
              ref={searchInputRef}
              value={searchQuery}
              onChange={(event) => { setSearchQuery(event.currentTarget.value); setSearchStatus("idle"); }}
              placeholder="Find in document"
              aria-label="Find in document"
            />
            <span className={`thorium-search-status is-${searchStatus}`} aria-live="polite">
              {searchStatus === "not-found"
                ? "No matches"
                : searchMatches.total > 0
                  ? `${searchMatches.current} / ${searchMatches.total}${searchStatus === "wrapped" ? " · wrapped" : ""}`
                  : searchStatus === "pending" ? "Searching…" : ""}
            </span>
            <button type="button" onClick={() => runSearch(true)} aria-label="Previous match" title="Previous match"><InstrumentGlyph name="previous" /></button>
            <button type="submit" aria-label="Next match" title="Next match"><InstrumentGlyph name="next" /></button>
          </form>
        )}

        {searchOpen && (
          <div className="thorium-search-options" role="group" aria-label="Find options">
            <button type="button" className="thorium-search-option" aria-pressed={searchCaseSensitive} onClick={() => setSearchCaseSensitive((value) => !value)} title="Match case">Aa</button>
            <button type="button" className="thorium-search-option" aria-pressed={searchEntireWord} onClick={() => setSearchEntireWord((value) => !value)} title="Whole words">Whole words</button>
            <button type="button" className="thorium-search-option" aria-pressed={searchMatchDiacritics} onClick={() => setSearchMatchDiacritics((value) => !value)} title="Match diacritics">Match diacritics</button>
          </div>
        )}

        <div className="thorium-pdf-viewport">
          <div ref={containerRef} className="thorium-pdf-container pdfViewerContainer">
            <div ref={viewerElementRef} className="pdfViewer" />
          </div>
        </div>
      </div>
    );
  },
);

ThoriumPdfReader.displayName = "ThoriumPdfReader";
