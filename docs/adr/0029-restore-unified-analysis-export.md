# ADR 0029 - Restore unified Outline + Methods export

Status: Accepted - 2026-09-17

## Context

ADR 0028 removed Catalyst's fragmented derived-output paths because separate Reader, Outline, Map, and Methods exporters added substantial surface area without strengthening the core analytical workflow.

That decision also removed a high-value handoff path: turning the analyst's completed Outline and authored Methods work into a portable document for review, editing, or downstream use. Restoring multiple independent exporters would recreate the earlier maintenance problem, but a single whole-analysis export has a materially different cost/benefit profile.

## Decision

Catalyst restores one derived-output feature: a single **Export** control that exports the complete authored **Outline + Methods** document.

The Export control offers exactly three formats:

- PDF
- DOCX
- RTF

All three formats are generated from the same normalized export model. The export presents the complete Outline first, preserving item ordering, hierarchy, titles, and note bodies, followed by the complete authored Methods sequence. Methods export includes method names, step names, and analyst-entered responses; catalog summaries and instructional prompts are intentionally excluded. Collapsed UI state does not omit content.

This is deliberately not a return to broad export architecture. Catalyst does not restore per-section export, annotated-PDF export, Map/image export, Outline-only export, Methods-only export, interchange/import semantics, or a report/publication-template system.

Explicit **Save** and **Load** remain Catalyst XML persistence operations. **Export** is a separate downstream-document operation and does not replace `.catalyst.xml` as the durable workspace format.

ADR 0029 supersedes ADR 0028 only for this narrowly defined unified Outline + Methods document export. All other output-scope reductions in ADR 0028 remain in force.

## Consequences

Catalyst regains a direct handoff from analytical work to common document formats without adding multiple export surfaces or output-specific authoring modes.

PDF, DOCX, and RTF share one content projection, reducing format drift. Document-generation dependencies are loaded on demand when Export is used rather than defining the core workspace data model.

The exported files are downstream representations of Catalyst state, not round-trip workspace files. Reopening, preserving, or transferring editable Catalyst state continues to use `.catalyst.xml`.
