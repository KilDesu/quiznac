import type { Question } from "~/bindings";

export interface Subtopics {
  Aéronef: AeronefSubtopic;
  ATLA: AtlaSubtopic;
  "Équipements et systèmes": EquipementsSubtopic;
  Météo: MeteoSubtopic;
  Moteur: MoteurSubtopic;
  Navigation: NavSubtopic;
}

export type Subtopic<T extends Topic> = Subtopics[T];

export interface SubtopicData {
  questions: Question[];
}

export type SubtopicDocument<T extends Topic> = {
  [K in Subtopic<T>]: SubtopicData;
};

export const Topics = [
  "Aéronef",
  "ATLA",
  "Équipements et systèmes",
  "Météo",
  "Moteur",
  "Navigation",
] as const;
export type Topic = UnionFromArray<typeof Topics>;

export const AtlaSubtopics = [
  "Introduction et organisations",
  "Unités et tables d'épellation",
  "Services de la circulation aérienne",
  "Aérodrome",
  "Procédures et séparations",
  "Altimétrie",
  "Règles de l'air",
  "Espace aérien",
  "Routes",
  "Attentes",
] as const;
export type AtlaSubtopic = UnionFromArray<typeof AtlaSubtopics>;

export const AeronefSubtopics = [
  "Introduction",
  "Élements de structure",
  "Unités et pilotage",
  "Forces en vol et portance",
  "Les traînées",
  "Hypersustentateurs et aérofreins",
  "Phases en vol",
  "Enveloppe de vol",
  "Anémométrie",
  "Stabilité",
] as const;
export type AeronefSubtopic = UnionFromArray<typeof AeronefSubtopics>;

export const EquipementsSubtopics = [
  "Signaux et ondes radio",
  "Principes de la radio",
  "Communications vocales pour l'ATC",
  "Exploitation opérationnelle des fréquences",
  "Communications non vocales",
  "Radiogoniométrie",
] as const;
export type EquipementsSubtopic = UnionFromArray<typeof EquipementsSubtopics>;

export const MeteoSubtopics = [
  "Atmosphère",
  "Énergie",
  "Température",
  "Pression",
  "Altimétrie barométrique",
  "Eau",
  "Nuages",
  "Précipitations",
  "Vent",
  "Circulation générale",
  "Masses d'air",
  "Systèmes frontaux",
  "Phénomènes locaux",
  "Visibilité",
  "Givrage",
  "Turbulence",
  "Cisaillement du vent",
  "CB et orages",
  "Cendres volcaniques",
  "Météorologie spatiale",
  "Services météo et organisation",
  "Messages d'aérodrome",
  "Messages en route",
  "Cartes météorologiques",
] as const;
export type MeteoSubtopic = UnionFromArray<typeof MeteoSubtopics>;

export const MoteurSubtopics = [] as const;
export type MoteurSubtopic = UnionFromArray<typeof MoteurSubtopics>;

export const NavSubtopics = [
  "Introduction",
  "La Terre",
  "Positionnement",
  "Unités de mesure",
  "Directions",
  "Distances",
  "Les temps",
  "Le magnétisme",
  "Les cartes OACI",
  "Les cartes commerciales",
  "Le triangle des vitesses",
  "Considérations opérationnelles",
  "Les systèmes de navigation",
  "Introduction à la radionavigation",
  "VEF (VHF Direction Finding)",
  "ADF (Automatic Direction Finder) et NDB (Non Directional Finder)",
  "VOR (VHF Omnidirectional Radio Range)",
  "DME (Distance Measuring Equipment)",
  "TACAN (TACtical Air Navigation)",
  "ILS (Instrument Landing System)",
  "Instruments de bord",
  "INS (Inertial Navigation System)",
  "GNSS (Global Navigation Satellite System)",
  "FMS (Flight Management Systems)",
  "RNAV (Area Navigation) et PBN (Performance-Based Navigation)",
  "Classification des approches aux instruments",
  "Cartes de vol aux instruments",
  "Les minima pour les approches aux instruments",
  "Procédures d'approche aux instruments",
] as const;
export type NavSubtopic = UnionFromArray<typeof NavSubtopics>;
