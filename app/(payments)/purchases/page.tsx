'use client'

import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
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
import { PackageIcon, DollarIcon, AlertIcon, TruckIcon } from '../icons'

const poStatusLabel = (status: Invoice['status']) => {
  const map: Record<string, string> = { paid: 'received', partial: 'partial', sent: 'submitted', viewed: 'acknowledged', overdue: 'overdue', draft: 'draft', voided: 'cancelled' }
  return map[status] ?? status
}

export default function PurchaseOrdersPage() {
  const router = useRouter()
  const [viewState, setViewState] = useState<ViewState>('default')
  const [selectedKeys, setSelectedKeys] = useState<Set<string>>(new Set())
  const [activeTab, setActiveTab] = useState('all')
  const [activeUseCase, setActiveUseCase] = useState(0)
  const isMobile = useMediaQuery(`(max-width: ${parseInt(breakpoints.md) - 1}px)`)

  const totalPOs = invoices.length
  const activePOs = invoices.filter(inv => inv.status !== 'voided' && inv.status !== 'paid')
  const activeValue = activePOs.reduce((sum, inv) => sum + inv.total, 0)
  const overdueOrders = invoices.filter(inv => inv.status === 'overdue')
  const overdueAmount = overdueOrders.reduce((sum, inv) => sum + inv.amountDue, 0)
  const receivedPOs = invoices.filter(inv => inv.status === 'paid')
  const receivedValue = receivedPOs.reduce((sum, inv) => sum + inv.total, 0)

  const filteredPOs = activeTab === 'all'
    ? invoices
    : activeTab === 'active'
      ? invoices.filter(inv => inv.status !== 'voided' && inv.status !== 'paid')
      : activeTab === 'received'
        ? invoices.filter(inv => inv.status === 'paid')
        : invoices.filter(inv => inv.status === 'voided')

  const poColumns: DataTableColumn<Invoice>[] = [
    { key: 'invoiceNumber', header: 'PO Number', sortable: true, render: (row) => (
      <a href={`/invoice-detail?id=${row.id}`} style={{ fontFamily: fontFamilies.mono, fontSize: typography.body.sm.fontSize, fontWeight: fontWeights.semibold, color: colors.text.action.enabled, textDecoration: 'none' }}>{row.invoiceNumber.replace('INV', 'PO')}</a>
    )},
    { key: 'receiverOrgId', header: 'Vendor', sortable: true, render: (row) => (
      <span style={{ fontFamily: fontFamilies.body, fontSize: typography.body.sm.fontSize }}>{getOrgName(row.receiverOrgId)}</span>
    )},
    { key: 'items', header: 'Items', render: (row) => (
      <span style={{ fontFamily: fontFamilies.body, fontSize: typography.body.sm.fontSize }}>{row.items.length}</span>
    )},
    { key: 'total', header: 'Amount', sortable: true, render: (row) => (
      <span style={{ fontFamily: fontFamilies.mono, fontSize: typography.body.sm.fontSize, fontWeight: fontWeights.semibold }}>{formatCurrency(row.total)}</span>
    )},
    { key: 'status', header: 'Status', sortable: true, render: (row) => {
      const b = INVOICE_STATUS_MAP[row.status] || { color: 'neutral' as const, variant: 'subtle' as const }
      return <Badge color={b.color} variant={b.variant} size="sm">{poStatusLabel(row.status)}</Badge>
    }},
    { key: 'createdAt', header: 'Created', sortable: true, render: (row) => (
      <span style={{ fontFamily: fontFamilies.body, fontSize: typography.body.sm.fontSize, color: colors.text.lowEmphasis.onLight }}>{new Date(row.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}</span>
    )},
    { key: 'dueDate', header: 'Expected Delivery', sortable: true, render: (row) => (
      <span style={{ fontFamily: fontFamilies.body, fontSize: typography.body.sm.fontSize, color: row.status === 'overdue' ? colors.status.important : colors.text.lowEmphasis.onLight }}>{new Date(row.dueDate).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}</span>
    )},
  ]

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: spacing.xl }}>

      {/* Page heading */}
      {viewState === 'default' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: spacing['2xs'] }}>
          <h1 style={{ margin: 0, fontFamily: fontFamilies.display, fontSize: typography.heading.h3.fontSize, fontWeight: fontWeights.bold, color: colors.text.highEmphasis.onLight }}>
            Purchase Orders
          </h1>
          <p style={{ margin: 0, fontFamily: fontFamilies.body, fontSize: typography.body.md.fontSize, color: colors.text.lowEmphasis.onLight }}>
            Track and manage purchase orders from vendors.
          </p>
        </div>
      )}

      {/* Quick Stats */}
      {viewState === 'default' && (
        <div style={{ display: 'flex', gap: spacing.sm, flexWrap: 'wrap' }}>
          <StatCard label="Total POs" value={totalPOs} subtitle={`${receivedPOs.length} received`} icon={<PackageIcon />} iconBg={colors.badge.infoLight} iconColor={colors.badge.info} />
          <StatCard label="Active" value={activePOs.length} subtitle={`${formatCurrency(activeValue)} pending`} icon={<DollarIcon />} iconBg={colors.badge.yellowLight} iconColor={colors.badge.warning} />
          <StatCard label="Overdue" value={overdueOrders.length} subtitle={`${formatCurrency(overdueAmount)} past due`} icon={<AlertIcon />} iconBg={colors.badge.importantLight} iconColor={colors.badge.important} />
          <StatCard label="Received" value={receivedPOs.length} subtitle={`${formatCurrency(receivedValue)} fulfilled`} icon={<TruckIcon />} iconBg={colors.badge.successLight} iconColor={colors.badge.success} />
        </div>
      )}

      {/* Tabs + Toolbar + Table */}
      {viewState === 'default' && (
        <div style={{ display: 'flex', flexDirection: 'column', marginTop: spacing.xs }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <TabBar
              tabs={[
                { id: 'all', label: 'All' },
                { id: 'active', label: 'Active' },
                { id: 'received', label: 'Received' },
                { id: 'cancelled', label: 'Cancelled' },
              ]}
              activeTab={activeTab}
              onTabChange={(tabId) => { setActiveTab(tabId); setSelectedKeys(new Set()) }}
              align="left"
              hasDivider={false}
            />
            <div style={{ flexShrink: 0 }}>
              <Button
                emphasis="high"
                size="md"
                leftIcon={<svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M12 5V19M5 12H19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" /></svg>}
                onClick={() => router.push('/create-invoice')}
              >
                Create PO
              </Button>
            </div>
          </div>

          <div style={{ marginTop: spacing.sm }}>
            <DataTable.Toolbar>
              <DataTable.Toolbar.Left>
                <DataTable.SelectionInfo count={selectedKeys.size} onClear={() => setSelectedKeys(new Set())}>
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

          <div style={{ marginTop: spacing.sm }}>
            <DataTable columns={poColumns} data={filteredPOs} rowKey={(row) => row.id} density="comfortable" display="table" hoverable selectable selectedKeys={selectedKeys} onSelectionChange={setSelectedKeys} />
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
                <Skeleton width={110} height={16} /><Skeleton width={110} height={16} /><Skeleton width={90} height={16} /><Skeleton width={75} height={24} /><Skeleton width={85} height={16} />
              </div>
            ))}
          </div>
        </>
      )}

      {/* Empty state */}
      {viewState === 'empty' && (
        <div style={{ backgroundColor: colors.surface.light, borderRadius: borderRadiusSemantics.card, border: `1px solid ${colors.border.lowEmphasis.onLight}`, padding: `${spacing['5xl']} ${spacing['2xl']}` }}>
          <EmptyState
            aria-label="No purchase orders"
            icon={<svg width={64} height={64} viewBox="0 0 64 64" fill="none" aria-hidden="true"><rect x="6" y="10" width="38" height="44" rx="4" stroke={colors.border.midEmphasis.onLight} strokeWidth="2" /><path d="M16 22h18M16 30h18M16 38h10" stroke={colors.border.midEmphasis.onLight} strokeWidth="1.5" strokeLinecap="round" /><circle cx="50" cy="18" r="10" fill={colors.brand.default} /><path d="M46 18H54M50 14V22" stroke="white" strokeWidth="2.5" strokeLinecap="round" /></svg>}
            title="No purchase orders yet"
            description="Create your first purchase order to start tracking vendor orders."
          >
            <Button emphasis="high" size="lg" leftIcon={<svg width={18} height={18} viewBox="0 0 18 18" fill="none" aria-hidden="true"><path d="M9 3V15M3 9H15" stroke="currentColor" strokeWidth="2" strokeLinecap="round" /></svg>} onClick={() => router.push('/create-invoice')}>
              Create your first PO
            </Button>
          </EmptyState>
        </div>
      )}

      {/* Error state */}
      {viewState === 'error' && (
        <div style={{ backgroundColor: colors.surface.important, borderRadius: borderRadiusSemantics.card, border: `1px solid ${colors.surfaceBorder.important}`, padding: `${spacing['3xl']} ${spacing['2xl']}`, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: spacing.lg, textAlign: 'center' }}>
          <div style={{ width: '64px', height: '64px', borderRadius: '50%', backgroundColor: colors.surface.important, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <svg width={32} height={32} viewBox="0 0 32 32" fill="none" aria-hidden="true"><circle cx="16" cy="16" r="14" stroke={colors.status.important} strokeWidth="2" /><path d="M16 9V18M16 21V23" stroke={colors.status.important} strokeWidth="2" strokeLinecap="round" /></svg>
          </div>
          <div>
            <h3 style={{ fontFamily: fontFamilies.display, fontSize: typography.heading.h4.fontSize, fontWeight: fontWeights.semibold, color: colors.text.important, margin: 0 }}>Failed to load purchase orders</h3>
            <p style={{ fontFamily: fontFamilies.body, fontSize: typography.body.md.fontSize, color: colors.text.lowEmphasis.onLight, margin: `${spacing.xs} 0 0`, maxWidth: '400px' }}>There was an error connecting to the purchase orders service. Please try again.</p>
          </div>
          <Button emphasis="high" size="lg" onClick={() => setViewState('default')}>Retry</Button>
        </div>
      )}

      <PrototypeToolbar viewState={viewState} onViewStateChange={setViewState} useCases={USE_CASES} activeUseCase={activeUseCase} onUseCaseChange={setActiveUseCase} />
    </div>
  )
}
