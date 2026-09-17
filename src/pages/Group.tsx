import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import Button from '../components/ui/Button'
import Card from '../components/ui/Card'
import OfflineBanner from '../components/ui/OfflineBanner'
import CharacterAvatar from '../components/characters/CharacterAvatar'
import { subscribeToExpenses, subscribeToGroup, type Expense, type Group as GroupData } from '../lib/groups'
import { useProfiles } from '../lib/useProfiles'
import { useOnlineStatus } from '../lib/useOnlineStatus'

export default function Group() {
  const { groupId } = useParams<{ groupId: string }>()
  const navigate = useNavigate()
  const online = useOnlineStatus()

  const [group, setGroup] = useState<GroupData | null>(null)
  const [expenses, setExpenses] = useState<Expense[]>([])
  const profiles = useProfiles(group?.memberIds ?? [])

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
    <div className="safe-top safe-bottom safe-x flex flex-1 flex-col gap-5 px-5 py-8">
      {!online && <OfflineBanner />}

      <div>
        <h1 className="text-2xl font-semibold text-ink">{group?.name ?? 'Loading...'}</h1>
        {group && <p className="text-muted">Invite code: {group.inviteCode}</p>}
      </div>

      {group && (
        <div className="flex -space-x-2">
          {group.memberIds.map((uid) =>
            profiles[uid] ? (
              <CharacterAvatar key={uid} characterId={profiles[uid].characterId} size={40} />
            ) : (
              <div key={uid} className="h-10 w-10 rounded-full bg-cream-dim" />
            ),
          )}
        </div>
      )}

      <div className="flex gap-3">
        <Button variant="secondary" className="flex-1" onClick={() => navigate(`/groups/${groupId}/add-expense`)}>
          Add Expense
        </Button>
        <Button className="flex-1" onClick={() => navigate(`/groups/${groupId}/settle-up`)}>
          Calculate
        </Button>
      </div>

      <div className="flex flex-col gap-3">
        <h2 className="text-lg font-semibold text-ink">Recent expenses</h2>
        <AnimatePresence>
          {expenses.map((expense, index) => (
            <motion.div
              key={expense.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.04 }}
            >
              <Card className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  {profiles[expense.paidBy] && (
                    <CharacterAvatar characterId={profiles[expense.paidBy].characterId} size={40} />
                  )}
                  <div>
                    <p className="font-medium text-ink">{expense.description}</p>
                    <p className="text-sm text-muted">Paid by {profiles[expense.paidBy]?.name ?? '...'}</p>
                  </div>
                </div>
                <p className="font-semibold text-ink">₹{expense.amount.toFixed(2)}</p>
              </Card>
            </motion.div>
          ))}
        </AnimatePresence>

        {expenses.length === 0 && <Card className="text-center text-muted">No expenses yet.</Card>}
      </div>
    </div>
  )
}
