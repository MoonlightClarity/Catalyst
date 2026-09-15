use tauri_plugin_sql::{Migration, MigrationKind};

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    let migrations = vec![
        Migration {
            version: 1,
            description: "initial_research_workspace",
            sql: include_str!("../migrations/0001_initial.sql"),
            kind: MigrationKind::Up,
        },
        Migration {
            version: 2,
            description: "analytic_techniques",
            sql: include_str!("../migrations/0002_analytic_techniques.sql"),
            kind: MigrationKind::Up,
        },
        Migration {
            version: 3,
            description: "viewer_markups",
            sql: include_str!("../migrations/0003_viewer_markups.sql"),
            kind: MigrationKind::Up,
        },
        Migration {
            version: 4,
            description: "note_links",
            sql: include_str!("../migrations/0004_note_links.sql"),
            kind: MigrationKind::Up,
        },
    ];

    tauri::Builder::default()
        .plugin(tauri_plugin_fs::init())
        .plugin(tauri_plugin_persisted_scope::init())
        .plugin(tauri_plugin_dialog::init())
        .plugin(
            tauri_plugin_sql::Builder::default()
                .add_migrations("sqlite:catalyst.db", migrations)
                .build(),
        )
        .run(tauri::generate_context!())
        .expect("error while running Catalyst");
}
