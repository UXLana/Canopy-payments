'use client'

import React, { forwardRef, useState, useEffect, useRef, useCallback } from 'react'
import {
  fontFamilies,
  shadows,
  transitionPresets,
  zIndex,
  button as buttonTokens,
} from '../../styles/design-tokens'
import { useColors } from '../../styles/themes'
import { Button } from '../Button'

// =============================================================================
// REDUCED MOTION HOOK
// =============================================================================

function usePrefersReducedMotion(): boolean {
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false)

  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)')
    setPrefersReducedMotion(mq.matches)
    const handler = (e: MediaQueryListEvent) => setPrefersReducedMotion(e.matches)
    mq.addEventListener('change', handler)
    return () => mq.removeEventListener('change', handler)
  }, [])

  return prefersReducedMotion
}

// =============================================================================
// TYPES
// =============================================================================

/**
 * Visual variant of the dialog.
 * - `warning` — Amber icon, standard confirm button (for cautionary actions)
 * - `destructive` — Red icon, destructive confirm button (for irreversible actions)
 * - `info` — Blue icon, standard confirm button (for informational confirmations)
 */
export type ConfirmDialogVariant = 'warning' | 'destructive' | 'info'

/**
 * Props for the ConfirmDialog component.
 */
export interface ConfirmDialogProps {
  /** Whether the dialog is open */
  open: boolean
  /** Dialog title */
  title: string
  /** Dialog description/body text */
  description: string
  /** Label for the confirm button. Default: `'Confirm'` */
  confirmLabel?: string
  /** Label for the cancel button. Default: `'Cancel'` */
  cancelLabel?: string
  /** Visual variant. Default: `'warning'` */
  variant?: ConfirmDialogVariant
  /** Callback when the user confirms */
  onConfirm: () => void
  /** Callback when the user cancels (also fires on Escape and backdrop click) */
  onCancel: () => void
  /** Optional custom icon to override the default variant icon */
  icon?: React.ReactNode
  /** Custom styles for the dialog panel */
  style?: React.CSSProperties
  /** Custom class name */
  className?: string
}

// =============================================================================
// DIALOG TOKENS (component-specific sizing & spacing)
// =============================================================================

const dialog = {
  panel: {
    maxWidth: '400px',
    width: '100%',
    padding: '24px',
    borderRadius: '12px',
    gap: '20px',
  },
  icon: {
    containerSize: '40px',
    iconSize: 20,
    borderRadius: '50%',
  },
  content: {
    gap: '4px',
  },
  title: {
    fontSize: '18px',
    fontWeight: 700,
    lineHeight: '24px',
  },
  description: {
    fontSize: '14px',
    fontWeight: 400,
    lineHeight: '22px',
  },
  actions: {
    gap: '12px',
    marginTop: '4px',
  },
} as const

// =============================================================================
// INLINE SVG ICONS
// =============================================================================

function AlertTriangleIcon({ size = 20, color = 'currentColor' }: { size?: number; color?: string }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 20 20"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
      focusable="false"
    >
      <path
        d="M8.575 3.217L1.517 15.001A1.667 1.667 0 0 0 2.96 17.501h14.08A1.667 1.667 0 0 0 18.483 15.001L11.425 3.217a1.667 1.667 0 0 0-2.85 0zM10 7.501V10.834M10 14.168h.008"
        stroke={color}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

function InfoCircleIcon({ size = 20, color = 'currentColor' }: { size?: number; color?: string }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 20 20"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
      focusable="false"
    >
      <circle cx="10" cy="10" r="8.333" stroke={color} strokeWidth="1.5" />
      <path
        d="M10 13.333V10M10 6.667h.008"
        stroke={color}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

function ErrorCircleIcon({ size = 20, color = 'currentColor' }: { size?: number; color?: string }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 20 20"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
      focusable="false"
    >
      <circle cx="10" cy="10" r="8.333" stroke={color} strokeWidth="1.5" />
      <path
        d="M12.5 7.5L7.5 12.5M7.5 7.5L12.5 12.5"
        stroke={color}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

// =============================================================================
// FOCUS TRAP HOOK (WCAG 2.4.3)
// =============================================================================

function useFocusTrap(
  containerRef: React.RefObject<HTMLDivElement | null>,
  isActive: boolean,
  onEscape: () => void,
) {
  const previouslyFocusedRef = useRef<HTMLElement | null>(null)

  useEffect(() => {
    if (!isActive || !containerRef.current) return

    // Store currently focused element
    previouslyFocusedRef.current = document.activeElement as HTMLElement

    const container = containerRef.current
    const focusableSelector =
      'button:not([disabled]), [href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])'

    // Focus the first focusable element inside the dialog
    const firstFocusable = container.querySelector<HTMLElement>(focusableSelector)
    if (firstFocusable) {
      setTimeout(() => firstFocusable.focus(), 50)
    }

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault()
        onEscape()
        return
      }

      if (e.key !== 'Tab') return

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

    document.addEventListener('keydown', handleKeyDown)

    return () => {
      document.removeEventListener('keydown', handleKeyDown)
      // Return focus to previously focused element (WCAG 2.4.3)
      if (previouslyFocusedRef.current) {
        previouslyFocusedRef.current.focus()
        previouslyFocusedRef.current = null
      }
    }
  }, [isActive, containerRef, onEscape])
}

// =============================================================================
// CONFIRM DIALOG COMPONENT
// =============================================================================

/**
 * ConfirmDialog — Modal dialog for confirming user actions.
 *
 * Features:
 * - Theme-aware via `useColors()`
 * - Three variants: warning, destructive, info
 * - Uses DS `Button` component for actions
 * - Accessible: `role="alertdialog"`, `aria-modal`, focus trap, Escape to close
 * - Backdrop click to cancel
 * - Respects `prefers-reduced-motion`
 * - Locks body scroll when open
 *
 * @example
 * ```tsx
 * <ConfirmDialog
 *   open={showConfirm}
 *   title="Delete product?"
 *   description="This action cannot be undone. The product will be permanently removed."
 *   variant="destructive"
 *   confirmLabel="Delete"
 *   onConfirm={handleDelete}
 *   onCancel={() => setShowConfirm(false)}
 * />
 * ```
 */
export const ConfirmDialog = forwardRef<HTMLDivElement, ConfirmDialogProps>(function ConfirmDialog(
  {
    open,
    title,
    description,
    confirmLabel = 'Confirm',
    cancelLabel = 'Cancel',
    variant = 'warning',
    onConfirm,
    onCancel,
    icon,
    style,
    className,
  },
  ref,
) {
  const colors = useColors()
  const reducedMotion = usePrefersReducedMotion()
  const panelRef = useRef<HTMLDivElement>(null)
  const [isRendered, setIsRendered] = useState(false)
  const [isAnimatingIn, setIsAnimatingIn] = useState(false)

  // Focus trap
  useFocusTrap(panelRef, open, onCancel)

  // Lock body scroll when open
  useEffect(() => {
    if (open) {
      document.body.style.overflow = 'hidden'
    }
    return () => {
      document.body.style.overflow = ''
    }
  }, [open])

  // Animation mount/unmount
  useEffect(() => {
    if (open) {
      setIsRendered(true)
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          setIsAnimatingIn(true)
        })
      })
    } else {
      setIsAnimatingIn(false)
      const exitTimer = setTimeout(() => {
        setIsRendered(false)
      }, reducedMotion ? 0 : 200)
      return () => clearTimeout(exitTimer)
    }
  }, [open, reducedMotion])

  if (!isRendered) return null

  // Variant-specific config
  const variantConfig = {
    warning: {
      iconColor: colors.status.warning,
      iconBg: colors.iconBg?.warning ?? 'rgba(255, 171, 0, 0.12)',
      iconElement: <AlertTriangleIcon size={dialog.icon.iconSize} color={colors.status.warning} />,
      isDestructive: false,
    },
    destructive: {
      iconColor: colors.status.important,
      iconBg: colors.iconBg?.important ?? 'rgba(255, 59, 48, 0.12)',
      iconElement: <ErrorCircleIcon size={dialog.icon.iconSize} color={colors.status.important} />,
      isDestructive: true,
    },
    info: {
      iconColor: colors.status.info,
      iconBg: colors.iconBg?.info ?? 'rgba(0, 122, 255, 0.12)',
      iconElement: <InfoCircleIcon size={dialog.icon.iconSize} color={colors.status.info} />,
      isDestructive: false,
    },
  }

  const config = variantConfig[variant]

  // Scrim style
  const scrimStyle: React.CSSProperties = {
    position: 'fixed',
    inset: 0,
    zIndex: zIndex.modal ?? 1000,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '16px',
    backgroundColor: isAnimatingIn ? 'rgba(0, 0, 0, 0.4)' : 'rgba(0, 0, 0, 0)',
    backdropFilter: isAnimatingIn ? 'blur(4px)' : 'none',
    transition: reducedMotion ? 'none' : `background-color 200ms ease, backdrop-filter 200ms ease`,
  }

  // Panel style
  const panelStyle: React.CSSProperties = {
    maxWidth: dialog.panel.maxWidth,
    width: dialog.panel.width,
    padding: dialog.panel.padding,
    borderRadius: dialog.panel.borderRadius,
    backgroundColor: colors.surface.light,
    border: `1px solid ${colors.border.lowEmphasis.onLight}`,
    boxShadow: shadows['2xl'],
    opacity: isAnimatingIn ? 1 : 0,
    transform: isAnimatingIn ? 'scale(1)' : 'scale(0.95)',
    transition: reducedMotion
      ? 'none'
      : `opacity 200ms ease, transform 200ms ease`,
    ...style,
  }

  const headerStyle: React.CSSProperties = {
    display: 'flex',
    gap: '16px',
    marginBottom: dialog.panel.gap,
  }

  const iconContainerStyle: React.CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: dialog.icon.containerSize,
    height: dialog.icon.containerSize,
    borderRadius: dialog.icon.borderRadius,
    backgroundColor: config.iconBg,
    flexShrink: 0,
  }

  const titleStyle: React.CSSProperties = {
    fontFamily: fontFamilies.body,
    fontSize: dialog.title.fontSize,
    fontWeight: dialog.title.fontWeight,
    lineHeight: dialog.title.lineHeight,
    color: colors.text.highEmphasis.onLight,
    margin: 0,
    marginBottom: dialog.content.gap,
  }

  const descriptionStyle: React.CSSProperties = {
    fontFamily: fontFamilies.body,
    fontSize: dialog.description.fontSize,
    fontWeight: dialog.description.fontWeight,
    lineHeight: dialog.description.lineHeight,
    color: colors.text.lowEmphasis.onLight,
    margin: 0,
  }

  const actionsStyle: React.CSSProperties = {
    display: 'flex',
    justifyContent: 'flex-end',
    gap: dialog.actions.gap,
    marginTop: dialog.actions.marginTop,
  }

  const titleId = 'confirm-dialog-title'
  const descId = 'confirm-dialog-desc'

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onCancel()
    }
  }

  return (
    <div
      ref={ref}
      style={scrimStyle}
      onClick={handleBackdropClick}
      aria-hidden="true"
    >
      <div
        ref={panelRef}
        role="alertdialog"
        aria-modal="true"
        aria-labelledby={titleId}
        aria-describedby={descId}
        style={panelStyle}
        className={className}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header: icon + content */}
        <div style={headerStyle}>
          <div style={iconContainerStyle} aria-hidden="true">
            {icon ?? config.iconElement}
          </div>
          <div style={{ paddingTop: '2px' }}>
            <h2 id={titleId} style={titleStyle}>{title}</h2>
            <p id={descId} style={descriptionStyle}>{description}</p>
          </div>
        </div>

        {/* Actions */}
        <div style={actionsStyle}>
          <Button emphasis="mid" onClick={onCancel}>
            {cancelLabel}
          </Button>
          <Button
            emphasis="high"
            destructive={config.isDestructive}
            onClick={onConfirm}
          >
            {confirmLabel}
          </Button>
        </div>
      </div>
    </div>
  )
})

ConfirmDialog.displayName = 'ConfirmDialog'
