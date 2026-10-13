/** Logique des arborescences de spécialité : 4 colonnes × 5 rangées, coût 5 × rangée. */

/** Coût en XP d'une case. */
export function cellCost(index) {
  return 5 * (Math.floor(index / 4) + 1);
}

/**
 * Une case est accessible si elle est sur la première rangée ou reliée à une case déjà acquise.
 * `linkRight` relie une case à sa voisine de droite, `linkDown` à celle du dessous.
 */
export function isReachable(cells, index) {
  const row = Math.floor(index / 4), col = index % 4;
  if ( row === 0 ) return true;
  const at = (r, c) => ((r >= 0) && (r < 5) && (c >= 0) && (c < 4)) ? cells[(r * 4) + c] : null;
  const up = at(row - 1, col), left = at(row, col - 1), right = at(row, col + 1), down = at(row + 1, col);
  const self = cells[index] ?? {};
  return !!((up?.learned && up.linkDown) || (left?.learned && left.linkRight)
    || (right?.learned && self.linkRight) || (down?.learned && self.linkDown));
}

/** Coût en XP d'un rang de compétence : 5 × nouveau rang, +5 hors carrière (chapitre II, étape 6). */
export function skillRankCost(newRank, isCareer) {
  return (5 * newRank) + (isCareer ? 0 : 5);
}
