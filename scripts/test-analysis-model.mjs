import assert from "node:assert/strict";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { createRequire } from "node:module";
import { catalystTestCompilerOptions } from "./test-compiler.mjs";

const nodeRequire = createRequire(import.meta.url);
const ts = nodeRequire("@typescript/typescript6");
const root = process.cwd();
const outDir = fs.mkdtempSync(path.join(os.tmpdir(), "catalyst-analysis-model-"));

try {
  const program = ts.createProgram({
    rootNames: [
      path.join(root, "src/domain/types.ts"),
      path.join(root, "src/domain/graphView.ts"),
      path.join(root, "src/domain/capabilities.ts"),
      path.join(root, "src/domain/analysis.ts"),
      path.join(root, "src/domain/workspace.ts"),
      path.join(root, "src/domain/selectors.ts"),
      path.join(root, "src/domain/techniques.ts"),
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

  const workspace = nodeRequire(path.join(outDir, "workspace.js"));
  const analysis = nodeRequire(path.join(outDir, "analysis.js"));
  const capabilities = nodeRequire(path.join(outDir, "capabilities.js"));
  const selectors = nodeRequire(path.join(outDir, "selectors.js"));

  let state = workspace.initialWorkspaceState;
  assert.equal(state.capabilities.profile, "research");
  assert.equal(
    capabilities.capabilityEnabled(state.capabilities, "methods"),
    true,
    "Research profile must expose structured analytic techniques by default",
  );

  state = workspace.workspaceReducer(state, {
    type: "capability/profile-set",
    profile: "analytical",
  });
  assert.equal(capabilities.capabilityEnabled(state.capabilities, "methods"), true);

  state = workspace.workspaceReducer(state, {
    type: "capability/override-set",
    capability: "confidence",
    enabled: false,
  });
  assert.equal(capabilities.capabilityEnabled(state.capabilities, "confidence"), false);

  state = workspace.workspaceReducer(state, {
    type: "capability/profile-set",
    profile: "full",
  });
  assert.deepEqual(state.capabilities.overrides, {}, "changing profile must clear local overrides");

  const first = workspace.newNote({ title: "Claim A" });
  const second = workspace.newNote({ title: "Evidence B" });
  state = workspace.workspaceReducer(state, { type: "note/created", note: first });
  state = workspace.workspaceReducer(state, { type: "note/created", note: second });

  state = workspace.workspaceReducer(state, {
    type: "note-semantics/updated",
    id: first.id,
    patch: { roles: ["claim"], confidence: "medium" },
  });
  assert.deepEqual(state.noteSemantics[first.id], {
    roles: ["claim"],
    confidence: "medium",
  });

  const relationship = workspace.newRelationship(first.id, second.id, "supports");
  state = workspace.workspaceReducer(state, {
    type: "relationship/created",
    relationship,
  });
  assert.equal(Object.keys(state.relationships).length, 1);
  assert.equal(state.noteLinks.length, 1, "relationship must mirror to legacy note_links");
  assert.equal(selectors.connectionCountForNote(state, first.id), 1);
  assert.equal(selectors.connectionsForNote(state, first.id)[0].relationship.type, "supports");
  assert.deepEqual(selectors.unmirroredLinkedNotesFromNote(state, first.id), [], "relationship mirrors must not surface as separate legacy links");
  assert.deepEqual(selectors.unmirroredBacklinksForNote(state, second.id), [], "relationship mirrors must not surface as separate legacy backlinks");

  const duplicate = workspace.newRelationship(second.id, first.id, "contradicts");
  const beforeDuplicate = state;
  state = workspace.workspaceReducer(state, {
    type: "relationship/created",
    relationship: duplicate,
  });
  assert.equal(state, beforeDuplicate, "alpha permits only one relationship object per node pair");

  state = workspace.workspaceReducer(state, {
    type: "relationship/updated",
    id: relationship.id,
    patch: { type: "contradicts" },
  });
  assert.equal(state.relationships[relationship.id].type, "contradicts");
  assert.equal(state.relationships[relationship.id].directed, true);

  state = workspace.workspaceReducer(state, {
    type: "relationship/updated",
    id: relationship.id,
    patch: { directed: false, label: "tension" },
  });
  assert.equal(state.relationships[relationship.id].directed, false);
  assert.equal(state.relationships[relationship.id].label, "tension");

  const legacy = analysis.hydrateRelationships(
    null,
    { [first.id]: first, [second.id]: second },
    [
      { fromNoteId: first.id, toNoteId: second.id, createdAt: "2026-01-01T00:00:00.000Z" },
      { fromNoteId: second.id, toNoteId: first.id, createdAt: "2026-01-02T00:00:00.000Z" },
    ],
  );
  assert.equal(Object.keys(legacy).length, 1, "legacy reverse rows must migrate to one relationship");
  assert.equal(Object.values(legacy)[0].type, "related-to");
  assert.equal(Object.values(legacy)[0].directed, false);

  const third = workspace.newNote({ title: "Context C" });
  const mixed = analysis.hydrateRelationships(
    { [relationship.id]: relationship },
    { [first.id]: first, [second.id]: second, [third.id]: third },
    [
      { fromNoteId: first.id, toNoteId: second.id, createdAt: "2026-01-01T00:00:00.000Z" },
      { fromNoteId: second.id, toNoteId: third.id, createdAt: "2026-01-03T00:00:00.000Z" },
    ],
  );
  assert.equal(Object.keys(mixed).length, 2, "mixed modern/legacy workspaces must preserve unmirrored legacy connections");

  state = workspace.workspaceReducer(state, { type: "note/permanently-deleted", id: first.id });
  assert.equal(state.noteSemantics[first.id], undefined);
  assert.equal(state.relationships[relationship.id], undefined);
  assert.equal(state.noteLinks.length, 0);
  assert.deepEqual(selectors.connectionsForNote(state, second.id), [], "deleted notes must disappear from analytical connections");

  console.log("Catalyst capability/analytical-model tests passed.");
} finally {
  fs.rmSync(outDir, { recursive: true, force: true });
}
