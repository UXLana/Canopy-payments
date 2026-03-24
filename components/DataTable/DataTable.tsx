'use client'

import React, { forwardRef, useState, useCallback, useEffect, useMemo, useId } from 'react'
import {
  colors,
  spacing,
  borderRadius,
  typography,
  fontFamilies,
  fontWeights,
} from '../../styles/design-tokens'

// =============================================================================
// TYPES & CONTRACTS
// =============================================================================

export type ColumnAlign = 'left' | 'center' | 'right'
export type SortDirection = 'asc' | 'desc' | 'none'

/**
 * Display mode for the DataTable
 * - 'table': Always render as a traditional table
 * - 'cards': Always render as stacked cards / grid
 * - 'auto': Switch between table (desktop) and cards (mobile) based on breakpoint
 */
export type DataTableDisplay = 'table' | 'cards' | 'auto'
export type DataTableDensity = 'compact' | 'default' | 'comfortable'

export interface SortState {
  key: string
  direction: SortDirection
}

export interface DataTableColumn<T = Record<string, unknown>> {
  key: string
  header: string
  align?: ColumnAlign
  width?: string | number
  sortable?: boolean
  render?: (row: T, index: number) => React.ReactNode
  cardLabel?: string
  cardPrimary?: boolean
  hideOnCard?: boolean
  srOnly?: boolean
  /** When false, column is hidden from both table and card views (default true) */
  visible?: boolean
}

/**
 * Options passed to the custom card renderer when selection is enabled.
 */
export interface CardRenderOptions {
  selected: boolean
  onSelect: () => void
}

export interface DataTableProps<T = Record<string, unknown>>
  extends Omit<React.HTMLAttributes<HTMLDivElement>, 'children'> {
  columns: DataTableColumn<T>[]
  data: T[]
  rowKey: (row: T, index: number) => string
  display?: DataTableDisplay
  density?: DataTableDensity
  breakpoint?: number
  striped?: boolean
  hoverable?: boolean
  onRowClick?: (row: T, index: number) => void
  sort?: SortState
  onSortChange?: (sort: SortState) => void
  caption?: string
  emptyState?: React.ReactNode
  loading?: boolean
  loadingRows?: number
  stickyHeader?: boolean
  maxHeight?: string | number

  // --- Selection ---
  /** Enable row selection with checkboxes */
  selectable?: boolean
  /** Controlled set of selected row keys */
  selectedKeys?: Set<string>
  /** Fires when selection changes */
  onSelectionChange?: (keys: Set<string>) => void

  // --- Custom card renderer ---
  /** Override the default data-card layout with a fully custom card component */
  renderCard?: (row: T, index: number, options: CardRenderOptions) => React.ReactNode
  /** CSS grid-template-columns for the card grid (default: repeat(auto-fill, minmax(280px, 1fr))) */
  cardGridColumns?: string
}

// =============================================================================
// DENSITY CONFIG
// =============================================================================

const densityConfig: Record<DataTableDensity, {
  cellPaddingY: string
  cellPaddingX: string
  cardPaddingY: string
  cardPaddingX: string
}> = {
  compact: {
    cellPaddingY: spacing['2xs'],
    cellPaddingX: spacing.sm,
    cardPaddingY: spacing.xs,
    cardPaddingX: spacing.sm,
  },
  default: {
    cellPaddingY: spacing.xs,
    cellPaddingX: spacing.md,
    cardPaddingY: spacing.sm,
    cardPaddingX: spacing.md,
  },
  comfortable: {
    cellPaddingY: spacing.sm,
    cellPaddingX: spacing.md,
    cardPaddingY: spacing.md,
    cardPaddingX: spacing.lg,
  },
}

// =============================================================================
// INLINE CHECKBOX (avoids circular dep on Checkbox component)
// =============================================================================

interface InlineCheckboxProps {
  checked: boolean
  indeterminate?: boolean
  onChange: (checked: boolean) => void
  'aria-label'?: string
}

function InlineCheckbox({ checked, indeterminate, onChange, ...rest }: InlineCheckboxProps) {
  const ref = React.useRef<HTMLInputElement>(null)

  React.useEffect(() => {
    if (ref.current) ref.current.indeterminate = !!indeterminate
  }, [indeterminate])

  return (
    <input
      ref={ref}
      type="checkbox"
      checked={checked}
      onChange={e => onChange(e.target.checked)}
      style={{
        width: 16,
        height: 16,
        margin: 0,
        cursor: 'pointer',
        accentColor: colors.brand.default,
      }}
      {...rest}
    />
  )
}

// =============================================================================
// SORT ICON
// =============================================================================

function SortIcon({ direction }: { direction: SortDirection }) {
  const activeColor = colors.text.highEmphasis.onLight
  const inactiveColor = colors.text.disabled.onLight

  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 16 16"
      fill="none"
      aria-hidden="true"
      style={{ flexShrink: 0, marginLeft: '4px' }}
    >
      <path d="M8 3L11 7H5L8 3Z" fill={direction === 'asc' ? activeColor : inactiveColor} />
      <path d="M8 13L5 9H11L8 13Z" fill={direction === 'desc' ? activeColor : inactiveColor} />
    </svg>
  )
}

// =============================================================================
// SKELETON ROW
// =============================================================================

function SkeletonPulse({ width = '60%', height = '14px' }: { width?: string; height?: string }) {
  return (
    <span
      role="presentation"
      data-datatable-skeleton=""
      style={{
        display: 'inline-block',
        width,
        height,
        borderRadius: borderRadius.sm,
        backgroundColor: colors.surface.lightDarker,
        animation: 'datatable-skeleton-pulse 1.5s ease-in-out infinite',
      }}
    />
  )
}

// =============================================================================
// DEFAULT CARD VIEW
// =============================================================================

interface CardViewProps<T> {
  columns: DataTableColumn<T>[]
  data: T[]
  rowKey: (row: T, index: number) => string
  density: DataTableDensity
  hoverable: boolean
  onRowClick?: (row: T, index: number) => void
  loading: boolean
  loadingRows: number
  emptyState?: React.ReactNode
  tableId: string
  selectable: boolean
  selectedKeys: Set<string>
  onToggleSelect: (key: string) => void
  cardGridColumns: string
}

function CardView<T>({
  columns,
  data,
  rowKey,
  density,
  hoverable,
  onRowClick,
  loading,
  loadingRows,
  emptyState,
  selectable,
  selectedKeys,
  onToggleSelect,
  cardGridColumns,
}: CardViewProps<T>) {
  const d = densityConfig[density]
  const primaryCol = columns.find(c => c.cardPrimary) || columns[0]
  const otherCols = columns.filter(c => c !== primaryCol && !c.hideOnCard)

  if (loading) {
    return (
      <div role="list" aria-label="Loading data" style={{ display: 'grid', gridTemplateColumns: cardGridColumns, gap: spacing.sm }}>
        {Array.from({ length: loadingRows }).map((_, i) => (
          <div
            key={`skeleton-card-${i}`}
            role="listitem"
            style={{
              backgroundColor: colors.surface.light,
              border: `1px solid ${colors.border.lowEmphasis.onLight}`,
              borderRadius: borderRadius.md,
              padding: `${d.cardPaddingY} ${d.cardPaddingX}`,
            }}
          >
            <SkeletonPulse width="40%" height="18px" />
            <div style={{ marginTop: spacing.xs, display: 'flex', flexDirection: 'column', gap: spacing['2xs'] }}>
              <SkeletonPulse width="70%" />
              <SkeletonPulse width="55%" />
            </div>
          </div>
        ))}
      </div>
    )
  }

  if (data.length === 0) {
    return (
      <div style={{
        backgroundColor: colors.surface.light,
        border: `1px solid ${colors.border.lowEmphasis.onLight}`,
        borderRadius: borderRadius.md,
        padding: `${spacing['2xl']} ${spacing.md}`,
        textAlign: 'center',
      }}>
        {emptyState || (
          <div style={{ ...typography.body.sm, color: colors.text.lowEmphasis.onLight }}>
            No data to display
          </div>
        )}
      </div>
    )
  }

  return (
    <div role="list" aria-label={`${data.length} items`} style={{ display: 'grid', gridTemplateColumns: cardGridColumns, gap: spacing.sm }}>
      {data.map((row, rowIndex) => {
        const key = rowKey(row, rowIndex)
        const clickable = !!onRowClick
        const isSelected = selectedKeys.has(key)
        const primaryValue = primaryCol.render
          ? primaryCol.render(row, rowIndex)
          : String((row as Record<string, unknown>)[primaryCol.key] ?? '')
        const primaryLabel = typeof primaryValue === 'string' ? primaryValue : undefined

        return (
          <div
            key={key}
            role="listitem"
            aria-label={primaryLabel}
            data-datatable-card=""
            tabIndex={clickable ? 0 : undefined}
            onClick={clickable ? () => onRowClick?.(row, rowIndex) : undefined}
            onKeyDown={clickable ? (e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault()
                onRowClick?.(row, rowIndex)
              }
            } : undefined}
            style={{
              position: 'relative',
              backgroundColor: isSelected ? colors.selectedHighlight : colors.surface.light,
              border: `1px solid ${isSelected ? colors.brand.default : colors.border.lowEmphasis.onLight}`,
              borderRadius: borderRadius.md,
              padding: `${d.cardPaddingY} ${d.cardPaddingX}`,
              paddingLeft: selectable ? spacing['3xl'] : d.cardPaddingX,
              cursor: clickable ? 'pointer' : 'default',
              transition: 'box-shadow 200ms ease, border-color 200ms ease, background-color 200ms ease',
            }}
            onMouseEnter={hoverable ? (e) => {
              if (!isSelected) {
                e.currentTarget.style.borderColor = colors.border.midEmphasis.onLight
                e.currentTarget.style.boxShadow = '0px 2px 8px rgba(0, 0, 0, 0.06)'
              }
            } : undefined}
            onMouseLeave={hoverable ? (e) => {
              e.currentTarget.style.borderColor = isSelected ? colors.brand.default : colors.border.lowEmphasis.onLight
              e.currentTarget.style.boxShadow = 'none'
            } : undefined}
          >
            {selectable && (
              <div
                style={{ position: 'absolute', top: d.cardPaddingY, left: d.cardPaddingX }}
                onClick={e => e.stopPropagation()}
              >
                <InlineCheckbox
                  checked={isSelected}
                  onChange={() => onToggleSelect(key)}
                  aria-label={`Select ${primaryLabel ?? 'row'}`}
                />
              </div>
            )}

            <div style={{ ...typography.label.md, color: colors.text.highEmphasis.onLight, marginBottom: spacing.xs }}>
              {primaryValue}
            </div>

            <dl style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(140px, 1fr))',
              gap: `${spacing.xs} ${spacing.md}`,
              margin: 0,
            }}>
              {otherCols.map(col => (
                <div key={col.key}>
                  <dt style={{ ...typography.body.xs, color: colors.text.lowEmphasis.onLight, marginBottom: '2px' }}>
                    {col.cardLabel || col.header}
                  </dt>
                  <dd style={{ ...typography.body.sm, color: colors.text.highEmphasis.onLight, margin: 0 }}>
                    {col.render ? col.render(row, rowIndex) : String((row as Record<string, unknown>)[col.key] ?? '\u2014')}
                  </dd>
                </div>
              ))}
            </dl>
          </div>
        )
      })}
    </div>
  )
}

// =============================================================================
// KEYFRAMES (injected once)
// =============================================================================

let stylesInjected = false
function injectKeyframes() {
  if (stylesInjected || typeof document === 'undefined') return
  stylesInjected = true
  const style = document.createElement('style')
  style.textContent = `
    @keyframes datatable-skeleton-pulse {
      0%, 100% { opacity: 1; }
      50% { opacity: 0.4; }
    }
    @media (prefers-reduced-motion: reduce) {
      [data-datatable-skeleton] { animation: none !important; }
    }
    [data-datatable-focusable]:focus-visible {
      outline: 2px solid ${colors.brand.default};
      outline-offset: -2px;
      border-radius: ${borderRadius.sm};
    }
    [data-datatable-sort-btn]:focus-visible {
      outline: 2px solid ${colors.brand.default};
      outline-offset: 2px;
      border-radius: ${borderRadius.sm};
    }
    [data-datatable-card]:focus-visible {
      outline: 2px solid ${colors.brand.default};
      outline-offset: 2px;
      border-radius: ${borderRadius.lg};
    }
  `
  document.head.appendChild(style)
}

// =============================================================================
// COMPONENT
// =============================================================================

/**
 * DataTable
 *
 * A responsive data display component that supports traditional table and
 * card-based layouts with optional row selection, composable toolbar, and
 * custom card renderers.
 *
 * @example
 * // Basic table with selection
 * <DataTable
 *   selectable
 *   selectedKeys={selected}
 *   onSelectionChange={setSelected}
 *   columns={[
 *     { key: 'name', header: 'Name', cardPrimary: true },
 *     { key: 'status', header: 'Status', render: (row) => <Badge>{row.status}</Badge> },
 *   ]}
 *   data={items}
 *   rowKey={(row) => row.id}
 * />
 *
 * @example
 * // Custom card renderer
 * <DataTable
 *   display="cards"
 *   columns={columns}
 *   data={products}
 *   rowKey={(row) => row.id}
 *   renderCard={(product, i, { selected, onSelect }) => (
 *     <ProductCard product={product} selected={selected} onSelect={onSelect} />
 *   )}
 * />
 */
export const DataTable = forwardRef<HTMLDivElement, DataTableProps>(
  (
    {
      columns: rawColumns,
      data,
      rowKey,
      display = 'auto',
      density = 'default',
      breakpoint = 768,
      striped = false,
      hoverable = true,
      onRowClick,
      sort: controlledSort,
      onSortChange,
      caption,
      emptyState,
      loading = false,
      loadingRows = 5,
      stickyHeader = false,
      maxHeight,
      selectable = false,
      selectedKeys: controlledSelectedKeys,
      onSelectionChange,
      renderCard,
      cardGridColumns = 'repeat(auto-fill, minmax(280px, 1fr))',
      style: styleProp,
      ...props
    },
    ref
  ) => {
    const tableId = useId()

    // Filter hidden columns
    const columns = useMemo(
      () => rawColumns.filter(c => c.visible !== false),
      [rawColumns],
    )

    // -----------------------------------------------------------------------
    // Selection
    // -----------------------------------------------------------------------
    const [internalSelected, setInternalSelected] = useState<Set<string>>(new Set())
    const selectedKeys = controlledSelectedKeys ?? internalSelected
    const setSelectedKeys = useCallback((keys: Set<string>) => {
      if (onSelectionChange) {
        onSelectionChange(keys)
      } else {
        setInternalSelected(keys)
      }
    }, [onSelectionChange])

    const toggleSelect = useCallback((key: string) => {
      const next = new Set(selectedKeys)
      if (next.has(key)) next.delete(key)
      else next.add(key)
      setSelectedKeys(next)
    }, [selectedKeys, setSelectedKeys])

    const toggleSelectAll = useCallback(() => {
      if (selectedKeys.size === data.length) {
        setSelectedKeys(new Set())
      } else {
        setSelectedKeys(new Set(data.map((row, i) => rowKey(row, i))))
      }
    }, [data, rowKey, selectedKeys, setSelectedKeys])

    const allSelected = data.length > 0 && selectedKeys.size === data.length
    const someSelected = selectedKeys.size > 0 && !allSelected

    // -----------------------------------------------------------------------
    // Responsive display mode
    // -----------------------------------------------------------------------
    const [viewportWidth, setViewportWidth] = useState<number>(1024)

    useEffect(() => {
      setViewportWidth(window.innerWidth)
      if (display !== 'auto') return
      const handleResize = () => setViewportWidth(window.innerWidth)
      window.addEventListener('resize', handleResize)
      return () => window.removeEventListener('resize', handleResize)
    }, [display])

    const resolvedDisplay: 'table' | 'cards' = useMemo(() => {
      if (display === 'table') return 'table'
      if (display === 'cards') return 'cards'
      return viewportWidth < breakpoint ? 'cards' : 'table'
    }, [display, viewportWidth, breakpoint])

    // -----------------------------------------------------------------------
    // Sort
    // -----------------------------------------------------------------------
    const [internalSort, setInternalSort] = useState<SortState>({ key: '', direction: 'none' })
    const currentSort = controlledSort ?? internalSort
    const [sortAnnouncement, setSortAnnouncement] = useState('')

    const handleSort = useCallback((columnKey: string) => {
      const next: SortState = (() => {
        if (currentSort.key !== columnKey) return { key: columnKey, direction: 'asc' as const }
        if (currentSort.direction === 'asc') return { key: columnKey, direction: 'desc' as const }
        return { key: '', direction: 'none' as const }
      })()

      const col = columns.find(c => c.key === columnKey)
      const colName = col?.header || columnKey
      setSortAnnouncement(
        next.direction === 'none'
          ? `Sort removed from ${colName}`
          : `Sorted by ${colName}, ${next.direction === 'asc' ? 'ascending' : 'descending'}`
      )

      if (onSortChange) onSortChange(next)
      else setInternalSort(next)
    }, [currentSort, onSortChange, columns])

    // -----------------------------------------------------------------------
    // Sorted data
    // -----------------------------------------------------------------------
    const sortedData = useMemo(() => {
      if (controlledSort || currentSort.direction === 'none') return data
      const key = currentSort.key
      const dir = currentSort.direction === 'asc' ? 1 : -1
      return [...data].sort((a, b) => {
        const aVal = (a as Record<string, unknown>)[key]
        const bVal = (b as Record<string, unknown>)[key]
        if (aVal == null && bVal == null) return 0
        if (aVal == null) return 1
        if (bVal == null) return -1
        if (typeof aVal === 'number' && typeof bVal === 'number') return (aVal - bVal) * dir
        return String(aVal).localeCompare(String(bVal)) * dir
      })
    }, [data, controlledSort, currentSort])

    useEffect(() => { injectKeyframes() }, [])

    // -----------------------------------------------------------------------
    // Card View (custom renderer or default)
    // -----------------------------------------------------------------------
    if (resolvedDisplay === 'cards') {
      if (renderCard) {
        if (loading) {
          const d = densityConfig[density]
          return (
            <div ref={ref} style={{ width: '100%', ...styleProp }} {...props}>
              <div style={{ display: 'grid', gridTemplateColumns: cardGridColumns, gap: spacing.md }}>
                {Array.from({ length: loadingRows }).map((_, i) => (
                  <div
                    key={`skeleton-custom-${i}`}
                    style={{
                      backgroundColor: colors.surface.light,
                      border: `1px solid ${colors.border.lowEmphasis.onLight}`,
                      borderRadius: borderRadius.md,
                      padding: spacing.md,
                      minHeight: 160,
                    }}
                  >
                    <SkeletonPulse width="60%" height="16px" />
                    <div style={{ marginTop: spacing.sm }}><SkeletonPulse width="80%" /></div>
                    <div style={{ marginTop: spacing.xs }}><SkeletonPulse width="40%" /></div>
                  </div>
                ))}
              </div>
            </div>
          )
        }

        if (sortedData.length === 0) {
          return (
            <div ref={ref} style={{ width: '100%', ...styleProp }} {...props}>
              <div style={{
                backgroundColor: colors.surface.light,
                border: `1px solid ${colors.border.lowEmphasis.onLight}`,
                borderRadius: borderRadius.lg,
                padding: `${spacing['2xl']} ${spacing.md}`,
                textAlign: 'center',
              }}>
                {emptyState || (
                  <div style={{ ...typography.body.sm, color: colors.text.lowEmphasis.onLight }}>
                    No data to display
                  </div>
                )}
              </div>
            </div>
          )
        }

        return (
          <div ref={ref} style={{ width: '100%', ...styleProp }} {...props}>
            <div style={{ display: 'grid', gridTemplateColumns: cardGridColumns, gap: spacing.md }}>
              {sortedData.map((row, rowIndex) => {
                const key = rowKey(row, rowIndex)
                return (
                  <React.Fragment key={key}>
                    {renderCard(row, rowIndex, {
                      selected: selectedKeys.has(key),
                      onSelect: () => toggleSelect(key),
                    })}
                  </React.Fragment>
                )
              })}
            </div>
          </div>
        )
      }

      return (
        <div ref={ref} style={{ width: '100%', ...styleProp }} {...props}>
          <CardView
            columns={columns}
            data={sortedData as Record<string, unknown>[]}
            rowKey={rowKey as (row: Record<string, unknown>, i: number) => string}
            density={density}
            hoverable={hoverable}
            onRowClick={onRowClick as ((row: Record<string, unknown>, i: number) => void) | undefined}
            loading={loading}
            loadingRows={loadingRows}
            emptyState={emptyState}
            tableId={tableId}
            selectable={selectable}
            selectedKeys={selectedKeys}
            onToggleSelect={toggleSelect}
            cardGridColumns={cardGridColumns}
          />
        </div>
      )
    }

    // -----------------------------------------------------------------------
    // Table View
    // -----------------------------------------------------------------------
    const d = densityConfig[density]

    const containerStyle: React.CSSProperties = {
      backgroundColor: colors.surface.light,
      border: `1px solid ${colors.border.lowEmphasis.onLight}`,
      borderRadius: borderRadius.md,
      overflow: 'hidden',
      ...styleProp,
    }

    const scrollContainerStyle: React.CSSProperties = maxHeight
      ? { maxHeight, overflowY: 'auto' }
      : {}

    const thBaseStyle: React.CSSProperties = {
      ...typography.label.sm,
      color: colors.text.lowEmphasis.onLight,
      padding: `${d.cellPaddingY} ${d.cellPaddingX}`,
      fontWeight: fontWeights.medium,
      whiteSpace: 'nowrap',
      backgroundColor: colors.surface.lightDarker,
      borderBottom: `1px solid ${colors.border.lowEmphasis.onLight}`,
      ...(stickyHeader ? { position: 'sticky' as const, top: 0, zIndex: 1 } : {}),
    }

    const tdBaseStyle: React.CSSProperties = {
      ...typography.body.sm,
      padding: `${d.cellPaddingY} ${d.cellPaddingX}`,
      color: colors.text.highEmphasis.onLight,
    }

    const alignMap: Record<ColumnAlign, React.CSSProperties['textAlign']> = {
      left: 'left', center: 'center', right: 'right',
    }

    const totalCols = columns.length + (selectable ? 1 : 0)

    return (
      <div ref={ref} style={containerStyle} {...props}>
        <div style={scrollContainerStyle}>
          <div
            aria-live="polite"
            aria-atomic="true"
            role="status"
            style={{
              position: 'absolute', width: '1px', height: '1px', padding: 0,
              margin: '-1px', overflow: 'hidden', clip: 'rect(0, 0, 0, 0)',
              whiteSpace: 'nowrap', borderWidth: 0,
            }}
          >
            {loading ? 'Loading data\u2026' : sortAnnouncement}
          </div>
          <table
            role="table"
            aria-label={caption}
            aria-busy={loading}
            aria-rowcount={loading ? undefined : sortedData.length}
            style={{ width: '100%', borderCollapse: 'collapse', fontFamily: fontFamilies.body }}
          >
            {caption && (
              <caption style={{
                position: 'absolute', width: '1px', height: '1px', padding: 0,
                margin: '-1px', overflow: 'hidden', clip: 'rect(0, 0, 0, 0)',
                whiteSpace: 'nowrap', borderWidth: 0,
              }}>
                {caption}
              </caption>
            )}
            <thead>
              <tr>
                {selectable && (
                  <th
                    scope="col"
                    style={{ ...thBaseStyle, width: 44, textAlign: 'center', padding: `${d.cellPaddingY} ${spacing.sm}` }}
                  >
                    <InlineCheckbox
                      checked={allSelected}
                      indeterminate={someSelected}
                      onChange={toggleSelectAll}
                      aria-label={allSelected ? 'Deselect all rows' : 'Select all rows'}
                    />
                  </th>
                )}
                {columns.map(col => {
                  const isSortable = col.sortable === true
                  const isSorted = currentSort.key === col.key && currentSort.direction !== 'none'
                  const sortDir = currentSort.key === col.key ? currentSort.direction : 'none'

                  return (
                    <th
                      key={col.key}
                      scope="col"
                      aria-sort={
                        isSorted
                          ? currentSort.direction === 'asc' ? 'ascending' : 'descending'
                          : isSortable ? 'none' : undefined
                      }
                      style={{ ...thBaseStyle, textAlign: alignMap[col.align || 'left'], width: col.width }}
                    >
                      {isSortable ? (
                        <button
                          type="button"
                          data-datatable-sort-btn=""
                          aria-label={`Sort by ${col.header}${isSorted ? `, currently ${currentSort.direction === 'asc' ? 'ascending' : 'descending'}` : ''}`}
                          onClick={() => handleSort(col.key)}
                          style={{
                            display: 'inline-flex', alignItems: 'center',
                            justifyContent: col.align === 'center' ? 'center' : col.align === 'right' ? 'flex-end' : 'flex-start',
                            width: '100%', background: 'none', border: 'none', padding: 0, margin: 0,
                            cursor: 'pointer', font: 'inherit', color: 'inherit', userSelect: 'none',
                          }}
                        >
                          {col.header}
                          <SortIcon direction={sortDir} />
                        </button>
                      ) : (
                        <span style={{
                          display: 'inline-flex', alignItems: 'center',
                          justifyContent: col.align === 'center' ? 'center' : col.align === 'right' ? 'flex-end' : 'flex-start',
                        }}>
                          {col.header}
                        </span>
                      )}
                    </th>
                  )
                })}
              </tr>
            </thead>
            <tbody>
              {loading && Array.from({ length: loadingRows }).map((_, rowIdx) => (
                <tr key={`skeleton-${rowIdx}`}>
                  {selectable && (
                    <td style={{ ...tdBaseStyle, textAlign: 'center', borderBottom: `1px solid ${colors.border.lowEmphasis.onLight}`, padding: `${d.cellPaddingY} ${spacing.sm}` }}>
                      <SkeletonPulse width="16px" height="16px" />
                    </td>
                  )}
                  {columns.map((col, colIdx) => (
                    <td
                      key={col.key}
                      style={{
                        ...tdBaseStyle,
                        textAlign: alignMap[col.align || 'left'],
                        borderBottom: `1px solid ${colors.border.lowEmphasis.onLight}`,
                      }}
                    >
                      <SkeletonPulse width={colIdx === 0 ? '70%' : '50%'} />
                    </td>
                  ))}
                </tr>
              ))}

              {!loading && sortedData.length === 0 && (
                <tr>
                  <td
                    colSpan={totalCols}
                    style={{
                      ...tdBaseStyle, textAlign: 'center',
                      padding: `${spacing['2xl']} ${spacing.md}`,
                      color: colors.text.lowEmphasis.onLight,
                    }}
                  >
                    {emptyState || 'No data to display'}
                  </td>
                </tr>
              )}

              {!loading && sortedData.map((row, rowIndex) => {
                const key = rowKey(row as Record<string, unknown>, rowIndex)
                const clickable = !!onRowClick
                const isStriped = striped && rowIndex % 2 === 1
                const isSelected = selectable && selectedKeys.has(key)

                return (
                  <tr
                    key={key}
                    tabIndex={clickable ? 0 : undefined}
                    role="row"
                    aria-rowindex={rowIndex + 2}
                    aria-selected={selectable ? isSelected : undefined}
                    data-datatable-focusable={clickable ? '' : undefined}
                    onClick={clickable ? () => onRowClick?.(row, rowIndex) : undefined}
                    onKeyDown={clickable ? (e) => {
                      if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault()
                        onRowClick?.(row, rowIndex)
                      }
                    } : undefined}
                    style={{
                      borderBottom: `1px solid ${colors.border.lowEmphasis.onLight}`,
                      cursor: clickable ? 'pointer' : 'default',
                      backgroundColor: isSelected
                        ? colors.selectedHighlight
                        : isStriped ? colors.surface.lightDarker : 'transparent',
                      transition: hoverable ? 'background-color 150ms ease' : undefined,
                    }}
                    onMouseEnter={hoverable ? (e) => {
                      if (!isSelected) e.currentTarget.style.backgroundColor = colors.surface.lightDarker
                    } : undefined}
                    onMouseLeave={hoverable ? (e) => {
                      e.currentTarget.style.backgroundColor = isSelected
                        ? colors.selectedHighlight
                        : isStriped ? colors.surface.lightDarker : 'transparent'
                    } : undefined}
                  >
                    {selectable && (
                      <td
                        style={{ ...tdBaseStyle, textAlign: 'center', width: 44, padding: `${d.cellPaddingY} ${spacing.sm}` }}
                        onClick={e => e.stopPropagation()}
                      >
                        <InlineCheckbox
                          checked={isSelected}
                          onChange={() => toggleSelect(key)}
                          aria-label={`Select row ${rowIndex + 1}`}
                        />
                      </td>
                    )}
                    {columns.map(col => (
                      <td
                        key={col.key}
                        style={{ ...tdBaseStyle, textAlign: alignMap[col.align || 'left'], width: col.width }}
                      >
                        {col.render
                          ? col.render(row, rowIndex)
                          : String((row as Record<string, unknown>)[col.key] ?? '')
                        }
                      </td>
                    ))}
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </div>
    )
  }
) as <T = Record<string, unknown>>(
  props: DataTableProps<T> & React.RefAttributes<HTMLDivElement>
) => React.ReactElement

;(DataTable as React.FC).displayName = 'DataTable'

export default DataTable
