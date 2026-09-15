import assert from "node:assert/strict";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { createRequire } from "node:module";
import { catalystTestCompilerOptions } from "./test-compiler.mjs";
const nodeRequire = createRequire(import.meta.url);
const ts = nodeRequire("@typescript/typescript6");

const root = process.cwd();
const outDir = fs.mkdtempSync(path.join(os.tmpdir(), "catalyst-domain-"));

try {
  const program = ts.createProgram({
    rootNames: [
      path.join(root, "src/domain/types.ts"),
      path.join(root, "src/domain/workspace.ts"),
      path.join(root, "src/domain/selectors.ts"),
      path.join(root, "src/domain/techniques.ts"),
      path.join(root, "src/domain/techniqueFamilies.ts"),
    ],
    options: catalystTestCompilerOptions(ts, outDir),
  });

  const emit = program.emit();
  const diagnostics = ts
    .getPreEmitDiagnostics(program)
    .concat(emit.diagnostics)
    .filter((item) => item.category === ts.DiagnosticCategory.Error);

  if (diagnostics.length) {
    for (const diagnostic of diagnostics) {
      console.error(ts.flattenDiagnosticMessageText(diagnostic.messageText, "\n"));
    }
    process.exitCode = 1;
  } else {
    const workspace = nodeRequire(path.join(outDir, "workspace.js"));
    const selectors = nodeRequire(path.join(outDir, "selectors.js"));
    const techniques = nodeRequire(path.join(outDir, "techniques.js"));
    const techniqueFamilies = nodeRequire(path.join(outDir, "techniqueFamilies.js"));

    let state = workspace.initialWorkspaceState;
    const now = new Date().toISOString();
    const document = {
      id: "document-1",
      name: "Research.pdf",
      path: "C:/Research.pdf",
      openedAt: now,
      lastOpenedAt: now,
    };
    state = workspace.workspaceReducer(state, { type: "document/opened", document });

    const note = workspace.newNote({ title: "Working note", body: "First draft" });
    state = workspace.workspaceReducer(state, { type: "note/created", note });
    assert.equal(selectors.notesNewestFirst(state).length, 1);
    assert.equal(state.activeNoteId, note.id);
    const beforeMissingActivation = state;
    state = workspace.workspaceReducer(state, { type: "note/activated", id: "missing-note" });
    assert.equal(state, beforeMissingActivation, "activating a nonexistent note must be ignored");

    state = workspace.workspaceReducer(state, {
      type: "note/updated",
      id: note.id,
      patch: { body: "Edited draft" },
    });
    assert.equal(state.notes[note.id].body, "Edited draft");

    state = workspace.workspaceReducer(state, {
      type: "graph/node-positioned",
      noteId: note.id,
      position: { x: 640, y: 420 },
    });
    assert.deepEqual(state.graphView.positions[note.id], { x: 640, y: 420 });
    state = workspace.workspaceReducer(state, {
      type: "graph/camera-updated",
      camera: { x: -120, y: 45, zoom: 9 },
    });
    assert.equal(state.graphView.camera.zoom, 1.8, "graph zoom must be bounded");

    const secondNote = workspace.newNote({ title: "Related note", body: "Supporting reasoning" });
    state = workspace.workspaceReducer(state, { type: "note/created", note: secondNote });
    const noteLink = workspace.newNoteLink(note.id, secondNote.id);
    state = workspace.workspaceReducer(state, { type: "note-link/created", link: noteLink });
    assert.deepEqual(selectors.linkedNotesFromNote(state, note.id).map((item) => item.id), [secondNote.id]);
    assert.deepEqual(selectors.backlinksForNote(state, secondNote.id).map((item) => item.id), [note.id]);
    assert.equal(selectors.connectionCountForNote(state, note.id), 1);
    assert.equal(selectors.linkableNotesForNote(state, note.id).length, 0);
    assert.equal(selectors.linkableNotesForNote(state, secondNote.id).length, 0, "an inbound relationship is already connected");
    assert.deepEqual(
      selectors.connectionsForNote(state, note.id).map((item) => [item.note.id, item.direction]),
      [[secondNote.id, "outgoing"]],
    );
    assert.deepEqual(
      selectors.connectionsForNote(state, secondNote.id).map((item) => [item.note.id, item.direction]),
      [[note.id, "incoming"]],
    );
    const afterFirstNoteLink = state;
    state = workspace.workspaceReducer(state, { type: "note-link/created", link: noteLink });
    assert.equal(state, afterFirstNoteLink, "duplicate note connections must be ignored");
    state = workspace.workspaceReducer(state, {
      type: "note-link/created",
      link: workspace.newNoteLink(note.id, note.id),
    });
    assert.equal(state, afterFirstNoteLink, "self-links must be ignored");

    const beforeReverseCreate = state;
    state = workspace.workspaceReducer(state, {
      type: "note-link/created",
      link: workspace.newNoteLink(secondNote.id, note.id),
    });
    assert.equal(
      state,
      beforeReverseCreate,
      "new graph relationships must reject a reverse duplicate for the same conceptual edge",
    );
    assert.equal(selectors.connectionCountForNote(state, note.id), 1);
    assert.equal(selectors.connectionsForNote(state, note.id)[0].direction, "outgoing");
    state = workspace.workspaceReducer(state, {
      type: "note-link/disconnected",
      noteId: note.id,
      targetNoteId: secondNote.id,
    });
    assert.equal(state.noteLinks.length, 0, "disconnect removes both directions atomically");
    state = workspace.workspaceReducer(state, { type: "note-link/created", link: noteLink });
    state = workspace.workspaceReducer(state, { type: "note/activated", id: note.id });

    const annotation = {
      id: "annotation-1",
      documentId: document.id,
      quote: "Source passage",
      pageIndex: 3,
      anchors: [],
      kind: "excerpt",
      createdAt: new Date().toISOString(),
    };
    state = workspace.workspaceReducer(state, { type: "annotation/saved", annotation });
    state = workspace.workspaceReducer(state, {
      type: "link/created",
      link: workspace.newLink(note.id, annotation.id),
    });
    assert.equal(selectors.annotationsForNote(state, note.id).length, 1);

    const highlightSelection = {
      documentId: document.id,
      documentName: document.name,
      quote: "Highlighted source passage",
      pageIndex: 4,
      anchors: [
        {
          pageIndex: 4,
          rect: { origin: { x: 10, y: 20 }, size: { width: 100, height: 15 } },
          textLines: [
            { origin: { x: 10, y: 20 }, size: { width: 100, height: 15 } },
          ],
        },
      ],
      capturedAt: new Date().toISOString(),
    };
    const highlight = workspace.annotationFromSelection(highlightSelection, "highlight");
    state = workspace.workspaceReducer(state, { type: "annotation/saved", annotation: highlight });
    assert.equal(highlight.kind, "highlight");
    assert.equal(selectors.readerOverlaysForDocument(state, document.id).length, 1);

    const analyticFrame = {
      ...workspace.annotationFromSelection({ ...highlightSelection, quote: "Framed source passage", pageIndex: 6 }, "excerpt"),
      visual: "frame",
    };
    state = workspace.workspaceReducer(state, { type: "annotation/saved", annotation: analyticFrame });
    assert.equal(
      selectors.readerOverlaysForDocument(state, document.id).some((item) => item.id === analyticFrame.id),
      true,
      "Catalyst-managed analytic frames must be returned to the reader overlay path",
    );

    const excerptSelection = {
      ...highlightSelection,
      quote: "Tradecraft Primer: Structured Analytic Techniques for Intelligence Analysis",
      pageIndex: 5,
      anchors: [
        {
          pageIndex: 5,
          rect: { origin: { x: 10, y: 20 }, size: { width: 100, height: 15 } },
          textLines: [
            { origin: { x: 10, y: 20 }, size: { width: 100, height: 15 } },
          ],
        },
      ],
      sourceRange: { start: { page: 5, index: 60 }, end: { page: 5, index: 148 } },
    };
    const firstExcerpt = workspace.annotationFromSelection(excerptSelection, "excerpt");
    state = workspace.workspaceReducer(state, { type: "annotation/saved", annotation: firstExcerpt });
    assert.deepEqual(
      firstExcerpt.sourceRange,
      excerptSelection.sourceRange,
      "saved source regions must retain exact glyph-range provenance",
    );
    const reusedExcerpt = workspace.reusableAnnotationForSelection(state, excerptSelection);
    assert.equal(reusedExcerpt?.id, firstExcerpt.id, "the same glyph range must reuse its source-region record");

    const overlayTruncatedSelection = {
      ...excerptSelection,
      quote: "Tradecraft Primer: Structured Analytic Techniques for Intelligence",
      anchors: [
        {
          pageIndex: 5,
          rect: { origin: { x: 10, y: 20 }, size: { width: 90, height: 15 } },
          textLines: [
            { origin: { x: 10, y: 20 }, size: { width: 90, height: 15 } },
          ],
        },
      ],
      sourceRange: { start: { page: 5, index: 60 }, end: { page: 5, index: 133 } },
    };
    const overlayReuse = workspace.reusableAnnotationForSelection(state, overlayTruncatedSelection);
    assert.equal(
      overlayReuse?.id,
      firstExcerpt.id,
      "Viewer overlay-truncated re-selection must reuse the same source-region identity",
    );

    const materiallySmallerSelection = {
      ...overlayTruncatedSelection,
      quote: "Tradecraft Primer: Structured Analytic",
      anchors: [
        {
          pageIndex: 5,
          rect: { origin: { x: 10, y: 20 }, size: { width: 55, height: 15 } },
          textLines: [
            { origin: { x: 10, y: 20 }, size: { width: 55, height: 15 } },
          ],
        },
      ],
      sourceRange: { start: { page: 5, index: 60 }, end: { page: 5, index: 105 } },
    };
    assert.equal(
      workspace.reusableAnnotationForSelection(state, materiallySmallerSelection),
      null,
      "a nearby but materially smaller region must not be merged into the existing source identity",
    );
    state = workspace.workspaceReducer(state, {
      type: "annotation-role/ensured",
      annotationId: firstExcerpt.id,
      role: "highlight",
    });
    assert.deepEqual(
      state.annotationRoles[firstExcerpt.id],
      ["excerpt", "highlight"],
      "one source region may carry excerpt and highlight roles without cloning identity",
    );
    assert.ok(
      selectors.readerOverlaysForDocument(state, document.id).some((item) => item.id === firstExcerpt.id),
      "a source region with the highlight role must render as a highlight regardless of legacy kind",
    );

    const markup = {
      id: "viewer-markup-1",
      documentId: document.id,
      pageIndex: 2,
      formatVersion: 1,
      annotationJson: JSON.stringify({ id: "viewer-markup-1", pageIndex: 2, type: 4, rect: { x: 1 } }),
      contextDataBase64: null,
      contextMimeType: null,
      createdAt: now,
      updatedAt: now,
    };
    state = workspace.workspaceReducer(state, { type: "viewer-markup/saved", markup });
    assert.equal(selectors.viewerMarkupsForDocument(state, document.id).length, 1);

    const hashA = `sha256-${"a".repeat(64)}`;
    const hashB = `sha256-${"b".repeat(64)}`;
    assert.equal(
      workspace.canReconnectDocumentSource(hashA, hashA),
      true,
      "a content-addressed document must reconnect to identical bytes",
    );
    assert.equal(
      workspace.canReconnectDocumentSource(hashA, hashB),
      false,
      "a content-addressed document must reject different PDF bytes",
    );
    assert.equal(
      workspace.canReconnectDocumentSource("legacy-document-id", hashA),
      true,
      "legacy document IDs must remain migratable to content hashes",
    );

    const hashedDocument = { ...document, id: hashA };
    const hashedState = workspace.workspaceReducer(
      workspace.initialWorkspaceState,
      { type: "document/opened", document: hashedDocument },
    );
    const rejectedReconnect = workspace.workspaceReducer(hashedState, {
      type: "document/reconnected",
      previousId: hashA,
      document: { ...hashedDocument, id: hashB },
    });
    assert.equal(
      rejectedReconnect,
      hashedState,
      "the reducer must not migrate a hashed document to different PDF bytes",
    );

    const reconnectedDocument = { ...document, id: "document-2" };
    state = workspace.workspaceReducer(state, {
      type: "document/reconnected",
      previousId: document.id,
      document: reconnectedDocument,
    });
    assert.equal(state.viewerMarkups[markup.id].documentId, reconnectedDocument.id);
    assert.equal(state.annotations[annotation.id].documentId, reconnectedDocument.id);
    // Restore the local variable used by later assertions to the current document ID.
    document.id = reconnectedDocument.id;

    assert.ok(techniques.BUILT_IN_TECHNIQUES.length >= 95, "built-in analytic technique catalog should remain interdisciplinary and broad");
    assert.equal(new Set(techniques.BUILT_IN_TECHNIQUES.map((item) => item.id)).size, techniques.BUILT_IN_TECHNIQUES.length, "built-in analytic technique IDs must be unique");
    assert.ok(techniques.BUILT_IN_TECHNIQUES.every((item) => !("sourceLabel" in item)), "built-in analytic techniques must not carry bibliography-style citation labels");
    for (const id of ["builtin:fmea", "builtin:causal-loop", "builtin:reference-class-forecasting", "builtin:affinity-mapping", "builtin:attack-tree"]) {
      assert.ok(techniques.BUILT_IN_TECHNIQUES.some((item) => item.id === id), `interdisciplinary technique ${id} must exist`);
    }
    for (const id of ["builtin:close-reading", "builtin:narratology", "builtin:textual-criticism", "builtin:lived-religion-analysis"]) {
      assert.ok(techniques.BUILT_IN_TECHNIQUES.some((item) => item.id === id), `humanities technique ${id} must exist`);
    }
    const familyCounts = new Map();
    for (const item of techniques.BUILT_IN_TECHNIQUES) {
      const family = techniqueFamilies.techniqueFamily(item);
      familyCounts.set(family, (familyCounts.get(family) ?? 0) + 1);
      assert.notEqual(family, "custom", "built-in techniques must never resolve to the custom family");
    }
    assert.ok((familyCounts.get("literary") ?? 0) >= 10, "literary analysis should be a substantial technique family");
    assert.ok((familyCounts.get("religious-studies") ?? 0) >= 10, "religious studies should be a substantial technique family");

    const definition = techniques.BUILT_IN_TECHNIQUES.find((item) => item.id === "builtin:key-assumptions-check");
    assert.ok(definition, "built-in Key Assumptions Check must exist");
    const run = techniques.newTechniqueRun(definition);
    state = workspace.workspaceReducer(state, { type: "technique-run/created", run });
    state = workspace.workspaceReducer(state, {
      type: "technique-run/response-updated",
      id: run.id,
      stepId: definition.steps[0].id,
      value: "Current judgment",
    });
    assert.equal(Object.values(state.techniqueRuns).length, 1);
    assert.equal(state.techniqueRuns[run.id].responses[definition.steps[0].id], "Current judgment");
    state = workspace.workspaceReducer(state, {
      type: "technique-run/definition-updated",
      id: run.id,
      patch: {
        name: "Working assumptions check",
        steps: definition.steps.slice(1),
      },
    });
    assert.equal(state.techniqueRuns[run.id].definitionSnapshot.name, "Working assumptions check");
    assert.equal(state.techniqueRuns[run.id].definitionSnapshot.steps.length, definition.steps.length - 1);
    assert.equal(state.techniqueRuns[run.id].responses[definition.steps[0].id], undefined, "Removing a run field should prune its response");
    assert.equal(definition.name, "Key Assumptions Check", "Editing a run must not mutate the built-in template");

    const secondRun = techniques.newTechniqueRun(definition);
    state = workspace.workspaceReducer(state, { type: "technique-run/created", run: secondRun });
    assert.equal(state.techniqueRuns[run.id].sequenceIndex, 0, "first workspace technique should start the sequence");
    assert.equal(state.techniqueRuns[secondRun.id].sequenceIndex, 1, "new workspace techniques should append to the sequence");
    state = workspace.workspaceReducer(state, { type: "technique-run/reordered", id: secondRun.id, direction: "up" });
    assert.equal(state.techniqueRuns[secondRun.id].sequenceIndex, 0, "reordering should move a technique earlier");
    assert.equal(state.techniqueRuns[run.id].sequenceIndex, 1, "reordering should retain a dense workspace sequence");

    const nestedRun = techniques.newTechniqueRun(definition);
    state = workspace.workspaceReducer(state, { type: "technique-run/created", run: nestedRun });
    state = workspace.workspaceReducer(state, { type: "technique-run/indented", id: nestedRun.id });
    assert.equal(
      state.techniqueRuns[nestedRun.id].parentRunId,
      run.id,
      "Tab-style indent must move a method beneath its previous sibling",
    );
    state = workspace.workspaceReducer(state, { type: "technique-run/outdented", id: nestedRun.id });
    assert.equal(
      state.techniqueRuns[nestedRun.id].parentRunId ?? null,
      null,
      "Shift+Tab-style outdent must move a nested method back to its grandparent level",
    );

    state = workspace.workspaceReducer(state, { type: "note/permanently-deleted", id: note.id });
    assert.equal(Object.keys(state.notes).length, 1);
    assert.equal(state.notes[secondNote.id].title, "Related note");
    assert.equal(state.links.length, 0, "note deletion must remove source links");
    assert.equal(state.noteLinks.length, 0, "note deletion must remove inbound/outbound note connections");
    assert.deepEqual(selectors.backlinksForNote(state, secondNote.id), [], "deleted notes must not remain in backlinks");
    assert.equal(Object.keys(state.techniqueRuns).length, 3, "workspace techniques must survive note deletion");
    assert.ok(state.techniqueRuns[secondRun.id], "workspace techniques must remain independent of note deletion");
    assert.ok(state.techniqueRuns[nestedRun.id], "nested workspace techniques must remain independent of note deletion");
    state = workspace.workspaceReducer(state, {
      type: "technique-run/response-updated",
      id: secondRun.id,
      stepId: definition.steps[0].id,
      value: "Still independent",
    });
    assert.equal(
      state.techniqueRuns[secondRun.id].responses[definition.steps[0].id],
      "Still independent",
      "workspace techniques must remain editable after unrelated note deletion",
    );
    assert.equal(state.graphView.positions[note.id], undefined, "note deletion must remove persisted graph placement");
    assert.equal(Object.keys(state.annotations).length, 4, "source evidence and analytic frames must survive note deletion");

    state = workspace.workspaceReducer(state, { type: "annotation/deleted", id: annotation.id });
    assert.equal(Object.keys(state.annotations).length, 3);
    state = workspace.workspaceReducer(state, { type: "annotation/deleted", id: highlight.id });
    assert.equal(Object.keys(state.annotations).length, 2);
    state = workspace.workspaceReducer(state, { type: "annotation/deleted", id: firstExcerpt.id });
    assert.equal(Object.keys(state.annotations).length, 1);
    state = workspace.workspaceReducer(state, { type: "annotation/deleted", id: analyticFrame.id });
    assert.equal(Object.keys(state.annotations).length, 0);
    state = workspace.workspaceReducer(state, { type: "viewer-markup/deleted", id: markup.id });
    assert.equal(Object.keys(state.viewerMarkups).length, 0);

    console.log("Catalyst domain tests passed.");
  }
} finally {
  fs.rmSync(outDir, { recursive: true, force: true });
}
