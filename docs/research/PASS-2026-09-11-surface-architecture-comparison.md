# Surface architecture comparison — 2026-09-11

## Purpose

This pass compares competing analyst-facing surface architectures before any production Working Picture rewrite.

The criterion is not feature count or visual novelty. The question is which architecture best supports the cognitive sequence now established for Catalyst:

**capture → placement → provisional organization → explicit analytical structure → optional analytical interrogation → communicable product**.

Evaluation criteria:

- source/page/region continuity and exact return;
- low-commitment capture;
- usefulness of free spatial placement;
- stable spatial memory and reorientation;
- bounded cognitive scope;
- promotion from provisional to explicit structure;
- compatibility with disciplined provenance and analytical semantics;
- reading/inspection quality;
- scalability without destroying local geography;
- ability for application chrome to retreat from the analytical material.

## Candidate A — source reader + adjacent extraction canvas

Representative lineage: LiquidText, MarginNote, document-centric research workspaces.

The document remains continuously visible in a reader while excerpts and notes are pulled into an adjacent workspace.Strengths:

- unusually strong source-to-excerpt continuity;
- the document remains readable rather than collapsing into a thumbnail;
- extraction can be nearly gesture-level;
- exact source return is natural.

Weaknesses for Catalyst:

- the split often hardens into “source side” versus “thinking side”;
- source documents are contexts opened beside the workspace rather than persistent landmarks inside its geography;
- multiple sources compete for reader space;
- the workspace can still become an unbounded note/excerpt field;
- formal analytical structures tend to be generic links or mind-map relations.

Conclusion: preserve its source-continuity interaction, but do not make the permanent Reader/Canvas split the top-level Catalyst architecture.

## Candidate B — one infinite canvas as the home surface

Representative lineage: Obsidian Canvas, generic whiteboards, many visual PKM systems.

Everything can be placed on one extensible plane. Notes, media, web pages, groups, and links coexist spatially.

Strengths:

- maximum freedom and direct composition;
- easy mixed-media juxtaposition;
- low barrier to spatial grouping;
- simple mental model at small scale.Weaknesses for Catalyst:

- an unbounded plane eventually turns navigation into camera management;
- scale can make actual source material unreadable or visually generic;
- local neighborhoods accumulate until the user must invent their own scope discipline;
- zooming out can preserve geometry while destroying recognition;
- global linking encourages the workspace to drift back toward graph-editor behavior;
- density reduction often depends on hiding/filtering rather than preserving multiple meaningful local places.

Conclusion: keep direct spatial manipulation, but reject one infinite plane as the sole top-level representation.

## Candidate C — bounded/nested boards built from durable cards

Representative lineage: Allume/Muse, Heptabase, Milanote, Scrintal.

Knowledge objects are placed on finite-feeling or locally bounded boards; boards can link to or contain other boards. The same durable content can be reused across contexts.

Strengths:

- human-scale scope and natural subdivision;
- strong reorientation through recognizable local places;
- nested boards reduce pressure to keep everything visible at once;
- supports mixed media and provisional arrangement;
- especially compatible with the commitment-gradient model.

Weaknesses for Catalyst:

- most implementations normalize too much material into cards;
- source regions risk becoming quotations inside cards rather than recognizable evidence landmarks;
- board nesting can degrade into folder hierarchy with spatial decoration;
- connections are usually semantically weak or undifferentiated.Conclusion: this is the strongest existing product-level precedent for Catalyst's scope model, but Catalyst must preserve heterogeneous source/evidence forms instead of making the card the universal atom.

## Candidate D — focus-centered neighborhood / navigable graph

Representative lineage: TheBrain and other focus+neighborhood graph systems.

The user works around a selected focal object while nearby connected objects are shown; navigation changes the visible neighborhood rather than exposing the whole graph.

Strengths:

- excellent boundedness for very large connected records;
- navigation cost is lower than manually panning one enormous graph;
- local relevance can remain visible while the global network stays latent;
- useful as a projection for relationship exploration.

Weaknesses for Catalyst:

- spatial position is usually generated from connection topology rather than authored as cognitive state;
- source documents become nodes or destinations rather than persistent placed materials;
- provisional proximity is difficult because visible location already implies graph structure;
- changing focus changes the whole visible geography, weakening spatial memory.

Conclusion: retain focus-centered neighborhood navigation as a possible analytical projection, not as the Working Picture home surface.

## Candidate E — bounded analytical desk with placeable sources

This is the Catalyst synthesis rather than an existing product clone.

A Working Picture is a human-scale spatial place. Documents, pages, source regions, notes, observations, questions, and analytical constructs can remain materially distinct and spatially placed within it.Key properties:

- a source may be placed as a document/page/region landmark rather than represented only by a note card;
- deliberate Open/Focus can expand a placed source into a high-quality reading context without changing its identity;
- selected excerpts/regions return directly to their exact origin;
- loose placement, piles, overlap, whitespace, and territories are permitted before formal links exist;
- a local cluster can later be promoted to a branch, container, or subpicture without erasing its provenance or necessarily changing its geometry;
- Working Pictures can contain or lead to subpictures, providing bounded scope without pretending the analytical record itself is small;
- a low-commitment shelf/tray/pile can hold incoming material until the analyst decides whether and where it belongs;
- semantic analytical links remain latent until asserted or requested by a lens;
- alternate projections such as timeline, matrix, relationship neighborhood, and outline operate on the same analytical identities without replacing the desk.

Primary risk:

This hybrid can become more complex than every comparator if Catalyst exposes all of these capabilities simultaneously. Its success therefore depends on progressive disclosure and a very small default interaction vocabulary.

The home surface cannot advertise the entire domain model. The default visible vocabulary should be closer to **place, move, open, peek, group, branch, back/home**. Analytical typing and method controls should appear only when the user deliberately moves farther up the commitment ladder.

## Comparative matrix

| Criterion | A Reader + extraction | B Infinite canvas | C Nested boards/cards | D Focus graph | E Catalyst desk |
| --- | --- | --- | --- | --- | --- |
| Exact source continuity | Strong | Mixed | Mixed–strong | Weak | **Strong** |
| Low-commitment capture | Strong | Strong | Strong | Weak | **Strong** |
| Provisional spatial structure | Mixed | Strong | Strong | Weak | **Strong** |
| Stable spatial memory | Mixed | Strong locally / weak at scale | Strong | Weak–mixed | **Strong** || Bounded cognitive scope | Mixed | Weak | Strong | Strong | **Strong** |
| Promotion to explicit structure | Mixed | Mixed | Strong | Strong but link-first | **Strong** |
| Formal analytical semantics | Weak–mixed | Weak | Weak–mixed | Mixed | **Strong by design** |
| Reading quality | Strong | Mixed | Mixed | Weak | **Strong when opened** |
| Large-record scalability | Mixed | Weak without subdivision | Strong | Strong | **Strong via subpictures/projections** |
| Chrome can retreat | Mixed | Strong in simple canvases | Strong | Strong | **Required** |

The matrix is architectural, not a product-quality ranking. Each comparator solves a different problem well.

## Why E is not simply “a nested canvas”

Three differences are essential.

First, **documents are inhabitants of the analytical space**, not merely attachments that open elsewhere. The analyst can remember that a particular report, page, image crop, map, or table sits in a particular analytical neighborhood.

Second, **spatial organization is explicitly allowed to remain semantically incomplete**. The system distinguishes “these things are together on my desk” from “I assert a relationship among these things.” This follows spatial-hypertext and incremental-formalization research and is necessary for disciplined analysis.

Third, **formal analytical structure is an escalation, not the default rendering mode**. Evidence support/refute, provenance, uncertainty, alternatives, temporal relations, and method artifacts remain available, but the base desk does not force them all onto the screen.

## The staging layer is more important than it first appears

Gstell's 2026 CHI work provides contemporary evidence for an intermediate storage layer between chaotic open tabs and rigid hierarchy: pile-like short-term storage plus more structured long-term storage supported evolving relevance and emerging structure in a field experiment with 29 knowledge workers.

For Catalyst, a staging shelf is not an inbox feature bolted onto the sidebar. It is the first rung of the commitment ladder: material can arrive, stay visible enough to remind, and wait for context before the analyst assigns a durable analytical place.## Source opening should be a change of representation, not a trip to another app mode

The present Reader/Working-Picture separation is likely contributing to the regression in source placement.

The better model is one identity with scale/context-specific representations:

- **Desk representation:** recognizable document/page/region landmark in a stable place;
- **Peek representation:** enough local text/image context to recognize and compare without leaving the desk;
- **Open representation:** full reading/annotation surface optimized for sustained reading;
- **Return:** restores the exact Working Picture and prior spatial neighborhood.

This resembles semantic zoom conceptually, but opening a source should be deliberate and task-oriented rather than triggered merely by camera scale.

The source does not disappear from the Working Picture because the analyst opened it. The open reader is a focused representation of a placed analytical object.

## Recent spatial-document research changes the zoom requirement

CHI 2025 work on spatial document arrangement identified aggregation, distribution, transformation, inspection, and navigation as recurring operations and specifically derived spreading/compressing layouts as useful interactions.

SUI 2025 work on spatially stable document overviews found performance and reorientation benefits over a traditional document-navigation condition.

For Catalyst, this argues for **topology-preserving density transformations** rather than generic auto-layout. When space gets tight, a neighborhood may compress, stack, summarize, or become a representative landmark, but returning to the working scale should recover the analyst's recognizable geography.

## Relationship to nSpace and Analyst's Workspace

Earlier intelligence-oriented visual analytics systems demonstrate that a spatial workspace can integrate foraging and synthesis and that evidence can later be bound into explicit hypotheses. nSpace Sandbox is especially relevant because its spatial layout could come to resemble the analyst's mental model while evidence was later attached to explicit support/refute structures.Catalyst should inherit that progression while adding a still-lower-commitment stage. The analyst first places and rearranges material; only later, when useful, does an item enter an explicit inference/support/refute/provenance structure.

Analyst's Workspace reinforces another useful distinction: local operations can modify the current region or selection without forcing one global layout metaphor. Catalyst should likewise allow a local branch, pile, timeline-like strip, or other organization inside a Working Picture without making that geometry universal.

## Recommended surface architecture for prototype testing

The next prototype should therefore instantiate Candidate E with deliberate constraints:

- one bounded Working Picture visible at a time;
- source/document placement is first-class;
- one quiet staging edge for new/unplaced material;
- free placement before typing or linking;
- lightweight peek on ordinary selection;
- deliberate Open for sustained source reading;
- local grouping/branching without automatic semantic claims;
- subpicture entry with stable Back/Home return;
- no persistent Analysis/Evidence mode split on the home surface;
- no always-open inspector;
- no automatic global re-layout;
- no requirement to display every link, metadata field, or analytical state.

This prototype does not need final Catalyst styling or final portrayal symbols. Its job is to test whether the cognitive sequence itself feels natural with real documents and mixed analytical material.

## Decision boundary

If this bounded-desk architecture cannot support fast capture, spatial memory, source reading, and gradual formalization without exposing substantial chrome, it should be rejected before production work.

If it succeeds, the existing portrayal catalog becomes the representation layer inside this interaction architecture rather than the driver of the architecture.
## Runtime cross-check against the last Catalyst screenshots

The last runtime images make the architectural mismatch concrete.

1. The source document is visually dominant but lives in a separate left-side Reader. The analytical object created from/alongside it occupies a different world on the right; the document cannot itself participate in the Working Picture geography.
2. The right-side surface labels itself through application concepts (`GRAPH`, later `ANALYSIS`) before the user has established an analytical structure. The software is announcing its model rather than presenting the material.
3. Ordinary selection opens a large inspector that consumes roughly a quarter of the analytical side even when the selected thought has almost no content. The cost of inspecting exceeds the information gained.
4. The selected thought is represented primarily by an abstract Catalyst glyph plus `Untitled note`; its surrounding whitespace does not yet encode a useful analytical neighborhood.
5. Counts, tiny marginal labels, find/navigation strips, and persistent mode chrome accumulate around an otherwise nearly empty workspace. This confirms that visual sparsity alone does not produce cognitive simplicity.

Candidate E directly addresses these failures:

- the source becomes placeable analytical material;
- `GRAPH`/`ANALYSIS` cease to be home-surface modes;
- lightweight peek replaces automatic large inspector expansion;
- the first thought may simply be placed near relevant source material before it is typed or classified;
- the default surface can be mostly analytical material, with navigation/method controls revealed by context or command.

The boxed `E` visible in the Windows runtime remains a separate native-brand plumbing defect. It should not influence the cognitive architecture decision.