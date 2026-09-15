# Overnight coordinator synthesis — 2026-09-11

Status: integrated coordinator synthesis; research/design only. No Catalyst GUI manipulation and no product implementation authorized.

## Phase judgment
The broad cognitive architecture remains defensible, but overnight adversarial/provenance work exposed a small set of contract refinements that should be resolved before deliberate closure. Generic comparator research remains closed.

The Working Picture remains a bounded, authored cognitive surface over a larger queryable analytical record. It is neither the ontology nor the only address space. Alternate outline/list/search/query/timeline/matrix/source-index and diagnostic projections remain first-class over the same durable record.

## Stable invariants retained
- Identity is not occurrence/placement.
- Authored placement is durable cognitive/portrayal state, not semantic truth.
- Structure Membership and Semantic Assertion are separate authored commitments.
- Connector geometry/visibility is portrayal, not relation truth.
- Reuse preserves identity; fork creates a new identity with lineage.
- Focus/return is navigation/restoration state, not ontology.
- Derived layouts/lenses may challenge an authored picture but never silently overwrite authored geography.
- Provenance and source loss/degradation have independent lifecycle semantics from placement and semantic use.
- Operational undo, analytical provenance, navigation history, and reusable transformation methods are different records.

## Refinements accepted from adversarial review
The capture → placement → organization → assertion progression remains a useful interaction spine, but must not become a scalar state machine. Commitment is multidimensional: persistence, organizational explicitness, semantic explicitness, epistemic confidence, scope, method status, and communication readiness may change independently, including de-formalization and persistent ambiguity.

Geometry remains formally non-assertive while pragmatically suggestive to humans. Shared/reviewed pictures therefore need enough visual grammar to distinguish implicit spatial suggestion from explicitly authored structure/assertion without destroying the usefulness of secondary notation.

## Source/provenance lifecycle refinement
For prototype correctness, split the prior compressed `Source Version + Anchor` concept into at least these conceptual responsibilities:
- **Source Identity** — durable intellectual/source object.
- **Source Representation** — immutable representation actually consulted (specific bytes/snapshot/release/rendition).
- **Source Region** — durable selected segment of one representation with authored redundant selectors.
- **Anchor Resolution Observation** — later resolver result/status; never overwrites the authored selector bundle.
- **Transformation/Derivation Event** — material change of content or epistemic role with inputs/outputs and authorship/method context.

Exact return is strongest relative to a retained immutable representation. Resolution against live/external mutable material is best-effort and must report exact/recovered/ambiguous/stale/unavailable/unsupported or equivalent states. A fuzzy recovery must never be normalized into evidence-grade certainty.

Detach/delete actions must name their layer: remove occurrence, remove structural membership, stop live binding/sync, detach active rendering while retaining lineage, invalidate an anchor resolution, supersede a representation, delete local bytes, archive identity, or governed purge. Losing bytes changes availability; it does not erase historical lineage.

## Identity revision and contextual interpretation
The existing rule that editing durable content through one occurrence edits the shared identity is cognitively risky if it silently changes distant contexts or historical states. The disposable prototype should therefore model a stable referent identity separately from inspectable authored revision/version state, without prematurely freezing the persistence schema.

The same durable identity may also carry context-local analytical roles or interpretations (for example background, key observation, counterexample) that are richer than geometry but must not become intrinsic global semantics by accident.

Consequential semantic relations should be modeled as first-class attributable assertions capable of scope, perspective, temporal/status state, assessment/confidence, and provenance where required. Their connector portrayals remain separate occurrence/context state.

## Cognitive-ergonomic constraints
Optimize for **recoverable complexity**, not minimal visible information. Density is a task-interference problem, not an object-count problem. Progressive disclosure must leave reliable information scent for consequential hidden state; otherwise minimalism becomes memory load.

Focus-in-context is a continuity contract, not a mandatory single-pane law. Default deep focus may preserve a calm desk, while deliberate temporary side-by-side/pinned comparison contexts remain valid when simultaneous comparison is the task. Return is part of Open: identity, originating neighborhood, comparison set when relevant, source destination, and deterministic return must survive the transition.

A bounded Working Picture should retain a perceptually graspable whole. If the analyst must serially explore the surface merely to rediscover its major regions, the picture has exceeded ergonomic scope. Before moving authored objects, reduce chrome, labels/badges, portrayal detail and relation visibility; then focus/filter or enter a subpicture/projection.

Boundedness must not create false completeness. The issue-level record needs quiet coverage/discovery mechanisms for relevant material outside the current picture, including sibling subpictures and disconfirming material.

## Prototype-feasibility direction
The implementation-primitives research supports a layered FOSS path rather than a framework takeover:
- retain SQLite/Tauri as canonical local storage and Catalyst-owned state-species records;
- retain local source files/blobs with representation/version/hash metadata;
- test the existing EmbedPDF SDK first for region selection and crop rendering, with Catalyst owning durable selector bundles;
- prefer focusable DOM occurrences plus SVG/HTML portrayal and accessible interaction primitives over making a canvas scene graph canonical;
- use graph libraries only for rebuildable projections/algorithms;
- route consequential mutations through named Catalyst commands so declared-versus-observed mutation tracing and undo can share a command boundary while provenance remains separate.

Candidate helpers such as dnd-kit, Floating UI, React Aria, Graphology and optional small camera helpers fit this subordinate role. React Flow is at most a mechanics-only spike; Konva/Fabric are accessibility-costly fallbacks. Current tldraw SDK licensing does not satisfy Catalyst's FOSS boundary and supersedes earlier research that treated it as a strong substrate candidate.

## Added falsification tests for the disposable prototype
The existing 12-step architecture scenario should be extended with bounded tests for: shared-content revision across distant occurrences; one identity with different context-local roles; rich attributable relation assertions; immutable-source versus live-source drift; off-picture disconfirming-evidence coverage; intentional side-by-side comparison; reversible diagnostic/adversarial projections; and non-spatial object recovery for accessibility/task fit.

The provenance fixture should also verify that resolver re-runs create resolution observations rather than rewriting authored anchors, and that deleting local source bytes yields an unavailable state rather than deleting identity/provenance.

## Overnight closure status
**Not yet deliberately closed.** The architecture remains substantially validated, but the overnight coordinator is holding closure for two bounded inputs: the GUI-authorized Trilium hands-on reconciliation (or an explicit decision to defer it) and the pending interaction-pattern pass. Neither justifies broad comparator research.

If those inputs produce no genuine counterexample, the recommended next phase is a disposable single-user interaction prototype governed by the architecture contract, acceptance scenario, observability contract, this overnight synthesis, and cognitive-ergonomic tests. Production Working Picture implementation remains frozen until that prototype has been evaluated.

If either input reveals a real counterexample, reopen only the affected invariant and preserve the counterexample as research evidence rather than redesigning the entire architecture.
