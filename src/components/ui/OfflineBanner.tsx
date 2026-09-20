import { motion } from 'framer-motion'

interface OfflineBannerProps {
  message?: string
  icon?: string
  onDismiss?: () => void
}

export default function OfflineBanner({
  message = "You're offline — changes will sync once you're back online.",
  icon = '📡',
  onDismiss,
}: OfflineBannerProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: -12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -12 }}
      className="flex items-start gap-2 rounded-2xl border border-apple-border bg-apple-accent/10 px-4 py-2.5 text-sm text-apple-text"
    >
      <span>{icon}</span>
      <span className="flex-1 leading-relaxed">{message}</span>
      {onDismiss && (
        <button onClick={onDismiss} className="text-apple-text-secondary hover:text-apple-text" aria-label="Dismiss">
          ✕
        </button>
      )}
    </motion.div>
  )
}
