# Catalyst 0.6.3-alpha.1 native acceptance

Status: **historical acceptance record — superseded for current release gating by `release-readiness.md`, ADR 0027, and `CURRENT_ARCHITECTURE.md`.**

This pass tests the first implementation of the Catalyst Visual & Analytical Language. It is intentionally a UI/interaction milestone, not a new ontology migration.

## Launch and continuity

1. Launch the existing workspace through `run.ps1`. Existing notes, evidence, tags, relationships, PDF markup, graph positions, and camera state must still be present.
2. Open the same PDF used during 0.6.2 acceptance. Reader navigation, text selection, evidence capture, and saved highlights must still work.

## Source / analysis structure

3. Confirm the PDF side reads visually as **Source** and the right side as the analytical plotting surface. The divider should read as a deliberate provenance spine rather than a generic splitter.
4. Confirm Catalyst's header is compact: brand mark/wordmark, navigation, configuration, and commands. Routine status prose should no longer occupy permanent header space; errors must remain visible/accessibly announced.
5. Open workspace configuration from the header. Switch Simple → Research → Analytical → Full and toggle at least one capability. Hidden data must survive exactly as in 0.6.2.

## Graph portrayal

6. At ordinary zoom, nodes should emphasize role/identity/relationships rather than body-text previews. Select a node: selection must use neutral registration framing rather than enlarging, glowing, or recoloring the node as if it were more important.
7. With the selected node, use the small relationship port on its edge to connect another node. Escape must cancel link mode. Duplicate relationship protection must remain intact.
8. Zoom far out and back in. The portrayal must change in stages: overview marks at distance, compact navigational objects at intermediate scale, normal analytical objects at working scale, and richer text only when zoomed in. Data must not be deleted by these portrayal changes.
9. Use Center, Fit, Reset arrangement, and zoom from the lower plotting controls. Node positions must remain stable except when Reset arrangement is explicitly invoked.
10. Search the graph. Nonmatches should remain in the analytical universe but be de-emphasized. The graph marginalia should show that a query is active rather than silently implying those objects disappeared.

## Evidence and inspection

11. Select a node with attached evidence. A compact provenance/trace mark should indicate source attachment without turning the graph node into a large card.
12. Open the inspector and jump from an attached source back to the PDF. The same trace grammar should be recognizable in the graph, inspector, and Evidence view.
13. In Evidence, switch All / Untagged / a tag layer. Tag controls should read as compact portrayal layers rather than decorative pills. PDF highlight projection must still follow the selected evidence layer.
14. Make a fresh PDF selection. The selection tray should be compact and action-oriented; create a linked note, save an excerpt, and dismiss a selection.

## Cognitive-load / visual review

15. Compare this build directly with the 0.6.2 screenshot. Record anything that still looks like generic SaaS chrome, unnecessary prose, stock-icon language, unsupported visual emphasis, or content that belongs in an inspector/margin instead of the plotting plane.
16. Confirm the graph remains usable in monochrome: role, selection, typed relationship differences, and interaction affordances must not depend on hue alone.

## Exit criterion

0.6.3-alpha.1 passes when the application remains behaviorally intact **and** the interface has clearly crossed from a functional skeleton into the first coherent Catalyst visual language. This alpha does not need to be visually final. Any element that still feels generic should be revised before the brand grammar is declared stable.
