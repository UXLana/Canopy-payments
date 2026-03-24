'use client'

import React, { forwardRef, useCallback, useId } from 'react'
import {
  colors,
  spacing,
  typography,
  borderRadius,
  borderRadiusSemantics,
  fontFamilies,
  fontWeights,
} from '@/styles/design-tokens'

// =============================================================================
// TYPES & CONTRACTS
// =============================================================================

export interface InputProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'onChange' | 'size'> {
  /** Label text above the input */
  label?: string
  /** Helper/description text below the input */
  helperText?: string
  /** Error message (shows error state when provided) */
  errorMessage?: string
  /** Whether the input has an error */
  error?: boolean
  /** Visual size */
  size?: 'sm' | 'md' | 'lg'
  /** Full-width mode */
  fullWidth?: boolean
  /** Left icon/element */
  startAdornment?: React.ReactNode
  /** Right icon/element */
  endAdornment?: React.ReactNode
  /** Change handler */
  onChange?: (value: string, event: React.ChangeEvent<HTMLInputElement>) => void
  /** Whether the field is required */
  required?: boolean
}

// =============================================================================
// SIZE CONFIG
// =============================================================================

const sizeConfig = {
  sm: {
    height: '32px',
    padding: `0 ${spacing.xs}`,
    fontSize: typography.body.xs.fontSize,
    lineHeight: typography.body.xs.lineHeight,
  },
  md: {
    height: '40px',
    padding: `0 ${spacing.sm}`,
    fontSize: typography.body.sm.fontSize,
    lineHeight: typography.body.sm.lineHeight,
  },
  lg: {
    height: '48px',
    padding: `0 ${spacing.sm}`,
    fontSize: typography.body.md.fontSize,
    lineHeight: typography.body.md.lineHeight,
  },
} as const

// =============================================================================
// COMPONENT: Input
// =============================================================================

export const Input = forwardRef<HTMLInputElement, InputProps>(
  (
    {
      label,
      helperText,
      errorMessage,
      error = false,
      size = 'md',
      fullWidth = false,
      startAdornment,
      endAdornment,
      onChange,
      required = false,
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
    const [isFocused, setIsFocused] = React.useState(false)
    const [isHovered, setIsHovered] = React.useState(false)

    const hasError = error || !!errorMessage

    const handleChange = useCallback(
      (e: React.ChangeEvent<HTMLInputElement>) => {
        onChange?.(e.target.value, e)
      },
      [onChange]
    )

    const config = sizeConfig[size]

    // Border color
    const borderColor = disabled
      ? colors.border.lowEmphasis.onLight
      : hasError
        ? colors.status.important
        : isFocused
          ? colors.brand.default
          : isHovered
            ? colors.border.highEmphasis.onLight
            : colors.border.midEmphasis.onLight

    const containerStyles: React.CSSProperties = {
      display: 'flex',
      flexDirection: 'column',
      width: fullWidth ? '100%' : '280px',
      marginBottom: spacing.md,
      ...style,
    }

    const labelStyles: React.CSSProperties = {
      fontFamily: fontFamilies.body,
      fontSize: typography.body.sm.fontSize,
      fontWeight: fontWeights.medium,
      lineHeight: typography.body.sm.lineHeight,
      color: disabled ? colors.text.disabled.onLight : colors.text.highEmphasis.onLight,
      marginBottom: spacing['2xs'],
    }

    const inputWrapperStyles: React.CSSProperties = {
      display: 'flex',
      alignItems: 'center',
      height: config.height,
      border: `1.5px solid ${borderColor}`,
      borderRadius: borderRadiusSemantics.input,
      backgroundColor: disabled ? colors.surface.disabled.onLight : colors.surface.light,
      transition: 'border-color 0.15s ease, box-shadow 0.15s ease',
      boxShadow: isFocused && !disabled ? `0 0 0 1px ${colors.brand.default}` : undefined,
      overflow: 'hidden',
      cursor: disabled ? 'not-allowed' : 'text',
    }

    // Extract horizontal padding from config (format: "0 Xpx")
    const horizontalPadding = config.padding.split(' ')[1] || config.padding

    const inputStyles: React.CSSProperties = {
      flex: 1,
      height: '100%',
      paddingTop: 0,
      paddingBottom: 0,
      paddingLeft: startAdornment ? spacing['2xs'] : horizontalPadding,
      paddingRight: endAdornment ? spacing['2xs'] : horizontalPadding,
      border: 'none',
      outline: 'none',
      background: 'transparent',
      fontFamily: fontFamilies.body,
      fontSize: config.fontSize,
      fontWeight: fontWeights.regular,
      lineHeight: config.lineHeight,
      color: disabled ? colors.text.disabled.onLight : colors.text.highEmphasis.onLight,
      cursor: disabled ? 'not-allowed' : 'text',
      width: '100%',
    }

    const adornmentStyles: React.CSSProperties = {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      color: disabled ? colors.text.disabled.onLight : colors.text.lowEmphasis.onLight,
      flexShrink: 0,
    }

    const helperStyles: React.CSSProperties = {
      fontFamily: fontFamilies.body,
      fontSize: typography.body.xs.fontSize,
      fontWeight: fontWeights.regular,
      lineHeight: typography.body.xs.lineHeight,
      color: hasError ? colors.status.important : colors.text.lowEmphasis.onLight,
      marginTop: spacing['2xs'],
    }

    return (
      <div className={className} style={containerStyles}>
        {label && (
          <label htmlFor={inputId} style={labelStyles}>
            {label}
            {required && <span style={{ color: colors.status.important, marginLeft: '2px' }}>*</span>}
          </label>
        )}
        <div
          style={inputWrapperStyles}
          onMouseEnter={() => !disabled && setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
          {startAdornment && (
            <span style={{ ...adornmentStyles, paddingLeft: spacing.xs }}>
              {startAdornment}
            </span>
          )}
          <input
            ref={ref}
            id={inputId}
            disabled={disabled}
            required={required}
            onChange={handleChange}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            aria-invalid={hasError || undefined}
            aria-describedby={
              (hasError && errorMessage ? `${inputId}-error` : '') ||
              (helperText ? `${inputId}-helper` : '') ||
              undefined
            }
            style={inputStyles}
            {...props}
          />
          {endAdornment && (
            <span style={{ ...adornmentStyles, paddingRight: spacing.xs }}>
              {endAdornment}
            </span>
          )}
        </div>
        {hasError && errorMessage && (
          <span id={`${inputId}-error`} role="alert" style={helperStyles}>
            {errorMessage}
          </span>
        )}
        {!hasError && helperText && (
          <span id={`${inputId}-helper`} style={helperStyles}>
            {helperText}
          </span>
        )}
      </div>
    )
  }
)

Input.displayName = 'Input'

export default Input
