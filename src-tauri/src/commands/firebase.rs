use std::{
    collections::HashMap,
    env::{self, VarError},
};

use anyhow::{anyhow, Context};
use serde::{Deserialize, Serialize};
use tauri::command;

use crate::{error::FsError, prelude::*, store::QuiznacStore};

#[derive(Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct Answer {
    label: String,
    #[serde(skip_serializing_if = "Option::is_none")]
    is_answer: Option<bool>,
}

#[derive(Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct Question {
    label: String,
    #[serde(skip_serializing_if = "Option::is_none")]
    image: Option<String>,
    answers: Vec<Answer>,
    explanation: String,
}

pub type TopicData = HashMap<String, Vec<Question>>;

#[command]
pub async fn get_firebase_key() -> Result<String> {
    let env_var = env::var("FIREBASE_API_KEY");

    match env_var {
        Ok(key) => Ok(key),
        Err(err) => match err {
            VarError::NotPresent => Ok("{{ FIREBASE_API_KEY }}".to_string()),
            _ => Err(anyhow!("Impossible d'obtenir la clé API de Firebase: {}", err).into()),
        },
    }
}

#[command]
pub async fn update_timestamp(
    timestamp: u64,
    topic: String,
    app_handle: tauri::AppHandle,
) -> Result<()> {
    let store = QuiznacStore::Timestamps.get(&app_handle)?;

    store.set(&topic, timestamp);
    store.save().with_err(FsError::StoreSave { name: topic })
}

#[command]
pub async fn get_timestamp(topic: String, app_handle: tauri::AppHandle) -> Result<u64> {
    let store = QuiznacStore::Timestamps.get(&app_handle)?;

    let timestamp = store
        .get(topic)
        .map(|value| value.as_u64())
        .flatten()
        .unwrap_or_default();

    Ok(timestamp)
}

#[command]
pub async fn save_data(data: TopicData, topic: String, app_handle: tauri::AppHandle) -> Result<()> {
    let store = QuiznacStore::Data { topic: &topic }.get(&app_handle)?;

    for subtopic_data in data.into_iter() {
        let (subtopic, questions) = subtopic_data;
        let questions = serde_json::to_value(questions)
            .context("Impossible to convertir les questions en JSON.")?;
        store.set(subtopic, questions);
    }

    store.save().with_err(FsError::StoreSave { name: topic })
}

#[command]
pub async fn load_data(topic: String, app_handle: tauri::AppHandle) -> Result<Option<TopicData>> {
    let store = QuiznacStore::Data { topic: &topic }.get(&app_handle)?;

    let mut topic_data = TopicData::new();
    for (subtopic, questions) in store.entries().into_iter() {
        if subtopic == "metadata" {
            continue;
        }

        topic_data.insert(
            subtopic.to_string(),
            serde_json::from_value(questions).unwrap_or_default(),
        );
    }

    let res = if topic_data.is_empty() {
        None
    } else {
        Some(topic_data)
    };

    Ok(res)
}

#[command]
pub async fn remove_subtopic(
    subtopic: String,
    topic: String,
    app_handle: tauri::AppHandle,
) -> Result<()> {
    let store = QuiznacStore::Data { topic: &topic }.get(&app_handle)?;

    store.delete(&subtopic);

    Ok(())
}
