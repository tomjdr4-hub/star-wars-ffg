import { SYSTEM_ID } from "../config.mjs";
import { NarrativeDie, emptyCounts } from "./dice.mjs";

/**
 * Jet de dés narratifs. Le total numérique sert à l'initiative :
 * succès nets, puis avantages nets en départage (chapitre VI).
 *
 * Options reconnues :
 *  - results : symboles ajoutés automatiquement ({ success, advantage… })
 *  - skill, actorUuid, itemUuid : contexte du test
 *  - weapon : { damage, crit, qualities, name } pour un test de combat
 *  - forcePower : true pour un test de pouvoir (seuls les dés de Force comptent)
 *  - darkSide : l'acteur est un adepte du côté obscur (F&D p. 52)
 */
export class NarrativeRoll extends Roll {
  static CHAT_TEMPLATE = `systems/${SYSTEM_ID}/templates/chat/roll.hbs`;

  /** Somme des symboles des dés et des symboles ajoutés. */
  get symbols() {
    const counts = emptyCounts();
    if ( !this._evaluated ) return counts;
    for ( const term of this.dice ) {
      if ( !(term instanceof NarrativeDie) ) continue;
      for ( const [k, v] of Object.entries(term.symbols) ) counts[k] += v;
    }
    for ( const [k, v] of Object.entries(this.options.results ?? {}) ) counts[k] = (counts[k] ?? 0) + (Number(v) || 0);
    return counts;
  }

  /**
   * Résultat net : un triomphe compte aussi comme un succès, un désastre comme un échec ;
   * succès et échecs s'annulent, avantages et menaces aussi. Triomphes et désastres restent.
   */
  get net() {
    const s = this.symbols;
    const success = s.success + s.triumph - s.failure - s.despair;
    const advantage = s.advantage - s.threat;
    return {
      success: Math.max(success, 0),
      failure: Math.max(-success, 0),
      advantage: Math.max(advantage, 0),
      threat: Math.max(-advantage, 0),
      triumph: s.triumph,
      despair: s.despair,
      light: s.light,
      dark: s.dark,
      succeeded: success > 0
    };
  }

  /** Succès nets, puis avantages nets en centièmes (départage de l'initiative). */
  _narrativeTotal() {
    const s = this.symbols;
    const success = s.success + s.triumph - s.failure - s.despair;
    const advantage = s.advantage - s.threat;
    // Initiative : succès nets en partie entière, avantages nets décalés de 50 en centièmes (toujours croissant).
    if ( this.options.initiative ) return encodeInitiative(success, advantage);
    return success + (advantage / 100);
  }

  /** @override */
  _evaluateTotal() {
    return this._narrativeTotal();
  }

  /** @override — V14 ne passe plus forcément par _evaluateTotal : le total est recalculé à la lecture. */
  get total() {
    if ( !this._evaluated ) return undefined;
    return Math.round(this._narrativeTotal() * 100) / 100;
  }

  /** Dégâts infligés si le test de combat réussit : dégâts de l'arme + succès nets. */
  get damage() {
    const w = this.options.weapon;
    if ( !w || !this.net.succeeded ) return null;
    return w.damage + this.net.success;
  }

  /** Points de Force générés (côté lumineux, ou obscur pour un adepte du côté obscur). */
  get forcePoints() {
    const n = this.net;
    return this.options.darkSide ? n.dark : n.light;
  }

  /** Détail des faces pour le message de chat. */
  get faces() {
    const out = [];
    for ( const term of this.dice ) {
      if ( !(term instanceof NarrativeDie) ) continue;
      for ( const r of term.results ) {
        if ( !r.active ) continue;
        out.push({ key: term.constructor.KEY, symbols: [...term.constructor.symbolsFor(r.result)].map(ch => SYMBOL_NAMES[ch]) });
      }
    }
    return out;
  }

  /** @override */
  async render({ flavor, template = this.constructor.CHAT_TEMPLATE, isPrivate = false } = {}) {
    if ( !this._evaluated ) await this.evaluate();
    const net = this.net;
    const weapon = this.options.weapon;
    const context = {
      formula: isPrivate ? "???" : this.formula,
      flavor: isPrivate ? null : (flavor ?? this.options.flavor),
      isPrivate,
      faces: isPrivate ? [] : this.faces,
      net,
      isForce: !!this.options.forcePower,
      forcePoints: this.forcePoints,
      darkSide: !!this.options.darkSide,
      showOutcome: !this.options.forcePower && !this.options.noOutcome,
      recap: isPrivate ? null : recapOf(this.symbols),
      symbolsList: isPrivate ? [] : symbolList(net, !!this.options.forcePower),
      weapon: weapon ? {
        ...weapon,
        damage: this.damage,
        critReady: net.succeeded && ((weapon.crit > 0 && net.advantage >= weapon.crit) || net.triumph > 0)
      } : null
    };
    return foundry.applications.handlebars.renderTemplate(template, context);
  }
}

const SYMBOL_NAMES = { s: "success", a: "advantage", t: "triumph", f: "failure", h: "threat", d: "despair", l: "light", n: "dark" };

/** Liste ordonnée des symboles nets à afficher. */
function symbolList(net, force) {
  const keys = force ? ["light", "dark"] : ["success", "failure", "advantage", "threat", "triumph", "despair", "light", "dark"];
  return keys.filter(k => net[k] > 0).map(k => ({ key: k, count: net[k], icons: Array(Math.min(net[k], 12)).fill(k) }));
}

/** Code une initiative (succès, avantages nets) en un nombre triable ; avantages bornés à ±49. */
export function encodeInitiative(success, advantage) {
  return success + ((Math.clamp(advantage, -49, 49) + 50) / 100);
}

/** Décode une valeur d'initiative en { success, advantage }. */
export function decodeInitiative(value) {
  const success = Math.floor(value + 1e-9);
  return { success, advantage: Math.round((value - success) * 100) - 50 };
}

/**
 * Récapitulatif d'un jet : succès bruts contre échecs bruts, avantages contre menaces.
 * Un triomphe compte aussi comme un succès, un désastre comme un échec (chapitre I).
 */
function recapOf(s) {
  const t = (key, n) => game.i18n.format(`SWFFG.Recap.${key}`, { n });
  const success = s.success + s.triumph;
  const failure = s.failure + s.despair;
  const netS = success - failure;
  const netA = s.advantage - s.threat;
  return {
    success: t(success > 1 ? "successes" : "success", success)
      + (s.triumph ? ` ${game.i18n.format("SWFFG.Recap.withTriumph", { n: s.triumph })}` : ""),
    failure: t(failure > 1 ? "failures" : "failure", failure)
      + (s.despair ? ` ${game.i18n.format("SWFFG.Recap.withDespair", { n: s.despair })}` : ""),
    netSuccess: netS > 0 ? t(netS > 1 ? "netSuccesses" : "netSuccess", netS)
      : netS < 0 ? t(-netS > 1 ? "netFailures" : "netFailure", -netS) : game.i18n.localize("SWFFG.Recap.cancelled"),
    succeeded: netS > 0,
    advantage: t(s.advantage > 1 ? "advantages" : "advantage", s.advantage),
    threat: t(s.threat > 1 ? "threats" : "threat", s.threat),
    netAdvantage: netA > 0 ? t(netA > 1 ? "netAdvantages" : "netAdvantage", netA)
      : netA < 0 ? t(-netA > 1 ? "netThreats" : "netThreat", -netA) : game.i18n.localize("SWFFG.Recap.cancelled"),
    advantageClass: netA > 0 ? "positive" : netA < 0 ? "negative" : ""
  };
}
