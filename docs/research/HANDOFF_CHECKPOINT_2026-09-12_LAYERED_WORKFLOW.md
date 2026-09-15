# Catalyst handoff checkpoint — layered unified workflow

Date: 2026-09-12
Phase: disposable/research interaction prototype over the real Catalyst shell.

## Product invariant

Catalyst is intended to own the analytical process end-to-end on one continuous page:
source intake → reading → exact source selection → evidence/capture → provisional thought → placement/organization → relationships/assessment → synthesis → exact source verification.

The Working Picture is the persistent analytical field around that workflow. A PDF/document is not a separate application or destination; it is a source object/focus surface within the same analytical place.

Broad architecture research is closed for this phase. Reopen research only for a concrete counterexample or implementation decision.

## Current architecture baseline

The architecture prototype remains an executable semantics test. It separates identity, revision, occurrence, context role, structure, qualified semantic assertion, source provenance, focus context, derived state, connector portrayal, and picture context.

The visual Desk was integrated with that model earlier, but it is no longer the primary product prototype. The real App shell is now the interaction substrate.
## Unified workflow research mode

Research URL: `?research=unified-workflow`.
Optional deterministic fixture: `&fixture=tradecraft`, loading `public/Tradecraft-Primer-apr09.pdf` through Catalyst's normal browserPdfSource → openSource → EmbedPDF path.

Current composition already makes the Working Picture a full-page analytical field and floats the PDF reader above it. Capture actions stay in/return to the Working Picture in research mode rather than navigating to a separate Evidence destination.

The Tradecraft fixture loaded successfully through the real viewer. The viewer initially painted blank but recovered; the live application already contained real evidence/linked-thought state and source-return machinery.

## Overflow bug and Sploder comparator

User found that notes could be dragged underneath the PDF and beyond sensible bounds.

Sploder Shooter was inspected from extracted ActionScript, the live hosted creator, JPEXS extraction, and a bounded portion of the old non-proprietary site repository. Stop broad Sploder excavation now unless a specific implementation question requires it.

High-value mechanic: Sploder separates authored playfield geometry, camera, transient drag state/object ghost, validity, snap, and committed object state. Invalid drops roll back; objects do not enlarge the playfield that validates them. Default snapping is 20 units with a precision escape.
Catalyst adaptation in progress:
- `src/picture/layout.ts` now exposes `placementWidth/placementHeight`, calculated from canonical automatic/periphery positions before manual overrides.
- Existing `width/height` remain render/recovery extent, so legacy/manual outliers can still be recovered without defining future valid placement.
- `src/picture/placement.ts` now has explicit placement evaluation, 20-unit snapping, and commit/rollback resolution.
- `WorkingPictureWorkspace.tsx` drag path now uses transient `dragPositions`, validates against placement extent, marks invalid drag state, snaps on commit, and uses Alt to bypass snap.
- CSS has an invalid-drop portrayal (`outside field`).

Important: no full regression/build gate has been run after these latest placement changes yet.

## Latest layer-model correction — authoritative

The immediately preceding implementation treated PDF transparency as a whole-reader focus trick and made the PDF pointer-transparent when Working Picture focus was active. The user corrected this model.

Do NOT continue that design literally.

Better model: source/PDF and analytical material are independent visual planes/objects, analogous in principle (not exact UI) to presentation-editor shapes/layers. The PDF should have its own frame/opacity/placement behavior; analytical occurrences are another layer. Cycling should invert which plane is above the other rather than merely disabling one plane. Transparency belongs to the source object/layer, not to the entire application's focus state.
Current half-state to correct before testing:
- `App.tsx` already has an F6 handler that toggles `activePane` between `reader` and `context`, plus a research-only `unified-layer-toggle` control.
- Current research CSS still sets `.workspace-unified-context .pdf-pane { pointer-events: none; }` and fades `.reader-surface` to `opacity: 0.5`; this is the superseded model and should be replaced with true stacking/layer inversion behavior.
- Keep F6 as a candidate accelerator, but reinterpret it as source/analysis layer inversion. Clicking/focusing an object may also raise its plane if that proves cognitively cleaner.
- Do not make PDF overlap intrinsically invalid. A source object and notes may intentionally overlap if either layer remains recoverable and interaction ownership is clear.
- Genuine out-of-playfield placement remains invalid and should roll back.

A helper file exists at `.tmp_patch_creation_bounds.py` to route viewport-center note creation through the placement resolver. It was created immediately before the layer-model correction and HAS NOT BEEN EXECUTED. Inspect it before deciding whether to apply it.

Backups from this pass exist under `.catalyst-backups/placement-fix-20260912-094324` and `.catalyst-backups/placement-fix-20260912-0954`.
## Exact next sequence

1. Read this checkpoint plus `RESEARCH_CLOSURE_SYNTHESIS_2026-09-12.md` and the current source files before editing.
2. Replace the current pointer-pass-through opacity hack with a minimal source/analysis stacking model. Preserve independent source opacity; test whether F6 should invert z-order and interaction ownership together.
3. Keep the PDF as a positioned source object/surface rather than a permanent half-pane. Do not turn Catalyst into a PowerPoint clone; borrow only the independent-layer principle.
4. Finish/verify the Working Picture placement contract. Ensure manual outliers cannot expand `placementWidth/placementHeight`. Apply creation bounds only if consistent with the layer model.
5. Add regression tests for placement evaluation, snap/Alt behavior, rollback, and manual-outlier independence.
6. Run full `npm test` and `npm run build`.
7. Hands-on test the research URL with Tradecraft: layer inversion, overlapping note/PDF reachability, out-of-playfield rollback, snap, Alt precision placement, source selection/capture, and exact source return.
8. Adjust from observed cognition, not from the first prototype idea.

## Continuity / environment

Use Remote Desktop Commander for local files/processes. Do not restart/migrate the Catalyst workbench casually.

The old autonomous watchdog is intentionally disabled. `background.js` has `FORCE_DISABLED = true`; the scheduled ChatGPT continuity watch is disabled; keep-awake was stopped. Manual/deliberate chat handoff is still allowed and desired. Do NOT re-enable autonomous `continue` messages unless the user explicitly asks.

User has authorized discretion. Prefer coherent tested slices over preserving any one speculative UI idea.

## Successor chat

Fresh continuation created successfully via the manual Catalyst bridge (watchdog remains disabled).

Title: `Continue Catalyst Layering Work`
URL: `https://chatgpt.com/c/6aa565d2-e17c-83ea-bed1-e4f5b552bde7`
Reasoning mode observed in the UI: High.

The successor accepted the bootstrap and began reading this checkpoint immediately.
