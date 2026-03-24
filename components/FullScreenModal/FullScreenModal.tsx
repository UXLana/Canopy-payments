'use client'

import React, { forwardRef, useEffect, useCallback, useState } from 'react'
import {
  typography,
  shadows,
  transitionPresets,
  zIndex,
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

/** Number of content columns for the modal body */
export type FullScreenModalColumns = 1 | 2 | 3

/** Configuration for a header action button */
export interface FullScreenModalHeaderButton {
  label: string
  emphasis: 'high' | 'mid' | 'low'
  onClick: () => void
  disabled?: boolean
  loading?: boolean
  icon?: React.ReactNode
}

/** Panel background variant */
export type FullScreenModalPanelBackground = 'light' | 'muted'

/** Panel border position */
export type FullScreenModalPanelBorder = 'left' | 'right' | 'none'

export interface FullScreenModalProps {
  /** Controls modal visibility */
  open: boolean
  /** Callback when close is triggered */
  onClose: () => void
  /** Title in the header bar */
  title: string
  /** Optional subtitle below the title */
  subtitle?: string
  /** Number of body columns: 1, 2, or 3. Responsive. */
  columns?: FullScreenModalColumns
  /** Body content — use FullScreenModalPanel for structured layout */
  children: React.ReactNode
  /** 0–2 header action buttons */
  headerButtons?: FullScreenModalHeaderButton[]
  /** Close on Escape key press */
  closeOnEscape?: boolean
  /** Close on backdrop click */
  closeOnBackdrop?: boolean
  /** Additional CSS class */
  className?: string
}

export interface FullScreenModalPanelProps {
  children: React.ReactNode
  /** Panel background: 'light' or 'muted' */
  background?: FullScreenModalPanelBackground
  /** Border side: 'left', 'right', or 'none' */
  border?: FullScreenModalPanelBorder
  /** Additional CSS class */
  className?: string
  /** Sticky panel with independent scrolling */
  sticky?: boolean
}

// =============================================================================
// CLOSE ICON (inline SVG to avoid external dependencies)
// =============================================================================

const CloseIcon: React.FC<{ size?: number }> = ({ size = 20 }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={2}
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
    focusable="false"
  >
    <line x1="18" y1="6" x2="6" y2="18" />
    <line x1="6" y1="6" x2="18" y2="18" />
  </svg>
)

// =============================================================================
// FULL SCREEN MODAL
// =============================================================================

/**
 * FullScreenModal — A full-viewport modal overlay with a configurable header
 * (0–2 action buttons), and a responsive multi-column body layout (1, 2, or 3 columns).
 *
 * Use for multi-step forms, detail views, editors, or any flow that benefits
 * from the full screen real estate while maintaining a clear path back.
 *
 * Features:
 * - Theme-aware via `useColors()`
 * - Fade-in entrance animation
 * - Accessible: `role="dialog"`, `aria-modal`, Escape to close
 * - Body scroll lock while open
 * - Respects `prefers-reduced-motion`
 * - Configurable 1/2/3 column grid body
 * - Optional header action buttons via `headerButtons`
 * - Sub-component `FullScreenModalPanel` for structured content
 *
 * @example
 * ```tsx
 * <FullScreenModal
 *   open={isOpen}
 *   onClose={() => setIsOpen(false)}
 *   title="Edit Product"
 *   columns={2}
 *   headerButtons={[
 *     { label: 'Save', emphasis: 'high', onClick: handleSave },
 *   ]}
 * >
 *   <FullScreenModalPanel>
 *     <ProductForm />
 *   </FullScreenModalPanel>
 *   <FullScreenModalPanel background="muted" border="left" sticky>
 *     <ProductPreview />
 *   </FullScreenModalPanel>
 * </FullScreenModal>
 * ```
 */
export const FullScreenModal = forwardRef<HTMLDivElement, FullScreenModalProps>(
  (
    {
      open,
      onClose,
      title,
      subtitle,
      columns = 1,
      children,
      headerButtons,
      closeOnEscape = true,
      closeOnBackdrop = true,
      className,
    },
    ref,
  ) => {
    const colors = useColors()
    const prefersReducedMotion = usePrefersReducedMotion()

    const handleEscape = useCallback(
      (e: KeyboardEvent) => {
        if (e.key === 'Escape' && closeOnEscape) onClose()
      },
      [onClose, closeOnEscape],
    )

    useEffect(() => {
      if (!open) return
      window.addEventListener('keydown', handleEscape)
      return () => window.removeEventListener('keydown', handleEscape)
    }, [open, handleEscape])

    useEffect(() => {
      if (open) {
        document.body.style.overflow = 'hidden'
      }
      return () => {
        document.body.style.overflow = ''
      }
    }, [open])

    if (!open) return null

    const gridTemplateColumns =
      columns === 3
        ? 'repeat(3, 1fr)'
        : columns === 2
          ? 'repeat(2, 1fr)'
          : '1fr'

    return (
      <div
        ref={ref}
        role="dialog"
        aria-modal="true"
        aria-label={title}
        style={{
          position: 'fixed',
          inset: 0,
          zIndex: zIndex?.overlay ?? 50,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: colors.scrim,
          backdropFilter: 'blur(4px)',
          animation: prefersReducedMotion ? 'none' : 'fadeIn 200ms ease-out',
        }}
        onClick={closeOnBackdrop ? onClose : undefined}
      >
        <div
          className={className}
          style={{
            width: '100%',
            height: '100dvh',
            display: 'flex',
            flexDirection: 'column',
            overflow: 'hidden',
            backgroundColor: colors.surface.light,
            boxShadow: shadows?.xl ?? '0 25px 50px -12px rgba(0,0,0,.25)',
            transition: transitionPresets?.slow ?? 'all 300ms ease-in-out',
            position: 'relative',
          }}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              paddingLeft: 24,
              paddingRight: 24,
              height: 64,
              flexShrink: 0,
              backgroundColor: colors.surface.light,
              borderBottom: `1px solid ${colors.border.lowEmphasis.onLight}`,
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 16, minWidth: 0 }}>
              <button
                onClick={onClose}
                aria-label="Close"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  padding: 8,
                  borderRadius: '50%',
                  border: 'none',
                  background: 'transparent',
                  cursor: 'pointer',
                  color: colors.text.disabled.onLight,
                  flexShrink: 0,
                  transition: 'background-color 150ms',
                }}
                onMouseEnter={(e) => {
                  ;(e.currentTarget as HTMLButtonElement).style.backgroundColor =
                    colors.hover?.onLight ?? 'rgba(0,0,0,0.04)'
                }}
                onMouseLeave={(e) => {
                  ;(e.currentTarget as HTMLButtonElement).style.backgroundColor = 'transparent'
                }}
              >
                <CloseIcon size={20} />
              </button>
              <div style={{ minWidth: 0 }}>
                <div
                  style={{
                    ...typography.label.md,
                    color: colors.text.highEmphasis.onLight,
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap',
                  }}
                >
                  {title}
                </div>
                {subtitle && (
                  <div
                    style={{
                      ...typography.body.xs,
                      color: colors.text.lowEmphasis.onLight,
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      whiteSpace: 'nowrap',
                    }}
                  >
                    {subtitle}
                  </div>
                )}
              </div>
            </div>

            {headerButtons && headerButtons.length > 0 && (
              <div style={{ display: 'flex', alignItems: 'center', gap: 12, flexShrink: 0 }}>
                {headerButtons.map((btn, i) => (
                  <Button
                    key={i}
                    emphasis={btn.emphasis}
                    onClick={btn.onClick}
                    disabled={btn.disabled}
                    loading={btn.loading}
                    leftIcon={btn.icon}
                  >
                    {btn.label}
                  </Button>
                ))}
              </div>
            )}
          </div>

          {/* Body */}
          <div style={{ flex: 1, overflow: 'hidden', width: '100%' }}>
            <div style={{ height: '100%', overflowY: 'auto', width: '100%' }}>
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns,
                  minHeight: '100%',
                  width: '100%',
                }}
              >
                {children}
              </div>
            </div>
          </div>
        </div>

        {/* Keyframe for fade-in (injected once) */}
        <style>{`
          @keyframes fadeIn {
            from { opacity: 0; }
            to { opacity: 1; }
          }
        `}</style>
      </div>
    )
  },
)

FullScreenModal.displayName = 'FullScreenModal'

// =============================================================================
// FULL SCREEN MODAL PANEL
// =============================================================================

/**
 * FullScreenModalPanel — Content panel for use inside FullScreenModal.
 *
 * Provides consistent padding, optional muted background, side border, and
 * sticky mode for independent scrolling (useful for previews and sidebars).
 *
 * @example
 * ```tsx
 * <FullScreenModalPanel background="muted" border="left" sticky>
 *   <Preview />
 * </FullScreenModalPanel>
 * ```
 */
export const FullScreenModalPanel = forwardRef<HTMLDivElement, FullScreenModalPanelProps>(
  ({ children, background = 'light', border = 'none', className, sticky = false }, ref) => {
    const colors = useColors()

    const borderStyle: React.CSSProperties =
      border === 'left'
        ? { borderLeft: `1px solid ${colors.border.lowEmphasis.onLight}` }
        : border === 'right'
          ? { borderRight: `1px solid ${colors.border.lowEmphasis.onLight}` }
          : {}

    const panelStyle: React.CSSProperties = {
      width: '100%',
      padding: '40px 48px 48px',
      display: 'flex',
      flexDirection: 'column',
      transition: 'background-color 200ms',
      backgroundColor:
        background === 'muted' ? colors.surface.lightDarker : colors.surface.light,
      ...borderStyle,
    }

    return (
      <div ref={ref} className={className} style={panelStyle}>
        {sticky ? (
          <div
            style={{
              position: 'sticky',
              top: 0,
              display: 'flex',
              flexDirection: 'column',
              width: '100%',
              height: '100%',
              overflowY: 'auto',
            }}
          >
            {children}
          </div>
        ) : (
          children
        )}
      </div>
    )
  },
)

FullScreenModalPanel.displayName = 'FullScreenModalPanel'
