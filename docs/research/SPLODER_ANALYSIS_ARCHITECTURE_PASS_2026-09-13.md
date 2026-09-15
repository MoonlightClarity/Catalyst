# Sploder analysis architecture pass — 2026-09-13

Status: source-backed implementation guidance for Catalyst Analysis. This pass complements `SPLODER_TARGETED_SECOND_PASS_2026-09-12.md`; it does not replace it.

## Sources inspected
- Sploder: `Playfield.as`, `PlayfieldObject.as`, `ObjectGhost.as`, `ObjectAdder.as`, `Navigator.as`, `NetworkNode.as`, `Point.as`, `PolyPoint.as`, `PolyEdge.as`, `Creator.as`.
- Sploder extracted package code: `util/XMLLoader.as`, `com/sploder/Settings.as`.
- Catalyst: `src/domain/mapView.ts`, `src/domain/workspace.ts`, `src/map/layout.ts`, `src/picture/layout.ts`, `src/picture/placement.ts`, `src/features/analysis/WorkingPictureWorkspace.tsx`, persistence repository/queue files, and map/architecture tests.

## Executive conclusion
The useful Sploder precedent is not its visual style or its XML syntax. It is its separation of editor responsibilities.

Sploder divides world geometry, camera/navigation, object interaction, drag preview, recursive branch structure, and persistence. Catalyst currently keeps the underlying analytical state well separated, but the Analysis React component still combines most runtime/editor responsibilities in one file.

The safest immediate change is therefore mechanical: split Analysis runtime behavior into smaller modules without changing the persisted model or the existing structure/placement contracts.

## BORROW — dedicated camera/navigation math
`Navigator.as` owns pan, zoom, focus, fit, limits, and easing independently of authored object state.

Catalyst currently implements focus, wheel zoom, pan, fit, resize recentering, zoom-at-center, camera refs, and camera persistence inside `WorkingPictureWorkspace.tsx`.

Action: move camera math/controller behavior behind a picture-camera boundary. Keep camera as view state; do not let it become note or branch state.

Initial pure utilities added in this pass: `src/picture/camera.ts`.
## BORROW — transient drag preview, commit on valid release
`ObjectGhost.as` is deliberately temporary. `ObjectAdder.as` and `PlayfieldObject.as` preview movement, validate the drop, then commit or roll back.

Catalyst already has the same behavior in substance: `dragPositions` is transient, `placement.ts` validates bounds, snapping defaults to a 20-unit grid, Alt bypasses snapping, and invalid drops revert to the origin.

Action: preserve this behavior exactly while extracting it from the workspace component. Do not persist hover, drag ghost, validity state, hitboxes, or other interaction ephemera.

## BORROW — presentation geometry stays downstream of structure
`NetworkNode.as` has explicit recursive parent/child structure and draws connector geometry from already-established node relationships. `Point`/`PolyPoint` update only local adjacent geometry and counter-scale handles under zoom.

Catalyst should keep structural parentage in map state and generate branch SVG paths downstream. Semantic relationships must remain a separate channel.

Initial pure routing utilities added in this pass: `src/picture/geometry.ts`.

Later affordance work may borrow Sploder's counter-scaled handles so connector insertion/edit controls remain usable at any camera zoom.

## ADAPT — parent-relative geometry, without collapsing structure and placement
Sploder child coordinates are parent-relative because child clips are nested. This makes subtree motion mechanically natural.

Catalyst's current tests intentionally require placement and structure to be independent: free occurrences remain parentless until an explicit structural command, and reparent/reorder preserve manual world coordinates.

Do not replace that contract casually. A future relative representation should preserve the observable behavior by recomputing a child's authored offset when its structural parent changes, rather than making placement imply parentage.

## ADAPT — XML is a repository choice, not an editor-runtime model
Sploder's `XMLLoader.as` is only a thin load/callback wrapper. The important behavior is in `Creator.buildXML()` plus reconstruction: serialize minimal authored state, then rebuild editor/runtime state from it.

Catalyst already has a useful repository seam: `WorkspaceRepository` exposes `loadWorkspace`, `sync`, and `close`; `WorkspaceSyncQueue` handles debounced durable writes independently of SQLite details.

If the parallel XML experiment succeeds, the smallest architectural change is a new repository implementation plus repository selection. The current `RepositoryKind` union and `createWorkspaceRepository()` are the obvious integration points. The Analysis editor should not know whether storage is SQLite, browser JSON, XML, or memory.

Persist only canonical authored state. Do not persist generated SVG paths, territory positions when derivable, hit rectangles, hover/selection state, drag previews, computed extents, or handle presentation.

Sploder's autosave comparison also suggests a safe optimization: serialize/hash the durable form and skip identical writes. Catalyst's current queue already skips identical object references and serializes writes; backend-specific content equality can remain an implementation detail.

## REJECT — copying Sploder's broad `Creator` orchestration
`Creator.as` proves the persistence boundary, but it also owns too many unrelated UI and project concerns. Catalyst should not reproduce that monolith.

Likewise, do not copy Sploder's custom recursive caret/bracket network string. If XML is chosen, use an explicit versioned schema and normal parser/serializer primitives.

## Current Catalyst pressure point
`WorkingPictureWorkspace.tsx` is roughly 850 lines and owns camera lifecycle, pan/zoom, focus navigation, creation, rename state, drag validation, semantic-connect mode, keyboard commands, branch/relation rendering, attention filtering, and the complete React surface.

The underlying domain is cleaner than this component. The refactor target is the runtime/editor shell, not the analytical model.

## Recommended implementation order
1. Extract pure camera and SVG-routing math. Preserve output exactly.
2. Extract occurrence drag/placement interaction while retaining `placement.ts` as the validation authority.
3. Extract camera lifecycle/persistence into a hook/controller; keep `WorkspaceSyncQueue` and repository semantics unchanged.
4. Reduce `WorkingPictureWorkspace` to composition/orchestration and rendering.
5. Only after behavior is stable, reconsider the higher-level portrayal grammar (`picture/layout.ts` territories versus a simpler Freeplane/FreeMind-style hierarchy).
6. Defer any parent-relative persistence migration until the XML/FreeMind experiment reports its result and the current map tests are intentionally revised.

## Parallel-edit safety note
During this pass, `WorkingPictureWorkspace.tsx` was modified by another process/chat at 14:46:59 on 2026-09-13. `styles.css` had also been edited earlier in the same session.

For that reason this pass intentionally did not rewrite either live file. It added only isolated modules and this durable research record. Integration should use a fresh read and surgical edits after the parallel UI change settles.

## Acceptance constraints for the refactor
- No semantic relationship silently becomes a structural branch.
- Free occurrences remain unparented until an explicit structural command.
- Reparent/reorder do not visually teleport manually placed occurrences.
- Branch organize/layout reset retain their current authored-placement semantics unless deliberately redesigned.
- Snap remains 20 units by default; precision modifier bypass remains available.
- Invalid drops roll back.
- Focus/camera trail restoration continues to work.
- Structural and semantic connector rendering stay visually and logically distinct.
- Existing `test-map.mjs`, architecture prototype tests, portrayal tests, build, and license checks remain the regression floor.
