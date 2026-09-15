> **Historical mirror:** This file is preserved for design provenance. Current authority is under `docs/`; see `specs/README.md`.

# ADR 0018: Recognition-first heterogeneous portrayal and custom symbol standard

Status: **Accepted for 0.6.3-alpha.3 design**

## Context

Earlier Catalyst prototypes attempted to reduce UI text through graph geometry, compact cards, semantic zoom, and a small number of custom glyphs. Native review showed that the map still required serial reading and the visual identity remained generic.

Research across intelligence graphics, visual analytics, spatial sensemaking, picture/spatial-memory effects, zoomable interfaces, source citation, and analytical symbology indicates that visual recognition and stable spatial landmarks can support orientation, while indiscriminate imagery or large icon libraries can create a new form of clutter.

## Decision

Catalyst will use **recognition-first heterogeneous portrayal**:

1. native visual source material where it has analytical value;
2. representative landmarks/previews where useful;
3. a small custom Catalyst analytical symbol family for abstract concepts;
4. concise labels;
5. full prose only on demand.

Catalyst will establish a custom symbol standard rather than accumulate stock icons.

Structural branches and semantic relationships will use distinct geometries.

Selection, portrayal state, and analytical state will use separate visual channels.

## Consequences

- source excerpts can appear as actual cropped source fragments;
- whole-document thumbnails are used for recognition, not as universal evidence cards;
- abstract propositions/questions/analytical roles use custom notation rather than decorative illustrations;
- overview portrayal intentionally removes text/detail rather than only scaling it down;
- the Windows/app mark and analytical glyph family should be derived from one visual geometry system;
- generic icon libraries may still serve minor instrument controls temporarily, but may not define the analytical identity.

## Constraint

No visual distinction may imply analytical meaning that the current domain model cannot support.
