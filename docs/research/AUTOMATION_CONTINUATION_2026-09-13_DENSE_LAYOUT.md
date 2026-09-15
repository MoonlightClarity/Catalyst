# Catalyst continuation — dense Working Picture layout — 2026-09-13

Status: implementation, permanent regressions, full test/build gate, and live browser proof completed.

## Defect found

The Working Picture territory layout was subtree-aware but its top/bottom sibling unit was only 148 world units while a Working Picture occurrence occupies a 216-unit hit width. A synthetic map with 12 Context and 12 Open siblings reproduced 22 adjacent-node collisions.

After widening sibling spacing, a mixed map with 12 Context, 12 Open, and 12 Assess children exposed a second defect: eight cross-territory collisions where the top/bottom bands crossed the dense central side band.

## Change

`src/picture/layout.ts` now derives spacing from the actual Working Picture occurrence dimensions (`216 x 84`) rather than unrelated magic gaps. Those dimensions are exported and reused by `WorkingPictureWorkspace.tsx`, preventing layout and interaction geometry from drifting apart.

Dense territory groups now choose a portrayal center from their actual span and branch depth. Context/Open first-level branches move farther from the focus when side territories need the central vertical band, while deeper vertical branches retain predictable depth spacing. Render and placement extents grow from generated positions instead of clipping a portrayal that legitimately exceeds the old fixed minimum.
## Permanent regressions

`scripts/test-map.mjs` now covers three density invariants. Dense Context/Open siblings must not overlap and must expand the render stage; mixed Context/Open/Assess territories must remain collision-free; and local branch organization/folding under density must reflow only the authored branch while preserving an unrelated manual landmark.

This keeps the change portrayal-only. No parent inference, force layout, relationship mutation, or movement-to-hierarchy behavior was introduced.

## Validation

The complete `npm test` suite passes, including the new dense-layout assertions. `npm run build` also passes. Vite still has a single listener on `127.0.0.1:5173`.

A live CDP probe seeded a disposable 37-node browser workspace, opened the actual Working Picture, invoked **Fit picture**, measured every rendered `.picture-occurrence` DOM box, and found zero collisions. It then restored the previous browser workspace.

Live artifacts:
- `tools/research-probes/2026-09-13/dense_working_picture_live.mjs`
- `tools/research-probes/2026-09-13/dense-working-picture-live.json`
- `tools/research-probes/2026-09-13/dense-working-picture-live.png`

At 1440×900 with the PDF/analysis shell present, Fit picture selected 35% zoom. The screenshot confirms the intended overview property: branch topology is legible before labels are readable. The next UI refinement should therefore improve the semantic zoom transition between overview and working scales rather than forcing full label density into overview mode.
