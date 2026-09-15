# Catalyst parallel integration protocol — 2026-09-13

Purpose: prevent concurrent Catalyst work from turning transient mid-edit states into false regressions or accidental rollback.

## Core rule

Parallel research is cheap; parallel writes to the same product hotspot are expensive. Treat shared product files as integration surfaces, not independent sandboxes.

## Track lifecycle

1. **ACTIVE** — track may edit its declared files; combined-tree validation is informational only.
2. **HANDOFF** — track stops editing and records files touched, intended behavior, backups, tests run, and unresolved overlap.
3. **QUIESCENT** — no known track is writing the integration hotspot.
4. **VALIDATE** — run focused tests/build/runtime checks against the combined tree.
5. **ACCEPTED** — behavior is retained in the Functional Baseline; backups remain history, not restore targets.

## High-collision hotspots

- `src/features/analysis/WorkingPictureWorkspace.tsx`
- `src/styles.css`
- `src/App.tsx`
- `src/viewer/ThoriumPdfReader.tsx` while the Reader replacement is active

No track should restore any hotspot wholesale from a backup. Backups are comparison points only.

## Minimum handoff packet

Every product-edit track should leave: objective; files touched; behaviors intentionally changed; tests/build run; known failures; concurrent changes observed; exact next action; and whether the track is still editing.

## Validation sequence after quiescence

1. Run the most local regression test for the touched subsystem.
2. Run `node scripts/test-map.mjs` for Analysis/Working Picture structural changes.
3. Run Reader/annotation tests for source-side changes.
4. Run `npm run build`.
5. Run broader web checks only after focused failures are understood.
6. Perform the ten-step Functional Baseline runtime scenario from `INTEGRATION_STATUS_MATRIX_2026-09-13.md`.

A failing stale assertion should be reconciled with the current product contract; do not restore removed UI solely to satisfy an obsolete test.

## Parallelism policy for the current phase

Safe parallel tracks are those that operate on disjoint files or remain research-only. High-risk parallelism is multiple chats editing the same hotspot, especially Analysis workspace, Reader replacement, app shell, or global CSS.

When a hotspot is actively changing, other tracks should prefer research, isolated modules, tests, asset curation, or documentation until that hotspot reaches HANDOFF.

The current Stage 0 goal is not to eliminate parallelism. It is to make parallel work converge deliberately into one validated Functional Baseline.
