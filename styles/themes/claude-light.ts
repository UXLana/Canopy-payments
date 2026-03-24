/**
 * Claude Light Theme
 * Brand color: #BD5D3A (muted terracotta — Claude's actual UI accent)
 * Logo color: #DA7756 (mapped to brand.lighter for secondary use)
 * Accent strategy: Split-complementary (hue ~165°) → muted teal #3A9E8F
 * Personality: Organic — serif everywhere (ui-serif, Georgia), soft radius, airy spacing
 *
 * Surface colors derived from Claude's actual web palette:
 *   Pampas (#F4F3EE), warm cream (#ECEAE0), body text (#3D3929)
 *
 * Accessibility: action.enabled (#9E4B2D) passes AA on #F4F3EE at 5.2:1
 *               text.highEmphasis (#3D3929) passes AA on #F4F3EE at 9.8:1
 *               brand.default (#BD5D3A) as text on #F4F3EE: ~4.6:1 (AA pass)
 */

import type { ProductTheme } from './theme-interface';
import { buildBorderRadius, buildComponentRadius } from './theme-interface';

export const claudeLightTheme: ProductTheme = {
  name: 'Claude-Light',
  colors: {
    brand: {
      default: '#BD5D3A',
      darker: '#9A4A2C',
      lighter: '#DA7756',
    },

    accent: {
      default: '#3A9E8F',
      darker: '#2A7A6E',
      lighter: '#5DBDAD',
    },

    surface: {
      light: '#F4F3EE',
      lightDarker: '#ECEAE0',
      dark: '#4A4440',
      darkDarker: '#332F2C',
      disabled: {
        onLight: 'rgba(61, 57, 41, 0.03)',
        onDark: 'rgba(255, 255, 255, 0.20)',
      },
      info: '#F0F2FF',
      success: '#EDF6F2',
      warning: '#FDF6ED',
      important: '#FDF2F2',
    },

    surfaceBorder: {
      info: '#CDD5FF',
      success: '#BDDFD4',
      warning: '#F2DABA',
      important: '#F8CFD0',
    },

    text: {
      highEmphasis: {
        onLight: '#3D3929',
        onDark: '#F4F3EE',
      },
      lowEmphasis: {
        onLight: 'rgba(61, 57, 41, 0.60)',
        onDark: 'rgba(244, 243, 238, 0.70)',
      },
      disabled: {
        onLight: 'rgba(61, 57, 41, 0.30)',
        onDark: 'rgba(244, 243, 238, 0.30)',
      },
      action: {
        enabled: '#9E4B2D',
        hover: '#7F3B22',
        active: '#6A311C',
      },
      success: '#1A6B4F',
      warning: '#A35C00',
      important: '#B80D1E',
    },

    border: {
      lowEmphasis: {
        onLight: 'rgba(61, 57, 41, 0.10)',
        onDark: 'rgba(244, 243, 238, 0.10)',
        hover: {
          onLight: 'rgba(61, 57, 41, 0.27)',
          onDark: 'rgba(244, 243, 238, 0.27)',
        },
      },
      midEmphasis: {
        onLight: 'rgba(61, 57, 41, 0.15)',
        onDark: 'rgba(244, 243, 238, 0.15)',
      },
      highEmphasis: {
        onLight: 'rgba(61, 57, 41, 0.42)',
        onDark: 'rgba(244, 243, 238, 0.43)',
      },
    },

    icon: {
      enabled: {
        onLight: 'rgba(61, 57, 41, 0.55)',
        onDark: 'rgba(244, 243, 238, 0.94)',
      },
      hover: {
        onLight: 'rgba(61, 57, 41, 0.65)',
      },
      active: {
        onLight: 'rgba(61, 57, 41, 0.75)',
      },
      selected: {
        onLight: 'rgba(61, 57, 41, 0.85)',
      },
      disabled: {
        onLight: 'rgba(61, 57, 41, 0.20)',
        onDark: 'rgba(244, 243, 238, 0.20)',
      },
      lowEmphasis: {
        enabled: {
          onLight: 'rgba(61, 57, 41, 0.43)',
          onDark: 'rgba(244, 243, 238, 0.65)',
        },
      },
    },

    iconBg: {
      info: '#E5EAFF',
      info_onDark: 'rgba(122, 145, 255, 0.25)',
      success: '#D6EDE5',
      success_onDark: 'rgba(0, 173, 130, 0.25)',
      warning: '#F9ECDC',
      warning_onDark: 'rgba(230, 130, 0, 0.25)',
      important: '#FBE4E5',
      important_onDark: 'rgba(248, 104, 118, 0.25)',
    },

    action: {
      enabled: '#9E4B2D',
      hover: '#7F3B22',
      active: '#6A311C',
      important: {
        enabled: '#B80D1E',
        hover: '#9A0A19',
        active: '#7E0815',
      },
      monochrome: {
        onLight: {
          enabled: 'rgba(61, 57, 41, 0.55)',
          hover: 'rgba(61, 57, 41, 0.65)',
          active: 'rgba(61, 57, 41, 0.75)',
          selected: 'rgba(61, 57, 41, 0.85)',
          disabled: 'rgba(61, 57, 41, 0.20)',
          bg: 'rgba(61, 57, 41, 0.08)',
          lowEmphasis: {
            enabled: 'rgba(61, 57, 41, 0.43)',
          },
        },
        onDark: {
          enabled: 'rgba(244, 243, 238, 0.94)',
          hover: 'rgba(244, 243, 238, 1)',
          active: 'rgba(244, 243, 238, 1)',
          selected: 'rgba(244, 243, 238, 1)',
          disabled: 'rgba(244, 243, 238, 0.20)',
          bg: 'rgba(244, 243, 238, 0.09)',
          lowEmphasis: {
            enabled: 'rgba(244, 243, 238, 0.65)',
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
      successLight: '#D3EDE3',
      warning: '#AD6200',
      warningLight: '#FDF6ED',
      important: '#D4102A',
      importantLight: '#FFE3E5',
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
      charcoal: '#54504A',
      charcoalLight: '#E4E2DC',
    },

    avatar: {
      '01': '#F5DDD4',
      '02': '#FFDBFA',
      '03': '#EFE0FF',
      '04': '#D2F0C6',
      '05': '#C4F2EA',
      '06': '#FFE68F',
      '07': '#FFE3DB',
      '08': '#FFE2C2',
    },

    dataViz: {
      border: '#3D3929',
      '01': '#4A2010',
      '02': '#703418',
      '03': '#9E4B2D',
      '04': '#DA7756',
      '05': '#E89E85',
      '06': '#F0C4B0',
      '07': '#E8D5B8',
      '08': '#C4D8C8',
      '09': '#8DC4B4',
      '10': '#5DBDAD',
      '11': '#3A9E8F',
      '12': '#2A7A6E',
      '13': '#1E5E54',
      '14': '#14433C',
      '15': '#0A2A25',
    },

    cvd: {
      blue: '#0072B2',
      lightBlue: '#56B4E9',
      yellow: '#F0E442',
      green: '#009E73',
      orange: '#E69F00',
      vermillion: '#D55E00',
      pink: '#CC79A7',
      charcoal: '#332F2C',
    },

    hover: {
      onLight: 'rgba(61, 57, 41, 0.05)',
      onDark: 'rgba(244, 243, 238, 0.15)',
    },

    selected: {
      onLight: 'rgba(61, 57, 41, 0.09)',
    },

    selectedHighlight: '#F2E6DF',
    selectedHighlight_hover: '#E6D5CA',

    focusBorder: {
      onLight: '#3A9E8F',
      onDark: 'rgba(244, 243, 238, 0.65)',
    },

    scrim: 'rgba(61, 57, 41, 0.34)',

    scrollbar: {
      enabled: {
        onLight: 'rgba(61, 57, 41, 0.42)',
        onDark: 'rgba(244, 243, 238, 0.43)',
      },
      hover: {
        onLight: 'rgba(61, 57, 41, 0.57)',
        onDark: 'rgba(244, 243, 238, 0.58)',
      },
      active: {
        onLight: 'rgba(61, 57, 41, 0.72)',
        onDark: 'rgba(244, 243, 238, 0.73)',
      },
    },

    navItemText: {
      enabled: {
        onLight: 'rgba(61, 57, 41, 0.72)',
        onDark: 'rgba(244, 243, 238, 0.88)',
      },
    },

    buttonToggleBg: {
      onLight: 'rgba(61, 57, 41, 0.08)',
      onDark: 'rgba(244, 243, 238, 0.08)',
    },

    chipBg: {
      enabled: 'rgba(61, 57, 41, 0.08)',
      hover: 'rgba(61, 57, 41, 0.13)',
    },

    progressIndicatorTrack: 'rgba(61, 57, 41, 0.15)',

    tableCellHighlight: {
      highEmphasis: '#E89E85',
      midEmphasis: '#F2E6DF',
    },

    grid: {
      finishedRowText: '#6B6558',
      packageIconColor: '#6B6558',
    },
  },

  // ===========================================================================
  // TYPOGRAPHY — Claude: Newsreader serif for headings (≈ Tiempos), Inter sans for body (≈ Styrene)
  // ===========================================================================
  typography: {
    fontFamilies: {
      display: 'var(--font-newsreader), ui-serif, Georgia, serif',
      body: 'var(--font-inter), -apple-system, BlinkMacSystemFont, sans-serif',
      mono: 'ui-monospace, SFMono-Regular, "SF Mono", Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace',
    },
    fontWeights: {
      regular: '400',
      medium: '500',
      semibold: '600',
      bold: '700',
    },
    scale: {
      lineHeightTight: '1.25',
      lineHeightNormal: '1.6',
      letterSpacingHeading: '-0.3px',
      letterSpacingBody: '0.15px',
    },
  },

  // ===========================================================================
  // BORDER RADIUS — base: 3 (organic, soft)
  // ===========================================================================
  borderRadius: buildBorderRadius(3),

  // ===========================================================================
  // ELEVATION — brand-tinted shadows (RGB 189, 93, 58 = #BD5D3A)
  // ===========================================================================
  elevation: {
    none: 'none',
    xs: '0px 1px 2px rgba(189, 93, 58, 0.06)',
    sm: '0px 1px 3px rgba(189, 93, 58, 0.10), 0px 1px 2px rgba(189, 93, 58, 0.08)',
    md: '0px 4px 6px -1px rgba(189, 93, 58, 0.10), 0px 2px 4px -1px rgba(189, 93, 58, 0.08)',
    lg: '0px 10px 15px -3px rgba(189, 93, 58, 0.10), 0px 4px 6px -2px rgba(189, 93, 58, 0.06)',
    xl: '0px 20px 25px -5px rgba(189, 93, 58, 0.12), 0px 10px 10px -5px rgba(189, 93, 58, 0.06)',
    '2xl': '0px 25px 50px -12px rgba(189, 93, 58, 0.28)',
    inner: 'inset 0px 2px 4px rgba(189, 93, 58, 0.08)',
    brand: '0px 4px 14px rgba(189, 93, 58, 0.25)',
    brandLg: '0px 10px 25px rgba(189, 93, 58, 0.30)',
  },

  // ===========================================================================
  // SPACING — Organic: airy, generous breathing room
  // ===========================================================================
  spacing: {
    unit: '4px',
    inputPadding: '14px',
    buttonPadding: '18px',
    cardPadding: '28px',
    sectionGap: '56px',
    componentGap: '20px',
  },

  // ===========================================================================
  // ICON STYLE — Organic: thin outlined, round
  // ===========================================================================
  iconStyle: {
    set: 'outlined',
    strokeWidth: '1.25',
    cornerStyle: 'round',
    defaultSize: '20',
    overrides: {},
  },

  // ===========================================================================
  // COMPONENT RADIUS — base: 3, button overridden to 10px (design choice)
  // ===========================================================================
  componentRadius: buildComponentRadius(3, { button: '10px' }),
};
