# Catalyst CSS architecture

`src/styles.css` is the frozen legacy cascade. It loads first for compatibility and must not receive new feature styling.

Current production CSS belongs in this directory and is loaded through `index.css` in deliberate order:

1. `00-tokens.css` - readable type, leading, contrast, icon, and shared design tokens.
2. `10-base.css` - global defaults, common controls, focus, and shared text hierarchy.
3. `15-shell.css` - application chrome, overlays, workspace tabs, and shared shell behavior.
4. `20-notes.css` - notes, source excerpts, provenance, and selection capture.
5. `30-analysis-outline.css` - Working Picture, graph inspector, outline authoring, and map ontology.
6. `40-techniques.css` - structured analytic technique catalog, runs, and workflow UI.
7. `50-reader.css` - PDF reader, Thorium chrome, text-note geometry, and reader ergonomics.
8. `70-iconography.css` - final glyph sizing, stroke treatment, and working-size icon legibility.

Readability takes priority over palette fidelity or maximum density. Normal reading text must not be reduced to microtype to preserve a theme.

Migration remains conservative: do not move historical Stage 2/3 or research CSS merely to reduce `styles.css` line count. Move legacy rules when functional work requires ownership of that exact block. Retired prototype CSS and routes must not return.

Run `npm run test:css` after CSS architecture changes. The contract enforces module order, legacy-first loading, the frozen monolith ceiling, retired prototype boundaries, owner markers, and core readability tokens.

Reusable glyph geometry lives in `src/ui/CatalystSymbols.tsx`; icon sizing belongs in `70-iconography.css`; component layout belongs in the owning surface module.
