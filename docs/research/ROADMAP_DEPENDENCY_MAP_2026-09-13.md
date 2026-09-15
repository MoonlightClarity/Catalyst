# Catalyst roadmap dependency map — 2026-09-13

Status: planning companion for parallel work. It defines dependency direction, not chat ownership.

## Critical path to the Functional Baseline

`Reader compile integrity`
→ `Analysis structural + visual contract reconciliation`
→ `source-first CSS/readability consolidation`
→ `Reader/annotation + persistence focused validation`
→ `production build + full test suite`
→ `runtime source-to-analysis acceptance`
→ **Functional Baseline accepted**

A parallel task belongs on this path only if the baseline cannot pass without it.

## Lane A — Analysis structure

Current purpose: finish the minimal mature structural grammar over the simplified node core.

Required before baseline:
- child/sibling creation;
- parentless free placement;
- deterministic order;
- promote/demote distinct from move earlier/later;
- fold/organize behavior;
- focus/back/home;
- placement independent from semantic relationships.

Later: richer layout adapters, dense-map optimization, non-spatial projection, advanced portrayal.

## Lane B — Reader/source workflow

Current purpose: provide one coherent Reader that preserves source identity and exact return.

Required before baseline:
- compile-clean Reader implementation;
- open source reliably;
- readable navigation/search/zoom basics;
- selection capture;
- stable annotation/evidence identity;
- exact return to supported source anchors;
- Reader state that does not redefine analytical identity.

Later: richer annotation management, sorting/filtering, broader format adapters, advanced viewer markup.

## Lane C — visual system

Current purpose: make the baseline legible, not finish every visual asset.

Required before baseline:
- conventional readable typography;
- source/analysis boundary visibly understandable;
- active/inspect/focus states distinguishable;
- usable controls at normal scale;
- no color-only confidence/relationship semantics.

Later: final SVG family, full portrayal candidate selection, advanced semantic zoom, complete native branding polish.

## Lane D — persistence/runtime

Current purpose: keep recovery reliable while testing alternatives without forcing a migration.

Required before baseline:
- current accepted persistence path preserves notes/evidence/source links/map state;
- recovery journal and corruption handling behave predictably;
- no known data-loss defect in the ordinary workflow.

Parallel research allowed:
- XML serialization/repository viability;
- SQLite simplification/hardening;
- Tauri/runtime replacement research.

Decision point comes **after** the Functional Baseline unless persistence itself prevents baseline acceptance.

## Lane E — analytical methods and semantics

Current purpose during baseline: preserve existing capability without widening the critical path.

May proceed in isolated modules/data:
- technique catalog expansion;
- literary/religious/interdisciplinary methods;
- provenance/uncertainty research;
- confidence/relationship semantics design.

Do not require new ontology/schema complexity merely to finish the baseline UI.

## Lane F — continuity/development tooling

Current purpose: improve how Catalyst development work survives chat/process turnover without becoming product architecture.

Safe parallel work:
- structured checkpoints and handoffs;
- bounded-worker/lease/fencing research;
- source/research archive integrity;
- integration protocols and validation automation.

These tools support development velocity but are not analyst-facing Functional Baseline requirements.

## Post-baseline dependency order

After the baseline is accepted, the recommended dependency chain is:

1. **Structural maturity** — finish Freeplane-grade ordinary map behavior and reduce Analysis collision zones.
2. **Reader maturity** — finish Thorium-style annotation/list/editor/navigation decomposition.
3. **Portrayal consolidation** — integrate validated symbols, confidence/relation cues, semantic zoom, and curated assets.
4. **Persistence/runtime decision** — use measured evidence to decide XML/SQLite/runtime boundaries.
5. **Analytical semantics** — first-class provenance/evidence, inference, assessments, uncertainty, Watch/Scan.
6. **Projection views/interchange** — timeline, matrix/ACH, evidence table, reasoning/argument projections, export/import.
7. **Hardening** — accessibility, performance, security/threat model, backup/corruption/migration/release assurance.

Later stages may overlap experimentally, but an earlier stage must not be destabilized merely to demonstrate a later one.
