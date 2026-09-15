import assert from "node:assert/strict";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { createRequire } from "node:module";
import { catalystTestCompilerOptions } from "./test-compiler.mjs";

const nodeRequire = createRequire(import.meta.url);
const ts = nodeRequire("@typescript/typescript6");
const root = process.cwd();
const outDir = fs.mkdtempSync(path.join(os.tmpdir(), "catalyst-xml-"));

try {
  const program = ts.createProgram({
    rootNames: [path.join(root, "src/persistence/xml.ts")],
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
  const {
    CATALYST_XML_FORMAT_VERSION,
    deserializeWorkspaceXml,
    serializeWorkspaceXml,
  } = nodeRequire(path.join(outDir, "persistence", "xml.js"));

  const now = "2026-09-13T18:00:00.000Z";
  const state = {
    documents: {
      doc: { id: "doc", name: "A&B <source>.pdf", path: null, openedAt: now, lastOpenedAt: now },
    },
    annotations: {},
    viewerMarkups: {},
    notes: {
      note: {
        id: "note",
        title: 'Claim: "Alpha" > Beta',
        body: "Line 1\nLine 2 & <tag> 'quoted'",
        createdAt: now,
        updatedAt: now,
            },
    },
    links: [],
    noteLinks: [],
    techniqueRuns: {
      customReviewRun: {
        id: "custom-review-run",
        definitionId: "custom-review:xml-roundtrip",
        definitionVersion: 1,
        definitionSnapshot: {
          id: "custom-review:xml-roundtrip",
          name: "Custom review",
          summary: "Custom structured analysis technique.",
          category: "other",
          family: "general",
          cluster: "Review",
          builtIn: false,
          version: 1,
          steps: [{ id: "question-1", title: "Question 1", prompt: "What changed?", responseKind: "long-text" }],
          createdAt: now,
          updatedAt: now,
        },
        responses: { "question-1": "The operating assumption changed." },
        createdAt: now,
        updatedAt: now,
      },
    },
    pendingSelection: null,
    activeDocumentId: "doc",
    activeNoteId: "note",
    graphView: { positions: {}, camera: { x: 1, y: 2, zoom: 1.25 } },
    capabilities: {},
    noteSemantics: {},
    relationships: {},
    annotationRoles: {},
  };

  const xml = serializeWorkspaceXml(state);
  assert.match(xml, /^<\?xml version="1\.0" encoding="UTF-8"\?>/);
  assert.match(xml, new RegExp(`<catalyst-workspace version="${CATALYST_XML_FORMAT_VERSION}">`));
  assert.ok(xml.includes("A&amp;B &lt;source&gt;.pdf"));
  assert.deepEqual(deserializeWorkspaceXml(xml), state);

  const reordered = { ...state, documents: { ...state.documents } };
  assert.equal(serializeWorkspaceXml(reordered), xml);

  assert.throws(
    () => deserializeWorkspaceXml(xml.replace('version="1"', 'version="999"')),
    /Unsupported Catalyst XML version/,
  );
  assert.throws(
    () => deserializeWorkspaceXml(
      '<!DOCTYPE x [<!ENTITY probe "boom">]><catalyst-workspace version="1"></catalyst-workspace>',
    ),
    /does not allow DTD or ENTITY/,
  );

  console.log("Catalyst XML persistence tests passed.");
} finally {
  fs.rmSync(outDir, { recursive: true, force: true });
}
