import assert from "node:assert/strict";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { createRequire } from "node:module";
import { catalystTestCompilerOptions } from "../../../scripts/test-compiler.mjs";

const nodeRequire = createRequire(import.meta.url);
const ts = nodeRequire("@typescript/typescript6");
const root = path.resolve(process.cwd());
const outDir = fs.mkdtempSync(path.join(os.tmpdir(), "catalyst-dense-layout-"));

const note = (id, day, title = id) => ({
  id,
  title,
  body: "",
  createdAt: `2026-02-${String(day).padStart(2, "0")}T00:00:00.000Z`,
  updatedAt: `2026-02-${String(day).padStart(2, "0")}T00:00:00.000Z`,
  deletedAt: null,
});

try {
  const program = ts.createProgram({
    rootNames: [
      path.join(root, "src/domain/types.ts"),
      path.join(root, "src/domain/workspace.ts"),
      path.join(root, "src/map/layout.ts"),
      path.join(root, "src/picture/layout.ts"),
    ],
    options: catalystTestCompilerOptions(ts, outDir),
  });  const emit = program.emit();
  const diagnostics = ts.getPreEmitDiagnostics(program)
    .concat(emit.diagnostics)
    .filter((item) => item.category === ts.DiagnosticCategory.Error);
  assert.equal(diagnostics.length, 0, diagnostics.map((d) =>
    ts.flattenDiagnosticMessageText(d.messageText, "\n")).join("\n"));

  const workspace = nodeRequire(path.join(outDir, "domain", "workspace.js"));
  const pictureLayout = nodeRequire(path.join(outDir, "picture", "layout.js"));

  const allNotes = [note("root", 1, "Issue")];
  for (let i = 0; i < 12; i += 1) allNotes.push(note(`ctx-${i}`, i + 2, `Context ${i + 1}`));
  for (let i = 0; i < 12; i += 1) allNotes.push(note(`open-${i}`, i + 14, `Question ${i + 1}`));
  for (let i = 0; i < 12; i += 1) allNotes.push(note(`assess-${i}`, i + 26, `Assessment ${i + 1}`));

  let state = workspace.initialWorkspaceState;
  for (const item of allNotes) {
    state = workspace.workspaceReducer(state, { type: "note/created", note: item });
  }
  for (let i = 0; i < 12; i += 1) {
    state = workspace.workspaceReducer(state, {
      type: "map/occurrence-parented", noteId: `ctx-${i}`, parentNoteId: "root",
    });
    state = workspace.workspaceReducer(state, {
      type: "map/occurrence-parented", noteId: `open-${i}`, parentNoteId: "root",
    });
    state = workspace.workspaceReducer(state, {
      type: "note-semantics/updated", id: `open-${i}`, patch: { roles: ["question"] },
    });
    state = workspace.workspaceReducer(state, {
      type: "map/occurrence-parented", noteId: `assess-${i}`, parentNoteId: "root",
    });
    state = workspace.workspaceReducer(state, {
      type: "note-semantics/updated", id: `assess-${i}`, patch: { roles: ["claim"] },
    });
  }  state = workspace.workspaceReducer(state, { type: "map/focus-set", noteId: "root" });
  const layout = pictureLayout.workingPictureLayout(state);
  const width = 216;
  const height = 84;
  const collisions = [];
  for (let i = 0; i < layout.nodes.length; i += 1) {
    for (let j = i + 1; j < layout.nodes.length; j += 1) {
      const a = layout.nodes[i];
      const b = layout.nodes[j];
      if (
        Math.abs(a.position.x - b.position.x) < width &&
        Math.abs(a.position.y - b.position.y) < height
      ) collisions.push([a.note.id, b.note.id]);
    }
  }
  const outsideStage = layout.nodes.filter((node) =>
    node.position.x - width / 2 < 0 ||
    node.position.y - height / 2 < 0 ||
    node.position.x + width / 2 > layout.width ||
    node.position.y + height / 2 > layout.height,
  ).map((node) => node.note.id);

  const result = {
    nodeCount: layout.nodes.length,
    stage: { width: layout.width, height: layout.height },
    placement: { width: layout.placementWidth, height: layout.placementHeight },
    collisions,
    outsideStage,
    contextXs: layout.nodes.filter((n) => n.note.id.startsWith("ctx-")).map((n) => n.position.x),
    openXs: layout.nodes.filter((n) => n.note.id.startsWith("open-")).map((n) => n.position.x),
  };  const outputPath = path.join(
    root,
    "tools/research-probes/2026-09-13/dense-layout-before.json",
  );
  fs.writeFileSync(outputPath, JSON.stringify(result, null, 2));
  console.log(JSON.stringify(result, null, 2));
} finally {
  fs.rmSync(outDir, { recursive: true, force: true });
}
