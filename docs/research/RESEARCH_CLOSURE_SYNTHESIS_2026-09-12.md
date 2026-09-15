# Catalyst research closure synthesis — 2026-09-12

Status: integrated synthesis after overnight parallel research and hands-on comparator work. No production Working Picture code authorized by this document.

## Executive judgment

The cognitive architecture is now mature enough to close broad research and move to a disposable, instrumented single-user interaction prototype.

The strongest synthesis is not “Catalyst should be a mind map” or “Catalyst should be a spatial canvas.” Catalyst should be a **version-aware analytical record with several coordinated projections**, one of which is a bounded analyst-authored Working Picture optimized for source-grounded sensemaking.

The Working Picture is therefore a cognitive surface, not the ontology and not the only address space.

## Stable architectural core

Catalyst must keep these concerns independently inspectable and independently mutable:

- durable referent / analytical identity;
- inspectable authored revision or version state where history matters;
- context-local occurrence / placement / portrayal;
- context-local analytical role or interpretation;
- authored structural membership;
- qualified semantic assertion / relation;
- source identity, immutable source representation, and source region;
- anchor-resolution observations that never rewrite authored selectors;
- transformation / derivation events;
- focus / return context;
- saved views and derived projections;
- issue-level coverage / discovery state where bounded pictures could hide relevant material.

The governing mutation law remains: **an action mutates only the state species it names unless an explicit analyst-authored escalation says otherwise.**
## What the hands-on comparators actually established

**Freeplane** demonstrated useful same-object map/outline projection, local folding, direct open-space creation, and stable spatial organization. Its failure for Catalyst is equally important: visually free nodes still retain hidden hierarchy. Catalyst must not hide structural commitment under spatial freedom.

**Zotero** demonstrated the strongest provenance interaction: source PDF → annotation → derived child note → linked excerpt/citation → Go to Page → exact highlighted source passage. Provenance is therefore an interaction primitive, not merely citation metadata. Unlink/detach semantics must state which layer is being detached.

**TriliumNext** materially validated identity-versus-placement. One shared note was placed along three paths; editing through one occurrence changed the same underlying object everywhere. A branch-local prefix changed only one occurrence label, and hoisting re-rooted navigation around one context without duplicating or reparenting the underlying object. These observations support separate identity, branch/placement, local context, and focus state. The explicit relation-authoring GUI test was interrupted before completion, but no Trilium behavior observed produced a counterexample to the architecture.

The combined lesson is stronger than any comparator individually: **identity, placement, structure, semantics, provenance, and focus are different things even when one UI portrays them together.**

## Cognitive constraints that survived adversarial review

Catalyst should optimize for **recoverable complexity**, not minimal visible information. Density is a task-interference problem, not an object-count problem. Progressive disclosure is acceptable only when consequential hidden state leaves reliable information scent.

A Working Picture must remain perceptually graspable as a whole. When the analyst must serially explore the surface merely to rediscover its major regions, the picture has exceeded ergonomic scope.

Authored geography is formally non-semantic but cognitively suggestive. `move != relate` remains absolute in the record model, while the interface must acknowledge that humans infer meaning from proximity, enclosure, alignment, order, and size.

Focus-in-context is a continuity contract, not a mandatory single-pane law. Serial deep focus is a good default, but deliberate side-by-side comparison is valid when simultaneity is the task.
## Provenance model that should gate the prototype

The strongest source-continuity path is: Source Identity → immutable Source Representation → durable Source Region with redundant selectors → later Anchor Resolution Observations.

Exact return can be guaranteed only relative to a retained immutable representation. Live/external material is best-effort and must expose exact, recovered, ambiguous, stale, unavailable, unsupported, or equivalent resolution states. Fuzzy recovery must never silently become evidence-grade certainty.

Meaningful summary, translation, interpretation, extraction, or synthesis creates a new analytical identity plus transformation lineage when content or epistemic role changes materially. Moving, grouping, opening, hiding, or restyling does not.

Source loss changes availability; it does not erase historical lineage. Remove occurrence, remove structure, detach rendering, stop live binding, invalidate anchor, supersede representation, delete bytes, archive identity, and governed purge are distinct operations.

## Working Picture's proper role

The Working Picture is the analyst-authored spatial synthesis/foraging place over a larger queryable record. It should support low-ceremony capture, free placement before formalization, provisional piles/territories, explicit later structure, exact source opening/return, bounded subpictures, and stable landmarks.

It must coexist with first-class outline/list/search/query/timeline/matrix/provenance/graph projections. Those projections are not accessibility afterthoughts: some tasks are objectively better served by them, and diagnostic projections can challenge confirmation-biased authored geography without overwriting it.

Boundedness also requires quiet issue-level coverage cues so the current picture never implies that off-picture evidence does not exist.

## Implementation direction

Do not adopt a monolithic whiteboard, graph, editor, or CRDT framework as the architecture. Catalyst should own meaning; libraries should own mechanics.

Retain React/Tauri/SQLite/Tauri FS and test the existing EmbedPDF stack first. Prefer focusable DOM-backed occurrences plus SVG/HTML portrayal, small interaction helpers, accessible controls, and Catalyst-owned command semantics. Graphology is suitable only as a rebuildable derived graph. React Flow is at most a mechanics spike; canvas engines are fallbacks if measured density proves DOM/SVG insufficient. Current tldraw licensing does not satisfy the project's FOSS boundary.
## What is no longer a research blocker

The missing dedicated interaction-pattern deliverable and unfinished Trilium relation GUI exercise are not grounds for another broad comparator sweep. Their remaining questions are best answered in the disposable prototype because they concern perceptual cues and command ergonomics rather than a missing architectural species.

Likewise, exact schema, reuse glyph, subpicture portal artwork, anchor selector details for every format, density thresholds, comparison layout, and context-role labels are prototype questions. They should be tested against the contract instead of theorized indefinitely.

## Recommended next phase: disposable interaction prototype

Build one intentionally disposable prototype around a fixed multi-source fixture and expose a developer mutation trace. It should prove or falsify, in one continuous workflow:

1. unclassified source placement with no fake parent;
2. exact source-region capture and return;
3. same-identity reuse in another bounded picture;
4. independent local organization of one occurrence;
5. movement that changes no semantics or provenance;
6. explicit qualified semantic assertion with separate connector portrayal;
7. hide/reroute portrayal without retracting the assertion;
8. provenance-preserving derivation into a new analytical identity;
9. source/subpicture/projection entry and deterministic return;
10. occurrence removal without identity deletion;
11. revision of shared content without invisible historical corruption;
12. source drift and degraded/ambiguous anchor recovery;
13. off-picture disconfirming-evidence awareness;
14. deliberate side-by-side comparison and non-spatial recovery path.

The trace must compare declared versus observed state-species mutations. A visually convincing prototype that secretly crosses species fails.

Cognitive evaluation must accompany the trace: structural legibility before prose reading, source-return/resumption accuracy, progressive-disclosure scent, density regime change, keyboard/non-spatial recovery, and interruption recovery.

## Closure recommendation

**Close broad cognitive-architecture research now.** Preserve the current contracts as falsifiable hypotheses, not dogma. Reopen only the smallest affected invariant if the disposable prototype produces a genuine counterexample.

Do not begin production Working Picture alpha.4 from this synthesis. First build and evaluate the disposable interaction prototype. Portrayal work remains valid and should be recombined only after the interaction architecture survives that test.
