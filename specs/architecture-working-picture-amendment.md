> **Historical mirror:** This file is preserved for design provenance. Current authority is under `docs/`; see `specs/README.md`.

# Architecture amendment: Working Picture design checkpoint

Status: **Design-only checkpoint; alpha.2 code remains the current runnable baseline**

This amendment records the architecture implications of the intelligence-focused UX research performed after 0.6.3-alpha.2 native review.

## Primary correction

The graph remains a computational substrate, and Map remains a first-class saved portrayal, but neither is the primary user-facing metaphor.

The top-level interaction model becomes:

```text
Issue
  └── Working Picture
        ├── heterogeneous visual observations
        ├── analytical notation
        ├── structural branches
        ├── latent semantic relationships
        ├── overlays/projections
        └── subordinate Maps
```

The Working Picture is recognition-first, source-aware, and text-on-demand.

## Architectural consequences for the next renderer

- Rendering must support heterogeneous occurrence species rather than one universal node/card component.
- Occurrence view state remains distinct from analytical object identity.
- Structural branches remain Map/Picture-local portrayal state; semantic relationships remain domain data.
- Source-region crops require a renderer boundary that can consume existing annotation/page geometry without inventing new provenance semantics.
- Semantic zoom must switch representations, not only CSS scale.
- Navigation history must preserve analytical places (Issue/Picture/focus/source location) rather than only viewport coordinates.
- Full body content remains in inspector/source surfaces.
- Semantic relationship rendering is demand-driven rather than globally persistent.
- The renderer must be replaceable and must not make a third-party canvas/graph library authoritative over domain or view data.

## Persistence boundary

0.6.3-alpha.3 should avoid irreversible schema migration unless a minimal new persisted view object is required to prove navigation/portrayal. Where possible, use the existing alpha settings compatibility layer for new view-state experiments until the model survives native acceptance.

## Future-domain restraint

The next renderer may reserve visual grammar for provenance, inference, perspectives, warning, and weak-signal workflows, but must not render those semantics as if they already exist in the persistent domain.
