import { motion } from 'framer-motion'
import CharacterAvatar from './CharacterAvatar'
import { CHARACTERS } from './characterData'

interface CharacterPickerProps {
  value: string
  onChange: (id: string) => void
}

export default function CharacterPicker({ value, onChange }: CharacterPickerProps) {
  return (
    <div className="grid max-h-[18rem] w-full grid-cols-4 gap-x-2 gap-y-3 overflow-y-auto py-1 pr-1 [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
      {CHARACTERS.map((character, index) => (
        <motion.div
          key={character.id}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.02, duration: 0.25 }}
          className="flex items-center justify-center"
        >
          <CharacterAvatar
            characterId={character.id}
            size={52}
            shape="square"
            selected={character.id === value}
            onClick={() => onChange(character.id)}
          />
        </motion.div>
      ))}
    </div>
  )
}
