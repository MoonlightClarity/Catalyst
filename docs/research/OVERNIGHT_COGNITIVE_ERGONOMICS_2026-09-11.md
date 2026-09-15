# Overnight cognitive ergonomics — 2026-09-11

Status: active research/checkpoint document. Research/docs only; no Catalyst GUI or product code changed.

Role boundary: study cognitive dimensions, attention, progressive disclosure, density, focus-in-context, spatial legibility, and failure modes for expert analytical software. This pass assumes the current Working Picture architecture contract unless evidence reveals a real contradiction.

## Checkpoint 1 — baseline absorbed

Read first: `SELF_FACILITATING_CHAT_COORDINATION_2026-09-11.md`, `CURRENT_STATE.md`, `PASS-2026-09-11-cognitive-architecture-ui.md`, `PASS-2026-09-11-cognitive-workspace-architecture.md`, `WORKING_PICTURE_ARCHITECTURE_CONTRACT_2026-09-11.md`, and `ARCHITECTURE_CHECKPOINT_2026-09-11.md`.

The existing research already establishes a strong candidate: bounded/nested Working Pictures, placed source landmarks, provisional spatial organization, explicit promotion into structure/semantics, contextual chrome, and focus-in-context source reading.

This pass therefore does **not** reopen the basic ontology. Its question is narrower: what perceptual and cognitive constraints must govern how much is shown, hidden, emphasized, moved, generalized, or restored so that the architecture remains usable under expert analytical load?

Early conclusion: Catalyst's main cognitive risk is not simply "too much information." It is **attention competition plus state discontinuity**. A dense expert workspace can be usable when its visual hierarchy, landmarks, spatial continuity, and disclosure grammar are stable; a sparse workspace can still be cognitively expensive when the user must reconstruct hidden state, mode, provenance, or location.

## Working thesis

Optimize for **recoverable complexity**, not minimalism. The analyst should be able to carry a large analytical record while perceiving only the subset needed for the current operation, with reliable cues showing what exists beyond the current focus and with reversible transitions back to prior context.

## 1. Cognitive Dimensions reframed for Catalyst

Cognitive Dimensions is useful here because Catalyst is not only an application; it is a notation/environment in which analysts construct and revise external representations. The critical dimensions are therefore interaction laws, not a scorecard.

### Premature commitment
Catalyst should delay decisions whose information value is low at the moment of capture. Naming, typing, choosing a method, asserting a semantic relation, deciding final branch membership, or selecting a permanent view are all expensive when understanding is immature.

Ergonomic rule: **the cost of creating an unclassified but recoverable item should be lower than the cost of classifying it incorrectly**.

### Viscosity
Revision cost matters more than initial neatness. A picture that is easy to create but expensive to reinterpret will punish real analytical learning.

Ergonomic rule: reorganizing occurrences, provisional groups, branches, or local portrayals should not require repairing unrelated semantic or provenance state. This matches the architecture contract's mutation law.

### Visibility and juxtaposability
Analytical comparison fails when relevant evidence is technically available but cannot be held in perceptual relation. Visibility is therefore task-relative: the goal is not to show everything, but to make the currently compared set simultaneously inspectable while keeping enough neighborhood context for orientation.

### Hidden dependencies
Provenance, reuse, transformation lineage, relation truth, and downstream analytical consequences are legitimate dependencies. They should not all be permanently visible, but the interface must offer strong cues that they exist and a short path to inspect them.

### Secondary notation
Whitespace, adjacency, alignment, overlap, territory, order, size, and authored geography may carry provisional meaning. Catalyst must preserve this cognitive value while keeping it visibly non-semantic until explicitly promoted.

### Role-expressiveness
At working scale, source material, analyst-authored thought, question/gap, explicit structure, semantic assertion, and derived/system state should be distinguishable by visual role without requiring body-text reading.

### Progressive evaluation
An incomplete Working Picture must already support useful judgment. The system should not become legible only after the analyst has fully typed, linked, tagged, or methodized the material.

### Hard mental operations
Any state the analyst must remember because the interface erased its perceptual cues is suspect. Typical examples: where a source came from, what was being compared before opening it, why two objects appeared together, whether an edge was hidden or deleted, and which local picture a reused identity came from.

## 2. Attention is the scarce resource, not pixels

Rosenholtz et al. define clutter operationally through task degradation, not raw object count. Their work also notes the opposite failure: excessively sparse displays can waste space and force navigation to obtain information that could have remained perceptually available.

That distinction is central for Catalyst. **Density and clutter are not synonyms.** A dense display can remain usable when visual channels are orderly and task-relevant targets retain salience; a sparse display can be cognitively cluttered when every object is equally abstract, every label demands reading, or the analyst must navigate repeatedly to recover missing context.

Catalyst should therefore budget attention across competing salience channels:
- identity/recognition cues;
- authored spatial grouping;
- current focus;
- formal analytical relations;
- warnings/uncertainty/provenance degradation;
- temporary controls and chrome.

No channel should win merely because it is easy to render. In particular, selection outlines, connector networks, badges, counts, metadata labels, and method overlays can collectively destroy the salience of source landmarks even if each is individually subtle.

### Salience budget rule
Only a small number of things should demand focal attention at once. Everything else should remain discoverable through peripheral structure, stable placement, or on-demand disclosure.

### Distinctiveness rule
Use variation to encode analytical role or state, not decoration. Random variation in color, shape, border, or iconography increases feature congestion and weakens search.

## 3. Progressive disclosure must disclose state, not conceal it

Classic progressive disclosure hides advanced or infrequent controls until requested. That is useful for Catalyst, but naive application would create a new failure mode: the analyst may not know that important state exists behind the hidden surface.

For expert analytical software, progressive disclosure needs three layers:
1. **quiet base state** — analytical material dominates;
2. **persistent scent** — compact cues indicate that deeper provenance, uncertainty, history, reuse, or methods exist;
3. **deliberate expansion** — detail opens locally or in focus when the analyst asks.

Thus "hidden" must not mean "undetectable." A source with degraded anchoring, an unresolved analytical conflict, or an important provenance dependency requires a visible but non-dominant scent even when its full detail is collapsed.

Progressive disclosure should be driven by task frequency and consequence, not by beginner-versus-expert stereotypes. Experts benefit from reduced visual competition too, but they also require fast invocation, keyboard access, predictable locations, and the ability to keep selected advanced surfaces open when a sustained task requires them.

### Disclosure persistence rule
A disclosed expert surface may remain open by user choice for a work episode, but the application should not convert that temporary choice into a permanent global layout obligation.

### No mystery-meat rule
Do not replace visible labels with arbitrary icons merely to reduce chrome. Recognition cost can exceed space savings. Use compact labels, conventional symbols, or learned Catalyst glyphs only where role-expressiveness remains high.

## Checkpoint 2 — architecture survives the ergonomics pass so far

No evidence found so far contradicts the bounded-desk / focus-in-context architecture. Instead, the ergonomics literature sharpens it: progressive disclosure is safe only when hidden analytical state leaves reliable information scent, and density should be controlled by perceptual competition rather than by simple object-count thresholds.

## 4. Focus-in-context: preserve the seam

Focus+context techniques exist because detail and overview compete for limited perceptual space. Reviews of overview+detail, zooming, and focus+context show that no single scheme dominates universally; the task, display scale, and navigation demands matter.

For Catalyst, this argues against treating focus-in-context as a graphical fisheye effect. The stronger requirement is **continuity of identity, neighborhood, and return** while the focused object receives more representational bandwidth.

A source-opening transition should preserve at least:
- the identity of the occurrence that was entered;
- a visible or quickly recoverable cue to its originating neighborhood;
- the compared/selected set when analytically relevant;
- the exact source region or page that motivated entry;
- a deterministic return target;
- enough local geometry that return does not require re-search.

The context may be visually compressed, dimmed, cropped to landmarks, or represented by a breadcrumb/miniature if screen size demands it. What must not disappear is the analyst's ability to answer: **Where was I, what was I comparing, and how do I get back?**

### Preserve object constancy
Semantic zoom may change portrayal, but recognizable invariants should survive the transition: landmark image/crop, stable label, shape family, relative neighborhood, or movement trajectory. Abrupt replacement by an unrelated full-screen reader risks turning focus into a hidden mode switch.

### Prefer reversible depth over parallel panes
Persistent side-by-side panes tax horizontal space and can force continuous cross-view integration. Focus depth is preferable when the analyst is doing one dominant operation, provided return fidelity is excellent. Side-by-side or pinned comparison remains useful when the task genuinely requires simultaneous reading/comparison.

### Pinning is an expert escape hatch
Allow analysts to deliberately pin two or more focused items when comparison requires simultaneity. This should be an explicit temporary composition, not the default layout architecture.

## 5. Spatial legibility and reorientation

Recent spatial-document work reinforces the older Data Mountain result: stable spatial overviews can improve non-linear revisitation, reduce disruption, and support reorientation even when thumbnail text is unreadable. In a 2025 study, compact spatial overviews were especially strong for reorientation because the complete layout remained within one field of view.

Catalyst implication: the overview state should preserve a recognizable **whole** at the scale of the current Working Picture. If the user must pan around merely to remember the picture's major regions, the picture is already too large or insufficiently bounded.

### Working Picture horizon
A human-scale Working Picture should have a perceptually graspable horizon: major territories, landmark sources, open questions, and subpicture entrances should be discoverable without serial exploration of the entire surface.

This does not require every object to be simultaneously readable. It requires the analyst to perceive the topology of the work: where clusters are, where gaps are, where source-heavy regions are, and where the current focus sits within that structure.

### Geography stability rule
Avoid automatic reflow, collision-avoidance movement, or scale-dependent rearrangement of authored objects. Generalize portrayal before moving landmarks. If automatic layout is offered, it should operate on a derived/proposed view or require explicit analyst acceptance.

### Landmark diversity rule
Real source crops, page silhouettes, maps, images, distinctive charts, and stable authored group shapes are more useful for spatial memory than a field of visually interchangeable cards. Universal-card rendering sacrifices recognition to implementation uniformity.

### Peripheral context rule
Off-focus context should retain coarse structure rather than collapse into undifferentiated dots. Peripheral vision is good at broad spatial pattern and poor at fine identity; Catalyst should exploit that by preserving grouping, extent, and landmark silhouette while reducing text/detail.

## 6. Density is a regime change, not a slider

Network-visualization research shows a familiar scalability cliff: as complexity increases, performance degrades and eventually users stop extracting structure. Catalyst should not assume that semantic zoom can rescue an arbitrarily dense Working Picture.

Treat density as three qualitatively different regimes:
- **working density** — enough objects remain individually recognizable and directly manipulable;
- **compressed density** — local objects still exist, but groups, territories, and landmarks carry more perceptual load while detail becomes on-demand;
- **scope failure** — the picture contains too many competing regions or relations for a stable whole; enter a subpicture, projection, or filtered working set rather than shrinking further.

The threshold should be evaluated by task performance, not a universal item count. Source imagery, connector crossings, label length, overlap, color variation, and relation density all affect visual congestion.

### Connector restraint
Semantic edges should not all be simultaneously rendered merely because they exist. Dense relation portrayal can visually overwrite authored geography. Default relation visibility should follow the current analytical task or lens, with clear cues that additional relations exist.

### Text restraint
Text is not free information. Labels can reduce ambiguity at moderate levels but become another texture field when numerous. Overview should rely on landmark recognition and short identity cues; prose belongs at working or focus scale.

### Whitespace is functional
Whitespace separates territories, creates search structure, and signals provisional distinctions. It should not be automatically optimized away by packing algorithms.

### Density intervention order
When a picture becomes hard to read, prefer this sequence:
1. reduce low-value chrome;
2. reduce secondary labels and badges;
3. generalize object portrayals;
4. selectively suppress relation portrayals;
5. emphasize authored groups and landmarks;
6. focus or filter to the current working set;
7. move into a subpicture or alternate projection.

Do not begin by relocating the analyst's objects.

## 7. Interruption and resumption are first-class analytical events

Altmann and Trafton's interruption work shows that resumption lag is a real cost and that perceptually available cues can improve recovery. Their complex-task experiment found resumption lag roughly twice the ordinary inter-action interval, and preserved cues before interruption improved later resumption.

Catalyst should therefore treat interruption recovery as part of the interface contract, not as an incidental browser-history problem.

Useful resumption cues include: the prior viewport/neighborhood, the last focal object, the active compared set, the open source region, visible provisional grouping, and a small indication of the last consequential analytical action.

A saved or recoverable session should restore enough of this operating context to let the analyst pick up the thread without reconstructing it from a global history log.

### Interruption policy
Non-urgent system feedback should avoid stealing focus. Provenance warnings, anchor degradation, validation findings, and method results can accumulate as inspectable state unless immediate action is required to prevent destructive error.

When the system must interrupt, it should preserve the current analytical display long enough for the analyst to encode a resumption cue, and restoration should return to the same operating place.

## 8. Failure modes for expert analytical software

### Sparse-but-expensive
Few objects are visible, but every object is abstract and every action requires reading labels or opening panels. The screen looks calm while cognition is busy reconstructing meaning.

### Dashboard before work
The product exposes its own taxonomy, modes, metrics, and controls before the analyst has material to act on. Application architecture becomes the first object of attention.

### Progressive disappearance
Controls or state are hidden so aggressively that experts must remember invisible capabilities and dependencies. Minimalism becomes memory load.

### Inspector capture
Ordinary selection opens large metadata surfaces and repeatedly steals spatial context from the analytical material.

### Semantic confetti
Badges, confidence markers, tags, timestamps, method states, source counts, relation glyphs, and warnings all compete at once, flattening the salience hierarchy.

### Infinite-canvas dilution
Scaling is handled mainly by zooming farther out. Objects become unrecognizable, navigation distances grow, and the overview stops functioning as a coherent whole.

### Auto-layout amnesia
The system improves geometry according to an algorithm but destroys the analyst's spatial memory and provisional secondary notation.

### Relation hairball
All true semantic relations are portrayed simultaneously, making analytical truth technically visible but practically unreadable.

### Focus tunnel
Entering detail removes too much surrounding structure. The analyst can read deeply but loses the question, comparison set, and route back.

### Representation jump
Semantic zoom swaps an object into a visually unrelated representation with no stable landmarks, so every scale change requires re-identification.

### Hidden mode through context
The same gesture has materially different meaning depending on invisible focus, lens, or selection state. Contextual UI becomes mode error rather than mode reduction.

### Expert tax
Progressive disclosure protects first use but forces practiced analysts through repeated expansion steps. Advanced actions need direct, learnable invocation without re-populating the base UI.

### Provenance alarm fatigue
Every provenance fact is styled as a warning. Genuine anchor degradation or source-independence concerns then lose perceptual priority.

### Density panic
The system reacts to crowding by hiding arbitrary content or rearranging it. The analyst loses trust in what the picture means and where things went.

## 9. Ergonomic laws for the disposable prototype

1. **Legibility before readability** — overview meaning must survive when body prose is unreadable.
2. **Stable geography before elegant layout** — preserve authored position unless the analyst explicitly asks for a new layout.
3. **Compress before hide; hide before move** — preserve information scent and spatial memory as density rises.
4. **Focus deepens an object; it does not teleport to another application mode.**
5. **Contextual controls must not create invisible modes.** The action's target and scope should remain perceptible.
6. **Warnings compete for a scarce channel.** Reserve strong salience for states that affect analytical trust or destructive risk.
7. **Expert power belongs on fast paths, not permanent chrome.** Keyboard/command access and pinned task surfaces can coexist with a quiet base state.
8. **Spatial suggestion is useful precisely because it is weaker than semantic assertion.** Do not erase that distinction visually.
9. **A Working Picture that cannot be grasped as a whole has exceeded its ergonomic scope.**
10. **Return is part of open.** Any deep inspection transition is incomplete until return fidelity is verified.

## 10. Prototype evaluation matrix

The disposable interaction prototype should pair architecture mutation traces with human cognitive/ergonomic measures. A prototype can obey the data model and still fail as a thinking environment.

### Structural-legibility task
Show an established Working Picture at overview scale with prose hidden or unreadable. Ask the evaluator to indicate major source regions, provisional clusters, formal structures, open questions/gaps, current focus, and subpicture entrances.

Failure: the evaluator must open labels or inspect most objects before describing the picture's shape.

### Search and return task
From the Working Picture, enter a source, navigate within it, inspect a provenance detail, then return and continue the interrupted comparison.

Measure: return accuracy, number of corrective navigation actions, time to resume the prior operation, and whether the evaluator can identify the prior comparison set.

### Progressive-disclosure task
Perform ordinary placement and comparison, then provenance-heavy verification, then return to ordinary work.

Measure: permanent screen territory consumed, number of expansion steps, fast-path availability for a practiced user, and whether hidden consequential state remains perceptibly signaled.

### Density ladder
Run the same analytical operation at low, medium, compressed, and deliberately over-scope densities. Increase not only object count but connector density, label load, mixed media, and overlap.

Measure: target-search time, grouping recognition, relation-trace accuracy, navigation corrections, perceived workload, and point at which the analyst chooses to enter a subpicture or projection.

### Interruption/recovery task
Interrupt after the analyst has formed a provisional comparison but before formalization. Restore the session later.

Measure: resumption lag, wrong-object actions, need to consult history, and accuracy reconstructing the pre-interruption goal.

## Checkpoint 3 — durable handoff prepared

A successor seed now exists at `COGNITIVE_ERGONOMICS_SUCCESSOR_SEED_2026-09-11.md`. The current pass remains within research/docs boundaries and has not touched Catalyst GUI or product code.

## 11. Strong conclusions

The strongest cognitive-ergonomic conclusions are now sufficiently stable to constrain prototype design:

- Catalyst should optimize for **recoverable complexity**, not minimum visible information.
- Density should be judged by task interference and visual competition, not by object count alone.
- Progressive disclosure must preserve information scent for consequential hidden state.
- Focus-in-context is fundamentally a continuity contract: identity, neighborhood, comparison state, source position, and deterministic return matter more than any particular animation or fisheye technique.
- Stable authored geography is an external-memory resource and should outrank automatic neatness.
- A bounded Working Picture should remain graspable as a whole even when individual text is unreadable.
- Expert efficiency requires fast paths and optional pinned task surfaces without making those surfaces permanent chrome.
- Interruption recovery should restore operating context, not merely reopen files.
- Semantic relation visibility must be task-selective; portraying every true relation simultaneously can make truth unusable.
- Strong visual salience should be reserved for analytical trust, uncertainty/degradation, destructive risk, and immediate task focus.

## 12. Open questions worth prototyping, not theorizing further

- What exact perceptual cue best signals hidden provenance/reuse/uncertainty without badge proliferation?
- How much surrounding neighborhood should remain visible during source focus on typical laptop displays?
- What is the best transition between overview, working scale, and source-reading scale while preserving object constancy?
- At what empirical density does a Working Picture stop behaving like one place and need subdivision?
- When should the system recommend a subpicture versus a temporary filter/lens?
- Which advanced surfaces should support pinning, and how should pinned state expire or remain session-local?
- What minimal resumption cue is sufficient after hours-long interruption without turning session history into permanent clutter?

## 13. High-value sources used in this pass

Foundational / framework:
- Green & Blackwell, *Cognitive Dimensions of Information Artefacts: a tutorial* — https://www.cl.cam.ac.uk/~afb21/CognitiveDimensions/CDtutorial.pdf
- Blackwell & Green, *A Cognitive Dimensions Questionnaire* — https://web.engr.oregonstate.edu/~burnett/CS589empirical/BlackwellGreen-CDQuestionnaire.pdf
- Shneiderman, *The Eyes Have It: A Task by Data Type Taxonomy for Information Visualizations* — https://drum.lib.umd.edu/items/155a868e-fb83-4115-9899-9187ea8c0498
- Pirolli, *Rational Analyses of Information Foraging on the Web* — https://doi.org/10.1207/s15516709cog0000_20

Attention / clutter:
- Rosenholtz et al., *Feature Congestion: A Measure of Display Clutter* — https://web.mit.edu/rruth/www/Papers/RosenholtzEtAlCHI2005Clutter.pdf
- Rosenholtz et al., *Measuring visual clutter* — https://pubmed.ncbi.nlm.nih.gov/18217832/
- Yoghourdjian et al., *Scalability of Network Visualisation from a Cognitive Load Perspective* — https://arxiv.org/abs/2008.07944

Focus, overview, and spatial continuity:
- Furnas, *A fisheye follow-up: further reflections on focus + context* — https://doi.org/10.1145/1124772.1124921
- Hornbæk/Hertzum review line of work on overview+detail, zooming, and focus+context interfaces — see overview at https://www.kasperhornbaek.dk/
- Brett & Bateman, *Spatially Organized Interfaces for Document Navigation in Mixed Reality* (SUI 2025) — https://doi.org/10.1145/3694907.3765921

Interruption / resumption:
- Altmann & Trafton, *Task interruption: Resumption lag and the role of cues* — https://www.interruptions.net/literature/Altmann-CogSci04.pdf
- Altmann & Trafton, *The timecourse of recovery from task interruption* — https://act-r.psy.cmu.edu/wordpress/wp-content/uploads/2012/12/830interruptions.pdf

Progressive disclosure:
- Nielsen, *Progressive Disclosure* — https://www.nngroup.com/articles/progressive-disclosure/

## Continuity note

A coordinator-state check was attempted through the authorized Opera Browser Connector, but the connector reported that the browser was not connected. No coordinator message was sent because stall state could not be verified safely. The exact recovery rule remains in the coordination file for a successor with a working bridge.
