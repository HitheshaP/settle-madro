import { CATEGORY_EMOJI, detectExpenseCategory } from './expenseCategory'

// A specific, named item always wins over a vague category word — checked first,
// in order from most-specific dish name to broader ingredient/mode-of-transport words,
// so e.g. "chicken biryani" resolves to biryani's emoji, not plain chicken's.
const SPECIFIC_RULES: { pattern: RegExp; emoji: string }[] = [
  // food — specific dishes
  { pattern: /\bice[\s-]?creams?\b/i, emoji: '🍦' },
  { pattern: /\bbiry+anis?\b/i, emoji: '🍛' },
  { pattern: /\bpizzas?\b/i, emoji: '🍕' },
  { pattern: /\bburgers?\b/i, emoji: '🍔' },
  { pattern: /\bsandwich(es)?\b/i, emoji: '🥪' },
  { pattern: /\bsush?is?\b/i, emoji: '🍣' },
  { pattern: /\bnoodles?\b/i, emoji: '🍜' },
  { pattern: /\bpastas?\b/i, emoji: '🍝' },
  { pattern: /\btandoori\b/i, emoji: '🍢' },
  { pattern: /\bkebabs?\b/i, emoji: '🍢' },
  // food — specific ingredients/proteins
  { pattern: /\bchickens?\b/i, emoji: '🍗' },
  { pattern: /\b(mutton|beef|pork)\b/i, emoji: '🍖' },
  { pattern: /\b(fish|prawns?|seafood)\b/i, emoji: '🐟' },
  { pattern: /\bpaneer\b/i, emoji: '🧀' },
  { pattern: /\beggs?\b/i, emoji: '🍳' },
  // drinks — specific
  { pattern: /\b(cakes?|birthday|bday|cupcakes?)\b/i, emoji: '🎂' },
  { pattern: /\b(coffee|cafe|latte|cappuccino)\b/i, emoji: '☕' },
  { pattern: /\b(tea|chai)\b/i, emoji: '🍵' },
  { pattern: /\b(coke|pepsi|cola|soda)\b/i, emoji: '🥤' },
  { pattern: /\bbeers?\b/i, emoji: '🍺' },
  { pattern: /\bwine\b/i, emoji: '🍷' },
  // outings / shopping — specific
  { pattern: /\btickets?\b/i, emoji: '🎫' },
  { pattern: /\bmovies?\b/i, emoji: '🎬' },
  { pattern: /\bgifts?\b/i, emoji: '🎁' },
  // transport — specific mode
  { pattern: /\b(cabs?|taxi|uber|ola|auto)\b/i, emoji: '🚕' },
  { pattern: /\bflights?\b/i, emoji: '✈️' },
  { pattern: /\btrains?\b/i, emoji: '🚆' },
  { pattern: /\bmetro\b/i, emoji: '🚇' },
  { pattern: /\bbus(es)?\b/i, emoji: '🚌' },
  { pattern: /\b(petrol|fuel|gas)\b/i, emoji: '⛽' },
]

// Vague, generalized words used INSTEAD of naming something specific — mapped to a
// small emoji combo rather than one exact item. Checked only after every specific
// rule above has failed to match.
const GENERALIZED_RULES: { pattern: RegExp; emoji: string }[] = [
  { pattern: /\bbreakfast\b/i, emoji: '🍳🍞' },
  { pattern: /\bdinner\b/i, emoji: '🍗🧀🍰' },
  { pattern: /\blunch\b/i, emoji: '🍗' },
  { pattern: /\bfood\b/i, emoji: '🍗🧀♨️' },
  { pattern: /\b(travel|transport)\b/i, emoji: '🚁' },
]

/**
 * Picks the emoji that best represents a typed expense description.
 * Specific named items (chicken, biryani, uber, coke...) win over vague category
 * words (food, lunch, travel...), which win over the broad category fallback,
 * which itself falls back to 💸 when nothing matches at all.
 */
export function suggestEmoji(description: string): string {
  for (const rule of SPECIFIC_RULES) {
    if (rule.pattern.test(description)) return rule.emoji
  }
  for (const rule of GENERALIZED_RULES) {
    if (rule.pattern.test(description)) return rule.emoji
  }
  return CATEGORY_EMOJI[detectExpenseCategory(description)]
}
