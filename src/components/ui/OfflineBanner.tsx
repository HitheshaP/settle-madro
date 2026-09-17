import { motion } from 'framer-motion'

interface OfflineBannerProps {
  message?: string
}

export default function OfflineBanner({
  message = "You're offline — changes will sync once you're back online.",
}: OfflineBannerProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: -12 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex items-center gap-2 rounded-2xl bg-butter/30 px-4 py-2.5 text-sm text-ink"
    >
      <span>📡</span>
      <span>{message}</span>
    </motion.div>
  )
}
