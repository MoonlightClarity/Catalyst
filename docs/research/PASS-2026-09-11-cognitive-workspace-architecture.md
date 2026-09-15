# Cognitive workspace architecture pass — 2026-09-11

## Question

The current blocker is not the number of controls in Catalyst by itself. It is the sequence of commitments the interface demands before the analyst has enough understanding to make them.

The research question for this pass is:

> What interaction architecture lets an analyst externalize, arrange, revisit, and gradually formalize source material and reasoning without prematurely forcing semantic structure?

This pass continues backward into desk/paper practice, hypertext, spatial cognition, and early workspace systems, and forward into current spatial research tools and recent HCI work.

## Strongest result

Catalyst should be designed around a **ladder of commitment**, not around a menu of analytical object types.

A useful progression is:

1. **Capture / land** — preserve something with almost no classification.
2. **Place** — use position, proximity, overlap, orientation, and stable location as provisional structure.
3. **Organize** — make groups, piles, territories, branches, or local containers explicit without asserting analytical meaning.
4. **Assert** — add a semantic relation, proposition, inference, assessment, or other claim only when the analyst is ready.
5. **Interrogate / portray** — turn on analytical lenses, methods, provenance, uncertainty, alternatives, time, or other disciplined overlays as needed.

The current UI exposes too much of levels 3–5 before levels 1–2 have had a chance to do cognitive work.
## Backward research: why informal placement matters

### Malone: desks are not just retrieval systems

Thomas Malone's 1983 study of office organization found that visible desk organization serves a reminding function as well as a filing/retrieval function. Loose piles are not merely failed folders; they can preserve active work, recency, and unresolved obligations when categorization is costly or premature.

Catalyst implication: an unresolved cluster of material must be allowed to remain an unresolved cluster. An analyst should not have to decide whether something is Evidence, Analysis, a Question, a Hypothesis, or a folder destination just to keep it visible and useful.

### Kirsh: spatial arrangement is part of thinking

David Kirsh's work on the intelligent use of space argues that arranging the workspace can simplify choice, perception, and internal computation. Moving things in the environment can be an epistemic action: the manipulation itself helps the person discover what they think.

Catalyst implication: drag, juxtapose, separate, stack, spread, and reorder are cognitive operations, not decoration. Stable placement is working memory distributed into the environment.

### VIKI / spatial hypertext: ambiguity can be productive

Marshall and Shipman's VIKI work explicitly targeted ambiguous, partial, and emerging structure. Spatial hypertext lets people express relationships through layout before they can or want to state formal links. Their later work on implicit structure showed that systems may recognize patterns in human-arranged layouts, but that recognition should remain interaction-guided.

Catalyst implication: proximity may suggest a relationship, but it must not silently become an analytical assertion. The system may offer a formalization; it must not manufacture one.
### Incremental formalization: the missing interaction model

Shipman and McCall's incremental-formalization work addresses a core Catalyst problem directly: computers benefit from formal representations, but users often cannot provide them at the moment information first enters the system. A useful system therefore captures informal material first and supports movement toward formality later.

This is a stronger model than asking the analyst to choose the correct type at creation time. Catalyst should preserve the path from informal placement to explicit analytical structure, including the intermediate states.

### Cognitive Dimensions: avoid premature commitment and viscosity

The Cognitive Dimensions framework gives useful names to the failure modes. Catalyst currently risks **premature commitment** when it asks for classifications or relationships before the analyst has enough information, and **viscosity** when changing one interpretation requires reorganizing many objects or controls. Spatial arrangement also functions as **secondary notation**: meaningful information can live in layout without becoming formal syntax.

Catalyst implication: provisional structure must be cheap to create, cheap to change, and visibly distinct from semantic commitments.

### Rooms and DigitalDesk: bounded places beat constant window management

Henderson and Card's Rooms divided limited screen space into multiple persistent virtual workspaces to reduce window thrashing. Wellner's DigitalDesk treated real documents as manipulable working objects instead of replacing them with abstract file references.

Catalyst implication: the alternative to one giant infinite canvas is not a conventional document window. It is a set of stable, navigable analytical places in which source material remains materially present.
### NoteCards and Scrivener: one thing, several useful projections

NoteCards was explicitly built for intellectual work with cards, links, and graphical browser views. Scrivener later made the same project item available through Binder, Corkboard, Outliner, and editor views. Its freeform Corkboard is especially relevant: cards can be arranged loosely without immediately changing the document order, and a later commit can make a provisional arrangement structural.

Catalyst implication: the earlier goal of making the mind map fundamental should be refined. The underlying analytical identity can remain stable while the user moves among spatial, branch, outline, source, timeline, and other portrayals. Mind-map branching is a valuable organizational structure, but it should not be the lowest-commitment representation.

## Forward research: what current tools get right

### LiquidText: source and thinking surface stay adjacent

LiquidText combines document panes with workspaces where excerpts, images, notes, and connections can be pulled directly from source material. Its strongest lesson for Catalyst is not the infinite canvas; it is the direct source-to-workspace gesture and the persistent visual connection back to the originating document.

### MarginNote: one captured object, several renderings

MarginNote treats an excerpt/card as one underlying object that can appear as a document highlight and as a mind-map node. The important architectural lesson is identity continuity across views, plus retention of the exact document location.

Catalyst should adopt the continuity principle without inheriting MarginNote's card-centric ontology: a source region, evidence occurrence, and analytical use may need distinct identities and provenance, but they should remain tightly and navigably bound.
### Muse: low-ceremony capture and nested boards

Ink & Switch's Muse work deliberately removed choices from capture: clipping was designed as a near-zero-decision action, with material landing on a scratch surface before later organization. Its boards use mixed media and permit nested boards while trying to preserve qualities of physical spatial work.

Catalyst implication: capture should not open a taxonomy dialog. Incoming material needs a quiet landing place or direct-placement gesture, after which the analyst can organize it when context exists.

### Heptabase: human-scale whiteboards plus source material

Heptabase combines cards, whiteboards, nested whiteboards, mind maps, PDF annotation, and highlight placement. Current documentation also recommends splitting very large whiteboards into sub-whiteboards when density becomes high. Its strength is the combination of durable objects and local spatial contexts; its weakness for Catalyst is that cards still tend to become the universal visual species.

### Obsidian Canvas / Scrintal / Milanote: flexible composition, weak analytical semantics

These systems validate the utility of free placement, mixed media, grouping, nesting, and reuse across boards. They are useful precedents for composition, but their connections generally do not distinguish structural organization, provenance, inference, and world semantics with the discipline Catalyst requires.

### Kosmik: captured fragments keep source context

Kosmik can capture text, images, arbitrary web regions, and video frames onto a canvas while retaining links or time-code context to the origin. This strongly reinforces Catalyst's source-region landmark direction: the thing on the desk should be able to take the analyst back to the exact source context.
## Forward research: recent HCI strengthens the spatial case

A 2025 CHI study on arranging documents in augmented reality found recurring user needs to aggregate, distribute, transform, inspect, and navigate document collections, and derived implications around spreading/compressing layouts and preserving spatial organization.

A 2025 ACM SUI study comparing spatial document-navigation layouts with a traditional reader found that spatially stable overviews improved task performance and were rated as better for reorientation and lower disruption during a primary task. The important lesson is not AR itself: stable spatial overviews can reduce navigation interactions and let location become a retrieval cue.

Catalyst implication: semantic zoom should not continuously reflow established analytical geography. Compression, spreading, focus, and overview should preserve recognizable neighborhoods whenever possible.

## Revised cognitive architecture

The Working Picture should be understood as a **bounded analytical desk**, not merely an infinite canvas and not merely a graph view.

A Working Picture should support:

- placed source documents and source-region landmarks;
- loose thoughts, observations, and questions that do not require immediate typing;
- piles, stacks, territories, adjacency, separation, and whitespace as provisional structure;
- explicit branches and containers when the analyst chooses to organize;
- semantic relations and inference only when deliberately asserted;
- optional lenses/overlays that reveal rigor dimensions without permanently crowding the base picture;
- stable local geography across inspection, zoom, source opening, and return.
## UI consequences before any rewrite

The empty state should not present the user with the architecture of Catalyst. It should present a place to work.

The first useful actions should be extremely low ceremony: place/open a source, place a thought, or drag material into the desk. Whether that material later becomes evidence, an observation, a question, a proposition, or a branch is a later decision.

Global controls for Analysis, Evidence, New Thought, configuration, histories, and method-specific functions should not all compete for first-order attention. Most should become contextual actions, commands, or lenses that appear when the current object/task makes them relevant.

Ordinary selection should be mechanically neutral and cheap. Selecting an object should not automatically consume a large fraction of the surface with an inspector. Detail can appear through a lightweight peek and expand only through deliberate Inspect/Open behavior.

The desk needs a low-commitment staging mechanism for new/unplaced material. Exact geometry remains open: it may be a shelf, edge tray, temporary pile, or direct-drop region, but it should not become another permanent navigation sidebar.

## Bounded pictures, not one endless world

The research increasingly favors human-scale Working Pictures with subpictures/rooms rather than one unbounded canvas containing the entire analytical record.

Issue → Working Picture → subpicture/source should remain navigable through Back/Home and stable landmarks. A subpicture is not merely a folder: it is another preserved spatial context with its own local geography.

The analytical record may be arbitrarily large; the currently visible desk should not be.

## Relationship to the prior mind-map direction

Mind-map branching remains important, but the sequence changes:

**placement precedes branch; branch precedes semantic assertion when appropriate.**

A branch means the analyst has chosen an organizational structure. It does not mean the connected items have a causal, evidentiary, temporal, or other world relationship.

This preserves the useful mind-map interaction while avoiding a new form of premature commitment.
## Prototype questions to answer before production coding

The next UI prototype should test cognitive architecture, not visual polish.

1. Can a new user place a source or thought in an empty workspace without first learning Catalyst's object taxonomy?
2. Can the user freely cluster source regions, notes, and questions without creating false semantic relationships?
3. Can a provisional cluster later become an explicit branch/container without losing the earlier spatial arrangement or provenance?
4. Can a source fragment return the analyst to the exact source context in one deliberate action?
5. Can the user enter a subpicture or source and return with the prior Working Picture geography intact?
6. Can overview/focus/zoom reduce density without relocating established landmarks?
7. Can an analytical lens expose provenance, uncertainty, alternatives, or time without permanently changing the base picture?
8. Can ordinary selection remain lightweight enough that the analytical material continues to dominate the viewport?

## Still open

- Exact size and behavior of placed documents: full pages, page stacks, representative thumbnails, or zoom-conditioned hybrids.
- Whether the staging area is an edge shelf, loose inbox pile, or another direct-manipulation pattern.
- Exact visual grammar for piles/overlap/territories and how much the system should infer from them.
- When an implicit group should be offered for formalization and how to avoid suggestion bias.
- Whether Working Pictures are hard-bounded canvases or soft-bounded regions with controlled expansion.
- How multiple occurrences of one analytical identity should advertise identity without visually implying duplication/corroboration.
- How much of the existing Reader should remain a separate surface versus becoming a focused view of a placed source landmark.

No production UI code should be changed until these questions have been exercised in a disposable interaction prototype or equivalent low-cost test.
## High-value sources from this pass

- Thomas W. Malone, *How Do People Organize Their Desks?* (1983) — DOI 10.1145/357423.357430.
- David Kirsh, *The Intelligent Use of Space* (1995) — https://doi.org/10.1016/0004-3702(94)00017-U
- David Kirsh & Paul Maglio, *On Distinguishing Epistemic from Pragmatic Action* (1994) — https://doi.org/10.1207/s15516709cog1804_1
- Marshall & Shipman, *VIKI: Spatial Hypertext Supporting Emergent Structure* — https://people.engr.tamu.edu/shipman/abstracts/echt94-abstract.html
- Shipman & McCall, *Supporting Knowledge-Base Evolution with Incremental Formalization* — https://people.engr.tamu.edu/shipman/chi94-hos/chi94hos_abstract.html
- Shipman & Marshall, *Formality Considered Harmful* — https://people.engr.tamu.edu/shipman/viki/papers/tochi/tochi.html
- Green & Blackwell, *Cognitive Dimensions of Information Artefacts* — https://www.cl.cam.ac.uk/~afb21/CognitiveDimensions/CDtutorial.pdf
- Henderson & Card, *Rooms* (1986) — DOI 10.1145/24054.24056.
- Pierre Wellner, *Interacting with paper on the DigitalDesk* — https://www.cl.cam.ac.uk/techreports/UCAM-CL-TR-330.html
- Frank Halasz, *Reflections on NoteCards* — https://doi.org/10.1145/317426.317451
- Scrivener Freeform Corkboard — https://www.literatureandlatte.com/blog/how-to-use-scriveners-freeform-corkboard
- LiquidText feature overview — https://www.liquidtext.net/liquidtextadeeperdive
- MarginNote Cards as the Axis — https://www.marginnote.com/en/features/card-axis/index.html
- Ink & Switch, *Muse: Designing a studio for ideas* — https://www.inkandswitch.com/muse/
- Heptabase — https://wiki.heptabase.com/ and https://heptabase.com/
- Obsidian Canvas — https://help.obsidian.md/plugins/canvas
- Kosmik web capture — https://www.kosmik.app/faq/browser-and-built-in-web-capture
- Scrintal visual organization — https://scrintal.com/features/visually-organize
- Luo et al., *Documents in Your Hands* (CHI 2025) — https://doi.org/10.1145/3706598.3713518
- Brett & Bateman, *Spatially Organized Interfaces for Document Navigation in Mixed Reality* (SUI 2025) — https://doi.org/10.1145/3694907.3765921