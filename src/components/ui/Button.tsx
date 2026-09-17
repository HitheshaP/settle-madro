import { motion, type HTMLMotionProps } from 'framer-motion'
import type { ReactNode } from 'react'

interface ButtonProps extends Omit<HTMLMotionProps<'button'>, 'children'> {
  children: ReactNode
  variant?: 'primary' | 'secondary' | 'ghost' | 'accent'
}

const variantStyles: Record<NonNullable<ButtonProps['variant']>, string> = {
  primary:
    'bg-[#1a1a1a]/80 text-white border border-white/[0.08] backdrop-blur-xl shadow-[0_8px_32px_rgba(0,0,0,0.35)] hover:bg-[#1a1a1a]/90 hover:border-white/[0.14] hover:shadow-[0_12px_40px_rgba(0,0,0,0.45)]',
  secondary:
    'bg-white/[0.04] text-white/90 border border-white/[0.08] backdrop-blur-xl shadow-[0_4px_16px_rgba(0,0,0,0.2)] hover:bg-white/[0.08] hover:border-white/[0.14] hover:text-white',
  ghost:
    'bg-transparent text-white/70 hover:text-white border border-transparent hover:border-white/[0.08] backdrop-blur-md',
  accent:
    'bg-[#10b981]/15 text-[#10b981] border border-[#10b981]/20 backdrop-blur-xl shadow-[0_4px_16px_rgba(16,185,129,0.15)] hover:bg-[#10b981]/25 hover:border-[#10b981]/30 hover:text-[#34d399]',
}

export default function Button({ children, variant = 'primary', className = '', ...props }: ButtonProps) {
  return (
    <motion.button
      whileTap={{ scale: 0.97 }}
      whileHover={{ scale: 1.015 }}
      transition={{ type: 'spring', stiffness: 400, damping: 25, duration: 0.2 }}
      className={`tap-target flex items-center justify-center gap-2.5 rounded-2xl px-7 py-3.5 text-[0.9375rem] font-medium tracking-[-0.01em] transition-all duration-200 ease-[cubic-bezier(0.4,0,0.2,1)] disabled:opacity-40 disabled:cursor-not-allowed ${variantStyles[variant]} ${className}`}
      {...props}
    >
      {children}
    </motion.button>
  )
}
