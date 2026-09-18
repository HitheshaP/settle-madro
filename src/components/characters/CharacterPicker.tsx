import { useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import CharacterAvatar from './CharacterAvatar'
import { UNIVERSES, getCharactersByUniverse, getCharacter, type Universe } from './characterData'

interface CharacterPickerProps {
  value: string
  onChange: (id: string) => void
}

export default function CharacterPicker({ value, onChange }: CharacterPickerProps) {
  const [tab, setTab] = useState<Universe>(getCharacter(value).universe)
  const characters = getCharactersByUniverse(tab)

  return (
    <div className="flex w-full flex-col gap-4">
      <div className="flex gap-1 rounded-2xl bg-white/[0.04] border border-apple-border p-1">
        {UNIVERSES.map((u) => (
          <button
            key={u.id}
            onClick={() => setTab(u.id)}
            className={`relative flex-1 rounded-xl py-2 text-xs font-bold tracking-wide transition-colors duration-200 ${
              tab === u.id ? 'text-black' : 'text-apple-text-secondary hover:text-apple-text'
            }`}
          >
            {tab === u.id && (
              <motion.span
                layoutId="universe-pill"
                className="absolute inset-0 rounded-xl bg-white"
                transition={{ type: 'spring', stiffness: 500, damping: 35 }}
              />
            )}
            <span className="relative z-10 flex items-center justify-center gap-1.5">
              <span>{u.icon}</span> {u.label}
            </span>
          </button>
        ))}
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={tab}
          initial={{ opacity: 0, x: 10 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -10 }}
          transition={{ duration: 0.2, ease: [0.25, 1, 0.5, 1] }}
          className="grid grid-cols-4 gap-x-3 gap-y-4 py-1"
        >
          {characters.map((character, index) => (
            <motion.div
              key={character.id}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.03, duration: 0.25 }}
              className="flex flex-col items-center gap-1.5"
            >
              <CharacterAvatar
                characterId={character.id}
                size={58}
                selected={character.id === value}
                onClick={() => onChange(character.id)}
              />
              <span
                className={`text-[9.5px] font-semibold text-center leading-tight ${
                  character.id === value ? 'text-apple-text' : 'text-apple-text-secondary'
                }`}
              >
                {character.name}
              </span>
            </motion.div>
          ))}
        </motion.div>
      </AnimatePresence>
    </div>
  )
}
