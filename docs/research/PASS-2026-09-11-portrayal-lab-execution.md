# Research pass — portrayal execution and intelligence visual-analytics evaluation

**Date:** 2026-09-11  
**Status:** synthesis pass; informs Portrayal Lab implementation before alpha.4

## Question

Catalyst now has a strong theory of portrayal, but alpha.3 showed that theory does not automatically produce a readable analytical interface. This pass asked a narrower execution question:

> How do mature intelligence, operational-symbology, cartographic, and visual-analytics systems turn semantic meaning into a visual language that can be rendered consistently and evaluated empirically?

## Main conclusion

Portrayal should be implemented as its own versioned architecture layer between the analytical model and React/SVG rendering. The Portrayal Lab should test that layer using representative intelligence-analysis tasks, not merely display a specimen sheet.

The executable chain is:

```text
Analytical object / source material
        ↓
Portrayal catalog + rule set
        ↓
Portrayal context
(scale, lens, local authored state, accessibility, interaction)
        ↓
Deterministic rule resolution
        ↓
Symbolizers / visual primitives
(point, line, area, crop, branch, trace, junction, label)
        ↓
Renderer
```

This architecture deliberately keeps semantic truth separate from its current visual representation.

## Finding 1 — portrayal is a system-to-human architecture boundary

The NGA/GWG Portrayal Focus Group explicitly calls portrayal the system-to-human interface for GEOINT and treats symbol design, display behavior, and consistent rendering as standardization concerns. OGC's Symbology Conceptual Core Model independently separates semantic data from Styles, Rules, Symbolizers, and rendering engines.

Catalyst implication:

- React components should not invent their own analytical SVG semantics.
- `src/portrayal/` should resolve a semantic object + portrayal context into visual primitives.
- the portrayal catalog should have its own version separate from the workspace/domain schema;
- changing a validated symbol family should normally not require migrating research data.

## Finding 2 — use explicit rule precedence rather than CSS emergence

OGC portrayal work models styling as ordered/cascading rules. This is important for Catalyst because the same object may be affected by semantic type, scale, overlay, local analyst-authored presentation, accessibility, selection, and a reasoned attention state.

Recommended resolution order for the Lab:

1. semantic base / native-media representation;
2. semantic-zoom level;
3. active analytical overlay/lens;
4. local authored portrayal override;
5. accessibility adaptation;
6. neutral interaction state;
7. rare reasoned attention state.

The resolver should be inspectable in development so a designer can answer **why did this object render this way?** rather than reverse-engineering CSS.

## Finding 3 — semantic zoom must be authored as representation levels

MIL-STD-2525 explicitly allows display hierarchy from rich composed symbols down to primitive dots when the operational situation does not require the detail. Map systems similarly use scale ranges to suppress fine-detail layers until the viewing scale can support them.

Catalyst implication:

- Overview, Working, Analytical, and Inspect should be separately authored portrayals;
- do not shrink one complex symbol indefinitely;
- line, area, label, and source-crop visibility may have different scale ranges;
- scale transitions should remove detail in a documented priority order.

## Finding 4 — hybrid recognition is better than abstract purity

Military symbicon experiments found faster search for a hybrid that combined recognizable pictorial qualities with coded symbolic information than for either tested symbol or icon system alone. Earlier tactical-symbol research also found that extra features can interfere with processing of a core symbol.

Catalyst implication:

- concrete/familiar core for familiar referents;
- learned analytical modifier for abstract roles;
- abstract geometry for relations/operations;
- strict modifier budget at normal Working scale;
- new modifiers must justify the perceptual interference they introduce.

## Finding 5 — evaluate search under density, not only isolated comprehension

Tactical-display research has tested visual search with different information densities, overlaps, and set sizes. One MIL-STD glyph study explicitly used set sizes of 6, 12, and 18. Icon-search research finds that complexity and poor grouping slow search.

Therefore the Portrayal Lab should include canonical density scenes rather than only one-symbol tests.

Recommended first benchmark matrix:

| Scene | Purpose | Objects | Extra challenge |
| --- | --- | ---: | --- |
| P1 | sparse category recognition | 6 | monochrome |
| P2 | moderate search | 12 | mixed categories |
| P3 | dense search | 18 | mixed categories |
| P4 | modifier discrimination | 12 | one/two modifiers |
| P5 | overlap/clutter | 12 | partial overlap / competing lines |
| P6 | mixed-media Working Picture | 8–14 | source crop + image + symbols + branches |
| P7 | semantic-zoom continuity | same scene | four portrayal levels |
| P8 | return/memory | same scene after interruption | spatial re-find |

## Finding 6 — test the analytical process, not only the icon

PNNL evaluation work argues that visual-analytics systems need evaluation beyond basic usability: utility, situation awareness, interaction, reasoning/creativity, collaboration, and fit to the analyst's workflow matter. Its VAST methodology emphasizes representative datasets, tasks, metrics, and users/surrogates. Jigsaw evaluations likewise found that seemingly small reliability/usability problems damaged analyst trust.

Portrayal Lab acceptance therefore needs two layers:

### Symbol-level measures

- unlabeled comprehension;
- perceptual-component identification;
- family discrimination;
- target-search accuracy;
- response time / search slope where practical;
- confusion matrix;
- small-size survival;
- monochrome/light/dark robustness.

### Working-Picture task measures

- find the source-backed observation;
- locate the unresolved inquiry;
- distinguish selected from analytically emphasized;
- determine which source a claim traces to;
- identify which objects are currently suppressed by portrayal;
- re-find a landmark after leaving and returning;
- compare two alternatives without reading every object;
- complete the task without excessive mode/tool switching.

The last point operationalizes PNNL's "interaction junk" concern: interaction should let the analyst act on the problem rather than translate the problem into UI parameter manipulation.

## Finding 7 — one graph view is not enough, even when graph analysis is useful

PNNL's Graph Signatures work explicitly reports limitations of graph-only visualization and benefits from linked alternative views. Jigsaw analysts used different combinations of document, graph, list, cluster, timeline, and text views rather than converging on one universal representation. Army doctrine similarly defines the Common Intelligence Picture as a display **or combination of displays/products** that supports common understanding.

Catalyst implication:

- Working Picture should remain the home surface, but not become a universal diagram;
- timeline, source, comparison, and other projections can be coordinated without being stuffed into the same visual plane;
- alpha.4 should prove one Working-Picture composition and one coordinated supporting view rather than attempting to make every analytic question spatial.

## Finding 8 — dynamic collections require portrayal stability

PNNL work on evolving document windows notes that professional analysts often follow issues over time as documents arrive and age out. The Working Picture therefore must not behave like a one-time static diagram.

Catalyst implication:

- newly arriving material should enter as a clear new observation without reorganizing unrelated landmarks;
- scale/layer rules must be deterministic;
- the analyst should be able to preserve a working subset while the underlying model changes;
- portrayal history may eventually need to record meaningful changes in what was visible, not only domain changes.

## Executable Portrayal Lab architecture

Recommended initial modules:

```text
src/portrayal/
  catalog/
    types.ts
    catalog.ts
    rules.ts
  context/
    portrayalContext.ts
  resolver/
    resolvePortrayal.ts
    explainPortrayal.ts
  primitives/
    landmark.tsx
    line.tsx
    area.tsx
    sourceCrop.tsx
    label.tsx
    junction.tsx
  symbols/
    cores/
    modifiers/
  semanticZoom/
  salience/
  legend/
  testing/
    scenarios.ts
    results.ts
    confusion.ts
```

The Lab itself should use these same modules. It should not maintain separate experimental SVGs that later need to be reimplemented in production.

## Proposed catalog concepts

A catalog entry should be declarative enough to inspect and test. Conceptually:

```text
PortrayalCatalog
  id
  version
  primitives
  coreSymbols
  modifiers
  rules
  scaleLevels
  salienceClasses
  legendEntries
  testStatus

PortrayalContext
  scaleLevel
  activeLens
  localPortrayal
  theme
  accessibility
  interactionState
  attentionReason?
```

The exact TypeScript shape is intentionally not frozen by this research pass.

## Proposed test-result record

Retain enough information to compare candidate iterations:

```text
scenarioId
candidateId
catalogVersion
scale
theme
density
targetReferent
expectedResponse
actualResponse
correct
responseTimeMs?
confusionTarget?
notes?
```

## New design law

> A Catalyst portrayal component is not accepted because it is visually coherent. It is accepted when it preserves the intended analytical distinction under realistic search, clutter, scale, and task conditions.

## Sources that materially changed this pass

- NGA/GWG Portrayal Focus Group — https://gwg.nga.mil/gwg/focus-groups/Portrayal_Focus_Group_%28PFG%29.html
- OGC Symbology Conceptual Core Model — https://www.ogc.org/standards/symbology-conceptual-core-model/
- OGC SymCore standard — https://docs.ogc.org/is/18-067r3/18-067r3.html
- OGC semantic portrayal / Testbed-13 — https://docs.ogc.org/per/17-045.html
- OGC Testbed-14 Symbology report — https://docs.ogc.org/per/18-029.html
- MIL-STD-2525D — https://www.jcs.mil/Portals/36/Documents/Doctrine/Other_Pubs/ms_2525d.pdf
- Smallman et al., Symbicons — https://journals.sagepub.com/doi/10.1177/154193120104500224
- Samet et al., graphic symbol-design features — https://pubmed.ncbi.nlm.nih.gov/6180374/
- Siva et al., MIL-STD glyph visual search — https://journals.sagepub.com/doi/10.1177/1541931214581248
- McDougall et al., visual search for signs/symbols/icons — https://pubmed.ncbi.nlm.nih.gov/16802893/
- PNNL, Graph Signatures for Visual Analytics — https://www.pnnl.gov/publications/graph-signatures-visual-analytics
- PNNL, Developing Guidelines for Assessing Visual Analytics Environments — https://www.pnnl.gov/publications/developing-guidelines-assessing-visual-analytics-environments
- PNNL, Evaluation of Visual Analytics Environments — https://www.pnnl.gov/publications/evaluation-visual-analytics-environments-road-visual-analytics-science-and-technology
- PNNL, Interaction Junk — https://www.pnnl.gov/publications/interaction-junk-user-interaction-based-evaluation-visual-analytic-systems
- Georgia Tech, Visual Analytics Support for Intelligence Analysis — https://faculty.cc.gatech.edu/~stasko/papers/computer13-intell.pdf
- U.S. Army FM 2-0 common intelligence picture — https://rdl.train.army.mil/catalog-ws/view/100.ATSC/B6B654D9-7553-4B08-9DD6-0891F8F04039-1360339759307/fm2_0.pdf
- CIA intelligence workstation requirements — https://www.cia.gov/readingroom/document/cia-rdp88g01116r001102090015-3
- CIA intelligence research facilities / maps and graphs — https://www.cia.gov/readingroom/document/cia-rdp80b01139a000500190003-6
- CIA/NPIC Publications Guide — https://www.cia.gov/readingroom/document/cia-rdp78t04759a008500010069-9
