# Catalyst documentation map

Catalyst treats documentation as part of implementation. Current behavior, persistence boundaries, removed surfaces, validation, and migration/compatibility debt must be discoverable without reconstructing the full alpha history.

## Current authority set

Use this order for implementation and release decisions:

1. newer accepted ADRs, especially ADR 0026, ADR 0027, and ADR 0028;
2. `CURRENT_ARCHITECTURE.md` — mounted product/runtime source of truth;
3. `release-readiness.md` — current late-alpha → beta gate;
4. root `CURRENT_STATE.md`, `DECISION_LOG.md`, and `NEXT_STEPS.md`;
5. frozen Outline/Map/annotation ontology documents;
6. current implementation contracts such as `outline-authoring-system.md` and `techniques-workspace.md`;
7. historical alpha, research, acceptance, Working Picture, graph-first, and Tauri/SQLite material.

Historical documents remain evidence of why decisions were made. They do not restore superseded product surfaces.

## Current documentation set

| Area | Document | Status |
| --- | --- | --- |
| Product/runtime | `CURRENT_ARCHITECTURE.md` | **Current source of truth** |
| Release readiness | `release-readiness.md` | **Current beta-convergence gate** |
| Roadmap | `roadmap.md` | **Current stabilization roadmap** |
| Surface freeze | `adr/0027-late-alpha-surface-reduction.md` | **Accepted beta product boundary** |
| Export removal | `adr/0028-remove-derived-output-exports.md` | **Accepted current output boundary** |
| Assessment removal | `adr/0026-remove-assessment-product-scope.md` | **Accepted product-scope decision** |
| Outline semantics | `outline-ontology-v0.1.md` | **Frozen conceptual structural contract** |
| Map semantics | `map-ontology-v0.1.md` | **Frozen generated-projection contract** |
| Source/annotation semantics | `annotation-semantic-ontology-v0.1.md` | **Frozen conceptual boundary; UI projection may evolve** |
| Outline interaction | `outline-authoring-system.md` | **Current mounted interaction contract** |
| Methods / Techniques | `techniques-workspace.md` | **Current mounted Techniques contract** |
| Assurance | `assurance.md` | **Current validation/assurance contract** |
| Capability model | `capabilities.md` | Current progressive-disclosure contract |
| Domain compatibility | `domain-model.md` | Historical/compatibility model amended by newer ontologies/ADRs |
| Source handoff | `source-archive-standard.md` | **Current archive/handoff contract** |
| Research archive | `research/README.md` | Historical research/handoff index |
| Optional dev tooling | `development-tooling.md` | Development aid, not product dependency |

## Historical material

The former `roadmap.md` feature roadmap is preserved as `research/LEGACY_ROADMAP_PRE_BETA_CONVERGENCE_2026-09-15.md`. Dated beta guidance remains at `research/BETA_PRODUCTION_READINESS_GATE_2026-09-14.md` but is supporting history rather than the current gate.

`architecture.md` is intentionally reduced to a historical pointer. Working Picture, portrayal, mapping, representation, navigation, and 0.6.x acceptance documents are non-normative where they conflict with ADR 0027 or the current architecture snapshot.

Older ADRs are not deleted merely because they were superseded. Read them as decision history; later accepted ADRs and the current authority set govern conflicts.

## Documentation rules

- Describe mounted behavior as implemented; mark future work as planned.
- A historical filename, test name, type name, or component name does not establish current product scope.
- Product-surface retirement does not ban legitimate analytical vocabulary. Techniques may contain terms such as “assessment” or “evidence.”
- Do not infer Outline hierarchy from analytical relationships or Map geometry.
- Do not describe Tauri/SQLite as an active prerequisite.
- Keep session-file operations distinct from source-PDF operations. Save/Load are persistence, not derived-output export.
- Update the relevant current contract when behavior changes rather than adding another competing design document.

## Documentation still required before 1.0

Release-quality documentation still needs complete persisted-field/schema/version history, recovery/corruption procedures, source-anchor/version semantics, methodology/version references for built-in techniques, accessibility guidance, active-runtime security/threat modeling, release/build provenance, file persistence/recovery contracts, and a user-facing guide for the supported workflow.

Those gaps are production-hardening work. They are not reasons to restore retired alpha product concepts.
