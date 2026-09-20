export type ExpenseCategory =
  | 'cake'
  | 'non-veg'
  | 'veg'
  | 'coffee'
  | 'drinks'
  | 'movie'
  | 'shopping'
  | 'rent'
  | 'medical'
  | 'bills'
  | 'gift'
  | 'sports'
  | 'transport'
  | 'food'
  | 'default'

// Order matters — more specific patterns are checked before generic catch-alls
// (e.g. "non-veg" before "veg", "food" last among the food-adjacent rules).
const RULES: { category: ExpenseCategory; pattern: RegExp }[] = [
  { category: 'cake', pattern: /\b(cakes?|birthday|bday|cupcakes?|pastry|pastries)\b/i },
  {
    category: 'non-veg',
    pattern: /\b(non[\s-]?veg(etarian)?|chicken|mutton|biry+ani|kebabs?|tandoori|fish|prawns?|seafood|beef|pork|meat|egg|eggs)\b/i,
  },
  { category: 'veg', pattern: /\b(veg(etarian)?|salad|paneer|tofu)\b/i },
  { category: 'coffee', pattern: /\b(coffee|tea|chai|cafe|latte|cappuccino)\b/i },
  { category: 'drinks', pattern: /\b(drinks?|beers?|bar|pub|cocktails?|wine|alcohol|booze|whisky|whiskey|vodka|rum|beverages?)\b/i },
  { category: 'movie', pattern: /\b(movies?|netflix|cinema|theatre|theater|prime\s?video|hotstar)\b/i },
  { category: 'shopping', pattern: /\b(shopping|clothes|clothing|shoes|footwear|mall|amazon|flipkart)\b/i },
  { category: 'rent', pattern: /\b(rent|hostel|pg)\b/i },
  { category: 'medical', pattern: /\b(medicine|medicines|doctor|hospital|pharmacy|clinic|meds)\b/i },
  { category: 'bills', pattern: /\b(electricity|wifi|internet|recharge|bills?|broadband|utility|utilities)\b/i },
  { category: 'gift', pattern: /\b(gifts?|presents?|surprise)\b/i },
  { category: 'sports', pattern: /\b(gym|cricket|football|badminton|sports?)\b/i },
  { category: 'transport', pattern: /\b(transport|cabs?|taxi|uber|ola|rides?|auto|flight|travel|bus|train|metro|petrol|fuel|gas)\b/i },
  { category: 'food', pattern: /\b(food|pizza|lunch|dinner|breakfast|meals?|restaurant|snacks?|burger|groceries|grocery|takeout|takeaway)\b/i },
]

export function detectExpenseCategory(description: string): ExpenseCategory {
  for (const rule of RULES) {
    if (rule.pattern.test(description)) return rule.category
  }
  return 'default'
}

/** A single representative emoji per category — used for the live preview badge while typing. */
export const CATEGORY_EMOJI: Record<ExpenseCategory, string> = {
  cake: '🎂',
  'non-veg': '🍗',
  veg: '🥗',
  coffee: '☕',
  drinks: '🍺',
  movie: '🎬',
  shopping: '🛍️',
  rent: '🏠',
  medical: '💊',
  bills: '💡',
  gift: '🎁',
  sports: '⚽',
  transport: '🚗',
  food: '🍕',
  default: '💸',
}
