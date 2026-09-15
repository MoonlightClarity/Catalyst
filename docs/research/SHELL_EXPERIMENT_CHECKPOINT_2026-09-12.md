# Catalyst shell experiment checkpoint — 2026-09-12

Status: cleanup completed; no product code changed yet.

## Governing direction
Preserve continuous analytical context, not necessarily one continuous visual page.
The current spatial/floating-PDF shell is the spatial-first control, not a product commitment.
The next implementation work is a research-only three-shell comparison over the same state, commands, and Tradecraft task.

## Mandatory cleanup completed
Inventory was performed first for `C:\Users\iris\Downloads` and `Catalyst\tmp`.
No user source material was moved or deleted.
`Tradecraft-Primer-apr09.pdf`, its sibling copies, `pixeleditor.swf`, `Capture.PNG`, and unrelated folders remain in place.

Moved into `tools\research-probes\2026-09-12\`:
- all loose `catalyst_*.mjs` diagnostics from Downloads;
- `capture_desktop.ps1`;
- `click_catalyst_layer_toggle.ps1`;
- `focus_opera_f6.ps1`;
- `invoke_catalyst_layer_toggle.ps1`.

Moved into `tools\research-probes\2026-09-12\artifacts\`:
- `desktop-catalyst.png`;
- `Catalyst\tmp\file-e2e.png`.

Deleted as disposable generated state:
- isolated `Catalyst\tmp\opera-e2e-file` Opera profile (883 files, ~153 MB);- `Catalyst\tmp\opera_history_handoff.sqlite` temporary copied browsing-history database;
- `Catalyst\tmp\query_opera_history.py` one-off handoff utility.

The temporary Opera profile was still running and locking cache data. Only processes whose command line referenced that exact `opera-e2e-file` user-data directory were stopped; the user's normal Opera session was not targeted.
`Catalyst\tmp` is now empty, and Downloads contains no loose Catalyst probe scripts from this pass.

## Architectural issue carried forward
The clean real-file diagnostic showed one source selection producing Evidence 1 after `Save evidence`, then Evidence 2 after `Create linked thought`.
`createNoteFromSelection()` currently creates a fresh annotation UUID every time.
Treat durable source-region/excerpt identity as reusable and treat `evidence` as an analytical role/use, not necessarily as a newly cloned source object.
Do not fold this correction into the shell experiment unless needed to prevent the comparison from being invalid; record duplicate/categorization behavior consistently across all variants.

## Three-shell experiment
1. Spatial-first control: preserve the current layered/floating-PDF composition.
2. Reader-first: source readability dominates and Catalyst capture is locally prominent at/near the selection locus.
3. Split/focus: source and analytical projection are independently focusable/resizable; simultaneity is available without required overlap.

Prefer research URL switches such as `shell=spatial|reader|split` and keep state/commands constant.
Use the identical Tradecraft loop in each: open real PDF → select source region → create grounded thought → organize/place it → return exactly to source → resume analysis.
Record source readability, steps/friction, capture discoverability, exact return, interruption/reorientation, provisional organization, source-vs-interpretation clarity, and duplicate/categorization errors.

Pivot only from comparative evidence; do not repair or promote the literal continuous-page shell by default.
