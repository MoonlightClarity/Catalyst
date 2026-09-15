# ADR 0012 — First-class semantic relationships with legacy note_links compatibility

## Status

Accepted for 0.6.1 architecture alpha.

## Context

The 0.6 graph treated directional `note_links` rows as one conceptual connection. Deeper research showed that analysis needs one identifiable relationship object capable of carrying type, direction, labels, timestamps, and eventually provenance.

A cosmetic SQLite migration would add risk without improving the alpha test.

## Decision

Catalyst introduces first-class `Relationship` objects in the domain model.

Relationships have identity, endpoints, semantic type, directionality, optional label, and timestamps.

The alpha allows one relationship object per node pair.

The older `note_links` rows remain a persistence compatibility mirror. Legacy rows hydrate deterministically into undirected `related-to` relationships when no richer relationship state exists.

## Consequences

Typed relationships can be tested immediately while older workspaces remain readable.

Graph rendering can project semantic labels/direction without making SQLite rows the product model.

A later schema migration can move relationships into a dedicated table after multigraph semantics, provenance requirements, and UX are validated.
