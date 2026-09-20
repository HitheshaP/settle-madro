import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import CharacterAvatar from '../components/characters/CharacterAvatar'
import CharacterPicker from '../components/characters/CharacterPicker'
import { CHARACTERS, getCharacter } from '../components/characters/characterData'
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

    setStep('welcome')
    setSaving(false)
  }

  // Deferring completeOnboarding() until the welcome animation finishes keeps `onboarded`
  // false while it plays — flipping it early makes App.tsx's route-level redirect to
  // /groups fire immediately, skipping the animation and leaving this timer orphaned to
  // fire later and yank navigation wherever the user has since gone.
  useEffect(() => {
    if (step !== 'welcome' || !authUser) return
    const timer = setTimeout(() => {
      completeOnboarding({ uid: authUser.uid, name: name.trim(), characterId })
      navigate('/groups')
    }, 1500)
    return () => clearTimeout(timer)
  }, [step, authUser, name, characterId, completeOnboarding, navigate])

  return (
    <div className="safe-top safe-bottom safe-x relative flex flex-1 flex-col items-center justify-center bg-apple-bg px-6">
      <div className="pointer-events-none absolute inset-0 z-0 bg-[radial-gradient(circle_at_50%_20%,rgba(10,132,255,0.12),transparent_55%)]" />
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
                maxLength={30}
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
            className="flex w-full max-w-md flex-col items-center"
          >
            <Card className="flex w-full flex-col items-center gap-5 text-center border border-apple-border shadow-apple-intense">
              <div className="flex flex-col gap-1.5">
                <h1 className="text-2xl font-bold tracking-tight text-apple-text">Choose Your Character</h1>
                <p className="text-sm text-apple-text-secondary">Pick who represents you in every transaction</p>
              </div>
              <CharacterPicker value={characterId} onChange={setCharacterId} />
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
            <div className="relative p-1 bg-white/5 rounded-full border border-apple-border shadow-apple-smooth">
              <motion.span
                className="absolute inset-0 rounded-full"
                initial={{ scale: 0.8, opacity: 0.6 }}
                animate={{ scale: 1.6, opacity: 0 }}
                transition={{ duration: 1.1, ease: 'easeOut' }}
                style={{ boxShadow: `0 0 0 3px ${getCharacter(characterId).glow}` }}
              />
              <CharacterAvatar characterId={characterId} size={100} />
              {['🪙', '✨', '🎉', '💫'].map((icon, i) => (
                <motion.span
                  key={icon}
                  className="pointer-events-none absolute left-1/2 top-1/2 text-xl"
                  initial={{ x: 0, y: 0, opacity: 0, scale: 0.5 }}
                  animate={{
                    x: Math.cos((i / 4) * Math.PI * 2) * 70,
                    y: Math.sin((i / 4) * Math.PI * 2) * 70,
                    opacity: [0, 1, 0],
                    scale: 1,
                  }}
                  transition={{ duration: 1.1, delay: 0.15 + i * 0.06, ease: 'easeOut' }}
                >
                  {icon}
                </motion.span>
              ))}
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
