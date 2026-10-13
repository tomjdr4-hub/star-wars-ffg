import { DIFFICULTIES, POOL_KEYS, RESULT_KEYS, SYSTEM_ID } from "../config.mjs";
import { DicePool } from "../dice/pool.mjs";
import { NarrativeRoll } from "../dice/roll.mjs";

const { ApplicationV2, HandlebarsApplicationMixin } = foundry.applications.api;

/**
 * Fenêtre de constitution de la réserve de dés avant un test.
 * Le joueur peut ajouter / retirer chaque type de dé, améliorer ou dégrader, choisir la difficulté.
 */
export class RollDialog extends HandlebarsApplicationMixin(ApplicationV2) {
  constructor({ pool, actor = null, title = "", rollOptions = {}, notes = [] } = {}, options = {}) {
    super(options);
    this.pool = pool instanceof DicePool ? pool : new DicePool(pool);
    this.actor = actor;
    this.rollTitle = title;
    this.rollOptions = rollOptions;
    this.notes = notes;
    this.flavor = title;
  }

  static DEFAULT_OPTIONS = {
    tag: "form",
    classes: [SYSTEM_ID, "roll-dialog"],
    position: { width: 460, height: "auto" },
    window: { title: "SWFFG.Roll.title", resizable: false },
    form: { handler: RollDialog.#onSubmit, closeOnSubmit: true },
    actions: {
      addDie: RollDialog.#onAddDie,
      removeDie: RollDialog.#onRemoveDie,
      upgrade: RollDialog.#onUpgrade,
      setDifficulty: RollDialog.#onSetDifficulty,
      addResult: RollDialog.#onAddResult,
      removeResult: RollDialog.#onRemoveResult
    }
  };

  static PARTS = {
    form: { template: `systems/${SYSTEM_ID}/templates/dice/roll-dialog.hbs` }
  };

  get title() {
    return this.rollTitle || game.i18n.localize("SWFFG.Roll.title");
  }

  /** @override */
  async _prepareContext(options) {
    const pool = this.pool;
    return {
      dice: POOL_KEYS.map(k => ({ key: k, count: pool[k], label: `SWFFG.Dice.${k}`, icons: Array(pool[k]).fill(k) })),
      results: RESULT_KEYS.filter(k => !["light", "dark"].includes(k)).map(k => ({ key: k, count: pool.results[k], label: `SWFFG.Result.${k}` })),
      difficulties: Object.entries(DIFFICULTIES).map(([n, label]) => ({ n: Number(n), label, active: (pool.difficulty + pool.challenge) === Number(n) })),
      removeSetback: pool.removeSetback ?? 0,
      formula: pool.toFormula(),
      flavor: this.flavor,
      notes: this.notes
    };
  }

  /** @override */
  _onRender(context, options) {
    super._onRender(context, options);
    this.element.querySelector("[name=flavor]")?.addEventListener("change", ev => this.flavor = ev.target.value);
  }

  static #onAddDie(event, target) {
    this.pool[target.dataset.die] += 1;
    this.render();
  }

  static #onRemoveDie(event, target) {
    const k = target.dataset.die;
    this.pool[k] = Math.max(this.pool[k] - 1, 0);
    this.render();
  }

  static #onUpgrade(event, target) {
    const p = this.pool;
    switch ( target.dataset.kind ) {
      case "ability": p.upgradeAbility(1); break;
      case "difficulty": p.upgradeDifficulty(1); break;
      case "downAbility": p.downgradeAbility(1); break;
      case "downDifficulty": p.downgradeDifficulty(1); break;
    }
    this.render();
  }

  /** Fixe le nombre de dés de difficulté ; les dés de défi déjà présents comptent dans la difficulté. */
  static #onSetDifficulty(event, target) {
    const n = Number(target.dataset.n);
    this.pool.difficulty = Math.max(n - this.pool.challenge, 0);
    if ( n < this.pool.challenge ) this.pool.challenge = n;
    this.render();
  }

  static #onAddResult(event, target) {
    this.pool.results[target.dataset.result] += 1;
    this.render();
  }

  static #onRemoveResult(event, target) {
    const k = target.dataset.result;
    this.pool.results[k] = Math.max(this.pool.results[k] - 1, 0);
    this.render();
  }

  static async #onSubmit(event, form, formData) {
    this.flavor = formData.object.flavor ?? this.flavor;
    this.pool.applyRemovals();
    const message = await rollPool(this.pool, { ...this.rollOptions, flavor: this.flavor, actor: this.actor });
    this._resolve?.(message);
  }

  /** Ouvre la fenêtre et renvoie une promesse résolue avec le message de chat (ou null si annulé). */
  static async prompt(config) {
    const app = new this(config);
    return new Promise(resolve => {
      app._resolve = resolve;
      app.addEventListener?.("close", () => resolve(null), { once: true });
      app.render({ force: true });
    });
  }
}

/**
 * Lance une réserve et publie le résultat dans le chat.
 * @param {DicePool} pool
 * @param {object} options  flavor, actor, weapon, forcePower, darkSide, skill, results…
 */
export async function rollPool(pool, { actor = null, flavor = "", ...options } = {}) {
  const roll = new NarrativeRoll(pool.toFormula(), {}, {
    ...options,
    flavor,
    results: { ...pool.results, ...(options.results ?? {}) },
    actorUuid: actor?.uuid
  });
  await roll.evaluate();
  const speaker = ChatMessage.implementation.getSpeaker({ actor });
  // Le mode de jet (public, MJ, privé…) est celui choisi dans le chat.
  return roll.toMessage({ speaker, flavor });
}
