import { useEffect, useMemo, useRef, useState, type CSSProperties, type KeyboardEvent as ReactKeyboardEvent } from "react";
import type { OutlineItem, WorkspaceState } from "../../domain/types";
import { outlineItemsForParent, outlineReferenceItemsForItem } from "../../domain/outline";
import { nearestVisiblePlacementForNote, outlineFallbackAfterRemoval, outlineRows, outlineShouldHandleRowShortcut } from "./outlineModel";
import { noteDisplayTitle } from "../../shared/display";
import { InstrumentGlyph } from "../../ui/CatalystSymbols";


function referenceChildPlacementIds(state: WorkspaceState, parentItemId: string): string[] {
  return outlineItemsForParent(state.outline, parentItemId)
    .filter((item) => item.kind === "reference")
    .map((item) => item.id);
}

function parentPlacementIdFor(state: WorkspaceState, placementId: string): string | null {
  const item = state.outline.items[placementId];
  if (!item || item.parentItemId === state.outline.rootItemId) return null;
  return item.parentItemId;
}

function noteIdForPlacement(state: WorkspaceState, placementId: string): string | null {
  const item = state.outline.items[placementId];
  return item?.kind === "reference" ? item.itemId : null;
}

export function AnalysisOutlineView({
  state,
  editingNoteId,
  editTitle,
  onEditTitleChange,
  onBeginEdit,
  onCommitEdit,
  onCancelEdit,
  onSelectNote,
  onUpdateNoteBody,
  onCommitNote,
  onDeleteNote,
  onRenameAnalysis,
  onCreateOutlineItem,
  onSetCollapsed,
  onReorderOutlineItem,
  onOutdentOutlineItem,
  onIndentOutlineItem,
}: {
  state: WorkspaceState;
  editingNoteId: string | null;
  editTitle: string;
  onEditTitleChange: (title: string) => void;
  onBeginEdit: (noteId: string) => void;
  onCommitEdit: (noteId: string) => void;
  onCancelEdit: (noteId: string) => void;
  onSelectNote: (noteId: string) => void;
  onUpdateNoteBody: (noteId: string, body: string) => void;
  onCommitNote: () => void;
  onDeleteNote: (noteId: string) => void;
  onRenameAnalysis: (name: string) => void;
  onCreateOutlineItem: (parentPlacementId: string | null) => string;
  onSetCollapsed: (placementId: string, collapsed: boolean) => void;
  onReorderOutlineItem: (placementId: string, targetPlacementId: string, placement: "before" | "after") => void;
  onOutdentOutlineItem: (placementId: string) => void;
  onIndentOutlineItem: (placementId: string) => void;
}) {
  const rows = useMemo(() => outlineRows(state), [state]);
  const outlineNumberByPlacementId = useMemo(() => {
    const labels = new Map<string, string>();
    const visit = (parentItemId: string, numberPath: number[]) => {
      const children = outlineItemsForParent(state.outline, parentItemId)
        .filter((item) => item.kind === "reference");
      children.forEach((item, siblingIndex) => {
        const nextNumberPath = [...numberPath, siblingIndex + 1];
        labels.set(item.id, nextNumberPath.join("."));
        visit(item.id, nextNumberPath);
      });
    };
    visit(state.outline.rootItemId, []);
    return labels;
  }, [state.outline]);
  const rowIndex = useMemo(() => new Map(rows.map((row, index) => [row.placementId, index])), [rows]);
  const collapsedPlacementIds = useMemo(() => new Set(state.outlineSession.collapsedItemIds), [state.outlineSession.collapsedItemIds]);
  const [masterCollapsed, setMasterCollapsed] = useState(false);
  const [editingMaster, setEditingMaster] = useState(false);
  const [masterEditTitle, setMasterEditTitle] = useState("");
  const masterHandledBlurRef = useRef(false);
  const noteHandledBlurRef = useRef<string | null>(null);
  const masterTitle = state.analysisRoot.title.trim() || "Title";

  const beginMasterEdit = () => {
    setMasterEditTitle(masterTitle);
    setEditingMaster(true);
  };

  const commitMasterEdit = (fromBlur = false) => {
    if (!fromBlur) masterHandledBlurRef.current = true;
    onRenameAnalysis(masterEditTitle);
    setEditingMaster(false);
    window.requestAnimationFrame(() => {
      viewRef.current?.querySelector<HTMLElement>("[data-outline-master]")?.focus({ preventScroll: true });
    });
  };

  const cancelMasterEdit = () => {
    masterHandledBlurRef.current = true;
    setMasterEditTitle(masterTitle);
    setEditingMaster(false);
    window.requestAnimationFrame(() => {
      masterHandledBlurRef.current = false;
      viewRef.current?.querySelector<HTMLElement>("[data-outline-master]")?.focus({ preventScroll: true });
    });
  };

  const siblingIds = (placementId: string): string[] => {
    const item = state.outline.items[placementId];
    if (!item) return [];
    return referenceChildPlacementIds(state, item.parentItemId);
  };

  const beginNoteEdit = (noteId: string) => {
    onBeginEdit(noteId);
  };

  const createRoot = (): string => {
    return onCreateOutlineItem(null);
  };

  const createSiblingAfter = (placementId: string): string => {
    const parentId = parentPlacementIdFor(state, placementId);
    const newPlacementId = onCreateOutlineItem(parentId);
    onReorderOutlineItem(newPlacementId, placementId, "after");
    return newPlacementId;
  };


  const viewRef = useRef<HTMLDivElement>(null);

  const visiblePlacementIds = useMemo(
    () => masterCollapsed ? new Set<string>() : new Set(rows.map((row) => row.placementId)),
    [masterCollapsed, rows],
  );
  const visiblePlacementForNote = (noteId: string | null): string | null =>
    nearestVisiblePlacementForNote(state, visiblePlacementIds, noteId);

  const keyboardTargetId = (): string | null => {
    const focused = document.activeElement?.closest?.("[data-outline-placement-id]") as HTMLElement | null;
    const focusedId = focused?.dataset.outlinePlacementId;
    if (focusedId && rowIndex.has(focusedId)) return focusedId;
    const activeVisible = visiblePlacementForNote(state.activeNoteId);
    if (activeVisible) return activeVisible;
    return masterCollapsed ? null : rows[0]?.placementId ?? null;
  };

  const focusRowElement = (placementId: string, preventScroll = false) => {
    window.requestAnimationFrame(() => {
      const escaped = typeof CSS !== "undefined" && typeof CSS.escape === "function" ? CSS.escape(placementId) : placementId.replace(/["\\]/g, "\\$&");
      viewRef.current?.querySelector<HTMLElement>(`[data-outline-placement-id="${escaped}"]`)?.focus({ preventScroll });
    });
  };

  const focusRow = (placementId: string) => {
    const noteId = noteIdForPlacement(state, placementId);
    if (noteId) onSelectNote(noteId);
    focusRowElement(placementId);
  };

  const commitNoteEdit = (noteId: string, placementId: string, fromBlur = false) => {
    if (!fromBlur) noteHandledBlurRef.current = noteId;
    onCommitEdit(noteId);
    focusRowElement(placementId, true);
  };

  const cancelNoteEdit = (noteId: string, placementId: string) => {
    noteHandledBlurRef.current = noteId;
    onCancelEdit(noteId);
    window.requestAnimationFrame(() => {
      if (noteHandledBlurRef.current === noteId) noteHandledBlurRef.current = null;
      focusRowElement(placementId, true);
    });
  };

  const refocusMovedRow = (placementId: string) => {
    focusRow(placementId);
    window.requestAnimationFrame(() => focusRowElement(placementId, true));
  };

  const reorderAndRefocus = (placementId: string, targetPlacementId: string, placement: "before" | "after") => {
    onReorderOutlineItem(placementId, targetPlacementId, placement);
    refocusMovedRow(placementId);
  };

  const outdentAndRefocus = (placementId: string) => {
    onOutdentOutlineItem(placementId);
    refocusMovedRow(placementId);
  };

  const indentAndRefocus = (placementId: string, previousSiblingPlacementId: string) => {
    if (collapsedPlacementIds.has(previousSiblingPlacementId)) onSetCollapsed(previousSiblingPlacementId, false);
    onIndentOutlineItem(placementId);
    refocusMovedRow(placementId);
  };

  const isPlacementDescendantOf = (placementId: string | null, ancestorPlacementId: string): boolean => {
    let current = placementId;
    const seen = new Set<string>();
    while (current && !seen.has(current)) {
      if (current === ancestorPlacementId) return true;
      seen.add(current);
      const item = state.outline.items[current];
      current = item && item.parentItemId !== state.outline.rootItemId ? item.parentItemId : null;
    }
    return false;
  };

  const setCollapsedKeepingContext = (placementId: string, collapsed: boolean) => {
    const activePlacementId = state.activeNoteId
      ? outlineReferenceItemsForItem(state.outline, state.activeNoteId)[0]?.id ?? null
      : null;
    const hidesActiveSelection = collapsed && activePlacementId !== placementId && isPlacementDescendantOf(activePlacementId, placementId);
    onSetCollapsed(placementId, collapsed);
    if (hidesActiveSelection) focusRow(placementId);
    else if (activePlacementId === placementId) focusRowElement(placementId, true);
  };

  const focusMaster = (preventScroll = false) => {
    window.requestAnimationFrame(() => {
      viewRef.current?.querySelector<HTMLElement>("[data-outline-master]")?.focus({ preventScroll });
    });
  };

  const deleteOutlineNote = (placementId: string, noteId: string) => {
    const fallbackPlacementId = outlineFallbackAfterRemoval(rows, placementId);
    const preserveLocalSelection = state.activeNoteId === noteId;
    onDeleteNote(noteId);
    if (!preserveLocalSelection) return;
    if (fallbackPlacementId) focusRow(fallbackPlacementId);
    else focusMaster();
  };


  useEffect(() => {
    const activeVisible = visiblePlacementForNote(state.activeNoteId);
    if (activeVisible) focusRowElement(activeVisible, true);
    else focusMaster(true);
  }, []);

  useEffect(() => {
    if (editingMaster || editingNoteId) return;
    const focused = document.activeElement as HTMLElement | null;
    if (!focused || !viewRef.current?.contains(focused)) return;
    if (focused.matches("input, textarea, select, [contenteditable='true']")) return;
    const activeVisible = visiblePlacementForNote(state.activeNoteId);
    if (activeVisible) focusRowElement(activeVisible, true);
    else focusMaster(true);
  }, [editingMaster, editingNoteId, rows, state.activeNoteId]);

  const handleOutlineKeyDown = (event: ReactKeyboardEvent<HTMLDivElement>) => {
    const target = event.target as HTMLElement;
    const editableTarget = target.matches("input, textarea, select, [contenteditable='true']");
    const interactiveControl = target.closest("button, [role='button'], [data-outline-metadata-action]") as HTMLElement | null;
    if (!outlineShouldHandleRowShortcut({
      editable: editableTarget,
      interactiveControl: Boolean(interactiveControl),
      shortcutSurface: Boolean(interactiveControl?.hasAttribute("data-outline-shortcut-surface")),
    })) return;
    if (target.closest("[data-outline-master]")) {
      if (event.key === "End" && rows.length > 0) {
        event.preventDefault();
        if (masterCollapsed) setMasterCollapsed(false);
        focusRow(rows[rows.length - 1].placementId);
      }
      if (event.key === "F2") { event.preventDefault(); beginMasterEdit(); }
      else if (event.key === "Enter") {
        event.preventDefault();
        if (masterCollapsed) setMasterCollapsed(false);
        createRoot();
      }
      else if (event.key === "ArrowLeft" && !masterCollapsed) { event.preventDefault(); setMasterCollapsed(true); }
      else if (event.key === "ArrowRight" && masterCollapsed) { event.preventDefault(); setMasterCollapsed(false); }
      else if (event.key === "ArrowDown" && !masterCollapsed && rows[0]) { event.preventDefault(); focusRow(rows[0].placementId); }
      return;
    }
    const placementId = keyboardTargetId();
    if (!placementId) return;
    const noteId = noteIdForPlacement(state, placementId);
    if (!noteId) return;
    const parentPlacementId = parentPlacementIdFor(state, placementId);
    const siblings = siblingIds(placementId);
    const siblingIndex = siblings.indexOf(placementId);
    const visibleIndex = rowIndex.get(placementId) ?? -1;
    const collapsed = collapsedPlacementIds.has(placementId);
    const children = referenceChildPlacementIds(state, placementId);

    if (event.key === "Home") {
      event.preventDefault();
      if (rows[0]) focusRow(rows[0].placementId);
    } else if (event.key === "End") {
      event.preventDefault();
      const last = rows[rows.length - 1];
      if (last) focusRow(last.placementId);
    } else if (event.key === "Enter") {
      event.preventDefault();
      createSiblingAfter(placementId);
    } else if (event.key === "F2") {
      event.preventDefault();
      beginNoteEdit(noteId);
    } else if (event.key === "Backspace") {
      event.preventDefault();
      deleteOutlineNote(placementId, noteId);
    } else if (event.key === "Tab") {
      if (event.shiftKey && parentPlacementId) {
        event.preventDefault();
        outdentAndRefocus(placementId);
      } else if (!event.shiftKey && siblingIndex > 0) {
        event.preventDefault();
        indentAndRefocus(placementId, siblings[siblingIndex - 1]);
      }
    } else if (event.altKey && event.key === "ArrowUp" && siblingIndex > 0) {
      event.preventDefault();
      reorderAndRefocus(placementId, siblings[siblingIndex - 1], "before");
    } else if (event.altKey && event.key === "ArrowDown" && siblingIndex >= 0 && siblingIndex < siblings.length - 1) {
      event.preventDefault();
      reorderAndRefocus(placementId, siblings[siblingIndex + 1], "after");
    } else if (event.key === "ArrowUp" && visibleIndex > 0) {
      event.preventDefault();
      focusRow(rows[visibleIndex - 1].placementId);
    } else if (event.key === "ArrowUp" && visibleIndex === 0) {
      event.preventDefault();
      focusMaster();
    } else if (event.key === "ArrowDown" && visibleIndex >= 0 && visibleIndex < rows.length - 1) {
      event.preventDefault();
      focusRow(rows[visibleIndex + 1].placementId);
    } else if (event.key === "ArrowLeft") {
      if (!collapsed && children.length > 0) {
        event.preventDefault();
        setCollapsedKeepingContext(placementId, true);
      } else if (parentPlacementId) {
        event.preventDefault();
        focusRow(parentPlacementId);
      } else {
        event.preventDefault();
        focusMaster();
      }
    } else if (event.key === "ArrowRight") {
      if (collapsed && children.length > 0) {
        event.preventDefault();
        onSetCollapsed(placementId, false);
      } else if (!collapsed && children.length > 0) {
        event.preventDefault();
        focusRow(children[0]);
      }
    }
  };

  useEffect(() => {
    const onAddressNavigation = (event: Event) => {
      const detail = (event as CustomEvent<{ address?: string; target?: "row" | "note" }>).detail;
      const address = String(detail?.address ?? "").trim();
      const target = detail?.target ?? "row";
      if (!/^\d+(?:\.\d+)*$/.test(address)) return;
      const indexes = address.split(".").map((part) => Number(part) - 1);
      const childrenByParent = new Map<string, OutlineItem[]>();
      for (const item of Object.values(state.outline.items)) {
        if (item.kind !== "reference") continue;
        const siblings = childrenByParent.get(item.parentItemId) ?? [];
        siblings.push(item);
        childrenByParent.set(item.parentItemId, siblings);
      }
      for (const siblings of childrenByParent.values()) {
        siblings.sort((left, right) => left.siblingOrder - right.siblingOrder || left.id.localeCompare(right.id));
      }

      let parentItemId = state.outline.rootItemId;
      let targetPlacementId: string | null = null;
      const ancestors: string[] = [];
      for (const index of indexes) {
        const target = (childrenByParent.get(parentItemId) ?? [])[index];
        if (!target) {
          window.dispatchEvent(new CustomEvent("catalyst:navigation-result", { detail: { success: false, address: `O ${address}` } }));
          return;
        }
        if (targetPlacementId) ancestors.push(targetPlacementId);
        targetPlacementId = target.id;
        parentItemId = target.id;
      }

      if (!targetPlacementId) return;
      const noteId = noteIdForPlacement(state, targetPlacementId);
      if (!noteId) return;
      setMasterCollapsed(false);
      for (const ancestorId of ancestors) onSetCollapsed(ancestorId, false);
      onSelectNote(noteId);
      window.requestAnimationFrame(() => window.requestAnimationFrame(() => {
        if (target === "note") {
          const escaped = typeof CSS !== "undefined" && typeof CSS.escape === "function"
            ? CSS.escape(targetPlacementId!)
            : targetPlacementId!.replace(/["\\]/g, "\\$&");
          const row = viewRef.current?.querySelector<HTMLElement>(`[data-outline-placement-id="${escaped}"]`);
          row?.querySelector<HTMLTextAreaElement>("[data-catalyst-note-body]")?.focus({ preventScroll: true });
        } else {
          focusRowElement(targetPlacementId!, true);
        }
      }));
      window.dispatchEvent(new CustomEvent("catalyst:navigation-result", { detail: { success: true, address: `O ${address}${target === "note" ? " note" : ""}` } }));
    };
    window.addEventListener("catalyst:navigate-outline-address", onAddressNavigation);
    return () => window.removeEventListener("catalyst:navigate-outline-address", onAddressNavigation);
  }, [onSelectNote, onSetCollapsed, state]);

  const rovingFocusId = visiblePlacementForNote(state.activeNoteId);

  return (
    <div ref={viewRef} className="picture-outline-view" data-outline-root="true" onKeyDown={handleOutlineKeyDown}>
      <div className="picture-outline-list" role="tree" aria-label="Analysis outline">
        <div
          className="picture-outline-master"
          role="treeitem"
          aria-level={1}
          aria-expanded={!masterCollapsed}
          data-outline-master="true"
          tabIndex={rovingFocusId ? -1 : 0}
        >
          <button
            className="picture-outline-fold"
            onClick={() => setMasterCollapsed((current) => !current)}
            title={masterCollapsed ? "Expand outline" : "Collapse outline"}
            aria-label={masterCollapsed ? "Expand outline" : "Collapse outline"}
          >
            <InstrumentGlyph name={masterCollapsed ? "expand" : "collapse"} />
          </button>
          {editingMaster ? (
            <input
              className="picture-outline-master-title-edit"
              autoFocus
              value={masterEditTitle}
              onChange={(event) => setMasterEditTitle(event.target.value)}
              onBlur={() => {
                if (masterHandledBlurRef.current) {
                  masterHandledBlurRef.current = false;
                  return;
                }
                commitMasterEdit(true);
              }}
              onKeyDown={(event) => {
                if (event.key === "Escape") { event.preventDefault(); cancelMasterEdit(); }
                else if (event.key === "Enter") { event.preventDefault(); commitMasterEdit(); }
              }}
              aria-label="Analysis title"
            />
          ) : (
            <button
              className="picture-outline-master-title"
              data-outline-shortcut-surface="true"
              onClick={beginMasterEdit}
              title="Click to rename outline"
            >
              <strong>{masterTitle}</strong>
            </button>
          )}
        </div>

        {!masterCollapsed && rows.map((row) => {
          const note = state.notes[row.noteId];
          if (!note) return null;
          const parentPlacementId = parentPlacementIdFor(state, row.placementId);
          const siblings = siblingIds(row.placementId);
          const siblingIndex = siblings.indexOf(row.placementId);
          const previousSiblingId = siblingIndex > 0 ? siblings[siblingIndex - 1] : null;
          const active = state.activeNoteId === row.noteId;
          const editing = editingNoteId === row.noteId;
          const hasStructuralChildren = row.childCount > 0;
          const outlineNumber = outlineNumberByPlacementId.get(row.placementId) ?? "";
          const visualDepth = Math.min(row.depth, 12);
          const style = { "--outline-depth": visualDepth } as CSSProperties;
          return (
            <div
                key={row.placementId}
                className={`picture-outline-row${active ? " is-active" : ""}`}
                style={style}
                role="treeitem"
                aria-level={row.depth + 2}
                aria-expanded={hasStructuralChildren ? !row.collapsed : undefined}
                aria-selected={active}
                data-outline-note-id={row.noteId}
                data-outline-placement-id={row.placementId}
                data-catalyst-address={`O ${outlineNumber}`}
                tabIndex={row.placementId === rovingFocusId ? 0 : -1}
              >
                {hasStructuralChildren ? (
                  <button
                    className="picture-outline-fold"
                    onClick={() => setCollapsedKeepingContext(row.placementId, !row.collapsed)}
                    title={row.collapsed ? "Expand" : "Collapse"}
                    aria-label={row.collapsed ? "Expand" : "Collapse"}
                  >
                    <InstrumentGlyph name={row.collapsed ? "expand" : "collapse"} />
                  </button>
                ) : (
                  <span className="picture-outline-fold-spacer" aria-hidden="true" />
                )}
                {editing ? (
                  <input
                    className="picture-outline-title-edit"
                    autoFocus
                    value={editTitle}
                    onChange={(event) => onEditTitleChange(event.target.value)}
                    onBlur={() => {
                      if (noteHandledBlurRef.current === row.noteId) {
                        noteHandledBlurRef.current = null;
                        return;
                      }
                      commitNoteEdit(row.noteId, row.placementId, true);
                    }}
                    onKeyDown={(event) => {
                      if (event.key === "Escape") {
                        event.preventDefault();
                        cancelNoteEdit(row.noteId, row.placementId);
                      } else if (event.key === "Enter") {
                        event.preventDefault();
                        noteHandledBlurRef.current = row.noteId;
                        onCommitEdit(row.noteId);
                        createSiblingAfter(row.placementId);
                      } else if (event.key === "Tab") {
                        if (event.shiftKey && parentPlacementId) {
                          event.preventDefault();
                          onOutdentOutlineItem(row.placementId);
                        } else if (!event.shiftKey && previousSiblingId) {
                          event.preventDefault();
                          if (collapsedPlacementIds.has(previousSiblingId)) onSetCollapsed(previousSiblingId, false);
                          onIndentOutlineItem(row.placementId);
                        }
                      }
                    }}
                    aria-label="Note title"
                  />
                ) : (
                  <button
                    className="picture-outline-title"
                    data-outline-shortcut-surface="true"
                    onClick={() => focusRow(row.placementId)}
                    onDoubleClick={() => beginNoteEdit(row.noteId)}
                    title="Edit note; double-click to rename"
                  >
                    <span className="picture-outline-number" aria-hidden="true">{outlineNumber}.</span>
                    <span className="picture-outline-label">{noteDisplayTitle(note)}</span>
                  </button>
                )}
                {active && !editing && (
                  <textarea
                    className="picture-outline-note-editor"
                    data-catalyst-note-body="true"
                    data-catalyst-address={`O ${outlineNumber} note`}
                    value={note.body}
                    onChange={(event) => onUpdateNoteBody(row.noteId, event.target.value)}
                    onBlur={onCommitNote}
                    onKeyDown={(event) => event.stopPropagation()}
                    aria-label={`Notes for ${noteDisplayTitle(note)}`}
                  />
                )}
              </div>
          );
        })}
      </div>
    </div>
  );
}
