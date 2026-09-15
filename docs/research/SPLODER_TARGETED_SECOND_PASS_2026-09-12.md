# Sploder targeted second pass — 2026-09-12

Status: bounded follow-up from user-supplied files; not a broad research restart.

## Sources inspected
- `NetworkNode.as`
- `PolyPoint.as`
- `PolyEdge.as`
- `saveproject.php`
- `thumb.php`
- `getprojects.php`
- `getgamedata.php`

The ActionScript is treated as direct implementation evidence from the supplied extracted files. The PHP files appear to come from a later/open implementation path and are useful as mechanism evidence, not as proof that the original Sploder backend behaved identically.

## New finding 1 — structure and spatial occurrence can coexist cleanly
`NetworkNode` stores explicit parent/child structure while every node also has an independent x/y placement.
Shift-press creates a child and immediately begins spatial placement; ordinary drag changes occurrence geometry while live connector geometry updates.
Recursive serialization preserves both hierarchy and positions.

Catalyst implication: this strongly supports the existing separation of authored structure from spatial occurrence. A branch gesture may author structure intentionally, while subsequent movement must remain portrayal/placement rather than silently rewriting structure.
## New finding 2 — direct-manipulation handles are scale-independent
`PolyPoint` continuously counter-scales its handle against the ancestor zoom, keeping control points usable while the authored geometry changes scale.
While a point is dragged, neighboring edges recompute position, length, rotation, and arrowhead scale live.
Default movement snaps to a 20-unit grid with a modifier/toggle escape for precision; local gestures insert/remove control points without a separate global editing mode.

Catalyst implication: relationship and portrayal editing should use stable-screen-size handles and local insertion/edit gestures. Connector affordances should remain legible regardless of zoom or relationship length. This is more relevant than copying Sploder's visual style.

## New finding 3 — canonical state can generate multiple derived portrayals
The supplied save/thumbnail path saves the project state and then derives visual images from that state.
The renderer normalizes authored bounds into a fixed 880×880 render space, overlays objects from canonical ids/coordinates, downsamples an overview, and separately generates a focal thumbnail centered on a designated object when available.

Catalyst implication: previews, navigator thumbnails, case/library cards, and overview miniatures should be deterministic derived projections of analytical state rather than stored screenshots becoming a second source of truth.
A compact preview may legitimately use a different crop/focus policy from the full Working Picture while preserving the same underlying analytical record.
## New finding 4 — project index and project body are separate
`getprojects.php` returns lightweight project descriptors (id, source reference, title, date/time) rather than embedding project state in the list response; newer creator versions page that index dynamically.
`getgamedata.php` likewise exposes small session/game metadata separately from the editable project representation.

Catalyst implication: a future case/project library should not need to hydrate entire analytical records merely to show navigation. Stable record identity, lightweight metadata, and derived preview can form the library surface; the full issue/case state can load on demand.

## What this does *not* change
This pass does not restore a mind-map-first architecture and does not justify turning Catalyst into a generic vector editor.
The useful mechanics are separation and interaction grammar: structure vs occurrence, zoom-independent handles, deterministic derived portrayal, local editing, and lightweight project indexing.

The current priority remains:
1. preserve the reader-first shell decision and improve projection identity/legibility;
2. correct durable source-region identity vs analytical evidence role;
3. implement exact region-level source return;
4. only then use these Sploder findings where they solve concrete portrayal/relationship/library problems.

The pixel editor remains a plausible later portrayal-authoring mechanism, but this pass strengthens the rule that authored symbols/previews must remain projections over stable analytical identity.