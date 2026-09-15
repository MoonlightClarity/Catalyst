CREATE TABLE IF NOT EXISTS technique_definitions (
    id TEXT PRIMARY KEY NOT NULL,
    name TEXT NOT NULL,
    summary TEXT NOT NULL DEFAULT '',
    category TEXT NOT NULL CHECK (category IN ('diagnostic', 'contrarian', 'imaginative', 'other')),
    version INTEGER NOT NULL DEFAULT 1,
    steps_json TEXT NOT NULL,
    created_at TEXT NOT NULL,
    updated_at TEXT NOT NULL
);

CREATE INDEX IF NOT EXISTS technique_definitions_updated_idx
    ON technique_definitions(updated_at DESC);

CREATE TABLE IF NOT EXISTS technique_runs (
    id TEXT PRIMARY KEY NOT NULL,
    note_id TEXT NOT NULL,
    definition_id TEXT NOT NULL,
    definition_version INTEGER NOT NULL,
    definition_snapshot_json TEXT NOT NULL,
    responses_json TEXT NOT NULL,
    created_at TEXT NOT NULL,
    updated_at TEXT NOT NULL,
    FOREIGN KEY (note_id) REFERENCES notes(id) ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS technique_runs_note_idx
    ON technique_runs(note_id, created_at);
