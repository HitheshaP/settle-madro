import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import CharacterAvatar from '../components/characters/CharacterAvatar'
import { CHARACTERS } from '../components/characters/characterData'
import Button from '../components/ui/Button'
import TextInput from '../components/ui/TextInput'
import Card from '../components/ui/Card'
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
      // Local state fallback
    }

    completeOnboarding({ uid: authUser.uid, name: name.trim(), characterId })
    setStep('welcome')
    setSaving(false)
    setTimeout(() => navigate('/groups'), 1500)
  }

  return (
    <div className="safe-top safe-bottom safe-x flex flex-1 flex-col items-center justify-center px-6 bg-apple-bg">
      <AnimatePresence mode="wait">
        {step === 'name' && (
          <motion.div
            key="name"
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.98 }}
            transition={{ ease: [0.25, 1, 0.5, 1], duration: 0.4 }}
            className="flex w-full max-w-sm flex-col items-center"
          >
            <Card className="flex w-full flex-col items-center gap-6 text-center border border-apple-border shadow-apple-intense">
              <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-white/5 border border-apple-border text-3xl shadow-apple-smooth">
                💸
              </div>
              <div className="flex flex-col gap-1.5">
                <h1 className="text-2xl font-bold tracking-tight text-apple-text">Settle Madro</h1>
                <p className="text-sm text-apple-text-secondary leading-relaxed">Enter your name to start tracking shared expenses</p>
              </div>
              <TextInput
                placeholder="Name"
                value={name}
                onChange={(event) => setName(event.target.value)}
                autoFocus
                className="w-full text-center"
              />
              <Button 
                variant="primary" 
                className="w-full text-base font-semibold py-4" 
                disabled={!name.trim()} 
                onClick={() => setStep('character')}
              >
                Continue
              </Button>
            </Card>
          </motion.div>
        )}

        {step === 'character' && (
          <motion.div
            key="character"
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.98 }}
            transition={{ ease: [0.25, 1, 0.5, 1], duration: 0.4 }}
            className="flex w-full max-w-sm flex-col items-center"
          >
            <Card className="flex w-full flex-col items-center gap-6 text-center border border-apple-border shadow-apple-intense">
              <div className="flex flex-col gap-1.5">
                <h1 className="text-2xl font-bold tracking-tight text-apple-text">Choose Avatar</h1>
                <p className="text-sm text-apple-text-secondary">Select a visual identity for transactions</p>
              </div>
              <div className="grid grid-cols-3 gap-5 py-2">
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
                <p className="text-xs text-rose-500 font-medium">
                  Authentication issue. Check network or Firebase setup.
                </p>
              )}
              <Button 
                variant="accent" 
                className="w-full text-base py-4 font-semibold" 
                disabled={saving || authLoading || !authUser} 
                onClick={handleFinish}
              >
                {authLoading ? 'Connecting...' : saving ? 'Creating profile...' : 'Get Started'}
              </Button>
            </Card>
          </motion.div>
        )}

        {step === 'welcome' && (
          <motion.div
            key="welcome"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ ease: [0.25, 1, 0.5, 1], duration: 0.3 }}
            className="flex flex-col items-center gap-5 text-center"
          >
            <div className="p-1 bg-white/5 rounded-full border border-apple-border shadow-apple-smooth">
              <CharacterAvatar characterId={characterId} size={100} />
            </div>
            <div className="flex flex-col gap-1">
              <h1 className="text-3xl font-extrabold tracking-tight text-apple-text">Welcome, {name}</h1>
              <p className="text-apple-text-secondary text-base">Your account has been configured.</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
