# ADR 0002: Separate evidence from notes

Status: accepted for Stage 2 validation

## Context

The first Catalyst concept treated PDF highlighting and note creation as nearly the same operation. That is convenient for a demo but creates noisy notes and makes it hard to represent one analytical thought supported by multiple source passages.

## Decision

Catalyst separates:

1. `Document` — source identity.
2. `Annotation` — evidence anchored to a source.
3. `Note` — user-authored thought.
4. `NoteAnnotationLink` — a many-to-many relationship between notes and evidence.

Selecting text creates only a temporary selection. The user decides whether to save the passage, create a note, attach it to an existing note, copy it, or discard it.

## Consequences

Positive:

- highlights/excerpts do not pollute Notes;
- one note can synthesize many sources;
- evidence can exist before the user knows what it means;
- a single passage can support multiple notes;
- the database model remains useful even if the PDF viewer implementation changes.

Costs:

- the UI must expose a small decision after selection;
- annotation and note lifecycles are separate;
- persistence will require a link table.

These costs are accepted because they map more accurately to research work.
