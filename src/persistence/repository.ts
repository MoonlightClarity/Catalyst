import type { WorkspaceState } from "../domain/types";

export type RepositoryKind = "xml";

export interface WorkspaceRepository {
  readonly kind: RepositoryKind;
  loadWorkspace(): Promise<WorkspaceState>;
  sync(previous: WorkspaceState, next: WorkspaceState): Promise<void>;
  close(): Promise<void>;
}
