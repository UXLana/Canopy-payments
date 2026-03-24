'use client'

import React, { useState, useMemo, useCallback } from 'react'
import {
  colors,
  spacing,
  typography,
  fontFamilies,
  fontWeights,
  borderRadiusSemantics,
} from '@/styles/design-tokens'
import { Badge, Button, Input, DataTable, Skeleton, EmptyState } from '@/components'
import type { ViewState } from '@/components'
import type { BadgeProps } from '@/components/Badge/Badge'
import type { DataTableColumn } from '@/components'
import { Select } from '@/components/Select'
import { invoices, organizations, facilities, invoiceStatusOptions, marketOptions } from '../data'
import type { Invoice } from '../data'

// =============================================================================
// TYPES
// =============================================================================

type Perspective = 'supplier' | 'retailer'
type InvoiceTab = 'open' | 'paid'

// =============================================================================
// HELPERS
// =============================================================================

const formatCurrency = (amount: number) =>
  new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(amount)

const getOrgName = (id: string) => organizations.find((o) => o.id === id)?.name ?? id
const getOrgLicense = (id: string) => organizations.find((o) => o.id === id)?.licenseNumber ?? '—'
const getFacilityName = (id: string) => facilities.find((f) => f.id === id)?.name ?? '—'

const formatDate = (dateStr: string | null) => {
  if (!dateStr) return '—'
  return new Date(dateStr).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
}

const formatTerms = (terms: Invoice['paymentTerms']) => {
  const map: Record<string, string> = {
    'net-15': 'Net 15',
    'net-30': 'Net 30',
    'net-45': 'Net 45',
    'net-60': 'Net 60',
    'due-on-receipt': 'Due on Receipt',
  }
  return map[terms] ?? terms
}

const formatInvoiceType = (type: Invoice['invoiceType']) => {
  const map: Record<string, string> = {
    'standard': 'Standard',
    'credit-memo': 'Credit Memo',
    'cod': 'COD',
  }
  return map[type] ?? type
}

const getDaysPastDue = (dueDate: string, status: Invoice['status']): number => {
  if (status === 'paid' || status === 'voided') return 0
  const now = new Date()
  const due = new Date(dueDate)
  const diff = Math.floor((now.getTime() - due.getTime()) / (1000 * 60 * 60 * 24))
  return Math.max(0, diff)
}

const statusColorMap: Record<Invoice['status'], BadgeProps['color']> = {
  paid: 'success',
  partial: 'warning',
  sent: 'info',
  viewed: 'info',
  overdue: 'error',
  draft: 'neutral',
  voided: 'neutral',
}

const invoiceTypeColorMap: Record<Invoice['invoiceType'], BadgeProps['color']> = {
  'standard': 'neutral',
  'credit-memo': 'info',
  'cod': 'warning',
}

// Configurable threshold for overdue highlighting
const OVERDUE_HIGHLIGHT_DAYS = 0

// "Open" = anything not fully paid/voided
const OPEN_STATUSES: Invoice['status'][] = ['draft', 'sent', 'viewed', 'partial', 'overdue']
const PAID_STATUSES: Invoice['status'][] = ['paid', 'voided']

// Supplier org for perspective demo (Pacific Coast Holdings)
const SUPPLIER_ORG_ID = 'org-001'
// Retailer org for perspective demo (Mountain View Dispensary)
const RETAILER_ORG_ID = 'org-003'

// =============================================================================
// CSV EXPORT (C5)
// =============================================================================

function exportToCsv(data: Invoice[], perspective: Perspective) {
  const headers = [
    'Invoice Type', 'Invoice #', 'Manifest #',
    perspective === 'supplier' ? 'Receiving License' : 'Sending License',
    'Facility', 'Delivery Date', 'Payment Terms', 'Due Date',
    'Days Past Due', 'Amount', 'Discount', 'Status',
    'Payment Date', 'Notice of Default Sent', 'Date Notice Sent',
  ]

  const rows = data.map((inv) => [
    formatInvoiceType(inv.invoiceType),
    inv.invoiceNumber,
    inv.manifestNumber,
    perspective === 'supplier' ? getOrgLicense(inv.receiverOrgId) : getOrgLicense(inv.senderOrgId),
    perspective === 'supplier' ? getFacilityName(inv.receiverFacilityId) : getFacilityName(inv.senderFacilityId),
    formatDate(inv.deliveryDate),
    formatTerms(inv.paymentTerms),
    formatDate(inv.dueDate),
    String(getDaysPastDue(inv.dueDate, inv.status)),
    formatCurrency(inv.total),
    inv.discount > 0 ? formatCurrency(inv.discount) : '—',
    inv.status.charAt(0).toUpperCase() + inv.status.slice(1),
    formatDate(inv.paidAt),
    inv.noticeOfDefaultSent ? 'Yes' : 'No',
    formatDate(inv.dateNoticeSent),
  ])

  const csvContent = [headers, ...rows].map((row) => row.map((cell) => `"${cell}"`).join(',')).join('\n')
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = `invoices-export-${new Date().toISOString().split('T')[0]}.csv`
  link.click()
  URL.revokeObjectURL(url)
}

// =============================================================================
// COMPONENT
// =============================================================================

interface InvoicesV2Props {
  viewState: ViewState
  activeUseCase: number
}

export default function InvoicesV2({ viewState, activeUseCase }: InvoicesV2Props) {
  const [activeTab, setActiveTab] = useState<InvoiceTab>('open')
  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [marketFilter, setMarketFilter] = useState('all')
  const [selectedKeys, setSelectedKeys] = useState<Set<string>>(new Set())
  const [display, setDisplay] = useState<'table' | 'cards'>('table')

  // Perspective derived from use case
  const perspective: Perspective = activeUseCase === 1 ? 'retailer' : 'supplier'
  const currentOrgId = perspective === 'supplier' ? SUPPLIER_ORG_ID : RETAILER_ORG_ID
  const currentOrgName = getOrgName(currentOrgId)

  // Status filter options scoped to active tab
  const tabStatusOptions = useMemo(() => {
    const statuses = activeTab === 'open' ? OPEN_STATUSES : PAID_STATUSES
    return [
      { value: 'all', label: 'All Status' },
      ...invoiceStatusOptions.filter((opt) => opt.value === 'all' ? false : statuses.includes(opt.value as Invoice['status'])),
    ]
  }, [activeTab])

  const allMarketOptions = useMemo(
    () => [{ value: 'all', label: 'All Markets' }, ...marketOptions],
    []
  )

  // Filter invoices by tab, perspective, then user filters
  const filteredInvoices = useMemo(() => {
    const tabStatuses = activeTab === 'open' ? OPEN_STATUSES : PAID_STATUSES

    return invoices.filter((inv) => {
      // Tab filter
      if (!tabStatuses.includes(inv.status)) return false

      // Perspective filter: only show invoices involving current org
      if (perspective === 'supplier' && inv.senderOrgId !== currentOrgId) return false
      if (perspective === 'retailer' && inv.receiverOrgId !== currentOrgId) return false

      // Search
      const matchesSearch =
        !searchQuery ||
        inv.invoiceNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
        inv.manifestNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
        getOrgName(inv.senderOrgId).toLowerCase().includes(searchQuery.toLowerCase()) ||
        getOrgName(inv.receiverOrgId).toLowerCase().includes(searchQuery.toLowerCase())

      // Filters
      const matchesStatus = statusFilter === 'all' || inv.status === statusFilter
      const matchesMarket = marketFilter === 'all' || inv.market === marketFilter

      return matchesSearch && matchesStatus && matchesMarket
    })
  }, [activeTab, perspective, currentOrgId, searchQuery, statusFilter, marketFilter])

  const activeFilterCount = [searchQuery, statusFilter !== 'all', marketFilter !== 'all'].filter(Boolean).length

  const clearFilters = useCallback(() => {
    setSearchQuery('')
    setStatusFilter('all')
    setMarketFilter('all')
  }, [])

  // Counts for tab badges
  const openCount = invoices.filter((inv) => {
    if (!OPEN_STATUSES.includes(inv.status)) return false
    if (perspective === 'supplier' && inv.senderOrgId !== currentOrgId) return false
    if (perspective === 'retailer' && inv.receiverOrgId !== currentOrgId) return false
    return true
  }).length

  const paidCount = invoices.filter((inv) => {
    if (!PAID_STATUSES.includes(inv.status)) return false
    if (perspective === 'supplier' && inv.senderOrgId !== currentOrgId) return false
    if (perspective === 'retailer' && inv.receiverOrgId !== currentOrgId) return false
    return true
  }).length

  // Row highlight check (C3)
  const isOverdueHighlighted = (inv: Invoice) => {
    const dpd = getDaysPastDue(inv.dueDate, inv.status)
    return inv.status === 'overdue' && dpd > OVERDUE_HIGHLIGHT_DAYS
  }

  // =============================================================================
  // COLUMNS — full Crawl spec (C1)
  // =============================================================================

  const columns: DataTableColumn<Invoice>[] = useMemo(() => {
    const counterpartLabel = perspective === 'supplier' ? 'Receiving License' : 'Sending License'
    const facilityLabel = perspective === 'supplier' ? 'Receiving Facility' : 'Sending Facility'

    const cols: DataTableColumn<Invoice>[] = [
      {
        key: 'invoiceType',
        header: 'Type',
        render: (row) => (
          <Badge color={invoiceTypeColorMap[row.invoiceType]} variant="outlined" size="sm">
            {formatInvoiceType(row.invoiceType)}
          </Badge>
        ),
      },
      {
        key: 'invoiceNumber',
        header: 'Invoice #',
        sortable: true,
        render: (row) => (
          <a
            href={`/prototypes/canopy-payments/invoice-detail?id=${row.id}`}
            style={{
              fontFamily: fontFamilies.mono,
              fontSize: typography.body.sm.fontSize,
              fontWeight: fontWeights.semibold,
              color: colors.text.action.enabled,
              textDecoration: 'none',
            }}
          >
            {row.invoiceNumber}
          </a>
        ),
      },
      // C10: Manifest link
      {
        key: 'manifestNumber',
        header: 'Manifest #',
        sortable: true,
        render: (row) => (
          <a
            href={`/prototypes/canopy-payments/invoice-detail?manifest=${row.manifestNumber}`}
            style={{
              fontFamily: fontFamilies.mono,
              fontSize: typography.body.sm.fontSize,
              fontWeight: fontWeights.medium,
              color: colors.text.action.enabled,
              textDecoration: 'none',
            }}
            title={`View manifest ${row.manifestNumber}`}
          >
            {row.manifestNumber}
          </a>
        ),
      },
      {
        key: 'receiverOrgId' as keyof Invoice,
        header: counterpartLabel,
        sortable: true,
        render: (row) => {
          const orgId = perspective === 'supplier' ? row.receiverOrgId : row.senderOrgId
          return (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
              <span style={{ fontFamily: fontFamilies.body, fontSize: typography.body.sm.fontSize, color: colors.text.highEmphasis.onLight }}>
                {getOrgName(orgId)}
              </span>
              <span style={{ fontFamily: fontFamilies.mono, fontSize: typography.body.xs.fontSize, color: colors.text.lowEmphasis.onLight }}>
                {getOrgLicense(orgId)}
              </span>
            </div>
          )
        },
      },
      {
        key: 'receiverFacilityId' as keyof Invoice,
        header: facilityLabel,
        render: (row) => {
          const facId = perspective === 'supplier' ? row.receiverFacilityId : row.senderFacilityId
          return (
            <span style={{ fontFamily: fontFamilies.body, fontSize: typography.body.sm.fontSize, color: colors.text.highEmphasis.onLight }}>
              {getFacilityName(facId)}
            </span>
          )
        },
      },
      {
        key: 'deliveryDate',
        header: 'Delivery Date',
        sortable: true,
        render: (row) => (
          <span style={{ fontFamily: fontFamilies.body, fontSize: typography.body.sm.fontSize, color: colors.text.lowEmphasis.onLight }}>
            {formatDate(row.deliveryDate)}
          </span>
        ),
      },
      {
        key: 'paymentTerms',
        header: 'Terms',
        render: (row) => (
          <span style={{ fontFamily: fontFamilies.body, fontSize: typography.body.sm.fontSize, color: colors.text.lowEmphasis.onLight }}>
            {formatTerms(row.paymentTerms)}
          </span>
        ),
      },
      {
        key: 'dueDate',
        header: 'Due Date',
        sortable: true,
        render: (row) => (
          <span style={{ fontFamily: fontFamilies.body, fontSize: typography.body.sm.fontSize, color: colors.text.lowEmphasis.onLight }}>
            {formatDate(row.dueDate)}
          </span>
        ),
      },
      {
        key: 'dueDate' as keyof Invoice,
        header: 'Days Past Due',
        sortable: true,
        render: (row) => {
          const dpd = getDaysPastDue(row.dueDate, row.status)
          return (
            <span
              style={{
                fontFamily: fontFamilies.mono,
                fontSize: typography.body.sm.fontSize,
                fontWeight: dpd > 0 ? fontWeights.semibold : fontWeights.regular,
                color: dpd > 0 ? colors.status.important : colors.text.lowEmphasis.onLight,
              }}
            >
              {dpd > 0 ? dpd : '—'}
            </span>
          )
        },
      },
      {
        key: 'total',
        header: 'Amount',
        sortable: true,
        render: (row) => (
          <span
            style={{
              fontFamily: fontFamilies.mono,
              fontSize: typography.body.sm.fontSize,
              fontWeight: fontWeights.semibold,
              color: colors.text.highEmphasis.onLight,
              textAlign: 'right',
              display: 'block',
            }}
          >
            {formatCurrency(row.total)}
          </span>
        ),
      },
      {
        key: 'discount',
        header: 'Discount',
        render: (row) => (
          <span
            style={{
              fontFamily: fontFamilies.mono,
              fontSize: typography.body.sm.fontSize,
              color: row.discount > 0 ? colors.status.success : colors.text.lowEmphasis.onLight,
            }}
          >
            {row.discount > 0 ? formatCurrency(row.discount) : '—'}
          </span>
        ),
      },
      {
        key: 'status',
        header: 'Status',
        sortable: true,
        render: (row) => (
          <Badge color={statusColorMap[row.status]} variant="filled" size="sm">
            {row.status.charAt(0).toUpperCase() + row.status.slice(1)}
          </Badge>
        ),
      },
      {
        key: 'paidAt' as keyof Invoice,
        header: 'Payment Date',
        sortable: true,
        render: (row) => (
          <span style={{ fontFamily: fontFamilies.body, fontSize: typography.body.sm.fontSize, color: colors.text.lowEmphasis.onLight }}>
            {formatDate(row.paidAt)}
          </span>
        ),
      },
      {
        key: 'noticeOfDefaultSent' as keyof Invoice,
        header: 'Default Notice',
        render: (row) => (
          <Badge
            color={row.noticeOfDefaultSent ? 'error' : 'neutral'}
            variant={row.noticeOfDefaultSent ? 'filled' : 'outlined'}
            size="sm"
          >
            {row.noticeOfDefaultSent ? 'Sent' : 'No'}
          </Badge>
        ),
      },
      {
        key: 'dateNoticeSent' as keyof Invoice,
        header: 'Notice Date',
        render: (row) => (
          <span style={{ fontFamily: fontFamilies.body, fontSize: typography.body.sm.fontSize, color: colors.text.lowEmphasis.onLight }}>
            {formatDate(row.dateNoticeSent)}
          </span>
        ),
      },
    ]

    return cols
  }, [perspective])

  // =============================================================================
  // TAB BAR (C1: Open / Paid split)
  // =============================================================================

  const tabBarStyle: React.CSSProperties = {
    display: 'flex',
    gap: spacing.xs,
    marginBottom: spacing['2xs'],
  }

  const tabBtnStyle = (active: boolean): React.CSSProperties => ({
    padding: `${spacing.xs} ${spacing.md}`,
    fontFamily: fontFamilies.body,
    fontSize: typography.label.md.fontSize,
    fontWeight: active ? fontWeights.semibold : fontWeights.regular,
    color: active ? colors.brand.default : colors.text.lowEmphasis.onLight,
    backgroundColor: 'transparent',
    border: 'none',
    borderBottom: active ? `2px solid ${colors.brand.default}` : '2px solid transparent',
    cursor: 'pointer',
    transition: 'color 200ms ease-out, border-color 200ms ease-out',
    display: 'flex',
    alignItems: 'center',
    gap: spacing['2xs'],
  })

  const tabCountStyle = (active: boolean): React.CSSProperties => ({
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    minWidth: '20px',
    height: '20px',
    padding: `0 ${spacing['2xs']}`,
    fontFamily: fontFamilies.mono,
    fontSize: typography.body.xs.fontSize,
    fontWeight: fontWeights.semibold,
    color: active ? colors.text.highEmphasis.onDark : colors.text.lowEmphasis.onLight,
    backgroundColor: active ? colors.brand.default : colors.surface.lightDarker,
    borderRadius: '10px',
  })

  // =============================================================================
  // PERSPECTIVE TOGGLE (C11)
  // =============================================================================

  const perspectiveIndicator = (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: spacing.xs,
        padding: `${spacing['2xs']} ${spacing.sm}`,
        backgroundColor: colors.surface.lightDarker,
        borderRadius: borderRadiusSemantics.badge,
        fontFamily: fontFamilies.body,
        fontSize: typography.body.xs.fontSize,
        fontWeight: fontWeights.medium,
        color: colors.text.lowEmphasis.onLight,
      }}
    >
      <svg width="14" height="14" viewBox="0 0 16 16" fill="none" aria-hidden="true">
        <circle cx="8" cy="5" r="3" stroke="currentColor" strokeWidth="1.5" />
        <path d="M2 14C2 10.6863 4.68629 8 8 8C11.3137 8 14 10.6863 14 14" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      </svg>
      <span>Viewing as</span>
      <strong style={{ fontWeight: fontWeights.semibold, color: colors.text.highEmphasis.onLight }}>
        {perspective === 'supplier' ? 'Supplier' : 'Retailer'}
      </strong>
      <span style={{ color: colors.text.disabled.onLight }}>|</span>
      <span>{currentOrgName}</span>
    </div>
  )

  // =============================================================================
  // RENDER
  // =============================================================================

  if (viewState === 'loading') {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: spacing.md }}>
        <div style={{ display: 'flex', gap: spacing.sm }}>
          <Skeleton width={100} height={32} />
          <Skeleton width={80} height={32} />
        </div>
        <Skeleton width="100%" height={48} />
        <div style={{ display: 'flex', flexDirection: 'column', gap: spacing.sm }}>
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} style={{ display: 'flex', gap: spacing.md, alignItems: 'center', padding: `${spacing.sm} 0` }}>
              <Skeleton width={70} height={16} />
              <Skeleton width={100} height={16} />
              <Skeleton width={90} height={16} />
              <Skeleton width={120} height={16} />
              <Skeleton width={100} height={16} />
              <Skeleton width={80} height={16} />
              <Skeleton width={60} height={16} />
              <Skeleton width={80} height={16} />
              <Skeleton width={50} height={16} />
              <Skeleton width={80} height={16} />
            </div>
          ))}
        </div>
      </div>
    )
  }

  if (viewState === 'empty') {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: spacing.md }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={tabBarStyle}>
            <button style={tabBtnStyle(true)} type="button">Open <span style={tabCountStyle(true)}>0</span></button>
            <button style={tabBtnStyle(false)} type="button">Paid <span style={tabCountStyle(false)}>0</span></button>
          </div>
        </div>
        <div
          style={{
            backgroundColor: colors.surface.light,
            borderRadius: borderRadiusSemantics.card,
            border: `1px solid ${colors.border.lowEmphasis.onLight}`,
            padding: `${spacing['5xl']} ${spacing['2xl']}`,
          }}
        >
          <EmptyState
            aria-label="No invoices"
            icon={
              <svg width={64} height={64} viewBox="0 0 64 64" fill="none" aria-hidden="true">
                <rect x="12" y="8" width="40" height="48" rx="4" stroke={colors.border.midEmphasis.onLight} strokeWidth="2" />
                <path d="M22 20H42M22 28H38M22 36H34" stroke={colors.border.midEmphasis.onLight} strokeWidth="2" strokeLinecap="round" />
                <circle cx="46" cy="46" r="10" fill={colors.brand.default} />
                <path d="M42 46H50M46 42V50" stroke="white" strokeWidth="2.5" strokeLinecap="round" />
              </svg>
            }
            title="No invoices yet"
            description="Create your first invoice to start tracking payments across your organizations."
          >
            <Button
              emphasis="high"
              size="lg"
              onClick={() => (window.location.href = '/prototypes/canopy-payments/create-invoice')}
            >
              Create Invoice
            </Button>
          </EmptyState>
        </div>
      </div>
    )
  }

  if (viewState === 'error') {
    return (
      <div
        style={{
          backgroundColor: colors.surface.important,
          borderRadius: borderRadiusSemantics.card,
          border: `1px solid ${colors.surfaceBorder.important}`,
          padding: `${spacing['3xl']} ${spacing['2xl']}`,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: spacing.lg,
          textAlign: 'center',
        }}
      >
        <div
          style={{
            width: '64px',
            height: '64px',
            borderRadius: '50%',
            backgroundColor: 'rgba(193, 11, 30, 0.1)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <svg width={32} height={32} viewBox="0 0 32 32" fill="none" aria-hidden="true">
            <circle cx="16" cy="16" r="14" stroke={colors.status.important} strokeWidth="2" />
            <path d="M16 9V18M16 21V23" stroke={colors.status.important} strokeWidth="2" strokeLinecap="round" />
          </svg>
        </div>
        <div>
          <h3 style={{ fontFamily: fontFamilies.display, fontSize: typography.heading.h4.fontSize, fontWeight: fontWeights.semibold, color: colors.text.important, margin: 0 }}>
            Failed to load invoices
          </h3>
          <p style={{ fontFamily: fontFamilies.body, fontSize: typography.body.md.fontSize, color: colors.text.lowEmphasis.onLight, margin: `${spacing.xs} 0 0`, maxWidth: '400px' }}>
            There was an error connecting to the payments service. Please try again or contact support.
          </p>
        </div>
        <Button emphasis="high" size="lg" onClick={() => window.location.reload()}>
          Retry
        </Button>
      </div>
    )
  }

  // Default state
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: spacing.md }}>
      {/* Header row: Tabs + Perspective + Create Invoice */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: spacing.sm }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: spacing.lg }}>
          {/* C1: Open/Paid tabs */}
          <div style={tabBarStyle}>
            <button
              style={tabBtnStyle(activeTab === 'open')}
              onClick={() => { setActiveTab('open'); setStatusFilter('all'); setSelectedKeys(new Set()) }}
              type="button"
            >
              Open <span style={tabCountStyle(activeTab === 'open')}>{openCount}</span>
            </button>
            <button
              style={tabBtnStyle(activeTab === 'paid')}
              onClick={() => { setActiveTab('paid'); setStatusFilter('all'); setSelectedKeys(new Set()) }}
              type="button"
            >
              Paid <span style={tabCountStyle(activeTab === 'paid')}>{paidCount}</span>
            </button>
          </div>

          {/* C11: Perspective indicator */}
          {perspectiveIndicator}
        </div>

        {/* Supplier-only: Create Invoice */}
        {perspective === 'supplier' && (
          <Button
            emphasis="high"
            size="md"
            leftIcon={
              <svg width={16} height={16} viewBox="0 0 16 16" fill="none" aria-hidden="true">
                <path d="M8 2V14M2 8H14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
              </svg>
            }
            onClick={() => (window.location.href = '/prototypes/canopy-payments/create-invoice')}
          >
            Create Invoice
          </Button>
        )}

        {/* Retailer-only: Pay Selected */}
        {perspective === 'retailer' && selectedKeys.size > 0 && (
          <Button emphasis="high" size="md">
            Pay Selected ({selectedKeys.size})
          </Button>
        )}
      </div>

      {/* Toolbar */}
      <DataTable.Toolbar>
        <DataTable.Toolbar.Left>
          <Input
            placeholder="Search invoice #, manifest #, org..."
            value={searchQuery}
            onChange={(val) => setSearchQuery(val)}
            size="sm"
            fullWidth
            style={{ marginBottom: 0, maxWidth: '280px' }}
            startAdornment={
              <svg width={14} height={14} viewBox="0 0 16 16" fill="none" aria-hidden="true" style={{ color: colors.icon.enabled.onLight }}>
                <circle cx="7" cy="7" r="5" stroke="currentColor" strokeWidth="1.5" />
                <path d="M11 11L14 14" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
              </svg>
            }
          />
          <Select
            options={tabStatusOptions}
            value={statusFilter}
            onChange={setStatusFilter}
            size="sm"
            style={{ minWidth: '140px' }}
          />
          <Select
            options={allMarketOptions}
            value={marketFilter}
            onChange={setMarketFilter}
            size="sm"
            style={{ minWidth: '140px' }}
          />
          {activeFilterCount > 0 && (
            <DataTable.IconButton onClick={clearFilters} title="Clear all filters" label="Clear">
              <svg width="14" height="14" viewBox="0 0 16 16" fill="none" aria-hidden="true">
                <path d="M4 4L12 12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                <path d="M12 4L4 12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
              </svg>
            </DataTable.IconButton>
          )}
        </DataTable.Toolbar.Left>
        <DataTable.Toolbar.Right>
          <span
            style={{
              fontFamily: fontFamilies.body,
              fontSize: typography.body.xs.fontSize,
              fontWeight: fontWeights.medium,
              color: colors.text.lowEmphasis.onLight,
              whiteSpace: 'nowrap',
            }}
          >
            {filteredInvoices.length} {filteredInvoices.length === 1 ? 'invoice' : 'invoices'}
            {activeFilterCount > 0 && ' (filtered)'}
          </span>

          <DataTable.ViewToggle value={display} onChange={setDisplay} />

          {/* C5: Export */}
          <Button
            emphasis="low"
            size="md"
            leftIcon={
              <svg width={14} height={14} viewBox="0 0 16 16" fill="none" aria-hidden="true">
                <path d="M8 2V10M8 10L5 7M8 10L11 7" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M2 12V13C2 13.5523 2.44772 14 3 14H13C13.5523 14 14 13.5523 14 13V12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
              </svg>
            }
            onClick={() => exportToCsv(filteredInvoices, perspective)}
          >
            Export CSV
          </Button>
        </DataTable.Toolbar.Right>
      </DataTable.Toolbar>

      {/* DataTable with full column set — C3 overdue highlighting via cell-level styling */}
      <DataTable
        columns={columns}
        data={filteredInvoices}
        rowKey={(row) => row.id}
        density="compact"
        display={display}
        hoverable
        selectable={perspective === 'retailer'}
        selectedKeys={perspective === 'retailer' ? selectedKeys : undefined}
        onSelectionChange={perspective === 'retailer' ? setSelectedKeys : undefined}
        renderCard={(row) => (
          <div
            style={{
              padding: spacing.lg,
              backgroundColor: colors.surface.light,
              borderRadius: borderRadiusSemantics.card,
              border: `1px solid ${isOverdueHighlighted(row) ? colors.status.important : colors.border.lowEmphasis.onLight}`,
              display: 'flex',
              flexDirection: 'column',
              gap: spacing.sm,
              cursor: 'pointer',
              transition: 'border-color 200ms ease-out',
            }}
            onClick={() => (window.location.href = `/prototypes/canopy-payments/invoice-detail?id=${row.id}`)}
          >
            {/* Header: Type + Invoice # + Status */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: spacing.xs }}>
                <Badge color={invoiceTypeColorMap[row.invoiceType]} variant="outlined" size="sm">
                  {formatInvoiceType(row.invoiceType)}
                </Badge>
                <a
                  href={`/prototypes/canopy-payments/invoice-detail?id=${row.id}`}
                  style={{
                    fontFamily: fontFamilies.mono,
                    fontSize: typography.body.sm.fontSize,
                    fontWeight: fontWeights.semibold,
                    color: colors.text.action.enabled,
                    textDecoration: 'none',
                  }}
                  onClick={(e) => e.stopPropagation()}
                >
                  {row.invoiceNumber}
                </a>
              </div>
              <Badge color={statusColorMap[row.status]} variant="filled" size="sm">
                {row.status.charAt(0).toUpperCase() + row.status.slice(1)}
              </Badge>
            </div>

            {/* Amount */}
            <div style={{ fontFamily: fontFamilies.mono, fontSize: typography.heading.h4.fontSize, fontWeight: fontWeights.bold, color: colors.text.highEmphasis.onLight }}>
              {formatCurrency(row.total)}
            </div>

            {/* Counterpart + Manifest */}
            <div style={{ fontFamily: fontFamilies.body, fontSize: typography.body.xs.fontSize, color: colors.text.lowEmphasis.onLight, display: 'flex', flexDirection: 'column', gap: spacing['2xs'] }}>
              <span>{perspective === 'supplier' ? 'To' : 'From'}: {getOrgName(perspective === 'supplier' ? row.receiverOrgId : row.senderOrgId)}</span>
              <span>Manifest: {row.manifestNumber}</span>
            </div>

            {/* Footer: Due date + Days past due + Terms */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: `1px solid ${colors.border.lowEmphasis.onLight}`, paddingTop: spacing.sm, marginTop: spacing['2xs'] }}>
              <span style={{ fontFamily: fontFamilies.body, fontSize: typography.body.xs.fontSize, color: colors.text.lowEmphasis.onLight }}>
                Due {formatDate(row.dueDate)}
              </span>
              <div style={{ display: 'flex', alignItems: 'center', gap: spacing.xs }}>
                {getDaysPastDue(row.dueDate, row.status) > 0 && (
                  <Badge color="error" variant="outlined" size="sm">
                    {getDaysPastDue(row.dueDate, row.status)}d overdue
                  </Badge>
                )}
                <span style={{ fontFamily: fontFamilies.body, fontSize: typography.body.xs.fontSize, color: colors.text.lowEmphasis.onLight }}>
                  {formatTerms(row.paymentTerms)}
                </span>
              </div>
            </div>
          </div>
        )}
        cardGridColumns="repeat(auto-fill, minmax(300px, 1fr))"
        emptyState={
          <p style={{ fontFamily: fontFamilies.body, fontSize: typography.body.md.fontSize, color: colors.text.lowEmphasis.onLight, margin: 0 }}>
            No invoices match your filters. Try adjusting your search or filter criteria.
          </p>
        }
        style={{ boxShadow: 'none' }}
      />
    </div>
  )
}
