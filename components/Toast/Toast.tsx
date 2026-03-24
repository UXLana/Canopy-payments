'use client'

import React, {
  forwardRef,
  useState,
  useEffect,
  useCallback,
  useRef,
  createContext,
  useContext,
} from 'react'
import {
  fontFamilies,
  shadows,
  transitionPresets,
  zIndex,
} from '@/styles/design-tokens'
import { useColors } from '@/styles/themes'

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
 * Visual variant of the toast, determines icon and accent color.
 * - `success` — Confirms a completed action (green check icon)
 * - `error` — Reports a failure or problem (red X icon)
 * - `warning` — Alerts to a potential issue (amber triangle icon)
 * - `info` — Provides neutral information (blue info icon)
 */
export type ToastVariant = 'success' | 'error' | 'warning' | 'info'

/**
 * Horizontal position of the toast on the viewport.
 */
export type ToastPosition = 'center' | 'left' | 'right'

/**
 * Props for the Toast component.
 */
export interface ToastProps {
  /** The message to display */
  message: string
  /** Visual variant — controls icon and accent color */
  variant?: ToastVariant
  /** Whether the toast is currently visible */
  isVisible: boolean
  /** Callback when the toast should close */
  onClose: () => void
  /** Auto-dismiss duration in milliseconds. Set to `0` to disable. Default: `4000` */
  duration?: number
  /** Whether to show the close (X) button. Default: `true` */
  showClose?: boolean
  /** Horizontal position on the viewport. Default: `'center'` */
  position?: ToastPosition
  /** Optional action button */
  action?: {
    label: string
    onClick: () => void
  }
  /** Custom styles for the root element */
  style?: React.CSSProperties
  /** Custom class name */
  className?: string
}

// =============================================================================
// TOAST TOKENS (component-specific sizing & spacing)
// =============================================================================

const toast = {
  minWidth: '320px',
  maxWidth: '480px',
  padding: { x: '16px', y: '12px' },
  gap: '12px',
  borderRadius: '12px',
  icon: {
    containerSize: '24px',
    iconSize: 14,
    borderRadius: '50%',
  },
  close: {
    size: '28px',
    iconSize: 16,
    borderRadius: '6px',
  },
  typography: {
    message: {
      fontSize: '14px',
      fontWeight: 500,
      lineHeight: '20px',
    },
    action: {
      fontSize: '13px',
      fontWeight: 600,
      lineHeight: '18px',
    },
  },
  offset: '32px', // distance from bottom of viewport
} as const

// =============================================================================
// INLINE SVG ICONS
// =============================================================================

function CheckIcon({ size = 14, color = 'currentColor' }: { size?: number; color?: string }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 14 14"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
      focusable="false"
    >
      <path
        d="M11.6667 3.5L5.25 9.91667L2.33334 7"
        stroke={color}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

function XIcon({ size = 16, color = 'currentColor' }: { size?: number; color?: string }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 16 16"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
      focusable="false"
    >
      <path
        d="M12 4L4 12M4 4L12 12"
        stroke={color}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

function AlertTriangleIcon({ size = 14, color = 'currentColor' }: { size?: number; color?: string }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 14 14"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
      focusable="false"
    >
      <path
        d="M6.06 2.347L1.067 10.5A1.167 1.167 0 0 0 2.073 12.25H11.927A1.167 1.167 0 0 0 12.933 10.5L7.94 2.347a1.167 1.167 0 0 0-1.88 0zM7 5.25V7.583M7 9.917H7.006"
        stroke={color}
        strokeWidth="1.3"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

function InfoIcon({ size = 14, color = 'currentColor' }: { size?: number; color?: string }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 14 14"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
      focusable="false"
    >
      <circle cx="7" cy="7" r="5.833" stroke={color} strokeWidth="1.3" />
      <path
        d="M7 9.333V7M7 4.667h.006"
        stroke={color}
        strokeWidth="1.3"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

function ErrorXIcon({ size = 14, color = 'currentColor' }: { size?: number; color?: string }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 14 14"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
      focusable="false"
    >
      <circle cx="7" cy="7" r="5.833" stroke={color} strokeWidth="1.3" />
      <path
        d="M8.75 5.25L5.25 8.75M5.25 5.25L8.75 8.75"
        stroke={color}
        strokeWidth="1.3"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

// =============================================================================
// TOAST COMPONENT
// =============================================================================

/**
 * Toast — Displays brief, non-blocking feedback messages.
 *
 * Features:
 * - Theme-aware via `useColors()`
 * - Four variants: success, error, warning, info
 * - Auto-dismiss with configurable duration (default 4s)
 * - Close button and optional action button
 * - Accessible: `role="alert"` with appropriate `aria-live` region
 * - Respects `prefers-reduced-motion`
 * - Fixed viewport positioning (bottom center/left/right)
 *
 * @example
 * ```tsx
 * <Toast
 *   message="Product saved successfully"
 *   variant="success"
 *   isVisible={showToast}
 *   onClose={() => setShowToast(false)}
 * />
 * ```
 */
export const Toast = forwardRef<HTMLDivElement, ToastProps>(function Toast(
  {
    message,
    variant = 'success',
    isVisible,
    onClose,
    duration = 4000,
    showClose = true,
    position = 'center',
    action,
    style,
    className,
  },
  ref,
) {
  const colors = useColors()
  const reducedMotion = usePrefersReducedMotion()
  const [isCloseHovered, setIsCloseHovered] = useState(false)
  const [isActionHovered, setIsActionHovered] = useState(false)
  const [isRendered, setIsRendered] = useState(false)
  const [isAnimatingIn, setIsAnimatingIn] = useState(false)
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  // Manage mount/unmount for animation
  useEffect(() => {
    if (isVisible) {
      setIsRendered(true)
      // Trigger animation on next frame
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          setIsAnimatingIn(true)
        })
      })
    } else {
      setIsAnimatingIn(false)
      // Wait for exit animation, then unmount
      const exitTimer = setTimeout(() => {
        setIsRendered(false)
      }, reducedMotion ? 0 : 200)
      return () => clearTimeout(exitTimer)
    }
  }, [isVisible, reducedMotion])

  // Auto-dismiss timer
  useEffect(() => {
    if (isVisible && duration > 0) {
      timerRef.current = setTimeout(onClose, duration)
      return () => {
        if (timerRef.current) clearTimeout(timerRef.current)
      }
    }
  }, [isVisible, duration, onClose])

  // Pause timer on hover
  const handleMouseEnter = useCallback(() => {
    if (timerRef.current) clearTimeout(timerRef.current)
  }, [])

  const handleMouseLeave = useCallback(() => {
    if (isVisible && duration > 0) {
      timerRef.current = setTimeout(onClose, duration)
    }
  }, [isVisible, duration, onClose])

  if (!isRendered) return null

  // Variant-specific colors
  const variantConfig = {
    success: {
      iconBg: colors.status.success,
      icon: <CheckIcon size={toast.icon.iconSize} color={colors.text.highEmphasis.onDark} />,
      ariaLive: 'polite' as const,
    },
    error: {
      iconBg: colors.status.important,
      icon: <ErrorXIcon size={toast.icon.iconSize} color={colors.text.highEmphasis.onDark} />,
      ariaLive: 'assertive' as const,
    },
    warning: {
      iconBg: colors.status.warning,
      icon: <AlertTriangleIcon size={toast.icon.iconSize} color={colors.text.highEmphasis.onDark} />,
      ariaLive: 'assertive' as const,
    },
    info: {
      iconBg: colors.brand.default,
      icon: <InfoIcon size={toast.icon.iconSize} color={colors.text.highEmphasis.onDark} />,
      ariaLive: 'polite' as const,
    },
  }

  const config = variantConfig[variant]

  // Position alignment
  const positionStyles: Record<ToastPosition, React.CSSProperties> = {
    center: { left: '50%', transform: `translateX(-50%) translateY(${isAnimatingIn ? '0' : '16px'})` },
    left: { left: toast.offset, transform: `translateY(${isAnimatingIn ? '0' : '16px'})` },
    right: { right: toast.offset, transform: `translateY(${isAnimatingIn ? '0' : '16px'})` },
  }

  const rootStyle: React.CSSProperties = {
    position: 'fixed',
    bottom: toast.offset,
    zIndex: zIndex.toast ?? 9999,
    display: 'flex',
    alignItems: 'center',
    gap: toast.gap,
    minWidth: toast.minWidth,
    maxWidth: toast.maxWidth,
    padding: `${toast.padding.y} ${toast.padding.x}`,
    borderRadius: toast.borderRadius,
    backgroundColor: colors.surface.darkDarker,
    border: `1px solid ${colors.border.lowEmphasis.onDark}`,
    boxShadow: shadows['2xl'],
    opacity: isAnimatingIn ? 1 : 0,
    transition: reducedMotion
      ? 'none'
      : `opacity 200ms ease, transform 200ms ease`,
    ...positionStyles[position],
    ...style,
  }

  const iconContainerStyle: React.CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: toast.icon.containerSize,
    height: toast.icon.containerSize,
    borderRadius: toast.icon.borderRadius,
    backgroundColor: config.iconBg,
    flexShrink: 0,
  }

  const messageStyle: React.CSSProperties = {
    flex: 1,
    fontFamily: fontFamilies.body,
    fontSize: toast.typography.message.fontSize,
    fontWeight: toast.typography.message.fontWeight,
    lineHeight: toast.typography.message.lineHeight,
    color: colors.text.highEmphasis.onDark,
    minWidth: 0,
  }

  const actionButtonStyle: React.CSSProperties = {
    fontFamily: fontFamilies.body,
    fontSize: toast.typography.action.fontSize,
    fontWeight: toast.typography.action.fontWeight,
    lineHeight: toast.typography.action.lineHeight,
    color: isActionHovered ? colors.brand.lighter : colors.brand.default,
    backgroundColor: 'transparent',
    border: 'none',
    cursor: 'pointer',
    padding: '4px 8px',
    borderRadius: '4px',
    transition: reducedMotion ? 'none' : `color ${transitionPresets.fast}`,
    whiteSpace: 'nowrap',
    flexShrink: 0,
  }

  const closeButtonStyle: React.CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: toast.close.size,
    height: toast.close.size,
    borderRadius: toast.close.borderRadius,
    backgroundColor: isCloseHovered ? 'rgba(255, 255, 255, 0.1)' : 'transparent',
    color: colors.text.lowEmphasis.onDark,
    border: 'none',
    cursor: 'pointer',
    padding: 0,
    flexShrink: 0,
    transition: reducedMotion ? 'none' : `all ${transitionPresets.fast}`,
  }

  return (
    <div
      ref={ref}
      role="alert"
      aria-live={config.ariaLive}
      aria-atomic="true"
      style={rootStyle}
      className={className}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {/* Variant icon */}
      <div style={iconContainerStyle} aria-hidden="true">
        {config.icon}
      </div>

      {/* Message */}
      <span style={messageStyle}>{message}</span>

      {/* Optional action */}
      {action && (
        <button
          type="button"
          style={actionButtonStyle}
          onClick={action.onClick}
          onMouseEnter={() => setIsActionHovered(true)}
          onMouseLeave={() => setIsActionHovered(false)}
        >
          {action.label}
        </button>
      )}

      {/* Close button */}
      {showClose && (
        <button
          type="button"
          style={closeButtonStyle}
          onClick={onClose}
          onMouseEnter={() => setIsCloseHovered(true)}
          onMouseLeave={() => setIsCloseHovered(false)}
          aria-label="Dismiss notification"
        >
          <XIcon size={toast.close.iconSize} />
        </button>
      )}
    </div>
  )
})

Toast.displayName = 'Toast'

// =============================================================================
// useToast HOOK
// =============================================================================

/**
 * A toast item managed by the `useToast` hook.
 */
export interface ToastItem {
  id: string
  message: string
  variant: ToastVariant
  duration?: number
  action?: { label: string; onClick: () => void }
}

/**
 * Return type of the `useToast` hook.
 */
export interface UseToastReturn {
  /** Array of active toasts */
  toasts: ToastItem[]
  /** Show a new toast. Returns the toast ID for manual dismissal. */
  toast: (message: string, options?: Partial<Omit<ToastItem, 'id' | 'message'>>) => string
  /** Convenience: show a success toast */
  success: (message: string, options?: Partial<Omit<ToastItem, 'id' | 'message' | 'variant'>>) => string
  /** Convenience: show an error toast */
  error: (message: string, options?: Partial<Omit<ToastItem, 'id' | 'message' | 'variant'>>) => string
  /** Convenience: show a warning toast */
  warning: (message: string, options?: Partial<Omit<ToastItem, 'id' | 'message' | 'variant'>>) => string
  /** Convenience: show an info toast */
  info: (message: string, options?: Partial<Omit<ToastItem, 'id' | 'message' | 'variant'>>) => string
  /** Dismiss a specific toast by ID */
  dismiss: (id: string) => void
  /** Dismiss all toasts */
  dismissAll: () => void
}

let toastCounter = 0

/**
 * Hook for managing toast notifications.
 *
 * @example
 * ```tsx
 * function MyComponent() {
 *   const { toast, success, error, toasts, dismiss } = useToast()
 *
 *   return (
 *     <>
 *       <button onClick={() => success('Saved!')}>Save</button>
 *       {toasts.map(t => (
 *         <Toast
 *           key={t.id}
 *           message={t.message}
 *           variant={t.variant}
 *           isVisible
 *           onClose={() => dismiss(t.id)}
 *           duration={t.duration}
 *           action={t.action}
 *         />
 *       ))}
 *     </>
 *   )
 * }
 * ```
 */
export function useToast(): UseToastReturn {
  const [toasts, setToasts] = useState<ToastItem[]>([])

  const dismiss = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id))
  }, [])

  const dismissAll = useCallback(() => {
    setToasts([])
  }, [])

  const addToast = useCallback(
    (message: string, options?: Partial<Omit<ToastItem, 'id' | 'message'>>): string => {
      const id = `toast-${++toastCounter}`
      const newToast: ToastItem = {
        id,
        message,
        variant: options?.variant ?? 'success',
        duration: options?.duration,
        action: options?.action,
      }
      setToasts((prev) => [...prev, newToast])
      return id
    },
    [],
  )

  const success = useCallback(
    (message: string, options?: Partial<Omit<ToastItem, 'id' | 'message' | 'variant'>>) =>
      addToast(message, { ...options, variant: 'success' }),
    [addToast],
  )

  const error = useCallback(
    (message: string, options?: Partial<Omit<ToastItem, 'id' | 'message' | 'variant'>>) =>
      addToast(message, { ...options, variant: 'error' }),
    [addToast],
  )

  const warning = useCallback(
    (message: string, options?: Partial<Omit<ToastItem, 'id' | 'message' | 'variant'>>) =>
      addToast(message, { ...options, variant: 'warning' }),
    [addToast],
  )

  const info = useCallback(
    (message: string, options?: Partial<Omit<ToastItem, 'id' | 'message' | 'variant'>>) =>
      addToast(message, { ...options, variant: 'info' }),
    [addToast],
  )

  return {
    toasts,
    toast: addToast,
    success,
    error,
    warning,
    info,
    dismiss,
    dismissAll,
  }
}
