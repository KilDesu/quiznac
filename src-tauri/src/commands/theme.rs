use tauri::{command, AppHandle};

use crate::{prelude::*, theme::ThemePreference};

#[command]
pub async fn get_theme(app_handle: AppHandle) -> Result<ThemePreference> {
    ThemePreference::get(&app_handle)
}

#[command]
pub async fn set_theme(app_handle: AppHandle, theme: ThemePreference) -> Result<()> {
    ThemePreference::set(&app_handle, theme)
}
