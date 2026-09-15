import { useMemo } from "react";
import type {
  TechniqueDefinition,
  WorkspaceState,
} from "../../domain/types";
import { TechniqueSection } from "./TechniqueSection";

type TechniquePatch = Partial<
  Pick<TechniqueDefinition, "name" | "summary" | "category" | "steps">
>;

export function TechniqueWorkspace({
  state,
  definitions,
  onAddRun,
  onUpdateRunDefinition,
  onUpdateResponse,
  onMoveRun,
  onIndentRun,
  onOutdentRun,
  onDeleteRun,
}: {
  state: WorkspaceState;
  definitions: TechniqueDefinition[];
  onAddRun: (
    definition: TechniqueDefinition,
    parentRunId?: string | null,
    afterRunId?: string | null,
  ) => string;
  onUpdateRunDefinition: (runId: string, patch: TechniquePatch) => void;
  onUpdateResponse: (runId: string, stepId: string, value: string) => void;
  onMoveRun: (runId: string, direction: "up" | "down") => void;
  onIndentRun: (runId: string) => void;
  onOutdentRun: (runId: string) => void;
  onDeleteRun: (runId: string) => void;
}) {
  const runs = useMemo(() => Object.values(state.techniqueRuns), [state.techniqueRuns]);

  return (
    <div className="technique-workspace">
      <TechniqueSection
        definitions={definitions}
        runs={runs}
        onAddRun={onAddRun}
        onUpdateRunDefinition={onUpdateRunDefinition}
        onUpdateResponse={onUpdateResponse}
        onMoveRun={onMoveRun}
        onIndentRun={onIndentRun}
        onOutdentRun={onOutdentRun}
        onDeleteRun={onDeleteRun}
      />
    </div>
  );
}
