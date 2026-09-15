# Hands-on comparator pass — Freeplane 1.13.3

Status: hands-on research only; no Catalyst production UI code changed.

## Why Freeplane matters

Freeplane is useful less as a visual target than as a mature example of a structure-first thinking environment that keeps hierarchy, outline, spatial placement, folding, notes, details, and cross-links in one map model.

The current upstream build was used rather than Ubuntu's much older packaged release.

## Observed interaction architecture

Freeplane keeps the map and outline synchronized. Selecting or expanding an item in the outline selects the same object on the spatial map rather than opening a separate document/editor mode.

The outline therefore functions as an alternate navigator/projection over the same object identity. It does not replace the map as the cognitive surface.

This is strongly aligned with Catalyst's requirement that alternate views remain projections over one analytical record rather than competing top-level universes.

Folding is local and structural. A branch can become visually compact without destroying its identity or forcing a global mode change.

The map can therefore expose structure at several densities while preserving the analyst's position and nearby landmarks.
## Free placement: useful interaction, dangerous semantics

Freeplane supports free/floating nodes created directly in open map space and existing nodes can be converted into free-positioned nodes.

Hands-on testing confirmed that this feels materially different from ordinary branch construction: a user can put an item somewhere first rather than immediately arranging it as a visible branch.

However, Freeplane's own guide makes clear that a free node is still invisibly connected to the root or another parent. The visual independence therefore does not mean structural independence.

Catalyst should copy the low-commitment spatial interaction but reject the hidden-parent semantics. A placed object that has no authored membership or relation must be genuinely uncommitted, not secretly attached to a root merely because the renderer requires a tree.

This sharpens an existing Catalyst distinction:

- placement is portrayal/cognitive state;
- branch membership is explicit structural state;
- analytical relationship is a still higher semantic commitment.

Those must remain separately inspectable and separately editable.

## Richness around a node

Freeplane nodes can carry notes, details, attributes, images, links, icons, formulas, clouds, ordinary tree edges, and explicit arrow links.

This demonstrates that a compact map object can act as a locus for deeper material without displaying all of that material permanently.

The useful lesson for Catalyst is progressive disclosure around a stable landmark. The wrong lesson would be to overload every Working-Picture object with visible badges and metadata.
## Cognitive-load observations

Freeplane also shows the cost of accumulated capability. The default application exposes many toolbar controls, styles, icons, formatting operations, and map-specific commands simultaneously.

Its map can remain cognitively coherent because the analytical material itself still occupies the main surface, but the chrome is much denser than Catalyst should tolerate for ordinary analytical work.

The synchronized outline is valuable when deliberately exposed, yet making it permanently dominant would recreate a split-screen bookkeeping problem. Catalyst should treat such projections as summonable navigation aids rather than permanent territory.

Freeplane's branch grammar is also too structurally privileged for Catalyst. Tree construction is extremely efficient once hierarchy is known, but the map model naturally encourages parent/child commitment earlier than an investigative workspace should.

## What Catalyst should carry forward

1. One object identity across spatial and outline projections.
2. Local folding/compression rather than global mode switching.
3. Direct creation in open space as a low-friction cognitive act.
4. Deep details attached to a stable landmark but hidden until needed.
5. Explicit connectors distinct from ordinary structural branches.
6. Stable spatial positions that are not continuously force-laid out.

## What Catalyst should not inherit

1. Hidden hierarchy beneath apparently free placement.
2. A tree root as the mandatory ontological center of all material.
3. Permanent high-density toolbars and formatting chrome.
4. Styling controls that compete with analytical semantics.
5. Treating every free spatial object as merely a special case of a node.
## Effect on the current C+D hypothesis

The Freeplane pass strengthens the anchored-material + bounded-subpicture direction rather than replacing it with a mind-map architecture.

Its strongest transferable mechanism is **same-object, multiple-representation navigation**: map and outline are coordinated views of one object, and fold state changes density without changing conceptual location.

Its strongest warning is equally important: visual freedom can conceal structural commitment. Catalyst must make the commitment gradient real in the data model, not merely create a canvas that looks informal while silently imposing hierarchy.

For the next prototype, free placement should therefore create only occurrence/placement state. Promotion to pile membership, branch membership, subpicture scope, or semantic relation must remain separately authored and visible on inspection.

Freeplane is now sufficiently studied for this research stage. The next comparator should stress a different axis rather than repeat mind-map mechanics: source/document continuity, transclusion/multiple occurrence, or local-first knowledge navigation.
