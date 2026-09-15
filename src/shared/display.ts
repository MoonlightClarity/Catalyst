import type { Note } from "../domain/types";

export function noteDisplayTitle(note: Note): string {
  const title = note.title.trim();
  if (title) return title;

  const firstBodyLine = note.body
    .split(/\r?\n/)
    .map((line) => line.trim())
    .find(Boolean);

  return firstBodyLine || "Untitled note";
}

export function trimQuote(value: string, max = 220): string {
  if (value.length <= max) return value;
  return `${value.slice(0, max - 1).trimEnd()}…`;
}

export function wordCount(value: string): number {
  const normalized = value.trim();
  return normalized ? normalized.split(/\s+/).length : 0;
}

export function formatShortDate(value: string): string {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "";

  return new Intl.DateTimeFormat(undefined, {
    month: "short",
    day: "numeric",
    year: date.getFullYear() === new Date().getFullYear() ? undefined : "numeric",
  }).format(date);
}
