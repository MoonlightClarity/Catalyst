# Architecture synthesis — identity, placement, structure, relation, provenance, focus — 2026-09-11

Status: research synthesis only. No Catalyst GUI manipulation and no product code changed.

## Question

What must the Working Picture keep distinct so that analysts can externalize uncertain structure without losing identity, provenance, or context?

The current evidence converges on six separable architectural concerns:

1. **Identity** — what analytical/source object this is.
2. **Occurrence / placement** — where and how that object appears in a particular Working Picture or projection.
3. **Structural membership** — what authored container, branch, subpicture, or composition the occurrence participates in.
4. **Semantic relation** — what explicit analytical claim connects identities.
5. **Provenance** — what source identity and exact source location substantiate or produced an object.
6. **Focus-in-context** — what local neighborhood, scale, and projection the analyst is currently operating within.

These concerns may be coordinated, but they must not collapse into one node, one edge, one parent pointer, or one global graph position.

## Evidence: Freeplane

Freeplane demonstrates one object identity coordinated across spatial map and outline projections. Selection and folding alter representation and density without creating another analytical object.

Its free-positioned nodes also expose a critical failure mode: visual independence can conceal structural parentage. A node can look spatially free while remaining invisibly attached to a root or parent.

Catalyst should adopt same-object/multiple-projection navigation and stable authored geography, while rejecting hidden hierarchy beneath apparently provisional placement.

## Evidence: Zotero

Zotero demonstrates that source identity can survive extraction into annotations and notes. A derived note can carry an excerpt while the source remains a stable object, and the annotation can return directly to the exact highlighted location.

The architectural lesson is stronger than “store citations”: provenance is a navigable relation with reversible context. Source identity, exact location, and analytical placement remain distinct.

Catalyst should therefore treat detachment from provenance as an explicit authored operation, never as an incidental side effect of copying evidence into prose or moving it on the Working Picture.

## Evidence: Trilium

The live Trilium 0.105.0 research instance provides a concrete identity-versus-placement precedent in its persisted model. The test note `rydBprqrrpGB` (`Catalyst Shared Object`) has three separate branch records:

- `root_rydBprqrrpGB` under `root`;
- `K71XbODM8k7A_rydBprqrrpGB` under `Context A`;
- `sP4HM8fEgoGb_rydBprqrrpGB` under `Context B`.

All three branch records point to the same note ID. Trilium therefore models one content identity with multiple hierarchical occurrences rather than duplicating the note for each location.

This is not yet the whole Catalyst answer: Trilium occurrences are still branch placements inside a hierarchy, whereas Catalyst must also allow genuinely non-hierarchical spatial occurrences. But it validates the more general rule that **identity and occurrence are different entities**.

The Trilium startup data also distinguishes notes, branches, attributes, a global note map, canvas notes, and mind-map notes. That reinforces the warning against forcing containment, relation, portrayal, and content into one universal edge type.

## Proposed Working Picture separation

### Identity
A durable analytical or source object should have identity independent of where it is shown. Editing the object through one occurrence should not silently create divergent copies unless the user explicitly forks it.

### Occurrence / placement
A Working Picture contains occurrences of identities. An occurrence owns portrayal state such as picture membership, coordinates, scale, crop/preview state, local visual emphasis, and possibly local fold/collapse state.

One identity may therefore appear in more than one Working Picture or more than once in one picture without becoming multiple analytical identities.

### Structural membership
Containment must be authored separately from placement. A pile, bounded subpicture, sequence, outline branch, or dossier membership is not implied merely because objects are nearby or visually enclosed.

Structural membership may itself have ordering and local display state, but it should be inspectable as structure rather than inferred from geometry.

### Semantic relation
Support, contradicts, derives-from, explains, precedes, is-same-entity-as, and similar relations are analytical assertions. They connect identities and must never be created merely by proximity, containment, or connector drawing conventions that are ambiguous about meaning.

### Provenance
Evidence-bearing identities need source identity plus a precise anchor: page, region, timestamp, record, cell range, message, or equivalent source coordinate. Provenance should survive reuse, movement, summarization, and projection changes.

### Focus-in-context
Focus is not identity and should not be stored as if it were semantic structure. It is an operating state describing the analyst's current bounded picture, focal object/occurrence, scale, local neighborhood, and active projection.

## Independent forward validation: AFFiNE / BlockSuite

The parallel forward-research pass provides an implementation-level corroboration. BlockSuite keeps Page and Edgeless editors over shared document state without conversion, while canvas geometry and z-order are explicit portrayal state.

More importantly, it distinguishes geometry-based frames from ID-based groups. Spatial enclosure and explicit membership are therefore separate mechanisms in a production editor architecture.

Catalyst should extend that separation further: geometric association, organizational membership, semantic relation, and provenance are four different commitments even when they are visually coordinated.

## Core invariants for the Working Picture

1. **Move does not mean relate.** Moving an occurrence changes placement only unless a separately visible operation changes structure or semantics.
2. **Enclose does not necessarily mean contain.** A provisional spatial frame may organize attention without creating durable membership.
3. **Contain does not mean assert.** Membership in a pile, dossier, branch, or subpicture does not itself mean support, contradiction, causality, or identity.
4. **Connect does not have one meaning.** Structural edges, semantic relations, provenance links, navigation links, and portrayal connectors must be typed or otherwise unambiguous.
5. **Reuse does not mean copy.** Reusing an identity in another picture should create another occurrence by default, not another analytical object.
6. **Extraction does not sever provenance.** An excerpt or observation retains its source anchor unless explicitly detached.
7. **Projection does not convert identity.** Outline, document, spatial, graph, timeline, or other lenses should project the same underlying record where appropriate.
8. **Focus does not rewrite structure.** Entering a subpicture, opening a source, filtering, folding, or zooming changes operating context, not analytical truth.
9. **Automatic layout cannot overwrite authored geography.** Computed arrangements may be offered as temporary projections or explicit transformations, not silently replace analyst-authored placement.

## Consequences for interaction design

The Working Picture should behave as an authored analytical geography, not as a graph renderer. The analyst should be able to place a source, excerpt, question, proposition, or other object before deciding whether it belongs to a formal branch or relation.

Entering a source or subpicture should preserve a return path to the exact originating occurrence. This is the spatial analogue of Zotero's return-to-page behavior: deep inspection should not destroy the analyst's place in the larger problem representation.

A single identity may need different local portrayals in different contexts. A source might appear as a recognizable page region in one Working Picture, a compact landmark in another, and a row in an outline projection, while provenance and analytical identity remain unchanged.

Likewise, local folding, filtering, semantic zoom, and temporary highlighting should usually belong to focus/projection state rather than to the analytical object's truth-bearing record.

## Minimum architecture tests before implementation

A candidate model should pass these cases without hidden coercion:

- Place an unclassified source in open space with no parent and no semantic relation.
- Show the same source in two bounded Working Pictures without duplicating source identity.
- Put one occurrence into an explicit pile/subpicture while another occurrence remains outside it.
- Move either occurrence without changing the other's geometry or creating/deleting relations.
- Extract a passage, move it elsewhere, and return to the exact source location in one action.
- Reuse that excerpt in another picture while preserving the same source anchor.
- Draw a provisional visual connector without forcing an analytical predicate; later promote it explicitly to a typed relation.
- Enter a subpicture or source, work there, and return to the originating local context with orientation intact.
- Switch to outline/document/graph projections without converting or duplicating the underlying identities.

Any model that requires a fake root, one canonical canvas position per identity, or an overloaded universal edge fails these tests.

## Additional forward evidence: Logseq and Excalidraw

Logseq strengthens the multiple-occurrence model by distinguishing reference, editable embed, and copy/derivative behavior. The same identity can be surfaced elsewhere without becoming another object, while transformed material is a different provenance state.

Catalyst should therefore avoid treating every repeated visual appearance as equivalent. At minimum, an occurrence may be:
- a read-through reference to a shared identity;
- an editable occurrence of that same identity;
- a derived artifact with provenance back to another identity.

Excalidraw independently validates another boundary. Geometry, grouping, frame membership, connector binding, files, and application state are all represented separately in one portable scene model.

Its connector bindings are especially instructive: they solve visual attachment, not analytical meaning. Catalyst should similarly allow a semantic relation to own one or more connector portrayals whose endpoints follow occurrences, while the relation itself remains independent of route, visibility, or even whether a connector is currently drawn.

This prevents a common graph-editor error: deleting or rerouting a line should not ambiguously mutate analytical truth.

## Strongest current architectural conclusion

The Working Picture is best understood as a **contextual portrayal layer over durable analytical identities**, not as the primary ontology itself.

The analytical record contains identities, source anchors/provenance, explicit structure, and semantic relations. A Working Picture contains authored occurrences of those identities plus portrayal state. Focus determines which bounded context and projection are active at a given moment.

This preserves the original Catalyst goal: analytical structure can become legible spatially before the analyst has committed every nearby item to formal semantics.
