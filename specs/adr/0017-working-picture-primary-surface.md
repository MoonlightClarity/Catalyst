> **Historical mirror:** This file is preserved for design provenance. Current authority is under `docs/`; see `specs/README.md`.

# ADR 0017: Working Picture is the primary analyst-facing surface

Status: **Accepted for 0.6.3-alpha.3 design**

## Context

0.6.3-alpha.1 exposed a Cartesian Graph as the main analytical surface. Native review found the result generic, coordinate-driven, and visually too close to a graph/database editor.

0.6.3-alpha.2 introduced human-scale Maps, structural branches, and a custom mapping foundation. Native review again found the product too text-heavy and difficult to navigate. The renderer remained a diagram of labeled objects rather than a visual analytical environment.

Subsequent intelligence-specific research emphasized working pictures, composite intelligence graphics, selective portrayal, imagery/source callouts, event templates, source traceability, and the distinction between working analysis and briefing products.

## Decision

Catalyst will treat the **Working Picture** as the primary analyst-facing surface.

The graph remains the computational substrate.

Maps remain saved portrayals and may support subordinate human-scale decomposition.

The primary UX is organized around an analytical Issue and a Working Picture composed of heterogeneous visual material, analytical notation, branches, source observations, and local projections.

The Working Picture is recognition-first and text-on-demand.

## Consequences

- the current alpha.2 map renderer is a disposable prototype rather than the permanent renderer;
- generic text cards are no longer the default portrayal unit;
- evidence should retain visual source character where possible;
- source/observation and analyst-construction territories remain visibly distinguishable;
- semantic relationships become mostly latent in the base picture;
- navigation centers on Issue → Picture → Object → Source/Submap rather than pan/zoom coordinates;
- full text belongs primarily in inspection/source views;
- future Briefing Pictures will be separate derived portrayals rather than forcing the Working Picture to become presentation-ready.

## Non-decision

This ADR does not introduce new permanent domain semantics for inference, perspective, provenance families, weak signals, or warning. Those remain future domain milestones.
