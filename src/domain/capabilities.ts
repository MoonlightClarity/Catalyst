import type {
  CapabilityId,
  CapabilityProfileId,
  CapabilityState,
} from "./types";

export const CAPABILITY_IDS: CapabilityId[] = [
  "analyticalRoles",
  "typedRelationships",
  "confidence",
  "methods",
];

export const CAPABILITY_PROFILE_LABELS: Record<CapabilityProfileId, string> = {
  simple: "Simple",
  research: "Research",
  analytical: "Analytical",
  full: "Full",
};

export const CAPABILITY_PROFILES: Record<
  CapabilityProfileId,
  Record<CapabilityId, boolean>
> = {
  simple: {
    analyticalRoles: false,
    typedRelationships: false,
    confidence: false,
    methods: false,
  },
  research: {
    analyticalRoles: false,
    typedRelationships: false,
    confidence: false,
    methods: true,
  },
  analytical: {
    analyticalRoles: true,
    typedRelationships: true,
    confidence: true,
    methods: true,
  },
  full: {
    analyticalRoles: true,
    typedRelationships: true,
    confidence: true,
    methods: true,
  },
};

export const DEFAULT_CAPABILITY_STATE: CapabilityState = {
  profile: "research",
  overrides: {},
};

function isProfile(value: unknown): value is CapabilityProfileId {
  return value === "simple" ||
    value === "research" ||
    value === "analytical" ||
    value === "full";
}

function isCapability(value: string): value is CapabilityId {
  return CAPABILITY_IDS.includes(value as CapabilityId);
}

export function sanitizeCapabilityState(value: unknown): CapabilityState {
  if (!value || typeof value !== "object") {
    return { ...DEFAULT_CAPABILITY_STATE, overrides: {} };
  }

  const candidate = value as Partial<CapabilityState>;
  const profile = isProfile(candidate.profile) ? candidate.profile : DEFAULT_CAPABILITY_STATE.profile;
  const overrides: Partial<Record<CapabilityId, boolean>> = {};

  if (candidate.overrides && typeof candidate.overrides === "object") {
    for (const [key, enabled] of Object.entries(candidate.overrides)) {
      if (isCapability(key) && typeof enabled === "boolean") {
        overrides[key] = enabled;
      }
    }
  }

  return { profile, overrides };
}

export function capabilityEnabled(
  state: CapabilityState,
  capability: CapabilityId,
): boolean {
  const override = state.overrides[capability];
  return typeof override === "boolean"
    ? override
    : CAPABILITY_PROFILES[state.profile][capability];
}

export function effectiveCapabilities(
  state: CapabilityState,
): Record<CapabilityId, boolean> {
  return Object.fromEntries(
    CAPABILITY_IDS.map((id) => [id, capabilityEnabled(state, id)]),
  ) as Record<CapabilityId, boolean>;
}
