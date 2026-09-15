# Historical specification mirror

Status: **historical / non-normative**

The `specs/` tree preserves design checkpoints from the graph, Mapping Model, and Working Picture generations of Catalyst. It is retained for provenance and rejected-direction research; it is **not** a second current specification authority.

For current implementation work, use this order:

1. `../docs/CURRENT_ARCHITECTURE.md`;
2. newer ADRs under `../docs/adr/`;
3. frozen current ontologies under `../docs/`;
4. current implementation contracts such as `../docs/outline-authoring-system.md` and `../docs/techniques-workspace.md`;
5. `../docs/research/BETA_PRODUCTION_READINESS_GATE_2026-09-14.md` for release convergence.

Files in this directory may describe Tauri/SQLite, graph-first or map-first authoring, Working Picture as the primary surface, free-spatial/multi-map behavior, Evidence UI, old navigation controls, semantic zoom, or formal Assessment concepts. Those claims are historical unless explicitly reaffirmed by the current authority set.

Do not copy changes from `specs/` back into current code or documentation merely because an older file calls itself normative or frozen.
