# Zotero 10 hands-on cognitive-architecture pass — 2026-09-11

## Scope

Tested the existing supervised Zotero process on Catalyst `:99` using the local `Tradecraft-Primer-apr09.pdf`. The goal was not feature inventory; it was to test source identity, annotation, note formation, and return-to-source continuity.

## What was exercised

- Imported the local PDF with **Add File**.
- Zotero recognized it as a structured source item and attached the PDF beneath that item.
- Opened the built-in 45-page PDF reader.
- Verified PDF text search and rendering after an initially blank/delayed canvas.
- Created a page-note annotation with comment: `Catalyst provenance test: return to source`.
- Created three actual highlight annotations across the title text.
- Used **Add Note from Annotations** on the parent source item.
- Opened an embedded annotation inside the generated child note.
- Activated **Go to Page** and returned to the exact highlighted source passage on page `i`.

## Reliability observation

The live process logs contain EGL/Zink warnings, but they did not prevent the provenance workflow. The first PDF canvas was blank until text search forced a refresh; after that, rendering, search, annotations, note generation, and source return all worked.
## Architectural lessons for Catalyst

1. **Source identity should survive extraction.** Zotero does not collapse an imported document into loose notes; the source remains a stable object with attachments beneath it.
2. **Evidence linkage should be explicit and reversible.** An annotation embedded in a note exposes both **Go to Page** and **Unlink**. Traceability is therefore visible state, not hidden metadata.
3. **Derived analytical text can remain lightweight.** A note can contain excerpts/citations without forcing the source document itself into the note hierarchy.
4. **Return-to-context is more important than citation text alone.** The strongest interaction was the one-step jump from an analytical note back to the exact highlighted passage.
5. **Annotation storage can be separate from the source file.** Zotero stores its own annotations in its database, enabling a source file to remain conceptually distinct from the analytical overlay.
6. **Do not copy Zotero's library/editor split wholesale.** Its provenance model is strong, but the library/tree + reader arrangement is not itself the cognitive surface Catalyst needs.

## Consequence for the Working Picture

Catalyst should treat a source excerpt/evidence object as a first-class reference with at least three separable properties: source identity, exact source location, and analytical placement. Converting or copying evidence into prose should not silently destroy that reference. If the user intentionally detaches it, that should be an explicit operation analogous to Zotero's **Unlink**.

This strengthens the emerging model from the Freeplane pass: **placement, structural membership, semantic relationship, and provenance are different commitments and should not be collapsed into one edge or one hierarchy.**

## Status

Hands-on Zotero pass complete enough to inform architecture. No Working Picture implementation was started.