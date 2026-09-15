# Catalyst Navigation Grammar v0.1

Status: **historical 0.6.3-alpha.3 interaction contract; retired controls are not current requirements**  
Scope: **Issue → Working Picture → Object → Source/Submap navigation**  
Companions: `working-picture-model-v0.1.md`, `portrayal-standard-v0.1.md`

## 1. Purpose

Catalyst must stop requiring the analyst to manually pilot a viewport around an effectively infinite diagram.

Navigation should preserve a stable sense of place and use a small, predictable vocabulary.

> **The analyst navigates analytical places, not coordinates.**

## 2. Navigational hierarchy

Primary hierarchy:

```text
ISSUE
  ↓
WORKING PICTURE / MAP
  ↓
OBJECT / EVIDENCE
  ↓
SOURCE OR SUBMAP WHEN OPENED
```

A future Brief/Product is a sibling representation derived from the Issue, not another depth level inside the Working Picture.

## 3. Core actions

Catalyst should distinguish these operations:

### Inspect

Meaning: “show me more about this without moving my world.”

- single click/tap or keyboard selection;
- opens/updates inspector;
- does not relayout;
- does not change focal Issue;
- does not imply importance.

### Focus

Meaning: “make this the local center/context of the current picture.”

- Enter / explicit focus action / deliberate second gesture;
- preserves a return state;
- may animate the viewport/local composition;
- must not rewrite analytical relationships or structural hierarchy.

### Open

Meaning: “enter the underlying source or subordinate analytical place.”

Examples:

- open source crop → exact PDF/source location;
- open submap → enter that saved portrayal;
- open embedded timeline/map projection → expand that projection.

Open changes navigational place and must create a reversible history entry.

### Back

Returns to the exact prior analytical place, including meaningful view state.

### Home

Returns to the current Issue's default Working Picture overview.

### Escape / Up

Closes transient UI first; when nothing transient is open, moves one navigational level outward where appropriate.

## 4. Click must not do everything

A single click must not simultaneously:

- select;
- center;
- zoom;
- open details;
- relayout;
- make the object the root.

Alpha.1/alpha.2 navigation became difficult partly because these concepts were too closely coupled.

## 5. View history

History should preserve **places**, not raw pixel coordinates alone.

A history entry may include:

- Issue id;
- picture/map id;
- focus occurrence/object;
- semantic zoom level;
- viewport anchor/scale;
- active overlay/layer where material to interpretation;
- open source and source location;
- inspector target where useful.

Back/Forward should reconstruct the analytical context the user perceived.

## 6. Orientation-preserving motion

Motion is used only where it communicates navigational continuity.

Appropriate uses:

- refocusing from one landmark to another;
- entering/leaving a subordinate map;
- moving from a source crop to the exact source location;
- changing semantic zoom level.

Avoid:

- decorative object motion;
- constant physics animation;
- unrelated reflow;
- springy UI effects that make analytical coordinates appear unstable.

Reduced-motion mode must preserve all navigational meaning without animation.

## 7. Direct manipulation shortcuts

Fast thinking requires keyboard/direct creation independent of toolbar travel.

Target grammar:

- `Enter` → sibling thought/observation where structurally appropriate;
- `Tab` → child branch;
- double-click empty local space → free occurrence;
- drag branch affordance → create structurally connected occurrence;
- typing with a suitable creation affordance active → immediate capture;
- `Esc` → cancel current authoring/connection operation.

Exact shortcuts may be adjusted for platform/accessibility conflicts, but the principle is mandatory: the toolbar is discoverability, not the fluent workflow.

## 8. Focus vs authored structure

Refocusing is a portrayal/navigation operation.

It must not:

- change structural parents;
- convert semantic relationships;
- move manually placed objects permanently merely to center the focus;
- promote an object to analytical importance.

If a refocused view uses a temporary local arrangement, that arrangement is view state distinct from authored map placement.

## 9. Submaps and portals

A subordinate Map/Working Picture is represented as a portal/landmark, not a generic file card.

At working scale it should provide a structural preview or representative visual.

Opening a portal:

- transitions into the subordinate portrayal;
- preserves the parent return point;
- reuses shared analytical objects rather than copying them;
- may retain a compact path indicator.

## 10. Breadcrumb/path policy

A textual path may be shown when useful, but it is secondary to stable spatial transition.

Example:

```text
Facility X / Actors / Organization Y
```

Keep it compact. Do not turn navigation into a file-browser hierarchy if the underlying relationship is not truly hierarchical.

## 11. Navigation by recognition

The interface should support finding places through:

- stable visual landmarks;
- source images/crops;
- structural map previews;
- familiar branch shapes;
- contextual search results that show visual destination previews;
- recent/back history.

Search should navigate to a known analytical object/place without forcing the analyst to understand graph topology.

## 12. Zoom policy

Manual zoom remains available but is not the primary navigation mechanism.

The user should not need to:

- zoom out repeatedly to find their location;
- pan long distances to reach routine destinations;
- use a minimap as the only orientation mechanism.

Focus/Open/Home/Back should cover normal movement.

## 13. Minimap policy

A minimap may be provided for large authored pictures, but it is supplemental.

It must not become compensation for an otherwise disorienting information architecture.

Prefer structural/territorial overview over literal miniaturization of every object.

## 14. Source navigation

Source navigation is first-class.

From an evidence observation, one action should open the exact source location when available.

Back must return to the same Working Picture location and selection state.

Source and Analysis navigation histories may remain pane-scoped where that prevents one pane from destroying the other's context, but cross-pane trace/open actions should still be reversible as one coherent analyst action.

## 15. Collapse/generalization navigation

Collapsed structure should reveal its continuation without forcing expansion.

The user can:

- inspect aggregate boundary information;
- temporarily peek;
- expand locally;
- open a subordinate map where the structure has been decomposed.

Expansion should affect only the local territory by default.

## 16. Keyboard/accessibility model

Every spatial operation requires a non-spatial counterpart.

The keyboard model must expose:

- current Issue;
- current picture;
- structural parent/children;
- semantic relationships;
- evidence/source links;
- sibling/local navigation;
- open/inspect/focus actions;
- active overlays/filters.

Spatial position enhances cognition but is never the only route to analytical content.

## 17. Navigation acceptance tests

Alpha.3 should be rejected if a normal user cannot do these without hunting:

1. Return to the Issue overview from anywhere.
2. Inspect an object without moving the map.
3. Focus an object intentionally.
4. Open evidence in the original source and return to the same analytical location.
5. Enter and leave a subordinate map.
6. Create a child thought without using a toolbar menu.
7. Understand whether missing content is collapsed, filtered, generalized, or simply outside the current picture.
8. Recover from accidental navigation with Back.
9. Navigate without dragging the viewport for routine operations.
10. Complete the above with keyboard-only controls.
