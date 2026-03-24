'use client';

import { createContext, useContext, useState, useEffect, useLayoutEffect, useMemo, useCallback, type ReactNode } from 'react';
import type { ProductTheme, ThemeColors, ThemeTypography, ThemeBorderRadius, ThemeElevation, ThemeSpacing, ThemeIconStyle } from './theme-interface';
import { traceTheme } from './trace';
import { universityTheme } from './university';
import { earthTheme } from './earth';
import { ridTheme } from './rid';
import { ridDarkTheme } from './rid-dark';
import { claudeLightTheme } from './claude-light';
import { edenTheme } from './eden';
import { applyAllThemeVars } from './css-vars';

// ---------------------------------------------------------------------------
// Theme registry
// ---------------------------------------------------------------------------

const availableThemes: ProductTheme[] = [traceTheme, universityTheme, earthTheme, ridTheme, ridDarkTheme, claudeLightTheme, edenTheme];
const themeMap: Record<string, ProductTheme> = Object.fromEntries(
  availableThemes.map((t) => [t.name, t]),
);

export { availableThemes, themeMap };

// ---------------------------------------------------------------------------
// Theme value context (read-only)
// ---------------------------------------------------------------------------

const ThemeContext = createContext<ProductTheme>(traceTheme);

// ---------------------------------------------------------------------------
// Theme switcher context (set active theme by name)
// ---------------------------------------------------------------------------

interface ThemeSwitcherContextValue {
  themeName: string;
  setThemeName: (name: string) => void;
}

const ThemeSwitcherContext = createContext<ThemeSwitcherContextValue>({
  themeName: 'trace',
  setThemeName: () => {},
});

// ---------------------------------------------------------------------------
// Provider — simple pass-through for overriding in nested contexts
// ---------------------------------------------------------------------------

interface ThemeProviderProps {
  theme?: ProductTheme;
  children: ReactNode;
}

export function ThemeProvider({ theme = traceTheme, children }: ThemeProviderProps) {
  const value = useMemo(() => theme, [theme]);
  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

// ---------------------------------------------------------------------------
// Switchable Provider — manages theme state with localStorage persistence
// ---------------------------------------------------------------------------

interface SwitchableThemeProviderProps {
  children: ReactNode;
}

export function SwitchableThemeProvider({ children }: SwitchableThemeProviderProps) {
  const [themeName, setThemeNameRaw] = useState('trace');
  const [hydrated, setHydrated] = useState(false);

  // Restore from localStorage on mount
  useEffect(() => {
    const stored = localStorage.getItem('ds-theme');
    if (stored && themeMap[stored]) {
      setThemeNameRaw(stored);
    }
    setHydrated(true);
  }, []);

  // Persist to localStorage
  useEffect(() => {
    if (hydrated) {
      localStorage.setItem('ds-theme', themeName);
    }
  }, [themeName, hydrated]);

  const setThemeName = useCallback((name: string) => {
    if (themeMap[name]) {
      setThemeNameRaw(name);
    }
  }, []);

  const activeTheme = useMemo(() => themeMap[themeName] ?? traceTheme, [themeName]);

  useLayoutEffect(() => {
    applyAllThemeVars(activeTheme, document.documentElement);
  }, [activeTheme]);

  const switcherValue = useMemo(() => ({ themeName, setThemeName }), [themeName, setThemeName]);

  return (
    <ThemeSwitcherContext.Provider value={switcherValue}>
      <ThemeContext.Provider value={activeTheme}>
        {children}
      </ThemeContext.Provider>
    </ThemeSwitcherContext.Provider>
  );
}

// ---------------------------------------------------------------------------
// Hooks
// ---------------------------------------------------------------------------

/** Access the full theme object (name + colors). */
export function useTheme(): ProductTheme {
  return useContext(ThemeContext);
}

/** Shorthand — returns just the colors from the active theme. */
export function useColors(): ThemeColors {
  return useContext(ThemeContext).colors;
}

/** Shorthand — returns just the typography config from the active theme. */
export function useTypography(): ThemeTypography {
  return useContext(ThemeContext).typography;
}

/** Shorthand — returns just the border radius scale from the active theme. */
export function useBorderRadius(): ThemeBorderRadius {
  return useContext(ThemeContext).borderRadius;
}

/** Shorthand — returns just the elevation/shadow scale from the active theme. */
export function useElevation(): ThemeElevation {
  return useContext(ThemeContext).elevation;
}

/** Shorthand — returns just the semantic spacing values from the active theme. */
export function useSpacing(): ThemeSpacing {
  return useContext(ThemeContext).spacing;
}

/** Shorthand — returns just the icon style config from the active theme. */
export function useIconStyle(): ThemeIconStyle {
  return useContext(ThemeContext).iconStyle;
}

/** Access the theme switcher to change the active theme by name. */
export function useThemeSwitcher(): ThemeSwitcherContextValue {
  return useContext(ThemeSwitcherContext);
}
