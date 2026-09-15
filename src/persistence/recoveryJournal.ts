import type { WorkspaceState } from "../domain/types";
import { hydrateWorkspaceState } from "./hydrate";

const JOURNAL_KEY = "catalyst.recovery.v1";
const JOURNAL_VERSION = 1;

type RecoveryEnvelope = {
  version: number;
  savedAt: string;
  state: WorkspaceState;
};

function storageAvailable(): boolean {
  try {
    return typeof window !== "undefined" && typeof window.localStorage !== "undefined";
  } catch {
    return false;
  }
}

export function durableWorkspaceState(state: WorkspaceState): WorkspaceState {
  return {
    ...state,
    pendingSelection: null,
  };
}

function looksLikeWorkspaceState(value: unknown): value is WorkspaceState {
  if (!value || typeof value !== "object") return false;
  const state = value as Partial<WorkspaceState>;
  return Boolean(
    state.documents &&
      state.annotations &&
      state.notes &&
      Array.isArray(state.links) &&
      state.techniqueRuns &&
      "activeDocumentId" in state &&
      "activeNoteId" in state,
  );
}

export function writeRecoveryJournal(state: WorkspaceState): void {
  if (!storageAvailable()) return;

  try {
    const envelope: RecoveryEnvelope = {
      version: JOURNAL_VERSION,
      savedAt: new Date().toISOString(),
      state: durableWorkspaceState(state),
    };
    window.localStorage.setItem(JOURNAL_KEY, JSON.stringify(envelope));
  } catch (error) {
    console.warn("Catalyst recovery journal write failed", error);
  }
}

export function readRecoveryJournal(): WorkspaceState | null {
  if (!storageAvailable()) return null;

  try {
    const raw = window.localStorage.getItem(JOURNAL_KEY);
    if (!raw) return null;

    const envelope = JSON.parse(raw) as RecoveryEnvelope;
    if (envelope?.version !== JOURNAL_VERSION || !looksLikeWorkspaceState(envelope.state)) {
      return null;
    }

    return hydrateWorkspaceState(envelope.state);
  } catch (error) {
    console.warn("Catalyst recovery journal read failed", error);
    return null;
  }
}

export function clearRecoveryJournal(): void {
  if (!storageAvailable()) return;

  try {
    window.localStorage.removeItem(JOURNAL_KEY);
  } catch (error) {
    console.warn("Catalyst recovery journal clear failed", error);
  }
}
