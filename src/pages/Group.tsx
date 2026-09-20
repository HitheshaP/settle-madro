import { useEffect, useState } from 'react'
import { useLocation, useNavigate, useParams } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import Button from '../components/ui/Button'
import Card from '../components/ui/Card'
import OfflineBanner from '../components/ui/OfflineBanner'
import CharacterAvatar from '../components/characters/CharacterAvatar'
import { subscribeToExpenses, subscribeToGroup, type Expense, type Group as GroupData } from '../lib/groups'
import { useProfiles } from '../lib/useProfiles'
import { useOnlineStatus } from '../lib/useOnlineStatus'
import { useAppStore } from '../lib/store'

export default function Group() {
  const { groupId } = useParams<{ groupId: string }>()
  const navigate = useNavigate()
  const location = useLocation()
  const online = useOnlineStatus()
  const currentUser = useAppStore((state) => state.user)

  const [group, setGroup] = useState<GroupData | null>(null)
  const [expenses, setExpenses] = useState<Expense[]>([])
  const profiles = useProfiles(group?.memberIds ?? [])

  const routeDuplicateNames = (location.state as { duplicateNames?: string[] } | null)?.duplicateNames
  const [duplicateNames, setDuplicateNames] = useState<string[]>(routeDuplicateNames ?? [])

  useEffect(() => {
    if (!groupId) return
    return subscribeToGroup(groupId, setGroup)
  }, [groupId])

  useEffect(() => {
    if (!groupId) return
    return subscribeToExpenses(groupId, setExpenses)
  }, [groupId])

  if (!groupId) return null

  return (
    <div className="safe-top safe-bottom safe-x flex flex-1 flex-col gap-6 px-6 py-6 bg-apple-bg min-h-screen">
      {!online && <OfflineBanner />}

      <AnimatePresence>
        {duplicateNames.length > 0 && currentUser && (
          <OfflineBanner
            icon="👥"
            message={`${duplicateNames.join(', ')} in this group ${duplicateNames.length === 1 ? 'shares' : 'share'} your name "${currentUser.name}". Consider adding an initial (e.g. "${currentUser.name} K.") or "OG" (e.g. "${currentUser.name} OG") next to your name so expenses are easy to tell apart.`}
            onDismiss={() => setDuplicateNames([])}
          />
        )}
      </AnimatePresence>

      <div className="flex flex-col gap-1.5 mt-2">
        <button 
          onClick={() => navigate('/groups')}
          className="text-apple-accent font-semibold text-sm flex items-center gap-1 mb-2 self-start hover:opacity-85 transition-opacity"
        >
          <span className="text-base">‹</span> Groups
        </button>
        <h1 className="text-3xl font-extrabold tracking-tight text-apple-text">{group?.name ?? 'Loading...'}</h1>
        {group && (
          <p className="text-xs text-apple-text-secondary font-medium tracking-wide">
            INVITE CODE: <span className="text-apple-text select-all font-mono font-bold">{group.inviteCode}</span>
          </p>
        )}
      </div>

      {group && (
        <div className="flex -space-x-2 mt-1">
          {group.memberIds.map((uid) =>
            profiles[uid] ? (
              <div key={uid} className="p-0.5 bg-[#1c1c1e] rounded-full border border-apple-border shadow-sm">
                <CharacterAvatar key={uid} characterId={profiles[uid].characterId} size={36} />
              </div>
            ) : (
              <div key={uid} className="h-9 w-9 rounded-full bg-white/5 border border-apple-border" />
            ),
          )}
        </div>
      )}

      <div className="flex gap-3.5 my-1">
        <Button 
          variant="secondary" 
          className="flex-1 font-semibold text-sm" 
          onClick={() => navigate(`/groups/${groupId}/add-expense`)}
        >
          Add Expense
        </Button>
        <Button 
          variant="primary" 
          className="flex-1 font-semibold text-sm" 
          onClick={() => navigate(`/groups/${groupId}/settle-up`)}
        >
          Calculate
        </Button>
      </div>

      <div className="flex flex-col gap-3.5">
        <h2 className="text-xs font-bold tracking-widest text-apple-text-secondary uppercase pl-1">Recent Transactions</h2>
        <AnimatePresence>
          {expenses.map((expense, index) => (
            <motion.div
              key={expense.id}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.04, ease: [0.25, 1, 0.5, 1], duration: 0.3 }}
            >
              <Card className="flex items-center justify-between bg-white/[0.02] border border-apple-border hover:bg-white/[0.04] transition-colors duration-200">
                <div className="flex items-center gap-3.5">
                  {profiles[expense.paidBy] && (
                    <div className="p-0.5 bg-[#1c1c1e] rounded-full border border-apple-border shadow-sm">
                      <CharacterAvatar characterId={profiles[expense.paidBy].characterId} size={36} />
                    </div>
                  )}
                  <div className="flex flex-col">
                    <p className="text-sm font-semibold tracking-tight text-apple-text">
                      {expense.emoji && <span className="mr-1.5">{expense.emoji}</span>}
                      {expense.description}
                    </p>
                    <p className="text-[11px] text-apple-text-secondary font-medium mt-0.5">Paid by {profiles[expense.paidBy]?.name ?? '...'}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-base font-bold tracking-tight text-apple-text">₹{expense.amount.toFixed(0)}</p>
                </div>
              </Card>
            </motion.div>
          ))}
        </AnimatePresence>

        {expenses.length === 0 && (
          <Card className="text-center bg-white/[0.01] border border-apple-border p-8">
            <p className="text-sm text-apple-text-secondary font-medium py-2">No expenses added yet.</p>
          </Card>
        )}
      </div>
    </div>
  )
}
