# Forward comparator pass — Automerge conflict semantics — 2026-09-11

Status: source/documentation research only; no Catalyst GUI manipulation or product code.

## Why Automerge is a distinct comparator

Automerge is useful here not as another collaborative editor but as a current FOSS implementation of local-first replicated state with explicit merge rules, retained concurrent values, document history, branches/heads, and transport/storage separation.

Current upstream JavaScript release found: `@automerge/automerge` 3.4.1, released 2026-08-12. The current `automerge-repo` main branch reports 2.6.0-alpha.3.

Primary sources:
- https://automerge.org/docs/reference/documents/conflicts/
- https://automerge.org/docs/reference/under-the-hood/merge-rules/
- https://automerge.org/docs/reference/concepts/
- https://automerge.org/docs/reference/repositories/
- https://automerge.org/docs/tutorial/network-sync/
- https://automerge.org/automerge/api-docs/js/functions/changeAt.html
- https://automerge.org/automerge/api-docs/js/functions/change.html
- https://github.com/automerge/automerge/releases
- https://github.com/automerge/automerge-repo/blob/main/package.json

## Mechanism 1 — convergence is not analytical agreement

Automerge merges many concurrent edits automatically. Independent properties merge; list/text insertions are retained and deterministically ordered; counters merge by summation.

The exceptional scalar case is two concurrent writes to the same property. Automerge deterministically exposes one value as the ordinary read result while retaining all concurrently written values through `getConflicts()`.

A later write to that property resolves the conflict in CRDT terms.
Catalyst implication: a technically converged document can still contain an unresolved analytical disagreement. The UI/data model must not treat "all replicas now match" as evidence that analysts agree.

For analyst-significant fields, retained concurrent values should be inspectable and resolution should be a deliberate authored act with provenance, not merely whichever value the CRDT presents by default.

## Mechanism 2 — mechanical conflict and analytical disagreement are different species

A CRDT conflict is a collision in the replicated data structure: for example, two concurrent assignments to the same scalar property.

Analytical disagreement is domain state: two analysts may intentionally hold incompatible assessments, confidence judgments, source interpretations, or hypotheses at the same time.

Those perspectives should usually be modeled as distinct authored assertions/assessments with author, rationale, evidence, and status—not encoded accidentally as a low-level multi-value register waiting to be "resolved."

Conversely, a harmless wording collision on a title may create a CRDT conflict without representing meaningful analytical disagreement.

Catalyst consequence: expose a conflict layer, but do not use storage-engine conflicts as the ontology of dissent.

## Mechanism 3 — automatically mergeable fields still need domain atomicity

Automerge merges changes according to data-structure boundaries, not application intent. Two users changing different properties in one object are normally merged cleanly.

That creates a subtle Catalyst hazard. If a position is stored as independently editable `x` and `y`, concurrent drags can mechanically produce a composite position that neither analyst authored. Similar hazards exist for anchor bundles, status+reason pairs, confidence+assessment pairs, or other fields whose components form one intentional decision.

Catalyst should therefore choose merge granularity by domain meaning. State that must remain an authored unit should be replaced/versioned atomically enough that concurrent edits become visible alternatives rather than synthetic hybrids.
## Mechanism 4 — deletion semantics are domain-sensitive

Automerge's map merge rules specify that a concurrent update wins over a concurrent deletion of the same key. This is coherent CRDT behavior, but "deleted" has many domain meanings in an analytical system.

For source identity, evidence, published assertions, and audit-relevant artifacts, physical deletion should not be modeled casually as a map-key deletion. Archive/retract/supersede/tombstone may need to be explicit authored states with their own provenance and retention rules.

Catalyst implication: reserve physical purge for deliberate lifecycle policy. Analytical retraction and provenance-preserving removal should be domain events.

## Mechanism 5 — history is a DAG with usable branch points

Automerge documents retain change history. A document can have multiple heads after concurrent work, and change hashes identify historical states. `changeAt` can create a change as if authored against earlier heads, producing the equivalent of a concurrent branch without cloning first.

This is implementation evidence for review workflows where an analyst deliberately revises from a known analytical state while newer work exists elsewhere.

A Catalyst review/reconciliation record could therefore preserve: base heads/version, proposed change, current heads, resulting conflicts, and the explicit reconciliation decision.

The important invariant is that merge history does not itself explain analytical intent. Change metadata/history can support audit, but a consequential reconciliation still needs domain-level rationale.

## Mechanism 6 — replica identity is not human authorship

Automerge changes contain actor identity, dependencies/hash, sequence information, optional messages, and an advisory timestamp. Its documentation recommends actor IDs as replica/device identities; timestamps are explicitly not used for conflict resolution.

Catalyst must not equate an Automerge-style actor ID with an authenticated analyst identity. Durable audit should separately record who authored/approved an analytical action, which device/replica emitted the change, and—where relevant—which role or authority applied.
## Mechanism 7 — local-first sync and access control are separate concerns

Automerge Repo deliberately separates document state from storage and network adapters. Documents can remain locally usable while offline and later synchronize changes when connectivity returns.

That is attractive for Catalyst's non-proprietary/offline-capable direction, but synchronization does not by itself answer authorization. Automerge Repo has sharing-policy hooks; the newer Keyhive integration adds identities, encryption, and relay/read/edit/admin access levels, but the Keyhive/ARK integration is explicitly still alpha/currently changing.

Catalyst should inherit the architectural separation—local state, replication, authenticated identity, authorization, and encryption are distinct layers—without betting core analytical semantics on an alpha access-control package.

## What Catalyst should inherit

1. Preserve concurrent values instead of silently discarding collisions on important fields.
2. Make unresolved consequential conflicts discoverable through a lens/inspection state.
3. Choose CRDT/merge granularity according to domain intent rather than database convenience.
4. Preserve history/heads well enough to identify the base state of a review or reconciliation.
5. Keep offline/local persistence separate from network transport.
6. Keep human authorship/authority separate from replica/actor identity.
7. Treat access control/encryption as independent architecture layers rather than properties of the merge algorithm.

## What Catalyst should not inherit blindly

1. A deterministic scalar "winner" presented as if an analytical disagreement were settled.
2. Per-property merge semantics for compound states that must remain one authored decision.
3. Physical deletion as the ordinary meaning of retract/archive/supersede.
4. A raw actor ID as sufficient audit identity.
5. A generic CRDT document boundary chosen without considering source objects, Working Pictures, high-contention semantics, and startup/sync cost.
6. Hidden conflict state that requires developer APIs to discover when the conflicting field can alter analytical meaning.

## Net architectural effect

Catalyst needs two independent reconciliation concepts: **replication reconciliation** makes distributed state converge; **analytical reconciliation** records how humans adjudicate conflicting edits or perspectives. The former can often be automatic. The latter must remain attributable, inspectable, and sometimes intentionally unresolved.

This closes the multi-user conflict-semantics gap enough for the current architecture phase. The forward comparator sweep should now stop unless a later synthesis exposes another mechanism that is both important and weakly evidenced.

Additional sources used for collaboration/storage/access boundaries:
- https://automerge.org/docs/reference/repositories/storage/
- https://automerge.org/docs/reference/repositories/networking/
- https://automerge.org/docs/reference/repositories/refs/
- https://automerge.org/docs/keyhive/ark-api-guide/
- https://automerge.org/automerge/api-docs/js/types/DecodedChange.html
