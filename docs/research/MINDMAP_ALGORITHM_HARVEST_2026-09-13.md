# Catalyst Mind-Map Algorithm Harvest Research — 2026-09-13

## Decision

Do not replace Catalyst's Working Picture renderer at this stage.
Preserve Catalyst's canonical analysis/map model, visual language, semantic relationships, source traces, inspector integration, and manual occurrence positions.
Adopt or reimplement mature algorithms behind the existing `src/picture/*` seams instead.

## Why the decision changed

Catalyst's current Working Picture is already more than a generic mind map. It renders structural branches separately from semantic relationships and already supports typed relationships, focus navigation, collapse state, branch-side authorship, manual placement, evidence traces, confidence/semantic roles, camera persistence, search attention, and an inspector.

The current implementation is also well separated:
- `src/picture/layout.ts` — automatic structural layout and periphery placement.
- `src/picture/geometry.ts` — structural and semantic SVG paths.
- `src/picture/drag.ts` — drag-frame calculation and commit resolution.
- `src/picture/placement.ts` — bounds, snapping, and drop validation.
- `src/picture/camera.ts` — focus, fit, and zoom-at-pointer transforms.
- `WorkingPictureWorkspace.tsx` — React interaction and presentation shell.

This means individual algorithms can be upgraded without changing Catalyst's data ownership or replacing the UI.

## Highest-value immediate candidate: d3-hierarchy

`d3-hierarchy` is a small public ISC-licensed package for hierarchical layout. Its tree layout is based on the Reingold-Tilford tidy-tree family and is appropriate for Catalyst's currently fixed 216x84 Working Picture nodes.

Recommended use: replace only the recursive leaf-count placement inside `placeFreeplaneStructure`, not the rest of `workingPictureLayout`.
## Proposed structural-layout adapter

1. Build the visible structural hierarchy from Catalyst `mapView` occurrences.
2. Preserve authored sibling order before layout.
3. Divide the focus node's direct children into left and right sets using `branchSide`; use Catalyst's automatic side rule when unset.
4. Run tidy-tree layout independently for each side.
5. Mirror the left side across the focus node.
6. Translate both outputs around Catalyst's existing focus center.
7. Leave `occurrence.manual && occurrence.position` as a final override exactly as today.
8. Keep peripheral/non-focus nodes under Catalyst's existing policy rather than forcing them into the tree.

This preserves Catalyst semantics while replacing only the weakest bespoke geometry.

## Mind Elixir: research source, not renderer dependency

Mind Elixir remains valuable because its 2026 releases document solutions to interaction problems Catalyst is approaching. In v5.11.x it introduced a pointer-interaction state machine, coordinated canvas/selection behavior, unified node-drag ghost positioning, pointer-cancel handling, and consolidated touch helpers. Later releases include drag-abort behavior that falls back to panning.

Catalyst already has the beginnings of the same states, but they are represented independently as `nodeDrag`, `panDrag`, `connectingFromId`, and `editingNoteId`. Replace these eventually with a Catalyst-owned discriminated interaction state instead of embedding Mind Elixir.

Candidate states:
- Idle
- Panning
- DraggingNode
- Connecting
- EditingTitle
- Selecting (when multi-selection is introduced)
- StructuralDropPreview (later)

The transition rules should be testable outside React.
## xyflow / React Flow: geometry reference, not direct system dependency

`@xyflow/system` contains reusable pan/zoom, node-drag, handle/connection, minimap, DOM measurement, marker, graph, and edge-path utilities, and it is MIT licensed. However, its own README states that the package is the shared vanilla layer for React Flow/Svelte Flow and is not intended for unrelated libraries. It is also currently versioned `0.0.x` and lacks a dedicated public API reference.

Recommendation: do not make Catalyst depend directly on `@xyflow/system` now. Study or port narrowly scoped algorithms when Catalyst actually needs them, especially smooth-step or handle-aware edge routing. Preserve attribution/license notices when source is substantially reused.

Catalyst's current cubic branch routing is simple and readable. Do not replace it merely for feature parity.

## Other layout candidates

- `@dagrejs/dagre`: MIT, actively maintained, directed-graph layout. Good future candidate for a separate link-analysis/flow view, not the current bilateral mind-map structure.
- `elkjs`: very capable layered graph layout, but current package licensing is EPL-2.0 OR GPL-3.0-or-later. Avoid adding it casually while Catalyst is maintaining a simple permissive dependency posture.
- `d3-flextree`: variable-size linear-time tidy tree, but latest release is from 2018 and the package is substantially older. Useful algorithm/reference if Catalyst later allows strongly variable node dimensions; not the first dependency to add.
- WebCola: MIT constraint-based graph layout; potentially useful for a future free graph/link-analysis mode, but not required for the current Working Picture.

## Dependency policy from this pass

Prefer mature, narrow public packages with stable licenses and APIs.
Do not add a large canvas framework solely to obtain one algorithm.
Do not depend on another project's undocumented/internal package when a small Catalyst implementation can isolate the useful behavior.
Keep rendering, state ownership, and domain semantics Catalyst-owned.

## Recommended implementation order

First: prototype a `d3-hierarchy` bilateral tidy-tree adapter behind `workingPictureLayout` and compare it against the existing placement on the map tests.
Second: formalize the existing pointer modes into a Catalyst interaction state machine without changing visible behavior.
Third: add structural drag/reparent/drop-intent only after layout and basic dragging are stable.
Fourth: evaluate Dagre only when a genuinely non-hierarchical link-analysis layout is being implemented.
## Sources reviewed

- Mind Elixir Core releases: https://github.com/SSShooter/mind-elixir-core/releases
- Mind Elixir Core repository: https://github.com/SSShooter/mind-elixir-core
- xyflow system README: https://github.com/xyflow/xyflow/blob/main/packages/system/README.md
- xyflow system package metadata: https://github.com/xyflow/xyflow/blob/main/packages/system/package.json
- xyflow smooth-step edge implementation: https://github.com/xyflow/xyflow/blob/main/packages/system/src/utils/edges/smoothstep-edge.ts
- d3-hierarchy package metadata: https://github.com/d3/d3-hierarchy/blob/main/package.json
- Dagre repository/package metadata: https://github.com/dagrejs/dagre
- elkjs repository/package metadata: https://github.com/kieler/elkjs
- d3-flextree repository: https://github.com/Klortho/d3-flextree
- WebCola repository: https://github.com/tgdwyer/WebCola

## Working conclusion

Catalyst should stop trying to become Freeplane, Mind Elixir, or React Flow internally. It has reached the point where its differentiated analytical model is worth preserving. The practical route is a Catalyst-owned renderer built on well-defined internal algorithm boundaries, with narrow external layout dependencies only where they clearly outperform the bespoke implementation.

The first experiment should therefore be algorithmic, reversible, and small: tidy-tree placement behind the current `workingPictureLayout`, leaving every surrounding behavior intact.