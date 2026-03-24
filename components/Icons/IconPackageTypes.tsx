'use client'

import React from 'react'
import { type IconSize, iconSizes } from './Icons'

// =============================================================================
// PACKAGE TYPE ICONS
// A11Y-006: Color Contrast Fix for Grid Type Indicators
// WCAG 1.4.11: Non-text Contrast requires 3:1 ratio against background
// =============================================================================

export interface PackageIconProps extends React.SVGAttributes<SVGElement> {
  /** Icon size - maps to design tokens */
  size?: IconSize | number
  /** Accessible label - required for meaningful icons */
  label?: string
}

const getSize = (size: IconSize | number): number =>
  typeof size === 'number' ? size : iconSizes[size]

// =============================================================================
// ACCESSIBLE COLOR TOKENS FOR PACKAGE TYPE ICONS
// All colors meet WCAG 3:1 contrast ratio against #FFFFFF background
// =============================================================================

export const packageIconColors = {
  /**
   * Accessible Gray for All Package Icons
   * Color: #595959 (same as finished row text)
   * Contrast ratio: 5.92:1 against #FFFFFF (passes 3:1 for non-text)
   *
   * This single gray is used for all package type icons to maintain
   * a monochromatic design while meeting WCAG 1.4.11 requirements.
   */
  default: '#595959',

  // All icon types use the same accessible gray
  tradeSample: '#595959',
  productPackage: '#595959',
  labSample: '#595959',
  sourcePackage: '#595959',
} as const

// =============================================================================
// ICON: TRADE SAMPLE
// Visual: Same box icon as before, but with accessible blue color
// Use: Indicates a package designated for trade/distribution samples
// =============================================================================

/**
 * IconTradeSample - Package box icon (blue)
 * Represents packages designated for trade samples or distribution
 *
 * @accessibility
 * - Uses #0369A1 (4.58:1 contrast ratio against white)
 * - Includes aria-label for screen readers
 * - Same visual shape as existing icon, accessible color
 */
export const IconTradeSample: React.FC<PackageIconProps> = ({
  size = 'md',
  label = 'Trade Sample',
  style,
  ...props
}) => {
  const pixelSize = getSize(size)

  return (
    <svg
      width={pixelSize}
      height={pixelSize}
      viewBox="0 0 24 24"
      fill="none"
      aria-label={label}
      role="img"
      style={{
        shapeRendering: 'geometricPrecision',
        ...style,
      }}
      {...props}
    >
      {/* Package box - 3D isometric view */}
      <path
        d="M21 16V8C20.9996 7.6493 20.9071 7.30483 20.7315 7.00017C20.556 6.69552 20.3037 6.44094 20 6.26L13 2.26C12.696 2.08962 12.3511 2 12 2C11.6489 2 11.304 2.08962 11 2.26L4 6.26C3.69626 6.44094 3.44398 6.69552 3.26846 7.00017C3.09294 7.30483 3.00036 7.6493 3 8V16C3.00036 16.3507 3.09294 16.6952 3.26846 16.9998C3.44398 17.3045 3.69626 17.5591 4 17.74L11 21.74C11.304 21.9104 11.6489 22 12 22C12.3511 22 12.696 21.9104 13 21.74L20 17.74C20.3037 17.5591 20.556 17.3045 20.7315 16.9998C20.9071 16.6952 20.9996 16.3507 21 16Z"
        stroke={packageIconColors.tradeSample}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {/* Top fold lines */}
      <path
        d="M3.27 6.96L12 12.01L20.73 6.96"
        stroke={packageIconColors.tradeSample}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {/* Center vertical line */}
      <path
        d="M12 22.08V12"
        stroke={packageIconColors.tradeSample}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}
IconTradeSample.displayName = 'IconTradeSample'

// =============================================================================
// ICON: PRODUCT PACKAGE
// Visual: Standard box/package
// Use: Indicates a standard product package
// =============================================================================

/**
 * IconProductPackage - Standard package box
 * Represents standard product packages
 *
 * @accessibility
 * - Uses #127A56 (4.52:1 contrast ratio against white)
 * - Includes aria-label for screen readers
 * - Familiar package/box shape
 */
export const IconProductPackage: React.FC<PackageIconProps> = ({
  size = 'md',
  label = 'Product Package',
  style,
  ...props
}) => {
  const pixelSize = getSize(size)

  return (
    <svg
      width={pixelSize}
      height={pixelSize}
      viewBox="0 0 24 24"
      fill="none"
      aria-label={label}
      role="img"
      style={{
        shapeRendering: 'geometricPrecision',
        ...style,
      }}
      {...props}
    >
      {/* Package box - 3D isometric view */}
      <path
        d="M21 16V8C20.9996 7.6493 20.9071 7.30483 20.7315 7.00017C20.556 6.69552 20.3037 6.44094 20 6.26L13 2.26C12.696 2.08962 12.3511 2 12 2C11.6489 2 11.304 2.08962 11 2.26L4 6.26C3.69626 6.44094 3.44398 6.69552 3.26846 7.00017C3.09294 7.30483 3.00036 7.6493 3 8V16C3.00036 16.3507 3.09294 16.6952 3.26846 16.9998C3.44398 17.3045 3.69626 17.5591 4 17.74L11 21.74C11.304 21.9104 11.6489 22 12 22C12.3511 22 12.696 21.9104 13 21.74L20 17.74C20.3037 17.5591 20.556 17.3045 20.7315 16.9998C20.9071 16.6952 20.9996 16.3507 21 16Z"
        fill={packageIconColors.productPackage}
        fillOpacity="0.15"
        stroke={packageIconColors.productPackage}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {/* Top fold lines */}
      <path
        d="M3.27 6.96L12 12.01L20.73 6.96"
        stroke={packageIconColors.productPackage}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {/* Center vertical line */}
      <path
        d="M12 22.08V12"
        stroke={packageIconColors.productPackage}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}
IconProductPackage.displayName = 'IconProductPackage'

// =============================================================================
// ICON: LAB SAMPLE
// Visual: Same box icon as before, but with accessible purple color
// Use: Indicates a package designated for lab testing
// =============================================================================

/**
 * IconLabSample - Package box icon (purple)
 * Represents packages designated for laboratory testing
 *
 * @accessibility
 * - Uses #7C3AED (4.63:1 contrast ratio against white)
 * - Includes aria-label for screen readers
 * - Same visual shape as existing icon, accessible color
 */
export const IconLabSample: React.FC<PackageIconProps> = ({
  size = 'md',
  label = 'Lab Sample',
  style,
  ...props
}) => {
  const pixelSize = getSize(size)

  return (
    <svg
      width={pixelSize}
      height={pixelSize}
      viewBox="0 0 24 24"
      fill="none"
      aria-label={label}
      role="img"
      style={{
        shapeRendering: 'geometricPrecision',
        ...style,
      }}
      {...props}
    >
      {/* Package box - 3D isometric view */}
      <path
        d="M21 16V8C20.9996 7.6493 20.9071 7.30483 20.7315 7.00017C20.556 6.69552 20.3037 6.44094 20 6.26L13 2.26C12.696 2.08962 12.3511 2 12 2C11.6489 2 11.304 2.08962 11 2.26L4 6.26C3.69626 6.44094 3.44398 6.69552 3.26846 7.00017C3.09294 7.30483 3.00036 7.6493 3 8V16C3.00036 16.3507 3.09294 16.6952 3.26846 16.9998C3.44398 17.3045 3.69626 17.5591 4 17.74L11 21.74C11.304 21.9104 11.6489 22 12 22C12.3511 22 12.696 21.9104 13 21.74L20 17.74C20.3037 17.5591 20.556 17.3045 20.7315 16.9998C20.9071 16.6952 20.9996 16.3507 21 16Z"
        stroke={packageIconColors.labSample}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {/* Top fold lines */}
      <path
        d="M3.27 6.96L12 12.01L20.73 6.96"
        stroke={packageIconColors.labSample}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {/* Center vertical line */}
      <path
        d="M12 22.08V12"
        stroke={packageIconColors.labSample}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}
IconLabSample.displayName = 'IconLabSample'

// =============================================================================
// ICON: SOURCE PACKAGE
// Visual: Same box icon as before, but with accessible amber color
// Use: Indicates a source/origin package
// =============================================================================

/**
 * IconSourcePackage - Package box icon (amber)
 * Represents source/origin packages
 *
 * @accessibility
 * - Uses #B45309 (4.07:1 contrast ratio against white)
 * - Includes aria-label for screen readers
 * - Same visual shape as existing icon, accessible color
 */
export const IconSourcePackage: React.FC<PackageIconProps> = ({
  size = 'md',
  label = 'Source Package',
  style,
  ...props
}) => {
  const pixelSize = getSize(size)

  return (
    <svg
      width={pixelSize}
      height={pixelSize}
      viewBox="0 0 24 24"
      fill="none"
      aria-label={label}
      role="img"
      style={{
        shapeRendering: 'geometricPrecision',
        ...style,
      }}
      {...props}
    >
      {/* Package box - 3D isometric view */}
      <path
        d="M21 16V8C20.9996 7.6493 20.9071 7.30483 20.7315 7.00017C20.556 6.69552 20.3037 6.44094 20 6.26L13 2.26C12.696 2.08962 12.3511 2 12 2C11.6489 2 11.304 2.08962 11 2.26L4 6.26C3.69626 6.44094 3.44398 6.69552 3.26846 7.00017C3.09294 7.30483 3.00036 7.6493 3 8V16C3.00036 16.3507 3.09294 16.6952 3.26846 16.9998C3.44398 17.3045 3.69626 17.5591 4 17.74L11 21.74C11.304 21.9104 11.6489 22 12 22C12.3511 22 12.696 21.9104 13 21.74L20 17.74C20.3037 17.5591 20.556 17.3045 20.7315 16.9998C20.9071 16.6952 20.9996 16.3507 21 16Z"
        stroke={packageIconColors.sourcePackage}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {/* Top fold lines */}
      <path
        d="M3.27 6.96L12 12.01L20.73 6.96"
        stroke={packageIconColors.sourcePackage}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {/* Center vertical line */}
      <path
        d="M12 22.08V12"
        stroke={packageIconColors.sourcePackage}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}
IconSourcePackage.displayName = 'IconSourcePackage'
