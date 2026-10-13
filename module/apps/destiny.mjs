import { SYSTEM_ID } from "../config.mjs";
import { NarrativeRoll } from "../dice/roll.mjs";

const { ApplicationV2, HandlebarsApplicationMixin } = foundry.applications.api;

/**
 * Réserve de points de Destin (chapitre I, « Points de Destin »).
 * Stockée dans un réglage du monde ; les joueurs passent par le MJ actif (socket) pour retourner un point.
 *  - Un joueur retourne un point lumineux (il devient obscur) ;
 *  - le MJ retourne un point obscur (il devient lumineux).
 */
export class DestinyPool extends HandlebarsApplicationMixin(ApplicationV2) {
  static DEFAULT_OPTIONS = {
    id: "swffg-destiny",
    classes: [SYSTEM_ID, "destiny-pool"],
    position: { width: 280, height: "auto", top: 80, left: 120 },
    window: { title: "SWFFG.Destiny.title", resizable: false, minimizable: true },
    actions: {
      flip: DestinyPool.#onFlip,
      adjust: DestinyPool.#onAdjust,
      generate: DestinyPool.#onGenerate
    }
  };

  static PARTS = {
    pool: { template: `systems/${SYSTEM_ID}/templates/apps/destiny.hbs` }
  };

  static get value() {
    return game.settings.get(SYSTEM_ID, "destiny");
  }

  /** @override */
  async _prepareContext() {
    const { light, dark } = DestinyPool.value;
    return {
      light: Array(light).fill(0),
      dark: Array(dark).fill(0),
      lightCount: light,
      darkCount: dark,
      isGM: game.user.isGM
    };
  }

  static async #onFlip(event, target) {
    return DestinyPool.flip(target.dataset.side);
  }

  static async #onAdjust(event, target) {
    if ( !game.user.isGM ) return;
    const { side, delta } = target.dataset;
    const v = { ...DestinyPool.value };
    v[side] = Math.max(v[side] + Number(delta), 0);
    return game.settings.set(SYSTEM_ID, "destiny", v);
  }

  /** Chaque joueur lance un dé de Force : chaque résultat lumineux ou obscur ajoute un point de ce côté. */
  static async #onGenerate() {
    if ( !game.user.isGM ) return;
    const players = game.users.filter(u => !u.isGM && u.character);
    const n = Math.max(players.length, 1);
    const roll = await new NarrativeRoll(`${n}df`, {}, { forcePower: true, noOutcome: true }).evaluate();
    const { light, dark } = roll.symbols;
    // Parangons du côté lumineux : +1 point lumineux ; adeptes du côté obscur : un point lumineux devient obscur (F&D p. 52-53).
    let l = light, d = dark;
    for ( const u of players ) {
      const m = u.character.system.morality;
      if ( !u.character.system.activeMechanics?.morality ) continue;
      if ( m?.isParagon ) l += 1;
      if ( m?.isDark && l > 0 ) { l -= 1; d += 1; }
    }
    await game.settings.set(SYSTEM_ID, "destiny", { light: l, dark: d });
    return roll.toMessage({ flavor: game.i18n.localize("SWFFG.Destiny.generate") });
  }

  /** Retourne un point : `light` (joueur) ou `dark` (MJ). Les joueurs passent par le MJ actif. */
  static async flip(side) {
    if ( !game.user.isGM && (side === "dark") ) return;
    if ( !game.user.isGM ) {
      game.socket.emit(`system.${SYSTEM_ID}`, { action: "flipDestiny", side, userId: game.user.id });
      return;
    }
    return DestinyPool.#applyFlip(side, game.user.id);
  }

  static async #applyFlip(side, userId) {
    const v = { ...DestinyPool.value };
    const other = side === "light" ? "dark" : "light";
    if ( v[side] <= 0 ) return ui.notifications.warn(game.i18n.localize("SWFFG.Destiny.none"));
    v[side] -= 1;
    v[other] += 1;
    await game.settings.set(SYSTEM_ID, "destiny", v);
    const user = game.users.get(userId);
    const key = side === "light" ? "SWFFG.Destiny.flippedLight" : "SWFFG.Destiny.flippedDark";
    return ChatMessage.implementation.create({ content: game.i18n.format(key, { user: user?.name ?? "?" }), speaker: { alias: game.i18n.localize("SWFFG.Destiny.title") } });
  }

  /** Socket : seul le MJ actif traite les demandes des joueurs. */
  static onSocket(data) {
    if ( (data?.action !== "flipDestiny") || !game.user.isActiveGM ) return;
    DestinyPool.#applyFlip(data.side, data.userId);
  }

  static toggle() {
    const app = foundry.applications.instances.get("swffg-destiny") ?? new DestinyPool();
    if ( app.rendered ) return app.close();
    return app.render({ force: true });
  }
}
