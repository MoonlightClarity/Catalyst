from pathlib import Path
p = Path(r"C:\Users\iris\Downloads\Catalyst\src\ui\CatalystSymbols.tsx")
s = p.read_text(encoding="utf-8")
start = s.index("export type AnalyticalGlyphKind")
head = s[:start]
tail = r'''export type TerritoryGlyphKind = "source" | "assess" | "open";

export function TerritoryGlyph({ kind }: { kind: TerritoryGlyphKind }) {
  const props: SVGProps<SVGSVGElement> = {
    viewBox: "0 0 24 24", fill: "none", stroke: "currentColor",
    strokeWidth: 1.8, strokeLinecap: "square", strokeLinejoin: "miter",
    className: `territory-glyph territory-glyph-${kind}`, "aria-hidden": true,
  };
  switch (kind) {
    case "source":
      return <svg {...props}><path d="M6 3h9l4 4v14H6z" /><path d="M15 3v5h5" /><path d="M2 8h4M2 12h4M2 16h4" /><rect x="3.2" y="10.8" width="2.4" height="2.4" transform="rotate(45 4.4 12)" fill="currentColor" stroke="none" /></svg>;
    case "assess":
      return <svg {...props}><path d="M12 3l7 9-7 9-7-9z" /><path d="M2 12h5M17 12h5" /><path d="M9 12h6M12 9v6" /><circle cx="12" cy="12" r="2" fill="currentColor" stroke="none" /></svg>;
    case "open":
      return <svg {...props}><path d="M3 12h6l4-5h7M9 12l4 5h7" /><circle cx="8.5" cy="12" r="1.8" fill="currentColor" stroke="none" /><path d="M19 5.5h2v3M19 15.5h2v3" /></svg>;
  }
}

export type AnalyticalGlyphKind =
  | "thought"
  | "claim"
  | "assumption"
  | "hypothesis"
  | "question"
  | "entity"
  | "event"
  | "source"
  | "evidence";
'''
tail += r'''
/**
 * Catalyst analytical iconography. The outer silhouette carries role at
 * overview scale; the inner mark adds detail at working/close scale.
 */
export function AnalyticalGlyph({ kind, className }: { kind: AnalyticalGlyphKind; className?: string }) {
  const cls = className ? `analytical-glyph analytical-glyph-${kind} ${className}` : `analytical-glyph analytical-glyph-${kind}`;
  const props: SVGProps<SVGSVGElement> = {
    viewBox: "0 0 36 36", fill: "none", stroke: "currentColor",
    strokeWidth: 1.9, strokeLinecap: "square", strokeLinejoin: "miter",
    className: cls, "aria-hidden": true,
  };
  const dot = (cx: number, cy: number, r = 2.2) => <circle className="analytical-glyph-solid" cx={cx} cy={cy} r={r} />;

  switch (kind) {
    case "source":
      return <svg {...props}><path className="analytical-glyph-frame" d="M9 4h15l5 5v23H9z" /><path className="analytical-glyph-detail" d="M24 4v7h7M13 16h11M13 21h8M6 10v17" />{dot(6,18,2)}</svg>;
    case "evidence":
      return <svg {...props}><path className="analytical-glyph-frame" d="M7 8h17v21H7z" /><path className="analytical-glyph-detail" d="M12 14h8M12 19h10M26 7v22M26 14h5" />{dot(30,14,2)}</svg>;
    case "claim":
      return <svg {...props}><path className="analytical-glyph-frame" d="M18 4l11 14-11 14L7 18z" /><path className="analytical-glyph-detail" d="M11 18h14M18 11v14" />{dot(18,18,2.5)}</svg>;
    case "assumption":
      return <svg {...props}><path className="analytical-glyph-frame" d="M8 5H5v26h3M28 5h3v26h-3" /><path className="analytical-glyph-detail" d="M18 9l9 9-9 9-9-9zM12 29h12" />{dot(18,18,2.4)}</svg>;
'''
tail += r'''
    case "hypothesis":
      return <svg {...props}><path className="analytical-glyph-frame" d="M6 18h8M14 18l4-4 4 4-4 4z" /><path className="analytical-glyph-detail" d="M22 18h3l6-8M25 18l6 8M31 8v4M31 24v4" />{dot(18,18,2.2)}</svg>;
    case "question":
      return <svg {...props}><path className="analytical-glyph-frame" d="M8 12c1-5 5-8 10-8 6 0 10 3 10 8 0 7-8 7-8 13" /><path className="analytical-glyph-detail" d="M8 12H4v12h4M20 31h.1" />{dot(20,31,2)}</svg>;
    case "entity":
      return <svg {...props}><path className="analytical-glyph-frame" d="M8 8h20v20H8z" /><path className="analytical-glyph-detail" d="M8 14H3M8 22H3M28 14h5M28 22h5M18 8V3M18 28v5" /><rect className="analytical-glyph-solid" x="14.5" y="14.5" width="7" height="7" /></svg>;
    case "event":
      return <svg {...props}><path className="analytical-glyph-frame" d="M5 18h26M18 5v26" /><path className="analytical-glyph-detail" d="M9 13v10M27 13v10M13 9h10M13 27h10" /><path d="M18 11l7 7-7 7-7-7z" />{dot(18,18,2.2)}</svg>;
    case "thought":
    default:
      return <svg {...props}><path className="analytical-glyph-frame" d="M8 8h14l6 10-6 10H8" /><path className="analytical-glyph-detail" d="M8 12H4v12h4M12 18h7l4-4M19 18l4 4h5" />{dot(19,18,2.3)}</svg>;
  }
}
'''
p.write_text(head + tail, encoding="utf-8")
print("CatalystSymbols patched")
