CREATE TABLE IF NOT EXISTS viewer_markups (
    id TEXT PRIMARY KEY NOT NULL,
    document_id TEXT NOT NULL,
    page_index INTEGER NOT NULL,
    annotation_json TEXT NOT NULL,
    ctx_data_base64 TEXT,
    ctx_mime_type TEXT,
    created_at TEXT NOT NULL,
    updated_at TEXT NOT NULL,
    FOREIGN KEY (document_id) REFERENCES documents(id) ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS viewer_markups_document_idx
    ON viewer_markups(document_id, page_index);
