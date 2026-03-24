'use client'

import React, { useMemo, useState, useEffect } from 'react'
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts'
import {
  colors,
  dataVizColors,
  spacing,
  typography,
  fontFamilies,
  fontWeights,
  borderRadiusSemantics,
  shadowSemantics,
} from '@/styles/design-tokens'
import type { MonthlyFinancial, Invoice, Transaction } from '../data'

// =============================================================================
// CSS VARIABLE RESOLVER
// =============================================================================
// Recharts sets fill/stroke as SVG attributes which don't resolve CSS var().
// This hook resolves CSS custom properties to their computed hex values.

function resolveVar(value: string): string {
  if (typeof window === 'undefined') return value
  const match = value.match(/var\((--[^)]+)\)/)
  if (!match) return value
  return getComputedStyle(document.documentElement).getPropertyValue(match[1]).trim() || value
}

function useResolvedColors<T extends Record<string, string>>(vars: T): T {
  const [resolved, setResolved] = useState<T>(vars)
  useEffect(() => {
    const r: Record<string, string> = {}
    for (const [k, v] of Object.entries(vars)) {
      r[k] = resolveVar(v)
    }
    setResolved(r as T)
  }, []) // eslint-disable-line react-hooks/exhaustive-deps
  return resolved
}

// =============================================================================
// TYPES
// =============================================================================

interface CashFlowChartProps {
  data: MonthlyFinancial[]
  summary: {
    totalIncome: number
    totalExpenses: number
    netCashFlow: number
    avgMonthlyIncome: number
    avgMonthlyExpenses: number
    incomeChange: number
    expenseChange: number
  }
  invoices: Invoice[]
  transactions: Transaction[]
}

// =============================================================================
// DATA VIZ SERIES MAPPING
// =============================================================================

const SERIES = {
  income: dataVizColors['05'],
  expenses: dataVizColors['09'],
  net: dataVizColors['06'],
  border: dataVizColors.border,
} as const

// Status colors for the donut chart
const STATUS_COLORS: Record<string, string> = {
  paid: dataVizColors['05'],
  sent: dataVizColors['03'],
  overdue: dataVizColors['09'],
  partial: dataVizColors['07'],
  draft: dataVizColors['12'],
  viewed: dataVizColors['04'],
  voided: dataVizColors['14'],
}

// Method colors for the payment method chart
const METHOD_COLORS: Record<string, string> = {
  ach: dataVizColors['05'],
  wire: dataVizColors['03'],
  check: dataVizColors['09'],
  cash: dataVizColors['07'],
}

// =============================================================================
// HELPERS
// =============================================================================

const formatCurrency = (amount: number) =>
  new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(amount)

const formatCompact = (amount: number) => {
  if (amount >= 1000) return `$${(amount / 1000).toFixed(0)}k`
  return `$${amount}`
}

// =============================================================================
// SHARED STYLES
// =============================================================================

const chartCardStyle: React.CSSProperties = {
  backgroundColor: colors.surface.light,
  borderRadius: borderRadiusSemantics.card,
  border: `1px solid ${colors.border.lowEmphasis.onLight}`,
  padding: spacing.lg,
  display: 'flex',
  flexDirection: 'column',
  gap: spacing.md,
  minHeight: '360px',
}

const chartTitleStyle: React.CSSProperties = {
  margin: 0,
  fontFamily: fontFamilies.display,
  fontSize: typography.label.md.fontSize,
  fontWeight: fontWeights.semibold,
  color: colors.text.highEmphasis.onLight,
}

const chartSubtitleStyle: React.CSSProperties = {
  margin: 0,
  fontFamily: fontFamilies.body,
  fontSize: typography.body.xs.fontSize,
  color: colors.text.lowEmphasis.onLight,
}

const axisTickStyle = {
  fontFamily: fontFamilies.body,
  fontSize: 11,
  fill: colors.text.lowEmphasis.onLight,
}

const legendStyle: React.CSSProperties = {
  fontFamily: fontFamilies.body,
  fontSize: typography.body.sm.fontSize,
  paddingTop: spacing.sm,
}

// Forces legend text to use lowEmphasis instead of series color
const legendFormatter = (value: string) => (
  <span style={{ color: colors.text.lowEmphasis.onLight }}>{value}</span>
)

// =============================================================================
// SHARED CUSTOM TOOLTIP
// =============================================================================

function CustomTooltip({ active, payload, label, formatter }: {
  active?: boolean
  payload?: Array<{ name: string; value: number; color: string }>
  label?: string
  formatter?: (value: number) => string
}) {
  if (!active || !payload?.length) return null
  const fmt = formatter || formatCurrency
  return (
    <div
      style={{
        padding: spacing.sm,
        backgroundColor: colors.surface.light,
        borderRadius: borderRadiusSemantics.card,
        boxShadow: shadowSemantics.dropdown,
        border: `1px solid ${colors.border.lowEmphasis.onLight}`,
      }}
    >
      {label && (
        <div
          style={{
            fontFamily: fontFamilies.body,
            fontSize: typography.label.sm.fontSize,
            fontWeight: fontWeights.semibold,
            color: colors.text.highEmphasis.onLight,
            marginBottom: spacing['2xs'],
          }}
        >
          {label}
        </div>
      )}
      {payload.map((entry, i) => (
        <div
          key={i}
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: spacing.lg,
            padding: `${spacing['2xs']} 0`,
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: spacing['2xs'] }}>
            <div
              style={{
                width: '8px',
                height: '8px',
                borderRadius: '50%',
                backgroundColor: entry.color,
              }}
            />
            <span
              style={{
                fontFamily: fontFamilies.body,
                fontSize: typography.body.sm.fontSize,
                color: colors.text.lowEmphasis.onLight,
              }}
            >
              {entry.name}
            </span>
          </div>
          <span
            style={{
              fontFamily: fontFamilies.display,
              fontSize: typography.body.sm.fontSize,
              fontWeight: fontWeights.bold,
              color: colors.text.highEmphasis.onLight,
            }}
          >
            {fmt(entry.value)}
          </span>
        </div>
      ))}
    </div>
  )
}

// =============================================================================
// SUMMARY CARD
// =============================================================================

function SummaryCard({
  label,
  value,
  icon,
  iconBg,
  iconColor,
}: {
  label: string
  value: string
  icon: React.ReactNode
  iconBg: string
  iconColor: string
}) {
  return (
    <div
      style={{
        flex: 1,
        minWidth: '140px',
        padding: spacing.md,
        backgroundColor: colors.surface.light,
        border: `1px solid ${colors.border.lowEmphasis.onLight}`,
        borderRadius: borderRadiusSemantics.card,
        display: 'flex',
        alignItems: 'flex-start',
        gap: spacing.md,
      }}
    >
      <div
        style={{
          width: '40px',
          height: '40px',
          borderRadius: borderRadiusSemantics.card,
          backgroundColor: iconBg,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: iconColor,
          flexShrink: 0,
        }}
        aria-hidden="true"
      >
        {icon}
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: spacing['2xs'], minWidth: 0 }}>
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
            fontFamily: fontFamilies.display,
            fontSize: typography.heading.h3.fontSize,
            fontWeight: fontWeights.bold,
            lineHeight: '1',
            color: colors.text.highEmphasis.onLight,
          }}
        >
          {value}
        </span>
      </div>
    </div>
  )
}

// =============================================================================
// 1. CASH FLOW AREA CHART
// =============================================================================

function CashFlowAreaChart({ data }: { data: MonthlyFinancial[] }) {
  const c = useResolvedColors({
    income: SERIES.income,
    expenses: SERIES.expenses,
    grid: colors.border.lowEmphasis.onLight,
    text: colors.text.lowEmphasis.onLight,
  })

  return (
    <div style={chartCardStyle} role="figure" aria-label="Cash flow area chart showing income vs expenses over last 9 months">
      <div>
        <h4 style={chartTitleStyle}>Cash Flow Over Time</h4>
        <p style={chartSubtitleStyle}>Income vs expenses — last 9 months</p>
      </div>
      <ResponsiveContainer width="100%" height={280}>
        <AreaChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
          <defs>
            <linearGradient id="incomeGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={c.income} stopOpacity={0.25} />
              <stop offset="100%" stopColor={c.income} stopOpacity={0.02} />
            </linearGradient>
            <linearGradient id="expenseGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={c.expenses} stopOpacity={0.18} />
              <stop offset="100%" stopColor={c.expenses} stopOpacity={0.02} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="4 4" stroke={c.grid} vertical={false} />
          <XAxis
            dataKey="month"
            tick={{ fontFamily: fontFamilies.body, fontSize: 11, fill: c.text }}
            axisLine={{ stroke: c.grid }}
            tickLine={false}
          />
          <YAxis
            tickFormatter={formatCompact}
            tick={{ fontFamily: fontFamilies.body, fontSize: 11, fill: c.text }}
            axisLine={false}
            tickLine={false}
            width={55}
          />
          <Tooltip content={<CustomTooltip />} />
          <Legend iconType="square" wrapperStyle={legendStyle} formatter={legendFormatter} />
          <Area
            type="monotone"
            dataKey="income"
            name="Income"
            stroke={c.income}
            strokeWidth={2}
            fill="url(#incomeGrad)"
          />
          <Area
            type="monotone"
            dataKey="expenses"
            name="Expenses"
            stroke={c.expenses}
            strokeWidth={1.5}
            strokeDasharray="6 4"
            fill="url(#expenseGrad)"
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  )
}

// =============================================================================
// 2. MONTHLY PROFIT BAR CHART
// =============================================================================

function MonthlyProfitChart({ data }: { data: MonthlyFinancial[] }) {
  const c = useResolvedColors({
    income: SERIES.income,
    expenses: SERIES.expenses,
    net: SERIES.net,
    grid: colors.border.lowEmphasis.onLight,
    text: colors.text.lowEmphasis.onLight,
  })

  const barData = data.map((d) => ({
    month: d.month,
    income: d.income,
    expenses: d.expenses,
    net: d.income - d.expenses,
  }))

  return (
    <div style={chartCardStyle} role="figure" aria-label="Monthly net profit bar chart showing income, expenses, and net margin">
      <div>
        <h4 style={chartTitleStyle}>Monthly Net Profit</h4>
        <p style={chartSubtitleStyle}>Income, expenses, and net margin by month</p>
      </div>
      <ResponsiveContainer width="100%" height={280}>
        <BarChart data={barData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
          <CartesianGrid strokeDasharray="4 4" stroke={c.grid} vertical={false} />
          <XAxis
            dataKey="month"
            tick={{ fontFamily: fontFamilies.body, fontSize: 11, fill: c.text }}
            axisLine={{ stroke: c.grid }}
            tickLine={false}
          />
          <YAxis
            tickFormatter={formatCompact}
            tick={{ fontFamily: fontFamilies.body, fontSize: 11, fill: c.text }}
            axisLine={false}
            tickLine={false}
            width={55}
          />
          <Tooltip content={<CustomTooltip />} />
          <Legend iconType="square" wrapperStyle={legendStyle} formatter={legendFormatter} />
          <Bar dataKey="income" name="Income" fill={c.income} radius={[3, 3, 0, 0]} />
          <Bar dataKey="expenses" name="Expenses" fill={c.expenses} radius={[3, 3, 0, 0]} />
          <Bar dataKey="net" name="Net Profit" fill={c.net} radius={[3, 3, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}

// =============================================================================
// 3. INVOICE STATUS DONUT CHART
// =============================================================================

function InvoiceStatusChart({ invoices }: { invoices: Invoice[] }) {
  const resolvedStatusColors = useResolvedColors(STATUS_COLORS)

  const statusData = useMemo(() => {
    const grouped: Record<string, { count: number; total: number }> = {}
    if (!invoices) return []
    for (const inv of invoices) {
      if (!grouped[inv.status]) grouped[inv.status] = { count: 0, total: 0 }
      grouped[inv.status].count++
      grouped[inv.status].total += inv.total
    }
    return Object.entries(grouped)
      .map(([status, data]) => ({
        name: status.charAt(0).toUpperCase() + status.slice(1),
        value: data.count,
        total: data.total,
        status,
      }))
      .sort((a, b) => b.value - a.value)
  }, [invoices])

  const totalInvoices = invoices.length
  const fallbackColor = resolveVar(dataVizColors['12'])

  return (
    <div style={chartCardStyle} role="figure" aria-label={`Invoice status donut chart — ${totalInvoices} invoices across all statuses`}>
      <div>
        <h4 style={chartTitleStyle}>Invoice Status</h4>
        <p style={chartSubtitleStyle}>{totalInvoices} invoices across all statuses</p>
      </div>
      <ResponsiveContainer width="100%" height={280}>
        <PieChart>
          <Pie
            data={statusData}
            cx="50%"
            cy="50%"
            innerRadius={65}
            outerRadius={100}
            paddingAngle={3}
            dataKey="value"
            strokeWidth={0}
          >
            {statusData.map((entry) => (
              <Cell
                key={entry.status}
                fill={resolvedStatusColors[entry.status] || fallbackColor}
              />
            ))}
          </Pie>
          <Tooltip
            content={({ active, payload }) => {
              if (!active || !payload?.length) return null
              const d = payload[0].payload
              return (
                <div
                  style={{
                    padding: spacing.sm,
                    backgroundColor: colors.surface.light,
                    borderRadius: borderRadiusSemantics.card,
                    boxShadow: shadowSemantics.dropdown,
                    border: `1px solid ${colors.border.lowEmphasis.onLight}`,
                  }}
                >
                  <div
                    style={{
                      fontFamily: fontFamilies.body,
                      fontSize: typography.label.sm.fontSize,
                      fontWeight: fontWeights.semibold,
                      color: colors.text.highEmphasis.onLight,
                      marginBottom: spacing['2xs'],
                    }}
                  >
                    {d.name}
                  </div>
                  <div style={{ fontFamily: fontFamilies.body, fontSize: typography.body.sm.fontSize, color: colors.text.lowEmphasis.onLight }}>
                    {d.value} invoice{d.value !== 1 ? 's' : ''} — {formatCurrency(d.total)}
                  </div>
                </div>
              )
            }}
          />
          <Legend iconType="circle" wrapperStyle={legendStyle} formatter={legendFormatter} />
        </PieChart>
      </ResponsiveContainer>
    </div>
  )
}

// =============================================================================
// 4. PAYMENT METHOD BAR CHART (HORIZONTAL)
// =============================================================================

function PaymentMethodChart({ transactions }: { transactions: Transaction[] }) {
  const resolvedMethodColors = useResolvedColors(METHOD_COLORS)
  const c = useResolvedColors({
    grid: colors.border.lowEmphasis.onLight,
    text: colors.text.lowEmphasis.onLight,
  })

  const methodData = useMemo(() => {
    const grouped: Record<string, { count: number; total: number }> = {}
    if (!transactions) return []
    for (const txn of transactions) {
      if (txn.type !== 'payment') continue
      if (!grouped[txn.method]) grouped[txn.method] = { count: 0, total: 0 }
      grouped[txn.method].count++
      grouped[txn.method].total += txn.amount
    }
    return Object.entries(grouped)
      .map(([method, data]) => ({
        name: method.toUpperCase(),
        count: data.count,
        total: data.total,
        method,
      }))
      .sort((a, b) => b.total - a.total)
  }, [transactions])

  const fallbackColor = resolveVar(dataVizColors['12'])

  return (
    <div style={chartCardStyle} role="figure" aria-label="Payment methods horizontal bar chart — transaction volume by method">
      <div>
        <h4 style={chartTitleStyle}>Payment Methods</h4>
        <p style={chartSubtitleStyle}>Transaction volume by payment method</p>
      </div>
      <ResponsiveContainer width="100%" height={280}>
        <BarChart data={methodData} layout="vertical" margin={{ top: 10, right: 10, left: 10, bottom: 0 }}>
          <CartesianGrid strokeDasharray="4 4" stroke={c.grid} horizontal={false} />
          <XAxis
            type="number"
            tickFormatter={formatCompact}
            tick={{ fontFamily: fontFamilies.body, fontSize: 11, fill: c.text }}
            axisLine={{ stroke: c.grid }}
            tickLine={false}
          />
          <YAxis
            type="category"
            dataKey="name"
            tick={{ fontFamily: fontFamilies.body, fontSize: 11, fill: c.text }}
            axisLine={false}
            tickLine={false}
            width={50}
          />
          <Tooltip
            content={({ active, payload }) => {
              if (!active || !payload?.length) return null
              const d = payload[0].payload
              return (
                <div
                  style={{
                    padding: spacing.sm,
                    backgroundColor: colors.surface.light,
                    borderRadius: borderRadiusSemantics.card,
                    boxShadow: shadowSemantics.dropdown,
                    border: `1px solid ${colors.border.lowEmphasis.onLight}`,
                  }}
                >
                  <div
                    style={{
                      fontFamily: fontFamilies.body,
                      fontSize: typography.label.sm.fontSize,
                      fontWeight: fontWeights.semibold,
                      color: colors.text.highEmphasis.onLight,
                      marginBottom: spacing['2xs'],
                    }}
                  >
                    {d.name}
                  </div>
                  <div style={{ fontFamily: fontFamilies.body, fontSize: typography.body.sm.fontSize, color: colors.text.lowEmphasis.onLight }}>
                    {d.count} payment{d.count !== 1 ? 's' : ''} — {formatCurrency(d.total)}
                  </div>
                </div>
              )
            }}
          />
          <Bar dataKey="total" name="Total Volume" radius={[0, 4, 4, 0]}>
            {methodData.map((entry) => (
              <Cell
                key={entry.method}
                fill={resolvedMethodColors[entry.method] || fallbackColor}
              />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}

// =============================================================================
// MAIN COMPONENT
// =============================================================================

export function CashFlowChart({ data, summary, invoices, transactions }: CashFlowChartProps) {
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: spacing.lg,
      }}
    >
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div>
          <h3
            style={{
              margin: 0,
              fontFamily: fontFamilies.display,
              fontSize: typography.heading.h5.fontSize,
              fontWeight: fontWeights.bold,
              color: colors.text.highEmphasis.onLight,
            }}
          >
            Cash Flow Overview
          </h3>
          <p
            style={{
              margin: `${spacing['2xs']} 0 0`,
              fontFamily: fontFamilies.body,
              fontSize: typography.body.sm.fontSize,
              color: colors.text.lowEmphasis.onLight,
            }}
          >
            Income vs expenses over time
          </p>
        </div>
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: spacing.xs,
            padding: `${spacing.xs} ${spacing.md}`,
            borderRadius: borderRadiusSemantics.input,
            border: `1px solid ${colors.border.midEmphasis.onLight}`,
            fontFamily: fontFamilies.body,
            fontSize: typography.body.sm.fontSize,
            fontWeight: fontWeights.medium,
            color: colors.text.highEmphasis.onLight,
            cursor: 'pointer',
          }}
        >
          Last 9 Months
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <polyline points="6 9 12 15 18 9" />
          </svg>
        </div>
      </div>

      {/* Summary cards */}
      <div
        role="region"
        aria-label="Cash flow summary"
        style={{ display: 'flex', gap: spacing.sm, flexWrap: 'wrap' }}
      >
        <SummaryCard
          label="Total Income"
          value={formatCurrency(summary.totalIncome)}
          iconBg={colors.badge.successLight}
          iconColor={colors.badge.success}
          icon={<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="23 6 13.5 15.5 8.5 10.5 1 18" /><polyline points="17 6 23 6 23 12" /></svg>}
        />
        <SummaryCard
          label="Total Expenses"
          value={formatCurrency(summary.totalExpenses)}
          iconBg={colors.badge.successLight}
          iconColor={colors.badge.success}
          icon={<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="23 6 13.5 15.5 8.5 10.5 1 18" /><polyline points="17 6 23 6 23 12" /></svg>}
        />
        <SummaryCard
          label="Net Cash Flow"
          value={formatCurrency(summary.netCashFlow)}
          iconBg={colors.badge.infoLight}
          iconColor={colors.badge.info}
          icon={<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="1" x2="12" y2="23" /><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" /></svg>}
        />
        <SummaryCard
          label="Avg Monthly Income"
          value={formatCurrency(summary.avgMonthlyIncome)}
          iconBg={colors.badge.successLight}
          iconColor={colors.badge.success}
          icon={<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="20" x2="18" y2="10" /><line x1="12" y1="20" x2="12" y2="4" /><line x1="6" y1="20" x2="6" y2="14" /></svg>}
        />
        <SummaryCard
          label="Avg Monthly Expenses"
          value={formatCurrency(summary.avgMonthlyExpenses)}
          iconBg={colors.badge.yellowLight}
          iconColor={colors.badge.warning}
          icon={<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" /></svg>}
        />
      </div>

      {/* Charts 2×2 grid */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(2, 1fr)',
          gap: spacing.lg,
        }}
      >
        <CashFlowAreaChart data={data} />
        <MonthlyProfitChart data={data} />
        <InvoiceStatusChart invoices={invoices} />
        <PaymentMethodChart transactions={transactions} />
      </div>
    </div>
  )
}
