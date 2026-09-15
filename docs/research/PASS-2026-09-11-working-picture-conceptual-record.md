# Working Picture conceptual record — architecture research — 2026-09-11

Status: conceptual architecture only; no product code and no GUI manipulation.

## Purpose

Define the smallest record/operation model that preserves the distinctions established by Freeplane, Zotero, Trilium, AFFiNE, Logseq, Excalidraw, and prior Catalyst cognitive-architecture research.

This is deliberately not a database schema. Names are conceptual species whose persistence representation remains open.

## 1. Analytical Identity

A durable thing the analyst can refer to across contexts.

Examples: source document, source region/excerpt, observation, question, proposition, hypothesis, entity, analyst note, method artifact, bounded subpicture identity.

Identity owns truth-bearing/content state that should remain coherent when the same thing is shown in multiple places.

Identity does **not** inherently own one global X/Y position, one parent, or one current visual representation.

## 2. Occurrence

A located portrayal/use of an Analytical Identity within a particular bounded context or projection.

Occurrence may own authored geometry, local representation form, crop/preview choice, local visibility, local emphasis, and local fold/detail state.

An identity can have zero, one, or many occurrences. Deleting one occurrence does not normally delete the identity.

## 3. Structure Membership

An authored organizational commitment that says an identity or occurrence participates in a bounded composition.

Examples: pile membership, ordered sequence, outline branch, dossier, subpicture membership, explicit container membership.

Structure may have order and nesting, but it is not automatically an analytical assertion.

A visual enclosure can exist without Structure Membership when the analyst is only using space provisionally.

## 4. Semantic Relation

An explicit analytical assertion connecting durable identities.

Examples: supports, contradicts, explains, derives-from, precedes, same-entity-as, caused-by, assumption-of.

A Semantic Relation may be portrayed by zero or more connectors. Its truth-bearing existence is not identical to those connector drawings.

## 5. Provenance Link

A durable source/derivation connection.

For source-grounded material, provenance must be able to preserve both source identity and an exact source anchor. For transformed analytical material, it may also record derivation from one or more other identities.

Provenance is inspectable and navigable. It should support a direct return to the originating source context where possible.

## 6. Focus Context

Ephemeral or session-restorable operating state: active bounded picture, focal occurrence/identity, local scale/viewport, active projection, filters, and return path.

Focus Context exists to preserve orientation. It is not evidence, structure, or semantic truth.

## Operation grammar

### Place
Create an Occurrence of an existing or newly created identity in the active Working Picture. This must not require parentage or semantic typing beyond what the identity itself genuinely needs.

### Reposition / resize / restyle locally
Mutate Occurrence portrayal state only. No structural or semantic side effect.

### Reuse
Create another Occurrence of the same identity in another location/context. Reuse should be inspectable from the identity so the analyst can see where it appears.

### Derive
Create a new Analytical Identity from existing material while preserving explicit provenance to the source identity/anchor. Summaries, interpretations, extracted observations, and transformed artifacts belong here when they are no longer merely the same object shown elsewhere.

### Group provisionally
Create a visual/spatial association that assists cognition but does not yet assert durable Structure Membership or a Semantic Relation.

### Promote to structure
Turn a provisional spatial association into explicit Structure Membership through a deliberate operation whose result is visible/inspectable.

### Assert relation
Create a Semantic Relation with an explicit predicate or method-defined meaning. Connector portrayal is optional and independently editable.

### Enter / return
Change Focus Context to a source, subpicture, occurrence, or projection while retaining a return token to the originating context.

## Scenario tests

### Source excerpt reused in two analyses
One source-region identity carries exact provenance. Two Working Pictures each contain an Occurrence of that identity with independent geometry. Editing the shared excerpt's content/metadata is coherent across occurrences; moving one does not move the other.

### Same evidence, different analytical roles
The same evidence identity may appear near Hypothesis A in one subpicture and Hypothesis B in another. Proximity alone asserts nothing. If the analyst decides it supports A but contradicts B, those are two explicit Semantic Relations between durable identities.

### Provisional pile promoted later
Several occurrences are spatially clustered. Initially this is only geometry/provisional association. Later the analyst names the cluster and promotes it to explicit Structure Membership. The promotion should not invent semantic predicates among members.

### Connector rerouting
A support relation exists between two identities. One Working Picture shows it as a visible connector; another omits it; a third routes it differently. Deleting the drawn connector portrayal must not erase the support relation unless the operation explicitly targets the relation itself.

### Deep source inspection
From a placed excerpt, the analyst enters the full source at the exact anchor, reads surrounding pages, and returns. Focus Context restores the originating Working Picture, occurrence, viewport neighborhood, and useful local state without creating or changing analytical structure.

## Implication for the earlier mind-map direction

Branch/mind-map structure remains valuable as an efficient authored structural projection, but the evidence does not support making mandatory tree parentage the ontology of all analytical material.

A mind-map/outline can be a first-class projection over explicit Structure Membership and selected Semantic Relations while Working Picture occurrences remain free to exist before or outside that structure.

This preserves mind-map legibility where hierarchy is genuinely useful without recreating Freeplane's hidden-parent problem for apparently free spatial material.
