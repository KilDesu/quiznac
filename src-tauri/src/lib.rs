mod commands;
mod error;
mod firestore;
mod prelude;
mod store;
mod theme;

use commands::*;

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .plugin(tauri_plugin_http::init())
        .plugin(tauri_plugin_fs::init())
        .plugin(tauri_plugin_dialog::init())
        .plugin(tauri_plugin_store::Builder::new().build())
        .setup(|app| {
            if cfg!(debug_assertions) {
                app.handle().plugin(
                    tauri_plugin_log::Builder::default()
                        .level(log::LevelFilter::Info)
                        .build(),
                )?;
            }
            Ok(())
        })
        .invoke_handler(tauri::generate_handler![
            get_theme,
            set_theme,
            get_firebase_key,
            get_imgbb_key,
            get_timestamp,
            update_timestamp,
            save_data,
            load_data,
            remove_subtopic,
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
