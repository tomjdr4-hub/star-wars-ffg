/**
 * Configuration du système : caractéristiques, compétences, livres de règles et listes de référence.
 *
 * Livres pris en charge (abréviations utilisées partout dans le code) :
 *  - aoe : Aux Confins de l'Empire (Obligation)
 *  - edr : L'Ère de la Rébellion (Devoir, rang de Contribution)
 *  - fad : Force et Destinée (Moralité, Conflit)
 * Voir docs/ANALYSE.md pour le détail des différences entre les trois livres.
 */

export const SYSTEM_ID = "star-wars-ffg";

export const BOOKS = {
  aoe: { label: "SWFFG.Book.aoe", abbr: "AoE", mechanic: "obligation" },
  edr: { label: "SWFFG.Book.edr", abbr: "EdR", mechanic: "duty" },
  fad: { label: "SWFFG.Book.fad", abbr: "F&D", mechanic: "morality" }
};

/** Livres de base cochés dans les réglages du monde. */
export function activeBooks() {
  return Object.fromEntries(Object.keys(BOOKS).map(b => [b, game.settings.get(SYSTEM_ID, `book-${b}`)]));
}

/** Caractéristiques (table 1-1 des trois livres). */
export const CHARACTERISTICS = {
  brawn: { label: "SWFFG.Characteristic.brawn", abbr: "SWFFG.Characteristic.brawnAbbr" },
  agility: { label: "SWFFG.Characteristic.agility", abbr: "SWFFG.Characteristic.agilityAbbr" },
  intellect: { label: "SWFFG.Characteristic.intellect", abbr: "SWFFG.Characteristic.intellectAbbr" },
  cunning: { label: "SWFFG.Characteristic.cunning", abbr: "SWFFG.Characteristic.cunningAbbr" },
  willpower: { label: "SWFFG.Characteristic.willpower", abbr: "SWFFG.Characteristic.willpowerAbbr" },
  presence: { label: "SWFFG.Characteristic.presence", abbr: "SWFFG.Characteristic.presenceAbbr" }
};

export const SKILL_TYPES = {
  general: "SWFFG.SkillType.general",
  combat: "SWFFG.SkillType.combat",
  knowledge: "SWFFG.SkillType.knowledge"
};

/**
 * Compétences (table 3-1). `books` liste les livres de base où la compétence figure :
 *  - Stratégie (Warfare) n'existe que dans L'Ère de la Rébellion ;
 *  - Sabre laser n'existe que dans Force et Destinée.
 * EdR p. 343 précise que Stratégie reste accessible (hors carrière) aux personnages des autres livres.
 */
export const SKILLS = {
  astrogation: { characteristic: "intellect", type: "general" },
  athletics: { characteristic: "brawn", type: "general" },
  charm: { characteristic: "presence", type: "general" },
  coercion: { characteristic: "willpower", type: "general" },
  computers: { characteristic: "intellect", type: "general" },
  cool: { characteristic: "presence", type: "general" },
  coordination: { characteristic: "agility", type: "general" },
  deception: { characteristic: "cunning", type: "general" },
  discipline: { characteristic: "willpower", type: "general" },
  leadership: { characteristic: "presence", type: "general" },
  mechanics: { characteristic: "intellect", type: "general" },
  medicine: { characteristic: "intellect", type: "general" },
  negotiation: { characteristic: "presence", type: "general" },
  perception: { characteristic: "cunning", type: "general" },
  pilotingPlanetary: { characteristic: "agility", type: "general" },
  pilotingSpace: { characteristic: "agility", type: "general" },
  resilience: { characteristic: "brawn", type: "general" },
  skulduggery: { characteristic: "cunning", type: "general" },
  stealth: { characteristic: "agility", type: "general" },
  streetwise: { characteristic: "cunning", type: "general" },
  survival: { characteristic: "cunning", type: "general" },
  vigilance: { characteristic: "willpower", type: "general" },
  brawl: { characteristic: "brawn", type: "combat" },
  gunnery: { characteristic: "agility", type: "combat" },
  lightsaber: { characteristic: "brawn", type: "combat", books: ["fad"] },
  melee: { characteristic: "brawn", type: "combat" },
  rangedLight: { characteristic: "agility", type: "combat" },
  rangedHeavy: { characteristic: "agility", type: "combat" },
  coreWorlds: { characteristic: "intellect", type: "knowledge" },
  education: { characteristic: "intellect", type: "knowledge" },
  lore: { characteristic: "intellect", type: "knowledge" },
  outerRim: { characteristic: "intellect", type: "knowledge" },
  underworld: { characteristic: "intellect", type: "knowledge" },
  warfare: { characteristic: "intellect", type: "knowledge", books: ["edr"] },
  xenology: { characteristic: "intellect", type: "knowledge" }
};
for ( const [key, skill] of Object.entries(SKILLS) ) {
  skill.label = `SWFFG.Skill.${key}`;
  skill.books ??= ["aoe", "edr", "fad"];
}

/** Niveaux de difficulté (table 1-3) : nombre de dés de difficulté. */
export const DIFFICULTIES = {
  0: "SWFFG.Difficulty.simple",
  1: "SWFFG.Difficulty.easy",
  2: "SWFFG.Difficulty.average",
  3: "SWFFG.Difficulty.hard",
  4: "SWFFG.Difficulty.daunting",
  5: "SWFFG.Difficulty.formidable"
};

/** Niveaux de portée (« au contact » = Engaged en VO). */
export const RANGES = {
  engaged: "SWFFG.Range.engaged",
  short: "SWFFG.Range.short",
  medium: "SWFFG.Range.medium",
  long: "SWFFG.Range.long",
  extreme: "SWFFG.Range.extreme"
};

/** Portées des vaisseaux et véhicules (échelle planétaire / spatiale). */
export const VEHICLE_RANGES = {
  close: "SWFFG.VehicleRange.close",
  short: "SWFFG.VehicleRange.short",
  medium: "SWFFG.VehicleRange.medium",
  long: "SWFFG.VehicleRange.long",
  extreme: "SWFFG.VehicleRange.extreme"
};

/** Attributs des armes (identiques dans les trois livres). `ranked` : l'attribut a une valeur. `active` : déclenché par des avantages. */
export const QUALITIES = {
  accurate: { ranked: true, active: false },
  autoFire: { ranked: false, active: true },
  breach: { ranked: true, active: false },
  burn: { ranked: true, active: true },
  blast: { ranked: true, active: true },
  concussive: { ranked: true, active: true },
  cortosis: { ranked: false, active: false },
  cumbersome: { ranked: true, active: false },
  defensive: { ranked: true, active: false },
  deflection: { ranked: true, active: false },
  disorient: { ranked: true, active: true },
  ensnare: { ranked: true, active: true },
  guided: { ranked: true, active: true },
  knockdown: { ranked: false, active: true },
  inaccurate: { ranked: true, active: false },
  inferior: { ranked: false, active: false },
  ion: { ranked: false, active: false },
  limitedAmmo: { ranked: true, active: false },
  linked: { ranked: true, active: true },
  pierce: { ranked: true, active: false },
  prepare: { ranked: true, active: false },
  slowFiring: { ranked: true, active: false },
  stun: { ranked: true, active: true },
  stunDamage: { ranked: false, active: false },
  sunder: { ranked: false, active: true },
  superior: { ranked: false, active: false },
  tractor: { ranked: true, active: false },
  vicious: { ranked: true, active: false }
};
for ( const [key, q] of Object.entries(QUALITIES) ) q.label = `SWFFG.Quality.${key}`;

/** Activation des talents. */
export const ACTIVATIONS = {
  passive: "SWFFG.Activation.passive",
  incidental: "SWFFG.Activation.incidental",
  incidentalOot: "SWFFG.Activation.incidentalOot",
  maneuver: "SWFFG.Activation.maneuver",
  action: "SWFFG.Activation.action"
};

/** Types d'améliorations des pouvoirs de la Force. */
export const FORCE_UPGRADES = {
  base: "SWFFG.ForceUpgrade.base",
  strength: "SWFFG.ForceUpgrade.strength",
  magnitude: "SWFFG.ForceUpgrade.magnitude",
  range: "SWFFG.ForceUpgrade.range",
  duration: "SWFFG.ForceUpgrade.duration",
  control: "SWFFG.ForceUpgrade.control",
  mastery: "SWFFG.ForceUpgrade.mastery"
};

/** Gravité des blessures critiques (table 6-10) : difficulté du test de Médecine. */
export const SEVERITIES = {
  1: "SWFFG.Severity.easy",
  2: "SWFFG.Severity.average",
  3: "SWFFG.Severity.hard",
  4: "SWFFG.Severity.daunting"
};

/** Mécaniques « étape 2 » et façon de les combiner (EdR p. 342-343, F&D p. 338-339). */
export const SOCIAL_MODES = {
  perCharacter: "SWFFG.SocialMode.perCharacter",
  obligation: "SWFFG.SocialMode.obligation",
  duty: "SWFFG.SocialMode.duty",
  morality: "SWFFG.SocialMode.morality",
  moralityForForce: "SWFFG.SocialMode.moralityForForce",
  all: "SWFFG.SocialMode.all"
};

/** Seuils de Moralité (F&D p. 52-53). */
export const MORALITY = {
  start: 50,
  darkThreshold: 30,
  redemptionThreshold: 70,
  paragonThreshold: 70
};

/** Fortune / infortune et autres symboles qu'un talent ou un objet peut ajouter à une réserve. */
export const POOL_KEYS = ["ability", "proficiency", "difficulty", "challenge", "boost", "setback", "force"];
export const RESULT_KEYS = ["success", "advantage", "triumph", "failure", "threat", "despair", "light", "dark"];

export const SWFFG = {
  BOOKS, CHARACTERISTICS, SKILL_TYPES, SKILLS, DIFFICULTIES, RANGES, VEHICLE_RANGES, QUALITIES, ACTIVATIONS,
  FORCE_UPGRADES, SEVERITIES, SOCIAL_MODES, MORALITY, POOL_KEYS, RESULT_KEYS
};
