from pathlib import Path
root = Path(r'C:\Users\iris\Downloads\Catalyst')

def rep(rel, old, new):
    p = root / rel
    s = p.read_text(encoding='utf-8')
    if old not in s:
        raise SystemExit(f'missing snippet in {rel}: {old[:120]!r}')
    p.write_text(s.replace(old, new, 1), encoding='utf-8')

rep('src/domain/types.ts',
'''export type AnalysisMapRecord = {
  id: string;
  name: string;
  focusNoteId: string | null;
  occurrences: Record<string, MapOccurrence>;
  camera: GraphCamera;
};''',
'''export type MapFocusFrame = {
  noteId: string;
  camera: GraphCamera;
  activeNoteId: string | null;
};

export type AnalysisMapRecord = {
  id: string;
  name: string;
  focusNoteId: string | null;
  focusTrail?: MapFocusFrame[];
  occurrences: Record<string, MapOccurrence>;
  camera: GraphCamera;
};''')
rep('src/domain/mapView.ts',
'''  MapOccurrence,
  MapViewState,
  Note,''',
'''  MapOccurrence,
  MapFocusFrame,
  MapViewState,
  Note,''')

rep('src/domain/mapView.ts',
'''    name: DEFAULT_MAP_NAME,
    focusNoteId: null,
    occurrences: {},''',
'''    name: DEFAULT_MAP_NAME,
    focusNoteId: null,
    focusTrail: [],
    occurrences: {},''')

rep('src/domain/mapView.ts',
'''function sanitizeMap(
  id: string,''',
'''function sanitizeFocusTrail(
  value: unknown,
  occurrences: Record<string, MapOccurrence>,
  notes: Record<string, Note>,
): MapFocusFrame[] {
  if (!Array.isArray(value)) return [];
  return value.flatMap((raw) => {
    if (!raw || typeof raw !== "object") return [];
    const candidate = raw as Partial<MapFocusFrame>;
    if (typeof candidate.noteId !== "string" || !occurrences[candidate.noteId]) return [];
    const activeNoteId = typeof candidate.activeNoteId === "string" && notes[candidate.activeNoteId] && !notes[candidate.activeNoteId].deletedAt
      ? candidate.activeNoteId
      : null;
    return [{ noteId: candidate.noteId, camera: sanitizeGraphCamera(candidate.camera), activeNoteId }];
  }).slice(-20);
}

function sanitizeMap(
  id: string,''')
rep('src/domain/mapView.ts',
'''  const focusNoteId =
    typeof candidate.focusNoteId === "string" && occurrences[candidate.focusNoteId]
      ? candidate.focusNoteId
      : null;

  return {''',
'''  const focusNoteId =
    typeof candidate.focusNoteId === "string" && occurrences[candidate.focusNoteId]
      ? candidate.focusNoteId
      : null;
  const focusTrail = sanitizeFocusTrail(candidate.focusTrail, occurrences, notes);

  return {''')

rep('src/domain/mapView.ts',
'''    focusNoteId,
    occurrences,
    camera: sanitizeGraphCamera(candidate.camera ?? fallbackCamera),''',
'''    focusNoteId,
    focusTrail,
    occurrences,
    camera: sanitizeGraphCamera(candidate.camera ?? fallbackCamera),''')

rep('src/domain/workspace.ts',
'''  | { type: "map/camera-updated"; camera: Partial<GraphCamera> }
  | { type: "map/focus-set"; noteId: string | null }
  | { type: "map/collapse-set"; noteId: string; collapsed: boolean }''',
'''  | { type: "map/camera-updated"; camera: Partial<GraphCamera> }
  | { type: "map/focus-set"; noteId: string | null }
  | { type: "map/focus-back" }
  | { type: "map/focus-home"; noteId: string }
  | { type: "map/collapse-set"; noteId: string; collapsed: boolean }''')
rep('src/domain/workspace.ts',
'''    const focusNoteId = map.focusNoteId && deletedIds.has(map.focusNoteId)
      ? Object.keys(occurrences)[0] ?? null
      : map.focusNoteId;
    if (focusNoteId !== map.focusNoteId) changed = true;
    return [mapId, changed ? { ...map, occurrences, focusNoteId } : map];''',
'''    const focusNoteId = map.focusNoteId && deletedIds.has(map.focusNoteId)
      ? Object.keys(occurrences)[0] ?? null
      : map.focusNoteId;
    if (focusNoteId !== map.focusNoteId) changed = true;
    const focusTrail = (map.focusTrail ?? []).filter(
      (frame) => !deletedIds.has(frame.noteId) && (!frame.activeNoteId || !deletedIds.has(frame.activeNoteId)),
    );
    if (focusTrail.length !== (map.focusTrail ?? []).length) changed = true;
    return [mapId, changed ? { ...map, occurrences, focusNoteId, focusTrail } : map];''')

rep('src/domain/workspace.ts',
'''        if (action.noteId && !map.occurrences[action.noteId]) return map;
        if (map.focusNoteId === action.noteId) return map;
        return { ...map, focusNoteId: action.noteId };
      });
    }

    case "map/collapse-set":''',
'''        if (action.noteId && !map.occurrences[action.noteId]) return map;
        if (map.focusNoteId === action.noteId) return map;
        const focusTrail = map.focusNoteId
          ? [...(map.focusTrail ?? []), {
              noteId: map.focusNoteId,
              camera: map.camera,
              activeNoteId: state.activeNoteId,
            }].slice(-20)
          : (map.focusTrail ?? []);
        return { ...map, focusNoteId: action.noteId, focusTrail };
      });
    }

    case "map/focus-back": {''')
rep('src/domain/workspace.ts',
'''    case "map/focus-back": {''',
'''    case "map/focus-back": {
      const map = activeMapRecord(state.mapView);
      const focusTrail = map?.focusTrail ?? [];
      const frame = focusTrail.at(-1);
      if (!map || !frame || !map.occurrences[frame.noteId]) return state;
      const activeNoteId = frame.activeNoteId && state.notes[frame.activeNoteId] && !state.notes[frame.activeNoteId].deletedAt
        ? frame.activeNoteId
        : null;
      const nextMap = {
        ...map,
        focusNoteId: frame.noteId,
        camera: frame.camera,
        focusTrail: focusTrail.slice(0, -1),
      };
      return {
        ...state,
        activeNoteId,
        mapView: { ...state.mapView, maps: { ...state.mapView.maps, [map.id]: nextMap } },
      };
    }

    case "map/focus-home": {
      const map = activeMapRecord(state.mapView);
      if (!map || !map.occurrences[action.noteId]) return state;
      const focusTrail = map.focusTrail ?? [];
      const frame = focusTrail.find((item) => item.noteId === action.noteId);
      const activeNoteId = frame
        ? (frame.activeNoteId && state.notes[frame.activeNoteId] && !state.notes[frame.activeNoteId].deletedAt ? frame.activeNoteId : null)
        : state.activeNoteId;
      const nextMap = {
        ...map,
        focusNoteId: action.noteId,
        camera: frame?.camera ?? map.camera,
        focusTrail: [],
      };
      return {
        ...state,
        activeNoteId,
        mapView: { ...state.mapView, maps: { ...state.mapView.maps, [map.id]: nextMap } },
      };
    }

    case "map/collapse-set":''')
rep('src/features/analysis/WorkingPictureWorkspace.tsx',
'''  onCameraChange,
  onSetMapFocus,
  onSetCollapsed,''',
'''  onCameraChange,
  onSetMapFocus,
  onFocusBack,
  onFocusHome,
  onSetCollapsed,''')
rep('src/features/analysis/WorkingPictureWorkspace.tsx',
'''  onCameraChange: (camera: GraphCamera) => void;
  onSetMapFocus: (noteId: string) => void;
  onSetCollapsed:''',
'''  onCameraChange: (camera: GraphCamera) => void;
  onSetMapFocus: (noteId: string) => void;
  onFocusBack: () => void;
  onFocusHome: (noteId: string) => void;
  onSetCollapsed:''')
rep('src/features/analysis/WorkingPictureWorkspace.tsx',
'''  const [hoveredNoteId, setHoveredNoteId] = useState<string | null>(null);
  const [focusTrail, setFocusTrail] = useState<string[]>([]);

  const layout = useMemo(''',
'''  const [hoveredNoteId, setHoveredNoteId] = useState<string | null>(null);
  const focusTrail = state.mapView.maps[state.mapView.activeMapId]?.focusTrail ?? [];

  const layout = useMemo(''')
rep('src/features/analysis/WorkingPictureWorkspace.tsx',
'''  const navigateFocus = useCallback((noteId: string) => {
    const current = layout.focusNoteId;
    if (current && current !== noteId) {
      setFocusTrail((trail) => [...trail.filter((id) => id !== current), current].slice(-20));
    }
    onSetMapFocus(noteId);
    const target = nodeById.get(noteId);
    if (target) focusPoint(visiblePosition(noteId), Math.max(cameraRef.current.zoom, 0.82));
    onOpenNote(noteId);
  }, [focusPoint, layout.focusNoteId, nodeById, onOpenNote, onSetMapFocus, visiblePosition]);

  const goFocusBack = useCallback(() => {
    setFocusTrail((trail) => {
      if (trail.length === 0) return trail;
      const next = [...trail];
      const noteId = next.pop()!;
      if (state.notes[noteId] && !state.notes[noteId].deletedAt) {
        onSetMapFocus(noteId);
        const target = nodeById.get(noteId);
        if (target) focusPoint(visiblePosition(noteId), Math.max(cameraRef.current.zoom, 0.82));
        onOpenNote(noteId);
      }
      return next;
    });
  }, [focusPoint, nodeById, onOpenNote, onSetMapFocus, state.notes, visiblePosition]);

  const goHome = useCallback(() => {
    const home = layout.homeNoteId;
    if (!home) return;
    setFocusTrail([]);
    onSetMapFocus(home);
    const target = nodeById.get(home);
    if (target) focusPoint(visiblePosition(home), Math.max(cameraRef.current.zoom, 0.82));
  }, [focusPoint, layout.homeNoteId, nodeById, onSetMapFocus, visiblePosition]);''',
'''  const navigateFocus = useCallback((noteId: string) => {
    if (layout.focusNoteId === noteId) return;
    onSetMapFocus(noteId);
    const target = nodeById.get(noteId);
    if (target) focusPoint(visiblePosition(noteId), Math.max(cameraRef.current.zoom, 0.82));
    onOpenNote(noteId);
  }, [focusPoint, layout.focusNoteId, nodeById, onOpenNote, onSetMapFocus, visiblePosition]);

  const goFocusBack = useCallback(() => {
    if (focusTrail.length === 0) return;
    onFocusBack();
  }, [focusTrail.length, onFocusBack]);

  const goHome = useCallback(() => {
    const home = layout.homeNoteId;
    if (!home) return;
    const restoresSavedCamera = focusTrail.some((frame) => frame.noteId === home);
    onFocusHome(home);
    if (!restoresSavedCamera) {
      const target = nodeById.get(home);
      if (target) focusPoint(visiblePosition(home), Math.max(cameraRef.current.zoom, 0.82));
    }
  }, [focusPoint, focusTrail, layout.homeNoteId, nodeById, onFocusHome, visiblePosition]);''')
rep('src/App.tsx',
'''            onSetMapFocus={(noteId) => {
              dispatch({ type: "map/focus-set", noteId });
              setStatus(`Map focus · ${noteDisplayTitle(stateRef.current.notes[noteId])}`);
            }}
            onSetCollapsed={(noteId, collapsed) =>''',
'''            onSetMapFocus={(noteId) => {
              dispatch({ type: "map/focus-set", noteId });
              setStatus(`Map focus · ${noteDisplayTitle(stateRef.current.notes[noteId])}`);
            }}
            onFocusBack={() => {
              dispatch({ type: "map/focus-back" });
              setStatus("Returned to prior focus context");
            }}
            onFocusHome={(noteId) => {
              dispatch({ type: "map/focus-home", noteId });
              setStatus("Issue overview restored");
            }}
            onSetCollapsed={(noteId, collapsed) =>''')

print('focus context patched')