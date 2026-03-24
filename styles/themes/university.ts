/**
 * University Product Theme
 * Source: Metrc University MVP (Figma)
 * https://www.figma.com/design/c2UPDQPQC70e03847a7zxF/Metrc-University-MVP
 *
 * Extracted from node 1-31355 (Metrc University Home) on 2026-02-10
 * Brand palette: forest green (#213F39) with gold (#DCC26D) accent,
 * warm off-white (#F9F8F3) page background.
 *
 * Visual identity: Academic/institutional — Playfair Display serif headings,
 * sharper radii, denser spacing, filled icon set.
 */

import type { ProductTheme } from './theme-interface';
import { buildBorderRadius, buildComponentRadius } from './theme-interface';

export const universityTheme: ProductTheme = {
  name: 'university',
  colors: {
    brand: {
      default: '#213F39',
      darker: '#0B1E19',
      lighter: '#3C5D57',
    },

    accent: {
      default: '#DCC26D',
      darker: '#B89E42',
      lighter: '#E8D48A',
    },

    surface: {
      light: '#F9F8F3',
      lightDarker: '#F0EFEA',
      dark: '#33423F',
      darkDarker: '#213F39',
      disabled: {
        onLight: 'rgba(0, 0, 0, 0.03)',
        onDark: 'rgba(255, 255, 255, 0.20)',
      },
      info: '#F0F4F3',
      success: '#EDF6F4',
      warning: '#FCF6ED',
      important: '#FDF2F3',
    },

    surfaceBorder: {
      info: '#C3CDCC',
      success: '#C5E2DB',
      warning: '#F2DABA',
      important: '#F8CFD3',
    },

    text: {
      highEmphasis: {
        onLight: '#191C22',
        onDark: '#FFFFFF',
      },
      lowEmphasis: {
        onLight: '#4F5359',
        onDark: 'rgba(255, 255, 255, 0.70)',
      },
      disabled: {
        onLight: 'rgba(0, 0, 0, 0.30)',
        onDark: 'rgba(255, 255, 255, 0.30)',
      },
      action: {
        enabled: '#213F39',
        hover: '#0B1E19',
        active: '#0B1E19',
      },
      success: '#006B50',
      warning: '#A35C00',
      important: '#C10B1E',
    },

    border: {
      lowEmphasis: {
        onLight: '#DCDDDF',
        onDark: 'rgba(255, 255, 255, 0.10)',
        hover: {
          onLight: 'rgba(0, 0, 0, 0.27)',
          onDark: 'rgba(255, 255, 255, 0.27)',
        },
      },
      midEmphasis: {
        onLight: '#C3CDCC',
        onDark: 'rgba(255, 255, 255, 0.15)',
      },
      highEmphasis: {
        onLight: 'rgba(0, 0, 0, 0.42)',
        onDark: 'rgba(255, 255, 255, 0.43)',
      },
    },

    icon: {
      enabled: {
        onLight: '#2C4843',
        onDark: 'rgba(255, 255, 255, 0.94)',
      },
      hover: {
        onLight: '#213F39',
      },
      active: {
        onLight: '#0B1E19',
      },
      selected: {
        onLight: '#0B1E19',
      },
      disabled: {
        onLight: 'rgba(0, 0, 0, 0.20)',
        onDark: 'rgba(255, 255, 255, 0.20)',
      },
      lowEmphasis: {
        enabled: {
          onLight: '#4F5359',
          onDark: 'rgba(255, 255, 255, 0.65)',
        },
      },
    },

    iconBg: {
      info: '#DDE9E6',
      info_onDark: 'rgba(61, 93, 87, 0.25)',
      success: '#DEEDE9',
      success_onDark: 'rgba(0, 173, 130, 0.25)',
      warning: '#F9ECDC',
      warning_onDark: 'rgba(230, 130, 0, 0.25)',
      important: '#FBE4E7',
      important_onDark: 'rgba(248, 104, 118, 0.25)',
    },

    action: {
      enabled: '#213F39',
      hover: '#0B1E19',
      active: '#0B1E19',
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
      info: '#3C5D57',
      info_onDark: 'rgba(61, 93, 87, 0.25)',
      success: '#1B7F66',
      success_onDark: 'rgba(0, 173, 130, 0.25)',
      warning: '#CC7300',
      warningLight: '#F3DCBD',
      warning_onDark: 'rgba(230, 130, 0, 0.25)',
      important: '#DC0C22',
      important_onDark: 'rgba(248, 104, 118, 0.25)',
    },

    badge: {
      info: '#2C4843',
      infoLight: '#DDE9E6',
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
      '01': '#0B1E19',
      '02': '#17352E',
      '03': '#213F39',
      '04': '#2C4843',
      '05': '#3C5D57',
      '06': '#5A7D77',
      '07': '#8FAE9E',
      '08': '#C4D8CC',
      '09': '#DCC26D',
      '10': '#C4A94D',
      '11': '#A38F3A',
      '12': '#8B7828',
      '13': '#6E5E16',
      '14': '#504508',
      '15': '#332D00',
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

    selectedHighlight: '#DDE9E6',
    selectedHighlight_hover: '#C6DAD5',

    focusBorder: {
      onLight: '#3C5D57',
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
        onLight: '#2C4843',
        onDark: 'rgba(255, 255, 255, 0.88)',
      },
    },

    buttonToggleBg: {
      onLight: '#DDE9E6',
      onDark: 'rgba(255, 255, 255, 0.08)',
    },

    chipBg: {
      enabled: '#DDE9E6',
      hover: '#C6DAD5',
    },

    progressIndicatorTrack: 'rgba(0, 0, 0, 0.15)',

    tableCellHighlight: {
      highEmphasis: '#78CFB8',
      midEmphasis: '#DDE9E6',
    },

    grid: {
      finishedRowText: '#595959',
      packageIconColor: '#595959',
    },
  },

  // ===========================================================================
  // TYPOGRAPHY — Academic: Playfair Display headings, Source Sans 3 body
  // ===========================================================================
  typography: {
    fontFamilies: {
      display: 'var(--font-playfair-display), "Playfair Display", Georgia, serif',
      body: 'var(--font-source-sans-3), "Source Sans 3", -apple-system, BlinkMacSystemFont, sans-serif',
      mono: 'ui-monospace, SFMono-Regular, "SF Mono", Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace',
    },
    fontWeights: {
      regular: '400',
      medium: '500',
      semibold: '600',
      bold: '700',
    },
    scale: {
      lineHeightTight: '1.15',
      lineHeightNormal: '1.5',
      letterSpacingHeading: '-0.3px',
      letterSpacingBody: '0.1px',
    },
  },

  // ===========================================================================
  // BORDER RADIUS — base: 1px (sharpest, institutional)
  // ===========================================================================
  borderRadius: buildBorderRadius(1),

  // ===========================================================================
  // ELEVATION — Forest green tinted shadows
  // ===========================================================================
  elevation: {
    none: 'none',
    xs: '0px 1px 2px rgba(33, 63, 57, 0.06)',
    sm: '0px 1px 3px rgba(33, 63, 57, 0.1), 0px 1px 2px rgba(33, 63, 57, 0.08)',
    md: '0px 4px 6px -1px rgba(33, 63, 57, 0.1), 0px 2px 4px -1px rgba(33, 63, 57, 0.08)',
    lg: '0px 10px 15px -3px rgba(33, 63, 57, 0.1), 0px 4px 6px -2px rgba(33, 63, 57, 0.06)',
    xl: '0px 20px 25px -5px rgba(33, 63, 57, 0.12), 0px 10px 10px -5px rgba(33, 63, 57, 0.06)',
    '2xl': '0px 25px 50px -12px rgba(33, 63, 57, 0.28)',
    inner: 'inset 0px 2px 4px rgba(33, 63, 57, 0.08)',
    brand: '0px 4px 14px rgba(33, 63, 57, 0.25)',
    brandLg: '0px 10px 25px rgba(33, 63, 57, 0.3)',
  },

  // ===========================================================================
  // SPACING — Denser, more compact
  // ===========================================================================
  spacing: {
    unit: '4px',
    inputPadding: '10px',
    buttonPadding: '14px',
    cardPadding: '20px',
    sectionGap: '40px',
    componentGap: '12px',
  },

  // ===========================================================================
  // ICON STYLE — Filled set for academic look
  // ===========================================================================
  iconStyle: {
    set: 'filled',
    strokeWidth: '1.5',
    cornerStyle: 'round',
    defaultSize: '20',
    overrides: {
      Home: 'outlined',
    },
  },

  // ===========================================================================
  // COMPONENT RADIUS — base: 1, button overridden (1×3=3px → 10px design choice)
  // ===========================================================================
  componentRadius: buildComponentRadius(1, { button: '10px' }),
};
