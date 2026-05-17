/// Représente un store Tauri.
pub enum QuiznacStore<'a> {
    /// Configuration générale de l'application, qui contient notamment les préférences de thème.
    Config,
    /// Stocke les horodatages des dernières mises en cache local des questions pour chaque topic.
    Timestamps,
    /// Store qui sert de cache pour les questions liées au topic donné.
    ///
    /// Ce store contient de la donnée sous forme de `TopicData`.
    Data { topic: &'a str },
}
