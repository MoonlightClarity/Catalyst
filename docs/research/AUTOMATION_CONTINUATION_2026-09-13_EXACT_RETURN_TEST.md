# Catalyst continuation — exact return regression — 2026-09-13

This pass resumed from the UI/source-identity/layout handoff without restarting broad research.

## Environment verification

- `127.0.0.1:5173` remains the sole Catalyst Vite listener.
- Listener PID observed: 14796.
- The project root remains outside a Git worktree; no Git-based recovery assumptions were made.

## Exact source-return coverage

`src/viewer/embedpdf.ts` already contained `restoreViewerSelection()`, which restores a persisted `sourceRange` through EmbedPDF's document-scoped `setSelection()` API. `App.tsx` invokes it after `jumpToPageWhenReady()` when returning to saved evidence.

A permanent regression script was added at `scripts/test-viewer-selection-restore.mjs`. It verifies that:

- the saved glyph range is passed to `setSelection()` unchanged;
- the document-scoped selection API is used;
- legacy annotations with no `sourceRange` do not synthesize a selection;
- viewers without a selection plugin fail safely and return `false`.

## Validation

`npm test` passes with the new viewer-selection regression included in the permanent test command. `npm run build` also passes. Vite continues to emit the existing EmbedPDF/browser `crypto` externalization warning and large-chunk warning; neither is new to this change.

## Remaining proof boundary

This closes the code-level regression gap for exact range restoration, but not the final live-browser proof. The next bounded step is to use the current Tradecraft evidence record on port 5173, navigate away, invoke return-to-source, and visually/through viewer state confirm that the original persisted glyph range is restored rather than only the page position.

After that proof, continue dense-map spacing/portrayal validation and then the coherent dark structural-shell composition pass described in `WORKING_PICTURE_LAYOUT_GRAMMAR_2026-09-12.md`.

## Live browser proof completed

A CDP probe on the live `127.0.0.1:5173` Tradecraft workflow now closes the remaining proof boundary. The probe saved an evidence selection, confirmed its persisted `sourceRange`, explicitly cleared the EmbedPDF selection, then invoked the evidence card's return-to-source action.

Observed persisted range: page 0, glyph/index 60 through page 0, glyph/index 148. After explicit clear, viewer selection state was `null`. After return-to-source, viewer selection state was restored to the exact same range and the probe's exact structural comparison returned `true`.

The visual artifact is `tools/research-probes/2026-09-13/exact-source-return-live.png`; the machine-readable result is `tools/research-probes/2026-09-13/exact-return-result.json`; the reproducible probe is `tools/research-probes/2026-09-13/exact_return_live_proof.mjs`.

This upgrades exact source return from code-covered to live-proven. The next active boundary is dense Working Picture spacing/portrayal validation, followed by the coherent dark structural-shell pass.