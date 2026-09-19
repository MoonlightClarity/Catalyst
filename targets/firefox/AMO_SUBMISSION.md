# AMO submission draft

## Listing

**Name:** Catalyst

**Summary:** Local-first PDF reading and structured analysis workspace with outlines, notes, methods, annotations, and portable XML sessions.

**Description:**

Catalyst is a local-first workspace for reading PDFs and structuring analysis.

Open PDFs from your computer, annotate them, organize notes in an outline, work
through structured methods, and save or load portable Catalyst XML sessions.
Catalyst runs entirely inside Firefox and does not require an account or remote
service.

Core capabilities include PDF reading and annotation, editable outline notes,
structured analytical methods, session persistence, and PDF/DOCX/RTF project
export.

Catalyst requests no browsing or website-access permissions. It does not
collect or transmit user data. PDFs, annotations, notes, methods, and session
state remain local to the browser unless the user explicitly exports a file.

## Suggested submission selections

- Distribution: On addons.mozilla.org
- Suggested AMO URL slug: catalyst-analysis
- Category: Other
- Platform: Firefox desktop
- Experimental: consider Yes for the first public beta
- Requires payment/non-free service/hardware: No
- Data collection/transmission: None
- Privacy policy required by transmission policy: No transmission occurs
- License: Apache License 2.0
- Homepage / support site: https://github.com/MoonlightClarity/Catalyst
- Permanent extension ID: catalyst@moonlightclarity

## Submission command

Create AMO API credentials at the Mozilla developer API-key page. Keep the
issuer and secret out of the repository and expose them only in the shell used
for submission:

```powershell
$env:AMO_JWT_ISSUER = "<issuer>"
$env:AMO_JWT_SECRET = "<secret>"

powershell -NoProfile -ExecutionPolicy Bypass -File .\scripts\submit-firefox-amo.ps1 -ConfirmSubmission

Remove-Item Env:\AMO_JWT_ISSUER
Remove-Item Env:\AMO_JWT_SECRET
```

The script runs the full Firefox release gate, submits to the AMO `listed`
channel, supplies `targets/firefox/amo-metadata.json`, and uploads the
reproducible reviewer source ZIP in the same operation.

## Notes for reviewers

Catalyst is a self-contained local application packaged as a Firefox extension.
It does not inject scripts into websites, inspect browsing activity, or request
host permissions.

The Firefox target is intentionally a thin wrapper around the same production
application used for ordinary web hosting. Running `npm run firefox:stage`
builds the application, copies `dist/` byte-for-byte into
`release/firefox/`, adds four wrapper files, and verifies all application
files by SHA-256.

Please see `MOZILLA_REVIEWER_BUILD.md` in the submitted source archive for
full reproduction instructions and third-party source links.

The extension bundles PDFium WebAssembly locally and permits only
`wasm-unsafe-eval` in its extension CSP for WebAssembly compilation. It does
not permit ordinary `eval()`.

No account or credentials are required for functional testing. To test:
1. Install/open Catalyst.
2. Click Open and choose a local PDF.
3. Verify the PDF loads.
4. Add/edit an Outline note.
5. Open Methods and interact with a method.
6. Save a Catalyst XML session.
7. Try Export -> RTF, DOCX, or PDF.
