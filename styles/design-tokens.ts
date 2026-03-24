/**
 * Prism Design System - Design Tokens
 * Source: Trace Design System v2.0 (Figma)
 * https://www.figma.com/design/gc68toINDS8Ovsan5aVPS2/Trace-Design-System-v2.0--wip-
 *
 * Color taxonomy: prism_sys_color_* (matches Figma variable naming exactly)
 * Typography: DM Sans
 *
 * Last updated: 2026-02-10
 *
 * THEMING:
 * - Colors use CSS custom properties (--prism-*) so they respond to theme changes
 *   automatically — no component code changes needed.
 * - The SwitchableThemeProvider sets --prism-* vars on :root at runtime.
 * - Default (Trace) values live in globals.css for flash-free first paint.
 * - Typography, spacing, radius, shadows, breakpoints are shared across all themes.
 *
 * Token extraction via /figma-token-extractor from node 2086-41222 (Color & styles)
 * Taxonomy restructured to match Figma 1:1 — Figma is source of truth for values.
 */

import { traceTheme } from './themes/trace';
import { themeColorsToVarRefs, tokensToVarRefs } from './themes/css-vars';
import type { ThemeColors, ThemeTypography, ThemeBorderRadius, ThemeElevation, ThemeSpacing } from './themes/theme-interface';

// =============================================================================
// COLOR TOKENS — CSS-variable-backed, auto-themed via SwitchableThemeProvider
// =============================================================================

const _themed = themeColorsToVarRefs(traceTheme.colors as Record<string, any>) as unknown as ThemeColors;

export const colors = {
  ..._themed,

  brand: {
    ..._themed.brand,
    /** @deprecated Use brand.default */
    primary: _themed.brand.default,
    /** @deprecated Use brand.lighter */
    primaryLight: _themed.brand.lighter,
    /** @deprecated Use brand.darker */
    primaryDark: _themed.brand.darker,
  },

  surface: {
    ..._themed.surface,
    /** @deprecated Use surface.light */
    default: _themed.surface.light,
    /** @deprecated Use surface.lightDarker */
    paper: _themed.surface.lightDarker,
    /** @deprecated Use surface.lightDarker */
    elevated: _themed.surface.lightDarker,
    /** @deprecated Use surface.darkDarker */
    darkest: _themed.surface.darkDarker,
  },

  /** @deprecated Use brand.default */
  kelp: _themed.brand.default,
  /** @deprecated Use scrim */
  overlay: _themed.scrim,
  stroke: {
    /** @deprecated Use border.lowEmphasis.onLight */
    light: _themed.border.lowEmphasis.onLight,
    /** @deprecated Use border.midEmphasis.onLight */
    default: _themed.border.midEmphasis.onLight,
    /** @deprecated Use border.highEmphasis.onLight */
    dark: _themed.border.highEmphasis.onLight,
  },
  disabled: {
    /** @deprecated Use surface.disabled.onLight */
    surface: _themed.surface.disabled.onLight,
    /** @deprecated Use text.disabled.onLight */
    text: _themed.text.disabled.onLight,
    /** @deprecated Use surface.disabled.onDark */
    surfaceOnDark: _themed.surface.disabled.onDark,
    /** @deprecated Use text.disabled.onDark */
    textOnDark: _themed.text.disabled.onDark,
  },
  interactive: {
    /** @deprecated Use selectedHighlight + focusBorder */
    selectedInput: {
      background: _themed.selectedHighlight,
      border: _themed.brand.default,
    },
    selectedOutput: {
      background: _themed.brand.default,
      text: _themed.text.highEmphasis.onDark,
    },
    /** @deprecated Use focusBorder.onLight */
    focus: _themed.focusBorder.onLight,
  },
};

// =============================================================================
// DATA VISUALIZATION TOKENS — CSS-variable-backed, auto-themed
// =============================================================================

const _themedDataViz = tokensToVarRefs(
  traceTheme.colors.dataViz as unknown as Record<string, any>,
  '--prism-dataviz',
) as unknown as Record<string, string>;

/**
 * Data visualization color palette — 15 sequential series colors + border.
 * Theme-responsive via CSS variables. Use for charts, graphs, and data displays.
 *
 * Usage:
 *   dataVizColors.border   — axis lines, tick marks
 *   dataVizColors['01']    — primary series (darkest)
 *   dataVizColors['02']    — secondary series
 *   ...through ['15']      — 15th series (lightest/warmest)
 */
export const dataVizColors = _themedDataViz as {
  border: string;
  '01': string;
  '02': string;
  '03': string;
  '04': string;
  '05': string;
  '06': string;
  '07': string;
  '08': string;
  '09': string;
  '10': string;
  '11': string;
  '12': string;
  '13': string;
  '14': string;
  '15': string;
};

// =============================================================================
// TYPOGRAPHY TOKENS — CSS-variable-backed, auto-themed via SwitchableThemeProvider
// =============================================================================

const _themedTypo = tokensToVarRefs(traceTheme.typography as unknown as Record<string, any>, '--prism-typo') as unknown as ThemeTypography;

export const fontFamilies = {
  display: _themedTypo.fontFamilies.display,
  body: _themedTypo.fontFamilies.body,
  mono: _themedTypo.fontFamilies.mono,
} as const;

export const fontWeights = {
  regular: _themedTypo.fontWeights.regular,
  medium: _themedTypo.fontWeights.medium,
  semibold: _themedTypo.fontWeights.semibold,
  bold: _themedTypo.fontWeights.bold,
} as const;

export const typography = {
  // Display styles - for large headlines and hero text
  display: {
    '2xl': {
      fontFamily: fontFamilies.display,
      fontSize: '64px',
      fontWeight: fontWeights.semibold,
      lineHeight: '76px',
      letterSpacing: '-1.5px',
    },
    xl: {
      fontFamily: fontFamilies.display,
      fontSize: '51px',
      fontWeight: fontWeights.semibold,
      lineHeight: '60px',
      letterSpacing: '-0.8px',
    },
    lg: {
      fontFamily: fontFamilies.display,
      fontSize: '41px',
      fontWeight: fontWeights.semibold,
      lineHeight: '48px',
      letterSpacing: '-0.25px',
    },
    md: {
      fontFamily: fontFamilies.display,
      fontSize: '32px',
      fontWeight: fontWeights.semibold,
      lineHeight: '40px',
      letterSpacing: '-0.7px',
    },
    sm: {
      fontFamily: fontFamilies.display,
      fontSize: '26px',
      fontWeight: fontWeights.semibold,
      lineHeight: '32px',
      letterSpacing: '-0.5px',
    },
    xs: {
      fontFamily: fontFamilies.display,
      fontSize: '23px',
      fontWeight: fontWeights.semibold,
      lineHeight: '28px',
      letterSpacing: '-0.3px',
    },
  },

  // Heading styles
  heading: {
    h1: {
      fontFamily: fontFamilies.display,
      fontSize: '32px',
      fontWeight: fontWeights.semibold,
      lineHeight: '40px',
      letterSpacing: '-0.5px',
    },
    h2: {
      fontFamily: fontFamilies.display,
      fontSize: '28px',
      fontWeight: fontWeights.semibold,
      lineHeight: '36px',
      letterSpacing: '-0.3px',
    },
    h3: {
      fontFamily: fontFamilies.display,
      fontSize: '24px',
      fontWeight: fontWeights.semibold,
      lineHeight: '32px',
      letterSpacing: '-0.2px',
    },
    h4: {
      fontFamily: fontFamilies.display,
      fontSize: '20px',
      fontWeight: fontWeights.semibold,
      lineHeight: '28px',
      letterSpacing: '-0.1px',
    },
    h5: {
      fontFamily: fontFamilies.display,
      fontSize: '18px',
      fontWeight: fontWeights.semibold,
      lineHeight: '24px',
      letterSpacing: '0px',
    },
    h6: {
      fontFamily: fontFamilies.display,
      fontSize: '16px',
      fontWeight: fontWeights.semibold,
      lineHeight: '24px',
      letterSpacing: '0px',
    },
  },

  // Body text styles
  body: {
    xl: {
      fontFamily: fontFamilies.body,
      fontSize: '20px',
      fontWeight: fontWeights.regular,
      lineHeight: '30px',
      letterSpacing: '0px',
    },
    lg: {
      fontFamily: fontFamilies.body,
      fontSize: '18px',
      fontWeight: fontWeights.regular,
      lineHeight: '28px',
      letterSpacing: '0px',
    },
    md: {
      fontFamily: fontFamilies.body,
      fontSize: '16px',
      fontWeight: fontWeights.regular,
      lineHeight: '24px',
      letterSpacing: '0px',
    },
    sm: {
      fontFamily: fontFamilies.body,
      fontSize: '14px',
      fontWeight: fontWeights.regular,
      lineHeight: '20px',
      letterSpacing: '0px',
    },
    xs: {
      fontFamily: fontFamilies.body,
      fontSize: '12px',
      fontWeight: fontWeights.regular,
      lineHeight: '16px',
      letterSpacing: '0.1px',
    },
  },

  // Label/UI styles
  label: {
    lg: {
      fontFamily: fontFamilies.body,
      fontSize: '16px',
      fontWeight: fontWeights.medium,
      lineHeight: '24px',
      letterSpacing: '0.1px',
    },
    md: {
      fontFamily: fontFamilies.body,
      fontSize: '14px',
      fontWeight: fontWeights.medium,
      lineHeight: '20px',
      letterSpacing: '0.1px',
    },
    sm: {
      fontFamily: fontFamilies.body,
      fontSize: '12px',
      fontWeight: fontWeights.medium,
      lineHeight: '16px',
      letterSpacing: '0.2px',
    },
  },

  // Code/Mono styles
  code: {
    lg: {
      fontFamily: fontFamilies.mono,
      fontSize: '16px',
      fontWeight: fontWeights.regular,
      lineHeight: '24px',
      letterSpacing: '0px',
    },
    md: {
      fontFamily: fontFamilies.mono,
      fontSize: '14px',
      fontWeight: fontWeights.regular,
      lineHeight: '20px',
      letterSpacing: '0px',
    },
    sm: {
      fontFamily: fontFamilies.mono,
      fontSize: '12px',
      fontWeight: fontWeights.regular,
      lineHeight: '16px',
      letterSpacing: '0px',
    },
  },
} as const;

// =============================================================================
// SPACING TOKENS
// =============================================================================

export const spacing = {
  none: '0px',
  '2xs': '4px',
  xs: '8px',
  sm: '12px',
  md: '16px',
  lg: '20px',
  xl: '24px',
  '2xl': '32px',
  '3xl': '40px',
  '4xl': '48px',
  '5xl': '64px',
  '6xl': '96px',
} as const;

// Component-specific themed spacing — CSS-variable-backed
const _themedSpacing = tokensToVarRefs(traceTheme.spacing as unknown as Record<string, any>, '--prism-space') as unknown as ThemeSpacing;

export const spacingTokens = {
  inputPadding: _themedSpacing.inputPadding,
  buttonPadding: _themedSpacing.buttonPadding,
  cardPadding: _themedSpacing.cardPadding,
  sectionGap: _themedSpacing.sectionGap,
  componentGap: _themedSpacing.componentGap,
  sectionPadding: spacing['4xl'],
  pagePadding: spacing['5xl'],
  gutter: _themedSpacing.componentGap,
  containerPadding: spacing.xl,
} as const;

/** @deprecated Use `spacing` directly — kept for backward compatibility */
export const spacingSemantics = spacingTokens;

// =============================================================================
// BORDER RADIUS TOKENS — CSS-variable-backed, auto-themed
// =============================================================================

const _themedRadius = tokensToVarRefs(traceTheme.borderRadius as unknown as Record<string, any>, '--prism-radius') as unknown as ThemeBorderRadius;

export const borderRadius = {
  none: _themedRadius.none,
  xs: _themedRadius.xs,
  sm: _themedRadius.sm,
  md: _themedRadius.md,
  lg: _themedRadius.lg,
  xl: _themedRadius.xl,
  '2xl': _themedRadius['2xl'],
  '3xl': _themedRadius['3xl'],
  full: _themedRadius.full,
} as const;

// Semantic radius aliases — reference per-theme componentRadius CSS vars.
// These cascade from the theme's base via buildComponentRadius(), with per-theme
// overrides. Changing the base updates every component radius automatically.
export const borderRadiusSemantics = {
  button: 'var(--prism-comp-radius-button)',
  input:  'var(--prism-comp-radius-input)',
  card:   'var(--prism-comp-radius-card)',
  modal:  'var(--prism-comp-radius-modal)',
  badge:  'var(--prism-comp-radius-badge)',
  chip:   'var(--prism-comp-radius-chip)',
  avatar: 'var(--prism-comp-radius-avatar)',
} as const;

// =============================================================================
// TYPOGRAPHY SCALE (computed from themed font families & weights)
// =============================================================================
// NOTE: The typography composite object references fontFamilies.* and fontWeights.*
// which are now CSS var strings. This means all computed typography styles
// auto-update when the theme changes — no component code changes needed.

// =============================================================================
// SHADOW TOKENS — CSS-variable-backed, auto-themed
// =============================================================================

const _themedElevation = tokensToVarRefs(traceTheme.elevation as unknown as Record<string, any>, '--prism-elevation') as unknown as ThemeElevation;

export const shadows = {
  none: _themedElevation.none,
  xs: _themedElevation.xs,
  sm: _themedElevation.sm,
  md: _themedElevation.md,
  lg: _themedElevation.lg,
  xl: _themedElevation.xl,
  '2xl': _themedElevation['2xl'],
  inner: _themedElevation.inner,
  brand: _themedElevation.brand,
  brandLg: _themedElevation.brandLg,
} as const;

// Semantic shadow aliases — reference themed elevation vars
export const shadowSemantics = {
  card: shadows.sm,
  cardHover: shadows.md,
  dropdown: shadows.lg,
  modal: shadows.xl,
  button: shadows.xs,
  buttonHover: shadows.sm,
  input: shadows.none,
  inputFocus: `0px 0px 0px 3px ${colors.selectedHighlight}`,
  brand: shadows.brand,
  brandLg: shadows.brandLg,
} as const;

// =============================================================================
// BREAKPOINT TOKENS
// =============================================================================

export const breakpoints = {
  xs: '320px',
  sm: '640px',
  md: '768px',
  lg: '1024px',
  xl: '1280px',
  '2xl': '1536px',
} as const;

// Media query helpers
export const mediaQueries = {
  xs: `@media (min-width: ${breakpoints.xs})`,
  sm: `@media (min-width: ${breakpoints.sm})`,
  md: `@media (min-width: ${breakpoints.md})`,
  lg: `@media (min-width: ${breakpoints.lg})`,
  xl: `@media (min-width: ${breakpoints.xl})`,
  '2xl': `@media (min-width: ${breakpoints['2xl']})`,
  
  // Max-width queries
  xsMax: `@media (max-width: ${parseInt(breakpoints.sm) - 1}px)`,
  smMax: `@media (max-width: ${parseInt(breakpoints.md) - 1}px)`,
  mdMax: `@media (max-width: ${parseInt(breakpoints.lg) - 1}px)`,
  lgMax: `@media (max-width: ${parseInt(breakpoints.xl) - 1}px)`,
  xlMax: `@media (max-width: ${parseInt(breakpoints['2xl']) - 1}px)`,
  
  // Device-specific
  mobile: `@media (max-width: ${parseInt(breakpoints.md) - 1}px)`,
  tablet: `@media (min-width: ${breakpoints.md}) and (max-width: ${parseInt(breakpoints.lg) - 1}px)`,
  desktop: `@media (min-width: ${breakpoints.lg})`,
  
  // Feature queries
  hover: '@media (hover: hover)',
  reducedMotion: '@media (prefers-reduced-motion: reduce)',
  dark: '@media (prefers-color-scheme: dark)',
} as const;

// =============================================================================
// Z-INDEX TOKENS
// =============================================================================

export const zIndex = {
  hide: -1,
  base: 0,
  dropdown: 100,
  sticky: 200,
  header: 300,
  overlay: 400,
  modal: 500,
  popover: 600,
  tooltip: 700,
  toast: 800,
  max: 9999,
} as const;

// =============================================================================
// TRANSITION TOKENS
// =============================================================================

export const transitions = {
  duration: {
    instant: '0ms',
    fast: '100ms',
    normal: '200ms',
    slow: '300ms',
    slower: '500ms',
  },
  timing: {
    linear: 'linear',
    ease: 'ease',
    easeIn: 'ease-in',
    easeOut: 'ease-out',
    easeInOut: 'ease-in-out',
    spring: 'cubic-bezier(0.68, -0.55, 0.265, 1.55)',
  },
} as const;

// Common transition presets
export const transitionPresets = {
  default: `${transitions.duration.normal} ${transitions.timing.easeOut}`,
  fast: `${transitions.duration.fast} ${transitions.timing.easeOut}`,
  slow: `${transitions.duration.slow} ${transitions.timing.easeInOut}`,
  spring: `${transitions.duration.slow} ${transitions.timing.spring}`,
} as const;

// =============================================================================
// COMPONENT TOKENS (Prism System Tokens)
// =============================================================================

export const prismComponents = {
  // Typography component tokens
  text: {
    display: {
      xl: 'prism_sys_text_display_xl',
      lg: 'prism_sys_text_display_lg',
      md: 'prism_sys_text_display_md',
      sm: 'prism_sys_text_display_sm',
      xs: 'prism_sys_text_display_xs',
      xlOnDark: 'prism_sys_text_display_xl_onDark',
      lgOnDark: 'prism_sys_text_display_lg_onDark',
      mdOnDark: 'prism_sys_text_display_md_onDark',
      smOnDark: 'prism_sys_text_display_sm_onDark',
      xsOnDark: 'prism_sys_text_display_xs_onDark',
    },
    heading: {
      h1: 'prism_sys_text_heading_h1',
      h2: 'prism_sys_text_heading_h2',
      h3: 'prism_sys_text_heading_h3',
      h4: 'prism_sys_text_heading_h4',
      h5: 'prism_sys_text_heading_h5',
      h6: 'prism_sys_text_heading_h6',
    },
    body: {
      xl: 'prism_sys_text_body_xl',
      lg: 'prism_sys_text_body_lg',
      md: 'prism_sys_text_body_md',
      sm: 'prism_sys_text_body_sm',
      xs: 'prism_sys_text_body_xs',
    },
    label: {
      lg: 'prism_sys_text_label_lg',
      md: 'prism_sys_text_label_md',
      sm: 'prism_sys_text_label_sm',
    },
  },
  
  // Color component tokens
  color: {
    brand: 'prism_sys_color_brand',
    brandLight: 'prism_sys_color_brand_light',
    brandDark: 'prism_sys_color_brand_dark',
    surface: 'prism_sys_color_surface',
    surfaceElevated: 'prism_sys_color_surface_elevated',
    textPrimary: 'prism_sys_color_text_primary',
    textSecondary: 'prism_sys_color_text_secondary',
    textDisabled: 'prism_sys_color_text_disabled',
  },
} as const;

// =============================================================================
// AVATAR TOKENS
// =============================================================================

export const avatar = {
  // Avatar sizes (diameter in px)
  sizes: {
    xl: '96px',
    lg: '72px',
    md: '40px',
    sm: '32px',
    xs: '24px',
  },

  // Typography per size
  typography: {
    xl: {
      fontSize: '36px',
      fontWeight: 600,
      lineHeight: 1,
    },
    lg: {
      fontSize: '28px',
      fontWeight: 600,
      lineHeight: 1,
    },
    md: {
      fontSize: '16px',
      fontWeight: 600,
      lineHeight: 1,
    },
    sm: {
      fontSize: '14px',
      fontWeight: 600,
      lineHeight: 1,
    },
    xs: {
      fontSize: '11px',
      fontWeight: 600,
      lineHeight: 1,
    },
  },

  // Border radius per size
  borderRadius: {
    xl: '24px',
    lg: '18px',
    md: '10px',
    sm: '8px',
    xs: '6px',
  },

  // Background colors for initials (8 colors) - Updated from Figma 2026-01-29
  colors: {
    1: '#D6EAFF',  // Blue
    2: '#FFDBFA',  // Pink
    3: '#EFE0FF',  // Purple
    4: '#CFEFC2',  // Green
    5: '#BEF4ED',  // Teal
    6: '#FFE68F',  // Yellow
    7: '#FFE3DB',  // Peach
    8: '#FFE2C2',  // Orange
  },

  // Focus ring
  focus: {
    color: '#3086BF',
    width: '3px',
    offset: '4px',
  },

  // Border
  border: {
    width: '2px',
    color: '#FFFFFF',
  },

  // Group settings
  group: {
    overlapRatio: 0.3,
    borderWidth: '2px',
    borderColor: '#FFFFFF',
    maxVisible: 4,
  },
} as const;

// =============================================================================
// BUTTON TOKENS
// =============================================================================

export const button = {
  // Button sizes (from Figma)
  sizes: {
    lg: {
      height: '48px',
      minWidth: '100px',
      paddingX: '16px',
      paddingY: '12px',
      iconSize: '24px',
      gap: '4px',
    },
    md: {
      height: '36px',
      minWidth: '80px',
      paddingX: '12px',
      paddingY: '8px',
      iconSize: '20px',
      gap: '4px',
    },
  },

  // Icon-only button sizes (from Figma)
  iconOnlySizes: {
    lg: {
      size: '40px',
      iconSize: '24px',
    },
    md: {
      size: '32px',
      iconSize: '20px',
    },
  },

  // Typography per size (from Figma - DM Sans Semibold)
  typography: {
    lg: {
      fontSize: '16px',
      fontWeight: 600,
      lineHeight: '18px',
      letterSpacing: '-0.9px',
    },
    md: {
      fontSize: '14px',
      fontWeight: 600,
      lineHeight: '16px',
      letterSpacing: '-0.9px',
    },
  },

  // Colors per emphasis level - LIGHT MODE (from Trace Design System v2.0)
  // High emphasis uses brand colors for consistency
  emphasis: {
    high: {
      enabled: {
        background: colors.brand.default,
        text: colors.text.highEmphasis.onDark,
        border: 'transparent',
      },
      hover: {
        background: colors.brand.lighter,
        text: colors.text.highEmphasis.onDark,
        border: 'transparent',
      },
      pressed: {
        background: colors.brand.darker,
        text: colors.text.highEmphasis.onDark,
        border: 'transparent',
      },
      disabled: {
        background: colors.surface.disabled.onLight,
        text: colors.text.disabled.onLight,
        border: 'transparent',
      },
    },
    mid: {
      // Mid emphasis - FILLED with secondary color
      enabled: {
        background: colors.selectedHighlight,
        text: colors.brand.default,
        border: 'transparent',
      },
      hover: {
        background: colors.selectedHighlight_hover,
        text: colors.brand.default,
        border: 'transparent',
      },
      pressed: {
        background: colors.selectedHighlight, // No specific pressed token for highlight, reusing or could calculate
        text: colors.brand.darker,
        border: 'transparent',
      },
      disabled: {
        background: colors.surface.disabled.onLight,
        text: colors.text.disabled.onLight,
        border: 'transparent',
      },
    },
    low: {
      // Low emphasis is text-only (no background)
      enabled: {
        background: 'transparent',
        text: colors.brand.default,
        border: 'transparent',
      },
      hover: {
        background: colors.hover.onLight,
        text: colors.brand.default,
        border: 'transparent',
      },
      pressed: {
        background: colors.selected.onLight,
        text: colors.brand.darker,
        border: 'transparent',
      },
      disabled: {
        background: 'transparent',
        text: colors.text.disabled.onLight,
        border: 'transparent',
      },
    },
  },

  // Colors per emphasis level - DARK MODE (onDark surfaces)
  emphasisOnDark: {
    high: {
      enabled: {
        background: colors.text.highEmphasis.onDark,
        text: colors.brand.default,
        border: 'transparent',
      },
      hover: {
        background: 'rgba(255, 255, 255, 0.9)', // Keep as is or find token?
        text: colors.brand.default,
        border: 'transparent',
      },
      pressed: {
        background: 'rgba(255, 255, 255, 0.8)',
        text: colors.brand.default,
        border: 'transparent',
      },
      disabled: {
        background: colors.surface.disabled.onDark,
        text: colors.text.disabled.onDark,
        border: 'transparent',
      },
    },
    mid: {
      // Mid emphasis on dark - FILLED with secondary color
      enabled: {
        background: colors.selectedHighlight, // Might need onDark variant if different
        text: colors.brand.default,
        border: 'transparent',
      },
      hover: {
        background: colors.selectedHighlight_hover,
        text: colors.brand.default,
        border: 'transparent',
      },
      pressed: {
        background: colors.selectedHighlight,
        text: colors.brand.default,
        border: 'transparent',
      },
      disabled: {
        background: colors.surface.disabled.onDark,
        text: colors.text.disabled.onDark,
        border: 'transparent',
      },
    },
    low: {
      // Low emphasis on dark - text-only with white text
      enabled: {
        background: 'transparent',
        text: colors.text.highEmphasis.onDark,
        border: 'transparent',
      },
      hover: {
        background: colors.hover.onDark,
        text: colors.text.highEmphasis.onDark,
        border: 'transparent',
      },
      pressed: {
        background: 'rgba(255, 255, 255, 0.24)', // No token?
        text: colors.text.highEmphasis.onDark,
        border: 'transparent',
      },
      disabled: {
        background: 'transparent',
        text: colors.text.disabled.onDark,
        border: 'transparent',
      },
    },
  },

  // Destructive button colors (from Figma)
  destructive: {
    high: {
      enabled: {
        background: '#C10B1E',
        text: '#FFFFFF',
        border: 'transparent',
      },
      hover: {
        background: '#A50A1A',
        text: '#FFFFFF',
        border: 'transparent',
      },
      pressed: {
        background: '#8A0816',
        text: '#FFFFFF',
        border: 'transparent',
      },
      disabled: {
        background: '#E0E0E0',
        text: 'rgba(0, 0, 0, 0.38)',
        border: 'transparent',
      },
    },
    mid: {
      enabled: {
        background: 'transparent',
        text: '#C10B1E',
        border: '#C10B1E',
      },
      hover: {
        background: 'rgba(193, 11, 30, 0.08)',
        text: '#C10B1E',
        border: '#C10B1E',
      },
      pressed: {
        background: 'rgba(193, 11, 30, 0.16)',
        text: '#C10B1E',
        border: '#C10B1E',
      },
      disabled: {
        background: 'transparent',
        text: 'rgba(0, 0, 0, 0.38)',
        border: 'rgba(0, 0, 0, 0.12)',
      },
    },
  },

  // Focus ring (from Figma)
  focus: {
    color: '#3086BF',
    width: '3px',
    offset: '5px',
  },

  // Border radius — per-theme via componentRadius.button CSS var
  borderRadius: 'var(--prism-comp-radius-button)',

  // Transition
  transition: '200ms ease-out',

  // Button group spacing (from Figma)
  group: {
    gap: {
      default: '8px',
      form: '16px',
      formMobile: '16px',
      inline: '8px',
    },
    marginBottom: {
      default: '32px',
      form: '32px',
      formMobile: '16px',
      inline: '0px',
    },
  },
} as const;

// =============================================================================
// TAB TOKENS
// =============================================================================

export const tab = {
  // Tab typography (from Figma - DM Sans SemiBold)
  typography: {
    fontFamily: fontFamilies.display,
    fontSize: '14px',
    fontWeight: fontWeights.semibold,
    lineHeight: '16px',
    letterSpacing: '-0.6px',
  },

  // Tab sizes
  sizes: {
    none: {
      height: '48px',
      paddingX: '16px',
      paddingY: '14px',
      iconSize: '20px',
      gap: '8px',
    },
    top: {
      height: '62px',
      paddingX: '16px',
      paddingY: '8px',
      iconSize: '24px',
      gap: '4px',
    },
    leading: {
      height: '48px',
      paddingX: '16px',
      paddingY: '14px',
      iconSize: '20px',
      gap: '8px',
    },
  },

  // Tab colors - Light mode
  colors: {
    light: {
      active: {
        text: colors.brand.default,
        background: 'transparent',
        indicator: colors.brand.default,
      },
      inactive: {
        text: 'rgba(0, 0, 0, 0.60)',
        background: 'transparent',
        indicator: 'transparent',
      },
      hover: {
        text: 'rgba(0, 0, 0, 0.80)',
        background: 'rgba(0, 0, 0, 0.04)',
        indicator: 'transparent',
      },
      disabled: {
        text: 'rgba(0, 0, 0, 0.38)',
        background: 'transparent',
        indicator: 'transparent',
      },
    },
    // Dark mode (onDark surfaces)
    dark: {
      active: {
        text: '#FFFFFF',
        background: 'transparent',
        indicator: colors.brand.lighter,
      },
      inactive: {
        text: 'rgba(255, 255, 255, 0.60)',
        background: 'transparent',
        indicator: 'transparent',
      },
      hover: {
        text: 'rgba(255, 255, 255, 0.80)',
        background: 'rgba(255, 255, 255, 0.08)',
        indicator: 'transparent',
      },
      disabled: {
        text: 'rgba(255, 255, 255, 0.38)',
        background: 'transparent',
        indicator: 'transparent',
      },
    },
    // Inverted tabs
    inverted: {
      active: {
        text: colors.brand.default,
        background: '#FFFFFF',
        indicator: colors.brand.default,
      },
      inactive: {
        text: 'rgba(0, 0, 0, 0.60)',
        background: 'transparent',
        indicator: 'transparent',
      },
      hover: {
        text: 'rgba(0, 0, 0, 0.80)',
        background: 'rgba(255, 255, 255, 0.5)',
        indicator: 'transparent',
      },
    },
  },

  // Selected indicator (bottom bar)
  indicator: {
    height: '4px',
    borderRadius: '3px',
    paddingX: '4px',
  },

  // Border radius (top corners only)
  borderRadius: '6px',

  // Focus ring
  focus: {
    color: '#3086BF',
    width: '3px',
    offset: '0px',
    borderRadius: '4px',
  },

  // Badge
  badge: {
    minWidth: '20px',
    height: '20px',
    padding: '4px',
    borderRadius: '10px',
    background: '#FFFFFF',
    innerBackground: 'rgba(0, 0, 0, 0.65)',
    innerBorderRadius: '9px',
    typography: {
      fontSize: '12px',
      fontWeight: fontWeights.bold,
      lineHeight: '12px',
      letterSpacing: '-1px',
      color: '#FFFFFF',
    },
  },

  // Tab bar
  bar: {
    divider: {
      color: 'rgba(0, 0, 0, 0.12)',
      height: '1px',
    },
    scrollArrow: {
      size: '40px',
      iconSize: '24px',
      padding: '8px',
    },
  },

  // Transition
  transition: '200ms ease-out',
} as const;

// =============================================================================
// BANNER ICON TOKENS (Contextual Banner Icons from Figma)
// =============================================================================

export const bannerIcon = {
  // Size
  size: '24px',
  padding: '8px',
  borderRadius: borderRadius.xl,

  // Variants - Light mode
  variants: {
    information: {
      background: '#EBEFFF',
      icon: '#6E61FF',
    },
    success: {
      background: '#DEEDE9',
      icon: '#1B7F66',
    },
    warning: {
      background: '#F9ECDC',
      icon: '#D17600',
    },
    important: {
      background: '#FBE4E7',
      icon: '#DC0C22',
    },
  },

  // Variants - Dark mode (onDark)
  variantsOnDark: {
    information: {
      background: 'rgba(122, 145, 255, 0.25)',
      icon: '#7A91FF',
    },
    success: {
      background: 'rgba(0, 173, 130, 0.25)',
      icon: '#00AD82',
    },
    warning: {
      background: 'rgba(230, 130, 0, 0.25)',
      icon: '#E68200',
    },
    important: {
      background: 'rgba(248, 104, 118, 0.25)',
      icon: '#F86876',
    },
  },
} as const;

// =============================================================================
// BANNER TOKENS
// =============================================================================

export const banner = {
  // Banner sizes (from Figma)
  sizes: {
    md: {
      paddingX: '16px',
      paddingY: '12px',
      gap: '12px',
      iconSize: '20px',
    },
    lg: {
      paddingX: '20px',
      paddingY: '16px',
      gap: '16px',
      iconSize: '24px',
    },
  },

  // Typography per size (from Figma - DM Sans)
  typography: {
    md: {
      title: {
        fontSize: '14px',
        fontWeight: 500,
        lineHeight: '20px',
        letterSpacing: '0.1px',
      },
      description: {
        fontSize: '16px',
        fontWeight: 400,
        lineHeight: '24px',
        letterSpacing: '0.15px',
      },
    },
    lg: {
      title: {
        fontSize: '16px',
        fontWeight: 500,
        lineHeight: '24px',
        letterSpacing: '0.1px',
      },
      description: {
        fontSize: '16px',
        fontWeight: 400,
        lineHeight: '24px',
        letterSpacing: '0.15px',
      },
    },
  },

  // Colors per variant - Color surface (from Figma)
  variantsColor: {
    info: {
      surface: '#F4F6FF',
      divider: '#D1D9FF',
      iconBackground: '#EBEFFF',
      icon: '#6E61FF',
    },
    success: {
      surface: '#EDF6F4',
      divider: '#C5E2DB',
      iconBackground: '#DEEDE9',
      icon: '#1B7F66',
    },
    warning: {
      surface: '#FCF6ED',
      divider: '#F2DABA',
      iconBackground: '#F9ECDC',
      icon: '#D17600',
    },
    error: {
      surface: '#FDF2F3',
      divider: '#F8CFD3',
      iconBackground: '#FBE4E7',
      icon: '#DC0C22',
    },
  },

  // Colors per variant - Light surface (from Figma)
  variantsLight: {
    info: {
      surface: '#FFFFFF',
      divider: 'rgba(0, 0, 0, 0.15)',
      iconBackground: '#EBEFFF',
      icon: '#6E61FF',
    },
    success: {
      surface: '#FFFFFF',
      divider: 'rgba(0, 0, 0, 0.15)',
      iconBackground: '#DEEDE9',
      icon: '#1B7F66',
    },
    warning: {
      surface: '#FFFFFF',
      divider: 'rgba(0, 0, 0, 0.15)',
      iconBackground: '#F9ECDC',
      icon: '#D17600',
    },
    error: {
      surface: '#FFFFFF',
      divider: 'rgba(0, 0, 0, 0.15)',
      iconBackground: '#FBE4E7',
      icon: '#DC0C22',
    },
  },

  // Legacy colors per variant (for backwards compatibility)
  variants: {
    info: {
      background: '#E3F2FD',
      border: '#2196F3',
      icon: '#2196F3',
      title: '#1565C0',
      text: 'rgba(0, 0, 0, 0.95)',
    },
    success: {
      background: '#E8F5E9',
      border: '#4CAF50',
      icon: '#4CAF50',
      title: '#2E7D32',
      text: 'rgba(0, 0, 0, 0.95)',
    },
    warning: {
      background: '#FFF3E0',
      border: '#FF9800',
      icon: '#E65100',
      title: '#E65100',
      text: 'rgba(0, 0, 0, 0.95)',
    },
    error: {
      background: '#FFEBEE',
      border: '#F44336',
      icon: '#F44336',
      title: '#C62828',
      text: 'rgba(0, 0, 0, 0.95)',
    },
  },

  // Text colors
  text: {
    primary: 'rgba(0, 0, 0, 0.95)',
    action: '#0B1E19',
    // On dark background text colors
    primaryOnDark: 'rgba(255, 255, 255, 0.95)',
    actionOnDark: 'rgba(255, 255, 255, 0.87)',
  },

  // Spacing (from Figma)
  spacing: {
    titleMarginBottom: '4px',
    actionsMarginTop: '12px',
    actionGap: '8px',
    iconMarginTop: '2px',
    iconContainerPadding: '8px',
    contentPaddingLeft: '48px', // Icon container width (40px) + gap (8px)
  },

  // Border (from Figma)
  border: {
    width: '1px',
    radius: {
      inline: '16px',
      fullBleed: '0px',
    },
  },

  // Icon container (from Figma)
  iconContainer: {
    size: '40px',
    borderRadius: borderRadius.xl,
  },

  // Button styles (from Figma)
  button: {
    paddingX: '8px',
    paddingY: '6px',
    borderRadius: '50px',
    typography: {
      fontSize: '14px',
      fontWeight: 600,
      lineHeight: '16px',
      letterSpacing: '-0.35px',
    },
  },

  // Dismiss button (from Figma)
  dismiss: {
    iconSize: '16px',
    padding: '4px',
    borderRadius: '4px',
    opacity: {
      default: 0.8,
      hover: 1,
    },
    background: {
      default: 'transparent',
      hover: 'rgba(0, 0, 0, 0.08)',
    },
  },

  // Transition
  transition: '200ms ease-out',
} as const;

// =============================================================================
// SIDEBAR TOKENS (Pixel-perfect from Figma)
// =============================================================================

export const sidebar = {
  // Sidebar dimensions (from Figma)
  width: '278px',
  collapsedWidth: '73px',

  // Padding (from Figma)
  padding: {
    x: '16px',
    y: '20px',
  },

  // Logo section
  logo: {
    height: 'auto',
    gap: '12px',
  },

  // Navigation item (from Figma)
  navItem: {
    height: '36px',
    paddingX: '16px',
    paddingY: '6px',
    gap: '10px',
    borderRadius: borderRadius.sm,
    iconSize: '20px',
    typography: {
      fontSize: '14px',
      fontWeight: 400,
      lineHeight: '20px',
      letterSpacing: '-0.2px',
    },
    typographyActive: {
      fontSize: '14px',
      fontWeight: 600,
      lineHeight: '20px',
      letterSpacing: '-0.4px',
    },
  },

  // Section
  section: {
    marginTop: '16px',
    labelMarginBottom: '6px',
    labelTypography: {
      fontSize: '12px',
      fontWeight: 600,
      lineHeight: '16px',
      letterSpacing: '0.5px',
      textTransform: 'uppercase' as const,
    },
  },

  // Colors — static defaults (Trace light theme).
  // For theme-aware colors, use getSidebarColors(themeColors) instead.
  colors: {
    background: 'rgba(0, 0, 0, 0.05)',
    backgroundAlt: '#f3f4f5',
    border: 'rgba(0, 0, 0, 0.07)',
    item: {
      default: {
        background: 'transparent',
        text: 'rgba(0, 0, 0, 0.72)',
        icon: 'rgba(0, 0, 0, 0.72)',
      },
      hover: {
        background: 'rgba(0, 0, 0, 0.05)',
        text: 'rgba(0, 0, 0, 0.95)',
        icon: 'rgba(0, 0, 0, 0.95)',
      },
      active: {
        background: 'rgba(0, 0, 0, 0.1)',
        text: 'rgba(0, 0, 0, 0.95)',
        icon: 'rgba(0, 0, 0, 0.95)',
        indicator: colors.brand.default, // Left accent bar for active state
      },
    },
    // Updated for WCAG 1.4.3 contrast compliance (4.5:1 minimum)
    // Original: rgba(0, 0, 0, 0.50) = ~3.95:1, Updated: rgba(0, 0, 0, 0.65) = ~5.74:1
    sectionLabel: 'rgba(0, 0, 0, 0.65)',
    // Subtle hover for section headers / toggle buttons
    subtleHover: 'rgba(0, 0, 0, 0.02)',
    controlHover: 'rgba(0, 0, 0, 0.06)',
  },

  // Collapsed state icon button (from Figma)
  collapsedIconButton: {
    size: '48px',
    borderRadius: borderRadius.sm,
  },

  // Transition
  transition: '200ms ease-out',
} as const;

// =============================================================================
// THEME-AWARE SIDEBAR COLORS
// =============================================================================

/**
 * Derive sidebar colors from the active theme.
 *
 * Maps semantic theme tokens to sidebar-specific color slots so dark themes
 * (like RID-Dark) work automatically — no per-theme sidebar overrides needed.
 *
 * The key insight: dark themes map dark values INTO the `onLight` slots,
 * so using `onLight` tokens consistently handles both light and dark surfaces.
 */
export interface SidebarColors {
  background: string;
  backgroundAlt: string;
  border: string;
  item: {
    default: { background: string; text: string; icon: string };
    hover: { background: string; text: string; icon: string };
    active: { background: string; text: string; icon: string; indicator: string };
  };
  sectionLabel: string;
  subtleHover: string;
  controlHover: string;
}

export function getSidebarColors(tc: ThemeColors): SidebarColors {
  return {
    background: tc.hover.onLight,
    backgroundAlt: tc.surface.lightDarker,
    border: tc.border.lowEmphasis.onLight,
    item: {
      default: {
        background: 'transparent',
        text: tc.navItemText.enabled.onLight,
        icon: tc.navItemText.enabled.onLight,
      },
      hover: {
        background: tc.hover.onLight,
        text: tc.text.highEmphasis.onLight,
        icon: tc.text.highEmphasis.onLight,
      },
      active: {
        background: tc.selected.onLight,
        text: tc.text.highEmphasis.onLight,
        icon: tc.text.highEmphasis.onLight,
        indicator: tc.brand.default,
      },
    },
    sectionLabel: tc.text.lowEmphasis.onLight,
    subtleHover: tc.surface.disabled.onLight,
    controlHover: tc.hover.onLight,
  };
}

// =============================================================================
// HEADER TOKENS
// =============================================================================

export const header = {
  // Dimensions
  height: '64px',

  // Padding
  padding: {
    x: '24px',
    y: '12px',
  },

  // Search bar
  search: {
    width: '400px',
    height: '40px',
    paddingX: '16px',
    paddingY: '10px',
    borderRadius: '20px',
    iconSize: '20px',
    gap: '12px',
    typography: {
      fontSize: '14px',
      fontWeight: 400,
      lineHeight: '20px',
    },
    colors: {
      background: '#F5F5F5',
      backgroundFocus: '#FFFFFF',
      border: 'transparent',
      borderFocus: colors.brand.default,
      placeholder: 'rgba(0, 0, 0, 0.50)',
      text: 'rgba(0, 0, 0, 0.95)',
      icon: 'rgba(0, 0, 0, 0.50)',
    },
  },

  // Icon buttons
  iconButton: {
    size: '40px',
    iconSize: '24px',
    borderRadius: borderRadius.md,
    colors: {
      default: {
        background: 'transparent',
        icon: 'rgba(0, 0, 0, 0.70)',
      },
      hover: {
        background: 'rgba(0, 0, 0, 0.04)',
        icon: 'rgba(0, 0, 0, 0.95)',
      },
    },
  },

  // Organization dropdown
  orgDropdown: {
    height: '40px',
    paddingX: '12px',
    borderRadius: borderRadius.md,
    gap: '8px',
    typography: {
      name: {
        fontSize: '14px',
        fontWeight: 500,
        lineHeight: '20px',
      },
      label: {
        fontSize: '12px',
        fontWeight: 400,
        lineHeight: '16px',
      },
    },
  },

  // Colors
  colors: {
    background: '#FFFFFF',
    border: 'rgba(0, 0, 0, 0.08)',
  },

  // Transition
  transition: '200ms ease-out',
} as const;

// =============================================================================
// STATS CARD TOKENS
// =============================================================================

export const statsCard = {
  // Dimensions
  minWidth: '160px',
  height: '88px',

  // Padding
  padding: {
    x: '20px',
    y: '16px',
  },

  // Icon
  icon: {
    size: '48px',
    containerSize: '48px',
    borderRadius: borderRadius.lg,
    background: '#F5F5F5',
  },

  // Typography
  typography: {
    label: {
      fontSize: '14px',
      fontWeight: 400,
      lineHeight: '20px',
      color: 'rgba(0, 0, 0, 0.60)',
    },
    value: {
      fontSize: '28px',
      fontWeight: 600,
      lineHeight: '36px',
      color: 'rgba(0, 0, 0, 0.95)',
    },
  },

  // Spacing
  gap: '16px',
  contentGap: '4px',

  // Colors
  colors: {
    background: '#F5F5F5',
    border: 'rgba(0, 0, 0, 0.08)',
  },

  // Border
  borderRadius: borderRadius.lg,
} as const;

// =============================================================================
// PRODUCT CARD TOKENS
// =============================================================================

export const productCard = {
  // Dimensions
  width: '100%',
  minWidth: '280px',

  // Image area
  image: {
    height: '160px',
    background: '#F5F5F5',
    borderRadius: borderRadius.md,
    iconSize: '48px',
    iconColor: 'rgba(0, 0, 0, 0.20)',
  },

  // Content area
  content: {
    padding: '16px',
    gap: '8px',
  },

  // Typography
  typography: {
    brand: {
      fontSize: '12px',
      fontWeight: 500,
      lineHeight: '16px',
      color: 'rgba(0, 0, 0, 0.60)',
    },
    name: {
      fontSize: '16px',
      fontWeight: 600,
      lineHeight: '24px',
      color: 'rgba(0, 0, 0, 0.95)',
    },
    sku: {
      fontSize: '12px',
      fontWeight: 400,
      lineHeight: '16px',
      color: 'rgba(0, 0, 0, 0.50)',
    },
    marketLabel: {
      fontSize: '12px',
      fontWeight: 500,
      lineHeight: '16px',
      color: 'rgba(0, 0, 0, 0.60)',
    },
    marketCount: {
      fontSize: '12px',
      fontWeight: 400,
      lineHeight: '16px',
      color: 'rgba(0, 0, 0, 0.50)',
    },
  },

  // Gap badge
  gapBadge: {
    height: '24px',
    paddingX: '8px',
    borderRadius: '12px',
    background: 'rgba(0, 0, 0, 0.08)',
    typography: {
      fontSize: '12px',
      fontWeight: 500,
      lineHeight: '16px',
      color: 'rgba(0, 0, 0, 0.70)',
    },
  },

  // Tags
  tags: {
    gap: '8px',
    marginTop: '12px',
  },

  // Markets
  markets: {
    marginTop: '12px',
    gap: '8px',
    badge: {
      size: '28px',
      fontSize: '11px',
      fontWeight: 600,
      borderRadius: '4px',
      colors: {
        default: {
          background: '#F5F5F5',
          text: 'rgba(0, 0, 0, 0.70)',
        },
        highlighted: {
          background: '#78CFB8',
          text: '#0B1E19',
        },
      },
    },
  },

  // Border
  border: {
    width: '1px',
    color: 'rgba(0, 0, 0, 0.08)',
    radius: '12px',
  },

  // Hover state
  hover: {
    shadow: shadows.sm,
    borderColor: 'rgba(0, 0, 0, 0.12)',
  },

  // Transition
  transition: '200ms ease-out',
} as const;

// =============================================================================
// PAGINATION TOKENS
// =============================================================================

export const pagination = {
  // Container
  height: '40px',
  gap: '16px',

  // Typography
  typography: {
    text: {
      fontSize: '14px',
      fontWeight: 400,
      lineHeight: '20px',
      color: 'rgba(0, 0, 0, 0.70)',
    },
    pageInfo: {
      fontSize: '14px',
      fontWeight: 500,
      lineHeight: '20px',
      color: 'rgba(0, 0, 0, 0.95)',
    },
  },

  // Dropdown
  dropdown: {
    height: '32px',
    paddingX: '12px',
    borderRadius: '6px',
    gap: '8px',
    border: '1px solid rgba(0, 0, 0, 0.12)',
    background: '#FFFFFF',
  },

  // Navigation buttons
  navButton: {
    size: '32px',
    iconSize: '20px',
    borderRadius: '6px',
    colors: {
      default: {
        background: 'transparent',
        icon: 'rgba(0, 0, 0, 0.50)',
        border: 'rgba(0, 0, 0, 0.12)',
      },
      hover: {
        background: 'rgba(0, 0, 0, 0.04)',
        icon: 'rgba(0, 0, 0, 0.70)',
        border: 'rgba(0, 0, 0, 0.20)',
      },
      disabled: {
        background: 'transparent',
        icon: 'rgba(0, 0, 0, 0.20)',
        border: 'rgba(0, 0, 0, 0.08)',
      },
    },
  },

  // Transition
  transition: '200ms ease-out',
} as const;

// =============================================================================
// STEPPER TOKENS
// =============================================================================

export const stepper = {
  // Step indicator (circular button)
  step: {
    size: '32px',
    borderRadius: '50%',

    // Colors per state — uses themed brand color
    colors: {
      completed: {
        background: colors.brand.default,
        text: '#FFFFFF',
        border: 'transparent',
      },
      active: {
        background: colors.brand.default,
        text: '#FFFFFF',
        border: 'transparent',
      },
      pending: {
        background: '#FFFFFF',
        text: 'rgba(0, 0, 0, 0.60)',
        border: 'rgba(0, 0, 0, 0.15)',
      },
      disabled: {
        background: '#FFFFFF',
        text: 'rgba(0, 0, 0, 0.60)',
        border: 'rgba(0, 0, 0, 0.15)',
      },
    },

    // Typography for step number
    typography: {
      fontWeight: 600,
      fontSize: '14px',
      lineHeight: '18px',
      letterSpacing: '-0.55px',
    },
  },

  // Connector lines between steps
  connector: {
    width: '2px',

    colors: {
      completed: colors.brand.default,
      pending: 'rgba(0, 0, 0, 0.15)',
    },
  },

  // Step content area
  content: {
    paddingLeft: '16px',

    // Label typography
    label: {
      active: {
        fontSize: '16px',
        fontWeight: 400,
        lineHeight: '22px',
        letterSpacing: '-0.35px',
        color: 'rgba(0, 0, 0, 0.95)',
      },
      inactive: {
        fontSize: '16px',
        fontWeight: 400,
        lineHeight: '22px',
        letterSpacing: '-0.35px',
        color: 'rgba(0, 0, 0, 0.60)',
      },
    },

    // Metadata typography (optional subtitle)
    metadata: {
      fontSize: '14px',
      fontWeight: 400,
      lineHeight: '18px',
      letterSpacing: '-0.3px',
      color: 'rgba(0, 0, 0, 0.60)',
    },
  },

  // Spacing
  spacing: {
    labelPaddingY: '21px',
    contentGap: '16px',
    buttonGap: '16px',
  },

  // Focus ring
  focus: {
    color: '#3086BF',
    width: '3px',
    offset: '5px',
  },

  // Hover state
  hover: {
    background: 'rgba(18, 122, 86, 0.08)',
  },

  // Transition
  transition: '200ms ease-out',
} as const;


// =============================================================================
// ASSISTIVE MESSAGE TOKENS (from Figma node 2068-39659)
// =============================================================================

export const assistiveMessage = {
  typography: {
    fontFamily: fontFamilies.body,
    fontSize: '14px',
    fontWeight: 400,
    lineHeight: '18px',
    letterSpacing: '-0.3px',
  },

  iconSize: '16px',

  types: {
    assistive: {
      textColor: 'rgba(0, 0, 0, 0.60)',
      counterColor: 'rgba(0, 0, 0, 0.60)',
      iconColor: null as string | null,
      gap: '4px',
    },
    disabled: {
      textColor: 'rgba(0, 0, 0, 0.30)',
      counterColor: 'rgba(0, 0, 0, 0.30)',
      iconColor: null as string | null,
      gap: '4px',
    },
    error: {
      textColor: '#C10B1E',
      counterColor: 'rgba(0, 0, 0, 0.60)',
      iconColor: '#DC0C22',
      gap: '2px',
    },
    errorOverflow: {
      textColor: '#C10B1E',
      counterColor: '#C10B1E',
      iconColor: '#DC0C22',
      gap: '4px',
    },
    warning: {
      textColor: '#A35C00',
      counterColor: 'rgba(0, 0, 0, 0.60)',
      iconColor: '#D17600',
      gap: '4px',
    },
    success: {
      textColor: '#006B50',
      counterColor: 'rgba(0, 0, 0, 0.60)',
      iconColor: '#1B7F66',
      gap: '4px',
    },
    info: {
      textColor: 'rgba(0, 0, 0, 0.95)',
      counterColor: 'rgba(0, 0, 0, 0.60)',
      iconColor: '#6E61FF',
      gap: '4px',
    },
  },
} as const;

// =============================================================================
// THEME EXPORT
// =============================================================================

export const theme = {
  colors,
  typography,
  fontFamilies,
  fontWeights,
  spacing,
  spacingSemantics,
  borderRadius,
  borderRadiusSemantics,
  shadows,
  shadowSemantics,
  breakpoints,
  mediaQueries,
  zIndex,
  transitions,
  transitionPresets,
  prismComponents,
  avatar,
  button,
  tab,
  bannerIcon,
  banner,
  sidebar,
  header,
  statsCard,
  productCard,
  pagination,
  stepper,
  assistiveMessage,
} as const;

export type Theme = typeof theme;
export type Colors = typeof colors;
export type Typography = typeof typography;
export type Spacing = typeof spacing;
export type BorderRadius = typeof borderRadius;
export type Shadows = typeof shadows;
export type Breakpoints = typeof breakpoints;

export default theme;
