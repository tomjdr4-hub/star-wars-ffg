# Analyse des trois livres de base

Ce document résume ce que les trois livres de règles en français ont en commun, ce qui les distingue,
et comment le système Foundry en tient compte. Les numéros de page renvoient aux livres imprimés (VF Edge).

| Abréviation | Livre | Mécanique de l'étape 2 | Thème |
|---|---|---|---|
| **AoE** | *Aux Confins de l'Empire* | Obligation | Marginaux, pègre, Bordure |
| **EdR** | *L'Ère de la Rébellion* | Devoir (+ rang de Contribution) | Guerre civile galactique |
| **F&D** | *Force et Destinée* | Moralité (+ Conflit) | Utilisateurs de la Force |

## 1. Le socle commun (identique dans les trois livres)

Les chapitres I (Le Jeu), V (Matériel), VI (Combat) et VII (Vaisseaux et véhicules) sont pratiquement
identiques d'un livre à l'autre. Le système les implémente une seule fois.

- **Dés narratifs** : aptitude (d8 vert), maîtrise (d12 jaune), difficulté (d8 violet), défi (d12 rouge),
  fortune (d6 bleu), infortune (d6 noir) et Force (d12 blanc).
- **Symboles** : succès, avantage, triomphe, échec, menace, désastre, côté lumineux et côté obscur.
  - Un triomphe compte aussi comme un succès, et un désastre comme un échec.
  - Succès et échecs s'annulent, de même qu'avantages et menaces.
- **Réserve de base** : on prend la plus haute valeur entre la caractéristique et le rang de compétence,
  et on améliore autant de dés que la plus basse.
- **Ordre des modifications** de la réserve : ajouter, puis améliorer, puis dégrader, puis retirer.
- **Difficultés** : Simple (0), Facile (1), Moyenne (2), Difficile (3), Intimidante (4), Exceptionnelle (5).
- **Caractéristiques** : Vigueur, Agilité, Intelligence, Ruse, Volonté, Présence.
- **Portées** : au contact, courte, moyenne, longue et extrême.
  Pour les véhicules : rapprochée, courte, moyenne, longue et extrême.
- **Attributs d'armes** : les mêmes dans les trois livres (Précis, Automatique, Brèche, Incendiaire, Souffle,
  Choc, Cortosis, Encombrant, Parade, Déflexion, Désorientation, Entrave, Projectile guidé, Renversement,
  Imprécis, Mauvaise qualité, Ionique, Munitions limitées, Jumelé, Perforant, Déploiement, Cadence lente,
  Étourdissement, Dégâts étourdissants, Briseur, Bonne qualité, Tracteur, Sanguinaire).
  Seule différence : AoE écrit « Niveau de critique », EdR et F&D écrivent « Critique ».
- **Valeurs dérivées** :
  - seuil de blessure = base de l'espèce + Vigueur ;
  - seuil de stress = base de l'espèce + Volonté ;
  - encaissement = Vigueur + armure ;
  - seuil d'encombrement = 5 + Vigueur (une armure portée compte pour 3 de moins).
- **Réserve de Destin** : un dé de Force par joueur au début de la session. Un joueur retourne un point lumineux,
  le MJ un point obscur.
- **Adversaires** : sbires (groupe, compétences de groupe), rivaux (pas de seuil de stress) et némésis.

## 2. Différences de règles

### 2.1 Compétences (table 3-1)

| Compétence | AoE | EdR | F&D |
|---|:-:|:-:|:-:|
| Les 33 compétences communes | ✓ | ✓ | ✓ |
| **Stratégie** (Connaissance, Intelligence) | — | ✓ | — |
| **Sabre laser** (Combat, Vigueur) | — | — | ✓ |

EdR p. 343 précise qu'un personnage issu d'un autre livre peut acquérir Stratégie comme compétence hors carrière.
**Dans le système**, ces deux compétences sont affichées selon les livres cochés dans les réglages
(ou partout grâce à l'option « Afficher Stratégie et Sabre laser »). Une compétence où le personnage a des rangs
reste toujours visible.

### 2.2 Étape 2 : Obligation, Devoir et Moralité

| | Obligation (AoE) | Devoir (EdR) | Moralité (F&D) |
|---|---|---|---|
| Valeur de départ | selon la taille du groupe (40 à 60 pour le groupe) | selon la taille du groupe (30 à 50 pour le groupe) | 50 |
| Échange contre des bonus | **prendre** plus d'Obligation : +5 XP, +10 XP, +1 000 ou +2 500 crédits | **réduire** le Devoir : mêmes bonus | +10 XP, +2 500 crédits, +5 XP et +1 000 crédits, **ou** Moralité ±21 |
| Jet de début de session | d100 ≤ Obligation du groupe | d100 ≤ Devoir du groupe | optionnel : PJ dont la Moralité est la plus proche du d100 |
| Effet | seuil de **stress −1** pour tous, −2 pour le PJ concerné | seuil de **blessure +1** pour tous, +2 pour le PJ concerné | gain ou perte de Moralité doublé en fin de session |
| Sur un double (11, 22…) | effets doublés | effets doublés | — |
| Progression | rachat de l'Obligation | Devoir > 100 pour le groupe : rang de Contribution +1, récompense, remise à 0 | Conflit : 1d10 − Conflit en fin de session |

Règles de Moralité (F&D p. 51-53) :

- **Côté obscur** sous 30. Le statut est « collant » : on ne redevient lumineux qu'en dépassant 70.
- Sous 20 : stress −1 et blessure +1. Sous 10 : stress −2 et blessure +2.
- Un adepte du côté obscur génère ses points de Force avec les résultats obscurs. Utiliser les résultats lumineux
  lui coûte un point de Destin et du stress.
- **Parangon** au-dessus de 70 : +1 point de Destin lumineux. Au-dessus de 80 : stress +1. Au-dessus de 90 : stress +2.

**Combiner les mécaniques** (EdR p. 342-343, F&D p. 338-339) :

- Modes possibles : une seule mécanique pour tout le groupe, la mécanique du livre de la carrière de chaque PJ,
  Obligation ou Devoir pour tous et Moralité pour les PJ sensibles à la Force, ou n'importe quelle combinaison.
- Les valeurs de départ se calculent sur le nombre de PJ qui utilisent la mécanique, pas sur la taille du groupe.
- Un **seul d100** en début de session est comparé à toutes les tables.
- Quel que soit le nombre de mécaniques utilisées, un personnage ne gagne **jamais plus de +2 500 crédits
  et/ou +10 XP** au départ.
- Dans une partie qui n'utilise pas la Moralité, un PJ de F&D ignore son Conflit.

**Dans le système** :

- le réglage « Obligation, Devoir et Moralité » choisit le mode ;
- chaque fiche peut forcer une mécanique sur « oui », « non » ou « auto » ;
- l'outil *Début de session* (bouton d20 de la barre des jetons) fait le jet unique et applique
  les modificateurs de seuils ;
- le bouton « Fin de session » de la fiche résout le Conflit.

### 2.3 Carrières et spécialités

| AoE | EdR | F&D |
|---|---|---|
| Chasseur de primes : Assassin, Expert en gadgets, Expert en survie | As : Fonceur, Artilleur, Pilote | Consulaire : Guérisseur, Disciple niman, Sage |
| Colon : Médecin, Diplomate, Érudit | Stratège : Chef d'escadron, Commodore, Tacticien | Gardien : Pacificateur, Protecteur, Défenseur soresu |
| Explorateur : Bourlingueur, Éclaireur, Négociant | Diplomate : Ambassadeur, Agitateur, Intendant | Mystique : Conseiller, Duelliste makashi, Visionnaire |
| Mercenaire : Garde du corps, Maraudeur, Soldat à louer | Ingénieur : Mécanicien, Saboteur, Scientifique | Errant : Arpenteur, Bretteur ataru, Chasseur |
| Contrebandier : Pilote, Vaurien, Voleur | Soldat : Commando, Urgentiste, Tireur d'élite | Sentinelle : Artisan, Ombre, Expert shien |
| Technicien : Mécanicien, Tech hors-la-loi, Slicer | Espion : Taupe, Éclaireur, Slicer | Guerrier : Agresseur, Chevalier shii-cho, As de l'espace |
| *Universelle* : Fugitif de la Force | *Universelles* : Aspirant de la Force, Recrue | — |

Points d'attention :

- **Noms VF** : la carrière *Seeker* s'appelle **Errant** dans la VF de F&D, et *Commander* s'appelle **Stratège** dans
  la VF d'EdR.
- **Nombre de compétences de carrière** : 8 par carrière dans AoE et EdR, mais **6 dans F&D**. Chaque spécialité
  ajoute 4 compétences bonus dans les trois livres (sauf les spécialités de la Force, qui n'en ont pas).
- **Talents de la Force** (étoile sur l'arbre) : 11 cases sur 20 pour Fugitif / Aspirant de la Force, et de 3 à 11
  pour les spécialités de F&D. Aucune dans les autres spécialités d'AoE et EdR.

- **Valeur de Force** :
  - dans F&D, toutes les carrières commencent avec une Valeur de Force de 1 (champ « Valeur de Force accordée »
    de la carrière) ;
  - dans AoE et EdR, elle vient des spécialités universelles Fugitif ou Aspirant de la Force
    (même champ sur la spécialité).
- **Spécialités redondantes** (EdR p. 343) : Pilote, Mécanicien, Slicer et Éclaireur existent dans deux carrières
  avec le même arbre. Un personnage ne peut pas prendre deux fois la même spécialité.
- Le **Diplomate** est une spécialité du Colon dans AoE et une carrière dans EdR.

### 2.4 Talents

Le format est le même partout (activation, rangs, arborescences), et un talent commun à plusieurs livres
garde les mêmes règles. Ce qui change :

- **La traduction**. Le même talent VO peut porter deux noms français, et deux talents différents peuvent
  avoir des noms proches. Il faut vérifier par la règle, pas par le nom. Par exemple, *Coup précis* (AoE,
  Precise Aim) et *Visée juste* (EdR, True Aim) sont deux talents différents.
- **Noms différents entre l'arbre et le chapitre des talents** (même livre) : le compendium garde le nom du chapitre
  et accepte le nom de l'arbre.
  - EdR : « Bourlingueur » (arbre de la Recrue) = « Grand voyageur ».
  - F&D : « Œil aiguisé » = « Aux aguets » ; « Adversaires multiples » = « Encerclé » ; « Plan B » = « Plan d'urgence ».
- **Règles différentes pour un même talent** :
  - Connaissances spécialisées : passif dans AoE, actif (broutille) dans EdR et F&D.
  - Perception des émotions : actif (broutille) dans AoE, passif (et talent de la Force) dans F&D.
  - Sixième sens : sans rangs dans AoE et EdR, à rangs dans F&D.
  - Sérénité : compte les résultats lumineux dans EdR, les points de Force dans F&D.
- **Les talents propres à chaque livre** : formes de sabre laser (Parer, Dévier, techniques Makashi, Soresu,
  Ataru, Niman, Shien, Djem So, Shii-Cho) et talents de la Force dans F&D ; talents militaires et de véhicules
  (Salves précises, Formation incisive, Expert commandant…) dans EdR.

### 2.5 La Force

| | AoE | EdR | F&D |
|---|---|---|---|
| Pouvoirs | Détection, Influence, Déplacement | Déplacement, Renforcement, Prédiction | Déplacement, Détection, Guérison/Blessure, Influence, Méditation de bataille, Mystification, Prédiction, Protection/Déchaînement, Renforcement, Saisie, Trouvaille |
| Symbole du coût | ○ (point lumineux) | ○ | ◑ (point de Force, lumineux ou obscur selon la Moralité) |

Les arbres d'amélioration des pouvoirs communs ont les mêmes cases et les mêmes coûts. Il y a toutefois
des écarts de texte. Exemple :

- **Déplacement**, amélioration de Contrôle « lancer des objets » :
  - AoE et EdR : test de **Sang-froid** combiné au test de pouvoir ;
  - VF de F&D : test de **combat à distance** combiné au test de pouvoir.
- F&D ajoute aussi « ce pouvoir n'autorise pas d'activations multiples ».

**Dans le système** :

- chaque amélioration a un champ libre « test associé » ;
- la source (livre et page) est notée sur chaque objet, pour que la table choisisse la version qu'elle applique ;
- le jet de pouvoir compte les résultats obscurs comme points de Force si le personnage est adepte du côté obscur.

### 2.6 Espèces

| AoE | EdR | F&D |
|---|---|---|
| Bothan, Droïde, Gand, Humain, Rodien, Trandoshan, Twi'lek, Wookie | Bothan, Droïde, Duros, Gran, Humain, Ithorien, Mon Calamari, Sullustéen | Céréen, Humain, Kel Dor, Mirialan, Nautolan, Togruta, Twi'lek, Zabrak |

Les Bothans, Droïdes, Humains et Twi'leks apparaissent dans deux livres ou plus. Leurs profils ont été comparés
case par case : **caractéristiques, seuils, XP et capacités sont identiques** d'un livre à l'autre.
Seules différences :
- Le texte d'ambiance propre à chaque gamme (« La vie dans la Bordure », « Au sein de l'Alliance »,
  « Perception de la Force »).
- La capacité environnementale du Twi'lek, qui n'est nommée (« Habitants du désert ») que dans F&D.
- Les renvois de pages des droïdes (implants, réparation).

Le compendium **Espèces** contient donc un seul objet par espèce (19 au total). Il reprend le texte du premier livre
et les paragraphes propres à chaque gamme. Les capacités mécaniques sont automatisées :
- rangs offerts et choix de compétences ;
- talents de départ ;
- avantage automatique (Duros en Astrogation, Zabrak en Coercition) ;
- Connaissances en compétences de carrière pour le Céréen.

Les capacités conditionnelles (rage wookie, régénération, vision supérieure…) restent en texte.

### 2.7 Étape 10 de la création

- **AoE** : choisir un vaisseau pour le groupe.
- **EdR** : recevoir des ressources de la Rébellion.
- **F&D** : déterminer les ressources du groupe.

## 3. Reste à faire

1. **Compendiums**. Espèces, carrières, spécialités et talents (268) : faits. Restent pouvoirs de la Force,
   armes, armures, matériel, véhicules et adversaires.
   - Les PDF fournis sont des scans : l'OCR est utilisable pour retrouver les règles, mais les tableaux chiffrés
     doivent être relus sur l'image.
   - Les textes des livres sont protégés : les compendiums complets doivent rester privés
     (ou ne contenir que noms, valeurs et références de pages).
2. **Blessures critiques**. Tirage automatique sur la table 6-10 (+10 par critique déjà subi, +10 par rang
   de Coup mortel, attribut Sanguinaire).
3. **Application des dégâts**. Encaissement, Perforant, Brèche, dégâts de stress et seuils dépassés.
4. **Combat de véhicules**. Arcs de défense, manœuvres de pilote, stress mécanique.
5. **Assistant de création**. Il appliquera les règles de l'étape 2 combinée (plafond +2 500 crédits / +10 XP).
6. **Pouvoirs de la Force**. Affichage en grille et achat d'améliorations en XP.
7. **Intégration de Dice So Nice**.
