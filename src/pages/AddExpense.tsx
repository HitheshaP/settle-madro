import { useEffect, useMemo, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { motion } from 'framer-motion'
import Button from '../components/ui/Button'
import TextInput from '../components/ui/TextInput'
import CharacterAvatar from '../components/characters/CharacterAvatar'
import { addExpense, subscribeToGroup, type Group } from '../lib/groups'
import { useProfiles } from '../lib/useProfiles'
import { useAppStore } from '../lib/store'

export default function AddExpense() {
  const { groupId } = useParams<{ groupId: string }>()
  const navigate = useNavigate()
  const currentUser = useAppStore((state) => state.user)

  const [group, setGroup] = useState<Group | null>(null)
  const [description, setDescription] = useState('')
  const [amount, setAmount] = useState('')
  const [paidBy, setPaidBy] = useState(currentUser?.uid ?? '')
  const [splitBetween, setSplitBetween] = useState<string[]>([])
  const [splitType, setSplitType] = useState<'equal' | 'custom'>('equal')
  const [customSplits, setCustomSplits] = useState<Record<string, string>>({})
  const [error, setError] = useState<string | null>(null)
  const [saving, setSaving] = useState(false)

  const profiles = useProfiles(group?.memberIds ?? [])

  useEffect(() => {
    if (!groupId) return
    return subscribeToGroup(groupId, (nextGroup) => {
      setGroup(nextGroup)
      if (nextGroup) setSplitBetween((prev) => (prev.length ? prev : nextGroup.memberIds))
    })
  }, [groupId])

  const numericAmount = Number(amount) || 0

  const customTotal = useMemo(
    () => Object.values(customSplits).reduce((sum, value) => sum + (Number(value) || 0), 0),
    [customSplits],
  )

  const toggleMember = (uid: string) => {
    setSplitBetween((prev) => (prev.includes(uid) ? prev.filter((id) => id !== uid) : [...prev, uid]))
  }

  const handleSubmit = async () => {
    setError(null)

    if (!groupId || !description.trim() || numericAmount <= 0 || !paidBy || splitBetween.length === 0) {
      setError('Required fields: description, amount, payer, and at least one member.')
      return
    }

    if (splitType === 'custom' && Math.abs(customTotal - numericAmount) > 0.01) {
      setError(
        `Sum of custom splits (₹${customTotal.toFixed(2)}) must equal total (₹${numericAmount.toFixed(2)}).`,
      )
      return
    }

    setSaving(true)
    try {
      await addExpense(groupId, {
        description: description.trim(),
        amount: numericAmount,
        paidBy,
        splitBetween,
        splitType,
        ...(splitType === 'custom'
          ? {
              customSplits: Object.fromEntries(
                splitBetween.map((uid) => [uid, Number(customSplits[uid]) || 0]),
              ),
            }
          : {}),
      })
      navigate(`/groups/${groupId}`)
    } catch {
      setError('Network request failed. Please check connection.')
    } finally {
      setSaving(false)
    }
  }

  if (!groupId || !group) return null

  return (
    <motion.div
      className="safe-top safe-bottom safe-x flex flex-1 flex-col gap-6 px-6 py-6 bg-apple-bg min-h-screen"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ ease: [0.25, 1, 0.5, 1], duration: 0.3 }}
    >
      <div className="flex flex-col gap-1.5 mt-2">
        <button 
          onClick={() => navigate(`/groups/${groupId}`)}
          className="text-apple-accent font-semibold text-sm flex items-center gap-1 mb-2 self-start hover:opacity-85 transition-opacity"
        >
          <span className="text-base">‹</span> Back
        </button>
        <h1 className="text-3xl font-extrabold tracking-tight text-apple-text">Add Expense</h1>
      </div>

      <div className="flex flex-col gap-5">
        <TextInput
          label="What was this for?"
          placeholder="Dinner, transport, groceries..."
          value={description}
          onChange={(event) => setDescription(event.target.value)}
        />
        <TextInput
          label="How much?"
          type="number"
          inputMode="decimal"
          placeholder="0.00"
          value={amount}
          onChange={(event) => setAmount(event.target.value)}
        />
      </div>

      <div className="flex flex-col gap-3">
        <p className="text-[12px] font-semibold text-apple-text-secondary uppercase tracking-widest pl-1">Paid By</p>
        <div className="flex flex-wrap gap-4 pl-1">
          {group.memberIds.map((uid) => (
            <button key={uid} onClick={() => setPaidBy(uid)} className="flex flex-col items-center gap-1.5 focus:outline-none">
              <div className={`p-0.5 rounded-full transition-all duration-200 ${paidBy === uid ? 'ring-2 ring-apple-accent scale-105' : 'opacity-60 hover:opacity-80'}`}>
                <CharacterAvatar characterId={profiles[uid]?.characterId ?? ''} size={48} />
              </div>
              <span className={`text-[11px] font-semibold transition-colors duration-200 ${paidBy === uid ? 'text-apple-accent' : 'text-apple-text-secondary'}`}>
                {profiles[uid]?.name ?? '...'}
              </span>
            </button>
          ))}
        </div>
      </div>

      <div className="flex flex-col gap-3">
        <p className="text-[12px] font-semibold text-apple-text-secondary uppercase tracking-widest pl-1">Split Between</p>
        <div className="flex flex-wrap gap-4 pl-1">
          {group.memberIds.map((uid) => (
            <button key={uid} onClick={() => toggleMember(uid)} className="flex flex-col items-center gap-1.5 focus:outline-none">
              <div className={`p-0.5 rounded-full transition-all duration-200 ${splitBetween.includes(uid) ? 'ring-2 ring-apple-accent scale-105' : 'opacity-40 hover:opacity-60'}`}>
                <CharacterAvatar characterId={profiles[uid]?.characterId ?? ''} size={48} />
              </div>
              <span className={`text-[11px] font-semibold transition-colors duration-200 ${splitBetween.includes(uid) ? 'text-apple-accent' : 'text-apple-text-secondary'}`}>
                {profiles[uid]?.name ?? '...'}
              </span>
            </button>
          ))}
        </div>
      </div>

      <div className="flex flex-col gap-3">
        <p className="text-[12px] font-semibold text-apple-text-secondary uppercase tracking-widest pl-1">Split Type</p>
        <div className="flex gap-3">
          <Button
            variant={splitType === 'equal' ? 'primary' : 'secondary'}
            className="flex-1 text-sm py-3 font-semibold"
            onClick={() => setSplitType('equal')}
          >
            Equal
          </Button>
          <Button
            variant={splitType === 'custom' ? 'primary' : 'secondary'}
            className="flex-1 text-sm py-3 font-semibold"
            onClick={() => setSplitType('custom')}
          >
            Custom
          </Button>
        </div>
      </div>

      {splitType === 'custom' && (
        <div className="flex flex-col gap-3.5 bg-white/[0.02] border border-apple-border rounded-2xl p-4 mt-2">
          {splitBetween.map((uid) => (
            <div key={uid} className="flex items-center justify-between gap-4">
              <span className="text-sm font-semibold text-apple-text">{profiles[uid]?.name ?? '...'}</span>
              <div className="relative flex items-center">
                <span className="absolute left-3.5 text-sm font-semibold text-apple-text-secondary">₹</span>
                <input
                  type="number"
                  inputMode="decimal"
                  className="apple-input tap-target w-32 pl-7 pr-3.5 py-2.5 text-right text-sm font-bold"
                  value={customSplits[uid] ?? ''}
                  onChange={(event) => setCustomSplits((prev) => ({ ...prev, [uid]: event.target.value }))}
                />
              </div>
            </div>
          ))}
          <div className="border-t border-apple-border/50 pt-3 mt-1 flex justify-between items-center">
            <span className="text-xs font-bold text-apple-text-secondary">Total Allocated</span>
            <p className={`text-sm font-bold tracking-tight ${Math.abs(customTotal - numericAmount) > 0.01 ? 'text-rose-500' : 'text-emerald-500'}`}>
              ₹{customTotal.toFixed(0)} / ₹{numericAmount.toFixed(0)}
            </p>
          </div>
        </div>
      )}

      {error && <p className="text-xs text-rose-500 font-medium pl-1 italic">{error}</p>}

      <Button className="mt-auto w-full py-4 text-sm font-semibold" disabled={saving} onClick={handleSubmit}>
        {saving ? 'Saving...' : 'Save Expense'}
      </Button>
    </motion.div>
  )
}
