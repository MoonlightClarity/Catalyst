# Current state — historical research snapshot

Status: **historical research snapshot**. Current authority is ../../CURRENT_STATE.md, ../CURRENT_ARCHITECTURE.md, and newer ADRs. Preserve this file for research chronology; do not treat its older Working Picture/Functional Baseline language as current requirements.

## Product direction

Catalyst began as an intelligence-oriented research/note workspace but is intended to remain useful for journalism, law, science, history, strategy, research, and other analytical work. Intelligence tradecraft is the design foundation, not a cosmetic theme.

The durable product thesis is now:

> Catalyst should preserve the path from source material to observation/evidence to reasoning to judgment, while making uncertainty, alternatives, provenance, inquiry, revision, and monitoring visually distinguishable without forcing the analyst to read the interface itself.

The computational substrate remains graph-like, but **the user-facing surface must not look like a graph database**.

## Where alpha.3 succeeded

- Graph is increasingly treated as infrastructure rather than the visible product metaphor.
- Structural branches are distinguished from semantic relationships.
- Working Picture became the primary analyst-facing concept.
- Inspect / Focus / Open / Back / Home were separated conceptually.
- Body prose was reduced in the map.
- A custom visual language began to replace stock iconography.
- The project now has explicit specifications for Working Picture, portrayal, navigation, mapping, and representation levels.

## Where alpha.3 failed

Runtime screenshot `screenshots/Capture(10).PNG` shows that the interface still requires too much interpretation and reading.

Primary problems:

- The central symbol is too abstract to identify without text.
- Custom glyphs are stylistically related but semantically underdeveloped.
- Sparse symbols on a large field do not yet create useful visual landmarks.
- The inspector still consumes too much of the analytical surface when merely selecting an object.
- Microcopy such as NODE, 7/7, small counts, and marginal labels adds visual noise without improving orientation.
- Real source imagery/excerpt crops are not yet doing enough navigational work.
- The system still behaves too much like a diagram editor whose objects happen to be sparse.
- The boxed `E` remains visible in Windows development/runtime UI, proving the native application mark is not correctly wired through the full Tauri runtime path.

This is a **design-system failure, not a bug-fixing problem**.

## Immediate product conclusion

Do not proceed directly to an alpha.4 renderer rewrite.

First build a **Portrayal Lab** that lets the symbol system be engineered and tested independently of the full application.

The goal is not “more custom icons.” It is a standard whose basic meanings can be recognized quickly and whose analytical modifiers can be learned systematically.

## Current representation hierarchy

Use this order whenever possible:

1. Actual visual source material (image, source crop, chart, map, page region).
2. Recognizable Catalyst core landmark/symbol when no meaningful native visual exists.
3. Analytical modifier/state amplifier where needed by the current portrayal.
4. Short identity label.
5. Full prose only through close inspection.

## Current architectural hierarchy

- **Analytical Record** — everything preserved, including history and hidden structure.
- **Issue / Problem** — the stable analytical purpose or question.
- **Working Picture** — the analyst's current curated sensemaking surface.
- **Map / portrayal state** — saved spatial/structural view(s) beneath the Working Picture.
- **Object / evidence / source** — inspected detail.
- **Briefing Picture / Product** — future communication-focused derivative, deliberately distinct from the Working Picture.

## Current version / engineering boundary

Latest coherent version label: `0.6.3-alpha.3`; the shared tree contains substantial post-alpha.3 work and is an in-progress development workspace rather than an exact release checkpoint.

The historical alpha.3 updater license failure was an audit-execution problem, not a prohibited dependency. The active XML/web runtime now validates its npm dependency set directly; archived Cargo/Tauri state is legacy context rather than an active runtime requirement. See `ENGINEERING_FINDINGS.md`.

## Research/source integration status

Research is required to live directly in the Catalyst source tree under `docs/research/`. `docs/source-archive-standard.md` defines the handoff contract. Active-source archives must include the XML persistence/runtime source under `src/persistence/`; the retired Tauri shell under `legacy/tauri-shell` may be omitted from ordinary active-runtime handoffs.

A dedicated `gather_research.ps1` produces standalone research checkpoints, while `gather_source.ps1` validates that the research handoff and XML persistence source are present before packaging source.

## Portrayal execution checkpoint

The current research boundary is no longer "design a better symbol family." The next proof is an executable **Portrayal Lab** using the same catalog/resolver/primitives that production Catalyst will later consume.

The Lab must establish:

- deterministic portrayal rule precedence;
- separately authored semantic-zoom levels;
- recognizable cores + bounded modifiers;
- point/line/area/source-crop/junction primitives;
- fixed benchmark scenes spanning sparse, medium, dense, overlap, mixed-media, and return/memory conditions;
- recorded confusion/search/task results;
- a development explanation path for why any object received its current portrayal.

The cleaned source archive supplied by the user is now the preferred implementation/research baseline. Source-hygiene issues discovered in that archive are recorded in `ENGINEERING_FINDINGS.md` and should be repaired before alpha.4 packaging.

## Latest override — cognitive architecture pivot, 2026-09-11

The portrayal implementation checkpoint has been reached far enough to stop protocol polish: Portrayal Lab is on catalog `0.1.0-lab.3`, protocol `blind-v1`, result schema 3. P7 single-scale blind measurement is validated; tests/build passed; blind P7 shows one assigned scale while review P7 preserves the four-scale matrix with measurements disabled.

A proposed `blind-v2` patch helper exists but was **not executed** and is **not** part of the validated state.

The immediate blocker is now UI/cognitive architecture. Live review shows a visually sparse but cognitively dense workspace, with too many application concepts exposed before work begins and source/document placement effectively removed from the Working Picture.

Current research direction: restore documents, pages, and exact source regions as stable placed landmarks; allow provisional spatial organization before semantic formalization; make application chrome contextual; and scale through focus-in-context plus bounded/nested Working Pictures rather than one infinite graph/canvas.

Do not code the next Working Picture yet. See `PASS-2026-09-11-cognitive-architecture-ui.md` and the latest section of `RESEARCH_SYNTHESIS.md`.

## Cognitive-workspace priority update — 2026-09-11 rollover

The immediate blocker has moved above portrayal-symbol polish: Catalyst needs a validated analyst-facing cognitive architecture before the next production Working Picture rewrite.

The current candidate is a **bounded analytical desk** organized by a ladder of commitment:

**capture → placement → provisional organization → explicit analytical structure → optional analytical lenses/methods**.

Source documents, pages, and exact source regions must again be placeable landmarks rather than living only in a separate Reader. Opening a source should be treated as a focused representation of a placed analytical object, with exact return to its prior Working Picture neighborhood.

The preferred architecture is not a single infinite canvas, a permanent Reader+Canvas split, a universal-card whiteboard, or a focus-centered graph. It combines human-scale Working Pictures/subpictures, low-ceremony staging, free placement, later promotion into explicit branches/containers/semantics, and coordinated alternate projections over stable analytical identities.

The last runtime screenshots confirm the mismatch: source material is isolated in the left Reader, `GRAPH`/`ANALYSIS` are exposed as application modes, ordinary selection expands a large inspector, and sparse abstract landmarks still require interface reading.

See `PASS-2026-09-11-cognitive-workspace-architecture.md` and `PASS-2026-09-11-surface-architecture-comparison.md`.

Do not begin the next production Working Picture implementation until the remaining interaction questions have been exercised in a disposable prototype/design study.
## Latest architecture-state update — 2026-09-11

The cognitive architecture has moved beyond surface comparison into a testable contract. Freeplane, Zotero, Trilium persisted-model evidence, AFFiNE, Logseq, Excalidraw, Hypothesis/W3C anchoring, and OpenRefine transformation-provenance evidence now support one coherent state model.

Working Picture behavior must preserve separate scopes for durable identity, context-local occurrence/placement, context-local organizational structure, identity-level semantic assertions, source/version-scoped provenance anchors, transformation provenance, and focus/return state. Authored geometry is authoritative cognitive/portrayal state even though it is not semantic truth.

The next allowed research artifact is a **disposable interaction prototype**, not production Working Picture code, and only after the coordinator deliberately closes the current research pass. The prototype is gated by `WORKING_PICTURE_ARCHITECTURE_CONTRACT_2026-09-11.md` and the stress tests in `PASS-2026-09-11-architecture-stress-tests-and-closure.md`.

Important new constraints: source anchors must report exact versus degraded/fuzzy/unresolved recovery; meaningful transformations require provenance richer than `derivedFrom`; repeated reports/occurrences cannot imply independent corroboration; and destructive commands must distinguish occurrence removal, structure removal, connector hiding, relation retraction, identity deletion, and provenance detachment.

## Architecture research closure readiness — 2026-09-11

Forward research has now closed the remaining narrow gaps with Hypothesis/W3C anchoring, OpenRefine transformation provenance, and Automerge conflict semantics. Architecture has incorporated all three.

The current Working Picture architecture is mature enough for deliberate coordinator/user closure and a disposable single-user interaction prototype. The compact normative gate is `WORKING_PICTURE_ARCHITECTURE_CONTRACT_2026-09-11.md`; the evaluator scenario is `PASS-2026-09-11-working-picture-prototype-acceptance-contract.md`.

Collaboration is not required for that prototype, but the data/command model should preserve future compatibility with per-species conflict semantics: replication convergence versus human reconciliation, domain-atomic compound states, attributable conflict resolution, and lifecycle states distinct from physical purge.

Do not resume generic comparator research or production Working Picture implementation unless the coordinator deliberately changes the phase. A future authorized Trilium hands-on pass should be reconciled if it reveals a real counterexample rather than automatically reopening the architecture.

## Broad cognitive-architecture research closed — 2026-09-12

After the overnight synthesis and explicit user instruction to continue, broad comparator/cognitive-architecture research is deliberately closed for the current phase. `RESEARCH_CLOSURE_SYNTHESIS_2026-09-12.md` is the closure synthesis.

The next phase is a **disposable, instrumented single-user interaction prototype**, not production Working Picture implementation. It must live behind an explicit research/prototype route and may be discarded.

Prototype authority hierarchy:
1. `RESEARCH_CLOSURE_SYNTHESIS_2026-09-12.md`
2. `WORKING_PICTURE_ARCHITECTURE_CONTRACT_2026-09-11.md`
3. `PASS-2026-09-11-working-picture-prototype-acceptance-contract.md`
4. `WORKING_PICTURE_PROTOTYPE_OBSERVABILITY_2026-09-11.md`
5. detailed ownership/provenance/cognitive-ergonomic passes.

Research reopens only for a concrete counterexample exposed by the prototype. Generic comparator surveying remains closed. Production alpha work remains frozen until the disposable prototype has been evaluated against mutation invariants and cognitive tasks.

## Disposable architecture prototype active — 2026-09-12

Broad comparator research is closed provisionally. The first post-research falsification artifact is now executable at `#/architecture-prototype` and is governed by `PASS-2026-09-12-architecture-prototype-falsification.md`.

The prototype separates identity, revision, occurrence, context role, structure, qualified assertion, connector portrayal, source representation/anchor/resolution observations, focus/return, and derived layout. Its deterministic contract scenario reports 14/14 commands within declared mutation species; the same checks are part of `npm test`.

The executable audit produced one material refinement: ordinary occurrence removal must not silently cascade through local roles, structure memberships, or connector portrayals. Dependent removal is blocked unless an explicitly named compound cleanup is designed. Anchor re-resolution likewise appends an observation rather than rewriting the authored anchor.

Next priority is not more ontology research. Reconcile this instrumented state model with the existing `DeskPrototype` so the cognitive interaction grammar can be tested under the same mutation trace. Production Working Picture implementation remains frozen.

## Preliminary roadmap consolidation — 2026-09-13

Current project planning now treats Catalyst as transitioning from architectural exploration into product consolidation. The architecture is substantially more mature than the ordinary end-user workflow, so the next milestone is a **Catalyst Functional Baseline** rather than another renderer/architecture increment for its own sake.

Current execution priority is integration -> source-first usability -> Analysis-core simplification -> Freeplane structural baseline -> Thorium reader baseline -> visual-language consolidation -> evidence-based persistence/runtime decision -> deeper analytical semantics/projections -> hardening.

The current `0.6.3-alpha.3` version is the last coherent release label; active source contains later parallel experiments/refactors that must be reconciled before a new coherent version is declared.

See `PRELIMINARY_PROJECT_ROADMAP_2026-09-13.md` for the staged roadmap, maturity estimates, and current engineering boundary.