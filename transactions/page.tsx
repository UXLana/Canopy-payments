'use client'

import React, { useState } from 'react'
import { PrototypeToolbar, ViewState, UseCase } from '@/app/prototypes/PrototypeToolbar'
import { EmptyState, Badge, Button } from '@/components'
import {
  colors,
  spacing,
  typography,
  fontFamilies,
  fontWeights,
  borderRadiusSemantics,
} from '@/styles/design-tokens'

const USE_CASES: UseCase[] = [
  { label: 'UC1 — Single-facility retailer', description: 'Sarah: processes transactions at one dispensary in Colorado' },
  { label: 'UC2 — Financial controller', description: 'Rachel: read-only across all brands, write access in Payments only' },
  { label: 'UC3 — Multi-org consultant', description: 'Tom: supply chain across 2 orgs, write access in Payments' },
]

// Inline icons
const ArrowsIcon = () => (
  <svg width={28} height={28} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="17 1 21 5 17 9" />
    <path d="M3 11V9a4 4 0 0 1 4-4h14" />
    <polyline points="7 23 3 19 7 15" />
    <path d="M21 13v2a4 4 0 0 1-4 4H3" />
  </svg>
)

const CheckCircleIcon = () => (
  <svg width={16} height={16} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
    <polyline points="22 4 12 14.01 9 11.01" />
  </svg>
)

const PLANNED_FEATURES = [
  'Full transaction ledger with advanced filtering and search',
  'Payment method tracking (ACH, wire transfer, check)',
  'Reconciliation tools for matching payments to invoices',
  'Export transaction history as CSV or PDF for auditing',
  'Refund and adjustment workflows with approval chains',
  'Real-time payment status notifications',
]

export default function TransactionsPage() {
  const [viewState, setViewState] = useState<ViewState>('default')
  const [activeUseCase, setActiveUseCase] = useState(0)

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: spacing.xl }}>
      {/* Page header */}
      <div style={{ display: 'flex', alignItems: 'center', gap: spacing.sm }}>
        <h1
          style={{
            fontFamily: fontFamilies.display,
            fontSize: typography.heading.h3.fontSize,
            fontWeight: fontWeights.semibold,
            color: colors.text.highEmphasis.onLight,
            margin: 0,
          }}
        >
          Transactions
        </h1>
        <Badge color="brand" variant="outlined">Coming Soon</Badge>
      </div>

      {/* Coming soon card */}
      <div
        style={{
          backgroundColor: colors.surface.light,
          borderRadius: borderRadiusSemantics.card,
          border: `1px solid ${colors.border.lowEmphasis.onLight}`,
          padding: spacing['4xl'],
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: spacing['2xl'],
        }}
      >
        <EmptyState
          icon={<ArrowsIcon />}
          title="Transaction Ledger is on the way"
          description="View, filter, and reconcile all payment transactions across your organizations. Track ACH transfers, wire payments, and checks in one unified ledger."
          action={
            <Button
              emphasis="low"
              size="md"
              onClick={() => window.location.href = '/prototypes/canopy-payments/dashboard'}
            >
              View Dashboard Instead
            </Button>
          }
        />

        {/* Planned features */}
        <div
          style={{
            width: '100%',
            maxWidth: '480px',
            display: 'flex',
            flexDirection: 'column',
            gap: spacing.md,
          }}
        >
          <h3
            style={{
              fontFamily: fontFamilies.body,
              fontSize: typography.label.md.fontSize,
              fontWeight: fontWeights.semibold,
              color: colors.text.highEmphasis.onLight,
              margin: 0,
              textAlign: 'center',
            }}
          >
            Planned Features
          </h3>
          <ul
            style={{
              listStyle: 'none',
              margin: 0,
              padding: 0,
              display: 'flex',
              flexDirection: 'column',
              gap: spacing.xs,
            }}
          >
            {PLANNED_FEATURES.map((feature, i) => (
              <li
                key={i}
                style={{
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: spacing.xs,
                  fontFamily: fontFamilies.body,
                  fontSize: typography.body.sm.fontSize,
                  color: colors.text.lowEmphasis.onLight,
                  lineHeight: 1.5,
                }}
              >
                <span
                  style={{
                    color: colors.brand.default,
                    flexShrink: 0,
                    marginTop: '2px',
                  }}
                >
                  <CheckCircleIcon />
                </span>
                {feature}
              </li>
            ))}
          </ul>
        </div>
      </div>

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
