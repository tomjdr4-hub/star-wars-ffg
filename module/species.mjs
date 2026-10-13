import { SKILLS } from "./config.mjs";

const { DialogV2 } = foundry.applications.api;

/**
 * Espèces : un personnage n'en a qu'une. Quand une espèce est ajoutée à un PJ, on propose d'appliquer
 * ses caractéristiques de départ, son XP de départ, ses rangs de compétence et ses talents offerts
 * (étape 3 de la création, identique dans les trois livres).
 */
export function registerSpeciesHooks() {
  Hooks.on("createItem", async (item, options, userId) => {
    if ( (userId !== game.user.id) || (item.type !== "species") || (item.parent?.type !== "character") ) return;
    const actor = item.parent;
    const others = actor.itemTypes.species.filter(s => s.id !== item.id);
    if ( others.length ) await actor.deleteEmbeddedDocuments("Item", others.map(o => o.id));
    // Personnage vierge : application directe ; sinon on demande.
    const fresh = (actor.system.xp.total === 0) && !others.length;
    const ok = fresh || await DialogV2.confirm({
      window: { title: game.i18n.localize("SWFFG.Species.applyTitle") },
      content: `<p>${game.i18n.format("SWFFG.Species.applyConfirm", { species: item.name, actor: actor.name })}</p>`
    });
    if ( ok ) await applySpecies(actor, item, { setXp: fresh });
  });
}

/** Applique une espèce à un personnage. */
export async function applySpecies(actor, species, { setXp = true } = {}) {
  const sys = species.system;
  const update = {};
  for ( const [k, v] of Object.entries(sys.characteristics) ) update[`system.characteristics.${k}.value`] = v;
  if ( setXp ) {
    update["system.xp.total"] = sys.startingXp;
    update["system.xp.available"] = sys.startingXp;
  }
  const ranks = {};
  for ( const k of sys.startingSkills ) ranks[k] = (ranks[k] ?? 0) + 1;
  if ( sys.skillChoice.count > 0 ) {
    const chosen = await chooseSkills(actor, species);
    for ( const k of chosen ?? [] ) ranks[k] = (ranks[k] ?? 0) + 1;
  }
  // Rang 2 maximum à la création dans les compétences offertes par l'espèce.
  for ( const [k, n] of Object.entries(ranks) ) {
    update[`system.skills.${k}.rank`] = Math.min(Math.max(actor.system.skills[k].rank, n), 2);
  }
  await actor.update(update);
  for ( const name of sys.startingTalents ) await grantTalentByName(actor, name);
  ui.notifications.info(game.i18n.format("SWFFG.Species.applied", { species: species.name, actor: actor.name }));
}

/** Fenêtre de choix des compétences (« Charme ou Tromperie », « deux compétences hors carrière »…). */
async function chooseSkills(actor, species) {
  const { count, options, nonCareer } = species.system.skillChoice;
  let keys = options.length ? options : Object.keys(SKILLS);
  if ( nonCareer ) keys = keys.filter(k => !actor.system.skills[k]?.isCareer);
  const boxes = keys.map(k => `<label class="checkbox"><input type="checkbox" name="${k}"> ${game.i18n.localize(SKILLS[k].label)}</label>`).join("");
  const content = `<p>${game.i18n.format("SWFFG.Species.chooseSkills", { count, species: species.name })}</p>
    <div class="swffg-choice-grid">${boxes}</div>`;
  while ( true ) {
    const result = await DialogV2.prompt({
      window: { title: species.name },
      content,
      ok: { callback: (event, button) => [...button.form.querySelectorAll("input:checked")].map(i => i.name) },
      rejectClose: false
    });
    if ( !result ) return [];
    if ( result.length === count ) return result;
    ui.notifications.warn(game.i18n.format("SWFFG.Species.tooMany", { count }));
  }
}

/**
 * Donne un talent par son nom : cherche d'abord dans les objets du monde puis dans les compendiums d'objets ;
 * à défaut, crée un talent minimal. Un talent à rangs déjà possédé gagne un rang.
 */
export async function grantTalentByName(actor, name) {
  const existing = actor.itemTypes.talent.find(t => t.name.toLowerCase() === name.toLowerCase());
  if ( existing ) {
    if ( existing.system.ranked ) await existing.update({ "system.rank": existing.system.rank + 1 });
    return existing;
  }
  let source = game.items.find(i => (i.type === "talent") && (i.name.toLowerCase() === name.toLowerCase()));
  if ( !source ) {
    for ( const pack of game.packs.filter(p => p.documentName === "Item") ) {
      const entry = (await pack.getIndex({ fields: ["type"] })).find(e => (e.type === "talent") && (e.name.toLowerCase() === name.toLowerCase()));
      if ( entry ) { source = await pack.getDocument(entry._id); break; }
    }
  }
  const data = source ? source.toObject() : { name, type: "talent", system: { rank: 1 } };
  delete data._id;
  foundry.utils.setProperty(data, "system.rank", 1);
  const [created] = await actor.createEmbeddedDocuments("Item", [data]);
  return created;
}
