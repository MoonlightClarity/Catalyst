# Research pass — portrayal architecture and execution

**Date:** 2026-09-11  
**Scope:** How mature intelligence/geospatial and graphical-symbol systems turn portrayal theory into an executable, testable rendering architecture.

## Why this pass was needed

The preceding passes established *what* Catalyst should communicate: recognition-first Working Pictures, hybrid analytical symbols, scale-aware portrayal, source traces, stable semantics, and intelligence-grade control of visual implication.

The missing question was operational:

> How do mature standards communities separate analytical data from portrayal rules, govern symbol catalogs, resolve scale/context, and test the resulting human-readable layer?

This pass focused on NGA/GWG portrayal standardization, OGC symbology/portrayal architecture, MIL-STD-2525 display hierarchy and modifier placement, ISO 9186 symbol testing, NPIC symbol standardization, and human-factors work on visual search.

## 1. Portrayal is an architecture boundary

The NGA/GWG Portrayal Focus Group explicitly describes portrayal as the **system-to-human interface** for GEOINT and separates it from the standards work that governs data structure, semantics, metadata, and exchange.

Catalyst should adopt the same boundary:

```text
ANALYTICAL MODEL
objects / evidence / relationships / assessments / history
        │
        ▼
PORTRAYAL RULES
what is shown, at which scale/lens/state, and with which symbolizer
        │
        ▼
RENDERING ENGINE
SVG / DOM / canvas / export
```

The analytical model must not store resolved SVG geometry as semantic truth. Portrayal can evolve without research-data migration.

## 2. Treat portrayal rules as data, not scattered component logic

OGC's Symbology Conceptual Core Model separates **Style**, **Symbolizer**, and **Rendering Engine**. It is modular and encoding-agnostic: one conceptual style model can be rendered through different concrete encodings.

OGC portrayal research further separates style, symbol, symbolizer, and graphic descriptions, and adds contextual rule conditions such as scale ranges.

For Catalyst this suggests a dedicated portrayal catalog rather than component-local icon decisions:

```text
PortrayalCatalog
  ├─ symbol definitions
  ├─ line / branch / trace definitions
  ├─ area / territory definitions
  ├─ rule conditions
  ├─ semantic-zoom ranges
  ├─ salience rules
  └─ legend metadata

PortrayalContext
  ├─ Working Picture scale
  ├─ active overlay/lens
  ├─ interaction state
  ├─ accessibility mode
  └─ user-authored local presentation overrides
```

The renderer asks the catalog how to portray a semantic object in a specific context.

## 3. Use rule precedence rather than ad-hoc CSS overrides

The OGC portrayal work notes limitations in older style systems when styles cannot be cleanly overridden/cascaded. Catalyst will need explicit precedence because the same object can be affected by several independent conditions.

Proposed precedence, from semantic base toward temporary UI state:

1. core semantic portrayal;
2. scale/level-of-detail portrayal;
3. active analytical overlay/lens;
4. authored local Map/Working-Picture presentation;
5. accessibility adaptation;
6. neutral interaction state such as hover/inspect;
7. rare attention state with an explicit analytical reason.

Interaction state must never overwrite analytical semantics. Accessibility can alter presentation but not meaning.

## 4. Symbol composition needs reserved zones and a modifier budget

MIL-STD-2525 uses fixed sectors for core icons and modifiers and prohibits multiple modifiers in the same sector when legibility would suffer. It also preserves modifier positions whether a symbol is framed or unframed.

Catalyst should adopt the principle, not the military symbols:

- core identity occupies a stable visual center;
- analytical modifiers occupy reserved locations;
- state amplifiers occupy stable external locations;
- modifier position does not drift when other modifiers appear;
- the normal Working Picture has a strict modifier budget.

Human-factors research reinforces the need for restraint: additional encoded features can slow processing of the core symbol, and visually complex or poorly grouped icons slow search.

Working rule for the Portrayal Lab:

> No core landmark should require more than two simultaneous visible modifiers at ordinary Working scale. Additional state moves to a contextual overlay, trace, legend, or inspector.

This is a design constraint to test, not a permanent numeric law until measured.

## 5. Semantic zoom should be an explicit display hierarchy

MIL-STD-2525 provides a display hierarchy ranging from full symbols with frame/fill/icon/modifiers down to simple frames or dots for clutter reduction and operational need.

Catalyst should implement semantic zoom as a comparable **portrayal hierarchy**, not as continuous geometric scaling:

```text
Overview      class / territory / topology / representative landmark
Working       recognizable core + short identity + source visual where useful
Analytical    relevant modifiers + requested semantic relations
Inspection    full content, provenance, assessments, history
```

Each level may use a separately authored representation.

## 6. Scale and layout are part of symbol design

The 1967 NPIC symbol glossary states that symbol size and shape should be determined by scale and layout and explicitly does not attempt to depict every possible symbol.

This supports two governance rules:

1. Do not assume one SVG scales correctly to every context.
2. Do not attempt to pre-design the entire future ontology before the product has demonstrated a need for each symbol.

The symbol standard should grow through controlled additions with stable IDs and documented meanings.

## 7. The Portrayal Lab needs measurable outputs

ISO 9186 separates:

- **comprehensibility** — does the symbol communicate the intended meaning?;
- **perceptual quality** — can people correctly identify its constituent elements?;
- **referent association** — can domain-familiar users correctly associate it with the intended referent?;

The Lab should therefore store test results, not just screenshots and opinions.

Minimum useful result structure:

```text
candidate id
symbol version
size / theme / context
prompt / referent
response
correct / confused-with
completion time where practical
notes
```

A simple confusion matrix across closely related symbols will be more valuable than aesthetic preference alone.

## 8. Maintain a canonical test corpus

Portrayal evaluation should use stable Working-Picture scenes so visual changes can be compared across iterations.

The corpus should include at least:

- a source-heavy picture;
- an actor/event picture;
- an alternatives picture;
- a provenance/trace picture;
- a dense picture that requires semantic reduction;
- a monochrome/accessibility picture;
- a mixed native-visual + symbolic picture.

The runtime screenshots that caused previous pivots should remain historical regression references but not serve as the only test material.

## 9. Portrayal catalogs should be versioned independently

A symbol can evolve without changing what the underlying analytical object means.

Catalyst should therefore distinguish:

```text
Domain version
Portrayal-standard version
Symbol-catalog version
Application version
```

Saved analytical data should normally store semantic identity and authored presentation intent, not a frozen resolved glyph. A future renderer can then apply a newer validated catalog without migrating the analytical record.

Where historical reproduction matters, a Working Picture/export may record which portrayal-standard version produced it.

## 10. Core analytical notation is not user-themeable semantics

A theme may change surface colors, contrast, typography, or non-semantic instrument styling.

It must not silently change the meaning of the analytical notation. Analyst-created tags/layers may have flexible user styling because they are workspace metadata; core Catalyst analytical symbols have documented stable semantics.

## 11. Engineering consequence

The next implementation should establish an explicit portrayal boundary before alpha.4 integration:

```text
src/portrayal/
  catalog/
  context/
  rules/
  primitives/
  symbols/
  symbolizers/
  semanticZoom/
  salience/
  legend/
  lab/
```

Exact filenames can change, but the separation is architectural.

Components should not invent analytical SVGs or semantic colors locally.

## 12. New design laws from this pass

1. **Data semantics and portrayal rules are separate versioned systems.**
2. **Portrayal resolution is deterministic for a given semantic object + portrayal context + catalog version.**
3. **Modifier placement is stable; modifier count is deliberately bounded at ordinary scale.**
4. **Semantic zoom selects authored representations rather than simply shrinking detail.**
5. **Portrayal rules have an explicit precedence order.**
6. **Every accepted symbol has a stable identifier, referent, construction definition, allowed contexts, and test record.**
7. **Core analytical notation cannot be redefined by visual themes.**
8. **The Portrayal Lab maintains a fixed test corpus and records confusion, not just preference.**
9. **New symbols are added by a controlled proposal/test process rather than opportunistically in feature components.**
10. **Research and portrayal standards are first-class source artifacts and travel with every Catalyst source handoff.**

## High-value sources from this pass

- NGA/GWG Portrayal Focus Group — https://gwg.nga.mil/gwg/focus-groups/Portrayal_Focus_Group_%28PFG%29.html
- OGC Symbology Conceptual Core Model — https://www.ogc.org/standards/symbology-conceptual-core-model/
- OGC Symbology Encoding — https://www.ogc.org/standards/se/
- OGC Portrayal Concept Development Study — https://docs.ogc.org/per/17-094r1.html
- OGC Testbed-12 Semantic Portrayal, Registry and Mediation — https://docs.ogc.org/per/16-059.html
- MIL-STD-2525D — https://www.jcs.mil/Portals/36/Documents/Doctrine/Other_Pubs/ms_2525d.pdf
- Current MIL-STD-2525 record (ASSIST) — https://quicksearch.dla.mil/qsDocDetails.aspx?ident_number=114934
- ISO 9186-1 — https://www.iso.org/standard/59226.html
- ISO 9186-2 — https://www.iso.org/standard/43484.html
- ISO 9186-3 — https://www.iso.org/standard/59882.html
- NPIC Publications Guide — https://www.cia.gov/readingroom/document/cia-rdp78t04759a008500010069-9
- NPIC Symbols glossary (1967) — https://www.cia.gov/readingroom/docs/CIA-RDP78B04560A006000010001-1.pdf
- Samet, Geiselman & Landee, graphic symbol-design features — https://pubmed.ncbi.nlm.nih.gov/6180374/
- McDougall et al., visual search of signs/symbols/icons — https://pubmed.ncbi.nlm.nih.gov/16802893/
