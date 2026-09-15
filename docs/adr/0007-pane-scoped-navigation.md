# ADR 0007: Navigation history is pane-scoped

## Status

Accepted for Catalyst 0.5.1. This refines ADR 0006 after runtime evaluation.

## Context

Catalyst has two simultaneously useful surfaces: a PDF Reader and a research Context pane. The Stage 6 composite history proved technically functional but semantically coupled unrelated actions. Following a note link could cause Back to alter the PDF, and source navigation could become entangled with note/search state.

## Decision

Maintain two independent bounded session histories:

- `ReaderHistory`: active document ID + zero-based page index.
- `ContextHistory`: active note ID + Notes/Evidence/Trash mode + workspace-search query.

Only intentional navigation in a pane appends to that pane's history. Ordinary Reader scrolling and Context query typing replace the pane's live snapshot without adding an entry.

Provide Back/Forward controls in each pane. Keyboard Back/Forward targets the last active pane. The command palette exposes explicit Reader and Context commands.

The first PDF open becomes the Reader's starting location rather than creating an unusable Back entry to an empty viewer, because Catalyst does not currently expose document-close as a navigation destination.

## Consequences

- Note navigation is reversible without moving the source document.
- PDF source navigation is reversible without changing the active note.
- Search/context workflows and reading workflows can each maintain their own forward path.
- Navigation remains ephemeral and does not enter `WorkspaceState` or SQLite.
- A future explicit document-close feature can add an empty Reader location if desired without changing the Context history model.
