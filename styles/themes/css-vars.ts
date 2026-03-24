/**
 * CSS Custom Property utilities for the theme system.
 *
 * flattenTokens     – turns a nested string record into a flat
 *                     Record<'--prism-brand-default', '#005151'> map
 *                     (used by the provider to set vars on :root).
 *
 * tokensToVarRefs   – mirrors the record shape but every leaf value
 *                     is `var(--prism-brand-default)` etc.
 *                     (used by design-tokens.ts so components get
 *                     live CSS variable references).
 *
 * applyAllThemeVars – applies ALL token categories (colors, typography,
 *                     radius, elevation, spacing, iconStyle) on a target
 *                     element using category-specific prefixes.
 */

import type { ProductTheme } from './theme-interface';

type NestedRecord = { [key: string]: string | NestedRecord };

// ---------------------------------------------------------------------------
// Core utilities (generic — work on any nested string record)
// ---------------------------------------------------------------------------

export function flattenTokens(
  obj: NestedRecord,
  prefix = '--prism',
): Record<string, string> {
  const result: Record<string, string> = {};

  for (const [key, value] of Object.entries(obj)) {
    const varName = `${prefix}-${key}`;

    if (typeof value === 'string') {
      result[varName] = value;
    } else {
      Object.assign(result, flattenTokens(value, varName));
    }
  }

  return result;
}

export function tokensToVarRefs(
  obj: NestedRecord,
  prefix = '--prism',
): NestedRecord {
  const result: NestedRecord = {};

  for (const [key, value] of Object.entries(obj)) {
    const varName = `${prefix}-${key}`;

    if (typeof value === 'string') {
      result[key] = `var(${varName})`;
    } else {
      result[key] = tokensToVarRefs(value, varName);
    }
  }

  return result;
}

// ---------------------------------------------------------------------------
// Backward-compatible aliases (used by design-tokens.ts)
// ---------------------------------------------------------------------------

/** @deprecated Use flattenTokens */
export const flattenThemeColors = flattenTokens;
/** @deprecated Use tokensToVarRefs */
export const themeColorsToVarRefs = tokensToVarRefs;

// ---------------------------------------------------------------------------
// Apply functions
// ---------------------------------------------------------------------------

/** Apply a single token category's vars to a target element. */
export function applyThemeVars(
  tokens: NestedRecord,
  target: HTMLElement,
  prefix = '--prism',
): void {
  const vars = flattenTokens(tokens, prefix);
  for (const [name, value] of Object.entries(vars)) {
    target.style.setProperty(name, value);
  }
}

/**
 * Apply ALL theme token categories to a target element.
 * Each category gets its own CSS custom property prefix:
 *   colors     → --prism-*
 *   typography  → --prism-typo-*
 *   borderRadius → --prism-radius-*
 *   elevation   → --prism-elevation-*
 *   spacing     → --prism-space-*
 *   iconStyle   → --prism-icon-style-*
 */
export function applyAllThemeVars(
  theme: ProductTheme,
  target: HTMLElement,
): void {
  // Colors (existing prefix)
  applyThemeVars(theme.colors as unknown as NestedRecord, target, '--prism');

  // Typography
  applyThemeVars(theme.typography as unknown as NestedRecord, target, '--prism-typo');

  // Border Radius
  applyThemeVars(theme.borderRadius as unknown as NestedRecord, target, '--prism-radius');

  // Elevation (Shadows)
  applyThemeVars(theme.elevation as unknown as NestedRecord, target, '--prism-elevation');

  // Spacing
  applyThemeVars(theme.spacing as unknown as NestedRecord, target, '--prism-space');

  // Icon Style (skip `overrides` — it's an object with non-string-leaf values for runtime use)
  const { overrides: _overrides, ...iconStyleVars } = theme.iconStyle;
  applyThemeVars(iconStyleVars as unknown as NestedRecord, target, '--prism-icon-style');

  // Component Radius (per-theme semantic radius overrides)
  applyThemeVars(theme.componentRadius as unknown as NestedRecord, target, '--prism-comp-radius');

  // Data Visualization palette
  applyThemeVars(theme.colors.dataViz as unknown as NestedRecord, target, '--prism-dataviz');
}
