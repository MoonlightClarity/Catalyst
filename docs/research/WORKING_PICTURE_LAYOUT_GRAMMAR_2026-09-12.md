# Working Picture layout grammar — 2026-09-12

Status: bounded FreeMind/Freeplane comparison against current Catalyst implementation; broad mind-map research intentionally not restarted.

## Core conclusion

Catalyst already contains most of the mechanics needed for a mature branch portrayal: deterministic sibling order, subtree-sized spacing, local folding, curved branch routing, and automatic reflow after authored structural changes. The organizational weakness is therefore not the absence of a layout algorithm. It is the lack of an explicit portrayal grammar separating three states that currently coexist on one surface.

1. **Free occurrence** — placement only; no parent or semantic commitment.
2. **Authored branch** — explicit parent/child structure; eligible for predictable automatic organization.
3. **Manual branch portrayal** — authored structure remains, but one or more occurrences have deliberate manual coordinates.

Movement must continue to author only placement. It must never infer branch membership or semantic relation.

## FreeMind/Freeplane mechanisms worth retaining

- Sibling order must be deterministic and stable. Catalyst currently derives this from note creation time plus ID, effectively preserving insertion order without extra ontology.
- A branch should consume vertical or horizontal span according to its visible leaf count, preventing sibling subtrees from colliding.
- Folding is local structural compression. Hidden descendants leave the portrayal but retain identity, authored structure, and cross-boundary semantic-link counts.
- Structural branches use curved routing, visually distinct from explicit semantic relationships.
- Reflow should be bounded to authored structure and invoked without rewriting the analytical record.

## Mechanisms Catalyst must reject

- Hidden parents beneath apparently free nodes.
- Dragging a node onto or near another node silently creating hierarchy.
- Continuous force layout that destroys stable analyst landmarks.
- Treating a tree root as the mandatory ontology for all analytical material.
- Global auto-arrange as the only way to recover branch legibility.

## Current implementation assessment

`src/map/layout.ts` already gives authored branches stable creation-order siblings, alternating root sides, subtree leaf-count spacing, local collapse, and automatic reflow. `src/picture/layout.ts` then maps the focal branch into Source / Assess / Open / Context territories while retaining authored branch identity and keeping unrelated roots peripheral.

Manual occurrence positions correctly override automatic portrayal. This is essential, but the previous recovery control was only global `map/layout-reset`, which erased all manual placements at once. That made automatic organization too coarse to function as a FreeMind-like portrayal tool.

## Change made in this pass

Added `map/branch-layout-reset` and a Working Picture **Organize branch** action. It clears manual coordinates only for the selected occurrence and its authored descendants. It does not change parent IDs, relationships, collapse state, unrelated free placements, or note identity.

A regression in `scripts/test-map.mjs` proves that organizing branch B returns B and descendant C to automatic portrayal while leaving unrelated manually placed D untouched and preserving C's authored parent B.

This makes branch organization an explicit portrayal operation rather than an ontological edit.

## Next layout refinements

Do not add automatic parent inference. The next useful refinements are visual/interaction-level: verify branch spacing against real dense maps; consider an explicit sibling reorder mechanism only if insertion-order stability proves insufficient; keep curved structural routing visually quieter than semantic edges; and expose local organize/fold actions without permanent toolbar density.

The dark-shell/reskin work can now proceed without depending on unresolved tree semantics. It should visually distinguish free occurrence, authored branch, and explicit semantic relation, rather than making every connector look equivalent.

## Validation

After the exact-return and branch-organization changes, the full Catalyst domain test suite and production build both pass on 2026-09-12.
## Dense portrayal validation — 2026-09-13

A dedicated 37-node mixed-territory stress pass exposed two concrete spacing defects in the previous portrayal grammar. First, top/bottom Context/Open siblings stepped only 148 world units while Working Picture occurrences reserve 216 units of width, producing 22 adjacent-node collisions in a 12+12 sibling case. Second, after fixing sibling width, populated Context/Open bands could still intersect a dense Assess side band near the center, producing eight cross-territory collisions.

The portrayal now centralizes the Working Picture occurrence footprint, uses node-footprint-aware row/column gaps, reserves radial separation for populated orthogonal territory bands, shifts the generated center when dense or deep structure needs additional top/left room, and sizes the render/playfield from generated portrayal extents rather than the older Map stage alone. This remains portrayal-only: no parent inference, semantic mutation, or force layout was introduced.

Permanent `scripts/test-map.mjs` regressions now cover dense Context/Open siblings, mixed Context/Open/Assess density, stage expansion, dense local branch organization, dense folding, and preservation of unrelated manual landmarks. The full `npm test` suite and `npm run build` pass after these changes.

A live isolated-browser proof on current `127.0.0.1:5173` seeded 37 authored occurrences, invoked Fit picture, and measured all rendered `.picture-occurrence` rectangles. It reported 37 rendered nodes and zero DOM-level rectangle collisions at the fitted 35% overview zoom. Artifact: `tools/research-probes/2026-09-13/dense-working-picture-live.png`; metrics: `dense-working-picture-live.json`; probe: `dense_working_picture_live.mjs`.

The screenshot confirms the intended semantic-zoom behavior: at 35% the Working Picture is structurally legible as territory/branch shape rather than readable prose, while labels/actions are suppressed by the existing overview portrayal. The next design pass should therefore judge the dark structural shell against this structural overview and against a closer working zoom, rather than trying to make every label readable at Fit picture scale.
## Dense-map validation — 2026-09-13

The first real density stress test exposed a concrete geometry defect in the Working Picture territory layout. Context/Open siblings were spaced 148 world units apart while the occurrence hit footprint is 216 units wide. A 24-node top/bottom stress case therefore produced 22 adjacent-node overlaps even though the underlying authored tree remained valid.

The portrayal now uses shared occurrence dimensions, footprint-aware row/column gaps, density-aware centering, and render/playfield extents derived from the generated Working Picture rather than the smaller base map. Mixed territory depth also pushes top/bottom branches outward when populated left/right territories need the central band.

A 37-node mixed fixture (12 Context, 12 Open, 12 Assess plus focus) now produces zero model-space overlaps and zero out-of-stage nodes. Permanent `scripts/test-map.mjs` coverage also verifies dense folding/local reflow and that organizing or folding one branch does not disturb an unrelated manually placed landmark.

## Contextual attention filtering — accepted 2026-09-13

The Working Picture now has a portrayal-only local attention filter. Hovering or selecting a non-focus analytical occurrence builds a temporary emphasis set from the occurrence, its authored structural parent/children, and direct semantic neighbours. Occurrences and structural branches outside that set dim; incident semantic relationships are revealed through the separate semantic-edge renderer.

This does not mutate coordinates, parentage, sibling order, relationship records, provenance, source identity, or focus state. The focus/root occurrence alone intentionally does not trigger global dimming. Search dimming remains an independent condition and composes with attention dimming.

A real-mouse headless acceptance run against the nine-object grammar fixture passed at Fit (82%) and working zoom (106%): `Key assumption`, parent `Analytical issue`, and semantic neighbour `Competing hypothesis` remained emphasized; the other six objects and six unrelated branches dimmed; the `contradicts` edge appeared; pointer leave restored the neutral map. Screenshots and the durable probe are under `tools/research-probes/2026-09-13/attention-filter-*` and `attention_filter_acceptance.mjs`.

The earlier apparent HMR failure was traced to probe geometry: CDP device emulation ended with the previous session, leaving a 604×350 viewport while the probe dispatched a mouse move beyond its right edge. The product implementation did not require correction. `npm run check:web` passes after closure.
