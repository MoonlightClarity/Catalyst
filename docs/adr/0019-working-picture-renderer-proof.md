# ADR 0019 — Working Picture renderer proof slice

Status: **Historical accepted 0.6.3-alpha.3 proof; superseded as the active surface by ADR 0021, ADR 0023, and ../CURRENT_ARCHITECTURE.md**

## Context

Native review of 0.6.3-alpha.2 established that a branch-oriented Map was still a text-first diagram editor. The problem was not a rendering bug. Navigation required too much viewport piloting and recognition depended on reading labels/cards.

The Working Picture research and ADRs 0017–0018 therefore require a recognition-first primary surface while retaining the graph-like analytical model and Map occurrence state underneath.

## Decision

0.6.3-alpha.3 replaces the mounted `AnalysisMapWorkspace` with `WorkingPictureWorkspace`.

The proof slice implements:

- Issue/focus framing rather than a generic Map label;
- source / assessed / open portrayal territories;
- heterogeneous object portrayal rather than one universal card;
- clipped source-fragment landmarks for evidence already attached to notes;
- a small custom Catalyst analytical glyph alphabet for abstract objects;
- visible structural branches and latent semantic relationships;
- single-click inspection distinct from deliberate refocus;
- Working Picture Home and local focus Back navigation;
- semantic zoom that removes labels/content rather than merely shrinking cards;
- inspector overlay without relayout of the analytical geography;
- compact Reader-to-Analysis capture dock in place of the previous text-heavy selection panel.

The existing `mapView` state remains the compatibility persistence substrate. `src/picture/layout.ts` derives the current portrayal from that state plus existing semantics/evidence. No SQLite migration is introduced.

## Non-decisions

This release does not claim to implement:

- rasterized PDF evidence crops as durable evidence objects;
- first-class Issue, Observation, Inference, Assessment, Perspective, Indicator, weak-signal, or Warning records;
- full nested Working Pictures / Map portal editing;
- automated significance, corroboration, truth, or confidence scoring.

Where the current domain cannot support a visual claim, the renderer stays quiet rather than fabricating semantics.

## Consequences

Alpha.2's Map renderer is removed from the canonical source tree and by the updater. The Mapping Model remains relevant as a lower-level portrayal/persistence model, but it is no longer the primary UX metaphor.

Native acceptance must test recognition and navigation rather than styling alone. A successful build is insufficient if the analyst still has to read a field of text cards or manually pan/zoom to find routine work.
