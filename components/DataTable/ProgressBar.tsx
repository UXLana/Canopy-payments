'use client'

import React, { forwardRef } from 'react'
import {
  colors,
  borderRadius,
  fontFamilies,
  fontWeights,
} from '../../styles/design-tokens'

// =============================================================================
// TYPES
// =============================================================================

export type ProgressBarStatus = 'success' | 'warning' | 'error' | 'info' | 'brand' | 'neutral'

export interface ProgressBarProps extends React.HTMLAttributes<HTMLDivElement> {
  /** 0–100 percentage value */
  value: number
  /** Explicit status override; auto-derived from value thresholds if omitted */
  status?: ProgressBarStatus
  /** Show the percentage label alongside the bar */
  showLabel?: boolean
  /** High threshold (>= this = success). Default 90 */
  highThreshold?: number
  /** Mid threshold (>= this = warning, below = error). Default 70 */
  midThreshold?: number
  /** Bar height in px. Default 6 */
  barHeight?: number
}

// =============================================================================
// STATUS RESOLVER
// =============================================================================

function resolveStatus(
  value: number,
  highThreshold: number,
  midThreshold: number,
): ProgressBarStatus {
  if (value >= highThreshold) return 'success'
  if (value >= midThreshold) return 'warning'
  return 'error'
}

const statusColors: Record<ProgressBarStatus, { fill: string; track: string; text: string }> = {
  success: { fill: colors.badge.success, track: colors.badge.successLight, text: colors.badge.success },
  warning: { fill: colors.badge.warning, track: colors.badge.yellowLight, text: colors.badge.warning },
  error:   { fill: colors.badge.important, track: colors.badge.importantLight, text: colors.badge.important },
  info:    { fill: colors.badge.info, track: colors.badge.infoLight, text: colors.badge.info },
  brand:   { fill: colors.brand.default, track: colors.brand.lighter, text: colors.brand.default },
  neutral: { fill: colors.badge.charcoal, track: colors.badge.charcoalLight, text: colors.badge.charcoal },
}

// =============================================================================
// COMPONENT
// =============================================================================

/**
 * ProgressBar — a compact inline progress indicator for table cells.
 *
 * Auto-derives status color from value thresholds:
 *   >= 90 → success (green)
 *   >= 70 → warning (amber)
 *   <  70 → error   (red)
 *
 * @example
 * <ProgressBar value={95} showLabel />
 * <ProgressBar value={42} status="error" />
 */
export const ProgressBar = forwardRef<HTMLDivElement, ProgressBarProps>(
  (
    {
      value,
      status,
      showLabel = true,
      highThreshold = 90,
      midThreshold = 70,
      barHeight = 6,
      style,
      ...props
    },
    ref,
  ) => {
    const clamped = Math.max(0, Math.min(100, value))
    const resolvedStatus = status ?? resolveStatus(clamped, highThreshold, midThreshold)
    const palette = statusColors[resolvedStatus]
    const radius = Math.round(barHeight / 2)

    return (
      <div
        ref={ref}
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          minWidth: '80px',
          ...style,
        }}
        {...props}
      >
        {/* Track */}
        <div
          role="progressbar"
          aria-valuenow={clamped}
          aria-valuemin={0}
          aria-valuemax={100}
          aria-label={`${clamped}% compliance`}
          style={{
            flex: 1,
            height: `${barHeight}px`,
            borderRadius: `${radius}px`,
            backgroundColor: palette.track,
            overflow: 'hidden',
          }}
        >
          {/* Fill */}
          <div
            style={{
              width: `${clamped}%`,
              height: '100%',
              borderRadius: `${radius}px`,
              backgroundColor: palette.fill,
              transition: 'width 0.3s ease',
            }}
          />
        </div>

        {/* Label */}
        {showLabel && (
          <span
            aria-hidden="true"
            style={{
              fontFamily: fontFamilies.mono,
              fontSize: '12px',
              fontWeight: fontWeights.semibold,
              lineHeight: '16px',
              color: palette.text,
              minWidth: '32px',
              textAlign: 'right',
              whiteSpace: 'nowrap',
            }}
          >
            {clamped}%
          </span>
        )}
      </div>
    )
  },
)

ProgressBar.displayName = 'ProgressBar'

export default ProgressBar
