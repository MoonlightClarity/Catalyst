# Catalyst accessibility baseline

Status: **1.0 maintenance baseline — 2026-09-16**

This document records what Catalyst currently does for keyboard and assistive access, where confidence is limited, and what should be verified before stronger accessibility claims are made. It is a maintenance contract, not a conformance claim.

## Current strengths

- The primary authoring surfaces are keyboard-driven. Outline supports focused-row operations and Methods exposes keyboard navigation/editing patterns in addition to pointer controls.
- The shared base stylesheet gives buttons, inputs, textareas, selects, and explicit `tabindex` targets a visible `:focus-visible` outline.
- Outline, Methods, and Reader styles add surface-specific focus treatment where the generic rule is not sufficient.
- The Reader root and document toolbar have accessible labels (`PDF reader` and `Document toolbar`).
- Reader actions that require an open PDF are gated rather than presented as functioning controls without a document.
- Catalyst uses native form controls for much of its editable content, preserving browser/OS keyboard and text-editing behavior.

## Known limits

- Catalyst 1.0 has **not** been audited against WCAG 2.2 and makes no WCAG conformance claim.
- The current source contains relatively little explicit ARIA metadata. Native semantics carry much of the interface, but complex Outline/Methods structures need screen-reader verification rather than assumptions from markup alone.
- No automated accessibility test runner is currently part of the release gate.
- No documented screen-reader matrix has been executed for the Windows release.
- Reduced-motion behavior is not currently documented as an explicit product contract.
- Color contrast has been visually tuned but is not backed by a recorded contrast-ratio audit.
- Full keyboard reachability, focus order, focus restoration after modal/full-screen transitions, and disabled-state announcements still need end-to-end verification.

## Manual verification checklist

For a release-candidate accessibility pass, verify at minimum:

1. Launch Catalyst and complete the supported Reader → Outline → Methods workflow using only the keyboard.
2. Confirm every interactive control receives an obvious focus indicator and that focus order follows the visual/task order.
3. Open and close Reader fullscreen and any Methods full-screen/editor state; confirm focus returns to a sensible origin.
4. Exercise Outline add, indent, outdent, reorder, note editing, and delete behavior without a pointer.
5. Exercise Methods selection, editing, subtasks, insertion, reordering, and return-to-list behavior without a pointer.
6. With a Windows screen reader, verify application landmarks, control names, editable-field names, current selection/focus, and state changes are understandable.
7. Check Reader day/night modes and the major Outline/Methods states with a contrast analyzer rather than relying only on visual inspection.
8. At 200% browser/display zoom, verify the supported workflow remains operable without clipped controls or inaccessible nested scrolling.

## Maintenance rules

- Prefer native HTML controls and semantics before adding ARIA.
- Never remove the shared focus indicator unless the replacement is at least as visible.
- Icon-only controls need an accessible name even when a tooltip is present.
- Keyboard shortcuts must not prevent ordinary text editing when an editor has focus.
- Treat a pointer-only operation in the supported workflow as a release-quality defect unless an equivalent keyboard path exists.
- Record verified assistive-technology/browser combinations here when they are actually tested; do not infer support from implementation alone.

## Current evidence boundary

This baseline was derived from the mounted 1.0 source and styles, including `src/App.tsx`, `src/styles/10-base.css`, `src/styles/30-analysis-outline.css`, `src/styles/40-techniques.css`, and `src/styles/50-reader.css`. It deliberately separates implemented focus/keyboard mechanisms from accessibility properties that still require human or assistive-technology testing.