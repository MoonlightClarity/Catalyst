# Working Picture architecture contract — 2026-09-11

Status: normative research/design contract for disposable prototyping. It is not a database schema and does not authorize production implementation.

## Purpose

Provide one compact gate for the next Catalyst Working Picture prototype so cognitive-architecture research is not lost during implementation.

The prototype may simplify persistence and styling, but it must preserve the distinctions below in behavior and instrumentation.

## State species and natural scope

| Species | Natural scope | Meaning |
| --- | --- | --- |
| Analytical Identity | globally durable | the durable source/analytical thing |
| Occurrence | Working Picture/context local | one located portrayal/use of an identity |
| Structure Membership | analytical-context local | authored pile/territory/branch/sequence/subpicture organization |
| Semantic Relation | normally identity level | an explicit analytical/world assertion |
| Source Version + Anchor | source/version scoped | where source-grounded material came from |
| Transformation Event | inputs/outputs scoped | how a new durable artifact was produced |
| Focus Context | session/context scoped | current operating place and reversible navigation state |
| Saved View | explicitly durable | promoted viewpoint/projection, not analytical truth |
| Derived State | recomputable/cached | queries, inferred clusters, metrics, suggestions, computed layouts |
## Mutation law

A user action must mutate only the state species it names unless the action explicitly communicates a promotion/escalation into another species.

Required examples:
- `Place`, `Move`, `Resize`, local representation change → Occurrence only.
- `Make pile`, `Make territory`, `Make branch`, `Make subpicture` → Structure only unless another consequence is explicitly chosen.
- `Supports`, `Contradicts`, `Precedes`, etc. → Semantic Relation.
- `Open`, `Enter`, `Back`, `Home`, temporary lens/focus → Focus Context.
- `Capture source region` → anchored identity/provenance as appropriate, not automatic analytical evidence semantics.
- `Summarize`, `Translate`, transform/method execution → new identity plus provenance/transformation event when content changes materially.

Compound operations are allowed only when their multiple effects are visible and deliberate.

## Absolute prohibitions

The prototype must not:
- require a fake root/parent for free placement;
- store one global canvas position on an identity;
- infer semantic relations from proximity, enclosure, alignment, grouping, or branch geometry;
- treat occurrence count, report count, or duplicated text as independent corroboration;
- silently convert a reference/reuse into a copy;
- silently sever source provenance through movement, copy/paste, projection change, or derivation;
- silently overwrite analyst-authored geography with automatic layout;
- make selection/focus into analytical salience or truth;
- use connector routing/binding as the semantic relation record.## Source/provenance contract

A source-derived object must be able to preserve:
- durable Source Identity;
- source representation/version identity;
- one or more complementary format-aware selectors/anchors;
- current resolution status/quality;
- transformation provenance when the analytical object is not merely the same source fragment reused elsewhere.

Anchor resolution must distinguish exact/validated recovery from degraded, ambiguous, or unresolved recovery. A fuzzy match must never silently become evidence-grade certainty.

A captured source region may remain a source-grounded identity. An analyst observation, interpretation, translation, summary, or synthesis derived from it is a different identity when content/epistemic role changes materially.

Provenance lineage must remain distinct from evidentiary independence. Reporting chains can inform an independence assessment, but dependence/independence is not inferred from publication count or layout.

## Structure and subpictures

Working Picture organization is context scoped. The same identity may participate in different piles, territories, branches, sequences, or subpictures through different occurrences/membership instances.

Reorganizing one occurrence must not silently reorganize all other occurrences of that identity.

A subpicture is a new local portrayal context over the same analytical record, not a copied universe. Parent and child may show the same identity with independent geometry.

Entering a subpicture changes Focus Context. Returning restores the originating occurrence/neighborhood closely enough to preserve orientation.## Semantic relations and connector portrayals

Semantic relations normally connect durable identities. A relation may have zero, one, or many visible connector portrayals across contexts.

Connector route, endpoint binding, visibility, and local styling belong to portrayal/occurrence state. Hiding or rerouting a connector must not retract the relation.

A branch is organizational structure unless a purpose-specific projection explicitly states otherwise. Mind-map/outline projections should therefore default to authored Structure Membership, with selected semantic relations overlaid or projected through a visibly distinct rule.

## Focus and saved viewpoints

Ordinary pan/zoom/selection/open state is navigation/restoration state, not analytical content.

Crash/session recovery may persist Focus Context operationally. Durable viewpoint creation requires explicit promotion such as `Save view` or `Bookmark context`.

Saved Views reference contexts/identities/projections but do not assert semantic truth about them.

Return tokens should preserve enough state to reconstruct the originating analytical place after source inspection, provenance traversal, subpicture entry, or alternate projection.

## Destructive-operation contract

The UI/command layer must distinguish at least:
- remove occurrence from this picture;
- remove local structural membership;
- hide/remove connector portrayal;
- retract/delete semantic relation;
- archive/delete underlying analytical identity;
- detach/invalidate provenance through an explicit provenance action.
Deleting the last occurrence must not silently delete the identity. Removing structure must not destroy its members. Removing a connector portrayal must not retract analytical truth.

## Derived-state contract

Computed clusters, indexes, extraction candidates, query result sets, graph metrics, suggested layouts, validation caches, and lens renderings remain derived even when persisted for performance.

Promotion from a derived suggestion into authored structure or semantics must be explicit and auditable. Persistence alone does not change authority class.

## Prototype acceptance sequence

A conforming disposable prototype should demonstrate one continuous sequence in which the analyst can:
1. place an unclassified source with no fake parent;
2. capture an anchored region and return to its exact source context;
3. reuse that region in another bounded picture without copying identity;
4. organize one occurrence into a pile/branch while another reuse remains independent;
5. move either occurrence without altering semantics/provenance;
6. explicitly assert one semantic relation and portray it locally;
7. hide/reroute that connector without retracting the assertion;
8. derive a summary/observation while retaining transformation provenance;
9. enter a source/subpicture/projection and return to the prior analytical neighborhood;
10. remove an occurrence without deleting the underlying identity.

The prototype fails the architecture gate if any step silently crosses state species, hides provenance degradation, destroys authored geography, or makes reuse look like corroboration.

## Deliberately unresolved inside this contract

Visual styling, exact persistence schema, precise selector bundle per format, same-identity reuse cue, subpicture portal artwork, and final saved-view UI remain prototype/design questions. They must be solved inside this contract rather than by weakening it.

## Identity-edit / clipboard command contract

Editing durable content through any occurrence normally edits the shared underlying identity. Editing geometry or local representation edits only that occurrence.

The command grammar must distinguish:
- `Reuse` — another occurrence of the same identity;
- `Move occurrence` — relocate context-local portrayal without changing identity;
- `Fork/Duplicate as new object` — intentionally create a new identity that may diverge, retaining lineage where analytically relevant;
- `Edit shared identity` — update truth-bearing/content state seen through its occurrences.

Generic copy/paste must not hide which identity behavior occurred. Imported external clipboard content is a new capture unless an existing Catalyst identity is explicitly carried with it.

If a reproducible/method-produced artifact is later manually edited, provenance/history must reveal the subsequent authorship rather than implying the current content is still the untouched execution output.

## Future collaboration compatibility

The next single-user prototype need not implement synchronization, but its conceptual boundaries must not preclude later per-species conflict semantics.

Required long-term invariants:
- replication convergence and analytical/human reconciliation are different mechanisms;
- human authorship/approval identity remains distinct from device/replica/change identity;
- compound authored states use merge granularity that cannot silently synthesize a state nobody authored;
- intentional analytical disagreement is represented as attributable domain assertions/assessments/perspectives, not as a storage-engine conflict;
- consequential unresolved edit conflicts remain inspectable until an attributable reconciliation;
- archive/retract/supersede/delete/purge remain domain-distinct lifecycle operations under replication;
- ordinary personal Focus Context need not become shared collaborative state.

No CRDT/storage/sync engine is selected by this contract.
## Prototype observability requirement

Disposable prototyping should expose a mutation trace sufficient to verify this contract empirically.

For every consequential command, the evaluator should be able to compare the declared state species it was allowed to mutate with the species actually changed. Stable durable identity ids and occurrence ids should make reuse versus copy/fork observable.

At minimum the trace harness should catch: move changing semantics/provenance; reuse duplicating identity; grouping inventing a predicate; relation creation moving/reparenting objects; connector deletion retracting a relation; occurrence deletion deleting identity; source drift replacing original provenance; or projection/navigation rewriting analytical state.

This is prototype instrumentation, not a requirement that production Catalyst retain every gesture as permanent audit history.

See `WORKING_PICTURE_PROTOTYPE_OBSERVABILITY_2026-09-11.md` for the evaluator contract and canonical trace sequence.
