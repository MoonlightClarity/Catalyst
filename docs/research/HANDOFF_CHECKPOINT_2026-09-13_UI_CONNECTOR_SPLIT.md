# Catalyst UI rollover — 2026-09-13 connector split

Stay in ordinary Chat. Do **not** use official Work mode. Use Remote Desktop Commander for local files/commands and Opera when available for live browser/UI inspection.

Project root: `C:\Users\iris\Downloads\Catalyst`.
Current live app: `http://127.0.0.1:5173`.
Project is not a Git worktree. Preserve backups before product edits.

This successor owns the **Catalyst UI/product track only**. Do not take over the experimental Opera Browser Connector multi-client patch unless explicitly asked; the prior chat is keeping that bounded infrastructure task.

Read before changing direction:
- `docs\research\HANDOFF_CHECKPOINT_2026-09-13_ATTENTION_FILTER_ROLLOVER.md`
- `docs\research\GITHUB_UI_PRECEDENTS_2026-09-13.md`
- `docs\research\FREEPLANE_SOURCE_LAYOUT_PASS_2026-09-13.md`
- `docs\research\WORKING_PICTURE_LAYOUT_GRAMMAR_2026-09-12.md`

Closed/accepted UI slices:
- dark graphite structural shell with paper-white source/PDF pages;
- original Catalyst SVG analytical role + territory iconography;
- explicit occurrence-local sibling ordering with Move earlier / Move later controls;
- free placement remains independent from structure and semantic relationships;
- exact source identity/return remains closed unless a regression appears.
## Immediate unfinished UI slice

Resume contextual attention filtering from the earlier rollover. The on-disk patch in `src\features\analysis\WorkingPictureWorkspace.tsx` is intended to keep the hovered/selected analytical object's structural parent/children and direct semantic neighbours fully emphasized while dimming unrelated nodes/branches. Search dimming remains independent.

Backups from that slice:
- `src\features\analysis\WorkingPictureWorkspace.tsx.bak-attention-20260913`
- `src\styles.css.bak-attention-20260913`

Known unresolved validation issue: semantic-edge reveal proved hover reached React, but the first headless proof still reported zero `.is-dimmed` nodes/branches. At one point the 5173-served module looked partially stale relative to disk. Treat this first as an HMR/served-module reproduction problem, not as proof the feature logic is wrong.

Acceptance test:
- hover `Key assumption` in the nine-object grammar fixture;
- keep `Key assumption`, parent `Analytical issue`, and semantic neighbour `Competing hypothesis` fully emphasized;
- dim the other six fixture objects plus unrelated structural branches;
- reveal the `contradicts` semantic edge;
- pointer leave restores neutral map;
- no coordinates, structure, semantic records, provenance, or source identity mutate.

After a clean live pass: run `npm run check:web`, capture Fit + working-zoom before/hover screenshots, and document the accepted behavior in the working-picture/UI-precedent notes.
## Research/continuity context

Parallel research chats already exist:
- Freeplane source-layout pass: `https://chatgpt.com/c/6aa67c92-5330-83ea-a624-9813bec7f6d0`
- plugin/orchestration research: `https://chatgpt.com/c/6aa68e55-d0b8-83ea-9a15-5c9cde7c7b12`
- GitHub UI precedents: `https://chatgpt.com/c/6aa6999f-5eb0-83ea-9c58-ecf724749f67`

Highest-value UI sequence from the GitHub pass is: explicit sibling order -> SVG vocabulary -> contextual attention filtering -> reversible Focus/Hoist. The first two are accepted; contextual attention filtering is the current product task.

Preserve these constraints:
- no new permanent toolbar unless strongly justified;
- selected-object contextual actions are preferred;
- structural edges and semantic relationships remain visually/semantically distinct;
- reader-first shell remains the strongest default candidate;
- source/evidence material remains source-like, not flattened into generic analyst-authored iconography.

Continuity tooling is now durable under `tools\chatgpt-bridge-extension` (version 0.7.0) plus a dated archive. Browser Connector experiments are under `tools\opera-browser-connector-reference`, but they are not this successor's task.

First action: read the current on-disk attention patch and the earlier rollover, force/reload 5173 if needed, rerun the real hover proof, and only then edit product code if a genuine defect reproduces.
