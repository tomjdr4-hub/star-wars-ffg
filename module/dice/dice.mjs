/**
 * Dés narratifs de Star Wars (Aux Confins de l'Empire, L'Ère de la Rébellion, Force et Destinée).
 *
 * Chaque dé est un `Die` Foundry dont les faces sont associées à des symboles.
 * Les dénominations reprennent celles de l'ancien système communautaire pour que les formules
 * existantes (« 2da1dp ») restent valides : a, p, i, c, b, k, f.
 * Note : « c » (pièce) et « f » (Fudge) du cœur de Foundry sont remplacés.
 */

/** Symboles possibles sur les faces : s succès, a avantage, t triomphe, f échec, h menace, d désastre, l lumière, n obscurité. */
export const SYMBOLS = {
  s: "success",
  a: "advantage",
  t: "triumph",
  f: "failure",
  h: "threat",
  d: "despair",
  l: "light",
  n: "dark"
};

import { symbolHTML } from "../helpers.mjs";

const { Die } = foundry.dice.terms;

/** Base commune : `FACES[i]` donne les symboles de la face i+1 (chaîne vide = face blanche). */
export class NarrativeDie extends Die {
  /** @type {string[]} */
  static FACES = [];

  /** Clé de configuration (`CONFIG.SWFFG.DICE`). */
  static KEY = "";

  constructor(termData = {}) {
    termData.faces = termData.faces ?? 1;
    super(termData);
    this.faces = this.constructor.FACES.length;
  }

  /** Symboles d'un résultat numérique. */
  static symbolsFor(result) {
    return this.FACES[result - 1] ?? "";
  }

  /** Total des symboles de ce dé, tous résultats actifs confondus. */
  get symbols() {
    const counts = emptyCounts();
    for ( const r of this.results ) {
      if ( !r.active ) continue;
      for ( const ch of this.constructor.symbolsFor(r.result) ) counts[SYMBOLS[ch]] += 1;
    }
    return counts;
  }

  /** @override */
  get expression() {
    return `${this.number ?? "?"}d${this.constructor.DENOMINATION}`;
  }

  /** @override — le total d'un dé narratif n'a pas de sens numérique. */
  get total() {
    return 0;
  }

  /** @override */
  getResultLabel(result) {
    const faces = this.constructor.symbolsFor(result.result);
    const key = this.constructor.KEY;
    const symbols = [...faces].map(ch => symbolHTML(SYMBOLS[ch])).join("");
    return `<span class="swffg-face die-${key}">${symbols}</span>`;
  }

  /** @override */
  getResultCSS(result) {
    return ["swffg-die", `die-${this.constructor.KEY}`, result.active ? null : "discarded"].filter(Boolean);
  }

  /** @override — pas de modificateurs numériques (relances, explosions) sur ces dés. */
  static MODIFIERS = {};
}

export class AbilityDie extends NarrativeDie {
  static DENOMINATION = "a";
  static KEY = "ability";
  static FACES = ["", "s", "s", "ss", "a", "a", "sa", "aa"];
}

export class ProficiencyDie extends NarrativeDie {
  static DENOMINATION = "p";
  static KEY = "proficiency";
  static FACES = ["", "s", "s", "ss", "ss", "a", "sa", "sa", "sa", "aa", "aa", "t"];
}

export class DifficultyDie extends NarrativeDie {
  static DENOMINATION = "i";
  static KEY = "difficulty";
  static FACES = ["", "f", "ff", "h", "h", "h", "hh", "fh"];
}

export class ChallengeDie extends NarrativeDie {
  static DENOMINATION = "c";
  static KEY = "challenge";
  static FACES = ["", "f", "f", "ff", "ff", "h", "h", "fh", "fh", "hh", "hh", "d"];
}

export class BoostDie extends NarrativeDie {
  static DENOMINATION = "b";
  static KEY = "boost";
  static FACES = ["", "", "s", "sa", "aa", "a"];
}

export class SetbackDie extends NarrativeDie {
  static DENOMINATION = "k";
  static KEY = "setback";
  static FACES = ["", "", "f", "f", "h", "h"];
}

export class ForceDie extends NarrativeDie {
  static DENOMINATION = "f";
  static KEY = "force";
  static FACES = ["n", "n", "n", "n", "n", "n", "nn", "l", "l", "ll", "ll", "ll"];
}

export const DICE_CLASSES = [AbilityDie, ProficiencyDie, DifficultyDie, ChallengeDie, BoostDie, SetbackDie, ForceDie];

export function emptyCounts() {
  return { success: 0, advantage: 0, triumph: 0, failure: 0, threat: 0, despair: 0, light: 0, dark: 0 };
}

/** Enregistre les dés dans CONFIG.Dice.terms. */
export function registerDice() {
  for ( const cls of DICE_CLASSES ) {
    CONFIG.Dice.terms[cls.DENOMINATION] = cls;
    // Nécessaire pour recréer les dés à partir des messages de chat enregistrés.
    if ( CONFIG.Dice.termTypes ) CONFIG.Dice.termTypes[cls.name] = cls;
  }
}
