'use client'

import React, { forwardRef } from 'react'
import { colors, spacing } from '@/styles/design-tokens'

// =============================================================================
// TYPES & CONTRACTS
// =============================================================================

export interface DividerProps extends React.HTMLAttributes<HTMLHRElement> {
  /** Orientation of the divider */
  orientation?: 'horizontal' | 'vertical'
  /** Visual weight */
  variant?: 'light' | 'medium' | 'heavy'
  /** Spacing above and below (horizontal) or left and right (vertical) */
  spacing?: 'none' | 'sm' | 'md' | 'lg'
  /** For dark backgrounds */
  onDark?: boolean
}

// =============================================================================
// COMPONENT: Divider
// =============================================================================

const spacingMap = {
  none: '0px',
  sm: spacing.xs,
  md: spacing.md,
  lg: spacing.xl,
} as const

const weightMap = {
  light: '1px',
  medium: '2px',
  heavy: '4px',
} as const

export const Divider = forwardRef<HTMLHRElement, DividerProps>(
  (
    {
      orientation = 'horizontal',
      variant = 'light',
      spacing: spacingProp = 'md',
      onDark = false,
      className,
      style,
      ...props
    },
    ref
  ) => {
    const borderColor = onDark
      ? colors.border.lowEmphasis.onDark
      : variant === 'heavy'
        ? colors.border.highEmphasis.onLight
        : variant === 'medium'
          ? colors.border.midEmphasis.onLight
          : colors.border.lowEmphasis.onLight

    const thickness = weightMap[variant]
    const gap = spacingMap[spacingProp]

    const baseStyles: React.CSSProperties = {
      border: 'none',
      margin: 0,
      flexShrink: 0,
    }

    const horizontalStyles: React.CSSProperties = {
      ...baseStyles,
      width: '100%',
      height: thickness,
      backgroundColor: borderColor,
      marginTop: gap,
      marginBottom: gap,
    }

    const verticalStyles: React.CSSProperties = {
      ...baseStyles,
      width: thickness,
      height: 'auto',
      alignSelf: 'stretch',
      backgroundColor: borderColor,
      marginLeft: gap,
      marginRight: gap,
    }

    const dividerStyles = orientation === 'vertical' ? verticalStyles : horizontalStyles

    return (
      <hr
        ref={ref}
        role={orientation === 'vertical' ? 'separator' : undefined}
        aria-orientation={orientation === 'vertical' ? 'vertical' : undefined}
        className={className}
        style={{ ...dividerStyles, ...style }}
        {...props}
      />
    )
  }
)

Divider.displayName = 'Divider'

export default Divider
