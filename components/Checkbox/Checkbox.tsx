'use client'

import React, { forwardRef, useCallback, useRef, useId } from 'react'
import {
  colors,
  spacing,
  typography,
  borderRadius,
  fontFamilies,
  fontWeights,
  transitionPresets,
} from '@/styles/design-tokens'

// =============================================================================
// TYPES & CONTRACTS
// =============================================================================

export type CheckboxState = 'checked' | 'unchecked' | 'indeterminate'

export interface CheckboxProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'onChange' | 'type'> {
  /** Label text displayed next to the checkbox */
  label?: string
  /** Metadata/description text below the label */
  metadata?: string
  /** Controlled checked state */
  checked?: boolean
  /** Indeterminate state (overrides checked visually) */
  indeterminate?: boolean
  /** Change handler */
  onChange?: (checked: boolean, event: React.ChangeEvent<HTMLInputElement>) => void
  /** Whether this is a child checkbox (indented) */
  isChild?: boolean
  /** Full-width mode */
  fullWidth?: boolean
  /** Remove rounded corners (for custom pattern building) */
  noRoundedCorners?: boolean
  /** Error state */
  error?: boolean
}

export interface CheckboxGroupProps {
  /** Group label */
  label?: string
  /** Error message text */
  errorMessage?: string
  /** Whether to show error state */
  error?: boolean
  /** Full-width mode */
  fullWidth?: boolean
  /** Children (Checkbox components) */
  children: React.ReactNode
  /** Additional className */
  className?: string
  /** Additional styles */
  style?: React.CSSProperties
}

// =============================================================================
// CHECKBOX ICON (SVG)
// =============================================================================

const CheckIcon = () => (
  <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path
      d="M2.5 6L5 8.5L9.5 3.5"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
)

const IndeterminateIcon = () => (
  <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path
      d="M3 6H9"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
    />
  </svg>
)

// =============================================================================
// COMPONENT: Checkbox
// =============================================================================

export const Checkbox = forwardRef<HTMLInputElement, CheckboxProps>(
  (
    {
      label,
      metadata,
      checked = false,
      indeterminate = false,
      onChange,
      isChild = false,
      fullWidth = false,
      noRoundedCorners = false,
      error = false,
      disabled = false,
      className,
      style,
      id: providedId,
      ...props
    },
    ref
  ) => {
    const generatedId = useId()
    const inputId = providedId || generatedId
    const internalRef = useRef<HTMLInputElement>(null)
    const [isHovered, setIsHovered] = React.useState(false)
    const [isFocusVisible, setIsFocusVisible] = React.useState(false)

    // Sync indeterminate property (not available as HTML attribute)
    React.useEffect(() => {
      const input = internalRef.current
      if (input) {
        input.indeterminate = indeterminate
      }
    }, [indeterminate])

    // Merge refs
    const mergedRef = useCallback(
      (node: HTMLInputElement | null) => {
        (internalRef as React.MutableRefObject<HTMLInputElement | null>).current = node
        if (typeof ref === 'function') ref(node)
        else if (ref) (ref as React.MutableRefObject<HTMLInputElement | null>).current = node
      },
      [ref]
    )

    const handleChange = useCallback(
      (e: React.ChangeEvent<HTMLInputElement>) => {
        onChange?.(e.target.checked, e)
      },
      [onChange]
    )

    // Visual state
    const isActive = checked || indeterminate
    const boxBorderColor = disabled
      ? colors.border.lowEmphasis.onLight
      : error
        ? colors.status.important
        : isActive
          ? colors.brand.default
          : isHovered
            ? colors.border.highEmphasis.onLight
            : colors.border.midEmphasis.onLight
    const boxBackground = disabled && isActive
      ? colors.surface.disabled.onLight
      : isActive
        ? colors.brand.default
        : 'transparent'
    const boxIconColor = disabled
      ? colors.text.disabled.onLight
      : '#FFFFFF'

    const containerStyles: React.CSSProperties = {
      display: 'flex',
      alignItems: 'flex-start',
      gap: spacing.xs,
      padding: `${spacing.xs} ${spacing.sm}`,
      paddingLeft: isChild ? spacing['2xl'] : spacing.sm,
      cursor: disabled ? 'not-allowed' : 'pointer',
      width: fullWidth ? '100%' : 'auto',
      borderRadius: noRoundedCorners ? 0 : borderRadius.sm,
      position: 'relative' as const,
      ...style,
    }

    const boxStyles: React.CSSProperties = {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      width: '18px',
      height: '18px',
      minWidth: '18px',
      borderRadius: borderRadius.xs,
      border: `1.5px solid ${boxBorderColor}`,
      backgroundColor: boxBackground,
      color: boxIconColor,
      transition: `all ${transitionPresets.default}`,
      marginTop: '1px',
    }

    const focusRingStyles: React.CSSProperties = isFocusVisible
      ? {
          outline: `2px solid ${colors.focusBorder.onLight}`,
          outlineOffset: '2px',
          borderRadius: borderRadius.xs,
        }
      : {}

    const labelStyles: React.CSSProperties = {
      fontFamily: fontFamilies.body,
      fontSize: typography.body.sm.fontSize,
      fontWeight: fontWeights.regular,
      lineHeight: typography.body.sm.lineHeight,
      color: disabled ? colors.text.disabled.onLight : colors.text.highEmphasis.onLight,
    }

    const metadataStyles: React.CSSProperties = {
      fontFamily: fontFamilies.body,
      fontSize: typography.body.xs.fontSize,
      fontWeight: fontWeights.regular,
      lineHeight: typography.body.xs.lineHeight,
      color: disabled ? colors.text.disabled.onLight : colors.text.lowEmphasis.onLight,
      marginTop: '2px',
    }

    return (
      <label
        htmlFor={inputId}
        className={className}
        style={containerStyles}
        onMouseEnter={() => !disabled && setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <input
          ref={mergedRef}
          type="checkbox"
          id={inputId}
          checked={checked}
          disabled={disabled}
          onChange={handleChange}
          onFocus={(e) => {
            if (e.target.matches(':focus-visible')) setIsFocusVisible(true)
          }}
          onBlur={() => setIsFocusVisible(false)}
          aria-invalid={error || undefined}
          style={{
            position: 'absolute',
            width: '1px',
            height: '1px',
            padding: 0,
            margin: '-1px',
            overflow: 'hidden',
            clip: 'rect(0, 0, 0, 0)',
            whiteSpace: 'nowrap',
            border: 0,
          }}
          {...props}
        />
        <span style={{ ...boxStyles, ...focusRingStyles }} aria-hidden="true">
          {indeterminate ? <IndeterminateIcon /> : checked ? <CheckIcon /> : null}
        </span>
        {(label || metadata) && (
          <span style={{ display: 'flex', flexDirection: 'column' }}>
            {label && <span style={labelStyles}>{label}</span>}
            {metadata && <span style={metadataStyles}>{metadata}</span>}
          </span>
        )}
      </label>
    )
  }
)

Checkbox.displayName = 'Checkbox'

// =============================================================================
// COMPONENT: CheckboxGroup
// =============================================================================

export const CheckboxGroup = forwardRef<HTMLDivElement, CheckboxGroupProps>(
  (
    {
      label,
      errorMessage,
      error = false,
      fullWidth = false,
      children,
      className,
      style,
      ...props
    },
    ref
  ) => {
    const groupId = useId()

    const containerStyles: React.CSSProperties = {
      display: 'flex',
      flexDirection: 'column',
      width: fullWidth ? '100%' : 'auto',
      marginBottom: spacing.md,
      ...style,
    }

    const labelStyles: React.CSSProperties = {
      fontFamily: fontFamilies.body,
      fontSize: typography.body.sm.fontSize,
      fontWeight: fontWeights.medium,
      lineHeight: typography.body.sm.lineHeight,
      color: colors.text.highEmphasis.onLight,
      marginBottom: spacing['2xs'],
    }

    const errorStyles: React.CSSProperties = {
      display: 'flex',
      alignItems: 'center',
      gap: spacing['2xs'],
      fontFamily: fontFamilies.body,
      fontSize: typography.body.xs.fontSize,
      fontWeight: fontWeights.regular,
      lineHeight: typography.body.xs.lineHeight,
      color: colors.status.important,
      marginTop: spacing['2xs'],
    }

    return (
      <div
        ref={ref}
        role="group"
        aria-labelledby={label ? `${groupId}-label` : undefined}
        aria-invalid={error || undefined}
        aria-describedby={error && errorMessage ? `${groupId}-error` : undefined}
        className={className}
        style={containerStyles}
        {...props}
      >
        {label && (
          <span id={`${groupId}-label`} style={labelStyles}>
            {label}
          </span>
        )}
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          {children}
        </div>
        {error && errorMessage && (
          <span id={`${groupId}-error`} role="alert" style={errorStyles}>
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
              <circle cx="7" cy="7" r="6" stroke="currentColor" strokeWidth="1.5" />
              <path d="M7 4v3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
              <circle cx="7" cy="9.5" r="0.75" fill="currentColor" />
            </svg>
            {errorMessage}
          </span>
        )}
      </div>
    )
  }
)

CheckboxGroup.displayName = 'CheckboxGroup'

export default Checkbox
