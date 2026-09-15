import assert from "node:assert/strict";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { createRequire } from "node:module";
import { catalystTestCompilerOptions } from "./test-compiler.mjs";

const nodeRequire = createRequire(import.meta.url);
const ts = nodeRequire("@typescript/typescript6");
const root = process.cwd();
const outDir = fs.mkdtempSync(path.join(os.tmpdir(), "catalyst-xml-repo-"));

class MemoryStorage {
  #values = new Map();
  getItem(key) { return this.#values.has(key) ? this.#values.get(key) : null; }
  setItem(key, value) { this.#values.set(key, String(value)); }
  removeItem(key) { this.#values.delete(key); }
}

try {
  const program = ts.createProgram({
    rootNames: [path.join(root, "src/persistence/xmlRepository.ts")],
    options: catalystTestCompilerOptions(ts, outDir),
  });
  const emit = program.emit();
  const diagnostics = ts.getPreEmitDiagnostics(program)
    .concat(emit.diagnostics)
    .filter((item) => item.category === ts.DiagnosticCategory.Error);
  assert.equal(
    diagnostics.length,
    0,
    diagnostics.map((d) => ts.flattenDiagnosticMessageText(d.messageText, "\n")).join("\n"),
  );

  const storage = new MemoryStorage();
  global.window = { localStorage: storage };

  const { XmlWorkspaceRepository } = nodeRequire(
    path.join(outDir, "persistence", "xmlRepository.js"),
  );
  const { initialWorkspaceState } = nodeRequire(
    path.join(outDir, "domain", "workspace.js"),
  );

  const legacy = {
    ...initialWorkspaceState,
    activeDocumentId: "doc-1",
    activeNoteId: "note-1",
    documents: {
      "doc-1": {
        id: "doc-1",
        name: "Legacy.pdf",
        path: null,
        openedAt: "2026-09-13T18:00:00.000Z",
        lastOpenedAt: "2026-09-13T18:00:00.000Z",
      },
    },    notes: {
      "note-1": {
        id: "note-1",
        title: "Migrated note",
        body: "Preserve me",
        createdAt: "2026-09-13T18:00:00.000Z",
        updatedAt: "2026-09-13T18:00:00.000Z",
            },
    },
  };

  storage.setItem("catalyst.browser.workspace.v1", JSON.stringify(legacy));
  const repository = new XmlWorkspaceRepository();
  const loaded = await repository.loadWorkspace();

  assert.equal(repository.kind, "xml");
  assert.equal(loaded.activeDocumentId, "doc-1");
  assert.equal(loaded.activeNoteId, "note-1");
  assert.equal(loaded.notes["note-1"].body, "Preserve me");
  assert.ok(storage.getItem("catalyst.xml.workspace.v1")?.startsWith("<?xml"));
  assert.ok(storage.getItem("catalyst.browser.workspace.v1"));

  const danglingStorage = new MemoryStorage();
  global.window.localStorage = danglingStorage;
  danglingStorage.setItem("catalyst.browser.workspace.v1", JSON.stringify({
    ...legacy,
    activeDocumentId: "missing-document",
    activeNoteId: "missing-note",
  }));
  const sanitized = await new XmlWorkspaceRepository().loadWorkspace();
  assert.equal(sanitized.activeDocumentId, "doc-1", "hydration must recover from a dangling active document ID");
  assert.equal(sanitized.activeNoteId, null, "hydration must clear a dangling active note ID");

  const rollbackStorage = new MemoryStorage();
  global.window.localStorage = rollbackStorage;
  rollbackStorage.setItem("catalyst.xml.workspace.v1", "<broken-xml>");
  rollbackStorage.setItem("catalyst.browser.workspace.v1", JSON.stringify(legacy));
  const rollback = await new XmlWorkspaceRepository().loadWorkspace();
  assert.equal(rollback.notes["note-1"].body, "Preserve me", "malformed canonical XML must fall back to the preserved legacy rollback copy");

  console.log("Catalyst XML repository migration tests passed.");
} finally {
  delete global.window;
  fs.rmSync(outDir, { recursive: true, force: true });
}
