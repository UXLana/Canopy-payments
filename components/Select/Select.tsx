'use client'

import React, { forwardRef, useState, useRef, useEffect, useCallback } from 'react'
import {
  colors,
  spacing,
  typography,
  fontFamilies,
  fontWeights,
  borderRadiusSemantics,
  shadowSemantics,
  transitionPresets,
  zIndex,
  shadows,
} from '@/styles/design-tokens'

export interface SelectOption {
  value: string
  label: string
  disabled?: boolean
}

export interface SelectProps {
  label?: string
  options: SelectOption[]
  value?: string
  defaultValue?: string
  onChange?: (value: string) => void
  placeholder?: string
  size?: 'sm' | 'md' | 'lg'
  error?: boolean
  errorMessage?: string
  helperText?: string
  disabled?: boolean
  fullWidth?: boolean
  'aria-label'?: string
  style?: React.CSSProperties
}

export const Select = forwardRef<HTMLDivElement, SelectProps>(
  (
    {
      label,
      options,
      value: controlledValue,
      defaultValue,
      onChange,
      placeholder = 'Select an option',
      size = 'md',
      error = false,
      errorMessage,
      helperText,
      disabled = false,
      fullWidth = false,
      'aria-label': ariaLabel,
      style,
    },
    ref,
  ) => {
    const [internalValue, setInternalValue] = useState(defaultValue ?? '')
    const [isOpen, setIsOpen] = useState(false)
    const [focusedIndex, setFocusedIndex] = useState(-1)
    const [isFocusVisible, setIsFocusVisible] = useState(false)
    const containerRef = useRef<HTMLDivElement>(null)
    const listRef = useRef<HTMLUListElement>(null)

    const value = controlledValue !== undefined ? controlledValue : internalValue
    const selectedOption = options.find((o) => o.value === value)

    const sizes = {
      sm: { height: '32px', fontSize: typography.body.sm.fontSize, padding: `0 ${spacing.xs}` },
      md: { height: '40px', fontSize: typography.body.md.fontSize, padding: `0 ${spacing.sm}` },
      lg: { height: '48px', fontSize: typography.body.lg.fontSize, padding: `0 ${spacing.md}` },
    }

    const s = sizes[size]

    const handleSelect = useCallback(
      (optionValue: string) => {
        if (controlledValue === undefined) setInternalValue(optionValue)
        onChange?.(optionValue)
        setIsOpen(false)
        setFocusedIndex(-1)
      },
      [controlledValue, onChange],
    )

    const handleKeyDown = useCallback(
      (e: React.KeyboardEvent) => {
        if (disabled) return
        const enabledOptions = options.filter((o) => !o.disabled)

        switch (e.key) {
          case 'Enter':
          case ' ':
            e.preventDefault()
            if (isOpen && focusedIndex >= 0) {
              handleSelect(enabledOptions[focusedIndex]?.value ?? '')
            } else {
              setIsOpen(true)
            }
            break
          case 'ArrowDown':
            e.preventDefault()
            if (!isOpen) {
              setIsOpen(true)
              setFocusedIndex(0)
            } else {
              setFocusedIndex((i) => Math.min(i + 1, enabledOptions.length - 1))
            }
            break
          case 'ArrowUp':
            e.preventDefault()
            if (isOpen) {
              setFocusedIndex((i) => Math.max(i - 1, 0))
            }
            break
          case 'Escape':
            e.preventDefault()
            setIsOpen(false)
            setFocusedIndex(-1)
            break
          case 'Tab':
            setIsOpen(false)
            setFocusedIndex(-1)
            break
        }
      },
      [disabled, isOpen, focusedIndex, options, handleSelect],
    )

    // Close on outside click
    useEffect(() => {
      if (!isOpen) return
      const handler = (e: MouseEvent) => {
        if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
          setIsOpen(false)
          setFocusedIndex(-1)
        }
      }
      document.addEventListener('mousedown', handler)
      return () => document.removeEventListener('mousedown', handler)
    }, [isOpen])

    // Scroll focused item into view
    useEffect(() => {
      if (isOpen && focusedIndex >= 0 && listRef.current) {
        const items = listRef.current.querySelectorAll('[role="option"]')
        items[focusedIndex]?.scrollIntoView({ block: 'nearest' })
      }
    }, [focusedIndex, isOpen])

    const borderColor = error
      ? colors.status.important
      : isOpen
        ? colors.focusBorder.onLight
        : colors.border.lowEmphasis.onLight

    return (
      <div
        ref={ref}
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: spacing['2xs'],
          width: fullWidth ? '100%' : 'auto',
          minWidth: fullWidth ? undefined : '200px',
          ...style,
        }}
      >
        {label && (
          <label
            style={{
              fontFamily: fontFamilies.body,
              fontSize: typography.label.sm.fontSize,
              fontWeight: fontWeights.medium,
              lineHeight: typography.label.sm.lineHeight,
              color: disabled ? colors.text.disabled.onLight : colors.text.highEmphasis.onLight,
            }}
          >
            {label}
          </label>
        )}

        <div ref={containerRef} style={{ position: 'relative' }}>
          <button
            type="button"
            role="combobox"
            aria-expanded={isOpen}
            aria-haspopup="listbox"
            aria-label={ariaLabel ?? label}
            aria-invalid={error}
            disabled={disabled}
            onClick={() => !disabled && setIsOpen(!isOpen)}
            onKeyDown={handleKeyDown}
            onFocus={(e) => {
              if (e.target.matches(':focus-visible')) setIsFocusVisible(true)
            }}
            onBlur={() => setIsFocusVisible(false)}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              width: '100%',
              height: s.height,
              padding: s.padding,
              paddingRight: spacing.xs,
              fontFamily: fontFamilies.body,
              fontSize: s.fontSize,
              fontWeight: fontWeights.regular,
              color: selectedOption
                ? colors.text.highEmphasis.onLight
                : colors.text.lowEmphasis.onLight,
              backgroundColor: disabled
                ? colors.surface.disabled.onLight
                : colors.surface.light,
              border: `1px solid ${borderColor}`,
              borderRadius: borderRadiusSemantics.input,
              cursor: disabled ? 'not-allowed' : 'pointer',
              transition: `border-color ${transitionPresets.default}`,
              outline: isFocusVisible
                ? `2px solid ${colors.focusBorder.onLight}`
                : 'none',
              outlineOffset: '2px',
              opacity: disabled ? 0.5 : 1,
              boxSizing: 'border-box',
              textAlign: 'left',
            }}
          >
            <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
              {selectedOption?.label ?? placeholder}
            </span>
            <svg
              width={16}
              height={16}
              viewBox="0 0 16 16"
              fill="none"
              aria-hidden="true"
              style={{
                flexShrink: 0,
                transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)',
                transition: `transform ${transitionPresets.fast}`,
              }}
            >
              <path
                d="M4 6L8 10L12 6"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>

          {isOpen && (
            <ul
              ref={listRef}
              role="listbox"
              aria-label={ariaLabel ?? label ?? 'Options'}
              style={{
                position: 'absolute',
                top: '100%',
                left: 0,
                right: 0,
                marginTop: spacing['2xs'],
                padding: spacing['2xs'],
                backgroundColor: colors.surface.light,
                border: `1px solid ${colors.border.lowEmphasis.onLight}`,
                borderRadius: borderRadiusSemantics.card,
                boxShadow: shadows.lg,
                zIndex: zIndex.dropdown,
                listStyle: 'none',
                maxHeight: '240px',
                overflowY: 'auto',
                boxSizing: 'border-box',
              }}
            >
              {options.map((option, index) => {
                const isSelected = option.value === value
                const isFocused = index === focusedIndex
                return (
                  <li
                    key={option.value}
                    role="option"
                    aria-selected={isSelected}
                    aria-disabled={option.disabled}
                    onClick={() => !option.disabled && handleSelect(option.value)}
                    onMouseEnter={() => !option.disabled && setFocusedIndex(index)}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      padding: `${spacing.xs} ${spacing.sm}`,
                      fontFamily: fontFamilies.body,
                      fontSize: s.fontSize,
                      fontWeight: isSelected ? fontWeights.medium : fontWeights.regular,
                      color: option.disabled
                        ? colors.text.disabled.onLight
                        : colors.text.highEmphasis.onLight,
                      backgroundColor: isFocused
                        ? colors.hover.onLight
                        : isSelected
                          ? colors.selectedHighlight
                          : 'transparent',
                      borderRadius: borderRadiusSemantics.input,
                      cursor: option.disabled ? 'not-allowed' : 'pointer',
                      transition: `background-color ${transitionPresets.fast}`,
                    }}
                  >
                    {option.label}
                  </li>
                )
              })}
            </ul>
          )}
        </div>

        {(errorMessage || helperText) && (
          <span
            style={{
              fontFamily: fontFamilies.body,
              fontSize: typography.body.xs.fontSize,
              lineHeight: typography.body.xs.lineHeight,
              color: error ? colors.status.important : colors.text.lowEmphasis.onLight,
            }}
            role={error ? 'alert' : undefined}
          >
            {error ? errorMessage : helperText}
          </span>
        )}
      </div>
    )
  },
)

Select.displayName = 'Select'
