'use client'

import React, { useState } from 'react'
import { PrototypeToolbar, ViewState, UseCase } from '@/components'
import {
  colors,
  spacing,
  typography,
  fontFamilies,
  fontWeights,
  borderRadiusSemantics,
  breakpoints,
} from '@/styles/design-tokens'
import { Badge, Button, DataTable, Input, Skeleton, EmptyState, TabBar } from '@/components'
import type { BadgeProps } from '@/components/Badge/Badge'
import type { DataTableColumn } from '@/components'
import { useMediaQuery } from '@/hooks/useMediaQuery'
import { invoices } from '../data'
import type { Invoice } from '../data'
import { USE_CASES, INVOICE_STATUS_MAP } from '../constants'
import { getOrgName, formatCurrency } from '../utils'
import { StatCard } from '../StatCard'
import { InvoiceIcon, DollarIcon, AlertIcon, CheckIcon } from '../icons'

export default function InvoicesPage() {
  const [viewState, setViewState] = useState<ViewState>('default')
  const [selectedKeys, setSelectedKeys] = useState<Set<string>>(new Set())
  const [activeTab, setActiveTab] = useState('all')
  const [activeUseCase, setActiveUseCase] = useState(0)
  const isMobile = useMediaQuery(`(max-width: ${parseInt(breakpoints.md) - 1}px)`)

  // Compute stats
  const totalInvoices = invoices.length
  const outstandingInvoices = invoices.filter(inv => inv.status === 'sent' || inv.status === 'overdue' || inv.status === 'partial')
  const outstandingBalance = outstandingInvoices.reduce((sum, inv) => sum + inv.amountDue, 0)
  const overdueInvoices = invoices.filter(inv => inv.status === 'overdue')
  const overdueAmount = overdueInvoices.reduce((sum, inv) => sum + inv.amountDue, 0)
  const paidInvoices = invoices.filter(inv => inv.status === 'paid')
  const paidAmount = paidInvoices.reduce((sum, inv) => sum + inv.total, 0)

  // Filter invoices by tab
  const filteredInvoices = activeTab === 'all'
    ? invoices
    : activeTab === 'outstanding'
      ? invoices.filter(inv => inv.status === 'sent' || inv.status === 'overdue' || inv.status === 'partial' || inv.status === 'viewed')
      : invoices.filter(inv => inv.status === 'voided') // archived

  const invoiceColumns: DataTableColumn<Invoice>[] = [
    { key: 'invoiceNumber', header: 'Invoice #', sortable: true, render: (row) => (
      <a href={`/invoice-detail?id=${row.id}`} style={{ fontFamily: fontFamilies.mono, fontSize: typography.body.sm.fontSize, fontWeight: fontWeights.semibold, color: colors.text.action.enabled, textDecoration: 'none' }}>{row.invoiceNumber}</a>
    )},
    { key: 'senderOrgId', header: 'From', sortable: true, render: (row) => (
      <span style={{ fontFamily: fontFamilies.body, fontSize: typography.body.sm.fontSize }}>{getOrgName(row.senderOrgId)}</span>
    )},
    { key: 'receiverOrgId', header: 'To', sortable: true, render: (row) => (
      <span style={{ fontFamily: fontFamilies.body, fontSize: typography.body.sm.fontSize }}>{getOrgName(row.receiverOrgId)}</span>
    )},
    { key: 'total', header: 'Amount', sortable: true, render: (row) => (
      <span style={{ fontFamily: fontFamilies.mono, fontSize: typography.body.sm.fontSize, fontWeight: fontWeights.semibold }}>{formatCurrency(row.total)}</span>
    )},
    { key: 'amountDue', header: 'Balance Due', sortable: true, render: (row) => (
      <span style={{ fontFamily: fontFamilies.mono, fontSize: typography.body.sm.fontSize, fontWeight: fontWeights.semibold, color: row.amountDue > 0 ? colors.text.highEmphasis.onLight : colors.text.lowEmphasis.onLight }}>{formatCurrency(row.amountDue)}</span>
    )},
    { key: 'status', header: 'Status', sortable: true, render: (row) => {
      const b = INVOICE_STATUS_MAP[row.status] || { color: 'neutral' as const, variant: 'subtle' as const }
      return <Badge color={b.color} variant={b.variant} size="sm">{row.status}</Badge>
    }},
    { key: 'createdAt', header: 'Created', sortable: true, render: (row) => (
      <span style={{ fontFamily: fontFamilies.body, fontSize: typography.body.sm.fontSize, color: colors.text.lowEmphasis.onLight }}>{new Date(row.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}</span>
    )},
    { key: 'dueDate', header: 'Due Date', sortable: true, render: (row) => (
      <span style={{ fontFamily: fontFamilies.body, fontSize: typography.body.sm.fontSize, color: row.status === 'overdue' ? colors.status.important : colors.text.lowEmphasis.onLight }}>{new Date(row.dueDate).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}</span>
    )},
  ]

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: spacing.xl }}>

      {/* Page heading */}
      {viewState === 'default' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: spacing['2xs'] }}>
          <h1
            style={{
              margin: 0,
              fontFamily: fontFamilies.display,
              fontSize: typography.heading.h3.fontSize,
              fontWeight: fontWeights.bold,
              color: colors.text.highEmphasis.onLight,
            }}
          >
            Invoices
          </h1>
          <p
            style={{
              margin: 0,
              fontFamily: fontFamilies.body,
              fontSize: typography.body.md.fontSize,
              color: colors.text.lowEmphasis.onLight,
            }}
          >
            Manage and track all invoices across your organization.
          </p>
        </div>
      )}

      {/* Quick Stats */}
      {viewState === 'default' && (
        <div style={{ display: 'flex', gap: spacing.sm, flexWrap: 'wrap' }}>
          <StatCard label="Total Invoices" value={totalInvoices} subtitle={`${paidInvoices.length} paid`} icon={<InvoiceIcon />} iconBg={colors.badge.infoLight} iconColor={colors.badge.info} />
          <StatCard label="Outstanding" value={outstandingInvoices.length} subtitle={`${formatCurrency(outstandingBalance)} balance`} icon={<DollarIcon />} iconBg={colors.badge.yellowLight} iconColor={colors.badge.warning} />
          <StatCard label="Overdue" value={overdueInvoices.length} subtitle={`${formatCurrency(overdueAmount)} past due`} icon={<AlertIcon />} iconBg={colors.badge.importantLight} iconColor={colors.badge.important} />
          <StatCard label="Paid" value={paidInvoices.length} subtitle={`${formatCurrency(paidAmount)} collected`} icon={<CheckIcon />} iconBg={colors.badge.successLight} iconColor={colors.badge.success} />
        </div>
      )}

      {/* Tabs + Toolbar + Table */}
      {viewState === 'default' && (
        <div style={{ display: 'flex', flexDirection: 'column', marginTop: spacing.xs }}>
          {/* Tabs + button */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <TabBar
              tabs={[
                { id: 'all', label: 'All' },
                { id: 'outstanding', label: 'Outstanding' },
                { id: 'archived', label: 'Archived' },
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
                onClick={() => (window.location.href = '/create-invoice')}
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
                >
                  <DataTable.IconButton title="Archive selected">
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
                      <rect x="1" y="2" width="14" height="4" rx="1" stroke="currentColor" strokeWidth="1.3" />
                      <path d="M2 6v7a1 1 0 001 1h10a1 1 0 001-1V6" stroke="currentColor" strokeWidth="1.3" />
                      <path d="M6 9h4" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
                    </svg>
                  </DataTable.IconButton>
                </DataTable.SelectionInfo>
              </DataTable.Toolbar.Left>
              <DataTable.Toolbar.Right>
                <Input
                  size="sm"
                  placeholder="Search..."
                  style={{ width: 200, marginBottom: 0, marginRight: spacing.sm }}
                  startAdornment={
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
                      <circle cx="7" cy="7" r="4.5" stroke="currentColor" strokeWidth="1.3" />
                      <path d="M10.5 10.5L14 14" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
                    </svg>
                  }
                />
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
              columns={invoiceColumns}
              data={filteredInvoices}
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
                <Skeleton width={110} height={16} />
                <Skeleton width={110} height={16} />
                <Skeleton width={90} height={16} />
                <Skeleton width={75} height={24} />
                <Skeleton width={85} height={16} />
              </div>
            ))}
          </div>
        </>
      )}

      {/* Empty state */}
      {viewState === 'empty' && (
        <div style={{ backgroundColor: colors.surface.light, borderRadius: borderRadiusSemantics.card, border: `1px solid ${colors.border.lowEmphasis.onLight}`, padding: `${spacing['5xl']} ${spacing['2xl']}` }}>
          <EmptyState
            aria-label="No invoices"
            icon={
              <svg width={64} height={64} viewBox="0 0 64 64" fill="none" aria-hidden="true">
                <path d="M38 6H18a4 4 0 00-4 4v44a4 4 0 004 4h28a4 4 0 004-4V18z" stroke={colors.border.midEmphasis.onLight} strokeWidth="2" />
                <polyline points="38,6 38,18 50,18" stroke={colors.border.midEmphasis.onLight} strokeWidth="2" fill="none" />
                <line x1="22" y1="30" x2="42" y2="30" stroke={colors.border.midEmphasis.onLight} strokeWidth="1.5" />
                <line x1="22" y1="38" x2="42" y2="38" stroke={colors.border.midEmphasis.onLight} strokeWidth="1.5" />
                <line x1="22" y1="46" x2="34" y2="46" stroke={colors.border.midEmphasis.onLight} strokeWidth="1.5" />
              </svg>
            }
            title="No invoices yet"
            description="Create your first invoice to start tracking payments."
          >
            <Button
              emphasis="high"
              size="lg"
              leftIcon={
                <svg width={18} height={18} viewBox="0 0 18 18" fill="none" aria-hidden="true">
                  <path d="M9 3V15M3 9H15" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                </svg>
              }
              onClick={() => (window.location.href = '/create-invoice')}
            >
              Create your first invoice
            </Button>
          </EmptyState>
        </div>
      )}

      {/* Error state */}
      {viewState === 'error' && (
        <div style={{ backgroundColor: colors.surface.important, borderRadius: borderRadiusSemantics.card, border: `1px solid ${colors.surfaceBorder.important}`, padding: `${spacing['3xl']} ${spacing['2xl']}`, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: spacing.lg, textAlign: 'center' }}>
          <div style={{ width: '64px', height: '64px', borderRadius: '50%', backgroundColor: colors.surface.important, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
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
              There was an error connecting to the invoices service. Please try again.
            </p>
          </div>
          <Button emphasis="high" size="lg" onClick={() => setViewState('default')}>
            Retry
          </Button>
        </div>
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
