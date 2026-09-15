export type PdfSource = {
  documentId: string;
  name: string;
  path: string | null;
  bytes: Uint8Array;
};

const BROWSER_DB_NAME = "catalyst-browser-documents";
const BROWSER_DB_VERSION = 1;
const BROWSER_STORE = "pdfs";

type StoredBrowserPdf = {
  id: string;
  name: string;
  bytes: ArrayBuffer;
};

function hex(buffer: ArrayBuffer): string {
  return [...new Uint8Array(buffer)]
    .map((value) => value.toString(16).padStart(2, "0"))
    .join("");
}

function openBrowserPdfDb(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(BROWSER_DB_NAME, BROWSER_DB_VERSION);
    request.onupgradeneeded = () => {
      const db = request.result;
      if (!db.objectStoreNames.contains(BROWSER_STORE)) {
        db.createObjectStore(BROWSER_STORE, { keyPath: "id" });
      }
    };
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error ?? new Error("Could not open browser PDF store"));
  });
}

export function clearBrowserPdfStore(): Promise<void> {
  if (typeof indexedDB === "undefined") return Promise.resolve();

  return new Promise((resolve, reject) => {
    const request = indexedDB.deleteDatabase(BROWSER_DB_NAME);
    request.onsuccess = () => resolve();
    request.onerror = () => reject(request.error ?? new Error("Could not clear saved PDFs"));
    request.onblocked = () => reject(new Error("Could not clear saved PDFs while the document store is in use"));
  });
}

async function storeBrowserPdf(source: PdfSource): Promise<void> {
  if (typeof indexedDB === "undefined") return;

  const db = await openBrowserPdfDb();
  try {
    await new Promise<void>((resolve, reject) => {
      const transaction = db.transaction(BROWSER_STORE, "readwrite");
      transaction.oncomplete = () => resolve();
      transaction.onerror = () => reject(transaction.error ?? new Error("Could not save PDF"));
      transaction.objectStore(BROWSER_STORE).put({
        id: source.documentId,
        name: source.name,
        bytes: new Uint8Array(source.bytes).buffer,
      } satisfies StoredBrowserPdf);
    });
  } finally {
    db.close();
  }
}
export async function readBrowserPdf(documentId: string): Promise<PdfSource | null> {
  if (typeof indexedDB === "undefined") return null;

  const db = await openBrowserPdfDb();
  try {
    const record = await new Promise<StoredBrowserPdf | undefined>((resolve, reject) => {
      const request = db.transaction(BROWSER_STORE, "readonly").objectStore(BROWSER_STORE).get(documentId);
      request.onsuccess = () => resolve(request.result as StoredBrowserPdf | undefined);
      request.onerror = () => reject(request.error ?? new Error("Could not read saved PDF"));
    });

    if (!record) return null;
    return {
      documentId: record.id,
      name: record.name,
      path: null,
      bytes: new Uint8Array(record.bytes),
    };
  } finally {
    db.close();
  }
}

export async function hashPdfBytes(bytes: Uint8Array): Promise<string> {
  const owned = new Uint8Array(bytes);
  const digest = await crypto.subtle.digest("SHA-256", owned.buffer);
  return `sha256-${hex(digest)}`;
}
export async function browserPdfSource(file: File): Promise<PdfSource> {
  const bytes = new Uint8Array(await file.arrayBuffer());
  const source: PdfSource = {
    documentId: await hashPdfBytes(bytes),
    name: file.name,
    path: null,
    bytes,
  };

  await storeBrowserPdf(source);
  return source;
}
