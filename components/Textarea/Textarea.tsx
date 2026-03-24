'use client'

import React, { forwardRef, useState } from 'react'
import {
  colors,
  spacing,
  typography,
  fontFamilies,
  fontWeights,
  borderRadiusSemantics,
  transitionPresets,
} from '@/styles/design-tokens'

export interface TextareaProps extends Omit<React.TextareaHTMLAttributes<HTMLTextAreaElement>, 'style'> {
  label?: string
  error?: boolean
  errorMessage?: string
  helperText?: string
  fullWidth?: boolean
  style?: React.CSSProperties
}

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  (
    {
      label,
      error = false,
      errorMessage,
      helperText,
      fullWidth = false,
      disabled,
      style,
      ...props
    },
    ref,
  ) => {
    const [isFocused, setIsFocused] = useState(false)

    const borderColor = error
      ? colors.status.important
      : isFocused
        ? colors.focusBorder.onLight
        : colors.border.lowEmphasis.onLight

    return (
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: spacing['2xs'],
          width: fullWidth ? '100%' : 'auto',
        }}
      >
        {label && (
          <label
            style={{
              fontFamily: fontFamilies.body,
              fontSize: typography.label.sm.fontSize,
              fontWeight: fontWeights.medium,
              lineHeight: typography.label.sm.lineHeight,
              color: disabled ? colors.text.disabled.onLight : colors.text.highEmphasis.onLight,
            }}
          >
            {label}
          </label>
        )}

        <textarea
          ref={ref}
          disabled={disabled}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          aria-invalid={error}
          style={{
            width: '100%',
            minHeight: '80px',
            padding: spacing.sm,
            fontFamily: fontFamilies.body,
            fontSize: typography.body.md.fontSize,
            fontWeight: fontWeights.regular,
            lineHeight: typography.body.md.lineHeight,
            color: disabled ? colors.text.disabled.onLight : colors.text.highEmphasis.onLight,
            backgroundColor: disabled ? colors.surface.disabled.onLight : colors.surface.light,
            border: `1px solid ${borderColor}`,
            borderRadius: borderRadiusSemantics.input,
            outline: 'none',
            resize: 'vertical',
            transition: `border-color ${transitionPresets.default}`,
            opacity: disabled ? 0.5 : 1,
            cursor: disabled ? 'not-allowed' : 'text',
            boxSizing: 'border-box',
            ...style,
          }}
          {...props}
        />

        {(errorMessage || helperText) && (
          <span
            style={{
              fontFamily: fontFamilies.body,
              fontSize: typography.body.xs.fontSize,
              lineHeight: typography.body.xs.lineHeight,
              color: error ? colors.status.important : colors.text.lowEmphasis.onLight,
            }}
            role={error ? 'alert' : undefined}
          >
            {error ? errorMessage : helperText}
          </span>
        )}
      </div>
    )
  },
)

Textarea.displayName = 'Textarea'
