> **Historical mirror:** This file is preserved for design provenance. Current authority is under `docs/`; see `specs/README.md`.

# Catalyst Portrayal Standard v0.1

Status: **Normative visual contract for 0.6.3-alpha.3 design**  
Scope: **how Catalyst analytical meaning is made visible**  
Companions: `working-picture-model-v0.1.md`, `navigation-grammar-v0.1.md`, `representation-matrix-v0.1.md`  
Decision record: ADR 0018

## 1. Purpose

Catalyst's visual layer is an analytical portrayal system, not a decorative theme.

The standard defines a small number of visual channels and reserves them for stable meanings so that visual form does not accidentally imply unsupported analytical claims.

The standard is intelligence-derived in discipline: concise, hierarchical, traceable, reduction-safe, and explicit about the difference between source material, analyst construction, interaction state, and portrayal state.

## 2. Four visual layers

Every visible element belongs primarily to one layer:

### Instrument

Application controls: navigation, create, search, zoom, settings, projection/lens controls.

### Portrayal

Conditions describing how the analytical universe is currently shown: active Issue, picture, layer, time window, collapse/generalization, projection, working set.

### Notation

Stable analytical symbols and relationships representing source/evidence, propositions, questions, events, structural branches, trace marks, and future richer analytical semantics.

### Content

The actual material being analyzed: source imagery, excerpts, names, claims, observations, analyst-authored content.

Instrument controls must not resemble analytical notation. Notation must not resemble ordinary clickable chrome.

## 3. Visual hierarchy

Default priority from strongest to weakest:

1. current analytical focus / decisive visual material;
2. source-derived observation or major analytical landmark;
3. structural branch/territory;
4. concise identity labels;
5. contextual relationships and secondary objects;
6. portrayal marginalia;
7. instrument chrome.

The application should visually retreat behind the analysis.

## 4. Recognition-first representation

Use the most meaningful visual form available.

Priority:

```text
native visual material
→ representative visual preview
→ Catalyst notation
→ concise text label
→ body text on demand
```

Do not replace meaningful source imagery with a generic document card merely for visual consistency.

Do not create arbitrary decorative illustrations for abstract analytical concepts.

## 5. Shape and symbol budget

Catalyst should use a small, systematic analytical alphabet rather than dozens of unrelated icons.

Initial families may include:

- source / artifact;
- evidence / observation;
- real-world thing/entity;
- proposition/judgment;
- alternative/hypothesis;
- question/open inquiry;
- event/time;
- indicator/watch condition;
- structural Map/submap;
- trace;
- junction/convergence;
- divergence.

Not all are required in alpha.3.

The visual family should be compositional where practical: a few base geometries plus modifiers are preferred over one unique pictogram per noun.

## 6. Custom glyph requirement

The generic icon phase ends with alpha.2.

Before alpha.3 is accepted:

- the Catalyst application mark must be intentional and documented;
- the primary Working Picture glyphs must be custom-designed as one family;
- generic stock person/building/lightbulb/network icons must not define the analytical surface;
- instrument glyphs may remain simpler but must share a coherent stroke/grid standard;
- all core glyphs must remain identifiable at 16 px and in monochrome.

The application mark should be derived from the same geometry as the analytical language rather than designed as an unrelated logo.

## 7. Proposed geometric character

The visual family should use:

- deliberate straight/curved trace lines;
- consistent terminal shapes;
- one characteristic junction geometry;
- compact open endpoints for unresolved continuation;
- sparse indexing/marginal marks;
- limited corner radius;
- no default icon-inside-rounded-square treatment;
- no unnecessary glow.

The exact drawing grid remains to be designed after this standard is accepted.

## 8. Source/evidence portrayal

### 8.1 Evidence trace mark

Catalyst should maintain a compact source-reference mark that visually survives semantic zoom.

Conceptual behavior:

```text
DISTANT       17┐
WORKING       [source crop] 17┐
INSPECT       quotation + context + source/provenance
OPEN          original source location
```

The number/index is a reference mechanism, not a confidence score.

### 8.2 Source crop

At working scale, an evidence observation may preserve a cropped visual fragment of the actual source region.

The crop should:

- preserve enough original visual context for recognition;
- emphasize the selected region;
- avoid rendering entire unreadable miniature pages when a specific fragment matters;
- remain one action away from the original source location.

## 9. Structural branches

Structural branches are the primary visible connective tissue of ordinary Working Pictures.

They should:

- establish local hierarchy/grouping;
- be visually softer than explicit analytical relation overlays;
- form recognizable branch/territory geometry;
- avoid looking like database edges;
- support progressive tapering/simplification with scale;
- remain visually stable after unrelated edits.

Structural branches must not imply support, causality, confidence, or provenance.

## 10. Semantic relationships

Semantic relationships are analytically meaningful and therefore should be shown deliberately.

Default behavior:

- latent when not relevant;
- revealed on hover/trace or inspection;
- optionally persistent under relation-specific overlays;
- labeled only where the label is analytically necessary;
- aggregated when crossing collapsed boundaries.

Different relation types should not be encoded solely by color.

## 11. Interaction state

Selection and focus use neutral registration treatment.

### Hover / Trace

Transient cue that reveals local relationship context.

### Inspect

Persistent neutral outline/corner registration. No scale increase or glow that implies importance.

### Focus

Viewport/composition operation. May change local context but not analytical semantics.

### Warning / Review state

Future analytical state and intentionally higher salience. Must never reuse ordinary selection styling.

## 12. Color policy

Color is secondary reinforcement, not the sole carrier of analytical meaning.

Base palette goals:

- quiet neutral field;
- high legibility;
- restrained accent family;
- limited semantic category hues;
- analyst-created layer colors kept distinct from permanent analytical notation.

Avoid:

- rainbow ontology;
- confidence-by-saturation as a universal rule;
- red for generic uncertainty;
- neon/glow as normal emphasis;
- military friendly/hostile affiliation colors unless a future explicit domain adapter requires them and documents their semantics.

## 13. Typography policy

Typography must serve rapid scanning rather than dashboard decoration.

Rules:

- body text is not normal map chrome;
- major labels are short;
- labels can disappear at distant scale;
- metadata uses compact marginal styles;
- all-caps is reserved for very short categorical/marginal labels, not prose;
- source material retains its native typography when shown as a source crop;
- avoid repeating title/type/body information in adjacent layers.

## 14. Spatial meaning

Position may carry meaning only when one of the following is true:

- the analyst deliberately authored the position;
- the active structure grammar explicitly defines it;
- a projection explicitly maps data to position.

Automatic layout must not make unstated claims through centrality, proximity, vertical rank, or size.

## 15. Semantic zoom / generalization

Zoom changes portrayal, not merely scale.

Required levels:

### Overview

- composition/territories dominate;
- only major landmarks and a very small number of labels remain;
- source/evidence may reduce to trace marks or representative visuals;
- relationship detail suppressed.

### Working

- major identities visible;
- source crops/evidence landmarks usable;
- structural branches clear;
- compact analytical notation visible.

### Close

- additional analytical modifiers and selected source context appear;
- labels expand modestly;
- local relationship context is available.

### Inspect

- full text and metadata live outside or beside the picture in the inspector/source view;
- the Working Picture itself does not become a giant card layout.

Transitions should be progressive enough to preserve orientation.

## 16. Generalization vs filtering

Catalyst must distinguish these visually and semantically.

- **Generalization:** content still belongs to the current picture but is simplified/suppressed for scale.
- **Filtering/layering:** current portrayal intentionally excludes/de-emphasizes content based on a selected condition.

The UI must allow an analyst to understand why something is not currently visible.

## 17. Collapse boundary notation

When hidden descendants have semantic relationships that cross a collapsed boundary, the visible boundary must retain a continuation cue.

The cue may carry a count where useful.

Conceptual example:

```text
ACTORS  14
  └──── 3 → H2
```

The cue means hidden related structure exists. It does not summarize the semantics of the hidden items unless that aggregation is explicitly defined.

## 18. Marginalia

Portrayal state belongs in quiet margins, not inside analytical objects.

Possible marginal information:

- Issue/picture name;
- as-of or as-known time;
- active layer/overlay;
- active projection;
- picture/model counts;
- contextual key/legend;
- current path.

Only currently relevant conditions should appear.

## 19. Legend policy

Legends are contextual and local.

A legend should show only symbols/encodings actually present in the current portrayal.

It should normally be collapsed behind a compact key affordance and appear near the view it explains.

## 20. Forbidden visual implications

Catalyst must not visually imply any of the following unless the underlying semantics justify them:

- bigger = more important;
- center = more important;
- closer = more related;
- brighter = more true;
- saturated = more confident;
- transparent = weak evidence;
- selected = significant;
- many documents = independent corroboration;
- absent from view = absent from model;
- unsupported = disproved;
- source status problem = downstream claim false;
- unknown = negative.

## 21. Accessibility and reduction

Every core analytical distinction must survive:

- monochrome;
- high contrast;
- reduced motion;
- keyboard-only navigation;
- zoom reduction;
- screen-reader/non-spatial access through synchronized structure.

No critical distinction may depend only on hue, tiny texture changes, or hover.

## 22. Alpha.3 visual acceptance

Alpha.3 fails portrayal acceptance if:

- most visible objects are still text cards;
- generic icons are still the dominant identity system;
- the analyst must read type labels to distinguish primary object classes;
- semantic relationships form a constant hairball;
- the picture loses its identity when color is removed;
- selection visually resembles analytical importance;
- overview is just a tiny version of close view;
- source observations no longer look connected to their actual source material;
- application chrome is louder than analytical content.
