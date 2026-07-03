import React from 'react'

type TextInputProps = {
  type?: React.HTMLInputTypeAttribute
  placeholder?: string
  value?: string
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void
  className?: string
}

const TextInput: React.FC<TextInputProps> = ({ type = "text", placeholder, value, onChange, className = "" }) => {
  return (
    <input type={type} placeholder={placeholder} value={value} onChange={onChange} className={className} />
  )
}

export default TextInput