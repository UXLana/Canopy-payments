'use client'

import React, {
  useState,
  useCallback,
  createContext,
  useContext,
  useRef,
  useEffect,
} from 'react'
import {
  colors,
  typography,
  spacing,
  borderRadius,
  transitionPresets,
} from '@/styles/design-tokens'

// =============================================================================
// TYPES
// =============================================================================

export type AccordionVariant = 'default' | 'filled' | 'inverted'

export interface AccordionItemProps {
  /** Unique identifier for the item */
  id: string
  /** Title displayed in the accordion header */
  title: string
  /** Content shown when the accordion is expanded */
  children: React.ReactNode
  /** Whether this item is disabled */
  disabled?: boolean
  /** Whether to show the overflow menu button */
  showMenu?: boolean
  /** Callback when menu button is clicked */
  onMenuClick?: (id: string) => void
  /** Custom icon to display instead of chevron */
  icon?: React.ReactNode
  /** Text value to display on the right side (alternative to menu button) */
  value?: string
  /** Callback when value text is clicked */
  onValueClick?: (id: string) => void
}

export interface AccordionProps {
  /** Array of accordion items */
  children: React.ReactNode
  /** Visual variant: default (dividers), filled (gray bg on white), inverted (white bg on gray) */
  variant?: AccordionVariant
  /** Whether only one item can be expanded at a time */
  allowMultiple?: boolean
  /** Array of initially expanded item IDs */
  defaultExpandedIds?: string[]
  /** Controlled expanded state */
  expandedIds?: string[]
  /** Callback when expansion state changes */
  onExpandedChange?: (expandedIds: string[]) => void
  /** Whether accordion takes full width */
  fullWidth?: boolean
  /** Additional CSS class name */
  className?: string
  /** Additional inline styles */
  style?: React.CSSProperties
}

// =============================================================================
// ICONS
// =============================================================================

const ChevronIcon = ({ expanded }: { expanded: boolean }) => (
  <svg
    width="20"
    height="20"
    viewBox="0 0 20 20"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    style={{
      transform: expanded ? 'rotate(90deg)' : 'rotate(0deg)',
      transition: 'transform 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
    }}
  >
    <polyline points="7 5 12 10 7 15" />
  </svg>
)

const MenuIcon = () => (
  <svg
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <circle cx="12" cy="12" r="1" />
    <circle cx="12" cy="5" r="1" />
    <circle cx="12" cy="19" r="1" />
  </svg>
)

// =============================================================================
// CONTEXT
// =============================================================================

interface AccordionContextValue {
  expandedIds: string[]
  toggleItem: (id: string) => void
  variant: AccordionVariant
  fullWidth: boolean
}

const AccordionContext = createContext<AccordionContextValue | null>(null)

const useAccordionContext = () => {
  const context = useContext(AccordionContext)
  if (!context) {
    throw new Error('AccordionItem must be used within an Accordion')
  }
  return context
}

// =============================================================================
// STYLES
// =============================================================================

const styles = {
  accordion: {
    display: 'flex',
    flexDirection: 'column' as const,
    width: '100%',
  },


  item: {
    display: 'flex',
    flexDirection: 'column' as const,
    width: '100%',
  },

  // Filled variant: gray background panels on white surface
  itemFilled: {
    background: colors.surface.paper,
    borderRadius: borderRadius.md,
    marginBottom: spacing.xs,
  },

  // Inverted variant: white background panels on gray surface
  itemInverted: {
    background: colors.surface.default,
    borderRadius: borderRadius.md,
    marginBottom: spacing.xs,
  },


  header: {
    display: 'flex',
    alignItems: 'center',
    gap: spacing.xs,
    padding: `${spacing.xs} 0`,
    cursor: 'pointer',
    userSelect: 'none' as const,
    transition: transitionPresets.default,
  },

  // Full width: add horizontal padding so icon doesn't touch edge
  headerFullWidth: {
    paddingLeft: spacing.md,
    paddingRight: spacing.md,
  },

  headerFilled: {
    padding: `${spacing.sm} ${spacing.md}`,
    borderRadius: borderRadius.md,
  },

  headerDisabled: {
    cursor: 'not-allowed',
    opacity: 0.5,
  },

  headerHover: {
    background: 'rgba(0, 0, 0, 0.04)',
  },

  headerHoverInverted: {
    background: 'rgba(0, 0, 0, 0.02)',
  },

  expander: {
    display: 'flex',
    alignItems: 'center',
    flex: 1,
    minWidth: 0,
    gap: spacing.xs,
  },

  iconWrapper: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: '20px',
    height: '20px',
    color: colors.text.lowEmphasis.onLight,
    flexShrink: 0,
  },

  title: {
    ...typography.heading.h5,
    color: colors.text.highEmphasis.onLight,
    margin: 0,
    flex: 1,
    minWidth: 0,
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap' as const,
  },

  menuButton: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: '40px',
    height: '40px',
    background: 'transparent',
    border: 'none',
    borderRadius: borderRadius.full,
    cursor: 'pointer',
    color: colors.text.lowEmphasis.onLight,
    transition: transitionPresets.default,
    flexShrink: 0,
  },

  menuButtonHover: {
    background: 'rgba(0, 0, 0, 0.06)',
    color: colors.text.highEmphasis.onLight,
  },

  valueText: {
    ...typography.body.md,
    color: colors.text.lowEmphasis.onLight,
    margin: 0,
    flexShrink: 0,
    cursor: 'pointer',
    transition: transitionPresets.default,
  },

  valueTextHover: {
    color: colors.text.highEmphasis.onLight,
  },

  contentWrapper: {
    overflow: 'hidden',
    transition: 'height 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
  },

  contentWrapperCollapsed: {
    height: 0,
  },

  content: {
    opacity: 1,
    transition: 'opacity 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
  },

  contentHidden: {
    opacity: 0,
  },

  // Default variant: content indented under icon
  contentPaddingDefault: {
    padding: `${spacing['2xs']} 0 ${spacing.md} ${spacing['2xl']}`,
  },

  // Default variant with full width: add right padding too
  contentPaddingDefaultFullWidth: {
    padding: `${spacing['2xs']} ${spacing.md} ${spacing.md} calc(${spacing.md} + ${spacing['2xl']})`, // left padding + icon indent
  },

  // Filled/Inverted variants: content aligned under title text, not icon
  contentPaddingFilled: {
    padding: `${spacing['2xs']} ${spacing.md} ${spacing.md} 36px`, // 20px icon + 8px gap + 8px extra = 36px to align under title
  },

  divider: {
    height: '1px',
    background: colors.stroke.light,
    margin: 0,
  },
}

// =============================================================================
// ACCORDION ITEM COMPONENT
// =============================================================================

export function AccordionItem({
  id,
  title,
  children,
  disabled = false,
  showMenu = false,
  onMenuClick,
  icon,
  value,
  onValueClick,
}: AccordionItemProps) {
  const { expandedIds, toggleItem, variant, fullWidth } = useAccordionContext()
  const [isHovered, setIsHovered] = useState(false)
  const [isMenuHovered, setIsMenuHovered] = useState(false)
  const [isValueHovered, setIsValueHovered] = useState(false)
  const [contentHeight, setContentHeight] = useState<number>(0)
  const contentRef = useRef<HTMLDivElement>(null)

  const isExpanded = expandedIds.includes(id)
  const isFilled = variant === 'filled'
  const isInverted = variant === 'inverted'
  const isCardStyle = isFilled || isInverted
  const isDefaultFullWidth = !isCardStyle && fullWidth

  // Measure content height when expanded or when children change
  useEffect(() => {
    if (contentRef.current) {
      const measureHeight = () => {
        const height = contentRef.current?.scrollHeight ?? 0
        setContentHeight(height)
      }

      // Measure immediately
      measureHeight()

      // Also observe for changes in content size
      const resizeObserver = new ResizeObserver(measureHeight)
      resizeObserver.observe(contentRef.current)

      return () => {
        resizeObserver.disconnect()
      }
    }
  }, [children, isExpanded])

  const handleClick = useCallback(() => {
    if (!disabled) {
      toggleItem(id)
    }
  }, [disabled, toggleItem, id])

  const handleMenuClick = useCallback(
    (e: React.MouseEvent) => {
      e.stopPropagation()
      onMenuClick?.(id)
    },
    [onMenuClick, id]
  )

  const handleValueClick = useCallback(
    (e: React.MouseEvent) => {
      e.stopPropagation()
      onValueClick?.(id)
    },
    [onValueClick, id]
  )

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (disabled) return
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault()
        toggleItem(id)
      }
    },
    [disabled, toggleItem, id]
  )

  const getItemStyle = () => {
    if (isFilled) return { ...styles.item, ...styles.itemFilled }
    if (isInverted) return { ...styles.item, ...styles.itemInverted }
    return styles.item
  }

  const getHeaderHoverStyle = () => {
    if (!isHovered || disabled) return {}
    if (isInverted) return styles.headerHoverInverted
    return styles.headerHover
  }

  const getContentPaddingStyle = () => {
    if (isCardStyle) return styles.contentPaddingFilled
    if (isDefaultFullWidth) return styles.contentPaddingDefaultFullWidth
    return styles.contentPaddingDefault
  }

  return (
    <div style={getItemStyle()}>
      <div
        role="button"
        tabIndex={disabled ? -1 : 0}
        aria-expanded={isExpanded}
        aria-disabled={disabled}
        style={{
          ...styles.header,
          ...(isDefaultFullWidth ? styles.headerFullWidth : {}),
          ...(isCardStyle ? styles.headerFilled : {}),
          ...(disabled ? styles.headerDisabled : {}),
          ...getHeaderHoverStyle(),
        }}
        onClick={handleClick}
        onKeyDown={handleKeyDown}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <div style={styles.expander}>
          <span style={styles.iconWrapper}>
            {icon || <ChevronIcon expanded={isExpanded} />}
          </span>
          <h3 style={styles.title}>{title}</h3>
        </div>

        {value && (
          <span
            role={onValueClick ? 'button' : undefined}
            tabIndex={onValueClick ? 0 : undefined}
            style={{
              ...styles.valueText,
              ...(isValueHovered && onValueClick ? styles.valueTextHover : {}),
              cursor: onValueClick ? 'pointer' : 'default',
            }}
            onClick={onValueClick ? handleValueClick : undefined}
            onKeyDown={
              onValueClick
                ? (e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault()
                      e.stopPropagation()
                      onValueClick(id)
                    }
                  }
                : undefined
            }
            onMouseEnter={() => setIsValueHovered(true)}
            onMouseLeave={() => setIsValueHovered(false)}
          >
            {value}
          </span>
        )}

        {showMenu && !value && (
          <button
            type="button"
            style={{
              ...styles.menuButton,
              ...(isMenuHovered ? styles.menuButtonHover : {}),
            }}
            onClick={handleMenuClick}
            onMouseEnter={() => setIsMenuHovered(true)}
            onMouseLeave={() => setIsMenuHovered(false)}
            aria-label="More options"
          >
            <MenuIcon />
          </button>
        )}
      </div>

      <div
        style={{
          ...styles.contentWrapper,
          height: isExpanded ? contentHeight : 0,
        }}
        aria-hidden={!isExpanded}
      >
        <div
          ref={contentRef}
          style={{
            ...styles.content,
            ...(isExpanded ? {} : styles.contentHidden),
            ...getContentPaddingStyle(),
          }}
        >
          {children}
        </div>
      </div>

      {!isCardStyle && <div style={styles.divider} />}
    </div>
  )
}

// =============================================================================
// ACCORDION COMPONENT
// =============================================================================

export function Accordion({
  children,
  variant = 'default',
  allowMultiple = true,
  defaultExpandedIds = [],
  expandedIds: controlledExpandedIds,
  onExpandedChange,
  fullWidth = true,
  className,
  style,
}: AccordionProps) {
  const [internalExpandedIds, setInternalExpandedIds] =
    useState<string[]>(defaultExpandedIds)

  const isControlled = controlledExpandedIds !== undefined
  const expandedIds = isControlled ? controlledExpandedIds : internalExpandedIds

  const toggleItem = useCallback(
    (id: string) => {
      const newExpandedIds = expandedIds.includes(id)
        ? expandedIds.filter((expandedId) => expandedId !== id)
        : allowMultiple
        ? [...expandedIds, id]
        : [id]

      if (!isControlled) {
        setInternalExpandedIds(newExpandedIds)
      }
      onExpandedChange?.(newExpandedIds)
    },
    [expandedIds, allowMultiple, isControlled, onExpandedChange]
  )

  const contextValue: AccordionContextValue = {
    expandedIds,
    toggleItem,
    variant,
    fullWidth,
  }

  return (
    <AccordionContext.Provider value={contextValue}>
      <div
        className={className}
        style={{
          ...styles.accordion,
          width: fullWidth ? '100%' : 'auto',
          ...style,
        }}
        role="region"
      >
        {children}
      </div>
    </AccordionContext.Provider>
  )
}

// Set display names for debugging
Accordion.displayName = 'Accordion'
AccordionItem.displayName = 'AccordionItem'
