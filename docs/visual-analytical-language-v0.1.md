# Catalyst Visual & Analytical Language v0.1

Status: **historical 0.6.3 design foundation; current UI/product authority is CURRENT_ARCHITECTURE.md, newer ADRs, and the frozen Outline/Map/annotation ontologies**  
Scope: visual grammar, interaction language, portrayal rules, analytical semantics, and identity constraints  
Implementation status: **partially implemented only where explicitly noted**

> **Current supersession note (2026-09-15):** The Mapping/Working-Picture amendments below preserve design history. They do not restore free-spatial/map-first authoring, semantic-zoom requirements, multi-map UX, or formal Assessment as current product scope.


> **Amendment for 0.6.3-alpha.3:** `working-picture-model-v0.1.md`, `portrayal-standard-v0.1.md`, and `navigation-grammar-v0.1.md` refine this foundation around a recognition-first Working Picture. Generic text cards and a continuously visible graph are explicitly rejected as the default portrayal.
## v0.1 mapping amendment

`mapping-model-v0.1.md` and ADR 0016 refine the visual model after native review of 0.6.3-alpha.1. Catalyst still uses a graph-like analytical substrate, but the default human interface is now a purposeful, human-scale **Map**, not one global Cartesian node-link canvas. Structural branches are view organization and are distinct from semantic analytical relationships. Maps may be interlinked, locally structured, freeform where needed, and reused as alternate portrayals over the same analytical objects.

Where this document says `graph` in a user-interface sense, read it as `analytical Map/portrayal` unless the passage explicitly concerns graph data or network analysis. The coordinate-plane treatment shown in alpha.1 is rejected as the default visual metaphor. Semantic zoom remains valid within Maps, but multi-map decomposition is now the primary project-scale complexity strategy.

## 1. Purpose

Catalyst is not a dashboard, note app, mind-map skin, or intelligence-themed interface. It is a local analytical workspace for turning source material into traceable reasoning while preserving the difference between observations, interpretations, uncertainty, relationships, and analyst-created structure.

This specification translates the research completed after 0.6.2 into a coherent design language for the next UI and domain milestones. It exists to prevent the product from drifting back toward generic software conventions whenever a new screen or feature is added.

The central design thesis is:

> **Catalyst is an analytical mapping system in which observations, interpretations, uncertainty, relationships, provenance, and inquiry remain visually distinguishable while occupying the same workspace.**

The interface should inherit the discipline of intelligence graphics and analytical cartography, not the popular aesthetics of intelligence software.

A secondary identity thesis follows:

> **The visual richness of Catalyst must come from analytical meaning, not decoration.**

Dark shells, glow, dashboards, stock icons, shields, eyes, crosshairs, radar sweeps, classified stamps, and generic network motifs are not a substitute for an analytical language.

---

## 2. Design lineage

Catalyst draws principles from several historical and technical lineages without copying any one system.

### 2.1 Intelligence analytic standards

ICD 203 requires analysts to describe source quality, express uncertainty, distinguish underlying information from assumptions and judgments, consider alternatives, use logical argumentation, explain changes and meaningful analytic differences, and use effective visual information where appropriate.

Catalyst treats these as product requirements rather than branding cues.

### 2.2 Intelligence cartography

The OSS/CIA cartographic tradition emphasizes thematic communication, visual hierarchy, restrained annotation, standardized symbols, overlays, legends, line weight, reduction, and the deliberate composition of a whole graphic rather than a collection of individually understandable marks.

Catalyst adopts the concept of **analytical cartography**: the workspace is a plotting surface whose portrayal changes according to scale, purpose, and active analytical lens.

### 2.3 Link analysis and analytical graphing

Historic association diagrams, IBM i2 Analyst's Notebook, Jigsaw, PNNL's Scalable Reasoning System, and later visual-analytics systems show recurring value in:

- explicit entities and relationships;
- multiple coordinated views;
- semantic relationship types;
- timelines and alternate representations;
- analyst-created evidence, assumptions, hypotheses, and reasoning artifacts;
- preserving access to original source material.

Catalyst adopts those structural lessons while rejecting icon-heavy, ribbon-heavy, or dashboard-heavy surface conventions.

### 2.4 Provenance and preservation

W3C Web Annotation, W3C PROV, PREMIS, fixity practice, and digital-evidence handling all reinforce that:

- source identity is not the same as file path;
- an annotation belongs to a particular source representation/state;
- derivations and transformations should be traceable;
- versions should not silently overwrite historical analytical context;
- integrity, provenance, credibility, and truth are separate concepts.

### 2.5 Human factors

Human-factors guidance reinforces several constraints:

- symbol meaning should not depend on color alone;
- attention-getting treatments are scarce resources;
- functionally different tasks should not reuse visually ambiguous symbols;
- pictorial icons do not automatically outperform concise labels;
- abstract, learned notation can outperform decorative realism;
- visual density must be managed by hierarchy and selective portrayal, not merely by shrinking everything.

---

## 3. Core design laws

The following rules are normative for 0.6.3 design work and should be treated as frozen unless a later ADR changes them.

1. **Every visual implication must correspond to something Catalyst actually knows or the analyst explicitly asserted.**
2. **Interaction state must never impersonate analytical state.** Selection is not importance, confidence, probability, centrality, or corroboration.
3. **Analytical content and application controls use separate visual grammars.** A node must not look like a button; a warning about software state must not look like contradictory evidence.
4. **Geometry carries meaning before decoration does.** Color reinforces; it does not create the only readable distinction.
5. **Different epistemic dimensions use different visual channels.** Probability, confidence, source reliability, information credibility, provenance, selection, and tag membership must not collapse into one visual scale.
6. **The domain model may be rich; the normal portrayal must not attempt to portray it all at once.** Lenses expose relevant dimensions on demand.
7. **Catalyst always distinguishes the analytical universe from its current portrayal.** Filtered, generalized, collapsed, unexpanded, and absent are not equivalent states.
8. **Generalization must not masquerade as deletion.** Semantic zoom and clustering may simplify portrayal while preserving underlying objects and counts.
9. **Repetition must never look like corroboration.** Evidence representations and independent evidentiary origins are separate concepts.
10. **Unknown independence remains visibly unknown.** Different documents are not presumed independent merely because they are distinct files or authors.
11. **Unsupported is not refuted.** Missing evidence, contrary evidence, and absence under adequate observation are different states.
12. **Uncertainty is not irrelevance.** Uncertain material must not merely fade away as though it matters less.
13. **Unknown, disputed, superseded, stale, retracted, false, and deleted are separate states.**
14. **Changes propagate as reviewable impact, not silent mutation.** A source correction may affect evidence and inference without automatically rewriting downstream judgments.
15. **Catalyst annotates the analytical problem, not Catalyst itself.** Persistent tutorial prose is a design failure unless the text is substantive analytical content.
16. **Salience is a scarce resource.** Glow, red, motion, flashing, and high-contrast emphasis are reserved for conditions that truly require attention.
17. **Catalyst preserves surprising observations before forcing them into the current analytical model.** Bottom-up sense-making must remain possible.
18. **A warning is an attributed assessment, not an object turning red.** Warning priority is not equivalent to probability.
19. **Analytical disagreement is preserved when substantive.** Coordination does not require consensus.
20. **Rich history is preserved; only meaningful structure is portrayed by default.**

---

## 4. The four visual layers

Every Catalyst screen should be understood as four layers with different responsibilities.

### 4.1 Instrument

The instrument is Catalyst itself: navigation, search, zoom, creation, arrangement, workspace settings, view switching, and other controls.

Instrument chrome should:

- occupy stable peripheral locations;
- be visually quieter than analytical content;
- use concise labels when they are faster to recognize than abstract icons;
- use custom icons only when the action is recurrent, unambiguous, and meaningfully accelerated by the symbol;
- remain accessible by keyboard and screen reader;
- never borrow the notation used for analytical state.

### 4.2 Portrayal

Portrayal describes **how the current analytical universe is being shown**:

- projection;
- scale/detail level;
- active layer/filter;
- grouping/generalization;
- working set;
- time window;
- perspective;
- methodology lens.

Portrayal belongs primarily in margins and compact view-state indicators rather than inside analytical objects.

### 4.3 Notation

Notation communicates durable analytical semantics:

- object family;
- proposition/inquiry role;
- relationship type and direction;
- evidence provenance;
- inference structure;
- uncertainty only when the active lens calls for it;
- revision, divergence, and other analytical operations.

Notation must be consistent across the application and documented.

### 4.4 Content

Content is the work itself:

- source text;
- evidence excerpts;
- analyst writing;
- entities and propositions;
- relationship labels;
- method prompts and answers;
- timelines and analytical results.

Content should dominate the interface.

---

## 5. Source / analysis boundary

The split workspace is a product primitive rather than a temporary layout.

### 5.1 Left side: observed material

The Reader primarily contains:

- captured artifacts;
- exact source context;
- source versions;
- source-owned content;
- Catalyst evidence anchors and reader markup.

### 5.2 Right side: analytical construction

The analytical plane primarily contains:

- world objects;
- propositions;
- relationships;
- inferences;
- hypotheses and assumptions;
- inquiries;
- layers and analytical projections.

### 5.3 The provenance spine

The boundary between Reader and analysis should evolve into a quiet **provenance spine** rather than remain only a resize divider.

Evidence captured on the left receives a compact indexed trace mark. Analytical objects that use that evidence carry a corresponding provenance affordance. Tracing either end reveals the route across the source/analysis boundary.

The spine must remain subtle during normal work. Its purpose is recoverability, not decoration.

---

## 6. Analytical ontology for portrayal

This section is conceptual, not a database schema. The current 0.6.x compatibility model remains valid until the 0.7 domain migration is designed.

Catalyst should increasingly distinguish the following families.

### 6.1 World

Things and events that are being modeled:

- Person;
- Organization;
- Place;
- Event;
- Artifact as an object in the world where relevant;
- other domain-specific things.

### 6.2 Source

Material and its lineage:

- Artifact;
- ArtifactVersion;
- Origin;
- Agent;
- Transformation;
- Integrity/fixity record.

### 6.3 Evidence

Analytically selected observations tied to source context:

- Anchor;
- Evidence excerpt/observation;
- provenance route;
- known/unknown evidentiary origin.

### 6.4 Reasoning

Analytical propositions and inference:

- Claim;
- Assumption;
- Hypothesis;
- Interpretation;
- Inference or reasoning junction.

### 6.5 Expectation

Forward-looking expected observables:

- Indicator;
- Signpost;
- Trigger;
- Revision condition;
- expected observation.

### 6.6 Inquiry

What the analysis still needs to know:

- Question;
- Gap;
- Information need;
- collection/verification requirement in neutral, general-purpose language.

### 6.7 Evaluation

Attributed judgments about other analytical objects:

- Likelihood;
- Confidence;
- Source reliability;
- Information credibility;
- Diagnosticity;
- Signal interpretation;
- Warning assessment;
- other method-specific assessments.

These should migrate toward first-class `Assessment` records rather than intrinsic properties of propositions.

### 6.8 Perspective

The point of view from which an assessment exists:

- Analyst;
- Team;
- Red Team;
- Scenario;
- Method run;
- legal/scientific interpretation;
- other intentional viewpoint.

A perspective is useful even in a single-user local workspace.

### 6.9 History

Meaningful analytical changes:

- capture;
- extract;
- transform;
- revise;
- reanchor;
- supersede;
- retract/withdraw;
- reassess;
- divergence;
- reconciliation.

---

## 7. Visual-channel budget

Catalyst has a finite visual vocabulary. Channels should be deliberately reserved.

| Visual channel | Primary allowed use |
| --- | --- |
| Position | Projection/layout. Never confidence or truth. |
| Base frame geometry | Broad object family only. |
| Small structural modifier | Analytical role or special state within a family. |
| Edge direction/end treatment | Relationship direction/semantic operation. |
| Edge stroke treatment | Relationship status only when the active lens requires it. |
| Provenance mark | Source anchoring and traceability. |
| Hue | Layer/category emphasis and restrained semantic accents; never sole carrier. |
| Value/contrast | Attention hierarchy and de-emphasis, not truth value. |
| External registration marks | Selection/inspection/focus only. |
| Length/aligned position scale | Quantitative comparison such as probability when precision matters. |
| Texture/pattern | Secondary uncertainty/status encoding where tested and necessary. |
| Motion | Temporary transition or genuinely time-dependent change; never decoration. |

### 7.1 Prohibited channel collisions

Do not encode:

- node size as confidence;
- glow intensity as importance or likelihood;
- saturation as evidentiary strength;
- opacity as uncertainty by default;
- one hue as both tag membership and epistemic state;
- red as generic "bad";
- central graph position as importance unless the projection explicitly means centrality;
- force-directed proximity as similarity unless the projection explicitly computes similarity.

---

## 8. Symbol strategy

Catalyst will not begin 0.6.3 by designing a large pictogram library.

### 8.1 Compositional notation

The notation system should be learnable through a small number of foundational geometries plus systematic modifiers rather than dozens of unrelated icons.

A symbol may eventually contain independent components for:

- broad semantic family;
- analytical role;
- provenance state;
- current interaction state;
- lens-specific amplifiers.

### 8.2 Symbol count constraint

The normal workspace should aim for **three to five foundational geometries** and a small modifier set. New shapes require evidence that a previously allocated channel cannot communicate the distinction safely.

### 8.3 No literal-icon dependency

Person, organization, concept, and document may have optional compact glyphs at working/inspection scale, but categorical recognition must not depend on stock pictograms.

### 8.4 Monochrome survival

Core notation must remain discriminable without semantic color. Color-blind accessibility and low-quality/reduced reproduction should not destroy meaning.

---

## 9. Semantic zoom and generalization

Zoom changes portrayal, not merely size.

### 9.1 Four semantic scales

#### Strategic

Purpose: perceive topology, clusters, and broad structure.

- most labels suppressed;
- foundational geometry only;
- aggregate counts remain visible;
- relationship labels hidden unless essential;
- selection remains visible but restrained.

#### Navigational

Purpose: find known objects and move through the analysis.

- important/nearby identities appear;
- category/role marks become legible;
- cluster boundaries and counts remain visible;
- limited relationship labels appear on focus.

#### Analytical

Purpose: reason over explicit objects and relationships.

- short identity labels;
- relevant role/provenance notation;
- typed/directed relationships;
- inference junctions where present;
- active-lens amplifiers.

#### Inspection

Purpose: examine full detail.

- canvas object remains compact;
- inspector shows rich metadata, source lineage, assessments, history, methods, and content;
- object does not become a giant card on the graph.

### 9.2 Generalization rules

At lower detail levels Catalyst may:

- suppress labels;
- aggregate parallel relationships;
- collapse groups into explicit aggregates;
- show counts instead of members;
- reduce modifiers;
- withhold off-screen/unexpanded neighborhoods.

Aggregates must never look indistinguishable from ordinary single objects.

### 9.3 Generalization versus filtering

Generalization changes representation. Filtering changes the visible analytical universe.

Catalyst must keep these conditions distinguishable in view-state marginalia.

---

## 10. Interaction states

Catalyst should distinguish at least five interaction/portrayal states.

### 10.1 Trace

Transient hover or explicit trace operation answering: **what is directly connected and why?**

Trace may illuminate relevant paths temporarily without changing analysis or implying importance.

### 10.2 Inspect

Persistent selection answering: **what object am I currently examining?**

Inspect should use neutral mechanical notation such as registration/corner marks or perimeter emphasis. It must not resize the object or imply importance.

### 10.3 Working set

An analyst-defined subset answering: **what am I actively reasoning over?**

Working sets are explicit and reversible.

### 10.4 Layer

A thematic or organizational lens answering: **show this analytical universe through this subset/category.**

The current evidence-tag cluster is the first implemented form of this behavior.

### 10.5 Projection

A representation answering: **which geometry best exposes the current analytical question?**

Possible future projections include:

- free plot;
- relationship topology;
- timeline;
- matrix;
- provenance;
- method-specific views;
- Watch/Scan.

---

## 11. Marginalia and view-state disclosure

Metadata about the *view* should live primarily in margins rather than inside the analytical picture.

Examples:

```text
GRAPH      74 / 103 objects
LAYER      Logistics
TIME       All
PERSPECTIVE Base case
DETAIL     Overview
```

Only active/relevant conditions should appear.

### 11.1 Contextual legends

Legends are local to the projection and generated from visible notation.

A graph showing Claim/Assumption modifiers may expose a compact key for those marks. If reliability is not portrayed, reliability does not occupy the legend.

### 11.2 Export reproducibility

Exports and screenshots generated by Catalyst should be able to include portrayal context so a reviewer can tell what layer, time range, perspective, and projection were active.

---

## 12. Evidence and provenance notation

### 12.1 Indexed trace marks

Evidence should receive a compact Catalyst provenance index at the source rather than relying on a generic paperclip/highlight icon.

The same index can appear at downstream analytical uses.

The final geometry is not frozen in v0.1, but the behavior is:

- source mark identifies the exact anchor;
- analytical provenance mark identifies use of that evidence;
- trace interaction links them visually;
- evidence can have multiple downstream uses;
- downstream uses do not duplicate the evidence itself.

### 12.2 Anchoring versus provenance

Anchoring answers **where in this exact artifact version is the evidence?**

Provenance answers **where did the information originate and how did it reach this artifact?**

These remain separate.

### 12.3 Evidence families and corroboration

Catalyst must be able to preserve multiple reports while also revealing shared origin.

Normal view may show evidence items individually. A provenance/corroboration lens may braid them back into known origin families.

Never display `N sources` as a synonym for `N independent origins`.

### 12.4 Unknown origin

Unknown upstream origin is a meaningful state and must not be treated as malformed data.

---

## 13. Relationship and inference grammar

Relationships deserve equal or greater design attention than nodes.

### 13.1 Semantic relationships

Examples:

- works-for;
- owns;
- about;
- precedes;
- related-to.

These describe world/semantic relations.

### 13.2 Reasoning relationships

Examples:

- supports;
- contradicts;
- depends-on;
- assumes;
- bears-on.

These describe analytical relations.

### 13.3 Provenance relationships

Examples:

- extracted-from;
- quotes;
- translates;
- summarizes;
- derived-from;
- revised-from.

These describe lineage.

### 13.4 Inference junctions

Some conclusions depend on multiple grounds jointly rather than several independent binary edges.

Catalyst should therefore plan for first-class inference/junction objects such as:

```text
E1 ──┐
E2 ──┼── junction ──→ C1
A1 ──┘
```

The junction represents the reasoning operation, not a flowchart decision.

A future analyst may inspect or challenge the warrant/inference without denying that the input evidence exists.

### 13.5 Edge truthfulness

Line thickness, color, dash, arrows, and routing must have stable documented meanings. A renderer may not use line treatment merely for aesthetic differentiation when that treatment resembles analytical semantics.

---

## 14. Questions, gaps, indicators, and probe behavior

A question mark floating as a generic node is insufficient for the permanent model.

Catalyst should distinguish:

- Question: what the analyst wants to know;
- Gap: material information currently missing;
- Indicator: observable expected under a hypothesis/scenario;
- Requirement/information need: what evidence would resolve the question or evaluate the indicator;
- Observation: what was actually found;
- Trigger/revision condition: what should cause reconsideration.

### 14.1 Epistemic frontier

Gaps often belong at the open edge of reasoning rather than as isolated defective objects.

Catalyst should support portrayal of an **epistemic frontier**: where current analysis reaches beyond current knowledge.

### 14.2 Probe

`Probe` is the native operation that asks:

- what information would resolve this gap?
- what observation would discriminate between alternatives?
- what assumption is vulnerable?
- what would materially change this judgment?

Probe moves outward from current reasoning toward needed information.

### 14.3 Unsupported versus refuted

No-evidence, missing collection, observed absence, and contradictory evidence require different semantics.

---

## 15. Watch and Scan: early warning / weak signals

Early-warning concepts are part of the analytical language, not a decorative future add-on.

### 15.1 Watch

Hypothesis-driven attention:

> **What did we already say we would look for?**

Watch operates over indicators, signposts, triggers, and revision conditions linked to existing hypotheses, assumptions, or judgments.

### 15.2 Scan

Discovery-driven attention:

> **What are we seeing that our current model did not anticipate?**

Scan preserves novel or weak observations before they are forced into an existing hypothesis.

### 15.3 Weak signal is an assessment

A weak signal is not a weak evidence item. It is an attributed interpretation that an observation may indicate emerging change despite ambiguity or limited maturity.

### 15.4 Baseline and deviation

An anomaly requires a baseline. Catalyst should distinguish:

```text
observation → relative to baseline → deviation → interpretation
```

Anomaly, weak signal, trend, and warning are separate concepts.

### 15.5 Signal clustering

Several individually ambiguous observations may become more meaningful as a cluster. The existing evidence-tagging mechanism is an early organizational primitive for bottom-up clustering, but tags do not themselves imply signal significance.

### 15.6 Warning

A warning is an attributed analytical assessment that a change deserves timely attention because delay matters.

Warning priority is not probability. Relevant dimensions may include consequence, lead time, uncertainty, cost of waiting, and reversibility of response.

### 15.7 False-alert discipline

Signal, watch, review, and warning must have distinct salience. Weak signals should not consume the same visual priority as material review conditions or warnings.

---

## 16. Time and revision

Catalyst should plan for two temporal axes.

### 16.1 Effective/subject time

When the represented event, relationship, condition, or proposition applies in the world.

### 16.2 Knowledge/record time

When Catalyst or an analyst recorded or knew the information.

These support different questions:

- what does the current record say happened then?
- what did the analyst legitimately know at the time of a prior judgment?

### 16.3 Revision as lineage

A correction, revision, supersession, or retraction should usually mark the lineage rather than repaint the downstream object as simply "bad."

A changed source can generate an **impact cone** through affected evidence and inference. Catalyst identifies what may require review; the analyst determines what the change means.

### 16.4 Historical record versus working picture

Catalyst preserves a historical record of meaningful changes while portraying a current working picture appropriate to the active time/perspective/lens.

---

## 17. Assessment and perspective

Confidence, likelihood, reliability, credibility, diagnosticity, warning, and similar values should migrate toward attributed assessments.

Conceptually:

```text
Assessment
- assessor / perspective
- target
- scheme
- value
- basis
- recorded time
- effective/applicability time where relevant
```

A hypothesis does not intrinsically possess one global confidence value.

### 17.1 Dissent

Catalyst preserves substantive differences between perspectives.

Different analysts or methods may assess the same proposition differently without one overwriting the other.

### 17.2 Divergence

`Divergence` asks: **where do legitimate analytical interpretations separate?**

The valuable display is not merely two opinions; it is the reasoning crux—different source evaluation, assumption, evidence weighting, warrant, or uncertainty interpretation.

### 17.3 Reconciliation

`Reconciliation` records that multiple positions were considered in producing a subsequent assessment. It does not imply unanimity.

### 17.4 Collaboration UI

Catalyst should emphasize differences in analysis rather than conventional collaboration decoration. Avatars, comments, reactions, and presence indicators may exist later but must not dominate the graph.

---

## 18. Uncertainty and quality portrayal

### 18.1 Keep dimensions separate

Catalyst must preserve distinct concepts for:

- likelihood/probability;
- confidence in the analytical basis;
- source reliability;
- information credibility;
- corroboration/independence;
- diagnosticity;
- authenticity/integrity.

### 18.2 No universal trust score

Catalyst will not create a global `Trust: 84%` abstraction over these dimensions.

### 18.3 Probability

When precise quantitative comparison matters, use aligned position/length scales in inspectors or method projections rather than node size, halo, or color saturation.

### 18.4 Confidence

Confidence should be represented according to the methodology or assessment scheme that generated it. The visual grammar should not permanently hard-code one organization's confidence scheme into universal node geometry.

### 18.5 Basis over badge

Where useful, Catalyst should expose why confidence is limited—gaps, weak corroboration, critical assumptions, deception risk, source issues—rather than relying only on a label.

---

## 19. Tags and layers

User-created tags remain organizational metadata.

They may become a general layer mechanism but must not acquire automatic epistemic semantics.

```text
ANALYTICAL NOTATION
stable, documented, Catalyst-wide

ANALYST LAYERS
flexible, workspace-specific, user-defined
```

The existing 0.6.2 evidence-tag cluster is the first implementation of this principle.

---

## 20. Chrome, typography, and material language

### 20.1 Overall character

Catalyst should feel like a **modern analytical instrument descended from cartography and evidence plotting**, not a tactical simulator and not a generic productivity application.

### 20.2 Geometry

Prefer:

- crisp rectilinear surfaces;
- restrained corner radii;
- selective clipped/notched corners where they have a system-level role;
- fine rules and registration marks;
- indexed marginal notation;
- consistent spacing based on a documented scale.

Avoid:

- ubiquitous pill controls;
- every icon inside a rounded square;
- floating card-on-card-on-card layouts;
- decorative hexagon language;
- gratuitous glow.

### 20.3 Typography

Typography must prioritize long-session legibility and analytical hierarchy.

Use no more than two principal type families in the shell. A restrained mono face may be used for coordinates, source indices, hashes, timestamps, and technical identifiers where fixed-width alignment has functional value.

All-caps micro-labels may be used sparingly for marginalia or section framing, never as the dominant body voice.

### 20.4 Color

The palette should be restrained and rooted in neutral ink/graphite surfaces with an oxidized-teal/sea-glass Catalyst accent.

Additional hues are semantic accents, not decoration. Warm amber may suit evidence attention or provisional emphasis; muted violet/blue/red can support categorical separation where documented.

No palette decision may make essential semantics color-only.

### 20.5 Motion

Motion should communicate transition, trace, expansion, temporal change, or state continuity. It should not exist simply to make the interface feel modern.

---

## 21. Identity and Catalyst mark

The mark will be derived from the analytical grammar rather than designed first and imposed on the product.

### 21.1 Native analytical operations

The research has identified a family of recurring operations:

- **Trace** — follow information backward toward source/origin;
- **Transform** — show how a representation changed;
- **Junction** — show how multiple grounds combine into reasoning;
- **Divergence** — show where interpretations separate;
- **Revision** — show what changed over time;
- **Reconciliation** — show how multiple positions were subsequently considered;
- **Probe** — show what information would resolve/challenge the analysis;
- **Watch** — monitor expected observables/revision conditions;
- **Scan** — preserve and cluster unexpected change.

The future Catalyst mark should emerge from the geometry shared by these operations—especially trace, junction, divergence, and probe—rather than from a generic molecule/network/compass/eye/shield symbol.

### 21.2 Explicitly rejected identity cues

Do not use as primary branding:

- government seals;
- military insignia;
- shields;
- eyes;
- eagles;
- crosshairs;
- radar sweeps;
- green-terminal nostalgia;
- "TOP SECRET" motifs;
- faux classified stamps;
- generic connected-node molecule marks;
- cyberpunk/neon command-center styling.

The intelligence heritage should be evident in discipline, traceability, and portrayal—not cosplay.

---

## 22. Primary workspace direction for 0.6.3

The native review of 0.6.3-alpha.1 superseded the earlier assumption that the existing Graph workspace should merely be restyled. The primary analytical workspace is now governed by `mapping-model-v0.1.md` and ADR 0016.

### 22.1 Reader

- remains source-owned space;
- keeps source context visually distinct from analyst construction;
- evidence selection uses Catalyst trace notation rather than generic attachment decoration;
- the source/analysis boundary remains conceptually important.

### 22.2 Analysis / Maps

- user-facing primary surface is `Analysis`, containing purposeful Maps;
- remove Cartesian graph-paper as the default background;
- rapid structural branching must be easier than database-style node creation;
- structural branches and semantic cross-links must be visually and semantically distinct;
- one underlying analytical object may appear in several Map occurrences;
- Maps can eventually contain multiple local structural grammars and linked submaps;
- semantic zoom controls detail within a Map, while multi-map decomposition controls project-scale complexity;
- selection, refocus, and map navigation remain distinct operations.

### 22.3 Inspector

- remains the rich detail surface for the selected analytical object/occurrence;
- does not force a map relayout merely by opening;
- separates occurrence-owned portrayal state from underlying analytical properties where relevant.

### 22.4 Primary navigation

User-facing navigation should no longer expose `Graph` as Catalyst's fundamental mental model. Provisional language is:

- Analysis / Map;
- Timeline;
- Matrix;
- Methods.

Evidence enters and remains traceable through Analysis rather than becoming a peer destination that suggests the analyst must leave the map to reason about it. Final navigation labels remain subject to native testing.

### 22.5 Configuration

Profile/capability configuration remains instrument chrome and must not dominate the analytical surface.

## 23. Accessibility

The visual language must support:

- keyboard navigation and operation;
- screen-reader access to Map structure, analytical objects, and semantic relationships through a synchronized non-spatial representation;
- sufficient contrast;
- semantics not dependent on hue alone;
- zoom/reduction without loss of object identity;
- visible focus distinct from analytical selection;
- reduced-motion preference;
- labels/tooltips or accessible names for non-text controls;
- contextual legend/key access without requiring memorization of the entire symbol system.

Accessibility is not a later styling pass. It constrains the notation system from the beginning.

---

## 24. Forbidden visual implications

The following are explicitly disallowed unless the underlying projection/analysis makes the implication true and explains it:

- larger node = more important;
- center node = more important;
- closer nodes = more similar;
- brighter node = more certain;
- faded node = less true;
- more documents = more independent corroboration;
- selected = significant;
- red = false;
- missing = disproven;
- graph force layout = analytical structure;
- animation = temporal explanation;
- tag color = analytical truth;
- current source version = source version originally used;
- file hash verified = content true;
- multiple analysts agree = high confidence;
- warning = high probability.

---

## 25. Implementation sequence

### Phase A — specification and visual primitives

1. Accept this specification as the 0.6.3 design foundation.
2. Create design tokens for spacing, typography, surfaces, rules, accents, focus, selection, and motion.
3. Prototype the Catalyst provenance index, selection registration treatment, compact node frame, and relationship trace using plain SVG/CSS before designing a large icon library.
4. Test the primitives at multiple scales and in monochrome.
5. Derive a provisional Catalyst mark from the notation grammar only after those primitives work in-product.

### Phase B — shell refactor

1. Rebuild primary chrome around Instrument / Portrayal / Notation / Content separation.
2. Move profile/features configuration out of primary analytical toolbar.
3. Introduce stable Reader instrument bar and compact view-state marginalia.
4. Redesign graph nodes/selection/edges using the new primitives.
5. Redesign inspector as structured detail rather than card stack.
6. Replace current generic/placeholder branding.

### Phase C — behavioral foundation

1. Keep current 0.6.2 data model intact while implementing visual semantics that are already supported.
2. Do not fake future provenance, inference, weak-signal, or assessment semantics with decorative UI.
3. Add only visual affordances whose domain meaning currently exists.
4. Document deferred semantics explicitly for 0.7+.

### Phase D — native acceptance

Evaluate at minimum:

- comprehension without tutorial prose;
- selected versus important distinction;
- graph readability at multiple densities;
- source-to-evidence trace recognition;
- tag/layer visibility;
- monochrome/color-blind discriminability;
- reduced cognitive load across capability profiles;
- no false visual implications from node size, location, color, or glow;
- recognizability as Catalyst without relying solely on the wordmark.

---

## 26. 0.6.3 acceptance target

0.6.3 succeeds when Catalyst no longer looks like a skeleton with explanatory prose or a generic dashboard with bespoke colors.

A successful screen should communicate the following visually before the user reads documentation:

- what is source material;
- what is analyst-created structure;
- what object is being inspected;
- how objects relate;
- where saved evidence exists;
- when a layer/filter changes the visible analytical universe;
- which controls belong to the application versus the analysis.

The interface should feel specific to Catalyst because its visual grammar expresses traceability and reasoning, not because it contains intelligence-themed decoration.

---

## 27. Deferred/not frozen in v0.1

The following remain deliberately open pending prototype/recognition testing:

- exact foundational shape geometry;
- exact provenance-index mark;
- exact inference-junction glyph;
- exact Catalyst logo/mark;
- final typefaces;
- final palette values;
- final primary navigation labels;
- exact semantic-zoom thresholds;
- exact uncertainty textures/line patterns;
- whether Watch and Scan are one projection, two projections, or a single anticipation mode;
- permanent 0.7 ontology/schema names.

The semantics and design constraints above are stronger commitments than the literal glyph shapes.

---

## 28. Research references

The following sources materially informed v0.1. They are references, not claims that Catalyst implements any source's complete methodology.

- Office of the Director of National Intelligence, **ICD 203: Analytic Standards** — https://www.dni.gov/files/documents/ICD/ICD-203.pdf
- CIA Center for the Study of Intelligence, **A Tradecraft Primer: Structured Analytic Techniques for Improving Intelligence Analysis** — https://www.cia.gov/resources/csi/books-monographs/a-tradecraft-primer/
- CIA, **The Mapmaker's Craft: A History of Cartography at CIA** — https://www.cia.gov/stories/story/the-mapmakers-craft-a-history-of-cartography-at-cia/
- CIA FOIA, **1986 analyst workstation requirements correspondence** — https://www.cia.gov/readingroom/document/cia-rdp88g01116r001102090015-3
- PNNL, **The Scalable Reasoning System: Lightweight Visualization for Distributed Analytics** — https://www.pnnl.gov/publications/scalable-reasoning-system-lightweight-visualization-distributed-analytics-0
- Georgia Tech, **Jigsaw: a Visual Index on Large Document Collections** — https://faculty.cc.gatech.edu/~john.stasko/papers/hcir07-jigsaw.pdf
- W3C, **Web Annotation Data Model** — https://www.w3.org/TR/annotation-model/
- W3C, **PROV-O / PROV family** — https://www.w3.org/TR/prov-o/
- Library of Congress, **PREMIS Data Dictionary for Preservation Metadata, Version 3.0** — https://www.loc.gov/standards/premis/v3/index.html
- FAA, **Human Factors Design Guidelines** — https://www.govinfo.gov/content/pkg/GOVPUB-TD4_200-PURL-LPS22420/pdf/GOVPUB-TD4_200-PURL-LPS22420.pdf

Additional research completed during the design pass covered link-analysis conventions, semantic zoom, uncertainty visualization, evidence dependence/corroboration, source revision/retraction, bitemporal history, structured expert judgment, dissent, indicators/signposts, linchpin analysis, horizon scanning, weak signals, baselines, early-warning systems, and false-alert discipline. Those findings are reflected in the normative laws above and should be cited in future methodology-specific documentation when those capabilities become implemented.
