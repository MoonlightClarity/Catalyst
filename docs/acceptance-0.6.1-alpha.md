# Catalyst 0.6.1 architecture-alpha acceptance

Status: **historical acceptance record — superseded for current release gating by `release-readiness.md`, ADR 0027, and `CURRENT_ARCHITECTURE.md`.**

This is a manual native acceptance pass after `test.ps1 -Full` succeeds.

The purpose is to evaluate product/architecture behavior, not cosmetic polish.

## Setup

1. Preserve the current Catalyst directory or source snapshot.
2. Extract the architecture-alpha overlay directly into the Catalyst root.
3. Run `upgrade_alpha.ps1`.
4. Launch with `run.ps1`.
5. Use an existing 0.6 workspace if available so compatibility is tested against real data.

## A. Compatibility

- Existing live notes appear as graph nodes.
- Existing trashed notes remain in Trash.
- Existing PDF documents/evidence still load.
- Existing note connections appear as relationships.
- A legacy connection appears once even if historical storage contained reverse rows.
- Existing graph positions remain stable where saved.

Failure here is a stop condition.

## B. Progressive disclosure

### Research profile

- Evidence tab is visible.
- Analytical role controls are absent.
- Confidence is absent.
- Typed relationship controls/edge labels are absent.
- Structured methods are absent.
- Ordinary graph/note/source work remains coherent.

### Simple profile

- Evidence workspace tab disappears.
- Existing evidence is not deleted.
- Note/graph work remains coherent.

### Analytical profile

- Role selector appears.
- Confidence selector appears.
- Typed relationship controls appear.
- Built-in structured methods appear.
- Custom method creation remains absent.

### Full profile

- All Analytical behavior remains.
- Custom method authoring becomes available.

### Override test

1. In Analytical, turn Confidence off under Features.
2. Confirm the control disappears.
3. Turn it back on and confirm the prior value remains.
4. Change profile to Research.
5. Return to Analytical and confirm named profile defaults are restored.

## C. Analytical semantics

- Mark a node Claim.
- Mark another node Assumption or Question/Gap.
- Set confidence on the Claim.
- Switch to Research; confirm the extra structure disappears from the interface.
- Switch back to Analytical; confirm semantic data returns unchanged.

## D. Relationship semantics

1. Connect two previously unconnected nodes.
2. In Analytical mode, change `related-to` to `supports`.
3. Confirm the graph displays the semantic label/direction.
4. Change it to `contradicts`.
5. Toggle directed/undirected.
6. Confirm node positions do not move during these semantic edits.
7. Disconnect the nodes and confirm one operation removes the relationship.

## E. Lifecycle

- Trash a semantically annotated node.
- Confirm it disappears from the live graph.
- Restore it.
- Confirm role/confidence/relationship and graph position return.
- Permanently delete a disposable test node.
- Confirm its graph position, semantics, and relationships no longer return.

## F. Navigation and evidence

- Context Back/Forward still follows graph selections without moving the PDF.
- Reader Back/Forward still follows document/page navigation without changing graph selection.
- Evidence jump still returns to the correct document/page.
- Graph profile changes do not create destructive navigation behavior.

## G. Cognitive-load judgment

Record qualitative answers:

1. Does Research feel substantially calmer than Analytical?
2. Are the profile names understandable without documentation?
3. Are typed relationships useful enough to justify showing them?
4. Does `Claim / Assumption / Hypothesis / Question / Entity / Event` feel like the right initial role vocabulary?
5. Does confidence feel appropriate at node level, or should it move to judgments/claims only?
6. Is the Features menu itself too visible?
7. Which capability would you leave off most of the time?

These observations are more important than minor styling issues for the next architectural decision.
