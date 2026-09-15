from pathlib import Path
import shutil

ROOT = Path(r"C:\Users\iris\Downloads\Catalyst")
TOOLS = ROOT / "tools" / "svg-research"
BACKUP = ROOT / ".catalyst-backups" / "svg-prune-20260913"
BACKUP.mkdir(parents=True, exist_ok=True)

def patch(name, replacements):
    path = TOOLS / name
    shutil.copy2(path, BACKUP / name)
    text = path.read_text(encoding="utf-8")
    for old, new in replacements:
        if old not in text:
            raise RuntimeError(f"Expected text not found in {name}: {old[:90]}")
        text = text.replace(old, new, 1)
    path.write_text(text, encoding="utf-8")

patch("generate-brand-matrix.mjs", [
    ("const project='C:\\\\Users\\\\iris\\\\Downloads\\\\Catalyst',out=path.join(project,'public','generated','catalyst-svg-research-20260913-brand-matrix');fs.mkdirSync(out,{recursive:true});", "const project='C:\\\\Users\\\\iris\\\\Downloads\\\\Catalyst',out=path.join(project,'public','generated','catalyst-svg-research-20260913-brand-matrix');fs.rmSync(out,{recursive:true,force:true});fs.mkdirSync(out,{recursive:true});"),
    ("const junctions={diamond:R(29.5,29.5,5,5,'transform=\"rotate(45 32 32)\"'),square:R(29,29,6,6),dot:C(32,32,3,'fill=\"currentColor\" stroke=\"none\"'),ring:C(32,32,4),cross:P('M27 32h10 M32 27v10'),corner:P('M28 28h8v8')};", "const junctions={diamond:R(29.5,29.5,5,5,'transform=\"rotate(45 32 32)\"')};"),
    ("const inputs={two:P('M5 15h12l15 17 M5 49h12l15-17'),three:P('M5 12h12l15 20 M5 32h27 M5 52h12l15-20'),four:P('M5 8h10l17 24 M5 24h16l11 8 M5 40h16l11-8 M5 56h10l17-24')};", "const inputs={three:P('M5 12h12l15 20 M5 32h27 M5 52h12l15-20')};"),
    ("const outputs={one:P('M32 32h27'),two:P('M32 32h10l17-17 M42 32l17 17'),three:P('M32 32h10 M42 32l17-22 M42 32h17 M42 32l17 22')};", "const outputs={two:P('M32 32h10l17-17 M42 32l17 17')};"),
])

patch("generate-svg-research.mjs", [
    ("const variants = ['line', 'open', 'dense', 'indexed'];", "const variants = ['line'];"),
    ("fs.mkdirSync(out, { recursive: true });", "fs.rmSync(out, { recursive: true, force: true });\nfs.mkdirSync(out, { recursive: true });"),
])

patch("generate-node-grammar.mjs", [
    ("const project='C:\\\\Users\\\\iris\\\\Downloads\\\\Catalyst', out=path.join(project,'public','generated','catalyst-svg-research-20260913-node-grammar'); fs.mkdirSync(out,{recursive:true});", "const project='C:\\\\Users\\\\iris\\\\Downloads\\\\Catalyst', out=path.join(project,'public','generated','catalyst-svg-research-20260913-node-grammar'); fs.rmSync(out,{recursive:true,force:true}); fs.mkdirSync(out,{recursive:true});"),
    (",hex:P('M10 8h28l7 16-7 16H10L3 24z'),open:P('M8 16V8h8 M32 8h8v8 M40 32v8h-8 M16 40H8v-8')", ""),
])

patch("generate-svg-primitives.mjs", [
    ("fs.mkdirSync(out, { recursive: true });", "fs.rmSync(out, { recursive: true, force: true });\nfs.mkdirSync(out, { recursive: true });"),
    ("const junctionShapes={diamond:R(21.5,21.5,5,5,'transform=\"rotate(45 24 24)\"'),square:R(21,21,6,6),dot:C(24,24,3,'fill=\"currentColor\" stroke=\"none\"'),ring:C(24,24,4),cross:P('M19 24h10 M24 19v10'),open:P('M20 20h8v8')};", "const junctionShapes={diamond:R(21.5,21.5,5,5,'transform=\"rotate(45 24 24)\"')};"),
    ("for(const name of coreNames) for(const size of [16,20,24]) for(const profile of ['crisp','compact','open']){", "for(const name of coreNames) for(const size of [16,20,24]) for(const profile of ['crisp','compact']){"),
])

print(f"Patched generators. Backups: {BACKUP}")
