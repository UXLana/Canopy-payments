/**
 * Trace Product Theme
 * Source: Trace Design System v2.0 (Figma)
 * https://www.figma.com/design/gc68toINDS8Ovsan5aVPS2/Trace-Design-System-v2.0--wip-
 *
 * Extracted from node 2086-41222 (Color & styles) on 2026-02-10
 * Values match Figma prism_sys_color_* variables exactly.
 */

import type { ProductTheme } from './theme-interface';
import { buildBorderRadius, buildComponentRadius } from './theme-interface';

export const traceTheme: ProductTheme = {
  name: 'trace',
  colors: {
    brand: {
      default: '#005151',
      darker: '#003133',
      lighter: '#17978E',
    },

    accent: {
      default: '#0176B2',
      darker: '#005C89',
      lighter: '#3A9DD4',
    },

    surface: {
      light: '#FFFFFF',
      lightDarker: '#F5F5F5',
      dark: '#4A4A4A',
      darkDarker: '#323232',
      disabled: {
        onLight: 'rgba(0, 0, 0, 0.03)',
        onDark: 'rgba(255, 255, 255, 0.20)',
      },
      info: '#F4F6FF',
      success: '#EDF6F4',
      warning: '#FCF6ED',
      important: '#FDF2F3',
    },

    surfaceBorder: {
      info: '#D1D9FF',
      success: '#C5E2DB',
      warning: '#F2DABA',
      important: '#F8CFD3',
    },

    text: {
      highEmphasis: {
        onLight: 'rgba(0, 0, 0, 0.95)',
        onDark: '#FFFFFF',
      },
      lowEmphasis: {
        onLight: 'rgba(0, 0, 0, 0.60)',
        onDark: 'rgba(255, 255, 255, 0.70)',
      },
      disabled: {
        onLight: 'rgba(0, 0, 0, 0.30)',
        onDark: 'rgba(255, 255, 255, 0.30)',
      },
      action: {
        enabled: '#016CA2',
        hover: '#005680',
        active: '#00476B',
      },
      success: '#006B50',
      warning: '#A35C00',
      important: '#C10B1E',
    },

    border: {
      lowEmphasis: {
        onLight: 'rgba(0, 0, 0, 0.10)',
        onDark: 'rgba(255, 255, 255, 0.10)',
        hover: {
          onLight: 'rgba(0, 0, 0, 0.27)',
          onDark: 'rgba(255, 255, 255, 0.27)',
        },
      },
      midEmphasis: {
        onLight: 'rgba(0, 0, 0, 0.15)',
        onDark: 'rgba(255, 255, 255, 0.15)',
      },
      highEmphasis: {
        onLight: 'rgba(0, 0, 0, 0.42)',
        onDark: 'rgba(255, 255, 255, 0.43)',
      },
    },

    icon: {
      enabled: {
        onLight: 'rgba(0, 0, 0, 0.55)',
        onDark: 'rgba(255, 255, 255, 0.94)',
      },
      hover: {
        onLight: 'rgba(0, 0, 0, 0.65)',
      },
      active: {
        onLight: 'rgba(0, 0, 0, 0.75)',
      },
      selected: {
        onLight: 'rgba(0, 0, 0, 0.85)',
      },
      disabled: {
        onLight: 'rgba(0, 0, 0, 0.20)',
        onDark: 'rgba(255, 255, 255, 0.20)',
      },
      lowEmphasis: {
        enabled: {
          onLight: 'rgba(0, 0, 0, 0.43)',
          onDark: 'rgba(255, 255, 255, 0.65)',
        },
      },
    },

    iconBg: {
      info: '#EBEFFF',
      info_onDark: 'rgba(122, 145, 255, 0.25)',
      success: '#DEEDE9',
      success_onDark: 'rgba(0, 173, 130, 0.25)',
      warning: '#F9ECDC',
      warning_onDark: 'rgba(230, 130, 0, 0.25)',
      important: '#FBE4E7',
      important_onDark: 'rgba(248, 104, 118, 0.25)',
    },

    action: {
      enabled: '#0176B2',
      hover: '#005C89',
      active: '#004E73',
      important: {
        enabled: '#C10B1E',
        hover: '#A20919',
        active: '#850715',
      },
      monochrome: {
        onLight: {
          enabled: 'rgba(0, 0, 0, 0.55)',
          hover: 'rgba(0, 0, 0, 0.65)',
          active: 'rgba(0, 0, 0, 0.75)',
          selected: 'rgba(0, 0, 0, 0.85)',
          disabled: 'rgba(0, 0, 0, 0.20)',
          bg: 'rgba(0, 0, 0, 0.08)',
          lowEmphasis: {
            enabled: 'rgba(0, 0, 0, 0.43)',
          },
        },
        onDark: {
          enabled: 'rgba(255, 255, 255, 0.94)',
          hover: 'rgba(255, 255, 255, 1)',
          active: 'rgba(255, 255, 255, 1)',
          selected: 'rgba(255, 255, 255, 1)',
          disabled: 'rgba(255, 255, 255, 0.20)',
          bg: 'rgba(255, 255, 255, 0.09)',
          lowEmphasis: {
            enabled: 'rgba(255, 255, 255, 0.65)',
          },
        },
      },
    },

    status: {
      info: '#617BFF',
      info_onDark: 'rgba(122, 145, 255, 0.25)',
      success: '#1B7F66',
      success_onDark: 'rgba(0, 173, 130, 0.25)',
      warning: '#CC7300',
      warningLight: '#F3DCBD',
      warning_onDark: 'rgba(230, 130, 0, 0.25)',
      important: '#DC0C22',
      important_onDark: 'rgba(248, 104, 118, 0.25)',
    },

    badge: {
      info: '#4766FF',
      infoLight: '#DBE2FF',
      success: '#19856B',
      successLight: '#D9EDE6',
      warning: '#AD6200',
      warningLight: '#FCF6ED',
      important: '#E80D24',
      importantLight: '#FFE3E7',
      aqua: '#167F92',
      aquaLight: '#B4EAF3',
      green: '#40851E',
      greenLight: '#DAF4CD',
      yellow: '#8F6F00',
      yellowLight: '#FFE68F',
      fuschia: '#CF26B8',
      fuschiaLight: '#FCCFF6',
      purple: '#A14CE1',
      purpleLight: '#EDDCF9',
      charcoal: '#4F4F4F',
      charcoalLight: '#E3E3E3',
    },

    avatar: {
      '01': '#D6EAFF',
      '02': '#FFDBFA',
      '03': '#EFE0FF',
      '04': '#CFEFC2',
      '05': '#BEF4ED',
      '06': '#FFE68F',
      '07': '#FFE3DB',
      '08': '#FFE2C2',
    },

    dataViz: {
      border: '#000000',
      '01': '#001446',
      '02': '#062E69',
      '03': '#094A8D',
      '04': '#0068B2',
      '05': '#0094BE',
      '06': '#37B9B2',
      '07': '#9FD7AB',
      '08': '#F0F2BD',
      '09': '#F1D89A',
      '10': '#EFB777',
      '11': '#ED9461',
      '12': '#E96959',
      '13': '#C74046',
      '14': '#95222C',
      '15': '#660011',
    },

    cvd: {
      blue: '#0072B2',
      lightBlue: '#56B4E9',
      yellow: '#F0E442',
      green: '#009E73',
      orange: '#E69F00',
      vermillion: '#D55E00',
      pink: '#CC79A7',
      charcoal: '#323232',
    },

    hover: {
      onLight: 'rgba(0, 0, 0, 0.05)',
      onDark: 'rgba(255, 255, 255, 0.15)',
    },

    selected: {
      onLight: 'rgba(0, 0, 0, 0.09)',
    },

    selectedHighlight: '#E7F2EE',
    selectedHighlight_hover: '#D0E6DE',

    focusBorder: {
      onLight: '#3086BF',
      onDark: 'rgba(255, 255, 255, 0.65)',
    },

    scrim: 'rgba(0, 0, 0, 0.32)',

    scrollbar: {
      enabled: {
        onLight: 'rgba(0, 0, 0, 0.42)',
        onDark: 'rgba(255, 255, 255, 0.43)',
      },
      hover: {
        onLight: 'rgba(0, 0, 0, 0.57)',
        onDark: 'rgba(255, 255, 255, 0.58)',
      },
      active: {
        onLight: 'rgba(0, 0, 0, 0.72)',
        onDark: 'rgba(255, 255, 255, 0.73)',
      },
    },

    navItemText: {
      enabled: {
        onLight: 'rgba(0, 0, 0, 0.72)',
        onDark: 'rgba(255, 255, 255, 0.88)',
      },
    },

    buttonToggleBg: {
      onLight: 'rgba(0, 0, 0, 0.08)',
      onDark: 'rgba(255, 255, 255, 0.08)',
    },

    chipBg: {
      enabled: 'rgba(0, 0, 0, 0.08)',
      hover: 'rgba(0, 0, 0, 0.13)',
    },

    progressIndicatorTrack: 'rgba(0, 0, 0, 0.15)',

    tableCellHighlight: {
      highEmphasis: '#78CFB8',
      midEmphasis: '#E7F2EE',
    },

    grid: {
      finishedRowText: '#595959',
      packageIconColor: '#595959',
    },
  },

  // ===========================================================================
  // TYPOGRAPHY
  // ===========================================================================
  typography: {
    fontFamilies: {
      display: 'var(--font-dm-sans), sans-serif',
      body: 'var(--font-dm-sans), sans-serif',
      mono: 'ui-monospace, SFMono-Regular, "SF Mono", Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace',
    },
    fontWeights: {
      regular: '400',
      medium: '500',
      semibold: '600',
      bold: '700',
    },
    scale: {
      lineHeightTight: '1.2',
      lineHeightNormal: '1.5',
      letterSpacingHeading: '-0.5px',
      letterSpacingBody: '0px',
    },
  },

  // ===========================================================================
  // BORDER RADIUS — base: 4px (Trace = 2× RID)
  // ===========================================================================
  borderRadius: buildBorderRadius(4),

  // ===========================================================================
  // ELEVATION (Shadows)
  // ===========================================================================
  elevation: {
    none: 'none',
    xs: '0px 1px 2px rgba(0, 0, 0, 0.05)',
    sm: '0px 1px 3px rgba(0, 0, 0, 0.1), 0px 1px 2px rgba(0, 0, 0, 0.06)',
    md: '0px 4px 6px -1px rgba(0, 0, 0, 0.1), 0px 2px 4px -1px rgba(0, 0, 0, 0.06)',
    lg: '0px 10px 15px -3px rgba(0, 0, 0, 0.1), 0px 4px 6px -2px rgba(0, 0, 0, 0.05)',
    xl: '0px 20px 25px -5px rgba(0, 0, 0, 0.1), 0px 10px 10px -5px rgba(0, 0, 0, 0.04)',
    '2xl': '0px 25px 50px -12px rgba(0, 0, 0, 0.25)',
    inner: 'inset 0px 2px 4px rgba(0, 0, 0, 0.06)',
    brand: '0px 4px 14px rgba(0, 81, 81, 0.25)',
    brandLg: '0px 10px 25px rgba(0, 81, 81, 0.3)',
  },

  // ===========================================================================
  // SPACING (semantic overrides)
  // ===========================================================================
  spacing: {
    unit: '4px',
    inputPadding: '12px',
    buttonPadding: '16px',
    cardPadding: '24px',
    sectionGap: '48px',
    componentGap: '16px',
  },

  // ===========================================================================
  // ICON STYLE
  // ===========================================================================
  iconStyle: {
    set: 'outlined',
    strokeWidth: '1.5',
    cornerStyle: 'round',
    defaultSize: '20',
    overrides: {},
  },

  // ===========================================================================
  // COMPONENT RADIUS — base: 4, no overrides needed (button = 4×3 = 12px)
  // ===========================================================================
  componentRadius: buildComponentRadius(4),
};
