# Catalyst continuation — dense Working Picture — 2026-09-13

This pass resumed from the exact-source-return closure and moved directly into the bounded dense-map portrayal validation from `WORKING_PICTURE_LAYOUT_GRAMMAR_2026-09-12.md`.

## Defect reproduced

A 25-node synthetic authored structure with 12 `Context` and 12 `Open` children exposed a deterministic overlap defect in `src/picture/layout.ts`.

The prior vertical-territory spacing step was 148 world units while Working Picture occurrences reserve 216 pixels of width. The pre-change probe therefore produced 22 adjacent sibling collisions across the top and bottom territories.

Reproduction artifact: `tools/research-probes/2026-09-13/dense-layout-before.json` and `dense_working_picture_layout.mjs`.

## Change made

Working Picture spacing now derives from the actual reserved node footprint: 216×84 plus explicit breathing room. Dense top/bottom territories use a 252-unit column step; left/right territories use a 120-unit row step.

The focal center now shifts when a dense authored territory requires more room, preventing automatic nodes from being centered into negative coordinates. Peripheral portrayal follows that generated center, and both placement/render extents now expand to contain generated or manual positions without making manual outliers enlarge the future auto-placement playfield.

A permanent dense-map assertion was added to `scripts/test-map.mjs`: it builds the same 25-node shape, rejects every geometric overlap, and requires the render stage to expand beyond the 2200-unit minimum when necessary.

## Validation

The probe after the change reports 25 nodes, zero collisions, zero nodes outside the render stage, and a stage width of 3452 units. `node scripts/test-map.mjs` passes and `npm run build` passes. The full `npm test` gate also passed immediately before the permanent dense regression was added; the targeted map test and production build pass with that regression in place.

## Next boundary

Dense layout geometry is no longer the blocker for the dark structural-shell pass. Continue by composing the Working Picture as a paper-like analytical surface inside a higher-contrast dark application structure, while retaining the established distinction between authored structural branches and latent semantic relations. Evidence/source panes should remain high-contrast and visually separable from the PDF reader rather than sharing its surface color.
