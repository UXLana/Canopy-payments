'use client'

import React, { useState, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import { PrototypeToolbar, ViewState } from '@/components'
import type { UseCase } from '@/components'
import {
  colors,
  spacing,
  typography,
  fontFamilies,
  fontWeights,
  borderRadiusSemantics,
  shadowSemantics,
  transitionPresets,
  breakpoints,
} from '@/styles/design-tokens'
import {
  Badge,
  Button,
  TabBar,
  Tab,
  DetailField,
  Skeleton,
  EmptyState,
  DataTable,
  ConfirmDialog,
  Toast,
  useToast,
  Divider,
  FullScreenModal,
  FullScreenModalPanel,
} from '@/components'
import { invoices, organizations, facilities, transactions } from '../data'
import type { DataTableColumn } from '@/components'
import type { InvoiceLineItem, Transaction } from '../data'

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
  { label: 'UC1 -- Single-facility retailer', description: 'Sarah: processes transactions at one dispensary in Colorado' },
  { label: 'UC2 -- Financial controller', description: 'Rachel: read-only across all brands, write access in Payments only' },
  { label: 'UC3 -- Multi-org consultant', description: 'Tom: supply chain across 2 orgs, write access in Payments' },
]

function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(amount)
}

function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })
}

function getOrgName(orgId: string): string {
  return organizations.find((o) => o.id === orgId)?.name ?? orgId
}

function getFacilityName(facilityId: string): string {
  return facilities.find((f) => f.id === facilityId)?.name ?? facilityId
}

function getStatusBadgeColor(status: string): 'success' | 'warning' | 'error' | 'info' | 'neutral' {
  switch (status) {
    case 'paid': return 'success'
    case 'partial': return 'warning'
    case 'sent': return 'info'
    case 'viewed': return 'info'
    case 'overdue': return 'error'
    case 'voided': return 'neutral'
    case 'draft': return 'neutral'
    default: return 'neutral'
  }
}

function getStatusBadgeVariant(status: string): 'filled' | 'subtle' | 'outlined' {
  switch (status) {
    case 'paid': return 'filled'
    case 'overdue': return 'filled'
    case 'voided': return 'outlined'
    case 'draft': return 'outlined'
    default: return 'subtle'
  }
}

function getTxnTypeColor(type: string): 'success' | 'warning' | 'error' | 'info' | 'neutral' {
  switch (type) {
    case 'payment': return 'success'
    case 'refund': return 'warning'
    case 'adjustment': return 'info'
    default: return 'neutral'
  }
}

function getTxnStatusColor(status: string): 'success' | 'warning' | 'error' | 'neutral' {
  switch (status) {
    case 'completed': return 'success'
    case 'pending': return 'warning'
    case 'failed': return 'error'
    case 'reversed': return 'neutral'
    default: return 'neutral'
  }
}

function formatPaymentTerms(terms: string): string {
  switch (terms) {
    case 'net-15': return 'Net 15'
    case 'net-30': return 'Net 30'
    case 'net-45': return 'Net 45'
    case 'net-60': return 'Net 60'
    case 'due-on-receipt': return 'Due on Receipt'
    default: return terms
  }
}

function InvoiceDetailContent() {
  const searchParams = useSearchParams()
  const invoiceId = searchParams.get('id')
  const invoice = invoices.find((inv) => inv.id === invoiceId) ?? invoices[0]

  const [viewState, setViewState] = useState<ViewState>('default')
  const [activeTab, setActiveTab] = useState('line-items')
  const [activeUseCase, setActiveUseCase] = useState(0)
  const [showPaymentDialog, setShowPaymentDialog] = useState(false)
  const [showVoidDialog, setShowVoidDialog] = useState(false)
  const toast = useToast()
  const isMobile = useMediaQuery(`(max-width: ${parseInt(breakpoints.md) - 1}px)`)

  const invoiceTransactions = transactions.filter((t) => t.invoiceId === invoice.id)

  const tabs = [
    { id: 'line-items', label: 'Line Items' },
    { id: 'payments', label: 'Payment History' },
    { id: 'details', label: 'Details' },
  ]

  const lineItemColumns: DataTableColumn<InvoiceLineItem>[] = [
    {
      key: 'productName',
      header: 'Product',
      sortable: true,
      render: (row) => (
        <span style={{ fontFamily: fontFamilies.body, fontSize: typography.body.sm.fontSize, fontWeight: fontWeights.medium }}>
          {row.productName}
        </span>
      ),
    },
    {
      key: 'sku',
      header: 'SKU',
      render: (row) => (
        <span style={{ fontFamily: fontFamilies.mono, fontSize: typography.body.sm.fontSize, color: colors.text.lowEmphasis.onLight }}>
          {row.sku}
        </span>
      ),
    },
    {
      key: 'category',
      header: 'Category',
      sortable: true,
      render: (row) => (
        <Badge color="neutral" variant="subtle" size="sm">
          {row.category}
        </Badge>
      ),
    },
    {
      key: 'quantity',
      header: 'Qty',
      sortable: true,
      render: (row) => (
        <span style={{ fontFamily: fontFamilies.body, fontSize: typography.body.sm.fontSize }}>
          {row.quantity.toLocaleString()}
        </span>
      ),
    },
    {
      key: 'unitPrice',
      header: 'Unit Price',
      render: (row) => (
        <span style={{ fontFamily: fontFamilies.mono, fontSize: typography.body.sm.fontSize }}>
          {formatCurrency(row.unitPrice)}
        </span>
      ),
    },
    {
      key: 'total',
      header: 'Total',
      sortable: true,
      render: (row) => (
        <span style={{ fontFamily: fontFamilies.mono, fontSize: typography.body.sm.fontSize, fontWeight: fontWeights.semibold }}>
          {formatCurrency(row.total)}
        </span>
      ),
    },
  ]

  const paymentColumns: DataTableColumn<Transaction>[] = [
    {
      key: 'timestamp',
      header: 'Date',
      sortable: true,
      render: (row) => (
        <span style={{ fontFamily: fontFamilies.body, fontSize: typography.body.sm.fontSize }}>
          {formatDate(row.timestamp)}
        </span>
      ),
    },
    {
      key: 'reference',
      header: 'Reference',
      render: (row) => (
        <span style={{ fontFamily: fontFamilies.mono, fontSize: typography.body.sm.fontSize, color: colors.text.lowEmphasis.onLight }}>
          {row.reference}
        </span>
      ),
    },
    {
      key: 'type',
      header: 'Type',
      sortable: true,
      render: (row) => (
        <Badge color={getTxnTypeColor(row.type)} variant="subtle" size="sm">
          {row.type.charAt(0).toUpperCase() + row.type.slice(1)}
        </Badge>
      ),
    },
    {
      key: 'amount',
      header: 'Amount',
      sortable: true,
      render: (row) => (
        <span style={{ fontFamily: fontFamilies.mono, fontSize: typography.body.sm.fontSize, fontWeight: fontWeights.semibold }}>
          {formatCurrency(Math.abs(row.amount))}
        </span>
      ),
    },
    {
      key: 'status',
      header: 'Status',
      sortable: true,
      render: (row) => (
        <Badge color={getTxnStatusColor(row.status)} variant={row.status === 'completed' ? 'filled' : 'subtle'} size="sm">
          {row.status.charAt(0).toUpperCase() + row.status.slice(1)}
        </Badge>
      ),
    },
    {
      key: 'method',
      header: 'Method',
      render: (row) => (
        <span style={{ fontFamily: fontFamilies.body, fontSize: typography.body.sm.fontSize, textTransform: 'uppercase' as const }}>
          {row.method}
        </span>
      ),
    },
  ]

  const sectionStyle: React.CSSProperties = {
    backgroundColor: colors.surface.light,
    borderRadius: borderRadiusSemantics.card,
    border: `1px solid ${colors.border.lowEmphasis.onLight}`,
    boxShadow: shadowSemantics.card,
    padding: isMobile ? spacing.md : spacing.xl,
  }

  const fieldGridStyle: React.CSSProperties = {
    display: 'grid',
    gridTemplateColumns: isMobile ? '1fr' : 'repeat(2, 1fr)',
    gap: spacing.lg,
  }

  const summaryRowStyle: React.CSSProperties = {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    fontFamily: fontFamilies.body,
    fontSize: typography.body.sm.fontSize,
    color: colors.text.highEmphasis.onLight,
    padding: `${spacing['2xs']} 0`,
  }

  return (
    <div>
      <FullScreenModal
        open={true}
        onClose={() => { window.history.back() }}
        title={invoice.invoiceNumber}
        subtitle={`${getOrgName(invoice.senderOrgId)} → ${getOrgName(invoice.receiverOrgId)}`}
        columns={1}
        headerButtons={[
          { label: 'Download PDF', emphasis: 'mid' as const, onClick: () => toast.success('PDF downloaded.') },
          { label: 'Record Payment', emphasis: 'high' as const, onClick: () => setShowPaymentDialog(true) },
        ]}
      >
        <FullScreenModalPanel>
          <div style={{ maxWidth: '960px', margin: '0 auto', width: '100%' }}>

      {/* Loading state */}
      {viewState === 'loading' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: spacing.xl }}>
          <div style={sectionStyle}>
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: spacing.lg }}>
              <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: spacing.xs }}>
                <Skeleton width="40%" height={28} />
                <Skeleton width="25%" height={16} />
                <div style={{ display: 'flex', gap: spacing.xs }}>
                  <Skeleton width={60} height={24} />
                </div>
              </div>
              <div style={{ display: 'flex', gap: spacing.xs }}>
                <Skeleton width={120} height={40} />
                <Skeleton width={110} height={40} />
                <Skeleton width={70} height={40} />
              </div>
            </div>
          </div>
          <Skeleton width="100%" height={48} />
          <div style={sectionStyle}>
            <div style={fieldGridStyle}>
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} style={{ display: 'flex', flexDirection: 'column', gap: spacing['2xs'] }}>
                  <Skeleton width="40%" height={14} />
                  <Skeleton width="70%" height={18} />
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Error state */}
      {viewState === 'error' && (
        <div
          style={{
            ...sectionStyle,
            backgroundColor: colors.surface.important,
            borderColor: colors.surfaceBorder.important,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: spacing.md,
            textAlign: 'center',
            padding: spacing['2xl'],
          }}
        >
          <svg width={40} height={40} viewBox="0 0 40 40" fill="none" aria-hidden="true">
            <circle cx="20" cy="20" r="18" stroke={colors.status.important} strokeWidth="2" />
            <path d="M20 12V22M20 26V28" stroke={colors.status.important} strokeWidth="2" strokeLinecap="round" />
          </svg>
          <h3
            style={{
              fontFamily: fontFamilies.display,
              fontSize: typography.heading.h5.fontSize,
              fontWeight: fontWeights.semibold,
              color: colors.text.important,
              margin: 0,
            }}
          >
            Failed to load invoice
          </h3>
          <p
            style={{
              fontFamily: fontFamilies.body,
              fontSize: typography.body.sm.fontSize,
              color: colors.text.lowEmphasis.onLight,
              margin: 0,
            }}
          >
            The invoice could not be loaded. It may have been removed or you don't have permission to view it.
          </p>
          <Button emphasis="high" size="md" onClick={() => setViewState('default')}>
            Retry
          </Button>
        </div>
      )}

      {/* Empty state */}
      {viewState === 'empty' && (
        <div style={sectionStyle}>
          <EmptyState
            aria-label="Invoice not found"
            icon={
              <svg width={48} height={48} viewBox="0 0 48 48" fill="none" aria-hidden="true">
                <rect x="6" y="6" width="36" height="36" rx="4" stroke={colors.border.midEmphasis.onLight} strokeWidth="2" strokeDasharray="4 4" />
                <path d="M18 24H30M24 18V30" stroke={colors.border.midEmphasis.onLight} strokeWidth="2" strokeLinecap="round" />
              </svg>
            }
            title="Invoice not found"
            description="The invoice you're looking for doesn't exist or has been removed from the system."
          >
            <div style={{ display: 'flex', gap: spacing.xs }}>
              <Button
                emphasis="high"
                size="md"
                onClick={() => window.history.back()}
              >
                Go Back
              </Button>
            </div>
          </EmptyState>
        </div>
      )}

      {/* Default state */}
      {viewState === 'default' && (
        <>
          {/* Invoice summary bar */}
          <div style={{ display: 'flex', alignItems: 'center', gap: spacing.md, flexWrap: 'wrap' }}>
            <Badge
              color={getStatusBadgeColor(invoice.status)}
              variant={getStatusBadgeVariant(invoice.status)}
              size="md"
            >
              {invoice.status.charAt(0).toUpperCase() + invoice.status.slice(1)}
            </Badge>
            <span style={{ fontFamily: fontFamilies.mono, fontSize: typography.heading.h5.fontSize, fontWeight: fontWeights.semibold, color: colors.text.highEmphasis.onLight }}>
              {formatCurrency(invoice.total)}
            </span>
            <span style={{ fontFamily: fontFamilies.body, fontSize: typography.body.sm.fontSize, color: colors.text.lowEmphasis.onLight }}>
              Due {formatDate(invoice.dueDate)}
            </span>
            <div style={{ marginLeft: 'auto' }}>
              <Button emphasis="low" size="md" destructive onClick={() => setShowVoidDialog(true)}>
                Void Invoice
              </Button>
            </div>
          </div>

          {/* Tabs */}
          <TabBar
            tabs={tabs.map((tab) => ({ id: tab.id, label: tab.label }))}
            activeTab={activeTab}
            onTabChange={setActiveTab}
            align="left"
          />

          {/* Tab content */}
          <div style={sectionStyle}>
            {/* Line Items tab */}
            {activeTab === 'line-items' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: spacing.lg }}>
                <DataTable
                  columns={lineItemColumns}
                  data={invoice.items}
                  rowKey={(row) => row.id}
                  density="compact"
                />
                <Divider />
                {/* Summary */}
                <div
                  style={{
                    maxWidth: '320px',
                    marginLeft: 'auto',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: spacing['2xs'],
                  }}
                >
                  <div style={summaryRowStyle}>
                    <span style={{ color: colors.text.lowEmphasis.onLight }}>Subtotal</span>
                    <span style={{ fontFamily: fontFamilies.mono }}>{formatCurrency(invoice.subtotal)}</span>
                  </div>
                  <div style={summaryRowStyle}>
                    <span style={{ color: colors.text.lowEmphasis.onLight }}>
                      Tax ({(invoice.taxRate * 100).toFixed(2)}%)
                    </span>
                    <span style={{ fontFamily: fontFamilies.mono }}>{formatCurrency(invoice.taxAmount)}</span>
                  </div>
                  <Divider />
                  <div style={{ ...summaryRowStyle, fontWeight: fontWeights.semibold }}>
                    <span>Total</span>
                    <span style={{ fontFamily: fontFamilies.mono }}>{formatCurrency(invoice.total)}</span>
                  </div>
                  <div style={summaryRowStyle}>
                    <span style={{ color: colors.text.lowEmphasis.onLight }}>Amount Paid</span>
                    <span style={{ fontFamily: fontFamilies.mono, color: colors.status.success }}>
                      {formatCurrency(invoice.amountPaid)}
                    </span>
                  </div>
                  <div
                    style={{
                      ...summaryRowStyle,
                      fontWeight: fontWeights.bold,
                      fontSize: typography.body.md.fontSize,
                      color: invoice.amountDue > 0 ? colors.status.important : colors.status.success,
                    }}
                  >
                    <span>Amount Due</span>
                    <span style={{ fontFamily: fontFamilies.mono }}>{formatCurrency(invoice.amountDue)}</span>
                  </div>
                </div>
              </div>
            )}

            {/* Payment History tab */}
            {activeTab === 'payments' && (
              <>
                {invoiceTransactions.length > 0 ? (
                  <DataTable
                    columns={paymentColumns}
                    data={invoiceTransactions}
                    rowKey={(row) => row.id}
                    density="compact"
                  />
                ) : (
                  <EmptyState
                    aria-label="No payments"
                    title="No payment history"
                    description="No transactions have been recorded for this invoice yet."
                  />
                )}
              </>
            )}

            {/* Details tab */}
            {activeTab === 'details' && (
              <div style={fieldGridStyle}>
                <DetailField label="From" value={getOrgName(invoice.senderOrgId)} />
                <DetailField label="From Facility" value={getFacilityName(invoice.senderFacilityId)} />
                <DetailField label="To" value={getOrgName(invoice.receiverOrgId)} />
                <DetailField label="To Facility" value={getFacilityName(invoice.receiverFacilityId)} />
                <DetailField label="Market" value={invoice.market} />
                <DetailField label="Payment Terms" value={formatPaymentTerms(invoice.paymentTerms)} />
                <DetailField label="Created" value={formatDate(invoice.createdAt)} />
                <DetailField label="Due Date" value={formatDate(invoice.dueDate)} />
                <DetailField label="Paid Date" value={invoice.paidAt ? formatDate(invoice.paidAt) : '\u2014'} />
                <DetailField label="Manifest #" value={invoice.manifestNumber} mono />
                <DetailField label="Notes" value={invoice.notes || '\u2014'} />
              </div>
            )}
          </div>

          {/* Record Payment confirmation dialog */}
          <ConfirmDialog
            open={showPaymentDialog}
            title={`Record payment for ${invoice.invoiceNumber}?`}
            description={`This will record a payment of ${formatCurrency(invoice.amountDue)} against the outstanding balance. The invoice status will be updated accordingly.`}
            confirmLabel="Record Payment"
            cancelLabel="Cancel"
            variant="info"
            onConfirm={() => {
              setShowPaymentDialog(false)
              toast.success(`Payment of ${formatCurrency(invoice.amountDue)} recorded for ${invoice.invoiceNumber}.`)
            }}
            onCancel={() => setShowPaymentDialog(false)}
          />

          {/* Void confirmation dialog */}
          <ConfirmDialog
            open={showVoidDialog}
            title={`Void ${invoice.invoiceNumber}?`}
            description="Voiding this invoice will cancel all outstanding balances and prevent future payments. This action cannot be undone."
            confirmLabel="Void Invoice"
            cancelLabel="Cancel"
            variant="destructive"
            onConfirm={() => {
              setShowVoidDialog(false)
              toast.success(`${invoice.invoiceNumber} has been voided.`)
            }}
            onCancel={() => setShowVoidDialog(false)}
          />

          {/* Toast container */}
          {toast.toasts.map((t) => (
            <Toast
              key={t.id}
              variant={t.variant}
              message={t.message}
              isVisible
              onClose={() => toast.dismiss(t.id)}
            />
          ))}
        </>
      )}
          </div>
        </FullScreenModalPanel>
      </FullScreenModal>

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

export default function InvoiceDetailPage() {
  return (
    <Suspense fallback={null}>
      <InvoiceDetailContent />
    </Suspense>
  )
}
