import type { CSSProperties, SVGProps } from "react";

export type InstrumentGlyphName =
  | "search"
  | "theme"
  | "exit"
  | "save"
  | "open-folder"
  | "rename"
  | "child"
  | "sibling"
  | "delete"
  | "outdent"
  | "indent"
  | "relation"
  | "map"
  | "focus"
  | "fit"
  | "center"
  | "back"
  | "forward"
  | "reorder-before"
  | "reorder-after"
  | "close"
  | "evidence"
  | "role"
  | "confidence"
  | "trace"
  | "collapse"
  | "expand"
  | "method"
  | "open"
  | "import"
  | "copy"
  | "open-source"
  | "annotations"
  | "outline"
  | "previous"
  | "next"
  | "zoom-in"
  | "zoom-out"
  | "zoom-reset"
  | "day"
  | "night"
  | "fullscreen";

const baseSvgProps: SVGProps<SVGSVGElement> = {
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.55,
  strokeLinecap: "square",
  strokeLinejoin: "miter",
  "aria-hidden": true,
};

export const ANALYTIC_MARK_GLYPH_PATHS = {
  "key-evidence": ["M7 4v16", "M7 4h8M7 20h8", "M11 8h6M11 12h6M11 16h6"],
  contradiction: ["M4 6l16 12M20 6L4 18", "M4 6h4M16 18h4M20 6h-4M8 18H4"],
  uncertain: ["M5 8V4h4M15 4h4v4M5 16v4h4M15 20h4v-4", "M9 9c.4-1.8 1.7-2.7 3.4-2.7 2 0 3.3 1.2 3.3 2.8 0 2.4-3.3 2.5-3.3 4.8", "M12.4 17.8h.01"],
  "follow-up": ["M6 20V4", "M7 5h10l-2 4 2 4H7", "M12 17h8M17 14l3 3-3 3"],
} as const;

/**
 * Catalyst's mark is not a generic network icon. Three independent traces
 * converge through an analytical junction and continue into two possible
 * paths. The geometry is reused by relation/probe controls.
 */
export function CatalystMark({
  size = 28,
  className,
}: {
  size?: number;
  className?: string;
}) {
  const style: CSSProperties = { width: size, height: size };
  return (
    <svg
      viewBox="0 0 32 32"
      fill="none"
      className={className ? `catalyst-mark ${className}` : "catalyst-mark"}
      style={style}
      aria-hidden="true"
    >
      <path className="catalyst-mark-trace" d="M3 6.5h6.5L14 15" />
      <path className="catalyst-mark-trace" d="M3 16h11" />
      <path className="catalyst-mark-trace" d="M3 25.5h6.5L14 17" />
      <path className="catalyst-mark-axis" d="M17.2 16H22" />
      <path className="catalyst-mark-probe" d="M22 16l7-7" />
      <path className="catalyst-mark-probe catalyst-mark-probe-open" d="M22 16l7 7" />
      <path className="catalyst-mark-left-terminal" d="M3 4.5v4M3 14v4M3 23.5v4" />
      <rect className="catalyst-mark-junction" x="13.55" y="14.35" width="3.3" height="3.3" transform="rotate(45 15.2 16)" />
      <rect className="catalyst-mark-terminal" x="27.8" y="7.8" width="2.4" height="2.4" />
      <path className="catalyst-mark-open-terminal" d="M27.8 21.8h2.4v2.4" />
    </svg>
  );
}

export function InstrumentGlyph({ name, className }: { name: InstrumentGlyphName; className?: string }) {
  const cls = className ? `instrument-glyph ${className}` : "instrument-glyph";
  switch (name) {
    case "search":
      return <svg {...baseSvgProps} className={cls}><path d="M5 5h8v8H5z" /><path d="M12.5 12.5L20 20" /><path d="M17 20h3v-3" /></svg>;
    case "theme":
      return <svg {...baseSvgProps} className={cls}><path d="M6 3h8l4 4v14H6z" /><path d="M14 3v5h4M12 3v18" /><path d="M6.8 3.8H12v16.4H6.8z" fill="currentColor" stroke="none" opacity="0.32" /></svg>;
    case "exit":
      return <svg {...baseSvgProps} className={cls}><path d="M10 5H5v14h5" /><path d="M9 12h11M16 8l4 4-4 4" /></svg>;
    case "save":
      return <svg {...baseSvgProps} className={cls}><path d="M5 4h12l2 2v14H5z" /><path d="M8 4v6h8V4M8 16h8M8 19h8" /></svg>;
    case "open-folder":
      return <svg {...baseSvgProps} className={cls}><path d="M3.5 7h6l2-2h4l2 3h3v10.5H3.5z" /><path d="M4 11h16l-2 7.5H4z" /></svg>;
    case "rename":
      return <svg {...baseSvgProps} className={cls}><path d="M5 18l1-4L15 5l4 4-9 9-5 1z" /><path d="M13.5 6.5l4 4M5 19h6" /></svg>;
    case "child":
      return <svg {...baseSvgProps} className={cls}><path d="M5 5v14" /><path d="M5 11h7l4 4h4" /><rect x="18" y="13" width="3" height="3" /><path d="M12 5h7M17 3v4" /></svg>;
    case "sibling":
      return <svg {...baseSvgProps} className={cls}><path d="M5 4v16" /><path d="M5 8h8M5 16h8" /><rect x="12" y="6.5" width="3" height="3" /><rect x="12" y="14.5" width="3" height="3" /><path d="M19 9v6M16 12h6" /></svg>;
    case "delete":
      return <svg {...baseSvgProps} className={cls}><path d="M6 7h12l-1 13H7z" /><path d="M4 7h16M9 4h6M10 10v7M14 10v7" /></svg>;
    case "outdent":
      return <svg {...baseSvgProps} className={cls}><path d="M5 5v14M5 9h6l4 4h5" /><rect x="18" y="11.5" width="3" height="3" /><path d="M15 18H9M9 18l3-3M9 18l3 3" /></svg>;
    case "indent":
      return <svg {...baseSvgProps} className={cls}><path d="M5 5v14M5 9h6l4 4h5" /><rect x="18" y="11.5" width="3" height="3" /><path d="M9 18h6M15 18l-3-3M15 18l-3 3" /></svg>;
    case "relation":
      return <svg {...baseSvgProps} className={cls}><rect x="3.5" y="4.5" width="4" height="4" /><rect x="16.5" y="15.5" width="4" height="4" /><path d="M7.5 8.5l9 7" /><rect x="10.5" y="10.5" width="3" height="3" transform="rotate(45 12 12)" /></svg>;
    case "evidence":
      return <svg {...baseSvgProps} className={cls}><path d="M5 4h10l4 4v12H5zM14 4v5h5" /><path d="M8 12h3v3H8zM13 12h3v3h-3z" /><path d="M8 18h8" /></svg>;
    case "role":
      return <svg {...baseSvgProps} className={cls}><path d="M12 3l7 4v6c0 4-3 6.5-7 8-4-1.5-7-4-7-8V7z" /><rect x="10.5" y="9" width="3" height="3" transform="rotate(45 12 10.5)" /><path d="M8.5 15h7" /></svg>;
    case "confidence":
      return <svg {...baseSvgProps} className={cls}><path d="M4 19h16" /><rect x="5" y="13" width="3" height="6" /><rect x="10.5" y="9" width="3" height="10" /><rect x="16" y="5" width="3" height="14" /></svg>;
    case "map":
      return <svg {...baseSvgProps} className={cls}><path d="M6 7l6 5 6-6M12 12l6 6" /><circle cx="6" cy="7" r="2.2" fill="currentColor" stroke="none" /><circle cx="12" cy="12" r="2.2" fill="currentColor" stroke="none" /><circle cx="18" cy="6" r="2.2" fill="currentColor" stroke="none" /><circle cx="18" cy="18" r="2.2" fill="currentColor" stroke="none" /></svg>;
    case "focus":
      return <svg {...baseSvgProps} className={cls}><path d="M4 9V4h5M15 4h5v5M20 15v5h-5M9 20H4v-5" /><rect x="10.5" y="10.5" width="3" height="3" transform="rotate(45 12 12)" /></svg>;
    case "fit":
      return <svg {...baseSvgProps} className={cls}><path d="M4 9V4h5M15 4h5v5M20 15v5h-5M9 20H4v-5" /><path d="M8 12h8M12 8v8" /></svg>;
    case "center":
      return <svg {...baseSvgProps} className={cls}><path d="M12 3v5M12 16v5M3 12h5M16 12h5" /><rect x="10.2" y="10.2" width="3.6" height="3.6" transform="rotate(45 12 12)" /></svg>;
    case "back":
      return <svg {...baseSvgProps} className={cls}><path d="M20 6H9V3L3 9l6 6v-3h8" /><path d="M17 12v5" /></svg>;
    case "forward":
      return <svg {...baseSvgProps} className={cls}><path d="M4 6h11V3l6 6-6 6v-3H7" /><path d="M7 12v5" /></svg>;
    case "reorder-before":
      return <svg {...baseSvgProps} className={cls}><path d="M4 7h9M4 12h9M4 17h9" /><path d="M18 19V6M14.5 9.5L18 6l3.5 3.5" /><rect x="3" y="5.8" width="2.4" height="2.4" /></svg>;
    case "reorder-after":
      return <svg {...baseSvgProps} className={cls}><path d="M4 7h9M4 12h9M4 17h9" /><path d="M18 5v13M14.5 14.5L18 18l3.5-3.5" /><rect x="3" y="15.8" width="2.4" height="2.4" /></svg>;
    case "close":
      return <svg {...baseSvgProps} className={cls}><path d="M5 5l14 14M19 5L5 19" /></svg>;
    case "trace":
      return <svg {...baseSvgProps} className={cls}><path d="M4 4v16M4 12h6l4-4h6M14 16h6" /><rect x="9" y="10.8" width="2.4" height="2.4" transform="rotate(45 10.2 12)" /><path d="M18 6l2 2-2 2M18 14l2 2-2 2" /></svg>;
    case "collapse":
      return <svg {...baseSvgProps} className={cls}><path d="M6 9l6 6 6-6" /><path d="M4 5h16" /></svg>;
    case "expand":
      return <svg {...baseSvgProps} className={cls}><path d="M9 6l6 6-6 6" /><path d="M5 4v16" /></svg>;
    case "method":
      return <svg {...baseSvgProps} className={cls}><rect x="4" y="4" width="4" height="4" /><rect x="16" y="4" width="4" height="4" /><rect x="10" y="16" width="4" height="4" /><path d="M8 6h8M18 8v4l-6 4M6 8v4l6 4" /><path d="M10.5 6l1 1 2-2" /></svg>;
    case "open":
      return <svg {...baseSvgProps} className={cls}><path d="M4 5h7l3 3h6v11H4z" /><path d="M10 15h7M14 11l4 4-4 4" /></svg>;
    case "import":
      return <svg {...baseSvgProps} className={cls}><path d="M12 3v11" /><path d="M7.5 9.5L12 14l4.5-4.5" /><path d="M5 15v5h14v-5" /></svg>;
    case "copy":
      return <svg {...baseSvgProps} className={cls}><path d="M8 5h11v12H8z" /><path d="M5 8H3v13h12v-2" /><path d="M11 10h5M11 13h4" /></svg>;
    case "open-source":
      return <svg {...baseSvgProps} className={cls}><path d="M4 5h10l4 4v10H4zM14 5v5h5" /><path d="M11 15h9M16 11l4 4-4 4" /></svg>;
    case "annotations":
      return <svg {...baseSvgProps} className={cls}><path d="M7 4h11l3 3v12H7zM18 4v4h4" /><path d="M4 7v14h13M10 12h7M10 16h5" /></svg>;
    case "outline":
      return <svg {...baseSvgProps} className={cls}><rect x="4" y="5" width="16" height="14" /><path d="M8 9h8M8 13h6M8 17h9" /></svg>;
    case "previous":
      return <svg {...baseSvgProps} className={cls}><path d="M15 5l-7 7 7 7" /></svg>;
    case "next":
      return <svg {...baseSvgProps} className={cls}><path d="M9 5l7 7-7 7" /></svg>;
    case "zoom-in":
      return <svg {...baseSvgProps} className={cls}><circle cx="10" cy="10" r="6" /><path d="M14.5 14.5L20 20M7 10h6M10 7v6" /></svg>;
    case "zoom-out":
      return <svg {...baseSvgProps} className={cls}><circle cx="10" cy="10" r="6" /><path d="M14.5 14.5L20 20M7 10h6" /></svg>;
    case "zoom-reset":
      return <svg {...baseSvgProps} className={cls}><circle cx="10" cy="10" r="6" /><path d="M14.5 14.5L20 20" /><ellipse cx="10" cy="10" rx="1.9" ry="3.1" /></svg>;
    case "day":
      return <svg {...baseSvgProps} className={cls}><circle cx="12" cy="12" r="4" /><path d="M12 2v3M12 19v3M2 12h3M19 12h3M4.9 4.9l2.1 2.1M17 17l2.1 2.1M19.1 4.9L17 7M7 17l-2.1 2.1" /></svg>;
    case "night":
      return <svg {...baseSvgProps} className={cls}><path d="M19 15.5A8 8 0 0 1 8.5 5a7 7 0 1 0 10.5 10.5z" /></svg>;
    case "fullscreen":
      return <svg {...baseSvgProps} className={cls}><path d="M4 9V4h5M15 4h5v5M20 15v5h-5M9 20H4v-5" /></svg>;
  }
}

export function AnalyticalRoleMark({ role }: { role: string }) {
  return (
    <span className={`analytical-role-mark role-${role}`} aria-hidden="true">
      <span className="analytical-role-frame" />
      <span className="analytical-role-modifier" />
    </span>
  );
}

export function EvidenceTraceMark({ count }: { count?: number }) {
  return (
    <span className="evidence-trace-mark" aria-hidden="true">
      <span className="evidence-trace-stem" />
      <span className="evidence-trace-junction" />
      {typeof count === "number" && <span className="evidence-trace-count">{count}</span>}
    </span>
  );
}


export type OutlineGlyphKind =
  | "root"
  | "evidence"
  | "link-out"
  | "link-in"
  | "relationship"
  | "method"
  | "role"
  | "confidence";

/** Small-scale semantic glyphs tuned for the outline rather than toolbar use. */
export function OutlineGlyph({ kind, className }: { kind: OutlineGlyphKind; className?: string }) {
  const cls = className ? `outline-glyph outline-glyph-${kind} ${className}` : `outline-glyph outline-glyph-${kind}`;
  const props: SVGProps<SVGSVGElement> = {
    viewBox: "0 0 24 24", fill: "none", stroke: "currentColor",
    strokeWidth: 1.8, strokeLinecap: "square", strokeLinejoin: "miter",
    className: cls, "aria-hidden": true,
  };
  const solid = (cx: number, cy: number, r = 1.5) => <circle cx={cx} cy={cy} r={r} fill="currentColor" stroke="none" />;
  switch (kind) {
    case "root":
      return <svg {...props}><path d="M4 5v14M4 8h5l3 4M4 16h5l3-4M12 12h4l4-4M16 12l4 4" />{solid(12,12,1.8)}{solid(20,8)}{solid(20,16)}</svg>;
    case "evidence":
      return <svg {...props}><path d="M5 3h10l4 4v14H5zM15 3v5h5" /><path d="M8 12h8M8 16h5" /><path d="M3 11v6" />{solid(3,14,1.7)}</svg>;
    case "link-out":
      return <svg {...props}><rect x="3" y="7" width="6" height="10" /><path d="M9 12h10M15 8l4 4-4 4" />{solid(6,12,1.4)}</svg>;
    case "link-in":
      return <svg {...props}><rect x="15" y="7" width="6" height="10" /><path d="M15 12H5M9 8l-4 4 4 4" />{solid(18,12,1.4)}</svg>;
    case "relationship":
      return <svg {...props}><rect x="3" y="4" width="5" height="5" /><rect x="16" y="15" width="5" height="5" /><path d="M8 8l8 8M8 17l4-4M12 13l4-4" />{solid(12,12,1.8)}</svg>;
    case "method":
      return <svg {...props}><path d="M4 5h5v5H4zM15 5h5v5h-5zM9.5 15h5v5h-5z" /><path d="M9 7.5h6M17.5 10v3l-5.5 2M6.5 10v3l5.5 2" /><path d="M5.5 7.5l1 1 2-2" /></svg>;
    case "role":
      return <svg {...props}><path d="M12 3l7 4v5c0 4-2.8 7-7 9-4.2-2-7-5-7-9V7z" /><path d="M8 14h8M9 10h6" />{solid(12,10,1.5)}</svg>;
    case "confidence":
      return <svg {...props}><path d="M4 20h16" /><rect x="5" y="14" width="3" height="6" /><rect x="10.5" y="10" width="3" height="10" /><rect x="16" y="5" width="3" height="15" />{solid(17.5,5,1.4)}</svg>;
  }
}

export type TerritoryGlyphKind = "source" | "assess" | "open";

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
  | "note"
  | "claim"
  | "assumption"
  | "hypothesis"
  | "question"
  | "entity"
  | "event"
  | "source"
  | "evidence";

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

    case "hypothesis":
      return <svg {...props}><path className="analytical-glyph-frame" d="M6 18h8M14 18l4-4 4 4-4 4z" /><path className="analytical-glyph-detail" d="M22 18h3l6-8M25 18l6 8M31 8v4M31 24v4" />{dot(18,18,2.2)}</svg>;
    case "question":
      return <svg {...props}><path className="analytical-glyph-frame" d="M8 12c1-5 5-8 10-8 6 0 10 3 10 8 0 7-8 7-8 13" /><path className="analytical-glyph-detail" d="M8 12H4v12h4M20 31h.1" />{dot(20,31,2)}</svg>;
    case "entity":
      return <svg {...props}><path className="analytical-glyph-frame" d="M8 8h20v20H8z" /><path className="analytical-glyph-detail" d="M8 14H3M8 22H3M28 14h5M28 22h5M18 8V3M18 28v5" /><rect className="analytical-glyph-solid" x="14.5" y="14.5" width="7" height="7" /></svg>;
    case "event":
      return <svg {...props}><path className="analytical-glyph-frame" d="M5 18h26M18 5v26" /><path className="analytical-glyph-detail" d="M9 13v10M27 13v10M13 9h10M13 27h10" /><path d="M18 11l7 7-7 7-7-7z" />{dot(18,18,2.2)}</svg>;
    case "note":
    default:
      return <svg {...props}><path className="analytical-glyph-frame" d="M8 8h14l6 10-6 10H8" /><path className="analytical-glyph-detail" d="M8 12H4v12h4M12 18h7l4-4M19 18l4 4h5" />{dot(19,18,2.3)}</svg>;
  }
}
