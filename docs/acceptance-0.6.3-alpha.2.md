# Catalyst 0.6.3-alpha.2 native acceptance — analytical map renderer

This acceptance pass tests the first Catalyst **Analysis/Map** renderer governed by ADR 0016 and `mapping-model-v0.1.md`.

Alpha.2 is not accepted merely because it looks more polished than alpha.1. It must demonstrate that Catalyst's primary interaction model has moved from generic graph editing toward human-scale analytical mapping while preserving existing research data.

## 1. Launch and continuity

1. Launch the existing project through `run.ps1`. Existing notes, evidence, evidence tags, first-class relationships, PDF markup, and research data must still be present.
2. The updater/migration must not require deletion of the existing database or `src-tauri` state.
3. Open the PDF used for previous acceptance. Reader navigation, text selection, saved highlights, evidence capture, and source jumps must still work.

## 2. First visual impression

4. The right side must read as **Analysis / Map**, not as graph paper, CAD, a database diagram, or an empty coordinate plane.
5. A blank/new analytical map should communicate a focal starting point and direct manipulation rather than presenting a large undifferentiated grid plus a `New node` button.
6. The Windows title bar/taskbar must show an actual Catalyst application icon, not the boxed `E` placeholder.
7. Core Catalyst controls must use the new bespoke glyph family rather than reading as an arbitrary mixture of stock browser/productivity icons.

## 3. Rapid structural capture

8. Select/focus an existing thought and create a child/branch using the intended fluent interaction (keyboard and/or direct branch affordance). This must be materially faster than `New` followed by separate connection authoring.
9. Create a sibling thought without reaching for a toolbar.
10. Create a free/unattached thought in an allowed freeform region or empty area.
11. None of those structural operations may silently create a typed semantic `supports`, `contradicts`, `depends-on`, or other analytical relationship.

## 4. Structure versus semantics

12. Structural branches must look recognizably different from first-class semantic relationships even in monochrome.
13. Author a semantic relationship between two existing thoughts. Its type/direction must remain explicit and independent of branch hierarchy.
14. Move/restructure an occurrence under another branch. The existing semantic relationship must remain unchanged unless the analyst explicitly edits it.
15. Existing 0.6.x `Relationship` records must load as semantic cross-links rather than being fabricated into map hierarchy.

## 5. Inspect, focus, and map navigation

16. Single-select an occurrence. The inspector should open without reorganizing the map.
17. Invoke explicit refocus on another occurrence. The portrayal may reorganize around that focus, but selection itself must not have triggered the change.
18. If submap navigation is present in alpha.2, opening a submap must be distinct from ordinary refocus and must offer an obvious route back.
19. Refocus/expand/collapse motion should preserve orientation and respect reduced-motion settings.

## 6. Layout and authored space

20. Add several children to one branch. New material should grow the affected local structure without arbitrarily moving unrelated regions.
21. Manually move an occurrence where manual placement is supported. Later text/semantic edits must not silently undo that authored arrangement.
22. Use the explicit restructure/arrange action if available. Only that intentional action should discard/recompute the relevant automatic arrangement.
23. The background must remain visually quiet; coordinates/gridlines must not dominate unless the active projection genuinely uses them.

## 7. Collapse, hidden structure, and scale

24. Collapse a branch containing several descendants. The map should become simpler without suggesting that the hidden analytical objects were deleted.
25. If hidden descendants have semantic cross-links outside the collapsed branch, the visible boundary must indicate that relationships continue beyond it.
26. Zoom out and back in. Semantic zoom may generalize labels/marks, but project-scale complexity must not be treated as solvable merely by shrinking every node/card.
27. If submap previews are implemented, they should show meaningful structural shape rather than unreadable tiny labels or a generic blank card.

## 8. Object identity across Maps

28. If multi-map occurrence support is present, place the same underlying object on another Map. Editing its underlying title/content should update both occurrences without producing duplicate analytical objects.
29. Local position/collapse/structure state on one Map must not unexpectedly alter its occurrence on another Map.

If full multi-map editing is deferred, inspect the serialized compatibility state and tests instead; alpha.2 must at least preserve the Map/occurrence contract rather than hard-code one-position-per-object assumptions into the renderer.

## 9. Evidence/source integration

30. Select an object with attached evidence. The trace mark must remain recognizable without turning the occurrence into a generic card full of metadata.
31. Follow evidence from Analysis back to the Reader and return. Source and analyst construction must remain visibly distinct.
32. Switch evidence tag layers. Layer/filter changes must not mutate Map structure or imply evidence quality.

## 10. Cognitive-load and intelligence alignment

33. At first glance, the map's structure should communicate the current problem better than the toolbar does.
34. A user should be able to distinguish information/observations, analyst-created structure, explicit analytical relationships, open/unresolved structure, and instrument controls without persistent instructional prose.
35. Map center/focus, branch depth, node size, position, proximity, and selection must not visually imply confidence, truth, importance, or network centrality unless the active analytical projection explicitly defines that meaning.
36. The interface must remain compatible with both exploratory sense-making and later formal analysis: a user can sketch structure quickly and then add typed analytical semantics when ready.

## 11. Accessibility and alternate access

37. Keyboard-only creation and branch navigation must be usable for the implemented branch grammar.
38. Focus indication must remain visible and distinct from analytical selection/significance.
39. A synchronized non-spatial representation/test contract must expose structural parentage separately from semantic relationships.
40. Color must not be required to distinguish structural branches, semantic relationships, selection, or source trace.

## 12. Persistence/restart

41. Create/restructure several branch occurrences, move one manually, collapse a branch, and add a semantic cross-link.
42. Close Catalyst completely and reopen it.
43. Map/occurrence portrayal state should restore without changing underlying analytical relationships.
44. Existing evidence/tag/profile state must survive the same restart.

## Exit criterion

0.6.3-alpha.2 passes only if the native application establishes the Mapping Model in practice:

- **Map rather than coordinate graph**;
- **fast structure before semantics**;
- **explicit semantic cross-links remain rigorous**;
- **human-scale decomposition/collapse remains truthful**;
- **selection is not refocus or significance**;
- **source trace survives**;
- **custom Catalyst identity is visible in actual operating-system chrome and map controls**;
- **no existing research data is lost**.

If those behaviors work but the visual styling still feels unfinished, iterate styling within alpha.2/alpha.3. If the interaction still feels like graph-database editing, revise the Mapping Model implementation rather than adding decoration.
