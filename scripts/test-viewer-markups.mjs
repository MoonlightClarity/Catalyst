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
      path.join(root, "src/features/annotations/analyticMarking.ts"),
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
  const analyticMarking = nodeRequire(path.join(outDir, "features", "annotations", "analyticMarking.js"));

  assert.equal(analyticMarking.ANALYTIC_MARK_PRESETS.length, 4);
  assert.equal(analyticMarking.analyticMarkPurposeForColor("#ffe066"), null, "ordinary yellow highlights must not be classified as analytic marks");
  assert.equal(analyticMarking.analyticMarkPurposeForColor("#FF6B6B"), "contradiction");
  assert.equal(
    analyticMarking.analyticMarkPurposeForAnnotationJson(JSON.stringify({ color: "#66d9e8" })),
    "follow-up",
  );
  assert.equal(analyticMarking.analyticMarkPurposeForAnnotationJson("not-json"), null);
  const taggedAnalyticJson = analyticMarking.withAnalyticMarkPurpose(
    JSON.stringify({ id: "analytic-1", color: "#123456", custom: { reviewer: "A" } }),
    "contradiction",
  );
  const taggedAnalytic = JSON.parse(taggedAnalyticJson);
  assert.equal(taggedAnalytic.custom.catalystAnalyticPurpose, "contradiction");
  assert.equal(taggedAnalytic.custom.reviewer, "A", "analytic metadata must preserve existing custom fields");
  assert.equal(
    analyticMarking.analyticMarkPurposeForAnnotationJson(taggedAnalyticJson),
    "contradiction",
    "explicit analytic purpose must survive a custom display color",
  );
  const explicitlyGenericJson = analyticMarking.withAnalyticMarkPurpose(
    JSON.stringify({ id: "generic-1", color: "#ff6b6b" }),
    null,
  );
  assert.equal(
    analyticMarking.analyticMarkPurposeForAnnotationJson(explicitlyGenericJson),
    null,
    "an explicitly generic mark must not be reclassified from an analyst preset color",
  );
  assert.equal(
    analyticMarking.analyticMarkPurposeForAnnotationJson(JSON.stringify({ color: "#ff6b6b" })),
    "contradiction",
    "legacy color-only analytic marks with unknown type must remain readable",
  );
  assert.equal(
    analyticMarking.analyticMarkPurposeForAnnotationJson(JSON.stringify({ type: 9, color: "#ff6b6b" })),
    "contradiction",
    "typed legacy highlights must retain color-inferred purpose",
  );
  assert.equal(
    analyticMarking.analyticMarkPurposeForAnnotationJson(JSON.stringify({ type: 4, color: "#ff6b6b" })),
    null,
    "non-highlight annotations must never gain analytic meaning from color alone",
  );
  assert.deepEqual(
    analyticMarking.analyticMarkClassificationForAnnotationJson(JSON.stringify({ type: 9, color: "#66d9e8" })),
    { purpose: "follow-up", source: "legacy-color" },
  );
  assert.deepEqual(
    analyticMarking.analyticMarkClassificationForAnnotationJson(taggedAnalyticJson),
    { purpose: "contradiction", source: "explicit" },
  );
  const reclassifiedLegacyJson = analyticMarking.withAnalyticMarkPurpose(
    JSON.stringify({ type: 9, color: "#ff6b6b" }),
    "uncertain",
  );
  assert.deepEqual(
    analyticMarking.analyticMarkClassificationForAnnotationJson(reclassifiedLegacyJson),
    { purpose: "uncertain", source: "explicit" },
    "reclassifying a legacy mark must replace inferred color meaning with explicit analyst meaning",
  );
  assert.equal(analyticMarking.withAnalyticMarkPurpose("not-json", "uncertain"), "not-json");

  const thoriumReaderSource = fs.readFileSync(path.join(root, "src/viewer/ThoriumPdfReader.tsx"), "utf8");
  assert.match(
    thoriumReaderSource,
    /annotationEditorMode: AnnotationEditorType\.DISABLE/,
    "PDF.js annotation editing must stay disabled",
  );
  assert.doesNotMatch(
    thoriumReaderSource,
    /FREETEXT|freeText|textNote|annotationeditorparamschanged|annotationeditormodechanged|switchannotationeditorparams|catalyst-free-text-resizer/,
    "the reader must not expose or synchronize PDF.js free-text editing",
  );
  assert.doesNotMatch(thoriumReaderSource, /insertReadingMark|AnnotationEditorType\\.STAMP|catalystReadingMark/);


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
  assert.equal(JSON.parse(first.annotationJson).pageIndex, 3, "page index must be durable even if export omits it");
  assert.equal(first.formatVersion, 1);
  assert.equal(first.contextDataBase64, null);

  const updated = markups.viewerMarkupFromTransferItem(
    "doc-1",
    3,
    rectangle,
    first,
    "2026-09-10T00:01:00.000Z",
  );
  assert.equal(updated.createdAt, first.createdAt, "updates must preserve creation time");
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
    "stamp appearance bytes must round-trip",
  );

  const managedEvidence = markups.viewerMarkupFromTransferItem(
    "doc-1",
    0,
    {
      annotation: {
        id: "evidence-highlight",
        pageIndex: 0,
        custom: { catalystManaged: true },
      },
    },
    undefined,
  );
  assert.equal(managedEvidence, null, "evidence highlights must not be duplicated as toolbar markups");

  assert.equal(
    fs.existsSync(path.join(root, "src/features/annotations/AnnotationToolbar.tsx")),
    false,
    "the retired annotation rail must stay removed",
  );
  assert.equal(
    fs.existsSync(path.join(root, "src/features/annotations/pdfReadingMarks.ts")),
    false,
    "retired reading marks must stay removed",
  );

  assert.equal(
    fs.existsSync(path.join(root, "src/features/annotations/sourceSemantics.ts")),
    false,
    "retired source-semantic annotation ontology must stay removed",
  );

  const domainTypesSource = fs.readFileSync(path.join(root, "src/domain/types.ts"), "utf8");
  assert.match(domainTypesSource, /sourceSemantics\?: SourceSemanticFacets/);

  const appSource = fs.readFileSync(path.join(root, "src/App.tsx"), "utf8");
  assert.match(appSource, /if \(event\.key !== "Escape" \|\| event\.defaultPrevented\) return;/);
  assert.match(appSource, /if \(isEditing\) return;[\s\S]{0,320}activePane === "context" && stateRef\.current\.activeNoteId/);
  assert.doesNotMatch(appSource, /<AnnotationToolbar/);
  assert.doesNotMatch(appSource, /freeText|textNoteActive|textNoteDisabled|onTextNoteToggle|setViewerAnnotationTool|setViewerAnnotationStyle/);
  assert.doesNotMatch(appSource, /activeSourceSemanticMark/);
  assert.doesNotMatch(appSource, /handlePdfSourceMark/);
  assert.doesNotMatch(appSource, /savePdfSourceMarkSelection/);
  assert.doesNotMatch(appSource, /Digit1: "observation-report"/);
  assert.match(appSource, /captureSourceSelection/);
  assert.match(appSource, /annotationFromSelection\(selection, "excerpt"\)/);
  assert.match(appSource, /setStatus\("Source captured"\)/);
  assert.doesNotMatch(appSource, /createNoteFromSelection/);
  assert.doesNotMatch(appSource, /addSelectionToNote/);
  assert.doesNotMatch(appSource, /sendPendingSelectionToOutline/);
  assert.doesNotMatch(appSource, /saveSelectionAsEvidence/);
  assert.doesNotMatch(appSource, /saveAnalyticSelection/);
  assert.doesNotMatch(appSource, /saveAnalyticFrame/);
  assert.doesNotMatch(appSource, /activeAnalyticPurpose/);
  assert.doesNotMatch(appSource, /handleAnalyticPreset/);
  assert.doesNotMatch(appSource, /goToNextAnalyticMark/);
  assert.doesNotMatch(appSource, /tool === "analyticFrame"/);
  assert.doesNotMatch(appSource, /goToNextLegacyAnalyticMark/);
  assert.doesNotMatch(appSource, /reviewedLegacyMarkupId/);
  assert.doesNotMatch(appSource, /activeDocumentSemanticMarks/);
  assert.doesNotMatch(appSource, /activeDocumentAnalyticMarks/);
  assert.doesNotMatch(appSource, /analyticMarkCounts/);
  assert.doesNotMatch(appSource, /legacyAnalyticMarkCount/);
  assert.doesNotMatch(appSource, /handleAnnotationStyleChange/);
  assert.doesNotMatch(appSource, /resolveReviewedLegacyMark/);
  assert.doesNotMatch(appSource, /classification\.source === "legacy-color"/);
  assert.doesNotMatch(appSource, /Confirmed \$\{label\} analytic meaning/);
  assert.doesNotMatch(appSource, /Reclassified \$\{inferredLabel\} ÃƒÂ¢Ã¢â‚¬Â Ã¢â‚¬â„¢ \$\{label\}/);
  assert.doesNotMatch(appSource, /Cleared inferred analytic meaning/);
  assert.match(appSource, /const purpose = previous[\s\S]*analyticMarkPurposeForAnnotationJson\(previous\.annotationJson\)[\s\S]*: null/);
  assert.doesNotMatch(appSource, /: activeAnalyticPurposeRef\.current/);
  assert.match(appSource, /withAnalyticMarkPurpose/);

  assert.doesNotMatch(appSource, /exportAnnotationRegister/);
  assert.doesNotMatch(appSource, /exportAnalystReview/);

  const selectionCardSource = fs.readFileSync(
    path.join(root, "src/features/selection/SelectionCard.tsx"),
    "utf8",
  );
  assert.doesNotMatch(selectionCardSource, />Add to outline</);
  assert.doesNotMatch(selectionCardSource, />Highlight</);
  assert.match(selectionCardSource, />Save</);
  assert.match(selectionCardSource, />Copy</);
  assert.doesNotMatch(selectionCardSource, /Evidence ÃƒÂ¢Ã¢â‚¬Â Ã¢â‚¬â„¢ outline note/);
  assert.doesNotMatch(selectionCardSource, /onNewNote/);
  assert.doesNotMatch(selectionCardSource, /onAttach/);
  assert.match(selectionCardSource, /onSaveSource/);
  assert.doesNotMatch(selectionCardSource, /onSaveEvidence/);
  assert.doesNotMatch(appSource, /copyAnnotationWithSource|goToAnnotation|saved evidence/);

  const viewerBridgeSource = fs.readFileSync(path.join(root, "src/viewer/viewerBridge.ts"), "utf8");
  assert.match(viewerBridgeSource, /onAnnotationEvent/);
  assert.match(viewerBridgeSource, /event\.type === "create"/);
  assert.match(viewerBridgeSource, /event\.type === "delete"/);
  assert.match(viewerBridgeSource, /rehydrateDocumentViewerMarkups/);
  assert.match(viewerBridgeSource, /catalystAnalyticPurpose: annotation\.analyticPurpose/);
  assert.doesNotMatch(viewerBridgeSource, /createPdfSourceMark/);
  assert.doesNotMatch(viewerBridgeSource, /catalystPdfMark/);
  assert.doesNotMatch(viewerBridgeSource, /catalystSourceSemantics/);

  const readerSource = fs.readFileSync(path.join(root, "src/viewer/ThoriumPdfReader.tsx"), "utf8");
  assert.doesNotMatch(readerSource, /annotationeditormodechanged|annotationeditorparamschanged|onActiveToolChanged|onToolStyleChanged/);
  assert.doesNotMatch(readerSource, /thorium-text-note-button|textNote|freeText|FREETEXT/);
  assert.match(readerSource, /aria-label="Reader navigation toolbar"/);
  assert.match(readerSource, /<InstrumentGlyph name="zoom-out"/);
  assert.match(readerSource, /<InstrumentGlyph name="zoom-in"/);
  assert.match(readerSource, /className="thorium-zoom-reset"/);
  assert.match(readerSource, /<InstrumentGlyph name="zoom-reset"/);
  assert.doesNotMatch(readerSource, /thorium-find-label/);
  assert.match(readerSource, /event\.key\.toLowerCase\(\) === "f" && activeDocumentIdRef\.current/);
  assert.doesNotMatch(readerSource, /thorium-annotation-tools/);
  assert.match(readerSource, /catalyst-key-evidence-rail/);
  assert.match(readerSource, /catalyst-conflict-mark/);
  assert.match(readerSource, /catalyst-confidence-frame/);
  assert.match(readerSource, /catalyst-information-gap-flag/);
  assert.match(readerSource, /catalyst-analytic-frame/);
  assert.match(readerSource, /ANALYTIC_MARK_GLYPH_PATHS/);
  assert.match(readerSource, /appendAnalyticMarkerGlyph/);
  assert.doesNotMatch(readerSource, /SOURCE_SEMANTIC_GLYPH_PATHS/);
  assert.doesNotMatch(readerSource, /catalystPdfMark/);
  assert.doesNotMatch(readerSource, /catalystSourceSemantics/);
  assert.doesNotMatch(readerSource, /marker\.textContent/);
  assert.match(readerSource, /purpose === "key-evidence"/);
  assert.match(readerSource, /purpose === "contradiction"/);
  assert.match(readerSource, /purpose === "uncertain"/);
  assert.match(readerSource, /purpose === "follow-up"/);

  const symbolSource = fs.readFileSync(path.join(root, "src/ui/CatalystSymbols.tsx"), "utf8");
  assert.doesNotMatch(symbolSource, /case "text-tool"/);
  assert.doesNotMatch(symbolSource, /source-(observation|assumption|hypothesis|judgment|reason|conclusion|caveat|objection)/);
  assert.doesNotMatch(symbolSource, /SOURCE_SEMANTIC_GLYPH_PATHS|SourceSemanticInstrumentGlyph/);
  const instrumentGlyphUnion = symbolSource.match(/export type InstrumentGlyphName\s*=([\s\S]*?);/)?.[1] ?? "";
  assert.doesNotMatch(instrumentGlyphUnion, /"(?:new|link-out|link-in|unlink|home|library|attach|source-link|stamp-tool|analytic-frame|text-select|text-tool)"/);

  const styleSource = [
    fs.readFileSync(path.join(root, "src/styles.css"), "utf8"),
    fs.readFileSync(path.join(root, "src/styles/50-reader.css"), "utf8"),
  ].join("\n");
  assert.match(styleSource, /\.reader-body/);
  assert.match(styleSource, /grid-template-columns: minmax\(0, 1fr\)/);
  assert.doesNotMatch(styleSource, /\.annotation-toolbar|\.pdf-reading-mark-tools/);
  assert.doesNotMatch(styleSource, /freeTextEditor|basicColorPicker|catalyst-free-text-resizer/);
  assert.equal(fs.existsSync(path.join(root, "src/styles/51-annotation-rail.css")), false);
  assert.equal(fs.existsSync(path.join(root, "src/viewer/annotationTools.ts")), false, "retired annotation-tool adapter must stay removed");
  assert.equal(fs.existsSync(path.join(root, "src/viewer/thoriumAnnotations.ts")), false, "retired PDF.js native annotation bridge must stay removed");
  assert.equal(fs.existsSync(path.join(root, "src/viewer/readerKeyboard.ts")), false, "retired PDF.js editor keyboard fence must stay removed");
  assert.match(styleSource, /\.catalyst-key-evidence-rail/);
  assert.match(styleSource, /\.catalyst-conflict-mark/);
  assert.match(styleSource, /\.catalyst-confidence-frame/);
  assert.match(styleSource, /\.catalyst-information-gap-flag/);
  assert.match(styleSource, /\.catalyst-analytic-frame/);

  console.log("Catalyst toolbar markup persistence tests passed.");
} finally {
  fs.rmSync(outDir, { recursive: true, force: true });
}
