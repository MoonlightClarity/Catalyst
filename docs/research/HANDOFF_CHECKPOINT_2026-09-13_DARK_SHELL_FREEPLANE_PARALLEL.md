# Catalyst handoff — dark structural shell + parallel Freeplane source pass — 2026-09-13

Status: deliberate rollover requested by user after completing current UI slice. This is the authoritative recovery point for the next main Catalyst chat.

## Immediate state

- Project: `C:\Users\iris\Downloads\Catalyst`
- Current dev server: **127.0.0.1:5173 only**; final verification observed Vite PID 14796.
- Project is still not a Git worktree. Preserve backups before meaningful edits; do not assume Git recovery.
- Final `npm run check:web` passes after the layout + dark-shell changes. Existing EmbedPDF `crypto` externalization and large-chunk warnings remain non-new build warnings.
- Use Remote Desktop Commander for local work and Opera Browser Connector for live visual inspection. Post actual screenshots during UI iteration.

## Closed source/provenance work

Source-region identity and exact return are closed at both regression and live-browser levels. SQLite persists `sourceRange`; cross-role Highlight -> same-region Evidence -> linked thought reuses one annotation UUID; persisted glyph range restoration through EmbedPDF `setSelection()` is regression-covered and live-proven on Tradecraft.

Do not spend the next chat re-debugging source identity unless a new regression is observed.

## Working Picture layout slice completed

The FreeMind/Freeplane-inspired layout grammar remains portrayal-only: free placement authors placement, explicit branch parentage authors structure, and semantic relationships remain separate. Movement never infers hierarchy or semantics.

`map/branch-layout-reset` / **Organize branch** reflows only an explicitly authored branch and descendants, preserving unrelated manual landmarks and authored parents.
Dense validation is now permanent in `scripts/test-map.mjs`. The original 12 Context + 12 Open test produced 22 overlaps; mixed Context/Open/Assess produced another eight cross-territory overlaps. `src/picture/layout.ts` now uses shared occurrence dimensions, footprint-aware row/column gaps, density-aware centering, orthogonal territory separation, and render/playfield extents based on the Working Picture portrayal.

Current 37-node mixed fixture produces **zero model-space overlaps** and **zero out-of-stage nodes**. Dense regressions also cover folding/local reflow and preservation of unrelated manual placement. Live DOM proof on 5173 rendered 37 occurrences with zero rectangle collisions. See `WORKING_PICTURE_LAYOUT_GRAMMAR_2026-09-12.md`, `tools/research-probes/2026-09-13/dense-working-picture-live.png`, and `dense-working-picture-live.json`.

## Dark structural shell slice completed

`src/styles.css` now extends the dark/high-contrast Evidence direction into a coherent structural shell:

- Working Picture field/chrome uses graphite rather than a pale sheet.
- Structural branches remain muted teal/gray; Open retains warmer/dashed distinction; semantic relations remain visually separate.
- Analytical object labels/symbols are light landmarks on the dark field rather than dark cards.
- Inspector is a dark dossier with slightly lighter editing fields and clearer dividers.
- Reader chrome is graphite, but EmbedPDF pages stay paper-white / source-like.
- Numeric state/counts were raised to a readable tabular-figure scale instead of remaining 7–9px microtext.
- Research shell overrides were corrected so reader-first/split experiments inherit dark structural chrome without recoloring PDF paper.

A backup exists at `src/styles.css.bak-dark-shell-20260913-handoff`.

Live visual checks completed:
- normal 5173 analysis view: coherent dark Working Picture + inspector + Reader chrome;
- reader-first Tradecraft fixture: white PDF page remains visually dominant source material against dark Catalyst structure;
- Evidence view: retains distinct ledger controls/divider while sharing the graphite family. Artifact: `tools/research-probes/2026-09-13/dark-shell-evidence-live.png`.

Do not immediately broaden this into decorative reskinning. Continue testing populated analytical states, source fragments, semantic edges, focus/overview zooms, and interactive affordances.
## Parallel Freeplane source pass requested by user

User explicitly asked that the successor spawn a **parallel research chat while the main chat finishes UI work**.

Repository: `https://github.com/freeplane/freeplane` (current GitHub default branch observed: `1.13.x`). This is an implementation comparator, not a product template. Catalyst must preserve its own analytical-record model and the placement / structure / semantics / provenance separations above.

The research chat should be bounded and source-first. Start with:
- `freeplane/src/main/java/org/freeplane/view/swing/map/NodeView.java` — view-root/fold state and layout orientation; `isFolded()` is explicit here.
- `freeplane/src/main/java/org/freeplane/view/swing/map/NodeViewLayoutHelper.java` — subtree visibility and layout sizing/placement mechanics.
- `freeplane/src/main/java/org/freeplane/view/swing/map/MainViewPainter.java` — folding marks / visual treatment.
- `freeplane/src/main/java/org/freeplane/view/swing/map/ForkPainter.java` — structural connector painting/routing.
- `freeplane/src/main/java/org/freeplane/features/map/NodeModel.java` — parent/children model boundary; use primarily to identify what Catalyst must *not* conflate with portrayal.

Research questions, in priority order:
1. How does Freeplane determine stable sibling order, branch side/orientation, and subtree span/reflow?
2. How are fold state and hidden subtree geometry separated from node identity/model state?
3. How are forks/connectors routed and visually varied with depth/orientation?
4. What interaction supports explicit sibling reorder / branch organization, and which state is actually persisted?
5. Which mechanisms can Catalyst borrow as portrayal operations without importing mandatory-tree or hidden-parent semantics?

Research chat is **docs/source analysis only**: do not edit Catalyst product code or drive the live Catalyst UI. Write findings to `docs/research/FREEPLANE_SOURCE_LAYOUT_PASS_2026-09-13.md` and notify the main UI chat when a bounded useful result is ready. Do not restart generic mind-map/comparator research.
## Main successor role

The main successor owns UI implementation/validation and should **not wait** for the Freeplane research chat. Continue from current 5173 and use the parallel pass only when it produces concrete implementation implications.

Immediate UI sequence:
1. Inspect populated Working Picture at normal working zoom and Fit-picture overview under the new dark shell; verify semantic-zoom information scent remains usable.
2. Inspect source-linked nodes/evidence fragments and explicit semantic relationships on the dark field; keep structural branch vs semantic relation visibly distinct.
3. Validate Evidence populated state still reads as a ledger/provenance projection rather than merely another dark tab.
4. Check focus, hover, keyboard focus, drag/drop feedback, collapsed-branch state, and inspector form readability/contrast.
5. Preserve the reader-first shell as strongest current candidate and spatial/split variants as research controls; do not delete controls yet.
6. If Freeplane source findings justify sibling reorder or further branch portrayal mechanics, implement them only as explicit structure/portrayal operations with regressions.

Keep source pages paper-like. Dark background is for structural environment, not PDF content.

## Validation boundary

At this handoff, final `npm run check:web` is green after the dark-shell changes. Only listener among 5173/5174/5175/4173 is `127.0.0.1:5173` (PID 14796 at verification).

Known non-new build warnings: EmbedPDF browser `crypto` externalization and Vite/Rolldown chunk-size warning.

## Continuity

The user is awake and deliberately requested a fresh-chat handoff. Create a new main UI chat, then from that chat spawn the bounded Freeplane research chat above. Record both conversation URLs back into this checkpoint after successful seeding.

The old automated watchdog is not required for this rollover. The user has already removed the overnight hourly `continue` task; do not recreate it unless explicitly requested.

## Active conversation URLs — 2026-09-13

- Main UI continuation: `https://chatgpt.com/c/6aa677ee-9338-83ea-8c1e-b5f336ba601c` (`Continue UI Research Tracks`)
- Bounded Freeplane source research: `https://chatgpt.com/c/6aa678e2-e300-83ea-bfd9-285853ccf4b5`

The Freeplane research chat was successfully seeded from the bounded instructions above and confirmed its research-only boundary. Main UI work continues independently and should not wait for that pass.


## Active continuation URLs — 2026-09-13

- Main dark-shell / 5173 UI chat: `https://chatgpt.com/c/6aa677ee-9338-83ea-8c1e-b5f336ba601c`
- Bounded Freeplane source-layout research chat: `https://chatgpt.com/c/6aa678e2-e300-83ea-bfd9-285853ccf4b5`

## Parallel research correction — 2026-09-13

The first Freeplane research thread drifted into UI/continuity work and created an unwanted hourly task; that task was disabled and that thread is retired.

Authoritative bounded Freeplane source-layout research conversation: `https://chatgpt.com/c/6aa67c92-5330-83ea-a624-9813bec7f6d0` (`Research Freeplane Layout pass`). It is explicitly restricted from Catalyst UI/product edits, automation/watchdog changes, and coordination URL edits. The earlier `https://chatgpt.com/c/6aa678e2-e300-83ea-bfd9-285853ccf4b5` research thread is non-authoritative.

Main UI continuation remains `https://chatgpt.com/c/6aa677ee-9338-83ea-8c1e-b5f336ba601c`.

## 2026-09-13 sibling-order continuation

Freeplane source pass materially justified one additional structural invariant: authored sibling order must be stable structural state, not inferred from note creation time or x/y placement. Catalyst currently still sorts siblings by note timestamp/ID in `src/map/layout.ts`; this is now the active implementation target.

Implementation boundary: add explicit occurrence-local sibling order plus an explicit reorder action only. Do not infer order from spatial drag, do not change semantic relationships, and do not make generated layout coordinates canonical. Preserve legacy hydration by treating absent order as null/fallback ordering.

## Additional parallel research — 2026-09-13

- ChatGPT plugin/orchestration research: `https://chatgpt.com/c/6aa68e55-d0b8-83ea-9a15-5c9cde7c7b12` (`Plugin research summary`). Research-only; no installs without explicit approval.
- GitHub UI precedent research: `https://chatgpt.com/c/6aa6999f-5eb0-83ea-9c58-ecf724749f67` (`Read and Execute File`). Seeded via `GITHUB_UI_SEARCH_SEED_2026-09-13.txt`; research-only and confirmed running.

Parallel research must not block the main 5173 UI/interaction track.
## 2026-09-13 continuation — sibling order + iconography slice closed
- Explicit occurrence-local sibling order/reorder is implemented and live-validated at 5173. Ordinary drag remains placement-only; explicit before/after controls mutate structural order only.
- Close-zoom selected-object actions are visible at normal ~105% zoom while overview/working zooms retain low chrome. `npm run check:web` passes.
- GitHub UI precedent pass consumed from `docs/research/GITHUB_UI_PRECEDENTS_2026-09-13.md`; source identity remains closed.
- Added dedicated `reorder-before` / `reorder-after` SVG landmarks in centralized `CatalystSymbols`; generic Back/Forward are no longer reused for structural reorder.
- Inspector header now reuses the exact `AnalyticalGlyph` role silhouette from the Working Picture, improving cross-representation object recognition.
- Existing hover-neighbourhood disclosure was confirmed rather than duplicated: hovered/active local parent/children/semantic neighbours remain visible while unrelated occurrences dim to ~13% and unrelated structural branches to ~11%.
- Live Opera/CDP icon probe passed: claim glyph matched map + inspector; distinct reorder glyph geometry present; selected-object action strip visible at 105%; unrelated branch dimmed while semantic neighbour remained visible. Capture: `tools/research-probes/2026-09-13/icon-landmarks-hover.png`.
- Added visual-language contract assertions for cross-representation AnalyticalGlyph identity and dedicated structural reorder symbols; test passes.
- One dev-only blank-body event was traced to stale Vite HMR state, not product source; 5173 Vite child was restarted cleanly and live validation then passed. Firefox was not used.
- Next bounded track: audit/prototype reversible Focus/Hoist as view context that preserves normal shell/panel state and never mutates authored structure, semantic relations, provenance, or ordinary placement.

## Freeplane FreeNode coupling follow-up — accepted 2026-09-13

The completed Freeplane pass established a strong REJECT boundary: Freeplane free nodes remain hidden tree children and structural moves can consume/free-reset manual placement. Catalyst must not copy that coupling.

Audit found one real violation in `map/occurrence-parented`: attach/reparent cleared `position` and `manual`. Fixed so parent/order changes preserve occurrence-local manual coordinates. `map/occurrence-reordered` already preserved placement.

Regression now proves: free placement remains parentless; Attach preserves coordinates; Reparent preserves coordinates; Reorder preserves coordinates; `Organize branch` is the explicit portrayal reset that may clear manual coordinates. Branch/Sibling creation without coordinates remains automatic; free New/double-click placement remains manual and parentless.

`node scripts/test-map.mjs` and `npm run check:web` are green after the fix. Architecture invariant is now explicit: **Move/Place -> placement; Attach/Reparent/Reorder -> structure; Organize branch/Return to branch layout -> portrayal reset.**

## 2026-09-13 source-first visual status

Current priority is visual usability first and additional complexity later. A parallel Catalyst chat is moving toward a source-first workflow, so this track should align with that direction rather than compete with it.

The intended product order is now: source/document as the primary work surface; capture, evidence, and thought creation made obvious and readable; Working Picture used downstream for synthesis.
Typography/readability is part of this reset. Prefer conventional system sans typography, comfortable sizes, ordinary weight steps, predictable line-height, multiline content before truncation, and avoid decorative microtype for normal information.

New model/ontology work is paused unless a real product break requires it. Existing placement/structure/semantics/provenance boundaries remain valid.
