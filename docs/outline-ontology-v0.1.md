# Catalyst Outline Ontology v0.1

Status: **Frozen conceptual contract — 2026-09-14; formal-Assessment references superseded by ADR 0026**

Companion decision: `adr/0021-outline-structural-projection-ontology.md`

## Purpose

This document defines what Catalyst's authored Outline is allowed to mean. It freezes the distinction between analytical identity, structural placement, generated/query views, semantic relationships, and presentation state.

The Outline is the primary structural authoring surface. The Map is a deterministic portrayal of the same authored structure; neither hierarchy nor map geometry is analytical truth.

This is a conceptual freeze, not a claim that the current alpha storage already implements every capability below. The current `MapOccurrence` model remains compatibility scaffolding until the 0.7 analytical-record migration.

## Governing rule

> **An analytical object is knowledge; an Outline item is a placement or structural instrument over that knowledge.**

Indentation, ordering, grouping, and map placement must never silently manufacture analytical assertions.

## Core layers

```text
Analytical record        authored structure       presentation
-----------------        ------------------       ------------
AnalyticalItem     <---- ReferenceItem             Outline UI
SemanticRelation         GroupItem                 generated Map
ReasoningAssertion       QueryItem                 fold/search state
Evidence / provenance    RootItem                  geometry/viewport
```

## Frozen structural vocabulary

### Outline

The authored ordered structural projection for one AnalysisRoot. Catalyst 0.7 has one canonical Outline per AnalysisRoot. Generic multiple-outline UI is not part of the frozen core; a future explicit analysis-context/view feature may add additional outlines without changing analytical identity.

### RootItem

The unique structural projection of the owning `AnalysisRoot`. Its displayed editable title is the `AnalysisRoot.title`; the Outline must not persist a second competing root title. RootItem is not an AnalyticalItem and cannot be the endpoint of analytical relationships.

### ReferenceItem

A structural occurrence that references exactly one AnalyticalItem.

```ts
type ReferenceItem = {
  id: string;
  kind: "reference";
  itemId: string;
  parentItemId: string;
  siblingOrder: number;
};
```

The same AnalyticalItem may be referenced by multiple ReferenceItems. Each placement owns its own parent/children/order; aliases share analytical content, not subtrees.

### GroupItem

A structural heading/container with no analytical identity.

```ts
type GroupItem = {
  id: string;
  kind: "group";
  label: string;
  parentItemId: string;
  siblingOrder: number;
};
```

A GroupItem cannot support, contradict, cite, precede, cause, or otherwise participate in analytical relationships. If a heading becomes analytically meaningful, conversion to an AnalyticalItem must be explicit.

### QueryItem

A computed structural instrument whose visible results are determined by a query over the analytical record.

```ts
type QueryItem = {
  id: string;
  kind: "query";
  label: string;
  query: OutlineQuery;
  parentItemId: string;
  siblingOrder: number;
};
```

Query results are virtual references. Membership does not create hierarchy, metadata, or analytical relationships.

### Canonical shape

```ts
type OutlineItem = ReferenceItem | GroupItem | QueryItem;

type Outline = {
  id: string;
  analysisRootId: string;
  rootItemId: string;
  items: Record<string, OutlineItem>;
};

// RootItem is the structural UI projection of AnalysisRoot; its title is not duplicated here.
```

`collapsed`, selection, focus, search expansion, map coordinates, viewport, and rendered connector routes are not fields of this ontology. They belong to session/view state.

## Frozen invariants

1. Analytical identity is independent of outline location.
2. Every static OutlineItem has its own stable placement identity.
3. A ReferenceItem references exactly one AnalyticalItem.
4. An AnalyticalItem may have zero, one, or many ReferenceItems.
5. Alias placements share analytical content, not structural descendants.
6. Every static non-root item has exactly one structural parent.
7. The authored outline structure is acyclic.
8. The same AnalyticalItem may not recur twice on one root-to-leaf placement path.
9. Structural parenthood, sibling order, and grouping have no implicit analytical semantics.
10. Structural hierarchy causes no analytical metadata inheritance.
11. Analytical relationships address analytical identities, never OutlineItem identities.
12. Query membership creates no durable placement or analytical assertion.
13. Presentation state is not analytical or structural truth.

14. Moving/reordering an OutlineItem changes no SemanticRelation, ReasoningAssertion, provenance relation, evidence relation, analytical judgment/evaluation state, or technique record.
15. Removing a ReferenceItem does not delete its AnalyticalItem.
16. Deleting/archiving an AnalyticalItem is a separate domain operation whose affected placements/relations must be handled explicitly.
17. GroupItems and RootItem are structural only and cannot be relationship endpoints.
18. Query results are read-only as structure unless explicitly materialized into ReferenceItems.
19. Ordering is presentation sequence only; it does not imply rank, likelihood, confidence, priority, chronology, or preference.
20. Map structural connectors and analytical relationship connectors are distinct propositions and must remain distinguishable.

## Mutation contract

### Create

Creating an ordinary analytical thought creates an AnalyticalItem and one ReferenceItem at the chosen structural location. Creating a GroupItem creates no AnalyticalItem. Creating a QueryItem creates no result placements.

### Rename/edit

Editing a ReferenceItem's displayed analytical content edits the referenced AnalyticalItem/revision and is visible through every alias. Renaming a GroupItem or QueryItem changes only structural/view labeling.

### Indent / outdent / move / reorder

These operations modify `parentItemId` and/or `siblingOrder` only. They must reject cycles and same-item recurrence along the destination ancestor path. They never create or modify analytical relationships.

### Alias

Alias creates a new ReferenceItem pointing at an existing AnalyticalItem. It does not copy the item, relationships, evidence, children, analytical judgment/evaluation state, or technique runs.

### Remove from Outline

Remove deletes the selected placement only. Other placements and the AnalyticalItem survive. This is the normal structural Delete operation once aliases exist.

### Delete/archive analytical object

Destroying or archiving the underlying AnalyticalItem is a separate explicit domain operation. The UI must distinguish this from removing a placement and must preview or safely handle affected aliases, reasoning, relations, evidence/citations, analytical judgments/evaluations, and method provenance.

### Convert GroupItem to analytical object

Conversion explicitly creates a new AnalyticalItem from the group label/content, replaces or transforms the structural group into a ReferenceItem, and preserves its structural children. No semantic relations are inferred during conversion.

### Materialize Query results

Materialization creates ordinary ReferenceItems for selected/current query results at a chosen static location. It does not copy AnalyticalItems. Dragging an ordinary static item into a QueryItem must not silently mutate the item to satisfy the query.

### Query refresh

Query refresh may add/remove virtual visible results only. It must not move canonical structure, change map structure by default, or alter analytical data.

## Map projection contract

The Map renders authored Outline structure. Static parent/child connectors portray structural arrangement only.

Analytical relations remain records over analytical identities. Their visible connectors are projection artifacts rather than the relationship itself.

When aliases make more than one visible placement available for a relationship endpoint, the renderer must not silently imply multiple relationships or arbitrarily change analytical identity. It may use a saved view binding or a deterministic non-semantic display rule, but the binding remains view state.

```text
Relationship:  Item A --supports--> Item B
Rendered edge: placement A2 --------> placement B1
```

Changing/hiding the rendered edge does not change the relationship.

## Query projection rule

Static authored structure is the default source of generated-Map structure. QueryItem results are outline-only/generated overlays unless a future view explicitly opts into portraying them. A query result disappearing because the underlying record changed must not unexpectedly restructure the canonical Map.

## Current alpha compatibility boundary

The 0.6.x implementation does **not** yet implement this ontology directly:

- `AnalysisMapRecord.occurrences` is keyed by `noteId`, so one note currently has at most one occurrence per map;
- `MapOccurrence.parentNoteId` currently stores structural hierarchy;
- `MapOccurrence.collapsed`, position, size, branch side, camera, and manual-layout fields mix structural and presentation concerns;
- current Outline Delete trashes the Note rather than removing an independent placement;
- GroupItem, QueryItem, and alias creation are not yet first-class runtime features.

These are known compatibility constraints, not reasons to weaken the frozen ontology. The 0.7 migration replaces Map-occurrence structural storage with OutlineItem identity and separates session/view state.

Current behavior that already agrees with the freeze should be preserved: cycle rejection, deterministic sibling ordering, search-only temporary expansion, structural/semantic relationship separation, locked generated-Map authoring, and tombstone-style restore behavior until the new lifecycle model replaces it.

## Scope decisions

The frozen 0.7 core has one canonical authored Outline per AnalysisRoot. Multiple generic outlines/maps are deliberately deferred; if later analysis contexts require alternate authored structures, they must be introduced with explicit semantics rather than by reviving generic map scaffolding.

GroupItem and QueryItem are part of the conceptual vocabulary because they prevent headings and computed views from being mislabeled as analytical knowledge. Their UI can remain minimal or deferred during the first 0.7 migration.

OPML may be supported as structural interchange, but it is not an authoritative Catalyst persistence format because it cannot preserve the complete analytical record.

## Research basis

The ontology follows several convergent precedents without copying any one format wholesale:

- SKOS separates semantic concept relations from Collections/OrderedCollections, supporting the rule that grouping/order are not semantic hierarchy.
- Org mode separates stable entry identity/properties/links from physical outline location and can generate sparse/query trees without rewriting canonical structure.
- FreeMind/Freeplane distinguish rooted hierarchy from cross-links; Freeplane clone behavior also demonstrates why shared analytical content and shared subtrees must be separate choices.
- W3C Web Annotation separates annotation/body/target/selector concerns, supporting the separation of source anchoring from outline placement.
- PROV-O and argumentation models such as AIF/SACM separate entities/information from activities, inference, and qualified relationships, supporting the rule that techniques/relationships are not hierarchy nodes merely because they are displayed nearby.

Starting points:

- https://www.w3.org/TR/skos-reference/
- https://orgmode.org/org.html
- https://freemind.sourceforge.io/wiki/index.php/Hierarchy
- https://docs.freeplane.org/
- https://www.w3.org/TR/annotation-model/
- https://www.w3.org/TR/prov-o/

## Freeze rule

This conceptual ontology is frozen as of 2026-09-14.

Do not add another OutlineItem kind, infer analytical meaning from hierarchy, or collapse placement identity back into AnalyticalItem identity merely to simplify a UI implementation.

Reopening the ontology requires a concrete representational failure: a real Catalyst workflow that cannot be represented without violating the invariants above. Visual dissatisfaction, implementation convenience, or a desire for additional toolbar controls is insufficient.

Implementation details such as exact TypeScript names, XML serialization, query language syntax, ID format, and UI affordances may evolve without reopening the conceptual freeze as long as the invariants and mutation semantics remain intact.
