'use client'

import React, { useState, useRef, useEffect } from 'react'
import {
  colors,
  spacing,
  fontFamilies,
  fontWeights,
  typography,
  borderRadiusSemantics,
  zIndex,
  shadowSemantics,
} from '@/styles/design-tokens'
import { useThemeSwitcher, availableThemes } from '@/styles/themes'
import { Button } from '@/components'

// =============================================================================
// TYPES
// =============================================================================

export type ViewState = 'default' | 'loading' | 'empty' | 'error'

export interface UseCase {
  /** Short identifier shown in the selector, e.g. "Use Case 1" */
  label: string
  /** Brief description of the scenario */
  description: string
}

export interface Version {
  /** Short label shown in the selector, e.g. "v1", "v2 — Updated layout" */
  label: string
  /** Brief description of what changed in this version */
  description: string
}

export interface PrototypeToolbarProps {
  viewState: ViewState
  onViewStateChange: (state: ViewState) => void
  /** Additional states beyond the standard four */
  extraStates?: string[]
  /** Versions of this prototype (selector shown when 2+) */
  versions?: Version[]
  /** Currently selected version index */
  activeVersion?: number
  /** Callback when version changes */
  onVersionChange?: (index: number) => void
  /** Use cases / scenarios for this prototype */
  useCases?: UseCase[]
  /** Currently selected use case index */
  activeUseCase?: number
  /** Callback when use case changes */
  onUseCaseChange?: (index: number) => void
  /** Keyboard shortcut to toggle visibility. Default: Cmd+. (Mac) / Ctrl+. (Windows).
   *  Set to false to disable. Useful for hiding during user testing. */
  hotkey?: string | false
  /** Start hidden (e.g. for user testing). Toggle with hotkey. */
  initiallyHidden?: boolean
}

const VIEW_STATES: ViewState[] = ['default', 'loading', 'empty', 'error']

// =============================================================================
// SHARED STYLES
// =============================================================================

const labelStyle: React.CSSProperties = {
  fontFamily: fontFamilies.mono,
  fontSize: typography.body.xs.fontSize,
  fontWeight: fontWeights.semibold,
  color: colors.text.disabled.onLight,
  textTransform: 'uppercase',
  letterSpacing: '0.05em',
  marginBottom: spacing['2xs'],
}

const selectStyle: React.CSSProperties = {
  width: '100%',
  padding: `4px ${spacing.xs}`,
  fontFamily: fontFamilies.body,
  fontSize: typography.body.sm.fontSize,
  fontWeight: fontWeights.regular,
  color: colors.text.highEmphasis.onLight,
  backgroundColor: colors.surface.light,
  border: `1px solid ${colors.border.lowEmphasis.onLight}`,
  borderRadius: borderRadiusSemantics.input,
  cursor: 'pointer',
  outline: 'none',
  appearance: 'auto' as React.CSSProperties['appearance'],
}

// =============================================================================
// ANIMATIONS — injected once via <style> tag
// =============================================================================

const ANIMATION_STYLES = `
@keyframes mtr-toolbar-fade-in {
  from { opacity: 0; }
  to { opacity: 1; }
}
@keyframes mtr-toolbar-slide-up {
  from { transform: translateY(100%); }
  to { transform: translateY(0); }
}
@keyframes mtr-toolbar-dropdown-in {
  from { opacity: 0; transform: scaleY(0.92); }
  to { opacity: 1; transform: scaleY(1); }
}
@keyframes mtr-toolbar-panel-in {
  from { opacity: 0; transform: translateY(8px); }
  to { opacity: 1; transform: translateY(0); }
}
`

function useAnimationStyles() {
  useEffect(() => {
    const id = 'mtr-toolbar-animations'
    if (document.getElementById(id)) return
    const style = document.createElement('style')
    style.id = id
    style.textContent = ANIMATION_STYLES
    document.head.appendChild(style)
  }, [])
}

// =============================================================================
// CUSTOM SELECT — renders dropdown inline so it stays inside the bottom sheet
// =============================================================================

interface InlineSelectOption {
  value: string | number
  label: string
}

function InlineSelect({
  value,
  options,
  onChange,
  ariaLabel,
}: {
  value: string | number
  options: InlineSelectOption[]
  onChange: (value: string) => void
  ariaLabel: string
}) {
  const [open, setOpen] = useState(false)
  const [flipUp, setFlipUp] = useState(false)
  const ref = useRef<HTMLDivElement>(null)
  const triggerRef = useRef<HTMLButtonElement>(null)

  // Close on outside click
  useEffect(() => {
    if (!open) return
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [open])

  const selectedLabel = options.find(o => String(o.value) === String(value))?.label ?? ''

  const handleToggle = () => {
    if (!open && triggerRef.current) {
      // Measure space below trigger vs viewport bottom
      const rect = triggerRef.current.getBoundingClientRect()
      const spaceBelow = window.innerHeight - rect.bottom
      const menuHeight = Math.min(options.length * 38, 180) // estimate
      setFlipUp(spaceBelow < menuHeight + 8)
    }
    setOpen(!open)
  }

  return (
    <div ref={ref} style={{ position: 'relative' }}>
      {/* Trigger */}
      <button
        ref={triggerRef}
        type="button"
        role="combobox"
        aria-label={ariaLabel}
        aria-expanded={open}
        aria-haspopup="listbox"
        onClick={handleToggle}
        style={{
          ...selectStyle,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          textAlign: 'left',
          appearance: 'none',
          WebkitAppearance: 'none',
        }}
      >
        <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', flex: 1 }}>
          {selectedLabel}
        </span>
        <svg
          width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden="true"
          style={{
            flexShrink: 0,
            marginLeft: '4px',
            transition: 'transform 200ms ease',
            transform: open ? 'rotate(180deg)' : 'rotate(0deg)',
          }}
        >
          <path d="M3 4.5L6 7.5L9 4.5" stroke={colors.text.lowEmphasis.onLight} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>

      {/* Dropdown — flips upward when near bottom of viewport */}
      {open && (
        <div
          role="listbox"
          aria-label={ariaLabel}
          style={{
            position: 'absolute',
            ...(flipUp
              ? { bottom: '100%', marginBottom: '2px' }
              : { top: '100%', marginTop: '2px' }),
            left: 0,
            right: 0,
            backgroundColor: colors.surface.light,
            border: `1px solid ${colors.border.lowEmphasis.onLight}`,
            borderRadius: borderRadiusSemantics.input,
            boxShadow: shadowSemantics.dropdown,
            overflow: 'auto',
            maxHeight: '180px',
            zIndex: 10,
            animation: 'mtr-toolbar-dropdown-in 150ms ease-out',
            transformOrigin: flipUp ? 'bottom center' : 'top center',
          }}
        >
          {options.map((opt, idx) => {
            const isSelected = String(opt.value) === String(value)
            const isLast = idx === options.length - 1
            return (
              <button
                key={opt.value}
                type="button"
                role="option"
                aria-selected={isSelected}
                onClick={() => { onChange(String(opt.value)); setOpen(false) }}
                onMouseEnter={(e) => {
                  if (!isSelected) (e.currentTarget.style.backgroundColor = colors.surface.dark)
                }}
                onMouseLeave={(e) => {
                  if (!isSelected) (e.currentTarget.style.backgroundColor = 'transparent')
                }}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  width: '100%',
                  padding: `8px ${spacing.sm}`,
                  fontFamily: fontFamilies.body,
                  fontSize: typography.body.sm.fontSize,
                  fontWeight: isSelected ? fontWeights.semibold : fontWeights.regular,
                  color: isSelected ? colors.text.highEmphasis.onDark : colors.text.highEmphasis.onLight,
                  backgroundColor: isSelected ? colors.brand.default : 'transparent',
                  border: 'none',
                  borderBottom: isLast ? 'none' : `1px solid ${colors.border.lowEmphasis.onLight}`,
                  cursor: 'pointer',
                  textAlign: 'left',
                  transition: 'background-color 100ms ease',
                }}
              >
                {isSelected ? (
                  <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true" style={{ flexShrink: 0 }}>
                    <path d="M3 7L5.5 9.5L11 4" stroke={colors.text.highEmphasis.onDark} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                ) : (
                  <span style={{ width: '14px', flexShrink: 0 }} />
                )}
                <span>{opt.label}</span>
              </button>
            )
          })}
        </div>
      )}
    </div>
  )
}

// =============================================================================
// COMPONENT
// =============================================================================

export function PrototypeToolbar({
  viewState,
  onViewStateChange,
  extraStates,
  versions,
  activeVersion,
  onVersionChange,
  useCases,
  activeUseCase,
  onUseCaseChange,
  hotkey,
  initiallyHidden = false,
}: PrototypeToolbarProps) {
  useAnimationStyles()
  const [isOpen, setIsOpen] = useState(false)
  const [isVisible, setIsVisible] = useState(!initiallyHidden)
  const { themeName, setThemeName } = useThemeSwitcher()
  const [showAllPrototypes, setShowAllPrototypes] = useState(false)
  const [isMobile, setIsMobile] = useState(false)
  const panelRef = useRef<HTMLDivElement>(null)
  const buttonRef = useRef<HTMLButtonElement>(null)
  const wrapperRef = useRef<HTMLDivElement>(null)

  // Detect mobile viewport (e.g. inspector responsive mode)
  useEffect(() => {
    const mq = window.matchMedia('(max-width: 600px)')
    setIsMobile(mq.matches)
    const handler = (e: MediaQueryListEvent) => setIsMobile(e.matches)
    mq.addEventListener('change', handler)
    return () => mq.removeEventListener('change', handler)
  }, [])

  // Show "All Prototypes" link on non-index pages
  useEffect(() => {
    setShowAllPrototypes(window.location.pathname !== '/prototypes')
  }, [])

  // Keyboard shortcut to toggle visibility (default: Cmd/Ctrl + .)
  useEffect(() => {
    if (hotkey === false) return
    function handleKey(e: KeyboardEvent) {
      const isMod = e.metaKey || e.ctrlKey
      if (isMod && e.key === '.') {
        e.preventDefault()
        setIsVisible(v => {
          if (v) setIsOpen(false) // close panel when hiding
          return !v
        })
      }
    }
    document.addEventListener('keydown', handleKey)
    return () => document.removeEventListener('keydown', handleKey)
  }, [hotkey])

  // Close on click outside
  useEffect(() => {
    if (!isOpen) return
    function handleClick(e: MouseEvent) {
      if (
        panelRef.current && !panelRef.current.contains(e.target as Node) &&
        buttonRef.current && !buttonRef.current.contains(e.target as Node)
      ) {
        setIsOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [isOpen])

  // Close on Escape
  useEffect(() => {
    if (!isOpen) return
    function handleKey(e: KeyboardEvent) {
      if (e.key === 'Escape') setIsOpen(false)
    }
    document.addEventListener('keydown', handleKey)
    return () => document.removeEventListener('keydown', handleKey)
  }, [isOpen])

  // Hidden — render nothing (hotkey still active)
  if (!isVisible) return null

  const allStates = extraStates ? [...VIEW_STATES, ...extraStates] : VIEW_STATES
  const hasVersions = versions && versions.length > 1 && onVersionChange
  const hasUseCases = useCases && useCases.length > 0 && onUseCaseChange

  // Description helper
  const descriptionNode = (text: string | undefined) =>
    text ? (
      <div
        style={{
          fontFamily: fontFamilies.body,
          fontSize: typography.body.xs.fontSize,
          color: colors.text.lowEmphasis.onLight,
          marginTop: spacing['2xs'],
          lineHeight: '1.4',
        }}
      >
        {text}
      </div>
    ) : null

  // Build shared panel contents — uses InlineSelect on mobile, native <select> on desktop
  const buildPanelContents = (useInline: boolean) => (
    <>
      {/* Version selector */}
      {hasVersions && (
        <div>
          <div style={labelStyle}>Version</div>
          {useInline ? (
            <InlineSelect
              value={activeVersion ?? 0}
              options={versions.map((v, i) => ({ value: i, label: v.label }))}
              onChange={(val) => { onVersionChange(Number(val)); setIsOpen(false) }}
              ariaLabel="Prototype version"
            />
          ) : (
            <select
              value={activeVersion ?? 0}
              onChange={(e) => { onVersionChange(Number(e.target.value)); setIsOpen(false) }}
              aria-label="Prototype version"
              style={selectStyle}
            >
              {versions.map((v, i) => (
                <option key={i} value={i}>{v.label}</option>
              ))}
            </select>
          )}
          {descriptionNode(versions[activeVersion ?? 0]?.description)}
        </div>
      )}

      {/* Use case selector */}
      {hasUseCases && (
        <div>
          <div style={labelStyle}>Use Case</div>
          {useInline ? (
            <InlineSelect
              value={activeUseCase ?? 0}
              options={useCases.map((uc, i) => ({ value: i, label: uc.label }))}
              onChange={(val) => { onUseCaseChange(Number(val)); setIsOpen(false) }}
              ariaLabel="Use case scenario"
            />
          ) : (
            <select
              value={activeUseCase ?? 0}
              onChange={(e) => { onUseCaseChange(Number(e.target.value)); setIsOpen(false) }}
              aria-label="Use case scenario"
              style={selectStyle}
            >
              {useCases.map((uc, i) => (
                <option key={i} value={i}>{uc.label}</option>
              ))}
            </select>
          )}
          {descriptionNode(useCases[activeUseCase ?? 0]?.description)}
        </div>
      )}

      {/* State selector */}
      <div>
        <div style={labelStyle}>State</div>
        {useInline ? (
          <InlineSelect
            value={viewState}
            options={allStates.map((s) => ({ value: s, label: s.charAt(0).toUpperCase() + s.slice(1) }))}
            onChange={(val) => { onViewStateChange(val as ViewState); setIsOpen(false) }}
            ariaLabel="Prototype view state"
          />
        ) : (
          <select
            value={viewState}
            onChange={(e) => { onViewStateChange(e.target.value as ViewState); setIsOpen(false) }}
            aria-label="Prototype view state"
            style={selectStyle}
          >
            {allStates.map((state) => (
              <option key={state} value={state}>{state.charAt(0).toUpperCase() + state.slice(1)}</option>
            ))}
          </select>
        )}
      </div>

      {/* Theme selector */}
      <div>
        <div style={labelStyle}>Theme</div>
        {useInline ? (
          <InlineSelect
            value={themeName}
            options={availableThemes.map((t) => ({ value: t.name, label: t.name }))}
            onChange={(val) => { setThemeName(val); setIsOpen(false) }}
            ariaLabel="Theme"
          />
        ) : (
          <select
            value={themeName}
            onChange={(e) => { setThemeName(e.target.value); setIsOpen(false) }}
            aria-label="Theme"
            style={selectStyle}
          >
            {availableThemes.map((theme) => (
              <option key={theme.name} value={theme.name}>{theme.name}</option>
            ))}
          </select>
        )}
      </div>

      {/* All Prototypes link */}
      {showAllPrototypes && (
        <div style={{ borderTop: `1px solid ${colors.border.lowEmphasis.onLight}`, marginTop: spacing['2xs'], paddingTop: spacing.sm }}>
          <Button emphasis="low" size="md" onClick={() => { window.location.href = '/prototypes' }}>
            All Prototypes
          </Button>
        </div>
      )}
    </>
  )

  // ─── Mobile: bottom sheet inside centered container ───
  if (isMobile) {
    return (
      <div
        ref={wrapperRef}
        style={{
          position: 'fixed',
          bottom: 0,
          left: 0,
          right: 0,
          zIndex: zIndex.modal,
          pointerEvents: 'none',
          display: 'flex',
          justifyContent: 'center',
        }}
      >
        <div style={{ position: 'relative', width: '100%', maxWidth: '500px' }}>
          {/* Trigger button */}
          <button
            ref={buttonRef}
            onClick={() => setIsOpen(!isOpen)}
            aria-label="Prototype dev tools"
            aria-expanded={isOpen}
            style={{
              position: 'absolute',
              bottom: spacing.xl,
              left: spacing.md,
              zIndex: zIndex.modal,
              width: '40px',
              height: '40px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              backgroundColor: isOpen ? colors.brand.default : colors.scrim,
              color: colors.text.highEmphasis.onDark,
              border: 'none',
              borderRadius: '50%',
              cursor: 'pointer',
              boxShadow: shadowSemantics.dropdown,
              transition: 'background-color 150ms ease-out',
              pointerEvents: 'auto',
            }}
          >
            <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden="true">
              <path d="M6.75 2.25h4.5M6.75 9h4.5M6.75 15.75h4.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
              <circle cx="4.5" cy="2.25" r="1.5" stroke="currentColor" strokeWidth="1.5" />
              <circle cx="13.5" cy="9" r="1.5" stroke="currentColor" strokeWidth="1.5" />
              <circle cx="4.5" cy="15.75" r="1.5" stroke="currentColor" strokeWidth="1.5" />
            </svg>
          </button>

          {/* Backdrop */}
          {isOpen && (
            <div
              onClick={() => setIsOpen(false)}
              style={{
                position: 'fixed',
                inset: 0,
                backgroundColor: colors.scrim,
                zIndex: zIndex.modal - 1,
                pointerEvents: 'auto',
                animation: 'mtr-toolbar-fade-in 200ms ease-out',
              }}
            />
          )}

          {/* Bottom sheet */}
          {isOpen && (
            <div
              ref={panelRef}
              style={{
                position: 'absolute',
                bottom: 0,
                left: 0,
                right: 0,
                zIndex: zIndex.modal,
                pointerEvents: 'auto',
                backgroundColor: colors.surface.light,
                borderTop: `1px solid ${colors.border.lowEmphasis.onLight}`,
                borderRadius: `${borderRadiusSemantics.card} ${borderRadiusSemantics.card} 0 0`,
                boxShadow: shadowSemantics.dropdown,
                display: 'flex',
                flexDirection: 'column',
                gap: spacing.sm,
                padding: `${spacing.xs} ${spacing.md} ${spacing.lg}`,
                animation: 'mtr-toolbar-slide-up 250ms cubic-bezier(0.32, 0.72, 0, 1)',
              }}
            >
              {/* Drag handle */}
              <div style={{ display: 'flex', justifyContent: 'center', padding: `${spacing.xs} 0` }}>
                <div style={{ width: '36px', height: '4px', borderRadius: '2px', backgroundColor: colors.border.lowEmphasis.onLight }} />
              </div>
              {buildPanelContents(isMobile)}
            </div>
          )}
        </div>
      </div>
    )
  }

  // ─── Desktop: original fixed floating panel ───
  return (
    <>
      {/* Trigger button */}
      <button
        ref={buttonRef}
        onClick={() => setIsOpen(!isOpen)}
        aria-label="Prototype dev tools"
        aria-expanded={isOpen}
        style={{
          position: 'fixed',
          bottom: spacing.xl,
          left: spacing.xl,
          zIndex: zIndex.modal,
          width: '40px',
          height: '40px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: isOpen ? colors.brand.default : colors.scrim,
          color: colors.text.highEmphasis.onDark,
          border: 'none',
          borderRadius: '50%',
          cursor: 'pointer',
          boxShadow: shadowSemantics.dropdown,
          transition: 'background-color 150ms ease-out',
        }}
      >
        <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden="true">
          <path d="M6.75 2.25h4.5M6.75 9h4.5M6.75 15.75h4.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
          <circle cx="4.5" cy="2.25" r="1.5" stroke="currentColor" strokeWidth="1.5" />
          <circle cx="13.5" cy="9" r="1.5" stroke="currentColor" strokeWidth="1.5" />
          <circle cx="4.5" cy="15.75" r="1.5" stroke="currentColor" strokeWidth="1.5" />
        </svg>
      </button>

      {/* Floating panel */}
      {isOpen && (
        <div
          ref={panelRef}
          style={{
            position: 'fixed',
            bottom: '74px',
            left: spacing.xl,
            zIndex: zIndex.modal,
            width: '280px',
            backgroundColor: colors.surface.light,
            border: `1px solid ${colors.border.lowEmphasis.onLight}`,
            borderRadius: borderRadiusSemantics.card,
            boxShadow: shadowSemantics.dropdown,
            display: 'flex',
            flexDirection: 'column',
            gap: spacing.sm,
            padding: spacing.sm,
            animation: 'mtr-toolbar-panel-in 200ms ease-out',
          }}
        >
          {buildPanelContents(isMobile)}
        </div>
      )}
    </>
  )
}
