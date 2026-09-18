import { motion, type HTMLMotionProps } from 'framer-motion'
import type { ReactNode } from 'react'

interface ButtonProps extends Omit<HTMLMotionProps<'button'>, 'children'> {
  children: ReactNode
  variant?: 'primary' | 'secondary' | 'ghost' | 'accent'
}

const variantStyles: Record<NonNullable<ButtonProps['variant']>, string> = {
  primary: 'bg-apple-accent text-white shadow-apple-smooth hover:shadow-apple-accent-glow hover:brightness-105 active:brightness-95',
  secondary: 'glass-surface hover:bg-white/[0.08] active:bg-white/[0.02] text-apple-text border border-apple-border',
  ghost: 'bg-transparent text-apple-accent hover:bg-apple-accent/5 active:bg-apple-accent/10',
  accent: 'bg-white text-black shadow-apple-smooth hover:bg-neutral-100 active:bg-neutral-200 font-semibold',
}

export default function Button({ children, variant = 'primary', className = '', ...props }: ButtonProps) {
  return (
    <motion.button
      whileTap={{ scale: 0.98 }}
      whileHover={{ scale: 1.01 }}
      transition={{ type: 'tween', ease: [0.25, 1, 0.5, 1], duration: 0.2 }}
      className={`tap-target flex items-center justify-center gap-2 rounded-[var(--radius-apple-md)] px-6 py-3.5 text-sm font-medium tracking-wide transition-colors duration-200 disabled:opacity-40 disabled:pointer-events-none ${variantStyles[variant]} ${className}`}
      {...props}
    >
      {children}
    </motion.button>
  )
}
