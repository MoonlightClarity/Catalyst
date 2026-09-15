# Overnight provenance and document-placement stress test — 2026-09-11

Status: research/design synthesis only. No Catalyst GUI manipulation and no product code changed.

## Assignment and conclusion

Stress-test Catalyst's source/document placement and provenance architecture using the completed Zotero pass plus FOSS, standards, and academic precedents.

The current Working Picture contract survives, but its provenance lifecycle needs sharper language. The defensible model is not “a card with a citation.” It requires independent records for:

1. durable Source Identity;
2. immutable Source Representation identities;
3. Source Region identity with redundant format-aware selectors;
4. current anchor-resolution observations, separate from the authored anchor;
5. analytical identities derived from or referring to regions;
6. context-local Occurrences that place identities;
7. Transformation Events when content or epistemic role changes; and
8. Focus/return tokens preserving source destination and analytical origin.

Document placement is genuine cognitive state, but not provenance or truth. Moving changes authored geography only. Removing from a picture removes an Occurrence only. Losing source bytes changes availability, not historical lineage.

The main amendment is: detach/unlink must name what is detached. Catalyst must distinguish removing an occurrence, stopping live synchronization, detaching a rendered reference while retaining lineage, and purging source/provenance.## Evidence

### Zotero

The hands-on pass imported a PDF as a stable library item with an attachment, created annotations and a note from annotations, then used Go to Page to return to the exact highlighted passage. The annotation also exposed Unlink.

The value is the continuity chain: source item → representation → annotation → derived note embedding → exact return. Annotation storage remains separate from the source file, so analytical overlay need not mutate evidence bytes.

The limitation: Zotero's tree/reader is not Catalyst's cognitive surface, and “Unlink” underspecifies whether lineage, live embedding, citation rendering, or navigability is removed.

### Hypothesis and W3C Web Annotation

A region must not be represented by one fragile coordinate. W3C permits multiple selectors for one target; Hypothesis uses ordered fallback among range, text-position, text-quote, and media selectors.

This separates which source representation was inspected from which segment was selected. A hash cannot answer the second; a selector cannot prove the first.

References:
- https://www.w3.org/TR/annotation-model/
- https://github.com/hypothesis/client
- https://github.com/hypothesis/anchoring-test-tools

### IIIF

The IIIF Content State API communicates a particular view of a resource, such as a page region and rotation. A view state references a resource and region without becoming source identity or Working Picture placement. Catalyst likewise must separate representation identity, durable region anchor, reader view state, and occurrence geometry.

Reference: https://iiif.io/api/content-state/### OpenRefine, RO-Crate, and DataLad

OpenRefine separates operation specification, execution, output/change, and history. Undo is not provenance: it may branch or disappear while relied-upon derivation must remain inspectable. Catalyst needs durable events for material transformations, not permanent logging of moves, pans, zooms, folds, or restyles.

RO-Crate provides lightweight packaging of research artifacts, metadata, provenance, and authorship. DataLad combines dataset/version identity, content-addressed files, recorded origins, and reproducible commands. Catalyst should borrow boundary concepts, not make package hierarchies the cognitive surface.

References:
- https://openrefine.org/docs/
- https://www.researchobject.org/ro-crate/
- https://www.researchobject.org/workflow-run-crate/
- https://handbook.datalad.org/

## Provenance object grammar

### Source Identity

The durable intellectual/source object: report, article, web page, image set, recording, dataset, message collection, or physical-document surrogate.

It owns stable identity and descriptive/authorship/publication metadata. It does not own one path, URL, hash, canvas position, or reader location.

### Source Representation

An immutable representation actually consulted: specific PDF bytes, HTML snapshot, image rendition, audio file, OCR layer, dataset release, or email export.

It should retain representation ID, source ID, format, acquisition origin/time, digest where available, upstream version/identifier, relations to other representations, and availability/custody state. A changed page or replaced PDF is a new representation.### Source Region and selector bundle

A Source Region is a durable identity for a selected segment of one representation. It may be reused in many analytical contexts without copying identity. It owns representation identity, selectors as authored, capture-time preview/context, author/time, and resolution expectations. It is not automatically evidence for a proposition.

Selectors are complementary witnesses:
- PDF: page label/index, page-space geometry, quote with context, text offsets, extractor version.
- HTML: snapshot identity, DOM/range, text position, quote/context, fragment.
- Image: pixel/normalized geometry, dimensions/orientation, optional visual fingerprint.
- Audio/video: time interval, stream identity, transcript quote, keyframe context.
- Dataset: release, file/table, stable row key/predicate, range, query/normalization context.

Try deterministic/native selectors first and validate against independent witnesses before fuzzy fallback.

### Anchor Resolution Observation

Resolution is time-stamped and never overwrites the authored anchor. Suggested states:

- exact_validated: deterministic recovery agrees with another witness;
- exact_unvalidated: deterministic recovery lacks independent validation;
- recovered_high: fallback found one strongly supported match;
- recovered_ambiguous: multiple plausible matches;
- stale: representation exists but target does not resolve;
- unavailable: representation cannot currently be obtained;
- unsupported: resolver lacks format capability;
- invalidated: an authorized analyst marked the anchor unreliable.

Do not collapse these to one confidence percentage. Preserve reason and resolver/version.

### Transformation Event

Link input identities/versions, transformation specification, execution context, output identities, material software/method versions, and attributable authorship/approval. Manual edits after execution are later authorship events, not retroactive changes to the run.## Placement as cognition

Malone's desk studies show visible placement and piles support reminding and defer classification. Kirsh treats spatial rearrangement as epistemic action. VIKI/spatial hypertext preserves ambiguous emerging structure. LiquidText, MarginNote, Kosmik, and Zotero keep extracts navigably tied to sources. Scrivener's freeform corkboard keeps provisional spatial order distinct from committed document order.

Therefore a placed document, page stack, crop, or compact landmark is not decoration. Stable position, scale, overlap, neighborhood, and chosen portrayal can act as external working memory.

But placement is not source identity or truth. The same source may have multiple occurrences. A source may have none. An excerpt beside a hypothesis does not imply support.

Placement invariants:

1. Geometry belongs to occurrence and bounded picture.
2. Preview/crop/representation choice is occurrence portrayal.
3. Move/resize never changes provenance or semantics.
4. Automatic layout never overwrites authored geography.
5. Semantic zoom preserves landmark identity and neighborhood.
6. Reuse creates another occurrence of the same identity.
7. Fork creates a new identity with lineage.
8. Last-occurrence removal leaves an unplaced identity.
9. Reader view is Focus Context, not canvas position.
10. Export layout is another projection unless promoted.

## Return-to-source contract

Destination reconstruction must resolve source identity, select the captured representation, resolve selectors, disclose quality, open surrounding context, and retain captured preview for comparison. Opening a current upstream version is comparison, not exact return.Origin reconstruction requires a return token containing the originating picture, occurrence/identity, meaningful viewport neighborhood and scale, projection/lens and relevant filters, and navigation source.

Return restores an analytical place, not only coordinates. Reader Back/Forward and Context Back/Forward remain separate histories. If exact return fails, show the captured preview, candidate matches, and explicit status. Never jump silently to a lookalike.

## Typed detach/delete/purge semantics

| Command | Intended mutation | Must preserve |
| --- | --- | --- |
| Remove from this picture | one Occurrence | identity, region, provenance, other occurrences |
| Remove structural membership | one organization record | identity, provenance, semantics |
| Stop live embed/sync | current live binding | historical lineage and capture state |
| Detach rendered citation | active rendering/reference | attributable prior lineage |
| Mark anchor invalid | resolution state | authored selectors and explanation |
| Supersede representation | preferred current representation | earlier representation and anchors |
| Delete local bytes | one custodial copy | identity, hash/metadata, anchors, unavailable status |
| Archive identity | ordinary visibility | dependencies and historical resolution |
| Purge source/provenance | policy/security scope | only permitted tombstone/purge receipt |

Historical lineage is append-only in meaning even when current bindings change. Where policy requires erasure, Purge must preview dependencies, record authority/reason/scope, enumerate bytes/previews/caches/archives, and expose downstream consequences.

Reuse preserves identity and provenance. Fork creates identity plus lineage. External plain-text copy loses guaranteed Catalyst identity; re-import is a new capture unless an identity-bearing payload is deliberately used. Exports must state whether they include live links, citations, bytes, selectors, previews, or rendered prose only.## Adversarial stress cases

1. PDF replaced at same path: register a new representation; never retarget old anchors.
2. Web page edits: use captured snapshot plus redundant selectors; label recovery against newer content.
3. Repeated boilerplate: mark ambiguous and require human validation.
4. PDF extractor upgrade: retain page geometry/extractor version and replay fixtures.
5. OCR correction: preserve scan and OCR layer versions; keep image-region selector.
6. Crop exported as image: create new artifact plus transformation from parent region.
7. Same excerpt in three pictures: one identity, three occurrences, no corroboration inflation.
8. Analyst edits a quote: create transcription/paraphrase identity; preserve verbatim region.
9. Analyst unlinks after changing conclusions: stop current binding without erasing dependency history.
10. Local bytes deleted: mark unavailable; retain identity, hash, selectors, and permitted preview.
11. Legal/security purge: inventory all copies and visibly propagate downstream impact.
12. Automatic clustering: keep as derived lens; require explicit promotion to authored structure.
13. Source navigation branches: preserve separate reader and analytical return histories.
14. PDF, HTML, and scan of one work: one source identity, multiple immutable representations.
15. Dataset row selected by ordinal: retain version and stable key/predicate plus redundant ordinal.
16. Screenshot used as evidence: record capture event, origin/viewport/time, hash, and limits.

## Prototype acceptance tests

1. Register PDF Source Identity separately from Representation.
2. Capture region with page geometry plus quote/context.
3. Place region three times; verify one identity and three occurrences.
4. Move/restyle/group occurrences; verify zero provenance/semantic changes.
5. Return from each and restore its distinct analytical neighborhood.
6. Replace PDF at same path; verify new representation and no retargeting.
7. Recover against replacement; expose exact/recovered/ambiguous/unresolved rationale.
8. Summarize region; verify new identity and transformation/authorship event.9. Manually edit summary; show it is no longer untouched method output.
10. Stop live embedding; preserve historical lineage and capture.
11. Remove occurrence; preserve identity and other occurrences.
12. Delete local bytes; produce unavailable state, not erasure.
13. Export publication, archive, and interoperability packages; disclose retained content.
14. Purge a fixture; verify caches, previews, archives, and downstream effects.
15. Upgrade resolver; replay real anchor fixtures and flag target drift.
16. Place region near hypothesis; verify no relation is created.

Mutation tracing must fail if MoveOccurrence changes provenance; Reuse creates identity; Fork omits lineage; ResolveAnchor overwrites selectors; OpenSource persists truth; ReaderBack changes graph selection; ContextBack changes page; DetachLiveBinding deletes history; DeleteBytes deletes identity; DeleteOccurrence deletes identity; or Purge lacks resolved dependency scope.

## Decisions supported now

1. Source identity, representation, region, analytical identity, occurrence, structure, semantic relation, provenance event, and focus have independent lifecycles.
2. Exact anchors are representation-scoped selector bundles, never bare pages, URLs, paths, or offsets.
3. Resolution is an observation with explicit quality and never rewrites the anchor.
4. Return-to-source has destination reconstruction and origin restoration.
5. Placement is durable cognitive state at occurrence scope, never automatic truth.
6. Reuse preserves identity; fork creates identity plus lineage.
7. Provenance weakening requires a specifically named operation.
8. Source loss changes status rather than erasing lineage.
9. Undo, navigation, provenance, and reusable workflows remain distinct.
10. Publication, interoperability, and archive exports have distinct retention contracts.
11. Purge is governance/security, not ordinary unlink.
12. Real-artifact fixtures are required for provenance correctness.## Remaining questions

- Representation policy for mutable APIs, databases, feeds, and message streams.
- Minimum preview retained for sensitive sources.
- Selector bundles for EPUB, office files, email, GIS, and dynamic web apps.
- Whether Source Region is an Analytical Identity subtype or adjacent record species.
- Quiet visual grammar for reuse without false corroboration.
- User-facing names for stop-sync, detach-citation, invalidate, archive, delete-bytes, and purge.
- Custody/classification/redaction policy for hashes, previews, deleted content, and audit exports.
- Reconciliation of external persistent identifiers with local hashes.
- Resolver migration rules that improve recovery without changing authored anchors.

Resolve these through narrow prototypes, threat modeling, and format-specific fixtures, not generic canvas-product surveying.

## Recommendation

Amend the Working Picture Architecture Contract with explicit Source Representation and Source Region species; immutable authored selector bundles plus resolution observations; both halves of return-to-source; typed detach/delete/purge commands; availability/custody state; provenance-aware export profiles; and resolver-versioned fixtures.

Do not make documents children of a hidden root, store canonical canvas positions on sources, or make provenance depend on a visible connector. Do not let crops become orphaned pictures. Never treat a fuzzy match, URL, or filename as proof of the originally consulted representation.

The user-facing ideal remains simple: capture with little ceremony; place material where it helps thinking; quietly recognize reuse; open exact context in one action; and return without losing the analytical place. Rigor should appear progressively through trace, diagnostics, export, and lifecycle actions.

## Internal sources

- PASS-2026-09-11-zotero-hands-on.md
- PASS-2026-09-11-forward-research-hypothesis-anchoring.md
- PASS-2026-09-11-forward-research-openrefine-provenance.md
- PASS-2026-09-11-cognitive-workspace-architecture.md
- PASS-2026-09-11-architecture-synthesis-identity-placement-provenance.md
- PASS-2026-09-11-architecture-state-ownership-destruction-projections.md
- WORKING_PICTURE_ARCHITECTURE_CONTRACT_2026-09-11.md

## External primary/authoritative sources

- W3C Web Annotation Data Model — https://www.w3.org/TR/annotation-model/
- Hypothesis client — https://github.com/hypothesis/client
- Hypothesis anchoring tests — https://github.com/hypothesis/anchoring-test-tools
- IIIF Content State API — https://iiif.io/api/content-state/
- OpenRefine documentation — https://openrefine.org/docs/
- RO-Crate — https://www.researchobject.org/ro-crate/
- Workflow Run RO-Crate — https://www.researchobject.org/workflow-run-crate/
- DataLad Handbook — https://handbook.datalad.org/
- Kirsh, The Intelligent Use of Space — https://doi.org/10.1016/0004-3702(94)00017-U
- Malone, How Do People Organize Their Desks? — https://doi.org/10.1145/357423.357430
- Shipman/Marshall spatial hypertext — https://people.engr.tamu.edu/shipman/viki/papers/tochi/tochi.html

## Status and handoff

Complete enough for overnight coordinator integration. No implementation is authorized. A successor should read this file and the coordination file, then investigate only a bounded unresolved mechanism. Broad provenance-product surveying is not warranted without a concrete gap.