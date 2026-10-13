# Star Wars — Le jeu de rôle (FFG / Edge) pour Foundry VTT

Système **non officiel** pour Foundry VTT **V13 et V14** couvrant les trois livres de base de la gamme narrative :
*Aux Confins de l'Empire*, *L'Ère de la Rébellion* et *Force et Destinée*.
Il a été écrit de zéro sur les API actuelles de Foundry (ApplicationV2, TypeDataModel) et ne reprend
aucune API héritée de V1. Il remplace l'ancien système communautaire, devenu obsolète.

## Installation

Dans Foundry : *Systèmes de jeu → Installer un système*, puis collez l'URL du manifeste :

```
https://github.com/tomjdr4-hub/star-wars-ffg/releases/latest/download/system.json
```

## Ce qui est en place (v0.1)

- **Dés narratifs** : aptitude, maîtrise, difficulté, défi, fortune, infortune et Force.
  - Formules Foundry `da`, `dp`, `di`, `dc`, `db`, `dk`, `df` (par exemple `/r 2da + 1dp + 2di`).
  - Résultat net calculé automatiquement, carte de chat détaillée.
- **Fenêtre de jet** :
  - ajout et retrait de dés, amélioration et dégradation ;
  - choix de la difficulté ;
  - symboles ajoutés par les talents ;
  - Maj + clic pour lancer sans la fenêtre.
- **Fiche de personnage** :
  - caractéristiques, compétences de carrière et achat de rangs en XP ;
  - seuils calculés (blessure, stress, encaissement, défense, encombrement) ;
  - blessures critiques, talents, arborescences de spécialité cliquables (achat en XP selon les liens) ;
  - pouvoirs de la Force, équipement ;
  - Obligation, Devoir, Moralité et Motivations.
- **Adversaires** : rival, némésis et groupes de sbires (compétences de groupe, membres restants).
- **Vaisseaux et véhicules** : profil complet, défense par arc, armes (le test est fait par le personnage du joueur).
- **Armes** : attributs, dégâts et critique déclenché affichés dans le chat.
- **Initiative** : test de Vigilance ou de Calme, classé par succès puis avantages.
- **Réserve de Destin** partagée :
  - les joueurs retournent un point lumineux, le MJ un point obscur ;
  - génération en début de session avec les effets de Moralité.
- **Jet de début de session** (un seul d100) :
  - Obligation : seuil de stress −1 / −2 ;
  - Devoir : seuil de blessure +1 / +2 ;
  - Moralité déclenchée (optionnelle) ;
  - effets doublés sur un double.
- **Moralité** :
  - résolution du Conflit en fin de session ;
  - seuils du côté obscur et des parangons ;
  - statut d'adepte du côté obscur conservé jusqu'au rachat.

## Les trois livres et leurs différences

Le fichier [docs/ANALYSE.md](docs/ANALYSE.md) détaille ce que les livres partagent et ce qui les distingue :
- Stratégie n'existe que dans EdR, Sabre laser que dans F&D ;
- Obligation, Devoir et Moralité, et les façons de les combiner ;
- carrières, spécialités, pouvoirs de la Force ;
- écarts de traduction entre les livres.

Réglages du monde :
- **Livres de base utilisés** : définit les compétences propres à un livre affichées par défaut.
- **Obligation, Devoir et Moralité** : une mécanique pour tout le groupe, selon la carrière de chaque PJ,
  Moralité seulement pour les PJ sensibles à la Force, ou toutes.
- **Moralité déclenchée** (règle optionnelle de F&D).
- **Compétence d'initiative** par défaut.

## Contenu

Le système ne contient **aucun texte des livres**. Les compendiums (talents, spécialités, armes…)
viendront dans un second temps.

## Développement

```bash
npm test                         # tests des règles (dés, réserve, arborescences)
tools/release.sh v0.1.0 "Titre" "Notes"
```

Star Wars est une marque de Lucasfilm Ltd. Les jeux de rôle Star Wars sont publiés par Fantasy Flight Games
(VF : Edge Entertainment). Ce projet est un travail de fan, gratuit et sans lien avec ces sociétés.
