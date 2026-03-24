import { forwardRef } from 'react'

export interface IconInfoFilledProps {
  size?: 'sm' | 'md' | 'lg' | number
  className?: string
  color?: string
}

const sizes = {
  sm: 16,
  md: 20,
  lg: 24,
}

export const IconInfoFilled = forwardRef<SVGSVGElement, IconInfoFilledProps>(
  ({ size = 'md', className, color = 'currentColor', ...props }, ref) => {
    const dimension = typeof size === 'number' ? size : sizes[size]

    return (
      <svg
        ref={ref}
        width={dimension}
        height={dimension}
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className={className}
        {...props}
      >
        <path
          fillRule="evenodd"
          clipRule="evenodd"
          d="M12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2ZM12 7C11.4477 7 11 7.44772 11 8C11 8.55228 11.4477 9 12 9C12.5523 9 13 8.55228 13 8C13 7.44772 12.5523 7 12 7ZM11 11C11 10.4477 11.4477 10 12 10C12.5523 10 13 10.4477 13 11V16C13 16.5523 12.5523 17 12 17C11.4477 17 11 16.5523 11 16V11Z"
          fill={color}
        />
      </svg>
    )
  }
)

IconInfoFilled.displayName = 'IconInfoFilled'
