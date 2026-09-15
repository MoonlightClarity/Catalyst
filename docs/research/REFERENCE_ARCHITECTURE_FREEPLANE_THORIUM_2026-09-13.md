# Catalyst reference architecture — Freeplane + Thorium — 2026-09-13

Status: active implementation baseline. This does not make either comparator Catalyst's ontology.

## Core decision

Use two mature FOSS applications as the default interaction scaffolds instead of continuing to invent basic UI structure independently:

- **Analysis / Working Picture:** Freeplane is the primary structural and interaction baseline.
- **Reader / annotations:** Thorium Reader is the primary reader and annotation baseline.
- **Catalyst-only layers:** provenance, analytical roles, explicit semantic relations, evidence promotion, and genuinely parentless free placement.

The working rule is **copy the mature product grammar unless Catalyst has a documented architectural reason to diverge**. Reimplementation should use Catalyst-native code and original visual assets; comparator code/assets are not copied mechanically.## Freeplane baseline for the analytical surface

Borrow nearly 1:1 at the interaction/command level:
- rooted branch organization with deterministic sibling order;
- add child / add sibling, delete, fold / unfold;
- Move earlier / Move later and Promote / Demote as explicit structural commands;
- branch-side organization and deterministic local reflow;
- keyboard-accessible structural navigation and commands;
- focus/hoist, back/home, fit, pan/zoom, local organize/reset;
- selection-local structural actions rather than permanent toolbar growth;
- quiet generated structural connectors.

Catalyst must deliberately diverge where prior research established stronger boundaries:
- a free occurrence has no hidden parent or sibling rank;
- ordinary drag edits placement only;
- structural relationships and semantic relationships are distinct records/renderers;
- attaching/reparenting/reordering does not erase manual coordinates;
- Organize branch is the explicit portrayal reset;
- note identity, source provenance, analytical semantics, and occurrence portrayal remain separate.## Thorium baseline for Reader + annotations

Borrow the architecture and interaction decomposition nearly 1:1:
- canonical annotation record independent from rendered overlay;
- format-specific navigation target derived from the annotation;
- reader annotation list with stable cards and exact return-to-source;
- inline annotation editor with selection preview, appearance/style, comment, tags, save/cancel;
- sort by source progression / created / modified;
- filter by tags and other useful annotation properties;
- reader-side create flow separated from persistence and panel presentation;
- PDF geometry/navigation helpers separated from generic annotation UI;
- docked/panel reader controls rather than forcing annotation management into the document canvas.

Catalyst additions remain separate layers:
- exact source-region identity remains canonical;
- an annotation may be promoted/linked to analytical evidence or a note, but promotion does not change source identity;
- provenance and evidence roles are not encoded as highlight colors;
- native viewer markup persistence remains distinct from Catalyst evidence annotations;
- Working Picture linkage is an analytical operation, not reader annotation ontology.## Immediate implementation sequence

1. Freeze this reference architecture before further shell invention.
2. Build an original Catalyst SVG action vocabulary covering the Freeplane-like map grammar and Thorium-like reader grammar.
3. Refactor reader annotation presentation around list/card/editor/navigation-target boundaries while retaining existing Catalyst annotation/source IDs.
4. Fill map interaction gaps against the Freeplane command checklist rather than adding novel controls.
5. Validate both surfaces visually at normal working scale before adding deeper analytical complexity.

## SVG batch rule

Do not import Freeplane's GPL artwork into Catalyst. Do not create a collage of Thorium assets. Use original Catalyst geometry on a shared grid/stroke system while matching the *semantic vocabulary* of the mature comparators.

The first batch should cover: child, sibling, delete, promote, demote, earlier, later, fold, unfold, organize, auto-layout return, branch side left/right, focus, back, home, fit, free placement, semantic relation, source link/open-source; annotation, annotations list, highlight, underline, strike, outline, comment, tag, sort, filter, previous/next, first/last, import/export, bookmark, copy, attach, search, zoom in/out, reader settings.