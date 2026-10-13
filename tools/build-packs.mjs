/**
 * Construit les compendiums à partir des données de tools/data/ :
 * données → documents Foundry (identifiants stables) → JSON dans tools/.cache/packs-src → LevelDB dans packs/.
 * Usage : npm run build:packs
 */
import { compilePack } from "@foundryvtt/foundryvtt-cli";
import { createHash } from "node:crypto";
import { mkdir, rm, writeFile } from "node:fs/promises";
import { SPECIES } from "./data/species.mjs";

const CHARS = ["brawn", "agility", "intellect", "cunning", "willpower", "presence"];
const BOOK_LABEL = { aoe: "AoE", edr: "EdR", fad: "F&D" };

/** Identifiant Foundry stable (16 caractères alphanumériques) dérivé d'une clé. */
function stableId(key) {
  const alphabet = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  const bytes = createHash("sha256").update(key).digest();
  return Array.from(bytes.subarray(0, 16), b => alphabet[b % alphabet.length]).join("");
}

function itemDoc(pack, key, name, type, img, system, sort) {
  const _id = stableId(`${pack}:${key}`);
  return {
    _id, _key: `!items!${_id}`, name, type, img, system, effects: [], folder: null, sort,
    ownership: { default: 0 }, flags: { "star-wars-ffg": { key } }
  };
}

function speciesDocs() {
  return SPECIES.map((s, i) => {
    const sources = s.sources.map(src => `${BOOK_LABEL[src.book]} p. ${src.page}`).join(" ; ");
    return itemDoc("species", s.key, s.name, "species", s.img ?? "icons/svg/mystery-man.svg", {
      description: `<p><em>Source : ${sources}</em></p>${s.description}`,
      source: { book: s.sources[0].book, page: s.sources[0].page },
      characteristics: Object.fromEntries(CHARS.map((c, j) => [c, s.characteristics[j]])),
      woundBase: s.wound,
      strainBase: s.strain,
      startingXp: s.xp,
      abilities: s.abilities ?? "",
      startingSkills: s.startingSkills ?? [],
      skillChoice: { count: 0, options: [], nonCareer: false, ...(s.skillChoice ?? {}) },
      startingTalents: s.startingTalents ?? [],
      noForce: !!s.noForce,
      modifiers: s.modifiers ?? []
    }, (i + 1) * 100);
  });
}

const PACKS = { species: speciesDocs };

for ( const [pack, build] of Object.entries(PACKS) ) {
  const src = `tools/.cache/packs-src/${pack}`;
  await rm(src, { recursive: true, force: true });
  await mkdir(src, { recursive: true });
  const docs = build();
  for ( const doc of docs ) await writeFile(`${src}/${doc.flags["star-wars-ffg"].key}.json`, JSON.stringify(doc, null, 2));
  const dest = `packs/${pack}`;
  await rm(dest, { recursive: true, force: true });
  await compilePack(src, dest, { log: false });
  console.log(`Compilé : ${dest} (${docs.length} documents)`);
}
