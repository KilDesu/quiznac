use std::fmt::Display;

use thiserror::Error;

#[derive(Error, Debug)]
pub struct Error(pub anyhow::Error);

#[derive(Error, Debug)]
pub enum FsError<T: Display> {
    /// Erreur lors de l'ouverture d'un store Tauri.
    #[error("Impossible de trouver le fichier de store Tauri \"{name}\"")]
    StoreNotFound { name: T },

    /// Erreur lors de la sauvegarde d'un store Tauri.
    #[error("Impossible de sauvegarder le fichier de store Tauri \"{name}\"")]
    StoreSave { name: T },

    /// Erreur lors de la vérification de l'existence du fichier/dossier à l'emplacement spécifié.
    #[error(
        "Impossible de vérifier l'existence du fichier/dossier à l'emplacement spécifié : {path}"
    )]
    PathExists { path: T },

    /// Erreur lors de la création d'un répertoire à l'emplacement spécifié.
    #[error("Impossible de créer le répertoire à l'emplacement spécifié : {path}")]
    CreateDir { path: T },

    /// Erreur lors de la suppression d'un répertoire à l'emplacement spécifié.
    #[error("Impossible de supprimer le répertoire à l'emplacement spécifié : {path}")]
    DeleteDir { path: T },

    /// Erreur lors de la lecture du contenu du répertoire à l'emplacement spécifié.
    #[error("Impossible de lire le contenu du répertoire à l'emplacement spécifié : {path}")]
    ReadDir { path: T },

    /// Erreur lors de la lecture du fichier à l'emplacement spécifié.
    #[error("Impossible de lire le fichier à l'emplacement spécifié : {path}")]
    ReadFile { path: T },

    /// Erreur lors de l'écriture du fichier à l'emplacement spécifié.
    #[error("Impossible d'écrire le fichier à l'emplacement spécifié : {path}")]
    WriteFile { path: T },

    /// Erreur lors de la suppression du fichier à l'emplacement spécifié.
    #[error("Impossible de supprimer le fichier à l'emplacement spécifié : {path}")]
    DeleteFile { path: T },

    /// Erreur lors de la copie du fichier d'un emplacement source à un emplacement de destination spécifié.
    #[error("Impossible de copier le fichier de l'emplacement source à l'emplacement de destination spécifié : {src} -> {dest}")]
    CopyFile { src: T, dest: T },

    /// Erreur lors du déplacement du fichier d'un emplacement source à un emplacement de destination spécifié.
    #[error("Impossible de déplacer le fichier de l'emplacement source à l'emplacement de destination spécifié : {src} -> {dest}")]
    MoveFile { src: T, dest: T },
}
