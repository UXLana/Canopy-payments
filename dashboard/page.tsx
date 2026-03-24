'use client'

import React, { useState } from 'react'
import { PrototypeToolbar, ViewState, UseCase } from '@/app/prototypes/PrototypeToolbar'
import {
  colors,
  spacing,
  typography,
  fontFamilies,
  fontWeights,
  borderRadiusSemantics,
  transitionPresets,
  breakpoints,
} from '@/styles/design-tokens'
import { Badge, BrandBanner, Button, DataTable, Skeleton, EmptyState, TabBar } from '@/components'
import type { BadgeProps } from '@/components/Badge/Badge'
import type { DataTableColumn } from '@/components'
import { transactions, invoices, organizations, monthlyFinancials, financialSummary } from '../data'
import type { Invoice, Transaction } from '../data'
import { CashFlowChart } from './CashFlowChart'

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

const USE_CASES: UseCase[] = [
  { label: 'UC1 — Single-facility retailer', description: 'Sarah: processes transactions at one dispensary in Colorado' },
  { label: 'UC2 — Financial controller', description: 'Rachel: read-only across all brands, write access in Payments only' },
  { label: 'UC3 — Multi-org consultant', description: 'Tom: supply chain across 2 orgs, write access in Payments' },
]

const getOrgName = (id: string) => organizations.find(o => o.id === id)?.name ?? id

// Stats card component
function StatCard({ label, value, subtitle, icon, iconColor, iconBg }: { label: string; value: string | number; subtitle?: string; icon?: React.ReactNode; iconColor?: string; iconBg?: string }) {
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
        <div
          style={{
            fontFamily: fontFamilies.body,
            fontSize: typography.label.sm.fontSize,
            fontWeight: fontWeights.medium,
            color: colors.text.lowEmphasis.onLight,
          }}
        >
          {label}
        </div>
        <div
          style={{
            fontFamily: fontFamilies.display,
            fontSize: typography.heading.h3.fontSize,
            fontWeight: fontWeights.bold,
            lineHeight: '1',
            color: colors.text.highEmphasis.onLight,
          }}
        >
          {value}
        </div>
        {subtitle && (
          <div
            style={{
              fontFamily: fontFamilies.body,
              fontSize: typography.body.xs.fontSize,
              color: colors.text.lowEmphasis.onLight,
            }}
          >
            {subtitle}
          </div>
        )}
      </div>
    </div>
  )
}

// Inline SVG icons for stat cards
const DollarIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="12" y1="1" x2="12" y2="23" /><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
  </svg>
)
const PackageIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M16.5 9.4l-9-5.19" /><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" /><polyline points="3.27 6.96 12 12.01 20.73 6.96" /><line x1="12" y1="22.08" x2="12" y2="12" />
  </svg>
)
const InvoiceIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" /><polyline points="14 2 14 8 20 8" /><line x1="16" y1="13" x2="8" y2="13" /><line x1="16" y1="17" x2="8" y2="17" /><polyline points="10 9 9 9 8 9" />
  </svg>
)
const AlertIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" /><line x1="12" y1="9" x2="12" y2="13" /><line x1="12" y1="17" x2="12.01" y2="17" />
  </svg>
)

// Map use-case index to a sample user name for the greeting banner
const USE_CASE_NAMES = ['Sarah', 'Rachel', 'Tom']

export default function DashboardPage() {
  const [viewState, setViewState] = useState<ViewState>('default')
  const [selectedKeys, setSelectedKeys] = useState<Set<string>>(new Set())
  const [activeTab, setActiveTab] = useState('recent-pos')
  const [activeUseCase, setActiveUseCase] = useState(0)
  const isMobile = useMediaQuery(`(max-width: ${parseInt(breakpoints.md) - 1}px)`)

  // Compute stats
  const outstandingBalance = invoices
    .filter(inv => inv.status !== 'paid' && inv.status !== 'voided')
    .reduce((sum, inv) => sum + inv.amountDue, 0)
  const invoicesDueCount = invoices.filter(inv => inv.status === 'sent' || inv.status === 'overdue').length
  const paidThisMonth = transactions
    .filter(t => t.type === 'payment' && t.status === 'completed' && t.timestamp >= '2026-03-01')
    .reduce((sum, t) => sum + t.amount, 0)
  const totalTransactions = transactions.length
  const overdueInvoices = invoices.filter(inv => inv.status === 'overdue')
  const overdueCount = overdueInvoices.length
  const overdueAmount = overdueInvoices.reduce((sum, inv) => sum + inv.amountDue, 0)

  const formatCurrency = (amount: number) =>
    new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(amount)

  // Recent transactions — last 10 sorted by timestamp desc
  const recentTransactions = [...transactions]
    .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
    .slice(0, 10)

  // Pending invoices — sent or overdue
  const pendingInvoices = invoices.filter(inv => inv.status === 'sent' || inv.status === 'overdue')

  const typeColorMap: Record<string, { color: BadgeProps['color']; variant: BadgeProps['variant'] }> = {
    payment: { color: 'success', variant: 'subtle' },
    refund: { color: 'warning', variant: 'subtle' },
    adjustment: { color: 'info', variant: 'subtle' },
  }

  const statusColorMap: Record<string, { color: BadgeProps['color']; variant: BadgeProps['variant'] }> = {
    completed: { color: 'success', variant: 'subtle' },
    pending: { color: 'warning', variant: 'subtle' },
    failed: { color: 'error', variant: 'subtle' },
    reversed: { color: 'neutral', variant: 'subtle' },
  }

  const invoiceStatusColorMap: Record<string, { color: BadgeProps['color']; variant: BadgeProps['variant'] }> = {
    sent: { color: 'info', variant: 'subtle' },
    overdue: { color: 'error', variant: 'subtle' },
  }

  const transactionColumns: DataTableColumn<(typeof transactions)[0]>[] = [
    {
      key: 'timestamp',
      header: 'Date',
      sortable: true,
      render: (row) => (
        <span
          style={{
            fontFamily: fontFamilies.body,
            fontSize: typography.body.sm.fontSize,
            color: colors.text.lowEmphasis.onLight,
          }}
        >
          {new Date(row.timestamp).toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric',
          })}
        </span>
      ),
    },
    {
      key: 'reference',
      header: 'Reference',
      sortable: true,
      render: (row) => (
        <span
          style={{
            fontFamily: fontFamilies.mono,
            fontSize: typography.body.xs.fontSize,
            color: colors.text.highEmphasis.onLight,
            letterSpacing: '0.3px',
          }}
        >
          {row.reference}
        </span>
      ),
    },
    {
      key: 'invoiceNumber',
      header: 'Invoice #',
      sortable: true,
      render: (row) => (
        <span
          style={{
            fontFamily: fontFamilies.mono,
            fontSize: typography.body.xs.fontSize,
            color: colors.text.action.enabled,
            letterSpacing: '0.3px',
          }}
        >
          {row.invoiceNumber}
        </span>
      ),
    },
    {
      key: 'type',
      header: 'Type',
      sortable: true,
      render: (row) => {
        const badge = typeColorMap[row.type] || { color: 'neutral' as const, variant: 'filled' as const }
        return (
          <Badge color={badge.color} variant={badge.variant} size="sm">
            {row.type.charAt(0).toUpperCase() + row.type.slice(1)}
          </Badge>
        )
      },
    },
    {
      key: 'amount',
      header: 'Amount',
      sortable: true,
      render: (row) => (
        <span
          style={{
            fontFamily: fontFamilies.body,
            fontSize: typography.body.sm.fontSize,
            fontWeight: fontWeights.semibold,
            color: row.type === 'refund' || row.amount < 0
              ? colors.status.important
              : colors.text.highEmphasis.onLight,
          }}
        >
          {row.type === 'refund' ? '-' : ''}{formatCurrency(Math.abs(row.amount))}
        </span>
      ),
    },
    {
      key: 'status',
      header: 'Status',
      sortable: true,
      render: (row) => {
        const badge = statusColorMap[row.status] || { color: 'neutral' as const, variant: 'subtle' as const }
        return (
          <Badge color={badge.color} variant={badge.variant} size="sm">
            {row.status.charAt(0).toUpperCase() + row.status.slice(1)}
          </Badge>
        )
      },
    },
    {
      key: 'method',
      header: 'Method',
      sortable: true,
      render: (row) => (
        <span
          style={{
            fontFamily: fontFamilies.body,
            fontSize: typography.body.sm.fontSize,
            color: colors.text.lowEmphasis.onLight,
            textTransform: 'uppercase' as const,
          }}
        >
          {row.method}
        </span>
      ),
    },
  ]

  const mobileTransactionColumns = transactionColumns.filter(
    c => c.key === 'reference' || c.key === 'amount' || c.key === 'status'
  )

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: spacing.xl }}>

      {/* Brand greeting banner */}
      {viewState === 'default' && (
        <BrandBanner
          heading={`Hello ${USE_CASE_NAMES[activeUseCase] || 'there'},`}
          subtitle="See what's going on in CanoPay today!"
        />
      )}

      {/* Quick Stats */}
      {viewState === 'default' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: spacing.sm, marginTop: spacing.xs }}>
          <h2
            style={{
              margin: 0,
              fontFamily: fontFamilies.display,
              fontSize: typography.heading.h5.fontSize,
              fontWeight: fontWeights.semibold,
              color: colors.text.highEmphasis.onLight,
            }}
          >
            Quick Stats
          </h2>
          <div style={{ display: 'flex', gap: spacing.sm, flexWrap: 'wrap' }}>
            <StatCard label="Revenue (MTD)" value={formatCurrency(paidThisMonth)} subtitle="+12% vs last month" icon={<DollarIcon />} iconBg={colors.badge.successLight} iconColor={colors.badge.success} />
            <StatCard label="Active POs" value={invoices.filter(inv => inv.status !== 'voided').length} subtitle={`${invoices.length} total`} icon={<PackageIcon />} iconBg={colors.badge.infoLight} iconColor={colors.badge.info} />
            <StatCard label="Invoices Due" value={invoicesDueCount} subtitle={`${formatCurrency(outstandingBalance)} outstanding`} icon={<InvoiceIcon />} iconBg={colors.badge.yellowLight} iconColor={colors.badge.warning} />
            <StatCard label="Overdue" value={overdueCount} subtitle={`${formatCurrency(overdueAmount)} past due`} icon={<AlertIcon />} iconBg={colors.badge.importantLight} iconColor={colors.badge.important} />
          </div>
        </div>
      )}

      {/* Loading state */}
      {viewState === 'loading' && (
        <>
          {/* Stats skeleton */}
          <div style={{ display: 'flex', gap: spacing.sm, flexWrap: 'wrap' }}>
            {Array.from({ length: 4 }).map((_, i) => (
              <div
                key={i}
                style={{
                  flex: 1,
                  minWidth: '140px',
                  padding: spacing.lg,
                  backgroundColor: colors.surface.light,
                  borderRadius: borderRadiusSemantics.card,
                  border: `1px solid ${colors.border.lowEmphasis.onLight}`,
                  display: 'flex',
                  flexDirection: 'column',
                  gap: spacing['2xs'],
                }}
              >
                <Skeleton width="60%" height={28} />
                <Skeleton width="80%" height={14} />
              </div>
            ))}
          </div>
          {/* Transactions skeleton */}
          <div
            style={{
              backgroundColor: colors.surface.light,
              borderRadius: borderRadiusSemantics.card,
              border: `1px solid ${colors.border.lowEmphasis.onLight}`,
              padding: spacing.lg,
              display: 'flex',
              flexDirection: 'column',
              gap: spacing.sm,
            }}
          >
            <Skeleton width="35%" height={20} />
            {Array.from({ length: 6 }).map((_, i) => (
              <div
                key={i}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: spacing.md,
                  padding: `${spacing.sm} 0`,
                  borderBottom: i < 5 ? `1px solid ${colors.border.lowEmphasis.onLight}` : 'none',
                }}
              >
                <Skeleton width={85} height={16} />
                <Skeleton width={110} height={16} />
                <Skeleton width={110} height={16} />
                <Skeleton width={75} height={24} />
                <Skeleton width={90} height={16} />
                <Skeleton width={75} height={24} />
                <Skeleton width={50} height={16} />
              </div>
            ))}
          </div>
          {/* Pending invoices skeleton */}
          <div
            style={{
              backgroundColor: colors.surface.light,
              borderRadius: borderRadiusSemantics.card,
              border: `1px solid ${colors.border.lowEmphasis.onLight}`,
              padding: spacing.lg,
              display: 'flex',
              flexDirection: 'column',
              gap: spacing.sm,
            }}
          >
            <Skeleton width="30%" height={20} />
            {Array.from({ length: 4 }).map((_, i) => (
              <div
                key={i}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: spacing.md,
                  padding: `${spacing.sm} 0`,
                  borderBottom: i < 3 ? `1px solid ${colors.border.lowEmphasis.onLight}` : 'none',
                }}
              >
                <Skeleton width={110} height={16} />
                <div style={{ flex: 1 }}><Skeleton width="50%" height={16} /></div>
                <Skeleton width={90} height={16} />
                <Skeleton width={85} height={16} />
                <Skeleton width={65} height={24} />
              </div>
            ))}
          </div>
        </>
      )}

      {/* Empty state */}
      {viewState === 'empty' && (
        <div
          style={{
            backgroundColor: colors.surface.light,
            borderRadius: borderRadiusSemantics.card,
            border: `1px solid ${colors.border.lowEmphasis.onLight}`,
            padding: `${spacing['5xl']} ${spacing['2xl']}`,
          }}
        >
          <EmptyState
            aria-label="No payment activity"
            icon={
              <svg width={64} height={64} viewBox="0 0 64 64" fill="none" aria-hidden="true">
                <rect x="8" y="20" width="48" height="32" rx="4" stroke={colors.border.midEmphasis.onLight} strokeWidth="2" />
                <path d="M8 30H56" stroke={colors.border.midEmphasis.onLight} strokeWidth="2" />
                <rect x="14" y="38" width="20" height="4" rx="1" stroke={colors.border.midEmphasis.onLight} strokeWidth="1.5" />
                <rect x="14" y="44" width="12" height="4" rx="1" stroke={colors.border.midEmphasis.onLight} strokeWidth="1.5" />
                <circle cx="48" cy="20" r="10" fill={colors.brand.default} />
                <path d="M44 20H52M48 16V24" stroke="white" strokeWidth="2.5" strokeLinecap="round" />
              </svg>
            }
            title="No payment activity yet"
            description="Create your first invoice to start tracking payments and transactions."
          >
            <Button
              emphasis="high"
              size="lg"
              leftIcon={
                <svg width={18} height={18} viewBox="0 0 18 18" fill="none" aria-hidden="true">
                  <path d="M9 3V15M3 9H15" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                </svg>
              }
              onClick={() => (window.location.href = '/prototypes/canopy-payments/create-invoice')}
            >
              Create your first invoice
            </Button>
          </EmptyState>
        </div>
      )}

      {/* Error state */}
      {viewState === 'error' && (
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
            <h3
              style={{
                fontFamily: fontFamilies.display,
                fontSize: typography.heading.h4.fontSize,
                fontWeight: fontWeights.semibold,
                color: colors.text.important,
                margin: 0,
              }}
            >
              Failed to load payment data
            </h3>
            <p
              style={{
                fontFamily: fontFamilies.body,
                fontSize: typography.body.md.fontSize,
                color: colors.text.lowEmphasis.onLight,
                margin: `${spacing.xs} 0 0`,
                maxWidth: '400px',
              }}
            >
              There was an error connecting to the payments service. Please try again or contact support if the issue persists.
            </p>
          </div>
          <Button emphasis="high" size="lg" onClick={() => setViewState('default')}>
            Retry
          </Button>
        </div>
      )}

      {/* Default state: Recent Transactions */}
      {viewState === 'default' && (
        <>
          <div style={{ display: 'flex', flexDirection: 'column', marginTop: spacing.xs }}>
            {/* Tabs + button */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <TabBar
                tabs={[
                  { id: 'recent-pos', label: 'Recent Purchase Orders' },
                  { id: 'recent-invoices', label: 'Recent Invoices' },
                  { id: 'recent-transactions', label: 'Recent Transactions' },
                ]}
                activeTab={activeTab}
                onTabChange={(tabId) => {
                  setActiveTab(tabId)
                  setSelectedKeys(new Set())
                }}
                align="left"
                hasDivider={false}
              />
              <div style={{ flexShrink: 0 }}>
                <Button
                  emphasis="high"
                  size="md"
                  leftIcon={
                    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
                      <path d="M12 5V19M5 12H19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                    </svg>
                  }
                  onClick={() => (window.location.href = '/prototypes/canopy-payments/create-invoice')}
                >
                  Create Invoice
                </Button>
              </div>
            </div>

            {/* Toolbar */}
            <div style={{ marginTop: spacing.sm }}>
              <DataTable.Toolbar>
                <DataTable.Toolbar.Left>
                  <DataTable.SelectionInfo
                    count={selectedKeys.size}
                    onClear={() => setSelectedKeys(new Set())}
                  />
                </DataTable.Toolbar.Left>
                <DataTable.Toolbar.Right>
                  <DataTable.FilterButton />
                  <DataTable.SortButton />
                </DataTable.Toolbar.Right>
              </DataTable.Toolbar>
            </div>

            {/* Tab content */}
            <div style={{ marginTop: spacing.sm }}>
              {activeTab === 'recent-pos' && (
                <DataTable
                  columns={[
                    { key: 'invoiceNumber', header: 'PO Number', sortable: true, render: (row: typeof invoices[0]) => (
                      <a href={`/prototypes/canopy-payments/invoice-detail?id=${row.id}`} style={{ fontFamily: fontFamilies.mono, fontSize: typography.body.sm.fontSize, fontWeight: fontWeights.semibold, color: colors.text.action.enabled, textDecoration: 'none' }}>{row.invoiceNumber.replace('INV', 'PO')}</a>
                    )},
                    { key: 'receiverOrgId', header: 'Vendor', sortable: true, render: (row: typeof invoices[0]) => (
                      <span style={{ fontFamily: fontFamilies.body, fontSize: typography.body.sm.fontSize }}>{getOrgName(row.receiverOrgId)}</span>
                    )},
                    { key: 'items', header: 'Items', render: (row: typeof invoices[0]) => (
                      <span style={{ fontFamily: fontFamilies.body, fontSize: typography.body.sm.fontSize }}>{row.items.length}</span>
                    )},
                    { key: 'total', header: 'Amount', sortable: true, render: (row: typeof invoices[0]) => (
                      <span style={{ fontFamily: fontFamilies.mono, fontSize: typography.body.sm.fontSize, fontWeight: fontWeights.semibold }}>{formatCurrency(row.total)}</span>
                    )},
                    { key: 'status', header: 'Status', sortable: true, render: (row: typeof invoices[0]) => {
                      const statusMap: Record<string, { color: BadgeProps['color']; variant: BadgeProps['variant'] }> = { paid: { color: 'success', variant: 'subtle' }, sent: { color: 'info', variant: 'subtle' }, overdue: { color: 'error', variant: 'subtle' }, draft: { color: 'neutral', variant: 'subtle' }, partial: { color: 'warning', variant: 'subtle' }, viewed: { color: 'info', variant: 'subtle' }, voided: { color: 'neutral', variant: 'subtle' } }
                      const b = statusMap[row.status] || { color: 'neutral' as const, variant: 'subtle' as const }
                      return <Badge color={b.color} variant={b.variant} size="sm">{row.status}</Badge>
                    }},
                    { key: 'createdAt', header: 'Created', sortable: true, render: (row: typeof invoices[0]) => (
                      <span style={{ fontFamily: fontFamilies.body, fontSize: typography.body.sm.fontSize, color: colors.text.lowEmphasis.onLight }}>{new Date(row.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}</span>
                    )},
                    { key: 'dueDate', header: 'Due Date', sortable: true, render: (row: typeof invoices[0]) => (
                      <span style={{ fontFamily: fontFamilies.body, fontSize: typography.body.sm.fontSize, color: colors.text.lowEmphasis.onLight }}>{new Date(row.dueDate).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}</span>
                    )},
                  ]}
                  data={invoices.slice(0, 10)}
                  rowKey={(row) => row.id}
                  density="comfortable"
                  display="table"
                  hoverable
                  selectable
                  selectedKeys={selectedKeys}
                  onSelectionChange={setSelectedKeys}
                />
              )}

              {activeTab === 'recent-invoices' && (
                <DataTable
                  columns={[
                    { key: 'invoiceNumber', header: 'Invoice #', sortable: true, render: (row: typeof invoices[0]) => (
                      <a href={`/prototypes/canopy-payments/invoice-detail?id=${row.id}`} style={{ fontFamily: fontFamilies.mono, fontSize: typography.body.sm.fontSize, fontWeight: fontWeights.semibold, color: colors.text.action.enabled, textDecoration: 'none' }}>{row.invoiceNumber}</a>
                    )},
                    { key: 'senderOrgId', header: 'From', sortable: true, render: (row: typeof invoices[0]) => (
                      <span style={{ fontFamily: fontFamilies.body, fontSize: typography.body.sm.fontSize }}>{getOrgName(row.senderOrgId)}</span>
                    )},
                    { key: 'receiverOrgId', header: 'To', sortable: true, render: (row: typeof invoices[0]) => (
                      <span style={{ fontFamily: fontFamilies.body, fontSize: typography.body.sm.fontSize }}>{getOrgName(row.receiverOrgId)}</span>
                    )},
                    { key: 'total', header: 'Amount', sortable: true, render: (row: typeof invoices[0]) => (
                      <span style={{ fontFamily: fontFamilies.mono, fontSize: typography.body.sm.fontSize, fontWeight: fontWeights.semibold }}>{formatCurrency(row.total)}</span>
                    )},
                    { key: 'status', header: 'Status', sortable: true, render: (row: typeof invoices[0]) => {
                      const statusMap: Record<string, { color: BadgeProps['color']; variant: BadgeProps['variant'] }> = { paid: { color: 'success', variant: 'subtle' }, sent: { color: 'info', variant: 'subtle' }, overdue: { color: 'error', variant: 'subtle' }, draft: { color: 'neutral', variant: 'subtle' }, partial: { color: 'warning', variant: 'subtle' }, viewed: { color: 'info', variant: 'subtle' }, voided: { color: 'neutral', variant: 'subtle' } }
                      const b = statusMap[row.status] || { color: 'neutral' as const, variant: 'subtle' as const }
                      return <Badge color={b.color} variant={b.variant} size="sm">{row.status}</Badge>
                    }},
                    { key: 'dueDate', header: 'Due Date', sortable: true, render: (row: typeof invoices[0]) => (
                      <span style={{ fontFamily: fontFamilies.body, fontSize: typography.body.sm.fontSize, color: colors.text.lowEmphasis.onLight }}>{new Date(row.dueDate).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}</span>
                    )},
                  ]}
                  data={invoices.slice(0, 10)}
                  rowKey={(row) => row.id}
                  density="comfortable"
                  display="table"
                  hoverable
                  selectable
                  selectedKeys={selectedKeys}
                  onSelectionChange={setSelectedKeys}
                />
              )}

              {activeTab === 'recent-transactions' && (
                <DataTable
                  columns={isMobile ? mobileTransactionColumns : transactionColumns}
                  data={recentTransactions}
                  rowKey={(row) => row.id}
                  density="comfortable"
                  display="table"
                  hoverable
                  selectable
                  selectedKeys={selectedKeys}
                  onSelectionChange={setSelectedKeys}
                />
              )}
            </div>
          </div>

        </>
      )}

      {/* Cash Flow Chart — below the datatable */}
      {viewState === 'default' && (
        <CashFlowChart data={monthlyFinancials} summary={financialSummary} invoices={invoices} transactions={transactions} />
      )}

      {/* Floating dev toolbar */}
      <PrototypeToolbar
        viewState={viewState}
        onViewStateChange={setViewState}
        useCases={USE_CASES}
        activeUseCase={activeUseCase}
        onUseCaseChange={setActiveUseCase}
      />
    </div>
  )
}
