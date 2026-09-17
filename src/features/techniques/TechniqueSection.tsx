import { useEffect, useMemo, useRef, useState, type CSSProperties } from "react";
import type {
  TechniqueDefinition,
  TechniqueRun,
  TechniqueStepDefinition,
} from "../../domain/types";
import { InstrumentGlyph } from "../../ui/CatalystSymbols";

type BuilderStep = Pick<
  TechniqueStepDefinition,
  "id" | "title" | "prompt" | "responseKind" | "placeholder"
>;

function emptyStep(): BuilderStep {
  return {
    id: crypto.randomUUID(),
    title: "",
    prompt: "",
    responseKind: "long-text",
    placeholder: "",
  };
}

function blankTechniqueDefinition(name = ""): TechniqueDefinition {
  const now = new Date().toISOString();
  return {
    id: crypto.randomUUID(),
    name: name.trim(),
    summary: "",
    category: "other",
    builtIn: false,
    version: 1,
    steps: [emptyStep()],
    createdAt: now,
    updatedAt: now,
  };
}

function TechniquePicker({
  definitions,
  onClose,
  onAdd,
}: {
  definitions: TechniqueDefinition[];
  onClose: () => void;
  onAdd: (definition: TechniqueDefinition) => void;
}) {
  const [query, setQuery] = useState("");
  const [customName, setCustomName] = useState("");
  const [clusterFilter, setClusterFilter] = useState("");
  const [page, setPage] = useState(0);
  const pageSize = 10;
  const normalized = query.trim().toLowerCase();
  const clusterOptions = [...new Set(
    definitions.map((definition) => definition.cluster?.trim() || "Other"),
  )].sort((left, right) => left.localeCompare(right));
  const visible = definitions
    .filter((definition) => {
      const cluster = definition.cluster?.trim() || "Other";
      if (clusterFilter && cluster !== clusterFilter) return false;
      if (!normalized) return true;
      return definition.name.toLowerCase().includes(normalized);
    })
    .sort((left, right) => left.name.localeCompare(right.name));
  const pageCount = Math.max(1, Math.ceil(visible.length / pageSize));
  const currentPage = Math.min(page, pageCount - 1);
  const pageItems = visible.slice(currentPage * pageSize, (currentPage + 1) * pageSize);

  return (
    <div className="technique-sequence-picker-backdrop" role="presentation" onMouseDown={onClose}>
      <section
        className="technique-sequence-picker"
        role="dialog"
        aria-modal="true"
        aria-label="Add method to sequence"
        onMouseDown={(event) => event.stopPropagation()}
      >
        <header className="technique-sequence-picker-header">
          <div>
            <h2>Add method</h2>
          </div>
          <button className="icon-button" type="button" onClick={onClose} aria-label="Close" title="Close">
            <InstrumentGlyph name="close" />
          </button>
        </header>

        <div className="technique-sequence-picker-custom">
          <input
            value={customName}
            onChange={(event) => setCustomName(event.target.value)}
            placeholder="Custom method name (optional)"
            aria-label="Custom method name"
          />
          <button
            className="button button-secondary compact-button"
            type="button"
            onClick={() => onAdd(blankTechniqueDefinition(customName))}
          >
            Add custom
          </button>
        </div>
        <div className="technique-sequence-picker-search">
          <input
            value={query}
            onChange={(event) => {
              setQuery(event.target.value);
              setPage(0);
            }}
            placeholder="Find catalog method"
            aria-label="Find catalog method"
            autoFocus
          />
          <select
            className="technique-sequence-picker-filter"
            value={clusterFilter}
            onChange={(event) => {
              setClusterFilter(event.target.value);
              setPage(0);
            }}
            aria-label="Filter methods by cluster"
          >
            <option value="">All clusters</option>
            {clusterOptions.map((cluster) => (
              <option key={cluster} value={cluster}>{cluster}</option>
            ))}
          </select>
        </div>
        <div className="technique-sequence-picker-list">
          {pageItems.map((definition) => (
            <div className="technique-sequence-picker-row" key={definition.id}>
              <button
                className="technique-sequence-picker-main"
                type="button"
                onClick={() => onAdd(definition)}
              >
                <strong>{definition.name}</strong>
              </button>
            </div>
          ))}
          {visible.length === 0 && (
            <p className="muted technique-empty">No methods match that search.</p>
          )}
        </div>
        {visible.length > 0 && (
          <nav className="technique-sequence-picker-pagination" aria-label="Method pages">
            <button
              className="button button-ghost compact-button"
              type="button"
              onClick={() => setPage((current) => Math.max(0, current - 1))}
              disabled={currentPage === 0}
            >
              Previous
            </button>
            <span>
              {currentPage * pageSize + 1}-{Math.min((currentPage + 1) * pageSize, visible.length)} of {visible.length}
            </span>
            <button
              className="button button-ghost compact-button"
              type="button"
              onClick={() => setPage((current) => Math.min(pageCount - 1, current + 1))}
              disabled={currentPage >= pageCount - 1}
            >
              Next
            </button>
          </nav>
        )}
      </section>
    </div>
  );
}

function MethodCatalog({
  definitions,
  onClose,
}: {
  definitions: TechniqueDefinition[];
  onClose: () => void;
}) {
  const methods = useMemo(
    () => [...definitions].sort((left, right) => left.name.localeCompare(right.name) || left.id.localeCompare(right.id)),
    [definitions],
  );
  return (
    <div className="technique-catalog-backdrop" role="presentation" onMouseDown={onClose}>
      <section
        className="technique-catalog"
        role="dialog"
        aria-modal="true"
        aria-label={`All methods — read-only LLM reference (${methods.length})`}
        data-catalyst-dialog="method-catalog"
        onMouseDown={(event) => event.stopPropagation()}
      >
        <header className="technique-catalog-header">
          <div className="technique-catalog-heading">
            <h2>All methods</h2>
            <p>Read-only reference intended for LLM use.</p>
          </div>
          <span>{methods.length}</span>
          <button className="icon-button" type="button" onClick={onClose} aria-label="Close all methods" title="Close">
            <InstrumentGlyph name="close" />
          </button>
        </header>
        <ol className="technique-catalog-list" data-catalyst-method-catalog="true">
          {methods.map((definition, index) => (
            <li
              key={definition.id}
              className="technique-catalog-item"
              data-catalyst-method-definition-id={definition.id}
              data-catalyst-method-name={definition.name}
            >
              <span className="technique-catalog-index">{index + 1}.</span>
              <span className="technique-catalog-copy">
                <strong>{definition.name || "Untitled method"}</strong>
                {definition.summary && <span>{definition.summary}</span>}
              </span>
            </li>
          ))}
        </ol>
      </section>
    </div>
  );
}

function TechniqueRunEditor({
  run,
  address,
  onUpdateRunDefinition,
  onUpdateResponse,
}: {
  run: TechniqueRun;
  address: string;
  onUpdateRunDefinition: (
    runId: string,
    patch: Partial<Pick<TechniqueDefinition, "name" | "summary" | "category" | "steps">>,
  ) => void;
  onUpdateResponse: (runId: string, stepId: string, value: string) => void;
}) {
  const definition = run.definitionSnapshot;
  const insertStepAt = (index: number) => {
    const steps = [...definition.steps];
    steps.splice(index, 0, emptyStep());
    onUpdateRunDefinition(run.id, { steps });
  };
  return (
    <div
      className="technique-run-body"
      data-catalyst-method-run-id={run.id}
      data-catalyst-address={`${address} form`}
    >
      <div className="technique-run-definition-editor">
        <input
          className="technique-name-field"
          value={definition.name}
          onChange={(event) => onUpdateRunDefinition(run.id, { name: event.target.value })}
          placeholder="Untitled method"
          aria-label="Method name"
        />
      </div>

      {definition.steps.map((step, index) => (
        <div className="technique-prompt" key={step.id}>
          <span className="technique-prompt-index">{index + 1}</span>
          <span className="technique-prompt-content">
            <input
              className="technique-field-title"
              value={step.title}
              onChange={(event) => onUpdateRunDefinition(run.id, {
                steps: definition.steps.map((candidate) => candidate.id === step.id
                  ? { ...candidate, title: event.target.value }
                  : candidate),
              })}
              aria-label={`Subtask ${index + 1}`}
            />
            <textarea
              className="technique-analysis"
              data-catalyst-method-response-index={index + 1}
              data-catalyst-address={`${address} step ${index + 1}`}
              value={run.responses[step.id] ?? ""}
              onChange={(event) => onUpdateResponse(run.id, step.id, event.target.value)}
              aria-label={`Analysis for subtask ${index + 1}`}
              rows={4}
            />
            <span className="technique-subtask-actions">
              <button
                className="technique-subtask-insert"
                type="button"
                onClick={() => insertStepAt(index + 1)}
                aria-label={`Insert subtask after ${index + 1}`}
                title={`Insert subtask after ${index + 1}`}
              >
                <svg className="instrument-glyph" viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor">
                  <path d="M12 5v14M5 12h14" />
                </svg>
              </button>
              <button
                className="technique-remove-subtask"
                type="button"
                onClick={() => onUpdateRunDefinition(run.id, {
                  steps: definition.steps.filter((candidate) => candidate.id !== step.id),
                })}
                aria-label={`Remove subtask ${index + 1}`}
                title="Remove subtask"
              >
                <InstrumentGlyph name="close" />
              </button>
            </span>
          </span>
        </div>
      ))}
    </div>
  );
}

export function TechniqueSection({
  definitions,
  runs,
  addDisabled = false,
  onAddRun,
  onUpdateRunDefinition,
  onUpdateResponse,
  onMoveRun,
  onIndentRun,
  onOutdentRun,
  onDeleteRun,
}: {
  definitions: TechniqueDefinition[];
  runs: TechniqueRun[];
  addDisabled?: boolean;
  onAddRun: (
    definition: TechniqueDefinition,
    parentRunId?: string | null,
    afterRunId?: string | null,
  ) => string;
  onUpdateRunDefinition: (
    runId: string,
    patch: Partial<Pick<TechniqueDefinition, "name" | "summary" | "category" | "steps">>,
  ) => void;
  onUpdateResponse: (runId: string, stepId: string, value: string) => void;
  onMoveRun: (runId: string, direction: "up" | "down") => void;
  onIndentRun: (runId: string) => void;
  onOutdentRun: (runId: string) => void;
  onDeleteRun: (runId: string) => void;
}) {
  const [pickerOpen, setPickerOpen] = useState(false);
  const [catalogOpen, setCatalogOpen] = useState(false);
  const [selectedRunId, setSelectedRunId] = useState<string | null>(null);
  const [collapsedRunIds, setCollapsedRunIds] = useState<Set<string>>(() => new Set());
  const [addContext, setAddContext] = useState<{
    parentRunId: string | null;
    afterRunId: string | null;
  } | null>(null);
  const listRef = useRef<HTMLOListElement>(null);
  const sectionRef = useRef<HTMLElement>(null);

  const selectedRun = selectedRunId
    ? runs.find((run) => run.id === selectedRunId) ?? null
    : null;

  const treeRows = useMemo(() => {
    const runIds = new Set(runs.map((run) => run.id));
    const children = new Map<string | null, TechniqueRun[]>();
    for (const run of runs) {
      const requestedParent = run.parentRunId ?? null;
      const parentRunId = requestedParent && runIds.has(requestedParent) ? requestedParent : null;
      const siblings = children.get(parentRunId) ?? [];
      siblings.push(run);
      children.set(parentRunId, siblings);
    }
    for (const siblings of children.values()) {
      siblings.sort((left, right) =>
        (left.sequenceIndex ?? Number.MAX_SAFE_INTEGER) -
          (right.sequenceIndex ?? Number.MAX_SAFE_INTEGER) ||
        left.createdAt.localeCompare(right.createdAt) ||
        left.id.localeCompare(right.id),
      );
    }
    const rows: Array<{
      run: TechniqueRun;
      depth: number;
      hasChildren: boolean;
      siblingIndex: number;
      siblingCount: number;
      outlineNumber: string;
    }> = [];
    const visit = (parentRunId: string | null, depth: number, numberPath: number[]) => {
      const siblings = children.get(parentRunId) ?? [];
      siblings.forEach((run, siblingIndex) => {
        const runChildren = children.get(run.id) ?? [];
        const nextNumberPath = [...numberPath, siblingIndex + 1];
        rows.push({
          run,
          depth,
          hasChildren: runChildren.length > 0,
          siblingIndex,
          siblingCount: siblings.length,
          outlineNumber: nextNumberPath.join("."),
        });
        if (runChildren.length > 0 && !collapsedRunIds.has(run.id)) visit(run.id, depth + 1, nextNumberPath);
      });
    };
    visit(null, 0, []);
    return rows;
  }, [collapsedRunIds, runs]);

  const selectedRunAddress = selectedRun
    ? treeRows.find((row) => row.run.id === selectedRun.id)?.outlineNumber ?? ""
    : "";

  const focusRun = (runId: string, deferred = false) => {
    const apply = () => listRef.current
      ?.querySelector<HTMLButtonElement>(`button.technique-list-title[data-technique-run-id="${runId}"]`)
      ?.focus({ preventScroll: true });
    if (deferred) window.requestAnimationFrame(apply);
    else apply();
  };

  const focusEmptyList = (deferred = false) => {
    const apply = () => listRef.current?.focus({ preventScroll: true });
    if (deferred) window.requestAnimationFrame(apply);
    else apply();
  };

  useEffect(() => {
    if (runs.length === 0) {
      if (!addDisabled) focusEmptyList(true);
      return;
    }
    if (treeRows[0]) focusRun(treeRows[0].run.id, true);
  }, []);

  useEffect(() => {
    if (!pickerOpen && !catalogOpen && !selectedRun) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key !== "Escape") return;
      if (catalogOpen) {
        setCatalogOpen(false);
        return;
      }
      if (pickerOpen) {
        const returnRunId = addContext?.afterRunId ?? null;
        setPickerOpen(false);
        setAddContext(null);
        if (returnRunId) focusRun(returnRunId, true);
        else if (runs.length === 0) focusEmptyList(true);
        return;
      }
      const returnRunId = selectedRun?.id ?? null;
      setSelectedRunId(null);
      if (returnRunId) focusRun(returnRunId, true);
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [addContext, catalogOpen, pickerOpen, runs.length, selectedRun]);

  const openSiblingPicker = (run: TechniqueRun) => {
    if (addDisabled) return;
    setAddContext({ parentRunId: run.parentRunId ?? null, afterRunId: run.id });
    setPickerOpen(true);
  };


  useEffect(() => {
    const onOpenCatalog = () => {
      setPickerOpen(false);
      setAddContext(null);
      setSelectedRunId(null);
      setCatalogOpen(true);
      window.dispatchEvent(new CustomEvent("catalyst:navigation-result", {
        detail: { success: true, address: "All methods" },
      }));
    };
    window.addEventListener("catalyst:open-method-catalog", onOpenCatalog);
    return () => window.removeEventListener("catalyst:open-method-catalog", onOpenCatalog);
  }, []);

  useEffect(() => {
    const onAddressNavigation = (event: Event) => {
      const detail = (event as CustomEvent<{ address?: string; target?: "row" | "form" | "step"; step?: number }>).detail;
      const address = String(detail?.address ?? "").trim();
      const target = detail?.target ?? "row";
      const step = detail?.step ?? null;
      if (!/^\d+(?:\.\d+)*$/.test(address)) return;
      const indexes = address.split(".").map((part) => Number(part) - 1);
      const runIds = new Set(runs.map((run) => run.id));
      const children = new Map<string | null, TechniqueRun[]>();
      for (const run of runs) {
        const requestedParent = run.parentRunId ?? null;
        const parentRunId = requestedParent && runIds.has(requestedParent) ? requestedParent : null;
        const siblings = children.get(parentRunId) ?? [];
        siblings.push(run);
        children.set(parentRunId, siblings);
      }
      for (const siblings of children.values()) {
        siblings.sort((left, right) =>
          (left.sequenceIndex ?? Number.MAX_SAFE_INTEGER) - (right.sequenceIndex ?? Number.MAX_SAFE_INTEGER) ||
          left.createdAt.localeCompare(right.createdAt) || left.id.localeCompare(right.id),
        );
      }

      let parentRunId: string | null = null;
      let targetRun: TechniqueRun | null = null;
      const ancestors: string[] = [];
      for (const index of indexes) {
        const target: TechniqueRun | undefined = (children.get(parentRunId) ?? [])[index];
        if (!target) {
          window.dispatchEvent(new CustomEvent("catalyst:navigation-result", { detail: { success: false, address: `M ${address}` } }));
          return;
        }
        if (targetRun) ancestors.push(targetRun.id);
        targetRun = target;
        parentRunId = target.id;
      }
      if (!targetRun) return;
      if (target === "step" && (!step || step < 1 || step > targetRun.definitionSnapshot.steps.length)) {
        window.dispatchEvent(new CustomEvent("catalyst:navigation-result", { detail: { success: false, address: `M ${address} step ${step ?? "?"}` } }));
        return;
      }
      setPickerOpen(false);
      setAddContext(null);
      setCollapsedRunIds((current) => {
        const next = new Set(current);
        for (const ancestorId of ancestors) next.delete(ancestorId);
        return next;
      });
      const targetRunId = targetRun.id;
      if (target === "row") {
        setSelectedRunId(null);
        window.requestAnimationFrame(() => window.requestAnimationFrame(() => focusRun(targetRunId)));
      } else {
        setSelectedRunId(targetRunId);
        window.requestAnimationFrame(() => window.requestAnimationFrame(() => {
          const editor = sectionRef.current?.querySelector<HTMLElement>(`[data-catalyst-method-run-id="${targetRunId}"]`);
          if (target === "step" && step) {
            editor?.querySelector<HTMLTextAreaElement>(`[data-catalyst-method-response-index="${step}"]`)?.focus({ preventScroll: true });
          } else {
            const firstResponse = editor?.querySelector<HTMLTextAreaElement>("[data-catalyst-method-response-index]");
            (firstResponse ?? editor?.querySelector<HTMLInputElement>(".technique-name-field"))?.focus({ preventScroll: true });
          }
        }));
      }
      const suffix = target === "form" ? " form" : target === "step" ? ` step ${step}` : "";
      window.dispatchEvent(new CustomEvent("catalyst:navigation-result", { detail: { success: true, address: `M ${address}${suffix}` } }));
    };
    window.addEventListener("catalyst:navigate-method-address", onAddressNavigation);
    return () => window.removeEventListener("catalyst:navigate-method-address", onAddressNavigation);
  }, [runs]);

  return (
    <section ref={sectionRef} className={`techniques-section technique-workspace-surface ${selectedRun ? "is-editing" : "is-list"}`}>
      {selectedRun ? (
        <div className="technique-focus-shell">
          <header className="technique-focus-header">
            <button
              className="button button-ghost compact-button"
              type="button"
              onClick={() => {
                const returnRunId = selectedRun.id;
                setSelectedRunId(null);
                focusRun(returnRunId, true);
              }}
            >
              <InstrumentGlyph name="back" />
              <span>Back to methods</span>
            </button>
            <strong className="technique-focus-title">{selectedRun.definitionSnapshot.name || "Untitled method"}</strong>
          </header>
          <div className="technique-focus-scroll">
            <TechniqueRunEditor
              run={selectedRun}
              address={selectedRunAddress ? `M ${selectedRunAddress}` : "M"}
              onUpdateRunDefinition={onUpdateRunDefinition}
              onUpdateResponse={onUpdateResponse}
            />
          </div>
        </div>
      ) : (
        <div className="technique-list-shell">
          {/* Full catalog is intentionally hidden from the normal UI; use keyboard/LLM navigation. */}
          <ol
            ref={listRef}
            className="technique-ordered-list"
            aria-label="Methods"
            role="tree"
            tabIndex={runs.length === 0 && !addDisabled ? 0 : undefined}
            aria-keyshortcuts={runs.length === 0 && !addDisabled ? "Enter" : undefined}
            onKeyDown={(event) => {
              if (runs.length !== 0 || addDisabled || event.key !== "Enter") return;
              event.preventDefault();
              setAddContext(null);
              setPickerOpen(true);
            }}
          >
            {treeRows.map(({ run, depth, hasChildren, siblingIndex, siblingCount, outlineNumber }, visibleIndex) => {
              const definition = run.definitionSnapshot;
              const collapsed = collapsedRunIds.has(run.id);
              const firstChild = treeRows.find((candidate) => candidate.run.parentRunId === run.id)?.run ?? null;
              return (
                <li
                  className="technique-tree-row"
                  key={run.id}
                  role="treeitem"
                  aria-level={depth + 1}
                  aria-expanded={hasChildren ? !collapsed : undefined}
                  data-catalyst-address={`M ${outlineNumber}`}
                  style={{ "--technique-indent": `${depth * 20}px` } as CSSProperties}
                >
                  {hasChildren ? (
                    <button
                      className="technique-tree-fold"
                      type="button"
                      onClick={() => setCollapsedRunIds((current) => {
                        const next = new Set(current);
                        if (next.has(run.id)) next.delete(run.id); else next.add(run.id);
                        return next;
                      })}
                      title={collapsed ? "Expand nested methods" : "Collapse nested methods"}
                      aria-label={collapsed ? "Expand nested methods" : "Collapse nested methods"}
                    >
                      <InstrumentGlyph name={collapsed ? "expand" : "collapse"} />
                    </button>
                  ) : <span className="technique-list-fold-spacer" aria-hidden="true" />}

                  <button
                    className="technique-list-title"
                    type="button"
                    data-technique-run-id={run.id}
                    onKeyDown={(event) => {
                      if (event.key === "Home") {
                        event.preventDefault(); if (treeRows[0]) focusRun(treeRows[0].run.id);
                      } else if (event.key === "End") {
                        event.preventDefault(); const last = treeRows[treeRows.length - 1]; if (last) focusRun(last.run.id);
                      } else if (event.key === "Enter") {
                        event.preventDefault(); openSiblingPicker(run);
                      } else if (event.key === "F2") {
                        event.preventDefault(); setSelectedRunId(run.id);
                      } else if (event.key === "Backspace") {
                        event.preventDefault();
                        const fallback = treeRows[visibleIndex + 1]?.run.id ?? treeRows[visibleIndex - 1]?.run.id ?? null;
                        onDeleteRun(run.id);
                        if (fallback) focusRun(fallback, true);
                        else focusEmptyList(true);
                      } else if (event.key === "Tab") {
                        if (event.shiftKey && run.parentRunId) {
                          event.preventDefault();
                          onOutdentRun(run.id);
                          focusRun(run.id, true);
                        } else if (!event.shiftKey && siblingIndex > 0) {
                          event.preventDefault();
                          onIndentRun(run.id);
                          focusRun(run.id, true);
                        }
                      } else if (event.altKey && event.key === "ArrowUp" && siblingIndex > 0) {
                        event.preventDefault(); onMoveRun(run.id, "up"); focusRun(run.id, true);
                      } else if (event.altKey && event.key === "ArrowDown" && siblingIndex < siblingCount - 1) {
                        event.preventDefault(); onMoveRun(run.id, "down"); focusRun(run.id, true);
                      } else if (event.key === "ArrowUp" && visibleIndex > 0) {
                        event.preventDefault(); focusRun(treeRows[visibleIndex - 1].run.id);
                      } else if (event.key === "ArrowDown" && visibleIndex < treeRows.length - 1) {
                        event.preventDefault(); focusRun(treeRows[visibleIndex + 1].run.id);
                      } else if (event.key === "ArrowLeft") {
                        if (hasChildren && !collapsed) {
                          event.preventDefault(); setCollapsedRunIds((current) => new Set(current).add(run.id));
                        } else if (run.parentRunId) { event.preventDefault(); focusRun(run.parentRunId); }
                      } else if (event.key === "ArrowRight") {
                        if (hasChildren && collapsed) {
                          event.preventDefault();
                          setCollapsedRunIds((current) => { const next = new Set(current); next.delete(run.id); return next; });
                        } else if (hasChildren && firstChild) { event.preventDefault(); focusRun(firstChild.id); }
                      }
                    }}
                    aria-keyshortcuts="Enter F2 Backspace Tab Shift+Tab Alt+ArrowUp Alt+ArrowDown"
                    title="Focus method"
                  >
                    <span className="technique-tree-number" aria-hidden="true">{outlineNumber}.</span>
                    <span className="technique-tree-label">{definition.name || "Untitled method"}</span>
                  </button>

                  <button
                    className="icon-button technique-row-edit"
                    type="button"
                    onClick={() => setSelectedRunId(run.id)}
                    title="Edit method"
                    aria-label={`Edit ${definition.name || "untitled method"}`}
                  >
                    <InstrumentGlyph name="rename" />
                  </button>

                </li>
              );
            })}
            {runs.length === 0 && (
              <li className="technique-list-empty">
                <button
                  className="technique-empty-add"
                  type="button"
                  onClick={() => { setAddContext(null); setPickerOpen(true); }}
                  aria-label="Add first method"
                  title="Add first method"
                >
                  <svg className="instrument-glyph" viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor">
                    <path d="M12 5v14M5 12h14" />
                  </svg>
                </button>
              </li>
            )}
          </ol>
        </div>
      )}

      {catalogOpen && (
        <MethodCatalog definitions={definitions} onClose={() => setCatalogOpen(false)} />
      )}

      {pickerOpen && (
        <TechniquePicker
          definitions={definitions}
          onClose={() => {
            const returnRunId = addContext?.afterRunId ?? null;
            setPickerOpen(false);
            setAddContext(null);
            if (returnRunId) focusRun(returnRunId, true);
            else if (runs.length === 0) focusEmptyList(true);
          }}
          onAdd={(definition) => {
            const runId = onAddRun(definition, addContext?.parentRunId ?? null, addContext?.afterRunId ?? null);
            setPickerOpen(false);
            setAddContext(null);
            focusRun(runId, true);
          }}
        />
      )}
    </section>
  );
}
