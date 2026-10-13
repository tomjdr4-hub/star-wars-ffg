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
import { TALENTS } from "./data/talents.mjs";

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

const ACTIVATION = { P: "passive", B: "incidental", BH: "incidentalOot", M: "maneuver", A: "action" };

/** Codes de symboles des textes → icônes (mêmes classes que le système). */
const SYMBOL_HTML = {
  FO: '<span class="swffg-die-icon die-boost" title="Fortune"></span>',
  IN: '<span class="swffg-die-icon die-setback" title="Infortune"></span>',
  AP: '<span class="swffg-die-icon die-ability" title="Aptitude"></span>',
  MA: '<span class="swffg-die-icon die-proficiency" title="Maîtrise"></span>',
  DI: '<span class="swffg-die-icon die-difficulty" title="Difficulté"></span>',
  DE: '<span class="swffg-die-icon die-challenge" title="Défi"></span>',
  FD: '<span class="swffg-die-icon die-force" title="Dé de Force"></span>',
  SU: '<i class="swffg-symbol success fa-solid fa-burst" title="Succès"></i>',
  AV: '<i class="swffg-symbol advantage fa-solid fa-angles-up" title="Avantage"></i>',
  TR: '<i class="swffg-symbol triumph fa-solid fa-sun" title="Triomphe"></i>',
  EC: '<i class="swffg-symbol failure fa-solid fa-xmark" title="Échec"></i>',
  ME: '<i class="swffg-symbol threat fa-solid fa-angles-down" title="Menace"></i>',
  DS: '<i class="swffg-symbol despair fa-solid fa-skull" title="Désastre"></i>',
  LU: '<i class="swffg-symbol light fa-regular fa-circle" title="Côté lumineux"></i>',
  OB: '<i class="swffg-symbol dark fa-solid fa-circle" title="Côté obscur"></i>',
  PF: '<i class="swffg-symbol force-point fa-solid fa-circle-half-stroke" title="Point de Force"></i>'
};
const symbols = text => text.replace(/\[(FO|IN|AP|MA|DI|DE|FD|SU|AV|TR|EC|ME|DS|LU|OB|PF)\]/g, (m, k) => SYMBOL_HTML[k]);
const paragraphs = text => text.split(/\n/).map(p => `<p>${symbols(p)}</p>`).join("");
const norm = s => s.normalize("NFC").replace(/’/g, "'").toLowerCase().trim();

/** Index nom (et variantes imprimées) → talent du compendium. */
const TALENT_INDEX = new Map();
for ( const t of TALENTS ) for ( const n of [t.n, ...(t.al ?? [])] ) TALENT_INDEX.set(norm(n), t);

function talentKey(t) {
  return slug(t.n);
}

function talentDocs() {
  return TALENTS.map((t, i) => {
    const sources = t.s.map(([b, p]) => `${BOOK_LABEL[b]} p. ${p}`).join(" ; ");
    const aliases = t.al?.length ? `<p><em>Aussi imprimé : ${t.al.join(", ")}.</em></p>` : "";
    const diff = t.x ? `<p><strong>Différences entre les livres :</strong> ${symbols(t.x)}</p>` : "";
    return itemDoc("talents", talentKey(t), t.n, "talent", t.f ? "icons/svg/sun.svg" : "icons/svg/book.svg", {
      description: `<p><em>Source : ${sources}</em></p>${paragraphs(t.d)}${aliases}${diff}`,
      source: { book: t.s[0][0], page: t.s[0][1] },
      activation: ACTIVATION[t.a],
      ranked: !!t.r,
      rank: 1,
      forceTalent: !!t.f,
      trees: "",
      modifiers: (t.m ?? []).map(([type, value, key]) => ({ type, value, key: key ?? "" }))
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
      talents: s.cells.map(c => {
        const t = TALENT_INDEX.get(norm(c.name));
        const uuid = t ? `Compendium.star-wars-ffg.talents.Item.${stableId(`talents:${talentKey(t)}`)}` : "";
        return {
          name: c.name, uuid,
          activation: t ? ACTIVATION[t.a] : c.activation,
          ranked: t ? !!t.r : c.ranked,
          force: c.force, text: "",
          linkRight: c.linkRight, linkDown: c.linkDown, learned: false
        };
      })
    }, (i + 1) * 100));
}

const PACKS = { species: speciesDocs, careers: careerDocs, specializations: specializationDocs, talents: talentDocs };

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
