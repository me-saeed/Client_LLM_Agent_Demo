import React from 'react'
import clsx from 'clsx'

type TextInputProps = {
  label?: string
  name: string
  type?: React.HTMLInputTypeAttribute | 'textarea'
  placeholder?: string
  error?: string
  className?: string
} & (
    | React.InputHTMLAttributes<HTMLInputElement>
    | React.TextareaHTMLAttributes<HTMLTextAreaElement>
  )

const TextInput = React.forwardRef<HTMLInputElement | HTMLTextAreaElement, TextInputProps>(
  ({ label, name, type = 'text', placeholder, error, className = '', ...rest }, ref) => {
    const fieldClassName = clsx(
      'w-full p-2 rounded-md border focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-800',
      error ? 'border-red-500' : 'border-gray-300',
      className
    )

    return (
      <div className="flex flex-col items-start gap-1">
        {!!label && (
          <label htmlFor={`input-${name}`} className="text-sm font-medium text-gray-700">
            {label}
          </label>
        )}
        {type === 'textarea' ? (
          <textarea
            id={`input-${name}`}
            name={name}
            placeholder={placeholder}
            ref={ref as React.Ref<HTMLTextAreaElement>}
            className={clsx(fieldClassName, 'min-h-24 resize-y')}
            {...(rest as React.TextareaHTMLAttributes<HTMLTextAreaElement>)}
          />
        ) : (
          <input
            id={`input-${name}`}
            type={type}
            name={name}
            placeholder={placeholder}
            ref={ref as React.Ref<HTMLInputElement>}
            className={fieldClassName}
            {...(rest as React.InputHTMLAttributes<HTMLInputElement>)}
          />
        )}
        {!!error && <p className="text-sm text-red-500">{error}</p>}
      </div>
    )
  }
)

TextInput.displayName = 'TextInput'

export default TextInput
