# Catalyst UI modernization checkpoint — 2026-09-13

Status: active visual modernization pass. Product/model architecture intentionally unchanged.

## Scope
- Project root: `C:\Users\iris\Downloads\Catalyst`.
- Primary edit: `src\styles.css`.
- Safety backup: `src\styles.css.bak-ui-modernize-20260913-1448`.
- This pass follows the source-first usability direction: source/document remains visually primary; Working Picture is downstream synthesis.
- Preserve concurrent node, persistence, and reader work. Do not restore old whole-file backups over live files.

## Visual direction
Catalyst should feel like a modern analytical workspace, not a graph editor or instrumentation dashboard.
Use conventional system UI typography, readable hit targets, restrained graphite surfaces, paper-like source content, and teal only as a structural/action accent.
Remove decorative microtype, telemetry-like labels, and unnecessary framing before adding new visual complexity.

## Changes completed
- Unified source-first shell now has a calmer 54px header and consistent control sizing/radii.
- Catalyst branding is quieter and no longer depends on an ornamental horizontal rule.
- Working Picture tabs use normal-case readable labels with count badges.
- Reader-sidecar Working Picture toolbar uses a two-row narrow-pane layout instead of squeezing search and New thought into one row.
- Empty Working Picture no longer shows SOURCE / ASSESS territory scaffolding when there are no nodes.
- Empty-state copy and primary creation action are larger and visually clearer.
- PDF text capture card now uses a clear two-column action hierarchy: Create thought / Save evidence first, Highlight / Copy second.
- Selection excerpt is visually paper-like and remains the primary landmark.
- Selected-thought Branch / Connect / Focus / More controls have larger modern hit targets and a cleaner popover.
- Working Picture zoom/arrangement controls were softened and enlarged slightly.
- Evidence styling now uses readable search, filters, card spacing, metadata, and action targets.
- Reader-sidecar thought inspection is now a full detail plane instead of compressing canvas + inspector into two narrow strips.
- Inspector title/body fields, Sources, Relationships, metadata, and destructive action hierarchy were modernized.
- Canvas controls/hints are hidden while the full inspector is open.
- Library, command palette, and workspace capability menu were brought into the same visual vocabulary.

## Visual validation completed
The source-first fixture was reviewed at 1440×900 before the current reader rewrite became uncompilable.
Screenshots include:
- `tools\research-probes\2026-09-13\source-first-01-reader.png`
- `tools\research-probes\2026-09-13\source-first-02-selection.png`
- `tools\research-probes\2026-09-13\ui-modern-inspector.png`
The inspector screenshot confirmed the full-plane detail treatment fixes the earlier crushed sidecar layout.

## Current validation block
A parallel track is actively rewriting `src\viewer\ThoriumPdfReader.tsx`.
During this pass the file grew from a truncated ~273 lines to 600+ lines and is still changing.
`npm run build` currently fails on unclosed JSX in that file; do not overwrite it from this UI track.
`src\styles.css` itself was parsed successfully with Lightning CSS after the modernization edits.

## Exact next validation sequence
1. Wait for the Thorium reader track to leave the repository compilable; do not repair its in-progress file here.
2. Run `npm run build` from the Catalyst project root.
3. Re-run source-first reader and selection screenshots at 1440×900.
4. Populate one saved evidence item and review Evidence in the reader sidecar.
5. Create/select several thoughts and review populated Working Picture at reader-sidecar and full-analysis widths.
6. Review Library, Commands, and workspace configuration overlays once runtime is stable.
7. Only after screenshot acceptance, consolidate the accumulated late CSS override layers into a smaller maintained design-system section.

## Guardrails
- Visual usability before ontology expansion.
- Do not reintroduce 8–10px microtype as normal UI.
- Do not make icon-only controls the sole explanation of common primary actions.
- Do not flatten provenance, structural hierarchy, semantic relationships, confidence, or analytical role into a single visual channel.
- Preserve parentless free placement and the current Branch / Connect / Focus action grammar.
- Do not let modernization turn Catalyst into generic SaaS chrome; source material and analytical structure should remain visually distinct.
