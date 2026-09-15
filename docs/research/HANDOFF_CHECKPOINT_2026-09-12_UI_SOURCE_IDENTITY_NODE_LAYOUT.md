# Catalyst handoff — UI / source identity / node layout — 2026-09-12

Status: fresh continuation required soon; this file is the durable recovery point.

## Authoritative direction

Preserve continuous analytical context, not necessarily one continuous visual page. Reader-first remains the strongest shell candidate after the three-shell experiment, with spatial and split retained as research/control compositions.

Do NOT re-enable the autonomous watchdog/continue system. Stay in Chat and use Remote Desktop Commander.

Do not restart broad research. Continue the bounded implementation/research threads below.

## Live environment

- Project: `C:\Users\iris\Downloads\Catalyst`
- Current dev server: **127.0.0.1:5173 only**.
- Verified listener: node/Vite PID 14796 at the time of this checkpoint.
- Old 5174 Catalyst instance was stopped earlier.
- `C:\Users\iris\Downloads\Catalyst` is currently **not a Git worktree** (`git status` reports no `.git`). Do not assume Git is available for diff/recovery.
- User screenshot confirmed their visible UI was inconsistent with some earlier descriptions; always verify against current 5173 before judging UI state.

## Current chat reference

External viewer reference: `https://github.com/embedpdf/embed-pdf-viewer`.
Important upstream selection work: PR #685, `https://github.com/embedpdf/embed-pdf-viewer/pull/685`.
Catalyst ships EmbedPDF **2.15.0**.
## Source-region identity: exact current state

The original same-role duplication bug is already live-proven fixed: Save Evidence -> reselect identical Tradecraft region -> Create linked thought remains `Evidence 1`, reusing the same annotation UUID.

A deeper cross-role proof still failed before the current correction: Highlight source -> reselect same visual title -> Save Evidence created a second source record (`Evidence 2`). The cause is now understood.

EmbedPDF 2.15.0 exposes glyph-range selection state through `SelectionScope.getState().selection` and can restore ranges with `setSelection()`.

Live Tradecraft measurement of the same normalized drag:
- first selection before overlay: page 0, glyphs **60 -> 148**, slice start 60/count 89;
- second drag after Catalyst-managed highlight exists: page 0, glyphs **60 -> 133**, slice start 60/count 74;
- quote and rectangle truncate correspondingly.

Thus the viewer overlay changes hit-tested selection; this is not merely JSON ordering or formatting.

Implementation already started:
- `src/domain/types.ts`: optional `SourceSelectionRange`, and `sourceRange?` on PendingSelection/Annotation.
- `src/viewer/embedpdf.ts`: `readSelection()` captures `scope.getState().selection` into `sourceRange`.
- `src/domain/workspace.ts`: new annotations copy `sourceRange`.
- `src/domain/sourceRegions.ts`: new source-region identity/equivalence module.

`sourceRegions.ts` currently uses: exact glyph-range equality first; then a deliberately narrow 2.15 overlay-compatibility rule requiring same document/page/start glyph, >=80% span retention, compatible text prefix >=80%, nearly identical anchor origin, and rect IoU >=0.85; legacy records fall back to strict quote+anchor equality.
## Source-region identity: immediate next steps

SQLite persistence is **incomplete**. `src/persistence/sqlite.ts` imports `sanitizeSourceSelectionRange`, but source ranges are not yet loaded/saved. Avoid an annotations-table migration in this slice; persist a settings map keyed by annotation UUID (for example `annotation_source_ranges`), hydrate it onto annotation records after loading, and update it when ranges change.

Then:
1. add domain regressions for exact range reuse, overlay-truncated same-region reuse, and a nearby/materially smaller region that must NOT merge;
2. run the full test/build gate;
3. rerun the real Tradecraft browser proof: Highlight -> reselect same visual region -> Save Evidence -> Create linked thought;
4. require one source UUID carrying both highlight/excerpt roles and visible `Evidence 1`;
5. only after that, use persisted `sourceRange` + EmbedPDF `setSelection()` to upgrade page-only source return into actual exact region restoration/highlighting.

Do not claim cross-role identity fixed until the live browser proof passes.

## Evidence-role architecture already in place

`annotationRoles` is separate workspace state so one source-region record can have `highlight`, `excerpt`, or both. Existing legacy `kind` seeds old records. Browser/recovery/SQLite role persistence and role-aware consumers were implemented and previously passed tests/build.

This separation is intentional: source-region identity is not an Evidence role, and role changes must not create new provenance identity.

## UI status and user feedback

The Evidence projection itself **was** changed to the requested high-contrast treatment in `src/styles.css`: dark graphite field/chrome, strong divider, light evidence slips/cards, dark subordinate search, and separated action strip.

However, the rest of Catalyst remains largely pale/warm, so the user correctly observed that only Evidence looked transformed. Current direction is to consider the Evidence treatment as the basis for a broader shell reskin: dark structural chrome/workspace, brighter content surfaces, strong separators, restrained teal accent, while keeping the PDF page visually paper-like.
Typography is also now a first-class UI issue. User screenshot shows counters/page numbers/zoom and compact controls are too small. `styles.css` contains many 8–11px declarations. Next visual pass should establish a readable minimum type scale, enlarge numeric state especially, use tabular figures, and reserve microtype only for truly secondary labels.

Before changing the whole palette, post a fresh screenshot from current **5173** and review with the user. Earlier this chat described screenshots without actually surfacing them once; do not repeat that mistake.

## Working Picture node organization: newly elevated issue

User identified that the nodes themselves are disorganized and specifically cited **FreeMind** as a model that handled organization well. Treat this as more fundamental than color polish.

Existing local comparator doc: `docs\research\PASS-2026-09-11-freeplane-hands-on.md`.
That pass says to preserve one identity across projections, local folding, low-friction free placement, explicit connectors, and stable placement; it explicitly warns against hidden hierarchy and continuous force-layout.

Current Working Picture implementation is centered in:
- `src/features/analysis/WorkingPictureWorkspace.tsx`
- `src/picture/layout.ts`
- `src/picture/placement.ts`
- related map layout in `src/map/layout.ts`

Next chat should do a bounded **FreeMind/Freeplane layout-grammar check**, not broad mind-map research. Key question: can Catalyst borrow predictable branch/sibling ordering, readable spacing, curved branch routing, collapse/fold, and automatic branch reflow as an optional portrayal/layout mode **without** making hierarchy the ontological truth or destroying deliberate free placement?

Likely direction: separate authored structure from portrayal. Free placement remains genuinely uncommitted. When the analyst explicitly authors branch/group structure, Catalyst can offer a FreeMind-like organized projection or an `organize branch` action. Movement alone must not author hierarchy or semantic relationships.

Do not perform a broad UI reskin until this node-layout grammar is understood enough that the visual hierarchy can follow it.

## Targeted Sploder follow-up already completed

See `docs\research\SPLODER_TARGETED_SECOND_PASS_2026-09-12.md`. New mechanisms: structure + occurrence coordinates, scale-independent editing handles, direct local connector editing, and canonical state producing derived visual previews. These findings do not override the current FreeMind/node-layout concern.
## First actions for successor

1. Read this file first, then `KEY_ASSUMPTIONS_CHECK_2026-09-12.md`, `SHELL_EXPERIMENT_COMPARISON_2026-09-12.md` if present, and the Freeplane hands-on pass.
2. Verify 5173 is still the only Catalyst Vite listener before screenshots/tests.
3. Finish `sourceRange` SQLite settings persistence and the cross-role live proof before touching exact-return behavior.
4. Do the bounded FreeMind/Freeplane node-layout grammar check against current `WorkingPictureWorkspace` / `picture/layout`.
5. Only then make the next UI composition pass: readable typography/numbers + coherent dark structural shell, and post actual screenshots to the user during iteration.
6. Keep spatial/split shell variants available as research controls; do not delete them while refining reader-first/default behavior.
7. Do not re-enable autonomous watchdog/continue behavior.

## Important diagnostic artifacts

Research/debug probes are under `tools\research-probes\2026-09-12` with screenshots under its `artifacts` directory. Do not scatter new probes in Downloads root.

The source-selection identity probes established the 60->148 vs 60->133 EmbedPDF overlay mutation. Preserve them as diagnostic evidence.

## Decision discipline

Do not equate a prettier dark skin with solved navigation. Current user feedback identifies three separable problems: projection identity/contrast, legibility/type scale, and Working Picture layout grammar. Treat them separately in implementation and test their interaction with screenshots.

Do not equate FreeMind-like organized portrayal with mandatory tree semantics. Catalyst's durable invariant remains separation of identity, occurrence/placement, structure, semantic relation, provenance, and focus.