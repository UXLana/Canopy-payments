'use client'

import React from 'react'

// =============================================================================
// ICON TYPES & CONSTANTS
// =============================================================================

export type IconSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl'

export interface IconProps extends React.SVGAttributes<SVGElement> {
  /** Icon size - maps to design tokens */
  size?: IconSize | number
  /** Stroke width - default 1.5 */
  strokeWidth?: number
  /** Accessible label - required if icon conveys meaning */
  label?: string
}

export const iconSizes: Record<IconSize, number> = {
  xs: 12,
  sm: 16,
  md: 20,
  lg: 24,
  xl: 32,
  '2xl': 48,
}

// Helper to get pixel size
const getSize = (size: IconSize | number): number =>
  typeof size === 'number' ? size : iconSizes[size]

// =============================================================================
// BASE ICON WRAPPER
// =============================================================================

interface BaseIconProps extends IconProps {
  children: React.ReactNode
}

const BaseIcon: React.FC<BaseIconProps> = ({
  size = 'md',
  strokeWidth,
  label,
  children,
  style,
  ...props
}) => {
  const pixelSize = getSize(size)

  return (
    <svg
      width={pixelSize}
      height={pixelSize}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={strokeWidth ?? 'var(--prism-icon-style-strokeWidth, 1.5)'}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-label={label}
      aria-hidden={!label}
      role={label ? 'img' : 'presentation'}
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
// NAVIGATION ICONS
// =============================================================================

export const IconHome: React.FC<IconProps> = (props) => (
  <BaseIcon {...props}>
    <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
    <polyline points="9 22 9 12 15 12 15 22" />
  </BaseIcon>
)
IconHome.displayName = 'IconHome'

export const IconMenu: React.FC<IconProps> = (props) => (
  <BaseIcon {...props}>
    <line x1="3" y1="6" x2="21" y2="6" />
    <line x1="3" y1="12" x2="21" y2="12" />
    <line x1="3" y1="18" x2="21" y2="18" />
  </BaseIcon>
)
IconMenu.displayName = 'IconMenu'

export const IconSidebarOpen: React.FC<IconProps> = (props) => (
  <BaseIcon {...props}>
    <rect x="3" y="3" width="18" height="18" rx="2" />
    <line x1="9" y1="3" x2="9" y2="21" />
    <polyline points="14 9 17 12 14 15" />
  </BaseIcon>
)
IconSidebarOpen.displayName = 'IconSidebarOpen'

export const IconSidebarClose: React.FC<IconProps> = (props) => (
  <BaseIcon {...props}>
    <rect x="3" y="3" width="18" height="18" rx="2" />
    <line x1="9" y1="3" x2="9" y2="21" />
    <polyline points="16 9 13 12 16 15" />
  </BaseIcon>
)
IconSidebarClose.displayName = 'IconSidebarClose'

export const IconSearch: React.FC<IconProps> = (props) => (
  <BaseIcon {...props}>
    <circle cx="11" cy="11" r="8" />
    <line x1="21" y1="21" x2="16.65" y2="16.65" />
  </BaseIcon>
)
IconSearch.displayName = 'IconSearch'

export const IconArrowLeft: React.FC<IconProps> = (props) => (
  <BaseIcon {...props}>
    <line x1="19" y1="12" x2="5" y2="12" />
    <polyline points="12 19 5 12 12 5" />
  </BaseIcon>
)
IconArrowLeft.displayName = 'IconArrowLeft'

export const IconArrowRight: React.FC<IconProps> = (props) => (
  <BaseIcon {...props}>
    <line x1="5" y1="12" x2="19" y2="12" />
    <polyline points="12 5 19 12 12 19" />
  </BaseIcon>
)
IconArrowRight.displayName = 'IconArrowRight'

export const IconArrowUp: React.FC<IconProps> = (props) => (
  <BaseIcon {...props}>
    <line x1="12" y1="19" x2="12" y2="5" />
    <polyline points="5 12 12 5 19 12" />
  </BaseIcon>
)
IconArrowUp.displayName = 'IconArrowUp'

export const IconArrowDown: React.FC<IconProps> = (props) => (
  <BaseIcon {...props}>
    <line x1="12" y1="5" x2="12" y2="19" />
    <polyline points="19 12 12 19 5 12" />
  </BaseIcon>
)
IconArrowDown.displayName = 'IconArrowDown'

export const IconChevronLeft: React.FC<IconProps> = (props) => (
  <BaseIcon {...props}>
    <polyline points="15 18 9 12 15 6" />
  </BaseIcon>
)
IconChevronLeft.displayName = 'IconChevronLeft'

export const IconChevronRight: React.FC<IconProps> = (props) => (
  <BaseIcon {...props}>
    <polyline points="9 18 15 12 9 6" />
  </BaseIcon>
)
IconChevronRight.displayName = 'IconChevronRight'

export const IconChevronUp: React.FC<IconProps> = (props) => (
  <BaseIcon {...props}>
    <polyline points="18 15 12 9 6 15" />
  </BaseIcon>
)
IconChevronUp.displayName = 'IconChevronUp'

export const IconChevronDown: React.FC<IconProps> = (props) => (
  <BaseIcon {...props}>
    <polyline points="6 9 12 15 18 9" />
  </BaseIcon>
)
IconChevronDown.displayName = 'IconChevronDown'

export const IconExternalLink: React.FC<IconProps> = (props) => (
  <BaseIcon {...props}>
    <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
    <polyline points="15 3 21 3 21 9" />
    <line x1="10" y1="14" x2="21" y2="3" />
  </BaseIcon>
)
IconExternalLink.displayName = 'IconExternalLink'

// =============================================================================
// ACTION ICONS
// =============================================================================

export const IconPlus: React.FC<IconProps> = (props) => (
  <BaseIcon {...props}>
    <line x1="12" y1="5" x2="12" y2="19" />
    <line x1="5" y1="12" x2="19" y2="12" />
  </BaseIcon>
)
IconPlus.displayName = 'IconPlus'

export const IconMinus: React.FC<IconProps> = (props) => (
  <BaseIcon {...props}>
    <line x1="5" y1="12" x2="19" y2="12" />
  </BaseIcon>
)
IconMinus.displayName = 'IconMinus'

export const IconX: React.FC<IconProps> = (props) => (
  <BaseIcon {...props}>
    <line x1="18" y1="6" x2="6" y2="18" />
    <line x1="6" y1="6" x2="18" y2="18" />
  </BaseIcon>
)
IconX.displayName = 'IconX'

export const IconCheck: React.FC<IconProps> = (props) => (
  <BaseIcon {...props}>
    <polyline points="20 6 9 17 4 12" />
  </BaseIcon>
)
IconCheck.displayName = 'IconCheck'

export const IconEdit: React.FC<IconProps> = (props) => (
  <BaseIcon {...props}>
    <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
    <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
  </BaseIcon>
)
IconEdit.displayName = 'IconEdit'

export const IconTrash: React.FC<IconProps> = (props) => (
  <BaseIcon {...props}>
    <polyline points="3 6 5 6 21 6" />
    <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
    <line x1="10" y1="11" x2="10" y2="17" />
    <line x1="14" y1="11" x2="14" y2="17" />
  </BaseIcon>
)
IconTrash.displayName = 'IconTrash'

export const IconCopy: React.FC<IconProps> = (props) => (
  <BaseIcon {...props}>
    <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
    <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
  </BaseIcon>
)
IconCopy.displayName = 'IconCopy'

export const IconDownload: React.FC<IconProps> = (props) => (
  <BaseIcon {...props}>
    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
    <polyline points="7 10 12 15 17 10" />
    <line x1="12" y1="15" x2="12" y2="3" />
  </BaseIcon>
)
IconDownload.displayName = 'IconDownload'

export const IconUpload: React.FC<IconProps> = (props) => (
  <BaseIcon {...props}>
    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
    <polyline points="17 8 12 3 7 8" />
    <line x1="12" y1="3" x2="12" y2="15" />
  </BaseIcon>
)
IconUpload.displayName = 'IconUpload'

export const IconShare: React.FC<IconProps> = (props) => (
  <BaseIcon {...props}>
    <circle cx="18" cy="5" r="3" />
    <circle cx="6" cy="12" r="3" />
    <circle cx="18" cy="19" r="3" />
    <line x1="8.59" y1="13.51" x2="15.42" y2="17.49" />
    <line x1="15.41" y1="6.51" x2="8.59" y2="10.49" />
  </BaseIcon>
)
IconShare.displayName = 'IconShare'

export const IconSave: React.FC<IconProps> = (props) => (
  <BaseIcon {...props}>
    <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z" />
    <polyline points="17 21 17 13 7 13 7 21" />
    <polyline points="7 3 7 8 15 8" />
  </BaseIcon>
)
IconSave.displayName = 'IconSave'

export const IconRefresh: React.FC<IconProps> = (props) => (
  <BaseIcon {...props}>
    <polyline points="23 4 23 10 17 10" />
    <polyline points="1 20 1 14 7 14" />
    <path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15" />
  </BaseIcon>
)
IconRefresh.displayName = 'IconRefresh'

// =============================================================================
// STATUS ICONS
// =============================================================================

export const IconInfo: React.FC<IconProps> = (props) => (
  <BaseIcon {...props}>
    <circle cx="12" cy="12" r="10" />
    <line x1="12" y1="16" x2="12" y2="12" />
    <line x1="12" y1="8" x2="12.01" y2="8" />
  </BaseIcon>
)
IconInfo.displayName = 'IconInfo'

export const IconAlertCircle: React.FC<IconProps> = (props) => (
  <BaseIcon {...props}>
    <circle cx="12" cy="12" r="10" />
    <line x1="12" y1="8" x2="12" y2="12" />
    <line x1="12" y1="16" x2="12.01" y2="16" />
  </BaseIcon>
)
IconAlertCircle.displayName = 'IconAlertCircle'

export const IconAlertTriangle: React.FC<IconProps> = (props) => (
  <BaseIcon {...props}>
    <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
    <line x1="12" y1="9" x2="12" y2="13" />
    <line x1="12" y1="17" x2="12.01" y2="17" />
  </BaseIcon>
)
IconAlertTriangle.displayName = 'IconAlertTriangle'

export const IconCheckCircle: React.FC<IconProps> = (props) => (
  <BaseIcon {...props}>
    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
    <polyline points="22 4 12 14.01 9 11.01" />
  </BaseIcon>
)
IconCheckCircle.displayName = 'IconCheckCircle'

export const IconXCircle: React.FC<IconProps> = (props) => (
  <BaseIcon {...props}>
    <circle cx="12" cy="12" r="10" />
    <line x1="15" y1="9" x2="9" y2="15" />
    <line x1="9" y1="9" x2="15" y2="15" />
  </BaseIcon>
)
IconXCircle.displayName = 'IconXCircle'

export const IconLoader: React.FC<IconProps> = (props) => (
  <BaseIcon {...props}>
    <line x1="12" y1="2" x2="12" y2="6" />
    <line x1="12" y1="18" x2="12" y2="22" />
    <line x1="4.93" y1="4.93" x2="7.76" y2="7.76" />
    <line x1="16.24" y1="16.24" x2="19.07" y2="19.07" />
    <line x1="2" y1="12" x2="6" y2="12" />
    <line x1="18" y1="12" x2="22" y2="12" />
    <line x1="4.93" y1="19.07" x2="7.76" y2="16.24" />
    <line x1="16.24" y1="7.76" x2="19.07" y2="4.93" />
  </BaseIcon>
)
IconLoader.displayName = 'IconLoader'

// =============================================================================
// OBJECT ICONS
// =============================================================================

export const IconFile: React.FC<IconProps> = (props) => (
  <BaseIcon {...props}>
    <path d="M13 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9z" />
    <polyline points="13 2 13 9 20 9" />
  </BaseIcon>
)
IconFile.displayName = 'IconFile'

export const IconFolder: React.FC<IconProps> = (props) => (
  <BaseIcon {...props}>
    <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z" />
  </BaseIcon>
)
IconFolder.displayName = 'IconFolder'

export const IconImage: React.FC<IconProps> = (props) => (
  <BaseIcon {...props}>
    <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
    <circle cx="8.5" cy="8.5" r="1.5" />
    <polyline points="21 15 16 10 5 21" />
  </BaseIcon>
)
IconImage.displayName = 'IconImage'

export const IconUser: React.FC<IconProps> = (props) => (
  <BaseIcon {...props}>
    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
    <circle cx="12" cy="7" r="4" />
  </BaseIcon>
)
IconUser.displayName = 'IconUser'

export const IconUsers: React.FC<IconProps> = (props) => (
  <BaseIcon {...props}>
    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
    <circle cx="9" cy="7" r="4" />
    <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
    <path d="M16 3.13a4 4 0 0 1 0 7.75" />
  </BaseIcon>
)
IconUsers.displayName = 'IconUsers'

export const IconCalendar: React.FC<IconProps> = (props) => (
  <BaseIcon {...props}>
    <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
    <line x1="16" y1="2" x2="16" y2="6" />
    <line x1="8" y1="2" x2="8" y2="6" />
    <line x1="3" y1="10" x2="21" y2="10" />
  </BaseIcon>
)
IconCalendar.displayName = 'IconCalendar'

export const IconClock: React.FC<IconProps> = (props) => (
  <BaseIcon {...props}>
    <circle cx="12" cy="12" r="10" />
    <polyline points="12 6 12 12 16 14" />
  </BaseIcon>
)
IconClock.displayName = 'IconClock'

export const IconSettings: React.FC<IconProps> = (props) => (
  <BaseIcon {...props}>
    <circle cx="12" cy="12" r="3" />
    <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z" />
  </BaseIcon>
)
IconSettings.displayName = 'IconSettings'

// =============================================================================
// VISIBILITY ICONS
// =============================================================================

export const IconEye: React.FC<IconProps> = (props) => (
  <BaseIcon {...props}>
    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
    <circle cx="12" cy="12" r="3" />
  </BaseIcon>
)
IconEye.displayName = 'IconEye'

export const IconEyeOff: React.FC<IconProps> = (props) => (
  <BaseIcon {...props}>
    <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" />
    <line x1="1" y1="1" x2="23" y2="23" />
  </BaseIcon>
)
IconEyeOff.displayName = 'IconEyeOff'

export const IconLock: React.FC<IconProps> = (props) => (
  <BaseIcon {...props}>
    <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
    <path d="M7 11V7a5 5 0 0 1 10 0v4" />
  </BaseIcon>
)
IconLock.displayName = 'IconLock'

export const IconUnlock: React.FC<IconProps> = (props) => (
  <BaseIcon {...props}>
    <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
    <path d="M7 11V7a5 5 0 0 1 9.9-1" />
  </BaseIcon>
)
IconUnlock.displayName = 'IconUnlock'

// =============================================================================
// MEDIA ICONS
// =============================================================================

export const IconPlay: React.FC<IconProps> = (props) => (
  <BaseIcon {...props}>
    <polygon points="5 3 19 12 5 21 5 3" />
  </BaseIcon>
)
IconPlay.displayName = 'IconPlay'

export const IconPause: React.FC<IconProps> = (props) => (
  <BaseIcon {...props}>
    <rect x="6" y="4" width="4" height="16" />
    <rect x="14" y="4" width="4" height="16" />
  </BaseIcon>
)
IconPause.displayName = 'IconPause'

export const IconVolume: React.FC<IconProps> = (props) => (
  <BaseIcon {...props}>
    <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
    <path d="M19.07 4.93a10 10 0 0 1 0 14.14M15.54 8.46a5 5 0 0 1 0 7.07" />
  </BaseIcon>
)
IconVolume.displayName = 'IconVolume'

export const IconVolumeOff: React.FC<IconProps> = (props) => (
  <BaseIcon {...props}>
    <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
    <line x1="23" y1="9" x2="17" y2="15" />
    <line x1="17" y1="9" x2="23" y2="15" />
  </BaseIcon>
)
IconVolumeOff.displayName = 'IconVolumeOff'

// =============================================================================
// UI ICONS
// =============================================================================

export const IconFilter: React.FC<IconProps> = (props) => (
  <BaseIcon {...props}>
    <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3" />
  </BaseIcon>
)
IconFilter.displayName = 'IconFilter'

export const IconSort: React.FC<IconProps> = (props) => (
  <BaseIcon {...props}>
    <line x1="12" y1="5" x2="12" y2="19" />
    <polyline points="19 12 12 19 5 12" />
  </BaseIcon>
)
IconSort.displayName = 'IconSort'

export const IconMaximize: React.FC<IconProps> = (props) => (
  <BaseIcon {...props}>
    <polyline points="15 3 21 3 21 9" />
    <polyline points="9 21 3 21 3 15" />
    <line x1="21" y1="3" x2="14" y2="10" />
    <line x1="3" y1="21" x2="10" y2="14" />
  </BaseIcon>
)
IconMaximize.displayName = 'IconMaximize'

export const IconMinimize: React.FC<IconProps> = (props) => (
  <BaseIcon {...props}>
    <polyline points="4 14 10 14 10 20" />
    <polyline points="20 10 14 10 14 4" />
    <line x1="14" y1="10" x2="21" y2="3" />
    <line x1="3" y1="21" x2="10" y2="14" />
  </BaseIcon>
)
IconMinimize.displayName = 'IconMinimize'

export const IconMoreHorizontal: React.FC<IconProps> = (props) => (
  <BaseIcon {...props}>
    <circle cx="12" cy="12" r="1" />
    <circle cx="19" cy="12" r="1" />
    <circle cx="5" cy="12" r="1" />
  </BaseIcon>
)
IconMoreHorizontal.displayName = 'IconMoreHorizontal'

export const IconMoreVertical: React.FC<IconProps> = (props) => (
  <BaseIcon {...props}>
    <circle cx="12" cy="12" r="1" />
    <circle cx="12" cy="5" r="1" />
    <circle cx="12" cy="19" r="1" />
  </BaseIcon>
)
IconMoreVertical.displayName = 'IconMoreVertical'

export const IconGrid: React.FC<IconProps> = (props) => (
  <BaseIcon {...props}>
    <rect x="3" y="3" width="7" height="7" />
    <rect x="14" y="3" width="7" height="7" />
    <rect x="14" y="14" width="7" height="7" />
    <rect x="3" y="14" width="7" height="7" />
  </BaseIcon>
)
IconGrid.displayName = 'IconGrid'

export const IconList: React.FC<IconProps> = (props) => (
  <BaseIcon {...props}>
    <line x1="8" y1="6" x2="21" y2="6" />
    <line x1="8" y1="12" x2="21" y2="12" />
    <line x1="8" y1="18" x2="21" y2="18" />
    <line x1="3" y1="6" x2="3.01" y2="6" />
    <line x1="3" y1="12" x2="3.01" y2="12" />
    <line x1="3" y1="18" x2="3.01" y2="18" />
  </BaseIcon>
)
IconList.displayName = 'IconList'

export const IconDrag: React.FC<IconProps> = (props) => (
  <BaseIcon {...props}>
    <circle cx="9" cy="5" r="1" />
    <circle cx="9" cy="12" r="1" />
    <circle cx="9" cy="19" r="1" />
    <circle cx="15" cy="5" r="1" />
    <circle cx="15" cy="12" r="1" />
    <circle cx="15" cy="19" r="1" />
  </BaseIcon>
)
IconDrag.displayName = 'IconDrag'

export const IconCart: React.FC<IconProps> = (props) => (
  <BaseIcon {...props}>
    <circle cx="9" cy="21" r="1" />
    <circle cx="20" cy="21" r="1" />
    <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
  </BaseIcon>
)
IconCart.displayName = 'IconCart'

// IconExpand is an alias for IconMaximize
export const IconExpand = IconMaximize
IconExpand.displayName = 'IconExpand'

// IconContract is an alias for IconMinimize
export const IconContract = IconMinimize
IconContract.displayName = 'IconContract'

export const IconApps: React.FC<IconProps> = (props) => (
  <BaseIcon {...props}>
    <rect x="3" y="3" width="7" height="7" rx="1.5" />
    <rect x="14" y="3" width="7" height="7" rx="1.5" />
    <rect x="3" y="14" width="7" height="7" rx="1.5" />
    <rect x="14" y="14" width="7" height="7" rx="1.5" />
  </BaseIcon>
)
IconApps.displayName = 'IconApps'

export const IconProduct: React.FC<IconProps> = (props) => (
  <BaseIcon {...props}>
    <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
    <polyline points="3.27 6.96 12 12.01 20.73 6.96" />
    <line x1="12" y1="22.08" x2="12" y2="12" />
  </BaseIcon>
)
IconProduct.displayName = 'IconProduct'

export const IconBundle: React.FC<IconProps> = (props) => (
  <BaseIcon {...props}>
    <polygon points="12 2 2 7 12 12 22 7 12 2" />
    <polyline points="2 17 12 22 22 17" />
    <polyline points="2 12 12 17 22 12" />
  </BaseIcon>
)
IconBundle.displayName = 'IconBundle'

export const IconIntegration: React.FC<IconProps> = (props) => (
  <BaseIcon {...props}>
    <circle cx="18" cy="18" r="3" />
    <circle cx="6" cy="6" r="3" />
    <path d="M13 6h3a2 2 0 0 1 2 2v7" />
    <path d="M11 18H8a2 2 0 0 1-2-2V9" />
  </BaseIcon>
)
IconIntegration.displayName = 'IconIntegration'

// =============================================================================
// SOCIAL/ENGAGEMENT ICONS
// =============================================================================

export const IconStar: React.FC<IconProps> = (props) => (
  <BaseIcon {...props}>
    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
  </BaseIcon>
)
IconStar.displayName = 'IconStar'

export const IconHeart: React.FC<IconProps> = (props) => (
  <BaseIcon {...props}>
    <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
  </BaseIcon>
)
IconHeart.displayName = 'IconHeart'

export const IconThumbsUp: React.FC<IconProps> = (props) => (
  <BaseIcon {...props}>
    <path d="M14 9V5a3 3 0 0 0-3-3l-4 9v11h11.28a2 2 0 0 0 2-1.7l1.38-9a2 2 0 0 0-2-2.3zM7 22H4a2 2 0 0 1-2-2v-7a2 2 0 0 1 2-2h3" />
  </BaseIcon>
)
IconThumbsUp.displayName = 'IconThumbsUp'

export const IconThumbsDown: React.FC<IconProps> = (props) => (
  <BaseIcon {...props}>
    <path d="M10 15v4a3 3 0 0 0 3 3l4-9V2H5.72a2 2 0 0 0-2 1.7l-1.38 9a2 2 0 0 0 2 2.3zm7-13h2.67A2.31 2.31 0 0 1 22 4v7a2.31 2.31 0 0 1-2.33 2H17" />
  </BaseIcon>
)
IconThumbsDown.displayName = 'IconThumbsDown'

// =============================================================================
// COMMUNICATION ICONS
// =============================================================================

export const IconMail: React.FC<IconProps> = (props) => (
  <BaseIcon {...props}>
    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
    <polyline points="22,6 12,13 2,6" />
  </BaseIcon>
)
IconMail.displayName = 'IconMail'

export const IconBell: React.FC<IconProps> = (props) => (
  <BaseIcon {...props}>
    <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
    <path d="M13.73 21a2 2 0 0 1-3.46 0" />
  </BaseIcon>
)
IconBell.displayName = 'IconBell'

export const IconSun: React.FC<IconProps> = (props) => (
  <BaseIcon {...props}>
    <circle cx="12" cy="12" r="5" />
    <path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42" />
  </BaseIcon>
)
IconSun.displayName = 'IconSun'

export const IconMoon: React.FC<IconProps> = (props) => (
  <BaseIcon {...props}>
    <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
  </BaseIcon>
)
IconMoon.displayName = 'IconMoon'

export const IconMessageCircle: React.FC<IconProps> = (props) => (
  <BaseIcon {...props}>
    <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" />
  </BaseIcon>
)
IconMessageCircle.displayName = 'IconMessageCircle'

// =============================================================================
// DESIGN SYSTEM SPECIFIC ICONS
// =============================================================================

export const IconColors: React.FC<IconProps> = (props) => (
  <BaseIcon {...props}>
    <circle cx="12" cy="12" r="10" />
    <path d="M12 2v20" />
    <path d="M12 2a10 10 0 0 1 0 20" fill="currentColor" fillOpacity="0.3" stroke="none" />
  </BaseIcon>
)
IconColors.displayName = 'IconColors'

export const IconTypography: React.FC<IconProps> = (props) => (
  <BaseIcon {...props}>
    <polyline points="4 7 4 4 20 4 20 7" />
    <line x1="9" y1="20" x2="15" y2="20" />
    <line x1="12" y1="4" x2="12" y2="20" />
  </BaseIcon>
)
IconTypography.displayName = 'IconTypography'

export const IconSpacing: React.FC<IconProps> = (props) => (
  <BaseIcon {...props}>
    <rect x="3" y="3" width="18" height="18" rx="2" />
    <line x1="3" y1="9" x2="21" y2="9" />
    <line x1="3" y1="15" x2="21" y2="15" />
    <line x1="9" y1="3" x2="9" y2="21" />
    <line x1="15" y1="3" x2="15" y2="21" />
  </BaseIcon>
)
IconSpacing.displayName = 'IconSpacing'

export const IconRadius: React.FC<IconProps> = (props) => (
  <BaseIcon {...props}>
    <path d="M3 9V6a3 3 0 0 1 3-3h3" />
    <path d="M21 9V6a3 3 0 0 0-3-3h-3" />
    <path d="M21 15v3a3 3 0 0 1-3 3h-3" />
    <path d="M3 15v3a3 3 0 0 0 3 3h3" />
  </BaseIcon>
)
IconRadius.displayName = 'IconRadius'

export const IconShadows: React.FC<IconProps> = (props) => (
  <BaseIcon {...props}>
    <rect x="3" y="3" width="14" height="14" rx="2" />
    <path d="M7 21h12a2 2 0 0 0 2-2V7" opacity="0.4" />
  </BaseIcon>
)
IconShadows.displayName = 'IconShadows'

export const IconBreakpoints: React.FC<IconProps> = (props) => (
  <BaseIcon {...props}>
    <rect x="2" y="3" width="20" height="14" rx="2" />
    <line x1="8" y1="21" x2="16" y2="21" />
    <line x1="12" y1="17" x2="12" y2="21" />
  </BaseIcon>
)
IconBreakpoints.displayName = 'IconBreakpoints'

export const IconAvatar: React.FC<IconProps> = (props) => (
  <BaseIcon {...props}>
    <circle cx="12" cy="8" r="4" />
    <path d="M4 20c0-4 4-6 8-6s8 2 8 6" />
  </BaseIcon>
)
IconAvatar.displayName = 'IconAvatar'

export const IconButton: React.FC<IconProps> = (props) => (
  <BaseIcon {...props}>
    <rect x="3" y="8" width="18" height="8" rx="4" />
    <line x1="8" y1="12" x2="16" y2="12" />
  </BaseIcon>
)
IconButton.displayName = 'IconButton'

export const IconTab: React.FC<IconProps> = (props) => (
  <BaseIcon {...props}>
    <path d="M3 6h18" />
    <path d="M3 12h18" />
    <rect x="3" y="3" width="6" height="6" rx="1" fill="currentColor" fillOpacity="0.2" />
  </BaseIcon>
)
IconTab.displayName = 'IconTab'

export const IconBanner: React.FC<IconProps> = (props) => (
  <BaseIcon {...props}>
    <rect x="2" y="4" width="20" height="16" rx="2" />
    <line x1="6" y1="8" x2="18" y2="8" />
    <line x1="6" y1="12" x2="14" y2="12" />
  </BaseIcon>
)
IconBanner.displayName = 'IconBanner'

export const IconFoundations: React.FC<IconProps> = (props) => (
  <BaseIcon {...props}>
    <polygon points="12 2 2 7 12 12 22 7 12 2" />
    <polyline points="2 17 12 22 22 17" />
    <polyline points="2 12 12 17 22 12" />
  </BaseIcon>
)
IconFoundations.displayName = 'IconFoundations'

export const IconComponents: React.FC<IconProps> = (props) => (
  <BaseIcon {...props}>
    <rect x="3" y="3" width="7" height="7" rx="1" />
    <rect x="14" y="3" width="7" height="7" rx="1" />
    <rect x="3" y="14" width="7" height="7" rx="1" />
    <rect x="14" y="14" width="7" height="7" rx="1" />
  </BaseIcon>
)
IconComponents.displayName = 'IconComponents'

export const IconIcons: React.FC<IconProps> = (props) => (
  <BaseIcon {...props}>
    <rect x="3" y="3" width="18" height="18" rx="2" />
    <circle cx="8.5" cy="8.5" r="1.5" />
    <path d="M21 15l-5-5L5 21" />
  </BaseIcon>
)
IconIcons.displayName = 'IconIcons'

export const IconBadge: React.FC<IconProps> = (props) => (
  <BaseIcon {...props}>
    <rect x="3" y="8" width="18" height="8" rx="4" />
    <circle cx="7" cy="12" r="1.5" fill="currentColor" />
    <line x1="11" y1="12" x2="17" y2="12" />
  </BaseIcon>
)
IconBadge.displayName = 'IconBadge'

export const IconLayoutCard: React.FC<IconProps> = (props) => (
  <BaseIcon {...props}>
    <rect x="3" y="3" width="18" height="18" rx="2" />
    <rect x="5" y="5" width="6" height="6" rx="1" />
    <line x1="13" y1="6" x2="17" y2="6" />
    <line x1="13" y1="9" x2="17" y2="9" />
    <line x1="5" y1="14" x2="19" y2="14" />
    <line x1="5" y1="17" x2="15" y2="17" />
  </BaseIcon>
)
IconLayoutCard.displayName = 'IconLayoutCard'

export const IconListItem: React.FC<IconProps> = (props) => (
  <BaseIcon {...props}>
    <line x1="8" y1="6" x2="21" y2="6" />
    <line x1="8" y1="12" x2="21" y2="12" />
    <line x1="8" y1="18" x2="21" y2="18" />
    <circle cx="4" cy="6" r="1.5" fill="currentColor" />
    <circle cx="4" cy="12" r="1.5" fill="currentColor" />
    <circle cx="4" cy="18" r="1.5" fill="currentColor" />
  </BaseIcon>
)
IconListItem.displayName = 'IconListItem'

export const IconStepper: React.FC<IconProps> = (props) => (
  <BaseIcon {...props}>
    <circle cx="6" cy="5" r="3" fill="currentColor" fillOpacity="0.3" />
    <line x1="6" y1="8" x2="6" y2="12" />
    <circle cx="6" cy="15" r="3" />
    <line x1="6" y1="18" x2="6" y2="22" opacity="0.4" />
    <line x1="11" y1="5" x2="20" y2="5" />
    <line x1="11" y1="15" x2="20" y2="15" />
  </BaseIcon>
)
IconStepper.displayName = 'IconStepper'

/**
 * IconLeftNav - Left navigation sidebar icon
 * Shows a frame with navigation panel on the left containing menu items
 * Used for the LeftNav component in the design system
 */
export const IconLeftNav: React.FC<IconProps> = (props) => (
  <BaseIcon {...props}>
    {/* Outer frame */}
    <rect x="3" y="3" width="18" height="18" rx="2" />
    {/* Vertical divider separating nav from content */}
    <line x1="9" y1="3" x2="9" y2="21" />
    {/* Navigation menu items in left panel */}
    <line x1="5" y1="7" x2="7" y2="7" />
    <line x1="5" y1="11" x2="7" y2="11" />
    <line x1="5" y1="15" x2="7" y2="15" />
    {/* Content area placeholder lines */}
    <line x1="12" y1="8" x2="18" y2="8" opacity="0.4" />
    <line x1="12" y1="12" x2="18" y2="12" opacity="0.4" />
  </BaseIcon>
)
IconLeftNav.displayName = 'IconLeftNav'

// =============================================================================
// STATUS/STATE ICONS (for Stepper, Progress, Workflows)
// =============================================================================

/**
 * IconStatusComplete - Filled circle with checkmark
 * Used to indicate a completed step or task
 */
export const IconStatusComplete: React.FC<IconProps> = (props) => (
  <BaseIcon {...props} strokeWidth={0}>
    <circle cx="12" cy="12" r="10" fill="currentColor" />
    <path
      d="M8 12l3 3 5-6"
      stroke="white"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      fill="none"
    />
  </BaseIcon>
)
IconStatusComplete.displayName = 'IconStatusComplete'

/**
 * IconStatusInProgress - Half-filled circle
 * Used to indicate an in-progress/active step or task
 * Right half is filled at 30% opacity to convey partial completion
 */
export const IconStatusInProgress: React.FC<IconProps> = (props) => (
  <BaseIcon {...props}>
    <circle cx="12" cy="12" r="9" />
    <path d="M12 3a9 9 0 0 1 0 18" fill="currentColor" fillOpacity="0.3" stroke="none" />
  </BaseIcon>
)
IconStatusInProgress.displayName = 'IconStatusInProgress'

/**
 * IconStatusNotStarted - Dashed circle outline
 * Used to indicate a pending/not-started step or task
 */
export const IconStatusNotStarted: React.FC<IconProps> = (props) => (
  <BaseIcon {...props}>
    <circle cx="12" cy="12" r="9" strokeDasharray="4 3" />
  </BaseIcon>
)
IconStatusNotStarted.displayName = 'IconStatusNotStarted'

/**
 * IconStatusDisabled - Dashed circle outline
 * Used to indicate a disabled step or task
 * A11y: strokeOpacity="0.6" ensures 3:1+ contrast ratio (WCAG 1.4.11)
 */
export const IconStatusDisabled: React.FC<IconProps> = (props) => (
  <BaseIcon {...props}>
    <circle
      cx="12"
      cy="12"
      r="9"
      strokeDasharray="4 3"
      strokeOpacity="0.6"
    />
  </BaseIcon>
)
IconStatusDisabled.displayName = 'IconStatusDisabled'

// =============================================================================
// BANNER ICONS (Contextual/Status Icons with Background)
// =============================================================================

import { bannerIcon } from '@/styles/design-tokens'
import { IconInfoFilled } from './IconInfoFilled'
import { IconSuccessFilled } from './IconSuccessFilled'
import { IconWarningFilled } from './IconWarningFilled'
import { IconErrorFilled } from './IconErrorFilled'

/**
 * Banner icon variant types
 */
export type BannerIconVariant = 'information' | 'success' | 'warning' | 'important'

/**
 * Props for BannerIcon component
 */
export interface BannerIconProps {
  /** Icon variant - determines color scheme */
  variant?: BannerIconVariant
  /** Use dark mode colors (for dark backgrounds) */
  onDark?: boolean
  /** Additional CSS class name */
  className?: string
  /** Additional inline styles */
  style?: React.CSSProperties
}

/**
 * BannerIcon - Contextual status icon with colored background
 *
 * Used in banners, alerts, and notifications to provide visual context
 * for different message types.
 *
 * @example
 * ```tsx
 * <BannerIcon variant="success" />
 * <BannerIcon variant="warning" onDark />
 * ```
 */
export const BannerIcon: React.FC<BannerIconProps> = ({
  variant = 'information',
  onDark = false,
  className = '',
  style = {},
}) => {
  const tokens = onDark ? bannerIcon.variantsOnDark[variant] : bannerIcon.variants[variant]

  const containerStyle: React.CSSProperties = {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: bannerIcon.padding,
    borderRadius: bannerIcon.borderRadius,
    backgroundColor: tokens.background,
    flexShrink: 0,
    ...style,
  }

  const renderIcon = () => {
    switch (variant) {
      case 'information':
        return <IconInfoFilled size="lg" color={tokens.icon} />
      case 'success':
        return <IconSuccessFilled size="lg" color={tokens.icon} />
      case 'warning':
        return <IconWarningFilled size="lg" color={tokens.icon} />
      case 'important':
        return <IconErrorFilled size="lg" color={tokens.icon} />
    }
  }

  return (
    <div className={className} style={containerStyle}>
      {renderIcon()}
    </div>
  )
}
BannerIcon.displayName = 'BannerIcon'

// =============================================================================
// DATA TABLE ICON
// =============================================================================

/**
 * IconDataTable - Data table icon
 * Shows a table grid with header row and data rows, representing
 * the DataTable component in the design system
 */
export const IconDataTable: React.FC<IconProps> = (props) => (
  <BaseIcon {...props}>
    {/* Table outline */}
    <rect x="3" y="3" width="18" height="18" rx="2" />
    {/* Header divider */}
    <line x1="3" y1="8" x2="21" y2="8" />
    {/* Row dividers */}
    <line x1="3" y1="13" x2="21" y2="13" />
    <line x1="3" y1="18" x2="21" y2="18" />
    {/* Column dividers */}
    <line x1="9" y1="3" x2="9" y2="21" />
    <line x1="15" y1="3" x2="15" y2="21" />
  </BaseIcon>
)
IconDataTable.displayName = 'IconDataTable'

// =============================================================================
// UPLOAD-RELATED ICONS
// =============================================================================

export const IconPaperclip: React.FC<IconProps> = (props) => (
  <BaseIcon {...props}>
    <path d="M21.44 11.05l-9.19 9.19a6 6 0 0 1-8.49-8.49l9.19-9.19a4 4 0 0 1 5.66 5.66l-9.2 9.19a2 2 0 0 1-2.83-2.83l8.49-8.48" />
  </BaseIcon>
)
IconPaperclip.displayName = 'IconPaperclip'

export const IconImport: React.FC<IconProps> = (props) => (
  <BaseIcon {...props}>
    <path d="M12 3v12" />
    <path d="M8 11l4 4 4-4" />
    <path d="M20 21H4" />
    <path d="M20 17V5a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v12" />
  </BaseIcon>
)
IconImport.displayName = 'IconImport'

export const IconFilePdf: React.FC<IconProps> = (props) => (
  <BaseIcon {...props}>
    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
    <polyline points="14 2 14 8 20 8" />
    <path d="M7 15h2a1.5 1.5 0 0 0 0-3H7v6" />
    <path d="M13 13h1.5a1.5 1.5 0 0 1 0 3H13v-6h1.5a1.5 1.5 0 0 1 0 3" />
  </BaseIcon>
)
IconFilePdf.displayName = 'IconFilePdf'
