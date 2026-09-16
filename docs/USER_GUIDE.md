# Catalyst user guide

Catalyst is a local-first workspace for reading a PDF, organizing analysis in a numbered Outline, and applying optional structured Methods. It is designed to keep source reading and analytical structure together without requiring a cloud account or AI service.

## The basic workflow

1. Open a source PDF in the Reader.
2. Build a numbered Outline beside the source.
3. Write and reorganize notes as the analysis develops.
4. Add Methods when a structured technique is useful.
5. Save the workspace as a `.catalyst.xml` session.
6. Load that session later and reconnect the source PDF when needed.

Catalyst does not modify the original PDF. The source document and Catalyst session remain separate files.

## Reader

Use the Reader for source work. Its compact toolbar provides page navigation, zoom out/reset/in, day/night display, Find, and fullscreen controls. PDF-local markup belongs to the Reader; it is not a second analytical workspace.

Opening a different PDF changes the source being viewed, not the analytical meaning of the Outline. A saved Catalyst session records workspace state and source identity so the source can be reconnected later.

## Outline

The Outline is the main authoring surface and the structural source of truth. Each item can contain analytical text and inline notes. Use hierarchy and sibling order deliberately: indentation expresses parent/child structure, while vertical order expresses sequence among siblings.

### Outline keyboard controls

When an Outline item is focused, `Enter` adds a sibling, `Tab` indents it, and `Shift+Tab` outdents it. `Alt+ArrowUp` and `Alt+ArrowDown` reorder among siblings. `Backspace` removes the focused item when you are not actively editing text. Standard text-editing undo remains available inside editable fields; Catalyst does not provide a global workspace undo stack.

Keep the Outline as simple as the problem permits. Catalyst intentionally does not require separate Evidence, Assessment, Thought, or free-spatial graph objects.

## Methods

Methods are optional and independent of the Outline. Use them when a structured analytic technique helps make reasoning more explicit.

Build an ordered Methods list in the sequence you intend to perform it. Select a method to focus its form, then edit its name, subtasks, and analysis fields. Catalog methods provide starting structures; a blank custom method is available when the needed technique is not in the catalog.

Reordering Methods changes execution order only. It does not restructure the Outline.

## Saving and loading

Catalyst maintains local automatic workspace state for continuity, but an explicit `.catalyst.xml` file is the portable session boundary. Use Save when you need a named session you can deliberately keep, move, or reopen. Use Load to restore one of those session files.

A session file does not embed the source PDF. Keep source documents available separately. Catalyst uses source identity information to avoid silently reconnecting a saved workspace to the wrong document.

Starting a new session unloads the current workspace; it does not delete a previously saved `.catalyst.xml` file.

## Recovery and safe working habits

For important work, make explicit named saves at meaningful checkpoints rather than relying only on automatic state. Keep the source PDF and session file together when moving work between machines.

If a source cannot be reconnected, verify that you selected the original matching PDF rather than a similarly named copy. If a session fails to load, preserve the file before attempting recovery; do not overwrite the only copy with a new blank session.

Catalyst is an analytical workspace, not the final publication surface. Move finished judgments into the document or briefing format appropriate to the task.

## What Catalyst deliberately does not do

Catalyst does not require a hosted backend, user account, or AI model for its core workflow. It does not treat a Map, Evidence register, formal Assessment, or global relationship graph as a second source of structural truth. Formal reports and briefings remain downstream products.

## Validation and troubleshooting for source users

If you are running Catalyst from source and something appears broken, first run:

```powershell
npm run check
```

The repository README contains installation and startup commands. Maintainers should use `docs/README.md` and `docs/CURRENT_ARCHITECTURE.md` for implementation details; this guide intentionally describes the supported user workflow rather than internal architecture.
