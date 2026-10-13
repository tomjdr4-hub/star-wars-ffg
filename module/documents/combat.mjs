import { SKILLS, SYSTEM_ID } from "../config.mjs";
import { DicePool } from "../dice/pool.mjs";
import { NarrativeRoll } from "../dice/roll.mjs";

const { DialogV2 } = foundry.applications.api;

/** Compétences possibles pour l'initiative (chapitre VI) : Calme si l'on s'attend au combat, Vigilance sinon. */
const INITIATIVE_SKILLS = ["cool", "vigilance"];

/**
 * Combat : avant de lancer l'initiative, demande pour chaque combattant s'il utilise Vigilance ou Calme.
 * Passer `initiativeSkills: { [combatantId]: "cool" }` dans les options évite la fenêtre (macros, modules).
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
}

/** Initiative : test de Vigilance ou de Calme, classé par succès puis avantages nets. */
export class SWCombatant extends Combatant {
  /** @override */
  getInitiativeRoll(formula) {
    if ( !this.actor ) return super.getInitiativeRoll(formula);
    const skill = this.parent?._initiativeSkills?.[this.id] ?? game.settings.get(SYSTEM_ID, "initiativeSkill");
    const pool = DicePool.fromSkill(this.actor, skill, { difficulty: 0 }).applyRemovals();
    const flavor = `${game.i18n.localize("SWFFG.Roll.initiative")} (${game.i18n.localize(SKILLS[skill].label)})`;
    return new NarrativeRoll(pool.toFormula(), {}, { flavor, skill });
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
