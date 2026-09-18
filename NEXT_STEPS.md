# Recommended next steps

Status: **current execution order — 2026-09-17**

Catalyst 1.1 is in convergence/stabilization. Do not start another broad feature cycle before the current Reader → Outline / Methods → explicit relationships → read-only Map / Export workflow is stable and the repository no longer contradicts itself.

## 1. Finish release-readiness cleanup

- resolve the current `AnalysisOutlineView.tsx` partial-refactor compile blocker before treating the combined gate as green;
- keep `docs/CURRENT_ARCHITECTURE.md`, `docs/release-readiness.md`, `docs/roadmap.md`, ADR 0027, and the mounted runtime aligned;
- audit historical names before deleting code or tests that may still protect a valid invariant;
- remove unreachable compatibility code, selectors, styles, and prototype exposure only when behavior is clearly preserved;
- treat ordinary analytical words such as “assessment” and “evidence” inside techniques as vocabulary, not as retired product surfaces.

## 2. Exercise the surviving file/session workflow

Test New, Load, Save, and Open PDF as distinct operations. Verify automatic XML persistence, portable `.catalyst.xml` round trips, crash recovery, source-PDF reconnection, reader page resume, and viewer markup reload with realistic files.

## 3. Exercise structural authoring

Stress the Outline with create, rename, sibling/child insertion, reorder, indent/outdent, folding, trash/restore, keyboard navigation, relationship creation/editing, and reload. Confirm multiple typed relationships persist and the Map portrays them without becoming an independent structural editor.
## 4. Exercise Methods / Techniques

Verify ordered runs, catalog discovery, genuinely blank/custom insertion, focused Name/Subtask/Analysis editing, subtask add/remove, run reordering/deletion, relationship creation/editing (including Outline↔Method links), and reload. Keep Methods structurally independent from Outline while allowing explicit cross-surface relationships.

## 5. Normalize the remaining application shell

Resolve high-value CSS, typography, iconography, focus, disabled-state, and toolbar inconsistencies without adding new interaction models. Review whether development/prototype commands such as Portrayal Lab should remain exposed in a beta build.

## 6. Run the beta gate

For implementation changes, run focused tests and then:

```powershell
npm run check
powershell -ExecutionPolicy Bypass -File .\test.ps1 -Full
```

Do not cut a beta candidate while a known crash, corruption risk, inaccessible-workspace defect, structural divergence, or core-workflow blocker remains open.

The detailed phase plan is `docs/roadmap.md`; release criteria are in `docs/release-readiness.md`.
