/**
 * Construit les compendiums à partir des données de tools/data/ :
 * données → documents Foundry (identifiants stables) → JSON dans tools/.cache/packs-src → LevelDB dans packs/.
 * Usage : npm run build:packs
 */
import { compilePack } from "@foundryvtt/foundryvtt-cli";
import { createHash } from "node:crypto";
import { mkdir, rm, writeFile } from "node:fs/promises";
import { readFileSync } from "node:fs";
import { SPECIES } from "./data/species.mjs";

const TREES = JSON.parse(readFileSync(new URL("./data/specializations.json", import.meta.url), "utf8"));

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

/** Clé ASCII stable à partir d'un nom français. */
function slug(text) {
  return text.normalize("NFKD").replace(/[̀-ͯ]/g, "").toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
}

function careerDocs() {
  return TREES.careers.map((c, i) => itemDoc("careers", `${c.book}-${slug(c.name)}`, c.name, "career", "icons/svg/book.svg", {
    description: `<p><em>Source : ${BOOK_LABEL[c.book]}</em></p><p>Spécialités : ${c.specs.join(", ")}.</p>`
      + (c.book === "fad" ? "<p>Les carrières de Force et Destinée commencent avec une valeur de Force de 1.</p>" : ""),
    source: { book: c.book, page: "" },
    careerSkills: c.skills,
    forceRating: c.book === "fad" ? 1 : 0,
    specializations: c.specs.join(", ")
  }, (i + 1) * 100));
}

function specializationDocs() {
  return TREES.specializations.map((s, i) => itemDoc("specializations", `${s.book}-${slug(s.career)}-${slug(s.name)}`, s.name, "specialization",
    s.universal ? "icons/svg/aura.svg" : "icons/svg/upgrade.svg", {
      description: `<p><em>Source : ${BOOK_LABEL[s.book]} p. ${s.page}</em></p>`
        + `<p>${s.universal ? "Spécialité universelle" : `Carrière : ${s.career}`}.</p>`
        + (s.forceRating ? "<p>Gagnez une valeur de Force de 1.</p>" : ""),
      source: { book: s.book, page: s.page },
      career: s.career,
      universal: s.universal,
      careerSkills: s.careerSkills,
      forceRating: s.forceRating,
      talents: s.cells.map(c => ({
        name: c.name, uuid: "", activation: c.activation, ranked: c.ranked, force: c.force, text: "",
        linkRight: c.linkRight, linkDown: c.linkDown, learned: false
      }))
    }, (i + 1) * 100));
}

const PACKS = { species: speciesDocs, careers: careerDocs, specializations: specializationDocs };

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
