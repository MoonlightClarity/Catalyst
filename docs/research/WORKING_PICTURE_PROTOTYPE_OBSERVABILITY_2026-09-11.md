# Working Picture prototype observability contract — 2026-09-11

Status: architecture/evaluation instrumentation guidance only. No Catalyst GUI manipulation and no product code changed.

## Purpose

The disposable Working Picture prototype must be testable against the architecture contract without requiring reviewers to infer behavior from screenshots or implementation details.

Prototype instrumentation should therefore expose a compact **mutation trace**: for every consequential analyst action, record which state species were intentionally changed and verify which species remained unchanged.

This is not a production telemetry specification, event-sourcing mandate, or final persistence schema. It is temporary observability for falsifying the cognitive architecture.

## Central rule

A prototype action passes only when its observed mutation set matches its declared command semantics.

For example, `Move occurrence` should produce an Occurrence mutation and no Identity, Structure, Semantic Relation, Provenance, or Focus truth mutation beyond incidental selection/focus bookkeeping.

A visually correct result that secretly rewrites another species is still an architecture failure.

## Minimum trace record

Each consequential action should expose enough information to answer:
- command name and unique invocation id;
- active Working Picture / bounded context;
- human-facing target and durable identity id where applicable;
- occurrence id(s) where applicable;
- declared primary state species;
- any explicitly declared secondary species for compound/promote commands;
- actual species mutated;
- durable records created/updated/removed;
- invariant checks and any violation;
- before/after revision or compact state fingerprint sufficient for debugging.

## State-species vocabulary for tracing

Use stable trace labels even if the prototype's internal class names differ:

- `identity`
- `occurrence`
- `structure`
- `semantic_relation`
- `source_anchor_provenance`
- `transformation_provenance`
- `focus_context`
- `saved_view`
- `derived_state`
- `connector_portrayal`

`connector_portrayal` is separated in the trace even if implemented inside occurrence/scene state because relation deletion versus line deletion is a critical acceptance test.

Authorship/device/replica identifiers may be logged separately for future collaboration experiments; they must not substitute for analytical identity ids.

## Declared versus observed mutation

The trace should show both:

1. **declared mutation set** — what the command contract says is allowed;
2. **observed mutation set** — what the prototype actually changed.

The test harness can then classify:
- exact match;
- allowed compound mutation;
- benign operational-only difference;
- architecture violation.

Benign operational changes include selection/focus bookkeeping that does not alter analytical state. They should remain distinguishable rather than being hidden inside a generic `changed=true` result.

## Required invariants in the trace harness

At minimum, instrument explicit checks for:

1. moving/resizing does not change identity, structure, semantic relation, or provenance;
2. reuse creates a new occurrence referencing the same identity rather than cloning content;
3. fork/duplicate creates a new identity and retains lineage where required;
4. grouping/branching changes Structure Membership but creates no semantic predicate;
5. relation assertion changes Semantic Relation without moving/reparenting occurrences;
6. connector hide/reroute/delete does not retract the relation;
7. source capture records source/version/anchor state and does not automatically create `Evidence` semantics;
8. derivation creates a new identity/provenance chain rather than overwriting source-grounded identity;
9. projection switching changes Focus Context/derived portrayal rather than converting records;
10. removing an occurrence does not delete identity/provenance/relations;
11. removing structural membership does not delete the member identity;
12. anchor degradation changes resolution state without replacing identity or Working Picture placement;
13. automatic/derived layout cannot overwrite analyst-authored geometry unless explicitly accepted;
14. Back/Return restores the originating context without mutating analytical truth.

These checks are more important than rendering fidelity during the disposable prototype phase.

## Trace visibility

The prototype should provide a developer/evaluator surface that can answer, immediately after an action:
- **what command did I invoke?**
- **what species did it claim it would change?**
- **what species actually changed?**
- **which durable ids were reused versus created?**
- **did any architecture invariant fail?**

This surface can be ugly. It is a research instrument, not production UI.

## Expected trace for the 12-step acceptance scenario

| Scenario action | Required primary mutation | Required non-mutation evidence |
| --- | --- | --- |
| Intake A/B/C | identity/source metadata, optional staging portrayal | no forced taxonomy, structure, semantic relation |
| Capture A1 | anchored identity + source provenance + occurrence when placed | no automatic Evidence/Observation semantics |
| Move A1/B/C1 | occurrence | identity, structure, relations, provenance unchanged |
| Record B derived-from A | provenance/source-family record | occurrence geometry and semantic assertions unchanged |
| Promote Reporting chain | structure | provenance/semantic relations unchanged |
| Derive Observation O1 | new identity + transformation/derivation provenance | source-grounded inputs unchanged |
| Assert supports(O1,H1) | semantic relation | structure and geometry unchanged |
| Reuse in subpicture | new occurrences + context structure | same underlying identities retained |
| Switch mind-map/graph | focus/projection; explicit edits only if invoked | Working Picture geometry unchanged |
| Open A1 source and return | focus/return | analytical record unchanged |
| Clean up occurrence/line/membership | species-specific narrow deletions | identity/relation/provenance survive as appropriate |
| Resolve source drift | anchor-resolution metadata | original identity and occurrence placement unchanged |

The evaluator should be able to export or copy this trace after a test session so a failure can be reproduced from commands and ids rather than remembered visually.

## Counterexample capture

When an invariant fails, preserve a small counterexample containing:
- starting fixture id/version;
- command sequence;
- expected mutation set;
- observed mutation set;
- affected record ids;
- before/after fingerprints or compact snapshots;
- evaluator note describing the cognitive consequence.

A counterexample is a research result. Do not immediately patch around it in production code; first determine whether the interaction, command semantics, or architecture contract was wrong.

## Canonical fixture requirement

Use one fixed, resettable fixture for architecture testing rather than generating new random objects on every run.

The fixture should contain:
- three source identities A/B/C with explicit source-version ids;
- anchored regions A1 and C1;
- a known provenance relation in which B derives from A;
- one observation O1 and one hypothesis H1 created during the scenario, not pre-baked;
- parent Working Picture and one empty child subpicture;
- stable ids so traces from different prototype iterations can be diffed.

The fixture should intentionally include one same-identity reuse and one transformed derivative so the evaluator must distinguish them.

A second fixture can later exercise degraded source-anchor resolution, but the first fixture should remain small enough for a human to understand completely.

## What not to infer from the trace

Instrumentation is evidence about state mutation, not evidence that the interface is cognitively successful.

A prototype can satisfy the mutation contract and still fail because users cannot perceive reuse, cannot understand what a branch means, lose spatial orientation, or face too much chrome.

Therefore architecture trace results must be combined with the existing cognitive tests: structural legibility, source return, spatial truth, progressive commitment, chrome retreat, density, and return/memory.

Likewise, the trace is not a recommendation to make every gesture a permanent audit event. Production history/provenance retention remains species- and consequence-specific.

## Prototype gate

The disposable prototype should not graduate to production Working Picture code merely because its interaction loop feels promising.

It should first complete the canonical scenario with:
- zero unexplained cross-species mutations;
- no loss of source/version provenance;
- no identity duplication during reuse;
- no semantic deletion caused by portrayal cleanup;
- reproducible return-to-context behavior;
- counterexamples documented for every failed invariant.

Only then should visual/cognitive findings be weighed against implementation cost and used to choose the next production architecture.
