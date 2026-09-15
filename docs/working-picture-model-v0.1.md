# Catalyst Working Picture Model v0.1

Status: **historical 0.6.3-alpha.3 design contract; superseded for current implementation by `CURRENT_ARCHITECTURE.md`**  
Scope: **the analyst-facing primary visual surface**  
Companions: `portrayal-standard-v0.1.md`, `navigation-grammar-v0.1.md`, `representation-matrix-v0.1.md`, `mapping-model-v0.1.md`, `visual-analytical-language-v0.1.md`  
Decision record: ADR 0017

## 1. Why this model exists

Runtime review of 0.6.3-alpha.1 and alpha.2 established that replacing a coordinate graph with a branch-oriented map did not solve the primary UX problem. Both renderers remained **text-first diagram editors**. The analyst still had to navigate by reading labels and cards, interpret a large 2D structure, and manually pilot the viewport around software-generated geometry.

Catalyst therefore changes the primary mental model again:

> **The analyst does not operate a graph or a mind map. The analyst constructs and navigates a working picture of a problem.**

The underlying analytical model may remain graph-structured. Maps remain useful saved portrayals. Neither is the primary UX metaphor.

A Working Picture is a human-scale, recognition-first composition of the information, observations, interpretations, questions, and projections needed to understand one analytical problem at the current moment.

## 2. Intelligence-derived purpose

The model is anchored in intelligence practice without requiring intelligence-specific terminology in ordinary use.

A Working Picture exists to help the analyst answer four questions quickly:

1. **What is the issue?**
2. **What is actually observed or sourced?**
3. **What do we currently infer or assess?**
4. **What remains unresolved or worth watching?**

The picture must preserve a visible distinction between source-derived material and analyst construction, while still allowing both to occupy one coherent visual environment.

The picture is not the complete project database. It is a curated analytical portrayal of the current problem.

## 3. Working Picture is not the analytical record

Catalyst maintains three distinct conceptual layers:

```text
ANALYTICAL RECORD
all persistent objects, evidence, relationships, history, provenance,
assessments, maps, and view state

        ↓ selected and portrayed through

WORKING PICTURE
human-scale analytical composition used for thinking

        ↓ optionally composed into

BRIEF / PRODUCT
message-first communication for another person
```

A Working Picture may omit, generalize, collapse, or visually suppress model content without deleting it.

A Brief may be much more aggressively compressed than a Working Picture.

## 4. Primary unit of navigation: the analytical issue

The top-level place is an **Issue** (working term), not a canvas.

An Issue may be framed as:

- a question;
- a research problem;
- an intelligence requirement;
- an investigation;
- an event to explain;
- a decision to support;
- a hypothesis to test;
- an entity to understand;
- an emerging change to monitor.

The user should always be able to tell which Issue they are working without reading the graph structure.

An Issue can contain one or more Working Pictures and subordinate Maps/projections, but the Issue provides the stable navigational home.

## 5. Recognition-first principle

The picture must be recognizable before it is readable.

> **Recognition-first means the analyst should use visual landmarks, spatial memory, structural form, native source imagery, and stable symbols to orient before reading prose.**

It does **not** mean placing decorative images on every object.

Portrayal priority:

```text
1. native visual material where meaningful
2. recognizable structural landmark
3. Catalyst analytical symbol
4. concise label
5. body text only on inspection / close scale
```

Long paragraphs are not normal Working Picture content.

## 6. Heterogeneous visual species

The picture intentionally preserves different visual forms rather than normalizing every object into a card.

### 6.1 Source-derived visual material

Examples:

- PDF evidence → crop of the actual source region;
- PDF/document identity → page/cover thumbnail when useful;
- image → image itself or a region crop;
- geospatial material → map/image crop;
- chart → chart preview;
- table/data observation → compact data visual when available;
- screenshot → screenshot crop.

The source representation should remain recognizably connected to its origin.

### 6.2 Analytical constructs

Examples:

- proposition;
- hypothesis/alternative;
- assumption;
- question/gap;
- indicator/watch condition;
- inference/junction.

These use Catalyst notation rather than arbitrary illustrative imagery.

### 6.3 Real-world things

People, organizations, places, events, and other world objects may use meaningful imagery when the analyst supplies it or when the source itself is visual. Otherwise they use restrained Catalyst type marks. Generic social-media avatars and stock-office icons are not the design target.

## 7. Default semantic territories

A Working Picture may use local semantic territories to separate epistemically different material. The default exploratory intelligence-derived grammar is:

```text
OBSERVED / SOURCED                 ASSESSED / CONSTRUCTED

source crops                       interpretations
observations            →          propositions
records                             hypotheses
                                     judgments

            OPEN / UNRESOLVED
            questions · gaps

                 WATCH
         indicators · revision conditions
```

This is a suggested grammar, not a universal forced layout.

Other Issues may choose different local geometries, such as:

- entity/network-oriented;
- chronology-oriented;
- causal/process-oriented;
- hypothesis-comparison;
- provenance-oriented;
- free spatial sensemaking.

The meaning of spatial territories must be declared by the portrayal, not inferred from arbitrary coordinates.

## 8. Structural branches vs semantic relationships

The distinction from Mapping Model v0.1 remains mandatory.

### Structural branch

A local portrayal relationship used to organize thought:

> “this belongs under / develops from / is grouped with this here.”

It is low-friction and does not assert analytical semantics.

### Semantic relationship

A persistent analytical assertion such as support, contradiction, dependence, provenance, aboutness, or temporal precedence.

Structural branches remain normally visible because they organize the picture.

Semantic cross-links are normally latent and appear through trace, inspection, or explicit overlay/lens.

## 9. The graph should be latent

The system must not continuously draw every analytical relationship simply because it exists.

Default Working Picture behavior:

- structural branches establish local composition;
- semantic relationships appear on hover/trace, inspection, or explicit relation overlays;
- hidden/collapsed relationships leave boundary continuation indicators when omission would misrepresent the current portrayal;
- relationship density is reduced before node/object density is allowed to become unreadable.

> **The user should experience a working picture backed by a graph, not a graph database with visual styling.**

## 10. Visual observations enter the picture directly

Evidence capture must avoid a “swivel-chair” workflow.

When the analyst selects source material, Catalyst should be able to create a usable observation directly in the current Working Picture with provenance already attached.

Conceptual path:

```text
SOURCE REGION
   ↓ capture
VISUAL OBSERVATION
   ↓ arrange / interpret
ANALYTICAL RELATIONSHIP OR INFERENCE
```

The analyst should not have to separately create a note, paste quotation text, reattach the source, and then reconnect it.

## 11. Stable analyst-authored visual geography

Spatial arrangement is cognitive state.

Once an analyst establishes a recognizable landmark or territory, Catalyst should preserve it unless the analyst deliberately requests a restructuring operation.

Automatic layout may:

- place a newly created local child;
- prevent exact overlap;
- produce an initial suggested composition;
- arrange an explicitly selected region on request.

Automatic layout must not:

- continuously optimize the whole picture;
- move unrelated territories after a local edit;
- relocate analyst-positioned landmarks without explicit action;
- imply significance through algorithmic centrality unless the active analytical lens explicitly calculates it.

## 12. Human-scale decomposition

One Working Picture is deliberately bounded.

When a picture becomes too dense, the preferred responses are:

1. collapse/generalize local structure;
2. create a subordinate Map/picture;
3. switch projection;
4. create a working subset/layer;
5. use a detail view.

The preferred response is **not** indefinite zoom-out until every object becomes unreadable.

Subordinate Maps are first-class portrayals over the same analytical objects; they are not copied databases.

## 13. Working Picture overlays

Intelligence-style overlay logic is the preferred mechanism for bringing additional analytical dimensions forward without permanently cluttering the base picture.

Potential overlays/lenses include:

- provenance / Sources;
- Quality;
- Alternatives;
- Time;
- Watch;
- Assumptions/Gaps/Rigor;
- relationship types;
- analyst-created evidence/tag layers.

An overlay changes portrayal, not underlying truth.

The active overlay state belongs in quiet picture-level marginalia.

## 14. Working Picture vs Briefing Picture

Catalyst must not optimize the Working Picture as though it were already a finished briefing product.

### Working Picture

- exploratory;
- spatially authored;
- source-rich;
- can contain unresolved/ambiguous material;
- may be asymmetrical or locally messy;
- supports inspection and traceability.

### Briefing Picture

- message-first;
- audience-specific;
- aggressively selected/compressed;
- source-transparent;
- time-bounded;
- designed for rapid communication.

A future Briefing Picture should be derived from the analytical record rather than maintained as a disconnected copy.

## 15. Current-status and time marginalia

Picture-level conditions belong in the margin rather than on every object.

Examples:

```text
AS OF        10 SEP 2026
AS KNOWN     04 SEP 2026
WINDOW       AUG 14 — SEP 10
PICTURE      18 objects
MODEL        412 objects
LAYER        Logistics
```

Only conditions relevant to the current portrayal should appear.

## 16. Attention is scarce

Visual salience must be treated as a limited analytical resource.

Persistent high-salience treatment is reserved for conditions requiring action or immediate review.

Catalyst should not use the same visual intensity for:

- selected;
- important;
- uncertain;
- warning;
- new;
- contradictory;
- high-confidence.

Each is a different concept.

Interaction state must never impersonate analytical state.

## 17. Three-second test

A Working Picture fails its purpose if an analyst must read every visible object to understand the situation.

At normal working scale, a competent user should be able to answer approximately within three seconds:

- what problem is this picture about?
- what material is observed/source-derived?
- what material is analyst-constructed?
- where are the major branches/territories?
- what remains unresolved?
- what is the current focus?

The test is directional rather than a literal timed certification, but it is a product acceptance criterion.

## 18. Non-goals for alpha.3

0.6.3-alpha.3 must not pretend future domain semantics already exist.

Specifically, alpha.3 does not need to implement:

- permanent first-class Inference objects;
- first-class Perspective/Assessment records;
- bitemporal history;
- provenance origin families;
- weak-signal or Warning objects;
- full geospatial/GEOINT capability;
- collaborative intelligence workflows.

The renderer may reserve visual grammar for those future concepts, but it must only render semantics that the current data model actually knows.

## 19. Alpha.3 minimum proof

The next renderer earns continuation only if all of the following are true in native use:

1. No default coordinate/grid plane.
2. The current Issue/purpose is visually obvious.
3. Evidence can appear as a recognizable source fragment rather than a text card.
4. Long body text does not occupy normal picture objects.
5. Structural branches are visually primary; semantic links are secondary/latent.
6. Click-to-inspect does not refocus or rearrange the picture.
7. Deliberate focus/open/back navigation is obvious and reversible.
8. Spatial landmarks remain stable after local edits.
9. At least three object species are visually distinguishable without reading their type labels.
10. Subordinate structure can be represented without turning the whole project into one infinite diagram.
11. The base picture remains useful with all optional overlays off.
12. The screen passes the three-second recognition test better than alpha.2.

If those conditions fail, do not add more visual ornament. Revisit the portrayal/navigation model.
