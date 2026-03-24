import { forwardRef } from 'react'

export interface IconSuccessFilledProps {
  size?: 'sm' | 'md' | 'lg' | number
  className?: string
  color?: string
}

const sizes = {
  sm: 16,
  md: 20,
  lg: 24,
}

export const IconSuccessFilled = forwardRef<SVGSVGElement, IconSuccessFilledProps>(
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
          d="M12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2ZM16.7071 9.70711C17.0976 9.31658 17.0976 8.68342 16.7071 8.29289C16.3166 7.90237 15.6834 7.90237 15.2929 8.29289L10.5 13.0858L8.70711 11.2929C8.31658 10.9024 7.68342 10.9024 7.29289 11.2929C6.90237 11.6834 6.90237 12.3166 7.29289 12.7071L9.79289 15.2071C10.1834 15.5976 10.8166 15.5976 11.2071 15.2071L16.7071 9.70711Z"
          fill={color}
        />
      </svg>
    )
  }
)

IconSuccessFilled.displayName = 'IconSuccessFilled'
