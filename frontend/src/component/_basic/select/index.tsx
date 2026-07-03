import React from 'react'
import clsx from 'clsx'

type SelectOption = {
  label: string
  value: string
}

type SelectProps = {
  label?: string
  name: string
  options: SelectOption[]
  error?: string
  className?: string
} & React.SelectHTMLAttributes<HTMLSelectElement>

const Select = React.forwardRef<HTMLSelectElement, SelectProps>(
  ({ label, name, options, error, className = '', ...rest }, ref) => {
    return (
      <div className="flex flex-col gap-1">
        {!!label && (
          <label htmlFor={`select-${name}`} className="text-sm font-medium text-gray-700">
            {label}
          </label>
        )}
        <select
          id={`select-${name}`}
          name={name}
          ref={ref}
          className={clsx(
            'w-full p-2 rounded-md border focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white text-gray-800',
            error ? 'border-red-500' : 'border-gray-300',
            className
          )}
          {...rest}
        >
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        {!!error && <p className="text-sm text-red-500">{error}</p>}
      </div>
    )
  }
)

Select.displayName = 'Select'

export default Select
