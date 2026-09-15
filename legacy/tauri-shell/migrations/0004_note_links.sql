CREATE TABLE IF NOT EXISTS note_links (
    from_note_id TEXT NOT NULL,
    to_note_id TEXT NOT NULL,
    created_at TEXT NOT NULL,
    PRIMARY KEY (from_note_id, to_note_id),
    CHECK (from_note_id <> to_note_id),
    FOREIGN KEY (from_note_id) REFERENCES notes(id) ON DELETE CASCADE,
    FOREIGN KEY (to_note_id) REFERENCES notes(id) ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS note_links_to_note_idx
    ON note_links(to_note_id, created_at DESC);
