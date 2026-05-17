use serde::{Deserialize, Serialize};
use smart_default::SmartDefault;
use ts_rs::TS;

#[derive(TS, Debug, Clone, Serialize, Deserialize, SmartDefault)]
#[serde(rename_all = "lowercase")]
#[ts(export, export_to = "theme.ts")]
/// Représente la préférence de thème d'un utilisateur, qui peut être "light", "dark" ou "system".
pub enum ThemePreference {
    Light,
    Dark,
    #[default]
    System,
}
