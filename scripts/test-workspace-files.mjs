import assert from "node:assert/strict";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { createRequire } from "node:module";
import { catalystTestCompilerOptions } from "./test-compiler.mjs";

const nodeRequire = createRequire(import.meta.url);
const ts = nodeRequire("@typescript/typescript6");
const root = process.cwd();
const outDir = fs.mkdtempSync(path.join(os.tmpdir(), "catalyst-workspace-files-"));

class MemoryStorage {
  #values = new Map();
  getItem(key) { return this.#values.has(key) ? this.#values.get(key) : null; }
  setItem(key, value) { this.#values.set(key, String(value)); }
  removeItem(key) { this.#values.delete(key); }
}

try {
  const program = ts.createProgram({
    rootNames: [path.join(root, "src/platform/workspaceFiles.ts")],
    options: catalystTestCompilerOptions(ts, outDir),
  });
  const diagnostics = ts.getPreEmitDiagnostics(program)
    .concat(program.emit().diagnostics)
    .filter((item) => item.category === ts.DiagnosticCategory.Error);
  assert.equal(
    diagnostics.length,
    0,
    diagnostics.map((d) => ts.flattenDiagnosticMessageText(d.messageText, "\n")).join("\n"),
  );

  const storage = new MemoryStorage();
  global.window = { localStorage: storage };

  const {
    importWorkspaceXmlFile,
    pickWorkspaceXmlFile,
    saveWorkspaceXmlFile,
    supportsWorkspaceOpenPicker,
    supportsWorkspaceSavePicker,
    workspaceFileName,
  } = nodeRequire(
    path.join(outDir, "platform", "workspaceFiles.js"),
  );
  const { serializeWorkspaceXml } = nodeRequire(
    path.join(outDir, "persistence", "xml.js"),
  );
  const { initialWorkspaceState } = nodeRequire(
    path.join(outDir, "domain", "workspace.js"),
  );

  const importedState = structuredClone(initialWorkspaceState);
  importedState.notes["imported-note"] = {
    id: "imported-note",
    title: "Imported",
    body: "Portable XML works",
    createdAt: "2026-09-13T19:00:00.000Z",
    updatedAt: "2026-09-13T19:00:00.000Z",
    };
  importedState.activeNoteId = "imported-note";
  const xml = serializeWorkspaceXml(importedState);

  assert.equal(workspaceFileName("Operation North Star"), "Operation North Star.catalyst.xml");
  assert.equal(workspaceFileName("Case / Alpha.catalyst.xml"), "Case - Alpha.catalyst.xml");

  let openOptions = null;
  const selectedFile = new File([xml], "loaded.catalyst.xml", { type: "application/xml" });
  global.window.showOpenFilePicker = async (options) => {
    openOptions = options;
    return [{ getFile: async () => selectedFile }];
  };
  assert.equal(supportsWorkspaceOpenPicker(), true);
  assert.equal(await pickWorkspaceXmlFile(), selectedFile);
  assert.equal(openOptions.id, "catalyst-session");
  assert.equal("startIn" in openOptions, false);

  let saveOptions = null;
  let savedXml = "";
  let saveClosed = false;
  global.window.showSaveFilePicker = async (options) => {
    saveOptions = options;
    return {
      name: "Renamed Session.catalyst.xml",
      createWritable: async () => ({
        write: async (value) => { savedXml = String(value); },
        close: async () => { saveClosed = true; },
      }),
    };
  };
  assert.equal(supportsWorkspaceSavePicker(), true);
  assert.equal(
    await saveWorkspaceXmlFile(importedState, "Operation North Star"),
    "Renamed Session.catalyst.xml",
  );
  assert.equal(saveOptions.id, "catalyst-session");
  assert.equal("startIn" in saveOptions, false);
  assert.equal(saveOptions.suggestedName, "Operation North Star.catalyst.xml");
  assert.ok(savedXml.startsWith("<?xml"));
  assert.equal(saveClosed, true);

  storage.setItem("catalyst.recovery.v1", "stale-recovery");
  const imported = await importWorkspaceXmlFile(
    new File([xml], "portable.catalyst.xml", { type: "application/xml" }),
  );

  assert.equal(imported.activeNoteId, "imported-note");
  assert.equal(imported.notes["imported-note"].body, "Portable XML works");
  const canonical = storage.getItem("catalyst.xml.workspace.v1");
  assert.ok(canonical?.startsWith("<?xml"));
  assert.equal(storage.getItem("catalyst.recovery.v1"), null);

  const beforeMalformed = canonical;
  await assert.rejects(
    () => importWorkspaceXmlFile(
      new File(["<broken-xml>"], "broken.catalyst.xml", { type: "application/xml" }),
    ),
  );
  assert.equal(storage.getItem("catalyst.xml.workspace.v1"), beforeMalformed);

  console.log("Catalyst workspace XML load/save tests passed.");
} finally {
  delete global.window;
  fs.rmSync(outDir, { recursive: true, force: true });
}
