import type { AnalyticMarkPurpose } from "../../domain/types";

export type { AnalyticMarkPurpose } from "../../domain/types";

export type AnalyticMarkPreset = {
  id: AnalyticMarkPurpose;
  label: string;
  color: string;
  description: string;
};

export const ANALYTIC_MARK_PRESETS: AnalyticMarkPreset[] = [
  { id: "key-evidence", label: "Key evidence", color: "#f6c344", description: "Evidence or a passage central to the analysis" },
  { id: "contradiction", label: "Contradiction", color: "#ff6b6b", description: "Material that conflicts with another source, claim, or assumption" },
  { id: "uncertain", label: "Confidence concern", color: "#c77dff", description: "Ambiguous, weakly supported, or source-reliability-sensitive material" },
  { id: "follow-up", label: "Information gap", color: "#66d9e8", description: "A lead, gap, or question requiring additional collection or analysis" },
];

export function analyticMarkPurposeForColor(value: unknown): AnalyticMarkPurpose | null {
  if (typeof value !== "string") return null;
  const color = value.trim().toLowerCase();
  return ANALYTIC_MARK_PRESETS.find((preset) => preset.color.toLowerCase() === color)?.id ?? null;
}

function isAnalyticMarkPurpose(value: unknown): value is AnalyticMarkPurpose {
  return ANALYTIC_MARK_PRESETS.some((preset) => preset.id === value);
}

export type AnalyticMarkClassification = {
  purpose: AnalyticMarkPurpose;
  source: "explicit" | "legacy-color";
};

export function analyticMarkClassificationForAnnotationJson(
  annotationJson: string,
): AnalyticMarkClassification | null {
  try {
    const annotation = JSON.parse(annotationJson) as {
      type?: unknown;
      color?: unknown;
      custom?: Record<string, unknown>;
    };
    const custom = annotation?.custom;
    if (custom && Object.prototype.hasOwnProperty.call(custom, "catalystAnalyticPurpose")) {
      const explicitPurpose = custom.catalystAnalyticPurpose;
      return isAnalyticMarkPurpose(explicitPurpose)
        ? { purpose: explicitPurpose, source: "explicit" }
        : null;
    }

    const numericType = Number(annotation?.type);
    if (annotation?.type !== undefined && (!Number.isFinite(numericType) || numericType !== 9)) {
      return null;
    }
    const purpose = analyticMarkPurposeForColor(annotation?.color);
    return purpose ? { purpose, source: "legacy-color" } : null;
  } catch {
    return null;
  }
}

export function analyticMarkPurposeForAnnotationJson(
  annotationJson: string,
): AnalyticMarkPurpose | null {
  return analyticMarkClassificationForAnnotationJson(annotationJson)?.purpose ?? null;
}

export function withAnalyticMarkPurpose(
  annotationJson: string,
  purpose: AnalyticMarkPurpose | null,
): string {
  try {
    const annotation = JSON.parse(annotationJson) as Record<string, unknown>;
    const existingCustom = annotation.custom;
    const custom = existingCustom && typeof existingCustom === "object" && !Array.isArray(existingCustom)
      ? { ...(existingCustom as Record<string, unknown>) }
      : {};
    custom.catalystAnalyticPurpose = purpose;
    return JSON.stringify({ ...annotation, custom });
  } catch {
    return annotationJson;
  }
}
