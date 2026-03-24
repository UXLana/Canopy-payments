'use client'

import React, { forwardRef, useState, useCallback, useEffect, useRef } from 'react'
import {
  fontFamilies,
  header,
  transitionPresets,
  breakpoints,
  zIndex,
  shadows,
  typography,
} from '../../styles/design-tokens'
import { useColors } from '../../styles/themes'
import { useMediaQuery, usePrefersReducedMotion } from '../../hooks'
import {
  IconMenu,
  IconGrid,
  IconSearch,
  IconBell,
  IconSun,
  IconMoon,
  IconChevronDown,
  IconX,
} from '../Icons'

// =============================================================================
// TYPES
// =============================================================================

export interface HeaderProps {
  /** Callback when menu/hamburger button is clicked */
  onMenuToggle?: () => void
  /** Callback when AppSwitcher grip icon is clicked */
  onAppSwitcherClick?: () => void
  /** Custom AppSwitcher dropdown overlay (rendered as a child of the grip button container) */
  appSwitcher?: React.ReactNode
  /** User avatar element (e.g. <Avatar name="Jane" size="xs" />) */
  userAvatar?: React.ReactNode
  /** User name displayed next to avatar (hidden on mobile) */
  userName?: string
  /** Organization name displayed below userName in smaller text (hidden on mobile) */
  userOrg?: string
  /** Callback when user avatar/name area is clicked */
  onUserClick?: () => void

  /** Search placeholder text */
  searchPlaceholder?: string
  /** Callback when search button is clicked (opens chat/search panel) */
  onSearchClick?: () => void
  /** Whether to show the search bar */
  showSearch?: boolean

  /** Callback when notifications bell is clicked */
  onNotificationsClick?: () => void
  /** Whether to show a notification badge dot */
  showNotificationBadge?: boolean
  /** Callback when theme toggle is clicked */
  onThemeToggle?: () => void
  /** Whether dark mode is active (controls sun/moon icon) */
  isDarkMode?: boolean
  /** Brand logo element displayed on the right */
  brandLogo?: React.ReactNode
  /** Brand name text displayed next to logo (hidden on mobile) */
  brandName?: string
  /** Additional right-side content slot */
  actions?: React.ReactNode

  /** Whether the header is sticky */
  sticky?: boolean
  /** Custom styles for the root element */
  style?: React.CSSProperties
  /** Custom class name */
  className?: string
}

// =============================================================================
// FOCUS TRAP HOOK (for mobile menu dialog)
// =============================================================================

function useFocusTrap(
  containerRef: React.RefObject<HTMLDivElement | null>,
  isActive: boolean,
  onClose: () => void,
  returnFocusRef?: React.RefObject<HTMLButtonElement | null>,
) {
  useEffect(() => {
    if (!isActive || !containerRef.current) return

    const container = containerRef.current
    const focusableSelector =
      'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])'

    const firstFocusable = container.querySelector<HTMLElement>(focusableSelector)
    firstFocusable?.focus()

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Tab') {
        const focusables = container.querySelectorAll<HTMLElement>(focusableSelector)
        if (focusables.length === 0) return
        const first = focusables[0]
        const last = focusables[focusables.length - 1]

        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault()
          last.focus()
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault()
          first.focus()
        }
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    return () => {
      document.removeEventListener('keydown', handleKeyDown)
      returnFocusRef?.current?.focus()
    }
  }, [isActive, containerRef, onClose, returnFocusRef])
}

// =============================================================================
// ICON BUTTON SUB-COMPONENT
// =============================================================================

interface IconButtonProps {
  icon: React.ReactNode
  onClick?: () => void
  ariaLabel: string
  showBadge?: boolean
}

function IconButton({ icon, onClick, ariaLabel, showBadge }: IconButtonProps) {
  const colors = useColors()
  const reducedMotion = usePrefersReducedMotion()
  const [isHovered, setIsHovered] = useState(false)
  const [isFocusVisible, setIsFocusVisible] = useState(false)

  const effectiveLabel = showBadge ? `${ariaLabel} (new)` : ariaLabel

  return (
    <button
      type="button"
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        width: '44px',
        height: '44px',
        borderRadius: header.iconButton.borderRadius,
        backgroundColor: isHovered ? colors.hover.onLight : 'transparent',
        color: isHovered ? colors.text.highEmphasis.onLight : colors.icon.enabled.onLight,
        border: 'none',
        cursor: 'pointer',
        transition: reducedMotion ? 'none' : `all ${transitionPresets.default}`,
        position: 'relative',
        outline: isFocusVisible ? `2px solid ${colors.focusBorder.onLight}` : 'none',
        outlineOffset: '2px',
        padding: 0,
      }}
      onClick={onClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onFocus={(e) => {
        if (e.target.matches(':focus-visible')) setIsFocusVisible(true)
      }}
      onBlur={() => setIsFocusVisible(false)}
      aria-label={effectiveLabel}
    >
      {icon}
      {showBadge && (
        <span
          aria-hidden="true"
          style={{
            position: 'absolute',
            top: '8px',
            right: '8px',
            width: '8px',
            height: '8px',
            borderRadius: '50%',
            backgroundColor: colors.status.important,
            border: `2px solid ${colors.surface.light}`,
          }}
        />
      )}
    </button>
  )
}

// =============================================================================
// INLINE SVG ICONS (remaining icons not yet in the shared Icons system)
// =============================================================================

function SearchIcon({ size = 16, color = 'currentColor' }: { size?: number; color?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" focusable="false" style={{ flexShrink: 0 }}>
      <path
        d="M17.5 17.5L13.875 13.875M15.8333 9.16667C15.8333 12.8486 12.8486 15.8333 9.16667 15.8333C5.48477 15.8333 2.5 12.8486 2.5 9.16667C2.5 5.48477 5.48477 2.5 9.16667 2.5C12.8486 2.5 15.8333 5.48477 15.8333 9.16667Z"
        stroke={color}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

// =============================================================================
// HEADER COMPONENT
// =============================================================================

/**
 * Header — Top-level application header matching the Canopy ecosystem pattern.
 *
 * Layout: [Menu | AppSwitcher | Avatar+Name] — [Search Button] — [Bell | Theme | Brand Logo]
 *
 * Features:
 * - Theme-aware via `useColors()`
 * - Responsive: collapses to hamburger on mobile
 * - Accessible: ARIA landmarks, focus-visible, keyboard support, 44px touch targets
 * - Search is a button trigger (opens external panel), not a real input
 */
export const Header = forwardRef<HTMLElement, HeaderProps>(function Header(
  {
    onMenuToggle,
    onAppSwitcherClick,
    appSwitcher,
    userAvatar,
    userName,
    userOrg,
    onUserClick,
    searchPlaceholder = 'Find or ask about a product or integration',
    onSearchClick,
    showSearch = true,
    onNotificationsClick,
    showNotificationBadge,
    onThemeToggle,
    isDarkMode = false,
    brandLogo,
    brandName,
    actions,
    sticky = false,
    style,
    className,
  },
  ref,
) {
  const colors = useColors()
  const reducedMotion = usePrefersReducedMotion()
  const isMobile = useMediaQuery(`(max-width: ${parseInt(breakpoints.md) - 1}px)`)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const mobileMenuRef = useRef<HTMLDivElement>(null)
  const hamburgerRef = useRef<HTMLButtonElement>(null)

  const closeMobileMenu = useCallback(() => setMobileMenuOpen(false), [])

  useFocusTrap(mobileMenuRef, mobileMenuOpen, closeMobileMenu, hamburgerRef)

  // Close mobile menu on Escape
  useEffect(() => {
    if (!mobileMenuOpen) return
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setMobileMenuOpen(false)
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [mobileMenuOpen])

  // Close mobile menu when screen grows
  useEffect(() => {
    if (!isMobile) setMobileMenuOpen(false)
  }, [isMobile])

  const headerStyle: React.CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    height: header.height,
    padding: isMobile
      ? `${header.padding.y} 16px`
      : `${header.padding.y} ${header.padding.x}`,
    backgroundColor: colors.surface.light,
    borderBottom: `1px solid ${colors.border.lowEmphasis.onLight}`,
    fontFamily: fontFamilies.body,
    boxSizing: 'border-box',
    transition: reducedMotion ? 'none' : `background-color 200ms ease`,
    ...(sticky
      ? {
          position: 'sticky' as const,
          top: 0,
          zIndex: zIndex.header,
        }
      : {}),
    ...style,
  }

  // ── Left section ─────────────────────────────────────────────────
  const renderLeft = () => (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: '4px',
        flexShrink: 0,
        minWidth: isMobile ? '50px' : '200px',
      }}
    >
      {/* Mobile hamburger */}
      {isMobile ? (
        <button
          ref={hamburgerRef}
          type="button"
          aria-label={mobileMenuOpen ? 'Close menu' : 'Open menu'}
          aria-expanded={mobileMenuOpen}
          aria-controls="header-mobile-menu"
          onClick={() => setMobileMenuOpen((v) => !v)}
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: '44px',
            height: '44px',
            borderRadius: header.iconButton.borderRadius,
            backgroundColor: 'transparent',
            color: colors.text.lowEmphasis.onLight,
            border: 'none',
            cursor: 'pointer',
            transition: reducedMotion ? 'none' : `all ${transitionPresets.default}`,
            padding: 0,
          }}
        >
          {mobileMenuOpen ? <IconX size="lg" /> : <IconMenu size="md" />}
        </button>
      ) : (
        /* Desktop: menu toggle */
        <IconButton
          icon={<IconMenu size="md" />}
          ariaLabel="Toggle sidebar"
          onClick={onMenuToggle}
        />
      )}

      {/* AppSwitcher grip button */}
      {!isMobile && (
        <div style={{ position: 'relative' }}>
          <IconButton
            icon={<IconGrid size="md" />}
            ariaLabel="App switcher"
            onClick={onAppSwitcherClick}
          />
          {appSwitcher}
        </div>
      )}

      {/* User avatar + name */}
      <button
        type="button"
        onClick={onUserClick}
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          padding: '6px 8px',
          borderRadius: header.iconButton.borderRadius,
          backgroundColor: 'transparent',
          border: 'none',
          cursor: onUserClick ? 'pointer' : 'default',
          transition: reducedMotion ? 'none' : `background-color ${transitionPresets.default}`,
          marginLeft: '4px',
        }}
        aria-label={userName ? `User: ${userName}` : 'User menu'}
      >
        {userAvatar}
        {!isMobile && userName && (
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', minWidth: 0 }}>
            <span
              style={{
                fontFamily: fontFamilies.body,
                fontSize: typography.label.md.fontSize,
                fontWeight: typography.label.md.fontWeight,
                lineHeight: 1.2,
                color: colors.text.highEmphasis.onLight,
                whiteSpace: 'nowrap',
              }}
            >
              {userName}
            </span>
            {userOrg && (
              <span
                style={{
                  fontFamily: fontFamilies.body,
                  fontSize: typography.body.xs.fontSize,
                  fontWeight: typography.body.xs.fontWeight,
                  lineHeight: 1.2,
                  color: colors.text.lowEmphasis.onLight,
                  whiteSpace: 'nowrap',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  maxWidth: '160px',
                }}
              >
                {userOrg}
              </span>
            )}
          </div>
        )}
        {!isMobile && userName && (
          <IconChevronDown size={14} color={colors.text.disabled.onLight} />
        )}
      </button>
    </div>
  )

  // ── Center section (search button) ─────────────────────────────
  const renderCenter = () => {
    if (!showSearch || isMobile) return <div style={{ flex: 1 }} />

    return (
      <div
        style={{
          flex: 1,
          display: 'flex',
          justifyContent: 'center',
          padding: '0 16px',
          minWidth: 0,
        }}
      >
        <button
          type="button"
          onClick={onSearchClick}
          style={{
            display: 'flex',
            alignItems: 'center',
            width: '100%',
            maxWidth: header.search.width,
            height: header.search.height,
            padding: `${header.search.paddingY} ${header.search.paddingX}`,
            gap: header.search.gap,
            borderRadius: '9999px',
            backgroundColor: colors.surface.lightDarker,
            border: `1px solid ${colors.border.lowEmphasis.onLight}`,
            cursor: 'pointer',
            fontFamily: fontFamilies.body,
            fontSize: header.search.typography.fontSize,
            fontWeight: header.search.typography.fontWeight,
            lineHeight: header.search.typography.lineHeight,
            color: colors.text.disabled.onLight,
            textAlign: 'left',
            transition: reducedMotion ? 'none' : `all ${transitionPresets.default}`,
            boxSizing: 'border-box',
          }}
          aria-label={searchPlaceholder}
        >
          <span style={{ flex: 1 }}>{searchPlaceholder}</span>
          <SearchIcon size={16} />
        </button>
      </div>
    )
  }

  // ── Right section ──────────────────────────────────────────────
  const renderRight = () => (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'flex-end',
        gap: '4px',
        flexShrink: 0,
        minWidth: isMobile ? '100px' : '200px',
        color: colors.text.lowEmphasis.onLight,
      }}
    >
      {/* Custom actions */}
      {actions}

      {/* Notifications */}
      <IconButton
        icon={<IconBell size="md" />}
        ariaLabel="Notifications"
        onClick={onNotificationsClick}
        showBadge={showNotificationBadge}
      />

      {/* Theme toggle */}
      {onThemeToggle && (
        <IconButton
          icon={isDarkMode ? <IconSun size="md" /> : <IconMoon size="md" />}
          ariaLabel={isDarkMode ? 'Switch to light mode' : 'Switch to dark mode'}
          onClick={onThemeToggle}
        />
      )}

      {/* Brand logo + name */}
      {(brandLogo || brandName) && (
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            padding: '0 6px',
            marginLeft: '8px',
          }}
        >
          {brandLogo}
          {!isMobile && brandName && (
            <span
              style={{
                fontFamily: fontFamilies.body,
                fontSize: typography.label.md.fontSize,
                fontWeight: typography.label.md.fontWeight,
                color: colors.text.highEmphasis.onLight,
                whiteSpace: 'nowrap',
              }}
            >
              {brandName}
            </span>
          )}
        </div>
      )}
    </div>
  )

  // ── Mobile menu panel ──────────────────────────────────────────
  const renderMobileMenu = () => {
    if (!isMobile || !mobileMenuOpen) return null

    return (
      <>
        {/* Scrim overlay */}
        <div
          onClick={() => setMobileMenuOpen(false)}
          aria-hidden="true"
          style={{
            position: 'fixed',
            inset: 0,
            top: header.height,
            backgroundColor: colors.scrim,
            zIndex: zIndex.overlay,
          }}
        />
        {/* Panel */}
        <div
          ref={mobileMenuRef}
          id="header-mobile-menu"
          role="dialog"
          aria-modal="true"
          aria-label="Mobile menu"
          style={{
            position: 'fixed',
            top: header.height,
            left: 0,
            right: 0,
            backgroundColor: colors.surface.light,
            borderBottom: `1px solid ${colors.border.lowEmphasis.onLight}`,
            boxShadow: shadows.lg,
            zIndex: zIndex.overlay + 1,
            padding: '16px',
            display: 'flex',
            flexDirection: 'column',
            gap: '16px',
            maxHeight: `calc(100vh - ${header.height})`,
            overflowY: 'auto',
          }}
        >
          {/* Search button in mobile panel */}
          {showSearch && (
            <button
              type="button"
              onClick={() => {
                onSearchClick?.()
                setMobileMenuOpen(false)
              }}
              style={{
                display: 'flex',
                alignItems: 'center',
                width: '100%',
                padding: '10px 16px',
                gap: '12px',
                borderRadius: '9999px',
                backgroundColor: colors.surface.lightDarker,
                border: `1px solid ${colors.border.lowEmphasis.onLight}`,
                cursor: 'pointer',
                fontFamily: fontFamilies.body,
                fontSize: header.search.typography.fontSize,
                color: colors.text.disabled.onLight,
                textAlign: 'left',
              }}
              aria-label={searchPlaceholder}
            >
              <SearchIcon size={16} color={colors.icon.enabled.onLight} />
              <span>{searchPlaceholder}</span>
            </button>
          )}

          {/* AppSwitcher in mobile */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              borderTop: `1px solid ${colors.border.lowEmphasis.onLight}`,
              paddingTop: '16px',
            }}
          >
            <IconButton
              icon={<IconGrid size="md" />}
              ariaLabel="App switcher"
              onClick={() => {
                onAppSwitcherClick?.()
                setMobileMenuOpen(false)
              }}
            />
            <IconButton
              icon={<IconBell size="md" />}
              ariaLabel="Notifications"
              onClick={onNotificationsClick}
              showBadge={showNotificationBadge}
            />
            {onThemeToggle && (
              <IconButton
                icon={isDarkMode ? <IconSun size="md" /> : <IconMoon size="md" />}
                ariaLabel={isDarkMode ? 'Switch to light mode' : 'Switch to dark mode'}
                onClick={onThemeToggle}
              />
            )}
          </div>

          {/* User info in mobile */}
          {userName && (
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                borderTop: `1px solid ${colors.border.lowEmphasis.onLight}`,
                paddingTop: '16px',
              }}
            >
              {userAvatar}
              <span
                style={{
                  fontFamily: fontFamilies.body,
                  fontSize: '14px',
                  fontWeight: 500,
                  color: colors.text.highEmphasis.onLight,
                }}
              >
                {userName}
              </span>
            </div>
          )}
        </div>
      </>
    )
  }

  return (
    <>
      <header
        ref={ref}
        role="banner"
        style={headerStyle}
        className={className}
      >
        {renderLeft()}
        {renderCenter()}
        {renderRight()}
      </header>
      {renderMobileMenu()}
    </>
  )
})

Header.displayName = 'Header'

// =============================================================================
// CANOPY LOGO COMPONENT (preserved from original)
// =============================================================================

export interface CanopyLogoProps {
  /** Logo size */
  size?: 'sm' | 'md' | 'lg'
  /** Whether to show the text alongside the logo */
  showText?: boolean
}

export function CanopyLogo({ size = 'md', showText = true }: CanopyLogoProps) {
  const sizes = {
    sm: { logo: 28, fontSize: '14px', gap: '8px' },
    md: { logo: 32, fontSize: '16px', gap: '10px' },
    lg: { logo: 40, fontSize: '18px', gap: '12px' },
  }

  const s = sizes[size]

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: s.gap }}>
      <svg
        style={{ width: s.logo, height: s.logo, flexShrink: 0 }}
        viewBox="0 0 48 48"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-label="Canopy logo"
        role="img"
      >
        <path d="M24 4C14 4 6 8 6 8V24C6 34 14 42 24 46C34 42 42 34 42 24V8C42 8 34 4 24 4Z" stroke="#3D5A4C" strokeWidth="2" fill="none" />
        <path d="M24 38V28" stroke="#5A7A68" strokeWidth="2.5" strokeLinecap="round" />
        <path d="M21 38C21 36 22 34 24 34C26 34 27 36 27 38" stroke="#5A7A68" strokeWidth="1.5" fill="none" />
        <ellipse cx="24" cy="20" rx="10" ry="8" fill="#6B8E7A" />
        <ellipse cx="20" cy="18" rx="6" ry="5" fill="#5A7A68" />
        <ellipse cx="28" cy="18" rx="6" ry="5" fill="#5A7A68" />
        <ellipse cx="24" cy="15" rx="7" ry="5" fill="#4A6A58" />
        <ellipse cx="24" cy="22" rx="8" ry="5" fill="#7A9E8A" />
      </svg>
      {showText && (
        <span
          style={{
            fontFamily: fontFamilies.body,
            fontSize: s.fontSize,
            fontWeight: 600,
            lineHeight: 1.2,
            color: 'currentColor',
          }}
        >
          Canopy
        </span>
      )}
    </div>
  )
}

CanopyLogo.displayName = 'CanopyLogo'

// =============================================================================
// EXPORTS
// =============================================================================

export { IconButton }
