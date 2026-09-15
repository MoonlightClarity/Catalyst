# UI tooling scout — 2026-09-11

## Why this pass exists

The cognitive-architecture research has reached a point where implementation cost may be materially changed by modern UI/toolkit capabilities that were not assumed in the original Catalyst plan.

The goal is not to find a generic prettier framework. It is to identify mature primitives that can support the bounded analytical-desk model without forcing Catalyst back into a generic graph/whiteboard application.

## Strong candidate: tldraw SDK

Current tldraw SDK capabilities materially overlap the infrastructure Catalyst would otherwise need to build:

- React/TypeScript canvas foundation;
- custom shapes, tools, bindings, and UI components;
- selection, transformation, nested transforms, hit testing;
- drag/drop, alignment/distribution, ordering;
- undo/redo and reactive state/store;
- camera/navigation control;
- images/media and arbitrary browser-renderable content;
- ability to replace/substantially customize default whiteboard UI.

Potential Catalyst use: treat tldraw as a low-level spatial interaction/runtime layer, not as the product metaphor. Catalyst would supply its own bounded-picture navigation, source landmarks, piles/territories/branches, portrayal system, and near-zero chrome.
## Strong candidate: Lector

Lector is an MIT-licensed React 19+/TypeScript PDF toolkit powered by PDF.js and designed around composable viewer primitives rather than a fixed document application shell.

Relevant capabilities:

- virtualized PDF pages;
- canvas and text rendering layers;
- text selection;
- search, highlights, annotations;
- panning and zooming;
- component-level composition suitable for embedding into a Catalyst-specific focused source representation.

Potential Catalyst use: build `Open Source` as a Catalyst representation around document primitives rather than embedding another application's full toolbar/sidebar model.

## Focused helper candidate: react-pdf-selection

This MIT library adds text and rectangular area selection on top of PDF.js, stores selection positions independently of the current viewport, and exposes image/position data for area selections.

That is close to Catalyst's required anchored-crop primitive: source coordinate → captured visual region → persistent landmark → exact source recovery.
## Constraints before adoption

Do not adopt any candidate merely because it accelerates rendering.

Evaluate:

- license compatibility with Catalyst's non-proprietary intent;
- ability to work fully local/offline;
- whether default infinite-canvas assumptions can be constrained into bounded Working Pictures;
- whether coordinates/occurrences can remain portrayal state separate from analytical identity;
- whether Catalyst can suppress default whiteboard chrome and semantics;
- exact support for DOM/native source landmarks, source crops, custom hit targets, local controls, and semantic zoom;
- performance with mixed PDF/image/text objects;
- accessibility/keyboard behavior;
- Tauri compatibility and bundle cost;
- how much internal state would become coupled to a third-party scene model.

## Immediate recommendation

Before hand-building another canvas or reader, run a disposable feasibility spike combining one custom Catalyst source landmark on tldraw with one Lector/PDF.js source representation and a captured rectangular region returned to the same spatial position.

The spike should persist no production analytical schema and should be judged only against the interaction-spine acceptance loop.

If the toolkit fights boundedness, exact return, source identity, or low-chrome interaction, discard it early. If it handles those mechanics cleanly, Catalyst can focus engineering effort on the analytical model and portrayal rather than commodity spatial-editor infrastructure.