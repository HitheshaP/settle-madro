import type { InputHTMLAttributes } from 'react'

interface TextInputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string
}

export default function TextInput({ label, id, className = '', ...props }: TextInputProps) {
  return (
    <div className="flex flex-col gap-1.5">
      {label && (
        <label htmlFor={id} className="text-sm font-medium text-muted">
          {label}
        </label>
      )}
      <input
        id={id}
        className={`tap-target w-full rounded-2xl border border-[var(--color-border-soft)] bg-white px-4 py-3 text-base text-ink outline-none transition focus:border-[var(--color-coral)] ${className}`}
        {...props}
      />
    </div>
  )
}
