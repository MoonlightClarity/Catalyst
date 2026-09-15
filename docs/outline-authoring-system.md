# Outline authoring system

Status: **current implemented interaction contract - 2026-09-15**

This document describes the mounted Outline interaction surface. Structural meaning is governed by `outline-ontology-v0.1.md`, ADR 0021, and the current architecture snapshot.

## Product boundary

The Outline is Catalyst's structural authoring surface. The generated Map is a deterministic portrayal of that structure and is not a second structural editor.

Current flow:

```text
Reader / source work
    -> authored thoughts
    -> Outline structure
    -> generated Map portrayal
    -> briefing/report work outside Catalyst
```

Techniques are an independent workspace surface. Formal Assessments and the standalone Evidence workspace are not part of the current Outline contract.

## Structural invariants

1. Parent/child placement and sibling order are authored in the Outline.
2. Generated Map hierarchy must follow the Outline rather than semantic relationships.
3. Reordering, indenting, outdenting, folding, or selecting a thought does not create analytical meaning.
4. Fold/focus state is presentation/session state, not analytical truth.
5. Trash, restore, and permanent deletion must not silently orphan still-live descendants.
6. The Outline must remain usable without the generated Map.
## Current mounted UI

`src/features/analysis/AnalysisOutlineView.tsx` currently renders a compact ordered structural tree beneath the analysis root.

Each thought row supports:

- select;
- double-click rename;
- fold/unfold structural children;
- optional analytical-role and confidence badges when those capabilities are enabled;
- an Actions menu containing Rename, Add child, Add sibling, Move earlier/later, Indent/Outdent, Show on map, and Move to trash.

The Outline does **not** currently render Evidence rows, link/backlink rows, relationship detail, or Technique/method rows beneath thoughts. Techniques belong in the independent Techniques workspace.

The current component no longer declares the old Evidence/method compatibility props. Evidence rows and thought-owned method rows are absent from the mounted Outline rather than merely hidden.

## Keyboard contract

On a thought row:

- `Enter` - add sibling;
- `Insert` - add child;
- `Tab` / `Shift+Tab` - indent / outdent;
- `Alt+Up` / `Alt+Down` - reorder among siblings;
- `F2` - rename;
- `Delete` - move to trash;
- `Up` / `Down` - move structural focus;
- `Left` / `Right` - collapse/expand or move to parent/child;
- `Shift+Left` / `Shift+Right` - collapse/expand the entire branch;
- `Home` / `End` - first/last visible thought;
- `Ctrl+Enter` (or platform equivalent) - show the thought on the generated Map.

Nested controls do not inherit row-level structural shortcuts.
## Map and output boundary

The Analysis shell defaults to Outline view. Map View is a generated portrayal, not a publication or export surface.

Catalyst currently exposes no Outline or Map derived-output export controls. The former Markdown/RTF/SVG/PNG export helpers are not part of the active implementation.

## Persistence and compatibility

The current structural implementation uses first-class Outline state while retaining older Map/note compatibility state around it. `MapOccurrence`, internal `graph` context naming, `WorkingPictureWorkspace`, legacy `noteLinks` are implementation history/compatibility scaffolding unless reaffirmed by a current contract.

Trash retains enough structural information to restore prior placement where possible. Permanent deletion removes the analytical object/placement according to current reducer behavior while preserving surviving structure.

The 0.7 direction remains: analytical identity and Outline placement are distinct; one analytical object may eventually have multiple placements/aliases; GroupItem and QueryItem semantics come from the frozen Outline ontology rather than from legacy Map storage.

## Validation

Focused coverage includes:

- `scripts/test-outline.mjs` - structural order, hierarchy, collapse, keyboard behavior, trash/restore, and projection rules;
- `scripts/test-map.mjs` - generated-Map agreement with authored structure;
- XML/domain tests - persistence and lifecycle behavior.

The current focused Outline and Map model tests pass. The aggregate `npm run check` gate is presently red because `AnalysisOutlineView.tsx` itself is mid-refactor and its current prop/helper declarations do not compile cleanly; see `release-readiness.md`. After the owning implementation thread resolves that inconsistency, rerun appropriate focused tests and the combined gate.

## Forbidden regressions

Do not reintroduce Map structural editing, hierarchy inferred from semantic relationships, standalone Evidence/Assessment surfaces inside the Outline, Techniques as thought-owned Outline metadata, or derived-output export controls.

Related authority: `CURRENT_ARCHITECTURE.md`, `outline-ontology-v0.1.md`, `map-ontology-v0.1.md`, ADR 0021, ADR 0023, and ADR 0026.
