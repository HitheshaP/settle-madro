import type { InputHTMLAttributes } from 'react'

interface TextInputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string
}

export default function TextInput({ label, id, className = '', ...props }: TextInputProps) {
  return (
    <div className="flex flex-col gap-1.5 w-full">
      {label && (
        <label htmlFor={id} className="text-[12px] font-semibold text-apple-text-secondary uppercase tracking-widest pl-1">
          {label}
        </label>
      )}
      <input
        id={id}
        className={`apple-input tap-target w-full px-4 py-3 text-base outline-none ${className}`}
        {...props}
      />
    </div>
  )
}
