# Catalyst working roadmap

This roadmap exists to reduce architectural recursion. It is a working plan, not a promise that evidence cannot change it.

A decision listed as **frozen** should not be casually reopened during implementation. Changing it requires a new ADR explaining the evidence that justified the change.

## Frozen product/architecture decisions

1. Catalyst is local-first and fully useful without network services.
2. Proprietary/AI services are not core dependencies.
3. The underlying analytical structure is graph-like and relationship-first.
4. Recognition-first Working Pictures are the primary analyst-facing portrayals over that substrate; Maps remain human-scale saved portrayal state beneath that experience, and one global node-link canvas is not the permanent interaction model.
5. Structural map branches are distinct from semantic analytical relationships.
6. One analytical object may have multiple Map occurrences without duplication.
7. Evidence, reasoning, and assumptions must be distinguishable.
8. Relationships are first-class objects with semantic direction/type.
9. Analytical methodology is optional, versioned, and operates over common analytical objects.
10. Capability profiles/overrides provide permanent progressive disclosure and preserve hidden data.
11. Spatial Map coordinates are occurrence/view state, not analytical truth.
12. Intelligence-grade means analytic rigor/documentation, not classified-system accreditation.
13. Documentation is part of completion.
14. External renderer/format libraries may implement adapters but do not define Catalyst domain data.

## 0.6.1 architecture alpha — completed foundation

### Purpose

Validate progressive analytical structure before an irreversible generalized-object migration.

### Included

- graph-first workspace from 0.6;
- persistent capability profiles and overrides;
- analytical roles over current note records;
- first-class typed/directed relationship objects;
- compatibility projection to/from legacy `note_links`;
- capability-aware inspector and graph rendering;
- self-rooting maintenance scripts;
- documentation/assurance baseline;
- dedicated analytical-model regression suite.

### Explicitly not included

- Cytoscape migration;
- generalized Item/Object SQLite schema;
- first-class Source/Evidence entities;
- analytic event/audit log;
- methodology-version registry;
- accessible non-spatial graph projection;
- multigraph relationship authoring.

### Exit criteria

Proceed only after native acceptance establishes:

- existing 0.6 workspace loads without lost notes/evidence/connections;
- profile changes visibly reduce/increase complexity;
- hidden feature data survives toggling;
- typed relationships are understandable in real use;
- graph remains spatially stable after semantic edits;
- tests/build pass on the Windows/Tauri development machine.

If the analytical role/relationship model feels fundamentally wrong, revise the compatibility layer now rather than migrate SQLite.


## 0.6.2 evidence-clustering + interface-quieting alpha — completed baseline

### Purpose

Test a concrete cognitive-load control, enforce the quiet-interface principle in working UI, and make release handoffs self-verifying.

### Included

- reusable tags over current saved evidence/highlights;
- many-to-many evidence/tag assignments;
- All / Untagged / per-tag Evidence cluster lens;
- cluster-aware Catalyst highlight rendering in the PDF;
- tagging capability integrated with progressive profiles;
- persistence/hydration through the alpha settings compatibility layer;
- release manifest and overlay digest verification;
- dedicated evidence-tag regression coverage and ADR 0013;
- interface-quieting pass across graph, Evidence, node inspector, reader/library/trash empty states;
- ADR 0014 defining UI text as a cognitive-load budget rather than default chrome.

### Explicitly not included

- universal tags over every graph object;
- using tags as analytical truth/source-quality semantics;
- automatic clustering;
- tag hierarchies/taxonomies;
- Cytoscape migration;
- permanent first-class Evidence SQLite migration.

### Exit criteria

Proceed when native acceptance establishes that tags materially reduce highlight overload, survive restart/profile changes, and the shell feels quieter rather than heavier as capabilities are exposed.

## 0.6.3 visual identity and analytical-language foundation — current

### Research synthesis

`visual-analytical-language-v0.1.md` and ADR 0015 define the design foundation for this milestone. The visual system is derived from analytical semantics, provenance, cartographic hierarchy, human-factors constraints, and the source/analysis boundary rather than from a generic icon theme.

### Implemented in 0.6.3-alpha.1

- first working Instrument / Portrayal / Notation / Content separation in the main Reader + Graph workspace;
- intentional Catalyst trace/junction/probe mark and compact wordmark treatment;
- explicit Source-side header and provenance-spine treatment at the Reader/analysis boundary;
- workspace profile/capability configuration removed from the graph toolbar and moved to header configuration;
- selected-node relationship port replaces the persistent Connect toolbar action;
- neutral registration-corner selection treatment instead of glow/scale emphasis;
- graph controls moved to plotting-margin instrument chrome;
- overview, navigation, working, and detail semantic portrayal levels;
- graph marginalia for node/link counts and active query condition;
- shared evidence-trace notation across graph nodes, inspector sources, and Evidence rows;
- clipped-corner analytical surfaces and reduced rounded-card/pill language;
- inspector and PDF-selection tray redesigned as analytical detail/capture surfaces;
- visual-language contract regression coverage and dedicated native acceptance checklist.

### Native review of 0.6.3-alpha.1

Alpha.1 passed the build/regression boundary but failed the intended visual/product acceptance. The coordinate-plane Graph still read as a generic graph/database editor; the map did not support natural branching/sense-making; and the Windows/taskbar icon remained a placeholder. Alpha.1 is therefore retained as a useful failed portrayal prototype rather than incrementally polished.

Targeted mind-map/concept-map/intelligence-mapping research produced `mapping-model-v0.1.md` and ADR 0016.

### 0.6.3-alpha.2 — analytical-map renderer rewrite

Implemented coherent change:

- replaced the global Cartesian Graph surface with the first Catalyst Analysis/Map renderer;
- introduced Map occurrences over existing analytical objects without irreversible data migration;
- separated structural branch connections from semantic relationships;
- enabled low-friction child/sibling/free capture;
- established one stable human-scale branch grammar plus bounded freeform arrangement;
- separated inspect and explicit refocus; full linked-map navigation remains deferred;
- preserved hidden/collapsed semantic relationship continuation;
- prepared multi-Map occurrence contracts while full nesting/editing remains deferred;
- replaced the placeholder Windows/taskbar icon assets with a Catalyst mark derived from the mapping grammar;
- created the first bespoke Catalyst glyph family for mapping/instrument operations;
- updated visual-language tests and native acceptance around the Mapping Model.

### Remaining before 0.6.3 exits

- alpha.3 native Working Picture acceptance against real source material and a nontrivial research problem;
- verify that the three-second picture test succeeds without reading every object;
- validate Inspect / Focus / Open / Back / Home as a navigable grammar rather than viewport piloting;
- validate source-fragment landmarks and semantic zoom at real Windows/Tauri scale;
- validate structural branches versus latent semantic relationships under increasing density;
- audit remaining command/library/method surfaces against ADR 0014/0015/0017/0018/0019;
- test monochrome, keyboard, reduced-motion, and dense-workspace behavior;
- decide whether the current mapping-derived Catalyst mark and glyph alphabet earn promotion;
- document any corrections discovered during native portrayal testing before 0.6.3 exits.

### Explicitly not included

- faking future provenance or source-lineage semantics before 0.6.5;
- migrating the 0.6.x compatibility ontology merely to support new visuals;
- permanent inference-junction, Assessment, Perspective, Watch/Scan, or weak-signal schema;
- copying military symbology, government seals, or intelligence-themed decoration.

### Exit criteria

Catalyst should be recognizable without becoming visually loud. A new user should be able to distinguish source material, analyst-created structure, inspection state, relationships, saved evidence, active portrayal/filter state, and application controls primarily through hierarchy and notation rather than tutorial prose. The identity must make analytical structure easier to parse and must not make unsupported visual claims.

## 0.6.3-alpha.3 — Working Picture / recognition-first renderer — current implementation

### Why alpha.2 is not being polished

Native review found that alpha.2 still behaved as a text-first diagram editor. The map was not merely buggy; navigation and portrayal were fundamentally too difficult. Subsequent intelligence-specific research therefore changes the primary UI model rather than applying another styling pass.

### Normative design contracts

- `working-picture-model-v0.1.md`
- `portrayal-standard-v0.1.md`
- `navigation-grammar-v0.1.md`
- `representation-matrix-v0.1.md`
- ADR 0017 and ADR 0018

### Implemented coherent proof slice

- introduced Issue/Working Picture framing without irreversible research-data migration;
- replaced universal text-node portrayal with heterogeneous visual occurrences;
- renders attached saved evidence as clipped source-fragment landmarks using current persisted excerpts; true raster region capture remains deferred until the evidence model can persist it;
- removed body previews from normal Working Picture objects; full body text lives in inspection/source contexts;
- makes structural branches primary and reveals semantic relationships only around the current inspect/hover/focus context;
- implements visibly different overview/working/close/inspect semantic portrayals;
- separates single-click inspect, deliberate focus, and source-open actions;
- adds Working Picture Home/Back focus navigation in addition to pane history;
- preserves local analyst-authored map occurrence positions during local edits;
- establishes a small production-candidate Catalyst analytical glyph alphabet for thought, claim, assumption, hypothesis, question, entity, event, source, and evidence;
- keeps all future provenance/inference/Watch semantics explicitly deferred until the domain model exists.

### Exit criteria

The screen must be recognizable before it is readable. A native screenshot should communicate Issue, observed/source-derived material, analyst-created structure, open inquiry, and current focus without requiring the user to read every card. Routine navigation must not require manual pan/zoom piloting. If the renderer remains primarily text cards connected by lines, alpha.3 fails regardless of visual polish.

## 0.6.4 map/renderer adapter and accessibility foundation

### Planned

- define Catalyst-owned renderer-neutral `MapProjection` / occurrence / semantic-relationship boundary;
- evaluate graph/layout libraries only as replaceable adapters for the structure grammars that benefit from them;
- do not adopt a graph engine merely because the substrate is graph-like;
- preserve authored Map state and deterministic compatibility behavior;
- add synchronized non-spatial Map/object/relationship view for keyboard and screen-reader access;
- performance test representative human-scale Maps plus projects containing many linked Maps.

### Exit criteria

Renderer replacement must not require research-data migration, must preserve Map/occurrence semantics, and must not make a third-party graph object model authoritative.

## 0.6.5 evidence/provenance foundation

### Planned

- explicit Source object;
- explicit Evidence object;
- evidence anchor with source identity/version plus location and quote selectors;
- promotion of current PDF excerpt/highlight records into evidence objects;
- evidence-to-claim relationships;
- source/evidence distinction in UI.

### Exit criteria

An analyst can trace a claim to the exact source material and distinguish copied observation from interpretation.

## 0.7 analytical provenance and method substrate

### Planned

- append-only meaningful analytic activity events;
- method definition/version registry;
- Key Assumptions Check;
- Quality of Information review;
- Competing Hypotheses projection;
- clear distinction among confidence, likelihood, source reliability, and information credibility.

### Exit criteria

A reviewer can reconstruct how a judgment was formed and which version of a method was used.

## 0.8 projection views and interchange

### Planned

- timeline projection;
- evidence/table projection;
- argument/reasoning projection;
- JSON/Markdown canonical export;
- JSON Canvas spatial export/import;
- GraphML graph export/import;
- optional domain adapters only after core interchange is stable.

## 0.9 assurance/stability

### Planned

- threat model;
- least-privilege Tauri capability review;
- backup/restore and corruption testing;
- release/build provenance;
- accessibility acceptance;
- large-workspace performance;
- migration rollback/recovery procedures;
- documentation completeness gate.

## 1.0 threshold

Catalyst 1.0 should represent a stable local analytical substrate, not maximum feature breadth.

A 1.0 project must remain understandable and exportable without AI, cloud infrastructure, or proprietary services.

## Deferred until evidence demands them

- AI-generated analysis or relationships;
- embeddings/vector databases;
- automatic entity extraction;
- connector/transform ecosystems;
- server collaboration;
- classified-system claims/accreditation;
- GIS/GEOINT suite;
- massive enterprise ontology tooling;
- automated truth/quality scoring;
- generic methodology scripting language.
