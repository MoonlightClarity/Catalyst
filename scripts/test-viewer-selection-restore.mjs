import assert from "node:assert/strict";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { createRequire } from "node:module";
import { catalystTestCompilerOptions } from "./test-compiler.mjs";

const nodeRequire = createRequire(import.meta.url);
const ts = nodeRequire("@typescript/typescript6");
const root = process.cwd();
const outDir = fs.mkdtempSync(path.join(root, ".tmp-viewer-selection-"));

try {
  const program = ts.createProgram({
    rootNames: [
      path.join(root, "src/domain/types.ts"),
      path.join(root, "src/viewer/annotationLoad.ts"),
      path.join(root, "src/viewer/viewerMarkups.ts"),
      path.join(root, "src/viewer/viewerBridge.ts"),
    ],
    options: catalystTestCompilerOptions(ts, outDir),
  });

  const emit = program.emit();
  const diagnostics = ts.getPreEmitDiagnostics(program)
    .concat(emit.diagnostics)
    .filter((item) => item.category === ts.DiagnosticCategory.Error);

  assert.equal(diagnostics.length, 0,
    diagnostics.map((d) => ts.flattenDiagnosticMessageText(d.messageText, "\n")).join("\n"));
  fs.writeFileSync(path.join(outDir, "package.json"), '{"type":"commonjs"}');
  const viewer = nodeRequire(path.join(outDir, "viewer", "viewerBridge.js"));

  const range = {
    start: { pageIndex: 0, glyphIndex: 60 },
    end: { pageIndex: 0, glyphIndex: 148 },
  };

  const calls = [];
  const registry = {
    getPlugin(name) {
      if (name !== "selection") return undefined;
      return {
        provides() {
          return {
            forDocument(documentId) {
              assert.equal(documentId, "doc-1");
              return {
                setSelection(value) {
                  calls.push(value);
                  return Promise.resolve();
                },
              };
            },
          };
        },
      };
    },
  };

  assert.equal(await viewer.restoreViewerSelection(registry, "doc-1", range), true);
  assert.deepEqual(calls, [range], "exact saved glyph range must be restored unchanged");
  assert.equal(await viewer.restoreViewerSelection(registry, "doc-1", undefined), false);
  assert.equal(calls.length, 1, "missing legacy range must not synthesize a selection");

  const unsupported = { getPlugin: () => undefined };
  assert.equal(await viewer.restoreViewerSelection(unsupported, "doc-1", range), false);

  console.log("Catalyst viewer selection restoration tests passed.");
} finally {
  fs.rmSync(outDir, { recursive: true, force: true });
}
