export type ResearchContextMode = "graph" | "techniques";
export type ResearchPane = "reader" | "context";

/** The reader owns only source navigation. */
export type ReaderLocation = {
  documentId: string | null;
  pageIndex: number | null;
};

export type ReaderHistory = {
  past: ReaderLocation[];
  current: ReaderLocation;
  future: ReaderLocation[];
};

export const MAX_RESEARCH_HISTORY = 80;

export function sameReaderLocation(
  left: ReaderLocation,
  right: ReaderLocation,
): boolean {
  return left.documentId === right.documentId && left.pageIndex === right.pageIndex;
}

export function createReaderHistory(current: ReaderLocation): ReaderHistory {
  return { past: [], current, future: [] };
}

export function replaceReaderLocation(
  history: ReaderHistory,
  current: ReaderLocation,
): ReaderHistory {
  if (sameReaderLocation(history.current, current)) return history;
  return { ...history, current };
}

export function visitReaderLocation(
  history: ReaderHistory,
  location: ReaderLocation,
): ReaderHistory {
  if (sameReaderLocation(history.current, location)) return history;
  return {
    past: [...history.past, history.current].slice(-MAX_RESEARCH_HISTORY),
    current: location,
    future: [],
  };
}

export function goBackInReaderHistory(history: ReaderHistory): ReaderHistory {
  const previous = history.past.at(-1);
  if (!previous) return history;
  return {
    past: history.past.slice(0, -1),
    current: previous,
    future: [history.current, ...history.future].slice(0, MAX_RESEARCH_HISTORY),
  };
}

export function goForwardInReaderHistory(history: ReaderHistory): ReaderHistory {
  const next = history.future[0];
  if (!next) return history;
  return {
    past: [...history.past, history.current].slice(-MAX_RESEARCH_HISTORY),
    current: next,
    future: history.future.slice(1),
  };
}

/** Keep reader history valid when a pathless/legacy document is reconnected under its content hash. */
export function remapReaderDocumentId(
  history: ReaderHistory,
  previousId: string,
  nextId: string,
): ReaderHistory {
  if (!previousId || !nextId || previousId === nextId) return history;
  const remap = (location: ReaderLocation): ReaderLocation =>
    location.documentId === previousId ? { ...location, documentId: nextId } : location;
  const past = history.past.map(remap);
  const current = remap(history.current);
  const future = history.future.map(remap);
  const changed = current !== history.current ||
    past.some((location, index) => location !== history.past[index]) ||
    future.some((location, index) => location !== history.future[index]);
  return changed ? { past, current, future } : history;
}
