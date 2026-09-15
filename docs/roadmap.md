# Catalyst working roadmap

Status: **current beta-convergence roadmap — 2026-09-15**

This roadmap replaces the pre-convergence 0.6.x feature roadmap. The prior roadmap is retained at `research/LEGACY_ROADMAP_PRE_BETA_CONVERGENCE_2026-09-15.md` for historical context only.

## Governing constraint

Do not expand product scope while the late-alpha surface is still converging. ADR 0027 freezes the beta target around Reader, Outline, generated Map, Methods / Techniques, and Catalyst XML persistence.

## Phase 1 — Documentation and dead-surface convergence

- keep `CURRENT_ARCHITECTURE.md`, ADRs, release-readiness, and mounted runtime in agreement;
- remove stale current-looking references to Assessment, standalone Evidence, global undo/redo, thought-link authoring, map-first structural editing, legacy Techniques UI, and active Tauri/SQLite;
- distinguish historical test/type/component names from current product requirements;
- retire or rename compatibility code only after confirming what current behavior it still protects;
- keep dated research and rejected designs available as history rather than allowing them to compete with current authority.

Exit condition: a new maintainer can identify the active product and runtime without reading historical alpha documents.
## Phase 2 — Core-workflow stabilization

- exercise New / Load / Save / Open as distinct session/source operations;
- verify automatic XML persistence, recovery-journal behavior, and explicit file round trips;
- verify PDF reconnect identity, annotation reload, and reader resume behavior;
- harden Outline create/rename/reorder/indent/outdent/fold/trash flows and keyboard focus;
- verify generated Map agreement with Outline structure;
- harden Methods / Techniques ordering, blank/custom insertion, focused editing, and deletion;
- normalize remaining CSS, typography, iconography, focus, disabled, and error states.

Exit condition: repeated realistic use does not reveal corruption, inaccessible work, structural divergence, or a core-workflow blocker.

## Phase 3 — Compatibility and implementation cleanup

- reduce internal `graph`, `WorkingPictureWorkspace`, legacy map/graph, and `noteLinks` naming/state where removal is behavior-preserving;
- review the Portrayal Lab command and other prototype/development routes for beta exposure;
- audit historically named tests by invariant before renaming or deleting them;
- remove unreachable helpers/selectors/styles once coverage proves they are not carrying current behavior;
- decide when the package/version label should advance from `0.6.3-alpha.3` to a beta-candidate identity.

Exit condition: remaining compatibility code has an explicit reason to exist or has been removed.
## Phase 4 — Beta hardening

- run save/reopen/load and crash/recovery checks against nontrivial workspaces;
- test large PDFs and realistically large outlines/technique sequences;
- complete keyboard/focus and accessibility review for the supported surfaces;
- document and test backup, restore, corruption, and recovery expectations;
- complete active-runtime threat modeling and release/build provenance appropriate to distribution;
- validate a clean delivery environment once the shipping model is selected.

Exit condition: the beta gate in `release-readiness.md` is met with no known critical failure.

## Deferred beyond beta entry

New analytical object systems, AI/connectors, broad interoperability suites, collaboration, GIS/GEOINT breadth, and other speculative capability work remain deferred unless a concrete beta blocker requires them.

Catalyst should reach beta by becoming smaller, clearer, and more trustworthy—not by completing every design explored during alpha.
