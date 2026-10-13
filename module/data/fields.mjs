/** Champs réutilisés par les modèles d'acteurs et d'objets. */
import { CHARACTERISTICS, SKILLS } from "../config.mjs";

const { ArrayField, BooleanField, HTMLField, NumberField, SchemaField, StringField } = foundry.data.fields;

export const int = (initial = 0, options = {}) => new NumberField({ required: true, nullable: false, integer: true, initial, ...options });
export const str = (initial = "", options = {}) => new StringField({ required: true, blank: true, initial, ...options });
export const bool = (initial = false) => new BooleanField({ initial });
export const html = () => new HTMLField({ required: true, blank: true });

/** Six caractéristiques, valeur d'achat (1 à 5 à la création, 6 maximum ensuite). */
export function characteristicsField(initial = 2) {
  return new SchemaField(Object.fromEntries(Object.keys(CHARACTERISTICS).map(k => [k, new SchemaField({
    value: int(initial, { min: 0, max: 7 })
  })])));
}

/** Compétences : rang acheté, compétence de carrière forcée, caractéristique (modifiable pour les variantes de règles). */
export function skillsField() {
  return new SchemaField(Object.fromEntries(Object.entries(SKILLS).map(([k, s]) => [k, new SchemaField({
    rank: int(0, { min: 0, max: 6 }),
    career: bool(),
    characteristic: str(s.characteristic, { blank: false, choices: Object.keys(CHARACTERISTICS) })
  })])));
}

/** Source bibliographique. */
export function sourceField() {
  return new SchemaField({
    book: str(""),
    page: str("")
  });
}

/**
 * Modificateurs mécaniques portés par un objet (talent, espèce, armure, blessure critique…).
 * `type` : woundThreshold, strainThreshold, soak, defenseMelee, defenseRanged, encumbranceThreshold,
 * forceRating, characteristic, skillRank, skillBoost, skillRemoveSetback, skillCareer.
 * `key` : clé de caractéristique ou de compétence quand le type en demande une.
 */
export function modifiersField() {
  return new ArrayField(new SchemaField({
    type: str("woundThreshold", { blank: false }),
    key: str(""),
    value: int(1)
  }));
}

/** Jauge valeur / maximum (le maximum est généralement dérivé). */
export function trackField(value = 0) {
  return new SchemaField({ value: int(value, { min: 0 }) });
}
