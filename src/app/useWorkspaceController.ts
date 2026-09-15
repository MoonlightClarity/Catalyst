import { useCallback, useEffect, useRef, useState } from "react";
import type { WorkspaceState } from "../domain/types";
import { workspaceReducer, type WorkspaceAction } from "../domain/workspace";
import { clearRecoveryJournal, writeRecoveryJournal } from "../persistence/recoveryJournal";
import type { WorkspaceRepository } from "../persistence/repository";
import { WorkspaceSyncQueue } from "../persistence/syncQueue";

export function useWorkspaceController(
  initialState: WorkspaceState,
  repository: WorkspaceRepository,
  onPersistenceError: (error: unknown) => void,
  onPersistenceSuccess: () => void = () => {},
  onPersistencePending: () => void = () => {},
) {
  const [state, setState] = useState(initialState);
  const stateRef = useRef(initialState);
  const queueRef = useRef<WorkspaceSyncQueue | null>(null);

  if (!queueRef.current) {
    queueRef.current = new WorkspaceSyncQueue(
      repository,
      initialState,
      onPersistenceError,
      (persistedState) => {
        // Clear the synchronous recovery journal only when the exact latest
        // state has reached the durable repository. If newer edits exist,
        // their journal remains available across a refresh/crash.
        if (stateRef.current === persistedState) clearRecoveryJournal();
        onPersistenceSuccess();
      },
    );
  }

  const dispatch = useCallback((action: WorkspaceAction) => {
    const previous = stateRef.current;
    const next = workspaceReducer(previous, action);
    if (next === previous) return next;

    stateRef.current = next;
    setState(next);

    // The synchronous recovery journal closes the refresh window before the
    // debounced durable repository write completes.
    onPersistencePending();
    writeRecoveryJournal(next);
    queueRef.current?.schedule(next);
    return next;
  }, []);

  const flush = useCallback(
    () => queueRef.current?.flushNow() ?? Promise.resolve(),
    [],
  );

  useEffect(() => {
    const onVisibilityChange = () => {
      if (document.visibilityState === "hidden") void flush();
    };

    const onPageHide = () => void flush();

    window.addEventListener("pagehide", onPageHide);
    document.addEventListener("visibilitychange", onVisibilityChange);

    return () => {
      window.removeEventListener("pagehide", onPageHide);
      document.removeEventListener("visibilitychange", onVisibilityChange);
      void flush();
    };
  }, [flush]);

  return {
    state,
    stateRef,
    dispatch,
    flush,
  };
}
