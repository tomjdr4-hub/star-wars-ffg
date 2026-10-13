/**
 * Star Wars — Aux Confins de l'Empire / L'Ère de la Rébellion / Force et Destinée.
 * Système Foundry VTT (V13 / V14) pour les trois livres de base de la gamme narrative.
 */
import { SWFFG, SKILLS, SYSTEM_ID } from "./module/config.mjs";
import { registerDice } from "./module/dice/dice.mjs";
import { DicePool } from "./module/dice/pool.mjs";
import { NarrativeRoll } from "./module/dice/roll.mjs";
import { AdversaryData, CharacterData, MinionData, VehicleData } from "./module/data/actor-models.mjs";
import {
  ArmorData, AttachmentData, CareerData, CriticalData, ForcePowerData, GearData, SpecializationData, SpeciesData,
  TalentData, WeaponData
} from "./module/data/item-models.mjs";
import { SWActor, SWCombatant } from "./module/documents/actor.mjs";
import { AdversarySheet, CharacterSheet, VehicleSheet } from "./module/sheets/actor-sheets.mjs";
import { SWItemSheet } from "./module/sheets/item-sheet.mjs";
import { RollDialog, rollPool } from "./module/apps/roll-dialog.mjs";
import { DestinyPool } from "./module/apps/destiny.mjs";
import { applySessionEffects, clearSessionEffects, onRenderSessionCard, rollSessionStart } from "./module/apps/session.mjs";
import { TEMPLATE_PARTIALS, registerHelpers } from "./module/helpers.mjs";
import { applySpecies, registerSpeciesHooks } from "./module/species.mjs";

Hooks.once("init", () => {
  game.swffg = {
    config: SWFFG, DicePool, NarrativeRoll, RollDialog, rollPool, DestinyPool,
    rollSessionStart, applySessionEffects, clearSessionEffects, applySpecies,
    /** Ouvre la fenêtre de jet avec une réserve libre, ex. game.swffg.roll({ ability: 2, difficulty: 2 }). */
    roll: (pool = {}, options = {}) => RollDialog.prompt({ pool: new DicePool(pool), ...options })
  };
  CONFIG.SWFFG = SWFFG;

  registerSettings();
  registerDice();
  CONFIG.Dice.rolls.unshift(NarrativeRoll);

  CONFIG.Actor.documentClass = SWActor;
  CONFIG.Actor.dataModels = {
    character: CharacterData,
    nemesis: AdversaryData,
    rival: AdversaryData,
    minion: MinionData,
    vehicle: VehicleData
  };
  CONFIG.Actor.trackableAttributes = {
    character: { bar: ["wounds", "strain"], value: ["soak", "xp.available"] },
    nemesis: { bar: ["wounds", "strain"], value: ["soak"] },
    rival: { bar: ["wounds"], value: ["soak"] },
    minion: { bar: ["wounds"], value: ["alive", "soak"] },
    vehicle: { bar: ["hullTrauma", "systemStrain"], value: ["armor"] }
  };
  CONFIG.Item.dataModels = {
    weapon: WeaponData,
    armor: ArmorData,
    gear: GearData,
    attachment: AttachmentData,
    talent: TalentData,
    forcepower: ForcePowerData,
    specialization: SpecializationData,
    career: CareerData,
    species: SpeciesData,
    critical: CriticalData
  };

  // Initiative : test de Vigilance ou de Calme, classé par succès puis avantages nets (voir SWCombatant).
  CONFIG.Combatant.documentClass = SWCombatant;
  CONFIG.Combat.initiative = { formula: "0", decimals: 2 };

  const { DocumentSheetConfig } = foundry.applications.apps;
  DocumentSheetConfig.registerSheet(Actor, SYSTEM_ID, CharacterSheet, {
    types: ["character"], makeDefault: true, label: "SWFFG.Sheet.character"
  });
  DocumentSheetConfig.registerSheet(Actor, SYSTEM_ID, AdversarySheet, {
    types: ["nemesis", "rival", "minion"], makeDefault: true, label: "SWFFG.Sheet.adversary"
  });
  DocumentSheetConfig.registerSheet(Actor, SYSTEM_ID, VehicleSheet, {
    types: ["vehicle"], makeDefault: true, label: "SWFFG.Sheet.vehicle"
  });
  DocumentSheetConfig.registerSheet(Item, SYSTEM_ID, SWItemSheet, {
    makeDefault: true, label: "SWFFG.Sheet.item"
  });

  registerHelpers();
  return foundry.applications.handlebars.loadTemplates(TEMPLATE_PARTIALS);
});

function registerSettings() {
  for ( const book of ["aoe", "edr", "fad"] ) {
    game.settings.register(SYSTEM_ID, `book-${book}`, {
      name: `SWFFG.Book.${book}`,
      hint: "SWFFG.Setting.booksHint",
      scope: "world", config: true, type: Boolean, default: true,
      onChange: () => rerenderSheets()
    });
  }
  game.settings.register(SYSTEM_ID, "showAllSkills", {
    name: "SWFFG.Setting.showAllSkills",
    hint: "SWFFG.Setting.showAllSkillsHint",
    scope: "world", config: true, type: Boolean, default: false,
    onChange: () => rerenderSheets()
  });
  game.settings.register(SYSTEM_ID, "socialMode", {
    name: "SWFFG.SocialMode.label",
    hint: "SWFFG.SocialMode.hint",
    scope: "world", config: true, type: String, default: "perCharacter",
    choices: SWFFG.SOCIAL_MODES,
    onChange: () => rerenderSheets()
  });
  game.settings.register(SYSTEM_ID, "triggerMorality", {
    name: "SWFFG.Setting.triggerMorality",
    hint: "SWFFG.Setting.triggerMoralityHint",
    scope: "world", config: true, type: Boolean, default: false
  });
  game.settings.register(SYSTEM_ID, "initiativeSkill", {
    name: "SWFFG.Setting.initiativeSkill",
    hint: "SWFFG.Setting.initiativeSkillHint",
    scope: "world", config: true, type: String, default: "vigilance",
    choices: { vigilance: SKILLS.vigilance.label, cool: SKILLS.cool.label }
  });
  game.settings.register(SYSTEM_ID, "destiny", {
    scope: "world", config: false, type: Object, default: { light: 0, dark: 0 },
    onChange: () => foundry.applications.instances.get("swffg-destiny")?.render()
  });
}

function rerenderSheets() {
  for ( const app of foundry.applications.instances.values() ) {
    if ( app.document?.documentName === "Actor" ) app.render();
  }
}

Hooks.once("ready", () => {
  game.socket.on(`system.${SYSTEM_ID}`, data => DestinyPool.onSocket(data));
});

Hooks.on("renderChatMessageHTML", (message, html) => onRenderSessionCard(message, html));
registerSpeciesHooks();

/** Boutons de la barre d'outils des jetons : réserve de Destin et jet de début de session. */
Hooks.on("getSceneControlButtons", controls => {
  const tokens = controls.tokens ?? controls.token;
  if ( !tokens?.tools ) return;
  tokens.tools.swffgDestiny = {
    name: "swffgDestiny",
    title: "SWFFG.Destiny.title",
    icon: "fa-solid fa-yin-yang",
    order: 100,
    button: true,
    visible: true,
    onChange: () => DestinyPool.toggle()
  };
  if ( game.user.isGM ) {
    tokens.tools.swffgSession = {
      name: "swffgSession",
      title: "SWFFG.Session.roll",
      icon: "fa-solid fa-dice-d20",
      order: 101,
      button: true,
      visible: true,
      onChange: () => rollSessionStart()
    };
  }
});
