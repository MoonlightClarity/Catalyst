# Catalyst chat export / rollover handoff — 2026-09-11

Purpose: durable replacement for relying on this long ChatGPT conversation after it reaches maximum length. This is a synthesis, not a verbatim transcript.

## Product thesis

Catalyst is a local-first analytical workspace with intelligence-grade methodology/documentation but broad applicability to research, law, journalism, science, strategy, investigations, and other analytical work. Intelligence tradecraft is a design lineage, not an aesthetic theme.

Core chain: source material → anchored observation/evidence → reasoning → judgment → revision/audit, with uncertainty, alternatives, provenance, inquiry, and monitoring distinguishable.

Graph remains computational substrate. It must not be the default visual metaphor.

## Durable design laws

- analytical structure should become legible before it must be read;
- source/observation and analyst construction remain distinguishable;
- relationship semantics are explicit and first-class;
- movement/proximity/grouping do not silently create semantic assertions;
- selection/focus do not imply importance, confidence, or truth;
- repeated reports/occurrences do not imply independent corroboration;
- source continuity and transformations remain auditable;
- application chrome retreats; material dominates;
- capabilities and methods are progressively disclosed/toggleable;
- documentation is part of completion.
## Build chronology relevant to current state

### 0.6.2-alpha.2

Added evidence tags/clustering, capability-aware tagging, all/untagged/tag cluster lens, quieter interface treatment, and ADR 0014. Regression validation passed in the earlier handoff environment.

### 0.6.3-alpha.1

First attempt at a custom analytical portrayal language. It removed some generic graph chrome, introduced provisional Catalyst marks and registration-style selection, but runtime still looked like a generic coordinate-plane graph editor.

### 0.6.3-alpha.2

Replaced graph workspace with an Analysis Map, added structural branches distinct from semantic links, Map occurrences, collapse/refocus behavior, and native icon assets. Runtime testing showed that a better-organized textual graph was still the wrong cognitive model.

### 0.6.3-alpha.3

Rewrote toward the Working Picture contract: less body text, custom glyphs, structural branches, latent semantic relationships, compact capture treatment, and revised navigation. Runtime screenshot `Capture(10).PNG` exposed another failure: iconography was too abstract and underdeveloped, sparse symbols did not create recognition-rich landmarks, inspector/microcopy still consumed attention, and the boxed Windows `E` proved Tauri runtime icon plumbing remained wrong.

The alpha.3 updater's final license check also failed with exit code 2. This was diagnosed as audit execution failure, not detection of a prohibited dependency. `licenses.ps1` should not block a UI-only release merely because an unchanged Cargo dependency audit cannot execute.
## Research pivot that superseded renderer iteration

The user explicitly stopped image-first mockup iteration and required research before more UI generation/coding. Research established that Catalyst should inherit the visual-production discipline of intelligence cartography, link analysis, warning, imagery exploitation, and visual analytics rather than imitate intelligence-themed aesthetics.

Key representation findings:

- recognition-first is more precise than 'image-first';
- actual visual evidence should remain visually native where useful;
- analytical abstractions need a small compositional notation system rather than generic app icons;
- controls and analytical notation are different visual species;
- semantic zoom changes representation, not merely scale;
- source trace/provenance should use compact notation with details on demand;
- Working Picture and Briefing Picture are different portrayals over the same analytical record;
- a formal Catalyst Graphic/Portrayal Standard is architecture, not polish.

Human-factors/symbology research then showed that alpha.3 overcorrected toward abstraction. Catalyst should use recognizable core silhouettes for concrete referents, learned semi-abstract modifiers for analytical roles, and abstract geometry for operations such as trace/junction/divergence. Familiar meaning should remain familiar; brand distinctiveness comes from the construction grammar.

A Portrayal Lab was specified to test perception, comprehension, discrimination, visual search, realistic Working Picture scenes, scale variants, salience, modifier budgets, and confusion rather than approving icons aesthetically.
## Source/archive and maintenance changes

Research is now part of the Catalyst source tree under `docs/research/`. A source handoff is incomplete if it omits the accumulated research.

`docs/source-archive-standard.md` governs source archives. `gather_source.ps1` now includes native `src-tauri` source/configuration and excludes generated native output rather than excluding all of Tauri. This corrected earlier drift in `tauri.conf.json`, `Cargo.toml`, native icons, and versions.

`gather_research.ps1` creates standalone research handoff ZIPs. The standing rule is to synthesize/update integrated research and create a research checkpoint after each substantial pass.

`clean.ps1` was added for regular maintenance. Routine clean removes generated/transport debris and byte-identical duplicates while preserving dependencies; deep clean also removes `node_modules` and `src-tauri/target`. The user performed a full clean and supplied `Catalyst(3).zip` as a canonical clean archive baseline.

The live local source at `C:\Users\iris\Downloads\Catalyst` has since advanced through parallel research beyond that uploaded archive. Prefer the live integrated `docs/research` state for current architecture conclusions.

## Tauri/native icon facts recovered from the user

`src-tauri/tauri.conf.json` and `src-tauri/Cargo.toml` were still version `0.5.1` while frontend alpha was 0.6.3-alpha.3. `tauri.conf.json` did not explicitly specify the bundle icon list. Future release work should synchronize frontend/native versions and wire both bundle and development/runtime window icon paths deliberately.
## Latest cognitive-architecture state

The research priority moved above portrayal polish. The current Working Picture hypothesis is a bounded analytical desk with placeable source/document/page/region material, low-ceremony staging, free placement before semantics, later explicit structure, bounded subpictures, and coordinated alternate projections.

The architecture research separated durable identity, context-local occurrence/placement, context-local structure, semantic assertion, source/version anchors, transformation provenance, focus/return state, saved viewpoints, and derived state. The mutation law says an action mutates only the state species it names unless an explicit analyst-authored escalation crosses a boundary.

The authoritative architecture files before the latest adversarial pass are:

1. `WORKING_PICTURE_ARCHITECTURE_CONTRACT_2026-09-11.md`
2. `PASS-2026-09-11-working-picture-prototype-acceptance-contract.md`
3. `WORKING_PICTURE_PROTOTYPE_OBSERVABILITY_2026-09-11.md`
4. `PASS-2026-09-11-architecture-state-ownership-destruction-projections.md`
5. `PASS-2026-09-11-architecture-command-semantics.md`
6. `PASS-2026-09-11-architecture-collaboration-conflict-semantics.md`
7. `ARCHITECTURE_CHECKPOINT_2026-09-11.md`

The next allowed artifact had been a disposable interaction prototype, not production Working Picture code, once research was deliberately closed.