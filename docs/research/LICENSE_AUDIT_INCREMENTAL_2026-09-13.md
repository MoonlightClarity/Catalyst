# Catalyst incremental license audit — 2026-09-13

## Outcome

Catalyst now treats npm and Cargo license validation as dependency-state checks rather than unconditional work on every validation run.

- `scripts/check-licenses.mjs` orchestrates npm and Cargo audits independently.
- `scripts/license-audit-state.mjs` fingerprints dependency state plus the audit policy/scanner source.
- `license-audit-baseline.json` records only ecosystems that completed a successful audit.
- Unchanged validated fingerprints are reused on ordinary runs.
- `--full` / `--force` bypasses reuse and audits both ecosystems.
- `licenses.ps1 -Full` exposes full mode through the PowerShell entry point.

## Scanner corrections

The npm and Cargo scanners are now separate. Cargo metadata is allowed a 64 MiB child-process buffer; the previous default buffer produced `ENOBUFS` on the current dependency graph.

GPL-family policy now evaluates simple SPDX `OR`, `AND`, and parenthesized expressions conservatively. An expression such as `MIT OR Apache-2.0 OR LGPL-2.1-or-later` is not blocked because a non-GPL-family choice is available; `MIT AND GPL-3.0-only` remains blocked.

The npm scanner also falls back to packaged `LICENSE`, `LICENSE.md`, or `LICENSE.txt` evidence when manifest metadata is missing. The current `@embedpdf/plugin-form@2.15.0` package lacks a `license` field but ships a complete MIT license, so it no longer produces a false manual-review warning.

## Validation performed

- SPDX policy tests pass.
- npm scanner passes over 108 installed package versions.
- Cargo scanner passes over 529 resolved crate versions.
- Explicit full audit passes and records both ecosystem baselines.
- A following ordinary audit performs zero scans and reuses both unchanged fingerprints.
- `licenses.ps1` passes in both normal and `-Full` modes.
- The broader Catalyst test suite passes all current tests.

`npm run check:web` still stops during TypeScript compilation on unrelated syntax errors in `src/portrayal/testing/evaluation.ts` near line 222 and `src/viewer/ThoriumPdfReader.tsx` near line 189. Those files were left untouched because they are active parallel-work areas.

## Remaining integration note

A focused regression test exists at `scripts/test-license-policy.mjs`. An attempt to append it to the aggregate `package.json` test command, and to add a `licenses:full` convenience script, was deliberately abandoned after `package.json` was repeatedly held open by another process. The existing `licenses` script is already wired to the new orchestrator, and full mode remains available as `npm run licenses -- --full` or `licenses.ps1 -Full`.
