# Catalyst Map Projection Ontology v0.1

Status: **Frozen conceptual contract — 2026-09-14; product-scope references amended by ADR 0026 on 2026-09-15**

Companion decisions: `adr/0021-outline-structural-projection-ontology.md` and `adr/0023-map-projection-ontology.md`

## Purpose

This document defines what Catalyst's generated Map is allowed to mean. It freezes the boundary between authored Outline structure, analytical relationships, reasoning, provenance, methodology, and visual portrayal.

The Map does not introduce a second analytical ontology. It is a deterministic projection over already-authored Catalyst objects.

This is a conceptual freeze, not a claim that the current 0.6.x compatibility model implements every object or rule below.

## Governing rule

> **The Outline authors structure; analytical objects author meaning; the Map portrays both without manufacturing either.**

Map geometry, routing, visibility, icon placement, emphasis, and layer state are portrayal. They must never silently become analytical assertions.

## Governing dependencies

The Map ontology inherits rather than replaces:

- `outline-ontology-v0.1.md` for structural identity and placement;
- `annotation-semantic-ontology-v0.1.md` for source/analyst semantics, relationship families, inference, provenance, and evidence;
- technique contracts for method/run semantics. Formal Assessment is outside Catalyst product scope under ADR 0026.
## Frozen projection layers

The Map may portray five logically separate layers:

1. **Structure** — canonical authored Outline placement and parent/order.
2. **Relationships** — explicit analytical/world relations over analytical identities.
3. **Reasoning** — inference, conflict, preference, qualification, and other reasoning objects.
4. **Sources** — provenance, evidence traces, source anchors, and lineage.
5. **Methods** — TechniqueRun references or method-derived overlays.

These layers may share one visual field, but they are not one edge system.

Only **Structure** controls canonical node placement.

Relationship, reasoning, provenance, and method overlays may route around or between structural placements, but they must not alter structural parentage, sibling order, depth, or analytical identity.

A layout engine may use non-structural edges for routing aesthetics, but never as rank/parent constraints.

This follows the same conceptual distinction Graphviz exposes with non-ranking edges (`constraint=false`): an edge can be visible without governing hierarchy.
## Structural projection contract

The Map inherits the frozen Outline vocabulary unchanged:

- one structural `RootItem` per canonical Outline;
- `ReferenceItem` for a placement of one AnalyticalItem;
- `GroupItem` for structural-only headings/containers;
- `QueryItem` for computed outline projections.

The Map must not replace these with a separate `MapNode` hierarchy.

An AnalyticalItem may have multiple ReferenceItems. Aliases share analytical identity but not structural descendants. The same AnalyticalItem may not recur twice on one root-to-leaf path.

`RootItem`, `GroupItem`, and `QueryItem` are not analytical identities and cannot become endpoints of analytical relationships merely because the Map displays them.

Query results are not canonical Map structure by default. A QueryItem may be portrayed as an overlay, but its virtual results affect canonical structure only after explicit materialization into ReferenceItems.

Direct parenthood and sibling order are stored structural facts. Depth, ancestry, descendants, branch extents, coordinates, dimensions, routes, zoom, and viewport are derived or view state.
## Analytical relationship projection

Analytical relationships address analytical identities, never structural placements.

The Map must preserve the relation families defined by the semantic ontology rather than flattening them into one generic connector vocabulary:

- reasoning/evidential relations;
- semantic/world relations;
- provenance relations.

Multiple analytical assertions between the same pair of analytical identities are conceptually valid when they differ in relation, attribution, provenance, time, status, or analytical context. The current alpha's one-relationship-per-pair restriction is compatibility scaffolding, not the frozen ontology.

Where aliases create several visible placements for one relationship endpoint, the relationship itself remains singular. The renderer may bind it to one visible placement using saved view state or a deterministic non-semantic rule.

Changing that rendering binding must never duplicate, retarget, or edit the underlying relationship.

Inverse display labels may be derived where a relation vocabulary defines them; the Map should not materialize a second authored relationship merely to render an inverse phrase.
## Reasoning projection

Reasoning must not be reduced to ordinary pairwise semantic edges when the reasoning object has its own identity or arity.

Catalyst must be able to portray at least:

- one-or-more premises feeding an inference;
- an inference producing a conclusion;
- conflict among two-or-more claims or reasoning objects;
- preference/evaluation among alternatives where the reasoning model supports it;
- reasoning about other reasoning objects when explicitly authored.

A visible junction or reasoning marker is a portrayal of the underlying reasoning object, not a new analytical claim created by the renderer.

The Map may simplify a reasoning structure at low detail, but expansion must recover the authored participants and direction without semantic loss.

This follows AIF's useful distinction between information nodes and inference/conflict/preference scheme applications: the explanation for a reasoning connection is itself representable rather than hidden inside an unexplained line.
## Provenance and source projection

Source anchoring remains source-owned semantics. The Map portrays traceability; it does not redefine evidence.

A source trace should preserve the chain from analytical object or reasoning object to the relevant source item/anchor and source identity. Exact source segments should use anchored selectors rather than only a page number when the source model supports them.

The Web Annotation pattern is the preferred interoperability precedent: a SpecificResource identifies a source plus one or more selectors for the relevant segment. Multiple selectors may describe the same segment to improve recovery robustness.

Simple provenance may render as a compact trace. Qualified provenance may expose derivation, attribution, revision, activity, or source-anchor details when requested.

PROV-O's simple-versus-qualified relation pattern is the reference model: common cases stay compact while richer lineage remains representable.

Provenance means lineage, not truth, credibility, corroboration, or analyst endorsement.
## Time and history

The Map must distinguish subject/effective time from Catalyst record history whenever temporal semantics are available.

`createdAt` / `updatedAt` describe Catalyst lifecycle. They must not be interpreted as the time at which a portrayed world relationship was true.

A relationship or analytical assertion may therefore carry an optional valid/effective interval independently of its creation or revision history.

Temporal cycles are not automatically errors. Only contradictions defined by the underlying temporal relation semantics should be flagged.

## Validation model

Map validation uses three user-facing severities:

- **Error** — representation would violate a frozen invariant or leave a mandatory reference unusable;
- **Warning** — suspicious or probably unintended analytical construction that remains representable;
- **Info** — incomplete, weakly specified, or potentially improvable state.

This follows SHACL's separation of violation, warning, and informational validation results without requiring Catalyst to adopt RDF/SHACL internally.
### Hard errors

Hard errors should remain narrow:

- structural Outline cycle;
- missing/multiple structural root;
- static non-root item with no structural parent;
- same AnalyticalItem recurring on one root-to-leaf path;
- dangling mandatory analytical or structural reference;
- analytical relation targeting structural-only RootItem/GroupItem/QueryItem identity;
- reasoning object below its minimum participant cardinality;
- malformed temporal interval where an explicit end precedes its explicit start;
- corrupted identity that prevents deterministic projection.

### Warnings / information

The Map should allow but may flag:

- apparently duplicate analytical assertions;
- explicit self-relations where the relation vocabulary does not forbid them;
- mutually opposing or contradictory assertions;
- circular influence/dependency relations where the domain permits them;
- analytical assertions without provenance;
- judgments with weak or missing supporting rationale;
- unresolved hypotheses/questions/gaps;
- custom relations with unclear labels;
- hidden/off-map relationship endpoints.

Conflicting information is analytical content, not corrupt data.
## Lifecycle and deletion boundary

Deletion is a lifecycle operation, not a Map relation.

Removing a ReferenceItem removes one structural placement only. It must not delete the underlying AnalyticalItem, relationships, reasoning, provenance, analytical judgment/evaluation state, technique history, or other aliases.

Archiving/deleting an AnalyticalItem is a separate explicit domain operation. Before destructive removal, Catalyst must expose or safely handle affected placements and references.

Historical provenance or reasoning must not disappear silently because one currently visible record was deleted. Implementations may use archival state, tombstones, detached references, explicit cascade review, or another recoverable lifecycle mechanism, but silent analytical-history erasure is forbidden.

The Map may hide archived/deleted objects by default while still indicating broken/archived lineage when that lineage matters to visible analysis.

## Layer visibility contract

User-facing layer controls should project ontology rather than invent it:

- Structure
- Relations
- Reasoning
- Sources
- Methods

Turning a layer off changes portrayal only. It must never delete or demote the underlying analytical content.

The default Map may emphasize Structure and selectively reveal other layers to control cognitive load.
## Adversarial break-test results

The frozen model was tested against failure cases rather than ordinary examples:

| Case | Required behavior | Result |
| --- | --- | --- |
| One AnalyticalItem placed in two branches | Two ReferenceItems, one analytical identity | Representable |
| Same AnalyticalItem repeated on one ancestor path | Reject structural recurrence | Representable by invariant |
| Relationship endpoint has several visible aliases | Bind portrayal to one placement without duplicating relation | Representable |
| A influences B and B influences A | Allow analytical cycle; do not alter hierarchy | Representable |
| Two sources assert incompatible claims | Preserve both assertions/provenance | Representable |
| Three premises jointly support one conclusion | Use a reasoning object/junction, not three fake pairwise claims | Representable |
| Reasoning object itself is challenged | Target reasoning identity where domain supports it | Representable |
| Relationship changes over time | Keep effective/valid time separate from record timestamps | Representable |
| Source document revised or relocated | Preserve source identity/anchor lineage and revision provenance | Representable |
| Visible placement deleted | Remove placement only; analytical object survives | Representable |
| Analytical object archived/deleted while cited | Lifecycle policy preserves/reviews dependent history | Representable |
| Query result appears/disappears | No canonical structural mutation unless materialized | Representable |
| Group heading looks analytically meaningful | Remains structural until explicit promotion | Representable |
| Map layer hidden | Underlying data survives unchanged | Representable |
| Contradictory judgment/evaluation or relation | Preserve conflict; flag if useful, never auto-delete | Representable |

No adversarial case required a new Map-specific analytical object class.
## Corrections made during adversarial review

Two draft assumptions were rejected because they conflict with the already-frozen Outline ontology:

1. **One structural appearance per AnalyticalItem** is wrong. Aliases are legitimate: one AnalyticalItem may have multiple ReferenceItems, provided the same item does not recur on one ancestor path.
2. **The structural root as an AnalyticalItem** is wrong. The canonical root remains a structural `RootItem`; analytical relationships cannot target it merely because it is visible.

The adversarial pass also rejected the idea that this Map document should define a new compact relationship vocabulary. Relationship meaning remains governed by the frozen annotation/semantic ontology; the Map only projects those meanings.

## Frozen design laws

> **The Map is a projection, not a second source of analytical truth.**

> **Only authored Outline structure controls canonical Map layout.**

> **Analytical relations address analytical identities, never placements.**

> **Aliases may change portrayal without multiplying analytical assertions.**

> **Reasoning objects remain reasoning objects; they are not flattened into unexplained pairwise edges.**

> **Provenance shows lineage, not truth or credibility.**

> **Hiding a layer changes visibility, not data.**

> **Conflicting analytical content is valid content unless a specific domain constraint says otherwise.**

> **Deletion must not silently rewrite analytical history.**
## Research basis

The freeze synthesizes several standards and established models without requiring Catalyst to serialize internally as RDF or any external graph format:

- W3C SKOS: direct hierarchy, transitive ancestry, and associative relation are distinct; direct authored structure should remain distinguishable from inferred/query structure.
- W3C Web Annotation: source segments are modeled through source + selector rather than by collapsing source identity and annotation location.
- W3C PROV-O: provenance relations may be simple or qualified with additional derivation/activity detail.
- Argument Interchange Format (AIF): information content is distinct from inference, conflict, and preference applications; reasoning relations may have arity beyond a single pairwise edge.
- W3C SHACL: validation severity can distinguish violations from warnings and informational results.
- Graphviz: visible edges can be excluded from hierarchy/rank constraints, supporting the Map rule that non-structural overlays do not govern layout.

Starting points:

- https://www.w3.org/TR/skos-reference/
- https://www.w3.org/TR/annotation-model/
- https://www.w3.org/TR/prov-o/
- https://www.w3.org/TR/shacl/
- https://www.mit.edu/~irahwan/docs/KER2006.pdf
- https://graphviz.org/docs/attrs/constraint/

## Freeze rule

This conceptual Map projection ontology is frozen as of 2026-09-14.

Do not add Map-owned analytical node/edge species, infer analytical meaning from geometry, allow semantic overlays to rewrite structural hierarchy, flatten multi-part reasoning into unexplained pairwise links, or collapse source lineage into ordinary relationships merely to simplify implementation.

Reopening the ontology requires a concrete representational failure: a real Catalyst workflow that cannot be represented without violating these invariants, a contradiction with another accepted conceptual contract, or a superseding ADR.

Visual dissatisfaction, desire for more icons, implementation convenience, layout-library limitations, or requests for another connector style are insufficient reasons to reopen the ontology.

Exact TypeScript names, XML serialization, routing algorithms, layer-control placement, iconography, and animation may evolve without reopening this freeze as long as the semantic boundaries above remain intact.

