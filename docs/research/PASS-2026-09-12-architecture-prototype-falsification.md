# Architecture prototype falsification pass — 2026-09-12

Status: disposable research prototype; not production Working Picture code.

## Purpose
Turn the Working Picture architecture contract into executable state semantics before merging it into the visual desk experiment. The prototype is intentionally plain: correctness and observable mutation boundaries outrank appearance.

## Prototype artifacts
- `src/features/desk/prototypeModel.ts`
- `src/features/desk/ArchitecturePrototype.tsx`
- route `#/architecture-prototype`
- deterministic browser scenario `?scenario=contract#/architecture-prototype`
- `scripts/test-architecture-prototype.mjs`

The architecture contract test is now part of the normal `npm test` regression chain.

## State species exercised
The fixture distinguishes durable identity, authored revision, occurrence/placement, context-local role, structure, qualified semantic assertion, connector portrayal, source representation/anchor/resolution state, focus/return, and derived diagnostic layout.

Source resolution was corrected during implementation so later resolver outcomes append resolution observations rather than overwrite the authored anchor or representation.

## Executed contract
The automated sequence currently traces 14 commands and passes all declared-versus-observed mutation checks. The browser `scenario=contract` initialization reproduces the same boundary cases and reports 14/14 passing mutations.

## High-value checks
- Move mutates occurrence only.
- Reuse creates another occurrence without creating another identity.
- Context role remains occurrence-local.
- Territory creation mutates structure only.
- Relation assertion creates a qualified assertion plus its local connector portrayal.
- Hiding the connector mutates portrayal only and retains the assertion.
- Editing shared content creates a new authored revision and advances the identity head; the prior revision remains inspectable.
- Fork creates a new identity, revision, occurrence, and explicit lineage from the source identity.
- Enter/Return mutate focus context only.
- Diagnostic layout mutates derived state while authored occurrence geometry remains unchanged.
- Anchor re-resolution appends an observation while the authored page/quote and immutable representation remain unchanged.
- Removing a clean reused occurrence preserves the underlying identity.

## Counterexample found and resolved
The first draft of `Remove occurrence` silently removed context-role, structure-membership, and connector-portrayal records that depended on the occurrence. Its trace declared those cascades, so the mechanical checker called it valid, but this weakened the research rule that destructive operations must name their layer.

The command was tightened. Ordinary `Remove occurrence` now mutates occurrence only and refuses to proceed when local role, structure membership, or connector portrayal still depends on that occurrence. An explicitly named compound cleanup may be added later if the UI previews all consequences.

The regression sequence now includes both cases: removal of the dependent main occurrence is blocked without mutation; removal of the clean reused occurrence succeeds as a pure occurrence mutation.

## Interpretation
This pass does not prove the Working Picture is cognitively successful. It does show that the refined state-separation contract can be implemented without immediately collapsing identity, placement, structure, semantic assertion, provenance, focus, and derived projection into one graph/canvas record.

The executable audit also strengthened the earlier integration synthesis: the first implementation attempt exposed a destructive-command ambiguity and a source-resolution modeling ambiguity, both of which were corrected without reopening the broader architecture.

## Validation
- `npm test` passes with the architecture-prototype test included.
- `npm run build` passes.
- Browser deterministic scenario reports 14/14 commands within declared species.
- Normal Catalyst workspace route remains separate from the research prototype.

## Next phase
Do not expand the abstract state model merely because more species can be imagined. The next useful falsification step is an **instrumented interaction prototype**: reconcile this state model with the existing `DeskPrototype` so free placement, lightweight selection, source focus/return, reuse cues, territories/branches, subpictures, and explicit semantic authoring can be tested with the same mutation trace.

That combined prototype should be judged on both architectural correctness and cognitive measures: structural legibility, premature commitment, information scent, return fidelity, reuse comprehension, spatial suggestion versus explicit assertion, density, and destructive-action predictability.

Production Working Picture code remains out of scope until that interaction prototype has been evaluated.
