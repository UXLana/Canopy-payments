/**
 * Eden Product Theme
 * Brand color: #2D6A4F (dark forest green)
 * Accent strategy: Analogous (+35° → warm amber-gold #8B6914)
 * Personality: Organic — nature-inspired, warm, airy
 *
 * Generated from Metrc cannabis compliance label printing UI.
 * Warm greens with earthy neutrals, government-professional with organic softness.
 */

import type { ProductTheme } from './theme-interface';
import { buildBorderRadius, buildComponentRadius } from './theme-interface';

export const edenTheme: ProductTheme = {
  name: 'eden',
  colors: {
    brand: {
      default: '#2D6A4F',
      darker: '#1B4332',
      lighter: '#52B788',
    },

    accent: {
      default: '#8B6914',
      darker: '#6B4F0E',
      lighter: '#C4A43A',
    },

    surface: {
      light: '#FAFAF7',
      lightDarker: '#F0EFE9',
      dark: '#3A4A42',
      darkDarker: '#2B3832',
      disabled: {
        onLight: 'rgba(45, 106, 79, 0.03)',
        onDark: 'rgba(255, 255, 255, 0.20)',
      },
      info: '#F4F6FF',
      success: '#EEF6F2',
      warning: '#FDF6EC',
      important: '#FDF2F3',
    },

    surfaceBorder: {
      info: '#D1D9FF',
      success: '#B8DEC9',
      warning: '#F2DABA',
      important: '#F8CFD3',
    },

    text: {
      highEmphasis: {
        onLight: 'rgba(27, 67, 50, 0.95)',
        onDark: '#FFFFFF',
      },
      lowEmphasis: {
        onLight: 'rgba(27, 67, 50, 0.60)',
        onDark: 'rgba(255, 255, 255, 0.70)',
      },
      disabled: {
        onLight: 'rgba(27, 67, 50, 0.30)',
        onDark: 'rgba(255, 255, 255, 0.30)',
      },
      action: {
        enabled: '#2D6A4F',
        hover: '#1B4332',
        active: '#14332A',
      },
      success: '#1B6B45',
      warning: '#A35C00',
      important: '#C10B1E',
    },

    border: {
      lowEmphasis: {
        onLight: 'rgba(27, 67, 50, 0.10)',
        onDark: 'rgba(255, 255, 255, 0.10)',
        hover: {
          onLight: 'rgba(27, 67, 50, 0.27)',
          onDark: 'rgba(255, 255, 255, 0.27)',
        },
      },
      midEmphasis: {
        onLight: 'rgba(27, 67, 50, 0.15)',
        onDark: 'rgba(255, 255, 255, 0.15)',
      },
      highEmphasis: {
        onLight: 'rgba(27, 67, 50, 0.42)',
        onDark: 'rgba(255, 255, 255, 0.43)',
      },
    },

    icon: {
      enabled: {
        onLight: 'rgba(27, 67, 50, 0.55)',
        onDark: 'rgba(255, 255, 255, 0.94)',
      },
      hover: {
        onLight: 'rgba(27, 67, 50, 0.65)',
      },
      active: {
        onLight: 'rgba(27, 67, 50, 0.75)',
      },
      selected: {
        onLight: 'rgba(27, 67, 50, 0.85)',
      },
      disabled: {
        onLight: 'rgba(27, 67, 50, 0.20)',
        onDark: 'rgba(255, 255, 255, 0.20)',
      },
      lowEmphasis: {
        enabled: {
          onLight: 'rgba(27, 67, 50, 0.43)',
          onDark: 'rgba(255, 255, 255, 0.65)',
        },
      },
    },

    iconBg: {
      info: '#EBEFFF',
      info_onDark: 'rgba(122, 145, 255, 0.25)',
      success: '#DCEEE4',
      success_onDark: 'rgba(82, 183, 136, 0.25)',
      warning: '#F9ECDC',
      warning_onDark: 'rgba(230, 130, 0, 0.25)',
      important: '#FBE4E7',
      important_onDark: 'rgba(248, 104, 118, 0.25)',
    },

    action: {
      enabled: '#2D6A4F',
      hover: '#1B4332',
      active: '#14332A',
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
      success: '#2D6A4F',
      success_onDark: 'rgba(82, 183, 136, 0.25)',
      warning: '#CC7300',
      warningLight: '#F3DCBD',
      warning_onDark: 'rgba(230, 130, 0, 0.25)',
      important: '#DC0C22',
      important_onDark: 'rgba(248, 104, 118, 0.25)',
    },

    badge: {
      info: '#4766FF',
      infoLight: '#DBE2FF',
      success: '#2D6A4F',
      successLight: '#D4EDDF',
      warning: '#AD6200',
      warningLight: '#FDF6EC',
      important: '#E80D24',
      importantLight: '#FFE3E7',
      aqua: '#167F92',
      aquaLight: '#B4EAF3',
      green: '#3D7A2A',
      greenLight: '#D6F0CC',
      yellow: '#8B6914',
      yellowLight: '#F5E5B0',
      fuschia: '#CF26B8',
      fuschiaLight: '#FCCFF6',
      purple: '#A14CE1',
      purpleLight: '#EDDCF9',
      charcoal: '#4A5550',
      charcoalLight: '#DEE3E0',
    },

    avatar: {
      '01': '#D0E8D9',
      '02': '#FFDBFA',
      '03': '#EFE0FF',
      '04': '#D4EDCD',
      '05': '#BEF4ED',
      '06': '#F5E5B0',
      '07': '#FFE3DB',
      '08': '#FFE2C2',
    },

    dataViz: {
      border: '#1B4332',
      '01': '#0B2618',
      '02': '#14332A',
      '03': '#1B4332',
      '04': '#2D6A4F',
      '05': '#40916C',
      '06': '#52B788',
      '07': '#74C69D',
      '08': '#95D5B2',
      '09': '#C4A43A',
      '10': '#D4B84D',
      '11': '#E0C960',
      '12': '#E69F00',
      '13': '#CC7300',
      '14': '#A35C00',
      '15': '#6B4F0E',
    },

    cvd: {
      blue: '#0072B2',
      lightBlue: '#56B4E9',
      yellow: '#F0E442',
      green: '#009E73',
      orange: '#E69F00',
      vermillion: '#D55E00',
      pink: '#CC79A7',
      charcoal: '#2B3832',
    },

    hover: {
      onLight: 'rgba(45, 106, 79, 0.05)',
      onDark: 'rgba(255, 255, 255, 0.15)',
    },

    selected: {
      onLight: 'rgba(45, 106, 79, 0.09)',
    },

    selectedHighlight: '#E0F0E7',
    selectedHighlight_hover: '#CBE4D4',

    focusBorder: {
      onLight: '#8B6914',
      onDark: 'rgba(196, 164, 58, 0.65)',
    },

    scrim: 'rgba(27, 67, 50, 0.34)',

    scrollbar: {
      enabled: {
        onLight: 'rgba(27, 67, 50, 0.42)',
        onDark: 'rgba(255, 255, 255, 0.43)',
      },
      hover: {
        onLight: 'rgba(27, 67, 50, 0.57)',
        onDark: 'rgba(255, 255, 255, 0.58)',
      },
      active: {
        onLight: 'rgba(27, 67, 50, 0.72)',
        onDark: 'rgba(255, 255, 255, 0.73)',
      },
    },

    navItemText: {
      enabled: {
        onLight: 'rgba(27, 67, 50, 0.72)',
        onDark: 'rgba(255, 255, 255, 0.88)',
      },
    },

    buttonToggleBg: {
      onLight: 'rgba(27, 67, 50, 0.08)',
      onDark: 'rgba(255, 255, 255, 0.08)',
    },

    chipBg: {
      enabled: 'rgba(27, 67, 50, 0.08)',
      hover: 'rgba(27, 67, 50, 0.13)',
    },

    progressIndicatorTrack: 'rgba(27, 67, 50, 0.15)',

    tableCellHighlight: {
      highEmphasis: '#74C69D',
      midEmphasis: '#E0F0E7',
    },

    grid: {
      finishedRowText: '#4A5550',
      packageIconColor: '#4A5550',
    },
  },

  // ===========================================================================
  // TYPOGRAPHY — Organic: Bitter (serif display) + Nunito Sans (body)
  // ===========================================================================
  typography: {
    fontFamilies: {
      display: 'Bitter, Georgia, serif',
      body: '"Nunito Sans", "DM Sans", sans-serif',
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
  // BORDER RADIUS — base: 3px (Organic: softer than modern, not as round as playful)
  // ===========================================================================
  borderRadius: buildBorderRadius(3),

  // ===========================================================================
  // ELEVATION — Shadows tinted with brand green (45, 106, 79)
  // ===========================================================================
  elevation: {
    none: 'none',
    xs: '0px 1px 2px rgba(45, 106, 79, 0.06)',
    sm: '0px 1px 3px rgba(45, 106, 79, 0.10), 0px 1px 2px rgba(45, 106, 79, 0.08)',
    md: '0px 4px 6px -1px rgba(45, 106, 79, 0.10), 0px 2px 4px -1px rgba(45, 106, 79, 0.08)',
    lg: '0px 10px 15px -3px rgba(45, 106, 79, 0.10), 0px 4px 6px -2px rgba(45, 106, 79, 0.06)',
    xl: '0px 20px 25px -5px rgba(45, 106, 79, 0.12), 0px 10px 10px -5px rgba(45, 106, 79, 0.06)',
    '2xl': '0px 25px 50px -12px rgba(45, 106, 79, 0.28)',
    inner: 'inset 0px 2px 4px rgba(45, 106, 79, 0.08)',
    brand: '0px 4px 14px rgba(45, 106, 79, 0.25)',
    brandLg: '0px 10px 25px rgba(45, 106, 79, 0.30)',
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
  // ICON STYLE — Organic: outlined, thinner strokes, round corners
  // ===========================================================================
  iconStyle: {
    set: 'outlined',
    strokeWidth: '1.25',
    cornerStyle: 'round',
    defaultSize: '20',
    overrides: {},
  },

  // ===========================================================================
  // COMPONENT RADIUS — base: 3, button override to 10px for organic feel
  // ===========================================================================
  componentRadius: buildComponentRadius(3, { button: '10px' }),
};
