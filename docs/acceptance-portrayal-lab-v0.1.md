# Portrayal Lab v0.1 acceptance contract

Status: **pre-alpha.4 development instrument**. This is not acceptance of a final Catalyst symbol family.

## Purpose

The Portrayal Lab moves the visual-language work out of ad hoc component-local SVG experiments and into an executable catalog/resolver/primitives boundary that can be evaluated before alpha.4 changes the Working Picture.

## Required architecture

- A versioned portrayal catalog owns candidate families, semantic cores, modifiers, scale levels, rule precedence, and test status.
- Rule resolution follows this order: semantic base; scale/detail; active lens; local authored portrayal; accessibility; neutral interaction state; reasoned attention state.
- Ordinary landmarks expose at most two modifiers in the initial experiment; overflow is deferred rather than piled onto the symbol.
- Modifier meanings occupy fixed semantic zones.
- The Lab and future product rendering use the same `src/portrayal/` modules.
- `explainPortrayal()` exposes the resolution trace rather than allowing invisible CSS/component precedence.

## Required benchmark surface

The Lab contains fixed P1–P8 stations from the portrayal-execution research:

- P1 sparse category recognition;
- P2 moderate visual search;
- P3 dense visual search;
- P4 modifier discrimination;
- P5 overlap/clutter;
- P6 mixed-media Working Picture;
- P7 semantic-zoom continuity at 16/24/32/48 px;
- P8 return/spatial-memory task.

At least three candidate core families must be comparable before one is promoted.

## Experimental protocol invariants

- The current measurement protocol is `blind-v1`. Blind mode is the default; `mode=review` must be requested explicitly.
- In blind mode, P1–P7 benchmark scenes are masked while idle. Reveal and timer start are the same action, so the target cannot be pre-located before timing.
- P7 obeys the same pre-reveal mask as every other timed station. Review mode shows the four-scale matrix; blind mode measures one authored scale per run so the participant cannot choose the easiest panel. The 16/24/32/48 px order is counterbalanced by session and family.
- The reference/training strip is available only in review mode and never appears in blind measurement mode.
- Candidate family, station, scale, and theme controls are locked while a trial is active so recorded context cannot change mid-run.
- P1–P4 and P7 are recognition/discrimination stations and must not inherit unrelated relationship linework. P5 deliberately supplies clutter linework; P6 deliberately supplies mixed-media structure.
- P8 begins masked, reveals the target only for the explicit study phase, excludes study/mask time, and measures only reveal-to-selection return time.
- Review mode exposes scenes for development inspection but cannot record timed results.

## Result memory

A recorded run retains portrayal catalog version, trial protocol version, candidate family, scene, scale, theme, target and selected referents/objects, correctness, response time when available, and confusion target. Results persist locally and summaries are isolated by candidate family, catalog version, and protocol version so neither an older design nor an older measurement procedure can contaminate current measurements.

The active dataset can be exported as schema-versioned JSON containing export time, catalog identity/version, protocol version, result count, and complete result records. Session-aware exports use schema version 3. Storage is keyed by catalog, protocol, and result-schema version so pre-session records cannot contaminate current measurements.

Each blind session uses a stable anonymous session ID and one of the six possible candidate-family orders. Every result retains session ID, assigned family-order position, and trial ordinal; an optional non-identifying participant code may be supplied by the test operator. Counterbalancing reduces family-order bias across sessions but does not erase learning/carryover within a single repeated-measures session.

## Access

Use the command palette action **Open Portrayal Lab**, or navigate directly to `#/portrayal-lab`; this enters blind measurement mode. Reproducible exposed review states must opt in with `mode=review`, for example `?mode=review&station=P7&family=concrete-a&scale=16&theme=monochrome#/portrayal-lab`. Blind sessions may optionally use `session=<opaque-id>` to reproduce a counterbalancing assignment and `participant=<non-identifying-code>` to associate repeated runs without collecting personal identity. The Lab is deliberately outside the normal Working Picture.

## Gate to alpha.4

This milestone is complete when the Lab itself builds and its architecture/tests are stable. It does **not** authorize alpha.4 integration. A candidate family still needs observed recognition/discrimination/search performance, modifier legibility, semantic-zoom continuity, and realistic Working-Picture task testing before promotion.
