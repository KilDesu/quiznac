# QUIZNAC - Application de Quiz pour l'ENAC

## A quoi ça sert ?

Cette application sert à rassembler des quiz pour tous les cours de 2ème année GSEA afin de faciliter les révisions.

Cela permet d'éviter les aller-retours entre les différents cours sur E-Campus, sans parler des cours qui n'ont pas de quiz.

## Qui crée et modifie ces quiz ?

Tout le monde ! C'est pourquoi on compte sur la communauté pour faire vivre cette application et en tenir les données à jour, et de qualité.

## Comment contribuer ?

### La structure des données

Les donées sont structurées en cours, chacun contenant des chapitres, eux-mêmes contenant des questions.

Il est possible d'ajouter, de modifier et de retirer des chapitres et des questions. Pour les cours, il faut contacter [l'administrateur](mailto:contact.quiznac@gmail.com) directement.

Chaque question peut avoir un nombre arbitraire de réponses, dont une ou plusieurs peuvent être correctes. Les questions peuvent également contenir des images.

### Les problèmes

S'il y a des erreurs, merci de contacter [l'administrateur](mailto:contact.quiznac@gmail.com) ou d'utiliser les issues Github.

### Développement

Tout d'abord, cloner le projet : `git clone https://github.com/KilDesu/quiznac.git`

Ce projet utilise `Tauri` pour créer des applications de bureau et mobiles, le langage `Rust` pour le backend et `VueJS` pour le frontend.

Par confort, le frontend utilise `Nuxt 4` (pour les auto-import et le routeur) et `Quasar` pour la librairie de composants.

Les quiz sont hébergés sur `Firestore` (aucune donnée sensible n'y est stockée) et les images le sont sur `Imgbb`.
