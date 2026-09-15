# Overnight implementation primitives — 2026-09-11

Status: research/docs only. No Catalyst GUI manipulation and no product code changes.

Role: IMPLEMENTATION_PRIMITIVES. Coordinator resolved from `SELF_FACILITATING_CHAT_COORDINATION_2026-09-11.md` to the overnight coordinator recorded there.

## Executive conclusion

Catalyst does **not** need one large framework to own storage, canvas, graph, reader, undo, and collaboration. That would recreate the architectural collapse the research just separated.

The strongest current FOSS path is a layered stack in which Catalyst owns identity and semantics:

- SQLite remains the canonical local durable store.
- Source files/blobs remain local filesystem artifacts with hashes/version records.
- Analytical identities, occurrences, structure memberships, semantic relations, provenance anchors, and focus state remain separate Catalyst records.
- The spatial surface should prefer DOM-backed objects plus SVG/HTML portrayal and narrowly scoped interaction helpers rather than a canvas scene model becoming the database.
- Existing EmbedPDF should be tested first for text/region selection and crop rendering before replacing the reader stack.
- Graphology or similar graph libraries may provide derived graph algorithms, but semantic relations remain Catalyst records.
- Hoist/focus and transclusion are domain operations, not capabilities to delegate to a whiteboard or editor framework.
- Undo/redo is operational command history; analytical provenance is a separate durable record.
- Accessibility should be a first-order architecture constraint: focusable DOM occurrences, keyboard spatial operations, accessible structural projections, and React Aria/dnd-kit-style primitives are preferable to inaccessible canvas-only interaction.

This stack preserves the Working Picture architecture contract while minimizing bespoke infrastructure.## Baseline already present in Catalyst

The current source already contains a useful implementation foundation:

- React 19.2.8 / React DOM 19.2.8;
- Tauri 2;
- `@tauri-apps/plugin-sql` 2.4.1 with SQLite enabled in Rust;
- `@tauri-apps/plugin-fs` and persisted-scope support;
- `@embedpdf/react-pdf-viewer` 2.15.0;
- TypeScript/Vite build tooling.

Therefore this pass evaluates **incremental primitives**, not a platform rewrite.

A separate engineering issue remains: the JS package is `0.6.3-alpha.3` while `src-tauri/Cargo.toml` still reports `0.5.1`. That mismatch is already known and is not part of this research lane.

## Evaluation rules

A primitive is acceptable only if it can sit below Catalyst's state model without redefining it.

Required boundaries:

1. identity is not placement;
2. placement is not structure;
3. structure is not semantic relation;
4. connector geometry is not relation truth;
5. focus/navigation is not ontology;
6. reuse is not copy;
7. undo history is not provenance;
8. source anchoring survives representation changes;
9. derived indexes/layouts remain derived;
10. accessibility cannot depend on pointer-only canvas interaction.## 1. Local-first canonical storage

### Recommendation: keep SQLite

SQLite remains the best-fit canonical store for the next Catalyst phase.

Current SQLite is 3.53.4 (2026-07-24), is public-domain, single-file, transactional, and deliberately embedded. Catalyst already reaches SQLite through Tauri's official SQL plugin, whose v2 implementation supports migrations and is MIT/Apache-2.0 licensed.

This is a better fit than replacing the record model with a browser-first CRDT because Catalyst currently needs strict state-species boundaries more than replication.

SQLite maps naturally to:

- stable UUID analytical identities;
- multiple occurrence rows per identity;
- context-local structure membership;
- typed semantic relations;
- source/version/anchor records;
- transformation/provenance events;
- saved viewpoints;
- operational command metadata;
- rebuildable derived indexes.

Use foreign keys and explicit transactions so a command can declare and test exactly which species it mutated.

SQLite FTS5 is also available for a rebuildable local full-text index; it should index durable text/source extraction while remaining derived state rather than becoming canonical content.### Source artifacts beside the database

Large imported documents and rendered crops should not be inflated into SQL JSON blobs merely because SQLite is canonical metadata storage.

Preferred pattern:

- preserve/import the source artifact in a Catalyst-controlled local source area or retain an explicitly tracked external source path;
- calculate a content hash for each captured source version;
- store source/version metadata and locator policy in SQLite;
- store generated thumbnails/crops as disposable caches unless the rendered artifact itself has analytical significance;
- record whether an artifact is managed, externally referenced, missing, or superseded.

The hash identifies bytes/fixity, not truth or credibility.

### CRDTs: future sync envelope, not current canonical store

Automerge 3.4.1 is current as of 2026-08-12 and provides local-first documents, explicit conflicts, and storage adapters. Automerge Repo currently exposes IndexedDB and filesystem storage adapters, but its current 2.6 line remains alpha.

Yjs is mature and network-agnostic, with IndexedDB persistence and selective `UndoManager`, but its shared-type semantics are a warning for Catalyst: an integrated shared type cannot simply be moved and integrated again; copying is required. That is not the same thing as Catalyst's durable identity with multiple independent occurrences.

Conclusion: do not make either CRDT object identity equal Catalyst analytical identity. If collaboration becomes a requirement, synchronize Catalyst records/references with per-species conflict rules.## 2. Occurrence and placement model

### Recommendation: Catalyst-owned occurrence table

No canvas/editor library should own the canonical distinction between an analytical object and where it appears.

Current FOSS precedents strongly support an explicit placement record:

- TriliumNext defines a `Branch` as placement: effectively `parentNoteId + noteId`. The note itself does not carry its tree location and one note may have multiple branches.
- Trilium's “clone” is not a content copy; all placements refer to one note identity. Removing one clone normally removes only that placement.
- BlockSuite keeps page and edgeless representations isomorphic and separates frame/group/geometry behavior from underlying block content.
- Excalidraw separates element geometry, grouping, frame membership, and connector binding, reinforcing that scene organization is not one undifferentiated relationship.

Catalyst should go one step further than these precedents because free spatial placement is not hierarchical placement.

Conceptually:

`Occurrence = occurrenceId + identityId + picture/contextId + geometry + local portrayal state`

An identity may have zero, one, or many occurrences. Geometry belongs to the occurrence. Reusing an identity creates another occurrence; it does not copy content or move the first occurrence.

A separate Structure Membership record then expresses pile/territory/branch/sequence/subpicture membership without overloading either identity or geometry.### Candidate persistence shape — conceptual, not a frozen schema

The current architecture maps cleanly to records resembling:

- `identities(id, kind, durable_content, lifecycle_state, ...)`
- `pictures(id, issue_id, parent_picture_id?, title, ...)`
- `occurrences(id, identity_id, picture_id, x, y, w, h, z, rotation, representation, ...)`
- `structures(id, picture_id, kind, title, ...)`
- `structure_memberships(id, structure_id, occurrence_id, order_key, role?, ...)`
- `relations(id, subject_identity_id, predicate, object_identity_id, attribution/status, ...)`
- `relation_portrayals(id, relation_id, picture_id, source_occurrence_id?, target_occurrence_id?, route, hidden, ...)`

This is deliberately more explicit than a generic `nodes`/`edges` table.

The schema can evolve, but an implementation that cannot represent these separations without hacks is the wrong primitive.

## 3. Spatial surface

### Preferred direction: DOM-backed analytical surface

For Catalyst's first serious disposable prototype, the best architecture fit is ordinary focusable DOM objects positioned in a transformed world plane, with SVG used for branches/connectors/territories and HTML overlays for local controls.

Reasons:

- source crops, PDFs, text, images and rich controls remain native browser content;
- every occurrence can have an accessible name/role and keyboard focus;
- semantic zoom can swap DOM representations instead of rasterizing everything;
- selection state and analytical state remain inspectable in React/Catalyst rather than buried inside a scene graph;
- SVG connector portrayal can remain visibly separate from canonical relation records.### Interaction primitives for a DOM-backed surface

**dnd-kit — strong candidate.** MIT licensed. Its current architecture provides framework-neutral geometry/collision pieces plus React bindings. It explicitly supports keyboard interaction, ARIA defaults, screen-reader instructions and live-region announcements. For Catalyst, use it for drag/reorder/placement mechanics while Catalyst owns coordinates and command semantics.

**Floating UI — strong local-control candidate.** MIT licensed. It is useful for object-local popovers, menus, quick-look affordances and anchored controls without permanent sidebars. Its interaction helpers can handle focus management and dismissal, but Catalyst should still use a coherent accessible component layer.

**React Aria / React Aria Components — strong chrome/projection candidate.** Apache-2.0. Use for dialogs, buttons, menus, listboxes, overlays, text fields, and explicit tree/outline projections. This is a better accessibility foundation than hand-rolling application chrome.

**react-zoom-pan-pinch — possible camera helper.** MIT and works with ordinary DOM elements. It is useful if its transform model can be kept subordinate to Catalyst `FocusContext`; otherwise a small Catalyst camera layer may be safer.

**interact.js — possible low-level alternative.** Open source and intentionally leaves actual element mutation to the application. Useful for drag/resize/snap, but it provides less built-in keyboard/accessibility semantics than dnd-kit.

These libraries should never persist analytical objects themselves. Their state is interaction machinery.### React Flow: attractive mechanics, dangerous metaphor

React Flow is MIT licensed and unusually strong on accessibility for a spatial/graph toolkit. Current documentation says nodes and edges are keyboard-focusable/operable by default, supports Tab navigation and arrow-key node movement, exposes ARIA roles/labels, and uses live regions for movement announcements.

That makes it worth a bounded feasibility spike **only as an interaction/portrayal layer**.

Risks for Catalyst:

- its primary data language is still nodes and edges;
- edge existence could easily leak into semantic-relation truth;
- layout helpers may encourage geometry to become graph output rather than analyst-authored state;
- custom document/source landmarks may fight assumptions optimized for flow diagrams.

If tried, Catalyst identities/relations must remain outside React Flow's canonical store. React Flow nodes should be generated from occurrences; edges should be generated from branch/relation portrayals. Deleting a rendered edge must not directly delete a semantic relation unless an explicit Catalyst command says so.

### Canvas scene engines: useful but second choice

Konva/react-konva is MIT and currently fits Catalyst's React 19.2.x line. Fabric.js is also MIT and provides a rich HTML5-canvas object model. Both are mature ways to build design-editor mechanics.

Their main architectural cost is accessibility: canvas objects are not automatically useful DOM accessibility objects. Catalyst would need a synchronized accessibility/outline layer and explicit keyboard operation model.

Use a canvas scene engine only if mixed-media density/performance proves DOM/SVG insufficient. Do not choose it merely because free-form movement is easy.### Excalidraw: FOSS reference/backup, not preferred substrate

Excalidraw is genuinely MIT licensed, embeddable as a React component, local-first in its full app, and can self-host its fonts. It is therefore a legitimate FOSS option unlike current tldraw.

However, a published Deque audit identified keyboard-only and focus-indicator problems in the whiteboard surface. The current Catalyst requirement is broader than “can embed a whiteboard”: spatial analytical material must remain operable through keyboard and assistive technology.

Excalidraw remains valuable for:

- scene-file and binding design precedents;
- quick disposable experiments;
- freehand/diagram features if those become separately needed.

It is not the leading candidate for the core Working Picture interaction plane.

### tldraw: reject for Catalyst's FOSS implementation boundary

This corrects the earlier UI tooling scout.

Current tldraw SDK releases are **source available, not Open Source**. The official license allows development use by default, requires a trial/commercial/hobby license key for production, and explicitly says the SDK is not permissively licensed/Open Source.

Therefore tldraw can remain a design/API reference, but it should not be selected as Catalyst's implementation substrate under the project's non-proprietary/FOSS intent.

This is a material research correction and should supersede the earlier “strong candidate” language in `PASS-2026-09-11-ui-tooling-scout.md`.## 4. Document anchoring and source-region capture

### First recommendation: exploit existing EmbedPDF before replacing it

Catalyst already depends on `@embedpdf/react-pdf-viewer` 2.15.0. Current EmbedPDF documentation exposes the exact primitives Catalyst needs to test:

- a Selection plugin with selected text, page index, bounding box and individual text-line rectangles;
- selection-end/change events suitable for contextual capture actions;
- a render API with `renderPageRect`, returning an image for a specific page-coordinate rectangle;
- headless/composable plugins rather than a mandatory full reader shell.

This means the first source-region prototype can probably be built without introducing a second PDF viewer.

Current repository licensing also needs precise wording: the repository's authoritative `LICENSING.md` says the `@embedpdf/*` SDK packages are Apache-2.0. The separate `cloudpdf/server` product is Fair Source/FCL and requires licensing. Catalyst should use only the FOSS SDK packages and verify the installed package metadata/lock before shipping.

### Catalyst-owned anchor bundle

Do not persist only the viewer's transient selection object.

For a PDF region, retain a complementary bundle resembling:

- Source Identity;
- source version/content hash;
- page index/number;
- page-coordinate rectangle(s) or quads;
- selected/extracted text quote when available;
- optional text-position data if stable enough;
- capture-time transformation/rotation context;
- resolution status and last validation result.

The viewer library resolves/renderers; Catalyst owns the durable anchor semantics.### Anchoring precedent: Hypothesis / W3C selector fallback

Hypothesis remains the strongest FOSS precedent for robust source return. Its anchoring code attempts multiple selectors rather than trusting a single coordinate: DOM Range when possible, TextPosition, and TextQuote/fuzzy recovery, with quote validation.

Catalyst should generalize that principle across formats:

- exact native selector first;
- complementary textual/structural selectors next;
- fuzzy recovery only as an explicitly degraded state;
- unresolved remains unresolved rather than silently retargeting.

For PDFs, page geometry plus quote/text context gives useful redundancy. For HTML/plain text, W3C TextQuote/TextPosition-style selectors are appropriate. Images may use image-coordinate regions plus source-version hash.

### Alternative helpers

`react-pdf-selection` is MIT and already models text and rectangular selections in viewport-independent coordinates; it is a useful reference or small fallback implementation.

PDF.js remains the Apache-2.0 lower-level escape hatch if a higher-level viewer blocks exact anchoring.

Lector is an MIT composable React/PDF.js toolkit and remains a plausible replacement if EmbedPDF proves unsuitable, but introducing it before testing the already-installed stack would add churn without evidence.

The acceptance criterion is not “selection works.” It is: capture → place/reuse → reopen source → resolve exact/degraded/unresolved honestly → return to the prior analytical neighborhood.## 5. Relations and graph computation

### Canonical relation = Catalyst record

A Semantic Relation should remain a durable typed record linking Analytical Identities, with attribution/status where appropriate.

Its visible connector is a separate portrayal record. One semantic relation may be invisible, visible once, or portrayed differently in several Working Pictures.

Do not let a graph UI library's `edge` record become the ontology.

### Graphology: good derived computation layer

Graphology is MIT-licensed JavaScript/TypeScript graph infrastructure supporting directed, undirected and mixed graphs plus algorithms and events.

It is a good fit for:

- derived neighborhood queries;
- graph metrics;
- path analysis;
- semantic-graph projections;
- algorithm inputs/outputs that can be rebuilt from Catalyst records.

It is **not** the canonical persistence layer. Build/refresh a Graphology graph from SQLite identities/relations when a graph lens needs it.

This preserves the architecture rule that a projection is not a conversion and a computed graph layout cannot overwrite Working Picture geography.## 6. Hoist, focus and return

### Hoist is a FocusContext operation, not reparenting

TriliumNext demonstrates the usefulness of note hoisting, but Catalyst cannot inherit a mandatory tree ontology merely to obtain focus-in-context.

Implement hoist/focus as Catalyst session state referencing a context and a return token.

A practical return token can contain:

- current picture/subpicture id;
- originating occurrence id when applicable;
- projection/lens id;
- camera center/scale or visible bounds;
- selected/focused identity/occurrence;
- source anchor or reader state when entering a source;
- optional transient local UI state needed to resume the task.

`Enter/Open/Focus` pushes a token; `Back/Escape` unwinds representational escalation before changing analytical place. `Home` resolves to the current bounded Working Picture.

Ordinary focus state may be crash/session persisted, but it does not become durable analytical content merely because it is persisted.

`Save view`/`Bookmark context` is an explicit promotion into a Saved View record.

No canvas camera library should determine this semantic boundary.## 7. Transclusion, reuse and editable content

### Reuse is an occurrence/reference operation

Logseq's block references/embeds and Trilium's clones provide the right conceptual precedent: the same durable content can appear in multiple contexts without being copied.

Catalyst should resolve transclusion by UUID/reference at render time:

`Occurrence -> Analytical Identity -> current durable content`

Local occurrence state controls representation, size, placement and perhaps excerpting; it does not fork the underlying content.

Editing durable content through a reuse normally edits the shared identity. `Fork/Duplicate as new object` is the explicit operation that creates a new identity and lineage.

### Rich-text editor option: Lexical

If Catalyst needs a richer embedded editor, Lexical is a strong FOSS candidate: MIT licensed, accessibility-oriented, immutable editor state, custom nodes, serialization, history/undo support and Yjs integration.

A Catalyst-specific reference/embed node could render another analytical identity without copying its content into the editor document.

But a rich editor is not required to prove the Working Picture architecture. For the disposable prototype, simple text content may be preferable so the prototype tests identity/placement/source-return semantics rather than editor complexity.

ProseMirror/Milkdown remain credible alternatives if Markdown-first authoring becomes a stronger requirement.## 8. Undo/redo versus provenance

### Separate two histories

Catalyst needs at least two conceptually different histories:

**Operational undo/redo** answers: “how do I reverse my last editing command?”

**Analytical provenance/history** answers: “where did this durable artifact/assertion come from, what method changed it, who authored/revised it, and what source/version supported that transition?”

They must not be the same log.

Recommended command discipline:

- route consequential UI operations through named commands;
- execute each command in a transaction;
- declare which state species the command may mutate;
- capture an inverse or sufficient before-state for user undo;
- emit durable provenance/history only for domain-significant events.

Moving a card 12 pixels may belong in undo; it should not become permanent intelligence provenance.

Capturing a source region, deriving a summary, promoting structure, asserting/retracting a semantic relation, resolving source drift, or superseding an analytical artifact may require durable history/provenance.### Candidate undo mechanics

A custom command stack is the clearest fit because Catalyst needs mutation-species instrumentation anyway.

Small FOSS helpers remain useful:

- Immer patches can record forward/inverse state patches and replay them, but patches are implementation mechanics rather than provenance.
- `zundo` can add selective undo/redo to Zustand state and supports partialization/diffing, but a UI state store should not become the canonical durable record.
- Yjs `UndoManager` is selective and origin-aware, but it is relevant only if Yjs eventually owns collaborative editor state.
- SQLite's Sessions extension can capture/revert database changes, but relying on that C-level facility through the current Tauri plugin would add integration complexity and still would not solve domain provenance semantics.

The prototype observability harness should use the same command boundary: compare declared allowed state species with actual mutations after each command.

### Transformation provenance

Retain the OpenRefine-derived separation already established in research:

- reusable transformation specification/method;
- execution event;
- exact input identities/versions;
- produced output identity/version;
- author/tool and time;
- subsequent manual edits as separate history.

A replayable recipe is not evidence that it actually ran, and undoing an edit is not a substitute for provenance.## 9. Accessible UI primitives

Accessibility changes the canvas choice rather than being a polishing pass.

### Recommended accessibility stack

**React Aria / React Aria Components** for normal application controls, overlays, dialogs, lists and explicit tree/outline projections. Its source is Apache-2.0 and its interaction primitives handle keyboard/focus behavior across input modalities.

**dnd-kit** for draggable/movable DOM occurrences where appropriate. It ships keyboard support, default ARIA attributes, screen-reader instructions and live regions, but its own documentation correctly says these are starting points that must be tailored to the application.

**Focusable DOM occurrences** for the core Working Picture. Each occurrence should have an accessible name, type/role description, selected state, reuse status when relevant, and discoverable keyboard commands.

**SVG/visual connectors plus a semantic relation list/projection** rather than expecting a screen reader to interpret line geometry.

**Accessible alternate projection.** A synchronized outline/tree/list is not merely a fallback for blind users; it is a legitimate projection over explicit Structure Membership and provides a non-spatial route through the same analytical identities.

React Aria already supplies a Tree implementation suitable for the explicit branch/outline projection when structure exists.### Spatial keyboard contract to prototype

At minimum, a keyboard-only evaluator should be able to:

- move focus among placed occurrences without depending on pointer hit-testing;
- select/register an occurrence without opening a giant inspector;
- invoke object-local actions;
- move/reposition an occurrence with keyboard commands;
- enter Quick Look/Open/Inspect and return;
- enter a subpicture and restore the originating analytical neighborhood;
- inspect explicit structure and semantic relations through non-geometric projections;
- distinguish reuse from copy/fork;
- create or remove structure/relation through explicit commands rather than gestures only.

Camera pan/zoom must have keyboard/control alternatives and must not trap focus.

Semantic zoom should preserve a stable accessible name even when the visible representation changes.

## 10. Primitive decision matrix

| Concern | Preferred primitive | Status | Primary caution |
| --- | --- | --- | --- |
| canonical local data | SQLite via existing Tauri SQL plugin | adopt/retain | migrations and state-species discipline |
| source files | Tauri FS + Catalyst version/hash records | adopt/retain | external vs managed-file lifecycle |
| full-text search | SQLite FTS5 | likely | derived index, not canonical truth |
| occurrences | Catalyst SQL records | own | never library scene identity |
| spatial movement | DOM + dnd-kit/custom geometry | spike | free 2D movement needs careful keyboard model |
| camera | small Catalyst layer or react-zoom-pan-pinch | spike | FocusContext remains Catalyst-owned |
| contextual controls | Floating UI + React Aria | strong | do not reintroduce chrome density |
| accessible controls | React Aria Components | strong | portrayals still need app-specific semantics |
| explicit branch projection | React Aria Tree | strong | tree only when structure is authored |
| relation algorithms | Graphology derived graph | strong | never canonical persistence || Concern | Preferred primitive | Status | Primary caution |
| --- | --- | --- | --- |
| PDF/source viewer | existing EmbedPDF 2.15.0 | test first | persist Catalyst anchors, not plugin objects |
| PDF crop rendering | EmbedPDF `renderPageRect` | strong | derived image cache vs analytical artifact |
| robust anchoring | Catalyst selector bundle informed by Hypothesis/W3C | own | expose degraded/unresolved recovery |
| transclusion/reuse | Catalyst UUID occurrence/reference | own | no hidden copy semantics |
| rich text | Lexical if needed | optional | editor-local node identity is not Catalyst identity |
| undo/redo | Catalyst command stack; optional Immer/zundo helpers | own | never substitute for provenance |
| collaboration | Automerge/Yjs later | defer | CRDT conflict != analytical disagreement |
| React Flow | mechanics-only feasibility option | conditional | graph metaphor/edge truth leakage |
| Konva/Fabric | dense canvas fallback | conditional | accessibility mirror required |
| Excalidraw | reference/backup prototype | conditional | scene coupling and keyboard accessibility |
| BlockSuite | architectural reference / possible heavy framework | reference | MPL-2.0, large framework, excess ontology |
| tldraw SDK | none | reject for FOSS stack | current SDK is source-available/licensed, not OSS |

## 11. Why not select BlockSuite as the whole platform?

BlockSuite is one of the strongest current FOSS architectural precedents. It demonstrates isomorphic page/edgeless representations, frames/groups distinct from block hierarchy, per-user undo/redo, collaboration, streaming, and extensibility. It is MPL-2.0.

But adopting BlockSuite as Catalyst's foundation would import a large document/block/edgeless model at exactly the point where Catalyst has finally separated its own domain species.

The implementation risk is not license incompatibility alone; it is conceptual gravity. Catalyst could end up expressing analytical identity, source anchoring, structure and occurrence through whichever BlockSuite object happens to be easiest.

Use BlockSuite as a source of tested patterns and possibly isolated components only after proving they map cleanly to the Catalyst contract.## 12. Recommended implementation stack for the disposable prototype

The smallest stack worth testing is intentionally conservative:

**Keep:** React 19, Tauri 2, SQLite/Tauri SQL, Tauri FS, existing EmbedPDF.

**Add only if the spike demonstrates need:**

- `@dnd-kit/*` for keyboard-aware DOM movement/drag mechanics;
- React Aria Components for accessible local controls/dialogs/outline;
- Floating UI if object-local positioning is not adequately covered by React Aria overlays;
- Graphology only when a real graph projection/algorithm appears;
- a zoom/pan helper only if a small Catalyst camera implementation becomes wasteful.

Do **not** add a rich-text framework, CRDT, canvas scene engine, or full whiteboard SDK merely to start the prototype.

### Prototype state boundary

The disposable prototype should still use explicit in-memory/SQLite records matching the architecture contract, even if persistence is temporary.

Every user-visible operation should enter through a command boundary such as:

- `place(identity, picture, geometry)`
- `moveOccurrence(occurrence, geometry)`
- `reuse(identity, picture, geometry)`
- `makeStructure(kind, occurrenceIds)`
- `assertRelation(subjectIdentity, predicate, objectIdentity)`
- `captureAnchor(sourceVersion, selectors)`
- `derive(inputs, transformation, output)`
- `enter(target, returnToken)` / `return()`
- `removeOccurrence(occurrence)`

That is more important than which drag library handles pointer events.## 13. Falsifiable feasibility sequence

The implementation research should be judged with one narrow spike before production adoption.

### P0 — license and bundle verification

- verify installed package licenses from package metadata/lockfiles;
- keep CloudPDF server and current tldraw SDK out of the dependency tree;
- record bundle-size changes before adding a canvas/editor framework.

### P1 — identity/occurrence mechanics

Create two identities and three occurrences in two bounded pictures. Move one occurrence repeatedly. Mutation trace must show geometry changes only on that occurrence.

### P2 — accessible spatial operation

Using keyboard only, focus an occurrence, select it, move it, open its local actions, and return focus predictably. Pointer drag must invoke the same Catalyst command as keyboard movement.

### P3 — source region

Open a PDF through existing EmbedPDF, select text/region, persist page-coordinate + quote selectors, render a crop, place it as an occurrence, reopen exact source context, then return to the same Working Picture neighborhood.

### P4 — structure versus relation

Place two occurrences near each other without hidden mutation; explicitly promote them into structure; separately assert a semantic relation; hide/reroute its connector without retracting the relation.

### P5 — reuse/hoist

Reuse one anchored identity in a subpicture, enter it, inspect the source, and unwind back to the originating occurrence/camera context. Remove one occurrence and verify the identity and other occurrence survive.### P6 — density/performance gate

Only after P1–P5 are correct should the DOM/SVG surface be stressed with representative mixed media.

Measure:

- 25 / 50 / 100+ placed occurrences;
- multiple source crops and image landmarks;
- visible versus latent relation portrayals;
- camera pan/zoom responsiveness;
- focus traversal and keyboard movement;
- memory growth during repeated enter/return cycles.

If DOM/SVG performance fails at realistic Catalyst densities, profile first. Only then evaluate Konva/Fabric or a hybrid raster/DOM surface. Do not preemptively trade away accessibility and native document composition for hypothetical scale.

### P7 — source drift gate

Replace/update the source representation and re-resolve a stored anchor.

The UI and trace must distinguish:

- exact/validated;
- recovered/degraded;
- ambiguous;
- unresolved/unavailable.

No library is accepted if it makes fuzzy recovery look exact or rewrites the original source/version provenance target.## 14. Remaining implementation risks

### DOM spatial mechanics

The research supports a DOM-first surface, but free two-dimensional keyboard movement, lasso selection, resize handles, transformed hit testing, and very large mixed-media pictures still require a real spike. dnd-kit is not an infinite-canvas product and should not be expected to supply a complete coordinate system.

### EmbedPDF anchor fidelity

Current APIs appear sufficient for text selection and rectangular crop rendering, but Catalyst must test coordinate stability under rotation, zoom, mixed page sizes, scanned PDFs, OCR/no-text PDFs, and source-version changes.

### Accessible spatial navigation

Tab-through-everything may become unusable at higher density. The prototype should compare logical Tab order, spatial arrow navigation, search/jump, and synchronized outline projection rather than assuming one keyboard traversal model.

### Rich text/transclusion

Editable same-identity transclusion becomes harder if identity content is embedded deeply inside editor-specific JSON. Delay choosing Lexical/ProseMirror until the reuse contract can be demonstrated with simple content.

### Undo granularity

Pointer dragging can emit many geometry updates. The command layer needs transaction/coalescing semantics so one deliberate drag normally becomes one undo unit without turning every pointermove into history/provenance.

### Long-term collaboration

Future Automerge/Yjs integration will require explicit merge rules for compound authored state. In particular, geometry, provenance selector bundles, assessments and relation state must not merge into combinations no analyst actually authored.## 15. High-value sources checked in this pass

### Storage / local-first

- SQLite home / current release — https://sqlite.org/ and https://www.sqlite.org/releaselog/3_53_4.html
- SQLite FTS5 — https://www.sqlite.org/fts5.html
- Tauri SQL plugin v2 — https://github.com/tauri-apps/plugins-workspace/tree/v2/plugins/sql
- Automerge storage / local sync — https://automerge.org/docs/reference/repositories/storage/ and https://automerge.org/docs/tutorial/local-sync/
- Automerge 3.4.1 releases — https://github.com/automerge/automerge/releases
- Yjs shared-type caveats / undo — https://docs.yjs.dev/getting-started/working-with-shared-types and https://docs.yjs.dev/api/undo-manager

### Occurrence / transclusion / structure

- TriliumNext tree concepts — https://docs.triliumnotes.org/user-guide/concepts/navigation/tree-concepts
- TriliumNext cloning — https://triliumnext.github.io/Docs/Wiki/cloning-notes.html
- TriliumNext architecture/entity notes — https://github.com/TriliumNext/trilium
- BlockSuite edgeless data structure — https://blocksuite.io/components/editors/edgeless-data-structure
- BlockSuite frame behavior — https://blocksuite.io/components/blocks/frame-block
- Logseq block reference/embed syntax — https://github.com/logseq/docs/blob/master/pages/Markdown.md

### Spatial / accessibility primitives

- React Flow accessibility — https://reactflow.dev/learn/advanced-use/accessibility
- React Flow repository/license — https://github.com/xyflow/xyflow
- dnd-kit accessibility/repository — https://dndkit.com/legacy/guides/accessibility/ and https://github.com/clauderic/dnd-kit
- React Aria / React Spectrum — https://github.com/adobe/react-spectrum
- Floating UI license — https://github.com/floating-ui/floating-ui/blob/master/LICENSE- react-zoom-pan-pinch — https://github.com/BetterTyped/react-zoom-pan-pinch
- Konva/react-konva — https://github.com/konvajs/konva and https://github.com/konvajs/react-konva
- Fabric.js — https://github.com/fabricjs/fabric.js
- Excalidraw — https://github.com/excalidraw/excalidraw
- Excalidraw accessibility audit issue — https://github.com/excalidraw/excalidraw/issues/7492
- tldraw current licensing — https://tldraw.dev/community/license

### Source/document anchoring

- EmbedPDF selection plugin — https://www.embedpdf.com/docs/react/headless/plugins/plugin-selection
- EmbedPDF render-page-rect — https://www.embedpdf.com/docs/engines/rendering/render-page-rect
- EmbedPDF current licensing policy — https://github.com/embedpdf/embed-pdf-viewer/blob/main/LICENSING.md
- Hypothesis client — https://github.com/hypothesis/client
- Hypothesis anchoring implementation — https://github.com/hypothesis/client/blob/main/src/annotator/anchoring/html.ts
- react-pdf-selection — https://github.com/MathiasMeuleman/react-pdf-selection

### Relations / editing

- Graphology — https://github.com/graphology/graphology
- Lexical — https://github.com/facebook/lexical

## Research decision

Current recommendation: **do not choose a monolithic canvas or CRDT framework before prototyping the state boundaries.** The first implementation feasibility pass should be built from the existing Catalyst/Tauri/SQLite/EmbedPDF foundation plus small FOSS accessibility/interaction primitives. Add heavier scene/editor/collaboration frameworks only when a measured requirement justifies them.

This is the implementation counterpart of the Working Picture architecture contract: Catalyst should own the meaning; libraries should own mechanics.