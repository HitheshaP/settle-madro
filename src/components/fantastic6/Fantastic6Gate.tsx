import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import Modal from '../ui/Modal'
import Button from '../ui/Button'
import TextInput from '../ui/TextInput'
import CharacterAvatar from '../characters/CharacterAvatar'
import { useAppStore } from '../../lib/store'
import { FANTASTIC6, isFantastic6Code } from '../../lib/fantastic6'

interface Fantastic6GateProps {
  open: boolean
  onClose: () => void
}

/** Secret code → "Who are you?" → the Fantastic 6 home, where groups are created or joined. */
export default function Fantastic6Gate({ open, onClose }: Fantastic6GateProps) {
  const navigate = useNavigate()
  const enterFantastic6 = useAppStore((state) => state.enterFantastic6)

  const [step, setStep] = useState<'code' | 'pick'>('code')
  const [code, setCode] = useState('')
  const [me, setMe] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [busy, setBusy] = useState(false)

  useEffect(() => {
    if (!open) return
    setStep('code')
    setCode('')
    setMe(null)
    setError(null)
  }, [open])

  const handleCode = async () => {
    if (!code.trim()) return
    setError(null)
    setBusy(true)
    try {
      if (await isFantastic6Code(code)) setStep('pick')
      else setError("That's not the secret code 🤫")
    } finally {
      setBusy(false)
    }
  }

  const handlePick = () => {
    if (!me) return
    enterFantastic6(me)
    onClose()
    navigate('/fantastic6')
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
          <h2 className="mb-5 text-xl font-bold tracking-tight text-apple-text">Who are you? 👀</h2>
          <div className="grid grid-cols-3 gap-3">
            {FANTASTIC6.map((member) => {
              const selected = me === member.id
              return (
                <button
                  key={member.id}
                  onClick={() => setMe(member.id)}
                  className={`flex flex-col items-center gap-1.5 rounded-2xl border p-2.5 text-center transition-colors duration-200 ${
                    selected ? 'border-apple-accent bg-apple-accent-dim' : 'border-apple-border bg-white/[0.03]'
                  }`}
                >
                  <CharacterAvatar characterId={member.id} size={60} selected={selected} />
                  <span className="text-sm font-bold text-apple-text">{member.name}</span>
                </button>
              )
            })}
          </div>
          <Button className="mt-6 w-full py-4 text-sm font-semibold" disabled={!me} onClick={handlePick}>
            Let's go ✨
          </Button>
        </>
      )}
    </Modal>
  )
}
