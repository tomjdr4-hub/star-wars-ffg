import { SKILLS, SYSTEM_ID } from "../config.mjs";
import { DicePool } from "../dice/pool.mjs";
import { RollDialog, rollPool } from "../apps/roll-dialog.mjs";

export class SWActor extends Actor {
  /** Nom localisé d'une compétence. */
  static skillLabel(key) {
    return game.i18n.localize(SKILLS[key]?.label ?? key);
  }

  /** Réserve de base d'un test de compétence. */
  getSkillPool(skillKey, { difficulty = 2 } = {}) {
    return DicePool.fromSkill(this, skillKey, { difficulty });
  }

  /**
   * Test de compétence : ouvre la fenêtre de réserve, sauf si `skipDialog`.
   * @returns {Promise<ChatMessage|null>}
   */
  async rollSkill(skillKey, { difficulty = 2, skipDialog = false, flavor, rollOptions = {}, pool } = {}) {
    if ( !SKILLS[skillKey] ) {
      ui.notifications.warn(game.i18n.format("SWFFG.Notify.noSkill", { skill: skillKey }));
      return null;
    }
    pool ??= this.getSkillPool(skillKey, { difficulty });
    const title = flavor ?? SWActor.skillLabel(skillKey);
    const opts = { skill: skillKey, ...rollOptions };
    if ( skipDialog ) return rollPool(pool.applyRemovals(), { ...opts, actor: this, flavor: title });
    return RollDialog.prompt({ pool, actor: this, title, rollOptions: opts, notes: this.#talentNotes(skillKey) });
  }

  /** Test d'attaque avec une arme possédée. */
  async rollWeapon(item, { difficulty = 2, skipDialog = false } = {}) {
    // Arme de vaisseau : le test est fait par le personnage du joueur (assigné ou jeton contrôlé).
    if ( this.type === "vehicle" ) {
      const gunner = canvas?.tokens?.controlled.find(t => t.actor && (t.actor.type !== "vehicle"))?.actor ?? game.user.character;
      if ( !gunner ) return ui.notifications.warn(game.i18n.localize("SWFFG.Sheet.noActor"));
      return gunner.rollWeapon(item, { difficulty, skipDialog });
    }
    const w = item.system;
    const pool = this.getSkillPool(w.skill, { difficulty });
    // Précis : un dé de fortune par rang ; Imprécis : un dé d'infortune par rang.
    for ( const q of w.qualities ) {
      if ( q.key === "accurate" ) pool.boost += q.rank;
      if ( q.key === "inaccurate" ) pool.setback += q.rank;
    }
    const brawn = this.system.characteristics?.brawn?.total ?? 0;
    const weapon = {
      name: item.name,
      damage: w.damage + (w.addBrawn ? brawn : 0),
      crit: w.crit,
      qualities: w.qualitiesLabel,
      vehicle: w.vehicle.enabled
    };
    const title = `${item.name} — ${SWActor.skillLabel(w.skill)}`;
    const rollOptions = { skill: w.skill, itemUuid: item.uuid, weapon };
    if ( skipDialog ) return rollPool(pool.applyRemovals(), { ...rollOptions, actor: this, flavor: title });
    return RollDialog.prompt({ pool, actor: this, title, rollOptions, notes: this.#talentNotes(w.skill) });
  }

  /**
   * Test de pouvoir de la Force : autant de dés de Force que la Valeur de Force non engagée.
   * Un adepte du côté obscur génère ses points de Force avec les résultats obscurs (F&D p. 52).
   */
  async rollForcePower(item = null, { skipDialog = false } = {}) {
    const rating = this.system.forceRating?.available ?? this.system.forceRating?.total ?? 0;
    const pool = new DicePool({ force: rating });
    const darkSide = !!this.system.morality?.isDark;
    const title = item ? item.name : game.i18n.localize("SWFFG.Sheet.forceRating");
    const rollOptions = { forcePower: true, darkSide, itemUuid: item?.uuid };
    if ( skipDialog ) return rollPool(pool, { ...rollOptions, actor: this, flavor: title });
    return RollDialog.prompt({ pool, actor: this, title, rollOptions });
  }

  /** Rappels des talents actifs (non passifs) qui citent la compétence dans leur description. */
  #talentNotes(skillKey) {
    const label = SWActor.skillLabel(skillKey).toLowerCase();
    return this.itemTypes.talent
      .filter(t => (t.system.activation !== "passive") || !t.system.modifiers.length)
      .filter(t => t.system.description.toLowerCase().includes(label))
      .map(t => ({ name: t.name, uuid: t.uuid }));
  }

  /**
   * Fin de session de Force et Destinée : 1d10 comparé au Conflit accumulé, puis remise à zéro (F&D p. 51).
   * Moralité déclenchée (règle optionnelle) : l'écart est doublé.
   */
  async resolveConflict({ triggered = false } = {}) {
    if ( this.type !== "character" ) return null;
    const m = this.system.morality;
    const roll = await new Roll("1d10").evaluate();
    let delta = roll.total - m.conflict;
    if ( triggered ) delta *= 2;
    const value = Math.clamp(m.value + delta, 0, 100);
    const update = { "system.morality.value": value, "system.morality.conflict": 0 };
    // Statut collant : sous 30 on devient adepte du côté obscur, au-dessus de 70 on est racheté.
    if ( value < 30 ) update["system.morality.darkSide"] = true;
    else if ( value > 70 ) update["system.morality.darkSide"] = false;
    await this.update(update);
    const content = game.i18n.format("SWFFG.Sheet.moralityRoll", {
      conflict: m.conflict, roll: roll.total, sign: delta >= 0 ? "+" : "", delta, morality: value
    });
    return roll.toMessage({ speaker: ChatMessage.implementation.getSpeaker({ actor: this }), flavor: content });
  }

  /** Les sbires partagent leurs blessures : le groupe perd un membre par seuil individuel dépassé. */
  get isMinion() {
    return this.type === "minion";
  }
}
