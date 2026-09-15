# Architecture stress tests and research-closure criteria — 2026-09-11

Status: architecture synthesis only. No Catalyst GUI manipulation and no product code changed.

## Purpose

Stress-test the current Working Picture architecture against realistic analytical failure cases rather than another feature inventory.

This pass incorporates the new Hypothesis/W3C anchoring and OpenRefine transformation-provenance evidence into the established separation of identity, occurrence, structure, semantics, provenance, and focus.

## Refined provenance model

“Exact source anchor” should mean a durable provenance target, not one coordinate.

Conceptually it contains:
- Source Identity;
- source representation/version identity;
- a bundle of complementary selectors appropriate to the format;
- current anchor-resolution status/quality;
- optional captured native representation such as PDF page/region geometry;
- any transformation provenance that produced a downstream analytical identity.

An anchor that is recovered fuzzily after source/viewer drift is not equivalent to an unchanged exact resolution.## Stress case 1 — repeated reporting is not corroboration

Scenario: Report B quotes Report A; Report C paraphrases B; all three are placed in different subpictures and later appear near the same hypothesis.

Required behavior:
- A, B, and C retain distinct source/report identities and occurrences;
- provenance records preserve the upstream reporting chain where known;
- repeated occurrence or repeated publication does not increment an “independent support” count by itself;
- a support relation from any report/excerpt to a hypothesis remains an explicit analytical assertion;
- if independence is unknown, Catalyst must preserve “unknown,” not infer either independence or dependence from proximity or duplicate text.

Architectural implication: provenance lineage and evidentiary independence are not the same relation, but lineage supplies evidence needed to assess independence.

A future independence/source-family assessment can be attributed and inspectable rather than baked into occurrence count.

## Stress case 2 — transform without provenance collapse

Scenario: an analyst extracts a passage, translates it, summarizes the translation, and writes an observation based on the summary.

These are not four occurrences of one thing.

The architecture should represent a chain of durable identities connected by explicit provenance/transformation events where the transformation changes content or epistemic role.OpenRefine strengthens the rule that provenance should distinguish:
- transformation specification/method;
- a particular execution event;
- input identity/version(s);
- output identity;
- analyst acceptance/revision when relevant.

Ordinary undo history is not sufficient provenance and portrayal-only changes should not enter this chain.

## Stress case 3 — source version drift

Scenario: a web page or PDF representation changes after an excerpt was captured.

Required behavior:
- the original source/version identity remains part of provenance;
- the stored selector bundle is resolved against the current representation using deterministic/native selectors first and fallback selectors only when needed;
- resolution state is explicit: exact, relocated/validated, degraded/ambiguous, unresolved, or equivalent implementation vocabulary;
- a fuzzy lookalike match must not silently restore evidence-grade certainty;
- the analytical identity and its Working Picture occurrences survive even when the source anchor becomes unresolved.

This means anchor validity is state about provenance resolution, not identity existence.

## Stress case 4 — reuse across bounded subpictures

Scenario: one source-region identity is used in the parent picture and two child subpictures.

Each context may own independent occurrence geometry, local fold/detail state, and local structural membership.Putting the parent occurrence into a territory must not insert the child occurrences into that territory. Likewise, moving a child occurrence must not move the parent occurrence.

If the region supports Hypothesis H, that semantic relation is identity-level and can be portrayed in any context where useful without being recreated as a new truth claim for every occurrence.

A local connector portrayal can therefore exist in one subpicture and be absent in another while both refer to the same relation.

## Stress case 5 — branch projection semantics

A mind-map/outline projection needs an explicit policy for which edges it is showing.

Default recommendation: branch projections should be generated primarily from authored Structure Membership, not inferred from arbitrary semantic relations.

Selected semantic relations may be overlaid or used by a purpose-specific projection, but that must be visibly different from organizational parent/child.

This preserves the original value of a fundamental mind-map structure while avoiding a universal-tree ontology.

The same identity may appear in more than one branch context through separate occurrences/membership instances. That is reuse, not duplication.

## Stress case 6 — focus and return through deep inspection

Scenario: from a source-region occurrence, the analyst opens the source, follows upstream provenance to another report, opens a saved analytical projection, then returns.

Every representational escalation should push enough return context to reconstruct the prior analytical place.Return fidelity should restore the originating Working Picture, focal occurrence, local neighborhood/viewport, useful projection/lens state, and local folds/filters where they matter to orientation.

Following provenance does not rewrite the originating object's structure. Opening a saved view does not promote that view into analytical truth. Back/Return is navigation-state mutation only.

## Stress case 7 — deletion must name its layer

The six-way separation creates a necessary deletion rule: “delete” is ambiguous unless the target species is clear.

At minimum the architecture must distinguish:
- remove this occurrence from this Working Picture;
- remove this local structural membership;
- remove/hide this connector portrayal;
- retract/delete this semantic assertion;
- delete/archive the underlying analytical identity;
- detach or invalidate a provenance link only through a deliberate provenance action.

Deleting the last occurrence must not silently delete the underlying identity. Deleting a connector drawing must not silently retract a relation. Removing a branch membership must not destroy the member object.

This is the destructive-operation counterpart to the mutation discipline.

## Stress case 8 — derived lenses cannot become truth by persistence

A query, clustering pass, entity extraction, graph metric, inferred relationship candidate, or automatic layout may be saved/cached for performance, but persistence does not make it authored analytical truth.

Derived results need lineage to the inputs/rules that produced them and an explicit promotion operation when the analyst chooses to turn a suggestion into authored structure or semantics.## Minimum conceptual contract for the next disposable prototype

The prototype does not need the final database schema, but it should visibly behave as though these species are separate:

1. Durable Identity.
2. Context-local Occurrence with authored geometry.
3. Context-local Structure Membership.
4. Identity-level Semantic Relation.
5. Provenance Target/Link with source version, selector bundle and resolution state.
6. Transformation Provenance Event for meaningful derivation.
7. Focus/Return state, optionally promotable to Saved View.
8. Derived/lens state distinguishable from authored state.

The prototype can use temporary in-memory representations if each interaction preserves these distinctions and can be instrumented to verify the intended mutation.

## Prototype command contract

Every consequential command should have a named primary target species.

Examples:
- `Place`, `Move`, `Resize` → Occurrence;
- `Make pile`, `Make branch`, `Make subpicture` → Structure;
- `Supports`, `Contradicts`, etc. → Semantic Relation;
- `Capture region` → Anchored Identity + Provenance;
- `Summarize`, `Translate`, method execution → new Identity + Transformation Provenance;
- `Open`, `Enter`, `Back`, `Home` → Focus/Return;
- `Remove from picture`, `Retract relation`, `Delete object` → deliberately distinct destructive commands.

## Architecture research-closure criteria

The architecture pass is sufficiently mature for disposable interaction prototyping when the coordinator accepts all of the following as design constraints:

- no fake root or mandatory parent for freely placed material;
- no single global position per identity;
- no universal edge whose meaning depends only on style;
- no geometry-to-semantics inference without analyst promotion;
- no occurrence-count-to-corroboration inference;
- no provenance severance through ordinary move/copy/paste;
- no source return that hides degraded/fuzzy anchor recovery;
- no editor undo stack serving as the sole provenance ledger;
- no automatic layout overwriting authored geography;
- no focus/navigation state treated as analytical truth;
- no ambiguous deletion across occurrence, structure, relation, identity, or provenance layers.

Passing these constraints does not prove the UI is cognitively successful. It only ensures the prototype tests the intended architecture rather than a hidden graph/tree substitute.

## Questions that can remain prototype-level

The following do not block architecture closure:
- precise visual cue for same-identity reuse;
- exact subpicture portal preview style;
- exact threshold for when a transient source selection becomes a durable anchored identity;
- exact persisted subset of recoverable Focus Context;
- exact selector bundle per source format;
- exact branch/outline portrayal of optional semantic overlays.

They should be tested inside the established state boundaries rather than answered by collapsing those boundaries.

## Remaining non-blocking architecture research

A distinct future issue is multi-user conflict semantics: concurrent edits to shared identities, semantic assertions, provenance, and occurrence geometry may require different merge policies. The forward-research stream correctly identifies this as a separate mechanism.

For the current single-user cognitive-architecture prototype, that gap does not justify delaying the state-separation model. The prototype should avoid making persistence assumptions that would preclude later per-species conflict policies.

Trilium remains a limited evidence source for this role until an authorized hands-on pass is written. Its persisted note/branch model supports identity-versus-occurrence, but this pass makes no additional GUI-derived claims.

## Strongest current conclusion

Catalyst's Working Picture should be an authored contextual portrayal of a richer analytical record, with a command grammar that preserves boundaries among placement, organization, assertion, provenance, transformation, and navigation.

The architecture is now specific enough that a prototype can fail it objectively: any interaction that silently crosses these boundaries, loses return context, mistakes reuse for corroboration, or hides provenance degradation is an architectural regression even if the surface looks simpler.
