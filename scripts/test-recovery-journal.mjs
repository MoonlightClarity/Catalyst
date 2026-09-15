import assert from "node:assert/strict";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { createRequire } from "node:module";
import { catalystTestCompilerOptions } from "./test-compiler.mjs";

const nodeRequire = createRequire(import.meta.url);
const ts = nodeRequire("@typescript/typescript6");
const root = process.cwd();
const outDir = fs.mkdtempSync(path.join(os.tmpdir(), "catalyst-recovery-"));

try {
  const program = ts.createProgram({
    rootNames: [
      path.join(root, "src/domain/types.ts"),
      path.join(root, "src/domain/workspace.ts"),
      path.join(root, "src/persistence/repository.ts"),
      path.join(root, "src/persistence/recoveryJournal.ts"),
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

  const values = new Map();
  const localStorage = {
    getItem(key) { return values.has(key) ? values.get(key) : null; },
    setItem(key, value) { values.set(key, String(value)); },
    removeItem(key) { values.delete(key); },
  };
  global.window = { localStorage };

  const workspace = nodeRequire(path.join(outDir, "domain", "workspace.js"));
  const journal = nodeRequire(path.join(outDir, "persistence", "recoveryJournal.js"));
  const note = workspace.newNote({ title: "Persist me", body: "Survives refresh" });
  const next = workspace.workspaceReducer(workspace.initialWorkspaceState, {
    type: "note/created",
    note,
  });

  journal.writeRecoveryJournal(next);
  const recovered = journal.readRecoveryJournal();
  assert.equal(recovered.notes[note.id].body, "Survives refresh");
  assert.equal(recovered.pendingSelection, null);

  // Pre-0.4 browser/recovery payloads did not have noteLinks. Keep them loadable.
  const legacyState = JSON.parse(JSON.stringify(next));
  delete legacyState.noteLinks;
  localStorage.setItem(
    "catalyst.recovery.v1",
    JSON.stringify({ version: 1, savedAt: new Date().toISOString(), state: legacyState }),
  );
  assert.deepEqual(journal.readRecoveryJournal().noteLinks, []);

  const damagedState = JSON.parse(JSON.stringify(next));
  damagedState.documents = {
    "doc-1": { id: "doc-1", name: "Recovered.pdf", path: null, openedAt: "2026-09-13T00:00:00Z", lastOpenedAt: "2026-09-13T00:00:00Z" },
  };
  damagedState.activeDocumentId = "missing-document";
  damagedState.activeNoteId = "missing-note";
  localStorage.setItem(
    "catalyst.recovery.v1",
    JSON.stringify({ version: 1, savedAt: new Date().toISOString(), state: damagedState }),
  );
  const sanitizedRecovery = journal.readRecoveryJournal();
  assert.equal(sanitizedRecovery.activeDocumentId, "doc-1", "recovery hydration must repair a dangling active document");
  assert.equal(sanitizedRecovery.activeNoteId, null, "recovery hydration must clear a dangling active note");

  journal.clearRecoveryJournal();
  assert.equal(journal.readRecoveryJournal(), null);

  console.log("Catalyst recovery journal tests passed.");
} finally {
  fs.rmSync(outDir, { recursive: true, force: true });
}
