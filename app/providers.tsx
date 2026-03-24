'use client'

import { SwitchableThemeProvider } from '@/styles/themes'

export function Providers({ children }: { children: React.ReactNode }) {
  return <SwitchableThemeProvider>{children}</SwitchableThemeProvider>
}
