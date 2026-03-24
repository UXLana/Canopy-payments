'use client'

import React, { forwardRef } from 'react'
import {
  colors,
  spacing,
  typography,
  borderRadius,
  fontFamilies,
  fontWeights,
  shadows,
} from '@/styles/design-tokens'

// =============================================================================
// TYPES & CONTRACTS
// =============================================================================

/**
 * Background style for the banner
 * - solid: Single brand color fill
 * - gradient: Linear gradient between two colors
 */
export type BrandBannerBackground = 'solid' | 'gradient'

/**
 * BrandBanner component props
 */
export interface BrandBannerProps {
  /** Primary heading text (e.g. "Good afternoon, Jane") */
  heading: string
  /** Supporting subtitle text */
  subtitle?: string
  /** Background style: solid color or gradient */
  backgroundStyle?: BrandBannerBackground
  /** Primary brand color (hex, rgb, or CSS color). Defaults to theme brand color. */
  brandColor?: string
  /** Secondary color for gradient mode. If omitted, a darker shade of brandColor is used. */
  gradientEndColor?: string
  /** Gradient direction in degrees (default: 135) */
  gradientAngle?: number
  /** Optional content to render in the right side of the banner (e.g. avatar, icon, illustration) */
  trailing?: React.ReactNode
  /** Additional CSS class name */
  className?: string
  /** Additional inline styles applied to the outer container */
  style?: React.CSSProperties
}

// =============================================================================
// HELPERS
// =============================================================================

/**
 * Darken a hex color by a given amount (0-1)
 */
function darkenHex(hex: string, amount: number): string {
  // Strip # and handle shorthand
  let cleaned = hex.replace('#', '')
  if (cleaned.length === 3) {
    cleaned = cleaned
      .split('')
      .map((c) => c + c)
      .join('')
  }
  const num = parseInt(cleaned, 16)
  const r = Math.max(0, Math.round(((num >> 16) & 0xff) * (1 - amount)))
  const g = Math.max(0, Math.round(((num >> 8) & 0xff) * (1 - amount)))
  const b = Math.max(0, Math.round((num & 0xff) * (1 - amount)))
  return `#${((r << 16) | (g << 8) | b).toString(16).padStart(6, '0')}`
}

/**
 * Determine readable text color (white or dark) for a given background
 */
function contrastTextColor(hex: string): string {
  const cleaned = hex.replace('#', '')
  const r = parseInt(cleaned.substring(0, 2), 16)
  const g = parseInt(cleaned.substring(2, 4), 16)
  const b = parseInt(cleaned.substring(4, 6), 16)
  // Relative luminance (WCAG formula simplified)
  const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255
  return luminance > 0.5 ? '#1A1A1A' : '#FFFFFF'
}

// =============================================================================
// COMPONENT
// =============================================================================

/**
 * BrandBanner - A prominent, customizable greeting/hero banner.
 *
 * Used at the top of dashboard or landing pages to welcome users with
 * editable copy and a configurable brand color or gradient background.
 *
 * @example
 * ```tsx
 * // Solid brand color (uses theme default)
 * <BrandBanner
 *   heading="Good afternoon, Jane"
 *   subtitle="Here's what's happening in your registry today."
 * />
 *
 * // Custom gradient
 * <BrandBanner
 *   heading="Welcome back"
 *   subtitle="You have 3 new notifications."
 *   backgroundStyle="gradient"
 *   brandColor="#2D6A4F"
 *   gradientEndColor="#1B4332"
 * />
 * ```
 */
export const BrandBanner = forwardRef<HTMLDivElement, BrandBannerProps>(
  (
    {
      heading,
      subtitle,
      backgroundStyle = 'solid',
      brandColor,
      gradientEndColor,
      gradientAngle = 135,
      trailing,
      className,
      style,
      ...props
    },
    ref
  ) => {
    // Resolve brand color — fall back to the theme brand token
    const resolvedBrand = brandColor || colors.brand.default

    // Resolve end color for gradient
    const resolvedEnd =
      gradientEndColor ||
      (typeof resolvedBrand === 'string' && resolvedBrand.startsWith('#')
        ? darkenHex(resolvedBrand, 0.25)
        : resolvedBrand)

    // Background
    const background =
      backgroundStyle === 'gradient'
        ? `linear-gradient(${gradientAngle}deg, ${resolvedBrand}, ${resolvedEnd})`
        : resolvedBrand

    // Text color — auto-contrast when a hex brandColor is provided
    const textColor =
      brandColor && brandColor.startsWith('#')
        ? contrastTextColor(brandColor)
        : '#FFFFFF'

    const subtitleOpacity = textColor === '#FFFFFF' ? 0.8 : 0.7

    return (
      <div
        ref={ref}
        role="banner"
        aria-label={heading}
        className={className}
        style={{
          position: 'relative',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          width: '100%',
          minHeight: '120px',
          padding: `${spacing.xl} ${spacing['2xl']}`,
          background,
          borderRadius: borderRadius.lg,
          boxShadow: shadows.sm,
          fontFamily: fontFamilies.body,
          overflow: 'hidden',
          boxSizing: 'border-box',
          ...style,
        }}
        {...props}
      >
        {/* Text content */}
        <div style={{ position: 'relative', zIndex: 1, flex: 1, minWidth: 0 }}>
          <h2
            style={{
              margin: 0,
              fontSize: typography.display.xs.fontSize,
              fontWeight: typography.display.xs.fontWeight,
              lineHeight: typography.display.xs.lineHeight,
              color: textColor,
              letterSpacing: typography.display.xs.letterSpacing,
            }}
          >
            {heading}
          </h2>

          {subtitle && (
            <p
              style={{
                margin: `${spacing.xs} 0 0`,
                fontSize: typography.body.md.fontSize,
                fontWeight: typography.body.md.fontWeight,
                lineHeight: typography.body.md.lineHeight,
                color: textColor,
                opacity: subtitleOpacity,
                letterSpacing: '0.1px',
              }}
            >
              {subtitle}
            </p>
          )}
        </div>

        {/* Optional trailing content */}
        {trailing && (
          <div
            style={{
              position: 'relative',
              zIndex: 1,
              flexShrink: 0,
              marginLeft: spacing.xl,
              display: 'flex',
              alignItems: 'center',
            }}
          >
            {trailing}
          </div>
        )}
      </div>
    )
  }
)

BrandBanner.displayName = 'BrandBanner'
