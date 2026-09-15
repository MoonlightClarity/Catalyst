# ADR 0015 — Catalyst uses an analytical portrayal language, not an icon theme

Status: Accepted as design foundation for 0.6.3

## Context

The running 0.6.2 interface proved functional but visually skeletal. Early redesign attempts that simply added dark styling, color, cards, glow, and custom-looking icons remained generic. Deeper research into intelligence cartography, link analysis, visual analytics, provenance, human factors, structured analytic techniques, and early-warning practice showed that the problem was not lack of decoration. Catalyst lacked a coherent mapping between analytical meaning and visual form.

A large pictogram library would also fail to represent the distinctions Catalyst increasingly needs: source versus interpretation, proposition versus world object, confidence versus probability, selection versus importance, repetition versus corroboration, current portrayal versus underlying analytical universe, and expected indicators versus unexpected weak signals.

## Decision

Catalyst will develop a **compositional analytical portrayal language** before expanding its icon library or finalizing brand assets.

The language is governed by `docs/visual-analytical-language-v0.1.md` and the following architectural constraints:

1. Application controls, portrayal state, analytical notation, and user/source content are separate visual layers.
2. Core analytical semantics must not depend on hue alone.
3. Selection/focus is visually distinct from analytical significance, confidence, likelihood, and centrality.
4. Graph position and node size do not imply analytical properties unless the active projection explicitly defines them.
5. Semantic zoom changes portrayal rather than merely scaling full-detail cards.
6. Evidence provenance receives a native indexed trace treatment rather than a generic attachment icon.
7. Tags remain analyst-created organizational layers and do not acquire automatic epistemic meaning.
8. Relationship and inference notation are first-class design concerns, not decoration between nodes.
9. Future identity work derives the Catalyst mark from the product's analytical grammar rather than imposing an unrelated logo motif.
10. Future capabilities such as provenance, inference junctions, assessments, Watch/Scan, weak signals, or early warning must not be visually faked before their domain semantics exist.

## Consequences

- 0.6.3 begins with visual primitives and shell refactoring rather than another broad feature expansion.
- Stock pictograms and generic rounded-card dashboard conventions are no longer the default design language.
- The current Reader + analytical workspace split remains structurally valid and will become a deliberate source/analysis boundary.
- The future graph renderer must support semantic zoom, explicit aggregates, stable selection treatment, contextual legends, and portrayal metadata.
- 0.7 domain design should revisit the current compatibility model so world objects, propositions, evidence/provenance, assessments, inference, perspectives, inquiry, and history can become distinct where warranted.
- Branding remains provisional until the notation primitives work at product scale, monochrome, and reduced size.

## Mapping-model amendment

ADR 0016 and `mapping-model-v0.1.md` refine the meaning of the analytical plane established here. The default user-facing surface is no longer specified as one persistent node-link graph/coordinate canvas. The graph remains the computational substrate, while human-scale **Maps** provide purposeful portrayals with structural branches, semantic cross-links, local structure grammars, submaps, and occurrence-owned view state.

Accordingly, any reference in this ADR to the "graph" as a primary visual field should be read as applying to the analytical Map/portrayal layer unless the text is specifically discussing the underlying graph data structure.
