# Working Picture prototype acceptance contract — 2026-09-11

Status: architecture/evaluation contract only. No Catalyst GUI manipulation and no product code changed.

## Purpose

Define one realistic end-to-end interaction sequence that a disposable Working Picture prototype must survive while preserving the researched state boundaries. This is not a UI wireframe and does not freeze storage or visual design.

## Scenario

The analyst receives three materials about the same event:
- Source A: a primary report containing a useful passage;
- Source B: a later report whose wording suggests it may derive from A;
- Source C: an apparently independent source with a relevant region.

The analyst wants to explore the material spatially, formalize only part of it, create one observation and one hypothesis, reuse material in a subpicture, inspect the original source, and clean up the picture without destroying the analytical record.

## Step 1 — intake without taxonomy

Action: capture/import A, B, and C into the low-ceremony incoming/staging state.

Allowed mutation: create/recognize Source Identities and source-version metadata; create staging portrayals if the prototype uses them.

Must not happen: forced Evidence/Hypothesis typing, mandatory branch parentage, semantic relations, or automatic corroboration claims.

Acceptance signal: useful material can exist before the analyst knows what it means.
## Step 2 — inspect and capture an exact source region

Action: open Source A, select a passage, then deliberately capture/place it.

Allowed mutation before capture: ephemeral Source Anchor + Focus Context only.

Allowed mutation on capture: create a durable Anchored Analytical Identity for region A1, preserve A/version provenance with a selector bundle, and create an occurrence when placed.

Must not happen: the capture is automatically labeled `Evidence`, treated as the analyst's observation, or detached from its exact source context.

Acceptance signal: the analyst can return from A1 to the originating source region even after using A1 elsewhere.

## Step 3 — spatial exploration without hidden structure

Action: place A1, a region from C, and Source B near one another; move them repeatedly while comparing.

Allowed mutation: occurrence geometry/local portrayal only.

Must not happen: proximity, overlap, alignment, or repeated co-movement creates branch membership, a semantic relation, or a provenance relationship.

Acceptance signal: the arrangement is cognitively meaningful and stable while remaining formally uncommitted.

## Step 4 — record suspected reporting dependence

Action: the analyst determines B appears derived from A and records that source/provenance relationship.

Allowed mutation: provenance/source-family state with attribution/status appropriate to the analyst's certainty.

Must not happen: B is merged into A, its occurrence is moved, or the dependency is counted as a semantic `supports` relation between analytical propositions.
## Step 5 — promote part of the layout into explicit structure

Action: turn A1 and B into a named provisional pile/branch such as `Reporting chain` while leaving C outside it.

Allowed mutation: context-scoped Structure Membership; preserve existing occurrence geography by default.

Must not happen: a causal/evidentiary semantic assertion is invented, C is reorganized elsewhere because the shared identities are global, or the system forces a tree parent on every nearby object.

Acceptance signal: formal organization can emerge from spatial exploration without erasing the earlier geography or increasing commitment beyond what the analyst selected.

## Step 6 — derive an analyst observation

Action: author Observation O1 from A1 and the independently inspected region C1.

Allowed mutation: create new Analytical Identity O1 plus provenance/derivation links to the relevant source-grounded inputs.

Must not happen: O1 overwrites A1/C1, becomes indistinguishable from quoted source material, or claims independence merely because it has two inputs.

Acceptance signal: the source/analyst boundary remains visible and auditable.

## Step 7 — create and assert one analytical relation

Action: author Hypothesis H1 and explicitly assert `supports(O1, H1)`.

Allowed mutation: new H1 identity, any requested occurrences, and one typed Semantic Relation.

Must not happen: relation creation forces O1/H1 into a branch, changes their positions, or treats a visible connector route as the relation record itself.

Acceptance signal: structure and semantic assertion remain separable even when portrayed together.
## Step 8 — reuse material in a bounded subpicture

Action: create a subpicture for one line of inquiry and reuse A1, O1, and H1 inside it.

Allowed mutation: new context-local occurrences and Structure Membership for the subpicture; independent local geometry/portrayal.

Must not happen: duplicate analytical identities, global reparenting of parent-picture occurrences, or loss of parent geography.

Acceptance signal: the same analytical objects can participate in a narrower context without becoming copies.

## Step 9 — inspect alternate projections

Action: switch to a mind-map/outline projection for the structural branch, then inspect a semantic graph/lens.

Allowed mutation: Focus Context/projection. Structural edits mutate only explicit Structure Membership; semantic edits mutate only explicit Semantic Relations.

Must not happen: projection switching converts records, graph layout overwrites Working Picture placement, or mind-map reparenting is interpreted as causal/support semantics.

Acceptance signal: multiple representations reveal different commitments over one analytical record.

## Step 10 — deep source return

Action: from the subpicture occurrence of A1, open its source anchor and then return.

Allowed mutation: Focus Context and return stack only.

Must not happen: the source opens as an unrelated conceptual universe or Back loses the originating subpicture occurrence/neighborhood.

Acceptance signal: return restores the useful analytical place, not merely the correct application page.
## Step 11 — clean up without deleting truth

Action: remove one reused occurrence of A1, hide/delete the connector portrayal for `supports(O1,H1)`, and remove B from the `Reporting chain` structure.

Allowed mutation: the selected Occurrence, connector portrayal, and Structure Membership respectively.

Must not happen: A1 identity/provenance disappears, the `supports` assertion is deleted, B is deleted, or the provenance relation between B and A is erased.

Acceptance signal: visual/organizational cleanup has narrow, predictable destructive semantics.

## Step 12 — revisit after source drift

Action: reopen A1 after Source A has changed or a newer representation is available.

Allowed mutation: anchor-resolution status/current resolution metadata; optionally new source-version records.

Must not happen: the original provenance target is silently replaced, A1 becomes a different identity, or Working Picture placement changes.

Acceptance signal: exact versus recovered/fuzzy/stale/unavailable source return is inspectable rather than silently normalized.

## Prototype pass/fail contract

The prototype fails architecture review if completing this scenario requires any of the following:
- a fake universal root or required parent for every placed object;
- one canonical coordinate per analytical identity;
- a generic edge whose meaning must be inferred from styling;
- duplication of identity to reuse material in another picture;
- source excerpts that cannot return to durable source/version context;
- occurrence count used as evidence/corroboration count;
- navigation that cannot restore the originating analytical neighborhood;
- visual cleanup that silently cascades into analytical deletion.
## Positive acceptance criteria

A promising prototype should let an evaluator observe all of the following without reading its implementation:
1. the analyst can begin with unclassified material;
2. spatial arrangement remains stable and meaningful before formalization;
3. every increase in commitment is deliberate and inspectable;
4. exact source return survives reuse and derivation;
5. reused identity is recognizable as reuse without dominating the visual field;
6. branch/mind-map structure is efficient when chosen but absent when not chosen;
7. semantic assertions survive portrayal changes;
8. bounded subpictures reduce density without fragmenting identity;
9. Back/return preserves spatial memory closely enough to resume reasoning;
10. cleanup operations behave according to the state species being cleaned up.

This scenario should be run before adding richer intelligence-method semantics. If the prototype cannot make these distinctions cognitively clear with simple test objects, a richer ontology will amplify rather than solve the ambiguity.
