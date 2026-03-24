'use client'

import React, { forwardRef } from 'react'
import {
  button,
  colors,
  fontFamilies,
  transitionPresets,
} from '@/styles/design-tokens'

// =============================================================================
// TYPES & CONTRACTS
// =============================================================================

/**
 * Button size options
 * - lg: 48px height - Used at the bottom of forms or areas where major prominence is needed
 * - md: 36px height - Used in navigation bars, snackbars, alert dialogs, banners and mid-page content areas
 */
export type ButtonSize = 'lg' | 'md'

/**
 * Button emphasis level
 * - high: Primary action, dark green solid background
 * - mid: Secondary action, mint/teal solid background
 * - low: Tertiary action, text only (no background)
 */
export type ButtonEmphasis = 'high' | 'mid' | 'low'

/**
 * Button state (primarily for display purposes in docs)
 */
export type ButtonState = 'enabled' | 'hover' | 'pressed' | 'disabled'

/**
 * Button component props
 */
export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  /** Size of the button */
  size?: ButtonSize
  /** Emphasis level of the button */
  emphasis?: ButtonEmphasis
  /** Whether button is displayed on a dark surface */
  onDark?: boolean
  /** Whether this is a destructive action */
  destructive?: boolean
  /** Icon to display before the text (left side) */
  leftIcon?: React.ReactNode
  /** Icon to display after the text (right side / dropdown caret) */
  rightIcon?: React.ReactNode
  /** Whether this is an icon-only button (no text) */
  iconOnly?: boolean
  /** Loading state */
  loading?: boolean
  /** Full width button */
  fullWidth?: boolean
  /** Shows focus ring (for demonstration) */
  focused?: boolean
}

/**
 * Button Group component props
 */
export interface ButtonGroupProps {
  /** Child buttons */
  children: React.ReactNode
  /** Spacing variant */
  spacing?: 'default' | 'form' | 'formMobile' | 'inline'
  /** Alignment */
  align?: 'start' | 'center' | 'end' | 'stretch'
  /** Additional CSS class name */
  className?: string
  /** Additional inline styles */
  style?: React.CSSProperties
}

// =============================================================================
// ICONS
// =============================================================================

/**
 * Default dropdown caret icon (menu-caret-down from Figma)
 */
export function DropdownIcon({ size = 20, color = 'currentColor' }: { size?: number; color?: string }) {
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
        d="M5 7.5L10 12.5L15 7.5"
        stroke={color}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

/**
 * Loading spinner icon
 */
function LoadingSpinner({ size = 20, color = 'currentColor' }: { size?: number; color?: string }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      style={{
        flexShrink: 0,
        animation: 'spin 1s linear infinite',
      }}
    >
      <circle
        cx="12"
        cy="12"
        r="10"
        stroke={color}
        strokeWidth="3"
        strokeOpacity="0.25"
      />
      <path
        d="M12 2C6.47715 2 2 6.47715 2 12"
        stroke={color}
        strokeWidth="3"
        strokeLinecap="round"
      />
      <style>
        {`@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }`}
      </style>
    </svg>
  )
}

// =============================================================================
// BUTTON COMPONENT
// =============================================================================

/**
 * Button Component
 *
 * A flexible button component supporting multiple sizes, emphasis levels,
 * icons, and states. Follows the Prism Design System specifications.
 *
 * @example
 * // High emphasis (primary) button
 * <Button emphasis="high" size="lg">Submit</Button>
 *
 * @example
 * // Mid emphasis (mint/teal filled) button with icon
 * <Button emphasis="mid" leftIcon={<IconAdd />}>Add Item</Button>
 *
 * @example
 * // Low emphasis (text) button
 * <Button emphasis="low">Cancel</Button>
 *
 * @example
 * // Destructive button
 * <Button destructive emphasis="high">Delete</Button>
 *
 * @example
 * // Icon-only button
 * <Button iconOnly leftIcon={<IconSettings />} aria-label="Settings" />
 */
export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      children,
      size = 'md',
      emphasis = 'high',
      onDark = false,
      destructive = false,
      leftIcon,
      rightIcon,
      iconOnly = false,
      loading = false,
      fullWidth = false,
      focused = false,
      disabled,
      className,
      style,
      onMouseEnter,
      onMouseLeave,
      onMouseDown,
      onMouseUp,
      ...props
    },
    ref
  ) => {
    const [isHovered, setIsHovered] = React.useState(false)
    const [isPressed, setIsPressed] = React.useState(false)
    const [isFocused, setIsFocused] = React.useState(false)

    const isDisabled = disabled || loading

    // Get the appropriate color scheme
    const getColors = () => {
      if (destructive && (emphasis === 'high' || emphasis === 'mid')) {
        const emphasisKey = emphasis as 'high' | 'mid'
        return button.destructive[emphasisKey]
      }
      if (onDark) {
        return button.emphasisOnDark[emphasis]
      }
      return button.emphasis[emphasis]
    }

    const colorScheme = getColors()

    // Determine current state colors
    const getStateColors = () => {
      if (isDisabled) return colorScheme.disabled
      if (isPressed) return colorScheme.pressed
      if (isHovered) return colorScheme.hover
      return colorScheme.enabled
    }

    const stateColors = getStateColors()
    const sizeConfig = iconOnly ? button.iconOnlySizes[size] : button.sizes[size]
    const typographyConfig = button.typography[size]

    // Base styles
    const baseStyles: React.CSSProperties = {
      // Reset
      border: 'none',
      outline: 'none',
      cursor: isDisabled ? 'not-allowed' : 'pointer',
      
      // Layout
      display: 'inline-flex',
      alignItems: 'center',
      justifyContent: 'center',
      gap: iconOnly ? 0 : button.sizes[size].gap,
      position: 'relative',
      
      // Size
      height: iconOnly ? button.iconOnlySizes[size].size : button.sizes[size].height,
      minWidth: iconOnly ? button.iconOnlySizes[size].size : button.sizes[size].minWidth,
      width: fullWidth ? '100%' : iconOnly ? button.iconOnlySizes[size].size : 'auto',
      padding: iconOnly ? 0 : `${button.sizes[size].paddingY} ${button.sizes[size].paddingX}`,
      
      // Typography
      fontFamily: fontFamilies.display,
      fontSize: typographyConfig.fontSize,
      fontWeight: typographyConfig.fontWeight,
      lineHeight: typographyConfig.lineHeight,
      letterSpacing: typographyConfig.letterSpacing,
      textDecoration: 'none',
      whiteSpace: 'nowrap',
      
      // Colors
      backgroundColor: stateColors.background,
      color: stateColors.text,
      // All buttons now use transparent borders (mid-emphasis is filled, not outlined)
      borderWidth: 0,
      borderStyle: 'solid',
      borderColor: 'transparent',
      
      // Shape
      borderRadius: button.borderRadius,
      
      // Interaction
      transition: button.transition,
      opacity: isDisabled ? 1 : undefined,
      
      // User overrides
      ...style,
    }

    // Focus ring styles
    const focusRingStyles: React.CSSProperties = {
      position: 'absolute',
      inset: `-${button.focus.offset}`,
      borderRadius: button.borderRadius,
      border: `${button.focus.width} solid ${button.focus.color}`,
      pointerEvents: 'none',
    }

    const iconSize = iconOnly
      ? parseInt(button.iconOnlySizes[size].iconSize)
      : parseInt(button.sizes[size].iconSize)

    // Event handlers
    const handleMouseEnter = (e: React.MouseEvent<HTMLButtonElement>) => {
      if (!isDisabled) setIsHovered(true)
      onMouseEnter?.(e)
    }

    const handleMouseLeave = (e: React.MouseEvent<HTMLButtonElement>) => {
      setIsHovered(false)
      setIsPressed(false)
      onMouseLeave?.(e)
    }

    const handleMouseDown = (e: React.MouseEvent<HTMLButtonElement>) => {
      if (!isDisabled) setIsPressed(true)
      onMouseDown?.(e)
    }

    const handleMouseUp = (e: React.MouseEvent<HTMLButtonElement>) => {
      setIsPressed(false)
      onMouseUp?.(e)
    }

    const handleFocus = (e: React.FocusEvent<HTMLButtonElement>) => {
      if (!isDisabled) setIsFocused(true)
      props.onFocus?.(e)
    }

    const handleBlur = (e: React.FocusEvent<HTMLButtonElement>) => {
      setIsFocused(false)
      props.onBlur?.(e)
    }

    return (
      <button
        ref={ref}
        className={className}
        style={baseStyles}
        disabled={isDisabled}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        onMouseDown={handleMouseDown}
        onMouseUp={handleMouseUp}
        onFocus={handleFocus}
        onBlur={handleBlur}
        {...props}
      >
        {/* Loading spinner replaces left icon */}
        {loading ? (
          <LoadingSpinner size={iconSize} color={stateColors.text} />
        ) : (
          leftIcon && (
            <span
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: iconSize,
                height: iconSize,
                flexShrink: 0,
              }}
            >
              {leftIcon}
            </span>
          )
        )}

        {/* Text content */}
        {!iconOnly && children && (
          <span style={{ flexShrink: 0 }}>{children}</span>
        )}

        {/* Right icon (e.g., dropdown caret) */}
        {!loading && rightIcon && (
          <span
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: iconSize,
              height: iconSize,
              flexShrink: 0,
            }}
          >
            {rightIcon}
          </span>
        )}

        {/* Focus ring */}
        {(focused || isFocused) && <span style={focusRingStyles} />}
      </button>
    )
  }
)

Button.displayName = 'Button'

// =============================================================================
// BUTTON GROUP COMPONENT
// =============================================================================

/**
 * Button Group Component
 *
 * Groups multiple buttons together with consistent spacing.
 *
 * @example
 * // Default spacing for form actions
 * <ButtonGroup spacing="form">
 *   <Button emphasis="low">Cancel</Button>
 *   <Button emphasis="high">Save</Button>
 * </ButtonGroup>
 *
 * @example
 * // Inline buttons
 * <ButtonGroup spacing="inline" align="end">
 *   <Button size="md">Edit</Button>
 *   <Button size="md">Delete</Button>
 * </ButtonGroup>
 */
export function ButtonGroup({
  children,
  spacing = 'default',
  align = 'start',
  className,
  style,
}: ButtonGroupProps) {
  const containerStyles: React.CSSProperties = {
    display: 'flex',
    flexDirection: spacing === 'formMobile' ? 'column' : 'row',
    gap: button.group.gap[spacing],
    alignItems: align === 'stretch' ? 'stretch' : `flex-${align}`,
    justifyContent: align === 'stretch' ? 'stretch' : undefined,
    marginBottom: button.group.marginBottom[spacing],
    ...style,
  }

  // For stretch alignment, make buttons full width
  const childrenWithProps = React.Children.map(children, (child) => {
    if (React.isValidElement(child) && align === 'stretch') {
      return React.cloneElement(child as React.ReactElement<ButtonProps>, {
        fullWidth: true,
      })
    }
    return child
  })

  return (
    <div className={className} style={containerStyles} role="group">
      {align === 'stretch' ? childrenWithProps : children}
    </div>
  )
}

// =============================================================================
// EXPORTS
// =============================================================================

export default Button
