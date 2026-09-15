# ADR 0006: Research navigation is composite session state

## Status

Superseded in part by ADR 0007 for Catalyst 0.5.1. The decision to keep navigation session-only remains; the composite-location model does not.

## Context

Catalyst displays a PDF and a research context pane simultaneously. A conventional browser-history model that stores only a document/page is insufficient: following a source from a note should preserve the open note, and returning from a search result should reconstruct the search context that produced it.

Recording every PDF page-change event as a history entry is also undesirable because ordinary reading would make Back unusable.

## Decision

Represent a research location as a composite snapshot containing:

- active document ID;
- zero-based PDF page index;
- active note ID;
- context mode;
- workspace-search query.

Intentional navigation uses `visitResearchLocation`, which pushes the previous location and clears the forward path. Passive changes such as scrolling or search typing replace only the current live snapshot immediately before the next history operation.

Keep the history bounded to 80 previous locations.

The navigation stack is session-only application state. It is not part of `WorkspaceState` and is not persisted.

EmbedPDF page-change events are translated through the viewer adapter before entering navigation logic.

## Consequences

- Back/Forward works across note links, evidence jumps, search results, and document switches.
- Source jumps can move the PDF without discarding the open note.
- Ordinary reading does not pollute history.
- Research persistence remains independent of ephemeral interaction history.
- Historical references to later-deleted notes/documents may become partially unavailable; restoration degrades to the surviving parts of the location instead of mutating persisted research data.
