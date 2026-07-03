import React from 'react'
import clsx from 'clsx'

type TextInputProps = {
  label?: string
  name: string
  type?: React.HTMLInputTypeAttribute
  placeholder?: string
  value?: string
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void
  className?: string
}

const TextInput: React.FC<TextInputProps> = ({ label, name, type = "text", placeholder, value, onChange, className = "" }) => {
  return (
    <div className="flex flex-col gap-2">
      {!!label && <label htmlFor={`input-${name}`} className='text-sm font-medium text-gray-700'>{label}</label>}
      <input
        id={`input-${name}`}
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        className={clsx("w-full p-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500", className)}
      />
    </div>
  )
}

export default TextInput