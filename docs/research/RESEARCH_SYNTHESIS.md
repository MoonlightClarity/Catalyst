# Research synthesis

## 1. The central lesson

Repeated research across intelligence analysis, military/intelligence symbology, CIA/NPIC graphics, visual analytics, mind/concept mapping, provenance, warning, temporal reasoning, and human factors converges on one conclusion:

> The visual system must be designed as a disciplined portrayal language, not as a theme, icon set, or graph renderer.

The recurring alpha failures came from exposing technical structure directly:

- alpha.1 exposed a generic coordinate graph;
- alpha.2 improved the map structure but remained a textual graph;
- alpha.3 reduced text but used symbols that were too abstract to support recognition.

The next stage must engineer how meaning becomes perceivable before re-entering the full UI.

---

## 2. Intelligence lineage: inherit discipline, not aesthetics

Research into ICD 203, CIA structured analytic techniques, CIA/NPIC cartography and publication practice, Army/Marine intelligence analysis, PNNL intelligence visual analytics, DRDC concept mapping, i2 Analyst's Notebook, warning methods, and GEOINT all argue against “intelligence-themed” software.

Do **not** borrow:

- classified stamps;
- radar sweeps;
- crosshairs as decoration;
- neon cyber aesthetics;
- affiliation symbology whose actual military meanings do not apply;
- generic shields/eagles/eyes;
- fake command-center styling.

Do inherit:

- explicit separation between source information, assumptions, judgments, and uncertainty;
- alternative analysis and dissent;
- source traceability;
- disciplined visual hierarchy;
- cartographic generalization and overlays;
- compact legends and marginalia;
- symbols with stable meanings;
- multiple representations chosen according to the analytical question;
- rigorous control of visual implication.

A core design law emerged:

> Every visual implication must correspond to something Catalyst actually knows or the analyst explicitly authored.

Therefore size, center position, glow, opacity, saturation, line weight, and spatial proximity cannot casually imply importance, certainty, similarity, or truth.

---

## 3. Working Picture, not graph

The graph remains a computational substrate, but the analyst should work with a **Working Picture**: a curated, heterogeneous visual representation of the current problem.

The Working Picture is not the full database. Intelligence doctrine repeatedly emphasizes relevant/instructive/contextual information rather than exhaustive display. The analytical record may contain thousands of items while the current picture contains a few dozen landmarks.

The surface should support multiple visual species rather than normalize all information into cards:

- source/image crop;
- page or document landmark;
- map/geospatial visual;
- chart/data visual;
- recognizable actor/entity landmark;
- compact analytical proposition symbol;
- branch;
- trace;
- junction;
- area/territory;
- timeline segment;
- open inquiry/frontier;
- submap preview.

The Working Picture is therefore closer to intelligence cartography or a composited analytical board than a node editor.

---

## 4. Working Picture vs Briefing Picture

Historical NPIC briefing boards and PDB practice make a crucial distinction:

- the analyst's detailed working environment must tolerate ambiguity, half-formed structure, source density, and unresolved reasoning;
- the briefing/product representation must aggressively select, compress, and communicate a message.

Catalyst should preserve this separation:

**Analytical Record → Working Picture → Briefing Picture/Product**.

Do not force the Working Picture to look like an executive brief, and do not force a future brief to reproduce the analyst's messy workspace.

---

## 5. Mind maps, concept maps, spatial hypertext, and maps within maps

Research into XMind, CmapTools, TheBrain, Freeplane, Obsidian Canvas, Scapple, Tinderbox/VIKI, and DRDC's intelligence concept-map model established that no single spatial geometry is sufficient.

Useful inherited properties:

- mind maps: low-friction branching and local hierarchy;
- concept maps: focus questions, semantic linking phrases, and cross-links;
- spatial hypertext: provisional structure through placement/grouping before semantics are known;
- TheBrain: focus-centered neighborhood navigation;
- CmapTools/Obsidian/DRDC: multiple human-scale maps rather than one infinite graph;
- XMind: mixed structures and task-specific layouts.

Current decision:

- a **structural branch** means “this is how I am organizing the thought”;
- a **semantic relationship** means “I assert this analytical relation.”

They must remain different.

One analytical object may appear in multiple maps through separate **map occurrences**, without duplicating its analytical identity.

Maps are portrayal state, not the data model itself.

---

## 6. Recognition-first, not simply image-first

Picture-superiority and spatial-memory research helped refine “image-first.” The goal is not to decorate every object with a picture.

The goal is **recognition before recall**.

Users should orient through:

- actual source imagery;
- recognizable source crops;
- spatially stable landmarks;
- branch shapes;
- territories/clusters;
- map silhouettes;
- compact trace numbers;
- distinctive core symbols;
- short identity labels.

Text-heavy maps force sequential reading. A successful Working Picture should be apprehensible structurally in a few seconds.

Current hierarchy:

1. real visual material where meaningful;
2. representative landmark;
3. Catalyst core symbol;
4. analytical modifier;
5. short identity text;
6. full prose on demand.

---

## 7. Symbol system: hybrid, compositional, tested

Purely abstract alpha.3 glyphs failed recognition. Generic stock pictograms would be legible but fail to establish a coherent analytical language.

Human-factors and military-display research points to a hybrid approach similar in principle to “symbicons”:

- recognizable core for what a thing is;
- systematic analytical modifier for what role it is playing;
- state amplifier in stable positions when current state matters;
- structural geometry for line/area/junction semantics;
- actual source visual overriding the core symbol when more informative.

Do not invent 100 independent icons.

Use a small grammar that composes.

Suggested semantic-distance policy:

- **near/concrete** for person, document/source, place, imagery, event where a recognizable form exists;
- **medium/conventional** for question, source, event-like concepts;
- **far/learned abstract notation** only for genuinely abstract analytical concepts such as assumption, hypothesis, inference, provenance state.

Brand uniqueness should come from geometry, proportion, terminal treatment, negative space, modifier locations, and the overall grammar—not from making familiar meanings obscure.

---

## 8. Point, line, and area grammar

A major correction is that the atomic visual primitive is not “node.”

Catalyst needs at least three spatial classes:

### Landmark / point-like
- person/actor;
- source;
- event;
- proposition;
- question;
- image/evidence landmark.

### Structure / line-like
- thought branch;
- semantic relation;
- source/provenance trace;
- timeline;
- revision path;
- divergence/reconciliation path.

### Territory / area-like
- cluster;
- working set;
- theme;
- map region;
- contextual semantic territory.

Some meanings should never become icons. A trace should be a trace; a branch should be a branch; an inference can be a junction; a cluster can be a territory.

---

## 9. Semantic zoom must change portrayal, not just scale

Cartography, Pad++, large-graph visualization, and operational symbology all support distinct representations at different scales.

Catalyst should explicitly author level-specific portrayals:

### Overview
- topology;
- regions;
- landmark classes;
- almost no prose;
- representative visuals rather than tiny versions of every item.

### Working
- actual source crops/landmarks;
- recognizable core symbols;
- short identity labels;
- structural branches;
- minimal necessary trace notation.

### Analytical/close
- active modifiers;
- relevant relationships;
- evidence/inference details where requested.

### Inspect
- complete text;
- provenance;
- assessments;
- history;
- metadata;
- source quality/uncertainty details.

The 16/24/32 px versions of a symbol may need redrawing rather than uniform scaling.

---

## 10. Salience is a scarce resource

Research repeatedly showed that visual salience strongly affects search and interpretation.

Catalyst needs explicit salience classes:

- background context;
- normal working object;
- current inspection (neutral mechanical registration);
- analytically emphasized by active lens, for a stated reason;
- attention required, rare and strongest.

Selection must never impersonate analytical importance. Warning must never look like selection. Centrality must never be implied merely by automatic layout.

---

## 11. Navigation grammar

The full viewport should not require continual camera piloting.

The preferred hierarchy is:

**Issue/Problem → Working Picture → Object → Source/Submap**.

Operations remain distinct:

- click: Inspect;
- deliberate focus action / Enter / appropriate double-click: Focus without changing analytical meaning;
- Open: enter source/submap/detail context;
- Back/Escape: return to prior analytical place;
- Home: return to current Working Picture overview.

Spatial transitions should preserve orientation but avoid gratuitous animation.

Stable analyst-authored placement is cognitive state. Automatic layout should grow locally and never casually reorganize established landmarks.

---

## 12. Source material and evidence

A major future signature interaction is **source → evidence → analysis**.

Evidence should retain a visual and navigable trace to the exact source region. A relevant PDF excerpt should preferably appear as the actual source crop, not OCR prose copied into a generic card.

Suggested continuum:

- Overview: indexed trace mark;
- Working: visual source fragment + trace index;
- Inspect: quotation/context/provenance;
- Open: exact Reader/source location.

Evidence anchoring and provenance are different:

- anchoring: where exactly in this captured artifact is the evidence?;
- provenance: where did the information itself originate upstream?

Do not equate multiple publications with independent corroboration.

---

## 13. Provenance and evidence independence

Key permanent law:

> Repetition must never look like corroboration.

Separate:

- artifact/report;
- exact artifact version;
- source/excerpt/anchor;
- upstream origin;
- transformation (quotation, summary, translation, etc.);
- agent;
- provenance relationships.

Several reports may braid back to one evidentiary origin. The portrayal should be capable of revealing source families when provenance is relevant.

Unknown independence must remain unknown.

Provenance does not prove truth. Integrity/fixity does not prove credibility.

---

## 14. Reasoning ontology

Long-term architecture should not treat Person, Hypothesis, and Assumption as sibling “node roles.”

A stronger conceptual decomposition is:

- Things/world objects;
- Propositions (claims, assumptions, hypotheses, questions);
- Evidence/observations;
- Inference structures;
- Semantic world relations;
- Assessments/evaluations;
- Perspectives;
- History/revision events.

An inference can itself be inspected/challenged. Evidence may support a claim only through a warrant/assumption, and co-premises may need a junction rather than independent binary support edges.

Do not prematurely migrate 0.6.x storage to this model, but design portrayal so it does not block it.

---

## 15. Assessment, uncertainty, dissent, and perspectives

Confidence, likelihood/probability, source reliability, information credibility, diagnosticity, and agreement are distinct dimensions.

They are often better modeled as **attributed assessments** rather than immutable properties of the underlying proposition/source.

Different analysts or perspectives may legitimately assess the same proposition differently.

Consensus is not confidence.

Dissent should be first-class when materially important, but minor variation should not visually dominate.

Perspective may represent an analyst, team, red team, method run, scenario, or deliberate alternative viewpoint—even in single-user Catalyst.

---

## 16. Inquiry, indicators, weak signals, and warning

Important conceptual distinctions:

- Question: what do we want to know?;
- Gap: what materially relevant information is currently missing?;
- Indicator: an expected observable under a hypothesis/scenario;
- Observation: what was actually encountered;
- Requirement/information need: what would help resolve the question/indicator;
- Trigger/revision condition: a preidentified development that should force reconsideration;
- Weak signal interpretation: an attributed judgment that an observation may indicate emerging change;
- Warning assessment: a time-sensitive analytic judgment that a development deserves attention because delay matters.

Two complementary modes:

- **Watch**: hypothesis-driven expected observables and revision conditions;
- **Scan**: discovery-driven search for unexpected changes outside the current model.

Another permanent law:

> Catalyst must preserve surprising observations before forcing them into the current analytical model.

Warning priority is not probability. Anomaly is not weak signal. Weak signal is not warning.

---

## 17. Temporal history and revisions

Catalyst needs to preserve what the analyst knew at the time without continuing to portray superseded information as current.

Important separations:

- effective/subject time: when a represented event/state applies;
- knowledge/record time: when Catalyst/analyst learned or recorded it.

Corrections/retractions should propagate as **impact requiring review**, not silent mutation of downstream conclusions.

Source correction affects an inference basis before automatically proving a conclusion false.

Working picture and historical record are different:

- record preserves what entered, what was derived, what changed, and why;
- current picture selects what is currently relevant/current under the chosen time/lens.

---

## 18. Overlays and lenses

The intelligence overlay tradition gives a useful model for progressive disclosure.

Base Working Picture remains relatively quiet. Optional overlays/lenses bring forward specific dimensions:

- provenance;
- source quality;
- alternatives;
- uncertainty;
- time;
- Watch/indicators;
- rigor (assumptions, gaps, challenge);
- method-specific portrayal.

The domain model can be rich without the base portrayal showing all dimensions simultaneously.

---

## 19. Custom branding

Catalyst branding should be derived from the analytical grammar rather than applied as decoration.

Repeatedly useful native operations include:

- Trace — follow backward toward evidence/origin;
- Transform — represent derivation/translation/summarization;
- Junction — combine grounds into reasoning;
- Divergence — show legitimate interpretive forks;
- Revision — show what changed;
- Reconciliation — show later synthesis of perspectives;
- Probe — show information that would resolve/challenge analysis;
- Scan — attend outward for unanticipated change;
- Watch — monitor expected conditions.

The application mark should emerge from a small-scale characteristic geometry from this grammar, but must first pass 16/24/32 px silhouette tests. Conceptual cleverness does not excuse poor recognition.

---

## 20. What not to do next

Do not:

- polish alpha.3;
- design dozens of SVGs directly in production components;
- make every concept an icon;
- use generic stock icon packs as the final analytical language;
- force all content into cards;
- expose all semantic links at once;
- rely on color alone;
- use automatic layout to continuously move analyst landmarks;
- create a new runtime alpha before the symbol system has been tested in isolation.

## 21. Portrayal architecture: make the visual language executable

The latest execution-focused pass added a critical implementation boundary. NGA/GWG treats portrayal as the system-to-human interface, while OGC symbology standards separate data semantics from styles, symbolizers, and rendering engines. Catalyst should do the same.

The analytical model must store semantic identity and authored presentation intent, not resolved SVG geometry. A versioned portrayal catalog should deterministically resolve an object + portrayal context into a point/line/area/landmark representation.

The portrayal context must include scale, active analytical lens/overlay, local authored Map/Working-Picture state, accessibility adaptation, and neutral interaction state. Rule precedence should be explicit rather than emerging from CSS specificity.

MIL-STD-2525's fixed icon/modifier sectors and display hierarchy reinforce two implementation rules without importing military meanings: modifier positions should be stable, and ordinary Working-scale symbols need a strict modifier budget so additional analytical dimensions do not interfere with core recognition.

OGC scale-conditioned portrayal and MIL-STD display reduction also strengthen the semantic-zoom rule: Overview, Working, Analytical, and Inspect are separately authored representations, not one SVG continuously shrunk.

ISO 9186 testing should be reflected in the Portrayal Lab data model: record comprehension, perceptual element identification, referent association, confusion, and task/search performance rather than relying only on aesthetic preference.

The symbol catalog itself should be versioned independently from the domain model and application version. A new validated portrayal catalog should normally not require research-data migration.

See `PASS-2026-09-11-portrayal-architecture.md` for the detailed findings and source list.

## 16. Portrayal must be executable and testable, not only standardized

The latest execution-focused research refines the portrayal architecture into a concrete pipeline: semantic/native content → versioned portrayal catalog → portrayal context → deterministic rule resolution → point/line/area/crop/junction symbolizers → renderer. NGA/GWG and OGC portrayal standards independently support treating this boundary as a first-class system-to-human layer rather than component-local styling.

The Portrayal Lab must use the same modules intended for production. It should include fixed sparse/medium/dense scenes, modifier and overlap scenes, mixed-media Working Pictures, semantic-zoom continuity, and return/memory tasks. Tactical-display research provides useful initial search set sizes (6/12/18) and demonstrates that density, overlap, extra encoded features, and feature grouping materially affect performance.

Evaluation must go beyond isolated icon comprehension. PNNL visual-analytics work argues for representative tasks, data, metrics, and evaluation of utility, situation awareness, interaction, reasoning, and fit to workflow. Therefore alpha.4 portrayal cannot be accepted solely because its symbol sheet looks coherent; it must improve realistic Working-Picture tasks and reduce interaction translation/junk.

A graph remains a useful computational/analytical substrate, but graph-only visualization has known limitations. Intelligence analysts use coordinated text, document, timeline, graph, cluster, map, and other views. Working Picture is the home composition, not a demand that every analytical question be encoded in one spatial diagram.

See `PASS-2026-09-11-portrayal-lab-execution.md`.

## 22. Cognitive workspace architecture: placement before formalization

A backward/forward pass on desk organization, spatial cognition, spatial hypertext, incremental formalization, Scrivener, and current spatial research tools changes the UI priority without invalidating the portrayal work.

Catalyst should use a **ladder of commitment**:

1. capture/land material with minimal classification;
2. place it spatially so proximity, separation, overlap, and stable location can support cognition;
3. organize with groups, territories, piles, branches, or containers;
4. assert semantic analytical relationships only deliberately;
5. reveal rigor dimensions through optional lenses/methods.

This follows Malone's desk research, Kirsh's work on intelligent use of space, and Marshall/Shipman's spatial-hypertext and incremental-formalization lineage. The shared lesson is that software should not require users to make explicit distinctions that are still ambiguous or emerging.

The Working Picture should therefore be treated as a **bounded analytical desk** composed of stable human-scale places/subpictures, not simply an infinite canvas. Source documents and exact source regions should remain placed landmarks. Incoming material needs low-ceremony capture and a provisional landing mechanism. Ordinary selection should remain lightweight so application chrome does not displace the analytical surface.

The earlier mind-map direction is refined rather than rejected: branching remains a first-class organizational operation, but free placement is lower commitment than branching, and branching is lower commitment than a semantic analytical assertion.

Modern LiquidText, MarginNote, Muse, Heptabase, Kosmik, Obsidian Canvas, Scrintal, and Milanote validate pieces of this architecture, but none combines low-commitment spatial sensemaking, exact source-region traceability, disciplined analytical semantics, provenance, and intelligence-grade rigor in the way Catalyst requires.

Recent 2025 HCI research on spatial document organization further supports stable layouts, human-scale spatial overviews, and spread/compress transformations that preserve orientation rather than repeatedly reflowing the workspace.

See `PASS-2026-09-11-cognitive-workspace-architecture.md`.
## 22. Cognitive architecture supersedes portrayal polish as the immediate problem

Live UI review after blind-v1 Portrayal Lab validation exposed a more fundamental regression: the Working Picture no longer preserves documents and document regions as placed analytical landmarks, while the empty application exposes too many concepts before useful analytical work begins.

Backward research through piles/desks, spatial hypertext, epistemic action, Pad++/Local Tools, Data Mountain, nSpace Sandbox, Analyst's Workspace, Tinderbox, and Scrivener converges with forward research through Gstell, Allume/Muse, LiquidText, Obsidian Canvas, Heptabase, Scrintal, Fabric, and related systems.

The common mechanisms are low-commitment capture, deferred structuring, spatial externalization, stable landmarks, source-linked excerpts, local/contextual tools, mixed representations, and bounded/nested scopes.

The current cognitive model is a commitment gradient:

**Placed material → provisional structure → explicit analytical structure → communicable product.**

Spatial placement is meaningful cognitive state but not analytical truth. Proximity/grouping may precede semantic formalization, and Catalyst must never silently convert spatial suggestion into a semantic assertion.

The strongest current surface hypothesis is an **anchored-material analytical desk with focus-in-context reading and bounded/nested Working Pictures**. A document/page/region remains a placed occurrence while its portrayal changes with scale or focus; deep reading should feel like entering or magnifying that placed landmark, then returning to the same analytical geography.

Application chrome should be contextual rather than territorial. Persistent panes should not consume space merely because a concept exists in the system.

Before another Working Picture implementation, compare competing surface architectures with Cognitive Dimensions criteria and explicit acceptance tests for structural legibility, source return, premature commitment, spatial truth, chrome retreat, and density.

See `PASS-2026-09-11-cognitive-architecture-ui.md`.

## 23. Working Picture state semantics — architecture correction

Freeplane, Zotero, Trilium's persisted note/branch model, and the AFFiNE/Logseq/Excalidraw/SilverBullet forward sweep sharpen the cognitive-workspace result into a data/interaction boundary.

The Working Picture should coordinate six separable species: durable analytical identity; context-local occurrence/placement; structural membership; semantic relation; provenance; and focus-in-context. They may be portrayed together but must not collapse into one universal node/edge record.

The governing operational rule is **mutation discipline**: moving/resizing mutates occurrence only; making a pile/territory/branch mutates context-scoped structure; asserting support/contradiction mutates semantic relation; extracting/deriving preserves provenance; opening/entering/back mutates focus. Compound promotion is valid only when explicit and inspectable.

Authored geometry is authoritative portrayal state even though it is not semantic truth. Computed layouts, indexes, clusters and query results are derived; hover/selection animation is ephemeral. This authority axis should drive recovery, export and audit separately from semantic classification.

Working Picture structure should normally be context/occurrence-scoped so the same identity can be organized differently across analyses. Semantic analytical relations should normally target durable identities and own zero or more local connector portrayals.

Source handling should distinguish Source Identity, exact version-aware Source Anchor, and any durable Anchored Analytical Identity created when a source selection becomes placed, reused, annotated or related. Analyst observations/interpretations derived from source regions should be separate identities with provenance rather than silent mutation of the source fragment.

Focus-in-context is a navigation contract, not ontology. Session recovery may persist it operationally; only an explicit save/bookmark action should promote selected focus/projection state into a durable Saved View/Viewpoint.

See `PASS-2026-09-11-architecture-synthesis-working-picture-semantics.md` and `PASS-2026-09-11-architecture-resolution-scope-anchor-focus.md`.
## 23. Working Picture architecture is now a state-separation contract

The latest architecture synthesis turns the commitment gradient into an operational rule: **an interaction mutates only the state dimension it names unless the analyst explicitly promotes/escalates it.**

Catalyst should keep durable analytical identity, context-local occurrence/placement, context-local organizational structure, identity-level semantic assertions, provenance/anchors, transformation provenance, and focus/return state separately inspectable. This is stronger than merely drawing different link styles.

The rule has concrete consequences. Moving does not relate. Grouping does not assert. Reuse does not duplicate or corroborate. Hiding a connector does not retract a semantic relation. Removing an occurrence does not delete the underlying identity. Opening/focusing does not rewrite structure. Automatic or inferred state remains derived until an explicit promotion creates authored structure or semantics.

New Hypothesis/W3C evidence makes source anchoring a first-order record: source identity + representation/version + complementary format-aware selectors + current resolution status. A fuzzy or degraded relocation must remain visibly different from an unchanged exact anchor.

New OpenRefine evidence strengthens transformation provenance: meaningful derivation may need input identities/versions, a transformation specification, a concrete execution event/context, and output identity. Editor undo/redo and reusable method definitions are related but distinct mechanisms.

The architecture has now been stress-tested against repeated/circular reporting, multi-step transformation, source drift, reuse across bounded subpictures, branch/mind-map projection, deep focus/return, destructive operations, and computed lenses. It is mature enough to gate a disposable cognitive prototype, provided the coordinator deliberately closes the research pass first. See `PASS-2026-09-11-architecture-stress-tests-and-closure.md`.
## 24. Local-first collaboration must preserve analytical intent

The closed Automerge comparator pass adds a collaboration boundary without selecting Automerge itself. Replication convergence, mechanical edit conflict, and intentional analytical disagreement are different states.

Catalyst should choose merge granularity according to authored meaning rather than storage convenience. Concurrent edits to compound states such as occurrence geometry, provenance anchor/version bundles, consequential assessments, or relation state must not silently synthesize combinations no analyst authored.

Consequential unresolved edit collisions should remain inspectable until an attributable reconciliation. Intentional dissent belongs in the domain model as separate assertions/assessments/perspectives with authorship and rationale, not in hidden CRDT conflict registers.

Human authorship/approval identity must remain distinct from replica/device identity and change/version identity. Archive/retract/supersede/delete/purge likewise remain domain lifecycle events rather than generic replicated key deletion.

This is compatible with a local-first architecture in which local persistence, synchronization, authenticated identity, authorization, encryption, and analytical semantics remain separate layers. The next single-user cognitive prototype does not need collaboration, but its state boundaries should avoid making later per-species merge and reconciliation policies impossible.

See `PASS-2026-09-11-architecture-collaboration-conflict-semantics.md`.