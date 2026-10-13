/**
 * Espèces des trois livres de base (étape 3 de la création de personnage).
 * Caractéristiques dans l'ordre : Vigueur, Agilité, Intelligence, Ruse, Volonté, Présence.
 * `sources` : livre et pages ; la première source fournit le texte principal.
 * Les espèces communes à plusieurs livres ont des règles identiques ; seul le paragraphe propre
 * à chaque gamme (Bordure / Alliance / Force) change et il est repris pour chacun.
 */

const p = text => `<p>${text}</p>`;
const section = (title, text) => `<p><strong>${title} :</strong> ${text}</p>`;
const rules = items => `<h3>Capacités spéciales</h3><ul>${items.map(i => `<li>${i}</li>`).join("")}</ul>`;
const bookPart = (book, title, text) => `<h3>${book}</h3>${section(title, text)}`;

export const SPECIES = [
  /* ============================ AUX CONFINS DE L'EMPIRE ============================ */
  {
    key: "bothan",
    name: "Bothan",
    sources: [{ book: "aoe", page: "43-44" }, { book: "edr", page: "51-52" }],
    characteristics: [1, 2, 2, 3, 2, 2],
    wound: 10, strain: 11, xp: 100,
    startingSkills: ["streetwise"],
    startingTalents: ["Persuasion"],
    abilities: "1 rang en Système D (rang 2 max à la création) ; 1 rang dans le talent Persuasion.",
    description: [
      p("Les Bothans sont les informateurs de la galaxie. Ils ont le chic pour dénicher des secrets et voir des choses qui échappent aux autres espèces. Ils peuvent se révéler précieux dans toute entreprise, mais aussi constituer des partenaires indignes de confiance."),
      section("Physiologie", "les Bothans ont des sens affûtés qui les aident à recueillir et à transmettre des informations. Leur long museau leur permet de percevoir de nombreuses odeurs, et leurs yeux de voir plus loin. Leurs oreilles sont deux fois plus grandes que celles des autres espèces, et capables de se tourner en direction des sons. S'ils ne mesurent que 1,60 mètre en moyenne, leur petite taille leur permet de passer inaperçus plus facilement et de se glisser dans des passages qu'un humain ne saurait franchir. Leur plus gros atout est leur fourrure. Ils peuvent communiquer avec leurs congénères en la faisant ondoyer, ce qui leur permet de faire part d'un changement d'humeur ou de transmettre des émotions codées bien spécifiques."),
      section("Société", "chaque couche de la société bothan est basée sur l'acquisition, la manipulation et l'utilisation de connaissances. Parfois assimilés aux Hutts et aux Twi'leks, ils prennent ce genre de comparaison pour de graves insultes. C'est le prestige, et non la richesse, qui les motive. En fin de compte, un Bothan n'a rien d'autre que sa réputation. Le Conseil bothan règne sur les mondes de cette espèce. Les principaux clans ont tous un représentant au Conseil, qui élit le grand conseiller. Les Bothans n'aiment pas la confrontation directe. Leur arme, c'est le renseignement, et ils jouent avec les secrets comme les Corelliens jouent au sabacc : la vérité est un atout qu'ils gardent dans leur manche."),
      p("Les Bothans disposent du plus vaste et du plus complexe réseau de renseignement de toute la galaxie. Ce réseau d'espions s'appuie sur des taupes, agents de renseignements, agents dormants et infiltrés qui transfèrent les informations à un réseau clandestin remontant jusqu'aux maîtres-espions bothans. Bien que le réseau d'espions de Bothawui soit géré par des Bothans, la majorité des agents présents sur le terrain sont issus d'autres espèces."),
      section("Monde d'origine", "les Bothans viennent de Bothawui, une planète tempérée de la Bordure médiane. Ils ont aussi fondé des colonies importantes sur Kothlis et Torolis."),
      section("Langue", "le bothois est la langue natale des Bothans, et le botha sa forme écrite. Presque tous les Bothans parlent couramment le basic. Le wrendui, mot qui désigne le langage corporel permettant aux Bothans de communiquer leurs émotions en se servant de leur fourrure, propose de nombreuses formes secrètes dont on peut tirer des informations concrètes quand on connaît le code. Les espions bothans entraînés sont capables de passer d'une forme de wrendui à une autre d'un simple ondoiement de fourrure."),
      bookPart("Aux Confins de l'Empire", "La vie dans la Bordure", "les Bothans ont généralement des métiers où le renseignement est roi. Ils font de bons Négociants, Éclaireurs, Voleurs et Diplomates. Ils essaieront de gravir les échelons de la hiérarchie de leur carrière et alimenteront le réseau d'espionnage bothan pour aider leur clan resté sur Bothawui."),
      bookPart("L'Ère de la Rébellion", "Au sein de l'Alliance", "les Bothans sont naturellement attirés par les rôles qui mettent à profit leurs dons en matière de savoir, de manipulation et d'information, et ils sont encouragés à les endosser. Diplomate et Espion apparaissent comme des carrières idéales pour beaucoup d'entre eux, les Devoirs Renseignements, Contre-espionnage et Soutien politique se mariant particulièrement à leur nature. La plupart des dirigeants de l'Alliance savent que les Bothans sont susceptibles de partager tout ce qu'ils collectent avec leur réseau d'espionnage, mais c'est le prix à payer pour avoir accès à des ressources aussi précieuses."),
      rules([
        "Seuil de blessure : 10 + Vigueur",
        "Seuil de stress : 11 + Volonté",
        "Expérience de départ : 100 XP",
        "Capacité spéciale : les Bothans commencent le jeu avec 1 rang en Système D. Ils ne peuvent cependant pas dépasser le rang 2 dans cette compétence à la création de personnage. Ils commencent également avec 1 rang dans le talent Persuasion."
      ])
    ].join("")
  },
  {
    key: "droid",
    name: "Droïde",
    img: "icons/commodities/tech/cog-steel-grey.webp",
    sources: [{ book: "aoe", page: "44-46" }, { book: "edr", page: "53-54" }],
    characteristics: [1, 1, 1, 1, 1, 1],
    wound: 10, strain: 10, xp: 175,
    startingTalents: ["Endurance"],
    noForce: true,
    abilities: "Pas de toxines ni de poisons ; limite d'implants 6 ; 1 rang dans 6 des 8 compétences de carrière et 3 des 4 de la première spécialité ; inorganique (soins par Mécanique, talent Endurance) ; ne peut pas être sensible à la Force.",
    description: [
      p("Le bourlingueur moyen a beau se moquer de son droïde, sans lui, il serait fichu. Les droïdes jouent toutes sortes de rôles dans la zone : surveillance et sécurité, médecine et chirurgie, réparations, construction, astrogation et pilotage, sans oublier les tâches manuelles. Bien que beaucoup soient doués d'une intelligence rudimentaire, certains développent une sorte de conscience."),
      `<h3>Jouer un droïde</h3>`,
      p("La création de personnages droïdes est simple. Traitez-les comme une espèce à part, avec des bonus et capacités soulignant leur nature robotique. Les joueurs doivent se montrer créatifs dans leur description, mais aussi dans le fonctionnement de leur équipement. Par exemple, au lieu de porter une armure laminée, le droïde pourrait être couvert de plaques de métal renforcées fixées à son châssis, mais aussi avoir un pistolet blaster intégré au bras."),
      p("La personnalité du droïde est une affaire un peu plus délicate. Le fait qu'il soit un PJ signifie qu'il est doué de conscience (à moins que le joueur ne veuille jouer un personnage complètement dépendant des êtres biologiques qui l'entourent). Les joueurs qui souhaitent créer un personnage droïde doivent se souvenir de ses origines et tenter d'intégrer des éléments de leur fonction originelle à leur personnalité, même si le personnage droïde a joué des rôles sans rapport avec sa programmation d'origine. Par exemple, un droïde de contrôle du trafic peut entreprendre une carrière de Mécano, mais grommeler chaque fois que son collègue pilote enfreint les règles locales de trafic ou de vol."),
      section("Description physique", "les droïdes sont assemblés de nombreuses façons, qu'il s'agisse de châssis montés sur des membres bipèdes ou quadrupèdes, ou de simples boîtes ou cylindres."),
      section("Société", "les contrebandiers entendent parler depuis longtemps de « mondes de droïdes », où des automates et des cyborgs règnent sur leurs propres sociétés. Hormis ces rumeurs, il est impossible de dire que des droïdes ont vraiment une société ; en gros, ils travaillent dans celle de leurs maîtres, qu'ils soient humains ou non. À moins d'avoir vu leurs facultés cognitives reprogrammées, les droïdes sont conçus pour obéir, et c'est bien ce qu'ils font."),
      p("Toutefois, les droïdes joués par les PJ constituent un cas à part. Au fil des millénaires, il y a eu d'innombrables exemples de droïdes qui ont transcendé leur programmation d'origine et développé une conscience pour devenir indépendants. Certains de ces automates ont « vécu » plusieurs siècles, se réparant et s'améliorant pour rester au maximum de leur efficacité."),
      p("Certains de ces droïdes sont fiers et heureux de poursuivre le travail pour lequel ils ont été conçus du mieux possible, comme une certaine unité R2 qui s'efforce de devenir un meilleur pilote et astrogateur. D'autres renoncent à leur programmation et se tournent vers de nouveaux horizons. Par exemple, le célèbre 4-LOM a été un droïde de protocole avant de devenir un voleur de bijoux, puis l'un des plus célèbres chasseurs de primes de la galaxie."),
      bookPart("Aux Confins de l'Empire", "La vie dans la Bordure", "des droïdes de toutes classes travaillent aux côtés de contrebandiers et de criminels de la Bordure extérieure, où évoluent ceux qui sont prêts à oublier leur nature mécanique et à respecter un camarade bourlingueur doté de précieuses compétences. Certains affichent leur conception originelle sans jamais la retoucher, tandis que d'autres sont ingénieusement dissimulés dans d'autres corps, comme les séries protocolaires de Cybot Galactica. Il existe même une poignée de droïdes, comme le seigneur pirate ZI-Z0, qui se sont pris en main en réalisant qu'il était préférable de mener que de servir."),
      bookPart("L'Ère de la Rébellion", "Au sein de l'Alliance", "la plupart des droïdes sont plus adaptés aux fonctions non combattantes. Ils servent dans le domaine du soutien pour permettre aux forces de l'Alliance de lutter plus efficacement. Beaucoup de droïdes techniciens œuvrent à bord de vaisseaux capitaux, souvent chargés de tâches normalement assurées par des dizaines d'individus, si bien que le manque de personnel n'est pas si dommageable pour la marine de l'Alliance. Et alors que le nombre de chasseurs X-Wing augmente, les droïdes astromech se font omniprésents. Chaque droïde peut servir comme il le souhaite, mais la plupart optent pour des carrières et spécialités en accord avec leur conception de départ. De même, le Devoir choisi est censé correspondre à sa fonction."),
      rules([
        "Seuil de blessure : 10 + Vigueur",
        "Seuil de stress : 10 + Volonté",
        "Expérience de départ : 175 XP",
        "Capacité spéciale : les droïdes ne mangent pas, ne dorment pas, ne respirent pas et ne sont pas affectés par les toxines et les poisons. La limite d'implant des droïdes est égale à 6, et non à leur Vigueur. Par ailleurs, une fois sa carrière choisie, un droïde gagne 1 rang dans six de ses huit compétences de carrière (au lieu des quatre habituelles). Une fois sa première spécialité choisie, il gagne 1 rang dans trois de ses quatre compétences de spécialité (au lieu des deux habituelles).",
        "Inorganique : les droïdes étant inorganiques, ils ne tirent aucun avantage des cuves à bacta, stimpacks et tests de Médecine. Ils récupèrent naturellement en se reposant, grâce à leurs systèmes qui tentent de se réparer. Autrement, on peut s'occuper d'eux avec des tests de Mécanique, en utilisant les mêmes difficultés et résultats que les tests de Médecine pour les êtres organiques. Les trousses de réparation d'urgence peuvent être utilisées sur eux comme les stimpacks sur les êtres organiques. Grâce à leur châssis métallique résistant, ils commencent le jeu avec le talent Endurance.",
        "Être mécanique : les droïdes ne peuvent pas être sensibles à la Force, ni avoir une valeur de Force. Ils ne peuvent pas employer de pouvoirs de la Force, et ne peuvent pas être affectés par les pouvoirs de la Force qui influencent l'esprit."
      ])
    ].join("")
  },
  {
    key: "gand",
    name: "Gand",
    sources: [{ book: "aoe", page: "47" }],
    characteristics: [2, 2, 2, 2, 3, 1],
    wound: 10, strain: 10, xp: 100,
    startingSkills: ["discipline"],
    abilities: "1 rang en Sang-froid (rang 2 max à la création) ; respirateurs d'ammoniac (sans poumons : immunisé à la suffocation ; avec poumons : respirateur, oxygène = atmosphère dangereuse de niveau 8, +10 XP).",
    description: [
      p("Les Gands sont une mystérieuse espèce insectoïde dont les « trouveurs » élèvent la traque de leur gibier au rang de devoir religieux. Ils ont le chic pour dénicher leurs proies au moyen de rituels que les hors-monde trouvent rétrogrades et barbares."),
      section("Physiologie", "quoique répandus dans les zones de la Bordure extérieure, les Gands sont une énigme pour les xénobiologistes. Plus d'une douzaine de races ont été répertoriées. Tous sont couverts d'un exosquelette de chitine dense et atteignent la taille de 1,60 mètre environ à l'âge adulte. Ils ont trois doigts à chacune de leurs mains, qui sont aussi habiles que celles des autres humanoïdes et leur permettent de manipuler de l'équipement conçu pour des individus à cinq doigts."),
      p("Là où les multiples races diffèrent les unes des autres, c'est dans leur biologie respiratoire. La plupart des Gands qui parcourent l'espace ne semblent pas avoir besoin de respirer. La digestion de la nourriture dans leur estomac produit l'ammoniac nécessaire à leur biochimie. Les sous-produits et l'ammoniac inutiles sont rejetés au travers de l'exosquelette. Ces Gands dégagent souvent une odeur de méthane musqué désagréable. Les autres races ont des poumons et ne produisent pas d'ammoniac digestif. Elles ont alors besoin d'un appareil respiratoire spécial."),
      p("De nombreuses questions restent sans réponse au sujet de la biologie des Gands, d'autant qu'ils refusent de laisser d'autres espèces les examiner. Certains xénobiologistes se figurent que leurs rituels religieux s'accompagnent de manipulation génétique, à l'origine de la grande variété de cette espèce."),
      section("Société", "la culture des Gands est fermée. On sait cependant que leur vie est fortement imprégnée de religion. Un conseil d'anciens, le Ruetsavii, observe les diverses sectes religieuses qui représentent les vertus de la vie des Gands. Les hors-monde connaissent surtout la secte religieuse des « trouveurs ». Ce sont les Gands qui quittent leur planète natale et entament des traques rituelles pour capturer leurs proies et offrir la bénédiction divine à leur peuple. Il existerait beaucoup d'autres sectes, notamment dans les domaines de la génétique, de la médecine et de l'ingénierie, mais leur nature exacte est inconnue."),
      p("La grammaire que les Gands utilisent reflète leur place dans la société. Avant de gagner son identité et d'être accepté parmi ses pairs, le Gand parle de lui-même à la troisième personne, en s'appelant « Gand ». Dès lors qu'il accomplit un exploit, il peut prendre son nom de famille. Les Gands ne peuvent pas utiliser leur prénom avant de devenir des « personnes de grandeur » — janwuine dans leur langue — et d'avoir reçu les éloges de leurs pairs. Cela explique que beaucoup de hors-monde les voient comme un peuple d'une extrême humilité."),
      section("Monde natal", "nommé d'après l'espèce qui y vit, Gand est un monde de la Bordure extérieure enveloppé d'un nuage d'ammoniac et de méthane. Le commerce est géré par l'intermédiaire de stations orbitales, car les étrangers ont rarement le droit de poser les pieds sur la surface de la planète. Ceux qui en reçoivent l'autorisation doivent séjourner dans le quartier réservé aux extraterrestres, tout spécialement équipé."),
      section("Langue", "les droïdes arrivent bien mieux que les linguistes humanoïdes à reproduire les cliquètements et pépiements du langage gand. N'ayant pas besoin de respirer, beaucoup de Gands n'ont pas les cordes vocales nécessaires pour parler le basic et autres langues. Ils doivent se servir de droïdes et d'outils de traduction pour s'entretenir avec les individus qui ne comprennent pas leur langue."),
      bookPart("Aux Confins de l'Empire", "La vie dans la Bordure", "comme les trouveurs gands ont un taux de réussite élevés, les employeurs sont prêts à fermer les yeux sur leurs mystères culturels et leur curieuse odeur. On requiert régulièrement leurs services de chasseurs de primes, de détectives privés, d'assassins, de dépisteurs et de conseillers en sécurité."),
      rules([
        "Seuil de blessure : 10 + Vigueur",
        "Seuil de stress : 10 + Volonté",
        "Expérience de départ : 100 XP",
        "Capacité spéciale : les Gands commencent le jeu avec 1 rang en Sang-froid. Ils ne peuvent cependant pas dépasser le rang 2 dans cette compétence à la création de personnage.",
        "Respirateurs d'ammoniac : la grande différence entre les deux principales races de Gands, c'est que les uns ont des poumons, les autres non. Ceux qui en sont dotés respirent un mélange de gaz ammoniacés. Ceux qui n'en ont pas ne respirent pas et trouvent toutes les substances métaboliques nécessaires dans leur nourriture. Quand il joue un Gand, un joueur doit décider si son personnage a des poumons ou non. S'il choisit de jouer un personnage dépourvu de tels organes, il est immunisé contre la suffocation (mais pas contre les blessures que l'on subit dans le vide). S'il préfère jouer un personnage avec des poumons, il commence le jeu avec un respirateur d'ammoniac et traite l'oxygène comme une atmosphère dangereuse de niveau 8. En revanche, il gagne +10 XP de départ."
      ])
    ].join("")
  },
  {
    key: "human",
    name: "Humain",
    sources: [{ book: "aoe", page: "48" }, { book: "edr", page: "57" }, { book: "fad", page: "55-57" }],
    characteristics: [2, 2, 2, 2, 2, 2],
    wound: 10, strain: 10, xp: 110,
    skillChoice: { count: 2, options: [], nonCareer: true },
    abilities: "1 rang dans deux compétences hors carrière au choix (rang 2 max à la création).",
    description: [
      p("Les humains sont les plus nombreux et les plus sociables des espèces douées de sapience de la galaxie. Ils semblent présents sur presque toutes les planètes ouvertes qui abritent la vie et parcourent l'espace pour en trouver davantage."),
      section("Physiologie", "les humains sont des mammifères bipèdes quasiment dépourvus de pilosité. Leur peau couvre une large gamme de couleurs, du teint de pêche au brun et au noir. Les hommes mesurent 1,80 mètre en moyenne, mais les femmes sont plus petites et généralement moins trapues. Ils respirent de l'oxygène et peuvent digérer toutes sortes de matières animales et végétales. Leur biologie convient à de nombreux environnements de la galaxie, ce qui explique peut-être leur domination et leur omniprésence."),
      section("Société", "l'ambition des humains et la compétition qu'ils se livrent ont scindé leur espèce en de nombreuses sociétés. Les humains vivent sous tous les systèmes politiques possibles, du féodalisme à la théocratie en passant par la démocratie et l'autocratie, leur technologie étant elle aussi arrivée à divers stades suivant les régions de la galaxie."),
      section("Monde natal", "les humains seraient apparus quelque part dans les Mondes du Noyau, peut-être sur Coruscant. Néanmoins, ils ont pris la direction des étoiles depuis si longtemps (peut-être même avant la maîtrise du voyage en vitesse-lumière) qu'aujourd'hui, d'innombrables planètes leur appartiennent."),
      section("Langue", "la principale langue qui lie les humains est le basic, mais chaque société a son propre dialecte, et parfois même un sous-langage."),
      bookPart("Aux Confins de l'Empire", "La vie dans la Bordure", "les humains jouent presque tous les rôles et occupent tous les emplois possibles dans la zone."),
      bookPart("L'Ère de la Rébellion", "Au sein de l'Alliance", "la diversité intrinsèque des humains se retrouve dans leurs fonctions, carrières, spécialités et Devoirs au sein de l'Alliance. La seule constante en ce qui les concerne, c'est leur disparité : ils peuvent suivre à peu près n'importe quelle voie, être mus par n'importe quelle ambition. Dans la Rébellion, ils sont simplement unis par leur désir de contrarier l'Empire aux côtés de toutes les autres espèces prêtes à résister."),
      bookPart("Force et Destinée", "Perception de la Force", "l'humanité fait preuve d'une large gamme d'attitudes envers la Force. Certains rejettent complètement son existence, d'autres insistent pour voir son influence absolument partout. Des attitudes extrêmes coexistent souvent à l'intérieur des contraintes d'une seule culture planétaire. Pour l'heure, l'attitude brutale de l'Empire galactique envers la Force colore la perception de la plupart des humains."),
      rules([
        "Seuil de blessure : 10 + Vigueur",
        "Seuil de stress : 10 + Volonté",
        "Expérience de départ : 110 XP",
        "Capacité spéciale : les humains commencent le jeu avec 1 rang dans deux compétences hors carrière de leur choix. Ils ne peuvent cependant pas dépasser le rang 2 dans ces compétences à la création de personnage."
      ])
    ].join("")
  },
  {
    key: "rodian",
    name: "Rodien",
    sources: [{ book: "aoe", page: "48-49" }],
    characteristics: [2, 3, 2, 2, 1, 2],
    wound: 10, strain: 10, xp: 100,
    startingSkills: ["survival"],
    startingTalents: ["Pisteur chevronné"],
    abilities: "1 rang en Survie (rang 2 max à la création) ; 1 rang dans le talent Pisteur chevronné.",
    description: [
      p("Les Rodiens sont des chasseurs-nés, issus d'un monde hostile qui engendre des instincts de tueur. Tous ceux dont la tête est mise à prix ont du souci à se faire quand ils aperçoivent le long museau vert d'un Rodien ou sentent son odeur putride si caractéristique."),
      section("Physiologie", "les Rodiens descendent de lézards grimpeurs et ont conservé certains traits de leurs ancêtres, notamment leurs grands yeux et les ventouses présentes à leurs doigts et orteils. Aujourd'hui, ces organes ne permettent cependant pas à un adulte de 1,60 mètre de rester accroché très longtemps à un rocher ou à un arbre, mais ils ont évité à de nombreux Rodiens des chutes qui auraient été fatales à des représentants d'autres espèces."),
      section("Société", "l'histoire de Rodia est émaillée de nombreuses violences. Il y a bien longtemps, cette planète tropicale grouillait de prédateurs dangereux, si bien que les ancêtres sans défense des Rodiens n'eurent d'autre choix que de s'adapter. Ce qu'ils firent, en se cachant dans les branches des arbres ou en grimpant jusqu'aux hautes cavernes des montagnes, où ils fabriquèrent des outils et élaborèrent des plans pour se débarrasser des prédateurs. Rapidement, ils devinrent de bons chasseurs et la chasse se retrouva au cœur de leur société."),
      p("Les Rodiens devinrent si habiles dans ce domaine qu'ils provoquèrent progressivement l'extinction des autres prédateurs de la planète. N'ayant plus rien à chasser, ils commencèrent à s'entretuer. Les combats de gladiateurs entre champions se muèrent en escarmouches, qui prirent bientôt la forme de guerres tribales."),
      p("Quand elle fut découverte par des éclaireurs de l'Ancienne République, Rodia fut quasiment mise sous blocus à cause de la culture belliqueuse des habitants. Néanmoins, les autorités rodiennes parvinrent à réprimer les tendances violentes de leur civilisation le temps d'entrer en contact avec le reste de la galaxie. Aujourd'hui, des milliers d'années plus tard, le pic de violence de la culture rodienne est derrière elle, mais la chasse est encore une tradition vénérée."),
      section("Monde d'origine", "Rodia, la planète natale des Rodiens, se situe dans la Bordure médiane. On y trouve des milieux urbains et industriels qui côtoient des forêts pluviales encore vierges, offrant aux jeunes et courageux Rodiens l'environnement nécessaire pour éprouver leurs talents de chasseurs."),
      section("Langue", "en raison de la morphologie de leur bouche, les Rodiens ont bien du mal à parler le basic et certains ne s'y essaient d'ailleurs même pas, se contentant de s'exprimer dans leur langue natale, le rodois."),
      bookPart("Aux Confins de l'Empire", "La vie dans la Bordure", "l'héritage culturel de « la chasse » pousse les Rodiens vers les métiers de chasseur de prime ou de porte-flingue. Les Rodiens relèvent souvent des défis un peu trop gros pour eux, rêvant des trophées qu'ils recevront sur Rodia pour avoir attrapé leur proie."),
      rules([
        "Seuil de blessure : 10 + Vigueur",
        "Seuil de stress : 10 + Volonté",
        "Expérience de départ : 100 XP",
        "Capacité spéciale : les Rodiens commencent le jeu avec 1 rang en Survie. Ils ne peuvent cependant pas dépasser le rang 2 dans cette compétence à la création de personnage. Les Rodiens commencent aussi le jeu avec 1 rang dans le talent Pisteur chevronné."
      ])
    ].join("")
  },
  {
    key: "trandoshan",
    name: "Trandosien",
    sources: [{ book: "aoe", page: "49-51" }],
    characteristics: [3, 1, 2, 2, 2, 2],
    wound: 12, strain: 9, xp: 90,
    startingSkills: ["perception"],
    abilities: "1 rang en Perception (rang 2 max à la création) ; régénération ; griffes (Pugilat : +1 dégât, critique 3).",
    description: [
      p("Humanoïdes reptiliens belliqueux, les Trandosiens ne cachent pas leur haine des Wookies. On les trouve partout où l'on a besoin de gros bras ou de gorilles armés."),
      section("Physiologie", "un peu plus petits en moyenne que leurs ennemis wookies, ces créatures à sang froid ont des mains à trois doigts dépourvues de pouce qui leur compliquent la vie lorsqu'il leur faut manipuler certaines technologies. Leurs énormes griffes compensent néanmoins cette maladresse. Leur grande acuité visuelle leur permet de distinguer le spectre infrarouge. Quand ils sont jeunes, leurs facultés de cicatrisation leur permettent de régénérer des membres si nécessaire. Leurs écailles vont du vert vif à l'orange et peuvent changer à la saison des mues."),
      section("Société", "les Trandosiens, qui s'appellent les « T'doshok » en dose, sont issus d'une société qui accorde une grande valeur à la force, à la chasse, à l'endurance et à l'autonomie. Les couvées de quatre œufs sont élevées par la mère (le père s'implique rarement). Les jeunes Trandosiens marchent et développent des capacités de chasseur instinctives peu après leur naissance. À deux ans, leur mère les fait participer à leur première chasse, et à dix, ils sont parfaitement autonomes."),
      p("La société trandosienne tourne autour de deux choses : la chasse et le culte d'une déesse appelée la Gardienne des Points. Elle veille sur le peuple trandosien, qu'elle bénit ou châtie en fonction des résultats de leurs chasses. Pour chaque chasse réussie et proie abattue, les Trandosiens reçoivent le jagannath, la « marque divine », qui prouve le statut d'un Trandosien dans la société. Bien évidemment, un Trandosien qui accumule du jagannath a les faveurs de la déesse. Quand un Trandosien meurt, il s'incline devant la Gardienne des Points et lui présente son carquois de jagannath. Ce décompte final détermine la place qu'il occupera dans l'au-delà."),
      p("Au fur et à mesure que la société trandosienne a évolué dans le contexte de la communauté galactique, le concept de la chasse s'est très nettement élargi à d'autres aspects de la société. Aujourd'hui, un médecin trandosien peut « chasser » un remède contre une maladie virulente menaçant son peuple. De même, un ingénieur peut « chasser » un meilleur vaisseau ou un armement plus puissant. En fait, presque toutes les actions qui améliorent le peuple trandosien sont des « chasses » dignes de ce nom aux yeux de cette culture. Bien évidemment, cela laisse peu de place aux passe-temps « frivoles » comme les arts."),
      section("Monde d'origine", "la plupart des Trandosiens appellent leur planète natale Hsskor, mais les étrangers la connaissent sous le nom de Trandosha ou 'Dosha. Trandosha a le même soleil que le monde natal des Wookies de Kashyyyk. À noter que les Trandosiens ont aussi colonisé la lune forestière de Wasskah."),
      section("Langue", "le dose, la langue des Trandosiens, évoque aux humains une série de sifflements et de grognements. Les Trandosiens peuvent apprendre et parler le basic, mais la plupart des mots qu'ils prononcent sont alors sifflants."),
      bookPart("Aux Confins de l'Empire", "La vie dans la Bordure", "les Trandosiens rêvent constamment de réussir la chasse et de recevoir la bénédiction de la Gardienne des Points en accumulant du jagannath. Les professions de type militaire, comme les chasseurs de primes et les mercenaires, conviennent parfaitement aux instincts de chasseur des Trandosiens."),
      rules([
        "Seuil de blessure : 12 + Vigueur",
        "Seuil de stress : 9 + Volonté",
        "Expérience de départ : 90 XP",
        "Capacité spéciale : les Trandosiens commencent le jeu avec 1 rang en Perception. Ils ne peuvent cependant pas dépasser le rang 2 dans cette compétence à la création de personnage.",
        "Régénération : quand un Trandosien se débarrasse d'au moins 1 blessure en se reposant ou en s'immergeant dans une cuve à bacta, il en élimine une de plus. Cela ne fonctionne cependant pas quand il reçoit les premiers secours, bénéficie de soins médicaux ou d'un stimpack. Les Trandosiens peuvent également régénérer leurs membres, mais il faut attendre au moins un mois avant qu'ils soient à nouveau utilisables.",
        "Griffes : quand un Trandosien effectue des tests de Pugilat pour infliger des dégâts à un adversaire, il inflige +1 dégât et a une valeur de critique de 3."
      ])
    ].join("")
  },
  {
    key: "twilek",
    name: "Twi'lek",
    sources: [{ book: "aoe", page: "51" }, { book: "fad", page: "61-62" }],
    characteristics: [1, 2, 2, 2, 2, 3],
    wound: 10, strain: 11, xp: 100,
    skillChoice: { count: 1, options: ["charm", "deception"], nonCareer: false },
    abilities: "1 rang en Charme ou en Tromperie (rang 2 max à la création) ; retire ■ dû à la chaleur ou à l'aridité.",
    description: [
      p("Les Twi'leks comptent parmi les espèces non-humaines les plus répandues de la galaxie. Ce sont de redoutables négociateurs, qui ont le chic pour comprendre les autres espèces et sont assez malins pour obtenir tout ce qu'ils veulent."),
      section("Physiologie", "les Twi'leks ont deux longs tentacules, les tchun-tchin ou « lekku », qui leur sortent de l'arrière du crâne. Ces « queues de tête » servent de seconde langue et leur permettent de communiquer par signes et par gestes. La diversité de teint des Twi'leks témoigne du clan et de la région d'origine de chaque individu."),
      section("Société", "la famille occupe une place cruciale dans la société twi'lek. Le gouvernement de Ryloth est une alliance de « grands clans », dont chacun contrôle une bourgade ou un quartier d'une ville. Les cinq Twi'leks les plus importants d'une famille sont à la tête de leur clan respecté, et leur influence se ressent sur toute leur lignée. Selon la tradition, quand un chef de clan majeur meurt, les quatre restants doivent s'exiler dans les Contrées éclatantes brûlées par le soleil et parcourues de lyleks affamés. Mais dans la pratique, les chefs de clan s'arrangent pour contourner cette coutume."),
      p("Le système de clans s'accompagne de castes. Les Twi'leks situés tout en bas d'une lignée, de petite extraction, ne sont rien de plus que des esclaves. Les chefs twi'leks s'indignent quand on les accuse d'esclavage et nient vouloir asservir leur peuple, rejetant la faute sur les autres clans. Néanmoins, presque tous les clans se livrent à ce qu'on pourrait qualifier « d'enrôlement sous contrat »."),
      section("Monde d'origine", "bien que Ryloth, leur planète natale, se situe dans la Bordure extérieure, on trouve des Twi'leks sur de nombreux mondes de la galaxie, en raison de leur nature entreprenante et des effets de l'esclavage."),
      section("Langue", "le ryl est la langue natale de Ryloth, mais rares sont les Twi'leks qui ne parlent pas couramment le basic. Ce qui les sépare des autres espèces, c'est leur seconde langue, gestuelle, appelée lekku, ou « twi'leki ». Au quotidien, les Twi'leks soulignent leurs propos en agitant leurs tentacules crâniens. Si l'intimité est de rigueur, ils peuvent même s'entretenir en silence, en se contentant de remuer leurs lekku pour communiquer des informations complexes."),
      bookPart("Aux Confins de l'Empire", "La vie dans la Bordure", "vu leurs talents linguistiques, leur ingéniosité et leurs aptitudes sociales, les Twi'leks apprécient les positions d'encadrement, politiques et d'autorité. Ceux qui ne sont pas heureux de leur statut quittent souvent Ryloth pour voler de leurs propres ailes, animés par un esprit d'entreprise pour lancer leur propre affaire… ou fuir leur syndicat du crime."),
      bookPart("Force et Destinée", "Perception de la Force", "les Twi'leks n'ont pas foi en la Force au sens religieux, ni de traditions indigènes qui y soient liées. Toutefois, on estime que les conversations entre les Twi'leks qui se servent de leurs lekkus ont des connotations religieuses. Certains érudits versés dans le savoir des Jedi supposent que les lekkus présentent une sensibilité innée à la Force. Cela suggère que les Twi'leks ont un lien limité avec cette énergie mystique, même s'ils ne le reconnaissent pas en tant que tel."),
      rules([
        "Seuil de blessure : 10 + Vigueur",
        "Seuil de stress : 11 + Volonté",
        "Expérience de départ : 100 XP",
        "Capacité spéciale : les Twi'leks commencent le jeu avec 1 rang en Charme ou en Tromperie. Ils ne peuvent cependant pas dépasser le rang 2 dans la compétence choisie à la création de personnage.",
        "Habitants du désert (nommée ainsi dans Force et Destinée) : quand ils effectuent des tests de compétence, les Twi'leks peuvent retirer ■ dû à des conditions environnementales chaudes ou arides."
      ])
    ].join("")
  },
  {
    key: "wookiee",
    name: "Wookie",
    sources: [{ book: "aoe", page: "51-52" }],
    characteristics: [3, 2, 2, 2, 1, 2],
    wound: 14, strain: 8, xp: 90,
    startingSkills: ["brawl"],
    abilities: "1 rang en Pugilat (rang 2 max à la création) ; rage wookie (blessé : +1 dégât au Corps à corps et au Pugilat ; +2 après une blessure critique).",
    description: [
      p("Forts, intelligents et féroces, les Wookies sont néanmoins les meilleurs amis de leurs alliés loyaux, et les pires ennemis des autres. Malheureusement, les Wookies se font rares parmi la population de la galaxie et ne seront bientôt plus qu'un lointain souvenir de l'Ancienne République."),
      section("Physiologie", "mesurant deux mètres en moyenne, les Wookies inspirent la peur à leurs adversaires en raison de leur simple taille. Et il y a de bonnes raisons de les craindre. Rares sont les espèces de la galaxie aussi puissantes ou féroces. Ils sont dotés de longs membres, et pourvus de griffes rétractiles aux doigts et aux orteils, adaptées à l'environnement forestier de leur monde natal. Ces griffes ne sont utilisées que pour grimper, jamais pour se battre, car un tel acte est considéré comme un déshonneur dans leur culture. Leur fourrure peut avoir toutes sortes de couleurs, mais s'assombrit avec l'âge, avant de blanchir ou de grisonner sur leur fin de vie (les Wookies ont une espérance de vie de plusieurs siècles)."),
      section("Société", "bien que leur physique joue pour beaucoup dans leur apparence intimidante, les Wookies se conforment à un code de l'honneur et de la loyauté très strict. L'amitié et les liens familiaux soudent ces créatures, d'autant que certains dangers de Kashyyyk effraient même les plus féroces d'entre eux. Des arbres wroshyr hauts d'un kilomètre couvrent près de la moitié de Kashyyyk et abritent la plupart des communautés de Wookies. Au septième niveau de ces forêts, les Wookies ont bâti d'immenses cités dans les arbres, mêlant harmonieusement la technologie à leur environnement. Les Wookies ont un don pour la mécanique et l'ingénierie."),
      p("Après avoir dominé l'ensemble des niveaux supérieurs de Kashyyyk, les Wookies étaient sur le point d'explorer les étoiles quand les membres d'une espèce voisine, les Trandosiens, arrivèrent sur Kashyyyk pour coloniser et explorer le monde. Bien que les Trandosiens aient des armes plus avancées, les Wookies chassèrent les soi-disant colons de la planète. Ils étudièrent aussitôt la technologie que les envahisseurs avaient laissée derrière eux, dont un vaisseau doté de moteurs subluminiques. Quand les Trandosiens revinrent, les Wookies les chassèrent une seconde fois, puis prirent la direction des étoiles."),
      p("La guerre entre les deux espèces se poursuivit par intermittence lors des dernières années de l'Ancienne République, dont les médiateurs se rangèrent le plus souvent du côté des honorables Wookies. Les Trandosiens ne laissèrent cependant pas passer leur chance quand Palpatine instaura l'Empire. Ils lui envoyèrent donc des émissaires pour lui faire part de leurs doléances à l'encontre des Wookies. Les Impériaux entendirent les arguments des Trandosiens et enfermèrent les Wookies querelleurs dans des camps de travail. Les enfants furent mis en joue pour forcer leurs parents à utiliser leur expertise technique pour construire du matériel de guerre impérial, dont certaines parties de l'Étoile noire."),
      section("Monde d'origine", "les Wookies viennent du monde forestier de Kashyyyk, une planète dominée par d'immenses forêts anciennes, où poussent notamment les wroshyr. Hauts de plusieurs kilomètres, ces arbres abritent l'ensemble de l'écologie de Kashyyyk, et les niveaux les plus élevés sont aussi les plus sûrs. Plus on descend dans la forêt, plus la faune et la flore sont dangereuses. Tout en bas, même les Wookies ne survivent pas bien longtemps."),
      section("Langue", "le shyriiwook, la langue des Wookies, étonne aujourd'hui encore les érudits en raison des incroyables nuances de grognements et de grondements qui la constituent. Rares sont les non-Wookies qui la parlent ou maîtrisent ses dialectes, comme le xaczik, parlé par les Wookies des îles Wartaki. Notons que leur physiologie empêche les Wookies de parler les langues d'autres espèces, dont le basic, même si la plupart n'ont aucun mal à les comprendre."),
      bookPart("Aux Confins de l'Empire", "La vie dans la Bordure", "sous l'ère impériale, un Wookie libre est généralement un Wookie recherché. Néanmoins, rares sont ceux qui le font remarquer, car il vaut mieux caresser un Wookie dans le sens du poil que de le courroucer. Les Wookies qui ne triment pas dans les camps de travail de l'Empire entreprennent toutes sortes de carrières qui mêlent danger, technologie et exploration. La plupart méprisent le métier de chasseur de primes, mais certains voyous, comme Snoova, choisissent tout de même cette voie."),
      rules([
        "Seuil de blessure : 14 + Vigueur",
        "Seuil de stress : 8 + Volonté",
        "Expérience de départ : 90 XP",
        "Capacité spéciale : les Wookies commencent le jeu avec 1 rang en Pugilat. Ils ne peuvent cependant pas dépasser le rang 2 dans cette compétence à la création de personnage.",
        "Rage wookie : quand un Wookie est blessé, ses attaques de Corps à corps et de Pugilat infligent +1 point de dégâts. Quand un Wookie a subi au moins 1 blessure critique, elles infligent +2 points de dégâts."
      ])
    ].join("")
  },

  /* ============================ L'ÈRE DE LA RÉBELLION ============================ */
  {
    key: "duros",
    name: "Duros",
    sources: [{ book: "edr", page: "55" }],
    characteristics: [1, 2, 3, 2, 2, 2],
    wound: 11, strain: 10, xp: 100,
    startingSkills: ["pilotingSpace"],
    modifiers: [{ type: "skillAdvantage", key: "astrogation", value: 1 }],
    abilities: "1 rang en Pilotage (espace) (rang 2 max à la création) ; navigation intuitive (avantage automatique en Astrogation).",
    description: [
      p("Les Duros, espèce que l'on présente le plus souvent comme celle qui offrit le voyage hyperspatial au reste de la galaxie, sont respectés en tant que pilotes et explorateurs, certes, mais aussi comme conteurs. Ils sont également très prisés comme ingénieurs et mécaniciens navals, métiers dont l'Alliance ne saurait se passer."),
      section("Physiologie", "d'origine reptilienne, les Duros sont des humanoïdes bipèdes dotés de grands yeux rouges, d'une peau lisse bleu vert, de longs doigts, d'un gros crâne sans pilosité et de petites fentes apparaissant sous les yeux qui font office d'organes olfactifs (ils n'ont pas de nez). Leurs petits éclosent d'œufs pondus par les femelles. Et bien que pour un temps sous forme larvaire, ils sont élevés au sein d'une véritable unité familiale. Les Duros ne sont pas particulièrement puissants sur le plan physique, mais ils ont l'esprit acéré. Les mâles comme les femelles sont dépourvus de pilosité, mais les deux sexes se distinguent facilement pour le reste."),
      section("Société", "la plupart des érudits estiment que ce sont les Duros qui inventèrent le premier vaisseau à hyperdrive et que leur contribution à la navigation interstellaire est incommensurable. Ce peuple animé par la curiosité et l'aventure tire une grande fierté de ses périples d'un bout à l'autre de la galaxie. La politesse veut qu'on s'adresse à un Duros sous le terme honorifique de « voyageur », qui flatte leur passion pour l'astrogation et l'exploration."),
      p("Ayant longtemps été réduits en esclavage par des êtres qui maîtrisaient une haute technologie et capables de destruction massive au service de l'expansion de leur empire, les Duros conçurent une véritable fascination pour cette science qui les assujettissait, et qu'ils étudièrent sans relâche. L'heure venue, ils puisèrent dans toutes ces connaissances non seulement pour s'affranchir des entraves de leurs oppresseurs, mais également pour filer vers les étoiles à tout jamais. Peu de temps après, la société Duros fut régie par une monarchie très respectée, mais cette dynastie grandiose finit par sombrer dans la corruption. Le pragmatisme atavique des Duros engendra alors une gestion corporatiste favorisant le développement des ressources."),
      p("Les Duros sont généralement réservés. Ils se contentent d'observer. On peut en revanche facilement les pousser à s'exprimer sur leurs familles et leur peuple. Dotés d'une mémoire exceptionnelle en la matière, ils entretiennent une tradition de culture orale dont ils peuvent être fiers. À la lumière des affres de la surindustrialisation et des nombreuses attaques dévastatrices subies par leur planète, on comprend pourquoi ils s'accrochent à ce point à leur âge d'or."),
      p("Les Duros ont mal supporté l'avènement de l'Empire. Leur patrie, depuis longtemps dévastée, est devenue un territoire occupé, géré par la bureaucratie impériale. Au début, ces mesures furent prétendument imposées pour porter secours à la population et entretenir l'apport de minerai et de vaisseaux de qualité vers les Mondes du Noyau. Mais les dirigeants Duros ont vite montré leurs penchants pour l'Alliance, ce qui a poussé l'Empire à militariser sa présence et à réduire les autochtones en esclavage. De nombreux Duros ont préféré se disperser parmi les astres plutôt que de rester sous le joug de la machine de guerre de l'Empereur. L'Alliance apprécie énormément leurs dons et leur savoir."),
      section("Monde d'origine", "Duro était autrefois un monde vert et luxuriant. En raison de désastres écologiques, ce n'est plus qu'une planète inhabitable pour qui se trouve dépourvu de véritables protections contre les dangers biologiques. Impatients d'explorer la galaxie, les Duros avaient poussé les opérations minières et industrielles bien trop loin. La pollution et les déchets qui en résultèrent finirent par les obliger à abandonner leur monde pour se réfugier dans d'énormes cités en orbite autour de la planète."),
      section("Langue", "le durois, dont la transcription se fait par syllabes, est bien connu et très pratiqué dans le secteur Corellien et en de nombreux autres Mondes du Noyau. C'est l'une des langues qui servirent à l'élaboration du basic."),
      bookPart("L'Ère de la Rébellion", "Au sein de l'Alliance", "il est pratiquement impossible de rencontrer un Duros qui ne sache piloter un vaisseau, ce qui les rend particulièrement précieux pour la marine de l'Alliance. Beaucoup se tournent d'ailleurs vers la spécialité de Pilote de la carrière d'As. Nombreux sont également ceux qui excellent comme mécaniciens ou techniciens et se penchent sur la carrière d'Ingénieur. Bien qu'ils se montrent souvent discrets et méditatifs, les Duros ont la réputation d'être téméraires, qualité idéale dans la lutte contre l'Empire."),
      rules([
        "Seuil de blessure : 11 + Vigueur",
        "Seuil de stress : 10 + Volonté",
        "Expérience de départ : 100 XP",
        "Capacité spéciale : les Duros commencent le jeu avec 1 rang en Pilotage (espace). Ils ne peuvent cependant pas dépasser le rang 2 dans cette compétence à la création du personnage.",
        "Navigation intuitive : les Duros peuvent ajouter un avantage à tous leurs tests d'Astrogation."
      ])
    ].join("")
  },
  {
    key: "gran",
    name: "Gran",
    sources: [{ book: "edr", page: "55-57" }],
    characteristics: [2, 2, 2, 1, 2, 3],
    wound: 10, strain: 9, xp: 100,
    skillChoice: { count: 1, options: ["charm", "negotiation"], nonCareer: false },
    abilities: "1 rang en Charme ou en Négociation (rang 2 max à la création) ; vision supérieure (combat à distance et Perception : retire jusqu'à ■■ dus à l'environnement ou au camouflage).",
    description: [
      p("Ces êtres à la vue perçante sont foncièrement pacifiques, adorent la nature et recherchent spontanément le contact social, ce qui en fait des cibles faciles pour la politique violente et sans vergogne de l'Empire. C'est ainsi que même les plus pacifistes ont fini par rechercher du réconfort au service de la Rébellion."),
      section("Physiologie", "issus de mammifères herbivores, les Gran sont des humanoïdes bipèdes dont l'aspect se caractérise par trois yeux pédonculés. Leur visage dominé par un grand museau rappelle une tête de chèvre. Leurs mains et leurs pieds sont plutôt larges, certains souffrant d'une mutation génétique qui se manifeste par des extrémités hypertrophiées (la gêne est toutefois plus sociale que physique)."),
      p("La vision des Gran couvre un spectre bien plus large que celui de la plupart des humanoïdes, comprenant notamment la perception des rayonnements infrarouges. Les Gran partagent une forme d'empathie particulière avec leurs congénères : ils sont capables, en interprétant la température corporelle et les variations de teinte, de déceler les émotions des leurs. Les Gran qui passent beaucoup de temps avec d'autres espèces finissent également par savoir lire leurs humeurs selon le même principe."),
      p("Les Gran sont dotés de deux estomacs qui leur permettent d'emmagasiner et de digérer la nourriture sur des périodes prolongées. Leur repas s'étale sur toute la journée quand ils en ont le loisir. Si tel est le cas, ils peuvent ensuite se passer de nourriture pendant trois à cinq jours, selon la valeur nutritionnelle de ce qui a été ingéré."),
      section("Société", "la paix et l'unité ont toujours constitué les pierres angulaires de la civilisation gran, dont les premiers jours se caractérisaient déjà par un esprit grégaire. Les Gran sont organisés en communautés très soudées, au sein desquelles chacun est très proche de sa famille étendue et de ses amis, et tâche de vivre en harmonie avec son environnement bucolique et agricole. Les doyens jouissent d'une grande autorité et leur assemblée gouverne la planète et sa population."),
      p("La plupart des Gran grandissent avec la certitude qu'ils serviront leur communauté dans un domaine qui leur sera attribué selon les compétences et les talents qu'ils auront manifestés. Cette approche peut paraître odieuse à d'autres espèces, mais elle est toute naturelle pour la société très communautaire des Gran. La grande majorité d'entre eux y adhèrent d'ailleurs avec joie."),
      p("Le besoin de contact social éprouvé par cette espèce peut s'avérer fatal dans certaines circonstances et le pire châtiment chez les Gran n'est autre que l'exil. Quand on en croise parmi les étoiles, ils sont souvent vêtus de noir, endeuillés par la perte de leur famille et de leurs proches, d'autant qu'ils s'efforcent d'oublier les couleurs vives de leur patrie. Ces Gran cèdent facilement à la tentation et aux manigances de ceux qui savent les duper : un Gran exilé peut s'avérer redoutable et même cruel."),
      section("Monde d'origine", "les Gran sont issus de la planète Kinyen, superbe monde agricole très productif de la région d'Expansion. La destruction de l'une de leurs cités les a malheureusement réduits à capituler devant l'Empire. Ils disposent également de colonies sur Hok et Malastare, aux cultures pourtant très diverses : Malastare est notamment connu pour être un lieu corrompu et dangereux."),
      section("Langue", "la langue parlée et écrite par les Gran n'est autre que le gran. Les membres des autres espèces ont bien du mal à converser efficacement avec eux, car leur température et leurs teintes corporelles ne sont pas toujours compatibles. Les Gran plus cosmopolites surmontent généralement cette difficulté."),
      bookPart("L'Ère de la Rébellion", "Au sein de l'Alliance", "la plupart des Gran qui servent l'Alliance se tournent vers des rôles qui ne passent pas par la violence. Quelques-uns parviennent néanmoins à sacrifier les principes fondateurs de leur monde natal pour pouvoir justement le libérer du joug impitoyable de l'occupation impériale. En raison de leur vision exceptionnelle et de leurs aptitudes empathiques, les Gran optent souvent pour les Devoirs de Recrutement, Renseignements, Secours ou Soutien politique. Les carrières de Diplomate et d'Espion leur tendent les bras, de même que la spécialité Urgentiste de la carrière de Soldat."),
      rules([
        "Seuil de blessure : 10 + Vigueur",
        "Seuil de stress : 9 + Volonté",
        "Expérience de départ : 100 XP",
        "Capacité spéciale : les Gran commencent le jeu avec 1 rang en Charme ou en Négociation. Ils ne peuvent cependant pas dépasser le rang 2 dans la compétence choisie à la création du personnage.",
        "Vision supérieure : quand ils effectuent un test de combat à distance ou de Perception, les Gran retirent jusqu'à ■■ imposés par l'environnement ou le camouflage (mais pas par la défense de la cible)."
      ])
    ].join("")
  },
  {
    key: "ithorian",
    name: "Ithorien",
    sources: [{ book: "edr", page: "57-58" }],
    characteristics: [2, 1, 2, 2, 3, 2],
    wound: 9, strain: 12, xp: 90,
    startingSkills: ["survival"],
    abilities: "1 rang en Survie (rang 2 max à la création) ; mugissement ithorien (Résistance ; dégâts 6 ; critique 4 ; portée courte ; Dégâts étourdissants, Cadence lente 2, Choc 1, Souffle 3 ; 3 points de stress par utilisation).",
    description: [
      p("En basic, les Ithoriens sont surnommés Têtes de marteau (un sobriquet qui ne leur plaît guère), en référence à la forme si particulière de leur crâne pour des bipèdes. On les considère souvent comme les gardiens de la galaxie, hommage à leur amour des environnements naturels et à leur désir de réparer les dommages que les êtres conscients infligent à leurs mondes."),
      section("Physiologie", "les Ithoriens mesurent entre 1m80 et 2m30 et leurs membres sont prolongés par de longs doigts. Leur cou est surmonté d'une tête inclinée vers l'avant, qui se termine par une protubérance en T aux extrémités de laquelle apparaissent leurs yeux globuleux. À l'endroit où le cou débute, deux bouches sont présentes : une de chaque côté. Avec leurs quatre gorges et leurs deux orifices buccaux, ils peuvent parler et chanter en stéréo. Ils sont pourvus de puissantes capacités sonores qu'ils peuvent employer de manière dévastatrice avec de l'entraînement."),
      p("Mâles et femelles se distinguent avant tout par les bosses apparaissant sur la partie postérieure de leur tête : une pour le mâle, deux pour la femelle. Leurs petits, ou « pupes », sont engendrés par milliers par un même mâle. À ce stade, les Ithoriens n'ont pas de membres et se déplacent par l'intermédiaire de tubes locomoteurs, ce qui n'est plus le cas après leur métamorphose en jeunes adultes."),
      section("Société", "la société ithorienne est basée sur la relation spirituelle avec « Mère Jungle », terme qui désigne l'esprit de leur planète aux forêts vierges et luxuriantes : Ithor. Toute leur civilisation se consacre à ne profaner la planète en aucun cas. Dès qu'ils ont eu accès à la technologie des moteurs à répulsion, les Ithoriens ont bâti de gigantesques communautés flottantes (les vaisseaux-troupeaux) leur permettant de survoler toute la planète en nuisant le moins possible à sa beauté immaculée."),
      p("Cette mentalité se retrouve chez tous les Ithoriens de la galaxie qui ont adapté le concept de vaisseau-troupeau au voyage interstellaire. Leurs troupeaux (comme ils appellent leurs communautés et familles étendues) sont chacun dirigés par un prêtre sensible à la Force. Ils constituent ainsi une menace pour Palpatine et son Empire. Si Ithor est restée relativement intacte, c'est uniquement parce que l'Empire le veut bien : le régime peut extorquer la technologie agricole et d'autres secrets aux Ithoriens s'il s'abstient de détruire la surface de la planète."),
      p("Les Ithoriens sont généralement plus pacifistes encore que les Gran. Ils détectent les membres les plus agressifs de leur espèce pour les exiler d'Ithor (ce qui explique pourquoi le premier contact avec un Ithorien se fait souvent avec un individu beaucoup moins affable que la plupart de ses congénères). Les Ithoriens préfèrent renoncer aux armes et compter sur leurs défenses sonores. Ceux qui évoluent parmi les étoiles sont souvent artistes, négociants ou environnementalistes. Dans ce dernier rôle, beaucoup ont contribué à réparer les dégâts subis par d'autres planètes frappées par quelque guerre."),
      section("Monde d'origine", "Ithor est considérée comme l'un des mondes les plus beaux et débordant de vie de la galaxie. La planète se caractérise par ses océans d'un bleu cristallin et ses forêts d'émeraude. Toute trace de civilisation est systématiquement effacée de la surface par les Ithoriens, qui résident dans leurs vaisseaux-troupeaux aux dimensions urbaines. Ceux qui se rendent sur la surface sont censés y terminer leurs jours, en réponse à l'appel de Mère Jungle."),
      section("Langue", "présenté comme l'une des langues les plus complexes et belles de la galaxie, l'ithorois est un mélange stéréophonique de sons enchanteurs. Pour ceux qui ne sont pas membres de l'espèce, la maîtrise de cet idiome est un talent exceptionnel tellement il est malaisé de produire ces sonorités avec un métabolisme différent."),
      bookPart("L'Ère de la Rébellion", "Au sein de l'Alliance", "comme c'est le cas avec les Gran, il est presque impossible de trouver des Ithoriens dans les rangs militaires de la Rébellion. L'espèce est bienveillante envers l'Alliance, mais elle se consacre davantage à la préservation de la vie et la restauration de l'environnement, le combat n'étant pas son domaine. Malgré cela, une poignée d'Ithoriens sont prêts à affronter ceux qui cherchent à dévaster leur monde et tant d'autres planètes. Ils estiment que c'est là le meilleur moyen de servir Mère Jungle. La spécialité d'Urgentiste de la carrière de Soldat paraît idéale pour un Ithorien, de même que la carrière de Diplomate. Certains Ithoriens trouvent leur vocation dans la spécialité Scientifique de la carrière d'Ingénieur. Le lien naturel que l'espèce entretient avec la Force rend également attrayante la spécialité Aspirant de la Force. Sans surprise, c'est le Devoir Secours qui s'impose pour beaucoup d'Ithoriens, mais Obtention de ressources a également ses partisans."),
      rules([
        "Seuil de blessure : 9 + Vigueur",
        "Seuil de stress : 12 + Volonté",
        "Expérience de départ : 90 XP",
        "Capacité spéciale : les Ithoriens commencent le jeu avec 1 rang en Survie. Ils ne peuvent cependant pas dépasser le rang 2 dans cette compétence à la création de personnage.",
        "Mugissement ithorien : grâce à leurs deux bouches et leurs quatre gorges, les Ithoriens disposent d'une arme naturelle sur laquelle ils peuvent compter pour se défendre (Résistance ; dégâts 6 ; critique 4 ; portée courte ; Dégâts étourdissants, Cadence lente 2, Choc 1, Souffle 3). Chaque fois que l'Ithorien recourt à cette capacité, il subit 3 points de stress."
      ])
    ].join("")
  },
  {
    key: "monCalamari",
    name: "Mon Calamari",
    sources: [{ book: "edr", page: "58-59" }],
    characteristics: [2, 2, 3, 1, 2, 2],
    wound: 10, strain: 10, xp: 100,
    startingSkills: ["education"],
    abilities: "1 rang en Connaissance (Éducation) (rang 2 max à la création) ; amphibien.",
    description: [
      p("Artisans, rêveurs et alliés dévoués chaque fois qu'ils embrassent une cause, les Mon Calamari (ou parfois Mon Cal) figurent parmi les espèces les plus respectées de la galaxie, car ils ont longtemps servi l'Ancienne République. Leur planète a malheureusement été assujettie par l'Empire et les Mon Cal ne sont désormais que des esclaves de la machine de guerre impériale. Ceux qui ont échappé à ce sort sont résolus à libérer leur planète et l'ensemble de la galaxie."),
      section("Physiologie", "amphibiens, les Mon Calamari vivent surtout au-dessus de la surface océanique de leur monde d'origine, sur de petites îles et de vastes cités flottantes. Leur taille varie entre 1m30 et 1m80. Bipèdes, ils présentent néanmoins un aspect très pisciforme, avec leur peau tachetée comme les saumons, leurs grands yeux aux mouvements indépendants, leurs mains et leurs pieds palmés, et leur crâne en pain de sucre. Les autres espèces remarqueront leur odeur marine plutôt agréable."),
      p("Les mains des Mon Calamari éveillent la curiosité, avec leurs membranes et leurs doigts crochus. La paume présente également trois orifices, probablement les vestiges de ventouses. Leurs pieds ont une structure similaire. Les Mon Calamari sont parfaitement capables de vivre sous l'eau, maîtrisant la respiration aquatique et supportant les changements de pression jusqu'à trente mètres de profondeur, sans nécessiter d'équipement. Respirer sous l'eau n'est toutefois pas le mode le plus agréable pour eux, car ils se sont adaptés à la vie à la surface depuis très longtemps. Quand il en a la possibilité, le Mon Calamari préfère recourir à un symbiote artificiel appelé branchie organique, qu'il propose également à ses compagnons d'autres espèces lorsqu'il s'agit d'évoluer en milieu aquatique. Cet équipement vivant n'est qu'une trouvaille technologique parmi tant d'autres, mises au point par cette espèce pionnière."),
      section("Société", "les Mon Calamari sont l'une des espèces les plus sophistiquées de la galaxie, contrairement à ce que la propagande impériale tente de colporter. Leur régime politique est une république représentative, très légaliste et égalitaire. La grande majorité d'entre eux sont altruistes et généreux. Travailleurs, ils sont déterminés à défendre ce qu'ils perçoivent comme juste et s'efforcent de concilier beauté et industrie. Il est difficile de ne pas considérer comme exemplaires les accomplissements de leur société."),
      p("Si l'espèce présente ce qui pourrait s'apparenter à un défaut, c'est la propension de ses membres à se complaire dans les rêves et le romantisme. Les Mon Calamari ont tendance à se passionner pour les causes considérées comme perdues d'avance et à préférer les outsiders. Ils prisent la paix et la productivité, et n'ont aucune affection pour la guerre, mais leur sens inné de la justice et de la vertu les a souvent mis en première ligne de conflits qui ne les concernaient pas directement. Heureusement pour eux, leur détermination, associée à leurs talents tactiques et stratégiques, leur permet de briller dans la plupart des situations martiales."),
      p("Outre leur amour de l'art et de la culture, les Mon Calamari disposent de nombreux scientifiques et ingénieurs de pointe. La qualité de leur construction navale rivalise avec ce qui se fait de mieux dans le secteur Corellien, même si leurs exigences esthétiques ne manquent pas d'interloquer les autres architectes."),
      p("L'autorité tyrannique de leurs maîtres impériaux fait ressurgir le désir de liberté des Mon Calamari, qui fomentent une résistance avec les Quarrens, autre espèce réduite en esclavage de la planète Dac. Ils ne tarderont pas à lancer une opération commune visant à reprendre leur patrie."),
      section("Monde d'origine", "Dac (que l'on appelle également Mon Cala, surtout entre étrangers) est avant tout un monde aquatique dominé par un gigantesque océan. On compte bien quelques îlots et récifs sur lesquels les Mon Calamari ont bâti des structures, mais la plupart de leurs villes flottent à la surface. L'espèce partage la planète avec les Quarrens, contre qui elle a souvent guerroyé, ainsi qu'avec d'autres races douées de conscience comme les Moappa et les Whaladons (toutes évoluant essentiellement en milieu sous-marin). Les fameux chantiers navals Mon Calamari gravitent en orbite autour du monde."),
      section("Langue", "les Mon Cal et les Quarrens parlent le mon calamarien, idiome de leur monde, mais après avoir longuement côtoyé la République Galactique, la planète Dac a largement adopté le basic. La prononciation du basic par les Mon Calamari s'accompagne de gargouillis, mais reste intelligible pour la plupart des auditeurs."),
      bookPart("L'Ère de la Rébellion", "Au sein de l'Alliance", "les Mon Cal qui sont parvenus à fuir l'esclavage et à rejoindre l'Alliance figurent parmi les guerriers les plus résolus de la Rébellion. Ils font d'excellents pilotes et techniciens, leurs dons les amenant spontanément vers la carrière d'As, de Stratège ou d'Ingénieur. Ceux qui recherchent la gloire tendent plutôt vers la carrière de Soldat. Les Devoirs Victoire militaire, Supériorité spatiale et Secours demeurent les plus attractifs pour un Mon Cal, mais Technologie peut plaire à certains."),
      rules([
        "Seuil de blessure : 10 + Vigueur",
        "Seuil de stress : 10 + Volonté",
        "Expérience de départ : 100 XP",
        "Capacité spéciale : les Mon Calamari commencent le jeu avec 1 rang en Connaissance (Éducation). Ils ne peuvent cependant pas dépasser le rang 2 dans cette compétence à la création de personnage.",
        "Amphibien : un Mon Calamari peut respirer sous l'eau sans malus, et ne souffre d'aucun malus de déplacement lorsqu'il évolue dans l'eau."
      ])
    ].join("")
  },
  {
    key: "sullustan",
    name: "Sullustéen",
    sources: [{ book: "edr", page: "59-60" }],
    characteristics: [2, 3, 2, 1, 2, 2],
    wound: 10, strain: 10, xp: 100,
    startingSkills: ["astrogation"],
    startingTalents: ["Pilote chevronné"],
    abilities: "1 rang en Astrogation (rang 2 max à la création) ; 1 rang dans le talent Pilote chevronné.",
    description: [
      p("Espèce vivant en milieu souterrain, les Sullustéens sont pourtant attirés par les étoiles et ceux que l'on croise dans l'espace assurent souvent la fonction de pilotes ou d'astrogateurs. Affables, curieux de nature et sans complexe, ils apprécient peu l'Empire et encore moins le fait que la corporatocratie qui leur tient lieu de gouvernement depuis les bureaux de SoroSuub ait vendu toute leur planète à la machine de guerre impériale."),
      section("Physiologie", "malgré leurs caractéristiques extérieures bien singulières, les Sullustéens sont en fait très proches des humains sur le plan génétique. Leur peau présente une teinte rosée et une pilosité très réduite. Leur taille varie généralement entre 1m et 1m80. Leurs yeux sont grands et sombres, leurs oreilles larges et arrondies, et les fanons de peau qui leur tiennent lieu de joues sont appelées « abajoues »."),
      p("Comme ils occupent une planète dont la surface est parfaitement inhospitalière, les Sullustéens sont devenus une espèce cavernicole prospérant sous la croûte instable de Sullust. Cette adaptation leur confère une ouïe exceptionnelle, notamment la capacité de déterminer précisément la distance et la direction par divers indices sonores. La structure de leurs yeux leur permet de voir jusqu'à vingt mètres dans l'obscurité totale. Malheureusement, pour la plupart, cela se traduit par des lésions de la cornée dès qu'ils s'exposent de manière prolongée à la lumière naturelle."),
      p("Autre résultat de leur adaptation, les Sullustéens savent toujours dans quelle direction ils avancent, quelles que soient les conditions (y compris sans le moindre indice physique). Cette aptitude leur permet de se repérer facilement dans le dédale de tunnels et de galeries qui compose leur habitat. Pour des raisons qui restent encore mystérieuses, cet instinct directionnel s'applique également au voyage spatial, y compris à la navigation hyperspatiale."),
      section("Société", "la culture sullustéenne tourne autour des clans, au sein desquels une unique femelle est entourée de plusieurs mâles, le groupe entier se chargeant de l'éducation des enfants. Les femelles atteignent leur maturité avant de quitter cette cellule pour aller fonder leur propre groupe (on parle de « clan-terrier »). La religion sullustéenne est polythéiste. La mort y est révérée en tant que « sommeil éternel ». Certaines galeries, très vastes et sophistiquées, constituent de magnifiques sites sacrés."),
      p("Bien que la plupart des Sullustéens restent près de leur foyer, ceux qui répondent à l'appel de l'aventure et des nouvelles expériences peuvent facilement monnayer leur sens de l'orientation inné pour décrocher des emplois de spationautes d'un bout à l'autre de la galaxie. Ces voyageurs ont accumulé un grand savoir, notamment technologique et industriel, qu'ils ont pu ensuite partager avec les leurs. Les perspectives minières extrêmement lucratives de Sullust et de ses lunes ont provoqué l'essor de l'économie sullustéenne, dominée par la très diversifiée corporation SoroSuub. Celle-ci emploie la moitié de la population, ce qui lui a permis d'orchestrer sa mainmise sur le pouvoir local. Cette autorité s'exerçait dans un premier temps dans l'ombre, mais l'avènement de l'Empire en a fait une réalité légale."),
      p("Les Sullustéens sont d'un naturel cordial et communicatif. Ils apprécient l'humour, moyen qui permet selon eux de mieux anticiper les réactions d'autrui. Leur curiosité exacerbée les fait souvent passer pour imprudents. Ils éprouvent un profond désir de goûter tout ce que peut offrir la galaxie."),
      section("Monde d'origine", "la surface instable et inhospitalière de Sullust cache une culture complexe et stupéfiante dans ses entrailles. Le ciel y est souvent noir de nuages de cendres volcaniques, ce qui n'empêche pas les Sullustéens de savoir exactement où s'établir pour éviter les dangers locaux."),
      section("Langue", "de nombreux spationautes, surtout parmi les contrebandiers, pratiquent le très fluide sullustois, ce qui témoigne de l'omniprésence des Sullustéens sur les hypervoies de la galaxie."),
      bookPart("L'Ère de la Rébellion", "Au sein de l'Alliance", "la Résistance sullustéenne, qui s'opposait au contrôle de Sullust par SoroSuub, se présente désormais davantage comme un adversaire direct de l'Empire. Rien de surprenant, donc, à voir de plus en plus de Sullustéens rejoindre l'Alliance et mettre leurs dons et leur bravoure au service de la lutte contre Palpatine. La carrière d'As paraît idéale pour bien des Sullustéens, même si leur dextérité naturelle en fait aussi d'excellents Soldats et que leurs sens si particuliers les destinent également à la carrière d'Espion. La plupart des Devoirs conviennent parfaitement aux membres de cette espèce."),
      rules([
        "Seuil de blessure : 10 + Vigueur",
        "Seuil de stress : 10 + Volonté",
        "Expérience de départ : 100 XP",
        "Capacité spéciale : les Sullustéens commencent le jeu avec 1 rang en Astrogation. Ils ne peuvent cependant pas dépasser le rang 2 dans cette compétence à la création de personnage. Ils débutent également avec un rang du talent Pilote chevronné."
      ])
    ].join("")
  },

  /* ============================ FORCE ET DESTINÉE ============================ */
  {
    key: "cerean",
    name: "Céréen",
    sources: [{ book: "fad", page: "54-55" }],
    characteristics: [2, 1, 3, 2, 2, 2],
    wound: 10, strain: 13, xp: 90,
    startingSkills: ["vigilance"],
    modifiers: ["coreWorlds", "education", "lore", "outerRim", "underworld", "warfare", "xenology"].map(key => ({ type: "skillCareer", key, value: 1 })),
    abilities: "1 rang en Vigilance (rang 2 max à la création) ; traitement binaire (toutes les compétences de Connaissance sont des compétences de carrière).",
    description: [
      p("Les Céréens sont une espèce bien reconnaissable. Ils ressemblent aux humains, mais leur boîte crânienne très allongée, presque conique, est caractéristique. Elle abrite un grand cerveau binaire (deux cerveaux étroitement reliés). En raison de cette particularité, les Céréens sont capables de suivre plusieurs trains de pensées à la fois, et jouissent de capacités mentales extraordinaires. En tant qu'espèce, ils sont également connus pour l'attention qu'ils portent aux détails et pour une tendance culturelle à la contemplation."),
      section("Physiologie", "les Céréens sont des mammifères à l'anatomie proche de celle des humains. Les différences les plus notables sont la présence d'un crâne allongé et conique pour loger leur structure cérébrale binaire, ainsi qu'une paire de cœurs qui améliore leur circulation. Ils disposent en revanche d'une coordination motrice légèrement moins efficace que celle des humains."),
      p("Les Céréens manifestent un dimorphisme sexuel inhabituel. Il naît vingt fois plus de femmes que d'hommes. De plus, ces derniers vieillissent plus rapidement. En conséquence, les Céréennes sont de loin les plus nombreuses sur leur monde."),
      section("Société", "la culture céréenne est basée sur la préservation des régions sauvages de leur monde natal et sur une vie en harmonie avec la nature. La méditation joue un rôle central dans l'existence des Céréens, souvent en conjonction avec les cristaux kasha. Ces pierres les aident à se calmer et à purifier leur esprit, et ceux qui s'en servent exploitent mieux leurs énergies naturelles."),
      p("Sans doute en raison du déséquilibre entre les sexes, la société céréenne est essentiellement matriarcale. Le gouvernement est dirigé par un président qui travaille avec un Conseil des Anciennes. Les décisions sont prises après de longues discussions au cours desquelles les problèmes sont disséqués sous différents angles, avec un effort concerté pour tendre vers l'objectivité. Une fois que le conseil a pris sa décision, elle est définitive, sans aucune possibilité d'appel. Les Céréens, profondément convaincus de leur infaillibilité, considèrent que le Conseil a toujours raison. Il reste néanmoins possible de réviser une décision si les circonstances changent ou si des faits nouveaux apparaissent."),
      p("La tradition joue un grand rôle dans la vie des Céréens, en commençant par leur nom. Ternaire, il dérive de ceux de leurs parents et grands-parents. Leur style vestimentaire, établi au fil des siècles, est également très traditionnel. Nombreux sont ceux qui apprennent à manier le shyarn, une antique épée courbe. Les duellistes se concentrent souvent sur un style de combat très artistique et stylisé qui leur sert à libérer leur agressivité. Certains affirment que cette catharsis joue un rôle clé dans la préservation d'une société paisible."),
      section("Monde d'origine", "Céréa est un monde de la Bordure Médiane aux fortes tendances isolationnistes. Historiquement, c'était un paradis verdoyant. Lors de la Guerre des Clones, Céréa a opté pour la neutralité. En revanche, la planète a accueilli de nombreux réfugiés, les installant dans des enclaves, ce qui créa de fortes pressions démographiques et déclencha des chocs culturels. Depuis la guerre, Céréa s'efforce de rester isolée du reste de la galaxie."),
      section("Langue", "tous les Céréens apprennent le basic en plus de leur propre langue. Le céréen utilise des arrêts glottaux et comporte de nombreux mots composés, qui peuvent être très longs."),
      bookPart("Force et Destinée", "Perception de la Force", "les Céréens manifestent une prédisposition culturelle pour la médiation et la contemplation, ce qui a certainement joué un rôle dans leur tendance à se lier à la Force. Leur talent pour l'analyse leur confère également un degré d'intuition qui ressemble à la précognition maîtrisée par certains utilisateurs de la Force. Les légendes suggèrent que certains Jedi céréens particulièrement accomplis se sont montrés capables d'utiliser leur cerveau binaire pour explorer simultanément les côtés lumineux et obscur de l'énergie mystique."),
      rules([
        "Seuil de blessure : 10 + Vigueur",
        "Seuil de stress : 13 + Volonté",
        "Expérience de départ : 90 XP",
        "Capacité spéciale : les Céréens commencent le jeu avec 1 rang en Vigilance. Ils ne peuvent cependant pas dépasser le rang 2 dans cette compétence à la création de personnage.",
        "Traitement binaire : les Céréens considèrent toutes les compétences de Connaissance comme des compétences de carrière."
      ])
    ].join("")
  },
  {
    key: "kelDor",
    name: "Kel Dor",
    sources: [{ book: "fad", page: "57-58" }],
    characteristics: [1, 2, 2, 2, 3, 2],
    wound: 10, strain: 10, xp: 100,
    startingSkills: ["education"],
    abilities: "1 rang en Connaissance (Éducation) (rang 2 max à la création) ; vision dans l'obscurité (retire jusqu'à ■■ dus à l'obscurité) ; besoins atmosphériques (masque respiratoire, oxygène = atmosphère dangereuse de niveau 8, 5 minutes dans le vide).",
    description: [
      p("Réputés pour être une espèce paisible et modérée, les Kel Dors se reconnaissent aux lunettes de protection et au respirateur qu'ils doivent porter hors de leur environnement natal. En dépit de leur nature tranquille, ils sont connus pour leur profond sens de la justice et pour leur volonté de l'appliquer, au besoin par la force."),
      section("Physiologie", "les Kel Dors sont des mammifères presque entièrement glabres qui mesurent en moyenne 1,70 m. L'atmosphère de Dorin, leur monde natal, est composée d'hélium et de gaz rares. Pour évoluer dans d'autres environnements, ils sont obligés de porter des masques filtrants. Ceci, combiné à leur résistance naturelle, peut leur permettre de survivre brièvement dans le vide, une capacité extraordinairement utile."),
      p("Par ailleurs, leurs yeux noirs sont adaptés à la faible luminosité et aux conditions atmosphériques de Dorin, et lorsqu'ils s'aventurent dans le reste de la galaxie, ils doivent porter des lunettes amplificatrices et protectrices. Un organe extrasensoriel très développé se trouve à l'arrière de leur crâne, étroitement lié à leur cerveau. La peau des Kel Dors varie de l'orange pâle au rouge profond."),
      section("Société", "les Kel Dors sont étroitement liés à leurs familles étendues. Plusieurs générations choisissent souvent de vivre ensemble. Cela leur offre la possibilité de partager la responsabilité de l'éducation des jeunes et de demander conseil aux anciens. Souvent, des familles entières partagent une carrière commune, ce qui peut déboucher sur une entreprise familiale qui perdure au fil des générations."),
      p("La société kel dor est fortement influencée par les progrès de la technologie. Leurs besoins très spécifiques les ont poussés à créer des systèmes environnementaux. Cela inclut des appareils individuels, mais aussi des dispositifs à grande échelle, adaptés à un grand nombre d'environnements."),
      p("La justice est rapide et sûre sur Dorin. Les agents de sécurité sont prompts à offrir leur aide à ceux qui en ont besoin, mais ils n'aiment guère les lenteurs administratives. Ils interprètent les questions légales et morales de façon très manichéenne, en ignorant les éventuelles circonstances atténuantes."),
      section("Monde d'origine", "Dorin se trouve dans la Région d'Expansion. En raison de sa position entre deux trous noirs, elle est restée isolée du reste de la galaxie jusqu'à quelques siècles avant le début de la Guerre civile galactique. L'atmosphère de Dorin est composée d'hélium et d'un gaz encore non identifié, propre à ce système. Les niveaux d'oxygène de Dorin sont assez bas pour imposer une assistance respiratoire à la plupart des étrangers qui s'y rendent."),
      section("Langue", "dès leur enfance, les Kel Dors apprennent le kel dorien et le basic. Ils parlent basic comme un locuteur natif, et lorsqu'ils sont hors de leur monde, ils s'expriment rarement en kel dorien. Leur langue natale est plus facile à parler et à comprendre lorsqu'ils respirent l'atmosphère de Dorin."),
      bookPart("Force et Destinée", "Perception de la Force", "le lien qu'entretiennent les Kel Dors avec la Force remonte à bien avant leur arrivée sur la scène galactique. Pendant des millénaires, les Sages de l'obscure tradition du Baran Do ont servi de conseillers aux chefs des Kel Dors. En s'appuyant sur la privation sensorielle pour gagner une meilleure compréhension de la Force, ils ont raffiné des compétences qui, plus tard, ont été pratiquées par les Jedi les plus talentueux. La plupart des Kel Dors ont les yeux noirs, mais ceux qui sont étroitement liés à la Force arborent souvent des yeux argentés, ce qui peut s'avérer extrêmement dangereux dans le climat actuel. Depuis l'avènement de l'Empire, plus d'un Kel Dor sensible à la Force, identifié à cause de ses yeux inhabituels, a été abattu par des agents impériaux."),
      rules([
        "Seuil de blessure : 10 + Vigueur",
        "Seuil de stress : 10 + Volonté",
        "Expérience de départ : 100 XP",
        "Capacité spéciale : les Kel Dor commencent le jeu avec un rang en Connaissance (Éducation). Ils ne peuvent cependant pas dépasser le rang 2 en Connaissance (Éducation) lors de la création de personnage.",
        "Vision dans l'obscurité : lorsqu'ils effectuent des tests de compétence, les Kel Dors peuvent retirer jusqu'à ■■ imposés par l'obscurité.",
        "Besoins atmosphériques : les Kel Dors doivent porter des masques spéciaux pour respirer et voir en dehors de leur environnement natal. Un personnage kel dor commence le jeu avec un masque respiratoire filtrant, et traite l'oxygène comme une atmosphère dangereuse dotée d'une valeur de 8 (voir page 220). Toutefois, les Kel Dors peuvent survivre jusqu'à cinq minutes dans le vide sans souffrir de ses effets."
      ])
    ].join("")
  },
  {
    key: "mirialan",
    name: "Mirialan",
    sources: [{ book: "fad", page: "58-59" }],
    characteristics: [2, 3, 2, 1, 2, 2],
    wound: 11, strain: 10, xp: 100,
    startingSkills: ["discipline", "cool"],
    abilities: "1 rang en Sang-froid et 1 rang en Calme (rang 2 max à la création).",
    description: [
      p("Les Mirialans sont une espèce presque humaine originaire de la planète Mirial. Leur culture se caractérise par une foi profonde, teintée de respect, en la destinée des individus. Les Mirialans pratiquent une forme de tatouage rituel pour représenter la manière dont ils ont surmonté les obstacles que la vie a placés devant eux."),
      section("Physiologie", "les Mirialans sont extrêmement proches des humains. Leur différence la plus voyante est leur couleur de peau, qui varie du vert à un vert-jaune plus pâle. Leurs cheveux sont noirs ou châtains, et leurs yeux présentent toutes les couleurs humaines, plus le jaune, l'orange et le rouge. Étant en moyenne plus rapides et agiles que les humains, ils sont considérés comme des experts en arts martiaux."),
      section("Société", "la culture mirialane se définit par ses convictions religieuses. Ses membres estiment que le destin d'un individu est défini par ses décisions et ses actes. Ses choix actuels s'ajoutent aux précédents pour définir son sort final. Comme leurs réactions aux circonstances représentent l'intégrité d'une personne, les Mirialans leur donnent une forme visuelle. Tout événement important de la vie de l'un d'entre eux est illustré par un tatouage sur son visage, ses mains ou un autre endroit visible. Au fur et à mesure que les Mirialans vieillissent, les motifs deviennent de plus en plus complexes et détaillés. Les formes géométriques et le positionnement des tatouages dessinent une représentation visuelle de la vie de chaque Mirialan, et suggèrent le rôle que cet individu est susceptible de jouer dans l'avenir de la planète."),
      p("Les Mirialans ne cachent rien de leur passé, ce qui induit un certain degré de stratification dans leur société. Ceux qui ont remporté des succès autrefois sont automatiquement reconnus et appréciés, et reçoivent de nouvelles occasions de briller. Par contraste, ceux qui font de mauvais choix au début de leur existence ont peu de chances de se rattraper, puisque toute personne qui rencontre un Mirialan sait quelles ont été ses erreurs et ses fautes. Ceux qui ont pris un mauvais départ ont souvent l'impression d'être forcés de suivre une route qui ne débouche que sur une triste fin. Toutefois, d'autres puisent dans leur foi la motivation nécessaire pour changer de vie. Certains estiment que leurs erreurs doivent leur servir de leçon pour relever d'autres défis."),
      section("Monde d'origine", "Mirial se trouve près de la Voie Hydienne, pas très loin du Secteur Corporatif. C'est un monde froid et sec, qui a forcé les Mirialans à se dépasser juste pour survivre. Avant la Guerre des Clones, la Fédération du Commerce se servait de la dépendance de Mirial aux importations pour garder sa population sous contrôle."),
      section("Langue", "le mirialan est la langue natale de Mirial, même si la plupart des membres de l'espèce apprennent également le basic pendant leur scolarité."),
      bookPart("Force et Destinée", "Perception de la Force", "la religion des Mirialans est basée sur une compréhension limitée de la Force cosmique, qu'ils assimilent au destin. Même ceux qui ne sont pas capables d'interagir directement avec la Force ont foi dans le destin et le reconnaissent comme la puissance qui guide leur vie. Pour cette raison, les Mirialans éprouvent un profond respect envers ceux qui savent employer cette énergie mystique. Avant la Guerre des Clones, il y avait toujours au moins un Jedi mirialan présent au temple Jedi."),
      rules([
        "Seuil de blessure : 11 + Vigueur",
        "Seuil de stress : 10 + Volonté",
        "Expérience de départ : 100 XP",
        "Capacité spéciale : les Mirialans commencent le jeu avec 1 rang en Sang-froid et un 1 rang en Calme. Ils ne peuvent cependant pas dépasser le rang 2 dans ces compétences à la création de personnage."
      ])
    ].join("")
  },
  {
    key: "nautolan",
    name: "Nautolan",
    sources: [{ book: "fad", page: "59" }],
    characteristics: [3, 2, 2, 2, 1, 2],
    wound: 11, strain: 9, xp: 100,
    startingSkills: ["athletics"],
    abilities: "1 rang en Athlétisme (rang 2 max à la création) ; amphibie.",
    description: [
      p("Les Nautolans sont des humanoïdes amphibies originaires de Glee Anselm. Ils sont connus pour leur nature optimiste et empathique, ainsi que pour apprécier les activités du quotidien. Bien qu'ils soient généralement paisibles, ils sont forts et résistants."),
      section("Physiologie", "les Nautolans sont une espèce humanoïde d'origine aquatique capable de respirer sous l'eau. Leurs doigts et leurs orteils palmés les aident à nager. Un réseau cartilagineux dense se combine à un endosquelette osseux pour les rendre exceptionnellement résistants. Les longs tentacules verts qui ornent leur tête sont des organes sensoriels qui leur permettent de détecter des phéromones des individus à proximité et de faire ainsi preuve de grandes capacités empathiques. Leurs grands yeux noirs sont adaptés aux eaux les plus troubles. En dépit de leur origine marine, les Nautolans sont capables de survivre longtemps sur la terre ferme."),
      p("Ils sont ovipares et sortent de l'œuf sous forme de têtards. Leurs bras, leurs jambes et leurs tentacules occipitaux apparaissent au cours de leur seconde année, au moment où ils atteignent en gros la taille d'un nourrisson humain. Leurs membres ne sont pas encore assez solides pour supporter leur poids sur la terre ferme, aussi passent-ils une grande partie de leur enfance dans l'eau."),
      section("Société", "un Conseil des Anciens élu forme le gouvernement central des implantations nautolanes. Sur Glee Anselm, des représentants de chaque habitat coopèrent pour former un gouvernement central. Le titre d'Ancien est une simple marque de respect, car les représentants sont élus selon leur mérite et non en fonction de leur âge."),
      p("Les Nautolans s'accouplent pour la vie et se montrent très fidèles envers leurs familles. Le père et la mère contribuent également à l'éducation des jeunes. Historiquement, les parents arrangeaient les mariages de leurs enfants, mais de nos jours, cette coutume a tendance à disparaître."),
      p("L'humeur des Nautolans reflète souvent celle des êtres intelligents les plus proches, en raison de la sensibilité aux phéromones de leurs filaments. En termes très généraux, les membres de cette espèce sont heureux et pleins d'entrain, surtout lorsqu'ils ont la possibilité de se consacrer à leurs centres d'intérêt. Toutefois, lorsqu'ils sont confrontés à la colère et au désespoir, ils ont tendance à refléter les mêmes sentiments."),
      section("Monde d'origine", "Glee Anselm est une planète de la Bordure Médiane comprenant de nombreux environnements aquatiques. Les rares terres émergées y prennent la forme d'archipels. Bien que les Nautolans aient évolué dans les océans de ce monde, une autre espèce sans lien avec eux, les Anselmi, s'est établie sur les terres émergées. Des combats incessants pour la possession de la terre ont fait des Anselmi des guerriers. Cela a conduit à de nombreux conflits pendant toute l'histoire de la planète."),
      section("Langue", "les Nautolans parlent le nautila, qui a été créé pour être utilisé sous l'eau. À l'air libre, il s'avère pratiquement impossible à prononcer. De plus, il dépend en partie de phéromones qui doivent être disséminées dans l'eau en parallèle avec les sons. Par conséquent, tous les Nautolans apprennent à parler une autre langue, souvent le basic ou l'anselmi."),
      bookPart("Force et Destinée", "Perception de la Force", "de nombreux Nautolans reconnaissent la signification de la Force, et il y a eu de nombreux Jedi nautolans. Toutefois, la Force ne joue pas un rôle central dans leur culture."),
      rules([
        "Seuil de blessure : 11 + Vigueur",
        "Seuil de stress : 9 + Volonté",
        "Expérience de départ : 100 XP",
        "Capacité spéciale : les Nautolans commencent le jeu avec un rang en Athlétisme. Ils ne peuvent cependant pas dépasser le rang 2 dans cette compétence à la création de personnage.",
        "Amphibie : les Nautolans peuvent respirer sous l'eau sans malus, et ne souffrent jamais de pénalité de mouvement lorsqu'ils se déplacent dans l'eau."
      ])
    ].join("")
  },
  {
    key: "togruta",
    name: "Togruta",
    sources: [{ book: "fad", page: "60" }],
    characteristics: [1, 2, 2, 3, 2, 2],
    wound: 10, strain: 10, xp: 100,
    startingSkills: ["perception"],
    abilities: "1 rang en Perception (rang 2 max à la création) ; instincts de la meute (la manœuvre « assister » ajoute deux dés de fortune au lieu d'un).",
    description: [
      p("Les Togrutas sont une espèce carnivore humanoïde originaire de la planète Shili. Ils sont faciles à reconnaître, en raison de leurs tentacules crâniens et de leurs montrals, des pseudo-cornes. Seuls les Togrutas qui présentent un certain esprit d'indépendance — un trait assez rare chez eux — voyagent en dehors de leur monde."),
      section("Physiologie", "les Togrutas sont des mammifères humanoïdes presque glabres, qui mesurent en moyenne 1,70 mètre. Leur peau est généralement de couleur vive, rouge ou orange, et la plupart des individus arborent des marques blanches sur tout le corps. Leur tête s'orne de trois, ou plus rarement de quatre tentacules. Deux sont généralement drapés à l'avant de leur corps, et le troisième pend derrière. Au-dessus de cette parure, deux montrals creux servent à une forme d'écholocalisation primitive, qui améliore encore leurs sens aiguisés."),
      section("Société", "les Togrutas ont évolué à partir de créatures qui chassaient en meute, et leur société reste marquée par cet héritage. Une vie urbaine émerge peu à peu, mais la majorité des individus habitent encore de denses villages communaux établis dans les vallées cachées et les bois profonds de Shili, où ils vivent en harmonie avec la nature. Tous les membres de la communauté sont censés apprendre à travailler avec les autres membres de leur meute, participant ensemble au succès du groupe."),
      p("Les Togrutas n'éprouvent guère de sympathie pour ceux qui ne contribuent pas au bien de la société. Néanmoins, la plupart reconnaissent que dans le monde moderne, les contributions peuvent être diverses, allant de la fabrication d'outils utiles à la capacité de distraire la meute par des chants et des contes. C'est particulièrement vrai dans les villes en expansion de Shili, où des esprits vifs sont plus précieux que des bras musclés."),
      p("La plupart des Togrutas considèrent l'excès d'individualisme comme une déviance. Dans de nombreux cas, ce trait est quand même récompensé, car les individus à la personnalité marquée peuvent obtenir des postes d'autorité au sein des communautés. Certains étrangers ont noté que l'acceptation des individualistes par les Togrutas était directement fonction de leur succès et de la valeur de leur contribution à l'ensemble de la société. Les Togrutas indépendants qui ne parviennent pas à réussir parmi leur peuple ont tendance à voyager en dehors de leur monde, le reste de la galaxie se montrant souvent plus tolérant que leurs congénères."),
      section("Monde d'origine", "Shili se situe dans la Région d'Expansion, près de la Voie Hydienne. Son environnement naturel se compose de beaucoup de brousse et de forêts denses. Dans les deux cas, l'herbe turu est présente, et ses couleurs rouge et blanche rejoignent la coloration des Togruta. La faune de la planète comporte de nombreuses proies et prédateurs, y compris le sauvage akul. Dans le passé, des tribus entières de Togrutas collaboraient pour vaincre leurs proies, et elles incorporaient des portions de leurs victimes dans leurs garde-robes."),
      p("Depuis qu'ils ont pris conscience de l'existence d'une société galactique, de nombreux Togrutas ont voyagé hors de leur monde pour fonder des colonies. Libérées d'une partie des traditions de leur monde d'origine, celles-ci ont suivi des voies culturelles très différentes. La colonie d'artisans de Kiros, par exemple, se concentre sur l'expression créative et la coexistence pacifique, et ses citoyens font preuve d'un degré d'individualité supérieur à la moyenne de l'espèce. Les mœurs et le comportement des Togrutas coloniaux diffèrent parfois sensiblement de ceux de leurs cousins de Shili."),
      section("Langue", "les Togrutas ont appartenu à l'Ancienne République pendant des milliers d'années. Tous parlent le togruti, leur langue natale, mais la plupart apprennent le basic. Le togruti utilise des trilles qui prennent des sens différents selon la position des tentacules du locuteur."),
      bookPart("Force et Destinée", "Perception de la Force", "les Togrutas n'ont pas de tradition indigène de la Force, mais de nombreux membres de cette espèce ont quitté leur monde pour rejoindre l'Ordre Jedi. Les érudits Jedi estimaient que les Togrutas présentaient une forte affinité avec la Force. Cela se traduit par une perception spatiale exceptionnelle, qui joue un grand rôle dans la manière dont ils réagissent à leur environnement."),
      rules([
        "Seuil de blessure : 10 + Vigueur",
        "Seuil de stress : 10 + Volonté",
        "Expérience de départ : 100 XP",
        "Capacité spéciale : les Togrutas commencent le jeu avec 1 rang en Perception. Ils ne peuvent cependant pas dépasser le rang 2 dans cette compétence à la création du personnage.",
        "Instincts de la meute : lorsqu'ils accomplissent la manœuvre « assister », les Togrutas ajoutent deux dés de fortune au lieu d'un."
      ])
    ].join("")
  },
  {
    key: "zabrak",
    name: "Zabrak",
    sources: [{ book: "fad", page: "62-63" }],
    characteristics: [2, 2, 2, 2, 3, 1],
    wound: 10, strain: 10, xp: 100,
    startingSkills: ["survival"],
    modifiers: [{ type: "skillAdvantage", key: "coercion", value: 1 }],
    abilities: "1 rang en Survie (rang 2 max à la création) ; apparence effrayante (avantage automatique en Coercition).",
    description: [
      p("Pour la couleur de peau et le physique, les Zabraks ressemblent aux humains, mais ils s'en distinguent facilement grâce à leurs cornes vestigielles. Ils sont renommés pour leurs prouesses martiales et leur assurance innée."),
      section("Physiologie", "la physiologie des Zabraks est similaire à celle des humains, avec quelques différences notables, par exemple un second cœur et une meilleure résistance à la douleur. Leurs cornes vestigielles émergent à la puberté. Elles sont le signe que l'individu s'approche de sa maturité, et donc de son rite de passage à l'âge adulte. La pigmentation des Zabraks couvre une large gamme de teintes allant de l'ivoire au presque noir en passant par les bruns. Certains ont des cheveux, mais la plupart sont complètement chauves. Leurs yeux peuvent être des mêmes couleurs que ceux des humains, plus le jaune, le rouge et l'orange."),
      section("Société", "lorsqu'ils ont accompli leur rite de passage, les Zabraks arborent des tatouages faciaux. Ceux-ci sont généralement composés de lignes fines et de dessins élégants, basés sur la tradition familiale. D'autres optent pour des créations personnelles et y incorporent la représentation d'événements significatifs."),
      p("Les Zabraks sont réputés pour leur indépendance et leur confiance en eux. Les conditions difficiles qui prévalent sur leur monde d'origine, Iridonia, les ont rendus prompts à se mesurer les uns aux autres, voire à se battre. Les différentes cultures des Zabraks laissent toutes une place aux arts martiaux. Le « zhaboka », un long bâton terminé par des lames, est une arme culturelle importante. Historiquement, les combattants s'en servaient à dos de reek, des montures de guerre. La combinaison de leur détermination et de leurs prouesses au combat rend les Zabraks extrêmement résistants à la domination impériale."),
      p("Leurs tendances guerrières s'accompagnent d'une réputation de fabricants d'armes exceptionnels. Ils produisent à la fois des armes de mêlée traditionnelles et des blasters fiables. Ces armes ne sont pas fabriquées en série, mais on arrive à en trouver dans toute la galaxie (parfois parce que les Zabraks ont entrepris d'armer discrètement des espèces opprimées)."),
      section("Monde d'origine", "les Zabraks sont originaires d'Iridonia, un monde de la Bordure Médiane. Il est largement hostile à la vie, avec des conditions météo féroces, des mers acides et une impressionnante batterie de prédateurs. Ses habitants le quittent volontiers pour émigrer vers d'autres planètes. En conséquence, de nombreux Zabraks s'identifient davantage à leur colonie qu'au monde natal de leur espèce. Ces colonies sont disséminées dans toute la galaxie. Certaines se trouvent sur des mondes métropolitains majeurs, d'autres se limitent à des enclaves dans des lieux improbables, comme les colonies montagnardes de Dathomir. Sur cette dernière planète, les Zabraks mettent l'accent sur les tendances guerrières de leur culture à l'exclusion de tous ses autres aspects, et ils ont tendance à être plus violents et plus redoutables que leurs cousins d'autres mondes."),
      section("Langue", "la langue natale des Zabraks d'Iridonia est le zabraki. Toutefois, en raison de leur longue association avec la civilisation galactique, presque tous parlent le basic."),
      bookPart("Force et Destinée", "Perception de la Force", "les Zabraks sont entrés en contact avec le côté obscur de la Force avant même de maîtriser suffisamment le voyage interstellaire pour établir leurs propres colonies. Les anciens Sith ont engagé de nombreux mercenaires zabraks pour servir dans leurs armées. Le Haut-conseil zabrak a d'ailleurs beaucoup profité de ces contrats, et un degré de sauvagerie apprécié des Sith est entré dans la culture martiale de l'espèce. Il a été conservé bien après la disparition des Seigneurs Noirs."),
      rules([
        "Seuil de blessure : 10 + Vigueur",
        "Seuil de stress : 10 + Volonté",
        "Expérience de départ : 100 XP",
        "Capacité spéciale : les Zabraks commencent le jeu avec un rang de Survie. Ils ne peuvent cependant pas dépasser 2 rangs dans cette compétence à la création de personnage.",
        "Apparence effrayante : les Zabraks ajoutent automatiquement un avantage à tous leurs tests de Coercition."
      ])
    ].join("")
  }
];
