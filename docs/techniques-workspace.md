# Techniques workspace

Status: **current implemented interaction contract - 2026-09-15**

This document describes the mounted Techniques surface. Catalog taxonomy is governed separately by `structured-analytic-techniques-catalog-freeze.md`.

## Ownership

Techniques are an independent Catalyst workspace. They are not owned by a thought, Note, Outline placement, Map node, or formal Assessment.

The landing surface is an **ordered list of techniques to perform**. Selecting a technique opens only that run in focused editing mode; returning closes the focused view and restores the ordered list.

Technique order is explicit user state. Move earlier/later changes sequence only and does not change analytical structure elsewhere in Catalyst.

## Add behavior

**Add technique** opens a picker that may search the built-in catalog and groups visible results by catalog cluster. Cluster/category information belongs in discovery; it is not repeated as metadata on the ordered working list.

The picker also supports a blank/custom technique. Its name is optional at creation time, so a genuinely blank technique can be inserted and defined during work.

## Focused technique editor

The current editor is intentionally minimal:

- **Name** - technique/run name;
- **Subtask** - editable step title;
- **Analysis** - the analyst's response/work for that subtask.

Subtasks can be added or removed. There is no required five-field template, field-count display, "long response" selector, diagnostic/contrarian label, or other persistent catalog metadata in the focused work surface.

The built-in definition supplies initial subtasks, but a run stores a definition snapshot so the working copy can be edited without rewriting the shared catalog.

## Output boundary

The Techniques workspace currently exposes no PDF, RTF, or other derived-document export. Technique work remains part of persisted Catalyst workspace state and is recovered through the normal Catalyst Save/Load workflow.

Report, briefing, and publication formatting remain downstream work outside Catalyst.

## Compatibility boundary

The previously documented `isLegacyAssessmentRun` compatibility shim is no longer present in `src/domain/workspace.ts`. Current Assessment-named catalog entries are ordinary technique names or analytical vocabulary; they do not restore a formal Assessment product surface.

Internal Technique definitions/runs and catalog taxonomy remain richer than the deliberately minimal working UI. That persisted/domain richness must not be used to restore the legacy Techniques screen or couple Techniques back to thoughts, Outline placements, or Map nodes.

## Validation

Current focused coverage includes:

- `scripts/test-technique-catalog.mjs` - catalog integrity and workflow resolution;
- domain/XML tests - TechniqueRun persistence and ordering behavior.

Technique catalog, domain Technique-run, and analytical-model focused coverage pass on the current tree. The stale `newCustomTechniqueDefinition` test contract has been removed; the aggregate gate now advances past Techniques and is blocked later by the incomplete `AnalysisOutlineView.tsx` refactor described in `release-readiness.md`.

Related authority: `CURRENT_ARCHITECTURE.md`, `structured-analytic-techniques-catalog-freeze.md`, ADR 0026, and the current beta-readiness gate.
