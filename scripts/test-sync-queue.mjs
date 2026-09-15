import assert from "node:assert/strict";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { createRequire } from "node:module";
import { catalystTestCompilerOptions } from "./test-compiler.mjs";

const nodeRequire = createRequire(import.meta.url);
const ts = nodeRequire("@typescript/typescript6");
const root = process.cwd();
const outDir = fs.mkdtempSync(path.join(os.tmpdir(), "catalyst-sync-"));

try {
  const program = ts.createProgram({
    rootNames: [
      path.join(root, "src/domain/types.ts"),
      path.join(root, "src/persistence/repository.ts"),
      path.join(root, "src/persistence/recoveryRetryRepository.ts"),
      path.join(root, "src/persistence/syncQueue.ts"),
    ],
    options: catalystTestCompilerOptions(ts, outDir),
  });

  const emit = program.emit();
  const diagnostics = ts
    .getPreEmitDiagnostics(program)
    .concat(emit.diagnostics)
    .filter((item) => item.category === ts.DiagnosticCategory.Error);

  assert.equal(
    diagnostics.length,
    0,
    diagnostics.map((d) => ts.flattenDiagnosticMessageText(d.messageText, "\n")).join("\n"),
  );

  global.window = {
    setTimeout: global.setTimeout.bind(global),
    clearTimeout: global.clearTimeout.bind(global),
  };

  const { WorkspaceSyncQueue } = nodeRequire(
    path.join(outDir, "persistence", "syncQueue.js"),
  );
  const { withRecoveryRetryBaseline } = nodeRequire(
    path.join(outDir, "persistence", "recoveryRetryRepository.js"),
  );

  const empty = {
    documents: {},
    annotations: {},
    viewerMarkups: {},
    notes: {},
    links: [],
    noteLinks: [],
    techniqueRuns: {},
    pendingSelection: null,
    activeDocumentId: null,
    activeNoteId: null,
    graphView: { positions: {}, camera: { x: 0, y: 0, zoom: 1 } },
  };

  const next = {
    ...empty,
    notes: {
      note: {
        id: "note",
        title: "Draft",
        body: "Body",
        createdAt: "2026-01-01T00:00:00.000Z",
        updatedAt: "2026-01-01T00:00:00.000Z",
            },
    },
  };

  let calls = 0;
  let failures = 0;
  let successes = 0;
  const repository = {
    kind: "memory",
    async loadWorkspace() { return empty; },
    async sync(previous, target) {
      calls += 1;
      assert.equal(previous, empty);
      assert.equal(target, next);
      if (calls === 1) throw new Error("simulated disk failure");
    },
    async close() {},
  };

  const queue = new WorkspaceSyncQueue(
    repository,
    empty,
    () => { failures += 1; },
    () => { successes += 1; },
  );

  queue.schedule(next);
  await queue.flushNow();
  assert.equal(calls, 1);
  assert.equal(failures, 1);
  assert.equal(successes, 0);

  // A subsequent user change/schedule is the explicit retry boundary.
  queue.schedule(next);
  await queue.flushNow();
  assert.equal(calls, 2);
  assert.equal(failures, 1);
  assert.equal(successes, 1);

  const edited = {
    ...next,
    notes: { ...next.notes, note: { ...next.notes.note, body: "Recovered plus new edit" } },
  };
  const later = {
    ...edited,
    notes: { ...edited.notes, note: { ...edited.notes.note, body: "Later durable edit" } },
  };
  const recoveryCalls = [];
  let recoveryAttempts = 0;
  const durableRepository = {
    kind: "memory",
    async loadWorkspace() { return empty; },
    async sync(previous, target) {
      recoveryCalls.push([previous, target]);
      recoveryAttempts += 1;
      if (recoveryAttempts === 1) throw new Error("recovery retry still unavailable");
    },
    async close() {},
  };
  const retryRepository = withRecoveryRetryBaseline(durableRepository, empty);
  await assert.rejects(() => retryRepository.sync(next, edited), /recovery retry still unavailable/);
  assert.equal(recoveryCalls[0][0], empty, "failed recovery retries must use the true durable baseline");
  await retryRepository.sync(next, edited);
  assert.equal(recoveryCalls[1][0], empty, "the durable baseline must survive until recovery sync succeeds");
  await retryRepository.sync(edited, later);
  assert.equal(recoveryCalls[2][0], edited, "normal incremental syncing should resume after recovery succeeds");

  console.log("Catalyst sync queue tests passed.");
} finally {
  fs.rmSync(outDir, { recursive: true, force: true });
}
