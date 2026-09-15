# Catalyst Beta-to-Production Readiness Gate — 2026-09-14

Status: **dated supporting gate — superseded for current execution by `../release-readiness.md`**, amended 2026-09-15 to preserve the late-alpha rationale.

## Position

Catalyst is in late alpha. Beta is a convergence phase, not another feature cycle. The remaining work should primarily reduce contradiction, dead code, visual inconsistency, persistence risk, and documentation drift.

The current core product path is **Reader/source work → Outline-authored structure → generated Map portrayal → Techniques**. Formal Assessments, the standalone Evidence workspace, global application undo/redo, thought-linking as a primary workflow, the legacy graph-first Map editor, and the legacy Techniques screen are not beta-entry requirements and must not be restored by stale documentation.

`../CURRENT_ARCHITECTURE.md`, `../release-readiness.md`, and newer ADRs govern when older alpha/research documents disagree with this dated gate.

## Beta entry condition

Enter beta when the late-alpha simplification has converged enough that:

- the active UI exposes only intended current product surfaces, with retired/legacy surfaces removed or clearly unreachable;
- Reader annotation behavior respects the PDF-local/source-annotation boundary;
- Outline remains the structural authoring owner and Map remains a deterministic generated portrayal rather than a second structural editor;
- Techniques behave as their own ordered analytical workflow, without restoring legacy Outline/thought coupling;
- Catalyst XML save/load behavior is coherent with the active runtime and source PDFs remain separate files;
- major CSS/toolbar inconsistencies are reduced enough that Catalyst reads as one application;
- current documentation and validation scripts describe the same architecture the repository actually runs.
- formal Assessment product code remains absent; ordinary technique names containing the word "Assessment" are analytical vocabulary, not evidence of the retired product surface.

Beta entry does **not** require reintroducing removed features or completing speculative post-1.0 architecture.
## Production-blocking requirements

Before a production release, Catalyst must demonstrate:

1. **Workspace persistence integrity.** Supported Catalyst XML state survives save, close, restart, and reopen without silent loss or semantic drift.
2. **Source integrity.** PDF/source identity and annotations reopen predictably, ordinary viewer markup remains PDF-local, and Catalyst-managed analytical annotation does not silently mutate source meaning.
3. **Structural integrity.** Outline-authored hierarchy/order round-trips correctly and generated Map portrayal does not acquire independent structural truth.
4. **Technique integrity.** Built-in and supported custom technique state can be created, reopened, and used through the current Techniques interaction model without depending on retired screens.
5. **Import/export reliability.** Supported interchange/export paths work predictably; malformed input fails safely and users are not trapped in Catalyst.
6. **Destructive-action predictability.** Destructive operations are explicit and safe. Native text-editor undo may remain; a Catalyst-wide history stack is not a production requirement.
7. **Interface coherence.** Typography, contrast, iconography, spacing, selected/disabled/error states, and major toolbars are coherent enough that the application no longer feels like multiple UI generations stitched together.
8. **No known critical failures.** No known crash, corruption, inaccessible-workspace failure, or core-workflow blocker remains open.
9. **Environment independence.** The supported runtime can be started and exercised without accidental hard-coded paths or hidden dependencies on a developer's machine state.
10. **Documentation coherence.** A new reader can identify the current architecture, supported workflow, file/session behavior, recovery/export expectations, and historical/superseded material without reconstructing months of design history.

Historical tests or domain types may remain for compatibility, but their existence does not make a retired UI surface part of the release contract.

## Beta hardening priorities

During beta, prefer save/reopen and import/export round trips; recovery/error-state checks; dead-code and stale-selector cleanup; realistic large-project/PDF checks; keyboard/focus validation; CSS and iconography normalization; license/build validation; and documentation cleanup.

New capability work should normally wait unless its absence blocks the current core workflow or corrects a contradiction in an already-frozen contract.
## Validation expectation

For meaningful implementation changes, run the repository's current `npm run check` gate and the appropriate PowerShell validation path where practical. Documentation-only changes should at minimum verify referenced files/commands and should not claim a clean release gate unless the full command actually completes successfully.

Historical proven baseline: `test.ps1 -Full` completed successfully earlier on 2026-09-15 with exit code 0 across tests, production build, and a full npm license audit. The current tree has since diverged and the aggregate gate is red on stale legacy test expectations; `../release-readiness.md` records the current failures. Production build/license checks still pass independently, with the known EmbedPDF browser `crypto` externalization and JavaScript chunk-size warnings.

The current test suite contains compatibility/history-oriented names such as Evidence, graph, portrayal, and architecture-prototype tests. Audit those tests by behavior before deleting or renaming them: a historical name may still protect valid persistence or domain compatibility, while a test that enforces a retired UI/product assumption should be revised or retired deliberately.

## Production stop rule

Production does not require maximum feature breadth. When persisted work is trustworthy and recoverable, the supported workflow is coherent, current documentation matches runtime behavior, supported import/export is reliable, and repeated validation reveals only bounded noncritical defects, stop polishing and release.

The governing question is:

> Can Catalyst be trusted with real analytical work, can that work be reopened and exported, and can a new user understand the active model without encountering contradictory legacy architecture?
