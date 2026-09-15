# Catalyst release readiness

Status: **current late-alpha → beta convergence contract — 2026-09-15**

## Position

Catalyst is late alpha. Beta is a convergence phase, not another feature cycle.

The supported product path is:

```text
Reader / source work
    -> thoughts and notes
    -> Outline-authored structure
    -> generated Map portrayal
    -> independent Methods / Techniques
    -> briefing/report work outside Catalyst
```

Retired product surfaces are governed by ADR 0027 and must not be restored by historical tests, names, or documentation.

## Proven validation baseline

An earlier same-day `test.ps1 -Full` baseline completed successfully on 2026-09-15 across the repository test chain, production Vite build, and full npm license audit. The current-tree revalidation status is recorded below; the build still reports non-failing browser `crypto` externalization and JavaScript chunk-size warnings.

This is a recorded baseline, not permission to skip validation after implementation changes.
## Beta entry gate

A beta candidate may be cut when all of the following are true:

- the mounted UI exposes only intended current product surfaces;
- Catalyst XML automatic persistence and explicit `.catalyst.xml` Save/Load round-trip without silent loss;
- source PDFs remain separate and saved source references reconnect only to matching content-addressed files;
- viewer markup and Catalyst-managed source annotations reload predictably without mutating the original PDF;
- Outline hierarchy and sibling order survive save/reload and remain the only structural authoring authority;
- generated Map structure agrees with the Outline and does not acquire independent structural truth;
- Methods / Techniques preserve run order, editable Name/Subtask/Analysis work, and custom blank insertion;
- destructive actions and crash-recovery behavior are predictable;
- no known crash, corruption, inaccessible-workspace failure, or core-workflow blocker remains open;
- current documentation, tests, and maintenance scripts describe the runtime that is actually mounted;
- major CSS, typography, iconography, spacing, focus, disabled, and error-state inconsistencies are reduced enough that Catalyst reads as one application.

Beta entry does not require restoring Assessments, the Evidence tab, thought-link authoring, global undo/redo, free-spatial Map editing, or Tauri/SQLite.

## Current implementation cleanup debt

The following are known compatibility or naming debt, not missing product features:

- internal `graph` context naming and `WorkingPictureWorkspace` still back the user-facing Outline/Map surface;
- `noteLinks`, legacy graph/map state/actions, and note-keyed Map occurrences remain in the domain/persistence model;
- some tests and prototype files retain Evidence, graph, Working Picture, portrayal, or architecture-prototype names;
- the command palette still exposes **Open Portrayal Lab**, which should be reviewed before beta as a development/prototype surface;
- package version `0.6.3-alpha.3` predates the current simplification and should not be read as a precise product-surface description.

No Assessment product compatibility shim was found in the current source. The previously documented `isLegacyAssessmentRun` debt is already gone. Remaining lowercase “assessment” references are ordinary analytical/technique vocabulary and are not evidence of the retired Assessment product.

## Production-hardening requirements

Before production, Catalyst still needs stronger confidence in backup/restore and corruption handling, source-anchor/version behavior, accessibility, security/threat modeling, large-workspace performance, release provenance, and clean-environment delivery for whatever distribution model is ultimately supported.

Production does not require maximum feature breadth. The stopping condition is trustworthy persisted work, coherent supported workflows, predictable Save/Load and recovery, bounded noncritical defects, and documentation that a new user or maintainer can follow without reconstructing obsolete alpha architectures.

## Validation commands

From the repository root:

```powershell
npm run check
powershell -ExecutionPolicy Bypass -File .\test.ps1 -Full
```

For documentation-only work, at minimum validate referenced paths/commands and run the repository documentation/research-handoff check. Implementation changes should run the appropriate focused tests plus the combined gate.

## Current revalidation - 2026-09-15

The earlier same-day full green baseline remains useful history, but the **current working tree is not fully green**.

The current product no longer exposes derived-output export features. Annotated-PDF, Outline RTF/serialization, and Methods PDF/RTF export UI and implementation paths were removed together with their dedicated export tests and export-only glyph/CSS support. Explicit `.catalyst.xml` Save/Load remains the persistence boundary and is not treated as export.

A current `npm run build` completes successfully, and the iconography semantic contract passes after the export glyphs were removed.

The aggregate `npm test` currently stops on a reader-keyboard regression assertion expecting an older PDF.js UI-manager expression. An isolated visual-language run also exposes a separate stale expectation for a Methods trash control that is not present in the mounted Methods list. These assertions should be reconciled with the current UI behavior; neither failure is an export implementation dependency.

Until those stale regression contracts are resolved and the combined gate is rerun, do not describe the current tree as fully green.
