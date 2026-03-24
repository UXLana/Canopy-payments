/**
 * Icon Registry — resolves icon names to components based on the active theme's
 * icon style preferences.
 *
 * Each icon "set" (outlined, filled, duotone) is a lazy-populated map of
 * { iconName: Component }. When a variant doesn't exist in the preferred set,
 * the resolver falls back to 'outlined' (the default/complete set).
 *
 * Registration happens at module load time via the barrel exports in
 * each set's directory.
 */

import type { ComponentType } from 'react';
import type { IconProps } from './Icons';
import type { IconSetName } from '@/styles/themes/theme-interface';

export type { IconSetName };

// ---------------------------------------------------------------------------
// Registry data structure
// ---------------------------------------------------------------------------

const iconSets: Record<IconSetName, Record<string, ComponentType<IconProps>>> = {
  outlined: {},
  filled: {},
  duotone: {},
};

// ---------------------------------------------------------------------------
// Registration
// ---------------------------------------------------------------------------

/**
 * Register an icon component into a specific set.
 * Called at module initialization time by each icon file.
 */
export function registerIcon(
  set: IconSetName,
  name: string,
  component: ComponentType<IconProps>,
): void {
  iconSets[set][name] = component;
}

/**
 * Bulk-register multiple icons into a set.
 */
export function registerIcons(
  set: IconSetName,
  icons: Record<string, ComponentType<IconProps>>,
): void {
  Object.assign(iconSets[set], icons);
}

// ---------------------------------------------------------------------------
// Resolution
// ---------------------------------------------------------------------------

/**
 * Resolve an icon name to a component, respecting the theme's preferred set
 * and per-icon overrides.
 *
 * Resolution order:
 * 1. Check theme `overrides` map (e.g. { Home: 'outlined' })
 * 2. Look in the `preferredSet`
 * 3. Fall back to 'outlined'
 * 4. Return undefined if nothing found
 */
export function resolveIcon(
  name: string,
  preferredSet: IconSetName = 'outlined',
  overrides?: Record<string, string>,
): ComponentType<IconProps> | undefined {
  // 1. Per-icon override
  if (overrides?.[name]) {
    const overrideSet = overrides[name] as IconSetName;
    const overrideIcon = iconSets[overrideSet]?.[name];
    if (overrideIcon) return overrideIcon;
  }

  // 2. Preferred set
  const preferred = iconSets[preferredSet]?.[name];
  if (preferred) return preferred;

  // 3. Fallback to outlined
  if (preferredSet !== 'outlined') {
    return iconSets.outlined[name];
  }

  return undefined;
}

/**
 * Get all registered icon names across all sets.
 */
export function getRegisteredIconNames(): string[] {
  const names = new Set<string>();
  for (const set of Object.values(iconSets)) {
    for (const name of Object.keys(set)) {
      names.add(name);
    }
  }
  return Array.from(names).sort();
}

/**
 * Check if an icon exists in a specific set.
 */
export function hasIcon(name: string, set: IconSetName = 'outlined'): boolean {
  return name in iconSets[set];
}
