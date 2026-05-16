use std::collections::HashMap;

use serde::{Deserialize, Serialize};
use ts_rs::TS;

#[derive(Serialize, Deserialize, TS)]
#[serde(rename_all = "camelCase")]
#[ts(export, export_to = "firestore.ts")]
/// Représente une réponse de QCU/QCM.
pub struct Answer {
    /// La réponse.
    label: String,
    #[serde(skip_serializing_if = "Option::is_none")]
    /// Est-ce que c'est une bonne réponse ou non.
    /// Est Some seulement si `true`, sinon None.
    is_answer: Option<bool>,
}

#[derive(Serialize, Deserialize, TS)]
#[serde(rename_all = "camelCase")]
#[ts(export, export_to = "firestore.ts")]
/// Représente une question de QCU/QCM.
pub struct Question {
    /// Le texte de la question.
    label: String,
    #[serde(skip_serializing_if = "Option::is_none")]
    /// URL de l'image associée à la question s'il y en a.
    image: Option<String>,
    /// Les réponses possibles.
    answers: Vec<Answer>,
    /// L'explication de pourquoi les réponses correctes le sont.
    explanation: String,
}

/// Représente les données qui sont cachées en local.
/// Il s'agit d'une hashmap dont les clés sont un chapitre du topic et les valeurs sont les questions qui y sont associées.
///
/// Par exemple, un topic pourrait être `ATLA`, et un chapitre `Altimétrie`.
pub type TopicData = HashMap<String, Vec<Question>>;
