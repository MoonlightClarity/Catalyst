import type { WorkspaceState } from "../domain/types";
import { durableWorkspaceState } from "./recoveryJournal";
import { cloneInitialWorkspace, hydrateWorkspaceState } from "./hydrate";
import type { WorkspaceRepository } from "./repository";
import { deserializeWorkspaceXml, serializeWorkspaceXml } from "./xml";

export const CATALYST_XML_STORAGE_KEY = "catalyst.xml.workspace.v1";
export const LEGACY_JSON_STORAGE_KEY = "catalyst.browser.workspace.v1";

function readLegacyWorkspace(): WorkspaceState | null {
  const raw = window.localStorage.getItem(LEGACY_JSON_STORAGE_KEY);
  if (!raw) return null;

  try {
    return hydrateWorkspaceState(JSON.parse(raw) as WorkspaceState);
  } catch (error) {
    console.warn("Legacy browser workspace migration failed", error);
    return null;
  }
}


export function clearStoredWorkspaceState(): void {
  window.localStorage.removeItem(CATALYST_XML_STORAGE_KEY);
  window.localStorage.removeItem(LEGACY_JSON_STORAGE_KEY);
}

export function workspaceStateFromXml(xml: string): WorkspaceState {
  return hydrateWorkspaceState(deserializeWorkspaceXml(xml));
}

export function storeWorkspaceStateAsXml(state: WorkspaceState): void {
  window.localStorage.setItem(
    CATALYST_XML_STORAGE_KEY,
    serializeWorkspaceXml(durableWorkspaceState(state)),
  );
}

export function replaceStoredWorkspaceXml(xml: string): WorkspaceState {
  const state = workspaceStateFromXml(xml);
  storeWorkspaceStateAsXml(state);
  return state;
}

export class XmlWorkspaceRepository implements WorkspaceRepository {
  readonly kind = "xml" as const;

  async loadWorkspace(): Promise<WorkspaceState> {
    try {
      const raw = window.localStorage.getItem(CATALYST_XML_STORAGE_KEY);
      if (raw) {
        try {
          return workspaceStateFromXml(raw);
        } catch (error) {
          console.warn("Canonical XML workspace is unreadable; trying preserved legacy rollback", error);
          const rollback = readLegacyWorkspace();
          if (rollback) return rollback;
          return cloneInitialWorkspace();
        }
      }

      const legacy = readLegacyWorkspace();
      if (!legacy) return cloneInitialWorkspace();

      // Preserve the old JSON key as a rollback copy; XML becomes canonical.
      storeWorkspaceStateAsXml(legacy);
      return legacy;
    } catch (error) {
      console.warn("XML workspace load failed; starting with an empty workspace", error);
      return cloneInitialWorkspace();
    }
  }

  async sync(_previous: WorkspaceState, next: WorkspaceState): Promise<void> {
    storeWorkspaceStateAsXml(next);
  }

  async close(): Promise<void> {}
}
