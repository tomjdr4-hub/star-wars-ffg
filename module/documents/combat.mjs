import { SKILLS, SYSTEM_ID } from "../config.mjs";
import { DicePool } from "../dice/pool.mjs";
import { NarrativeRoll, decodeInitiative } from "../dice/roll.mjs";
import { symbolHTML } from "../helpers.mjs";

const { DialogV2 } = foundry.applications.api;

/** Compétences possibles pour l'initiative (chapitre VI) : Calme si l'on s'attend au combat, Vigilance sinon. */
const INITIATIVE_SKILLS = ["cool", "vigilance"];

/** Camp d'un combattant : « pc » (personnage joueur) ou « npc ». */
export function combatantSide(combatant) {
  const actor = combatant.actor;
  if ( !actor ) return "npc";
  return (actor.type === "character") || actor.hasPlayerOwner ? "pc" : "npc";
}

/**
 * Combat selon le chapitre VI :
 *  - les résultats d'initiative forment des emplacements PJ et PNJ, classés par succès puis avantages ;
 *    en cas d'égalité, l'emplacement PJ passe avant l'emplacement PNJ ;
 *  - à chaque emplacement, n'importe quel combattant du camp concerné qui n'a pas encore agi ce round peut le prendre
 *    (claimSlot) : il échange sa place avec le combattant prévu, qui garde l'emplacement libéré pour plus tard.
 *    Les emplacements restent les mêmes d'un round à l'autre.
 */
export class SWCombat extends Combat {
  /** @override */
  async rollInitiative(ids, options = {}) {
    ids = typeof ids === "string" ? [ids] : ids;
    let skills = options.initiativeSkills;
    if ( !skills ) {
      const combatants = ids.map(id => this.combatants.get(id)).filter(c => c?.isOwner && c.actor);
      if ( combatants.length ) {
        skills = await chooseInitiativeSkills(combatants);
        if ( !skills ) return this; // fenêtre fermée : rien n'est lancé
      }
    }
    this._initiativeSkills = skills ?? {};
    try {
      return await super.rollInitiative(ids, options);
    } finally {
      delete this._initiativeSkills;
    }
  }

  /** @override — initiative décroissante, égalité : PJ avant PNJ, puis ordre d'emplacement mémorisé. */
  _sortCombatants(a, b) {
    const ia = Number.isNumeric(a.initiative) ? a.initiative : -Infinity;
    const ib = Number.isNumeric(b.initiative) ? b.initiative : -Infinity;
    if ( ib !== ia ) return ib - ia;
    const sa = combatantSide(a) === "pc" ? 0 : 1;
    const sb = combatantSide(b) === "pc" ? 0 : 1;
    if ( sa !== sb ) return sa - sb;
    const oa = a.getFlag(SYSTEM_ID, "slotOrder") ?? 0;
    const ob = b.getFlag(SYSTEM_ID, "slotOrder") ?? 0;
    return (oa - ob) || (a.id > b.id ? 1 : -1);
  }

  /** Combattants pouvant prendre l'emplacement en cours : même camp, pas encore agi ce round, pas vaincus. */
  get claimants() {
    if ( !this.started || (this.turn === null) ) return [];
    const current = this.combatant;
    if ( !current ) return [];
    const side = combatantSide(current);
    return this.turns.slice(this.turn + 1)
      .filter(c => (combatantSide(c) === side) && !c.isDefeated && Number.isNumeric(c.initiative));
  }

  /**
   * Le combattant indiqué prend l'emplacement en cours : il échange initiative et ordre avec le combattant prévu.
   * Les joueurs passent par le MJ actif (ils ne peuvent pas modifier les combattants des autres).
   */
  async claimSlot(combatantId) {
    if ( !game.user.isGM ) {
      game.socket.emit(`system.${SYSTEM_ID}`, { action: "claimSlot", combatId: this.id, combatantId, userId: game.user.id });
      return;
    }
    const claimant = this.combatants.get(combatantId);
    const current = this.combatant;
    if ( !claimant || !current || (claimant === current) ) return;
    if ( !this.claimants.includes(claimant) ) {
      return ui.notifications.warn(game.i18n.localize("SWFFG.Initiative.cannotClaim"));
    }
    const oc = current.getFlag(SYSTEM_ID, "slotOrder") ?? 0;
    const ol = claimant.getFlag(SYSTEM_ID, "slotOrder") ?? 0;
    await this.updateEmbeddedDocuments("Combatant", [
      { _id: current.id, initiative: claimant.initiative, [`flags.${SYSTEM_ID}.slotOrder`]: ol },
      { _id: claimant.id, initiative: current.initiative, [`flags.${SYSTEM_ID}.slotOrder`]: oc }
    ], { turnEvents: false });
    // Le tour reste sur le même emplacement, désormais occupé par le nouveau combattant.
    const turn = this.turns.findIndex(c => c.id === claimant.id);
    if ( turn !== this.turn ) await this.update({ turn }, { turnEvents: false });
  }

  /** Socket : seul le MJ actif traite les demandes des joueurs. */
  static onSocket(data) {
    if ( (data?.action !== "claimSlot") || !game.user.isActiveGM ) return;
    const combat = game.combats.get(data.combatId);
    const claimant = combat?.combatants.get(data.combatantId);
    const user = game.users.get(data.userId);
    if ( !claimant || !user || !claimant.testUserPermission(user, "OWNER") ) return;
    combat.claimSlot(data.combatantId);
  }
}

/** Initiative : test de Vigilance ou de Calme, classé par succès puis avantages nets. */
export class SWCombatant extends Combatant {
  /** @override */
  getInitiativeRoll(formula) {
    if ( !this.actor ) return super.getInitiativeRoll(formula);
    const skill = this.parent?._initiativeSkills?.[this.id] ?? game.settings.get(SYSTEM_ID, "initiativeSkill");
    const pool = DicePool.fromSkill(this.actor, skill, { difficulty: 0 }).applyRemovals();
    const flavor = `${game.i18n.localize("SWFFG.Roll.initiative")} (${game.i18n.localize(SKILLS[skill].label)})`;
    return new NarrativeRoll(pool.toFormula(), {}, { flavor, skill, initiative: true });
  }
}

/**
 * Tracker : affichage des emplacements PJ / PNJ, de l'initiative en succès / avantages,
 * et bouton « Prendre cet emplacement » pour les combattants du camp en cours qui n'ont pas encore agi.
 */
export function onRenderCombatTracker(app, html) {
  const combat = app.viewed;
  if ( !combat ) return;
  const claimants = new Set(combat.claimants.map(c => c.id));
  for ( const li of html.querySelectorAll("li.combatant[data-combatant-id]") ) {
    const c = combat.combatants.get(li.dataset.combatantId);
    if ( !c ) continue;
    const side = combatantSide(c);
    li.classList.add("swffg-slot", `swffg-slot-${side}`);

    const name = li.querySelector(".token-name");
    if ( name && !li.querySelector(".swffg-slot-badge") ) {
      const badge = document.createElement("span");
      badge.className = `swffg-slot-badge ${side}`;
      badge.textContent = game.i18n.localize(side === "pc" ? "SWFFG.Initiative.slotPC" : "SWFFG.Initiative.slotNPC");
      name.prepend(badge);
    }

    const init = li.querySelector(".token-initiative > span");
    if ( init && Number.isNumeric(c.initiative) ) {
      const { success, advantage } = decodeInitiative(c.initiative);
      const s = success >= 0 ? `${success}${symbolHTML("success")}` : `${-success}${symbolHTML("failure")}`;
      const a = advantage > 0 ? ` ${advantage}${symbolHTML("advantage")}` : advantage < 0 ? ` ${-advantage}${symbolHTML("threat")}` : "";
      init.innerHTML = `${s}${a}`;
      init.classList.add("swffg-init-value");
    }

    if ( claimants.has(c.id) && (game.user.isGM || c.isOwner) ) {
      const controls = li.querySelector(".combatant-controls");
      const btn = document.createElement("button");
      btn.type = "button";
      btn.className = "inline-control combatant-control icon fa-solid fa-hand swffg-claim";
      btn.dataset.tooltip = game.i18n.localize("SWFFG.Initiative.claim");
      btn.setAttribute("aria-label", btn.dataset.tooltip);
      btn.addEventListener("click", event => {
        event.preventDefault();
        event.stopPropagation();
        combat.claimSlot(c.id);
      });
      controls?.prepend(btn);
    }
  }
}

/** Fenêtre de choix : une ligne par combattant, avec boutons pour tout passer en Vigilance ou en Calme. */
async function chooseInitiativeSkills(combatants) {
  const def = game.settings.get(SYSTEM_ID, "initiativeSkill");
  const options = selected => INITIATIVE_SKILLS
    .map(k => `<option value="${k}" ${k === selected ? "selected" : ""}>${game.i18n.localize(SKILLS[k].label)}</option>`).join("");
  const rows = combatants.map(c => `<div class="swffg-init-row">
      <img src="${c.img}" width="28" height="28">
      <span>${foundry.utils.escapeHTML(c.name)}</span>
      <select name="${c.id}">${options(def)}</select>
    </div>`).join("");
  const content = `<p class="hint">${game.i18n.localize("SWFFG.Initiative.hint")}</p>
    <div class="swffg-init-all">
      <button type="button" data-swffg-all="vigilance">${game.i18n.localize("SWFFG.Initiative.allVigilance")}</button>
      <button type="button" data-swffg-all="cool">${game.i18n.localize("SWFFG.Initiative.allCool")}</button>
    </div>
    <div class="swffg-init-list">${rows}</div>`;
  return DialogV2.prompt({
    window: { title: game.i18n.localize("SWFFG.Initiative.title") },
    classes: [SYSTEM_ID, "initiative-dialog"],
    content,
    rejectClose: false,
    ok: {
      label: game.i18n.localize("SWFFG.Roll.roll"),
      icon: "fa-solid fa-dice",
      callback: (event, button) => Object.fromEntries([...button.form.querySelectorAll("select")].map(s => [s.name, s.value]))
    },
    render: (event, dialog) => {
      const html = dialog.element ?? dialog;
      for ( const b of html.querySelectorAll("[data-swffg-all]") ) {
        b.addEventListener("click", () => html.querySelectorAll(".swffg-init-list select").forEach(s => s.value = b.dataset.swffgAll));
      }
    }
  });
}
