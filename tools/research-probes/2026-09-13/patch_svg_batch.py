from pathlib import Path

path = Path(r"C:\Users\iris\Downloads\Catalyst\src\ui\CatalystSymbols.tsx")
text = path.read_text(encoding="utf-8")

text = text.replace(
'''  | "new"\n  | "branch"''',
'''  | "new"\n  | "child"\n  | "sibling"\n  | "delete"\n  | "promote"\n  | "demote"\n  | "branch"''',
1,
)
text = text.replace(
'''  | "arrange"\n  | "settings"''',
'''  | "arrange"\n  | "auto-layout"\n  | "side-left"\n  | "side-right"\n  | "settings"''',
1,
)
text = text.replace(
'''  | "copy"\n  | "attach";''',
'''  | "copy"\n  | "attach"\n  | "source-link"\n  | "open-source"\n  | "annotation"\n  | "annotations"\n  | "highlight"\n  | "underline"\n  | "strike"\n  | "outline"\n  | "comment"\n  | "tag"\n  | "sort"\n  | "filter"\n  | "previous"\n  | "next"\n  | "first"\n  | "last"\n  | "import"\n  | "export"\n  | "bookmark"\n  | "zoom-in"\n  | "zoom-out"\n  | "reader-settings";''',
1,
)
text = text.replace(
'''    case "new":\n      return <svg {...baseSvgProps} className={cls}><path d="M4 12h7" /><path d="M11 12l4-4M11 12l4 4" /><path d="M18 5v6M15 8h6" /><path d="M18 14v5h-5" /></svg>;''',
'''    case "new":\n      return <svg {...baseSvgProps} className={cls}><path d="M4 12h7" /><path d="M11 12l4-4M11 12l4 4" /><path d="M18 5v6M15 8h6" /><path d="M18 14v5h-5" /></svg>;\n    case "child":\n      return <svg {...baseSvgProps} className={cls}><path d="M5 5v14" /><path d="M5 11h7l4 4h4" /><rect x="18" y="13" width="3" height="3" /><path d="M12 5h7M17 3v4" /></svg>;\n    case "sibling":\n      return <svg {...baseSvgProps} className={cls}><path d="M5 4v16" /><path d="M5 8h8M5 16h8" /><rect x="12" y="6.5" width="3" height="3" /><rect x="12" y="14.5" width="3" height="3" /><path d="M19 9v6M16 12h6" /></svg>;\n    case "delete":\n      return <svg {...baseSvgProps} className={cls}><path d="M6 7h12l-1 13H7z" /><path d="M4 7h16M9 4h6M10 10v7M14 10v7" /></svg>;\n    case "promote":\n      return <svg {...baseSvgProps} className={cls}><path d="M5 5v14M5 9h6l4 4h5" /><rect x="18" y="11.5" width="3" height="3" /><path d="M15 18H9M9 18l3-3M9 18l3 3" /></svg>;\n    case "demote":\n      return <svg {...baseSvgProps} className={cls}><path d="M5 5v14M5 9h6l4 4h5" /><rect x="18" y="11.5" width="3" height="3" /><path d="M9 18h6M15 18l-3-3M15 18l-3 3" /></svg>;''',
1,
)
text = text.replace(
'''    case "arrange":\n      return <svg {...baseSvgProps} className={cls}><path d="M4 12h5" /><path d="M9 12l4-5h7M9 12l4 5h7" /><rect x="3" y="10.5" width="3" height="3" /><path d="M19 5.5h2v3M19 15.5h2v3" /></svg>;''',
'''    case "arrange":\n      return <svg {...baseSvgProps} className={cls}><path d="M4 12h5" /><path d="M9 12l4-5h7M9 12l4 5h7" /><rect x="3" y="10.5" width="3" height="3" /><path d="M19 5.5h2v3M19 15.5h2v3" /></svg>;\n    case "auto-layout":\n      return <svg {...baseSvgProps} className={cls}><path d="M4 12h5l4-5h7M9 12l4 5h7" /><path d="M18 4h3v3M21 4l-4 4M6 20H3v-3M3 20l4-4" /></svg>;\n    case "side-left":\n      return <svg {...baseSvgProps} className={cls}><path d="M13 4v16" /><path d="M13 8H7l-3 4 3 4h6" /><rect x="3" y="10.5" width="3" height="3" /><path d="M18 12h3M18 9l-3 3 3 3" /></svg>;\n    case "side-right":\n      return <svg {...baseSvgProps} className={cls}><path d="M11 4v16" /><path d="M11 8h6l3 4-3 4h-6" /><rect x="18" y="10.5" width="3" height="3" /><path d="M6 12H3M6 9l3 3-3 3" /></svg>;''',
1,
)
text = text.replace(
'''    case "attach":\n      return <svg {...baseSvgProps} className={cls}><path d="M4 12h8" /><path d="M12 12l4-4M12 12l4 4" /><path d="M19 5v14" /><path d="M16 8h6M16 16h6" /></svg>;''',
'''    case "attach":\n      return <svg {...baseSvgProps} className={cls}><path d="M4 12h8" /><path d="M12 12l4-4M12 12l4 4" /><path d="M19 5v14" /><path d="M16 8h6M16 16h6" /></svg>;\n    case "source-link":\n      return <svg {...baseSvgProps} className={cls}><path d="M5 4h9l4 4v12H5zM14 4v5h5" /><path d="M2 12h5M17 15h5" /><path d="M9 15l3-3 3 3" /></svg>;\n    case "open-source":\n      return <svg {...baseSvgProps} className={cls}><path d="M4 5h10l4 4v10H4zM14 5v5h5" /><path d="M11 15h9M16 11l4 4-4 4" /></svg>;\n    case "annotation":\n      return <svg {...baseSvgProps} className={cls}><path d="M5 4h12l3 3v13H5zM16 4v5h5" /><path d="M8 12h8M8 16h6" /><path d="M7 18h9" /></svg>;\n    case "annotations":\n      return <svg {...baseSvgProps} className={cls}><path d="M7 4h11l3 3v12H7zM18 4v4h4" /><path d="M4 7v14h13M10 12h7M10 16h5" /></svg>;\n    case "highlight":\n      return <svg {...baseSvgProps} className={cls}><path d="M5 7h14M5 12h14M5 17h14" /><path d="M4 14h16v6H4z" /></svg>;\n    case "underline":\n      return <svg {...baseSvgProps} className={cls}><path d="M6 5v7a6 6 0 0012 0V5" /><path d="M5 20h14" /></svg>;\n    case "strike":\n      return <svg {...baseSvgProps} className={cls}><path d="M7 7c1-2 3-3 5-3 3 0 5 1 6 3M6 17c1 2 3 3 6 3 3 0 5-1 6-3" /><path d="M4 12h16" /></svg>;\n    case "outline":\n      return <svg {...baseSvgProps} className={cls}><rect x="4" y="5" width="16" height="14" /><path d="M8 9h8M8 13h6M8 17h9" /></svg>;\n    case "comment":\n      return <svg {...baseSvgProps} className={cls}><path d="M4 5h16v12H9l-4 4v-4H4z" /><path d="M8 9h8M8 13h6" /></svg>;\n    case "tag":\n      return <svg {...baseSvgProps} className={cls}><path d="M4 4h8l8 8-8 8-8-8z" /><circle cx="8" cy="8" r="1.5" /></svg>;\n    case "sort":\n      return <svg {...baseSvgProps} className={cls}><path d="M5 6h10M5 12h7M5 18h4" /><path d="M18 5v14M15 16l3 3 3-3" /></svg>;\n    case "filter":\n      return <svg {...baseSvgProps} className={cls}><path d="M4 5h16l-6 7v6l-4 2v-8z" /></svg>;\n    case "previous":\n      return <svg {...baseSvgProps} className={cls}><path d="M15 5l-7 7 7 7" /></svg>;\n    case "next":\n      return <svg {...baseSvgProps} className={cls}><path d="M9 5l7 7-7 7" /></svg>;\n    case "first":\n      return <svg {...baseSvgProps} className={cls}><path d="M17 5l-7 7 7 7M6 5v14" /></svg>;\n    case "last":\n      return <svg {...baseSvgProps} className={cls}><path d="M7 5l7 7-7 7M18 5v14" /></svg>;\n    case "import":\n      return <svg {...baseSvgProps} className={cls}><path d="M5 4h10l4 4v12H5zM15 4v5h5" /><path d="M12 10v7M9 14l3 3 3-3" /></svg>;\n    case "export":\n      return <svg {...baseSvgProps} className={cls}><path d="M5 4h10l4 4v12H5zM15 4v5h5" /><path d="M12 17v-7M9 13l3-3 3 3" /></svg>;\n    case "bookmark":\n      return <svg {...baseSvgProps} className={cls}><path d="M7 4h10v16l-5-4-5 4z" /></svg>;\n    case "zoom-in":\n      return <svg {...baseSvgProps} className={cls}><circle cx="10" cy="10" r="6" /><path d="M14.5 14.5L20 20M7 10h6M10 7v6" /></svg>;\n    case "zoom-out":\n      return <svg {...baseSvgProps} className={cls}><circle cx="10" cy="10" r="6" /><path d="M14.5 14.5L20 20M7 10h6" /></svg>;\n    case "reader-settings":\n      return <svg {...baseSvgProps} className={cls}><path d="M4 4h10l4 4v12H4zM14 4v5h5" /><path d="M8 12h7M8 16h7" /><rect x="10" y="10.5" width="2" height="3" /><rect x="13" y="14.5" width="2" height="3" /></svg>;''',
1,
)

path.write_text(text, encoding="utf-8")
print("patched", path)
