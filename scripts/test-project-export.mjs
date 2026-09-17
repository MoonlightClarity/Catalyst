import assert from "node:assert/strict";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { createRequire } from "node:module";
import { catalystTestCompilerOptions } from "./test-compiler.mjs";

const nodeRequire = createRequire(import.meta.url);
const ts = nodeRequire("@typescript/typescript6");
const root = process.cwd();
const outDir = fs.mkdtempSync(path.join(os.tmpdir(), "catalyst-project-export-"));

try {
  const program = ts.createProgram({
    rootNames: [path.join(root, "src/platform/projectExport.ts")],
    options: catalystTestCompilerOptions(ts, outDir),
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

  const { buildProjectExportModel } = nodeRequire(path.join(outDir, "platform", "projectExport.js"));
  const step = (id, title, prompt) => ({ id, title, prompt, responseKind: "long-text" });
  const definition = (id, name, summary, steps) => ({
    id,
    name,
    summary,
    category: "diagnostic",
    builtIn: false,
    version: 1,
    steps,
    createdAt: null,
    updatedAt: null,
  });
  const run = (id, parentRunId, sequenceIndex, snapshot, responses) => ({
    id,
    parentRunId,
    sequenceIndex,
    definitionId: snapshot.id,
    definitionVersion: 1,
    definitionSnapshot: snapshot,
    responses,
    createdAt: `2026-01-0${sequenceIndex + 1}T00:00:00.000Z`,
    updatedAt: `2026-01-0${sequenceIndex + 1}T00:00:00.000Z`,
  });
  const note = (id, title, body) => ({
    id,
    title,
    body,
    createdAt: "2026-01-01T00:00:00.000Z",
    updatedAt: "2026-01-01T00:00:00.000Z",
  });

  const rootMethod = definition(
    "method-root",
    "Root method",
    "Root summary",
    [step("root-step", "Root step", "Root prompt")],
  );
  const childMethod = definition(
    "method-child",
    "Child method",
    "Child summary",
    [step("child-step", "Child step", "Child prompt")],
  );
  const secondMethod = definition(
    "method-second",
    "Second root method",
    "",
    [step("second-step", "Second step", "Second prompt")],
  );

  const state = {
    analysisRoot: { title: "Export Test" },
    outline: {
      rootItemId: "outline-root",
      items: {
        "place-root": { id: "place-root", kind: "reference", itemId: "note-root", parentItemId: "outline-root", siblingOrder: 0 },
        "place-child": { id: "place-child", kind: "reference", itemId: "note-child", parentItemId: "place-root", siblingOrder: 0 },
        "place-second": { id: "place-second", kind: "reference", itemId: "note-second", parentItemId: "outline-root", siblingOrder: 1 },
      },
    },
    outlineSession: { collapsedItemIds: ["place-root"] },
    notes: {
      "note-root": note("note-root", "Root finding", "Root body"),
      "note-child": note("note-child", "Child finding", "Child body\nwith a second line"),
      "note-second": note("note-second", "Second finding", "Second body"),
    },
    techniqueRuns: {
      "run-root": run("run-root", null, 0, rootMethod, { "root-step": "Root response" }),
      "run-child": run("run-child", "run-root", 0, childMethod, { "child-step": "Child response" }),
      "run-second": run("run-second", null, 1, secondMethod, { "second-step": "Second response" }),
    },
  };

  const model = buildProjectExportModel(state);
  assert.equal(model.title, "Export Test");
  assert.deepEqual(
    model.methods.map((item) => [item.number, item.depth, item.run.definitionSnapshot.name]),
    [
      ["1", 0, "Root method"],
      ["1.1", 1, "Child method"],
      ["2", 0, "Second root method"],
    ],
    "method export must preserve the complete nested method order",
  );
  assert.equal(model.methods[0].run.definitionSnapshot.steps[0].prompt, "Root prompt");
  assert.equal(model.methods[1].run.responses["child-step"], "Child response");

  assert.deepEqual(
    model.outline.map((item) => [item.number, item.depth, item.title]),
    [
      ["1", 0, "Root finding"],
      ["1.1", 1, "Child finding"],
      ["2", 0, "Second finding"],
    ],
    "outline export must include collapsed descendants and preserve authored hierarchy",
  );
  assert.equal(model.outline[1].body, "Child body\nwith a second line");

  console.log("Catalyst project export model tests passed.");
} finally {
  fs.rmSync(outDir, { recursive: true, force: true });
}
