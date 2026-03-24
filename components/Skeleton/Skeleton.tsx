'use client'

import React, { forwardRef } from 'react'
import {
  colors,
  borderRadiusSemantics,
} from '@/styles/design-tokens'

export interface SkeletonProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Width — number (px) or string (e.g., '100%') */
  width?: number | string
  /** Height — number (px) or string */
  height?: number | string
  /** Shape variant */
  variant?: 'text' | 'rectangular' | 'circular'
}

export const Skeleton = forwardRef<HTMLDivElement, SkeletonProps>(
  ({ width, height, variant = 'text', style, ...props }, ref) => {
    const variantStyles: Record<string, React.CSSProperties> = {
      text: {
        width: width ?? '100%',
        height: height ?? '16px',
        borderRadius: '4px',
      },
      rectangular: {
        width: width ?? '100%',
        height: height ?? '48px',
        borderRadius: borderRadiusSemantics.card,
      },
      circular: {
        width: width ?? 40,
        height: height ?? 40,
        borderRadius: '50%',
      },
    }

    return (
      <div
        ref={ref}
        role="presentation"
        aria-hidden="true"
        style={{
          backgroundColor: colors.border.lowEmphasis.onLight,
          animation: 'skeleton-pulse 1.5s ease-in-out infinite',
          ...variantStyles[variant],
          ...style,
        }}
        {...props}
      />
    )
  }
)

Skeleton.displayName = 'Skeleton'

// Inject keyframes once
if (typeof document !== 'undefined') {
  const styleId = 'mtr-skeleton-keyframes'
  if (!document.getElementById(styleId)) {
    const styleEl = document.createElement('style')
    styleEl.id = styleId
    styleEl.textContent = `
      @keyframes skeleton-pulse {
        0%, 100% { opacity: 1; }
        50% { opacity: 0.4; }
      }
      @media (prefers-reduced-motion: reduce) {
        @keyframes skeleton-pulse {
          0%, 100% { opacity: 0.7; }
        }
      }
    `
    document.head.appendChild(styleEl)
  }
}
