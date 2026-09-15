# Forward FOSS research synthesis — 2026-09-11

Status: synthesis of the bounded AFFiNE, Logseq, Excalidraw, Zettlr, and SilverBullet passes. Research/design only; no Catalyst product code.

## Why this sweep matters

The products differ substantially, but together they expose a set of implementation boundaries that map closely to Catalyst's unresolved cognitive architecture.

The important result is not a shopping list of features. It is evidence that mature/current FOSS systems already separate several kinds of state that Catalyst must not collapse into one universal node or edge model.

## Comparator mechanisms

| Comparator | Distinct mechanism stressed | Strongest transferable lesson |
| --- | --- | --- |
| AFFiNE / BlockSuite | Isomorphic Page/Edgeless portrayals; block vs surface state; frames vs groups | Shared identity can survive radically different portrayals while geometry and membership remain portrayal-specific |
| Logseq | Block/node references, embeds, backlinks, structured DB properties | Reuse can preserve identity; read-through occurrence, editable occurrence, and derivative are different states |
| Excalidraw | Persisted scene graph with geometry, frames, groups, bindings | Scene graph state can be first-class without being semantic graph truth |
| Zettlr | Ordinary-file workspaces, external bibliography, derived publication | Rich application behavior need not seize ownership of the source corpus |
| SilverBullet | Canonical Markdown + rebuildable Object Index + X-Ray/query lenses | Derived structure can be inspectable and recomputable rather than authoritative |

## Synthesis 1 — Catalyst needs multiple relationship species

The sweep strongly rejects a single generic edge/group primitive.

At minimum, Catalyst should keep these independently representable:
1. source/provenance relation — where material originated and how it was transformed;
2. identity/occurrence relation — this placed portrayal refers to this durable analytical object;
3. structural membership — branch, pile, territory, subpicture, or other analyst-authored organization;
4. semantic analytical relation — supports, contradicts, causes, precedes, identifies, etc.;
5. portrayal attachment — a connector endpoint, label binding, frame membership, or other scene behavior.

AFFiNE and Excalidraw show that even generic editors separate multiple association mechanisms. Logseq shows reuse/reference has its own identity semantics. Zotero/Zettlr evidence already shows provenance/citation is another independent relation.

Catalyst should not encode these as differently styled instances of one edge if doing so makes deletion, audit, export, or user intent ambiguous.

## Synthesis 2 — identity and occurrence must be separate

AFFiNE's shared document across editors and Logseq's references/embeds converge on the same requirement: one durable thing can have several located uses or portrayals.

A Working Picture occurrence therefore needs its own local state—picture, geometry, visibility, local portrayal, perhaps collapse/focus state—while referring to one underlying analytical identity.

This also creates a necessary provenance distinction:
- another occurrence of the same object is not a copy;
- a transformed derivative is a new object with provenance back to its source;
- a quoted/reference portrayal may be read-only while an editable occurrence intentionally edits the shared identity.

Catalyst should make those states inspectable rather than relying on visual similarity to communicate them.

## Synthesis 3 — semantic graph and scene graph should be separately durable

Excalidraw provides the clearest implementation precedent, while AFFiNE reinforces it.

The Working Picture requires a scene/portrayal layer containing geometry, ordering, grouping, framing, connector routing, visibility, and local representation state. The analytical record requires identities, provenance, structural commitments, semantic assertions, and method state.

Both layers are real authored state and both may require history/undo. But scene mutations must not silently mutate analytical truth.

Examples:
- rerouting or hiding a connector portrayal does not delete the semantic relation;
- moving two objects together does not create a relation;
- moving an occurrence into another subpicture does not change the underlying object identity;
- deleting the last occurrence should not automatically delete the underlying analytical object without an explicit object-deletion decision.

## Synthesis 4 — authority class should be explicit

SilverBullet adds a second orthogonal boundary: not all stored state has the same authority.

A useful Catalyst classification is:

- **authoritative source/analyst state** — source identity/version, exact provenance anchor, authored analytical identity, explicit structural membership, analyst-authored semantic relation, authored occurrence placement;
- **reproducible derived state** — full-text index, entity extraction, inferred cluster candidates, computed graph metrics, query result sets, validation caches;
- **ephemeral presentation state** — hover, temporary selection chrome, animation/intermediate routing, transient previews.

Some portrayal state, especially authored geometry, is authoritative even though it is not semantic. Authority and semantics are therefore separate axes.

This classification should drive backup, export, audit, invalidation, synchronization, and recovery behavior.

## Synthesis 5 — open storage is a preservation contract, not a single file format

Zettlr shows the value of leaving ordinary source files ordinary. Logseq's DB transition shows why a richer analytical record may not fit losslessly into Markdown. SilverBullet shows when Markdown can remain canonical because its semantic index is intentionally derived.

Catalyst should therefore define openness as a preservation contract rather than promise that every state is representable as plain text.

At minimum it needs:
- documented, inspectable full-fidelity archival/export of the analytical record;
- preserved or explicitly copied source artifacts with hashes/version metadata as appropriate;
- useful interoperable projections such as Markdown/CSV/JSON/graph exports that declare what they omit;
- a rebuild procedure for every state classified as derived;
- no silent dependence on an undocumented proprietary binary store.

## Synthesis 6 — lenses should reveal interpretation without owning the base picture

SilverBullet's X-Ray pattern and the prior Catalyst portrayal research align strongly. Catalyst can keep the calm Working Picture structurally legible while allowing deliberate lenses to reveal provenance, inferred entities, confidence, occurrence reuse, stale anchors, or method checks.

A lens is a projection over underlying state. Turning it off removes the portrayal, not the facts or assertions it reveals. If a lens proposes a new analytical assertion, acceptance should remain an explicit promotion action.

## Synthesis 7 — stable anchoring is a first-order data problem

Zotero already demonstrated exact return-to-highlight. Logseq demonstrates stable reused object identities. SilverBullet's evolution beyond page-plus-position references reinforces why Catalyst should not treat a raw character offset as durable evidence identity.

Catalyst source anchors should be format-aware and version-aware, with enough identity or fingerprint context to detect relocation or invalidation. The precise implementation can vary by PDF, web capture, image, audio/video, spreadsheet, or plain text, but source drift should be detectable rather than silent.

## Immediate consequence for the Working Picture prototype

The disposable cognitive prototype does not need the final storage engine, but it should already respect these boundaries conceptually. Its test data should distinguish:
- underlying analytical identity from occurrence placement;
- source identity and exact source anchor from later analytical use;
- organizational membership from semantic relation;
- semantic relation from its visible connector portrayal;
- authored state from derived or ephemeral state.

If the prototype cannot preserve these distinctions in its interaction grammar, implementing a richer backend later will not repair the cognitive ambiguity.

## Research boundary after this sweep

Do not add more FOSS products merely to increase comparator count. A next comparator is justified only if it tests a mechanism still weakly evidenced, such as durable version-aware source anchoring, multi-user analytical conflict semantics, bounded spatial navigation at scale, or provenance-preserving transformation pipelines.

The current five-product forward sweep is sufficient to inform the next architecture synthesis together with the completed Freeplane, Zotero, and Trilium work.

## Addendum — source anchoring, transformation provenance, and collaboration

The initial five-product sweep was followed only where a remaining mechanism was weakly evidenced. Three later passes now close those gaps:

| Comparator/reference | Distinct mechanism stressed | Strongest transferable lesson |
| --- | --- | --- |
| Hypothesis + W3C Web Annotation | Redundant selectors, source state, re-anchoring | Exact source return is a version-aware resolution problem, not a single stored offset |
| OpenRefine | Serializable operations, executions, diffs, history, project archives | Transformation specification, execution, result, and undo history are different provenance records |
| Automerge | CRDT merge rules, retained conflicts, heads/history, local-first sync | Replica convergence must remain distinct from human analytical reconciliation |

## Synthesis 8 — source anchors need resolution state

A provenance link should not merely say that an object came from a document. A source-derived object should be able to carry source identity/version plus redundant format-aware selectors and the current outcome of resolving those selectors against the available representation.

Useful resolution states include at least exact, recovered/fuzzy, unresolved/stale, and intentionally detached.

This state belongs in provenance, not only in UI error handling, because an analyst reviewing a claim needs to know whether Catalyst can still reconstruct the exact source context that originally supported it.

The principle applies beyond web/PDF text. Images, audio/video, spreadsheets, and changing datasets need format-specific anchor bundles rather than one universal character-offset scheme.
## Synthesis 9 — derivation is an event graph, not one pointer

OpenRefine demonstrates why `derivedFrom` is insufficient for serious audit. A reusable transformation description is not the execution of that transformation; the execution is not the output; and ordinary UI undo history is not a durable provenance ledger.

For derived Catalyst artifacts, the minimal durable record should be capable of distinguishing:
- input object/source identity and version;
- transformation or method specification and parameters;
- execution event and relevant software/method version;
- output identity/version;
- analyst acceptance, revision, or rejection as subsequent authorship.

This does not imply logging every gesture. Moving an occurrence or opening a source is portrayal/navigation state; a reproducible data transform, translation, extraction, or method run is a provenance event when the result is later relied upon.

Archive/export policy must also acknowledge that full history can retain sensitive values removed by later transformations. Audit-preserving export and sanitized publication export are therefore different products.

## Synthesis 10 — convergence, collision, and disagreement must not collapse

Automerge closes the collaboration gap by showing three states Catalyst must distinguish:
1. **mergeable concurrent work** — independent changes can safely coexist;
2. **mechanical collision** — the replicated model contains concurrent alternatives for the same data slot;
3. **analytical disagreement** — humans intentionally maintain incompatible interpretations or judgments.

Only the first is safely invisible. A consequential mechanical collision requires inspection/reconciliation. Intentional analytical disagreement should normally be represented explicitly as multiple authored assertions/assessments rather than disguised as a storage-engine conflict.

This also means merge granularity is a domain-model decision. Compound state such as an authored spatial pose, anchor bundle, or assessment+confidence may need atomic/versioned treatment so concurrent updates cannot silently synthesize a state nobody authored.
## Revised boundary model after the complete forward sweep

The research now supports three orthogonal questions for every piece of Catalyst state:

**1. What species of state is it?**
- source/provenance identity and anchor;
- analytical identity/content;
- structural organization;
- semantic assertion/relation;
- occurrence/scene/portrayal state;
- transformation/method execution state.

**2. How authoritative is it?**
- authoritative source or analyst-authored state;
- reproducible derived state;
- ephemeral presentation state.

**3. How should concurrency behave?**
- independently mergeable;
- intentionally atomic / conflict-visible;
- multi-perspective by domain design rather than "resolved" to one value.

These axes should inform storage, undo, audit, sync, export, conflict UI, and deletion policy. They are more important than selecting a specific canvas/database/CRDT library prematurely.

## Forward-research closure

The distinct mechanism gaps identified at the start of this role are now adequately evidenced: portrayal/identity, multiple occurrence, scene-vs-semantic state, file/source ownership, rebuildable derived state, durable source anchoring, transformation provenance, and collaborative conflict semantics.

Further comparator research should pause unless architecture/prototyping exposes a concrete unresolved mechanism. The next useful work is to feed these constraints into the architecture synthesis and prototype acceptance criteria rather than expanding the product list.
