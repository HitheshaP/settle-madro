import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import Modal from '../ui/Modal'
import Button from '../ui/Button'
import TextInput from '../ui/TextInput'
import CharacterAvatar from '../characters/CharacterAvatar'
import { useAppStore } from '../../lib/store'
import { enterFantastic6Group } from '../../lib/groups'
import { FANTASTIC6, isFantastic6Code } from '../../lib/fantastic6'

interface Fantastic6GateProps {
  open: boolean
  onClose: () => void
  /** 'pick' skips the code step — used to change your character once already unlocked */
  mode?: 'unlock' | 'pick'
  /** Group to pick for, when opened from inside the Fantastic 6 group */
  groupId?: string
}

export default function Fantastic6Gate({ open, onClose, mode = 'unlock', groupId: groupIdProp }: Fantastic6GateProps) {
  const navigate = useNavigate()
  const user = useAppStore((state) => state.user)
  const fantastic6 = useAppStore((state) => state.fantastic6)
  const unlockFantastic6 = useAppStore((state) => state.unlockFantastic6)

  const [step, setStep] = useState<'code' | 'pick'>(mode === 'pick' ? 'pick' : 'code')
  const [code, setCode] = useState('')
  const [groupId, setGroupId] = useState<string | null>(groupIdProp ?? fantastic6?.groupId ?? null)
  const [me, setMe] = useState<string | null>(fantastic6?.me ?? null)
  const [error, setError] = useState<string | null>(null)
  const [busy, setBusy] = useState(false)

  useEffect(() => {
    if (!open) return
    setStep(mode === 'pick' ? 'pick' : 'code')
    setCode('')
    setError(null)
    setGroupId(groupIdProp ?? fantastic6?.groupId ?? null)
    setMe(fantastic6?.me ?? null)
  }, [open, mode, fantastic6, groupIdProp])

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
      setStep('pick')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong. Please retry.')
    } finally {
      setBusy(false)
    }
  }

  const handlePick = () => {
    if (!groupId || !me) return
    unlockFantastic6({ groupId, me })
    onClose()
    navigate(`/groups/${groupId}`)
  }

  return (
    <Modal open={open} onClose={onClose}>
      {step === 'code' ? (
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
            placeholder="••••"
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
      ) : (
        <>
          <h2 className="text-xl font-bold tracking-tight text-apple-text">Who are you? 👀</h2>
          <p className="mb-5 mt-1 text-xs font-medium text-apple-text-secondary">
            Pick your character. You'll be the default payer for expenses you add.
          </p>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
            {FANTASTIC6.map((member) => {
              const selected = me === member.id
              return (
                <button
                  key={member.id}
                  onClick={() => setMe(member.id)}
                  className={`flex flex-col items-center gap-1.5 rounded-2xl border p-3 text-center transition-colors duration-200 ${
                    selected ? 'border-apple-accent bg-apple-accent-dim' : 'border-apple-border bg-white/[0.03]'
                  }`}
                >
                  <CharacterAvatar characterId={member.id} size={64} selected={selected} />
                  <span className="text-sm font-bold text-apple-text">{member.name}</span>
                  <span className="text-[10px] font-medium leading-tight text-apple-text-secondary">{member.tagline}</span>
                </button>
              )
            })}
          </div>
          <Button className="mt-6 w-full py-4 text-sm font-semibold" disabled={!me || !groupId} onClick={handlePick}>
            {mode === 'pick' ? 'Save' : "Let's go ✨"}
          </Button>
        </>
      )}
    </Modal>
  )
}
