export type AnnotationLifecycleEvent = {
  type?: string;
};

export type AnnotationLoadScopeLike = {
  onAnnotationEvent?: (listener: (event: AnnotationLifecycleEvent) => void) => unknown;
};

/**
 * Subscribe to the one-shot initial annotation load event for a document.
 * The viewer adapter may report the document open before this event fires.
 */
export function subscribeToInitialAnnotationLoad(
  scope: AnnotationLoadScopeLike | null | undefined,
  onLoaded: () => void,
): () => void {
  if (!scope?.onAnnotationEvent) return () => {};

  const unsubscribe = scope.onAnnotationEvent((event) => {
    if (event?.type === "loaded") onLoaded();
  });

  return typeof unsubscribe === "function"
    ? (unsubscribe as () => void)
    : () => {};
}
