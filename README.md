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

## Ce qui est en place (v0.4)

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
- **Initiative et emplacements** (chapitre VI) :
  - une fenêtre demande, pour chaque combattant, Vigilance ou Calme ;
  - les résultats forment des emplacements PJ et PNJ, classés par succès puis avantages (égalité : PJ d'abord) ;
  - à chaque emplacement, un combattant du même camp qui n'a pas encore agi peut le prendre (bouton main dans le
    tracker) ; le combattant prévu garde l'emplacement libéré ;
  - le tracker affiche l'initiative en succès et avantages ;
  - Réaction éclair : stress subi contre des succès d'initiative, choisi dans la fenêtre ;
  - les vaisseaux n'ont pas d'initiative : ce sont les membres d'équipage qui sont ajoutés au combat (chapitre VII).
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
- **Compendium des espèces** : les 19 espèces des trois livres, avec leur texte. En déposant une espèce sur un
  personnage, ses caractéristiques, son XP de départ, ses rangs et ses talents offerts sont appliqués
  (une fenêtre s'ouvre pour les choix, par exemple Charme ou Tromperie).
- **Compendiums des carrières et spécialités** : les 18 carrières et les 57 arborescences des trois livres
  (cases, activation, talents de la Force, liens), achetables en XP depuis la fiche.
- **Compendium des talents** : les 268 talents des trois livres avec leur texte et leurs symboles. Un talent acheté
  dans un arbre est repris du compendium ; les effets chiffrés (Endurci, Robustesse, Valeur de Force, techniques de
  sabre laser…) sont appliqués automatiquement.

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

Les compendiums reprennent le texte des livres, pour un usage privé. Ils sont générés depuis `tools/data/`
par `npm run build:packs`.

## Développement

```bash
npm test                         # tests des règles (dés, réserve, arborescences)
tools/release.sh v0.1.0 "Titre" "Notes"
```

Star Wars est une marque de Lucasfilm Ltd. Les jeux de rôle Star Wars sont publiés par Fantasy Flight Games
(VF : Edge Entertainment). Ce projet est un travail de fan, gratuit et sans lien avec ces sociétés.
