import { useMemo } from "react";
import type {
  RelationshipScope,
  RelationshipType,
  TechniqueDefinition,
  WorkspaceState,
} from "../../domain/types";
import { methodRelationshipTargets, outlineRelationshipTargets } from "../../domain/relationshipTargets";
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
  onCreateRelationship,
  onUpdateRelationship,
  onRetargetRelationship,
  onDeleteRelationship,
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
  onCreateRelationship: (scope: RelationshipScope, fromId: string, toId: string, type: RelationshipType) => void;
  onUpdateRelationship: (scope: RelationshipScope, id: string, type: RelationshipType) => void;
  onRetargetRelationship: (scope: RelationshipScope, id: string, fromId: string, toId: string) => void;
  onDeleteRelationship: (scope: RelationshipScope, id: string) => void;
}) {
  const runs = useMemo(() => Object.values(state.techniqueRuns), [state.techniqueRuns]);
  const relationshipTargets = useMemo(
    () => [...methodRelationshipTargets(state), ...outlineRelationshipTargets(state)],
    [state],
  );

  return (
    <div id="catalyst-surface-methods" className="technique-workspace" data-catalyst-surface="methods" role="region" aria-labelledby="catalyst-tab-methods">
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
        relationships={state.methodRelationships}
        crossRelationships={state.crossRelationships}
        relationshipTargets={relationshipTargets}
        onCreateRelationship={onCreateRelationship}
        onUpdateRelationship={onUpdateRelationship}
        onRetargetRelationship={onRetargetRelationship}
        onDeleteRelationship={onDeleteRelationship}
      />
    </div>
  );
}
