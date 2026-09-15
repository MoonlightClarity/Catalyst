# Catalyst dependency audit

Audit date: 2026-09-15  
Project version: `0.6.3-alpha.3`  
Scope: active npm manifest/lockfile, installed dependency tree, source/test/config usage, registry freshness, security advisories, package signatures, licenses, and removed-dependency regression checks.

This audit is observational. No source code, configuration, manifest, lockfile, dependency version, or generated build artifact was changed. The only project change from this pass is this documentation file.

## Executive result

Catalyst has a small and currently healthy direct dependency surface: three runtime packages and six development packages. `npm audit` reports zero known vulnerabilities for both production-only and full trees. The package/lockfile consistency check passes, the installed tree is satisfied, all 29 installed package versions checked by npm have verified registry signatures, and 15 have verified attestations.

The license scan found no GPL, LGPL, or AGPL requirements in the installed npm tree. Direct packages are MIT or Apache-2.0 licensed.

No active EmbedPDF or Tauri package dependency exists. Neither `package.json` nor `package-lock.json` contains EmbedPDF, `@tauri`, Tauri plugin, or Tauri build packages, and there is no `src-tauri` directory. Remaining `src-tauri` strings in test/license/watch tooling are guards or conditional legacy checks, not an active runtime dependency.

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
| `pdfjs-dist` | `^6.3.289` | 6.3.289 | 6.3.289 | Active PDF reader/annotation surface | Apache-2.0 | Keep |
| `react` | `19.2.8` | 19.2.8 | 19.3.0 | Active application UI | MIT | Keep; minor update available |
| `react-dom` | `19.2.8` | 19.2.8 | 19.3.0 | Active browser root rendering | MIT | Keep; minor update available |
| `@types/react` | `^19.2.2` | 19.3.0 | 19.3.0 | React compile-time types | MIT | Keep |
| `@types/react-dom` | `^19.2.2` | 19.3.0 | 19.3.0 | React DOM compile-time types | MIT | Keep |
| `@typescript/typescript6` | `6.0.2` | 6.0.2 | 6.0.2 | Deliberate TypeScript 6 test compiler | Apache-2.0 | Keep; actively used by test harness |
| `@vitejs/plugin-react` | `6.1.1` | 6.1.1 | 6.1.1 | React/Vite build integration | MIT | Keep |
| `typescript` | `7.0.2` | 7.0.2 | 7.0.2 | Primary build compiler (`tsc -b`) | Apache-2.0 | Keep |
| `vite` | `8.2.2` | 8.2.2 | 8.3.0 | Dev server and production bundler | MIT | Keep; minor update available |

The TypeScript 6 + TypeScript 7 pairing is intentional. TypeScript 7 is used by the normal build command. `scripts/test-compiler.mjs` loads `@typescript/typescript6`, and a broad set of test scripts use that compiler path. Removing the TypeScript 6 package would break the current test architecture even though it initially looks redundant.

The installed React typings are 19.3.0 because the manifest uses caret ranges while the React runtime is pinned to 19.2.8. This is a version-drift observation, not a demonstrated defect: current compilation/tests are designed around the installed tree, but the type/runtime minor-version mismatch should be kept visible during the next deliberate React upgrade.

## Security and supply-chain checks

- `npm audit --omit=dev --json`: 0 vulnerabilities at all severities.
- `npm audit --json`: 0 vulnerabilities at all severities.
- `npm audit signatures`: 29 installed packages have verified registry signatures; 15 have verified attestations.
- No security-driven upgrade is indicated by the registry audit performed on this date.

## Transitive dependency observations

`pdfjs-dist` brings in optional `@napi-rs/canvas`, including the Windows x64 native package on this machine and optional platform packages for other operating systems/architectures. This is transitive PDF.js tooling, not a Catalyst-owned native runtime layer. It should not be confused with a return to Tauri or another desktop framework.

Vite brings the expected modern build stack (`rolldown`, `lightningcss`, PostCSS, globbing utilities, and platform-native optional bindings). `npm ls` displays a number of `UNMET OPTIONAL DEPENDENCY` entries for alternate platforms and optional preprocessors/plugins. These are expected optional edges; the dependency tree command exits successfully and they are not missing required packages.

TypeScript 7 similarly exposes platform-specific optional compiler packages; the Windows x64 package is installed on the current machine. `@typescript/typescript6` depends on the aliased TypeScript 6 package `@typescript/old@6.0.3` for the compatibility test compiler.

## License posture

The read-only npm license scanner examined 29 installed package versions and reported no GPL, LGPL, or AGPL requirements. The direct dependency licenses observed are exclusively MIT and Apache-2.0.

The repository's normal `npm run licenses` wrapper can update `license-audit-baseline.json` when fingerprints change, so this audit intentionally invoked the read-only npm scanner directly rather than mutating the license baseline.

## Removed-dependency regression check

- EmbedPDF: absent from `package.json` and `package-lock.json`; no active source import found.
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
| Medium release-hardening | `package.json` declares neither `engines` nor `packageManager` | Document/pin supported tooling before beta/release reproducibility is treated as complete |

The effective Node compatibility floor is currently driven by direct dependencies: `pdfjs-dist@6.3.289` declares Node `>=22.13.0 || >=24`, while Vite/plugin-react require Node `^20.19.0 || >=22.12.0`. The current Node 24.13.0 environment satisfies all observed requirements. Catalyst's installer checks for npm and required local commands but does not currently enforce a Node version.

Version-range policy is mixed: React/ReactDOM, TypeScript, Vite, and the Vite React plugin are exact-pinned; PDF.js and React type packages use caret ranges. The practical drift risk is mitigated by `install.ps1` using `npm ci` and by the repository's package/lock consistency check. Lockfile refresh is already an explicit action.

## Audit conclusion

Dependency health is **good** for the current alpha. There is no security, license, missing-package, removed-framework-regression, or obvious unused-direct-dependency problem requiring immediate remediation. The dependency surface is substantially simpler than earlier Catalyst architectures.

Before beta/release hardening, the one dependency-policy item worth formalizing is the supported Node/npm toolchain. Available React and Vite minor upgrades should be evaluated as controlled compatibility work rather than folded into unrelated cleanup.

## Commands/evidence used

The audit used non-mutating checks including `npm ls`, `npm outdated --json`, production and full `npm audit --json`, `npm audit signatures`, `npm explain`, `npm view`, `npm run lockfile:check`, the read-only `scripts/check-npm-licenses.mjs`, direct manifest/config inspection, and source/test text searches for declared and removed dependencies.
