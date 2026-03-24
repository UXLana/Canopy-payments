'use client'

import React, { forwardRef } from 'react'
import {
  colors,
  spacing,
  typography,
  fontFamilies,
  fontWeights,
} from '@/styles/design-tokens'

export interface EmptyStateProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Icon or illustration to display */
  icon?: React.ReactNode
  /** Primary message */
  title: string
  /** Secondary explanatory text */
  description?: string
  /** Action button or link */
  action?: React.ReactNode
}

export const EmptyState = forwardRef<HTMLDivElement, EmptyStateProps>(
  ({ icon, title, description, action, style, ...props }, ref) => {
    return (
      <div
        ref={ref}
        role="region"
        aria-label={title}
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          padding: spacing['4xl'],
          gap: spacing.md,
          textAlign: 'center',
          ...style,
        }}
        {...props}
      >
        {icon && (
          <div
            aria-hidden="true"
            style={{
              width: '64px',
              height: '64px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              borderRadius: '50%',
              backgroundColor: colors.surface.lightDarker,
              color: colors.text.lowEmphasis.onLight,
            }}
          >
            {icon}
          </div>
        )}
        <h3
          style={{
            fontFamily: fontFamilies.display,
            fontSize: typography.heading.h5.fontSize,
            fontWeight: fontWeights.semibold,
            color: colors.text.highEmphasis.onLight,
            margin: 0,
          }}
        >
          {title}
        </h3>
        {description && (
          <p
            style={{
              fontFamily: fontFamilies.body,
              fontSize: typography.body.md.fontSize,
              fontWeight: fontWeights.regular,
              color: colors.text.lowEmphasis.onLight,
              margin: 0,
              maxWidth: '420px',
              lineHeight: '24px',
            }}
          >
            {description}
          </p>
        )}
        {action && <div style={{ marginTop: spacing.xs }}>{action}</div>}
      </div>
    )
  }
)

EmptyState.displayName = 'EmptyState'
