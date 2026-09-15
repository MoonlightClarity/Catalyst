# Catalyst roadmap execution board — 2026-09-13

Status: active execution companion to `PRELIMINARY_PROJECT_ROADMAP_2026-09-13.md`.

## Purpose

Translate the preliminary roadmap into a concrete near-term integration order without replacing `docs/roadmap.md` or reopening settled architecture.

The immediate target is the **Catalyst Functional Baseline**: one coherent build where the ordinary source-to-analysis loop works reliably and is understandable at normal desktop scale.

## P0 — stabilize the integration surface

Do not begin another broad feature wave until the current parallel work is reconciled.

High-collision files currently include:
- `src/App.tsx` — application shell, Reader/Analysis coordination, routing, state wiring;
- `src/styles.css` — accumulated visual experiments and usability overrides;
- `src/features/analysis/WorkingPictureWorkspace.tsx` — camera, interaction, structure, rendering, actions;
- `src/picture/layout.ts` — structural/layout representation under active simplification.

Rule: preserve live concurrent edits and reconcile forward. Do not restore entire backup files merely because one regression appears.
## P0 integration order

1. Freeze broad product expansion long enough to establish a known-good checkpoint.
2. Reconcile structural-node simplification first because later Analysis work depends on that boundary.
3. Reconcile source-first Reader/capture usability changes next.
4. Reconcile typography/color/icon/SVG work only after interaction structure is stable enough to judge it.
5. Reconcile PDF-reader and persistence experiments behind adapters; do not let either force a domain-model migration yet.
6. Run focused tests after each coherent merge slice rather than waiting for one enormous end-of-day validation.
7. Record stale-test expectations separately from genuine runtime regressions.

Minimum checkpoint tests:
- `node scripts/test-map.mjs`;
- `node scripts/test-visual-language.mjs` after its stale UI expectation is deliberately reconciled;
- Reader/highlight/source-return focused tests;
- `npm run build`;
- broader `npm run test` when the focused boundary is green.

P0 exits only when one source state is designated the integration baseline and its known failures are written down.
## P1 — prove the ordinary analyst loop

The acceptance scenario for the Functional Baseline is deliberately simple:

1. Open a source.
2. Read comfortably at normal scale.
3. Select a meaningful passage or region.
4. Save evidence or create a thought without decoding icon-only controls.
5. Preserve source identity/attachment automatically.
6. Place or organize the resulting analytical object with low ceremony.
7. Inspect it without destroying spatial context.
8. Follow it back to the exact source location.
9. Return to the prior analytical neighborhood.
10. Continue working without manual viewport recovery or mode confusion.

This scenario outranks advanced feature breadth during the baseline phase.

Reject the baseline if the user must understand Catalyst's ontology before beginning work, if Reader and Analysis feel like unrelated applications, or if ordinary navigation repeatedly requires pan/zoom repair.
## P2 — shrink the architectural collision zones

After P1 is behaviorally coherent, reduce the size and responsibility of the current hotspots.

Target separations:
- camera/navigation controller from Working Picture rendering;
- transient drag/hover/selection state from persisted placement;
- structural commands from semantic-relation commands;
- portrayal resolution from structural layout;
- Reader annotation records from Reader rendering widgets;
- shell/routing/state coordination from feature-specific UI.

The goal is not refactoring for elegance. The goal is to make later Freeplane-, Thorium-, and Sploder-derived improvements independently replaceable and testable.

## P3 — mature precedent pass

Once the Functional Baseline survives P0-P2:
- Freeplane becomes the default precedent for ordinary structural map operations;
- Thorium becomes the default precedent for Reader/annotation interaction decomposition;
- Sploder remains a precedent for camera/editor responsibility separation, transient previews, and local geometry updates.

Catalyst should diverge only where its analytical model genuinely requires it: provenance, evidence promotion, semantic assertions, uncertainty, methodology, multiple occurrences, and truly parentless free placement.
## Parallel work that is safe during baseline consolidation

Low-collision parallel work may continue when it does not rewrite the same product surfaces:
- research-only persistence/XML viability work;
- curated SVG pruning and asset evaluation outside live integration files;
- license-validation repair;
- native icon/version plumbing;
- documentation and test-contract reconciliation;
- bounded source-backed research triggered by a concrete implementation question.

High-collision work should converge before another wave:
- large `App.tsx` shell rewrites;
- broad `styles.css` restyling passes;
- simultaneous Working Picture interaction rewrites;
- ontology/schema expansion motivated only by UI needs;
- replacing persistence and Reader architecture at the same time.

## Main risks

1. **Parallel-edit drift:** individually good changes can produce an incoherent combined product.
2. **Test-contract drift:** old assertions can pressure the UI back toward rejected designs.
3. **Research recursion:** another comparator sweep can delay proving already-selected interaction patterns.
4. **Architecture-through-CSS:** appended overrides can mask structural UI problems without resolving them.
5. **Premature richness:** advanced analytical semantics can increase cognitive load before the base workflow works.
6. **Persistence conflation:** replacing Tauri, SQLite, serialization format, and domain persistence together would create unnecessary risk.
## Functional Baseline definition of done

The baseline is done when all of the following are true:
- source reading is visually primary and readable;
- capture actions are obvious and preserve traceability;
- Working Picture structure can be created and navigated without diagram-editor friction;
- Inspect, Focus, Open, Back, and Home remain distinguishable in behavior;
- exact source return works for supported source anchors;
- authored placement survives unrelated semantic edits;
- structural branches and semantic relationships remain distinct;
- the main interaction loop passes focused regression tests and production build;
- known limitations are documented instead of hidden behind UI copy;
- runtime review at normal Windows scale confirms the interface is usable without relying on developer familiarity.

## What comes immediately after

Only after this gate should Catalyst deliberately widen again: first complete the Freeplane/Thorium structural baselines, then consolidate portrayal, then make the persistence/runtime decision, and only then resume the deeper analytical feature roadmap.

The baseline is not a feature-complete release. It is the point where future sophistication stops being built on an unstable interaction foundation.

## Live integration status

Use `INTEGRATION_STATUS_MATRIX_2026-09-13.md` as the current Stage 0 merge-readiness board. It records active track state, collision surfaces, integration order, and the Functional Baseline end-to-end gate.

When the matrix and this execution board disagree on immediate merge order, prefer the matrix if it contains newer observed source/test evidence; preserve this board as the higher-level sequence.

## Current Stage 0 status

Stage 0 is currently **blocked on live-tree reconciliation**, not on a new architectural decision. The combined tree failed the latest `test-map`/build snapshot while at least one parallel Reader track was still actively modifying source. Treat current failures as integration evidence first; validate again after active edits settle before assigning ownership or restoring prior code.

## Latest observed Stage 0 status

The earlier live-tree snapshot is superseded by later focused evidence:

- `test-map` is green again on the current structural slice;
- architecture-prototype and domain focused tests have also passed in this integration window;
- the visual-language contract remains unresolved because it passed, then failed again after later Analysis/CSS edits on the `picture-provenance-spine` expectation;
- the production build remains blocked by the unreconciled `ThoriumPdfReader.tsx`, which currently contains duplicated implementation/JSX sections;
- Reader compile integrity is therefore the first stable blocking gate, followed by Analysis visual-contract reconciliation and CSS/source-first consolidation.

Use `STAGE0_RECONCILIATION_CHECKLIST_2026-09-13.md` for the exact repair/validation order and `FUNCTIONAL_BASELINE_MILESTONE_CONTRACT_2026-09-13.md` for the milestone acceptance boundary.
