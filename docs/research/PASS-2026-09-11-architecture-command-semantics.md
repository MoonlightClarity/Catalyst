# Architecture resolution — edit, reuse, fork, copy/paste, and provenance — 2026-09-11

Status: architecture research only. No GUI manipulation and no product code.

## Why this matters

The state-separation model can still collapse if familiar editor commands are semantically ambiguous.

In particular, editing through an occurrence, copy/paste, duplicate, and drag-between-context operations need to distinguish shared identity from local portrayal and new identity creation.

## Edit through an occurrence

An occurrence is a located portrayal of a durable identity. Therefore editing truth-bearing/content state through one occurrence normally edits the underlying identity and is visible through other occurrences of that same identity.

Examples: canonical title/name, analyst-authored note body, proposition text, source metadata corrections where appropriate.

Local portrayal edits remain occurrence-scoped: position, size, crop/preview choice, local label visibility, local fold/detail state, local emphasis, connector route.

If Catalyst later supports a context-specific alias/comment, it must be a separately named local field or annotation rather than a silent override of identity content.

## Reuse versus fork

`Reuse` means create another occurrence of the same identity. It does not create a new analytical object.

`Fork` / `Duplicate as new object` means create a new identity intentionally derived/copied from the original so the two may diverge.A fork should retain lineage to the source identity when that history matters for audit, especially for source-derived or analytical content. It must not be counted as independent evidence merely because it now has a new identity.

The user-facing distinction may be expressed through commands such as `Reuse here` versus `Duplicate/Fork`, but exact labels remain a prototype question.

## Copy/paste contract

Generic clipboard behavior must not decide analytical identity semantics invisibly.

Safe default principle:
- copying/pasting **within Catalyst analytical contexts** should preserve enough information to offer/perform reuse when the intent is another occurrence of the same object;
- an explicit duplicate/fork action creates a new identity;
- copying only rendered text/image content out to an external context is an export operation, not identity transfer;
- importing pasted external content creates a new identity/source capture as appropriate because no existing Catalyst identity is established.

If platform conventions make one default necessary, the resulting identity behavior must be inspectable and reversible rather than hidden.

## Drag between pictures/subpictures

Dragging an object into another analytical context should be defined as either `move occurrence` or `reuse identity`, not as implicit identity migration.

A move removes one occurrence from the origin and creates/relocates an occurrence in the target. A reuse leaves the origin occurrence intact and creates another target occurrence.

Neither operation changes semantic relations or provenance.## Manual edits after a reproducible transformation

Scenario: a transformation/method run produces Output O, then the analyst manually revises O.

The revised state must not continue to masquerade as the pristine reproducible output of the earlier execution.

Two acceptable conceptual patterns are:
- preserve Output O and record a later analyst-authorship/revision event on that identity; or
- fork a new revised identity from O when preserving the exact method output matters.

Which pattern is used can depend on artifact type and audit requirements, but the provenance record must reveal that the current content is no longer merely the untouched transformation result.

This follows the OpenRefine distinction among reusable operation, execution, change/history, and current project state.

## Undo versus analytical history

Undo/redo may reverse interface mutations for usability. It is not the authoritative audit ledger.

If an identity/relation/transformation has become analytically relied upon, published, or otherwise requires durable provenance, its relevant history must survive independently of the transient editor undo stack.

The implementation can decide later when history becomes durable; the architecture must not make durable provenance impossible by design.

## Result

The command grammar now has four distinct identity behaviors: `edit shared identity`, `reuse same identity`, `move occurrence`, and `fork/create new identity`.

These should be testable separately because confusing them would reintroduce hidden copying or hidden global mutation through ordinary canvas interactions.