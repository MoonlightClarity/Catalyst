# Catalyst Key Assumptions Check — 2026-09-12

Status: deliberate falsification pass before further workflow coding.

## Trigger

The current disposable prototype successfully opened a real Tradecraft PDF, captured a real source selection, saved evidence, and created a linked thought. It also exposed friction that may be directional rather than local UI polish: source readability suffered in the literal continuous-page composition; source-selection actions were spatially separated from the selection; and z-order/layer mechanics became a major design problem before the analytical loop was proven.

This check therefore treats every recent “product invariant” as a hypothesis unless it is a hard project constraint.

## Executive judgment

Catalyst's **architectural core survives**, but the current **product-shell interpretation should be downgraded from invariant to experiment**.

The strongest surviving direction is not “mind map first,” “canvas first,” or “everything literally lives on one page.” It is:

> Catalyst is a document-grounded, version-aware analytical workbench that preserves continuous analytical context across several coordinated projections.

The Working Picture remains valuable, but should be one first-class projection among source reading, evidence/provenance, outline/list/query, method-specific views, and synthesis. Continuity should mean deterministic focus/return, persistent selection/context, and stable analytical identity — not necessarily simultaneous visibility on one canvas.

## Key assumptions under test
### A1 — Catalyst should own the analytical process end-to-end
**Criticality:** high. **Current confidence:** high, with a scope correction.

Evidence for: the real-file test showed value when selection, evidence, note, Working Picture, and return-to-source live in one coherent record rather than requiring manual re-entry. Zotero/LiquidText/MarginNote comparators likewise make source-to-note continuity central.

Counterevidence: owning the process does not require rendering every stage in one simultaneous surface. Scrivener, MarginNote, and other mature systems coordinate distinct views while preserving project continuity.

**Revised assumption:** Catalyst should own the analytical *state and transitions* end-to-end, not necessarily all pixels at once.

### A2 — One literal continuous analytical page is the correct shell
**Criticality:** high. **Current confidence:** low.

Counterevidence from our own prototype: the PDF became too small at useful workspace sizes; source and analysis competed for z-order; layer inversion became necessary; the source-selection popover and Catalyst capture controls appeared in different places; substantial engineering was spent on overlap mechanics before the analytical loop was validated.

The closure synthesis already says focus-in-context is not a mandatory single-pane law.

**Falsification status:** substantially weakened. Replace with “continuous analytical context” until a literal-page design proves superior in hands-on use.

### A3 — The Working Picture should be the primary persistent home
**Criticality:** high. **Current confidence:** medium-low.
Evidence for: spatial synthesis, stable landmarks, provisional grouping, and recognition-first navigation remain valuable for complex analytical work.

Counterevidence: LiquidText makes source reading and workspace parallel rather than making the workspace the ontology; MarginNote lets one object appear as excerpt, card, and review item; Scrivener coordinates binder, editor, corkboard, and outliner. Our own closure synthesis calls the Working Picture one projection over a larger record.

**Revised assumption:** Working Picture is a privileged synthesis/foraging projection, not necessarily the permanent shell or default home for every task.

### A4 — Documents should behave as movable source objects that may overlap analytical objects
**Criticality:** medium. **Current confidence:** low-medium.

Overlap must be *allowed* because source and analytical placement are semantically independent. But “allowed” does not imply “default composition.” The real-file test suggests a readable source focus state is often more important than preserving simultaneous canvas visibility.

**Revised assumption:** source surfaces need independent focus, placement, and return semantics; literal overlap is an optional portrayal mode, not a product principle.

### A5 — Spatial/mind-map organization should be the fundamental note structure
**Criticality:** high. **Current confidence:** low.

This was an earlier project direction, but later research already displaced it. Freeplane exposed hidden hierarchy under apparently free placement; MarginNote's mind map is fundamentally tree-shaped; spatial tools can suggest semantics that are not actually authored.

**Revised assumption:** the fundamental structure is the analytical record. Spatial occurrence, authored structure, and semantic relation are separate projections/species. A mind map is one portrayal, not the data model.
### A6 — Exact provenance and deterministic source return are core differentiation
**Criticality:** very high. **Current confidence:** very high.

Nothing in the hands-on test or comparator research weakens this. In fact, the clean-file run strengthened it: once an excerpt became analytical material, the source link immediately became the most important continuity mechanism.

**Keep as a core invariant.** Exactness must remain relative to retained immutable source representations, with explicit degraded/ambiguous states where exact return is impossible.

### A7 — Identity, occurrence, structure, semantics, provenance, and focus must remain separate
**Criticality:** very high. **Current confidence:** very high.

Freeplane, Zotero, TriliumNext, Sploder, and the current prototype all support this separation. Most recent UI problems came from collapsing presentation/focus concerns together, not from the separation itself.

**Keep as a core invariant.** Movement must not silently author a relationship; restyling must not change analytical identity; hiding must not retract an assertion.

### A8 — Intelligence methodology should define the product's visible identity
**Criticality:** medium. **Current confidence:** low.

The methodology remains useful as a rigor standard and optional workflow. Making Catalyst visibly “an intelligence tool” would narrow legitimate use in research, legal, journalism, science, strategy, and other provenance-heavy work.

**Revised assumption:** intelligence tradecraft should constrain rigor and provide optional methods, not dominate the base ontology or shell.
### A9 — A source selection should become “evidence” immediately
**Criticality:** high. **Current confidence:** low.

The clean-file test exposed a category problem. The selected Tradecraft title was first saved as Evidence, then “Create linked thought” created another evidence count from the same exact selection. This may be a duplicate bug, but it also reveals a deeper ambiguity: a source region is not inherently evidence until it is used in an analytical context.

**Revised assumption:** source capture/excerpt should be a provenance-bearing source-region reference. “Evidence” is an analytical role/use of that material relative to an issue, claim, hypothesis, or method. The same source region should be reusable without cloning its provenance identity.

### A10 — Rich user-authored visual customization is core
**Criticality:** low-medium. **Current confidence:** medium as an extension, low as a core direction.

Sploder's pixel editor and portrayal stack suggest a strong future mechanism for analyst-authored symbols and domain visual languages. But visual customization is valuable only after analytical identity and portrayal remain separable.

**Keep as a portrayal-layer research direction, not a reason to make Catalyst a graphics editor.**

### A11 — Local-first, non-proprietary operation with no required AI/cloud service
**Criticality:** very high. **Current confidence:** very high; also a deliberate project constraint.

This remains technically coherent and strategically differentiating. AI may later be optional, inspectable assistance, but it should not be required for core analytical integrity.

### A12 — Progressive disclosure and recoverable complexity are preferable to feature deletion
**Criticality:** high. **Current confidence:** high.

Keep capability profiles and information scent. Hidden consequential state must remain discoverable; features should not silently disappear or mutate data when toggled off.
## External challenge to the current shell

The market/comparator evidence does not support “document + spatial workspace on one literal page” as unique by itself.

- LiquidText already pairs a document pane with multiple infinite workspaces and supports pulling excerpts into notes/workspaces with source-linked return.
- MarginNote explicitly treats one card as multiple coordinated portrayals across document excerpts, mind maps, and review; its document workflow can capture excerpts without first binding them to a mind-map framework.
- Scrivener coordinates binder, editor, corkboard, and outliner inside one project rather than forcing one universal surface.
- Heptabase demonstrates the appeal of durable cards plus whiteboards, while also exposing practical density/performance limits that argue against one giant perpetual canvas.

Therefore Catalyst's defensible direction is not the mere coexistence of documents and a canvas. The stronger differentiation is the combination of rigorous provenance, explicit analytical roles/relations, version-aware state, optional structured methods, local/open operation, and coordinated projections.

## Directional alternatives

1. **Canvas-first analytical mind map** — reject as the governing model. Too much meaning is pushed into geography and too many tasks are worse on a canvas.
2. **Document-first annotation app with notes** — insufficient. Strong reading flow, but risks reducing analysis to annotation management.
3. **Graph/ontology-first system** — reject as the user-facing direction. Useful derived substrate, poor cognitive home, and too easy to overformalize early thought.
4. **Issue/case analytical workbench with coordinated projections** — strongest current candidate.

In the workbench model, the durable center is an issue/case analytical record. Sources, source regions, thoughts, claims, assumptions, hypotheses, relations, provenance, methods, and outputs are durable state. Reader, Working Picture, Evidence/Source Ledger, outline/query, matrix/timeline, and synthesis are coordinated projections over that state.
## What should happen before more feature coding

Do not immediately repair the current literal-page workflow. First run a small shell comparison using the same Tradecraft task and the same underlying record semantics.

Prototype three compositions only:

- **Reader-first:** readable source dominates; Catalyst capture actions appear at the selection; analytical projection opens beside/in place without losing source context.
- **Workbench split/focus:** source and current analytical projection are independently focusable, resizable surfaces with deterministic back/return; simultaneity is available but not mandatory.
- **Spatial-first baseline:** current Working Picture-centered layered composition, retained as the control condition.

For each, test: time/steps from source selection to source-grounded thought; source readability; exact return; interruption recovery; ability to understand the issue without reading every note; duplicate/categorization errors; ease of provisional organization; and whether the analyst can tell what is source fact versus interpretation.

## Pivot criterion

If reader-first or split/focus materially outperforms spatial-first on source-grounded analytical flow without damaging synthesis/reorientation, Catalyst should pivot its shell accordingly while preserving the Working Picture as a first-class projection.

If spatial-first wins once selection handoff and readable focus are corrected, retain it — but on evidence rather than architectural momentum.

## Current recommendation

**Pause implementation of the literal continuous-page/layering shell. Do not discard the completed placement/stacking work; keep it as a valid experimental branch.**

Proceed with a small comparative shell test, not another broad research cycle. Preserve the stable architectural invariants underneath all variants.

The most important wording change is:

> Preserve one continuous **analytical context**, not necessarily one continuous **visual page**.

That distinction should govern the next prototype decision.
