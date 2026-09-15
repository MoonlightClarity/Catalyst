import assert from "node:assert/strict";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { createRequire } from "node:module";
import { catalystTestCompilerOptions } from "./test-compiler.mjs";

const nodeRequire = createRequire(import.meta.url);
const ts = nodeRequire("@typescript/typescript6");
const root = process.cwd();
const outDir = fs.mkdtempSync(path.join(os.tmpdir(), "catalyst-reset-state-"));

class MemoryStorage {
  #values = new Map();
  get length() { return this.#values.size; }
  key(index) { return [...this.#values.keys()][index] ?? null; }
  getItem(key) { return this.#values.has(key) ? this.#values.get(key) : null; }
  setItem(key, value) { this.#values.set(key, String(value)); }
  removeItem(key) { this.#values.delete(key); }
}

try {
  const program = ts.createProgram({
    rootNames: [path.join(root, "src/platform/resetSavedState.ts")],
    options: catalystTestCompilerOptions(ts, outDir),
  });  const emit = program.emit();
  const diagnostics = ts.getPreEmitDiagnostics(program)
    .concat(emit.diagnostics)
    .filter((item) => item.category === ts.DiagnosticCategory.Error);
  assert.equal(
    diagnostics.length,
    0,
    diagnostics.map((d) => ts.flattenDiagnosticMessageText(d.messageText, "\n")).join("\n"),
  );

  const localStorage = new MemoryStorage();
  const sessionStorage = new MemoryStorage();
  localStorage.setItem("catalyst.xml.workspace.v1", "workspace");
  localStorage.setItem("catalyst.browser.workspace.v1", "legacy-workspace");
  localStorage.setItem("catalyst.recovery.v1", "recovery");
  localStorage.setItem("catalyst:pdf-reader:dark-mode", "true");
  sessionStorage.setItem("other.session", "keep-me-too");

  global.window = { localStorage, sessionStorage };
  const { startFreshCatalystWorkspace } = nodeRequire(
    path.join(outDir, "platform", "resetSavedState.js"),
  );

  await startFreshCatalystWorkspace();

  assert.equal(localStorage.getItem("catalyst.xml.workspace.v1"), null);
  assert.equal(localStorage.getItem("catalyst.browser.workspace.v1"), null);
  assert.equal(localStorage.getItem("catalyst.recovery.v1"), null);
  assert.equal(localStorage.getItem("catalyst:pdf-reader:dark-mode"), "true");
  assert.equal(sessionStorage.getItem("other.session"), "keep-me-too");

  console.log("Catalyst saved-state reset tests passed.");
} finally {
  delete global.window;
  fs.rmSync(outDir, { recursive: true, force: true });
}
