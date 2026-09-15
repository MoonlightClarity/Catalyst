# Catalyst current architecture

Status: **source-of-truth snapshot â€” 2026-09-15**

This document describes the mounted product after the September 14â€“15 simplification and convergence work. Newer accepted ADRs may supersede it; older alpha acceptance, Working Picture, Evidence, Assessment, graph-first, and Tauri/SQLite material is historical unless explicitly reaffirmed here.

## Product boundary

Catalyst is a local-first analytical workspace. Its active core is source reading/annotation, authored thoughts and notes, Outline-controlled structure, generated Map portrayal, supported analytical metadata/relationships, and structured analytic techniques.

Catalyst does **not** own formal Assessment, report, or briefing authoring. Those are downstream products. ADR 0026 removes Assessment specifically; ADR 0027 freezes the broader late-alpha product surface for beta convergence.

## Active runtime and persistence

The mounted application is React/TypeScript/Vite. `run.ps1` launches the Vite runtime at the repository-defined development port. The former Tauri/SQLite shell is archived under `legacy/tauri-shell`; Rust, WebView2, SQLite migrations, Tauri permissions/icon wiring, and Cargo validation are not active-runtime prerequisites.

`XmlWorkspaceRepository` is the canonical workspace repository. It automatically serializes durable workspace state as Catalyst XML in browser local storage. Explicit **Save** writes a portable `.catalyst.xml` file; explicit **Load** imports one, replaces stored workspace state, and clears stale crash-recovery journal state before reload.

The synchronous recovery journal protects the interval before debounced repository writes finish. It is cleared only after the exact latest state reaches durable repository storage.
## Source files and Reader boundary

Source PDFs remain separate from workspace XML. Browser-cached PDF bytes and saved document records use SHA-256 content identity. A content-addressed saved record may reconnect only to the same bytes; older non-content-addressed records may migrate once to the selected source hash.

The Reader owns PDF navigation and viewer-native markup. Catalyst-managed source annotations/highlights are a separate analytical/source layer even when both appear on the PDF. Neither ordinary workspace persistence nor annotation editing mutates the original source PDF.

The Reader stores per-document last-page resume state as a browser-local preference. Reader back/forward navigation history is separate ephemeral session state and is not durable analytical truth.

## Session/file controls

The Reader header exposes four distinct operations:

- **New** unloads the current session and starts a blank workspace; it does not delete saved `.catalyst.xml` files or original PDFs.
- **Load** opens a `.catalyst.xml` workspace. Supported browsers use the persistent `catalyst-session` picker ID shared with Save; fallback browsers use a normal file input.
- **Save** writes durable workspace state to `.catalyst.xml`; supported browsers use the save picker and fallbacks download a named XML file.
- **Open** opens or reconnects a source PDF; source files remain separate from workspace XML and content-addressed references are identity-checked.
Catalyst currently exposes no derived-output export feature. Save/Load are workspace persistence operations, not report, PDF, RTF, PNG, or interchange exports.

## Outline and Map ownership

The **Outline authors structure**. Parent/child placement and sibling order are authored there. The analysis shell defaults to Outline, which supports structural create/rename/reorder/indent/outdent/fold/trash behavior and keyboard navigation.

The **Map portrays authored structure**. Map View is generated from the current analytical/Outline state and remains a portrayal rather than an output/export surface. Semantic relationships may inform portrayal but cannot manufacture canonical hierarchy.

The current note-keyed Map occurrence model and older graph/map state remain compatibility scaffolding around the newer first-class Outline model. ADR 0021 and `outline-ontology-v0.1.md` define the structural direction; ADR 0023 and `map-ontology-v0.1.md` define Map projection semantics.

## Methods / Techniques ownership

The user-facing workspace tab is currently labeled **Methods** while implementation components and durable documentation use Techniques terminology. Techniques are independent from thoughts, Outline placements, Map nodes, and formal Assessment.

The working surface is an ordered list. Selecting a run opens focused editing for **Name**, **Subtask**, and **Analysis**. Subtasks may be added or removed. Catalog discovery may use search and cluster metadata, while the working list intentionally omits repeated taxonomy/field-count chrome.

The picker supports catalog definitions and genuinely blank/custom insertion. Technique definitions/runs remain persisted workspace state. Catalyst does not currently export Technique work to PDF, RTF, or another derived document format.

## Removed or superseded product concepts

The following are not current required product surfaces: formal Assessment; the standalone Evidence workspace/tab; Catalyst-wide undo/redo; thought/note-linking as a primary authoring workflow; graph-first/free-spatial Map structural editing; the legacy Techniques screen; and Tauri/SQLite as active runtime/persistence authority.

Evidence/source concepts and the ordinary analytical word â€œassessmentâ€ remain valid where analytically appropriate. Product-surface removal is not a vocabulary ban.

## Known convergence debt

Internal names and compatibility state still lag the simplified product. `src/App.tsx` uses the `graph` context key and mounts `WorkingPictureWorkspace` behind the user-facing Outline tab. `noteLinks`, legacy graph/map reducer state, note-keyed Map occurrences, and historically named tests/prototypes remain. Audit their current invariants before removing them.

The previously documented `isLegacyAssessmentRun` shim is no longer present in `src/domain/workspace.ts`. No formal Assessment product compatibility logic was found in the current source; remaining Assessment-named techniques/prompts are legitimate catalog vocabulary.

The command palette still exposes **Open Portrayal Lab** as a development/prototype action. Review that exposure before beta. Package version `0.6.3-alpha.3` also predates the current simplification and should be treated as a build/compatibility identifier rather than an exact product-surface description.

## Release-readiness status

Catalyst is a late-alpha development tree. An earlier `test.ps1 -Full` baseline passed on 2026-09-15. Stale legacy regression assertions found during this cleanup were corrected, but the current aggregate gate remains red because `AnalysisOutlineView.tsx` is mid-refactor and its current prop/helper declarations do not match its body/caller. The npm license audit passes independently; a current production build cannot be claimed green until that TypeScript inconsistency is resolved. See `release-readiness.md` for the exact current revalidation record.

Current beta criteria and hardening priorities are maintained in `release-readiness.md` and `roadmap.md`. For meaningful implementation changes, run appropriate focused coverage plus `npm run check` / `test.ps1`; documentation-only changes should at minimum validate paths, commands, authority links, and the repository documentation/research handoff contract.

## Normative order

When documents conflict, prefer: newer accepted ADRs; this snapshot; `release-readiness.md`; root `CURRENT_STATE.md` and `DECISION_LOG.md`; frozen Outline/Map/annotation ontology documents; current implementation-specific docs; then historical alpha/research/acceptance material.
