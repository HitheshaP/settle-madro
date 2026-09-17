import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import CharacterAvatar from '../components/characters/CharacterAvatar'
import { CHARACTERS } from '../components/characters/characterData'
import Button from '../components/ui/Button'
import TextInput from '../components/ui/TextInput'
import { useAppStore } from '../lib/store'
import { useAnonymousAuth } from '../lib/useAnonymousAuth'
import { saveUserProfile } from '../lib/users'

type Step = 'name' | 'character' | 'welcome'

export default function Onboarding() {
  const navigate = useNavigate()
  const completeOnboarding = useAppStore((state) => state.completeOnboarding)
  const { user: authUser, loading: authLoading, error: authError } = useAnonymousAuth()

  const [step, setStep] = useState<Step>('name')
  const [name, setName] = useState('')
  const [characterId, setCharacterId] = useState(CHARACTERS[0].id)
  const [saving, setSaving] = useState(false)

  const handleFinish = async () => {
    if (!authUser) return
    setSaving(true)

    try {
      await saveUserProfile(authUser.uid, name.trim(), characterId)
    } catch {
      // Firestore write failed (offline) — local state still lets the app proceed.
    }

    completeOnboarding({ uid: authUser.uid, name: name.trim(), characterId })
    setStep('welcome')
    setSaving(false)
    setTimeout(() => navigate('/groups'), 1800)
  }

  return (
    <div className="safe-top safe-bottom safe-x flex flex-1 flex-col items-center justify-center px-6">
      <AnimatePresence mode="wait">
        {step === 'name' && (
          <motion.div
            key="name"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -16 }}
            transition={{ type: 'spring', stiffness: 260, damping: 24 }}
            className="flex w-full max-w-xs flex-col items-center gap-6 text-center"
          >
            <div className="flex h-20 w-20 items-center justify-center rounded-[var(--radius-card)] bg-coral text-4xl shadow-[var(--shadow-lift)]">
              🪙
            </div>
            <div>
              <h1 className="text-2xl font-semibold text-ink">Welcome to Settle Madro</h1>
              <p className="mt-1 text-muted">What should your friends call you?</p>
            </div>
            <TextInput
              placeholder="Your name"
              value={name}
              onChange={(event) => setName(event.target.value)}
              autoFocus
            />
            <Button className="w-full" disabled={!name.trim()} onClick={() => setStep('character')}>
              Continue
            </Button>
          </motion.div>
        )}

        {step === 'character' && (
          <motion.div
            key="character"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -16 }}
            transition={{ type: 'spring', stiffness: 260, damping: 24 }}
            className="flex w-full max-w-sm flex-col items-center gap-6 text-center"
          >
            <div>
              <h1 className="text-2xl font-semibold text-ink">Pick your character</h1>
              <p className="mt-1 text-muted">You can change this later</p>
            </div>
            <div className="grid grid-cols-3 gap-4">
              {CHARACTERS.map((character) => (
                <CharacterAvatar
                  key={character.id}
                  characterId={character.id}
                  size={72}
                  selected={character.id === characterId}
                  onClick={() => setCharacterId(character.id)}
                />
              ))}
            </div>
            {authError && (
              <p className="text-sm text-coral-dark">
                Couldn't connect — check your Firebase setup and connection, then try again.
              </p>
            )}
            <Button className="w-full" disabled={saving || authLoading || !authUser} onClick={handleFinish}>
              {authLoading ? 'Connecting...' : saving ? 'Saving...' : "Let's go"}
            </Button>
          </motion.div>
        )}

        {step === 'welcome' && (
          <motion.div
            key="welcome"
            initial={{ opacity: 0, scale: 0.85 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ type: 'spring', stiffness: 220, damping: 18 }}
            className="flex flex-col items-center gap-4 text-center"
          >
            <CharacterAvatar characterId={characterId} size={96} />
            <h1 className="text-2xl font-semibold text-ink">Hey {name}! 👋</h1>
            <p className="text-muted">Let's split some bills.</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
