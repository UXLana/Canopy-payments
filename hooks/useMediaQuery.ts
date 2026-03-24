'use client'

import { useState, useEffect } from 'react'

/**
 * Reactive CSS media query hook.
 *
 * @param query - A valid CSS media query string, e.g. `(max-width: 767px)`
 * @returns `true` when the media query matches.
 */
export function useMediaQuery(query: string): boolean {
  const [matches, setMatches] = useState(false)

  useEffect(() => {
    const mql = window.matchMedia(query)
    setMatches(mql.matches)
    const handler = (e: MediaQueryListEvent) => setMatches(e.matches)
    mql.addEventListener('change', handler)
    return () => mql.removeEventListener('change', handler)
  }, [query])

  return matches
}

/**
 * Returns `true` when the user prefers reduced motion (WCAG 2.3.3).
 */
export function usePrefersReducedMotion(): boolean {
  return useMediaQuery('(prefers-reduced-motion: reduce)')
}

/**
 * Returns `true` when the viewport is below `breakpoint` pixels.
 *
 * @param breakpoint - Width threshold in pixels (default 768).
 */
export function useIsMobile(breakpoint: number = 768): boolean {
  return useMediaQuery(`(max-width: ${breakpoint - 1}px)`)
}
