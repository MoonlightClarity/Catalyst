import { clearRecoveryJournal } from "../persistence/recoveryJournal";
import { clearStoredWorkspaceState } from "../persistence/xmlRepository";

export async function startFreshCatalystWorkspace(): Promise<void> {
  // New unloads only the active Catalyst workspace. Keep cached PDF bytes so a
  // saved session can be loaded again without destroying reusable local data.
  // External .catalyst.xml and PDF files are never deleted here.
  clearStoredWorkspaceState();
  clearRecoveryJournal();
}

