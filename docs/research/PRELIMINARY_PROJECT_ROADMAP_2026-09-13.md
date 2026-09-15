# Catalyst preliminary project roadmap — 2026-09-13

Status: current planning snapshot, not a replacement for `docs/roadmap.md`.

## Executive position

Catalyst is at the end of broad architectural exploration and the beginning of product consolidation.

The repository still identifies as `0.6.3-alpha.3`, but active source work is ahead of that version label. The strongest architectural questions are now substantially answered; the principal remaining uncertainty is whether the complete ordinary analyst workflow is usable, coherent, and stable.

The immediate objective should therefore not be another large architecture increment. It should be a **Catalyst Functional Baseline**: the first coherent build in which the source-to-analysis loop simply works.

## Durable product loop

The intended analyst-facing flow is:

`source -> capture/evidence -> analytical object -> structural organization -> semantic reasoning -> assessment/product`

The internal substrate may remain graph-like, but the user should not have to experience Catalyst as a graph database or generic diagram editor.

The critical separation to preserve is:

`identity != placement != structure != semantics != provenance != portrayal != interaction state`

Recent node-simplification work is moving the implementation toward this rule.
## Current maturity assessment

| Area | Assessment |
| --- | --- |
| Product identity | Strongly defined |
| Local-first/offline architecture | Settled |
| Analytical substrate | Settled enough for implementation |
| Structure vs semantic relationships | Strongly settled |
| Spatial placement semantics | Settled |
| Working Picture concept | Settled conceptually; usability still being proven |
| Source/evidence distinction | Strong research foundation; implementation incomplete |
| Navigation grammar | Defined; runtime refinement ongoing |
| Portrayal system | Lab/research substantially developed; integration incomplete |
| Reader architecture | Direction clear: Thorium is the primary interaction reference |
| Analysis structure | Direction clear: Freeplane is the primary structural interaction reference |
| Editor mechanics | Improving through Sploder-derived camera/geometry responsibility separation |
| Documentation/research | Mature enough that implementation now lags understanding |

## Current product problem

The main question is no longer "What should Catalyst be?"

It is whether an analyst can open a source, read it, select material, capture evidence or create a thought, organize it, move into a Working Picture, inspect it, and return exactly to source without fighting the interface.

Alpha.3 did not satisfy that standard. Sparse presentation still required too much interpretation; symbols were under-recognizable, typography became too small in places, source material was too detached from synthesis, and inspection consumed too much analytical space.

The current source-first/usability work is therefore the correct near-term priority.
## Preliminary execution roadmap

### Stage 0 — Integration checkpoint

Reconcile active parallel edits without restoring stale snapshots. Establish one known-good source baseline and distinguish genuine regressions from stale test expectations.

Exit gate: `test-map`, production build, and relevant focused tests pass; unrelated concurrent failures are documented rather than hidden.

### Stage 1 — Functional baseline / source-first workflow

Make the ordinary loop obvious: read -> select -> capture -> evidence/thought -> analysis -> exact source return. Finish the readability reset, simplify capture actions, reduce unnecessary inspector/chrome pressure, and validate at normal Windows working scale.

Exit gate: a new user can complete the loop without needing an explanation of Catalyst's internal concepts.

### Stage 2 — Simplify the Analysis core

Finish reducing Working Picture layout nodes toward identity plus minimal structural/layout state. Extract camera, geometry, drag/interaction, structure, and portrayal responsibilities from the large Analysis workspace component.

Exit gate: presentation and semantic payload no longer leak into the structural node core, and transient interaction state is not accidentally persisted.

### Stage 3 — Freeplane structural baseline

Use mature Freeplane interaction grammar for child/sibling creation, fold/unfold, deterministic sibling order, move earlier/later, promote/demote, branch organization, focus, back/home, fit, and local reflow.

Exit gate: basic mind-map behavior feels mature before Catalyst-specific analytical complexity is layered onto it.
### Stage 4 — Thorium reader/annotation baseline

Refactor Reader interaction around stable annotation records, source-navigation targets, list/card/editor boundaries, exact return-to-source, and source identity that is independent from analytical promotion.

Exit gate: source interaction feels like a competent reader/annotation system rather than a PDF pane attached to an analysis application.

### Stage 5 — Visual-language consolidation

Complete SVG pruning and curation, integrate only useful original Catalyst assets, finish readable typography and color hierarchy, fix native app-icon/version plumbing, and preserve redundant non-color cues for confidence and relationship semantics.

Exit gate: visual language improves recognition without forcing memorization or decorative microtype.

### Stage 6 — Persistence/runtime decision

Complete the XML-persistence experiment against the actual responsibilities currently handled by SQLite/Tauri. Treat XML persistence and the desktop runtime as separate questions.

Exit gate: evidence identifies what XML should replace, if anything; no architecture switch is made merely because XML is attractive or simpler in one comparator.

### Stage 7 — Reintroduce analytical richness

Resume evidence/provenance, confidence portrayal, richer semantic relationships, assessments, inference, indicators, Watch/Scan, and the expanded structured-analytic-technique library.

Exit gate: analytical complexity is progressive, inspectable, and built on the stable functional baseline rather than compensating for an unclear UI.
### Stage 8 — Projection views and interchange

Add timeline, matrix/ACH, evidence-table, argument/reasoning, and other method-specific projections over the same analytical identities. Stabilize canonical export/interchange without making any external format authoritative.

Exit gate: one analytical record can support multiple useful representations without duplication or semantic drift.

### Stage 9 — Hardening toward 1.0

Complete accessibility, dense-workspace performance, backup/restore and corruption testing, release/build provenance, license validation, migration recovery, threat modeling, capability review, and documentation completeness.

Exit gate: Catalyst is being stabilized as a dependable local analytical substrate rather than continuing to change its fundamental interaction model.

## Immediate priorities

1. Finish the source-first usability correction and validate it visually at normal scale.
2. Finish simplifying Analysis internally before expanding Freeplane-like behavior.
3. Integrate mature precedent rather than inventing basic editor/reader mechanics again.
4. Preserve the Catalyst-specific value for provenance, evidence, uncertainty, reasoning, methodology, and Working Picture synthesis.
5. Reduce parallel-edit integration risk by converging active experiments into known-good checkpoints.

## Rough maturity, for planning only

- Research / architecture: roughly 75–85% mature.
- Core implementation architecture: roughly 60–70% mature.
- Basic end-user workflow: roughly 40–50% mature.
- Visual / interaction polish: roughly 30–40% mature.
- Advanced analytical capability: roughly 35–45% implemented, with substantially more already designed.
- Production hardening: early.

These percentages are directional planning estimates, not release metrics.
## Current engineering boundary

The latest coherent version label remains `0.6.3-alpha.3`, but current working source contains post-alpha.3 experiments and refactors from multiple parallel tracks.

Recent node-core simplification has passed `node scripts/test-map.mjs` and `npm run build`. A broader `check:web` run was blocked by a visual-language test that still expected an older `Source` UI marker after concurrent interface changes. Treat that as an integration/test-contract issue until reconciled; do not restore stale UI solely to satisfy the old assertion.

Source-first CSS and capture-control changes are candidates requiring runtime/screenshot acceptance. Presence in source is not acceptance.

## Planning principle

The next major milestone should not be "more Catalyst." It should be making the Catalyst already designed coherent, readable, resumable, and hard to break.

Once that functional baseline exists, deeper intelligence-analysis capability can be added with much lower risk because the source, structure, navigation, and interaction substrate will already be understandable.

## Relationship to the long-term roadmap

`docs/roadmap.md` remains the long-term milestone and frozen-decision document. This dated snapshot supersedes older *execution-order assumptions* where current implementation evidence has moved ahead of them, especially the older assumption that Portrayal Lab work is still the singular immediate blocker.

Any permanent change to frozen architecture decisions still requires the normal ADR process.
## Active execution companion

For immediate integration order, collision-risk rules, the ten-step Functional Baseline acceptance scenario, and definition of done, use `ROADMAP_EXECUTION_BOARD_2026-09-13.md`.

The preliminary roadmap defines direction; the execution board defines the current gate.
