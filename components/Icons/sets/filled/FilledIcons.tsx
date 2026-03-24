'use client'

/**
 * Filled icon variants for the Prism Design System.
 *
 * These are solid/filled versions of the most-used outlined icons.
 * They share the same 24×24 viewBox and size tokens as the outlined set
 * but use `fill="currentColor"` instead of stroke-based rendering.
 *
 * When the active theme sets `iconStyle.set = 'filled'`, the icon registry
 * resolves these instead of the outlined variants. Icons not in this file
 * fall back to the outlined set automatically.
 */

import React from 'react'
import type { IconProps, IconSize } from '../../Icons'
import { iconSizes } from '../../Icons'

// ---------------------------------------------------------------------------
// Base wrapper for filled icons — uses fill instead of stroke
// ---------------------------------------------------------------------------

const getSize = (size: IconSize | number): number =>
  typeof size === 'number' ? size : iconSizes[size]

interface FilledBaseIconProps extends IconProps {
  children: React.ReactNode
}

const FilledBaseIcon: React.FC<FilledBaseIconProps> = ({
  size = 'md',
  label,
  children,
  style,
  className,
  ...props
}) => {
  const pixelSize = getSize(size)

  return (
    <svg
      width={pixelSize}
      height={pixelSize}
      viewBox="0 0 24 24"
      fill="currentColor"
      stroke="none"
      aria-label={label}
      aria-hidden={!label}
      role={label ? 'img' : 'presentation'}
      className={className}
      style={{
        shapeRendering: 'geometricPrecision',
        ...style,
      }}
      {...props}
    >
      {children}
    </svg>
  )
}

// =============================================================================
// NAVIGATION ICONS (filled)
// =============================================================================

export const IconHomeFilled: React.FC<IconProps> = (props) => (
  <FilledBaseIcon {...props}>
    <path d="M3 9.5L12 2l9 7.5V20a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V9.5z" />
    <path d="M9 22V12h6v10" fill="var(--prism-surface-light, #fff)" />
  </FilledBaseIcon>
)
IconHomeFilled.displayName = 'IconHomeFilled'

export const IconMenuFilled: React.FC<IconProps> = (props) => (
  <FilledBaseIcon {...props}>
    <rect x="3" y="5" width="18" height="2" rx="1" />
    <rect x="3" y="11" width="18" height="2" rx="1" />
    <rect x="3" y="17" width="18" height="2" rx="1" />
  </FilledBaseIcon>
)
IconMenuFilled.displayName = 'IconMenuFilled'

export const IconSearchFilled: React.FC<IconProps> = (props) => (
  <FilledBaseIcon {...props}>
    <path fillRule="evenodd" clipRule="evenodd" d="M11 2a9 9 0 1 0 5.618 16.032l3.675 3.675a1 1 0 0 0 1.414-1.414l-3.675-3.675A9 9 0 0 0 11 2zm-6 9a6 6 0 1 1 12 0 6 6 0 0 1-12 0z" />
  </FilledBaseIcon>
)
IconSearchFilled.displayName = 'IconSearchFilled'

export const IconArrowLeftFilled: React.FC<IconProps> = (props) => (
  <FilledBaseIcon {...props}>
    <path d="M12.707 5.293a1 1 0 0 0-1.414 0l-6 6a1 1 0 0 0 0 1.414l6 6a1 1 0 0 0 1.414-1.414L8.414 13H19a1 1 0 1 0 0-2H8.414l4.293-4.293a1 1 0 0 0 0-1.414z" />
  </FilledBaseIcon>
)
IconArrowLeftFilled.displayName = 'IconArrowLeftFilled'

export const IconArrowRightFilled: React.FC<IconProps> = (props) => (
  <FilledBaseIcon {...props}>
    <path d="M11.293 5.293a1 1 0 0 1 1.414 0l6 6a1 1 0 0 1 0 1.414l-6 6a1 1 0 0 1-1.414-1.414L15.586 13H5a1 1 0 1 1 0-2h10.586l-4.293-4.293a1 1 0 0 1 0-1.414z" />
  </FilledBaseIcon>
)
IconArrowRightFilled.displayName = 'IconArrowRightFilled'

export const IconChevronDownFilled: React.FC<IconProps> = (props) => (
  <FilledBaseIcon {...props}>
    <path d="M5.293 8.293a1 1 0 0 1 1.414 0L12 13.586l5.293-5.293a1 1 0 1 1 1.414 1.414l-6 6a1 1 0 0 1-1.414 0l-6-6a1 1 0 0 1 0-1.414z" />
  </FilledBaseIcon>
)
IconChevronDownFilled.displayName = 'IconChevronDownFilled'

export const IconChevronUpFilled: React.FC<IconProps> = (props) => (
  <FilledBaseIcon {...props}>
    <path d="M18.707 15.707a1 1 0 0 1-1.414 0L12 10.414l-5.293 5.293a1 1 0 0 1-1.414-1.414l6-6a1 1 0 0 1 1.414 0l6 6a1 1 0 0 1 0 1.414z" />
  </FilledBaseIcon>
)
IconChevronUpFilled.displayName = 'IconChevronUpFilled'

export const IconChevronRightFilled: React.FC<IconProps> = (props) => (
  <FilledBaseIcon {...props}>
    <path d="M8.293 5.293a1 1 0 0 1 1.414 0l6 6a1 1 0 0 1 0 1.414l-6 6a1 1 0 0 1-1.414-1.414L13.586 12 8.293 6.707a1 1 0 0 1 0-1.414z" />
  </FilledBaseIcon>
)
IconChevronRightFilled.displayName = 'IconChevronRightFilled'

// =============================================================================
// ACTION ICONS (filled)
// =============================================================================

export const IconPlusFilled: React.FC<IconProps> = (props) => (
  <FilledBaseIcon {...props}>
    <path fillRule="evenodd" clipRule="evenodd" d="M12 4a1 1 0 0 1 1 1v6h6a1 1 0 1 1 0 2h-6v6a1 1 0 1 1-2 0v-6H5a1 1 0 1 1 0-2h6V5a1 1 0 0 1 1-1z" />
  </FilledBaseIcon>
)
IconPlusFilled.displayName = 'IconPlusFilled'

export const IconMinusFilled: React.FC<IconProps> = (props) => (
  <FilledBaseIcon {...props}>
    <path d="M4 12a1 1 0 0 1 1-1h14a1 1 0 1 1 0 2H5a1 1 0 0 1-1-1z" />
  </FilledBaseIcon>
)
IconMinusFilled.displayName = 'IconMinusFilled'

export const IconXFilled: React.FC<IconProps> = (props) => (
  <FilledBaseIcon {...props}>
    <path d="M6.707 5.293a1 1 0 0 0-1.414 1.414L10.586 12l-5.293 5.293a1 1 0 1 0 1.414 1.414L12 13.414l5.293 5.293a1 1 0 0 0 1.414-1.414L13.414 12l5.293-5.293a1 1 0 0 0-1.414-1.414L12 10.586 6.707 5.293z" />
  </FilledBaseIcon>
)
IconXFilled.displayName = 'IconXFilled'

export const IconCheckFilled: React.FC<IconProps> = (props) => (
  <FilledBaseIcon {...props}>
    <path d="M20.707 5.293a1 1 0 0 1 0 1.414l-11 11a1 1 0 0 1-1.414 0l-5-5a1 1 0 1 1 1.414-1.414L9 15.586 19.293 5.293a1 1 0 0 1 1.414 0z" />
  </FilledBaseIcon>
)
IconCheckFilled.displayName = 'IconCheckFilled'

export const IconEditFilled: React.FC<IconProps> = (props) => (
  <FilledBaseIcon {...props}>
    <path d="M4 20h16a1 1 0 1 1 0 2H4a1 1 0 1 1 0-2z" />
    <path d="M14.707 3.293a3.121 3.121 0 0 1 4.414 0l1.586 1.586a3.121 3.121 0 0 1 0 4.414L9.414 20.586a1 1 0 0 1-.707.293H5a1 1 0 0 1-1-1v-3.707a1 1 0 0 1 .293-.707L14.707 3.293z" />
  </FilledBaseIcon>
)
IconEditFilled.displayName = 'IconEditFilled'

export const IconTrashFilled: React.FC<IconProps> = (props) => (
  <FilledBaseIcon {...props}>
    <path d="M8 2a2 2 0 0 0-2 2v1H3a1 1 0 0 0 0 2h1v13a3 3 0 0 0 3 3h10a3 3 0 0 0 3-3V7h1a1 1 0 1 0 0-2h-3V4a2 2 0 0 0-2-2H8zm0 2h8v1H8V4zm2 6a1 1 0 0 1 1 1v6a1 1 0 1 1-2 0v-6a1 1 0 0 1 1-1zm4 0a1 1 0 0 1 1 1v6a1 1 0 1 1-2 0v-6a1 1 0 0 1 1-1z" />
  </FilledBaseIcon>
)
IconTrashFilled.displayName = 'IconTrashFilled'

export const IconDownloadFilled: React.FC<IconProps> = (props) => (
  <FilledBaseIcon {...props}>
    <path d="M12 2a1 1 0 0 1 1 1v9.586l3.293-3.293a1 1 0 1 1 1.414 1.414l-5 5a1 1 0 0 1-1.414 0l-5-5a1 1 0 1 1 1.414-1.414L11 12.586V3a1 1 0 0 1 1-1z" />
    <path d="M3 16a1 1 0 0 1 1 1v2a1 1 0 0 0 1 1h14a1 1 0 0 0 1-1v-2a1 1 0 1 1 2 0v2a3 3 0 0 1-3 3H5a3 3 0 0 1-3-3v-2a1 1 0 0 1 1-1z" />
  </FilledBaseIcon>
)
IconDownloadFilled.displayName = 'IconDownloadFilled'

export const IconUploadFilled: React.FC<IconProps> = (props) => (
  <FilledBaseIcon {...props}>
    <path d="M12 16a1 1 0 0 0 1-1V5.414l3.293 3.293a1 1 0 1 0 1.414-1.414l-5-5a1 1 0 0 0-1.414 0l-5 5a1 1 0 0 0 1.414 1.414L11 5.414V15a1 1 0 0 0 1 1z" />
    <path d="M3 16a1 1 0 0 1 1 1v2a1 1 0 0 0 1 1h14a1 1 0 0 0 1-1v-2a1 1 0 1 1 2 0v2a3 3 0 0 1-3 3H5a3 3 0 0 1-3-3v-2a1 1 0 0 1 1-1z" />
  </FilledBaseIcon>
)
IconUploadFilled.displayName = 'IconUploadFilled'

// =============================================================================
// STATUS ICONS (filled)
// =============================================================================

export const IconInfoFilled: React.FC<IconProps> = (props) => (
  <FilledBaseIcon {...props}>
    <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.477 2 12s4.477 10 10 10 10-4.477 10-10S17.523 2 12 2zm0 5a1 1 0 1 1 0 2 1 1 0 0 1 0-2zm-1 4a1 1 0 1 0 0 2v3a1 1 0 1 0 2 0v-4a1 1 0 0 0-1-1h-1z" />
  </FilledBaseIcon>
)
IconInfoFilled.displayName = 'IconInfoFilled'

export const IconAlertCircleFilled: React.FC<IconProps> = (props) => (
  <FilledBaseIcon {...props}>
    <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.477 2 12s4.477 10 10 10 10-4.477 10-10S17.523 2 12 2zm0 5a1 1 0 0 1 1 1v4a1 1 0 1 1-2 0V8a1 1 0 0 1 1-1zm0 10a1 1 0 1 0 0-2 1 1 0 0 0 0 2z" />
  </FilledBaseIcon>
)
IconAlertCircleFilled.displayName = 'IconAlertCircleFilled'

export const IconCheckCircleFilled: React.FC<IconProps> = (props) => (
  <FilledBaseIcon {...props}>
    <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.477 2 12s4.477 10 10 10 10-4.477 10-10S17.523 2 12 2zm4.707 8.707a1 1 0 0 0-1.414-1.414L11 13.586l-2.293-2.293a1 1 0 0 0-1.414 1.414l3 3a1 1 0 0 0 1.414 0l5-5z" />
  </FilledBaseIcon>
)
IconCheckCircleFilled.displayName = 'IconCheckCircleFilled'

export const IconXCircleFilled: React.FC<IconProps> = (props) => (
  <FilledBaseIcon {...props}>
    <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.477 2 12s4.477 10 10 10 10-4.477 10-10S17.523 2 12 2zm-2.293 6.293a1 1 0 0 0-1.414 1.414L10.586 12l-2.293 2.293a1 1 0 1 0 1.414 1.414L12 13.414l2.293 2.293a1 1 0 0 0 1.414-1.414L13.414 12l2.293-2.293a1 1 0 0 0-1.414-1.414L12 10.586 9.707 8.293z" />
  </FilledBaseIcon>
)
IconXCircleFilled.displayName = 'IconXCircleFilled'

// =============================================================================
// OBJECT ICONS (filled)
// =============================================================================

export const IconFileFilled: React.FC<IconProps> = (props) => (
  <FilledBaseIcon {...props}>
    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8l-6-6z" />
    <path d="M14 2v6h6" opacity={0.4} />
  </FilledBaseIcon>
)
IconFileFilled.displayName = 'IconFileFilled'

export const IconFolderFilled: React.FC<IconProps> = (props) => (
  <FilledBaseIcon {...props}>
    <path d="M2 6a2 2 0 0 1 2-2h5.172a2 2 0 0 1 1.414.586L12 6h8a2 2 0 0 1 2 2v11a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V6z" />
  </FilledBaseIcon>
)
IconFolderFilled.displayName = 'IconFolderFilled'

export const IconUserFilled: React.FC<IconProps> = (props) => (
  <FilledBaseIcon {...props}>
    <circle cx="12" cy="7" r="5" />
    <path d="M3 21v-1a7 7 0 0 1 7-7h4a7 7 0 0 1 7 7v1a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1z" />
  </FilledBaseIcon>
)
IconUserFilled.displayName = 'IconUserFilled'

export const IconCalendarFilled: React.FC<IconProps> = (props) => (
  <FilledBaseIcon {...props}>
    <path d="M8 2a1 1 0 0 1 1 1v1h6V3a1 1 0 1 1 2 0v1h2a3 3 0 0 1 3 3v2H2V7a3 3 0 0 1 3-3h2V3a1 1 0 0 1 1-1z" />
    <path d="M2 11h20v8a3 3 0 0 1-3 3H5a3 3 0 0 1-3-3v-8z" />
  </FilledBaseIcon>
)
IconCalendarFilled.displayName = 'IconCalendarFilled'

export const IconSettingsFilled: React.FC<IconProps> = (props) => (
  <FilledBaseIcon {...props}>
    <path fillRule="evenodd" clipRule="evenodd" d="M11.078 1a2 2 0 0 0-1.98 1.717l-.186 1.298a8.076 8.076 0 0 0-1.85 1.068l-1.23-.493a2 2 0 0 0-2.503.89l-.922 1.598a2 2 0 0 0 .523 2.607l1.044.805a8.13 8.13 0 0 0 0 2.136l-1.044.805a2 2 0 0 0-.523 2.607l.922 1.598a2 2 0 0 0 2.504.89l1.23-.493a8.076 8.076 0 0 0 1.849 1.068l.186 1.298A2 2 0 0 0 11.078 23h1.844a2 2 0 0 0 1.98-1.717l.186-1.298a8.076 8.076 0 0 0 1.85-1.068l1.23.493a2 2 0 0 0 2.503-.89l.922-1.598a2 2 0 0 0-.523-2.607l-1.044-.805a8.13 8.13 0 0 0 0-2.136l1.044-.805a2 2 0 0 0 .523-2.607l-.922-1.598a2 2 0 0 0-2.504-.89l-1.23.493a8.076 8.076 0 0 0-1.849-1.068l-.186-1.298A2 2 0 0 0 12.922 1h-1.844zM12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6z" />
  </FilledBaseIcon>
)
IconSettingsFilled.displayName = 'IconSettingsFilled'

// =============================================================================
// UI ICONS (filled)
// =============================================================================

export const IconFilterFilled: React.FC<IconProps> = (props) => (
  <FilledBaseIcon {...props}>
    <path d="M2.69 2.012A1 1 0 0 1 3.5 2h17a1 1 0 0 1 .743 1.669L14 12.46V20a1 1 0 0 1-.553.894l-4 2A1 1 0 0 1 8 22v-9.54L.757 3.669a1 1 0 0 1 1.933-1.657z" />
  </FilledBaseIcon>
)
IconFilterFilled.displayName = 'IconFilterFilled'

export const IconSortFilled: React.FC<IconProps> = (props) => (
  <FilledBaseIcon {...props}>
    <path d="M12 4a1 1 0 0 1 1 1v9.586l3.293-3.293a1 1 0 1 1 1.414 1.414l-5 5a1 1 0 0 1-1.414 0l-5-5a1 1 0 1 1 1.414-1.414L11 14.586V5a1 1 0 0 1 1-1z" />
  </FilledBaseIcon>
)
IconSortFilled.displayName = 'IconSortFilled'

export const IconGridFilled: React.FC<IconProps> = (props) => (
  <FilledBaseIcon {...props}>
    <rect x="3" y="3" width="7" height="7" rx="1.5" />
    <rect x="14" y="3" width="7" height="7" rx="1.5" />
    <rect x="3" y="14" width="7" height="7" rx="1.5" />
    <rect x="14" y="14" width="7" height="7" rx="1.5" />
  </FilledBaseIcon>
)
IconGridFilled.displayName = 'IconGridFilled'

export const IconListFilled: React.FC<IconProps> = (props) => (
  <FilledBaseIcon {...props}>
    <rect x="3" y="5" width="2" height="2" rx="1" />
    <rect x="8" y="5" width="13" height="2" rx="1" />
    <rect x="3" y="11" width="2" height="2" rx="1" />
    <rect x="8" y="11" width="13" height="2" rx="1" />
    <rect x="3" y="17" width="2" height="2" rx="1" />
    <rect x="8" y="17" width="13" height="2" rx="1" />
  </FilledBaseIcon>
)
IconListFilled.displayName = 'IconListFilled'

export const IconMoreHorizontalFilled: React.FC<IconProps> = (props) => (
  <FilledBaseIcon {...props}>
    <circle cx="5" cy="12" r="2" />
    <circle cx="12" cy="12" r="2" />
    <circle cx="19" cy="12" r="2" />
  </FilledBaseIcon>
)
IconMoreHorizontalFilled.displayName = 'IconMoreHorizontalFilled'
