'use client'

import React from 'react'
import { 
  avatar, 
  colors, 
  fontFamilies, 
  transitionPresets 
} from '@/styles/design-tokens'

// =============================================================================
// TYPES & CONTRACTS
// =============================================================================

/**
 * Avatar size options
 * - xl: 96px - Extra large, used for profile headers
 * - lg: 72px - Large, used for profile cards
 * - md: 40px - Medium (default), used in lists and comments
 * - sm: 32px - Small, used in compact lists
 * - xs: 24px - Extra small, used inline with text
 */
export type AvatarSize = 'xl' | 'lg' | 'md' | 'sm' | 'xs'

/**
 * Avatar color variant for initials
 * 8 different background colors available
 */
export type AvatarColor = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8

/**
 * Avatar component props
 */
export interface AvatarProps {
  /** Image source URL */
  src?: string
  /** Alt text for the image */
  alt?: string
  /** User's name - used for initials fallback and alt text */
  name?: string
  /** Size of the avatar */
  size?: AvatarSize
  /** Color variant for initials (1-8) */
  color?: AvatarColor
  /** Whether the avatar is focused (shows focus ring) */
  focused?: boolean
  /** Whether displayed on a dark surface (adds border) */
  onDark?: boolean
  /** Optional click handler */
  onClick?: () => void
  /** Additional CSS class name */
  className?: string
  /** Additional inline styles */
  style?: React.CSSProperties
}

/**
 * Avatar Group component props
 */
export interface AvatarGroupProps {
  /** Array of avatar props */
  avatars: AvatarProps[]
  /** Maximum number of avatars to display */
  max?: number
  /** Size of avatars in the group */
  size?: AvatarSize
  /** Whether to use compact (overlapping) layout */
  compact?: boolean
  /** Click handler for the overflow indicator */
  onOverflowClick?: () => void
  /** Additional CSS class name */
  className?: string
  /** Additional inline styles */
  style?: React.CSSProperties
}

// =============================================================================
// UTILITY FUNCTIONS
// =============================================================================

/**
 * Generate initials from a name
 * @param name - Full name string
 * @returns Up to 2 characters for initials
 */
function getInitials(name: string): string {
  if (!name) return ''
  
  const words = name.trim().split(/\s+/)
  if (words.length === 1) {
    return words[0].substring(0, 2).toUpperCase()
  }
  return (words[0][0] + words[words.length - 1][0]).toUpperCase()
}

/**
 * Generate a consistent color based on name
 * @param name - Name to hash
 * @returns Color number 1-8
 */
function getColorFromName(name: string): AvatarColor {
  if (!name) return 1
  
  let hash = 0
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash)
  }
  return ((Math.abs(hash) % 8) + 1) as AvatarColor
}

/**
 * Get size in pixels
 */
function getSizeValue(size: AvatarSize): number {
  const sizeMap: Record<AvatarSize, number> = {
    xl: 96,
    lg: 72,
    md: 40,
    sm: 32,
    xs: 24,
  }
  return sizeMap[size]
}

// =============================================================================
// AVATAR COMPONENT
// =============================================================================

/**
 * Avatar Component
 * 
 * Displays a user avatar as either an image or initials with a colored background.
 * Supports 5 sizes (xl, lg, md, sm, xs) and 8 color variants for initials.
 * 
 * @example
 * // Image avatar
 * <Avatar src="/user.jpg" name="John Doe" size="md" />
 * 
 * @example
 * // Initials avatar
 * <Avatar name="Jane Smith" size="lg" color={3} />
 * 
 * @example
 * // With focus state
 * <Avatar name="User" focused />
 */
export function Avatar({
  src,
  alt,
  name = '',
  size = 'md',
  color,
  focused = false,
  onDark = false,
  onClick,
  className,
  style,
}: AvatarProps) {
  const [imageError, setImageError] = React.useState(false)
  
  const showImage = src && !imageError
  const initials = getInitials(name)
  const avatarColor = color ?? getColorFromName(name)
  const typographyStyle = avatar.typography[size]
  const avatarBorderRadius = avatar.borderRadius[size]
  
  const handleImageError = () => {
    setImageError(true)
  }
  
  const baseStyles: React.CSSProperties = {
    position: 'relative',
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: avatar.sizes[size],
    height: avatar.sizes[size],
    borderRadius: avatarBorderRadius,
    overflow: 'hidden',
    flexShrink: 0,
    cursor: onClick ? 'pointer' : 'default',
    transition: transitionPresets.default,
    ...style,
  }
  
  const imageStyles: React.CSSProperties = {
    width: '100%',
    height: '100%',
    objectFit: 'cover',
  }
  
  const initialsContainerStyles: React.CSSProperties = {
    width: '100%',
    height: '100%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: avatar.colors[avatarColor],
  }
  
  const initialsTextStyles: React.CSSProperties = {
    fontFamily: fontFamilies.display,
    fontSize: typographyStyle.fontSize,
    fontWeight: typographyStyle.fontWeight,
    lineHeight: typographyStyle.lineHeight,
    color: colors.text.highEmphasis.onLight,
    userSelect: 'none',
  }
  
  const focusRingStyles: React.CSSProperties = {
    position: 'absolute',
    inset: `-${avatar.focus.offset}`,
    borderRadius: '9999px', // Focus ring is circular per Figma
    border: `${avatar.focus.width} solid ${avatar.focus.color}`,
    pointerEvents: 'none',
  }
  
  const darkBorderStyles: React.CSSProperties = {
    position: 'absolute',
    inset: 0,
    borderRadius: avatarBorderRadius,
    border: `${avatar.border.width} solid ${avatar.border.color}`,
    pointerEvents: 'none',
  }
  
  return (
    <div
      className={className}
      style={baseStyles}
      onClick={onClick}
      role={onClick ? 'button' : undefined}
      tabIndex={onClick ? 0 : undefined}
      aria-label={alt || name || 'Avatar'}
    >
      {showImage ? (
        <img
          src={src}
          alt={alt || name}
          style={imageStyles}
          onError={handleImageError}
        />
      ) : (
        <div style={initialsContainerStyles}>
          <span style={initialsTextStyles}>{initials}</span>
        </div>
      )}
      
      {onDark && <div style={darkBorderStyles} />}
      {focused && <div style={focusRingStyles} />}
    </div>
  )
}

// =============================================================================
// AVATAR GROUP COMPONENT
// =============================================================================

/**
 * Avatar Group Component
 * 
 * Displays multiple avatars in a row, with optional overlap for compact mode.
 * Shows an overflow indicator when there are more avatars than the max.
 * 
 * @example
 * // Standard group
 * <AvatarGroup
 *   avatars={[
 *     { name: "John Doe", src: "/john.jpg" },
 *     { name: "Jane Smith" },
 *     { name: "Bob Wilson" },
 *   ]}
 *   max={3}
 * />
 * 
 * @example
 * // Compact (overlapping) group
 * <AvatarGroup avatars={users} compact max={5} />
 */
export function AvatarGroup({
  avatars,
  max = 5,
  size = 'md',
  compact = false,
  onOverflowClick,
  className,
  style,
}: AvatarGroupProps) {
  const visibleAvatars = avatars.slice(0, max)
  const overflowCount = Math.max(0, avatars.length - max)
  const sizeValue = getSizeValue(size)
  const avatarBorderRadius = avatar.borderRadius[size]
  
  // Overlap offset for compact mode (negative margin) - 30% overlap per Figma
  const overlapOffset = compact ? -(sizeValue * avatar.group.overlapRatio) : 4
  
  const containerStyles: React.CSSProperties = {
    display: 'inline-flex',
    alignItems: 'center',
    ...style,
  }
  
  const avatarWrapperStyles = (index: number): React.CSSProperties => ({
    marginLeft: index > 0 ? `${overlapOffset}px` : 0,
    position: 'relative',
    zIndex: visibleAvatars.length - index,
  })
  
  // Overflow indicator styling to match Figma (pill shape)
  const overflowStyles: React.CSSProperties = {
    marginLeft: compact ? `${overlapOffset}px` : '4px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    height: avatar.sizes[size],
    minWidth: avatar.sizes[size],
    paddingLeft: '8px',
    paddingRight: '8px',
    borderRadius: avatarBorderRadius,
    backgroundColor: colors.surface.lightDarker,
    fontFamily: fontFamilies.display,
    fontSize: avatar.typography[size].fontSize,
    fontWeight: 600,
    color: colors.text.lowEmphasis.onLight,
    cursor: onOverflowClick ? 'pointer' : 'default',
    userSelect: 'none',
    flexShrink: 0,
    border: compact ? `${avatar.group.borderWidth} solid ${avatar.group.borderColor}` : 'none',
    boxSizing: 'border-box',
  }
  
  // Avatar with border for group display
  const getAvatarStyle = (avatarProps: AvatarProps): React.CSSProperties => ({
    ...avatarProps.style,
    border: compact ? `${avatar.group.borderWidth} solid ${avatar.group.borderColor}` : 'none',
    boxSizing: 'border-box',
  })
  
  return (
    <div className={className} style={containerStyles} role="group" aria-label="Avatar group">
      {visibleAvatars.map((avatarProps, index) => (
        <div key={avatarProps.name || index} style={avatarWrapperStyles(index)}>
          <Avatar
            {...avatarProps}
            size={size}
            style={getAvatarStyle(avatarProps)}
          />
        </div>
      ))}
      
      {overflowCount > 0 && (
        <div
          style={overflowStyles}
          onClick={onOverflowClick}
          role={onOverflowClick ? 'button' : undefined}
          tabIndex={onOverflowClick ? 0 : undefined}
          aria-label={`${overflowCount} more users`}
        >
          +{overflowCount}
        </div>
      )}
    </div>
  )
}

// =============================================================================
// EXPORTS
// =============================================================================

export default Avatar
