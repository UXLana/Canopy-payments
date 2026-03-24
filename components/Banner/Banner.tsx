'use client'

import React, { forwardRef } from 'react'
import { fontFamilies, typography, banner, bannerIcon } from '../../styles/design-tokens'
import {
  IconInfoFilled,
  IconSuccessFilled,
  IconWarningFilled,
  IconErrorFilled,
} from '../Icons'

// =============================================================================
// TYPES & CONTRACTS
// =============================================================================

/**
 * Banner variant based on semantic meaning
 * - info: Informational message (blue/purple)
 * - success: Success or confirmation message (green)
 * - warning: Warning or caution message (orange)
 * - error: Error or critical message (red)
 */
export type BannerVariant = 'info' | 'success' | 'warning' | 'error'

/**
 * Banner size options
 * - md: Standard banner size
 * - lg: Larger banner for more prominent messages
 */
export type BannerSize = 'md' | 'lg'

/**
 * Banner style options
 * - inline: Rounded corners (16px border radius) with 1px outline
 */
export type BannerStyle = 'inline'

/**
 * Banner surface options (for playground only)
 * - color: Colored background matching the variant
 * - light: White/light background
 */
export type BannerSurface = 'color' | 'light'

/**
 * Button alignment options (for playground only)
 * - side: Buttons aligned to the right of the content
 * - below: Buttons positioned below the content
 */
export type BannerButtonAlignment = 'side' | 'below'

/**
 * Banner component props
 */
export interface BannerProps {
  /** Semantic variant */
  variant?: BannerVariant
  /** Size of the banner */
  size?: BannerSize
  /** Style of the banner (inline with rounded corners and outline) */
  bannerStyle?: BannerStyle
  /** Surface type - playground only (color or light background) */
  surface?: BannerSurface
  /** Button alignment - playground only (side or below) */
  buttonAlignment?: BannerButtonAlignment
  /** Main title/heading (displayed above children if provided) */
  title?: string
  /** Main content text */
  children?: React.ReactNode
  /** Icon to display on the left */
  icon?: React.ReactNode
  /** Whether the banner can be dismissed */
  dismissible?: boolean
  /** Callback when banner is dismissed */
  onDismiss?: () => void
  /** Primary action button */
  primaryAction?: {
    label: string
    onClick: () => void
  }
  /** Secondary action button */
  secondaryAction?: {
    label: string
    onClick: () => void
  }
  /** Legacy: Action button(s) - for backwards compatibility */
  actions?: React.ReactNode
  /** Display on dark background */
  onDark?: boolean
  /** Additional CSS class name */
  className?: string
  /** Additional inline styles */
  style?: React.CSSProperties
}

/**
 * Close icon (X) - exported for external use
 */
export function CloseIcon({ size = 20, color = 'currentColor' }: { size?: number; color?: string }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 20 20"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      style={{ flexShrink: 0 }}
    >
      <path
        d="M15 5L5 15M5 5L15 15"
        stroke={color}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

// Legacy icon exports for backwards compatibility
export { IconInfoFilled as InfoIcon } from '@/components/Icons'
export { IconSuccessFilled as SuccessIcon } from '@/components/Icons'
export { IconWarningFilled as WarningIcon } from '@/components/Icons'
export { IconErrorFilled as ErrorIcon } from '@/components/Icons'

// =============================================================================
// VARIANT STYLES
// =============================================================================

interface VariantStyle {
  surface: string
  divider: string
  iconBackground: string
  icon: string
  iconComponent: React.ComponentType<{ size?: number | 'sm' | 'md' | 'lg'; color?: string }>
}

// Map banner variants to their styles based on surface type
const getVariantStyle = (variant: BannerVariant, surface: BannerSurface): VariantStyle => {
  const colorStyles = banner.variantsColor
  const lightStyles = banner.variantsLight

  const iconComponents: Record<BannerVariant, React.ComponentType<{ size?: number | 'sm' | 'md' | 'lg'; color?: string }>> = {
    info: IconInfoFilled,
    success: IconSuccessFilled,
    warning: IconWarningFilled,
    error: IconErrorFilled,
  }

  const styles = surface === 'color' ? colorStyles : lightStyles

  return {
    surface: styles[variant].surface,
    divider: styles[variant].divider,
    iconBackground: styles[variant].iconBackground,
    icon: styles[variant].icon,
    iconComponent: iconComponents[variant],
  }
}

// Dark mode variant styles
const variantStylesOnDark: Record<BannerVariant, VariantStyle> = {
  info: {
    surface: 'rgba(122, 145, 255, 0.15)',
    divider: 'rgba(122, 145, 255, 0.3)',
    iconBackground: bannerIcon.variantsOnDark.information.background,
    icon: bannerIcon.variantsOnDark.information.icon,
    iconComponent: IconInfoFilled,
  },
  success: {
    surface: 'rgba(0, 173, 130, 0.15)',
    divider: 'rgba(0, 173, 130, 0.3)',
    iconBackground: bannerIcon.variantsOnDark.success.background,
    icon: bannerIcon.variantsOnDark.success.icon,
    iconComponent: IconSuccessFilled,
  },
  warning: {
    surface: 'rgba(230, 130, 0, 0.15)',
    divider: 'rgba(230, 130, 0, 0.3)',
    iconBackground: bannerIcon.variantsOnDark.warning.background,
    icon: bannerIcon.variantsOnDark.warning.icon,
    iconComponent: IconWarningFilled,
  },
  error: {
    surface: 'rgba(248, 104, 118, 0.15)',
    divider: 'rgba(248, 104, 118, 0.3)',
    iconBackground: bannerIcon.variantsOnDark.important.background,
    icon: bannerIcon.variantsOnDark.important.icon,
    iconComponent: IconErrorFilled,
  },
}

// =============================================================================
// ACTION BUTTON COMPONENT
// =============================================================================

interface ActionButtonProps {
  label: string
  onClick: () => void
  onDark?: boolean
}

function ActionButton({ label, onClick, onDark = false }: ActionButtonProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: `${banner.button.paddingY} ${banner.button.paddingX}`,
        borderRadius: banner.button.borderRadius,
        background: 'transparent',
        border: 'none',
        cursor: 'pointer',
        fontFamily: fontFamilies.body,
        fontSize: banner.button.typography.fontSize,
        fontWeight: banner.button.typography.fontWeight,
        lineHeight: banner.button.typography.lineHeight,
        letterSpacing: banner.button.typography.letterSpacing,
        color: onDark ? banner.text.actionOnDark : banner.text.action,
        transition: banner.transition,
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.background = onDark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.04)'
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.background = 'transparent'
      }}
    >
      {label}
    </button>
  )
}

// =============================================================================
// COMPONENT
// =============================================================================

/**
 * Banner component - displays important messages to users
 *
 * Features filled icons with colored backgrounds matching the Figma design system.
 * Supports light and dark modes, dismissible functionality, and action buttons.
 *
 * @example
 * ```tsx
 * // Basic usage
 * <Banner variant="info" title="Example text" />
 *
 * // With actions
 * <Banner
 *   variant="warning"
 *   title="Your subscription will expire in 7 days."
 *   primaryAction={{ label: "Learn More", onClick: () => {} }}
 *   secondaryAction={{ label: "Dismiss", onClick: () => {} }}
 * />
 * ```
 */
export const Banner = forwardRef<HTMLDivElement, BannerProps>(
  (
    {
      variant = 'info',
      size = 'md',
      bannerStyle = 'inline',
      surface = 'color',
      buttonAlignment = 'side',
      title,
      children,
      icon,
      dismissible = false,
      onDismiss,
      primaryAction,
      secondaryAction,
      actions,
      onDark = false,
      className = '',
      style = {},
      ...props
    },
    ref
  ) => {
    const variantStyle = onDark
      ? variantStylesOnDark[variant]
      : getVariantStyle(variant, surface)
    const IconComponent = variantStyle.iconComponent

    const [dismissed, setDismissed] = React.useState(false)

    const handleDismiss = () => {
      setDismissed(true)
      onDismiss?.()
    }

    if (dismissed) {
      return null
    }

    const hasActions = primaryAction || secondaryAction || actions
    const isSideAlignment = buttonAlignment === 'side'
    const isBelow = buttonAlignment === 'below'

    // Icon container size (40px with 8px padding = 24px icon)
    const iconContainerSize = 40

    // Base container styles - matching Figma exactly
    // Side alignment: 56px height, row layout, full width
    // Below alignment: ~100px height, column layout
    const baseStyles: React.CSSProperties = {
      position: 'relative',
      display: 'flex',
      flexDirection: isBelow ? 'column' : 'row',
      alignItems: isBelow ? 'flex-start' : 'center',
      width: '100%',
      height: isBelow ? 'auto' : '56px',
      minHeight: isBelow ? '100px' : '56px',
      padding: '0',
      paddingLeft: `${7 + iconContainerSize + 8}px`, // 7px left (8-1 for border) + icon (40px) + 8px gap = 55px
      paddingRight: '7px', // 8px - 1px border
      background: variantStyle.surface,
      borderRadius: banner.border.radius.inline,
      border: `1px solid ${variantStyle.divider}`,
      opacity: 1,
      fontFamily: fontFamilies.body,
      transition: banner.transition,
      boxSizing: 'border-box',
      ...style,
    }

    // Icon container styles (positioned absolutely, vertically centered for side, top for below)
    const iconContainerStyles: React.CSSProperties = {
      position: 'absolute',
      left: '7px', // 8px - 1px border
      top: isBelow ? '7px' : '50%', // 8px - 1px border for below alignment
      transform: isBelow ? 'none' : 'translateY(-50%)',
      flexShrink: 0,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      width: iconContainerSize,
      height: iconContainerSize,
      borderRadius: '16px',
      background: variantStyle.iconBackground,
    }

    // Content area styles
    const contentStyles: React.CSSProperties = {
      flex: 1,
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'flex-start',
      minWidth: 0,
      paddingTop: isBelow ? '6px' : '0',
      paddingBottom: isBelow ? '6px' : '0',
      paddingRight: isBelow ? '6px' : '0',
    }

    // Actions container styles
    const actionsContainerStyles: React.CSSProperties = {
      display: 'flex',
      alignItems: 'center',
      gap: banner.spacing.actionGap,
      flexShrink: 0,
      ...(isBelow
        ? {
            justifyContent: 'flex-end',
            width: '100%',
            paddingRight: '8px',
            paddingBottom: '8px',
          }
        : {}),
    }

    return (
      <div
        ref={ref}
        role="alert"
        aria-live="polite"
        className={className}
        style={baseStyles}
        {...props}
      >
        {/* Icon with background container (positioned absolutely) */}
        {icon ? (
          <div style={{ ...iconContainerStyles, padding: 0 }}>{icon}</div>
        ) : (
          <div style={iconContainerStyles}>
            <IconComponent size="md" color={variantStyle.icon} />
          </div>
        )}

        {/* Content */}
        <div style={contentStyles}>
          {title && (
            <div
              style={{
                fontSize: typography.body.md.fontSize,
                fontWeight: typography.body.md.fontWeight,
                lineHeight: typography.body.md.lineHeight,
                letterSpacing: typography.body.md.letterSpacing,
                color: onDark ? banner.text.primaryOnDark : banner.text.primary,
                marginBottom: children ? banner.spacing.titleMarginBottom : 0,
              }}
            >
              {title}
            </div>
          )}
          {children && (
            <div
              style={{
                fontSize: typography.body.md.fontSize,
                fontWeight: typography.body.md.fontWeight,
                lineHeight: typography.body.md.lineHeight,
                letterSpacing: typography.body.md.letterSpacing,
                color: onDark ? banner.text.primaryOnDark : banner.text.primary,
              }}
            >
              {children}
            </div>
          )}
        </div>

        {/* Actions */}
        {hasActions && (
          <div style={actionsContainerStyles}>
            {/* Legacy actions support */}
            {actions}

            {/* New action buttons */}
            {secondaryAction && (
              <ActionButton
                label={secondaryAction.label}
                onClick={secondaryAction.onClick}
                onDark={onDark}
              />
            )}
            {primaryAction && (
              <ActionButton
                label={primaryAction.label}
                onClick={primaryAction.onClick}
                onDark={onDark}
              />
            )}
          </div>
        )}

        {/* Dismiss button */}
        {dismissible && (
          <button
            type="button"
            onClick={handleDismiss}
            aria-label="Dismiss"
            style={{
              flexShrink: 0,
              background: banner.dismiss.background.default,
              border: 'none',
              padding: banner.dismiss.padding,
              cursor: 'pointer',
              color: variantStyle.icon,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              borderRadius: banner.dismiss.borderRadius,
              transition: banner.transition,
              opacity: banner.dismiss.opacity.default,
              marginLeft: hasActions ? '8px' : '0',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.opacity = banner.dismiss.opacity.hover.toString()
              e.currentTarget.style.background = onDark ? 'rgba(255, 255, 255, 0.1)' : banner.dismiss.background.hover
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.opacity = banner.dismiss.opacity.default.toString()
              e.currentTarget.style.background = banner.dismiss.background.default
            }}
          >
            <CloseIcon size={parseInt(banner.dismiss.iconSize)} color={variantStyle.icon} />
          </button>
        )}

      </div>
    )
  }
)

Banner.displayName = 'Banner'
