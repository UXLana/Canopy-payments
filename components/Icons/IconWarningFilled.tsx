import { forwardRef } from 'react'

export interface IconWarningFilledProps {
  size?: 'sm' | 'md' | 'lg' | number
  className?: string
  color?: string
}

const sizes = {
  sm: 16,
  md: 20,
  lg: 24,
}

export const IconWarningFilled = forwardRef<SVGSVGElement, IconWarningFilledProps>(
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
          d="M10.2898 3.86001C10.4703 3.56264 10.7231 3.31719 11.0251 3.14709C11.3271 2.97699 11.6678 2.8877 12.0138 2.8877C12.3599 2.8877 12.7006 2.97699 13.0026 3.14709C13.3046 3.31719 13.5574 3.56264 13.7378 3.86001L22.2078 18C22.3825 18.3027 22.4751 18.646 22.4761 18.9955C22.4771 19.345 22.3864 19.6888 22.2134 19.9926C22.0403 20.2963 21.7907 20.5494 21.4892 20.7267C21.1876 20.9041 20.8449 21 20.4958 21H3.53179C3.18262 21 2.83999 20.9041 2.53843 20.7267C2.23686 20.5494 1.98724 20.2963 1.81421 19.9926C1.64118 19.6888 1.55052 19.345 1.5515 18.9955C1.55249 18.646 1.64505 18.3027 1.81979 18L10.2898 3.86001ZM12.0138 8C12.5661 8 13.0138 8.44772 13.0138 9V13C13.0138 13.5523 12.5661 14 12.0138 14C11.4615 14 11.0138 13.5523 11.0138 13V9C11.0138 8.44772 11.4615 8 12.0138 8ZM12.0138 16C11.4615 16 11.0138 16.4477 11.0138 17C11.0138 17.5523 11.4615 18 12.0138 18H12.0238C12.5761 18 13.0238 17.5523 13.0238 17C13.0238 16.4477 12.5761 16 12.0238 16H12.0138Z"
          fill={color}
        />
      </svg>
    )
  }
)

IconWarningFilled.displayName = 'IconWarningFilled'
