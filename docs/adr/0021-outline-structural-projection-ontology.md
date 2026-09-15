# ADR 0021 — Outline structural projection ontology

Status: **Accepted as conceptual architecture freeze**

Companion specification: `../outline-ontology-v0.1.md`

## Context

Outline-first authoring solved Catalyst's map usability problem, but the current alpha still stores structure through `MapOccurrence` records keyed by `noteId`. That compatibility model conflates analytical identity, one structural occurrence, fold state, and legacy map geometry.

Ontology research and break-testing exposed the core risk: if indentation, grouping, ordering, aliases, query views, semantic relationships, and map connectors are represented as one kind of edge or one kind of node, Catalyst will repeatedly manufacture analytical meaning from UI arrangement.

The 0.7 architecture already requires Outline-authored structure and a generated Map. This ADR freezes the smallest structural ontology needed to preserve that interaction model without making the Outline another analytical database.

## Decision

Catalyst separates **analytical identity** from **outline placement**.

The canonical Outline vocabulary is RootItem plus three item kinds: ReferenceItem, GroupItem, and QueryItem. RootItem is the structural projection of the owning AnalysisRoot and displays `AnalysisRoot.title`; Catalyst must not persist a second competing root title.

A ReferenceItem points to one AnalyticalItem and has independent structural parent/order. One AnalyticalItem may have multiple ReferenceItems; aliases share analytical content but not subtrees.

A GroupItem is structural scaffolding only. A QueryItem is a computed projection whose results are virtual until explicitly materialized.

Hierarchy, sibling order, grouping, fold state, and Map geometry do not imply analytical relationships, metadata, confidence, ranking, likelihood, chronology, or provenance.

Analytical relationships address AnalyticalItem identities, never OutlineItem identities. A rendered Map edge may bind a relationship to visible placements for portrayal, but that binding is view state and cannot alter relationship identity.

Catalyst 0.7 retains one canonical authored Outline per AnalysisRoot. Generic multiple-outline/map scaffolding remains rejected; future alternate contexts require an explicit semantic model.

## Mutation consequences

- create analytical thought: create AnalyticalItem + ReferenceItem;
- indent/outdent/reorder/move: structure only;
- alias: create another ReferenceItem to the same AnalyticalItem;
- remove from Outline: remove placement only;
- delete/archive analytical object: separate explicit domain operation;
- convert group to analytical object: explicit promotion, never inference;
- materialize query results: create ordinary ReferenceItems;
- query refresh: no canonical structural or analytical mutation.

The same AnalyticalItem may not recur twice on one ancestor path. Static outline structure must remain acyclic.

## Consequences

The 0.7 migration must replace note-keyed `MapOccurrence` structural storage with first-class placement IDs and move fold/focus/geometry into session/view state.

Current alpha behavior may remain as compatibility scaffolding until that migration. This ADR does not claim aliases, GroupItems, or QueryItems are already implemented.

Map structural connectors and analytical relationship connectors must remain semantically and visually distinguishable. Query results must not restructure the canonical generated Map by default.

Reopening this decision requires a concrete representational failure, not visual dissatisfaction or implementation convenience.
