# Firefox validator notes

Current validation baseline for Catalyst 1.1.0:

- errors: 0
- notices: 0
- warnings: 13

Warning classes:

- 1 × `KEY_FIREFOX_ANDROID_UNSUPPORTED_BY_MIN_VERSION`
- 9 × `DANGEROUS_EVAL`
- 3 × `UNSAFE_VAR_ASSIGNMENT`

## Android minimum-version warning

Catalyst is desktop-only and does not declare `gecko_android`. Mozilla's
compatibility documentation says that omitting `gecko_android` makes the
extension available only on desktop Firefox.

The validator nevertheless evaluates
`browser_specific_settings.gecko.data_collection_permissions` against the
Android introduction version and warns when desktop `strict_min_version` is
140.

The production extension was empirically tested on the official Mozilla
Firefox 140.16.0esr Windows binary. It installed successfully, initialized
EmbedPDF/PDFium, and opened a local 45-page PDF. Keep desktop minimum version
140 unless Mozilla changes the compatibility requirement.

## DANGEROUS_EVAL warnings

These warnings are in release third-party export dependencies bundled into the
DOCX/PDF export chunks. They are compatibility fallback branches using
`Function` / `eval`.

Catalyst's extension CSP permits `wasm-unsafe-eval` for PDFium WebAssembly but
does not permit ordinary `unsafe-eval`. RTF, DOCX, and PDF export have all
been exercised successfully inside the Firefox extension under that CSP.

Do not patch or rewrite installed third-party libraries merely to suppress the
validator warnings. If a dependency releases a version that removes the
fallbacks, upgrade normally and retest.

## UNSAFE_VAR_ASSIGNMENT warnings

These map to release framework/viewer internals:

- React DOM handling for script creation / dangerouslySetInnerHTML
- Preact DOM reconciliation
- EmbedPDF container cleanup

They are not Catalyst-authored HTML injection paths.

## Machine-readable report

A current machine-readable report can be generated with:

```powershell
npx --yes addons-linter@10.13.0 release/firefox --output json | Set-Content release/firefox-lint.json -Encoding utf8
```

The report is a local release diagnostic and is not required in the AMO source
archive.
