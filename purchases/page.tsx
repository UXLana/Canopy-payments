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
  { label: 'UC1 — Single-facility retailer', description: 'Sarah: processes purchases at one dispensary in Colorado' },
  { label: 'UC2 — Financial controller', description: 'Rachel: read-only across all brands, write access in Payments only' },
  { label: 'UC3 — Multi-org consultant', description: 'Tom: supply chain across 2 orgs, write access in Payments' },
]

// Inline icons
const CartIcon = () => (
  <svg width={28} height={28} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="9" cy="21" r="1" />
    <circle cx="20" cy="21" r="1" />
    <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
  </svg>
)

const CheckCircleIcon = () => (
  <svg width={16} height={16} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
    <polyline points="22 4 12 14.01 9 11.01" />
  </svg>
)

const PLANNED_FEATURES = [
  'Create and manage purchase orders between organizations',
  'Track PO status from draft to fulfilled',
  'Link purchase orders to invoices and transfer manifests',
  'Multi-market purchase order templates',
  'Automated PO-to-invoice matching',
  'Approval workflows with role-based permissions',
]

export default function PurchasesPage() {
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
          Purchases
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
          icon={<CartIcon />}
          title="Purchase Orders are on the way"
          description="Create, track, and manage purchase orders across your supply chain. Link POs to invoices and transfer manifests for full financial traceability."
          action={
            <Button
              emphasis="low"
              size="md"
              onClick={() => window.location.href = '/prototypes/canopy-payments/invoices'}
            >
              View Invoices Instead
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
