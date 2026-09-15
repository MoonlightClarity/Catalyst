# ADR 0008 — Note connections render as a mind map

## Status

Superseded by ADR 0009. This ADR remains as the record of the intermediate note-centered map prototype.

## Context

Catalyst already persists directional `NoteLink` records (`fromNoteId -> toNoteId`) and derives backlinks from those records. Stage 5 exposed that model directly as a note picker followed by separate "Linked notes" and "Referenced by" lists.

That UI is mechanically correct but it makes a relationship network read like record management. As the number of related notes grows, the user has to reconstruct the structure mentally instead of seeing the current note in context.

Changing the persistence model to undirected links would remove useful direction/provenance information and would require an unnecessary SQLite migration. It would also make existing work harder to interpret.

## Decision

The open-note connection surface is rewritten as a centered mind map.

- The active note is the center node.
- Directly connected notes are neighboring nodes.
- Existing directional records are deduplicated into one visual neighbor per note.
- Outgoing, incoming, and existing two-way relationships remain distinguishable in the map.
- Clicking a neighbor navigates to that note through the existing Context navigation path.
- "Connect" creates one outgoing record from the active note.
- A note that is already connected in either direction is not offered as a new connection target.
- "Disconnect" removes every direct directional record between the active note and that neighbor in one reducer transition.

The persisted `NoteLink` schema remains unchanged. No Tauri or SQLite migration is required.

## Why a projection instead of a new graph store

`WorkspaceState.noteLinks` is already the graph. Introducing a second graph representation would create synchronization and recovery-journal failure modes for no product benefit. `connectionsForNote()` is therefore a derived view model: it filters deleted/missing notes, deduplicates neighbors, and reports the relationship direction required by the UI.

## Layout and scale

The first map is intentionally one hop from the active note. It uses a deterministic two-sided branch layout rather than force simulation. This keeps node placement stable while editing, works without another dependency, and remains usable in Catalyst's resizable context pane through local horizontal scrolling.

If later research workflows require multi-hop exploration, that should become a dedicated graph workspace rather than making the note editor silently expand an unbounded network.

## Consequences

- Existing Stage 5 data remains valid.
- Existing bidirectional pairs are preserved and rendered as one two-way neighbor.
- Map interaction is simpler than the underlying directional storage model.
- The note editor no longer owns connector-specific local state; the mind-map component owns connection selection and rendering.
- The reducer gains an atomic conceptual disconnect action so the UI does not need to issue two independent deletion transitions.
