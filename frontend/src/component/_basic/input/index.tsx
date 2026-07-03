import React from 'react'

type TextInputProps = {
  placeholder: string
  value: string
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void
}

const TextInput: React.FC<TextInputProps> = () => {
  return (
    <div>Input</div>
  )
}

export default TextInput