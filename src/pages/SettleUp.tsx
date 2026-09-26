import { useEffect, useMemo, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import Card from '../components/ui/Card'
import Button from '../components/ui/Button'
import CharacterAvatar from '../components/characters/CharacterAvatar'
import SettleAnimation from '../components/animations/SettleAnimation'
import { computeNetBalances, simplifyDebts, type SimplifiedSettlement } from '../lib/debtSimplification'
import {
  groupProfileIds,
  isFantastic6Group,
  recordSettlement,
  subscribeToExpenses,
  subscribeToGroup,
  subscribeToSettlements,
  type Expense,
  type Group,
  type Settlement,
} from '../lib/groups'
import { useProfiles } from '../lib/useProfiles'
import { useColorfulMode } from '../lib/useColorfulMode'

const SMALL_AMOUNT_THRESHOLD = 500

function settlementKey(settlement: SimplifiedSettlement) {
  return `${settlement.from}-${settlement.to}-${settlement.amount}`
}

export default function SettleUp() {
  const { groupId } = useParams<{ groupId: string }>()
  const navigate = useNavigate()

  const [group, setGroup] = useState<Group | null>(null)
  const [expenses, setExpenses] = useState<Expense[]>([])
  const [settlements, setSettlements] = useState<Settlement[]>([])
  const [resolvedKeys, setResolvedKeys] = useState<Set<string>>(new Set())
  const [animating, setAnimating] = useState<SimplifiedSettlement | null>(null)

  const profiles = useProfiles(groupProfileIds(group))
  useColorfulMode(isFantastic6Group(group))

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
      // Local fallback
    }
  }

  return (
    <div className="safe-top safe-bottom safe-x flex flex-1 flex-col gap-6 px-6 py-6 bg-apple-bg min-h-screen">
      <div className="flex flex-col gap-1.5 mt-2">
        <button 
          onClick={() => navigate(`/groups/${groupId}`)}
          className="text-apple-accent font-semibold text-sm flex items-center gap-1 mb-2 self-start hover:opacity-85 transition-opacity"
        >
          <span className="text-base">‹</span> Back
        </button>
        <h1 className="text-3xl font-extrabold tracking-tight text-apple-text">Settle Up</h1>
        {group && <p className="text-sm text-apple-text-secondary leading-relaxed">Transactions simplified to optimize payment efficiency.</p>}
      </div>

      <div className="flex flex-col gap-4">
        <AnimatePresence>
          {visible.length === 0 && (
            <motion.div key="empty" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.3 }}>
              <Card className="text-center bg-white/[0.02] border border-apple-border p-8">
                <p className="text-sm font-semibold text-apple-text">Everything is settled! 🎉</p>
                <p className="text-xs text-apple-text-secondary mt-1 font-medium">All accounts are fully balanced.</p>
              </Card>
            </motion.div>
          )}

          {visible.map((settlement, index) => {
            const from = profiles[settlement.from]
            const to = profiles[settlement.to]

            return (
              <motion.div
                key={settlementKey(settlement)}
                layout
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.98 }}
                transition={{ delay: index * 0.05, ease: [0.25, 1, 0.5, 1], duration: 0.3 }}
              >
                <Card className="flex items-center justify-between bg-white/[0.02] border border-apple-border hover:bg-white/[0.04] transition-all duration-200 p-4">
                  <div className="flex items-center gap-3.5">
                    <div className="p-0.5 bg-[#1c1c1e] rounded-full border border-apple-border shadow-sm">
                      <CharacterAvatar characterId={from?.characterId ?? ''} size={36} />
                    </div>
                    
                    <div className="flex flex-col">
                      <p className="text-sm font-bold tracking-tight text-apple-text">
                        {from?.name ?? '...'}
                      </p>
                      <p className="text-[11px] text-apple-text-secondary font-medium">owes {to?.name ?? '...'}</p>
                      <p className="text-sm font-extrabold tracking-tight text-apple-accent mt-0.5">₹{settlement.amount.toFixed(0)}</p>
                    </div>

                    <div className="p-0.5 bg-[#1c1c1e] rounded-full border border-apple-border shadow-sm">
                      <CharacterAvatar characterId={to?.characterId ?? ''} size={36} />
                    </div>
                  </div>
                  <Button className="px-4.5 py-2 text-xs font-bold" onClick={() => setAnimating(settlement)}>
                    Settle
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
