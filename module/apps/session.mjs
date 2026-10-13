import { SYSTEM_ID } from "../config.mjs";

/**
 * Jet de début de session : un seul d100 comparé aux tables d'Obligation, de Devoir et à la liste des Moralités
 * (F&D p. 339). Effets :
 *  - Obligation (AoE p. 41) : seuil de stress de tous les PJ -1, -2 au total pour le PJ concerné ; doublés sur un double.
 *  - Devoir (EdR p. 47) : seuil de blessure de tous les PJ +1, +2 au total pour le PJ concerné ; doublés sur un double.
 *  - Moralité déclenchée (F&D p. 323, optionnelle) : PJ dont la Moralité est la plus proche du résultat.
 * Les tables ne tiennent compte que des PJ qui utilisent la mécanique concernée (F&D p. 339).
 */
export async function rollSessionStart({ characters } = {}) {
  if ( !game.user.isGM ) return ui.notifications.warn(game.i18n.localize("SWFFG.Notify.gmOnly"));
  characters ??= game.actors.filter(a => (a.type === "character") && a.hasPlayerOwner);
  const roll = await new Roll("1d100").evaluate();
  const result = roll.total;
  const doubled = (result % 11 === 0) || (result === 100);

  const table = (list) => {
    // Plus grande valeur en premier (EdR p. 48), intervalles cumulés.
    const rows = list.flatMap(({ actor, entries }) => entries.map(e => ({ actor, ...e })))
      .filter(r => r.value > 0)
      .sort((a, b) => b.value - a.value);
    let acc = 0;
    for ( const r of rows ) { r.min = acc + 1; acc += r.value; r.max = acc; }
    return { rows, total: acc, hit: rows.find(r => (result >= r.min) && (result <= r.max)) ?? null };
  };

  const obligation = table(characters.filter(a => a.system.activeMechanics.obligation)
    .map(actor => ({ actor, entries: actor.system.obligations })));
  const duty = table(characters.filter(a => a.system.activeMechanics.duty)
    .map(actor => ({ actor, entries: actor.system.duties })));
  const moralityUsers = characters.filter(a => a.system.activeMechanics.morality);
  const moralityHit = moralityUsers.length && game.settings.get(SYSTEM_ID, "triggerMorality")
    ? moralityUsers.reduce((best, a) => Math.abs(a.system.morality.value - result) < Math.abs(best.system.morality.value - result) ? a : best)
    : null;

  const k = doubled ? 2 : 1;
  const effects = { result, doubled, obligation: null, duty: null, morality: moralityHit?.uuid ?? null };
  const lines = [];
  if ( obligation.hit ) {
    effects.obligation = { uuid: obligation.hit.actor.uuid, all: k, one: 2 * k };
    lines.push(game.i18n.format("SWFFG.Session.obligationTriggered", { name: obligation.hit.actor.name, type: obligation.hit.type }));
    lines.push(game.i18n.format("SWFFG.Session.obligationEffect", { all: k, one: 2 * k, name: obligation.hit.actor.name }));
  }
  if ( duty.hit ) {
    effects.duty = { uuid: duty.hit.actor.uuid, all: k, one: 2 * k };
    lines.push(game.i18n.format("SWFFG.Session.dutyTriggered", { name: duty.hit.actor.name, type: duty.hit.type }));
    lines.push(game.i18n.format("SWFFG.Session.dutyEffect", { all: k, one: 2 * k, name: duty.hit.actor.name }));
  }
  if ( moralityHit ) lines.push(game.i18n.format("SWFFG.Session.moralityTriggered", { name: moralityHit.name }));
  if ( !lines.length ) lines.push(game.i18n.localize("SWFFG.Session.nothing"));
  if ( doubled && (obligation.hit || duty.hit) ) lines.unshift(game.i18n.localize("SWFFG.Session.doubled"));

  // Un contenu HTML remplace l'affichage standard du jet : on y rappelle donc le résultat du d100.
  const content = `<div class="${SYSTEM_ID} session-card">
    <p class="session-roll">d100 = <strong>${result}</strong></p>
    <ul>${lines.map(l => `<li>${l}</li>`).join("")}</ul>
    <button type="button" data-swffg-session-apply>${game.i18n.localize("SWFFG.Session.apply")}</button>
  </div>`;
  return roll.toMessage({
    flavor: game.i18n.localize("SWFFG.Session.title"),
    content,
    whisper: ChatMessage.implementation.getWhisperRecipients("GM"),
    flags: { [SYSTEM_ID]: { session: effects } }
  });
}

/** Applique aux fiches les effets d'un jet de début de session (remplace les effets précédents). */
export async function applySessionEffects(effects, characters) {
  characters ??= game.actors.filter(a => (a.type === "character") && a.hasPlayerOwner);
  const updates = characters.map(a => {
    let strain = 0, wound = 0;
    if ( effects.obligation && a.system.activeMechanics.obligation ) {
      strain = a.uuid === effects.obligation.uuid ? effects.obligation.one : effects.obligation.all;
    }
    if ( effects.duty && a.system.activeMechanics.duty ) {
      wound = a.uuid === effects.duty.uuid ? effects.duty.one : effects.duty.all;
    }
    return { _id: a.id, "system.session.strainThreshold": strain, "system.session.woundThreshold": wound };
  });
  await Actor.implementation.updateDocuments(updates);
  ui.notifications.info(game.i18n.localize("SWFFG.Session.applied"));
}

export async function clearSessionEffects() {
  const updates = game.actors.filter(a => a.type === "character")
    .map(a => ({ _id: a.id, "system.session.strainThreshold": 0, "system.session.woundThreshold": 0 }));
  await Actor.implementation.updateDocuments(updates);
  ui.notifications.info(game.i18n.localize("SWFFG.Session.cleared"));
}

/** Bouton « Appliquer » des cartes de session dans le chat. */
export function onRenderSessionCard(message, html) {
  const button = html.querySelector("[data-swffg-session-apply]");
  if ( !button ) return;
  if ( !game.user.isGM ) return button.remove();
  button.addEventListener("click", () => applySessionEffects(message.getFlag(SYSTEM_ID, "session")));
}
