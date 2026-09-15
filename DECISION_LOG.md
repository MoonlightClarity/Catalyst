# Catalyst decision log

Status: **current decision summary — 2026-09-15**

This file summarizes only decisions that still govern the mounted product. Detailed rationale remains in `docs/adr/`; older decision history is preserved in `docs/research/DECISION_LOG.md` and dated research artifacts.

## Product boundary

- Catalyst is local-first and must remain useful without proprietary services or an AI backend.
- Intelligence methodology is a design foundation, not a restriction on who can use the product.
- Catalyst owns source work, structured thought/notes, Outline structure, supported analytical metadata/relationships, and structured analytic techniques.
- Formal assessments, reports, and briefings are downstream products rather than Catalyst-owned authoring surfaces.
- Beta is a convergence/stabilization phase, not a feature-expansion cycle.

## Structural ownership

- Outline is the authoritative structural authoring surface.
- Parent/child hierarchy and sibling order carry structural placement, not implicit analytical meaning.
- Generated Map portrays Outline-authored structure deterministically and cannot become a second structural editor.
- Semantic relationships do not manufacture Outline hierarchy.
- Map viewport/geometry/focus and Outline fold/focus state are presentation/session concerns rather than analytical truth.

## Reader and source boundary

- Source PDFs remain separate from Catalyst workspace XML.
- Content-addressed PDF records reconnect only to matching SHA-256 source bytes.
- Viewer-native/PDF-local markup is distinct from Catalyst-managed source annotation/analytical semantics.
- Source annotation does not imply analyst endorsement.
- Catalyst does not currently expose derived-output export features. Save/Load `.catalyst.xml` operations are persistence, not export.
## Methods / Techniques ownership

- Techniques are independent workflow objects, not thought/Outline/Map metadata.
- Technique runs are explicitly ordered and open into focused working space.
- The active editor is intentionally minimal: Name, Subtask, Analysis.
- Catalog cluster/category metadata belongs in discovery, not as repeated working-list chrome.
- Genuinely blank/custom techniques remain supported.
- Technique work remains inside persisted Catalyst workspace state; there is no current PDF/RTF/document export surface.

## Persistence and runtime

- React/TypeScript/Vite + Catalyst XML is the active runtime/persistence architecture.
- `XmlWorkspaceRepository` is canonical; explicit portable files use `.catalyst.xml`.
- Recovery-journal state exists to protect edits before debounced durable persistence completes.
- Tauri/SQLite is archived historical architecture, not a beta runtime requirement.

## Explicitly retired for beta

- standalone Evidence workspace/tab;
- formal Assessment workflow/domain product;
- Catalyst-wide undo/redo history;
- thought/note-linking as a primary authoring workflow;
- graph-first/free-spatial Map structural editing;
- the legacy Techniques screen and thought-owned techniques;
- active Tauri/SQLite runtime requirements.

Native editor-local undo, ordinary analytical terms such as “assessment” and “evidence,” and compatibility state that still protects current behavior are not prohibited by those retirements.