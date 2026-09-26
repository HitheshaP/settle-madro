import { useEffect, useState } from 'react'
import { useLocation, useNavigate, useParams } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import Button from '../components/ui/Button'
import Card from '../components/ui/Card'
import OfflineBanner from '../components/ui/OfflineBanner'
import CharacterAvatar from '../components/characters/CharacterAvatar'
import {
  claimFantastic6Character,
  groupParticipants,
  groupProfileIds,
  isFantastic6Group,
  subscribeToExpenses,
  subscribeToGroup,
  type Expense,
  type Group as GroupData,
} from '../lib/groups'
import { fantastic6Profile } from '../lib/fantastic6'
import { useProfiles } from '../lib/useProfiles'
import { useOnlineStatus } from '../lib/useOnlineStatus'
import { useAppStore } from '../lib/store'
import { useFantastic6Access } from '../lib/useFantastic6Access'

export default function Group() {
  const { groupId } = useParams<{ groupId: string }>()
  const navigate = useNavigate()
  const location = useLocation()
  const online = useOnlineStatus()
  const currentUser = useAppStore((state) => state.user)

  const [group, setGroup] = useState<GroupData | null>(null)
  const [expenses, setExpenses] = useState<Expense[]>([])
  const participants = group ? groupParticipants(group) : []
  const profiles = useProfiles(groupProfileIds(group))
  const f6 = isFantastic6Group(group)
  const myCrewId = useFantastic6Access(f6)
  const savedCrewId = currentUser ? group?.crew?.[currentUser.uid] : undefined

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

  // In Fantastic 6 you're whoever you picked on the way in this visit — record that on the group.
  useEffect(() => {
    if (!f6 || !groupId || !currentUser || !myCrewId || savedCrewId === myCrewId) return
    claimFantastic6Character(groupId, currentUser.uid, myCrewId).catch(() => {
      // Non-fatal: the group still works; the next visit will retry.
    })
  }, [f6, groupId, currentUser, myCrewId, savedCrewId])

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
          onClick={() => navigate(f6 ? '/fantastic6' : '/groups')}
          className="text-apple-accent font-semibold text-sm flex items-center gap-1 mb-2 self-start hover:opacity-85 transition-opacity"
        >
          <span className="text-base">‹</span> {f6 ? 'Fantastic 6' : 'Groups'}
        </button>
        <h1 className="text-3xl font-extrabold tracking-tight text-apple-text">
          {group?.name ?? 'Loading...'}
          {f6 && <span className="ml-2">✨</span>}
        </h1>
        {f6 && myCrewId && (
          <p className="text-xs font-medium tracking-wide text-apple-text-secondary">
            You're <span className="font-bold text-apple-text">{fantastic6Profile(myCrewId).name}</span>
            {` · ${participants.length} of 6 in`}
          </p>
        )}
        {group && (
          <p className="text-xs text-apple-text-secondary font-medium tracking-wide">
            INVITE CODE: <span className="text-apple-text select-all font-mono font-bold">{group.inviteCode}</span>
          </p>
        )}
      </div>

      {group && (
        <div className="flex -space-x-2 mt-1">
          {participants.map((uid) =>
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
        {expenses.length > 0 && (
          <p className="-mt-2 pl-1 text-[11px] font-medium text-apple-text-secondary">Tap an expense to edit it.</p>
        )}
        <AnimatePresence>
          {expenses.map((expense, index) => (
            <motion.div
              key={expense.id}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.04, ease: [0.25, 1, 0.5, 1], duration: 0.3 }}
            >
              <Card
                onClick={() => navigate(`/groups/${groupId}/expenses/${expense.id}/edit`)}
                whileTap={{ scale: 0.98 }}
                className="flex cursor-pointer items-center justify-between bg-white/[0.02] border border-apple-border hover:bg-white/[0.04] transition-colors duration-200"
              >
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
                  <p className="text-[10px] font-semibold text-apple-accent mt-0.5">Edit ›</p>
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
