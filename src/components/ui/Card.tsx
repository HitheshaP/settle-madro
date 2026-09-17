import { motion, type HTMLMotionProps } from 'framer-motion'
import type { ReactNode } from 'react'

interface CardProps extends HTMLMotionProps<'div'> {
  children: ReactNode
  withOrnament?: boolean
}

export default function Card({ children, className = '', withOrnament = false, ...props }: CardProps) {
  return (
    <motion.div
      className={`rounded-[var(--radius-story)] bg-white p-6 shadow-ghibli-soft border border-ghibli-border relative overflow-hidden ${
        withOrnament ? 'card-ornament' : ''
      } ${className}`}
      {...props}
    >
      {/* Soft ambient glow effect */}
      <div className="absolute -top-24 -right-24 w-48 h-48 bg-ghibli-gold/5 rounded-full blur-3xl pointer-events-none" />
      <div className="relative z-10">
        {children}
      </div>
    </motion.div>
  )
}
