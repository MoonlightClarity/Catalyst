import { hydrateAnnotationRoles } from "../domain/annotationRoles";
import { hydrateRelationships, sanitizeNoteSemanticsMap } from "../domain/analysis";
import { sanitizeCapabilityState } from "../domain/capabilities";
import { sanitizeGraphView } from "../domain/graphView";
import { sanitizeAnalysisRoot, sanitizeOutline, sanitizeOutlineSession } from "../domain/outline";
import type { WorkspaceState } from "../domain/types";
import { initialWorkspaceState } from "../domain/workspace";

export function cloneInitialWorkspace(): WorkspaceState {
  return JSON.parse(JSON.stringify(initialWorkspaceState)) as WorkspaceState;
}

export function hydrateWorkspaceState(parsed: WorkspaceState): WorkspaceState {
  const graphView = sanitizeGraphView(parsed.graphView);
  const rawTechniqueRuns = Object.fromEntries(
    Object.entries(parsed.techniqueRuns ?? {}).map(([id, run]) => [
      id,
      {
        ...run,
        parentRunId:
          run.parentRunId && run.parentRunId !== id && parsed.techniqueRuns?.[run.parentRunId]
            ? run.parentRunId
            : null,
      },
    ]),
  );
  for (const run of Object.values(rawTechniqueRuns)) {
    const seen = new Set([run.id]);
    let parentRunId = run.parentRunId ?? null;
    while (parentRunId) {
      if (seen.has(parentRunId)) {
        rawTechniqueRuns[run.id] = { ...run, parentRunId: null };
        break;
      }
      seen.add(parentRunId);
      parentRunId = rawTechniqueRuns[parentRunId]?.parentRunId ?? null;
    }
  }
  const techniqueRuns: typeof rawTechniqueRuns = {};
  const parentIds = new Set<string | null>([
    null,
    ...Object.values(rawTechniqueRuns).map((run) => run.parentRunId ?? null),
  ]);
  for (const parentRunId of parentIds) {
    Object.values(rawTechniqueRuns)
      .filter((run) => (run.parentRunId ?? null) === parentRunId)
      .sort((left, right) =>
        (left.sequenceIndex ?? Number.MAX_SAFE_INTEGER) -
          (right.sequenceIndex ?? Number.MAX_SAFE_INTEGER) ||
        left.createdAt.localeCompare(right.createdAt) ||
        left.id.localeCompare(right.id),
      )
      .forEach((run, sequenceIndex) => {
        techniqueRuns[run.id] = { ...run, parentRunId, sequenceIndex };
      });
  }
  const base = {
    ...cloneInitialWorkspace(),
    ...parsed,
    viewerMarkups: parsed.viewerMarkups ?? {},
    noteLinks: parsed.noteLinks ?? [],
    techniqueRuns,
    graphView,
    capabilities: sanitizeCapabilityState(parsed.capabilities),
    pendingSelection: null,
  };
  const analysisRoot = sanitizeAnalysisRoot(parsed.analysisRoot);
  const outline = sanitizeOutline(parsed.outline, base.notes);
  const outlineSession = sanitizeOutlineSession(parsed.outlineSession, outline);
  const requestedDocumentId = parsed.activeDocumentId ?? null;
  const requestedNoteId = parsed.activeNoteId ?? null;
  const resolvedActiveDocumentId =
    requestedDocumentId && base.documents[requestedDocumentId]
      ? requestedDocumentId
      : Object.values(base.documents)
          .sort((left, right) => right.lastOpenedAt.localeCompare(left.lastOpenedAt))[0]?.id ?? null;
  const resolvedActiveNoteId =
    requestedNoteId && base.notes[requestedNoteId]
      ? requestedNoteId
      : null;
  return {
    ...base,
    analysisRoot,
    outline,
    outlineSession,
    activeDocumentId: resolvedActiveDocumentId,
    activeNoteId: resolvedActiveNoteId,
    noteSemantics: sanitizeNoteSemanticsMap(parsed.noteSemantics, base.notes),
    relationships: hydrateRelationships(parsed.relationships, base.notes, base.noteLinks),
    annotationRoles: hydrateAnnotationRoles(parsed.annotationRoles, base.annotations),
  };
}
