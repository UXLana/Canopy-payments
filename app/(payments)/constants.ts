import type { UseCase } from '@/components'
import type { BadgeProps } from '@/components/Badge/Badge'

export const USE_CASES: UseCase[] = [
  { label: 'UC1 — Single-facility retailer', description: 'Sarah: processes transactions at one dispensary in Colorado' },
  { label: 'UC2 — Financial controller', description: 'Rachel: read-only across all brands, write access in Payments only' },
  { label: 'UC3 — Multi-org consultant', description: 'Tom: supply chain across 2 orgs, write access in Payments' },
]

export const INVOICE_STATUS_MAP: Record<string, { color: BadgeProps['color']; variant: BadgeProps['variant'] }> = {
  paid: { color: 'success', variant: 'subtle' },
  sent: { color: 'info', variant: 'subtle' },
  overdue: { color: 'error', variant: 'subtle' },
  draft: { color: 'neutral', variant: 'subtle' },
  partial: { color: 'warning', variant: 'subtle' },
  viewed: { color: 'info', variant: 'subtle' },
  voided: { color: 'neutral', variant: 'subtle' },
}

export const TRANSACTION_TYPE_MAP: Record<string, { color: BadgeProps['color']; variant: BadgeProps['variant'] }> = {
  payment: { color: 'success', variant: 'subtle' },
  refund: { color: 'warning', variant: 'subtle' },
  adjustment: { color: 'info', variant: 'subtle' },
}

export const TRANSACTION_STATUS_MAP: Record<string, { color: BadgeProps['color']; variant: BadgeProps['variant'] }> = {
  completed: { color: 'success', variant: 'subtle' },
  pending: { color: 'warning', variant: 'subtle' },
  failed: { color: 'error', variant: 'subtle' },
  reversed: { color: 'neutral', variant: 'subtle' },
}
