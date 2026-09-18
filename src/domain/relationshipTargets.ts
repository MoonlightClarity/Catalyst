import { outlineItemsForParent } from "./outline";
import type { TechniqueRun, WorkspaceState } from "./types";

export type RelationshipTargetKind = "outline" | "method";

export type WorkspaceRelationshipTarget = {
  id: string;
  kind: RelationshipTargetKind;
  address: string;
  title: string;
};

export function outlineRelationshipTargets(state: WorkspaceState): WorkspaceRelationshipTarget[] {
  const seen = new Set<string>();
  const targets: WorkspaceRelationshipTarget[] = [];

  const visit = (parentItemId: string, numberPath: number[]) => {
    const children = outlineItemsForParent(state.outline, parentItemId)
      .filter((item) => item.kind === "reference");
    children.forEach((child, siblingIndex) => {
      const path = [...numberPath, siblingIndex + 1];
      const note = state.notes[child.itemId];
      if (note && !seen.has(note.id)) {
        seen.add(note.id);
        targets.push({
          id: note.id,
          kind: "outline",
          address: path.join("."),
          title: note.title.trim() || "Untitled note",
        });
      }
      visit(child.id, path);
    });
  };

  visit(state.outline.rootItemId, []);
  return targets;
}

export function methodRelationshipTargets(state: WorkspaceState): WorkspaceRelationshipTarget[] {
  const runIds = new Set(Object.keys(state.techniqueRuns));
  const children = new Map<string | null, TechniqueRun[]>();

  for (const run of Object.values(state.techniqueRuns)) {
    const requestedParentId = run.parentRunId ?? null;
    const parentRunId = requestedParentId && runIds.has(requestedParentId)
      ? requestedParentId
      : null;
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

  const targets: WorkspaceRelationshipTarget[] = [];
  const visit = (parentRunId: string | null, numberPath: number[]) => {
    const siblings = children.get(parentRunId) ?? [];
    siblings.forEach((run, siblingIndex) => {
      const path = [...numberPath, siblingIndex + 1];
      targets.push({
        id: run.id,
        kind: "method",
        address: path.join("."),
        title: run.definitionSnapshot.name.trim() || "Untitled method",
      });
      visit(run.id, path);
    });
  };

  visit(null, []);
  return targets;
}

export function allRelationshipTargets(state: WorkspaceState): WorkspaceRelationshipTarget[] {
  return [...outlineRelationshipTargets(state), ...methodRelationshipTargets(state)];
}

export function relationshipTargetLabel(target: WorkspaceRelationshipTarget): string {
  const prefix = target.kind === "method" ? "M" : "O";
  return `${prefix} ${target.address}. ${target.title}`;
}
