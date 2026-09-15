# Catalyst Iconography Audit

Status: **current semantic audit - 2026-09-15**

The generated call-site/registry inventory is `iconography-map.md`; refresh it with `npm run icons:audit`. This document records current meaning rules, not historical alpha.3 navigation requirements.

## Current symbol families

Catalyst currently uses a small set of distinct symbol responsibilities:

1. **InstrumentGlyph** - recurring application actions and compact controls.
2. **AnalyticalGlyph** - analytical identity such as claim, assumption, hypothesis, question, entity, event, or generic thought where that meaning is actually portrayed.
3. **OutlineGlyph** - specialized small structural marks retained where needed; the mounted Analysis flow currently uses it primarily for the generated Map's structural root rather than a metadata-heavy Outline vocabulary.
4. **CatalystMark / specialized source marks** - brand and source/annotation-specific semantics.
5. Direct SVG geometry used for generated Map lines or isolated research/prototype surfaces.

Action symbols and analytical-meaning symbols must remain separate. Selection/focus styling must not impersonate analytical importance.

## Current Outline/Map semantics

The compact Outline uses InstrumentGlyph controls for Rename, Add child, Add sibling, reorder, Indent/Outdent, Show on map, and Delete/Trash. Analytical role/confidence are compact metadata badges, not a large icon rail.

The generated Map is read-only for structure and is not a derived-output export surface.

The user-facing product does not currently expose export controls in Reader, Outline/Map, or Methods.
## Retired semantics that must not return

- Back/Forward/Home glyphs from the old Working Picture/context-navigation grammar are not current main-product navigation requirements. Remaining uses in `DeskPrototype` or `PortrayalLab` are prototype/research context.
- Assessment is not a Catalyst product surface. Do not reserve or reintroduce Assessment toolbar/search/icon semantics from historical documents.
- The standalone Evidence workspace is removed. Evidence/source concepts may still have provenance or Reader-local marks, but they must not recreate an Evidence navigation destination.
- Techniques are their own workspace and should not return as persistent Outline metadata/icon rows.
- An X means close/dismiss, not delete data or break a relationship.

## Stable action distinctions

- `delete` / trash semantics are destructive and must remain visually distinct from close/dismiss.
- `open`/load file actions are distinct from source-return/provenance navigation.
- `map` means reveal/show the authored thought on the generated Map; it does not grant structural editing authority to the Map.
- child/sibling/indent/outdent/reorder symbols describe Outline structure only and do not imply semantic analytical relationships.

## Direct SVG exceptions

Direct SVG is appropriate for generated Map relationship/branch geometry and isolated research/prototype rendering. Ordinary product controls should continue to use the centralized Catalyst symbol registry rather than starting parallel icon libraries.

`WorkingPictureWorkspace.tsx`, `DeskPrototype.tsx`, and `PortrayalLab.tsx` retain historical names/uses. Their presence does not make Working Picture or prototype navigation current product architecture.
## Current cleanup priorities

1. Keep one semantic meaning per recurring action.
2. Audit icon-only controls for accessible names, tooltips, and usable hit targets.
3. Remove dead symbol wrappers only after checking mapped/runtime-selected uses as well as literal JSX calls.
4. Prefer deleting obsolete alpha-era icon semantics over documenting them as active vocabulary.
5. Re-run `npm run icons:audit` after Reader, Outline, Map, Techniques, session-toolbar, or annotation-toolbar changes.

## Validation rule

Generated registry counts are descriptive, not architectural authority. A glyph remaining in `CatalystSymbols.tsx` does not restore a retired feature. Current product authority comes from `CURRENT_ARCHITECTURE.md`, newer ADRs, and mounted call sites.

An earlier full `npm run check` baseline passed on 2026-09-15, but the current aggregate gate is red on stale regression expectations documented in `release-readiness.md`. Iconography-specific changes should additionally run `npm run icons:audit` and the iconography semantic regression test.

## Fresh inventory findings - 2026-09-15

`npm run icons:audit` currently reports 43 InstrumentGlyph variants, 8 OutlineGlyph variants, and 4 dynamic glyph call sites.

- `back` is used by the focused Methods editor.
- `forward` has no current call site.
- OutlineGlyph currently has no call sites; all registered variants are cleanup candidates unless another active surface still resolves them dynamically.
- Several InstrumentGlyph registry entries have zero literal/mapped use, including historical search/relation/fit/center/method/open/annotations entries. Treat them as cleanup candidates only after checking unresolved dynamic paths.
- AnalyticalGlyph registry counts are not sufficient to infer dead code because current analytical glyph selection is dynamic in some surfaces.

These are release-cleanup observations, not permission to restore the retired UI that originally used the symbols.
