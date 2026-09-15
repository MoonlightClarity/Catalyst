# Outline-first locked-map checkpoint — 2026-09-13

## Decision
Catalyst's analysis hierarchy is edited in the Outline. The Map is a locked, deterministic visualization of that hierarchy. Lateral semantic relationships are note metadata and are edited in the Note Inspector.

Canonical interaction order:

`Outline/tree -> Map projection -> semantic cross-links`

The Map remains interactive for selection, focus, pan/zoom, source opening, relationship display, and branch folding, but it is no longer the primary structural editor.

## Implemented
- Outline is the default Working Picture view.
- Outline owns create child/sibling, rename, reorder, indent/outdent, delete, and collapse.
- Outline title selection no longer implicitly jumps to the Map; an explicit Map action does.
- Map node drag, node resize, free-placement double-click creation, direct Branch, and direct Connect are gated off while the structure lock is enabled.
- Structural keyboard actions invoked from the Map route back to Outline.
- New-thought creation routes through Outline.
- Note Inspector exposes `Link thought` for semantic relationship creation.
- Existing relationship type, direction, navigation, and unlink controls remain note metadata.
- Semantic relationship edges remain visible on the Map but do not drive hierarchy layout.
## Validation
- `npm run build` passes.
- `node scripts/test-map.mjs` passes.
- `node scripts/test-visual-language.mjs` passes after updating the contract to the outline-first architecture.
- Live CDP probe: `tools/research-probes/2026-09-13/outline_locked_map_smoke.mjs` passes.

The live probe verifies a clean workspace defaults to Outline; creates a root and child through Outline; creates a semantic relationship from the Note Inspector; opens the locked Map; confirms two projected nodes, one semantic edge, zero resize handles, zero Branch/Connect map controls, and an unchanged node position after an attempted drag; then reloads and confirms XML persistence restores two outline rows with no alerts.

## Concurrency boundary
A parallel chat is actively working on Analysis geometry. The old map manipulation implementation remains underneath the `MAP_STRUCTURE_LOCKED` gate so geometry work is not destructively removed during convergence. Once the geometry pass settles and this architecture is accepted, dead direct-manipulation code can be removed in a separate cleanup pass.

## Next
1. Preserve hierarchy as the stable structural backbone.
2. Treat semantic links as overlays/metadata that never determine structural placement.
3. Merge the parallel geometry pass beneath the locked projection model.
4. After convergence, remove obsolete freeform-map editing code and manual-position persistence if no rollback need remains.
## Fixed-scale map decision
- User-controlled Working Picture zoom has been removed.
- The map compatibility camera is pinned to `zoom: 1`; pan/focus/center remain.
- Wheel input pans only; zoom buttons, percentage display, scale-dependent portrayal, and stage `scale(...)` transforms are removed.
- `test-visual-language.mjs` and `test-map.mjs` pass with the fixed-scale contract.
- Live probe previously confirmed `zoomControls: 0`, `stageHasScale: false`, locked node drag, semantic-link rendering, and XML reload.
- A later forced-reload probe could not mount Catalyst because a concurrent annotation refactor left `App.tsx` uncompilable (`VIEWER_ANNOTATION_TOOLS` missing). Treat that as an annotation-lane integration blocker, not a map regression.
