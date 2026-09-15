import assert from "node:assert/strict";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { createRequire } from "node:module";
import { catalystTestCompilerOptions } from "./test-compiler.mjs";

const nodeRequire = createRequire(import.meta.url);
const ts = nodeRequire("@typescript/typescript6");
const root = process.cwd();
const outDir = fs.mkdtempSync(path.join(os.tmpdir(), "catalyst-graph-"));

try {
  const program = ts.createProgram({
    rootNames: [
      path.join(root, "src/domain/types.ts"),
      path.join(root, "src/domain/graphView.ts"),
      path.join(root, "src/graph/layout.ts"),
    ],
    options: catalystTestCompilerOptions(ts, outDir),
  });

  const emit = program.emit();
  const diagnostics = ts
    .getPreEmitDiagnostics(program)
    .concat(emit.diagnostics)
    .filter((item) => item.category === ts.DiagnosticCategory.Error);

  assert.equal(
    diagnostics.length,
    0,
    diagnostics.map((d) => ts.flattenDiagnosticMessageText(d.messageText, "\n")).join("\n"),
  );

  const graph = nodeRequire(path.join(outDir, "graph", "layout.js"));
  const graphView = nodeRequire(path.join(outDir, "domain", "graphView.js"));
  const now = "2026-01-01T00:00:00.000Z";
  const note = (id, offset) => ({
    id,
    title: id,
    body: "",
    createdAt: `2026-01-0${offset}T00:00:00.000Z`,
    updatedAt: now,
    });

  const state = {
    notes: { a: note("a", 1), b: note("b", 2), c: note("c", 3), d: note("d", 4) },
    noteLinks: [
      { fromNoteId: "a", toNoteId: "b", createdAt: now },
      { fromNoteId: "b", toNoteId: "a", createdAt: "2026-01-02T00:00:00.000Z" },
      { fromNoteId: "b", toNoteId: "c", createdAt: "2026-01-03T00:00:00.000Z" },
    ],
    graphView: { positions: {}, camera: { x: 0, y: 0, zoom: 1 } },
  };

  const edges = graph.conceptualGraphEdges(state.notes, state.noteLinks);
  assert.equal(edges.length, 2, "reverse note-link rows must project to one conceptual graph edge");

  const first = graph.graphLayout(state);
  const second = graph.graphLayout(state);
  assert.deepEqual(first, second, "automatic graph layout must be deterministic");
  assert.equal(first.nodes.length, 4);
  assert.ok(first.nodes.every((node) => Number.isFinite(node.position.x) && Number.isFinite(node.position.y)));

  const pinned = graph.graphLayout({
    ...state,
    graphView: { ...state.graphView, positions: { c: { x: 1200, y: 900 } } },
  });
  assert.deepEqual(pinned.nodes.find((node) => node.note.id === "c").position, { x: 1200, y: 900 });

  const degrees = graph.graphDegreeMap(state.notes, state.noteLinks);
  assert.deepEqual(degrees, { a: 1, b: 2, c: 1, d: 0 });

  assert.deepEqual(
    graphView.sanitizeGraphView({
      positions: {
        a: { x: 420, y: 240 },
        broken: { x: Number.NaN, y: 1 },
        absurd: { x: 999999999, y: 0 },
      },
      camera: { x: 20, y: -30, zoom: 9 },
    }),
    {
      positions: { a: { x: 420, y: 240 } },
      camera: { x: 20, y: -30, zoom: 1.8 },
    },
    "persisted graph view state must be sanitized before entering the workspace",
  );
  assert.deepEqual(
    graphView.sanitizeGraphView({ camera: { x: "bad", y: Infinity, zoom: 0 } }),
    { positions: {}, camera: { x: 0, y: 0, zoom: 0.35 } },
  );

  console.log("Catalyst graph layout/view-state tests passed.");
} finally {
  fs.rmSync(outDir, { recursive: true, force: true });
}
