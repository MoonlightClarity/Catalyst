# Catalyst coded SVG research batch — 2026-09-13

Status: research-only; not production-approved notation.

Three additive coded SVG corpora were generated without image-generation tooling:

- `public/generated/catalyst-svg-research-20260913-code-batch-b/` — 1,672 concept SVGs plus 7 category contact sheets.
- `public/generated/catalyst-svg-research-20260913-primitives/` — 2,352 primitive/edge/junction/mark/reduction SVGs.
- `public/generated/catalyst-svg-research-20260913-node-grammar/` — 936 frame/modifier/provenance compositions.
- Landing page: `public/generated/catalyst-svg-research-index.html`.

Total SVG files across the three corpora including contact sheets: **4,967**. XML parse validation failures: **0**.

Generators are durable and rerunnable:

- `tools/svg-research/generate-svg-research.mjs`
- `tools/svg-research/generate-svg-primitives.mjs`
- `tools/svg-research/generate-node-grammar.mjs`

The batches intentionally include duplication and mutually incompatible treatments. Their purpose is comparison and pruning against the current Catalyst portrayal constraints: monochrome survival, geometry-first recognition, structural/semantic edge separation, explicit provenance, coherent junction/terminal language, and readable small-size reductions. Nothing in these directories should be interpreted as assigning permanent meaning to a specific line style, terminal, color, node silhouette, or brand mark.