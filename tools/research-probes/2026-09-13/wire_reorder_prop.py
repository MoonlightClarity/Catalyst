from pathlib import Path
p=Path(r'C:\Users\iris\Downloads\Catalyst\src\App.tsx')
s=p.read_text(encoding='utf-8')
old='''            onOrganizeBranch={(noteId) => {
              dispatch({ type: "map/branch-layout-reset", noteId });
              setStatus("Branch arrangement restored");
            }}
            onResetLayout={() => {'''
new='''            onOrganizeBranch={(noteId) => {
              dispatch({ type: "map/branch-layout-reset", noteId });
              setStatus("Branch arrangement restored");
            }}
            onReorderOccurrence={(noteId, targetNoteId, placement) => {
              dispatch({ type: "map/occurrence-reordered", noteId, targetNoteId, placement });
              setStatus(placement === "before" ? "Branch moved earlier" : "Branch moved later");
            }}
            onResetLayout={() => {'''
if old not in s: raise SystemExit('App reorder insertion point missing')
p.write_text(s.replace(old,new,1),encoding='utf-8')
print('wired reorder prop')