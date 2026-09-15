# Architecture synthesis — Working Picture state semantics — 2026-09-11

Status: architecture research only. No GUI manipulation and no product code changed.

## Purpose

The previous synthesis established six concerns: identity, occurrence/placement, structural membership, semantic relation, provenance, and focus-in-context. This pass makes that separation operational: what each state means, which actions may mutate it, and which side effects are forbidden.

## Core architectural claim

The Working Picture should not be one graph with richer node/edge styling. It should be a coordinated portrayal over several orthogonal state dimensions with different authority.

1. **Identity** answers what durable analytical/source object exists.
2. **Occurrence** answers where/how that identity is portrayed in one bounded context.
3. **Structure** answers what authored organizational composition exists.
4. **Semantic relation** answers what analytical/world assertion is being made.
5. **Provenance** answers where material came from and how it was transformed.
6. **Focus context** answers where the analyst is operating now and how to return.

These dimensions can be rendered together, but no user action should silently cross dimensions.

## Why this matters

Freeplane shows that visually free placement can still conceal hierarchy. Zotero shows that extracted material can remain reversibly anchored to an exact source location. Trilium shows one durable note identity with several branch occurrences. AFFiNE/BlockSuite and Excalidraw show geometry, grouping, frames, bindings, and document state as distinguishable mechanisms. Logseq shows reference, embed, and derivative as different reuse states.

The combined evidence rejects hidden semantic promotion and overloaded universal edges.
## Mutation discipline

The architecture should be tested by asking which record species an interaction is allowed to mutate.

| User action | Primary mutation | Forbidden silent mutation |
| --- | --- | --- |
| Place / move / resize | Occurrence | structure, semantics, provenance |
| Reuse in another picture | new Occurrence of same Identity | identity duplication, corroboration claim |
| Make pile / territory | Structure Membership | semantic relation |
| Make branch | Structure Membership + branch portrayal | causal/evidentiary/world relation |
| Draw provisional connector | connector portrayal | Semantic Relation |
| Assert `supports` / `contradicts` / etc. | Semantic Relation | occurrence relocation or reparenting |
| Extract source region | new/source-region Identity or occurrence + Provenance | provenance detachment |
| Summarize / interpret | new derived Identity + Provenance | overwrite source identity |
| Open / focus / enter | Focus Context | analytical truth or structure |
| Back / return | Focus Context | occurrence geometry or object history |

A compound command may intentionally mutate several dimensions, but the command must name that escalation and its result must remain inspectable.

## Authority is a separate axis

Semantic truth is not the only authoritative state. Authored geometry is authoritative portrayal state because it encodes externalized cognition and spatial memory.

Therefore Catalyst needs at least three authority classes:

- **authoritative authored state:** identity/content, source anchors, structure memberships, semantic assertions, analyst-authored occurrence geometry;
- **reproducible derived state:** indexes, inferred clusters, query results, computed metrics, suggested layouts;
- **ephemeral/session state:** hover, temporary selection, transient connector routing, previews and animation.
## Focus-in-context is a navigation contract

Focus should be modeled strongly enough to restore orientation, but weakly enough that it never becomes ontology.

A useful Focus Context contains: active Working Picture/subpicture, focal occurrence/identity, viewport neighborhood and scale, active projection/lens, local filters/folds, and a return token to the originating context.

This makes source opening and subpicture entry representation changes over the same analytical record rather than trips into unrelated application modes.

The strongest invariant is **return fidelity**: after opening a source, following provenance, entering a subpicture, or invoking an alternate projection, Back should restore the prior analytical place closely enough that spatial memory remains useful.

Zotero's exact return-to-highlight demonstrates provenance return at source scale. Catalyst should generalize this into picture-scale return: exact object, neighborhood, and useful local state.

## Identity versus role

The same durable identity may participate in different analytical roles in different contexts. Role must therefore not be inferred from occurrence position.

An excerpt can be adjacent to Hypothesis A in one picture and Hypothesis B in another without becoming two excerpts. If it supports A and contradicts B, those are separate explicit Semantic Relations while the source-region identity and provenance remain shared.

Likewise, repetition of one identity in several places must never be visually or computationally interpreted as independent corroboration. Occurrence count and evidence-source count are different quantities.

## Structure versus semantics

Branch, pile, territory, sequence and subpicture are organizational commitments. They may help the analyst reason, but they do not state how the world is.

A branch can later be used to portray selected semantic relations, but organizational parent/child and analytical predicates must remain inspectably distinct. This preserves the efficiency of mind-map structure without making tree parentage the ontology of all material.

## Portrayal versus truth

A visible connector is a portrayal occurrence of a relation or merely a provisional visual device. Geometry, endpoint binding, routing and visibility belong to portrayal state. The relation's truth-bearing record is separate.
Deleting, hiding or rerouting a connector portrayal therefore must not ambiguously delete or alter the underlying semantic assertion.

## Provenance versus derivation

Provenance needs to preserve both source identity and exact source anchor. Transformation adds another question: is this still the same thing being reused, or a new thing derived from it?

Catalyst should distinguish at least:

- **reuse/reference:** another occurrence of the same identity;
- **extraction:** a source-grounded identity retaining an exact anchor;
- **derivation:** a new identity created by summary, interpretation, translation, synthesis or transformation, with provenance to its input(s);
- **detachment:** explicit severing or weakening of provenance, never an incidental consequence of copying/moving.

This distinction is required for later audit and for disciplined source counting.

## Bounded Working Pictures

A Working Picture is a context boundary and authored geography, not the canonical ontology. It can contain occurrences, local structural memberships, portrayal state and portals to subpictures while drawing on durable identities and relations shared across contexts.

A subpicture therefore creates a new local portrayal context, not a duplicated analytical universe. Parent and child can show the same identity with independent geometry while preserving one durable object.

## Architecture acceptance tests

1. Place an unclassified source with no fake parent or semantic edge.
2. Reuse it twice without duplicating identity or implying corroboration.
3. Put one occurrence in a branch/pile while another stays structurally independent.
4. Move either occurrence without changing relations or provenance.
5. Promote a cluster to structure without inventing predicates.
6. Assert a semantic relation without forcing layout or hierarchy.
7. Hide/reroute its connector without deleting the assertion.
8. Extract a region, reuse it, derive a summary, and trace both to the exact source anchor.
9. Enter source/subpicture/projection and return to the exact prior analytical neighborhood.
10. Recompute a derived lens/layout without overwriting authored geography.
## What remains genuinely open

The evidence is now strong on separation of state species, but it does not yet settle several representation choices:

- whether a source region is always its own durable identity or may sometimes be an occurrence anchored directly to a source;
- whether structural memberships primarily attach identities, occurrences, or either depending on the structure type;
- how much Focus Context should be persisted across sessions versus treated as recoverable session state;
- the visible grammar that tells analysts “same identity reused here” without creating clutter or false corroboration cues;
- how branch/mind-map projections select between organizational Structure Membership and chosen Semantic Relations;
- how version-aware anchors degrade when source content moves or changes;
- whether subpicture portals retain a live preview, a stable snapshot, or a topology-preserving abstraction.

These are prototype/schema questions inside the established boundaries, not reasons to collapse the boundaries.

## Current architecture recommendation

For the next disposable Working Picture prototype, model the six state dimensions explicitly even if the implementation is temporary. The prototype may simplify persistence, but its interaction grammar must already obey the mutation discipline above.

The central design test is not whether users can create a graph. It is whether they can externalize uncertain analytical structure spatially, formalize only what they intend, inspect provenance, move between bounded contexts, and return without losing place.

This preserves the original Catalyst requirement that analytical structure become legible before it is readable while making the underlying commitment gradient auditable rather than merely visual.