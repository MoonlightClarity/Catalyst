# Catalyst 1.0.3 â€” EmbedPDF reader convergence

- Replaced the direct Thorium/PDF.js reader path with EmbedPDF 2.15.1 as the active PDF surface.
- Removed Catalyst's parallel custom marks/analytic-mark layer and retired annotation-rail infrastructure. EmbedPDF native annotation tools are now the sole visual PDF annotation surface.
- Preserved workspace persistence for annotations created through EmbedPDF's native toolbar without mutating the original source PDF as a side effect of Catalyst workspace persistence.
- Fixed a stale two-column reader-body rule that reserved space for the removed annotation rail and compressed the PDF viewer into a narrow strip in packaged builds.
- Reduced obsolete reader/annotation CSS and updated reader, dependency, architecture, and licensing documentation to match the active runtime.
- Production build, native EmbedPDF annotation persistence, Methods catalog, project export, and Electron release staging pass. The separate legacy CSS-freeze contract remains unresolved and is documented in `docs/release-readiness.md`.

---

# Catalyst 0.6.3-alpha.3 â€” Working Picture renderer

Alpha.3 is the recognition/navigation correction prompted by native review of alpha.2. The previous Map implementation was structurally better than the coordinate graph but still required the analyst to read and pilot a text-first diagram. This release replaces the mounted renderer rather than styling that failure.

## Working Picture

- Replaced `AnalysisMapWorkspace` with `WorkingPictureWorkspace`.
- Added `src/picture/layout.ts`, which derives source/assessed/open/context portrayal territories from existing Map state, analytical roles, and evidence without changing the persistent analytical model.
- Retained analyst-authored Map occurrence positions; automatic placement is only portrayal.
- Structural branches remain visible; semantic relationships are revealed only around the current inspect/hover/focus context.
- Removed body previews from normal visual objects.
- Added visibly different overview, working, close, and inspect portrayal levels.
- Added local Working Picture Home and Back focus navigation; plain Enter/double-click refocuses, single click only inspects, and Shift+Enter creates a sibling.
- Opening the inspector no longer reserves/reflows canvas width.

## Recognition-first evidence

- Source-backed observations in the observed territory use clipped source-fragment landmarks plus evidence trace marks instead of ordinary node cards.
- Reader selection capture is now a compact source fragment with icon-led actions.
- True raster PDF-region capture remains deferred until the evidence model can persist it honestly.

## Catalyst notation

- Added a small custom analytical SVG alphabet for thought, claim, assumption, hypothesis, question, entity, event, source, and evidence.
- Extended the custom instrument family for Home, Open, Inspect, Mark, Copy, and Attach operations.
- The native Catalyst application icon remains the mapping-derived convergence/junction/divergence mark; the historical boxed-E placeholder is not used.

## Assurance

- Rewrote the visual-language contract around the Working Picture.
- Extended Map tests to compile and exercise the Working Picture layout derivation.
- Added `docs/acceptance-0.6.3-alpha.3.md` and ADR 0019.
- No Rust or SQLite schema migration.

---

# Catalyst 0.6.3-alpha.2 â€” Analytical Map renderer

Alpha.2 is a model correction rather than a cosmetic pass. Native review of alpha.1 showed that a coordinate-plane graph remained generic even after visual-language work. This release replaces that primary interaction metaphor with the first Catalyst Mapping Model implementation.

## Mapping model

- Added `MapViewState`, `AnalysisMapRecord`, and `MapOccurrence` as portrayal state over the existing analytical substrate.
- Existing live notes remain discoverable on the compatibility Map without fabricating hierarchy from semantic relationships.
- Structural branches are Map-local organization and remain separate from first-class `Relationship` semantics.
- One underlying analytical object can be represented by separate occurrences on multiple Maps in the model contract.
- Map state persists through browser storage, recovery journal, and SQLite `settings.map_view`; no schema migration is required.
- Legacy `graph_view` state remains intact for rollback/compatibility rather than being silently reinterpreted as authored Map semantics.

## Analysis / Map renderer

- Replaced the user-facing `GraphWorkspace` with `AnalysisMapWorkspace`; the retired component is removed by the updater.
- Removed graph-paper coordinates from the default working surface.
- Added deterministic human-scale branch placement with left/right branch territories and loose top-level thoughts.
- Added fluent child/sibling/free-thought creation, inline naming, direct semantic-relation authoring, explicit refocus, collapse, authored drag placement, fit, and layout reset.
- Collapsed branches retain a visible hidden-object count and disclose semantic cross-links that continue outside hidden structure.
- Structural branches and semantic relationships use different line grammar in monochrome as well as color.
- Selection uses neutral registration marks and never resizes a thought.
- Semantic zoom controls local detail only; it is not treated as the project-scale complexity solution.

## Identity

- Replaced the document-shaped application icon with a standalone convergence/assessment/divergence mark designed to remain legible at 16â€“32 px.
- The icon deliberately avoids document, shield, eye, globe, and generic security-app imagery; the central diamond represents the analytic judgment point between inputs and outputs.
- Root `app-icon.svg` is the vector source, `app-icon.png` is the 1024 px packaging master, and the matching web/native assets live under `public/` and `src-tauri/icons/`.
- Tauri bundle icon paths are declared explicitly in `src-tauri/tauri.conf.json` rather than relying only on conventional filenames.

## Assurance

- Added `scripts/test-map.mjs` covering Map hydration, cycle rejection, structure/semantics separation, explicit focus, authored placement, collapse, hidden cross-link continuation, and layout reset.
- Rewrote the visual-language contract test around the Analysis/Map renderer.
- Native acceptance is defined in `docs/acceptance-0.6.3-alpha.2.md`.
- Alpha.2 intentionally does not add future provenance, inference, Assessment, Perspective, Watch/Scan, or weak-signal semantics merely for visual effect.

---

# Catalyst 0.6.3-alpha.1 â€” Visual & analytical language foundation

This milestone implements the first coherent slice of `docs/visual-analytical-language-v0.1.md`. It intentionally changes portrayal and interaction without migrating the 0.6.x ontology or SQLite schema.

## Visual identity

- Replaces the provisional four-dot network mark with a Catalyst-specific trace/junction/probe mark.
- Separates the warm source surface from the analytical plotting plane through a provenance-spine divider.
- Establishes graphite instrument chrome, warm analytical paper, oxidized-teal trace emphasis, clipped-corner analytical surfaces, restrained monospaced marginalia, and non-rounded graph geometry.
- Keeps the brand provisional until native visual acceptance proves the grammar works at real scale.

## Graph interaction

- Removes Profile, Features, Connect, Focus, Fit, and Arrange from the primary graph toolbar.
- Moves persistent workspace configuration into the Catalyst header.
- Relationship authoring now starts from a selected-node port, making the relationship affordance spatial rather than instructional.
- Center, Fit, Reset arrangement, and zoom now live in a compact plotting-margin instrument strip.
- Selected nodes use registration corners rather than growth/glow, so interaction state does not impersonate analytical importance.
- Adds overview, navigation, working, and detail portrayal levels driven by graph zoom.
- Adds graph marginalia for node/link counts and active query context.

## Evidence / inspector

- Introduces a reusable evidence-trace mark across graph nodes, inspector sources, and Evidence rows.
- Evidence tag chips now read as compact layers rather than generic rounded pills.
- The node inspector uses the same analytical role/trace vocabulary and a darker instrument header.
- PDF selections use a compact evidence tray rather than a large explanatory card.

## Assurance

- Adds `scripts/test-visual-language.mjs` to enforce structural portrayal decisions.
- Adds `docs/acceptance-0.6.3-alpha.md`.
- Incorporates ADR 0015 and the Visual & Analytical Language v0.1 research synthesis.
- No `src-tauri` or SQLite schema changes.

---

# Catalyst 0.6.2-alpha.2 â€” Evidence clustering, quiet UI, and release integrity

This milestone keeps the 0.6.1 analytical-foundation model intact while adding two directly testable cognitive-load controls: evidence clusters reduce visual saturation in annotated sources, and persistent interface copy is reduced so the shell stops competing with the analyst's material.

## Evidence tags and clusters

- Saved highlights and excerpts can carry multiple reusable tags.
- Tag names are normalized and unique case-insensitively.
- Evidence view exposes All, Untagged, and per-tag cluster lenses.
- The active cluster filters the Evidence list and the Catalyst highlight projection in the PDF together.
- Filtering is non-destructive: changing clusters never deletes evidence or tag assignments.
- Deleting evidence removes its tag assignments but keeps reusable tag definitions.
- Tagging is a permanent capability: enabled in Research/Analytical/Full, hidden in Simple while data remains intact.
- Tags are organizational metadata, not confidence, source quality, credibility, claims, or relationship semantics.

## Interface quieting

- Cluster selection is a compact visual strip rather than an explanatory panel.
- Graph and node empty states now present one short cue instead of tutorial paragraphs.
- Empty Sources/Relationships sections communicate through counts rather than repeated instructions.
- Feature controls expose capability names without persistent progressive-disclosure prose.
- Substantive method prompts, source excerpts, and user-authored analysis remain intact.
- ADR 0014 makes this distinction an architectural constraint.
- Current branding remains provisional; the next milestone is the dedicated identity/interaction-language foundation.

## Persistence and compatibility

- Evidence tags and annotation/tag assignments use the existing settings persistence during the alpha.
- Browser storage, recovery journal, and SQLite use the same sanitization boundary.
- Older workspaces with no tag state hydrate with an empty tag catalog and no assignments.
- No Tauri/SQLite schema migration is required.

## Release integrity

- The 0.6.2 handoff is a full architecture-alpha overlay rather than a partial patch, so core files such as `src/domain/types.ts` cannot be intentionally omitted.
- A release manifest records SHA-256 hashes for the overlay files.
- `upgrade_062.ps1` verifies that manifest before running tests and refuses to validate a mixed release.
- `apply_062.ps1` verifies the overlay ZIP itself before extraction.
- Stale generated `vite.config.js` / `vite.config.d.ts` artifacts are removed; `vite.config.ts` is the single configuration source.

## Validation

The regression suite now has ten stages, adding evidence-tag/cluster coverage to the existing domain, analytical-model, graph, persistence, recovery, viewer, and navigation suites.

---

# Catalyst 0.6.1-alpha.1 â€” Architecture alpha

This milestone turns the deeper research conclusions into a reversible, testable product slice. It changes the domain semantics and cognitive-load model while intentionally keeping the current graph renderer and existing SQLite schema stable.

## Capability profiles

Catalyst now has persistent Simple, Research, Analytical, and Full profiles plus individual capability overrides.

- Simple hides structured evidence/analysis controls.
- Research is the alpha default and keeps source/evidence work while hiding formal analytical structure.
- Analytical exposes analytical roles, typed relationships, confidence, and built-in structured methods.
- Full additionally exposes custom methodology authoring.

Turning a capability off hides its workflow without deleting its data. Switching to a named profile clears overrides and restores predictable profile defaults.

## Analytical node semantics

Existing note records remain the durable text-bearing graph nodes for compatibility, but analytical meaning is now stored separately.

Nodes can optionally be marked as Note, Claim, Assumption, Hypothesis, Question/Gap, Entity, or Event. Confidence is optional and deliberately separate from probability, source reliability, and information credibility.

The inspector exposes these controls only when their capabilities are enabled.

## First-class relationships

Catalyst now maintains first-class relationship objects with:

- stable identity;
- endpoints;
- semantic type;
- directionality;
- optional label;
- created/updated timestamps.

The initial semantic vocabulary is `related-to`, `supports`, `contradicts`, `depends-on`, `derived-from`, `about`, and `precedes`.

The graph displays semantic labels/direction only when typed relationships are enabled.

The alpha permits one first-class relationship per node pair. This is a deliberate acceptance-test constraint rather than a permanent multigraph decision.

## Legacy compatibility

No Tauri or SQLite migration is required for this alpha.

Richer relationship, capability, and analytical-semantic state is serialized through the existing `settings` table. Existing `note_links` remain a compatibility mirror.

When a prior workspace has no richer relationship state, legacy directional rows hydrate deterministically into one undirected `related-to` relationship per node pair; reverse duplicate rows collapse into one relationship.

Soft deletion preserves semantics/relationships. Permanent deletion and Empty Trash remove them.

## Tooling cleanup

All PowerShell maintenance scripts now default to `$PSScriptRoot`. Catalyst can be moved without rewriting hard-coded `C:\Users\...` paths.

`upgrade_alpha.ps1` is the current one-step validation entry point. `upgrade_06.ps1` remains only as a compatibility alias.

Obsolete validation-hotfix/repair helpers from the 0.6 handoff are removed by the alpha upgrade when present.

## Documentation

The alpha adds:

- `docs/README.md` â€” documentation inventory and pre-1.0 requirements;
- `docs/domain-model.md`;
- `docs/capabilities.md`;
- `docs/assurance.md`;
- ADR 0010 â€” progressive capability model;
- ADR 0011 â€” analytical-semantics compatibility layer;
- ADR 0012 â€” first-class relationships.

The project policy is now explicit: undocumented architectural behavior is unfinished.

## Validation

The regression suite now contains nine stages. The new analytical-model suite covers profile defaults/overrides, node semantics, relationship creation/update, legacy hydration, compatibility mirroring, and trash/permanent-delete lifecycle.

The existing domain, graph, persistence-diff, sync-queue, recovery-journal, highlight, viewer-markup, and pane-navigation suites continue to pass.

The native acceptance goal for this milestone is not feature completeness. It is to determine whether progressive analytical structure improves Catalyst without increasing cognitive load for ordinary research work.

---

# Catalyst 0.6.0 â€” Graph workspace foundation

Catalyst's analytical context has been rewritten around the graph itself. The previous one-hop note mind map was a useful prototype, but keeping it inside a note editor preserved the wrong product structure. In 0.6, notes are graph nodes and the selected note is edited in an inspector without replacing the map.

## Graph-first behavior

- Every non-trashed note renders as a node in the knowledge graph.
- Selecting a node opens a docked inspector while preserving the graph and its spatial context.
- New nodes are created directly at the graph viewport center.
- Node positions persist locally across restart.
- Search de-emphasizes nonmatching nodes without replacing or reflowing the graph.
- Connections are created directly from the graph with a two-step select/connect interaction.
- Reverse directional `note_links` rows project into one conceptual edge, preserving existing data without exposing storage direction as the primary UI metaphor.
- Focus centers the selected node. Fit brings all nodes into view without moving them. Arrange explicitly opts back into deterministic automatic layout.

## Spatial stability

The first automatic layout draft was rejected because selection could influence the layout root and make the graph move during navigation. The final layout is selection-independent and deterministic.

Generated positions are seeded once into `GraphViewState`; subsequent note/link edits do not silently rearrange established spatial organization. Manual node movement updates only that node. `Arrange` clears saved positions deliberately, after which generated positions are seeded again.

Graph camera and node coordinates are workspace presentation state rather than analytical content. Desktop persistence serializes them under the existing SQLite `settings.graph_view` key, avoiding a schema migration.

## Persistence stabilization

Graph view loading now has one sanitizer shared by SQLite, browser-local persistence, the recovery journal, and reducer actions.

- non-finite coordinates are rejected;
- extreme coordinates are rejected before they can create pathological canvas state;
- zoom is constrained to the supported range;
- malformed camera values fall back safely;
- permanent note deletion and Empty Trash remove obsolete persisted node positions;
- soft delete preserves positions so Restore returns a node to its prior location.

## Canvas interaction stabilization

- Camera interaction now keeps a synchronous ref alongside React state so the final pointer-up commit cannot persist a stale pan position.
- Mouse/trackpad wheel panning is contained by the graph viewport.
- Zoom controls preserve the world point at the center of the viewport rather than zooming around graph origin.
- Fit computes a camera transform around the actual node bounds and never changes graph topology or saved positions.
- Connect mode exits if its source node is deleted/trashed and remains cancellable with Escape.

## Architecture and dependency policy

The graph renderer uses React, SVG, and pointer events already present in Catalyst. No graph framework, AI connector, embedding model, vector store, hosted graph service, or proprietary data format was introduced.

The existing directional `note_links` table remains a storage compatibility detail. 0.6 does not perform a cosmetic migration. A relationship-schema migration is deferred until an actual requirement such as typed relationships or edge metadata justifies it.

ADR 0008 is retained as the historical mind-map prototype and marked superseded. ADR 0009 records the graph-first decision and the local/open-core policy.

## Removed obsolete implementations

The following previous architectures are removed rather than maintained in parallel:

- full-pane `NoteEditor`;
- `NotesList`;
- one-hop `NoteMindMap`;
- their connector-specific CSS.

## Regression coverage

The regression suite now includes graph projection/layout and graph-view-state behavior in addition to the existing domain, persistence-diff, sync-queue, recovery-journal, highlight, viewer-markup, and pane-navigation tests.

## 0.6 acceptance focus

The native acceptance pass should emphasize spatial persistence, graph stability after connection changes, Fit/Focus/Arrange behavior, old-workspace compatibility, Trash/Restore lifecycle, pane-local Back/Forward, and evidence-to-PDF navigation.

---

# Catalyst 0.5.1 â€” Pane-scoped navigation

Stage 6.1 corrects the Stage 6 navigation model after runtime testing showed that one composite Back/Forward stack was not aligned with Catalyst's two independent work surfaces.

## Stabilization fixes

- Reconnecting a content-addressed document now verifies that the selected PDF has the same SHA-256 identity before touching the document record, evidence, or viewer markup. Legacy pre-hash records can still migrate to a content hash once.
- The navigation regression test now uses the same bundler module-resolution mode as the application and passes with the pinned TypeScript toolchain.
- Git now ignores the local GitHub recovery-code file that was accidentally included in a source snapshot.

## Reader history

The PDF pane now owns a `ReaderHistory` containing only document ID and zero-based page index. Opening another document or jumping to saved evidence creates Reader history. Normal scrolling updates the live Reader location without adding steps.

## Context history

The research context pane owns a separate `ContextHistory` containing active note, Notes/Evidence/Trash mode, and workspace query. Opening notes, following note links/backlinks, switching context modes, and opening note-related views create Context history.

A Context Back operation cannot move the PDF. A Reader Back operation cannot change the active note or context search state.

## Pane-local UI and shortcuts

Each pane now has its own Back/Forward controls. The PDF pane also owns Library/Open controls, which makes document actions visually belong to the reader rather than to the notes pane.

The existing keyboard shortcuts route to the last active pane. The command palette exposes explicit Reader and Context navigation commands for unambiguous access.

## Persistence and licensing

Navigation remains bounded, session-only application state. No database migration is required. No dependency was added and no licensing surface changed.

---

# Catalyst 0.5.0 â€” Research navigation history

Stage 6 adds browser-like Back/Forward navigation across the two-pane research workspace.

## Composite research locations

A Catalyst history entry stores the active document/page together with the context pane state: active note, context mode, and workspace-search query. This matters because Catalyst is not a single-page viewer; a note can remain open while the PDF moves to a source.

The history implementation lives in `src/navigation/history.ts` and has no dependency on React, Tauri, SQLite, or EmbedPDF.

## Intentional navigation vs ordinary movement

History entries are created for intentional transitions such as:

- opening a note;
- following a note connection/backlink;
- jumping to saved evidence;
- opening another document;
- switching context modes;
- creating or opening a note from selected evidence.

Ordinary PDF page changes and search-field edits are captured as the current live location but do not append entries. This prevents a long reading session from generating dozens of meaningless Back steps.

## Viewer boundary

`src/viewer/embedpdf.ts` now exposes `subscribeToPageChanges()`, adapting EmbedPDF's scroll-plugin page-change event into Catalyst's zero-based page index. The viewer-specific event object does not enter the navigation model.

## UI

Two restrained arrow buttons were added to the context header. Keyboard navigation supports `Alt+Left`, `Alt+Right`, `Ctrl+[`, and `Ctrl+]`. Back/Forward also appear in the command palette.

## Persistence policy

Navigation history is session-only by design. It is not research content and is therefore not written to SQLite, browser workspace storage, or the recovery journal. Existing persistent workspace entities are unchanged and no database migration is required.

## Tests

`test-navigation-history.mjs` covers back/forward ordering, forward invalidation after a new visit, live-location replacement, duplicate suppression, and the 80-entry bound.

No third-party dependency was added.

---

# Catalyst 0.4.0 â€” Note connections and backlinks

Stage 5 added first-class directional note links and backlinks, persisted through SQLite migration `0004_note_links.sql`, with Trash/Restore and permanent-delete lifecycle rules.

---

# Catalyst 0.3.6 â€” TypeScript 7 build repair

The 0.3.6 repair added CSS side-effect typing, corrected the repository-kind discriminant, aligned the local Tauri SQL adapter with `Database.close()`'s boolean result, and fixed the Vite-config TypeScript project settings.

## 0.6 stabilization follow-up

- New note-to-note relationship creation now rejects a reverse duplicate at the reducer boundary. Existing legacy directional pairs remain readable and project to one conceptual graph edge, but Catalyst 0.6 no longer creates a second reverse row for a relationship that already exists.
- Added `upgrade_06.ps1` to finalize an extracted 0.6 overlay by removing only the known obsolete note-era components (`NoteEditor`, `NotesList`, and the prototype `NoteMindMap`) and then running full validation unless `-SkipTests` is supplied.
- Upgrade finalization does not touch `src-tauri`.

## Post-alpha.2 design checkpoint â€” Working Picture foundation (not yet released code)

Native alpha.2 review rejected the text-first Map renderer as fundamentally difficult to navigate. Follow-on intelligence-focused research established a recognition-first Working Picture architecture rather than another incremental graph/map styling pass.

Design contracts added for the next implementation:

- `docs/working-picture-model-v0.1.md`
- `docs/portrayal-standard-v0.1.md`
- `docs/navigation-grammar-v0.1.md`
- `docs/representation-matrix-v0.1.md`
- ADR 0017: Working Picture as the primary analyst-facing surface
- ADR 0018: recognition-first heterogeneous portrayal and a custom symbol standard

This checkpoint does **not** claim these behaviors are implemented in 0.6.3-alpha.2. It is the frozen design input for alpha.3.
