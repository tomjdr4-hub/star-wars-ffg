import { SWFFG, SKILLS, SYSTEM_ID } from "../config.mjs";

const { HandlebarsApplicationMixin } = foundry.applications.api;
const { ItemSheetV2 } = foundry.applications.sheets;

/** Types de modificateurs proposés, et s'ils demandent une clé (caractéristique ou compétence). */
const MODIFIER_TYPES = {
  woundThreshold: null, strainThreshold: null, soak: null, defenseMelee: null, defenseRanged: null,
  encumbranceThreshold: null, forceRating: null,
  characteristic: "characteristic", skillRank: "skill", skillBoost: "skill", skillRemoveSetback: "skill", skillCareer: "skill", skillAdvantage: "skill", skillCharacteristic: "text"
};

const BLANK = {
  qualities: { key: "accurate", rank: 1 },
  modifiers: { type: "woundThreshold", key: "", value: 1 },
  upgrades: { type: "strength", text: "", cost: 5, row: 1, col: 1, width: 1, check: "", learned: false }
};

/** Cases à cocher de toutes les compétences, cochées selon une liste. */
function skillBoxes(list) {
  return Object.entries(SKILLS).map(([k, s]) => ({ key: k, label: s.label, checked: list.includes(k) }));
}

export class SWItemSheet extends HandlebarsApplicationMixin(ItemSheetV2) {
  static DEFAULT_OPTIONS = {
    classes: [SYSTEM_ID, "sheet", "item"],
    position: { width: 600, height: 640 },
    window: { resizable: true },
    form: { submitOnChange: true },
    actions: {
      arrayAdd: SWItemSheet.#onArrayAdd,
      arrayRemove: SWItemSheet.#onArrayRemove,
      toggleLink: SWItemSheet.#onToggleLink
    }
  };

  static PARTS = {
    sheet: { template: `systems/${SYSTEM_ID}/templates/item/item-sheet.hbs`, scrollable: [".sheet-body"] }
  };

  get item() {
    return this.document;
  }

  /** @override */
  async _prepareContext(options) {
    const context = await super._prepareContext(options);
    const item = this.item;
    const system = item.system;
    const skillChoices = Object.fromEntries(Object.entries(SKILLS).map(([k, s]) => [k, s.label]));
    const charChoices = Object.fromEntries(Object.entries(SWFFG.CHARACTERISTICS).map(([k, c]) => [k, c.label]));
    Object.assign(context, {
      item,
      system,
      config: SWFFG,
      editable: this.isEditable,
      isType: { [item.type]: true },
      hasCommerce: "price" in system,
      hasModifiers: "modifiers" in system,
      skillChoices,
      charChoices,
      rangeChoices: SWFFG.RANGES,
      activationChoices: SWFFG.ACTIVATIONS,
      bookChoices: { "": "SWFFG.Book.other", aoe: "SWFFG.Book.aoe", edr: "SWFFG.Book.edr", fad: "SWFFG.Book.fad" },
      qualityChoices: Object.fromEntries(Object.entries(SWFFG.QUALITIES).map(([k, q]) => [k, q.label])),
      upgradeChoices: SWFFG.FORCE_UPGRADES,
      severityChoices: SWFFG.SEVERITIES,
      modifierChoices: Object.fromEntries(Object.keys(MODIFIER_TYPES).map(k => [k, `SWFFG.Modifier.${k}`])),
      qualities: (system.qualities ?? []).map((q, index) => ({ ...q, index, ranked: SWFFG.QUALITIES[q.key]?.ranked })),
      modifiers: (system.modifiers ?? []).map((m, index) => ({
        ...m, index,
        keyKind: MODIFIER_TYPES[m.type],
        keyChoices: MODIFIER_TYPES[m.type] === "skill" ? skillChoices : MODIFIER_TYPES[m.type] === "characteristic" ? charChoices : null
      })),
      upgrades: (system.upgrades ?? []).map((u, index) => ({ ...u, index })),
      careerSkillBoxes: ("careerSkills" in system) ? skillBoxes(system.careerSkills) : [],
      startingSkillBoxes: item.type === "species" ? skillBoxes(system.startingSkills) : [],
      choiceSkillBoxes: item.type === "species" ? skillBoxes(system.skillChoice.options) : [],
      startingTalentsText: item.type === "species" ? system.startingTalents.join(", ") : "",
      treeRows: item.type === "specialization" ? [0, 1, 2, 3, 4].map(r => ({
        cost: 5 * (r + 1),
        cells: [0, 1, 2, 3].map(c => ({ ...system.talents[(r * 4) + c], index: (r * 4) + c, last: c === 3, bottom: r === 4 }))
      })) : [],
      enrichedDescription: await foundry.applications.ux.TextEditor.implementation.enrichHTML(system.description ?? "", {
        relativeTo: item, secrets: item.isOwner
      })
    });
    return context;
  }

  /** @override */
  _onRender(context, options) {
    super._onRender(context, options);
    const html = this.element;
    // Lignes de tableaux (attributs, modificateurs, améliorations, cases d'arborescence).
    for ( const input of html.querySelectorAll("[data-array]") ) {
      input.addEventListener("change", event => {
        event.stopPropagation();
        const path = input.dataset.array;
        const arr = foundry.utils.deepClone(this.item.system.toObject()[path]);
        const row = arr[Number(input.dataset.index)];
        const field = input.dataset.field;
        row[field] = input.type === "checkbox" ? input.checked : (input.type === "number" ? Number(input.value) : input.value);
        if ( (path === "modifiers") && (field === "type") ) row.key = "";
        this.item.update({ [`system.${path}`]: arr });
      });
    }
    // Listes de compétences (carrière, rangs offerts, choix) : cases à cocher.
    for ( const box of html.querySelectorAll("[data-skill-list]") ) {
      box.addEventListener("change", event => {
        event.stopPropagation();
        const path = box.dataset.skillList;
        const set = new Set(foundry.utils.getProperty(this.item.system, path));
        if ( box.checked ) set.add(box.dataset.skill);
        else set.delete(box.dataset.skill);
        this.item.update({ [`system.${path}`]: [...set] });
      });
    }
    // Talents offerts : liste séparée par des virgules.
    html.querySelector("[data-talent-list]")?.addEventListener("change", event => {
      event.stopPropagation();
      const names = event.target.value.split(",").map(n => n.trim()).filter(Boolean);
      this.item.update({ "system.startingTalents": names });
    });
    // Glisser un talent du compendium sur une case de l'arborescence.
    for ( const cell of html.querySelectorAll(".tree-cell[data-index]") ) {
      cell.addEventListener("dragover", ev => ev.preventDefault());
      cell.addEventListener("drop", ev => this.#onDropTalent(ev, Number(cell.dataset.index)));
    }
  }

  async #onDropTalent(event, index) {
    event.preventDefault();
    event.stopPropagation();
    const data = foundry.applications.ux.TextEditor.implementation.getDragEventData(event);
    if ( data?.type !== "Item" ) return;
    const talent = await fromUuid(data.uuid);
    if ( talent?.type !== "talent" ) return;
    const cells = this.item.system.toObject().talents;
    Object.assign(cells[index], {
      name: talent.name, uuid: talent.uuid, activation: talent.system.activation, ranked: talent.system.ranked
    });
    return this.item.update({ "system.talents": cells });
  }

  static #onArrayAdd(event, target) {
    const path = target.dataset.array;
    const arr = [...this.item.system.toObject()[path], foundry.utils.deepClone(BLANK[path] ?? {})];
    return this.item.update({ [`system.${path}`]: arr });
  }

  static #onArrayRemove(event, target) {
    const path = target.dataset.array;
    const index = Number(target.dataset.index);
    return this.item.update({ [`system.${path}`]: this.item.system.toObject()[path].filter((e, i) => i !== index) });
  }

  /** Bascule un lien de l'arborescence (vers la droite ou vers le bas). */
  static #onToggleLink(event, target) {
    if ( !this.isEditable ) return;
    const cells = this.item.system.toObject().talents;
    const cell = cells[Number(target.dataset.index)];
    const field = target.dataset.link === "right" ? "linkRight" : "linkDown";
    cell[field] = !cell[field];
    return this.item.update({ "system.talents": cells });
  }
}
