# Mozilla reviewer build instructions

Catalyst is a local-first React/TypeScript application distributed as a Firefox
Manifest V3 extension. The Firefox package does not contain a separate
application fork: the same Vite production build used for ordinary web hosting
is copied byte-for-byte into the extension staging directory, then a thin
Firefox wrapper is added.

## Environment

The submitted version was developed and tested on:

- Windows 10/11 x64
- Node.js 24.13.0
- npm 11.6.2

Mozilla's documented default reviewer environment is Ubuntu 24.04.4 LTS on
ARM64 with Node.js 24.14.0 and npm 11.9.0. Catalyst uses no native Node modules
or platform-specific build tools, so that environment is expected to reproduce
the same browser assets.

Internet access is required only for `npm ci` to download dependencies from
the official npm registry. The built extension does not load remote executable
code or transmit user data.

## Build

From the root of this source archive:

```sh
npm ci
npm run firefox:stage
```

The reviewable extension directory is then:

```
release/firefox/
```

The staging command performs:

1. `tsc -b`
2. `vite build`
3. copies every file from `dist/` into `release/firefox/`
4. adds the Firefox manifest, background script, and icons
5. verifies every copied Catalyst application file by SHA-256

For a packaged ZIP and Mozilla linter run:

```sh
npm run firefox:lint
npm run firefox:package
```

These commands invoke `web-ext@10.6.0` through npm/npx.

## Expected wrapper-only files

The files below exist only in the Firefox package and are not part of
`dist/`:

- `manifest.json`
- `background.js`
- `icon-48.png`
- `icon-96.png`

Everything else under `release/firefox/` must match `dist/` byte-for-byte.

## Runtime notes

- The extension requests no browsing permissions or host permissions.
- `data_collection_permissions.required` is `["none"]`.
- PDFium WebAssembly is bundled locally.
- EmbedPDF remote font fallback and default stamp manifests are disabled.
- EmbedPDF 2.15.1 currently runs with `worker: false` because its stable
  release creates the worker from a blob URL, which is incompatible with the
  Firefox Manifest V3 extension CSP used here.
- No installed third-party library is patched or modified.
- Compatibility was verified on an isolated official Mozilla Firefox
  140.16.0esr Windows binary: the extension installed, EmbedPDF/PDFium became
  ready, and a 45-page local PDF opened successfully as one active document.

## Direct runtime dependencies

- @embedpdf/react-pdf-viewer 2.15.1
  - https://github.com/embedpdf/embed-pdf-viewer
- React / React DOM 19.2.8
  - https://github.com/facebook/react
- docx 9.7.1
  - https://github.com/dolanmiu/docx
- pdfmake 0.3.11
  - https://github.com/bpampuch/pdfmake

## Validator warnings

Mozilla's linter currently reports warnings originating in bundled third-party
library code.

The `Function` / `eval` warnings are in the dynamically loaded DOCX and PDF
export bundles. They are compatibility fallbacks inside those release
dependencies. Catalyst's extension CSP does not permit ordinary eval execution,
and the tested RTF, DOCX, and PDF export paths all complete successfully under
that CSP.

The `innerHTML` warnings map to framework/viewer internals: React DOM element
creation / dangerouslySetInnerHTML handling, Preact DOM reconciliation, and
EmbedPDF's container cleanup. They are not Catalyst-authored HTML injection
paths.

The built EmbedPDF worker bundle also contains upstream jsDelivr font fallback
URL strings. Catalyst does not execute that worker in EmbedPDF 2.15.1,
configures `fontFallback: null`, and requests no host permissions, so those
remote URLs are not used by the extension.

The linter may also report that
`browser_specific_settings.gecko.data_collection_permissions` requires
Firefox for Android 142 while `gecko.strict_min_version` is 140. Catalyst does
not declare `gecko_android`; Mozilla's compatibility documentation specifies
that omission means the add-on is desktop-only. Firefox desktop 140 supports
the built-in data-collection declaration.

No warning is intentionally suppressed and no installed third-party library is
modified to remove a warning.
