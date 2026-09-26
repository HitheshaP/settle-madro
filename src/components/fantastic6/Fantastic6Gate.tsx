import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import Modal from '../ui/Modal'
import Button from '../ui/Button'
import TextInput from '../ui/TextInput'
import CharacterAvatar from '../characters/CharacterAvatar'
import { useAppStore } from '../../lib/store'
import { claimFantastic6Character, enterFantastic6Group, subscribeToGroup, type Group } from '../../lib/groups'
import { FANTASTIC6, isFantastic6Code } from '../../lib/fantastic6'

interface Fantastic6GateProps {
  open: boolean
  onClose: () => void
  /** 'pick' skips the code step — used from inside the group to change your character */
  mode?: 'unlock' | 'pick'
  /** Required for 'pick' mode */
  groupId?: string
}

type Step = 'code' | 'loading' | 'pick'

export default function Fantastic6Gate({ open, onClose, mode = 'unlock', groupId: groupIdProp }: Fantastic6GateProps) {
  const navigate = useNavigate()
  const user = useAppStore((state) => state.user)

  const [step, setStep] = useState<Step>('code')
  const [code, setCode] = useState('')
  const [groupId, setGroupId] = useState<string | null>(null)
  const [group, setGroup] = useState<Group | null>(null)
  const [me, setMe] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [busy, setBusy] = useState(false)

  useEffect(() => {
    if (!open) return
    setStep(mode === 'pick' ? 'loading' : 'code')
    setCode('')
    setError(null)
    setGroup(null)
    setGroupId(mode === 'pick' ? (groupIdProp ?? null) : null)
  }, [open, mode, groupIdProp])

  useEffect(() => {
    if (!open || !groupId) return
    return subscribeToGroup(groupId, setGroup)
  }, [open, groupId])

  // Once the group has loaded: returning crew go straight in, newcomers pick a character.
  useEffect(() => {
    if (step !== 'loading' || !group || !groupId || !user) return
    const mine = group.crew?.[user.uid] ?? null
    if (mine && mode === 'unlock') {
      setStep('code') // leave 'loading' so this only fires once
      onClose()
      navigate(`/groups/${groupId}`)
      return
    }
    setMe(mine)
    setStep('pick')
  }, [step, group, groupId, user, mode, onClose, navigate])

  const handleCode = async () => {
    if (!user || !code.trim()) return
    setError(null)
    setBusy(true)
    try {
      if (!(await isFantastic6Code(code))) {
        setError("That's not the secret code 🤫")
        return
      }
      setGroupId(await enterFantastic6Group(code, user.uid))
      setStep('loading')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong. Please retry.')
    } finally {
      setBusy(false)
    }
  }

  const handlePick = async () => {
    if (!groupId || !me || !user) return
    setError(null)
    setBusy(true)
    try {
      await claimFantastic6Character(groupId, user.uid, me)
      onClose()
      if (mode === 'unlock') navigate(`/groups/${groupId}`)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not save your character. Please retry.')
    } finally {
      setBusy(false)
    }
  }

  // Characters already picked by someone else can't be picked again.
  const takenBy = new Map(
    Object.entries(group?.crew ?? {})
      .filter(([uid]) => uid !== user?.uid)
      .map(([uid, characterId]) => [characterId, uid]),
  )

  return (
    <Modal open={open} onClose={onClose}>
      {step === 'code' && (
        <>
          <div className="mb-5 flex items-center gap-3">
            <motion.div
              initial={{ scale: 0.6, rotate: -20, opacity: 0 }}
              animate={{ scale: 1, rotate: 0, opacity: 1 }}
              transition={{ type: 'spring', stiffness: 320, damping: 18 }}
              className="flex h-11 w-11 items-center justify-center rounded-2xl text-xl"
              style={{ background: 'linear-gradient(135deg,#ff006e,#8338ec,#3a86ff)' }}
            >
              ✨
            </motion.div>
            <div>
              <h2 className="text-xl font-bold tracking-tight text-apple-text">Fantastic 6</h2>
              <p className="text-xs font-medium text-apple-text-secondary">Members only. Enter the secret code.</p>
            </div>
          </div>
          <TextInput
            label="Secret code"
            value={code}
            onChange={(event) => setCode(event.target.value)}
            onKeyDown={(event) => event.key === 'Enter' && handleCode()}
            autoCapitalize="off"
            autoCorrect="off"
            autoComplete="off"
            spellCheck={false}
            autoFocus
          />
          {error && <p className="mt-2.5 text-xs font-medium text-rose-500">{error}</p>}
          <Button className="mt-6 w-full py-4 text-sm font-semibold" disabled={busy || !code.trim()} onClick={handleCode}>
            {busy ? 'Checking...' : 'Enter'}
          </Button>
        </>
      )}

      {step === 'loading' && (
        <p className="py-8 text-center text-sm font-medium text-apple-text-secondary">Opening Fantastic 6...</p>
      )}

      {step === 'pick' && (
        <>
          <h2 className="mb-5 text-xl font-bold tracking-tight text-apple-text">Who are you? 👀</h2>
          <div className="grid grid-cols-3 gap-3">
            {FANTASTIC6.map((member) => {
              const selected = me === member.id
              const taken = takenBy.has(member.id)
              return (
                <button
                  key={member.id}
                  onClick={() => setMe(member.id)}
                  disabled={taken}
                  className={`flex flex-col items-center gap-1.5 rounded-2xl border p-2.5 text-center transition-colors duration-200 disabled:opacity-35 ${
                    selected ? 'border-apple-accent bg-apple-accent-dim' : 'border-apple-border bg-white/[0.03]'
                  }`}
                >
                  <CharacterAvatar characterId={member.id} size={60} selected={selected} />
                  <span className="text-sm font-bold text-apple-text">{member.name}</span>
                  {taken && <span className="text-[10px] font-semibold text-apple-text-secondary">Taken</span>}
                </button>
              )
            })}
          </div>
          {error && <p className="mt-2.5 text-xs font-medium text-rose-500">{error}</p>}
          <Button className="mt-6 w-full py-4 text-sm font-semibold" disabled={busy || !me} onClick={handlePick}>
            {busy ? 'Saving...' : mode === 'pick' ? 'Save' : "Let's go ✨"}
          </Button>
        </>
      )}
    </Modal>
  )
}
