import { useEffect, useMemo, useRef, useState } from "react";
import { RELATIONSHIP_TYPE_LABELS } from "../../domain/analysis";
import type { WorkspaceState } from "../../domain/types";
import { InstrumentGlyph } from "../../ui/CatalystSymbols";
import {
  buildRelationalLayout,
  RELATIONAL_NODE_HEIGHT,
  RELATIONAL_NODE_WIDTH,
  type RelationshipBranch,
} from "./relationalModel";

function relationshipPath(branch: RelationshipBranch): string {
  const dx = branch.toX - branch.fromX;
  const dy = branch.toY - branch.fromY;
  const length = Math.max(1, Math.hypot(dx, dy));
  const normalX = -dy / length;
  const normalY = dx / length;
  const controlX = (branch.fromX + branch.toX) / 2 + normalX * branch.bend;
  const controlY = (branch.fromY + branch.toY) / 2 + normalY * branch.bend;
  return `M ${branch.fromX} ${branch.fromY} Q ${controlX} ${controlY} ${branch.toX} ${branch.toY}`;
}

export function RelationalView({
  state,
  onSelectNote,
  onOpenOutline,
  onOpenMethod,
  onClose,
}: {
  state: WorkspaceState;
  onSelectNote: (noteId: string) => void;
  onOpenOutline: (noteId: string) => void;
  onOpenMethod: (address: string) => void;
  onClose: () => void;
}) {
  const layout = useMemo(() => buildRelationalLayout(state), [state]);
  const viewportRef = useRef<HTMLDivElement>(null);
  const [viewportSize, setViewportSize] = useState({ width: 0, height: 0 });

  useEffect(() => {
    const element = viewportRef.current;
    if (!element) return;
    const update = () => setViewportSize({ width: element.clientWidth, height: element.clientHeight });
    update();
    const observer = new ResizeObserver(update);
    observer.observe(element);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key !== "Escape") return;
      event.preventDefault();
      event.stopImmediatePropagation();
      onClose();
    };
    window.addEventListener("keydown", closeOnEscape, true);
    return () => window.removeEventListener("keydown", closeOnEscape, true);
  }, [onClose]);

  const availableWidth = Math.max(viewportSize.width - 32, 1);
  const availableHeight = Math.max(viewportSize.height - 32, 1);
  const fitScale = viewportSize.width > 0 && viewportSize.height > 0
    ? Math.min(1, Math.max(0.28, Math.min(availableWidth / layout.width, availableHeight / layout.height)))
    : 1;
  const offsetX = viewportSize.width > 0 ? (viewportSize.width - layout.width * fitScale) / 2 : 0;
  const offsetY = viewportSize.height > 0 ? (viewportSize.height - layout.height * fitScale) / 2 : 0;
  const title = state.analysisRoot.title.trim() || "Title";
  const usedRelationshipTypes = [...new Set(layout.relationshipBranches.map((branch) => branch.type))];

  return (
    <div
      id="catalyst-relational-view"
      className="working-picture-workspace view-map relational-view-workspace"
      data-outline-projection="relational"
      role="region"
      aria-label="Relational view"
    >
      <header className="relational-view-header">
        <div className="relational-view-heading">
          <h1>{title}</h1>
        </div>
        <button
          type="button"
          className="picture-icon-button relational-view-close"
          onClick={onClose}
          title="Close (Esc)"
          aria-label="Close"
        >
          <InstrumentGlyph name="close" />
        </button>
      </header>

      <div
        ref={viewportRef}
        className="working-picture-viewport relational-view-viewport"
        tabIndex={0}
        aria-label="Read-only relational view"
      >
        {usedRelationshipTypes.length > 0 && (
          <div className="relational-view-legend" aria-label="Relationship color legend">
            {usedRelationshipTypes.map((type) => (
              <span key={type} className="relational-view-legend-item">
                <i className={`relational-line-swatch relation-${type}`} aria-hidden="true" />
                {RELATIONSHIP_TYPE_LABELS[type]}
              </span>
            ))}
          </div>
        )}
        <div
          className="working-picture-stage relational-view-stage"
          style={{
            width: layout.width,
            height: layout.height,
            transform: `translate(${offsetX}px, ${offsetY}px) scale(${fitScale})`,
          }}
        >
          <svg
            className="working-picture-lines"
            width={layout.width}
            height={layout.height}
            viewBox={`0 0 ${layout.width} ${layout.height}`}
            aria-hidden="true"
          >
            {layout.relationshipBranches.map((branch) => (
              <path
                key={branch.id}
                d={relationshipPath(branch)}
                className={`relational-relationship-branch relation-${branch.type}`}
              >
                <title>{`${branch.fromTitle} — ${RELATIONSHIP_TYPE_LABELS[branch.type]} — ${branch.toTitle}`}</title>
              </path>
            ))}
          </svg>

          {layout.nodes.map((node) => {
            const active = node.kind === "outline" && state.activeNoteId === node.entityId;
            const addressLabel = `${node.kind === "method" ? "M" : "O"} ${node.address}`;
            const destinationLabel = node.kind === "method" ? "Methods" : "Outline";
            return (
              <div
                key={node.key}
                className={`relational-view-node${active ? " is-active" : ""}`}
                data-relational-node-kind={node.kind}
                style={{
                  left: node.x,
                  top: node.y,
                  width: RELATIONAL_NODE_WIDTH,
                  height: RELATIONAL_NODE_HEIGHT,
                }}
              >
                <button
                  type="button"
                  className="relational-view-node-button"
                  onClick={() => {
                    if (node.kind === "outline") onSelectNote(node.entityId);
                  }}
                  onDoubleClick={(event) => {
                    event.stopPropagation();
                    if (node.kind === "method") onOpenMethod(node.address);
                    else onOpenOutline(node.entityId);
                  }}
                  title={`${addressLabel} · ${node.title}\nDouble-click to open in ${destinationLabel}`}
                  aria-pressed={node.kind === "outline" ? active : undefined}
                >
                  <span className="relational-view-number">{addressLabel}</span>
                  <span className="relational-view-label">{node.title}</span>
                </button>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
