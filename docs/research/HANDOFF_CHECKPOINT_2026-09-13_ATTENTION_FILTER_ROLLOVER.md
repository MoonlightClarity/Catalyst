# Catalyst UI rollover — 2026-09-13 attention filtering

Stay in ordinary Chat. Do **not** use official Work mode. Use Remote Desktop Commander for local files/commands and Opera when connected for live browser/UI inspection.

Project root: `C:\Users\iris\Downloads\Catalyst`.
Current live app: `http://127.0.0.1:5173`; last verified listener PID 14796.
Project is not a Git worktree. Preserve backups before product edits.

Read these before changing direction:
- `docs\research\GITHUB_UI_PRECEDENTS_2026-09-13.md`
- `docs\research\FREEPLANE_SOURCE_LAYOUT_PASS_2026-09-13.md`
- `docs\research\WORKING_PICTURE_LAYOUT_GRAMMAR_2026-09-12.md`
- this handoff.

Closed/accepted slices:
- dark graphite structural shell with paper-white source/PDF pages;
- original Catalyst SVG role/territory iconography;
- explicit occurrence-local sibling order and explicit before/after reorder controls;
- free placement remains independent from structure and semantic relations;
- source identity/exact return remains closed unless a regression appears.

Current iconography proof: nine-object grammar fixture distinguishes focus/thought, claim, assumption, hypothesis, question, entity, event, context, and source-backed evidence. Source-backed evidence deliberately remains a clipped paper fragment rather than another SVG glyph.
## Current unfinished slice: contextual attention filtering

GitHub precedent pass identified Trilium's hover-neighbourhood emphasis as the next high-value UI move after sibling order + SVG vocabulary. Catalyst already revealed only semantic edges incident to `hoveredNoteId ?? activeNoteId ?? focusNoteId`, but `.is-dimmed` was search-only.

Current on-disk patch in `src\features\analysis\WorkingPictureWorkspace.tsx` adds:
- `attentionRevealId = hoveredNoteId ?? active non-focus note`;
- `attentionNoteIds` = reveal node + structural parent + structural children + direct semantic neighbours;
- structural branches get `is-dimmed` unless both endpoints are in the attention set;
- node dimming is `searchDimmed || attentionDimmed`;
- focus/root selection alone does not trigger global dimming.

Current CSS in `src\styles.css` adds:
- `.picture-branch { transition: opacity 160ms ease; }`
- `.picture-branch.is-dimmed { opacity: 0.1; }`
- graph-context override `.picture-branch.is-dimmed { opacity: 0.11; }`.

Backups before this slice:
- `src\features\analysis\WorkingPictureWorkspace.tsx.bak-attention-20260913`
- `src\styles.css.bak-attention-20260913`

`npm run build` from the Catalyst root passed after this patch. Known non-new warnings only: EmbedPDF `crypto` browser externalization and large chunk warning. Full `npm run check:web` has **not** yet been rerun after the attention-filter patch.
## Live validation state

Fixture/probe files under `tools\research-probes\2026-09-13` include:
- `iconography_grammar_live.mjs`
- `attention_filter_live.mjs`
- `attention_event_probe.mjs`
- screenshots `attention-filter-before.png` and `attention-filter-assumption-hover.png`.

The nine-object fixture includes semantic relationships `source-backed evidence -> assessed claim (supports)` and `key assumption -> competing hypothesis (contradicts)`.

Important unresolved discrepancy: the semantic-edge reveal proves hover state is reaching React (`Key assumption` hover produced one semantic edge), but the first headless validation still reported zero `.is-dimmed` nodes/branches. A direct fetch of the 5173 served TSX showed the new `attentionNoteIds` block but at one point did not show the later `searchDimmed` marker; on-disk TSX now definitely contains both the attention set and node/branch dimming code. Treat this as likely stale/HMR/served-module validation ambiguity until reproduced cleanly. Do not rewrite the feature prematurely.

Acceptance test for this slice:
- hover `Key assumption`;
- fully emphasize `Key assumption`, structural parent `Analytical issue`, and semantic neighbour `Competing hypothesis`;
- dim the other six fixture objects and unrelated structural branches;
- show the relevant `contradicts` semantic relationship;
- pointer leave restores the neutral map;
- search dimming continues to work independently;
- no structure, coordinates, semantic records, provenance, or source identity are mutated.

After live acceptance: run `npm run check:web`, capture before/hover screenshots at Fit and working zoom, then document the behavior in the UI precedent/working-picture notes.
## Parallel research and continuity

Completed/active parallel chats:
- authoritative Freeplane source-layout pass: `https://chatgpt.com/c/6aa67c92-5330-83ea-a624-9813bec7f6d0`
- plugin/orchestration research: `https://chatgpt.com/c/6aa68e55-d0b8-83ea-9a15-5c9cde7c7b12`
- GitHub UI precedents: `https://chatgpt.com/c/6aa6999f-5eb0-83ea-9c58-ecf724749f67`

The GitHub pass is complete at `docs\research\GITHUB_UI_PRECEDENTS_2026-09-13.md`. Highest-value sequence: explicit sibling order -> SVG icon vocabulary -> contextual attention filtering -> reversible Focus/Hoist. First two are already implemented; attention filtering is the unfinished slice above.

Do not add another permanent toolbar. Preserve selected-object contextual actions, semantic-vs-structural edge distinction, reader-first shell, and source pages as source-like material.

Bridge lesson: for new ChatGPT chats, use a short prompt pointing to this text file. Load a blank ChatGPT tab first, wait for the app/composer, send the short seed, then wait for a permanent `/c/...` conversation URL before considering launch complete. A bridge 0.7.0 patch exists to distinguish Send-click from conversation commit, but the unpacked Opera extension may still need manual Reload before that behavior is active.

If Opera Browser Connector is disconnected, do not claim the successor was launched. The safe manual seed is:
`Read C:\Users\iris\Downloads\Catalyst\docs\research\HANDOFF_CHECKPOINT_2026-09-13_ATTENTION_FILTER_ROLLOVER.md and continue autonomously in ordinary Chat. Do not use Work mode.`

First action in successor: verify the on-disk attention patch, force/reload the 5173 page if necessary, rerun the real hover acceptance probe, and only then decide whether code needs correction.

## Persistence case-study handoff — 2026-09-13

Completed research-only provenance pass on the user-provided `full-wiki-logs.zip`.
Durable report: `docs\research\CATALYST_PERSISTENCE_CASE_STUDY_PROVENANCE_2026-09-13.md`.

Main continuity implication: borrow durable semantic checkpoints, explicit successor handoffs, bounded workers, and health telemetry; do not borrow control-evasion behavior. The key design goal is **work survives worker death**, not **worker defeats its authorized lifetime**. This directly supports improving semantic checkpoint/recovery discipline around the already-validated Agent Workbench supervisor and any Codex/Remote Desktop Commander continuation experiment.
