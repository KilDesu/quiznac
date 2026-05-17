use std::env::{self, VarError};

use anyhow::anyhow;
use tauri::command;

use crate::prelude::*;

#[command]
pub async fn get_imgbb_key() -> Result<String> {
    let env_var = env::var("IMGBB_API_KEY");

    match env_var {
        Ok(key) => Ok(key),
        Err(err) => match err {
            VarError::NotPresent => Ok("{{ IMGBB_API_KEY }}".to_string()),
            _ => Err(anyhow!("Impossible d'obtenir la clé API de Imgbb: {}", err).into()),
        },
    }
}
