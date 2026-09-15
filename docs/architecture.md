# Catalyst architecture

Status: **historical architecture record — superseded for current implementation**

> This document preserves the architectural evolution of Catalyst through the graph-first, Working Picture, Tauri/SQLite, and early Map eras. It is **not** the current implementation contract. For active architecture, use [`CURRENT_ARCHITECTURE.md`](CURRENT_ARCHITECTURE.md), newer ADRs, and the frozen Outline/Map/annotation ontology documents. References below to a standalone Evidence workspace, Assessment workflow, global graph editing, persistent free-spatial structure, Working Picture as the primary surface, or Tauri/SQLite runtime describe superseded designs unless a newer current document explicitly reaffirms them.

## Product principle

Catalyst is a local analytical knowledge workspace. It is designed with the rigor expected in intelligence and investigative work, but its model is intentionally general enough for research, strategy, journalism, legal work, science, and other complex reasoning.

The product principle remains **deep capability, quiet interface**. Capability may be substantial internally, but the default surface should preserve attention and expose complexity only when the work requires it.

Catalyst's core is also deliberately local and non-proprietary: existing analytical work must remain usable without an account, network service, AI model, hosted graph, embedding index, or vendor-specific data model.

## Historical architecture below

The sections below are retained to explain earlier design decisions and compatibility state. They must not be used to infer current navigation, ownership, persistence, or release requirements. Current structural ownership is Outline-first: the Outline authors structure and the generated Map portrays it. Techniques are a separate analytical area. Formal Assessments and the standalone Evidence workspace are outside the current product surface.

## Current boundary pointer

Do not extend this file with new implementation requirements. Current runtime, persistence, Reader/annotation boundaries, Outline/Map ownership, Techniques ownership, removed surfaces, and release-readiness status are maintained in `CURRENT_ARCHITECTURE.md`.

Detailed historical reasoning remains available in `docs/adr/`, the frozen ontology documents, and the research archive. This file is intentionally reduced to a compatibility/history pointer so obsolete architecture cannot silently compete with the active contract.
