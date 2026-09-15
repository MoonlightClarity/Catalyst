# ADR 0005 — Structured analytic techniques are versioned note attachments

## Status

**Partially superseded by ADR 0027 and `../techniques-workspace.md`.** Versioned/snapshotted technique definitions remain useful domain history, but Techniques are now an independent ordered workspace rather than note attachments, and SQLite is not the active persistence authority.

## Context

Catalyst should support structured analytic techniques without turning notes into rigid note "types" or coupling saved research to a particular UI component. Users also need to be able to create their own techniques.

Several techniques in *A Tradecraft Primer: Structured Analytic Techniques for Improving Intelligence Analysis* are useful starting points, but Catalyst must remain a general research tool rather than an intelligence-analysis-only product.

## Decision

A structured analytic technique is a `TechniqueDefinition` consisting of a name, purpose, category, version, and ordered prompts. A note may contain zero or more `TechniqueRun` instances.

Built-in definitions live in source code with stable IDs. User-created definitions live in SQLite. Every `TechniqueRun` stores a complete snapshot of the definition version it was created from, plus the user's responses.

This means:

- editing a custom technique affects future uses without silently rewriting past analysis;
- deleting a custom definition removes it from the library but does not destroy historical analyses;
- deleting a note permanently deletes its technique runs with the note;
- moving a note to Trash preserves its technique runs;
- viewer, React, and SQLite implementation details do not enter the domain model.

## Initial response types

Stage 3.1 intentionally supports only:

- short text;
- long text;
- list (stored as newline-delimited text).

The schema is extensible. Matrix/table-specific workspaces (notably for ACH or indicators) may be added later as new response kinds if real use justifies them. We are not building a generic form engine prematurely.

## Consequences

The note remains the unit of authored thought. Techniques guide reasoning *inside* notes rather than becoming a parallel document system. One note can apply multiple techniques and still link to multiple pieces of source evidence.
