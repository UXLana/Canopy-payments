'use client'

import React from 'react'
import {
  colors,
  spacing,
  typography,
  fontFamilies,
  fontWeights,
  borderRadiusSemantics,
} from '@/styles/design-tokens'

interface StatCardProps {
  label: string
  value: string | number
  subtitle?: string
  icon?: React.ReactNode
  iconColor?: string
  iconBg?: string
}

export function StatCard({ label, value, subtitle, icon, iconColor, iconBg }: StatCardProps) {
  return (
    <div
      style={{
        flex: 1,
        minWidth: '160px',
        padding: spacing.md,
        backgroundColor: colors.surface.light,
        borderRadius: borderRadiusSemantics.card,
        border: `1px solid ${colors.border.lowEmphasis.onLight}`,
        display: 'flex',
        alignItems: 'flex-start',
        gap: spacing.md,
      }}
    >
      {icon && (
        <div
          style={{
            width: '40px',
            height: '40px',
            borderRadius: borderRadiusSemantics.card,
            backgroundColor: iconBg || colors.brand.default,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: iconColor || colors.text.highEmphasis.onDark,
            flexShrink: 0,
          }}
          aria-hidden="true"
        >
          {icon}
        </div>
      )}
      <div style={{ display: 'flex', flexDirection: 'column', gap: spacing['2xs'], minWidth: 0 }}>
        <div style={{ fontFamily: fontFamilies.body, fontSize: typography.label.sm.fontSize, fontWeight: fontWeights.medium, color: colors.text.lowEmphasis.onLight }}>
          {label}
        </div>
        <div style={{ fontFamily: fontFamilies.display, fontSize: typography.heading.h3.fontSize, fontWeight: fontWeights.bold, lineHeight: '1.2', color: colors.text.highEmphasis.onLight }}>
          {value}
        </div>
        {subtitle && (
          <div style={{ fontFamily: fontFamilies.body, fontSize: typography.body.xs.fontSize, color: colors.text.lowEmphasis.onLight }}>
            {subtitle}
          </div>
        )}
      </div>
    </div>
  )
}
