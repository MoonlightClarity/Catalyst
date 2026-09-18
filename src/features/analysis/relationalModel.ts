import type { OutlineReferenceItem, Relationship, RelationshipType, TechniqueRun, WorkspaceState } from "../../domain/types";

export type RelationalNodeKind = "outline" | "method";

export type RelationalNode = {
  key: string;
  kind: RelationalNodeKind;
  entityId: string;
  address: string;
  x: number;
  y: number;
  title: string;
};

export type RelationshipBranch = {
  id: string;
  type: RelationshipType;
  fromTitle: string;
  toTitle: string;
  fromX: number;
  fromY: number;
  toX: number;
  toY: number;
  bend: number;
};

export type RelationalLayout = {
  nodes: RelationalNode[];
  relationshipBranches: RelationshipBranch[];
  width: number;
  height: number;
};

export const RELATIONAL_NODE_WIDTH = 300;
export const RELATIONAL_NODE_HEIGHT = 54;
const HORIZONTAL_STEP = 410;
const VERTICAL_STEP = 150;
const PADDING_X = 90;
const PADDING_Y = 92;
const MIN_WIDTH = 1100;
const MIN_HEIGHT = 640;

function referenceChildren(state: WorkspaceState, parentItemId: string) {
  return Object.values(state.outline.items)
    .filter((item): item is OutlineReferenceItem => item.kind === "reference" && item.parentItemId === parentItemId)
    .sort((left, right) => left.siblingOrder - right.siblingOrder || left.id.localeCompare(right.id));
}

function methodChildren(state: WorkspaceState, parentRunId: string | null): TechniqueRun[] {
  return Object.values(state.techniqueRuns)
    .filter((run) => {
      const requestedParentId = run.parentRunId ?? null;
      const resolvedParentId = requestedParentId && state.techniqueRuns[requestedParentId]
        ? requestedParentId
        : null;
      return resolvedParentId === parentRunId;
    })
    .sort((left, right) =>
      (left.sequenceIndex ?? Number.MAX_SAFE_INTEGER) -
        (right.sequenceIndex ?? Number.MAX_SAFE_INTEGER) ||
      left.createdAt.localeCompare(right.createdAt) ||
      left.id.localeCompare(right.id),
    );
}

function edgeAnchor(
  node: RelationalNode,
  towardX: number,
  towardY: number,
): { x: number; y: number } {
  const centerX = node.x + RELATIONAL_NODE_WIDTH / 2;
  const centerY = node.y + RELATIONAL_NODE_HEIGHT / 2;
  const dx = towardX - centerX;
  const dy = towardY - centerY;
  if (dx === 0 && dy === 0) return { x: centerX, y: centerY };

  const xScale = dx === 0 ? Number.POSITIVE_INFINITY : (RELATIONAL_NODE_WIDTH / 2) / Math.abs(dx);
  const yScale = dy === 0 ? Number.POSITIVE_INFINITY : (RELATIONAL_NODE_HEIGHT / 2) / Math.abs(dy);
  const scale = Math.min(xScale, yScale);
  return {
    x: centerX + dx * scale,
    y: centerY + dy * scale,
  };
}

function branchForRelationship(
  relationship: Relationship,
  nodeByEntityId: Map<string, RelationalNode>,
  index: number,
  scope: RelationalNodeKind | "cross",
): RelationshipBranch[] {
  const from = nodeByEntityId.get(relationship.fromId);
  const to = nodeByEntityId.get(relationship.toId);
  if (!from || !to || from.entityId === to.entityId) return [];

  const fromCenterX = from.x + RELATIONAL_NODE_WIDTH / 2;
  const fromCenterY = from.y + RELATIONAL_NODE_HEIGHT / 2;
  const toCenterX = to.x + RELATIONAL_NODE_WIDTH / 2;
  const toCenterY = to.y + RELATIONAL_NODE_HEIGHT / 2;
  const fromAnchor = edgeAnchor(from, toCenterX, toCenterY);
  const toAnchor = edgeAnchor(to, fromCenterX, fromCenterY);
  const distance = Math.hypot(toAnchor.x - fromAnchor.x, toAnchor.y - fromAnchor.y);
  const magnitude = Math.max(28, Math.min(86, distance * 0.14));
  const bend = (index % 2 === 0 ? 1 : -1) * magnitude;

  return [{
    id: `${scope}:${relationship.id}`,
    type: relationship.type,
    fromTitle: from.title,
    toTitle: to.title,
    fromX: fromAnchor.x,
    fromY: fromAnchor.y,
    toX: toAnchor.x,
    toY: toAnchor.y,
    bend,
  }];
}

/**
 * The graph is intentionally independent of Outline or Methods hierarchy.
 * Hierarchy supplies only stable addresses/order; x/y placement remains neutral.
 */
export function buildRelationalLayout(state: WorkspaceState): RelationalLayout {
  const concepts: Array<Omit<RelationalNode, "x" | "y">> = [];
  const seenNoteIds = new Set<string>();

  const visitOutline = (parentItemId: string, numberPath: number[]) => {
    const children = referenceChildren(state, parentItemId);
    children.forEach((placement, siblingIndex) => {
      const path = [...numberPath, siblingIndex + 1];
      const note = state.notes[placement.itemId];
      if (note && !seenNoteIds.has(placement.itemId)) {
        seenNoteIds.add(placement.itemId);
        concepts.push({
          key: `outline:${placement.itemId}`,
          kind: "outline",
          entityId: placement.itemId,
          address: path.join("."),
          title: note.title.trim() || "Untitled note",
        });
      }
      visitOutline(placement.id, path);
    });
  };

  const visitMethods = (parentRunId: string | null, numberPath: number[]) => {
    const children = methodChildren(state, parentRunId);
    children.forEach((run, siblingIndex) => {
      const path = [...numberPath, siblingIndex + 1];
      concepts.push({
        key: `method:${run.id}`,
        kind: "method",
        entityId: run.id,
        address: path.join("."),
        title: run.definitionSnapshot.name.trim() || "Untitled method",
      });
      visitMethods(run.id, path);
    });
  };

  visitOutline(state.outline.rootItemId, []);
  visitMethods(null, []);

  const count = concepts.length;
  const columns = count <= 1 ? 1 : Math.max(2, Math.ceil(Math.sqrt(count * 1.4)));
  const rowCount = Math.max(1, Math.ceil(count / columns));
  const nodes: RelationalNode[] = concepts.map((concept, index) => {
    const row = Math.floor(index / columns);
    const column = index % columns;
    const itemsInRow = Math.min(columns, count - row * columns);
    const rowOffset = ((columns - itemsInRow) * HORIZONTAL_STEP) / 2;
    return {
      ...concept,
      x: PADDING_X + rowOffset + column * HORIZONTAL_STEP,
      y: PADDING_Y + row * VERTICAL_STEP,
    };
  });

  const outlineNodeById = new Map(
    nodes.filter((node) => node.kind === "outline").map((node) => [node.entityId, node]),
  );
  const methodNodeById = new Map(
    nodes.filter((node) => node.kind === "method").map((node) => [node.entityId, node]),
  );
  const allNodeById = new Map(nodes.map((node) => [node.entityId, node]));

  const relationshipBranches = [
    ...Object.values(state.relationships)
      .sort((left, right) => left.createdAt.localeCompare(right.createdAt) || left.id.localeCompare(right.id))
      .flatMap((relationship, index) => branchForRelationship(relationship, outlineNodeById, index, "outline")),
    ...Object.values(state.methodRelationships ?? {})
      .sort((left, right) => left.createdAt.localeCompare(right.createdAt) || left.id.localeCompare(right.id))
      .flatMap((relationship, index) => branchForRelationship(relationship, methodNodeById, index, "method")),
    ...Object.values(state.crossRelationships ?? {})
      .sort((left, right) => left.createdAt.localeCompare(right.createdAt) || left.id.localeCompare(right.id))
      .flatMap((relationship, index) => branchForRelationship(relationship, allNodeById, index, "cross")),
  ];

  return {
    nodes,
    relationshipBranches,
    width: Math.max(MIN_WIDTH, PADDING_X * 2 + Math.max(columns - 1, 0) * HORIZONTAL_STEP + RELATIONAL_NODE_WIDTH),
    height: Math.max(MIN_HEIGHT, PADDING_Y * 2 + Math.max(rowCount - 1, 0) * VERTICAL_STEP + RELATIONAL_NODE_HEIGHT),
  };
}
