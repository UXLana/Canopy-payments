'use client'

import React, { useState, useRef, useEffect } from 'react'
import { PrototypeToolbar, ViewState } from '@/components'
import type { UseCase } from '@/components'
import {
  colors,
  spacing,
  typography,
  fontFamilies,
  fontWeights,
  borderRadiusSemantics,
  transitionPresets,
} from '@/styles/design-tokens'
import {
  Button,
  Input,
  LinearStepper,
  ConfirmDialog,
  Toast,
  useToast,
  Badge,
  Divider,
  Banner,
  FullScreenModal,
  FullScreenModalPanel,
} from '@/components'
import type { StepItem } from '@/components/Stepper'
import { Select } from '@/components/Select'
import { Textarea } from '@/components/Textarea'
import { organizations, facilities, marketOptions, paymentTermsOptions } from '../data'

// =============================================================================
// TYPES
// =============================================================================

interface LineItem {
  productName: string
  sku: string
  category: string
  quantity: number
  unitPrice: number
  packageTag: string
}

interface FormData {
  senderOrgId: string
  senderFacilityId: string
  receiverOrgId: string
  receiverFacilityId: string
  market: string
  items: LineItem[]
  paymentTerms: string
  taxRate: number
  notes: string
  manifestNumber: string
}

type FormErrors = Partial<Record<string, string>>

// =============================================================================
// CONSTANTS
// =============================================================================

const categoryOptions = [
  { value: 'flower', label: 'Flower' },
  { value: 'concentrate', label: 'Concentrate' },
  { value: 'edible', label: 'Edible' },
  { value: 'pre-roll', label: 'Pre-Roll' },
  { value: 'tincture', label: 'Tincture' },
  { value: 'topical', label: 'Topical' },
]

const USE_CASES: UseCase[] = [
  { label: 'UC1 — Single-facility retailer', description: 'Sarah: processes transactions at one dispensary in Colorado' },
  { label: 'UC2 — Financial controller', description: 'Rachel: read-only across all brands, write access in Payments only' },
  { label: 'UC3 — Multi-org consultant', description: 'Tom: supply chain across 2 orgs, write access in Payments' },
]

const STEPS: StepItem[] = [
  { id: 'recipient', label: 'Recipient', metadata: 'Select sender and receiver' },
  { id: 'line-items', label: 'Line Items', metadata: 'Add products to invoice' },
  { id: 'terms', label: 'Payment Terms', metadata: 'Set terms and details' },
]

const formatCurrency = (amount: number) =>
  new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(amount)

const emptyLineItem = (): LineItem => ({
  productName: '',
  sku: '',
  category: '',
  quantity: 0,
  unitPrice: 0,
  packageTag: '',
})

const formPaymentTermsOptions = paymentTermsOptions.filter((o) => o.value !== 'all')

// =============================================================================
// INVOICE PREVIEW (inline component)
// =============================================================================

const previewLabelStyle: React.CSSProperties = {
  fontFamily: fontFamilies.body,
  fontSize: typography.label.sm.fontSize,
  fontWeight: fontWeights.semibold,
  color: colors.text.lowEmphasis.onLight,
  textTransform: 'uppercase',
  letterSpacing: '0.5px',
  marginBottom: spacing['2xs'],
}

const previewValueStyle: React.CSSProperties = {
  fontFamily: fontFamilies.body,
  fontSize: typography.body.sm.fontSize,
  fontWeight: fontWeights.medium,
  color: colors.text.highEmphasis.onLight,
}

const previewSubStyle: React.CSSProperties = {
  fontFamily: fontFamilies.body,
  fontSize: typography.body.xs.fontSize,
  color: colors.text.lowEmphasis.onLight,
}

function StepperZIndexFix({ activeStep, children }: { activeStep: number; children: React.ReactNode }) {
  const ref = useRef<HTMLDivElement>(null)
  useEffect(() => {
    if (!ref.current) return
    const items = ref.current.querySelectorAll<HTMLElement>('ol > li')
    items.forEach((li, i) => {
      li.style.position = 'relative'
      li.style.zIndex = i === activeStep ? '20' : '1'
    })
  }, [activeStep])
  return <div ref={ref}>{children}</div>
}

function InvoicePreview({
  formData,
  subtotal,
  taxAmount,
  total,
  getOrgName,
  getFacilityName,
  getMarketLabel,
  getTermsLabel,
  getCategoryLabel,
}: {
  formData: FormData
  subtotal: number
  taxAmount: number
  total: number
  getOrgName: (id: string) => string
  getFacilityName: (id: string) => string
  getMarketLabel: (val: string) => string
  getTermsLabel: (val: string) => string
  getCategoryLabel: (val: string) => string
}) {
  const validItems = formData.items.filter((item) => item.productName.trim())

  return (
    <div
      style={{
        backgroundColor: '#FFFFFF',
        borderRadius: borderRadiusSemantics.card,
        border: `1px solid ${colors.border.lowEmphasis.onLight}`,
        padding: spacing.md,
        margin: spacing.md,
      }}
    >
      {/* Invoice header */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'flex-start',
          marginBottom: spacing.sm,
        }}
      >
        <div>
          <div
            style={{
              fontFamily: fontFamilies.display,
              fontSize: typography.heading.h5.fontSize,
              fontWeight: fontWeights.bold,
              color: colors.text.highEmphasis.onLight,
            }}
          >
            INVOICE
          </div>
          <div
            style={{
              fontFamily: fontFamilies.mono,
              fontSize: typography.body.sm.fontSize,
              color: colors.text.lowEmphasis.onLight,
            }}
          >
            INV-2026-DRAFT
          </div>
        </div>
        <Badge color="neutral" variant="outlined">
          Draft
        </Badge>
      </div>

      <Divider />

      {/* From / To section */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: spacing.sm,
          margin: `${spacing.sm} 0`,
        }}
      >
        <div>
          <div style={previewLabelStyle}>FROM</div>
          <div style={previewValueStyle}>{getOrgName(formData.senderOrgId)}</div>
          <div style={previewSubStyle}>{getFacilityName(formData.senderFacilityId)}</div>
        </div>
        <div>
          <div style={previewLabelStyle}>TO</div>
          <div style={previewValueStyle}>{getOrgName(formData.receiverOrgId)}</div>
          <div style={previewSubStyle}>{getFacilityName(formData.receiverFacilityId)}</div>
        </div>
      </div>

      {/* Market */}
      {formData.market && (
        <div style={{ marginBottom: spacing.sm }}>
          <Badge color="brand" variant="outlined">
            {getMarketLabel(formData.market)}
          </Badge>
        </div>
      )}

      <Divider style={{ margin: `${spacing.sm} 0` }} />

      {/* Line items table */}
      <div style={previewLabelStyle}>LINE ITEMS</div>
      {validItems.length > 0 ? (
        <table
          style={{
            width: '100%',
            borderCollapse: 'collapse',
            fontFamily: fontFamilies.body,
            fontSize: typography.body.sm.fontSize,
            marginBottom: spacing.md,
          }}
        >
          <thead>
            <tr>
              {['Product', 'Qty', 'Unit Price', 'Total'].map((header) => (
                <th
                  key={header}
                  style={{
                    textAlign: header === 'Product' ? 'left' : 'right',
                    padding: `${spacing['2xs']} ${spacing.xs}`,
                    fontWeight: fontWeights.semibold,
                    color: colors.text.lowEmphasis.onLight,
                    fontSize: typography.label.sm.fontSize,
                    borderBottom: `1px solid ${colors.border.lowEmphasis.onLight}`,
                  }}
                >
                  {header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {validItems.map((item, index) => (
              <tr key={index}>
                <td
                  style={{
                    padding: `${spacing['2xs']} ${spacing.xs}`,
                    color: colors.text.highEmphasis.onLight,
                  }}
                >
                  {item.productName}
                </td>
                <td
                  style={{
                    padding: `${spacing['2xs']} ${spacing.xs}`,
                    textAlign: 'right',
                    color: colors.text.highEmphasis.onLight,
                  }}
                >
                  {item.quantity.toLocaleString()}
                </td>
                <td
                  style={{
                    padding: `${spacing['2xs']} ${spacing.xs}`,
                    textAlign: 'right',
                    color: colors.text.highEmphasis.onLight,
                  }}
                >
                  {formatCurrency(item.unitPrice)}
                </td>
                <td
                  style={{
                    padding: `${spacing['2xs']} ${spacing.xs}`,
                    textAlign: 'right',
                    fontWeight: fontWeights.medium,
                    color: colors.text.highEmphasis.onLight,
                  }}
                >
                  {formatCurrency(item.quantity * item.unitPrice)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <div
          style={{
            fontFamily: fontFamilies.body,
            fontSize: typography.body.sm.fontSize,
            color: colors.text.disabled.onLight,
            padding: `${spacing.md} 0`,
          }}
        >
          No line items added yet
        </div>
      )}

      {/* Totals */}
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'flex-end',
          gap: spacing['2xs'],
          paddingTop: spacing.sm,
          borderTop: `1px solid ${colors.border.lowEmphasis.onLight}`,
        }}
      >
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            width: '180px',
            fontFamily: fontFamilies.body,
            fontSize: typography.body.sm.fontSize,
            color: colors.text.lowEmphasis.onLight,
          }}
        >
          <span>Subtotal</span>
          <span style={{ fontWeight: fontWeights.medium, color: colors.text.highEmphasis.onLight }}>
            {formatCurrency(subtotal)}
          </span>
        </div>
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            width: '180px',
            fontFamily: fontFamilies.body,
            fontSize: typography.body.sm.fontSize,
            color: colors.text.lowEmphasis.onLight,
          }}
        >
          <span>Tax ({formData.taxRate}%)</span>
          <span style={{ fontWeight: fontWeights.medium, color: colors.text.highEmphasis.onLight }}>
            {formatCurrency(taxAmount)}
          </span>
        </div>
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            width: '180px',
            fontFamily: fontFamilies.body,
            fontSize: typography.body.md.fontSize,
            fontWeight: fontWeights.semibold,
            color: colors.text.highEmphasis.onLight,
            marginTop: spacing.xs,
            paddingTop: spacing.xs,
            borderTop: `1px solid ${colors.border.lowEmphasis.onLight}`,
          }}
        >
          <span>Total</span>
          <span>{formatCurrency(total)}</span>
        </div>
      </div>

      <Divider style={{ margin: `${spacing.sm} 0` }} />

      {/* Payment terms + manifest + notes */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: spacing.xs }}>
        <div>
          <div style={previewLabelStyle}>PAYMENT TERMS</div>
          <div style={previewValueStyle}>
            {formData.paymentTerms ? getTermsLabel(formData.paymentTerms) : '—'}
          </div>
        </div>
        <div>
          <div style={previewLabelStyle}>MANIFEST #</div>
          <div style={previewValueStyle}>{formData.manifestNumber || '—'}</div>
        </div>
        {formData.notes ? (
          <div>
            <div style={previewLabelStyle}>NOTES</div>
            <div style={previewSubStyle}>{formData.notes}</div>
          </div>
        ) : (
          <div>
            <div style={previewLabelStyle}>NOTES</div>
            <div style={previewValueStyle}>—</div>
          </div>
        )}
      </div>
    </div>
  )
}

// =============================================================================
// MAIN PAGE
// =============================================================================

export default function CreateInvoicePage() {
  const [viewState, setViewState] = useState<ViewState>('default')
  const [activeStep, setActiveStep] = useState(0)
  const [showConfirmDialog, setShowConfirmDialog] = useState(false)
  const [errors, setErrors] = useState<FormErrors>({})
  const toast = useToast()

  const [formData, setFormData] = useState<FormData>({
    senderOrgId: '',
    senderFacilityId: '',
    receiverOrgId: '',
    receiverFacilityId: '',
    market: '',
    items: [emptyLineItem()],
    paymentTerms: '',
    taxRate: 8.5,
    notes: '',
    manifestNumber: '',
  })

  // ---------------------------------------------------------------------------
  // Form helpers
  // ---------------------------------------------------------------------------

  const updateField = <K extends keyof FormData>(field: K, value: FormData[K]) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
    if (errors[field]) {
      setErrors((prev) => {
        const next = { ...prev }
        delete next[field]
        return next
      })
    }
  }

  const updateLineItem = (index: number, key: keyof LineItem, value: string | number) => {
    setFormData((prev) => {
      const items = [...prev.items]
      items[index] = { ...items[index], [key]: value }
      return { ...prev, items }
    })
    const fieldKey = `item_${index}_${key}`
    if (errors['items'] || errors[fieldKey]) {
      setErrors((prev) => {
        const next = { ...prev }
        delete next['items']
        delete next[fieldKey]
        return next
      })
    }
  }

  const addLineItem = () => {
    setFormData((prev) => ({ ...prev, items: [...prev.items, emptyLineItem()] }))
  }

  const removeLineItem = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      items: prev.items.length > 1 ? prev.items.filter((_, i) => i !== index) : prev.items,
    }))
  }

  // ---------------------------------------------------------------------------
  // Derived data
  // ---------------------------------------------------------------------------

  const senderFacilities = facilities.filter((f) => f.orgId === formData.senderOrgId)
  const receiverFacilities = facilities.filter((f) => f.orgId === formData.receiverOrgId)

  const orgOptions = organizations.map((o) => ({ value: o.id, label: o.name }))
  const senderFacilityOptions = senderFacilities.map((f) => ({ value: f.id, label: f.name }))
  const receiverFacilityOptions = receiverFacilities.map((f) => ({ value: f.id, label: f.name }))

  const subtotal = formData.items.reduce((sum, item) => sum + item.quantity * item.unitPrice, 0)
  const taxAmount = subtotal * (formData.taxRate / 100)
  const total = subtotal + taxAmount

  const getOrgName = (id: string) => organizations.find((o) => o.id === id)?.name ?? '—'
  const getFacilityName = (id: string) => facilities.find((f) => f.id === id)?.name ?? '—'
  const getMarketLabel = (val: string) => marketOptions.find((m) => m.value === val)?.label ?? val
  const getTermsLabel = (val: string) => formPaymentTermsOptions.find((t) => t.value === val)?.label ?? val
  const getCategoryLabel = (val: string) => categoryOptions.find((c) => c.value === val)?.label ?? val

  const receiverOrgName = organizations.find((o) => o.id === formData.receiverOrgId)?.name ?? 'the receiver'
  const invoiceNumber = `INV-2026-${String(Math.floor(Math.random() * 9000) + 1000).padStart(4, '0')}`

  // Check if all required fields across all steps are filled
  const allRequiredFieldsFilled = (() => {
    // Step 0: Recipient
    if (!formData.senderOrgId || !formData.senderFacilityId || !formData.receiverOrgId || !formData.receiverFacilityId || !formData.market) return false
    // Step 1: Line items — at least one valid item
    const hasValidItem = formData.items.some((item) => item.productName.trim() && item.quantity > 0 && item.unitPrice > 0)
    if (!hasValidItem) return false
    // Step 2: Payment terms
    if (!formData.paymentTerms) return false
    return true
  })()

  // ---------------------------------------------------------------------------
  // Validation
  // ---------------------------------------------------------------------------

  const validateStep = (step: number): boolean => {
    const newErrors: FormErrors = {}

    if (step === 0) {
      if (!formData.senderOrgId) newErrors.senderOrgId = 'Select the sending organization'
      if (!formData.senderFacilityId) newErrors.senderFacilityId = 'Select the sending facility'
      if (!formData.receiverOrgId) newErrors.receiverOrgId = 'Select the receiving organization'
      if (!formData.receiverFacilityId) newErrors.receiverFacilityId = 'Select the receiving facility'
      if (!formData.market) newErrors.market = 'Select a market for this invoice'
      if (Object.keys(newErrors).length > 0) newErrors._step0 = 'Complete all required fields to continue.'
    }

    if (step === 1) {
      formData.items.forEach((item, i) => {
        if (!item.productName.trim()) newErrors[`item_${i}_productName`] = 'Product name is required'
        if (item.quantity <= 0) newErrors[`item_${i}_quantity`] = 'Enter a quantity greater than 0'
        if (item.unitPrice <= 0) newErrors[`item_${i}_unitPrice`] = 'Enter a unit price greater than 0'
      })
      if (Object.keys(newErrors).length > 0) newErrors.items = 'Fill in the required fields for each line item to continue.'
    }

    if (step === 2) {
      if (!formData.paymentTerms) newErrors.paymentTerms = 'Select payment terms for this invoice'
      if (Object.keys(newErrors).length > 0) newErrors._step2 = 'Complete all required fields to continue.'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  // ---------------------------------------------------------------------------
  // Navigation
  // ---------------------------------------------------------------------------

  const handleNext = () => {
    if (validateStep(activeStep)) {
      if (activeStep < STEPS.length - 1) {
        setActiveStep(activeStep + 1)
      }
    }
  }

  const handleBack = () => {
    if (activeStep > 0) {
      setActiveStep(activeStep - 1)
    }
  }

  const handleSubmit = () => {
    setShowConfirmDialog(true)
  }

  const handleConfirmSubmit = () => {
    setShowConfirmDialog(false)
    toast.success(`Invoice ${invoiceNumber} has been created and sent to ${receiverOrgName}.`)
    setTimeout(() => {
      window.location.href = '/invoices'
    }, 2000)
  }

  // ---------------------------------------------------------------------------
  // Shared styles
  // ---------------------------------------------------------------------------

  const fieldColumnStyle: React.CSSProperties = {
    display: 'flex',
    flexDirection: 'column',
    gap: spacing.md,
    position: 'relative',
    zIndex: 10,
  }

  const fieldGridStyle: React.CSSProperties = {
    display: 'grid',
    gridTemplateColumns: 'repeat(2, 1fr)',
    gap: spacing.lg,
  }

  const reviewSectionLabelStyle: React.CSSProperties = {
    fontFamily: fontFamilies.body,
    fontSize: typography.label.md.fontSize,
    fontWeight: fontWeights.semibold,
    color: colors.text.lowEmphasis.onLight,
    textTransform: 'uppercase' as const,
    letterSpacing: '0.5px',
    margin: `0 0 ${spacing.xs}`,
  }

  // ---------------------------------------------------------------------------
  // Step content array
  // ---------------------------------------------------------------------------

  const stepContent: React.ReactNode[] = [
    // Step 0: Recipient
    <div key="recipient" style={fieldColumnStyle}>
      {errors._step0 && (
        <Banner variant="error" dismissible={false}>
          {errors._step0}
        </Banner>
      )}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: spacing.md }}>
        <Select
          label="From Organization *"
          options={orgOptions}
          value={formData.senderOrgId}
          onChange={(val) => {
            updateField('senderOrgId', val)
            updateField('senderFacilityId', '')
          }}
          placeholder="Select organization"
          error={!!errors.senderOrgId}
          errorMessage={errors.senderOrgId}
          fullWidth
        />
        <Select
          label="From Facility *"
          options={senderFacilityOptions}
          value={formData.senderFacilityId}
          onChange={(val) => updateField('senderFacilityId', val)}
          placeholder={formData.senderOrgId ? 'Select facility' : 'Select organization first'}
          disabled={!formData.senderOrgId}
          error={!!errors.senderFacilityId}
          errorMessage={errors.senderFacilityId}
          fullWidth
        />
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: spacing.md }}>
        <Select
          label="To Organization *"
          options={orgOptions}
          value={formData.receiverOrgId}
          onChange={(val) => {
            updateField('receiverOrgId', val)
            updateField('receiverFacilityId', '')
          }}
          placeholder="Select organization"
          error={!!errors.receiverOrgId}
          errorMessage={errors.receiverOrgId}
          fullWidth
        />
        <Select
          label="To Facility *"
          options={receiverFacilityOptions}
          value={formData.receiverFacilityId}
          onChange={(val) => updateField('receiverFacilityId', val)}
          placeholder={formData.receiverOrgId ? 'Select facility' : 'Select organization first'}
          disabled={!formData.receiverOrgId}
          error={!!errors.receiverFacilityId}
          errorMessage={errors.receiverFacilityId}
          fullWidth
        />
      </div>

      <Select
        label="Market *"
        options={marketOptions}
        value={formData.market}
        onChange={(val) => updateField('market', val)}
        placeholder="Select market"
        error={!!errors.market}
        errorMessage={errors.market}
        fullWidth
      />
    </div>,

    // Step 1: Line Items
    <div key="line-items" style={fieldColumnStyle}>
      {errors.items && (
        <Banner variant="error" dismissible={false}>
          {errors.items}
        </Banner>
      )}

      {formData.items.map((item, index) => (
        <div
          key={index}
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: spacing.sm,
            padding: spacing.md,
            backgroundColor: colors.surface.light,
            border: `1px solid ${colors.border.lowEmphasis.onLight}`,
            borderRadius: borderRadiusSemantics.card,
          }}
        >
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}
          >
            <span
              style={{
                fontFamily: fontFamilies.body,
                fontSize: typography.label.md.fontSize,
                fontWeight: fontWeights.semibold,
                color: colors.text.highEmphasis.onLight,
              }}
            >
              Item {index + 1}
            </span>
            {formData.items.length > 1 && (
              <button
                type="button"
                onClick={() => removeLineItem(index)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  width: '28px',
                  height: '28px',
                  border: `1px solid ${colors.border.lowEmphasis.onLight}`,
                  borderRadius: borderRadiusSemantics.card,
                  backgroundColor: 'transparent',
                  cursor: 'pointer',
                  color: colors.text.lowEmphasis.onLight,
                  transition: `all ${transitionPresets.fast}`,
                }}
                aria-label={`Remove item ${index + 1}`}
              >
                <svg width={14} height={14} viewBox="0 0 16 16" fill="none" aria-hidden="true">
                  <path d="M12 4L4 12M4 4L12 12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </button>
            )}
          </div>

          <div style={fieldGridStyle}>
            <Input
              label="Product Name *"
              placeholder="e.g., Blue Dream Premium Flower"
              value={item.productName}
              onChange={(val) => updateLineItem(index, 'productName', val)}
              size="md"
              error={!!errors[`item_${index}_productName`]}
              errorMessage={errors[`item_${index}_productName`]}
            />
            <Input
              label="SKU"
              placeholder="e.g., PCE-FL-BD-001"
              value={item.sku}
              onChange={(val) => updateLineItem(index, 'sku', val)}
              size="md"
            />
          </div>

          <div style={fieldGridStyle}>
            <Select
              label="Category"
              options={categoryOptions}
              value={item.category}
              onChange={(val) => updateLineItem(index, 'category', val)}
              placeholder="Select category"
              fullWidth
            />
            <Input
              label="Package Tag"
              placeholder="e.g., 1A4060300000022000012345"
              value={item.packageTag}
              onChange={(val) => updateLineItem(index, 'packageTag', val)}
              size="md"
            />
          </div>

          <div style={fieldGridStyle}>
            <Input
              label="Quantity *"
              placeholder="0"
              value={item.quantity === 0 ? '' : String(item.quantity)}
              onChange={(val) => updateLineItem(index, 'quantity', Number(val) || 0)}
              size="md"
              type="number"
              error={!!errors[`item_${index}_quantity`]}
              errorMessage={errors[`item_${index}_quantity`]}
            />
            <Input
              label="Unit Price *"
              placeholder="0.00"
              value={item.unitPrice === 0 ? '' : String(item.unitPrice)}
              onChange={(val) => updateLineItem(index, 'unitPrice', Number(val) || 0)}
              size="md"
              type="number"
              error={!!errors[`item_${index}_unitPrice`]}
              errorMessage={errors[`item_${index}_unitPrice`]}
            />
          </div>

          {item.quantity > 0 && item.unitPrice > 0 && (
            <div
              style={{
                display: 'flex',
                justifyContent: 'flex-end',
                fontFamily: fontFamilies.body,
                fontSize: typography.body.sm.fontSize,
                fontWeight: fontWeights.medium,
                color: colors.text.highEmphasis.onLight,
              }}
            >
              Line total: {formatCurrency(item.quantity * item.unitPrice)}
            </div>
          )}
        </div>
      ))}

      <div style={{ display: 'flex', justifyContent: 'flex-start' }}>
        <Button emphasis="low" size="md" onClick={addLineItem}>
          + Add Line Item
        </Button>
      </div>

    </div>,

    // Step 2: Payment Terms
    <div key="terms" style={fieldColumnStyle}>
      {errors._step2 && (
        <Banner variant="error" dismissible={false}>
          {errors._step2}
        </Banner>
      )}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: spacing.md }}>
        <Select
          label="Payment Terms *"
          options={formPaymentTermsOptions}
          value={formData.paymentTerms}
          onChange={(val) => updateField('paymentTerms', val)}
          placeholder="Select payment terms"
          error={!!errors.paymentTerms}
          errorMessage={errors.paymentTerms}
          fullWidth
        />
        <Input
          label="Tax Rate (%)"
          placeholder="8.5"
          value={String(formData.taxRate)}
          onChange={(val) => updateField('taxRate', Number(val) || 0)}
          size="md"
          type="number"
          fullWidth
        />
      </div>

      <Input
        label="Manifest Number"
        placeholder="e.g., 0000001234 — transfer manifest reference"
        value={formData.manifestNumber}
        onChange={(val) => updateField('manifestNumber', val)}
        size="md"
        fullWidth
      />

      <Textarea
        label="Notes"
        placeholder="Additional notes for this invoice..."
        value={formData.notes}
        onChange={(e) => updateField('notes', e.target.value)}
        rows={4}
        fullWidth
      />
    </div>,
  ]

  // ---------------------------------------------------------------------------
  // Render
  // ---------------------------------------------------------------------------

  return (
    <div>
      <FullScreenModal
        open={true}
        onClose={() => {
          window.location.href = '/invoices'
        }}
        title={formData.receiverOrgId ? `Invoice — ${getOrgName(formData.receiverOrgId)}` : 'New Invoice'}
        columns={2}
      >
        {/* Left panel: Stepper */}
        <FullScreenModalPanel>
          <StepperZIndexFix activeStep={activeStep}>
            <LinearStepper
              steps={STEPS}
              activeStep={activeStep}
              stepContent={stepContent.map((content, i) => i === activeStep ? content : null)}
              onStepChange={setActiveStep}
              primaryButtonText={activeStep < 2 ? 'Next' : undefined}
              secondaryButtonText={activeStep > 0 && activeStep < 2 ? 'Back' : undefined}
              onPrimaryClick={activeStep < 2 ? handleNext : undefined}
              onSecondaryClick={activeStep > 0 && activeStep < 2 ? handleBack : undefined}
              clickable
            />
          </StepperZIndexFix>

          {/* Action buttons — only visible when all required fields are filled */}
          {allRequiredFieldsFilled && (
            <div style={{ display: 'flex', gap: spacing.sm, marginTop: spacing.xl }}>
              <Button emphasis="low" size="md" onClick={handleBack}>
                Back
              </Button>
              <Button
                emphasis="mid"
                size="md"
                onClick={() => {
                  toast.success('Invoice draft saved.')
                  setTimeout(() => {
                    window.location.href = '/invoices'
                  }, 1500)
                }}
              >
                Save Draft
              </Button>
              <Button emphasis="high" size="md" onClick={handleSubmit}>
                Save &amp; Send
              </Button>
            </div>
          )}
        </FullScreenModalPanel>

        {/* Right panel: Live Preview */}
        <FullScreenModalPanel background="muted" border="left">
          <div style={{ position: 'sticky', top: 0, maxHeight: 'calc(100vh - 64px)', overflowY: 'auto' }}>
            <InvoicePreview
              formData={formData}
              subtotal={subtotal}
              taxAmount={taxAmount}
              total={total}
              getOrgName={getOrgName}
              getFacilityName={getFacilityName}
              getMarketLabel={getMarketLabel}
              getTermsLabel={getTermsLabel}
              getCategoryLabel={getCategoryLabel}
            />
          </div>
        </FullScreenModalPanel>
      </FullScreenModal>

      {/* Confirm submission dialog */}
      <ConfirmDialog
        open={showConfirmDialog}
        title="Create this invoice?"
        description={`This will send ${invoiceNumber} to ${receiverOrgName}. The receiving organization will be notified and a payment request will be initiated.`}
        confirmLabel="Create Invoice"
        cancelLabel="Go Back"
        variant="info"
        onConfirm={handleConfirmSubmit}
        onCancel={() => setShowConfirmDialog(false)}
      />

      {/* Toast */}
      {toast.toasts.map((t) => (
        <Toast
          key={t.id}
          variant={t.variant}
          message={t.message}
          isVisible
          onClose={() => toast.dismiss(t.id)}
        />
      ))}

      <PrototypeToolbar
        viewState={viewState}
        onViewStateChange={setViewState}
        useCases={USE_CASES}
      />
    </div>
  )
}

// =============================================================================
// REVIEW FIELD HELPER
// =============================================================================

function ReviewField({ label, value }: { label: string; value: string }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: spacing['2xs'] }}>
      <span
        style={{
          fontFamily: fontFamilies.body,
          fontSize: typography.label.sm.fontSize,
          fontWeight: fontWeights.medium,
          color: colors.text.lowEmphasis.onLight,
        }}
      >
        {label}
      </span>
      <span
        style={{
          fontFamily: fontFamilies.body,
          fontSize: typography.body.md.fontSize,
          color: colors.text.highEmphasis.onLight,
        }}
      >
        {value}
      </span>
    </div>
  )
}
