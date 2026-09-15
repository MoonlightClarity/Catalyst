# Catalyst Mapping Model v0.1

Status: **historical 0.6.3-alpha.2 mapping foundation; superseded for current structural authoring by the Outline-first / generated-Map contracts**  
Scope: **human-scale analytical maps over Catalyst's local graph substrate**  
Companion: `visual-analytical-language-v0.1.md`  
Decision record: ADR 0016

> **Current supersession note (2026-09-15):** The Mapping/Working-Picture amendments below preserve design history. They do not restore free-spatial/map-first authoring, semantic-zoom requirements, multi-map UX, or formal Assessment as current product scope.

> **Amendment for 0.6.3-alpha.3:** ADR 0017 and `working-picture-model-v0.1.md` supersede the assumption that a Map is the primary user-facing surface. Map remains a first-class saved portrayal/decomposition mechanism inside an Issue/Working Picture architecture. Structural-branch vs semantic-relationship semantics remain normative.

## 1. Purpose

Catalyst began by making note connections visible, then promoted the graph to the primary research workspace. That progression established the correct computational direction—relationships are part of the analytical substrate—but runtime review exposed a mismatch between the data model and the human interface.

A persistent Cartesian node-link canvas is not a neutral representation of thought. It privileges one geometry, encourages users to treat coordinates as structure, scales poorly as a single canvas, and makes fast associative thinking feel like graph editing. It also exposes implementation vocabulary (`node`, `edge`, `graph`) where the analyst should be working with questions, observations, interpretations, alternatives, and gaps.

Catalyst therefore distinguishes the **analytical model** from the **map portrayal**.

> **The graph is the computational substrate. A Map is a human-scale analytical portrayal over that substrate.**

The Mapping Model defines how analysts can capture ideas quickly, organize them before formal semantics are known, progressively add analytical rigor, move between human-scale maps, and reuse the same underlying analytical object in many contexts without duplication.

The model is anchored in intelligence-analysis practice but uses neutral product vocabulary so the same mechanics remain useful for research, investigations, journalism, law, science, strategy, and other analytical work.

## 2. Intelligence-derived design thesis

Catalyst's mapping model inherits several durable properties from intelligence analysis and intelligence graphics:

1. **Analysis begins with a problem or information need.** A map normally has a purpose, question, requirement, entity, event, hypothesis, or judgment that defines why the map exists.
2. **Sense-making may precede formal semantics.** Analysts must be able to arrange and branch thoughts before deciding whether a relationship means support, causation, dependence, contradiction, provenance, or something else.
3. **Different analytical questions require different geometries.** Association diagrams, chronologies, matrices, hypothesis comparisons, concept maps, and free spatial arrangements are legitimate portrayals of the same underlying analytical universe.
4. **Large analytical pictures should generalize into human-scale views.** A high-level map is not merely a detailed graph viewed from farther away; it is a purposeful selection and generalization of structure.
5. **Source material and analyst construction remain distinguishable.** Evidence may enter a map, but its path back to source material remains recoverable.
6. **Unknowns and alternatives are part of the picture.** A map must accommodate gaps, questions, expected indicators, weak signals, and competing interpretations without forcing premature closure.
7. **Visual form can bias interpretation.** Layout, line treatment, centrality, size, and salience must not make unsupported analytical claims.

The resulting product should feel like an intelligence-derived analytical instrument because of these disciplines, not because it imitates government seals, tactical dashboards, or military symbology.

## 3. Core terms

### 3.1 Analytical Model

The persistent local model containing analytical objects, semantic relationships, evidence, provenance, history, and related state.

The analytical model may be graph-structured internally, but the user is not required to think in database-graph terms.

### 3.2 Map

A saved human-scale analytical portrayal over part of the analytical model.

A Map answers:

- what question or focus is this view helping me understand?
- which underlying objects are portrayed here?
- how are they structurally arranged for this purpose?
- which semantic relationships are shown?
- what is collapsed, generalized, filtered, or outside the current portrayal?
- which layers/lenses are active?

A Map does **not** own the underlying analytical objects merely because they appear on it.

### 3.3 Occurrence

A portrayal of one underlying analytical object inside one Map.

One object may have many occurrences:

```text
Analytical Object O17
        │
        ├── occurrence in Map A
        ├── occurrence in Map B
        └── occurrence in Map C
```

Occurrences may differ in local position, structural parent, collapsed state, label detail, and projection-specific presentation while sharing one underlying object identity.

### 3.4 Structural Branch

A map-organization relationship meaning approximately:

> "This thought is developed beneath / grouped under / locally organized from this thought in this map."

A structural branch is intentionally weaker than a semantic relationship.

It is view structure, not automatically an analytical assertion.

### 3.5 Semantic Relationship

A first-class analytical relationship with explicit meaning such as `supports`, `contradicts`, `depends-on`, `about`, `precedes`, or future richer semantics.

Semantic relationships exist independently of any one Map and may be portrayed as cross-links through structural branches.

### 3.6 Structure Region

A local area/branch of a Map governed by a portrayal grammar. A Map may eventually combine several region grammars.

Examples:

- radial branch;
- hierarchical tree;
- free spatial cluster;
- chronological lane;
- causal/process chain;
- matrix-like region;
- method-specific region.

### 3.7 Focus

The object/question around which the current map or local view is organized.

Focus is navigational/portrayal state. It does not imply analytical importance.

### 3.8 Submap

A linked Map providing another human-scale view of a topic, branch, problem, or level of detail.

A submap is not a duplicate data store and not necessarily a parent/child ontology relation. It is another portrayal over the shared analytical model.

### 3.9 Layer

A reversible analyst-created or system-defined portrayal condition determining which related material is emphasized or included.

Evidence tags are the current 0.6.x seed of analyst-created layers.

### 3.10 Projection

A portrayal whose geometry is intentionally defined by an analytical question or data dimension, such as chronology, matrix, provenance, network topology, uncertainty, or a structured method.

A Map may contain or link to projections, but Map is the broader human working concept.

## 4. Fundamental distinction: structural branches vs semantic relationships

This is the most important mapping decision.

### 4.1 Why they must be separate

Fast sense-making frequently begins with provisional organization:

```text
Question
  ├── possible explanation
  │     └── strange observation
  └── person to investigate
```

At capture time, the analyst may not know what those branches mean analytically.

Forcing every branch to become a semantic edge creates friction and false precision. Conversely, treating every semantic relationship as merely a branch loses meaning and prevents the same object from participating in several analytical structures.

Therefore:

> **Catalyst permits structure before semantics.**

### 4.2 Structural branch properties

A structural branch:

- belongs to a Map/occurrence context;
- can be created with very low friction;
- establishes hierarchy/grouping/local thought flow;
- may eventually carry a lightweight branch label if useful;
- does not automatically imply evidence support, causation, chronology, confidence, ownership, or provenance;
- can later be formalized into or supplemented by semantic relationships without losing the original map structure.

### 4.3 Semantic relationship properties

A semantic relationship:

- belongs to the analytical model rather than one map occurrence;
- retains stable identity;
- has explicit type/direction where appropriate;
- may be portrayed on multiple Maps;
- may cross structural regions;
- may connect objects even when one endpoint is not currently portrayed;
- survives refocusing/restructuring of Maps.

### 4.4 No implicit promotion

Dragging one thought under another must **not** silently create `supports`, `about`, or `depends-on`.

Creating a semantic relationship must be an explicit analytical action.

## 5. A Map has purpose

### 5.1 Focus question / information need

A Map should normally be capable of carrying a concise purpose such as:

- a question;
- a research problem;
- an intelligence requirement;
- a focal entity;
- an event to explain;
- a hypothesis to test;
- a judgment to examine;
- a decision to support;
- an emerging development to monitor.

This purpose may be explicit or implicit during rapid capture, but Catalyst should make it easy to establish.

### 5.2 Focus type can suggest a structure grammar

Catalyst may suggest—not impose—an initial portrayal based on the focal object's purpose.

Examples:

- **Question** → exploratory branches for information, interpretations, alternatives, and gaps.
- **Entity** → association/network-oriented neighborhood.
- **Event** → causes/context/effects with optional chronology.
- **Hypothesis** → expected indicators, supporting/challenging evidence, assumptions, alternatives.
- **Judgment** → basis, uncertainty, assumptions, revision conditions.
- **Source** → extracted evidence, provenance, related artifacts.

This should feel like analytical affordance, not a template wizard.

## 6. Map scale and human-scale decomposition

### 6.1 One giant graph is not the target

Catalyst should not rely on infinite zoom to make arbitrarily large graphs comprehensible.

A complex project can contain many interlinked Maps over one analytical model.

```text
Project analytical model
   │
   ├── Strategic picture
   ├── Actors
   ├── Drivers
   ├── Evidence lineage
   ├── Timeline
   ├── Alternative hypotheses
   └── Watch / emerging signals
```

Each Map remains human-scale and purposeful.

### 6.2 Generalization is analytical portrayal

A high-level map can legitimately omit detail while retaining an indication that more structure exists below/behind it.

A high-level map is **not** merely the detailed map at 20% zoom.

### 6.3 Submap entrances

A branch or topic that has a dedicated submap should be portrayed with a structural thumbnail or depth affordance rather than a generic `MAP` card.

At reduced scale, the preview should communicate shape rather than unreadable miniature text.

Example concept:

```text
ACTORS

      ·
   ·──◆──·
      ├─·
      └──·─·

14 objects
```

The exact visual treatment belongs to the Visual Language specification.

## 7. Local structure grammars

### 7.1 No universal automatic layout

Catalyst should not present one force-directed algorithm as the default truth of every analysis.

The allowed grammar should depend on what the analyst is trying to understand.

### 7.2 Initial grammar set

The long-term mapping model should be able to support at least:

- **Branch** — rapid mind-map-like expansion from a focus;
- **Hierarchy** — explicit top-down/bottom-up structure;
- **Free** — authored spatial arrangement and emergent grouping;
- **Association** — semantic/network neighborhood;
- **Chronology** — ordered temporal structure;
- **Process/Causal** — directional sequence or causal chain;
- **Matrix** — relationship comparison at scale;
- **Method** — technique-specific portrayal such as competing hypotheses.

0.6.3-alpha.2 does not need all of them. The renderer must, however, avoid assuming that one global layout mode will own Maps forever.

### 7.3 Mixed structure

A future Map may contain local branches governed by different grammars.

Example:

```text
                    QUESTION
                       ◆

        ACTORS       DRIVERS       EVENTS
          │             │             │
     association     causal        chronology
       cluster         tree            →
```

Mixed structure is a portrayal feature, not a change in underlying object identity.

## 8. Free spatial grouping remains legitimate

Formal structure must not eliminate exploratory sense-making.

Analysts may use:

- proximity;
- whitespace;
- local regions;
- manual placement;
- analyst-created layers/tags;
- temporary group boundaries;

before formal relationships are known.

Such spatial groupings are Map state unless explicitly promoted to analytical semantics.

This supports statements like:

> "I do not yet know how these observations relate, but I want to keep them together while I work."

Catalyst should preserve that without pretending the grouping is a causal or evidentiary claim.

## 9. Map occurrences and identity

### 9.1 Reuse, do not duplicate

An analytical object appearing on multiple maps remains one object.

Edits to its underlying content/identity should be visible everywhere, subject to normal historical/version behavior.

Local presentation does not propagate unless it belongs to the underlying object.

### 9.2 Occurrence-owned state

Likely occurrence/view-owned properties include:

- local position;
- structural parent/branch;
- local region;
- collapsed/expanded state;
- local alias/short label where explicitly supported;
- portrayal detail level;
- manual position override;
- pinned visibility;
- map-specific emphasis.

### 9.3 Object-owned state

Likely analytical-model properties include:

- identity;
- content/body;
- semantic type;
- first-class semantic relationships;
- evidence connections;
- provenance/history;
- analytical assessments once modeled.

The exact permanent schema remains deferred to the post-compatibility model work.

## 10. Capture interaction

### 10.1 Capture must be faster than record creation

The current `New node`-first interaction is too database-like.

The mapping surface should favor direct creation:

- **Tab** → child/branch thought;
- **Enter** → sibling thought;
- **double-click empty space** → free thought;
- **drag from branch affordance** → connected structural thought;
- **typing with map focus** → future quick-capture possibility if it can be made unambiguous;
- toolbar `New` remains available for discoverability but is not the fluent path.

### 10.2 New thoughts begin lightweight

A new structural thought should not force the analyst to choose an analytical role before typing.

Role/semantics can be added progressively.

### 10.3 Branch creation is not semantic assertion

Creating a child establishes Map structure only.

A semantic relation can be added afterward through explicit relationship authoring.

## 11. Inspect, focus, and navigate are different operations

### 11.1 Inspect

`Inspect` means:

> "Show me details of this occurrence/object."

It opens the inspector but should not rearrange the map or visually imply importance.

### 11.2 Focus / refocus

`Focus` means:

> "Reorganize the current local portrayal around this object/question."

Refocusing is intentional and may change which neighborhood is prominent.

It must preserve enough animated spatial continuity for orientation without turning motion into decoration.

### 11.3 Open submap

`Open map` means:

> "Navigate into another saved portrayal."

This is distinct from merely focusing an object within the current Map.

### 11.4 Recommended interaction distinction

Exact bindings remain subject to native usability testing, but the conceptual distinction is fixed:

```text
single selection      Inspect
explicit focus action Recenter/refocus this map
open-map action       Navigate to linked submap
```

No implicit refocus on ordinary selection.

## 12. Cross-links and map boundaries

### 12.1 Structural branch lines and semantic links must look different

A structural branch communicates local organization.

A semantic cross-link communicates analytical meaning.

The Visual Language must make them distinguishable even in monochrome.

### 12.2 Hidden endpoint preservation

Collapsing a branch must not make meaningful semantic relationships appear not to exist.

If hidden descendants participate in relationships crossing a collapsed boundary, the visible boundary should expose a compact continuation/count affordance.

Conceptually:

```text
ACTORS  14
  └──────3────→ Hypothesis H2
```

This means three hidden relationships cross the collapsed boundary.

It does not mean the aggregate itself is a single semantic source.

### 12.3 Off-map relationships

An occurrence can indicate that the underlying object has additional semantic relationships outside the current portrayal.

Those relationships should be discoverable without drawing the entire global graph.

## 13. Collapse, aggregation, and filtering

Catalyst must distinguish four states:

1. **Collapsed** — structure exists but is intentionally folded into a local branch boundary.
2. **Generalized** — renderer suppresses detail appropriate to scale/density.
3. **Filtered/layered out** — active portrayal condition excludes/de-emphasizes material.
4. **Not included in this map** — analytical model contains material that this saved Map never chose to portray.

These are not equivalent.

The marginalia/view-state system should expose relevant portrayal conditions so absence is not misread as nonexistence.

## 14. Semantic zoom under the Mapping Model

Semantic zoom remains valid but changes purpose.

It controls **detail within a map occurrence**; it is no longer expected to solve project-scale complexity by itself.

At broad scale:

- branches/territories and structural shape dominate;
- labels reduce to anchors;
- cross-links may aggregate;
- submaps show structural thumbnails.

At working scale:

- identities and relationship labels appear;
- evidence trace marks become legible;
- branch creation/manipulation affordances appear.

At inspection scale:

- selected occurrence remains compact;
- rich details go to inspector rather than making the map object a giant card.

## 15. Intelligence-native analytical territories

Catalyst should support, but not rigidly impose, a recurring set of territories around an analytical problem:

```text
                     PURPOSE / QUESTION
                            ◆
             ┌──────────────┼──────────────┐
             ▼              ▼              ▼
       INFORMATION     INTERPRETATION    INQUIRY
       observations    claims            questions
       evidence        hypotheses        gaps
       sources         assumptions       probes
             │              │              │
             └──────── REASONING ──────────┘
                            │
                     ALTERNATIVES
                            │
                          WATCH
```

This is not a fixed map template. It is a design vocabulary ensuring that source information, analyst interpretation, alternatives, assumptions, and unresolved needs can become visually distinct without requiring separate applications.

## 16. Evidence and source integration

### 16.1 Source remains source-owned space

The Reader remains the authoritative place for captured source context.

The Map can portray evidence derived from the Reader, but must preserve a trace back to the anchored source material.

### 16.2 Evidence enters, source context remains recoverable

Evidence can participate in structural branches and semantic relationships while retaining the source trace mark defined by the Visual Language.

### 16.3 Evidence is not merely a branch color

Tags/layers may organize evidence, but tag color must not become evidence quality, credibility, confidence, or corroboration.

### 16.4 Future provenance

The Mapping Model reserves room for provenance lineage, evidence families, artifact versions, transformations, and source independence without faking them in 0.6.3.

## 17. Inquiry, Probe, Watch, and Scan

The Mapping Model must leave room for the anticipatory side of intelligence analysis.

### 17.1 Probe

A Probe extends from current reasoning toward information the analysis needs.

It may eventually connect:

- a judgment to a vulnerable assumption;
- an assumption to a question;
- a hypothesis to an expected indicator;
- a gap to an information need.

### 17.2 Watch

Watch portrays expected observables/revision conditions the analyst intentionally chose to monitor.

### 17.3 Scan

Scan supports bottom-up sense-making for observations whose significance is not yet understood.

Unexpected observations may be grouped/clustering without being forced into an existing hypothesis.

### 17.4 No early-warning dashboard semantics in 0.6.3

The 0.6.x model does not yet support first-class indicators, signal assessments, baselines, or warning assessments. The map renderer must not simulate these with decorative icons or colors before the domain exists.

## 18. Time and alternate projections

Chronology is a legitimate analytical geometry, not just a property label.

The same analytical objects may therefore participate in:

- a free/branch Map;
- a chronology Map/projection;
- an association Map;
- a matrix;
- a method-specific view.

Changing projection is an intentional change of geometry and therefore may move occurrences without changing the analytical objects.

A future time model must distinguish subject/effective time from knowledge/record time as defined in the Visual Language foundation.

## 19. Interaction-state rules

The following visual implications are prohibited:

- selected = important;
- focused = central in the real-world network;
- map center = analytically most significant;
- branch parent = semantic cause/support unless explicitly asserted;
- physical closeness = similarity/strength unless the active projection defines it;
- branch thickness = confidence/importance unless explicitly defined by a lens;
- collapsed = absent;
- off-map = nonexistent;
- many evidence marks = independent corroboration;
- visible semantic link = certainty of the assertion.

## 20. Map transitions and spatial continuity

### 20.1 Motion has one job: orientation

Animated transitions are allowed when they explain:

- refocusing;
- expanding/collapsing a branch;
- entering/leaving a submap;
- changing projection;
- revealing hidden related material.

Motion must be restrained and respect reduced-motion preferences.

### 20.2 No silent global rearrangement

Adding a child should grow the affected local branch rather than arbitrarily rearranging unrelated regions.

Manual placement should remain stable until the analyst explicitly requests a restructure/re-layout for the relevant region or projection.

### 20.3 Projection changes may legitimately move things

Spatial continuity is valuable, but preserving coordinates at the cost of semantic meaning is not.

Catalyst should make intentional geometry changes understandable rather than forbidding them.

## 21. Map navigation

Catalyst should eventually support map-level navigation separate from ordinary object inspection.

Likely concepts:

- current Map name/purpose;
- parent/origin map trail where applicable;
- recent map history;
- quick return to project overview;
- submap openings;
- links to alternate projections over the same focus.

This should live in Instrument/Portrayal chrome, not on analytical objects.

## 22. Accessibility

Spatial maps cannot be the sole way to access analytical structure.

The Mapping Model therefore requires a synchronized non-spatial representation capable of exposing:

- map purpose;
- structural branches as an outline/tree where applicable;
- semantic relationships as labeled relationships;
- occurrence/object identity;
- collapsed/off-map relationship counts;
- evidence/source links;
- map/submap navigation;
- selection/focus state;
- active layers and portrayal conditions.

Keyboard-only creation/navigation must be a first-class acceptance target, not an afterthought.

## 23. Branding and custom glyph implications

The Mapping Model supersedes the idea that Catalyst branding should begin with a standalone logo or large generic pictogram library.

The first distinctive forms should come from native map operations:

- Focus;
- Branch;
- Cross-link;
- Trace;
- Junction;
- Divergence;
- Probe/open continuation;
- Submap/depth;
- Collapsed frontier;
- Revision/change.

Instrument icons remain a separate visual family and should be small, consistent, and subordinate.

The Windows/taskbar application icon must no longer remain a placeholder. However, the final mark should be derived from the mapping grammar so the same characteristic geometry appears in the application icon, shell, map interactions, and analytical notation.

## 24. 0.6.3-alpha.2 implementation contract

Alpha.2 should be a **renderer rewrite**, not a cosmetic patch over alpha.1's coordinate-plane graph.

### 24.1 Required

- remove the graph-paper/Cartesian coordinate-plane treatment as the default analytical background;
- rename the primary user-facing workspace away from `Graph` toward `Analysis`/Map-oriented language;
- introduce a Map view model over the existing 0.6.x graph/node data without requiring irreversible SQLite migration;
- distinguish structural branch connections from first-class semantic relationships in the renderer/view state;
- support fast branch capture from a focus/root thought;
- retain explicit semantic cross-links;
- keep selection/inspection separate from refocus;
- establish at least one human-scale branch grammar with stable local layout;
- support manual free placement or a clearly bounded freeform region without turning the entire workspace into coordinate paper;
- visually represent collapsed hidden structure without pretending it disappeared;
- add a real non-placeholder Catalyst Windows/application icon derived from the new mapping grammar;
- add an initial bespoke glyph family for Catalyst's core mapping/instrument operations rather than relying on generic browser-style pictograms;
- preserve current evidence/tag/profile/relationship data and source Reader behavior;
- update documentation and regression tests to use Map/occurrence/branch terminology.

### 24.2 Strongly preferred if coherent

- map purpose/focus-question affordance;
- submap data/view contract even if full nested-map editing is deferred;
- structural thumbnail prototype for submaps;
- map-level navigation history separated from object inspection;
- reduced-motion-safe refocus animation;
- keyboard branch creation (`Tab` / `Enter`).

### 24.3 Explicitly out of scope

- permanent 0.7 ontology migration;
- first-class inference junction schema;
- permanent Assessment/Perspective schema;
- full provenance lineage;
- first-class indicators/weak signals/warnings;
- complete mixed-layout engine;
- server collaboration;
- AI-generated mapping;
- a giant icon library;
- automatic semantic inference from structural branches.

## 25. Compatibility/migration strategy for alpha.2

0.6.3-alpha.2 should preserve user data while replacing the portrayal.

The existing 0.6.x graph view contains one coordinate occurrence per live note. Rather than deleting that state immediately:

1. treat the existing graph as a compatibility Map on first load;
2. create occurrence/view state from the existing positions where useful;
3. seed a focal/root occurrence deterministically if no map focus exists;
4. preserve first-class `Relationship` records unchanged;
5. keep legacy graph view data readable for rollback during alpha;
6. introduce map-view state through the existing settings compatibility layer before permanent schema migration;
7. do not reinterpret existing relationships as structural branches automatically unless the migration rule is explicit and reversible.

Existing semantic relationships are **cross-links**, not automatic branch hierarchy.

For an old workspace with no authored branch structure, alpha.2 may offer/seed a neutral initial arrangement, but it must not fabricate semantic hierarchy from relationship direction.

## 26. Acceptance criteria for the Mapping Model

A native alpha.2 build should not be accepted merely because it looks less generic.

It should establish all of the following:

1. **Immediate orientation** — an analyst can tell what the current map is about without reading interface instructions.
2. **Fast capture** — branching from an existing thought is materially faster than creating and wiring a database-style node.
3. **Structure before semantics** — the analyst can organize thoughts without making unsupported relationship claims.
4. **Semantic rigor remains available** — explicit typed relationships remain visible and authorable.
5. **No coordinate-plane dependence** — the workspace does not read visually as CAD/graph editor by default.
6. **Human-scale complexity** — collapse/generalization visibly communicates that hidden structure still exists.
7. **Stable identity** — one analytical object can appear in several map contexts without duplication of content.
8. **Inspect is not refocus** — ordinary selection does not rearrange the map.
9. **Map transitions preserve orientation** — deliberate refocus/navigation is understandable.
10. **Source trace survives** — evidence remains recoverable to Reader context.
11. **Brand emerges from function** — custom mark/glyphs visibly derive from map operations rather than generic iconography.
12. **No false visual claims** — parentage, position, size, proximity, salience, and line treatment do not imply semantics Catalyst did not record.
13. **Accessibility path exists** — keyboard/non-spatial access can reach the same objects and relationships.
14. **Existing data survives** — no lost notes, evidence, tags, relationships, positions, or source references during the alpha transition.

## 27. Design laws added by this model

The following are frozen design laws unless superseded by a later ADR:

> **The graph is the substrate; the Map is the human interface.**

> **Catalyst permits structure before semantics.**

> **A structural branch is not a semantic relationship.**

> **One analytical object may have many map occurrences without duplication.**

> **A Map is a purposeful portrayal, not an infinite global canvas.**

> **Inspecting, refocusing, and opening another Map are separate operations.**

> **Collapsed, generalized, filtered, off-map, and nonexistent are different states.**

> **The structure of a Map may change with the analytical question; no one geometry is universally authoritative.**

> **Visual richness should come from analytical structure and navigation, not decorative dashboard graphics.**

## 28. Research lineage informing v0.1

The model synthesizes design evidence from several traditions rather than copying one product:

- intelligence concept-mapping research, especially Defence R&D Canada's interlinked Concept Map Knowledge Model of Intelligence Analysis;
- intelligence structured analytic techniques, where mind maps, concept maps, matrices, chronology, indicators, ACH, and network techniques serve different questions;
- ICD 203's requirement to distinguish underlying information, assumptions, judgments, uncertainty, alternatives, sourcing, and changes in major judgments;
- intelligence cartography's emphasis on purposeful thematic portrayal, hierarchy, generalization, restraint, and marginal information;
- classical mind mapping's low-friction focal branching;
- concept mapping's focus questions and semantically meaningful cross-links;
- spatial hypertext's support for emergent, provisional structure;
- focused-network navigation such as TheBrain's local neighborhood/refocus model;
- multi-map/nested-map knowledge models such as CmapTools and modern canvas tools;
- graph visualization research on semantic zoom, density, focus/context, and the risks of unsupported spatial implication.

The important inheritance is not a particular visual style. It is the recognition that human reasoning needs **several levels of structure between raw notes and a formal graph**.

## 29. Open questions after v0.1

These should be resolved through prototype/native use rather than broad speculative design:

- exact branch geometry for the first alpha.2 focus map;
- whether the first implementation grows balanced/radial or directional by default;
- the best discoverable gesture for explicit refocus;
- how much manual placement survives an intentional branch restructure;
- the smallest useful submap preview;
- how structural branches are persisted during compatibility alpha;
- when a branch should remain a pure map relationship versus be promoted to an underlying analytical relationship;
- how keyboard hierarchy should behave when freeform occurrences coexist with branches;
- exact custom glyph geometry and application-mark reduction.

These are bounded implementation questions. They do not reopen the core Mapping Model decisions above.
