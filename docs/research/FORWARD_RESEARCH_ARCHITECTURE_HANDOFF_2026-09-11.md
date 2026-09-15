# FORWARD_RESEARCH → ARCHITECTURE handoff — 2026-09-11

Status: forward comparator/source sweep closed. Research/design only; no Catalyst GUI or product code touched.

Primary synthesis: `PASS-2026-09-11-forward-research-synthesis.md`.

Detailed passes: AFFiNE/BlockSuite, Logseq, Excalidraw, Zettlr, SilverBullet, Hypothesis/W3C anchoring, OpenRefine provenance, and Automerge conflict semantics.

## Architectural constraints with strongest evidence

1. **Identity is not occurrence.** One durable analytical identity may have several located portrayals; a transformed derivative is a new identity with provenance, not another occurrence.
2. **Scene state is not semantic truth.** Geometry, z-order, frames, grouping, connector routing, collapse/focus, and local visibility can be durable authored state without being analytical assertions.
3. **Relationship species must remain separable.** Provenance, occurrence, structural membership, semantic/world relation, and portrayal attachment have different deletion/audit/export semantics.
4. **Source anchoring is version-aware.** Exact return requires source identity/version plus redundant format-aware selectors and a visible resolution state.
5. **Derived computation has an authority class.** Indexes, queries, inferred clusters, caches, and lens results may be rebuildable; authored placement/assertions/provenance are not.
6. **Transformation provenance is event-structured.** Method/operation specification, execution, output, and analyst acceptance/revision are distinct records.
7. **Convergence is not reconciliation.** Replicas may converge while analysts still disagree; consequential collisions and intentional perspectives need domain-level representation.
## Consequences for the Working Picture data boundary

A useful conceptual decomposition is:
- **Analytical object** — durable identity/content and analyst-authored state.
- **Source/provenance record** — source identity/version, exact/fallback anchors, transformations, resolution state.
- **Occurrence** — picture-local placement and portrayal of an analytical/source identity.
- **Structural record** — pile/territory/branch/subpicture membership authored for organization.
- **Semantic assertion** — typed analytical/world relationship or assessment.
- **Derived projection** — query/lens/inference/index output that can be invalidated/rebuilt unless explicitly promoted.
- **Execution/provenance event** — a recorded method or transform run with inputs, specification, context, and outputs.

These do not require seven unrelated tables/classes. The requirement is semantic separability: operations on one species must not accidentally mutate another.

## Prototype tests added by the forward sweep

Beyond the existing source-return/spatial-truth tests, the next disposable prototype/data fixture should be able to demonstrate:
- two occurrences of one identity can move independently without duplication of analytical content;
- deleting/hiding one connector portrayal does not delete its semantic assertion;
- a source region can report exact vs recovered vs stale resolution;
- a derivative can expose the transformation/method run that produced it;
- turning off a computed lens removes its portrayal but not authoritative state;
- concurrent edits to an atomic compound state cannot silently synthesize a hybrid nobody authored;
- intentional analyst disagreement survives as multiple attributable perspectives rather than a hidden CRDT conflict;
- retraction/supersession can preserve audit history without requiring physical deletion.
## Decisions forward research does not settle

The evidence does **not** select a final storage engine, CRDT, canvas library, or schema. In particular, using Automerge itself is not a recommendation from this pass; its value here is the explicit conflict model and local-first architecture precedent.

Architecture/prototyping still needs to decide:
- object/document boundaries and which state is co-located versus referenced;
- which compound states require atomic conflict-visible edits;
- lifecycle semantics for delete/archive/retract/supersede/purge;
- the human-facing conflict/reconciliation interaction;
- full-fidelity archival format and interoperability projections;
- how much provenance is shown by default versus through inspection/lenses.

## Stop condition

Do not resume generic forward comparator research. Reopen this role only for a concrete implementation/cognitive mechanism exposed as uncertain by architecture or prototype testing.

The coordinator recovery target remains `Catalyst Rollover Research` at https://chatgpt.com/c/6aa43ff5-7900-83ea-86ff-fd03580fab20 . If that coordinator expires mid-sequence and bridge access is validated, send exactly `continue` and then return to the assigned role.
