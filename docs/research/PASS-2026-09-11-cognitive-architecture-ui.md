# Cognitive architecture / UI research pass — 2026-09-11

Status: research/design pass only. No runtime code changed.

## 1. Trigger and corrected problem statement

The immediate blocker is not Portrayal Lab protocol polish. It is the cognitive architecture of the analyst-facing surface.

The alpha.3 runtime evidence shows a visually sparse but cognitively dense application. The analyst encounters multiple application concepts before doing analytical work, while the source document remains in a separate Reader pane and the Working Picture contains abstractions derived from it.

This is a deeper regression than excess chrome. Catalyst lost a foundational capability: the source itself, and regions of the source, no longer function as placed landmarks in the analytical structure.

The design principle to restore is:

> Analytical structure must be legible before it is readable.

This means the analyst should be able to recognize a problem's shape through placed sources, source regions, observations, questions, propositions, clusters, branches, gaps, and stable spatial landmarks before reading all of their prose.

Application chrome should retreat behind the analytical material rather than compete with it.

## 2. Research question

What cognitive architecture lets an analyst move from uncertain material to structured judgment without requiring premature classification, premature semantic links, continual mode switching, or loss of source context?

The relevant unit is not a canvas widget or graph node. It is a working environment that supports external cognition across different levels of commitment.

## 3. Backward research: repeated cognitive mechanisms

### Physical desks, piles, and low-commitment organization

Malone's studies of office organization found that piles and spatial location were not merely signs of disorder. Untitled, unordered piles could preserve working material, remind the worker of unfinished activity, and avoid classification costs before a stable category existed.

The later digital “pile” work retained this distinction between quick informal grouping and formal filing. Information-scrap research likewise found persistent needs for lightweight entry, unconstrained content, work-in-progress, visibility, adaptability, and temporary storage.

Design implication: Catalyst needs a legitimate provisional state. “Not yet classified” must be a supported condition rather than an error to be repaired.

### Spatial hypertext and incremental formalization

VIKI/VKB treated spatial arrangement, visual appearance, and grouping as meaningful before explicit links and schemas were available. Marshall and Shipman's work on emergent structure and incremental formalization directly challenges interfaces that demand fully specified semantics at capture time.

Design implication: proximity, alignment, enclosure, ordering, and piles may express weak/provisional structure. They must not silently become analytical assertions.

### Epistemic action and the intelligent use of space

Kirsh and Maglio's epistemic-action work, and Kirsh's later account of the intelligent use of space, show that people manipulate the external world not only to execute a plan but to make thinking easier. Rearranging material can reduce search, memory, and computational load.

Design implication: moving a source, excerpt, or question is itself a thinking operation. Spatial manipulation cannot be treated as cosmetic layout editing.

### Sensemaking as representation search

Russell, Stefik, Pirolli, and Card describe sensemaking as searching for a useful representation and encoding information into it. The important cost is not only retrieval; analysts change representations to make later cognitive operations cheaper.

Design implication: Catalyst should permit representational shifts without forcing the analyst to rebuild the underlying analytical record.

### Spatial memory, scale, and local tools

Data Mountain found value in stable arbitrary placement and visual landmarks for later retrieval. Pad++ explored location and scale as navigational resources rather than treating every transition as a window-management event.

Pad++'s later “local tools” work is especially relevant to Catalyst: tools could live on the worksurface, be picked up when needed, and be put down again instead of occupying a permanent global palette.

Design implication: persistent analytical landmarks and transient operating affordances should be different species. Chrome should appear locally and contextually when possible.

### Intelligence-analysis workspaces

The nSpace Sandbox was explicitly designed as a flexible evidence-marshalling and sensemaking environment supporting both ad-hoc and formal analysis. Its designers described “put-this-there” cognition, fluid gestures, evidence arrangement, hypotheses, and analytical templates.

Analyst's Workspace later pushed the document-centric approach further. Full-text documents and other artifacts were spatially arranged so analysts could externalize sensemaking directly in the data representation. Lightweight highlights and notes lived with the documents rather than in a disconnected note system.

This is the most direct historical support for Catalyst's missing source placement: serious analytic-workspace research treated documents as cognitive objects, not merely as content opened in a separate reader.

### Bounded representations

Tinderbox/spatial-hypertext systems and Scrivener demonstrate a different but complementary lesson: not everything must coexist in one boundless field. Containers, maps, corkboards, outlines, and document views constrain scope while preserving the same underlying material.

Design implication: Catalyst should prefer human-scale Working Pictures and subpictures over one infinite, permanently zoomed-out world.

## 4. Forward research: what contemporary systems recover

### Gstell / deferred structuring (CHI 2026)

Rutishauser and Fritz identify a current version of the same problem: rigid bookmarks demand certainty too early, while flat tab collections become unmanageable. Their Gstell probe couples a low-friction Shelf for uncertain material with later grouping in History.

The important lesson for Catalyst is not to copy a Shelf sidebar. It is to explicitly support uncertainty and defer organizational commitment until the analyst has enough understanding to make it worthwhile.

### Allume (formerly Muse)

Allume uses nested boards, linked cards, and excerpts from PDFs/images that retain source context. Its product philosophy explicitly allows ideation first and organization later.

This is one of the closest contemporary comparators because it combines nested spatial scope, mixed media, and source-linked excerpts. Its weakness for Catalyst is that it remains a general ideation canvas rather than an evidence/reasoning environment with analytical semantics and provenance discipline.

### LiquidText

LiquidText keeps documents and a workspace tightly coupled: excerpts can be pulled from documents into the workspace and remain navigable back to source context. This validates source-region continuity and the value of manipulating evidence outside the page while preserving origin.

Its split document/workspace model also exposes a question for Catalyst: keeping source context is not enough if the whole source can never become part of the authored spatial geography.

### Obsidian Canvas, Heptabase, and Milanote

These systems demonstrate the appeal of mixed-media canvases, groups, nested canvases/sub-whiteboards, and multiple occurrences or references. They also expose the failure mode of canvas maximalism: large unbounded boards become difficult to navigate, organize, and maintain, and users can lose material in space.

Design implication: “free placement” is necessary but not sufficient. Catalyst needs bounded scope, landmarks, navigation grammar, and progressive disclosure.

### Scrapbook and recognition-rich handles

Scrapbook's screenshot bookmarks address a different but related problem: textual file names and histories provide weak cues for reconstructing a prior work context. A week-long field study found that combined visual and textual cues helped users recall activity and restore working context.

Design implication: source crops, page regions, and recognizable document fragments should do navigational work in Catalyst. A source object should not collapse immediately into a generic document icon or text label.

### Jigsaw and coordinated representations

Jigsaw demonstrates the value of coordinated document, entity, temporal, list, graph, and other representations for investigative analysis. Its lesson for Catalyst is not that the Working Picture should contain every view simultaneously; rather, different representations answer different analytical questions.

Design implication: Working Picture should be the compositional home, with projections available when a task calls for them. One spatial picture must not be forced to encode every analytical operation.

## 5. The central synthesis: a commitment gradient

The backward and forward research converges on a staged cognitive architecture:

**Placed material → provisional structure → explicit analytical structure → communicable product**

These are not four separate applications or modes. They are increasing levels of commitment over the same analytical record.

1. **Placed material** — documents, pages, source regions, images, data views, and incoming scraps can be put somewhere without explaining why.
2. **Provisional structure** — proximity, piles, territories, alignment, ordering, spatial branching, and lightweight annotations express an evolving interpretation without asserting formal semantics.
3. **Explicit analytical structure** — propositions, evidence relationships, assumptions, hypotheses, provenance, assessments, and named semantic relations are authored when they become useful.
4. **Communicable product** — a deliberately selected Briefing Picture/report is derived from the analysis rather than forcing the working environment to look presentation-ready.

## 6. Candidate Working Picture cognitive architecture

### A. The analytical desk is primary

The default surface should be the analyst's current problem space, not a dashboard, graph, file manager, or empty canvas surrounded by application modes. The analyst should encounter their placed analytical material first.

### B. Sources are placeable landmarks

A document is not only something opened elsewhere. A whole source, a page, or an exact source region must be able to remain visibly placed in the Working Picture. Its representation may generalize with scale, but its identity and authored location persist.

Opening a source should behave conceptually like entering or magnifying a placed landmark. Returning should restore the analyst to the same spatial context. Reading and thinking therefore become different depths of one environment rather than two unrelated panes.

### C. Weak spatial structure is legitimate

The analyst may place two sources together, make a pile, enclose several excerpts, arrange a rough sequence, or put a question near an observation without creating a formal analytical relationship.

Spatial organization is cognitive state, but it is not analytical truth. Catalyst must never silently promote proximity into semantic fact.

### D. Formalization is progressive

Explicit relationships and analytical typing should be available when they reduce ambiguity or enable a method, query, audit, or judgment. They should not be admission requirements for placing material on the desk.

### E. Pictures are bounded and nestable

Working Pictures should remain human-scale. A problem can contain subpictures/rooms/boards that preserve local geography and can be entered deliberately. One analytical object may have multiple occurrences without duplicating analytical identity.

The architecture should resist a single infinite world whose only scalability mechanism is zooming farther out.

### F. Chrome is contextual, not territorial

The persistent UI should communicate only global state that cannot safely disappear. Object creation, transformation, linking, annotation, and inspection controls should prefer local/contextual invocation over permanently occupying analytical space.

Selection should not automatically summon a large inspector. A lightweight local inspection state can reveal enough to continue working; deep metadata/provenance/history can appear only when deliberately requested.

### G. Uncertain material needs a low-commitment landing place

Incoming material whose relevance is unclear should have somewhere safe to exist without forcing categorization. This might be a spatial margin, tray, or staging region of the current picture rather than a permanent application sidebar.

The important invariant is a cheap transition from “possibly relevant” to placed working material, and later to structured analysis or deletion.

## 7. What the current screenshot gets wrong

In `Capture(10).PNG`, the PDF is a Reader on the left, the analytical picture is a separate central/right environment, and a persistent inspector consumes additional space. The geometry is authored by the application, not by the analyst.

The visual message is therefore “read here, think there, inspect over there.” The source cannot participate in the analyst's spatial model except indirectly through derived objects.

The next architecture should reverse that relationship: application panes become temporary service surfaces around a stable analytical geography.

## 8. Anti-patterns to reject

- Solving overload by merely hiding buttons while preserving the same mode architecture.
- Treating every source or thought as a generic rectangular card.
- Treating an infinite canvas as the architecture rather than one representation technique.
- Forcing every item into a type, folder, relation, or method before it can be placed.
- Making Reader, Evidence, Analysis, and Working Picture competing top-level places the analyst must mentally reconcile.
- Allowing automatic layout to destroy authored spatial memory.
- Letting proximity imply corroboration, causation, support, identity, or certainty without explicit authorship.

## 9. First-use cognitive target

A new or empty issue should permit a useful analytical act before the user has to understand Catalyst's taxonomy.

A representative first sequence should be possible with little or no mode management:

1. Bring in a source.
2. Leave the whole source or a recognizable page/region visibly placed.
3. Pull out an excerpt/observation without losing exact source context.
4. Put a note or question beside it.
5. Rearrange several items into a provisional grouping or sequence.
6. Enter/read the source in depth and return to the same analytical place.
7. Formalize a relationship only if and when the analyst decides it matters.

The user should not need to decide between “Analysis” and “Evidence,” open a command palette, manage Reader history, or understand a graph ontology merely to accomplish that sequence.

## 10. Pre-code tests for the architecture

Before another Working Picture rewrite, test the cognitive model itself with low-cost mockups/prototypes rather than production implementation.

A useful comparison would put the same small investigation into two conditions:

- source-separated: Reader + analysis canvas + persistent inspector;
- placed-source: documents/regions embedded as stable landmarks with contextual inspection.

Measure task completion and qualitative failure around: source-return accuracy, orientation after interruption, time to establish a meaningful grouping, number of application concepts/modes touched, premature formalization, navigation errors, remembered source location, and subjective workload.

Test at several realistic densities rather than only an empty/sparse picture. The purpose is to discover where bounded pictures, subpictures, staging, and semantic zoom become necessary.

## 11. Strong conclusions vs open questions

Strong current conclusions: source placement is cognitive state; source regions must retain exact anchors; provisional spatial structure must be legal; explicit semantics must remain distinguishable from spatial suggestion; authored geography must remain stable; Working Pictures should be bounded/nestable; deep chrome should retreat until invoked.

Open questions should remain open until tested: the default visual form of a whole document versus page/region; whether uncertain material lands in a spatial margin, tray, or temporary pile; how subpictures announce themselves without becoming folders; how much document content stays readable at Working scale; and exactly which controls/status indicators genuinely deserve permanent screen territory.

## 12. Research sources carried forward

Historical / cognitive foundations:

- Malone, T. W. (1983), *How Do People Organize Their Desks? Implications for the Design of Office Information Systems*.
- Mander et al. (1992), *A “Pile” Metaphor for Supporting Casual Organization of Information*.
- Marshall & Shipman, VIKI/VKB and spatial-hypertext work on emergent structure and incremental formalization.
- Kirsh & Maglio (1994), *On Distinguishing Epistemic from Pragmatic Action*; Kirsh (1995), *The Intelligent Use of Space*.
- Russell, Stefik, Pirolli & Card (1993), *The Cost Structure of Sensemaking*.
- Bederson et al., Pad++ and Local Tools work.
- Robertson et al., Data Mountain spatial document management.
- Wright et al. (2006), *The Sandbox for Analysis — Concepts and Methods*; nSpace/GeoTime case studies.
- Andrews & North (2012), *Analyst's Workspace: An Embodied Sensemaking Environment for Large, High-Resolution Displays*.
- Stasko et al., Jigsaw investigative visual analytics.

Contemporary / forward comparators:

- Rutishauser & Fritz (CHI 2026), *From Tabs to Structures: Understanding and Supporting Web Page Management*.
- Allume (formerly Muse): nested boards, linked cards, PDF/image excerpts retaining source context.
- LiquidText: source-linked excerpts and integrated document/workspace interaction.
- Obsidian Canvas: mixed media and nested canvases.
- Heptabase: sub-whiteboards and separate whiteboard layout state.
- Milanote: nested freeform boards, including the cognitive costs of open-ended flexibility.
- Hu & Lee (UIST 2022), *Scrapbook: Screenshot-Based Bookmarks for Effective Digital Resource Curation across Applications*.
- Bernstein et al. (2008), *Information Scraps: How and Why Information Eludes our Personal Information Management Tools*.

## 13. Immediate research consequence

Do not code the next Working Picture yet. The next research step is to turn this commitment-gradient model into a small set of competing surface architectures and test which one best preserves source placement, orientation, provisional thinking, and low chrome before selecting an implementation direction.

## 14. Competing surface architectures

The research is strong enough to compare surface architectures before implementation.

### Architecture A — reduced split-pane application

Reader, Working Picture, and inspection remain separate regions, but controls are simplified and panes are more collapsible.

Advantage: low implementation risk and familiar desktop behavior.

Failure: it preserves the core cognitive split. Source location is still application-authored rather than analyst-authored, and reading/thinking remain different places. This is likely an optimization of the current regression, not a solution.

### Architecture B — literal spatial desk

Documents, pages, excerpts, notes, questions, and analytical objects all live directly on one bounded spatial surface. Reading is accomplished primarily by zooming/panning the desk.

Advantage: strongest continuity between material and thought; direct manipulation is cognitively honest.

Risks: large documents can dominate space; reading may require excessive camera management; density can make the desk itself into the burden.

### Architecture C — anchored-material desk with focus lens

Sources and source regions remain placed occurrences on the Working Picture, but deliberate focus temporarily expands the selected material into a high-readability state while retaining contextual cues to its spatial neighborhood. Closing/back returns to the same authored place.

Advantage: preserves source placement and spatial memory without demanding that full-fidelity documents remain readable at every scale. It aligns with focus+context research and Catalyst's existing Inspect/Focus/Open distinctions.

Risk: the focus transition must feel like deepening into the same object, not opening a second application mode or losing the surrounding picture.

### Architecture D — bounded rooms / subpictures

Each Working Picture is deliberately human-scale. Dense or distinct lines of inquiry can become nested subpictures that retain their own geography. A source or analytical object can appear in more than one picture through separate occurrences while preserving one underlying identity.

Advantage: provides a scaling mechanism other than shrinking everything on an infinite canvas. Supports stable local landmarks and deliberate shifts of context.

Risk: if subpictures behave like folders, the spatial model collapses back into hierarchical filing. Their previews and transitions must preserve analytical context and orientation.

Architecture D is better understood as a scaling layer for B or C than as a complete alternative.

## 15. Current research preference

The strongest candidate is **C + D: an anchored-material analytical desk with bounded/nested Working Pictures and focus-in-context reading**.

This is not yet a final UI decision. It is the architecture that best satisfies the accumulated evidence:

- source material remains part of authored analytical geography;
- actual reading can become large and legible without permanently splitting the screen;
- spatial arrangement remains useful as epistemic action;
- weak/provisional organization can precede formal semantics;
- the workspace scales through subpictures as well as semantic zoom;
- local/contextual controls can replace permanent tool territory;
- exact source anchors and provenance survive representational changes.

A key distinction is that the **document occurrence remains in the Working Picture even when its portrayal changes**. Overview may show a recognizable document/page landmark; Working scale may expose excerpts or annotations; focused reading may show full fidelity. Those are portrayals of one placed analytical landmark, not unrelated Reader and Canvas states.

## 16. Next comparison to research/test

The next pass should specify and compare the interaction sequence for A, B, and C+D using one realistic multi-source investigation. The comparison should begin before any pixel-level styling: opening/importing sources, placing them, extracting regions, making a provisional cluster, asking a question, reading deeply, returning, and later formalizing one relationship.

## 17. Cognitive-Dimensions evaluation frame

Blackwell/Green's Cognitive Dimensions framework provides a useful pre-code test because Catalyst is effectively a notation/environment for exploratory analysis.

The most relevant dimensions are:

- **Premature commitment** — does the analyst have to name, type, classify, choose a method, or assert a relation before understanding the material?
- **Provisionality** — can half-formed arrangements and interpretations exist safely and be revised?
- **Secondary notation** — can layout, grouping, whitespace, adjacency, and other non-formal marks carry working meaning without being mistaken for formal semantics?
- **Visibility / juxtaposability** — can relevant sources, excerpts, questions, and interpretations be seen and compared together rather than remembered across panes/modes?
- **Viscosity** — how much work is required to regroup, reinterpret, or reorganize when the analyst's model changes?
- **Hidden dependencies** — can the analyst discover the source anchors, derivations, and downstream implications behind an analytical object when needed?
- **Role-expressiveness** — can a person tell what an object is doing in the analysis without reading extensive UI explanation?
- **Closeness of mapping** — does the interaction resemble the analyst's conceptual action (put these together, compare these sources, trace this claim) rather than application bookkeeping?
- **Hard mental operations** — how much must the analyst remember because context, source material, or prior arrangement is not perceptually available?
- **Progressive evaluation** — can an incomplete picture already be inspected and reasoned over, or does the software only become useful after extensive formalization?

### Preliminary architecture comparison

**A — reduced split panes:** improves surface tidiness but remains weak on visibility/juxtaposability, closeness of mapping, and hard mental operations because source and thought remain separated. It also retains mode/pane management as secondary work.

**B — literal desk:** strong on visibility, secondary notation, provisionality, and closeness of mapping; risk of high navigation viscosity and hard mental operations once density/scale exceeds the visible field.

**C+D — anchored material + focus-in-context + bounded subpictures:** retains most of B's provisional/spatial strengths while introducing explicit mechanisms for readable detail and bounded scale. Its main design risk is transition complexity: focus and subpicture navigation must preserve location and identity rather than creating hidden mode changes.

## 18. Turn “legible before readable” into acceptance tests

The principle can be operationalized before implementation.

### Structural-legibility test

At Overview scale, with body prose unavailable/unreadable, the analyst should still be able to perceive:

- the major source/document landmarks;
- the broad spatial groupings/territories and isolated items;
- where provisional structure exists versus explicit formal relationships;
- where open questions/gaps are located;
- which material is source-derived versus analyst-authored;
- the current location/focus and available subpictures.

If the picture becomes meaningless as soon as labels are hidden, Catalyst has fallen back into a text diagram.

### Source-return test

Enter a source deeply, inspect several pages/regions, then return. The analyst should land back at the same analytical location with the source's placement and neighboring context intact.

### Premature-commitment test

Collect, place, rearrange, and cluster a small set of sources/excerpts without assigning formal relationship types or analytical categories. The workspace should remain useful and valid.

### Spatial-truth test

Move two items together. No semantic assertion should be created. Then explicitly author a relationship. The visual system must distinguish those states.

### Chrome-retreat test

With nothing selected, the analytical material should dominate. Selecting/focusing an object may reveal local affordances; leaving that activity should return the affordances to the background without altering analytical state.

### Density test

Repeat the same task as the picture grows. The system should introduce bounded scope, generalization, or subpictures before the analyst is forced to solve scale exclusively by zooming farther out or hiding arbitrary content.
