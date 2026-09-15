import type {
  AnalyticalRole,
  Note,
  NoteLink,
  NoteSemantics,
  Relationship,
  RelationshipType,
} from "./types";

export const ANALYTICAL_ROLE_LABELS: Record<AnalyticalRole, string> = {
  note: "Note",
  claim: "Claim",
  assumption: "Assumption",
  hypothesis: "Hypothesis",
  question: "Question / gap",
  entity: "Entity",
  event: "Event",
};

export const RELATIONSHIP_TYPE_LABELS: Record<RelationshipType, string> = {
  "related-to": "Related to",
  supports: "Supports",
  contradicts: "Contradicts",
  "depends-on": "Depends on",
  "derived-from": "Derived from",
  about: "About",
  precedes: "Precedes",
};

export const RELATIONSHIP_TYPES: RelationshipType[] = [
  "related-to",
  "supports",
  "contradicts",
  "depends-on",
  "derived-from",
  "about",
  "precedes",
];

export const ANALYTICAL_ROLES: AnalyticalRole[] = [
  "note",
  "claim",
  "assumption",
  "hypothesis",
  "question",
  "entity",
  "event",
];

export function defaultRelationshipDirected(type: RelationshipType): boolean {
  return type !== "related-to";
}

export function defaultNoteSemantics(): NoteSemantics {
  return { roles: ["note"], confidence: null };
}

function isRole(value: unknown): value is AnalyticalRole {
  return typeof value === "string" && ANALYTICAL_ROLES.includes(value as AnalyticalRole);
}

function isRelationshipType(value: unknown): value is RelationshipType {
  return typeof value === "string" && RELATIONSHIP_TYPES.includes(value as RelationshipType);
}

export function sanitizeNoteSemantics(value: unknown): NoteSemantics {
  if (!value || typeof value !== "object") return defaultNoteSemantics();
  const candidate = value as Partial<NoteSemantics>;
  const roles: AnalyticalRole[] = Array.isArray(candidate.roles)
    ? [...new Set(candidate.roles.filter(isRole))]
    : ["note"];
  const confidence =
    candidate.confidence === "low" ||
    candidate.confidence === "medium" ||
    candidate.confidence === "high"
      ? candidate.confidence
      : null;
  return {
    roles: roles.length > 0 ? roles : ["note"],
    confidence,
  };
}

export function sanitizeNoteSemanticsMap(
  value: unknown,
  notes: Record<string, Note>,
): Record<string, NoteSemantics> {
  const candidate = value && typeof value === "object"
    ? value as Record<string, unknown>
    : {};
  const result: Record<string, NoteSemantics> = {};
  for (const noteId of Object.keys(notes)) {
    if (candidate[noteId]) result[noteId] = sanitizeNoteSemantics(candidate[noteId]);
  }
  return result;
}

function canonicalPair(left: string, right: string): [string, string] {
  return left < right ? [left, right] : [right, left];
}

function legacyRelationshipId(left: string, right: string): string {
  const [first, second] = canonicalPair(left, right);
  return `legacy:${encodeURIComponent(first)}:${encodeURIComponent(second)}`;
}

export function relationshipPairKey(fromId: string, toId: string): string {
  return canonicalPair(fromId, toId).join("\u0000");
}

export function sanitizeRelationship(
  value: unknown,
  notes: Record<string, Note>,
): Relationship | null {
  if (!value || typeof value !== "object") return null;
  const candidate = value as Partial<Relationship>;
  if (
    typeof candidate.id !== "string" ||
    typeof candidate.fromId !== "string" ||
    typeof candidate.toId !== "string" ||
    candidate.fromId === candidate.toId ||
    !notes[candidate.fromId] ||
    !notes[candidate.toId]
  ) return null;

  const type = isRelationshipType(candidate.type) ? candidate.type : "related-to";
  const createdAt = typeof candidate.createdAt === "string"
    ? candidate.createdAt
    : new Date(0).toISOString();
  const updatedAt = typeof candidate.updatedAt === "string"
    ? candidate.updatedAt
    : createdAt;

  return {
    id: candidate.id,
    fromId: candidate.fromId,
    toId: candidate.toId,
    type,
    directed: typeof candidate.directed === "boolean"
      ? candidate.directed
      : defaultRelationshipDirected(type),
    label: typeof candidate.label === "string" && candidate.label.trim()
      ? candidate.label.trim()
      : null,
    createdAt,
    updatedAt,
  };
}

export function relationshipsFromLegacyLinks(
  notes: Record<string, Note>,
  links: NoteLink[],
): Record<string, Relationship> {
  const byPair = new Map<string, NoteLink>();

  for (const link of links) {
    if (
      link.fromNoteId === link.toNoteId ||
      !notes[link.fromNoteId] ||
      !notes[link.toNoteId]
    ) continue;
    const pair = relationshipPairKey(link.fromNoteId, link.toNoteId);
    const existing = byPair.get(pair);
    if (!existing || link.createdAt < existing.createdAt) byPair.set(pair, link);
  }

  return Object.fromEntries(
    [...byPair.values()].map((link) => {
      const id = legacyRelationshipId(link.fromNoteId, link.toNoteId);
      return [
        id,
        {
          id,
          fromId: link.fromNoteId,
          toId: link.toNoteId,
          type: "related-to" as const,
          directed: false,
          label: null,
          createdAt: link.createdAt,
          updatedAt: link.createdAt,
        },
      ];
    }),
  );
}

export function hydrateRelationships(
  value: unknown,
  notes: Record<string, Note>,
  legacyLinks: NoteLink[],
): Record<string, Relationship> {
  const candidate = value && typeof value === "object"
    ? value as Record<string, unknown>
    : {};
  const sanitized = Object.fromEntries(
    Object.values(candidate)
      .map((relationship) => sanitizeRelationship(relationship, notes))
      .filter((relationship): relationship is Relationship => Boolean(relationship))
      .map((relationship) => [relationship.id, relationship]),
  );

  if (legacyLinks.length === 0) return sanitized;

  const merged = { ...sanitized };
  const representedPairs = new Set(
    Object.values(sanitized).map((relationship) =>
      relationshipPairKey(relationship.fromId, relationship.toId),
    ),
  );
  for (const relationship of Object.values(relationshipsFromLegacyLinks(notes, legacyLinks))) {
    const pair = relationshipPairKey(relationship.fromId, relationship.toId);
    if (representedPairs.has(pair)) continue;
    merged[relationship.id] = relationship;
    representedPairs.add(pair);
  }
  return merged;
}

export function newRelationship(
  fromId: string,
  toId: string,
  type: RelationshipType = "related-to",
): Relationship {
  const now = new Date().toISOString();
  return {
    id: crypto.randomUUID(),
    fromId,
    toId,
    type,
    directed: defaultRelationshipDirected(type),
    label: null,
    createdAt: now,
    updatedAt: now,
  };
}
