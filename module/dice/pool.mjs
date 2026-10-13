import { POOL_KEYS, RESULT_KEYS, SKILLS } from "../config.mjs";
import { AbilityDie, BoostDie, ChallengeDie, DifficultyDie, ForceDie, ProficiencyDie, SetbackDie } from "./dice.mjs";

const DENOMINATIONS = {
  ability: AbilityDie.DENOMINATION,
  proficiency: ProficiencyDie.DENOMINATION,
  difficulty: DifficultyDie.DENOMINATION,
  challenge: ChallengeDie.DENOMINATION,
  boost: BoostDie.DENOMINATION,
  setback: SetbackDie.DENOMINATION,
  force: ForceDie.DENOMINATION
};

/**
 * Réserve de dés d'un test (chapitre I, « Constituer une réserve de dés de base »).
 * Ordre des modifications imposé par les règles : ajouter, améliorer, dégrader, retirer.
 * `results` : symboles ajoutés automatiquement (talents, équipement : « ajoutez un succès »…).
 */
export class DicePool {
  constructor(data = {}) {
    for ( const k of POOL_KEYS ) this[k] = Math.max(Number(data[k]) || 0, 0);
    this.results = Object.fromEntries(RESULT_KEYS.map(k => [k, Number(data.results?.[k]) || 0]));
  }

  /**
   * Réserve de base : la plus haute valeur entre caractéristique et rang donne le nombre de dés,
   * la plus basse le nombre de dés améliorés en maîtrise.
   */
  static fromCharacteristicAndRank(characteristic, rank, difficulty = 2) {
    return new DicePool({
      ability: Math.max(characteristic, rank) - Math.min(characteristic, rank),
      proficiency: Math.min(characteristic, rank),
      difficulty
    });
  }

  /** Réserve d'un test de compétence d'un acteur, fortunes et retraits d'infortune des talents compris. */
  static fromSkill(actor, skillKey, { difficulty = 2 } = {}) {
    const skill = actor.system.skills?.[skillKey];
    const cfg = SKILLS[skillKey];
    if ( !skill || !cfg ) return new DicePool({ difficulty });
    const characteristic = actor.system.characteristics[skill.characteristic ?? cfg.characteristic]?.total ?? 0;
    const pool = DicePool.fromCharacteristicAndRank(characteristic, skill.total ?? skill.rank ?? 0, difficulty);
    pool.boost += skill.boost ?? 0;
    pool.removeSetback = skill.removeSetback ?? 0;
    return pool;
  }

  /** Améliore n dés d'aptitude en maîtrise ; sans dé d'aptitude, ajoute un dé d'aptitude. */
  upgradeAbility(n = 1) {
    for ( let i = 0; i < n; i++ ) {
      if ( this.ability > 0 ) { this.ability--; this.proficiency++; }
      else this.ability++;
    }
    return this;
  }

  /** Améliore n dés de difficulté en défi ; sans dé de difficulté, ajoute un dé de difficulté. */
  upgradeDifficulty(n = 1) {
    for ( let i = 0; i < n; i++ ) {
      if ( this.difficulty > 0 ) { this.difficulty--; this.challenge++; }
      else this.difficulty++;
    }
    return this;
  }

  /** Dégrade n dés de maîtrise en aptitude (sans effet s'il n'y en a pas). */
  downgradeAbility(n = 1) {
    const k = Math.min(n, this.proficiency);
    this.proficiency -= k;
    this.ability += k;
    return this;
  }

  /** Dégrade n dés de défi en difficulté (sans effet s'il n'y en a pas). */
  downgradeDifficulty(n = 1) {
    const k = Math.min(n, this.challenge);
    this.challenge -= k;
    this.difficulty += k;
    return this;
  }

  /** Applique les retraits d'infortune en attente (dernière étape). */
  applyRemovals() {
    if ( this.removeSetback ) {
      this.setback = Math.max(this.setback - this.removeSetback, 0);
      this.removeSetback = 0;
    }
    return this;
  }

  get isEmpty() {
    return POOL_KEYS.every(k => !this[k]);
  }

  /** Formule Foundry, ex. « 2dp + 1da + 2di + 1dk ». */
  toFormula() {
    const order = ["proficiency", "ability", "boost", "challenge", "difficulty", "setback", "force"];
    const parts = order.filter(k => this[k] > 0).map(k => `${this[k]}d${DENOMINATIONS[k]}`);
    return parts.length ? parts.join(" + ") : "0";
  }

  toObject() {
    return { ...Object.fromEntries(POOL_KEYS.map(k => [k, this[k]])), results: { ...this.results }, removeSetback: this.removeSetback ?? 0 };
  }
}
