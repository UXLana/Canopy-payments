'use client'

import React, { useState } from 'react'
import { Header, CanopyLogo, LeftNav, Avatar } from '@/components'
import type { LeftNavSection } from '@/components/LeftNav'
import {
  colors,
  spacing,
  fontFamilies,
  fontWeights,
  typography,
  breakpoints,
  borderRadius,
  borderRadiusSemantics,
  shadowSemantics,
  transitionPresets,
  zIndex,
} from '@/styles/design-tokens'
import { organizations } from './data'

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

// Inline nav icons
const GridIcon = () => <svg width={18} height={18} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/></svg>
const DollarNavIcon = () => <svg width={18} height={18} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>
const TagNavIcon = () => <svg width={18} height={18} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z"/><line x1="7" y1="7" x2="7.01" y2="7"/></svg>
const HomeNavIcon = () => <svg width={18} height={18} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>
const CartNavIcon = () => <svg width={18} height={18} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/></svg>
const FileNavIcon = () => <svg width={18} height={18} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/></svg>
const ArrowsNavIcon = () => <svg width={18} height={18} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="17 1 21 5 17 9"/><path d="M3 11V9a4 4 0 0 1 4-4h14"/><polyline points="7 23 3 19 7 15"/><path d="M21 13v2a4 4 0 0 1-4 4H3"/></svg>

const NAV_SECTIONS: LeftNavSection[] = [
  {
    id: 'payments-nav',
    items: [
      { id: 'home', label: 'Home', href: '/prototypes/canopy-payments/dashboard', icon: <HomeNavIcon /> },
      { id: 'purchases', label: 'Purchases', href: '/prototypes/canopy-payments/purchases', icon: <CartNavIcon /> },
      { id: 'invoices', label: 'Invoices', href: '/prototypes/canopy-payments/invoices', icon: <FileNavIcon /> },
      { id: 'transactions', label: 'Transactions', href: '/prototypes/canopy-payments/transactions', icon: <ArrowsNavIcon /> },
    ],
  },
]

function PaymentsNav({ children }: { children: React.ReactNode }) {
  const [navCollapsed, setNavCollapsed] = useState(true)
  const [orgDropdownOpen, setOrgDropdownOpen] = useState(false)
  const [isDarkMode, setIsDarkMode] = useState(false)
  const isMobile = useMediaQuery(`(max-width: ${parseInt(breakpoints.md) - 1}px)`)

  const activeOrg = organizations[0]

  const [activeNavId, setActiveNavId] = React.useState('home')
  React.useEffect(() => {
    const path = window.location.pathname
    if (path.includes('/purchases')) setActiveNavId('purchases')
    else if (path.includes('/invoices')) setActiveNavId('invoices')
    else if (path.includes('/transactions')) setActiveNavId('transactions')
    else setActiveNavId('home')
  }, [])

  return (
    <div style={{ minHeight: '100vh', backgroundColor: colors.surface.lightDarker }}>
      {/* Full-width Header — same pattern as Canopy Registry */}
      <Header
        userAvatar={<Avatar name="Jane Doe" size="xs" />}
        userName="Jane Doe"
        userOrg={activeOrg.type}
        onMenuToggle={() => setNavCollapsed(!navCollapsed)}
        searchPlaceholder="Search payments, invoices, or organizations..."
        showSearch={true}
        onThemeToggle={() => setIsDarkMode(!isDarkMode)}
        isDarkMode={isDarkMode}
        brandLogo={<CanopyLogo size="sm" showText={false} />}
        brandName="Canopy"
        sticky
      />

      {/* Org switcher dropdown — same pattern as Registry brand switcher */}
      {orgDropdownOpen && (
        <>
          <div
            onClick={() => setOrgDropdownOpen(false)}
            aria-hidden="true"
            style={{
              position: 'fixed',
              inset: 0,
              zIndex: zIndex.dropdown - 1,
            }}
          />
          <div
            role="menu"
            aria-label="Switch organization"
            style={{
              position: 'fixed',
              top: '64px',
              right: spacing.md,
              width: '320px',
              backgroundColor: colors.surface.light,
              border: `1px solid ${colors.border.lowEmphasis.onLight}`,
              borderRadius: borderRadiusSemantics.card,
              boxShadow: shadowSemantics.dropdown,
              zIndex: zIndex.dropdown,
              padding: spacing['2xs'],
            }}
          >
            <div
              style={{
                padding: `${spacing.xs} ${spacing.sm}`,
                fontFamily: fontFamilies.body,
                fontSize: typography.label.sm.fontSize,
                fontWeight: fontWeights.medium,
                color: colors.text.lowEmphasis.onLight,
                textTransform: 'uppercase' as const,
                letterSpacing: '0.5px',
              }}
            >
              Switch organization
            </div>
            {organizations.map((org) => (
              <button
                key={org.id}
                role="menuitem"
                onClick={() => setOrgDropdownOpen(false)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: spacing.sm,
                  width: '100%',
                  padding: `${spacing.xs} ${spacing.sm}`,
                  border: 'none',
                  backgroundColor: org.id === activeOrg.id ? colors.selectedHighlight : 'transparent',
                  borderRadius: borderRadiusSemantics.card,
                  cursor: 'pointer',
                  textAlign: 'left',
                  fontFamily: fontFamilies.body,
                  transition: `background-color ${transitionPresets.fast}`,
                }}
                onMouseEnter={(e) => {
                  if (org.id !== activeOrg.id) e.currentTarget.style.backgroundColor = colors.hover.onLight
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor =
                    org.id === activeOrg.id ? colors.selectedHighlight : 'transparent'
                }}
              >
                <span
                  aria-hidden="true"
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    width: '36px',
                    height: '36px',
                    borderRadius: borderRadius.lg,
                    backgroundColor: colors.brand.default,
                    color: colors.text.highEmphasis.onDark,
                    fontFamily: fontFamilies.body,
                    fontSize: '13px',
                    fontWeight: 600,
                    flexShrink: 0,
                  }}
                >
                  {org.logoInitials}
                </span>
                <div style={{ display: 'flex', flexDirection: 'column', minWidth: 0 }}>
                  <span
                    style={{
                      fontSize: typography.body.sm.fontSize,
                      fontWeight: fontWeights.medium,
                      color: colors.text.highEmphasis.onLight,
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      whiteSpace: 'nowrap',
                    }}
                  >
                    {org.name}
                  </span>
                  <span
                    style={{
                      fontSize: typography.body.xs.fontSize,
                      color: colors.text.lowEmphasis.onLight,
                    }}
                  >
                    {org.type}
                  </span>
                </div>
                {org.id === activeOrg.id && (
                  <svg
                    width={16}
                    height={16}
                    viewBox="0 0 16 16"
                    fill="none"
                    aria-hidden="true"
                    style={{ marginLeft: 'auto', flexShrink: 0 }}
                  >
                    <path
                      d="M13.5 4.5L6 12L2.5 8.5"
                      stroke={colors.brand.default}
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                )}
              </button>
            ))}
          </div>
        </>
      )}

      {/* Body: LeftNav + Content */}
      <div style={{ display: 'flex', minHeight: 'calc(100vh - 64px)' }}>
        {/* Left Nav — under header, sticky full height */}
        {!isMobile && (
          <div style={{ position: 'sticky', top: '64px', height: 'calc(100vh - 64px)', flexShrink: 0, display: 'flex' }}>
            <LeftNav
              sections={NAV_SECTIONS}
              activeItemId={activeNavId}
              collapsed={navCollapsed}
              onCollapseChange={setNavCollapsed}
              showCollapseToggle
              variant="flat"
              style={{ height: '100%' }}
              onItemClick={(item) => {
                if (!item.disabled && item.href !== '#') {
                  window.location.href = item.href
                }
              }}
            />
          </div>
        )}

        {/* Main content area */}
        <div style={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column' }}>
          {/* Page content */}
          <main style={{ padding: `${spacing['4xl']} ${isMobile ? spacing.md : spacing['5xl']}`, flex: 1, maxWidth: '1600px', margin: '0 auto', width: '100%' }}>
            {children}
          </main>
        </div>
      </div>
    </div>
  )
}

export default function CanopyPaymentsLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <PaymentsNav>{children}</PaymentsNav>
}
