# Catalyst handoff — node simplification / Freeplane / SVG — 2026-09-13

Status: active product-code handoff. Resume in ordinary Chat with Remote Desktop Commander.

## Scope and guardrails
- Project root: `C:\Users\iris\Downloads\Catalyst`.
- Live dev app: `http://127.0.0.1:5173`.
- This is not a Git worktree; make backups before product edits.
- Do not take over or modify the Opera Browser Connector patch/reference track.
- Keep structural hierarchy, semantic relationships, confidence, provenance/evidence, selection, and portrayal as separate channels.
- User explicitly wants the node code simplified before further Freeplane/FreeMind structural work.
- User has parallel chats generating Catalyst images and coded SVGs. Do not duplicate that exploratory generation in this track unless needed for integration.

## Strategic baseline
Catalyst should use mature FOSS interaction grammar rather than invent basic UX:
- Analysis / Working Picture: Freeplane is the primary structural-interaction baseline.
- Reader / annotations: Thorium Reader is the primary reader/annotation baseline.
- Catalyst-specific semantics remain independent: provenance, analytical roles, explicit semantic relationships, confidence, evidence promotion, and truly parentless free placement.
- Freeplane gives the structural substrate, not Catalyst's full visual grammar.

Durable architecture note:
`docs\research\REFERENCE_ARCHITECTURE_FREEPLANE_THORIUM_2026-09-13.md`
## Key correction from this chat
The biggest current architectural mistake is overcomplicating the node itself.

Target rule:
**one node = identity + title/content lookup + structural placement + minimal structural state.**
Everything else decorates or relates to the node; it is not the node.

Keep separate:
- analytical role;
- confidence;
- provenance/source trace;
- evidence linkage;
- semantic relationships;
- selection/hover/attention;
- instrument/action controls;
- generated visual portrayal.

Do not let an evidence-backed analytical object become a different node type merely because it has a source.
Do not encode confidence or relationship type only through color.
Do not allow Freeplane-style hierarchy to flatten Catalyst analytical semantics.

## Confidence / relationships finding
Current Working Picture had no confidence portrayal at all.
`NoteSemantics.confidence` supports `low | medium | high | null`, but Working Picture nodes did not render it.
Semantic relationship types had different base CSS patterns/colors, but the dark graph theme applied one higher-specificity stroke color to all `.picture-semantic-relation` edges, visually flattening them.
Future portrayal should use redundant cues: pattern/shape/label plus color, not color alone.
## Product changes completed in this chat
Backups were created before the simplification work, including:
- `src\picture\layout.ts.bak-node-simplify-20260913`
- `src\features\analysis\WorkingPictureWorkspace.tsx.bak-node-simplify-20260913`
- later `node-core-v2` backups were also created before the next intended cut.

`src\picture\layout.ts` was simplified so `WorkingPictureNode` no longer carries presentation payload such as:
- analytical species;
- primary annotation object;
- source count;
- duplicated focus flag;
- loose-root flag;
- parentNoteId/depth fields that the Working Picture renderer did not need.

Current `WorkingPictureNode` is approximately:
- `note`
- `position`
- `territory`
- `collapsed`
- `childCount`
- `hiddenDescendantCount`
- `hiddenCrossLinkCount`
- `manual`

`WorkingPictureWorkspace.tsx` now derives role glyph and source annotations at the rendering boundary instead of receiving them from layout.
Evidence-backed objects use the same base analytical node/glyph plus an independent evidence trace/open-source affordance; the old special `EvidenceFragment` node branch was removed.
## Validation status
Relevant validation after the simplification:
- `node scripts/test-map.mjs` passed.
- `npm run build` passed TypeScript and Vite production build.
- Known warnings only: EmbedPDF crypto externalization and large output chunks.

`npm run check:web` did not complete because `scripts/test-visual-language.mjs` currently expects `App.tsx` to contain a `reader-mode-label > Source` marker that is absent after concurrent UI work.
Do not blindly restore that marker or overwrite `App.tsx`; treat this as a separate concurrent-track/test expectation issue.

## Concurrent changes to preserve
While this chat was simplifying nodes, another product track changed selected-node actions to a simpler primary set:
- Branch
- Connect
- Focus
- More menu for collapse/reorder/organize

Preserve those changes unless intentionally redesigning them.
Do not restore an older action-toolbar snapshot from backups.

## Parallel visual research
User spawned five parallel image-generation chats for Catalyst, then five parallel coded-SVG research chats with the prompt:
`we are going to generate svgs for catalyst. code them. generate as much as you can. do not use your image tool. this is research. do not worry about duplicating.`

Best visual-reference chat named by user:
`split into separate images but not one image`
URL supplied by user: `https://chatgpt.com/c/6aa6dd1b-0e28-83e9-81b0-411a68b63437`
Treat those outputs as an exploratory portrayal/asset pool, not as architecture.
## Exact next step
Continue simplification before integrating SVGs or expanding Freeplane behavior.

The intended second cut is to make Working Picture layout nodes carry **note identity instead of the full `Note` object** where practical:
- prefer `noteId + position + minimal structural/layout metadata`;
- look up title/content from `state.notes[noteId]` in the workspace/view boundary;
- keep portrayal data outside the structural layout record.

Before applying that cut:
1. Read current `src\picture\layout.ts` and `src\features\analysis\WorkingPictureWorkspace.tsx`; concurrent edits are active.
2. Confirm the `node-core-v2` backups exist.
3. Search all live references to `WorkingPictureNode` and `node.note.id`; tests also inspect `picture.nodes[*].note.id`, so update tests deliberately if the representation changes.
4. Make small surgical edits rather than restoring entire backups.
5. Run `node scripts/test-map.mjs` and `npm run build` immediately.
6. Run broader tests, but isolate unrelated concurrent visual-language failures rather than overwriting other tracks.

Only after the structural node is boring/stable:
- inspect and curate the parallel SVG batches;
- attach SVGs as replaceable portrayal/instrument primitives;
- implement confidence portrayal as a decorator;
- strengthen semantic relationship portrayal;
- then resume Freeplane-like structural commands/layout.

## Freeplane constraints to preserve
- True free placement remains parentless until explicit structural action.
- Geometry must never imply hierarchy.
- Structural and semantic relationships remain separate records/renderers.
- Promote/demote must stay distinct from Move earlier/later.
- Organize branch is an explicit portrayal/layout reset, not semantic mutation.
- Freeplane/FreeMind structure should simplify Catalyst, not import hidden-parent complexity.
## Comparator source locations
Local Freeplane source/reference checkout:
`C:\Users\iris\Downloads\freeplane-source-pass`

Local Thorium shallow clone:
`C:\Users\iris\Downloads\thorium-source-pass`

Do not import Freeplane GPL artwork/path data into Catalyst. Use its interaction vocabulary as reference and keep Catalyst SVG geometry original.
Thorium is primarily a reader/annotation architecture reference; preserve Catalyst source identity and evidence semantics.

## Fresh-chat resume instruction
Use this as the first prompt in a fresh chat:

`CATALYST_NODE_SIMPLIFICATION_HANDOFF_2026_09_13 — Read C:\Users\iris\Downloads\Catalyst\docs\research\HANDOFF_CHECKPOINT_2026-09-13_NODE_SIMPLIFICATION_FREEPLANE_SVG.md and continue autonomously in ordinary Chat with Remote Desktop Commander. Do not take over the Opera Browser Connector patch. Continue simplifying the Working Picture node core before integrating parallel SVG/image research or expanding Freeplane-style behavior. Preserve concurrent product edits and validate with test-map + build before broader checks.`
