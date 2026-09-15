import assert from "node:assert/strict";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { createRequire } from "node:module";
import { catalystTestCompilerOptions } from "./test-compiler.mjs";

const nodeRequire = createRequire(import.meta.url);
const ts = nodeRequire("@typescript/typescript6");
const root = process.cwd();
const outDir = fs.mkdtempSync(path.join(os.tmpdir(), "catalyst-outline-"));
const outlineViewSource = fs.readFileSync(path.join(root, "src/features/analysis/AnalysisOutlineView.tsx"), "utf8");
const note = (id, day) => ({
  id, title: id, body: "",
  createdAt: `2026-01-${String(day).padStart(2, "0")}T00:00:00.000Z`,
  updatedAt: `2026-01-${String(day).padStart(2, "0")}T00:00:00.000Z`,
});

try {
  const program = ts.createProgram({
    rootNames: [
      path.join(root, "src/domain/types.ts"),
      path.join(root, "src/domain/workspace.ts"),
      path.join(root, "src/features/analysis/outlineModel.ts"),
    ],
    options: catalystTestCompilerOptions(ts, outDir),
  });  const emit = program.emit();
  const diagnostics = ts.getPreEmitDiagnostics(program)
    .concat(emit.diagnostics)
    .filter((item) => item.category === ts.DiagnosticCategory.Error);
  assert.equal(
    diagnostics.length,
    0,
    diagnostics.map((item) => ts.flattenDiagnosticMessageText(item.messageText, "\n")).join("\n"),
  );

  const workspace = nodeRequire(path.join(outDir, "domain", "workspace.js"));
  const outlineDomain = nodeRequire(path.join(outDir, "domain", "outline.js"));
  const outline = nodeRequire(path.join(outDir, "features", "analysis", "outlineModel.js"));

  const place = (currentState, noteId, parentPlacementId = null, placementId = noteId) => {
    const parentItemId = parentPlacementId ?? currentState.outline.rootItemId;
    const placement = outlineDomain.newOutlineReference(currentState.outline, noteId, parentItemId, placementId);
    return workspace.workspaceReducer(currentState, { type: "outline/reference-created", placement });
  };

  let state = workspace.initialWorkspaceState;
  for (const item of [note("root", 1), note("child", 2), note("grand", 3), note("sibling", 4)]) {
    state = workspace.workspaceReducer(state, { type: "note/created", note: item });
  }
  state = place(state, "root");
  state = place(state, "child", "root");
  state = place(state, "grand", "child");
  state = place(state, "sibling", "root");

  let rows = outline.outlineRows(state);
  assert.deepEqual(rows.map((row) => [row.noteId, row.depth]), [
    ["root", 0], ["child", 1], ["grand", 2], ["sibling", 1],
  ]);
  assert.equal(rows.find((row) => row.noteId === "root").childCount, 2);
  assert.equal(rows.find((row) => row.noteId === "child").childCount, 1);
  assert.deepEqual(
    outline.outlineBranchPlacementIds(state, "root"),
    ["root", "child", "grand", "sibling"],
    "branch operations must include the complete outline subtree in placement order",
  );
  assert.deepEqual(outline.outlineBranchPlacementIds(state, "grand"), ["grand"]);
  assert.deepEqual(outline.outlineBranchPlacementIds(state, "missing"), []);
  assert.equal(
    outline.outlineFallbackAfterRemoval(rows, "child"),
    "sibling",
    "removing a branch must select the next visible note outside that branch",
  );
  assert.equal(
    outline.outlineFallbackAfterRemoval(rows, "root"),
    null,
    "removing the only root must not select one of its hidden descendants",
  );
  state = workspace.workspaceReducer(state, { type: "outline/collapse-set", placementId: "child", collapsed: true });
  rows = outline.outlineRows(state);
  assert.deepEqual(rows.map((row) => row.noteId), ["root", "child", "sibling"]);
  assert.equal(rows.find((row) => row.noteId === "child").collapsed, true);

  const searchRows = outline.outlineRows(state, new Set(["grand"]));
  assert.deepEqual(
    searchRows.map((row) => row.noteId),
    ["root", "child", "grand", "sibling"],
    "search must reveal a matching descendant through collapsed ancestors",
  );
  const searchChild = searchRows.find((row) => row.noteId === "child");
  assert.equal(searchChild.collapsed, false, "search projection must expose the matching path");
  assert.equal(searchChild.searchExpanded, true, "temporary search expansion must be distinguishable from persisted expansion");
  assert.equal(
    state.outlineSession.collapsedItemIds.includes("child"),
    true,
    "search projection must not mutate the analyst's saved collapse state",
  );
  const unrelatedSearchRows = outline.outlineRows(state, new Set(["sibling"]));
  assert.deepEqual(
    unrelatedSearchRows.map((row) => row.noteId),
    ["root", "child", "sibling"],
    "search must not expand collapsed branches that do not lead to a match",
  );
  const collapsedMatchRows = outline.outlineRows(state, new Set(["child"]));
  assert.deepEqual(
    collapsedMatchRows.map((row) => row.noteId),
    ["root", "child", "sibling"],
    "a collapsed matching note must remain collapsed when no matching descendant requires expansion",
  );
  assert.equal(collapsedMatchRows.find((row) => row.noteId === "child").searchExpanded, false);

  const visible = new Set(rows.map((row) => row.placementId));
  assert.equal(
    outline.nearestVisiblePlacementForNote(state, visible, "grand"),
    "child",
    "hidden descendants must resolve keyboard focus to their nearest visible ancestor",
  );
  assert.equal(outline.nearestVisiblePlacementForNote(state, visible, "sibling"), "sibling");
  assert.equal(outline.nearestVisiblePlacementForNote(state, visible, null), null);

  state = workspace.workspaceReducer(state, { type: "note/permanently-deleted", id: "sibling" });
  rows = outline.outlineRows(state);
  assert.deepEqual(
    rows.map((row) => row.noteId),
    ["root", "child"],
    "deleted notes must not remain visible in the outline model",
  );

  state = workspace.workspaceReducer(state, { type: "note/created", note: note("inserted", 5) });
  state = place(state, "inserted", "root");
  state = workspace.workspaceReducer(state, { type: "outline/item-reordered", placementId: "inserted", targetPlacementId: "child", placement: "after" });
  rows = outline.outlineRows(state);
  assert.deepEqual(
    rows.map((row) => row.noteId),
    ["root", "child", "inserted"],
    "a newly created sibling must be placeable immediately after the current note",
  );

  const navigationRows = outline.outlineRows(state, new Set(["child", "inserted"]));
  const navigationMatches = new Set(["child", "inserted"]);
  assert.equal(outline.outlineMatchTarget(navigationRows, navigationMatches, "root", "next"), "child");
  assert.equal(outline.outlineMatchTarget(navigationRows, navigationMatches, "root", "previous"), "inserted");
  assert.equal(outline.outlineMatchTarget(navigationRows, navigationMatches, "child", "next"), "inserted");
  assert.equal(outline.outlineMatchTarget(navigationRows, navigationMatches, "inserted", "next"), "child", "next-match navigation must wrap");
  assert.equal(outline.outlineMatchTarget(navigationRows, navigationMatches, "child", "previous"), "inserted", "previous-match navigation must wrap");
  assert.equal(outline.outlineMatchTarget(navigationRows, new Set(), "child", "next"), null);

  let structuralState = workspace.initialWorkspaceState;
  for (const item of [note("struct-root", 10), note("struct-parent", 11), note("struct-leaf", 12), note("struct-after", 13)]) {
    structuralState = workspace.workspaceReducer(structuralState, { type: "note/created", note: item });
  }
  structuralState = place(structuralState, "struct-root");
  structuralState = place(structuralState, "struct-parent", "struct-root");
  structuralState = place(structuralState, "struct-leaf", "struct-parent");
  structuralState = place(structuralState, "struct-after", "struct-root");

  structuralState = workspace.workspaceReducer(structuralState, { type: "note/permanently-deleted", id: "struct-parent" });
  const structuralRows = outline.outlineRows(structuralState);
  assert.deepEqual(
    structuralRows.map((row) => [row.noteId, row.depth]),
    [["struct-root", 0], ["struct-leaf", 1], ["struct-after", 1]],
    "deletion must reconnect surviving descendants instead of orphaning them",
  );
  assert.equal(
    outlineDomain.outlineReferenceItemsForItem(structuralState.outline, "struct-leaf")[0]?.parentItemId,
    "struct-root",
    "deletion must persist the nearest surviving outline parent",
  );

  let invariantState = workspace.initialWorkspaceState;
  for (const item of [note("move-a", 20), note("move-b", 21), note("move-c", 22)]) {
    invariantState = workspace.workspaceReducer(invariantState, { type: "note/created", note: item });
  }
  invariantState = place(invariantState, "move-a");
  invariantState = place(invariantState, "move-b", "move-a");
  invariantState = place(invariantState, "move-c");
  invariantState = workspace.workspaceReducer(invariantState, { type: "relationship/created", relationship: workspace.newRelationship("move-b", "move-c", "supports") });
  invariantState = workspace.workspaceReducer(invariantState, { type: "note-semantics/updated", id: "move-b", patch: { roles: ["claim"], confidence: "high" } });
  const relationshipSnapshot = JSON.stringify(invariantState.relationships);
  const noteLinkSnapshot = JSON.stringify(invariantState.noteLinks);
  const semanticsSnapshot = JSON.stringify(invariantState.noteSemantics);

  invariantState = workspace.workspaceReducer(invariantState, { type: "outline/item-outdented", placementId: "move-b" });
  assert.equal(
    invariantState.outline.items["move-b"]?.parentItemId,
    invariantState.outline.rootItemId,
    "outdent must move a nested outline row to its grandparent level",
  );
  invariantState = workspace.workspaceReducer(invariantState, { type: "outline/item-indented", placementId: "move-b" });
  assert.equal(
    invariantState.outline.items["move-b"]?.parentItemId,
    "move-a",
    "indent must restore the row beneath its previous sibling",
  );
  invariantState = workspace.workspaceReducer(invariantState, { type: "outline/item-reordered", placementId: "move-c", targetPlacementId: "move-a", placement: "before" });
  assert.equal(JSON.stringify(invariantState.relationships), relationshipSnapshot, "structural movement must not mutate analytical relationships");
  assert.equal(JSON.stringify(invariantState.noteLinks), noteLinkSnapshot, "structural movement must not mutate compatibility links");
  assert.equal(JSON.stringify(invariantState.noteSemantics), semanticsSnapshot, "structural movement must not mutate analytical roles or confidence");

  assert.equal(
    outline.outlineShouldHandleRowShortcut({ editable: false, interactiveControl: false, shortcutSurface: false }),
    true,
    "focused outline rows must retain structural keyboard shortcuts",
  );
  assert.equal(
    outline.outlineShouldHandleRowShortcut({ editable: false, interactiveControl: true, shortcutSurface: false }),
    false,
    "nested action buttons must not bubble into structural row shortcuts",
  );
  assert.equal(
    outline.outlineShouldHandleRowShortcut({ editable: false, interactiveControl: true, shortcutSurface: true }),
    true,
    "note/master title surfaces intentionally retain outline shortcuts",
  );
  assert.equal(
    outline.outlineShouldHandleRowShortcut({ editable: true, interactiveControl: true, shortcutSurface: true }),
    false,
    "active editors must own their keyboard input",
  );

  assert.match(outlineViewSource, /onKeyDown=\{handleOutlineKeyDown\}/, "Outline structural keyboard commands should stay on the normal bubbling surface so child controls retain their own handlers");
  assert.match(outlineViewSource, /onOutdentOutlineItem/, "outline hierarchy authoring should retain neutral outdent behavior");
  assert.match(outlineViewSource, /onIndentOutlineItem/, "outline hierarchy authoring should retain neutral indent behavior");
  assert.match(outlineViewSource, /deleteOutlineNote/, "Backspace deletion must explicitly delete the underlying note");
  assert.doesNotMatch(outlineViewSource, /trashOutlineNote/, "retired trash terminology must not return to Outline deletion");
  assert.doesNotMatch(
    outlineViewSource,
    /onPromoteOutlineItem|onDemoteOutlineItem|promoteAndRefocus|demoteAndRefocus|name="promote"|name="demote"/,
    "outline structure must not imply rank or priority through promote/demote language",
  );

  console.log("Catalyst outline model tests passed.");
} finally {
  fs.rmSync(outDir, { recursive: true, force: true });
}

