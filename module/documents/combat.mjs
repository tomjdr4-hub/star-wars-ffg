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
    let quick = options.quickReflexes ?? {};
    if ( !skills ) {
      const combatants = ids.map(id => this.combatants.get(id)).filter(c => c?.isOwner && c.actor);
      if ( combatants.length ) {
        const choice = await chooseInitiativeSkills(combatants);
        if ( !choice ) return this; // fenêtre fermée : rien n'est lancé
        ({ skills, quick } = choice);
      }
    }
    this._initiativeSkills = skills ?? {};
    this._quickReflexes = quick;
    try {
      await super.rollInitiative(ids, options);
    } finally {
      delete this._initiativeSkills;
      delete this._quickReflexes;
    }
    // Réaction éclair : le stress choisi est subi une fois le jet effectué.
    for ( const [id, n] of Object.entries(quick) ) {
      const actor = this.combatants.get(id)?.actor;
      if ( actor && (n > 0) ) await sufferStrain(actor, n);
    }
    return this;
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
    const quick = this.parent?._quickReflexes?.[this.id] ?? 0;
    const results = quick ? { success: quick } : {};
    const label = quick ? ` — ${game.i18n.format("SWFFG.Initiative.quickApplied", { n: quick })}` : "";
    return new NarrativeRoll(pool.toFormula(), {}, { flavor: flavor + label, skill, initiative: true, results });
  }
}

/**
 * Tracker, une fois le combat commencé : il affiche des emplacements et non des personnages (chapitre VI).
 *  - emplacements à venir dans le round : « Emplacement PJ / PNJ » et leur résultat, sans nom ;
 *  - emplacement en cours : les combattants du camp qui n'ont pas encore agi ce round, à choisir d'un clic ;
 *  - emplacements déjà joués : le combattant qui les a occupés.
 * Avant le début du combat, chaque ligne montre le combattant et son résultat.
 */
export function onRenderCombatTracker(app, html) {
  const combat = app.viewed;
  if ( !combat ) return;
  const started = combat.started && (combat.turn !== null);
  const current = started ? combat.combatant : null;
  const candidates = current ? [current, ...combat.claimants] : [];
  for ( const li of html.querySelectorAll("li.combatant[data-combatant-id]") ) {
    const c = combat.combatants.get(li.dataset.combatantId);
    if ( !c ) continue;
    const side = combatantSide(c);
    const index = combat.turns.indexOf(c);
    li.classList.add("swffg-slot", `swffg-slot-${side}`);
    const slotLabel = game.i18n.localize(side === "pc" ? "SWFFG.Initiative.slotPC" : "SWFFG.Initiative.slotNPC");

    const name = li.querySelector(".token-name");
    if ( name && !li.querySelector(".swffg-slot-badge") ) {
      const badge = document.createElement("span");
      badge.className = `swffg-slot-badge ${side}`;
      badge.textContent = slotLabel;
      name.prepend(badge);
    }

    const init = li.querySelector(".token-initiative > span");
    if ( init && Number.isNumeric(c.initiative) ) {
      init.innerHTML = initiativeHTML(c.initiative);
      init.classList.add("swffg-init-value");
    }

    if ( !started || !Number.isNumeric(c.initiative) ) continue;

    // Emplacement à venir : anonyme.
    if ( index > combat.turn ) {
      li.classList.add("swffg-slot-open");
      li.removeAttribute("data-action");
      const img = li.querySelector(".token-image");
      if ( img ) img.src = side === "pc" ? "icons/svg/mystery-man.svg" : "icons/svg/hazard.svg";
      const strong = li.querySelector(".token-name .name");
      if ( strong ) strong.textContent = game.i18n.localize("SWFFG.Initiative.openSlot");
      li.querySelector(".combatant-controls")?.replaceChildren();
      continue;
    }

    // Emplacement en cours : choix du combattant qui agit.
    if ( index === combat.turn ) {
      li.classList.add("swffg-slot-current");
      const chooser = document.createElement("div");
      chooser.className = "swffg-slot-chooser";
      const label = document.createElement("span");
      label.className = "swffg-slot-chooser-label";
      label.textContent = game.i18n.localize("SWFFG.Initiative.whoActs");
      chooser.append(label);
      for ( const cand of candidates ) {
        const can = game.user.isGM || cand.isOwner;
        const chip = document.createElement("button");
        chip.type = "button";
        chip.className = `swffg-slot-chip ${cand === current ? "active" : ""}`;
        chip.disabled = !can;
        chip.dataset.tooltip = cand === current ? game.i18n.localize("SWFFG.Initiative.acting") : game.i18n.localize("SWFFG.Initiative.claim");
        chip.innerHTML = `<img src="${cand.img}" alt=""><span>${foundry.utils.escapeHTML(cand.name)}</span>`;
        chip.addEventListener("click", event => {
          event.preventDefault();
          event.stopPropagation();
          if ( cand !== current ) combat.claimSlot(cand.id);
        });
        chooser.append(chip);
      }
      if ( candidates.length > 1 ) li.append(chooser);
      continue;
    }

    // Emplacement déjà joué ce round.
    li.classList.add("swffg-slot-done");
  }
}

/** Initiative en symboles : succès (ou échecs) nets puis avantages (ou menaces) nets. */
function initiativeHTML(value) {
  const { success, advantage } = decodeInitiative(value);
  const s = success >= 0 ? `${success}${symbolHTML("success")}` : `${-success}${symbolHTML("failure")}`;
  const a = advantage > 0 ? ` ${advantage}${symbolHTML("advantage")}` : advantage < 0 ? ` ${-advantage}${symbolHTML("threat")}` : "";
  return `${s}${a}`;
}

/** Fenêtre de choix : une ligne par combattant, avec boutons pour tout passer en Vigilance ou en Calme. */
async function chooseInitiativeSkills(combatants) {
  const def = game.settings.get(SYSTEM_ID, "initiativeSkill");
  const options = selected => INITIATIVE_SKILLS
    .map(k => `<option value="${k}" ${k === selected ? "selected" : ""}>${game.i18n.localize(SKILLS[k].label)}</option>`).join("");
  const rows = combatants.map(c => {
    const rank = quickReflexesRank(c.actor);
    const quick = rank
      ? `<label class="swffg-init-quick" data-tooltip="${game.i18n.localize("SWFFG.Initiative.quickHint")}">
          ${game.i18n.localize("SWFFG.Initiative.quick")}
          <input type="number" name="quick-${c.id}" value="0" min="0" max="${rank}"> / ${rank}</label>`
      : "";
    return `<div class="swffg-init-row">
      <img src="${c.img}" width="28" height="28">
      <span>${foundry.utils.escapeHTML(c.name)}${quick}</span>
      <select name="${c.id}">${options(def)}</select>
    </div>`;
  }).join("");
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
      callback: (event, button) => {
        const form = button.form;
        const skills = Object.fromEntries([...form.querySelectorAll("select")].map(s => [s.name, s.value]));
        const quick = {};
        for ( const input of form.querySelectorAll("input[name^='quick-']") ) {
          const id = input.name.slice(6);
          const max = Number(input.max) || 0;
          const n = Math.clamp(Number(input.value) || 0, 0, max);
          if ( n ) quick[id] = n;
        }
        return { skills, quick };
      }
    },
    render: (event, dialog) => {
      const html = dialog.element ?? dialog;
      for ( const b of html.querySelectorAll("[data-swffg-all]") ) {
        b.addEventListener("click", () => html.querySelectorAll(".swffg-init-list select").forEach(s => s.value = b.dataset.swffgAll));
      }
    }
  });
}

/** Rang du talent Réaction éclair d'un acteur (0 s'il ne l'a pas). */
function quickReflexesRank(actor) {
  const t = actor?.itemTypes.talent.find(i => i.name.normalize("NFC").toLowerCase() === "réaction éclair");
  return t ? Math.max(t.system.ranked ? t.system.rank : 1, 1) : 0;
}

/** Stress subi : les rivaux et sbires n'ont pas de seuil de stress, le stress devient des blessures (chapitre VI). */
async function sufferStrain(actor, n) {
  if ( ["character", "nemesis"].includes(actor.type) ) return actor.update({ "system.strain.value": actor.system.strain.value + n });
  if ( ["rival", "minion"].includes(actor.type) ) return actor.update({ "system.wounds.value": actor.system.wounds.value + n });
}

/** Les vaisseaux et véhicules n'ont pas d'initiative : ce sont les membres d'équipage qui agissent (chapitre VII). */
export function onPreCreateCombatant(combatant, data, options, userId) {
  const actor = combatant.actor ?? game.actors.get(data.actorId);
  if ( actor?.type !== "vehicle" ) return;
  if ( userId === game.user.id ) {
    ui.notifications.warn(game.i18n.format("SWFFG.Initiative.noVehicle", { name: actor.name }));
  }
  return false;
}
