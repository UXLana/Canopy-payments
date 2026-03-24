'use client'

import React, { forwardRef } from 'react'
import {
  colors,
  spacing,
  borderRadius,
  transitionPresets,
} from '@/styles/design-tokens'

// =============================================================================
// TYPES & CONTRACTS
// =============================================================================

export type ProgressBarSize = 'sm' | 'md' | 'lg'
export type ProgressBarVariant = 'default' | 'success' | 'error'

export interface ProgressBarProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Current value (ignored when indeterminate) */
  value?: number
  /** Minimum value */
  min?: number
  /** Maximum value */
  max?: number
  /** Show indeterminate animation instead of value-based fill */
  indeterminate?: boolean
  /** Bar height size */
  size?: ProgressBarSize
  /** Visual variant — default (brand), success, or error */
  variant?: ProgressBarVariant
  /** Accessible label — required when no visible label is associated */
  'aria-label'?: string
}

// =============================================================================
// SIZE CONFIG
// =============================================================================

const sizeConfig: Record<ProgressBarSize, string> = {
  sm: spacing['2xs'],  // 4px
  md: spacing.xs,      // 8px
  lg: spacing.sm,      // 12px
}

// =============================================================================
// VARIANT CONFIG
// =============================================================================

const variantConfig: Record<ProgressBarVariant, string> = {
  default: colors.brand.default,
  success: colors.status?.success ?? colors.brand.default,
  error: colors.status?.important ?? colors.brand.default,
}

// =============================================================================
// KEYFRAMES (injected once)
// =============================================================================

const ANIMATION_NAME = 'mtr-progress-indeterminate'
let styleInjected = false

function injectKeyframes() {
  if (styleInjected || typeof document === 'undefined') return
  const style = document.createElement('style')
  style.textContent = `
    @keyframes ${ANIMATION_NAME} {
      0% { transform: translateX(-100%); }
      100% { transform: translateX(250%); }
    }
  `
  document.head.appendChild(style)
  styleInjected = true
}

// =============================================================================
// COMPONENT
// =============================================================================

export const ProgressBar = forwardRef<HTMLDivElement, ProgressBarProps>(
  (
    {
      value = 0,
      min = 0,
      max = 100,
      indeterminate = false,
      size = 'md',
      variant = 'default',
      className,
      style,
      ...rest
    },
    ref
  ) => {
    // Inject indeterminate animation on first render if needed
    React.useEffect(() => {
      if (indeterminate) injectKeyframes()
    }, [indeterminate])

    const clamped = Math.min(max, Math.max(min, value))
    const percent = max > min ? ((clamped - min) / (max - min)) * 100 : 0

    const trackHeight = sizeConfig[size]
    const fillColor = variantConfig[variant]

    return (
      <div
        ref={ref}
        role="progressbar"
        aria-valuemin={indeterminate ? undefined : min}
        aria-valuemax={indeterminate ? undefined : max}
        aria-valuenow={indeterminate ? undefined : clamped}
        className={className}
        style={{
          width: '100%',
          height: trackHeight,
          overflow: 'hidden',
          borderRadius: borderRadius.full,
          backgroundColor: colors.surface?.lightDarker ?? colors.surface?.paper,
          ...style,
        }}
        {...rest}
      >
        <div
          style={{
            width: indeterminate ? '40%' : `${percent}%`,
            height: '100%',
            borderRadius: borderRadius.full,
            backgroundColor: fillColor,
            transition: indeterminate
              ? undefined
              : `width ${transitionPresets.default}`,
            ...(indeterminate
              ? {
                  animation: `${ANIMATION_NAME} 1.5s ease-in-out infinite`,
                }
              : {}),
          }}
        />
      </div>
    )
  }
)

ProgressBar.displayName = 'ProgressBar'
