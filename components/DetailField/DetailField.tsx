'use client'

import React, { forwardRef } from 'react'
import {
  colors,
  spacing,
  typography,
  fontFamilies,
  fontWeights,
} from '@/styles/design-tokens'

export interface DetailFieldProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Field label */
  label: string
  /** Field value — string or ReactNode for custom rendering */
  value: React.ReactNode
  /** Layout direction */
  direction?: 'vertical' | 'horizontal'
  /** Whether to render a monospace value (for IDs, tags, etc.) */
  mono?: boolean
}

export const DetailField = forwardRef<HTMLDivElement, DetailFieldProps>(
  ({ label, value, direction = 'vertical', mono = false, style, ...props }, ref) => {
    return (
      <div
        ref={ref}
        style={{
          display: 'flex',
          flexDirection: direction === 'vertical' ? 'column' : 'row',
          gap: direction === 'vertical' ? spacing['2xs'] : spacing.sm,
          alignItems: direction === 'horizontal' ? 'center' : 'flex-start',
          ...style,
        }}
        {...props}
      >
        <span
          style={{
            fontFamily: fontFamilies.body,
            fontSize: typography.label.sm.fontSize,
            fontWeight: fontWeights.medium,
            color: colors.text.lowEmphasis.onLight,
            lineHeight: '16px',
            minWidth: direction === 'horizontal' ? '120px' : undefined,
            flexShrink: 0,
          }}
        >
          {label}
        </span>
        <span
          style={{
            fontFamily: mono ? fontFamilies.mono : fontFamilies.body,
            fontSize: typography.body.md.fontSize,
            fontWeight: fontWeights.regular,
            color: colors.text.highEmphasis.onLight,
            lineHeight: '24px',
          }}
        >
          {value}
        </span>
      </div>
    )
  }
)

DetailField.displayName = 'DetailField'
