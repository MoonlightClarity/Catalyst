# ADR 0020 — Faceted annotation and semantic ontology

Status: **Accepted as conceptual architecture freeze; ADR 0026 supersedes any implication of a formal Assessment product/domain object**

Companion specification: `../annotation-semantic-ontology-v0.1.md`

## Context

Repeated annotation-toolbar iterations exposed a structural error: the interface was being asked to invent analytical meaning through a flat set of mark types.

Existing Catalyst alpha semantics also mix different ontological axes. `NoteSemantics.roles[]` currently places Claim, Assumption, Hypothesis, Question/Gap, Entity, and Event beside one another even though they represent propositions, inquiry states, and world objects respectively.

The annotation problem adds further distinctions that cannot safely collapse: source statement versus analyst assertion, observation report versus verified event, selected text versus evidence, agreement versus corroboration, premise versus inference, confidence versus probability, and missing evidence versus evidence of absence.

Research across intelligence tradecraft, evidence-based reasoning, argumentation, provenance, factuality/attribution, and annotation standards indicates that no single mutually exclusive annotation taxonomy can represent these dimensions without repeated redesign.

## Decision

Catalyst adopts a **faceted semantic model** for future annotation and analytical-domain work.

The toolbar is explicitly a projection over the ontology, not the ontology itself.

The neutral source-derived substrate is an anchored source item carrying attribution and optional independent semantic facets.
Semantic axes include attribution, statement mode, epistemic role, argument role, modality, temporal orientation, normative role, world reference, provenance, and lifecycle/status.

Relationships and inference are first-class objects. Evidence is contextual to a proposition, hypothesis, question, or judgment/evaluation context; it is not synonymous with highlighted text.

Inquiry/monitoring concepts such as Question, Gap, Requirement, Indicator, Trigger, Baseline, and Driver/Linchpin are analyst/workflow objects rather than ordinary source mark types.

Evaluation dimensions such as likelihood, analyst confidence, source reliability, information credibility, independence/corroboration, relevance, diagnosticity, authenticity, and currency remain distinct.

Promotion from source material to analyst-owned analytical content is explicit and provenance-preserving.

A future toolbar may expose operations such as Capture, Classify, Relate, Assess, Question, Promote, and Extract. Its exact surface vocabulary is not frozen by this ADR.

## Consequences

- future annotation work must not introduce another universal `annotationType` enum carrying unrelated dimensions;
- source annotation does not imply analyst endorsement;
- a single passage may legitimately receive multiple semantic facets;
- world-object extraction and epistemic classification remain orthogonal;
- support/disfavor/conflict/qualification/provenance are relation semantics rather than colors or paint tools;
- Warrant/inference is modeled primarily in the reasoning graph rather than assumed to be explicitly stated source text;
- plain highlight may remain only as a nonsemantic reading utility;
- existing `NoteSemantics`, annotation persistence, and relationship vocabularies remain compatibility mechanisms until separately migrated.

## Migration constraint

This ADR does not authorize an irreversible persistence migration. Any migration must define legacy mappings, cardinality, attribution nesting, extensibility, rollback, and export/interchange behavior.
