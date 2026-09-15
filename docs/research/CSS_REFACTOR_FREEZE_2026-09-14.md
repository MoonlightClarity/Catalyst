# Catalyst CSS Refactor Freeze — 2026-09-14

Status: **FROZEN** for architecture/migration work.

The CSS refactor is closed as an ownership and readability migration. Future CSS work is ordinary component work inside the existing owner modules; do not continue modularizing historical CSS merely to reduce line count.

## Frozen architecture

`src/styles.css` is the compatibility foundation and is explicitly marked `FROZEN LEGACY CASCADE`. It loads first and is capped by `scripts/test-css-architecture.mjs` so it cannot quietly become the active development stylesheet again.

Current production styling is owned by:

- `00-tokens.css` — shared readable tokens.
- `10-base.css` — global defaults.
- `15-shell.css` — shell, overlays, commands, Library, configuration.
- `20-notes-evidence.css` — notes, evidence, provenance, selection capture.
- `30-analysis-outline.css` — Working Picture, Outline, inspector, map ontology.
- `40-techniques.css` — SAT catalog and technique runs.
- `50-reader.css` / `51-annotation-rail.css` — Thorium reader and annotation surfaces.
- `60-assessment.css` — Assessment questionnaire.
- `70-iconography.css` — working-size icon legibility.

## Freeze invariants

1. New feature CSS does not go into `src/styles.css`.
2. Readability outranks palette fidelity and maximum density.
3. Normal reasoning text is not microtype; compact metadata must remain readable at normal working distance.
4. Component layout stays with its owner; reusable icon geometry stays in `CatalystSymbols.tsx` and sizing in `70-iconography.css`.
5. Module order in `src/styles/index.css` is architectural and must not be casually reordered.
6. Do not restart migration of old Stage 2/3, portrayal, Desk, or research CSS unless current functional work requires ownership of that block.

## Validation at freeze

- `node scripts/test-iconography.mjs` — **pass**.
- `npm run test:css` — **pass**.
- direct `vite build` — **pass**, confirming the modular CSS production bundle compiles.
- fresh production render at 1365×900 — stable for Reader/annotation rail and Analysis/Outline shell.

The repository-wide `npm run build` and full `npm test` are temporarily blocked by concurrent Analysis API/type errors in `App.tsx` and `WorkingPictureWorkspace.tsx`, not by CSS. Re-run both when that parallel change converges before declaring the whole repository green.

## Maintenance rule

Treat this document and `src/styles/README.md` as the architecture boundary. If a future change seems to require another broad CSS migration, first demonstrate that an owner module cannot express the behavior safely. Otherwise, modify the owner module and keep the refactor frozen.
