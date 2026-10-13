import { SWFFG, SKILLS, SKILL_TYPES, SYSTEM_ID, activeBooks } from "../config.mjs";
import { cellCost, isReachable, skillRankCost } from "../talent-tree.mjs";
import { DestinyPool } from "../apps/destiny.mjs";

const { HandlebarsApplicationMixin } = foundry.applications.api;
const { ActorSheetV2 } = foundry.applications.sheets;
const TextEditor = () => foundry.applications.ux.TextEditor.implementation;

/**
 * Base commune à toutes les fiches d'acteur : onglets, actions de jet et gestion des objets.
 * Les tableaux (Obligations, Devoirs, Motivations…) et les champs des objets intégrés
 * sont édités via des attributs data-* et enregistrés en entier, pour éviter les mises à jour partielles de tableaux.
 */
class SWActorSheet extends HandlebarsApplicationMixin(ActorSheetV2) {
  static DEFAULT_OPTIONS = {
    classes: [SYSTEM_ID, "sheet", "actor"],
    position: { width: 820, height: 760 },
    window: { resizable: true },
    form: { submitOnChange: true },
    actions: {
      rollSkill: SWActorSheet.#onRollSkill,
      rollWeapon: SWActorSheet.#onRollWeapon,
      rollForce: SWActorSheet.#onRollForce,
      itemCreate: SWActorSheet.#onItemCreate,
      itemEdit: SWActorSheet.#onItemEdit,
      itemDelete: SWActorSheet.#onItemDelete,
      itemToggle: SWActorSheet.#onItemToggle,
      itemChat: SWActorSheet.#onItemChat,
      adjust: SWActorSheet.#onAdjust,
      entryAdd: SWActorSheet.#onEntryAdd,
      entryRemove: SWActorSheet.#onEntryRemove,
      learnTalent: SWActorSheet.#onLearnTalent,
      buySkill: SWActorSheet.#onBuySkill,
      destiny: () => DestinyPool.toggle()
    }
  };

  /** Construit la configuration d'onglets V13+ à partir d'une liste d'identifiants. */
  static tabsFor(ids) {
    return { primary: { tabs: ids.map(id => ({ id, label: `SWFFG.Sheet.${id}` })), initial: ids[0] } };
  }

  get actor() {
    return this.document;
  }

  /** @override */
  async _prepareContext(options) {
    const context = await super._prepareContext(options);
    const actor = this.actor;
    const system = actor.system;
    Object.assign(context, {
      actor,
      system,
      config: SWFFG,
      editable: this.isEditable,
      owner: actor.isOwner,
      isGM: game.user.isGM,
      isCharacter: actor.type === "character",
      isVehicle: actor.type === "vehicle",
      tabs: this._prepareTabs("primary"),
      characteristics: Object.entries(system.characteristics ?? {}).map(([key, c]) => ({
        key, value: c.value, total: c.total ?? c.value, label: SWFFG.CHARACTERISTICS[key].label, abbr: SWFFG.CHARACTERISTICS[key].abbr
      })),
      items: this.#prepareItems()
    });
    return context;
  }

  /** Objets regroupés par type, avec quelques valeurs d'affichage. */
  #prepareItems() {
    const by = {};
    for ( const item of this.actor.items.contents.sort((a, b) => (a.sort - b.sort) || a.name.localeCompare(b.name)) ) {
      (by[item.type] ??= []).push({
        id: item.id, uuid: item.uuid, name: item.name, img: item.img, type: item.type, system: item.system,
        skillLabel: item.system.skill ? SWFFG.SKILLS[item.system.skill]?.label : null,
        rangeLabel: item.system.range ? SWFFG.RANGES[item.system.range] : null,
        qualities: item.system.qualitiesLabel ?? "",
        activationLabel: item.system.activation ? SWFFG.ACTIVATIONS[item.system.activation] : null
      });
    }
    return by;
  }

  /** Compétences regroupées par type, pour les fiches qui en ont. */
  _prepareSkills({ showAll = false } = {}) {
    const system = this.actor.system;
    const books = activeBooks();
    const showBookSkills = game.settings.get(SYSTEM_ID, "showAllSkills");
    const groups = Object.entries(SKILL_TYPES).map(([type, label]) => ({ type, label, skills: [] }));
    for ( const [key, cfg] of Object.entries(SKILLS) ) {
      const skill = system.skills[key];
      const inBooks = cfg.books.some(b => books[b]);
      // Une compétence propre à un livre non utilisé est masquée, sauf si le personnage y a des rangs.
      if ( !showAll && !showBookSkills && !inBooks && !(skill.rank > 0) ) continue;
      const charKey = skill.characteristic ?? cfg.characteristic;
      groups.find(g => g.type === cfg.type).skills.push({
        key,
        label: cfg.label,
        rank: skill.rank,
        total: skill.total ?? skill.rank,
        career: skill.career,
        isCareer: skill.isCareer,
        isGroup: skill.isGroup,
        characteristic: charKey,
        charAbbr: SWFFG.CHARACTERISTICS[charKey].abbr,
        pool: skill.pool,
        icons: [...Array(skill.pool?.proficiency ?? 0).fill("proficiency"), ...Array(skill.pool?.ability ?? 0).fill("ability"), ...Array(skill.boost ?? 0).fill("boost")]
      });
    }
    return groups;
  }

  /** @override */
  _onRender(context, options) {
    super._onRender(context, options);
    const html = this.element;
    // Champs d'objets intégrés (rang de talent, quantité…).
    for ( const input of html.querySelectorAll("[data-item-field]") ) {
      input.addEventListener("change", event => {
        event.stopPropagation();
        const item = this.actor.items.get(input.closest("[data-item-id]").dataset.itemId);
        const value = input.type === "checkbox" ? input.checked : (input.type === "number" ? Number(input.value) : input.value);
        item?.update({ [input.dataset.itemField]: value });
      });
    }
    // Lignes de tableaux (Obligations, Devoirs, Motivations).
    for ( const input of html.querySelectorAll("[data-array]") ) {
      input.addEventListener("change", event => {
        event.stopPropagation();
        const path = input.dataset.array;
        const arr = foundry.utils.deepClone(foundry.utils.getProperty(this.actor.system.toObject(), path));
        const index = Number(input.dataset.index);
        arr[index][input.dataset.field] = input.type === "number" ? Number(input.value) : input.value;
        this.actor.update({ [`system.${path}`]: arr });
      });
    }
  }

  /* ----------------------------- Actions ----------------------------- */

  static #onRollSkill(event, target) {
    return this.actor.rollSkill(target.dataset.skill, { skipDialog: event.shiftKey });
  }

  static #onRollWeapon(event, target) {
    const item = this.actor.items.get(target.closest("[data-item-id]").dataset.itemId);
    return item && this.actor.rollWeapon(item, { skipDialog: event.shiftKey });
  }

  static #onRollForce(event, target) {
    const id = target.closest("[data-item-id]")?.dataset.itemId;
    return this.actor.rollForcePower(id ? this.actor.items.get(id) : null, { skipDialog: event.shiftKey });
  }

  static async #onItemCreate(event, target) {
    const type = target.dataset.type;
    const name = game.i18n.format("DOCUMENT.New", { type: game.i18n.localize(`TYPES.Item.${type}`) });
    const [item] = await this.actor.createEmbeddedDocuments("Item", [{ name, type }]);
    return item?.sheet.render({ force: true });
  }

  static #onItemEdit(event, target) {
    return this.actor.items.get(target.closest("[data-item-id]").dataset.itemId)?.sheet.render({ force: true });
  }

  static async #onItemDelete(event, target) {
    const item = this.actor.items.get(target.closest("[data-item-id]").dataset.itemId);
    if ( !item ) return;
    const ok = await foundry.applications.api.DialogV2.confirm({
      window: { title: game.i18n.localize("SWFFG.Sheet.delete") },
      content: `<p>${game.i18n.localize("SWFFG.Sheet.delete")} : <strong>${item.name}</strong> ?</p>`
    });
    if ( ok ) return item.delete();
  }

  static #onItemToggle(event, target) {
    const item = this.actor.items.get(target.closest("[data-item-id]").dataset.itemId);
    const field = target.dataset.field;
    return item?.update({ [`system.${field}`]: !foundry.utils.getProperty(item.system, field) });
  }

  static async #onItemChat(event, target) {
    const item = this.actor.items.get(target.closest("[data-item-id]").dataset.itemId);
    if ( !item ) return;
    const description = await TextEditor().enrichHTML(item.system.description ?? "", { relativeTo: item });
    return ChatMessage.implementation.create({
      speaker: ChatMessage.implementation.getSpeaker({ actor: this.actor }),
      content: `<div class="${SYSTEM_ID} item-card"><h3><img src="${item.img}" width="24" height="24"> ${item.name}</h3>${description}</div>`
    });
  }

  /** Ajuste une valeur numérique (blessures, stress, Conflit…) de ±1, Maj = ±5. */
  static #onAdjust(event, target) {
    const path = target.dataset.path;
    const step = Number(target.dataset.delta) * (event.shiftKey ? 5 : 1);
    const current = Number(foundry.utils.getProperty(this.actor, path)) || 0;
    return this.actor.update({ [path]: Math.max(current + step, 0) });
  }

  static #onEntryAdd(event, target) {
    const path = target.dataset.array;
    const arr = foundry.utils.deepClone(foundry.utils.getProperty(this.actor.system.toObject(), path)) ?? [];
    arr.push({});
    return this.actor.update({ [`system.${path}`]: arr });
  }

  static #onEntryRemove(event, target) {
    const path = target.dataset.array;
    const index = Number(target.dataset.index);
    const arr = foundry.utils.getProperty(this.actor.system.toObject(), path).filter((e, i) => i !== index);
    return this.actor.update({ [`system.${path}`]: arr });
  }

  /** Achat d'un rang de compétence avec l'XP disponible. */
  static async #onBuySkill(event, target) {
    const key = target.dataset.skill;
    const skill = this.actor.system.skills[key];
    const cost = skillRankCost(skill.rank + 1, skill.isCareer);
    if ( this.actor.system.xp.available < cost ) {
      return ui.notifications.warn(game.i18n.format("SWFFG.Sheet.notEnoughXp", { cost }));
    }
    return this.actor.update({
      [`system.skills.${key}.rank`]: skill.rank + 1,
      "system.xp.available": this.actor.system.xp.available - cost
    });
  }

  /**
   * Achat d'un talent d'une arborescence de spécialité. Une case est accessible si elle est sur la première rangée
   * ou reliée à une case déjà acquise. Le talent est ajouté à l'acteur (ou son rang augmenté s'il est déjà possédé).
   */
  static async #onLearnTalent(event, target) {
    const spec = this.actor.items.get(target.closest("[data-item-id]").dataset.itemId);
    const index = Number(target.dataset.index);
    const cells = spec.system.toObject().talents;
    const cell = cells[index];
    if ( !cell || cell.learned || !cell.name ) return;
    if ( !isReachable(cells, index) ) return;
    const cost = cellCost(index);
    if ( this.actor.system.xp.available < cost ) {
      return ui.notifications.warn(game.i18n.format("SWFFG.Sheet.notEnoughXp", { cost }));
    }
    cells[index].learned = true;
    await spec.update({ "system.talents": cells });
    await this.actor.update({ "system.xp.available": this.actor.system.xp.available - cost });
    return grantTalent(this.actor, cell);
  }
}

/** Ajoute le talent d'une case à l'acteur, depuis le compendium si la case a un UUID. */
async function grantTalent(actor, cell) {
  const existing = actor.itemTypes.talent.find(t => t.name === cell.name);
  if ( existing ) {
    if ( existing.system.ranked ) return existing.update({ "system.rank": existing.system.rank + 1 });
    return existing;
  }
  let data = null;
  if ( cell.uuid ) {
    const source = await fromUuid(cell.uuid);
    if ( source ) data = source.toObject();
  }
  data ??= {
    name: cell.name,
    type: "talent",
    system: { activation: cell.activation, ranked: cell.ranked, forceTalent: !!cell.force, rank: 1, description: cell.text ? `<p>${cell.text}</p>` : "" }
  };
  data.system.rank = 1;
  return actor.createEmbeddedDocuments("Item", [data]);
}

/* -------------------------------------------- */

export class CharacterSheet extends SWActorSheet {
  static DEFAULT_OPTIONS = {
    classes: [SYSTEM_ID, "sheet", "actor", "character"],
    actions: {
      resolveConflict: CharacterSheet.#onResolveConflict
    }
  };

  static TABS = SWActorSheet.tabsFor(["main", "skills", "talents", "force", "gear", "social", "biography"]);

  static PARTS = {
    sheet: { template: `systems/${SYSTEM_ID}/templates/actor/character-sheet.hbs`, scrollable: [".tab"] }
  };

  /** @override */
  async _prepareContext(options) {
    const context = await super._prepareContext(options);
    const actor = this.actor;
    const system = actor.system;
    const enrich = text => TextEditor().enrichHTML(text ?? "", { relativeTo: actor, secrets: actor.isOwner });
    Object.assign(context, {
      skillGroups: this._prepareSkills(),
      mechanics: system.activeMechanics,
      species: actor.itemTypes.species[0] ?? null,
      career: actor.itemTypes.career[0] ?? null,
      specializations: actor.itemTypes.specialization.map(s => ({
        id: s.id, name: s.name, img: s.img, system: s.system,
        rows: [0, 1, 2, 3, 4].map(r => ({
          cost: 5 * (r + 1),
          cells: [0, 1, 2, 3].map(c => {
            const index = (r * 4) + c;
            const cell = s.system.talents[index] ?? {};
            return {
              ...cell, index,
              reachable: !cell.learned && isReachable(s.system.talents, index),
              activationLabel: SWFFG.ACTIVATIONS[cell.activation] ?? ""
            };
          })
        }))
      })),
      enriched: {
        biography: await enrich(system.biography),
        notes: await enrich(system.notes)
      },
      woundPct: Math.min(100, Math.round(100 * system.wounds.value / Math.max(system.wounds.max, 1))),
      strainPct: Math.min(100, Math.round(100 * system.strain.value / Math.max(system.strain.max, 1))),
      encumbered: system.encumbrance.value > system.encumbrance.max,
      mechanicChoices: { auto: "Auto", on: "✓", off: "✗" }
    });
    return context;
  }

  static #onResolveConflict() {
    return this.actor.resolveConflict();
  }
}

/* -------------------------------------------- */

export class AdversarySheet extends SWActorSheet {
  static DEFAULT_OPTIONS = {
    classes: [SYSTEM_ID, "sheet", "actor", "adversary"],
    position: { width: 720, height: 700 }
  };

  static TABS = SWActorSheet.tabsFor(["main", "gear", "biography"]);

  static PARTS = {
    sheet: { template: `systems/${SYSTEM_ID}/templates/actor/adversary-sheet.hbs`, scrollable: [".tab"] }
  };

  /** @override */
  async _prepareContext(options) {
    const context = await super._prepareContext(options);
    const actor = this.actor;
    const system = actor.system;
    const enrich = text => TextEditor().enrichHTML(text ?? "", { relativeTo: actor, secrets: actor.isOwner });
    const isMinion = actor.type === "minion";
    Object.assign(context, {
      isMinion,
      isNemesis: actor.type === "nemesis",
      skillGroups: this._prepareSkills({ showAll: true }).map(g => ({
        ...g,
        // Profils d'adversaires : on n'affiche que les compétences utilisées, sauf en édition.
        skills: g.skills.filter(s => this.isEditable || s.total > 0 || s.isGroup)
      })),
      groupSkillChoices: isMinion ? Object.entries(SKILLS).map(([k, s]) => ({ key: k, label: s.label, checked: system.groupSkills.includes(k) })) : [],
      enriched: {
        abilities: await enrich(system.abilities),
        notes: await enrich(system.notes)
      }
    });
    return context;
  }

  /** @override */
  _onRender(context, options) {
    super._onRender(context, options);
    // Compétences de groupe des sbires : liste de cases à cocher.
    for ( const box of this.element.querySelectorAll("[data-group-skill]") ) {
      box.addEventListener("change", event => {
        event.stopPropagation();
        const set = new Set(this.actor.system.groupSkills);
        if ( box.checked ) set.add(box.dataset.groupSkill);
        else set.delete(box.dataset.groupSkill);
        this.actor.update({ "system.groupSkills": [...set] });
      });
    }
  }
}

/* -------------------------------------------- */

export class VehicleSheet extends SWActorSheet {
  static DEFAULT_OPTIONS = {
    classes: [SYSTEM_ID, "sheet", "actor", "vehicle"],
    position: { width: 720, height: 680 }
  };

  static TABS = SWActorSheet.tabsFor(["main", "gear", "biography"]);

  static PARTS = {
    sheet: { template: `systems/${SYSTEM_ID}/templates/actor/vehicle-sheet.hbs`, scrollable: [".tab"] }
  };

  /** @override */
  async _prepareContext(options) {
    const context = await super._prepareContext(options);
    const actor = this.actor;
    const enrich = text => TextEditor().enrichHTML(text ?? "", { relativeTo: actor, secrets: actor.isOwner });
    Object.assign(context, {
      characteristics: [],
      enriched: {
        description: await enrich(actor.system.description),
        notes: await enrich(actor.system.notes)
      },
      sensorChoices: SWFFG.VEHICLE_RANGES
    });
    return context;
  }
}
