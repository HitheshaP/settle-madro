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
      setError('Fill in a description, amount, payer, and at least one person to split with.')
      return
    }

    if (splitType === 'custom' && Math.abs(customTotal - numericAmount) > 0.01) {
      setError(
        `Custom splits must add up to ₹${numericAmount.toFixed(2)} (currently ₹${customTotal.toFixed(2)}).`,
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
      setError('Could not save — check your connection and try again.')
    } finally {
      setSaving(false)
    }
  }

  if (!groupId || !group) return null

  return (
    <motion.div
      className="safe-top safe-bottom safe-x flex flex-1 flex-col gap-5 px-5 py-8"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      <h1 className="text-2xl font-semibold text-ink">Add Expense</h1>

      <TextInput
        label="Description"
        placeholder="Dinner, cab, groceries..."
        value={description}
        onChange={(event) => setDescription(event.target.value)}
      />
      <TextInput
        label="Amount"
        type="number"
        inputMode="decimal"
        placeholder="0.00"
        value={amount}
        onChange={(event) => setAmount(event.target.value)}
      />

      <div>
        <p className="mb-2 text-sm font-medium text-muted">Paid by</p>
        <div className="flex flex-wrap gap-3">
          {group.memberIds.map((uid) => (
            <button key={uid} onClick={() => setPaidBy(uid)} className="flex flex-col items-center gap-1">
              <CharacterAvatar characterId={profiles[uid]?.characterId ?? ''} size={48} selected={paidBy === uid} />
              <span className="text-xs text-muted">{profiles[uid]?.name ?? '...'}</span>
            </button>
          ))}
        </div>
      </div>

      <div>
        <p className="mb-2 text-sm font-medium text-muted">Split between</p>
        <div className="flex flex-wrap gap-3">
          {group.memberIds.map((uid) => (
            <button key={uid} onClick={() => toggleMember(uid)} className="flex flex-col items-center gap-1">
              <CharacterAvatar
                characterId={profiles[uid]?.characterId ?? ''}
                size={48}
                selected={splitBetween.includes(uid)}
              />
              <span className="text-xs text-muted">{profiles[uid]?.name ?? '...'}</span>
            </button>
          ))}
        </div>
      </div>

      <div>
        <p className="mb-2 text-sm font-medium text-muted">Split type</p>
        <div className="flex gap-3">
          <Button
            variant={splitType === 'equal' ? 'primary' : 'secondary'}
            className="flex-1"
            onClick={() => setSplitType('equal')}
          >
            Equal
          </Button>
          <Button
            variant={splitType === 'custom' ? 'primary' : 'secondary'}
            className="flex-1"
            onClick={() => setSplitType('custom')}
          >
            Custom
          </Button>
        </div>
      </div>

      {splitType === 'custom' && (
        <div className="flex flex-col gap-2">
          {splitBetween.map((uid) => (
            <div key={uid} className="flex items-center justify-between gap-3">
              <span className="text-sm text-ink">{profiles[uid]?.name ?? '...'}</span>
              <input
                type="number"
                inputMode="decimal"
                className="tap-target w-28 rounded-2xl border border-[var(--color-border-soft)] px-3 py-2 text-right"
                value={customSplits[uid] ?? ''}
                onChange={(event) => setCustomSplits((prev) => ({ ...prev, [uid]: event.target.value }))}
              />
            </div>
          ))}
          <p className={`text-sm ${Math.abs(customTotal - numericAmount) > 0.01 ? 'text-coral-dark' : 'text-mint'}`}>
            Total: ₹{customTotal.toFixed(2)} / ₹{numericAmount.toFixed(2)}
          </p>
        </div>
      )}

      {error && <p className="text-sm text-coral-dark">{error}</p>}

      <Button className="mt-auto w-full" disabled={saving} onClick={handleSubmit}>
        {saving ? 'Saving...' : 'Save Expense'}
      </Button>
    </motion.div>
  )
}
