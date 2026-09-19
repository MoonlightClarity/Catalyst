# Firefox distribution target

Catalyst uses one application build for both ordinary web hosting and Firefox.

## Invariant

`npm run build` produces `dist/`.

`npm run firefox:stage` copies those application files byte-for-byte into
`release/firefox/` and adds only the Firefox wrapper:

- `manifest.json`
- `background.js`
- `icon-48.png`
- `icon-96.png`

The staging script verifies every copied Catalyst application file by SHA-256.

## Commands

```powershell
npm run firefox:stage
npm run firefox:lint
npm run firefox:package
npm run firefox:source
npm run firefox:release
```

`firefox:package` performs a production build, stages the Firefox target,
runs Mozilla's `web-ext` validator, and creates the submission ZIP in
`release/`.

The `web-ext` version is pinned in the command rather than added to Catalyst's
dependency graph.

For the first listed AMO submission, create personal AMO API credentials and
expose them only in the current shell as `AMO_JWT_ISSUER` and
`AMO_JWT_SECRET`. Then explicitly confirm the upload:

```powershell
powershell -NoProfile -ExecutionPolicy Bypass -File .\scripts\submit-firefox-amo.ps1 -ConfirmSubmission
```

The helper rebuilds and verifies both release artifacts, uploads the reviewer
source archive with the listed submission, and refuses to run without both the
confirmation switch and environment-only credentials.

## Runtime compatibility choices

The ordinary web build follows Firefox Manifest V3 constraints too:

- relative Vite asset paths
- no inline startup JavaScript
- PDFium WASM is packaged locally and addressed through Vite
- EmbedPDF remote font fallback is disabled
- EmbedPDF remote stamp manifests are disabled
- EmbedPDF currently runs with `worker: false`

The worker setting avoids EmbedPDF 2.15.1's blob-created worker, which Firefox
Manifest V3 extension CSP does not allow. Keep this setting shared by web and
Firefox so the application build remains interchangeable.

Do not patch the installed EmbedPDF library for a release. If upstream adds a
CSP-compatible packaged worker URL in a stable release, upgrade to that release
and retest both targets.

### Firefox compatibility verification

The production Catalyst application was tested against an isolated official
Mozilla Firefox 140.16.0esr binary on Windows. The Manifest V3 extension
installed successfully, EmbedPDF/PDFium reached ready state, and the 45-page
Tradecraft Primer test PDF opened through Catalyst's normal local-file input as
one active document with content-addressed ID:

`sha256-48fe6cd5ef2cb9779db5bf1665386e5163b044b325eabe6be3dedfbaf422d52e`

This empirically validates the Firefox desktop 140 minimum despite the current
addons-linter Android-oriented warning about the data-collection manifest key.

## Data and permissions

The Firefox wrapper currently requests no browsing permissions or host access.
The manifest declares no data collection or transmission.

The extension ID is `catalyst@moonlightclarity`. Treat it as permanent after
the first AMO submission because the extension origin owns local browser
storage.

## Validator warnings

Mozilla's validator currently reports warnings in bundled third-party code from
the document export stack and framework/viewer internals. The runtime CSP does
not permit ordinary `eval()`, and Catalyst's tested RTF, DOCX, and PDF export
paths complete successfully under the extension CSP.

For AMO review, provide readable source/build instructions and links to the
original third-party library sources. Do not suppress or rewrite third-party
library code solely to hide validator warnings.

Current direct third-party runtime libraries:

- EmbedPDF React viewer 2.15.1 — https://github.com/embedpdf/embed-pdf-viewer
- EmbedPDF snippet/PDFium 2.15.1 — https://github.com/embedpdf/embed-pdf-viewer
- React / React DOM 19.2.8 — https://github.com/facebook/react
- docx 9.7.1 — https://github.com/dolanmiu/docx
- pdfmake 0.3.11 — https://github.com/bpampuch/pdfmake
