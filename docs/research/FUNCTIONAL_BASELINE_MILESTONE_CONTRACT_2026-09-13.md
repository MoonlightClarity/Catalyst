# Catalyst Functional Baseline milestone contract — 2026-09-13

Status: **historical 2026-09-13 milestone contract; superseded as the active gate by `BETA_PRODUCTION_READINESS_GATE_2026-09-14.md`, `../CURRENT_ARCHITECTURE.md`, and newer decisions.** Preserve the criteria below as planning history; do not restore retired navigation, Evidence UI, Tauri/SQLite uncertainty, or map-first interaction from this document.

## Purpose

The Functional Baseline is the first Catalyst checkpoint where the ordinary analyst workflow is coherent enough that deeper analytical capability can safely resume.

It is intentionally narrower than the long-term roadmap. The milestone proves interaction integrity, source continuity, structural usability, and recovery—not maximum feature breadth.

## Required user workflow

A user must be able to complete this loop without developer knowledge:

`open source -> read -> select/capture -> save evidence or create thought -> place/structure -> inspect/focus -> reopen exact source -> return -> continue`

The interface may expose advanced features progressively, but none may be required merely to complete this loop.

## Must-have product behavior

- readable source-first Reader at ordinary desktop scale;
- obvious capture actions with automatic source attachment where applicable;
- exact source return for supported anchors;
- simple child/sibling/free placement and deterministic structural organization;
- placement edits that do not silently change hierarchy or semantic relationships;
- structural hierarchy distinct from semantic analytical relationships;
- Inspect distinct from Focus and Open;
- reliable Home/Back navigation;
- inspector/detail interaction that preserves analytical geography;
- persistence/reload that preserves accepted notes, evidence, structure, placement, and source links.

## Required engineering evidence

The accepted checkpoint must include:

- focused Analysis/map tests passing;
- current visual-language contract reconciled and passing;
- Reader annotation/selection/return tests passing;
- persistence/recovery tests passing;
- production TypeScript/Vite build passing;
- full default test suite passing or any deliberately excluded test documented with a current reason;
- dependency/license validation passing;
- one runtime acceptance record for the end-to-end loop at normal Windows scale.

A local handoff saying a slice passed is not sufficient if the combined source tree later changed.

## Explicitly out of scope for this gate

The baseline does **not** require:
- complete structured-analytic-technique breadth;
- final Portrayal Lab candidate selection;
- final XML-versus-SQLite persistence decision;
- replacement of Tauri;
- projection views such as timeline/ACH/matrix;
- Watch/Scan, advanced warning, assessments, or inference substrate completion;
- server collaboration, AI integration, or connectors;
- maximum branding/SVG polish.

These may continue in isolated tracks, but they cannot redefine the baseline acceptance criteria without a documented roadmap change.

## Reject the milestone if

- Reader and Analysis still feel like unrelated applications;
- the user must understand Catalyst's ontology before beginning useful work;
- ordinary selection or inspection causes disruptive layout movement;
- exact source return is unreliable for supported anchors;
- moving an occurrence changes semantic meaning implicitly;
- structural commands are ambiguous or require diagram-editor micromanagement;
- normal operation depends on repeated manual pan/zoom repair;
- the build/test state is only green in isolated chat slices rather than the combined tree;
- CSS overrides are masking unresolved component/interaction structure;
- a known data-loss/recovery defect is deferred merely to preserve velocity.

## Exit consequence

Passing this contract changes the project posture.

Before the Functional Baseline: default toward consolidation, simplification, and regression repair.

After the Functional Baseline: resume controlled feature growth using the roadmap sequence—mature Freeplane/Thorium behavior, portrayal consolidation, persistence/runtime decision, richer analytical semantics, projection views, then hardening.

The milestone should be recorded as an accepted checkpoint with the exact source state, validation results, runtime evidence, and known limitations. A version number can be assigned afterward; the behavior gate is more important than naming it prematurely.
