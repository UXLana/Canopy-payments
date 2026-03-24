'use client'

import React, { useState, useMemo } from 'react'
import {
  colors,
  spacing,
  typography,
  fontFamilies,
  fontWeights,
  borderRadiusSemantics,
  breakpoints,
} from '@/styles/design-tokens'
import { PrototypeToolbar, ViewState, Badge, Button, Input, DataTable, Skeleton, EmptyState, TabBar } from '@/components'
import type { UseCase, Version } from '@/components'
import type { BadgeProps } from '@/components/Badge/Badge'
import type { DataTableColumn } from '@/components'
import { Select } from '@/components/Select'
import { invoices, organizations, invoiceStatusOptions, marketOptions } from '../data'
import type { Invoice } from '../data'
import InvoicesV2 from './InvoicesV2'

// =============================================================================
// VERSIONS & USE CASES
// =============================================================================

const VERSIONS: Version[] = [
  { label: 'v1 — Original', description: 'Simplified grid with basic columns (From, To, Market, Amount, Status, Due Date, Terms)' },
  { label: 'v2 — Crawl Gaps', description: 'C1 Open/Paid tabs + full columns, C3 overdue highlighting, C5 export, C10 manifest link, C11 dual perspective' },
]

const V1_USE_CASES: UseCase[] = [
  { label: 'UC1 — Single-facility retailer', description: 'Sarah: processes transactions at one dispensary in Colorado' },
  { label: 'UC2 — Financial controller', description: 'Rachel: read-only across all brands, write access in Payments only' },
  { label: 'UC3 — Multi-org consultant', description: 'Tom: supply chain across 2 orgs, write access in Payments' },
]

const V2_USE_CASES: UseCase[] = [
  { label: 'UC1 — Supplier (Pacific Coast)', description: 'Creates invoices, tracks payments owed. Sees Create Invoice button, edit actions.' },
  { label: 'UC2 — Retailer (Mountain View)', description: 'Views invoices received, makes payments. Sees Pay Selected, no edit actions.' },
  { label: 'UC3 — Multi-org consultant', description: 'Read-only view across orgs, export focus.' },
]

// =============================================================================
// V1 HELPERS (unchanged from original)
// =============================================================================

function useMediaQuery(query: string): boolean {
  const [matches, setMatches] = React.useState(false)
  React.useEffect(() => {
    const mql = window.matchMedia(query)
    setMatches(mql.matches)
    const handler = (e: MediaQueryListEvent) => setMatches(e.matches)
    mql.addEventListener('change', handler)
    return () => mql.removeEventListener('change', handler)
  }, [query])
  return matches
}

const formatCurrency = (amount: number) =>
  new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(amount)

const getOrgName = (id: string) => organizations.find((o) => o.id === id)?.name ?? id

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

const statusColorMap: Record<Invoice['status'], BadgeProps['color']> = {
  paid: 'success',
  partial: 'warning',
  sent: 'info',
  viewed: 'info',
  overdue: 'error',
  draft: 'neutral',
  voided: 'neutral',
}

// =============================================================================
// V1 CONTENT (original invoices grid, preserved as-is)
// =============================================================================

function InvoicesV1({ viewState, setViewState }: { viewState: ViewState; setViewState: (s: ViewState) => void }) {
  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [marketFilter, setMarketFilter] = useState('all')
  const [selectedKeys, setSelectedKeys] = useState<Set<string>>(new Set())
  const isMobile = useMediaQuery(`(max-width: ${parseInt(breakpoints.md) - 1}px)`)

  const allMarketOptions = useMemo(
    () => [{ value: 'all', label: 'All Markets' }, ...marketOptions],
    []
  )

  const filteredInvoices = useMemo(() => {
    return invoices.filter((inv) => {
      const matchesSearch =
        !searchQuery ||
        inv.invoiceNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
        getOrgName(inv.senderOrgId).toLowerCase().includes(searchQuery.toLowerCase()) ||
        getOrgName(inv.receiverOrgId).toLowerCase().includes(searchQuery.toLowerCase())
      const matchesStatus = statusFilter === 'all' || inv.status === statusFilter
      const matchesMarket = marketFilter === 'all' || inv.market === marketFilter
      return matchesSearch && matchesStatus && matchesMarket
    })
  }, [searchQuery, statusFilter, marketFilter])

  const activeFilterCount = [searchQuery, statusFilter !== 'all', marketFilter !== 'all'].filter(Boolean).length

  const columns: DataTableColumn<Invoice>[] = [
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
    {
      key: 'senderOrgId' as any,
      header: 'From',
      sortable: true,
      render: (row) => (
        <span style={{ fontFamily: fontFamilies.body, fontSize: typography.body.sm.fontSize, color: colors.text.highEmphasis.onLight }}>
          {getOrgName(row.senderOrgId)}
        </span>
      ),
    },
    {
      key: 'receiverOrgId' as any,
      header: 'To',
      sortable: true,
      render: (row) => (
        <span style={{ fontFamily: fontFamilies.body, fontSize: typography.body.sm.fontSize, color: colors.text.highEmphasis.onLight }}>
          {getOrgName(row.receiverOrgId)}
        </span>
      ),
    },
    {
      key: 'market',
      header: 'Market',
      render: (row) => (
        <Badge color="brand" variant="subtle" size="sm">
          {row.market}
        </Badge>
      ),
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
      key: 'dueDate',
      header: 'Due Date',
      sortable: true,
      render: (row) => (
        <span style={{ fontFamily: fontFamilies.body, fontSize: typography.body.sm.fontSize, color: colors.text.lowEmphasis.onLight }}>
          {new Date(row.dueDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
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
  ]

  const mobileColumns = columns.filter(
    (c) => c.key === 'invoiceNumber' || c.key === 'total' || c.key === 'status' || c.key === 'dueDate'
  )

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: spacing.md }}>
      {/* Tabs + Create Invoice */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <TabBar
          tabs={[
            { id: 'overview', label: 'Overview' },
            { id: 'purchase-orders', label: 'Purchase Orders' },
            { id: 'invoices', label: 'Invoices' },
            { id: 'transactions', label: 'Transactions' },
          ]}
          activeTab="invoices"
          onTabChange={(tabId) => {
            if (tabId === 'overview') window.location.href = '/prototypes/canopy-payments/dashboard'
          }}
          align="left"
          hasDivider={false}
        />
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
      </div>

      {/* Toolbar with filters */}
      {viewState !== 'empty' && (
        <DataTable.Toolbar>
          <DataTable.Toolbar.Left>
            <Input
              placeholder="Search invoice #, sender, or receiver..."
              value={searchQuery}
              onChange={(val) => setSearchQuery(val)}
              size="sm"
              fullWidth
              style={{ marginBottom: 0, maxWidth: isMobile ? '100%' : '280px' }}
              startAdornment={
                <svg width={14} height={14} viewBox="0 0 16 16" fill="none" aria-hidden="true" style={{ color: colors.icon.enabled.onLight }}>
                  <circle cx="7" cy="7" r="5" stroke="currentColor" strokeWidth="1.5" />
                  <path d="M11 11L14 14" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                </svg>
              }
            />
            <Select options={invoiceStatusOptions} value={statusFilter} onChange={setStatusFilter} size="sm" style={{ minWidth: '140px' }} />
            <Select options={allMarketOptions} value={marketFilter} onChange={setMarketFilter} size="sm" style={{ minWidth: '140px' }} />
            {activeFilterCount > 0 && (
              <DataTable.IconButton
                onClick={() => { setSearchQuery(''); setStatusFilter('all'); setMarketFilter('all') }}
                title="Clear all filters"
                label="Clear"
              >
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
          </DataTable.Toolbar.Right>
        </DataTable.Toolbar>
      )}

      {/* Content by state */}
      {viewState === 'loading' && (
        <>
          <div style={{ display: 'flex', gap: spacing.sm, flexWrap: 'wrap' }}>
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} style={{ flex: 1, minWidth: '140px', padding: spacing.lg, backgroundColor: colors.surface.light, borderRadius: borderRadiusSemantics.card, border: `1px solid ${colors.border.lowEmphasis.onLight}`, display: 'flex', flexDirection: 'column', gap: spacing['2xs'] }}>
                <Skeleton width="60%" height={28} />
                <Skeleton width="40%" height={12} />
              </div>
            ))}
          </div>
          <div style={{ backgroundColor: colors.surface.light, borderRadius: borderRadiusSemantics.card, border: `1px solid ${colors.border.lowEmphasis.onLight}`, padding: spacing.lg, display: 'flex', flexDirection: 'column', gap: spacing.sm }}>
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: spacing.md, padding: `${spacing.sm} 0`, borderBottom: i < 5 ? `1px solid ${colors.border.lowEmphasis.onLight}` : 'none' }}>
                <Skeleton width={120} height={16} />
                <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: spacing['2xs'] }}><Skeleton width="45%" height={16} /></div>
                <Skeleton width={80} height={16} /><Skeleton width={65} height={24} /><Skeleton width={90} height={16} /><Skeleton width={85} height={16} />
              </div>
            ))}
          </div>
        </>
      )}

      {viewState === 'empty' && (
        <div style={{ backgroundColor: colors.surface.light, borderRadius: borderRadiusSemantics.card, border: `1px solid ${colors.border.lowEmphasis.onLight}`, padding: `${spacing['5xl']} ${spacing['2xl']}` }}>
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
            <Button emphasis="high" size="lg" onClick={() => (window.location.href = '/prototypes/canopy-payments/create-invoice')}>
              Create Invoice
            </Button>
          </EmptyState>
        </div>
      )}

      {viewState === 'error' && (
        <div style={{ backgroundColor: colors.surface.important, borderRadius: borderRadiusSemantics.card, border: `1px solid ${colors.surfaceBorder.important}`, padding: `${spacing['3xl']} ${spacing['2xl']}`, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: spacing.lg, textAlign: 'center' }}>
          <div style={{ width: '64px', height: '64px', borderRadius: '50%', backgroundColor: 'rgba(193, 11, 30, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <svg width={32} height={32} viewBox="0 0 32 32" fill="none" aria-hidden="true">
              <circle cx="16" cy="16" r="14" stroke={colors.status.important} strokeWidth="2" />
              <path d="M16 9V18M16 21V23" stroke={colors.status.important} strokeWidth="2" strokeLinecap="round" />
            </svg>
          </div>
          <div>
            <h3 style={{ fontFamily: fontFamilies.display, fontSize: typography.heading.h4.fontSize, fontWeight: fontWeights.semibold, color: colors.text.important, margin: 0 }}>Failed to load invoices</h3>
            <p style={{ fontFamily: fontFamilies.body, fontSize: typography.body.md.fontSize, color: colors.text.lowEmphasis.onLight, margin: `${spacing.xs} 0 0`, maxWidth: '400px' }}>
              There was an error connecting to the payments service. Please try again or contact support if the issue persists.
            </p>
          </div>
          <Button emphasis="high" size="lg" onClick={() => setViewState('default')}>Retry</Button>
        </div>
      )}

      {viewState === 'default' && (
        <DataTable
          columns={isMobile ? mobileColumns : columns}
          data={filteredInvoices}
          rowKey={(row) => row.id}
          density="default"
          display={isMobile ? 'cards' : 'table'}
          hoverable
          selectable
          selectedKeys={selectedKeys}
          onSelectionChange={setSelectedKeys}
          renderCard={(row) => (
            <div
              style={{ padding: spacing.lg, backgroundColor: colors.surface.light, borderRadius: borderRadiusSemantics.card, border: `1px solid ${colors.border.lowEmphasis.onLight}`, display: 'flex', flexDirection: 'column', gap: spacing.sm, cursor: 'pointer' }}
              onClick={() => (window.location.href = `/prototypes/canopy-payments/invoice-detail?id=${row.id}`)}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontFamily: fontFamilies.mono, fontSize: typography.body.sm.fontSize, fontWeight: fontWeights.semibold, color: colors.text.action.enabled }}>{row.invoiceNumber}</span>
                <Badge color={statusColorMap[row.status]} variant="filled" size="sm">{row.status.charAt(0).toUpperCase() + row.status.slice(1)}</Badge>
              </div>
              <div style={{ fontFamily: fontFamilies.mono, fontSize: typography.heading.h4.fontSize, fontWeight: fontWeights.bold, color: colors.text.highEmphasis.onLight }}>{formatCurrency(row.total)}</div>
              <div style={{ fontFamily: fontFamilies.body, fontSize: typography.body.xs.fontSize, color: colors.text.lowEmphasis.onLight, display: 'flex', flexDirection: 'column', gap: spacing['2xs'] }}>
                <span>From: {getOrgName(row.senderOrgId)}</span>
                <span>To: {getOrgName(row.receiverOrgId)}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: `1px solid ${colors.border.lowEmphasis.onLight}`, paddingTop: spacing.sm, marginTop: spacing['2xs'] }}>
                <span style={{ fontFamily: fontFamilies.body, fontSize: typography.body.xs.fontSize, color: colors.text.lowEmphasis.onLight }}>
                  Due {new Date(row.dueDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                </span>
                <Badge color="brand" variant="subtle" size="sm">{row.market}</Badge>
              </div>
            </div>
          )}
          cardGridColumns="repeat(auto-fill, minmax(280px, 1fr))"
          emptyState={
            <p style={{ fontFamily: fontFamilies.body, fontSize: typography.body.md.fontSize, color: colors.text.lowEmphasis.onLight, margin: 0 }}>
              No invoices match your filters. Try adjusting your search or filter criteria.
            </p>
          }
          style={{ boxShadow: 'none' }}
        />
      )}
    </div>
  )
}

// =============================================================================
// PAGE WRAPPER — version switcher
// =============================================================================

export default function InvoicesPage() {
  const [viewState, setViewState] = useState<ViewState>('default')
  const [activeVersion, setActiveVersion] = useState(1) // Default to v2
  const [activeUseCase, setActiveUseCase] = useState(0)

  const currentUseCases = activeVersion === 0 ? V1_USE_CASES : V2_USE_CASES

  return (
    <>
      {activeVersion === 0 ? (
        <InvoicesV1 viewState={viewState} setViewState={setViewState} />
      ) : (
        <InvoicesV2 viewState={viewState} activeUseCase={activeUseCase} />
      )}

      {/* Floating dev toolbar with version switcher */}
      <PrototypeToolbar
        viewState={viewState}
        onViewStateChange={setViewState}
        versions={VERSIONS}
        activeVersion={activeVersion}
        onVersionChange={(idx) => { setActiveVersion(idx); setActiveUseCase(0) }}
        useCases={currentUseCases}
        activeUseCase={activeUseCase}
        onUseCaseChange={setActiveUseCase}
      />
    </>
  )
}
