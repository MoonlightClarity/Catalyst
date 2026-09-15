CREATE TABLE IF NOT EXISTS documents (
    id TEXT PRIMARY KEY NOT NULL,
    name TEXT NOT NULL,
    path TEXT,
    opened_at TEXT NOT NULL,
    last_opened_at TEXT NOT NULL
);

CREATE INDEX IF NOT EXISTS documents_last_opened_idx
    ON documents(last_opened_at DESC);

CREATE TABLE IF NOT EXISTS annotations (
    id TEXT PRIMARY KEY NOT NULL,
    document_id TEXT NOT NULL,
    quote TEXT NOT NULL,
    page_index INTEGER NOT NULL,
    anchors_json TEXT NOT NULL,
    kind TEXT NOT NULL CHECK (kind IN ('excerpt', 'highlight')),
    created_at TEXT NOT NULL,
    FOREIGN KEY (document_id) REFERENCES documents(id) ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS annotations_document_idx
    ON annotations(document_id, page_index);

CREATE TABLE IF NOT EXISTS notes (
    id TEXT PRIMARY KEY NOT NULL,
    title TEXT NOT NULL DEFAULT '',
    body TEXT NOT NULL DEFAULT '',
    created_at TEXT NOT NULL,
    updated_at TEXT NOT NULL,
    deleted_at TEXT
);

CREATE INDEX IF NOT EXISTS notes_updated_idx
    ON notes(updated_at DESC);

CREATE INDEX IF NOT EXISTS notes_deleted_idx
    ON notes(deleted_at);

CREATE TABLE IF NOT EXISTS note_annotations (
    note_id TEXT NOT NULL,
    annotation_id TEXT NOT NULL,
    created_at TEXT NOT NULL,
    PRIMARY KEY (note_id, annotation_id),
    FOREIGN KEY (note_id) REFERENCES notes(id) ON DELETE CASCADE,
    FOREIGN KEY (annotation_id) REFERENCES annotations(id) ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS note_annotations_annotation_idx
    ON note_annotations(annotation_id);

CREATE TABLE IF NOT EXISTS settings (
    key TEXT PRIMARY KEY NOT NULL,
    value TEXT NOT NULL
);
