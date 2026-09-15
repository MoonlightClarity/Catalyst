# Architecture resolution — collaboration and conflict semantics — 2026-09-11

Status: architecture research only. No Catalyst GUI manipulation and no product code.

## Purpose

Incorporate the closed forward-research Automerge conflict pass without selecting Automerge or any other storage/sync engine.

The goal is to ensure the Working Picture state model can later support local-first collaboration without allowing mechanical merge behavior to invent analytical meaning.

## Core distinction

Catalyst needs two independent reconciliation layers:

1. **Replication reconciliation** — make distributed replicas converge on compatible application state.
2. **Analytical reconciliation** — record how people resolve conflicting authored judgments, assessments, interpretations, or consequential edits.

Replication convergence does not mean analysts agree. Analytical disagreement may intentionally remain unresolved even after all replicas contain the same record of that disagreement.

A low-level storage conflict likewise does not necessarily mean analysts disagree; it may be an ordinary concurrent wording collision.

## Authorship is not replica identity

Durable audit should be able to distinguish human author/approver identity from device/replica actor identity, change/version identity, and authorization role where relevant.
## Conflict granularity follows state meaning

The replication layer must not choose merge granularity only because fields are convenient to store separately.

Examples:
- occurrence geometry such as position/size may need to be treated as one authored placement change rather than independently merged `x`, `y`, `width`, `height` values that can synthesize a geometry nobody authored;
- a provenance anchor's source-version identity, selector bundle, and resolution state must not be cross-combined from incompatible concurrent edits;
- assessment value + rationale/status/attribution may need conflict-visible atomicity when splitting them could manufacture an incoherent judgment;
- relation predicate/endpoints/status can require stronger atomic boundaries than connector portrayal state.

Mechanically mergeable does not automatically mean semantically safe to merge.

## Species-specific collaboration posture

### Analytical Identity content

Independent text edits may be mergeable where the content model supports it, but consequential scalar collisions such as canonical title/status/type should retain conflicting authored alternatives when automatic merging would hide intent.

Intentional disagreement about analytical meaning should normally be represented as multiple attributed assertions/assessments/perspectives, not as unresolved storage conflicts on one scalar field.

### Occurrence / placement

Occurrence geometry is authored cognitive state. Concurrent placement edits should not silently produce a hybrid geometry assembled from components of two drags.
A later reconciliation may choose one placement, preserve alternatives in history, or intentionally retain multiple occurrences. The architecture does not require one specific UI, only that synthetic unauthored geometry is avoidable/inspectable.

### Structure Membership

Concurrent additions of independent memberships can normally coexist. Conflicting reparent/reorder operations may require context-specific reconciliation rather than a hidden deterministic winner when organizational intent matters.

Because structure is context scoped, a conflict in Picture A must not globally reorganize occurrences of the same identities in Picture B.

### Semantic Relations

Independent new assertions can coexist. Concurrent incompatible edits to one assertion must remain inspectable when the difference can change analytical meaning.

Intentional dissent should normally create separately attributable analytical assertions/perspectives rather than rely on a storage-engine multi-value conflict.

### Provenance and transformation events

Provenance is audit-critical. Concurrent edits that would combine incompatible source versions/selectors/transformation execution metadata must not synthesize a lineage nobody authored.

Historical transformation/execution events should normally be append-preserving; later corrections/retractions should be explicit domain events rather than destructive rewriting of relied-upon provenance.

### Focus Context

Personal/session focus is normally replica/user-local operational state and need not be collaboratively merged by default.
A deliberately shared Saved View is authored state and may have its own version/conflict behavior, but ordinary pan/zoom/selection should not create shared collaborative noise.

## Deletion and lifecycle under concurrency

The prior destructive-operation model becomes more important under replication.

`Archive`, `Retract`, `Supersede`, `Delete occurrence`, `Delete identity`, and `Purge` should remain domain-distinct operations. A physical map-key deletion or storage tombstone cannot by itself express all of them.

For audit-relevant analytical/source objects, concurrent update-versus-delete behavior should not be delegated invisibly to a generic merge rule. Preserve enough lifecycle history to show what was authored and reconcile deliberately where consequence matters.

Physical purge remains a separate policy/security operation with explicit consequences for replicas, archives, dependent provenance, and auditability.

## Conflict visibility

Consequential unresolved edit conflicts should be discoverable through inspection/lens state without permanently crowding the base Working Picture.

A conflict indicator means “concurrent authored state requires review,” not “analysts disagree about the world.” Analytical disagreement uses the domain's assertion/assessment/perspective model.

Resolving a consequential conflict should itself be an attributable authored action with base/current version context and, where useful, rationale.

## Local-first layering rule

Local storage, replication/sync, authenticated human identity, authorization, encryption, and analytical semantics remain independent architecture layers.
A merge/CRDT engine may support some of those layers, but adopting one must not collapse the boundaries or make analytical semantics depend on engine-specific conflict behavior.

This is consistent with Catalyst's local-first/non-proprietary direction while keeping access-control technology choices replaceable.

## Architecture tests for a future collaborative prototype

A later collaboration-capable prototype should demonstrate:
1. two independent edits to different state species do not cross-mutate each other;
2. concurrent drags cannot silently synthesize a placement nobody authored;
3. concurrent consequential scalar edits retain inspectable alternatives until an attributable resolution;
4. intentional analyst disagreement is represented as domain assertions/perspectives, not hidden CRDT conflict;
5. an update concurrent with archive/retraction/deletion remains auditable rather than disappearing behind a generic merge winner;
6. human author, replica/device, and change/version identities remain distinguishable;
7. ordinary personal Focus Context does not pollute shared analytical state.

## Effect on current architecture closure

This closes the previously identified multi-user conflict-semantics research gap enough for the current architecture phase.

It does not require collaboration to be implemented in the next disposable single-user cognitive prototype. Instead, the prototype/data boundary should avoid choices that make per-species merge granularity, attributable conflict resolution, or provenance-preserving lifecycle states impossible later.

No storage engine is selected. Automerge is evidence for explicit conflict/local-first mechanisms, not an implementation recommendation.

The current architecture is therefore ready for deliberate coordinator/user research closure and prototype gating unless a completed Trilium hands-on pass produces a genuine counterexample.
