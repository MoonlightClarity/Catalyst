# Outline authoring system

Status: **current implemented interaction contract — 2026-09-17**

This document describes the mounted Outline interaction surface. `docs/CURRENT_ARCHITECTURE.md` is the higher-level product authority.

## Product boundary

The Outline is Catalyst's primary analytical authoring and structural surface. It owns parent/child placement, sibling order, titles, and inline note bodies. There is no separate Thoughts workspace and Map is no longer an active product surface.

Current flow:

```text
Reader / source work
    -> Outline structure + inline notes
    -> optional ordered Methods
    -> Export as PDF / DOCX / RTF
```

Methods are independent from Outline structure. Formal Assessments and the standalone Evidence workspace are not part of the current Outline contract.

## Structural invariants

1. Parent/child placement and sibling order are authored in the Outline.
2. Reordering, indenting, outdenting, folding, or selecting an item does not create hidden analytical meaning.
3. Fold/focus state is presentation/session state, not analytical truth.
4. Notes are edited directly within Outline items rather than in a separate Thought pane.
5. Historical graph/Map state and naming are implementation debt only; they must not reappear as user-facing structural authority.

## Current mounted UI

`src/features/analysis/AnalysisOutlineView.tsx` renders the ordered structural tree. Each visible item has a deterministic structural address such as `O 2.3`; its inline note body is addressable as `O 2.3 note` for Go To / LLM navigation.

Rows support structural focus, rename, sibling creation, indent/outdent, sibling reordering, collapse/expand, and removal through the current Outline controls. Inline note bodies remain editable in place.

## Keyboard contract

On a focused Outline row:

- `Enter` — add a sibling after the focused item;
- `F2` — rename;
- `Backspace` — remove the item through the current Outline deletion path;
- `Tab` / `Shift+Tab` — indent / outdent when structurally valid;
- `Alt+Up` / `Alt+Down` — reorder among siblings;
- `Up` / `Down` — move structural focus;
- `Left` / `Right` — collapse/expand or move toward parent/child context;
- `Home` / `End` — first/last visible Outline item.

Nested text editors and interactive controls do not inherit row-level structural shortcuts.

## Output boundary

Outline is an authoring surface, not a file-format implementation. The unified top-level **Export** operation writes the complete Outline first, followed by Methods, as PDF, DOCX, or RTF. Collapsed Outline items remain part of the authored document.

Portable editable state is preserved through `.catalyst.xml` Save/Load, not through exported reports.

## Persistence and compatibility

Current structural state is first-class Outline state. Historical graph/Map reducer fields, old Working Picture names, and other compatibility-era internals may remain in source until safely removed, but they do not define current product behavior.

Because Catalyst currently has no user migration burden, legacy structures should be removed when they are no longer technically required rather than preserved solely for backward compatibility.

## Validation

Focused coverage includes `scripts/test-outline.mjs`, XML/domain persistence tests, project-export tests, and deterministic navigation tests. After structural changes, run the narrowest relevant test first and then the current release gate described in `docs/release-readiness.md`.

## Forbidden regressions

Do not reintroduce Map as an active surface, a separate Thoughts workspace, standalone Evidence/Assessment surfaces inside Outline, Methods as Outline-owned metadata, or a second competing structural authority.
