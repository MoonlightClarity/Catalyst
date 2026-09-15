import type { WorkspaceState } from "../domain/types";
import type { WorkspaceRepository } from "./repository";

export function withRecoveryRetryBaseline(
  repository: WorkspaceRepository,
  durableBaseline: WorkspaceState,
): WorkspaceRepository {
  let recoveryPending = true;

  return {
    kind: repository.kind,
    loadWorkspace: () => repository.loadWorkspace(),
    async sync(previous, next) {
      await repository.sync(recoveryPending ? durableBaseline : previous, next);
      recoveryPending = false;
    },
    close: () => repository.close(),
  };
}
