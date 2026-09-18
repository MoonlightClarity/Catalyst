# Catalyst current architecture

Status: **source-of-truth snapshot — 2026-09-17**

This document describes the mounted product after the September 14–17 simplification and convergence work and the 1.1 restoration of a focused relational Map. Newer accepted ADRs may supersede it; older alpha acceptance, Working Picture/free-spatial Map, Evidence, Assessment, graph-first, and Tauri/SQLite material is historical unless explicitly reaffirmed here.

## Product boundary

Catalyst is a local-first analytical workspace. Its active core is source reading/annotation, Outline-controlled structure with inline notes, ordered Methods / Techniques, explicit typed relationships, a read-only relational Map, portable XML sessions, and whole-analysis document export.

Catalyst does **not** own formal Assessment, report, or briefing authoring. Those are downstream products. ADR 0026 removes Assessment specifically; ADR 0027 freezes the broader late-alpha product surface for beta convergence.

## Active runtime and persistence

The mounted application is React/TypeScript/Vite. `run.ps1` launches the Vite runtime at the repository-defined development port. The former Tauri/SQLite shell is archived under `legacy/tauri-shell`; Rust, WebView2, SQLite migrations, Tauri permissions/icon wiring, and Cargo validation are not active-runtime prerequisites.

`XmlWorkspaceRepository` is the canonical workspace repository. It automatically serializes durable workspace state as Catalyst XML in browser local storage. Explicit **Save** writes a portable `.catalyst.xml` file; explicit **Load** imports one, replaces stored workspace state, and clears stale crash-recovery journal state before reload.

The synchronous recovery journal protects the interval before debounced repository writes finish. It is cleared only after the exact latest state reaches durable repository storage.
## Source files and Reader boundary

Source PDFs remain separate from workspace XML. Browser-cached PDF bytes and saved document records use SHA-256 content identity. A content-addressed saved record may reconnect only to the same bytes; older non-content-addressed records may migrate once to the selected source hash.

The active Reader is EmbedPDF (`@embedpdf/react-pdf-viewer`), mounted through `src/viewer/EmbedPdfReader.tsx` and isolated behind Catalyst's viewer bridge. EmbedPDF owns PDF navigation and the only visual PDF annotation tools; Catalyst no longer registers a separate marks toolbar or custom analytic-mark tools. Native viewer annotations may be persisted with the workspace, but Catalyst does not layer a competing annotation UI over the reader. The retired Thorium/PDF.js reader implementation is no longer part of the active source tree or dependency surface. Neither ordinary workspace persistence nor annotation editing mutates the original source PDF.

The Reader stores per-document last-page resume state as a browser-local preference. Reader back/forward navigation history is separate ephemeral session state and is not durable analytical truth.

## Session/file controls

The Reader header exposes five distinct operations:

- **New** unloads the current session and starts a blank workspace; it does not delete saved `.catalyst.xml` files or original PDFs.
- **Load** opens a `.catalyst.xml` workspace. Supported browsers use the persistent `catalyst-session` picker ID shared with Save; fallback browsers use a normal file input.
- **Save** writes durable workspace state to `.catalyst.xml`; supported browsers use the save picker and fallbacks download a named XML file.
- **Export** writes the complete authored Outline followed by Methods as PDF, DOCX, or RTF; catalog definitions and instructional prompts are excluded.
- **Open** opens or reconnects a source PDF; source files remain separate from workspace XML and content-addressed references are identity-checked.
Save/Load remain workspace persistence operations; Export is a downstream document handoff.

## Outline ownership

The **Outline authors structure**. Parent/child placement and sibling order are authored there. The analysis shell defaults to Outline, which supports structural create/rename/reorder/indent/outdent/fold/trash behavior, inline notes, and keyboard navigation.

The Map is an active read-only relational portrayal. It visualizes Outline and Methods entities plus explicit within-surface and cross-surface relationships. Outline hierarchy and Methods ordering supply stable addresses/order only; the Map does not author hierarchy, create implicit analytical meaning from hierarchy, or become a second structural editor.

## Methods / Techniques ownership

The user-facing workspace tab is currently labeled **Methods** while implementation components and durable documentation use Techniques terminology. Techniques are independent from Outline structure and formal Assessment.

The working surface is an ordered list. Selecting a run opens focused editing for **Name**, **Subtask**, and **Analysis**. Subtasks may be added or removed. Catalog discovery may use search and cluster metadata, while the working list intentionally omits repeated taxonomy/field-count chrome.

The picker supports catalog definitions and genuinely blank/custom insertion. The full catalog is intentionally a read-only LLM reference and is not exposed as an ordinary editable Methods surface. Technique definitions/runs remain persisted workspace state. Catalyst exports the combined Outline + Methods document through the unified export control.

## Removed or superseded product concepts

The following are not current required product surfaces: formal Assessment; the standalone Evidence workspace/tab; Catalyst-wide undo/redo; thought/note-linking as a primary authoring workflow; graph-first/free-spatial Map structural editing; the legacy Techniques screen; and Tauri/SQLite as active runtime/persistence authority.

Evidence/source concepts and the ordinary analytical word “assessment” remain valid where analytically appropriate. Product-surface removal is not a vocabulary ban.

## Known convergence debt

Internal names and compatibility state still lag the simplified product. `src/App.tsx` still uses the `graph` context key, and historical Working Picture / free-spatial Map state and naming remain in parts of the implementation. The active 1.1 Map is the relational view backed by current relationship state; older Map machinery is cleanup debt where current behavior no longer depends on it.

The previously documented `isLegacyAssessmentRun` shim is no longer present in `src/domain/workspace.ts`. No formal Assessment product compatibility logic was found in the current source; remaining Assessment-named techniques/prompts are legitimate catalog vocabulary.

The command palette still exposes **Open Portrayal Lab** as a development/prototype action. Review that exposure before a future cleanup pass. Package version is `1.1.0`.

## Release-readiness status

For package version `1.1.0`, focused relational-view/model/XML persistence tests and the production Vite build are revalidated for the restored Map/relationship work. `npm run test:css` remains a known legacy contract failure because its frozen-header expectation for `src/styles.css` no longer matches the live stylesheet. The build still emits non-failing EmbedPDF `crypto` externalization and large-chunk warnings. See `release-readiness.md` for the exact current revalidation record.

Current beta criteria and hardening priorities are maintained in `release-readiness.md` and `roadmap.md`. For meaningful implementation changes, run appropriate focused coverage plus `npm run check` / `test.ps1`; documentation-only changes should at minimum validate paths, commands, authority links, and the repository documentation/research handoff contract.

## Normative order

When documents conflict, prefer: newer accepted ADRs; this snapshot; `release-readiness.md`; root `CURRENT_STATE.md` and `DECISION_LOG.md`; frozen Outline/Map/annotation ontology documents; current implementation-specific docs; then historical alpha/research/acceptance material.
