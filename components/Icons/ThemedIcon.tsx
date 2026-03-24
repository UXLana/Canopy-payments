'use client';

/**
 * ThemedIcon — theme-aware icon component that resolves the correct icon
 * variant (outlined/filled/duotone) based on the active product theme.
 *
 * Usage:
 *   <ThemedIcon name="Search" size="md" />
 *
 * Resolution:
 * 1. Checks the theme's per-icon `overrides` map
 * 2. Tries the theme's preferred icon `set`
 * 3. Falls back to the 'outlined' set
 *
 * For backward compatibility, existing direct imports still work:
 *   import { IconSearch } from '@/components/Icons'
 *   <IconSearch size="md" />
 *
 * The above pattern uses the outlined icon with themed strokeWidth from
 * the CSS var --prism-icon-style-strokeWidth.
 */

import React from 'react';
import type { IconProps } from './Icons';
import { resolveIcon } from './registry';
import type { IconSetName } from './registry';
import { useIconStyle } from '../../styles/themes';

export interface ThemedIconProps extends IconProps {
  /** Icon name — matches the export name without the "Icon" prefix.
   *  e.g. "Search" resolves to IconSearch */
  name: string;
}

export const ThemedIcon: React.FC<ThemedIconProps> = ({ name, ...props }) => {
  const iconStyle = useIconStyle();

  const Icon = resolveIcon(
    name,
    iconStyle.set as IconSetName,
    iconStyle.overrides,
  );

  if (!Icon) {
    if (process.env.NODE_ENV === 'development') {
      console.warn(`[ThemedIcon] No icon found for "${name}" in set "${iconStyle.set}" or fallback "outlined"`);
    }
    return null;
  }

  return <Icon {...props} />;
};

ThemedIcon.displayName = 'ThemedIcon';
