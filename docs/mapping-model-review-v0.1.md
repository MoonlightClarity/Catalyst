# Catalyst Mapping Model v0.1 — consistency review

Status: design gate before 0.6.3-alpha.2 implementation.

## Compatibility with prior frozen decisions

- [x] Local-first/no-network requirement unchanged.
- [x] Graph-like relationship substrate retained.
- [x] First-class semantic `Relationship` identity retained.
- [x] Spatial coordinates remain view state, not analytical truth.
- [x] Progressive capability model unchanged.
- [x] Evidence tagging remains non-destructive organizational metadata.
- [x] Reader/source boundary retained.
- [x] No new proprietary/AI dependency introduced.
- [x] No SQLite migration required merely to prototype Maps.

## Corrections to earlier design assumptions

- [x] One global node-link canvas is no longer treated as the permanent primary UI.
- [x] Semantic zoom is retained but no longer expected to solve project-scale complexity alone.
- [x] `Graph` is implementation/domain vocabulary, not necessarily primary user-facing navigation.
- [x] Structural branching is separated from semantic relationship authoring.
- [x] One object can appear in multiple Map occurrences.
- [x] Linked human-scale Maps become the preferred complexity decomposition.
- [x] Coordinate/grid styling is rejected as Catalyst's default analytical metaphor.
- [x] The app/taskbar icon is now an explicit alpha.2 acceptance item rather than deferred polish.

## Intelligence alignment

- [x] Map may begin from a problem/question/information need.
- [x] Source information remains distinct from analyst interpretation.
- [x] Alternatives/assumptions/gaps can become native map territories without being mandatory template boxes.
- [x] Early exploratory structure can precede formal semantic assertions.
- [x] Multiple analytical geometries remain legitimate.
- [x] High-level maps are purposeful generalizations, not simply zoomed-out detail.
- [x] Evidence remains traceable into the analytical space.
- [x] Future Probe/Watch/Scan semantics remain reserved without being faked in 0.6.3.

## Visual-language alignment

- [x] Instrument, Portrayal, Notation, Content separation remains valid.
- [x] Selection remains distinct from significance.
- [x] Position/proximity do not imply meaning absent an explicit projection.
- [x] Structural branch vs semantic cross-link receives separate notation channels.
- [x] Collapse/generalization/filter/off-map states remain distinguishable.
- [x] Semantic zoom remains portrayal, not data mutation.
- [x] Custom Catalyst glyphs/mark derive from native analytical/mapping operations.

## Implementation boundary

Alpha.2 is allowed to add compatibility Map view state and renderer behavior. It is not allowed to:

- reinterpret existing semantic relationships as hierarchy without explicit reversible migration;
- introduce permanent 0.7 ontology merely for visuals;
- invent confidence/provenance/weak-signal meanings the current model cannot support;
- make a third-party graph library authoritative;
- delete legacy graph-view state before rollback/compatibility has been proven.

## Gate decision

**PASS for alpha.2 implementation.**

The Mapping Model resolves the main contradiction exposed by alpha.1: Catalyst can remain graph-structured internally while giving analysts a human-scale, intelligence-derived mapping environment externally. Remaining questions are implementation/prototype questions rather than unresolved product architecture.
