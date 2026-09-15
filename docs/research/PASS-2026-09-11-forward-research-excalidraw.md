# Forward comparator pass — Excalidraw — 2026-09-11

Status: source/documentation research only; no Catalyst GUI manipulation or product code.

## Why Excalidraw is a distinct comparator

Excalidraw is useful because it makes authored geometry the primary content of a scene while still representing grouping, frame membership, bindings, text containment, files, and application state explicitly.

The current upstream package release is v0.18.1, a security-patch release after v0.18.0. Development continues on master and the package can also be consumed through prerelease builds.

Sources:
- https://github.com/excalidraw/excalidraw/releases
- https://github.com/excalidraw/excalidraw/blob/master/dev-docs/docs/codebase/json-schema.mdx
- https://github.com/excalidraw/excalidraw

## Mechanism 1 — scene state is explicit and portable

An `.excalidraw` file is plaintext JSON with a versioned schema containing `elements`, `appState`, and `files`.

Individual elements carry stable IDs plus geometry and interaction-relevant state. This is a strong precedent for treating authored placement as durable document state rather than ephemeral renderer output.

Catalyst implication: Working Picture occurrence geometry should be serializable, inspectable, versionable state. It should not have to be reconstructed from semantic links or auto-layout each time a picture opens.

## Mechanism 2 — grouping, framing, and binding are not the same thing

Excalidraw elements expose separate fields for `groupIds`, `frameId`, and connector/bound-element relationships. Text attached to a shape or arrow is also represented as its own element linked back to a container.

That separation is important. A group says elements should behave as a selection/manipulation unit. A frame says an element belongs to a spatial frame/context. A binding says a connector or label is attached to another element. These are mechanically different relationships even though all can look like "things connected on a canvas."

Catalyst should preserve an even stronger separation:
- occurrence geometry;
- provisional spatial grouping;
- explicit organizational membership;
- connector attachment/portrayal behavior;
- analytical semantic relation;
- provenance/source relation.

The last two must not be encoded merely by reusing a generic drawing-tool binding primitive.

## Mechanism 3 — collaboration/version metadata lives with scene elements

Excalidraw elements include `version` and `versionNonce`; project maintainers have documented these as reconciliation aids for collaborative/server-saving behavior. Elements also carry `updated` and soft-deletion state.

Catalyst does not need to copy this exact collaboration scheme, but it reinforces a useful boundary: edit/concurrency metadata belongs to the persistence layer and should not be confused with analytical confidence, source chronology, or evidentiary status.

Those are different temporal/semantic dimensions even if all are represented as timestamps or versions.

## Mechanism 4 — connectors are physical bindings, not claims

Arrow/line elements can bind their start or end to a target element by ID with geometric focus/gap information. Target elements may also record bound elements.

This is excellent interaction machinery for keeping a connector visually attached while objects move. It is not, by itself, an analytical relationship model.

Catalyst can adopt the rendering concept: a semantic relationship may have one or more connector portrayals whose endpoints follow occurrences. But the semantic relation should exist independently of the connector geometry, so hiding, rerouting, or deleting a portrayal does not erase analytical truth unless the user explicitly deletes the relation itself.

## What Catalyst should inherit

1. Durable serialized geometry for authored spatial occurrences.
2. Stable element/occurrence IDs independent of visible labels.
3. Separate data structures for grouping, framing/context, attachment, and ordering.
4. Connector geometry that follows moved objects without making geometry the source of semantic truth.
5. A documented, inspectable scene format rather than opaque renderer-only state.

## What Catalyst should not inherit

1. A scene-element model as the analytical ontology.
2. Generic arrows as the canonical storage for support/refute/causal/provenance relations.
3. Group membership as a substitute for analytical structure.
4. Infinite-canvas scale as the only navigation/scoping mechanism.
5. Treating text labels and shapes as sufficient identity for source/evidence objects.

## Net architectural effect

Excalidraw strengthens the idea that Working Picture portrayal should have its own first-class persistence layer. Geometry, z-order, visual grouping, connector routing, and frame membership are real authored state, but they are portrayal state.

Catalyst should therefore be able to delete or rearrange a connector portrayal without necessarily deleting the underlying semantic relation, and to move an occurrence between frames/subpictures without mutating the analytical identity it portrays.

This is the cleanest current FOSS evidence so far for separating **semantic graph state from scene graph state**.

## Next bounded comparator

Next: Zettlr, specifically to stress file-first/open-format scholarship, citation/reference integration, project/workspace boundaries, writing-vs-analysis transitions, and what a deliberately document-centric FOSS system gets right that Catalyst should preserve even while moving beyond document-centric UI.
