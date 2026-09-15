# Overnight adversarial architecture review — 2026-09-11

Status: adversarial research review. Research/docs only; no Catalyst GUI manipulation and no product code changed.

## Mandate

Try to falsify the emerging Working Picture architecture rather than defend it. The target claims are:

- anchored material as first-class working material;
- focus-in-context and exact return;
- bounded Working Pictures/subpictures rather than one infinite surface;
- a commitment gradient from capture through formal semantics;
- durable identity separated from occurrence/placement and semantic relation;
- source continuity across extraction, reuse, transformation, and navigation.

This review asks where those claims fail cognitively, semantically, operationally, or at scale, and where another architecture is superior.

## Executive verdict

The architecture survives as a strong **working-surface hypothesis**, but not as a universal architecture and not unchanged. Five parts are defensible: source continuity, context-local placement, explicit semantic assertion, bounded task places, and protection of authored geography from silent mutation.

Five parts need amendment before prototyping: the commitment "ladder" is too linear; semantic relations are underspecified as simple identity-level edges; mutable shared identity can create distant-edit surprises and provenance contradictions; bounded subpictures can hide decisive outside evidence; and source anchoring is necessarily best-effort unless an immutable source representation is retained.

Most importantly, the Working Picture should be treated as a curated cognitive surface over a separately queryable analytical record. It must not become the only way to know what exists.
## 1. The commitment gradient is not actually one dimension

The current sequence — capture → placement → provisional organization → explicit structure → semantic relation/method — is useful as an onboarding story, but it is dangerous as a data or interaction model.

Real analytical commitment is multidimensional. An item may be spatially stable but semantically uncertain; formally related but low-confidence; provenance-exact but only provisionally relevant; or highly important to a method while intentionally left outside any hierarchy.

Shipman and Marshall's work supports incremental formalization precisely because people resist premature explicit structure, but it also shows that spatial languages remain idiosyncratic and can change meaning during work. The same visual variable can be repurposed over time. That undermines any assumption that formalization naturally proceeds along one monotonic axis.

Adversarial conclusion: replace the ladder as a normative model with a **commitment vector/lattice**. At minimum keep separate dimensions for:

- persistence/permanence;
- organizational explicitness;
- semantic explicitness;
- epistemic strength/confidence;
- scope/context;
- methodological status;
- publication/communication readiness.

`Promote` remains a useful command only when it names which dimension is being increased. The architecture must also support deliberate de-formalization, branching alternatives, and stable ambiguity rather than treating ambiguity as merely unfinished work.

Research basis: Shipman & Marshall, *Formality Considered Harmful* and spatial-hypertext work: https://people.engr.tamu.edu/shipman/viki/papers/tochi/tochi.html and https://people.engr.tamu.edu/shipman/spatialhypertext.html
## 2. Spatially provisional does not mean cognitively non-semantic

The data-model rule `move != relate` is correct, but the cognitive implication is weaker than the current prose sometimes suggests. Humans read proximity, enclosure, alignment, size, ordering, and whitespace as meaningful whether or not Catalyst records a relation.

Spatial hypertext is valuable because users can communicate and reason with exactly this ambiguous secondary notation. Marshall and Shipman explicitly describe implicit spatial structures as idiosyncratic and ambiguous. Their work also notes that implicit structures are hard for the system to use without recognition and user guidance.

Therefore Catalyst cannot simultaneously claim that authored geography is cognitively meaningful and that it is semantically neutral in the analyst's experience. It is **formally non-assertive but pragmatically suggestive**.

This matters for intelligence work. A tight cluster may be read as association; a left-to-right row as time or causation; enclosure as membership; vertical position as rank. Another analyst can inherit a spatial implication that the author never meant.

Required amendment: preserve the hard data-model separation, but document geometry as **secondary notation with communicative risk**. Shared/reviewed pictures should provide lightweight means to distinguish `implicit spatial cue` from `explicit structure/assertion`, especially when material is handed to another analyst.

Falsification test: give independent reviewers the same unlabelled spatial arrangement. If they infer consistent relations that the author did not assert, the interface must treat those implied readings as a review risk rather than saying 'the layout means nothing.'

Research basis: Marshall & Shipman, *Searching for the Missing Link*: https://people.engr.tamu.edu/shipman/viki/papers/ht93/ht93.html
## 3. Identity / occurrence separation is necessary but insufficient

Separating one durable identity from many occurrences solves global-coordinate and reuse problems, but it introduces a new failure mode: **distant edit propagation**. If editing content through any occurrence edits one shared identity, the analyst may change several pictures they are not looking at.

That behavior may be technically consistent and still cognitively surprising. It becomes more dangerous when an object's meaning has drifted between contexts or when an old picture represents what was known at an earlier time.

W3C PROV is a useful countermodel: a PROV Entity has fixed aspects during its lifetime, while revisions, specializations, alternates, activities, roles, and qualified influences are represented separately. That suggests Catalyst should be cautious about making a durable analytical identity itself the mutable content record.

Adversarial alternative: distinguish at least **durable referent identity** from **versioned authored state**. Editing a truth-bearing proposition or source-derived analytical artifact may produce a new revision/version while preserving the referent/lineage. Local geometry still belongs to Occurrence.

A second missing species is **contextual role/interpretation**. The same source region may be background context in one picture, a key observation in another, and a counterexample in a third without becoming three copies. Those roles are not intrinsic to the source identity and are richer than mere placement.

A third gap is the relation itself. W3C PROV's qualification pattern turns a binary influence into an intermediate resource when time, role, plan, attribution, or other details matter. Catalyst semantic relations will often need the same treatment for perspective, temporal validity, analyst attribution, confidence, provenance, or dispute status.

Required amendment: do not freeze `Semantic Relation = typed edge between two global identities` as the full model. Treat consequential relations as first-class **assertions** capable of carrying scope, perspective, time, provenance, and assessment.

Research basis: W3C PROV-O: https://www.w3.org/TR/prov-o/
## 4. Source continuity is a graded recovery claim, not a guarantee

The current architecture already distinguishes exact, degraded, ambiguous, and unresolved anchor recovery. The adversarial finding is that this distinction must become more central than the phrase 'exact source return' suggests.

The Web Annotation model supports multiple selectors because any single location mechanism can fail. Position selectors are brittle under edits; quote selectors can become ambiguous; range selectors cross internal boundaries; dynamically transcluded content can change beneath an annotation. Hypothes.is production practice combines position and quote information because both failure modes occur.

Therefore the architecture should separate two source cases:

1. **Evidence-grade retained representation** — an immutable local source artifact/version (or legally permissible snapshot) is retained. Exact return can be guaranteed relative to that captured representation.
2. **Live/external representation** — selectors attempt to re-resolve against a changing source. Return is best-effort and always reports recovery quality.

A hash proves that bytes are unchanged; it does not prove authenticity or truth. A fuzzy anchor proves plausible correspondence; it does not prove identity with the original selected passage.

Falsification test: mutate a source through insertions, deletions, repeated quotations, OCR changes, reflow, and edition replacement. Measure false-positive recovery separately from unresolved recovery. A wrong confident return is worse than an explicit failure.

Required amendment: make `immutable captured source version + selectors` the strongest provenance path, with live resolution treated as a convenience layer rather than equivalent evidence.

Research basis: W3C Web Annotation Data Model and selector note: https://www.w3.org/TR/annotation-model/ and https://w3c.github.io/web-annotation/selector-note/
## 5. Bounded subpictures can reduce load by creating blind spots

Dedicated workspaces have empirical support for faster resumption and lower subjective cognitive load in sequential multitasking. Jeuris and Bardram found substantially faster task resumption with goal-oriented dedicated workspaces. That supports bounded places, but it does **not** show that nested analytical decomposition improves judgment accuracy or evidence coverage.

The danger is analytical fragmentation. Once material is split across subpictures, the analyst may forget decisive evidence in a sibling picture, mistake local completeness for global completeness, or overfit the current picture's narrative. A strong Back action fixes navigation but not omission awareness.

The current invariant `hidden != nonexistent` is therefore necessary but insufficient. The analyst needs some answer to: **what relevant material exists outside this picture?**

Required amendment: a Working Picture needs a non-intrusive issue-level coverage mechanism. Possible forms include off-picture counts, source/hypothesis coverage summaries, inbound/outbound trace indicators, sibling-change notices, or a queryable issue index. The base desk stays quiet, but boundedness must not create false completeness.

Falsification test: place disconfirming evidence in a sibling subpicture, suspend the task, then ask the analyst to reassess the current hypothesis. Measure whether the bounded architecture increases omission relative to an issue-level matrix/query view.

The correct synthesis may be **bounded workspaces + global corpus/index**, not bounded workspaces alone.

Research basis: Jeuris & Bardram, *Dedicated workspaces*: https://www.sciencedirect.com/science/article/pii/S0747563216302308
## 6. Focus-in-context is a tool, not the universal navigation law

The current navigation grammar correctly values exact return, but the literature does not support one universally superior focus/context technique. Reviews distinguish overview+detail, zooming, focus+context, and cue-based suppression/highlighting, each with different seams and costs.

Multiple coordinated views can improve comparison, but they also impose working-memory and divided-attention costs. Sequential versus simultaneous views perform differently depending on whether the task is monitoring or comparison. Hypertext research likewise shows that complex graphical overviews do not reliably solve disorientation; visible link types and restricted navigation can sometimes help more.

Adversarial implication: `Open → focused representation → exact return` is strong for source reading, but it should not force every analytical task into serial focus. Comparing two documents, two hypotheses, or before/after imagery may require simultaneous coordinated views.

Required amendment: treat Focus Context as a restoration mechanism, not a ban on side-by-side or coordinated comparison. The architecture should support deliberately created comparison contexts whose contents are simultaneously visible and linked, while avoiding permanent multi-pane chrome.

Falsification test: compare task completion and error rate for source comparison, hypothesis comparison, and temporal change detection under (a) serial focus/return, (b) simultaneous coordinated views, and (c) matrix/timeline projections.

Research basis: Cockburn, Karlson & Bederson review: https://doi.org/10.1145/1456650.1456652 ; Jun, Landry & Salvendy: https://www.tandfonline.com/doi/full/10.1080/0144929X.2011.630420 ; cognitive-load review of hypertext: https://www.sciencedirect.com/science/article/pii/S0747563205000658
## 7. Protect authored geography, but do not privilege it over diagnostic layouts

The architecture is right to prohibit silent auto-layout from overwriting analyst-authored geography. The stronger claim that authored geography should dominate analytical projection is not defensible.

Human-created arrangements encode attention and hypotheses as well as memory. They can preserve anchoring and also preserve bias. In a realistic intelligence-analysis experiment, participants systematically prioritized supportive evidence, while a graphical evidence layout reduced selection bias and produced more balanced evidence selection.

This is a direct counterexample to any architecture in which preserving the analyst's spatial picture is always cognitively superior. Sometimes a deliberately generated projection should challenge the picture.

Required amendment: distinguish **authored geography** from **diagnostic projection**. Never overwrite the former; allow the latter as a reversible, visibly derived lens. Useful adversarial projections may include evidence-balance landscapes, alternative-hypothesis matrices, provenance-family collapse, timeline normalization, and network topology.

The Working Picture should be one authored representation among several coordinated projections over the same record, not the privileged truth surface.

Falsification test: seed a Working Picture with a confirmation-biased arrangement. Test whether a derived evidence-balance or hypothesis matrix reveals neglected disconfirming material faster than the authored picture.

Research basis: *Human factors of the confirmation bias in intelligence analysis: decision support from graphical evidence landscapes*, PubMed PMID 19110834: https://pubmed.ncbi.nlm.nih.gov/19110834/
## 8. Structured methods can be worse than unstructured work

Catalyst's commitment gradient assumes that optional formal methods add rigor when the analyst chooses them. That cannot be treated as generally true.

Dhami, Belton, and Mandel experimentally compared intelligence analysts using Analysis of Competing Hypotheses with analysts not using it. They found mixed evidence on confirmation bias and observed greater judgment inconsistency and error in some respects. A 2024 critical review of six experiments concluded that ACH as a whole has little or no overall benefit on judgment quality and may sometimes harm it.

This is architecturally relevant. A method artifact should not automatically acquire higher epistemic status merely because it is more formal. `Structured` and `better supported` are independent dimensions.

Required amendment: method execution belongs to provenance/process state, while the quality of the resulting judgment remains separately assessed. Catalyst should preserve which procedure was used without visually implying that formalized output is superior to a less formal analysis.

Some tasks are better served by other representations. ACH-style matrices expose cross-hypothesis evidence comparison; Bayesian-network approaches can represent uncertainty propagation and confluence of evidence that ACH does not handle well. These should be alternate task-specific analytic instruments rather than decorations on the Working Picture.

Research basis: Dhami et al. 2019: https://onlinelibrary.wiley.com/doi/full/10.1002/acp.3550 ; 2024 critical review: https://www.tandfonline.com/doi/full/10.1080/02684527.2024.2304934 ; Bayesian-network alternative: https://www.sciencedirect.com/science/article/pii/S2193943821000194
## 9. Spatial memory is a capability, not a universal user trait

Catalyst increasingly depends on spatial stability for recognition and resumption. That is defensible, but individual differences in spatial ability are well established. Research on concept-map/hypertext structure also shows that network-like representations can impose more disorientation and cognitive load on lower-prior-knowledge users than hierarchical structure.

Distinctive spatial context can improve recall, but this does not imply every analyst should be forced to navigate by spatial memory. A system designed only for strong spatial users would contradict Catalyst's broader non-intelligence applicability and accessibility goals.

Required amendment: every durable analytical object and structure should remain addressable through non-spatial representations: outline/list, search, query, timeline, matrix, source index, and keyboard navigation. These are not fallback accessibility modes; in some tasks they will be the better primary view.

Falsification test: recruit or simulate low-spatial-navigation users and compare object recovery, context resumption, and analytical task accuracy across authored desk, hierarchical outline, and query/list views. If the desk materially disadvantages one class of users, Working Picture cannot be the exclusive home architecture.

Research basis: Stanney & Salvendy on spatial/cognitive-style differences: https://journals.sagepub.com/doi/10.1518/107118192786750331 ; concept-map structure/disorientation research: https://www.sciencedirect.com/science/article/pii/S0959475209000152
## 10. Native source visuals can become visual noise

The recognition-first rule correctly prefers actual source crops when they are informative. But using native source appearance as the default landmark can fail when many sources are visually homogeneous: hundreds of white PDF pages, repeated message templates, scanned forms, tables, or visually dense imagery.

At scale, exact source appearance and fast category discrimination can conflict. A page crop may preserve provenance and still be a poor navigation landmark. The architecture therefore needs **representation substitution**, not merely semantic zoom: source-native at close/working scale when useful, more abstract identity/role landmarks when the native appearance stops discriminating.

The same source may need different portrayals for recognition, comparison, and provenance inspection. No single representation should be treated as intrinsically most faithful for every task.

Falsification test: populate a picture with 30 visually similar source pages and compare retrieval by native thumbnail, generated visual signature, short label, and hybrid landmark. Measure confusion and search time rather than aesthetic preference.

This is a portrayal-level risk, but it constrains architecture because `anchored material` cannot mean `always show the literal source surface`.
## 11. Cases where another architecture is superior

The strongest adversarial conclusion is that Catalyst should not ask the Working Picture to win every analytical task.

| Task | Architecture likely superior to free spatial Working Picture | Why |
| --- | --- | --- |
| systematic hypothesis comparison | evidence × hypothesis matrix / probabilistic model | forces cross-hypothesis coverage and diagnostic comparison |
| dense event reconstruction | timeline / temporal table | ordering and interval comparison dominate spatial authorship |
| network investigation | focus graph / adjacency query | topology and path structure are the object of analysis |
| corpus completeness / legal discovery / systematic review | queryable list/table + facets | recall, filters, deduplication, and completeness dominate spatial memory |
| long-form synthesis / publication | document/outliner | rhetorical sequence and prose structure dominate geography |
| source-family/circular-reporting audit | provenance graph / lineage table | dependency chains and origin collapse dominate local placement |
| repeated categorical comparison | matrix/small multiples | aligned comparison is more precise than free arrangement |
| low-spatial or keyboard-first work | outline/list/search | lower navigation burden and stronger addressability |

This does not defeat the Working Picture. It changes its role: **the Working Picture is the analyst-authored synthesis/foraging place, not the universal projection**.

The analytical record must support multiple coordinated projections without turning projection change into data conversion.
## 12. Hidden data-model contradictions to resolve before prototype hardening

### 12.1 Shared mutable identity versus historical analysis

If `Edit shared identity` mutates the object seen in every occurrence, an old Working Picture can cease to represent what the analyst actually saw or believed at that time. This conflicts with the earlier requirement to reconstruct historical knowledge state.

A safer model is durable referent + versioned authored states + current-head pointer, with revisions and supersession explicit. Event-sourced or append-oriented history is one possible implementation pattern because it preserves ordered state changes and point-in-time reconstruction, though Catalyst need not adopt full event sourcing.

Reference: AWS event-sourcing pattern: https://docs.aws.amazon.com/prescriptive-guidance/latest/cloud-design-patterns/event-sourcing-pattern.html

### 12.2 Context-local role versus identity-level role

`Observation`, `Evidence`, `Counterexample`, `Indicator`, and `Background` can be uses of material in a particular inquiry, not permanent species of the underlying object. If these remain global object types, reuse across contexts will force either incorrect global typing or duplication.

The model needs a clear rule for which roles are intrinsic species and which are context-qualified assertions/roles.

### 12.3 Relation scope versus identity-level relation

A relation such as `supports(A,H)` may be valid only under a perspective, time window, scenario, or assumption set. A globally durable binary edge is insufficient if the same pair can support and contradict under different contexts.

Treating a consequential relation as a qualified assertion object avoids overloading connector portrayal or duplicating endpoints.
### 12.4 Structure membership versus occurrence membership

The contract says structure is context-local and normally organized through occurrences/membership instances. That works until a branch is intended to persist across multiple portrayals of the same picture. If branch membership binds only a particular occurrence, alternate projections may lose the authored organization; if it binds identity, reuse in another local context may inherit unwanted structure.

The prototype should explicitly test whether `Structure Membership` targets an occurrence, a context-qualified identity role, or an intermediate structural item. Do not postpone this if branch/subpicture operations depend on it.

### 12.5 Subpicture creation versus selection semantics

`Make subpicture from selected body of material` is ambiguous when the selection contains spatial neighbors that are not formally members of any structure. Does the command capture current selected identities, selected occurrences, a geometric region, or an explicit membership snapshot? These produce different future behavior.

The operation must name what becomes a child occurrence set and what remains only parent-side geometry.

### 12.6 Derived state versus analyst-trusted state

The current rule says derived clusters/layouts remain derived until promoted. Good. But a derived projection can still strongly influence judgment before promotion. Authority class and cognitive influence are different. Catalyst should record enough projection context during consequential judgments to know which derived representation the analyst was looking at, without logging every camera gesture as permanent audit history.
## 13. Adversarial prototype battery

The next disposable prototype should not merely demonstrate the happy-path acceptance sequence. It should actively try to break the architecture.

### Test A — semantic leakage from geometry

Arrange the same objects in several layouts without explicit relations. Ask author and independent reviewer what each layout implies. Failure: reviewers infer strong unrecorded assertions and cannot tell implicit cue from explicit claim.

### Test B — distant-edit propagation

Reuse one identity in five pictures, including one historical picture. Edit it through one occurrence. Failure: users cannot predict which other contexts changed, or a historical state silently rewrites.

### Test C — subpicture blind spot

Place decisive disconfirming material outside the active bounded picture. Failure: analysts reach or retain a conclusion because the current picture looks complete and outside evidence has no awareness cue.

### Test D — anchor false positive

Mutate source versions so the quoted text occurs multiple times or OCR changes. Failure: Catalyst returns confidently to the wrong passage rather than reporting ambiguity/degradation.

### Test E — mixed commitment

Create an object that is source-exact, spatially stable, semantically untyped, method-relevant, and low-confidence. Failure: the UI forces it onto one linear commitment rung or communicates more certainty than exists.
### Test F — projection superiority

Give the same analytical task to Working Picture, matrix, timeline, graph, and list/query views. Failure: Catalyst still treats Working Picture as mandatory home even when another projection is substantially faster or more accurate.

### Test G — 500 / 5,000 object scale

Populate an issue with many sources and assertions while keeping any one picture human-scale. Failure: users cannot discover omitted relevant material without manually traversing subpictures, or the global index becomes a second incompatible product.

### Test H — source-landmark homogeneity

Use dozens of visually similar PDFs/forms/messages. Failure: native crops cease to function as landmarks and the analyst must read every label.

### Test I — low-spatial-navigation user

Run the same recovery and source-return tasks through desk, outline/list, and query views. Failure: core work becomes inaccessible or materially slower for users who do not benefit from spatial memory.

### Test J — analyst-authored bias

Seed an authored geography that visually privileges a favored hypothesis. Compare with a generated evidence-balance view. Failure: the system protects geography so strongly that the analyst cannot easily obtain a challenging alternative projection.

### Test K — relation qualification

Assert the same apparent relation under two perspectives or time windows with different status. Failure: the model requires duplicate endpoint objects or collapses both meanings into one edge.

### Test L — context return under interruption

Enter a source, subpicture, and comparison view; interrupt the task; resume later. Failure: exact coordinates restore but the analyst still lacks goal/subgoal cues and spends substantial time reconstructing why the context mattered.
## 14. Recommended architecture after adversarial review

Do not discard the Working Picture. Narrow its claim.

Recommended stack:

1. **Analytical Record / Corpus** — complete, queryable, version-aware record of identities/referents, versions, qualified assertions, provenance, transformations, structures, and assessments.
2. **Issue / Inquiry** — stable purpose plus coverage boundary and relevant corpus slice.
3. **Working Picture** — analyst-authored, bounded cognitive surface containing context-local occurrences and secondary notation.
4. **Subpictures / dedicated task places** — bounded views for coherent subproblems, with explicit outside-context awareness.
5. **Task-specific projections** — matrix, timeline, graph, outline/list, provenance lineage, query results, comparison views. Derived unless explicitly saved/authored.
6. **Focused representations** — source reading, inspection, or deliberate comparison with return tokens.
7. **Briefing/Product views** — communication-oriented compositions derived from the analytical record, not screenshots of the desk.

This stack preserves the strongest Catalyst ideas without claiming that one spatial surface is cognitively optimal for all analytical work.

### Revised state species

The existing species remain useful, but the adversarial review recommends adding or refining:

- Durable Referent / Analytical Identity;
- Versioned Authored State or Revision;
- Occurrence / Portrayal Placement;
- Contextual Role / Interpretation;
- Structure Membership / Structural Artifact;
- Qualified Semantic Assertion (relation with scope/perspective/time/provenance);
- Source Artifact Version + Anchor/Selector Bundle;
- Transformation Event;
- Assessment / Perspective;
- Focus / Return Context;
- Saved View / Projection;
- Derived State;
- issue-level Coverage/Awareness state where needed.
## 15. Required amendments before architecture closure

This review recommends reopening the compact contract narrowly for the following changes, not restarting broad architecture research:

1. Replace the implication of a one-way commitment ladder with an explicitly multidimensional, reversible commitment model.
2. State that spatial geometry is formally non-semantic but cognitively/communicatively suggestive secondary notation.
3. Split durable referent identity from versioned truth-bearing authored state where historical reconstruction matters.
4. Add a contextual-role mechanism so reuse across inquiries does not require global retyping or duplication.
5. Treat consequential semantic relations as qualified assertion objects, not only typed binary edges.
6. Strengthen source continuity around immutable captured source versions; treat live-anchor recovery as graded/best-effort.
7. Add outside-picture/coverage awareness so boundedness does not create false completeness.
8. Preserve authored geography, but explicitly allow reversible derived projections that can challenge analyst bias.
9. Permit simultaneous coordinated comparison contexts where serial focus/return is inferior.
10. Require non-spatial equivalent access paths for core analytical objects and structures.

These amendments are compatible with the existing mutation-specificity law. They make the law more precise rather than weakening it.

## 16. What this review did *not* falsify

The following still look strong after adversarial pressure:

- occurrence placement must not be stored as one global coordinate on identity;
- reuse must remain distinct from copy/fork;
- semantic assertion must not be inferred silently from geometry;
- source/analyst transformations must remain auditable;
- destructive operations must name their layer and avoid silent cascade;
- connector routing is portrayal state, not relation truth;
- automatic layout must never silently overwrite authored geography;
- focus/selection must not impersonate analytical importance or truth;
- repeated reports/occurrences must not imply independent corroboration.

The architecture is therefore not rejected. It changes from **'Working Picture as the architecture'** to **'Working Picture as one authored cognitive projection over a richer analytical record.'**
## 17. Sources consulted in this adversarial pass

- Shipman & Marshall, spatial hypertext overview: https://people.engr.tamu.edu/shipman/spatialhypertext.html
- Marshall & Shipman, implicit spatial structure: https://people.engr.tamu.edu/shipman/viki/papers/ht93/ht93.html
- Shipman & Marshall, *Formality Considered Harmful*: https://people.engr.tamu.edu/shipman/viki/papers/tochi/tochi.html
- Cockburn, Karlson & Bederson, focus/context review: https://doi.org/10.1145/1456650.1456652
- Jeuris & Bardram, dedicated workspaces: https://www.sciencedirect.com/science/article/pii/S0747563216302308
- Jun, Landry & Salvendy, cognitive costs/benefits of multiple views: https://www.tandfonline.com/doi/full/10.1080/0144929X.2011.630420
- W3C Web Annotation Data Model: https://www.w3.org/TR/annotation-model/
- W3C selector note: https://w3c.github.io/web-annotation/selector-note/
- W3C PROV-O: https://www.w3.org/TR/prov-o/
- AWS event-sourcing pattern: https://docs.aws.amazon.com/prescriptive-guidance/latest/cloud-design-patterns/event-sourcing-pattern.html
- Dhami, Belton & Mandel on ACH: https://onlinelibrary.wiley.com/doi/full/10.1002/acp.3550
- 2024 critical review of ACH: https://www.tandfonline.com/doi/full/10.1080/02684527.2024.2304934
- National Academies, intelligence analysis and ACH objections: https://www.nationalacademies.org/read/13040/chapter/5
- Graphical evidence landscapes / confirmation bias: https://pubmed.ncbi.nlm.nih.gov/19110834/
- Bayesian-network alternative for competing hypotheses: https://www.sciencedirect.com/science/article/pii/S2193943821000194
- Stanney & Salvendy on spatial/cognitive-style differences: https://journals.sagepub.com/doi/10.1518/107118192786750331
- Hypertext structure, disorientation, and cognitive load: https://www.sciencedirect.com/science/article/pii/S0959475209000152

## Bottom line

The strongest version of Catalyst is not a spatial whiteboard with better provenance. It is a version-aware analytical record with several cognitively different projections, of which the Working Picture is the analyst-authored spatial synthesis surface. Boundedness, spatial memory, gradual formalization, and source continuity remain valuable only if the system also preserves global coverage, qualified assertions, reversible alternatives, and non-spatial access.
