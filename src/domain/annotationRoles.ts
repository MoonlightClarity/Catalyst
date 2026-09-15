import type {
  Annotation,
  AnnotationRole,
  WorkspaceState,
} from "./types";

const VALID_ROLES = new Set<AnnotationRole>(["excerpt", "highlight"]);

function sanitizeRoles(value: unknown): AnnotationRole[] {
  if (!Array.isArray(value)) return [];
  return [...new Set(value.filter(
    (item): item is AnnotationRole => typeof item === "string" && VALID_ROLES.has(item as AnnotationRole),
  ))];
}

export function hydrateAnnotationRoles(
  value: unknown,
  annotations: Record<string, Annotation>,
): Record<string, AnnotationRole[]> {
  const raw = value && typeof value === "object"
    ? value as Record<string, unknown>
    : {};
  const result: Record<string, AnnotationRole[]> = {};
  for (const annotation of Object.values(annotations)) {
    const roles = sanitizeRoles(raw[annotation.id]);
    if (!roles.includes(annotation.kind)) roles.push(annotation.kind);
    result[annotation.id] = roles;
  }

  return result;
}

export function rolesForAnnotation(
  state: Pick<WorkspaceState, "annotations" | "annotationRoles">,
  annotationId: string,
): AnnotationRole[] {
  const annotation = state.annotations[annotationId];
  if (!annotation) return [];
  const explicit = sanitizeRoles(state.annotationRoles[annotationId]);
  return explicit.length > 0
    ? explicit
    : [annotation.kind];
}

export function annotationRoleLabel(
  state: Pick<WorkspaceState, "annotations" | "annotationRoles">,
  annotationId: string,
): string {
  const roles = rolesForAnnotation(state, annotationId);
  if (roles.includes("excerpt") && roles.includes("highlight")) return "Excerpt / Highlight";
  return roles.includes("highlight") ? "Highlight" : "Excerpt";
}

export function annotationHasRole(
  state: Pick<WorkspaceState, "annotations" | "annotationRoles">,
  annotationId: string,
  role: AnnotationRole,
): boolean {
  return rolesForAnnotation(state, annotationId).includes(role);
}
