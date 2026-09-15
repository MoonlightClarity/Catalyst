# Decision log - historical research snapshot

Status: **historical research snapshot**. Current durable decisions are in ../../DECISION_LOG.md, ../CURRENT_ARCHITECTURE.md, and newer ADRs. Entries below preserve the research-era decision trail and may be superseded.

## Snapshot decisions at time of capture

### Product / architecture

- Catalyst remains local-first and fully useful without proprietary/AI services.
- Intelligence methodology is foundational but UI vocabulary should remain broadly useful outside intelligence.
- Graph remains computational infrastructure, not the primary product metaphor.
- Working Picture is the primary analyst-facing surface.
- Map is saved portrayal/view state beneath the Working Picture.
- Multiple human-scale maps/portrayals may reference one analytical object without duplicating it.
- Coordinates/placement are portrayal state, not analytical truth.
- Structural branch and semantic relationship are different concepts.
- Early sensemaking may remain structurally provisional before semantic relations are formalized.
- Analyst-authored spatial arrangement is meaningful cognitive state and should remain stable.
- Briefing/Product representation is distinct from the analyst's Working Picture.

### Visual / portrayal

- Recognition-first is more precise than “image-first.”
- Actual visual evidence should remain visually recognizable where possible.
- Full prose is detail-on-demand, not normal Working-Picture content.
- Analytical relations are generally latent unless relevant to the current inspection/lens.
- Base portrayal cannot encode every analytical dimension simultaneously.
- Color cannot be the sole carrier of critical meaning.
- Selection is a neutral interaction state, never analytical emphasis.
- Salience must have explicit semantic reasons.
- Catalyst needs point/line/area grammar, not a node-only renderer.
- Custom portrayal should use recognizable cores + learned analytical modifiers + state amplifiers.
- New symbols must go through a repeatable standard/testing process.

### Analytical semantics

- Evidence, assumptions, propositions, world objects, and inference should eventually be distinct ontology species.
- Confidence and likelihood are separate.
- Source reliability and information credibility are separate.
- Corroboration depends on independent origins, not document count.
- Unknown independence is distinct from known independence/dependence.
- Provenance does not imply truth.
- Unsupported is not disproved.
- Unknown, disputed, superseded, false, unobserved, and stale are separate states.
- Assessment is better modeled as attributed evaluation than intrinsic object property where feasible.
- Perspective/dissent should eventually be first-class.
- Indicators (expected observables) and weak signals (unexpected/emerging interpretation) are different.
- Warning priority is not probability.
- Catalyst should preserve surprising observations before forcing them into existing hypotheses.

## Explicitly rejected or superseded directions

- Generic coordinate-plane graph as default UX.
- One infinite graph as the sole human representation.
- Generic rectangular text cards as universal object portrayal.
- “Dark intelligence SaaS” visual styling as branding.
- Large generic icon libraries as analytical vocabulary.
- Purely abstract glyphs for basic/familiar object categories.
- Using one visual property such as glow/color/size to communicate several unrelated meanings.
- Force layout continually reorganizing analyst-authored spatial memory.
- Treating filters/hiding/generalization as indistinguishable.
- Treating multiple reports as multiple independent confirmations.
- Universal confidence/probability/trust score.
- Making the intelligence cycle the program architecture.
- Forcing every idea to receive formal semantic typing at capture time.

## Still intentionally open

- Final Catalyst app mark geometry.
- Exact core symbol set.
- Exact modifier-zone positions.
- Final UI term for “Working Picture” in general-user mode.
- Final permanent ontology/schema for 0.7+.
- Exact layout grammars and when local mixed structures are chosen automatically vs manually.
- Final typeface/palette/spacing tokens after portrayal primitives are validated.

## Portrayal architecture decisions added 2026-09-11

- The analytical domain model and portrayal system are independently versioned concerns.
- Analytical records do not store resolved symbol geometry as semantic truth.
- Portrayal is resolved through explicit catalog/rules/context rather than component-local SVG/CSS semantics.
- Rule precedence must be deterministic and documented.
- Core symbol/modifier positions are stable; ordinary Working scale has a deliberately bounded modifier budget.
- Semantic zoom chooses separately authored portrayals rather than simply scaling one representation.
- The Portrayal Lab must retain test results and a stable scenario corpus.
- Research artifacts are first-class Catalyst source artifacts and must travel in every source handoff.

## Portrayal execution decisions added 2026-09-11

- The Portrayal Lab and production Working Picture will consume the same portrayal catalog/resolver/primitives; experimental SVGs must not become a parallel implementation.
- Portrayal rules have explicit deterministic precedence and must be explainable in development.
- Semantic-zoom levels are separately authored representations, including independent visibility ranges for labels, lines, areas, modifiers, and source visuals.
- Portrayal candidates are evaluated under sparse, medium, dense, modifier, overlap, mixed-media, and return/memory scenarios.
- Initial visual-search benchmark scenes use 6/12/18-item set sizes as research-informed starting points, not universal thresholds.
- Symbol acceptance includes realistic Working-Picture tasks, not only isolated comprehension/discrimination.
- Alpha.4 does not attempt to force every analytical question into one Working Picture; coordinated supporting projections remain part of the architecture.
- Stable portrayal during incoming-data changes is a requirement: new material must not arbitrarily destroy analyst-authored visual geography.

## Cognitive workspace decisions added 2026-09-11

- Working Picture is a **bounded analytical desk**, not merely an infinite canvas or graph projection.
- Catalyst uses a ladder of commitment: capture → placement → organization → semantic assertion → analytical lenses/methods.
- Free spatial placement is lower commitment than a structural branch; a structural branch is lower commitment than a semantic analytical relation.
- Low-commitment capture must not require choosing Evidence/Analysis/Question/Hypothesis or other analytical taxonomy up front.
- Proximity, overlap, piles, whitespace, and territories may carry provisional/secondary notation without becoming semantic truth.
- The system may offer to formalize apparent spatial structure but must not silently convert it into an analytical assertion.
- Source documents and exact source regions remain placeable landmarks with one-step return to source context.
- Working Pictures/subpictures preserve local geography; navigation and semantic zoom should not casually reflow established landmarks.
- Incoming/unplaced material needs a low-ceremony staging mechanism whose exact UI form is still open.
- Ordinary selection stays mechanically neutral and lightweight; detailed inspection requires deliberate escalation.
- Mind-map branching remains first-class but is no longer treated as the lowest-commitment or universal representation of notes.
- Current UI cognitive-architecture validation takes priority over further Portrayal Lab polish before the next production Working Picture rewrite.
## Cognitive-workspace decisions added 2026-09-11

- The next analyst-facing architecture is a **bounded analytical desk**, not a permanent Reader+canvas split and not one endless canvas.
- Working Pictures are topologically bounded but metrically soft; growth eventually promotes subpictures/projections rather than indefinite camera travel.
- Incoming/unplaced material uses a retractable staging shelf so uncertain material can be captured without premature classification.
- A source has one identity across landmark, Quick Look, open reading representation, and exact return; Reader is not a separate conceptual universe.
- Exact source regions can be placed as anchored visual landmarks without automatically becoming `Evidence`.
- Selection is nearly free; deep Inspect is deliberate escalation.
- Spatial geometry is useful provisional notation but never silently becomes semantic truth.
- Catalyst may recognize/suggest emerging structure but promotion into membership, hierarchy, scope, or semantic relation requires analyst confirmation.
- Pile, territory, alignment, branch, subpicture, and semantic relation are distinct commitments rather than visual styles of one generic group primitive.
- Promotion preserves authored geography by default; auto-layout is explicit, reversible, and never background behavior.
- Creating a subpicture preserves analytical identity, creates separate occurrence/placement state, and leaves a recognizable parent portal/landmark.
- The first cognitive-architecture prototype must prove a source→region→desk→organization→subpicture→inspect→return loop before richer analytical semantics resume.
## Architecture state-separation decisions added 2026-09-11

- Working Picture is a contextual portrayal layer over durable analytical identities, not the canonical ontology itself.
- Identity, occurrence/placement, organizational structure, semantic relation, provenance, transformation provenance, and focus/return are separately inspectable state species.
- Interactions mutate only the state dimension they name unless an explicit analyst-authored promotion/escalation says otherwise.
- Working Picture organization is context/occurrence scoped; semantic analytical relations are normally identity scoped; portrayal is occurrence scoped; focus is session/context scoped until explicitly saved.
- Authored geometry is authoritative state because it preserves externalized cognition and spatial memory, even though it is not semantic truth.
- Source provenance separates source identity, source representation/version, complementary format-aware selectors/anchors, and current resolution status.
- Fuzzy/degraded anchor recovery must never be portrayed as equivalent to unchanged exact resolution.
- Meaningful transformation provenance separates reusable transformation specification, concrete execution, input identity/version(s), and output identity; editor undo history is not the provenance ledger.
- Reuse/reference, extraction, derivation, and provenance detachment are distinct operations.
- Repeated occurrence/publication never implies independent corroboration; provenance lineage and independence assessment remain distinct.
- Connector routing/binding/visibility is portrayal state and does not constitute or erase the underlying semantic relation.
- Destructive operations must name their layer: occurrence, structure membership, connector portrayal, semantic assertion, identity, or provenance.
- Mind-map/outline projections default to authored organizational Structure Membership; selected semantic relations require a distinct projection/overlay policy rather than silently becoming tree parentage.

## Identity/command semantics decisions added 2026-09-11

- Editing durable content through an occurrence normally edits the shared underlying identity; editing geometry/local representation edits only that occurrence.
- `Reuse`, `Move occurrence`, and `Fork/Duplicate as new object` are distinct operations with different identity semantics.
- A fork may retain lineage to its source identity and never becomes independent evidence merely because it has a new identity.
- Generic copy/paste must not hide whether it reused an identity or created a new one; identity behavior must be inspectable and reversible.
- Manual edits after reproducible transformation output must remain visible in provenance/history rather than falsely representing the current artifact as untouched method output.

## Collaboration/conflict architecture decisions added 2026-09-11

- Replication convergence and analytical reconciliation are separate concerns; synchronized replicas do not imply analyst agreement.
- Mechanical storage conflicts and intentional analytical disagreement are different species.
- Merge granularity follows domain meaning; compound authored states must not be silently hybridized from concurrent edits.
- Consequential concurrent alternatives remain inspectable until an attributable resolution when automatic merging would hide intent.
- Intentional analyst disagreement should be modeled as explicit attributable assertions/assessments/perspectives, not as raw storage conflicts.
- Human author/approver identity, device/replica identity, and change/version identity remain distinct for audit.
- Archive, retract, supersede, delete, and purge remain distinct lifecycle operations under collaboration/replication.
- Personal/session Focus Context is normally local operational state rather than automatically synchronized analytical state.
- Local persistence, replication/network transport, authenticated identity, authorization, encryption, and analytical semantics are separate architecture layers.
- No CRDT or storage engine is selected by the architecture research.
