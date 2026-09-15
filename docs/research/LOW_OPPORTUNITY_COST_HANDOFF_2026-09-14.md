# Catalyst Low-Opportunity-Cost Handoff — 2026-09-14

## Purpose

This document moves the remaining low-opportunity-cost work out of the undo/redo implementation chat.
The next chat should treat this as a bounded polish backlog, not as permission to add new analytical subsystems.

## Scope rule

A change belongs here only when it reuses an existing Catalyst model, state path, command, icon family, or CSS surface.
It should improve discoverability, legibility, recovery confidence, or interaction efficiency without introducing a new domain concept.
If an item needs a new persistence model, new analytical semantics, a new renderer, or substantial migration logic, it is not low opportunity cost.

## Already present — do not duplicate

The current code already contains these capabilities:

- Command palette with `Ctrl+K` and command-level shortcut display.
- Working Picture Center/Fit behavior and fixed-scale map orientation controls.
- Outline-to-map navigation / opening the corresponding mapped thought.
- Capability profiles and per-capability overrides.
- Reduced-motion support through `prefers-reduced-motion` CSS.
- Pending-selection copy-with-source (`quote + document + page`).
- Per-branch outline folding.
- Existing persistence/recovery journal and persistence-health indication.
- Existing semantic icon/tooltips across much of the annotation and analytical UI.

Do not create parallel replacements for any of these. Improve the existing surface if necessary.

## Priority A — strongest remaining cheap wins

### 1. Explicit save-state wording

The current header exposes persistence health and errors, but normal durability is still mostly implicit.
Add a compact `Saving… / Saved / Save failed` presentation only if it can reuse the existing persistence callbacks/queue state.
Do not create a second persistence mechanism or change recovery semantics.

Definition of done:
- Saving state is visually legible without becoming permanent chrome noise.
- Failure remains more visually prominent than success.
- Recovery journal behavior and durable sync semantics remain unchanged.

### 2. Outline-wide folding commands

Add `Collapse all` and a restrained expansion command such as `Expand one level` using the existing `map/collapse-set` model.
Do not add another hierarchy state or change the generated Working Picture contract.

Definition of done:
- Commands operate on current outline occurrences only.
- They remain outline-authoring controls; the generated map stays read-only.
- Existing per-row fold controls continue to work.

### 3. Shortcut discoverability pass

Do not build a second command system. Extend the existing command palette or a very small help surface so important shortcuts are discoverable.
Focus on commands that are otherwise difficult to infer: pane navigation, map/outline navigation, source-semantic marks, undo/redo, and global commands.

## Priority B — cheap if kept narrow

### 4. Extend copy-with-source to saved evidence

Catalyst already copies an active selection as `quote + document + page`.
Consider exposing the same operation on saved evidence/annotation rows so provenance can be copied after capture.
Reuse the current formatting rather than inventing a citation manager.

### 5. Tooltip and accessible-name consistency audit

Custom Catalyst iconography is now broad enough that inconsistent labeling carries a real learning cost.
Audit icon-only buttons for a meaningful `title`, `aria-label`, or visible label where appropriate.
This is a consistency pass, not an icon redesign.

### 6. Empty-state and no-result wording audit

Review Assessment, Evidence, Outline, Methods, Trash, and search/no-match surfaces.
Prefer short instructions that tell the user what action creates content or clears the state.
Do not add onboarding flows, tutorials, or modal walkthroughs.

### 7. One-step search/filter clearing

Where a persistent query or filter can leave a pane looking empty, expose a small clear action if none is already visible.
Reuse existing query state. Do not introduce saved searches or filter presets.

### 8. Encoding and dead-copy sweep

Continue removing mojibake, stale labels, obsolete terminology, and strings left behind by ontology/toolbar migrations.
Treat this as surface stabilization rather than feature development.

## Explicit exclusions

Do not treat the following as low-opportunity-cost work:

- New assessment models or new ontology layers.
- New relationship types or map semantics.
- Additional annotation families merely for feature count.
- Citation-management infrastructure.
- Collaboration or synchronization features.
- New map renderers, zoom models, or direct map-authoring mechanics.
- Timeline/matrix/watch/scan subsystems.
- Another command palette or parallel settings system.
- Global architectural rewrites disguised as polish.

If one of these becomes necessary, move it into a separately scoped design/research chat first.

## Undo/redo ownership

Undo/redo is intentionally **not** part of this handoff backlog.
The current undo/redo chat owns its implementation, visual treatment, validation, and any history-specific defects.
Do not modify workspace-history behavior from the low-cost-features chat unless a directly blocking integration defect is discovered.

Current undo/redo direction at handoff time:
- `Ctrl/Cmd+Z` undo.
- `Ctrl/Cmd+Shift+Z` redo and `Ctrl+Y` on Windows.
- Native text-input undo preserved.
- Irreversible operations act as history barriers.
- Visible global Undo/Redo controls are being made visually distinctive.

## Suggested order for the new chat

1. Verify each candidate against current code before editing.
2. Implement Priority A only while the change remains genuinely small.
3. Run the narrow relevant test after each item.
4. Stop when an item starts requiring new domain or persistence architecture.
5. Then take Priority B as polish, not as a mandate to complete every item.

## Handoff prompt

Use this in a new chat:

> Work from `docs/research/LOW_OPPORTUNITY_COST_HANDOFF_2026-09-14.md`. Verify the current Catalyst code before implementing anything because several originally proposed cheap wins already exist. Keep this pass strictly to low-opportunity-cost usability and polish improvements; do not touch undo/redo except for a blocking integration defect. Prefer reuse of existing state, commands, iconography, and CSS. Stop rather than create a new subsystem.

## Validation expectation

For each implemented item:
- Production build must still pass.
- Add or update a focused regression/contract test only where the behavior could silently regress.
- Do not restore stale UI solely to satisfy an outdated assertion; update stale tests to the frozen/current contract when justified.
- Record any item rejected as no longer low-cost so it does not cycle back into the backlog.

## Implementation checkpoint — 2026-09-14

Completed in the bounded low-cost pass:
- Priority A.1: explicit `Saving… / Saved / Save failed` feedback now observes the existing persistence queue; recovery and durable sync semantics were not changed.
- Priority A.2: Outline now has `Collapse all` and progressive `Expand one level`, both using the existing collapse state/action path.
- Priority A.3: existing navigation/source-mark shortcuts received additional discoverability; no second command system was created.
- Priority B.4: saved Evidence rows can copy `quote + document + page` using the existing copy icon and provenance format.
- Priority B.6/B.7: Evidence and Trash distinguish true-empty from filtered-empty states, and the existing search/filter surface now exposes one-step clearing.
- Priority B.8: the confirmed mojibake strings were removed; a follow-up static sweep found no remaining `Â`, `Ã`, or replacement-character mojibake in `src`.

Audited and intentionally left alone:
- Priority B.5: static icon-button review found no clear unlabeled icon-only control requiring a change; flagged controls had visible text labels.
- Assessment already explains the missing root-note prerequisite and exposes the action path; no onboarding layer added.
- Methods already exposes `Reset filters` whenever search/taxonomy/constraint filters are active; no duplicate clearing UI added.

Validation:
- `test-sync-queue.mjs`, `test-outline.mjs`, and `test-iconography.mjs` passed during this pass.
- A production build passed after the Priority A increment.
- The latest full build attempt is currently blocked by concurrent `MapOutlineView` / `WorkingPictureWorkspace` prop/export edits outside this backlog. The modified Evidence and Trash components pass an isolated TypeScript compile.
