# ADR 0009 — Graph-first workspace

## Status

**Superseded for the mounted product by ADR 0021, ADR 0023, ADR 0027, and `../CURRENT_ARCHITECTURE.md`.** Graph-like compatibility state may remain internally, but the Outline now authors structure and the generated Map portrays it.

## Context

Catalyst began as a two-pane research application in which notes were opened as records and note-to-note links were exposed as a secondary connector feature. ADR 0008 improved that connector surface with a one-hop mind map, but runtime/product review showed that the map was still subordinate to the old note-list mental model.

Catalyst's intended use includes intelligence analysis, research, investigations, strategy, journalism, legal work, science, and other serious analytical workflows. Across those domains, relationships between judgments, questions, observations, and evidence are not decoration around notes; they are part of the working structure.

At the same time, Catalyst should not make its core dependent on proprietary graph services, AI models, embeddings, hosted databases, or opaque automation. Those dependencies would add lifecycle, migration, privacy, reproducibility, and offline technical debt without being necessary for the core analytical loop.

## Decision

Catalyst's research context is graph-first.

- Every live `Note` is a graph node.
- The graph remains visible while a selected node is edited in a docked inspector.
- Node creation, selection, movement, connection, search emphasis, and navigation happen in the graph workspace.
- Evidence and Trash remain secondary context views because they represent different lifecycle/ownership concerns, not alternate note-navigation systems.
- The graph renderer is implemented with React, SVG, and pointer events already available in the application. No graph framework or hosted graph service is required.
- Automatic layout is deterministic. Once generated positions are seeded into graph-view state, later analytical changes do not silently rearrange the user's spatial workspace. `Arrange` is the explicit operation that opts back into automatic layout.
- Graph camera and node positions are workspace-view state, not analytical claims. They persist locally but remain separate from note content and relationship meaning.
- Search filters by emphasis: non-matching nodes are de-emphasized while the graph remains spatially intact.

## Relationship compatibility

SQLite migration 0004 already persists directional `note_links` rows. Catalyst 0.6 does not perform a cosmetic schema migration merely to rename those rows. The graph layer projects every pair of live notes connected in either direction into one conceptual edge. Existing reverse pairs remain compatible.

The persisted directional representation is therefore a compatibility/storage detail, not the UI's fundamental interaction model. A future schema migration should occur only if a concrete product requirement—such as typed relationships, edge metadata, or independent relationship identity—requires it.

## Local and open core

The graph must remain fully usable offline and without an account. Core graph behavior may use deterministic local algorithms and ordinary open-source libraries already justified elsewhere in Catalyst, but it must not require:

- AI-generated or embedding-generated connections;
- a vector database;
- a cloud knowledge-graph service;
- vendor-specific graph object models;
- a proprietary workspace file format.

Optional future integrations may suggest actions through explicit adapters, but they must not own the graph model or become required for reading existing work.

## Persistence

`GraphViewState` contains node positions and camera state. Desktop persistence stores it as JSON in the existing SQLite `settings` table under `graph_view`; browser mode stores the same workspace representation locally. No Rust/SQLite migration is required for 0.6.

All loaded graph-view data is sanitized before entering the workspace so malformed or stale local settings cannot inject non-finite/extreme coordinates or invalid zoom levels.

## Consequences

- `GraphWorkspace` replaces the note list/mind-map combination as the default research context.
- `NoteInspector` replaces the old full-context `NoteEditor`.
- The obsolete `NotesList`, `NoteMindMap`, and `NoteEditor` implementations are removed rather than maintained in parallel.
- Context Back/Forward now navigates graph selections and secondary context modes while Reader Back/Forward continues to own document/page movement.
- Catalyst can later add grouping, relationship semantics, alternate layouts, or graph analysis without changing the fundamental note-navigation metaphor.
- Spatial state becomes durable user workspace state and therefore requires regression coverage and compatibility handling.
