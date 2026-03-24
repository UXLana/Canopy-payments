'use client'

import React from 'react'
import {
  colors,
  spacing,
  borderRadius,
  typography,
  fontFamilies,
} from '@/styles/design-tokens'
import type { DataTableDisplay } from './DataTable'

// =============================================================================
// TOOLBAR CONTAINER
// =============================================================================

interface ToolbarProps {
  children?: React.ReactNode
}

interface ToolbarSlotProps {
  children?: React.ReactNode
}

function ToolbarLeft({ children }: ToolbarSlotProps) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: spacing['2xs'], paddingLeft: spacing.xs }}>
      {children}
    </div>
  )
}
ToolbarLeft.displayName = 'DataTable.Toolbar.Left'

function ToolbarRight({ children }: ToolbarSlotProps) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: spacing['2xs'], marginLeft: 'auto' }}>
      {children}
    </div>
  )
}
ToolbarRight.displayName = 'DataTable.Toolbar.Right'

export function Toolbar({ children }: ToolbarProps) {
  return (
    <div
      style={{
        display: 'flex',
        flexWrap: 'wrap',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: spacing.xs,
        padding: spacing.xs,
        backgroundColor: colors.surface.light,
        border: `1px solid ${colors.border.lowEmphasis.onLight}`,
        borderRadius: borderRadius.md,
      }}
    >
      {children}
    </div>
  )
}
Toolbar.Left = ToolbarLeft
Toolbar.Right = ToolbarRight
Toolbar.displayName = 'DataTable.Toolbar'

// =============================================================================
// ICON BUTTON (atomic toolbar button)
// =============================================================================

export interface IconButtonProps {
  children?: React.ReactNode
  active?: boolean
  onClick?: () => void
  title?: string
  /** Optional text label, hidden on small screens */
  label?: string
  disabled?: boolean
}

export function IconButton({ children, active, onClick, title, label, disabled }: IconButtonProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      title={title}
      disabled={disabled}
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: 6,
        padding: `6px ${spacing.xs}`,
        borderRadius: borderRadius.md,
        border: 'none',
        background: active ? colors.hover.onLight : 'transparent',
        color: active ? colors.text.highEmphasis.onLight : colors.text.lowEmphasis.onLight,
        cursor: disabled ? 'not-allowed' : 'pointer',
        opacity: disabled ? 0.4 : 1,
        fontFamily: fontFamilies.body,
        fontSize: '12px',
        fontWeight: 500,
        lineHeight: 1,
        transition: 'background-color 150ms ease, color 150ms ease',
      }}
    >
      {children}
      {label && (
        <span style={{ ...typography.body.xs, fontWeight: 500 }}>{label}</span>
      )}
    </button>
  )
}
IconButton.displayName = 'DataTable.IconButton'

// =============================================================================
// VIEW TOGGLE (grid / list)
// =============================================================================

export interface ViewToggleProps {
  value: DataTableDisplay
  onChange: (value: 'table' | 'cards') => void
}

const GridIcon = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
    <rect x="1.5" y="1.5" width="5" height="5" rx="1" stroke="currentColor" strokeWidth="1.3" />
    <rect x="9.5" y="1.5" width="5" height="5" rx="1" stroke="currentColor" strokeWidth="1.3" />
    <rect x="1.5" y="9.5" width="5" height="5" rx="1" stroke="currentColor" strokeWidth="1.3" />
    <rect x="9.5" y="9.5" width="5" height="5" rx="1" stroke="currentColor" strokeWidth="1.3" />
  </svg>
)

const ListIcon = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
    <line x1="1" y1="3" x2="15" y2="3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    <line x1="1" y1="8" x2="15" y2="8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    <line x1="1" y1="13" x2="15" y2="13" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
  </svg>
)

export function ViewToggle({ value, onChange }: ViewToggleProps) {
  return (
    <div style={{ display: 'flex', alignItems: 'center' }}>
      <div
        style={{
          width: 1,
          height: 24,
          backgroundColor: colors.border.lowEmphasis.onLight,
          margin: `0 ${spacing['2xs']}`,
        }}
      />
      <IconButton active={value === 'cards'} onClick={() => onChange('cards')} title="Grid view">
        <GridIcon />
      </IconButton>
      <IconButton active={value === 'table'} onClick={() => onChange('table')} title="List view">
        <ListIcon />
      </IconButton>
    </div>
  )
}
ViewToggle.displayName = 'DataTable.ViewToggle'

// =============================================================================
// FILTER BUTTON
// =============================================================================

export interface FilterButtonProps {
  active?: boolean
  /** Number of active filters (shows a dot when > 0) */
  count?: number
  onClick?: () => void
}

const FilterIcon = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
    <path d="M2 3h12M4 8h8M6 13h4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
  </svg>
)

export function FilterButton({ active, count = 0, onClick }: FilterButtonProps) {
  const hasFilters = count > 0 || active
  return (
    <IconButton active={hasFilters} onClick={onClick} title={`Filter${count > 0 ? ` (${count} active)` : ''}`}>
      <span style={{ position: 'relative', display: 'inline-flex' }}>
        <FilterIcon />
        {count > 0 && (
          <span
            style={{
              position: 'absolute',
              top: -1,
              right: -2,
              width: 6,
              height: 6,
              borderRadius: '50%',
              backgroundColor: colors.text.important,
            }}
          />
        )}
      </span>
    </IconButton>
  )
}
FilterButton.displayName = 'DataTable.FilterButton'

// =============================================================================
// SORT BUTTON
// =============================================================================

export interface SortButtonProps {
  active?: boolean
  onClick?: () => void
}

const SortButtonIcon = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
    <path d="M4 6l4-4 4 4M4 10l4 4 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
)

export function SortButton({ active, onClick }: SortButtonProps) {
  return (
    <IconButton active={active} onClick={onClick} title="Sort">
      <SortButtonIcon />
    </IconButton>
  )
}
SortButton.displayName = 'DataTable.SortButton'

// =============================================================================
// SELECTION INFO
// =============================================================================

export interface SelectionInfoProps {
  count: number
  onClear?: () => void
  emptyText?: string
  /** Bulk action buttons rendered as children */
  children?: React.ReactNode
}

const ClearIcon = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
    <path d="M4 4L12 12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    <path d="M12 4L4 12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
  </svg>
)

export function SelectionInfo({
  count,
  onClear,
  emptyText = 'Actions will appear here after selection',
  children,
}: SelectionInfoProps) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: spacing['2xs'] }}>
      <span
        style={{
          ...typography.body.sm,
          marginRight: spacing['2xs'],
          color: count > 0 ? colors.text.highEmphasis.onLight : colors.text.lowEmphasis.onLight,
          fontWeight: count > 0 ? 500 : 400,
        }}
      >
        Selected: {count}
      </span>

      {count > 0 && onClear && (
        <IconButton onClick={onClear} title="Clear selection">
          <ClearIcon />
        </IconButton>
      )}

      {count === 0 && emptyText && (
        <>
          <div style={{ width: 1, height: 20, backgroundColor: colors.border.lowEmphasis.onLight, margin: `0 ${spacing['2xs']}` }} />
          <span style={{ ...typography.body.sm, color: colors.text.lowEmphasis.onLight }}>
            {emptyText}
          </span>
        </>
      )}

      {count > 0 && children && (
        <>
          <div style={{ width: 1, height: 20, backgroundColor: colors.border.lowEmphasis.onLight, margin: `0 ${spacing['2xs']}` }} />
          {children}
        </>
      )}
    </div>
  )
}
SelectionInfo.displayName = 'DataTable.SelectionInfo'
