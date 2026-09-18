import assert from "node:assert/strict";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { createRequire } from "node:module";
import { catalystTestCompilerOptions } from "./test-compiler.mjs";

const nodeRequire = createRequire(import.meta.url);
const ts = nodeRequire("@typescript/typescript6");
const root = process.cwd();
const outDir = fs.mkdtempSync(path.join(os.tmpdir(), "catalyst-relational-view-"));

try {
  const options = catalystTestCompilerOptions(ts, outDir);
  const program = ts.createProgram({
    rootNames: [
      path.join(root, "src/domain/types.ts"),
      path.join(root, "src/domain/outline.ts"),
      path.join(root, "src/domain/workspace.ts"),
      path.join(root, "src/features/analysis/relationalModel.ts"),
    ],
    options,
  });
  const emit = program.emit();
  const diagnostics = ts.getPreEmitDiagnostics(program)
    .concat(emit.diagnostics)
    .filter((item) => item.category === ts.DiagnosticCategory.Error);
  assert.equal(
    diagnostics.length,
    0,
    diagnostics.map((item) => ts.flattenDiagnosticMessageText(item.messageText, "\n")).join("\n"),
  );

  const workspace = nodeRequire(path.join(outDir, "domain", "workspace.js"));
  const outline = nodeRequire(path.join(outDir, "domain", "outline.js"));
  const relational = nodeRequire(path.join(outDir, "features", "analysis", "relationalModel.js"));

  let state = workspace.initialWorkspaceState;
  const notes = ["Alpha", "Bravo", "Charlie", "Delta"].map((title) => workspace.newNote({ title }));
  for (const note of notes) {
    state = workspace.workspaceReducer(state, { type: "note/created", note });
    state = workspace.workspaceReducer(state, {
      type: "outline/reference-created",
      placement: outline.newOutlineReference(state.outline, note.id),
    });
  }

  const relationSpecs = [
    [notes[0].id, notes[1].id, "supports"],
    [notes[0].id, notes[2].id, "contradicts"],
    [notes[3].id, notes[1].id, "depends-on"],
  ];
  for (const [fromId, toId, type] of relationSpecs) {
    state = workspace.workspaceReducer(state, {
      type: "relationship/created",
      relationship: workspace.newRelationship(fromId, toId, type),
    });
  }

  let layout = relational.buildRelationalLayout(state);
  assert.equal(layout.nodes.length, 4, "all outline concepts must appear in the graph");
  assert.equal(layout.relationshipBranches.length, 3, "multiple outline relationships must render independently");
  assert.ok(new Set(layout.nodes.map((node) => node.x)).size > 1, "multi-item layout must use more than one x position");
  assert.ok(new Set(layout.nodes.map((node) => node.y)).size > 1, "multi-item layout must use more than one y position");

  const now = "2026-09-17T19:14:00.000Z";
  const methodRun = (id, name, sequenceIndex) => ({
    id,
    parentRunId: null,
    sequenceIndex,
    definitionId: `${id}-definition`,
    definitionVersion: 1,
    definitionSnapshot: {
      id: `${id}-definition`,
      name,
      summary: "",
      category: "other",
      builtIn: false,
      version: 1,
      steps: [],
      createdAt: now,
      updatedAt: now,
    },
    responses: {},
    createdAt: now,
    updatedAt: now,
  });
  const methodA = methodRun("method-a", "Method A", 0);
  const methodB = methodRun("method-b", "Method B", 1);
  state = workspace.workspaceReducer(state, { type: "technique-run/created", run: methodA });
  state = workspace.workspaceReducer(state, { type: "technique-run/created", run: methodB });
  state = workspace.workspaceReducer(state, {
    type: "method-relationship/created",
    relationship: workspace.newRelationship(methodA.id, methodB.id, "precedes"),
  });
  state = workspace.workspaceReducer(state, {
    type: "cross-relationship/created",
    relationship: workspace.newRelationship(notes[0].id, methodA.id, "about"),
  });

  layout = relational.buildRelationalLayout(state);
  assert.equal(layout.nodes.length, 6, "methods must share the graph with outline concepts");
  assert.equal(layout.nodes.filter((node) => node.kind === "method").length, 2, "method nodes must be identifiable");
  assert.deepEqual(
    layout.nodes.filter((node) => node.kind === "method").map((node) => node.address),
    ["1", "2"],
    "method nodes must retain stable Methods addresses",
  );
  assert.equal(layout.relationshipBranches.length, 5, "cross-surface and method relationships must render with outline relationships");

  const duplicatePlacement = outline.newOutlineReference(
    state.outline,
    notes[0].id,
    state.outline.rootItemId,
    "duplicate-alpha-placement",
  );
  state = workspace.workspaceReducer(state, { type: "outline/reference-created", placement: duplicatePlacement });
  layout = relational.buildRelationalLayout(state);
  assert.equal(layout.nodes.length, 6, "a concept placed twice in Outline must remain one graph node while methods remain present");
  assert.equal(layout.relationshipBranches.length, 5, "duplicate outline placement must not drop or duplicate any relationship scope");

  console.log("Catalyst relational view multi-item tests passed.");
} finally {
  fs.rmSync(outDir, { recursive: true, force: true });
}
