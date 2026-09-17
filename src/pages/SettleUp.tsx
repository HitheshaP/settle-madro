import { useEffect, useMemo, useState } from 'react'
import { useParams } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import Card from '../components/ui/Card'
import Button from '../components/ui/Button'
import CharacterAvatar from '../components/characters/CharacterAvatar'
import SettleAnimation from '../components/animations/SettleAnimation'
import { computeNetBalances, simplifyDebts, type SimplifiedSettlement } from '../lib/debtSimplification'
import {
  recordSettlement,
  subscribeToExpenses,
  subscribeToGroup,
  subscribeToSettlements,
  type Expense,
  type Group,
  type Settlement,
} from '../lib/groups'
import { useProfiles } from '../lib/useProfiles'

const SMALL_AMOUNT_THRESHOLD = 500

function settlementKey(settlement: SimplifiedSettlement) {
  return `${settlement.from}-${settlement.to}-${settlement.amount}`
}

export default function SettleUp() {
  const { groupId } = useParams<{ groupId: string }>()

  const [group, setGroup] = useState<Group | null>(null)
  const [expenses, setExpenses] = useState<Expense[]>([])
  const [settlements, setSettlements] = useState<Settlement[]>([])
  const [resolvedKeys, setResolvedKeys] = useState<Set<string>>(new Set())
  const [animating, setAnimating] = useState<SimplifiedSettlement | null>(null)

  const profiles = useProfiles(group?.memberIds ?? [])

  useEffect(() => {
    if (!groupId) return
    const unsubGroup = subscribeToGroup(groupId, setGroup)
    const unsubExpenses = subscribeToExpenses(groupId, setExpenses)
    const unsubSettlements = subscribeToSettlements(groupId, setSettlements)
    return () => {
      unsubGroup()
      unsubExpenses()
      unsubSettlements()
    }
  }, [groupId])

  const simplified = useMemo(
    () => simplifyDebts(computeNetBalances(expenses, settlements)),
    [expenses, settlements],
  )

  const visible = simplified.filter((settlement) => !resolvedKeys.has(settlementKey(settlement)))

  const finishSettle = async (settlement: SimplifiedSettlement) => {
    setAnimating(null)
    setResolvedKeys((prev) => new Set(prev).add(settlementKey(settlement)))
    if (!groupId) return
    try {
      await recordSettlement(groupId, settlement)
    } catch {
      // Offline — the optimistic local state above keeps the UI in sync either way.
    }
  }

  return (
    <div className="safe-top safe-bottom safe-x flex flex-1 flex-col gap-4 px-5 py-8">
      <h1 className="text-2xl font-semibold text-ink">Settle Up</h1>
      {group && <p className="text-muted">Simplified so everyone pays the fewest times possible.</p>}

      <div className="flex flex-col gap-3">
        <AnimatePresence>
          {visible.length === 0 && (
            <motion.div key="empty" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <Card className="text-center text-muted">Everyone's all settled up! 🎉</Card>
            </motion.div>
          )}

          {visible.map((settlement, index) => {
            const from = profiles[settlement.from]
            const to = profiles[settlement.to]

            return (
              <motion.div
                key={settlementKey(settlement)}
                layout
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ delay: index * 0.08, type: 'spring', stiffness: 260, damping: 24 }}
              >
                <Card className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <CharacterAvatar characterId={from?.characterId ?? ''} size={44} />
                    <div className="text-sm">
                      <p className="font-medium text-ink">
                        {from?.name ?? '...'} owes {to?.name ?? '...'}
                      </p>
                      <p className="font-semibold text-coral-dark">₹{settlement.amount.toFixed(2)}</p>
                    </div>
                    <CharacterAvatar characterId={to?.characterId ?? ''} size={44} />
                  </div>
                  <Button className="px-4 py-2 text-sm" onClick={() => setAnimating(settlement)}>
                    Settled
                  </Button>
                </Card>
              </motion.div>
            )
          })}
        </AnimatePresence>
      </div>

      <AnimatePresence>
        {animating && (
          <SettleAnimation
            fromCharacterId={profiles[animating.from]?.characterId ?? ''}
            toCharacterId={profiles[animating.to]?.characterId ?? ''}
            variant={animating.amount < SMALL_AMOUNT_THRESHOLD ? 'coin' : 'cake'}
            onComplete={() => finishSettle(animating)}
          />
        )}
      </AnimatePresence>
    </div>
  )
}
