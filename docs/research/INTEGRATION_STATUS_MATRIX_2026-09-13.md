# Catalyst integration status matrix — 2026-09-13

Status: live Stage 0 planning artifact. This records integration readiness, not ownership of parallel chats.

## Integration rule

The Functional Baseline is the merge target. A track is not accepted because code exists or a local experiment looked promising; it is accepted when its intended behavior survives the relevant focused test/build/runtime gate without restoring stale behavior from another track.

Use four states:
- **MERGE CANDIDATE** — coherent implementation exists and focused validation is known.
- **NEEDS RECONCILIATION** — useful work exists but overlaps active edits or has stale-test/runtime uncertainty.
- **RESEARCH / EXPERIMENT** — informative but must not silently become production architecture.
- **DEFER** — valid work, but not needed for the Functional Baseline gate.

## Current integration matrix

| Track | State | Primary surface/files | Current evidence | Next integration gate |
| --- | --- | --- | --- | --- |
| Working Picture node simplification | MERGE CANDIDATE | `src/picture/layout.ts`, `WorkingPictureWorkspace.tsx` | Prior handoff reports `test-map` + production build passing after simplification | Re-read live refs, preserve concurrent UI actions, rerun map/build |
| Analysis camera/geometry/drag extraction | MERGE CANDIDATE | `src/picture/camera.ts`, `geometry.ts`, `drag.ts` | Files now exist as dedicated boundaries; Sploder pass supports this split | Confirm workspace delegates behavior without semantic changes |
| Freeplane structural grammar | NEEDS RECONCILIATION | Analysis workspace, map tests/layout | Multiple same-day Freeplane backups and active structure edits | Stabilize node core first; then verify child/sibling/fold/reorder/promote/demote separately |
| Source-first usability reset | NEEDS RECONCILIATION | `src/styles.css`, selection/capture UI, Reader/Analysis balance | Handoff says changes are candidate-only and require screenshot acceptance | Native/runtime visual pass at normal scale; prove source remains primary |
| Color / typography audit | NEEDS RECONCILIATION | `src/styles.css`, Analysis workspace, app shell | Same-day backup generations show active overlap | Consolidate into one readable baseline after source-first layout is accepted |
| Semantic relationship + confidence portrayal | NEEDS RECONCILIATION | Analysis workspace / CSS | Prior audit found confidence absent and relationship styling visually flattened | Integrate only after node core and base relationship rendering stabilize |
| Thorium-style Reader replacement/refactor | NEEDS RECONCILIATION | `src/viewer/ThoriumPdfReader.tsx`, annotation/navigation helpers | Reader reference direction is clear; implementation track is active | Prove open/select/annotate/exact-return without breaking existing evidence anchors |
| XML persistence experiment | RESEARCH / EXPERIMENT | `src/persistence/xml.ts`, `xmlRepository.ts`, persistence tests | XML implementation exists alongside browser/memory/SQLite repositories | Compare capability/resilience; do not conflate persistence choice with Tauri removal |
| Portrayal Lab / resolver architecture | MERGE CANDIDATE infrastructure; DEFER broad product expansion | `src/portrayal/**` | Catalog/context/resolver/primitives/testing structure exists and prior lab work was validated | Preserve as infrastructure; integrate only portrayal needed by Functional Baseline |
| SVG pruning / asset curation | NEEDS RECONCILIATION | `public/generated`, asset libraries, prune backups | Heavy exploratory generation followed by pruning tracks | Admit only assets with defined UI/portrayal role and small-size readability |
| Native app icon / branding | NEEDS RECONCILIATION | `app-icon.*`, `public`, Tauri icons/config | New Catalyst assets exist; prior runtime still showed boxed `E` in some paths | Verify actual Windows dev/taskbar/bundle icon end to end |
| Expanded analytic techniques | DEFER product expansion | techniques/method surfaces | Useful library expansion underway | Keep data/content; do not make it a Functional Baseline blocker |
| License validation repair | MERGE CANDIDATE if isolated | `licenses.ps1`, `scripts/check-licenses.mjs` | Known failure mode is audit execution vs prohibited-license distinction | Fix semantics and validate independently of UI integration |
| Persistence/continuity research | RESEARCH / EXPERIMENT | research docs / future workbench substrate | Strong research basis for resumable bounded work | Keep separate from ordinary analyst Functional Baseline |

## Highest-collision files

The present integration hazard is concentrated rather than repository-wide.

- `src/features/analysis/WorkingPictureWorkspace.tsx` has many same-day backup generations from node, Freeplane, focus, iconography, confidence, fit/inspector, color/type, and attention work.
- `src/styles.css` is a broad shared surface for source-first, color/type, iconography, attention, confidence/relations, shell, and readability work.
- `src/App.tsx` remains a large application-shell collision point and is implicated in at least one stale visual-language test expectation.

Rule: no track should restore one of these files wholesale from a backup. Reconcile behavior surgically against the current file.
## Recommended Stage 0 order

1. Freeze new broad Analysis rewrites long enough to reconcile the node-core + camera/geometry/drag extraction.
2. Reconcile Freeplane structural commands against that simplified core.
3. Run `test-map` + production build and isolate stale assertions rather than restoring removed UI.
4. Reconcile source-first layout/capture/readability work on top of the stable Analysis core.
5. Consolidate color/typography and relationship/confidence portrayal after the source-first layout is visually accepted.
6. Validate Reader exact-return behavior and Thorium-derived boundaries independently, then test the complete source-to-analysis loop.
7. Curate visual assets and native branding only after the interaction surfaces they decorate are stable.
8. Keep XML persistence, continuity research, and advanced analytical expansion outside the Functional Baseline critical path unless they expose a blocking defect.

## Functional Baseline integration gates

A coherent Stage 0/1 checkpoint should prove all of the following in one build:

- open a source;
- select source material;
- create/save evidence or a thought without losing provenance;
- place or organize the resulting analytical object;
- create a structural child/sibling without changing semantic relationships;
- move an occurrence without changing structure or semantics;
- inspect without destroying analytical geography;
- focus and return Home/Back reliably;
- open the source again at the exact anchored location;
- restart/reload without losing the accepted persisted state.

Only after this loop is stable should Catalyst widen the product surface again.

## Matrix maintenance rule

When a parallel track finishes, update its row with: files touched, test/build result, runtime acceptance result, unresolved overlap, and whether it is safe to merge. Do not infer merge readiness from chat completion alone.

## Live validation snapshot — 2026-09-13

A validation pass against the live shared tree changed earlier readiness assumptions:

- `node scripts/test-map.mjs` currently fails during its TypeScript contract check with `string | null` not assignable to `string`.
- `npm run build` currently fails in `src/viewer/ThoriumPdfReader.tsx` with a syntax error (`'}' expected`).
- While the Reader file was being inspected, its reported line count changed from 376 to 437, indicating another parallel track was actively editing the file during this integration audit.

Therefore the repository is presently an **active integration workspace, not a known-good baseline**. Earlier passing handoffs remain evidence about individual slices but must not be treated as proof that the current combined tree passes.

Immediate status corrections:
- Working Picture node simplification: **NEEDS RECONCILIATION in the combined tree** despite an earlier locally passing handoff.
- Thorium Reader track: **ACTIVE / NOT READY FOR INTEGRATION VALIDATION** while edits are still landing.
- Stage 0 exit gate: **BLOCKED** until the tree stops changing long enough to run a coherent focused validation pass.

Do not fix transient mid-edit failures by restoring backups from another track. Revalidate after the active editor finishes, then repair only failures that remain in the settled combined tree.

## Reconciliation update — later 2026-09-13

Focused validation improved the Analysis picture but confirmed the shared tree is still moving:

- `test-map` passed again in the live tree after the current structural edits.
- `test-architecture-prototype` and `test-domain` also passed during this integration window.
- `test-visual-language` passed once, then failed after later Analysis/CSS edits because the expected `picture-provenance-spine` marker was no longer present. Treat this as an unresolved contract question, not yet as proof of either a bug or a stale test.
- Full npm+cargo license audit passed. `@embedpdf/plugin-form@2.15.0` reports UNKNOWN in package metadata, but its installed `LICENSE` file is MIT.
- `ThoriumPdfReader.tsx` is now a stable compile blocker until reconciled: inspection shows duplicate `selectionScope`, `documentManager`, registry/return sections, duplicate JSX render trees, and duplicate `ThoriumPdfReader.displayName` assignments.

The concrete execution order is now recorded in `STAGE0_RECONCILIATION_CHECKLIST_2026-09-13.md`. Reader compile integrity is the first blocking merge gate; Analysis contract reconciliation and CSS/source-first consolidation follow it.
