# Interaction spine — bounded analytical desk — 2026-09-11

## Purpose

This pass resolves the remaining high-level interaction questions for a disposable Catalyst cognitive-architecture prototype. It does not specify production styling or implementation.

The target is a surface that lets the analyst work before they understand Catalyst's ontology.

## 1. Boundedness: bounded place, not fixed-size page

The Working Picture should be **topologically bounded but metrically soft**.

That means:

- every Working Picture is a distinct analytical place with its own local geography;
- `Home` has a meaningful answer: the whole current picture;
- the coordinate extent may grow as the analyst places material;
- material from other Working Pictures does not live several kilometers away on the same plane;
- when one picture becomes cognitively dense, the preferred operation is to create/enter a subpicture or alternate projection rather than continue expanding indefinitely.

This avoids two bad extremes: a hard fixed board that forces constant resizing and an endless universe that turns navigation into camera management.

The surface may show a quiet working frame/territory so the analyst has an external reference frame, but that frame is not an analytical boundary or semantic container by itself.
Research basis:

- Rooms: multiple persistent workspaces reduce window/context thrashing.
- Allume: nested boards and deliberate rejection of endless canvas zooming.
- SAGE3: infinite canvas required bounded focus viewports and additional navigation aids; authors also observed window inflation over time.
- Data Mountain: passive spatial landmarks and user-authored placement supported spatial retrieval.

## 2. Staging: a retractable edge shelf, not a permanent inbox sidebar

Incoming material needs a low-commitment place before the analyst knows where it belongs.

The strongest pattern is a **retractable edge shelf** attached to the current issue/workspace, containing unplaced or recently captured material.

Properties:

- capture can land there without a classification dialog;
- the shelf is visible when invoked, when something new arrives, or when unresolved material requires attention;
- otherwise it collapses to a quiet edge affordance/count rather than consuming a permanent column;
- material leaves the shelf by direct placement onto the Working Picture;
- placing an item does not require assigning an analytical type beyond what is inherently known (for example: PDF, image, captured source region, plain thought);
- the shelf can preserve loose recency/order but should not imply analytical priority.

This is a staging state, not a folder and not an analytical category.Research basis:

- Malone and Mander/Salomon/Wong: piles complement formal filing because they support fast, informal management and reminding.
- Gstell (CHI 2026): pile-like short-term storage combined with structured long-term storage accommodated evolving relevance and emerging structure.
- Allume: current Inbox is an edge-attached capture location for cards that have not yet been placed into board structure.

## 3. Documents: one identity, progressively richer representations

A source should not belong to a separate application mode.

The same placed source identity can have several representations:

- **Overview landmark:** recognizable cover/page/visual signature, compact enough to orient by;
- **Working landmark:** source thumbnail/page/region with enough native visual content to compare and recognize;
- **Quick look:** transient enlarged context without changing analytical place;
- **Open source:** full reading/annotation representation for sustained work;
- **Return:** exact restoration of prior Working Picture and object location.

Opening is deliberate task escalation, not automatic zoom behavior.

A source remains part of the Working Picture while its open representation is active; the reader is a focused view of that placed source, not a separate universe.Research basis:

- Data Mountain directly tested a pattern where a placed page came forward into a higher-resolution preferred viewing position and then returned to its last known spatial location.
- LiquidText and MarginNote preserve navigable correspondence between extracted material and source context.
- Catalyst's existing semantic-zoom research already requires representation changes rather than simple uniform scaling.

## 4. Source-region extraction: pull evidence out without severing it

A signature gesture should be possible from the open source representation:

**select region → drag/capture to Working Picture → anchored source-region landmark**.

The placed region is not automatically “Evidence.” Initially it is a captured source observation/region with exact anchor and source identity.

The analyst can later use it as evidence, attach an observation, quote/summarize/translate it, or leave it as a visual source landmark.

The visual form should prefer the actual crop or page fragment when meaningful. Text transcription is inspectable detail, not a replacement for the source appearance.

This preserves the distinction between:

- where in the artifact the material came from;
- what transformation was applied;
- how the analyst later uses it in reasoning.

## 5. Selection and inspection: selection must remain cheap

The current runtime turns a simple click into a large inspector. The next prototype should separate registration from deep inspection.Candidate interaction grammar:

- **Click/tap:** select/register only; neutral visual registration, no semantic emphasis.
- **Selected state:** reveal only a few object-local actions appropriate to that object, plus a `…` escape hatch; do not open a permanent panel.
- **Quick Look:** a transient expanded view invoked deliberately (for example Space/press-and-hold or an explicit local affordance); dismissing it restores the unchanged desk.
- **Open/Focus:** Enter or a visible object-local action; double-click may remain an accelerator on desktop but should not be the only discoverable path.
- **Inspect:** explicit escalation to provenance/history/metadata/full analytical detail; may use a panel or focused surface because the user deliberately requested it.
- **Escape/Back:** unwind the most recent representational escalation before changing analytical place.

This keeps the common action—selecting something while thinking—low cost.

Research basis:

- Local Tools demonstrated that controls can be placed with or near the work instead of requiring continual palette travel.
- Toolglass/Magic Lenses demonstrated context-dependent views and controls without dedicated permanent screen space.
- The existing Catalyst navigation grammar already distinguishes Inspect, Focus, Open, Back, and Home; the change is to make the cheapest state substantially cheaper.

## 6. Organization: geometry is secondary notation until promoted

Dragging objects near one another creates **no semantic relationship**.

The analyst may use:

- proximity and whitespace;
- loose piles/overlap;
- rough rows or columns;
- territories/regions;
- local visual alignment;
- temporary stacks;
- branch structures.
## 7. Promotion: recognize structure, never silently convert it

Catalyst may detect that a layout resembles a pile, row, cluster, enclosure, or branch, but recognition is not authorship.

The system may offer a quiet local promotion action such as `Make pile`, `Make territory`, `Make branch`, or `Make subpicture`. It must not silently create membership, hierarchy, or semantic links because objects happen to be near each other.

This follows directly from spatial-hypertext research: people can perceive useful implicit organization that remains intentionally ambiguous, while formalization is valuable only when the additional structure becomes useful enough to justify its cost.

Promotion therefore has three rules:

1. **analyst-confirmed** — no hidden conversion of geometry into analytical truth;
2. **non-destructive** — the current spatial arrangement survives promotion unless the analyst deliberately chooses a new layout;
3. **reversible at the portrayal level** — removing a pile/territory/branch view does not erase the underlying analytical objects or their history.

Research basis: VIKI/Shipman/Marshall on implicit spatial structure, emergent structure, and incremental formalization.
## 8. Promotion targets are different kinds of commitment

A promotion menu should not present several visual styles for the same thing. Each target adds a different degree or species of structure.

- **Pile / stack:** explicit membership only. It means “I am treating these together for now.” It does not assert why.
- **Territory / region:** explicit local grouping plus a visible area identity. A territory may receive a short analyst label, but containment alone is not a semantic claim about every member.
- **Row / column / alignment:** portrayal structure only. Useful for comparison, chronology-in-progress, or visual bookkeeping without creating domain semantics.
- **Branch:** explicit structural organization. Parent/child here means “organized under” rather than a world relationship such as causes/supports/owns.
- **Subpicture:** explicit scope change. A selected body of material becomes a bounded analytical place reachable from the parent picture without becoming a disconnected duplicate universe.
- **Semantic relation:** strongest local commitment. The analyst explicitly asserts a typed analytical/world relation; this should use the reasoning/relationship model, not be synthesized from layout.

This is a commitment ladder rather than a single `group` primitive.
## 9. Subpictures: preserve identity and leave a landmark behind

Creating a subpicture should not cut objects out of the parent's analytical record or duplicate their identities.

Candidate behavior:

- analyst selects a coherent local body of material and chooses `Make subpicture`;
- the child opens with those same analytical identities represented as child map occurrences;
- the parent retains a compact subpicture landmark/portal in the original neighborhood;
- entering the child changes analytical place deliberately; Back returns to the exact parent location;
- the parent portal can portray a small recognition-rich preview or silhouette rather than a generic folder icon;
- edits to an underlying object remain edits to the same object, while parent and child placement remain separate portrayal state;
- dissolving the subpicture removes the scope boundary/portal, not the underlying objects.

This extends the existing Catalyst rule that one analytical object may have multiple map occurrences. It also matches the practical value of nested whiteboards in current systems without turning nesting into data duplication.
## 10. Layout assistance must preserve authored geography

Promotion may add structure without relocating material.

Default behavior:

- `Make pile` records membership around the objects where they already are; collapsing the pile may hide internal geography temporarily, but expanding restores it exactly.
- `Make territory` draws/creates a local enclosing portrayal around the current arrangement rather than repacking it.
- `Make branch` overlays an explicit structural branch using current positions as the starting geometry; automatic tidy-up is a separate analyst action.
- `Make subpicture` leaves a portal/landmark where the selected body was organized and gives the child its own portrayal state.
- semantic relations draw only the asserted relation; they do not invoke a global layout.

Any automatic alignment, distribution, tree layout, clustering, or compaction is an explicit reversible command with preview/undo, never a background maintenance behavior.

A layout suggestion may be smart. A layout mutation must be authored.
## 11. First-prototype interaction sequence

The first disposable prototype should prove one complete analytical loop rather than expose every Catalyst capability.

Suggested test sequence using a real PDF/source:

1. Open an issue/Working Picture with almost no persistent chrome.
2. Invoke the edge shelf and bring in one source document without classification.
3. Place that source on the desk as a recognizable landmark.
4. Quick Look it, dismiss, and verify exact return.
5. Open it for sustained reading, capture two exact source regions, and return to the desk.
6. Place the regions near a plain thought without creating semantic relations.
7. Loosely rearrange the three items; no ontology dialog appears.
8. Promote them to a pile/territory and verify geography survives.
9. Promote an explicit structural branch only when the analyst chooses to organize the thought.
10. Create a subpicture from part of the arrangement; enter it and Back to the exact parent place.
11. Explicitly inspect provenance for one captured region, then Escape back to the unchanged desk.
12. Home returns to a recognizable whole-picture overview.

If this loop is not materially calmer and more spatially memorable than alpha.3, richer semantics should not be added.
## 12. Prototype acceptance criteria

The prototype is successful only if an analyst can answer, without reading much interface text:

- What material am I currently working with?
- Where did this excerpt come from?
- Which groupings are merely provisional?
- Which structure did I explicitly author?
- What analytical place am I in, and how do I get back?
- Can I recognize the desk after opening/closing detail views?

Observe at minimum:

- number of persistent controls visible before work begins;
- number of modal/dialog decisions required during capture and placement;
- whether source → region → desk → source recovery is one obvious path;
- whether selection changes the entire screen or only the selected object locally;
- whether layout remains stable after promotion and navigation;
- whether users mistake spatial proximity/pile/territory for semantic assertion;
- whether users can return to a previously placed item from memory.

This is a cognitive-architecture gate, not a styling test.