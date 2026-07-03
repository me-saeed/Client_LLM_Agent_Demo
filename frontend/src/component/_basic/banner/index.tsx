import clsx from 'clsx'
import React from 'react'

type BannerProps = {
  description: string,
  variant: 'success' | 'error' | 'warning' | 'info'
}

const Banner: React.FC<BannerProps> = ({ description, variant = 'info' }) => {
  return (
    <div className={clsx("bg-blue-500 text-white p-1 fixed top-0 inset-x-0 z-50 text-center text-xs", {
      'bg-green-500': variant === 'success',
      'bg-red-500': variant === 'error',
      'bg-yellow-500': variant === 'warning',
      'bg-blue-500': variant === 'info',
    })}>
      <p className="text-sm">{description}</p>
    </div>
  )
}

export default Banner