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
  const techniques = nodeRequire(path.join(outDir, "techniques.js"));

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

  const methodA = techniques.newTechniqueRun(techniques.BUILT_IN_TECHNIQUES[0]);
  const methodB = techniques.newTechniqueRun(techniques.BUILT_IN_TECHNIQUES[1]);
  const methodC = techniques.newTechniqueRun(techniques.BUILT_IN_TECHNIQUES[2]);
  state = workspace.workspaceReducer(state, { type: "technique-run/created", run: methodA });
  state = workspace.workspaceReducer(state, { type: "technique-run/created", run: methodB });
  state = workspace.workspaceReducer(state, { type: "technique-run/created", run: methodC });

  const methodSupports = workspace.newRelationship(methodA.id, methodB.id, "supports");
  state = workspace.workspaceReducer(state, {
    type: "method-relationship/created",
    relationship: methodSupports,
  });
  const methodContradicts = workspace.newRelationship(methodA.id, methodB.id, "contradicts");
  state = workspace.workspaceReducer(state, {
    type: "method-relationship/created",
    relationship: methodContradicts,
  });
  assert.equal(Object.keys(state.methodRelationships).length, 2, "methods may carry multiple relation types to the same method");

  const methodDuplicate = workspace.newRelationship(methodB.id, methodA.id, "supports");
  const beforeMethodDuplicate = state;
  state = workspace.workspaceReducer(state, {
    type: "method-relationship/created",
    relationship: methodDuplicate,
  });
  assert.equal(state, beforeMethodDuplicate, "method relationships reject an exact pair+type duplicate");

  state = workspace.workspaceReducer(state, {
    type: "method-relationship/updated",
    id: methodContradicts.id,
    patch: { fromId: methodA.id, toId: methodC.id },
  });
  assert.equal(state.methodRelationships[methodContradicts.id].toId, methodC.id, "method relationship targets can be edited");

  state = workspace.workspaceReducer(state, { type: "technique-run/deleted", id: methodB.id });
  assert.equal(state.methodRelationships[methodSupports.id], undefined, "deleting a method removes relationships attached to it");
  assert.equal(state.methodRelationships[methodContradicts.id].toId, methodC.id, "unrelated method relationships survive deletion");

  const first = workspace.newNote({ title: "Claim A" });
  const second = workspace.newNote({ title: "Evidence B" });
  state = workspace.workspaceReducer(state, { type: "note/created", note: first });
  state = workspace.workspaceReducer(state, { type: "note/created", note: second });

  const outlineToMethod = workspace.newRelationship(first.id, methodA.id, "supports");
  state = workspace.workspaceReducer(state, {
    type: "cross-relationship/created",
    relationship: outlineToMethod,
  });
  assert.equal(
    state.crossRelationships[outlineToMethod.id].toId,
    methodA.id,
    "Outline items may relate directly to methods",
  );

  const reverseCrossDuplicate = workspace.newRelationship(methodA.id, first.id, "supports");
  const beforeCrossDuplicate = state;
  state = workspace.workspaceReducer(state, {
    type: "cross-relationship/created",
    relationship: reverseCrossDuplicate,
  });
  assert.equal(state, beforeCrossDuplicate, "cross relationships reject an exact pair+type duplicate");

  state = workspace.workspaceReducer(state, {
    type: "relationship/retargeted",
    scope: "cross",
    id: outlineToMethod.id,
    fromId: first.id,
    toId: methodC.id,
  });
  assert.equal(
    state.crossRelationships[outlineToMethod.id].toId,
    methodC.id,
    "cross relationship targets may move between methods",
  );

  state = workspace.workspaceReducer(state, {
    type: "relationship/retargeted",
    scope: "cross",
    id: outlineToMethod.id,
    fromId: first.id,
    toId: second.id,
  });
  assert.equal(state.crossRelationships[outlineToMethod.id], undefined, "retargeting to Outline migrates out of cross storage");
  assert.equal(state.relationships[outlineToMethod.id]?.toId, second.id, "retargeting preserves the same relationship in Outline storage");
  state = workspace.workspaceReducer(state, { type: "relationship/deleted", id: outlineToMethod.id });

  const methodToOutline = workspace.newRelationship(methodA.id, first.id, "depends-on");
  state = workspace.workspaceReducer(state, {
    type: "cross-relationship/created",
    relationship: methodToOutline,
  });
  assert.equal(
    state.crossRelationships[methodToOutline.id].fromId,
    methodA.id,
    "methods may relate directly to Outline items",
  );
  state = workspace.workspaceReducer(state, { type: "cross-relationship/deleted", id: methodToOutline.id });

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

  const contradicts = workspace.newRelationship(second.id, first.id, "contradicts");
  state = workspace.workspaceReducer(state, {
    type: "relationship/created",
    relationship: contradicts,
  });
  assert.equal(Object.keys(state.relationships).length, 2, "one node pair may carry multiple different relationship types");
  assert.equal(state.noteLinks.length, 1, "multiple typed relationships share one legacy pair mirror");
  assert.equal(selectors.connectionCountForNote(state, first.id), 1, "two relationship types to one node still represent one connected counterpart");
  assert.equal(selectors.connectionsForNote(state, first.id).length, 2, "both typed relationships must remain individually visible");

  const exactDuplicate = workspace.newRelationship(second.id, first.id, "supports");
  const beforeExactDuplicate = state;
  state = workspace.workspaceReducer(state, {
    type: "relationship/created",
    relationship: exactDuplicate,
  });
  assert.equal(state, beforeExactDuplicate, "the same relationship type may appear only once per node pair");

  const beforeTypeCollision = state;
  state = workspace.workspaceReducer(state, {
    type: "relationship/updated",
    id: relationship.id,
    patch: { type: "contradicts" },
  });
  assert.equal(state, beforeTypeCollision, "changing a relationship must not duplicate an existing type for the pair");

  state = workspace.workspaceReducer(state, {
    type: "relationship/updated",
    id: relationship.id,
    patch: { type: "derived-from" },
  });
  assert.equal(state.relationships[relationship.id].type, "derived-from");
  assert.equal(state.relationships[relationship.id].directed, true);

  state = workspace.workspaceReducer(state, {
    type: "relationship/updated",
    id: relationship.id,
    patch: { directed: false, label: "tension" },
  });
  assert.equal(state.relationships[relationship.id].directed, false);
  assert.equal(state.relationships[relationship.id].label, "tension");

  state = workspace.workspaceReducer(state, { type: "relationship/deleted", id: contradicts.id });
  assert.equal(Object.keys(state.relationships).length, 1);
  assert.equal(state.noteLinks.length, 1, "deleting one typed relationship must preserve the pair mirror while another remains");

  const third = workspace.newNote({ title: "Context C" });
  state = workspace.workspaceReducer(state, { type: "note/created", note: third });
  state = workspace.workspaceReducer(state, {
    type: "relationship/updated",
    id: relationship.id,
    patch: { toId: third.id },
  });
  assert.equal(state.relationships[relationship.id].toId, third.id, "an existing relationship target must be editable");
  assert.equal(state.noteLinks.length, 1, "retargeting must move the compatibility mirror rather than duplicate it");
  assert.equal(state.noteLinks[0].toNoteId, third.id, "the compatibility mirror must follow the edited relationship target");

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

  const mixed = analysis.hydrateRelationships(
    { [relationship.id]: relationship },
    { [first.id]: first, [second.id]: second, [third.id]: third },
    [
      { fromNoteId: first.id, toNoteId: second.id, createdAt: "2026-01-01T00:00:00.000Z" },
      { fromNoteId: second.id, toNoteId: third.id, createdAt: "2026-01-03T00:00:00.000Z" },
    ],
  );
  assert.equal(Object.keys(mixed).length, 2, "mixed modern/legacy workspaces must preserve unmirrored legacy connections");

  const cleanupCross = workspace.newRelationship(first.id, methodA.id, "about");
  state = workspace.workspaceReducer(state, {
    type: "cross-relationship/created",
    relationship: cleanupCross,
  });
  state = workspace.workspaceReducer(state, { type: "note/permanently-deleted", id: first.id });
  assert.equal(state.crossRelationships[cleanupCross.id], undefined, "deleting an Outline endpoint removes its cross-surface relationships");
  assert.equal(state.noteSemantics[first.id], undefined);
  assert.equal(state.relationships[relationship.id], undefined);
  assert.equal(state.noteLinks.length, 0);
  assert.deepEqual(selectors.connectionsForNote(state, second.id), [], "deleted notes must disappear from analytical connections");

  const methodCleanupCross = workspace.newRelationship(methodC.id, third.id, "about");
  state = workspace.workspaceReducer(state, {
    type: "cross-relationship/created",
    relationship: methodCleanupCross,
  });
  state = workspace.workspaceReducer(state, { type: "technique-run/deleted", id: methodC.id });
  assert.equal(
    state.crossRelationships[methodCleanupCross.id],
    undefined,
    "deleting a Method endpoint removes its cross-surface relationships",
  );

  console.log("Catalyst capability/analytical-model tests passed.");
} finally {
  fs.rmSync(outDir, { recursive: true, force: true });
}
