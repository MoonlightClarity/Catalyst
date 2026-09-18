# Catalyst current state

Status: **current workspace summary — 2026-09-17**

For implementation authority, read `docs/CURRENT_ARCHITECTURE.md` first. Older alpha/Working Picture/Tauri material is historical unless reaffirmed by a newer ADR or current contract.

## Product state

Catalyst is a local-first analytical workspace. Version 1.1.0 is the current source line; 1.0.3 is the previous published release. The supported product boundary remains narrower than the 0.6.x experiments while restoring a focused relational Map:

- **Reader** — local PDF reading, navigation, source selection, and EmbedPDF-native annotation/markup.
- **Outline** — authoritative structural authoring with inline notes.
- **Export** — complete Outline + Methods handoff as PDF, DOCX, or RTF.
- **Methods / Techniques** — independent ordered structured-analysis work.
- **Relationships / Map** — explicit typed relationships within and across Outline and Methods, portrayed in a read-only Map.
- **Sessions/files** — canonical Catalyst XML workspace state with source PDFs kept separate.

Formal Assessment, the standalone Evidence workspace, Catalyst-wide undo/redo, thought-link authoring, graph-first/free-spatial structural editing, and the legacy Techniques UI remain outside the current product surface. The restored Map is a read-only portrayal, not a second structural editor.

## Runtime and persistence

The mounted application is React/TypeScript/Vite. `XmlWorkspaceRepository` automatically persists canonical XML workspace state in browser local storage. Explicit **Save** writes a portable `.catalyst.xml` file; **Load** imports one and clears stale recovery-journal state before reload.

Source PDFs are not embedded in the workspace XML. Browser-cached PDF bytes and saved source references use SHA-256 content identity so reconnection cannot silently bind a content-addressed record to different bytes.

The former Tauri/SQLite shell is archived under `legacy/tauri-shell` and is not part of the active launch, persistence, build, or license gate.
## Reader and annotation state

The Reader header separates **New**, **Load**, **Save**, **Export**, and **Open**. New unloads the current session without deleting saved session files or original PDFs. Export produces the complete authored Outline + Methods analysis as PDF, DOCX, or RTF; Save/Load remain workspace persistence operations.

Viewer back/forward history is ephemeral session navigation. The Reader separately keeps a per-document last-page resume preference in browser local storage. EmbedPDF-native annotations are the only visual PDF markup layer; Catalyst persists those viewer annotations with the workspace without maintaining a second annotation UI.

## Outline, Methods, relationships, and Map state

The analysis shell defaults to Outline. Outline owns parent/child hierarchy and sibling order and supports structural keyboard editing. Outline and Methods can each author multiple typed relationships, including cross-surface relationships. The Map is active again as a read-only relational portrayal: hierarchy supplies stable addresses/order, while explicit relationships supply the visible connections.

The user-facing tab is currently labeled **Methods** while the implementation and working surface use Techniques terminology. Technique runs form an ordered sequence; selecting one opens focused Name/Subtask/Analysis editing. The picker supports catalog techniques and genuinely blank/custom insertion. Authored Method names, step names, and analyst responses participate in the unified whole-analysis export; catalog summaries and instructional prompts do not.

## Known convergence debt

Historical implementation names/state remain, including the internal `graph` context key and older Working Picture / Map reducer state. The active 1.1 Map is the relational view over current Outline/Methods entities and relationships; older free-spatial Map machinery remains cleanup debt where current behavior no longer depends on it.

The previously documented `isLegacyAssessmentRun` compatibility shim is no longer present. Current source contains “assessment” only as legitimate analytical/technique vocabulary, not as a formal Assessment product surface.

The command palette still exposes Portrayal Lab as a development/prototype action and should be reviewed in a future cleanup pass. The package version is `1.1.0`.

## Validation state

For package version `1.1.0`, focused relational-view/model/XML persistence tests and the production Vite build are revalidated for the restored Map/relationship work. `npm run test:css` remains a known legacy contract failure because its frozen-header expectation for `src/styles.css` no longer matches the live stylesheet. The production build still reports non-failing EmbedPDF `crypto` externalization and large-chunk warnings.

The research/source-handoff contract, Markdown relative-link audit, visual-language test, viewer-markup persistence test, and npm license audit pass in the current tree. See `docs/release-readiness.md` for the exact revalidation record.
