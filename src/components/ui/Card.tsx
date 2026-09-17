import { motion, type HTMLMotionProps } from 'framer-motion'
import type { ReactNode } from 'react'

interface CardProps extends HTMLMotionProps<'div'> {
  children: ReactNode
  withOrnament?: boolean
}

export default function Card({ children, className = '', withOrnament = false, ...props }: CardProps) {
  return (
    <motion.div
      className={`relative overflow-hidden rounded-[18px] border border-white/[0.08] bg-[#1a1a1a]/60 p-6 backdrop-blur-[20px] shadow-[0_4px_24px_rgba(0,0,0,0.25),0_1px_3px_rgba(0,0,0,0.15)] transition-all duration-300 ease-[cubic-bezier(0.4,0,0.2,1)] hover:border-white/[0.14] hover:shadow-[0_8px_32px_rgba(0,0,0,0.35)] ${className}`}
      {...props}
    >
      {withOrnament && (
        <div className="absolute -top-16 -right-16 h-40 w-40 rounded-full bg-[#10b981]/10 blur-[32px]" />
      )}
      <div className="relative z-10">
        {children}
      </div>
    </motion.div>
  )
}
