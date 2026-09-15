# Structured Analytic Techniques Catalog — Checkpoint 2026-09-13

## Current baseline

- 567 unique built-in techniques after normalized-name deduplication.
- 27 visible clusters spanning intelligence and a broad interdisciplinary method library.
- 432 catalog techniques now have method-specific guided workflows.
- `scripts/test-technique-catalog.mjs` enforces a minimum of 432 deep workflows plus representative resolver assertions.
- Every catalog cluster except the two humanities clusters is now fully method-specific.

## Latest operational-method pass

Quality / process improvement is now 20/20. Dedicated workflows cover DMADV, Kaizen events, process capability, control charts, measurement systems and Gage R&R, Taguchi robust design, mistake-proofing, standard work, takt, bottlenecks, and Theory of Constraints trees/clouds.

Policy, economics, geospatial, legal, and operations research are each now 10/10. These passes preserve distinctions between policy appraisal and implementation logic; elasticity, welfare, market structure and strategic interaction; density/autocorrelation/viewshed/path/network/siting/change analysis; precedent/rule/elements/proportionality reasoning; and optimization, simulation, Markov, dynamic-programming, transportation, assignment, and inventory models.

Human-centered design is now 20/20. Dedicated workflows distinguish personas, contextual inquiry, diary and critical-incident analysis, journey/experience/story mapping, opportunity-solution trees, HMW framing, SCAMPER, Six Thinking Hats, design studio, Crazy Eights, concept screening/scoring, and Kano analysis.

## Validation

- `node scripts/test-technique-catalog.mjs` passes: `567 techniques, 27 clusters, 432 deep workflows`.
- Coverage audit reports 100% method-specific workflows in every non-humanities cluster.
- `npm run build` passes on the current tree.
- Stable technique IDs and historical `TechniqueRun` snapshots remain preserved.

## Remaining catalog work

Only two catalog clusters remain partially templated: Language, discourse & media (1/20 deep) and Historical, comparative & interpretive methods in religious studies (1/20 deep). Completing the 38 remaining generic humanities methods would bring the catalog source-workflow count to 470 while preserving the existing 567-name breadth.

After humanities fidelity is complete, stop expanding workflow count mechanically and shift attention to catalog metadata, provenance/citations, discoverability, aliases, prerequisites, estimated effort, evidence requirements, output types, and technique-to-technique recommendations. Raw technique expansion beyond 567 should occur only if a documented gap is found.

## Build status

Full production build passes. Remaining output is advisory only: the existing EmbedPDF browser-compatibility warning for externalized `crypto` and Vite's large-chunk warning.