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
