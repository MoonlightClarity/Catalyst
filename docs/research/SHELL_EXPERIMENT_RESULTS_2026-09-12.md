# Catalyst shell experiment results — 2026-09-12

Status: three-shell comparison completed; production direction remains gated by one transition/reorientation correction.

## Question
The experiment tested whether Catalyst should preserve one literal spatial page or instead preserve continuous analytical context across coordinated projections.
All three shells used the same state model, commands, real Tradecraft PDF, source selection, and grounded-thought workflow.

## Controlled task
Viewport was fixed at 1440×900 after the original headless default (604×350) was rejected as invalid for comparison.
Before each condition, only `catalyst.browser.workspace.v1` and `catalyst.recovery.v1` were cleared.
The same real PDF-space selection was used in every run:
`A Tradecraft Primer: Structured Analytic Techniques for Improving Intelligence Analysis`.

Workflow: select source → Create linked thought → inspect/place → return to source → resume Working Picture.
The source-region drag was derived from the PDF's 612×792 coordinate system, not screenshot-specific pixels.

## Shell measurements
| Condition | Source presentation | Analysis presentation | Capture distance | New occurrence after create |
| --- | --- | --- | ---: | --- |
| Spatial-first | ~513×664 rendered page, viewer ~84%; floating reader ~893×778 | full-page Working Picture behind/above by layer | ~350 px | immediately visible |
| Reader-first | ~610×789 rendered page, viewer 100%; reader 1010×900 | 430 px sidecar in source focus; expands in analysis focus | ~298 px | initially off-screen |
| Split/focus | ~610×789 rendered page, viewer 100%; reader ~662×900 | ~773×900 simultaneous analysis | ~280 px | initially off-screen |

All three created exactly Working picture 1 / Evidence 1 from a clean state.
## Observed strengths and failures
Spatial-first best preserves immediate spatial continuity: after thought creation the authored occurrence remains visible and can be dragged without recovery.
Its costs are source readability, the largest source-selection→Catalyst-action separation, and a layer/z-order concept the analyst must understand.

Reader-first provides the strongest reading state and a clear source-dominant task posture. Its capture bridge is materially closer to the selection than the spatial control.
After Create linked thought, however, the Working Picture widens and the pre-existing camera transform leaves the new occurrence beyond the visible viewport.

Split/focus provides the shortest measured capture handoff and simultaneous readable source + substantial analysis area.
Its current capture bridge is visually too wide, and it has the same camera/reorientation failure as reader-first after creation.

For reader and split, one existing `Fit picture` action recovers the occurrence into view. In clean isolation this does **not** change EmbedPDF page scale.
An earlier 30%/multi-page screenshot was contaminated by previous test state and is excluded from the result.

## Source return
All shells successfully used the same linked-source command to return to Tradecraft page 1 and then resume analysis.
This is deterministic page return, not proof of exact source-region return.
Current `goToAnnotation()` navigates to `annotation.pageIndex`; the experiment did not demonstrate region-level re-highlighting/anchor restoration.
Therefore none of the three shells satisfies A6 completely yet.

## Categorization / identity
The clean Create-linked-thought run produced one annotation and one thought in every condition; shell composition itself did not cause duplication.
The earlier Save evidence → Create linked thought diagnostic still proves that repeated use of the same selection can create fresh annotation UUIDs.
That remains an architectural source-region identity vs analytical evidence-role correction, independent of shell choice.
## Decision against the pivot criterion
The experiment substantially weakens the literal-page shell as the default, but does not yet prove an unconditional reader-first or split/focus victory.
Reader-first materially improves source readability and capture locality, but its current projection transition damages immediate Working Picture reorientation by one recovery action.
Split/focus improves simultaneous reference and capture locality, but has the same reorientation cost and a noisier capture portrayal.
Spatial-first wins only the immediate-placement/reorientation dimension and loses the core reading/capture dimensions that triggered the assumptions check.

**Decision: conditional pivot toward reader-first as the default task posture, not a wholesale replacement of coordinated projections.**
Promote reader-first only after a small transition correction makes the Working Picture reframe itself when its viewport changes or when a newly created grounded thought becomes active.
Retain split/focus as an optional simultaneous-reference composition.
Retain spatial floating/overlap as a specialized portrayal/control, not the permanent product shell.

This is consistent with the surviving architectural statement:
> Catalyst is a document-grounded, version-aware analytical workbench that preserves continuous analytical context across coordinated projections.

## Next implementation slice
Do not redesign the shell again.
First make Working Picture camera/reorientation resilient to projection viewport changes and newly activated/created objects, without changing authored occurrence positions.
Acceptance criterion: the same grounded thought created from source is visible without requiring manual Fit in reader-first, split/focus, and spatial-first.

Then rerun the same three-shell task. If reader-first retains its source/readability advantage with no reorientation penalty, promote it to the production default posture.
After that, correct durable source-region identity so repeated analytical uses reuse the same source-region provenance object; model `evidence` as role/use rather than cloned source identity.
Exact source-region return remains a separate required slice after identity is stabilized.
## Post-experiment transition correction
A camera-only correction was then implemented in `WorkingPictureWorkspace.tsx`:
- viewport resize preserves the world point under the viewport center;
- an active occurrence is revealed only when it falls outside a safe visible region;
- authored occurrence/world positions are not changed;
- the inspector overlay is accounted for when choosing the reveal region.

Full Catalyst tests and production build pass after the change.
The same normalized shell workflow was rerun from clean state in all three conditions.

After Create linked thought:
- reader-first occurrence: visible at approximately x=899..1115;
- split/focus occurrence: visible at approximately x=780..996;
- spatial-first occurrence: visible at approximately x=434..650.

All three remained directly placeable and retained successful linked-source return.
The earlier reader/split manual-Fit penalty is therefore removed without modifying source state or authored geography.

## Final shell decision
The key-assumptions pivot criterion is now met.
Reader-first materially outperforms spatial-first on source readability and source→analysis handoff while no longer imposing a synthesis/reorientation penalty in the tested loop.

**Promote reader-first to Catalyst's default desktop task posture.**
Keep the Working Picture first-class and immediately reachable; do not make it the permanent full-screen home.
Keep split/focus as an optional simultaneous-reference posture and spatial floating/overlap as a specialized portrayal/control condition.

Next architectural correction remains durable source-region identity vs evidence role, followed by exact region-level source return.