import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type CSSProperties,
} from "react";
import { ThoriumPdfReader } from "./viewer/ThoriumPdfReader";
import {
  annotationFromSelection,
  canReconnectDocumentSource,
  reusableAnnotationForSelection,  newNote,
} from "./domain/workspace";
import { effectiveCapabilities } from "./domain/capabilities";
import { newOutlineReference } from "./domain/outline";
import { newTechniqueRun } from "./domain/techniques";
import {
  availableTechniqueDefinitions,
  viewerMarkupsForDocument,
} from "./domain/selectors";
import type {
  DocumentRecord,
  PendingSelection,
  TechniqueDefinition,
  WorkspaceState,
} from "./domain/types";
import { useWorkspaceController } from "./app/useWorkspaceController";
import { OutlineWorkspace } from "./features/analysis/OutlineWorkspace";
import { TechniqueWorkspace } from "./features/techniques/TechniqueWorkspace";
import { SelectionCard } from "./features/selection/SelectionCard";
import {
  analyticMarkPurposeForAnnotationJson,
  withAnalyticMarkPurpose,
} from "./features/annotations/analyticMarking";
import {
  browserPdfSource,
  readBrowserPdf,
  type PdfSource,
} from "./platform/pdfFiles";
import {
  importWorkspaceXmlFile,
  pickWorkspaceXmlFile,
  saveWorkspaceXmlFile,
  supportsWorkspaceOpenPicker,
  supportsWorkspaceSavePicker,
} from "./platform/workspaceFiles";
import { startFreshCatalystWorkspace } from "./platform/resetSavedState";
import { exportProject, type ProjectExportFormat } from "./platform/projectExport";
import type { WorkspaceRepository } from "./persistence/repository";
import {
  createReaderHistory,
  goBackInReaderHistory,
  goForwardInReaderHistory,
  replaceReaderLocation,
  remapReaderDocumentId,
  visitReaderLocation,
  type ReaderHistory,
  type ReaderLocation,
  type ResearchContextMode,
  type ResearchPane,
} from "./navigation/history";
import { noteDisplayTitle } from "./shared/display";
import { CatalystMark, InstrumentGlyph } from "./ui/CatalystSymbols";
import {
  activateDocument,
  clearViewerSelection,
  jumpToPageWhenReady,
  openPdfSource,
  readSelection,
  restoreViewerSelection,
  subscribeToDocumentViewerMarkupPersistence,
  subscribeToPageChanges,
  type RegistryLike,
} from "./viewer/viewerBridge";


function mostRecentDocument(state: WorkspaceState): DocumentRecord | null {
  return (
    Object.values(state.documents)
      .sort((a, b) => b.lastOpenedAt.localeCompare(a.lastOpenedAt))[0] ?? null
  );
}

function initialReaderLocation(state: WorkspaceState): ReaderLocation {
  return {
    documentId: state.activeDocumentId,
    pageIndex: state.activeDocumentId ? 0 : null,
  };
}

export function App({
  initialWorkspace,
  repository,
}: {
  initialWorkspace: WorkspaceState;
  repository: WorkspaceRepository;
}) {
  const viewerRef = useRef<any>(null);
  const registryRef = useRef<RegistryLike | null>(null);
  const selectionCleanupRef = useRef<(() => void) | null>(null);
  const registryCleanupRef = useRef<(() => void) | null>(null);
  const viewerMarkupCleanupRef = useRef(new Map<string, () => void>());
  const lastSelectionSignatureRef = useRef("");
  const pdfSelectionRef = useRef<PendingSelection | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const workspaceFileInputRef = useRef<HTMLInputElement>(null);
  const readerPaneRef = useRef<HTMLElement>(null);
  const contextPaneRef = useRef<HTMLElement>(null);
  const pendingDocumentRecordsRef = useRef(new Map<string, DocumentRecord>());
  const pendingReconnectsRef = useRef(new Map<string, string>());
  const browserReconnectTargetRef = useRef<string | null>(null);
  const browserOpenFromLocationRef = useRef<ReaderLocation | null>(null);
  const researchFixtureLoadedRef = useRef(false);
  const autoReopenRef = useRef<DocumentRecord | null>(
    mostRecentDocument(initialWorkspace),
  );
  const currentPageByDocumentRef = useRef<Record<string, number>>({});
  const totalPagesByDocumentRef = useRef<Record<string, number>>({});
  const initialReaderHistoryRef = useRef<ReaderHistory>(
    createReaderHistory(initialReaderLocation(initialWorkspace)),
  );
  const readerHistoryRef = useRef<ReaderHistory>(initialReaderHistoryRef.current);

  const [persistenceError, setPersistenceError] = useState<string | null>(null);
  const [persistenceState, setPersistenceState] = useState<"idle" | "saved" | "saving" | "error">("idle");
  const onPersistenceError = useCallback((error: unknown) => {
    console.error("Workspace persistence failed", error);
    setPersistenceError(error instanceof Error ? error.message : String(error));
    setPersistenceState("error");
  }, []);
  const onPersistenceSuccess = useCallback(() => {
    setPersistenceError(null);
    setPersistenceState("saved");
  }, []);
  const onPersistencePending = useCallback(() => {
    setPersistenceError(null);
    setPersistenceState("saving");
  }, []);

  useEffect(() => {
    if (persistenceState !== "saved") return;
    const timer = window.setTimeout(() => setPersistenceState("idle"), 1400);
    return () => window.clearTimeout(timer);
  }, [persistenceState]);

  const {
    state,
    stateRef,
    dispatch,
    flush,
  } = useWorkspaceController(
    initialWorkspace,
    repository,
    onPersistenceError,
    onPersistenceSuccess,
    onPersistencePending,
  );

  const [contextMode, setContextMode] = useState<ResearchContextMode>("graph");
  const [activePane, setActivePane] = useState<ResearchPane>(
    initialWorkspace.activeDocumentId ? "reader" : "context",
  );
  const unifiedWorkflowResearch = useMemo(
    () => new URLSearchParams(window.location.search).get("research") === "unified-workflow",
    [],
  );
  const researchShell = useMemo(() => {
    const shell = new URLSearchParams(window.location.search).get("shell");
    return shell === "reader" || shell === "split" ? shell : "spatial";
  }, []);
  const [readerHistory, setReaderHistory] = useState<ReaderHistory>(
    initialReaderHistoryRef.current,
  );
  const [goToOpen, setGoToOpen] = useState(false);
  const [goToValue, setGoToValue] = useState("");
  const [goToError, setGoToError] = useState("");
  const [status, setStatus] = useState("Local XML workspace ready");
  const [exportMenuOpen, setExportMenuOpen] = useState(false);
  const handleStartFresh = useCallback(async () => {
    const confirmed = window.confirm(
      "Start a new Catalyst session?\n\nThis unloads the current session and opens a blank workspace. Saved .catalyst.xml files and original PDFs are not deleted. Unsaved work that has not been saved as XML will be discarded.",
    );
    if (!confirmed) return;
    setStatus("Starting new session…");
    try {
      await flush();
      await startFreshCatalystWorkspace();
      window.location.reload();
    } catch (error) {
      console.error("Catalyst new-session start failed", error);
      setPersistenceError(error instanceof Error ? error.message : String(error));
      setPersistenceState("error");
      setStatus("Could not start new session");
    }
  }, [flush]);
  const [viewerReady, setViewerReady] = useState(false);
  const [viewerHasDocument, setViewerHasDocument] = useState(false);
  const activeDocument = state.activeDocumentId
    ? state.documents[state.activeDocumentId]
    : undefined;
  const documentNavigationRecords = useMemo(
    () => Object.values(state.documents).sort((a, b) =>
      a.openedAt.localeCompare(b.openedAt) ||
      a.name.localeCompare(b.name) ||
      a.id.localeCompare(b.id),
    ),
    [state.documents],
  );

  useEffect(() => {
    const displayName = activeDocument?.name?.trim().replace(/\.pdf$/i, "");
    document.title = displayName || "Catalyst";
  }, [activeDocument?.name]);
  const enabledCapabilities = useMemo(
    () => effectiveCapabilities(state.capabilities),
    [state.capabilities],
  );
  const techniqueDefinitions = useMemo(
    () => availableTechniqueDefinitions(state),
    [state],
  );
  const techniqueRunCount = useMemo(
    () => Object.values(state.techniqueRuns).length,
    [state.techniqueRuns],
  );

  const commitReaderHistory = useCallback((next: ReaderHistory) => {
    readerHistoryRef.current = next;
    setReaderHistory(next);
  }, []);

  const captureReaderLocation = useCallback(
    (overrides: Partial<ReaderLocation> = {}): ReaderLocation => {
      const workspace = stateRef.current;
      const documentId = workspace.activeDocumentId;
      const pageIndex = documentId
        ? currentPageByDocumentRef.current[documentId] ?? 0
        : null;

      return { documentId, pageIndex, ...overrides };
    },
    [stateRef],
  );

  const commitReaderTransition = useCallback(
    (from: ReaderLocation, to: ReaderLocation) => {
      const liveHistory = replaceReaderLocation(readerHistoryRef.current, from);
      // Catalyst has no explicit "close document" navigation yet. Treat the
      // first document open as the reader's starting point instead of creating
      // a dead Back entry that would point to an empty reader.
      if (!from.documentId) {
        commitReaderHistory(replaceReaderLocation(liveHistory, to));
        return;
      }
      commitReaderHistory(visitReaderLocation(liveHistory, to));
    },
    [commitReaderHistory],
  );

  const clearPendingSelection = useCallback(() => {
    const selection = stateRef.current.pendingSelection;
    dispatch({ type: "selection/cleared" });
    lastSelectionSignatureRef.current = "";

    if (selection && registryRef.current) {
      clearViewerSelection(registryRef.current, selection.documentId);
    }
  }, [dispatch, stateRef]);

  const captureSelection = useCallback(
    async (documentId: string, documentName: string, scope: any) => {
      try {
        const selection = await readSelection(documentId, documentName, scope);
        if (!selection) return;
        const signature = JSON.stringify({ documentId: selection.documentId, quote: selection.quote, anchors: selection.anchors });
        if (signature === lastSelectionSignatureRef.current) return;
        lastSelectionSignatureRef.current = signature;
        pdfSelectionRef.current = selection;
        setStatus(`Text selected · page ${selection.pageIndex + 1}`);
      } catch (error) {
        console.error("PDF selection failed", error);
        setStatus("Could not read PDF selection");
      }
    },
    [],
  );

  const attachSelectionListener = useCallback(
    (registry: RegistryLike, documentId: string, documentName: string) => {
      selectionCleanupRef.current?.();
      selectionCleanupRef.current = null;
      lastSelectionSignatureRef.current = "";

      const selection = registry.getPlugin("selection")?.provides();
      const scope = selection?.forDocument?.(documentId);

      if (!scope) {
        setStatus("Selection plugin unavailable");
        return;
      }

      const cleanups: Array<() => void> = [];

      if (typeof scope.onEndSelection === "function") {
        const unsubscribe = scope.onEndSelection(() => {
          void captureSelection(documentId, documentName, scope);
        });
        if (typeof unsubscribe === "function") cleanups.push(unsubscribe);
      } else {
        const onPointerUp = () => {
          window.setTimeout(
            () => void captureSelection(documentId, documentName, scope),
            0,
          );
        };
        window.addEventListener("pointerup", onPointerUp);
        cleanups.push(() => window.removeEventListener("pointerup", onPointerUp));
      }

      selectionCleanupRef.current = () => {
        for (const cleanup of cleanups) cleanup();
      };

      setStatus("Ready");
    },
    [captureSelection],
  );

  const bindViewerMarkupPersistence = useCallback(
    (registry: RegistryLike, documentId: string) => {
      if (viewerMarkupCleanupRef.current.has(documentId)) return;

      const unsubscribe = subscribeToDocumentViewerMarkupPersistence(
        registry,
        documentId,
        {
          getMarkup: (id) => stateRef.current.viewerMarkups[id],
          getDocumentMarkups: () =>
            viewerMarkupsForDocument(stateRef.current, documentId),
          onUpsert: (markup) => {
            const previous = stateRef.current.viewerMarkups[markup.id];
            const purpose = previous
              ? analyticMarkPurposeForAnnotationJson(previous.annotationJson)
              : null;
            const durableMarkup = {
              ...markup,
              annotationJson: withAnalyticMarkPurpose(markup.annotationJson, purpose),
            };
            dispatch({ type: "viewer-markup/saved", markup: durableMarkup });
          },
          onDelete: (id) => {
            dispatch({ type: "viewer-markup/deleted", id });
          },
          onError: (error) => {
            console.error("Toolbar annotation persistence failed", error);
            setStatus("A PDF markup could not be saved");
          },
        },
      );

      viewerMarkupCleanupRef.current.set(documentId, unsubscribe);
    },
    [dispatch, stateRef],
  );


  const makeDocumentRecord = useCallback(
    (source: Pick<PdfSource, "documentId" | "name" | "path">): DocumentRecord => {
      const existing = stateRef.current.documents[source.documentId];
      const now = new Date().toISOString();
      return {
        id: source.documentId,
        name: source.name,
        path: source.path ?? existing?.path ?? null,
        openedAt: existing?.openedAt ?? now,
        lastOpenedAt: now,
      };
    },
    [stateRef],
  );

  const openSource = useCallback(
    async (
      source: PdfSource,
      reconnectFromId: string | null = null,
    ): Promise<string | null> => {
      const reconnectFrom = reconnectFromId
        ? stateRef.current.documents[reconnectFromId]
        : undefined;

      if (
        reconnectFrom &&
        !canReconnectDocumentSource(reconnectFrom.id, source.documentId)
      ) {
        setStatus(
          `That PDF does not match ${reconnectFrom.name}; saved annotations were not changed`,
        );
        return null;
      }

      const registry = registryRef.current ?? (await viewerRef.current?.registry);
      if (!registry) {
        setStatus("Viewer is not ready yet");
        return null;
      }

      const baseRecord = makeDocumentRecord(source);
      const record: DocumentRecord = reconnectFrom
        ? { ...baseRecord, openedAt: reconnectFrom.openedAt }
        : baseRecord;

      const commitDocument = () => {
        if (reconnectFromId && reconnectFromId !== source.documentId) {
          dispatch({
            type: "document/reconnected",
            previousId: reconnectFromId,
            document: record,
          });
          commitReaderHistory(
            remapReaderDocumentId(
              readerHistoryRef.current,
              reconnectFromId,
              source.documentId,
            ),
          );
        } else {
          dispatch({ type: "document/opened", document: record });
        }
      };

      const documentManager = registry.getPlugin("document-manager")?.provides();
      if (documentManager?.isDocumentOpen?.(source.documentId)) {
        documentManager.setActiveDocument(source.documentId);
        commitDocument();
        attachSelectionListener(registry, source.documentId, source.name);
        setViewerHasDocument(true);
        setStatus("Ready");
        return source.documentId;
      }

      pendingDocumentRecordsRef.current.set(source.documentId, record);
      if (reconnectFromId) {
        pendingReconnectsRef.current.set(source.documentId, reconnectFromId);
      }
      setStatus(
        reconnectFromId
          ? `Reconnecting ${source.name}…`
          : `Opening ${source.name}…`,
      );

      try {
        await openPdfSource(registry, source);
        const currentRecord = stateRef.current.documents[source.documentId];
        if (
          !currentRecord ||
          currentRecord.path !== record.path ||
          stateRef.current.activeDocumentId !== source.documentId
        ) {
          commitDocument();
        }
        attachSelectionListener(registry, source.documentId, source.name);
        setViewerHasDocument(true);
        setStatus("Ready");
        return source.documentId;
      } catch (error) {
        console.error("Open PDF failed", error);
        setViewerHasDocument(false);
        setStatus(`Could not open ${source.name}`);
        return null;
      } finally {
        pendingDocumentRecordsRef.current.delete(source.documentId);
        pendingReconnectsRef.current.delete(source.documentId);
      }
    },
    [
      attachSelectionListener,
      commitReaderHistory,
      dispatch,
      makeDocumentRecord,
      stateRef,
    ],
  );

  useEffect(() => {
    const fixture = new URLSearchParams(window.location.search).get("fixture");
    if (!unifiedWorkflowResearch || fixture !== "tradecraft" || !viewerReady || viewerHasDocument || researchFixtureLoadedRef.current) return;
    researchFixtureLoadedRef.current = true;
    void fetch("/Tradecraft-Primer-apr09.pdf")
      .then((response) => response.blob())
      .then((blob) => browserPdfSource(new File([blob], "Tradecraft-Primer-apr09.pdf", { type: "application/pdf" })))
      .then((source) => openSource(source))
      .then((openedId) => { if (openedId) setActivePane("reader"); })
      .catch((error) => { console.error("Research fixture load failed", error); setStatus("Research fixture could not be loaded"); });
  }, [openSource, unifiedWorkflowResearch, viewerHasDocument, viewerReady]);

  const reconnectDocument = useCallback(
    async (document: DocumentRecord) => {
      browserReconnectTargetRef.current = document.id;
      const input = fileInputRef.current;
      if (!input) return;
      input.multiple = false;
      input.click();
    },
    [],
  );

  const openDocumentRecord = useCallback(
    async (document: DocumentRecord): Promise<string | null> => {
      const registry = registryRef.current;
      if (registry && activateDocument(registry, document.id)) {
        dispatch({
          type: "document/opened",
          document: { ...document, lastOpenedAt: new Date().toISOString() },
        });
        attachSelectionListener(registry, document.id, document.name);
        setViewerHasDocument(true);
        setStatus("Ready");
        return document.id;
      }

      setStatus(`Reopening ${document.name}…`);
      try {
        const source = await readBrowserPdf(document.id);

        if (!source) {
          setViewerHasDocument(false);
          setStatus(`Could not reopen ${document.name}. Locate the PDF to reconnect it.`);
            return null;
        }

        if (source.documentId !== document.id) {
          setStatus("The file changed on disk; Catalyst opened it as a new document");
          return openSource(source);
        }
        return openSource({ ...source, name: document.name });
      } catch (error) {
        console.error("Reopen PDF failed", error);
        setViewerHasDocument(false);
        setStatus(`Could not reopen ${document.name}. Locate the PDF to reconnect it.`);
        return null;
      }
    },
    [attachSelectionListener, dispatch, openSource],
  );

  const switchDocument = useCallback(async (documentId: string): Promise<boolean> => {
    if (!documentId) return false;
    const document = stateRef.current.documents[documentId];
    if (!document) return false;
    if (documentId === stateRef.current.activeDocumentId) {
      const registry = registryRef.current;
      if (registry && activateDocument(registry, documentId)) {
        setViewerHasDocument(true);
        setActivePane("reader");
        setStatus(`Reader · ${document.name}`);
        return true;
      }
    }
    const from = captureReaderLocation();
    const openedId = await openDocumentRecord(document);
    if (!openedId) return false;
    const pageIndex = currentPageByDocumentRef.current[openedId] ?? 0;
    commitReaderTransition(from, { documentId: openedId, pageIndex });
    setActivePane("reader");
    setStatus(`Reader · ${document.name}`);
    return true;
  }, [captureReaderLocation, commitReaderTransition, openDocumentRecord, stateRef]);

  const pickDocument = useCallback(async () => {
    const from = captureReaderLocation();
    browserOpenFromLocationRef.current = from;
    const input = fileInputRef.current;
    if (!input) return;
    input.multiple = true;
    input.click();
  }, [captureReaderLocation]);

  const closeCurrentDocument = useCallback(async () => {
    const documentId = stateRef.current.activeDocumentId;
    if (!documentId || !viewerHasDocument) return;
    const document = stateRef.current.documents[documentId];
    const registry = registryRef.current;
    const documentManager = registry?.getPlugin("document-manager")?.provides();
    if (!documentManager?.closeDocument?.(documentId)) return;
    selectionCleanupRef.current?.();
    selectionCleanupRef.current = null;
    lastSelectionSignatureRef.current = "";
    dispatch({ type: "document/closed", id: documentId });
    const remaining = documentNavigationRecords.filter((item) => item.id !== documentId);
    const next = remaining[0];
    if (next) {
      await openDocumentRecord(next);
      setStatus(`Reader · ${next.name}`);
    } else {
      setViewerHasDocument(false);
      setStatus("Open a PDF to begin");
    }
  }, [dispatch, documentNavigationRecords, openDocumentRecord, stateRef, viewerHasDocument]);

  const handleViewerReady = useCallback(
    (registry: RegistryLike) => {
      registryRef.current = registry;
      setViewerReady(true);
      const documentManager = registry.getPlugin("document-manager")?.provides();
      const readerNavigation = registry.getPlugin("reader-navigation")?.provides();

      const registerDocument = (doc: any) => {
        if (!doc?.id) return;
        setViewerHasDocument(true);
        const name = doc.name ?? "Untitled PDF";
        const pending = pendingDocumentRecordsRef.current.get(doc.id);
        const reconnectFromId = pendingReconnectsRef.current.get(doc.id) ?? null;
        const existing = stateRef.current.documents[doc.id];
        const now = new Date().toISOString();

        const document: DocumentRecord = pending ?? {
          id: doc.id,
          name,
          path: existing?.path ?? null,
          openedAt: existing?.openedAt ?? now,
          lastOpenedAt:
            stateRef.current.activeDocumentId === doc.id
              ? existing?.lastOpenedAt ?? now
              : now,
        };

        if (reconnectFromId && reconnectFromId !== doc.id) {
          dispatch({
            type: "document/reconnected",
            previousId: reconnectFromId,
            document,
          });
          commitReaderHistory(
            remapReaderDocumentId(
              readerHistoryRef.current,
              reconnectFromId,
              doc.id,
            ),
          );
        } else if (
          !existing ||
          stateRef.current.activeDocumentId !== doc.id ||
          Boolean(pending)
        ) {
          dispatch({ type: "document/opened", document });
        }

        bindViewerMarkupPersistence(registry, doc.id);
        attachSelectionListener(registry, doc.id, name);
      };

      if (documentManager) {
        const navigationUnsubscribe = readerNavigation?.onIntentionalJump?.(
          ({ from, to }: { from: ReaderLocation; to: ReaderLocation }) => {
            commitReaderTransition(from, to);
          },
        );
        const pageUnsubscribe = subscribeToPageChanges(
          registry,
          ({ documentId, pageIndex, totalPages }) => {
            currentPageByDocumentRef.current[documentId] = pageIndex;
            if (totalPages > 0) totalPagesByDocumentRef.current[documentId] = totalPages;
          },
        );
        const openedUnsubscribe = documentManager.onDocumentOpened?.(registerDocument);
        const activeUnsubscribe = documentManager.onActiveDocumentChanged?.(
          ({ current }: any) => {
            if (current?.id) registerDocument(current);
            else setViewerHasDocument(false);
          },
        );
        const closedUnsubscribe = documentManager.onDocumentClosed?.((documentId: string) => {
          if (documentId) {
            viewerMarkupCleanupRef.current.get(documentId)?.();
            viewerMarkupCleanupRef.current.delete(documentId);
          }
          const current = documentManager.getActiveDocument?.();
          setViewerHasDocument(Boolean(current?.id));
        });

        const current = documentManager.getActiveDocument?.();
        if (current?.id) {
          registerDocument(current);
        } else {
          setViewerHasDocument(false);
          setStatus("Open a PDF to begin");
        }

        registryCleanupRef.current?.();
        registryCleanupRef.current = () => {
          if (typeof navigationUnsubscribe === "function") navigationUnsubscribe();
          pageUnsubscribe();
          if (typeof openedUnsubscribe === "function") openedUnsubscribe();
          if (typeof activeUnsubscribe === "function") activeUnsubscribe();
          if (typeof closedUnsubscribe === "function") closedUnsubscribe();
        };
      }
    },
    [
      attachSelectionListener,
      bindViewerMarkupPersistence,
      commitReaderHistory,
      commitReaderTransition,
      dispatch,
      repository.kind,
      stateRef,
    ],
  );

  useEffect(() => {
    if (!viewerReady) return;
    const document = autoReopenRef.current;
    autoReopenRef.current = null;
    if (!document) return;
    void openDocumentRecord(document);
  }, [openDocumentRecord, viewerReady]);

  useEffect(() => {
    return () => {
      selectionCleanupRef.current?.();
      registryCleanupRef.current?.();
      for (const unsubscribe of viewerMarkupCleanupRef.current.values()) {
        unsubscribe();
      }
      viewerMarkupCleanupRef.current.clear();
    };
  }, []);


  const navigateToContextMode = useCallback(
    (mode: ResearchContextMode) => {
      setActivePane("context");
      dispatch({ type: "note/activated", id: null });
      setContextMode(mode);
    },
    [dispatch],
  );

  const navigateToSurface = useCallback(
    (surface: "reader" | "outline" | "methods") => {
      if (surface === "reader") {
        setActivePane("reader");
        window.requestAnimationFrame(() => readerPaneRef.current?.focus({ preventScroll: true }));
        return;
      }

      navigateToContextMode(surface === "outline" ? "graph" : "techniques");
      window.requestAnimationFrame(() => {
        const root = contextPaneRef.current?.querySelector<HTMLElement>(
          `[data-catalyst-surface="${surface}"]`,
        );
        const target = root?.querySelector<HTMLElement>(
          "[tabindex='0'], button:not([disabled]), input:not([disabled]), textarea:not([disabled])",
        );
        (target ?? root)?.focus({ preventScroll: true });
      });
    },
    [navigateToContextMode],
  );

  const submitGoToAddress = useCallback(() => {
    const raw = goToValue.trim();
    const exportMatch = raw.match(/^export\s+(pdf|docx|rtf)$/i);
    if (exportMatch) {
      const format = exportMatch[1].toLowerCase() as ProjectExportFormat;
      setGoToOpen(false);
      setGoToValue("");
      setGoToError("");
      setStatus(`Exporting ${format.toUpperCase()}...`);
      void exportProject(stateRef.current, format)
        .then((fileName) => setStatus(`Exported - ${fileName}`))
        .catch((error) => {
          console.error(`Catalyst ${format.toUpperCase()} export failed`, error);
          setStatus(`Could not export ${format.toUpperCase()}`);
        });
      return;
    }
    if (/^(?:all\s+methods|methods?\s+catalog|catalog)$/i.test(raw)) {
      if (!enabledCapabilities.methods) {
        setGoToError("Methods are not enabled in this workspace");
        return;
      }
      setGoToError("");
      navigateToSurface("methods");
      window.requestAnimationFrame(() => window.requestAnimationFrame(() => {
        window.dispatchEvent(new CustomEvent("catalyst:open-method-catalog"));
      }));
      return;
    }

    const documentMatch = raw.match(/^(?:document|d)\s*[:#-]?\s*(.+?)(?:\s+(?:page|p)\s*[:#-]?\s*(\d+))?$/i);
    const activePageMatch = raw.match(/^(?:page|p)\s*[:#-]?\s*(\d+)$/i);
    if (documentMatch || activePageMatch) {
      const documents = documentNavigationRecords;
      if (documents.length === 0) {
        setGoToError("No documents are open in this session");
        return;
      }

      const selector = documentMatch?.[1]?.trim() ?? "";
      const pageNumber = Number(documentMatch?.[2] ?? activePageMatch?.[1] ?? 0) || null;
      let target = activePageMatch
        ? documents.find((document) => document.id === stateRef.current.activeDocumentId)
        : undefined;
      let targetIndex = target ? documents.findIndex((document) => document.id === target!.id) : -1;

      if (documentMatch) {
        if (/^\d+$/.test(selector)) {
          targetIndex = Number(selector) - 1;
          target = documents[targetIndex];
        } else {
          const needle = selector.toLocaleLowerCase();
          const exact = documents
            .map((document, index) => ({ document, index }))
            .filter(({ document }) => document.name.toLocaleLowerCase() === needle);
          const matches = exact.length > 0
            ? exact
            : documents
                .map((document, index) => ({ document, index }))
                .filter(({ document }) => document.name.toLocaleLowerCase().includes(needle));
          if (matches.length === 1) {
            target = matches[0].document;
            targetIndex = matches[0].index;
          } else if (matches.length > 1) {
            setGoToError("Document name is ambiguous; use its D number");
            return;
          }
        }
      }

      if (!target || targetIndex < 0) {
        setGoToError(documentMatch ? `No document matches ${selector}` : "No active document");
        return;
      }
      if (!pageNumber) {
        setGoToError("");
        void switchDocument(target.id).then((success) => {
          if (!success) {
            setGoToError(`Could not open D ${targetIndex + 1}`);
            return;
          }
          setGoToOpen(false);
          setGoToValue("");
          setGoToError("");
          setStatus(`Go to · D ${targetIndex + 1} · ${target.name}`);
        });
        return;
      }

      const knownTotalPages = totalPagesByDocumentRef.current[target.id];
      if (pageNumber < 1 || (knownTotalPages && pageNumber > knownTotalPages)) {
        setGoToError(knownTotalPages
          ? `Page must be between 1 and ${knownTotalPages}`
          : "Page number must be at least 1");
        return;
      }

      setGoToError("");
      const from = captureReaderLocation();
      void (async () => {
        let documentId = target!.id;
        if (stateRef.current.activeDocumentId !== target!.id) {
          const openedId = await openDocumentRecord(target!);
          if (!openedId) {
            setGoToError(`Could not open D ${targetIndex + 1}`);
            return;
          }
          documentId = openedId;
        }
        const registry = registryRef.current;
        if (!registry) {
          setGoToError("Reader is not ready");
          return;
        }
        await jumpToPageWhenReady(registry, documentId, pageNumber - 1, { behavior: "instant" });
        currentPageByDocumentRef.current[documentId] = pageNumber - 1;
        commitReaderTransition(from, { documentId, pageIndex: pageNumber - 1 });
        setActivePane("reader");
        readerPaneRef.current?.focus({ preventScroll: true });
        setGoToOpen(false);
        setGoToValue("");
        setGoToError("");
        setStatus(`Go to · D ${targetIndex + 1} P ${pageNumber} · ${target!.name}`);
      })();
      return;
    }

    const prefixed = raw.match(/^(outline|o|methods?|m)\s*[:#-]?\s*(\d+(?:\.\d+)*)(?:\s+(note|form|step\s+\d+))?$/i);
    const bare = raw.match(/^(\d+(?:\.\d+)*)(?:\s+(note|form|step\s+\d+))?$/i);
    let surface: "outline" | "methods" | null = null;
    let address = "";
    let suffix = "";

    if (prefixed) {
      surface = /^(?:o|outline)$/i.test(prefixed[1]) ? "outline" : "methods";
      address = prefixed[2];
      suffix = prefixed[3]?.toLowerCase() ?? "";
    } else if (bare && activePane === "context") {
      surface = contextMode === "graph" ? "outline" : "methods";
      address = bare[1];
      suffix = bare[2]?.toLowerCase() ?? "";
    }

    if (!surface || !address) {
      setGoToError("Use D 2 P 37, P 37, O 2.3 note, M 4.1 step 2, All methods, or Export PDF/DOCX/RTF");
      return;
    }
    if (surface === "methods" && !enabledCapabilities.methods) {
      setGoToError("Methods are not enabled in this workspace");
      return;
    }
    if (surface === "outline" && suffix && suffix !== "note") {
      setGoToError("Outline addresses support an optional 'note' target");
      return;
    }
    if (surface === "methods" && suffix === "note") {
      setGoToError("Method addresses support 'form' or 'step N'");
      return;
    }

    const stepMatch = suffix.match(/^step\s+(\d+)$/);
    const target = surface === "outline"
      ? (suffix === "note" ? "note" : "row")
      : (suffix === "form" ? "form" : stepMatch ? "step" : "row");
    const step = stepMatch ? Number(stepMatch[1]) : undefined;

    setGoToError("");
    navigateToSurface(surface);
    window.requestAnimationFrame(() => window.requestAnimationFrame(() => {
      window.dispatchEvent(new CustomEvent(
        surface === "outline" ? "catalyst:navigate-outline-address" : "catalyst:navigate-method-address",
        { detail: { address, target, step } },
      ));
    }));
  }, [
    activePane,
    captureReaderLocation,
    commitReaderTransition,
    contextMode,
    documentNavigationRecords,
    enabledCapabilities.methods,
    goToValue,
    navigateToSurface,
    openDocumentRecord,
    stateRef,
    switchDocument,
  ]);

  useEffect(() => {
    const onNavigationResult = (event: Event) => {
      const detail = (event as CustomEvent<{ success?: boolean; address?: string }>).detail;
      if (!detail?.address) return;
      if (detail.success) {
        setGoToOpen(false);
        setGoToValue("");
        setGoToError("");
        setStatus(`Go to · ${detail.address}`);
      } else {
        setGoToError(`No item at ${detail.address}`);
      }
    };
    window.addEventListener("catalyst:navigation-result", onNavigationResult);
    return () => window.removeEventListener("catalyst:navigation-result", onNavigationResult);
  }, []);

  const navigateToNote = useCallback(
    (noteId: string) => {
      const note = stateRef.current.notes[noteId];
      if (!note) return;
      setActivePane("context");
      dispatch({ type: "note/activated", id: noteId });
      setContextMode("graph");
    },
    [dispatch, stateRef],
  );

  const createOutlineNote = useCallback(() => {
    const note = newNote();
    dispatch({ type: "note/created", note });
    setActivePane("context");
    setContextMode("graph");
    return note.id;
  }, [dispatch]);

  const createOutlineItem = useCallback((parentPlacementId: string | null) => {
    const noteId = createOutlineNote();
    const outline = stateRef.current.outline;
    const parentItemId = parentPlacementId ?? outline.rootItemId;
    const placement = newOutlineReference(outline, noteId, parentItemId);
    dispatch({ type: "outline/reference-created", placement });
    setStatus(parentPlacementId ? "Outline child added" : "Outline item added");
    return { noteId, placementId: placement.id };
  }, [createOutlineNote, dispatch]);

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      const target = event.target instanceof Element ? event.target : null;
      const isEditing = Boolean(target?.closest(
        "input, textarea, select, [contenteditable]:not([contenteditable='false']), [role='textbox']",
      ));

      if ((event.ctrlKey || event.metaKey) && !event.altKey && !event.shiftKey && event.key.toLowerCase() === "g") {
        event.preventDefault();
        setGoToValue(
          activePane === "reader"
            ? ""
            : contextMode === "graph"
              ? "O "
              : "M ",
        );
        setGoToError("");
        setGoToOpen(true);
        return;
      }

      if (event.altKey && !event.ctrlKey && !event.metaKey && !event.shiftKey && !isEditing) {
        if (event.code === "Digit1") {
          event.preventDefault();
          navigateToSurface("reader");
          return;
        }
        if (event.code === "Digit2") {
          event.preventDefault();
          navigateToSurface("outline");
          return;
        }
        if (event.code === "Digit3" && enabledCapabilities.methods) {
          event.preventDefault();
          navigateToSurface("methods");
          return;
        }
      }

      if (unifiedWorkflowResearch && event.key === "F6" && !isEditing) {
        event.preventDefault();
        setActivePane((current) => {
          const next = current === "reader" ? "context" : "reader";
          setStatus(next === "reader" ? "Source layer raised" : "Analysis layer raised");
          return next;
        });
        return;
      }

      if ((event.ctrlKey || event.metaKey) && !event.shiftKey && event.key.toLowerCase() === "o") {
        event.preventDefault();
        void pickDocument();
        return;
      }

      if (
        (event.ctrlKey || event.metaKey) &&
        event.shiftKey &&
        !event.altKey &&
        !isEditing &&
        event.key.toLowerCase() === "x"
      ) {
        event.preventDefault();
        void closeCurrentDocument();
        return;
      }

      if (event.key !== "Escape" || event.defaultPrevented) return;

      if (isEditing) return;

      if (stateRef.current.pendingSelection) {
        event.preventDefault();
        clearPendingSelection();
        return;
      }

      if (activePane === "context" && stateRef.current.activeNoteId) {
        event.preventDefault();
        navigateToContextMode("graph");
      }
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [
    activePane,
    clearPendingSelection,
    closeCurrentDocument,
    contextMode,
    enabledCapabilities.methods,
    navigateToContextMode,
    navigateToSurface,
    pickDocument,
    stateRef,
    unifiedWorkflowResearch,
  ]);

  const captureSourceSelection = useCallback(
    (selection: PendingSelection) => {
      const existing = reusableAnnotationForSelection(stateRef.current, selection);
      const annotation = existing ?? annotationFromSelection(selection, "excerpt");
      if (!existing) dispatch({ type: "annotation/saved", annotation });
      dispatch({ type: "annotation-role/ensured", annotationId: annotation.id, role: "excerpt" });
      clearPendingSelection();
      setStatus("Source captured");
    },
    [clearPendingSelection, dispatch],
  );

  const copySelectionWithSource = useCallback(async (selection: PendingSelection) => {
    const text = `${selection.quote}\n\n${selection.documentName}, p. ${selection.pageIndex + 1}`;
    await navigator.clipboard.writeText(text);
    setStatus("Copied with source");
  }, []);

  const restoreReaderLocation = useCallback(
    async (location: ReaderLocation) => {
      setActivePane("reader");
      if (!location.documentId) {
        setStatus("Reader history has no earlier document");
        return;
      }

      const document = stateRef.current.documents[location.documentId];
      if (!document) {
        setStatus("History source is no longer in this workspace");
        return;
      }

      const registry = registryRef.current;
      let openedId: string | null = location.documentId;
      if (!registry || !activateDocument(registry, location.documentId)) {
        openedId = await openDocumentRecord(document);
      }

      if (openedId !== location.documentId) {
        setStatus("Could not restore the historical source location");
        return;
      }

      if (location.pageIndex !== null && registryRef.current) {
        try {
          await jumpToPageWhenReady(
            registryRef.current,
            location.documentId,
            location.pageIndex,
            { behavior: "instant" },
          );
          currentPageByDocumentRef.current[location.documentId] = location.pageIndex;
        } catch (error) {
          console.warn("Could not restore historical PDF page", error);
        }
      }

      const name = stateRef.current.documents[location.documentId]?.name ?? "PDF";
      setStatus(
        location.pageIndex === null
          ? `Reader · ${name}`
          : `${name} · page ${location.pageIndex + 1}`,
      );
    },
    [openDocumentRecord, stateRef],
  );

  const goBackReader = useCallback(() => {
    const live = captureReaderLocation();
    const normalized = replaceReaderLocation(readerHistoryRef.current, live);
    const next = goBackInReaderHistory(normalized);
    if (next === normalized) return;
    commitReaderHistory(next);
    void restoreReaderLocation(next.current);
  }, [captureReaderLocation, commitReaderHistory, restoreReaderLocation]);

  const goForwardReader = useCallback(() => {
    const live = captureReaderLocation();
    const normalized = replaceReaderLocation(readerHistoryRef.current, live);
    const next = goForwardInReaderHistory(normalized);
    if (next === normalized) return;
    commitReaderHistory(next);
    void restoreReaderLocation(next.current);
  }, [captureReaderLocation, commitReaderHistory, restoreReaderLocation]);


  const deleteNote = useCallback(
    (noteId: string) => {
      const note = stateRef.current.notes[noteId];
      if (!note) return;
      dispatch({ type: "note/permanently-deleted", id: noteId });
      setContextMode("graph");
      setStatus(`Deleted "${noteDisplayTitle(note)}"`);
    },
    [dispatch, stateRef],
  );

  const addTechnique = useCallback(
    (
      definition: TechniqueDefinition,
      parentRunId: string | null = null,
      afterRunId: string | null = null,
    ) => {
      const run = newTechniqueRun(definition, parentRunId);
      dispatch({ type: "technique-run/created", run, afterRunId });
      setStatus(`Added method · ${definition.name || "Untitled method"}`);
      return run.id;
    },
    [dispatch],
  );


  const loadWorkspaceFile = useCallback(async (file: File) => {
    setStatus(`Loading ${file.name}…`);
    try {
      await flush();
      await importWorkspaceXmlFile(file);
      window.location.reload();
    } catch (error) {
      console.error("Workspace XML load failed", error);
      setStatus(`Could not load ${file.name}`);
    }
  }, [flush]);

  const importWorkspace = useCallback(async () => {
    if (supportsWorkspaceOpenPicker()) {
      try {
        const file = await pickWorkspaceXmlFile();
        if (file) await loadWorkspaceFile(file);
        return;
      } catch (error) {
        if (error instanceof DOMException && error.name === "AbortError") return;
        console.error("Workspace XML picker failed", error);
        setStatus("Could not open Catalyst session");
        return;
      }
    }
    workspaceFileInputRef.current?.click();
  }, [loadWorkspaceFile]);

  const saveWorkspace = useCallback(async () => {
    try {
      let title: string | undefined;
      if (!supportsWorkspaceSavePicker()) {
        const entered = window.prompt("Name this Catalyst session", "Catalyst session");
        if (entered === null) return;
        title = entered;
      }
      const fileName = await saveWorkspaceXmlFile(stateRef.current, title);
      if (fileName) setStatus(`Session saved · ${fileName}`);
    } catch (error) {
      if (error instanceof DOMException && error.name === "AbortError") return;
      console.error("Workspace XML save failed", error);
      setStatus("Could not save Catalyst session");
    }
  }, [stateRef]);

  const exportWorkspace = useCallback(async (format: ProjectExportFormat) => {
    setExportMenuOpen(false);
    setStatus(`Exporting ${format.toUpperCase()}…`);
    try {
      const fileName = await exportProject(stateRef.current, format);
      setStatus(`Exported · ${fileName}`);
    } catch (error) {
      console.error(`Catalyst ${format.toUpperCase()} export failed`, error);
      setStatus(`Could not export ${format.toUpperCase()}`);
    }
  }, [stateRef]);

  useEffect(() => {
    if (!exportMenuOpen) return;
    const onPointerDown = (event: PointerEvent) => {
      const target = event.target instanceof Element ? event.target : null;
      if (!target?.closest("[data-catalyst-export-control]")) setExportMenuOpen(false);
    };
    const onEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") setExportMenuOpen(false);
    };
    window.addEventListener("pointerdown", onPointerDown);
    window.addEventListener("keydown", onEscape);
    return () => {
      window.removeEventListener("pointerdown", onPointerDown);
      window.removeEventListener("keydown", onEscape);
    };
  }, [exportMenuOpen]);

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      const command = event.ctrlKey || event.metaKey;
      if (!command) return;
      const target = event.target instanceof Element ? event.target : null;
      const isEditing = Boolean(target?.closest(
        "input, textarea, select, [contenteditable]:not([contenteditable='false']), [role='textbox']",
      ));
      if (isEditing) return;

      if (event.shiftKey && event.key.toLowerCase() === "o") {
        event.preventDefault();
        void importWorkspace();
      } else if (!event.shiftKey && event.key.toLowerCase() === "s") {
        event.preventDefault();
        void saveWorkspace();
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [importWorkspace, saveWorkspace]);


  const displayStatus = persistenceError
    ? `Persistence error · ${persistenceError}`
    : status;
  const persistenceLabel = persistenceState === "saving"
    ? "Saving…"
    : persistenceState === "error"
      ? "Save failed"
      : "Saved";
  const workspaceShell = unifiedWorkflowResearch ? researchShell : "reader";

  return (
    <main
      className={`workspace workspace-unified-${activePane} workspace-shell-${workspaceShell}${unifiedWorkflowResearch ? " workspace-unified-research" : ""}`}
      data-research-shell={unifiedWorkflowResearch ? researchShell : undefined}
      data-catalyst-active-surface={activePane === "reader" ? "reader" : contextMode === "graph" ? "outline" : "methods"}
    >
      {goToOpen && (
        <div className="catalyst-go-to-backdrop" role="presentation" onMouseDown={() => setGoToOpen(false)}>
          <form
            className="catalyst-go-to-dialog"
            role="dialog"
            aria-modal="true"
            aria-label="Go to Catalyst address"
            data-catalyst-dialog="go-to"
            onMouseDown={(event) => event.stopPropagation()}
            onSubmit={(event) => { event.preventDefault(); submitGoToAddress(); }}
            onKeyDown={(event) => {
              if (event.key === "Escape") {
                event.preventDefault();
                setGoToOpen(false);
                setGoToError("");
              }
            }}
          >
            <label htmlFor="catalyst-go-to-input">Go to</label>
            <div className="catalyst-go-to-row">
              <input
                id="catalyst-go-to-input"
                autoFocus
                data-catalyst-action="go-to-address"
                aria-keyshortcuts="Control+G Meta+G"
                value={goToValue}
                onChange={(event) => { setGoToValue(event.currentTarget.value); setGoToError(""); }}
                placeholder="D 2 P 37, O 2.3 note, M 4.1 step 2, or Export PDF"
                autoComplete="off"
                spellCheck={false}
              />
              <button type="submit">Go</button>
            </div>
            <span className="catalyst-go-to-help">D 2 · P 37 · D 2 P 37 · O 2.3 note · M 4.1 step 2 · All methods · Export PDF/DOCX/RTF</span>
            {goToError && <span className="catalyst-go-to-error" role="alert">{goToError}</span>}
          </form>
        </div>
      )}
      {unifiedWorkflowResearch && (
        <button
          className="unified-layer-toggle"
          onClick={() => setActivePane((current) => current === "reader" ? "context" : "reader")}
          title={researchShell === "spatial" ? "Invert source and analysis layers (F6)" : "Switch source/analysis focus (F6)"}
        >
          {researchShell === "spatial"
            ? (activePane === "reader" ? "Source above" : "Analysis above")
            : (activePane === "reader" ? "Source focus" : "Analysis focus")} · F6
        </button>
      )}
      <section
        ref={readerPaneRef}
        className="pdf-pane"
        aria-label="PDF reader"
        aria-keyshortcuts="Alt+1"
        id="catalyst-surface-reader"
        data-catalyst-surface="reader"
        tabIndex={-1}
        data-pane-active={activePane === "reader" ? "true" : "false"}
        onPointerDownCapture={() => setActivePane("reader")}
        onFocusCapture={() => setActivePane("reader")}
      >
        <header className="reader-header" aria-label="Document toolbar">
          <div className="catalyst-brand" aria-label="Workspace status">
            {persistenceState !== "idle" && (
              <span className={`workspace-save-state ${persistenceState}`} aria-hidden="true">{persistenceLabel}</span>
            )}
            <span className="visually-hidden" aria-live="polite">{displayStatus}</span>
          </div>
          <div className="reader-file-controls" role="group" aria-label="Document and session controls">
            <div className="reader-session-controls reader-session-controls-first" role="group" aria-label="Session controls">
              <button className="reader-session-button" type="button" data-catalyst-action="new-session" onClick={() => void handleStartFresh()} aria-label="New session" title="Unload this session and start a new one">
                <InstrumentGlyph name="exit" />
                <span className="reader-session-label">New</span>
              </button>
              <button className="reader-session-button" type="button" data-catalyst-action="load-session" aria-keyshortcuts="Control+Shift+O Meta+Shift+O" onClick={() => void importWorkspace()} aria-label="Load session" title="Load a Catalyst session">
                <InstrumentGlyph name="import" />
                <span className="reader-session-label">Load</span>
              </button>
              <button className="reader-session-button" type="button" data-catalyst-action="save-session" aria-keyshortcuts="Control+S Meta+S" onClick={() => void saveWorkspace()} aria-label="Save session" title="Save this Catalyst session as XML">
                <InstrumentGlyph name="save" />
                <span className="reader-session-label">Save</span>
              </button>
              <div className="reader-export-control" data-catalyst-export-control="true">
                <button
                  className="reader-session-button"
                  type="button"
                  data-catalyst-action="export"
                  aria-haspopup="menu"
                  aria-expanded={exportMenuOpen}
                  onClick={() => setExportMenuOpen((current) => !current)}
                  aria-label="Export Methods and Outline"
                  title="Export the entire Methods + Outline document"
                >
                  <InstrumentGlyph name="export" />
                  <span className="reader-session-label">Export</span>
                </button>
                {exportMenuOpen && (
                  <div className="reader-export-menu" role="menu" aria-label="Export format">
                    <button type="button" role="menuitem" onClick={() => void exportWorkspace("pdf")}>PDF</button>
                    <button type="button" role="menuitem" onClick={() => void exportWorkspace("docx")}>DOCX</button>
                    <button type="button" role="menuitem" onClick={() => void exportWorkspace("rtf")}>RTF</button>
                  </div>
                )}
              </div>

              <button className="reader-session-button" type="button" data-catalyst-action="open-pdf" aria-keyshortcuts="Control+O Meta+O" onClick={() => void pickDocument()} aria-label="Open PDFs" title="Open one or more PDFs">
                <InstrumentGlyph name="open-folder" />
                <span className="reader-session-label">Open</span>
              </button>
              <button
                className="reader-session-button"
                type="button"
                data-catalyst-action="close-document"
                aria-keyshortcuts="Control+Shift+X Meta+Shift+X"
                onClick={closeCurrentDocument}
                disabled={!viewerHasDocument}
                aria-label="Close current PDF"
                title="Close current PDF · Ctrl/Cmd+Shift+X"
              >
                <InstrumentGlyph name="close" />
                <span className="reader-session-label">Close</span>
              </button>
            </div>
            {documentNavigationRecords.length > 0 && (
              <select
                className="reader-document-switcher"
                data-catalyst-action="switch-document"
                aria-label="Switch document"
                value={state.activeDocumentId ?? ""}
                onChange={(event) => void switchDocument(event.currentTarget.value)}
              >
                {documentNavigationRecords.map((document, index) => (
                  <option
                    key={document.id}
                    value={document.id}
                    data-catalyst-address={`D ${index + 1}`}
                  >
                    {`${document.name.replace(/\.pdf$/i, "")} (D${index + 1})`}
                  </option>
                ))}
              </select>
            )}
          </div>

          <input
            ref={fileInputRef}
            data-catalyst-file-input="pdf"
            hidden
            tabIndex={-1}
            type="file"
            accept="application/pdf,.pdf"
            onChange={(event) => {
              const input = event.currentTarget;
              const files = Array.from(input.files ?? []);
              const reconnectFromId = browserReconnectTargetRef.current;
              const navigationFrom =
                browserOpenFromLocationRef.current ?? captureReaderLocation();
              browserReconnectTargetRef.current = null;
              browserOpenFromLocationRef.current = null;
              input.value = "";

              if (files.length === 0) return;

              if (reconnectFromId) {
                const file = files[0];
                void browserPdfSource(file)
                  .then((source) => openSource(source, reconnectFromId))
                  .catch((error) => {
                    console.error("Browser PDF reconnect failed", error);
                    setStatus(`Could not open ${file.name}`);
                  });
                return;
              }

              void (async () => {
                const openedIds: string[] = [];
                for (const file of files) {
                  try {
                    const source = await browserPdfSource(file);
                    const openedId = await openSource(source);
                    if (openedId) openedIds.push(openedId);
                  } catch (error) {
                    console.error("Browser PDF open failed", error);
                    setStatus(`Could not open ${file.name}`);
                  }
                }

                const openedId = openedIds.at(-1);
                if (!openedId) return;
                setViewerHasDocument(true);
                const pageIndex = currentPageByDocumentRef.current[openedId] ?? 0;
                commitReaderTransition(navigationFrom, {
                  documentId: openedId,
                  pageIndex,
                });
                setActivePane("reader");
                if (files.length > 1) {
                  setStatus(
                    openedIds.length === files.length
                      ? `Opened ${openedIds.length} PDFs`
                      : `Opened ${openedIds.length} of ${files.length} PDFs`,
                  );
                }
              })();
            }}
          />
          <input
            ref={workspaceFileInputRef}
            data-catalyst-file-input="session"
            hidden
            tabIndex={-1}
            type="file"
            accept=".catalyst.xml,application/xml,text/xml"
            onChange={(event) => {
              const file = event.currentTarget.files?.[0];
              event.currentTarget.value = "";
              if (!file) return;

              void loadWorkspaceFile(file);
            }}
          />
        </header>

        <div className="reader-body">
          <div className="reader-surface">
          <ThoriumPdfReader
            ref={viewerRef}
            onReady={handleViewerReady}
            style={{ width: "100%", height: "100%" }}
          />

          {viewerReady && !viewerHasDocument && (
            <div className="pdf-empty-overlay">
              <div className="pdf-empty-content">
                <CatalystMark size={66} className="reader-empty-brand" />
                <h1>{activeDocument ? "Source unavailable" : "Open a PDF"}</h1>
                <button
                  className="button button-primary pdf-empty-action"
                  onClick={() =>
                    activeDocument
                      ? void reconnectDocument(activeDocument)
                      : void pickDocument()
                  }
                >
                  {activeDocument ? "Locate PDF" : "Open PDF"}
                </button>
              </div>
            </div>
          )}
          </div>
        </div>
      </section>


      <aside
        ref={contextPaneRef}
        className="context-pane"
        aria-label="Research context"
        data-catalyst-surface={contextMode === "graph" ? "outline" : "methods"}
        data-context-mode={contextMode}
        data-pane-active={activePane === "context" ? "true" : "false"}
        onPointerDownCapture={(event) => {
          if (unifiedWorkflowResearch && (event.target as HTMLElement).closest(".selection-card")) return;
          setActivePane("context");
        }}
        onFocusCapture={(event) => {
          if (unifiedWorkflowResearch && (event.target as HTMLElement).closest(".selection-card")) return;
          setActivePane("context");
        }}
      >
        <header className="context-header catalyst-header" aria-hidden="true" />

        <div className="context-tabs" role="tablist" aria-label="Workspace views">
          <button
            id="catalyst-tab-outline"
            className={contextMode === "graph" ? "context-tab active" : "context-tab"}
            data-catalyst-action="open-outline"
            onClick={() => navigateToContextMode("graph")}
            role="tab"
            aria-controls="catalyst-surface-outline"
            aria-keyshortcuts="Alt+2"
            aria-selected={contextMode === "graph"}
          >
            Outline <span>{Object.values(state.notes).length}</span>
          </button>
          {enabledCapabilities.methods && (
            <button
              id="catalyst-tab-methods"
              className={contextMode === "techniques" ? "context-tab active" : "context-tab"}
              data-catalyst-action="open-methods"
              onClick={() => navigateToContextMode("techniques")}
              role="tab"
              aria-controls="catalyst-surface-methods"
              aria-keyshortcuts="Alt+3"
              aria-selected={contextMode === "techniques"}
            >
              Methods <span>{techniqueRunCount}</span>
            </button>
          )}
        </div>

        {state.pendingSelection && (
          <SelectionCard
            selection={state.pendingSelection}
            onSaveSource={() => captureSourceSelection(state.pendingSelection!)}
            onCopy={() => void copySelectionWithSource(state.pendingSelection!)}
            onDismiss={clearPendingSelection}
          />
        )}

        {contextMode === "graph" ? (
          <OutlineWorkspace
            state={state}
            onSelectNote={(noteId) => dispatch({ type: "note/activated", id: noteId })}
            onCreateOutlineItem={createOutlineItem}
            onRenameNote={(noteId, title) =>
              dispatch({ type: "note/updated", id: noteId, patch: { title } })
            }
            onUpdateNoteBody={(noteId, body) =>
              dispatch({ type: "note/updated", id: noteId, patch: { body } })
            }
            onCommitNote={() => void flush()}
            onRenameAnalysis={(title) => dispatch({ type: "analysis/title-updated", title })}
            onDeleteNote={deleteNote}
            onSetCollapsed={(placementId, collapsed) =>
              dispatch({ type: "outline/collapse-set", placementId, collapsed })
            }
            onReorderOutlineItem={(placementId, targetPlacementId, placement) => {
              dispatch({ type: "outline/item-reordered", placementId, targetPlacementId, placement });
              setStatus(placement === "before" ? "Branch moved earlier" : "Branch moved later");
            }}
            onOutdentOutlineItem={(placementId) => {
              dispatch({ type: "outline/item-outdented", placementId });
              setStatus("Branch outdented");
            }}
            onIndentOutlineItem={(placementId) => {
              dispatch({ type: "outline/item-indented", placementId });
              setStatus("Branch indented");
            }}
          />
        ) : (
          <TechniqueWorkspace
            state={state}
            definitions={techniqueDefinitions}
            onAddRun={addTechnique}
            onUpdateRunDefinition={(runId, patch) =>
              dispatch({ type: "technique-run/definition-updated", id: runId, patch })
            }
            onUpdateResponse={(runId, stepId, value) =>
              dispatch({ type: "technique-run/response-updated", id: runId, stepId, value })
            }
            onMoveRun={(runId, direction) =>
              dispatch({ type: "technique-run/reordered", id: runId, direction })
            }
            onIndentRun={(runId) => dispatch({ type: "technique-run/indented", id: runId })}
            onOutdentRun={(runId) => dispatch({ type: "technique-run/outdented", id: runId })}
            onDeleteRun={(runId) => dispatch({ type: "technique-run/deleted", id: runId })}
          />
        )}
      </aside>
    </main>
  );
}
