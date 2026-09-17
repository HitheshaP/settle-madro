import { motion, type HTMLMotionProps } from 'framer-motion'
import type { ReactNode } from 'react'

interface ButtonProps extends Omit<HTMLMotionProps<'button'>, 'children'> {
  children: ReactNode
  variant?: 'primary' | 'secondary' | 'ghost'
}

const variantStyles: Record<NonNullable<ButtonProps['variant']>, string> = {
  primary: 'bg-coral text-white shadow-[var(--shadow-lift)]',
  secondary: 'bg-white text-ink shadow-[var(--shadow-soft)] border border-[var(--color-border-soft)]',
  ghost: 'bg-transparent text-coral',
}

export default function Button({ children, variant = 'primary', className = '', ...props }: ButtonProps) {
  return (
    <motion.button
      whileTap={{ scale: 0.96 }}
      whileHover={{ scale: 1.02 }}
      transition={{ type: 'spring', stiffness: 400, damping: 22 }}
      className={`tap-target flex items-center justify-center gap-2 rounded-[var(--radius-pill)] px-6 py-3 text-base font-semibold disabled:opacity-50 ${variantStyles[variant]} ${className}`}
      {...props}
    >
      {children}
    </motion.button>
  )
}
