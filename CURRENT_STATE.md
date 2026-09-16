# Catalyst current state

Status: **current workspace summary — 2026-09-16**

For implementation authority, read `docs/CURRENT_ARCHITECTURE.md` first. Older alpha/Working Picture/Tauri material is historical unless reaffirmed by a newer ADR or current contract.

## Product state

Catalyst is a local-first analytical workspace with a public 1.0.1 release. The supported product boundary is deliberately narrower than the 0.6.x experiments:

- **Reader** — local PDF reading, navigation, source selection, and annotation/markup.
- **Outline** — authoritative structural authoring for thoughts/notes.
- **Generated Map** — portrayal of Outline-authored structure, not a second structural editor.
- **Methods / Techniques** — independent ordered structured-analysis work.
- **Sessions/files** — canonical Catalyst XML workspace state with source PDFs kept separate.

Formal Assessment, the standalone Evidence workspace, Catalyst-wide undo/redo, thought-link authoring, graph-first/free-spatial structural editing, and the legacy Techniques UI are outside the current product surface under ADR 0027.

## Runtime and persistence

The mounted application is React/TypeScript/Vite. `XmlWorkspaceRepository` automatically persists canonical XML workspace state in browser local storage. Explicit **Save** writes a portable `.catalyst.xml` file; **Load** imports one and clears stale recovery-journal state before reload.

Source PDFs are not embedded in the workspace XML. Browser-cached PDF bytes and saved source references use SHA-256 content identity so reconnection cannot silently bind a content-addressed record to different bytes.

The former Tauri/SQLite shell is archived under `legacy/tauri-shell` and is not part of the active launch, persistence, build, or license gate.
## Reader and annotation state

The Reader header separates **New**, **Load**, **Save**, and **Open**. New unloads the current session without deleting saved session files or original PDFs. Catalyst currently exposes no derived-output export feature; Save/Load are workspace persistence operations.

Viewer back/forward history is ephemeral session navigation. The Reader separately keeps a per-document last-page resume preference in browser local storage. Ordinary viewer markups and Catalyst-managed source annotations remain distinct persistence concepts even when both can appear on the same PDF surface.

## Outline, Map, and Methods state

The analysis shell defaults to Outline. Outline owns parent/child hierarchy and sibling order and supports structural keyboard editing. Map View is a generated portrayal rather than an output/export surface; structural editing remains in Outline.

The user-facing tab is currently labeled **Methods** while the implementation and working surface use Techniques terminology. Technique runs form an ordered sequence; selecting one opens focused Name/Subtask/Analysis editing. The picker supports catalog techniques and genuinely blank/custom insertion. Technique work is persisted in the Catalyst workspace and is not exported to a derived document format.

## Known convergence debt

Historical implementation names/state remain, including the internal `graph` context key, `WorkingPictureWorkspace`, `noteLinks`, legacy graph/map reducer state, note-keyed Map occurrences, and historically named tests/prototypes. These are cleanup targets only where current behavior no longer depends on them.

The previously documented `isLegacyAssessmentRun` compatibility shim is no longer present. Current source contains “assessment” only as legitimate analytical/technique vocabulary, not as a formal Assessment product surface.

The command palette still exposes Portrayal Lab as a development/prototype action and should be reviewed in a future cleanup pass. The package version is `1.0.1`.

## Validation state

The current aggregate `npm run check:full` passed on 2026-09-16 against package version `1.0.1`. Package/lockfile consistency, the full npm test chain, production Vite build, and npm license audit all completed successfully. The production build still reports a non-failing large-chunk warning.

The research/source-handoff contract, Markdown relative-link audit, visual-language test, viewer-markup persistence test, and npm license audit pass in the current tree. See `docs/release-readiness.md` for the exact revalidation record.
