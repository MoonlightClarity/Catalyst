# Catalyst desktop release contract

Status: current maintenance contract for the Windows portable build.

## Purpose

Catalyst's distributable Windows shell is staged under `release/user-build/`, which is intentionally ignored by Git. That makes the staging tree a build product, not a source-of-truth location. A clean checkout therefore cannot reconstruct the desktop shell from tracked files alone unless the staging inputs are recreated separately.

This document records that boundary so a passing staging verification is not mistaken for full build reproducibility.

## Current shell behavior

The current 1.0 staging shell:

- serves packaged `dist/` assets on loopback only at `127.0.0.1:48715`;
- uses Electron single-instance locking and focuses the existing window on a second launch;
- enables `contextIsolation`, disables Node integration, and enables the renderer sandbox;
- denies new Electron windows and sends external HTTP(S) navigation to the system browser;
- packages with ASAR enabled and a portable Windows target.

`scripts/verify-user-release.mjs` validates these properties against the existing staging tree. `scripts/package-portable-release.ps1` verifies staging before packaging and uses a temporary output directory to avoid the observed in-tree Windows rename failure.

## Important reproducibility boundary

The verifier proves that an existing `release/user-build/` tree is internally consistent with the root package version and packaging contract. It does **not** prove that the ignored `main.cjs`, release `package.json`, or icon can be regenerated from a fresh clone. Those files are currently outside Git's tracked source set.

## Maintenance rule

Treat the ignored staging shell as release infrastructure that needs an explicit tracked-generation path before claiming clean-clone reproducible desktop builds. A future hardening pass should move the shell template/configuration into tracked source or add a deterministic staging generator, then make release verification compare generated staging against that source.

Until then:

1. do not edit a packaged executable to change shell behavior;
2. preserve the published GitHub asset digest as the authority for the published 1.0.0 binary;
3. use `npm run release:verify` before packaging an existing staging tree;
4. use `scripts/package-portable-release.ps1` for local portable builds;
5. describe local rebuilds as new builds, not byte-identical reproductions of the published asset unless their digest actually matches.

This is release-hardening debt, not a runtime failure in the published application.
## Tracked staging source — 2026-09-16

The desktop shell now has a tracked source path under `desktop-release/` plus `scripts/stage-desktop-release.mjs`. The staging script recreates `main.cjs`, `app-icon.png`, `dist/`, and a version-synchronized release `package.json` from tracked inputs and the current production build.

A clean checkout still needs dependency installation inside the generated staging directory before Electron Builder can package it, so this closes the source-input gap without claiming byte-for-byte reproducible binaries. The generated staging payload was compared with the existing 1.0 staging tree for the shell, icon, package manifest, `dist/index.html`, and complete `dist/` file set; they matched.
