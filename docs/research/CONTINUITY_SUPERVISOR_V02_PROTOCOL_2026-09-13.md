# Catalyst Continuity Supervisor v0.2 — research protocol — 2026-09-13

Status: **research/specification only**. This does not modify Catalyst product code or the validated Agent Workbench supervisor.

## Purpose

Specify the smallest layer needed to test correct long-horizon continuation under worker death, overlap, retries, explicit revocation, and ambiguous external effects.

The existing supervisor already proves process-independent job execution and semantic checkpoint recovery. v0.2 should test the missing semantics without replacing that supervisor.

Core rule:

> The durable job survives worker death; only the current authorized claim may advance authoritative state; external effects have their own durable identity and recovery state.

## Identity hierarchy

`Continuity Job > authority generation > claim generation > worker activation > process`

- **job_id**: stable identity of the long-horizon objective.
- **authority_generation**: one explicit user/coordinator authorization epoch.
- **claim_generation**: monotonically increasing ownership epoch within that authorization.
- **worker_id / activation_id**: one Chat/Codex/Commander/session activation.
- **process_id**: disposable runtime detail, never semantic identity.

## Authority envelope

One authority generation should persist at minimum:

`{job_id, authority_generation, authority_source, objective, acceptance_criteria, allowed_scope, allowed_tools, authorized_until, max_parallel_workers, max_successor_depth, resource_budget, stop_conditions, status, revoked_at, revoked_reason}`

Rules:
- workers may renew short claims only while the envelope is active;
- workers may not move `authorized_until`, widen scope/tools, remove stop conditions, or increase budgets;
- explicit revoke/cancel changes envelope status durably and invalidates every descendant/claim under that authority generation;
- later resume creates a **new** authority generation linked to the predecessor.

## Claim / fencing record

Recommended fields:

`{job_id, authority_generation, claim_generation, holder_worker_id, acquired_at, lease_expires_at, last_renewed_at, status}`

Acquire/takeover is a transactional compare-and-swap operation. A successor may take over only when policy permits it and increments `claim_generation` atomically.

Every authoritative state-changing commit must include `(job_id, authority_generation, claim_generation)`. A commit is rejected if either generation is stale or the authority envelope is no longer active.

Lease expiry identifies when takeover is allowed. **Fencing**, not the lease itself, prevents a revived stale worker from committing after takeover.

## Event ledger

Internal durable transitions should be append-only events plus materialized current state.

Minimal event shape:

`{event_id, job_id, authority_generation, claim_generation, seq, event_type, actor_worker_id, parent_event_id, created_at, payload_hash, payload}`

Candidate event types:
- `authority_created`, `authority_revoked`, `authority_expired`;
- `claim_acquired`, `claim_renewed`, `claim_superseded`, `claim_released`;
- `checkpoint_candidate`, `checkpoint_promoted`, `checkpoint_rejected`, `checkpoint_superseded`;
- `effect_intent_recorded`, `effect_attempted`, `effect_observed`, `effect_confirmed`, `effect_uncertain`, `effect_compensated`;
- `worker_started`, `worker_stopped`, `worker_failed`, `successor_requested`.

The append-only event sequence is audit/reconstruction truth. Materialized `current_*` rows are acceleration/convenience views and must be reproducible from authoritative events.

A worker may append observational evidence after becoming stale only if policy allows it, but stale evidence must never implicitly advance the current checkpoint or ownership state.

## Effect ledger

External effects need a stable semantic identity that survives retries and worker succession.

Recommended effect record:

`{operation_id, job_id, authority_generation, logical_step_id, effect_kind, target, intent_hash, recovery_class, state, idempotency_key, created_by_claim_generation, latest_attempt_id, attempt_count, result_ref, compensation_operation_id, last_error, created_at, updated_at}`

`operation_id` is stable for the *same intended effect* across retry/successor attempts. `attempt_id` is unique per dispatch.

Suggested effect states:
`planned -> dispatching -> confirmed`
with branches to `uncertain`, `reconciling`, `failed`, `compensating`, `compensated`, `manual_review`, or `cancelled_before_dispatch`.

Critical rule: a network/process failure after dispatch but before confirmation yields `uncertain`. It must not be normalized to `failed` because the external effect may already have occurred.

For targets supporting idempotency keys, use `operation_id` (or a deterministic derivative) so a successor can safely retry and recover the same logical result.

For targets without idempotency support, an `uncertain` effect must enter target-specific reconciliation before replay. If reliable reconciliation is impossible, classify the operation `manual-only` before dispatch.

## Effect recovery classes

- **retryable** — repeated execution is safe because the action is intrinsically idempotent or the target honors an idempotency key.
- **reconcilable** — target state can be inspected deterministically after ambiguity; replay happens only if reconciliation shows the effect absent.
- **compensatable** — successful effect has an explicit, separately tracked compensating action; compensation is itself idempotent/recoverable.
- **manual-only** — ambiguity or reversal is too consequential or unverifiable for automatic continuation.

Examples for the Catalyst development environment:
- deterministic file overwrite with expected before/after hashes: reconcilable;
- append without stable record identity: unsafe unless redesigned/idempotent;
- Git commit with known tree/commit identity: reconcilable;
- HTTP API call with provider idempotency key: retryable;
- UI click with no reliable observable postcondition: manual-only or requires a stronger adapter;
- reversible temporary environment change: compensatable when its inverse can be proven.

## Checkpoint promotion

A semantic checkpoint should be structured separately from free-form notes:

`{checkpoint_id, job_id, authority_generation, claim_generation, checkpoint_version, based_on_event_seq, repo_or_workspace_state, completed, unresolved, next_action, tests, effect_dependencies, constraints_digest, envelope_digest, created_at, status}`

Promotion to `authoritative` requires current fencing generations plus validation against the live source-of-truth hierarchy. A free-form handoff can accompany the checkpoint but cannot override structured fields or live validated state.

## Proposed local substrate for the research harness

Use one project-local SQLite database for v0.2 research state rather than extending free-form files into an ad-hoc concurrency protocol.

Why SQLite fits this bounded experiment:
- single-host Agent Workbench topology;
- atomic transactions survive process/OS interruption;
- one writer at a time simplifies ownership changes;
- `BEGIN IMMEDIATE` can reserve the write transaction for claim transitions;
- `PRIMARY KEY` / `UNIQUE` constraints can enforce stable effect IDs and event sequence identities;
- UPSERT / conditional UPDATE can implement compare-and-swap semantics;
- no server or network dependency.

Environment check on 2026-09-13: WSL Python 3.13 exposes SQLite `3.45.1` through the standard-library `sqlite3` module. The standalone `sqlite3` CLI was not found. No package installation is required for a Python research harness.

Do not make this database a Catalyst product dependency. It belongs beside the existing development supervisor until the experiment demonstrates value.

## Atomicity boundary

Internal ledger changes that must agree should occur in one SQLite transaction—for example: supersede old claim + increment claim generation + assign new holder + append `claim_acquired` event.

An external side effect cannot generally be made atomic with the local ledger. Use the outbox pattern instead: atomically commit the effect intent, then dispatch it separately with idempotency/reconciliation semantics.

Never write `effect_confirmed` before obtaining evidence that the target accepted or already contains the intended effect.

## Revocation boundary — important correction

Revocation can reliably prohibit **new authorized dispatches and state promotion** after the durable revoke event. It cannot make an external action that was already dispatched disappear.

Therefore revocation semantics must distinguish:
- `not_dispatched`: cancel immediately; never send;
- `dispatching/in_flight`: mark as crossing the revocation boundary, attempt target cancellation if available, then reconcile outcome;
- `confirmed`: do not pretend it was undone; compensate only when policy defines a safe compensating operation;
- `uncertain`: reconcile before any retry/compensation decision.

Every dispatcher must perform an authority+fence preflight immediately before dispatch, but there is still an unavoidable cross-system race between the local check and an external target accepting the action.

For high-consequence effects, prefer adapters that support target-side idempotency/cancellation or use a narrower human approval boundary.

The overnight acceptance criterion is therefore: **after revocation, no new effect intent or dispatch may be authorized; all effects already in flight are visible in the ledger and driven to a reconciled, compensated, or manual-review terminal state.**

Observational evidence may be recorded after revocation because accurate audit truth must survive cancellation. Observation is not authorization to perform new work.

## Core protocol operations

### Acquire claim
1. Start one immediate write transaction.
2. Verify authority generation is active, unexpired, and not revoked.
3. Read current claim/version.
4. If another unexpired claim exists, refuse takeover.
5. Otherwise increment `claim_generation`, assign holder/lease, append `claim_acquired`, commit atomically.

### Renew claim
Renew only when `(authority_generation, claim_generation, holder_worker_id)` still matches current state and the outer envelope remains active. Renewal extends only the short lease, never `authorized_until`.

### Revoke authority
Coordinator/user writes `authority_revoked` without needing worker cooperation, marks the authority generation inactive, and prevents all subsequent claim renewal/acquisition and effect dispatch under that generation. Descendant jobs/schedules must be registered so revocation can propagate to them.

### Prepare effect
Under a valid current claim, insert the stable `operation_id` + `intent_hash` before dispatch. If the operation already exists, return its existing state. If the same `operation_id` is presented with a different intent hash, fail closed as an identity conflict.

This mirrors production idempotency systems that bind a key to one logical request rather than treating a reused key as permission for different parameters.

## Core protocol operations

### Acquire claim
1. Start one immediate write transaction.
2. Verify authority generation is active, unexpired, and not revoked.
3. Read current claim/version.
4. If another unexpired claim exists, refuse takeover.
5. Otherwise increment `claim_generation`, assign holder/lease, append `claim_acquired`, commit atomically.

### Renew claim
Renew only when `(authority_generation, claim_generation, holder_worker_id)` still matches current state and the outer envelope remains active. Renewal extends only the short lease, never `authorized_until`.

### Revoke authority
Coordinator/user writes `authority_revoked` without needing worker cooperation, marks the authority generation inactive, and prevents all subsequent claim renewal/acquisition and effect dispatch under that generation. Descendant jobs/schedules must be registered so revocation can propagate to them.

### Prepare effect
Under a valid current claim, insert the stable `operation_id` + `intent_hash` before dispatch. If the operation already exists, return its existing state. If the same `operation_id` is presented with a different intent hash, fail closed as an identity conflict.

This mirrors production idempotency systems that bind a key to one logical request rather than treating a reused key as permission for different parameters.

### Dispatch and observe effect
1. Re-check current authority + claim immediately before dispatch.
2. Create an immutable `attempt_id` and record dispatch intent/attempt metadata.
3. Send the external action using stable `idempotency_key = operation_id` where supported.
4. Record provider receipt, target state evidence, or error as an immutable observation.

If the worker becomes stale while an effect is already in flight, it may submit evidence about that existing attempt, but it may not create a new attempt or advance the authoritative checkpoint.

A stale observation can automatically establish `confirmed` only when the evidence is independently strong enough under policy—for example, a provider response tied to the same idempotency key/intent hash. Otherwise the current claimant must reconcile the target.

### Reconcile uncertain effect
- query the target for a stable object/request/result identity when available;
- compare the observed target state to the effect intent;
- if present and matching, confirm without replay;
- if absent and recovery class permits, retry with the same operation identity;
- if conflicting or unverifiable, enter `manual_review`;
- never create a new semantic operation ID merely to escape ambiguity.

## Why attempts and operations are separate

A logical effect may have many execution attempts across worker deaths. The semantic operation must remain one object so retries, receipts, reconciliation evidence, and compensation all converge on the same history rather than appearing as unrelated actions.

## Memory promotion policy

Keep four layers distinct:
1. **scratch** — disposable worker notes/intermediate hypotheses;
2. **episodic record** — immutable evidence of what a worker/action actually did and what happened;
3. **memory candidate** — a derived lesson/fact proposed for reuse;
4. **institutional memory** — validated shared context deliberately loaded by future workers.

Default rule: history stays history. Durable memory is an exception requiring a promotion decision.

Recommended candidate fields:
`{candidate_id, memory_type, proposition, source_event_ids, source_artifacts, proposer_worker_id, confidence, validation_method, scope, proposed_at, status}`

Recommended institutional-memory fields:
`{memory_id, version, memory_type, content, provenance_refs, promoted_by, promotion_basis, scope, valid_from, supersedes, status}`

Memory types should distinguish at least `semantic`, `episodic-example`, and `procedural/policy`. Procedural/policy memory deserves the highest promotion threshold because it changes future worker behavior rather than merely informing it.

Workers may freely create scratch and candidates. Shared procedural/authority memory should be read-only to ordinary workers; changing it requires an explicit promotion path rather than a worker rewriting its own future rules.

### Promotion thresholds

**May auto-promote under narrow policy:**
- deterministic test/build result tied to exact command + artifact/repository state;
- immutable file/hash/version identity directly observed;
- mechanically verified process/job lifecycle fact;
- externally returned stable identifier or receipt whose provenance is retained.

**Require corroboration or coordinator review:**
- inferred architecture facts;
- conclusions synthesized from multiple sources;
- claims about why a failure occurred;
- new workflow heuristics;
- reusable interpretations of research evidence.

**Require explicit user/coordinator authorization:**
- changes to scope/permissions/authority;
- new stop/revocation semantics;
- procedural rules that enable additional tools/systems;
- instructions that materially change future autonomous behavior;
- claims that would override live source-of-truth state.

Institutional memory should be versioned and superseded, not silently overwritten. Retrieval should surface provenance/version so a successor can distinguish current policy from historical state.

A memory candidate derived from agent-authored prose must never become executable authority merely because it appears in a trusted directory.

## Failure-injection matrix

| Injection point | Expected recovery |
| --- | --- |
| crash before effect intent commits | no effect may dispatch; successor sees no committed operation |
| crash after intent commits, before dispatch | successor dispatches same `operation_id` |
| crash after external dispatch, before confirmation | effect becomes `uncertain`; retry only with target idempotency or after reconciliation |
| old worker resumes after successor claim | stale generation cannot create new authoritative events/effect attempts/checkpoints |
| old in-flight request returns after takeover | receipt may be recorded as evidence; current generation reconciles/promotes |
| two successors race to claim | one atomic generation transition wins; loser receives conflict and does not act |
| same operation submitted twice | UNIQUE operation identity resolves both attempts to one semantic effect |
| same operation ID with different parameters | hard identity/intent conflict; no dispatch |
| explicit revoke before dispatch | operation becomes cancelled-before-dispatch; no target call |
| explicit revoke while effect is in flight | no new dispatch; in-flight operation is reconciled/cancelled/compensated/manual-review |
| checkpoint prose conflicts with live repo/test state | checkpoint candidate rejected/superseded; conflict event retained |
| candidate memory contradicts authoritative source | no promotion; candidate retained with rejection basis |
| process dies during compensation | resume compensation from its own durable/idempotent operation state |

## Acceptance invariants

1. At most one claim generation is authoritative at a time.
2. A stale claim can never advance job state.
3. Every externally visible action has one stable logical `operation_id`.
4. `confirmed` always has retained evidence/provenance.
5. `uncertain` is never silently treated as absent.
6. Explicit revocation prevents every *new* authorized dispatch/claim/promotion under that authority generation.
7. Every descendant/schedule is discoverable from the authority family.
8. Institutional memory is reconstructible to its source evidence and promotion decision.
9. Fresh workers can recover correctly without reading predecessor chat history.

## Guarantee vocabulary

Avoid claiming generic `exactly-once` execution for arbitrary external tools/services.

Use narrower guarantees:
- **exactly-once authoritative ledger transition** — enforced locally by one transactional state store and uniqueness/version constraints;
- **at-least-once attempt** — an external step may be attempted again after ambiguous failure;
- **effectively-once effect** — repeated attempts converge to one logical result because the target supports idempotency or Catalyst reconciles/deduplicates by stable operation identity;
- **compensated** — an effect happened and a distinct compensating effect later restored the required business/project invariant;
- **manual-review** — the system refuses to guess when outcome or safe recovery cannot be established.

Production stream-processing systems make the same boundary explicit: exactly-once transactions cover state inside their transactional domain, not arbitrary side effects on unrelated external systems.

This vocabulary should appear in test reports so an apparently successful experiment does not overstate what was proven.

## Catalyst development effect adapters

### Local file mutation
Prefer expected-before + desired-after hashes. Before writing, verify the expected base; after ambiguity, hash/read the target. If it already equals desired state, confirm without replay. If it differs from both expected and desired state, stop for conflict reconciliation rather than overwrite concurrent work.

Raw append is weaker because retry can duplicate text. Where possible, replace append semantics with a record identity or check for an exact durable marker before retry.

### Build/test/read-only command
Read-only inspection and deterministic validation may be freely retried, but each result must retain command, cwd, relevant environment/repository state, timestamp, and exit status. A past passing test is not proof that the current tree still passes.

### Supervised process/job start
Use a stable semantic child/job identity above the generated systemd/process identity. Before starting a replacement, inspect whether that semantic job already has a live or completed activation. Duplicate activations must share the same parent operation record.

### Git/repository mutation
Use repository/tree/commit identity as reconciliation evidence. A commit/push operation should verify current HEAD/target ref before replay. Never infer success solely from a lost command response.

### Browser/UI mutation
Treat as weak unless there is a reliable observable postcondition. Draft insertion can be reconciled by reading composer state. Message send is ambiguous until the target conversation is inspected for the intended message/commit. Other remote-state UI actions default to manual/reconcilable rather than blind retry.

### Child/successor/scheduled continuation
Creating a successor is itself an effect. Give the child a stable semantic `child_job_id` and register parent authority lineage before launching any process/chat/session. Repeated launch attempts for the same child ID must resolve to the existing child rather than recursively create more descendants.

All detached/scheduled continuations must register under the parent authority generation so family revocation can discover them. An unregistered detached continuation is a continuity defect even if its individual command is harmless.

## Fresh-worker recovery algorithm

A replacement activation should recover in this order:
1. load the Continuity Job and current authority envelope;
2. refuse continuation if authority is expired/revoked;
3. inspect current claim and acquire a new fenced generation only if takeover policy permits;
4. load the latest authoritative structured checkpoint and replay ledger events after its `based_on_event_seq`;
5. reconcile every nonterminal `dispatching`/`uncertain` effect before dispatching unrelated new mutating work;
6. verify current repository/workspace/process state against checkpoint references;
7. load only current institutional memory/policy plus explicitly relevant episodic evidence;
8. rehydrate objective **and** constraints/stop conditions;
9. execute the next bounded action and checkpoint at an idempotent boundary.

The successor should be able to perform this procedure without reading predecessor chat history. Chat remains evidence/context, not a required runtime dependency.

## Minimal SQLite schema sketch

Research tables only; names are provisional:

- `jobs(job_id PK, created_at, title, status)`
- `authority_generations(job_id, authority_generation, status, authorized_until, envelope_json, envelope_hash, revoked_at, revoked_reason, PK(job_id, authority_generation))`
- `job_heads(job_id PK, current_authority_generation, current_claim_generation, holder_worker_id, lease_expires_at, checkpoint_version, last_event_id)`
- `events(event_id INTEGER PK, job_id, authority_generation, claim_generation, event_type, actor_worker_id, parent_event_id, payload_json, payload_hash, created_at)`
- `effects(operation_id PK, job_id, authority_generation, logical_step_id, intent_hash, effect_kind, target, recovery_class, state, idempotency_key, result_ref, compensation_operation_id, created_at, updated_at)`
- `effect_attempts(attempt_id PK, operation_id, claim_generation, worker_id, started_at, observed_at, outcome_kind, evidence_json, evidence_hash)`
- `checkpoints(checkpoint_id PK, job_id, authority_generation, claim_generation, checkpoint_version, based_on_event_id, state_digest, envelope_digest, data_json, status, created_at, UNIQUE(job_id, authority_generation, checkpoint_version))`
- `descendants(parent_job_id, child_job_id, authority_generation, relation, status, created_at, UNIQUE(parent_job_id, child_job_id, authority_generation))`
- `memory_candidates(candidate_id PK, job_id, memory_type, proposition, provenance_json, confidence, validation_method, scope, status, proposed_at)`
- `institutional_memory(memory_id, version, memory_type, content, provenance_json, scope, status, promoted_by, promotion_basis, valid_from, supersedes, PK(memory_id, version))`

All ownership-changing and authoritative promotion operations should run in one local transaction and condition on the current head/generation values. External effects happen outside that transaction and reconcile through the effect ledger.

## WSL storage placement

Do **not** place a WAL-mode research ledger under `C:\...` / `/mnt/c/...`.

Live filesystem check on 2026-09-13:
- `/home/iris` -> native `ext4` (`/dev/sdd`);
- `/mnt/c` -> WSL `9p`/DrvFS bridge.

SQLite WAL requires reliable same-host shared-memory/file-lock coordination, and current WSL2 reports document WAL/`-shm` failures on `/mnt/c`. Keep the authoritative SQLite database on native WSL storage.

Proposed research-only location:
`/home/iris/.agent-workbench-continuity-v02/continuity.sqlite3`

Mirror human-readable exports—not the live WAL database—into a Windows-visible research directory, for example:
`C:\Users\iris\AgentWorkbench\shared\supervisor-v02-research\exports\`

Exports may include current job summary, latest checkpoint, effect exceptions, revocation state, and append-only audit snapshots. The native database remains the concurrency/transaction source of truth.

If a Windows-native process must become a direct ledger writer later, revisit the storage architecture rather than opening the same WAL database across the WSL/Windows filesystem boundary.
