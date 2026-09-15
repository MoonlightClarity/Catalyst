# Catalyst 0.7 Alpha Architecture Contract — 2026-09-14

Status: **superseded historical research; not a current implementation contract**  
Scope: post-0.6 alpha architecture convergence research before later product-boundary decisions  
Project: Catalyst

> Superseded on 2026-09-15 by the current architecture/decision set. In particular, formal Assessment and the standalone Evidence/tag-clustering direction were retired. Preserve this file as research history; do not use it to restore removed product surfaces or alpha-only compatibility schemas.

## Executive conclusion

Catalyst is still in alpha and has no users. This changes the engineering priority: the application should optimize for the correct long-term architecture rather than preserve compatibility with alpha-only schemas and interaction models.

The current application has already proved several interaction ideas: source-first reading, exact source return, Outline-first structural authoring, a generated Map, structured analytic techniques, local XML persistence, and an Assessment projection. Those should be preserved.

Several underlying abstractions have now reached the end of their useful life and should be removed rather than migrated indefinitely: the legacy graph state, freeform map geometry, generic multiple-map scaffolding, `noteLinks`, the universal pairwise `Relationship`, flat Note semantics, confidence stored on Notes, and mixed-purpose annotation metadata.

The 0.7 goal is therefore **architectural compression, not a rewrite**. Keep the successful surfaces and replace the alpha scaffolding underneath them with one coherent analytical record.

## Core product contract

Catalyst's interaction model is now:

```text
Source / Reader
      ↓
evidence capture
      ↓
Outline authors structure
      ↓
Map portrays structure
      ↓
Assessment synthesizes analytical state
```

The corresponding analytical-record contract is:

```text
Source / SourceVersion
      ↓
SourceRegion
      ↓
Evidence
      ↓
AnalyticalItem / Proposition
      ↓
ReasoningAssertion
      ↓
Assessment
```

Semantic/world relations and provenance relations sit alongside this chain rather than being collapsed into the same relationship type.

The strongest architectural rule for 0.7 is:

> **Outline, Map, Assessment, ACH, Timeline, Watch, and future briefing views are projections over one analytical record, not independent feature databases.**

## Why this reset is appropriate now

Before beta, correctness of the fundamental model matters more than backward compatibility with internal alpha workspaces. Catalyst currently has no user base whose data or workflows require compatibility guarantees.

Accordingly, 0.7 may deliberately break the alpha workspace schema, replace internal types, update fixtures, and delete legacy state. Temporary migration code should exist only if it preserves valuable development fixtures; it should not become permanent compatibility infrastructure without a real compatibility requirement.

## What has already proved itself

The following should be treated as durable product decisions unless new evidence contradicts them:

- Reader/source-first workflow.
- SHA-256 content identity for imported PDF bytes.
- Exact source-region capture and return.
- Viewer-native annotations as a durable markup layer.
- Notes as low-friction authored analytical material.
- Outline-first structural editing.
- Deterministic generated Map rather than freeform map authoring.
- Structured analytic technique definitions and run snapshots.
- Tags and tag assignments.
- Assessment as a high-level analyst-facing projection.
- Local-first XML persistence.
- Capability/profile controls to reduce cognitive load.
- Portrayal as a projection problem rather than the canonical data model.

The architecture work should preserve these behaviors while simplifying the underlying state.

## Alpha scaffolding to remove or replace

The following should not be carried into beta merely because they exist today:

- `graphView` positions and graph camera as authored analytical state.
- Freeform map dragging, resizing, drop resolution, manual node positions, and manual node sizes.
- Generic `MapViewState { activeMapId, maps }` multi-map scaffolding when only one structural analysis is reachable in the live product.
- Canonical `noteLinks` and relationship mirroring into legacy note links.
- One-relationship-per-unordered-note-pair uniqueness.
- One universal `RelationshipType` enum for world semantics, reasoning, and provenance.
- Flat `AnalyticalRole` semantics that place entity, event, claim, assumption, hypothesis, and question on one axis.
- Generic confidence stored on `NoteSemantics`.
- Annotation-purpose metadata that mixes evidentiary importance, contradiction, uncertainty, and follow-up workflow state in one enum.
- Persistence of almost the entire React/domain state simply because it lives inside `WorkspaceState`.

## Current-state field disposition

| Current field | 0.7 disposition | Rationale |
| --- | --- | --- |
| `documents` | Keep + evolve | Existing browser IDs are content hashes; evolve into Source + SourceVersion. |
| `annotations` | Rewrite/split | Preserve source-region capture, but separate marking from analytical Evidence. |
| `viewerMarkups` | Keep, separate layer | Durable reader markup, not analytical truth. |
| `notes` | Keep + evolve | Low-friction authored content remains valuable. |
| `links` | Rewrite | Replace generic note↔annotation linkage with neutral Citation and explicit reasoning. |
| `noteLinks` | Delete | Legacy compatibility mirror. |
| `customTechniqueDefinitions` | Keep as library/configuration | Not analytical-record truth; runs preserve snapshots. |
| `techniqueRuns` | Keep + evolve | Strong provenance mechanism; generalize beyond one note. |
| `pendingSelection` | Session only | Already correctly excluded from durable persistence. |
| `activeDocumentId` | Session/recovery only | Navigation state. |
| `activeNoteId` | Session/recovery only | Selection state. |
| `graphView` | Delete | Legacy graph-position/camera model. |
| `mapView` | Replace | Split durable Outline structure from derived Map layout and session viewport. |
| `capabilities` | Preferences | Persist separately from analytical truth. |
| `noteSemantics` | Rewrite | Mixes incompatible classification dimensions. |
| `relationships` | Replace | Split world semantics, reasoning, and provenance. |
| `evidenceTags` / `annotationTags` | Keep + generalize | Assignment mechanism is useful; naming can become generic. |
| `annotationRoles` | Consolidate/delete | Mostly duplicates capture/markup mode. |

## Separate the three persistence concerns

Catalyst should stop treating one monolithic state object as both analytical truth and UI state.

### 1. AnalyticalRecord

Portable, auditable, exportable, and suitable for long-term compatibility once beta begins.

It contains sources, source versions, source regions, evidence, analytical items and revisions, authored structure, citations, semantic relations, reasoning assertions, provenance, assessments, tags, and technique runs.

### 2. WorkspaceSession

Recoverable but disposable operational state.

It contains the active source/item, current surface, reader location, outline fold state, map focus and pan, search state, and navigation history.

### 3. WorkspacePreferences

Persistent configuration rather than analytical content.

It contains capability profile/overrides and future display preferences.

These three concerns may all be persisted, but they should not share the same semantic status or export contract.

## Source and provenance model

Catalyst already hashes imported PDF bytes with SHA-256 and uses that digest as the browser `documentId`. Preserve this. It is a good immutable representation/version identity.

The missing layer is stable identity across versions or representations of the same source.

```ts
type Source = {
  id: string;
  title: string;
  createdAt: string;
  updatedAt: string;
};

type SourceVersion = {
  id: string;              // content-addressed; e.g. sha256-...
  sourceId: string;
  contentHash: string;
  mediaType: string;
  fileName: string | null;
  capturedAt: string;
};
```

A changed PDF therefore becomes a new `SourceVersion`, not a mutation of prior bytes. Multiple versions may belong to one `Source` when the analyst identifies them as versions/representations of the same underlying publication or record.

Exact source anchoring belongs to the version/representation, not to an abstract source:

```ts
type SourceRegion = {
  id: string;
  sourceVersionId: string;
  quote: string;
  pageIndex: number;
  anchors: SourceAnchor[];
  createdAt: string;
};
```

The existing redundant source-region identity logic—page/range/quote/geometry with tolerant equivalence—should be preserved and evolved rather than discarded.

Future source metadata may include author/origin, publication/collection time, source type, access method, reliability, and version lineage. Do not collapse source reliability into evidence credibility or assessment confidence.

## Markup, source regions, citations, and evidence are different

The reader layer must not equate a highlight or excerpt with analytical evidence.

A markup is a reading/annotation artifact. A `SourceRegion` is an addressable piece of source material. A `Citation` means an analytical item refers to that region. `Evidence` means the analyst has admitted the grounded information into the analytical record for evidentiary use.

This distinction preserves low-commitment reading while allowing rigorous analysis later.

```ts
type Evidence = {
  id: string;
  sourceRegionId: string;
  note: string | null;
  createdAt: string;
};

type Citation = {
  id: string;
  itemId: string;
  sourceRegionId: string;
  createdAt: string;
};
```

Four quotations do not necessarily mean four sources. Several regions may come from one document, several documents may derive from one upstream origin, or several genuinely independent sources may corroborate the same proposition. The model must preserve enough provenance to distinguish those cases.

## Analytical items and revisions

Catalyst should preserve Notes as the low-friction authoring experience while giving durable analytical identities explicit revision history.

The main reason is referential integrity: evidence and reasoning must not silently appear to support materially changed claim text merely because a Note body was edited in place.

```ts
type AnalyticalItem = {
  id: string;
  kind: AnalyticalItemKind;
  currentRevisionId: string;
  createdAt: string;
  archivedAt: string | null;
};
```

```ts
type ItemRevision = {
  id: string;
  itemId: string;
  title: string;
  body: string;
  createdAt: string;
  supersedesRevisionId: string | null;
};
```

The UI may still present this as ordinary note editing. The revision boundary exists underneath to preserve historical meaning.

A provisional classification that avoids the current flat-role problem is:

```ts
type AnalyticalItemKind =
  | "note"
  | "proposition"
  | "question"
  | "entity"
  | "event";

type PropositionRole =
  | "observation"
  | "claim"
  | "assumption"
  | "hypothesis";
```

`entity` and `event` describe what something is in the represented world. `claim`, `assumption`, and `hypothesis` describe the epistemic function of propositions. `question` is an inquiry state/type. These dimensions should no longer be forced onto one role axis.

Do not over-formalize this immediately. A generic `note` must remain available so analysts can think before classifying.

## Outline is authored structure

The old architecture prototype correctly separated identity from occurrence, but its free-spatial `Occurrence { x, y }` no longer matches the product. ADR 0021 and `docs/outline-ontology-v0.1.md` now freeze the structural ontology.

0.7 has one canonical authored Outline per AnalysisRoot. Its static vocabulary is a root plus three item kinds:

```ts
type OutlineReferenceItem = {
  id: string;
  kind: "reference";
  itemId: string;
  parentItemId: string;
  siblingOrder: number;
};

type OutlineGroupItem = {
  id: string;
  kind: "group";
  label: string;
  parentItemId: string;
  siblingOrder: number;
};

type OutlineQueryItem = {
  id: string;
  kind: "query";
  label: string;
  query: OutlineQuery;
  parentItemId: string;
  siblingOrder: number;
};

type OutlineItem = OutlineReferenceItem | OutlineGroupItem | OutlineQueryItem;

type Outline = {
  id: string;
  analysisRootId: string;
  rootItemId: string;
  items: Record<string, OutlineItem>;
};

// The RootItem projects AnalysisRoot.title; do not duplicate the root title in Outline state.
```

Reference items are placements of analytical identity, so the same AnalyticalItem may appear more than once without being duplicated. Alias placements share analytical content, not subtrees. Group items are structural scaffolding only; query results are virtual until materialized.

Hierarchy/order carry no analytical meaning or metadata inheritance. Analytical relations continue to address analytical identities rather than OutlineItem IDs. Removing a placement is distinct from deleting/archiving its AnalyticalItem.

The Map is generated from static Outline structure and portrayal rules. Query results are outline-only/generated overlays by default rather than silently restructuring the canonical Map. The Map must not persist authored node coordinates, node sizes, manual-layout flags, or a hidden freeform editing model.

`collapsed`, focus, selection, query expansion, relationship-to-placement render bindings, and viewport/geometry belong to session/presentation state rather than analytical structure. `branchSide` should be derived unless a later explicit product decision gives it stable authored meaning.

## Relationship architecture: three semantic families

The current universal pairwise `Relationship` model mixes fundamentally different meanings. 0.7 should separate them.

### SemanticRelation — world/domain meaning

```ts
type SemanticRelationType =
  | "related-to"
  | "about"
  | "precedes"
  | "causes"
  | "part-of"
  | "associated-with";

type SemanticRelation = {
  id: string;
  subjectItemId: string;
  predicate: SemanticRelationType;
  objectItemId: string;
  label: string | null;
  createdAt: string;
  updatedAt: string;
};
```

Multiple relations may exist between the same two items. Temporal adjacency and causal dependency, for example, must be representable simultaneously.

### ReasoningAssertion — analytical support/counterargument

Binary edges are insufficient when several premises jointly support one conclusion, when rationale/warrant matters, or when a structured technique produces the reasoning.

```ts
type ReasoningPremise =
  | { kind: "evidence"; id: string }
  | { kind: "item"; id: string };

type ReasoningAssertion = {
  id: string;
  premises: ReasoningPremise[];
  conclusionItemId: string;
  polarity: "support" | "counter";
  rationale: string | null;
  techniqueRunId: string | null;
  createdAt: string;
  updatedAt: string;
};
```

This permits joint support:

```text
Evidence E1 ─┐
Evidence E2 ─┼──> Reasoning R1 ───> Proposition H1
Assumption A1┘
```

The UI should normally portray this quietly as a direct trace or small junction. The reasoning record is first-class underneath without becoming another prominent box analysts must manage manually.

### ProvenanceRelation — derivation/lineage

```ts
type ProvenanceRelationType =
  | "extracted-from"
  | "summarized-from"
  | "translated-from"
  | "transformed-from"
  | "forked-from";

type RecordRef =
  | { kind: "source-version"; id: string }
  | { kind: "source-region"; id: string }
  | { kind: "evidence"; id: string }
  | { kind: "item"; id: string };

type ProvenanceRelation = {
  id: string;
  type: ProvenanceRelationType;
  from: RecordRef;
  to: RecordRef;
  techniqueRunId: string | null;
  createdAt: string;
};
```

`derived-from` therefore leaves the ordinary semantic edge vocabulary. `depends-on` should also be removed as a generic predicate because it can mean world dependency, reasoning dependency, or technical/provenance dependency depending on context.

`related-to` may survive as an intentionally weak world-semantic relation for low-commitment analysis.

## Assessment is a judgment about a proposition

A proposition can remain stable while assessments of it change over time. Likelihood and confidence therefore belong on Assessment, not on the proposition/Note itself.

```ts
type AssessmentConfidence = "low" | "moderate" | "high";

type LikelihoodBand =
  | "remote"
  | "very-unlikely"
  | "unlikely"
  | "roughly-even"
  | "likely"
  | "very-likely"
  | "nearly-certain";

type Assessment = {
  id: string;
  propositionItemId: string;
  likelihood: LikelihoodBand | null;
  confidence: AssessmentConfidence | null;
  confidenceRationale: string | null;
  horizon: string | null;
  assessedAt: string;
  supersedesAssessmentId: string | null;
  status: "draft" | "current" | "superseded";
};
```

Likelihood and confidence remain separate concepts. The architecture must permit statements such as “likely, low confidence because the source base is weak.”

Supporting evidence, assumptions, alternatives, and counterarguments should not be embedded as duplicate arrays inside Assessment. They are discoverable through `ReasoningAssertion` and the underlying propositions/evidence.

The current Assessment tab should be preserved as a projection but reconnected to these records. Its present use of `claim` Notes, Note confidence, linked annotation counts, and binary `supports/contradicts` edges is an alpha approximation, not the final data contract.

## Analysis root and key judgments

“Key judgment” is contextual, not an intrinsic proposition type. A proposition may be a key judgment in one analysis and supporting material elsewhere.

For the current single-analysis architecture:

```ts
type AnalysisRoot = {
  id: string;
  title: string;
  issueItemId: string | null;
  keyAssessmentIds: string[];
  createdAt: string;
  updatedAt: string;
};
```

This replaces the current tendency to overload map names, master nodes, and `claim` roles with the concept of the analytical bottom line.

Do not reintroduce generic multiple maps simply to represent future sub-analyses. If bounded analysis contexts become necessary, add an explicit `AnalysisContext` concept later with defined semantics.

## Structured analytic techniques operate on the shared record

The SAT catalog should not create hundreds of specialized storage schemas. Technique definitions provide workflow; the shared analytical record provides durable output types.

`TechniqueRun.noteId` is too narrow for methods such as ACH that inherently concern multiple hypotheses, evidence items, assumptions, or judgments.

A future run contract should resemble:

```ts
type TechniqueRun = {
  id: string;
  subjectRefs: RecordRef[];
  definitionId: string;
  definitionVersion: number;
  definitionSnapshot: TechniqueDefinition;
  responses: Record<string, string>;
  createdAt: string;
  updatedAt: string;
};
```

Records created or materially changed through a technique may refer back through `techniqueRunId`.

Examples: ACH creates or updates hypothesis propositions, evidence interpretations, reasoning assertions, and assessments; Key Assumptions Check exposes assumptions used as reasoning premises; Quality of Information updates source/evidence quality; Indicators & Signposts uses propositions plus monitoring metadata; Devil's Advocacy creates counter-reasoning.

The catalog's next value comes from integration, provenance, fidelity, sequencing, aliases, prerequisites, and outputs—not further raw count expansion.

## Proposed durable 0.7 record

The target shape is approximately:

```ts
type AnalyticalRecord = {
  formatVersion: 7;
  analysis: AnalysisRoot;

  sources: Record<string, Source>;
  sourceVersions: Record<string, SourceVersion>;
  sourceRegions: Record<string, SourceRegion>;
  sourceMarkups: Record<string, ViewerMarkup>;

  evidence: Record<string, Evidence>;

  items: Record<string, AnalyticalItem>;
  itemRevisions: Record<string, ItemRevision>;
  outline: Outline;
  citations: Record<string, Citation>;

  semanticRelations: Record<string, SemanticRelation>;
  reasoningAssertions: Record<string, ReasoningAssertion>;
  provenanceRelations: Record<string, ProvenanceRelation>;
  assessments: Record<string, Assessment>;

  tags: Record<string, Tag>;
  tagAssignments: TagAssignment[];
  techniqueRuns: Record<string, TechniqueRun>;
};
```

The exact names and some field details remain provisional. The important contract is the separation of responsibilities and the prohibition against collapsing these concepts merely because they can all be drawn as nodes or edges.

## Proposed session and preference state

```ts
type WorkspaceSession = {
  activeSourceVersionId: string | null;
  activeItemId: string | null;
  surface: "reader" | "analysis" | "assessment" | "methods";
  readerLocation: ReaderLocation | null;
  collapsedOutlineItemIds: string[];
  mapFocusItemId: string | null;
  mapPan: { x: number; y: number };
  navigationHistory: NavigationLocation[];
};

type WorkspacePreferences = {
  capabilityProfile: CapabilityProfileId;
  capabilityOverrides: Partial<Record<CapabilityId, boolean>>;
};
```

Session persistence may be used for crash recovery and continuity. It should be possible to discard session state without losing analytical content.

Preferences may be persisted independently and should not pollute analytical exports.

## What the September 12 architecture prototype proved

The disposable prototype separated identity, revision, occurrence, context-local role, structure, picture context, semantic assertion, connector portrayal, source provenance, focus context, and derived state. Its deterministic mutation trace passed 14/14 declared-versus-observed state-boundary checks.

High-value findings from that prototype remain valid:

- Moving or portraying an occurrence must not mutate analytical identity.
- Reusing an identity must not silently duplicate it.
- Semantic assertion must remain distinct from connector portrayal.
- Hiding a connector must not delete the assertion.
- Shared-content revision must preserve the prior revision.
- Source re-resolution must append an observation rather than rewrite the authored anchor/representation.
- Destructive operations must name and preview their layer/cascade.
- Focus/return and derived layout are separate from durable analytical meaning.

What did *not* survive later product convergence is the prototype's free-spatial occurrence model and generic multi-picture structure. Outline-first authoring and the locked generated Map replace those assumptions.

The correct lesson is therefore: **the prototype's state-separation principles survived; its spatial model did not.**

## Why explicit reasoning is required

The current binary pairwise relationship cannot faithfully represent:

- several premises jointly supporting one conclusion;
- separate independent versus joint support;
- rationale/warrant on the connection itself;
- technique/method provenance for a conclusion;
- a counterargument targeting a line of reasoning;
- several distinct reasoning paths between the same propositions;
- world relations and evidentiary assertions coexisting between the same identities.

`ReasoningAssertion` is therefore a first-class qualified relation underneath the UI, not another visible “thing” the analyst must arrange on the Map.

## Stress-test coverage

The proposed substrate has been checked conceptually against major Catalyst workflows without requiring another major primitive.

**ACH:** hypotheses are propositions; evidence remains evidence; matrix judgments become reasoning assertions; the technique run provides provenance; assessments express the resulting judgments.

**Key Assumptions Check:** assumptions remain propositions with an epistemic role and become premises in reasoning. No separate Assumption class is required.

**Process Tracing / causal analysis:** world-semantic causal relations describe the proposed mechanism while evidence and reasoning assertions support or counter the causal propositions. Temporal adjacency and causality remain distinct.

**Incident reconstruction:** `precedes` and causal relations may coexist between the same events; the model does not force one edge per pair.

**Source independence / circular reporting:** provenance relations preserve derivation so apparent corroboration can eventually be distinguished from genuinely independent sourcing.

**Dissent / Team A-Team B:** multiple assessments and/or reasoning assertions can concern the same proposition without overwriting the proposition itself.

**Assessment revision:** later assessments supersede earlier assessments while the underlying proposition remains stable.

**Indicators & Signposts:** initially model indicators as propositions plus monitoring metadata rather than introducing another core class. Promote Indicator to a dedicated object only if Watch requires thresholds, recurring observations, alerting, cadence, or ownership.

## Portrayal consequences

A richer domain model must not create a noisier Map.

If two analytical items have a temporal relation, a causal relation, multiple reasoning assertions, and provenance connections, Catalyst should not draw every relation simultaneously as parallel arrows.

Portrayal lenses can project genuine semantic families:

- Structure: Outline hierarchy and generated branches.
- Time: temporal semantic relations.
- Reasoning: support/counter assertions and reasoning junctions.
- Sources: citations, evidence, and provenance.
- Assessment: judgment/uncertainty state.

At normal scale the Map should remain quiet. Selecting a trace or junction can reveal “why does this support this judgment?”, premises, rationale, source return, method provenance, and counterevidence.

The existing custom junction visual language now has a precise potential role: **there is reasoning here**. It should not become a decorative node category.

## Second-order reasoning is deferred

A future system might allow evidence to support a relation itself—for example, evidence for the assertion “Event A caused Event B.”

0.7 does not need first-class assertions-about-relations. Represent the causal claim as a proposition that can receive evidence/reasoning, while the semantic causal relation portrays the accepted/world-model connection. Add relation-targeted reasoning later only if real usage proves the need.

## Research precedents supporting the separation

This architecture is consistent with multiple independent standards and argumentation models:

- **ODNI ICD 203** separates source quality/credibility, likelihood, analyst confidence, underlying intelligence, assumptions, judgments, alternatives, indicators, contrary information, and judgment revision. Likelihood and confidence are explicitly different concepts.
- **CIA Tradecraft Primer** treats assumptions and indicators as persistent parts of reasoning and monitoring rather than mere prose decorations.
- **W3C Web Annotation Data Model** supports resilient source anchoring using quote, position, fragment, and other selectors plus representation state/version context.
- **W3C PROV-O** distinguishes Entity, Activity, and Agent and uses qualified relations when a relationship itself needs metadata. This supports keeping simple relations simple while reifying richer reasoning/provenance when required.
- **Argument Interchange Format (AIF)** makes inference/conflict applications explicit rather than treating meaningful reasoning as anonymous information-to-information edges.
- **SEPIO** distinguishes propositions, statements/assessments, evidence items, and EvidenceLines; it also permits simple evidence shortcuts when full evidence-line modeling is unnecessary.
- **SACM** models an asserted inference from one or more sources/premises to a conclusion and separates the argument assertion from its visual/argumentation presentation.
- **Toulmin-style argumentation** reinforces the need to distinguish grounds, claim, and warrant/reasoning when the connection itself matters.

These sources converge on the same practical principle: **a relationship that carries analytical meaning is sometimes itself an authored assertion and should be representable independently of its visual connector.**

Reference starting points:

- ODNI ICD 203: https://www.dni.gov/files/documents/ICD/ICD-203.pdf
- ODNI analytic objectivity/tradecraft standards: https://www.dni.gov/index.php/how-we-work/objectivity
- CIA Tradecraft Primer: https://www.cia.gov/resources/csi/books-monographs/a-tradecraft-primer/
- W3C Web Annotation Data Model: https://www.w3.org/TR/annotation-model/
- W3C PROV-O: https://www.w3.org/TR/prov-o/
- AIF core paper: https://web.mit.edu/~irahwan/www/docs/AIJ2007.pdf
- SEPIO LinkML core: https://sepio-framework.github.io/sepio-linkml/
- SACM 2.1: https://www.omg.org/spec/SACM/2.1/PDF

## 0.7 deletion targets

Once the interaction contract is protected by tests, the implementation should remove or retire the following rather than keep them disabled behind flags:

- `GraphViewState` and old graph position/camera reducer actions.
- Legacy graph layout fallbacks that consume `noteLinks`.
- `MapOccurrence.position`, `size`, and `manual` when deterministic layout is authoritative.
- Map drag/resize/drop state and pointer handlers used only by the superseded freeform editor.
- `noteLinks` as a canonical semantic representation.
- legacy note-link-to-Relationship hydration.
- one-relation-per-unordered-pair enforcement.
- obsolete multi-map create/switch assumptions and `activeMapId` if no deliberate multi-context feature replaces them.
- stale documentation that treats analyst-authored free geometry or semantic zoom as the current product contract.

## Proposed implementation sequence

0.7 should be a deliberate architecture break, not a long dual-model migration.

1. Restore a known-green combined tree: fix the XML runtime test harness context, resolve the Delete/Backspace contract, run build/tests/licenses, and perform a fresh non-destructive runtime acceptance pass.
2. Freeze interaction principles, not the old schema: Outline authors structure; Map is deterministic portrayal; Reader is source truth; Assessment is a projection.
3. Introduce the new analytical-record types and separate session/preferences from record state.
4. Convert source records into Source + SourceVersion while preserving SHA-256 content identity and exact source-return behavior.
5. Separate SourceRegion/Citation/Markup/Evidence semantics.
6. Replace map occurrences with authored Outline entries; reconnect the generated Map to Outline structure.
7. Remove the legacy graph/freeform map engine rather than leave it hidden under structure-lock flags.
8. Replace universal `Relationship` with SemanticRelation, ReasoningAssertion, and ProvenanceRelation.
9. Add first-class Assessment and move likelihood/confidence off generic Note semantics.
10. Reconnect the existing Assessment view and SAT workflows to the shared analytical objects.
11. Replace the XML format with the 0.7 analytical record and separate recovery/session persistence.
12. Archive/delete superseded alpha code, fixtures, and documents; update architecture and roadmap documentation.

Because there are no users, a clean schema bump is preferred over permanent conversion machinery. Preserve only development fixtures worth carrying forward.

## Acceptance criteria for the new core

The schema should be considered viable only if it supports the following without another core primitive or hidden compatibility store:

- Open/reopen an identical PDF by content identity.
- Represent a later source version without overwriting the earlier one.
- Capture a source region and return to it exactly.
- Create a markup without automatically creating Evidence.
- Cite a source region from an analytical item without asserting evidentiary support.
- Promote grounded material into Evidence.
- Create/edit an analytical item while preserving meaningful prior revisions.
- Build/reorder/indent/outdent/remove an Outline structure without map geometry becoming canonical state.
- Reference one AnalyticalItem from multiple placements without duplicating its analytical identity or subtree.
- Use structural GroupItems without creating fake analytical objects.
- Generate QueryItem result views without mutating canonical structure or analytical relationships.
- Keep placement removal distinct from analytical-object deletion/archive.
- Generate and focus the Map deterministically from Outline structure.
- Represent multiple semantic relations between the same items.
- Represent several premises jointly supporting or countering one conclusion.
- Preserve rationale and TechniqueRun provenance on reasoning.
- Create and supersede assessments while keeping the proposition stable.
- Keep likelihood separate from confidence.
- Distinguish source/version lineage from analytical support.
- Run ACH/KAC/causal workflows against the same shared record.
- Export/reload the analytical record without requiring session state.
- Recover session/navigation state without treating it as analytical truth.

The existing Functional Baseline flow remains a behavioral regression gate after the architecture change: source → capture → thought/evidence → Outline → Map/inspect/focus → exact source return → reload.

## Explicit non-goals for the 0.7 core

Do not use this architecture pass as a reason to add every theoretically useful ontology object.

The following remain deferred unless real implementation pressure proves otherwise:

- A separate Assumption class.
- A separate Hypothesis class.
- A separate Claim class.
- A separate Indicator class before Watch semantics require it.
- A universal generalized `Item` covering every possible artifact type.
- First-class assertions targeting relations themselves.
- Event-sourcing every keystroke or UI mutation.
- Collaboration/conflict-resolution infrastructure.
- AI/connectors.
- Multiple generic freeform maps.
- A new map engine.
- Specialist projection databases for ACH, Timeline, Watch, or Briefing.
- More SAT count expansion for its own sake.

The design principle is **incremental formalization**: keep ordinary work cheap and only expose deeper structure when the analyst or method needs it.

## Remaining open decisions

The architecture is stable enough to implement, but several narrow questions should be resolved during the type/prototype pass rather than by expanding the conceptual model:

- What counts as a meaningful `ItemRevision` versus an ordinary in-progress text edit?
- Should a `ReasoningAssertion` permit another Assessment as a premise, or should premises initially be limited to Evidence and AnalyticalItems?
- How is stable `Source` identity assigned when two content-hash `SourceVersion`s are recognized as versions of the same publication?
- Which source-quality fields belong on Source versus SourceVersion, and which information-credibility fields belong on Evidence?
- Should `AnalysisRoot.keyAssessmentIds` be explicitly ordered?
- Which session fields should survive restart versus remain memory-only?
- At what point should authorship/perspective become first-class for dissent rather than a future collaboration feature?
- Should viewer markup remain inside the portable analytical package or be an optional companion layer?

These are implementation-boundary questions, not reasons to reopen the broader ontology.

## Documentation supersession notes

This contract should be read together with, but newer than, several earlier documents.

`HANDOFF_CHECKPOINT_2026-09-13_OUTLINE_FIRST_LOCKED_MAP.md` remains authoritative for Outline-first structural authoring and locked deterministic Map behavior.

`FUNCTIONAL_BASELINE_MILESTONE_CONTRACT_2026-09-13.md` remains authoritative as a behavioral acceptance gate, but not as a promise to preserve the current alpha storage schema.

`PASS-2026-09-12-architecture-prototype-falsification.md` remains evidence for state-separation principles. Its free-placement occurrences and generic picture model are superseded by Outline-first structure.

`docs/working-picture-model-v0.1.md` and older Working Picture research contain useful conceptual history but their assumptions about analyst-authored free spatial geography, generic pictures, and lack of first-class Assessment/Reasoning are no longer normative where they conflict with this contract.

## Normative 0.7 decisions from this research pass

1. Alpha compatibility is not a design constraint in the absence of users; prefer a clean architecture break before beta.
2. Preserve the successful Reader → Outline → generated Map → Assessment interaction model.
3. Separate analytical record, session/recovery state, and preferences.
4. Preserve SHA-256 content-addressed source versions and add stable source identity above them.
5. Separate markups, source regions, citations, and Evidence.
6. Preserve analytical identity across revisions rather than silently mutating the meaning of referenced claims.
7. Make Outline structure the authored structural authority; Map geometry is derived.
8. Remove generic multi-map/freeform graph scaffolding unless a deliberate future context model requires it.
9. Replace universal pairwise relationships with SemanticRelation, ReasoningAssertion, and ProvenanceRelation.
10. Permit multiple relations between the same analytical identities.
11. Make reasoning capable of many premises to one conclusion and keep its visual portrayal lightweight.
12. Treat Assessment as a dated judgment about a proposition; keep likelihood and confidence separate.
13. Treat key judgment as analysis-context designation rather than proposition type.
14. Make structured analytic techniques operate on the shared record rather than isolated response text or technique-specific databases.
15. Make Outline, Map, Assessment, ACH, Timeline, Watch, and briefing surfaces projections rather than storage models.
16. Freeze authored Outline semantics per ADR 0021: placement identity is distinct from analytical identity; hierarchy/order are non-semantic; GroupItems and QueryItems cannot masquerade as analytical objects; placement removal is distinct from analytical-object deletion.

## Final architecture thesis

Catalyst should enter beta only after its interaction model and analytical-record model have both stopped changing shape.

The intended substrate is not “a mind-map graph with metadata.” It is a **traceable, source-grounded analytical record of source material, analytical identities/propositions, reasoning, judgments, provenance, and authored structure**, with quiet projections for different analytical tasks.

The analyst should not have to operate the graph or ontology directly. The Reader, Outline, Map, Assessment surface, SAT workflows, and future projections are instruments over the same record.

This is the point of the 0.7 alpha architecture break: remove the scaffolding that helped Catalyst discover its shape, keep the pieces that survived implementation, and establish the smallest coherent model worth carrying into beta.
