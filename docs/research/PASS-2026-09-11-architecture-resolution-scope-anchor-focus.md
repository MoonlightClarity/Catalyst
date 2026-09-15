# Architecture resolution — structural scope, source anchors, durable focus — 2026-09-11

Status: architecture research only. No GUI manipulation and no product code changed.

## Question 1 — does structure attach to identity or occurrence?

The default Working Picture answer should be **context-scoped membership**, normally realized through occurrences rather than globally mutating an identity.

Reason: one durable identity may appear in several analytical contexts and play different organizational roles. Putting the occurrence of Source S into a pile or branch in Picture A must not automatically put its occurrence in Picture B into the same structure.

Trilium's note/branch model supports this direction: branch records place one note identity under different parents without duplicating the note. Catalyst generalizes the principle beyond hierarchy into spatial and bounded-picture organization.

Therefore:

- pile, territory, local sequence, branch portrayal, and subpicture membership are scoped to an analytical context;
- the membership record should identify both the durable member identity and the context-local occurrence/membership instance;
- moving or reorganizing one occurrence must not globally rewrite other occurrences;
- a deliberately global classification/taxonomy, if Catalyst later needs one, should be a different explicit record species rather than an accidental consequence of local branch organization.

This avoids a hidden-global-structure failure analogous to Freeplane's hidden-parent problem.

## Semantic relations remain identity-level

A claim such as `supports(A,B)` or `same-entity-as(A,B)` is about analytical objects, not the coordinates of their cards in one picture.

It may have local portrayals attached to occurrences, but its truth-bearing endpoints should remain durable identities unless the relation is explicitly about a particular occurrence or portrayal.
## Question 2 — is a source region an identity or only an anchor?

The cleanest model separates three layers:

1. **Source Identity** — the durable artifact/version being cited or inspected.
2. **Source Anchor** — a precise address into that source: page/region/timecode/cell/record/span plus version/fingerprint context.
3. **Anchored Analytical Identity** — an excerpt, captured region, observation, or other reusable object that refers to the source through that anchor.

A raw selection made only to navigate does not need to become a durable Analytical Identity. It can remain an ephemeral anchor.

Once the analyst places, annotates, reuses, names, relates, or derives from that selection, it becomes useful to give the captured region/excerpt its own durable identity while preserving the anchor.

This avoids two bad extremes:

- treating every transient text selection as a permanent object;
- treating reusable evidence fragments as mere canvas crops with no identity/history.

A visual crop is portrayal. The exact anchor is provenance. A durable excerpt/region object is identity. These can coincide in one gesture but should remain distinguishable in the model.

## Extraction versus observation

Capturing a region should not automatically mean “this is evidence” or “this is the analyst's observation.”

A captured source-region identity can remain close to the artifact. An analyst observation or interpretation derived from it should be a separate identity with provenance back to the region/source anchor.

This distinction preserves the source/analyst boundary and makes later disagreement or reinterpretation auditable.
## Question 3 — when does Focus Context become durable?

Ordinary focus should remain session/restoration state rather than analytical content. Persisting every pan, zoom and selection as durable domain state would make navigation noise indistinguishable from authored analysis.

Use a promotion rule similar to the wider commitment gradient:

- transient pan/zoom/selection/open state = Focus Context;
- crash/session recovery may persist the latest Focus Context operationally;
- an analyst explicitly choosing `save view`, `bookmark context`, or equivalent promotes selected focus/projection parameters into a durable **Saved View / Viewpoint** record;
- a Saved View references identities/contexts but does not become a semantic assertion about them.

This makes recoverability compatible with a clean analytical record.

## Return tokens

Entering a source, subpicture, or alternate projection should push a return token containing enough context to reverse the representational escalation: originating picture, focal occurrence, viewport neighborhood, scale, projection/lens and relevant local fold/filter state.

Return history is navigation state. A deliberately saved viewpoint is authored state. They should not be the same record merely because both can restore a viewport.

## Resulting scope rule

A useful default architecture is:

- identity is globally durable;
- provenance anchors are source/version specific;
- Working Picture structure is context scoped;
- semantic relations are identity scoped;
- portrayal is occurrence scoped;
- focus is session/context scoped until explicitly promoted to a Saved View.

This is a stronger formulation of the six-way separation because each species now has a natural scope.