# ADR 0001: Replace the custom Dear PyGui PDF surface with EmbedPDF

## Status

Accepted for the Catalyst Next spike.

## Context

The first Catalyst prototype proved that PDFium rendering and text extraction are fast, but the desktop GUI integration repeatedly failed at the interaction layer: viewport geometry, scrolling, selection overlays, event delivery, and virtualization had to be reconstructed manually.

Catalyst is a research workspace, not a PDF rendering engine. The application should own the meaning and persistence of annotations and notes, while a mature viewer owns page rendering, text selection, search, scrolling, zoom, and annotation geometry.

## Decision

Use EmbedPDF as the PDF surface for Catalyst Next.

The Stage 1 spike uses the ready-made React viewer to validate:

- continuous multi-page viewing;
- local PDF loading;
- native text selection;
- extracting selected text and geometry;
- note creation from selection;
- navigation from a note back to its source page;
- PDF search and zoom provided by the viewer.

If the spike passes, Catalyst will move to EmbedPDF headless components for the final minimalist UI, rather than depending on the drop-in viewer chrome.

## License gate

Catalyst may not ship or depend on GPL-family software. The spike pins permissively licensed runtime components and includes `npm run licenses`, which fails if installed package metadata declares GPL, LGPL, or AGPL.

The license script is a guardrail, not legal advice; packages with ambiguous or missing metadata still require manual review before release.

## Consequences

Positive:

- no custom PDF page virtualization;
- no custom glyph hit testing;
- no GUI/PDF coordinate translation layer;
- selection and annotations are first-class viewer capabilities;
- PDF rendering stays local in the application through WebAssembly;
- React gives Catalyst a clean 65/35 workspace and a natural path to a custom headless UI.

Tradeoffs:

- the frontend becomes React/TypeScript;
- a WebAssembly PDF engine becomes part of the application bundle;
- the Python desktop shell is deferred until the browser spike passes;
- EmbedPDF remains behind a Catalyst adapter so domain data never depends directly on vendor/library-specific objects.
