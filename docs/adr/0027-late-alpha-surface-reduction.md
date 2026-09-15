# ADR 0027 — Freeze the late-alpha product surface for beta convergence

Status: Accepted — 2026-09-15

## Context

Catalyst accumulated several experimental product models during the 0.6.x alpha cycle: graph-first authoring, a Working Picture primary surface, a standalone Evidence workspace, formal Assessment workflows, thought-link authoring, global application undo/redo, and a Tauri/SQLite desktop runtime.

By late alpha, those experiments were increasing implementation and documentation contradiction faster than they were improving the core workflow. The mounted application had already converged on a smaller set of surfaces.

## Decision

The beta-convergence product surface is:

1. **Reader** for local PDF reading, source navigation, and PDF-local/source annotation work.
2. **Outline** as the authoritative structural authoring surface for thoughts/notes.
3. **Generated Map** as a deterministic portrayal of Outline-authored structure, not a second structural editor.
4. **Methods / Techniques** as an independent ordered analytical workflow.
5. **Catalyst XML** as the canonical workspace persistence/interchange format, with source PDFs remaining separate files.

Formal reports, briefings, and assessments remain downstream products rather than Catalyst planning surfaces.
## Retired product surfaces

The following are not beta requirements and must not be restored merely because compatibility names or historical documents remain:

- the standalone Evidence workspace/tab;
- formal Assessment product/domain workflows;
- Catalyst-wide undo/redo history (native editor-local undo may remain);
- thought/note linking as a primary authoring workflow;
- graph-first or free-spatial Map structural editing;
- the legacy Techniques screen and thought-owned technique metadata;
- Tauri/SQLite as the active runtime/persistence authority.

Compatibility fields such as `noteLinks`, `graphView`, old Map state, or historical component/test names may remain temporarily when current behavior still depends on them. Their presence is implementation debt, not product ownership.

Technique names and prompts may legitimately use ordinary words such as “assessment” or “evidence.” Product-surface removal must not erase valid analytical vocabulary.

## Consequences

Beta work prioritizes convergence, persistence integrity, recovery/export reliability, interface consistency, accessibility, dead-code cleanup, and documentation agreement over new feature breadth.

Current implementation truth is recorded in `../CURRENT_ARCHITECTURE.md`; current release gates are recorded in `../release-readiness.md`. Older ADRs remain useful decision history but are superseded where they conflict with this decision or newer ADRs.
