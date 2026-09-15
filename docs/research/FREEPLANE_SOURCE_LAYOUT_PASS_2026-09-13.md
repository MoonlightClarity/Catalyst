# Freeplane source layout pass — 2026-09-13

Status: bounded source-first comparator for Catalyst Working Picture portrayal. Research only; no Catalyst product code or live UI was touched.

## Source pin and scope

Freeplane repository: `https://github.com/freeplane/freeplane`
Branch inspected: `1.13.x`
Commit inspected locally: `3377be6c163d832de02f319670720259c68133cf`

Primary requested files:
- `freeplane/src/main/java/org/freeplane/view/swing/map/NodeView.java` — `NodeView`, especially `ChildNodeViewLayout`, `getChildrenViews()`, `isFolded()`, `isSubtreeVisible()`, `paintEdges()`.
- `freeplane/src/main/java/org/freeplane/view/swing/map/NodeViewLayoutHelper.java` — `NodeViewLayoutHelper`, especially subtree visibility, boundary storage, and child-width alignment helpers.
- `freeplane/src/main/java/org/freeplane/view/swing/map/MainViewPainter.java` — folding affordance placement and reserved geometry.
- `freeplane/src/main/java/org/freeplane/view/swing/map/ForkPainter.java` — fork-shaped node rendering; notably not the general branch-routing engine.
- `freeplane/src/main/java/org/freeplane/features/map/NodeModel.java` — ordered child list, parent, fold flag, side, index, insertion.

Additional source needed to answer the bounded questions:
- `view/swing/map/VerticalNodeViewLayoutStrategy.java`
- `view/swing/map/edge/EdgeView.java`, `EdgeViewFactory.java`, `BezierEdgeView.java`, `LinearEdgeView.java`, `SharpBezierEdgeView.java`
- `features/map/mindmapmode/MMapController.java`, `InsertionRelation.java`
- `view/swing/ui/mindmapmode/MNodeDropListener.java`, `view/swing/ui/NodeDropUtils.java`
- `features/map/NodeWriter.java`, `NodeBuilder.java`
## 1. Stable sibling order is structural state, not geometry

Freeplane's stable sibling order originates in `NodeModel.children`, an `ArrayList<NodeModel>`. `NodeModel.insert(NodeModel child, int index)` inserts at a specific index and sets the parent; `getIndex(NodeModel)`, `getChildAt(int)`, `nextNodeIndex(...)`, and `previousNodeIndex(...)` all consume that same order.

The view preserves it. `NodeView.getChildrenViews()` walks Swing child components in component order, and `VerticalNodeViewLayoutStrategy` walks child components from index `0` upward when calculating X/Y coordinates. Layout therefore consumes an already-authored order; it does not derive sibling order from current coordinates.

Explicit reordering is equally structural. `MMapController.insertNode(..., InsertionRelation)` supports `AS_SIBLING_BEFORE` and `AS_SIBLING_AFTER`; `moveNode(...)`, `moveNodes(...)`, and `moveNodeAndItsClones(...)` mutate parent/index state. `MNodeDropListener.DropContext` maps drag-over zones to `InsertionRelation`, and `NodeDropUtils.handleMoveOrCopyAction(...)` calls those model operations for local moves.

Persistence confirms the boundary. `NodeWriter.saveChildren(...)` serializes `node.getChildren()` in list order. `NodeBuilder.endElement(...)` reconstructs hierarchy by `parentNode.insert(node)`, appending children in XML encounter order. There is no need to persist ordinary auto-layout coordinates to preserve sibling order.

**Catalyst — BORROW:** make explicit sibling reorder an authored branch operation. Persist an order/rank on branch structure (or the structural occurrence edge), then let portrayal consume it deterministically.

**Catalyst — REJECT:** never infer sibling order from X/Y position after a drag. Movement remains placement unless the analyst explicitly invokes reorder/organization semantics.

**Catalyst — UNCERTAIN:** Catalyst currently gets deterministic order from creation time + ID. That is adequate until analysts need deliberate reordering; when added, an explicit sibling-order field is cleaner than rewriting creation metadata.
## 2. Branch side and orientation combine authored preference with effective layout

`NodeModel.Side` contains `DEFAULT`, `TOP_OR_LEFT`, `BOTTOM_OR_RIGHT`, plus sibling-drop sentinel values. `NodeModel.setSide(Side)` changes persisted model state; `NodeWriter.writeAttributesGenerateContent(...)` writes non-default side as the node `POSITION` attribute, and `NodeBuilder.registerAttributeHandlers(...)` restores it.

The rendered side is not simply that stored enum. `NodeView.ChildNodeViewLayout.updateSide()` evaluates the parent effective `ChildrenSides`, the current view root, the stored node side, and inherited parent side. `updateLayoutOrientation()` separately resolves `TOP_TO_BOTTOM` versus `LEFT_TO_RIGHT`, inheriting orientation when the child layout leaves it unset. `updateChildrenSides()` then resolves one-side, both-sides, diagonal, outline, and stacked cases.

`NodeModel.wouldBeTopOrLeft(...)` demonstrates the same layered rule from the model side: it may use an existing standard-layout view, explicit effective `ChildrenSides`, persisted `side`, or parent inheritance.

**Catalyst — BORROW:** support explicit branch-side/orientation preference independently from sibling order and independently from semantic relationships. Auto-layout may resolve defaults, but an analyst-set side should remain stable through reflow.

**Catalyst — REJECT:** do not put left/right/top/bottom on canonical note identity. Freeplane can do this because a `NodeModel` is fundamentally a tree node; Catalyst permits identity to appear through multiple occurrences, so branch side belongs to portrayal/occurrence structure.

**Catalyst — UNCERTAIN:** whether Catalyst should persist side on the child occurrence itself or on the authored parent→child structural edge. The source comparator does not decide this; use whichever level preserves independent portrayals of the same note without duplicating note identity.
## 3. Subtree span/reflow uses visible footprint, not merely a leaf count

The important implementation is `VerticalNodeViewLayoutStrategy`, reached through `NodeViewLayout`. Its constructor recursively validates child views (`layoutChildViews(...)` / `validateTree()`), then `calculateLayoutData()` processes each occupied side. `calculateLayoutX(...)` and `calculateLayoutY(...)` iterate children in stable order and compute coordinates from content size, gaps, summary grouping, free-node exceptions, and each child's already-calculated subtree dimensions.

For ordinary children, `layoutRegularChild(...)` uses `childRegularHeight`, which is the rendered child/subtree height minus overlaps and map padding. This means later siblings are advanced by actual visible subtree footprint, not a constant row or a simple descendant count.

Freeplane goes further when auto-compact layout is enabled. `NodeViewLayoutHelper` stores `topBoundary` and `bottomBoundary` as `StepFunction`s. `VerticalNodeViewLayoutStrategy.calculateAvailableSpaceForCompactLayout(...)`, `updateBottomBoundary(...)`, `calculateTopBoundary(...)`, and `calculateBottomBoundary(...)` compare/merge those contours so neighboring subtrees can compact without geometrically colliding. `arrangeChildComponents(...)` finally places children and sizes the parent container from resulting extents.

Free nodes are deliberately exceptional: `setFreeChildNodes(...)`, `assignFreeChildVerticalPosition(...)`, and `NodeViewLayoutHelper.isConsideredForAlignment(...)` keep manually positioned/free material from being treated like normal branch flow.

**Catalyst — BORROW:** the principle that reflow should reserve each visible descendant subtree's real footprint. Catalyst's new footprint-aware dense portrayal already moves in this direction; Freeplane's contour-boundary strategy is a useful next comparator if simple rectangular extents become too wasteful.

**Catalyst — REJECT:** do not import the assumption that every visible analytical object must live in the tree flow. Unrelated free occurrences and manual landmarks remain outside branch reflow.

**Catalyst — UNCERTAIN:** contour compaction is materially more complex than Catalyst's current footprint-aware row/column separation. Do not adopt it unless real dense-map fixtures show a legibility/space problem that simpler deterministic spacing cannot solve.
## 4. Folding compresses portrayal while retaining node/child identity

`NodeModel` stores `folded` separately from `id`, `parent`, and `children`. `isFolded()` returns the folding flag (plus encryption accessibility); `setFolded(boolean)` changes only folding state and fires a `NodeChangeType.FOLDING` event. Children remain in the model list.

`NodeView` caches the effective fold state from `MapController` in its constructor. Its `isFolded()` additionally prevents the view root from being treated as folded. Geometry/paint then use visibility rather than deleting descendants: `isSubtreeVisible()` checks the rendered subtree, while `paint(...)`, `paintClouds(...)`, and `paintEdges(...)` skip or tunnel through invisible content as appropriate.

`MainViewPainter.paintFoldingMark(...)` and `getFoldingRectangleBounds(...)` treat the fold control as a visual affordance with orientation-aware placement and reserved geometry. The folding mark can affect bounds without changing node identity.

Persistence is explicit and separate: `NodeWriter.writeAttributesGenerateContent(...)` may write `FOLDED`, independently of `ID`, `POSITION`, and child serialization. `NodeBuilder.registerAttributeHandlers(...)` restores `FOLDED` without recreating identity or hierarchy. Freeplane even has additional view-local hidden-child state in `NodeView.Properties.HIDDEN_CHILDREN`, demonstrating that temporary visibility can exist outside canonical child membership.

**Catalyst — BORROW:** folding means "remove descendant portrayal from the active geometry," not "remove descendants." Reflow should therefore use visible subtree footprint while identity, authored structure, provenance, and cross-boundary relation counts survive.

**Catalyst — REJECT:** do not copy Freeplane's placement of fold state directly on canonical note identity. In Catalyst, one note may have multiple occurrences and one branch can be collapsed while another occurrence remains open; fold state should stay occurrence/portrayal-local.

**Catalyst — BORROW:** reserve a small, stable fold affordance/connector clearance in geometry so toggling controls does not create edge collisions or ambiguous hit targets.
## 5. Structural connector routing is orientation/anchor-driven; `ForkPainter` is not the routing engine

`NodeView.paintEdges(...)` walks structural child views and delegates ordinary edges to `EdgeViewFactory.getEdge(...)`. The factory selects among `LinearEdgeView`, `BezierEdgeView`, `SummaryEdgeView`, `SharpLinearEdgeView`, `SharpBezierEdgeView`, `HorizontalEdgeView`, or hidden variants from the target node's edge style.

The core routing decision is `EdgeView.createStart()`. It chooses source/end connector anchors from `ChildNodesAlignment`, `ChildrenSides`, layout orientation, target `isTopOrLeft()`, relative geometry, and compact-layout state. For compact layouts it can offset `shapeStart` to leave clearance for the folding mark. `getControlPoint(...)` converts connector side into the directional vector used by curved/thick edge subclasses.

`BezierEdgeView.update()` builds a cubic `GeneralPath` from those connector directions; `LinearEdgeView.draw()` uses the same anchor/control directions for straight/polyline routing. `SharpBezierEdgeView.update()` additionally incorporates edge width into the filled curve geometry.

`ForkPainter`, by contrast, extends `ShapedPainter` for `NodeGeometryModel.FORK`. `getLeftPoint()`, `getRightPoint()`, and `paintNodeShape(...)` define the fork node's underline/baseline and connector attachment points. It is relevant to where edges meet a fork-shaped node, but it does not lay out or route the whole parent→child branch.

**Catalyst — BORROW:** route authored structural branches from explicit side/orientation anchors, and reserve connector/fold-control clearance as part of node footprint. This produces predictable edge shape without needing force routing.

**Catalyst — BORROW:** keep a small bounded structural-edge style grammar (quiet curves/lines) distinct from semantic relations. Geometry should express structure/orientation; semantic meaning should not be smuggled into branch routing.

**Catalyst — UNCERTAIN:** the prioritized source does not support a claim that routing itself changes systematically by tree depth. Width/color/style can be inherited or styled elsewhere, but depth-dependent connector geometry is not a mechanism to copy from these classes.
## 6. Explicit reorder/organization changes authored parent/index/side; layout then recomputes

Freeplane's drag interaction makes the structural action explicit before mutating the model. `MNodeDropListener.DropContext` derives `DragOverRelation`, `dropAsSibling`, `side`, and `insertionRelation`. Sibling drop zones map to `Side.AS_SIBLING_BEFORE` / `AS_SIBLING_AFTER` and `InsertionRelation.AS_SIBLING_BEFORE` / `AS_SIBLING_AFTER`.

`NodeDropUtils.handleMoveOrCopyAction(...)` then calls `MMapController.moveNodes(...)`. For sibling insertion it moves relative to the target and applies the target side; for child insertion it moves under the target and explicitly applies the chosen side where needed. `MMapController.moveNodes(...)` and `moveNodeAndItsClones(...)` preserve/adjust indices and parents, with undo actors around single-node moves.

The state that survives a save is therefore primarily:
- parent/child nesting, represented by nested node XML;
- sibling order, represented by child serialization order;
- explicit branch side, represented by `POSITION`;
- optionally fold state, represented by `FOLDED`;
- node identity, represented separately by `ID` (plus clone references when applicable).

Ordinary auto-layout coordinates are regenerated from those states. This is the strongest comparator result for Catalyst's placement/structure separation.

**Catalyst — BORROW:** if sibling reorder is added, make it a named/visible structural action (before/after, move earlier/later, or equivalent), independently undoable from free placement.

**Catalyst — REJECT:** a plain spatial drag must not silently become hierarchy/reorder merely because the drop happens near another node. Freeplane's interaction is tree-native; Catalyst must preserve its stricter placement/structure/semantics boundary.

**Catalyst — BORROW:** `Organize branch` should continue to recompute portrayal only. Explicit structural edits change parent/order/side; organization consumes them and must not rewrite them.
## 7. Source-level caution: do not copy connector code literally

In `EdgeView.getControlPoint(ConnectorLocation)`, the branch sequence checks `LEFT`, `RIGHT`, `TOP`, and then appears to check `LEFT` again for the positive-Y case. A `BOTTOM` check would be the expected symmetry. This pass did not broaden into Freeplane bug archaeology, so treat the literal condition as **UNCERTAIN** rather than as a mechanism to reproduce.

This does not change the useful comparator principle: source/end attachment location is resolved first, then the edge renderer derives direction/control geometry from those anchors.

## 8. Exact source/method map

| Question | Source class / methods |
|---|---|
| Ordered siblings / parent boundary | `features/map/NodeModel.java` — `insert(NodeModel,int)`, `getChildren()`, `getChildAt(int)`, `getIndex(NodeModel)`, `nextNodeIndex(...)`, `previousNodeIndex(...)` |
| Side persistence/inference | `NodeModel` — `setSide(...)`, `getSide()`, `wouldBeTopOrLeft(...)`; `NodeWriter.writeAttributesGenerateContent(...)`; `NodeBuilder.registerAttributeHandlers(...)` |
| View side/orientation resolution | `view/swing/map/NodeView.java` — inner `ChildNodeViewLayout.updateSide()`, `updateChildrenSides()`, `updateLayoutOrientation()`, `getDefaultChildNodesAlignment()` |
| View child order | `NodeView.getChildrenViews()` |
| Subtree layout/span | `view/swing/map/VerticalNodeViewLayoutStrategy.java` — constructor, `layoutChildViews(...)`, `calculateLayoutData()`, `calculateLayoutX(...)`, `calculateLayoutY(...)`, `layoutRegularChild(...)`, `arrangeChildComponents(...)` |
| Contour compaction | `VerticalNodeViewLayoutStrategy.calculateAvailableSpaceForCompactLayout(...)`, `updateBottomBoundary(...)`, `calculateTopBoundary(...)`, `calculateBottomBoundary(...)`; `NodeViewLayoutHelper.get/setTopBoundary()`, `get/setBottomBoundary()` |
| Fold/model separation | `NodeModel.isFolded()`, `setFolded(...)`; `NodeView.isFolded()`, `isSubtreeVisible()`; `MainViewPainter.paintFoldingMark(...)`, `getFoldingRectangleBounds(...)` |
| Structural edge dispatch | `NodeView.paintEdges(...)`; `view/swing/map/edge/EdgeViewFactory.getEdge(...)` |
| Structural edge anchors | `edge/EdgeView.createStart()`, `getControlPoint(...)` |
| Curved/linear routing | `edge/BezierEdgeView.update()`, `LinearEdgeView.draw()`, `SharpBezierEdgeView.update()` |
| Fork node geometry | `view/swing/map/ForkPainter.getLeftPoint()`, `getRightPoint()`, `paintNodeShape(...)` |
| Explicit drag reorder | `view/swing/ui/mindmapmode/MNodeDropListener.DropContext`; `view/swing/ui/NodeDropUtils.handleMoveOrCopyAction(...)` |
| Structural move operations | `features/map/mindmapmode/MMapController.insertNode(...,InsertionRelation)`, `moveNode(...)`, `moveNodes(...)`, `moveNodeAndItsClones(...)`, `setSide(...)` |
| Persisted child order/fold/side | `features/map/NodeWriter.saveChildren(...)`, `writeAttributesGenerateContent(...)`, `writeContent(...)`; `features/map/NodeBuilder.endElement(...)`, `registerAttributeHandlers(...)` |
## 9. Catalyst BORROW / REJECT / UNCERTAIN synthesis

### BORROW
- Persist explicit sibling order separately from X/Y placement; let layout consume it deterministically.
- Persist explicit branch-side/orientation preference separately from note identity and semantic relations.
- Reflow authored branches from the visible descendant footprint; consider contour boundaries only if dense fixtures justify the complexity.
- Treat fold as portrayal compression: descendants remain real and structurally/semantically connected while omitted from active layout geometry.
- Route structural connectors from orientation-aware attachment anchors, reserving fold/control clearance in node footprint.
- Make sibling-before/after and branch organization explicit operations with undoable state changes rather than spatial inference.

### REJECT
- Freeplane's fundamental `NodeModel` = tree-node ontology as Catalyst's universal object model.
- Side/fold state on canonical note identity when the same note can occur in independent portrayals.
- Drag proximity silently changing parentage, sibling order, or semantic meaning.
- Global tree auto-layout as the only legal spatial organization.
- Literal copying of Freeplane connector/layout implementation, including the apparent `getControlPoint(...)` directional-case defect.

### UNCERTAIN / defer until a fixture proves need
- Contour-based auto-compaction (`StepFunction`) versus Catalyst's simpler footprint rectangles.
- Exact storage location for authored side/order: occurrence fields versus explicit structural-edge metadata.
- Any depth-dependent structural-edge styling. The inspected routing source establishes orientation/style dispatch, not a compelling depth-routing rule.

## Bounded conclusion

The source pass strengthens the existing Catalyst layout grammar rather than changing direction. Freeplane's mature behavior comes from a clean chain: **authored ordered tree state → explicit side/layout preferences → visibility/fold projection → deterministic subtree geometry → connector painting**. The parts worth borrowing are the explicitness and locality of those transitions, not Freeplane's assumption that the tree is the whole ontology.

For Catalyst, the next source-justified layout feature is **explicit sibling reorder** if current insertion-order stability becomes limiting. It should change authored branch order only, preserve note identity and free/manual placement, and trigger bounded branch reflow. No Freeplane source finding justifies parent inference from ordinary movement or conflating structural branches with semantic relationships.

## Follow-up: explicit non-drag sibling reorder commands

A continuation pass closed the remaining question about explicit reorder affordances beyond drag/drop.

- `features/map/mindmapmode/NodeUpAction.java` and `NodeDownAction.java` invoke `MMapController.moveNodesInGivenDirection(...)` for ordinary horizontal mind-map layouts.
- `MMapController.moveNodesInGivenDirection(NodeModel selectionRoot, NodeModel selected, Collection<NodeModel> movedNodes, int direction)` first groups summary-edge companions, requires selected siblings to share a parent and be adjacent, then reorders them through `moveNodeAndItsClones(...)`.
- `getSiblingsSortedOnSide(...)` preserves model child order within side groups and, at the root/non-outline selection root, groups top/left before bottom/right. Reorder therefore remains side-aware without becoming a coordinate sort.
- The operation wraps across the available sibling range and rebalances summary-group markers after structural movement.

### Catalyst implication strengthened

**BORROW:** expose explicit `Move earlier` / `Move later` (or equivalent) for authored branch siblings if insertion order becomes insufficient. The command should mutate authored sibling order and then trigger bounded branch reflow.

**REJECT:** do not implement these commands as coordinate nudges, and do not let ordinary free-position dragging invoke them implicitly. Spatial movement remains placement; reorder remains authored structure.

## Follow-up: orientation-aware directional actions

Freeplane also exposes explicit `NodeUpAction` / `NodeDownAction` commands in `features/map/mindmapmode/`.
- Both inspect `LayoutController.getEffectiveLayoutOrientation(selectedNode.getParentNode())`.
- In `LEFT_TO_RIGHT` layout, `NodeUpAction` calls `ChangeNodeLevelController.changeNodeLevelLefts(...)` and `NodeDownAction` calls `changeNodeLevelRights(...)`: the directional commands change structural level/parentage.
- In the orthogonal layout, the same actions call `MMapController.moveNodesInGivenDirection(...)` with `-1` / `+1`, reordering ordered siblings.
- `moveNodesInGivenDirection(...)` operates on model sibling order, handles root-side grouping through `getSiblingsSortedOnSide(...)`, and ultimately calls `moveNodeAndItsClones(...)`.

**Catalyst implication:** BORROW the existence of explicit keyboard-accessible structural reorder, but REJECT Freeplane's orientation-dependent semantic overloading for Catalyst's core grammar. Prefer named operations such as **Move earlier / Move later** and **Promote / Demote (change parent)**, with shortcuts allowed to vary by orientation only if the command identity remains explicit. A user's spatial movement gesture should still author placement only.
## Follow-up: Freeplane `FreeNode` is still structurally parented

`features/map/FreeNode.java` confirms that Freeplane's "free node" is a persistent hook/extension on an ordinary `NodeModel`, not a separate unparented occurrence type.
- Enabling `FreeNode` resets location offsets and then calls `MMapController.moveNode(node, 0)`: it remains in its existing parent's ordered child list.
- `LayoutController.suggestNewChildSide(...)` explicitly subtracts `FreeNode` children from ordinary tree-side balancing, showing that they remain model children while being treated specially by portrayal.
- `VerticalNodeViewLayoutStrategy` marks free children and gives them shift-based positions outside regular branch packing.
- `MNodeMotionListener.adjustNodeIndices()` / `calculateNewFreeNodeIndex(...)` can reorder a free node's model sibling index according to its rendered Y position; dragging a free node can therefore alter hidden ordered-tree state even though its visual treatment is free-form.

**Catalyst implication: strong REJECT.** Catalyst's free occurrence must not be a tree child merely exempted from automatic packing. Free placement should remain occurrence/placement state with no hidden authored parent or sibling rank. Converting a free occurrence into an authored branch child must be an explicit structural command. This is one of the clearest places where Freeplane's mature layout mechanics should *not* be copied despite the surface similarity of the feature name.
## Follow-up: FreeNode placement is coupled to structural operations in Freeplane

Additional source inspection shows a deliberate Freeplane coupling that Catalyst should reject.

- `features/map/FreeNode.java` — `FreeNode.undoableToggleHook(...)` first calls `MLocationController.moveNodePosition(node, DEFAULT_HGAP, DEFAULT_SHIFT_Y)`, then toggles the persistent `FreeNode` hook. If the node becomes free, it is moved to model index 0.
- `features/map/mindmapmode/MMapController.moveNodes(..., InsertionRelation)` deactivates/toggles `FreeNode` when nodes are inserted as children or siblings; the child case can also clear `MapStyleModel.FLOATING_STYLE`.
- `features/map/mindmapmode/NodeSorter.sortNodes(...)` deactivates `FreeNode` before moving each sorted child.
- `features/map/mindmapmode/ChangeNodeLevelController` likewise deactivates `FreeNode` before level-changing structural moves.
- `MMapController.addFreeNode(...)` shows the reverse direction explicitly: a free node is still inserted as a tree child, then receives `FreeNode`, floating style, and explicit location coordinates.

### Catalyst implication

**REJECT Freeplane's rule that structural organization consumes free/manual placement.** Catalyst's architecture explicitly permits an authored branch occurrence to retain manual coordinates. Attaching, reparenting, sorting, or reordering an occurrence should change structural state only unless the user invokes an explicit portrayal-reset command. A formerly free occurrence attached into a branch should therefore become a *manual branch portrayal*, not silently snap back into automatic layout.

This sharpens the operation grammar: **Move/Place** edits placement; **Attach/Reparent/Reorder** edits authored structure; **Organize branch / Return to branch layout** is the explicit operation that may clear manual coordinates and recompute portrayal. These operations should remain independently undoable.
## Follow-up: Freeplane free placement still has hidden tree parentage

`MMapController.addFreeNode(...)` creates a normal `NodeModel`, assigns a side, adds `FLOATING_STYLE` and the persistent `FreeNode` extension, **then calls `addNewNode(newNode, target, target.getChildCount())` before writing explicit X/Y offsets**. Free placement is therefore a special portrayal mode of an ordinary tree child, not a parentless occurrence.

`VerticalNodeViewLayoutStrategy` detects `child.isFree()` and gives those children separate coordinate handling/excludes them from ordinary packed-branch geometry, but the underlying parent/child relation remains.

### Catalyst implication

This is another clear **REJECT** at the ontology boundary. Catalyst should borrow Freeplane's ability to keep manual/free occurrences out of automatic branch packing, but must not require an invisible structural parent merely because the layout engine needs an owner. A genuinely free Catalyst occurrence should remain placement-only until the analyst explicitly authors a branch relation. Once attached, it may retain its manual coordinates as a manual branch portrayal.
### FreeNode connector consequence

`NodeView.paintEdges(...)` contains no `FreeNode` exclusion. A visible free child reaches the same `EdgeViewFactory.getEdge(source, nodeView, ...)` path as an ordinary child (unless some independent edge style hides it). Thus Freeplane's free positioning changes packing/coordinates, not structural-edge eligibility or parentage.

For Catalyst this sharpens the rejection: **manual position is not evidence of structure, and structure must not survive invisibly merely because a connector happens to be hidden.** A free occurrence has no authored branch edge until the analyst explicitly creates/assigns one.
### Verified drag-to-hidden-order coupling

`view/swing/ui/mindmapmode/MNodeMotionListener.adjustNodeIndices()` confirms that Freeplane actively reconciles rendered free-node geometry back into model order. If the dragged node is free, it calls `adjustNodeIndexBackupSelection(...)` for that node; if the dragged node is ordinary, it recalculates every free sibling. `calculateNewFreeNodeIndex(...)` derives a new model child index from side and rendered Y, and `mapController.moveNode(node, newIndex)` persists that structural reorder.

**Catalyst REJECT:** never run a background geometry→structure reconciliation after movement. Moving a free occurrence must not create or modify parentage/sibling rank. If an analyst wants the spatial order promoted into authored structure, expose a separate explicit command so the provenance of that structural change is legible and undoable.
## Pass closure status

**Status: COMPLETE / CLOSED unless the main UI thread asks a new bounded question.**

This pass now covers the source-backed questions that materially affect Catalyst's layout grammar: authored sibling order, side/orientation, visible-subtree packing, fold-state separation, structural-edge routing, explicit reorder, orientation-aware structural commands, FreeNode ontology, free/manual placement coupling, hidden parentage, and drag-to-hidden-order reconciliation.

The highest-confidence Catalyst conclusions are now stable:
- plain movement authors placement only;
- free occurrences have no hidden structural parent or sibling rank;
- Attach / Reparent / Reorder author structure explicitly and preserve manual coordinates;
- Organize branch / Return to branch layout is the explicit portrayal reset that may clear manual coordinates;
- explicit sibling reorder is worth adding when creation/insertion order becomes insufficient;
- structural and semantic relations remain separate;
- fold/focus/portrayal state should be occurrence/view-local where independent portrayals require it.

No further Freeplane source expansion is currently justified by an unresolved Catalyst design decision. Remaining questions are implementation/UI questions for Catalyst rather than gaps in this comparator pass.

### Handoff state

A bridge handoff to the main Catalyst UI conversation was re-issued using corrected sequencing: navigate/load the target conversation first, then send through Catalyst Chat Bridge after page initialization. Opera Browser Connector remained disconnected, so receipt could not be independently read back from this research chat. Avoid duplicate sends unless later evidence shows the handoff was not received.
