import { motion, type HTMLMotionProps } from 'framer-motion'
import type { ReactNode } from 'react'

interface CardProps extends HTMLMotionProps<'div'> {
  children: ReactNode
}

export default function Card({ children, className = '', ...props }: CardProps) {
  return (
    <motion.div
      className={`glass-surface rounded-[var(--radius-apple-lg)] p-5 shadow-apple-smooth ${className}`}
      {...props}
    >
      {children}
    </motion.div>
  )
}
