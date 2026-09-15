# Portrayal execution plan

## Why this exists

Catalyst now has substantial theory about what an intelligence-grade visual language must mean. Alpha.3 demonstrated that theory alone does not tell us whether a symbol is actually recognizable, discriminable, searchable under clutter, or stable at small scale.

The next phase therefore treats portrayal as a human-factors engineering problem.

## 1. Build a Portrayal Lab before alpha.4

The Lab is a dedicated development/test page, not the main Catalyst product screen.

It should render:

- multiple candidate core-symbol families;
- analytical modifiers;
- state amplifiers;
- point, line, area, trace, branch, junction, and frontier primitives;
- semantic-zoom variants;
- salience states;
- monochrome/light/dark renderings;
- realistic Working Picture compositions.

This becomes the environment in which the visual language is iterated before production integration.

## 2. Define the primitive grammar first

Before drawing final core symbols, define:

- construction grid;
- standard stroke weights by size;
- allowed corner/terminal geometry;
- negative-space rules;
- minimum gaps;
- modifier zones;
- label zones;
- source-trace mark;
- selection/registration geometry;
- branch geometry;
- semantic relation geometry;
- territory boundary grammar;
- inference junction grammar;
- open-frontier/probe geometry;
- submap miniature grammar.

## 3. Functional classes

### Instrument glyphs

Purpose: repeated commands such as Back, Home, Search, Layers, Focus/Open, settings.

Requirements:

- conventional where possible;
- extremely simple;
- fast visual search;
- stable position;
- minimal decorative character;
- visually distinct from analytical notation.

### Analytical landmarks

Purpose: recognition and spatial memory in the Working Picture.

Requirements:

- stronger silhouettes;
- mnemonic identity;
- actual source visuals where available;
- core symbols where no native visual is meaningful;
- stable analyst-authored placement;
- short identity labels.

## 4. Core + modifier + state

Do not manually draw every combination.

Use a compositional scheme:

**Core** — what kind of thing is this?  
**Analytical modifier** — what role is it playing?  
**State amplifier** — what currently matters?  
**Structural geometry** — how is it participating in this picture?

The core should generally be the most concrete/recognizable layer.

Potential initial core referents (subject to lab testing):

- source/document;
- evidence/observation;
- person/actor;
- organization;
- event;
- question/inquiry;
- proposition/judgment;
- place/map/context.

Potential learned modifiers:

- assumption;
- hypothesis/alternative;
- judgment/assessment;
- indicator/watch;
- unresolved/gap where a modifier is appropriate rather than open topology.

State amplifiers should be rare and occupy reserved positions rather than arbitrary badge locations.

## 5. Stable positional grammar

Modifier/state information should use predictable zones. Do not place badges wherever space is available.

The exact sector assignment is not frozen yet. The lab must test it for collision, scanability, and small-size legibility.

Principle:

> A given meaning stays in the same location across every compatible symbol.

## 6. Semantic-distance budget

Use the most semantically direct representation that still fits the grammar.

- concrete resemblance where a physical/recognizable referent exists;
- conventional metaphor where appropriate;
- abstract learned notation only when the analytical concept has no natural pictorial representation.

Do not make a familiar meaning unfamiliar merely to make Catalyst look proprietary.

## 7. Semantic zoom variants

Author distinct variants rather than uniformly scaling one master icon.

Required test sizes initially:

- 16 px;
- 24 px;
- 32 px;
- 48 px / Working-Picture landmark size.

At smaller scales remove secondary information rather than crushing it.

Overview may reduce low-interest items to simple landmarks/dots while preserving high-interest/active objects at richer detail, but the reason for salience must remain explicit.

## 8. Salience classes

Define standard portrayal states:

1. Background context.
2. Normal working object.
3. Inspect selection — neutral mechanical registration only.
4. Active-lens analytical emphasis — visually stronger for a stated analytical reason.
5. Attention required — strongest and rare.

Selection, importance, confidence, warning, novelty, and centrality must never share one undifferentiated highlight treatment.

## 9. Five test stations

### A. Element perception

Question: can users actually perceive the intended components at each size?

Catches line merger, notches disappearing, negative-space collapse, and terminal ambiguity.

### B. Unlabeled meaning

Question: what does this symbol mean without a label?

Catches semantic-distance failures.

### C. Family discrimination

Show related symbols together. Ask the user to identify one.

Catches individually attractive but mutually confusable symbols.

### D. Visual search under load

Use realistic arrays and modifiers. Example tasks:

- find the Source;
- find the watched Event;
- find the source-backed Hypothesis;
- distinguish selected from analytically emphasized.

### E. Working Picture task test

Use actual source crops, lines, territories, labels, and hierarchy.

Ask:

- where is the unresolved question?;
- which observation came from source 17?;
- what is being inspected?;
- what is analytically emphasized and why?;
- what is merely background context?;
- which objects/relationships are hidden by current portrayal?

A symbol family is not accepted until it works in the system context.

## 10. Test memory as well as immediate recognition

Use delayed recall/return tasks where practical:

- where was the source landmark?;
- which symbol represented the organization?;
- can the user re-find the important evidence after leaving and returning?

Short identity labels may improve memory and should not be eliminated dogmatically.

Working default is:

**shape for category + short text for identity + spatial stability for memory.**

## 11. Contextual legend

A small contextual Key may explain analytical modifiers currently visible.

Do not show a permanent 40-symbol legend.

Core symbols should be sufficiently recognizable that ordinary navigation does not require legend lookup.

## 12. Native app mark

The Catalyst app icon must use the same construction grammar but is a separate small-size design problem.

Requirements:

- unmistakable silhouette;
- very few terminals;
- no hairline dependence;
- strong positive/negative rendering;
- specifically redrawn small-size forms;
- no text;
- derive conceptually from actual Catalyst analytical geometry, not a lettermark pasted onto the application.

## 13. Code architecture

Portrayal should become an explicit module rather than component-local SVG fragments.

Suggested direction:

```text
src/portrayal/
  primitives/
  symbols/
  modifiers/
  salience/
  semanticZoom/
  traces/
  branches/
  territories/
  legend/
```

UI components should request portrayal for an object/context rather than hardcoding their own icon semantics.

## 14. Acceptance gate before alpha.4

Do not integrate the new system into the full Working Picture until:

- core category symbols are identifiable without labels at Working scale at an acceptable rate in informal tests;
- related core symbols are not repeatedly confused;
- modifiers remain legible at intended scales;
- selection is never mistaken for analytical importance;
- source-backed visuals read as source material rather than generic cards;
- task testing in realistic Working Pictures is faster/easier than alpha.3;
- the app mark remains distinctive at Windows taskbar/title-bar scale.

## 15. Portrayal catalog and rendering boundary

The Portrayal Lab should prototype the same architecture the product will ultimately use rather than producing disconnected SVG assets.

Use a versioned portrayal catalog containing:

- semantic core-symbol definitions;
- modifier/state definitions with reserved placement zones;
- point/line/area/branch/trace/junction/territory symbolizers;
- scale-range / semantic-zoom rules;
- overlay/lens conditions;
- salience classes;
- legend metadata;
- candidate/test status.

A rendering context should resolve rules in an explicit order:

1. semantic base;
2. scale/detail level;
3. active analytic overlay/lens;
4. local authored portrayal;
5. accessibility adaptation;
6. neutral interaction state;
7. rare reasoned attention state.

Do not let React components create new analytical icon semantics locally.

## 16. Modifier budget

The ordinary Working-scale landmark should normally expose no more than the core identity plus a small number of high-value modifiers. Start Portrayal Lab testing with a maximum of two simultaneous visible modifiers. Treat that as a hypothesis to validate, not a universal law. Additional analytical dimensions should move into overlays, traces, legends, or inspection.

## 17. Test-result persistence

Candidate testing should produce machine-readable result records so design iterations can be compared. At minimum retain candidate ID/version, scale/theme/context, intended referent, user response, confusion target, correctness, completion time when practical, and notes.

Maintain a fixed Working-Picture test corpus so portrayal changes can be compared rather than evaluated against a different composition every iteration.

## 18. Session order and carryover control

Comparative candidate testing must record exposure order rather than assuming that repeated trials are independent. The fixed benchmark corpus creates a real learning risk: a participant who sees one family first may remember target locations when testing later families.

Use all six permutations of the three initial candidate families as counterbalanced session orders. Assign one order deterministically from an anonymous session identifier, retain the family-order position and trial ordinal in every result, and preserve that metadata in exported data. An optional non-identifying participant code may group repeated sessions when needed.

Counterbalancing controls order effects across a set of sessions; it does not eliminate within-session practice or spatial-memory carryover. Interpret single-session family comparisons as exploratory. Promotion decisions should rely on multiple sessions distributed across orders, and the analysis should inspect performance by order position as well as pooled family performance.

### P7 semantic-zoom measurement rule

The four-panel semantic-zoom matrix is a review instrument, not a timed trial surface. In blind measurement mode, test one authored scale at a time and record the scale with the response. Use a balanced four-scale order derived from session and candidate family so later scales do not systematically benefit from repeated spatial exposure. Multiple P7 runs are required to cover all four authored levels.
