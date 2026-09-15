# Portrayal Lab milestone M1 — behavioral testability

Date: 2026-09-11  
Status: pre-alpha.4 laboratory milestone  
Catalog: `portrayal-v0.1` / `0.1.0-lab.3`

## Purpose

This milestone closes four behavioral gaps found during the first implementation review of the Portrayal Lab. It does not declare the portrayal language accepted. It makes the Lab trustworthy enough for a first human/browser evaluation pass.

## Changes

### 1. Authored semantic zoom

The four portrayal scales now resolve through explicit profiles in `src/portrayal/semanticZoom/levels.ts`:

- 16 px — `overview`: minimal core, zero modifiers, no labels;
- 24 px — `compact`: reduced core, one modifier, no labels;
- 32 px — `working`: working detail, two modifiers, concise labels;
- 48 px — `inspect`: landmark detail, two modifiers, full label plus referent cue.

P7 no longer suppresses the scale-authored labels that distinguish working/inspect portrayal from overview/compact portrayal.

### 2. Neutral selection registration

Selecting a landmark now passes an explicit `selected` interaction state through the same portrayal resolver used by normal rendering. The selected object receives a neutral registration treatment and the inspector trace reports the selected state. Selection does not change analytical salience.

### 3. P8 return-memory timing

P8 now has explicit phases:

1. study — the target is neutrally highlighted and no timer runs;
2. masked — the picture is hidden and no timer runs;
3. search — reveal starts the timer;
4. result — the first selected object records accuracy and return time.

This prevents study/masking time from contaminating the re-find measure.

### 4. Candidate-isolated result summaries

Confusion matrices, candidate accuracy, and median response time are computed only from the currently selected candidate family. Station run/correct counts are also candidate-specific. Results from one symbol family no longer contaminate another family’s summary.

## M1.2 candidate contrast and catalog isolation

Live browser comparison found Concrete A and Hybrid A too similar at compact scale because Hybrid A differed only by a tiny subordinate trace. Lab.3 strengthens Hybrid A with a persistent analytical trace grammar while preserving the familiar referent core. Notational A remains the deliberately learned low-concreteness comparison.

Because candidate geometry changed, result summaries now filter by both candidate family and catalog version. Older locally stored runs remain stored but do not enter current accuracy, median-time, or confusion summaries.

The Lab also accepts reproducible review parameters in the normal URL query string before the hash route: `station`, `family`, `scale`, and `theme`.

## Validation completed

The milestone has now been validated on the Windows development machine with the locked project dependencies installed.

Passed:

- full `npm test` regression suite;
- full `npm run build` (`tsc -b` + Vite production build);
- live Vite rendering at `#/portrayal-lab` inspected through Opera Browser Connector;
- P1 visual inspection confirming recognition stations no longer inherit incidental connection linework.

The production build currently emits Vite's existing large-chunk warning and an EmbedPDF browser-compatibility warning for `crypto`; neither failed the build. These are build-performance/dependency follow-ups, not Portrayal Lab acceptance failures.

## M1.1 protocol-validity correction

The first live-browser pass exposed an experimental-design defect rather than a rendering defect: P1–P7 were visible before `Start test`, and the reference strip remained available during timing. A tester could therefore pre-locate the target or use the legend before/during a measured run.

M1.1 corrects that bias:

- ordinary timed stations now use a two-step `mask -> reveal + timer` start;
- the reference strip is removed for the whole active run;
- family/station/scale/theme controls lock until the run ends;
- pure recognition/discrimination stations no longer receive unrelated underlay linework;
- P5 and P6 retain intentional clutter/mixed-media structure.

These are protocol invariants, not optional presentation details, and are now enforced by `scripts/test-portrayal-lab.mjs`.

## Next gate

Continue live-browser inspection of P1–P8, with special attention to:

- P7 continuity across all four authored scale levels;
- selected-vs-attention/lens distinction in P6;
- P8 study → mask → reveal → re-find timing;
- family switching with isolated result memory;
- legibility and confusion at 16/24 px.

Only after this pass should the Lab be used to choose or revise a candidate family for alpha.4.
