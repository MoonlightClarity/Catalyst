# Forward comparator pass — OpenRefine transformation provenance — 2026-09-11

Status: source/documentation research only; no Catalyst GUI manipulation or product code.

## Why OpenRefine is a distinct comparator

OpenRefine is useful here not as a data-cleaning UI but as a mature FOSS example of recorded, inspectable, replayable transformation history over source data.

Current latest release found upstream: OpenRefine 3.10.1, released 2026-03-04. The 4.0 development API further formalizes operations as stable JSON-serializable transformation metadata.

Sources:
- https://github.com/OpenRefine/OpenRefine/releases
- https://openrefine.org/docs/manual/running/
- https://openrefine.org/docs/manual/exporting/
- https://openrefine.org/docs/technical-reference/architecture-before-4
- https://javadoc-v4.openrefine.org/org/openrefine/operations/operation

## Mechanism 1 — operation, execution, change, and history are separate concepts

OpenRefine's architecture distinguishes reusable operation descriptions from the process that executes them, from the resulting change/diff, and from history metadata shown to the user.

This is a strong precedent for Catalyst to avoid treating every derived analytical artifact as a black-box copy with a single `derivedFrom` pointer.

Catalyst implication: provenance for a transformed artifact may need at least:
- input identity/version;
- transformation description/parameters;
- execution event and software/method version where relevant;
- output identity;
- enough history to explain or reproduce the result.

A transformation description is not the same thing as the changed artifact itself.

## Mechanism 2 — replayable operations are explicit and serializable

OpenRefine lets users extract selected reusable history operations as JSON and apply them to another compatible project. In the 4.0 API, an `Operation` is explicitly required to serialize/deserialize stably and preserve backwards-compatible JSON because the workflow export depends on it.

This provides implementation evidence for Catalyst methodology steps that are both human-readable enough to inspect and machine-readable enough to replay.

Not every analyst action must become replayable. OpenRefine itself distinguishes generalizable operations from single-cell edits that cannot be meaningfully extracted.

Catalyst should make the same distinction between:
- reproducible transformations/method steps;
- one-off analyst authorship;
- portrayal-only actions that should not enter provenance at all.

## Mechanism 3 — undo history is not itself a reproducible workflow

OpenRefine's history can move backward and forward through project states, but branching after undo erases the abandoned redo path. Its reusable operation extraction is therefore a separate function from ordinary UI undo/redo.

This distinction matters for Catalyst. User-facing undo history, durable analytical provenance, and reusable method/workflow definitions have different retention requirements.

Catalyst should not rely on an editor undo stack as its provenance ledger. Undo may be pruned or branch; provenance for a published/relied-upon analytical artifact should survive independently.

## Mechanism 4 — full project archives preserve more than exported results

OpenRefine can export a full project archive with its complete history, allowing another installation to inspect the transformation sequence. Its documentation warns that earlier/confidential data remains accessible in that archive even if later steps anonymized or removed it.

This is a critical Catalyst warning: auditability and data minimization can conflict. A full-fidelity analytical archive may retain sensitive source material or superseded states that an ordinary report/export intentionally omits.

Catalyst documentation should therefore distinguish operational export, archival/audit export, and publication export, with explicit disclosure of what historical/source content each preserves.

## What Catalyst should inherit

1. Separate transformation description, execution event, resulting change/output, and history metadata.
2. Stable machine-readable serialization for reusable transformation/method steps.
3. Explicit distinction between replayable/generalizable steps and one-off analyst authorship.
4. Provenance that survives independently of the ordinary undo stack.
5. Full-fidelity archival export distinct from publication/interoperability export.
6. Clear warnings when audit history retains data that later transformations appear to remove.

## What Catalyst should not inherit

1. Treating linear undo history as the complete provenance graph.
2. Assuming every user gesture deserves a durable transformation record.
3. Assuming replay on a different source guarantees an equivalent analytical result without validating inputs/preconditions.
4. Hiding retained pre-transformation sensitive material inside an archive the user expects to be sanitized.
5. Conflating a reusable method definition with evidence that the method was actually executed on a specific input.

## Net architectural effect

Catalyst provenance should be richer than `derivedFrom`. A derived artifact may need a compact provenance event linking input identity/version, transformation specification, execution context, and output identity.

This also clarifies the method architecture: an analytical method/template is a reusable specification; a method run is an execution event; its produced observations/propositions are outputs; analyst acceptance/revision remains separate authorship.

This pass closes the transformation-provenance gap enough for architecture work. The remaining distinct forward-research gap is multi-user conflict semantics: how concurrent edits to shared analytical identities, assertions, provenance, and occurrence state should merge—or deliberately refuse to merge.
