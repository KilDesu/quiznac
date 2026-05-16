use std::fmt::Display;

use crate::{prelude::*, store::QuiznacStore, theme::ThemePreference};

impl Display for ThemePreference {
    fn fmt(&self, f: &mut std::fmt::Formatter<'_>) -> std::fmt::Result {
        match self {
            Self::Light => write!(f, "light"),
            Self::Dark => write!(f, "dark"),
            Self::System => write!(f, "system"),
        }
    }
}

impl ThemePreference {
    pub fn get(app_handle: &tauri::AppHandle) -> Result<Self> {
        let store = QuiznacStore::Config.get(app_handle)?;

        let maybe_val = store.get("theme");

        let result = maybe_val.map(|val| match val.as_str() {
            Some("light") => Self::Light,
            Some("dark") => Self::Dark,
            Some("system") => Self::System,
            _ => Self::default(),
        });

        if let Some(pref) = result {
            Ok(pref)
        } else {
            Self::set(app_handle, Self::default())?;
            Ok(Self::default())
        }
    }

    pub fn set(app_handle: &tauri::AppHandle, theme: Self) -> Result<()> {
        let store = QuiznacStore::Config.get(app_handle)?;

        store.set("theme", theme.to_string());

        Ok(())
    }
}
