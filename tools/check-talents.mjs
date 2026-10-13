// Vérifie que chaque case d'arborescence a son talent dans tools/data/talents.mjs.
import { readFileSync } from "node:fs";
import { TALENTS } from "./data/talents.mjs";
const norm = s => s.normalize("NFC").replace(/’/g, "'").toLowerCase().trim();
const names = new Set(TALENTS.flatMap(t => [t.n, ...(t.al ?? [])]).map(norm));
const trees = JSON.parse(readFileSync(new URL("./data/specializations.json", import.meta.url), "utf8"));
const missing = {};
for ( const s of trees.specializations ) for ( const c of s.cells ) {
  if ( !names.has(norm(c.name)) ) (missing[s.book] ??= new Set()).add(c.name);
}
const dup = TALENTS.map(t => norm(t.n)).filter((n, i, a) => a.indexOf(n) !== i);
console.log(TALENTS.length, "talents ; doublons :", dup);
for ( const [b, set] of Object.entries(missing) ) console.log(b, set.size, [...set].join(" | "));
