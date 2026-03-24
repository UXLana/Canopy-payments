'use client'

import React, { forwardRef } from 'react'
import { fontFamilies } from '@/styles/design-tokens'

// =============================================================================
// TYPES
// =============================================================================

export type AssistiveMessageType =
  | 'assistive'
  | 'disabled'
  | 'error'
  | 'error-overflow'
  | 'warning'
  | 'success'
  | 'info'

export interface AssistiveMessageProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Visual type / state of the message */
  type?: AssistiveMessageType
  /** The assistive / helper text content */
  children: React.ReactNode
  /** Show a character counter (e.g. "12/30") */
  counter?: string
  /** Override the default icon for the current type (pass `null` to hide) */
  icon?: React.ReactNode | null
}

// =============================================================================
// ICON SVGs — pixel-matched to Figma (16×16)
// =============================================================================

const ErrorFilledIcon: React.FC<{ color: string }> = ({ color }) => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M8 1.333A6.667 6.667 0 1 0 8 14.667 6.667 6.667 0 0 0 8 1.333ZM7.333 5.333a.667.667 0 0 1 1.334 0v2.334a.667.667 0 0 1-1.334 0V5.333Zm.667 5a.667.667 0 1 0 0-1.333.667.667 0 0 0 0 1.333Z"
      fill={color}
    />
  </svg>
)

const WarningIcon: React.FC<{ color: string }> = ({ color }) => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M7.134 2.567a1 1 0 0 1 1.732 0l5.333 9.333A1 1 0 0 1 13.333 13.333H2.667a1 1 0 0 1-.866-1.433l5.333-9.333ZM8 5.333a.667.667 0 0 1 .667.667v2a.667.667 0 0 1-1.334 0V6A.667.667 0 0 1 8 5.333Zm0 5.334a.667.667 0 1 0 0-1.334.667.667 0 0 0 0 1.334Z"
      fill={color}
    />
  </svg>
)

const SuccessIcon: React.FC<{ color: string }> = ({ color }) => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M8 1.333A6.667 6.667 0 1 0 8 14.667 6.667 6.667 0 0 0 8 1.333Zm2.471 5.138a.667.667 0 0 0-.942-.942L7.333 7.724 6.471 6.862a.667.667 0 0 0-.942.942l1.333 1.334a.667.667 0 0 0 .943 0l2.666-2.667Z"
      fill={color}
    />
  </svg>
)

const InfoFilledIcon: React.FC<{ color: string }> = ({ color }) => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M8 1.333A6.667 6.667 0 1 0 8 14.667 6.667 6.667 0 0 0 8 1.333ZM8 5a.667.667 0 1 0 0-1.333A.667.667 0 0 0 8 5Zm.667 1.667a.667.667 0 0 0-1.334 0v3.666a.667.667 0 0 0 1.334 0V6.667Z"
      fill={color}
    />
  </svg>
)

// =============================================================================
// STYLE CONFIG PER TYPE — extracted from Figma node 2068:39659
// =============================================================================

interface TypeStyle {
  textColor: string
  counterColor: string
  iconColor: string | null
  icon: React.FC<{ color: string }> | null
  gap: string
}

const typeStyles: Record<AssistiveMessageType, TypeStyle> = {
  assistive: {
    textColor: 'rgba(0, 0, 0, 0.60)',
    counterColor: 'rgba(0, 0, 0, 0.60)',
    iconColor: null,
    icon: null,
    gap: '4px',
  },
  disabled: {
    textColor: 'rgba(0, 0, 0, 0.30)',
    counterColor: 'rgba(0, 0, 0, 0.30)',
    iconColor: null,
    icon: null,
    gap: '4px',
  },
  error: {
    textColor: '#C10B1E',
    counterColor: 'rgba(0, 0, 0, 0.60)',
    iconColor: '#DC0C22',
    icon: ErrorFilledIcon,
    gap: '2px',
  },
  'error-overflow': {
    textColor: '#C10B1E',
    counterColor: '#C10B1E',
    iconColor: '#DC0C22',
    icon: ErrorFilledIcon,
    gap: '4px',
  },
  warning: {
    textColor: '#A35C00',
    counterColor: 'rgba(0, 0, 0, 0.60)',
    iconColor: '#D17600',
    icon: WarningIcon,
    gap: '4px',
  },
  success: {
    textColor: '#006B50',
    counterColor: 'rgba(0, 0, 0, 0.60)',
    iconColor: '#1B7F66',
    icon: SuccessIcon,
    gap: '4px',
  },
  info: {
    textColor: 'rgba(0, 0, 0, 0.95)',
    counterColor: 'rgba(0, 0, 0, 0.60)',
    iconColor: '#6E61FF',
    icon: InfoFilledIcon,
    gap: '4px',
  },
}

// =============================================================================
// ARIA role mapping
// =============================================================================

const ariaRoleForType: Partial<Record<AssistiveMessageType, string>> = {
  error: 'alert',
  'error-overflow': 'alert',
  warning: 'alert',
}

// =============================================================================
// COMPONENT
// =============================================================================

/**
 * AssistiveMessage
 *
 * A small helper / validation message shown beneath form fields.
 * Supports 7 visual types matching the Trace Design System v2.0 Figma spec
 * (node 2068-39659): Assistive, Disabled, Error, Error-Overflow (too many
 * characters), Warning, Success, and Info.
 *
 * @example
 * <AssistiveMessage>Enter your full legal name</AssistiveMessage>
 * <AssistiveMessage type="error">This field is required</AssistiveMessage>
 * <AssistiveMessage type="error-overflow" counter="35/30">Too many characters</AssistiveMessage>
 * <AssistiveMessage type="success">Looks good!</AssistiveMessage>
 */
export const AssistiveMessage = forwardRef<HTMLDivElement, AssistiveMessageProps>(
  (
    {
      type = 'assistive',
      children,
      counter,
      icon,
      className,
      style,
      ...props
    },
    ref
  ) => {
    const ts = typeStyles[type]
    const IconComponent = icon === undefined ? ts.icon : null
    const customIcon = icon !== undefined ? icon : undefined
    const role = ariaRoleForType[type]

    const rootStyles: React.CSSProperties = {
      display: 'flex',
      flexDirection: 'row',
      alignItems: 'flex-start',
      gap: ts.gap,
      fontFamily: fontFamilies.body,
      fontSize: '14px',
      fontWeight: 400,
      lineHeight: '18px',
      letterSpacing: '-0.3px',
      ...style,
    }

    const textStyles: React.CSSProperties = {
      flex: 1,
      minWidth: 0,
      color: ts.textColor,
    }

    const counterStyles: React.CSSProperties = {
      flexShrink: 0,
      color: ts.counterColor,
    }

    const iconWrapperStyles: React.CSSProperties = {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      width: '16px',
      height: '18px',
      flexShrink: 0,
    }

    return (
      <div
        ref={ref}
        className={className}
        style={rootStyles}
        role={role}
        aria-live={role === 'alert' ? 'assertive' : undefined}
        {...props}
      >
        {IconComponent && ts.iconColor && (
          <span style={iconWrapperStyles}>
            <IconComponent color={ts.iconColor} />
          </span>
        )}
        {customIcon !== undefined && customIcon !== null && (
          <span style={iconWrapperStyles}>{customIcon}</span>
        )}

        <span style={textStyles}>{children}</span>

        {counter && <span style={counterStyles}>{counter}</span>}
      </div>
    )
  }
)

AssistiveMessage.displayName = 'AssistiveMessage'

export default AssistiveMessage
