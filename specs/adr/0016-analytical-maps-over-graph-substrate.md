> **Historical mirror:** This file is preserved for design provenance. Current authority is under `docs/`; see `specs/README.md`.

# ADR 0016 — Analytical Maps are the primary human interface over the graph substrate

## Status

Accepted as design foundation for 0.6.3-alpha.2.

This ADR **partially supersedes ADR 0009**. ADR 0009 remains correct that Catalyst's persistent analytical structure is graph-like and that relationships are first-class. It is superseded only where it made one persistent node-link Graph workspace the primary user-facing mental model.

## Context

0.6.3-alpha.1 applied the first analytical-portrayal rules to the existing graph-first workspace. Native runtime review showed that the result remained generic and cognitively mismatched: a Cartesian plotting plane with floating node cards still behaved like a graph/database editor rather than a thinking environment.

Targeted research into mind maps, concept maps, spatial hypertext, focused-network navigation, nested/multi-map systems, intelligence concept-mapping research, and structured analytic techniques showed several recurring findings:

- rapid thought capture benefits from focal branching and low-friction hierarchy;
- early sense-making often needs provisional organization before formal semantic relationships are known;
- concept maps add explicit, labeled cross-links once meaning becomes clearer;
- one global canvas becomes difficult to comprehend as analytical complexity grows;
- interlinked human-scale maps provide a better level-of-detail mechanism than infinite zoom alone;
- the same underlying object may legitimately appear in multiple maps/contexts;
- different intelligence questions require different analytical geometries, including association, chronology, matrix, hierarchy, free spatial grouping, and method-specific views;
- layout and line geometry can bias interpretation, so a generic force/coordinate layout is not analytically neutral.

The intelligence-specific research reinforced that a map should ordinarily be organized around a purpose/information need and should keep source information, interpretation, alternatives, assumptions, gaps, and expected observables distinguishable.

## Decision

Catalyst retains a graph-like **analytical model** as its computational substrate, but the primary human working surface becomes a **Map**.

A Map is a saved, purposeful, human-scale portrayal over the analytical model.

The following rules are architectural:

1. A Map contains occurrences of underlying analytical objects rather than copies.
2. One analytical object may have multiple occurrences across Maps.
3. Structural branches used for organization are distinct from first-class semantic relationships.
4. Structural branching may precede formal semantics; Catalyst must not infer analytical relationship meaning from hierarchy alone.
5. Semantic relationships persist independently of a Map and may be portrayed as cross-links.
6. Maps may be interlinked/nested to manage scale without fragmenting the underlying analytical model.
7. A future Map may contain local structure grammars rather than one global layout algorithm.
8. Free spatial organization remains legitimate Map state for emergent sense-making.
9. Inspecting an occurrence, refocusing a Map, and opening another Map are distinct operations.
10. Collapsed/generalized/off-map structure must not silently appear nonexistent when meaningful relationships continue beyond the visible boundary.
11. Semantic zoom remains a local portrayal mechanism but is not the sole complexity strategy.
12. The default analytical surface must not rely on Cartesian graph-paper styling or imply coordinate significance unless a projection actually uses coordinates meaningfully.
13. User-facing language should prefer `Analysis` and `Map` over exposing `Graph` as the primary product metaphor, while graph terminology may remain in implementation/domain internals where accurate.
14. The application mark and custom glyph family should be derived from native Map operations rather than generic network/office icons.

`docs/mapping-model-v0.1.md` is the normative design specification for this decision.

## Consequences

- `GraphWorkspace` is now considered a disposable compatibility renderer rather than the permanent primary interaction model.
- 0.6.3-alpha.2 should rewrite the renderer rather than cosmetically refine alpha.1's coordinate plane.
- Existing note/relationship/evidence data remain valid; the first Map implementation must project them without irreversible migration.
- Existing first-class relationships should not be reinterpreted as map hierarchy during migration.
- Map/occurrence/structural-branch view state can initially persist through the settings compatibility layer.
- The future renderer boundary should be designed around Catalyst-owned Map/Projection contracts rather than directly around a third-party graph engine.
- Accessibility requires a synchronized non-spatial representation of Map structure and semantic relationships.
- The final brand mark remains provisional until the mapping grammar establishes its characteristic geometry, but the placeholder Windows/taskbar icon is no longer acceptable in alpha.2.

## Explicit non-decisions

This ADR does not yet decide:

- the permanent post-0.6 object ontology;
- a database schema for Maps;
- the final branch-layout algorithm;
- final glyph shapes;
- full mixed-layout support;
- permanent inference/provenance/Assessment/weak-signal objects;
- AI-assisted mapping;
- collaboration architecture.

Those decisions must remain compatible with the Map/occurrence distinction established here.
