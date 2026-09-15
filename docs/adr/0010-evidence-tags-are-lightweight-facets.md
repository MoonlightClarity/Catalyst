# ADR 0010 — Evidence tags are lightweight facets

## Status
**Historical 0.6 alpha decision.** The standalone Evidence workspace described below is retired under ADR 0027. Any surviving tag/facet data is compatibility/domain history, not a current Evidence navigation surface.

## Context
Dense highlighting can become visually noisy before the analyst is ready to create formal claims, entities, or typed relationships. Requiring ontology decisions at capture time would increase cognitive load.

## Decision
Catalyst supports optional user-defined tags on saved evidence. Tags are lightweight facets used for clustering, filtering, and search. They do not assert analytical truth, relationship semantics, source reliability, or object type.

The first tag is used as the default evidence-list cluster. Additional tags remain searchable/filterable. Tags survive normal application restarts and are stored as workspace metadata during this compatibility phase.

## Consequences
- Analysts can capture freely, then organize after the fact.
- The Evidence view can collapse many highlights into meaningful analyst-defined clusters.
- Tags do not replace typed graph relationships or analytical roles.
- A future generic facet model may subsume annotation tags; the current storage representation is intentionally reversible.
