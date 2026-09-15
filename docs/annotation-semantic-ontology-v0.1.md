# Catalyst Annotation & Semantic Ontology v0.1

Status: **Conceptual ontology frozen; implementation projection not frozen; ADR 0026 removes formal Assessment as a Catalyst product/domain concept**  
Decision record: `adr/0020-faceted-annotation-semantic-ontology.md`  
Scope: source annotation, analyst reasoning, evidence, inquiry, monitoring, provenance, and toolbar semantics

## 1. Purpose

Catalyst annotations must preserve what a source contains without silently converting source material into analyst belief, fact, evidence, confidence, or judgment.

This specification freezes the conceptual semantic model that future annotation, source/evidence semantics, Outline, Map, and reasoning features must project from. Lowercase assessment/evaluation language in this document refers to attributed judgment dimensions, not the removed formal Assessment product surface.

It does **not** freeze the final toolbar layout, iconography, shortcuts, or interaction sequence. Those are projections over this ontology and may evolve without changing analytical meaning.

## 2. Governing rule

**The toolbar is not the ontology.**

A toolbar command is an operation over analytical objects and facets. It must never become the sole storage location or definition of analytical meaning.

No future universal `annotationType` enum may be expected to carry attribution, epistemic role, argument role, evidence relation, world-object type, confidence, provenance, and workflow state at once.

## 3. Source/analyst boundary

Marking a source passage records what the analyst identifies **in the source**. It does not imply endorsement.
A source passage classified as a judgment means:

```text
SourceItem
  anchor -> exact source region
  attribution -> source speaker/author chain
  epistemicRole -> judgment
```

It does **not** mean the Catalyst analyst adopts that judgment.

Analyst adoption or reuse is an explicit operation:

```text
SourceItem
  -> promote / derive
AnalystObject
  provenance -> derived-from SourceItem
```

This rule applies equally to observations, assumptions, hypotheses, conclusions, forecasts, recommendations, and other source content.

## 4. Neutral source substrate

The basic source-derived object is a neutral anchored `SourceItem` (name provisional at schema level).

A `SourceItem` contains source identity, exact anchor, selected content/reference, attribution, timestamps, provenance, and zero or more semantic facets.

A source item is not intrinsically a fact, evidence item, analyst judgment, or world object.

## 5. Faceted semantics

One source item may carry multiple independent facets. These axes must not be collapsed into one mutually exclusive role.

### 5.1 Attribution

Who is responsible for the proposition or report?

Examples: document author, quoted person, organization, witness, expert, anonymous source, analyst.

Nested attribution is valid. Catalyst must be able to distinguish the document author's statement from a quoted person's statement and from the analyst's own judgment/evaluation.

### 5.2 Statement mode

- assertion;
- question;
- directive/request.

### 5.3 Epistemic role

- observation-report;
- assumption;
- hypothesis;
- judgment/assessment.

`Observation` means an attributed report of observed/found material. It is not a Catalyst declaration that the reported content is true.

### 5.4 Argument role

- reason/premise;
- conclusion;
- qualification/caveat;
- objection/counterpoint.

`Reason` may be explicitly marked in source text. A `Warrant` or inference rule belongs primarily to the reasoning graph because it may be implicit or analyst-reconstructed.

### 5.5 Modality and uncertainty language

Examples: asserted, possible, probable, conditional, counterfactual.

Modality is not analyst confidence and must not reuse the confidence visual channel.

### 5.6 Temporal orientation

Examples: past, current, forecast/future.

A forecast may simultaneously be a judgment, conclusion, causal claim, and low-certainty statement.

### 5.7 Normative role

Examples: descriptive, evaluative, recommendation/policy.

### 5.8 World reference

Examples: person, organization, place, event, time, quantity, asset/object.

World-object identity is orthogonal to epistemic role. `Entity` and `Event` must not remain peers of `Assumption` and `Hypothesis` in one role enum.

### 5.9 Provenance role

Examples: quote, paraphrase, summary, translation, extracted-from, derived-from, revised-from.

### 5.10 Lifecycle/status

Examples: current, disputed, corrected, superseded, retracted, stale, deleted/removed.

## 6. Evidence is contextual, not an intrinsic mark

Catalyst does not treat `Evidence` as a universal passage type.

A source item becomes evidence in relation to a proposition, hypothesis, question, or judgment/evaluation context.

```text
SourceItem E1
  -- favors --> Hypothesis H1
  -- disfavors --> Hypothesis H2
```

Without the target/context, `Evidence` is underspecified.

`supports`, `disfavors`, `conflicts-with`, `qualifies`, and similar meanings are therefore relations, not paint styles.

Corroboration is also relational and source-dependent. Repetition or multiple documents must never automatically imply independent corroboration.

Catalyst must preserve source-origin independence as established, likely, unknown, or shared/dependent where the domain later supports it.


## 7. Relationship families

Relations are first-class analytical objects and may carry their own provenance, attribution, uncertainty, timestamps, and status.

### 7.1 Reasoning relations

- bears-on;
- favors;
- disfavors;
- conflicts-with;
- reasons-for;
- depends-on;
- assumes;
- qualifies/conditions.

### 7.2 Semantic/world relations

Examples: about, owns, member-of, located-at, precedes, causes.

### 7.3 Provenance relations

Examples: extracted-from, quotes, translates, summarizes, derived-from, revised-from.

### 7.4 Inference objects

Joint reasoning must be representable independently from its inputs:

```text
E1 --\
E2 ----> Inference/Junction --> Judgment J1
A1 --/
```

The inference or warrant may be challenged without denying that E1, E2, or A1 exist.


## 8. Inquiry and collection objects

These are analytical/workflow objects rather than ordinary source classifications:

- `Question` — what the analyst wants to know;
- `Gap` — material information currently missing;
- `Requirement` — information/evidence needed to resolve a question, gap, or discriminator;
- `Indicator` — observable expected under a hypothesis/scenario;
- `Trigger` / revision condition — observation that should cause reconsideration;
- `Baseline` — reference state against which deviation is evaluated;
- `Driver` / `Linchpin` — analyst-designated factor with disproportionate influence.

A source may itself discuss one of these concepts; that remains a source assertion until explicitly promoted into an analyst-owned analytical object.

## 9. Evaluation dimensions remain separate

The following dimensions must not collapse into one score, color, or mark type:

- analyst likelihood/probability;
- analyst confidence in the analytical basis;
- source reliability;
- information credibility;
- corroboration/source independence;
- relevance;
- diagnosticity;
- authenticity/integrity;
- currency/staleness;
- deception/manipulation risk where explicitly assessed.

`Importance`, `significance`, generic `uncertain`, and generic `trust` are not sufficient substitutes for these dimensions.

Unknown, unsupported, disputed, refuted, contrary, missing, absent-under-adequate-observation, stale, superseded, and retracted are different states.


## 10. Anomaly and weak-signal semantics

`Anomaly` is not an intrinsic source mark. It requires comparison to an explicit or implicit baseline:

```text
Observation -> compared-to Baseline -> Deviation -> Interpretation
```

`Weak signal` is an attributed interpretation/evaluation that an observation may indicate emerging change. It is not a weak evidence item and must not be encoded merely by low saturation or a warning color.

## 11. Toolbar projection rules

The toolbar must expose **operations**, not pretend to be the ontology.

Candidate operation families:

- **Capture** — preserve selected source material without adding analytical meaning;
- **Classify** — apply source-semantic facets such as observation-report, assumption, hypothesis, judgment, reason, conclusion, or caveat;
- **Relate** — connect the source item to propositions, hypotheses, questions, or other objects;
- **Evaluate** — record credibility, reliability, relevance, confidence, independence, or other supported evaluation dimensions;
- **Question** — create or connect inquiry objects;
- **Promote** — derive an analyst-owned object from source material while preserving provenance;
- **Extract** — identify world objects such as entities, events, places, times, and quantities.

The final labels, grouping, iconography, shortcuts, and number of visible controls are **not frozen by this specification**.

A plain reading highlight may survive as a nonsemantic utility. It must not imply evidence, importance, agreement, confidence, or analytical status.


## 12. Forbidden collapses

Future implementations must not equate:

- source assertion with analyst endorsement;
- report with fact;
- observation-report with verified event;
- evidence with selected/highlighted text;
- repetition with corroboration;
- contrary information with logical contradiction;
- missing evidence with evidence of absence;
- uncertainty with low importance;
- confidence with probability;
- source reliability with information credibility;
- entity/event type with epistemic role;
- selection/focus with analytical significance.

## 13. Current compatibility model and migration direction

The existing `NoteSemantics.roles[]` model remains a compatibility layer. Its current peer roles (`Claim`, `Assumption`, `Hypothesis`, `Question/Gap`, `Entity`, `Event`) mix several axes and must not define the permanent ontology.

The current `Annotation` plus `NoteAnnotationLink` evidence bridge also remains transitional.

Migration work should preserve existing user data while progressively mapping it into:

```text
SourceAnchor / SourceItem
Facets
AnalystObject
Relationship / Inference
Evaluation dimensions / analyst judgment
Inquiry / Monitoring objects
Provenance history
```

No irreversible persistence migration is authorized by this document alone. A schema migration requires a separate implementation ADR and migration/rollback plan.


## 14. Narrow engineering questions left open

The conceptual ontology is frozen, but the implementation must still specify:

1. cardinality for each facet and relation family;
2. representation of nested attribution and quoted-source chains;
3. exact mapping from legacy annotation and `NoteSemantics` values;
4. core relation vocabulary versus workspace-extensible relations;
5. stable identifiers and versioning for promoted/derived objects;
6. UI projection and progressive disclosure by capability profile;
7. export/interchange mappings where W3C Web Annotation, PROV, AIF, or other standards are useful boundaries.

These are schema and interaction-design questions, not reasons to reopen the conceptual ontology without contrary evidence.

## 15. Research and standards lineage

This model is intentionally Catalyst-native while borrowing tested distinctions from multiple lineages:

- ICD 203/206: underlying information versus assumptions/judgments; sourcing; alternatives; uncertainty; supporting and contrary information;
- Schum/Tecuci/Laskey evidence-based reasoning: evidence as contextual to hypotheses, source credibility, relevance, inferential force, and source dependence;
- Argument Interchange Format (AIF): information content separated from inference/conflict operations;
- Toulmin-style argumentation: reasons/grounds, claims/conclusions, warrants, qualifiers, and rebuttal conditions;
- W3C Web Annotation: target/body/motivation separation and robust source anchoring;
- W3C PROV: entity/activity/agent lineage concepts;
- factuality, attribution, and argument-mining research: source/conceiver attribution, modality, argumentative components, and multi-label semantic roles.

Catalyst does not need to serialize its internal model as RDF, AIF, or PROV. Standards are preferred at interoperability boundaries where they improve clarity and portability.


## 16. Freeze rule

This ontology is considered frozen at the **conceptual architecture** level for the next annotation-toolbar/domain implementation pass.

Reopening it requires one of:

- a concrete contradiction discovered during schema design;
- an important analytical operation that cannot be represented without semantic loss;
- evidence that two frozen distinctions cannot be used reliably in practice;
- migration constraints that make the model materially unsafe;
- a later ADR explicitly superseding this specification.

Visual dissatisfaction, desire for more icons, or convenience of a flat enum are not sufficient reasons to reopen the ontology.
