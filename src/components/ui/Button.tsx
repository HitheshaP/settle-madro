import { motion, type HTMLMotionProps } from 'framer-motion'
import type { ReactNode } from 'react'

interface ButtonProps extends Omit<HTMLMotionProps<'button'>, 'children'> {
  children: ReactNode
  variant?: 'primary' | 'secondary' | 'ghost' | 'accent'
}

const variantStyles: Record<NonNullable<ButtonProps['variant']>, string> = {
  primary: 'bg-ghibli-moss text-white shadow-ghibli-soft border-b-4 border-black/20 active:border-b-0 active:translate-y-[2px]',
  secondary: 'bg-ghibli-cream text-ghibli-ink shadow-ghibli-soft border border-ghibli-border',
  ghost: 'bg-transparent text-ghibli-moss font-serif italic',
  accent: 'bg-ghibli-terracotta text-white shadow-ghibli-warm border-b-4 border-black/20 active:border-b-0 active:translate-y-[2px]',
}

export default function Button({ children, variant = 'primary', className = '', ...props }: ButtonProps) {
  return (
    <motion.button
      whileTap={{ scale: 0.98 }}
      whileHover={{ scale: 1.01 }}
      transition={{ type: 'spring', stiffness: 400, damping: 25 }}
      className={`tap-target flex items-center justify-center gap-2 rounded-2xl px-6 py-3 text-base font-semibold transition-all disabled:opacity-50 ${variantStyles[variant]} ${className}`}
      {...props}
    >
      {children}
    </motion.button>
  )
}
