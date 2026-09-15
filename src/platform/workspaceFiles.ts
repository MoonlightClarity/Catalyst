import type { WorkspaceState } from "../domain/types";
import { clearRecoveryJournal, durableWorkspaceState } from "../persistence/recoveryJournal";
import { replaceStoredWorkspaceXml } from "../persistence/xmlRepository";
import { serializeWorkspaceXml } from "../persistence/xml";

export const CATALYST_WORKSPACE_FILE_EXTENSION = ".catalyst.xml";
const CATALYST_SESSION_PICKER_ID = "catalyst-session";

interface CatalystFileHandle {
  getFile(): Promise<File>;
}

interface CatalystSaveHandle {
  readonly name?: string;
  createWritable(): Promise<{
    write(data: string): Promise<void>;
    close(): Promise<void>;
  }>;
}

type CatalystPickerWindow = Window & {
  showOpenFilePicker?: (options: Record<string, unknown>) => Promise<CatalystFileHandle[]>;
  showSaveFilePicker?: (options: Record<string, unknown>) => Promise<CatalystSaveHandle>;
};

function pickerTypes() {
  return [{
    description: "Catalyst session",
    accept: { "application/xml": [CATALYST_WORKSPACE_FILE_EXTENSION] },
  }];
}
export function workspaceFileName(title?: string): string {
  const date = new Date().toISOString().slice(0, 10);
  const fallback = `Catalyst-${date}`;
  const raw = (title ?? fallback)
    .trim()
    .replace(/\.catalyst\.xml$/i, "")
    .replace(/[<>:"/\\|?*\u0000-\u001f]/g, "-")
    .replace(/\s+/g, " ")
    .replace(/[. ]+$/g, "");
  return `${raw || fallback}${CATALYST_WORKSPACE_FILE_EXTENSION}`;
}

export function supportsWorkspaceOpenPicker(): boolean {
  return typeof (window as CatalystPickerWindow).showOpenFilePicker === "function";
}

export function supportsWorkspaceSavePicker(): boolean {
  return typeof (window as CatalystPickerWindow).showSaveFilePicker === "function";
}

export async function pickWorkspaceXmlFile(): Promise<File | null> {
  const picker = (window as CatalystPickerWindow).showOpenFilePicker;
  if (!picker) return null;
  const handles = await picker.call(window, {
    id: CATALYST_SESSION_PICKER_ID,
    multiple: false,
    excludeAcceptAllOption: true,
    types: pickerTypes(),
  });
  return handles[0] ? handles[0].getFile() : null;
}
export function downloadWorkspaceXml(state: WorkspaceState, title?: string): void {
  const xml = serializeWorkspaceXml(durableWorkspaceState(state));
  const blob = new Blob([xml], { type: "application/xml;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = workspaceFileName(title);
  anchor.style.display = "none";
  document.body.appendChild(anchor);
  anchor.click();
  anchor.remove();
  window.setTimeout(() => URL.revokeObjectURL(url), 0);
}

export async function saveWorkspaceXmlFile(
  state: WorkspaceState,
  title?: string,
): Promise<string | null> {
  const picker = (window as CatalystPickerWindow).showSaveFilePicker;
  if (!picker) {
    downloadWorkspaceXml(state, title);
    return workspaceFileName(title);
  }

  const suggestedName = workspaceFileName(title);
  const handle = await picker.call(window, {
    id: CATALYST_SESSION_PICKER_ID,
    suggestedName,
    excludeAcceptAllOption: true,
    types: pickerTypes(),
  });
  const writable = await handle.createWritable();
  await writable.write(serializeWorkspaceXml(durableWorkspaceState(state)));
  await writable.close();
  return handle.name || suggestedName;
}

export async function importWorkspaceXmlFile(file: File): Promise<WorkspaceState> {
  const xml = await file.text();
  const state = replaceStoredWorkspaceXml(xml);

  // An imported workspace must win over any stale crash-recovery snapshot.
  clearRecoveryJournal();
  return state;
}
