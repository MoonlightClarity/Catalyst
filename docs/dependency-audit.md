# Catalyst dependency audit

Audit date: 2026-09-17
Project version: `1.0.3`
Scope: active npm manifest/lockfile, installed dependency tree, source/test/config usage, registry freshness, security advisories, package signatures, licenses, and removed-dependency regression checks.

This document records the dependency state of the current 1.0.3 source tree and is maintained alongside manifest, lockfile, licensing, and release-readiness changes.

## Executive result

Catalyst has a deliberately small direct dependency surface: five runtime packages and seven development packages. The package/lockfile consistency check passes, the installed tree is satisfied, and the current npm license gate passes.

The license scan found no GPL, LGPL, or AGPL requirements in the installed npm tree. Direct packages are MIT or Apache-2.0 licensed.

EmbedPDF is the active PDF reader dependency. `@embedpdf/react-pdf-viewer@2.15.1` is declared directly and mounted by `src/viewer/EmbedPdfReader.tsx`. The former direct PDF.js/Thorium reader path has been removed. No active Tauri package dependency exists, and there is no `src-tauri` directory; remaining `src-tauri` strings in tooling are guards or conditional legacy checks.

There are no dependency findings that justify an urgent package change. The main release-hardening gap is that Catalyst does not declare its supported Node/npm version even though current dependencies impose a modern Node floor.

## Environment and lock state

- Node: `v24.13.0`
- npm: `11.6.2`
- package lock: lockfile version 3
- `npm run lockfile:check`: passed
- default `install.ps1` behavior: `npm ci`, with lockfile updates allowed only through the explicit `-UpdateLockfile` path
- `npm ls` resolves the declared top-level tree without missing or extraneous direct packages

## Direct dependencies

| Package | Declared | Installed | Latest observed | Role | License | Audit disposition |
| --- | --- | --- | --- | --- | --- | --- |
| `@embedpdf/react-pdf-viewer` | `^2.15.1` | 2.15.1 | 2.15.1 | Active PDF reader/native annotation surface | MIT | Keep |
| `docx` | `^9.7.1` | 9.7.1 | 9.7.1 | DOCX project export | MIT | Keep |
| `pdfmake` | `^0.3.11` | 0.3.11 | 0.3.11 | PDF project export | MIT | Keep |
| `react` | `19.2.8` | 19.2.8 | 19.3.0 | Active application UI | MIT | Keep; minor update available |
| `react-dom` | `19.2.8` | 19.2.8 | 19.3.0 | Active browser root rendering | MIT | Keep; minor update available |
| `@types/pdfmake` | `^0.3.3` | 0.3.3 | 0.3.3 | PDF export compile-time types | MIT | Keep |
| `@types/react` | `^19.2.2` | 19.3.0 | 19.3.0 | React compile-time types | MIT | Keep |
| `@types/react-dom` | `^19.2.2` | 19.3.0 | 19.3.0 | React DOM compile-time types | MIT | Keep |
| `@typescript/typescript6` | `6.0.2` | 6.0.2 | 6.0.2 | Deliberate TypeScript 6 test compiler | Apache-2.0 | Keep; actively used by test harness |
| `@vitejs/plugin-react` | `6.1.1` | 6.1.1 | 6.1.1 | React/Vite build integration | MIT | Keep |
| `typescript` | `7.0.2` | 7.0.2 | 7.0.2 | Primary build compiler (`tsc -b`) | Apache-2.0 | Keep |
| `vite` | `8.2.2` | 8.2.2 | 8.3.0 | Dev server and production bundler | MIT | Keep; minor update available |

The TypeScript 6 + TypeScript 7 pairing is intentional. TypeScript 7 is used by the normal build command. `scripts/test-compiler.mjs` loads `@typescript/typescript6`, and a broad set of test scripts use that compiler path. Removing the TypeScript 6 package would break the current test architecture even though it initially looks redundant.

The installed React typings are 19.3.0 because the manifest uses caret ranges while the React runtime is pinned to 19.2.8. This is a version-drift observation, not a demonstrated defect: current compilation/tests are designed around the installed tree, but the type/runtime minor-version mismatch should be kept visible during the next deliberate React upgrade.

## Security and supply-chain checks

- The 1.0.3 release validation reruns package/lockfile consistency, production build, and the repository license gate against the installed tree.
- `npm run licenses` scanned 152 installed npm package versions and found no GPL, LGPL, or AGPL requirements.
- Vulnerability/signature checks remain separate npm registry checks and should be rerun when dependency versions change rather than copied forward from an older dependency graph.

## Transitive dependency observations

The active PDF surface now comes from EmbedPDF. Any lower-level PDF engine packages are transitive implementation details of that dependency rather than Catalyst-owned reader architecture and should not be treated as a separate supported reader path.

Vite brings the expected modern build stack (`rolldown`, `lightningcss`, PostCSS, globbing utilities, and platform-native optional bindings). `npm ls` displays a number of `UNMET OPTIONAL DEPENDENCY` entries for alternate platforms and optional preprocessors/plugins. These are expected optional edges; the dependency tree command exits successfully and they are not missing required packages.

TypeScript 7 similarly exposes platform-specific optional compiler packages; the Windows x64 package is installed on the current machine. `@typescript/typescript6` depends on the aliased TypeScript 6 package `@typescript/old@6.0.3` for the compatibility test compiler.

## License posture

The npm license gate examined 152 installed package versions and reported no GPL, LGPL, or AGPL requirements. The direct dependency licenses observed are exclusively MIT and Apache-2.0.

The repository's normal `npm run licenses` wrapper is part of release validation and updates `license-audit-baseline.json` when dependency-license fingerprints change.

## Removed-dependency regression check

- EmbedPDF: active direct dependency and active source import in `src/viewer/EmbedPdfReader.tsx`.
- `pdfjs-dist`: removed from the active manifest/lockfile and no longer has an active reader implementation.
- Tauri packages: absent from `package.json` and `package-lock.json`.
- `src-tauri`: directory absent.
- Cargo/Tauri license logic remains conditional and reports Cargo auditing as not applicable when `src-tauri/Cargo.toml` is absent.
- XML runtime cutover tests explicitly guard against Tauri package/script/runtime regression.
- Vite still ignores a hypothetical `src-tauri` directory in its watch list. This is a harmless defensive/stale watch rule, not proof of a Tauri dependency.

## Findings and priorities

| Priority | Finding | Disposition |
| --- | --- | --- |
| No issue | Known-vulnerability audit is clean | No dependency change required |
| No issue | Every direct package has a current runtime, build, typing, or test role | No unused direct dependency identified |
| No issue | TypeScript 6 compatibility package is actively used by tests | Do not remove as “duplicate” without redesigning the test compiler path |
| Low | React/ReactDOM 19.3.0 and Vite 8.3.0 are newer than the pinned runtime/build versions | Treat as deliberate upgrade work, not urgent maintenance |
| Low | React type packages installed at 19.3.0 while runtime React remains 19.2.8 | Re-evaluate together with the next React upgrade; no current defect established |
| Medium release-hardening | `package.json` declares neither `engines` nor `packageManager` | Document/pin supported tooling before reproducible releases are treated as complete |

The effective Node compatibility floor is currently driven by Vite/plugin-react at Node `^20.19.0 || >=22.12.0`; `pdfmake` requires Node `>=20`, while EmbedPDF declares no stricter direct engine requirement. The current Node 24.13.0 environment satisfies all observed requirements. Catalyst's installer checks for npm and required local commands but does not currently enforce a Node version.

Version-range policy is mixed: React/ReactDOM, TypeScript, Vite, and the Vite React plugin are exact-pinned; EmbedPDF, export packages, and type packages use caret ranges. The practical drift risk is mitigated by `install.ps1` using `npm ci` and by the repository's package/lock consistency check. Lockfile refresh is already an explicit action.

## Audit conclusion

Dependency health is **good** for the current `1.0.3` tree. There is no license, missing-package, removed-framework-regression, or obvious unused-direct-dependency problem requiring immediate remediation. The dependency surface is substantially simpler than earlier Catalyst architectures.

For continued release hardening, the one dependency-policy item worth formalizing is the supported Node/npm toolchain. Available React and Vite minor upgrades should be evaluated as controlled compatibility work rather than folded into unrelated cleanup.

## Commands/evidence used

The audit used non-mutating checks including `npm ls`, `npm outdated --json`, production and full `npm audit --json`, `npm audit signatures`, `npm explain`, `npm view`, `npm run lockfile:check`, the read-only `scripts/check-npm-licenses.mjs`, direct manifest/config inspection, and source/test text searches for declared and removed dependencies.
