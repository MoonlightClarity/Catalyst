# ADR 0014 — Quiet interface is an architectural constraint

Status: Accepted for 0.6.2 alpha

## Context

Catalyst can accumulate substantial analytical capability. If every capability explains itself with persistent prose, the interface competes with the analyst's working memory and the product becomes a manual wrapped around a graph. That conflicts with the existing principle of deep capability, quiet interface.

## Decision

Catalyst will distinguish **analytical content** from **interface explanation**. Analytical content—source excerpts, method prompts, judgments, assumptions, relationship labels, provenance, and user-authored text—may be dense because it is the work itself. Interface chrome should be terse.

Persistent UI should prefer:

- spatial grouping and hierarchy over explanatory paragraphs;
- direct manipulation over instructions about manipulation;
- short labels, counts, state, and icons over repeated descriptions;
- progressive disclosure over always-visible guidance;
- tooltips, accessible names, and documentation for secondary explanation;
- empty states with one idea and one next action.

A capability that requires persistent tutorial text to be understandable should first be reconsidered as an interaction-design problem. Removing text must not remove semantic clarity or accessibility.

Brand identity is deliberately **not** decided by this ADR. The current Catalyst name and signal mark remain provisional presentation. A dedicated identity pass follows this cognitive-load milestone so branding is designed around the settled interaction language rather than used to disguise unresolved UI structure.

## Consequences

- New features carry a cognitive-load budget as well as a functional requirement.
- Capability profiles control both functionality and visible complexity.
- Documentation can become more complete while the operational interface becomes quieter.
- Formal analytical methods remain allowed to contain substantial text because their prompts are substantive methodology, not decorative instruction.
- Branding can now be approached as a coherent visual/interaction system rather than a logo swap.
