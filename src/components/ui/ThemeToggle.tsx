import { motion } from 'framer-motion'
import { useAppStore } from '../../lib/store'

export default function ThemeToggle() {
  const theme = useAppStore((state) => state.theme)
  const toggleTheme = useAppStore((state) => state.toggleTheme)
  const isDark = theme === 'dark'

  return (
    <button
      onClick={toggleTheme}
      aria-label="Toggle day/night mode"
      className="tap-target relative flex h-8 w-14 items-center rounded-full border border-apple-border bg-white/[0.06] px-1"
    >
      <motion.span
        layout
        transition={{ type: 'spring', stiffness: 500, damping: 32 }}
        className="flex h-6 w-6 items-center justify-center rounded-full bg-apple-text text-[13px] leading-none shadow-apple-smooth"
        style={{ marginLeft: isDark ? 0 : 'auto' }}
      >
        <span className="text-apple-bg">{isDark ? '🌙' : '☀️'}</span>
      </motion.span>
    </button>
  )
}
