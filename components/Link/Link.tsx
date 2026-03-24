'use client'

import React, { forwardRef } from 'react'
import {
  colors,
  typography,
  fontFamilies,
  fontWeights,
} from '@/styles/design-tokens'

// =============================================================================
// TYPES & CONTRACTS
// =============================================================================

export interface LinkProps extends React.AnchorHTMLAttributes<HTMLAnchorElement> {
  /** Link text size */
  size?: 'sm' | 'md' | 'lg'
  /** Visual variant */
  variant?: 'default' | 'subtle' | 'inverted'
  /** Whether to show an external link icon */
  external?: boolean
  /** Disable the link */
  disabled?: boolean
  /** Children content */
  children: React.ReactNode
}

// =============================================================================
// EXTERNAL LINK ICON
// =============================================================================

const ExternalIcon = ({ size }: { size: number }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 12 12"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    aria-hidden="true"
    style={{ marginLeft: '2px', verticalAlign: 'middle' }}
  >
    <path
      d="M5 2H3C2.44772 2 2 2.44772 2 3V9C2 9.55228 2.44772 10 3 10H9C9.55228 10 10 9.55228 10 9V7M7 2H10M10 2V5M10 2L5.5 6.5"
      stroke="currentColor"
      strokeWidth="1.25"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
)

// =============================================================================
// COMPONENT: Link
// =============================================================================

const sizeStyles = {
  sm: {
    fontSize: typography.body.xs.fontSize,
    lineHeight: typography.body.xs.lineHeight,
    iconSize: 10,
  },
  md: {
    fontSize: typography.body.sm.fontSize,
    lineHeight: typography.body.sm.lineHeight,
    iconSize: 12,
  },
  lg: {
    fontSize: typography.body.md.fontSize,
    lineHeight: typography.body.md.lineHeight,
    iconSize: 14,
  },
} as const

export const Link = forwardRef<HTMLAnchorElement, LinkProps>(
  (
    {
      size = 'md',
      variant = 'default',
      external = false,
      disabled = false,
      children,
      className,
      style,
      ...props
    },
    ref
  ) => {
    const [isHovered, setIsHovered] = React.useState(false)

    const textColor = disabled
      ? colors.text.disabled.onLight
      : variant === 'inverted'
        ? '#FFFFFF'
        : variant === 'subtle'
          ? colors.text.highEmphasis.onLight
          : colors.text.action.enabled

    const hoverColor = disabled
      ? colors.text.disabled.onLight
      : variant === 'inverted'
        ? 'rgba(255, 255, 255, 0.80)'
        : variant === 'subtle'
          ? colors.text.action.enabled
          : colors.text.action.hover

    const currentSize = sizeStyles[size]

    const linkStyles: React.CSSProperties = {
      fontFamily: fontFamilies.body,
      fontSize: currentSize.fontSize,
      fontWeight: fontWeights.medium,
      lineHeight: currentSize.lineHeight,
      color: isHovered && !disabled ? hoverColor : textColor,
      textDecoration: 'underline',
      textUnderlineOffset: '2px',
      cursor: disabled ? 'not-allowed' : 'pointer',
      opacity: disabled ? 0.6 : 1,
      transition: 'color 0.15s ease',
      display: 'inline-flex',
      alignItems: 'center',
      ...style,
    }

    return (
      <a
        ref={ref}
        className={className}
        style={linkStyles}
        onMouseEnter={() => !disabled && setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        aria-disabled={disabled || undefined}
        tabIndex={disabled ? -1 : undefined}
        target={external ? '_blank' : undefined}
        rel={external ? 'noopener noreferrer' : undefined}
        {...props}
      >
        {children}
        {external && <ExternalIcon size={currentSize.iconSize} />}
      </a>
    )
  }
)

Link.displayName = 'Link'

export default Link
