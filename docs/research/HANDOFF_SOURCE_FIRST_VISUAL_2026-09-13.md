# Catalyst source-first visual handoff

Current priority: make the product visually usable first, then add complexity later.

A parallel Catalyst chat is moving toward a source-first workflow. This track should align with that direction rather than define a competing architecture.

Source/document is the primary work surface. Capture, evidence, and thought creation should be obvious and readable. The Working Picture is downstream synthesis.
Typography/readability is part of the reset: conventional system sans typography, comfortable sizes, ordinary weight steps, predictable line-height, multiline content before truncation, and no decorative microtype for normal information.

New model/ontology work is paused unless a real product break requires it. Existing placement / structure / semantics / provenance boundaries remain valid, including genuinely unparented free placement.
Current visual state: `src/styles.css` has a provisional appended usability override that enlarges and simplifies Working Picture cards, source excerpts, and inspector typography. Backup is `src/styles.css.bak-nuclear-visual-20260913`. Treat the override as disposable until screenshot review.

A source-first visual probe exists at `tools/research-probes/2026-09-13/source_first_visual_baseline.mjs`. It captures reader, selection, and saved-evidence states at 1440x900. The source-region reuse setup probe was rerun successfully immediately before this handoff.

## Nuclear source-first visual reset — in progress
- Reader-first sidecar override reduced from up to 46vw to `clamp(360px, 32vw, 520px)` so the source is visually primary.
- Reader/context headers, tabs, search, empty-state, map/inspector typography raised to normal readable sizes; avoid 8–10px microtype as default UI.
- `SelectionCard.tsx` capture actions changed from icon-only controls to visible labels: **Create thought**, **Highlight**, **Save evidence**, **Copy**. Icons remain reinforcement, not the only explanation.
- Attach-to-existing-thought action now also has a visible **Attach** label; selection excerpt and controls are larger and laid out as a normal task surface.
- These are usability changes only. Do not add new workflow semantics to justify them.
- Live visual automation/compile validation was blocked by the current command-safety layer after Opera connector disconnected. Treat the appended CSS as a visual candidate requiring screenshot review; do not assume acceptance merely because it is in the file.
