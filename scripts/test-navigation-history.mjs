import assert from "node:assert/strict";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { createRequire } from "node:module";
import { catalystTestCompilerOptions } from "./test-compiler.mjs";

const nodeRequire = createRequire(import.meta.url);
const ts = nodeRequire("@typescript/typescript6");
const root = process.cwd();
const outDir = fs.mkdtempSync(path.join(os.tmpdir(), "catalyst-navigation-"));

try {
  const program = ts.createProgram({
    rootNames: [path.join(root, "src/navigation/history.ts")],
    options: catalystTestCompilerOptions(ts, outDir),
  });
  const emit = program.emit();
  const diagnostics = ts.getPreEmitDiagnostics(program)
    .concat(emit.diagnostics)
    .filter((item) => item.category === ts.DiagnosticCategory.Error);
  assert.equal(diagnostics.length, 0,
    diagnostics.map((d) => ts.flattenDiagnosticMessageText(d.messageText, "\n")).join("\n"));

  const historyApi = nodeRequire(path.join(outDir, "history.js"));
  const start = { documentId: "doc-a", pageIndex: 4 };
  const source = { documentId: "doc-a", pageIndex: 17 };
  const otherDocument = { documentId: "doc-b", pageIndex: 2 };

  let reader = historyApi.createReaderHistory(start);
  reader = historyApi.visitReaderLocation(reader, source);
  assert.deepEqual(reader.current, source);

  reader = historyApi.goBackInReaderHistory(reader);
  assert.deepEqual(reader.current, start);
  assert.equal(reader.future.length, 1);

  reader = historyApi.goForwardInReaderHistory(reader);
  assert.deepEqual(reader.current, source);

  const scrolled = { ...source, pageIndex: 22 };
  const pastLength = reader.past.length;
  reader = historyApi.replaceReaderLocation(reader, scrolled);
  assert.equal(reader.past.length, pastLength);
  assert.deepEqual(reader.current, scrolled);

  reader = historyApi.visitReaderLocation(reader, otherDocument);
  assert.equal(historyApi.visitReaderLocation(reader, reader.current), reader,
    "identical reader locations should not duplicate history");

  const remapped = historyApi.remapReaderDocumentId(reader, "doc-a", "sha256-doc-a");
  assert.ok(remapped.past.every((location) => location.documentId !== "doc-a"));
  assert.ok(remapped.future.every((location) => location.documentId !== "doc-a"));

  for (let index = 0; index < 100; index += 1) {
    reader = historyApi.visitReaderLocation(reader, {
      documentId: "doc-b",
      pageIndex: index,
    });
  }
  assert.equal(reader.past.length, historyApi.MAX_RESEARCH_HISTORY);
  console.log("Catalyst reader navigation history tests passed.");
} finally {
  fs.rmSync(outDir, { recursive: true, force: true });
}
