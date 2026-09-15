from pathlib import Path
p=Path(r"C:\Users\iris\Downloads\Catalyst\src\features\analysis\WorkingPictureWorkspace.tsx")
s=p.read_text(encoding="utf-8")
s=s.replace('  InstrumentGlyph,\n} from "../../ui/CatalystSymbols";', '  InstrumentGlyph,\n  TerritoryGlyph,\n} from "../../ui/CatalystSymbols";')
s=s.replace('<div className="picture-territory picture-territory-observed" aria-hidden="true"><span>Source</span></div>', '<div className="picture-territory picture-territory-observed" aria-hidden="true"><TerritoryGlyph kind="source" /><span>Source</span></div>')
s=s.replace('<div className="picture-territory picture-territory-assessed" aria-hidden="true"><span>Assess</span></div>', '<div className="picture-territory picture-territory-assessed" aria-hidden="true"><TerritoryGlyph kind="assess" /><span>Assess</span></div>')
s=s.replace('<div className="picture-territory picture-territory-open" aria-hidden="true"><span>Open</span></div>', '<div className="picture-territory picture-territory-open" aria-hidden="true"><TerritoryGlyph kind="open" /><span>Open</span></div>')
p.write_text(s, encoding="utf-8")
print("WorkingPicture iconography patched")