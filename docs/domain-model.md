# Catalyst domain model — architecture alpha

Status: **compatibility/historical domain reference**. Current product/runtime boundaries are governed by `CURRENT_ARCHITECTURE.md` and newer ADRs.

## Purpose

Catalyst is moving from a note-centric persistence model toward a general analytical-object graph. The 0.6.1 alpha originally tested this model without an irreversible SQLite schema migration. The active runtime now persists canonical Catalyst XML; SQLite references in this document describe the archived alpha compatibility model only.

The current text-bearing object remains `Note` for storage compatibility. Analytical meaning is attached through `NoteSemantics`, and graph connections are represented by first-class `Relationship` objects.

This is a compatibility stage, not the final ontology.

The permanent semantic direction is frozen by `annotation-semantic-ontology-v0.1.md` and ADR 0020. The authored structural/projection direction is separately frozen by `outline-ontology-v0.1.md` and ADR 0021. Formal Assessment is no longer a Catalyst product concept. ADR 0026 supersedes ADR 0025 for current product scope; assessment-era questionnaire material is historical only. The current `NoteSemantics`, annotation/evidence structures, and note-keyed `MapOccurrence` hierarchy remain compatibility projections rather than ontologies to extend.

## Note

```text
Note
  id
  title
  body
  createdAt
  updatedAt
  deletedAt
```

A note is the current durable text container and graph node identity.

A note does **not** imply a specific analytical role.

## NoteSemantics

```text
NoteSemantics
  roles[]
  confidence?
```

Supported alpha roles:

- Note
- Claim
- Assumption
- Hypothesis
- Question / gap
- Entity
- Event

The UI currently exposes one primary role even though the representation is an array. The array leaves room for later facet-based modeling without another immediate persistence break.

Confidence is optional and intentionally separate from source quality, information credibility, or probability/likelihood. The alpha supports only low/medium/high confidence as a provisional user-facing field.

Turning analytical capabilities off hides these controls but never erases stored semantics.

## Relationship

```text
Relationship
  id
  fromId
  toId
  type
  directed
  label?
  createdAt
  updatedAt
```

Built-in alpha relationship types:

- `related-to`
- `supports`
- `contradicts`
- `depends-on`
- `derived-from`
- `about`
- `precedes`

`related-to` defaults to undirected. Other built-in types default to directed.

The alpha permits one first-class relationship object per node pair. This is a deliberate simplification for acceptance testing, not a statement that multigraph semantics are invalid. Multiple independent relationships between the same pair should be introduced only after the interaction model is tested.

## Legacy note_links compatibility

Historical SQLite builds persisted the older directional `note_links` table. The active web/XML runtime does not use that table; the behavior below is retained only to explain legacy compatibility semantics.

On load:

1. If first-class relationships were previously persisted in workspace settings, Catalyst loads and sanitizes them.
2. Otherwise, legacy `note_links` rows are deterministically projected into one undirected `related-to` relationship per node pair.
3. Reverse legacy rows are deduplicated.

On mutation:

- creating a first-class relationship writes a compatibility `note_links` row;
- deleting/disconnecting the relationship removes the mirrored legacy row(s);
- changing relationship type/direction does not rewrite the compatibility row because the richer semantics live in the first-class relationship state.

This design keeps the alpha reversible while allowing real use of typed relationships.

## Evidence model

Current source evidence remains represented by `Annotation` plus `NoteAnnotationLink`.

The earlier alpha treated annotations as a bridge toward first-class Evidence. ADR 0020 supersedes that specific future shape.

The frozen conceptual direction is now:

```text
Source -> anchored SourceItem + independent semantic facets
SourceItem -- evidential relation --> proposition / hypothesis / question
SourceItem -- promote/derive --> analyst-owned analytical object
```

Evidence is contextual to a target or inquiry rather than an intrinsic property of selected text. The current Annotation/NoteAnnotationLink model remains a compatibility bridge, not the final evidence/provenance schema.

## Graph view state

`GraphViewState` contains positions and camera state only. Spatial coordinates are presentation state, not analytical truth.

Deleting a note permanently deletes its saved graph position and semantics. Soft deletion preserves them so restore returns the object to its prior analytical/spatial context.

## Techniques

`TechniqueDefinition` and `TechniqueRun` remain compatible with the current model. Capability profiles can hide methodology workflows without destroying historical technique runs.

Future method views should project over common analytical objects rather than invent separate method-specific databases.
