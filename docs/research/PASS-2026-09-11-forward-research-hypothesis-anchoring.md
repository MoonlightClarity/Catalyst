# Forward comparator pass — Hypothesis / W3C Web Annotation anchoring — 2026-09-11

Status: source/code research only; no Catalyst GUI manipulation or product code.

## Why this is a distinct comparator

Hypothesis is not being studied here as another note application. It is a mature FOSS annotation client whose anchoring subsystem addresses a Catalyst-critical problem directly: preserving a reference to an exact segment of a source even when the rendered document representation is not stable.

The W3C Web Annotation Data Model provides the broader interoperable model for targets, selectors, and resource states.

Sources:
- https://github.com/hypothesis/client
- https://github.com/hypothesis/client/blob/main/src/annotator/anchoring/html.ts
- https://github.com/hypothesis/anchoring-test-tools
- https://www.w3.org/TR/annotation-model/

## Mechanism 1 — one target can carry multiple selectors

The W3C model explicitly permits multiple Selectors describing the same segment so a consuming agent can maximize the chance of rediscovering it later.

This is a stronger anchoring model than storing one character offset or one bounding rectangle and assuming it remains valid forever.

For text, complementary selector types include:
- `TextPositionSelector` — start/end offsets in normalized text;
- `TextQuoteSelector` — exact selected text plus optional prefix/suffix context;
- structural/range selectors where the representation supports them.

Catalyst implication: an evidence anchor can be a bundle of independently useful locators rather than one fragile coordinate.

## Mechanism 2 — Hypothesis actually performs ordered fallback

Current Hypothesis client code collects Range, TextPosition, TextQuote, and media-time selectors, then attempts increasingly flexible anchoring paths. Position/range resolution is checked against the stored exact quote when one exists; if stricter approaches fail, quote anchoring can still recover the target.

This is implementation evidence for a Catalyst anchor-resolution pipeline rather than a single exact lookup.

The system should distinguish:
- stored anchor description;
- current resolution result;
- confidence/quality of that resolution;
- source version against which the anchor was originally authored.

A successful fuzzy relocation is not identical to an unchanged exact anchor and should be inspectable as such.

## Mechanism 3 — quote context and resource state address different failure modes

`TextQuoteSelector` stores the selected text and may also store surrounding prefix/suffix context to disambiguate repeated text. `TextPositionSelector` is compact but the W3C specification explicitly warns that it is brittle when a resource changes.

The Web Annotation model separately defines Resource State so an annotation can describe the representation/version of a changing resource that it intended to target.

Catalyst should therefore keep two questions separate:
1. What segment did the analyst select?
2. Which representation/version of the source was that selection made against?

A source hash/version identity does not replace a segment selector, and a selector does not replace source-version identity.

## Mechanism 4 — PDF anchoring exposes representation-dependence

Hypothesis' own PDF issue history documents a key limitation: text quote/position selectors can depend on PDF.js text extraction, whose output can change across viewer versions and may be poor for equations or other non-standard text.

The project consequently explored/captured more native PDF location information, including page numbers and proposals for page-coordinate regions.

Catalyst implication: provenance anchors must be format-aware. A generic extracted-text anchor is valuable redundancy, but evidence-grade PDF anchoring should also preserve native page/region information when available.

## Mechanism 5 — anchoring quality needs explicit testing

Hypothesis maintains separate anchoring-test tools that replay real public annotations against HTML/PDF client environments to detect regressions caused by anchoring logic or viewer changes.

This is a strong engineering lesson for Catalyst: provenance correctness should have fixture-based regression tests using real source artifacts and stored anchors. The test should verify not only that an annotation resolves, but that it resolves to the intended segment and reports degraded/fuzzy recovery honestly.

Hypothesis issue history also shows two practical risks:
- fuzzy quote recovery can be computationally expensive in long documents;
- fuzzy matching can potentially choose a lookalike passage when the original has changed.

Catalyst should prefer deterministic/native selectors first, use fuzzy recovery as a fallback, and never convert a low-confidence recovery into silent provenance certainty.

Source:
- https://github.com/hypothesis/anchoring-test-tools

## What Catalyst should inherit

1. Multiple complementary selectors for one source segment.
2. Separate source/version state from segment-location state.
3. Ordered anchor-resolution fallback with validation against redundant selectors.
4. Format-native location data where available, especially PDF page/region coordinates.
5. Explicit resolution status/confidence when recovery is fuzzy or degraded.
6. Real-artifact regression fixtures for provenance anchoring.

## What Catalyst should not inherit

1. Treating a successful fuzzy match as equivalent to an unchanged exact anchor.
2. Depending on one viewer's extracted-text coordinates as the sole PDF provenance record.
3. Assuming a URL alone identifies the exact source representation that was analyzed.
4. Using generic character offsets for non-text media when native segment models exist.
5. Letting anchor-recovery computation block the analytical surface on large documents.

## Net architectural effect

This pass upgrades source anchoring from an implementation detail to an explicit part of Catalyst's analytical record.

A source-derived object should conceptually carry:
- durable source identity;
- source representation/version identity;
- one or more segment selectors/anchors;
- the transformation that produced the analytical object, if any;
- current anchor-resolution status;
- the object's analytical identity and occurrence placement, which remain separate.

This fits the prior Zotero result while making it substantially more rigorous. `Go to Page` is the interaction outcome; redundant selectors, version state, and tested resolution behavior are part of the machinery required to make that outcome trustworthy over time.

## Next evidence gap

The remaining forward-research gaps are narrower. Highest-value candidates are provenance-preserving transformation pipelines and multi-user conflict semantics. Do not return to generic note/canvas products unless they add evidence on one of those mechanisms.
