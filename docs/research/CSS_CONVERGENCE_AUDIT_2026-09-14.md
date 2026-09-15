# Catalyst CSS Convergence Audit — 2026-09-14

> **Freeze update:** This audit is historical context. The ownership/module refactor described as future work below was completed and frozen later on 2026-09-14. See `CSS_REFACTOR_FREEZE_2026-09-14.md`.

This audit records the current CSS convergence state after the September 14 cleanup passes. It is a stabilization/research document, not a redesign specification.

## Scope

The audit is limited to Catalyst's CSS system: visual tokens, typography, cascade structure, dead or retired selector families, responsive ownership, research/prototype styling, and regression safety. Interaction architecture is included only where it determines whether CSS is active or obsolete.

## Current architectural state

Catalyst has converged on a generated, read-only Working Picture controlled structurally by Outline. The prior GraphWorkspace architecture is retired, and live `src/styles.css` no longer contains the `.graph-*` selector family.

The current Working Picture no longer exposes ordinary node dragging, resizing, zoom controls, or map-side structural editing. The map is a portrayal/navigation surface; structural changes route through Outline.

The main stylesheet is still large and remains under concurrent modification. During this audit it moved between roughly 8,900 and 9,300 lines. Exact counts should be treated as snapshots rather than stable metrics.

## What has already improved

The largest retired selector family, `.graph-*`, has been removed from live CSS. The Working Picture component was also substantially reduced as dormant map-editing code was removed.

The production build succeeds after these changes. The visual-language contract was temporarily stale during the transition, but has since been updated to the generated/read-only map contract and is passing again.

The Outline is already using CSS container queries. This is an important precedent: Catalyst already has the correct component-responsive mechanism in production code, even though reader/annotation surfaces still rely heavily on viewport media queries.

## Remaining dead CSS

A conservative post-Graph scan still identified about 38 high-confidence retired classes touching roughly 126 CSS rule blocks. About 74 of those blocks appear to be pure dead CSS, representing approximately 545 lines. Another roughly 52 rule blocks mix retired and live selectors and require selector-list surgery rather than whole-block deletion.

High-confidence residue includes old `picture-scale-*` semantic-zoom styling, fixed `picture-territory-*` landmarks, `picture-provenance-spine`, old `picture-evidence-*` fragment presentation, `picture-inline-trace`, `picture-mode`, retired NoteEditor/NotesList-era selectors, `reader-mode-label`, and several older selection-card substructures.

These counts are estimates from a moving source tree. They should guide the next cleanup pass, not be used as immutable acceptance thresholds.

## Dynamic class warning

Catalyst constructs many valid class names dynamically. An unused-CSS tool that relies only on exact source-string matches can delete active styling.

Examples include `relationship-*`, `species-*`, `territory-*`, `confidence-*`, `workspace-shell-*`, `workspace-unified-*`, `role-*`, `zone-*`, portrayal modifiers, desk-item classes, and analytic-mark classes.

For this reason, a blind PurgeCSS-style sweep is not appropriate. Dead CSS should be removed from explicit architectural knowledge, source control-flow evidence, and regression tests.

## Cascade structure

The stylesheet still behaves like a chronological change log. Multiple visual generations coexist, and later rules frequently repair earlier rules through source order.

At the current snapshot there are three `:root` token blocks and multiple top-level definitions of core selectors including `.reader-header`, `.annotation-toolbar`, and `.technique-picker-toolbar`.

The three token blocks are not merely duplicate values. They represent separate vocabularies: the original paper/signal system, the intermediate graphite/plot/trace system, and the newer shell/typography system. Convergence should remove obsolete token vocabularies only after their surviving consumers are identified.

## Reader and annotation risk

Reader and annotation styling remains the largest active cascade hotspot. Successive redesigns have redefined the same global selectors at progressively later points in the file.

The newest annotation rail/top-surface work is current and should not be reverted. The cleanup target is the older definitions beneath it: determine the intended winning behavior, preserve that behavior once, and remove superseded predecessors.

After convergence, reader/annotation responsiveness should preferentially use container queries because the relevant constraint is pane width, not browser viewport width.

## Research/prototype CSS

Portrayal Lab, Desk Prototype, and unified-workflow research surfaces are still intentionally reachable. Their CSS is therefore not dead.

However, research/prototype CSS should not participate indefinitely in the production workspace cascade. A later structural split should isolate research surfaces into a dedicated stylesheet or route-scoped import while preserving those tools.

## Overlay hazard

`overlay/src/styles.css` is materially stale relative to live `src/styles.css`. It still contains extensive retired Graph-era styling and other obsolete selectors.

`apply_portrayal_lab_m1.ps1` recursively copies overlay files over the live project with force enabled. Running that legacy apply path can therefore resurrect retired CSS and overwrite convergence work.

The overlay should be retired, quarantined, or refreshed before the CSS cleanup is considered durable. Until then, it must not be treated as a current source of truth.

## Regression coverage

`scripts/test-visual-language.mjs` is useful as an architectural guardrail, but it must track current design contracts rather than preserve historical implementation details.

The test has already been updated during this pass to reflect the generated/read-only Working Picture. Future CSS convergence assertions should focus on invariants such as: retired `.graph-*` selectors do not return; zoom-level portrayal classes do not return; fixed territory/provenance landmarks do not return; Outline remains the structural editor; and current metadata/provenance affordances remain visible.

Static tests should also progressively prohibit new retired-selector families, arbitrary new `!important` escalation, and duplicate canonical component definitions after each area is consolidated.

## Recommended convergence order

1. Keep the current build and visual-language contract green.
2. Remove pure high-confidence dead CSS.
3. Remove dead selectors from mixed selector lists without deleting declarations required by live selectors.
4. Retire or quarantine the stale overlay/apply path.
5. Consolidate the active reader/annotation/technique override chains.
6. Collapse obsolete token vocabularies after their consumers disappear.
7. Extend container-query responsiveness from Outline to reader/annotation/sidebar components.
8. Move Thorium/annotation colors and typography onto shared semantic tokens.
9. Separate research/prototype CSS from product CSS.
10. Only after convergence, split the monolithic stylesheet into ownership-based modules and introduce cascade layers/lint ratchets.

## Proposed ownership model

The eventual production CSS should be organized by ownership rather than chronology: tokens/base, shell, reader, annotations, Working Picture, Outline, evidence, techniques, and overlays. Research/prototype styling should be separate.

Do not split the current stylesheet before convergence. Today, source order still contains behavior; prematurely distributing those rules across files would hide rather than remove the cascade dependencies.

## Stabilization and rollback

The Catalyst folder is not currently a Git repository, so CSS convergence should not assume `git status`, commits, or branch rollback are available. Use Catalyst's existing backup/snapshot mechanisms before destructive cleanup passes.

Because parallel chats may continue modifying the stylesheet, each convergence pass should establish a fresh baseline, preserve a snapshot, make one ownership-scoped change, and then rerun the relevant build and visual-language checks.

## Acceptance direction

A successful CSS convergence pass should reduce historical rule count without changing intended visible behavior, keep the production build green, keep current visual-language contracts green, and prevent retired selector families from returning.

The goal is not a minimum line count. The goal is one clear owner for each visual behavior, one current token vocabulary per semantic purpose, and responsive rules based on the component that is actually constrained.

## Stabilization principle

The remaining CSS problem is no longer primarily aesthetic. It is an ownership and historical-residue problem.

Catalyst does not need a wholesale CSS rewrite. The safer path is to delete retired architectures, preserve the current winning behavior, normalize the surviving visual system, and then make future regressions mechanically harder to introduce.
