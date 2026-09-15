import type { WorkspaceState } from "../domain/types";
import { durableWorkspaceState } from "./recoveryJournal";

export const CATALYST_XML_FORMAT_VERSION = 1;

type JsonValue =
  | null
  | boolean
  | number
  | string
  | JsonValue[]
  | { [key: string]: JsonValue };

type XmlElement = {
  name: string;
  attributes: Record<string, string>;
  children: XmlElement[];
  text: string;
};

function escapeXml(value: string): string {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&apos;");
}
function decodeXml(value: string): string {
  return value.replace(
    /&(amp|lt|gt|quot|apos|#\d+|#x[0-9a-f]+);/gi,
    (_entity, name: string) => {
      if (name === "amp") return "&";
      if (name === "lt") return "<";
      if (name === "gt") return ">";
      if (name === "quot") return '"';
      if (name === "apos") return "'";
      const codePoint = name.startsWith("#x")
        ? Number.parseInt(name.slice(2), 16)
        : Number.parseInt(name.slice(1), 10);
      if (!Number.isFinite(codePoint)) throw new Error(`Invalid XML entity: &${name};`);
      return String.fromCodePoint(codePoint);
    },
  );
}

function toJsonCompatible(value: WorkspaceState): JsonValue {
  return JSON.parse(JSON.stringify(durableWorkspaceState(value))) as JsonValue;
}

function serializeValue(value: JsonValue): string {
  if (value === null) return "<null/>";
  if (typeof value === "boolean") return `<boolean value="${value}"/>`;
  if (typeof value === "number") return `<number>${value}</number>`;
  if (typeof value === "string") return `<string>${escapeXml(value)}</string>`;
  if (Array.isArray(value)) {
    return `<array>${value.map((item) => serializeValue(item)).join("")}</array>`;
  }

  const entries = Object.keys(value)
    .sort()
    .map((key) => `<entry key="${escapeXml(key)}">${serializeValue(value[key])}</entry>`)
    .join("");
  return `<object>${entries}</object>`;
}

export function serializeWorkspaceXml(state: WorkspaceState): string {
  const body = serializeValue(toJsonCompatible(state));
  return [
    '<?xml version="1.0" encoding="UTF-8"?>',
    `<catalyst-workspace version="${CATALYST_XML_FORMAT_VERSION}">`,
    `<state>${body}</state>`,
    "</catalyst-workspace>",
    "",
  ].join("\n");
}

function parseAttributes(source: string): Record<string, string> {
  const attributes: Record<string, string> = {};
  const pattern = /([A-Za-z_:][\w:.-]*)\s*=\s*"([^"]*)"/g;
  let match: RegExpExecArray | null;
  while ((match = pattern.exec(source))) {
    attributes[match[1]] = decodeXml(match[2]);
  }
  return attributes;
}

function parseXml(xml: string): XmlElement {
  if (/<!DOCTYPE|<!ENTITY/i.test(xml)) {
    throw new Error("Catalyst XML does not allow DTD or ENTITY declarations");
  }

  const tokens = xml.match(/<!--[\s\S]*?-->|<\?[\s\S]*?\?>|<\/?[^>]+>|[^<]+/g) ?? [];
  const stack: XmlElement[] = [];
  let root: XmlElement | null = null;

  for (const token of tokens) {
    if (token.startsWith("<?") || token.startsWith("<!--")) continue;
    if (!token.startsWith("<")) {
      if (stack.length > 0) stack[stack.length - 1].text += decodeXml(token);
      else if (token.trim()) throw new Error("Text is not allowed outside the XML root");
      continue;
    }

    if (token.startsWith("</")) {
      const name = token.slice(2, -1).trim();
      const current = stack.pop();
      if (!current || current.name !== name) {
        throw new Error(`Mismatched XML closing tag: ${name}`);
      }
      continue;
    }

    const selfClosing = token.endsWith("/>");
    const inner = token.slice(1, selfClosing ? -2 : -1).trim();
    const nameMatch = /^([A-Za-z][\w:.-]*)([\s\S]*)$/.exec(inner);
    if (!nameMatch) throw new Error(`Invalid XML tag: ${token}`);

    const element: XmlElement = {
      name: nameMatch[1],
      attributes: parseAttributes(nameMatch[2]),
      children: [],
      text: "",
    };

    if (stack.length > 0) stack[stack.length - 1].children.push(element);
    else if (root) throw new Error("Catalyst XML must have exactly one root element");
    else root = element;

    if (!selfClosing) stack.push(element);
  }

  if (stack.length !== 0) throw new Error(`Unclosed XML tag: ${stack.at(-1)?.name}`);
  if (!root) throw new Error("Catalyst XML is empty");
  return root;
}
function onlyChild(element: XmlElement): XmlElement {
  if (element.children.length !== 1) {
    throw new Error(`<${element.name}> must contain exactly one value`);
  }
  return element.children[0];
}

function deserializeValue(element: XmlElement): JsonValue {
  if (element.name === "null") return null;
  if (element.name === "boolean") {
    if (element.attributes.value === "true") return true;
    if (element.attributes.value === "false") return false;
    throw new Error("Invalid boolean value in Catalyst XML");
  }
  if (element.name === "number") {
    const value = Number(element.text.trim());
    if (!Number.isFinite(value)) throw new Error("Invalid number in Catalyst XML");
    return value;
  }
  if (element.name === "string") return element.text;
  if (element.name === "array") {
    return element.children.map((child) => deserializeValue(child));
  }
  if (element.name !== "object") {
    throw new Error(`Unknown Catalyst XML value element: <${element.name}>`);
  }

  const result: Record<string, JsonValue> = {};
  for (const entry of element.children) {
    if (entry.name !== "entry") throw new Error("Objects may only contain <entry> elements");
    const key = entry.attributes.key;
    if (key === undefined) throw new Error("Object entry is missing its key attribute");
    if (Object.prototype.hasOwnProperty.call(result, key)) {
      throw new Error(`Duplicate object key in Catalyst XML: ${key}`);
    }
    result[key] = deserializeValue(onlyChild(entry));
  }
  return result;
}

function looksLikeWorkspaceState(value: JsonValue): value is WorkspaceState & JsonValue {
  if (!value || Array.isArray(value) || typeof value !== "object") return false;
  return Boolean(
    value.documents &&
      value.annotations &&
      value.notes &&
      Array.isArray(value.links) &&
      value.techniqueRuns &&
      Object.prototype.hasOwnProperty.call(value, "activeDocumentId") &&
      Object.prototype.hasOwnProperty.call(value, "activeNoteId"),
  );
}

export function deserializeWorkspaceXml(xml: string): WorkspaceState {
  const root = parseXml(xml);
  if (root.name !== "catalyst-workspace") {
    throw new Error(`Unexpected Catalyst XML root: <${root.name}>`);
  }

  const version = Number.parseInt(root.attributes.version ?? "", 10);
  if (version !== CATALYST_XML_FORMAT_VERSION) {
    throw new Error(`Unsupported Catalyst XML version: ${root.attributes.version ?? "missing"}`);
  }

  const stateElement = root.children.find((child) => child.name === "state");
  if (!stateElement) throw new Error("Catalyst XML is missing its <state> element");

  const value = deserializeValue(onlyChild(stateElement));
  if (!looksLikeWorkspaceState(value)) {
    throw new Error("Catalyst XML does not contain a recognizable workspace state");
  }
  return value as WorkspaceState;
}
