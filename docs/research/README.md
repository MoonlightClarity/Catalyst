# Catalyst research handoff

**Status:** research archive and handoff index; current-authority pointer updated 2026-09-15.  
**Purpose:** Preserve accumulated research, rejected directions, implementation findings, and dated handoffs without allowing older planning artifacts to override the current product boundary.

## Start here

1. `../CURRENT_ARCHITECTURE.md` — current product/runtime boundary and removed surfaces.
2. `../release-readiness.md` — current late-alpha to beta hardening gate.
3. `../../CURRENT_STATE.md` and `../../DECISION_LOG.md` — current workspace state and durable decisions.
4. `BETA_PRODUCTION_READINESS_GATE_2026-09-14.md` — dated supporting gate retained for history.
5. `RESEARCH_SYNTHESIS.md`, `ENGINEERING_FINDINGS.md`, `PASS_LOG.md`, and `SOURCE_INDEX.md` — supporting research, engineering history, chronology, and sources.

`CURRENT_STATE.md`, `DECISION_LOG.md`, and `NEXT_STEPS.md` inside this research directory are preserved historical snapshots. They are not current authority when they differ from the root/current files listed above.

## Current status

Catalyst is in 1.0 maintenance/convergence. The current source/release target is `1.0.3`; older alpha research remains historical context.

The active product path is **Reader/source work -> Outline-authored structure + inline notes -> optional ordered Methods -> whole-analysis Export**. Catalyst XML is the active workspace persistence boundary. Map, formal Assessment, the standalone Evidence workspace, global application undo/redo, thought-linking as a primary workflow, the legacy graph-first editor, and the legacy Techniques screen are retired product surfaces under the current architecture contract.

## Supersession rule

Current authority flows from newer ADRs, `../CURRENT_ARCHITECTURE.md`, `../release-readiness.md`, the root `CURRENT_STATE.md` / `DECISION_LOG.md`, and the frozen Annotation/Outline/Map ontologies. Dated roadmaps, Working Picture, Portrayal, navigation, capability, prototype, and integration-board documents are historical guidance unless explicitly reaffirmed.

Historical files may describe Tauri/SQLite, free-spatial maps, Working Picture as the primary surface, standalone Evidence, Assessment, source-tag clustering, or earlier release gates. Preserve those records as evidence of project evolution; do not silently reinterpret them as current requirements. `CATALYST_0_7_ALPHA_ARCHITECTURE_CONTRACT_2026-09-14.md` and `LEGACY_ROADMAP_PRE_BETA_CONVERGENCE_2026-09-15.md` are historical for this reason.

## Archive use

Use dated handoff, integration, Functional Baseline, Freeplane/Thorium, Sploder, portrayal-lab, and alpha.3 artifacts to recover rationale, implementation lessons, rejected approaches, and test evidence. Their dates and original claims should remain intact unless a factual correction is necessary.

## Preservation rule going forward

After meaningful architecture or release-boundary changes, update the small current authority set first. Add a dated research handoff only when it preserves reasoning or evidence that would otherwise be lost. Prefer explicit supersession notes over rewriting historical research to look current.
