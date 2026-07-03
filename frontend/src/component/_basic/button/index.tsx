import React from 'react'
import clsx from 'clsx'

type ButtonProps = {
  type?: "button" | "submit" | "reset"
  disabled?: boolean
  onClick?: () => void
  className?: string
  children: React.ReactNode
}

const Button: React.FC<ButtonProps> = ({ type = "submit", disabled = false, onClick, className, children }) => {
  return (
    <button
      type={type}
      disabled={disabled}
      onClick={onClick}
      className={clsx("bg-blue-500 text-white px-4 py-2 rounded-md flex items-center gap-2", className)}
    >
      {children}
    </button>
  )
}

export default Button