'use client'

import React, { forwardRef } from 'react'
import {
  colors,
  spacing,
  borderRadiusSemantics,
  typography,
  fontFamilies,
  fontWeights,
} from '@/styles/design-tokens'

// =============================================================================
// TYPES & CONTRACTS
// =============================================================================

/**
 * Badge variant determines the visual style
 */
export type BadgeVariant = 'filled' | 'outlined' | 'subtle'

/**
 * Badge color/intent
 */
export type BadgeColor = 'neutral' | 'success' | 'warning' | 'error' | 'info' | 'brand'

/**
 * Badge size
 */
export type BadgeSize = 'sm' | 'md'

/**
 * Badge props
 */
export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  /** Visual variant */
  variant?: BadgeVariant
  /** Color/intent of the badge */
  color?: BadgeColor
  /** Size of the badge */
  size?: BadgeSize
  /** Optional icon to display before text */
  icon?: React.ReactNode
  /** Children content (text) */
  children: React.ReactNode
}

// =============================================================================
// COLOR CONFIGURATIONS — theme-aware via CSS variable tokens
// =============================================================================

type ColorScheme = { background: string; text: string; border: string }

const colorConfig: Record<BadgeColor, {
  filled: ColorScheme
  outlined: ColorScheme
  subtle: ColorScheme
}> = {
  neutral: {
    filled: {
      background: colors.badge.charcoal,
      text: '#FFFFFF',
      border: colors.badge.charcoal,
    },
    outlined: {
      background: 'transparent',
      text: colors.badge.charcoal,
      border: colors.badge.charcoalLight,
    },
    subtle: {
      background: colors.badge.charcoalLight,
      text: colors.badge.charcoal,
      border: 'transparent',
    },
  },
  success: {
    filled: {
      background: colors.badge.success,
      text: '#FFFFFF',
      border: colors.badge.success,
    },
    outlined: {
      background: 'transparent',
      text: colors.badge.success,
      border: colors.badge.success,
    },
    subtle: {
      background: colors.badge.successLight,
      text: colors.badge.success,
      border: 'transparent',
    },
  },
  warning: {
    filled: {
      background: colors.badge.warning,
      text: '#FFFFFF',
      border: colors.badge.warning,
    },
    outlined: {
      background: 'transparent',
      text: colors.badge.warning,
      border: colors.badge.warning,
    },
    subtle: {
      background: colors.badge.yellowLight,
      text: colors.badge.warning,
      border: 'transparent',
    },
  },
  error: {
    filled: {
      background: colors.badge.important,
      text: '#FFFFFF',
      border: colors.badge.important,
    },
    outlined: {
      background: 'transparent',
      text: colors.badge.important,
      border: colors.badge.important,
    },
    subtle: {
      background: colors.badge.importantLight,
      text: colors.badge.important,
      border: 'transparent',
    },
  },
  info: {
    filled: {
      background: colors.badge.info,
      text: '#FFFFFF',
      border: colors.badge.info,
    },
    outlined: {
      background: 'transparent',
      text: colors.badge.info,
      border: colors.badge.info,
    },
    subtle: {
      background: colors.badge.infoLight,
      text: colors.badge.info,
      border: 'transparent',
    },
  },
  brand: {
    filled: {
      background: colors.brand.default,
      text: '#FFFFFF',
      border: colors.brand.default,
    },
    outlined: {
      background: 'transparent',
      text: colors.brand.default,
      border: colors.brand.default,
    },
    subtle: {
      background: colors.brand.lighter,
      text: colors.brand.default,
      border: 'transparent',
    },
  },
}

// =============================================================================
// SIZE CONFIGURATIONS
// =============================================================================

const sizeConfig: Record<BadgeSize, {
  padding: string
  fontSize: string
  lineHeight: string
  iconSize: string
  gap: string
}> = {
  sm: {
    padding: `2px 8px`,
    fontSize: typography.body.xs.fontSize,
    lineHeight: typography.body.xs.lineHeight,
    iconSize: '12px',
    gap: spacing['2xs'],
  },
  md: {
    padding: `4px 10px`,
    fontSize: typography.body.sm.fontSize,
    lineHeight: typography.body.sm.lineHeight,
    iconSize: '14px',
    gap: '6px',
  },
}

// =============================================================================
// COMPONENT
// =============================================================================

/**
 * Badge
 *
 * A small label component for status indicators, categories, and tags.
 *
 * @example
 * <Badge variant="outlined" color="neutral">Uninstalled</Badge>
 * <Badge variant="subtle" color="success" icon={<IconCheck size="xs" />}>Verified</Badge>
 */
export const Badge = forwardRef<HTMLSpanElement, BadgeProps>(
  (
    {
      variant = 'filled',
      color = 'neutral',
      size = 'sm',
      icon,
      children,
      className,
      style,
      ...props
    },
    ref
  ) => {
    const colorScheme = colorConfig[color][variant]
    const sizeScheme = sizeConfig[size]

    const baseStyles: React.CSSProperties = {
      display: 'inline-flex',
      alignItems: 'center',
      gap: sizeScheme.gap,
      padding: sizeScheme.padding,
      fontFamily: fontFamilies.body,
      fontSize: sizeScheme.fontSize,
      fontWeight: fontWeights.medium,
      lineHeight: sizeScheme.lineHeight,
      backgroundColor: colorScheme.background,
      color: colorScheme.text,
      border: `1px solid ${colorScheme.border}`,
      borderRadius: borderRadiusSemantics.badge,
      whiteSpace: 'nowrap',
      ...style,
    }

    const iconStyles: React.CSSProperties = {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      width: sizeScheme.iconSize,
      height: sizeScheme.iconSize,
      flexShrink: 0,
    }

    return (
      <span ref={ref} className={className} style={baseStyles} {...props}>
        {icon && <span style={iconStyles}>{icon}</span>}
        {children}
      </span>
    )
  }
)

Badge.displayName = 'Badge'

export default Badge
