# ADR 0023 — Map projection ontology

Status: **Accepted as conceptual architecture freeze**

Companion specification: `../map-ontology-v0.1.md`

## Context

Outline-first authoring and the generated Map solved Catalyst's earlier freeform-graph instability, but the Map still needed a precise semantic boundary. Without one, future implementation could accidentally treat layout edges, analytical relationships, reasoning, provenance, technique overlays, and assessment state as one connector system.

A final adversarial ontology pass tested aliases, cycles, contradictory sources, multi-premise reasoning, temporal change, source revision, query results, deletion/orphans, and hidden layers.

The pass found no need for a new Map-owned analytical object type. It did uncover two draft errors: one AnalyticalItem may legitimately have several ReferenceItem placements, and the structural root remains a RootItem rather than an AnalyticalItem.

## Decision

The Map is a deterministic portrayal over existing Catalyst domain objects. It is not a second analytical ontology or a second structural authoring system.

Only the canonical authored Outline controls structural placement, parentage, order, and rank. Analytical/world relations, reasoning, provenance/source traces, and TechniqueRun state are overlay layers that do not govern canonical hierarchy. Formal Assessment is outside current Catalyst product scope under ADR 0026.
Analytical relationships address analytical identities, never OutlineItem identities. When aliases provide several visible placements for one endpoint, renderer binding is portrayal state and must not duplicate or retarget the underlying assertion.

Reasoning may be n-ary and must remain representable as reasoning objects/junctions rather than being flattened into unexplained pairwise edges.

Source/provenance projection preserves anchored lineage. Provenance does not imply truth, credibility, corroboration, or analyst endorsement.

Layer visibility is reversible portrayal state. Hiding Relations, Reasoning, Sources, or Methods cannot mutate the underlying analytical record.

Map validation distinguishes hard structural/referential errors from warnings and informational findings. Contradictory analytical content and many non-structural cycles remain valid unless a specific domain relation forbids them.

Deletion/removal follows lifecycle rules rather than Map semantics: removing a placement does not delete its AnalyticalItem, and analytical deletion must not silently erase dependent reasoning or provenance history.

## Consequences

The 0.7 implementation must project the Map from the frozen Outline and shared analytical model rather than creating independent Map-owned node/edge truth.

Layout engines may use non-structural relationships for routing aesthetics but not hierarchy/rank constraints.

The alpha `MapOccurrence`/relationship compatibility model may remain temporarily, but it must not be extended in ways that contradict the frozen projection contract.

Reopening this ADR requires a concrete representational failure or a later accepted ADR. Visual preference, connector styling, layout-library convenience, or desire for additional map controls is insufficient.

