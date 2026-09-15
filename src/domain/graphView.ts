import type { GraphCamera, GraphPoint, GraphViewState } from "./types";

export const GRAPH_MIN_ZOOM = 0.35;
export const GRAPH_MAX_ZOOM = 1.8;
export const GRAPH_MAX_ABS_COORDINATE = 100_000;

function finiteNumber(value: unknown): value is number {
  return typeof value === "number" && Number.isFinite(value);
}

export function clampGraphZoom(value: number): number {
  if (!Number.isFinite(value)) return 1;
  return Math.max(GRAPH_MIN_ZOOM, Math.min(GRAPH_MAX_ZOOM, value));
}

export function sanitizeGraphPoint(value: unknown): GraphPoint | null {
  if (!value || typeof value !== "object") return null;
  const point = value as Partial<GraphPoint>;
  if (!finiteNumber(point.x) || !finiteNumber(point.y)) return null;
  if (
    Math.abs(point.x) > GRAPH_MAX_ABS_COORDINATE ||
    Math.abs(point.y) > GRAPH_MAX_ABS_COORDINATE
  ) return null;
  return { x: point.x, y: point.y };
}

export function sanitizeGraphCamera(value: unknown): GraphCamera {
  const camera = value && typeof value === "object"
    ? value as Partial<GraphCamera>
    : {};

  const x = finiteNumber(camera.x) && Math.abs(camera.x) <= GRAPH_MAX_ABS_COORDINATE
    ? camera.x
    : 0;
  const y = finiteNumber(camera.y) && Math.abs(camera.y) <= GRAPH_MAX_ABS_COORDINATE
    ? camera.y
    : 0;
  const zoom = finiteNumber(camera.zoom) ? clampGraphZoom(camera.zoom) : 1;

  return { x, y, zoom };
}

export function sanitizeGraphView(value: unknown): GraphViewState {
  if (!value || typeof value !== "object") {
    return { positions: {}, camera: sanitizeGraphCamera(null) };
  }

  const view = value as Partial<GraphViewState>;
  const positions: Record<string, GraphPoint> = {};
  if (view.positions && typeof view.positions === "object") {
    for (const [noteId, candidate] of Object.entries(view.positions)) {
      const point = sanitizeGraphPoint(candidate);
      if (point) positions[noteId] = point;
    }
  }

  return {
    positions,
    camera: sanitizeGraphCamera(view.camera),
  };
}
