'use client'

import { ComponentProps } from 'react'
import { GeistProvider, CssBaseline } from '@geist-ui/core'

type ThemeProviderProps = ComponentProps<'div'>

function ThemeProvider({
  children
}: ThemeProviderProps) {
  return (
    <GeistProvider>
      <CssBaseline />
      {children}
    </GeistProvider>
  )
}
export default ThemeProvider
