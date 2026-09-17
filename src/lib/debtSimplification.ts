export interface BalanceExpenseInput {
  amount: number
  paidBy: string
  splitBetween: string[]
  splitType: 'equal' | 'custom'
  customSplits?: Record<string, number>
}

export interface BalanceSettlementInput {
  from: string
  to: string
  amount: number
}

export interface SimplifiedSettlement {
  from: string
  to: string
  amount: number
}

const EPSILON = 0.01

export function computeNetBalances(
  expenses: BalanceExpenseInput[],
  settlements: BalanceSettlementInput[] = [],
): Record<string, number> {
  const balances: Record<string, number> = {}

  const addBalance = (uid: string, delta: number) => {
    balances[uid] = (balances[uid] ?? 0) + delta
  }

  for (const expense of expenses) {
    addBalance(expense.paidBy, expense.amount)

    if (expense.splitType === 'custom' && expense.customSplits) {
      for (const [uid, share] of Object.entries(expense.customSplits)) {
        addBalance(uid, -share)
      }
    } else {
      const share = expense.amount / expense.splitBetween.length
      for (const uid of expense.splitBetween) {
        addBalance(uid, -share)
      }
    }
  }

  for (const settlement of settlements) {
    addBalance(settlement.from, settlement.amount)
    addBalance(settlement.to, -settlement.amount)
  }

  return balances
}

// Greedy min-cash-flow: repeatedly match the largest creditor with the largest
// debtor, settling the smaller of the two amounts, until every balance is zero.
export function simplifyDebts(balances: Record<string, number>): SimplifiedSettlement[] {
  const creditors: { uid: string; amount: number }[] = []
  const debtors: { uid: string; amount: number }[] = []

  for (const [uid, balance] of Object.entries(balances)) {
    if (balance > EPSILON) creditors.push({ uid, amount: balance })
    else if (balance < -EPSILON) debtors.push({ uid, amount: -balance })
  }

  creditors.sort((a, b) => b.amount - a.amount)
  debtors.sort((a, b) => b.amount - a.amount)

  const settlements: SimplifiedSettlement[] = []
  let i = 0
  let j = 0

  while (i < debtors.length && j < creditors.length) {
    const debtor = debtors[i]
    const creditor = creditors[j]
    const amount = Math.min(debtor.amount, creditor.amount)

    if (amount > EPSILON) {
      settlements.push({ from: debtor.uid, to: creditor.uid, amount: Math.round(amount * 100) / 100 })
    }

    debtor.amount -= amount
    creditor.amount -= amount

    if (debtor.amount <= EPSILON) i++
    if (creditor.amount <= EPSILON) j++
  }

  return settlements
}
