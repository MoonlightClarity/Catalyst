# Structured Analytic Techniques Catalog — Checkpoint 2026-09-14

## Controlled-vocabulary baseline

- 581 live built-in techniques after semantic consolidation, normalized-name deduplication, and two theory-derived expansion tranches.
- 27 visible clusters spanning intelligence and a broad interdisciplinary method library.
- 486 live catalog entries have method-specific guided workflows; every live catalog entry resolves to a specific workflow.
- `scripts/test-technique-catalog.mjs` now validates live-name uniqueness, workflow uniqueness, full catalog workflow coverage, alias retirement, alias collisions, and navigation metadata integrity.
- Full production build passes on the current tree.

## Semantic consolidation pass

The catalog now treats alternate names as aliases instead of separate methods when the analytic procedure is materially the same. The retirement registry currently maps: Change Driver Mapping → Drivers of Change Analysis; Bias Checklist → Cognitive Bias Audit; Scenario Cross → 2x2 Scenario Matrix; Implications Wheel → Futures Wheel; Abductive Reasoning Matrix → Inference to the Best Explanation; Risk Bowtie Review → Bow-Tie Analysis; Feedback Loop Audit → Causal Loop Mapping; Scenario Analysis and Exploratory Scenario Planning → Alternative Futures Analysis; and Regret Analysis → Minimax Regret.

Useful procedural detail from retired variants was folded into the canonical method before removal. Examples include barrier degradation/assurance in Bow-Tie Analysis, evidence-quality and loop-dominance checks in Causal Loop Mapping, and broader scenario monitoring in Alternative Futures Analysis.

## Navigation and metadata integrity

Retired names remain searchable through `RETIRED_TECHNIQUE_ALIASES`. Catalog guidance no longer depends on a raw workflow-count quota. Navigation metadata is tested against the live vocabulary so task recommendations, family-next suggestions, relationships, playbooks, prerequisites, and references cannot silently point at missing techniques.

## Theory-derived methods pass

Sixteen new procedures were added from documented conceptual gaps rather than author-name expansion. Ellul contributes efficiency-imperative, technological-system-autonomy, propaganda-environment, and agitation/integration analyses. Taleb contributes fragility/antifragility, fat-tail exposure, via negativa, skin-in-the-game, serial optionality, and barbell exposure methods. Schelling contributes strategic commitment and focal-point coordination; Ostrom contributes commons-design and polycentric-governance audits; Ashby contributes requisite-variety analysis; and Stafford Beer contributes Viable System Model diagnosis.

A second seven-method tranche adds Boyd's OODA decision-cycle analysis, Simon's bounded-rationality/satisficing audit, Klein's recognition-primed decision audit, Perrow's interactive-complexity/tight-coupling audit, Scott's legibility/local-knowledge audit, Hirschman's exit–voice–loyalty analysis, and a combined Goodhart–Campbell metric-gaming audit.

The methods remain inside existing functional clusters rather than a separate “thinkers” category. Author names and alternate terminology are exposed through aliases and provenance references. The first workflow-similarity audit found no high-overlap duplicate: the strongest new/existing pair was Commons Governance Design Audit versus Tragedy of the Commons Analysis at 0.360. The second-tranche audit was even cleaner: its highest new/existing similarity was 0.087.

## Workflow integration pass

The theory-derived methods are no longer dependent on search alone for discovery. Four new analyst-intent playbooks are exposed through the existing Workflow selector without increasing raw catalog size: **Make a rapid operational decision** (OODA → recognition-primed decision → premortem → after-action review), **Assess complex-system failure risk** (interactive complexity/tight coupling → requisite variety → STPA → resilience engineering), **Audit metrics and incentives** (Goodhart–Campbell → skin in the game → measurement-system analysis → exit/voice/loyalty), and **Design governance under complexity** (legibility/local knowledge → commons governance → polycentric governance → exit/voice/loyalty).

The seven second-tranche theory-derived methods now also have explicit prerequisites. This makes suitability and metadata panels communicate when a method is appropriate instead of presenting every technique as equally ready to run.

## Validation

- `node scripts/test-technique-catalog.mjs` passes: `581 techniques, 27 clusters, 486 deep workflows`.
- Regression assertions cover both theory-derived tranches, source metadata, the new prerequisites, and the four new cross-method playbooks.
- `npm run build` passes with only the existing EmbedPDF `crypto` externalization and large-chunk advisory warnings.
- Stable technique IDs and historical `TechniqueRun` snapshots remain preserved for existing methods.

## Next pass

Prioritize catalog usability over count expansion. The next useful work is to audit task recommendations, cluster labels, and family-next navigation for underrepresented analyst intents, then consider Weick-style sensemaking or high-reliability-organization diagnostics only where a workflow-level gap remains after that integration audit.