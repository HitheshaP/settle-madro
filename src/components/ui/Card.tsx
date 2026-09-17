import { motion, type HTMLMotionProps } from 'framer-motion'
import type { ReactNode } from 'react'

interface CardProps extends HTMLMotionProps<'div'> {
  children: ReactNode
}

export default function Card({ children, className = '', ...props }: CardProps) {
  return (
    <motion.div
      className={`rounded-[var(--radius-card)] bg-white p-4 shadow-[var(--shadow-soft)] ${className}`}
      {...props}
    >
      {children}
    </motion.div>
  )
}
