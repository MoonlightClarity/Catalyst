import type { ViewerMarkup } from "../domain/types";

type TransferItemLike = {
  annotation?: any;
  ctx?: {
    data?: unknown;
    mimeType?: unknown;
  } | null;
};

function jsonClone<T>(value: T): T {
  if (value === undefined) return value;
  return JSON.parse(JSON.stringify(value)) as T;
}

function bytesFromBinary(value: unknown): Uint8Array | null {
  if (value instanceof ArrayBuffer) return new Uint8Array(value);
  if (ArrayBuffer.isView(value)) {
    return new Uint8Array(value.buffer, value.byteOffset, value.byteLength);
  }
  return null;
}

export function bytesToBase64(bytes: Uint8Array): string {
  let binary = "";
  const chunkSize = 0x8000;
  for (let offset = 0; offset < bytes.length; offset += chunkSize) {
    const chunk = bytes.subarray(offset, Math.min(offset + chunkSize, bytes.length));
    binary += String.fromCharCode(...chunk);
  }
  return btoa(binary);
}

export function base64ToArrayBuffer(base64: string): ArrayBuffer {
  const binary = atob(base64);
  const bytes = new Uint8Array(binary.length);
  for (let index = 0; index < binary.length; index += 1) {
    bytes[index] = binary.charCodeAt(index);
  }
  return bytes.buffer;
}

export function viewerMarkupFromTransferItem(
  documentId: string,
  pageIndex: number,
  transferItem: TransferItemLike,
  previous: ViewerMarkup | undefined,
  now = new Date().toISOString(),
): ViewerMarkup | null {
  const annotation = transferItem?.annotation;
  const id = String(annotation?.id ?? "").trim();
  if (!id) return null;

  const normalizedPageIndex = Number(annotation?.pageIndex ?? pageIndex);
  if (!Number.isFinite(normalizedPageIndex) || normalizedPageIndex < 0) return null;

  const binary = bytesFromBinary(transferItem.ctx?.data);
  const contextMimeType =
    typeof transferItem.ctx?.mimeType === "string"
      ? transferItem.ctx.mimeType
      : null;

  return {
    id,
    documentId,
    pageIndex: Math.trunc(normalizedPageIndex),
    formatVersion: 1,
    annotationJson: JSON.stringify(
      jsonClone({ ...annotation, pageIndex: Math.trunc(normalizedPageIndex) }),
    ),
    contextDataBase64: binary ? bytesToBase64(binary) : null,
    contextMimeType,
    createdAt: previous?.createdAt ?? now,
    updatedAt: now,
  };
}

export function viewerMarkupToTransferItem(markup: ViewerMarkup): {
  annotation: unknown;
  ctx?: { data: ArrayBuffer; mimeType?: string };
} {
  if (markup.formatVersion !== 1) {
    throw new Error(`Unsupported viewer markup format version: ${markup.formatVersion}`);
  }

  const annotation = JSON.parse(markup.annotationJson) as unknown;
  if (!markup.contextDataBase64) return { annotation };

  return {
    annotation,
    ctx: {
      data: base64ToArrayBuffer(markup.contextDataBase64),
      ...(markup.contextMimeType ? { mimeType: markup.contextMimeType } : {}),
    },
  };
}
