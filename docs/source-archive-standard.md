# Catalyst source and research handoff standard

**Status:** Normative for future source/checkpoint handoffs  
**Introduced:** 2026-09-11

## 1. Purpose

Catalyst's architecture is being driven by sustained research as well as implementation. A source archive that contains code but omits the research history can reproduce the executable state while losing the reasons that constrain the next design decision.

Therefore research artifacts are first-class source artifacts.

> A Catalyst source handoff is incomplete if a future maintainer can compile the code but cannot recover the current research synthesis, major decisions, rejected approaches, and next-step constraints.

## 2. Required source-archive content

A chat-friendly source archive must include:

- application source and configuration;
- `package.json` / lockfiles;
- build/test/release scripts;
- documentation and ADRs;
- `docs/research/` as defined below;
- complete active web/XML runtime and persistence source/configuration; the archived `legacy/tauri-shell/` is optional historical material rather than an ordinary active-source handoff requirement;
- static/public assets required by the application;
- test fixtures that are intentionally part of the repository.

Generated build output must be excluded. Archived native-shell source may be included for historical/native-shell work, but ordinary active-runtime handoffs may exclude `legacy/tauri-shell/`.

## 3. Required research directory

`docs/research/` must contain, at minimum:

- `README.md` — research archive/handoff index and current-authority pointer;
- `CURRENT_STATE.md` — preserved research-era state snapshot when present; the root `CURRENT_STATE.md` is current authority;
- `RESEARCH_SYNTHESIS.md` — integrated findings;
- `DECISION_LOG.md` — preserved research-era decision history; root `DECISION_LOG.md` and newer ADRs govern current decisions;
- `PASS_LOG.md` — chronology of major research passes;
- `SOURCE_INDEX.md` — authoritative/high-value sources grouped by theme;
- `ENGINEERING_FINDINGS.md` — relevant implementation/runtime facts and their resolution status;
- `NEXT_STEPS.md` — dated research-era sequencing/history; current execution order comes from root `NEXT_STEPS.md`, `docs/roadmap.md`, and the current release-readiness gate;
- `PORTRAYAL_EXECUTION.md` or the current equivalent execution-focused synthesis;
- dated pass documents for material new research after the last synthesis;
- `screenshots/` for runtime images that caused a material design/architecture pivot.

Normative design specifications and ADRs remain in their normal `docs/` / `docs/adr/` locations and are referenced rather than duplicated where possible.

## 4. After each meaningful research pass

A pass is meaningful when it changes a design law, architecture assumption, execution method, source interpretation, or next-step recommendation.

Before the pass is considered complete:

1. create/update a dated pass document in `docs/research/`;
2. append the pass to `PASS_LOG.md`;
3. add newly relied-on high-value sources to `SOURCE_INDEX.md`;
4. update `RESEARCH_SYNTHESIS.md` if the integrated model changed;
5. update the root `DECISION_LOG.md` or a newer ADR when a conclusion becomes a current durable constraint; preserve dated research decision logs as history;
6. update root `CURRENT_STATE.md` when the current product boundary changes, and update dated research findings/handoffs where they preserve new evidence or chronology;
7. update any normative design specification/ADR that the new research formally changes;
8. generate a standalone research checkpoint ZIP;
9. ensure the normal source archive includes the updated research directory.

Research notes are not a replacement for ADRs. Research explains the evidence and reasoning; ADRs record accepted architectural decisions.

## 5. Runtime screenshots as research evidence

When a screenshot causes a material product/design pivot:

- retain a copy under `docs/research/screenshots/`;
- document what the screenshot demonstrated;
- do not rely on the image alone—record the interpretation in text;
- keep screenshots that demonstrate rejected renderer generations so the same failure is not rediscovered.

Do not place ordinary transient screenshots in the repository.

## 6. Runtime source rule

The active runtime is the Vite/web application with canonical XML workspace persistence under `src/persistence/xml.ts` and `src/persistence/xmlRepository.ts`. These files are required source and must not be omitted from future source archives.

The retired Tauri shell is preserved under `legacy/tauri-shell` for historical reference and possible future reuse, but it is not part of the active runtime and may be excluded from ordinary active-source handoffs.

The archive may exclude heavyweight/generated content such as:

- `legacy/tauri-shell/` when producing an active-runtime handoff;
- frontend `node_modules/`;
- `dist/` / build output;
- compiler caches;
- repository metadata;
- old handoff ZIPs and other generated release archives.

This rule preserves the complete active persistence/runtime boundary without reintroducing archived native-shell dependencies.

## 7. Research/source checkpoint naming

Recommended standalone research checkpoint:

```text
catalyst-research-handoff-YYYY-MM-DD-<pass-name>.zip
```

A rolling convenience copy may also be produced:

```text
catalyst-research-handoff-latest.zip
```

Source checkpoints should use an explicit version/checkpoint name rather than silently replacing an earlier materially different archive.

## 8. Handoff validation

A source/checkpoint handoff is not complete until:

- required research files exist and are non-empty;
- normative docs referenced by research exist;
- the source archive contains `docs/research/`;
- the source archive contains the complete active web/XML runtime and persistence boundary; archived Tauri/Rust material is optional unless the checkpoint explicitly includes legacy/native-shell work;
- the research checkpoint can be opened independently of chat history;
- checksums are produced for externally handed-off ZIPs where practical.

## 9. Principle

> Research is part of Catalyst's source of truth.

Code records what the current implementation does. Research records why the architecture is moving in its current direction and which apparently attractive alternatives have already been tested or rejected. Both are necessary to continue the project safely across chat/session handoffs.
