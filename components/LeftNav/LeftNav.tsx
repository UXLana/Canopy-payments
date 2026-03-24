'use client'

import React, { useState, useRef, useEffect, useCallback, forwardRef, createContext, useContext } from 'react'
import Link from 'next/link'
import {
  colors,
  fontFamilies,
  typography,
  sidebar,
  transitionPresets,
  zIndex,
  shadows,
  button,
  breakpoints,
  borderRadius,
  getSidebarColors,
  type SidebarColors,
} from '@/styles/design-tokens'
import { useColors } from '@/styles/themes/theme-provider'
import { usePrefersReducedMotion, useIsMobile } from '@/hooks'

// =============================================================================
// FOCUS STYLES (WCAG 2.4.7, 2.4.11 compliant)
// =============================================================================

const focusRingStyle: React.CSSProperties = {
  outline: `${button.focus.width} solid ${button.focus.color}`,
  outlineOffset: '2px',
}

// usePrefersReducedMotion — imported from @/hooks

// =============================================================================
// SIDEBAR COLORS CONTEXT (theme-aware)
// =============================================================================

const SidebarColorsContext = createContext<SidebarColors>(sidebar.colors)

function useSidebarColors(): SidebarColors {
  return useContext(SidebarColorsContext)
}

// useIsMobile — imported from @/hooks

import {
  IconChevronDown,
  IconSidebarOpen,
  IconSidebarClose,
  IconX,
} from '@/components/Icons'

// =============================================================================
// TYPES
// =============================================================================

export interface LeftNavItem {
  /** Unique identifier for the item */
  id: string
  /** Display label */
  label: string
  /** Navigation href */
  href: string
  /** Optional icon element */
  icon?: React.ReactNode
  /** Whether the item is currently active */
  isActive?: boolean
  /** Whether the item is disabled */
  disabled?: boolean
}

export interface LeftNavSection {
  /** Unique identifier for the section */
  id: string
  /** Optional section title (displayed as header) */
  title?: string
  /** Optional icon for the section header */
  icon?: React.ReactNode
  /** Navigation items in this section */
  items: LeftNavItem[]
  /** Whether section starts expanded (default: true) */
  defaultExpanded?: boolean
}

export type LeftNavVariant = 'default' | 'flat' | 'grouped'

export interface LeftNavProps {
  /** Logo element displayed at the top */
  logo?: React.ReactNode
  /** Compact logo for collapsed state */
  collapsedLogo?: React.ReactNode
  /** Navigation sections */
  sections: LeftNavSection[]
  /** Footer sections (e.g., Admin, Settings) */
  footerSections?: LeftNavSection[]
  /** Currently active item ID */
  activeItemId?: string
  /** Whether sidebar is collapsed */
  collapsed?: boolean
  /** Callback when collapse state changes */
  onCollapseChange?: (collapsed: boolean) => void
  /** Callback when item is clicked */
  onItemClick?: (item: LeftNavItem) => void
  /** Whether to show the collapse toggle button */
  showCollapseToggle?: boolean
  /**
   * Variant controls section header behavior:
   * - 'default': Sections with titles show collapsible headers with chevron
   * - 'flat': No section headers, all items in a flat list
   * - 'grouped': Section headers visible but not collapsible (static grouping)
   */
  variant?: LeftNavVariant
  /**
   * Mobile behavior:
   * - 'drawer': Slides in from left as overlay (default)
   * - 'sheet': Appears as bottom sheet
   * - 'none': Same as desktop (no special mobile treatment)
   */
  mobileBehavior?: 'drawer' | 'sheet' | 'none'
  /** Whether to show on mobile - controlled externally */
  mobileOpen?: boolean
  /** Callback when mobile drawer/sheet should close */
  onMobileClose?: () => void
  /** Additional styles */
  style?: React.CSSProperties
  /** Additional class name */
  className?: string
}

// =============================================================================
// FOCUS TRAP HOOK (WCAG 2.4.3)
// =============================================================================

function useFocusTrap(
  containerRef: React.RefObject<HTMLElement | null>,
  isActive: boolean,
  onEscape?: () => void
) {
  useEffect(() => {
    if (!isActive || !containerRef.current) return

    const container = containerRef.current
    const focusableElements = container.querySelectorAll(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    ) as NodeListOf<HTMLElement>

    const firstElement = focusableElements[0]
    const lastElement = focusableElements[focusableElements.length - 1]

    // Focus first element when trap activates
    if (firstElement) {
      setTimeout(() => firstElement.focus(), 50)
    }

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onEscape?.()
        return
      }

      if (e.key !== 'Tab') return

      if (e.shiftKey) {
        // Shift+Tab: if on first element, go to last
        if (document.activeElement === firstElement) {
          e.preventDefault()
          lastElement?.focus()
        }
      } else {
        // Tab: if on last element, go to first
        if (document.activeElement === lastElement) {
          e.preventDefault()
          firstElement?.focus()
        }
      }
    }

    container.addEventListener('keydown', handleKeyDown)
    return () => container.removeEventListener('keydown', handleKeyDown)
  }, [isActive, containerRef, onEscape])
}

// =============================================================================
// TOOLTIP COMPONENT (for collapsed state)
// =============================================================================

interface TooltipProps {
  content: string
  children: React.ReactNode
  visible: boolean
  position?: { top: number; left: number }
  id: string
}

function Tooltip({ content, children, visible, position, id }: TooltipProps) {
  const tooltipStyle: React.CSSProperties = {
    position: 'fixed',
    top: position?.top ?? 0,
    left: position?.left ?? 0,
    backgroundColor: colors.surface.dark,
    color: colors.text.highEmphasis.onDark,
    padding: '6px 12px',
    borderRadius: borderRadius.sm,
    fontSize: typography.label.sm.fontSize,
    fontFamily: fontFamilies.body,
    fontWeight: typography.label.sm.fontWeight,
    whiteSpace: 'nowrap',
    zIndex: zIndex.tooltip,
    boxShadow: shadows.md,
    opacity: visible ? 1 : 0,
    pointerEvents: 'none',
    transition: `opacity ${transitionPresets.fast}`,
    transform: 'translateY(-50%)',
  }

  return (
    <>
      {children}
      {visible && position && (
        <div style={tooltipStyle} role="tooltip" id={id}>
          {content}
        </div>
      )}
    </>
  )
}

// =============================================================================
// POPOVER MENU (for collapsed state with sections)
// =============================================================================

interface PopoverMenuProps {
  section: LeftNavSection
  visible: boolean
  position: { top: number; left: number }
  activeItemId?: string
  onItemClick?: (item: LeftNavItem) => void
  onMouseEnter: () => void
  onMouseLeave: () => void
  onClose?: () => void
  triggerRef?: React.RefObject<HTMLButtonElement | null>
}

function PopoverMenu({
  section,
  visible,
  position,
  activeItemId,
  onItemClick,
  onMouseEnter,
  onMouseLeave,
  onClose,
  triggerRef,
}: PopoverMenuProps) {
  const sidebarColors = useSidebarColors()
  const menuRef = useRef<HTMLDivElement>(null)
  const previouslyFocusedRef = useRef<HTMLElement | null>(null)

  // Handle keyboard navigation within menu (WCAG 2.1.1)
  const handleKeyDown = (e: React.KeyboardEvent) => {
    const items = menuRef.current?.querySelectorAll('[role="menuitem"]:not([aria-disabled="true"])') as NodeListOf<HTMLElement>
    if (!items || items.length === 0) return

    const currentIndex = Array.from(items).indexOf(document.activeElement as HTMLElement)

    switch (e.key) {
      case 'Escape':
        e.preventDefault()
        onClose?.()
        // Return focus to trigger (WCAG 2.4.3)
        if (triggerRef?.current) {
          triggerRef.current.focus()
        } else if (previouslyFocusedRef.current) {
          previouslyFocusedRef.current.focus()
        }
        break
      case 'ArrowDown':
        e.preventDefault()
        const nextIndex = currentIndex < items.length - 1 ? currentIndex + 1 : 0
        items[nextIndex]?.focus()
        break
      case 'ArrowUp':
        e.preventDefault()
        const prevIndex = currentIndex > 0 ? currentIndex - 1 : items.length - 1
        items[prevIndex]?.focus()
        break
      case 'Home':
        e.preventDefault()
        items[0]?.focus()
        break
      case 'End':
        e.preventDefault()
        items[items.length - 1]?.focus()
        break
    }
  }

  // Focus first menu item when popover opens (WCAG 2.4.3)
  useEffect(() => {
    if (visible && menuRef.current) {
      // Store currently focused element to restore later
      previouslyFocusedRef.current = document.activeElement as HTMLElement
      const firstItem = menuRef.current.querySelector('[role="menuitem"]:not([aria-disabled="true"])') as HTMLElement
      if (firstItem) {
        // Small delay to ensure popover is rendered
        setTimeout(() => firstItem.focus(), 50)
      }
    }
  }, [visible])
  const menuStyle: React.CSSProperties = {
    position: 'fixed',
    top: position.top,
    left: position.left,
    backgroundColor: colors.surface.default,
    border: `1px solid ${sidebarColors.border}`,
    borderRadius: borderRadius.sm,
    padding: '8px',
    minWidth: '180px',
    zIndex: zIndex.popover,
    boxShadow: shadows.lg,
    opacity: visible ? 1 : 0,
    pointerEvents: visible ? 'auto' : 'none',
    transition: `opacity ${transitionPresets.fast}`,
  }

  const headerStyle: React.CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    padding: '8px 12px',
    marginBottom: '4px',
    fontFamily: fontFamilies.body,
    fontSize: sidebar.section.labelTypography.fontSize,
    fontWeight: sidebar.section.labelTypography.fontWeight,
    letterSpacing: sidebar.section.labelTypography.letterSpacing,
    textTransform: sidebar.section.labelTypography.textTransform,
    color: sidebarColors.sectionLabel,
  }

  return (
    <div
      ref={menuRef}
      style={menuStyle}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      onKeyDown={handleKeyDown}
      role="menu"
      aria-label={section.title || 'Navigation menu'}
    >
      {section.title && (
        <div style={headerStyle}>
          {section.icon && (
            <span style={{ color: sidebarColors.sectionLabel }}>{section.icon}</span>
          )}
          {section.title}
        </div>
      )}
      {section.items.map((item) => (
        <PopoverMenuItem
          key={item.id}
          item={item}
          isActive={item.id === activeItemId}
          onClick={() => onItemClick?.(item)}
        />
      ))}
    </div>
  )
}

interface PopoverMenuItemProps {
  item: LeftNavItem
  isActive: boolean
  onClick?: () => void
}

function PopoverMenuItem({ item, isActive, onClick }: PopoverMenuItemProps) {
  const sidebarColors = useSidebarColors()
  const [isHovered, setIsHovered] = useState(false)
  const [isFocused, setIsFocused] = useState(false)

  const getColors = () => {
    if (isActive) return sidebarColors.item.active
    if (isHovered) return sidebarColors.item.hover
    return sidebarColors.item.default
  }

  const itemColors = getColors()

  const style: React.CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    padding: '8px 12px',
    borderRadius: borderRadius.sm,
    backgroundColor: itemColors.background,
    color: itemColors.text,
    fontFamily: fontFamilies.body,
    fontSize: typography.label.md.fontSize,
    fontWeight: typography.label.md.fontWeight,
    cursor: item.disabled ? 'not-allowed' : 'pointer',
    opacity: item.disabled ? 0.5 : 1,
    textDecoration: 'none',
    transition: `all ${transitionPresets.fast}`,
    outline: 'none',
    ...(isFocused && !item.disabled ? focusRingStyle : {}),
  }

  const handleClick = (e: React.MouseEvent) => {
    if (item.disabled) {
      e.preventDefault()
      return
    }
    onClick?.()
  }

  return (
    <Link
      href={item.href}
      style={style}
      role="menuitem"
      aria-disabled={item.disabled}
      tabIndex={item.disabled ? -1 : 0}
      onClick={handleClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onFocus={() => setIsFocused(true)}
      onBlur={() => setIsFocused(false)}
    >
      {item.icon && (
        <span style={{ color: itemColors.icon, display: 'flex' }}>{item.icon}</span>
      )}
      {item.label}
    </Link>
  )
}

// =============================================================================
// LEFT NAV ITEM
// =============================================================================

interface LeftNavItemComponentProps {
  item: LeftNavItem
  isActive: boolean
  collapsed: boolean
  onClick?: () => void
}

function LeftNavItemComponent({
  item,
  isActive,
  collapsed,
  onClick,
}: LeftNavItemComponentProps) {
  const sidebarColors = useSidebarColors()
  const [isHovered, setIsHovered] = useState(false)
  const [isFocusVisible, setIsFocusVisible] = useState(false)
  const [tooltipPosition, setTooltipPosition] = useState<{ top: number; left: number } | null>(null)
  const itemRef = useRef<HTMLAnchorElement>(null)
  const wasMouseDownRef = useRef(false)

  const getItemColors = () => {
    if (item.disabled) {
      return {
        background: 'transparent',
        text: colors.text.disabled.onLight,
        icon: colors.text.disabled.onLight,
      }
    }
    if (isActive) {
      return {
        ...sidebarColors.item.active,
        // Background is handled by inner pill element, not the container
        background: 'transparent',
      }
    }
    if (isHovered) return sidebarColors.item.hover
    return sidebarColors.item.default
  }

  const itemColors = getItemColors()

  // Show the pill background for active or hovered states (both expanded and collapsed)
  const showPillBackground = (isActive || isHovered) && !item.disabled

  const itemStyle: React.CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    gap: collapsed ? '0' : sidebar.navItem.gap,
    height: sidebar.navItem.height,
    padding: `${sidebar.navItem.paddingY} ${sidebar.navItem.paddingX}`,
    borderRadius: sidebar.navItem.borderRadius,
    backgroundColor: 'transparent', // Background handled by inner pill
    color: itemColors.text,
    cursor: item.disabled ? 'not-allowed' : 'pointer',
    textDecoration: 'none',
    transition: `all ${transitionPresets.default}`,
    fontFamily: fontFamilies.body,
    fontSize: sidebar.navItem.typography.fontSize,
    fontWeight: isActive ? sidebar.navItem.typographyActive.fontWeight : sidebar.navItem.typography.fontWeight,
    lineHeight: sidebar.navItem.typography.lineHeight,
    width: '100%',
    justifyContent: collapsed ? 'center' : 'flex-start',
    opacity: item.disabled ? 0.5 : 1,
    position: 'relative',
    // Focus ring only appears on keyboard focus (not mouse click)
    ...(isFocusVisible && !item.disabled ? {
      outline: `${button.focus.width} solid ${button.focus.color}`,
      outlineOffset: '2px',
    } : {
      outline: 'none',
    }),
  }

  // Pill background for active/hover states
  // The pill uses negative margins to extend beyond the padding area
  // Collapsed: need to extend left/right by ~20px to create a ~44px wide pill
  // Expanded: extend by ~8px on each side for a full-width pill effect
  // Note: Focus ring is separate and only shows on keyboard focus (not mouse interaction)
  const showPill = showPillBackground
  const pillStyle: React.CSSProperties = collapsed
    ? {
        position: 'absolute',
        top: '2px',
        bottom: '2px',
        left: '4px',
        right: '4px',
        backgroundColor: isActive ? sidebarColors.item.active.background : (isHovered ? sidebarColors.item.hover.background : 'transparent'),
        borderRadius: borderRadius.md,
        zIndex: 0,
        transition: `all ${transitionPresets.fast}`,
      }
    : {
        position: 'absolute',
        top: '0px',
        bottom: '0px',
        left: '4px',
        right: '4px',
        backgroundColor: isActive ? sidebarColors.item.active.background : (isHovered ? sidebarColors.item.hover.background : 'transparent'),
        borderRadius: borderRadius.md,
        zIndex: 0,
        transition: `all ${transitionPresets.fast}`,
      }

  const iconStyle: React.CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: sidebar.navItem.iconSize,
    height: sidebar.navItem.iconSize,
    color: itemColors.icon,
    flexShrink: 0,
  }

  const handleMouseEnter = () => {
    setIsHovered(true)
    if (collapsed && itemRef.current) {
      const rect = itemRef.current.getBoundingClientRect()
      setTooltipPosition({
        top: rect.top + rect.height / 2,
        left: rect.right + 12,
      })
    }
  }

  const handleMouseLeave = () => {
    setIsHovered(false)
    setTooltipPosition(null)
  }

  const handleClick = (e: React.MouseEvent) => {
    if (item.disabled) {
      e.preventDefault()
      return
    }
    onClick?.()
  }

  const tooltipId = `tooltip-${item.id}`

  const content = (
    <Link
      ref={itemRef}
      href={item.href}
      style={itemStyle}
      onClick={handleClick}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onMouseDown={() => {
        // Track that focus came from mouse, not keyboard
        wasMouseDownRef.current = true
      }}
      onFocus={() => {
        // Only show focus ring if focus came from keyboard (not mouse click)
        if (!wasMouseDownRef.current) {
          setIsFocusVisible(true)
        }
        wasMouseDownRef.current = false
        if (collapsed && itemRef.current) {
          const rect = itemRef.current.getBoundingClientRect()
          setTooltipPosition({
            top: rect.top + rect.height / 2,
            left: rect.right + 12,
          })
        }
      }}
      onBlur={() => {
        setIsFocusVisible(false)
        setTooltipPosition(null)
      }}
      aria-label={collapsed ? item.label : undefined}
      aria-describedby={collapsed && (isHovered || isFocusVisible) && !item.disabled ? tooltipId : undefined}
      aria-current={isActive ? 'page' : undefined}
      aria-disabled={item.disabled}
      tabIndex={item.disabled ? -1 : 0}
    >
      {/* Pill background for active/hover/focus states */}
      {showPill && (
        <span style={pillStyle} aria-hidden="true" />
      )}
      {item.icon && <span style={{ ...iconStyle, position: 'relative', zIndex: 1 }}>{item.icon}</span>}
      {!collapsed && (
        <span
          style={{
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
            position: 'relative',
            zIndex: 1,
          }}
        >
          {item.label}
        </span>
      )}
    </Link>
  )

  if (collapsed) {
    return (
      <Tooltip
        content={item.label}
        visible={(isHovered || isFocusVisible) && !item.disabled}
        position={tooltipPosition ?? undefined}
        id={tooltipId}
      >
        {content}
      </Tooltip>
    )
  }

  return content
}

// =============================================================================
// RAIL ITEM (for collapsed sections)
// =============================================================================

interface RailItemProps {
  section: LeftNavSection
  sectionStyle: React.CSSProperties
  sectionRef: React.RefObject<HTMLDivElement>
  showPopover: boolean
  popoverPosition: { top: number; left: number }
  activeItemId?: string
  onItemClick?: (item: LeftNavItem) => void
  onSectionHover: () => void
  onSectionLeave: () => void
  onPopoverEnter: () => void
  onPopoverLeave: () => void
}

function RailItem({
  section,
  sectionStyle,
  sectionRef,
  showPopover,
  popoverPosition,
  activeItemId,
  onItemClick,
  onSectionHover,
  onSectionLeave,
  onPopoverEnter,
  onPopoverLeave,
}: RailItemProps) {
  const sidebarColors = useSidebarColors()
  const [isRailHovered, setIsRailHovered] = useState(false)
  const [isRailFocused, setIsRailFocused] = useState(false)
  const triggerRef = useRef<HTMLButtonElement>(null)

  const railItemStyle: React.CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    height: sidebar.navItem.height,
    borderRadius: sidebar.navItem.borderRadius,
    backgroundColor: isRailHovered || showPopover
      ? sidebarColors.item.hover.background
      : 'transparent',
    color: isRailHovered || showPopover
      ? sidebarColors.item.hover.icon
      : sidebarColors.item.default.icon,
    cursor: 'pointer',
    transition: `all ${transitionPresets.default}`,
    border: 'none',
    outline: 'none',
    ...(isRailFocused ? focusRingStyle : {}),
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault()
      onSectionHover()
    }
    if (e.key === 'Escape' && showPopover) {
      onSectionLeave()
    }
  }

  return (
    <div style={sectionStyle} ref={sectionRef}>
      <button
        ref={triggerRef}
        type="button"
        style={railItemStyle}
        onMouseEnter={() => {
          setIsRailHovered(true)
          onSectionHover()
        }}
        onMouseLeave={() => {
          setIsRailHovered(false)
          onSectionLeave()
        }}
        onFocus={() => {
          setIsRailFocused(true)
          onSectionHover()
        }}
        onBlur={() => {
          setIsRailFocused(false)
        }}
        onKeyDown={handleKeyDown}
        aria-expanded={showPopover}
        aria-haspopup="menu"
        aria-label={section.title}
      >
        {section.icon}
      </button>
      <PopoverMenu
        section={section}
        visible={showPopover}
        position={popoverPosition}
        activeItemId={activeItemId}
        onItemClick={onItemClick}
        onMouseEnter={onPopoverEnter}
        onMouseLeave={onPopoverLeave}
        onClose={onPopoverLeave}
        triggerRef={triggerRef}
      />
    </div>
  )
}

// =============================================================================
// LEFT NAV SECTION
// =============================================================================

interface LeftNavSectionComponentProps {
  section: LeftNavSection
  activeItemId?: string
  collapsed: boolean
  variant: LeftNavVariant
  onItemClick?: (item: LeftNavItem) => void
  isFirst?: boolean
}

function LeftNavSectionComponent({
  section,
  activeItemId,
  collapsed,
  variant,
  onItemClick,
  isFirst,
}: LeftNavSectionComponentProps) {
  const sidebarColors = useSidebarColors()
  const [isExpanded, setIsExpanded] = useState(section.defaultExpanded !== false)
  const [showPopover, setShowPopover] = useState(false)
  const [popoverPosition, setPopoverPosition] = useState({ top: 0, left: 0 })
  const [isHeaderFocused, setIsHeaderFocused] = useState(false)
  const [isHeaderHovered, setIsHeaderHovered] = useState(false)
  const sectionRef = useRef<HTMLDivElement>(null)
  const hideTimeoutRef = useRef<NodeJS.Timeout | null>(null)

  // For collapsed mode with sections that have titles, show as icon with popover
  const shouldShowAsRail = collapsed && section.title && section.icon

  // Determine if section header should be shown and if it's collapsible
  const showSectionHeader = section.title && variant !== 'flat' && !collapsed
  const isCollapsible = variant === 'default' && showSectionHeader

  const handleSectionHover = () => {
    if (shouldShowAsRail && sectionRef.current) {
      if (hideTimeoutRef.current) {
        clearTimeout(hideTimeoutRef.current)
        hideTimeoutRef.current = null
      }
      const rect = sectionRef.current.getBoundingClientRect()
      setPopoverPosition({
        top: rect.top,
        left: rect.right + 8,
      })
      setShowPopover(true)
    }
  }

  const handleSectionLeave = () => {
    if (shouldShowAsRail) {
      hideTimeoutRef.current = setTimeout(() => {
        setShowPopover(false)
      }, 150)
    }
  }

  const handlePopoverEnter = () => {
    if (hideTimeoutRef.current) {
      clearTimeout(hideTimeoutRef.current)
      hideTimeoutRef.current = null
    }
  }

  const handlePopoverLeave = () => {
    setShowPopover(false)
  }

  useEffect(() => {
    return () => {
      if (hideTimeoutRef.current) {
        clearTimeout(hideTimeoutRef.current)
      }
    }
  }, [])

  const sectionStyle: React.CSSProperties = {
    marginTop: isFirst ? '0' : sidebar.section.marginTop,
  }

  const headerStyle: React.CSSProperties = {
    display: collapsed ? 'none' : 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: sidebar.section.labelMarginBottom,
    padding: `4px ${sidebar.navItem.paddingX}`,
    fontFamily: fontFamilies.body,
    fontSize: sidebar.section.labelTypography.fontSize,
    fontWeight: sidebar.section.labelTypography.fontWeight,
    lineHeight: sidebar.section.labelTypography.lineHeight,
    letterSpacing: sidebar.section.labelTypography.letterSpacing,
    textTransform: sidebar.section.labelTypography.textTransform,
    color: sidebarColors.sectionLabel,
    cursor: isCollapsible ? 'pointer' : 'default',
    userSelect: 'none',
    borderRadius: borderRadius.xs,
    outline: 'none',
    backgroundColor: isHeaderHovered && isCollapsible ? sidebarColors.subtleHover : 'transparent',
    transition: `background-color ${transitionPresets.fast}`,
    ...(isHeaderFocused ? focusRingStyle : {}),
  }

  const chevronStyle: React.CSSProperties = {
    display: isCollapsible ? 'flex' : 'none',
    alignItems: 'center',
    justifyContent: 'center',
    transition: `transform ${transitionPresets.default}`,
    transform: isExpanded ? 'rotate(0deg)' : 'rotate(-90deg)',
  }

  const itemsContainerStyle: React.CSSProperties = {
    display: 'flex',
    flexDirection: 'column',
    gap: '2px',
    overflowX: 'visible',
    overflowY: 'hidden',
    maxHeight: !collapsed && isCollapsible && !isExpanded ? '0' : '2000px',
    opacity: !collapsed && isCollapsible && !isExpanded ? 0 : 1,
    transition: `max-height ${transitionPresets.slow}, opacity ${transitionPresets.default}`,
  }

  const handleToggle = () => {
    if (isCollapsible) {
      setIsExpanded(!isExpanded)
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (isCollapsible && (e.key === 'Enter' || e.key === ' ')) {
      e.preventDefault()
      setIsExpanded(!isExpanded)
    }
  }

  // Collapsed mode with section icon - show as rail item
  if (shouldShowAsRail) {
    return (
      <RailItem
        section={section}
        sectionStyle={sectionStyle}
        sectionRef={sectionRef}
        showPopover={showPopover}
        popoverPosition={popoverPosition}
        activeItemId={activeItemId}
        onItemClick={onItemClick}
        onSectionHover={handleSectionHover}
        onSectionLeave={handleSectionLeave}
        onPopoverEnter={handlePopoverEnter}
        onPopoverLeave={handlePopoverLeave}
      />
    )
  }

  return (
    <div style={sectionStyle}>
      {showSectionHeader && (
        <div
          style={headerStyle}
          onClick={handleToggle}
          onKeyDown={handleKeyDown}
          onFocus={() => setIsHeaderFocused(true)}
          onBlur={() => setIsHeaderFocused(false)}
          onMouseEnter={() => setIsHeaderHovered(true)}
          onMouseLeave={() => setIsHeaderHovered(false)}
          role={isCollapsible ? 'button' : undefined}
          aria-expanded={isCollapsible ? isExpanded : undefined}
          aria-controls={isCollapsible ? `section-${section.id}-items` : undefined}
          aria-label={isCollapsible ? `${section.title} section, ${isExpanded ? 'expanded' : 'collapsed'}` : undefined}
          tabIndex={isCollapsible ? 0 : undefined}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            {section.icon && (
              <span style={{ color: sidebarColors.sectionLabel, display: 'flex' }}>
                {section.icon}
              </span>
            )}
            {section.title}
          </div>
          <span style={chevronStyle}>
            <IconChevronDown size="sm" />
          </span>
        </div>
      )}
      <div style={itemsContainerStyle} id={`section-${section.id}-items`}>
        {section.items.map((item) => (
          <LeftNavItemComponent
            key={item.id}
            item={item}
            isActive={item.id === activeItemId || item.isActive === true}
            collapsed={collapsed}
            onClick={() => onItemClick?.(item)}
          />
        ))}
      </div>
    </div>
  )
}

// =============================================================================
// MOBILE OVERLAY
// =============================================================================

interface MobileOverlayProps {
  visible: boolean
  onClick: () => void
}

function MobileOverlay({ visible, onClick }: MobileOverlayProps) {
  const overlayStyle: React.CSSProperties = {
    position: 'fixed',
    inset: 0,
    backgroundColor: colors.overlay,
    zIndex: zIndex.overlay,
    opacity: visible ? 1 : 0,
    pointerEvents: visible ? 'auto' : 'none',
    transition: `opacity ${transitionPresets.default}`,
  }

  return (
    <div
      style={overlayStyle}
      onClick={onClick}
      aria-hidden="true"
    />
  )
}

// =============================================================================
// MOBILE DRAWER HEADER
// =============================================================================

interface MobileHeaderProps {
  logo?: React.ReactNode
  onClose: () => void
}

function MobileHeader({ logo, onClose }: MobileHeaderProps) {
  const sidebarColors = useSidebarColors()
  const [isCloseHovered, setIsCloseHovered] = useState(false)
  const [isCloseFocused, setIsCloseFocused] = useState(false)

  const headerStyle: React.CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '16px 20px',
    borderBottom: `1px solid ${sidebarColors.border}`,
  }

  const closeButtonStyle: React.CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: '40px',
    height: '40px',
    borderRadius: borderRadius.sm,
    border: 'none',
    backgroundColor: isCloseHovered ? sidebarColors.controlHover : 'transparent',
    color: sidebarColors.item.default.icon,
    cursor: 'pointer',
    transition: `all ${transitionPresets.fast}`,
    outline: 'none',
    ...(isCloseFocused ? focusRingStyle : {}),
  }

  return (
    <div style={headerStyle}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
        {logo}
      </div>
      <button
        type="button"
        style={closeButtonStyle}
        onClick={onClose}
        onMouseEnter={() => setIsCloseHovered(true)}
        onMouseLeave={() => setIsCloseHovered(false)}
        onFocus={() => setIsCloseFocused(true)}
        onBlur={() => setIsCloseFocused(false)}
        aria-label="Close navigation"
      >
        <IconX size="md" />
      </button>
    </div>
  )
}

// =============================================================================
// LEFT NAV COMPONENT
// =============================================================================

export const LeftNav = forwardRef<HTMLElement, LeftNavProps>(
  (
    {
      logo,
      collapsedLogo,
      sections,
      footerSections,
      activeItemId,
      collapsed = false,
      onCollapseChange,
      onItemClick,
      showCollapseToggle = true,
      variant = 'default',
      mobileBehavior = 'drawer',
      mobileOpen = false,
      onMobileClose,
      style,
      className,
    },
    ref
  ) => {
    const themeColors = useColors()
    const sidebarColors = getSidebarColors(themeColors)
    const [isToggleHovered, setIsToggleHovered] = useState(false)
    const [isToggleFocused, setIsToggleFocused] = useState(false)
    const prefersReducedMotion = usePrefersReducedMotion()
    const isMobile = useIsMobile(parseInt(breakpoints.md))
    const mobileNavRef = useRef<HTMLElement>(null)
    const previouslyFocusedRef = useRef<HTMLElement | null>(null)

    const transitionStyle = prefersReducedMotion ? 'none' : transitionPresets.default

    // Use focus trap for mobile navigation (WCAG 2.4.3)
    useFocusTrap(mobileNavRef, isMobile && mobileOpen, onMobileClose)

    // Store focus and prevent body scroll when mobile nav opens
    useEffect(() => {
      if (isMobile && mobileOpen) {
        // Store the element that had focus before opening
        previouslyFocusedRef.current = document.activeElement as HTMLElement
        // Prevent body scroll when mobile nav is open
        document.body.style.overflow = 'hidden'
      } else if (previouslyFocusedRef.current) {
        // Restore focus when closing
        previouslyFocusedRef.current.focus()
        previouslyFocusedRef.current = null
      }

      return () => {
        document.body.style.overflow = ''
      }
    }, [isMobile, mobileOpen])

    // Mobile drawer styles
    const mobileDrawerStyle: React.CSSProperties = {
      position: 'fixed',
      top: 0,
      left: 0,
      height: '100vh',
      width: sidebar.width,
      maxWidth: '85vw',
      backgroundColor: colors.surface.default,
      borderRight: `1px solid ${sidebarColors.border}`,
      zIndex: zIndex.modal,
      transform: mobileOpen ? 'translateX(0)' : 'translateX(-100%)',
      transition: prefersReducedMotion ? 'none' : `transform ${transitionPresets.slow}`,
      display: 'flex',
      flexDirection: 'column',
      overflowY: 'auto',
      overflowX: 'hidden',
    }

    // Mobile sheet styles (bottom sheet)
    const mobileSheetStyle: React.CSSProperties = {
      position: 'fixed',
      bottom: 0,
      left: 0,
      right: 0,
      maxHeight: '80vh',
      backgroundColor: colors.surface.default,
      borderTopLeftRadius: '16px',
      borderTopRightRadius: '16px',
      boxShadow: shadows['2xl'],
      zIndex: zIndex.modal,
      transform: mobileOpen ? 'translateY(0)' : 'translateY(100%)',
      transition: prefersReducedMotion ? 'none' : `transform ${transitionPresets.slow}`,
      display: 'flex',
      flexDirection: 'column',
      overflowY: 'auto',
      overflowX: 'hidden',
    }

    // Desktop nav styles
    const navStyle: React.CSSProperties = {
      display: 'flex',
      flexDirection: 'column',
      width: collapsed ? sidebar.collapsedWidth : sidebar.width,
      height: '100%',
      backgroundColor: sidebarColors.background,
      borderRight: `1px solid ${sidebarColors.border}`,
      padding: `${sidebar.padding.y} ${sidebar.padding.x}`,
      transition: prefersReducedMotion ? 'none' : `width ${transitionPresets.default}`,
      overflow: 'hidden',
      position: 'relative',
      ...style,
    }

    // Only show logo container if there's a logo or collapse toggle
    const hasLogoContent = logo || collapsedLogo || showCollapseToggle
    const logoContainerStyle: React.CSSProperties = {
      display: hasLogoContent ? 'flex' : 'none',
      alignItems: collapsed ? 'center' : 'flex-start',
      justifyContent: collapsed ? 'center' : 'space-between',
      minHeight: sidebar.logo.height === 'auto' ? undefined : sidebar.logo.height,
      marginBottom: '12px',
      padding: collapsed ? '0' : `0 ${sidebar.navItem.paddingX}`,
      flexShrink: 0,
    }

    const logoContentStyle: React.CSSProperties = {
      display: 'flex',
      alignItems: 'center',
      gap: sidebar.logo.gap,
      overflow: 'hidden',
    }

    const toggleButtonStyle: React.CSSProperties = {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      width: '28px',
      height: '28px',
      borderRadius: borderRadius.sm,
      border: 'none',
      backgroundColor: isToggleHovered ? sidebarColors.controlHover : 'transparent',
      color: sidebarColors.item.default.icon,
      cursor: 'pointer',
      transition: `all ${transitionPresets.fast}`,
      flexShrink: 0,
      outline: 'none',
      ...(isToggleFocused ? focusRingStyle : {}),
    }

    const navContainerStyle: React.CSSProperties = {
      flex: 1,
      overflowY: 'auto',
      overflowX: 'hidden',
      paddingRight: '4px',
      marginRight: '-4px',
    }

    const footerStyle: React.CSSProperties = {
      marginTop: 'auto',
      paddingTop: '16px',
      borderTop: `1px solid ${sidebarColors.border}`,
      flexShrink: 0,
    }

    const handleCollapseToggle = useCallback(() => {
      onCollapseChange?.(!collapsed)
    }, [collapsed, onCollapseChange])

    const handleMobileItemClick = useCallback((item: LeftNavItem) => {
      onItemClick?.(item)
      // Close mobile nav after item click
      if (isMobile && onMobileClose) {
        onMobileClose()
      }
    }, [onItemClick, isMobile, onMobileClose])

    // Render content (shared between desktop and mobile)
    const renderNavContent = (isMobileContext: boolean = false) => (
      <>
        {/* Main Navigation */}
        <div style={navContainerStyle}>
          {sections.map((section, index) => (
            <LeftNavSectionComponent
              key={section.id}
              section={section}
              activeItemId={activeItemId}
              collapsed={isMobileContext ? false : collapsed}
              variant={variant}
              onItemClick={isMobileContext ? handleMobileItemClick : onItemClick}
              isFirst={index === 0}
            />
          ))}
        </div>

        {/* Footer Navigation */}
        {footerSections && footerSections.length > 0 && (
          <div style={footerStyle}>
            {footerSections.map((section, index) => (
              <LeftNavSectionComponent
                key={section.id}
                section={section}
                activeItemId={activeItemId}
                collapsed={isMobileContext ? false : collapsed}
                variant={variant}
                onItemClick={isMobileContext ? handleMobileItemClick : onItemClick}
                isFirst={index === 0}
              />
            ))}
          </div>
        )}
      </>
    )

    // Mobile rendering
    if (isMobile && mobileBehavior !== 'none') {
      const mobileStyle = mobileBehavior === 'sheet' ? mobileSheetStyle : mobileDrawerStyle

      return (
        <SidebarColorsContext.Provider value={sidebarColors}>
          <MobileOverlay
            visible={mobileOpen}
            onClick={() => onMobileClose?.()}
          />
          <nav
            ref={(node) => {
              // Handle both refs
              (mobileNavRef as React.MutableRefObject<HTMLElement | null>).current = node
              if (typeof ref === 'function') {
                ref(node)
              } else if (ref) {
                (ref as React.MutableRefObject<HTMLElement | null>).current = node
              }
            }}
            style={mobileStyle}
            className={className}
            aria-label="Main navigation"
            aria-hidden={!mobileOpen}
            // @ts-expect-error - inert is a valid HTML attribute but not yet in React types
            inert={!mobileOpen ? '' : undefined}
            aria-modal={mobileOpen ? 'true' : undefined}
            role={mobileOpen ? 'dialog' : undefined}
          >
            <MobileHeader
              logo={logo}
              onClose={() => onMobileClose?.()}
            />
            <div style={{ padding: `${sidebar.padding.y} ${sidebar.padding.x}`, flex: 1, display: 'flex', flexDirection: 'column' }}>
              {renderNavContent(true)}
            </div>
          </nav>
        </SidebarColorsContext.Provider>
      )
    }

    // Desktop rendering
    return (
      <SidebarColorsContext.Provider value={sidebarColors}>
        <nav
          ref={ref}
          style={navStyle}
          className={className}
          aria-label="Main navigation"
        >
          {/* Logo and Toggle */}
          <div style={logoContainerStyle}>
            {(logo || collapsedLogo) && (
              <div style={logoContentStyle}>
                {collapsed ? collapsedLogo || logo : logo}
              </div>
            )}
            {showCollapseToggle && (
              <button
                type="button"
                style={toggleButtonStyle}
                onClick={handleCollapseToggle}
                onMouseEnter={() => setIsToggleHovered(true)}
                onMouseLeave={() => setIsToggleHovered(false)}
                onFocus={() => setIsToggleFocused(true)}
                onBlur={() => setIsToggleFocused(false)}
                aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
                aria-expanded={!collapsed}
              >
                {collapsed ? (
                  <IconSidebarOpen size="sm" />
                ) : (
                  <IconSidebarClose size="sm" />
                )}
              </button>
            )}
          </div>

          {renderNavContent(false)}
        </nav>
      </SidebarColorsContext.Provider>
    )
  }
)

LeftNav.displayName = 'LeftNav'

export default LeftNav
