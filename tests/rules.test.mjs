/**
 * Tests des règles pures (sans Foundry) : faces des dés, réserve de dés, arborescences de talents.
 * Lancer avec `npm test`.
 */
import { test } from "node:test";
import assert from "node:assert/strict";

// Foundry minimal : les dés étendent foundry.dice.terms.Die.
globalThis.foundry = {
  dice: { terms: { Die: class { constructor(data = {}) { Object.assign(this, data); this.results ??= []; } } } }
};

const dice = await import("../module/dice/dice.mjs");
const { DicePool } = await import("../module/dice/pool.mjs");
const tree = await import("../module/talent-tree.mjs");

/** Total des symboles sur toutes les faces d'un dé. */
function totals(cls) {
  const out = {};
  for ( const face of cls.FACES ) for ( const ch of face ) out[ch] = (out[ch] ?? 0) + 1;
  return out;
}

test("nombre de faces des dés", () => {
  assert.equal(dice.BoostDie.FACES.length, 6);
  assert.equal(dice.SetbackDie.FACES.length, 6);
  assert.equal(dice.AbilityDie.FACES.length, 8);
  assert.equal(dice.DifficultyDie.FACES.length, 8);
  assert.equal(dice.ProficiencyDie.FACES.length, 12);
  assert.equal(dice.ChallengeDie.FACES.length, 12);
  assert.equal(dice.ForceDie.FACES.length, 12);
});

test("répartition des symboles", () => {
  assert.deepEqual(totals(dice.AbilityDie), { s: 5, a: 5 });
  assert.deepEqual(totals(dice.DifficultyDie), { f: 4, h: 6 });
  assert.deepEqual(totals(dice.ProficiencyDie), { s: 9, a: 8, t: 1 });
  assert.deepEqual(totals(dice.ChallengeDie), { f: 8, h: 8, d: 1 });
  assert.deepEqual(totals(dice.BoostDie), { s: 2, a: 4 });
  assert.deepEqual(totals(dice.SetbackDie), { f: 2, h: 2 });
  // Dé de Force : 6 faces obscures simples, 1 double ; 2 lumineuses simples, 3 doubles.
  assert.deepEqual(totals(dice.ForceDie), { n: 8, l: 8 });
});

test("dénominations uniques", () => {
  const dens = dice.DICE_CLASSES.map(c => c.DENOMINATION);
  assert.equal(new Set(dens).size, dens.length);
});

test("réserve de base : caractéristique et rang", () => {
  // Intelligence 3, Informatique 2 : 1 aptitude + 2 maîtrises (exemple de Vendri, EdR p. 29).
  let p = DicePool.fromCharacteristicAndRank(3, 2);
  assert.equal(p.ability, 1);
  assert.equal(p.proficiency, 2);
  // Informatique 3, Intelligence 2 : même réserve (exemple d'Arkhan).
  p = DicePool.fromCharacteristicAndRank(2, 3);
  assert.equal(p.ability, 1);
  assert.equal(p.proficiency, 2);
  // Sans rang : seulement des dés d'aptitude.
  p = DicePool.fromCharacteristicAndRank(3, 0);
  assert.equal(p.ability, 3);
  assert.equal(p.proficiency, 0);
});

test("améliorer et dégrader", () => {
  const p = new DicePool({ ability: 1, difficulty: 2 });
  p.upgradeAbility(2);
  // Le premier dé d'aptitude devient maîtrise, le second ajoute un dé d'aptitude faute d'aptitude restante.
  assert.equal(p.proficiency, 1);
  assert.equal(p.ability, 1);
  p.upgradeDifficulty(3);
  assert.equal(p.challenge, 2);
  assert.equal(p.difficulty, 1);
  p.downgradeDifficulty(5);
  assert.equal(p.challenge, 0);
  assert.equal(p.difficulty, 3);
  p.downgradeAbility(1);
  assert.equal(p.proficiency, 0);
  assert.equal(p.ability, 2);
});

test("retrait des dés d'infortune en dernier", () => {
  const p = new DicePool({ ability: 2, setback: 1 });
  p.removeSetback = 2;
  p.setback += 2;
  p.applyRemovals();
  assert.equal(p.setback, 1);
});

test("formule Foundry", () => {
  const p = new DicePool({ ability: 2, proficiency: 1, difficulty: 2, setback: 1, force: 1 });
  assert.equal(p.toFormula(), "1dp + 2da + 2di + 1dk + 1df");
  assert.equal(new DicePool().toFormula(), "0");
});

test("arborescence : coûts", () => {
  assert.equal(tree.cellCost(0), 5);
  assert.equal(tree.cellCost(3), 5);
  assert.equal(tree.cellCost(4), 10);
  assert.equal(tree.cellCost(19), 25);
});

test("arborescence : accessibilité", () => {
  const cells = Array.from({ length: 20 }, () => ({ learned: false, linkRight: false, linkDown: false }));
  assert.equal(tree.isReachable(cells, 0), true);
  assert.equal(tree.isReachable(cells, 4), false);
  cells[0].learned = true;
  cells[0].linkDown = true;
  assert.equal(tree.isReachable(cells, 4), true);
  // Lien horizontal depuis une case acquise à gauche.
  cells[4].learned = true;
  cells[4].linkRight = true;
  assert.equal(tree.isReachable(cells, 5), true);
  // Lien horizontal depuis la droite : porté par la case de gauche.
  cells[7].learned = true;
  cells[6].linkRight = true;
  assert.equal(tree.isReachable(cells, 6), true);
  // Pas de lien : inaccessible.
  assert.equal(tree.isReachable(cells, 9), false);
});

test("coût des rangs de compétence", () => {
  assert.equal(tree.skillRankCost(1, true), 5);
  assert.equal(tree.skillRankCost(1, false), 10);
  assert.equal(tree.skillRankCost(3, true), 15);
});
