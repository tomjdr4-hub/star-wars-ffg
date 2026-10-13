import { CHARACTERISTICS, MORALITY, SKILLS, SYSTEM_ID } from "../config.mjs";
import { bool, characteristicsField, html, int, skillsField, str, trackField } from "./fields.mjs";

const { ArrayField, SchemaField, StringField } = foundry.data.fields;

/**
 * Additionne les modificateurs des objets actifs d'un acteur.
 * Un objet est actif s'il n'a pas de notion d'équipement (talent, espèce, carrière, spécialité, blessure critique)
 * ou s'il est équipé (arme, armure) ou porté (matériel).
 * Les modificateurs d'un talent à rangs sont multipliés par son rang.
 */
export function collectModifiers(actor) {
  const totals = {
    woundThreshold: 0, strainThreshold: 0, soak: 0, defenseMelee: 0, defenseRanged: 0,
    encumbranceThreshold: 0, forceRating: 0,
    characteristic: {}, skillRank: {}, skillBoost: {}, skillRemoveSetback: {}, skillCareer: {}, skillAdvantage: {}, skillCharacteristic: {}
  };
  for ( const item of actor.items ) {
    const sys = item.system;
    if ( !sys?.modifiers?.length ) continue;
    if ( ("equipped" in sys) && !sys.equipped ) continue;
    if ( ("carried" in sys) && !sys.carried ) continue;
    const mult = (item.type === "talent") && sys.ranked ? Math.max(sys.rank, 1) : 1;
    for ( const m of sys.modifiers ) {
      const v = m.value * mult;
      if ( m.type === "skillCharacteristic" ) {
        // Clé « compétence:caractéristique » : caractéristique alternative autorisée (Technique ataru…).
        const [skill, char] = (m.key ?? "").split(":");
        if ( skill && char ) (totals.skillCharacteristic[skill] ??= new Set()).add(char);
        continue;
      }
      if ( m.type in totals && (typeof totals[m.type] === "number") ) totals[m.type] += v;
      else if ( (m.type in totals) && m.key ) totals[m.type][m.key] = (totals[m.type][m.key] ?? 0) + v;
    }
  }
  return totals;
}

/** Ajoute à chaque compétence ses valeurs dérivées (caractéristique, rang total, carrière, dés). */
function prepareSkills(system, mods, careerSkills, characteristics) {
  for ( const [key, skill] of Object.entries(system.skills) ) {
    skill.total = skill.rank + (mods.skillRank[key] ?? 0);
    skill.isCareer = skill.career || careerSkills.has(key) || !!mods.skillCareer[key];
    skill.boost = mods.skillBoost[key] ?? 0;
    skill.removeSetback = mods.skillRemoveSetback[key] ?? 0;
    skill.advantage = mods.skillAdvantage[key] ?? 0;
    // Caractéristique alternative (talents) : on retient la plus élevée.
    for ( const alt of mods.skillCharacteristic[key] ?? [] ) {
      if ( (characteristics[alt]?.total ?? 0) > (characteristics[skill.characteristic]?.total ?? 0) ) skill.characteristic = alt;
    }
    const charValue = characteristics[skill.characteristic]?.total ?? 0;
    skill.pool = {
      proficiency: Math.min(charValue, skill.total),
      ability: Math.max(charValue, skill.total) - Math.min(charValue, skill.total)
    };
  }
}

/* -------------------------------------------- */
/*  Personnage joueur                           */
/* -------------------------------------------- */

export class CharacterData extends foundry.abstract.TypeDataModel {
  static defineSchema() {
    const entries = () => new ArrayField(new SchemaField({
      type: str(""),
      value: int(0, { min: 0 }),
      notes: str("")
    }));
    return {
      characteristics: characteristicsField(2),
      skills: skillsField(),
      wounds: trackField(),
      strain: trackField(),
      xp: new SchemaField({ total: int(0, { min: 0 }), available: int(0) }),
      credits: int(500),
      forceRating: new SchemaField({ committed: int(0, { min: 0 }) }),
      // Mécaniques de l'étape 2. `null` = selon le réglage du monde et le livre de la carrière.
      mechanics: new SchemaField({
        obligation: new StringField({ required: true, initial: "auto", choices: ["auto", "on", "off"] }),
        duty: new StringField({ required: true, initial: "auto", choices: ["auto", "on", "off"] }),
        morality: new StringField({ required: true, initial: "auto", choices: ["auto", "on", "off"] })
      }),
      obligations: entries(),
      duties: entries(),
      contribution: int(0, { min: 0 }),
      morality: new SchemaField({
        value: int(MORALITY.start, { min: 0, max: 100 }),
        conflict: int(0, { min: 0 }),
        strength: str(""),
        weakness: str(""),
        // Statut collant : un adepte du côté obscur le reste jusqu'à dépasser 70 (F&D p. 52).
        darkSide: bool(false)
      }),
      motivations: new ArrayField(new SchemaField({
        category: str(""),
        type: str(""),
        description: str("")
      })),
      // Effets temporaires d'Obligation / Devoir déclenchés en début de session.
      session: new SchemaField({
        strainThreshold: int(0),
        woundThreshold: int(0)
      }),
      biography: html(),
      notes: html()
    };
  }

  /** Livre de la carrière du personnage (pour le mode « selon le livre de la carrière »). */
  get careerBook() {
    return this.parent.itemTypes.career[0]?.system.source.book ?? "";
  }

  /** Mécaniques d'étape 2 actives pour ce personnage. */
  get activeMechanics() {
    const mode = game.settings.get(SYSTEM_ID, "socialMode");
    const isForce = this.forceRating.total > 0;
    const book = this.careerBook;
    const auto = {
      perCharacter: { obligation: book === "aoe" || !book, duty: book === "edr", morality: book === "fad" },
      obligation: { obligation: true, duty: false, morality: false },
      duty: { obligation: false, duty: true, morality: false },
      morality: { obligation: false, duty: false, morality: true },
      moralityForForce: { obligation: true, duty: true, morality: isForce },
      all: { obligation: true, duty: true, morality: true }
    }[mode] ?? { obligation: true, duty: true, morality: true };
    const out = {};
    for ( const k of ["obligation", "duty", "morality"] ) {
      const v = this.mechanics[k];
      out[k] = v === "auto" ? auto[k] : v === "on";
    }
    return out;
  }

  prepareDerivedData() {
    const actor = this.parent;
    const mods = collectModifiers(actor);
    this.modifiers = mods;

    for ( const [k, c] of Object.entries(this.characteristics) ) {
      c.total = c.value + (mods.characteristic[k] ?? 0);
    }
    const brawn = this.characteristics.brawn.total;
    const willpower = this.characteristics.willpower.total;

    const species = actor.itemTypes.species[0]?.system;
    const career = actor.itemTypes.career[0]?.system;
    const specs = actor.itemTypes.specialization;

    // Compétences de carrière : carrière + spécialités (EdR p. 343 : une spécialité ne peut être prise deux fois).
    const careerSkills = new Set([...(career?.careerSkills ?? [])]);
    for ( const s of specs ) for ( const k of s.system.careerSkills ) careerSkills.add(k);
    prepareSkills(this, mods, careerSkills, this.characteristics);

    // Valeur de Force : carrière F&D ou spécialité universelle (Fugitif / Aspirant de la Force) + talents.
    const forceBase = Math.max(career?.forceRating ?? 0, ...specs.map(s => s.system.forceRating), 0);
    this.forceRating.total = forceBase + mods.forceRating;
    this.forceRating.available = Math.max(this.forceRating.total - this.forceRating.committed, 0);

    // Moralité (F&D p. 52-53) : seuils du côté obscur et des parangons.
    const m = this.morality;
    m.isDark = m.darkSide || (m.value < MORALITY.darkThreshold);
    m.isParagon = !m.isDark && (m.value > MORALITY.paragonThreshold);
    const moralityOn = this.activeMechanics.morality;
    let moralWound = 0, moralStrain = 0;
    if ( moralityOn && m.isDark ) {
      const steps = (m.value < 10) ? 2 : (m.value < 20) ? 1 : 0;
      moralWound = steps;
      moralStrain = -steps;
    }
    else if ( moralityOn && m.isParagon ) {
      moralStrain = (m.value > 90) ? 2 : (m.value > 80) ? 1 : 0;
    }

    const armors = actor.itemTypes.armor.filter(a => a.system.equipped);
    const armorSoak = armors.reduce((t, a) => t + a.system.soak, 0);
    const armorDefense = Math.max(0, ...armors.map(a => a.system.defense));

    this.wounds.max = (species?.woundBase ?? 10) + brawn + mods.woundThreshold + this.session.woundThreshold + moralWound;
    this.strain.max = (species?.strainBase ?? 10) + willpower + mods.strainThreshold - this.session.strainThreshold + moralStrain;
    this.soak = brawn + armorSoak + mods.soak;
    this.defense = {
      melee: armorDefense + mods.defenseMelee,
      ranged: armorDefense + mods.defenseRanged
    };

    // Encombrement : 5 + Vigueur ; une armure portée compte pour 3 de moins (chapitre V).
    let enc = 0;
    for ( const item of actor.items ) {
      const s = item.system;
      if ( !("encumbrance" in s) ) continue;
      if ( ("carried" in s) && !s.carried ) continue;
      const qty = s.quantity ?? 1;
      const each = (item.type === "armor") && s.equipped ? Math.max(s.encumbrance - 3, 0) : s.encumbrance;
      enc += each * qty;
    }
    this.encumbrance = { value: enc, max: 5 + brawn + mods.encumbranceThreshold };

    this.obligationTotal = this.obligations.reduce((t, o) => t + o.value, 0);
    this.dutyTotal = this.duties.reduce((t, o) => t + o.value, 0);
    this.criticalCount = actor.itemTypes.critical.length;
  }
}

/* -------------------------------------------- */
/*  Adversaires : rival et némésis              */
/* -------------------------------------------- */

/** Rival et némésis : valeurs saisies telles qu'imprimées dans les profils (chapitre XII). */
export class AdversaryData extends foundry.abstract.TypeDataModel {
  static defineSchema() {
    return {
      characteristics: characteristicsField(2),
      skills: skillsField(),
      wounds: new SchemaField({ value: int(0, { min: 0 }), max: int(10, { min: 0 }) }),
      // Les rivaux n'ont pas de seuil de stress : le stress subi s'ajoute aux blessures.
      strain: new SchemaField({ value: int(0, { min: 0 }), max: int(10, { min: 0 }) }),
      soak: int(2, { min: 0 }),
      defense: new SchemaField({ melee: int(0, { min: 0 }), ranged: int(0, { min: 0 }) }),
      forceRating: new SchemaField({ value: int(0, { min: 0 }), committed: int(0, { min: 0 }) }),
      abilities: html(),
      notes: html()
    };
  }

  prepareDerivedData() {
    const mods = collectModifiers(this.parent);
    this.modifiers = mods;
    for ( const [k, c] of Object.entries(this.characteristics) ) c.total = c.value + (mods.characteristic[k] ?? 0);
    prepareSkills(this, mods, new Set(), this.characteristics);
    this.forceRating.total = this.forceRating.value + mods.forceRating;
    this.hasStrain = this.parent.type === "nemesis";
  }
}

/* -------------------------------------------- */
/*  Sbires                                      */
/* -------------------------------------------- */

/**
 * Groupe de sbires : le seuil de blessure du groupe est la somme de ceux des membres ;
 * une compétence de groupe a un rang égal au nombre de sbires en vie moins un (chapitre VI).
 */
export class MinionData extends foundry.abstract.TypeDataModel {
  static defineSchema() {
    return {
      characteristics: characteristicsField(2),
      groupSkills: new ArrayField(new StringField({ required: true, choices: Object.keys(SKILLS) })),
      quantity: int(3, { min: 1 }),
      woundsPerMinion: int(5, { min: 1 }),
      wounds: new SchemaField({ value: int(0, { min: 0 }) }),
      soak: int(3, { min: 0 }),
      defense: new SchemaField({ melee: int(0, { min: 0 }), ranged: int(0, { min: 0 }) }),
      abilities: html(),
      notes: html()
    };
  }

  prepareDerivedData() {
    for ( const c of Object.values(this.characteristics) ) c.total = c.value;
    this.wounds.max = this.quantity * this.woundsPerMinion;
    const remaining = Math.max(this.wounds.max - this.wounds.value, 0);
    this.alive = Math.ceil(remaining / this.woundsPerMinion);
    const rank = Math.max(this.alive - 1, 0);
    this.skills = {};
    for ( const [key, s] of Object.entries(SKILLS) ) {
      const isGroup = this.groupSkills.includes(key);
      const total = isGroup ? rank : 0;
      const charValue = this.characteristics[s.characteristic].total;
      this.skills[key] = {
        rank: total, total, isCareer: false, isGroup, boost: 0, removeSetback: 0, characteristic: s.characteristic,
        pool: { proficiency: Math.min(charValue, total), ability: Math.abs(charValue - total) }
      };
    }
  }
}

/* -------------------------------------------- */
/*  Vaisseaux et véhicules                      */
/* -------------------------------------------- */

export class VehicleData extends foundry.abstract.TypeDataModel {
  static defineSchema() {
    return {
      silhouette: int(3, { min: 0, max: 10 }),
      speed: new SchemaField({ value: int(0, { min: 0 }), max: int(3, { min: 0 }) }),
      handling: int(0),
      armor: int(2, { min: 0 }),
      hullTrauma: new SchemaField({ value: int(0, { min: 0 }), max: int(10, { min: 0 }) }),
      systemStrain: new SchemaField({ value: int(0, { min: 0 }), max: int(10, { min: 0 }) }),
      defense: new SchemaField({
        fore: int(0, { min: 0 }), aft: int(0, { min: 0 }), port: int(0, { min: 0 }), starboard: int(0, { min: 0 })
      }),
      sensorRange: str("short"),
      crew: str(""),
      passengers: int(0, { min: 0 }),
      encumbrance: new SchemaField({ value: int(0, { min: 0 }), max: int(10, { min: 0 }) }),
      hyperdrive: new SchemaField({ primary: str(""), backup: str("") }),
      navicomputer: bool(false),
      consumables: str(""),
      price: int(0, { min: 0 }),
      rarity: int(1, { min: 0, max: 10 }),
      restricted: bool(false),
      hardpoints: int(0, { min: 0 }),
      // Pilote : acteur dont on prend les compétences de Pilotage / Artillerie.
      pilot: str(""),
      description: html(),
      notes: html()
    };
  }
}

export const CHARACTERISTIC_KEYS = Object.keys(CHARACTERISTICS);
