> **Historical mirror:** This file is preserved for design provenance. Current authority is under `docs/`; see `specs/README.md`.

# Catalyst Representation Matrix v0.1

Status: **Design matrix for 0.6.3-alpha.3; not all rows are currently implemented domain types**  
Scope: **what information should look like at different semantic scales**

## 1. Rule

The same object must not simply shrink and grow. Its portrayal changes according to scale and analytical role.

The matrix below separates **currently implementable** representations from **reserved future** ones. Alpha.3 must not fake semantics that the current 0.6.x model does not yet persist.

## 2. Scale levels

- **Overview:** composition and landmarks only.
- **Working:** normal analytical manipulation.
- **Close:** local detail and modifiers.
- **Inspect:** full detail in inspector/source surface, not expanded card clutter.

## 3. Current / near-term objects

| Kind | Overview | Working | Close | Inspect |
| --- | --- | --- | --- | --- |
| Issue / focal question | dominant focal mark + very short title | focal object/heading | title + concise context | full question/purpose/history |
| Note / generic thought | small structural mark; label only if landmark | compact text label, no body | short preview if needed | full editable text |
| Evidence excerpt | trace index or representative crop | source-region crop + trace mark | larger crop + source/page context | full quotation, tags, source, provenance available today |
| PDF / document | representative page/cover landmark | page/cover thumbnail + short identity | source context | document metadata/open action |
| Image source | representative image | image/crop | larger crop + annotation | full source/image metadata |
| Entity-like note | type silhouette/mark if useful | Catalyst type mark + name | name + key local relation state | full content and semantics |
| Event-like note | event/time mark | event mark + short label/date | local time details | full event content |
| Claim-like note | proposition mark | proposition mark + short claim label | local analytical modifiers supported by current model | full claim content/role/confidence if present |
| Assumption-like note | normally suppressed unless landmark/overlay | assumption modifier + short label | supported current confidence/role data | full assumption content |
| Hypothesis-like note | alternative/hypothesis mark | hypothesis mark + label | local supported current analytical metadata | full content |
| Question/Gap note | open endpoint / question mark family | open inquiry mark + short question | local context | full question/gap content |
| Structural branch | simplified territory/branch | primary visible connective structure | branch labels if any | branch/edit controls |
| Semantic relationship | usually hidden | reveal on trace/inspect or overlay | label/type where useful | full relationship metadata |
| Evidence tag/layer | territory hint/count where active | compact layer treatment | tag membership | edit/manage tags |
| Submap/linked picture | structural silhouette + count | structural preview / portal | preview + title/context | open/map metadata |

## 4. Future reserved analytical objects

These rows define portrayal direction only. Do not implement as fake UI until the domain model exists.

| Future kind | Overview | Working | Close | Inspect |
| --- | --- | --- | --- | --- |
| Inference | junction only where structurally decisive | convergence junction connecting grounds/conclusion | warrant/basis modifiers | full reasoning record |
| Assessment | aggregate perspective indicator only when requested | attributed assessment mark under assessment lens | likelihood/confidence/basis | full assessor, scheme, time, rationale |
| Perspective | normally invisible | perspective overlay/fork when comparing | attribution labels | full perspective metadata |
| Indicator / Watch condition | watch landmark/count | expected-observable mark | status/trajectory | full condition, target, history |
| Weak signal assessment | cluster/novelty cue only under Scan lens | attributed signal mark | corroboration/trajectory/context | full interpretation history |
| Warning assessment | high-salience only if explicitly active/current | warning/review marker | lead time/basis | full assessment and supersession history |
| Provenance origin family | aggregated braid/root under provenance lens | source-lineage grouping | derivation types | full lineage |
| Revision/history event | change ticks only under history lens | lineage revision mark | before/after summary | full semantic event |
| Open collection requirement | frontier/probe endpoint | probe mark | why-it-matters/needed information | full inquiry chain |

## 5. Text budget by scale

### Overview

Target: almost no prose.

- major Issue label;
- a handful of landmark labels;
- counts where necessary;
- no body previews.

### Working

Target: identity, not explanation.

- object name or one-line proposition;
- optional short date/trace index;
- no tutorial text;
- no multi-paragraph body content.

### Close

Target: enough context to decide whether to inspect.

- short source excerpt/crop context;
- concise modifiers;
- relation labels only when relevant.

### Inspect

Full content belongs here.

## 6. Image budget

Images are used when they function as analytical memory landmarks or actual evidence.

Prefer:

- exact source crops;
- maps/imagery/charts supplied by source material;
- representative document visuals;
- analyst-supplied meaningful entity imagery.

Avoid:

- decorative stock images;
- generated filler imagery;
- pictorial metaphors for abstract claims;
- repetitive low-information thumbnails that become visual noise.

## 7. Relationship visibility matrix

| State | Structural branches | Semantic relationships | Provenance | Method-specific links |
| --- | --- | --- | --- | --- |
| Base picture | visible | mostly latent | trace marks only | hidden |
| Hover/Trace | visible | local neighborhood | local source trace | local if relevant |
| Inspect | visible | target relationships | source details | relevant target links |
| Relationship overlay | visible but quiet | selected types persistent | optional | optional |
| Provenance overlay | quiet | quiet | prominent lineage | hidden unless needed |
| Method projection | method-defined | method-relevant | available | prominent |

## 8. Current alpha.3 proof slice

To validate the representation model without pretending future ontology exists, alpha.3 should implement at least:

1. focal Issue/question landmark;
2. generic thought portrayal with body text removed from working scale;
3. evidence source crop + trace index;
4. document/page thumbnail representation;
5. at least one entity/event/proposition-like custom Catalyst glyph family derived from current roles;
6. structural branch geometry distinct from semantic relation geometry;
7. semantic relationships latent by default;
8. subordinate-map/territory preview or a minimal architectural placeholder backed by real map view state;
9. overview/working/close portrayal changes that are visually obvious;
10. inspector as the exclusive home of full body text.
