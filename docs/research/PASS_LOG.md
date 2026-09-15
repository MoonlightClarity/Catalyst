# Research pass log

This is a compact chronology of the design/research pivots captured in this conversation. It is intended to preserve causality across chat handoffs.

## Deep analytical architecture research

Established the local-first chain: source → anchored evidence → reasoning objects → explicit relationships → optional methodology → conclusions → revision/audit history. Determined that “intelligence-grade” means methodological/documentation rigor, not classified-system certification.

## Evidence clustering pass

User suggested tagging highlights to avoid over-highlighting. Result: tag clusters became a non-destructive evidence lens and later a precursor to the broader concept of layers/overlays and bottom-up weak-signal clustering.

## Quiet-interface pass

Runtime/implementation had too much explanatory prose. Established “Catalyst should annotate the analytical problem, not annotate Catalyst.” Began removing software-explaining-itself copy.

## First branding/UI mockups

Image concepts appeared generic. User correctly identified iconography and lack of intelligence lineage as a key issue. Shifted from styling to research.

## Intelligence cartography / link-analysis passes

Studied i2, APP-6/MIL-STD principles, CIA/OSS cartography, Maltego, intelligence tradecraft. Established analytical cartography / plotting-instrument thesis and rule that visual implication must map to real semantics.

## Evidence/reasoning/provenance passes

Separated things, propositions, evidence, inference, source provenance, and semantic relationships. Identified repeated reporting/circular sourcing, transformation integrity, temporal revision, dissent/perspectives, and source-status changes as structural analytical problems.

## Inquiry / warning / weak-signal passes

Distinguished questions, gaps, indicators, observations, triggers, weak signals, emerging developments, and warnings. Added Watch vs Scan distinction and the rule that surprising observations must be preserved before being forced into current hypotheses.

## Mind-map / concept-map passes

Current graph renderer looked generic and hard to navigate. Research into XMind, CmapTools, TheBrain, Freeplane, Scapple, Tinderbox/VIKI, Obsidian, and DRDC intelligence concept maps established structural branch vs semantic relation, map occurrences, human-scale maps, nested portrayals, focus-centered navigation, and spatially authored sensemaking.

## Working Picture pass

Moved beyond Map as the top-level metaphor. Defined Working Picture as issue-centered, recognition-first, heterogeneous analytical portrayal. Added Working Picture Model, Portrayal Standard, Navigation Grammar, Representation Matrix, ADRs 0017–0018.

## Alpha.3 runtime failure

Working Picture implementation remained too sparse/abstract. Screenshot showed the new glyphs still required reading and did not form strong landmarks. Native Windows boxed E also remained. License validation failed with audit exit 2.

## Portrayal execution passes

Shifted from “custom iconography” to symbol engineering. Research into military symbicons, ISO symbol testing, FAA human factors, NGA portrayal, NPIC symbol standardization, i2 attribute glyphs, and visual-search research established:

- recognizable core + learned analytical modifier + state amplifier;
- point/line/area grammar;
- semantic-distance budget;
- salience classes;
- scale-specific redraws;
- contextual legends;
- five-stage Portrayal Lab testing;
- portrayal as a dedicated code module;
- app icon derived from the same grammar but separately optimized for small-size silhouette.

## Current checkpoint

Do not build alpha.4 yet. Build the Portrayal Lab and Symbol Standard first, repair native icon/version plumbing and license-validation logic, then integrate validated portrayal components into the next Working Picture renderer.

## Portrayal architecture / executable standards pass

Focused on how mature portrayal systems operationalize visual standards rather than what individual icons should look like. NGA/GWG and OGC research established a dedicated portrayal boundary: semantic data remains independent from versioned style/symbolizer/rendering rules. MIL-STD-2525 reinforced stable modifier zones, bounded visual amplification, and scale/context-dependent display hierarchy. ISO 9186 supplied separate empirical tests for comprehension, perceptual quality, and referent association. NPIC symbol governance reinforced catalog/version discipline. Result: the planned Portrayal Lab must prototype a versioned portrayal catalog, explicit rule precedence, modifier budget, fixed test corpus, and measurable confusion/search results—not just a specimen sheet of SVGs.

## Portrayal Lab execution / evaluation pass

Focused on how to execute the portrayal system rather than what it should mean. NGA/OGC standards reinforced portrayal as an explicit model→rules→symbolizer→renderer architecture. MIL-STD display hierarchy and tactical visual-search experiments produced concrete density/scale test conditions. PNNL visual-analytics evaluation work added representative-task, utility, situation-awareness, and interaction-quality gates. Result: the Portrayal Lab becomes a real test harness with a versioned catalog, deterministic rule resolver, fixed benchmark scenes, task metrics, confusion records, and the same rendering modules that production Catalyst will consume. See `PASS-2026-09-11-portrayal-lab-execution.md`.

## Cognitive architecture / UI pivot — 2026-09-11

Live review after Portrayal Lab validation changed the immediate priority. The primary blocker is now the analyst-facing cognitive architecture: the empty workspace exposes too many application concepts before useful work begins, while the source document remains separated from the Working Picture.

Backward research through Malone/piles, VIKI/VKB, epistemic action, Pad++/Local Tools, Data Mountain, nSpace Sandbox, Analyst's Workspace, Tinderbox, and Scrivener converged on low-commitment spatial organization, stable landmarks, incremental formalization, local affordances, and bounded representations.

Forward research through Gstell (CHI 2026), Allume/Muse, LiquidText, Obsidian Canvas, Heptabase, Milanote, Scrapbook, and current document-sensemaking work independently reinforced deferred structuring, source-linked excerpts, nested/bounded boards, recognition-rich handles, and the failure modes of unbounded canvas maximalism.

Current candidate cognitive model is a commitment gradient: **placed material → provisional structure → explicit analytical structure → communicable product**. A source/page/region must be able to remain a stable placed landmark; spatial proximity may express provisional organization but never silently become analytical truth; formal semantics appear when useful rather than at capture time; application chrome retreats in favor of contextual/local controls.

Do not code the next Working Picture yet. Next research step: compare a small set of competing surface architectures against source placement, orientation, deferred formalization, bounded scope, and cognitive-load criteria. See `PASS-2026-09-11-cognitive-architecture-ui.md`.

## Rollover continuity correction — 2026-09-11

The pass log referenced `PASS-2026-09-11-cognitive-architecture-ui.md`, but that detailed file was not present in the rollover research directory. The rollover checkpoint preserved the direction but not that artifact.

Rather than reconstructing it as though the missing text were known, the continuation independently re-ran and deepened the relevant backward/forward research. The recovered continuation is documented in `PASS-2026-09-11-cognitive-workspace-architecture.md`.

This pass formalized the **ladder of commitment**: capture → placement → provisional organization → explicit analytical structure → analytical lenses/methods. It also refined the earlier mind-map direction: free placement is lower commitment than branching, and branching is lower commitment than semantic assertion.

## Competing surface architecture pass — 2026-09-11

Compared four established surface patterns against a fifth Catalyst synthesis: reader+extraction canvas, one infinite canvas, nested card/board systems, focus-centered graph neighborhoods, and a bounded analytical desk with placeable source material.

Result: the bounded analytical desk is the strongest fit, provided it is deliberately constrained and progressively disclosed. It combines LiquidText/MarginNote source continuity, Allume/Heptabase bounded/nested spatial contexts, Scrivener-like provisional-before-commit structure, Gstell-like low-commitment staging, and intelligence-workspace progression from free sensemaking into explicit analytical constructs.

The last runtime screenshots were rechecked against the result and confirm the architectural mismatch: source and thinking surfaces are separated; application modes are exposed before structure exists; ordinary selection opens an oversized inspector; sparse abstract landmarks still require reading.

See `PASS-2026-09-11-surface-architecture-comparison.md`. No production UI code was changed.
## Architecture synthesis — identity/placement/provenance/focus — 2026-09-11

Freeplane, Zotero, Trilium's persisted model, and the forward FOSS sweep converge on a stricter Working Picture architecture. Catalyst should separate six concerns: durable identity; occurrence/placement; context-scoped structural membership; identity-level semantic relation; source/version-scoped provenance; and focus-in-context.

The strongest result is operational rather than visual: an action should mutate only the state dimension it names unless the analyst explicitly promotes it. Move must not relate; grouping must not assert; connector routing must not define truth; opening/focusing must not rewrite structure; reuse must not imply copying or corroboration.

Two follow-on passes resolve additional scope questions. Working Picture organization should normally be occurrence/context-scoped so organizing one reuse does not reorganize every reuse globally. Source handling should separate Source Identity, exact Source Anchor, and any durable anchored excerpt/region identity created when a selection becomes placed/reused/annotated/related. Ordinary focus remains session/restoration state until deliberately promoted to a Saved View/Viewpoint.

See `PASS-2026-09-11-architecture-synthesis-working-picture-semantics.md`, `PASS-2026-09-11-architecture-resolution-scope-anchor-focus.md`, and `ARCHITECTURE_CHECKPOINT_2026-09-11.md`. No product code or workbench GUI was changed.
## Architecture state-separation and stress-test pass — 2026-09-11

Freeplane, Zotero, Trilium persisted-model evidence, AFFiNE, Logseq, Excalidraw, Hypothesis/W3C anchoring, and OpenRefine transformation provenance were synthesized into a testable Working Picture architecture.

Core separation is now: durable identity; context-local occurrence/placement; context-local structure; identity-level semantic relation; version-scoped provenance/anchors; transformation provenance; and focus/return state. Authored geometry is authoritative portrayal state even though it is not semantic truth.

Scenario testing added two important laws: repeated publications/occurrences never imply independent corroboration, and destructive operations must identify their target layer rather than overloading a universal `delete`.

Source anchors should use complementary format-aware selectors plus source-version identity and report resolution degradation honestly. Meaningful transformations should record inputs, transformation specification/execution, and outputs rather than rely on a single `derivedFrom` pointer or editor undo stack.

See `PASS-2026-09-11-architecture-synthesis-working-picture-semantics.md`, `PASS-2026-09-11-architecture-resolution-scope-anchor-focus.md`, and `PASS-2026-09-11-architecture-stress-tests-and-closure.md`.
## Forward FOSS implementation-reference closure — 2026-09-11

A bounded forward sweep tested distinct mechanisms rather than accumulating product features: AFFiNE/BlockSuite (isomorphic page/edgeless state), Logseq (references/embeds and node identity), Excalidraw (scene graph vs semantic graph), Zettlr (file-first/open-format ownership), SilverBullet (canonical source vs rebuildable semantic index), Hypothesis/W3C Web Annotation (redundant version-aware anchors), OpenRefine (replayable transformation provenance), and Automerge (local-first merge/conflict semantics).

The strongest combined model now separates state species, authority class, and concurrency behavior. Replication convergence is explicitly distinct from analytical reconciliation; transformation provenance is event-structured; source anchors carry resolution state; authored geometry is durable portrayal state without becoming semantic truth.

See `PASS-2026-09-11-forward-research-synthesis.md`, `PASS-2026-09-11-forward-research-automerge-conflicts.md`, `FORWARD_RESEARCH_CHECKPOINT_2026-09-11.md`, and `FORWARD_RESEARCH_ARCHITECTURE_HANDOFF_2026-09-11.md`.

Forward comparator research is closed by default. Reopen only for a concrete mechanism exposed as uncertain by architecture/prototype testing.

## Collaboration/conflict architecture pass — 2026-09-11

The forward Automerge pass closed the remaining multi-user conflict-semantics gap and was incorporated into `PASS-2026-09-11-architecture-collaboration-conflict-semantics.md`.

Result: replication convergence is not analytical reconciliation; merge granularity must follow domain intent; consequential concurrent alternatives remain inspectable; intentional disagreement is explicit attributable domain state; and human authorship remains separate from replica/change identity.

No CRDT/storage engine was selected. Collaboration is not added to the immediate disposable-prototype scope; the architecture merely preserves the ability to add accountable local-first synchronization later.

## Preliminary project-roadmap consolidation — 2026-09-13

A project-level synthesis reconciled the older milestone roadmap with the active 2026-09-13 implementation tracks. The key conclusion is that Catalyst has moved from broad architectural exploration into product consolidation: architecture/research is materially ahead of end-user workflow maturity.

The immediate planning target is now a **Catalyst Functional Baseline** rather than another architecture-number increment. Integration, source-first usability, Analysis-core simplification, mature Freeplane/Thorium interaction baselines, and visual consolidation precede renewed analytical-feature expansion.

The durable separation remains `identity != placement != structure != semantics != provenance != portrayal != interaction state`. The roadmap explicitly treats the current version label `0.6.3-alpha.3` as the last coherent release marker rather than a complete description of active source.

See `PRELIMINARY_PROJECT_ROADMAP_2026-09-13.md` for the staged execution plan and maturity assessment.