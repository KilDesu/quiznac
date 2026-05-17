use std::{fmt::Display, sync::Arc};

use tauri::{AppHandle, Runtime};
use tauri_plugin_store::{Store, StoreExt};

use crate::{error::FsError, prelude::*, store::QuiznacStore};

impl<'a> Display for QuiznacStore<'a> {
    fn fmt(&self, f: &mut std::fmt::Formatter<'_>) -> std::fmt::Result {
        match self {
            Self::Config => write!(f, "config.json"),
            Self::Timestamps => write!(f, "timestamps.json"),
            Self::Data { topic } => write!(f, "{}.json", topic),
        }
    }
}

impl<'a> QuiznacStore<'a> {
    pub fn get<R: Runtime>(self, app_handle: &AppHandle<R>) -> Result<Arc<Store<R>>> {
        app_handle
            .store(self.to_string())
            .with_err(FsError::StoreNotFound { name: self })
    }
}
