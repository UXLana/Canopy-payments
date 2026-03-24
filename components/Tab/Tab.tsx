'use client'

import React, { forwardRef, createContext, useContext, useState, useCallback } from 'react'
import {
  tab,
  colors,
  fontFamilies,
} from '@/styles/design-tokens'

// =============================================================================
// TYPES & CONTRACTS
// =============================================================================

/**
 * Icon position within a tab
 * - none: Text only
 * - top: Icon above text
 * - leading: Icon to the left of text
 * - only: Icon only (no text)
 */
export type TabIconPosition = 'none' | 'top' | 'leading' | 'only'

/**
 * Tab bar alignment
 */
export type TabBarAlign = 'left' | 'center' | 'right' | 'stretch'

/**
 * Individual Tab item data
 */
export interface TabItem {
  /** Unique identifier for the tab */
  id: string
  /** Tab label text */
  label: string
  /** Optional icon element */
  icon?: React.ReactNode
  /** Optional badge count */
  badge?: number
  /** Whether the tab is disabled */
  disabled?: boolean
}

/**
 * Single Tab component props
 */
export interface TabProps extends Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, 'id'> {
  /** Tab label */
  label: string
  /** Whether this tab is active/selected */
  isActive?: boolean
  /** Icon position */
  iconPosition?: TabIconPosition
  /** Icon element */
  icon?: React.ReactNode
  /** Badge count */
  badge?: number
  /** Whether displayed on dark surface */
  onDark?: boolean
  /** Inverted tab style */
  inverted?: boolean
  /** Mobile footer variant */
  mobileFooter?: boolean
  /** Show focus ring (for demo) */
  focused?: boolean
}

/**
 * Tab Bar component props
 */
export interface TabBarProps {
  /** Array of tab items */
  tabs: TabItem[]
  /** Currently active tab ID */
  activeTab: string
  /** Callback when tab changes */
  onTabChange: (tabId: string) => void
  /** Icon position for all tabs */
  iconPosition?: TabIconPosition
  /** Alignment of tabs */
  align?: TabBarAlign
  /** Whether tabs are stretched to fill width */
  stretched?: boolean
  /** Whether displayed on dark surface */
  onDark?: boolean
  /** Inverted tab style */
  inverted?: boolean
  /** Mobile footer variant */
  mobileFooter?: boolean
  /** Show divider line */
  hasDivider?: boolean
  /** Enable scrollable mode */
  scrollable?: boolean
  /** Additional class name */
  className?: string
  /** Additional inline styles */
  style?: React.CSSProperties
}

// =============================================================================
// ICONS
// =============================================================================

/**
 * Left scroll arrow icon
 */
function ChevronLeftIcon({ size = 24, color = 'currentColor' }: { size?: number; color?: string }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M15 18L9 12L15 6"
        stroke={color}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

/**
 * Right scroll arrow icon
 */
function ChevronRightIcon({ size = 24, color = 'currentColor' }: { size?: number; color?: string }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M9 18L15 12L9 6"
        stroke={color}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

/**
 * Default tab icon (placeholder)
 */
export function TabIcon({ size = 20, color = 'currentColor' }: { size?: number; color?: string }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 20 20"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <rect
        x="3"
        y="3"
        width="14"
        height="14"
        rx="2"
        stroke={color}
        strokeWidth="1.5"
      />
      <path
        d="M7 10H13"
        stroke={color}
        strokeWidth="1.5"
        strokeLinecap="round"
      />
    </svg>
  )
}

// =============================================================================
// TAB BADGE COMPONENT
// =============================================================================

interface TabBadgeProps {
  count: number
  onDark?: boolean
}

function TabBadge({ count, onDark = false }: TabBadgeProps) {
  const badgeStyles: React.CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    minWidth: tab.badge.minWidth,
    height: tab.badge.height,
    padding: tab.badge.padding,
    borderRadius: tab.badge.borderRadius,
    background: tab.badge.background,
    position: 'relative',
    flexShrink: 0,
  }

  const innerStyles: React.CSSProperties = {
    position: 'absolute',
    inset: '2px',
    borderRadius: tab.badge.innerBorderRadius,
    background: tab.badge.innerBackground,
    zIndex: 1,
  }

  const textStyles: React.CSSProperties = {
    fontFamily: fontFamilies.display,
    fontSize: tab.badge.typography.fontSize,
    fontWeight: tab.badge.typography.fontWeight,
    lineHeight: tab.badge.typography.lineHeight,
    letterSpacing: tab.badge.typography.letterSpacing,
    color: tab.badge.typography.color,
    position: 'relative',
    zIndex: 2,
    textAlign: 'center',
  }

  return (
    <span style={badgeStyles}>
      <span style={innerStyles} />
      <span style={textStyles}>{count > 99 ? '99+' : count}</span>
    </span>
  )
}

// =============================================================================
// TAB COMPONENT
// =============================================================================

/**
 * Individual Tab Component
 *
 * A single tab item that can be used standalone or within a TabBar.
 * Supports icons, badges, and multiple visual states.
 *
 * @example
 * // Basic tab
 * <Tab label="Overview" isActive />
 *
 * @example
 * // Tab with icon
 * <Tab label="Settings" icon={<SettingsIcon />} iconPosition="leading" />
 *
 * @example
 * // Tab with badge
 * <Tab label="Notifications" badge={5} />
 */
export const Tab = forwardRef<HTMLButtonElement, TabProps>(
  (
    {
      label,
      isActive = false,
      iconPosition = 'none',
      icon,
      badge,
      onDark = false,
      inverted = false,
      mobileFooter = false,
      focused = false,
      disabled,
      className,
      style,
      onMouseEnter,
      onMouseLeave,
      ...props
    },
    ref
  ) => {
    const [isHovered, setIsHovered] = useState(false)

    // Get color scheme based on theme
    const getColorScheme = () => {
      if (inverted) return tab.colors.inverted
      if (onDark) return tab.colors.dark
      return tab.colors.light
    }

    const colorScheme = getColorScheme()

    // Determine current state colors
    const getStateColors = () => {
      if (disabled && 'disabled' in colorScheme) return colorScheme.disabled
      if (disabled) return colorScheme.inactive // Fallback for inverted which has no disabled state
      if (isActive) return colorScheme.active
      if (isHovered) return colorScheme.hover
      return colorScheme.inactive
    }

    const stateColors = getStateColors()
    const sizeConfig = tab.sizes[iconPosition === 'only' ? 'none' : iconPosition]

    // Determine flex direction based on icon position
    const getFlexDirection = (): React.CSSProperties['flexDirection'] => {
      if (iconPosition === 'top') return 'column'
      return 'row'
    }

    // Base styles
    const baseStyles: React.CSSProperties = {
      // Reset
      border: 'none',
      outline: 'none',
      cursor: disabled ? 'not-allowed' : 'pointer',
      
      // Layout
      display: 'flex',
      flexDirection: getFlexDirection(),
      alignItems: 'center',
      justifyContent: 'center',
      gap: sizeConfig.gap,
      position: 'relative',
      flexShrink: 0,
      
      // Size
      height: sizeConfig.height,
      paddingLeft: sizeConfig.paddingX,
      paddingRight: sizeConfig.paddingX,
      paddingTop: sizeConfig.paddingY,
      paddingBottom: sizeConfig.paddingY,
      
      // Colors
      backgroundColor: stateColors.background,
      color: stateColors.text,
      
      // Shape (top corners only)
      borderTopLeftRadius: tab.borderRadius,
      borderTopRightRadius: tab.borderRadius,
      borderBottomLeftRadius: 0,
      borderBottomRightRadius: 0,
      
      // Transition
      transition: tab.transition,
      
      // User overrides
      ...style,
    }

    // Text styles
    const textStyles: React.CSSProperties = {
      fontFamily: tab.typography.fontFamily,
      fontSize: tab.typography.fontSize,
      fontWeight: tab.typography.fontWeight,
      lineHeight: tab.typography.lineHeight,
      letterSpacing: tab.typography.letterSpacing,
      textAlign: 'center',
      whiteSpace: 'nowrap',
      flexShrink: 0,
    }

    // Selected indicator styles
    const indicatorStyles: React.CSSProperties = {
      position: 'absolute',
      bottom: 0,
      left: tab.indicator.paddingX,
      right: tab.indicator.paddingX,
      height: tab.indicator.height,
      backgroundColor: stateColors.indicator,
      borderRadius: tab.indicator.borderRadius,
      transition: tab.transition,
    }

    // Focus ring styles
    const focusRingStyles: React.CSSProperties = {
      position: 'absolute',
      inset: tab.focus.offset,
      borderRadius: tab.focus.borderRadius,
      border: `${tab.focus.width} solid ${tab.focus.color}`,
      pointerEvents: 'none',
    }

    // Icon wrapper styles
    const iconWrapperStyles: React.CSSProperties = {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      width: iconPosition === 'top' ? '24px' : sizeConfig.iconSize,
      height: iconPosition === 'top' ? '24px' : sizeConfig.iconSize,
      flexShrink: 0,
    }

    const iconSize = iconPosition === 'top' ? 24 : parseInt(sizeConfig.iconSize)

    // Event handlers
    const handleMouseEnter = (e: React.MouseEvent<HTMLButtonElement>) => {
      if (!disabled) setIsHovered(true)
      onMouseEnter?.(e)
    }

    const handleMouseLeave = (e: React.MouseEvent<HTMLButtonElement>) => {
      setIsHovered(false)
      onMouseLeave?.(e)
    }

    return (
      <button
        ref={ref}
        className={className}
        style={baseStyles}
        disabled={disabled}
        role="tab"
        aria-selected={isActive}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        {...props}
      >
        {/* Icon (for leading and top positions) */}
        {icon && (iconPosition === 'leading' || iconPosition === 'top' || iconPosition === 'only') && (
          <span style={iconWrapperStyles}>
            {React.isValidElement(icon) 
              ? React.cloneElement(icon as React.ReactElement<{ size?: number; color?: string }>, {
                  size: iconSize,
                  color: stateColors.text,
                })
              : icon}
          </span>
        )}

        {/* Label (hidden for icon-only) */}
        {iconPosition !== 'only' && (
          <span style={textStyles}>{label}</span>
        )}

        {/* Badge */}
        {badge !== undefined && badge > 0 && (
          <TabBadge count={badge} onDark={onDark} />
        )}

        {/* Selected indicator */}
        {isActive && <span style={indicatorStyles} />}

        {/* Focus ring */}
        {focused && <span style={focusRingStyles} />}
      </button>
    )
  }
)

Tab.displayName = 'Tab'

// =============================================================================
// TAB BAR COMPONENT
// =============================================================================

/**
 * Tab Bar Component
 *
 * A container for multiple tabs with support for various alignments,
 * scrolling, and responsive behavior.
 *
 * @example
 * // Basic tab bar
 * <TabBar
 *   tabs={[
 *     { id: '1', label: 'Overview' },
 *     { id: '2', label: 'Details' },
 *     { id: '3', label: 'Settings' },
 *   ]}
 *   activeTab="1"
 *   onTabChange={(id) => setActiveTab(id)}
 * />
 *
 * @example
 * // Tab bar with icons
 * <TabBar
 *   tabs={tabs}
 *   activeTab={activeTab}
 *   onTabChange={setActiveTab}
 *   iconPosition="leading"
 *   align="center"
 * />
 */
export function TabBar({
  tabs,
  activeTab,
  onTabChange,
  iconPosition = 'none',
  align = 'left',
  stretched = false,
  onDark = false,
  inverted = false,
  mobileFooter = false,
  hasDivider = true,
  scrollable = false,
  className,
  style,
}: TabBarProps) {
  const scrollContainerRef = React.useRef<HTMLDivElement>(null)

  const handleScroll = (direction: 'left' | 'right') => {
    if (scrollContainerRef.current) {
      const scrollAmount = 200
      scrollContainerRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth',
      })
    }
  }

  // Container styles
  const containerStyles: React.CSSProperties = {
    display: 'flex',
    alignItems: 'flex-end',
    position: 'relative',
    width: '100%',
    ...style,
  }

  // Tabs wrapper styles
  const tabsWrapperStyles: React.CSSProperties = {
    display: 'flex',
    alignItems: 'flex-end',
    flex: 1,
    overflow: scrollable ? 'hidden' : 'visible',
    justifyContent: 
      align === 'center' ? 'center' :
      align === 'right' ? 'flex-end' :
      align === 'stretch' ? 'stretch' :
      'flex-start',
    width: '100%',
  }

  // Inner scroll container styles
  const scrollContainerStyles: React.CSSProperties = {
    display: 'flex',
    alignItems: 'flex-end',
    gap: 0,
    overflowX: scrollable ? 'auto' : 'visible',
    scrollbarWidth: 'none',
    msOverflowStyle: 'none',
    // Only stretch to 100% width if stretched, otherwise wrap content
    ...(stretched && { width: '100%' }),
  }

  // Divider styles
  const dividerStyles: React.CSSProperties = {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: tab.bar.divider.height,
    backgroundColor: onDark ? 'rgba(255, 255, 255, 0.12)' : tab.bar.divider.color,
  }

  // Scroll arrow styles
  const scrollArrowStyles: React.CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: tab.bar.scrollArrow.size,
    height: tab.bar.scrollArrow.size,
    padding: tab.bar.scrollArrow.padding,
    cursor: 'pointer',
    borderRadius: '50%',
    background: 'transparent',
    border: 'none',
    color: onDark ? colors.text.highEmphasis.onDark : colors.text.highEmphasis.onLight,
    flexShrink: 0,
  }

  return (
    <div className={className} style={containerStyles} role="tablist">
      {/* Left scroll arrow */}
      {scrollable && (
        <button
          style={scrollArrowStyles}
          onClick={() => handleScroll('left')}
          aria-label="Scroll tabs left"
        >
          <ChevronLeftIcon size={24} />
        </button>
      )}

      {/* Tabs wrapper */}
      <div style={tabsWrapperStyles}>
        <div ref={scrollContainerRef} style={scrollContainerStyles}>
          {tabs.map((tabItem) => (
            <Tab
              key={tabItem.id}
              label={tabItem.label}
              isActive={activeTab === tabItem.id}
              iconPosition={iconPosition}
              icon={tabItem.icon}
              badge={tabItem.badge}
              onDark={onDark}
              inverted={inverted}
              mobileFooter={mobileFooter}
              disabled={tabItem.disabled}
              onClick={() => !tabItem.disabled && onTabChange(tabItem.id)}
              style={stretched ? { flex: 1 } : undefined}
            />
          ))}
        </div>
      </div>

      {/* Right scroll arrow */}
      {scrollable && (
        <button
          style={scrollArrowStyles}
          onClick={() => handleScroll('right')}
          aria-label="Scroll tabs right"
        >
          <ChevronRightIcon size={24} />
        </button>
      )}

      {/* Divider */}
      {hasDivider && <span style={dividerStyles} />}
    </div>
  )
}

// =============================================================================
// EXPORTS
// =============================================================================

export default Tab
