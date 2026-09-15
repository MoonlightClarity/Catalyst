# Architecture pass — state ownership, destructive semantics, and projections — 2026-09-11

Status: architecture research/synthesis only. No Catalyst GUI manipulation and no product code changed.

## Purpose

Turn the six-way Working Picture separation into an implementation-independent ownership contract. The goal is to make it difficult for a later prototype or schema to accidentally recombine identity, placement, structure, semantic relation, provenance, and focus through ambiguous move/delete/reparent/open behavior.

## State-ownership matrix

| State species | Natural scope | Owns | Must not own by default |
| --- | --- | --- | --- |
| Analytical Identity | globally durable analytical record | durable object identity, authored content/type where applicable, object-level history | canonical canvas coordinates, one required parent, local fold/visibility |
| Occurrence / Placement | one Working Picture or bounded portrayal context | geometry, local representation, crop/preview, z-order, local visibility/emphasis, local authored portrayal override | semantic truth, global classification, source origin |
| Structure Membership | analytical-context scoped | pile/territory/sequence/branch/subpicture membership and local organizational ordering | causal/evidentiary truth, source provenance, canonical object position |
| Semantic Relation | identity scoped unless explicitly occurrence-specific | typed analytical assertion, endpoints, attribution/status/method metadata | connector routing, visual proximity, branch parentage |
| Provenance | source/version/transformation scoped | source identity, representation/version, selector bundle, resolution quality, derivation/transformation events | visual placement, current focus, truth/confidence by implication |
| Focus Context | session + active context | focal occurrence/identity, viewport, scale, lens/projection, temporary folds/filters, return stack | analytical truth, durable structure, evidence status |

A deliberately saved viewpoint is authored state promoted from Focus Context. It may reference a picture, focal object, viewport and lens, but remains navigation/presentation state rather than an analytical assertion.

## Core ownership law

An interaction mutates the state species named by the analyst's action. Cross-species mutation requires an explicit compound command or promotion step whose semantic consequence is visible before commit.

This means `move`, `group`, `relate`, `extract`, `derive`, `open`, `delete occurrence`, and `delete object` are not aliases with different presentation. They are different operations because they own different state.
## Destructive-operation semantics

### Delete an occurrence

Default meaning: remove one portrayal from one bounded context. Preserve the underlying Analytical Identity, its provenance, semantic relations, and other occurrences.

If this is the last occurrence, the identity may become currently unplaced. That is legitimate state, not an error and not permission to garbage-collect the object.

### Delete an analytical identity

This is a materially stronger operation. The system should first surface dependent occurrences, semantic relations, derived identities/provenance, structural memberships, saved viewpoints, and method outputs that reference it.

Default architectural behavior should avoid silent cascading deletion. Prefer explicit resolution of dependents and, where audit/history requires it, a tombstoned identity that preserves references while marking the object deleted/unavailable.

### Remove structural membership

Detach the selected membership only. Preserve identity, occurrence geometry where meaningful, semantic relations, and provenance. Removing an item from a pile/branch/subpicture must not mean deleting the item.

If the structure itself is deleted, member identities survive. Context-local occurrences may either remain in the parent picture or be removed as portrayals according to an explicit structure-deletion command; neither path may silently delete the identities.

### Delete a connector portrayal

Remove the visible line/routing/binding only. If it portrays an explicit Semantic Relation, the relation survives and becomes currently unportrayed in that context.

### Delete a semantic relation

Remove the analytical assertion, not its endpoint identities. Any connector portrayals that derive their meaning from that relation must no longer remain visually indistinguishable from an asserted relation. The safe default is to remove those portrayals; an explicit conversion may preserve one as a provisional non-semantic connector.
### Remove or invalidate provenance

Moving, copying, reusing, exporting, or restyling an object must never detach provenance. Provenance weakening is a high-commitment action and should be explicit.

For source-derived identities, loss of source availability should normally change provenance resolution status (`exact`, `recovered`, `stale`, `unavailable`, etc.) rather than erase the provenance record. Deleting a local source artifact is therefore different from deleting the knowledge that an analytical object came from that artifact/version.

Where legal/security requirements demand actual purge, purge is a separate lifecycle operation with documented consequences for dependent anchors, derived identities, archives, and auditability.

### Reset focus / close a view

Discard or replace Focus Context only. It must not move occurrences, alter branch membership, delete analytical objects, or rewrite source history. Session recovery state may be pruned without analytical loss.

### Undo is not provenance deletion

OpenRefine reinforces that editor undo/redo, reproducible transformation history, and durable provenance have different retention semantics. Undoing an authoring action may reverse a current state change, but relied-upon provenance/history must not exist only in a disposable UI undo stack.

## Projection semantics

A projection is allowed to expose and edit selected state species without becoming a new ontology.

| Projection | Primary species portrayed | Normal editable state | Forbidden implication |
| --- | --- | --- | --- |
| Working Picture | Occurrence + context Structure, selected Relations/Provenance | geometry, local portrayal, provisional grouping, explicit promotion/assertion | proximity or geometry = semantic truth |
| Mind map / outline | Structure Membership, optionally selected Semantic Relations | explicit branch/order membership; deliberate relation actions | every identity needs a tree parent; reparent = causal/support relation |
| Source reader / Quick Look | Source Identity + Source Anchor + Focus | selection, capture/extract, annotation, source navigation | opening/reading = evidence assertion |
| Document/editor | Analytical Identity content + provenance indicators | authored content of the identity | local editor layout = Working Picture placement |
| Semantic graph | Semantic Relations + identities | explicit relation creation/editing when enabled | graph coordinates = authored analytical geography |
| Timeline / matrix / query lens | selected identity/semantic fields + derived ordering | field/relation edits only when explicitly supported | derived ordering/grouping silently becomes Structure Membership |
| Saved View | Focus/portrayal reference | named restoration parameters | saved viewport = analytical conclusion |
## Projection-editing rule

Changing projection must not convert records. The same identity may be shown as a source landmark, outline entry, graph node, timeline event, or editor document without duplication.

Edits made in a projection should target the species that projection explicitly exposes. Examples:
- dragging a Working Picture occurrence changes occurrence geometry;
- reordering an outline changes structural order only when the outline is in an editable structural mode;
- dragging a graph node changes graph-view layout unless the command explicitly says it is moving a Working Picture occurrence;
- selecting a source span creates an ephemeral anchor until capture/promotion;
- invoking `supports` from any projection creates the same identity-level Semantic Relation;
- changing a query/lens does not mutate the base analytical record.

## Same identity, different local roles

A reused identity can be in a pile in Picture A, a branch in Picture B, unstructured in Picture C, and visible in a semantic graph because of explicit relations. Those are not contradictions because the organizational structures are context scoped while identity and semantic relations remain durable.

The UI should make reuse inspectable without making every occurrence visually loud. A quiet reuse indicator or inspectable occurrence count is preferable to treating repeated appearances as independent corroboration.

## Subpicture rule

A subpicture is a bounded portrayal/organizational context with its own occurrences and local structure. Entering it changes Focus Context. Reusing an identity inside it creates another occurrence, not a clone. Returning should restore the parent occurrence, viewport neighborhood, projection/lens and relevant local fold/filter state.

A parent portal may be a live preview, snapshot, or abstract landmark; that portrayal choice must not change the child's analytical identity set or structure merely by refreshing the preview.

## Architectural consequence

The storage implementation may choose tables, documents, event records, or another form, but it must be able to express these independent lifecycles. A schema that requires cascade deletion from occurrence to identity, one parent per identity, one coordinate per identity, or one universal edge type is incompatible with the researched Working Picture model.
