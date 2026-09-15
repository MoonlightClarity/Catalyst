# Catalyst 0.6.2-alpha.2 native acceptance

Status: **historical acceptance record — superseded for current release gating by `release-readiness.md`, ADR 0027, and `CURRENT_ARCHITECTURE.md`.**

## Purpose

This acceptance pass answers one focused product question: can evidence tags reduce highlight overload without creating a second ontology or losing evidence?

It also verifies that the self-verifying overlay repaired any mixed 0.6.1 source state before product testing begins and that the interface remains quiet as capability increases.

## Release integrity

1. Put `catalyst-0.6.2-alpha.2-overlay.zip` and `apply_062.ps1` in the Catalyst root.
2. Run `powershell -ExecutionPolicy Bypass -File .\apply_062.ps1`.
3. Confirm the updater reports that the overlay SHA-256 and release manifest both match.
4. Confirm all ten regression stages and the TypeScript/Vite production build pass.
5. Confirm the updater reports that `src-tauri` was not modified by the overlay.

A manifest mismatch is a release-integrity failure. Do not debug TypeScript against a mixed tree; reapply the exact overlay.

## Evidence-clustering workflow

1. Run Catalyst and open a PDF with several passages worth highlighting.
2. Save at least four Catalyst highlights. Leave one untagged.
3. In Evidence, tag at least two highlights `Timeline` and at least two `Financial`; give one highlight both tags.
4. Select **Timeline**. Only Timeline-tagged evidence should remain in the list, and only Timeline-tagged Catalyst highlights should remain visibly rendered in the open PDF.
5. Select **Financial**. The Evidence list and PDF highlight projection should switch together.
6. Select **Untagged**. Only untagged evidence should be listed; only untagged saved highlights should render.
7. Select **All**. Every saved Catalyst highlight should return.
8. Change the text-search query while a cluster is selected. Text search and cluster filtering should combine rather than replace each other.
9. Restart Catalyst. Tag definitions and assignments should persist. The cluster lens itself may reset for the session; no evidence may be lost.
10. Switch to the **Simple** capability profile. Tag/cluster controls should disappear and all saved highlights should render normally.
11. Switch back to **Research**. Tag definitions and assignments should still exist.
12. Remove a tag from evidence while that tag cluster is active. The evidence should leave that cluster immediately without being deleted.
13. Delete an unlinked saved evidence item that has tags. Its tag assignments should be removed, while the reusable tag remains available for other evidence.


## Interface-quieting checks

1. Open the Graph view with no nodes. The empty state should offer one short prompt and one action, not tutorial copy.
2. Open Features. Capability names should be visible without explanatory prose; hiding a capability must still preserve its data.
3. Open Evidence. Cluster controls should occupy one compact strip and the active cluster should be visually obvious.
4. Select a node with no sources or relationships. Zero counts should communicate the empty state without instructional paragraphs.
5. Switch among Simple, Research, and Analytical. Added rigor should appear as controls or structure, not repeated explanatory text.
6. Confirm method prompts and source excerpts remain fully readable: substantive analytical content is not chrome and must not be stripped for visual minimalism.

## Architecture-alpha regression checks

Repeat the highest-value 0.6.1 checks: existing notes/connections load, graph positions persist, typed relationships work in Analytical profile, capability hiding preserves data, source navigation works, and Reader/Context histories stay independent.

## Acceptance result

Record failures by category: release integrity, persistence, cluster/list projection, PDF highlight projection, capability disclosure, graph/domain compatibility, or native/Tauri behavior. A failure in one category should be fixed at that boundary rather than worked around elsewhere.
