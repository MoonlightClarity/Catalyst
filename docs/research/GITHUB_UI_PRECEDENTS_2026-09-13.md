# GitHub UI precedents for Catalyst — 2026-09-13

Status: source-backed FOSS comparator pass. Research/docs only; no Catalyst product code or live Catalyst UI changed.

## Research boundary

This pass begins from the current Working Picture layout grammar, dark-shell handoff, and completed Freeplane source-layout pass. It therefore does **not** reopen the core architecture: placement, authored structure, semantic relation, provenance, and focus/portrayal remain separate state channels.

Freeplane is not repeated here. The useful Freeplane boundary is already established: explicit structure/order -> deterministic local portrayal -> reversible fold/reflow, with placement and semantic relations independent.

Existing Catalyst comparator work was also checked before promoting a precedent. OpenRefine is not repeated as a new UI precedent because its operation/provenance separation is already documented in `PASS-2026-09-11-forward-research-openrefine-provenance.md`. Trilium is retained only where current source adds implementation-level UI findings beyond the earlier hands-on task brief.

## Highest-value conclusions

1. **BlockSuite:** a mind-map can be a structural layer over ordinary canvas elements instead of the universal canvas ontology. Its fractional sibling index is a strong implementation precedent for Catalyst's new explicit occurrence-local sibling order.
2. **Trilium:** focus/hoist can be context state, while map rendering uses progressive disclosure, stable icons, hover neighbourhood emphasis, and density-aware framing without mutating note identity.
3. **Godot:** distraction-free mode is temporary shell portrayal and deliberately does not overwrite saved dock state. Its SVG icon pipeline is centrally theme-mapped rather than recolored ad hoc in each component.
4. **JupyterLab:** focused/single-document mode can have its own restorable shell layout, while commands remain available outside permanent toolbars.
5. **Penpot:** expert canvas chrome can be controlled by explicit layout flags and selection/context surfaces rather than a permanently expanded toolbar.
6. **Hypothesis:** redundant source selectors provide a robust exact-return fallback pattern; useful as a resilience precedent, not a reason to replace Catalyst's canonical source-region identity.
7. **Cytoscape.js (supporting only):** edge style, endpoint, curve, dash, and arrow channels are independent data-driven portrayal properties; Catalyst should expose only a small opinionated subset.

## 1. BlockSuite — general canvas plus explicit mind-map structure

Repository: https://github.com/toeverything/blocksuite

Observed source revision: `5cb5cb68471ca692f3c162258f0087cb22fcb82d` on the default `main` branch during this pass. Repository metadata reports MPL-2.0.

Exact files/components worth reading:
- `packages/affine/model/src/elements/mindmap/mindmap.ts`
- `packages/affine/gfx/mindmap/src/view/view.ts`
- `packages/affine/gfx/mindmap/src/element-renderer.ts`
- `packages/affine/model/src/elements/mindmap/style.ts`
- `packages/affine/model/src/elements/mindmap/utils.ts`

Implemented pattern: `NodeDetail` stores `index`, optional `parent`, and optional `collapsed`. The comment on `index` explicitly says it determines layout order. The model uses `generateKeyBetween()` from `fractional-indexing` to insert a node before/after a sibling without renumbering the whole sibling set. `buildTree()` reconstructs and sorts structural children by that index while each node remains a normal `GfxPrimitiveElementModel` on the general canvas.

The same model keeps `overriddenDir` as a temporary drag-time layout direction, separate from the preferred/committed direction. Structural connectors are generated as local `LocalConnectorElementModel` objects from the mind-map structure, including a special collapsed connector, rather than turning every canvas connection into the structural tree.

### BORROW
- Make sibling order explicit occurrence-local structural state. A fractional/rank key is a strong fit for Catalyst because occurrences are not a mandatory tree and later concurrent/local edits should not depend on note timestamps or x/y.
- Keep drag preview state ephemeral. A temporary before/after/side preview should not become structure until an explicit structural drop/action commits it.
- Treat structural connectors as generated portrayal from authored branch state, on a renderer/channel distinct from explicit semantic relations.
- Keep collapse on the structural occurrence/branch, not on note identity.

### REJECT
- Do not copy BlockSuite's assumption that a mind-map element owns one rooted tree as the universal meaning of its members. Catalyst must still allow free occurrences and separately authored semantic relationships.
- Do not make group membership or generated connectors canonical analytical identity.
- Do not let ordinary spatial drag silently author hierarchy. Catalyst needs an explicit structural target/preview before commit.

Why this matters: BlockSuite supplies the missing modern-web precedent that Freeplane cannot: **stable authored tree order can coexist with a general spatial canvas without making screen coordinates the source of structural truth**.

## 2. TriliumNext — focus context + semantic zoom + attention filtering

Repository: https://github.com/TriliumNext/Trilium

Observed source revision: `ea6ef5014d5a2f1ce1e4eebd75972b9f3c9d730c` during search; current default branch `main`. Repository metadata reports AGPL-3.0.

Exact files/components worth reading:
- `apps/client/src/components/note_context.ts`
- `apps/client/src/components/entrypoints.ts`
- `apps/client/src/components/tab_manager.ts`
- `apps/client/src/widgets/note_map/NoteMap.tsx`
- `apps/client/src/widgets/note_map/data.ts`
- `apps/client/src/widgets/note_map/rendering.ts`
- `apps/client/src/widgets/note_map/utils.ts`

Implemented pattern: `setHoistedNoteId()` changes the active `NoteContext`; tab management can restore the hoisted note with that context. This is a view/navigation scope, not a mutation of the note's identity. The note-map then separately chooses a root and renders a projection around it.

`rendering.ts` contains unusually relevant cognitive-load mechanics. Labels absorb only a quarter of camera zoom (`LABEL_ZOOM_SHARE = 0.25`), so zooming inward improves readability without letting text dominate the map. Icons are drawn only above a screen-space size threshold. The hovered node, its neighbours, and their links are emphasized while unrelated material fades to `DIMMED_ALPHA = 0.15` over 160 ms. The root note gets a quiet ring and reuses the same note icon used elsewhere in the application, preserving object recognition across representations.

`data.ts` also separates `tree` and `link` map data modes. Link maps can drop unlinked descendants in a small local view while retaining the root, reducing irrelevant force-layout occupancy. Multiple relation names between the same source/target are grouped rather than drawn as duplicate parallel edges.

### BORROW
- Implement Working Picture hoist/focus as reversible **view-context state**. It should change the visible working scope and return path, never reparent/reorder notes or rewrite semantic relationships.
- Preserve stable iconography across tree/map/inspector/source-linked representations so the same analytical object is recognized before its prose is readable.
- Use screen-space progressive disclosure: suppress icons/labels below useful thresholds, then reveal them gradually rather than scaling everything proportionally.
- On hover/focus, de-emphasize unrelated nodes/edges and emphasize the local semantic neighbourhood. This can make a dense analytical map inspectable without changing its structure.
- Let Fit Picture optimize useful central legibility rather than guarantee that every peripheral label is readable at once.
- Where several semantic relation records share the same endpoints, consider one portrayed edge with a compact multi-relation affordance/count instead of visual duplication.

### REJECT
- Do not import force layout as Catalyst's canonical authored placement. Stable analyst landmarks remain a core invariant.
- Do not make Trilium's note tree the universal ontology.
- Do not collapse tree edges and semantic relations into one undifferentiated visual graph; Catalyst's structural-vs-semantic distinction is stronger and should remain explicit.
- Do not use hover fading to hide provenance or uncertainty state; attention filtering is portrayal only.

Why this matters: Trilium offers a source-level precedent for **semantic zoom and focus-in-context that reduce density without destroying spatial/identity continuity**.

## 3. Godot — transient distraction-free shell + theme-aware SVG icon system

Repository: https://github.com/godotengine/godot

Observed source revision: `2f698aa5fe31d0be68f205ec41aec9365081d364` on `master`. Repository metadata reports MIT.

Exact files/components worth reading:
- `editor/editor_node.h` / `editor/editor_node.cpp`
- `editor/editor_interface.cpp`
- `editor/docks/editor_dock_manager.cpp`
- `editor/editor_main_screen.cpp`
- `editor/themes/editor_icons.h`
- `editor/themes/editor_icons.cpp`
- `editor/themes/editor_theme_manager.cpp`
- `editor/icons/*.svg`

Implemented shell pattern: `set_distraction_free_mode()` toggles editor chrome centrally. The critical dock-manager rule is explicit in source: distraction-free mode hides side and lower docks, so dock state saving skips those transient hidden dimensions while the mode is active. In other words, temporary attention reduction is not allowed to overwrite the user's normal workspace arrangement.

Implemented icon pattern: the repository contains a large original SVG set in `editor/icons/`. `editor_configure_icons(bool dark_icon_and_font)` configures an SVG forced-color map, and `editor_register_icons()` accepts dark/light mode, icon saturation, thumbnail size, and scale. `editor_theme_manager.cpp` regenerates/registers icons through that central theme pipeline rather than requiring each UI component to recolor its own asset.

### BORROW
- Add a Catalyst focus/distraction-reduction shell mode only if it is explicitly reversible and preserves the previous panel visibility/sizes. Temporary cognitive-load reduction must not corrupt the normal workspace state.
- Build Catalyst's map/tool iconography as a small original SVG vocabulary with central dark/light/contrast mapping and consistent stroke/scale rules.
- Use icons primarily as stable action/object landmarks. Analytical meaning should still come from the data model and explicit labels, not arbitrary icon color.

### REJECT
- Do not inherit Godot's enormous dock/plugin surface or category-color proliferation. Catalyst should remain an opinionated analytical desk, not a general IDE.
- Do not create dozens of icons before interaction needs are stable. Start with the small set that disambiguates map structure, provenance/source, focus, fold, organize/reorder, semantic relation, and evidence actions.
- Do not let icon saturation/color become an ontology that competes with evidence status, territory, or relation meaning.

Why this matters: Godot provides a mature implementation of **reversible chrome suppression** and a maintainable original SVG system—both directly relevant to the user's observed iconography gap in the dark Catalyst shell.

## 4. JupyterLab — separately restorable focused shell modes

Repository: https://github.com/jupyterlab/jupyterlab

Observed source revision: `cd7f6133a5809c83ebbede50673b06aa2fd0c311` on `main`. Repository metadata reports BSD-3-Clause.

Exact files/components worth reading:
- `packages/application/src/shell.ts`
- `packages/application/src/layoutrestorer.ts`
- `packages/application-extension/src/index.tsx`
- `packages/application/style/core.css`
- `packages/ui-components/style/toolbar.css`
- `packages/apputils/src/widgettracker.ts`

Implemented pattern: `LabShell` owns explicit `main`, `left`, `right`, `down`, `top`, and other areas. Side-area state separately records collapsed/visible state, current widget, sizes, and expansion states. More importantly, `_userLayout` contains separate entries for `multiple-document` and `single-document`; CSS and restoration logic also branch on `single-document` mode. The tracker explicitly supports avoiding restoration of irrelevant widgets in that focused mode.

Commands remain separable from fixed chrome: application commands can toggle focused-mode top visibility and can remain available even when side panels/toolbars are not permanently shown.

### BORROW
- If reader-first/focus becomes a first-class Catalyst mode, give it its own restorable shell-layout state rather than repeatedly mutating the ordinary analysis layout.
- Keep command availability independent from permanent toolbar visibility. Low-frequency actions can live in command search, context menus, keyboard shortcuts, or selected-object controls.
- Persist shell state as shell state; never let panel collapse/focus-mode restoration leak into analytical record semantics.

### REJECT
- Do not adopt a general docking/plugin shell merely because JupyterLab has one. Catalyst's current bounded source/map/inspector arrangement is cognitively stronger precisely because it is more constrained.
- Do not multiply tabs/panels until users must manage the workspace more than the analysis.

Why this matters: JupyterLab shows a stronger version of the Godot idea: **focused mode can have its own restorable workspace configuration, not just hidden CSS**.

## 5. Penpot — explicit workspace flags + context surfaces

Repository: https://github.com/penpot/penpot

Observed source revision: `947954933c2de822b885b383fb055b1e44943ddd`; current default branch `develop`. Repository metadata reports MPL-2.0.

Exact files/components worth reading:
- `frontend/src/app/main/ui/workspace.cljs`
- `frontend/src/app/main/ui/workspace/main_menu.cljs`
- `frontend/src/app/main/ui/workspace/context_menu.cljs`
- `frontend/src/app/main/ui/workspace/sidebar/**`
- `frontend/src/app/main/ui/workspace/viewport/actions.cljs`
- `frontend/src/app/main/data/workspace/transforms.cljs`

Implemented pattern: workspace chrome is controlled through explicit layout flags such as `:collapse-left-sidebar`, while preferences expose view/interaction modes as toggles. The context menu composes object/path/layer/prototype actions according to current context instead of requiring every operation to occupy the permanent canvas chrome.

### BORROW
- Keep high-frequency universal actions visible, but place selection-specific and structural maintenance actions near the selected occurrence or in a context menu/inspector.
- Represent optional workspace aids as explicit portrayal/layout flags so they can be toggled without mutating analytical objects.
- Treat sidebars as recoverable supporting surfaces, not mandatory simultaneous information. A collapsed inspector should not remove access to its commands or change object state.

### REJECT
- Do not import design-tool property density. Catalyst does not need Penpot's large always-available styling/property surface.
- Do not let generic alignment/snapping/shape manipulation become semantic authoring.
- Do not add menus merely to hide an overgrown feature set. Progressive disclosure should follow task frequency and selection context.

Why this matters: Penpot reinforces a practical low-chrome rule for Catalyst: **object-specific controls can appear on demand while workspace visibility remains explicit shell state**.

## 6. Hypothesis client — redundant anchoring for resilient source return

Repository: https://github.com/hypothesis/client

Observed source revision: `b4d085a2f893aa6de3b61d8b8bc3ae4d0f24fc1a` on `main`. The repository LICENSE contains a BSD-style two-clause license for the main project, with separately licensed subcomponents.

Exact files/components worth reading:
- `src/types/api.ts`
- `src/annotator/anchoring/html.ts`
- `src/annotator/anchoring/types.ts`
- `src/annotator/anchoring/pdf.ts`
- `src/annotator/anchoring/test/html-test.js`
- `src/annotator/anchoring/test/pdf-test.js`
- `src/sidebar/helpers/annotation-metadata.ts`

Implemented pattern: annotations can carry multiple selectors describing the same source region. PDF tests expect `PageSelector`, `TextPositionSelector`, and `TextQuoteSelector` together. HTML anchoring tests explicitly cover a failed range selector with a successful quote-selector fallback. The annotation remains one annotation; alternate selectors are recovery descriptions, not independent evidence objects.

### BORROW
- Keep Catalyst's annotation/source-region UUID canonical, but consider storing more than one independent return descriptor when a source format can be reflowed, normalized, or re-rendered.
- Make fallback order explicit and testable: exact structural/range return first; alternate descriptor only if the stronger locator fails.
- Preserve the invariant that several locators for one region do **not** imply several corroborating sources.

### REJECT
- Do not replace the now-closed Catalyst source-region identity model with fuzzy quote matching.
- Do not make recovery selectors visible as analyst-authored semantic relationships.
- Do not reopen source identity implementation unless a real exact-return regression justifies it.

Why this matters: this is a future resilience precedent only. The current Catalyst source identity work is already closed; Hypothesis shows how it could be hardened without changing that architecture.

## 7. Cytoscape.js — supporting edge-portrayal mechanism, not a product template

Repository: https://github.com/cytoscape/cytoscape.js

Observed source revision: `7ba634095d8954089ee5dc09ada0030f2dca134c`; current default branch `unstable`. Repository metadata reports MIT.

Exact files/components worth reading:
- `src/style/properties.mjs`
- `documentation/md/style.md`
- `index.d.ts` edge-style definitions

Implemented pattern: edge stroke, dash, color, source/target endpoints, arrows, and curve style are independent portrayal properties. This makes edge class a data-driven renderer concern rather than something inferred from node geometry.

### BORROW
- Keep structural and semantic edge classes explicit in data and route them through separate style/rendering presets.
- Permit endpoint/routing logic to depend on edge class and branch orientation without changing the underlying relationship record.

### REJECT
- Do not expose Cytoscape's broad edge-style matrix as end-user customization. Catalyst needs a small, opinionated visual grammar that analysts can learn at a glance.
- Do not use graph auto-layout as the Working Picture's canonical placement.

## Cross-project synthesis for Catalyst

### A. Structural state should be explicit; geometry should remain derived
BlockSuite and Freeplane independently converge on the same invariant from very different architectures: sibling order is authored state, while ordinary branch coordinates are regenerated. BlockSuite strengthens the case for an explicit rank field because its structure is layered over a general canvas rather than embodied only by XML/tree child order.

Catalyst implication: the active sibling-order work should prefer an occurrence-local rank/order key with deterministic legacy fallback. Reorder should be an explicit structural command/target. Spatial movement remains placement-only.

### B. Focus should change the lens, not the record
Trilium hoist, Godot distraction-free mode, and JupyterLab single-document mode all separate temporary focus from underlying content/workspace identity. Godot additionally proves that transient hidden state should not overwrite the user's normal layout.

Catalyst implication: a future **Focus branch / Focus source / Reader-first** command should save view context and return context, suppress irrelevant shell/map material, and restore the prior view without changing parent IDs, semantic relations, provenance, or ordinary panel layout.

### C. Semantic zoom should suppress detail, not shrink cognition
Trilium's rendering code is the clearest precedent: labels only partially follow zoom, icons appear above a screen-space threshold, peripheral material fades during local inspection, and full titles remain available by hover when not fully drawn.

Catalyst implication: keep the current Fit-picture structural overview behavior. Strengthen information scent with stable icons/glyphs and hover/focus reveal rather than trying to render every label at readable scale.

### D. Iconography should be a compact visual vocabulary
Godot demonstrates a maintainable FOSS pattern: original SVG assets plus centralized theme conversion, saturation, and scale. Trilium demonstrates cross-representation reuse of a note's icon as an identity cue.

Catalyst implication: create a bounded SVG vocabulary for object/action categories that repeatedly need preattentive recognition. Candidate first set: source/provenance, evidence, thought/assessment, open question, semantic relation, authored branch, free occurrence, fold/unfold, organize branch, reorder, focus/hoist, exact-return/open-source, and warning/conflict. Keep them mostly monochrome/theme-mapped; reserve semantic color for analytical meaning.

### E. Progressive disclosure should follow context, not menu accumulation
Penpot shows that workspace aids can be explicit flags while object-specific actions live on contextual surfaces. JupyterLab shows that commands need not require permanent toolbar residency.

Catalyst implication: do not answer the current density problem with another permanent toolbar. High-frequency global controls may stay visible; selected-occurrence, branch-maintenance, provenance, and low-frequency commands should surface through selection-local actions, inspector sections, context menus, keyboard shortcuts, or command search.

### F. Edge portrayal needs a deliberately small grammar
BlockSuite's local structural connectors, Trilium's relation projection, Freeplane's orientation-aware forks, and Cytoscape's independent edge-style channels converge on one implementation rule: edge meaning should select the renderer, not be inferred from where a line happens to run.

Catalyst implication: keep at least these channels visibly distinct:
- authored structural branch;
- explicit semantic relationship;
- provenance/source-return affordance, if shown on the map at all;
- temporary interaction preview (drag/reorder/focus), which must disappear if not committed.

Do not add a user-selectable edge-style palette unless research later demonstrates a real analytical need.

## Recommended priority for the main UI track

1. **Immediate:** finish explicit sibling order/reorder using an occurrence-local order key; BlockSuite is the strongest web-source precedent.
2. **Immediate visual pass:** introduce a small SVG icon vocabulary for map/object/action landmarks, centrally theme-mapped for the current dark shell. Test at normal zoom and Fit-picture overview.
3. **Immediate interaction pass:** use selection/hover to reveal local controls and de-emphasize unrelated material rather than increasing permanent chrome.
4. **Near-term:** prototype reversible Focus/Hoist or distraction-reduced reader/map mode that preserves and restores ordinary shell state.
5. **Near-term:** formalize structural-vs-semantic edge renderer presets and verify they remain distinguishable in dense populated maps.
6. **Later/resilience only:** consider redundant source-region return descriptors in the Hypothesis style if a real mutable-source failure appears; do not reopen the closed exact-return work preemptively.

## Explicit non-goals from this pass

- no mandatory universal tree;
- no force-layout replacement for authored Working Picture placement;
- no implicit hierarchy from ordinary drag;
- no decorative icon/color explosion;
- no generic dock/plugin architecture;
- no graph-style configuration panel;
- no provenance rewrite;
- no Catalyst product-code changes in this research chat.

Pass complete.

## Accepted implementation follow-up — contextual attention filtering

The Trilium-derived attention-filtering slice is now live-validated and closed on 2026-09-13. Catalyst keeps the hovered analytical object, its structural parent/children, and its direct semantic neighbours fully emphasized while unrelated occurrences and structural branches dim. The incident semantic relationship is revealed only for the active neighbourhood; pointer leave restores the neutral map.

The nine-object grammar fixture was tested by hovering `Key assumption`. At both Fit (82%) and working zoom (106%), only `Analytical issue`, `Key assumption`, and semantic neighbour `Competing hypothesis` remained undimmed. The other six objects and six unrelated structural branches dimmed; one `contradicts` semantic edge appeared; pointer leave returned node/branch dim counts and semantic-edge count to zero.

The earlier report of zero dimmed nodes/branches was a validation-probe defect, not a product defect. The headless browser viewport had reverted to 604×350 after the prior CDP session closed, while the probe targeted a node around x≈701. The corrected acceptance probe explicitly establishes 1440×900 metrics before resolving hit coordinates and verifies `elementFromPoint` resolves `Key assumption` before dispatching the mouse move.

Artifacts: `tools/research-probes/2026-09-13/attention_filter_acceptance.mjs`, `attention-filter-fit-before.png`, `attention-filter-fit-assumption-hover.png`, `attention-filter-working-before.png`, and `attention-filter-working-assumption-hover.png`. `npm run check:web` passes after the accepted slice; only the existing EmbedPDF `crypto` externalization and large-chunk build warnings remain.
