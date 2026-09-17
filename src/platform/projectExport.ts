import type { TechniqueRun, WorkspaceState } from "../domain/types";
import { outlineItemsForParent } from "../domain/outline";
import { noteDisplayTitle } from "../shared/display";

export type ProjectExportFormat = "pdf" | "docx" | "rtf";

type ExportMethod = {
  number: string;
  depth: number;
  run: TechniqueRun;
};

type ExportOutlineItem = {
  number: string;
  depth: number;
  title: string;
  body: string;
};

type ProjectExportModel = {
  title: string;
  methods: ExportMethod[];
  outline: ExportOutlineItem[];
};

const compareRuns = (left: TechniqueRun, right: TechniqueRun) =>
  (left.sequenceIndex ?? Number.MAX_SAFE_INTEGER) -
    (right.sequenceIndex ?? Number.MAX_SAFE_INTEGER) ||
  left.createdAt.localeCompare(right.createdAt) ||
  left.id.localeCompare(right.id);

function exportMethods(state: WorkspaceState): ExportMethod[] {
  const runs = Object.values(state.techniqueRuns);
  const runIds = new Set(runs.map((run) => run.id));
  const children = new Map<string | null, TechniqueRun[]>();

  for (const run of runs) {
    const requestedParent = run.parentRunId ?? null;
    const parent = requestedParent && requestedParent !== run.id && runIds.has(requestedParent)
      ? requestedParent
      : null;
    const siblings = children.get(parent) ?? [];
    siblings.push(run);
    children.set(parent, siblings);
  }
  for (const siblings of children.values()) siblings.sort(compareRuns);

  const rows: ExportMethod[] = [];
  const visited = new Set<string>();
  const visit = (run: TechniqueRun, depth: number, numberPath: number[]) => {
    if (visited.has(run.id)) return;
    visited.add(run.id);
    rows.push({ number: numberPath.join("."), depth, run });
    const descendants = children.get(run.id) ?? [];
    descendants.forEach((child, index) => visit(child, depth + 1, [...numberPath, index + 1]));
  };

  const roots = children.get(null) ?? [];
  roots.forEach((run, index) => visit(run, 0, [index + 1]));

  let fallbackNumber = roots.length;
  for (const run of [...runs].sort(compareRuns)) {
    if (visited.has(run.id)) continue;
    fallbackNumber += 1;
    visit(run, 0, [fallbackNumber]);
  }
  return rows;
}

function exportOutline(state: WorkspaceState): ExportOutlineItem[] {
  const rows: ExportOutlineItem[] = [];
  const visited = new Set<string>();

  const visit = (parentItemId: string, depth: number, numberPath: number[]) => {
    const children = outlineItemsForParent(state.outline, parentItemId)
      .filter((item) => item.kind === "reference");
    children.forEach((item, index) => {
      if (visited.has(item.id)) return;
      visited.add(item.id);
      const note = state.notes[item.itemId];
      if (!note) return;
      const nextNumberPath = [...numberPath, index + 1];
      rows.push({
        number: nextNumberPath.join("."),
        depth,
        title: noteDisplayTitle(note),
        body: note.body,
      });
      visit(item.id, depth + 1, nextNumberPath);
    });
  };

  visit(state.outline.rootItemId, 0, []);

  let fallbackNumber = rows.filter((row) => row.depth === 0).length;
  for (const item of Object.values(state.outline.items)
    .filter((candidate) => candidate.kind === "reference")
    .sort((left, right) => left.siblingOrder - right.siblingOrder || left.id.localeCompare(right.id))) {
    if (visited.has(item.id)) continue;
    const note = state.notes[item.itemId];
    if (!note) continue;
    fallbackNumber += 1;
    rows.push({
      number: String(fallbackNumber),
      depth: 0,
      title: noteDisplayTitle(note),
      body: note.body,
    });
  }
  return rows;
}

export function buildProjectExportModel(state: WorkspaceState): ProjectExportModel {
  return {
    title: state.analysisRoot.title.trim() || "Catalyst analysis",
    methods: exportMethods(state),
    outline: exportOutline(state),
  };
}

function safeFileStem(title: string): string {
  const cleaned = title
    .replace(/[<>:"/\\|?*\u0000-\u001f]/g, " ")
    .replace(/\s+/g, " ")
    .trim()
    .replace(/[. ]+$/g, "")
    .slice(0, 80);
  return cleaned && cleaned.toLowerCase() !== "title" ? cleaned : "Catalyst analysis";
}

function downloadBlob(blob: Blob, fileName: string) {
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = fileName;
  anchor.style.display = "none";
  document.body.appendChild(anchor);
  anchor.click();
  anchor.remove();
  window.setTimeout(() => URL.revokeObjectURL(url), 1000);
}

function plainLines(value: string): string[] {
  return value.replace(/\r\n?/g, "\n").split("\n");
}

async function exportDocx(model: ProjectExportModel, fileName: string) {
  const {
    AlignmentType,
    Document,
    HeadingLevel,
    Packer,
    Paragraph,
    TextRun,
  } = await import("docx");

  const children: InstanceType<typeof Paragraph>[] = [];
  children.push(new Paragraph({
    heading: HeadingLevel.TITLE,
    alignment: AlignmentType.LEFT,
    children: [new TextRun({ text: model.title, bold: true })],
  }));

  const headingByDepth = [
    HeadingLevel.HEADING_2,
    HeadingLevel.HEADING_3,
    HeadingLevel.HEADING_4,
    HeadingLevel.HEADING_5,
    HeadingLevel.HEADING_6,
  ];

  children.push(new Paragraph({ heading: HeadingLevel.HEADING_1, text: "Outline" }));
  if (model.outline.length === 0) {
    children.push(new Paragraph({ children: [new TextRun({ text: "No outline items.", italics: true })] }));
  }
  for (const item of model.outline) {
    const indent = Math.min(item.depth, 8) * 360;
    children.push(new Paragraph({
      heading: headingByDepth[Math.min(item.depth, headingByDepth.length - 1)],
      indent: indent ? { left: indent } : undefined,
      children: [new TextRun({ text: `${item.number}. ${item.title}`, bold: true })],
    }));
    if (item.body.trim()) {
      for (const line of plainLines(item.body)) {
        children.push(new Paragraph({
          indent: { left: indent + 180 },
          children: [new TextRun(line || " ")],
        }));
      }
    }
  }

  children.push(new Paragraph({ heading: HeadingLevel.HEADING_1, text: "Methods" }));
  if (model.methods.length === 0) {
    children.push(new Paragraph({ children: [new TextRun({ text: "No methods.", italics: true })] }));
  }
  for (const method of model.methods) {
    const definition = method.run.definitionSnapshot;
    const indent = Math.min(method.depth, 8) * 360;
    children.push(new Paragraph({
      heading: headingByDepth[Math.min(method.depth, headingByDepth.length - 1)],
      indent: indent ? { left: indent } : undefined,
      children: [new TextRun({ text: `${method.number}. ${definition.name.trim() || "Untitled method"}`, bold: true })],
    }));
    definition.steps.forEach((step, stepIndex) => {
      children.push(new Paragraph({
        indent: { left: indent + 360 },
        children: [new TextRun({ text: `${stepIndex + 1}. ${step.title.trim() || "Untitled step"}`, bold: true })],
      }));
      const response = method.run.responses[step.id] ?? "";
      if (response.trim()) {
        for (const line of plainLines(response)) {
          children.push(new Paragraph({
            indent: { left: indent + 540 },
            children: [new TextRun(line || " ")],
          }));
        }
      }
    });
  }

  const document = new Document({
    creator: "Catalyst",
    title: model.title,
    description: "Catalyst Methods and Outline export",
    sections: [{ children }],
  });
  const blob = await Packer.toBlob(document);
  downloadBlob(blob, fileName);
}

async function exportPdf(model: ProjectExportModel, fileName: string) {
  const [pdfMake, pdfFonts] = await Promise.all([
    import("pdfmake/build/pdfmake"),
    import("pdfmake/build/vfs_fonts"),
  ]);
  pdfMake.addVirtualFileSystem(pdfFonts.default);

  const content: any[] = [
    { text: model.title, style: "title" },
    { text: "Outline", style: "section" },
  ];

  if (model.outline.length === 0) content.push({ text: "No outline items.", italics: true });
  for (const item of model.outline) {
    const left = Math.min(item.depth, 8) * 18;
    content.push({
      text: `${item.number}. ${item.title}`,
      style: "itemHeading",
      margin: [left, 8, 0, 3],
    });
    if (item.body.trim()) content.push({ text: item.body, margin: [left + 9, 0, 0, 6] });
  }

  content.push({ text: "Methods", style: "section", margin: [0, 16, 0, 8] });
  if (model.methods.length === 0) content.push({ text: "No methods.", italics: true, margin: [0, 0, 0, 8] });
  for (const method of model.methods) {
    const definition = method.run.definitionSnapshot;
    const left = Math.min(method.depth, 8) * 18;
    content.push({
      text: `${method.number}. ${definition.name.trim() || "Untitled method"}`,
      style: "itemHeading",
      margin: [left, 8, 0, 3],
    });
    definition.steps.forEach((step, stepIndex) => {
      content.push({
        text: `${stepIndex + 1}. ${step.title.trim() || "Untitled step"}`,
        bold: true,
        margin: [left + 18, 5, 0, 2],
      });
      const response = method.run.responses[step.id] ?? "";
      if (response.trim()) content.push({ text: response, margin: [left + 27, 0, 0, 5] });
    });
  }

  const documentDefinition: any = {
    info: { title: model.title, author: "Catalyst", subject: "Methods and Outline" },
    pageSize: "LETTER",
    pageMargins: [54, 54, 54, 54],
    defaultStyle: { font: "Roboto", fontSize: 10.5, lineHeight: 1.2 },
    styles: {
      title: { fontSize: 24, bold: true, margin: [0, 0, 0, 18] },
      section: { fontSize: 17, bold: true, margin: [0, 12, 0, 8] },
      itemHeading: { fontSize: 12, bold: true },
    },
    content,
  };

  await pdfMake.createPdf(documentDefinition).download(fileName);
}

function rtfEscape(value: string): string {
  let result = "";
  for (let index = 0; index < value.length; index += 1) {
    const code = value.charCodeAt(index);
    const char = value[index];
    if (char === "\\" || char === "{" || char === "}") {
      result += `\\${char}`;
    } else if (char === "\n") {
      result += "\\line ";
    } else if (char === "\r") {
      continue;
    } else if (code >= 32 && code <= 126) {
      result += char;
    } else {
      const signed = code > 32767 ? code - 65536 : code;
      result += `\\u${signed}?`;
    }
  }
  return result;
}

function rtfParagraph(text: string, options: { bold?: boolean; italic?: boolean; size?: number; indent?: number; after?: number } = {}) {
  const controls = [
    "\\pard",
    `\\li${options.indent ?? 0}`,
    `\\sa${options.after ?? 120}`,
    `\\fs${options.size ?? 22}`,
    options.bold ? "\\b" : "",
    options.italic ? "\\i" : "",
  ].filter(Boolean).join("");
  const resets = `${options.bold ? "\\b0" : ""}${options.italic ? "\\i0" : ""}`;
  return `${controls} ${rtfEscape(text)}${resets}\\par\n`;
}

function exportRtf(model: ProjectExportModel, fileName: string) {
  let body = "{\\rtf1\\ansi\\deff0\\uc1{\\fonttbl{\\f0 Calibri;}}\n";
  body += rtfParagraph(model.title, { bold: true, size: 44, after: 260 });
  body += rtfParagraph("Outline", { bold: true, size: 32, after: 180 });
  if (model.outline.length === 0) body += rtfParagraph("No outline items.", { italic: true });
  for (const item of model.outline) {
    const indent = Math.min(item.depth, 8) * 360;
    body += rtfParagraph(`${item.number}. ${item.title}`, { bold: true, size: 25, indent, after: 70 });
    if (item.body.trim()) body += rtfParagraph(item.body, { indent: indent + 180, after: 120 });
  }

  body += rtfParagraph("Methods", { bold: true, size: 32, after: 180 });
  if (model.methods.length === 0) body += rtfParagraph("No methods.", { italic: true });
  for (const method of model.methods) {
    const definition = method.run.definitionSnapshot;
    const indent = Math.min(method.depth, 8) * 360;
    body += rtfParagraph(`${method.number}. ${definition.name.trim() || "Untitled method"}`, { bold: true, size: 25, indent, after: 80 });
    definition.steps.forEach((step, stepIndex) => {
      body += rtfParagraph(`${stepIndex + 1}. ${step.title.trim() || "Untitled step"}`, { bold: true, indent: indent + 360, after: 50 });
      const response = method.run.responses[step.id] ?? "";
      if (response.trim()) body += rtfParagraph(response, { indent: indent + 540, after: 100 });
    });
  }
  body += "}";
  downloadBlob(new Blob([body], { type: "application/rtf" }), fileName);
}

export async function exportProject(state: WorkspaceState, format: ProjectExportFormat): Promise<string> {
  const model = buildProjectExportModel(state);
  const fileName = `${safeFileStem(model.title)}.${format}`;
  if (format === "docx") await exportDocx(model, fileName);
  else if (format === "pdf") await exportPdf(model, fileName);
  else exportRtf(model, fileName);
  return fileName;
}
