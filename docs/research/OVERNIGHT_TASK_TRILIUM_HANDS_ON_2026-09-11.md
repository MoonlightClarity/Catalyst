# Overnight bounded task — Trilium hands-on reconciliation

Status: dispatch only. The overnight coordinator must not perform this GUI work.

## Preconditions
- GUI-authorized researcher only.
- Continue existing supervised job `20260912T003124Z_trilium-research_45780` on Catalyst `:99`; do not restart it.
- Read its `checkpoint-latest.md`, the architecture contract, and the Freeplane/Zotero hands-on passes first.

## Questions to test
1. How does one note with multiple branches/clones present identity versus placement to the user?
2. What do move, clone, delete, archive, hoist/unhoist, backlinks, note map, and branch-prefix actions actually mutate or imply?
3. Does hoisting preserve understandable return/context, or does it create orientation loss?
4. Are hierarchy, relations, attributes, and visual note-map links distinguishable in interaction?
5. What UI cues make same-note reuse visible without implying independent corroboration?
6. What aspects reduce or increase cognitive load compared with Freeplane/Zotero and Catalyst alpha.3?

## Deliverables
- Write `PASS-2026-09-12-trilium-hands-on.md` under `docs/research`.
- Update the supervised job semantic checkpoint with what a successor needs next.
- End with `COUNTEREXAMPLE: yes/no` against the current Working Picture architecture contract, naming any violated invariant precisely.

Do not broaden into generic Trilium feature cataloging or Catalyst implementation work.
