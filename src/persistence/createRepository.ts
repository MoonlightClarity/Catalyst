import { XmlWorkspaceRepository } from "./xmlRepository";
import type { WorkspaceRepository } from "./repository";

export async function createWorkspaceRepository(): Promise<WorkspaceRepository> {
  return new XmlWorkspaceRepository();
}
