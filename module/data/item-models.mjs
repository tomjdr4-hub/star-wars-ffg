import { ACTIVATIONS, FORCE_UPGRADES, QUALITIES, RANGES, SKILLS } from "../config.mjs";
import { bool, html, int, modifiersField, sourceField, str } from "./fields.mjs";

const { ArrayField, SchemaField, StringField } = foundry.data.fields;

/** Champs communs à tout le matériel achetable. */
function commerce() {
  return {
    price: int(0, { min: 0 }),
    rarity: int(1, { min: 0, max: 10 }),
    restricted: bool(false),
    encumbrance: int(1, { min: 0 }),
    quantity: int(1, { min: 0 })
  };
}

class BaseItemData extends foundry.abstract.TypeDataModel {
  static defineSchema() {
    return {
      description: html(),
      source: sourceField()
    };
  }
}

/* -------------------------------------------- */

export class WeaponData extends BaseItemData {
  static defineSchema() {
    return {
      ...super.defineSchema(),
      ...commerce(),
      skill: str("rangedLight", { blank: false, choices: Object.keys(SKILLS) }),
      damage: int(6, { min: 0 }),
      // Armes de corps à corps et de pugilat : la Vigueur s'ajoute aux dégâts.
      addBrawn: bool(false),
      crit: int(3, { min: 0 }),
      range: str("medium", { blank: false, choices: Object.keys(RANGES) }),
      qualities: new ArrayField(new SchemaField({
        key: str("accurate", { blank: false, choices: Object.keys(QUALITIES) }),
        rank: int(1, { min: 0 })
      })),
      hardpoints: int(0, { min: 0 }),
      equipped: bool(false),
      carried: bool(true),
      // Armes de véhicule : échelle des vaisseaux (dégâts ×10 contre les personnages) et arc de tir.
      vehicle: new SchemaField({
        enabled: bool(false),
        firingArc: str("fore"),
        rangeBand: str("close")
      }),
      modifiers: modifiersField(),
      mods: str("")
    };
  }

  /** Libellé des attributs, ex. « Précis 1, Étourdissement 2 ». */
  get qualitiesLabel() {
    return this.qualities.map(q => {
      const cfg = QUALITIES[q.key];
      const name = game.i18n.localize(cfg?.label ?? q.key);
      return cfg?.ranked ? `${name} ${q.rank}` : name;
    }).join(", ");
  }
}

export class ArmorData extends BaseItemData {
  static defineSchema() {
    return {
      ...super.defineSchema(),
      ...commerce(),
      soak: int(1, { min: 0 }),
      defense: int(0, { min: 0 }),
      hardpoints: int(0, { min: 0 }),
      equipped: bool(false),
      carried: bool(true),
      modifiers: modifiersField(),
      mods: str("")
    };
  }
}

export class GearData extends BaseItemData {
  static defineSchema() {
    return {
      ...super.defineSchema(),
      ...commerce(),
      carried: bool(true),
      modifiers: modifiersField()
    };
  }
}

/** Accessoire d'arme, d'armure ou de véhicule (chapitre V, « Modifications et améliorations »). */
export class AttachmentData extends BaseItemData {
  static defineSchema() {
    return {
      ...super.defineSchema(),
      ...commerce(),
      category: str("weapon", { blank: false, choices: ["weapon", "armor", "vehicle", "lightsaber"] }),
      hardpoints: int(1, { min: 0 }),
      baseModifiers: str(""),
      modOptions: str(""),
      modifiers: modifiersField()
    };
  }
}

/* -------------------------------------------- */

export class TalentData extends BaseItemData {
  static defineSchema() {
    return {
      ...super.defineSchema(),
      activation: str("passive", { blank: false, choices: Object.keys(ACTIVATIONS) }),
      ranked: bool(false),
      rank: int(1, { min: 0 }),
      forceTalent: bool(false),
      // Arborescences où le talent apparaît (texte libre, ex. « Assassin, Maraudeur »).
      trees: str(""),
      modifiers: modifiersField()
    };
  }
}

/**
 * Pouvoir de la Force : pouvoir de base et grille d'améliorations (4 colonnes, rangées libres).
 * Une amélioration peut occuper plusieurs colonnes (`width`), comme dans les arbres imprimés.
 * `check` permet de noter le test associé : les livres ne s'accordent pas toujours
 * (ex. Déplacement / Contrôle « lancer » : Sang-froid dans AoE et EdR, attaque à distance dans la VF de F&D).
 */
export class ForcePowerData extends BaseItemData {
  static defineSchema() {
    return {
      ...super.defineSchema(),
      minForceRating: int(1, { min: 0 }),
      baseCost: int(10, { min: 0 }),
      baseText: str(""),
      upgrades: new ArrayField(new SchemaField({
        type: str("strength", { blank: false, choices: Object.keys(FORCE_UPGRADES) }),
        text: str(""),
        cost: int(5, { min: 0 }),
        row: int(1, { min: 1, max: 6 }),
        col: int(1, { min: 1, max: 4 }),
        width: int(1, { min: 1, max: 4 }),
        check: str(""),
        learned: bool(false)
      })),
      learned: bool(true)
    };
  }

  get xpSpent() {
    return (this.learned ? this.baseCost : 0) + this.upgrades.filter(u => u.learned).reduce((t, u) => t + u.cost, 0);
  }
}

/** Case vide d'arborescence (les valeurs initiales d'un tableau ne sont pas complétées par Foundry). */
const BLANK_CELL = {
  name: "", uuid: "", activation: "passive", ranked: false, text: "", linkRight: false, linkDown: false, learned: false
};

/**
 * Spécialité : 4 compétences de carrière bonus et une arborescence de 20 talents (4 colonnes × 5 rangées).
 * Le coût d'une case est 5 × rangée. Les liens indiquent les chemins d'achat possibles.
 */
export class SpecializationData extends BaseItemData {
  static defineSchema() {
    const cell = () => new SchemaField({
      name: str(""),
      uuid: str(""),
      activation: str("passive", { blank: false, choices: Object.keys(ACTIVATIONS) }),
      ranked: bool(false),
      text: str(""),
      linkRight: bool(false),
      linkDown: bool(false),
      learned: bool(false)
    });
    return {
      ...super.defineSchema(),
      career: str(""),
      universal: bool(false),
      careerSkills: new ArrayField(new StringField({ required: true, choices: Object.keys(SKILLS) })),
      // Fugitif de la Force (AoE) et Aspirant de la Force (EdR) donnent une Valeur de Force de 1.
      forceRating: int(0, { min: 0 }),
      talents: new ArrayField(cell(), { initial: () => Array.from({ length: 20 }, () => ({ ...BLANK_CELL })) })
    };
  }
}

export class CareerData extends BaseItemData {
  static defineSchema() {
    return {
      ...super.defineSchema(),
      careerSkills: new ArrayField(new StringField({ required: true, choices: Object.keys(SKILLS) })),
      // Les carrières de Force et Destinée commencent avec une Valeur de Force de 1.
      forceRating: int(0, { min: 0 }),
      specializations: str("")
    };
  }
}

export class SpeciesData extends BaseItemData {
  static defineSchema() {
    return {
      ...super.defineSchema(),
      characteristics: new SchemaField({
        brawn: int(2), agility: int(2), intellect: int(2), cunning: int(2), willpower: int(2), presence: int(2)
      }),
      woundBase: int(10, { min: 0 }),
      strainBase: int(10, { min: 0 }),
      startingXp: int(100, { min: 0 }),
      abilities: str(""),
      // Rangs offerts à la création (rang 2 maximum à la création dans ces compétences).
      startingSkills: new ArrayField(new StringField({ required: true, choices: Object.keys(SKILLS) })),
      // Choix : « 1 rang en Charme ou en Tromperie » (options), « 1 rang dans deux compétences hors carrière » (options vides).
      skillChoice: new SchemaField({
        count: int(0, { min: 0 }),
        options: new ArrayField(new StringField({ required: true, choices: Object.keys(SKILLS) })),
        nonCareer: bool(false)
      }),
      // Talents offerts (noms ; recherchés dans les compendiums de talents s'ils existent).
      startingTalents: new ArrayField(new StringField({ required: true, blank: false })),
      // Les droïdes ne peuvent pas être sensibles à la Force.
      noForce: bool(false),
      modifiers: modifiersField()
    };
  }
}

/** Blessure critique subie (table 6-10). */
export class CriticalData extends BaseItemData {
  static defineSchema() {
    return {
      ...super.defineSchema(),
      severity: int(1, { min: 1, max: 4 }),
      roll: str(""),
      modifiers: modifiersField()
    };
  }
}
