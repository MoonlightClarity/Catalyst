# Catalyst roadmap versioning guidance — 2026-09-13

Status: **historical versioning guidance from 2026-09-13.** The `0.6.3-alpha.3` package label remains a historical checkpoint label for the current integration tree, but release promotion is now governed by the current architecture and beta-readiness gate rather than this Functional Baseline plan.

## Current condition

`package.json` still identifies Catalyst as `0.6.3-alpha.3`, while the shared development tree contains substantial post-alpha.3 Reader, Analysis, portrayal, persistence, method, UI, and branding work.

That mismatch is acceptable temporarily because the current tree is an integration workspace, not an accepted release checkpoint.

## Rule until the Functional Baseline

Do not use a new semantic version merely to describe ongoing parallel work.

Use dated checkpoint names and the roadmap/integration documents for in-progress state. Keep `0.6.3-alpha.3` as the last coherent version label until a combined-tree checkpoint earns promotion.

Do not call the current state `0.6.4` while Reader/build integrity and Functional Baseline acceptance remain unresolved.

## At Functional Baseline acceptance

Choose the next version based on scope at that time:

- If the baseline is primarily a stabilization/integration completion of the existing 0.6.3 direction, promote to the next 0.6.3 alpha checkpoint.
- If it establishes a materially new accepted interaction/runtime boundary that supersedes the 0.6.3 milestone contract, use `0.6.4` and update `docs/roadmap.md` accordingly.

The version follows the accepted behavior boundary; it should not define it in advance.
