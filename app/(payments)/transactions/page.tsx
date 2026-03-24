'use client'

import React, { useState, useEffect, useRef } from 'react'
import { PrototypeToolbar, ViewState, UseCase } from '@/components'
import {
  colors,
  spacing,
  typography,
  fontFamilies,
  fontWeights,
  borderRadiusSemantics,
  breakpoints,
  shadowSemantics,
} from '@/styles/design-tokens'
import { Badge, Button, DataTable, Input, Skeleton, EmptyState, TabBar } from '@/components'
import type { BadgeProps } from '@/components/Badge/Badge'
import type { DataTableColumn } from '@/components'
import { useMediaQuery } from '@/hooks/useMediaQuery'
import { transactions } from '../data'
import type { Transaction } from '../data'
import { USE_CASES, TRANSACTION_TYPE_MAP, TRANSACTION_STATUS_MAP } from '../constants'
import { getOrgName, formatCurrency } from '../utils'
import { StatCard } from '../StatCard'
import { ArrowsIcon, DollarIcon, AlertIcon, ClockIcon } from '../icons'

export default function TransactionsPage() {
  const [viewState, setViewState] = useState<ViewState>('default')
  const [selectedKeys, setSelectedKeys] = useState<Set<string>>(new Set())
  const [activeTab, setActiveTab] = useState('all')
  const [activeUseCase, setActiveUseCase] = useState(0)
  const [showExportDialog, setShowExportDialog] = useState(false)
  const [toastMessage, setToastMessage] = useState<string | null>(null)
  const dialogPanelRef = useRef<HTMLDivElement>(null)
  const isMobile = useMediaQuery(`(max-width: ${parseInt(breakpoints.md) - 1}px)`)

  useEffect(() => {
    if (showExportDialog && dialogPanelRef.current) {
      dialogPanelRef.current.focus()
    }
  }, [showExportDialog])

  // Sort transactions by date descending
  const sortedTransactions = [...transactions].sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())

  // Compute stats
  const totalVolume = transactions.filter(t => t.type === 'payment' && t.status === 'completed').reduce((sum, t) => sum + t.amount, 0)
  const completedCount = transactions.filter(t => t.status === 'completed').length
  const pendingTransactions = transactions.filter(t => t.status === 'pending')
  const pendingAmount = pendingTransactions.reduce((sum, t) => sum + t.amount, 0)
  const failedTransactions = transactions.filter(t => t.status === 'failed')
  const failedAmount = failedTransactions.reduce((sum, t) => sum + t.amount, 0)

  // Filter by tab
  const filteredTransactions = activeTab === 'all'
    ? sortedTransactions
    : activeTab === 'payments'
      ? sortedTransactions.filter(t => t.type === 'payment')
      : activeTab === 'refunds'
        ? sortedTransactions.filter(t => t.type === 'refund' || t.type === 'adjustment')
        : sortedTransactions.filter(t => t.status === 'failed') // failed

  const typeColorMap = TRANSACTION_TYPE_MAP

  const statusColorMap = TRANSACTION_STATUS_MAP

  const txnColumns: DataTableColumn<Transaction>[] = [
    { key: 'timestamp', header: 'Date', sortable: true, render: (row) => (
      <span style={{ fontFamily: fontFamilies.body, fontSize: typography.body.sm.fontSize, color: colors.text.lowEmphasis.onLight }}>
        {new Date(row.timestamp).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
      </span>
    )},
    { key: 'reference', header: 'Reference', sortable: true, render: (row) => (
      <span style={{ fontFamily: fontFamilies.mono, fontSize: typography.body.sm.fontSize, fontWeight: fontWeights.semibold, color: colors.text.action.enabled }}>{row.reference}</span>
    )},
    { key: 'invoiceNumber', header: 'Invoice #', sortable: true, render: (row) => (
      <a href={`/invoice-detail?id=${row.invoiceId}`} style={{ fontFamily: fontFamilies.mono, fontSize: typography.body.sm.fontSize, color: colors.text.action.enabled, textDecoration: 'none' }}>{row.invoiceNumber}</a>
    )},
    { key: 'senderOrgId', header: 'From', sortable: true, render: (row) => (
      <span style={{ fontFamily: fontFamilies.body, fontSize: typography.body.sm.fontSize }}>{getOrgName(row.senderOrgId)}</span>
    )},
    { key: 'receiverOrgId', header: 'To', sortable: true, render: (row) => (
      <span style={{ fontFamily: fontFamilies.body, fontSize: typography.body.sm.fontSize }}>{getOrgName(row.receiverOrgId)}</span>
    )},
    { key: 'type', header: 'Type', sortable: true, render: (row) => {
      const badge = typeColorMap[row.type] || { color: 'neutral' as const, variant: 'subtle' as const }
      return <Badge color={badge.color} variant={badge.variant} size="sm">{row.type}</Badge>
    }},
    { key: 'amount', header: 'Amount', sortable: true, render: (row) => (
      <span style={{
        fontFamily: fontFamilies.mono,
        fontSize: typography.body.sm.fontSize,
        fontWeight: fontWeights.semibold,
        color: row.type === 'refund' || row.amount < 0 ? colors.status.important : colors.text.highEmphasis.onLight,
      }}>
        {row.type === 'refund' ? '-' : ''}{formatCurrency(Math.abs(row.amount))}
      </span>
    )},
    { key: 'method', header: 'Method', sortable: true, render: (row) => (
      <span style={{ fontFamily: fontFamilies.body, fontSize: typography.body.sm.fontSize, color: colors.text.lowEmphasis.onLight, textTransform: 'uppercase' as const }}>{row.method}</span>
    )},
    { key: 'status', header: 'Status', sortable: true, render: (row) => {
      const badge = statusColorMap[row.status] || { color: 'neutral' as const, variant: 'subtle' as const }
      return <Badge color={badge.color} variant={badge.variant} size="sm">{row.status}</Badge>
    }},
  ]

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: spacing.xl }}>

      {/* Page heading */}
      {viewState === 'default' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: spacing['2xs'] }}>
          <h1 style={{ margin: 0, fontFamily: fontFamilies.display, fontSize: typography.heading.h3.fontSize, fontWeight: fontWeights.bold, color: colors.text.highEmphasis.onLight }}>
            Transactions
          </h1>
          <p style={{ margin: 0, fontFamily: fontFamilies.body, fontSize: typography.body.md.fontSize, color: colors.text.lowEmphasis.onLight }}>
            View payment activity, refunds, and adjustments across all invoices.
          </p>
        </div>
      )}

      {/* Quick Stats */}
      {viewState === 'default' && (
        <div style={{ display: 'flex', gap: spacing.sm, flexWrap: 'wrap' }}>
          <StatCard label="Total Transactions" value={transactions.length} subtitle={`${completedCount} completed`} icon={<ArrowsIcon />} iconBg={colors.badge.infoLight} iconColor={colors.badge.info} />
          <StatCard label="Volume" value={formatCurrency(totalVolume)} subtitle="completed payments" icon={<DollarIcon />} iconBg={colors.badge.successLight} iconColor={colors.badge.success} />
          <StatCard label="Pending" value={pendingTransactions.length} subtitle={`${formatCurrency(pendingAmount)} processing`} icon={<ClockIcon />} iconBg={colors.badge.yellowLight} iconColor={colors.badge.warning} />
          <StatCard label="Failed" value={failedTransactions.length} subtitle={`${formatCurrency(failedAmount)} declined`} icon={<AlertIcon />} iconBg={colors.badge.importantLight} iconColor={colors.badge.important} />
        </div>
      )}

      {/* Tabs + Toolbar + Table */}
      {viewState === 'default' && (
        <div style={{ display: 'flex', flexDirection: 'column', marginTop: spacing.xs }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <TabBar
              tabs={[
                { id: 'all', label: 'All' },
                { id: 'payments', label: 'Payments' },
                { id: 'refunds', label: 'Refunds & Adjustments' },
                { id: 'failed', label: 'Failed' },
              ]}
              activeTab={activeTab}
              onTabChange={(tabId) => { setActiveTab(tabId); setSelectedKeys(new Set()) }}
              align="left"
              hasDivider={false}
            />
            <div style={{ flexShrink: 0 }}>
              <Button
                emphasis="mid"
                size="md"
                leftIcon={<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" /><polyline points="7 10 12 15 17 10" /><line x1="12" y1="15" x2="12" y2="3" /></svg>}
                onClick={() => setShowExportDialog(true)}
              >
                Export
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
                <Input size="sm" placeholder="Search..." style={{ width: 200, marginBottom: 0, marginRight: spacing.sm }} startAdornment={<svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true"><circle cx="7" cy="7" r="4.5" stroke="currentColor" strokeWidth="1.3" /><path d="M10.5 10.5L14 14" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" /></svg>} />
                <DataTable.FilterButton />
                <DataTable.SortButton />
                <DataTable.IconButton title="Manage columns">
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
                    <rect x="1.5" y="1.5" width="4" height="13" rx="1" stroke="currentColor" strokeWidth="1.3" />
                    <rect x="6.5" y="1.5" width="4" height="13" rx="1" stroke="currentColor" strokeWidth="1.3" />
                    <rect x="11.5" y="1.5" width="3" height="13" rx="1" stroke="currentColor" strokeWidth="1.3" />
                  </svg>
                </DataTable.IconButton>
              </DataTable.Toolbar.Right>
            </DataTable.Toolbar>
          </div>

          {/* Table */}
          <div style={{ marginTop: spacing.sm }}>
            <DataTable
              columns={txnColumns}
              data={filteredTransactions}
              rowKey={(row) => row.id}
              density="comfortable"
              display="table"
              hoverable
              selectable
              selectedKeys={selectedKeys}
              onSelectionChange={setSelectedKeys}
            />
          </div>
        </div>
      )}

      {/* Loading state */}
      {viewState === 'loading' && (
        <>
          <div style={{ display: 'flex', gap: spacing.sm, flexWrap: 'wrap' }}>
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} style={{ flex: 1, minWidth: '140px', padding: spacing.lg, backgroundColor: colors.surface.light, borderRadius: borderRadiusSemantics.card, border: `1px solid ${colors.border.lowEmphasis.onLight}`, display: 'flex', flexDirection: 'column', gap: spacing['2xs'] }}>
                <Skeleton width="60%" height={28} />
                <Skeleton width="80%" height={14} />
              </div>
            ))}
          </div>
          <div style={{ backgroundColor: colors.surface.light, borderRadius: borderRadiusSemantics.card, border: `1px solid ${colors.border.lowEmphasis.onLight}`, padding: spacing.lg, display: 'flex', flexDirection: 'column', gap: spacing.sm }}>
            <Skeleton width="35%" height={20} />
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: spacing.md, padding: `${spacing.sm} 0`, borderBottom: i < 5 ? `1px solid ${colors.border.lowEmphasis.onLight}` : 'none' }}>
                <Skeleton width={85} height={16} /><Skeleton width={110} height={16} /><Skeleton width={110} height={16} /><Skeleton width={75} height={24} /><Skeleton width={90} height={16} /><Skeleton width={75} height={24} /><Skeleton width={50} height={16} />
              </div>
            ))}
          </div>
        </>
      )}

      {/* Empty state */}
      {viewState === 'empty' && (
        <div style={{ backgroundColor: colors.surface.light, borderRadius: borderRadiusSemantics.card, border: `1px solid ${colors.border.lowEmphasis.onLight}`, padding: `${spacing['5xl']} ${spacing['2xl']}` }}>
          <EmptyState
            aria-label="No transactions"
            icon={
              <svg width={64} height={64} viewBox="0 0 64 64" fill="none" aria-hidden="true">
                <polyline points="40 6 48 14 40 22" stroke={colors.border.midEmphasis.onLight} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M16 32V26a12 12 0 0 1 12-12h20" stroke={colors.border.midEmphasis.onLight} strokeWidth="2" strokeLinecap="round" />
                <polyline points="24 58 16 50 24 42" stroke={colors.border.midEmphasis.onLight} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M48 32v6a12 12 0 0 1-12 12H16" stroke={colors.border.midEmphasis.onLight} strokeWidth="2" strokeLinecap="round" />
              </svg>
            }
            title="No transactions yet"
            description="Transactions will appear here once payments are processed against invoices."
          />
        </div>
      )}

      {/* Error state */}
      {viewState === 'error' && (
        <div style={{ backgroundColor: colors.surface.important, borderRadius: borderRadiusSemantics.card, border: `1px solid ${colors.surfaceBorder.important}`, padding: `${spacing['3xl']} ${spacing['2xl']}`, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: spacing.lg, textAlign: 'center' }}>
          <div style={{ width: '64px', height: '64px', borderRadius: '50%', backgroundColor: colors.surface.important, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <svg width={32} height={32} viewBox="0 0 32 32" fill="none" aria-hidden="true"><circle cx="16" cy="16" r="14" stroke={colors.status.important} strokeWidth="2" /><path d="M16 9V18M16 21V23" stroke={colors.status.important} strokeWidth="2" strokeLinecap="round" /></svg>
          </div>
          <div>
            <h3 style={{ fontFamily: fontFamilies.display, fontSize: typography.heading.h4.fontSize, fontWeight: fontWeights.semibold, color: colors.text.important, margin: 0 }}>Failed to load transactions</h3>
            <p style={{ fontFamily: fontFamilies.body, fontSize: typography.body.md.fontSize, color: colors.text.lowEmphasis.onLight, margin: `${spacing.xs} 0 0`, maxWidth: '400px' }}>There was an error connecting to the transactions service. Please try again.</p>
          </div>
          <Button emphasis="high" size="lg" onClick={() => setViewState('default')}>Retry</Button>
        </div>
      )}

      {/* Export confirmation dialog */}
      {showExportDialog && (
        <>
          <div
            onClick={() => setShowExportDialog(false)}
            onKeyDown={(e) => { if (e.key === 'Escape') setShowExportDialog(false) }}
            style={{ position: 'fixed', inset: 0, backgroundColor: colors.scrim, zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center' }}
          >
            <div
              ref={dialogPanelRef}
              tabIndex={-1}
              onClick={(e) => e.stopPropagation()}
              role="dialog"
              aria-labelledby="export-dialog-title"
              aria-describedby="export-dialog-desc"
              style={{
                backgroundColor: colors.surface.light,
                borderRadius: borderRadiusSemantics.card,
                padding: spacing['2xl'],
                maxWidth: '420px',
                width: '90%',
                display: 'flex',
                flexDirection: 'column',
                gap: spacing.md,
              }}
            >
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: spacing.sm }}>
                <div style={{ width: 40, height: 40, borderRadius: '50%', backgroundColor: colors.surface.info, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={colors.status.info} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" /><polyline points="7 10 12 15 17 10" /><line x1="12" y1="15" x2="12" y2="3" />
                  </svg>
                </div>
                <div>
                  <h3 id="export-dialog-title" style={{ margin: 0, fontFamily: fontFamilies.display, fontSize: typography.heading.h5.fontSize, fontWeight: fontWeights.semibold, color: colors.text.highEmphasis.onLight }}>
                    Export {filteredTransactions.length} transaction{filteredTransactions.length === 1 ? '' : 's'}
                  </h3>
                  <p id="export-dialog-desc" style={{ margin: `${spacing.xs} 0 0`, fontFamily: fontFamilies.body, fontSize: typography.body.sm.fontSize, color: colors.text.lowEmphasis.onLight, lineHeight: '1.5' }}>
                    This will download a CSV file containing all transactions in the current view. To change which transactions are included, adjust the filters using the tabs above.
                  </p>
                </div>
              </div>
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: spacing.sm, marginTop: spacing.xs }}>
                <Button emphasis="low" size="md" onClick={() => setShowExportDialog(false)}>
                  Cancel
                </Button>
                <Button emphasis="high" size="md" onClick={() => { const count = filteredTransactions.length; setShowExportDialog(false); requestAnimationFrame(() => { setToastMessage(`${count} transactions exported successfully`); setTimeout(() => setToastMessage(null), 4000) }) }} leftIcon={
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" /><polyline points="7 10 12 15 17 10" /><line x1="12" y1="15" x2="12" y2="3" /></svg>
                }>
                  Export CSV
                </Button>
              </div>
            </div>
          </div>
        </>
      )}

      {/* Toast */}
      {toastMessage && (
        <div role="status" aria-live="polite" style={{
          position: 'fixed',
          bottom: spacing['3xl'],
          left: '50%',
          transform: 'translateX(-50%)',
          zIndex: 1100,
          display: 'flex',
          alignItems: 'center',
          gap: spacing.sm,
          padding: `${spacing.sm} ${spacing.lg}`,
          backgroundColor: colors.surface.dark,
          color: colors.text.highEmphasis.onDark,
          borderRadius: borderRadiusSemantics.button,
          fontFamily: fontFamilies.body,
          fontSize: typography.body.sm.fontSize,
          fontWeight: fontWeights.medium,
          boxShadow: shadowSemantics.dropdown,
          animation: 'toast-in 200ms ease-out',
        }}>
          {toastMessage}
          <button
            onClick={() => setToastMessage(null)}
            style={{ background: 'none', border: 'none', color: colors.text.lowEmphasis.onDark, cursor: 'pointer', padding: 0, display: 'flex', marginLeft: spacing.xs }}
            aria-label="Dismiss"
          >
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M10.5 3.5L3.5 10.5M3.5 3.5l7 7" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" /></svg>
          </button>
        </div>
      )}

      <PrototypeToolbar viewState={viewState} onViewStateChange={setViewState} useCases={USE_CASES} activeUseCase={activeUseCase} onUseCaseChange={setActiveUseCase} />
    </div>
  )
}
