import assert from "node:assert/strict";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { createRequire } from "node:module";
import { catalystTestCompilerOptions } from "./test-compiler.mjs";

const nodeRequire = createRequire(import.meta.url);
const ts = nodeRequire("@typescript/typescript6");
const root = process.cwd();
const outDir = fs.mkdtempSync(path.join(os.tmpdir(), "catalyst-viewer-markups-"));

try {
  const program = ts.createProgram({
    rootNames: [
      path.join(root, "src/domain/types.ts"),
      path.join(root, "src/viewer/viewerMarkups.ts"),
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

  const markups = nodeRequire(path.join(outDir, "viewer", "viewerMarkups.js"));

  const rectangle = {
    annotation: {
      id: "shape-1",
      type: 4,
      rect: { origin: { x: 10, y: 20 }, size: { width: 80, height: 40 } },
      color: "#ff0000",
    },
  };

  const first = markups.viewerMarkupFromTransferItem(
    "doc-1",
    3,
    rectangle,
    undefined,
    "2026-09-10T00:00:00.000Z",
  );
  assert.ok(first);
  assert.equal(first.id, "shape-1");
  assert.equal(first.pageIndex, 3);
  assert.equal(JSON.parse(first.annotationJson).pageIndex, 3);
  assert.equal(first.formatVersion, 1);
  assert.equal(first.contextDataBase64, null);

  const updated = markups.viewerMarkupFromTransferItem(
    "doc-1",
    3,
    rectangle,
    first,
    "2026-09-10T00:01:00.000Z",
  );
  assert.equal(updated.createdAt, first.createdAt, "native annotation updates must preserve creation time");
  assert.equal(updated.updatedAt, "2026-09-10T00:01:00.000Z");

  const stampBytes = new Uint8Array([0, 1, 2, 127, 128, 255]);
  const stamp = markups.viewerMarkupFromTransferItem(
    "doc-1",
    1,
    {
      annotation: { id: "stamp-1", type: 13, pageIndex: 1 },
      ctx: { data: stampBytes.buffer, mimeType: "application/pdf" },
    },
    undefined,
    "2026-09-10T00:02:00.000Z",
  );
  assert.ok(stamp.contextDataBase64);
  assert.equal(stamp.contextMimeType, "application/pdf");

  const restored = markups.viewerMarkupToTransferItem(stamp);
  assert.deepEqual(
    [...new Uint8Array(restored.ctx.data)],
    [...stampBytes],
    "native annotation appearance bytes must round-trip",
  );


  const appSource = fs.readFileSync(path.join(root, "src/App.tsx"), "utf8");
  assert.match(appSource, /subscribeToDocumentViewerMarkupPersistence/);
  assert.match(appSource, /dispatch\(\{ type: "viewer-markup\/saved", markup \}\)/);
  assert.doesNotMatch(appSource, /analyticMarkPurposeForAnnotationJson|withAnalyticMarkPurpose|activeAnalyticPurpose/);
  assert.doesNotMatch(appSource, /<AnnotationToolbar/);

  const readerSource = fs.readFileSync(path.join(root, "src/viewer/EmbedPdfReader.tsx"), "utf8");
  assert.match(readerSource, /<PDFViewer/);
  assert.match(readerSource, /annotations:\s*\{/);
  assert.match(readerSource, /autoCommit:\s*true/);
  assert.doesNotMatch(readerSource, /PdfAnnotationSubtype|addTool\(|CATALYST_MARK_TOOLS|catalystMark|Catalyst PDF marks/);

  assert.equal(
    fs.existsSync(path.join(root, "src/features/annotations/analyticMarking.ts")),
    false,
    "retired Catalyst analytic-mark classifier must stay removed",
  );
  assert.equal(
    fs.existsSync(path.join(root, "public/catalyst-marks")),
    false,
    "retired Catalyst PDF mark assets must stay removed",
  );
  assert.equal(
    fs.existsSync(path.join(root, "src/features/annotations/AnnotationToolbar.tsx")),
    false,
    "retired Catalyst annotation rail must stay removed",
  );

  const styleSource = [
    fs.readFileSync(path.join(root, "src/styles.css"), "utf8"),
    fs.readFileSync(path.join(root, "src/styles/50-reader.css"), "utf8"),
  ].join("\n");
  assert.match(styleSource, /\.reader-body/);
  assert.match(styleSource, /grid-template-columns:\s*minmax\(0, 1fr\)/);
  assert.doesNotMatch(
    styleSource,
    /\.annotation-toolbar|\.annotation-rail-resizer|\.annotation-quick-|\.catalyst-source-semantic-mark|\.catalyst-analytic-frame|\.catalyst-key-evidence-rail|\.catalyst-conflict-mark|\.catalyst-information-gap-flag/,
  );

  console.log("Catalyst native EmbedPDF annotation persistence tests passed.");
} finally {
  fs.rmSync(outDir, { recursive: true, force: true });
}
