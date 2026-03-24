'use client'

import React from 'react'
import {
  colors,
  fontFamilies,
  statsCard,
} from '@/styles/design-tokens'

// =============================================================================
// TYPES
// =============================================================================

export interface StatsCardProps {
  /** Label text (e.g., "Total products") */
  label: string
  /** Value to display (e.g., "74") */
  value: string | number
  /** Icon element */
  icon?: React.ReactNode
  /** Custom styles */
  style?: React.CSSProperties
}

// =============================================================================
// STATS CARD
// =============================================================================

export function StatsCard({
  label,
  value,
  icon,
  style,
}: StatsCardProps) {
  const containerStyle: React.CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    minWidth: statsCard.minWidth,
    height: statsCard.height,
    padding: `${statsCard.padding.y} ${statsCard.padding.x}`,
    gap: statsCard.gap,
    backgroundColor: statsCard.colors.background,
    borderRadius: statsCard.borderRadius,
    ...style,
  }

  const iconContainerStyle: React.CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: statsCard.icon.containerSize,
    height: statsCard.icon.containerSize,
    borderRadius: statsCard.icon.borderRadius,
    backgroundColor: statsCard.icon.background,
    flexShrink: 0,
  }

  const contentStyle: React.CSSProperties = {
    display: 'flex',
    flexDirection: 'column',
    gap: statsCard.contentGap,
  }

  const labelStyle: React.CSSProperties = {
    fontFamily: fontFamilies.body,
    fontSize: statsCard.typography.label.fontSize,
    fontWeight: statsCard.typography.label.fontWeight,
    lineHeight: statsCard.typography.label.lineHeight,
    color: statsCard.typography.label.color,
  }

  const valueStyle: React.CSSProperties = {
    fontFamily: fontFamilies.display,
    fontSize: statsCard.typography.value.fontSize,
    fontWeight: statsCard.typography.value.fontWeight,
    lineHeight: statsCard.typography.value.lineHeight,
    color: statsCard.typography.value.color,
  }

  // Default icon (box/cube)
  const defaultIcon = (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" focusable="false">
      <path d="M21 16V8C20.9996 7.6493 20.9071 7.30483 20.7315 7.00017C20.556 6.69552 20.3037 6.44179 20 6.26L13 2.26C12.696 2.07787 12.3511 1.98152 12 1.98152C11.6489 1.98152 11.304 2.07787 11 2.26L4 6.26C3.69626 6.44179 3.44398 6.69552 3.26846 7.00017C3.09294 7.30483 3.00036 7.6493 3 8V16C3.00036 16.3507 3.09294 16.6952 3.26846 16.9998C3.44398 17.3045 3.69626 17.5582 4 17.74L11 21.74C11.304 21.9221 11.6489 22.0185 12 22.0185C12.3511 22.0185 12.696 21.9221 13 21.74L20 17.74C20.3037 17.5582 20.556 17.3045 20.7315 16.9998C20.9071 16.6952 20.9996 16.3507 21 16Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M3.27002 6.96L12 12.01L20.73 6.96" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M12 22.08V12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  )

  return (
    <div style={containerStyle}>
      <div style={iconContainerStyle}>
        {icon || defaultIcon}
      </div>
      <div style={contentStyle}>
        <span style={labelStyle}>{label}</span>
        <span style={valueStyle}>{value}</span>
      </div>
    </div>
  )
}

StatsCard.displayName = 'StatsCard'

// =============================================================================
// STATS CARD GROUP
// =============================================================================

export interface StatsCardGroupProps {
  /** Stats cards to display */
  children: React.ReactNode
  /** Edit button callback */
  onEdit?: () => void
  /** Custom styles */
  style?: React.CSSProperties
}

export function StatsCardGroup({
  children,
  onEdit,
  style,
}: StatsCardGroupProps) {
  const containerStyle: React.CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    gap: '16px',
    ...style,
  }

  const editButtonStyle: React.CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: '32px',
    height: '32px',
    borderRadius: '8px',
    backgroundColor: 'transparent',
    border: 'none',
    cursor: 'pointer',
    color: colors.text.lowEmphasis.onLight,
  }

  const editIcon = (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M14.166 2.5009C14.3849 2.28203 14.6447 2.10842 14.9307 1.98996C15.2167 1.87151 15.5232 1.81055 15.8327 1.81055C16.1422 1.81055 16.4487 1.87151 16.7347 1.98996C17.0206 2.10842 17.2805 2.28203 17.4993 2.5009C17.7182 2.71977 17.8918 2.97961 18.0103 3.26558C18.1287 3.55154 18.1897 3.85804 18.1897 4.16757C18.1897 4.4771 18.1287 4.7836 18.0103 5.06956C17.8918 5.35553 17.7182 5.61537 17.4993 5.83424L6.24935 17.0842L1.66602 18.3342L2.91602 13.7509L14.166 2.5009Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  )

  return (
    <div style={containerStyle}>
      {children}
      {onEdit && (
        <button type="button" style={editButtonStyle} onClick={onEdit} aria-label="Edit stats">
          {editIcon}
        </button>
      )}
    </div>
  )
}

StatsCardGroup.displayName = 'StatsCardGroup'
