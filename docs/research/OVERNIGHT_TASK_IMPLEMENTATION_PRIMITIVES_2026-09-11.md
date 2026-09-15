# Overnight bounded task — implementation primitives research

Status: research/docs only. Do not implement Catalyst or select a production stack.

## Purpose
Identify current FOSS primitives that could support the disposable Working Picture prototype without collapsing the architecture contract.

## Scope
Evaluate implementation references for:
- local-first durable identity plus occurrence/placement records;
- spatial canvas with stable authored geometry and bounded contexts/subpictures;
- tree/outline projections over explicit structural membership;
- connector portrayal separated from semantic relation state;
- PDF/document region anchoring and exact/degraded source return;
- focus/hoist/back navigation with restorable context;
- transclusion/reuse without identity duplication;
- undo/provenance and mutation tracing suitable for prototype observability;
- accessible, low-chrome desktop/web UI primitives.

## Constraints
Prefer FOSS/open standards and small composable dependencies. Avoid proprietary services and AI connectors. Do not recommend a library merely because it renders graphs/canvases; test whether it preserves Catalyst's state-species separation.

## Deliverable
Write `OVERNIGHT_IMPLEMENTATION_PRIMITIVES_2026-09-11.md` with a compact candidate matrix, strongest references, architectural risks, and a smallest-feasible disposable-prototype stack. Mark uncertain claims and include primary-source links.

Stop when the prototype feasibility question is answered; do not expand into a general tooling catalog.
