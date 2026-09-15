import type {
  GraphPoint,
  Note,
  NoteLink,
  Relationship,
  WorkspaceState,
} from "../domain/types";

export type GraphEdge = {
  id: string;
  fromNoteId: string;
  toNoteId: string;
  createdAt: string;
  relationshipType: Relationship["type"];
  directed: boolean;
  label: string | null;
};

export type GraphNodeLayout = {
  note: Note;
  position: GraphPoint;
  degree: number;
  componentIndex: number;
};

export type GraphLayout = {
  nodes: GraphNodeLayout[];
  edges: GraphEdge[];
  width: number;
  height: number;
};

const COMPONENT_WIDTH = 820;
const COMPONENT_HEIGHT = 620;
const COMPONENT_COLUMNS = 3;
const ORIGIN_X = 430;
const ORIGIN_Y = 340;
const RING_STEP = 220;
const MIN_WIDTH = 1800;
const MIN_HEIGHT = 1200;

function noteOrder(left: Note, right: Note): number {
  return left.createdAt.localeCompare(right.createdAt) || left.id.localeCompare(right.id);
}

function canonicalPair(left: string, right: string): [string, string] {
  return left < right ? [left, right] : [right, left];
}

export function conceptualGraphEdges(
  notes: Record<string, Note>,
  links: NoteLink[],
): GraphEdge[] {
  const edges = new Map<string, GraphEdge>();

  for (const link of links) {
    if (link.fromNoteId === link.toNoteId) continue;
    const from = notes[link.fromNoteId];
    const to = notes[link.toNoteId];
    if (!from || !to) continue;

    const [first, second] = canonicalPair(link.fromNoteId, link.toNoteId);
    const id = `${first}\u0000${second}`;
    const existing = edges.get(id);
    if (!existing || link.createdAt < existing.createdAt) {
      edges.set(id, {
        id,
        fromNoteId: first,
        toNoteId: second,
        createdAt: link.createdAt,
        relationshipType: "related-to",
        directed: false,
        label: null,
      });
    }
  }

  return [...edges.values()].sort(
    (left, right) =>
      left.createdAt.localeCompare(right.createdAt) || left.id.localeCompare(right.id),
  );
}

export function relationshipGraphEdges(
  notes: Record<string, Note>,
  relationships: Record<string, Relationship>,
): GraphEdge[] {
  return Object.values(relationships)
    .filter((relationship) => {
      if (relationship.fromId === relationship.toId) return false;
      const from = notes[relationship.fromId];
      const to = notes[relationship.toId];
      return Boolean(from && to);
    })
    .map((relationship) => ({
      id: relationship.id,
      fromNoteId: relationship.fromId,
      toNoteId: relationship.toId,
      createdAt: relationship.createdAt,
      relationshipType: relationship.type,
      directed: relationship.directed,
      label: relationship.label,
    }))
    .sort(
      (left, right) =>
        left.createdAt.localeCompare(right.createdAt) ||
        left.id.localeCompare(right.id),
    );
}

function buildAdjacency(notes: Note[], edges: GraphEdge[]): Map<string, Set<string>> {
  const adjacency = new Map(notes.map((note) => [note.id, new Set<string>()]));
  for (const edge of edges) {
    adjacency.get(edge.fromNoteId)?.add(edge.toNoteId);
    adjacency.get(edge.toNoteId)?.add(edge.fromNoteId);
  }
  return adjacency;
}

function connectedComponents(
  notes: Note[],
  adjacency: Map<string, Set<string>>,
): Note[][] {
  const noteById = new Map(notes.map((note) => [note.id, note]));
  const remaining = new Set(notes.map((note) => note.id));
  const components: Note[][] = [];

  for (const candidate of notes) {
    if (!remaining.has(candidate.id)) continue;
    const stack = [candidate.id];
    const component: Note[] = [];
    remaining.delete(candidate.id);

    while (stack.length > 0) {
      const id = stack.pop()!;
      const note = noteById.get(id);
      if (!note) continue;
      component.push(note);

      const neighbors = [...(adjacency.get(id) ?? [])].sort();
      for (const neighbor of neighbors) {
        if (!remaining.has(neighbor)) continue;
        remaining.delete(neighbor);
        stack.push(neighbor);
      }
    }

    components.push(component.sort(noteOrder));
  }

  return components.sort(
    (left, right) =>
      right.length - left.length || noteOrder(left[0], right[0]),
  );
}

function componentRoot(
  component: Note[],
  adjacency: Map<string, Set<string>>,
): Note {
  return [...component].sort((left, right) => {
    const degreeDiff =
      (adjacency.get(right.id)?.size ?? 0) - (adjacency.get(left.id)?.size ?? 0);
    return degreeDiff || noteOrder(left, right);
  })[0];
}

function placeComponent(
  component: Note[],
  adjacency: Map<string, Set<string>>,
  center: GraphPoint,
): Map<string, GraphPoint> {
  const result = new Map<string, GraphPoint>();
  const root = componentRoot(component, adjacency);
  result.set(root.id, center);

  if (component.length === 1) return result;

  const noteById = new Map(component.map((note) => [note.id, note]));
  const visited = new Set([root.id]);
  let frontier = [root.id];
  let depth = 1;

  while (frontier.length > 0) {
    const next: string[] = [];
    const levelIds: string[] = [];

    for (const id of frontier) {
      const neighbors = [...(adjacency.get(id) ?? [])]
        .filter((neighbor) => noteById.has(neighbor) && !visited.has(neighbor))
        .sort((left, right) => noteOrder(noteById.get(left)!, noteById.get(right)!));
      for (const neighbor of neighbors) {
        visited.add(neighbor);
        next.push(neighbor);
        levelIds.push(neighbor);
      }
    }

    if (levelIds.length > 0) {
      const radius = RING_STEP * depth;
      const angleOffset = depth % 2 === 0 ? Math.PI / Math.max(levelIds.length, 2) : 0;
      levelIds.forEach((id, index) => {
        const angle = angleOffset + (Math.PI * 2 * index) / levelIds.length - Math.PI / 2;
        result.set(id, {
          x: center.x + Math.cos(angle) * radius,
          y: center.y + Math.sin(angle) * radius,
        });
      });
    }

    frontier = next;
    depth += 1;
  }

  const unvisited = component.filter((note) => !visited.has(note.id));
  unvisited.forEach((note, index) => {
    const angle = (Math.PI * 2 * index) / Math.max(unvisited.length, 1);
    result.set(note.id, {
      x: center.x + Math.cos(angle) * RING_STEP,
      y: center.y + Math.sin(angle) * RING_STEP,
    });
  });

  return result;
}

export function graphLayout(
  state: Pick<WorkspaceState, "notes" | "noteLinks" | "graphView"> & {
    relationships?: Record<string, Relationship>;
  },
): GraphLayout {
  const notes = Object.values(state.notes)
    .sort(noteOrder);
  const edges =
    state.relationships && Object.keys(state.relationships).length > 0
      ? relationshipGraphEdges(state.notes, state.relationships)
      : conceptualGraphEdges(state.notes, state.noteLinks);
  const adjacency = buildAdjacency(notes, edges);
  const components = connectedComponents(notes, adjacency);
  const positions = new Map<string, GraphPoint>();

  components.forEach((component, index) => {
    const column = index % COMPONENT_COLUMNS;
    const row = Math.floor(index / COMPONENT_COLUMNS);
    const center = {
      x: ORIGIN_X + column * COMPONENT_WIDTH,
      y: ORIGIN_Y + row * COMPONENT_HEIGHT,
    };
    const componentPositions = placeComponent(
      component,
      adjacency,
      center,
    );
    for (const [id, position] of componentPositions) positions.set(id, position);
  });

  const nodes = notes.map((note, index): GraphNodeLayout => {
    const generated = positions.get(note.id) ?? {
      x: ORIGIN_X + (index % COMPONENT_COLUMNS) * COMPONENT_WIDTH,
      y: ORIGIN_Y + Math.floor(index / COMPONENT_COLUMNS) * COMPONENT_HEIGHT,
    };
    return {
      note,
      position: state.graphView.positions[note.id] ?? generated,
      degree: adjacency.get(note.id)?.size ?? 0,
      componentIndex: components.findIndex((component) =>
        component.some((item) => item.id === note.id),
      ),
    };
  });

  const maxX = nodes.reduce((max, node) => Math.max(max, node.position.x), 0);
  const maxY = nodes.reduce((max, node) => Math.max(max, node.position.y), 0);

  return {
    nodes,
    edges,
    width: Math.max(MIN_WIDTH, maxX + 520),
    height: Math.max(MIN_HEIGHT, maxY + 420),
  };
}

export function graphDegreeMap(
  notes: Record<string, Note>,
  links: NoteLink[],
): Record<string, number> {
  const degree: Record<string, number> = {};
  for (const note of Object.values(notes)) {
    degree[note.id] = 0;
  }
  for (const edge of conceptualGraphEdges(notes, links)) {
    degree[edge.fromNoteId] = (degree[edge.fromNoteId] ?? 0) + 1;
    degree[edge.toNoteId] = (degree[edge.toNoteId] ?? 0) + 1;
  }
  return degree;
}

export function relationshipDegreeMap(
  notes: Record<string, Note>,
  relationships: Record<string, Relationship>,
): Record<string, number> {
  const degree: Record<string, number> = {};
  for (const note of Object.values(notes)) {
    degree[note.id] = 0;
  }
  for (const edge of relationshipGraphEdges(notes, relationships)) {
    degree[edge.fromNoteId] = (degree[edge.fromNoteId] ?? 0) + 1;
    degree[edge.toNoteId] = (degree[edge.toNoteId] ?? 0) + 1;
  }
  return degree;
}
