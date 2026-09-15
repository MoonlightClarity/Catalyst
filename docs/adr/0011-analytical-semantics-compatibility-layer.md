# ADR 0011 — Test analytical object semantics without immediate SQLite ontology migration

## Status

Accepted for 0.6.1 architecture alpha.

## Context

Research indicates that Catalyst should distinguish notes, claims, assumptions, hypotheses, questions, entities, events, sources, and evidence. Immediately replacing the existing `notes` table with a generalized object schema would create a high-risk migration before the interaction model has been validated.

## Decision

For the architecture alpha, existing notes remain durable text-bearing records. `NoteSemantics` adds optional analytical roles and confidence alongside them.

Semantics are persisted through the existing settings mechanism rather than a new SQLite migration.

Permanent deletion cleans associated semantics; soft deletion preserves them.

## Consequences

The new mental model can be tested against real Catalyst workspaces and rolled back without rewriting the database.

The name `NoteSemantics` and its settings persistence are explicitly transitional. A future generalized Item/Object schema must be justified by tested usage and accompanied by a migration ADR.
