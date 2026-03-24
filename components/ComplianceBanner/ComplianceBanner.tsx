'use client'

import React, { forwardRef } from 'react'
import Image from 'next/image'
import { spacing, fontFamilies, fontWeights, typography } from '../../styles/design-tokens'

// =============================================================================
// TYPES & CONTRACTS
// =============================================================================

/**
 * Vendor logo configuration for the left side of the banner
 */
export interface VendorLogo {
  /** Image source path */
  src: string
  /** Alt text for accessibility */
  alt: string
  /** Width in pixels */
  width?: number
  /** Height in pixels */
  height?: number
}

/**
 * Visual variant of the banner
 * - 'dark' = colored background (e.g. state green) with white logos
 * - 'light' = white/light background with full-color logos
 */
export type ComplianceBannerVariant = 'dark' | 'light'

/**
 * ComplianceBanner props
 */
export interface ComplianceBannerProps {
  /** Visual variant: 'dark' (colored bg, white logos) or 'light' (white bg, color logos) */
  variant?: ComplianceBannerVariant
  /** Vendor/commission logo displayed on the left */
  vendorLogo?: VendorLogo
  /** Background color of the banner bar (only used in 'dark' variant) */
  backgroundColor?: string
  /** Whether the banner sticks to the top on scroll */
  sticky?: boolean
  /** Click handler for the vendor logo (e.g. scroll to state info) */
  onVendorLogoClick?: () => void
  /** External URL for the vendor/state agency website. When provided, shows a subtle link icon next to the logo */
  vendorUrl?: string
  /** Path to the Metrc Retail ID logo (white version auto-selected for dark variant) */
  metrcLogoSrc?: string
  /** Path to the Metrc Retail ID logo for light variant (full color) */
  metrcLogoDarkSrc?: string
  /** Additional inline styles */
  style?: React.CSSProperties
  /** Additional CSS class name */
  className?: string
}

// =============================================================================
// DEFAULT VALUES
// =============================================================================

const DEFAULTS = {
  backgroundColor: '#6a941f',
  barHeight: 60,
  vendorLogo: {
    src: '/images/rid/ccc-logo-white.png',
    alt: 'Cannabis Control Commission — Commonwealth of Massachusetts',
    width: 101,
    height: 40,
  },
  metrcLogoWhiteSrc: '/images/rid/metrc-logo.png',
  metrcLogoDarkSrc: '/images/rid/metrc-rid-logo-dark.png',
}

// =============================================================================
// COMPONENT
// =============================================================================

/**
 * ComplianceBanner — displays a state/vendor logo on the left and
 * Metrc Retail ID logo on the right.
 *
 * Supports two variants:
 * - `dark` (default): Colored background with white logos
 * - `light`: White background with full-color logos
 *
 * Used in RID (Retail ID) landing pages to show regulatory compliance status.
 *
 * @example
 * ```tsx
 * // Dark variant (default) — colored background, white logos
 * <ComplianceBanner />
 *
 * // Light variant — white background, full-color logos
 * <ComplianceBanner
 *   variant="light"
 *   vendorLogo={{
 *     src: '/images/state-seal-color.png',
 *     alt: 'State of Nevada',
 *     width: 59,
 *     height: 59,
 *   }}
 * />
 * ```
 */
export const ComplianceBanner = forwardRef<HTMLDivElement, ComplianceBannerProps>(
  (
    {
      variant = 'dark',
      vendorLogo = DEFAULTS.vendorLogo,
      backgroundColor = DEFAULTS.backgroundColor,
      sticky = true,
      onVendorLogoClick,
      vendorUrl,
      metrcLogoSrc,
      metrcLogoDarkSrc,
      style = {},
      className = '',
      ...props
    },
    ref
  ) => {
    const isLight = variant === 'light'
    const barHeight = DEFAULTS.barHeight

    const resolvedMetrcLogo = isLight
      ? (metrcLogoDarkSrc || DEFAULTS.metrcLogoDarkSrc)
      : (metrcLogoSrc || DEFAULTS.metrcLogoWhiteSrc)

    const containerStyles: React.CSSProperties = {
      position: sticky ? 'sticky' : 'relative',
      top: sticky ? 0 : undefined,
      zIndex: sticky ? 10 : undefined,
      width: '100%',
      height: barHeight,
      ...style,
    }

    const barStyles: React.CSSProperties = {
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      height: barHeight,
      backgroundColor: isLight ? '#ffffff' : backgroundColor,
      borderBottom: isLight ? '1px solid rgba(0, 0, 0, 0.06)' : undefined,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: `${spacing.xs} ${spacing.md}`,
    }

    return (
      <div
        ref={ref}
        role="banner"
        aria-label={`${vendorLogo.alt} — Metrc Retail ID`}
        className={className}
        style={containerStyles}
        {...props}
      >
        <div style={barStyles}>
          {/* Left: Vendor/state logo */}
          <div style={{ display: 'flex', alignItems: 'center', gap: spacing.xs }}>
            <button
              type="button"
              onClick={onVendorLogoClick}
              aria-label={`${vendorLogo.alt} — View state information`}
              style={{
                background: 'none',
                border: 'none',
                padding: 0,
                margin: 0,
                cursor: onVendorLogoClick ? 'pointer' : 'default',
                display: 'flex',
                alignItems: 'center',
              }}
            >
              <Image
                src={vendorLogo.src}
                alt={vendorLogo.alt}
                width={vendorLogo.width || 101}
                height={vendorLogo.height || 40}
                style={{ objectFit: 'contain' }}
                priority
              />
            </button>
            {vendorUrl && (
              <a
                href={vendorUrl}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`Visit ${vendorLogo.alt} website`}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  color: isLight ? 'rgba(0, 0, 0, 0.35)' : 'rgba(255, 255, 255, 0.5)',
                  transition: 'color 150ms ease',
                }}
                onMouseEnter={(e) => { e.currentTarget.style.color = isLight ? 'rgba(0, 0, 0, 0.6)' : 'rgba(255, 255, 255, 0.8)' }}
                onMouseLeave={(e) => { e.currentTarget.style.color = isLight ? 'rgba(0, 0, 0, 0.35)' : 'rgba(255, 255, 255, 0.5)' }}
              >
                <svg width={14} height={14} viewBox="0 0 24 24" fill="none" aria-hidden="true">
                  <path d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6M15 3h6v6M10 14L21 3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </a>
            )}
          </div>

          {/* Right: Metrc Retail ID logo */}
          <Image
            src={resolvedMetrcLogo}
            alt="Metrc Retail ID"
            width={99}
            height={31}
            style={{ objectFit: 'contain' }}
          />
        </div>
      </div>
    )
  }
)

ComplianceBanner.displayName = 'ComplianceBanner'
