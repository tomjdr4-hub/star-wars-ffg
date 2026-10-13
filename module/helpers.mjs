import { SYSTEM_ID } from "./config.mjs";

/**
 * Icônes des symboles : Font Awesome (livré avec Foundry), pour ne dépendre d'aucune police propriétaire.
 * Les couleurs et formes sont définies dans la feuille de style.
 */
export const SYMBOL_ICONS = {
  success: "fa-solid fa-burst",
  advantage: "fa-solid fa-angles-up",
  triumph: "fa-solid fa-sun",
  failure: "fa-solid fa-xmark",
  threat: "fa-solid fa-angles-down",
  despair: "fa-solid fa-skull",
  light: "fa-regular fa-circle",
  dark: "fa-solid fa-circle"
};

export function symbolHTML(key) {
  const label = game.i18n.localize(`SWFFG.Result.${key}`);
  return `<i class="swffg-symbol ${key} ${SYMBOL_ICONS[key] ?? ""}" data-tooltip="${label}" aria-label="${label}"></i>`;
}

export function dieHTML(key) {
  const label = game.i18n.localize(`SWFFG.Dice.${key}`);
  return `<span class="swffg-die-icon die-${key}" data-tooltip="${label}" aria-label="${label}"></span>`;
}

export function registerHelpers() {
  const { SafeString } = Handlebars;
  Handlebars.registerHelper("swffgSymbol", key => new SafeString(symbolHTML(key)));
  Handlebars.registerHelper("swffgDie", key => new SafeString(dieHTML(key)));
  Handlebars.registerHelper("swffgSigned", n => (Number(n) > 0 ? `+${n}` : `${n}`));
  Handlebars.registerHelper("swffgIncludes", (arr, v) => Array.isArray(arr) && arr.includes(v));
}

export const TEMPLATE_PARTIALS = {
  "swffg-editor": `systems/${SYSTEM_ID}/templates/parts/editor.hbs`,
  "swffg-skills": `systems/${SYSTEM_ID}/templates/parts/skills.hbs`,
  "swffg-characteristics": `systems/${SYSTEM_ID}/templates/parts/characteristics.hbs`,
  "swffg-gear": `systems/${SYSTEM_ID}/templates/parts/gear.hbs`
};
