# Catalyst release readiness

Status: **published 1.0 baseline and current maintenance contract — 2026-09-17**

## Position

Catalyst 1.0 is a deliberately narrow local analytical workspace. Current maintenance should favor coherence, persistence reliability, and usability over restoring retired alpha-era surfaces.

The supported product path is:

```text
Reader / source work
    -> Outline-authored structure and notes
    -> optional ordered Methods
    -> Export as PDF / DOCX / RTF
    -> downstream briefing/report work
```

The mounted UI exposes Reader, Outline, Methods, and whole-analysis document export. Map, Evidence, Assessments, Thoughts as a separate product concept, and global undo/redo are not current product surfaces and should not be inferred from historical documentation or legacy code names.

## Current 1.0 acceptance contract

The current product should preserve all of the following:

- local PDF opening and reconnection without modifying the original document;
- explicit `.catalyst.xml` Save/Load as the portable session boundary;
- automatic local workspace persistence that does not replace deliberate named saves;
- source identity checks that prevent silently reconnecting a saved workspace to the wrong PDF;
- Outline hierarchy, numbering, sibling order, inline notes, and focused keyboard operations across save/reload;
- optional Methods with ordered/hierarchical runs, editable method names and subtasks, catalog filtering, and blank custom insertion;
- EmbedPDF-native page navigation, zoom, search, fullscreen behavior, and annotation tools;
- predictable destructive actions and recovery behavior;
- documentation and maintenance scripts that describe the runtime actually mounted;
- a coherent visual system across reader chrome, Outline, and Methods.

The current code still contains historical internal names such as `graph` and some compatibility-domain structures. Those names are implementation debt only unless they produce mounted behavior that contradicts the current product.

## Release validation baseline

For package version `1.0.3`, package/lockfile consistency, the focused native-EmbedPDF annotation persistence test, project-export test, production Vite build, npm license audit, and desktop release-staging verification pass. `npm run test:css` is still red because `scripts/test-css-architecture.mjs` expects the legacy `styles.css` frozen-header contract, while the live stylesheet no longer satisfies that historical freeze assertion.

The XML repository tests intentionally exercise malformed canonical XML and log a rollback-path parse diagnostic before reporting the migration test as passed. That diagnostic is expected test coverage, not a release failure.

The production Vite build currently emits non-failing EmbedPDF `crypto` externalization and large-chunk warnings. Treat those as dependency/performance follow-ups rather than correctness failures.

The portable Windows staging path is additionally validated by:

```powershell
npm run release:verify
```

For a fresh portable build, use the repository packaging helper rather than building directly into the historical in-tree output folder:

```powershell
powershell -ExecutionPolicy Bypass -File .\scripts\package-portable-release.ps1
```

The helper packages through a temporary output directory to avoid the Windows directory-rename failure previously observed inside the project release folder.
## Maintenance priorities after 1.0

Near-term work should be evaluated against user-visible reliability rather than feature count. Appropriate follow-up areas include accessibility, large-workspace performance, backup/restore confidence, source-reconnection edge cases, packaging reproducibility, and reduction of stale historical terminology in current-facing files.

Do not restore a retired surface merely because tests, archived documents, or domain names still mention it. Preserve history in historical material; keep current authority documents aligned with the mounted product.

## Validation discipline

From the repository root:

```powershell
npm run check
powershell -ExecutionPolicy Bypass -File .\test.ps1 -Full
```

Documentation-only work should at minimum validate referenced paths and commands, run `node scripts/test-research-handoff.mjs`, and run `git diff --check` on edited files.

A green gate is point-in-time evidence. Revalidate after implementation changes instead of treating version `1.0.3` or a previous successful run as proof of the current tree.

## Release provenance

Published-release identity and asset digests are recorded separately in `docs/release-provenance-1.0.0.md`. Local rebuilds performed after publication can differ byte-for-byte from the published executable; the provenance record, not a later local checksum, is the authority for the published asset.
