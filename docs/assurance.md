# Catalyst assurance baseline

Status: **current assurance contract - 2026-09-15**

## Meaning of "intelligence-grade"

Catalyst uses "intelligence-grade" to describe analytical rigor, traceability, provenance discipline, deterministic behavior, recoverability, and documentation quality.

It does **not** claim authorization, accreditation, certification, or approval for classified information or regulated government environments.

## Current validation gate

A current-tree handoff is considered testable only when:

1. the TypeScript/domain contracts compile;
2. the repository regression suites pass;
3. materially new behavior has focused regression coverage where practical;
4. Catalyst XML persistence/load/recovery behavior passes its current tests;
5. the production Vite build completes;
6. the dependency-license audit passes;
7. required documentation/research handoff files exist and resolve;
8. current architecture and release-readiness documentation match the mounted runtime.

`npm run check` is the canonical combined web/XML gate. `test.ps1` invokes that gate through the portable project harness. An earlier full run completed successfully on 2026-09-15, but the current working tree is not fully green: stale legacy regression assertions found during this cleanup were corrected, and the combined gate now stops on an incomplete `AnalysisOutlineView.tsx` TypeScript refactor. `release-readiness.md` records the exact current blocker and the focused checks that still pass.
## Current assurance scope

The active assurance surface covers the Reader/source boundary, source annotation/markup persistence, Outline structural integrity, generated-Map projection, Techniques state, Catalyst XML workspace behavior, recovery/error handling, build integrity, licensing, and documentation coherence.

Historical tests with names such as Evidence, graph, Working Picture, portrayal, or architecture-prototype may remain when they still protect valid compatibility/domain behavior. Their names do not make retired UI surfaces current product requirements.

The previously documented Assessment-specific compatibility shim is no longer present in the current source. Ordinary Assessment-named techniques remain valid analytical vocabulary and are not a retired product surface.

## Known deferrals

The following are not yet assurance-complete and must not be represented as finished:

- stronger source-anchor resilience/version lineage beyond current document identity;
- analytic audit/provenance event logging where required by the eventual 1.0 contract;
- methodology/version documentation for the built-in technique catalog;
- accessibility coverage for structural and analytical relationships;
- formal threat modeling for the active web/XML runtime and local data boundaries;
- reproducible/release provenance beyond current build and dependency checks;
- clean-environment packaging/launch validation if Catalyst ships as an installable packaged application.

The retired Tauri/SQLite shell is historical and is not part of the active assurance gate.
## Release discipline

Documentation must be updated in the same change that alters a documented invariant. Architecture changes that intentionally supersede prior behavior require a newer ADR or explicit supersession note rather than silent reinterpretation of historical decisions.

Research artifacts are source artifacts, but dated research is not automatically current authority. `CURRENT_ARCHITECTURE.md`, newer ADRs, root `CURRENT_STATE.md` / `DECISION_LOG.md`, and the current release-readiness gate govern when older research conflicts.

Interface assurance should check that added analytical rigor does not require proportionally more persistent explanatory chrome. Accessibility names/tooltips may carry secondary explanation; substantive analytical content and destructive state must remain clear without relying on hidden help.

## Failure interpretation

A failing compatibility test is evidence to inspect, not proof that the historical feature named by that test remains product scope. Distinguish a valid persistence/domain invariant from an obsolete UI/product assumption before deciding whether to fix, revise, rename, or retire the test.
