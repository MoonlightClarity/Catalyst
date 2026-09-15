# Catalyst Stage 0 reconciliation checklist — 2026-09-13

Status: live integration checklist for the Functional Baseline. This is subordinate to `PRELIMINARY_PROJECT_ROADMAP_2026-09-13.md` and `ROADMAP_EXECUTION_BOARD_2026-09-13.md`.

## Objective

Convert the current shared, actively edited tree into one known-good baseline without undoing valid parallel work.

Stage 0 is complete only when the combined tree—not an individual chat's slice—passes the focused structural, Reader, persistence, build, and runtime gates.

## Current blocker order

1. **Reader compile integrity** — `src/viewer/ThoriumPdfReader.tsx` currently contains duplicated implementation and JSX blocks and prevents a production build.
2. **Analysis/CSS contract reconciliation** — `test-map` is green, but visual-language assertions are still moving as Analysis and global CSS change.
3. **Source-first runtime acceptance** — visual readability/layout work must be judged after the first two surfaces stop moving.
4. **Persistence/recovery consistency** — hydration/recovery edits must pass focused persistence tests before full-suite validation.
5. **Brand/assets/Portrayal/method expansion** — preserve useful work, but do not let these delay the Functional Baseline unless they break a required gate.

## Live status snapshot

| Surface | Current status | Evidence | Action before acceptance |
| --- | --- | --- | --- |
| Analysis structure/layout | PARTIALLY GREEN | `test-map` passed in the live tree; camera/geometry/drag boundaries are present | Freeze structural behavior, then rerun map + architecture tests after final Freeplane edits |
| Analysis visual contract | MOVING / RED | visual-language test passed earlier, then failed after later Analysis/CSS edits on the provenance-spine assertion | Decide whether the assertion is stale or the source/analysis boundary regressed; update code or test deliberately |
| Reader | RED / COMPILE BLOCKER | `ThoriumPdfReader.tsx` has duplicate scopes, duplicate returns/displayName blocks, and build syntax failures | Reconcile the active Reader track into one implementation before any full build verdict |
| Global CSS | ACTIVE | `styles.css` has continued same-session edits and is now >6.7k lines | Consolidate source-first/readability overrides after Reader/Analysis structure settles |
| Domain / map model | GREEN IN FOCUSED TESTS | domain and map tests have passed during this integration window | Preserve; rerun after shared-tree freeze |
| Architecture prototype | GREEN IN FOCUSED TEST | 17 traced-command contract passed during this integration window | Preserve as regression gate |
| License audit | GREEN | full npm+cargo audit passed; `@embedpdf/plugin-form` metadata was UNKNOWN but installed LICENSE is MIT | Keep license audit independent from UI failures |
| Persistence/recovery | ACTIVE | recovery hydration and SQLite corruption-handling tests are being edited | Run persistence-focused suite after those edits reach handoff |
| Portrayal Lab | ACTIVE BUT NON-CRITICAL | protocol/evaluation code and tests are still being refined | Preserve; exclude from Functional Baseline critical path unless it breaks build/tests |
| Techniques/methods | ACTIVE BUT NON-CRITICAL | interdisciplinary/humanities catalog and family tests are changing | Preserve content; do not make Stage 0 wait for catalog expansion |

## Reconciliation sequence

### A. Reader first
- Stop appending new blocks to `ThoriumPdfReader.tsx` once the active Reader track hands off.
- Re-read the entire file and collapse it to one component implementation, one registry path, one toolbar/render return, and one `displayName` assignment.
- Preserve useful annotation/selection/exact-return work; do not restore an older reader wholesale.
- Run Reader-focused tests, then `npm run build` before changing unrelated surfaces.

### B. Analysis second
- Treat the current simplified node core plus camera/geometry/drag extraction as the baseline to preserve.
- Finish only the structural command set already in flight: child/sibling, reorder, branch side, promote/demote, fold/organize, focus/back/home.
- Keep placement independent from hierarchy and semantic relations.
- Reconcile the visual-language provenance-spine assertion deliberately rather than satisfying it mechanically.

### C. CSS/source-first consolidation third
- Once Reader and Analysis markup are stable, consolidate appended CSS overrides into one readable source-first baseline.
- Remove superseded duplicate rules only after verifying the later rule is the intended contract.
- Validate normal-size typography, source prominence, inspector behavior, and active-node actions with runtime screenshots.

## Validation order after the hotspots reach HANDOFF/QUIESCENT

Run in this order so failures are attributable:

1. `node scripts/test-map.mjs`
2. `node scripts/test-visual-language.mjs`
3. `node scripts/test-architecture-prototype.mjs`
4. Reader/annotation focused tests: viewer markups, selection restore, highlight lifecycle, navigation history.
5. Persistence focused tests: XML repository/persistence, SQLite source ranges, sync queue, recovery journal.
6. `node scripts/test-domain.mjs` and analysis-model/evidence-tag tests.
7. `npm run build`.
8. Full `npm run test`.
9. `npm run licenses` (or full audit when dependency fingerprints changed).
10. Execute the Functional Baseline runtime scenario: source -> selection -> capture/evidence/thought -> placement/structure -> inspect/focus -> exact source return -> restart/reload.

A failure at an earlier gate should be resolved before relying on later gates. A stale test contract must be explicitly revised; a current behavior must not be reverted solely because an older string/class assertion expects it.

## Acceptance rule

The first Stage 0 accepted checkpoint should be boring: one coherent Reader, one coherent Analysis structure, one readable CSS baseline, passing persistence/recovery, and a reproducible source-to-analysis loop. Experimental breadth can continue afterward from that stable point.
